function prepMsg() {
    $("#fdate").val(getNowFormatDate(2));
    tapEvent();
    var xml = '<?xml version= "1.0" ?>';
    xml = xml + '   <Requests>';
    xml = xml + '   <Params>';
    xml = xml + '       <Method>GetFormPostData</Method>';
    xml = xml + '       <ProcessName>洁瑞公司销售管理事务申请</ProcessName>';
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
       

    }).fail(function (e) {

    });

}
function tapEvent() {
    var fxscpdata = [
        {
            value: '',
            text:'敷料'
        },
        {
            value: '',
            text:'缝合线'
        }
    ];
    showPicker('fxscp', fxscpdata);
    var fsqlxdata = [
        {
            value: '',
            text:'专项费用'
        },
        {
            value: '',
            text:'特批价格'
        },
        {
            value: '',
            text:'退换货'
        },
        {
            value: '',
            text:'退换发票'
        },
        {
            value: '',
            text:'其他申请'
        }
    ];
    showPicker('fsqlx', fsqlxdata)
}
function initData(data, flag) {

    var item = data.FormDataSet.洁瑞公司_销售管理事务申请[0];
    if (flag) {

        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.单号);
    }

    $("#fname").val(item.申请人);
    $("#fdept").val(item.所属区域);
    $("#fdate").val(FormatterTimeYMS(item.申请日期));
    $("#ftel").val(item.联系方式);
    $("#fkhmc").val(item.客户名称);
    $("#fkhjb").val(item.客户级别);
    $("#fkhxz").val(item.客户性质);
    $("#fsxq").val(item.授信期);
    $("#fxscp").val(item.销售产品);
    $("#fpsyy").val(item.配送医院);
    $("#fsqlx").val(item.申请类型);
    $("#fsqnr").val(item.申请内容);
}
function nodeControllerExp(NodeName) {
    if (NodeName == '开始') {
        $("#ftel,#fkhmc,#fkhjb,#fkhxz,#fsxq,#fpsyy,#fsqnr").removeAttr('readonly');
        tapEvent();
    } 
}

