//发起--流程初始化
function prepMsg() {
    $("#fdate").val(getNowFormatDate(2));//日期
    tapEvent1();//点击事件
    upload();//允许附件上传

    var xml = '<?xml version= "1.0" ?>';
    xml = xml + '<Requests>';
    xml = xml + '    <Params>';
    xml = xml + '      <Method>GetFormPostData</Method>';
    xml = xml + '       <ProcessName>生物科技集团质量信息反馈</ProcessName>';
    xml = xml + '       <ProcessVersion>' + version + '</ProcessVersion>';
    xml = xml + '         <Owner></Owner>';
    xml = xml + '      </Params>';
    xml = xml + '    </Requests>';
    var initHeaderMsg = $.ajax({
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
        //$("#fdept").val(item.fdept);

    }).fail(function (e) {

    });
    initHeaderMsg.then(function () {
        initList();
    });
}

//待办、已办、已申请--根据单号，获取表单内容
function initData(data, flag) {

    var item = data.FormDataSet.BPM_SWKJZLXXFK[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.fbillno);
    }

    $("#fname").val(item.fname);
    //$("#fdept").val(item.fdept);
    $("#fdate").val(FormatterTimeYMS(item.fdate));
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
    $("#fclyq").val(item.fclyq);
    //$("#fif_zdsg").val(item.fif_zdsg);
    if (item.fif_zdsg == '是') {
        $("#fif_zdsgd").addClass('mui-active');
    }
    $("#fgzfx").val(item.fgzfx);
    $("#fjzcs").val(item.fjzcs);
    $("#fbm").val(item.fbm);
    $("#ffzr").val(item.ffzr);
    $("#fyzr").val(item.fyzr);
    $("#fwcrq").val(FormatterTimeYMS(item.fwcrq));
    $("#fyzrq").val(FormatterTimeYMS(item.fyzrq));
    $("#ffj").val(item.ffj);

    //附件处理及下载
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
                        var downurl = baseDownloadUrl + data[i].FileID;

                        var attach = attachItem(name, type, size, time, downurl);
                        attachArray.push(attach);

                        var li = '<div class="pic-preview smallyulan success">';
                        li = li + ' <div class="del none" style="opacity:1;z-index:999;"onclick="delPicture(this)">x</div>';

                        //类型判断 
                        if ((data[i].Ext).indexOf("png") != -1 || (data[i].Ext).indexOf("jpg") != -1 || (data[i].Ext).indexOf("bmp") != -1) {
                            //li = li + '    <div class="img-wrap smallimg" id="simg" ><a href="'+baseDownloadUrl + data[i].FileID + '"><img src="'+baseDownloadUrl + data[i].FileID + '"/></a></div>';
                            li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '" ><img src="' + baseDownloadUrl + data[i].FileID + '"/></div>';
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
                    watch();
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

    $(".node1").attr('readonly', 'readonly');//发起权限字段只读
    $(".node1").removeAttr('placeholder');

}

//加签按钮点击事件
var flag_switch = false;
document.getElementById("csswitch").addEventListener('toggle', function (event) {
    flag_switch = !flag_switch;
   // mui.toast(flag_switch);
});

//点击事件
function tapEvent1() {
    //产品生产公司下拉
    var fcompanydata = [
        {
            value: '',
            text: '生物科技'
        },
        {
            value: '',
            text: '洁丽康'
        },
        {
            value: '',
            text: '瑞邦'
        },
        {
            value: '',
            text: '齐全'
        },
        {
            value: '',
            text: '检验器材'
        },
        {
            value: '',
            text: '影像'
        },
        {
            value: '',
            text: '医疗系统'
        }

    ];
    showPicker('fcompany', fcompanydata);

}

