function prepMsg() {
    $("#fdate").val(getNowFormatDate(2));
    tapEvent();
    var xml = '<?xml version= "1.0" ?>';
    xml = xml + '<Requests>';
    xml = xml + '    <Params>';
    xml = xml + '      <Method>GetFormPostData</Method>';
    xml = xml + '       <ProcessName>海盛公司生产物资采购申请</ProcessName>';
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
        $("#fdept").val(item.fdept);

    }).fail(function (e) {

    });
    initHeaderMsg.then(function () {
        initList();
    });
}

function tapEvent() {
    $('#tjmx').on('tap', function () {
        showCard();
    });
}

function initList() {

}

function showCard() {
    $("#wrapper").css("display", "none");
    $("#search").css("display", "block");
    var header = document.querySelector('header.mui-bar');
    var list = document.getElementById('list');
    var done = document.getElementById('done');
    //calc hieght
    list.style.height = (document.body.offsetHeight - header.offsetHeight) + 'px';
    //create
    window.indexedList = new mui.IndexedList(list);
}
function hiddenCard() {
    $("#wrapper").css("display", "block");
    $("#search").css("display", "none");
}

function mxItem(fwlno, fwlname, fggxh, fjldw, fsl, fremark) {
    var mx = Object.create({
        fwlno: fwlno,
        fwlname: fwlname,
        fggxh: fggxh,
        fjldw: fjldw,
        fsl: fsl,
        fremark: fremark,
        _check: function () {
            return mx;
        }
    });
    return mx._check();
}
action = '同意';
function initData(data, flag) {
    var item = data.FormDataSet.BPM_HSGSSCWZCGSQ_A[0];
    if (flag) {

        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.fbillno);
    }
    $("#fname").val(item.fname);
    $("#fdept").val(item.fdept);
    $("#fdate").val(FormatterTimeYMS(item.fdate));
    $("#ftype").val(item.ftype);
    $("#fcbdxno").val(item.fcbdxno);
    $("#fcbdxname").val(item.fcbdxname);
    $("#flx").val(item.flx);
    $("#fremark").val(item.fremark);
    if (String(item.ftype).indexOf('工程物料') != -1) {
        $("#fcbdxno").parent().show();
        $("#fcbdxname").parent().show();
        $("#flx").parent().show();
    } else {
        $("#fcbdxno").parent().hide();
        $("#fcbdxname").parent().hide();
        $("#flx").parent().hide();
    }

    var item_c = data.FormDataSet.BPM_HSGSSCWZCGSQ_B;
    for (var i = 0; i < item_c.length; i++){
        itemidArr.push(item_c[i].itemid);
        var li = '<div id="mx" class="mui-card">';
        li = li + '   <div class="mui-input-row itemtitle">';
        li = li + '      <label>明细列表项</label>';
        li = li + '      <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '       <label for="fwlno">物料编码<i style="color:red;">*</i></label>';
        li = li + '       <input type="text" id="fwlno" name="fwlno" readonly="readonly" value="' + item_c[i].fwlno + '"/>';
        li = li + '   </div>'; 
        li = li + '   <div class="mui-input-row">';
        li = li + '       <label for="fwlname">物料名称<i style="color:red;">*</i></label>';
        li = li + '       <input type="text" id="fwlname" name="fwlname" readonly="readonly" value="' + item_c[i].fwlname + '"/>';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '      <label for="fggxh">规格型号</label>';
        li = li + '      <input type="text" id="fggxh" name="fggxh" readonly="readonly" value="' + changeNullToEmpty( item_c[i].fggxh) + '"/>';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '      <label for="fjldw">计量单位</label>';
        li = li + '      <input type="text" id="fjldw" name="fjldw" readonly="readonly" value="' + item_c[i].fjldw + '"/>';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '      <label for="fsl">数量<i style="color:red;">*</i></label>';
        li = li + '      <input type="number" id="fsl" name="fsl" readonly="readonly" value="' + item_c[i].fsl + '"/>';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '      <label for="fremark">备注</label>';
        li = li + '      <input type="text" id="fremark" name="fremark" readonly="readonly" value="' + item_c[i].fremark + '"/>';
        li = li + '   </div>';
        li = li + '</div>';
        $("#mxlist").append(li);
    }
}

