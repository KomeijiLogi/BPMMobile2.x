function prepMsg() {
    $("#fdate").val(getNowFormatDate(2));
    tapEvent();
    var xml = '<?xml version= "1.0" ?>';
    xml = xml + '<Requests>';
    xml = xml + '    <Params>';
    xml = xml + '      <Method>GetFormPostData</Method>';
    xml = xml + '       <ProcessName>宝龄公司员工外出申请</ProcessName>';
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

//加签按钮点击事件
var flag_switch = false;
function tapEvent_csswitch() {
    document.getElementById("csswitch").addEventListener('toggle', function (event) {
        flag_switch = !flag_switch;
        // mui.toast(flag_switch);
    });
}

//点击事件
function tapEvent() {

    //事务类型下拉
    var fswlxdata = [
        {
            value: '',
            text: '公事外出'
        },
        {
            value: '',
            text: '事假'
        },
        {
            value: '',
            text: '病假'
        },
        {
            value: '',
            text: '婚假'
        },
        {
            value: '',
            text: '丧假'
        },
        {
            value: '',
            text: '工伤'
        },
        {
            value: '',
            text: '公假'
        }

    ];
    showPicker('fswlx', fswlxdata);


    //添加明细按钮
    $('#tjmx').on('tap', function () {
        var li = '<div id="mx" class="mui-card">';
        li = li + '     <div class="mui-input-row itemtitle">';
        li = li + '        <label>明细列表项</label>';
        li = li + '      <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>';
        li = li + '     </div>';
        li = li + '    <div class="mui-input-row">';
        li = li + '       <label for="fwctime">外出时间<i style="color:red;">*</i></label>';
        li = li + '       <input type="datetime-local" id="fwctime" name="fwctime" class="saveCanChange"/>';
        li = li + '    </div>';
        li = li + '      <div class="mui-input-row">';
        li = li + '        <label for="fhgstime">回公司时间<i style="color:red;">*</i></label>';
        li = li + '        <input type="datetime-local" id="fhgstime" name="fhgstime" class="saveCanChange"/>';
        li = li + '     </div>';
        li = li + '     <div class="mui-input-row">';
        li = li + '         <label for="fwcqx">外出去向</label>';
        li = li + '         <input type="text" id="fwcqx" name="fwcqx" placeholder="请填写外出去向"/>';
        li = li + '     </div>';
        li = li + '     <div class="mui-input-row">';
        li = li + '       <label for="fwcsy">外出事由</label>';
        li = li + '       <input type="text" id="fwcsy" name="fwcsy" placeholder="请填写外出事由"/>';
        li = li + '       </div>';
        li = li + '      <div class="mui-input-row" style="height:auto;">';
        li = li + '         <label for="fbkcs">补卡次数<i style="color:red;">*</i></label>';
        li = li + '         <input type="number" id="fbkcs" name="fbkcs" placeholder="请填写补卡次数"/>';
        li = li + '      </div>';
        li = li + '      <div class="mui-input-row" style="height:auto;">';
        li = li + '         <label for="freamark">备注</label>';
        li = li + '         <input type="text" id="freamark" name="freamark" placeholder="请填写备注"/>';
        li = li + '      </div>';
        li = li + '    </div>  ';
        $("#mxlist").append(li);
        document.getElementById('tjmx').scrollIntoView();
    });
}

//根据单号，获取表单内容
function initData(data, flag) {
    var item = data.FormDataSet.BPM_BLWCSP_A[0];
    if (flag) {

        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.fbillno);
    }
    $("#fname").val(item.fname);
    $("#fdept").val(item.fdept);
    $("#fdate").val(FormatterTimeYMS(item.fdate));
    $("#fswlx").val(item.fswlx);
    $("#fts").val(item.fts);

    var item_c = data.FormDataSet.BPM_BLWCSP_B;
    for (var i = 0; i < item_c.length; i++) {
        itemidArr.push(item_c[i].itemid);
        var li = '<div id="mx" class="mui-card">';
        li = li + '   <div class="mui-input-row itemtitle">';
        li = li + '      <label>明细列表项</label>';
        li = li + '      <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '      <label for="fwctime">外出时间<i style="color:red;">*</i></label>';
        li = li + '      <input type="datetime-local" id="fwctime" name="fwctime" class="saveCanChange" readonly="readonly" value="' + item_c[i].fwctime + '"/>';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '      <label for="fhgstime">回公司时间<i style="color:red;">*</i></label>';
        li = li + '      <input type="datetime-local" id="fhgstime" name="fhgstime" class="saveCanChange" readonly="readonly" value="' + item_c[i].fhgstime + '"/>';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '      <label for="fwcqx">外出去向</label>';
        li = li + '      <input type="text" id="fwcqx" name="fwcqx" placeholder="请填写外出去向" class="saveCanChange" readonly="readonly" value="' + changeNullToEmpty(item_c[i].fwcqx) + '"/>';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '      <label for="fwcsy">外出事由</label>';
        li = li + '      <input type="text" id="fwcsy" name="fwcsy" placeholder="请填写外出事由" class="saveCanChange" readonly="readonly" value="' + changeNullToEmpty(item_c[i].fwcsy) + '"/>';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '      <label for="fbkcs">补卡次数<i style="color:red;">*</i></label>';
        li = li + '      <input type="number" id="fbkcs" name="fbkcs" placeholder="请填写补卡次数" class="saveCanChange" readonly="readonly" value="' + changeNullToEmpty(item_c[i].fbkcs) + '"/>';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '      <label for="freamark">备注</label>';
        li = li + '      <input type="text" id="freamark" name="freamark" placeholder="请填写备注" class="saveCanChange" readonly="readonly" value="' + item_c[i].freamark + '"/>';
        li = li + '   </div>';
        li = li + '</div>';
        $("#mxlist").append(li);

    }
}

