function prepMsg() {
    tapEvent();
    var xml = '<?xml version= "1.0" ?>';
    xml = xml + '   <Requests>';
    xml = xml + '   <Params>';
    xml = xml + '       <Method>GetFormPostData</Method>';
    xml = xml + '       <ProcessName>威海卫大厦客房费用减免申请</ProcessName>';
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

    var yearNow = new Date().getFullYear();

    var fyeardata = [
        {
            value: '',
            text: yearNow-1
        },
        {
            value: '',
            text: yearNow
        },
        {
            value: '',
            text:yearNow+1
        }

    ];
    showPicker('fyear', fyeardata);

    var fmonthdata = [
      
    ];
    for (var i = 1; i <= 12;i++){
       var obj= {
           value: '',
           text:i
        }
       fmonthdata.push(obj);
    }

    showPicker('fmonth', fmonthdata);

    $("#tjmx").on('tap', function () {
        var li = '<div id="mx" class="mui-card">';
        li = li + '<div class="mui-input-row itemtitle">';
        li = li + '<label>明细列表项</label>';
        li = li + '<span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>';
        li = li + '</div>';
        li += '<div class="mui-input-row">';
        li += '<label for="fmc">名称</label>';
        li += '<input type="text" id="fmc" name="fmc" placeholder="请填写名称"/>';
        li += '</div>';
        li += '<div class="mui-input-row">';
        li += '<label for="fsl">数量</label>';
        li += '<input type="number" id="fsl" name="fsl" placeholder="请填写数量"/>';
        li += '</div>';
        li += '<div class="mui-input-row">';
        li += '<label for="fze">售价总额(元)</label>';
        li += '<input type="number" id="fze" name="fze" placeholder="请填写售价总额"/>';
        li += '</div>';
        li += '<div class="mui-input-row">';
        li += '<label for="fdj">成本单价(元)</label>';
        li += '<input type="number" id="fdj" name="fdj" placeholder="请填写单价"/>';
        li += '</div>';
        li += '<div class="mui-input-row">';
        li += '<label for="fzj">成本总价(元)</label>';
        li += '<input type="number" id="fzj" name="fzj" placeholder="请填写总价"/>';
        li += '</div>';
        li += '<div class="mui-input-row" style="height:auto;">';
        li += '<label for="fbz">备注</label>';
        li += '<textarea rows="3" id="fbz" name="fbz" placeholder="请填写备注"></textarea>';
        li + '</div>';
        li = li + '</div>';
        $("#mxlist").append(li);
        $("#mxlist").find("#fsl,#fze,#fzj").each(function () {
            $(this).on('input', function () {
                calcTotal();
            });
        });
    });


}

