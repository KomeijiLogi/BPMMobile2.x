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
    upload();

    var xml = '<?xml version= "1.0" ?>';
    xml = xml + '   <Requests>';
    xml = xml + '   <Params>';
    xml = xml + '       <Method>GetFormPostData</Method>';
    xml = xml + '       <ProcessName>建设公司手机燃油费报销</ProcessName>';
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
        $("#fname").val(item.报销人);
        $("#fdept").val(item.部门名称);
        $("#fcompany").val(item.公司名称);
        $("#fno").val(item.报销人工号);

    }).fail(function (e) {

    });
}

function tapEvent() {
    var fzwleveldata = [
        {
            value: '',
            text:'总监'
        },
        {
            value: '',
            text: '部门经理'
        },
        {
            value: '',
            text: '科员、主管'
        }
    ];

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

    var ffyxmdata = [

        {
            value: '',
            text:'手机'
        },
        {
            value: '',
            text: '燃油'
        },
        {
            value: '',
            text: '手机+燃油'
        }
    ];

    var element = document.getElementById('ffyxm');

    var picker = new mui.PopPicker();

    picker.setData(ffyxmdata);

    element.addEventListener('tap', function () {

        picker.show(function (items) {

            element.value = items[0].text;
            if (String(items[0].text).indexOf('手机') != -1) {
                $("#group_tel").css('display', 'block');
            } else {
                $("#group_tel").css('display', 'none');
            }
            if (String(items[0].text).indexOf('燃油')!=-1) {
                $("#group_oil").css('display', 'block');
            } else {
                $("#group_oil").css('display', 'none');
            }

        });

    }, false);

    $("#tjmx_tel").on('tap', function () {

        var li = '<div id="mx" class="mui-card">';
        li = li + '    <div class="mui-input-row itemtitle">';
        li = li + '       <label>明细列表项</label>';
        li = li + '       <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>';
        li = li + '    </div>';
        li = li + '     <div class="mui-input-row">';
        li = li + '        <label for="fzwlevel">职务级别<i style="color:red;">*</i></label>';
        li = li + '        <input type="text" id="fzwlevel" name="fzwlevel" readonly="readonly" placeholder="请选择职务级别"/>';
        li = li + '     </div>';
        li = li + '    <div class="mui-input-row">';
        li = li + '       <label for="ftel">手机号<i style="color:red;">*</i></label>';
        li = li + '       <input type="tel" id="ftel" name="ftel" placeholder="请填写手机号"/>';
        li = li + '    </div>';
        li = li + '    <div class="mui-input-row">';
        li = li + '       <label for="fmonth">申请月数<i style="color:red;">*</i></label>';
        li = li + '       <input type="text" id="fmonth" name="fmonth" readonly="readonly" placeholder="请选择申请月数"/>';
        li = li + '    </div>';
        li = li + '    <div class="mui-input-row">';
        li = li + '        <label for="fbxje">报销金额<i style="color:red;">*</i></label>';
        li = li + '        <input type="number" id="fbxje" name="fbxje" placeholder="请填写报销金额"/>';
        li = li + '    </div>';
        li = li + '    <div class="mui-input-row">';
        li = li + '        <label for="fbxqj">报销期间<i style="color:red;">*</i></label>';
        li = li + '        <input type="text" id="fbxqj" name="fbxqj" placeholder="请填写报销期间"/>';
        li = li + '    </div>';
        li = li + '</div>';
        $("#mxlist_tel").append(li);
        showPickerByZepto('#mxlist_tel', '#fzwlevel', fzwleveldata);
        showPickerByZepto('#mxlist_tel', '#fmonth', fmonthdata);
        $("#mxlist_tel").find("#fbxje").each(function () {
            $(this).on('input', function () {

                calcPrice();
            });
        });

    });
    $("#tjmx_oil").on('tap', function () {
        var li = '<div id="mx" class="mui-card">';
        li = li + '    <div class="mui-input-row itemtitle">';
        li = li + '       <label>明细列表项</label>';
        li = li + '       <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>';
        li = li + '    </div>';
        li = li + '    <div class="mui-input-row">';
        li = li + '        <label for="fzwlevel">职务级别<i style="color:red;">*</i></label>';
        li = li + '        <input type="text" id="fzwlevel" name="fzwlevel" readonly="readonly" placeholder="请选择职务级别"/>';
        li = li + '    </div>';
        li = li + '    <div class="mui-input-row">';
        li = li + '        <label for="fcph">车牌号<i style="color:red;">*</i></label>';
        li= li + '       <input type="text" id="fcph" name="fcph" placeholder="请填写车牌号" />';
        li = li + '    </div>';
        li = li + '    <div class="mui-input-row">';
        li = li + '        <label for="fmonth">申请月数<i style="color:red;">*</i></label>';
        li = li + '        <input type="text" id="fmonth" name="fmonth" readonly="readonly" placeholder="请选择申请月数"/>';
        li = li + '    </div>';
        li = li + '    <div class="mui-input-row">';
        li = li + '        <label for="fbxje">报销金额<i style="color:red;">*</i></label>';
        li = li + '        <input type="number" id="fbxje" name="fbxje" placeholder="请填写报销金额"/>';
        li = li + '    </div>';
        li = li + '    <div class="mui-input-row">';
        li = li + '        <label for="fbxqj">报销期间<i style="color:red;">*</i></label>';
        li = li + '         <input type="text" id="fbxqj" name="fbxqj" placeholder="请填写报销期间"/>';
        li = li + '    </div>';
        li = li + '</div>';
        $("#mxlist_oil").append(li);
        showPickerByZepto('#mxlist_oil', '#fzwlevel', fzwleveldata);
        showPickerByZepto('#mxlist_oil', '#fmonth', fmonthdata);
        $("#mxlist_oil").find("#fbxje").each(function () {
            $(this).on('input', function () {

                calcPrice();
            });
        });
    });
}

function calcPrice() {

    var ftotal = 0;
    var ftotal_tel = 0;
    var ftotal_oil = 0;

    $("#mxlist_tel").find("#fbxje").each(function () {
        var fbxje = parseFloat($(this).val());
        if (isNaN(fbxje)) {
            fbxje = 0;
        }
        ftotal_tel = ftotal_tel + fbxje;
        ftotal = ftotal + fbxje;
    });
    $("#mxlist_oil").find("#fbxje").each(function () {
        var fbxje = parseFloat($(this).val());
        if (isNaN(fbxje)) {
            fbxje = 0;
        }
        ftotal_oil = ftotal_oil + fbxje;
        ftotal = ftotal + fbxje;
    });
    $("#ftotal_tel").val(ftotal_tel);
    $("#ftotal_oil").val(ftotal_oil);
    $("#ftotal").val(ftotal);
    $("#ftotal_dx").val(atoc(ftotal));
    $("#ftotal_tel_dx").val(atoc(ftotal_tel));
    $("#ftotal_oil_dx").val(atoc(ftotal_oil));

}