//抬头表必输项检查
function check(fswlx, fts) {
    if (!fswlx) {
        mui.toast('请输入事务类型');
        return false;
    }
    if (!fts) {
        mui.toast('请输入请假天数');
        return false;
    }

    return true;
}

//json字符串对象生成及明细表必输项检查
function mxItem(fwctime, fhgstime, fwcqx, fwcsy, fbkcs, freamark) {
    var mx = Object.create({
        fwctime: fwctime,
        fhgstime: fhgstime,
        fwcqx: fwcqx,
        fwcsy: fwcsy,
        fbkcs: fbkcs,
        freamark: freamark,
        _check: function () {
            if (!fwctime) {
                mui.toast('请输入外出时间');
                return null;
            }
            if (!fhgstime) {
                mui.toast('请输入回公司时间');
                return null;
            }
            if (!fbkcs) {
                mui.toast('请输入补卡次数');
                return null;
            }
            return mx;
        }

    });
    return mx._check();
}

//发起保存按钮
function Save() {
    //抬头表
    var fname = $("#fname").val();
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();
    var fswlx = $("#fswlx").val();
    var fts = $("#fts").val();
    
    var flag_check = check(fswlx, fts);//必输项检查
    if (!flag_check) {
        return null;
    }

    //明细表
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fwctime = $(this).find("#fwctime").val();
        var fhgstime = $(this).find("#fhgstime").val();
        var fwcqx = $(this).find("#fwcqx").val();
        var fwcsy = $(this).find("#fwcsy").val();
        var fbkcs = $(this).find("#fbkcs").val();
        var freamark = $(this).find("#freamark").val();
        var mx = mxItem(fwctime, fhgstime, fwcqx, fwcsy, fbkcs, freamark);
        if (!mx)
        {
            return null;
        }
        else
        {
            mxlistArr.push(mx);
        }
    });
   
    if (mxlistArr.length == 0) { //必输项检查
        //mui.toast('请输入明细信息');
        return null;
    }

    //弹窗确定提交
    var btnArry = ["取消", "确定"];
    mui.confirm('即将提交，是否确定？', '提交确认提醒', btnArry, function (e) {
        if (e.index == 1) {
            var xml = '<?xml version= "1.0" ?>';
            xml = xml + '   <XForm>';
            xml = xml + '         <Header>';
            xml = xml + '        <Method>Post</Method>';
            xml = xml + '       <ProcessName>宝龄公司员工外出申请</ProcessName>';
            xml = xml + '         <ProcessVersion>' + version + '</ProcessVersion>';
            xml = xml + '            <DraftGuid></DraftGuid>';
            xml = xml + '             <OwnerMemberFullName>' + BPMOU + '</OwnerMemberFullName>';
            xml = xml + '            <Action>提交</Action>';
            xml = xml + '          <Comment></Comment>';
            //xml = xml + '             <UrlParams></UrlParams>';
            //xml = xml + '             <ConsignEnabled>false</ConsignEnabled>';
            //xml = xml + '             <ConsignUsers>[]</ConsignUsers>';
            //xml = xml + '             <ConsignRoutingType>Parallel</ConsignRoutingType>';
            // xml = xml + '             <ConsignReturnType>Return</ConsignReturnType>';
            xml = xml + '             <InviteIndicateUsers>[]</InviteIndicateUsers>';
            // xml = xml + '             <Context>{&quot;Routing&quot;:{}}</Context>';
            xml = xml + '       </Header>';
            xml = xml + '       <FormData>';

            xml = xml + ' <BPM_BLWCSP_A>';
            xml = xml + ' <fbillno>自动生成</fbillno>';
            xml = xml + ' <fname>' + fname + '</fname>';
            xml = xml + ' <fdept>' + fdept + '</fdept>';
            xml = xml + ' <fdate>' + fdate + '</fdate>';
            xml = xml + ' <fswlx>' + fswlx + '</fswlx>';
            xml = xml + ' <fts>' + fts + '</fts>';
            xml = xml + ' </BPM_BLWCSP_A>';

            for (var i = 0; i < mxlistArr.length; i++) {
                xml = xml + ' <BPM_BLWCSP_B>';
                xml = xml + '  <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml = xml + '  <RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + '  <fentryno>' + (i + 1) + '</fentryno>';
                xml = xml + '  <fwctime>' + mxlistArr[i].fwctime + '</fwctime>';
                xml = xml + '  <fhgstime>' + mxlistArr[i].fhgstime + '</fhgstime>';
                xml = xml + '  <fwcqx>' + mxlistArr[i].fwcqx + '</fwcqx>';
                xml = xml + '  <fwcsy>' + mxlistArr[i].fwcsy + '</fwcsy>';
                xml = xml + '  <fbkcs>' + mxlistArr[i].fbkcs + '</fbkcs>';
                xml = xml + '  <freamark>' + mxlistArr[i].freamark + '</freamark>';
                xml = xml + ' </BPM_BLWCSP_B>';
            }

            xml = xml + '</FormData>';
            xml = xml + '</XForm>';
            PostXml(xml);
        }
    });

}

