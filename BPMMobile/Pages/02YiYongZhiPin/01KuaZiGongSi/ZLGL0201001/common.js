﻿
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

    var fcompanydata = [
        {
            value: 'fl',
            text: '敷料分公司'
        }, {
            value: 'yl',
            text: '原料分公司'
        }, {
            value: 'lq',
            text: '滤器分公司'
        }, {
            value: 'mj',
            text: '灭菌分公司'
        }, {
            value: 'cxq',
            text: '采血器分公司'
        }, {
            value: 'zsq',
            text: '注射器分公司'
        }, {
            value: 'syq',
            text: '输液器分公司'
        }, {
            value: 'yycl',
            text: '医用材料分公司'
        }, {
            value: 'zysyq',
            text: '专用输液器分公司'
        }, {
            value: 'sxqc',
            text: '输血器材分公司'
        }, {
            value: 'xyjs',
            text: '血液技术分公司'
        }, {
            value: 'cgzsq',
            text: '冲管注射器分公司'
        }, {
            value: 'wm',
            text: '外贸公司'
        }, {
            value: 'js',
            text: '洁盛公司'
        }, {
            value: 'lzz',
            text: '留置针公司'
        }, {
            value: 'yyclgs',
            text: '医用材料公司'
        }, {
            value: 'hssb',
            text: '海盛设备公司'
        }, {
            value: 'xsyl',
            text: '新生医疗器械公司'
        }, {
            value: 'ypbz',
            text: '药品包装制品公司'
        }, {
            value: 'fs',
            text: '富森医用材料公司'
        }, {
            value: 'wr',
            text: '威瑞外科医用制品公司'
        }
    ];
    showPicker('fcompany', fcompanydata);


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
    $.ajax({
        type: "get",
        url: "/api/bpm/GetTaskData",
        data: { 'taskId': taskId },
        beforeSend: function (XHR) {
            XHR.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem('ticket'));
        }
    }).done(function (data) {
        console.log(data);

        var item = data.FormDataSet.BPM_YYZPZLXXFK[0];

        //待办特殊操作
        if (flag) {
            
            $("#taskId").val(item.TaskID);
            $("#stepId").val(stepId);
            $("#fbillno").val(item.fbillno);

        }
        $("#fname").val(item.fname);
        $("#fdate").val(FormatterTimeYMS(item.fdate));
        $("#fgs").val(item.fgs);
        $("#ftel").val(item.ftel);
        $("#fcompany").val(item.fcompany);
        $("#fcpmc").val(item.fcpmc);
        $("#fggxh").val(item.fggxh);
        $("#fdw").val(item.fdw);
        $("#fph").val(item.fph);
        $("#fmjph").val(item.fmjph);
        $("#fwtms").val(item.fwtms);
        $("#fkh").val(item.fkh);
        $("#ftsrq").val(FormatterTimeYMS(item.ftsrq));
        $("#fdh").val(item.fdh);
        $("#fpcje").val(item.fpcje);
        $("#fif_zm").val(item.fif_zm);
        $("#fif_yp").val(item.fif_yp);
        $("#fyprq").val(FormatterTimeYMS(item.fyprq));
        $("#fgzlx").val(item.fgzlx);
        $("#fif_sb").val(item.fif_sb);
        $("#fclyq").val(item.fclyq);
        $("#fgzfx").val(item.fgzfx);
        $("#fjzcs").val(item.fjzcs);
        $("#fbm").val(item.fbm);
        $("#ffzr").val(item.ffzr);
        $("#fyzr").val(item.fyzr);
        $("#fwcrq").val(FormatterTimeYMS(item.fwcrq));
        $("#fyzrq").val(FormatterTimeYMS(item.fyzrq));
        $("#fwtfl").val(item.fwtfl);
        $("#fif_zdsg").val(item.fif_zdsg);


        if (item.ffj != null && item.ffj != "") {
            var fjtmp = (String)(item.ffj);

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
        $("#ftel,#fcpmc,#fggxh,#fdw,#fph,#fmjph,#fwtms,#fkh,#ftsrq,#fdh,#fpcje,#fif_zm,#fif_yp,#fyprq,#fgzlx,#fif_sb,#fclyq").removeAttr('readonly');
    } else if (NodeName == "sysInform") {
        $("#readD").css("display", "block");
        $("#csd").css("display", "none");

    } else {
        if (typeof (NodeName) != "undefined") {
            $("#approvalD").css("display", "block");
            if (String(NodeName).indexOf("质量主管") != -1) {
                $("#fgzfx,#fjzcs,#fbm,#ffzr,#fyzr,#fwcrq,#fyzrq").removeAttr("readonly");
                $("#fgzfx").attr("placeholder", "请输入故障原因分析");
                $("#fjzcs").attr("placeholder", "请输入纠正措施");
                $("#fbm").attr("placeholder", "请输入纠正措施部门");
                $("#ffzr").attr("placeholder", "请输入纠正措施负责人");
                $("#fyzr").attr("placeholder", "请输入纠正措施验证人");
                
            } else if (String(NodeName).indexOf("质量部经理") != -1){
                $("#fwtfl").attr("placeholder", "请选择分体分类");
                $("#fif_zdsg").attr("placeholder", "请选择是否重大事故");

                var fwtfldata = [
                    {
                        value: "ly",
                        text: "漏液"
                    },
                    {
                        value: "cpyw",
                        text: "产品异物"
                    },
                    {
                        value: "zzqx",
                        text: "制造缺陷"
                    },
                    {
                        value: "sjqx",
                        text: "设计缺陷"
                    },
                    {
                        value: "yswt",
                        text: "运输问题"
                    },
                    {
                        value: "yclwt",
                        text: "原材料问题"
                    },
                    {
                        value: "gksybd",
                        text: "顾客使用不当"
                    },
                    {
                        value: "gjjy",
                        text: "改进建议"
                    },
                    {
                        value: "qt",
                        text: "其他"
                    }
                ];
                showPicker("fwtfl", fwtfldata);
                var fif_zdsgdata = [
                    {
                        value: "yes",
                        text: "是"
                    },
                    {
                        value: "no",
                        text: "否"
                    }
                ];
                showPicker("fif_zdsg", fif_zdsgdata);
            }
        }
    }


}


//行为函数部分
function Save() {
    var fname = $("#fname").val();
    var fdate = $("#fdate").val() + " 00:00:00";
    var fgs = $("#fgs").val();
    var ftel = $("#ftel").val();
    var fcompany = $("#fcompany").val();
    var fcpmc = $("#fcpmc").val();
    var fggxh = $("#fggxh").val();
    var fdw = $("#fdw").val();
    var fph = $("#fph").val();
    var fmjph = $("#fmjph").val();
    var fwtms = $("#fwtms").val();
    var fkh = $("#fkh").val();
    var ftsrq = $("#ftsrq").val();
    var fdh = $("#fdh").val();
    var fpcje = $("#fpcje").val();
    var fif_zm = $("#fif_zm").val();
    var fif_yp = $("#fif_yp").val();
    var fyprq = $("#fyprq").val();
    var fgzlx = $("#fgzlx").val();
    var fif_sb = $("#fif_sb").val();
    var fclyq = $("#fclyq").val();
    var fgzfx = $("#fgzfx").val();
    var fjzcs = $("#fjzcs").val();
    var fbm = $("#fbm").val();
    var ffzr = $("#ffzr").val();
    var fyzr = $("#fyzr").val();
    var fwcrq = $("#fwcrq").val();
    var fyzrq = $("#fyzrq").val();
    var fwtfl = $("#fwtfl").val();
    var fif_zdsg = $("#fif_zdsg").val();

    if (!fcompany) {
        mui.toast('请选择产品生产公司');
        return;
    }
    if (!fcpmc) {
        mui.toast('请输入产品名称');
        return;
    }
    if (!fph) {
        mui.toast('请输入批号');
        return;
    }
    if (!fwtms) {
        mui.toast('请输入质量问题描述');
        return;
    }
    if (!fkh) {
        mui.toast('请输入客户');
        return;
    }
    if (!fif_sb) {
        mui.toast('请输入院方是否上报不良事件');
        return;
    }

    var btnArry = ["取消", "确定"];
    mui.confirm('即将提交，是否确定？', '提交确认提醒', btnArry, function (e) {
        if (e.index == 1) {

            var xml = '<?xml version= "1.0" ?>';
            xml = xml + '   <XForm>';
            xml = xml + '         <Header>';
            xml = xml + '        <Method>Post</Method>';
            xml = xml + '       <ProcessName>医用制品集团质量信息反馈</ProcessName>';
            xml = xml + '         <ProcessVersion>' + version + '</ProcessVersion>';
            xml = xml + '            <DraftGuid></DraftGuid>';
            xml = xml + '             <OwnerMemberFullName>' + BPMOU + '</OwnerMemberFullName>';
            xml = xml + '            <Action>提交</Action>';
            xml = xml + '          <Comment></Comment>';
            xml = xml + '             <InviteIndicateUsers></InviteIndicateUsers>';
            xml = xml + '       </Header>';
            xml = xml + '       <FormData>';

            xml = xml + '  <BPM_YYZPZLXXFK>';
            xml = xml + '  <fbillno>自动生成</fbillno>';
            xml = xml + '  <fname>' + fname + '</fname>';
            xml = xml + '   <fgs>' + fgs + '</fgs>';
            xml = xml + '   <fdate>' + fdate + '</fdate>';
            xml = xml + '   <ftel>' + ftel + '</ftel>';
            xml = xml + '   <fcompany>' + fcompany + '</fcompany>';
            xml = xml + '   <fcpmc>' + fcpmc + '</fcpmc>';
            xml = xml + '   <fggxh>' + fggxh + '</fggxh>';
            xml = xml + '   <fdw>' + fdw + '</fdw>';
            xml = xml + '  <fph>' + fph + '</fph>';
            xml = xml + '   <fmjph>' + fmjph + '</fmjph>';
            xml = xml + '   <fwtms>' + fwtms + '</fwtms>';
            xml = xml + '   <fkh>' + fkh + '</fkh>';
            xml = xml + '   <ftsrq>' + ftsrq + '</ftsrq>';
            xml = xml + '   <fdh>' + fdh + '</fdh>';
            xml = xml + '   <fpcje>' + fpcje + '</fpcje>';
            xml = xml + '   <fif_zm>' + fif_zm + '</fif_zm>';
            xml = xml + '   <fif_yp>' + fif_yp + '</fif_yp>';
            xml = xml + '   <fyprq>' + fyprq + '</fyprq>';
            xml = xml + '   <fgzlx>' + fgzlx + '</fgzlx>';
            xml = xml + '   <fif_sb>' + fif_sb + '</fif_sb>';
            xml = xml + '   <fclyq>' + fclyq + '</fclyq>';
            xml = xml + '   <fgzfx>' + fgzfx + '</fgzfx>';
            xml = xml + '   <fjzcs>' + fjzcs + '</fjzcs>';
            xml = xml + '   <fbm>' + fbm + '</fbm>';
            xml = xml + '   <ffzr>' + ffzr + '</ffzr>';
            xml = xml + '   <fyzr>' + fyzr + '</fyzr>';
            xml = xml + '   <fwcrq>' + fwcrq + '</fwcrq>';
            xml = xml + '   <fyzrq>' + fyzrq + '</fyzrq>';
            xml = xml + '   <fwtfl>' + fwtfl + '</fwtfl>';
            xml = xml + '   <fif_zdsg>' + fif_zdsg + '</fif_zdsg>';
            xml = xml + '   <ffj>' + fjArray.toString().replace(",", ";") + '</ffj>';
            xml = xml + '  </BPM_YYZPZLXXFK>';
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
    var ftel = $("#ftel").val();
    var fcompany = $("#fcompany").val();
    var fcpmc = $("#fcpmc").val();
    var fggxh = $("#fggxh").val();
    var fdw = $("#fdw").val();
    var fph = $("#fph").val();
    var fmjph = $("#fmjph").val();
    var fwtms = $("#fwtms").val();
    var fkh = $("#fkh").val();
    var ftsrq = $("#ftsrq").val();
    var fdh = $("#fdh").val();
    var fpcje = $("#fpcje").val();
    var fif_zm = $("#fif_zm").val();
    var fif_yp = $("#fif_yp").val();
    var fyprq = $("#fyprq").val();
    var fgzlx = $("#fgzlx").val();
    var fif_sb = $("#fif_sb").val();
    var fclyq = $("#fclyq").val();
    var fgzfx = $("#fgzfx").val();
    var fjzcs = $("#fjzcs").val();
    var fbm = $("#fbm").val();
    var ffzr = $("#ffzr").val();
    var fyzr = $("#fyzr").val();
    var fwcrq = $("#fwcrq").val();
    var fyzrq = $("#fyzrq").val();
    var fwtfl = $("#fwtfl").val();
    var fif_zdsg = $("#fif_zdsg").val();

    if (!fcompany) {
        mui.toast('请选择产品生产公司');
        return;
    }
    if (!fcpmc) {
        mui.toast('请输入产品名称');
        return;
    }
    if (!fph) {
        mui.toast('请输入批号');
        return;
    }
    if (!fwtms) {
        mui.toast('请输入质量问题描述');
        return;
    }
    if (!fkh) {
        mui.toast('请输入客户');
        return;
    }
    if (!fif_sb) {
        mui.toast('请输入院方是否上报不良事件');
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

            xml = xml + '  <BPM_YYZPZLXXFK>';
            xml = xml + '  <fbillno>' + fbillno + '</fbillno>';
            xml = xml + '  <fname>' + fname + '</fname>';
            xml = xml + '   <fgs>' + fgs + '</fgs>';
            xml = xml + '   <fdate>' + fdate + '</fdate>';
            xml = xml + '   <ftel>' + ftel + '</ftel>';
            xml = xml + '   <fcompany>' + fcompany + '</fcompany>';
            xml = xml + '   <fcpmc>' + fcpmc + '</fcpmc>';
            xml = xml + '   <fggxh>' + fggxh + '</fggxh>';
            xml = xml + '   <fdw>' + fdw + '</fdw>';
            xml = xml + '  <fph>' + fph + '</fph>';
            xml = xml + '   <fmjph>' + fmjph + '</fmjph>';
            xml = xml + '   <fwtms>' + fwtms + '</fwtms>';
            xml = xml + '   <fkh>' + fkh + '</fkh>';
            xml = xml + '   <ftsrq>' + ftsrq + '</ftsrq>';
            xml = xml + '   <fdh>' + fdh + '</fdh>';
            xml = xml + '   <fpcje>' + fpcje + '</fpcje>';
            xml = xml + '   <fif_zm>' + fif_zm + '</fif_zm>';
            xml = xml + '   <fif_yp>' + fif_yp + '</fif_yp>';
            xml = xml + '   <fyprq>' + fyprq + '</fyprq>';
            xml = xml + '   <fgzlx>' + fgzlx + '</fgzlx>';
            xml = xml + '   <fif_sb>' + fif_sb + '</fif_sb>';
            xml = xml + '   <fclyq>' + fclyq + '</fclyq>';
            xml = xml + '   <fgzfx>' + fgzfx + '</fgzfx>';
            xml = xml + '   <fjzcs>' + fjzcs + '</fjzcs>';
            xml = xml + '   <fbm>' + fbm + '</fbm>';
            xml = xml + '   <ffzr>' + ffzr + '</ffzr>';
            xml = xml + '   <fyzr>' + fyzr + '</fyzr>';
            xml = xml + '   <fwcrq>' + fwcrq + '</fwcrq>';
            xml = xml + '   <fyzrq>' + fyzrq + '</fyzrq>';
            xml = xml + '   <fwtfl>' + fwtfl + '</fwtfl>';
            xml = xml + '   <fif_zdsg>' + fif_zdsg + '</fif_zdsg>';
            xml = xml + '   <ffj>' + fjArray.toString().replace(",", ";") + '</ffj>';
            xml = xml + '  </BPM_YYZPZLXXFK>';

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
    var ftel = $("#ftel").val();
    var fcompany = $("#fcompany").val();
    var fcpmc = $("#fcpmc").val();
    var fggxh = $("#fggxh").val();
    var fdw = $("#fdw").val();
    var fph = $("#fph").val();
    var fmjph = $("#fmjph").val();
    var fwtms = $("#fwtms").val();
    var fkh = $("#fkh").val();
    var ftsrq = $("#ftsrq").val();
    var fdh = $("#fdh").val();
    var fpcje = $("#fpcje").val();
    var fif_zm = $("#fif_zm").val();
    var fif_yp = $("#fif_yp").val();
    var fyprq = $("#fyprq").val();
    var fgzlx = $("#fgzlx").val();
    var fif_sb = $("#fif_sb").val();
    var fclyq = $("#fclyq").val();
    var fgzfx = $("#fgzfx").val();
    var fjzcs = $("#fjzcs").val();
    var fbm = $("#fbm").val();
    var ffzr = $("#ffzr").val();
    var fyzr = $("#fyzr").val();
    var fwcrq = $("#fwcrq").val();
    var fyzrq = $("#fyzrq").val();
    var fwtfl = $("#fwtfl").val();
    var fif_zdsg = $("#fif_zdsg").val();

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

            xml = xml + '  <BPM_YYZPZLXXFK>';
            xml = xml + '  <fbillno>' + fbillno + '</fbillno>';
            xml = xml + '  <fname>' + fname + '</fname>';
            xml = xml + '   <fgs>' + fgs + '</fgs>';
            xml = xml + '   <fdate>' + fdate + '</fdate>';
            xml = xml + '   <ftel>' + ftel + '</ftel>';
            xml = xml + '   <fcompany>' + fcompany + '</fcompany>';
            xml = xml + '   <fcpmc>' + fcpmc + '</fcpmc>';
            xml = xml + '   <fggxh>' + fggxh + '</fggxh>';
            xml = xml + '   <fdw>' + fdw + '</fdw>';
            xml = xml + '  <fph>' + fph + '</fph>';
            xml = xml + '   <fmjph>' + fmjph + '</fmjph>';
            xml = xml + '   <fwtms>' + fwtms + '</fwtms>';
            xml = xml + '   <fkh>' + fkh + '</fkh>';
            xml = xml + '   <ftsrq>' + ftsrq + '</ftsrq>';
            xml = xml + '   <fdh>' + fdh + '</fdh>';
            xml = xml + '   <fpcje>' + fpcje + '</fpcje>';
            xml = xml + '   <fif_zm>' + fif_zm + '</fif_zm>';
            xml = xml + '   <fif_yp>' + fif_yp + '</fif_yp>';
            xml = xml + '   <fyprq>' + fyprq + '</fyprq>';
            xml = xml + '   <fgzlx>' + fgzlx + '</fgzlx>';
            xml = xml + '   <fif_sb>' + fif_sb + '</fif_sb>';
            xml = xml + '   <fclyq>' + fclyq + '</fclyq>';
            xml = xml + '   <fgzfx>' + fgzfx + '</fgzfx>';
            xml = xml + '   <fjzcs>' + fjzcs + '</fjzcs>';
            xml = xml + '   <fbm>' + fbm + '</fbm>';
            xml = xml + '   <ffzr>' + ffzr + '</ffzr>';
            xml = xml + '   <fyzr>' + fyzr + '</fyzr>';
            xml = xml + '   <fwcrq>' + fwcrq + '</fwcrq>';
            xml = xml + '   <fyzrq>' + fyzrq + '</fyzrq>';
            xml = xml + '   <fwtfl>' + fwtfl + '</fwtfl>';
            xml = xml + '   <fif_zdsg>' + fif_zdsg + '</fif_zdsg>';
            xml = xml + '   <ffj>' + fjArray.toString().replace(",", ";") + '</ffj>';
            xml = xml + '  </BPM_YYZPZLXXFK>';
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
    var fgs = $("#fgs").val();
    var ftel = $("#ftel").val();
    var fcompany = $("#fcompany").val();
    var fcpmc = $("#fcpmc").val();
    var fggxh = $("#fggxh").val();
    var fdw = $("#fdw").val();
    var fph = $("#fph").val();
    var fmjph = $("#fmjph").val();
    var fwtms = $("#fwtms").val();
    var fkh = $("#fkh").val();
    var ftsrq = $("#ftsrq").val();
    var fdh = $("#fdh").val();
    var fpcje = $("#fpcje").val();
    var fif_zm = $("#fif_zm").val();
    var fif_yp = $("#fif_yp").val();
    var fyprq = $("#fyprq").val();
    var fgzlx = $("#fgzlx").val();
    var fif_sb = $("#fif_sb").val();
    var fclyq = $("#fclyq").val();
    var fgzfx = $("#fgzfx").val();
    var fjzcs = $("#fjzcs").val();
    var fbm = $("#fbm").val();
    var ffzr = $("#ffzr").val();
    var fyzr = $("#fyzr").val();
    var fwcrq = $("#fwcrq").val();
    var fyzrq = $("#fyzrq").val();
    var fwtfl = $("#fwtfl").val();
    var fif_zdsg = $("#fif_zdsg").val();

    if (String(nodeName).indexOf("质量主管") != -1) {
        if (!fgzfx) {
            mui.toast("请输入故障原因分析");
            return;
        }
        if (!fjzcs) {
            mui.toast("请输入纠正措施");
            return;
        }
        if (!ffzr) {
            mui.toast("请输入纠正措施负责人");
            return;
        }
        if (!fwcrq) {
            mui.toast("请输入纠正措施计划完成日期");
            return;
        }
        if (!fyzrq) {
            mui.toast("请输入纠正措施计划验证日期");
            return;
        }
       
    } else if (String(nodeName).indexOf("质量部经理") != -1){
        if (!fwtfl) {
            mui.toast("请选择问题分类");
            return;
        }
        if (!fif_zdsg) {
            mui.toast("请选择是否重大事故");
            return;
        }
    }

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

                    xml = xml + '  <BPM_YYZPZLXXFK>';
                    xml = xml + '  <fbillno>' + fbillno + '</fbillno>';
                    xml = xml + '  <fname>' + fname + '</fname>';
                    xml = xml + '   <fgs>' + fgs + '</fgs>';
                    xml = xml + '   <fdate>' + fdate + '</fdate>';
                    xml = xml + '   <ftel>' + ftel + '</ftel>';
                    xml = xml + '   <fcompany>' + fcompany + '</fcompany>';
                    xml = xml + '   <fcpmc>' + fcpmc + '</fcpmc>';
                    xml = xml + '   <fggxh>' + fggxh + '</fggxh>';
                    xml = xml + '   <fdw>' + fdw + '</fdw>';
                    xml = xml + '  <fph>' + fph + '</fph>';
                    xml = xml + '   <fmjph>' + fmjph + '</fmjph>';
                    xml = xml + '   <fwtms>' + fwtms + '</fwtms>';
                    xml = xml + '   <fkh>' + fkh + '</fkh>';
                    xml = xml + '   <ftsrq>' + ftsrq + '</ftsrq>';
                    xml = xml + '   <fdh>' + fdh + '</fdh>';
                    xml = xml + '   <fpcje>' + fpcje + '</fpcje>';
                    xml = xml + '   <fif_zm>' + fif_zm + '</fif_zm>';
                    xml = xml + '   <fif_yp>' + fif_yp + '</fif_yp>';
                    xml = xml + '   <fyprq>' + fyprq + '</fyprq>';
                    xml = xml + '   <fgzlx>' + fgzlx + '</fgzlx>';
                    xml = xml + '   <fif_sb>' + fif_sb + '</fif_sb>';
                    xml = xml + '   <fclyq>' + fclyq + '</fclyq>';
                    xml = xml + '   <fgzfx>' + fgzfx + '</fgzfx>';
                    xml = xml + '   <fjzcs>' + fjzcs + '</fjzcs>';
                    xml = xml + '   <fbm>' + fbm + '</fbm>';
                    xml = xml + '   <ffzr>' + ffzr + '</ffzr>';
                    xml = xml + '   <fyzr>' + fyzr + '</fyzr>';
                    xml = xml + '   <fwcrq>' + fwcrq + '</fwcrq>';
                    xml = xml + '   <fyzrq>' + fyzrq + '</fyzrq>';
                    xml = xml + '   <fwtfl>' + fwtfl + '</fwtfl>';
                    xml = xml + '   <fif_zdsg>' + fif_zdsg + '</fif_zdsg>';
                    xml = xml + '   <ffj>' + fjArray.toString().replace(",", ";") + '</ffj>';
                    xml = xml + '  </BPM_YYZPZLXXFK>';

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

        xml = xml + '  <BPM_YYZPZLXXFK>';
        xml = xml + '  <fbillno>' + fbillno + '</fbillno>';
        xml = xml + '  <fname>' + fname + '</fname>';
        xml = xml + '   <fgs>' + fgs + '</fgs>';
        xml = xml + '   <fdate>' + fdate + '</fdate>';
        xml = xml + '   <ftel>' + ftel + '</ftel>';
        xml = xml + '   <fcompany>' + fcompany + '</fcompany>';
        xml = xml + '   <fcpmc>' + fcpmc + '</fcpmc>';
        xml = xml + '   <fggxh>' + fggxh + '</fggxh>';
        xml = xml + '   <fdw>' + fdw + '</fdw>';
        xml = xml + '  <fph>' + fph + '</fph>';
        xml = xml + '   <fmjph>' + fmjph + '</fmjph>';
        xml = xml + '   <fwtms>' + fwtms + '</fwtms>';
        xml = xml + '   <fkh>' + fkh + '</fkh>';
        xml = xml + '   <ftsrq>' + ftsrq + '</ftsrq>';
        xml = xml + '   <fdh>' + fdh + '</fdh>';
        xml = xml + '   <fpcje>' + fpcje + '</fpcje>';
        xml = xml + '   <fif_zm>' + fif_zm + '</fif_zm>';
        xml = xml + '   <fif_yp>' + fif_yp + '</fif_yp>';
        xml = xml + '   <fyprq>' + fyprq + '</fyprq>';
        xml = xml + '   <fgzlx>' + fgzlx + '</fgzlx>';
        xml = xml + '   <fif_sb>' + fif_sb + '</fif_sb>';
        xml = xml + '   <fclyq>' + fclyq + '</fclyq>';
        xml = xml + '   <fgzfx>' + fgzfx + '</fgzfx>';
        xml = xml + '   <fjzcs>' + fjzcs + '</fjzcs>';
        xml = xml + '   <fbm>' + fbm + '</fbm>';
        xml = xml + '   <ffzr>' + ffzr + '</ffzr>';
        xml = xml + '   <fyzr>' + fyzr + '</fyzr>';
        xml = xml + '   <fwcrq>' + fwcrq + '</fwcrq>';
        xml = xml + '   <fyzrq>' + fyzrq + '</fyzrq>';
        xml = xml + '   <fwtfl>' + fwtfl + '</fwtfl>';
        xml = xml + '   <fif_zdsg>' + fif_zdsg + '</fif_zdsg>';
        xml = xml + '   <ffj>' + fjArray.toString().replace(",", ";") + '</ffj>';
        xml = xml + '  </BPM_YYZPZLXXFK>';

        xml = xml + '</FormData>';
        xml = xml + '</XForm>';
        PostXml(xml);
    }

   
}