function mxItem_tel(fzwlevel, ftel, fmonth, fbxje, fbxqj) {

    var mx = Object.create({
        fzwlevel: fzwlevel,
        ftel: ftel,
        fmonth: fmonth,
        fbxje: fbxje,
        fbxqj: fbxqj,
        _check: function () {
            if (!fzwlevel) {
                mui.toast('请选择职务级别');
                return null;
            }
            if (!ftel) {
                mui.toast('请填写手机号码');
                return null;
            }
            if (!fmonth) {
                mui.toast('请选择申请月数');
                return null;
            }
            if (!fbxje) {
                mui.toast('请填写报销金额');
                return null;
            }
            if (!fbxqj) {
                mui.toast('请填写报销期间');
                return null;
            }
            return mx;
        },
        get getObj() {

            return mx;
        }
    });
    if (mx._check() == null) {
        return null;
    } else {
        return mx;
    }

}

function mxItem_oil(fzwlevel, fcph, fmonth, fbxje, fbxqj) {

    var mx = Object.create({
        fzwlevel: fzwlevel,
        fcph: fcph,
        fmonth: fmonth,
        fbxje: fbxje,
        fbxqj: fbxqj,
        _check: function () {
            if (!fzwlevel) {
                mui.toast('请选择职务级别');
                return null;
            }
            if (!fcph) {
                mui.toast('请填写车牌号');
                return null;
            }
            if (!fmonth) {
                mui.toast('请填写申请月数');
                return null;
            }
            if (!fbxje) {
                mui.toast('请填写报销金额');
                return null;
            }
            if (!fbxqj) {
                mui.toast('请填写报销期间');
                return null;
            }
            return mx;

        },
        get getObj() {
            return mx;
        }
        

    });
    if (mx._check() == null) {
        return null;
    } else {
        return mx;
    }

}


