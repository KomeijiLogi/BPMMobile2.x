function prepMsg() {
    $("#rq").val(getNowFormatDate(2));
    var xml = `<?xml version= "1.0" ?>
                  <Requests>
                      <Params>
                      <Method>GetFormPostData</Method>
                      <ProcessName>集团本部月度费用预算提报</ProcessName>
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
        $("#comp_name").val('威高集团有限公司');
        $("#dept_no").val(item.dept_no);
        $("#dept_name").val(item.dept_name);
        $("#user_leadtitle").val(item.user_leadtitle);
        $("#usr_name").val(item.usr_name);
        $("#usr_no").val(item.usr_no);

    }).fail(function (e) {

        }).then(function () {
            initList();
        });
    tapEvent();
}

function tapEvent() {
    var date = new Date();
    var fyear_data = [
        {
            value: '',
            text: date.getFullYear() - 2
        },
        {
            value: '',
            text: date.getFullYear() - 1
        },
        {
            value: '',
            text: date.getFullYear()
        },
        {
            value: '',
            text: date.getFullYear() + 1
        },
        {
            value: '',
            text: date.getFullYear() + 2
        }
    ];
    showPicker('nian', fyear_data);


    var fmonth_data = [];
    for (var i = 0; i < 12; i++) {
        var month = {
            value: '',
            text:i+1
        }
        fmonth_data.push(month);
    }
    showPicker('yue', fmonth_data);


}

function initList() {
    var xml = `<?xml version= "1.0" ?>
                    <Requests>
                        <Params>
                            <DataSource>BPM_EXPENSE</DataSource>
                            <ID>erpcloud_公用_查询其他费用项目</ID>
                            <Type>1</Type>
                            <Method>GetUserDataProcedure</Method>
                            <ProcedureName>erpcloud_公用_查询其他费用项目</ProcedureName>
                            <Filter></Filter>
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
        var itemData = provideData.Tables[0].Rows;
        console.log(provideData);


    }).fail(function (e) {

    });
}


var item = null;
var item_c = [];
function initData(data, flag) {
    item = data.FormDataSet.ys_month_m[0];

    if (flag) {
        $("#taskId").val(item.taskid);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.lscode);
    }
    $("#comp_name").val(item.comp_name);
    $("#dept_no").val(item.dept_no); 
    $("#dept_name").val(item.dept_name); 
    $("#user_leadtitle").val(item.user_leadtitle); 
    $("#usr_name").val(item.usr_name); 
    $("#usr_no").val(item.usr_no); 
    $("#nian").val(item.nian);
    $("#if_bm").val(item.if_bm);
    $("#yue").val(item.yue);
    $("#if_cz").val(item.if_cz);
    $("#rq").val(FormatterTimeYMS(item.rq));
    $("#rem").val(item.rem);
    $("#amt_z_hj").val(item.amt_z_hj);
    $("#amt_ys_hj").val(item.amt_ys_hj);
    $("#amt_hj").val(item.amt_hj);
    item_c = data.FormDataSet.ys_month_t;
    var li = `
                 <div id="mx">                       
                       <div class="mui-row cutOffLine padding">
                           <div class="mui-col-xs-3" style="display:flex;">
                              <label>费用项目名称</label>
                           </div> 
                            <div class="mui-col-xs-3" style="display:flex;">
                              <label>费用属性</label>
                           </div> 
                           <div class="mui-col-xs-3" style="display:flex;">
                              <label>本月计划</label>
                           </div>
                            <div class="mui-col-xs-3" style="display:flex;">
                              <label>计划说明</label >
                           </div> 
                       </div> 
                 </div>
                 `;

    $("#list").append(li);

    for (var i = 0; i < item_c.length; i++) {
        var li = `
                 <div id="mx">
                       
                       <div class="mui-row cutOffLine padding">
                           <div class="mui-col-xs-3" style="display:flex;">
                              <label>${item_c[i].fyxm_xsname}</label>
                           </div> 
                            <div class="mui-col-xs-3" style="display:flex;">
                              <label>${item_c[i].fyxm_sx}</label>
                           </div> 
                           <div class="mui-col-xs-3" style="display:flex;">
                              <label>${item_c[i].amt}</label>
                           </div>
                            <div class="mui-col-xs-3" style="display:flex;">
                              <label>${changeNullToEmpty(item_c[i].rem)}</label >
                           </div> 
                       </div> 
                 </div>
                 `;

        $("#list").append(li);
    }
    var li = `
                 <div id="mx">
                       
                       <div class="mui-row cutOffLine padding">
                           <div class="mui-col-xs-3" style="display:flex;">
                              <label>合计</label>
                           </div> 
                            <div class="mui-col-xs-3" style="display:flex;">
                              <label></label>
                           </div> 
                           <div class="mui-col-xs-3" style="display:flex;">
                              <label>${item.amt_hj}</label>
                           </div>
                            <div class="mui-col-xs-3" style="display:flex;">
                              <label></label >
                           </div> 
                       </div> 
                 </div>
                 `;

    $("#list").append(li);

}


