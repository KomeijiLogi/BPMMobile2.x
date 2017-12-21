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

}

var itemidArr1 = new Array();
var itemidArr2 = new Array();
var itemidArr3 = new Array();

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
        var item = data.FormDataSet.建设公司_差旅费申请_主表[0];
        if (flag) {

            $("#taskId").val(item.TaskID);
            $("#stepId").val(stepId);
            $("#fbillno").val(item.单号);

        }

        $("#fname").val(item.申请人);
        $("#fno").val(item.申请人工号);
        $("#fdate").val(FormatterTimeYMS(item.申请日期));
        $("#fdept").val(item.部门名称);
        $("#fcompany").val(item.公司名称);
        $("#fcllb").val(item.差旅类别);
        $("#fif_jk").val(item.是否借款);
        $("#fif_sqzdf").val(item.是否申请招待费);
        if (String(item.是否借款) == '是') {
            $("#fif_jkd").addClass('mui-active');
            $("#fjkcard").css('display', 'block');
        }
        if (String(item.是否申请招待费) == '是') {
            $("#fif_sqzdfd").addClass('mui-active');
            $("#mxlist_zdf").css('display', 'block');
        } else {
            $("#mxlist_zdf").css('display', 'none');
        }
        if (String(item.差旅类别).indexOf('国内') != -1) {
            $("#mxlist_internal").css('display', 'block');
        } else {
            $("#mxlist_internal").css('display', 'none');
        }
        if (String(item.差旅类别).indexOf('国外') != -1) {
            $("#mxlist_international").css('display', 'block');
        } else {
            $("#mxlist_international").css('display', 'none');
        }

        $("#ftotal_sqje").val(item.总申请金额);
        $("#fdxje").val(item.大写金额);
        $("#fbz").val(item.备注);
        $("#fyqf").val(item.邀请方);
        $("#fyqr").val(item.邀请人);
        $("#ftel").val(item.电话);
        $("#fcz").val(item.传真);
        $("#fsqje_ctjtf").text(item.申请金额_长途交通费);
        $("#fccrw").val(item.出差任务内容);
        $("#fyxts_zsf").text(item.有效天数_住宿费);
        $("#ffxbz_zsf").text(item.分项标准合计_住宿费);
        $("#fsqje_zsf").text(item.申请金额_住宿费);
        $("#fcbz").val(item.超标准情况);
        $("#fyxts_cf").text(item.有效天数_餐费);
        $("#ffxbz_cf").text(item.分项标准合计_餐费);
        $("#fsqje_cf").text(item.申请金额_餐费);
        $("#fyxts_snjtf").text(item.有效天数_市内交通费);
        $("#ffxbz_snjtf").text(item.分项标准合计_市内交通费);
        $("#fsqje_snjtf").text(item.申请金额_市内交通费);
        $("#fsqje_qtclf").text(item.申请金额_其他差旅费);
        $("#ffxbz_total").text(item.合计_差旅费_分项标准);
        $("#fsqje_total").text(item.合计_差旅费_申请金额);

        $("#fsqje_dx").val(item.大写金额_差旅费);
        $("#ftotal_zdf").val(item.合计_招待费_申请金额);
        $("#ftotal_zdf_dx").val(item.大写金额_招待费);
        $("#fjkje").val(item.借款金额);
        $("#fjkje_dx").val(item.大写金额_借款单);
        $("#fjkdh").val(item.借款单号);
        $("#fjksy").val(item.借款事由);



        var item_c1 = data.FormDataSet.建设公司_差旅费申请_子表国内;
        for (var i = 0; i < item_c1.length; i++){
            itemidArr1.push(item_c1[i].itemid);
            var li = '  <div id="mx" class="mui-card">';
            li = li + '    <div class="mui-input-row itemtitle">';
            li = li + '       <label>国内差旅费</label>';
            li = li + '       <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>';
            li = li + '    </div>';
            li = li + '    <div class="mui-input-row">';
            li = li + '       <label for="fzwjb">职务级别<i style="color:red;">*</i></label>';
            li = li + '       <input type="text" id="fzwjb" name="fzwjb" readonly="readonly" value="' + item_c1[i].国内_职务级别 + '"/>';
            li = li + '    </div>';
            li = li + '    <div class="mui-input-row">';
            li = li + '        <label for="fstartdate">开始时间<i style="color:red;">*</i></label>';
            li = li + '        <input type="date" id="fstartdate" name="fstartdate" readonly="readonly" value="' + FormatterTimeYMS(item_c1[i].国内_出差时间开始) + '"/>';
            li = li + '    </div>';
            li = li + '    <div class="mui-input-row">';
            li = li + '        <label for="fenddate">结束时间<i style="color:red;">*</i></label>';
            li = li + '        <input type="date" id="fenddate" name="fenddate" readonly="readonly" value="' + FormatterTimeYMS(item_c1[i].国内_出差时间结束) + '"/>';
            li = li + '    </div>';
            li = li + '    <div class="mui-input-row">';
            li = li + '        <label for="fjtgj">交通工具<i style="color:red;">*</i></label>';
            li = li + '        <input type="text" id="fjtgj" name="fjtgj" readonly="readonly" value="' + item_c1[i].国内_交通工具 + '"/>';
            li = li + '    </div>';
            li = li + '    <div class="mui-input-row">';
            li = li + '        <label for="fprovince">出差省份<i style="color:red;">*</i></label>';
            li = li + '        <input type="text" id="fprovince" name="fprovince" readonly="readonly" value="' + item_c1[i].国内_省+'"/>';
            li = li + '    </div>';
            li = li + '    <div class="mui-input-row">';
            li = li + '        <label for="fcity">出差城市<i style="color:red;">*</i></label>';
            li = li + '        <input type="text" id="fcity" name="fcity" readonly="readonly" value="' + item_c1[i].国内_市 + '"/>';
            li = li + '    </div>';
            li = li + '    <input type="hidden" id="fproid" name="fproid" value="' + item_c1[i].国内_省ID + '"/>';
            li = li + '    <div class="mui-input-row">';
            li = li + '        <label for="fdqlb">地区类别<i style="color:red;">*</i></label>';
            li = li + '        <input type="text" id="fdqlb" name="fdqlb" readonly="readonly" value="' + item_c1[i].国内_出差地区类别 + '"/>';
            li = li + '    </div>';
            li = li + '    <div class="mui-input-row">';
            li = li + '         <label for="fccrs">出差人数<i style="color:red;">*</i></label>';
            li = li + '         <input type="number" id="fccrs" name="fccrs" readonly="readonly" value="' + item_c1[i].国内_出差人数 + '"/>';
            li = li + '    </div>';
            li = li + '    <div class="mui-input-row">';
            li = li + '         <label for="fccts">出差天数<i style="color:red;">*</i></label>';
            li = li + '         <input type="number" id="fccts" name="fccts" readonly="readonly" value="' + item_c1[i].国内_出差天数 + '"/>';
            li = li + '    </div>';
            li = li + '</div>';
            $("#mxlist_internal").append(li);
        }

        var item_c2 = data.FormDataSet.建设公司_差旅费申请_子表国外;
        for (var i = 0; i < item_c2.length; i++) {
            itemidArr2.push(item_c2[i].itemid);
            var li = '  <div id="mx" class="mui-card">';
            li = li + '    <div class="mui-input-row itemtitle">';
            li = li + '       <label>国外差旅费</label>';
            li = li + '       <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>';
            li = li + '    </div>';
            li = li + '    <div class="mui-input-row">';
            li = li + '       <label for="fzwjb">职务级别<i style="color:red;">*</i></label>';
            li = li + '       <input type="text" id="fzwjb" name="fzwjb" readonly="readonly" value="' + item_c2[i].国外_职务级别 + '"/>';
            li = li + '    </div>';
            li = li + '    <div class="mui-input-row">';
            li = li + '        <label for="fstartdate">开始时间<i style="color:red;">*</i></label>';
            li = li + '        <input type="date" id="fstartdate" name="fstartdate" readonly="readonly" value="' + FormatterTimeYMS(item_c2[i].国外_出差时间开始) + '"/>';
            li = li + '    </div>';
            li = li + '    <div class="mui-input-row">';
            li = li + '         <label for="fenddate">结束时间<i style="color:red;">*</i></label>';
            li = li + '         <input type="date" id="fenddate" name="fenddate" readonly="readonly" value="' + FormatterTimeYMS(item_c2[i].国外_出差时间结束) + '"/>';
            li = li + '    </div>';
            li = li + '    <div class="mui-input-row">';
            li = li + '          <label for="fjtgj">交通工具<i style="color:red;">*</i></label>';
            li = li + '          <input type="text" id="fjtgj" name="fjtgj" readonly="readonly" value="' + item_c2[i].国外_交通工具 + '"/>';
            li = li + '    </div>';
            li = li + '    <div class="mui-input-row">';
            li = li + '          <label for="finter">出差洲际<i style="color:red;">*</i></label>';
            li = li + '          <input type="text" id="finter" name="finter" readonly="readonly" value="' + item_c2[i].国外_出差地点州 + '"/>';
            li = li + '    </div>';
            li = li + '    <div class="mui-input-row">';
            li = li + '        <label for="fcountry">出差国家<i style="color:red;">*</i></label>';
            li = li + '        <input type="text" id="fcountry" name="fcountry" readonly="readonly" value="' + item_c2[i].国外_出差地点国家 + '"/>';
            li = li + '    </div>';
            li = li + '    <div class="mui-input-row">';
            li = li + '         <label for="fccrs">出差人数<i style="color:red;">*</i></label>';
            li = li + '         <input type="number" id="fccrs" name="fccrs" readonly="readonly" value="' + item_c2[i].国外_出差人数 + '"/>';
            li = li + '    </div>';
            li = li + '    <div class="mui-input-row">';
            li = li + '         <label for="fccts">出差天数<i style="color:red;">*</i></label>';
            li = li + '         <input type="number" id="fccts" name="fccts" readonly="readonly" value="' + item_c2[i].国外_出差天数 + '"/>';
            li = li + '    </div>';
            li = li + '</div>';
            $("#mxlist_international").append(li);
        }

        var item_c3 = data.FormDataSet.建设公司_差旅费申请_子表招待;
        for (var i = 0; i < item_c3.length;i++){
            itemidArr3.push(item_c3[i].itemid);
            var li = '  <div id="mx" class="mui-card">';
            li = li + '    <div class="mui-input-row itemtitle">';
            li = li + '       <label>招待费</label>';
            li = li + '       <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>';
            li = li + '    </div>';
            li = li + '    <div class="mui-input-row">';
            li = li + '        <label for="fzdrs">招待人数<i style="color:red;">*</i></label>';
            li = li + '        <input type="number" id="fzdrs" name="fzdrs" readonly="readonly" value="' + item_c3[i].招待人数 + '"/>';
            li = li + '    </div>';
            li = li + '    <div class="mui-input-row">';
            li = li + '        <label for="fzdbz">招待标准</label>';
            li = li + '        <input type="number" id="fzdbz" name="fzdbz" readonly="readonly" value="' + item_c3[i].单人招待标准 + '"/>';
            li = li + '    </div>';
            li = li + '    <div class="mui-input-row">';
            li = li + '        <label for="fsqje">申请金额</label>';
            li = li + '        <input type="number" id="fsqje" name="fsqje" readonly="readonly" value="' + item_c3[i].申请金额 + '"/>';
            li = li + '    </div>';
            li = li + '    <div class="mui-input-row">';
            li = li + '        <label for="fzdcs">招待城市</label>';
            li = li + '        <input type="text" id="fzdcs" name="fzdcs" readonly="readonly" value="' + item_c3[i].招待城市 + '"/>';
            li = li + '    </div>';
            li = li + '    <div class="mui-input-row">';
            li = li + '       <label for="fzddd">招待地点</label>';
            li = li + '       <input type="text" id="fzddd" name="fzddd" readonly="readonly" value="' + item_c3[i].招待地点 + '"/>';
            li = li + '    </div>';
            li = li + '    <div class="mui-input-row">';
            li = li + '       <label for="fsjms">事件描述</label>';
            li = li + '       <input type="text" id="fsjms" name="fsjms" readonly="readonly" value="' + item_c3[i].事件描述 + '"/>';
            li = li + '    </div>';
            li = li + ' </div>';
            $("#mxlist_zdf").append(li);
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
        mui.alert('暂不支持移动端发起');
    } else if (NodeName == "sysInform") {
        $("#readD").css("display", "block");
        $("#csd").css("display", "none");

    } else {
        if (typeof (NodeName) != "undefined") {
            $("#approvalD").css("display", "block");
        }
    }
}

