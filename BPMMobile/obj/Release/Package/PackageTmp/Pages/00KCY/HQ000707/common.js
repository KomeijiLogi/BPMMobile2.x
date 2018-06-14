function prepMsg() {

    $("#date").val(getNowFormatDate(2));
    tapEvent();
    initOrgMsg();
    var xml = `<?xml version= "1.0" ?>
                  <Requests>
                      <Params>
                      <Method>GetFormPostData</Method>
                      <ProcessName>集团公司员工节假日乘坐班车人数提报</ProcessName>
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
        $("#fname").val(item.fname);
        $("#fssgs").val(item.fssgs);

    }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
        if (XMLHttpRequest.status == "401") {
            mui.alert('授权过期，请重新打开页面');;
        } else if (XMLHttpRequest.status == "500") {
            mui.alert('服务器内部错误');
        }

        });
   
}
function prepIndexedList(id) {

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

            $("#mxlist").find("input[name='fgsmc']").each(function () {
                var sid = $(this).data('vid');
                console.log('sid', sid, 'id', id);
                if (sid === id) {
                    $(this).val(checkedObjs[checkedObjs.length - 1].fbmmc);
                }
            });
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
        //console.log(item);
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
        //prepIndexedList();
    });

}

function tapEvent() {
    
    $(".mui-icon-left-nav").on('tap', function () {
        $("#wrapper").show();
        $("#selector").hide();
    });


    $("#tjmx").on('tap', () => {
        var li = `
                 <div id="mx" class="mui-card">
                        <div class="mui-input-row itemtitle">
                            <label>明细列表项</label>
                            <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>
                        </div>
                        <div class="mui-row cutOffLine" style="padding:1vw;">
                            <div class="mui-col-xs-12">
                                <label>公司名称<i style="color:red;">*</i></label>
                                <input type="text" id="fgsmc" name="fgsmc" readonly placeholder="请选择公司名称" data-vid="${Math.random()}"/> 
                            </div>  
                        </div>
                        <div class="mui-row cutOffLine" style="padding:1vw;">
                            <div class="mui-col-xs-12">
                                 <label>休假日期<i style="color:red;">*</i></label> 
                                 <input type="date" id="fdate" />
                            </div>
                        </div>
                        <div class="mui-row cutOffLine" style="padding:1vw;">
                             <div class="mui-col-xs-2">
                                <label>北线</label>
                                <input type="number" id="fbx"  placeholder="待填"/>
                            </div>
                            <div class="mui-col-xs-2">
                                <label>南线</label>
                                <input type="number" id="fnx" placeholder="待填"/>
                            </div>
                            <div class="mui-col-xs-2">
                                <label>羊亭</label>
                                <input type="number" id="fyt"  placeholder="待填"/>
                            </div>
                            <div class="mui-col-xs-2">
                                <label>苘山</label>
                                <input type="number" id="fms"  placeholder="待填"/>
                            </div>
                            <div class="mui-col-xs-2">
                                <label>汪疃</label>
                                <input type="number" id="fwt" placeholder="待填" />
                            </div>
                             <div class="mui-col-xs-2">
                                <label>张村西</label>
                                <input type="number" id="fzcx" placeholder="待填" />
                            </div>
                        </div>  
                       <div class="mui-row cutOffLine" style="padding:1vw;">
                            <div class="mui-col-xs-2">
                                <label>张村东</label>
                                <input type="number" id="fzcd" placeholder="待填" />
                            </div>
                            <div class="mui-col-xs-2">
                                <label>初村</label>
                                <input type="number" id="fcc" placeholder="待填" />
                            </div>
                            <div class="mui-col-xs-2">
                                <label>三期北线</label>
                                <input type="number" id="fsqbx" placeholder="待填" />
                            </div>
                            <div class="mui-col-xs-2">
                                <label>三期南线</label>
                                <input type="number" id="fsqnx" placeholder="待填" />
                            </div>
                            <div class="mui-col-xs-2">
                                <label>三期羊亭</label>
                                <input type="number" id="fsqyt" placeholder="待填" />
                            </div>
                             <div class="mui-col-xs-2">
                                <label>马山南线</label>
                                <input type="number" id="fmsnx" placeholder="待填" />
                            </div>
                       </div>
                       <div class="mui-row cutOffLine" style="padding:1vw;">
                            <div class="mui-col-xs-2">
                                <label>马山北线</label>
                                <input type="number" id="fmsbx" placeholder="待填" />
                            </div>
                            <div class="mui-col-xs-2">
                                <label>文登</label>
                                <input type="number" id="fwd" placeholder="待填" />
                            </div>
                            <div class="mui-col-xs-2">
                                <label>三期张村东</label>
                                <input type="number" id="fsqzcd" placeholder="待填" />
                            </div>
                            <div class="mui-col-xs-2">
                                <label>三期张村西</label>
                                <input type="number" id="fsqzcx" placeholder="待填" />
                            </div>
                       </div>  
                  </div>  
                 `;
        $("#mxlist").append(li);
    

    });
    //委托到列表最顶层
    $("#mxlist").on('tap', "input[name='fgsmc']", function (e) {
        
        var self = this;
       
        var id = $(self).data('vid');
        //console.log('e',e, 'this', self,'id',id);

        prepIndexedList(id);

       //todo:调整id匹配

        $("#wrapper").hide();
        $("#selector").show();
        var header = document.querySelector('header.mui-bar');
        var list = document.querySelector('#list');
        var done = document.querySelector('#done');
        //计算高度 
        list.style.height = (document.body.offsetHeight - header.offsetHeight) + 'px';
        //create
        window.indexedList = new mui.IndexedList(list);
    });

    $("#mxlist").on('input', 'input[type="number"]', function (e) {
        calcTotal();
         
    });
}

function calcTotal() {
    var fhj_bx = 0;
    var fhj_nx = 0;
    var fhj_yt = 0;
    var fhj_ms = 0;
    var fhj_wt = 0;
    var fhj_zcx = 0;
    var fhj_zcd = 0;
    var fhj_cc = 0;
    var fhj_sqbx = 0;
    var fhj_sqnx = 0;
    var fhj_sqyt = 0;
    var fhj_msnx = 0;
    var fhj_msbx = 0;
    var fhj_wd = 0;
    var fhj_sqzcd = 0;
    var fhj_sqzcx = 0;


    $("#mxlist").find("#mx").each(function () {


    });
}

function initData(data, flag) {
    var item = data.FormDataSet.BPM_WGJTYGJJRBCRSTB_A[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.fbillno);
    }
    $("#fname").val(item.fname);
    $("#fdate").val(FormatterTimeYMS(item.fdate));
    $("#fssgs").val(item.fssgs);
    $("#ftel").val(item.ftel);
    $("#fhj_bx").val(item.fhj_bx);
    $("#fhj_nx").val(item.fhj_nx);
    $("#fhj_yt").val(item.fhj_yt);
    $("#fhj_ms").val(item.fhj_ms);
    $("#fhj_wt").val(item.fhj_wt);
    $("#fhj_zcx").val(item.fhj_zcx);
    $("#fhj_cc").val(item.fhj_cc);
    $("#fhj_sqbx").val(item.fhj_sqbx);
    $("#fhj_sqnx").val(item.fhj_sqnx);
    $("#fhj_sqyt").val(item.fhj_sqyt);
    $("#fhj_msnx").val(item.fhj_msnx);
    $("#fhj_msbx").val(item.fhj_msbx);
    $("#fhj_wd").val(item.fhj_wd);
    $("#fhj_sqzcd").val(item.fhj_sqzcd);
    $("#fhj_sqzcx").val(item.fhj_sqzcx);


    var item_c = data.FormDataSet.BPM_WGJTYGJJRBCRSTB_B;
    for (var i = 0; i < item_c.length; i++) {
        itemidArr.push(item_c[i].itemid);
        var li = `
                 <div id="mx" class="mui-card">
                        <div class="mui-input-row itemtitle">
                            <label>明细列表项</label>
                            <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>
                        </div>
                        <div class="mui-row cutOffLine" style="padding:1vw;">
                            <div class="mui-col-xs-12">
                                <label>公司名称<i style="color:red;">*</i></label>
                                <input type="text" id="fgsmc" name="fgsmc" readonly  value="${item_c[i].fgsmc}"/> 
                            </div>  
                        </div>
                        <div class="mui-row cutOffLine" style="padding:1vw;">
                            <div class="mui-col-xs-12">
                                 <label>休假日期<i style="color:red;">*</i></label>
                                 <input type="date" id="fdate" readonly value="${FormatterTimeYMS(item_c[i].fdate)}"/>
                            </div>
                        </div>
                        <div class="mui-row cutOffLine" style="padding:1vw;">
                             <div class="mui-col-xs-2">
                                <label>北线</label>
                                <input type="number" id="fbx"  readonly value="${(item_c[i].fbx)}"/>
                            </div>
                            <div class="mui-col-xs-2">
                                <label>南线</label>
                                <input type="number" id="fnx" readonly value="${(item_c[i].fnx)}"/>
                            </div>
                            <div class="mui-col-xs-2">
                                <label>羊亭</label>
                                <input type="number" id="fyt"  readonly value="${(item_c[i].fyt)}"/>
                            </div>
                            <div class="mui-col-xs-2">
                                <label>苘山</label>
                                <input type="number" id="fms"  readonly value="${(item_c[i].fms)}"/>
                            </div>
                            <div class="mui-col-xs-2">
                                <label>汪疃</label>
                                <input type="number" id="fwt" readonly value="${(item_c[i].fwt)}"/>
                            </div>
                             <div class="mui-col-xs-2">
                                <label>张村西</label>
                                <input type="number" id="fzcx" readonly value="${(item_c[i].fzcx)}"/>
                            </div>
                        </div>  
                       <div class="mui-row cutOffLine" style="padding:1vw;">
                            <div class="mui-col-xs-2">
                                <label>张村东</label>
                                <input type="number" id="fzcd" readonly value="${(item_c[i].fzcd)}"/>
                            </div>
                            <div class="mui-col-xs-2">
                                <label>初村</label>
                                <input type="number" id="fcc" readonly value="${(item_c[i].fcc)}"/>
                            </div>
                            <div class="mui-col-xs-2">
                                <label>三期北线</label>
                                <input type="number" id="fsqbx" readonly value="${(item_c[i].fsqbx)}"/>
                            </div>
                            <div class="mui-col-xs-2">
                                <label>三期南线</label>
                                <input type="number" id="fsqnx" readonly value="${(item_c[i].fsqnx)}"/>
                            </div>
                            <div class="mui-col-xs-2">
                                <label>三期羊亭</label>
                                <input type="number" id="fsqyt" readonly value="${(item_c[i].fsqyt)}"/>
                            </div>
                             <div class="mui-col-xs-2">
                                <label>马山南线</label>
                                <input type="number" id="fmsnx" readonly value="${(item_c[i].fmsnx)}"/>
                            </div>
                       </div>
                       <div class="mui-row cutOffLine" style="padding:1vw;">
                            <div class="mui-col-xs-2">
                                <label>马山北线</label>
                                <input type="number" id="fmsbx" readonly value="${(item_c[i].fmsbx)}"/>
                            </div>
                            <div class="mui-col-xs-2">
                                <label>文登</label>
                                <input type="number" id="fwd" readonly value="${(item_c[i].fwd)}"/>
                            </div>
                            <div class="mui-col-xs-2">
                                <label>三期张村东</label>
                                <input type="number" id="fsqzcd" readonly value="${(item_c[i].fsqzcd)}"/>
                            </div>
                            <div class="mui-col-xs-2">
                                <label>三期张村西</label>
                                <input type="number" id="fsqzcx" readonly value="${(item_c[i].fsqzcx)}"/>
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
    }
}
class Mx {
    constructor(fgsmc, fdate, fbx, fnx, fyt, fms, fwt, fzcx, fzcd, fcc, fsqbx, fsqnx, fsqyt, fmsnx, fmsbx, fwd, fsqzcd, fsqzcx) {
        this.fgsmc = fgsmc;
        this.fdate = fdate;
        this.fbx = fbx;
        this.fnx = fnx;
        this.fyt = fyt;
        this.fms = fms;
        this.fwt = fwt;
        this.fzcx = fzcx;
        this.fzcd = fzcd;
        this.fcc = fcc;
        this.fsqbx = fsqbx;
        this.fsqnx = fsqnx;
        this.fsqyt = fsqyt;
        this.fmsnx = fmsnx;
        this.fmsbx = fmsbx;
        this.fwd = fwd;
        this.fsqzcd = fsqzcd;
        this.fsqzcx = fsqzcx;
    }
}