//待办同意按钮
function AgreeOrConSign() {

    var pid = $("#stepId").val();
    var fbillno = $("#fbillno").val();
    var comment = $("#signSuggest").val();

    var fname = $("#fname").val();
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();
    var fswlx = $("#fswlx").val();
    var fts = $("#fts").val();
    var flag_check = check(fswlx, fts);//必输项检查
    if (!flag_check) {
        return null;
    }

    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fwctime = $(this).find("#fwctime").val();
        var fhgstime = $(this).find("#fhgstime").val();
        var fwcqx = $(this).find("#fwcqx").val();
        var fwcsy = $(this).find("#fwcsy").val();
        var fbkcs = $(this).find("#fbkcs").val();
        var freamark = $(this).find("#freamark").val();
        var mx = mxItem(fwctime, fhgstime, fwcqx, fwcsy, fbkcs, freamark);
        if (!mx) {
            return null;
        }
        else {
            mxlistArr.push(mx);
        }
    });

    if (mxlistArr.length == 0) { //必输项检查
        //mui.toast('请输入明细信息');
        return null;
    }

    //加签数据
    var consignFlag = false;
    var consignUserId = new Array();
    var consignRoutingType;
    var consignReturnType;
    var consignUserStr;

    if (($('#signPer').val() != null) && ($('#signPer').val() != ''))//如果加签人不为空
    {
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
    }
    else//如果加签人为空
    {
        if (flag_switch) {//加签按钮打开
            mui.toast('请选择加签人');
            return null;
        }
        else {
            //do nothing 
        }
    }

    if (consignFlag)//如果加签人不为空
    {
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

            xml = xml + ' <BPM_BLWCSP_A>';
            xml = xml + ' <fbillno>' + fbillno + '</fbillno>';
            xml = xml + ' <fname>' + fname + '</fname>';
            xml = xml + ' <fdept>' + fdept + '</fdept>';
            xml = xml + ' <fdate>' + fdate + '</fdate>';
            xml = xml + ' <fswlx>' + fswlx + '</fswlx>';
            xml = xml + ' <fts>' + fts + '</fts>';
            xml = xml + '</BPM_BLWCSP_A>';

            for (var i = 0; i < mxlistArr.length; i++) {
                xml = xml + ' <BPM_BLWCSP_B>';
                xml = xml + '   <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml = xml + '  <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
                xml = xml + '  <fentryno>' + (i + 1) + '</fentryno>';
                xml = xml + '  <fwctime>' + mxlistArr[i].fwctime + '</fwctime>';
                xml = xml + '  <fhgstime>' + mxlistArr[i].fhgstime + '</fhgstime>';
                xml = xml + '  <fwcqx>' + mxlistArr[i].fwcqx + '</fwcqx>';
                xml = xml + '  <fwcsy>' + mxlistArr[i].fwcsy + '</fwcsy>';
                xml = xml + '  <fbkcs>' + mxlistArr[i].fbkcs + '</fbkcs>';
                xml = xml + '  <freamark>' + mxlistArr[i].freamark + '</freamark>';
                xml = xml + ' </BPM_BLWCSP_B>';
            }

            xml = xml + '</FormData>';
            xml = xml + '</XForm>';
            PostXml(xml);
        });
    }
    else//如果加签人为空
    {
        var xml = '<?xml version="1.0"?>';
        xml = xml + '<XForm>';
        xml = xml + '<Header>';
        xml = xml + '<Method>Process</Method>';
        xml = xml + '<PID>' + pid + '</PID>';
        xml = xml + '<Action>同意</Action>';
        xml = xml + '<Comment>' + comment + '</Comment>';

        xml = xml + '  <UrlParams></UrlParams>';
        xml = xml + '  <ConsignEnabled>false</ConsignEnabled>';
        xml = xml + '  <ConsignUsers>[]</ConsignUsers>';
        xml = xml + '  <ConsignRoutingType>Parallel</ConsignRoutingType>';
        xml = xml + '  <ConsignReturnType>Return</ConsignReturnType>';
        xml = xml + '  <InviteIndicateUsers>[]</InviteIndicateUsers>';
        xml = xml + '  <Context>{&quot;Routing&quot;:{}}</Context>';
        xml = xml + '  </Header>';
        xml = xml + '  <FormData>';

        xml = xml + ' <BPM_BLWCSP_A>';
        xml = xml + ' <fbillno>' + fbillno + '</fbillno>';
        xml = xml + ' <fname>' + fname + '</fname>';
        xml = xml + ' <fdept>' + fdept + '</fdept>';
        xml = xml + ' <fdate>' + fdate + '</fdate>';
        xml = xml + ' <fswlx>' + fswlx + '</fswlx>';
        xml = xml + ' <fts>' + fts + '</fts>';
        xml = xml + '</BPM_BLWCSP_A>';

        for (var i = 0; i < mxlistArr.length; i++) {
            xml = xml + ' <BPM_BLWCSP_B>';
            xml = xml + '   <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
            xml = xml + '  <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
            xml = xml + '  <fentryno>' + (i + 1) + '</fentryno>';
            xml = xml + '  <fwctime>' + mxlistArr[i].fwctime + '</fwctime>';
            xml = xml + '  <fhgstime>' + mxlistArr[i].fhgstime + '</fhgstime>';
            xml = xml + '  <fwcqx>' + mxlistArr[i].fwcqx + '</fwcqx>';
            xml = xml + '  <fwcsy>' + mxlistArr[i].fwcsy + '</fwcsy>';
            xml = xml + '  <fbkcs>' + mxlistArr[i].fbkcs + '</fbkcs>';
            xml = xml + '  <freamark>' + mxlistArr[i].freamark + '</freamark>';
            xml = xml + ' </BPM_BLWCSP_B>';
        }

        xml = xml + '</FormData>';
        xml = xml + '</XForm>';
        PostXml(xml);
    }
}

