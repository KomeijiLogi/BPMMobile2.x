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


var itemidArr1 = new Array();
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
        var item = data.FormDataSet.建设公司_差旅费报销_主表[0];
        if (flag) {

            $("#taskId").val(item.TaskID);
            $("#stepId").val(stepId);
            //$("#fbillno").val(item.单号);

        }
        $("#fname").val(item.报销人);
        $("#fno").val(item.报销人工号);
        $("#fdate").val(FormatterTimeYMS(item.报销日期));
        $("#fdept").val(item.部门名称);
        $("#fcompany").val(item.公司名称);
        $("#fclfsqd").val(item.差旅费申请单号);
        $("#fclfsqd_taskid").val(item.差旅费申请单TaskID);
        $("#fif_zdf").val(item.是否申请招待费);
        if (String(item.是否申请招待费).indexOf('是') != -1) {
            $("#fif_zdfd").addClass('mui-active');
            $("#zdf").css('display', 'block');
        } else {
            $("#zdf").css('display', 'none');
        }
        $("#ftotal_bxje").val(item.总报销金额);
        $("#fdxje").val(item.大写金额);
        $("#fsqje_clf").val(item.差旅费申请金额);
        $("#fcsq_clf").val(item.差旅费超申请);
        $("#fcbz_clf").val(item.差旅费超标准);
        $("#fsqje_zdf").val(item.招待费申请金额);
        $("#fcsq_zdf").val(item.招待费超申请);
        $("#fjkje").val(item.借款金额);
        $("#fcllb").val(item.差旅类别);
        $("#fbz").val(item.备注);
        $("#fbxhj_clf").val(item.报销合计_差旅费);
        $("#fdxje_clf").val(item.大写金额_差旅费);
        $("#fbzhj_clf").val(item.标准合计_差旅费);
        $("#fdjs_clf").val(item.单据数_差旅费);
        $("#fbxhj_zdf").val(item.报销合计_招待费);
        $("#fdxje_zdf").val(item.大写金额_招待费);
        $("#fdjs_zdf").val(item.单据数_招待费);

        var item_c1 = data.FormDataSet.建设公司_差旅费报销_子表差旅;
        for (var i = 0; i < item_c1.length; i++) {
            itemidArr1.push(item_c1[i].itemid);
            var li = '  <div id="mx" class="mui-card">';
            li = li + '    <div class="mui-input-row itemtitle">';
            li = li + '       <label>差旅费列表项</label>';
            li = li + '       <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>';
            li = li + '    </div>';
            li = li + '    <div class="mui-input-row">';
            li = li + '       <label for="fstartdate">出发日期<i style="color:red;">*</i></label>';
            li = li + '       <input type="date" id="fstartdate" name="fstartdate" value="' + FormatterTimeYMS(item_c1[i].出发日期) + '" readonly="readonly"/>';
            li = li + '    </div>';
            li = li + '    <div class="mui-input-row">';
            li = li + '        <label for="fenddate">到达日期<i style="color:red;">*</i></label>';
            li = li + '        <input type="date" id="fenddate" name="fenddate" readonly="readonly" value="' + FormatterTimeYMS(item_c1[i].到达日期) + '"/>';
            li = li + '    </div>';
            li = li + '    <div class="mui-input-row">';
            li = li + '        <label for="fcfd_pro">出发地省<i style="color:red;">*</i></label>';
            li = li + '        <input type="text" id="fcfd_pro" name="fcfd_pro" readonly="readonly" value="' + item_c1[i].出发地省 + '"/>';
            li = li + '    </div>';
            li = li + '    <div class="mui-input-row">';
            li = li + '        <label for="fcfd_city">出发地市<i style="color:red;">*</i></label>';
            li = li + '        <input type="text" id="fcfd_city" name="fcfd_city" readonly="readonly" value="' + item_c1[i].出发地市 + '"/>';
            li = li + '    </div>';
            li = li + '    <input type="hidden" id="fcfd_proid" name="fcfd_proid"/>';
            li = li + '    <div class="mui-input-row">';
            li = li + '        <label for="fmdd_pro">目的地省<i style="color:red;">*</i></label>';
            li = li + '        <input type="text" id="fmdd_pro" name="fmdd_pro" readonly="readonly" value="' + item_c1[i].目的地省 + '"/>';
            li = li + '    </div>';
            li = li + '    <div class="mui-input-row">';
            li = li + '         <label for="fmdd_city">目的地市<i style="color:red;">*</i></label>';
            li = li + '         <input type="text" id="fmdd_city" name="fmdd_city" readonly="readonly" value="' + item_c1[i].目的地市 + '"/>';
            li = li + '   </div>';
            li = li + '   <input type="hidden" id="fmdd_proid" name="fmdd_proid"/>';
            li = li + '   <div class="mui-input-row">';
            li = li + '         <label for="fjtgj">交通工具<i style="color:red;">*</i></label>';
            li = li + '         <input type="text" id="fjtgj" name="fjtgj" readonly="readonly" value="' + item_c1[i].交通工具 + '"/>';
            li = li + '   </div>';
            li = li + '   <div class="mui-input-row">';
            li = li + '         <label for="frs">人数<i style="color:red;">*</i></label>';
            li = li + '         <input type="number" id="frs" name="frs" readonly="readonly" value="' + item_c1[i].人数 + '"/>';
            li = li + '   </div>';
            li = li + '   <div class="mui-input-row">';
            li = li + '         <label for="fctjtf">长途交通费<i style="color:red;">*</i></label>';
            li = li + '         <input type="number" id="fctjtf" name="fctjtf" readonly="readonly" value="' + item_c1[i].长途交通费 + '"/>';
            li = li + '   </div>';
            li = li + '   <div class="mui-input-row">';
            li = li + '        <label for="fts">天数<i style="color:red;">*</i></label>';
            li = li + '        <input type="number" id="fts" name="fts" readonly="readonly" value="' + item_c1[i].天数 + '"/>';
            li = li + '   </div>';
            li = li + '    <div class="mui-input-row itemtitle2">';
            li = li + '        <label>住宿费<i style="color:red;">*</i></label>';
            li = li + '    </div>';
            li = li + '   <div class="mui-input-row">';
            li = li + '        <label for="ffybz_zsf">费用标准</label>';
            li = li + '        <input type="number" id="ffybz_zsf" name="ffybz_zsf" readonly="readonly" value="' + item_c1[i].费用标准_住宿费 + '"/>';
            li = li + '   </div>';
            li = li + '   <div class="mui-input-row">';
            li = li + '        <label for="fbxje_zsf">报销金额</label>';
            li = li + '        <input type="number" id="fbxje_zsf" name="fbxje_zsf" readonly="readonly" value="' + item_c1[i].报销金额_住宿费 + '"/>';
            li = li + '   </div>';
            li = li + '    <div class="mui-input-row itemtitle2">';
            li = li + '        <label>餐费<i style="color:red;">*</i></label>';
            li = li + '    </div>';
            li = li + '   <div class="mui-input-row">';
            li = li + '        <label for="ffybz_cf">费用标准</label>';
            li = li + '        <input type="number" id="ffybz_cf" name="ffybz_cf" readonly="readonly" value="' + item_c1[i].费用标准_餐费 + '"/>';
            li = li + '   </div>';
            li = li + '   <div class="mui-input-row">';
            li = li + '        <label for="fbxje_cf">报销金额</label>';
            li = li + '        <input type="number" id="fbxje_cf" name="fbxje_cf" readonly="readonly" value="' + item_c1[i].报销金额_餐费 + '"/>';
            li = li + '   </div>';
            li = li + '    <div class="mui-input-row itemtitle2">';
            li = li + '        <label>市内交通费<i style="color:red;">*</i></label>';
            li = li + '    </div>';
            li = li + '   <div class="mui-input-row">';
            li = li + '        <label for="ffybz_snjtf">费用标准</label>';
            li = li + '        <input type="number" id="ffybz_snjtf" name="ffybz_snjtf" readonly="readonly" value="' + item_c1[i].费用标准_市内交通费 + '"/>';
            li = li + '   </div>';
            li = li + '   <div class="mui-input-row">';
            li = li + '        <label for="fbxje_snjtf">报销金额</label>';
            li = li + '        <input type="number" id="fbxje_snjtf" name="fbxje_snjtf" readonly="readonly" value="' + item_c1[i].报销金额_市内交通费 + '"/>';
            li = li + '   </div>';
            li = li + '   <div class="mui-input-row">';
            li = li + '        <label for="fqtfy">其他费用</label>';
            li = li + '        <input type="number" id="fqtfy" name="fqtfy" readonly="readonly" value="' + item_c1[i].其他费用 + '"/>';
            li = li + '   </div>';
            li = li + '   <div class="mui-input-row">';
            li = li + '        <label for="fgzcx">工作成效<i style="color:red;">*</i></label>';
            li = li + '        <input type="text" id="fgzcx" name="fgzcx" readonly="readonly" value="' + item_c1[i].工作成效 + '"/>';
            li = li + '   </div>';
            li = li + '</div>';
            $("#mxlist_clf").append(li);
        }

        var item_c2 = data.FormDataSet.建设公司_差旅费报销_子表招待;
        for (var i = 0; i < item_c2.length; i++) {
            itemidArr2.push(item_c2[i].itemid);
            var li = '  <div id="mx" class="mui-card">';
            li = li + '    <div class="mui-input-row itemtitle">';
            li = li + '       <label>招待费列表项</label>';
            li = li + '       <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>';
            li = li + '    </div>';
            li = li + '   <div class="mui-input-row">';
            li = li + '      <label for="fzdrs">招待人数</label>';
            li = li + '      <input type="number" id="fzdrs" name="fzdrs" readonly="readonly" value="' + item_c2[i].招待人数 + '" />';
            li = li + '   </div>';
            li = li + '   <div class="mui-input-row">';
            li = li + '      <label for="fzdbz">招待标准</label>';
            li = li + '      <input type="number" id="fzdbz" name="fzdbz" readonly="readonly" value="' + item_c2[i].单人招待标准 + '" />';
            li = li + '   </div>';
            li = li + '   <div class="mui-input-row">';
            li = li + '      <label for="fzdcs">招待城市</label>';
            li = li + '      <input type="text" id="fzdcs" name="fzdcs" readonly="readonly" value="' + item_c2[i].招待城市 + '" />';
            li = li + '   </div>';
            li = li + '   <div class="mui-input-row">';
            li = li + '      <label for="fzddd">招待地点</label>';
            li = li + '      <input type="text" id="fzddd" name="fzddd" readonly="readonly" value="' + item_c2[i].招待地点 + '" />';
            li = li + '   </div>';
            li = li + '   <div class="mui-input-row">';
            li = li + '      <label for="fbxje">报销金额</label>';
            li = li + '      <input type="number" id="fbxje" name="fbxje" readonly="readonly" value="' + item_c2[i].报销金额 + '" />';
            li = li + '   </div>';
            li = li + '   <div class="mui-input-row">';
            li = li + '      <label for="fgzcx">工作成效</label>';
            li = li + '      <input type="text" id="fgzcx" name="fgzcx" readonly="readonly" value="' + item_c2[i].工作成效 + '" />';
            li = li + '   </div>';
            li = li + ' </div>';
            $("#mxlist_zdf").append(li);
           
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


function mxItem_clf(fstartdate, fenddate, fcfd_pro, fcfd_city, fcfd_proid, fmdd_pro, fmdd_city, fmdd_proid,
    fjtgj, frs, fctjtf, fts, ffybz_zsf, fbxje_zsf, ffybz_cf, fbxje_cf, ffybz_snjtf, fbxje_snjtf, fqtfy, fgzcx) {
    var mx = Object.create({
        fstartdate: fstartdate,
        fenddate: fenddate,
        fcfd_pro: fcfd_pro,
        fcfd_city: fcfd_city,
        fcfd_proid: fcfd_proid,
        fmdd_pro: fmdd_pro,
        fmdd_city: fmdd_city,
        fmdd_proid: fmdd_proid,
        fjtgj: fjtgj,
        frs: frs,
        fctjtf: fctjtf,
        fts: fts,
        ffybz_zsf: ffybz_zsf,
        fbxje_zsf: fbxje_zsf,
        ffybz_cf: ffybz_cf,
        fbxje_cf: fbxje_cf,
        ffybz_snjtf: ffybz_snjtf,
        fbxje_snjtf: fbxje_snjtf,
        fqtfy: fqtfy,
        fgzcx: fgzcx,
        _check: function () {
            return mx;
        }

    });
    return mx._check();
}
function mxItem_zdf(fzdrs, fzdbz, fzdcs, fzddd, fbxje, fgzcx) {
    var mx = Object.create({
        fzdrs: fzdrs,
        fzdbz: fzdbz,
        fzdcs: fzdcs,
        fzddd: fzddd,
        fbxje: fbxje,
        fgzcx: fgzcx,
        _check: function () {
            return mx;
        }

    });

    return mx._check();


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

function Save() {

}
function reSave() {

}
function hasRead() {
    var pid = $("#stepId").val();
    var fbillno = $("#fbillno").val();
    var tid = $("#taskId").val();

    var fname = $("#fname").val();
    var fno = $("#fno").val();
    var fdate = $("#fdate").val();
    var fdept = $("#fdept").val();
    var fcompany = $("#fcompany").val();
    var fclfsqd = $("#fclfsqd").val();
    var fclfsqd_taskid = $("#fclfsqd_taskid").val();
    var fif_zdf = $("#fif_zdf").val();
    var ftotal_bxje = $("#ftotal_bxje").val();
    var fdxje = $("#fdxje").val();
    var fsqje_clf = $("#fsqje_clf").val();
    var fcsq_clf = $("#fcsq_clf").val();
    var fcbz_clf = $("#fcbz_clf").val();
    var fsqje_zdf = $("#fsqje_zdf").val();
    var fcsq_zdf = $("#fcsq_zdf").val();
    var fjkje = $("#fjkje").val();
    var fcllb = $("#fcllb").val();
    var fbz = $("#fbz").val();
    var fbxhj_clf = $("#fbxhj_clf").val();
    var fdxje_clf = $("#fdxje_clf").val();
    var fbzhj_clf = $("#fbzhj_clf").val();
    var fdjs_clf = $("#fdjs_clf").val();
    var fbxhj_zdf = $("#fbxhj_zdf").val();
    var fdxje_zdf = $("#fdxje_zdf").val();
    var fdjs_zdf = $("#fdjs_zdf").val();

    var mxlistArr1 = new Array();
    $("#mxlist_clf").find("#mx").each(function () {
        var fstartdate = $(this).find("#fstartdate").val();
        var fenddate = $(this).find("#fenddate").val();
        var fcfd_pro = $(this).find("#fcfd_pro").val();
        var fcfd_city = $(this).find("#fcfd_city").val();
        var fcfd_proid = $(this).find("#fcfd_proid").val();
        var fmdd_pro = $(this).find("#fmdd_pro").val();
        var fmdd_city = $(this).find("#fmdd_city").val();
        var fmdd_proid = $(this).find("#fmdd_proid").val();
        var fjtgj = $(this).find("#fjtgj").val();
        var frs = $(this).find("#frs").val();
        var fctjtf = $(this).find("#fctjtf").val();
        var fts = $(this).find("#fts").val();
        var ffybz_zsf = $(this).find("#ffybz_zsf").val();
        var fbxje_zsf = $(this).find("#fbxje_zsf").val();
        var ffybz_cf = $(this).find("#ffybz_cf").val();
        var fbxje_cf = $(this).find("#fbxje_cf").val();
        var ffybz_snjtf = $(this).find("#ffybz_snjtf").val();
        var fbxje_snjtf = $(this).find("#fbxje_snjtf").val();
        var fqtfy = $(this).find("#fqtfy").val();
        var fgzcx = $(this).find("#fgzcx").val();


        var mx = mxItem_clf(fstartdate, fenddate, fcfd_pro, fcfd_city, fcfd_proid, fmdd_pro, fmdd_city, fmdd_proid,
            fjtgj, frs, fctjtf, fts, ffybz_zsf, fbxje_zsf, ffybz_cf, fbxje_cf, ffybz_snjtf, fbxje_snjtf, fqtfy, fgzcx);
        mxlistArr1.push(mx);
    });

    var mxlistArr2 = new Array();
    $("#mxlist_zdf").find("#mx").each(function () {

        var fzdrs = $(this).find("#fzdrs").val();
        var fzdbz = $(this).find("#fzdbz").val();
        var fzdcs = $(this).find("#fzdcs").val();
        var fzddd = $(this).find("#fzddd").val();
        var fbxje = $(this).find("#fbxje").val();
        var fgzcx = $(this).find("#fgzcx").val();

        var mx = mxItem_zdf(fzdrs, fzdbz, fzdcs, fzddd, fbxje, fgzcx);
        mxlistArr2.push(mx);
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

            xml = xml + '<建设公司_差旅费报销_主表>';
            xml = xml + ' <报销人>' + fname + '</报销人>';
            xml = xml + ' <报销人工号>' + fno + '</报销人工号>';
            xml = xml + ' <报销日期>' + fdate + '</报销日期>';
            xml = xml + ' <部门名称>' + fdept + '</部门名称>';
            xml = xml + ' <TaskID>' + tid + '</TaskID>';
            xml = xml + ' <公司名称>' + fcompany + '</公司名称>';
            xml = xml + ' <差旅费申请单号>' + fclfsqd + '</差旅费申请单号>';
            xml = xml + ' <差旅费申请单TaskID>' + fclfsqd_taskid + '</差旅费申请单TaskID>';
            xml = xml + ' <是否申请招待费>' + fif_zdf + '</是否申请招待费>';
            xml = xml + '  <总报销金额>' + ftotal_bxje + '</总报销金额>';
            xml = xml + ' <大写金额>' + fdxje + '</大写金额>';
            xml = xml + ' <差旅费申请金额>' + fsqje_clf+'</差旅费申请金额>';
            xml = xml + ' <差旅费超申请>' + fcsq_clf+'</差旅费超申请>';
            xml = xml + '  <差旅费超标准>' + fcbz_clf+'</差旅费超标准>';
            xml = xml + '  <招待费申请金额>' + fsqje_zdf+'</招待费申请金额>';
            xml = xml + '  <招待费超申请>' + fcsq_zdf + '</招待费超申请>';
            xml = xml + '  <借款金额>' + fjkje + '</借款金额>';
            xml = xml + ' <差旅类别>' + fcllb + '</差旅类别>';
            xml = xml + '  <备注>' + fbz + '</备注>';
            xml = xml + '  <报销合计_差旅费>' + fbxhj_clf + '</报销合计_差旅费>';
            xml = xml + '  <大写金额_差旅费>' + fdxje_clf+'</大写金额_差旅费>';
            xml = xml + '  <标准合计_差旅费>' + fbzhj_clf+'</标准合计_差旅费>';
            xml = xml + '  <单据数_差旅费>' + fdjs_clf+'</单据数_差旅费>';
            xml = xml + '  <报销合计_招待费>' + fbxhj_zdf+'</报销合计_招待费>';
            xml = xml + '  <大写金额_招待费>'+fdxje_zdf+'</大写金额_招待费>';
            xml = xml + '  <单据数_招待费>' + fdjs_zdf + '</单据数_招待费>';
            if (fjArray.length != 0) {
                xml = xml + '  <上传票据>' + fjArray.toString().replace(",", ";") + '</上传票据>';
            } else {
                xml = xml + '  <上传票据></上传票据>';
            }
           
            xml = xml + ' </建设公司_差旅费报销_主表>';

            for (var i = 0; i < mxlistArr1.length; i++) {
                xml = xml + '  <建设公司_差旅费报销_子表差旅>';
                xml = xml + ' <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml = xml + '  <RowPrimaryKeys>itemid=' + itemidArr1[i] + '</RowPrimaryKeys>';
                xml = xml + ' <序号>' + (i + 1) + '</序号>';
                xml = xml + '   <出发日期>' + mxlistArr1[i].fstartdate + '</出发日期>';
                xml = xml + '  <到达日期>' + mxlistArr1[i].fenddate + '</到达日期>';
                xml = xml + '  <出发地省>' + mxlistArr1[i].fcfd_pro + '</出发地省>';
                xml = xml + '  <出发地市>' + mxlistArr1[i].fcfd_city + '</出发地市>';
                xml = xml + '  <出发地省ID>' + mxlistArr1[i].fcfd_proid + '</出发地省ID>';
                xml = xml + '   <目的地省>' + mxlistArr1[i].fmdd_pro + '</目的地省>';
                xml = xml + '  <目的地市>' + mxlistArr1[i].fmdd_city + '</目的地市>';
                xml = xml + '  <目的地省ID>' + mxlistArr1[i].fmdd_proid + '</目的地省ID>';
                xml = xml + '  <交通工具>' + mxlistArr1[i].fjtgj + '</交通工具>';
                xml = xml + '  <人数>' + mxlistArr1[i].frs + '</人数>';
                xml = xml + '  <长途交通费>' + mxlistArr1[i].fctjtf + '</长途交通费>';
                xml = xml + '  <天数>' + mxlistArr1[i].fts + '</天数>';
                xml = xml + '  <费用标准_住宿费>' + mxlistArr1[i].ffybz_zsf + '</费用标准_住宿费>';
                xml = xml + '  <报销金额_住宿费>' + mxlistArr1[i].fbxje_zsf + '</报销金额_住宿费>';
                xml = xml + '  <费用标准_餐费>' + mxlistArr1[i].ffybz_cf + '</费用标准_餐费>';
                xml = xml + ' <报销金额_餐费>' + mxlistArr1[i].fbxje_cf + '</报销金额_餐费>';
                xml = xml + '  <费用标准_市内交通费>' + mxlistArr1[i].ffybz_snjtf + '</费用标准_市内交通费>';
                xml = xml + '  <报销金额_市内交通费>' + mxlistArr1[i].fbxje_snjtf + '</报销金额_市内交通费>';
                xml = xml + '  <其他费用>' + mxlistArr1[i].fqtfy + '</其他费用>';
                xml = xml + '   <工作成效>' + mxlistArr1[i].fgzcx + '</工作成效>';
                xml = xml + ' </建设公司_差旅费报销_子表差旅>';
            }
            if (mxlistArr2.length != 0) {
                for (var i = 0; i < mxlistArr2.length;i++){
                    xml = xml + '  <建设公司_差旅费报销_子表招待>';
                    xml = xml + '  <RelationRowGuid>' + mxlistArr1.length + 1 + i + '</RelationRowGuid>';
                    xml = xml + ' <RowPrimaryKeys>itemid=' + itemidArr2[i] + '</RowPrimaryKeys>';
                    xml = xml + ' <序号>' + i + 1 + '</序号>';
                    xml = xml + ' <招待人数>' + mxlistArr2[i].fzdrs + '</招待人数>';
                    xml = xml + ' <单人招待标准>' + mxlistArr2[i].fzdbz + '</单人招待标准>';
                    xml = xml + ' <招待城市>' + mxlistArr2[i].fzdcs + '</招待城市>';
                    xml = xml + ' <招待地点>' + mxlistArr2[i].fzddd + '</招待地点>';
                    xml = xml + ' <报销金额>' + mxlistArr2[i].fbxje + '</报销金额>';
                    xml = xml + ' <工作成效>' + mxlistArr2[i].fgzcx + '</工作成效>';
                    xml = xml + '</建设公司_差旅费报销_子表招待>';
                }
            } else {
                xml = xml + '  <建设公司_差旅费报销_子表招待>';
                xml = xml + '  <RelationRowGuid>' + mxlistArr1.length+1 + '</RelationRowGuid>';
                xml = xml + ' <RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + ' <序号>1</序号>';
                xml = xml + ' <招待人数></招待人数>';
                xml = xml + ' <单人招待标准></单人招待标准>';
                xml = xml + ' <招待城市></招待城市>';
                xml = xml + ' <招待地点></招待地点>';
                xml = xml + ' <报销金额></报销金额>';
                xml = xml + ' <工作成效></工作成效>';
                xml = xml + '</建设公司_差旅费报销_子表招待>';
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

    var tid = $("#taskId").val();

    var fname = $("#fname").val();
    var fno = $("#fno").val();
    var fdate = $("#fdate").val();
    var fdept = $("#fdept").val();
    var fcompany = $("#fcompany").val();
    var fclfsqd = $("#fclfsqd").val();
    var fclfsqd_taskid = $("#fclfsqd_taskid").val();
    var fif_zdf = $("#fif_zdf").val();
    var ftotal_bxje = $("#ftotal_bxje").val();
    var fdxje = $("#fdxje").val();
    var fsqje_clf = $("#fsqje_clf").val();
    var fcsq_clf = $("#fcsq_clf").val();
    var fcbz_clf = $("#fcbz_clf").val();
    var fsqje_zdf = $("#fsqje_zdf").val();
    var fcsq_zdf = $("#fcsq_zdf").val();
    var fjkje = $("#fjkje").val();
    var fcllb = $("#fcllb").val();
    var fbz = $("#fbz").val();
    var fbxhj_clf = $("#fbxhj_clf").val();
    var fdxje_clf = $("#fdxje_clf").val();
    var fbzhj_clf = $("#fbzhj_clf").val();
    var fdjs_clf = $("#fdjs_clf").val();
    var fbxhj_zdf = $("#fbxhj_zdf").val();
    var fdxje_zdf = $("#fdxje_zdf").val();
    var fdjs_zdf = $("#fdjs_zdf").val();

    var mxlistArr1 = new Array();
    $("#mxlist_clf").find("#mx").each(function () {
        var fstartdate = $(this).find("#fstartdate").val();
        var fenddate = $(this).find("#fenddate").val();
        var fcfd_pro = $(this).find("#fcfd_pro").val();
        var fcfd_city = $(this).find("#fcfd_city").val();
        var fcfd_proid = $(this).find("#fcfd_proid").val();
        var fmdd_pro = $(this).find("#fmdd_pro").val();
        var fmdd_city = $(this).find("#fmdd_city").val();
        var fmdd_proid = $(this).find("#fmdd_proid").val();
        var fjtgj = $(this).find("#fjtgj").val();
        var frs = $(this).find("#frs").val();
        var fctjtf = $(this).find("#fctjtf").val();
        var fts = $(this).find("#fts").val();
        var ffybz_zsf = $(this).find("#ffybz_zsf").val();
        var fbxje_zsf = $(this).find("#fbxje_zsf").val();
        var ffybz_cf = $(this).find("#ffybz_cf").val();
        var fbxje_cf = $(this).find("#fbxje_cf").val();
        var ffybz_snjtf = $(this).find("#ffybz_snjtf").val();
        var fbxje_snjtf = $(this).find("#fbxje_snjtf").val();
        var fqtfy = $(this).find("#fqtfy").val();
        var fgzcx = $(this).find("#fgzcx").val();


        var mx = mxItem_clf(fstartdate, fenddate, fcfd_pro, fcfd_city, fcfd_proid, fmdd_pro, fmdd_city, fmdd_proid,
            fjtgj, frs, fctjtf, fts, ffybz_zsf, fbxje_zsf, ffybz_cf, fbxje_cf, ffybz_snjtf, fbxje_snjtf, fqtfy, fgzcx);
        mxlistArr1.push(mx);
    });

    var mxlistArr2 = new Array();
    $("#mxlist_zdf").find("#mx").each(function () {

        var fzdrs = $(this).find("#fzdrs").val();
        var fzdbz = $(this).find("#fzdbz").val();
        var fzdcs = $(this).find("#fzdcs").val();
        var fzddd = $(this).find("#fzddd").val();
        var fbxje = $(this).find("#fbxje").val();
        var fgzcx = $(this).find("#fgzcx").val();

        var mx = mxItem_zdf(fzdrs, fzdbz, fzdcs, fzddd, fbxje, fgzcx);
        mxlistArr2.push(mx);
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

            xml = xml + '<建设公司_差旅费报销_主表>';
            xml = xml + ' <报销人>' + fname + '</报销人>';
            xml = xml + ' <报销人工号>' + fno + '</报销人工号>';
            xml = xml + ' <报销日期>' + fdate + '</报销日期>';
            xml = xml + ' <部门名称>' + fdept + '</部门名称>';
            xml = xml + ' <TaskID>' + tid + '</TaskID>';
            xml = xml + ' <公司名称>' + fcompany + '</公司名称>';
            xml = xml + ' <差旅费申请单号>' + fclfsqd + '</差旅费申请单号>';
            xml = xml + ' <差旅费申请单TaskID>' + fclfsqd_taskid + '</差旅费申请单TaskID>';
            xml = xml + ' <是否申请招待费>' + fif_zdf + '</是否申请招待费>';
            xml = xml + '  <总报销金额>' + ftotal_bxje + '</总报销金额>';
            xml = xml + ' <大写金额>' + fdxje + '</大写金额>';
            xml = xml + ' <差旅费申请金额>' + fsqje_clf + '</差旅费申请金额>';
            xml = xml + ' <差旅费超申请>' + fcsq_clf + '</差旅费超申请>';
            xml = xml + '  <差旅费超标准>' + fcbz_clf + '</差旅费超标准>';
            xml = xml + '  <招待费申请金额>' + fsqje_zdf + '</招待费申请金额>';
            xml = xml + '  <招待费超申请>' + fcsq_zdf + '</招待费超申请>';
            xml = xml + '  <借款金额>' + fjkje + '</借款金额>';
            xml = xml + ' <差旅类别>' + fcllb + '</差旅类别>';
            xml = xml + '  <备注>' + fbz + '</备注>';
            xml = xml + '  <报销合计_差旅费>' + fbxhj_clf + '</报销合计_差旅费>';
            xml = xml + '  <大写金额_差旅费>' + fdxje_clf + '</大写金额_差旅费>';
            xml = xml + '  <标准合计_差旅费>' + fbzhj_clf + '</标准合计_差旅费>';
            xml = xml + '  <单据数_差旅费>' + fdjs_clf + '</单据数_差旅费>';
            xml = xml + '  <报销合计_招待费>' + fbxhj_zdf + '</报销合计_招待费>';
            xml = xml + '  <大写金额_招待费>' + fdxje_zdf + '</大写金额_招待费>';
            xml = xml + '  <单据数_招待费>' + fdjs_zdf + '</单据数_招待费>';
            if (fjArray.length != 0) {
                xml = xml + '  <上传票据>' + fjArray.toString().replace(",", ";") + '</上传票据>';
            } else {
                xml = xml + '  <上传票据></上传票据>';
            }

            xml = xml + ' </建设公司_差旅费报销_主表>';

            for (var i = 0; i < mxlistArr1.length; i++) {
                xml = xml + '  <建设公司_差旅费报销_子表差旅>';
                xml = xml + ' <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml = xml + '  <RowPrimaryKeys>itemid=' + itemidArr1[i] + '</RowPrimaryKeys>';
                xml = xml + ' <序号>' + (i + 1) + '</序号>';
                xml = xml + '   <出发日期>' + mxlistArr1[i].fstartdate + '</出发日期>';
                xml = xml + '  <到达日期>' + mxlistArr1[i].fenddate + '</到达日期>';
                xml = xml + '  <出发地省>' + mxlistArr1[i].fcfd_pro + '</出发地省>';
                xml = xml + '  <出发地市>' + mxlistArr1[i].fcfd_city + '</出发地市>';
                xml = xml + '  <出发地省ID>' + mxlistArr1[i].fcfd_proid + '</出发地省ID>';
                xml = xml + '   <目的地省>' + mxlistArr1[i].fmdd_pro + '</目的地省>';
                xml = xml + '  <目的地市>' + mxlistArr1[i].fmdd_city + '</目的地市>';
                xml = xml + '  <目的地省ID>' + mxlistArr1[i].fmdd_proid + '</目的地省ID>';
                xml = xml + '  <交通工具>' + mxlistArr1[i].fjtgj + '</交通工具>';
                xml = xml + '  <人数>' + mxlistArr1[i].frs + '</人数>';
                xml = xml + '  <长途交通费>' + mxlistArr1[i].fctjtf + '</长途交通费>';
                xml = xml + '  <天数>' + mxlistArr1[i].fts + '</天数>';
                xml = xml + '  <费用标准_住宿费>' + mxlistArr1[i].ffybz_zsf + '</费用标准_住宿费>';
                xml = xml + '  <报销金额_住宿费>' + mxlistArr1[i].fbxje_zsf + '</报销金额_住宿费>';
                xml = xml + '  <费用标准_餐费>' + mxlistArr1[i].ffybz_cf + '</费用标准_餐费>';
                xml = xml + ' <报销金额_餐费>' + mxlistArr1[i].fbxje_cf + '</报销金额_餐费>';
                xml = xml + '  <费用标准_市内交通费>' + mxlistArr1[i].ffybz_snjtf + '</费用标准_市内交通费>';
                xml = xml + '  <报销金额_市内交通费>' + mxlistArr1[i].fbxje_snjtf + '</报销金额_市内交通费>';
                xml = xml + '  <其他费用>' + mxlistArr1[i].fqtfy + '</其他费用>';
                xml = xml + '   <工作成效>' + mxlistArr1[i].fgzcx + '</工作成效>';
                xml = xml + ' </建设公司_差旅费报销_子表差旅>';
            }
            if (mxlistArr2.length != 0) {
                for (var i = 0; i < mxlistArr2.length; i++) {
                    xml = xml + '  <建设公司_差旅费报销_子表招待>';
                    xml = xml + '  <RelationRowGuid>' + mxlistArr1.length + 1 + i + '</RelationRowGuid>';
                    xml = xml + ' <RowPrimaryKeys>itemid=' + itemidArr2[i] + '</RowPrimaryKeys>';
                    xml = xml + ' <序号>' + i + 1 + '</序号>';
                    xml = xml + ' <招待人数>' + mxlistArr2[i].fzdrs + '</招待人数>';
                    xml = xml + ' <单人招待标准>' + mxlistArr2[i].fzdbz + '</单人招待标准>';
                    xml = xml + ' <招待城市>' + mxlistArr2[i].fzdcs + '</招待城市>';
                    xml = xml + ' <招待地点>' + mxlistArr2[i].fzddd + '</招待地点>';
                    xml = xml + ' <报销金额>' + mxlistArr2[i].fbxje + '</报销金额>';
                    xml = xml + ' <工作成效>' + mxlistArr2[i].fgzcx + '</工作成效>';
                    xml = xml + '</建设公司_差旅费报销_子表招待>';
                }
            } else {
                xml = xml + '  <建设公司_差旅费报销_子表招待>';
                xml = xml + '  <RelationRowGuid>' + mxlistArr1.length + 1 + '</RelationRowGuid>';
                xml = xml + ' <RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + ' <序号>1</序号>';
                xml = xml + ' <招待人数></招待人数>';
                xml = xml + ' <单人招待标准></单人招待标准>';
                xml = xml + ' <招待城市></招待城市>';
                xml = xml + ' <招待地点></招待地点>';
                xml = xml + ' <报销金额></报销金额>';
                xml = xml + ' <工作成效></工作成效>';
                xml = xml + '</建设公司_差旅费报销_子表招待>';
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

        xml = xml + '<建设公司_差旅费报销_主表>';
        xml = xml + ' <报销人>' + fname + '</报销人>';
        xml = xml + ' <报销人工号>' + fno + '</报销人工号>';
        xml = xml + ' <报销日期>' + fdate + '</报销日期>';
        xml = xml + ' <部门名称>' + fdept + '</部门名称>';
        xml = xml + ' <TaskID>' + tid + '</TaskID>';
        xml = xml + ' <公司名称>' + fcompany + '</公司名称>';
        xml = xml + ' <差旅费申请单号>' + fclfsqd + '</差旅费申请单号>';
        xml = xml + ' <差旅费申请单TaskID>' + fclfsqd_taskid + '</差旅费申请单TaskID>';
        xml = xml + ' <是否申请招待费>' + fif_zdf + '</是否申请招待费>';
        xml = xml + '  <总报销金额>' + ftotal_bxje + '</总报销金额>';
        xml = xml + ' <大写金额>' + fdxje + '</大写金额>';
        xml = xml + ' <差旅费申请金额>' + fsqje_clf + '</差旅费申请金额>';
        xml = xml + ' <差旅费超申请>' + fcsq_clf + '</差旅费超申请>';
        xml = xml + '  <差旅费超标准>' + fcbz_clf + '</差旅费超标准>';
        xml = xml + '  <招待费申请金额>' + fsqje_zdf + '</招待费申请金额>';
        xml = xml + '  <招待费超申请>' + fcsq_zdf + '</招待费超申请>';
        xml = xml + '  <借款金额>' + fjkje + '</借款金额>';
        xml = xml + ' <差旅类别>' + fcllb + '</差旅类别>';
        xml = xml + '  <备注>' + fbz + '</备注>';
        xml = xml + '  <报销合计_差旅费>' + fbxhj_clf + '</报销合计_差旅费>';
        xml = xml + '  <大写金额_差旅费>' + fdxje_clf + '</大写金额_差旅费>';
        xml = xml + '  <标准合计_差旅费>' + fbzhj_clf + '</标准合计_差旅费>';
        xml = xml + '  <单据数_差旅费>' + fdjs_clf + '</单据数_差旅费>';
        xml = xml + '  <报销合计_招待费>' + fbxhj_zdf + '</报销合计_招待费>';
        xml = xml + '  <大写金额_招待费>' + fdxje_zdf + '</大写金额_招待费>';
        xml = xml + '  <单据数_招待费>' + fdjs_zdf + '</单据数_招待费>';
        if (fjArray.length != 0) {
            xml = xml + '  <上传票据>' + fjArray.toString().replace(",", ";") + '</上传票据>';
        } else {
            xml = xml + '  <上传票据></上传票据>';
        }

        xml = xml + ' </建设公司_差旅费报销_主表>';

        for (var i = 0; i < mxlistArr1.length; i++) {
            xml = xml + '  <建设公司_差旅费报销_子表差旅>';
            xml = xml + ' <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
            xml = xml + '  <RowPrimaryKeys>itemid=' + itemidArr1[i] + '</RowPrimaryKeys>';
            xml = xml + ' <序号>' + (i + 1) + '</序号>';
            xml = xml + '   <出发日期>' + mxlistArr1[i].fstartdate + '</出发日期>';
            xml = xml + '  <到达日期>' + mxlistArr1[i].fenddate + '</到达日期>';
            xml = xml + '  <出发地省>' + mxlistArr1[i].fcfd_pro + '</出发地省>';
            xml = xml + '  <出发地市>' + mxlistArr1[i].fcfd_city + '</出发地市>';
            xml = xml + '  <出发地省ID>' + mxlistArr1[i].fcfd_proid + '</出发地省ID>';
            xml = xml + '   <目的地省>' + mxlistArr1[i].fmdd_pro + '</目的地省>';
            xml = xml + '  <目的地市>' + mxlistArr1[i].fmdd_city + '</目的地市>';
            xml = xml + '  <目的地省ID>' + mxlistArr1[i].fmdd_proid + '</目的地省ID>';
            xml = xml + '  <交通工具>' + mxlistArr1[i].fjtgj + '</交通工具>';
            xml = xml + '  <人数>' + mxlistArr1[i].frs + '</人数>';
            xml = xml + '  <长途交通费>' + mxlistArr1[i].fctjtf + '</长途交通费>';
            xml = xml + '  <天数>' + mxlistArr1[i].fts + '</天数>';
            xml = xml + '  <费用标准_住宿费>' + mxlistArr1[i].ffybz_zsf + '</费用标准_住宿费>';
            xml = xml + '  <报销金额_住宿费>' + mxlistArr1[i].fbxje_zsf + '</报销金额_住宿费>';
            xml = xml + '  <费用标准_餐费>' + mxlistArr1[i].ffybz_cf + '</费用标准_餐费>';
            xml = xml + ' <报销金额_餐费>' + mxlistArr1[i].fbxje_cf + '</报销金额_餐费>';
            xml = xml + '  <费用标准_市内交通费>' + mxlistArr1[i].ffybz_snjtf + '</费用标准_市内交通费>';
            xml = xml + '  <报销金额_市内交通费>' + mxlistArr1[i].fbxje_snjtf + '</报销金额_市内交通费>';
            xml = xml + '  <其他费用>' + mxlistArr1[i].fqtfy + '</其他费用>';
            xml = xml + '   <工作成效>' + mxlistArr1[i].fgzcx + '</工作成效>';
            xml = xml + ' </建设公司_差旅费报销_子表差旅>';
        }
        if (mxlistArr2.length != 0) {
            for (var i = 0; i < mxlistArr2.length; i++) {
                xml = xml + '  <建设公司_差旅费报销_子表招待>';
                xml = xml + '  <RelationRowGuid>' + mxlistArr1.length + 1 + i + '</RelationRowGuid>';
                xml = xml + ' <RowPrimaryKeys>itemid=' + itemidArr2[i] + '</RowPrimaryKeys>';
                xml = xml + ' <序号>' + i + 1 + '</序号>';
                xml = xml + ' <招待人数>' + mxlistArr2[i].fzdrs + '</招待人数>';
                xml = xml + ' <单人招待标准>' + mxlistArr2[i].fzdbz + '</单人招待标准>';
                xml = xml + ' <招待城市>' + mxlistArr2[i].fzdcs + '</招待城市>';
                xml = xml + ' <招待地点>' + mxlistArr2[i].fzddd + '</招待地点>';
                xml = xml + ' <报销金额>' + mxlistArr2[i].fbxje + '</报销金额>';
                xml = xml + ' <工作成效>' + mxlistArr2[i].fgzcx + '</工作成效>';
                xml = xml + '</建设公司_差旅费报销_子表招待>';
            }
        } else {
            xml = xml + '  <建设公司_差旅费报销_子表招待>';
            xml = xml + '  <RelationRowGuid>' + mxlistArr1.length + 1 + '</RelationRowGuid>';
            xml = xml + ' <RowPrimaryKeys></RowPrimaryKeys>';
            xml = xml + ' <序号>1</序号>';
            xml = xml + ' <招待人数></招待人数>';
            xml = xml + ' <单人招待标准></单人招待标准>';
            xml = xml + ' <招待城市></招待城市>';
            xml = xml + ' <招待地点></招待地点>';
            xml = xml + ' <报销金额></报销金额>';
            xml = xml + ' <工作成效></工作成效>';
            xml = xml + '</建设公司_差旅费报销_子表招待>';
        }

        xml = xml + '</FormData>';
        xml = xml + '</XForm>';
        PostXml(xml);
    }
}