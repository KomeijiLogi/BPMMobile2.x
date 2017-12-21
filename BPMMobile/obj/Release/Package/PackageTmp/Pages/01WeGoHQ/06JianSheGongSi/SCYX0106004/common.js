
//预加载部分
function preCreate() {
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



 
        $("#fdate").val(getNowFormatDate(2));
        tapEvent();

        var xml = '<?xml version= "1.0" ?>';
        xml = xml + '   <Requests>';
        xml = xml + '   <Params>';
        xml = xml + '       <Method>GetFormPostData</Method>';
        xml = xml + '       <ProcessName>建设公司样品制作申请</ProcessName>';
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

        }).fail(function (e) {

        });
  

}

function preUndo() {
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
}

function preAskOrDone() {
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



//特殊行为部分
function tapEvent() {

    var fdeptdata = [

        {
            value: '',
            text: '家装'
        },
        {
            value: '',
            text: '工程'
        }
    ];

    showPicker('fdept', fdeptdata);


    var fyplxdata = [

        {
            value: '',
            text: '木门窗'
        },
        {
            value: '',
            text: '铝合金门窗'
        }

    ];
    showPicker('fyplx', fyplxdata);

    $("#tjmx").on('tap', function () {
        var li = '<div id="mx" class="mui-card">';
        li = li + '    <div class="mui-input-row itemtitle">';
        li = li + '       <label>明细列表项</label>';
        li = li + '       <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>';
        li = li + '    </div>';
        li = li + '    <div class="mui-input-row">';
        li = li + '        <label for="fcpbm">产品编码<i style="color:red;">*</i></label>';
        li = li + '        <input type="text" id="fcpbm" name="fcpbm" placeholder="请填写产品编码"/>';
        li = li + '    </div>';
        li = li + '    <div class="mui-input-row">';
        li = li + '        <label for="fcpmc">产品名称<i style="color:red;">*</i></label>';
        li = li + '        <input type="text" id="fcpmc" name="fcpmc" placeholder="请填写产品名称"/>';
        li = li + '    </div>';
        li = li + '    <div class="mui-input-row">';
        li = li + '         <label for="fggxh">规格型号<i style="color:red;">*</i></label>';
        li = li + '         <input type="text" id="fggxh" name="fggxh" placeholder="请填写规格型号"/>';
        li = li + '    </div>';
        li = li + '    <div class="mui-input-row">';
        li = li + '          <label for="fdw">单位<i style="color:red;">*</i></label>';
        li = li + '          <input type="text" id="fdw" name="fdw" placeholder="请填写单位"/>';
        li = li + '    </div>';
        li = li + '    <div class="mui-input-row">';
        li = li + '          <label for="fsl">数量<i style="color:red;">*</i></label>';
        li = li + '          <input type="number" id="fsl" name="fsl" placeholder="请填写数量"/>';
        li = li + '    </div>';
        li = li + '    <div class="mui-input-row">';
        li = li + '        <label for="fbz">备注说明</label>';
        li = li + '        <input type="text" id="fbz" name="fbz" placeholder="请填写备注说明"/>';
        li = li + '    </div>';
        li = li + '</div>';
        $("#mxlist").append(li);
        document.getElementById('tjmx').scrollIntoView();
    });
}





function mxItem(fcpbm, fcpmc, fggxh, fdw, fsl, fbz) {

    var mx = new Object;
    mx.fcpbm = fcpbm;
    mx.fcpmc = fcpmc;
    mx.fggxh = fggxh;
    mx.fdw = fdw;
    mx.fsl = fsl;
    mx.fbz = fbz;

    if (!fcpbm) {
        mui.toast('请填写产品编码');
        return;
    }
    if (!fcpmc) {
        mui.toast('请填写产品名称');
        return;
    }
    if (!fggxh) {
        mui.toast('请填写规格型号');
        return;
    }
    if (!fdw) {
        mui.toast('请填写单位');
        return;
    }
    if (!fsl) {
        mui.toast('请填写数量');
        return;
    }
    return mx;

}

//装载信息部分
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
        var item = data.FormDataSet.建设公司_样品制作申请_主表[0];

        //待办特殊操作
        if (flag) {

            
            $("#taskId").val(item.TaskID);
            $("#stepId").val(stepId);
            $("#fbillno").val(item.单号);
            
        } 

        //获取信息共用部分

        $("#fname").val(item.申请人);
        $("#fdate").val(FormatterTimeYMS(item.申请日期));
        $("#fdept").val(item.申请部门);
        $("#ftel").val(item.联系方式);
        $("#fgcbm").val(item.工程编码);
        $("#fgcmc").val(item.工程名称);
        $("#fyplx").val(item.样品类型);
        $("#fxqdate").val(FormatterTimeYMS(item.需求日期));
        $("#fsqsm").val(item.申请说明);

        //子表信息部分
        var item_c = data.FormDataSet.建设公司_样品制作申请_子表;
        for (var i = 0; i < item_c.length; i++){
            itemidArr.push(item_c[i].itemid);
            var li = '<div id="mx" class="mui-card">';
            li = li + '    <div class="mui-input-row itemtitle">';
            li = li + '       <label>明细列表项</label>';
            li = li + '       <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>';
            li = li + '    </div>';
            li = li + '    <div class="mui-input-row">';
            li = li + '        <label for="fcpbm">产品编码<i style="color:red;">*</i></label>';
            li = li + '        <input type="text" id="fcpbm" name="fcpbm" readonly="readonly" value="' + item_c[i].产品编码 + '"/>';
            li = li + '    </div>';
            li = li + '    <div class="mui-input-row">';
            li = li + '        <label for="fcpmc">产品名称<i style="color:red;">*</i></label>';
            li = li + '        <input type="text" id="fcpmc" name="fcpmc" readonly="readonly" value="' + item_c[i].产品名称 + '"/>';
            li = li + '    </div>';
            li = li + '    <div class="mui-input-row">';
            li = li + '         <label for="fggxh">规格型号<i style="color:red;">*</i></label>';
            li = li + '         <input type="text" id="fggxh" name="fggxh" readonly="readonly" value="' + item_c[i].规格型号 + '"/>';
            li = li + '    </div>';
            li = li + '    <div class="mui-input-row">';
            li = li + '          <label for="fdw">单位<i style="color:red;">*</i></label>';
            li = li + '          <input type="text" id="fdw" name="fdw" readonly="readonly" value="' + item_c[i].单位 + '"/>';
            li = li + '    </div>';
            li = li + '    <div class="mui-input-row">';
            li = li + '          <label for="fsl">数量<i style="color:red;">*</i></label>';
            li = li + '          <input type="number" id="fsl" name="fsl" readonly="readonly" value="' + item_c[i].数量 + '"/>';
            li = li + '    </div>';
            li = li + '    <div class="mui-input-row">';
            li = li + '        <label for="fbz">备注说明</label>';
            li = li + '        <input type="text" id="fbz" name="fbz" readonly="readonly" value="' + changeNullToEmpty( item_c[i].备注说明 )+ '"/>';
            li = li + '    </div>';
            li = li + '</div>';
            $("#mxlist").append(li);
            if (flag) {
                //todo:如果需要对子表进行特殊操作，在此区域内执行对应方法
            }
        }



        //时间线部分
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
//节点控制函数
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
    if (NodeName == "开始"){
        $("#createD").css("display", "block");
        $("#csd").css("display", "none");
        $("#mxlist").find('span').each(function () {
            $(this).css("display", "block");

        });
        $("#tjmx").css('display', 'block');
        $("#mxlist").find('input').each(function () {
            $(this).removeAttr('readonly');
        });
        tapEvent();
        $("#ftel,#fgcbm,#fgcmc,#fxqdate,#fsqsm").removeAttr('readonly');
    } else if (NodeName == "sysInform") {
        $("#readD").css("display", "block");
        $("#csd").css("display", "none");

    } else {
        if (typeof (NodeName) != "undefined") {
            $("#approvalD").css("display", "block");
        }
    }
}


