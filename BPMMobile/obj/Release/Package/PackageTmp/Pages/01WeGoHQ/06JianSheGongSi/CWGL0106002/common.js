
//预加载部分
var  _init= {

    _preCreate: function() {
        XuntongJSBridge.call('setWebViewTitle', { 'title': '发起流程' });

        XuntongJSBridge.call('getPersonInfo', {}, function (result) {

            if (typeof (result) == "string") {
                result = JSON.parse(result);
            }

            if (result.success == true || result.success == "true") {
                $("#fname").val(result.data.name);

            }

        });




        XuntongJSBridge.call('createPop', {
            'popTitle': '',
            'popTitleCallBackId': '1',
            'items': [{ 'text': '刷新', 'callBackId': 'callback1' }],
            'menuList': [
                'openWithBrowser'
            ],

        }, function (result) {
            if (result.success == true || result.success == 'true') {
                var callBackId = result.data ? result.data.callBackId : '';
                if (callBackId == 'callback1') {
                    window.location.reload();
                    //location.reload();
                } else if (callBackId == 'callback2') {

                } else {

                }
            }

        });
        mui('#fifjj_d').each(function () {


            this.addEventListener('toggle', function (event) {
                if (event.detail.isActive == 'true' || event.detail.isActive == true) {

                    $('#fifjj').val('是');
                } else {

                    $('#fifjj').val('否');
                }

            });
        });
        mui('#fhkzt_d').each(function () {


            this.addEventListener('toggle', function (event) {
                if (event.detail.isActive == 'true' || event.detail.isActive == true) {

                    $('#fhkzt').val('已完成');
                } else {

                    $('#fhkzt').val('未完成');
                }

            });
        });
        
        prepMsg();
       

    },

    _preUndo: function () {

        mui('#csswitch').each(function () {

            this.addEventListener('toggle', function (event) {
                if (event.detail.isActive == 'true' || event.detail.isActive == true) {

                    $('#signbody').css('display', 'block');
                } else {

                    $('#signbody').css('display', 'none');
                    $('#signPer').val('');
                }

            });
        });
        XuntongJSBridge.call('setWebViewTitle', { 'title': '审批详情' });

        XuntongJSBridge.call('createPop', {
            'popTitle': '',
            'popTitleCallBackId': '1',
            'items': [
                { 'text': '刷新', 'callBackId': 'callback1' },
                { 'text': '知会', 'callBackId': 'callback2' },
                { 'text': '退回某步', 'callBackId': 'callback3' }

            ],
            'menuList': [
                'openWithBrowser'
            ],

        }, function (result) {
            if (result.success == true || result.success == 'true') {
                var callBackId = result.data ? result.data.callBackId : '';
                if (callBackId == 'callback1') {
                    window.location.reload();
                } else if (callBackId == 'callback2') {
                    XuntongJSBridge.call('selectPersons', { 'isMulti': 'true', 'pType': '1' }, function (result) {

                        if (typeof (result) == "string") {
                            result = JSON.parse(result);
                        }


                        noticeOpenIdArr = new Array();
                        if (result.success == true || result.success == "true") {

                            for (var i = 0; i < result.data.persons.length; i++) {

                                noticeOpenIdArr.push(result.data.persons[i].openId);

                            }
                            $("#noticeOpenId").val(noticeOpenIdArr);
                            //知会

                            $.ajax({
                                type: "POST",
                                url: "/api/bpm/PostAccount",
                                data: { "ids": noticeOpenIdArr },
                                beforeSend: function (XHR) {
                                    XHR.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem('ticket'));

                                }, success: function (data, status) {

                                    if (status == "success") {
                                        var accounts = new Array();
                                        var accName = new Array();
                                        for (var i = 0; i < data.data.length; i++) {
                                            accounts.push((String)(data.data[i].phone));
                                            accName.push(data.data[i].name);
                                        }
                                        //alert(JSON.stringify({ 'taskID': taskId, 'comments': '', 'accounts': accounts }));

                                        var btnArry = ["取消", "确定"];
                                        mui.confirm('将知会下列人员:' + accName, '知会通知', btnArry, function (e) {
                                            if (e.index == 1) {
                                                $.ajax({
                                                    type: "POST",
                                                    url: "/api/bpm/PostInform",
                                                    data: { 'taskID': taskId, 'comments': '', 'accounts': accounts },
                                                    dataType: "json",
                                                    beforeSend: function (XHR) {

                                                        XHR.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem('ticket'));

                                                    },
                                                    success: function (data, status) {

                                                        if (status == "success") {
                                                            mui.toast("知会成功");
                                                        }
                                                    }, error: function (e) {
                                                        //console.log(e);  

                                                    },
                                                    complete: function () { }


                                                });
                                            } else {

                                            }
                                        });


                                    }
                                }, error: function (e) {

                                }, complete: function () { }


                            });


                        }



                    });
                } else if (callBackId == 'callback3') {
                    getRecedableToSteps();
                }
            }
        });
        XuntongJSBridge.call('getPersonInfo', {}, function (result) {
            if (typeof (result) == "string") {
                result = JSON.parse(result);
            }

            if (result.success == true || result.success == "true") {
                if (typeof (result.data.userName) == "undefined") {
                    $('#myPhone').val("");
                } else {
                    $('#myPhone').val(result.data.userName);
                }
            }

        });
        initMsg(1);
    },

    _preAskOrDone: function () {
        XuntongJSBridge.call('setWebViewTitle', { 'title': '审批详情' });

        XuntongJSBridge.call('createPop', {
            'popTitle': '',
            'popTitleCallBackId': '1',
            'items': [
                { 'text': '知会', 'callBackId': 'callback1' },
                { 'text': '刷新', 'callBackId': 'callback2' }

            ],
            'menuList': [
                'openWithBrowser'
            ],

        }, function (result) {
            if (result.success == true || result.success == 'true') {
                var callBackId = result.data ? result.data.callBackId : '';
                if (callBackId == 'callback1') {

                    XuntongJSBridge.call('selectPersons', { 'isMulti': 'true', 'pType': '1' }, function (result) {



                        noticeOpenIdArr = new Array();
                        if (result.success == true || result.success == "true") {

                            for (var i = 0; i < result.data.persons.length; i++) {

                                noticeOpenIdArr.push(result.data.persons[i].openId);

                            }
                            $("#noticeOpenId").val(noticeOpenIdArr);
                            //知会

                            $.ajax({
                                type: "POST",
                                url: "/api/bpm/PostAccount",
                                data: { "ids": noticeOpenIdArr },
                                beforeSend: function (XHR) {
                                    XHR.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem('ticket'));

                                }, success: function (data, status) {

                                    if (status == "success") {
                                        var accounts = new Array();
                                        var accName = new Array();
                                        for (var i = 0; i < data.data.length; i++) {
                                            accounts.push((String)(data.data[i].phone));
                                            accName.push(data.data[i].name);
                                        }
                                        //alert(JSON.stringify({ 'taskID': taskId, 'comments': '', 'accounts': accounts }));

                                        var btnArry = ["取消", "确定"];
                                        mui.confirm('将知会下列人员:' + accName, '知会通知', btnArry, function (e) {
                                            if (e.index == 1) {
                                                $.ajax({
                                                    type: "POST",
                                                    url: "/api/bpm/PostInform",
                                                    data: { 'taskID': taskId, 'comments': '', 'accounts': accounts },
                                                    dataType: "json",
                                                    beforeSend: function (XHR) {

                                                        XHR.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem('ticket'));

                                                    },
                                                    success: function (data, status) {

                                                        if (status == "success") {
                                                            mui.toast("知会成功");
                                                        }
                                                    }, error: function (e) {
                                                        //console.log(e);

                                                    },
                                                    complete: function () { }


                                                });
                                            } else {

                                            }
                                        });


                                    }
                                }, error: function (e) {

                                }, complete: function () { }


                            });


                        }



                    });

                } else if (callBackId == 'callback2') {
                    window.location.reload();
                } else {

                }
            }

        });
        initMsg(0);

    }

    
}