function nodeControllerExp(nodeName) {
    if (String(nodeName).match('开始') != null) {
        mui.alert('请移步网页端处理');
    }
}

function Save() {

}

function reSave() {

}

function hasRead() {

}

function AgreeOrConSign() {
    var pid = $("#stepId").val();
    var fbillno = $("#fbillno").val();
    var comment = $("#signSuggest").val();
    var nodeName = $("#nodeName").val();

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
           <ys_month_m>
            <taskid>${item.taskid}</taskid>
            <comp_name>${item.comp_name}</comp_name>
            <dept_no>${item.dept_no}</dept_no>
            <dept_name>${item.dept_name}</dept_name>
            <user_leadtitle>${item.user_leadtitle}</user_leadtitle>
            <usr_name>${item.usr_name}</usr_name>
            <usr_no>${item.usr_no}</usr_no>
            <nian>${item.nian}</nian>
            <if_bm>${item.if_bm}</if_bm>
            <yue>${item.yue}</yue>
            <if_cz>${item.if_cz}</if_cz>
            <rq>${item.rq}</rq>
            <rem>${item.rem}</rem>
            <amt_z_hj>${item.amt_z_hj}</amt_z_hj>
            <amt_ys_hj>${item.amt_ys_hj}</amt_ys_hj>
            <amt_hj>${item.amt_hj}</amt_hj>
        </ys_month_m>
                    `;

            for (var i = 0; i < item_c.length; i++) {
                xml += `
                           <ys_month_t>
            <RelationRowGuid>${i+1}</RelationRowGuid>
            <RowPrimaryKeys>itemid=${item_c[i].itemid}</RowPrimaryKeys>
            <fyxm_xsname>${item_c[i].fyxm_xsname}</fyxm_xsname>
            <fyxm_sx>${item_c[i].fyxm_sx}</fyxm_sx>
            <amt_z>${item_c[i].amt_z}</amt_z>
            <amt_ys>${item_c[i].amt_ys}</amt_ys>
            <amt>${item_c[i].amt}</amt>
            <rem>${item_c[i].rem}</rem>
            <fyxm_name>${item_c[i].fyxm_name}</fyxm_name>
            <fyxm_no>${item_c[i].fyxm_no}</fyxm_no>
            <fyxm_lx>${item_c[i].fyxm_lx}</fyxm_lx>
        </ys_month_t>
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
           <ys_month_m>
            <taskid>${item.taskid}</taskid>
            <comp_name>${item.comp_name}</comp_name>
            <dept_no>${item.dept_no}</dept_no>
            <dept_name>${item.dept_name}</dept_name>
            <user_leadtitle>${item.user_leadtitle}</user_leadtitle>
            <usr_name>${item.usr_name}</usr_name>
            <usr_no>${item.usr_no}</usr_no>
            <nian>${item.nian}</nian>
            <if_bm>${item.if_bm}</if_bm>
            <yue>${item.yue}</yue>
            <if_cz>${item.if_cz}</if_cz>
            <rq>${item.rq}</rq>
            <rem>${item.rem}</rem>
            <amt_z_hj>${item.amt_z_hj}</amt_z_hj>
            <amt_ys_hj>${item.amt_ys_hj}</amt_ys_hj>
            <amt_hj>${item.amt_hj}</amt_hj>
        </ys_month_m>
                    `;

        for (var i = 0; i < item_c.length; i++) {
            xml += `
                           <ys_month_t>
            <RelationRowGuid>${i + 1}</RelationRowGuid>
            <RowPrimaryKeys>itemid=${item_c[i].itemid}</RowPrimaryKeys>
            <fyxm_xsname>${item_c[i].fyxm_xsname}</fyxm_xsname>
            <fyxm_sx>${item_c[i].fyxm_sx}</fyxm_sx>
            <amt_z>${item_c[i].amt_z}</amt_z>
            <amt_ys>${item_c[i].amt_ys}</amt_ys>
            <amt>${item_c[i].amt}</amt>
            <rem>${item_c[i].rem}</rem>
            <fyxm_name>${item_c[i].fyxm_name}</fyxm_name>
            <fyxm_no>${item_c[i].fyxm_no}</fyxm_no>
            <fyxm_lx>${item_c[i].fyxm_lx}</fyxm_lx>
        </ys_month_t>
                        `;
        }
        xml += `
                       </FormData>
                    </XForm>
                   `;
        PostXml(xml);
    }
}