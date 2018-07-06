function prepMsg() {

}

var item = null;
var item_c = [];
function initData(data, flag) {
    item = data.FormDataSet.海盛公司_售后领料申请单_主表[0];

    if (flag) {

        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.BPM单据编码);
    }
    $("#fsqdbm").val(item.申请单编码);
    //$("#fxqlx").val(item.需求类型);
    $("#fgdbm").val(item.工单编码);
    $("#fsbbm").val(item.设备编码);
    $("#fsbmc").val(item.设备名称);
    $("#fwlbm").val(item.物料编码);
    $("#fwlmc").val(item.物料名称);
    $("#fwlgg").val(item.物料规格);
    $("#fgzlb").val(item.故障类别);
    $("#fgzms").val(item.故障描述);
    $("#ffwkh").val(item.服务客户);
    $("#fbxks").val(FormatterTimeYMS(item.保修开始日期));
    $("#fsjr").val(item.收件人);
    $("#fbz").val(item.备注);
    $("#fbxjz").val(FormatterTimeYMS(item.保修截止日期));


    item_c = data.FormDataSet.海盛公司_售后领料申请单_子表;
    for (var i = 0; i < item_c.length; i++) {
        var li = `
                    <div id="mx" class="mui-card">
                          <div class="mui-input-row itemtitle">
                             <label>明细列表项</label>
                             <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>
                          </div>
                       <div class="mui-row cutOffLine padding">
                            <div class="mui-col-xs-3" style="display:flex;">
                              <label>配件编码</label>
                              <textarea rows="2" id="fpjbm" readonly>${item_c[i].配件编码}</textarea>
                           </div>   
                           <div class="mui-col-xs-3" style="display:flex;">
                               <label>配件名称</label>
                               <textarea rows="2" id="fpjmc" readonly>${item_c[i].配件名称}</textarea>
                           </div>
                           <div class="mui-col-xs-3" style="display:flex;">
                               <label>规格型号</label>
                               <textarea rows="2" id="fggxh" readonly>${item_c[i].规格型号}</textarea>
                           </div>
                            <div class="mui-col-xs-3" style="display:flex;">
                               <label>计量单位</label>
                               <textarea rows="2" id="fjldw" readonly>${item_c[i].计量单位}</textarea>
                           </div>  
                       </div>
                          <div class="mui-row cutOffLine padding">
                            <div class="mui-col-xs-3" style="display:flex;">
                              <label>数量</label>
                              <textarea rows="2" id="fsl" readonly>${item_c[i].数量}</textarea>
                           </div>   
                           <div class="mui-col-xs-3" style="display:flex;">
                               <label>是否收费</label>
                               <textarea rows="2" id="fsfsf" readonly>${item_c[i].是否收费}</textarea>
                           </div>
                            <div class="mui-col-xs-3" style="display:flex;">
                                <label>需求类型</label>
                                <textarea rows="2" id="fxqlx" readonly>${item_c[i].需求类型}</textarea>   
                            </div>
                           <div class="mui-col-xs-3" style="display:flex;">
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
        mui.alert('请移步网页版BPM处理');
        return;
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
        <海盛公司_售后领料申请单_主表>
            <BPM单据编码>${item.BPM单据编码}</BPM单据编码>
            <申请单编码>${item.申请单编码}</申请单编码>
           
            <工单编号>${item.工单编号}</工单编号>
            <设备编码>${item.设备编码}</设备编码>
            <设备名称>${item.设备名称}</设备名称>
            <物料编码>${item.物料编码}</物料编码>
            <物料名称>${item.物料名称}</物料名称>
            <物料规格>${item.物料规格}</物料规格>
            <故障类别>${item.故障类别}</故障类别>
            <故障描述>${item.故障描述}</故障描述>
            <服务客户>${item.服务客户}</服务客户>
            <保修开始日期>${item.保修开始日期}</保修开始日期>
            <收件人>${item.收件人}</收件人>
            <备注>${item.备注}</备注>
            <保修截止日期>${item.保修截止日期}</保修截止日期>
        </海盛公司_售后领料申请单_主表>
                    `;
            for (var i = 0; i < item_c.length; i++) {
                xml += `
       <海盛公司_售后领料申请单_子表>
            <RelationRowGuid>${i + 1}</RelationRowGuid>
            <RowPrimaryKeys>${encodeURI('序号')}=${item_c[i].序号}</RowPrimaryKeys>
            <配件编码>${item_c[i].配件编码}</配件编码>
            <配件名称>${item_c[i].配件名称}</配件名称>
            <规格型号>${item_c[i].规格型号}</规格型号>
            <计量单位>${item_c[i].计量单位}</计量单位>
            <数量>${item_c[i].数量}</数量>
            <是否收费>${item_c[i].是否收费}</是否收费>
             <需求类型>${item_c[i].需求类型}</需求类型>
            <备注>${item_c[i].备注}</备注>
        </海盛公司_售后领料申请单_子表>
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
        <海盛公司_售后领料申请单_主表>
            <BPM单据编码>${item.BPM单据编码}</BPM单据编码>
            <申请单编码>${item.申请单编码}</申请单编码>
            <需求类型>${item.需求类型}</需求类型>
            <工单编号>${item.工单编号}</工单编号>
            <设备编码>${item.设备编码}</设备编码>
            <设备名称>${item.设备名称}</设备名称>
            <物料编码>${item.物料编码}</物料编码>
            <物料名称>${item.物料名称}</物料名称>
            <物料规格>${item.物料规格}</物料规格>
            <故障类别>${item.故障类别}</故障类别>
            <故障描述>${item.故障描述}</故障描述>
            <服务客户>${item.服务客户}</服务客户>
            <保修开始日期>${item.保修开始日期}</保修开始日期>
            <收件人>${item.收件人}</收件人>
            <备注>${item.备注}</备注>
            <保修截止日期>${item.保修截止日期}</保修截止日期>
        </海盛公司_售后领料申请单_主表>
                    `;
        for (var i = 0; i < item_c.length; i++) {
            xml += `
       <海盛公司_售后领料申请单_子表>
            <RelationRowGuid>${i + 1}</RelationRowGuid>
            <RowPrimaryKeys>${encodeURI('序号')}=${item_c[i].序号}</RowPrimaryKeys>
            <配件编码>${item_c[i].配件编码}</配件编码>
            <配件名称>${item_c[i].配件名称}</配件名称>
            <规格型号>${item_c[i].规格型号}</规格型号>
            <计量单位>${item_c[i].计量单位}</计量单位>
            <数量>${item_c[i].数量}</数量>
            <是否收费>${item_c[i].是否收费}</是否收费>
 <需求类型>${item_c[i].需求类型}</需求类型>
            <备注>${item_c[i].备注}</备注>
        </海盛公司_售后领料申请单_子表>
                       `;
        }
        xml += `
                       </FormData>
                    </XForm>
                   `;
        console.log(xml);
        PostXml(xml);
    }
}