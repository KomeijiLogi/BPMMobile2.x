function prepMsg() {
  
    tapEvent();
    var xml = `<?xml version= "1.0" ?>
                  <Requests>
                      <Params>
                      <Method>GetFormPostData</Method>
                      <ProcessName>洁丽康公司月销售任务完成情况分析提报</ProcessName>
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
       


    }).fail(function (e) {

    }).then(function () {
       
    });

}

function tapEvent() {
    $("#fxsry").on('tap', function () {
        var opidArr = [];
        XuntongJSBridge.call('selectPerson', { 'pType': '1' }, function (result) {

            if (String(Object.prototype.toString.call(result)).match('String') != null) {
                result = JSON.parse(result);
            }

            if (result.success == true || result.success == "true") {

                for (var i = 0; i < result.data.persons.length; i++) {

                    opidArr.push(result.data.persons[i].openId);

                }
                var getPerInfo = $.ajax({
                    type: "POST",
                    url: "/api/bpm/PostAccount",
                    data: { "ids": opidArr },
                    beforeSend: function (XHR) {
                        XHR.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem('ticket'));
                    }
                }).done((data) => {
                    console.info(data);
                }).fail((e) => {
                    console.error(e);
                });
                getPerInfo.then((data) => {
                    var xml = `<?xml version= "1.0" ?>
                                 <Requests>
                                 <Params>
                                 <DataSource>PS</DataSource>
                                 <ID>erpcloud_公用_获取个人信息</ID>
                                 <Type>1</Type>
                                 <Method>GetUserDataProcedure</Method>
                                 <ProcedureName>erpcloud_公用_获取个人信息</ProcedureName>
                                 <Filter><fno>${data.data[0].phone}</fno></Filter>
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
                        var pio = provideData.Tables[0].Rows[0];
                        console.info(pio);
                        $("#fno").val(pio.EMPLID);
                        $("#fxsry").val(pio.NAME);

                    }).fail(function (e) {
                        console.log(e);
                     });
                })

            }
        });

    });

    $("input[type='number']").on('input', function () {

        var fdyrw_xse = isNaN(parseFloat($("#fdyrw_xse").val())) ? 1 : parseFloat($("#fdyrw_xse").val());
        var fdywc_xse = isNaN(parseFloat($("#fdywc_xse").val())) ? 1 : parseFloat($("#fdywc_xse").val());
        var fwcl_xse = parseFloat((fdywc_xse / fdyrw_xse) * 100).toFixed(2);
        $("#fwcl_xse").val(fwcl_xse);

        var fljrw_xse = isNaN(parseFloat($("#fljrw_xse").val())) ? 1 : parseFloat($("#fljrw_xse").val());
        var fljwc_xse = isNaN(parseFloat($("#fljwc_xse").val())) ? 1 : parseFloat($("#fljwc_xse").val());
        var fljwcl_xse = parseFloat((fljwc_xse / fljrw_xse) * 100).toFixed(2);
        $("#fljwcl_xse").val(fljwcl_xse);

        var fdyrw_hke = isNaN(parseFloat($("#fdyrw_hke").val())) ? 1 : parseFloat($("#fdyrw_hke").val());
        var fdywc_hke = isNaN(parseFloat($("#fdywc_hke").val())) ? 1 : parseFloat($("#fdywc_hke").val());
        var fwcl_hke = parseFloat((fdywc_hke / fdyrw_hke) * 100).toFixed(2);
        $("#fwcl_hke").val(fwcl_hke);

        var fljrw_hke = isNaN(parseFloat($("#fljrw_hke").val())) ? 1 : parseFloat($("#fljrw_hke").val());
        var fljwc_hke = isNaN(parseFloat($("#fljwc_hke").val())) ? 1 : parseFloat($("#fljwc_hke").val());
        var fljwcl_hke = parseFloat((fljwc_hke / fljrw_hke) * 100).toFixed(2);
        $("#fljwcl_hke").val(fljwcl_hke);


    });

    var opts = { "type": "month" };

    $("#fy").on('tap', function () {

        var picker = new mui.DtPicker(opts);

        picker.show(function (rs) {

            $("#fy").val(rs.text);
        });
        
    });
}