//发起页面预加载部分页面信息
function prepMsg() {
    $("#fdate").val(getNowFormatDate(2));
    $("#fhkjedx").val('零元整');
    $("#fhkfs").val('银行');
    tapEvent();

    $.ajax({

        type: 'get',
        url: "/api/bpm/GetBPMParam",
        data: {},
        beforeSend: function (XHR) {
            XHR.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem('ticket'));
        },
        success: function (data, status) {
            if (status == "success") {
                //console.log(data);
                BPMOU = data.Position[0].FullName;

                var fareaStr = String(BPMOU).split("/");
                //将BPMOU://XX/XX/工号，获取倒数第二个，就是所在区域
                $("#fdept").val(fareaStr[fareaStr.length - 2]);
                $("#fcompany").val(fareaStr[fareaStr.length - 3]);

                return BPMOU;
            } else {
                return "";
            }
        },
        error: function (e) {
            return e;
        },

        complete: function () {
            return BPMOU;
        }

    });

}


//特殊行为部分，主要为点击事件的绑定和自动计算部分
function tapEvent() {
    $("#fhkjexx").on("change", function () {
        var hkjexx = $("#fhkjexx").val();
        var value = atoc(hkjexx);
        $("#fhkjedx").val(value);
    });

}





//根据状态加载页面信息
function initMsg(flag) {

    //flag为false时，状态为申请或者已办，只有tid，为true时，状态为待办，有tid和pid
    var url = window.location.href;
    if (flag) {

        if (url != null && url.indexOf("tid") != -1 && url.indexOf("pid") != -1) {


            taskId = url.substring(url.indexOf("=") + 1, url.indexOf("&"));
            if (url.split("pid=")[1].indexOf("ticket") != -1) {
                stepId = url.split("pid=")[1];
                stepId = stepId.split("&ticket")[0];
                var ticket = url.split("=")[3];
                localStorage.setItem('ticket', ticket);
            } else {
                stepId = url.split("pid=")[1];
            }


        } else {
            mui.toast("网络异常,请稍后重试");
            history.go(-1);

        }


    } else {

        if (url != null && url.indexOf("tid") != -1) {

            taskId = url.split("tid=")[1];


        } else {
            mui.toast("网络异常,请稍后重试");
            history.go(-1);

        }

    }
    itemidArr = new Array();


    $.ajax({
        type: "get",
        url: "/api/bpm/GetTaskData",
        data: { 'taskId': taskId },
        beforeSend: function (XHR) {
            XHR.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem('ticket'));
        }
    }).done(function (data) {
        console.log(data);

        var item = data.FormDataSet.建设公司_汇款申请[0];

        //待办特殊操作
        if (flag) {
            
            $("#taskId").val(item.TaskID);
            $("#stepId").val(stepId);
            $("#fbillno").val(item.单号);

        }
        $("#fname").val(item.申请人);
        $("#fdate").val(FormatterTimeYMS(item.申请日期));
        $("#fdept").val(item.申请部门);
        $("#fcompany").val(item.所属公司);
        $("#fhkyt").val(item.汇款用途);
        $("#fhkfs").val(item.汇款方式);
        $("#fhkjedx").val(item.汇款金额大);
        $("#fhkjexx").val(item.汇款金额小);
        $("#fskdwmc").val(item.收款单位名称);
        $("#fkhhmc").val(item.开户行名称);
        $("#fkhhzh").val(item.开户行账号);
        $("#fifjj").val(item.是否加急);
        $("#fhkzt").val(item.汇款状态);
        if (item.是否加急 == "是") {
            $("#fifjj_d").addClass('mui-active');
        } else {
            if ($("#fifjj_d").hasClass('mui-active')) {
                $("#fifjj_d").removeClass('mui-active');
            }
        }
        if (item.汇款状态 == "已完成") {
            $("#fhkzt_d").addClass('mui-active');
        } else {
            if ($("#fhkzt_d").hasClass('mui-active')) {
                $("#fhkzt_d").removeClass('mui-active');
            }
        }
        for (var i = 0; i < data.Steps.length; i++) {

            if (data.Steps[i].FinishAt == "0001-01-01T00:00:00") {
                data.Steps[i].FinishAt = "";
            }
            var time = FormatterTime(data.Steps[i].FinishAt);

            var stepName = data.Steps[i].NodeName;
            if (data.Steps[i].NodeName == "sysInform") {
                stepName = "知会";
            } else if (data.Steps[i].NodeName == "sysTaskOpt") {
                stepName = "任务操作";
            } else if (data.Steps[i].NodeName == "开始") {
                stepName = "开始";
            }

            var stepAction = locationAction(data.Steps[i].SelAction);
            if (data.Steps[i].SelAction == "sysInform") {
                stepAction = "发起知会";
            } else if (data.Steps[i].SelAction == "Submit") {
                stepAction = "已阅";
            } else if (data.Steps[i].SelAction == "null" || data.Steps[i].SelAction == null) {
                stepAction = "待处理";
            } else if (data.Steps[i].SelAction == "sysReject") {
                stepAction = "拒绝";
            } else if (data.Steps[i].SelAction == "sysRecedeRestart") {
                stepAction = "退回重填";
            }


            var contents = data.Steps[i].Comments;
            if (contents == null) {
                contents = "无";
            }
            //判断是否是加签
            if (data.Steps[i].IsConsignStep == false) {
                var li = ' <li>';
                li = li + '  <span class="lefttime"><i></i>' + time + '</span>';
                li = li + '  <div class="righttext">';
                li = li + '     <div>';
                li = li + '        <div class="flowmsg">' + stepName + '<span>' + data.Steps[i].RecipientFullName + '</span></div>';
                li = li + '        <label class="flowstatus">' + stepAction + '</label>';
                li = li + '        <p>签核意见: ' + contents + '</p>';
                li = li + '     </div>';
                li = li + '   </div>';
                li = li + '</li>';

            } else {
                var li = ' <li>';
                li = li + '  <span class="lefttime"><i></i>' + time + '</span>';
                li = li + '  <div class="righttext">';
                li = li + '     <div>';
                li = li + '        <div class="flowmsg signadd">加签<span>' + data.Steps[i].RecipientFullName + '</span></div>';
                li = li + '        <label class="flowstatus">' + stepAction + '</label>';
                li = li + '        <p>签核意见: ' + contents + '</p>';
                li = li + '     </div>';
                li = li + '   </div>';
                li = li + '</li>';

            }
            $("#signff").append(li);
        }
        if (flag) {
            nodeController(data);
        }

    }).fail(function (e) {

    });

}

