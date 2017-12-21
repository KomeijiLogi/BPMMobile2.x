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
    xml = xml + '       <ProcessName>建设公司门窗销售订单提报</ProcessName>';
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
        $("#fname").val(item.业务员);

    }).fail(function (e) {

    });
}

function tapEvent() {
    var fgq = 0;
    $("#fjhdate").on('change', function () {
        var fjhdate = $("#fjhdate").val();
        var fdate = $("#fdate").val();
        
        fgq = DateDiff(fdate, fjhdate);
        $("#fgq").val(fgq);
    });

    var fcplxdata = [

        {
            value: '',
            text:'铝合金'
        },
        {
            value: '',
            text: '木窗'
        },
        {
            value: '',
            text: '阳光窗'
        },
        {
            value: '',
            text: '铁艺'
        },
        {
            value: '',
            text: '幕墙'
        }
    ];
    showPicker('fcplx', fcplxdata);

    var fxslxdata = [
        {
            value: '',
            text:'家装'
        },
        {
            value: '',
            text: '工程'
        }

    ];
    var element = document.getElementById('fxslx');

    var picker = new mui.PopPicker();

    picker.setData(fxslxdata);

    element.addEventListener('tap', function () {

        picker.show(function (items) {

            element.value = items[0].text;
            if (String( items[0].text)=='家装') {
                $(".upload-addbtn").css('display', 'block');
                $("#fif_zkd").removeClass('mui-disabled');
                upload();
            } else {
                $(".upload-addbtn").css('display', 'none');
                $("#fif_zkd").addClass('mui-disabled');
            }
        });

    }, false);


    $("#tjmx").on('tap', function () {
        var li = '<div id="mx" class="mui-card">';
        li = li + '    <div class="mui-input-row itemtitle">';
        li = li + '       <label>明细列表项</label>';
        li = li + '       <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>';
        li = li + '    </div>';
        li = li + '     <div class="mui-input-row">';
        li = li + '        <label for="fxm">项目<i style="color:red;">*</i></label>';
        li = li + '        <input type="text" id="fxm" name="fxm" placeholder="请填写项目"/>';
        li = li + '     </div>';
        li = li + '     <div class="mui-input-row">';
        li = li + '         <label for="fdj">单价<i style="color:red;">*</i></label>';
        li = li + '         <input type="number" id="fdj" name="fdj" placeholder="请填写单价"/>';
        li = li + '     </div>';
        li = li + '     <div class="mui-input-row">';
        li = li + '          <label for="fsl">数量<i style="color:red;">*</i></label>';
        li = li + '          <input type="number" id="fsl" name="fsl" placeholder="请填写数量"/>';
        li = li + '     </div>';
        li = li + '     <div class="mui-input-row">';
        li = li + '          <label for="fje">金额</label>';
        li = li + '          <input type="number" id="fje" name="fje" value="0.00" readonly="readonly"/>';
        li = li + '     </div>';
        li = li + '</div>';
        $("#mxlist").append(li);
        $("#mxlist").find("#fdj,#fsl").each(function () {
            $(this).off('input');
            $(this).on('input', function () {
                calcPrice(this);
            });
        });
    });

}


function calcPrice(context) {
    var fje = 0.00;
    var total = 0;
    var fdj = parseFloat($(context).parent().parent().find("#fdj").val());
    if (isNaN(fdj)) {
        fdj = 0;
    }
    var fsl = parseFloat($(context).parent().parent().find("#fsl").val());
    if (isNaN(fsl)) {
        fsl = 0;
    }
    var fje = fdj * fsl;
    $(context).parent().parent().find("#fje").val(fje);

    $("#mxlist").find("#fje").each(function () {
        var fje = parseFloat($(this).val());
        if (isNaN(fje)) {
            fje = 0;
        }
        total = parseFloat(total) + fje;
        $("#ftotal").val(total);
    });
}

