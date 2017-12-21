
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

function changeKplx() {
    var kplx = $("#fkplx").val();
    if (kplx == "进度开票") {
        $("#fjdzje").removeAttr("readonly");
        $("#fjdzje").attr("placeholder", "请输入进度总金额");
        $("#fjszje").removeAttr("placeholder");
        $("#fjszje").attr("readonly", "readonly");
        $("#jdzje").css("display", "block");
        $("#jszje").css("display", "none");
    } else if (kplx == "决算开票") {
        $("#fjszje").removeAttr("readonly");
        $("#fjszje").attr("placeholder", "请输入决算总金额");
        $("#fjdzje").removeAttr("placeholder");
        $("#fjdzje").attr("readonly", "readonly");
        $("#jdzje").css("display", "none");
        $("#jszje").css("display", "block");
    }
}
//特殊行为部分，主要为点击事件的绑定和自动计算部分
function tapEvent() {
    var fkplxdata = [
        {
            value: "jdkp",
            text:"进度开票"
        },
        {
            value: "jskp",
            text:"决算开票"
        }

    ];
    var element = document.getElementById('fkplx');

    var picker = new mui.PopPicker();

    picker.setData(fkplxdata);

    element.addEventListener('tap', function () {

        picker.show(function (items) {

            element.value = items[0].text;
            changeKplx();
        });

    }, false);

    var fsldata = [
        {
            value: "3%",
            text: "3%"
        },
        {
            value: "11%",
            text: "11%"
        },
        {
            value: "17%",
            text: "17%"
        }

    ];
    showPicker("fsl", fsldata);
    var ffpzldata = [
        {
            value: "ptfp",
            text: "普通发票"
        },
        {
            value: "zyfp",
            text: "专用发票"
        }

    ];
    showPicker("ffpzl", ffpzldata);

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

        var item = data.FormDataSet.建设公司_发票开具申请[0];

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
        $("#fxmmc").val(item.项目名称);
        $("#fdm").val(item.K3代码);
        $("#fkplx").val(item.开票类型);
        $("#fjdzje").val(item.进度总金额);
        $("#fjszje").val(item.决算总金额);
        $("#fykfpje").val(item.已开发票金额);
        $("#fwkfpje").val(item.未开发票金额);
        $("#fkhmc").val(item.客户名称);
        $("#fnsrsbh").val(item.纳税人识别号);
        $("#fkhhmc").val(item.开户行名称);
        $("#fkhhzh").val(item.开户行账号);
        $("#fkhdz").val(item.客户地址);
        $("#fkhdh").val(item.客户电话);
        $("#fsl").val(item.税率);
        $("#ffpzl").val(item.发票种类);
        $("#fbckpje").val(item.本次开票金额);
        $("#ffph").val(item.发票号);
        $("#ffpbm").val(item.发票编码);
        $("#fbz").val(item.备注);
        if (item.开票类型 == "进度开票") {
            $("#jdzje").css("display", "block");
            $("#jszje").css("display", "none");

        } else {
            $("#jdzje").css("display", "none");
            $("#jszje").css("display", "block");
        }

        if (item.发票附件 != null && item.发票附件 != "") {
            var fjtmp = (String)(item.发票附件);

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


        tapEvent();

        $("#fxmmc,#fdm,#fykfpje,#fwkfpje,#fkhmc,#fnsrsbh,#fkhhmc,#fkhhzh,#fkhdz,#fkhdh,#fbckpje,#fbz").removeAttr('readonly');
       
    } else if (NodeName == "sysInform") {
        $("#readD").css("display", "block");
        $("#csd").css("display", "none");

    } else {
        if (typeof (NodeName) != "undefined") {
            $("#approvalD").css("display", "block");
            if (NodeName.indexOf("出纳") != -1) {
                $("#ffph").removeAttr("readonly");
                $("#ffpbm").removeAttr("readonly");
                $(".upload-addbtn").css("display", "block");
                upload();
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
    var fxmmc = $("#fxmmc").val();
    var fdm = $("#fdm").val();
    var fkplx = $("#fkplx").val();
    var fjdzje = $("#fjdzje").val();
    var fjszje = $("#fjszje").val();
    var fykfpje = $("#fykfpje").val();
    var fwkfpje = $("#fwkfpje").val();
    var fkhmc = $("#fkhmc").val();
    var fnsrsbh = $("#fnsrsbh").val();
    var fkhhmc = $("#fkhhmc").val();
    var fkhhzh = $("#fkhhzh").val();
    var fkhdz = $("#fkhdz").val();
    var fkhdh = $("#fkhdh").val();
    var fsl = $("#fsl").val();
    var ffpzl = $("#ffpzl").val();
    var fbckpje = $("#fbckpje").val();
    var ffph = $("#ffph").val();
    var ffpbm = $("#ffpbm").val();
    var fbz = $("#fbz").val();

    if (!fxmmc) {
        mui.toast('请输入项目名称');
        return;
    }
    if (!fdm) {
        mui.toast('请输入K3代码');
        return;
    }
    if (!fkplx) {
        mui.toast('请选择开票类型');
        return;
    }
    if (fkplx == "进度开票" && !fjdzje) {
        mui.toast('请填写进度总金额');
        return;
    }
    if (fkplx == "决算开票" && !fjszje) {
        mui.toast('请填写决算总金额');
        return;
    }
    if (!fykfpje) {
        mui.toast('请填写已开发票金额');
        return;
    }
    if (!fwkfpje) {
        mui.toast('请填写未开发票金额');
        return;
    }
    if (!fkhmc) {
        mui.toast('请填写客户名称');
        return;
    }
    if (!fnsrsbh) {
        mui.toast('请填写纳税人识别号');
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
    if (!fkhdz) {
        mui.toast('请填写客户地址');
        return;
    }
    if (!fkhdh) {
        mui.toast('请填写客户电话');
        return;
    }
    if (!fsl) {
        mui.toast('请选择税率');
        return;
    }
    if (!ffpzl) {
        mui.toast('请选择发票种类');
        return;
    }
    if (!fbckpje) {
        mui.toast('请填写本次开票金额');
        return;
    }

    var btnArry = ["取消", "确定"];
    mui.confirm('即将提交，是否确定？', '提交确认提醒', btnArry, function (e) {
        if (e.index == 1) {

            var xml = '<?xml version= "1.0" ?>';
            xml = xml + '   <XForm>';
            xml = xml + '         <Header>';
            xml = xml + '        <Method>Post</Method>';
            xml = xml + '       <ProcessName>建设公司发票开具申请</ProcessName>';
            xml = xml + '         <ProcessVersion>' + version + '</ProcessVersion>';
            xml = xml + '            <DraftGuid></DraftGuid>';
            xml = xml + '             <OwnerMemberFullName>' + BPMOU + '</OwnerMemberFullName>';
            xml = xml + '            <Action>提交</Action>';
            xml = xml + '          <Comment></Comment>';
            xml = xml + '             <InviteIndicateUsers></InviteIndicateUsers>';
            xml = xml + '       </Header>';
            xml = xml + '       <FormData>';

            xml = xml + '  <建设公司_发票开具申请>';
            xml = xml + '  <单号>自动生成</单号>';
            xml = xml + '  <申请人>' + fname + '</申请人>';
            xml = xml + '   <申请日期>' + fdate + '</申请日期>';
            xml = xml + '   <申请部门>' + fdept + '</申请部门>';
            xml = xml + '   <所属公司>' + fcompany + '</所属公司>';
            xml = xml + '   <项目名称>' + fxmmc + '</项目名称>';
            xml = xml + '   <K3代码>' + fdm + '</K3代码>';
            xml = xml + '   <开票类型>' + fkplx + '</开票类型>';
            xml = xml + '   <进度总金额>' + fjdzje + '</进度总金额>';
            xml = xml + '  <决算总金额>' + fjszje + '</决算总金额>';
            xml = xml + '   <已开发票金额>' + fykfpje + '</已开发票金额>';
            xml = xml + '   <未开发票金额>' + fwkfpje + '</未开发票金额>';
            xml = xml + '   <客户名称>' + fkhmc + '</客户名称>';
            xml = xml + '   <纳税人识别号>' + fnsrsbh + '</纳税人识别号>';
            xml = xml + '   <开户行名称>' + fkhhmc + '</开户行名称>';
            xml = xml + '   <开户行账号>' + fkhhzh + '</开户行账号>';
            xml = xml + '   <客户地址>' + fkhdz + '</客户地址>';
            xml = xml + '   <客户电话>' + fkhdh + '</客户电话>';
            xml = xml + '   <税率>' + fsl + '</税率>';
            xml = xml + '   <发票种类>' + ffpzl + '</发票种类>';
            xml = xml + '   <本次开票金额>' + fbckpje + '</本次开票金额>';
            xml = xml + '   <发票号>' + ffph + '</发票号>';
            xml = xml + '   <发票编码>' + ffpbm + '</发票编码>';
            if (fjArray.length != 0) {
                xml = xml + '  <发票附件>' + fjArray.toString().replace(",", ";") + '</发票附件>';
            } else {
                xml = xml + '  <发票附件></发票附件>'
            }
            xml = xml + '   <备注>' + fbz + '</备注>';
            xml = xml + '  </建设公司_发票开具申请>';

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
    var fxmmc = $("#fxmmc").val();
    var fdm = $("#fdm").val();
    var fkplx = $("#fkplx").val();
    var fjdzje = $("#fjdzje").val();
    var fjszje = $("#fjszje").val();
    var fykfpje = $("#fykfpje").val();
    var fwkfpje = $("#fwkfpje").val();
    var fkhmc = $("#fkhmc").val();
    var fnsrsbh = $("#fnsrsbh").val();
    var fkhhmc = $("#fkhhmc").val();
    var fkhhzh = $("#fkhhzh").val();
    var fkhdz = $("#fkhdz").val();
    var fkhdh = $("#fkhdh").val();
    var fsl = $("#fsl").val();
    var ffpzl = $("#ffpzl").val();
    var fbckpje = $("#fbckpje").val();
    var ffph = $("#ffph").val();
    var ffpbm = $("#ffpbm").val();
    var fbz = $("#fbz").val();

    if (!fxmmc) {
        mui.toast('请输入项目名称');
        return;
    }
    if (!fdm) {
        mui.toast('请输入K3代码');
        return;
    }
    if (!fkplx) {
        mui.toast('请选择开票类型');
        return;
    }
    if (fkplx == "进度开票" && !fjdzje) {
        mui.toast('请填写进度总金额');
        return;
    }
    if (fkplx == "决算开票" && !fjszje) {
        mui.toast('请填写决算总金额');
        return;
    }
    if (!fykfpje) {
        mui.toast('请填写已开发票金额');
        return;
    }
    if (!fwkfpje) {
        mui.toast('请填写未开发票金额');
        return;
    }
    if (!fkhmc) {
        mui.toast('请填写客户名称');
        return;
    }
    if (!fnsrsbh) {
        mui.toast('请填写纳税人识别号');
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
    if (!fkhdz) {
        mui.toast('请填写客户地址');
        return;
    }
    if (!fkhdh) {
        mui.toast('请填写客户电话');
        return;
    }
    if (!fsl) {
        mui.toast('请选择税率');
        return;
    }
    if (!ffpzl) {
        mui.toast('请选择发票种类');
        return;
    }
    if (!fbckpje) {
        mui.toast('请填写本次开票金额');
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

            xml = xml + '  <建设公司_发票开具申请>';
            xml = xml + '  <单号>' + fbillno + '</单号>';
            xml = xml + '  <申请人>' + fname + '</申请人>';
            xml = xml + '   <申请日期>' + fdate + '</申请日期>';
            xml = xml + '   <申请部门>' + fdept + '</申请部门>';
            xml = xml + '   <所属公司>' + fcompany + '</所属公司>';
            xml = xml + '   <项目名称>' + fxmmc + '</项目名称>';
            xml = xml + '   <K3代码>' + fdm + '</K3代码>';
            xml = xml + '   <开票类型>' + fkplx + '</开票类型>';
            xml = xml + '   <进度总金额>' + fjdzje + '</进度总金额>';
            xml = xml + '  <决算总金额>' + fjszje + '</决算总金额>';
            xml = xml + '   <已开发票金额>' + fykfpje + '</已开发票金额>';
            xml = xml + '   <未开发票金额>' + fwkfpje + '</未开发票金额>';
            xml = xml + '   <客户名称>' + fkhmc + '</客户名称>';
            xml = xml + '   <纳税人识别号>' + fnsrsbh + '</纳税人识别号>';
            xml = xml + '   <开户行名称>' + fkhhmc + '</开户行名称>';
            xml = xml + '   <开户行账号>' + fkhhzh + '</开户行账号>';
            xml = xml + '   <客户地址>' + fkhdz + '</客户地址>';
            xml = xml + '   <客户电话>' + fkhdh + '</客户电话>';
            xml = xml + '   <税率>' + fsl + '</税率>';
            xml = xml + '   <发票种类>' + ffpzl + '</发票种类>';
            xml = xml + '   <本次开票金额>' + fbckpje + '</本次开票金额>';
            xml = xml + '   <发票号>' + ffph + '</发票号>';
            xml = xml + '   <发票编码>' + ffpbm + '</发票编码>';
            if (fjArray.length != 0) {
                xml = xml + '  <发票附件>' + fjArray.toString().replace(",", ";") + '</发票附件>';
            } else {
                xml = xml + '  <发票附件></发票附件>'
            }
            xml = xml + '   <备注>' + fbz + '</备注>';
            xml = xml + '  </建设公司_发票开具申请>';

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
    var fxmmc = $("#fxmmc").val();
    var fdm = $("#fdm").val();
    var fkplx = $("#fkplx").val();
    var fjdzje = $("#fjdzje").val();
    var fjszje = $("#fjszje").val();
    var fykfpje = $("#fykfpje").val();
    var fwkfpje = $("#fwkfpje").val();
    var fkhmc = $("#fkhmc").val();
    var fnsrsbh = $("#fnsrsbh").val();
    var fkhhmc = $("#fkhhmc").val();
    var fkhhzh = $("#fkhhzh").val();
    var fkhdz = $("#fkhdz").val();
    var fkhdh = $("#fkhdh").val();
    var fsl = $("#fsl").val();
    var ffpzl = $("#ffpzl").val();
    var fbckpje = $("#fbckpje").val();
    var ffph = $("#ffph").val();
    var ffpbm = $("#ffpbm").val();
    var fbz = $("#fbz").val();

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

            xml = xml + '  <建设公司_发票开具申请>';
            xml = xml + '  <单号>自动生成</单号>';
            xml = xml + '  <申请人>' + fname + '</申请人>';
            xml = xml + '   <申请日期>' + fdate + '</申请日期>';
            xml = xml + '   <申请部门>' + fdept + '</申请部门>';
            xml = xml + '   <所属公司>' + fcompany + '</所属公司>';
            xml = xml + '   <项目名称>' + fxmmc + '</项目名称>';
            xml = xml + '   <K3代码>' + fdm + '</K3代码>';
            xml = xml + '   <开票类型>' + fkplx + '</开票类型>';
            xml = xml + '   <进度总金额>' + fjdzje + '</进度总金额>';
            xml = xml + '  <决算总金额>' + fjszje + '</决算总金额>';
            xml = xml + '   <已开发票金额>' + fykfpje + '</已开发票金额>';
            xml = xml + '   <未开发票金额>' + fwkfpje + '</未开发票金额>';
            xml = xml + '   <客户名称>' + fkhmc + '</客户名称>';
            xml = xml + '   <纳税人识别号>' + fnsrsbh + '</纳税人识别号>';
            xml = xml + '   <开户行名称>' + fkhhmc + '</开户行名称>';
            xml = xml + '   <开户行账号>' + fkhhzh + '</开户行账号>';
            xml = xml + '   <客户地址>' + fkhdz + '</客户地址>';
            xml = xml + '   <客户电话>' + fkhdh + '</客户电话>';
            xml = xml + '   <税率>' + fsl + '</税率>';
            xml = xml + '   <发票种类>' + ffpzl + '</发票种类>';
            xml = xml + '   <本次开票金额>' + fbckpje + '</本次开票金额>';
            xml = xml + '   <发票号>' + ffph + '</发票号>';
            xml = xml + '   <发票编码>' + ffpbm + '</发票编码>';
            if (fjArray.length != 0) {
                xml = xml + '  <发票附件>' + fjArray.toString().replace(",", ";") + '</发票附件>';
            } else {
                xml = xml + '  <发票附件></发票附件>'
            }
            xml = xml + '   <备注>' + fbz + '</备注>';
            xml = xml + '  </建设公司_发票开具申请>';

            xml = xml + '</FormData>';
            xml = xml + '</XForm>';
            PostXml(xml);
        }
    });
}

function AgreeOrConSign() {
    var pid = $("#stepId").val();
    var fbillno = $("#fbillno").val();
    var nodeName = $("#nodeName").val();

    var fname = $("#fname").val();
    var fdate = $("#fdate").val() + " 00:00:00";
    var fdept = $("#fdept").val();
    var fcompany = $("#fcompany").val();
    var fxmmc = $("#fxmmc").val();
    var fdm = $("#fdm").val();
    var fkplx = $("#fkplx").val();
    var fjdzje = $("#fjdzje").val();
    var fjszje = $("#fjszje").val();
    var fykfpje = $("#fykfpje").val();
    var fwkfpje = $("#fwkfpje").val();
    var fkhmc = $("#fkhmc").val();
    var fnsrsbh = $("#fnsrsbh").val();
    var fkhhmc = $("#fkhhmc").val();
    var fkhhzh = $("#fkhhzh").val();
    var fkhdz = $("#fkhdz").val();
    var fkhdh = $("#fkhdh").val();
    var fsl = $("#fsl").val();
    var ffpzl = $("#ffpzl").val();
    var fbckpje = $("#fbckpje").val();
    var ffph = $("#ffph").val();
    var ffpbm = $("#ffpbm").val();
    var fbz = $("#fbz").val();

    var comment = $("#signSuggest").val();
    var consignUserId = new Array();
    var consignRoutingType;
    var consignReturnType;

    var consignUserStr;
    if (nodeName == "出纳" && !ffph) {
        mui.toast("请输入发票号");
        return;
    }
    if (nodeName == "出纳" && !ffpbm) {
        mui.toast("请输入发票编码");
        return;
    }
    if (nodeName == "出纳" && fjArray.length == 0) {
        mui.toast("请上传发票附件");
        return;
    }
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

                    xml = xml + '  <建设公司_发票开具申请>';
                    xml = xml + '  <单号>自动生成</单号>';
                    xml = xml + '  <申请人>' + fname + '</申请人>';
                    xml = xml + '   <申请日期>' + fdate + '</申请日期>';
                    xml = xml + '   <申请部门>' + fdept + '</申请部门>';
                    xml = xml + '   <所属公司>' + fcompany + '</所属公司>';
                    xml = xml + '   <项目名称>' + fxmmc + '</项目名称>';
                    xml = xml + '   <K3代码>' + fdm + '</K3代码>';
                    xml = xml + '   <开票类型>' + fkplx + '</开票类型>';
                    xml = xml + '   <进度总金额>' + fjdzje + '</进度总金额>';
                    xml = xml + '  <决算总金额>' + fjszje + '</决算总金额>';
                    xml = xml + '   <已开发票金额>' + fykfpje + '</已开发票金额>';
                    xml = xml + '   <未开发票金额>' + fwkfpje + '</未开发票金额>';
                    xml = xml + '   <客户名称>' + fkhmc + '</客户名称>';
                    xml = xml + '   <纳税人识别号>' + fnsrsbh + '</纳税人识别号>';
                    xml = xml + '   <开户行名称>' + fkhhmc + '</开户行名称>';
                    xml = xml + '   <开户行账号>' + fkhhzh + '</开户行账号>';
                    xml = xml + '   <客户地址>' + fkhdz + '</客户地址>';
                    xml = xml + '   <客户电话>' + fkhdh + '</客户电话>';
                    xml = xml + '   <税率>' + fsl + '</税率>';
                    xml = xml + '   <发票种类>' + ffpzl + '</发票种类>';
                    xml = xml + '   <本次开票金额>' + fbckpje + '</本次开票金额>';
                    xml = xml + '   <发票号>' + ffph + '</发票号>';
                    xml = xml + '   <发票编码>' + ffpbm + '</发票编码>';
                    if (fjArray.length != 0) {
                        xml = xml + '  <发票附件>' + fjArray.toString().replace(",", ";") + '</发票附件>';
                    } else {
                        xml = xml + '  <发票附件></发票附件>'
                    }
                    xml = xml + '   <备注>' + fbz + '</备注>';
                    xml = xml + '  </建设公司_发票开具申请>';

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

        xml = xml + '  <建设公司_发票开具申请>';
        xml = xml + '  <单号>自动生成</单号>';
        xml = xml + '  <申请人>' + fname + '</申请人>';
        xml = xml + '   <申请日期>' + fdate + '</申请日期>';
        xml = xml + '   <申请部门>' + fdept + '</申请部门>';
        xml = xml + '   <所属公司>' + fcompany + '</所属公司>';
        xml = xml + '   <项目名称>' + fxmmc + '</项目名称>';
        xml = xml + '   <K3代码>' + fdm + '</K3代码>';
        xml = xml + '   <开票类型>' + fkplx + '</开票类型>';
        xml = xml + '   <进度总金额>' + fjdzje + '</进度总金额>';
        xml = xml + '  <决算总金额>' + fjszje + '</决算总金额>';
        xml = xml + '   <已开发票金额>' + fykfpje + '</已开发票金额>';
        xml = xml + '   <未开发票金额>' + fwkfpje + '</未开发票金额>';
        xml = xml + '   <客户名称>' + fkhmc + '</客户名称>';
        xml = xml + '   <纳税人识别号>' + fnsrsbh + '</纳税人识别号>';
        xml = xml + '   <开户行名称>' + fkhhmc + '</开户行名称>';
        xml = xml + '   <开户行账号>' + fkhhzh + '</开户行账号>';
        xml = xml + '   <客户地址>' + fkhdz + '</客户地址>';
        xml = xml + '   <客户电话>' + fkhdh + '</客户电话>';
        xml = xml + '   <税率>' + fsl + '</税率>';
        xml = xml + '   <发票种类>' + ffpzl + '</发票种类>';
        xml = xml + '   <本次开票金额>' + fbckpje + '</本次开票金额>';
        xml = xml + '   <发票号>' + ffph + '</发票号>';
        xml = xml + '   <发票编码>' + ffpbm + '</发票编码>';
        if (fjArray.length != 0) {
            xml = xml + '  <发票附件>' + fjArray.toString().replace(",", ";") + '</发票附件>';
        } else {
            xml = xml + '  <发票附件></发票附件>'
        }
        xml = xml + '   <备注>' + fbz + '</备注>';
        xml = xml + '  </建设公司_发票开具申请>';

        xml = xml + '</FormData>';
        xml = xml + '</XForm>';
        PostXml(xml);
    }

   
}