//抬头表必输项检查
function check(Method, Action, nodeName, fcompany, fcpmc, fwtms, fif_zdsg, fgzfx, fjzcs, ffzr, fyzrq) {
    /*if ((String(nodeName).match('开始') != null) || (String(nodeName).match('undefined') != null)) {*/
    if (((String(Method).match('Post') != null) && (String(Action).match('提交') != null))||(String(nodeName).match('开始') != null)){
        //如果是发起或重新发起状态
        if (!fcompany) {
            mui.toast('请选择产品生产公司');
            return false;
        }
        if (!fcpmc) {
            mui.toast('请输入产品名称');
            return false;
        }
        if (!fwtms) {
            mui.toast('请输入质量问题描述');
            return false;
        }
    }
         //生物科技质量部经理审批
    else if (String(nodeName).match('生物科技质量部经理') != null) {
        if (!fif_zdsg) {
            mui.toast('请填写是否重大质量事故');
            return false;
        }
        if (!fgzfx) {
            mui.toast('请填写故障原因分析');
            return false;
        }
        if (!fjzcs) {
            mui.toast('请填写纠正措施');
            return false;
        }
        if (!ffzr) {
            mui.toast('请填写纠正措施负责人');
            return false;
        }
        if (!fyzrq) {
            mui.toast('请填写纠正措施计划验证日期');
            return false;
        }
    }

    return true;
}

function check_xml(Method, Action, flag_switch, consignUserStr, consignRoutingType, consignReturnType) {
    //mui.toast(consignReturnType);
    //表单信息
    var pid = $("#stepId").val();
    var fbillno = $("#fbillno").val();
    var comment = $("#signSuggest").val();
    var nodeName = $("#nodeName").val();

    //抬头表
    var fname = $("#fname").val();
    //var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();
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
    var fclyq = $("#fclyq").val();
    var fif_zdsg = $("#fif_zdsg").val();
    var fgzfx = $("#fgzfx").val();
    var fjzcs = $("#fjzcs").val();
    var fbm = $("#fbm").val();
    var ffzr = $("#ffzr").val();
    var fyzr = $("#fyzr").val();
    var fwcrq = $("#fwcrq").val();
    var fyzrq = $("#fyzrq").val();
    var ffj = $("#ffj").val();

    var flag_check = check(Method, Action,nodeName, fcompany, fcpmc, fwtms, fif_zdsg, fgzfx, fjzcs, ffzr, fyzrq);//必输项检查
    //mui.toast(flag_check);
    if (!flag_check) {//如果返回false  
        return null;
    }

    //set xml
    var xml = '<?xml version= "1.0" ?>';
    xml = xml + '   <XForm>';
    xml = xml + '        <Header>';
    xml = xml + '          <Method>' + Method + '</Method>';

    if (Method == "Post" && Action == "提交") {//发起提交
        xml = xml + '          <ProcessName>生物科技集团质量信息反馈</ProcessName>';
        xml = xml + '          <ProcessVersion>' + version + '</ProcessVersion>';
        xml = xml + '          <DraftGuid></DraftGuid>';
        xml = xml + '          <OwnerMemberFullName>' + BPMOU + '</OwnerMemberFullName>';
        xml = xml + '          <Action>' + Action + '</Action>';
        xml = xml + '          <Comment></Comment>';
        xml = xml + '          <UrlParams></UrlParams>';
    } else if (Method == "Process") {//重新发起提交、审批同意
        xml = xml + '          <PID>' + pid + '</PID>';
        xml = xml + '          <Action>' + Action + '</Action>';
        xml = xml + '          <Comment>' + comment + '</Comment>';
    }

    if (Method == "Process" && Action == "同意" && flag_switch ==true) {//审批同意--加签
        xml = xml + '      <ConsignEnabled>true</ConsignEnabled>';
        xml = xml + '      <ConsignUsers>' + consignUserStr + '</ConsignUsers>';
        xml = xml + '      <ConsignRoutingType>' + consignRoutingType + '</ConsignRoutingType>';
        xml = xml + '      <ConsignReturnType>' + consignReturnType + '</ConsignReturnType>';
    }else {//非加签的情况
        xml = xml + '      <ConsignEnabled>false</ConsignEnabled>';
        xml = xml + '      <ConsignUsers>[]</ConsignUsers>';
        xml = xml + '      <ConsignRoutingType>Parallel</ConsignRoutingType>';
        xml = xml + '      <ConsignReturnType>Return</ConsignReturnType>';
    }

    xml = xml + '          <InviteIndicateUsers>[]</InviteIndicateUsers>';
    xml = xml + '          <Context>{&quot;Routing&quot;:{}}</Context>';
    xml = xml + '        </Header>';

    xml = xml + '        <FormData>';
    xml = xml + '           <BPM_SWKJZLXXFK>';

    if (Method == "Post" && Action == "提交") {//发起提交
        xml = xml + '               <fbillno>自动生成</fbillno>';
    } else if (Method == "Process") {//重新发起提交、审批同意
        xml = xml + ' <fbillno>' + fbillno + '</fbillno>';
    }

    xml = xml + '               <fname>' + fname + '</fname>';
    xml = xml + '               <fdate>' + fdate + '</fdate>';
    xml = xml + '               <ftel>' + ftel + '</ftel>';
    xml = xml + '               <fcompany>' + fcompany + '</fcompany>';
    xml = xml + '               <fcpmc>' + fcpmc + '</fcpmc>';
    xml = xml + '               <fggxh>' + fggxh + '</fggxh>';
    xml = xml + '               <fdw>' + fdw + '</fdw>';
    xml = xml + '               <fph>' + fph + '</fph>';
    xml = xml + '               <fmjph>' + fmjph + '</fmjph>';
    xml = xml + '               <fwtms>' + fwtms + '</fwtms>';
    xml = xml + '               <fkh>' + fkh + '</fkh>';
    xml = xml + '               <ftsrq>' + ftsrq + '</ftsrq>';
    xml = xml + '               <fdh>' + fdh + '</fdh>';
    xml = xml + '               <fpcje>' + fpcje + '</fpcje>';
    xml = xml + '               <fif_zm>' + fif_zm + '</fif_zm>';
    xml = xml + '               <fif_yp>' + fif_yp + '</fif_yp>';
    xml = xml + '               <fyprq>' + fyprq + '</fyprq>';
    xml = xml + '               <fgzlx>' + fgzlx + '</fgzlx>';
    xml = xml + '               <fclyq>' + fclyq + '</fclyq>';
    xml = xml + '               <fif_zdsg>' + fif_zdsg + '</fif_zdsg>';
    xml = xml + '               <fgzfx>' + fgzfx + '</fgzfx>';
    xml = xml + '               <fjzcs>' + fjzcs + '</fjzcs>';
    xml = xml + '               <fbm>' + fbm + '</fbm>';
    xml = xml + '               <ffzr>' + ffzr + '</ffzr>';
    xml = xml + '               <fwcrq>' + fwcrq + '</fwcrq>';
    xml = xml + '               <fyzrq>' + fyzrq + '</fyzrq>';
    //xml = xml + '               <ffj>' + ffj + '</ffj>';
    xml = xml + '               <fj>' + fjArray.join(';') + '</fj>';
    xml = xml + '           </BPM_SWKJZLXXFK>';
    xml = xml + '        </FormData>';

    xml = xml + '</XForm>';

    return xml;
}