function nodeController(data) {
    if ($('#myPhone').val() == "") {
        var myPhone = String(BPMOU).split("/");
        $('#myPhone').val(String(myPhone[myPhone.length - 1]));

    }
    var NodeName;
    //判断流程本节点是否结束，处理者是否为当前用户,
    //流程步骤是否是传过来的流程步骤，再根据这三项查出对应的节点名称
    for (var i = 0; i < data.Steps.length; i++) {
        //debugger;

        if (data.Steps[i].Finished == false && data.Steps[i].RecipientAccount == ($('#myPhone').val())) {


            if (stepId.indexOf(data.Steps[i].StepID) != -1) {

                NodeName = data.Steps[i].NodeName;

            }

        }

    }
    $("#nodeName").val(NodeName);
    if (NodeName == "开始") {
        $("#createD").css("display", "block");
        $("#csd").css("display", "none");


        tapEvent();

        $("#fhkyt,#fhkfs,#fhkjexx,#fskdwmc,#fkhhmc,#fkhhzh").removeAttr('readonly');
        $("#fifjj_d").removeClass('mui-disabled');
        mui('#fifjj_d').each(function () {


            this.addEventListener('toggle', function (event) {
                if (event.detail.isActive == 'true' || event.detail.isActive == true) {

                    $('#fifjj').val('是');
                } else {

                    $('#fifjj').val('否');
                }

            });
        });
        
    } else if (NodeName == "sysInform") {
        $("#readD").css("display", "block");
        $("#csd").css("display", "none");

    } else {
        if (typeof (NodeName) != "undefined") {
            $("#approvalD").css("display", "block");
            if (NodeName == "出纳") {
                $("#fhkzt_d").removeClass("mui-disabled");
                mui('#fhkzt_d').each(function () {


                    this.addEventListener('toggle', function (event) {
                        if (event.detail.isActive == 'true' || event.detail.isActive == true) {

                            $('#fhkzt').val('已完成');
                        } else {

                            $('#fhkzt').val('未完成');
                        }

                    });
                });
            }
        }
    }


}


