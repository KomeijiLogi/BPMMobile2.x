function prepMsg() {

    $("#fdate").val(getNowFormatDate(2));
    tapEvent();
    var xml = `<?xml version= "1.0" ?>
                  <Requests>
                      <Params>
                      <Method>GetFormPostData</Method>
                      <ProcessName>洁丽康公司员工参保申请</ProcessName>
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
        $("#fno").val(item.工号);
        $("#fname").val(item.姓名);

    }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
        if (XMLHttpRequest.status == "401") {
            mui.alert('授权过期，请重新打开页面');;
        } else if (XMLHttpRequest.status == "500") {
            mui.alert('服务器内部错误');
        }
    }).then((data) => {
        getPerInfo();
    });

}




function getPerInfo() {
    var fno = $("#fno").val();
    var xml = `<?xml version= "1.0" ?>
                <Requests>
                 <Params>
                  <DataSource>PS</DataSource>
                   <ID>erpcloud_公用_获取个人信息</ID>
                   <Type>1</Type>
                   <Method>GetUserDataProcedure</Method>
                   <ProcedureName>erpcloud_公用_获取个人信息</ProcedureName>
                    <Filter><fno>${fno}</fno></Filter>
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

        var pInfo = provideData.Tables[0].Rows[0];
        console.log(pInfo);

        $("#flxdh").val(pInfo.PHONE);
        $("#fssgs").val(pInfo.fsscompany);
        $("#fbm").val(pInfo.fdeptname);
        $("#fzw").val(pInfo.zhiwei);
        $("#frzrq").val(FormatterTime_Y_M_S(pInfo.HIRE_DT.year, pInfo.HIRE_DT.month, pInfo.HIRE_DT.day));
        $("#fsfzh").val(pInfo.NATIONAL_ID);
        if (pInfo.SEX == 'M') {
            $("#fsb").val('男');
        } else {
            $("#fsb").val('女');
        }
        $("#fcsrq").val(FormatterTime_Y_M_S(pInfo.BIRTHDATE.year, pInfo.BIRTHDATE.month, pInfo.BIRTHDATE.day));
        $("#fjtdz").val(pInfo.HPS_VALUE03);
        

    }).fail(function (e) {

    });
}

function tapEvent() {

    var fhkxzdata = [
        {
            value: '',
            text:'城镇户口'
        },
        {
            value: '',
            text: '农业户口'
        }
    ];

    showPicker('fhkxz', fhkxzdata);

    showDtPicker('#fdate');
    showDtPicker('#fsbqjny');
    showDtPicker('#fsbzdjzny');


}


function initData(data, flag) {
    var item = data.FormDataSet.洁丽康公司_员工参保申请_主表[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.fbillno);
    }

    $("#fno").val(item.工号);
    $("#fname").val(item.姓名);
    $("#fdate").val(FormatterTimeYMS(item.申请日期));
    $("#flxdh").val(item.联系电话);
    $("#fssgs").val(item.所属公司);
    $("#fbm").val(item.部门);
    $("#fzw").val(item.职位);
    $("#frzrq").val(FormatterTimeYMS(item.入职日期));
    $("#fsfzh").val(item.身份证号);
    $("#fsb").val(item.性别);
    $("#fcsrq").val(FormatterTimeYMS(item.出生日期));
    $("#fhkxz").val(item.户口性质);
    $("#fhkszd").val(item.户口所在地);
    $("#fjtdz").val(item.家庭地址);
    $("#fgzcs").val(item.工作城市);
    $("#fsbjncs").val(item.社保缴纳城市);
    $("#fsbqjny").val(FormatterTimeYMS(item.社保起缴年月));
    $("#fsbzdjzny").val(FormatterTimeYMS(item.社保中断缴至年月));


}

function nodeControllerExp(NodeName) {

    if (String(NodeName).match('开始') != null) {
        tapEvent();
        $("#fhkszd,#fjtdz,#fgzcs,#fsbjncs").removeAttr('readonly');

    } 
}