//发起保存按钮
function Save() {
    var Method = "Post";
    var Action = "提交";
    var consignRoutingType;
    var consignReturnType;
    var consignUserStr;

    //检查及获取xml
    var xml = check_xml(Method, Action, flag_switch, consignUserStr, consignRoutingType, consignReturnType);
    //console.log(xml);
    if (!xml) {//如果返回null
        return;
    }
   
    //弹窗确定提交
    var btnArry = ["取消", "确定"];
    mui.confirm('即将提交，是否确定？', '提交确认提醒', btnArry, function (e) {
        if (e.index == 1) {//如果是确定
            PostXml(xml);
        }
    });

}

//返回重新提交按钮
function reSave() {
    var Method = "Process";
    var Action = "提交";
    var consignRoutingType;
    var consignReturnType;
    var consignUserStr;
 
    //检查及获取xml
    var xml = check_xml(Method, Action, flag_switch, consignUserStr, consignRoutingType, consignReturnType);
    //mui.toast(xml);
    if (!xml) {//如果返回null
        return;
    }

    //弹窗确定提交
    var btnArry = ["取消", "确定"];
    mui.confirm('即将提交，是否确定？', '提交确认提醒', btnArry, function (e) {
        if (e.index == 1) {//如果是确定
            PostXml(xml);
        }
    });

}