function Save() {

    var fname = $("#fname").val();
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();
    var ftel = $("#ftel").val();
    var fkhmc = $("#fkhmc").val();
    var fkhjb = $("#fkhjb").val();
    var fkhxz = $("#fkhxz").val();
    var fsxq = $("#fsxq").val();
    var fxscp = $("#fxscp").val();
    var fpsyy = $("#fpsyy").val();
    var fsqlx = $("#fsqlx").val();
    var fsqnr = $("#fsqnr").val();
    if (!ftel){
        mui.toast('请填写联系方式');
        return;
    }
    if (!fkhmc) {
        mui.toast('请填写客户名称');
        return;
    }
    if (!fkhjb) {
        mui.toast('请填写客户级别');
        return;
    }
    if (!fkhxz) {
        mui.toast('请填写客户性质');
        return;
    }
    if (!fsxq) {
        mui.toast('请填写授信期');
        return;
    }
    if (!fxscp) {
        mui.toast('请选择销售产品');
        return;
    }
    if (!fsqlx) {
        mui.toast('请选择申请类型');
        return;
    }
    if (!fsqnr) {
        mui.toast('请填写申请内容');
        return;
    }
    var btnArry = ["取消", "确定"];
    mui.confirm('即将提交，是否确定？', '提交确认提醒', btnArry, function (e) {
        if (e.index == 1) {

            var xml = '<?xml version= "1.0" ?>';
            xml = xml + '   <XForm>';
            xml = xml + '         <Header>';
            xml = xml + '        <Method>Post</Method>';
            xml = xml + '       <ProcessName>洁瑞公司销售管理事务申请</ProcessName>';
            xml = xml + '         <ProcessVersion>' + version + '</ProcessVersion>';
            xml = xml + '            <DraftGuid></DraftGuid>';
            xml = xml + '             <OwnerMemberFullName>' + BPMOU + '</OwnerMemberFullName>';
            xml = xml + '            <Action>提交</Action>';
            xml = xml + '          <Comment></Comment>';
            xml = xml + '             <InviteIndicateUsers></InviteIndicateUsers>';
            xml = xml + '       </Header>';
            xml = xml + '       <FormData>';

            xml = xml + '  <洁瑞公司_销售管理事务申请>';
            xml = xml + '  <单号>自动生成</单号>';
            xml = xml + '    <申请人>' + fname + '</申请人>';
            xml = xml + '   <所属区域>' + fdept + '</所属区域>';
            xml = xml + '  <申请日期>' + fdate + '</申请日期>';
            xml = xml + '   <联系方式>' + ftel + '</联系方式>';
            xml = xml + '  <客户名称>' + fkhmc + '</客户名称>';
            xml = xml + '  <客户级别>' + fkhjb + '</客户级别>';
            xml = xml + '   <客户性质>' + fkhxz + '</客户性质>';
            xml = xml + '   <授信期>' + fsxq + '</授信期>';
            xml = xml + '    <销售产品>' + fxscp + '</销售产品>';
            xml = xml + '    <配送医院>' + fpsyy + '</配送医院>';
            xml = xml + '   <申请类型>' + fsqlx + '</申请类型>';
            xml = xml + '  <申请内容>' + fsqnr + '</申请内容>';
            xml = xml + '   </洁瑞公司_销售管理事务申请>';

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
    var fkhmc = $("#fkhmc").val();
    var fkhjb = $("#fkhjb").val();
    var fkhxz = $("#fkhxz").val();
    var fsxq = $("#fsxq").val();
    var fxscp = $("#fxscp").val();
    var fpsyy = $("#fpsyy").val();
    var fsqlx = $("#fsqlx").val();
    var fsqnr = $("#fsqnr").val();
    if (!ftel) {
        mui.toast('请填写联系方式');
        return;
    }
    if (!fkhmc) {
        mui.toast('请填写客户名称');
        return;
    }
    if (!fkhjb) {
        mui.toast('请填写客户级别');
        return;
    }
    if (!fkhxz) {
        mui.toast('请填写客户性质');
        return;
    }
    if (!fsxq) {
        mui.toast('请填写授信期');
        return;
    }
    if (!fxscp) {
        mui.toast('请选择销售产品');
        return;
    }
    if (!fsqlx) {
        mui.toast('请选择申请类型');
        return;
    }
    if (!fsqnr) {
        mui.toast('请填写申请内容');
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

            xml = xml + '  <洁瑞公司_销售管理事务申请>';
            xml = xml + '  <单号>' + fbillno + '</单号>';
            xml = xml + '    <申请人>' + fname + '</申请人>';
            xml = xml + '   <所属区域>' + fdept + '</所属区域>';
            xml = xml + '  <申请日期>' + fdate + '</申请日期>';
            xml = xml + '   <联系方式>' + ftel + '</联系方式>';
            xml = xml + '  <客户名称>' + fkhmc + '</客户名称>';
            xml = xml + '  <客户级别>' + fkhjb + '</客户级别>';
            xml = xml + '   <客户性质>' + fkhxz + '</客户性质>';
            xml = xml + '   <授信期>' + fsxq + '</授信期>';
            xml = xml + '    <销售产品>' + fxscp + '</销售产品>';
            xml = xml + '    <配送医院>' + fpsyy + '</配送医院>';
            xml = xml + '   <申请类型>' + fsqlx + '</申请类型>';
            xml = xml + '  <申请内容>' + fsqnr + '</申请内容>';
            xml = xml + '   </洁瑞公司_销售管理事务申请>';

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
    var fkhmc = $("#fkhmc").val();
    var fkhjb = $("#fkhjb").val();
    var fkhxz = $("#fkhxz").val();
    var fsxq = $("#fsxq").val();
    var fxscp = $("#fxscp").val();
    var fpsyy = $("#fpsyy").val();
    var fsqlx = $("#fsqlx").val();
    var fsqnr = $("#fsqnr").val();

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

            xml = xml + '  <洁瑞公司_销售管理事务申请>';
            xml = xml + '  <单号>' + fbillno + '</单号>';
            xml = xml + '    <申请人>' + fname + '</申请人>';
            xml = xml + '   <所属区域>' + fdept + '</所属区域>';
            xml = xml + '  <申请日期>' + fdate + '</申请日期>';
            xml = xml + '   <联系方式>' + ftel + '</联系方式>';
            xml = xml + '  <客户名称>' + fkhmc + '</客户名称>';
            xml = xml + '  <客户级别>' + fkhjb + '</客户级别>';
            xml = xml + '   <客户性质>' + fkhxz + '</客户性质>';
            xml = xml + '   <授信期>' + fsxq + '</授信期>';
            xml = xml + '    <销售产品>' + fxscp + '</销售产品>';
            xml = xml + '    <配送医院>' + fpsyy + '</配送医院>';
            xml = xml + '   <申请类型>' + fsqlx + '</申请类型>';
            xml = xml + '  <申请内容>' + fsqnr + '</申请内容>';
            xml = xml + '   </洁瑞公司_销售管理事务申请>';

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
    var fkhmc = $("#fkhmc").val();
    var fkhjb = $("#fkhjb").val();
    var fkhxz = $("#fkhxz").val();
    var fsxq = $("#fsxq").val();
    var fxscp = $("#fxscp").val();
    var fpsyy = $("#fpsyy").val();
    var fsqlx = $("#fsqlx").val();
    var fsqnr = $("#fsqnr").val();
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
            xml = xml + '  <洁瑞公司_销售管理事务申请>';
            xml = xml + '  <单号>' + fbillno + '</单号>';
            xml = xml + '    <申请人>' + fname + '</申请人>';
            xml = xml + '   <所属区域>' + fdept + '</所属区域>';
            xml = xml + '  <申请日期>' + fdate + '</申请日期>';
            xml = xml + '   <联系方式>' + ftel + '</联系方式>';
            xml = xml + '  <客户名称>' + fkhmc + '</客户名称>';
            xml = xml + '  <客户级别>' + fkhjb + '</客户级别>';
            xml = xml + '   <客户性质>' + fkhxz + '</客户性质>';
            xml = xml + '   <授信期>' + fsxq + '</授信期>';
            xml = xml + '    <销售产品>' + fxscp + '</销售产品>';
            xml = xml + '    <配送医院>' + fpsyy + '</配送医院>';
            xml = xml + '   <申请类型>' + fsqlx + '</申请类型>';
            xml = xml + '  <申请内容>' + fsqnr + '</申请内容>';
            xml = xml + '   </洁瑞公司_销售管理事务申请>';

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
        xml = xml + '  <洁瑞公司_销售管理事务申请>';
        xml = xml + '  <单号>' + fbillno + '</单号>';
        xml = xml + '    <申请人>' + fname + '</申请人>';
        xml = xml + '   <所属区域>' + fdept + '</所属区域>';
        xml = xml + '  <申请日期>' + fdate + '</申请日期>';
        xml = xml + '   <联系方式>' + ftel + '</联系方式>';
        xml = xml + '  <客户名称>' + fkhmc + '</客户名称>';
        xml = xml + '  <客户级别>' + fkhjb + '</客户级别>';
        xml = xml + '   <客户性质>' + fkhxz + '</客户性质>';
        xml = xml + '   <授信期>' + fsxq + '</授信期>';
        xml = xml + '    <销售产品>' + fxscp + '</销售产品>';
        xml = xml + '    <配送医院>' + fpsyy + '</配送医院>';
        xml = xml + '   <申请类型>' + fsqlx + '</申请类型>';
        xml = xml + '  <申请内容>' + fsqnr + '</申请内容>';
        xml = xml + '   </洁瑞公司_销售管理事务申请>';

        xml = xml + '</FormData>';
        xml = xml + '</XForm>';
        PostXml(xml);
    }

}