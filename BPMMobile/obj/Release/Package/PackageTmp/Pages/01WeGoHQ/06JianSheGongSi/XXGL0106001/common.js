var _init = {

    _preCreate: function () {
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
    tapEvent();

    var xml = '<?xml version= "1.0" ?>';
    xml = xml + '   <Requests>';
    xml = xml + '   <Params>';
    xml = xml + '       <Method>GetFormPostData</Method>';
    xml = xml + '       <ProcessName>建设公司K3项目编码新增申请</ProcessName>';
    xml = xml + '      <ProcessVersion>' + version + '</ProcessVersion>';
    xml = xml + '      <Owner></Owner>';
    xml = xml + '    </Params>';
    xml = xml + '   </Requests>';
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
        $("#fname").val(item.申请人);
        $("#fdept").val(item.申请部门);
        $("#fcompany").val(item.申请公司);
    }).fail(function (e) {

    });
}

function tapEvent() {

    $("#tjmx").on('tap', function () {

        var li = '<div id="mx" class="mui-card">';
        li = li + '    <div class="mui-input-row itemtitle">';
        li = li + '       <label>明细列表项</label>';
        li = li + '       <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>';
        li = li + '    </div>';
        li = li + '    <div class="mui-input-row">';
        li = li + '        <label for="fxmbm">项目编码<i style="color:red;">*</i></label>';
        li = li + '        <input type="text" id="fxmbm" name="fxmbm" readonly="readonly"/>';
        li = li + '    </div>';
        li = li + '     <div class="mui-input-row">';
        li = li + '         <label for="fxmmc">项目名称<i style="color:red;">*</i></label>';
        li = li + '         <input type="text" id="fxmmc" name="fxmmc" placeholder="请填写项目名称"/>';
        li = li + '     </div>';
        li = li + '     <div class="mui-input-row">';
        li = li + '         <label for="fkhmc">客户名称<i style="color:red;">*</i></label>';
        li = li + '         <input type="text" id="fkhmc" name="fkhmc" placeholder="请填写客户名称"/ >';
        li = li + '     </div>';
        li = li + '     <div class="mui-input-row">';
        li = li + '         <label for="fywy">业务员<i style="color:red;">*</i></label>';
        li = li + '         <input type="text" id="fywy" name="fkhmc" placeholder="请填写业务员"/ >';
        li = li + '     </div>';
        li = li + '     <div class="mui-input-row">';
        li = li + '         <label for="fbz">备注</label>';
        li = li + '         <input type="text" id="fbz" name="fbz" placeholder="请填写备注"/>';
        li = li + '     </div>';
        li = li + '</div>';
        $("#mxlist").append(li);
    });

}

