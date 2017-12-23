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

//封装子表
function mxItem(fgsmc, fgsdz, flxr, flxfs, fkhh, fkhhzh,fyyzzh,fzzdj,fjyfw) {



    var mx = {
        fgsmc: fgsmc,
        fgsdz: fgsdz,
        flxr: flxr,
        flxfs: flxfs,
        fkhh: fkhh,
        fkhhzh: fkhhzh,
        fyyzzh: fyyzzh,
        fzzdj: fzzdj,
        fjyfw:fjyfw,
        _check: function () {
            if (!fgsmc) {
                mui.toast('请填写公司名称');
                return null;
            }
            if (!fgsdz) {
                mui.toast('请填写公司地址');
                return null;
            }
            if (!flxr) {
                mui.toast('请填写联系人');
                return null;
            }
            if (!flxfs) {
                mui.toast('请填写联系方式');
                return null;
            }
            if (!fkhh) {
                mui.toast('请填写开户行');
                return null;
            }
            if (!fkhhzh) {
                mui.toast('请填写开户行账号');
                return null;
            }
            if (!fyyzzh) {
                mui.toast('请填写营业执照号');
                return null;
            }
            return mx;
        }
    }
    // mx._check();
    if (mx._check() == null) {
        return null;
    }
    return mx;

}

