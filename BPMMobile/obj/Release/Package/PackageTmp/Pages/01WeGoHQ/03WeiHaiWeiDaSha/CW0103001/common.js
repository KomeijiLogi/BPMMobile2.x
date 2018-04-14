function prepMsg() {
    tapEvent();
    $("#fdate").val(getNowFormatDate(2));
    var xml = '<?xml version= "1.0" ?>';
    xml = xml + '   <Requests>';
    xml = xml + '   <Params>';
    xml = xml + '       <Method>GetFormPostData</Method>';
    xml = xml + '       <ProcessName>威海卫大厦借款申请</ProcessName>';
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
        $("#fname").val(item.借款人);
        $("#fdept").val(item.所属部门);

    }).fail(function (e) {

    });
}

function tapEvent() {

    var fjklxdata = [
        {
            value: '',
            text:'备用金'
        },
        {
            value: '',
            text: '其他借款'
        }
    ];
    showPicker('fjklx', fjklxdata);

    var fjkfsdata= [
        {
            value: '',
            text:'现金'
        },
        {
            value: '',
            text:'银行转账'
        },
        {
            value: '',
            text:'现金和银行转账'
        }
    ];
    showPicker('fjkfs', fjkfsdata);

    //自动计算借款总金额

    $("#fxj,#fyhzz").on('input', function () {
        var fxj = parseFloat($("#fxj").val());
        var fyhzz = parseFloat($("#fyhzz").val());
        if (isNaN(fxj)) {
            fxj = 0;
        }
        if (isNaN(fyhzz)) {
            fyhzz = 0;
        }

        var fjktotal = fxj + fyhzz;
        $("#fjktotal").val(fjktotal);
        $("#fjktotal_dx").val(atoc(fjktotal));
    });



}

function initData(data, flag) {
    var item = data.FormDataSet.威海卫大厦借款申请表[0];

    if (flag) {

        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.fbillno);
    }
    $("#fname").val(item.借款人);
    $("#fdept").val(item.所属部门);
    $("#fdate").val(FormatterTimeYMS(item.日期));
    $("#fjklx").val(item.借款类型);
    $("#fjkyt").val(item.借款用途);
    $("#fjhhksj").val(FormatterTimeYMS(item.计划还款时间));
    $("#fjkfs").val(item.借款方式);
    $("#fxj").val(item.现金);
    $("#fyhzz").val(item.银行转账);
    $("#fkhhjhm").val(item.开户行及户名);
    $("#fzh").val(item.账户);
    $("#fjktotal").val(item.借款总金额);
    $("#fjktotal_dx").val(item.借款总金额大写);



}

function nodeControllerExp(NodeName) {
    if (String(NodeName).match('开始') != null) {

        $(".canChange").removeAttr('readonly');
    }

}


