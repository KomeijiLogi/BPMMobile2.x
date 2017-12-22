
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
                $("#fbm").val(fareaStr[fareaStr.length - 2]);
                $("#fgs").val(fareaStr[fareaStr.length - 3]);

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
        li = li + '        <label for="fname">名称</label>';
        li = li + '        <input type="text" id="fname" name="fname" value="" placeholder="请输入名称"/> ';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '        <label for="fggxh">规格型号</label>';
        li = li + '        <input type="text" id="fggxh" name="fggxh" value="" placeholder="请输入规格型号"/> ';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '        <label for="famount">数量</label>';
        li = li + '        <input type="number" id="famount" name="famount" value="" placeholder="请输入数量"/> ';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '        <label for="fmoney">金额<i style="color:red;">*</i></label>';
        li = li + '        <input type="number" id="fmoney" name="fmoney" value=""  placeholder="请输入金额" onchange = "calPrice()"/>';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '        <label for="fremark">备注</label>';
        li = li + '        <input type="text" id="fremark" name="fremark" value="" placeholder="请输入备注" />';
        li = li + '   </div>';
        li = li + '   </div>';


        $("#bllist").append(li);  
        
    });
    var ftzlxdata = [
        {
            value: 'zb',
            text: '增编(岗)'
        }, {
            value: 'xz',
            text: '新增'
        }, {
            value: 'gx',
            text: '设备更新'
        }
    ];
    showPicker('ftzlx', ftzlxdata);
    var fcgbmdata = [
        {
            value: 'xxzx',
            text: '信息中心采购'
        }, {
            value: 'bgs',
            text: '办公室采购'
        }
    ];
    showPicker('fcgbm', fcgbmdata);
    var fcglxdata = [
        {
            value: 'dzsb',
            text: '电子设备'
        }, {
            value: 'bgjj',
            text: '办公家具'
        }
    ];
    showPicker('fcglx', fcglxdata);

}
function deleteItem(context) {
    var btnArray = ['否', '是'];
    mui.confirm('确认删除？', '', btnArray, function (e) {
        if (e.index == 1) {
            $(context).parent().parent().remove();
        }
    calPrice();
    });

}
function calPrice() {
    var ftotal = 0;
    $("#bllist").find("#bl").each(function () {
        var fmoney = parseFloat($(this).find("#fmoney").val());
        if ($(this).find("#fmoney").val() == null || $(this).find("#fmoney").val() == "") {
            fmoney = 0;
        }

        if (ftotal == 0) {
            ftotal = fmoney;
        } else {
            ftotal += fmoney;
        }
    });
    $("#fzje").val(ftotal);
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

        var item = data.FormDataSet.BPM_YYZPJTBGSBSQ_A[0];

        //待办特殊操作
        if (flag) {
            
            $("#taskId").val(item.TaskID);
            $("#stepId").val(stepId);
            $("#fbillno").val(item.fbillno);

        }
        $("#fname").val(item.fname);
        $("#fdate").val(FormatterTimeYMS(item.fdate));
        $("#fgs").val(item.fgs);
        $("#fbm").val(item.fbm);
        $("#ftel").val(item.ftel);
        $("#ftzlx").val(item.ftzlx);
        $("#fcgbm").val(item.fcgbm);
        $("#fcglx").val(item.fcglx);
        $("#fsy").val(item.fsy);
        $("#fzje").val(item.fzje);

        var bli = data.FormDataSet.BPM_YYZPJTBGSBSQ_B;
        for (var i = 0; i < bli.length; i++) {

            itemidArr.push(bli[i].itemid);
            var li = '<div id="bl" class="mui-card">';
            li = li + '   <div class="mui-input-row bgc">';
            li = li + '        <label>明细列表项</label> ';
            li = li + '        <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>';
            li = li + '   </div>';
            li = li + '   <div class="mui-input-row">';
            li = li + '        <label for="fname">名称</label>';
            li = li + '        <input type="text" id="fname" name="fname" value="' + bli[i].fname + '" readonly="readonly"/> ';
            li = li + '   </div>';
            li = li + '   <div class="mui-input-row">';
            li = li + '        <label for="fggxh">规格型号</label>';
            li = li + '        <input type="text" id="fggxh" name="fggxh" value="' + bli[i].fggxh + '" readonly="readonly"/> ';
            li = li + '   </div>';
            li = li + '   <div class="mui-input-row">';
            li = li + '        <label for="famount">数量</label>';
            li = li + '        <input type="number" id="famount" name="famount" value="' + bli[i].famount + '" readonly="readonly"/> ';
            li = li + '   </div>';
            li = li + '   <div class="mui-input-row">';
            li = li + '        <label for="fmoney">金额<i style="color:red;">*</i></label>';
            li = li + '        <input type="number" id="fmoney" name="fmoney" value="' + bli[i].fmoney + '" readonly="readonly"/> ';
            li = li + '   </div>';
            li = li + '   <div class="mui-input-row">';
            li = li + '        <label for="fremark">备注</label>';
            li = li + '        <input type="text" id="fremark" name="fremark" value="' + bli[i].fremark + '" readonly="readonly" />';
            li = li + '   </div>';
          
            $("#bllist").append(li);

        }
        if (item.fj != null && item.fj != "") {
            var fjtmp = (String)(item.fj);

            fjArray = fjtmp.split(";");


            //console.log("fjArray:" + fjArray);

            //请求附件详细信息
            $.ajax({
                type: 'POST',
                url: '/api/bpm/GetAttachmentsInfo',
                //dataType:'json',
                data: { 'fileIds': fjArray },

                beforeSend: function (XHR) {
                    XHR.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem('ticket'));
                },
                success: function (data, status) {
                    if (status == "success") {

                        console.log(data);

                        for (var i = 0; i < data.length; i++) {

                            var name = data[i].Name;
                            var type = (data[i].Ext).replace(".", "");
                            var size = String(data[i].Size);

                            var time = String(data[i].LastUpdate).replace("T", " ");
                            var downurl = 'http://app.weigaogroup.com:8040/BPM/YZSoft/Attachment/default.ashx?' + data[i].FileID;
                            var attach = attachItem(name, type, size, time, downurl);
                            attachArray.push(attach);



                            var li = '<div class="pic-preview smallyulan success">';
                            li = li + ' <div class="del none" style="opacity:1;z-index:999;"onclick="delPicture(this)">x</div>';

                            //类型判断
                            if ((data[i].Ext).indexOf("png") != -1 || (data[i].Ext).indexOf("jpg") != -1 || (data[i].Ext).indexOf("bmp") != -1) {

                                //li = li + '    <div class="img-wrap smallimg" id="simg" ><a href="http://app.weigaogroup.com:8040/BPM/YZSoft/Attachment/default.ashx?' + data[i].FileID + '"><img src="http://app.weigaogroup.com:8040/BPM/YZSoft/Attachment/default.ashx?' + data[i].FileID + '"/></a></div>';
                                li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '" ><img src="http://app.weigaogroup.com:8040/BPM/YZSoft/Attachment/default.ashx?' + data[i].FileID + '"/></div>';

                            } else if ((data[i].Ext).indexOf("xls") != -1) {

                                li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '"><img src="../../Content/images/xlsx@2x.png"/></div>';

                            } else if ((data[i].Ext).indexOf("doc") != -1) {

                                li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '"><img src="../../Content/images/docx@2x.png"/></div>';

                            } else if ((data[i].Ext).indexOf("ppt") != -1) {

                                li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '"><img src="../../Content/images/ppt@2x.png"/></div>';

                            } else if ((data[i].Ext).indexOf("pdf") != -1) {

                                li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '"><img src="../../Content/images/pdf@2x.png"/></div>';

                            } else if ((data[i].Ext).indexOf("zip") != -1 || (data[i].Ext).indexOf("rar") != -1 || (data[i].Ext).indexOf("7z") != -1) {

                                li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '"><img src="../../Content/images/zip@2x.png"/></div>';

                            } else if ((data[i].Ext).indexOf("txt") != -1) {

                                li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '"><img src="../../Content/images/txt@2x.png"/></div>';

                            } else {
                                li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '"><img src="../../Content/images/unkown@2x.png"/></div>';
                            }

                            li = li + ' </div>';
                            li = li + '</div>';
                            $(".upload-img-list").append(li);


                            $(".imgdiv").each(function () {

                                $(this).parent().find(".del.none").hide();

                            });




                        }
                        $(".imgdiv").off('tap');
                        $(".imgdiv").on('tap', function () {
                            console.log($(this)[0].id);
                            XuntongJSBridge.call('showFile', {
                                'fileName': attachArray[$(this)[0].id].name,
                                'fileExt': attachArray[$(this)[0].id].type,
                                'fileTime': attachArray[$(this)[0].id].time,
                                'fileSize': attachArray[$(this)[0].id].size,
                                'fileDownloadUrl': attachArray[$(this)[0].id].downurl
                            }, function (result) {
                                //alert(JSON.stringify(result));
                            });
                        });


                    }

                }, error: function (e) {
                    console.log(e);

                }, complete: function () {

                }

            });

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


        $("#bllist").find('span').each(function () {
            $(this).css("display", "block");

        });
        $("#addItem").css('display', 'block');
        tapEvent();
        $("#bllist").find("#fname,#fggxh,#famount,#fmoney,#fremark").each(function () {
            $(this).removeAttr('readonly');
        });
        $("#fsy,#ftel").removeAttr('readonly');
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
    var fdate = $("#fdate").val() + " 00:00:00";
    var fgs = $("#fgs").val();
    var fbm = $("#fbm").val();
    var ftel = $("#ftel").val();
    var ftzlx = $("#ftzlx").val();
    var fcgbm = $("#fcgbm").val();
    var fcglx = $("#fcglx").val();
    var fsy = $("#fsy").val();
    var fzje = $("#fzje").val();
    if (!ftel) {
        mui.toast('请输入联系方式');
        return;
    }
    if (!ftzlx) {
        mui.toast('请选择项目投资类型');
        return;
    }
    if (!fcgbm) {
        mui.toast('请选择采购部门');
        return;
    }
    if (!fcglx) {
        mui.toast('请选择采购类型');
        return;
    }
    if (!fsy) {
        mui.toast('请填写申请事由');
        return;
    }
    var mxflag = false;
    var bllistArr = new Array();
    $("#bllist").find("#bl").each(function () {
        var fname = $(this).find("#fname").val();
        var fggxh = $(this).find("#fggxh").val();
        var famount = $(this).find("#famount").val();
        var fmoney = $(this).find("#fmoney").val();
        var fremark = $(this).find("#fremark").val();
        if (!fmoney) {
            mxflag = true;
            mui.toast("请输入金额");
            return;
        }

        var bl = new Object;
        bl.fname = fname;
        bl.fggxh = fggxh;
        bl.famount = famount;
        bl.fmoney = fmoney;
        bl.fremark = fremark;
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
            xml = xml + '       <ProcessName>医用制品集团办公设备采购申请</ProcessName>';
            xml = xml + '         <ProcessVersion>' + version + '</ProcessVersion>';
            xml = xml + '            <DraftGuid></DraftGuid>';
            xml = xml + '             <OwnerMemberFullName>' + BPMOU + '</OwnerMemberFullName>';
            xml = xml + '            <Action>提交</Action>';
            xml = xml + '          <Comment></Comment>';
            xml = xml + '             <InviteIndicateUsers></InviteIndicateUsers>';
            xml = xml + '       </Header>';
            xml = xml + '       <FormData>';

            xml = xml + '  <BPM_YYZPJTBGSBSQ_A>';
            xml = xml + '  <fbillno>自动生成</fbillno>';
            xml = xml + '  <fname>' + fname + '</fname>';
            xml = xml + '   <fgs>' + fgs + '</fgs>';
            xml = xml + '   <fbm>' + fbm + '</fbm>';
            xml = xml + '   <fdate>' + fdate + '</fdate>';
            xml = xml + '   <ftel>' + ftel + '</ftel>';
            xml = xml + '   <ftzlx>' + ftzlx + '</ftzlx>';
            xml = xml + '   <fcgbm>' + fcgbm + '</fcgbm>';
            xml = xml + '   <fcglx>' + fcglx + '</fcglx>';
            xml = xml + '  <fsy>' + fsy + '</fsy>';
            xml = xml + '   <fzje>' + fzje + '</fzje>';
            xml = xml + '   <fj>' + fjArray.toString().replace(",", ";") + '</fj>';
            xml = xml + '  </BPM_YYZPJTBGSBSQ_A>';
            for (var i = 0; i < bllistArr.length; i++) {

                xml = xml + '<BPM_YYZPJTBGSBSQ_B>';
                xml = xml + '  <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml = xml + '  <RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + '<ffentryno>' + (i + 1) + '</ffentryno>';
                xml = xml + '<fname>' + bllistArr[i].fname + '</fname>';
                xml = xml + '<fggxh>' + bllistArr[i].fggxh + '</fggxh>';
                xml = xml + '<famount>' + bllistArr[i].famount + '</famount>';
                xml = xml + '<fmoney>' + bllistArr[i].fmoney + '</fmoney>';
                xml = xml + '<fremark>' + bllistArr[i].fremark + '</fremark>';
                xml = xml + '</BPM_YYZPJTBGSBSQ_B>';

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
    var fgs = $("#fgs").val();
    var fbm = $("#fbm").val();
    var ftel = $("#ftel").val();
    var ftzlx = $("#ftzlx").val();
    var fcgbm = $("#fcgbm").val();
    var fcglx = $("#fcglx").val();
    var fsy = $("#fsy").val();
    var fzje = $("#fzje").val();

    if (!ftel) {
        mui.toast('请输入联系方式');
        return;
    }
    if (!ftzlx) {
        mui.toast('请选择项目投资类型');
        return;
    }
    if (!fcgbm) {
        mui.toast('请选择采购部门');
        return;
    }
    if (!fcglx) {
        mui.toast('请选择采购类型');
        return;
    }
    if (!fsy) {
        mui.toast('请填写申请事由');
        return;
    }
    var mxflag = false;
    var bllistArr = new Array();
    $("#bllist").find("#bl").each(function () {
        var fname = $(this).find("#fname").val();
        var fggxh = $(this).find("#fggxh").val();
        var famount = $(this).find("#famount").val();
        var fmoney = $(this).find("#fmoney").val();
        var fremark = $(this).find("#fremark").val();
        if (!fmoney) {
            mxflag = true;
            mui.toast("请输入金额");
            return;
        }

        var bl = new Object;
        bl.fname = fname;
        bl.fggxh = fggxh;
        bl.famount = famount;
        bl.fmoney = fmoney;
        bl.fremark = fremark;
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

            xml = xml + '  <BPM_YYZPJTBGSBSQ_A>';
            xml = xml + '  <fbillno>' + fbillno + '</fbillno>';
            xml = xml + '  <fname>' + fname + '</fname>';
            xml = xml + '   <fgs>' + fgs + '</fgs>';
            xml = xml + '   <fbm>' + fbm + '</fbm>';
            xml = xml + '   <fdate>' + fdate + '</fdate>';
            xml = xml + '   <ftel>' + ftel + '</ftel>';
            xml = xml + '   <ftzlx>' + ftzlx + '</ftzlx>';
            xml = xml + '   <fcgbm>' + fcgbm + '</fcgbm>';
            xml = xml + '   <fcglx>' + fcglx + '</fcglx>';
            xml = xml + '  <fsy>' + fsy + '</fsy>';
            xml = xml + '   <fzje>' + fzje + '</fzje>';
            xml = xml + '   <fj>' + fjArray.toString().replace(",", ";") + '</fj>';
            xml = xml + '  </BPM_YYZPJTBGSBSQ_A>';
            for (var i = 0; i < bllistArr.length; i++) {

                xml = xml + '<BPM_YYZPJTBGSBSQ_B>';
                xml = xml + '  <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml = xml + '  <RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + '<ffentryno>' + (i + 1) + '</ffentryno>';
                xml = xml + '<fname>' + bllistArr[i].fname + '</fname>';
                xml = xml + '<fggxh>' + bllistArr[i].fggxh + '</fggxh>';
                xml = xml + '<famount>' + bllistArr[i].famount + '</famount>';
                xml = xml + '<fmoney>' + bllistArr[i].fmoney + '</fmoney>';
                xml = xml + '<fremark>' + bllistArr[i].fremark + '</fremark>';
                xml = xml + '</BPM_YYZPJTBGSBSQ_B>';

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
    var fgs = $("#fgs").val();
    var fbm = $("#fbm").val();
    var ftel = $("#ftel").val();
    var ftzlx = $("#ftzlx").val();
    var fcgbm = $("#fcgbm").val();
    var fcglx = $("#fcglx").val();
    var fsy = $("#fsy").val();
    var fzje = $("#fzje").val();

    var bllistArr = new Array();
    $("#bllist").find("#bl").each(function () {
        var fname = $(this).find("#fname").val();
        var fggxh = $(this).find("#fggxh").val();
        var famount = $(this).find("#famount").val();
        var fmoney = $(this).find("#fmoney").val();
        var fremark = $(this).find("#fremark").val();


        var bl = new Object;
        bl.fname = fname;
        bl.fggxh = fggxh;
        bl.famount = famount;
        bl.fmoney = fmoney;
        bl.fremark = fremark;
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

            xml = xml + '  <BPM_YYZPJTBGSBSQ_A>';
            xml = xml + '  <fbillno>' + fbillno + '</fbillno>';
            xml = xml + '  <fname>' + fname + '</fname>';
            xml = xml + '   <fgs>' + fgs + '</fgs>';
            xml = xml + '   <fbm>' + fbm + '</fbm>';
            xml = xml + '   <fdate>' + fdate + '</fdate>';
            xml = xml + '   <ftel>' + ftel + '</ftel>';
            xml = xml + '   <ftzlx>' + ftzlx + '</ftzlx>';
            xml = xml + '   <fcgbm>' + fcgbm + '</fcgbm>';
            xml = xml + '   <fcglx>' + fcglx + '</fcglx>';
            xml = xml + '  <fsy>' + fsy + '</fsy>';
            xml = xml + '   <fzje>' + fzje + '</fzje>';
            xml = xml + '   <fj>' + fjArray.toString().replace(",", ";") + '</fj>';
            xml = xml + '  </BPM_YYZPJTBGSBSQ_A>';
            for (var i = 0; i < bllistArr.length; i++) {

                xml = xml + '<BPM_YYZPJTBGSBSQ_B>';
                xml = xml + '  <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml = xml + '  <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
                xml = xml + '<ffentryno>' + (i + 1) + '</ffentryno>';
                xml = xml + '<fname>' + bllistArr[i].fname + '</fname>';
                xml = xml + '<fggxh>' + bllistArr[i].fggxh + '</fggxh>';
                xml = xml + '<famount>' + bllistArr[i].famount + '</famount>';
                xml = xml + '<fmoney>' + bllistArr[i].fmoney + '</fmoney>';
                xml = xml + '<fremark>' + bllistArr[i].fremark + '</fremark>';
                xml = xml + '</BPM_YYZPJTBGSBSQ_B>';

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
    var fgs = $("#fgs").val();
    var fbm = $("#fbm").val();
    var ftel = $("#ftel").val();
    var ftzlx = $("#ftzlx").val();
    var fcgbm = $("#fcgbm").val();
    var fcglx = $("#fcglx").val();
    var fsy = $("#fsy").val();
    var fzje = $("#fzje").val();

    var bllistArr = new Array();
    $("#bllist").find("#bl").each(function () {
        var fname = $(this).find("#fname").val();
        var fggxh = $(this).find("#fggxh").val();
        var famount = $(this).find("#famount").val();
        var fmoney = $(this).find("#fmoney").val();
        var fremark = $(this).find("#fremark").val();


        var bl = new Object;
        bl.fname = fname;
        bl.fggxh = fggxh;
        bl.famount = famount;
        bl.fmoney = fmoney;
        bl.fremark = fremark;
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

                    xml = xml + '  <BPM_YYZPJTBGSBSQ_A>';
                    xml = xml + '  <fbillno>' + fbillno + '</fbillno>';
                    xml = xml + '  <fname>' + fname + '</fname>';
                    xml = xml + '   <fgs>' + fgs + '</fgs>';
                    xml = xml + '   <fbm>' + fbm + '</fbm>';
                    xml = xml + '   <fdate>' + fdate + '</fdate>';
                    xml = xml + '   <ftel>' + ftel + '</ftel>';
                    xml = xml + '   <ftzlx>' + ftzlx + '</ftzlx>';
                    xml = xml + '   <fcgbm>' + fcgbm + '</fcgbm>';
                    xml = xml + '   <fcglx>' + fcglx + '</fcglx>';
                    xml = xml + '  <fsy>' + fsy + '</fsy>';
                    xml = xml + '   <fzje>' + fzje + '</fzje>';
                    xml = xml + '   <fj>' + fjArray.toString().replace(",", ";") + '</fj>';
                    xml = xml + '  </BPM_YYZPJTBGSBSQ_A>';
                    for (var i = 0; i < bllistArr.length; i++) {

                        xml = xml + '<BPM_YYZPJTBGSBSQ_B>';
                        xml = xml + '  <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                        xml = xml + '  <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
                        xml = xml + '<ffentryno>' + (i + 1) + '</ffentryno>';
                        xml = xml + '<fname>' + bllistArr[i].fname + '</fname>';
                        xml = xml + '<fggxh>' + bllistArr[i].fggxh + '</fggxh>';
                        xml = xml + '<famount>' + bllistArr[i].famount + '</famount>';
                        xml = xml + '<fmoney>' + bllistArr[i].fmoney + '</fmoney>';
                        xml = xml + '<fremark>' + bllistArr[i].fremark + '</fremark>';
                        xml = xml + '</BPM_YYZPJTBGSBSQ_B>';

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

        xml = xml + '  <BPM_YYZPJTBGSBSQ_A>';
        xml = xml + '  <fbillno>' + fbillno + '</fbillno>';
        xml = xml + '  <fname>' + fname + '</fname>';
        xml = xml + '   <fgs>' + fgs + '</fgs>';
        xml = xml + '   <fbm>' + fbm + '</fbm>';
        xml = xml + '   <fdate>' + fdate + '</fdate>';
        xml = xml + '   <ftel>' + ftel + '</ftel>';
        xml = xml + '   <ftzlx>' + ftzlx + '</ftzlx>';
        xml = xml + '   <fcgbm>' + fcgbm + '</fcgbm>';
        xml = xml + '   <fcglx>' + fcglx + '</fcglx>';
        xml = xml + '  <fsy>' + fsy + '</fsy>';
        xml = xml + '   <fzje>' + fzje + '</fzje>';
        xml = xml + '   <fj>' + fjArray.toString().replace(",", ";") + '</fj>';
        xml = xml + '  </BPM_YYZPJTBGSBSQ_A>';
        for (var i = 0; i < bllistArr.length; i++) {

            xml = xml + '<BPM_YYZPJTBGSBSQ_B>';
            xml = xml + '  <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
            xml = xml + '  <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
            xml = xml + '<ffentryno>' + (i + 1) + '</ffentryno>';
            xml = xml + '<fname>' + bllistArr[i].fname + '</fname>';
            xml = xml + '<fggxh>' + bllistArr[i].fggxh + '</fggxh>';
            xml = xml + '<famount>' + bllistArr[i].famount + '</famount>';
            xml = xml + '<fmoney>' + bllistArr[i].fmoney + '</fmoney>';
            xml = xml + '<fremark>' + bllistArr[i].fremark + '</fremark>';
            xml = xml + '</BPM_YYZPJTBGSBSQ_B>';

        }

        xml = xml + '</FormData>';
        xml = xml + '</XForm>';
        PostXml(xml);
    }

   
}