function initData(data, flag) {
    var item = data.FormDataSet.洁丽康公司_月销售任务完成情况分析提报_主表[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.fbillno);
    }
    $("#fxsry").val(item.销售人员);
    $("#fno").val(item.销售人员工号);
    $("#fxsqy").val(item.销售区域);
    $("#fy").val(item.月);
    $("#fdyrw_xse").val(item.销售额任务);
    $("#fdywc_xse").val(item.销售额实际);
    $("#fwcl_xse").val(item.销售额完成率);
    $("#fljrw_xse").val(item.累计销售额任务);
    $("#fljwc_xse").val(item.累计销售额实际);
    $("#fljwcl_xse").val(item.累计销售额完成率);
    $("#fdyrw_hke").val(item.回款额任务);
    $("#fdywc_hke").val(item.回款额实际);
    $("#fwcl_hke").val(item.回款额完成率);
    $("#fljrw_hke").val(item.累计回款额任务);
    $("#fljwc_hke").val(item.累计回款额实际);
    $("#fljwcl_hke").val(item.累计回款额完成率);
    $("#fdywc_fc").val(item.销售发出金额实际);
    $("#fljwc_fc").val(item.累计销售发出金额实际);
    $("#fyyfx1").val(item.销售额任务未完成原因分析);
    $("#fyyfx2").val(item.回款任务未完成原因分析);
    $("#fbz").val(item.备注);


}

action = '同意';
function nodeControllerExp(NodeName) {
    if (String(NodeName).match('开始') != null) {
        tapEvent();
        $("input[type='number']").removeAttr('readonly');

    } else if (String(NodeName).match('销售人员') != null) {
        $("#fyyfx1").removeAttr('readonly');
        $("#fyyfx2").removeAttr('readonly');
        $("#fbz").removeAttr('readonly');
        action = '提交';
    }
}