function nodeControllerExp(NodeName) {
    if (NodeName == '开始') {
        $("#commitbt").hide();
        mui.alert('暂不支持发起');
    } else if (NodeName == "sysInform") {

    } else {
        if (typeof (NodeName) != "undefined") {
            if (String(NodeName) == '采购部' || String(NodeName) == '生产部') {
                action = '确认';
                $("#agreebt").text(action);
            } else if (String(NodeName) == '直接上级1'){
                action = '是';
                $("#agreebt").text(action);
            }
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

    var fname = $("#fname").val();
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();
    var ftype = $("#ftype").val();
    var fcbdxno = $("#fcbdxno").val();
    var fcbdxname = $("#fcbdxname").val();
    var flx = $("#flx").val();
    var fremark = $("#fremark").val();

    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fwlno = $(this).find("#fwlno").val();
        var fwlname = $(this).find("#fwlname").val();
        var fggxh = $(this).find("#fggxh").val();
        var fjldw = $(this).find("#fjldw").val();
        var fsl = $(this).find("#fsl").val();
        var fremark = $(this).find("#fremark").val();

        var mx = mxItem(fwlno, fwlname, fggxh, fjldw, fsl, fremark);

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

            xml = xml + ' <BPM_HSGSSCWZCGSQ_A>';
            xml = xml + ' <fbillno>' + fbillno + '</fbillno>';
            xml = xml + ' <fname>' + fname + '</fname>';
            xml = xml + '<fdept>' + fdept + '</fdept>';
            xml = xml + ' <fdate>' + fdate + '</fdate>';
            xml = xml + ' <ftype>' + ftype + '</ftype>';
            xml = xml + ' <fcbdxno>' + fcbdxno + '</fcbdxno>';
            xml = xml + '  <fcbdxname>' + fcbdxname + '</fcbdxname>';
            xml = xml + '  <flx>' + flx + '</flx>';
            xml = xml + '  <fremark>' + fremark + '</fremark>';
            xml = xml + ' </BPM_HSGSSCWZCGSQ_A>';
            for (var i = 0; i < mxlistArr.length;i++){
                xml = xml + '  <BPM_HSGSSCWZCGSQ_B>';
                xml = xml + ' <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml = xml + '  <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
                xml = xml + '  <fentryno>' + (i + 1) + '</fentryno>';
                xml = xml + '  <fwlno>' + mxlistArr[i].fwlno + '</fwlno>';
                xml = xml + '  <fwlname>' + mxlistArr[i].fwlname + '</fwlname>';
                xml = xml + ' <fggxh>' + mxlistArr[i].fggxh + '</fggxh>';
                xml = xml + ' <fjldw>' + mxlistArr[i].fjldw + '</fjldw>';
                xml = xml + '  <fsl>' + mxlistArr[i].fsl + '</fsl>';
                xml = xml + '  <fremark>' + mxlistArr[i].fremark + '</fremark>';
                xml = xml + '  </BPM_HSGSSCWZCGSQ_B>';
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
    var ftype = $("#ftype").val();
    var fcbdxno = $("#fcbdxno").val();
    var fcbdxname = $("#fcbdxname").val();
    var flx = $("#flx").val();
    var fremark = $("#fremark").val();

    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fwlno = $(this).find("#fwlno").val();
        var fwlname = $(this).find("#fwlname").val();
        var fggxh = $(this).find("#fggxh").val();
        var fjldw = $(this).find("#fjldw").val();
        var fsl = $(this).find("#fsl").val();
        var fremark = $(this).find("#fremark").val();

        var mx = mxItem(fwlno, fwlname, fggxh, fjldw, fsl, fremark);

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

            xml = xml + ' <BPM_HSGSSCWZCGSQ_A>';
            xml = xml + ' <fbillno>' + fbillno + '</fbillno>';
            xml = xml + ' <fname>' + fname + '</fname>';
            xml = xml + '<fdept>' + fdept + '</fdept>';
            xml = xml + ' <fdate>' + fdate + '</fdate>';
            xml = xml + ' <ftype>' + ftype + '</ftype>';
            xml = xml + ' <fcbdxno>' + fcbdxno + '</fcbdxno>';
            xml = xml + '  <fcbdxname>' + fcbdxname + '</fcbdxname>';
            xml = xml + '  <flx>' + flx + '</flx>';
            xml = xml + '  <fremark>' + fremark + '</fremark>';
            xml = xml + ' </BPM_HSGSSCWZCGSQ_A>';
            for (var i = 0; i < mxlistArr.length; i++) {
                xml = xml + '  <BPM_HSGSSCWZCGSQ_B>';
                xml = xml + ' <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml = xml + '  <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
                xml = xml + '  <fentryno>' + (i + 1) + '</fentryno>';
                xml = xml + '  <fwlno>' + mxlistArr[i].fwlno + '</fwlno>';
                xml = xml + '  <fwlname>' + mxlistArr[i].fwlname + '</fwlname>';
                xml = xml + ' <fggxh>' + mxlistArr[i].fggxh + '</fggxh>';
                xml = xml + ' <fjldw>' + mxlistArr[i].fjldw + '</fjldw>';
                xml = xml + '  <fsl>' + mxlistArr[i].fsl + '</fsl>';
                xml = xml + '  <fremark>' + mxlistArr[i].fremark + '</fremark>';
                xml = xml + '  </BPM_HSGSSCWZCGSQ_B>';
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
        xml = xml + '<Action>' + action + '</Action>';
        xml = xml + '<Comment>' + comment + '</Comment>';

 

        xml = xml + '<InviteIndicateUsers></InviteIndicateUsers>';
        xml = xml + '</Header>';
        xml = xml + '<FormData>';

        xml = xml + ' <BPM_HSGSSCWZCGSQ_A>';
        xml = xml + ' <fbillno>' + fbillno + '</fbillno>';
        xml = xml + ' <fname>' + fname + '</fname>';
        xml = xml + '<fdept>' + fdept + '</fdept>';
        xml = xml + ' <fdate>' + fdate + '</fdate>';
        xml = xml + ' <ftype>' + ftype + '</ftype>';
        xml = xml + ' <fcbdxno>' + fcbdxno + '</fcbdxno>';
        xml = xml + '  <fcbdxname>' + fcbdxname + '</fcbdxname>';
        xml = xml + '  <flx>' + flx + '</flx>';
        xml = xml + '  <fremark>' + fremark + '</fremark>';
        xml = xml + ' </BPM_HSGSSCWZCGSQ_A>';
        for (var i = 0; i < mxlistArr.length; i++) {
            xml = xml + '  <BPM_HSGSSCWZCGSQ_B>';
            xml = xml + ' <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
            xml = xml + '  <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
            xml = xml + '  <fentryno>' + (i + 1) + '</fentryno>';
            xml = xml + '  <fwlno>' + mxlistArr[i].fwlno + '</fwlno>';
            xml = xml + '  <fwlname>' + mxlistArr[i].fwlname + '</fwlname>';
            xml = xml + ' <fggxh>' + mxlistArr[i].fggxh + '</fggxh>';
            xml = xml + ' <fjldw>' + mxlistArr[i].fjldw + '</fjldw>';
            xml = xml + '  <fsl>' + mxlistArr[i].fsl + '</fsl>';
            xml = xml + '  <fremark>' + mxlistArr[i].fremark + '</fremark>';
            xml = xml + '  </BPM_HSGSSCWZCGSQ_B>';
        }
        xml = xml + '</FormData>';
        xml = xml + '</XForm>';
        PostXml(xml);
    }
}