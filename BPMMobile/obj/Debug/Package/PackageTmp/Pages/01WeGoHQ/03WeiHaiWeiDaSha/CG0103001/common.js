function prepMsg() {
    tapEvent();
    $("#fdate").val(getNowFormatDate(2));
    var xml = `<?xml version= "1.0" ?>
               <Requests>
               <Params>
               <Method>GetFormPostData</Method>
               <ProcessName>威海卫大厦物资采购申请</ProcessName>
               <ProcessVersion>${version}</ProcessVersion>
               <Owner></Owner>
               </Params>
               </Requests>
    `;
    dataProvider(xml, function (data) {
        var provideData = JSON.parse(unescape(data.replace(/\\(u[0-9a-fA-F]{4})/gm, '%$1')));
        console.log(provideData);
        var item = provideData.Tables[0].Rows[0];
        $("#fname").val(item.fname);
        $("#fdept").val(item.fdept);
    });
    //initCheckboxMsg();
}

function dataProvider(xml, callback) {

    var p = new Promise(function (resolve, reject) {
        $.ajax({
            type: "POST",
            url: "/api/bpm/DataProvider",
            data: { '': xml },
            beforeSend: function (XHR) {
                XHR.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem('ticket'));
            }
        }).done(function (data) {
            callback(data);
            resolve();
        }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
            if (XMLHttpRequest.status == "401") {
                mui.alert('授权过期，请重新打开页面');;
            } else if (XMLHttpRequest.status == "500") {
                mui.alert('服务器内部错误');
            }
            reject();
        });
    });
    return p;
}

