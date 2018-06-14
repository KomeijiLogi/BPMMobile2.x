function prepMsg() {
    $("#fdate").val(getNowFormatDate(2));
    tapEvent();
    var xml = `<?xml version= "1.0" ?>
                  <Requests>
                      <Params>
                      <Method>GetFormPostData</Method>
                      <ProcessName>集团公司员工加班就餐汇总</ProcessName>
                      <ProcessVersion>${version}</ProcessVersion>
                      <Owner></Owner>
                      </Params>   
                  </Requests>
              `;
    $.ajax({
        type: "POST",
        url: "/api/bpm/DataProvider",
        data: { '': xml },
        beforeSend: function (XHR) {
            XHR.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem('ticket'));
        }
    }).done(function (data) {
        var provideData = JSON.parse(unescape(data.replace(/\\(u[0-9a-fA-F]{4})/gm, '%$1')));
        console.log(provideData);
        var item = provideData.Tables[0].Rows[0];
        $("#fhzr").val(item.fhzr);
     


    }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
        if (XMLHttpRequest.status == "401") {
            mui.alert('授权过期，请重新打开页面');;
        } else if (XMLHttpRequest.status == "500") {
            mui.alert('服务器内部错误');
        }

        });
    initOrgMsg();
}

function tapEvent() {


    var fjcstdata = [
        {
            value: '',
            text: '骨科大食堂'
        },
        {
            value: '',
            text: '骨科小食堂'
        },
        {
            value: '',
            text: '医用材料大食堂'
        },
        {
            value: '',
            text: '马山大食堂'
        },
        {
            value: '',
            text: '马山小食堂'
        },
        {
            value: '',
            text: '五号门大食堂'
        },
        {
            value: '',
            text: '五号门小食堂'
        },
        {
            value: '',
            text: '五号门饺子馆'
        },
        {
            value: '',
            text: '八号门大食堂'
        },
        {
            value: '',
            text: '八号门小食堂'
        },
        {
            value: '',
            text: '一号门大食堂'
        },
        {
            value: '',
            text: '一号门洁瑞办公楼大食堂'
        },
        {
            value: '',
            text: '二号门大食堂'
        },
        {
            value: '',
            text: '二号门小食堂'
        },
        {
            value: '',
            text: '三号门大食堂'
        },
        {
            value: '',
            text: '三号门小食堂'
        }


    ];
    showPicker('fjcst', fjcstdata);


    $("#tjmx").on('tap', () => {
        var li = `
                   <div id="mx" class="mui-card">
                        <div class="mui-input-row itemtitle">
                            <label>明细列表项</label>
                            <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>
                        </div>
                        <div class="mui-row cutOffLine">
                            <div class="mui-col-xs-8" style="dsiplay:flex;">
                                <label>就餐时间</label>
                                <input type="datetime-local" id="fjc_rq"/>
                            </div>
                             <div class="mui-col-xs-4" style="dsiplay:flex;">
                                 <label>餐别<i style="color:red;">*</i></label>
                                 <input type="text" id="fcb" placeholder="请填写"/>
                             </div>                             
                        </div>  
                        <div class="mui-row cutOffLine">
                            <div class="mui-col-xs-4" style="display:flex;">
                                 <label>申请人数<i style="color:red;">*</i></label>
                                 <input type="number" id="fsqjcrs" placeholder="请填写"/> 
                            </div>
                            <div class="mui-col-xs-4" style="display:flex;">
                                 <label>实际人数<i style="color:red;">*</i></label>
                                 <input type="number" id="fsjjcrs" placeholder="请填写"/>   
                            </div>
                            <div class="mui-col-xs-4" style="display:flex;">
                                  <label>实际就餐率</label>
                                  <input type="number" id="fsjjcl" readonly />
                            </div>
                         </div> 
                         <div class="mui-row cutOffLine">
                             <div class="mui-col-xs-6" style="display:flex;">
                                <label>餐标</label>
                                <input type="number" id="fcbiao" placeholder="请填写"/>
                             </div>
                             <div class="mui-col-xs-6" style="display:flex;">
                                 <label>金额</label>
                                 <input type="number" id="fjc_je" readonly value="0"/> 
                             </div>
                         </div>
                  </div>
                 `;
        $("#mxlist").append(li);
        $("#mxlist").find("#fsqjcrs,#fsjjcrs").each(function () {
            $(this).on('input', function () {
                calcPer(this);
            });
        });
    });
    $(".mui-icon-left-nav").on('tap', function () {
        $("#wrapper").show();
        $("#selector").hide();

    });
    $("#fsqgs").on('tap', () => {
        $("#wrapper").hide();
        $("#selector").show();
    });
}
function deleteItem(context) {
    var btnArray = ['否', '是'];
    mui.confirm('确认删除？', '', btnArray, function (e) {
        if (e.index == 1) {
            $(context).parent().parent().remove();
            calcTotal();
        }
    });


}
//计算百分比
function calcPer(context) {

    var fsqjcrs = parseFloat($(context).parent().parent().find("#fsqjcrs").val());
    var fsjjcrs = parseFloat($(context).parent().parent().find("#fsjjcrs").val());
    var fsjjcl = 0;
    if ((!isNaN(fsqjcrs)) && (!isNaN(fsjjcrs))) {
        fsjjcl = ((fsqjcrs / fsjjcrs) * 100).toFixed(2);
    }
    $(context).parent().parent().find("#fsjjcl").val(fsjjcl);
    calcTotal();
}