function Save() {
    var fno = $("#fno").val();
    var fname = $("#fname").val();
    var fdate = $("#fdate").val();
    var flxdh = $("#flxdh").val();
    var fssgs = $("#fssgs").val();
    var fbm = $("#fbm").val();
    var fzw = $("#fzw").val();
    var frzrq = $("#frzrq").val();
    var fsfzh = $("#fsfzh").val();
    var fsb = $("#fsb").val();
    var fcsrq = $("#fcsrq").val();
    var fhkxz = $("#fhkxz").val();
    var fhkszd = $("#fhkszd").val();
    var fjtdz = $("#fjtdz").val();
    var fgzcs = $("#fgzcs").val();
    var fsbjncs = $("#fsbjncs").val();
    var fsbqjny = $("#fsbqjny").val();
    var fsbzdjzny = $("#fsbzdjzny").val();
    if (!fhkxz) {
        mui.toast('请选择户口性质');
        return;
    }
    if (!fhkszd) {
        mui.toast('请填写户口所在地');
        return;
    }
    if (!fjtdz) {
        mui.toast('请填写家庭地址');
        return;
    }
    if (!fgzcs) {
        mui.toast('请填写工作城市');
        return;
    }
    if (!fsbjncs) {
        mui.toast('请填写社保缴纳城市');
        return;
    }
    if (!fsbqjny) {
        mui.toast('请选择社保起缴年月');
        return;
    }

    var btnArry = ["取消", "确定"];
    mui.confirm('即将提交，是否确定？', '提交确认提醒', btnArry, function (e) {
        if (e.index == 1) {
            var xml = `<?xml version="1.0"?>
                        <XForm>
                            <Header>
                                <Method>Post</Method>
                                <ProcessName>洁丽康公司员工参保申请</ProcessName>
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
                 <洁丽康公司_员工参保申请_主表>
                    <单号>自动生成</单号>
                    <工号>${fno}</工号>
                    <姓名>${fname}</姓名>
                    <申请日期>${fdate}</申请日期>
                    <联系电话>${flxdh}</联系电话>
                    <所属公司>${fssgs}</所属公司>
                    <部门>${fbm}</部门>
                    <职位>${fzw}</职位>
                    <入职日期>${frzrq}</入职日期>
                    <身份证号>${fsfzh}</身份证号>
                    <性别>${fsb}</性别>
                    <出生日期>${fcsrq}</出生日期>
                    <户口性质>${fhkxz}</户口性质>
                    <户口所在地>${fhkszd}</户口所在地>
                    <家庭地址>${fjtdz}</家庭地址>
                    <工作城市>${fgzcs}</工作城市>
                    <社保缴纳城市>${fsbjncs}</社保缴纳城市>
                    <社保起缴年月>${fsbqjny}</社保起缴年月>
                    <社保中断缴至年月>${fsbzdjzny}</社保中断缴至年月>
                </洁丽康公司_员工参保申请_主表>
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
    var flxdh = $("#flxdh").val();
    var fssgs = $("#fssgs").val();
    var fbm = $("#fbm").val();
    var fzw = $("#fzw").val();
    var frzrq = $("#frzrq").val();
    var fsfzh = $("#fsfzh").val();
    var fsb = $("#fsb").val();
    var fcsrq = $("#fcsrq").val();
    var fhkxz = $("#fhkxz").val();
    var fhkszd = $("#fhkszd").val();
    var fjtdz = $("#fjtdz").val();
    var fgzcs = $("#fgzcs").val();
    var fsbjncs = $("#fsbjncs").val();
    var fsbqjny = $("#fsbqjny").val();
    var fsbzdjzny = $("#fsbzdjzny").val();
    if (!fhkxz) {
        mui.toast('请选择户口性质');
        return;
    }
    if (!fhkszd) {
        mui.toast('请填写户口所在地');
        return;
    }
    if (!fjtdz) {
        mui.toast('请填写家庭地址');
        return;
    }
    if (!fgzcs) {
        mui.toast('请填写工作城市');
        return;
    }
    if (!fsbjncs) {
        mui.toast('请填写社保缴纳城市');
        return;
    }
    if (!fsbqjny) {
        mui.toast('请选择社保起缴年月');
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
                 <洁丽康公司_员工参保申请_主表>
                    <单号>${fbillno}</单号>
                    <工号>${fno}</工号>
                    <姓名>${fname}</姓名>
                    <申请日期>${fdate}</申请日期>
                    <联系电话>${flxdh}</联系电话>
                    <所属公司>${fssgs}</所属公司>
                    <部门>${fbm}</部门>
                    <职位>${fzw}</职位>
                    <入职日期>${frzrq}</入职日期>
                    <身份证号>${fsfzh}</身份证号>
                    <性别>${fsb}</性别>
                    <出生日期>${fcsrq}</出生日期>
                    <户口性质>${fhkxz}</户口性质>
                    <户口所在地>${fhkszd}</户口所在地>
                    <家庭地址>${fjtdz}</家庭地址>
                    <工作城市>${fgzcs}</工作城市>
                    <社保缴纳城市>${fsbjncs}</社保缴纳城市>
                    <社保起缴年月>${fsbqjny}</社保起缴年月>
                    <社保中断缴至年月>${fsbzdjzny}</社保中断缴至年月>
                </洁丽康公司_员工参保申请_主表>
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
    var flxdh = $("#flxdh").val();
    var fssgs = $("#fssgs").val();
    var fbm = $("#fbm").val();
    var fzw = $("#fzw").val();
    var frzrq = $("#frzrq").val();
    var fsfzh = $("#fsfzh").val();
    var fsb = $("#fsb").val();
    var fcsrq = $("#fcsrq").val();
    var fhkxz = $("#fhkxz").val();
    var fhkszd = $("#fhkszd").val();
    var fjtdz = $("#fjtdz").val();
    var fgzcs = $("#fgzcs").val();
    var fsbjncs = $("#fsbjncs").val();
    var fsbqjny = $("#fsbqjny").val();
    var fsbzdjzny = $("#fsbzdjzny").val();

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
                 <洁丽康公司_员工参保申请_主表>
                    <单号>${fbillno}</单号>
                    <工号>${fno}</工号>
                    <姓名>${fname}</姓名>
                    <申请日期>${fdate}</申请日期>
                    <联系电话>${flxdh}</联系电话>
                    <所属公司>${fssgs}</所属公司>
                    <部门>${fbm}</部门>
                    <职位>${fzw}</职位>
                    <入职日期>${frzrq}</入职日期>
                    <身份证号>${fsfzh}</身份证号>
                    <性别>${fsb}</性别>
                    <出生日期>${fcsrq}</出生日期>
                    <户口性质>${fhkxz}</户口性质>
                    <户口所在地>${fhkszd}</户口所在地>
                    <家庭地址>${fjtdz}</家庭地址>
                    <工作城市>${fgzcs}</工作城市>
                    <社保缴纳城市>${fsbjncs}</社保缴纳城市>
                    <社保起缴年月>${fsbqjny}</社保起缴年月>
                    <社保中断缴至年月>${fsbzdjzny}</社保中断缴至年月>
                </洁丽康公司_员工参保申请_主表>
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
        xml += `
                 <洁丽康公司_员工参保申请_主表>
                    <单号>${fbillno}</单号>
                    <工号>${fno}</工号>
                    <姓名>${fname}</姓名>
                    <申请日期>${fdate}</申请日期>
                    <联系电话>${flxdh}</联系电话>
                    <所属公司>${fssgs}</所属公司>
                    <部门>${fbm}</部门>
                    <职位>${fzw}</职位>
                    <入职日期>${frzrq}</入职日期>
                    <身份证号>${fsfzh}</身份证号>
                    <性别>${fsb}</性别>
                    <出生日期>${fcsrq}</出生日期>
                    <户口性质>${fhkxz}</户口性质>
                    <户口所在地>${fhkszd}</户口所在地>
                    <家庭地址>${fjtdz}</家庭地址>
                    <工作城市>${fgzcs}</工作城市>
                    <社保缴纳城市>${fsbjncs}</社保缴纳城市>
                    <社保起缴年月>${fsbqjny}</社保起缴年月>
                    <社保中断缴至年月>${fsbzdjzny}</社保中断缴至年月>
                </洁丽康公司_员工参保申请_主表>
                   `;
        xml += `
                       </FormData>
                    </XForm>
                   `;
        PostXml(xml);
    }
}