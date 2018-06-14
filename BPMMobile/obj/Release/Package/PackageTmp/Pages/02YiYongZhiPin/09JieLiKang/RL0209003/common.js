function prepMsg() {
    $("#fdate").val(getNowFormatDate(2));
    tapEvent();
    var xml = `<?xml version= "1.0" ?>
                  <Requests>
                      <Params>
                      <Method>GetFormPostData</Method>
                      <ProcessName>洁丽康公司员工合同续签申请</ProcessName>
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
        $("#fssgs").val(item.所属公司);

    }).fail(function (e) {

    });
}

function tapEvent() {
  

    $("#fno,#fname").on('tap', function () {
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
                        $("#fname").val(pio.NAME);
                        $("#fbm").val(pio.fdeptname);
                        $("#fzw").val(pio.zhiwei);
                        $("#frzrq").val(FormatterTime_Y_M_S(pio.HIRE_DT.year, pio.HIRE_DT.month, pio.HIRE_DT.day));
                      

                    }).fail(function (e) {

                    });
                });
            }
        });
    });


    showDtPicker('#fjsrq');
}

function initData(data, flag) {
    var item = data.FormDataSet.洁丽康公司_员工合同续签申请_主表[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.fbillno);
    }
    $("#fno").val(item.工号);
    $("#fname").val(item.姓名);
    $("#fdate").val(FormatterTimeYMS(item.填写日期));
    $("#fbm").val(item.部门);
    $("#fzw").val(item.职位);
    $("#frzrq").val(FormatterTimeYMS(item.入职日期));
    $("#fjsrq").val(FormatterTimeYMS(item.合同预计结束日期));
    $("#fqdnx").val(item.拟下次签订年限);
    $("#fbz").val(item.备注);
    $("#fssgs").val(item.所属公司);

}

function nodeControllerExp(NodeName) {
    if (String(NodeName).match('开始') != null) {
        tapEvent();
        $("#fqdnx,#fbz").removeAttr('readonly');

    } 
}

function Save() {
    var fno = $("#fno").val();
    var fname = $("#fname").val();
    var fdate = $("#fdate").val();
    var fbm = $("#fbm").val();
    var fzw = $("#fzw").val();
    var frzrq = $("#frzrq").val();
    var fjsrq = $("#fjsrq").val();
    var fqdnx = $("#fqdnx").val();
    var fbz = $("#fbz").val();
    var fssgs = $("#fssgs").val();
    if (!fjsrq) {
        mui.toast('请选择合同预计结束日期');
        return;
    }
    if (!fqdnx) {
        mui.toast('请填写拟下次签订年限');
        return;
    }
    var btnArry = ["取消", "确定"];
    mui.confirm('即将提交，是否确定？', '提交确认提醒', btnArry, function (e) {
        if (e.index == 1) {
            var xml = `<?xml version="1.0"?>
                        <XForm>
                            <Header>
                                <Method>Post</Method>
                                <ProcessName>洁丽康公司员工合同续签申请</ProcessName>
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
            xml += ` <洁丽康公司_员工合同续签申请_主表>
                        <单号>自动生成</单号>
                        <工号>${fno}</工号>
                        <姓名>${fname}</姓名>
                        <填写日期>${fdate}</填写日期>
                        <部门>${fbm}</部门>
                        <职位>${fzw}</职位>
                        <入职日期>${frzrq}</入职日期>
                        <合同预计结束日期>${fjsrq}</合同预计结束日期>
                        <拟下次签订年限>${fqdnx}</拟下次签订年限>
                        <备注>${fbz}</备注>
                        <所属公司>${fssgs}</所属公司>
                    </洁丽康公司_员工合同续签申请_主表>

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

    var fno = $("#fno").val();
    var fname = $("#fname").val();
    var fdate = $("#fdate").val();
    var fbm = $("#fbm").val();
    var fzw = $("#fzw").val();
    var frzrq = $("#frzrq").val();
    var fjsrq = $("#fjsrq").val();
    var fqdnx = $("#fqdnx").val();
    var fbz = $("#fbz").val();
    var fssgs = $("#fssgs").val();
    if (!fjsrq) {
        mui.toast('请选择合同预计结束日期');
        return;
    }
    if (!fqdnx) {
        mui.toast('请填写拟下次签订年限');
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
            xml += ` <洁丽康公司_员工合同续签申请_主表>
                        <单号>${fbillno}</单号>
                        <工号>${fno}</工号>
                        <姓名>${fname}</姓名>
                        <填写日期>${fdate}</填写日期>
                        <部门>${fbm}</部门>
                        <职位>${fzw}</职位>
                        <入职日期>${frzrq}</入职日期>
                        <合同预计结束日期>${fjsrq}</合同预计结束日期>
                        <拟下次签订年限>${fqdnx}</拟下次签订年限>
                        <备注>${fbz}</备注>
                        <所属公司>${fssgs}</所属公司>
                    </洁丽康公司_员工合同续签申请_主表>

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

function checkNes() {

    return true;
}

function AgreeOrConSign() {
    var pid = $("#stepId").val();
    var fbillno = $("#fbillno").val();
    var comment = $("#signSuggest").val();
    var nodeName = $("#nodeName").val();


    var fno = $("#fno").val();
    var fname = $("#fname").val();
    var fdate = $("#fdate").val();
    var fbm = $("#fbm").val();
    var fzw = $("#fzw").val();
    var frzrq = $("#frzrq").val();
    var fjsrq = $("#fjsrq").val();
    var fqdnx = $("#fqdnx").val();
    var fbz = $("#fbz").val();
    var fssgs = $("#fssgs").val();

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
            xml += ` <洁丽康公司_员工合同续签申请_主表>
                        <单号>${fbillno}</单号>
                        <工号>${fno}</工号>
                        <姓名>${fname}</姓名>
                        <填写日期>${fdate}</填写日期>
                        <部门>${fbm}</部门>
                        <职位>${fzw}</职位>
                        <入职日期>${frzrq}</入职日期>
                        <合同预计结束日期>${fjsrq}</合同预计结束日期>
                        <拟下次签订年限>${fqdnx}</拟下次签订年限>
                        <备注>${fbz}</备注>
                        <所属公司>${fssgs}</所属公司>
                    </洁丽康公司_员工合同续签申请_主表>

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
        xml += ` <洁丽康公司_员工合同续签申请_主表>
                        <单号>${fbillno}</单号>
                        <工号>${fno}</工号>
                        <姓名>${fname}</姓名>
                        <填写日期>${fdate}</填写日期>
                        <部门>${fbm}</部门>
                        <职位>${fzw}</职位>
                        <入职日期>${frzrq}</入职日期>
                        <合同预计结束日期>${fjsrq}</合同预计结束日期>
                        <拟下次签订年限>${fqdnx}</拟下次签订年限>
                        <备注>${fbz}</备注>
                        <所属公司>${fssgs}</所属公司>
                    </洁丽康公司_员工合同续签申请_主表>

                   `;
        xml += `
                       </FormData>
                    </XForm>
                   `;
        PostXml(xml);
    }
}