//计算合计
function calcTotal() {

    var fhj_sqjcrs = 0;
    var fhj_sjjcrs = 0;
    var fh_sjjcl = 0;
    var fhj_je = 0;

    $("#mxlist").find("#mx").each(function () {
        var fsqjcrs = parseFloat($(this).find("#fsqjcrs").val());
        var fsjjcrs = parseFloat($(this).find("#fsjjcrs").val());
        var fsjjcl = parseFloat($(this).find("#fsjjcl").val());
        var fjc_je = parseFloat($(this).find("#fjc_je").val());
        fsqjcrs = isNaN(fsqjcrs) ? 0 : fsqjcrs;
        fsjjcrs = isNaN(fsjjcrs) ? 0 : fsjjcrs;
        fsjjcl = isNaN(fsjjcl) ? 0 : fsjjcl;
        fjc_je = isNaN(fjc_je) ? 0 : fjc_je;

        fhj_sqjcrs += fsqjcrs;
        fhj_sjjcrs += fsjjcrs;
        fh_sjjcl += fsjjcl;
        fhj_je += fjc_je;
    });
    $("#fhj_sqjcrs").val(fhj_sqjcrs);
    $("#fhj_sjjcrs").val(fhj_sjjcrs);
    $("#fh_sjjcl").val(fh_sjjcl);
    $("#fhj_je").val(fhj_je);

}

function prepIndexedList() {

    var header = document.querySelector('header.mui-bar');
    var list = document.querySelector('#list');
    var done = document.querySelector('#done');
    //计算高度 
    list.style.height = (document.body.offsetHeight - header.offsetHeight) + 'px';
    //create
    window.indexedList = new mui.IndexedList(list);

    done.addEventListener('tap', function () {
        var checkboxArray = [].slice.call(list.querySelectorAll('input[type="radio"]'));
        var checkedValues = [];
        var checkedObjs = [];
        checkboxArray.forEach(function (box) {
            if (box.checked) {
                checkedValues.push(box.parentNode.innerText);
                var cobj = {
                    fbmmc: $(box).data('fbmmc'),
                    OUFullName: $(box).data('oufullname'),
                    OUCode: $(box).data('oucode'),
                    fsname: $(box).data('fsname')
                };
                checkedObjs.push(cobj);
                //console.log(checkedObjs);
                //取消选中，防止再次进入列表中会选中某一项
                box.checked = !box.checked;

            }
        });
        if (checkedValues.length > 0) {
            $("#fsqgs").val(checkedValues[0]);

            $("#selector").hide();
            $("#wrapper").show();

        } else {

        }


    }, false);

    mui('.mui-indexed-list-inner').on('change', 'input', function () {
        var count = list.querySelectorAll('input[type="radio"]:checked').length;
        var value = count ? "完成(" + count + ")" : "完成";
        done.innerHTML = value;
        if (count) {
            if (done.classList.contains("mui-disabled")) {
                done.classList.remove("mui-disabled");
            }
        } else {
            if (!done.classList.contains("mui-disabled")) {
                done.classList.add("mui-disabled");
            }
        }
    });
}