function Save() {
    var fname = $("#fname").val();
    var fdate = $("#fdate").val();
    var fssgs = $("#fssgs").val();
    var ftel = $("#ftel").val();
    var fhj_bx = $("#fhj_bx").val();
    var fhj_nx = $("#fhj_nx").val();
    var fhj_yt = $("#fhj_yt").val();
    var fhj_ms = $("#fhj_ms").val();
    var fhj_wt = $("#fhj_wt").val();
    var fhj_zcx = $("#fhj_zcx").val();
    var fhj_zcd = $("#fhj_zcd").val();
    var fhj_cc = $("#fhj_cc").val();
    var fhj_sqbx = $("#fhj_sqbx").val();
    var fhj_sqnx = $("#fhj_sqnx").val();
    var fhj_sqyt = $("#fhj_sqyt").val();
    var fhj_msnx = $("#fhj_msnx").val();

    var fhj_msbx = $("#fhj_msbx").val();
    var fhj_wd = $("#fhj_wd").val();
    var fhj_sqzcd = $("#fhj_sqzcd").val();
    var fhj_sqzcx = $("#fhj_sqzcx").val();
    

    var mxlistArr = [];
    var mxflag = false;
    $("#mxlist").find("#mx").each(function () {
        var fgsmc = $(this).find("#fgsmc").val();
        var fdate = $(this).find("#fdate").val();
        var fbx = $(this).find("#fbx").val();
        var fnx = $(this).find("#fnx").val();
        var fyt = $(this).find("#fyt").val();
        var fms = $(this).find("#fms").val();
        var fwt = $(this).find("#fwt").val();
        var fzcx = $(this).find("#fzcx").val();
        var fzcd = $(this).find("#fzcd").val();
        var fcc = $(this).find("#fcc").val();
        var fsqbx = $(this).find("#fsqbx").val();
        var fsqnx = $(this).find("#fsqnx").val();
        var fsqyt = $(this).find("#fsqyt").val();
        var fmsnx = $(this).find("#fmsnx").val();
        var fmsbx = $(this).find("#fmsbx").val();
        var fwd = $(this).find("#fwd").val();
        var fsqzcd = $(this).find("#fsqzcd").val();
        var fsqzcx = $(this).find("#fsqzcx").val();
        var mx = new Mx(fgsmc, fdate, fbx, fnx, fyt, fms, fwt, fzcx, fzcd, fcc, fsqbx, fsqnx, fsqyt, fmsnx, fmsbx, fwd, fsqzcd, fsqzcx);
        mxlistArr.push(mx);
    });
    var btnArry = ["取消", "确定"];
    mui.confirm('即将提交，是否确定？', '提交确认提醒', btnArry, function (e) {
        if (e.index == 1) {
            var xml = `<?xml version="1.0"?>
                        <XForm>
                            <Header>
                                <Method>Post</Method>
                                <ProcessName>集团公司员工节假日乘坐班车人数提报</ProcessName>
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
                      <BPM_WGJTYGJJRBCRSTB_A>
                        <fbillno>自动生成</fbillno>
                        <fname>${fname}</fname>
                        <fdate>${fdate}</fdate>
                        <fssgs>${fssgs}</fssgs>
                        <ftel>${ftel}</ftel>
                        <fhj_bx>${fhj_bx}</fhj_bx>
                        <fhj_nx>${fhj_nx}</fhj_nx>
                        <fhj_yt>${fhj_yt}</fhj_yt>
                        <fhj_ms>${fhj_ms}</fhj_ms>
                        <fhj_wt>${fhj_wt}</fhj_wt>
                        <fhj_zcx>${fhj_zcx}</fhj_zcx>
                        <fhj_zcd>${fhj_zcd}</fhj_zcd>
                        <fhj_cc>${fhj_cc}</fhj_cc>
                        <fhj_sqbx>${fhj_sqbx}</fhj_sqbx>
                        <fhj_sqnx>${fhj_sqnx}</fhj_sqnx>
                        <fhj_sqyt>${fhj_sqyt}</fhj_sqyt>
                        <fhj_msnx>${fhj_msnx}</fhj_msnx>
                        <fhj_msbx>${fhj_msbx}</fhj_msbx>
                        <fhj_wd>${fhj_wd}</fhj_wd>
                        <fhj_sqzcd>${fhj_sqzcd}</fhj_sqzcd>
                        <fhj_sqzcx>${fhj_sqzcx}</fhj_sqzcx>
                    </BPM_WGJTYGJJRBCRSTB_A>
                   `;
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `
                        <BPM_WGJTYGJJRBCRSTB_B>
                            <RelationRowGuid>${i+1}</RelationRowGuid>
                            <RowPrimaryKeys></RowPrimaryKeys>
                            <fentryno>${i + 1}</fentryno>
                            <fgsmc>${mxlistArr[i].fgsmc}</fgsmc>
                            <fdate>${mxlistArr[i].fdate}</fdate>
                            <fbx>${mxlistArr[i].fbx}</fbx>
                            <fnx>${mxlistArr[i].fnx}</fnx>
                            <fyt>${mxlistArr[i].fyt}</fyt>
                            <fms>${mxlistArr[i].fms}</fms>
                            <fwt>${mxlistArr[i].fwt}</fwt>
                            <fzcx>${mxlistArr[i].fzcx}</fzcx>
                            <fzcd>${mxlistArr[i].fzcd}</fzcd>
                            <fcc>${mxlistArr[i].fcc}</fcc>
                            <fsqbx>${mxlistArr[i].fsqbx}</fsqbx>
                            <fsqnx>${mxlistArr[i].fsqnx}</fsqnx>
                            <fsqyt>${mxlistArr[i].fsqyt}</fsqyt>
                            <fmsnx>${mxlistArr[i].fmsnx}</fmsnx>
                            <fmsbx>${mxlistArr[i].fmsbx}</fmsbx>
                            <fwd>${mxlistArr[i].fwd}</fwd>
                            <fsqzcd>${mxlistArr[i].fsqzcd}</fsqzcd>
                            <fsqzcx>${mxlistArr[i].fsqzcx}</fsqzcx>
                        </BPM_WGJTYGJJRBCRSTB_B>
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

    var fname = $("#fname").val();
    var fdate = $("#fdate").val();
    var fssgs = $("#fssgs").val();
    var ftel = $("#ftel").val();
    var fhj_bx = $("#fhj_bx").val();
    var fhj_nx = $("#fhj_nx").val();
    var fhj_yt = $("#fhj_yt").val();
    var fhj_ms = $("#fhj_ms").val();
    var fhj_wt = $("#fhj_wt").val();
    var fhj_zcx = $("#fhj_zcx").val();
    var fhj_zcd = $("#fhj_zcd").val();
    var fhj_cc = $("#fhj_cc").val();
    var fhj_sqbx = $("#fhj_sqbx").val();
    var fhj_sqnx = $("#fhj_sqnx").val();
    var fhj_sqyt = $("#fhj_sqyt").val();
    var fhj_msnx = $("#fhj_msnx").val();

    var fhj_msbx = $("#fhj_msbx").val();
    var fhj_wd = $("#fhj_wd").val();
    var fhj_sqzcd = $("#fhj_sqzcd").val();
    var fhj_sqzcx = $("#fhj_sqzcx").val();


    var mxlistArr = [];
    var mxflag = false;
    $("#mxlist").find("#mx").each(function () {
        var fgsmc = $(this).find("#fgsmc").val();
        var fdate = $(this).find("#fdate").val();
        var fbx = $(this).find("#fbx").val();
        var fnx = $(this).find("#fnx").val();
        var fyt = $(this).find("#fyt").val();
        var fms = $(this).find("#fms").val();
        var fwt = $(this).find("#fwt").val();
        var fzcx = $(this).find("#fzcx").val();
        var fzcd = $(this).find("#fzcd").val();
        var fcc = $(this).find("#fcc").val();
        var fsqbx = $(this).find("#fsqbx").val();
        var fsqnx = $(this).find("#fsqnx").val();
        var fsqyt = $(this).find("#fsqyt").val();
        var fmsnx = $(this).find("#fmsnx").val();
        var fmsbx = $(this).find("#fmsbx").val();
        var fwd = $(this).find("#fwd").val();
        var fsqzcd = $(this).find("#fsqzcd").val();
        var fsqzcx = $(this).find("#fsqzcx").val();
        var mx = new Mx(fgsmc, fdate, fbx, fnx, fyt, fms, fwt, fzcx, fzcd, fcc, fsqbx, fsqnx, fsqyt, fmsnx, fmsbx, fwd, fsqzcd, fsqzcx);
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
                      <BPM_WGJTYGJJRBCRSTB_A>
                        <fbillno>自动生成</fbillno>
                        <fname>${fname}</fname>
                        <fdate>${fdate}</fdate>
                        <fssgs>${fssgs}</fssgs>
                        <ftel>${ftel}</ftel>
                        <fhj_bx>${fhj_bx}</fhj_bx>
                        <fhj_nx>${fhj_nx}</fhj_nx>
                        <fhj_yt>${fhj_yt}</fhj_yt>
                        <fhj_ms>${fhj_ms}</fhj_ms>
                        <fhj_wt>${fhj_wt}</fhj_wt>
                        <fhj_zcx>${fhj_zcx}</fhj_zcx>
                        <fhj_zcd>${fhj_zcd}</fhj_zcd>
                        <fhj_cc>${fhj_cc}</fhj_cc>
                        <fhj_sqbx>${fhj_sqbx}</fhj_sqbx>
                        <fhj_sqnx>${fhj_sqnx}</fhj_sqnx>
                        <fhj_sqyt>${fhj_sqyt}</fhj_sqyt>
                        <fhj_msnx>${fhj_msnx}</fhj_msnx>
                        <fhj_msbx>${fhj_msbx}</fhj_msbx>
                        <fhj_wd>${fhj_wd}</fhj_wd>
                        <fhj_sqzcd>${fhj_sqzcd}</fhj_sqzcd>
                        <fhj_sqzcx>${fhj_sqzcx}</fhj_sqzcx>
                    </BPM_WGJTYGJJRBCRSTB_A>
                   `;
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `
                        <BPM_WGJTYGJJRBCRSTB_B>
                            <RelationRowGuid>${i + 1}</RelationRowGuid>
                            <RowPrimaryKeys></RowPrimaryKeys>
                            <fentryno>${i + 1}</fentryno>
                            <fgsmc>${mxlistArr[i].fgsmc}</fgsmc>
                            <fdate>${mxlistArr[i].fdate}</fdate>
                            <fbx>${mxlistArr[i].fbx}</fbx>
                            <fnx>${mxlistArr[i].fnx}</fnx>
                            <fyt>${mxlistArr[i].fyt}</fyt>
                            <fms>${mxlistArr[i].fms}</fms>
                            <fwt>${mxlistArr[i].fwt}</fwt>
                            <fzcx>${mxlistArr[i].fzcx}</fzcx>
                            <fzcd>${mxlistArr[i].fzcd}</fzcd>
                            <fcc>${mxlistArr[i].fcc}</fcc>
                            <fsqbx>${mxlistArr[i].fsqbx}</fsqbx>
                            <fsqnx>${mxlistArr[i].fsqnx}</fsqnx>
                            <fsqyt>${mxlistArr[i].fsqyt}</fsqyt>
                            <fmsnx>${mxlistArr[i].fmsnx}</fmsnx>
                            <fmsbx>${mxlistArr[i].fmsbx}</fmsbx>
                            <fwd>${mxlistArr[i].fwd}</fwd>
                            <fsqzcd>${mxlistArr[i].fsqzcd}</fsqzcd>
                            <fsqzcx>${mxlistArr[i].fsqzcx}</fsqzcx>
                        </BPM_WGJTYGJJRBCRSTB_B>
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

    var fname = $("#fname").val();
    var fdate = $("#fdate").val();
    var fssgs = $("#fssgs").val();
    var ftel = $("#ftel").val();
    var fhj_bx = $("#fhj_bx").val();
    var fhj_nx = $("#fhj_nx").val();
    var fhj_yt = $("#fhj_yt").val();
    var fhj_ms = $("#fhj_ms").val();
    var fhj_wt = $("#fhj_wt").val();
    var fhj_zcx = $("#fhj_zcx").val();
    var fhj_zcd = $("#fhj_zcd").val();
    var fhj_cc = $("#fhj_cc").val();
    var fhj_sqbx = $("#fhj_sqbx").val();
    var fhj_sqnx = $("#fhj_sqnx").val();
    var fhj_sqyt = $("#fhj_sqyt").val();
    var fhj_msnx = $("#fhj_msnx").val();

    var fhj_msbx = $("#fhj_msbx").val();
    var fhj_wd = $("#fhj_wd").val();
    var fhj_sqzcd = $("#fhj_sqzcd").val();
    var fhj_sqzcx = $("#fhj_sqzcx").val();



    var mxlistArr = [];
    var mxflag = false;
    $("#mxlist").find("#mx").each(function () {
        var fgsmc = $(this).find("#fgsmc").val();
        var fdate = $(this).find("#fdate").val();
        var fbx = $(this).find("#fbx").val();
        var fnx = $(this).find("#fnx").val();
        var fyt = $(this).find("#fyt").val();
        var fms = $(this).find("#fms").val();
        var fwt = $(this).find("#fwt").val();
        var fzcx = $(this).find("#fzcx").val();
        var fzcd = $(this).find("#fzcd").val();
        var fcc = $(this).find("#fcc").val();
        var fsqbx = $(this).find("#fsqbx").val();
        var fsqnx = $(this).find("#fsqnx").val();
        var fsqyt = $(this).find("#fsqyt").val();
        var fmsnx = $(this).find("#fmsnx").val();
        var fmsbx = $(this).find("#fmsbx").val();
        var fwd = $(this).find("#fwd").val();
        var fsqzcd = $(this).find("#fsqzcd").val();
        var fsqzcx = $(this).find("#fsqzcx").val();
        var mx = new Mx(fgsmc, fdate, fbx, fnx, fyt, fms, fwt, fzcx, fzcd, fcc, fsqbx, fsqnx, fsqyt, fmsnx, fmsbx, fwd, fsqzcd, fsqzcx);
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
                      <BPM_WGJTYGJJRBCRSTB_A>
                        <fbillno>${fbillno}</fbillno>
                        <fname>${fname}</fname>
                        <fdate>${fdate}</fdate>
                        <fssgs>${fssgs}</fssgs>
                        <ftel>${ftel}</ftel>
                        <fhj_bx>${fhj_bx}</fhj_bx>
                        <fhj_nx>${fhj_nx}</fhj_nx>
                        <fhj_yt>${fhj_yt}</fhj_yt>
                        <fhj_ms>${fhj_ms}</fhj_ms>
                        <fhj_wt>${fhj_wt}</fhj_wt>
                        <fhj_zcx>${fhj_zcx}</fhj_zcx>
                        <fhj_zcd>${fhj_zcd}</fhj_zcd>
                        <fhj_cc>${fhj_cc}</fhj_cc>
                        <fhj_sqbx>${fhj_sqbx}</fhj_sqbx>
                        <fhj_sqnx>${fhj_sqnx}</fhj_sqnx>
                        <fhj_sqyt>${fhj_sqyt}</fhj_sqyt>
                        <fhj_msnx>${fhj_msnx}</fhj_msnx>
                        <fhj_msbx>${fhj_msbx}</fhj_msbx>
                        <fhj_wd>${fhj_wd}</fhj_wd>
                        <fhj_sqzcd>${fhj_sqzcd}</fhj_sqzcd>
                        <fhj_sqzcx>${fhj_sqzcx}</fhj_sqzcx>
                    </BPM_WGJTYGJJRBCRSTB_A>
                   `;
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `
                        <BPM_WGJTYGJJRBCRSTB_B>
                            <RelationRowGuid>${i + 1}</RelationRowGuid>
                            <RowPrimaryKeys>itemid=${itemidArr[i]}</RowPrimaryKeys>
                            <fentryno>${i + 1}</fentryno>
                            <fgsmc>${mxlistArr[i].fgsmc}</fgsmc>
                            <fdate>${mxlistArr[i].fdate}</fdate>
                            <fbx>${mxlistArr[i].fbx}</fbx>
                            <fnx>${mxlistArr[i].fnx}</fnx>
                            <fyt>${mxlistArr[i].fyt}</fyt>
                            <fms>${mxlistArr[i].fms}</fms>
                            <fwt>${mxlistArr[i].fwt}</fwt>
                            <fzcx>${mxlistArr[i].fzcx}</fzcx>
                            <fzcd>${mxlistArr[i].fzcd}</fzcd>
                            <fcc>${mxlistArr[i].fcc}</fcc>
                            <fsqbx>${mxlistArr[i].fsqbx}</fsqbx>
                            <fsqnx>${mxlistArr[i].fsqnx}</fsqnx>
                            <fsqyt>${mxlistArr[i].fsqyt}</fsqyt>
                            <fmsnx>${mxlistArr[i].fmsnx}</fmsnx>
                            <fmsbx>${mxlistArr[i].fmsbx}</fmsbx>
                            <fwd>${mxlistArr[i].fwd}</fwd>
                            <fsqzcd>${mxlistArr[i].fsqzcd}</fsqzcd>
                            <fsqzcx>${mxlistArr[i].fsqzcx}</fsqzcx>
                        </BPM_WGJTYGJJRBCRSTB_B>
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
                      <BPM_WGJTYGJJRBCRSTB_A>
                        <fbillno>${fbillno}</fbillno>
                        <fname>${fname}</fname>
                        <fdate>${fdate}</fdate>
                        <fssgs>${fssgs}</fssgs>
                        <ftel>${ftel}</ftel>
                        <fhj_bx>${fhj_bx}</fhj_bx>
                        <fhj_nx>${fhj_nx}</fhj_nx>
                        <fhj_yt>${fhj_yt}</fhj_yt>
                        <fhj_ms>${fhj_ms}</fhj_ms>
                        <fhj_wt>${fhj_wt}</fhj_wt>
                        <fhj_zcx>${fhj_zcx}</fhj_zcx>
                        <fhj_zcd>${fhj_zcd}</fhj_zcd>
                        <fhj_cc>${fhj_cc}</fhj_cc>
                        <fhj_sqbx>${fhj_sqbx}</fhj_sqbx>
                        <fhj_sqnx>${fhj_sqnx}</fhj_sqnx>
                        <fhj_sqyt>${fhj_sqyt}</fhj_sqyt>
                        <fhj_msnx>${fhj_msnx}</fhj_msnx>
                        <fhj_msbx>${fhj_msbx}</fhj_msbx>
                        <fhj_wd>${fhj_wd}</fhj_wd>
                        <fhj_sqzcd>${fhj_sqzcd}</fhj_sqzcd>
                        <fhj_sqzcx>${fhj_sqzcx}</fhj_sqzcx>
                    </BPM_WGJTYGJJRBCRSTB_A>
                   `;
        for (var i = 0; i < mxlistArr.length; i++) {
            xml += `
                        <BPM_WGJTYGJJRBCRSTB_B>
                            <RelationRowGuid>${i + 1}</RelationRowGuid>
                            <RowPrimaryKeys>itemid=${itemidArr[i]}</RowPrimaryKeys>
                            <fentryno>${i + 1}</fentryno>
                            <fgsmc>${mxlistArr[i].fgsmc}</fgsmc>
                            <fdate>${mxlistArr[i].fdate}</fdate>
                            <fbx>${mxlistArr[i].fbx}</fbx>
                            <fnx>${mxlistArr[i].fnx}</fnx>
                            <fyt>${mxlistArr[i].fyt}</fyt>
                            <fms>${mxlistArr[i].fms}</fms>
                            <fwt>${mxlistArr[i].fwt}</fwt>
                            <fzcx>${mxlistArr[i].fzcx}</fzcx>
                            <fzcd>${mxlistArr[i].fzcd}</fzcd>
                            <fcc>${mxlistArr[i].fcc}</fcc>
                            <fsqbx>${mxlistArr[i].fsqbx}</fsqbx>
                            <fsqnx>${mxlistArr[i].fsqnx}</fsqnx>
                            <fsqyt>${mxlistArr[i].fsqyt}</fsqyt>
                            <fmsnx>${mxlistArr[i].fmsnx}</fmsnx>
                            <fmsbx>${mxlistArr[i].fmsbx}</fmsbx>
                            <fwd>${mxlistArr[i].fwd}</fwd>
                            <fsqzcd>${mxlistArr[i].fsqzcd}</fsqzcd>
                            <fsqzcx>${mxlistArr[i].fsqzcx}</fsqzcx>
                        </BPM_WGJTYGJJRBCRSTB_B>
                       `;
        }
        xml += `
                       </FormData>
                    </XForm>
                   `;
        PostXml(xml);

    }
}