function calcTotal() {

    var fsl_total = 0;
    var fze_total = 0;
    var fzj_total = 0;

    $("#mxlist").find("#fsl").each(function () {

        var fsl = parseFloat($(this).val());
        if (isNaN(fsl)) {
            fsl = 0;
        }
        fsl_total += fsl;
    });
    $("#fsl_total").val(fsl_total);

    $("#mxlist").find("#fze").each(function () {

        var fze = parseFloat($(this).val());
        if (isNaN(fze)) {
            fze = 0;
        }
        fze_total += fze;
    });

    $("#fze_total").val(fze_total);

    $("#mxlist").find("#fzj").each(function () {

        var fzj = parseFloat($(this).val());
        if (isNaN(fzj)) {
            fzj = 0;
        }
        fzj_total += fzj;
    });

    $("#fzj_total").val(fzj_total);


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

    var item = data.FormDataSet.威海卫大厦客房费用减免申请表_A[0];

    if (flag) {

        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.fbillno);

    }

    $("#fname").val(item.提报人);
    $("#fdept").val(item.提报部门);
    $("#fyear").val(item.提报年度);
    $("#fmonth").val(item.提报月度);
    $("#fsl_total").val(item.数量合计);
    $("#fze_total").val(item.售价总额合计);
    $("#fzj_total").val(item.成本总价合计);

    var item_c = data.FormDataSet.威海卫大厦客房费用减免申请表_B;
    for (var i = 0; i < item_c.length; i++) {

        itemidArr.push(item_c[i].itemid);
        var li = '<div id="mx" class="mui-card">';
        li += '<div class="mui-input-row itemtitle">';
        li += '<label>明细列表项</label>';
        li += '<span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>';
        li += '</div>';
        li += '<div class="mui-input-row">';
        li += '<label for="fmc">名称</label>';
        li += '<input type="text" id="fmc" name="fmc" readonly value="' + item_c[i].名称 + '" />';
        li += '</div>';
        li += '<div class="mui-input-row">';
        li += '<label for="fsl">数量</label>';
        li += '<input type="number" id="fsl" name="fsl" readonly value="' + item_c[i].数量 + '"/>';
        li += '</div>';
        li += '<div class="mui-input-row">';
        li += '<label for="fze">售价总额(元)</label>';
        li += '<input type="number" id="fze" name="fze" readonly value="' + item_c[i].售价总额 + '"/>';
        li += '</div>';
        li += '<div class="mui-input-row">';
        li += '<label for="fdj">成本单价(元)</label>';
        li += '<input type="number" id="fdj" name="fdj" readonly value="' + item_c[i].成本单价 + '"/>';
        li += '</div>';
        li += '<div class="mui-input-row">';
        li += '<label for="fzj">成本总价(元)</label>';
        li += '<input type="number" id="fzj" name="fzj" readonly value="' + item_c[i].成本总价 + '"/>';
        li += '</div>';
        li += '<div class="mui-input-row" style="height:auto;">';
        li += '<label for="fbz">备注</label>';
        li += '<textarea rows="3" id="fbz" name="fbz" readonly >' + item_c[i].备注 + '</textarea>';
        li + '</div>';
        li + '</div>';
        $("#mxlist").append(li);
    }
}

function nodeControllerExp(NodeName) {
    if (String(NodeName).match('开始') != null) {
       
        $("#mxlist").find('input,textarea').each(function () {
            $(this).removeAttr('readonly');
        });
        $("#mxlist").find('span').each(function () {
            $(this).show();
        });
        $("#mxlist").find("#fsl,#fze,#fzj").each(function () {
            $(this).on('input', function () {
                calcTotal();
            });
        });
        tapEvent();
    }
}
function mxItem(fmc, fsl, fze, fdj, fzj, fbz) {
    var mx = Object.create({
        fmc: fmc,
        fsl: fsl,
        fze: fze,
        fdj: fdj,
        fzj: fzj,
        fbz: fbz

    });
    return mx;
}