function Save() {
    var fname = $("#fname").val();
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();
    var fjklx = $("#fjklx").val();
    var fjkyt = $("#fjkyt").val();
    var fjhhksj = $("#fjhhksj").val() ;
    var fjkfs = $("#fjkfs").val();
    var fxj = $("#fxj").val();
    var fyhzz = $("#fyhzz").val();
    var fkhhjhm = $("#fkhhjhm").val();
    var fzh = $("#fzh").val();
    var fjktotal = $("#fjktotal").val();
    var fjktotal_dx = $("#fjktotal_dx").val();

    //必填项校验
    if (!fjklx){
        mui.toast('请选择借款类型');
        return;
    }
    if (!fjkyt) {
        mui.toast('请填写借款用途');
        return;
    }
    if (!fjhhksj) {
        mui.toast('请填写计划还款时间');
        return;
    }
    if (!fjkfs) {
        mui.toast('请选择借款方式');
        return;
    }

    if (!fxj && String(fjkfs).match('现金')!=null) {
        mui.toast('请填写现金');
        return;
    }
    if (!fyhzz && String(fyhzz).match('银行转账') != null) {
        mui.toast('请填写银行转账');
        return;
    }
    if (!fkhhjhm) {
        mui.toast('请填写开户行及户名');
        return;
    }
    if (!fzh) {
        mui.toast('请填写账号');
        return;
    }

    var btnArry = ["取消", "确定"];
    mui.confirm('即将提交，是否确定？', '提交确认提醒', btnArry, function (e) {
        if (e.index == 1) {
            var xml = '<?xml version= "1.0" ?>';
            xml = xml + '   <XForm>';
            xml = xml + '         <Header>';
            xml = xml + '        <Method>Post</Method>';
            xml = xml + '       <ProcessName>威海卫大厦借款申请</ProcessName>';
            xml = xml + '         <ProcessVersion>' + version + '</ProcessVersion>';
            xml = xml + '            <DraftGuid></DraftGuid>';
            xml = xml + '             <OwnerMemberFullName>' + BPMOU + '</OwnerMemberFullName>';
            xml = xml + '            <Action>提交</Action>';
            xml = xml + '          <Comment></Comment>';
            xml = xml + '             <InviteIndicateUsers></InviteIndicateUsers>';
            xml = xml + '       </Header>';
            xml = xml + '       <FormData>';

            xml += '<威海卫大厦借款申请表>';
            xml += '<fbillno>自动带出</fbillno>';
            xml += ' <借款人>' + fname + '</借款人>';
            xml += '<所属部门>' + fdept + '</所属部门>';
            xml += '<日期>' + fdate + '</日期>';
            xml += '<借款类型>' + fjklx + '</借款类型>';
            xml += '<借款用途>' + fjkyt + '</借款用途>';
            xml += '<计划还款时间>' + fjhhksj + '</计划还款时间>';
            xml += '<借款方式>' + fjkfs + '</借款方式>';
            xml += '<现金>' + fxj + '</现金>';
            xml += '<银行转账>' + fyhzz + '</银行转账>';
            xml += '<开户行及户名>' + fkhhjhm + '</开户行及户名>';
            xml += '<账户>' + fzh + '</账户>';
            xml += ' <借款总金额>' + fjktotal + '</借款总金额>';
            xml += '<借款总金额大写>' + fjktotal_dx + '</借款总金额大写>';
            xml += '</威海卫大厦借款申请表>';

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
    var fjklx = $("#fjklx").val();
    var fjkyt = $("#fjkyt").val();
    var fjhhksj = $("#fjhhksj").val();
    var fjkfs = $("#fjkfs").val();
    var fxj = $("#fxj").val();
    var fyhzz = $("#fyhzz").val();
    var fkhhjhm = $("#fkhhjhm").val();
    var fzh = $("#fzh").val();
    var fjktotal = $("#fjktotal").val();
    var fjktotal_dx = $("#fjktotal_dx").val();

    //必填项校验
    if (!fjklx) {
        mui.toast('请选择借款类型');
        return;
    }
    if (!fjkyt) {
        mui.toast('请填写借款用途');
        return;
    }
    if (!fjhhksj) {
        mui.toast('请填写计划还款时间');
        return;
    }
    if (!fjkfs) {
        mui.toast('请选择借款方式');
        return;
    }

    if (!fxj && String(fjkfs).match('现金') != null) {
        mui.toast('请填写现金');
        return;
    }
    if (!fyhzz && String(fyhzz).match('银行转账') != null) {
        mui.toast('请填写银行转账');
        return;
    }
    if (!fkhhjhm) {
        mui.toast('请填写开户行及户名');
        return;
    }
    if (!fzh) {
        mui.toast('请填写账号');
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

            xml += '<威海卫大厦借款申请表>';
            xml += '<fbillno>' + fbillno + '</fbillno>';
            xml += ' <借款人>' + fname + '</借款人>';
            xml += '<所属部门>' + fdept + '</所属部门>';
            xml += '<日期>' + fdate + '</日期>';
            xml += '<借款类型>' + fjklx + '</借款类型>';
            xml += '<借款用途>' + fjkyt + '</借款用途>';
            xml += '<计划还款时间>' + fjhhksj + '</计划还款时间>';
            xml += '<借款方式>' + fjkfs + '</借款方式>';
            xml += '<现金>' + fxj + '</现金>';
            xml += '<银行转账>' + fyhzz + '</银行转账>';
            xml += '<开户行及户名>' + fkhhjhm + '</开户行及户名>';
            xml += '<账户>' + fzh + '</账户>';
            xml += ' <借款总金额>' + fjktotal + '</借款总金额>';
            xml += '<借款总金额大写>' + fjktotal_dx + '</借款总金额大写>';
            xml += '</威海卫大厦借款申请表>';

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
    var fjklx = $("#fjklx").val();
    var fjkyt = $("#fjkyt").val();
    var fjhhksj = $("#fjhhksj").val();
    var fjkfs = $("#fjkfs").val();
    var fxj = $("#fxj").val();
    var fyhzz = $("#fyhzz").val();
    var fkhhjhm = $("#fkhhjhm").val();
    var fzh = $("#fzh").val();
    var fjktotal = $("#fjktotal").val();
    var fjktotal_dx = $("#fjktotal_dx").val();

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

            xml += '<威海卫大厦借款申请表>';
            xml += '<fbillno>' + fbillno + '</fbillno>';
            xml += ' <借款人>' + fname + '</借款人>';
            xml += '<所属部门>' + fdept + '</所属部门>';
            xml += '<日期>' + fdate + '</日期>';
            xml += '<借款类型>' + fjklx + '</借款类型>';
            xml += '<借款用途>' + fjkyt + '</借款用途>';
            xml += '<计划还款时间>' + fjhhksj + '</计划还款时间>';
            xml += '<借款方式>' + fjkfs + '</借款方式>';
            xml += '<现金>' + fxj + '</现金>';
            xml += '<银行转账>' + fyhzz + '</银行转账>';
            xml += '<开户行及户名>' + fkhhjhm + '</开户行及户名>';
            xml += '<账户>' + fzh + '</账户>';
            xml += ' <借款总金额>' + fjktotal + '</借款总金额>';
            xml += '<借款总金额大写>' + fjktotal_dx + '</借款总金额大写>';
            xml += '</威海卫大厦借款申请表>';

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
    var fjklx = $("#fjklx").val();
    var fjkyt = $("#fjkyt").val();
    var fjhhksj = $("#fjhhksj").val();
    var fjkfs = $("#fjkfs").val();
    var fxj = $("#fxj").val();
    var fyhzz = $("#fyhzz").val();
    var fkhhjhm = $("#fkhhjhm").val();
    var fzh = $("#fzh").val();
    var fjktotal = $("#fjktotal").val();
    var fjktotal_dx = $("#fjktotal_dx").val();

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
                consignUserStr = (String)($('#consignUser').val()).split(",");

                for (var i = 0; i < consignUserStr.length; i++) {
                    consignUserStr[i] = '&quot;' + consignUserStr[i] + '&quot;';
                }
                consignUserStr = '[' + consignUserStr.toString() + ']';



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
            xml = xml + '<ConsignEnabled>true</ConsignEnabled>';
            xml = xml + '  <ConsignUsers>' + consignUserStr + '</ConsignUsers>';
            xml = xml + ' <ConsignRoutingType>' + consignRoutingType + '</ConsignRoutingType>';
            xml = xml + '  <ConsignReturnType>' + consignReturnType + '</ConsignReturnType>';
            xml = xml + ' <InviteIndicateUsers>[]</InviteIndicateUsers>';
            xml = xml + ' <Context>{&quot;Routing&quot;:{}}</Context>';
            xml = xml + '</Header>';
            xml = xml + '<FormData>';

            xml += '<威海卫大厦借款申请表>';
            xml += '<fbillno>' + fbillno + '</fbillno>';
            xml += ' <借款人>' + fname + '</借款人>';
            xml += '<所属部门>' + fdept + '</所属部门>';
            xml += '<日期>' + fdate + '</日期>';
            xml += '<借款类型>' + fjklx + '</借款类型>';
            xml += '<借款用途>' + fjkyt + '</借款用途>';
            xml += '<计划还款时间>' + fjhhksj + '</计划还款时间>';
            xml += '<借款方式>' + fjkfs + '</借款方式>';
            xml += '<现金>' + fxj + '</现金>';
            xml += '<银行转账>' + fyhzz + '</银行转账>';
            xml += '<开户行及户名>' + fkhhjhm + '</开户行及户名>';
            xml += '<账户>' + fzh + '</账户>';
            xml += ' <借款总金额>' + fjktotal + '</借款总金额>';
            xml += '<借款总金额大写>' + fjktotal_dx + '</借款总金额大写>';
            xml += '</威海卫大厦借款申请表>';

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

        xml = xml + ' <UrlParams></UrlParams>';
        xml = xml + '  <ConsignEnabled>false</ConsignEnabled>';
        xml = xml + '  <ConsignUsers>[]</ConsignUsers>';
        xml = xml + '  <ConsignRoutingType>Parallel</ConsignRoutingType>';
        xml = xml + '  <ConsignReturnType>Return</ConsignReturnType>';

        xml = xml + '   <InviteIndicateUsers>[]</InviteIndicateUsers>';
        xml = xml + '   <Context>{&quot;Routing&quot;:{}}</Context>';
        xml = xml + '</Header>';
        xml = xml + '<FormData>';

        xml += '<威海卫大厦借款申请表>';
        xml += '<fbillno>' + fbillno + '</fbillno>';
        xml += ' <借款人>' + fname + '</借款人>';
        xml += '<所属部门>' + fdept + '</所属部门>';
        xml += '<日期>' + fdate + '</日期>';
        xml += '<借款类型>' + fjklx + '</借款类型>';
        xml += '<借款用途>' + fjkyt + '</借款用途>';
        xml += '<计划还款时间>' + fjhhksj + '</计划还款时间>';
        xml += '<借款方式>' + fjkfs + '</借款方式>';
        xml += '<现金>' + fxj + '</现金>';
        xml += '<银行转账>' + fyhzz + '</银行转账>';
        xml += '<开户行及户名>' + fkhhjhm + '</开户行及户名>';
        xml += '<账户>' + fzh + '</账户>';
        xml += ' <借款总金额>' + fjktotal + '</借款总金额>';
        xml += '<借款总金额大写>' + fjktotal_dx + '</借款总金额大写>';
        xml += '</威海卫大厦借款申请表>';

        xml = xml + '</FormData>';
        xml = xml + '</XForm>';
        PostXml(xml);
    }

}