//行为函数部分
function Save() {
    var fname = $("#fname").val();
    var fdate = $("#fdate").val() + " 00:00:00";
    var fdept = $("#fdept").val();
    var fhkyt = $("#fhkyt").val();
    var fhkfs = $("#fhkfs").val();
    var fcompany = $("#fcompany").val();
    var fhkjedx = $("#fhkjedx").val();
    var fhkjexx = $("#fhkjexx").val();
    var fskdwmc = $("#fskdwmc").val();
    var fkhhmc = $("#fkhhmc").val();
    var fkhhzh = $("#fkhhzh").val();
    var fifjj = $("#fifjj").val();
    var fhkzt = $("#fhkzt").val();
    if (!fhkyt) {
        mui.toast('请输入汇款用途');
        return;
    }
    if (!fhkjedx) {
        mui.toast('请填写汇款金额');
        return;
    }
    if (!fhkjexx) {
        mui.toast('请填写汇款金额');
        return;
    }
    if (!fskdwmc) {
        mui.toast('请填写收款单位名称');
        return;
    }
    if (!fkhhmc) {
        mui.toast('请填写开户行名称');
        return;
    }
    if (!fkhhzh) {
        mui.toast('请填写开户行账号');
        return;
    }
    if (!fifjj) {
        mui.toast('请选择是否加急');
        return;
    }
    if (!fhkzt) {
        mui.toast('请选择是否完成汇款');
        return;
    }

    var btnArry = ["取消", "确定"];
    mui.confirm('即将提交，是否确定？', '提交确认提醒', btnArry, function (e) {
        if (e.index == 1) {

            var xml = '<?xml version= "1.0" ?>';
            xml = xml + '   <XForm>';
            xml = xml + '         <Header>';
            xml = xml + '        <Method>Post</Method>';
            xml = xml + '       <ProcessName>建设公司汇款申请</ProcessName>';
            xml = xml + '         <ProcessVersion>' + version + '</ProcessVersion>';
            xml = xml + '            <DraftGuid></DraftGuid>';
            xml = xml + '             <OwnerMemberFullName>' + BPMOU + '</OwnerMemberFullName>';
            xml = xml + '            <Action>提交</Action>';
            xml = xml + '          <Comment></Comment>';
            xml = xml + '             <InviteIndicateUsers></InviteIndicateUsers>';
            xml = xml + '       </Header>';
            xml = xml + '       <FormData>';

            xml = xml + '  <建设公司_汇款申请>';
            xml = xml + '  <单号>自动生成</单号>';
            xml = xml + '  <申请人>' + fname + '</申请人>';
            xml = xml + '   <申请日期>' + fdate + '</申请日期>';
            xml = xml + '   <申请部门>' + fdept + '</申请部门>';
            xml = xml + '   <所属公司>' + fcompany + '</所属公司>';
            xml = xml + '   <汇款用途>' + fhkyt + '</汇款用途>';
            xml = xml + '   <汇款方式>' + fhkfs + '</汇款方式>';
            xml = xml + '   <汇款金额大>' + fhkjedx + '</汇款金额大>';
            xml = xml + '   <汇款金额小>' + fhkjexx + '</汇款金额小>';
            xml = xml + '  <收款单位名称>' + fskdwmc + '</收款单位名称>';
            xml = xml + '   <开户行名称>' + fkhhmc + '</开户行名称>';
            xml = xml + '   <开户行账号>' + fkhhzh + '</开户行账号>';
            xml = xml + '   <是否加急>' + fifjj + '</是否加急>';
            xml = xml + '   <汇款状态>' + fhkzt + '</汇款状态>';

            xml = xml + '  </建设公司_汇款申请>';

            xml = xml + '</FormData>';
            xml = xml + '</XForm>';
            PostXml(xml);
        }
    });
}

