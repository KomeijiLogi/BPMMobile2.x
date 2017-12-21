function prepMsg() {
    $("#fdate").val(getNowFormatDate(2));
    tapEvent();
    var xml = '<?xml version= "1.0" ?>';
    xml = xml + '   <Requests>';
    xml = xml + '   <Params>';
    xml = xml + '       <Method>GetFormPostData</Method>';
    xml = xml + '       <ProcessName>医用材料公司授权申请</ProcessName>';
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
        $("#fname").val(item.申请人);
        $("#fdept").val(item.所属区域);
        $("#fno").val(item.申请人编号);

    }).fail(function (e) {

    });
}

function tapEvent() {

    var fytdata = [
        {
            value: '',
            text:'投标'
        },
        {
            value: '',
            text:'销售'
        },
        {
            value: '',
            text:'其他'
        }

    ];

    var element = document.getElementById('fsqsyt');

    var picker = new mui.PopPicker();

    picker.setData(fytdata);

    element.addEventListener('tap', function () {

        picker.show(function (items) {

            element.value = items[0].text;
            if (String(items[0].text).indexOf('其他') != -1) {
                $("#fqt").removeAttr('readonly');
                $("#fqt").attr('placeholder','请填写该项');
            } else {
                $("#fqt").removeAttr('placeholder');
                $("#fqt").attr('readonly', 'readonly');
            }
        });

    }, false);


    var fsqlxdata = [

        {
            value: '',
            text:'个人授权'
        },
        {
            value: '',
            text:'公司授权'
        }
    ];
    showPicker('fsqlx', fsqlxdata);

    var ffsdata = [

        {
            value: '',
            text:'电子版'
        },
        {
            value: '',
            text: '纸质版'
        }
    ];
    showPicker('fsqjsfs', ffsdata);
}

function initData(data, flag) {

    var item = data.FormDataSet.医用材料公司_代理公司授权申请[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.单号);
    }
    $("#fno").val(item.申请人编号);
    $("#fname").val(item.申请人);
    $("#fdept").val(item.所属区域);
    $("#fdate").val(FormatterTimeYMS(item.申请日期));
    $("#ftel").val(item.联系方式);
    $("#fsqsyt").val(item.联系方式);
    $("#fqt").val(changeNullToEmpty(item.其他信息));
    $("#fsqlx").val(item.授权类型);
    $("#fbsqr").val(item.被授权人);
    $("#fbsqyy").val(item.被授权医院);
    $("#fcpmc").val(item.授权产品名称);
    $("#fsqsj").val(item.授权时间);
    $("#fsqjsfs").val(item.授权接受方式);
    $("#fshrxx").val(item.收货人信息);
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
                            'fileName': attachArray1[$(this)[0].id].name,
                            'fileExt': attachArray1[$(this)[0].id].type,
                            'fileTime': attachArray1[$(this)[0].id].time,
                            'fileSize': attachArray1[$(this)[0].id].size,
                            'fileDownloadUrl': attachArray1[$(this)[0].id].downurl
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


}

action = '同意';
function nodeControllerExp(NodeName) {
    if (NodeName == '开始') {
        tapEvent();
        upload();
        $(".upload-addbtn").show();
        $("#ftel,#fbsqr,#fbsqyy,#fcpmc,#fsqsj,#fshrxx").removeAttr('readonly').attr('placeholder', '请填写该项');

    } else if (NodeName == "sysInform") {

    } else {
        if (typeof (NodeName) != "undefined") {
            if (String(NodeName).indexOf('投标专员')!=-1) {
                action = '确认';
                $("#agreebt").text(action);
            }
           
        }
    }
}