function mxItem_internal(fzwjb, fstartdate, fenddate, fjtgj, fprovince, fcity, fproid, fdqlb, fccrs, fccts) {
    var mx = Object.create({
        fzwjb: fzwjb,
        fstartdate: fstartdate,
        fenddate: fenddate,
        fjtgj: fjtgj,
        fprovince: fprovince,
        fcity: fcity,
        fproid: fproid,
        fdqlb: fdqlb,
        fccrs: fccrs,
        fccts: fccts,
        _check: function () {

            

            return mx;
        }

    });

    return mx._check();
}

function mxItem_international(fzwjb, fstartdate, fenddate, fjtgj, finter, fcountry, fccrs, fccts) {

    var mx = Object.create({
        fzwjb: fzwjb,
        fstartdate: fstartdate,
        fenddate: fenddate,
        fjtgj: fjtgj,
        finter: finter,
        fcountry: fcountry,
        fccrs: fccrs,
        fccts: fccts,
        _check: function () {

            return mx;
        }

    });
    return mx._check();
}
function mxItem_zdf(fzdrs,fzdbz,fsqje,fzdcs,fzddd,fsjms) {

    var mx = Object.create({
        fzdrs: fzdrs,
        fzdbz: fzdbz,
        fsqje: fsqje,
        fzdcs: fzdcs,
        fzddd: fzddd,
        fsjms: fsjms,
        _check: function () {
            return mx;
        }

    });
    return mx._check();
}

