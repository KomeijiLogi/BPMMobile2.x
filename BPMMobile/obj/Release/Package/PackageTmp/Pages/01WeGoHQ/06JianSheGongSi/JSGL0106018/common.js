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
    xml = xml + '       <ProcessName>建设公司投标费报销</ProcessName>';
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

        }).then(function () {
            var fno = $("#fno").val();
            initExpense(fno);
        });

}

function tapEvent() {
    $('#ftbfsqd').on('tap', function () {
        $("#mxlist").empty();
        showCard();
       
    });
    $('#tjmx').on('tap', function () {

    });
}
function initExpense(fno) {
    var xml = '<?xml version= "1.0" ?>';
    xml = xml + '      <Requests>';
    xml = xml + '     <Params>';
    xml = xml + '         <DataSource>BPM_EXPENSE</DataSource>';
    xml = xml + '         <ID>erpcloud_建设公司投标费报销</ID>';
    xml = xml + '         <Type>1</Type>';
    xml = xml + '        <Method>GetUserDataProcedure</Method>';
    xml = xml + '        <ProcedureName>erpcloud_建设公司投标费报销</ProcedureName>';
    xml = xml + '      <Filter><fno>' + fno + '</fno></Filter>';
    xml = xml + '      </Params>';
    xml = xml + '   </Requests>';
    var initExpenseAjax = $.ajax({
        type: "POST",
        url: "/api/bpm/DataProvider",
        data: { '': xml },

        beforeSend: function (XHR) {
            XHR.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem('ticket'));
        }
    }).done(function (data) {
        var provideData = JSON.parse(unescape(data.replace(/\\(u[0-9a-fA-F]{4})/gm, '%$1')));
        console.log(provideData);
        var expenseArr = provideData.Tables[0].Rows;
        for (var i = 0; i < expenseArr.length; i++) {
            if (String(expenseArr[i].审批状态).indexOf('已审批') != -1 && String(expenseArr[i].报销状态).indexOf('未报销') != -1) {

                var date = FormatterTime_Y_M_S(expenseArr[i].申请日期.year, expenseArr[i].申请日期.month, expenseArr[i].申请日期.day);
                var li = '<li data-value="" data-tags="" class="mui-table-view-cell mui-indexed-list-item mui-radio mui-left">';
                
                li = li + '<input type="radio" name="radio" ';
                li = li + 'data-tid="' + expenseArr[i].TaskID + '"';
                li = li + 'data-fbillno="' + expenseArr[i].单号 + '"';
                li = li + 'data-fsqje="' + expenseArr[i].合计申请金额 + '"';
                li = li + 'data-fjkje="' + expenseArr[i].借款金额 + '"';
                li = li + 'data-fxmmc="' + expenseArr[i].项目名称 + '"';
                li = li + 'data-fzbdw="' + expenseArr[i].招标单位 + '"';
                li = li + '/>' + date + '&nbsp;申请金额:' + expenseArr[i].合计申请金额 + '<br/>&nbsp;' + expenseArr[i].单号;
                li = li + '</li>';
                $("#exp_list").append(li);
            }
        }
        var header = document.querySelector('header.mui-bar');
        var list = document.getElementById('list');
        var done = document.getElementById('done');
        //calc hieght
        list.style.height = (document.body.offsetHeight - header.offsetHeight) + 'px';
        //create
        window.indexedList = new mui.IndexedList(list);
        //done event
        done.addEventListener('tap', function () {
            var checkboxArray = [].slice.call(list.querySelectorAll('input[type="radio"]'));
            var checkedValues = [];
            var checkedElements = [];
            checkboxArray.forEach(function (box) {
                if (box.checked) {
                    checkedValues.push(box.parentNode.innerText);
                    var checkele = Object.create({
                        tid: $(box).data('tid'),
                        fbillno: $(box).data('fbillno'),
                        fsqje: $(box).data('fsqje'),
                        fjkje: $(box).data('fjkje'),
                        fxmmc: $(box).data('fxmmc'),
                        fzbdw: $(box).data('fzbdw')

                    });
                    //console.log($(box).parent().find("#fsqdh").val());
                    checkedElements.push(checkele);

                }
            });
            if (checkedValues.length > 0) {

               
                hiddenCard();
                $("#ftbfsqd_taskid").val(checkedElements[checkedElements.length - 1].tid);
                $("#ftbfsqd").val(checkedElements[checkedElements.length - 1].fbillno);
                $("#fsqje").val(checkedElements[checkedElements.length - 1].fsqje);
                $("#fjkje").val(checkedElements[checkedElements.length - 1].fjkje);
                $("#fxmmc").val(checkedElements[checkedElements.length - 1].fxmmc);
                $("#fzbdw").val(checkedElements[checkedElements.length - 1].fzbdw);
                $("#ftotal_sqje").val(checkedElements[checkedElements.length - 1].fsqje);
                getList();
            } else {

            }
        }, false);
        mui('.mui-indexed-list-inner').on('change', 'input', function () {
            var count = list.querySelectorAll('input[type="radio"]:checked').length;
            var value = count ? "完成(" + count + ")" : "完成";
            done.innerHTML = value;
            if (count) {
                if (done.classList.contains("mui-disabled")) {
                    done.classList.remove("mui-disabled");
                }
            } else {
                if (!done.classList.contains("mui-disabled")) {
                    done.classList.add("mui-disabled");
                }
            }
        });

    }).fail(function (e) {

    });

}