function initOrgMsg() {
    var xml = `<?xml version= "1.0" ?>
                    <Requests>
                      <Params>
                       <DataSource>BPMDATA</DataSource>
                       <ID>erploud_公用_获取组织</ID>
                       <Type>1</Type>
                       <Method>GetUserDataProcedure</Method>
                       <ProcedureName>erploud_公用_获取组织</ProcedureName>
                       <Filter><code>01</code></Filter>
                     </Params>
                   </Requests>
              `;
    $.ajax({
        type: "POST",
        url: "/api/bpm/DataProvider",
        data: { '': xml },

        beforeSend: function (XHR) {
            XHR.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem('ticket'));
        }

    }).done(function (data) {
        var provideData = JSON.parse(unescape(data.replace(/\\(u[0-9a-fA-F]{4})/gm, '%$1')));
        console.log(provideData);

        var item = provideData.Tables[0].Rows;
        console.log(item);
        var li = ``;
        for (var i = 0; i < item.length; i++) {
            li += `<li data-value="" data-tags="" class="mui-table-view-cell mui-indexed-list-item mui-radio mui-left">
                       <input type="radio" name="checkbox" data-fbmmc="${item[i].ouname}"
                         data-oufullname="${item[i].fname}" data-oucode="${item[i].code}"
                         data-fsname="${item[i].fsname}" />${item[i].ouname}
                    </li>`;

        }
        $("#datalist").append(li);
    }).fail(function (e) {

    }).then(function () {
        prepIndexedList();
    });
}

function initData(data, flag) {
    var item = data.FormDataSet.BPM_WGJTJBJCHZ_A[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.fbillno);
    }
    $("#fhzr").val(item.fhzr);
    $("#fdate").val(FormatterTimeYMS(item.fdate));
    $("#fksrq").val(FormatterTimeYMS(item.fksrq));
    $("#fjsrq").val(FormatterTimeYMS(item.fjsrq));
    $("#fsqgs").val(item.fsqgs);
    $("#fjcst").val(item.fjcst);
    $("#fbz").val(item.fbz);
    $("#fhj_sqjcrs").val(item.fhj_sqjcrs);
    $("#fhj_sjjcrs").val(item.fhj_sjjcrs);
    $("#fh_sjjcl").val(item.fh_sjjcl);
    $("#fhj_je").val(item.fhj_je);

    var item_c = data.FormDataSet.BPM_WGJTJBJCHZ_B;
    for (var i = 0; i < item_c.length; i++) {
        itemidArr.push(item_c[i].itemid);
        var li = `
                   <div id="mx" class="mui-card">
                        <div class="mui-input-row itemtitle">
                            <label>明细列表项</label>
                            <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>
                        </div>
                        <div class="mui-row cutOffLine">
                            <div class="mui-col-xs-8" style="dsiplay:flex;">
                                <label>就餐时间</label>
                                <input type="datetime-local" id="fjc_rq" readonly value="${item_c[i].fjc_rq}"/>
                            </div>
                             <div class="mui-col-xs-4" style="dsiplay:flex;">
                                 <label>餐别<i style="color:red;">*</i></label>
                                 <input type="text" id="fcb" readonly value="${item_c[i].fcb}"/>
                             </div>                             
                        </div>  
                        <div class="mui-row cutOffLine">
                            <div class="mui-col-xs-4" style="display:flex;">
                                 <label>申请人数<i style="color:red;">*</i></label>
                                 <input type="number" id="fsqjcrs" readonly value="${item_c[i].fsqjcrs}"/> 
                            </div>
                            <div class="mui-col-xs-4" style="display:flex;">
                                 <label>实际人数<i style="color:red;">*</i></label>
                                 <input type="number" id="fsjjcrs" readonly value="${item_c[i].fsjjcrs}"/>   
                            </div>
                            <div class="mui-col-xs-4" style="display:flex;">
                                  <label>实际就餐率</label>
                                  <input type="number" id="fsjjcl" readonly value="${item_c[i].fsjjcl}"/>
                            </div>
                         </div> 
                         <div class="mui-row cutOffLine">
                             <div class="mui-col-xs-6" style="display:flex;">
                                <label>餐标</label>
                                <input type="number" id="fcbiao" readonly value="${item_c[i].fcbiao}"/>
                             </div>
                             <div class="mui-col-xs-6" style="display:flex;">
                                 <label>金额</label>
                                 <input type="number" id="fjc_je" readonly value="${item_c[i].fjc_je}"/> 
                             </div>
                         </div>
                  </div>
                 `;
        $("#mxlist").append(li);
    }


}
function nodeControllerExp(NodeName) {
    if (String(NodeName).match('开始') != null) {
        $("#mxlist").find("#fsqjcrs,#fsjjcrs").each(function () {
            $(this).on('input', function () {
                calcPer(this);
            });
        });
        $("#mxlist").find('span').each(function () {
            $(this).show();
        });
        $("#mxlist").find("#fjc_rq,#fcb,#fsqjcrs,#fsjjcrs,#fcbiao").each(function () {
            $(this).removeAttr('readonly');
        });
        tapEvent();
        initOrgMsg();
        $("#fksrq,#fjsrq,#fbz").removeAttr('readonly');
    }
}