//待办--同意按钮
function AgreeOrConSign() {
    var Method = "Process";
    var Action = "同意";

    //加签参数
    var consignUserId = new Array();
    var consignRoutingType;
    var consignReturnType;
    var consignUserStr;

    //同意
    if (flag_switch)//如果选择加签
    {
        if (($('#signPer').val() != null) && ($('#signPer').val() != ''))//如果加签人不为空
        {
            //get consignRoutingType
            if ($('#sxsl').hasClass('mui-selected')) {//顺序加签
                consignRoutingType = 'Serial';
            } else if ($('#pxsl').hasClass('mui-selected')) {//平行加签
                consignRoutingType = 'Parallel';
            }

            //get consignReturnType
            if ($('#hdbjdl').hasClass('mui-selected')) {//回到本节点
                consignReturnType = 'Return';
            } else if ($('#jrxjdl').hasClass('mui-selected')) {//进入下一节点
                consignReturnType = 'Forward';
            }

            //ajax异步函数执行结束后，要执行的代码可写入consignAjax.then(function () {...});
            //consignUserStr参数的使用要在函数执行结束后使用,否则为undefined，
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
                    consignUserStr = (String)($('#consignUser').val()).split(",");

                    for (var i = 0; i < consignUserStr.length; i++) {
                        consignUserStr[i] = '&quot;' + consignUserStr[i] + '&quot;';
                    }
                    consignUserStr = '[' + consignUserStr.toString() + ']';

                    //检查及获取xml
                    var xml = check_xml(Method, Action, flag_switch, consignUserStr, consignRoutingType, consignReturnType);
                    //console.log(xml);
                    if (!xml) {//如果返回null
                        return;
                    }

                    PostXml(xml);

                }
            }).fail(function () {

            });
        }
        else//如果加签人为空
        {
            mui.toast('请选择加签人');
            return null;
        }
    }

    else//如果不加签
    {
        //检查及获取xml
        var xml = check_xml(Method, Action, flag_switch, consignUserStr, consignRoutingType, consignReturnType);
        //mui.toast(xml);
        if (!xml) {//如果返回null
            return;
        }

        PostXml(xml);
    }

}

//已阅按钮
function hasRead() {
    //表单信息
    var pid = $("#stepId").val();
    //var fbillno = $("#fbillno").val();
    //var nodeName = $("#nodeName").val();
    var comment = '';

    //弹窗确定提交
    var btnArry = ['取消', '确定'];
    mui.prompt('请选填知会意见', '可以不填', '知会意见', btnArry, function (e) {
        if (e.index == 1) {
            comment = e.value;

            var xml = '<?xml version="1.0"?>';
            xml = xml + '<XForm>';
            xml = xml + '  <Header>';
            xml = xml + '     <Method>InformSubmit</Method>';
            xml = xml + '     <PID>' + pid + '</PID>';
            xml = xml + '     <Comment>' + comment + '</Comment>';
            xml = xml + '  </Header>';
            xml = xml + '</XForm>';

            PostXml(xml);
        }
    });
}

//待办--节点控制字段
function nodeControllerExp(NodeName) {
    //mui.toast(NodeName);
    if (NodeName == '开始') {//返回重填，开始节点
       //donothing
        tapEvent1();//点击事件
        upload();//允许附件上传
        $(".node1").removeAttr('readonly');

    } else if (NodeName == "生物科技质量部经理") {//生物科技质量部经理节点
    //} else if (String(NodeName).match('生物科技质量部经理') != null) {
        upload();//允许附件上传
 
        //$(".node1").attr('readonly', 'readonly');//发起权限字段只读
        $(".node2").removeAttr('readonly');
        
        $("#fgzfx").attr('placeholder', '请填写故障原因分析');
        $("#fjzcs").attr('placeholder', '请填写纠正措施');
        $("#fbm").attr('placeholder', '请填写纠正措施部门');
        $("#ffzr").attr('placeholder', '请填写纠正措施负责人');
        $("#fyzr").attr('placeholder', '请填写纠正措施验证人');
        $("#fif_zdsgd").removeClass('mui-disabled');

    }
}