//返回重填的重新提交按钮
function reSave() {
    var pid = $("#stepId").val();
    var fbillno = $("#fbillno").val();

    var fname = $("#fname").val();
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();
    var fswlx = $("#fswlx").val();
    var fts = $("#fts").val();
    var flag_check = check(fswlx, fts);//必输项检查
    if (!flag_check) {
        return null;
    }

    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fwctime = $(this).find("#fwctime").val();
        var fhgstime = $(this).find("#fhgstime").val();
        var fwcqx = $(this).find("#fwcqx").val();
        var fwcsy = $(this).find("#fwcsy").val();
        var fbkcs = $(this).find("#fbkcs").val();
        var freamark = $(this).find("#freamark").val();

        var mx = mxItem(fwctime, fhgstime, fwcqx, fwcsy, fbkcs, freamark);
        if (!mx) {
            return null;
        }
        else {
            mxlistArr.push(mx);
        }
    });

    if (mxlistArr.length == 0) { //必输项检查
        //mui.toast('请输入明细信息');
        return null;
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

            xml = xml + ' <BPM_BLWCSP_A>';
            xml = xml + ' <fbillno>' + fbillno + '</fbillno>';
            xml = xml + ' <fname>' + fname + '</fname>';
            xml = xml + ' <fdept>' + fdept + '</fdept>';
            xml = xml + ' <fdate>' + fdate + '</fdate>';
            xml = xml + ' <fswlx>' + fswlx + '</fswlx>';
            xml = xml + ' <fts>' + fts + '</fts>';
            xml = xml + '</BPM_BLWCSP_A>';

            for (var i = 0; i < mxlistArr.length; i++) {
                xml = xml + ' <BPM_BLWCSP_B>';
                xml = xml + '   <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                //xml = xml + '  <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
                xml = xml + '  <RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + '  <fentryno>' + (i + 1) + '</fentryno>';
                xml = xml + '  <fwctime>' + mxlistArr[i].fwctime + '</fwctime>';
                xml = xml + '  <fhgstime>' + mxlistArr[i].fhgstime + '</fhgstime>';
                xml = xml + '  <fwcqx>' + mxlistArr[i].fwcqx + '</fwcqx>';
                xml = xml + '  <fwcsy>' + mxlistArr[i].fwcsy + '</fwcsy>';
                xml = xml + '  <fbkcs>' + mxlistArr[i].fbkcs + '</fbkcs>';
                xml = xml + '  <freamark>' + mxlistArr[i].freamark + '</freamark>';
                xml = xml + ' </BPM_BLWCSP_B>';
            }

            xml = xml + '</FormData>';
            xml = xml + '</XForm>';
            PostXml(xml);
        }
    });

}