class Mx {
    constructor(fjc_rq, fcb, fsqjcrs, fsjjcrs, fsjjcl, fcbiao, fjc_je) {
        this.fjc_rq = fjc_rq;
        this.fcb = fcb;
        this.fsqjcrs = fsqjcrs;
        this.fsjjcrs = fsjjcrs;
        this.fsjjcl = fsjjcl;
        this.fcbiao = fcbiao;
        this.fjc_je = fjc_je;
    }
   
}

function Save() {

    var fhzr = $("#fhzr").val();
    var fdate = $("#fdate").val();
    var fksrq = $("#fksrq").val();
    var fjsrq = $("#fjsrq").val();
    var fsqgs = $("#fsqgs").val();
    var fjcst = $("#fjcst").val();
    var fbz = $("#fbz").val();
    var fhj_sqjcrs = $("#fhj_sqjcrs").val();
    var fhj_sjjcrs = $("#fhj_sjjcrs").val();
    var fh_sjjcl = $("#fh_sjjcl").val();
    var fhj_je = $("#fhj_je").val();
    if (!fksrq) {
        mui.toast('请填写开始日期');
        return;
    }
    if (!fjsrq) {
        mui.toast('请填写结束日期');
        return;
    }
    if (!fsqgs) {
        mui.toast('请选择申请公司');
        return;
    }
    if (!fjcst) {
        mui.toast('请选择就餐食堂');
        return;
    }

    var mxflag = false;
    var mxlistArr = [];
    $("#mxlist").find("#mx").each(function () {
        var fjc_rq = $(this).find("#fjc_rq").val();
        var fcb = $(this).find("#fcb").val();
        var fsqjcrs = $(this).find("#fsqjcrs").val();
        var fsjjcrs = $(this).find("#fsjjcrs").val();
        var fsjjcl = $(this).find("#fsjjcl").val();
        var fcbiao = $(this).find("#fcbiao").val();
        var fjc_je = $(this).find("#fjc_je").val();

        var mx = new Mx(fjc_rq, fcb, fsqjcrs, fsjjcrs, fsjjcl, fcbiao, fjc_je);
        mxlistArr.push(mx);
    });
    var btnArry = ["取消", "确定"];
    mui.confirm('即将提交，是否确定？', '提交确认提醒', btnArry, function (e) {
        if (e.index == 1) {
            var xml = `<?xml version="1.0"?>
                        <XForm>
                            <Header>
                                <Method>Post</Method>
                                <ProcessName>集团公司员工加班就餐汇总</ProcessName>
                                <ProcessVersion>${version}</ProcessVersion>
                                <DraftGuid></DraftGuid>
                                <OwnerMemberFullName>${BPMOU}</OwnerMemberFullName>
                                <Action>提交</Action>
                                <Comment></Comment>
                                <UrlParams></UrlParams>
                                <ConsignEnabled>false</ConsignEnabled>
                                <ConsignUsers>[]</ConsignUsers>
                                <ConsignRoutingType>Parallel</ConsignRoutingType>
                                <ConsignReturnType>Return</ConsignReturnType>
                                <InviteIndicateUsers>[]</InviteIndicateUsers>
                                <Context>{&quot;Routing&quot;:{}}</Context>
                            </Header>
                           <FormData>
                           `;
            xml += ` 
                    <BPM_WGJTJBJCHZ_A>
                        <fbillno>自动生成</fbillno>
                        <fhzr>${fhzr}</fhzr>
                        <fdate>${fdate}</fdate>
                        <fksrq>${fksrq}</fksrq>
                        <fjsrq>${fjsrq}</fjsrq>
                        <fsqgs>${fsqgs}</fsqgs>
                        <fjcst>${fjcst}</fjcst>
                        <fhj_sqjcrs>${fhj_sqjcrs}</fhj_sqjcrs>
                        <fhj_sjjcrs>${fhj_sjjcrs}</fhj_sjjcrs>
                        <fh_sjjcl>${fh_sjjcl}</fh_sjjcl>
                        <fhj_je>${fhj_je}</fhj_je>
                        <fbz>${fbz}</fbz>
                    </BPM_WGJTJBJCHZ_A>
                   `;
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `
                        <BPM_WGJTJBJCHZ_B>
                            <RelationRowGuid>${i+1}</RelationRowGuid>
                            <RowPrimaryKeys></RowPrimaryKeys>
                            <fentryno>${i + 1}</fentryno>
                            <fjc_rq>${mxlistArr[i].fjc_rq}</fjc_rq>
                            <fcb>${mxlistArr[i].fcb}</fcb>
                            <fsqjcrs>${mxlistArr[i].fsqjcrs}</fsqjcrs>
                            <fsjjcrs>${mxlistArr[i].fsjjcrs}</fsjjcrs>
                            <fsjjcl>${mxlistArr[i].fsjjcl}</fsjjcl>
                            <fcbiao>${mxlistArr[i].fcbiao}</fcbiao>
                            <fjc_je>${mxlistArr[i].fjc_je}</fjc_je>
                        </BPM_WGJTJBJCHZ_B>   

                       `;
            }
            xml += `
                       </FormData>
                    </XForm>
                   `;
            PostXml(xml);
        }
    });

}

