function prepMsg() {
    tapEvent();
    $("#fdate").val(getNowFormatDate(2));
    var xml = '<?xml version= "1.0" ?>';
    xml = xml + '   <Requests>';
    xml = xml + '   <Params>';
    xml = xml + '       <Method>GetFormPostData</Method>';
    xml = xml + '       <ProcessName>威海卫大厦低值易耗品报废申请</ProcessName>';
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
        $("#fname").val(item.提报人);
        $("#fdept").val(item.提报部门);
    }).fail(function (e) {

    });

}
function tapEvent() {
    $("#tjmx_wz").on('tap', function () {
        var li = '<div id="mx" class="mui-card">';
        li = li + '  <div class="mui-input-row itemtitle">';
        li = li + '    <label>明细列表项</label>';
        li = li + ' <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>';
        li = li + '</div>';
        li += '<div class="mui-input-row">';
        li += '<label for="fwpmc">物品名称<i style="color:red;">*</i></label>';
        li += '<input type="text" id="fwpmc" name="fwpmc" placeholder="请填写物品名称"/>';
        li += '</div>';
        li += '<div class="mui-input-row">';
        li += '<label for="fggxh">规格型号<i style="color:red;">*</i></label>';
        li += '<input type="text" id="fggxh" name="fggxh" placeholder="请填写规格型号"/>';
        li += '</div>';
        li += '<div class="mui-input-row">';
        li += '<label for="fdw">单位<i style="color:red;">*</i></label>';
        li += '<input type="text" id="fdw" name="fdw" placeholder="请填写单位"/>';
        li += '</div>';
        li += '<div class="mui-input-row">';
        li += '<label for="fsl">数量<i style="color:red;">*</i></label>';
        li += '<input type="number" id="fsl" name="fsl" placeholder="请填写数量"/>';
        li += '</div>';
        li += '<div class="mui-input-row">';
        li += '<label for="fdj">单价<i style="color:red;">*</i></label>';
        li += '<input type="number" id="fdj" name="fdj" placeholder="请填写单价"/>';
        li += '</div>';
        li += '<div class="mui-input-row">';
        li += '<label for="fje">金额<i style="color:red;">*</i></label>';
        li += '<input type="number" id="fje" name="fje" readonly/>';
        li += '</div>';
        li += '<div class="mui-input-row">';
        li += '<label for="fsyr">使用人</label>';
        li += '<input type="text" id="fsyr" name="fsyr" placeholder="请填写使用人"/>';
        li += '</div>';
        li += '<div class="mui-input-row">';
        li += '<label for="fyysm">原因说明</label>';
        li += '<input type="text" id="fyysm" name="fyysm" placeholder="请填写原因说明"/>';
        li += '</div>';

        li = li + '</div>';
        $("#mxlist_wz").append(li);
        $("#mxlist_wz").find("#mx").each(function () {
            $(this).find("#fsl,#fdj").on('input', function () {
                calcPrice(this);
            });
        });

    });

}

function calcPrice(context) {
    var fdj = parseFloat($(context).parent().parent().find("#fdj").val());
    var fsl = parseFloat($(context).parent().parent().find("#fsl").val());
    var fje = 0;
    if (isNaN(fdj) || isNaN(fsl)) {
        return;
    }
    fje = fsl * fdj;
    $(context).parent().parent().find("#fje").val(fje);
    calcTotal();

}
function calcTotal() {
    var ftotal = 0;
    $("#mxlist_wz").find("#fje").each(function () {
        var fje = parseFloat($(this).val());
        if (isNaN(fje)) {
            fje = 0;
        }
        ftotal += fje;
       
    });
    $("#ftotal").val(ftotal);
}

function deleteItem(context) {
    var btnArray = ['否', '是'];
    mui.confirm('确认删除？', '', btnArray, function (e) {
        if (e.index == 1) {
            $(context).parent().parent().remove();
            calcTotal();
        }
    });

}