function Save() {
    var fno = $("#fno").val();
    var fname = $("#fname").val();
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();
    var ftel = $("#ftel").val();
    var fsqsyt = $("#fsqsyt").val();
    var fqt = $("#fqt").val();
    var fsqlx = $("#fsqlx").val();
    var fbsqr = $("#fbsqr").val();
    var fbsqyy = $("#fbsqyy").val();
    var fcpmc = $("#fcpmc").val();
    var fsqsj = $("#fsqsj").val();
    var fsqjsfs = $("#fsqjsfs").val();
    var fshrxx = $("#fshrxx").val();

    if (!ftel){
        mui.toast('请填写联系方式');
        return;
    }
    if (!fsqsyt) {
        mui.toast('请选择授权书用途');
        return;
    }
    if (String(fsqsyt).indexOf('其他')!=-1) {
        if (!fqt) {
            mui.toast('请填写其他信息');
            return;
        }
    }
    if (!fsqlx) {
        mui.toast('请选择授权类型');
        return;
    }
    if (!fbsqr) {
        mui.toast('请填写被授权人');
        return;
    }
    if (!fbsqyy) {
        mui.toast('请填写被授权医院');
        return;
    }
    if (!fcpmc) {
        mui.toast('请填写产品名称');
        return;
    }
    if (!fsqsj) {
        mui.toast('请填写授权时间');
        return;
    }
    if (!fsqjsfs) {
        mui.toast('请填写授权接受方式');
        return;
    }
    if (!fshrxx) {
        mui.toast('请填写授权人信息');
        return;
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
            xml = xml + '       <ProcessName>医用材料公司授权申请</ProcessName>';
            xml = xml + '         <ProcessVersion>' + version + '</ProcessVersion>';
            xml = xml + '            <DraftGuid></DraftGuid>';
            xml = xml + '             <OwnerMemberFullName>' + BPMOU + '</OwnerMemberFullName>';
            xml = xml + '            <Action>提交</Action>';
            xml = xml + '          <Comment></Comment>';
            xml = xml + '             <InviteIndicateUsers></InviteIndicateUsers>';
            xml = xml + '       </Header>';
            xml = xml + '       <FormData>';

            xml = xml + '   <医用材料公司_代理公司授权申请>';
            xml = xml + ' <单号>自动生成</单号>';
            xml = xml + '  <申请人编号>' + fno + '</申请人编号>';
            xml = xml + '  <申请人>' + fname + '</申请人>';
            xml = xml + '   <所属区域>' + fdept + '</所属区域>';
            xml = xml + '   <申请日期>' + fdate + '</申请日期>';
            xml = xml + '   <联系方式>' + ftel + '</联系方式>';
            xml = xml + '   <授权书用途>' + fsqsyt + '</授权书用途>';
            xml = xml + '  <其他信息>' + fqt + '</其他信息>';
            xml = xml + '  <授权类型>' + fsqlx + '</授权类型>';
            xml = xml + '   <被授权人>' + fbsqr + '</被授权人>';
            xml = xml + '   <被授权医院>' + fbsqyy + '</被授权医院>';
            xml = xml + '   <授权产品名称>' + fcpmc + '</授权产品名称>';
            xml = xml + '   <授权时间>' + fsqsj + '</授权时间>';
            xml = xml + '   <授权接受方式>' + fsqjsfs + '</授权接受方式>';
            xml = xml + '   <收货人信息>' + fshrxx + '</收货人信息>';
            xml = xml + '   <附件>' + fjArray.join(";") + '</附件>';
            xml = xml + '   </医用材料公司_代理公司授权申请>';

            xml = xml + '</FormData>';
            xml = xml + '</XForm>';
            PostXml(xml);
        }
    });
}