function reSave() {

    var fbillno = $("#fbillno").val();
    var pid = $("#stepId").val();


    var fhzr = $("#fhzr").val();
    var fdate = $("#fdate").val();
    var fksrq = $("#fksrq").val();
    var fjsrq = $("#fjsrq").val();
    var fsqgs = $("#fsqgs").val();
    var fjcst = $("#fjcst").val();
    var fbz = $("#fbz").val();
    var fhj_sqjcrs = $("#fhj_sqjcrs").val();
    var fhj_sjjcrs = $("#fhj_sjjcrs").val();
    var fh_sjjcl = $("#fh_sjjcl").val();
    var fhj_je = $("#fhj_je").val();
    if (!fksrq) {
        mui.toast('请填写开始日期');
        return;
    }
    if (!fjsrq) {
        mui.toast('请填写结束日期');
        return;
    }
    if (!fsqgs) {
        mui.toast('请选择申请公司');
        return;
    }
    if (!fjcst) {
        mui.toast('请选择就餐食堂');
        return;
    }

    var mxflag = false;
    var mxlistArr = [];
    $("#mxlist").find("#mx").each(function () {
        var fjc_rq = $(this).find("#fjc_rq").val();
        var fcb = $(this).find("#fcb").val();
        var fsqjcrs = $(this).find("#fsqjcrs").val();
        var fsjjcrs = $(this).find("#fsjjcrs").val();
        var fsjjcl = $(this).find("#fsjjcl").val();
        var fcbiao = $(this).find("#fcbiao").val();
        var fjc_je = $(this).find("#fjc_je").val();

        var mx = new Mx(fjc_rq, fcb, fsqjcrs, fsjjcrs, fsjjcl, fcbiao, fjc_je);
        mxlistArr.push(mx);
    });
    var btnArry = ["取消", "确定"];
    mui.confirm('即将提交，是否确定？', '提交确认提醒', btnArry, function (e) {
        if (e.index == 1) {
            var xml = `<?xml version="1.0"?>
                         <XForm>
                           <Header>
                             <Method>Process</Method>
                             <PID>${pid}</PID>
                             <Action>提交</Action>
                              <Comment></Comment>
                             <InviteIndicateUsers></InviteIndicateUsers>
                           </Header>
                           <FormData>
                       `;
            xml += ` 
                    <BPM_WGJTJBJCHZ_A>
                        <fbillno>${fbillno}</fbillno>
                        <fhzr>${fhzr}</fhzr>
                        <fdate>${fdate}</fdate>
                        <fksrq>${fksrq}</fksrq>
                        <fjsrq>${fjsrq}</fjsrq>
                        <fsqgs>${fsqgs}</fsqgs>
                        <fjcst>${fjcst}</fjcst>
                        <fhj_sqjcrs>${fhj_sqjcrs}</fhj_sqjcrs>
                        <fhj_sjjcrs>${fhj_sjjcrs}</fhj_sjjcrs>
                        <fh_sjjcl>${fh_sjjcl}</fh_sjjcl>
                        <fhj_je>${fhj_je}</fhj_je>
                        <fbz>${fbz}</fbz>
                    </BPM_WGJTJBJCHZ_A>
                   `;
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `
                        <BPM_WGJTJBJCHZ_B>
                            <RelationRowGuid>${i + 1}</RelationRowGuid>
                            <RowPrimaryKeys></RowPrimaryKeys>
                            <fentryno>${i + 1}</fentryno>
                            <fjc_rq>${mxlistArr[i].fjc_rq}</fjc_rq>
                            <fcb>${mxlistArr[i].fcb}</fcb>
                            <fsqjcrs>${mxlistArr[i].fsqjcrs}</fsqjcrs>
                            <fsjjcrs>${mxlistArr[i].fsjjcrs}</fsjjcrs>
                            <fsjjcl>${mxlistArr[i].fsjjcl}</fsjjcl>
                            <fcbiao>${mxlistArr[i].fcbiao}</fcbiao>
                            <fjc_je>${mxlistArr[i].fjc_je}</fjc_je>
                        </BPM_WGJTJBJCHZ_B>   

                       `;
            }
            xml += `
                       </FormData>
                    </XForm>
                   `;
            PostXml(xml);

        }
    });
}