//特殊行为部分，主要为点击事件的绑定和自动计算部分
function tapEvent() {
    $('#dwmx').on('tap', function () {
        var li = '<div id="mx" class="mui-card">';
        li = li + '    <div class="mui-input-row itemtitle">';
        li = li + '       <label>明细列表项</label>';
        li = li + '       <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>';
        li = li + '    </div>';
        li = li + '    <div class="mui-input-row">';
        li = li + '       <label for="fgsmc">公司名称<i style="color:red;">*</i></label>';
        li = li + '       <input type="text" id="fgsmc" name="fgsmc" placeholder="请填写公司名称"/>';
        li = li + '    </div>';
        li = li + '    <div class="mui-input-row">';
        li = li + '        <label for="fgsdz">公司地址<i style="color:red;">*</i></label>';
        li = li + '        <input type="text" id="fgsdz" name="fgsdz" placeholder="请填写公司地址"/>';
        li = li + '    </div>';
        li = li + '    <div class="mui-input-row">';
        li = li + '         <label for="flxr">联系人<i style="color:red;">*</i></label>';
        li = li + '         <input type="text" id="flxr" name="flxr" placeholder="请填写联系人"/>';
        li = li + '    </div>';
        li = li + '    <div class="mui-input-row">';
        li = li + '          <label for="flxfs">联系方式<i style="color:red;">*</i></label>';
        li = li + '          <input type="tel" id="flxfs" name="flxfs" placeholder="请填写联系方式"/>';
        li = li + '    </div>';
        li = li + '    <div class="mui-input-row">';
        li = li + '         <label for="fkhh">开户行<i style="color:red;">*</i></label>';
        li = li + '         <input type="text" id="fkhh" name="fkhh" placeholder="请输入开户行"/>';
        li = li + '    </div>';
        li = li + '    <div class="mui-input-row">';
        li = li + '         <label for="fkhhzh">开户行账号<i style="color:red;">*</i></label>';
        li = li + '         <input type="text"  id="fkhhzh" name="fkhhzh" placeholder="请填写开户行账号" />';
        li = li + '    </div>';
        li = li + '    <div class="mui-input-row">';
        li = li + '         <label for="fyyzzh">营业执照号<i style="color:red;">*</i></label>';
        li = li + '         <input type="text"  id="fyyzzh" name="fyyzzh" placeholder="请填写营业执照号" />';
        li = li + '    </div>';
        li = li + '    <div class="mui-input-row">';
        li = li + '         <label for="fzzdj">资质等级</label>';
        li = li + '         <input type="text"  id="fzzdj" name="fzzdj" placeholder="请填写资质等级" />';
        li = li + '    </div>';
        li = li + '    <div class="mui-input-row">';
        li = li + '         <label for="fjyfw">经营范围</label>';
        li = li + '         <input type="text"  id="fjyfw" name="fjyfw" placeholder="请填写经营范围" />';
        li = li + '    </div>';
        li = li + '</div>';
        $("#mxlist").append(li);

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

        var item = data.FormDataSet.建设公司_分包施工单位新增申请_主表[0];

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
        $("#fgcmc").val(item.工程名称);
        $("#fsgnr").val(item.施工内容);
        $("#fxzsm").val(item.新增说明);
        
        var item_c = data.FormDataSet.建设公司_分包施工单位新增申请_子表;
        for (var i = 0; i < item_c.length; i++) {
            itemidArr.push(item_c[i].itemid);

            var li = '<div id="mx" class="mui-card">';
            li = li + '    <div class="mui-input-row itemtitle">';
            li = li + '       <label>明细列表项</label>';
            li = li + '       <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>';
            li = li + '    </div>';
            li = li + '    <div class="mui-input-row">';
            li = li + '       <label for="fgsmc">公司名称<i style="color:red;">*</i></label>';
            li = li + '       <input type="text" id="fgsmc" name="fgsmc" readonly="readonly" value="' + item_c[i].公司名称 + '"/>';
            li = li + '    </div>';
            li = li + '    <div class="mui-input-row">';
            li = li + '        <label for="fgsdz">公司地址<i style="color:red;">*</i></label>';
            li = li + '        <input type="text" id="fgsdz" name="fgsdz" readonly="readonly" value="' + item_c[i].公司地址 + '"/>';
            li = li + '    </div>';
            li = li + '    <div class="mui-input-row">';
            li = li + '         <label for="flxr">联系人<i style="color:red;">*</i></label>';
            li = li + '         <input type="text" id="flxr" name="flxr" readonly="readonly" value="' + item_c[i].联系人 + '"/>';
            li = li + '    </div>';
            li = li + '    <div class="mui-input-row">';
            li = li + '          <label for="flxfs">联系方式<i style="color:red;">*</i></label>';
            li = li + '          <input type="tel" id="flxfs" name="flxfs" readonly="readonly" value="' + item_c[i].联系方式 + '"/>';
            li = li + '    </div>';
            li = li + '    <div class="mui-input-row">';
            li = li + '         <label for="fkhh">开户行<i style="color:red;">*</i></label>';
            li = li + '         <input type="text" id="fkhh" name="fkhh" readonly="readonly" value="' + item_c[i].开户行 + '"/>';
            li = li + '    </div>';
            li = li + '    <div class="mui-input-row">';
            li = li + '         <label for="fkhhzh">开户行账号<i style="color:red;">*</i></label>';
            li = li + '         <input type="text"  id="fkhhzh" name="fkhhzh" readonly="readonly" value="' + item_c[i].开户行账号 + '"/>';
            li = li + '    </div>';
            li = li + '    <div class="mui-input-row">';
            li = li + '         <label for="fyyzzh">营业执照号<i style="color:red;">*</i></label>';
            li = li + '         <input type="text"  id="fyyzzh" name="fyyzzh" readonly="readonly" value="' + item_c[i].营业执照号 + '"/>';
            li = li + '    </div>';
            li = li + '    <div class="mui-input-row">';
            li = li + '         <label for="fzzdj">资质等级</label>';
            li = li + '         <input type="text"  id="fzzdj" name="fzzdj" readonly="readonly" value="' + item_c[i].资质等级 + '"/>';
            li = li + '    </div>';
            li = li + '    <div class="mui-input-row">';
            li = li + '         <label for="fjjfw">经营范围</label>';
            li = li + '         <input type="text"  id="fjjfw" name="fjjfw" readonly="readonly" value="' + item_c[i].经营范围 + '"/>';
            li = li + '    </div>';
            li = li + '</div>';
            $("#mxlist").append(li);

        }

        if (item.附件 != null && item.附件 != "") {
            var fjtmp = (String)(item.附件);

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
        $("#mxlist").find('span').each(function () {
            $(this).css("display", "block");

        });
        $("#dwmx").css('display', 'block');
        tapEvent();
        $("#mxlist").find("#fgsmc,#fgsdz,#flxr,#flxfs,#fkhh,#fkhhzh,#fyyzzh,#fzzdj,#fjyfw").each(function () {
            $(this).removeAttr('readonly');
        });
        $("#fgcmc,#fsgnr,#fxzsm").removeAttr('readonly');
        $(".upload-addbtn").css("display","block");
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
    var fdept = $("#fdept").val();
    var fcompany = $("#fcompany").val();
    var fgcmc = $("#fgcmc").val();
    var fsgnr = $("#fsgnr").val();
    var fxzsm = $("#fxzsm").val();
   

    if (!fgcmc) {
        mui.toast('请输入工程名称');
        return;
    }
    if (!fxzsm) {
        mui.toast('请输入新增说明');
        return;
    }
    var mxflag = false;
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {

        var fgsmc = $(this).find("#fgsmc").val();
        var fgsdz = $(this).find("#fgsdz").val();
        var flxr = $(this).find("#flxr").val();
        var flxfs = $(this).find("#flxfs").val();
        var fkhh = $(this).find("#fkhh").val();
        var fkhhzh = $(this).find("#fkhhzh").val();
        var fyyzzh = $(this).find("#fyyzzh").val();
        var fzzdj = $(this).find("#fzzdj").val();
        var fjyfw = $(this).find("#fjyfw").val();

        if (mxItem(fgsmc, fgsdz, flxr, flxfs, fkhh, fkhhzh, fyyzzh, fzzdj, fjyfw) == null) {
            mxflag = true;
            return;
        }
        var mx = mxItem(fgsmc, fgsdz, flxr, flxfs, fkhh, fkhhzh, fyyzzh, fzzdj, fjyfw);
        mxlistArr.push(mx);
    });
    if (mxflag) {
        return;
    }
    //if (fjArray.length == 0) {
    //    mui.toast('请上传附件');
    //    return;
    //}
    var btnArry = ["取消", "确定"];
    mui.confirm('即将提交，是否确定？', '提交确认提醒', btnArry, function (e) {
        if (e.index == 1) {

            var xml = '<?xml version= "1.0" ?>';
            xml = xml + '   <XForm>';
            xml = xml + '         <Header>';
            xml = xml + '        <Method>Post</Method>';
            xml = xml + '       <ProcessName>建设公司分包施工单位新增申请</ProcessName>';
            xml = xml + '         <ProcessVersion>' + version + '</ProcessVersion>';
            xml = xml + '            <DraftGuid></DraftGuid>';
            xml = xml + '             <OwnerMemberFullName>' + BPMOU + '</OwnerMemberFullName>';
            xml = xml + '            <Action>提交</Action>';
            xml = xml + '          <Comment></Comment>';
            xml = xml + '             <InviteIndicateUsers></InviteIndicateUsers>';
            xml = xml + '       </Header>';
            xml = xml + '       <FormData>';

            xml = xml + '  <建设公司_分包施工单位新增申请_主表>';
            xml = xml + '  <单号>自动生成</单号>';
            xml = xml + '  <申请人>' + fname + '</申请人>';
            xml = xml + '   <申请日期>' + fdate + '</申请日期>';
            xml = xml + '   <申请部门>' + fdept + '</申请部门>';
            xml = xml + '   <所属公司>' + fcompany + '</所属公司>';
            xml = xml + '   <工程名称>' + fgcmc + '</工程名称>';
            xml = xml + '   <施工内容>' + fsgnr + '</施工内容>';
            xml = xml + '   <新增说明>' + fxzsm + '</新增说明>';
            if (fjArray.length != 0) {
                xml = xml + '  <附件>' + fjArray.toString().replace(",", ";") + '</附件>';
            } else {
                xml = xml + '  <附件></附件>'
            }
            xml = xml + '  </建设公司_分包施工单位新增申请_主表>';
            for (var i = 0; i < mxlistArr.length; i++) {
                xml = xml + '   <建设公司_分包施工单位新增申请_子表>';
                xml = xml + '  <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml = xml + '   <RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + '   <序号>' + (i + 1) + '</序号>';
                xml = xml + '   <公司名称>' + mxlistArr[i].fgsmc + '</公司名称>';
                xml = xml + '  <公司地址>' + mxlistArr[i].fgsdz + '</公司地址>';
                xml = xml + '   <联系人>' + mxlistArr[i].flxr + '</联系人>';
                xml = xml + '   <联系方式>' + mxlistArr[i].flxfs + '</联系方式>';
                xml = xml + '   <开户行>' + mxlistArr[i].fkhh + '</开户行>';
                xml = xml + '   <开户行账号>' + mxlistArr[i].fkhhzh + '</开户行账号>';
                xml = xml + '   <营业执照号>' + mxlistArr[i].fyyzzh + '</营业执照号>';
                xml = xml + '   <资质等级>' + mxlistArr[i].fzzdj + '</资质等级>';
                xml = xml + '   <经营范围>' + mxlistArr[i].fjyfw + '</经营范围>';
                xml = xml + '  </建设公司_分包施工单位新增申请_子表>';
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
    var fgcmc = $("#fgcmc").val();
    var fsgnr = $("#fsgnr").val();
    var fxzsm = $("#fxzsm").val();


    if (!fgcmc) {
        mui.toast('请输入工程名称');
        return;
    }
    if (!fxzsm) {
        mui.toast('请输入新增说明');
        return;
    }
    if (fjArray.length == 0) {
        mui.toast('请上传附件');
        return;
    }
    var mxflag = false;
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {

        var fgsmc = $(this).find("#fgsmc").val();
        var fgsdz = $(this).find("#fgsdz").val();
        var flxr = $(this).find("#flxr").val();
        var flxfs = $(this).find("#flxfs").val();
        var fkhh = $(this).find("#fkhh").val();
        var fkhhzh = $(this).find("#fkhhzh").val();
        var fyyzzh = $(this).find("#fyyzzh").val();
        var fzzdj = $(this).find("#fzzdj").val();
        var fjyfw = $(this).find("#fjyfw").val();

        if (mxItem(fgsmc, fgsdz, flxr, flxfs, fkhh, fkhhzh, fyyzzh, fzzdj, fjyfw) == null) {
            mxflag = true;
            return;
        }
        var mx = mxItem(fgsmc, fgsdz, flxr, flxfs, fkhh, fkhhzh, fyyzzh, fzzdj, fjyfw);
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

            xml = xml + '  <建设公司_分包施工单位新增申请_主表>';
            xml = xml + '  <单号>自动生成</单号>';
            xml = xml + '  <申请人>' + fname + '</申请人>';
            xml = xml + '   <申请日期>' + fdate + '</申请日期>';
            xml = xml + '   <申请部门>' + fdept + '</申请部门>';
            xml = xml + '   <所属公司>' + fcompany + '</所属公司>';
            xml = xml + '   <工程名称>' + fgcmc + '</工程名称>';
            xml = xml + '   <施工内容>' + fsgnr + '</施工内容>';
            xml = xml + '   <新增说明>' + fxzsm + '</新增说明>';
            if (fjArray.length != 0) {
                xml = xml + '  <附件>' + fjArray.toString().replace(",", ";") + '</附件>';
            } else {
                xml = xml + '  <附件></附件>'
            }
            xml = xml + '  </建设公司_分包施工单位新增申请_主表>';
            for (var i = 0; i < mxlistArr.length; i++) {
                xml = xml + '   <建设公司_分包施工单位新增申请_子表>';
                xml = xml + '  <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml = xml + '   <RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + '   <序号>' + (i + 1) + '</序号>';
                xml = xml + '   <公司名称>' + mxlistArr[i].fgsmc + '</公司名称>';
                xml = xml + '  <公司地址>' + mxlistArr[i].fgsdz + '</公司地址>';
                xml = xml + '   <联系人>' + mxlistArr[i].flxr + '</联系人>';
                xml = xml + '   <联系方式>' + mxlistArr[i].flxfs + '</联系方式>';
                xml = xml + '   <开户行>' + mxlistArr[i].fkhh + '</开户行>';
                xml = xml + '   <开户行账号>' + mxlistArr[i].fkhhzh + '</开户行账号>';
                xml = xml + '   <营业执照号>' + mxlistArr[i].fyyzzh + '</营业执照号>';
                xml = xml + '   <资质等级>' + mxlistArr[i].fzzdj + '</资质等级>';
                xml = xml + '   <经营范围>' + mxlistArr[i].fjyfw + '</经营范围>';
                xml = xml + '  </建设公司_分包施工单位新增申请_子表>';
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
    var comment = $("#signSuggest").val();

    var fname = $("#fname").val();
    var fdate = $("#fdate").val() + " 00:00:00";
    var fdept = $("#fdept").val();
    var fcompany = $("#fcompany").val();
    var fgcmc = $("#fgcmc").val();
    var fsgnr = $("#fsgnr").val();
    var fxzsm = $("#fxzsm").val();


    $("#mxlist").find("#mx").each(function () {

        var fgsmc = $(this).find("#fgsmc").val();
        var fgsdz = $(this).find("#fgsdz").val();
        var flxr = $(this).find("#flxr").val();
        var flxfs = $(this).find("#flxfs").val();
        var fkhh = $(this).find("#fkhh").val();
        var fkhhzh = $(this).find("#fkhhzh").val();
        var fyyzzh = $(this).find("#fyyzzh").val();
        var fzzdj = $(this).find("#fzzdj").val();
        var fjyfw = $(this).find("#fjyfw").val();

        var mx = mxItem(fgsmc, fgsdz, flxr, flxfs, fkhh, fkhhzh, fyyzzh, fzzdj, fjyfw);
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

            xml = xml + '  <建设公司_分包施工单位新增申请_主表>';
            xml = xml + '  <单号>自动生成</单号>';
            xml = xml + '  <申请人>' + fname + '</申请人>';
            xml = xml + '   <申请日期>' + fdate + '</申请日期>';
            xml = xml + '   <申请部门>' + fdept + '</申请部门>';
            xml = xml + '   <所属公司>' + fcompany + '</所属公司>';
            xml = xml + '   <工程名称>' + fgcmc + '</工程名称>';
            xml = xml + '   <施工内容>' + fsgnr + '</施工内容>';
            xml = xml + '   <新增说明>' + fxzsm + '</新增说明>';
            if (fjArray.length != 0) {
                xml = xml + '  <附件>' + fjArray.toString().replace(",", ";") + '</附件>';
            } else {
                xml = xml + '  <附件></附件>'
            }
            xml = xml + '  </建设公司_分包施工单位新增申请_主表>';
            for (var i = 0; i < mxlistArr.length; i++) {
                xml = xml + '   <建设公司_分包施工单位新增申请_子表>';
                xml = xml + '  <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml = xml + '   <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
                xml = xml + '   <序号>' + (i + 1) + '</序号>';
                xml = xml + '   <公司名称>' + mxlistArr[i].fgsmc + '</公司名称>';
                xml = xml + '  <公司地址>' + mxlistArr[i].fgsdz + '</公司地址>';
                xml = xml + '   <联系人>' + mxlistArr[i].flxr + '</联系人>';
                xml = xml + '   <联系方式>' + mxlistArr[i].flxfs + '</联系方式>';
                xml = xml + '   <开户行>' + mxlistArr[i].fkhh + '</开户行>';
                xml = xml + '   <开户行账号>' + mxlistArr[i].fkhhzh + '</开户行账号>';
                xml = xml + '   <营业执照号>' + mxlistArr[i].fyyzzh + '</营业执照号>';
                xml = xml + '   <资质等级>' + mxlistArr[i].fzzdj + '</资质等级>';
                xml = xml + '   <经营范围>' + mxlistArr[i].fjyfw + '</经营范围>';
                xml = xml + '  </建设公司_分包施工单位新增申请_子表>';
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
    var nodeName = $("#nodeName").val();

    var fname = $("#fname").val();
    var fdate = $("#fdate").val() + " 00:00:00";
    var fdept = $("#fdept").val();
    var fcompany = $("#fcompany").val();
    var fgcmc = $("#fgcmc").val();
    var fsgnr = $("#fsgnr").val();
    var fxzsm = $("#fxzsm").val();

    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {

        var fgsmc = $(this).find("#fgsmc").val();
        var fgsdz = $(this).find("#fgsdz").val();
        var flxr = $(this).find("#flxr").val();
        var flxfs = $(this).find("#flxfs").val();
        var fkhh = $(this).find("#fkhh").val();
        var fkhhzh = $(this).find("#fkhhzh").val();
        var fyyzzh = $(this).find("#fyyzzh").val();
        var fzzdj = $(this).find("#fzzdj").val();
        var fjyfw = $(this).find("#fjyfw").val();

        var mx = mxItem(fgsmc, fgsdz, flxr, flxfs, fkhh, fkhhzh, fyyzzh, fzzdj, fjyfw);
        //var mx = new object;
        //mx.fgsmc = fgsmc;
        //mx.fgsdz = fgsdz;
        //mx.flxr = flxr;
        //mx.flxfs = flxfs;
        //mx.fkhh = fkhh;
        //mx.fkhhzh = fkhhzh;
        //mx.fyyzzh = fyyzzh;
        //mx.fzzdj = fzzdj;
        //mx.fjyfw = fjyfw;
        mxlistArr.push(mx);
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
                    consignUserStr = (String)($('#consignUser').val()).split(",");

                    for (var i = 0; i < consignUserStr.length; i++) {
                        consignUserStr[i] = '&quot;' + consignUserStr[i] + '&quot;';
                    }
                    consignUserStr = '[' + consignUserStr.toString() + ']';

                    var xml = '<?xml version="1.0"?>';
                    xml = xml + '<XForm>';
                    xml = xml + '<Header>';
                    xml = xml + '<Method>Process</Method>';
                    xml = xml + '<PID>' + pid + '</PID>';
                    xml = xml + '<Action>同意</Action>';
                    xml = xml + '<Comment>' + comment + '</Comment>';
                    //加签差异xml部分
                    xml = xml + '<ConsignEnabled>true</ConsignEnabled>';
                    xml = xml + '  <ConsignUsers>' + consignUserStr + '</ConsignUsers>';
                    xml = xml + ' <ConsignRoutingType>' + consignRoutingType + '</ConsignRoutingType>';
                    xml = xml + '  <ConsignReturnType>' + consignReturnType + '</ConsignReturnType>';
                    xml = xml + ' <InviteIndicateUsers>[]</InviteIndicateUsers>';
                    xml = xml + ' <Context>{&quot;Routing&quot;:{}}</Context>';
                    xml = xml + '</Header>';
                    xml = xml + '<FormData>';

                    xml = xml + '  <建设公司_分包施工单位新增申请_主表>';
                    xml = xml + '  <单号>自动生成</单号>';
                    xml = xml + '  <申请人>' + fname + '</申请人>';
                    xml = xml + '   <申请日期>' + fdate + '</申请日期>';
                    xml = xml + '   <申请部门>' + fdept + '</申请部门>';
                    xml = xml + '   <所属公司>' + fcompany + '</所属公司>';
                    xml = xml + '   <工程名称>' + fgcmc + '</工程名称>';
                    xml = xml + '   <施工内容>' + fsgnr + '</施工内容>';
                    xml = xml + '   <新增说明>' + fxzsm + '</新增说明>';
                    if (fjArray.length != 0) {
                        xml = xml + '  <附件>' + fjArray.toString().replace(",", ";") + '</附件>';
                    } else {
                        xml = xml + '  <附件></附件>'
                    }
                    xml = xml + '  </建设公司_分包施工单位新增申请_主表>';
                    for (var i = 0; i < mxlistArr.length; i++) {
                        xml = xml + '   <建设公司_分包施工单位新增申请_子表>';
                        xml = xml + '  <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                        xml = xml + '   <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
                        xml = xml + '   <序号>' + (i + 1) + '</序号>';
                        xml = xml + '   <公司名称>' + mxlistArr[i].fgsmc + '</公司名称>';
                        xml = xml + '  <公司地址>' + mxlistArr[i].fgsdz + '</公司地址>';
                        xml = xml + '   <联系人>' + mxlistArr[i].flxr + '</联系人>';
                        xml = xml + '   <联系方式>' + mxlistArr[i].flxfs + '</联系方式>';
                        xml = xml + '   <开户行>' + mxlistArr[i].fkhh + '</开户行>';
                        xml = xml + '   <开户行账号>' + mxlistArr[i].fkhhzh + '</开户行账号>';
                        xml = xml + '   <营业执照号>' + mxlistArr[i].fyyzzh + '</营业执照号>';
                        xml = xml + '   <资质等级>' + mxlistArr[i].fzzdj + '</资质等级>';
                        xml = xml + '   <经营范围>' + mxlistArr[i].fjyfw + '</经营范围>';
                        xml = xml + '  </建设公司_分包施工单位新增申请_子表>';
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

        xml = xml + ' <UrlParams></UrlParams>';
        xml = xml + '  <ConsignEnabled>false</ConsignEnabled>';
        xml = xml + '  <ConsignUsers>[]</ConsignUsers>';
        xml = xml + '  <ConsignRoutingType>Parallel</ConsignRoutingType>';
        xml = xml + '  <ConsignReturnType>Return</ConsignReturnType>';

        xml = xml + '   <InviteIndicateUsers>[]</InviteIndicateUsers>';
        xml = xml + '   <Context>{&quot;Routing&quot;:{}}</Context>';	
        xml = xml + '</Header>';
        xml = xml + '<FormData>';

        xml = xml + '  <建设公司_分包施工单位新增申请_主表>';
        xml = xml + '  <单号>自动生成</单号>';
        xml = xml + '  <申请人>' + fname + '</申请人>';
        xml = xml + '   <申请日期>' + fdate + '</申请日期>';
        xml = xml + '   <申请部门>' + fdept + '</申请部门>';
        xml = xml + '   <所属公司>' + fcompany + '</所属公司>';
        xml = xml + '   <工程名称>' + fgcmc + '</工程名称>';
        xml = xml + '   <施工内容>' + fsgnr + '</施工内容>';
        xml = xml + '   <新增说明>' + fxzsm + '</新增说明>';
        if (fjArray.length != 0) {
            xml = xml + '  <附件>' + fjArray.toString().replace(",", ";") + '</附件>';
        } else {
            xml = xml + '  <附件></附件>'
        }
        xml = xml + '  </建设公司_分包施工单位新增申请_主表>';
        for (var i = 0; i < mxlistArr.length; i++) {
            xml = xml + '   <建设公司_分包施工单位新增申请_子表>';
            xml = xml + '  <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
            xml = xml + '   <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
            xml = xml + '   <序号>' + (i + 1) + '</序号>';
            xml = xml + '   <公司名称>' + mxlistArr[i].fgsmc + '</公司名称>';
            xml = xml + '  <公司地址>' + mxlistArr[i].fgsdz + '</公司地址>';
            xml = xml + '   <联系人>' + mxlistArr[i].flxr + '</联系人>';
            xml = xml + '   <联系方式>' + mxlistArr[i].flxfs + '</联系方式>';
            xml = xml + '   <开户行>' + mxlistArr[i].fkhh + '</开户行>';
            xml = xml + '   <开户行账号>' + mxlistArr[i].fkhhzh + '</开户行账号>';
            xml = xml + '   <营业执照号>' + mxlistArr[i].fyyzzh + '</营业执照号>';
            xml = xml + '   <资质等级>' + mxlistArr[i].fzzdj + '</资质等级>';
            xml = xml + '   <经营范围>' + mxlistArr[i].fjyfw + '</经营范围>';
            xml = xml + '  </建设公司_分包施工单位新增申请_子表>';
        }

        xml = xml + '</FormData>';
        xml = xml + '</XForm>';
        PostXml(xml);
    }

   
}