function reSave() {
    var pid = $("#stepId").val();
    var fbillno = $("#fbillno").val();

    var fname = $("#fname").val();
    var fdate = $("#fdate").val();
    var fdept = $("#fdept").val();
    var fhkyt = $("#fhkyt").val();
    var fhkfs = $("#fhkfs").val();
    var fcompany = $("#fcompany").val();
    var fhkjedx = $("#fhkjedx").val();
    var fhkjexx = $("#fhkjexx").val();
    var fskdwmc = $("#fskdwmc").val();
    var fkhhmc = $("#fkhhmc").val();
    var fkhhzh = $("#fkhhzh").val();
    var fifjj = $("#fifjj").val();
    var fhkzt = $("#fhkzt").val();

    if (!fhkyt) {
        mui.toast('请输入汇款用途');
        return;
    }
    if (!fhkjedx) {
        mui.toast('请填写汇款金额');
        return;
    }
    if (!fhkjexx) {
        mui.toast('请填写汇款金额');
        return;
    }
    if (!fskdwmc) {
        mui.toast('请填写收款单位名称');
        return;
    }
    if (!fkhhmc) {
        mui.toast('请填写开户行名称');
        return;
    }
    if (!fkhhzh) {
        mui.toast('请填写开户行账号');
        return;
    }
    if (!fifjj) {
        mui.toast('请选择是否加急');
        return;
    }
    if (!fhkzt) {
        mui.toast('请选择是否完成汇款');
        return;
    }
   
    var btnArry = ["取消", "确定"];
    mui.confirm('即将提交，是否确定？', '提交确认提醒', btnArry, function (e) {
        if (e.index == 1) {
            var xml = '<?xml version="1.0"?>';
            xml = xml + '<XForm>';
            xml = xml + '   <Header>';
            xml = xml + '    <Method>Process</Method>';
            xml = xml + '   <PID>' + pid + '</PID>';
            xml = xml + '   <Action>提交</Action>';
            xml = xml + '    <Comment></Comment>';
            xml = xml + '    <InviteIndicateUsers></InviteIndicateUsers>';
            xml = xml + '  </Header>';
            xml = xml + '<FormData>';

            xml = xml + '  <建设公司_汇款申请>';
            xml = xml + '  <单号>' + fbillno + '</单号>';
            xml = xml + '  <申请人>' + fname + '</申请人>';
            xml = xml + '   <申请日期>' + fdate + '</申请日期>';
            xml = xml + '   <申请部门>' + fdept + '</申请部门>';
            xml = xml + '   <所属公司>' + fcompany + '</所属公司>';
            xml = xml + '   <汇款用途>' + fhkyt + '</汇款用途>';
            xml = xml + '   <汇款方式>' + fhkfs + '</汇款方式>';
            xml = xml + '   <汇款金额大>' + fhkjedx + '</汇款金额大>';
            xml = xml + '   <汇款金额小>' + fhkjexx + '</汇款金额小>';
            xml = xml + '  <收款单位名称>' + fskdwmc + '</收款单位名称>';
            xml = xml + '   <开户行名称>' + fkhhmc + '</开户行名称>';
            xml = xml + '   <开户行账号>' + fkhhzh + '</开户行账号>';
            xml = xml + '   <是否加急>' + fifjj + '</是否加急>';
            xml = xml + '   <汇款状态>' + fhkzt + '</汇款状态>';

            xml = xml + '  </建设公司_汇款申请>';

            xml = xml + '</FormData>';
            xml = xml + '</XForm>';
            PostXml(xml);
        }
    });

}

