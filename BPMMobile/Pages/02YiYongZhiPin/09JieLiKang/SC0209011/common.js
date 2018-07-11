function prepMsg() {


}

function tapEvent() {

}


function initData(data, flag) {

    var item = data.FormDataSet.洁丽康公司_销售预测提报_主表[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.单号);
    }

    $("#ftbr").val(item.提报人);
    $("#ftbbm").val(item.提报部门);
    $("#frq").val(FormatterTimeYMS(item.提报日期));
    $("#fzy").val(item.摘要);


    var item_c = data.FormDataSet.洁丽康公司_销售预测提报_子表1;
    for (var i = 0; i < item_c.length; i++) {
        itemidArr.push(item_c[i].itemid);
        var li = `
                <div id="mx">
                    <div class="mui-input-row itemtitle">
                        <label>明细列表项</label>
                        <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>
                    </div>
                    <div class="mui-row cutOffLine padding">
                        <div class="mui-col-xs-4" style="display:flex;">
                             <label>物料编号<i style="color:red;">*</i></label> 
                             <textarea rows="2" id="fwlbm" readonly>${item_c[i].物料编号}</textarea> 
                        </div>  
                        <div class="mui-col-xs-4" style="display:flex;">
                             <label>物料名称</label>
                             <textarea rows="2" id="fwlmc" readonly>${item_c[i].物料名称}</textarea>
                        </div> 
                        <div class="mui-col-xs-4" style="display:flex;">
                             <label>规格型号</label>
                             <textarea rows="2" id="fggxh" readonly>${item_c[i].规格型号}</textarea>
                        </div>
                    </div>         
                     <div class="mui-row cutOffLine padding">
                          <div class="mui-col-xs-4" style="display:flex;">
                             <label>计量单位</label> 
                             <textarea rows="2" id="fjldw" readonly>${item_c[i].计量单位}</textarea> 
                          </div>
                          <div class="mui-col-xs-4" style="display:flex;">
                              <label>数量<i style="color:red;">*</i></label>
                              <textarea rows="2" id="fsl" readonly>${item_c[i].数量}</textarea>
                          </div> 
                          <div class="mui-col-xs-4" style="display:flex;">
                              <label>备注</label>
                              <textarea rows="2" id="fbz" readonly>${item_c[i].备注}</textarea>                 
                          </div>  
                     </div> 
                </div>
                    `;
        $("#mxlist").append(li);
    }
}

function nodeControllerExp(NodeName) {

    if (String(NodeName).match('开始') != null) {

        mui.alert('请移步BPM处理');
    }
}

class Mx {
    constructor(fwlbm, fwlmc, fggxh, fjldw, fsl, fbz) {
        this.fwlbm = fwlbm;
        this.fwlmc = fwlmc;
        this.fggxh = fggxh;
        this.fjldw = fjldw;
        this.fsl = fsl;
        this.fbz = fbz;
    }
    check() {

      
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

    var pid = $("#stepId").val();
    var fbillno = $("#fbillno").val();
    var comment = $("#signSuggest").val();
    var nodeName = $("#nodeName").val();

    var ftbr = $("#ftbr").val();
    var ftbbm = $("#ftbbm").val();
    var frq = $("#frq").val();
    var fzy = $("#fzy").val();

    var mxlistArr = [];
    $("#mxlist").find("#mx").each(function () {
        var fwlbm = $(this).find("#fwlbm").val();
        var fwlmc = $(this).find("#fwlmc").val();
        var fggxh = $(this).find("#fggxh").val();
        var fjldw = $(this).find("#fjldw").val();
        var fsl = $(this).find("#fsl").val();
        var fbz = $(this).find("#fbz").val();

        var mx = new Mx(fwlbm, fwlmc, fggxh, fjldw, fsl, fbz);
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
                     <Action>${action}</Action>
                     <Comment>${comment}</Comment>
            
                     <ConsignEnabled>true</ConsignEnabled>
                     <ConsignUsers>${consignUserStr}</ConsignUsers>
                     <ConsignRoutingType>${consignRoutingType}</ConsignRoutingType>
                     <ConsignReturnType>${consignReturnType}</ConsignReturnType>
                     <InviteIndicateUsers>[]</InviteIndicateUsers>
                     <Context>{&quot;Routing&quot;:{}}</Context>
                     </Header>
                     <FormData>`;
            xml += ` <洁丽康公司_销售预测提报_主表>
            <单号>${fbillno}</单号>
            <提报人>${ftbr}</提报人>
            <提报部门>${ftbbm}</提报部门>
            <提报日期>${frq}</提报日期>
            <摘要>${fzy}</摘要>
            <TaskID>${$("#taskId").val()}</TaskID>
        </洁丽康公司_销售预测提报_主表>

                   `;
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `
       <洁丽康公司_销售预测提报_子表1>
            <RelationRowGuid>${i + 1}</RelationRowGuid>
            <RowPrimaryKeys>itemid=${itemidArr[i]}</RowPrimaryKeys>
            <序号>${i + 1}</序号>
            <物料编号>${mxlistArr[i].fwlbm}</物料编号>
            <物料名称>${mxlistArr[i].fwlmc}</物料名称>
            <规格型号>${mxlistArr[i].fggxh}</规格型号>
            <计量单位>${mxlistArr[i].fjldw}</计量单位>
            <数量>${mxlistArr[i].fsl}</数量>
            <备注>${mxlistArr[i].fbz}</备注>
        </洁丽康公司_销售预测提报_子表1>
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
                   <Action>${action}</Action>
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
        xml += ` <洁丽康公司_销售预测提报_主表>
            <单号>${fbillno}</单号>
            <提报人>${ftbr}</提报人>
            <提报部门>${ftbbm}</提报部门>
            <提报日期>${frq}</提报日期>
            <摘要>${fzy}</摘要>
            <TaskID>${$("#taskId").val()}</TaskID>
        </洁丽康公司_销售预测提报_主表>

                   `;
        for (var i = 0; i < mxlistArr.length; i++) {
            xml += `
       <洁丽康公司_销售预测提报_子表1>
            <RelationRowGuid>${i + 1}</RelationRowGuid>
            <RowPrimaryKeys>itemid=${itemidArr[i]}</RowPrimaryKeys>
            <序号>${i + 1}</序号>
            <物料编号>${mxlistArr[i].fwlbm}</物料编号>
            <物料名称>${mxlistArr[i].fwlmc}</物料名称>
            <规格型号>${mxlistArr[i].fggxh}</规格型号>
            <计量单位>${mxlistArr[i].fjldw}</计量单位>
            <数量>${mxlistArr[i].fsl}</数量>
            <备注>${mxlistArr[i].fbz}</备注>
        </洁丽康公司_销售预测提报_子表1>
                        `;
        }
        xml += `
                       </FormData>
                    </XForm>
                   `;
        PostXml(xml);
    }

}