function showCard() {
    $("#wrapper").css('display', 'none');
    $("#search").css('display', 'block');
    var header = document.querySelector('header.mui-bar');
    var list = document.getElementById('list');
    var done = document.getElementById('done');
    //calc hieght
    list.style.height = (document.body.offsetHeight - header.offsetHeight) + 'px';
    //create
    window.indexedList = new mui.IndexedList(list);
}
function hiddenCard() {
    $("#wrapper").css('display', 'block');
    $("#search").css('display', 'none');
}

function getList() {
    var fsqdID = $("#ftbfsqd_taskid").val();
    console.log(fsqdID);
    var xml = '<?xml version= "1.0" ?>';
    xml = xml + ' <Requests>';
    xml = xml + ' <Params>';
    xml = xml + '      <DataSource>BPM_EXPENSE</DataSource>';
    xml = xml + '      <ID>p_建设投标费报销</ID>';
    xml = xml + '      <Type>2</Type>';
    xml = xml + '       <Method>GetUserDataProcedure</Method>';
    xml = xml + '      <ProcedureName>p_建设投标费报销</ProcedureName>';
    xml = xml + '      <Filter>';
    xml = xml + '          <taskid>' + fsqdID + '</taskid>';
    xml = xml + '      </Filter>';
    xml = xml + '   </Params>';
    xml = xml + '  </Requests>';
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
        var listArr = provideData.Tables[0].Rows;
        for (var i = 0; i < listArr.length;i++){
            var li = '  <div id="mx" class="mui-card">';
            li = li + '    <div class="mui-input-row itemtitle">';
            li = li + '       <label>明细列表项</label>';
            li = li + '       <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>';
            li = li + '    </div>';
            li = li + '    <div class="mui-input-row">';
            li = li + '       <label for="ffyxm">费用项目</label>';
            li = li + '       <input type="text" id="ffyxm" name="ffyxm" readonly="readonly" value="' + listArr[i].费用项目 + '"/>';
            li = li + '    </div>';
            li = li + '    <div class="mui-input-row">';
            li = li + '        <label for="fsqje">申请金额</label>';
            li = li + '         <input type="number" id="fsqje" name="fsqje" readonly="readonly" value="' + listArr[i].申请金额 + '"/>';
            li = li + '    </div>';
            li = li + '    <div class="mui-input-row">';
            li = li + '        <label for="fbxje">报销金额<i style="color:red;">*</i></label>';
            li = li + '        <input type="number" id="fbxje" name="fbxje" placeholder="请填写报销金额"/>';
            li = li + '    </div>';
            li = li + '    <div class="mui-input-row" style="height:auto;">';
            li = li + '         <label for="fgzcx">工作成效<i style="color:red;">*</i></label>';
            li = li + '         <textarea rows="3" id="fgzcx" name="fgzcx" placeholder="请填写工作成效"></textarea>';
            li = li + '    </div>';
            li = li + '</div>';
            $("#mxlist").append(li);
            $("#mxlist").find("#fsqje,#fbxje").each(function () {
                $(this).on('input', function () {
                    calcPrice();
                });
            });

        }
    }).fail(function (e) {

    });
}