function mxItem(fxm,fdj,fsl,fje) {

    var mx = Object.create({
        fxm: fxm,
        fdj: fdj,
        fsl: fsl,
        fje: fje,
        _check: function () {

            if (!fxm) {
                mui.toast('请填写项目');
                return null;
            }
            if (!fdj) {
                mui.toast('请填写单价');
                return null;
            }
            if (!fsl) {
                mui.toast('请填写数量');
                return null;
            }
            return mx;
        },
        get getObj() {
           
            return mx;
        },
        set setObj(obj) {
            this.fxm = fxm;
            this.fdj = fdj;
            this.fsl = fsl;
            this.fje = fje;
        }
    });
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
        var item = data.FormDataSet.建设公司_家装销售订单提报_主表[0];
        if (flag) {

            $("#taskId").val(item.TaskID);
            $("#stepId").val(stepId);
            $("#fbillno").val(item.单号);

        }

        $("#fname").val(item.业务员);
        $("#fdate").val(FormatterTimeYMS(item.申请日期));
        $("#fjhdate").val(FormatterTimeYMS(item.交货日期));
        $("#fgq").val(item.工期);
        $("#fcplx").val(item.产品类型);
        $("#fxslx").val(item.销售类型);
        $("#fgcbm").val(item.工程编码);
        $("#fgcmc").val(item.工程名称);
        $("#fif_zk").val(item.是否折扣);
        if (String(item.是否折扣) == '是') {
            $("#fif_zkd").addClass('mui-active');
        }
        $("#fkhmc").val(item.客户姓名);
        $("#fkhdh").val(item.客户电话);
        $("#fjsr").val(item.介绍人);
        $("#fgcsm").val(item.工程说明);
        $("#fzkz").val(item.折扣值);
        $("#fsjsk").val(item.实际收款);
        $("#ftotal").val(item.合计金额);
        $("#fbz").val(item.备注);


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

                                li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '"><img src="../../../../Content/images/xlsx@2x.png"/></div>';

                            } else if ((data[i].Ext).indexOf("doc") != -1) {

                                li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '"><img src="../../../../Content/images/docx@2x.png"/></div>';

                            } else if ((data[i].Ext).indexOf("ppt") != -1) {

                                li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '"><img src="../../../../Content/images/ppt@2x.png"/></div>';

                            } else if ((data[i].Ext).indexOf("pdf") != -1) {

                                li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '"><img src="../../../../Content/images/pdf@2x.png"/></div>';

                            } else if ((data[i].Ext).indexOf("zip") != -1 || (data[i].Ext).indexOf("rar") != -1 || (data[i].Ext).indexOf("7z") != -1) {

                                li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '"><img src="../../../../Content/images/zip@2x.png"/></div>';

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

                            watch();


                        }

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



        var item_c = data.FormDataSet.建设公司_家装销售订单提报_子表;
        for (var i = 0; i < item_c.length; i++){
            itemidArr.push(item_c[i].itemid);
            var li = '<div id="mx" class="mui-card">';
            li = li + '    <div class="mui-input-row itemtitle">';
            li = li + '       <label>明细列表项</label>';
            li = li + '       <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>';
            li = li + '    </div>';
            li = li + '     <div class="mui-input-row">';
            li = li + '        <label for="fxm">项目<i style="color:red;">*</i></label>';
            li = li + '        <input type="text" id="fxm" name="fxm" readonly="readonly" value="' + item_c[i].项目 + '"/>';
            li = li + '     </div>';
            li = li + '     <div class="mui-input-row">';
            li = li + '         <label for="fdj">单价<i style="color:red;">*</i></label>';
            li = li + '         <input type="number" id="fdj" name="fdj" readonly="readonly" value="' + item_c[i].单价 + '"/>';
            li = li + '     </div>';
            li = li + '     <div class="mui-input-row">';
            li = li + '          <label for="fsl">数量<i style="color:red;">*</i></label>';
            li = li + '          <input type="number" id="fsl" name="fsl" readonly="readonly" value="' + item_c[i].数量 + '"/>';
            li = li + '     </div>';
            li = li + '     <div class="mui-input-row">';
            li = li + '          <label for="fje">金额</label>';
            li = li + '          <input type="number" id="fje" name="fje" readonly="readonly" value="' + item_c[i].金额 + '"/>';
            li = li + '     </div>';
            li = li + '</div>';
            $("#mxlist").append(li);
            if (flag) {
                $("#mxlist").find("#fdj,#fsl").each(function () {
                    $(this).off('input');
                    $(this).on('input', function () {
                        calcPrice(this);
                    });
                });
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

var fzkzdata = [
    {
        value: '',
        text:'0.7'
    },
    {
        value: '',
        text: '0.75'
    },
    {
        value: '',
        text: '0.8'
    },
    {
        value: '',
        text: '0.85'
    },
    {
        value: '',
        text: '0.9'
    },
    {
        value: '',
        text: '0.95'
    }

];

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
        $("#mxlist").find("span").each(function () {
            $(this).css('display', 'block');
        });
        $("#mxlist").find("#fxm,#fdj,#fsl").each(function () {
            $(this).removeAttr('readonly');
        });
        $('#tjmx').css('display', 'block');
        $("#fjhdate,#fgq,#fgcbm,#fgcmc,#fkhmc,#fkhdh,#fjsr,#fgcsm,#fbz").removeAttr('readonly');

    } else if (NodeName == "sysInform") {
        $("#readD").css("display", "block");
        $("#csd").css("display", "none");

    } else {
        if (typeof (NodeName) != "undefined") {
            $("#approvalD").css("display", "block");
            if (String(NodeName).indexOf('总经理') != -1) {
                $("#fzkz").attr('placeholder', '请选择折扣值');
                var element = document.getElementById('fzkz');

                var picker = new mui.PopPicker();

                picker.setData(fzkzdata);

                element.addEventListener('tap', function () {

                    picker.show(function (items) {

                        element.value = items[0].text;
                        var fzkz = parseFloat(items[0].text);
                        var ftotal = parseFloat($("#ftotal").val());
                        if (isNaN(fzkz)) {
                            fzkz = 1;
                        }
                        var fsjsk = parseFloat(fzkz * ftotal).toFixed(2);
                        $("#fsjsk").val(fsjsk);
                    });

                }, false);
            }
        }
    }
}


