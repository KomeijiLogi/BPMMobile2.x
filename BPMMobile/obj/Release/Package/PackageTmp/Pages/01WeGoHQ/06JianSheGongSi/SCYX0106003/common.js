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

function prepMsg() {
    $("#fdate").val(getNowFormatDate(2));
    tapEvent();
    var xml = '<?xml version= "1.0" ?>';
    xml = xml + '   <Requests>';
    xml = xml + '   <Params>';
    xml = xml + '       <Method>GetFormPostData</Method>';
    xml = xml + '       <ProcessName>建设公司销售部销售提成申请</ProcessName>';
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
        $("#fname").val(item.发起人);
     
    }).fail(function (e) {

    });
}


function tapEvent() {

    var fdeptdata = [

        {
            value: '',
            text:'家装'
        },
        {
            value: '',
            text: '工程'
        }

    ];

    showPicker('fdept', fdeptdata);

    var date = new Date();
    var fyeardata = [

        {
            value: '',
            text: date.getFullYear()
        },
        {
            value: '',
            text: date.getFullYear()+1
        },

        {
            value: '',
            text: date.getFullYear()+2
        },

        {
            value: '',
            text: date.getFullYear()+3
        },

        {
            value: '',
            text: date.getFullYear()+4
        },

        {
            value: '',
            text: date.getFullYear()+5
        },

        {
            value: '',
            text: date.getFullYear()+6
        },

        {
            value: '',
            text: date.getFullYear()+7
        },

        {
            value: '',
            text: date.getFullYear()+8
        }
    ];
    showPicker('fyear', fyeardata);


    var fmonthdata = [

        {
            value: '',
            text:'1'
        },

        {
            value: '',
            text: '2'
        },

        {
            value: '',
            text: '3'
        },

        {
            value: '',
            text: '4'
        },

        {
            value: '',
            text: '5'
        },

        {
            value: '',
            text: '6'
        },

        {
            value: '',
            text: '7'
        },

        {
            value: '',
            text: '8'
        },

        {
            value: '',
            text: '9'
        },

        {
            value: '',
            text: '10'
        },

        {
            value: '',
            text: '11'
        },

        {
            value: '',
            text: '12'
        }
    ];
    showPicker('fmonth', fmonthdata);

    $("#tjmx").on('tap', function () {
        var li = '<div id="mx" class="mui-card">';
        li = li + '    <div class="mui-input-row itemtitle">';
        li = li + '       <label>明细列表项</label>';
        li = li + '       <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>';
        li = li + '    </div>';
        li = li + '    <div class="mui-input-row">';
        li = li + '       <label for="fgcbm">工程编码<i style="color:red;">*</i></label>';
        li = li + '       <input type="text" id="fgcbm" name="fgcbm" placeholder="请填写工程编码"/>';
        li = li + '    </div>';
        li = li + '    <div class="mui-input-row">';
        li = li + '        <label for="fgcmc">工程名称<i style="color:red;">*</i></label>';
        li = li + '        <input type="text" id="fgcmc" name="fgcmc" placeholder="请填写工程名称"/>';
        li = li + '    </div>';
        li = li + '    <div class="mui-input-row">';
        li = li + '         <label for="fywy">业务员<i style="color:red;">*</i></label>';
        li = li + '         <input type="text" id="fywy" name="fywy" placeholder="请填写业务员"/>';
        li = li + '    </div>';
        li = li + '    <div class="mui-input-row">';
        li = li + '         <label for="fxmje">项目金额<i style="color:red;">*</i></label>';
        li = li + '         <input type="number" id="fxmje" name="fxmje" placeholder="请填写项目金额"/>';
        li = li + '    </div>';
        li = li + '    <div class="mui-input-row">';
        li = li + '        <label for="fbhssr">不含税收入<i style="color:red;">*</i></label>';
        li = li + '        <input type="number" id="fbhssr" name="fbhssr" placeholder="请填写不含税收入"/>';
        li = li + '    </div>';
        li = li + '    <div class="mui-input-row">';
        li = li + '         <label for="ftcbl">提成比例</label>';
        li = li + '         <input  type="number" id="ftcbl" name="ftcbl" placeholder="请填写提成比例"/>';
        li = li + '    </div>';
        li = li + '    <div class="mui-input-row">';
        li = li + '         <label for="ftcje">提成金额</label>';
        li = li + '         <input type="number" id="ftcje" name="ftcje" placeholder="请填写提成金额"/>';
        li = li + '    </div>';
        li = li + '    <div class="mui-input-row">';
        li = li + '          <label for="fbz">备注</label>';
        li = li + '          <input type="text" id="fbz" name="fbz" placeholder="请填写备注"/>';
        li = li + '    </div>';
        li = li + '</div>';
        $("#mxlist").append(li);
        $("#mxlist").find("#fxmje,#fbhssr,#ftcje").each(function () {

            $(this).on('input', function () {
                calcPrice();
            });
        });

    });
}