function hasRead() {

    var pid = $("#stepId").val();
    var fbillno = $("#fbillno").val();

    var fname = $("#fname").val();
    var fdate = $("#fdate").val();
    var fdept = $("#fdept").val();
    var fhkyt = $("#fhkyt").val();
    var fhkfs = $("#fhkfs").val();
    var fcompany = $("#fcompany").val();
    var fhkjedx = $("#fhkjedx").val();
    var fhkjexx = $("#fhkjexx").val();
    var fskdwmc = $("#fskdwmc").val();
    var fkhhmc = $("#fkhhmc").val();
    var fkhhzh = $("#fkhhzh").val();
    var fifjj = $("#fifjj").val();
    var fhkzt = $("#fhkzt").val();

    var comment = '';
    var btnArray = ['取消', '确定'];
    mui.prompt('请选填知会意见', '可以不填', '知会意见', btnArray, function (e) {
        if (e.index == 1) {
            comment = e.value;
            var xml = '<?xml version="1.0"?>';
            xml = xml + '<XForm>';
            xml = xml + '<Header>';
            xml = xml + '<Method>InformSubmit</Method>';
            xml = xml + '<PID>' + pid + '</PID>';
            xml = xml + '<Comment>' + comment + '</Comment>';
            xml = xml + '</Header>';
            xml = xml + '<FormData>';

            xml = xml + '  <建设公司_汇款申请>';
            xml = xml + '  <单号>' + fbillno + '</单号>';
            xml = xml + '  <申请人>' + fname + '</申请人>';
            xml = xml + '   <申请日期>' + fdate + '</申请日期>';
            xml = xml + '   <申请部门>' + fdept + '</申请部门>';
            xml = xml + '   <所属公司>' + fcompany + '</所属公司>';
            xml = xml + '   <汇款用途>' + fhkyt + '</汇款用途>';
            xml = xml + '   <汇款方式>' + fhkfs + '</汇款方式>';
            xml = xml + '   <汇款金额大>' + fhkjedx + '</汇款金额大>';
            xml = xml + '   <汇款金额小>' + fhkjexx + '</汇款金额小>';
            xml = xml + '  <收款单位名称>' + fskdwmc + '</收款单位名称>';
            xml = xml + '   <开户行名称>' + fkhhmc + '</开户行名称>';
            xml = xml + '   <开户行账号>' + fkhhzh + '</开户行账号>';
            xml = xml + '   <是否加急>' + fifjj + '</是否加急>';
            xml = xml + '   <汇款状态>' + fhkzt + '</汇款状态>';

            xml = xml + '  </建设公司_汇款申请>';

            xml = xml + '</FormData>';
            xml = xml + '</XForm>';
            PostXml(xml);
        }
    });
}