function Save() {
    var fname = $("#fname").val();
    var fdate = $("#fdate").val();
    var fjhdate = $("#fjhdate").val();
    var fgq = $("#fgq").val();
    var fcplx = $("#fcplx").val();
    var fxslx = $("#fxslx").val();
    var fgcbm = $("#fgcbm").val();
    var fgcmc = $("#fgcmc").val();
    var fif_zk = $("#fif_zk").val();
    var fkhmc = $("#fkhmc").val();
    var fkhdh = $("#fkhdh").val();
    var fjsr = $("#fjsr").val();
    var fgcsm = $("#fgcsm").val();
    var fzkz = $("#fzkz").val();
    var fsjsk = $("#fsjsk").val();
    var ftotal = $("#ftotal").val();
    var fbz = $("#fbz").val();

    if (!fjhdate) {
        mui.toast('请填写交货日期');
        return;
    }
    if (!fcplx) {
        mui.toast('请选择产品类型');
        return;
    }

    if (!fxslx) {
        mui.toast('请选择销售类型');
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
    if (!fkhmc) {
        mui.toast('请填写客户名称');
        return;
    }
    if (!fkhdh) {
        mui.toast('请填写客户电话');
        return;
    }
    if (!fgcsm) {
        mui.toast('请填写工程说明');
        return;
    }
    if (String(fxslx).indexOf('家装') != -1) {
        if (fjArray.length == 0) {
            mui.toast('请上传附件');
            return;
        }
    } else if (String(fxslx).indexOf('工程') != -1) {
        fif_zk = '';
    }
    var mxflag = false;
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fxm = $(this).find("#fxm").val();
        var fdj = $(this).find("#fdj").val();
        var fsl = $(this).find("#fsl").val();
        var fje = $(this).find("#fje").val();
        if (mxItem(fxm, fdj, fsl, fje) == null) {
            mxflag = true;
            return;
        }
        var mx = mxItem(fxm, fdj, fsl, fje);
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
            xml = xml + '       <ProcessName>建设公司门窗销售订单提报</ProcessName>';
            xml = xml + '         <ProcessVersion>' + version + '</ProcessVersion>';
            xml = xml + '            <DraftGuid></DraftGuid>';
            xml = xml + '             <OwnerMemberFullName>' + BPMOU + '</OwnerMemberFullName>';
            xml = xml + '            <Action>提交</Action>';
            xml = xml + '          <Comment></Comment>';
            xml = xml + '             <InviteIndicateUsers></InviteIndicateUsers>';
            xml = xml + '       </Header>';
            xml = xml + '       <FormData>';

            xml = xml + '  <建设公司_家装销售订单提报_主表>';
            xml = xml + '  <单号>自动生成</单号>';
            xml = xml + ' <业务员>' + fname + '</业务员>';
            xml = xml + ' <申请日期>' + fdate + '</申请日期>';
            xml = xml + '<交货日期>' + fjhdate + '</交货日期>';
            xml = xml + ' <工期>' + fgq + '</工期>';
            xml = xml + '  <产品类型>' + fcplx + '</产品类型>';
            xml = xml + '  <销售类型>' + fxslx + '</销售类型>';
            xml = xml + ' <工程编码>' + fgcbm + '</工程编码>';
            xml = xml + ' <工程名称>' + fgcmc + '</工程名称>';
            xml = xml + ' <是否折扣>' + fif_zk + '</是否折扣>';
            xml = xml + '   <客户姓名>' + fkhmc + '</客户姓名>';
            xml = xml + ' <客户电话>' + fkhdh + '</客户电话>';
            xml = xml + '  <介绍人>' + fjsr + '</介绍人>';
            xml = xml + '  <工程说明>' + fgcsm + '</工程说明>';
            xml = xml + ' <折扣值>' + fzkz + '</折扣值>';
            xml = xml + ' <实际收款>' + fsjsk + '</实际收款>';
            xml = xml + '  <合计金额>' + ftotal + '</合计金额>';
            xml = xml + ' <备注>' + fbz + '</备注>';
            if (fjArray.length != 0) {
                xml = xml + '  <附件>' + fjArray.toString().replace(",",";") + '</附件>';
            } else {
                xml = xml + '  <附件></附件>';
            }
            
            xml = xml + '</建设公司_家装销售订单提报_主表>';

            for (var i = 0; i < mxlistArr.length;i++){
                xml = xml + ' <建设公司_家装销售订单提报_子表>';
                xml = xml + '  <RelationRowGuid>'+(i+1)+'</RelationRowGuid>';
                xml = xml + ' <RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + '  <序号>' + (i + 1) + '</序号>';
                xml = xml + ' <项目>' + mxlistArr[i].fxm + '</项目>';
                xml = xml + ' <单价>' + mxlistArr[i].fdj + '</单价>';
                xml = xml + '  <数量>' + mxlistArr[i].fsl + '</数量>';
                xml = xml + ' <金额>' + mxlistArr[i].fje + '</金额>';
                xml = xml + ' </建设公司_家装销售订单提报_子表>';
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
    var fjhdate = $("#fjhdate").val();
    var fgq = $("#fgq").val();
    var fcplx = $("#fcplx").val();
    var fxslx = $("#fxslx").val();
    var fgcbm = $("#fgcbm").val();
    var fgcmc = $("#fgcmc").val();
    var fif_zk = $("#fif_zk").val();
    var fkhmc = $("#fkhmc").val();
    var fkhdh = $("#fkhdh").val();
    var fjsr = $("#fjsr").val();
    var fgcsm = $("#fgcsm").val();
    var fzkz = $("#fzkz").val();
    var fsjsk = $("#fsjsk").val();
    var ftotal = $("#ftotal").val();
    var fbz = $("#fbz").val();

    if (!fjhdate) {
        mui.toast('请填写交货日期');
        return;
    }
    if (!fcplx) {
        mui.toast('请选择产品类型');
        return;
    }

    if (!fxslx) {
        mui.toast('请选择销售类型');
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
    if (!fkhmc) {
        mui.toast('请填写客户名称');
        return;
    }
    if (!fkhdh) {
        mui.toast('请填写客户电话');
        return;
    }
    if (!fgcsm) {
        mui.toast('请填写工程说明');
        return;
    }
    if (String(fxslx).indexOf('家装') != -1) {
        if (fjArray.length == 0) {
            mui.toast('请上传附件');
            return;
        }
    } else if (String(fxslx).indexOf('工程') != -1) {
        fif_zk = '';
    }
    var mxflag = false;
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fxm = $(this).find("#fxm").val();
        var fdj = $(this).find("#fdj").val();
        var fsl = $(this).find("#fsl").val();
        var fje = $(this).find("#fje").val();
        if (mxItem(fxm, fdj, fsl, fje) == null) {
            mxflag = true;
            return;
        }
        var mx = mxItem(fxm, fdj, fsl, fje);
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

            xml = xml + '  <建设公司_家装销售订单提报_主表>';
            xml = xml + '  <单号>' + fbillno + '</单号>';
            xml = xml + ' <业务员>' + fname + '</业务员>';
            xml = xml + ' <申请日期>' + fdate + '</申请日期>';
            xml = xml + '<交货日期>' + fjhdate + '</交货日期>';
            xml = xml + ' <工期>' + fgq + '</工期>';
            xml = xml + '  <产品类型>' + fcplx + '</产品类型>';
            xml = xml + '  <销售类型>' + fxslx + '</销售类型>';
            xml = xml + ' <工程编码>' + fgcbm + '</工程编码>';
            xml = xml + ' <工程名称>' + fgcmc + '</工程名称>';
            xml = xml + ' <是否折扣>' + fif_zk + '</是否折扣>';
            xml = xml + '   <客户姓名>' + fkhmc + '</客户姓名>';
            xml = xml + ' <客户电话>' + fkhdh + '</客户电话>';
            xml = xml + '  <介绍人>' + fjsr + '</介绍人>';
            xml = xml + '  <工程说明>' + fgcsm + '</工程说明>';
            xml = xml + ' <折扣值>' + fzkz + '</折扣值>';
            xml = xml + ' <实际收款>' + fsjsk + '</实际收款>';
            xml = xml + '  <合计金额>' + ftotal + '</合计金额>';
            xml = xml + ' <备注>' + fbz + '</备注>';
            if (fjArray.length != 0) {
                xml = xml + '  <附件>' + fjArray.toString().replace(",", ";") + '</附件>';
            } else {
                xml = xml + '  <附件></附件>';
            }

            xml = xml + '</建设公司_家装销售订单提报_主表>';

            for (var i = 0; i < mxlistArr.length; i++) {
                xml = xml + ' <建设公司_家装销售订单提报_子表>';
                xml = xml + '  <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml = xml + ' <RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + '  <序号>' + (i + 1) + '</序号>';
                xml = xml + ' <项目>' + mxlistArr[i].fxm + '</项目>';
                xml = xml + ' <单价>' + mxlistArr[i].fdj + '</单价>';
                xml = xml + '  <数量>' + mxlistArr[i].fsl + '</数量>';
                xml = xml + ' <金额>' + mxlistArr[i].fje + '</金额>';
                xml = xml + ' </建设公司_家装销售订单提报_子表>';
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
    var fjhdate = $("#fjhdate").val();
    var fgq = $("#fgq").val();
    var fcplx = $("#fcplx").val();
    var fxslx = $("#fxslx").val();
    var fgcbm = $("#fgcbm").val();
    var fgcmc = $("#fgcmc").val();
    var fif_zk = $("#fif_zk").val();
    var fkhmc = $("#fkhmc").val();
    var fkhdh = $("#fkhdh").val();
    var fjsr = $("#fjsr").val();
    var fgcsm = $("#fgcsm").val();
    var fzkz = $("#fzkz").val();
    var fsjsk = $("#fsjsk").val();
    var ftotal = $("#ftotal").val();
    var fbz = $("#fbz").val();

  
   
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fxm = $(this).find("#fxm").val();
        var fdj = $(this).find("#fdj").val();
        var fsl = $(this).find("#fsl").val();
        var fje = $(this).find("#fje").val();
      
        var mx = mxItem(fxm, fdj, fsl, fje);
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

            xml = xml + '  <建设公司_家装销售订单提报_主表>';
            xml = xml + '  <单号>' + fbillno + '</单号>';
            xml = xml + ' <业务员>' + fname + '</业务员>';
            xml = xml + ' <申请日期>' + fdate + '</申请日期>';
            xml = xml + '<交货日期>' + fjhdate + '</交货日期>';
            xml = xml + ' <工期>' + fgq + '</工期>';
            xml = xml + '  <产品类型>' + fcplx + '</产品类型>';
            xml = xml + '  <销售类型>' + fxslx + '</销售类型>';
            xml = xml + ' <工程编码>' + fgcbm + '</工程编码>';
            xml = xml + ' <工程名称>' + fgcmc + '</工程名称>';
            xml = xml + ' <是否折扣>' + fif_zk + '</是否折扣>';
            xml = xml + '   <客户姓名>' + fkhmc + '</客户姓名>';
            xml = xml + ' <客户电话>' + fkhdh + '</客户电话>';
            xml = xml + '  <介绍人>' + fjsr + '</介绍人>';
            xml = xml + '  <工程说明>' + fgcsm + '</工程说明>';
            xml = xml + ' <折扣值>' + fzkz + '</折扣值>';
            xml = xml + ' <实际收款>' + fsjsk + '</实际收款>';
            xml = xml + '  <合计金额>' + ftotal + '</合计金额>';
            xml = xml + ' <备注>' + fbz + '</备注>';
            if (fjArray.length != 0) {
                xml = xml + '  <附件>' + fjArray.toString().replace(",", ";") + '</附件>';
            } else {
                xml = xml + '  <附件></附件>';
            }

            xml = xml + '</建设公司_家装销售订单提报_主表>';

            for (var i = 0; i < mxlistArr.length; i++) {
                xml = xml + ' <建设公司_家装销售订单提报_子表>';
                xml = xml + '  <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml = xml + ' <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
                xml = xml + '  <序号>' + (i + 1) + '</序号>';
                xml = xml + ' <项目>' + mxlistArr[i].fxm + '</项目>';
                xml = xml + ' <单价>' + mxlistArr[i].fdj + '</单价>';
                xml = xml + '  <数量>' + mxlistArr[i].fsl + '</数量>';
                xml = xml + ' <金额>' + mxlistArr[i].fje + '</金额>';
                xml = xml + ' </建设公司_家装销售订单提报_子表>';
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
    var fjhdate = $("#fjhdate").val();
    var fgq = $("#fgq").val();
    var fcplx = $("#fcplx").val();
    var fxslx = $("#fxslx").val();
    var fgcbm = $("#fgcbm").val();
    var fgcmc = $("#fgcmc").val();
    var fif_zk = $("#fif_zk").val();
    var fkhmc = $("#fkhmc").val();
    var fkhdh = $("#fkhdh").val();
    var fjsr = $("#fjsr").val();
    var fgcsm = $("#fgcsm").val();
    var fzkz = $("#fzkz").val();
    var fsjsk = $("#fsjsk").val();
    var ftotal = $("#ftotal").val();
    var fbz = $("#fbz").val();

    var nodeName = $("#nodeName").val();
    if (String(nodeName) == '总经理') {
        if (String( fif_zk)== '是'){
            if (!fzkz) {
                mui.toast('请填写折扣值');
                return;
            }
        }
    }


    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fxm = $(this).find("#fxm").val();
        var fdj = $(this).find("#fdj").val();
        var fsl = $(this).find("#fsl").val();
        var fje = $(this).find("#fje").val();

        var mx = mxItem(fxm, fdj, fsl, fje);
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

            xml = xml + '  <建设公司_家装销售订单提报_主表>';
            xml = xml + '  <单号>' + fbillno + '</单号>';
            xml = xml + ' <业务员>' + fname + '</业务员>';
            xml = xml + ' <申请日期>' + fdate + '</申请日期>';
            xml = xml + '<交货日期>' + fjhdate + '</交货日期>';
            xml = xml + ' <工期>' + fgq + '</工期>';
            xml = xml + '  <产品类型>' + fcplx + '</产品类型>';
            xml = xml + '  <销售类型>' + fxslx + '</销售类型>';
            xml = xml + ' <工程编码>' + fgcbm + '</工程编码>';
            xml = xml + ' <工程名称>' + fgcmc + '</工程名称>';
            xml = xml + ' <是否折扣>' + fif_zk + '</是否折扣>';
            xml = xml + '   <客户姓名>' + fkhmc + '</客户姓名>';
            xml = xml + ' <客户电话>' + fkhdh + '</客户电话>';
            xml = xml + '  <介绍人>' + fjsr + '</介绍人>';
            xml = xml + '  <工程说明>' + fgcsm + '</工程说明>';
            xml = xml + ' <折扣值>' + fzkz + '</折扣值>';
            xml = xml + ' <实际收款>' + fsjsk + '</实际收款>';
            xml = xml + '  <合计金额>' + ftotal + '</合计金额>';
            xml = xml + ' <备注>' + fbz + '</备注>';
            if (fjArray.length != 0) {
                xml = xml + '  <附件>' + fjArray.toString().replace(",", ";") + '</附件>';
            } else {
                xml = xml + '  <附件></附件>';
            }

            xml = xml + '</建设公司_家装销售订单提报_主表>';

            for (var i = 0; i < mxlistArr.length; i++) {
                xml = xml + ' <建设公司_家装销售订单提报_子表>';
                xml = xml + '  <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml = xml + ' <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
                xml = xml + '  <序号>' + (i + 1) + '</序号>';
                xml = xml + ' <项目>' + mxlistArr[i].fxm + '</项目>';
                xml = xml + ' <单价>' + mxlistArr[i].fdj + '</单价>';
                xml = xml + '  <数量>' + mxlistArr[i].fsl + '</数量>';
                xml = xml + ' <金额>' + mxlistArr[i].fje + '</金额>';
                xml = xml + ' </建设公司_家装销售订单提报_子表>';
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

        xml = xml + '  <建设公司_家装销售订单提报_主表>';
        xml = xml + '  <单号>' + fbillno + '</单号>';
        xml = xml + ' <业务员>' + fname + '</业务员>';
        xml = xml + ' <申请日期>' + fdate + '</申请日期>';
        xml = xml + '<交货日期>' + fjhdate + '</交货日期>';
        xml = xml + ' <工期>' + fgq + '</工期>';
        xml = xml + '  <产品类型>' + fcplx + '</产品类型>';
        xml = xml + '  <销售类型>' + fxslx + '</销售类型>';
        xml = xml + ' <工程编码>' + fgcbm + '</工程编码>';
        xml = xml + ' <工程名称>' + fgcmc + '</工程名称>';
        xml = xml + ' <是否折扣>' + fif_zk + '</是否折扣>';
        xml = xml + '   <客户姓名>' + fkhmc + '</客户姓名>';
        xml = xml + ' <客户电话>' + fkhdh + '</客户电话>';
        xml = xml + '  <介绍人>' + fjsr + '</介绍人>';
        xml = xml + '  <工程说明>' + fgcsm + '</工程说明>';
        xml = xml + ' <折扣值>' + fzkz + '</折扣值>';
        xml = xml + ' <实际收款>' + fsjsk + '</实际收款>';
        xml = xml + '  <合计金额>' + ftotal + '</合计金额>';
        xml = xml + ' <备注>' + fbz + '</备注>';
        if (fjArray.length != 0) {
            xml = xml + '  <附件>' + fjArray.toString().replace(",", ";") + '</附件>';
        } else {
            xml = xml + '  <附件></附件>';
        }

        xml = xml + '</建设公司_家装销售订单提报_主表>';

        for (var i = 0; i < mxlistArr.length; i++) {
            xml = xml + ' <建设公司_家装销售订单提报_子表>';
            xml = xml + '  <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
            xml = xml + ' <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
            xml = xml + '  <序号>' + (i + 1) + '</序号>';
            xml = xml + ' <项目>' + mxlistArr[i].fxm + '</项目>';
            xml = xml + ' <单价>' + mxlistArr[i].fdj + '</单价>';
            xml = xml + '  <数量>' + mxlistArr[i].fsl + '</数量>';
            xml = xml + ' <金额>' + mxlistArr[i].fje + '</金额>';
            xml = xml + ' </建设公司_家装销售订单提报_子表>';
        }

        xml = xml + '</FormData>';
        xml = xml + '</XForm>';
        PostXml(xml);
    }


}