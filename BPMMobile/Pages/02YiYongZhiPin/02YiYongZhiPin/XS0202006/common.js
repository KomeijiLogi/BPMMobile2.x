function prepMsg() {
    $("#fdate").val(getNowFormatDate(2));
    tapEvent();
    var xml = '<?xml version= "1.0" ?>';
    xml = xml + '   <Requests>';
    xml = xml + '   <Params>';
    xml = xml + '       <Method>GetFormPostData</Method>';
    xml = xml + '       <ProcessName>医用制品公司管理干部考勤提报</ProcessName>';
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
        $("#fdept").val(item.fdept);
        $("#fzhiwu").val(item.fzhiwu);
        $("#ftel").val(item.ftel);


    }).fail(function (e) {

    });
}
function tapEvent() {

    
    var fjtgjdata = [
        {
            value: '',
            text:'火车'
        },
        {
            value: '',
            text: '汽车'
        },
        {
            value: '',
            text: '轮船'
        },
        {
            value: '',
            text: '飞机'
        },
        {
            value: '',
            text: '动车'
        },
        {
            value: '',
            text: '大巴'
        },
        {
            value: '',
            text: '公务车'
        },
        {
            value: '',
            text: '私家车'
        }
    ];
    showPickerByZepto('#mxlist', '#fjtgj', fjtgjdata);

    $('#tjmx').on('tap', function () {
        var li = '<div id="mx" class="mui-card">';
        li = li + '    <div class="mui-input-row itemtitle">';
        li = li + '    <label>明细列表项</label>';
        li = li + '      <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '     <label for="fstarttime">外出开始时间<i style="color:red;">*</i></label>';
        li = li + '   <input type="datetime-local" id="fstarttime" name="fstarttime" />';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '      <label for="fendtime">外出结束时间<i style="color:red;">*</i></label>';
        li = li + '      <input type="datetime-local" id="fendtime" name="fendtime" />';
        li = li + '   </div>';
        li = li + ' <div class="mui-input-row">';
        li = li + '    <label for="fqx">外出方向<i style="color:red;">*</i></label>';
        li = li + '   <input type="text" id="fqx" name="fqx" placeholder="请填写外出方向" />';
        li = li + '    </div>';
        li = li + '  <div class="mui-input-row">';
        li = li + '     <label for="fjtgj">交通工具<i style="color:red;">*</i></label>';
        li = li + '     <input type="text" id="fjtgj" name="fjtgj" readonly="readonly" placeholder="请选择交通工具" />';
        li = li + '  </div>';
        li = li + '  <div class="mui-input-row">';
        li = li + '   <label for="freason">外出事由<i style="color:red;">*</i></label>';
        li = li + '    <input type="text" id="freason" name="freason" placeholder="请填写外出事由" />';
        li = li + '  </div>';
        li = li + '   <input type="hidden" id="fpd" name="fpd" value="0" />';
        li = li + ' </div>';
        $('#mxlist').append(li);
        showPickerByZepto('#mxlist', '#fjtgj', fjtgjdata);
        document.getElementById('tjmx').scrollIntoView();
    });
}

function mxItem(fstarttime, fendtime, fqx, fjtgj, freason, fpd) {
    var mx = Object.create({

        fstarttime: fstarttime,
        fendtime: fendtime,
        fqx: fqx,
        fjtgj: fjtgj,
        freason: freason,
        fpd: fpd,
        _check: function () {
            if (!fstarttime){
                mui.toast('请填写外出开始时间');
                return null;
            }
            if (!fendtime) {
                mui.toast('请填写外出结束时间');
                return null;
            }
            if (!fqx) {
                mui.toast('请填写外出去向');
                return null;
            }
            if (!fjtgj) {
                mui.toast('请选择交通工具');
                return null;
            }
            if (!freason) {
                mui.toast('请填写外出理由');
                return null;
            }
            return mx;
        }
    });
    return mx._check();
}

