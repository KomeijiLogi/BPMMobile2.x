function prepMsg() {

    $("#fsqrq").val(getNowFormatDate(2));
    tapEvent();
    var xml = `<?xml version= "1.0" ?>
                  <Requests>
                      <Params>
                      <Method>GetFormPostData</Method>
                      <ProcessName>集团公司员工加班就餐提报</ProcessName>
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
        $("#fsqr").val(item.fsqr);
        $("#fsqbm").val(item.fsqbm);
        $("#fssjt").val(item.fssjt);
        $("#fssgs").val(item.fssgs);


    }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
        if (XMLHttpRequest.status == "401") {
            mui.alert('授权过期，请重新打开页面');;
        } else if (XMLHttpRequest.status == "500") {
            mui.alert('服务器内部错误');
        }

    });
    initOrgMsg();
}
var fcbdata = [
    {
        value: '',
        text: '早餐'
    },
    {
        value: '',
        text: '午餐'
    },
    {
        value: '',
        text: '晚餐'
    },
    {
        value: '',
        text: '夜餐'
    },
    {
        value: '',
        text: '包间点餐（午餐）'
    },
    {
        value: '',
        text: '特殊节日午餐'
    },
    {
        value: '',
        text: '特殊节日晚餐'
    },
    {
        value: '',
        text: '饺子馆点餐'
    }
];


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

    var element = document.getElementById('fjc_st');
    var picker = new mui.PopPicker();
    picker.setData(fjcstdata);
    element.addEventListener('tap', function () {

        picker.show(function (items) {

            element.value = items[0].text;
            $("#mxlist").find("#fcb").each(function () {
                var fcb = $(this).val();
                if (String(fcb).match('早餐') != null) {
                    console.log('fcb', fcb);
                    if (String(items[0].text).match('大食堂') != null) {
                        $(this).parent().parent().find("#fcbiao").val(3.00);
                    }

                } else if (String(fcb).match('午餐') != null) {
                    if (String(items[0].text).match('大食堂') != null) {
                        $(this).parent().parent().find("#fcbiao").val(5.50);
                    } else if (String(items[0].text).match('小食堂') != null) {
                        $(this).parent().parent().find("#fcbiao").val(12.00);
                    }
                } else if (String(fcb).match('晚餐') != null) {
                    if (String(items[0].text).match('大食堂') != null) {
                        $(this).parent().parent().find("#fcbiao").val(4.50);
                    }
                } else if (String(fcb).match('夜餐') != null) {
                    if (String(items[0].text).match('大食堂') != null) {
                        $(this).parent().parent().find("#fcbiao").val(5.50);
                    }
                }
                calcMoney(this);
            });
        });

    }, false);


    $("#tjmx").on('tap', () => {
        var li = `
                   <div id="mx" class="mui-card">
                        <div class="mui-input-row itemtitle">
                            <label>明细列表项</label>
                            <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>
                        </div>
                        <div class="mui-row cutOffLine">
                             <div class="mui-col-xs-12" style="display:flex;">
                                 <label>就餐时间<i style="color:red;">*</i></label>
                                 <input type="datetime-local" id="fjc_sj" />
                             </div>
                        </div>
                        <div class="mui-row cutOffLine">
                              <div class="mui-col-xs-6" style="display:flex;">
                                 <label>就餐人数<i style="color:red;">*</i></label>  
                                 <input type="number" id="fjc_rs" placeholder="请填写"/> 
                              </div>
                              <div class="mui-col-xs-6" style="display:flex;">
                                  <label>实际人数<i style="color:red;">*</i></label>
                                  <input type="number" id="fsjjcrs" placeholder="请填写"/>
                              </div>
                        </div>
                        <div class="mui-row cutOffLine">
                            <div class="mui-col-xs-4" style="display:flex;">
                                <label>餐别<i style="color:red;">*</i></label>
                                <input type="text" id="fcb" readonly placeholder="请选择"/>  
                            </div>
                            <div class="mui-col-xs-4" style="display:flex;">
                                <label>餐标</label>
                                <input type="number" id="fcbiao" placeholder="请填写"/>
                            </div>
                            <div class="mui-col-xs-4" style="display:flex;">
                               <label>金额</label>
                               <input type="number" id="fje" value="0" readonly/>
                            </div>  
                        </div>
                        <div class="mui-row cutOffLine">
                           <div class="mui-col-xs-12" style="display:flex;">
                               <label>备注</label>
                               <input type="text" id="fbz" placeholder="请填写"/>
                           </div>
                       </div>   
                   </div>
              `;
        $("#mxlist").append(li);

        $("#mxlist").find("#fjc_rs").each(function () {
            $(this).on('input', function () {
                calcMoney(this);
            });
        });
        var picker22 = new mui.PopPicker();


        picker22.setData(fcbdata);

        $('#mxlist').find('#fcb').each(function () {

            var self = this;
            $(this).off('tap');
            $(this).on('tap', function () {

                picker22.show(function (items) {
                    self.value = (items[0].text);
                   
                    var fst = $("#fjc_st").val();
                    if (String(fst).match('大食堂') != null) {
                        if (String(items[0].text).match('早餐') != null) {
                            $(self).parent().parent().find("#fcbiao").val(3.00);

                        } else if (String(items[0].text).match('午餐') != null) {
                            $(self).parent().parent().find("#fcbiao").val(5.50);

                        } else if (String(items[0].text).match('晚餐') != null) {
                            $(self).parent().parent().find("#fcbiao").val(4.50);

                        } else if (String(items[0].text).match('夜餐') != null) {
                            $(self).parent().parent().find("#fcbiao").val(5.50);

                        }

                    } else if (String(fst).match('小食堂') != null) {
                        if (String(items[0].text).match('午餐') != null) {
                            $(self).parent().parent().find("#fcbiao").val(12.00);
                        }
                    }
                    calcMoney(self);
                });
            });
        });
    });

    $(".mui-icon-left-nav").on('tap', function () {
        $("#wrapper").show();
        $("#selector").hide();

    });
    $("#ffgs").on('tap', () => {
        $("#wrapper").hide();
        $("#selector").show();
    });

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
            $("#ffgs").val(checkedValues[0]);

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


function calcMoney(context) {
    var fjc_rs = parseFloat($(context).parent().parent().parent().find("#fjc_rs").val());
    var fcbiao = parseFloat($(context).parent().parent().parent().find("#fcbiao").val());
    var fje = 0;
    fjc_rs = isNaN(fjc_rs) ? 0 : fjc_rs;
    fcbiao = isNaN(fcbiao) ? 0 : fcbiao;
    fje = fjc_rs * fcbiao;
    $(context).parent().parent().parent().find("#fje").val(fje);
    calcTotal();
}

function calcTotal() {
    var fhj_rs = 0;
    var fhj_sjcrs = 0;
    var fhj_je = 0;

    $("#mxlist").find("#mx").each(function () {
        var fjc_rs = parseFloat($(this).find("#fjc_rs").val());
        var fsjjcrs = parseFloat($(this).find("#fsjjcrs").val());
        var fje = parseFloat($(this).find("#fje").val());

        fjc_rs = isNaN(fjc_rs) ? 0 : fjc_rs;
        fsjjcrs = isNaN(fsjjcrs) ? 0 : fsjjcrs;
        fje = isNaN(fje) ? 0 : fje;

        fhj_rs += fjc_rs;
        fhj_sjcrs += fsjjcrs;
        fhj_je += fje;
    });

    $("#fhj_rs").val(fhj_rs);
    $("#fhj_sjcrs").val(fhj_sjcrs);
    $("#fhj_je").val(fhj_je);
}

function initData(data, flag) {

    var item = data.FormDataSet.BPM_WGJTJBJCTB_A[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.fbillno);
    }
    $("#fsqr").val(item.fsqr);
    $("#fsqbm").val(item.fsqbm);
    $("#fsqrq").val(item.fsqrq);
    $("#flxfs").val(item.flxfs);
    $("#fssjt").val(item.fssjt);
    $("#fssgs").val(item.fssgs);
    $("#ffgs").val(item.ffgs);
    $("#fjc_st").val(item.fjc_st);
    $("#fhj_rs").val(item.fhj_rs);
    $("#fhj_sjcrs").val(item.fhj_sjcrs);
    $("#fhj_je").val(item.fhj_je);



    var item_c = data.FormDataSet.BPM_WGJTJBJCTB_B;
    for (var i = 0; i < item_c.length; i++) {
        itemidArr.push(item_c[i].itemid);
        var li = `
                   <div id="mx" class="mui-card">
                        <div class="mui-input-row itemtitle">
                            <label>明细列表项</label>
                            <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>
                        </div>
                        <div class="mui-row cutOffLine">
                             <div class="mui-col-xs-12" style="display:flex;">
                                 <label>就餐时间<i style="color:red;">*</i></label>
                                 <input type="datetime-local" id="fjc_sj" readonly value="${item_c[i].fjc_sj}"/>
                             </div>
                        </div>
                        <div class="mui-row cutOffLine">
                              <div class="mui-col-xs-6" style="display:flex;">
                                 <label>就餐人数<i style="color:red;">*</i></label>  
                                 <input type="number" id="fjc_rs" readonly value="${item_c[i].fjc_rs}"/> 
                              </div>
                              <div class="mui-col-xs-6" style="display:flex;">
                                  <label>实际人数<i style="color:red;">*</i></label>
                                  <input type="number" id="fsjjcrs" readonly value="${item_c[i].fsjjcrs}"/>
                              </div>
                        </div>
                        <div class="mui-row cutOffLine">
                            <div class="mui-col-xs-4" style="display:flex;">
                                <label>餐别<i style="color:red;">*</i></label>
                                <input type="text" id="fcb" readonly value="${item_c[i].fcb}"/>  
                            </div>
                            <div class="mui-col-xs-4" style="display:flex;">
                                <label>餐标</label>
                                <input type="number" id="fcbiao" readonly value="${item_c[i].fcbiao}"/>
                            </div>
                            <div class="mui-col-xs-4" style="display:flex;">
                               <label>金额</label>
                               <input type="number" id="fje"  readonly value="${item_c[i].fje}"/>
                            </div>  
                        </div>
                        <div class="mui-row cutOffLine">
                           <div class="mui-col-xs-12" style="display:flex;">
                               <label>备注</label>
                               <input type="text" id="fbz" readonly value="${item_c[i].fbz}"/>
                           </div>
                       </div>   
                   </div>
              `;
        $("#mxlist").append(li);
    }

}

function nodeControllerExp(NodeName) {

    if (String(NodeName).match('开始') != null) {

        $("#mxlist").find('span').each(function () {
            $(this).show();
        });
        tapEvent();

        var picker22 = new mui.PopPicker();


        picker22.setData(fcbdata);

        $('#mxlist').find('#fcb').each(function () {

            var self = this;
            $(this).off('tap');
            $(this).on('tap', function () {

                picker22.show(function (items) {
                    self.value = (items[0].text);

                    var fst = $("#fjc_st").val();
                    if (String(fst).match('大食堂') != null) {
                        if (String(items[0].text).match('早餐') != null) {
                            $(self).parent().parent().find("#fcbiao").val(3.00);

                        } else if (String(items[0].text).match('午餐') != null) {
                            $(self).parent().parent().find("#fcbiao").val(5.50);

                        } else if (String(items[0].text).match('晚餐') != null) {
                            $(self).parent().parent().find("#fcbiao").val(4.50);

                        } else if (String(items[0].text).match('夜餐') != null) {
                            $(self).parent().parent().find("#fcbiao").val(5.50);

                        }

                    } else if (String(fst).match('小食堂') != null) {
                        if (String(items[0].text).match('午餐') != null) {
                            $(self).parent().parent().find("#fcbiao").val(12.00);
                        }
                    }
                    calcMoney(self);
                });
            });
        });
        $("#mxlist").find('input,textarea').each(function () {
            $(this).removeAttr('readonly');
        });
        $("#flxfs").removeAttr('readonly');
    }

}
class Mx {
    constructor(fjc_sj, fjc_rs, fsjjcrs, fcb, fcbiao, fje, fbz) {
        this.fjc_sj = fjc_sj;
        this.fjc_rs = fjc_rs;
        this.fsjjcrs = fsjjcrs;
        this.fcb = fcb;
        this.fcbiao = fcbiao;
        this.fje = fje;
        this.fbz = fbz;
    }
}
function Save() {
    var fsqr = $("#fsqr").val();
    var fsqbm = $("#fsqbm").val();
    var fsqrq = $("#fsqrq").val();
    var flxfs = $("#flxfs").val();
    var fssjt = $("#fssjt").val();
    var fssgs = $("#fssgs").val();
    var ffgs = $("#ffgs").val();
    var fjc_st = $("#fjc_st").val();
    var fhj_rs = $("#fhj_rs").val();
    var fhj_sjcrs = $("#fhj_sjcrs").val();
    var fhj_je = $("#fhj_je").val();

    var mxlistArr = [];
    $("#mxlist").find("#mx").each(function () {
        var fjc_sj = $(this).find("#fjc_sj").val();
        var fjc_rs = $(this).find("#fjc_rs").val();
        var fsjjcrs = $(this).find("#fsjjcrs").val();
        var fcb = $(this).find("#fcb").val();
        var fcbiao = $(this).find("#fcbiao").val();
        var fje = $(this).find("#fje").val();
        var fbz = $(this).find("#fbz").val();
        var mx = new Mx(fjc_sj, fjc_rs, fsjjcrs, fcb, fcbiao, fje, fbz);
        mxlistArr.push(mx);

    });

    var btnArry = ["取消", "确定"];
    mui.confirm('即将提交，是否确定？', '提交确认提醒', btnArry, function (e) {
        if (e.index == 1) {
            var xml = `<?xml version="1.0"?>
                        <XForm>
                            <Header>
                                <Method>Post</Method>
                                <ProcessName>集团公司员工加班就餐提报</ProcessName>
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
                    <BPM_WGJTJBJCTB_A>
                        <fbillno>自动生成</fbillno>
                        <fsqr>${fsqr}</fsqr>
                        <fsqbm>${fsqbm}</fsqbm>
                        <fsqrq>${fsqrq}</fsqrq>
                        <flxfs>${flxfs}</flxfs>
                        <fssjt>${fssjt}</fssjt>
                        <fssgs>${fssgs}</fssgs>
                        <ffgs>${ffgs}</ffgs>
                        <fjc_st>${fjc_st}</fjc_st>
                        <fhj_rs>${fhj_rs}</fhj_rs>
                        <fhj_sjcrs>${fhj_sjcrs}</fhj_sjcrs>
                        <fhj_je>${fhj_je}</fhj_je>
                        <FJ>201608190109</FJ>
                    </BPM_WGJTJBJCTB_A>
                   `;
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `

                        <BPM_WGJTJBJCTB_B>
                            <RelationRowGuid>${i+1}</RelationRowGuid>
                            <RowPrimaryKeys></RowPrimaryKeys>
                            <fentryno>${i + 1}</fentryno>
                            <fjc_sj>${mxlistArr[i].fjc_sj}</fjc_sj>
                            <fjc_rs>${mxlistArr[i].fjc_rs}</fjc_rs>
                            <fsjjcrs>${mxlistArr[i].fsjjcrs}</fsjjcrs>
                            <fcb>${mxlistArr[i].fcb}</fcb>
                            <fcbiao>${mxlistArr[i].fcbiao}</fcbiao>
                            <fje>${mxlistArr[i].fje}</fje>
                            <fbz>${mxlistArr[i].fbz}</fbz>
                        </BPM_WGJTJBJCTB_B>
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

    var fsqr = $("#fsqr").val();
    var fsqbm = $("#fsqbm").val();
    var fsqrq = $("#fsqrq").val();
    var flxfs = $("#flxfs").val();
    var fssjt = $("#fssjt").val();
    var fssgs = $("#fssgs").val();
    var ffgs = $("#ffgs").val();
    var fjc_st = $("#fjc_st").val();
    var fhj_rs = $("#fhj_rs").val();
    var fhj_sjcrs = $("#fhj_sjcrs").val();
    var fhj_je = $("#fhj_je").val();

    var mxlistArr = [];
    $("#mxlist").find("#mx").each(function () {
        var fjc_sj = $(this).find("#fjc_sj").val();
        var fjc_rs = $(this).find("#fjc_rs").val();
        var fsjjcrs = $(this).find("#fsjjcrs").val();
        var fcb = $(this).find("#fcb").val();
        var fcbiao = $(this).find("#fcbiao").val();
        var fje = $(this).find("#fje").val();
        var fbz = $(this).find("#fbz").val();
        var mx = new Mx(fjc_sj, fjc_rs, fsjjcrs, fcb, fcbiao, fje, fbz);
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
                    <BPM_WGJTJBJCTB_A>
                        <fbillno>${fbillno}</fbillno>
                        <fsqr>${fsqr}</fsqr>
                        <fsqbm>${fsqbm}</fsqbm>
                        <fsqrq>${fsqrq}</fsqrq>
                        <flxfs>${flxfs}</flxfs>
                        <fssjt>${fssjt}</fssjt>
                        <fssgs>${fssgs}</fssgs>
                        <ffgs>${ffgs}</ffgs>
                        <fjc_st>${fjc_st}</fjc_st>
                        <fhj_rs>${fhj_rs}</fhj_rs>
                        <fhj_sjcrs>${fhj_sjcrs}</fhj_sjcrs>
                        <fhj_je>${fhj_je}</fhj_je>
                        <FJ>201608190109</FJ>
                    </BPM_WGJTJBJCTB_A>
                   `;
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `

                        <BPM_WGJTJBJCTB_B>
                            <RelationRowGuid>${i + 1}</RelationRowGuid>
                            <RowPrimaryKeys></RowPrimaryKeys>
                            <fentryno>${i + 1}</fentryno>
                            <fjc_sj>${mxlistArr[i].fjc_sj}</fjc_sj>
                            <fjc_rs>${mxlistArr[i].fjc_rs}</fjc_rs>
                            <fsjjcrs>${mxlistArr[i].fsjjcrs}</fsjjcrs>
                            <fcb>${mxlistArr[i].fcb}</fcb>
                            <fcbiao>${mxlistArr[i].fcbiao}</fcbiao>
                            <fje>${mxlistArr[i].fje}</fje>
                            <fbz>${mxlistArr[i].fbz}</fbz>
                        </BPM_WGJTJBJCTB_B>
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

    var fsqr = $("#fsqr").val();
    var fsqbm = $("#fsqbm").val();
    var fsqrq = $("#fsqrq").val();
    var flxfs = $("#flxfs").val();
    var fssjt = $("#fssjt").val();
    var fssgs = $("#fssgs").val();
    var ffgs = $("#ffgs").val();
    var fjc_st = $("#fjc_st").val();
    var fhj_rs = $("#fhj_rs").val();
    var fhj_sjcrs = $("#fhj_sjcrs").val();
    var fhj_je = $("#fhj_je").val();

    var mxlistArr = [];
    $("#mxlist").find("#mx").each(function () {
        var fjc_sj = $(this).find("#fjc_sj").val();
        var fjc_rs = $(this).find("#fjc_rs").val();
        var fsjjcrs = $(this).find("#fsjjcrs").val();
        var fcb = $(this).find("#fcb").val();
        var fcbiao = $(this).find("#fcbiao").val();
        var fje = $(this).find("#fje").val();
        var fbz = $(this).find("#fbz").val();
        var mx = new Mx(fjc_sj, fjc_rs, fsjjcrs, fcb, fcbiao, fje, fbz);
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
                    <BPM_WGJTJBJCTB_A>
                        <fbillno>${fbillno}</fbillno>
                        <fsqr>${fsqr}</fsqr>
                        <fsqbm>${fsqbm}</fsqbm>
                        <fsqrq>${fsqrq}</fsqrq>
                        <flxfs>${flxfs}</flxfs>
                        <fssjt>${fssjt}</fssjt>
                        <fssgs>${fssgs}</fssgs>
                        <ffgs>${ffgs}</ffgs>
                        <fjc_st>${fjc_st}</fjc_st>
                        <fhj_rs>${fhj_rs}</fhj_rs>
                        <fhj_sjcrs>${fhj_sjcrs}</fhj_sjcrs>
                        <fhj_je>${fhj_je}</fhj_je>
                        <FJ>201608190109</FJ>
                    </BPM_WGJTJBJCTB_A>
                   `;
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `

                        <BPM_WGJTJBJCTB_B>
                            <RelationRowGuid>${i + 1}</RelationRowGuid>
                            <RowPrimaryKeys>itemid=${itemidArr[i]}</RowPrimaryKeys>
                            <fentryno>${i + 1}</fentryno>
                            <fjc_sj>${mxlistArr[i].fjc_sj}</fjc_sj>
                            <fjc_rs>${mxlistArr[i].fjc_rs}</fjc_rs>
                            <fsjjcrs>${mxlistArr[i].fsjjcrs}</fsjjcrs>
                            <fcb>${mxlistArr[i].fcb}</fcb>
                            <fcbiao>${mxlistArr[i].fcbiao}</fcbiao>
                            <fje>${mxlistArr[i].fje}</fje>
                            <fbz>${mxlistArr[i].fbz}</fbz>
                        </BPM_WGJTJBJCTB_B>
                       `;
            }
            xml += `
                       </FormData>
                    </XForm>
                   `;
            PostXml(xml);
        });
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
                    <BPM_WGJTJBJCTB_A>
                        <fbillno>${fbillno}</fbillno>
                        <fsqr>${fsqr}</fsqr>
                        <fsqbm>${fsqbm}</fsqbm>
                        <fsqrq>${fsqrq}</fsqrq>
                        <flxfs>${flxfs}</flxfs>
                        <fssjt>${fssjt}</fssjt>
                        <fssgs>${fssgs}</fssgs>
                        <ffgs>${ffgs}</ffgs>
                        <fjc_st>${fjc_st}</fjc_st>
                        <fhj_rs>${fhj_rs}</fhj_rs>
                        <fhj_sjcrs>${fhj_sjcrs}</fhj_sjcrs>
                        <fhj_je>${fhj_je}</fhj_je>
                        <FJ>201608190109</FJ>
                    </BPM_WGJTJBJCTB_A>
                   `;
        for (var i = 0; i < mxlistArr.length; i++) {
            xml += `

                        <BPM_WGJTJBJCTB_B>
                            <RelationRowGuid>${i + 1}</RelationRowGuid>
                            <RowPrimaryKeys>itemid=${itemidArr[i]}</RowPrimaryKeys>
                            <fentryno>${i + 1}</fentryno>
                            <fjc_sj>${mxlistArr[i].fjc_sj}</fjc_sj>
                            <fjc_rs>${mxlistArr[i].fjc_rs}</fjc_rs>
                            <fsjjcrs>${mxlistArr[i].fsjjcrs}</fsjjcrs>
                            <fcb>${mxlistArr[i].fcb}</fcb>
                            <fcbiao>${mxlistArr[i].fcbiao}</fcbiao>
                            <fje>${mxlistArr[i].fje}</fje>
                            <fbz>${mxlistArr[i].fbz}</fbz>
                        </BPM_WGJTJBJCTB_B>
                       `;
        }
        xml += `
                       </FormData>
                    </XForm>
                   `;
        PostXml(xml);
    }
    
}