//行为函数部分
function Save() {
    var fname = $("#fname").val();
    var fdate = $("#fdate").val();
    var fdept = $("#fdept").val();
    var ftel = $("#ftel").val();
    var fgcbm = $("#fgcbm").val();
    var fgcmc = $("#fgcmc").val();
    var fyplx = $("#fyplx").val();
    var fxqdate = $("#fxqdate").val();
    var fsqsm = $("#fsqsm").val();

    if (!fdept) {
        mui.toast('请选择申请部门');
        return;
    }
    if (!ftel) {
        mui.toast('请填写联系方式');
        return;
    }
    if (!fgcbm) {
        mui.toast('请填写工程编码');
        return;
    }
    if (!fgcmc) {
        mui.toast('请填写工程名称');
        return;
    }
    if (!fyplx) {
        mui.toast('请选择样品类型');
        return;
    }
    if (!fxqdate) {
        mui.toast('请选择需求时间');
        return;
    }
    if (!fsqsm) {
        mui.toast('请填写申请说明');
        return;
    }

    var mxflag = false;
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fcpbm = $(this).find("#fcpbm").val();
        var fcpmc = $(this).find("#fcpmc").val();
        var fggxh = $(this).find("#fggxh").val();
        var fdw = $(this).find("#fdw").val();
        var fsl = $(this).find("#fsl").val();
        var fbz = $(this).find("#fbz").val();

        if (mxItem(fcpbm, fcpmc, fggxh, fdw, fsl, fbz) == null) {
            mxflag = true;
            return;

        }
        var mx = mxItem(fcpbm, fcpmc, fggxh, fdw, fsl, fbz);
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
            xml = xml + '       <ProcessName>建设公司样品制作申请</ProcessName>';
            xml = xml + '         <ProcessVersion>' + version + '</ProcessVersion>';
            xml = xml + '            <DraftGuid></DraftGuid>';
            xml = xml + '             <OwnerMemberFullName>' + BPMOU + '</OwnerMemberFullName>';
            xml = xml + '            <Action>提交</Action>';
            xml = xml + '          <Comment></Comment>';
            xml = xml + '             <InviteIndicateUsers></InviteIndicateUsers>';
            xml = xml + '       </Header>';
            xml = xml + '       <FormData>';

            xml = xml + '  <建设公司_样品制作申请_主表>';
            xml = xml + ' <单号>自动生成</单号>';
            xml = xml + '  <申请人>' + fname + '</申请人>';
            xml = xml + '  <申请日期>' + fdate + '</申请日期>';
            xml = xml + ' <申请部门>' + fdept + '</申请部门>';
            xml = xml + '   <联系方式>' + ftel + '</联系方式>';
            xml = xml + '  <工程编码>' + fgcbm + '</工程编码>';
            xml = xml + '  <工程名称>' + fgcmc + '</工程名称>';
            xml = xml + '  <样品类型>' + fyplx + '</样品类型>';
            xml = xml + '  <需求日期>' + fxqdate + '</需求日期>';
            xml = xml + '  <申请说明>' + fsqsm + '</申请说明>';
            xml = xml + ' </建设公司_样品制作申请_主表>';

            for (var i = 0; i < mxlistArr.length;i++){
                xml = xml + '   <建设公司_样品制作申请_子表>';
                xml = xml + '  <RelationRowGuid>'+(i+1)+'</RelationRowGuid>';
                xml = xml + '    <RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + '      <序号>' + (i + 1) + '</序号>';
                xml = xml + '     <产品编码>' + mxlistArr[i].fcpbm + '</产品编码>';
                xml = xml + '     <产品名称>' + mxlistArr[i].fcpmc + '</产品名称>';
                xml = xml + '    <规格型号>' + mxlistArr[i].fggxh + '</规格型号>';
                xml = xml + '   <单位>' + mxlistArr[i].fdw + '</单位>';
                xml = xml + '   <数量>' + mxlistArr[i].fsl + '</数量>';
                xml = xml + '     <备注说明>' + mxlistArr[i].fbz + '</备注说明>';
                xml = xml + '   </建设公司_样品制作申请_子表>';
               

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
    var ftel = $("#ftel").val();
    var fgcbm = $("#fgcbm").val();
    var fgcmc = $("#fgcmc").val();
    var fyplx = $("#fyplx").val();
    var fxqdate = $("#fxqdate").val();
    var fsqsm = $("#fsqsm").val();

    if (!fdept) {
        mui.toast('请选择申请部门');
        return;
    }
    if (!ftel) {
        mui.toast('请填写联系方式');
        return;
    }
    if (!fgcbm) {
        mui.toast('请填写工程编码');
        return;
    }
    if (!fgcmc) {
        mui.toast('请填写工程名称');
        return;
    }
    if (!fyplx) {
        mui.toast('请选择样品类型');
        return;
    }
    if (!fxqdate) {
        mui.toast('请选择需求时间');
        return;
    }
    if (!fsqsm) {
        mui.toast('请填写申请说明');
        return;
    }

    var mxflag = false;
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fcpbm = $(this).find("#fcpbm").val();
        var fcpmc = $(this).find("#fcpmc").val();
        var fggxh = $(this).find("#fggxh").val();
        var fdw = $(this).find("#fdw").val();
        var fsl = $(this).find("#fsl").val();
        var fbz = $(this).find("#fbz").val();

        if (mxItem(fcpbm, fcpmc, fggxh, fdw, fsl, fbz) == null) {
            mxflag = true;
            return;

        }
        var mx = mxItem(fcpbm, fcpmc, fggxh, fdw, fsl, fbz);
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
            xml = xml + '  <建设公司_样品制作申请_主表>';
            xml = xml + ' <单号>' + fbillno + '</单号>';
            xml = xml + '  <申请人>' + fname + '</申请人>';
            xml = xml + '  <申请日期>' + fdate + '</申请日期>';
            xml = xml + ' <申请部门>' + fdept + '</申请部门>';
            xml = xml + '   <联系方式>' + ftel + '</联系方式>';
            xml = xml + '  <工程编码>' + fgcbm + '</工程编码>';
            xml = xml + '  <工程名称>' + fgcmc + '</工程名称>';
            xml = xml + '  <样品类型>' + fyplx + '</样品类型>';
            xml = xml + '  <需求日期>' + fxqdate + '</需求日期>';
            xml = xml + '  <申请说明>' + fsqsm + '</申请说明>';
            xml = xml + ' </建设公司_样品制作申请_主表>';

            for (var i = 0; i < mxlistArr.length; i++) {
                xml = xml + '   <建设公司_样品制作申请_子表>';
                xml = xml + '  <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml = xml + '    <RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + '      <序号>' + (i + 1) + '</序号>';
                xml = xml + '     <产品编码>' + mxlistArr[i].fcpbm + '</产品编码>';
                xml = xml + '     <产品名称>' + mxlistArr[i].fcpmc + '</产品名称>';
                xml = xml + '    <规格型号>' + mxlistArr[i].fggxh + '</规格型号>';
                xml = xml + '   <单位>' + mxlistArr[i].fdw + '</单位>';
                xml = xml + '   <数量>' + mxlistArr[i].fsl + '</数量>';
                xml = xml + '     <备注说明>' + mxlistArr[i].fbz + '</备注说明>';
                xml = xml + '   </建设公司_样品制作申请_子表>';
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
    var ftel = $("#ftel").val();
    var fgcbm = $("#fgcbm").val();
    var fgcmc = $("#fgcmc").val();
    var fyplx = $("#fyplx").val();
    var fxqdate = $("#fxqdate").val();
    var fsqsm = $("#fsqsm").val();
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fcpbm = $(this).find("#fcpbm").val();
        var fcpmc = $(this).find("#fcpmc").val();
        var fggxh = $(this).find("#fggxh").val();
        var fdw = $(this).find("#fdw").val();
        var fsl = $(this).find("#fsl").val();
        var fbz = $(this).find("#fbz").val();

       
        var mx = mxItem(fcpbm, fcpmc, fggxh, fdw, fsl, fbz);
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
            xml = xml + '  <建设公司_样品制作申请_主表>';
            xml = xml + ' <单号>' + fbillno + '</单号>';
            xml = xml + '  <申请人>' + fname + '</申请人>';
            xml = xml + '  <申请日期>' + fdate + '</申请日期>';
            xml = xml + ' <申请部门>' + fdept + '</申请部门>';
            xml = xml + '   <联系方式>' + ftel + '</联系方式>';
            xml = xml + '  <工程编码>' + fgcbm + '</工程编码>';
            xml = xml + '  <工程名称>' + fgcmc + '</工程名称>';
            xml = xml + '  <样品类型>' + fyplx + '</样品类型>';
            xml = xml + '  <需求日期>' + fxqdate + '</需求日期>';
            xml = xml + '  <申请说明>' + fsqsm + '</申请说明>';
            xml = xml + ' </建设公司_样品制作申请_主表>';

            for (var i = 0; i < mxlistArr.length; i++) {
                xml = xml + '   <建设公司_样品制作申请_子表>';
                xml = xml + '  <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml = xml + '    <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
                xml = xml + '      <序号>' + (i + 1) + '</序号>';
                xml = xml + '     <产品编码>' + mxlistArr[i].fcpbm + '</产品编码>';
                xml = xml + '     <产品名称>' + mxlistArr[i].fcpmc + '</产品名称>';
                xml = xml + '    <规格型号>' + mxlistArr[i].fggxh + '</规格型号>';
                xml = xml + '   <单位>' + mxlistArr[i].fdw + '</单位>';
                xml = xml + '   <数量>' + mxlistArr[i].fsl + '</数量>';
                xml = xml + '     <备注说明>' + mxlistArr[i].fbz + '</备注说明>';
                xml = xml + '   </建设公司_样品制作申请_子表>';
                

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
    var fname = $("#fname").val();
    var fdate = $("#fdate").val();
    var fdept = $("#fdept").val();
    var ftel = $("#ftel").val();
    var fgcbm = $("#fgcbm").val();
    var fgcmc = $("#fgcmc").val();
    var fyplx = $("#fyplx").val();
    var fxqdate = $("#fxqdate").val();
    var fsqsm = $("#fsqsm").val();
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fcpbm = $(this).find("#fcpbm").val();
        var fcpmc = $(this).find("#fcpmc").val();
        var fggxh = $(this).find("#fggxh").val();
        var fdw = $(this).find("#fdw").val();
        var fsl = $(this).find("#fsl").val();
        var fbz = $(this).find("#fbz").val();


        var mx = mxItem(fcpbm, fcpmc, fggxh, fdw, fsl, fbz);
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


        $.ajax({
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
                xml = xml + '  <建设公司_样品制作申请_主表>';
                xml = xml + ' <单号>' + fbillno + '</单号>';
                xml = xml + '  <申请人>' + fname + '</申请人>';
                xml = xml + '  <申请日期>' + fdate + '</申请日期>';
                xml = xml + ' <申请部门>' + fdept + '</申请部门>';
                xml = xml + '   <联系方式>' + ftel + '</联系方式>';
                xml = xml + '  <工程编码>' + fgcbm + '</工程编码>';
                xml = xml + '  <工程名称>' + fgcmc + '</工程名称>';
                xml = xml + '  <样品类型>' + fyplx + '</样品类型>';
                xml = xml + '  <需求日期>' + fxqdate + '</需求日期>';
                xml = xml + '  <申请说明>' + fsqsm + '</申请说明>';
                xml = xml + ' </建设公司_样品制作申请_主表>';

                for (var i = 0; i < mxlistArr.length; i++) {
                    xml = xml + '   <建设公司_样品制作申请_子表>';
                    xml = xml + '  <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                    xml = xml + '    <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
                    xml = xml + '      <序号>' + (i + 1) + '</序号>';
                    xml = xml + '     <产品编码>' + mxlistArr[i].fcpbm + '</产品编码>';
                    xml = xml + '     <产品名称>' + mxlistArr[i].fcpmc + '</产品名称>';
                    xml = xml + '    <规格型号>' + mxlistArr[i].fggxh + '</规格型号>';
                    xml = xml + '   <单位>' + mxlistArr[i].fdw + '</单位>';
                    xml = xml + '   <数量>' + mxlistArr[i].fsl + '</数量>';
                    xml = xml + '     <备注说明>' + mxlistArr[i].fbz + '</备注说明>';
                    xml = xml + '   </建设公司_样品制作申请_子表>';
                }
                    xml = xml + '</FormData>';
                    xml = xml + '</XForm>';

                
                PostXml(xml);
            }
        }).fail(function (e) {

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
        xml = xml + '  <建设公司_样品制作申请_主表>';
        xml = xml + ' <单号>' + fbillno + '</单号>';
        xml = xml + '  <申请人>' + fname + '</申请人>';
        xml = xml + '  <申请日期>' + fdate + '</申请日期>';
        xml = xml + ' <申请部门>' + fdept + '</申请部门>';
        xml = xml + '   <联系方式>' + ftel + '</联系方式>';
        xml = xml + '  <工程编码>' + fgcbm + '</工程编码>';
        xml = xml + '  <工程名称>' + fgcmc + '</工程名称>';
        xml = xml + '  <样品类型>' + fyplx + '</样品类型>';
        xml = xml + '  <需求日期>' + fxqdate + '</需求日期>';
        xml = xml + '  <申请说明>' + fsqsm + '</申请说明>';
        xml = xml + ' </建设公司_样品制作申请_主表>';

        for (var i = 0; i < mxlistArr.length; i++) {
            xml = xml + '   <建设公司_样品制作申请_子表>';
            xml = xml + '  <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
            xml = xml + '    <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
            xml = xml + '      <序号>' + (i + 1) + '</序号>';
            xml = xml + '     <产品编码>' + mxlistArr[i].fcpbm + '</产品编码>';
            xml = xml + '     <产品名称>' + mxlistArr[i].fcpmc + '</产品名称>';
            xml = xml + '    <规格型号>' + mxlistArr[i].fggxh + '</规格型号>';
            xml = xml + '   <单位>' + mxlistArr[i].fdw + '</单位>';
            xml = xml + '   <数量>' + mxlistArr[i].fsl + '</数量>';
            xml = xml + '     <备注说明>' + mxlistArr[i].fbz + '</备注说明>';
            xml = xml + '   </建设公司_样品制作申请_子表>';
        }
            xml = xml + '</FormData>';
            xml = xml + '</XForm>';

        
        PostXml(xml);
    }

}