//已阅按钮
function hasRead() {
    var pid = $("#stepId").val();

    var comment = '';
    var btnArry = ['取消', '确定'];
    mui.prompt('请选填知会意见', '可以不填', '知会意见', btnArry, function (e) {
        if (e.index == 1) {
            comment = e.value;

            var xml = '<?xml version="1.0"?>';
            xml = xml + '<XForm>';
            xml = xml + '  <Header>';
            xml = xml + '    <Method>InformSubmit</Method>';
            xml = xml + '    <PID>' + pid + '</PID>';
            xml = xml + '    <Comment>' + comment + '</Comment>';
            xml = xml + '  </Header>';
            xml = xml + '</XForm>';

            PostXml(xml);
        }
    });
}

//节点控制字段
function nodeControllerExp(NodeName) {
    tapEvent_csswitch();

    if (NodeName == '开始') {//返回重填，开始节点
        tapEvent();
        //添加明细按钮及删除图标
        $("#tjmx").show();
        $("#deleteProduct").show();
        //抬头表
        $(".saveCanChange").removeAttr('readonly');
        //明细表
        $("#mxlist").find('#mx').each(function () {
            $(this).find("#fwctime,#fhgstime,#fwcqx,#fwcsy,#fbkcs,#freamark").removeAttr('readonly');
        });
    }
}