function mxItem(ffyxm, fsqje, fbxje, fgzcx) {

    var mx = Object.create({
        ffyxm: ffyxm,
        fsqje: fsqje,
        fbxje: fbxje,
        fgzcx: fgzcx,
        _check: function () {
            if (!fbxje) {
                mui.toast('请填写报销金额');
                return null;
            }
            if (!fgzcx) {
                mui.toast('请填写工作成效');
                return null;
            }
            return mx;
        }

    });
    if (mx._check() == null) {
        return null;
    }
    return mx;

}

function calcPrice() {

    var ftotal_sqje = 0;
    var ftotal_bxje = 0;
    $("#mxlist").find("#fsqje").each(function () {
        var fsqje = parseFloat($(this).val());
        if (isNaN(fsqje)) {
            fsqje = 0;
        }
        ftotal_sqje = parseFloat(ftotal_sqje) + fsqje;
        $("#ftotal_sqje").val(ftotal_sqje);
    });
    $("#mxlist").find("#fbxje").each(function () {
        var fbxje = parseFloat($(this).val());
        if (isNaN(fbxje)) {
            fbxje = 0;
        }
        ftotal_bxje = parseFloat(ftotal_bxje) + fbxje;
        $("#ftotal_bxje").val(ftotal_bxje);
        $("#ftotal_bxje_dx").val(atoc(ftotal_bxje));
    });

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
        var item = data.FormDataSet.建设公司_投标费报销_主表[0];
        if (flag) {

            $("#taskId").val(item.TaskID);
            $("#stepId").val(stepId);
            $("#fbillno").val(item.单号);

        }

        $("#fname").val(item.报销人);
        $("#fno").val(item.报销人工号);
        $("#fdate").val(FormatterTimeYMS(item.报销日期));
        $("#fdept").val(item.部门名称);
        $("#fcompany").val(item.公司名称);
        $("#ftbfsqd").val(item.投标费申请单号);
        $("#ftbfsqd_taskid").val(item.投标费申请单TaskID);
        $("#fsqje").val(item.申请金额);
        $("#fjkje").val(item.借款金额);
        $("#fxmmc").val(item.项目名称);
        $("#fzbdw").val(item.招标单位);
        $("#ftotal_sqje").val(item.合计_申请金额);
        $("#ftotal_bxje").val(item.合计_报销金额);
        $("#ftotal_bxje_dx").val(item.大写金额);
        $("#fdjs").val(item.单据数);

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


        var item_c = data.FormDataSet.建设公司_投标费报销_子表;
        for (var i = 0; i < item_c.length;i++){
            itemidArr.push(item_c[i].itemid);

            var li = '<div id="mx" class="mui-card">';
            li = li + '    <div class="mui-input-row itemtitle">';
            li = li + '       <label>投标费列表项</label>';
            li = li + '       <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>';
            li = li + '    </div>';
            li = li + '    <div class="mui-input-row">';
            li = li + '       <label for="ffyxm">费用项目</label>';
            li = li + '       <input type="text" id="ffyxm" name="ffyxm" readonly="readonly" value="' + item_c[i].费用项目 + '"/>';
            li = li + '    </div>';
            li = li + '    <div class="mui-input-row">';
            li = li + '        <label for="fsqje">申请金额</label>';
            li = li + '         <input type="number" id="fsqje" name="fsqje" readonly="readonly" value="' + item_c[i].申请金额 + '"/>';
            li = li + '    </div>';
            li = li + '    <div class="mui-input-row">';
            li = li + '        <label for="fbxje">报销金额<i style="color:red;">*</i></label>';
            li = li + '        <input type="number" id="fbxje" name="fbxje" readonly="readonly" value="' + item_c[i].报销金额 + '"/>';
            li = li + '    </div>';
            li = li + '    <div class="mui-input-row" style="height:auto;">';
            li = li + '         <label for="fgzcx">工作成效<i style="color:red;">*</i></label>';
            li = li + '         <textarea rows="3" id="fgzcx" name="fgzcx" readonly="readonly">' + item_c[i].工作成效 + '</textarea>';
            li = li + '    </div>';
            li = li + '</div>';
            $("#mxlist").append(li);

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
            $(this).css('display', 'block');
        });
        $("#mxlist").find("#fbxje,#fgzcx").each(function () {
            $(this).removeAttr('readonly');
        });
        tapEvent();
        var fno = $("#fno").val();
        initExpense(fno);
        $(".upload-addbtn").css('display', 'block');
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
    var ftbfsqd = $("#ftbfsqd").val();
    var ftbfsqd_taskid = $("#ftbfsqd_taskid").val();
    var fsqje = $("#fsqje").val();
    var fjkje = $("#fjkje").val();
    var fxmmc = $("#fxmmc").val();
    var fzbdw = $("#fzbdw").val();

    var ftotal_sqje = $("#ftotal_sqje").val();
    var ftotal_bxje = $("#ftotal_bxje").val();
    var ftotal_bxje_dx = $("#ftotal_bxje_dx").val();
    var fdjs = $("#fdjs").val();
    if (!ftbfsqd) {
        mui.toast('请选择费用申请单');
        return;
    }
    if (!fdjs) {
        mui.toast('请填写单据数');
        return;
    }
   

    var mxflag = false;
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var ffyxm = $(this).find("#ffyxm").val();
        var fsqje = $(this).find("#fsqje").val();
        var fbxje = $(this).find("#fbxje").val();
        var fgzcx = $(this).find("#fgzcx").val();

        if (mxItem(ffyxm, fsqje, fbxje, fgzcx) == null) {
            mxflag = true;
            return;
        }
        var mx = mxItem(ffyxm, fsqje, fbxje, fgzcx);
        mxlistArr.push(mx);
    });
    if (mxflag) {
        return;
    }
    if (fjArray.length == 0) {
        mui.toast('请上传票据');
        return;
    }
    var btnArry = ["取消", "确定"];
    mui.confirm('即将提交，是否确定？', '提交确认提醒', btnArry, function (e) {
        if (e.index == 1) {
            var xml = '<?xml version= "1.0" ?>';
            xml = xml + '   <XForm>';
            xml = xml + '         <Header>';
            xml = xml + '        <Method>Post</Method>';
            xml = xml + '       <ProcessName>建设公司投标费报销</ProcessName>';
            xml = xml + '         <ProcessVersion>' + version + '</ProcessVersion>';
            xml = xml + '            <DraftGuid></DraftGuid>';
            xml = xml + '             <OwnerMemberFullName>' + BPMOU + '</OwnerMemberFullName>';
            xml = xml + '            <Action>提交</Action>';
            xml = xml + '          <Comment></Comment>';
            xml = xml + '             <InviteIndicateUsers></InviteIndicateUsers>';
            xml = xml + '       </Header>';
            xml = xml + '       <FormData>';

            xml = xml + '  <建设公司_投标费报销_主表>';
            xml = xml + ' <单号>自动生成</单号>';
            xml = xml + '  <报销人>' + fname + '</报销人>';
            xml = xml + '  <报销人工号>' + fno + '</报销人工号>';
            xml = xml + '  <报销日期>' + fdate + '</报销日期>';
            xml = xml + '  <部门名称>' + fdept + '</部门名称>';
            xml = xml + '  <公司名称>' + fcompany + '</公司名称>';
            xml = xml + '  <投标费申请单号>' + ftbfsqd+'</投标费申请单号>';
            xml = xml + '  <投标费申请单TaskID>' + ftbfsqd_taskid + '</投标费申请单TaskID>';
            xml = xml + '   <申请金额>' + fsqje + '</申请金额>';
            xml = xml + '  <借款金额>' + fjkje + '</借款金额>';
            xml = xml + '   <项目名称>' + fxmmc + '</项目名称>';
            xml = xml + '   <招标单位>' + fzbdw + '</招标单位>';
            xml = xml + '  <合计_申请金额>' + ftotal_sqje + '</合计_申请金额>';
            xml = xml + '  <合计_报销金额>' + ftotal_bxje + '</合计_报销金额>';
            xml = xml + '  <大写金额>' + ftotal_bxje_dx + '</大写金额>';
            xml = xml + '   <单据数>' + fdjs + '</单据数>';
            if (fjArray.length != 0) {
                xml = xml + '   <上传票据>' + fjArray.toString().replace(",",";") + '</上传票据>';
            } else {
                xml = xml + '   <上传票据></上传票据>';
            }
         
            xml = xml + '  </建设公司_投标费报销_主表>';

            for (var i = 0; i < mxlistArr.length; i++) {
                xml = xml + '<建设公司_投标费报销_子表>';
                xml = xml + '  <RelationRowGuid>'+(i+1)+'</RelationRowGuid>';
                xml = xml + ' <RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + ' <序号>' + (i + 1) + '</序号>';
                xml = xml + ' <费用项目>' + mxlistArr[i].ffyxm + '</费用项目>';
                xml = xml + '   <申请金额>' + mxlistArr[i].fsqje + '</申请金额>';
                xml = xml + '  <报销金额>' + mxlistArr[i].fbxje + '</报销金额>';
                xml = xml + '  <工作成效>' + mxlistArr[i].fgzcx + '</工作成效>';
                xml = xml + '  </建设公司_投标费报销_子表>';
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
    var ftbfsqd = $("#ftbfsqd").val();
    var ftbfsqd_taskid = $("#ftbfsqd_taskid").val();
    var fsqje = $("#fsqje").val();
    var fjkje = $("#fjkje").val();
    var fxmmc = $("#fxmmc").val();
    var fzbdw = $("#fzbdw").val();

    var ftotal_sqje = $("#ftotal_sqje").val();
    var ftotal_bxje = $("#ftotal_bxje").val();
    var ftotal_bxje_dx = $("#ftotal_bxje_dx").val();
    var fdjs = $("#fdjs").val();
    if (!ftbfsqd) {
        mui.toast('请选择费用申请单');
        return;
    }
    if (!fdjs) {
        mui.toast('请填写单据数');
        return;
    }
   
    var mxflag = false;
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var ffyxm = $(this).find("#ffyxm").val();
        var fsqje = $(this).find("#fsqje").val();
        var fbxje = $(this).find("#fbxje").val();
        var fgzcx = $(this).find("#fgzcx").val();

        if (mxItem(ffyxm, fsqje, fbxje, fgzcx) == null) {
            mxflag = true;
            return;
        }
        var mx = mxItem(ffyxm, fsqje, fbxje, fgzcx);
        mxlistArr.push(mx);
    });
    if (mxflag) {
        return;
    }
    if (fjArray.length == 0) {
        mui.toast('请上传票据');
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
            xml = xml + '  <建设公司_投标费报销_主表>';
            xml = xml + ' <单号>' + fbillno + '</单号>';
            xml = xml + '  <报销人>' + fname + '</报销人>';
            xml = xml + '  <报销人工号>' + fno + '</报销人工号>';
            xml = xml + '  <报销日期>' + fdate + '</报销日期>';
            xml = xml + '  <部门名称>' + fdept + '</部门名称>';
            xml = xml + '  <公司名称>' + fcompany + '</公司名称>';
            xml = xml + '  <投标费申请单号>' + ftbfsqd + '</投标费申请单号>';
            xml = xml + '  <投标费申请单TaskID>' + ftbfsqd_taskid + '</投标费申请单TaskID>';
            xml = xml + '   <申请金额>' + fsqje + '</申请金额>';
            xml = xml + '  <借款金额>' + fjkje + '</借款金额>';
            xml = xml + '   <项目名称>' + fxmmc + '</项目名称>';
            xml = xml + '   <招标单位>' + fzbdw + '</招标单位>';
            xml = xml + '  <合计_申请金额>' + ftotal_sqje + '</合计_申请金额>';
            xml = xml + '  <合计_报销金额>' + ftotal_bxje + '</合计_报销金额>';
            xml = xml + '  <大写金额>' + ftotal_bxje_dx + '</大写金额>';
            xml = xml + '   <单据数>' + fdjs + '</单据数>';
            if (fjArray.length != 0) {
                xml = xml + '   <上传票据>' + fjArray.toString().replace(",", ";") + '</上传票据>';
            } else {
                xml = xml + '   <上传票据></上传票据>';
            }

            xml = xml + '  </建设公司_投标费报销_主表>';

            for (var i = 0; i < mxlistArr.length; i++) {
                xml = xml + '<建设公司_投标费报销_子表>';
                xml = xml + '  <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml = xml + ' <RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + ' <序号>' + (i + 1) + '</序号>';
                xml = xml + ' <费用项目>' + mxlistArr[i].ffyxm + '</费用项目>';
                xml = xml + '   <申请金额>' + mxlistArr[i].fsqje + '</申请金额>';
                xml = xml + '  <报销金额>' + mxlistArr[i].fbxje + '</报销金额>';
                xml = xml + '  <工作成效>' + mxlistArr[i].fgzcx + '</工作成效>';
                xml = xml + '  </建设公司_投标费报销_子表>';
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
    var ftbfsqd = $("#ftbfsqd").val();
    var ftbfsqd_taskid = $("#ftbfsqd_taskid").val();
    var fsqje = $("#fsqje").val();
    var fjkje = $("#fjkje").val();
    var fxmmc = $("#fxmmc").val();
    var fzbdw = $("#fzbdw").val();

    var ftotal_sqje = $("#ftotal_sqje").val();
    var ftotal_bxje = $("#ftotal_bxje").val();
    var ftotal_bxje_dx = $("#ftotal_bxje_dx").val();
    var fdjs = $("#fdjs").val();
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var ffyxm = $(this).find("#ffyxm").val();
        var fsqje = $(this).find("#fsqje").val();
        var fbxje = $(this).find("#fbxje").val();
        var fgzcx = $(this).find("#fgzcx").val();

      
        var mx = mxItem(ffyxm, fsqje, fbxje, fgzcx);
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
            xml = xml + '  <建设公司_投标费报销_主表>';
            xml = xml + ' <单号>' + fbillno + '</单号>';
            xml = xml + '  <报销人>' + fname + '</报销人>';
            xml = xml + '  <报销人工号>' + fno + '</报销人工号>';
            xml = xml + '  <报销日期>' + fdate + '</报销日期>';
            xml = xml + '  <部门名称>' + fdept + '</部门名称>';
            xml = xml + '  <公司名称>' + fcompany + '</公司名称>';
            xml = xml + '  <投标费申请单号>' + ftbfsqd + '</投标费申请单号>';
            xml = xml + '  <投标费申请单TaskID>' + ftbfsqd_taskid + '</投标费申请单TaskID>';
            xml = xml + '   <申请金额>' + fsqje + '</申请金额>';
            xml = xml + '  <借款金额>' + fjkje + '</借款金额>';
            xml = xml + '   <项目名称>' + fxmmc + '</项目名称>';
            xml = xml + '   <招标单位>' + fzbdw + '</招标单位>';
            xml = xml + '  <合计_申请金额>' + ftotal_sqje + '</合计_申请金额>';
            xml = xml + '  <合计_报销金额>' + ftotal_bxje + '</合计_报销金额>';
            xml = xml + '  <大写金额>' + ftotal_bxje_dx + '</大写金额>';
            xml = xml + '   <单据数>' + fdjs + '</单据数>';
            if (fjArray.length != 0) {
                xml = xml + '   <上传票据>' + fjArray.toString().replace(",", ";") + '</上传票据>';
            } else {
                xml = xml + '   <上传票据></上传票据>';
            }

            xml = xml + '  </建设公司_投标费报销_主表>';

            for (var i = 0; i < mxlistArr.length; i++) {
                xml = xml + '<建设公司_投标费报销_子表>';
                xml = xml + '  <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml = xml + ' <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
                xml = xml + ' <序号>' + (i + 1) + '</序号>';
                xml = xml + ' <费用项目>' + mxlistArr[i].ffyxm + '</费用项目>';
                xml = xml + '   <申请金额>' + mxlistArr[i].fsqje + '</申请金额>';
                xml = xml + '  <报销金额>' + mxlistArr[i].fbxje + '</报销金额>';
                xml = xml + '  <工作成效>' + mxlistArr[i].fgzcx + '</工作成效>';
                xml = xml + '  </建设公司_投标费报销_子表>';
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
    var ftbfsqd = $("#ftbfsqd").val();
    var ftbfsqd_taskid = $("#ftbfsqd_taskid").val();
    var fsqje = $("#fsqje").val();
    var fjkje = $("#fjkje").val();
    var fxmmc = $("#fxmmc").val();
    var fzbdw = $("#fzbdw").val();

    var ftotal_sqje = $("#ftotal_sqje").val();
    var ftotal_bxje = $("#ftotal_bxje").val();
    var ftotal_bxje_dx = $("#ftotal_bxje_dx").val();
    var fdjs = $("#fdjs").val();
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var ffyxm = $(this).find("#ffyxm").val();
        var fsqje = $(this).find("#fsqje").val();
        var fbxje = $(this).find("#fbxje").val();
        var fgzcx = $(this).find("#fgzcx").val();


        var mx = mxItem(ffyxm, fsqje, fbxje, fgzcx);
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
            xml = xml + '  <建设公司_投标费报销_主表>';
            xml = xml + ' <单号>' + fbillno + '</单号>';
            xml = xml + '  <报销人>' + fname + '</报销人>';
            xml = xml + '  <报销人工号>' + fno + '</报销人工号>';
            xml = xml + '  <报销日期>' + fdate + '</报销日期>';
            xml = xml + '  <部门名称>' + fdept + '</部门名称>';
            xml = xml + '  <公司名称>' + fcompany + '</公司名称>';
            xml = xml + '  <投标费申请单号>' + ftbfsqd + '</投标费申请单号>';
            xml = xml + '  <投标费申请单TaskID>' + ftbfsqd_taskid + '</投标费申请单TaskID>';
            xml = xml + '   <申请金额>' + fsqje + '</申请金额>';
            xml = xml + '  <借款金额>' + fjkje + '</借款金额>';
            xml = xml + '   <项目名称>' + fxmmc + '</项目名称>';
            xml = xml + '   <招标单位>' + fzbdw + '</招标单位>';
            xml = xml + '  <合计_申请金额>' + ftotal_sqje + '</合计_申请金额>';
            xml = xml + '  <合计_报销金额>' + ftotal_bxje + '</合计_报销金额>';
            xml = xml + '  <大写金额>' + ftotal_bxje_dx + '</大写金额>';
            xml = xml + '   <单据数>' + fdjs + '</单据数>';
            if (fjArray.length != 0) {
                xml = xml + '   <上传票据>' + fjArray.toString().replace(",", ";") + '</上传票据>';
            } else {
                xml = xml + '   <上传票据></上传票据>';
            }

            xml = xml + '  </建设公司_投标费报销_主表>';

            for (var i = 0; i < mxlistArr.length; i++) {
                xml = xml + '<建设公司_投标费报销_子表>';
                xml = xml + '  <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml = xml + ' <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
                xml = xml + ' <序号>' + (i + 1) + '</序号>';
                xml = xml + ' <费用项目>' + mxlistArr[i].ffyxm + '</费用项目>';
                xml = xml + '   <申请金额>' + mxlistArr[i].fsqje + '</申请金额>';
                xml = xml + '  <报销金额>' + mxlistArr[i].fbxje + '</报销金额>';
                xml = xml + '  <工作成效>' + mxlistArr[i].fgzcx + '</工作成效>';
                xml = xml + '  </建设公司_投标费报销_子表>';
            }


            xml = xml + '</FormData>';
            xml = xml + '</XForm>';
            PostXml(xml);
        })
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
        xml = xml + '  <建设公司_投标费报销_主表>';
        xml = xml + ' <单号>' + fbillno + '</单号>';
        xml = xml + '  <报销人>' + fname + '</报销人>';
        xml = xml + '  <报销人工号>' + fno + '</报销人工号>';
        xml = xml + '  <报销日期>' + fdate + '</报销日期>';
        xml = xml + '  <部门名称>' + fdept + '</部门名称>';
        xml = xml + '  <公司名称>' + fcompany + '</公司名称>';
        xml = xml + '  <投标费申请单号>' + ftbfsqd + '</投标费申请单号>';
        xml = xml + '  <投标费申请单TaskID>' + ftbfsqd_taskid + '</投标费申请单TaskID>';
        xml = xml + '   <申请金额>' + fsqje + '</申请金额>';
        xml = xml + '  <借款金额>' + fjkje + '</借款金额>';
        xml = xml + '   <项目名称>' + fxmmc + '</项目名称>';
        xml = xml + '   <招标单位>' + fzbdw + '</招标单位>';
        xml = xml + '  <合计_申请金额>' + ftotal_sqje + '</合计_申请金额>';
        xml = xml + '  <合计_报销金额>' + ftotal_bxje + '</合计_报销金额>';
        xml = xml + '  <大写金额>' + ftotal_bxje_dx + '</大写金额>';
        xml = xml + '   <单据数>' + fdjs + '</单据数>';
        if (fjArray.length != 0) {
            xml = xml + '   <上传票据>' + fjArray.toString().replace(",", ";") + '</上传票据>';
        } else {
            xml = xml + '   <上传票据></上传票据>';
        }

        xml = xml + '  </建设公司_投标费报销_主表>';

        for (var i = 0; i < mxlistArr.length; i++) {
            xml = xml + '<建设公司_投标费报销_子表>';
            xml = xml + '  <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
            xml = xml + ' <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
            xml = xml + ' <序号>' + (i + 1) + '</序号>';
            xml = xml + ' <费用项目>' + mxlistArr[i].ffyxm + '</费用项目>';
            xml = xml + '   <申请金额>' + mxlistArr[i].fsqje + '</申请金额>';
            xml = xml + '  <报销金额>' + mxlistArr[i].fbxje + '</报销金额>';
            xml = xml + '  <工作成效>' + mxlistArr[i].fgzcx + '</工作成效>';
            xml = xml + '  </建设公司_投标费报销_子表>';
        }


        xml = xml + '</FormData>';
        xml = xml + '</XForm>';
        PostXml(xml);
    }
}