function checkNes() {
    var nodeName = $("#nodeName").val();
    if (String(nodeName).match('提交人') != null) {
        if (!$("#fyyfx1").val() && (parseFloat($("#fwcl_xse").val())< 100)) {
            mui.toast('请填写销售额任务未完成原因分析');
            return false;
        }
        if (!$("#fyyfx2").val() && (parseFloat($("#fwcl_hke").val()) < 100)){
            mui.toast('请填写回款任务未完成原因分析');
            return false;
        }
    }
    return true;
}
function Save() {

    var fxsry = $("#fxsry").val();
    var fno = $("#fno").val();

    var fxsqy = $("#fxsqy").val();
    var fy = $("#fy").val();
    var fdyrw_xse = $("#fdyrw_xse").val();
    var fdywc_xse = $("#fdywc_xse").val();
    var fwcl_xse = $("#fwcl_xse").val();
    var fljrw_xse = $("#fljrw_xse").val();
    var fljwc_xse = $("#fljwc_xse").val();
    var fljwcl_xse = $("#fljwcl_xse").val();
    var fdyrw_hke = $("#fdyrw_hke").val();
    var fdywc_hke = $("#fdywc_hke").val();
    var fwcl_hke = $("#fwcl_hke").val();
    var fljrw_hke = $("#fljrw_hke").val();
    var fljwc_hke = $("#fljwc_hke").val();
    var fljwcl_hke = $("#fljwcl_hke").val();
    var fdywc_fc = $("#fdywc_fc").val();
    var fljwc_fc = $("#fljwc_fc").val();
    var fyyfx1 = $("#fyyfx1").val();
    var fyyfx2 = $("#fyyfx2").val();
    var fbz = $("#fbz").val();
    if (!fxsry) {
        mui.toast('请填写销售人员');
        return;
    }
    if (!fxsqy) {
        mui.toast('请填写销售区域');
        return;
    }

    if (!fy) {
        mui.toast('请选择月份');
        return;
    }
    if (!fdyrw_xse) {
        mui.toast('请填写销售额当月任务');
        return;
    }
    if (!fdywc_xse) {
        mui.toast('请填写销售额当月完成');
        return;
    }
    if (!fljrw_xse) {
        mui.toast('请填写销售额累计任务');
        return;
    }
    if (!fljwc_xse) {
        mui.toast('请填写销售额累计完成');
        return;
    }
    if (!fdyrw_hke) {
        mui.toast('请填写回款额当月任务');
        return;
    }
    if (!fdywc_hke) {
        mui.toast('请填写回款额当月完成');
        return;
    }

    if (!fljrw_hke) {
        mui.toast('请填写回款额累计任务');
        return;
    }
    if (!fljwc_hke) {
        mui.toast('请填写回款额累计完成');
        return;
    }
    if (!fdywc_fc) {
        mui.toast('请填写销售发出金额当月完成');
        return;
    }
    if (!fljwc_fc) {
        mui.toast('请填写销售发出金额累计完成');
        return;
    }


    var btnArry = ["取消", "确定"];
    mui.confirm('即将提交，是否确定？', '提交确认提醒', btnArry, function (e) {
        if (e.index == 1) {
            var xml = `<?xml version="1.0"?>
                        <XForm>
                            <Header>
                                <Method>Post</Method>
                                <ProcessName>洁丽康公司月销售任务完成情况分析提报</ProcessName>
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
                        <洁丽康公司_月销售任务完成情况分析提报_主表>
            <单号>自动生成</单号>
            <销售人员>${fxsry}</销售人员>
            <销售区域>${fxsqy}</销售区域>
            <月>${fy}</月>
            <月1></月1>
            <销售额任务>${fdyrw_xse}</销售额任务>
            <销售额实际>${fdywc_xse}</销售额实际>
            <销售额完成率>${fwcl_xse}</销售额完成率>
            <累计销售额任务>${fljrw_xse}</累计销售额任务>
            <累计销售额实际>${fljwc_xse}</累计销售额实际>
            <累计销售额完成率>${fljwcl_xse}</累计销售额完成率>
            <回款额任务>${fdyrw_hke}</回款额任务>
            <回款额实际>${fdywc_hke}</回款额实际>
            <回款额完成率>${fwcl_hke}</回款额完成率>
            <累计回款额任务>${fljrw_hke}</累计回款额任务>
            <累计回款额实际>${fljwc_hke}</累计回款额实际>
            <累计回款额完成率>${fljwcl_hke}</累计回款额完成率>
            <销售发出金额实际>${fdywc_fc}</销售发出金额实际>
            <累计销售发出金额实际>${fljwc_fc}</累计销售发出金额实际>
            <销售额任务未完成原因分析>${fyyfx1}</销售额任务未完成原因分析>
            <回款任务未完成原因分析>${fyyfx2}</回款任务未完成原因分析>
            <备注>${fbz}</备注>
            <销售人员工号>${fno}</销售人员工号>
        </洁丽康公司_月销售任务完成情况分析提报_主表>
                   `;
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

    var fxsry = $("#fxsry").val();
    var fno = $("#fno").val();

    var fxsqy = $("#fxsqy").val();
    var fy = $("#fy").val();
    var fdyrw_xse = $("#fdyrw_xse").val();
    var fdywc_xse = $("#fdywc_xse").val();
    var fwcl_xse = $("#fwcl_xse").val();
    var fljrw_xse = $("#fljrw_xse").val();
    var fljwc_xse = $("#fljwc_xse").val();
    var fljwcl_xse = $("#fljwcl_xse").val();
    var fdyrw_hke = $("#fdyrw_hke").val();
    var fdywc_hke = $("#fdywc_hke").val();
    var fwcl_hke = $("#fwcl_hke").val();
    var fljrw_hke = $("#fljrw_hke").val();
    var fljwc_hke = $("#fljwc_hke").val();
    var fljwcl_hke = $("#fljwcl_hke").val();
    var fdywc_fc = $("#fdywc_fc").val();
    var fljwc_fc = $("#fljwc_fc").val();
    var fyyfx1 = $("#fyyfx1").val();
    var fyyfx2 = $("#fyyfx2").val();
    var fbz = $("#fbz").val();
    if (!fxsry) {
        mui.toast('请填写销售人员');
        return;
    }
    if (!fxsqy) {
        mui.toast('请填写销售区域');
        return;
    }

    if (!fy) {
        mui.toast('请选择月份');
        return;
    }
    if (!fdyrw_xse) {
        mui.toast('请填写销售额当月任务');
        return;
    }
    if (!fdywc_xse) {
        mui.toast('请填写销售额当月完成');
        return;
    }
    if (!fljrw_xse) {
        mui.toast('请填写销售额累计任务');
        return;
    }
    if (!fljwc_xse) {
        mui.toast('请填写销售额累计完成');
        return;
    }
    if (!fdyrw_hke) {
        mui.toast('请填写回款额当月任务');
        return;
    }
    if (!fdywc_hke) {
        mui.toast('请填写回款额当月完成');
        return;
    }

    if (!fljrw_hke) {
        mui.toast('请填写回款额累计任务');
        return;
    }
    if (!fljwc_hke) {
        mui.toast('请填写回款额累计完成');
        return;
    }
    if (!fdywc_fc) {
        mui.toast('请填写销售发出金额当月完成');
        return;
    }
    if (!fljwc_fc) {
        mui.toast('请填写销售发出金额累计完成');
        return;
    }

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
                        <洁丽康公司_月销售任务完成情况分析提报_主表>
            <单号>${fbillno}</单号>
            <销售人员>${fxsry}</销售人员>
            <销售区域>${fxsqy}</销售区域>
            <月>${fy}</月>
            <月1></月1>
            <销售额任务>${fdyrw_xse}</销售额任务>
            <销售额实际>${fdywc_xse}</销售额实际>
            <销售额完成率>${fwcl_xse}</销售额完成率>
            <累计销售额任务>${fljrw_xse}</累计销售额任务>
            <累计销售额实际>${fljwc_xse}</累计销售额实际>
            <累计销售额完成率>${fljwcl_xse}</累计销售额完成率>
            <回款额任务>${fdyrw_hke}</回款额任务>
            <回款额实际>${fdywc_hke}</回款额实际>
            <回款额完成率>${fwcl_hke}</回款额完成率>
            <累计回款额任务>${fljrw_hke}</累计回款额任务>
            <累计回款额实际>${fljwc_hke}</累计回款额实际>
            <累计回款额完成率>${fljwcl_hke}</累计回款额完成率>
            <销售发出金额实际>${fdywc_fc}</销售发出金额实际>
            <累计销售发出金额实际>${fljwc_fc}</累计销售发出金额实际>
            <销售额任务未完成原因分析>${fyyfx1}</销售额任务未完成原因分析>
            <回款任务未完成原因分析>${fyyfx2}</回款任务未完成原因分析>
            <备注>${fbz}</备注>
            <销售人员工号>${fno}</销售人员工号>
        </洁丽康公司_月销售任务完成情况分析提报_主表>
                   `;
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

    var fxsry = $("#fxsry").val();
    var fno = $("#fno").val();

    var fxsqy = $("#fxsqy").val();
    var fy = $("#fy").val();
    var fdyrw_xse = $("#fdyrw_xse").val();
    var fdywc_xse = $("#fdywc_xse").val();
    var fwcl_xse = $("#fwcl_xse").val();
    var fljrw_xse = $("#fljrw_xse").val();
    var fljwc_xse = $("#fljwc_xse").val();
    var fljwcl_xse = $("#fljwcl_xse").val();
    var fdyrw_hke = $("#fdyrw_hke").val();
    var fdywc_hke = $("#fdywc_hke").val();
    var fwcl_hke = $("#fwcl_hke").val();
    var fljrw_hke = $("#fljrw_hke").val();
    var fljwc_hke = $("#fljwc_hke").val();
    var fljwcl_hke = $("#fljwcl_hke").val();
    var fdywc_fc = $("#fdywc_fc").val();
    var fljwc_fc = $("#fljwc_fc").val();
    var fyyfx1 = $("#fyyfx1").val();
    var fyyfx2 = $("#fyyfx2").val();
    var fbz = $("#fbz").val();

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
            xml += `
           <洁丽康公司_月销售任务完成情况分析提报_主表>
            <单号>${fbillno}</单号>
            <销售人员>${fxsry}</销售人员>
            <销售区域>${fxsqy}</销售区域>
            <月>${fy}</月>
            <月1></月1>
            <销售额任务>${fdyrw_xse}</销售额任务>
            <销售额实际>${fdywc_xse}</销售额实际>
            <销售额完成率>${fwcl_xse}</销售额完成率>
            <累计销售额任务>${fljrw_xse}</累计销售额任务>
            <累计销售额实际>${fljwc_xse}</累计销售额实际>
            <累计销售额完成率>${fljwcl_xse}</累计销售额完成率>
            <回款额任务>${fdyrw_hke}</回款额任务>
            <回款额实际>${fdywc_hke}</回款额实际>
            <回款额完成率>${fwcl_hke}</回款额完成率>
            <累计回款额任务>${fljrw_hke}</累计回款额任务>
            <累计回款额实际>${fljwc_hke}</累计回款额实际>
            <累计回款额完成率>${fljwcl_hke}</累计回款额完成率>
            <销售发出金额实际>${fdywc_fc}</销售发出金额实际>
            <累计销售发出金额实际>${fljwc_fc}</累计销售发出金额实际>
            <销售额任务未完成原因分析>${fyyfx1}</销售额任务未完成原因分析>
            <回款任务未完成原因分析>${fyyfx2}</回款任务未完成原因分析>
            <备注>${fbz}</备注>
            <销售人员工号>${fno}</销售人员工号>
        </洁丽康公司_月销售任务完成情况分析提报_主表>
                   `;
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
        xml += `
           <洁丽康公司_月销售任务完成情况分析提报_主表>
            <单号>${fbillno}</单号>
            <销售人员>${fxsry}</销售人员>
            <销售区域>${fxsqy}</销售区域>
            <月>${fy}</月>
            <月1></月1>
            <销售额任务>${fdyrw_xse}</销售额任务>
            <销售额实际>${fdywc_xse}</销售额实际>
            <销售额完成率>${fwcl_xse}</销售额完成率>
            <累计销售额任务>${fljrw_xse}</累计销售额任务>
            <累计销售额实际>${fljwc_xse}</累计销售额实际>
            <累计销售额完成率>${fljwcl_xse}</累计销售额完成率>
            <回款额任务>${fdyrw_hke}</回款额任务>
            <回款额实际>${fdywc_hke}</回款额实际>
            <回款额完成率>${fwcl_hke}</回款额完成率>
            <累计回款额任务>${fljrw_hke}</累计回款额任务>
            <累计回款额实际>${fljwc_hke}</累计回款额实际>
            <累计回款额完成率>${fljwcl_hke}</累计回款额完成率>
            <销售发出金额实际>${fdywc_fc}</销售发出金额实际>
            <累计销售发出金额实际>${fljwc_fc}</累计销售发出金额实际>
            <销售额任务未完成原因分析>${fyyfx1}</销售额任务未完成原因分析>
            <回款任务未完成原因分析>${fyyfx2}</回款任务未完成原因分析>
            <备注>${fbz}</备注>
            <销售人员工号>${fno}</销售人员工号>
        </洁丽康公司_月销售任务完成情况分析提报_主表>
                   `;
        xml += `
                       </FormData>
                    </XForm>
                   `;
        PostXml(xml);

    }
}