function initData(data, flag) {
    var item = data.FormDataSet.BPM_ZPGB_OUT_A[0];
    if (flag) {

        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        //$("#fbillno").val(item.fbillno);
    }
    $("#fname").val(item.fname);
    $("#fdept").val(item.fdept);
    $("#fzhiwu").val(item.fzhiwu);
    $("#ftel").val(item.ftel);
    $("#fdate").val(FormatterTimeYMS(item.fdate));
    $("#fpd").val(item.fpd);
    $("#fcostcenter").val(item.fcostcenter);

    var item_c = data.FormDataSet.BPM_ZPGB_OUT_B;
    for (var i = 0; i < item_c.length; i++){
        itemidArr.push(item_c[i].itemid);
        var li = '<div id="mx" class="mui-card">';
        li = li + '    <div class="mui-input-row itemtitle">';
        li = li + '    <label>明细列表项</label>';
        li = li + '      <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '     <label for="fstarttime">外出开始时间<i style="color:red;">*</i></label>';
        li = li + '   <input type="datetime-local" id="fstarttime" name="fstarttime" readonly="readonly" value="' + (item_c[i].fstarttime) + '"/>';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '      <label for="fendtime">外出结束时间<i style="color:red;">*</i></label>';
        li = li + '      <input type="datetime-local" id="fendtime" name="fendtime" readonly="readonly" value="' + (item_c[i].fendtime) + '"/>';
        li = li + '   </div>';
        li = li + ' <div class="mui-input-row">';
        li = li + '    <label for="fqx">外出方向<i style="color:red;">*</i></label>';
        li = li + '   <input type="text" id="fqx" name="fqx" readonly="readonly" value="' + item_c[i].fqx + '"/>';
        li = li + '    </div>';
        li = li + '  <div class="mui-input-row">';
        li = li + '     <label for="fjtgj">交通工具<i style="color:red;">*</i></label>';
        li = li + '     <input type="text" id="fjtgj" name="fjtgj" readonly="readonly" value="' + item_c[i].fjtgj + '" />';
        li = li + '  </div>';
        li = li + '  <div class="mui-input-row">';
        li = li + '   <label for="freason">外出事由<i style="color:red;">*</i></label>';
        li = li + '    <input type="text" id="freason" name="freason" readonly="readonly" value="' + item_c[i].freason + '" />';
        li = li + '  </div>';
        li = li + '   <input type="hidden" id="fpd" name="fpd" value="' + item_c[i].fpd + '" />';
        li = li + ' </div>';
        $('#mxlist').append(li);
    }
}
function nodeControllerExp(NodeName) {
    if (NodeName == '开始') {
        tapEvent();
        $("#mxlist").find('span').each(function () {
            $(this).css('display', 'block');
        });
        $("#mxlist").find('input').each(function () {
            if (($(this).attr('id')).indexOf('fjtgj') == -1) {
                $(this).removeAttr('readonly');
            }
           
        });
        $('#tjmx').show();
        $("#ftel").removeAttr('readonly');
    }
}
function Save() {
    var fname = $("#fname").val();
    var fdept = $("#fdept").val();
    var fzhiwu = $("#fzhiwu").val();
    var ftel = $("#ftel").val();
    var fdate = $("#fdate").val();
    var fpd = $("#fpd").val();
    var fcostcenter = $("#fcostcenter").val();

    var mxflag = false;
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fstarttime = $(this).find("#fstarttime").val();
        var fendtime = $(this).find("#fendtime").val();
        var fqx = $(this).find("#fqx").val();
        var fjtgj = $(this).find("#fjtgj").val();
        var freason = $(this).find("#freason").val();
        var fpd = $(this).find("#fpd").val();
        if (mxItem(fstarttime, fendtime, fqx, fjtgj, freason, fpd) == null) {
            mxflag = true;
            return;
        }
        var mx = mxItem(fstarttime, fendtime, fqx, fjtgj, freason, fpd);
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
            xml = xml + '       <ProcessName>医用制品公司管理干部考勤提报</ProcessName>';
            xml = xml + '         <ProcessVersion>' + version + '</ProcessVersion>';
            xml = xml + '            <DraftGuid></DraftGuid>';
            xml = xml + '             <OwnerMemberFullName>' + BPMOU + '</OwnerMemberFullName>';
            xml = xml + '            <Action>提交</Action>';
            xml = xml + '          <Comment></Comment>';
            xml = xml + '             <InviteIndicateUsers></InviteIndicateUsers>';
            xml = xml + '       </Header>';
            xml = xml + '       <FormData>';

            xml = xml + '    <BPM_ZPGB_OUT_A>';
            xml = xml + '   <fname>' + fname + '</fname>';
            xml = xml + '  <fdept>' + fdept + '</fdept>';
            xml = xml + '  <fzhiwu>' + fzhiwu + '</fzhiwu>';
            xml = xml + '  <ftel>' + ftel + '</ftel>';
            xml = xml + '  <fdate>' + fdate + '</fdate>';
            xml = xml + '  <fpd>' + fpd + '</fpd>';
            xml = xml + '   <fcostcenter>' + fcostcenter + '</fcostcenter>';
            xml = xml + '  </BPM_ZPGB_OUT_A>';

            for (var i = 0; i < mxlistArr.length;i++){
                xml = xml + '    <BPM_ZPGB_OUT_B>';
                xml = xml + '   <RelationRowGuid>'+(i+1)+'</RelationRowGuid>';
                xml = xml + '   <RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + '   <entryno>' + (i + 1) + '</entryno>';
                xml = xml + '  <fstarttime>' + mxlistArr[i].fstarttime + '</fstarttime>';
                xml = xml + '   <fendtime>' + mxlistArr[i].fendtime + '</fendtime>';
                xml = xml + '   <fqx>' + mxlistArr[i].fqx + '</fqx>';
                xml = xml + '   <fjtgj>' + mxlistArr[i].fjtgj + '</fjtgj>';
                xml = xml + '   <freason>' + mxlistArr[i].freason + '</freason>';
                xml = xml + '    <fpd>' + mxlistArr[i].fpd + '</fpd>';
                xml = xml + '  </BPM_ZPGB_OUT_B>';
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
    var fzhiwu = $("#fzhiwu").val();
    var ftel = $("#ftel").val();
    var fdate = $("#fdate").val();
    var fpd = $("#fpd").val();
    var fcostcenter = $("#fcostcenter").val();

    var mxflag = false;
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fstarttime = $(this).find("#fstarttime").val();
        var fendtime = $(this).find("#fendtime").val();
        var fqx = $(this).find("#fqx").val();
        var fjtgj = $(this).find("#fjtgj").val();
        var freason = $(this).find("#freason").val();
        var fpd = $(this).find("#fpd").val();
        if (mxItem(fstarttime, fendtime, fqx, fjtgj, freason, fpd) == null) {
            mxflag = true;
            return;
        }
        var mx = mxItem(fstarttime, fendtime, fqx, fjtgj, freason, fpd);
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

            xml = xml + '    <BPM_ZPGB_OUT_A>';
            xml = xml + '   <fname>' + fname + '</fname>';
            xml = xml + '  <fdept>' + fdept + '</fdept>';
            xml = xml + '  <fzhiwu>' + fzhiwu + '</fzhiwu>';
            xml = xml + '  <ftel>' + ftel + '</ftel>';
            xml = xml + '  <fdate>' + fdate + '</fdate>';
            xml = xml + '  <fpd>' + fpd + '</fpd>';
            xml = xml + '   <fcostcenter>' + fcostcenter + '</fcostcenter>';
            xml = xml + '  </BPM_ZPGB_OUT_A>';

            for (var i = 0; i < mxlistArr.length; i++) {
                xml = xml + '    <BPM_ZPGB_OUT_B>';
                xml = xml + '   <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml = xml + '   <RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + '   <entryno>' + (i + 1) + '</entryno>';
                xml = xml + '  <fstarttime>' + mxlistArr[i].fstarttime + '</fstarttime>';
                xml = xml + '   <fendtime>' + mxlistArr[i].fendtime + '</fendtime>';
                xml = xml + '   <fqx>' + mxlistArr[i].fqx + '</fqx>';
                xml = xml + '   <fjtgj>' + mxlistArr[i].fjtgj + '</fjtgj>';
                xml = xml + '   <freason>' + mxlistArr[i].freason + '</freason>';
                xml = xml + '    <fpd>' + mxlistArr[i].fpd + '</fpd>';
                xml = xml + '  </BPM_ZPGB_OUT_B>';
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
    var fzhiwu = $("#fzhiwu").val();
    var ftel = $("#ftel").val();
    var fdate = $("#fdate").val();
    var fpd = $("#fpd").val();
    var fcostcenter = $("#fcostcenter").val();
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fstarttime = $(this).find("#fstarttime").val();
        var fendtime = $(this).find("#fendtime").val();
        var fqx = $(this).find("#fqx").val();
        var fjtgj = $(this).find("#fjtgj").val();
        var freason = $(this).find("#freason").val();
        var fpd = $(this).find("#fpd").val();
        var mx = mxItem(fstarttime, fendtime, fqx, fjtgj, freason, fpd);
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

            xml = xml + '    <BPM_ZPGB_OUT_A>';
            xml = xml + '   <fname>' + fname + '</fname>';
            xml = xml + '  <fdept>' + fdept + '</fdept>';
            xml = xml + '  <fzhiwu>' + fzhiwu + '</fzhiwu>';
            xml = xml + '  <ftel>' + ftel + '</ftel>';
            xml = xml + '  <fdate>' + fdate + '</fdate>';
            xml = xml + '  <fpd>' + fpd + '</fpd>';
            xml = xml + '   <fcostcenter>' + fcostcenter + '</fcostcenter>';
            xml = xml + '  </BPM_ZPGB_OUT_A>';

            for (var i = 0; i < mxlistArr.length; i++) {
                xml = xml + '    <BPM_ZPGB_OUT_B>';
                xml = xml + '   <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml = xml + '   <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
                xml = xml + '   <entryno>' + (i + 1) + '</entryno>';
                xml = xml + '  <fstarttime>' + mxlistArr[i].fstarttime + '</fstarttime>';
                xml = xml + '   <fendtime>' + mxlistArr[i].fendtime + '</fendtime>';
                xml = xml + '   <fqx>' + mxlistArr[i].fqx + '</fqx>';
                xml = xml + '   <fjtgj>' + mxlistArr[i].fjtgj + '</fjtgj>';
                xml = xml + '   <freason>' + mxlistArr[i].freason + '</freason>';
                xml = xml + '    <fpd>' + mxlistArr[i].fpd + '</fpd>';
                xml = xml + '  </BPM_ZPGB_OUT_B>';
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
    var fzhiwu = $("#fzhiwu").val();
    var ftel = $("#ftel").val();
    var fdate = $("#fdate").val();
    var fpd = $("#fpd").val();
    var fcostcenter = $("#fcostcenter").val();
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fstarttime = $(this).find("#fstarttime").val();
        var fendtime = $(this).find("#fendtime").val();
        var fqx = $(this).find("#fqx").val();
        var fjtgj = $(this).find("#fjtgj").val();
        var freason = $(this).find("#freason").val();
        var fpd = $(this).find("#fpd").val();
        var mx = mxItem(fstarttime, fendtime, fqx, fjtgj, freason, fpd);
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

            xml = xml + '    <BPM_ZPGB_OUT_A>';
            xml = xml + '   <fname>' + fname + '</fname>';
            xml = xml + '  <fdept>' + fdept + '</fdept>';
            xml = xml + '  <fzhiwu>' + fzhiwu + '</fzhiwu>';
            xml = xml + '  <ftel>' + ftel + '</ftel>';
            xml = xml + '  <fdate>' + fdate + '</fdate>';
            xml = xml + '  <fpd>' + fpd + '</fpd>';
            xml = xml + '   <fcostcenter>' + fcostcenter + '</fcostcenter>';
            xml = xml + '  </BPM_ZPGB_OUT_A>';

            for (var i = 0; i < mxlistArr.length; i++) {
                xml = xml + '    <BPM_ZPGB_OUT_B>';
                xml = xml + '   <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml = xml + '   <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
                xml = xml + '   <entryno>' + (i + 1) + '</entryno>';
                xml = xml + '  <fstarttime>' + mxlistArr[i].fstarttime + '</fstarttime>';
                xml = xml + '   <fendtime>' + mxlistArr[i].fendtime + '</fendtime>';
                xml = xml + '   <fqx>' + mxlistArr[i].fqx + '</fqx>';
                xml = xml + '   <fjtgj>' + mxlistArr[i].fjtgj + '</fjtgj>';
                xml = xml + '   <freason>' + mxlistArr[i].freason + '</freason>';
                xml = xml + '    <fpd>' + mxlistArr[i].fpd + '</fpd>';
                xml = xml + '  </BPM_ZPGB_OUT_B>';
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

        xml = xml + '    <BPM_ZPGB_OUT_A>';
        xml = xml + '   <fname>' + fname + '</fname>';
        xml = xml + '  <fdept>' + fdept + '</fdept>';
        xml = xml + '  <fzhiwu>' + fzhiwu + '</fzhiwu>';
        xml = xml + '  <ftel>' + ftel + '</ftel>';
        xml = xml + '  <fdate>' + fdate + '</fdate>';
        xml = xml + '  <fpd>' + fpd + '</fpd>';
        xml = xml + '   <fcostcenter>' + fcostcenter + '</fcostcenter>';
        xml = xml + '  </BPM_ZPGB_OUT_A>';

        for (var i = 0; i < mxlistArr.length; i++) {
            xml = xml + '    <BPM_ZPGB_OUT_B>';
            xml = xml + '   <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
            xml = xml + '   <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
            xml = xml + '   <entryno>' + (i + 1) + '</entryno>';
            xml = xml + '  <fstarttime>' + mxlistArr[i].fstarttime + '</fstarttime>';
            xml = xml + '   <fendtime>' + mxlistArr[i].fendtime + '</fendtime>';
            xml = xml + '   <fqx>' + mxlistArr[i].fqx + '</fqx>';
            xml = xml + '   <fjtgj>' + mxlistArr[i].fjtgj + '</fjtgj>';
            xml = xml + '   <freason>' + mxlistArr[i].freason + '</freason>';
            xml = xml + '    <fpd>' + mxlistArr[i].fpd + '</fpd>';
            xml = xml + '  </BPM_ZPGB_OUT_B>';
        }

        xml = xml + '</FormData>';
        xml = xml + '</XForm>';
        PostXml(xml);
    }
}