function initData(data, flag) {

    var item = data.FormDataSet.威海卫大厦低值易耗品报废申请_A[0];
    if (flag) {

        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.fbillno);

    }

    $("#fname").val(item.提报人);
    $("#fdept").val(item.提报部门);
    $("#fdate").val(FormatterTimeYMS(item.提报日期));
    $("#ftotal").val(item.合计);


    var item_c = data.FormDataSet.威海卫大厦低值易耗品报废申请_B;
    for (var i = 0; i < item_c.length; i++) {
        itemidArr.push(item_c[i].itemid);
        var li = '<div id="mx" class="mui-card">';
        li += '<div class="mui-input-row itemtitle">';
        li += '<label>明细列表项</label>';
        li += '<span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>';
        li += '</div>';
        li += '<div class="mui-input-row">';
        li += '<label for="fwpmc">物品名称<i style="color:red;">*</i></label>';
        li += '<input type="text" id="fwpmc" name="fwpmc" readonly value="'+item_c[i].物品名称+'" class="canChange"/>';
        li += '</div>';
        li += '<div class="mui-input-row">';
        li += '<label for="fggxh">规格型号<i style="color:red;">*</i></label>';
        li += '<input type="text" id="fggxh" name="fggxh" readonly value="' + item_c[i].规格型号 +'" class="canChange"/>';
        li += '</div>';
        li += '<div class="mui-input-row">';
        li += '<label for="fdw">单位<i style="color:red;">*</i></label>';
        li += '<input type="text" id="fdw" name="fdw" readonly value="' + item_c[i].单位 +'" class="canChange"/>';
        li += '</div>';
        li += '<div class="mui-input-row">';
        li += '<label for="fsl">数量<i style="color:red;">*</i></label>';
        li += '<input type="number" id="fsl" name="fsl" readonly value="' + item_c[i].数量 +'" class="canChange"/>';
        li += '</div>';
        li += '<div class="mui-input-row">';
        li += '<label for="fdj">单价<i style="color:red;">*</i></label>';
        li += '<input type="number" id="fdj" name="fdj" readonly value="' + item_c[i].单价 +'" class="canChange"/>';
        li += '</div>';
        li += '<div class="mui-input-row">';
        li += '<label for="fje">金额<i style="color:red;">*</i></label>';
        li += '<input type="number" id="fje" name="fje" readonly  value="' + item_c[i].金额 +'"//>';
        li += '</div>';
        li += '<div class="mui-input-row">';
        li += '<label for="fsyr">使用人</label>';
        li += '<input type="text" id="fsyr" name="fsyr" readonly value="' + item_c[i].使用人 +'" class="canChange"/>';
        li += '</div>';
        li += '<div class="mui-input-row">';
        li += '<label for="fyysm">原因说明</label>';
        li += '<input type="text" id="fyysm" name="fyysm" readonly  value="' + item_c[i].原因说明 +'" class="canChange"/>';
        li += '</div>';
        li += '</div>';
        $("#mxlist_wz").append(li);

    }
}

function nodeControllerExp(NodeName) {
    if (String(NodeName).match('开始') != null) {
        $("#tjmx_wz").show();
        $("#mxlist_wz").find("#mx").each(function () {
            $(this).find("#fsl,#fdj").on('input', function () {
                calcPrice(this);
            });
        });
        $("#mxlist_wz").find(".canChange").each(function () {
            $(this).removeAttr('readonly');

        });
        $("#mxlist_wz").find('span').each(function () {
            $(this).show();
        });
        tapEvent();
    }
}

function mxItem(fwpmc,fggxh,fdw,fsl,fdj,fje,fsyr,fyysm) {

    var mx = Object.create({
        fwpmc: fwpmc,
        fggxh: fggxh,
        fdw: fdw,
        fsl: fsl,
        fdj: fdj,
        fje: fje,
        fsyr: fsyr,
        fyysm: fyysm,
        _check: function () {
            if (!fwpmc) {
                mui.toast('请填写物品名称');
                return null;
            }
            if (!fggxh) {
                mui.toast('请填写规格型号');
                return null;
            }
            if (!fdw) {
                mui.toast('请填写单位');
                return null;
            }
            if (!fsl) {
                mui.toast('请填写数量');
                return null;
            }
            if (!fdj) {
                mui.toast('请填写单价');
                return null;
            }
            return mx;
        }
    });
    return mx._check();
    
}