function mxItem(fxmbm, fxmmc, fkhmc, fywy, fbz) {

    var mx = {
        fxmbm: fxmbm,
        fxmmc: fxmmc,
        fkhmc: fkhmc,
        fywy: fywy,
        fbz: fbz,
        _check: function () {
            if (!fxmmc) {
                mui.toast('请填写项目名称');
                return null;
            }
            if (!fkhmc) {
                mui.toast('请填写客户名称');
                return null;
            }
            if (!fywy) {
                mui.toast('请填写业务员');
                return null;
            }

            return mx;
        }

    }
    if (mx._check() == null) {
        return null;
    }
    return mx;
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

        var item = data.FormDataSet.建设公司_K3项目编码新增申请_主表[0];

        //待办特殊操作
        if (flag) {

            $("#taskId").val(item.TaskID);
            $("#stepId").val(stepId);
            $("#fbillno").val(item.单号);

        }
        $("#fname").val(item.申请人);
        $("#fdate").val(FormatterTimeYMS(item.申请日期));
        $("#fdept").val(item.申请部门);
        $("#fcompany").val(item.申请公司);
        $("#ftel").val(item.联系方式);


        var item_c = data.FormDataSet.建设公司_K3项目编码新增申请_子表;
        for (var i = 0; i < item_c.length; i++) {
            itemidArr.push(item_c[i].itemid);

            var li = '<div id="mx" class="mui-card">';
            li = li + '    <div class="mui-input-row itemtitle">';
            li = li + '       <label>明细列表项</label>';
            li = li + '       <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>';
            li = li + '    </div>';
            li = li + '    <div class="mui-input-row">';
            li = li + '        <label for="fxmbm">项目编码<i style="color:red;">*</i></label>';
            li = li + '        <input type="text" id="fxmbm" name="fxmbm" readonly="readonly" value="' + changeNullToEmpty( item_c[i].项目编码 )+ '"/>';
            li = li + '    </div>';
            li = li + '     <div class="mui-input-row">';
            li = li + '         <label for="fxmmc">项目名称<i style="color:red;">*</i></label>';
            li = li + '         <input type="text" id="fxmmc" name="fxmmc" readonly="readonly" value="' + item_c[i].项目名称 + '"/>';
            li = li + '     </div>';
            li = li + '     <div class="mui-input-row">';
            li = li + '         <label for="fkhmc">客户名称<i style="color:red;">*</i></label>';
            li = li + '         <input type="text" id="fkhmc" name="fkhmc" readonly="readonly" value="' + item_c[i].客户名称 + '"/ >';
            li = li + '     </div>';
            li = li + '     <div class="mui-input-row">';
            li = li + '         <label for="fywy">业务员<i style="color:red;">*</i></label>';
            li = li + '         <input type="text" id="fywy" name="fkhmc" readonly="readonly" value="' + item_c[i].业务员 + '"/>';
            li = li + '     </div>';
            li = li + '     <div class="mui-input-row">';
            li = li + '         <label for="fbz">备注</label>';
            li = li + '         <input type="text" id="fbz" name="fbz" readonly="readonly"  value="' + changeNullToEmpty( item_c[i].备注) + '"/>';
            li = li + '     </div>';
            li = li + '</div>';
            $("#mxlist").append(li);
            if (flag) {
                

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
        $("#mxlist").find('span').each(function () {
            $(this).css("display", "block");

        });
        $("#tjmx").css('display', 'block');

        tapEvent();
        $("#ftel").removeAttr('readonly');

        $("#mxlist").find("#fxmmc,#fkhmc,#fywy,#fbz").each(function () {
            $(this).removeAttr('readonly');
        });
    } else if (NodeName == "sysInform") {
        $("#readD").css("display", "block");
        $("#csd").css("display", "none");

    } else {
        if (typeof (NodeName) != "undefined") {
            $("#approvalD").css("display", "block");
            if (String(NodeName).indexOf('经营部') != -1) {
                $("#mxlist").find("#fxmbm").each(function () {
                    $(this).removeAttr('readonly');
                });
            }
        }
    }
}

function Save() {

    var fname = $("#fname").val();
    var fdate = $("#fdate").val();
    var fdept = $("#fdept").val();
    var fcompany = $("#fcompany").val();
    var ftel = $("#ftel").val();
    var fk3 = $("#fk3").val();
    if (!ftel) {
        mui.toast('请填写联系方式');
        return;
    }
    var mxflag = false;
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fxmbm = $(this).find("#fxmbm").val();
        var fxmmc = $(this).find("#fxmmc").val();
        var fkhmc = $(this).find("#fkhmc").val();
        var fywy = $(this).find("#fywy").val();
        var fbz = $(this).find("#fbz").val();
        if (mxItem(fxmbm, fxmmc, fkhmc, fywy, fbz) == null) {
            mxflag = true;
            return;
        }
        var mx = mxItem(fxmbm, fxmmc, fkhmc, fywy, fbz);
        mxlistArr.push(mx);
    });

    if (mxflag) {
        return;
    }

    var btnArry = ["取消", "确定"];
    mui.confirm('即将提交，是否确定？', '提交确认提醒', btnArry, function (e) {
        if (e.index == 1) {

            var xml = '<?xml version= "1.0" ?>';
            xml = xml + '   <XForm>';
            xml = xml + '         <Header>';
            xml = xml + '        <Method>Post</Method>';
            xml = xml + '       <ProcessName>建设公司K3项目编码新增申请</ProcessName>';
            xml = xml + '         <ProcessVersion>' + version + '</ProcessVersion>';
            xml = xml + '            <DraftGuid></DraftGuid>';
            xml = xml + '             <OwnerMemberFullName>' + BPMOU + '</OwnerMemberFullName>';
            xml = xml + '            <Action>提交</Action>';
            xml = xml + '          <Comment></Comment>';
            xml = xml + '             <InviteIndicateUsers></InviteIndicateUsers>';
            xml = xml + '       </Header>';
            xml = xml + '       <FormData>';

            xml = xml + '  <建设公司_K3项目编码新增申请_主表>';
            xml = xml + '<单号>自动生成</单号>';
            xml = xml + ' <申请人>' + fname + '</申请人>';
            xml = xml + '  <申请日期>' + fdate + '</申请日期>';
            xml = xml + ' <申请部门>' + fdept + '</申请部门>';
            xml = xml + ' <申请公司>' + fcompany + '</申请公司>';
            xml = xml + '   <联系方式>' + ftel + '</联系方式>';
            xml = xml + ' </建设公司_K3项目编码新增申请_主表>';


            for (var i = 0; i < mxlistArr.length;i++){
                xml = xml + '  <建设公司_K3项目编码新增申请_子表>';
                xml = xml + ' <RelationRowGuid>'+(i+1)+'</RelationRowGuid>';
                xml = xml + ' <RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + ' <序号>' + (i + 1) +'</序号>';
                xml = xml + ' <项目编码>' + mxlistArr[i].fxmbm + '</项目编码>';
                xml = xml + ' <项目名称>' + mxlistArr[i].fxmmc + '</项目名称>';
                xml = xml + '  <客户名称>' + mxlistArr[i].fkhmc + '</客户名称>';
                xml = xml + ' <业务员>' + mxlistArr[i].fywy + '</业务员>';
                xml = xml + ' <备注>' + mxlistArr[i].fbz + '</备注>';
                xml = xml + ' </建设公司_K3项目编码新增申请_子表>';
            }

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
    var fcompany = $("#fcompany").val();
    var ftel = $("#ftel").val();
    var fk3 = $("#fk3").val();
    if (!ftel) {
        mui.toast('请填写联系方式');
        return;
    }
    var mxflag = false;
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fxmbm = $(this).find("#fxmbm").val();
        var fxmmc = $(this).find("#fxmmc").val();
        var fkhmc = $(this).find("#fkhmc").val();
        var fywy = $(this).find("#fywy").val();
        var fbz = $(this).find("#fbz").val();
        if (mxItem(fxmbm, fxmmc, fkhmc, fywy, fbz) == null) {
            mxflag = true;
            return;
        }
        var mx = mxItem(fxmbm, fxmmc, fkhmc, fywy, fbz);
        mxlistArr.push(mx);
    });

    if (mxflag) {
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

            xml = xml + '  <建设公司_K3项目编码新增申请_主表>';
            xml = xml + '<单号>' + fbillno + '</单号>';
            xml = xml + ' <申请人>' + fname + '</申请人>';
            xml = xml + '  <申请日期>' + fdate + '</申请日期>';
            xml = xml + ' <申请部门>' + fdept + '</申请部门>';
            xml = xml + ' <申请公司>' + fcompany + '</申请公司>';
            xml = xml + '   <联系方式>' + ftel + '</联系方式>';
            xml = xml + ' </建设公司_K3项目编码新增申请_主表>';


            for (var i = 0; i < mxlistArr.length; i++) {
                xml = xml + '  <建设公司_K3项目编码新增申请_子表>';
                xml = xml + ' <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml = xml + ' <RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + ' <序号>' + (i + 1) + '</序号>';
                xml = xml + ' <项目编码>' + mxlistArr[i].fxmbm + '</项目编码>';
                xml = xml + ' <项目名称>' + mxlistArr[i].fxmmc + '</项目名称>';
                xml = xml + '  <客户名称>' + mxlistArr[i].fkhmc + '</客户名称>';
                xml = xml + ' <业务员>' + mxlistArr[i].fywy + '</业务员>';
                xml = xml + ' <备注>' + mxlistArr[i].fbz + '</备注>';
                xml = xml + ' </建设公司_K3项目编码新增申请_子表>';
            }

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
    var fcompany = $("#fcompany").val();
    var ftel = $("#ftel").val();
    var fk3 = $("#fk3").val();
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fxmbm = $(this).find("#fxmbm").val();
        var fxmmc = $(this).find("#fxmmc").val();
        var fkhmc = $(this).find("#fkhmc").val();
        var fywy = $(this).find("#fywy").val();
        var fbz = $(this).find("#fbz").val();

        var mx = mxItem(fxmbm, fxmmc, fkhmc, fywy, fbz);
        mxlistArr.push(mx);
    });

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

            xml = xml + '  <建设公司_K3项目编码新增申请_主表>';
            xml = xml + '<单号>' + fbillno + '</单号>';
            xml = xml + ' <申请人>' + fname + '</申请人>';
            xml = xml + '  <申请日期>' + fdate + '</申请日期>';
            xml = xml + ' <申请部门>' + fdept + '</申请部门>';
            xml = xml + ' <申请公司>' + fcompany + '</申请公司>';
            xml = xml + '   <联系方式>' + ftel + '</联系方式>';
            xml = xml + ' </建设公司_K3项目编码新增申请_主表>';


            for (var i = 0; i < mxlistArr.length; i++) {
                xml = xml + '  <建设公司_K3项目编码新增申请_子表>';
                xml = xml + ' <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml = xml + ' <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
                xml = xml + ' <序号>' + (i + 1) + '</序号>';
                xml = xml + ' <项目编码>' + mxlistArr[i].fxmbm + '</项目编码>';
                xml = xml + ' <项目名称>' + mxlistArr[i].fxmmc + '</项目名称>';
                xml = xml + '  <客户名称>' + mxlistArr[i].fkhmc + '</客户名称>';
                xml = xml + ' <业务员>' + mxlistArr[i].fywy + '</业务员>';
                xml = xml + ' <备注>' + mxlistArr[i].fbz + '</备注>';
                xml = xml + ' </建设公司_K3项目编码新增申请_子表>';
            }

            xml = xml + '</FormData>';
            xml = xml + '</XForm>';
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
    var fdept = $("#fdept").val();
    var fcompany = $("#fcompany").val();
    var ftel = $("#ftel").val();
    var fk3 = $("#fk3").val();
    var mxlistArr = new Array();
    var mxflag = false;
    $("#mxlist").find("#mx").each(function () {
        var fxmbm = $(this).find("#fxmbm").val();
        var fxmmc = $(this).find("#fxmmc").val();
        var fkhmc = $(this).find("#fkhmc").val();
        var fywy = $(this).find("#fywy").val();
        var fbz = $(this).find("#fbz").val();
        if (String(nodeName).indexOf('经营部')!=-1) {
            if (!fxmbm) {
                mui.toast('请填写项目编码');
                mxflag = true;
                return;
            }
        }
        var mx = mxItem(fxmbm, fxmmc, fkhmc, fywy, fbz);
        mxlistArr.push(mx);
    });
    if (mxflag) {
        return;
    }

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
                consignUserStr = (String)($('#consignUser').val()).replace(",", ";");



            }
        }).fail(function () {

        });
    } else {


    }
    if (consignFlag) {
        consignAjax.then(function () {
            var xml = '<?xml version="1.0"?>';
            xml = xml + '<XForm>';
            xml = xml + '<Header>';
            xml = xml + '<Method>Process</Method>';
            xml = xml + '<PID>' + pid + '</PID>';
            xml = xml + '<Action>同意</Action>';
            xml = xml + '<Comment>' + comment + '</Comment>';

            //加签差异部分
            xml = xml + '<ConsignEnabled>True</ConsignEnabled>';
            xml = xml + '<ConsignUsers>' + consignUserStr + '</ConsignUsers>';
            xml = xml + '<ConsignRoutingType>' + consignRoutingType + '</ConsignRoutingType>';
            xml = xml + '<ConsignReturnType>' + consignReturnType + '</ConsignReturnType>';

            xml = xml + '<InviteIndicateUsers></InviteIndicateUsers>';
            xml = xml + '</Header>';
            xml = xml + '<FormData>';

            xml = xml + '  <建设公司_K3项目编码新增申请_主表>';
            xml = xml + '<单号>' + fbillno + '</单号>';
            xml = xml + ' <申请人>' + fname + '</申请人>';
            xml = xml + '  <申请日期>' + fdate + '</申请日期>';
            xml = xml + ' <申请部门>' + fdept + '</申请部门>';
            xml = xml + ' <申请公司>' + fcompany + '</申请公司>';
            xml = xml + '   <联系方式>' + ftel + '</联系方式>';
            xml = xml + ' </建设公司_K3项目编码新增申请_主表>';


            for (var i = 0; i < mxlistArr.length; i++) {
                xml = xml + '  <建设公司_K3项目编码新增申请_子表>';
                xml = xml + ' <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml = xml + ' <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
                xml = xml + ' <序号>' + (i + 1) + '</序号>';
                xml = xml + ' <项目编码>' + mxlistArr[i].fxmbm + '</项目编码>';
                xml = xml + ' <项目名称>' + mxlistArr[i].fxmmc + '</项目名称>';
                xml = xml + '  <客户名称>' + mxlistArr[i].fkhmc + '</客户名称>';
                xml = xml + ' <业务员>' + mxlistArr[i].fywy + '</业务员>';
                xml = xml + ' <备注>' + mxlistArr[i].fbz + '</备注>';
                xml = xml + ' </建设公司_K3项目编码新增申请_子表>';
            }

            xml = xml + '</FormData>';
            xml = xml + '</XForm>';
            PostXml(xml);
        });
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

        xml = xml + '  <建设公司_K3项目编码新增申请_主表>';
        xml = xml + '<单号>' + fbillno + '</单号>';
        xml = xml + ' <申请人>' + fname + '</申请人>';
        xml = xml + '  <申请日期>' + fdate + '</申请日期>';
        xml = xml + ' <申请部门>' + fdept + '</申请部门>';
        xml = xml + ' <申请公司>' + fcompany + '</申请公司>';
        xml = xml + '   <联系方式>' + ftel + '</联系方式>';
        xml = xml + ' </建设公司_K3项目编码新增申请_主表>';


        for (var i = 0; i < mxlistArr.length; i++) {
            xml = xml + '  <建设公司_K3项目编码新增申请_子表>';
            xml = xml + ' <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
            xml = xml + ' <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
            xml = xml + ' <序号>' + (i + 1) + '</序号>';
            xml = xml + ' <项目编码>' + mxlistArr[i].fxmbm + '</项目编码>';
            xml = xml + ' <项目名称>' + mxlistArr[i].fxmmc + '</项目名称>';
            xml = xml + '  <客户名称>' + mxlistArr[i].fkhmc + '</客户名称>';
            xml = xml + ' <业务员>' + mxlistArr[i].fywy + '</业务员>';
            xml = xml + ' <备注>' + mxlistArr[i].fbz + '</备注>';
            xml = xml + ' </建设公司_K3项目编码新增申请_子表>';
        }

        xml = xml + '</FormData>';
        xml = xml + '</XForm>';
        PostXml(xml);
    }

}