function Save() {

}

function reSave() {

}
function hasRead() {
    var pid = $("#stepId").val();
    var fbillno = $("#fbillno").val();

    var fname = $("#fname").val();
    var fno = $("#fno").val();
    var fdate = $("#fdate").val();
    var fdept = $("#fdept").val();
    var fcompany = $("#fcompany").val();
    var fcllb = $("#fcllb").val();
    var fif_jk = $("#fif_jk").val();
    var fif_sqzdf = $("#fif_sqzdf").val();
    var ftotal_sqje = $("#ftotal_sqje").val();
    var fdxje = $("#fdxje").val();
    var fbz = $("#fbz").val();
    var fyqf = $("#fyqf").val();
    var fyqr = $("#fyqr").val();
    var ftel = $("#ftel").val();
    var fcz = $("#fcz").val();
    var fsqje_ctjtf = $("#fsqje_ctjtf").text();
    var fyxts_zsf = $("#fyxts_zsf").text();
    var ffxbz_zsf = $("#ffxbz_zsf").text();
    var fsqje_zsf = $("#fsqje_zsf").text();
    var fyxts_cf = $("#fyxts_cf").text();
    var ffxbz_cf = $("#ffxbz_cf").text();
    var fsqje_cf = $("#fsqje_cf").text();
    var fyxts_snjtf = $("#fyxts_snjtf").text();
    var ffxbz_snjtf = $("#ffxbz_snjtf").text();
    var fsqje_snjtf = $("#fsqje_snjtf").text();
    var fsqje_qtclf = $("#fsqje_qtclf").text();
    var ffxbz_total = $("#ffxbz_total").text();
    var fsqje_total = $("#fsqje_total").text();
    var fsqje_dx = $("#fsqje_dx").val();
    var fcbz = $("#fcbz").val();
    var fccrw = $("#fccrw").val();
    var fjkje = $("#fjkje").val();
    var fjkje_dx = $("#fjkje_dx").val();
    var fjkdh = $("#fjkdh").val();
    var fjksy = $("#fjksy").val();
    var ftotal_zdf = $("#ftotal_zdf").val();
    var ftotal_zdf_dx = $("#ftotal_zdf_dx").val();

    var mxlistArr1 = new Array();
    $("#mxlist_internal").find("#mx").each(function () {
        var fzwjb = $(this).find("#fzwjb").val();
        var fstartdate = $(this).find("#fstartdate").val();
        var fenddate = $(this).find("#fenddate").val();
        var fjtgj = $(this).find("#fjtgj").val();
        var fprovince = $(this).find("#fprovince").val();
        var fcity = $(this).find("#fcity").val();
        var fproid = $(this).find("#fproid").val();
        var fdqlb = $(this).find("#fdqlb").val();
        var fccrs = $(this).find("#fccrs").val();
        var fccts = $(this).find("#fccts").val();

        var mx = mxItem_internal(fzwjb, fstartdate, fenddate, fjtgj, fprovince, fcity, fproid, fdqlb, fccrs, fccts);
        mxlistArr1.push(mx);


    });

    var mxlistArr2 = new Array();
    $("#mxlist_international").find("#mx").each(function () {
        var fzwjb = $(this).find("#fzwjb").val();
        var fstartdate = $(this).find("#fstartdate").val();
        var fenddate = $(this).find("#fenddate").val();
        var fjtgj = $(this).find("#fjtgj").val();
        var finter = $(this).find("#finter").val();
        var fcountry = $(this).find("#fcountry").val();
        var fccrs = $(this).find("#fccrs").val();
        var fccts = $(this).find("#fccts").val();

        var mx = mxItem_international(fzwjb, fstartdate, fenddate, fjtgj, finter, fcountry, fccrs, fccts);
        mxlistArr2.push(mx);
    });

    var mxlistArr3 = new Array();
    $("#mxlist_zdf").find("#mx").each(function () {

        var fzdrs = $(this).find("#fzdrs").val();
        var fzdbz = $(this).find("#fzdbz").val();
        var fsqje = $(this).find("#fsqje").val();
        var fzdcs = $(this).find("#fzdcs").val();
        var fzddd = $(this).find("#fzddd").val();
        var fsjms = $(this).find("#fsjms").val();

        var mx = mxItem_zdf(fzdrs, fzdbz, fsqje, fzdcs, fzddd, fsjms);
        mxlistArr3.push(mx);
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

            xml = xml + '<建设公司_差旅费申请_主表>';
            xml = xml + '  <单号>' + fbillno + '</单号>';
            xml = xml + '<申请人>' + fname + '</申请人>';
            xml = xml + ' <申请人工号>' + fno + '</申请人工号>';
            xml = xml + '<申请日期>' + fdate + '</申请日期>';
            xml = xml + '  <部门名称>' + fdept + '</部门名称>';
            xml = xml + ' <公司名称>' + fcompany + '</公司名称>';
            xml = xml + ' <差旅类别>' + fcllb + '</差旅类别>';
            xml = xml + ' <是否借款>' + fif_jk + '</是否借款>';
            xml = xml + ' <是否申请招待费>' + fif_sqzdf + '</是否申请招待费>';
            xml = xml + ' <总申请金额>' + ftotal_sqje + '</总申请金额>';
            xml = xml + ' <大写金额>' + fdxje + '</大写金额>';
            xml = xml + ' <备注>' + fbz + '</备注>';
            xml = xml + '<邀请方>' + fyqf + '</邀请方>';
            xml = xml + ' <邀请人>' + fyqr + '</邀请人>';
            xml = xml + ' <电话>' + ftel + '</电话>';
            xml = xml + ' <传真>' + fcz + '</传真>';
            xml = xml + ' <申请金额_长途交通费>' + fsqje_ctjtf + '</申请金额_长途交通费>';
            xml = xml + '<出差任务内容>' + fccrw + '</出差任务内容>';
            xml = xml + ' <有效天数_住宿费>' + fyxts_zsf + '</有效天数_住宿费>';
            xml = xml + ' <分项标准合计_住宿费>' + ffxbz_zsf + '</分项标准合计_住宿费>';
            xml = xml + ' <申请金额_住宿费>' + fsqje_zsf + '</申请金额_住宿费>';
            xml = xml + ' <超标准情况>' + fcbz + '</超标准情况>';
            xml = xml + ' <有效天数_餐费>' + fyxts_cf + '</有效天数_餐费>';
            xml = xml + ' <分项标准合计_餐费>' + ffxbz_cf + '</分项标准合计_餐费>';
            xml = xml + ' <申请金额_餐费>' + fsqje_cf + '</申请金额_餐费>';
            xml = xml + ' <有效天数_市内交通费>' + fyxts_snjtf + '</有效天数_市内交通费>';
            xml = xml + '  <分项标准合计_市内交通费>' + ffxbz_snjtf + '</分项标准合计_市内交通费>';
            xml = xml + '  <申请金额_市内交通费>' + fsqje_snjtf + '</申请金额_市内交通费>';
            xml = xml + '  <申请金额_其他差旅费>' + fsqje_qtclf + '</申请金额_其他差旅费>';
            xml = xml + ' <合计_差旅费_分项标准>' + ffxbz_total + '</合计_差旅费_分项标准>';
            xml = xml + '  <合计_差旅费_申请金额>' + fsqje_total + '</合计_差旅费_申请金额>';
            xml = xml + '  <大写金额_差旅费>' + fsqje_dx + '</大写金额_差旅费>';
            xml = xml + ' <合计_招待费_申请金额>' + ftotal_zdf + '</合计_招待费_申请金额>';
            xml = xml + '  <大写金额_招待费>' + ftotal_zdf_dx + '</大写金额_招待费>';
            xml = xml + ' <借款金额>' + fjkje + '</借款金额>';
            xml = xml + '  <大写金额_借款单>' + fjkje_dx + '</大写金额_借款单>';
            xml = xml + '  <借款单号>' + fjkdh + '</借款单号>';
            xml = xml + '  <借款事由>' + fjksy + '</借款事由>';
            xml = xml + ' </建设公司_差旅费申请_主表>';

            if (mxlistArr1.length != 0) {
                for (var i = 0; i < mxlistArr1.length;i++){
                    xml = xml + ' <建设公司_差旅费申请_子表国内>';
                    xml = xml + '  <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                    xml = xml + ' <RowPrimaryKeys>itemid=' + itemidArr1[i] + '</RowPrimaryKeys>';
                    xml = xml + ' <序号>' + (i + 1) + '</序号>';
                    xml = xml + ' <国内_职务级别>' + mxlistArr1[i].fzwjb + '</国内_职务级别>';
                    xml = xml + ' <国内_出差时间开始>' + mxlistArr1[i].fstartdate + '</国内_出差时间开始>';
                    xml = xml + ' <国内_出差时间结束>' + mxlistArr1[i].fenddate + '</国内_出差时间结束>';
                    xml = xml + ' <国内_交通工具>' + mxlistArr1[i].fjtgj + '</国内_交通工具>';
                    xml = xml + ' <国内_省>' + mxlistArr1[i].fprovince + '</国内_省>';
                    xml = xml + '  <国内_市>' + mxlistArr1[i].fcity + '</国内_市>';
                    xml = xml + '  <国内_省ID>' + mxlistArr1[i].fproid + '</国内_省ID>';
                    xml = xml + ' <国内_出差地区类别>' + mxlistArr1[i].fdqlb + '</国内_出差地区类别>';
                    xml = xml + ' <国内_出差人数>' + mxlistArr1[i].fccrs + '</国内_出差人数>';
                    xml = xml + ' <国内_出差天数>' + mxlistArr1[i].fccts + '</国内_出差天数>';
                    xml = xml + ' </建设公司_差旅费申请_子表国内>';
                }
            } else {
                xml = xml + ' <建设公司_差旅费申请_子表国内>';
                xml = xml + ' <RelationRowGuid>1</RelationRowGuid>';
                xml = xml + ' <RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + ' <序号></序号>';
                xml = xml + ' <国内_职务级别></国内_职务级别>';
                xml = xml + ' <国内_出差时间开始></国内_出差时间开始>';
                xml = xml + ' <国内_出差时间结束></国内_出差时间结束>';
                xml = xml + ' <国内_交通工具></国内_交通工具>';
                xml = xml + ' <国内_省></国内_省>';
                xml = xml + ' <国内_市></国内_市>';
                xml = xml + ' <国内_省ID></国内_省ID>';
                xml = xml + ' <国内_出差地区类别></国内_出差地区类别>';
                xml = xml + ' <国内_出差人数></国内_出差人数>';
                xml = xml + ' <国内_出差天数></国内_出差天数>';
                xml = xml + '</建设公司_差旅费申请_子表国内>';
            }

            if (mxlistArr2.length != 0) {
                for (var i = 0; i < mxlistArr2.length; i++) {
                    xml = xml + ' <建设公司_差旅费申请_子表国外>';
                    xml = xml + '  <RelationRowGuid>' + mxlistArr1.length + i + 1 + '</RelationRowGuid>';
                    xml = xml + ' <RowPrimaryKeys>itemid=' + itemidArr2[i] + '</RowPrimaryKeys>';
                    xml = xml + ' <序号>' + (i + 1) + '</序号>';
                    xml = xml + ' <国外_职务级别>' + mxlistArr2[i].fzwjb + '</国外_职务级别>';
                    xml = xml + ' <国外_出差时间开始>' + mxlistArr2[i].fstartdate + '</国外_出差时间开始>';
                    xml = xml + ' <国外_出差时间结束>' + mxlistArr2[i].fenddate + '</国外_出差时间结束>';
                    xml = xml + ' <国外_交通工具>' + mxlistArr2[i].fjtgj + '</国外_交通工具>';
                    xml = xml + ' <国外_出差地点州>' + mxlistArr2[i].finter + '</国外_出差地点州>';
                    xml = xml + ' <国外_出差地点国家>' + mxlistArr2[i].fcountry + '</国外_出差地点国家>';
                    xml = xml + ' <国外_出差人数>' + mxlistArr2[i].fccrs + '</国外_出差人数>';
                    xml = xml + '  <国外_出差天数>' + mxlistArr2[i].fccts + '</国外_出差天数>';
                    xml = xml + '</建设公司_差旅费申请_子表国外>';
                }

            } else {
                xml = xml + ' <建设公司_差旅费申请_子表国外>';
                xml = xml + '  <RelationRowGuid>' + mxlistArr1.length + i + 1 + '</RelationRowGuid>';
                xml = xml + ' <RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + ' <序号></序号>';
                xml = xml + ' <国外_职务级别></国外_职务级别>';
                xml = xml + ' <国外_出差时间开始></国外_出差时间开始>';
                xml = xml + ' <国外_出差时间结束></国外_出差时间结束>';
                xml = xml + ' <国外_交通工具></国外_交通工具>';
                xml = xml + ' <国外_出差地点州></国外_出差地点州>';
                xml = xml + ' <国外_出差地点国家></国外_出差地点国家>';
                xml = xml + ' <国外_出差人数></国外_出差人数>';
                xml = xml + '  <国外_出差天数></国外_出差天数>';
                xml = xml + '</建设公司_差旅费申请_子表国外>';
            }

            if (mxlistArr3.length != 0) {
                for (var i = 0; i < mxlistArr3.length;i++){
                    xml = xml + '<建设公司_差旅费申请_子表招待>';
                    xml = xml + ' <RelationRowGuid>' + mxlistArr1.length + mxlistArr2.length + 1 + i + '</RelationRowGuid>';
                    xml = xml + '<RowPrimaryKeys>itemid=' + itemidArr3[i] + '</RowPrimaryKeys>';
                    xml = xml + '<序号>' + (i + 1) + '</序号>';
                    xml = xml + '<招待人数>' + mxlistArr3[i].fzdrs + '</招待人数>';
                    xml = xml + ' <单人招待标准>' + mxlistArr3[i].fzdbz + '</单人招待标准>';
                    xml = xml + ' <申请金额>' + mxlistArr3[i].fsqje + '</申请金额>';
                    xml = xml + ' <招待城市>' + mxlistArr3[i].fzdcs + '</招待城市>';
                    xml = xml + ' <招待地点>' + mxlistArr3[i].fzddd + '</招待地点>';
                    xml = xml + ' <事件描述>' + mxlistArr3[i].fsjms + '</事件描述>';
                    xml = xml + ' </建设公司_差旅费申请_子表招待>';
                }
            } else {
                xml = xml + '<建设公司_差旅费申请_子表招待>';
                xml = xml + ' <RelationRowGuid>' + mxlistArr1.length + mxlistArr2.length + 1 + i + '</RelationRowGuid>';
                xml = xml + '<RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + '<序号></序号>';
                xml = xml + '<招待人数></招待人数>';
                xml = xml + ' <单人招待标准></单人招待标准>';
                xml = xml + ' <申请金额></申请金额>';
                xml = xml + ' <招待城市></招待城市>';
                xml = xml + ' <招待地点></招待地点>';
                xml = xml + ' <事件描述></事件描述>';
                xml = xml + ' </建设公司_差旅费申请_子表招待>';
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
    var fcllb = $("#fcllb").val();
    var fif_jk = $("#fif_jk").val();
    var fif_sqzdf = $("#fif_sqzdf").val();
    var ftotal_sqje = $("#ftotal_sqje").val();
    var fdxje = $("#fdxje").val();
    var fbz = $("#fbz").val();
    var fyqf = $("#fyqf").val();
    var fyqr = $("#fyqr").val();
    var ftel = $("#ftel").val();
    var fcz = $("#fcz").val();
    var fsqje_ctjtf = $("#fsqje_ctjtf").text();
    var fyxts_zsf = $("#fyxts_zsf").text();
    var ffxbz_zsf = $("#ffxbz_zsf").text();
    var fsqje_zsf = $("#fsqje_zsf").text();
    var fyxts_cf = $("#fyxts_cf").text();
    var ffxbz_cf = $("#ffxbz_cf").text();
    var fsqje_cf = $("#fsqje_cf").text();
    var fyxts_snjtf = $("#fyxts_snjtf").text();
    var ffxbz_snjtf = $("#ffxbz_snjtf").text();
    var fsqje_snjtf = $("#fsqje_snjtf").text();
    var fsqje_qtclf = $("#fsqje_qtclf").text();
    var ffxbz_total = $("#ffxbz_total").text();
    var fsqje_total = $("#fsqje_total").text();
    var fsqje_dx = $("#fsqje_dx").val();
    var fcbz = $("#fcbz").val();
    var fccrw = $("#fccrw").val();
    var fjkje = $("#fjkje").val();
    var fjkje_dx = $("#fjkje_dx").val();
    var fjkdh = $("#fjkdh").val();
    var fjksy = $("#fjksy").val();
    var ftotal_zdf = $("#ftotal_zdf").val();
    var ftotal_zdf_dx = $("#ftotal_zdf_dx").val();

    var mxlistArr1 = new Array();
    $("#mxlist_internal").find("#mx").each(function () {
        var fzwjb = $(this).find("#fzwjb").val();
        var fstartdate = $(this).find("#fstartdate").val();
        var fenddate = $(this).find("#fenddate").val();
        var fjtgj = $(this).find("#fjtgj").val();
        var fprovince = $(this).find("#fprovince").val();
        var fcity = $(this).find("#fcity").val();
        var fproid = $(this).find("#fproid").val();
        var fdqlb = $(this).find("#fdqlb").val();
        var fccrs = $(this).find("#fccrs").val();
        var fccts = $(this).find("#fccts").val();

        var mx = mxItem_internal(fzwjb, fstartdate, fenddate, fjtgj, fprovince, fcity, fproid, fdqlb, fccrs, fccts);
        mxlistArr1.push(mx);


    });

    var mxlistArr2 = new Array();
    $("#mxlist_international").find("#mx").each(function () {
        var fzwjb = $(this).find("#fzwjb").val();
        var fstartdate = $(this).find("#fstartdate").val();
        var fenddate = $(this).find("#fenddate").val();
        var fjtgj = $(this).find("#fjtgj").val();
        var finter = $(this).find("#finter").val();
        var fcountry = $(this).find("#fcountry").val();
        var fccrs = $(this).find("#fccrs").val();
        var fccts = $(this).find("#fccts").val();

        var mx = mxItem_international(fzwjb, fstartdate, fenddate, fjtgj, finter, fcountry, fccrs, fccts);
        mxlistArr2.push(mx);
    });

    var mxlistArr3 = new Array();
    $("#mxlist_zdf").find("#mx").each(function () {

        var fzdrs = $(this).find("#fzdrs").val();
        var fzdbz = $(this).find("#fzdbz").val();
        var fsqje = $(this).find("#fsqje").val();
        var fzdcs = $(this).find("#fzdcs").val();
        var fzddd = $(this).find("#fzddd").val();
        var fsjms = $(this).find("#fsjms").val();

        var mx = mxItem_zdf(fzdrs, fzdbz, fsqje, fzdcs, fzddd, fsjms);
        mxlistArr3.push(mx);
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


            xml = xml + '<建设公司_差旅费申请_主表>';
            xml = xml + '  <单号>' + fbillno + '</单号>';
            xml = xml + '<申请人>' + fname + '</申请人>';
            xml = xml + ' <申请人工号>' + fno + '</申请人工号>';
            xml = xml + '<申请日期>' + fdate + '</申请日期>';
            xml = xml + '  <部门名称>' + fdept + '</部门名称>';
            xml = xml + ' <公司名称>' + fcompany + '</公司名称>';
            xml = xml + ' <差旅类别>' + fcllb + '</差旅类别>';
            xml = xml + ' <是否借款>' + fif_jk + '</是否借款>';
            xml = xml + ' <是否申请招待费>' + fif_sqzdf + '</是否申请招待费>';
            xml = xml + ' <总申请金额>' + ftotal_sqje + '</总申请金额>';
            xml = xml + ' <大写金额>' + fdxje + '</大写金额>';
            xml = xml + ' <备注>' + fbz + '</备注>';
            xml = xml + '<邀请方>' + fyqf + '</邀请方>';
            xml = xml + ' <邀请人>' + fyqr + '</邀请人>';
            xml = xml + ' <电话>' + ftel + '</电话>';
            xml = xml + ' <传真>' + fcz + '</传真>';
            xml = xml + ' <申请金额_长途交通费>' + fsqje_ctjtf + '</申请金额_长途交通费>';
            xml = xml + '<出差任务内容>' + fccrw + '</出差任务内容>';
            xml = xml + ' <有效天数_住宿费>' + fyxts_zsf + '</有效天数_住宿费>';
            xml = xml + ' <分项标准合计_住宿费>' + ffxbz_zsf + '</分项标准合计_住宿费>';
            xml = xml + ' <申请金额_住宿费>' + fsqje_zsf + '</申请金额_住宿费>';
            xml = xml + ' <超标准情况>' + fcbz + '</超标准情况>';
            xml = xml + ' <有效天数_餐费>' + fyxts_cf + '</有效天数_餐费>';
            xml = xml + ' <分项标准合计_餐费>' + ffxbz_cf + '</分项标准合计_餐费>';
            xml = xml + ' <申请金额_餐费>' + fsqje_cf + '</申请金额_餐费>';
            xml = xml + ' <有效天数_市内交通费>' + fyxts_snjtf + '</有效天数_市内交通费>';
            xml = xml + '  <分项标准合计_市内交通费>' + ffxbz_snjtf + '</分项标准合计_市内交通费>';
            xml = xml + '  <申请金额_市内交通费>' + fsqje_snjtf + '</申请金额_市内交通费>';
            xml = xml + '  <申请金额_其他差旅费>' + fsqje_qtclf + '</申请金额_其他差旅费>';
            xml = xml + ' <合计_差旅费_分项标准>' + ffxbz_total + '</合计_差旅费_分项标准>';
            xml = xml + '  <合计_差旅费_申请金额>' + fsqje_total + '</合计_差旅费_申请金额>';
            xml = xml + '  <大写金额_差旅费>' + fsqje_dx + '</大写金额_差旅费>';
            xml = xml + ' <合计_招待费_申请金额>' + ftotal_zdf + '</合计_招待费_申请金额>';
            xml = xml + '  <大写金额_招待费>' + ftotal_zdf_dx + '</大写金额_招待费>';
            xml = xml + ' <借款金额>' + fjkje + '</借款金额>';
            xml = xml + '  <大写金额_借款单>' + fjkje_dx + '</大写金额_借款单>';
            xml = xml + '  <借款单号>' + fjkdh + '</借款单号>';
            xml = xml + '  <借款事由>' + fjksy + '</借款事由>';
            xml = xml + ' </建设公司_差旅费申请_主表>';

            if (mxlistArr1.length != 0) {
                for (var i = 0; i < mxlistArr1.length; i++) {
                    xml = xml + ' <建设公司_差旅费申请_子表国内>';
                    xml = xml + '  <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                    xml = xml + ' <RowPrimaryKeys>itemid=' + itemidArr1[i] + '</RowPrimaryKeys>';
                    xml = xml + ' <序号>' + (i + 1) + '</序号>';
                    xml = xml + ' <国内_职务级别>' + mxlistArr1[i].fzwjb + '</国内_职务级别>';
                    xml = xml + ' <国内_出差时间开始>' + mxlistArr1[i].fstartdate + '</国内_出差时间开始>';
                    xml = xml + ' <国内_出差时间结束>' + mxlistArr1[i].fenddate + '</国内_出差时间结束>';
                    xml = xml + ' <国内_交通工具>' + mxlistArr1[i].fjtgj + '</国内_交通工具>';
                    xml = xml + ' <国内_省>' + mxlistArr1[i].fprovince + '</国内_省>';
                    xml = xml + '  <国内_市>' + mxlistArr1[i].fcity + '</国内_市>';
                    xml = xml + '  <国内_省ID>' + mxlistArr1[i].fproid + '</国内_省ID>';
                    xml = xml + ' <国内_出差地区类别>' + mxlistArr1[i].fdqlb + '</国内_出差地区类别>';
                    xml = xml + ' <国内_出差人数>' + mxlistArr1[i].fccrs + '</国内_出差人数>';
                    xml = xml + ' <国内_出差天数>' + mxlistArr1[i].fccts + '</国内_出差天数>';
                    xml = xml + ' </建设公司_差旅费申请_子表国内>';
                }
            } else {
                xml = xml + ' <建设公司_差旅费申请_子表国内>';
                xml = xml + ' <RelationRowGuid>1</RelationRowGuid>';
                xml = xml + ' <RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + ' <序号></序号>';
                xml = xml + ' <国内_职务级别></国内_职务级别>';
                xml = xml + ' <国内_出差时间开始></国内_出差时间开始>';
                xml = xml + ' <国内_出差时间结束></国内_出差时间结束>';
                xml = xml + ' <国内_交通工具></国内_交通工具>';
                xml = xml + ' <国内_省></国内_省>';
                xml = xml + ' <国内_市></国内_市>';
                xml = xml + ' <国内_省ID></国内_省ID>';
                xml = xml + ' <国内_出差地区类别></国内_出差地区类别>';
                xml = xml + ' <国内_出差人数></国内_出差人数>';
                xml = xml + ' <国内_出差天数></国内_出差天数>';
                xml = xml + '</建设公司_差旅费申请_子表国内>';
            }

            if (mxlistArr2.length != 0) {
                for (var i = 0; i < mxlistArr2.length; i++) {
                    xml = xml + ' <建设公司_差旅费申请_子表国外>';
                    xml = xml + '  <RelationRowGuid>' + mxlistArr1.length + i + 1 + '</RelationRowGuid>';
                    xml = xml + ' <RowPrimaryKeys>itemid=' + itemidArr2[i] + '</RowPrimaryKeys>';
                    xml = xml + ' <序号>' + (i + 1) + '</序号>';
                    xml = xml + ' <国外_职务级别>' + mxlistArr2[i].fzwjb + '</国外_职务级别>';
                    xml = xml + ' <国外_出差时间开始>' + mxlistArr2[i].fstartdate + '</国外_出差时间开始>';
                    xml = xml + ' <国外_出差时间结束>' + mxlistArr2[i].fenddate + '</国外_出差时间结束>';
                    xml = xml + ' <国外_交通工具>' + mxlistArr2[i].fjtgj + '</国外_交通工具>';
                    xml = xml + ' <国外_出差地点州>' + mxlistArr2[i].finter + '</国外_出差地点州>';
                    xml = xml + ' <国外_出差地点国家>' + mxlistArr2[i].fcountry + '</国外_出差地点国家>';
                    xml = xml + ' <国外_出差人数>' + mxlistArr2[i].fccrs + '</国外_出差人数>';
                    xml = xml + '  <国外_出差天数>' + mxlistArr2[i].fccts + '</国外_出差天数>';
                    xml = xml + '</建设公司_差旅费申请_子表国外>';
                }

            } else {
                xml = xml + ' <建设公司_差旅费申请_子表国外>';
                xml = xml + '  <RelationRowGuid>' + mxlistArr1.length + i + 1 + '</RelationRowGuid>';
                xml = xml + ' <RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + ' <序号></序号>';
                xml = xml + ' <国外_职务级别></国外_职务级别>';
                xml = xml + ' <国外_出差时间开始></国外_出差时间开始>';
                xml = xml + ' <国外_出差时间结束></国外_出差时间结束>';
                xml = xml + ' <国外_交通工具></国外_交通工具>';
                xml = xml + ' <国外_出差地点州></国外_出差地点州>';
                xml = xml + ' <国外_出差地点国家></国外_出差地点国家>';
                xml = xml + ' <国外_出差人数></国外_出差人数>';
                xml = xml + '  <国外_出差天数></国外_出差天数>';
                xml = xml + '</建设公司_差旅费申请_子表国外>';
            }

            if (mxlistArr3.length != 0) {
                for (var i = 0; i < mxlistArr3.length; i++) {
                    xml = xml + '<建设公司_差旅费申请_子表招待>';
                    xml = xml + ' <RelationRowGuid>' + mxlistArr1.length + mxlistArr2.length + 1 + i + '</RelationRowGuid>';
                    xml = xml + '<RowPrimaryKeys>itemid=' + itemidArr3[i] + '</RowPrimaryKeys>';
                    xml = xml + '<序号>' + (i + 1) + '</序号>';
                    xml = xml + '<招待人数>' + mxlistArr3[i].fzdrs + '</招待人数>';
                    xml = xml + ' <单人招待标准>' + mxlistArr3[i].fzdbz + '</单人招待标准>';
                    xml = xml + ' <申请金额>' + mxlistArr3[i].fsqje + '</申请金额>';
                    xml = xml + ' <招待城市>' + mxlistArr3[i].fzdcs + '</招待城市>';
                    xml = xml + ' <招待地点>' + mxlistArr3[i].fzddd + '</招待地点>';
                    xml = xml + ' <事件描述>' + mxlistArr3[i].fsjms + '</事件描述>';
                    xml = xml + ' </建设公司_差旅费申请_子表招待>';
                }
            } else {
                xml = xml + '<建设公司_差旅费申请_子表招待>';
                xml = xml + ' <RelationRowGuid>' + mxlistArr1.length + mxlistArr2.length + 1 + i + '</RelationRowGuid>';
                xml = xml + '<RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + '<序号></序号>';
                xml = xml + '<招待人数></招待人数>';
                xml = xml + ' <单人招待标准></单人招待标准>';
                xml = xml + ' <申请金额></申请金额>';
                xml = xml + ' <招待城市></招待城市>';
                xml = xml + ' <招待地点></招待地点>';
                xml = xml + ' <事件描述></事件描述>';
                xml = xml + ' </建设公司_差旅费申请_子表招待>';
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


        xml = xml + '<建设公司_差旅费申请_主表>';
        xml = xml + '  <单号>' + fbillno + '</单号>';
        xml = xml + '<申请人>' + fname + '</申请人>';
        xml = xml + ' <申请人工号>' + fno + '</申请人工号>';
        xml = xml + '<申请日期>' + fdate + '</申请日期>';
        xml = xml + '  <部门名称>' + fdept + '</部门名称>';
        xml = xml + ' <公司名称>' + fcompany + '</公司名称>';
        xml = xml + ' <差旅类别>' + fcllb + '</差旅类别>';
        xml = xml + ' <是否借款>' + fif_jk + '</是否借款>';
        xml = xml + ' <是否申请招待费>' + fif_sqzdf + '</是否申请招待费>';
        xml = xml + ' <总申请金额>' + ftotal_sqje + '</总申请金额>';
        xml = xml + ' <大写金额>' + fdxje + '</大写金额>';
        xml = xml + ' <备注>' + fbz + '</备注>';
        xml = xml + '<邀请方>' + fyqf + '</邀请方>';
        xml = xml + ' <邀请人>' + fyqr + '</邀请人>';
        xml = xml + ' <电话>' + ftel + '</电话>';
        xml = xml + ' <传真>' + fcz + '</传真>';
        xml = xml + ' <申请金额_长途交通费>' + fsqje_ctjtf + '</申请金额_长途交通费>';
        xml = xml + '<出差任务内容>' + fccrw + '</出差任务内容>';
        xml = xml + ' <有效天数_住宿费>' + fyxts_zsf + '</有效天数_住宿费>';
        xml = xml + ' <分项标准合计_住宿费>' + ffxbz_zsf + '</分项标准合计_住宿费>';
        xml = xml + ' <申请金额_住宿费>' + fsqje_zsf + '</申请金额_住宿费>';
        xml = xml + ' <超标准情况>' + fcbz + '</超标准情况>';
        xml = xml + ' <有效天数_餐费>' + fyxts_cf + '</有效天数_餐费>';
        xml = xml + ' <分项标准合计_餐费>' + ffxbz_cf + '</分项标准合计_餐费>';
        xml = xml + ' <申请金额_餐费>' + fsqje_cf + '</申请金额_餐费>';
        xml = xml + ' <有效天数_市内交通费>' + fyxts_snjtf + '</有效天数_市内交通费>';
        xml = xml + '  <分项标准合计_市内交通费>' + ffxbz_snjtf + '</分项标准合计_市内交通费>';
        xml = xml + '  <申请金额_市内交通费>' + fsqje_snjtf + '</申请金额_市内交通费>';
        xml = xml + '  <申请金额_其他差旅费>' + fsqje_qtclf + '</申请金额_其他差旅费>';
        xml = xml + ' <合计_差旅费_分项标准>' + ffxbz_total + '</合计_差旅费_分项标准>';
        xml = xml + '  <合计_差旅费_申请金额>' + fsqje_total + '</合计_差旅费_申请金额>';
        xml = xml + '  <大写金额_差旅费>' + fsqje_dx + '</大写金额_差旅费>';
        xml = xml + ' <合计_招待费_申请金额>' + ftotal_zdf + '</合计_招待费_申请金额>';
        xml = xml + '  <大写金额_招待费>' + ftotal_zdf_dx + '</大写金额_招待费>';
        xml = xml + ' <借款金额>' + fjkje + '</借款金额>';
        xml = xml + '  <大写金额_借款单>' + fjkje_dx + '</大写金额_借款单>';
        xml = xml + '  <借款单号>' + fjkdh + '</借款单号>';
        xml = xml + '  <借款事由>' + fjksy + '</借款事由>';
        xml = xml + ' </建设公司_差旅费申请_主表>';

        if (mxlistArr1.length != 0) {
            for (var i = 0; i < mxlistArr1.length; i++) {
                xml = xml + ' <建设公司_差旅费申请_子表国内>';
                xml = xml + '  <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml = xml + ' <RowPrimaryKeys>itemid=' + itemidArr1[i] + '</RowPrimaryKeys>';
                xml = xml + ' <序号>' + (i + 1) + '</序号>';
                xml = xml + ' <国内_职务级别>' + mxlistArr1[i].fzwjb + '</国内_职务级别>';
                xml = xml + ' <国内_出差时间开始>' + mxlistArr1[i].fstartdate + '</国内_出差时间开始>';
                xml = xml + ' <国内_出差时间结束>' + mxlistArr1[i].fenddate + '</国内_出差时间结束>';
                xml = xml + ' <国内_交通工具>' + mxlistArr1[i].fjtgj + '</国内_交通工具>';
                xml = xml + ' <国内_省>' + mxlistArr1[i].fprovince + '</国内_省>';
                xml = xml + '  <国内_市>' + mxlistArr1[i].fcity + '</国内_市>';
                xml = xml + '  <国内_省ID>' + mxlistArr1[i].fproid + '</国内_省ID>';
                xml = xml + ' <国内_出差地区类别>' + mxlistArr1[i].fdqlb + '</国内_出差地区类别>';
                xml = xml + ' <国内_出差人数>' + mxlistArr1[i].fccrs + '</国内_出差人数>';
                xml = xml + ' <国内_出差天数>' + mxlistArr1[i].fccts + '</国内_出差天数>';
                xml = xml + ' </建设公司_差旅费申请_子表国内>';
            }
        } else {
            xml = xml + ' <建设公司_差旅费申请_子表国内>';
            xml = xml + ' <RelationRowGuid>1</RelationRowGuid>';
            xml = xml + ' <RowPrimaryKeys></RowPrimaryKeys>';
            xml = xml + ' <序号></序号>';
            xml = xml + ' <国内_职务级别></国内_职务级别>';
            xml = xml + ' <国内_出差时间开始></国内_出差时间开始>';
            xml = xml + ' <国内_出差时间结束></国内_出差时间结束>';
            xml = xml + ' <国内_交通工具></国内_交通工具>';
            xml = xml + ' <国内_省></国内_省>';
            xml = xml + ' <国内_市></国内_市>';
            xml = xml + ' <国内_省ID></国内_省ID>';
            xml = xml + ' <国内_出差地区类别></国内_出差地区类别>';
            xml = xml + ' <国内_出差人数></国内_出差人数>';
            xml = xml + ' <国内_出差天数></国内_出差天数>';
            xml = xml + '</建设公司_差旅费申请_子表国内>';
        }

        if (mxlistArr2.length != 0) {
            for (var i = 0; i < mxlistArr2.length; i++) {
                xml = xml + ' <建设公司_差旅费申请_子表国外>';
                xml = xml + '  <RelationRowGuid>' + mxlistArr1.length + i + 1 + '</RelationRowGuid>';
                xml = xml + ' <RowPrimaryKeys>itemid=' + itemidArr2[i] + '</RowPrimaryKeys>';
                xml = xml + ' <序号>' + (i + 1) + '</序号>';
                xml = xml + ' <国外_职务级别>' + mxlistArr2[i].fzwjb + '</国外_职务级别>';
                xml = xml + ' <国外_出差时间开始>' + mxlistArr2[i].fstartdate + '</国外_出差时间开始>';
                xml = xml + ' <国外_出差时间结束>' + mxlistArr2[i].fenddate + '</国外_出差时间结束>';
                xml = xml + ' <国外_交通工具>' + mxlistArr2[i].fjtgj + '</国外_交通工具>';
                xml = xml + ' <国外_出差地点州>' + mxlistArr2[i].finter + '</国外_出差地点州>';
                xml = xml + ' <国外_出差地点国家>' + mxlistArr2[i].fcountry + '</国外_出差地点国家>';
                xml = xml + ' <国外_出差人数>' + mxlistArr2[i].fccrs + '</国外_出差人数>';
                xml = xml + '  <国外_出差天数>' + mxlistArr2[i].fccts + '</国外_出差天数>';
                xml = xml + '</建设公司_差旅费申请_子表国外>';
            }

        } else {
            xml = xml + ' <建设公司_差旅费申请_子表国外>';
            xml = xml + '  <RelationRowGuid>' + mxlistArr1.length + i + 1 + '</RelationRowGuid>';
            xml = xml + ' <RowPrimaryKeys></RowPrimaryKeys>';
            xml = xml + ' <序号></序号>';
            xml = xml + ' <国外_职务级别></国外_职务级别>';
            xml = xml + ' <国外_出差时间开始></国外_出差时间开始>';
            xml = xml + ' <国外_出差时间结束></国外_出差时间结束>';
            xml = xml + ' <国外_交通工具></国外_交通工具>';
            xml = xml + ' <国外_出差地点州></国外_出差地点州>';
            xml = xml + ' <国外_出差地点国家></国外_出差地点国家>';
            xml = xml + ' <国外_出差人数></国外_出差人数>';
            xml = xml + '  <国外_出差天数></国外_出差天数>';
            xml = xml + '</建设公司_差旅费申请_子表国外>';
        }

        if (mxlistArr3.length != 0) {
            for (var i = 0; i < mxlistArr3.length; i++) {
                xml = xml + '<建设公司_差旅费申请_子表招待>';
                xml = xml + ' <RelationRowGuid>' + mxlistArr1.length + mxlistArr2.length + 1 + i + '</RelationRowGuid>';
                xml = xml + '<RowPrimaryKeys>itemid=' + itemidArr3[i] + '</RowPrimaryKeys>';
                xml = xml + '<序号>' + (i + 1) + '</序号>';
                xml = xml + '<招待人数>' + mxlistArr3[i].fzdrs + '</招待人数>';
                xml = xml + ' <单人招待标准>' + mxlistArr3[i].fzdbz + '</单人招待标准>';
                xml = xml + ' <申请金额>' + mxlistArr3[i].fsqje + '</申请金额>';
                xml = xml + ' <招待城市>' + mxlistArr3[i].fzdcs + '</招待城市>';
                xml = xml + ' <招待地点>' + mxlistArr3[i].fzddd + '</招待地点>';
                xml = xml + ' <事件描述>' + mxlistArr3[i].fsjms + '</事件描述>';
                xml = xml + ' </建设公司_差旅费申请_子表招待>';
            }
        } else {
            xml = xml + '<建设公司_差旅费申请_子表招待>';
            xml = xml + ' <RelationRowGuid>' + mxlistArr1.length + mxlistArr2.length + 1 + i + '</RelationRowGuid>';
            xml = xml + '<RowPrimaryKeys></RowPrimaryKeys>';
            xml = xml + '<序号></序号>';
            xml = xml + '<招待人数></招待人数>';
            xml = xml + ' <单人招待标准></单人招待标准>';
            xml = xml + ' <申请金额></申请金额>';
            xml = xml + ' <招待城市></招待城市>';
            xml = xml + ' <招待地点></招待地点>';
            xml = xml + ' <事件描述></事件描述>';
            xml = xml + ' </建设公司_差旅费申请_子表招待>';
        }
        xml = xml + '</FormData>';
        xml = xml + '</XForm>';
        PostXml(xml);
    }
            
}