function Save() {
    var fname = $("#fname").val();
    var fdept = $("#fdept").val();
    var fyear = $("#fyear").val();
    var fmonth = $("#fmonth").val();
    var fsl_total = $("#fsl_total").val();
    var fze_total = $("#fze_total").val();
    var fzj_total = $("#fzj_total").val();

    var mxflag = false;
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fmc = $(this).find("#fmc").val();
        var fsl = $(this).find("#fsl").val();
        var fze = $(this).find("#fze").val();
        var fdj = $(this).find("#fdj").val();
        var fzj = $(this).find("#fzj").val();
        var fbz = $(this).find("#fbz").val();

        var mx = mxItem(fmc, fsl, fze, fdj, fzj, fbz);
        mxlistArr.push(mx);
    });
    var btnArry = ["取消", "确定"];
    mui.confirm('即将提交，是否确定？', '提交确认提醒', btnArry, function (e) {
        if (e.index == 1) {
            var xml = '<?xml version= "1.0" ?>';
            xml = xml + '   <XForm>';
            xml = xml + '         <Header>';
            xml = xml + '        <Method>Post</Method>';
            xml = xml + '       <ProcessName>威海卫大厦客房费用减免申请</ProcessName>';
            xml = xml + '         <ProcessVersion>' + version + '</ProcessVersion>';
            xml = xml + '            <DraftGuid></DraftGuid>';
            xml = xml + '             <OwnerMemberFullName>' + BPMOU + '</OwnerMemberFullName>';
            xml = xml + '            <Action>提交</Action>';
            xml = xml + '          <Comment></Comment>';
            xml = xml + '             <InviteIndicateUsers></InviteIndicateUsers>';
            xml = xml + '       </Header>';
            xml = xml + '       <FormData>';

            xml = xml + '  <威海卫大厦客房费用减免申请表_A>';
            xml = xml + '    <fbillno>自动带出</fbillno>';
            xml = xml + '    <提报人>' + fname + '</提报人>';
            xml = xml + '    <提报部门>' + fdept + '</提报部门>';
            xml = xml + '   <提报年度>' + fyear + '</提报年度>';
            xml = xml + '    <提报月度>' + fmonth + '</提报月度>';
            xml = xml + '    <数量合计>' + fsl_total + '</数量合计>';
            xml = xml + '    <售价总额合计>' + fze_total + '</售价总额合计>';
            xml = xml + '    <成本总价合计>' +fzj_total+'</成本总价合计>';
            xml = xml + '   <导入模板>201711080378</导入模板>';
            xml = xml + '   </威海卫大厦客房费用减免申请表_A>';

            for (var i = 0; i < mxlistArr.length; i++) {
                xml = xml + '    <威海卫大厦客房费用减免申请表_B>';
                xml = xml + '  <RelationRowGuid>'+(i+1)+'</RelationRowGuid>';
                xml = xml + '   <RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + '   <fentryno>' + (i + 1) + '</fentryno>';
                xml = xml + '   <名称>' + mxlistArr[i].fmc + '</名称>';
                xml = xml + '   <数量>' + mxlistArr[i].fsl + '</数量>';
                xml = xml + '   <售价总额>' + mxlistArr[i].fze + '</售价总额>';
                xml = xml + '    <成本单价>' + mxlistArr[i].fdj + '</成本单价>';
                xml = xml + '    <成本总价>' + mxlistArr[i].fzj + '</成本总价>';
                xml = xml + '    <备注>' + mxlistArr[i].fbz + '</备注>';
                xml = xml + '    </威海卫大厦客房费用减免申请表_B>';
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
    var fyear = $("#fyear").val();
    var fmonth = $("#fmonth").val();
    var fsl_total = $("#fsl_total").val();
    var fze_total = $("#fze_total").val();
    var fzj_total = $("#fzj_total").val();

    var mxflag = false;
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fmc = $(this).find("#fmc").val();
        var fsl = $(this).find("#fsl").val();
        var fze = $(this).find("#fze").val();
        var fdj = $(this).find("#fdj").val();
        var fzj = $(this).find("#fzj").val();
        var fbz = $(this).find("#fbz").val();

        var mx = mxItem(fmc, fsl, fze, fdj, fzj, fbz);
        mxlistArr.push(mx);
    });
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

            xml = xml + '  <威海卫大厦客房费用减免申请表_A>';
            xml = xml + '    <fbillno>自动带出</fbillno>';
            xml = xml + '    <提报人>' + fname + '</提报人>';
            xml = xml + '    <提报部门>' + fdept + '</提报部门>';
            xml = xml + '   <提报年度>' + fyear + '</提报年度>';
            xml = xml + '    <提报月度>' + fmonth + '</提报月度>';
            xml = xml + '    <数量合计>' + fsl_total + '</数量合计>';
            xml = xml + '    <售价总额合计>' + fze_total + '</售价总额合计>';
            xml = xml + '    <成本总价合计>' + fzj_total + '</成本总价合计>';
            xml = xml + '   <导入模板>201711080378</导入模板>';
            xml = xml + '   </威海卫大厦客房费用减免申请表_A>';

            for (var i = 0; i < mxlistArr.length; i++) {
                xml = xml + '    <威海卫大厦客房费用减免申请表_B>';
                xml = xml + '  <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml = xml + '   <RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + '   <fentryno>' + (i + 1) + '</fentryno>';
                xml = xml + '   <名称>' + mxlistArr[i].fmc + '</名称>';
                xml = xml + '   <数量>' + mxlistArr[i].fsl + '</数量>';
                xml = xml + '   <售价总额>' + mxlistArr[i].fze + '</售价总额>';
                xml = xml + '    <成本单价>' + mxlistArr[i].fdj + '</成本单价>';
                xml = xml + '    <成本总价>' + mxlistArr[i].fzj + '</成本总价>';
                xml = xml + '    <备注>' + mxlistArr[i].fbz + '</备注>';
                xml = xml + '    </威海卫大厦客房费用减免申请表_B>';
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
    var fyear = $("#fyear").val();
    var fmonth = $("#fmonth").val();
    var fsl_total = $("#fsl_total").val();
    var fze_total = $("#fze_total").val();
    var fzj_total = $("#fzj_total").val();

    var mxflag = false;
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fmc = $(this).find("#fmc").val();
        var fsl = $(this).find("#fsl").val();
        var fze = $(this).find("#fze").val();
        var fdj = $(this).find("#fdj").val();
        var fzj = $(this).find("#fzj").val();
        var fbz = $(this).find("#fbz").val();

        var mx = mxItem(fmc, fsl, fze, fdj, fzj, fbz);
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

            xml = xml + '  <威海卫大厦客房费用减免申请表_A>';
            xml = xml + '    <fbillno>' + fbillno + '</fbillno>';
            xml = xml + '    <提报人>' + fname + '</提报人>';
            xml = xml + '    <提报部门>' + fdept + '</提报部门>';
            xml = xml + '   <提报年度>' + fyear + '</提报年度>';
            xml = xml + '    <提报月度>' + fmonth + '</提报月度>';
            xml = xml + '    <数量合计>' + fsl_total + '</数量合计>';
            xml = xml + '    <售价总额合计>' + fze_total + '</售价总额合计>';
            xml = xml + '    <成本总价合计>' + fzj_total + '</成本总价合计>';
            xml = xml + '   <导入模板>201711080378</导入模板>';
            xml = xml + '   </威海卫大厦客房费用减免申请表_A>';

            for (var i = 0; i < mxlistArr.length; i++) {
                xml = xml + '    <威海卫大厦客房费用减免申请表_B>';
                xml = xml + '  <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml = xml + '   <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
                xml = xml + '   <fentryno>' + (i + 1) + '</fentryno>';
                xml = xml + '   <名称>' + mxlistArr[i].fmc + '</名称>';
                xml = xml + '   <数量>' + mxlistArr[i].fsl + '</数量>';
                xml = xml + '   <售价总额>' + mxlistArr[i].fze + '</售价总额>';
                xml = xml + '    <成本单价>' + mxlistArr[i].fdj + '</成本单价>';
                xml = xml + '    <成本总价>' + mxlistArr[i].fzj + '</成本总价>';
                xml = xml + '    <备注>' + mxlistArr[i].fbz + '</备注>';
                xml = xml + '    </威海卫大厦客房费用减免申请表_B>';
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
    var fyear = $("#fyear").val();
    var fmonth = $("#fmonth").val();
    var fsl_total = $("#fsl_total").val();
    var fze_total = $("#fze_total").val();
    var fzj_total = $("#fzj_total").val();

    var mxflag = false;
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fmc = $(this).find("#fmc").val();
        var fsl = $(this).find("#fsl").val();
        var fze = $(this).find("#fze").val();
        var fdj = $(this).find("#fdj").val();
        var fzj = $(this).find("#fzj").val();
        var fbz = $(this).find("#fbz").val();

        var mx = mxItem(fmc, fsl, fze, fdj, fzj, fbz);
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

            xml = xml + '  <威海卫大厦客房费用减免申请表_A>';
            xml = xml + '    <fbillno>' + fbillno + '</fbillno>';
            xml = xml + '    <提报人>' + fname + '</提报人>';
            xml = xml + '    <提报部门>' + fdept + '</提报部门>';
            xml = xml + '   <提报年度>' + fyear + '</提报年度>';
            xml = xml + '    <提报月度>' + fmonth + '</提报月度>';
            xml = xml + '    <数量合计>' + fsl_total + '</数量合计>';
            xml = xml + '    <售价总额合计>' + fze_total + '</售价总额合计>';
            xml = xml + '    <成本总价合计>' + fzj_total + '</成本总价合计>';
            xml = xml + '   <导入模板>201711080378</导入模板>';
            xml = xml + '   </威海卫大厦客房费用减免申请表_A>';

            for (var i = 0; i < mxlistArr.length; i++) {
                xml = xml + '    <威海卫大厦客房费用减免申请表_B>';
                xml = xml + '  <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml = xml + '   <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
                xml = xml + '   <fentryno>' + (i + 1) + '</fentryno>';
                xml = xml + '   <名称>' + mxlistArr[i].fmc + '</名称>';
                xml = xml + '   <数量>' + mxlistArr[i].fsl + '</数量>';
                xml = xml + '   <售价总额>' + mxlistArr[i].fze + '</售价总额>';
                xml = xml + '    <成本单价>' + mxlistArr[i].fdj + '</成本单价>';
                xml = xml + '    <成本总价>' + mxlistArr[i].fzj + '</成本总价>';
                xml = xml + '    <备注>' + mxlistArr[i].fbz + '</备注>';
                xml = xml + '    </威海卫大厦客房费用减免申请表_B>';
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

        xml = xml + '  <威海卫大厦客房费用减免申请表_A>';
        xml = xml + '    <fbillno>' + fbillno + '</fbillno>';
        xml = xml + '    <提报人>' + fname + '</提报人>';
        xml = xml + '    <提报部门>' + fdept + '</提报部门>';
        xml = xml + '   <提报年度>' + fyear + '</提报年度>';
        xml = xml + '    <提报月度>' + fmonth + '</提报月度>';
        xml = xml + '    <数量合计>' + fsl_total + '</数量合计>';
        xml = xml + '    <售价总额合计>' + fze_total + '</售价总额合计>';
        xml = xml + '    <成本总价合计>' + fzj_total + '</成本总价合计>';
        xml = xml + '   <导入模板>201711080378</导入模板>';
        xml = xml + '   </威海卫大厦客房费用减免申请表_A>';

        for (var i = 0; i < mxlistArr.length; i++) {
            xml = xml + '    <威海卫大厦客房费用减免申请表_B>';
            xml = xml + '  <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
            xml = xml + '   <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
            xml = xml + '   <fentryno>' + (i + 1) + '</fentryno>';
            xml = xml + '   <名称>' + mxlistArr[i].fmc + '</名称>';
            xml = xml + '   <数量>' + mxlistArr[i].fsl + '</数量>';
            xml = xml + '   <售价总额>' + mxlistArr[i].fze + '</售价总额>';
            xml = xml + '    <成本单价>' + mxlistArr[i].fdj + '</成本单价>';
            xml = xml + '    <成本总价>' + mxlistArr[i].fzj + '</成本总价>';
            xml = xml + '    <备注>' + mxlistArr[i].fbz + '</备注>';
            xml = xml + '    </威海卫大厦客房费用减免申请表_B>';
        }

        xml = xml + '</FormData>';
        xml = xml + '</XForm>';
        PostXml(xml);
    }
}