function hasRead() {
    var pid = $("#stepId").val();
    var fbillno = $("#fbillno").val();
    var comment = '';
    var btnArray = ['取消', '确定'];
    mui.prompt('请选填知会意见', '可以不填', '知会意见', btnArray, function (e) {
        if (e.index == 1) {
            comment = e.value;
            var xml = `<?xml version="1.0"?>
                           <XForm>
                             <Header>
                               <Method>InformSubmit</Method>
                               <PID>${pid}</PID>
                               <Comment>${comment}</Comment>
                             </Header>
                           </XForm>
              `;
            PostXml(xml);
        }
    });
}

function AgreeOrConSign() {

    var pid = $("#stepId").val();
    var fbillno = $("#fbillno").val();
    var comment = $("#signSuggest").val();
    var nodeName = $("#nodeName").val();

    var fhzr = $("#fhzr").val();
    var fdate = $("#fdate").val();
    var fksrq = $("#fksrq").val();
    var fjsrq = $("#fjsrq").val();
    var fsqgs = $("#fsqgs").val();
    var fjcst = $("#fjcst").val();
    var fbz = $("#fbz").val();
    var fhj_sqjcrs = $("#fhj_sqjcrs").val();
    var fhj_sjjcrs = $("#fhj_sjjcrs").val();
    var fh_sjjcl = $("#fh_sjjcl").val();
    var fhj_je = $("#fhj_je").val();

    var mxlistArr = [];
    $("#mxlist").find("#mx").each(function () {
        var fjc_rq = $(this).find("#fjc_rq").val();
        var fcb = $(this).find("#fcb").val();
        var fsqjcrs = $(this).find("#fsqjcrs").val();
        var fsjjcrs = $(this).find("#fsjjcrs").val();
        var fsjjcl = $(this).find("#fsjjcl").val();
        var fcbiao = $(this).find("#fcbiao").val();
        var fjc_je = $(this).find("#fjc_je").val();

        var mx = new Mx(fjc_rq, fcb, fsqjcrs, fsjjcrs, fsjjcl, fcbiao, fjc_je);
        mxlistArr.push(mx);
    });

    var consignFlag = false;
    var consignUserId = new Array();
    var consignRoutingType;
    var consignReturnType;

    var consignUserStr;

    //加签if分支
    if (($('#signPer').val() != null) && ($('#signPer').val() != '')) {
        consignFlag = true;

        if ($('#sxsl').hasClass('mui-selected')) {
            consignRoutingType = 'Serial';

        } else if ($('#pxsl').hasClass('mui-selected')) {
            consignRoutingType = 'Parallel';
        }

        if ($('#hdbjdl').hasClass('mui-selected')) {
            consignReturnType = 'Return';
        } else if ($('#jrxjdl').hasClass('mui-selected')) {
            consignReturnType = 'Forward';
        }


        var consignAjax = $.ajax({
            type: "POST",
            url: "/api/bpm/PostAccount",
            data: { "ids": consignOpenIdArr },
            beforeSend: function (XHR) {
                XHR.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem('ticket'));

            }
        }).done(function (data, status) {
            //alert(status);
            if (status == "success") {


                for (var i = 0; i < data.data.length; i++) {
                    consignUserId.push(data.data[i].phone);
                }
                $('#consignUser').val(consignUserId);
                consignUserStr = (String)($('#consignUser').val()).split(",");

                for (var i = 0; i < consignUserStr.length; i++) {
                    consignUserStr[i] = '&quot;' + consignUserStr[i] + '&quot;';
                }
                consignUserStr = '[' + consignUserStr.toString() + ']';



            }
        }).fail(function () {

        });
    } else {


    }

    if (consignFlag) {
        consignAjax.then(function () {
            var xml = `<?xml version="1.0"?>
                     <XForm>
                     <Header>
                     <Method>Process</Method>
                     <PID>${pid}</PID>
                     <Action>同意</Action>
                     <Comment>${comment}</Comment>
            
                     <ConsignEnabled>true</ConsignEnabled>
                     <ConsignUsers>${consignUserStr}</ConsignUsers>
                     <ConsignRoutingType>${consignRoutingType}</ConsignRoutingType>
                     <ConsignReturnType>${consignReturnType}</ConsignReturnType>
                     <InviteIndicateUsers>[]</InviteIndicateUsers>
                     <Context>{&quot;Routing&quot;:{}}</Context>
                     </Header>
                     <FormData>`;
            xml += ` 
                    <BPM_WGJTJBJCHZ_A>
                        <fbillno>${fbillno}</fbillno>
                        <fhzr>${fhzr}</fhzr>
                        <fdate>${fdate}</fdate>
                        <fksrq>${fksrq}</fksrq>
                        <fjsrq>${fjsrq}</fjsrq>
                        <fsqgs>${fsqgs}</fsqgs>
                        <fjcst>${fjcst}</fjcst>
                        <fhj_sqjcrs>${fhj_sqjcrs}</fhj_sqjcrs>
                        <fhj_sjjcrs>${fhj_sjjcrs}</fhj_sjjcrs>
                        <fh_sjjcl>${fh_sjjcl}</fh_sjjcl>
                        <fhj_je>${fhj_je}</fhj_je>
                        <fbz>${fbz}</fbz>
                    </BPM_WGJTJBJCHZ_A>
                   `;
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `
                        <BPM_WGJTJBJCHZ_B>
                            <RelationRowGuid>${i + 1}</RelationRowGuid>
                            <RowPrimaryKeys>itemid=${itemidArr[i]}</RowPrimaryKeys>
                            <fentryno>${i + 1}</fentryno>
                            <fjc_rq>${mxlistArr[i].fjc_rq}</fjc_rq>
                            <fcb>${mxlistArr[i].fcb}</fcb>
                            <fsqjcrs>${mxlistArr[i].fsqjcrs}</fsqjcrs>
                            <fsjjcrs>${mxlistArr[i].fsjjcrs}</fsjjcrs>
                            <fsjjcl>${mxlistArr[i].fsjjcl}</fsjjcl>
                            <fcbiao>${mxlistArr[i].fcbiao}</fcbiao>
                            <fjc_je>${mxlistArr[i].fjc_je}</fjc_je>
                        </BPM_WGJTJBJCHZ_B>   

                       `;
            }
            xml += `
                       </FormData>
                    </XForm>
                   `;
            PostXml(xml);
        })
    } else {
        var xml = `<?xml version="1.0"?>
                   <XForm>
                   <Header>
                   <Method>Process</Method>
                   <PID>${pid}</PID>
                   <Action>同意</Action>
                   <Comment>${comment}</Comment>

                    <UrlParams></UrlParams>
                    <ConsignEnabled>false</ConsignEnabled>
                    <ConsignUsers>[]</ConsignUsers>
                    <ConsignRoutingType>Parallel</ConsignRoutingType>
                    <ConsignReturnType>Return</ConsignReturnType>

                  <InviteIndicateUsers>[]</InviteIndicateUsers>
                  <Context>{&quot;Routing&quot;:{}}</Context>
                  </Header>
                  <FormData>`;
        xml += ` 
                    <BPM_WGJTJBJCHZ_A>
                        <fbillno>${fbillno}</fbillno>
                        <fhzr>${fhzr}</fhzr>
                        <fdate>${fdate}</fdate>
                        <fksrq>${fksrq}</fksrq>
                        <fjsrq>${fjsrq}</fjsrq>
                        <fsqgs>${fsqgs}</fsqgs>
                        <fjcst>${fjcst}</fjcst>
                        <fhj_sqjcrs>${fhj_sqjcrs}</fhj_sqjcrs>
                        <fhj_sjjcrs>${fhj_sjjcrs}</fhj_sjjcrs>
                        <fh_sjjcl>${fh_sjjcl}</fh_sjjcl>
                        <fhj_je>${fhj_je}</fhj_je>
                        <fbz>${fbz}</fbz>
                    </BPM_WGJTJBJCHZ_A>
                   `;
        for (var i = 0; i < mxlistArr.length; i++) {
            xml += `
                        <BPM_WGJTJBJCHZ_B>
                            <RelationRowGuid>${i + 1}</RelationRowGuid>
                            <RowPrimaryKeys>itemid=${itemidArr[i]}</RowPrimaryKeys>
                            <fentryno>${i + 1}</fentryno>
                            <fjc_rq>${mxlistArr[i].fjc_rq}</fjc_rq>
                            <fcb>${mxlistArr[i].fcb}</fcb>
                            <fsqjcrs>${mxlistArr[i].fsqjcrs}</fsqjcrs>
                            <fsjjcrs>${mxlistArr[i].fsjjcrs}</fsjjcrs>
                            <fsjjcl>${mxlistArr[i].fsjjcl}</fsjjcl>
                            <fcbiao>${mxlistArr[i].fcbiao}</fcbiao>
                            <fjc_je>${mxlistArr[i].fjc_je}</fjc_je>
                        </BPM_WGJTJBJCHZ_B>   

                       `;
        }
        xml += `
                       </FormData>
                    </XForm>
                   `;
        PostXml(xml);

    }

}