function reSave() {
    var pid = $("#stepId").val();
    var fbillno = $("#fbillno").val();
    var fno = $("#fno").val();
    var fname = $("#fname").val();
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();
    var ftel = $("#ftel").val();
    var fsqsyt = $("#fsqsyt").val();
    var fqt = $("#fqt").val();
    var fsqlx = $("#fsqlx").val();
    var fbsqr = $("#fbsqr").val();
    var fbsqyy = $("#fbsqyy").val();
    var fcpmc = $("#fcpmc").val();
    var fsqsj = $("#fsqsj").val();
    var fsqjsfs = $("#fsqjsfs").val();
    var fshrxx = $("#fshrxx").val();

    if (!ftel) {
        mui.toast('请填写联系方式');
        return;
    }
    if (!fsqsyt) {
        mui.toast('请选择授权书用途');
        return;
    }
    if (String(fsqsyt).indexOf('其他') != -1) {
        if (!fqt) {
            mui.toast('请填写其他信息');
            return;
        }
    }
    if (!fsqlx) {
        mui.toast('请选择授权类型');
        return;
    }
    if (!fbsqr) {
        mui.toast('请填写被授权人');
        return;
    }
    if (!fbsqyy) {
        mui.toast('请填写被授权医院');
        return;
    }
    if (!fcpmc) {
        mui.toast('请填写产品名称');
        return;
    }
    if (!fsqsj) {
        mui.toast('请填写授权时间');
        return;
    }
    if (!fsqjsfs) {
        mui.toast('请填写授权接受方式');
        return;
    }
    if (!fshrxx) {
        mui.toast('请填写授权人信息');
        return;
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

            xml = xml + '   <医用材料公司_代理公司授权申请>';
            xml = xml + ' <单号>' + fbillno + '</单号>';
            xml = xml + '  <申请人编号>' + fno + '</申请人编号>';
            xml = xml + '  <申请人>' + fname + '</申请人>';
            xml = xml + '   <所属区域>' + fdept + '</所属区域>';
            xml = xml + '   <申请日期>' + fdate + '</申请日期>';
            xml = xml + '   <联系方式>' + ftel + '</联系方式>';
            xml = xml + '   <授权书用途>' + fsqsyt + '</授权书用途>';
            xml = xml + '  <其他信息>' + fqt + '</其他信息>';
            xml = xml + '  <授权类型>' + fsqlx + '</授权类型>';
            xml = xml + '   <被授权人>' + fbsqr + '</被授权人>';
            xml = xml + '   <被授权医院>' + fbsqyy + '</被授权医院>';
            xml = xml + '   <授权产品名称>' + fcpmc + '</授权产品名称>';
            xml = xml + '   <授权时间>' + fsqsj + '</授权时间>';
            xml = xml + '   <授权接受方式>' + fsqjsfs + '</授权接受方式>';
            xml = xml + '   <收货人信息>' + fshrxx + '</收货人信息>';
            xml = xml + '   <附件>' + fjArray.join(";") + '</附件>';
            xml = xml + '   </医用材料公司_代理公司授权申请>';

            xml = xml + '</FormData>';
            xml = xml + '</XForm>';
            PostXml(xml);
        }
    });
}

