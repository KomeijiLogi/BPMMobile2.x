
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
    $("#fsgdw").val('威海威高建设有限公司');
    $("#fglfl").val('5');
    $("#fsj").val('0');
    $("#fglf").val('0');
    $("#fcbdj").val('0');
    $("#ftotal").val('0');

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

    $("#addItem").on('tap', function () {

        var li = '<div id="bl" class="mui-card">';
        li = li + '   <div class="mui-input-row bgc">';
        li = li + '        <label>明细列表项</label> ';
        li = li + '        <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '        <label for="ffylb">费用类别<i style="color:red;">*</i></label>';
        li = li + '        <input type="text" id="ffylb" name="ffylb" value="" placeholder="请选择费用类别" readonly="readonly"/> ';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '        <label for="ffymx">费用明细<i style="color:red;">*</i></label>';
        li = li + '        <input type="text" id="ffymx" name="ffymx" value="" placeholder="请输入费用明细"/> ';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '        <label for="fdw">单位<i style="color:red;">*</i></label>';
        li = li + '        <input type="text" id="fdw" name="fdw" value="" placeholder="请输入单位"/> ';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '        <label for="fpfyl">每平方用量<i style="color:red;">*</i></label>';
        li = li + '        <input type="number" id="fpfyl" name="fpfyl" value=""  placeholder="请输入每平方用量" onchange="amountPrice()"/>';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '        <label for="fdj">单价（元）<i style="color:red;">*</i></label>';
        li = li + '        <input type="number" id="fdj" name="fdj" value="" placeholder="请输入单价"  onchange="amountPrice()"/>';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '        <label for="fje">金额<i style="color:red;">*</i></label>';
        li = li + '        <input type="number" id="fje" name="fje" value="" readonly="readonly" />';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '        <label for="fbz">备注</label>';
        li = li + '        <input type="text" id="fbz" name="fbz" value="" readonly="readonly"/> ';
        li = li + '   </div>';
        li = li + '   </div>';


        $("#bllist").append(li);
        showPickerByZepto('#bllist', '#ffylb', ffylbdata);
    });
    var ffylbdata = [
        {
            value: "rgf",
            text: "人工费"
        },
        {
            value: "clf",
            text: "材料费"
        },
        {
            value: "jxf",
            text: "机械费"
        },
        {
            value: "qtfy",
            text: "其他费用"
        }
    ];
    var fcplxdata = [
        {
            value: "mc",
            text: "门窗"
        },
        {
            value: "ty",
            text: "铁艺"
        },
        {
            value: "mq",
            text: "幕墙"
        }
    ];
    var element = document.getElementById("fcplx");
   
    var picker = new mui.PopPicker();

    picker.setData(fcplxdata);

    element.addEventListener('tap', function () {

        picker.show(function (items) {

            element.value = items[0].text;
            changeCplx();
        });

    }, false);

    var fsldata = [
        {
            value: "5.6",
            text: "5.6"
        },
        {
            value: "7",
            text: "7"
        }
    ];
    showPicker("fsl", fsldata);
}
function changeCplx() {
    var cplx = $("#fcplx").val();
    if (cplx == "门窗") {
        $("#fsl").val("5.6");
        $("#fclfl").val("");
        amountPrice();
    } else if (cplx == "铁艺"){
        $("#fsl").val("7");
        $("#fclfl").val("3");
        $("#fclf").val("0");
        amountPrice();
    } else {
        $("#fsl").val("5.6");
        $("#fclfl").val("");
        amountPrice();

    }
}
function amountPrice() {
    var ftotal = 0;
    var clf = 0;
    var glf = 0;
    var sj = 0;
    var cbdj = 0;
    var clfl = $("#fclfl").val();
    var glfl = $("#fglfl").val();
    var sl = $("#fsl").val();

    //计算汇总申请付款
    $("#bllist").find("#bl").each(function () {
        var fpfyl = parseFloat($(this).find("#fpfyl").val());
        var fdj = parseFloat($(this).find("#fdj").val());
        var fje = 0;
        if ($(this).find("#fpfyl").val() == null || $(this).find("#fpfyl").val() == "") {
            fpfyl = 0;
        }
        if ($(this).find("#fdj").val() == null || $(this).find("#fdj").val() == "") {
            fdj = 0;
        }
        fje = fpfyl * fdj;
        $(this).find("#fje").val(fje);
        if (ftotal == 0) {
            ftotal = fje;
        } else {
            ftotal += fje;
        }
    });
    var cplx = $("#fcplx").val();
    if (cplx == "门窗") {
        clf = ftotal * clfl * 0.01;
        glf = ftotal * glfl * 0.01;
        sj = (ftotal + glf) * sl * 0.01;
        cbdj = ftotal + clf + glf + sj;
        glf = glf.toFixed(2);
        sj = sj.toFixed(2);
        cbdj = cbdj.toFixed(2);
    } else if (cplx == "铁艺") {
        clf = ftotal * clfl * 0.01;
        glf = (ftotal + clf) * glfl * 0.01;
        sj = (ftotal + glf + clf) * sl * 0.01;
        cbdj = ftotal + clf + glf + sj;
        clf = clf.toFixed(2);
        glf = glf.toFixed(2);
        sj = sj.toFixed(2);
        cbdj = cbdj.toFixed(2);
    } else if (cplx == "幕墙") {
        clf = ftotal * clfl * 0.01;
        glf = ftotal * glfl * 0.01;
        sj = (ftotal + glf) * sl * 0.01;
        cbdj = ftotal + clf + glf + sj;
        glf = glf.toFixed(2);
        sj = sj.toFixed(2);
        cbdj = cbdj.toFixed(2);
    }
    

    $("#ftotal").val(ftotal);
    $("#fclf").val(clf);
    $("#fglf").val(glf);
    $("#fsj").val(sj);
    $("#fcbdj").val(cbdj);

}
function deleteItem(context) {
    var btnArray = ['否', '是'];
    mui.confirm('确认删除？', '', btnArray, function (e) {
        if (e.index == 1) {
            $(context).parent().parent().remove();
            amountPrice();
        }
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

        var item = data.FormDataSet.建设公司_门窗工程成本分析提报_主表[0];

        //待办特殊操作
        if (flag) {
            
            $("#taskId").val(item.TaskID);
            $("#stepId").val(stepId);
            $("#fbillno").val(item.单号);

        }
        $("#fname").val(item.提报人);
        $("#fdate").val(FormatterTimeYMS(item.提报日期));
        $("#fdept").val(item.所属部门);
        $("#fcompany").val(item.所属公司);
        $("#fjsdw").val(item.建设单位);
        $("#fsgdw").val(item.施工单位);
        $("#fgcbm").val(item.工程编码);
        $("#fgcmc").val(item.工程名称);
        $("#fcplx").val(item.产品类型);
        $("#ftotal").val(item.合计费用);
        $("#fclfl").val(item.辅助材料费率);
        $("#fclf").val(item.辅助材料费);
        $("#fglfl").val(item.企业管理费率);
        $("#fglf").val(item.企业管理费);
        $("#fsl").val(item.税率);
        $("#fsj").val(item.税金);
        $("#fcbdj").val(item.工程成本单价);

        var bli = data.FormDataSet.建设公司_门窗工程成本分析提报_子表;
        for (var i = 0; i < bli.length; i++) {

            itemidArr.push(bli[i].itemid);
            var li = '<div id="bl" class="mui-card">';
            li = li + '   <div class="mui-input-row bgc">';
            li = li + '        <label>明细列表项</label> ';
            li = li + '        <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>';
            li = li + '   </div>';
            li = li + '   <div class="mui-input-row">';
            li = li + '        <label for="ffylb">供应商名称<i style="color:red;">*</i></label>';
            li = li + '        <input type="text" id="ffylb" name="ffylb" value="' + bli[i].费用类别 + '" readonly="readonly"/> ';
            li = li + '   </div>';
            li = li + '   <div class="mui-input-row">';
            li = li + '        <label for="ffymx">供应商类别<i style="color:red;">*</i></label>';
            li = li + '        <input type="text" id="ffymx" name="ffymx" value="' + bli[i].费用明细 + '" readonly="readonly"/> ';
            li = li + '   </div>';
            li = li + '   <div class="mui-input-row">';
            li = li + '        <label for="fdw">单位<i style="color:red;">*</i></label>';
            li = li + '        <input type="text" id="fdw" name="fdw" value="' + bli[i].单位 + '" readonly="readonly"/> ';
            li = li + '   </div>';
            li = li + '   <div class="mui-input-row">';
            li = li + '        <label for="fpfyl">每平方用量<i style="color:red;">*</i></label>';
            li = li + '        <input type="number" id="fpfyl" name="fpfyl" value="' + bli[i].用量 + '" readonly="readonly" onchange="amountPrice()"/> ';
            li = li + '   </div>';
            li = li + '   <div class="mui-input-row">';
            li = li + '        <label for="fdj">单价<i style="color:red;">*</i></label>';
            li = li + '        <input type="number" id="fdj" name="fdj" value="' + bli[i].单价 + '" readonly="readonly" onchange="amountPrice()"/>';
            li = li + '   </div>';
            li = li + '   <div class="mui-input-row">';
            li = li + '        <label for="fje">金额<i style="color:red;">*</i></label>';
            li = li + '        <input type="number" id="fje" name="fje" value="' + bli[i].金额 + '" readonly="readonly" />';
            li = li + '   </div>';
            li = li + '   <div class="mui-input-row">';
            li = li + '        <label for="fbz">备注</label>';
            li = li + '        <input type="text" id="fbz" name="fbz" value="' + changeNullToEmpty(bli[i].备注) + '" readonly="readonly""/>';
            li = li + '   </div>';
            

            $("#bllist").append(li);

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

        $("#fjsdw,#fsgdw,#fgcbm,#fgcmc").removeAttr('readonly');
        $("#bllist").find("span").each(function () {

            $(this).css("display", "block");
        });
        $("#bllist").find('#ffymx,#fdw,#fpfyl,#fdj').each(function () {

            $(this).removeAttr("readonly");
        });
        tapEvent();
       
        $("#addItem").css("display", "block");
        
    } else if (NodeName == "sysInform") {
        $("#readD").css("display", "block");
        $("#csd").css("display", "none");

    } else {
        if (typeof (NodeName) != "undefined") {
            $("#approvalD").css("display", "block");
            if (NodeName == "采招经理") {
                $("#bllist").find('#fbz').each(function () {

                    $(this).removeAttr("readonly");
                    $(this).attr("placeholder", "请输入备注");
                    $(this).parent().parent().find("#fdj").removeAttr("readonly");
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
    var fcompany = $("#fcompany").val();
    var fjsdw = $("#fjsdw").val();
    var fsgdw = $("#fsgdw").val();
    var fgcbm = $("#fgcbm").val();
    var fgcmc = $("#fgcmc").val();
    var fcplx = $("#fcplx").val();
    var ftotal = $("#ftotal").val();
    var fclfl = $("#fclfl").val();
    var fclf = $("#fclf").val();
    var fglfl = $("#fglfl").val();
    var fglf = $("#fglf").val();
    var fsl = $("#fsl").val();
    var fsj = $("#fsj").val();
    var fcbdj = $("#fcbdj").val();
    if (!fjsdw) {
        mui.toast('请输入建设单位（甲方）');
        return;
    }
    if (!fsgdw) {
        mui.toast('请输入施工单位（乙方）');
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
    if (!fcplx) {
        mui.toast('请选择产品类型');
        return;
    }
    var mxflag = false;
    var bllistArr = new Array();
    $("#bllist").find("#bl").each(function () {
        var ffylb = $(this).find("#ffylb").val();
        var ffymx = $(this).find("#ffymx").val();
        var fdw = $(this).find("#fdw").val();
        var fpfyl = $(this).find("#fpfyl").val();
        var fdj = $(this).find("#fdj").val();
        var fje = $(this).find("#fje").val();
        var fbz = $(this).find("#fbz").val();

        if (!ffylb) {
            mxflag = true;
            mui.toast("请选择费用类别");
            return;
        }
        if (!ffymx) {
            mxflag = true;
            mui.toast("请输入费用明细");
            return;
        }
        if (!fdw) {
            mxflag = true;
            mui.toast("请输入单位");
            return;
        }
        if (!fpfyl) {
            mxflag = true;
            mui.toast("请输入每平方用量");
            return;
        }
        if (!fdj) {
            mxflag = true;
            mui.toast("请输入单价");
            return;

        }
       
        var bl = new Object;
        bl.ffylb = ffylb;
        bl.ffymx = ffymx;
        bl.fdw = fdw;
        bl.fpfyl = fpfyl;
        bl.fdj = fdj;
        bl.fje = fje;
        bl.fbz = fbz;
        bllistArr.push(bl);
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
            xml = xml + '       <ProcessName>建设公司门窗工程成本分析提报</ProcessName>';
            xml = xml + '         <ProcessVersion>' + version + '</ProcessVersion>';
            xml = xml + '            <DraftGuid></DraftGuid>';
            xml = xml + '             <OwnerMemberFullName>' + BPMOU + '</OwnerMemberFullName>';
            xml = xml + '            <Action>提交</Action>';
            xml = xml + '          <Comment></Comment>';
            xml = xml + '             <InviteIndicateUsers></InviteIndicateUsers>';
            xml = xml + '       </Header>';
            xml = xml + '       <FormData>';

            xml = xml + '  <建设公司_门窗工程成本分析提报_主表>';
            xml = xml + '  <单号>自动生成</单号>';
            xml = xml + '  <提报人>' + fname + '</提报人>';
            xml = xml + '   <提报日期>' + fdate + '</提报日期>';
            xml = xml + '   <所属部门>' + fdept + '</所属部门>';
            xml = xml + '   <所属公司>' + fcompany + '</所属公司>';
            xml = xml + '   <建设单位>' + fjsdw + '</建设单位>';
            xml = xml + '   <施工单位>' + fsgdw + '</施工单位>';
            xml = xml + '  <工程编码>' + fgcbm + '</工程编码>';
            xml = xml + '   <工程名称>' + fgcmc + '</工程名称>';
            xml = xml + '   <产品类型>' + fcplx + '</产品类型>';
            xml = xml + '   <合计费用>' + ftotal + '</合计费用>';
            xml = xml + '   <辅助材料费率>' + fclfl + '</辅助材料费率>';
            xml = xml + '   <辅助材料费>' + fclf + '</辅助材料费>';
            xml = xml + '   <企业管理费率>' + fglfl + '</企业管理费率>';
            xml = xml + '   <企业管理费>' + fglf + '</企业管理费>';
            xml = xml + '   <税率>' + fsl + '</税率>';
            xml = xml + '   <税金>' + fsj + '</税金>';
            xml = xml + '   <工程成本单价>' + fcbdj + '</工程成本单价>';

            xml = xml + '  </建设公司_门窗工程成本分析提报_主表>';
            for (var i = 0; i < bllistArr.length; i++) {

                xml = xml + '<建设公司_门窗工程成本分析提报_子表>';
                xml = xml + '  <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml = xml + '  <RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + '<序号>' + (i + 1) + '</序号>';
                xml = xml + '<费用类别>' + bllistArr[i].ffylb + '</费用类别>';
                xml = xml + '<费用明细>' + bllistArr[i].ffymx + '</费用明细>';
                xml = xml + '<单位>' + bllistArr[i].fdw + '</单位>';
                xml = xml + '<用量>' + bllistArr[i].fpfyl + '</用量>';
                xml = xml + '<单价>' + bllistArr[i].fdj + '</单价>';
                xml = xml + '<金额>' + bllistArr[i].fje + '</金额>';
                xml = xml + '<备注>' + bllistArr[i].fbz + '</备注>';
                xml = xml + '</建设公司_门窗工程成本分析提报_子表>';

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
    var fdate = $("#fdate").val() + " 00:00:00";
    var fdept = $("#fdept").val();
    var fcompany = $("#fcompany").val();
    var fjsdw = $("#fjsdw").val();
    var fsgdw = $("#fsgdw").val();
    var fgcbm = $("#fgcbm").val();
    var fgcmc = $("#fgcmc").val();
    var fcplx = $("#fcplx").val();
    var ftotal = $("#ftotal").val();
    var fclfl = $("#fclfl").val();
    var fclf = $("#fclf").val();
    var fglfl = $("#fglfl").val();
    var fglf = $("#fglf").val();
    var fsl = $("#fsl").val();
    var fsj = $("#fsj").val();
    var fcbdj = $("#fcbdj").val();
    if (!fjsdw) {
        mui.toast('请输入建设单位（甲方）');
        return;
    }
    if (!fsgdw) {
        mui.toast('请输入施工单位（乙方）');
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
    if (!fcplx) {
        mui.toast('请选择产品类型');
        return;
    }
    var mxflag = false;
    var bllistArr = new Array();
    $("#bllist").find("#bl").each(function () {
        var ffylb = $(this).find("#ffylb").val();
        var ffymx = $(this).find("#ffymx").val();
        var fdw = $(this).find("#fdw").val();
        var fpfyl = $(this).find("#fpfyl").val();
        var fdj = $(this).find("#fdj").val();
        var fje = $(this).find("#fje").val();
        var fbz = $(this).find("#fbz").val();




        if (!ffylb) {
            mxflag = true;
            mui.toast("请选择费用类别");
            return;
        }
        if (!ffymx) {
            mxflag = true;
            mui.toast("请输入费用明细");
            return;
        }
        if (!fdw) {
            mxflag = true;
            mui.toast("请输入单位");
            return;
        }
        if (!fpfyl) {
            mxflag = true;
            mui.toast("请输入每平方用量");
            return;
        }
        if (!fdj) {
            mxflag = true;
            mui.toast("请输入单价");
            return;

        }


        var bl = new Object;
        bl.ffylb = ffylb;
        bl.ffymx = ffymx;
        bl.fdw = fdw;
        bl.fpfyl = fpfyl;
        bl.fdj = fdj;
        bl.fje = fje;
        bl.fbz = fbz;
        bllistArr.push(bl);
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

            xml = xml + '  <建设公司_门窗工程成本分析提报_主表>';
            xml = xml + '  <单号>' + fbillno +'</单号>';
            xml = xml + '  <提报人>' + fname + '</提报人>';
            xml = xml + '   <提报日期>' + fdate + '</提报日期>';
            xml = xml + '   <所属部门>' + fdept + '</所属部门>';
            xml = xml + '   <所属公司>' + fcompany + '</所属公司>';
            xml = xml + '   <建设单位>' + fjsdw + '</建设单位>';
            xml = xml + '   <施工单位>' + fsgdw + '</施工单位>';
            xml = xml + '  <工程编码>' + fgcbm + '</工程编码>';
            xml = xml + '   <工程名称>' + fgcmc + '</工程名称>';
            xml = xml + '   <产品类型>' + fcplx + '</产品类型>';
            xml = xml + '   <合计费用>' + ftotal + '</合计费用>';
            xml = xml + '   <辅助材料费率>' + fclfl + '</辅助材料费率>';
            xml = xml + '   <辅助材料费>' + fclf + '</辅助材料费>';
            xml = xml + '   <企业管理费率>' + fglfl + '</企业管理费率>';
            xml = xml + '   <企业管理费>' + fglf + '</企业管理费>';
            xml = xml + '   <税率>' + fsl + '</税率>';
            xml = xml + '   <税金>' + fsj + '</税金>';
            xml = xml + '   <工程成本单价>' + fcbdj + '</工程成本单价>';

            xml = xml + '  </建设公司_门窗工程成本分析提报_主表>';
            for (var i = 0; i < bllistArr.length; i++) {

                xml = xml + '<建设公司_门窗工程成本分析提报_子表>';
                xml = xml + '  <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml = xml + '  <RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + '<序号>' + (i + 1) + '</序号>';
                xml = xml + '<费用类别>' + bllistArr[i].ffylb + '</费用类别>';
                xml = xml + '<费用明细>' + bllistArr[i].ffymx + '</费用明细>';
                xml = xml + '<单位>' + bllistArr[i].fdw + '</单位>';
                xml = xml + '<用量>' + bllistArr[i].fpfyl + '</用量>';
                xml = xml + '<单价>' + bllistArr[i].fdj + '</单价>';
                xml = xml + '<金额>' + bllistArr[i].fje + '</金额>';
                xml = xml + '<备注>' + bllistArr[i].fbz + '</备注>';
                xml = xml + '</建设公司_门窗工程成本分析提报_子表>';

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
    var fdate = $("#fdate").val() + " 00:00:00";
    var fdept = $("#fdept").val();
    var fcompany = $("#fcompany").val();
    var fjsdw = $("#fjsdw").val();
    var fsgdw = $("#fsgdw").val();
    var fgcbm = $("#fgcbm").val();
    var fgcmc = $("#fgcmc").val();
    var fcplx = $("#fcplx").val();
    var ftotal = $("#ftotal").val();
    var fclfl = $("#fclfl").val();
    var fclf = $("#fclf").val();
    var fglfl = $("#fglfl").val();
    var fglf = $("#fglf").val();
    var fsl = $("#fsl").val();
    var fsj = $("#fsj").val();
    var fcbdj = $("#fcbdj").val();

    var bllistArr = new Array();
    $("#bllist").find("#bl").each(function () {
        var ffylb = $(this).find("#ffylb").val();
        var ffymx = $(this).find("#ffymx").val();
        var fdw = $(this).find("#fdw").val();
        var fpfyl = $(this).find("#fpfyl").val();
        var fdj = $(this).find("#fdj").val();
        var fje = $(this).find("#fje").val();
        var fbz = $(this).find("#fbz").val();

        var bl = new Object;
        bl.ffylb = ffylb;
        bl.ffymx = ffymx;
        bl.fdw = fdw;
        bl.fpfyl = fpfyl;
        bl.fdj = fdj;
        bl.fje = fje;
        bl.fbz = fbz;
        bllistArr.push(bl);
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

            xml = xml + '  <建设公司_门窗工程成本分析提报_主表>';
            xml = xml + '  <单号>' + fbillno + '</单号>';
            xml = xml + '  <提报人>' + fname + '</提报人>';
            xml = xml + '   <提报日期>' + fdate + '</提报日期>';
            xml = xml + '   <所属部门>' + fdept + '</所属部门>';
            xml = xml + '   <所属公司>' + fcompany + '</所属公司>';
            xml = xml + '   <建设单位>' + fjsdw + '</建设单位>';
            xml = xml + '   <施工单位>' + fsgdw + '</施工单位>';
            xml = xml + '  <工程编码>' + fgcbm + '</工程编码>';
            xml = xml + '   <工程名称>' + fgcmc + '</工程名称>';
            xml = xml + '   <产品类型>' + fcplx + '</产品类型>';
            xml = xml + '   <合计费用>' + ftotal + '</合计费用>';
            xml = xml + '   <辅助材料费率>' + fclfl + '</辅助材料费率>';
            xml = xml + '   <辅助材料费>' + fclf + '</辅助材料费>';
            xml = xml + '   <企业管理费率>' + fglfl + '</企业管理费率>';
            xml = xml + '   <企业管理费>' + fglf + '</企业管理费>';
            xml = xml + '   <税率>' + fsl + '</税率>';
            xml = xml + '   <税金>' + fsj + '</税金>';
            xml = xml + '   <工程成本单价>' + fcbdj + '</工程成本单价>';

            xml = xml + '  </建设公司_门窗工程成本分析提报_主表>';
            for (var i = 0; i < bllistArr.length; i++) {

                xml = xml + '<建设公司_门窗工程成本分析提报_子表>';
                xml = xml + '  <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml = xml + '  <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
                xml = xml + '<序号>' + (i + 1) + '</序号>';
                xml = xml + '<费用类别>' + bllistArr[i].ffylb + '</费用类别>';
                xml = xml + '<费用明细>' + bllistArr[i].ffymx + '</费用明细>';
                xml = xml + '<单位>' + bllistArr[i].fdw + '</单位>';
                xml = xml + '<用量>' + bllistArr[i].fpfyl + '</用量>';
                xml = xml + '<单价>' + bllistArr[i].fdj + '</单价>';
                xml = xml + '<金额>' + bllistArr[i].fje + '</金额>';
                xml = xml + '<备注>' + bllistArr[i].fbz + '</备注>';
                xml = xml + '</建设公司_门窗工程成本分析提报_子表>';

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
    var fname = $("#fname").val();
    var fdate = $("#fdate").val() + " 00:00:00";
    var fdept = $("#fdept").val();
    var fcompany = $("#fcompany").val();
    var fjsdw = $("#fjsdw").val();
    var fsgdw = $("#fsgdw").val();
    var fgcbm = $("#fgcbm").val();
    var fgcmc = $("#fgcmc").val();
    var fcplx = $("#fcplx").val();
    var ftotal = $("#ftotal").val();
    var fclfl = $("#fclfl").val();
    var fclf = $("#fclf").val();
    var fglfl = $("#fglfl").val();
    var fglf = $("#fglf").val();
    var fsl = $("#fsl").val();
    var fsj = $("#fsj").val();
    var fcbdj = $("#fcbdj").val();

    var bllistArr = new Array();
    $("#bllist").find("#bl").each(function () {
        var ffylb = $(this).find("#ffylb").val();
        var ffymx = $(this).find("#ffymx").val();
        var fdw = $(this).find("#fdw").val();
        var fpfyl = $(this).find("#fpfyl").val();
        var fdj = $(this).find("#fdj").val();
        var fje = $(this).find("#fje").val();
        var fbz = $(this).find("#fbz").val();

        var bl = new Object;
        bl.ffylb = ffylb;
        bl.ffymx = ffymx;
        bl.fdw = fdw;
        bl.fpfyl = fpfyl;
        bl.fdj = fdj;
        bl.fje = fje;
        bl.fbz = fbz;
        bllistArr.push(bl);
    });
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

                    xml = xml + '  <建设公司_门窗工程成本分析提报_主表>';
                    xml = xml + '  <单号>' + fbillno + '</单号>';
                    xml = xml + '  <提报人>' + fname + '</提报人>';
                    xml = xml + '   <提报日期>' + fdate + '</提报日期>';
                    xml = xml + '   <所属部门>' + fdept + '</所属部门>';
                    xml = xml + '   <所属公司>' + fcompany + '</所属公司>';
                    xml = xml + '   <建设单位>' + fjsdw + '</建设单位>';
                    xml = xml + '   <施工单位>' + fsgdw + '</施工单位>';
                    xml = xml + '  <工程编码>' + fgcbm + '</工程编码>';
                    xml = xml + '   <工程名称>' + fgcmc + '</工程名称>';
                    xml = xml + '   <产品类型>' + fcplx + '</产品类型>';
                    xml = xml + '   <合计费用>' + ftotal + '</合计费用>';
                    xml = xml + '   <辅助材料费率>' + fclfl + '</辅助材料费率>';
                    xml = xml + '   <辅助材料费>' + fclf + '</辅助材料费>';
                    xml = xml + '   <企业管理费率>' + fglfl + '</企业管理费率>';
                    xml = xml + '   <企业管理费>' + fglf + '</企业管理费>';
                    xml = xml + '   <税率>' + fsl + '</税率>';
                    xml = xml + '   <税金>' + fsj + '</税金>';
                    xml = xml + '   <工程成本单价>' + fcbdj + '</工程成本单价>';

                    xml = xml + '  </建设公司_门窗工程成本分析提报_主表>';
                    for (var i = 0; i < bllistArr.length; i++) {

                        xml = xml + '<建设公司_门窗工程成本分析提报_子表>';
                        xml = xml + '  <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                        xml = xml + '  <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
                        xml = xml + '<序号>' + (i + 1) + '</序号>';
                        xml = xml + '<费用类别>' + bllistArr[i].ffylb + '</费用类别>';
                        xml = xml + '<费用明细>' + bllistArr[i].ffymx + '</费用明细>';
                        xml = xml + '<单位>' + bllistArr[i].fdw + '</单位>';
                        xml = xml + '<用量>' + bllistArr[i].fpfyl + '</用量>';
                        xml = xml + '<单价>' + bllistArr[i].fdj + '</单价>';
                        xml = xml + '<金额>' + bllistArr[i].fje + '</金额>';
                        xml = xml + '<备注>' + bllistArr[i].fbz + '</备注>';
                        xml = xml + '</建设公司_门窗工程成本分析提报_子表>';

                    }

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

        xml = xml + '  <建设公司_门窗工程成本分析提报_主表>';
        xml = xml + '  <单号>' + fbillno + '</单号>';
        xml = xml + '  <提报人>' + fname + '</提报人>';
        xml = xml + '   <提报日期>' + fdate + '</提报日期>';
        xml = xml + '   <所属部门>' + fdept + '</所属部门>';
        xml = xml + '   <所属公司>' + fcompany + '</所属公司>';
        xml = xml + '   <建设单位>' + fjsdw + '</建设单位>';
        xml = xml + '   <施工单位>' + fsgdw + '</施工单位>';
        xml = xml + '  <工程编码>' + fgcbm + '</工程编码>';
        xml = xml + '   <工程名称>' + fgcmc + '</工程名称>';
        xml = xml + '   <产品类型>' + fcplx + '</产品类型>';
        xml = xml + '   <合计费用>' + ftotal + '</合计费用>';
        xml = xml + '   <辅助材料费率>' + fclfl + '</辅助材料费率>';
        xml = xml + '   <辅助材料费>' + fclf + '</辅助材料费>';
        xml = xml + '   <企业管理费率>' + fglfl + '</企业管理费率>';
        xml = xml + '   <企业管理费>' + fglf + '</企业管理费>';
        xml = xml + '   <税率>' + fsl + '</税率>';
        xml = xml + '   <税金>' + fsj + '</税金>';
        xml = xml + '   <工程成本单价>' + fcbdj + '</工程成本单价>';

        xml = xml + '  </建设公司_门窗工程成本分析提报_主表>';
        for (var i = 0; i < bllistArr.length; i++) {

            xml = xml + '<建设公司_门窗工程成本分析提报_子表>';
            xml = xml + '  <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
            xml = xml + '  <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
            xml = xml + '<序号>' + (i + 1) + '</序号>';
            xml = xml + '<费用类别>' + bllistArr[i].ffylb + '</费用类别>';
            xml = xml + '<费用明细>' + bllistArr[i].ffymx + '</费用明细>';
            xml = xml + '<单位>' + bllistArr[i].fdw + '</单位>';
            xml = xml + '<用量>' + bllistArr[i].fpfyl + '</用量>';
            xml = xml + '<单价>' + bllistArr[i].fdj + '</单价>';
            xml = xml + '<金额>' + bllistArr[i].fje + '</金额>';
            xml = xml + '<备注>' + bllistArr[i].fbz + '</备注>';
            xml = xml + '</建设公司_门窗工程成本分析提报_子表>';

        }

        xml = xml + '</FormData>';
        xml = xml + '</XForm>';
        PostXml(xml);
    }

   
}