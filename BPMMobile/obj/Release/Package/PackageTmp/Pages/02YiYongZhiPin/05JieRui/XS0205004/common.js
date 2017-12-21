function prepMsg() {
    $("#fdate").val(getNowFormatDate(2));
    tapEvent();
    upload();
    var xml = '<?xml version= "1.0" ?>';
    xml = xml + '   <Requests>';
    xml = xml + '   <Params>';
    xml = xml + '       <Method>GetFormPostData</Method>';
    xml = xml + '       <ProcessName>洁瑞公司代理公司授权申请</ProcessName>';
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
        $("#fname").val(item.fname);
        $("#fdept").val(item.fqy);
      
    }).fail(function (e) {

    });
}

var fsqfsArr = [];
function tapEvent() {

    mui('#fsqfs').on('checked', 'input', function () {
        if (this.checked) {

        } else {

        }

    });

}

function initData(data, flag) {
    var item = data.FormDataSet.BPM_JRDLGSSQQP[0];
    if (flag) {

        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.fbillno);
    }
    $("#fname").val(item.fname);
    $("#fdept").val(item.fqy);
    $("#fdate").val(FormatterTimeYMS(item.fdate));
    $("#ftel").val(item.flxfs);
    $("#fsqr").val(item.fsqr);
    $("#fbsqr").val(item.fbsqr);
   
    $('input[type="checkbox"]').each(function () {
       
        if (String(item.fsqxs).indexOf($(this).val()) != -1) {
            $(this).attr('checked', 'checked');
        }
    });
    $("#fsqqx_ks").val(FormatterTimeYMS(item.fsqqx_ks));
    $("#fsqqx_js").val(FormatterTimeYMS(item.fsqqx_js));
    $("#fsqqy").val(item.fsqqy);
    $("#fmcgg").val(item.fmcgg);
    $("#fshrxx").val(item.fshrxx);

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


}