function tapEvent() {

    mui('#fif_spd').each(function () { //循环所有toggle

        /**
         * toggle 事件监听
         */
        this.addEventListener('toggle', function (event) {
            //event.detail.isActive 可直接获取当前状态
            if (event.detail.isActive) {
                $("#fif_sp").val('是');
            } else {
                $("#fif_sp").val('否');
            }
        });
    });

    mui('#fif_5qd').each(function () { //循环所有toggle

        /**
         * toggle 事件监听
         */
        this.addEventListener('toggle', function (event) {
            //event.detail.isActive 可直接获取当前状态
            if (event.detail.isActive) {
                $("#fif_5q").val('是');
            } else {
                $("#fif_5q").val('否');
            }
        });
    });
    $("#tjmx").on('tap', () => {

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

}
function initCheckboxMsg() {

    var xml = `<?xml version= "1.0" ?>
                <Requests>
                <Params>
                <DataSource>BPM_WEGO</DataSource> 
                <ID>erpcloud_威海卫大厦采购申请单</ID>
                <Type>1</Type>
                <Method>GetUserDataProcedure</Method>
                <ProcedureName>erpcloud_威海卫大厦采购申请单</ProcedureName> 
                <Filter>
                </Filter>
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

    }).done((data) => {
        var provideData = JSON.parse(unescape(data.replace(/\\(u[0-9a-fA-F]{4})/gm, '%$1')));
        console.log(provideData);
        var items = provideData.Tables[0].Rows;
        var li = ``;
        for (var i = 0; i < items.length;i++) {
            li += `
                   <li data-value="" data-tags="" class="mui-table-view-cell mui-indexed-list-item mui-checkbox mui-left">
                      <input type="checkbox" id="checkbox" data-fpm="${items[i].FNAME_L2}" data-fbm="${items[i].FNUMBER}" 
                         data-funit="${items[i].UNIT}" data-fkcl="${items[i].FQTY}" data-fgg="${items[i].FMODEL}"/>
                       ${items[i].FNAME_L2}
                   </li>   
                    `;
            $("#datalist").append(li);
        }
    }).fail((e) => {
        console.log(e);
    }).then(() => {
        prepIndexedList();
    });
}
//索引列表准备前置
function prepIndexedList() {

    var header = document.querySelector('header.mui-bar');
    var list = document.querySelector('#list');
    var done = document.querySelector('#done');
    //计算高度 
    list.style.height = (document.body.offsetHeight - header.offsetHeight) + 'px';
    //create
    window.indexedList = new mui.IndexedList(list);

    done.addEventListener('tap', function () {
        var checkboxArray = [].slice.call(list.querySelectorAll('input[type="checkbox"]'));
        var checkedValues = [];
        var checkedEls = [];  //存放选中元素的数组
        checkboxArray.forEach(function (box) {
            if (box.checked) {
                checkedValues.push(box.parentNode.innerText);

                var checkedEl = {
                    fpm: $(box).data('fpm'),
                    fbm: $(box).data('fbm'),
                    funit: $(box).data('funit'),
                    fkcl: $(box).data('fkcl'),
                    fgg: $(box).data('fgg')
                };
                checkedEls.push(checkedEl);


                //取消选中，防止再次进入列表中会选中某一项
                box.checked = !box.checked;
                

            }
        });
        if (checkedValues.length > 0) {
            for (var i = 0; i < checkedEls.length;i++) {
                var li = `

                 `;
            }

            $("#selector").hide();
            $("#wrapper").show();
        } else {

        }


    }, false);

    mui('.mui-indexed-list-inner').on('change', 'input', function () {
        var count = list.querySelectorAll('input[type="checkbox"]:checked').length;
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



function initData(data, flag) {
    var item = data.FormDataSet.BPM_WHWWZCGSQ_A[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.fbillno);
    }
    $("#fdept").val(item.fdept);
    $("#fname").val(item.fname);
    $("#fdate").val(FormatterTimeYMS(item.fdate));
    $("#ftel").val(item.ftel);
    $("#fif_sp").val(item.fif_sp);
    if (item.fif_sp == '是') {
        $("#fif_spd").addClass('mui-active');
    }
    $("#fif_5q").val(item.fif_5q);
    if (item.fif_5q == '是') {
        $("#fif_5qd").addClass('mui-active');
    }
    $("#fhj_cgje").val(item.fhj_cgje);
    $("#fhj_sqje").val(item.fhj_sqje);

    var item_c = data.FormDataSet.BPM_WHWWZCGSQ_B;
    for (var i = 0; i < item_c.length; i++){
        itemidArr.push(item_c[i].itemid);
        var li = `
            <div id="mx" class="mui-card">
              <div class="mui-input-row itemtitle">
                 <label>明细列表项</label>
                 <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>
              </div>
              <div class="mui-row cutOffLine">
                 <div class="mui-col-xs-4"  style="display:flex;">
                      <label for="fpm">品名<i style="color:red;">*</i></label>
                      <textarea id="fpm" name="fpm" readonly >${item_c[i].fpm}</textarea>
                 </div> 
                 <div class="mui-col-xs-4" style="display:flex;">
                       <label for="fbm">编码</label>
                       <textarea id="fbm" name="fbm" readonly >${item_c[i].fbm}</textarea>  
                 </div> 
                 <div class="mui-col-xs-4" style="display:flex;">
                      <label for="fgg">规格</label>
                      <input type="text" id="fgg" name="fgg" readonly value="${item_c[i].fgg}"/> 
                 </div>  
              </div> 
              <div  class="mui-row cutOffLine">
                   <div class="mui-col-xs-4" style="display:flex;">
                       <label for="funit">计量单位</label>
                       <input type="text" id="funit" name="funit" readonly value="${item_c[i].funit}"/>  
                   </div>
                    <div class="mui-col-xs-4" style="display:flex;">
                       <label for="fkcl">库存量</label>
                       <input type="number" id="fkcl" name="fkcl" readonly value="${item_c[i].fkcl}"/>
                   </div>
                   <div class="mui-col-xs-4" style="display:flex;">
                     <label for="fsqsl">申请数量<i style="color:red;">*</i></label>
                     <input type="number" id="fsqsl" name="fsqsl" readonly value="${item_c[i].fsqsl}"/> 
                   </div>
              </div>
              <div class="mui-row cutOffLine">
                   <div class="mui-col-xs-4" style="display:flex;">
                       <label for="fsqdj">申请单价(含税价)<i style="color:red;">*</i></label>
                       <input type="number" id="fsqdj" name="fsqdj" readonly value="${item_c[i].fsqdj}"/>
                   </div> 
                   <div class="mui-col-xs-4" style="display:flex;">
                       <label for="fsqyy">申请原因</label>
                       <input type="text" id="fsqyy" name="fsqyy" readonly value="${item_c[i].fsqyy}"/>
                   </div> 
                    <div class="mui-col-xs-4" style="display:flex;">
                       <label for="fgys">采购供应商</label>
                       <input type="text" id="fgys" name="fgys" readonly value="${item_c[i].fgys}"/>
                   </div>   
              </div>
              <div class="mui-row cutOffLine">
                    <div class="mui-col-xs-4" style="display:flex;">
                         <label for="fcgdj">实际采购单价(含税价)<i style="color:red;">*</i></label>
                         <input type="number" id="fcgdj" name="fcgdj" readonly value="${item_c[i].fcgdj}"/> 
                    </div>
                     <div class="mui-col-xs-4" style="display:flex;">
                         <label for="fcgsl">实际采购数量<i style="color:red;">*</i></label>
                         <input type="number" id="fcgsl" name="fcgsl" readonly value="${item_c[i].fcgsl}"/> 
                     </div>
                     <div class="mui-col-xs-4" style="display:flex;">
                         <label for="fcgje">实际采购金额</label>
                         <input type="number" id="fcgje" name="fcgje" readonly value="${item_c[i].fcgje}"/>
                     </div>
              </div>
               <div class="mui-row cutOffLine">
                   <div  class="mui-col-xs-4" style="display:flex;">
                         <label for="fsqje">申请金额</label>
                         <input type="number" id="fsqje" name="fsqje" readonly value="${item_c[i].fsqje}"/>   
                   </div>
              </div>
             
            </div> 
                 `;
        $("#mxlist").append(li);

    }
}

class MxItem {
    constructor(fpm, fbm, fgg, funit, fkcl, fsqsl, fsqdj, fsqyy, fgys, fcgdj, fcgsl, fcgje, fsqje) {
        this.fpm = fpm;
        this.fbm = fbm;
        this.fgg = fgg;
        this.funit = funit;
        this.fkcl = fkcl;
        this.fsqsl = fsqsl;
        this.fsqdj = fsqdj;
        this.fsqyy = fsqyy;
        this.fgys = fgys;
        this.fcgdj = fcgdj;
        this.fcgsl = fcgsl;
        this.fcgje = fcgje;
        this.fsqje = fsqje;

    }
}

function nodeControllerExp(NodeName) {
    if (String(NodeName).match('开始') != null) {
        mui.alert('请移步网页端处理');
    }
}

function Save() {

}

function reSave() {

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
    var fname = $("#fname").val();
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();
    var ftel = $("#ftel").val();
    var fif_sp = $("#fif_sp").val();
    var fif_5q = $("#fif_5q").val();
    var fhj_cgje = $("#fhj_cgje").val();
    var fhj_sqje = $("#fhj_sqje").val();
    var mxlistArr = [];
    $("#mxlist").find("#mx").each(function () {
        var fpm = $(this).find("#fpm").val();
        var fbm = $(this).find("#fbm").val();
        var fgg = $(this).find("#fgg").val();
        var funit = $(this).find("#funit").val();
        var fkcl = $(this).find("#fkcl").val();
        var fsqsl = $(this).find("#fsqsl").val();
        var fsqdj = $(this).find("#fsqdj").val();
        var fsqyy = $(this).find("#fsqyy").val();
        var fgys = $(this).find("#fgys").val();
        var fcgdj = $(this).find("#fcgdj").val();
        var fcgsl = $(this).find("#fcgsl").val();
        var fcgje = $(this).find("#fcgje").val();
        var fsqje = $(this).find("#fsqje").val();
        var mx = new MxItem(fpm, fbm, fgg, funit, fkcl, fsqsl, fsqdj, fsqyy, fgys, fcgdj, fcgsl, fcgje, fsqje);
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
                     </Header>';
                     <FormData>`;
            xml += `
                      <BPM_WHWWZCGSQ_A>
                        <fbillno>自动生成</fbillno>
                        <fdept>${fdept}</fdept>
                        <fname>${fname}</fname>
                        <fdate>${fdate}</fdate>
                        <ftel>${ftel}</ftel>
                        <fif_sp>${fif_sp}</fif_sp>
                        <fif_5q>${fif_5q}</fif_5q>
                        <fhj_cgje>${fhj_cgje}</fhj_cgje>
                        <fhj_sqje>${fhj_sqje}</fhj_sqje>
                        <fj></fj>
                    </BPM_WHWWZCGSQ_A>
                    `;
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `
                       <BPM_WHWWZCGSQ_B>
                            <RelationRowGuid>${(i + 1)}</RelationRowGuid>
                            <RowPrimaryKeys>itemid=${itemidArr[i]}</RowPrimaryKeys>
                            <fentryno>${(i + 1)}</fentryno>
                            <fpm>${mxlistArr[i].fpm}</fpm>
                            <fbm>${mxlistArr[i].fbm}</fbm>
                            <fgg>${mxlistArr[i].fgg}</fgg>
                            <funit>${mxlistArr[i].funit}</funit>
                            <fkcl>${mxlistArr[i].fkcl}</fkcl>
                            <fsqsl>${mxlistArr[i].fsqsl}</fsqsl>
                            <fsqdj>${mxlistArr[i].fsqdj}</fsqdj>
                            <fsqyy>${mxlistArr[i].fsqyy}</fsqyy>
                            <fgys>${mxlistArr[i].fgys}</fgys>
                            <fcgdj>${mxlistArr[i].fcgdj}</fcgdj>
                            <fcgsl>${mxlistArr[i].fcgsl}</fcgsl>
                            <fcgje>${mxlistArr[i].fcgje}</fcgje>
                            <fsqje>${mxlistArr[i].fsqje}</fsqje>
                        </BPM_WHWWZCGSQ_B>
                       `;

            }
            xml += `  </FormData>
                      </XForm>`;

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
                      <BPM_WHWWZCGSQ_A>
                        <fbillno>${fbillno}</fbillno>
                        <fdept>${fdept}</fdept>
                        <fname>${fname}</fname>
                        <fdate>${fdate}</fdate>
                        <ftel>${ftel}</ftel>
                        <fif_sp>${fif_sp}</fif_sp>
                        <fif_5q>${fif_5q}</fif_5q>
                        <fhj_cgje>${fhj_cgje}</fhj_cgje>
                        <fhj_sqje>${fhj_sqje}</fhj_sqje>
                        <fj></fj>
                    </BPM_WHWWZCGSQ_A>
                    `;
        for (var i = 0; i < mxlistArr.length; i++) {
            xml += `
                       <BPM_WHWWZCGSQ_B>
                            <RelationRowGuid>${(i + 1)}</RelationRowGuid>
                            <RowPrimaryKeys>itemid=${itemidArr[i]}</RowPrimaryKeys>
                            <fentryno>${(i + 1)}</fentryno>
                            <fpm>${mxlistArr[i].fpm}</fpm>
                            <fbm>${mxlistArr[i].fbm}</fbm>
                            <fgg>${mxlistArr[i].fgg}</fgg>
                            <funit>${mxlistArr[i].funit}</funit>
                            <fkcl>${mxlistArr[i].fkcl}</fkcl>
                            <fsqsl>${mxlistArr[i].fsqsl}</fsqsl>
                            <fsqdj>${mxlistArr[i].fsqdj}</fsqdj>
                            <fsqyy>${mxlistArr[i].fsqyy}</fsqyy>
                            <fgys>${mxlistArr[i].fgys}</fgys>
                            <fcgdj>${mxlistArr[i].fcgdj}</fcgdj>
                            <fcgsl>${mxlistArr[i].fcgsl}</fcgsl>
                            <fcgje>${mxlistArr[i].fcgje}</fcgje>
                            <fsqje>${mxlistArr[i].fsqje}</fsqje>
                        </BPM_WHWWZCGSQ_B>
                       `;

        }
        xml += `  </FormData>
                      </XForm>`;

        PostXml(xml);
    }
}