function hasRead() {
    var pid = $("#stepId").val();
    var fbillno = $("#fbillno").val();
    var fno = $("#fno").val();
    var fname = $("#fname").val();
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();
    var ftel = $("#ftel").val();
    var fsqsyt = $("#fsqsyt").val();
    var fqt = $("#fqt").val();
    var fsqlx = $("#fsqlx").val();
    var fbsqr = $("#fbsqr").val();
    var fbsqyy = $("#fbsqyy").val();
    var fcpmc = $("#fcpmc").val();
    var fsqsj = $("#fsqsj").val();
    var fsqjsfs = $("#fsqjsfs").val();
    var fshrxx = $("#fshrxx").val();
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
            xml = xml + '   <医用材料公司_代理公司授权申请>';
            xml = xml + ' <单号>' + fbillno + '</单号>';
            xml = xml + '  <申请人编号>' + fno + '</申请人编号>';
            xml = xml + '  <申请人>' + fname + '</申请人>';
            xml = xml + '   <所属区域>' + fdept + '</所属区域>';
            xml = xml + '   <申请日期>' + fdate + '</申请日期>';
            xml = xml + '   <联系方式>' + ftel + '</联系方式>';
            xml = xml + '   <授权书用途>' + fsqsyt + '</授权书用途>';
            xml = xml + '  <其他信息>' + fqt + '</其他信息>';
            xml = xml + '  <授权类型>' + fsqlx + '</授权类型>';
            xml = xml + '   <被授权人>' + fbsqr + '</被授权人>';
            xml = xml + '   <被授权医院>' + fbsqyy + '</被授权医院>';
            xml = xml + '   <授权产品名称>' + fcpmc + '</授权产品名称>';
            xml = xml + '   <授权时间>' + fsqsj + '</授权时间>';
            xml = xml + '   <授权接受方式>' + fsqjsfs + '</授权接受方式>';
            xml = xml + '   <收货人信息>' + fshrxx + '</收货人信息>';
            xml = xml + '   <附件>' + fjArray.join(";") + '</附件>';
            xml = xml + '   </医用材料公司_代理公司授权申请>';

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

    var fno = $("#fno").val();
    var fname = $("#fname").val();
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();
    var ftel = $("#ftel").val();
    var fsqsyt = $("#fsqsyt").val();
    var fqt = $("#fqt").val();
    var fsqlx = $("#fsqlx").val();
    var fbsqr = $("#fbsqr").val();
    var fbsqyy = $("#fbsqyy").val();
    var fcpmc = $("#fcpmc").val();
    var fsqsj = $("#fsqsj").val();
    var fsqjsfs = $("#fsqjsfs").val();
    var fshrxx = $("#fshrxx").val();


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
            xml = xml + '<Action>' + action + '</Action>';
            xml = xml + '<Comment>' + comment + '</Comment>';

            //加签差异部分
            xml = xml + '<ConsignEnabled>True</ConsignEnabled>';
            xml = xml + '<ConsignUsers>' + consignUserStr + '</ConsignUsers>';
            xml = xml + '<ConsignRoutingType>' + consignRoutingType + '</ConsignRoutingType>';
            xml = xml + '<ConsignReturnType>' + consignReturnType + '</ConsignReturnType>';

            xml = xml + '<InviteIndicateUsers></InviteIndicateUsers>';
            xml = xml + '</Header>';
            xml = xml + '<FormData>';

            xml = xml + '   <医用材料公司_代理公司授权申请>';
            xml = xml + ' <单号>' + fbillno + '</单号>';
            xml = xml + '  <申请人编号>' + fno + '</申请人编号>';
            xml = xml + '  <申请人>' + fname + '</申请人>';
            xml = xml + '   <所属区域>' + fdept + '</所属区域>';
            xml = xml + '   <申请日期>' + fdate + '</申请日期>';
            xml = xml + '   <联系方式>' + ftel + '</联系方式>';
            xml = xml + '   <授权书用途>' + fsqsyt + '</授权书用途>';
            xml = xml + '  <其他信息>' + fqt + '</其他信息>';
            xml = xml + '  <授权类型>' + fsqlx + '</授权类型>';
            xml = xml + '   <被授权人>' + fbsqr + '</被授权人>';
            xml = xml + '   <被授权医院>' + fbsqyy + '</被授权医院>';
            xml = xml + '   <授权产品名称>' + fcpmc + '</授权产品名称>';
            xml = xml + '   <授权时间>' + fsqsj + '</授权时间>';
            xml = xml + '   <授权接受方式>' + fsqjsfs + '</授权接受方式>';
            xml = xml + '   <收货人信息>' + fshrxx + '</收货人信息>';
            xml = xml + '   <附件>' + fjArray.join(";") + '</附件>';
            xml = xml + '   </医用材料公司_代理公司授权申请>';

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
        xml = xml + '<Action>' + action + '</Action>';
        xml = xml + '<Comment>' + comment + '</Comment>';

       
        xml = xml + '<InviteIndicateUsers></InviteIndicateUsers>';
        xml = xml + '</Header>';
        xml = xml + '<FormData>';

        xml = xml + '   <医用材料公司_代理公司授权申请>';
        xml = xml + ' <单号>' + fbillno + '</单号>';
        xml = xml + '  <申请人编号>' + fno + '</申请人编号>';
        xml = xml + '  <申请人>' + fname + '</申请人>';
        xml = xml + '   <所属区域>' + fdept + '</所属区域>';
        xml = xml + '   <申请日期>' + fdate + '</申请日期>';
        xml = xml + '   <联系方式>' + ftel + '</联系方式>';
        xml = xml + '   <授权书用途>' + fsqsyt + '</授权书用途>';
        xml = xml + '  <其他信息>' + fqt + '</其他信息>';
        xml = xml + '  <授权类型>' + fsqlx + '</授权类型>';
        xml = xml + '   <被授权人>' + fbsqr + '</被授权人>';
        xml = xml + '   <被授权医院>' + fbsqyy + '</被授权医院>';
        xml = xml + '   <授权产品名称>' + fcpmc + '</授权产品名称>';
        xml = xml + '   <授权时间>' + fsqsj + '</授权时间>';
        xml = xml + '   <授权接受方式>' + fsqjsfs + '</授权接受方式>';
        xml = xml + '   <收货人信息>' + fshrxx + '</收货人信息>';
        xml = xml + '   <附件>' + fjArray.join(";") + '</附件>';
        xml = xml + '   </医用材料公司_代理公司授权申请>';

        xml = xml + '</FormData>';
        xml = xml + '</XForm>';
        PostXml(xml);
    }
}