function AgreeOrConSign() {
    var pid = $("#stepId").val();
    var fbillno = $("#fbillno").val();
    var fname = $("#fname").val();
    var fdate = $("#fdate").val();
    var fdept = $("#fdept").val();
    var fhkyt = $("#fhkyt").val();
    var fhkfs = $("#fhkfs").val();
    var fcompany = $("#fcompany").val();
    var fhkjedx = $("#fhkjedx").val();
    var fhkjexx = $("#fhkjexx").val();
    var fskdwmc = $("#fskdwmc").val();
    var fkhhmc = $("#fkhhmc").val();
    var fkhhzh = $("#fkhhzh").val();
    var fifjj = $("#fifjj").val();
    var fhkzt = $("#fhkzt").val();
    var comment = $("#signSuggest").val();
    var consignUserId = new Array();
    var consignRoutingType;
    var consignReturnType;

    var consignUserStr;
    //加签分支
    if (($('#signPer').val() != null) && ($('#signPer').val() != '')) {

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


        $.ajax({
            type: "POST",
            url: "/api/bpm/PostAccount",
            data: { "ids": consignOpenIdArr },
            beforeSend: function (XHR) {
                XHR.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem('ticket'));

            }, success: function (data, status) {

                if (status == "success") {



                    for (var i = 0; i < data.data.length; i++) {
                        consignUserId.push(data.data[i].phone);
                    }
                    $('#consignUser').val(consignUserId);
                    consignUserStr = (String)($('#consignUser').val()).replace(",", ";");

                    var xml = '<?xml version="1.0"?>';
                    xml = xml + '<XForm>';
                    xml = xml + '<Header>';
                    xml = xml + '<Method>Process</Method>';
                    xml = xml + '<PID>' + pid + '</PID>';
                    xml = xml + '<Action>同意</Action>';
                    xml = xml + '<Comment>' + comment + '</Comment>';
                    //加签差异xml部分
                    xml = xml + '<ConsignEnabled>True</ConsignEnabled>';
                    xml = xml + '<ConsignUsers>' + consignUserStr + '</ConsignUsers>';
                    xml = xml + '<ConsignRoutingType>' + consignRoutingType + '</ConsignRoutingType>';
                    xml = xml + '<ConsignReturnType>' + consignReturnType + '</ConsignReturnType>';


                    xml = xml + '<InviteIndicateUsers></InviteIndicateUsers>';
                    xml = xml + '</Header>';
                    xml = xml + '<FormData>';

                    xml = xml + '  <建设公司_汇款申请>';
                    xml = xml + '  <单号>自动生成</单号>';
                    xml = xml + '  <申请人>' + fname + '</申请人>';
                    xml = xml + '   <申请日期>' + fdate + '</申请日期>';
                    xml = xml + '   <申请部门>' + fdept + '</申请部门>';
                    xml = xml + '   <所属公司>' + fcompany + '</所属公司>';
                    xml = xml + '   <汇款用途>' + fhkyt + '</汇款用途>';
                    xml = xml + '   <汇款方式>' + fhkfs + '</汇款方式>';
                    xml = xml + '   <汇款金额大>' + fhkjedx + '</汇款金额大>';
                    xml = xml + '   <汇款金额小>' + fhkjexx + '</汇款金额小>';
                    xml = xml + '  <收款单位名称>' + fskdwmc + '</收款单位名称>';
                    xml = xml + '   <开户行名称>' + fkhhmc + '</开户行名称>';
                    xml = xml + '   <开户行账号>' + fkhhzh + '</开户行账号>';
                    xml = xml + '   <是否加急>' + fifjj + '</是否加急>';
                    xml = xml + '   <汇款状态>' + fhkzt + '</汇款状态>';

                    xml = xml + '  </建设公司_汇款申请>';

                    xml = xml + '</FormData>';
                    xml = xml + '</XForm>';
                    PostXml(xml);
                }
            }, error: function (e) {

            }, complete: function () {

            }
        });
        //不加签分支
    } else {
        var xml = '<?xml version="1.0"?>';
        xml = xml + '<XForm>';
        xml = xml + '<Header>';
        xml = xml + '<Method>Process</Method>';
        xml = xml + '<PID>' + pid + '</PID>';
        xml = xml + '<Action>同意</Action>';
        xml = xml + '<Comment>' + comment + '</Comment>';

    
        xml = xml + '<InviteIndicateUsers></InviteIndicateUsers>';
        xml = xml + '</Header>';
        xml = xml + '<FormData>';

        xml = xml + '  <建设公司_汇款申请>';
        xml = xml + '  <单号>' + fbillno + '</单号>';
        xml = xml + '  <申请人>' + fname + '</申请人>';
        xml = xml + '   <申请日期>' + fdate + '</申请日期>';
        xml = xml + '   <申请部门>' + fdept + '</申请部门>';
        xml = xml + '   <所属公司>' + fcompany + '</所属公司>';
        xml = xml + '   <汇款用途>' + fhkyt + '</汇款用途>';
        xml = xml + '   <汇款方式>' + fhkfs + '</汇款方式>';
        xml = xml + '   <汇款金额大>' + fhkjedx + '</汇款金额大>';
        xml = xml + '   <汇款金额小>' + fhkjexx + '</汇款金额小>';
        xml = xml + '  <收款单位名称>' + fskdwmc + '</收款单位名称>';
        xml = xml + '   <开户行名称>' + fkhhmc + '</开户行名称>';
        xml = xml + '   <开户行账号>' + fkhhzh + '</开户行账号>';
        xml = xml + '   <是否加急>' + fifjj + '</是否加急>';
        xml = xml + '   <汇款状态>' + fhkzt + '</汇款状态>';

        xml = xml + '  </建设公司_汇款申请>';

        xml = xml + '</FormData>';
        xml = xml + '</XForm>';
        PostXml(xml);
    }

   
}