function nodeControllerExp(NodeName) {
    if (NodeName == '开始') {
        $("#ftel,#fbsqr,#fsqqx_ks,#fsqqx_js,#fsqqy,#fmcgg,#fshrxx").removeAttr('readonly');
        upload();
        tapEvent();
        $('input[type="checkbox"]').each(function () {
            $(this).removeAttr('disabled');
        });
        $(".mui-checkbox").removeClass('mui-disabled');
        $(".upload-addbtn").css('display', 'block');
    }
}
function Save() {
    var fname = $("#fname").val();
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();
    var ftel = $("#ftel").val();
    var fsqr = $("#fsqr").val();
    var fbsqr = $("#fbsqr").val();
    $("input[type='checkbox']:checked").each(function () {
        fsqfsArr.push($(this).val());
    });
    var fsqqx_ks = $("#fsqqx_ks").val();
    var fsqqx_js = $("#fsqqx_js").val();
    var fsqqy = $("#fsqqy").val();
    var fmcgg = $("#fmcgg").val();
    var fshrxx = $("#fshrxx").val();

   
    if (!ftel) {
        mui.toast('请填写联系方式');
        return;
    }
    if (!fbsqr) {
        mui.toast('请填写被授权人');
        return;
    }
    if (!fsqqx_ks) {
        mui.toast('请选择授权开始时间');
        return;
    }
    if (!fsqqx_js) {
        mui.toast('请选择授权结束时间');
        return;
    }
    if (!fsqqy) {
        mui.toast('请填写授权区域');
        return;
    }
    if (!fmcgg) {
        mui.toast('请填写授权产品名称及规格');
        return;
    }
    if (!fshrxx) {
        mui.toast('请填写收货人信息');
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
            xml = xml + '       <ProcessName>洁瑞公司代理公司授权申请</ProcessName>';
            xml = xml + '         <ProcessVersion>' + version + '</ProcessVersion>';
            xml = xml + '            <DraftGuid></DraftGuid>';
            xml = xml + '             <OwnerMemberFullName>' + BPMOU + '</OwnerMemberFullName>';
            xml = xml + '            <Action>提交</Action>';
            xml = xml + '          <Comment></Comment>';
            xml = xml + '             <InviteIndicateUsers></InviteIndicateUsers>';
            xml = xml + '       </Header>';
            xml = xml + '       <FormData>';

            xml = xml + '   <BPM_JRDLGSSQQP>';
            xml = xml + ' <fbillno>自动生成</fbillno>';
            xml = xml + '   <fname>' + fname + '</fname>';
            xml = xml + '   <fqy>' + fdept + '</fqy>';
            xml = xml + '  <fdate>' + fdate + '</fdate>';
            xml = xml + '   <flxfs>' + ftel+'</flxfs>';
            xml = xml + '  <fsqr>' + fsqr+'</fsqr>';
            xml = xml + ' <fbsqr>' + fbsqr + '</fbsqr>';
            xml = xml + '  <fsqxs>' + fsqfsArr.join() + '</fsqxs>';
            xml = xml + '  <fsqqx_ks>' + fsqqx_ks + '</fsqqx_ks>';
            xml = xml + '  <fsqqx_js>' + fsqqx_js + '</fsqqx_js>';
            xml = xml + '   <fsqqy>' + fsqqy+'</fsqqy>';
            xml = xml + '  <fmcgg>' + fmcgg+'</fmcgg>';
            xml = xml + ' <fshrxx>' + fshrxx + '</fshrxx>';
            if (fjArray.length != 0) {
                xml = xml + ' <ffj>' + fjArray.join(";") + '</ffj>';
            } else {
                xml = xml + ' <ffj></ffj>';
            }
            
            xml = xml + '  </BPM_JRDLGSSQQP>';

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
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();
    var ftel = $("#ftel").val();
    var fsqr = $("#fsqr").val();
    var fbsqr = $("#fbsqr").val();
    $("input[type='checkbox']:checked").each(function () {
        fsqfsArr.push($(this).val());
    });
    var fsqqx_ks = $("#fsqqx_ks").val();
    var fsqqx_js = $("#fsqqx_js").val();
    var fsqqy = $("#fsqqy").val();
    var fmcgg = $("#fmcgg").val();
    var fshrxx = $("#fshrxx").val();


    if (!ftel) {
        mui.toast('请填写联系方式');
        return;
    }
    if (!fbsqr) {
        mui.toast('请填写被授权人');
        return;
    }
    if (!fsqqx_ks) {
        mui.toast('请选择授权开始时间');
        return;
    }
    if (!fsqqx_js) {
        mui.toast('请选择授权结束时间');
        return;
    }
    if (!fsqqy) {
        mui.toast('请填写授权区域');
        return;
    }
    if (!fmcgg) {
        mui.toast('请填写授权产品名称及规格');
        return;
    }
    if (!fshrxx) {
        mui.toast('请填写收货人信息');
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

            xml = xml + '   <BPM_JRDLGSSQQP>';
            xml = xml + ' <fbillno>' + fbillno+'</fbillno>';
            xml = xml + '   <fname>' + fname + '</fname>';
            xml = xml + '   <fqy>' + fdept + '</fqy>';
            xml = xml + '  <fdate>' + fdate + '</fdate>';
            xml = xml + '   <flxfs>' + ftel + '</flxfs>';
            xml = xml + '  <fsqr>' + fsqr + '</fsqr>';
            xml = xml + ' <fbsqr>' + fbsqr + '</fbsqr>';
            xml = xml + '  <fsqxs>' + fsqfsArr.join() + '</fsqxs>';
            xml = xml + '  <fsqqx_ks>' + fsqqx_ks + '</fsqqx_ks>';
            xml = xml + '  <fsqqx_js>' + fsqqx_js + '</fsqqx_js>';
            xml = xml + '   <fsqqy>' + fsqqy + '</fsqqy>';
            xml = xml + '  <fmcgg>' + fmcgg + '</fmcgg>';
            xml = xml + ' <fshrxx>' + fshrxx + '</fshrxx>';
            if (fjArray.length != 0) {
                xml = xml + ' <ffj>' + fjArray.join(";") + '</ffj>';
            } else {
                xml = xml + ' <ffj></ffj>';
            }

            xml = xml + '  </BPM_JRDLGSSQQP>';

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
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();
    var ftel = $("#ftel").val();
    var fsqr = $("#fsqr").val();
    var fbsqr = $("#fbsqr").val();
    $("input[type='checkbox']:checked").each(function () {
        fsqfsArr.push($(this).val());
    });
    var fsqqx_ks = $("#fsqqx_ks").val();
    var fsqqx_js = $("#fsqqx_js").val();
    var fsqqy = $("#fsqqy").val();
    var fmcgg = $("#fmcgg").val();
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

            xml = xml + '   <BPM_JRDLGSSQQP>';
            xml = xml + ' <fbillno>' + fbillno + '</fbillno>';
            xml = xml + '   <fname>' + fname + '</fname>';
            xml = xml + '   <fqy>' + fdept + '</fqy>';
            xml = xml + '  <fdate>' + fdate + '</fdate>';
            xml = xml + '   <flxfs>' + ftel + '</flxfs>';
            xml = xml + '  <fsqr>' + fsqr + '</fsqr>';
            xml = xml + ' <fbsqr>' + fbsqr + '</fbsqr>';
            xml = xml + '  <fsqxs>' + fsqfsArr.join() + '</fsqxs>';
            xml = xml + '  <fsqqx_ks>' + fsqqx_ks + '</fsqqx_ks>';
            xml = xml + '  <fsqqx_js>' + fsqqx_js + '</fsqqx_js>';
            xml = xml + '   <fsqqy>' + fsqqy + '</fsqqy>';
            xml = xml + '  <fmcgg>' + fmcgg + '</fmcgg>';
            xml = xml + ' <fshrxx>' + fshrxx + '</fshrxx>';
            if (fjArray.length != 0) {
                xml = xml + ' <ffj>' + fjArray.join(";") + '</ffj>';
            } else {
                xml = xml + ' <ffj></ffj>';
            }

            xml = xml + '  </BPM_JRDLGSSQQP>';

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
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();
    var ftel = $("#ftel").val();
    var fsqr = $("#fsqr").val();
    var fbsqr = $("#fbsqr").val();
    $("input[type='checkbox']:checked").each(function () {
        fsqfsArr.push($(this).val());
    });
    var fsqqx_ks = $("#fsqqx_ks").val();
    var fsqqx_js = $("#fsqqx_js").val();
    var fsqqy = $("#fsqqy").val();
    var fmcgg = $("#fmcgg").val();
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

            xml = xml + '   <BPM_JRDLGSSQQP>';
            xml = xml + ' <fbillno>' + fbillno + '</fbillno>';
            xml = xml + '   <fname>' + fname + '</fname>';
            xml = xml + '   <fqy>' + fdept + '</fqy>';
            xml = xml + '  <fdate>' + fdate + '</fdate>';
            xml = xml + '   <flxfs>' + ftel + '</flxfs>';
            xml = xml + '  <fsqr>' + fsqr + '</fsqr>';
            xml = xml + ' <fbsqr>' + fbsqr + '</fbsqr>';
            xml = xml + '  <fsqxs>' + fsqfsArr.join() + '</fsqxs>';
            xml = xml + '  <fsqqx_ks>' + fsqqx_ks + '</fsqqx_ks>';
            xml = xml + '  <fsqqx_js>' + fsqqx_js + '</fsqqx_js>';
            xml = xml + '   <fsqqy>' + fsqqy + '</fsqqy>';
            xml = xml + '  <fmcgg>' + fmcgg + '</fmcgg>';
            xml = xml + ' <fshrxx>' + fshrxx + '</fshrxx>';
            if (fjArray.length != 0) {
                xml = xml + ' <ffj>' + fjArray.join(";") + '</ffj>';
            } else {
                xml = xml + ' <ffj></ffj>';
            }

            xml = xml + '  </BPM_JRDLGSSQQP>';

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

        xml = xml + '   <BPM_JRDLGSSQQP>';
        xml = xml + ' <fbillno>' + fbillno + '</fbillno>';
        xml = xml + '   <fname>' + fname + '</fname>';
        xml = xml + '   <fqy>' + fdept + '</fqy>';
        xml = xml + '  <fdate>' + fdate + '</fdate>';
        xml = xml + '   <flxfs>' + ftel + '</flxfs>';
        xml = xml + '  <fsqr>' + fsqr + '</fsqr>';
        xml = xml + ' <fbsqr>' + fbsqr + '</fbsqr>';
        xml = xml + '  <fsqxs>' + fsqfsArr.join() + '</fsqxs>';
        xml = xml + '  <fsqqx_ks>' + fsqqx_ks + '</fsqqx_ks>';
        xml = xml + '  <fsqqx_js>' + fsqqx_js + '</fsqqx_js>';
        xml = xml + '   <fsqqy>' + fsqqy + '</fsqqy>';
        xml = xml + '  <fmcgg>' + fmcgg + '</fmcgg>';
        xml = xml + ' <fshrxx>' + fshrxx + '</fshrxx>';
        if (fjArray.length != 0) {
            xml = xml + ' <ffj>' + fjArray.join(";") + '</ffj>';
        } else {
            xml = xml + ' <ffj></ffj>';
        }

        xml = xml + '  </BPM_JRDLGSSQQP>';

        xml = xml + '</FormData>';
        xml = xml + '</XForm>';
        PostXml(xml);
    }
}