function Save() {
    var fname = $("#fname").val();
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();
    var ftotal = $("#ftotal").val();

    var mxflag = false;
    var mxlistArr = new Array();
    $("#mxlist_wz").find("#mx").each(function () {
        var fwpmc = $(this).find("#fwpmc").val();
        var fggxh = $(this).find("#fggxh").val();
        var fdw = $(this).find("#fdw").val();
        var fsl = $(this).find("#fsl").val();
        var fdj = $(this).find("#fdj").val();
        var fje = $(this).find("#fje").val();
        var fsyr = $(this).find("#fsyr").val();
        var fyysm = $(this).find("#fyysm").val();
        if (mxItem(fwpmc, fggxh, fdw, fsl, fdj, fje, fsyr, fyysm) == null) {
            mxflag = true;
            return;
        }
        var mx = mxItem(fwpmc, fggxh, fdw, fsl, fdj, fje, fsyr, fyysm);
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
            xml = xml + '       <ProcessName>威海卫大厦低值易耗品报废申请</ProcessName>';
            xml = xml + '         <ProcessVersion>' + version + '</ProcessVersion>';
            xml = xml + '            <DraftGuid></DraftGuid>';
            xml = xml + '             <OwnerMemberFullName>' + BPMOU + '</OwnerMemberFullName>';
            xml = xml + '            <Action>提交</Action>';
            xml = xml + '          <Comment></Comment>';
            xml = xml + '             <InviteIndicateUsers></InviteIndicateUsers>';
            xml = xml + '       </Header>';
            xml = xml + '       <FormData>';
            xml += '<威海卫大厦低值易耗品报废申请_A>';
            xml += '   <fbillno>自动带出</fbillno>';
            xml += ' <提报人>' + fname + '</提报人>';
            xml += ' <提报部门>' + fdept + '</提报部门>';
            xml += ' <提报日期>' + fdate + '</提报日期>';
            xml += ' <合计>' + ftotal + '</合计>';
            xml += '  <模板>201709300207</模板>';
            xml += '</威海卫大厦低值易耗品报废申请_A>';
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += ' <威海卫大厦低值易耗品报废申请_B>';
                xml += '  <RelationRowGuid>'+(i+1)+'</RelationRowGuid>';
                xml += '<RowPrimaryKeys></RowPrimaryKeys>';
                xml += '<fentryno>' + (i + 1) + '</fentryno>';
                xml += ' <物品名称>' + mxlistArr[i].fwpmc + '</物品名称>';
                xml += ' <规格型号>' + mxlistArr[i].fggxh + '</规格型号>';
                xml += ' <单位>' + mxlistArr[i].fdw + '</单位>';
                xml += ' <数量>' + mxlistArr[i].fsl + '</数量>';
                xml += ' <单价>' + mxlistArr[i].fdj + '</单价>';
                xml += ' <金额>' + mxlistArr[i].fje + '</金额>';
                xml += ' <使用人>' + mxlistArr[i].fsyr + '</使用人>';
                xml += ' <原因说明>' + mxlistArr[i].fyysm + '</原因说明>';
                xml += ' </威海卫大厦低值易耗品报废申请_B>';
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
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();
    var ftotal = $("#ftotal").val();

    var mxflag = false;
    var mxlistArr = new Array();
    $("#mxlist_wz").find("#mx").each(function () {
        var fwpmc = $(this).find("#fwpmc").val();
        var fggxh = $(this).find("#fggxh").val();
        var fdw = $(this).find("#fdw").val();
        var fsl = $(this).find("#fsl").val();
        var fdj = $(this).find("#fdj").val();
        var fje = $(this).find("#fje").val();
        var fsyr = $(this).find("#fsyr").val();
        var fyysm = $(this).find("#fyysm").val();
        if (mxItem(fwpmc, fggxh, fdw, fsl, fdj, fje, fsyr, fyysm) == null) {
            mxflag = true;
            return;
        }
        var mx = mxItem(fwpmc, fggxh, fdw, fsl, fdj, fje, fsyr, fyysm);
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
            xml += '<威海卫大厦低值易耗品报废申请_A>';
            xml += '   <fbillno>' + fbillno+'</fbillno>';
            xml += ' <提报人>' + fname + '</提报人>';
            xml += ' <提报部门>' + fdept + '</提报部门>';
            xml += ' <提报日期>' + fdate + '</提报日期>';
            xml += ' <合计>' + ftotal + '</合计>';
            xml += '  <模板>201709300207</模板>';
            xml += '</威海卫大厦低值易耗品报废申请_A>';
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += ' <威海卫大厦低值易耗品报废申请_B>';
                xml += '  <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml += '<RowPrimaryKeys></RowPrimaryKeys>';
                xml += '<fentryno>' + (i + 1) + '</fentryno>';
                xml += ' <物品名称>' + mxlistArr[i].fwpmc + '</物品名称>';
                xml += ' <规格型号>' + mxlistArr[i].fggxh + '</规格型号>';
                xml += ' <单位>' + mxlistArr[i].fdw + '</单位>';
                xml += ' <数量>' + mxlistArr[i].fsl + '</数量>';
                xml += ' <单价>' + mxlistArr[i].fdj + '</单价>';
                xml += ' <金额>' + mxlistArr[i].fje + '</金额>';
                xml += ' <使用人>' + mxlistArr[i].fsyr + '</使用人>';
                xml += ' <原因说明>' + mxlistArr[i].fyysm + '</原因说明>';
                xml += ' </威海卫大厦低值易耗品报废申请_B>';
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
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();
    var ftotal = $("#ftotal").val();

    var mxflag = false;
    var mxlistArr = new Array();
    $("#mxlist_wz").find("#mx").each(function () {
        var fwpmc = $(this).find("#fwpmc").val();
        var fggxh = $(this).find("#fggxh").val();
        var fdw = $(this).find("#fdw").val();
        var fsl = $(this).find("#fsl").val();
        var fdj = $(this).find("#fdj").val();
        var fje = $(this).find("#fje").val();
        var fsyr = $(this).find("#fsyr").val();
        var fyysm = $(this).find("#fyysm").val();
        var mx = mxItem(fwpmc, fggxh, fdw, fsl, fdj, fje, fsyr, fyysm);
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
            xml += '<威海卫大厦低值易耗品报废申请_A>';
            xml += '   <fbillno>' + fbillno + '</fbillno>';
            xml += ' <提报人>' + fname + '</提报人>';
            xml += ' <提报部门>' + fdept + '</提报部门>';
            xml += ' <提报日期>' + fdate + '</提报日期>';
            xml += ' <合计>' + ftotal + '</合计>';
            xml += '  <模板>201709300207</模板>';
            xml += '</威海卫大厦低值易耗品报废申请_A>';
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += ' <威海卫大厦低值易耗品报废申请_B>';
                xml += '  <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml += '<RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
                xml += '<fentryno>' + (i + 1) + '</fentryno>';
                xml += ' <物品名称>' + mxlistArr[i].fwpmc + '</物品名称>';
                xml += ' <规格型号>' + mxlistArr[i].fggxh + '</规格型号>';
                xml += ' <单位>' + mxlistArr[i].fdw + '</单位>';
                xml += ' <数量>' + mxlistArr[i].fsl + '</数量>';
                xml += ' <单价>' + mxlistArr[i].fdj + '</单价>';
                xml += ' <金额>' + mxlistArr[i].fje + '</金额>';
                xml += ' <使用人>' + mxlistArr[i].fsyr + '</使用人>';
                xml += ' <原因说明>' + mxlistArr[i].fyysm + '</原因说明>';
                xml += ' </威海卫大厦低值易耗品报废申请_B>';
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
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();
    var ftotal = $("#ftotal").val();

    var mxflag = false;
    var mxlistArr = new Array();
    $("#mxlist_wz").find("#mx").each(function () {
        var fwpmc = $(this).find("#fwpmc").val();
        var fggxh = $(this).find("#fggxh").val();
        var fdw = $(this).find("#fdw").val();
        var fsl = $(this).find("#fsl").val();
        var fdj = $(this).find("#fdj").val();
        var fje = $(this).find("#fje").val();
        var fsyr = $(this).find("#fsyr").val();
        var fyysm = $(this).find("#fyysm").val();
        var mx = mxItem(fwpmc, fggxh, fdw, fsl, fdj, fje, fsyr, fyysm);
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
            xml += '<威海卫大厦低值易耗品报废申请_A>';
            xml += '   <fbillno>' + fbillno + '</fbillno>';
            xml += ' <提报人>' + fname + '</提报人>';
            xml += ' <提报部门>' + fdept + '</提报部门>';
            xml += ' <提报日期>' + fdate + '</提报日期>';
            xml += ' <合计>' + ftotal + '</合计>';
            xml += '  <模板>201709300207</模板>';
            xml += '</威海卫大厦低值易耗品报废申请_A>';
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += ' <威海卫大厦低值易耗品报废申请_B>';
                xml += '  <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml += '<RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
                xml += '<fentryno>' + (i + 1) + '</fentryno>';
                xml += ' <物品名称>' + mxlistArr[i].fwpmc + '</物品名称>';
                xml += ' <规格型号>' + mxlistArr[i].fggxh + '</规格型号>';
                xml += ' <单位>' + mxlistArr[i].fdw + '</单位>';
                xml += ' <数量>' + mxlistArr[i].fsl + '</数量>';
                xml += ' <单价>' + mxlistArr[i].fdj + '</单价>';
                xml += ' <金额>' + mxlistArr[i].fje + '</金额>';
                xml += ' <使用人>' + mxlistArr[i].fsyr + '</使用人>';
                xml += ' <原因说明>' + mxlistArr[i].fyysm + '</原因说明>';
                xml += ' </威海卫大厦低值易耗品报废申请_B>';
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

        xml = xml + ' <UrlParams></UrlParams>';
        xml = xml + '  <ConsignEnabled>false</ConsignEnabled>';
        xml = xml + '  <ConsignUsers>[]</ConsignUsers>';
        xml = xml + '  <ConsignRoutingType>Parallel</ConsignRoutingType>';
        xml = xml + '  <ConsignReturnType>Return</ConsignReturnType>';

        xml = xml + '   <InviteIndicateUsers>[]</InviteIndicateUsers>';
        xml = xml + '   <Context>{&quot;Routing&quot;:{}}</Context>';
        xml = xml + '</Header>';
        xml = xml + '<FormData>';
        xml += '<威海卫大厦低值易耗品报废申请_A>';
        xml += '   <fbillno>' + fbillno + '</fbillno>';
        xml += ' <提报人>' + fname + '</提报人>';
        xml += ' <提报部门>' + fdept + '</提报部门>';
        xml += ' <提报日期>' + fdate + '</提报日期>';
        xml += ' <合计>' + ftotal + '</合计>';
        xml += '  <模板>201709300207</模板>';
        xml += '</威海卫大厦低值易耗品报废申请_A>';
        for (var i = 0; i < mxlistArr.length; i++) {
            xml += ' <威海卫大厦低值易耗品报废申请_B>';
            xml += '  <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
            xml += '<RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
            xml += '<fentryno>' + (i + 1) + '</fentryno>';
            xml += ' <物品名称>' + mxlistArr[i].fwpmc + '</物品名称>';
            xml += ' <规格型号>' + mxlistArr[i].fggxh + '</规格型号>';
            xml += ' <单位>' + mxlistArr[i].fdw + '</单位>';
            xml += ' <数量>' + mxlistArr[i].fsl + '</数量>';
            xml += ' <单价>' + mxlistArr[i].fdj + '</单价>';
            xml += ' <金额>' + mxlistArr[i].fje + '</金额>';
            xml += ' <使用人>' + mxlistArr[i].fsyr + '</使用人>';
            xml += ' <原因说明>' + mxlistArr[i].fyysm + '</原因说明>';
            xml += ' </威海卫大厦低值易耗品报废申请_B>';
        }


        xml = xml + '</FormData>';
        xml = xml + '</XForm>';
        PostXml(xml);
    }

}