function calcPrice() {
    var fxmje_total = 0;
    var fbhssr_total = 0;
    var ftcje_total = 0;

    $("#mxlist").find("#mx").each(function () {

        var fxmje = parseFloat($(this).find("#fxmje").val());
        var fbhssr = parseFloat($(this).find("#fbhssr").val());
        var ftcje = parseFloat($(this).find("#ftcje").val());

        if (isNaN(fxmje)) {
            fxmje = 0;
        }
        if (isNaN(fbhssr)) {
            fbhssr = 0;
        }
        if (isNaN(ftcje)) {
            ftcje = 0;
        }

        fxmje_total = parseFloat(fxmje_total) + fxmje;
        fbhssr_total = parseFloat(fbhssr_total) + fbhssr;
        ftcje_total = parseFloat(ftcje_total) + ftcje;
        

    });
    $("#fxmje_total").val(fxmje_total);
    $("#fbhssr_total").val(fbhssr_total);
    $("#ftcje_total").val(ftcje_total);
   
}

function deleteItem(context) {

    var btnArray = ['否', '是'];
    mui.confirm('确认删除？', '', btnArray, function (e) {
        if (e.index == 1) {
            $(context).parent().parent().remove();
            calcPrice();
        }
    });
}

function mxItem(fgcbm, fgcmc, fywy, fxmje, fbhssr, ftcbl, ftcje, fbz) {

    var mx = {
        fgcbm: fgcbm,
        fgcmc: fgcmc,
        fywy: fywy,
        fxmje: fxmje,
        fbhssr: fbhssr,
        ftcbl: ftcbl,
        ftcje: ftcje,
        fbz: fbz,
        _check: function () {

            if (!fgcbm) {
                mui.toast('请填写工程编码');
                return null;
            }
            if (!fgcmc) {
                mui.toast('请填写工程名称');
                return null;
            }
            if (!fywy) {
                mui.toast('请填写业务员');
                return null;
            }
            if (!fxmje) {
                mui.toast('请填写项目金额');
                return null;
            }
            if (!fbhssr) {
                mui.toast('请填写不含税收入');
                return null;
            }
            if (!ftcbl) {
                mui.toast('请填写提成比例');
                return null;
            }
            if (!ftcje) {
                mui.toast('请填写提成金额');
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
        var item = data.FormDataSet.建设公司_销售提成申请_主表[0];
        if (flag) {

            $("#taskId").val(item.TaskID);
            $("#stepId").val(stepId);
            $("#fbillno").val(item.单号);

        }

        $("#fname").val(item.发起人);
        $("#fdept").val(item.申请部门);
        $("#fdate").val(FormatterTimeYMS(item.发起日期));
        $("#fyear").val(item.申请年度);
        $("#fmonth").val(item.申请月份);
        

        var item_c = data.FormDataSet.建设公司_销售提成申请_子表;
        for (var i = 0; i < item_c.length;i++){
            itemidArr.push(item_c[i].itemid);
            var li = '<div id="mx" class="mui-card">';
            li = li + '    <div class="mui-input-row itemtitle">';
            li = li + '       <label>明细列表项</label>';
            li = li + '       <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>';
            li = li + '    </div>';
            li = li + '    <div class="mui-input-row">';
            li = li + '        <label for="fgcbm">工程编码</label>';
            li = li + '        <input type="text" id="fgcbm" name="fgcbm"  readonly="readonly"  value="' + item_c[i].工程编码 + '"/>';
            li = li + '    </div>';
            li = li + '    <div class="mui-input-row">';
            li = li + '        <label for="fgcmc">工程名称</label>';
            li = li + '        <input type="text" id="fgcmc" name="fgcmc" readonly="readonly" value="' + item_c[i].工程名称 + '"/>';
            li = li + '    </div>';
            li = li + '    <div class="mui-input-row">';
            li = li + '         <label for="fywy">业务员<i style="color:red;">*</i></label>';
            li = li + '         <input type="text" id="fywy" name="fywy" readonly="readonly" value="' + item_c[i].业务员+'"/>';
            li = li + '    </div>';
            li = li + '    <div class="mui-input-row">';
            li = li + '         <label for="fxmje">项目金额<i style="color:red;">*</i></label>';
            li = li + '         <input type="number" id="fxmje" name="fxmje" readonly="readonly" value="' + item_c[i].项目金额 +'"/>';
            li = li + '    </div>';
            li = li + '    <div class="mui-input-row">';
            li = li + '        <label for="fbhssr">不含税收入<i style="color:red;">*</i></label>';
            li = li + '        <input type="number" id="fbhssr" name="fbhssr" readonly="readonly" value="' + item_c[i].不含税收入 +'"/>';
            li = li + '    </div>';
            li = li + '    <div class="mui-input-row">';
            li = li + '         <label for="ftcbl">提成比例</label>';
            li = li + '         <input  type="number" id="ftcbl" name="ftcbl" readonly="readonly" value="' + item_c[i].提成比例 +'"/>';
            li = li + '    </div>' ;
            li = li + '    <div class="mui-input-row">';
            li = li + '         <label for="ftcje">提成金额</label>';
            li = li + '         <input type="number" id="ftcje" name="ftcje" readonly="readonly" value="' + item_c[i].提成金额 +'"/>';
            li = li + '    </div>';
            li = li + '    <div class="mui-input-row">';
            li = li + '          <label for="fbz">备注</label>';
            li = li + '          <input type="text" id="fbz" name="fbz" readonly="readonly" value="' + changeNullToEmpty(item_c[i].备注) + '"/>';
            li = li + '    </div>';
            li = li + '</div>';
            $("#mxlist").append(li);
            if (flag) {
                $("#mxlist").find("#fxmje,#fbhssr,#ftcje").each(function () {

                    $(this).on('input', function () {
                        calcPrice();
                    });
                });
            }
        }

        calcPrice();
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
        $("#mxlist").find("input").each(function () {

            $(this).removeAttr('readonly');
        });
        $("#mxlist").find("#fxmje,#fbhssr,#ftcje").each(function () {

            $(this).on('input', function () {
                calcPrice();
            });
        });
       
    } else if (NodeName == "sysInform") {
        $("#readD").css("display", "block");
        $("#csd").css("display", "none");

    } else {
        if (typeof (NodeName) != "undefined") {
            $("#approvalD").css("display", "block");
        }
    }
   
}

function Save() {

    var fname = $("#fname").val();
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();
    var fyear = $("#fyear").val();
    var fmonth = $("#fmonth").val();
    var fxmje_total = $("#fxmje_total").val();
    var fbhssr_total = $("#fbhssr_total").val();
    var ftcje_total = $("#ftcje_total").val();

    if (!fdept) {
        mui.toast('请选择申请部门');
        return;
    }
    if (!fyear) {
        mui.toast('请选择申请年份');
        return;
    }
    if (!fmonth) {
        mui.toast('请选择申请月份');
        return;
    }

    var mxflag = false;
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fgcbm = $(this).find("#fgcbm").val();
        var fgcmc = $(this).find("#fgcmc").val();
        var fywy = $(this).find("#fywy").val();
        var fxmje = $(this).find("#fxmje").val();
        var fbhssr = $(this).find("#fbhssr").val();
        var ftcbl = $(this).find("#ftcbl").val();
        var ftcje = $(this).find("#ftcje").val();
        var fbz = $(this).find("#fbz").val();
        if (mxItem(fgcbm, fgcmc, fywy, fxmje, fbhssr, ftcbl, ftcje, fbz) == null) {
            mxflag = true;
            return;
        }
        var mx = mxItem(fgcbm, fgcmc, fywy, fxmje, fbhssr, ftcbl, ftcje, fbz);
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
            xml = xml + '       <ProcessName>建设公司销售部销售提成申请</ProcessName>';
            xml = xml + '         <ProcessVersion>' + version + '</ProcessVersion>';
            xml = xml + '            <DraftGuid></DraftGuid>';
            xml = xml + '             <OwnerMemberFullName>' + BPMOU + '</OwnerMemberFullName>';
            xml = xml + '            <Action>提交</Action>';
            xml = xml + '          <Comment></Comment>';
            xml = xml + '             <InviteIndicateUsers></InviteIndicateUsers>';
            xml = xml + '       </Header>';
            xml = xml + '       <FormData>';

            xml = xml + ' <建设公司_销售提成申请_主表>';
            xml = xml + ' <单号>自动生成</单号>';
            xml = xml + ' <发起人>' + fname + '</发起人>';
            xml = xml + ' <申请部门>' + fdept + '</申请部门>';
            xml = xml + ' <发起日期>' + fdate + '</发起日期>';
            xml = xml + '  <申请年度>' + fyear + '</申请年度>';
            xml = xml + '  <申请月份>' + fmonth + '</申请月份>';
            xml = xml + '  <附件>201708260007</附件>';
            xml = xml + '</建设公司_销售提成申请_主表>';
            for (var i = 0; i < mxlistArr.length;i++){
                xml = xml + ' <建设公司_销售提成申请_子表>';
                xml = xml + ' <RelationRowGuid>'+(i+1)+'</RelationRowGuid>';
                xml = xml + ' <RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + '  <序号>' + (i + 1) + '</序号>';
                xml = xml + ' <工程编码>' + mxlistArr[i].fgcbm + '</工程编码>';
                xml = xml + ' <工程名称>' + mxlistArr[i].fgcmc + '</工程名称>';
                xml = xml + ' <业务员>' + mxlistArr[i].fywy + '</业务员>';
                xml = xml + '  <项目金额>' + mxlistArr[i].fxmje + '</项目金额>';
                xml = xml + ' <不含税收入>' + mxlistArr[i].fbhssr + '</不含税收入>';
                xml = xml + '  <提成比例>' + mxlistArr[i].ftcbl + '</提成比例>';
                xml = xml + '  <提成金额>' + mxlistArr[i].ftcje + '</提成金额>';
                xml = xml + '  <备注>' + mxlistArr[i].fbz + '</备注>';
                xml = xml + ' </建设公司_销售提成申请_子表>';
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
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();
    var fyear = $("#fyear").val();
    var fmonth = $("#fmonth").val();
    var fxmje_total = $("#fxmje_total").val();
    var fbhssr_total = $("#fbhssr_total").val();
    var ftcje_total = $("#ftcje_total").val();

    if (!fdept) {
        mui.toast('请选择申请部门');
        return;
    }
    if (!fyear) {
        mui.toast('请选择申请年份');
        return;
    }
    if (!fmonth) {
        mui.toast('请选择申请月份');
        return;
    }

    var mxflag = false;
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fgcbm = $(this).find("#fgcbm").val();
        var fgcmc = $(this).find("#fgcmc").val();
        var fywy = $(this).find("#fywy").val();
        var fxmje = $(this).find("#fxmje").val();
        var fbhssr = $(this).find("#fbhssr").val();
        var ftcbl = $(this).find("#ftcbl").val();
        var ftcje = $(this).find("#ftcje").val();
        var fbz = $(this).find("#fbz").val();
        if (mxItem(fgcbm, fgcmc, fywy, fxmje, fbhssr, ftcbl, ftcje, fbz) == null) {
            mxflag = true;
            return;
        }
        var mx = mxItem(fgcbm, fgcmc, fywy, fxmje, fbhssr, ftcbl, ftcje, fbz);
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

            xml = xml + ' <建设公司_销售提成申请_主表>';
            xml = xml + ' <单号>' + fbillno + '</单号>';
            xml = xml + ' <发起人>' + fname + '</发起人>';
            xml = xml + ' <申请部门>' + fdept + '</申请部门>';
            xml = xml + ' <发起日期>' + fdate + '</发起日期>';
            xml = xml + '  <申请年度>' + fyear + '</申请年度>';
            xml = xml + '  <申请月份>' + fmonth + '</申请月份>';
            xml = xml + '  <附件>201708260007</附件>';
            xml = xml + '</建设公司_销售提成申请_主表>';
            for (var i = 0; i < mxlistArr.length; i++) {
                xml = xml + ' <建设公司_销售提成申请_子表>';
                xml = xml + ' <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml = xml + ' <RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + '  <序号>' + (i + 1) + '</序号>';
                xml = xml + ' <工程编码>' + mxlistArr[i].fgcbm + '</工程编码>';
                xml = xml + ' <工程名称>' + mxlistArr[i].fgcmc + '</工程名称>';
                xml = xml + ' <业务员>' + mxlistArr[i].fywy + '</业务员>';
                xml = xml + '  <项目金额>' + mxlistArr[i].fxmje + '</项目金额>';
                xml = xml + ' <不含税收入>' + mxlistArr[i].fbhssr + '</不含税收入>';
                xml = xml + '  <提成比例>' + mxlistArr[i].ftcbl + '</提成比例>';
                xml = xml + '  <提成金额>' + mxlistArr[i].ftcje + '</提成金额>';
                xml = xml + '  <备注>' + mxlistArr[i].fbz + '</备注>';
                xml = xml + ' </建设公司_销售提成申请_子表>';
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
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();
    var fyear = $("#fyear").val();
    var fmonth = $("#fmonth").val();
    var fxmje_total = $("#fxmje_total").val();
    var fbhssr_total = $("#fbhssr_total").val();
    var ftcje_total = $("#ftcje_total").val();
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fgcbm = $(this).find("#fgcbm").val();
        var fgcmc = $(this).find("#fgcmc").val();
        var fywy = $(this).find("#fywy").val();
        var fxmje = $(this).find("#fxmje").val();
        var fbhssr = $(this).find("#fbhssr").val();
        var ftcbl = $(this).find("#ftcbl").val();
        var ftcje = $(this).find("#ftcje").val();
        var fbz = $(this).find("#fbz").val();
       
        var mx = mxItem(fgcbm, fgcmc, fywy, fxmje, fbhssr, ftcbl, ftcje, fbz);
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
            xml = xml + ' <建设公司_销售提成申请_主表>';
            xml = xml + ' <单号>' + fbillno + '</单号>';
            xml = xml + ' <发起人>' + fname + '</发起人>';
            xml = xml + ' <申请部门>' + fdept + '</申请部门>';
            xml = xml + ' <发起日期>' + fdate + '</发起日期>';
            xml = xml + '  <申请年度>' + fyear + '</申请年度>';
            xml = xml + '  <申请月份>' + fmonth + '</申请月份>';
            xml = xml + '  <附件>201708260007</附件>';
            xml = xml + '</建设公司_销售提成申请_主表>';
            for (var i = 0; i < mxlistArr.length; i++) {
                xml = xml + ' <建设公司_销售提成申请_子表>';
                xml = xml + ' <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml = xml + ' <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
                xml = xml + '  <序号>' + (i + 1) + '</序号>';
                xml = xml + ' <工程编码>' + mxlistArr[i].fgcbm + '</工程编码>';
                xml = xml + ' <工程名称>' + mxlistArr[i].fgcmc + '</工程名称>';
                xml = xml + ' <业务员>' + mxlistArr[i].fywy + '</业务员>';
                xml = xml + '  <项目金额>' + mxlistArr[i].fxmje + '</项目金额>';
                xml = xml + ' <不含税收入>' + mxlistArr[i].fbhssr + '</不含税收入>';
                xml = xml + '  <提成比例>' + mxlistArr[i].ftcbl + '</提成比例>';
                xml = xml + '  <提成金额>' + mxlistArr[i].ftcje + '</提成金额>';
                xml = xml + '  <备注>' + mxlistArr[i].fbz + '</备注>';
                xml = xml + ' </建设公司_销售提成申请_子表>';
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
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();
    var fyear = $("#fyear").val();
    var fmonth = $("#fmonth").val();
    var fxmje_total = $("#fxmje_total").val();
    var fbhssr_total = $("#fbhssr_total").val();
    var ftcje_total = $("#ftcje_total").val();
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fgcbm = $(this).find("#fgcbm").val();
        var fgcmc = $(this).find("#fgcmc").val();
        var fywy = $(this).find("#fywy").val();
        var fxmje = $(this).find("#fxmje").val();
        var fbhssr = $(this).find("#fbhssr").val();
        var ftcbl = $(this).find("#ftcbl").val();
        var ftcje = $(this).find("#ftcje").val();
        var fbz = $(this).find("#fbz").val();

        var mx = mxItem(fgcbm, fgcmc, fywy, fxmje, fbhssr, ftcbl, ftcje, fbz);
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

            xml = xml + ' <建设公司_销售提成申请_主表>';
            xml = xml + ' <单号>' + fbillno + '</单号>';
            xml = xml + ' <发起人>' + fname + '</发起人>';
            xml = xml + ' <申请部门>' + fdept + '</申请部门>';
            xml = xml + ' <发起日期>' + fdate + '</发起日期>';
            xml = xml + '  <申请年度>' + fyear + '</申请年度>';
            xml = xml + '  <申请月份>' + fmonth + '</申请月份>';
            xml = xml + '  <附件>201708260007</附件>';
            xml = xml + '</建设公司_销售提成申请_主表>';
            for (var i = 0; i < mxlistArr.length; i++) {
                xml = xml + ' <建设公司_销售提成申请_子表>';
                xml = xml + ' <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml = xml + ' <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
                xml = xml + '  <序号>' + (i + 1) + '</序号>';
                xml = xml + ' <工程编码>' + mxlistArr[i].fgcbm + '</工程编码>';
                xml = xml + ' <工程名称>' + mxlistArr[i].fgcmc + '</工程名称>';
                xml = xml + ' <业务员>' + mxlistArr[i].fywy + '</业务员>';
                xml = xml + '  <项目金额>' + mxlistArr[i].fxmje + '</项目金额>';
                xml = xml + ' <不含税收入>' + mxlistArr[i].fbhssr + '</不含税收入>';
                xml = xml + '  <提成比例>' + mxlistArr[i].ftcbl + '</提成比例>';
                xml = xml + '  <提成金额>' + mxlistArr[i].ftcje + '</提成金额>';
                xml = xml + '  <备注>' + mxlistArr[i].fbz + '</备注>';
                xml = xml + ' </建设公司_销售提成申请_子表>';
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

        xml = xml + ' <建设公司_销售提成申请_主表>';
        xml = xml + ' <单号>' + fbillno + '</单号>';
        xml = xml + ' <发起人>' + fname + '</发起人>';
        xml = xml + ' <申请部门>' + fdept + '</申请部门>';
        xml = xml + ' <发起日期>' + fdate + '</发起日期>';
        xml = xml + '  <申请年度>' + fyear + '</申请年度>';
        xml = xml + '  <申请月份>' + fmonth + '</申请月份>';
        xml = xml + '  <附件>201708260007</附件>';
        xml = xml + '</建设公司_销售提成申请_主表>';
        for (var i = 0; i < mxlistArr.length; i++) {
            xml = xml + ' <建设公司_销售提成申请_子表>';
            xml = xml + ' <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
            xml = xml + ' <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
            xml = xml + '  <序号>' + (i + 1) + '</序号>';
            xml = xml + ' <工程编码>' + mxlistArr[i].fgcbm + '</工程编码>';
            xml = xml + ' <工程名称>' + mxlistArr[i].fgcmc + '</工程名称>';
            xml = xml + ' <业务员>' + mxlistArr[i].fywy + '</业务员>';
            xml = xml + '  <项目金额>' + mxlistArr[i].fxmje + '</项目金额>';
            xml = xml + ' <不含税收入>' + mxlistArr[i].fbhssr + '</不含税收入>';
            xml = xml + '  <提成比例>' + mxlistArr[i].ftcbl + '</提成比例>';
            xml = xml + '  <提成金额>' + mxlistArr[i].ftcje + '</提成金额>';
            xml = xml + '  <备注>' + mxlistArr[i].fbz + '</备注>';
            xml = xml + ' </建设公司_销售提成申请_子表>';
        }

        xml = xml + '</FormData>';
        xml = xml + '</XForm>';
        PostXml(xml);

    }
        
}