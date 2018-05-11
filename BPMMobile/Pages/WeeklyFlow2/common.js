function prepMsg() {
    var xml = `<?xml version= "1.0" ?>
                  <Requests>
                      <Params>
                      <Method>GetFormPostData</Method>
                      <ProcessName>集团本部信息化推进部周工作汇报</ProcessName>
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
        $("#fname").val(item.姓名);
        $("#fno").val(item.工号);
        $("#fdept").val(item.部门);
        $("#ftbdate").val(FormatterTime_Y_M_S(item.提报日期.year, item.提报日期.month, item.提报日期.day));
    }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
        if (XMLHttpRequest.status == "401") {
            mui.alert('授权过期，请重新打开页面');;
        } else if (XMLHttpRequest.status == "500") {
            mui.alert('服务器内部错误');
        }

        }).then(() => {
            getTimeMsg();
        });
   
}

var fpjdata = [
    {
        value: "yx",
        text: "优秀"
    },
    {
        value: "lh",
        text: "良好"
    },
    {
        value: "zd",
        text: "中等"
    },
    {
        value: "yb",
        text: "一般"
    }

];





function getWeekOfYear() {
    var today = new Date();
    var firstDay = new Date(today.getFullYear(), 0, 1);
    var dayOfWeek = firstDay.getDay();
    var spendDay = 1;
    if (dayOfWeek != 0) {
        spendDay = 7 - dayOfWeek + 1;
    }
    firstDay = new Date(today.getFullYear(), 0, 1 + spendDay);
    var d = Math.ceil((today.valueOf() - firstDay.valueOf()) / 86400000);
    var result = Math.ceil(d / 7);
    return result + 1;
};




function getTimeMsg() {

    var date = new Date();
    $("#fyear").val(date.getFullYear());
    $("#fmonth").val(date.getMonth() + 1);
    
    $("#fweek").val(getWeekOfYear() - 1);

}



function initData(data, flag) {
    var item = data.FormDataSet.BPM_周工作汇报[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.fbillno);
    }
    $("#fname").val(item.姓名);
    $("#fno").val(item.工号);
    $("#fdept").val(item.部门);
    $("#fmonth").val(item.月);
    $("#fyear").val(item.年);
    $("#fcfbj").val(item.重复标记);
    $("#fweek").val(item.周);
    $("#fgznr").val(item.工作内容);
    $("#fczwt").val(item.存在问题);
    $("#fpj_bmjl").val(item.经理意见);
    $("#fkhdj_bmjl").val(item.经理评价);
    $("#fpj_zj").val(item.总监意见);
    $("#fkhdj_zj").val(item.总监评价);
    $("#fksdate").val(item.开始日期);
    $("#fjsdate").val(item.结束日期);
    $("#ftbdate").val(item.提报日期);

}

function nodeControllerExp(NodeName) {
    if (String(NodeName).match('开始') != null) {
        $("#fgznr,#fczwt").removeAttr('readonly');
    } else if (String(NodeName).match('部门经理') != null) {
        showPicker('fkhdj_bmjl', fpjdata);
        $("#fpj_bmjl").removeAttr('readonly');
    } else if (String(NodeName).match('分管领导') != null) {
        showPicker('fkhdj_zj', fpjdata);
        $("#fpj_zj").removeAttr('readonly');
    }
}
function checkNes() {
    var NodeName = $("#nodeName").val();
    if (String(NodeName).match('部门经理') != null) {

        if (!$("#fkhdj_bmjl").val()) {
            mui.toast('请选择考核等级');
            return false;
        }
    } else if (String(NodeName).match('分管领导') != null) {
        if (!$("#fkhdj_zj").val()) {
            mui.toast('请选择考核等级');
            return false;
        }
    } 
    return true;
}

function Save() {

    var fname = $("#fname").val();
    var fno = $("#fno").val();
    var fdept = $("#fdept").val();
    var fweek = $("#fweek").val();
    var fgznr = $("#fgznr").val();
    var fczwt = $("#fczwt").val();
    var fpj_bmjl = $("#fpj_bmjl").val();
    var fkhdj_bmjl = $("#fkhdj_bmjl").val();
    var fpj_zj = $("#fpj_zj").val();
    var fkhdj_zj = $("#fkhdj_zj").val();
    var fmonth = $("#fmonth").val();
    var fyear = $("#fyear").val();
    var fcfbj = $("#fcfbj").val();
    var fksdate = $("#fksdate").val();
    var fjsdate = $("#fjsdate").val();
    var ftbdate = $("#ftbdate").val();
    if (!fgznr) {
        mui.toast('请填写工作内容');
        return;
    }
    var btnArry = ["取消", "确定"];
    mui.confirm('即将提交，是否确定？', '提交确认提醒', btnArry, function (e) {
        if (e.index == 1) {
            var xml = `<?xml version="1.0"?>
                        <XForm>
                            <Header>
                                <Method>Post</Method>
                                <ProcessName>集团本部信息化推进部周工作汇报</ProcessName>
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
                 <BPM_周工作汇报>
                            <编号>自动生成</编号>
                            <工号>${fno}</工号>
                            <姓名>${fname}</姓名>
                            <部门>${fdept}</部门>
                            <月>${fmonth}</月>
                            <年>${fyear}</年>
                            <重复标记>${fcfbj}</重复标记>
                            <周>${fweek}</周>
                            <工作内容>${fgznr}</工作内容>
                            <存在问题>${fczwt}</存在问题>
                            <经理意见>${fpj_bmjl}</经理意见>
                            <经理评价>${fkhdj_bmjl}</经理评价>
                            <总监意见>${fpj_zj}</总监意见>
                            <总监评价>${fkhdj_zj}</总监评价>
                            <开始日期>${fksdate}</开始日期>
                            <结束日期>${fjsdate}</结束日期>
                            <提报日期>${ftbdate}</提报日期>
                        </BPM_周工作汇报>
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
    var fname = $("#fname").val();
    var fno = $("#fno").val();
    var fdept = $("#fdept").val();
    var fweek = $("#fweek").val();
    var fgznr = $("#fgznr").val();
    var fczwt = $("#fczwt").val();
    var fpj_bmjl = $("#fpj_bmjl").val();
    var fkhdj_bmjl = $("#fkhdj_bmjl").val();
    var fpj_zj = $("#fpj_zj").val();
    var fkhdj_zj = $("#fkhdj_zj").val();
    var fmonth = $("#fmonth").val();
    var fyear = $("#fyear").val();
    var fcfbj = $("#fcfbj").val();
    var fksdate = $("#fksdate").val();
    var fjsdate = $("#fjsdate").val();
    var ftbdate = $("#ftbdate").val();
    if (!fgznr) {
        mui.toast('请填写工作内容');
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
                 <BPM_周工作汇报>
                            <编号>${fbillno}</编号>
                            <工号>${fno}</工号>
                            <姓名>${fname}</姓名>
                            <部门>${fdept}</部门>
                            <月>${fmonth}</月>
                            <年>${fyear}</年>
                            <重复标记>${fcfbj}</重复标记>
                            <周>${fweek}</周>
                            <工作内容>${fgznr}</工作内容>
                            <存在问题>${fczwt}</存在问题>
                            <经理意见>${fpj_bmjl}</经理意见>
                            <经理评价>${fkhdj_bmjl}</经理评价>
                            <总监意见>${fpj_zj}</总监意见>
                            <总监评价>${fkhdj_zj}</总监评价>
                            <开始日期>${fksdate}</开始日期>
                            <结束日期>${fjsdate}</结束日期>
                            <提报日期>${ftbdate}</提报日期>
                        </BPM_周工作汇报>
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
    var fname = $("#fname").val();
    var fno = $("#fno").val();
    var fdept = $("#fdept").val();
    var fweek = $("#fweek").val();
    var fgznr = $("#fgznr").val();
    var fczwt = $("#fczwt").val();
    var fpj_bmjl = $("#fpj_bmjl").val();
    var fkhdj_bmjl = $("#fkhdj_bmjl").val();
    var fpj_zj = $("#fpj_zj").val();
    var fkhdj_zj = $("#fkhdj_zj").val();
    var fmonth = $("#fmonth").val();
    var fyear = $("#fyear").val();
    var fcfbj = $("#fcfbj").val();
    var fksdate = $("#fksdate").val();
    var fjsdate = $("#fjsdate").val();
    var ftbdate = $("#ftbdate").val();
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
                 <BPM_周工作汇报>
                            <编号>${fbillno}</编号>
                            <工号>${fno}</工号>
                            <姓名>${fname}</姓名>
                            <部门>${fdept}</部门>
                            <月>${fmonth}</月>
                            <年>${fyear}</年>
                            <重复标记>${fcfbj}</重复标记>
                            <周>${fweek}</周>
                            <工作内容>${fgznr}</工作内容>
                            <存在问题>${fczwt}</存在问题>
                            <经理意见>${fpj_bmjl}</经理意见>
                            <经理评价>${fkhdj_bmjl}</经理评价>
                            <总监意见>${fpj_zj}</总监意见>
                            <总监评价>${fkhdj_zj}</总监评价>
                            <开始日期>${fksdate}</开始日期>
                            <结束日期>${fjsdate}</结束日期>
                            <提报日期>${ftbdate}</提报日期>
                        </BPM_周工作汇报>
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
                 <BPM_周工作汇报>
                            <编号>${fbillno}</编号>
                            <工号>${fno}</工号>
                            <姓名>${fname}</姓名>
                            <部门>${fdept}</部门>
                            <月>${fmonth}</月>
                            <年>${fyear}</年>
                            <重复标记>${fcfbj}</重复标记>
                            <周>${fweek}</周>
                            <工作内容>${fgznr}</工作内容>
                            <存在问题>${fczwt}</存在问题>
                            <经理意见>${fpj_bmjl}</经理意见>
                            <经理评价>${fkhdj_bmjl}</经理评价>
                            <总监意见>${fpj_zj}</总监意见>
                            <总监评价>${fkhdj_zj}</总监评价>
                            <开始日期>${fksdate}</开始日期>
                            <结束日期>${fjsdate}</结束日期>
                            <提报日期>${ftbdate}</提报日期>
                        </BPM_周工作汇报>
                   `;
        xml += `
                       </FormData>
                    </XForm>
                   `;
        PostXml(xml);
    }
}