var itemidArr2 = new Array();
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
        var item = data.FormDataSet.建设公司_手机燃油费报销_主表[0];
        if (flag) {

            $("#taskId").val(item.TaskID);
            $("#stepId").val(stepId);
            $("#fbillno").val(item.单号);

        }
        if (item.上传票据 != null && item.上传票据 != "") {
            var fjtmp = (String)(item.上传票据);

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
        $("#fname").val(item.报销人);
        $("#fno").val(item.报销人工号);
        $("#fdate").val(FormatterTimeYMS(item.报销日期));
        $("#fdept").val(item.部门名称);
        $("#fcompany").val(item.公司名称);
        $("#ffyxm").val(item.费用项目);
        $("#ftotal").val(item.总报销金额);
        $("#ftotal_dx").val(item.大写金额);
        $("#fbz").val(item.备注);
        $("#ftotal_tel").val(item.手机费_报销合计);
        $("#ftotal_tel_dx").val(item.手机费_大写金额);
        $("#fdjs_tel").val(item.手机费_单据数);
        $("#ftotal_oil").val(item.燃油费_报销合计);
        $("#ftotal_oil_dx").val(item.燃油费_大写金额);
        $("#fdjs_oil").val(item.燃油费_单据数);

        var item_b1 = data.FormDataSet.建设公司_手机燃油费报销_子表手机;
        if (String(item.费用项目).indexOf('手机')!=-1) {
            for (var i = 0; i < item_b1.length; i++) {
                itemidArr.push(item_b1[i].itemid);
                var li = '<div id="mx" class="mui-card">';
                li = li + '    <div class="mui-input-row itemtitle">';
                li = li + '       <label>手机费列表项</label>';
                li = li + '       <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>';
                li = li + '    </div>';
                li = li + '     <div class="mui-input-row">';
                li = li + '        <label for="fzwlevel">职务级别<i style="color:red;">*</i></label>';
                li = li + '        <input type="text" id="fzwlevel" name="fzwlevel" readonly="readonly" value="' + item_b1[i].职务级别 + '"/>';
                li = li + '     </div>';
                li = li + '    <div class="mui-input-row">';
                li = li + '       <label for="ftel">手机号<i style="color:red;">*</i></label>';
                li = li + '       <input type="tel" id="ftel" name="ftel" readonly="readonly" value="' + item_b1[i].手机号 + '"/>';
                li = li + '    </div>';
                li = li + '    <div class="mui-input-row">';
                li = li + '       <label for="fmonth">申请月数<i style="color:red;">*</i></label>';
                li = li + '       <input type="text" id="fmonth" name="fmonth" readonly="readonly" value="' + item_b1[i].申请月数 + '"/>';
                li = li + '    </div>';
                li = li + '    <div class="mui-input-row">';
                li = li + '        <label for="fbxje">报销金额<i style="color:red;">*</i></label>';
                li = li + '        <input type="number" id="fbxje" name="fbxje" readonly="readonly" value="' + item_b1[i].报销金额 + '"/>';
                li = li + '    </div>';
                li = li + '    <div class="mui-input-row">';
                li = li + '        <label for="fbxqj">报销期间<i style="color:red;">*</i></label>';
                li = li + '        <input type="text" id="fbxqj" name="fbxqj" readonly="readonly" value="' + item_b1[i].报销期间 + '"/>';
                li = li + '    </div>';
                li = li + '</div>';
                $("#mxlist_tel").append(li);
                if (flag) {
                    $("#mxlist_tel").find("#fbxje").each(function () {
                        $(this).on('input', function () {

                            calcPrice();
                        });
                    });
                }
               
            }
        }

        


        var item_b2 = data.FormDataSet.建设公司_手机燃油费报销_子表燃油;
        if (String(item.费用项目).indexOf('燃油') != -1) {
            for (var i = 0; i < item_b2.length; i++) {
                itemidArr2.push(item_b2[i].itemid);
                var li = '<div id="mx" class="mui-card">';
                li = li + '    <div class="mui-input-row itemtitle">';
                li = li + '       <label>燃油费列表项</label>';
                li = li + '       <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>';
                li = li + '    </div>';
                li = li + '    <div class="mui-input-row">';
                li = li + '        <label for="fzwlevel">职务级别<i style="color:red;">*</i></label>';
                li = li + '        <input type="text" id="fzwlevel" name="fzwlevel" readonly="readonly" value="' + item_b2[i].职务级别 + '"/>';
                li = li + '    </div>';
                li = li + '    <div class="mui-input-row">';
                li = li + '        <label for="fcph">车牌号<i style="color:red;">*</i></label>';
                li = li + '       <input type="text" id="fcph" name="fcph" readonly="readonly" value="' + item_b2[i].车牌号 + '"/>';
                li = li + '    </div>';
                li = li + '    <div class="mui-input-row">';
                li = li + '        <label for="fmonth">申请月数<i style="color:red;">*</i></label>';
                li = li + '        <input type="text" id="fmonth" name="fmonth" readonly="readonly" value="' + item_b2[i].申请月数 + '"/>';
                li = li + '    </div>';
                li = li + '    <div class="mui-input-row">';
                li = li + '        <label for="fbxje">报销金额<i style="color:red;">*</i></label>';
                li = li + '        <input type="number" id="fbxje" name="fbxje" readonly="readonly" value="' + item_b2[i].报销金额 + '"/>';
                li = li + '    </div>';
                li = li + '    <div class="mui-input-row">';
                li = li + '        <label for="fbxqj">报销期间<i style="color:red;">*</i></label>';
                li = li + '         <input type="text" id="fbxqj" name="fbxqj" readonly="readonly" value="' + item_b2[i].报销期间 + '"/>';
                li = li + '    </div>';
                li = li + '</div>';
                $("#mxlist_oil").append(li);
                if (flag) {
                    $("#mxlist_oil").find("#fbxje").each(function () {
                        $(this).on('input', function () {

                            calcPrice();
                        });
                    });
                }
               
            }
        }
        if (String(item.费用项目).indexOf('手机') != -1) {
            $("#group_tel").css('display', 'block');
        } else {
            $("#group_tel").css('display', 'none');
        }
        if (String(item.费用项目).indexOf('燃油') != -1) {
            $("#group_oil").css('display', 'block');
        } else {
            $("#group_oil").css('display', 'none');
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
        $("#mxlist_tel,#mxlist_oil").find("#fbxje").each(function () {
            $(this).on('input', function () {

                calcPrice();
            });
        });
        $("#mxlist_tel,#mxlist_oil").find('span').each(function () {
            $(this).css('display', 'block');
        });
        $("#mxlist_tel").find("#ftel,#fbxje,#fbxqj").each(function () {
            $(this).removeAttr('readonly');
        });
        $("#mxlist_oil").find("#fcph,#fbxje,#fbxqj").each(function () {
            $(this).removeAttr('readonly');
        });
        $("#fbz").removeAttr('readonly');
        showPickerByZepto('#mxlist_tel', '#fzwlevel', fzwleveldata);
        showPickerByZepto('#mxlist_tel', '#fmonth', fmonthdata);
        showPickerByZepto('#mxlist_oil', '#fzwlevel', fzwleveldata);
        showPickerByZepto('#mxlist_oil', '#fmonth', fmonthdata);
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
    var fno = $("#fno").val();
    var fdate = $("#fdate").val();
    var fdept = $("#fdept").val();
    var fcompany = $("#fcompany").val();
    var ffyxm = $("#ffyxm").val();
    var ftotal = $("#ftotal").val();
    var ftotal_dx = $("#ftotal_dx").val();
    var fbz = $("#fbz").val();


    
    var mxflag = false;
    var mxlistArr_tel = new Array();

    var ftotal_tel = $("#ftotal_tel").val();
    var ftotal_tel_dx = $("#ftotal_tel_dx").val();
    var fdjs_tel = $("#fdjs_tel").val();

    $("#mxlist_tel").find("#mx").each(function () {
        var fzwlevel = $(this).find("#fzwlevel").val();
        var ftel = $(this).find("#ftel").val();
        var fmonth = $(this).find("#fmonth").val();
        var fbxje = $(this).find("#fbxje").val();
        var fbxqj = $(this).find("#fbxqj").val();

        if (mxItem_tel(fzwlevel, ftel, fmonth, fbxje, fbxqj) == null) {
            mxflag = true;
            return;
        }
        var mx = mxItem_tel(fzwlevel, ftel, fmonth, fbxje, fbxqj);
        mxlistArr_tel.push(mx);
    });

    var mxlistArr_oil = new Array();

    $("#mxlist_oil").find("#mx").each(function () {

        var fzwlevel = $(this).find("#fzwlevel").val();
        var fcph = $(this).find("#fcph").val();
        var fmonth = $(this).find("#fmonth").val();
        var fbxje = $(this).find("#fbxje").val();
        var fbxqj = $(this).find("#fbxqj").val();

        if (mxItem_oil(fzwlevel, fcph, fmonth, fbxje, fbxqj) == null) {
            mxflag = true;
            return;
        }
        var mx = mxItem_oil(fzwlevel, fcph, fmonth, fbxje, fbxqj);
        mxlistArr_oil.push(mx);
    });

    var ftotal_oil = $("#ftotal_oil").val();
    var ftotal_oil_dx = $("#ftotal_oil_dx").val();
    var fdjs_oil = $("#fdjs_oil").val();
    if (mxflag) {
        return;
    }


    if (!ffyxm) {
        mui.toast('请选择费用项目');
        return;
    }
    if (String(ffyxm).indexOf('手机') != -1) {
        if (!fdjs_tel) {
            mui.toast('请填写单据数');
            return;
        }
    }
    if (String(ffyxm).indexOf('燃油') != -1) {
        if (!fdjs_oil) {
            mui.toast('请填写单据数');
            return;
        }
    }
    if (fjArray.length == 0) {
        mui.toast('请上传附件');
        return;
    }

    var btnArry = ["取消", "确定"];
    mui.confirm('即将提交，是否确定？', '提交确认提醒', btnArry, function (e) {
        if (e.index == 1) {
            var xml = '<?xml version= "1.0" ?>';
            xml = xml + '   <XForm>';
            xml = xml + '         <Header>';
            xml = xml + '        <Method>Post</Method>';
            xml = xml + '       <ProcessName>建设公司手机燃油费报销</ProcessName>';
            xml = xml + '         <ProcessVersion>' + version + '</ProcessVersion>';
            xml = xml + '            <DraftGuid></DraftGuid>';
            xml = xml + '             <OwnerMemberFullName>' + BPMOU + '</OwnerMemberFullName>';
            xml = xml + '            <Action>提交</Action>';
            xml = xml + '          <Comment></Comment>';
            xml = xml + '             <InviteIndicateUsers></InviteIndicateUsers>';
            xml = xml + '       </Header>';
            xml = xml + '       <FormData>';

            xml = xml + '   <建设公司_手机燃油费报销_主表>';
            xml = xml + '    <单号>自动生成</单号>';
            xml = xml + '   <报销人>' + fname + '</报销人>';
            xml = xml + '   <报销人工号>' + fno + '</报销人工号>';
            xml = xml + '   <报销日期>' + fdate + '</报销日期>';
            xml = xml + '   <部门名称>' + fdept + '</部门名称>';
            xml = xml + '    <公司名称>' + fcompany + '</公司名称>';
            xml = xml + '    <费用项目>' + ffyxm + '</费用项目>';
            xml = xml + '    <总报销金额>' + ftotal + '</总报销金额>';
            xml = xml + '    <大写金额>' + ftotal_dx + '</大写金额>';
            xml = xml + '   <备注>' + fbz + '</备注>';
            xml = xml + '    <手机费_报销合计>' + ftotal_tel + '</手机费_报销合计>';
            xml = xml + '    <手机费_大写金额>' + ftotal_tel_dx + '</手机费_大写金额>';
            xml = xml + '     <手机费_单据数>' + fdjs_tel + '</手机费_单据数>';
            xml = xml + '     <燃油费_报销合计>' + ftotal_oil + '</燃油费_报销合计>';
            xml = xml + '    <燃油费_大写金额>' + ftotal_oil_dx + '</燃油费_大写金额>';
            xml = xml + '    <燃油费_单据数>' + fdjs_oil + '</燃油费_单据数>';
            if (fjArray.length != 0) {
                xml = xml + '    <上传票据>' + fjArray.toString().replace(",",";") + '</上传票据>';
            } else {
                xml = xml + '    <上传票据></上传票据>';
            }
            
            xml = xml + '  </建设公司_手机燃油费报销_主表>';

            if (mxlistArr_tel.length != 0) {
                for (var i = 0; i < mxlistArr_tel.length; i++) {
                    xml = xml + ' <建设公司_手机燃油费报销_子表手机>';
                    xml = xml + '  <RelationRowGuid>'+(i+1)+'</RelationRowGuid>';
                    xml = xml + ' <RowPrimaryKeys></RowPrimaryKeys>';
                    xml = xml + ' <序号>' + (i + 1) + '</序号>';
                    xml = xml + '  <职务级别>' + mxlistArr_tel[i].fzwlevel + '</职务级别>';
                    xml = xml + ' <手机号>' + mxlistArr_tel[i].ftel + '</手机号>';
                    xml = xml + ' <申请月数>' + mxlistArr_tel[i].fmonth + '</申请月数>';
                    xml = xml + '  <报销金额>' + mxlistArr_tel[i].fbxje + '</报销金额>';
                    xml = xml + '  <报销期间>' + mxlistArr_tel[i].fbxqj + '</报销期间>';
                    xml = xml + ' </建设公司_手机燃油费报销_子表手机>';
                }

            } else {
                xml = xml + ' <建设公司_手机燃油费报销_子表手机>';
                xml = xml + '  <RelationRowGuid>1</RelationRowGuid>';
                xml = xml + ' <RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + ' <序号>1</序号>';
                xml = xml + '  <职务级别></职务级别>';
                xml = xml + ' <手机号></手机号>';
                xml = xml + ' <申请月数>1</申请月数>';
                xml = xml + '  <报销金额></报销金额>';
                xml = xml + '  <报销期间></报销期间>';
                xml = xml + ' </建设公司_手机燃油费报销_子表手机>';
            }
            if (mxlistArr_oil.length != 0) {
                for (var i = 0; i < mxlistArr_oil.length; i++) {
                    xml = xml + ' <建设公司_手机燃油费报销_子表燃油>';
                    xml = xml + '  <RelationRowGuid>' + mxlistArr_tel.length + 1+i + '</RelationRowGuid>';
                    xml = xml + ' <RowPrimaryKeys></RowPrimaryKeys>';
                    xml = xml + ' <序号>' + i + 1 + '</序号>';
                    xml = xml + ' <职务级别>' + mxlistArr_oil[i].fzwlevel + '</职务级别>';
                    xml = xml + ' <车牌号>' + mxlistArr_oil[i].fcph + '</车牌号>';
                    xml = xml + ' <申请月数>' + mxlistArr_oil[i].fmonth + '</申请月数>';
                    xml = xml + ' <报销金额>' + mxlistArr_oil[i].fbxje + '</报销金额>';
                    xml = xml + '  <报销期间>' + mxlistArr_oil[i].fbxqj + '</报销期间>';
                    xml = xml + ' </建设公司_手机燃油费报销_子表燃油>';
                }
            } else {
                xml = xml + ' <建设公司_手机燃油费报销_子表燃油>';
                xml = xml + '  <RelationRowGuid>' + mxlistArr_tel.length+1 + '</RelationRowGuid>';
                xml = xml + ' <RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + ' <序号>1</序号>';
                xml = xml + ' <职务级别></职务级别>';
                xml = xml + ' <车牌号></车牌号>';
                xml = xml + ' <申请月数></申请月数>';
                xml = xml + ' <报销金额></报销金额>';
                xml = xml + '  <报销期间></报销期间>';
                xml = xml + ' </建设公司_手机燃油费报销_子表燃油>';
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
    var fno = $("#fno").val();
    var fdate = $("#fdate").val();
    var fdept = $("#fdept").val();
    var fcompany = $("#fcompany").val();
    var ffyxm = $("#ffyxm").val();
    var ftotal = $("#ftotal").val();
    var ftotal_dx = $("#ftotal_dx").val();
    var fbz = $("#fbz").val();



    var mxflag = false;
    var mxlistArr_tel = new Array();

    var ftotal_tel = $("#ftotal_tel").val();
    var ftotal_tel_dx = $("#ftotal_tel_dx").val();
    var fdjs_tel = $("#fdjs_tel").val();

    $("#mxlist_tel").find("#mx").each(function () {
        var fzwlevel = $(this).find("#fzwlevel").val();
        var ftel = $(this).find("#ftel").val();
        var fmonth = $(this).find("#fmonth").val();
        var fbxje = $(this).find("#fbxje").val();
        var fbxqj = $(this).find("#fbxqj").val();

        if (mxItem_tel(fzwlevel, ftel, fmonth, fbxje, fbxqj) == null) {
            mxflag = true;
            return;
        }
        var mx = mxItem_tel(fzwlevel, ftel, fmonth, fbxje, fbxqj);
        mxlistArr_tel.push(mx);
    });

    var mxlistArr_oil = new Array();

    $("#mxlist_oil").find("#mx").each(function () {

        var fzwlevel = $(this).find("#fzwlevel").val();
        var fcph = $(this).find("#fcph").val();
        var fmonth = $(this).find("#fmonth").val();
        var fbxje = $(this).find("#fbxje").val();
        var fbxqj = $(this).find("#fbxqj").val();

        if (mxItem_oil(fzwlevel, fcph, fmonth, fbxje, fbxqj) == null) {
            mxflag = true;
            return;
        }
        var mx = mxItem_oil(fzwlevel, fcph, fmonth, fbxje, fbxqj);
        mxlistArr_oil.push(mx);
    });

    var ftotal_oil = $("#ftotal_oil").val();
    var ftotal_oil_dx = $("#ftotal_oil_dx").val();
    var fdjs_oil = $("#fdjs_oil").val();
    if (mxflag) {
        return;
    }


    if (!ffyxm) {
        mui.toast('请选择费用项目');
        return;
    }
    if (String(ffyxm).indexOf('手机') != -1) {
        if (!fdjs_tel) {
            mui.toast('请填写单据数');
            return;
        }
    }
    if (String(ffyxm).indexOf('燃油') != -1) {
        if (!fdjs_oil) {
            mui.toast('请填写单据数');
            return;
        }
    }
    if (fjArray.length == 0) {
        mui.toast('请上传附件');
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

            xml = xml + '   <建设公司_手机燃油费报销_主表>';
            xml = xml + '    <单号>' + fbillno + '</单号>';
            xml = xml + '   <报销人>' + fname + '</报销人>';
            xml = xml + '   <报销人工号>' + fno + '</报销人工号>';
            xml = xml + '   <报销日期>' + fdate + '</报销日期>';
            xml = xml + '   <部门名称>' + fdept + '</部门名称>';
            xml = xml + '    <公司名称>' + fcompany + '</公司名称>';
            xml = xml + '    <费用项目>' + ffyxm + '</费用项目>';
            xml = xml + '    <总报销金额>' + ftotal + '</总报销金额>';
            xml = xml + '    <大写金额>' + ftotal_dx + '</大写金额>';
            xml = xml + '   <备注>' + fbz + '</备注>';
            xml = xml + '    <手机费_报销合计>' + ftotal_tel + '</手机费_报销合计>';
            xml = xml + '    <手机费_大写金额>' + ftotal_tel_dx + '</手机费_大写金额>';
            xml = xml + '     <手机费_单据数>' + fdjs_tel + '</手机费_单据数>';
            xml = xml + '     <燃油费_报销合计>' + ftotal_oil + '</燃油费_报销合计>';
            xml = xml + '    <燃油费_大写金额>' + ftotal_oil_dx + '</燃油费_大写金额>';
            xml = xml + '    <燃油费_单据数>' + fdjs_oil + '</燃油费_单据数>';
            if (fjArray.length != 0) {
                xml = xml + '    <上传票据>' + fjArray.toString().replace(",", ";") + '</上传票据>';
            } else {
                xml = xml + '    <上传票据></上传票据>';
            }

            xml = xml + '  </建设公司_手机燃油费报销_主表>';

            if (mxlistArr_tel.length != 0) {
                for (var i = 0; i < mxlistArr_tel.length; i++) {
                    xml = xml + ' <建设公司_手机燃油费报销_子表手机>';
                    xml = xml + '  <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                    xml = xml + ' <RowPrimaryKeys></RowPrimaryKeys>';
                    xml = xml + ' <序号>' + (i + 1) + '</序号>';
                    xml = xml + '  <职务级别>' + mxlistArr_tel[i].fzwlevel + '</职务级别>';
                    xml = xml + ' <手机号>' + mxlistArr_tel[i].ftel + '</手机号>';
                    xml = xml + ' <申请月数>' + mxlistArr_tel[i].fmonth + '</申请月数>';
                    xml = xml + '  <报销金额>' + mxlistArr_tel[i].fbxje + '</报销金额>';
                    xml = xml + '  <报销期间>' + mxlistArr_tel[i].fbxqj + '</报销期间>';
                    xml = xml + ' </建设公司_手机燃油费报销_子表手机>';
                }

            } else {
                xml = xml + ' <建设公司_手机燃油费报销_子表手机>';
                xml = xml + '  <RelationRowGuid>1</RelationRowGuid>';
                xml = xml + ' <RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + ' <序号>1</序号>';
                xml = xml + '  <职务级别></职务级别>';
                xml = xml + ' <手机号></手机号>';
                xml = xml + ' <申请月数>1</申请月数>';
                xml = xml + '  <报销金额></报销金额>';
                xml = xml + '  <报销期间></报销期间>';
                xml = xml + ' </建设公司_手机燃油费报销_子表手机>';
            }
            if (mxlistArr_oil.length != 0) {
                for (var i = 0; i < mxlistArr_oil.length; i++) {
                    xml = xml + ' <建设公司_手机燃油费报销_子表燃油>';
                    xml = xml + '  <RelationRowGuid>' + mxlistArr_tel.length + 1 + i + '</RelationRowGuid>';
                    xml = xml + ' <RowPrimaryKeys></RowPrimaryKeys>';
                    xml = xml + ' <序号>' + i + 1 + '</序号>';
                    xml = xml + ' <职务级别>' + mxlistArr_oil[i].fzwlevel + '</职务级别>';
                    xml = xml + ' <车牌号>' + mxlistArr_oil[i].fcph + '</车牌号>';
                    xml = xml + ' <申请月数>' + mxlistArr_oil[i].fmonth + '</申请月数>';
                    xml = xml + ' <报销金额>' + mxlistArr_oil[i].fbxje + '</报销金额>';
                    xml = xml + '  <报销期间>' + mxlistArr_oil[i].fbxqj + '</报销期间>';
                    xml = xml + ' </建设公司_手机燃油费报销_子表燃油>';
                }
            } else {
                xml = xml + ' <建设公司_手机燃油费报销_子表燃油>';
                xml = xml + '  <RelationRowGuid>' + mxlistArr_tel.length + 1 + '</RelationRowGuid>';
                xml = xml + ' <RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + ' <序号>1</序号>';
                xml = xml + ' <职务级别></职务级别>';
                xml = xml + ' <车牌号></车牌号>';
                xml = xml + ' <申请月数></申请月数>';
                xml = xml + ' <报销金额></报销金额>';
                xml = xml + '  <报销期间></报销期间>';
                xml = xml + ' </建设公司_手机燃油费报销_子表燃油>';
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
    var fno = $("#fno").val();
    var fdate = $("#fdate").val();
    var fdept = $("#fdept").val();
    var fcompany = $("#fcompany").val();
    var ffyxm = $("#ffyxm").val();
    var ftotal = $("#ftotal").val();
    var ftotal_dx = $("#ftotal_dx").val();
    var fbz = $("#fbz").val();



    var mxflag = false;
    var mxlistArr_tel = new Array();

    var ftotal_tel = $("#ftotal_tel").val();
    var ftotal_tel_dx = $("#ftotal_tel_dx").val();
    var fdjs_tel = $("#fdjs_tel").val();

    $("#mxlist_tel").find("#mx").each(function () {
        var fzwlevel = $(this).find("#fzwlevel").val();
        var ftel = $(this).find("#ftel").val();
        var fmonth = $(this).find("#fmonth").val();
        var fbxje = $(this).find("#fbxje").val();
        var fbxqj = $(this).find("#fbxqj").val();

       
        var mx = mxItem_tel(fzwlevel, ftel, fmonth, fbxje, fbxqj);
        mxlistArr_tel.push(mx);
    });

    var mxlistArr_oil = new Array();

    $("#mxlist_oil").find("#mx").each(function () {

        var fzwlevel = $(this).find("#fzwlevel").val();
        var fcph = $(this).find("#fcph").val();
        var fmonth = $(this).find("#fmonth").val();
        var fbxje = $(this).find("#fbxje").val();
        var fbxqj = $(this).find("#fbxqj").val();

      
        var mx = mxItem_oil(fzwlevel, fcph, fmonth, fbxje, fbxqj);
        mxlistArr_oil.push(mx);
    });

    var ftotal_oil = $("#ftotal_oil").val();
    var ftotal_oil_dx = $("#ftotal_oil_dx").val();
    var fdjs_oil = $("#fdjs_oil").val();
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


            xml = xml + '   <建设公司_手机燃油费报销_主表>';
            xml = xml + '    <单号>' + fbillno + '</单号>';
            xml = xml + '   <报销人>' + fname + '</报销人>';
            xml = xml + '   <报销人工号>' + fno + '</报销人工号>';
            xml = xml + '   <报销日期>' + fdate + '</报销日期>';
            xml = xml + '   <部门名称>' + fdept + '</部门名称>';
            xml = xml + '    <公司名称>' + fcompany + '</公司名称>';
            xml = xml + '    <费用项目>' + ffyxm + '</费用项目>';
            xml = xml + '    <总报销金额>' + ftotal + '</总报销金额>';
            xml = xml + '    <大写金额>' + ftotal_dx + '</大写金额>';
            xml = xml + '   <备注>' + fbz + '</备注>';
            xml = xml + '    <手机费_报销合计>' + ftotal_tel + '</手机费_报销合计>';
            xml = xml + '    <手机费_大写金额>' + ftotal_tel_dx + '</手机费_大写金额>';
            xml = xml + '     <手机费_单据数>' + fdjs_tel + '</手机费_单据数>';
            xml = xml + '     <燃油费_报销合计>' + ftotal_oil + '</燃油费_报销合计>';
            xml = xml + '    <燃油费_大写金额>' + ftotal_oil_dx + '</燃油费_大写金额>';
            xml = xml + '    <燃油费_单据数>' + fdjs_oil + '</燃油费_单据数>';
            if (fjArray.length != 0) {
                xml = xml + '    <上传票据>' + fjArray.toString().replace(",", ";") + '</上传票据>';
            } else {
                xml = xml + '    <上传票据></上传票据>';
            }

            xml = xml + '  </建设公司_手机燃油费报销_主表>';

            if (mxlistArr_tel.length != 0) {
                for (var i = 0; i < mxlistArr_tel.length; i++) {
                    xml = xml + ' <建设公司_手机燃油费报销_子表手机>';
                    xml = xml + '  <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                    xml = xml + ' <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
                    xml = xml + ' <序号>' + (i + 1) + '</序号>';
                    xml = xml + '  <职务级别>' + mxlistArr_tel[i].fzwlevel + '</职务级别>';
                    xml = xml + ' <手机号>' + mxlistArr_tel[i].ftel + '</手机号>';
                    xml = xml + ' <申请月数>' + mxlistArr_tel[i].fmonth + '</申请月数>';
                    xml = xml + '  <报销金额>' + mxlistArr_tel[i].fbxje + '</报销金额>';
                    xml = xml + '  <报销期间>' + mxlistArr_tel[i].fbxqj + '</报销期间>';
                    xml = xml + ' </建设公司_手机燃油费报销_子表手机>';
                }

            } else {
                xml = xml + ' <建设公司_手机燃油费报销_子表手机>';
                xml = xml + '  <RelationRowGuid>1</RelationRowGuid>';
                xml = xml + ' <RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + ' <序号>1</序号>';
                xml = xml + '  <职务级别></职务级别>';
                xml = xml + ' <手机号></手机号>';
                xml = xml + ' <申请月数>1</申请月数>';
                xml = xml + '  <报销金额></报销金额>';
                xml = xml + '  <报销期间></报销期间>';
                xml = xml + ' </建设公司_手机燃油费报销_子表手机>';
            }
            if (mxlistArr_oil.length != 0) {
                for (var i = 0; i < mxlistArr_oil.length; i++) {
                    xml = xml + ' <建设公司_手机燃油费报销_子表燃油>';
                    xml = xml + '  <RelationRowGuid>' + mxlistArr_tel.length + 1 + i + '</RelationRowGuid>';
                    xml = xml + ' <RowPrimaryKeys>itemid=' + itemidArr2[i] + '</RowPrimaryKeys>';
                    xml = xml + ' <序号>' + i + 1 + '</序号>';
                    xml = xml + ' <职务级别>' + mxlistArr_oil[i].fzwlevel + '</职务级别>';
                    xml = xml + ' <车牌号>' + mxlistArr_oil[i].fcph + '</车牌号>';
                    xml = xml + ' <申请月数>' + mxlistArr_oil[i].fmonth + '</申请月数>';
                    xml = xml + ' <报销金额>' + mxlistArr_oil[i].fbxje + '</报销金额>';
                    xml = xml + '  <报销期间>' + mxlistArr_oil[i].fbxqj + '</报销期间>';
                    xml = xml + ' </建设公司_手机燃油费报销_子表燃油>';
                }
            } else {
                xml = xml + ' <建设公司_手机燃油费报销_子表燃油>';
                xml = xml + '  <RelationRowGuid>' + mxlistArr_tel.length + 1 + '</RelationRowGuid>';
                xml = xml + ' <RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + ' <序号>1</序号>';
                xml = xml + ' <职务级别></职务级别>';
                xml = xml + ' <车牌号></车牌号>';
                xml = xml + ' <申请月数></申请月数>';
                xml = xml + ' <报销金额></报销金额>';
                xml = xml + '  <报销期间></报销期间>';
                xml = xml + ' </建设公司_手机燃油费报销_子表燃油>';
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
    var fno = $("#fno").val();
    var fdate = $("#fdate").val();
    var fdept = $("#fdept").val();
    var fcompany = $("#fcompany").val();
    var ffyxm = $("#ffyxm").val();
    var ftotal = $("#ftotal").val();
    var ftotal_dx = $("#ftotal_dx").val();
    var fbz = $("#fbz").val();



    var mxflag = false;
    var mxlistArr_tel = new Array();

    var ftotal_tel = $("#ftotal_tel").val();
    var ftotal_tel_dx = $("#ftotal_tel_dx").val();
    var fdjs_tel = $("#fdjs_tel").val();

    $("#mxlist_tel").find("#mx").each(function () {
        var fzwlevel = $(this).find("#fzwlevel").val();
        var ftel = $(this).find("#ftel").val();
        var fmonth = $(this).find("#fmonth").val();
        var fbxje = $(this).find("#fbxje").val();
        var fbxqj = $(this).find("#fbxqj").val();


        var mx = mxItem_tel(fzwlevel, ftel, fmonth, fbxje, fbxqj);
        mxlistArr_tel.push(mx);
    });

    var mxlistArr_oil = new Array();

    $("#mxlist_oil").find("#mx").each(function () {

        var fzwlevel = $(this).find("#fzwlevel").val();
        var fcph = $(this).find("#fcph").val();
        var fmonth = $(this).find("#fmonth").val();
        var fbxje = $(this).find("#fbxje").val();
        var fbxqj = $(this).find("#fbxqj").val();


        var mx = mxItem_oil(fzwlevel, fcph, fmonth, fbxje, fbxqj);
        mxlistArr_oil.push(mx);
    });

    var ftotal_oil = $("#ftotal_oil").val();
    var ftotal_oil_dx = $("#ftotal_oil_dx").val();
    var fdjs_oil = $("#fdjs_oil").val();

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


            xml = xml + '   <建设公司_手机燃油费报销_主表>';
            xml = xml + '    <单号>' + fbillno + '</单号>';
            xml = xml + '   <报销人>' + fname + '</报销人>';
            xml = xml + '   <报销人工号>' + fno + '</报销人工号>';
            xml = xml + '   <报销日期>' + fdate + '</报销日期>';
            xml = xml + '   <部门名称>' + fdept + '</部门名称>';
            xml = xml + '    <公司名称>' + fcompany + '</公司名称>';
            xml = xml + '    <费用项目>' + ffyxm + '</费用项目>';
            xml = xml + '    <总报销金额>' + ftotal + '</总报销金额>';
            xml = xml + '    <大写金额>' + ftotal_dx + '</大写金额>';
            xml = xml + '   <备注>' + fbz + '</备注>';
            xml = xml + '    <手机费_报销合计>' + ftotal_tel + '</手机费_报销合计>';
            xml = xml + '    <手机费_大写金额>' + ftotal_tel_dx + '</手机费_大写金额>';
            xml = xml + '     <手机费_单据数>' + fdjs_tel + '</手机费_单据数>';
            xml = xml + '     <燃油费_报销合计>' + ftotal_oil + '</燃油费_报销合计>';
            xml = xml + '    <燃油费_大写金额>' + ftotal_oil_dx + '</燃油费_大写金额>';
            xml = xml + '    <燃油费_单据数>' + fdjs_oil + '</燃油费_单据数>';
            if (fjArray.length != 0) {
                xml = xml + '    <上传票据>' + fjArray.toString().replace(",", ";") + '</上传票据>';
            } else {
                xml = xml + '    <上传票据></上传票据>';
            }

            xml = xml + '  </建设公司_手机燃油费报销_主表>';

            if (mxlistArr_tel.length != 0) {
                for (var i = 0; i < mxlistArr_tel.length; i++) {
                    xml = xml + ' <建设公司_手机燃油费报销_子表手机>';
                    xml = xml + '  <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                    xml = xml + ' <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
                    xml = xml + ' <序号>' + (i + 1) + '</序号>';
                    xml = xml + '  <职务级别>' + mxlistArr_tel[i].fzwlevel + '</职务级别>';
                    xml = xml + ' <手机号>' + mxlistArr_tel[i].ftel + '</手机号>';
                    xml = xml + ' <申请月数>' + mxlistArr_tel[i].fmonth + '</申请月数>';
                    xml = xml + '  <报销金额>' + mxlistArr_tel[i].fbxje + '</报销金额>';
                    xml = xml + '  <报销期间>' + mxlistArr_tel[i].fbxqj + '</报销期间>';
                    xml = xml + ' </建设公司_手机燃油费报销_子表手机>';
                }

            } else {
                xml = xml + ' <建设公司_手机燃油费报销_子表手机>';
                xml = xml + '  <RelationRowGuid>1</RelationRowGuid>';
                xml = xml + ' <RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + ' <序号>1</序号>';
                xml = xml + '  <职务级别></职务级别>';
                xml = xml + ' <手机号></手机号>';
                xml = xml + ' <申请月数>1</申请月数>';
                xml = xml + '  <报销金额></报销金额>';
                xml = xml + '  <报销期间></报销期间>';
                xml = xml + ' </建设公司_手机燃油费报销_子表手机>';
            }
            if (mxlistArr_oil.length != 0) {
                for (var i = 0; i < mxlistArr_oil.length; i++) {
                    xml = xml + ' <建设公司_手机燃油费报销_子表燃油>';
                    xml = xml + '  <RelationRowGuid>' + mxlistArr_tel.length + 1 + i + '</RelationRowGuid>';
                    xml = xml + ' <RowPrimaryKeys>itemid=' + itemidArr2[i] + '</RowPrimaryKeys>';
                    xml = xml + ' <序号>' + i + 1 + '</序号>';
                    xml = xml + ' <职务级别>' + mxlistArr_oil[i].fzwlevel + '</职务级别>';
                    xml = xml + ' <车牌号>' + mxlistArr_oil[i].fcph + '</车牌号>';
                    xml = xml + ' <申请月数>' + mxlistArr_oil[i].fmonth + '</申请月数>';
                    xml = xml + ' <报销金额>' + mxlistArr_oil[i].fbxje + '</报销金额>';
                    xml = xml + '  <报销期间>' + mxlistArr_oil[i].fbxqj + '</报销期间>';
                    xml = xml + ' </建设公司_手机燃油费报销_子表燃油>';
                }
            } else {
                xml = xml + ' <建设公司_手机燃油费报销_子表燃油>';
                xml = xml + '  <RelationRowGuid>' + mxlistArr_tel.length + 1 + '</RelationRowGuid>';
                xml = xml + ' <RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + ' <序号>1</序号>';
                xml = xml + ' <职务级别></职务级别>';
                xml = xml + ' <车牌号></车牌号>';
                xml = xml + ' <申请月数></申请月数>';
                xml = xml + ' <报销金额></报销金额>';
                xml = xml + '  <报销期间></报销期间>';
                xml = xml + ' </建设公司_手机燃油费报销_子表燃油>';
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


        xml = xml + '   <建设公司_手机燃油费报销_主表>';
        xml = xml + '    <单号>' + fbillno + '</单号>';
        xml = xml + '   <报销人>' + fname + '</报销人>';
        xml = xml + '   <报销人工号>' + fno + '</报销人工号>';
        xml = xml + '   <报销日期>' + fdate + '</报销日期>';
        xml = xml + '   <部门名称>' + fdept + '</部门名称>';
        xml = xml + '    <公司名称>' + fcompany + '</公司名称>';
        xml = xml + '    <费用项目>' + ffyxm + '</费用项目>';
        xml = xml + '    <总报销金额>' + ftotal + '</总报销金额>';
        xml = xml + '    <大写金额>' + ftotal_dx + '</大写金额>';
        xml = xml + '   <备注>' + fbz + '</备注>';
        xml = xml + '    <手机费_报销合计>' + ftotal_tel + '</手机费_报销合计>';
        xml = xml + '    <手机费_大写金额>' + ftotal_tel_dx + '</手机费_大写金额>';
        xml = xml + '     <手机费_单据数>' + fdjs_tel + '</手机费_单据数>';
        xml = xml + '     <燃油费_报销合计>' + ftotal_oil + '</燃油费_报销合计>';
        xml = xml + '    <燃油费_大写金额>' + ftotal_oil_dx + '</燃油费_大写金额>';
        xml = xml + '    <燃油费_单据数>' + fdjs_oil + '</燃油费_单据数>';
        if (fjArray.length != 0) {
            xml = xml + '    <上传票据>' + fjArray.toString().replace(",", ";") + '</上传票据>';
        } else {
            xml = xml + '    <上传票据></上传票据>';
        }

        xml = xml + '  </建设公司_手机燃油费报销_主表>';

        if (mxlistArr_tel.length != 0) {
            for (var i = 0; i < mxlistArr_tel.length; i++) {
                xml = xml + ' <建设公司_手机燃油费报销_子表手机>';
                xml = xml + '  <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml = xml + ' <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
                xml = xml + ' <序号>' + (i + 1) + '</序号>';
                xml = xml + '  <职务级别>' + mxlistArr_tel[i].fzwlevel + '</职务级别>';
                xml = xml + ' <手机号>' + mxlistArr_tel[i].ftel + '</手机号>';
                xml = xml + ' <申请月数>' + mxlistArr_tel[i].fmonth + '</申请月数>';
                xml = xml + '  <报销金额>' + mxlistArr_tel[i].fbxje + '</报销金额>';
                xml = xml + '  <报销期间>' + mxlistArr_tel[i].fbxqj + '</报销期间>';
                xml = xml + ' </建设公司_手机燃油费报销_子表手机>';
            }

        } else {
            xml = xml + ' <建设公司_手机燃油费报销_子表手机>';
            xml = xml + '  <RelationRowGuid>1</RelationRowGuid>';
            xml = xml + ' <RowPrimaryKeys></RowPrimaryKeys>';
            xml = xml + ' <序号>1</序号>';
            xml = xml + '  <职务级别></职务级别>';
            xml = xml + ' <手机号></手机号>';
            xml = xml + ' <申请月数>1</申请月数>';
            xml = xml + '  <报销金额></报销金额>';
            xml = xml + '  <报销期间></报销期间>';
            xml = xml + ' </建设公司_手机燃油费报销_子表手机>';
        }
        if (mxlistArr_oil.length != 0) {
            for (var i = 0; i < mxlistArr_oil.length; i++) {
                xml = xml + ' <建设公司_手机燃油费报销_子表燃油>';
                xml = xml + '  <RelationRowGuid>' + mxlistArr_tel.length + 1 + i + '</RelationRowGuid>';
                xml = xml + ' <RowPrimaryKeys>itemid=' + itemidArr2[i] + '</RowPrimaryKeys>';
                xml = xml + ' <序号>' + i + 1 + '</序号>';
                xml = xml + ' <职务级别>' + mxlistArr_oil[i].fzwlevel + '</职务级别>';
                xml = xml + ' <车牌号>' + mxlistArr_oil[i].fcph + '</车牌号>';
                xml = xml + ' <申请月数>' + mxlistArr_oil[i].fmonth + '</申请月数>';
                xml = xml + ' <报销金额>' + mxlistArr_oil[i].fbxje + '</报销金额>';
                xml = xml + '  <报销期间>' + mxlistArr_oil[i].fbxqj + '</报销期间>';
                xml = xml + ' </建设公司_手机燃油费报销_子表燃油>';
            }
        } else {
            xml = xml + ' <建设公司_手机燃油费报销_子表燃油>';
            xml = xml + '  <RelationRowGuid>' + mxlistArr_tel.length + 1 + '</RelationRowGuid>';
            xml = xml + ' <RowPrimaryKeys></RowPrimaryKeys>';
            xml = xml + ' <序号>1</序号>';
            xml = xml + ' <职务级别></职务级别>';
            xml = xml + ' <车牌号></车牌号>';
            xml = xml + ' <申请月数></申请月数>';
            xml = xml + ' <报销金额></报销金额>';
            xml = xml + '  <报销期间></报销期间>';
            xml = xml + ' </建设公司_手机燃油费报销_子表燃油>';
        }

        xml = xml + '</FormData>';
        xml = xml + '</XForm>';
        PostXml(xml);
    }
}
