function prepMsg() {
    $("#fdate").val(getNowFormatDate(2));
    tapEvent();
    var xml = '<?xml version= "1.0" ?>';
    xml = xml + '<Requests>';
    xml = xml + '    <Params>';
    xml = xml + '      <Method>GetFormPostData</Method>';
    xml = xml + '       <ProcessName>威瑞外科派车申请流程</ProcessName>';
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
}

function tapEvent() {
    var fcphdata = [
        {
            value: '',
            text:'鲁KBA017'
        },
        {
            value: '',
            text: '鲁KD781J'
        }
    ];

    showPickerByZepto('#mxlist', '#fcph', fcphdata);


    $('#tjmx').on('tap', function () {
        var li = '<div id="mx" class="mui-card">';
        li = li + '   <div class="mui-input-row itemtitle">';
        li = li + '      <label>明细列表项</label>';
        li = li + '      <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>';
        li = li + '   </div>';

        li = li + '   <div class="mui-input-row">';
        li = li + '       <label for="fclxh">车辆型号</label>';
        li = li + '       <input type="text" id="fclxh" name="fclxh" placeholder="请填写车辆型号" />';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '       <label for="fcph">车牌号</label>';
        li = li + '       <input type="text" id="fcph" name="fcph" readonly="readonly" placeholder="请选择车牌号" />';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '       <label for="fsj">司机</label>';
        li = li + '       <input type="text" id="fsj" name="fsj" placeholder="请填写司机" />';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '       <label for="fsjdh">司机电话</label>';
        li = li + '       <input type="text" id="fsjdh" name="fsjdh" placeholder="请填写司机电话" />';
        li = li + '   </div>';
        li = li + '  <div class="mui-input-row">';
        li = li + '       <label for="fksdate">开始时间</label>';
        li = li + '       <input type="date" id="fksdate" name="fksdate" />';
        li = li + ' </div>';
        li = li + ' <div class="mui-input-row">';
        li = li + '       <label for="fjsdate">结束时间</label>';
        li = li + '       <input type="date" id="fjsdate" name="fjsdate" />';
        li = li + '  </div>';
        li = li + '  <div class="mui-input-row">';
        li = li + '       <label for="fqclcs">启程里程数</label>';
        li = li + '       <input type="text" id="fqclcs" name="fqclcs" placeholder="请填写车辆启程里程数" />';
        li = li + '  </div>';
        li = li + '  <div class="mui-input-row">';
        li = li + '       <label for="fjslcs">结束里程数</label>';
        li = li + '       <input type="text" id="fjslcs" name="fjslcs" placeholder="请填写车辆结束里程数" />';
        li = li + '   </div>';
        li = li + '</div>';
        $("#mxlist").append(li);
        showPickerByZepto('#mxlist', '#fcph', fcphdata);

    });

}

function mxItem(fclxh, fcph, fsj, fsjdh, fksdate, fjsdate, fqclcs, fjslcs) {

    var mx = Object.create({

        fclxh: fclxh,
        fcph: fcph,
        fsj: fsj,
        fsjdh: fsjdh,
        fksdate: fksdate,
        fjsdate: fjsdate,
        fqclcs: fqclcs,
        fjslcs: fjslcs,
        _check: function () {
           
            return mx;
        }
    });
    return mx._check();
}
function initData(data, flag) {
    var item = data.FormDataSet.BPM_WRWKPCSQ_A[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.fbillno);
    }
    $("#fname").val(item.fname);
    $("#fdept").val(item.fdept);
    $("#fdate").val(FormatterTimeYMS(item.fdate));
    $("#fsqsy").val(item.fsy);
    var item_c = data.FormDataSet.BPM_WRWKPCSQ_B;
    for (var i = 0; i < item_c.length;i++){
        itemidArr.push(item_c[i].itemid);
        var li = '<div id="mx" class="mui-card">';
        li = li + '   <div class="mui-input-row itemtitle">';
        li = li + '      <label>明细列表项</label>';
        li = li + '      <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>';
        li = li + '   </div>';

        li = li + '   <div class="mui-input-row">';
        li = li + '       <label for="fclxh">车辆型号</label>';
        li = li + '       <input type="text" id="fclxh" name="fclxh" readonly="readonly"  value="' + item_c[i].fclxh + '"/>';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '       <label for="fcph">车牌号</label>';
        li = li + '       <input type="text" id="fcph" name="fcph" readonly="readonly"  value="' + item_c[i].fcph + '"/>';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '       <label for="fsj">司机</label>';
        li = li + '       <input type="text" id="fsj" name="fsj"  readonly="readonly"  value="' + item_c[i].fsj + '" />';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '       <label for="fsjdh">司机电话</label>';
        li = li + '       <input type="text" id="fsjdh" name="fsjdh" readonly="readonly"  value="' + item_c[i].fsjdh + '" />';
        li = li + '   </div>';
        li = li + '  <div class="mui-input-row">';
        li = li + '       <label for="fksdate">开始时间</label>';
        li = li + '       <input type="date" id="fksdate" name="fksdate" readonly="readonly"  value="' + FormatterTimeYMS( item_c[i].fksdate) + '"/>';
        li = li + ' </div>';
        li = li + ' <div class="mui-input-row">';
        li = li + '       <label for="fjsdate">结束时间</label>';
        li = li + '       <input type="date" id="fjsdate" name="fjsdate" readonly="readonly"  value="' + FormatterTimeYMS(item_c[i].fjsdate) + '"/>';
        li = li + '  </div>';
        li = li + '  <div class="mui-input-row">';
        li = li + '       <label for="fqclcs">启程里程数</label>';
        li = li + '       <input type="text" id="fqclcs" name="fqclcs" readonly="readonly"  value="' + item_c[i].fkslcs + '" />';
        li = li + '  </div>';
        li = li + '  <div class="mui-input-row">';
        li = li + '       <label for="fjslcs">结束里程数</label>';
        li = li + '       <input type="text" id="fjslcs" name="fjslcs" readonly="readonly"  value="' + item_c[i].fjslcs + '"  />';
        li = li + '   </div>';
        li = li + '</div>';
        $("#mxlist").append(li);
    }
}
function nodeControllerExp(NodeName) {
    if (NodeName == '开始') {
        $("#fdate,#fsqsy").removeAttr('readonly');
        $("#mxlist").find('span').each(function () {
            $(this).css('display', 'block');
        });
        $('#tjmx').show();
        tapEvent();
        $("#mxlist").find("#fclxh,#fsj,#fsjdh,#fksdate,#fjsdate,#fqclcs,#fjslcs").each(function () {
            $(this).removeAttr('readonly');
        });
    } 

   
    console.log(NodeName);

}

function nodeShareExt(ShareNode) {
    if (ShareNode == '流程被共享') {
        $("#approvalD").empty();
        var li = '';
        li = li + '    &nbsp;&nbsp;';
        li = li + '   <button class="mui-btn mui-btn-green roundbt" type="button" style="width:100%" id="pickupbt" onclick="PickupShareTaskExt()">从共享任务中取出</button>';
        $("#approvalD").append(li);

    } else if (ShareNode == '流程被取出') {

        var li = '';
        li = li + '    &nbsp;&nbsp;';
        li = li + '   <button class="mui-btn mui-btn-green roundbt" type="button" style="width:100%" id="pickbackbt" onclick="PutbackShareTaskExt()">放回共享任务</button>';
        $("#approvalD").append(li);

    }
}

function Save() {
    var fname = $("#fname").val();
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();
    var fsqsy = $("#fsqsy").val();

    var mxflag = false;
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fclxh = $(this).find("#fclxh").val();
        var fcph = $(this).find("#fcph").val();
        var fsj = $(this).find("#fsj").val();
        var fsjdh = $(this).find("#fsjdh").val();
        var fksdate = $(this).find("#fksdate").val();
        var fjsdate = $(this).find("#fjsdate").val();
        var fqclcs = $(this).find("#fqclcs").val();
        var fjslcs = $(this).find("#fjslcs").val();
      
        var mx = mxItem(fclxh, fcph, fsj, fsjdh, fksdate, fjsdate, fqclcs, fjslcs);
        mxlistArr.push(mx);
    });
    var btnArry = ["取消", "确定"];
    mui.confirm('即将提交，是否确定？', '提交确认提醒', btnArry, function (e) {
        if (e.index == 1) {
            var xml = '<?xml version= "1.0" ?>';
            xml = xml + '   <XForm>';
            xml = xml + '         <Header>';
            xml = xml + '        <Method>Post</Method>';
            xml = xml + '       <ProcessName>威瑞外科派车申请流程</ProcessName>';
            xml = xml + '         <ProcessVersion>' + version + '</ProcessVersion>';
            xml = xml + '            <DraftGuid></DraftGuid>';
            xml = xml + '             <OwnerMemberFullName>' + BPMOU + '</OwnerMemberFullName>';
            xml = xml + '            <Action>提交</Action>';
            xml = xml + '          <Comment></Comment>';
            xml = xml + '             <InviteIndicateUsers></InviteIndicateUsers>';
            xml = xml + '       </Header>';
            xml = xml + '       <FormData>';

            xml = xml + '    <BPM_WRWKPCSQ_A>';
            xml = xml + '  <fbillno>自动生成</fbillno>';
            xml = xml + '   <fname>' + fname + '</fname>';
            xml = xml + '   <fdept>' + fdept + '</fdept>';
            xml = xml + '   <fdate>' + fdate + '</fdate>';
            xml = xml + '   <fsy>' + fsqsy+'</fsy>';
            xml = xml + '    </BPM_WRWKPCSQ_A>';
            for (var i = 0; i < mxlistArr.length;i++){
                xml = xml + '   <BPM_WRWKPCSQ_B>';
                xml = xml + '  <RelationRowGuid>'+(i+1)+'</RelationRowGuid>';
                xml = xml + '  <RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + '  <fentryno>' + (i + 1) + '</fentryno>';
                xml = xml + '   <fclxh>' + mxlistArr[i].fclxh + '</fclxh>';
                xml = xml + '   <fcph>' + mxlistArr[i].fcph + '</fcph>';
                xml = xml + '  <fsj>' + mxlistArr[i].fsj + '</fsj>';
                xml = xml + '  <fsjdh>' + mxlistArr[i].fsjdh + '</fsjdh>';
                xml = xml + '   <fksdate>' + mxlistArr[i].fksdate + '</fksdate>';
                xml = xml + ' <fjsdate>' + mxlistArr[i].fjsdate + '</fjsdate>';
                xml = xml + '  <fkslcs>' + mxlistArr[i].fqclcs + '</fkslcs>';
                xml = xml + '  <fjslcs>' + mxlistArr[i].fjslcs + '</fjslcs>';
                xml = xml + ' </BPM_WRWKPCSQ_B>';
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
    var fsqsy = $("#fsqsy").val();

    var mxflag = false;
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fclxh = $(this).find("#fclxh").val();
        var fcph = $(this).find("#fcph").val();
        var fsj = $(this).find("#fsj").val();
        var fsjdh = $(this).find("#fsjdh").val();
        var fksdate = $(this).find("#fksdate").val();
        var fjsdate = $(this).find("#fjsdate").val();
        var fqclcs = $(this).find("#fqclcs").val();
        var fjslcs = $(this).find("#fjslcs").val();

        var mx = mxItem(fclxh, fcph, fsj, fsjdh, fksdate, fjsdate, fqclcs, fjslcs);
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

            xml = xml + '    <BPM_WRWKPCSQ_A>';
            xml = xml + '  <fbillno>' + fbillno + '</fbillno>';
            xml = xml + '   <fname>' + fname + '</fname>';
            xml = xml + '   <fdept>' + fdept + '</fdept>';
            xml = xml + '   <fdate>' + fdate + '</fdate>';
            xml = xml + '   <fsy>' + fsqsy + '</fsy>';
            xml = xml + '    </BPM_WRWKPCSQ_A>';
            for (var i = 0; i < mxlistArr.length; i++) {
                xml = xml + '   <BPM_WRWKPCSQ_B>';
                xml = xml + '  <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml = xml + '  <RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + '  <fentryno>' + (i + 1) + '</fentryno>';
                xml = xml + '   <fclxh>' + mxlistArr[i].fclxh + '</fclxh>';
                xml = xml + '   <fcph>' + mxlistArr[i].fcph + '</fcph>';
                xml = xml + '  <fsj>' + mxlistArr[i].fsj + '</fsj>';
                xml = xml + '  <fsjdh>' + mxlistArr[i].fsjdh + '</fsjdh>';
                xml = xml + '   <fksdate>' + mxlistArr[i].fksdate + '</fksdate>';
                xml = xml + ' <fjsdate>' + mxlistArr[i].fjsdate + '</fjsdate>';
                xml = xml + '  <fkslcs>' + mxlistArr[i].fqclcs + '</fkslcs>';
                xml = xml + '  <fjslcs>' + mxlistArr[i].fjslcs + '</fjslcs>';
                xml = xml + ' </BPM_WRWKPCSQ_B>';
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
    var fsqsy = $("#fsqsy").val();

    var mxflag = false;
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fclxh = $(this).find("#fclxh").val();
        var fcph = $(this).find("#fcph").val();
        var fsj = $(this).find("#fsj").val();
        var fsjdh = $(this).find("#fsjdh").val();
        var fksdate = $(this).find("#fksdate").val();
        var fjsdate = $(this).find("#fjsdate").val();
        var fqclcs = $(this).find("#fqclcs").val();
        var fjslcs = $(this).find("#fjslcs").val();

        var mx = mxItem(fclxh, fcph, fsj, fsjdh, fksdate, fjsdate, fqclcs, fjslcs);
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

            xml = xml + '    <BPM_WRWKPCSQ_A>';
            xml = xml + '  <fbillno>' + fbillno + '</fbillno>';
            xml = xml + '   <fname>' + fname + '</fname>';
            xml = xml + '   <fdept>' + fdept + '</fdept>';
            xml = xml + '   <fdate>' + fdate + '</fdate>';
            xml = xml + '   <fsy>' + fsqsy + '</fsy>';
            xml = xml + '    </BPM_WRWKPCSQ_A>';
            for (var i = 0; i < mxlistArr.length; i++) {
                xml = xml + '   <BPM_WRWKPCSQ_B>';
                xml = xml + '  <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml = xml + '  <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
                xml = xml + '  <fentryno>' + (i + 1) + '</fentryno>';
                xml = xml + '   <fclxh>' + mxlistArr[i].fclxh + '</fclxh>';
                xml = xml + '   <fcph>' + mxlistArr[i].fcph + '</fcph>';
                xml = xml + '  <fsj>' + mxlistArr[i].fsj + '</fsj>';
                xml = xml + '  <fsjdh>' + mxlistArr[i].fsjdh + '</fsjdh>';
                xml = xml + '   <fksdate>' + mxlistArr[i].fksdate + '</fksdate>';
                xml = xml + ' <fjsdate>' + mxlistArr[i].fjsdate + '</fjsdate>';
                xml = xml + '  <fkslcs>' + mxlistArr[i].fqclcs + '</fkslcs>';
                xml = xml + '  <fjslcs>' + mxlistArr[i].fjslcs + '</fjslcs>';
                xml = xml + ' </BPM_WRWKPCSQ_B>';
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
    var fsqsy = $("#fsqsy").val();

    var mxflag = false;
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fclxh = $(this).find("#fclxh").val();
        var fcph = $(this).find("#fcph").val();
        var fsj = $(this).find("#fsj").val();
        var fsjdh = $(this).find("#fsjdh").val();
        var fksdate = $(this).find("#fksdate").val();
        var fjsdate = $(this).find("#fjsdate").val();
        var fqclcs = $(this).find("#fqclcs").val();
        var fjslcs = $(this).find("#fjslcs").val();

        var mx = mxItem(fclxh, fcph, fsj, fsjdh, fksdate, fjsdate, fqclcs, fjslcs);
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

            xml = xml + '    <BPM_WRWKPCSQ_A>';
            xml = xml + '  <fbillno>' + fbillno + '</fbillno>';
            xml = xml + '   <fname>' + fname + '</fname>';
            xml = xml + '   <fdept>' + fdept + '</fdept>';
            xml = xml + '   <fdate>' + fdate + '</fdate>';
            xml = xml + '   <fsy>' + fsqsy + '</fsy>';
            xml = xml + '    </BPM_WRWKPCSQ_A>';
            for (var i = 0; i < mxlistArr.length; i++) {
                xml = xml + '   <BPM_WRWKPCSQ_B>';
                xml = xml + '  <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml = xml + '  <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
                xml = xml + '  <fentryno>' + (i + 1) + '</fentryno>';
                xml = xml + '   <fclxh>' + mxlistArr[i].fclxh + '</fclxh>';
                xml = xml + '   <fcph>' + mxlistArr[i].fcph + '</fcph>';
                xml = xml + '  <fsj>' + mxlistArr[i].fsj + '</fsj>';
                xml = xml + '  <fsjdh>' + mxlistArr[i].fsjdh + '</fsjdh>';
                xml = xml + '   <fksdate>' + mxlistArr[i].fksdate + '</fksdate>';
                xml = xml + ' <fjsdate>' + mxlistArr[i].fjsdate + '</fjsdate>';
                xml = xml + '  <fkslcs>' + mxlistArr[i].fqclcs + '</fkslcs>';
                xml = xml + '  <fjslcs>' + mxlistArr[i].fjslcs + '</fjslcs>';
                xml = xml + ' </BPM_WRWKPCSQ_B>';
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

        xml = xml + '    <BPM_WRWKPCSQ_A>';
        xml = xml + '  <fbillno>' + fbillno + '</fbillno>';
        xml = xml + '   <fname>' + fname + '</fname>';
        xml = xml + '   <fdept>' + fdept + '</fdept>';
        xml = xml + '   <fdate>' + fdate + '</fdate>';
        xml = xml + '   <fsy>' + fsqsy + '</fsy>';
        xml = xml + '    </BPM_WRWKPCSQ_A>';
        for (var i = 0; i < mxlistArr.length; i++) {
            xml = xml + '   <BPM_WRWKPCSQ_B>';
            xml = xml + '  <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
            xml = xml + '  <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
            xml = xml + '  <fentryno>' + (i + 1) + '</fentryno>';
            xml = xml + '   <fclxh>' + mxlistArr[i].fclxh + '</fclxh>';
            xml = xml + '   <fcph>' + mxlistArr[i].fcph + '</fcph>';
            xml = xml + '  <fsj>' + mxlistArr[i].fsj + '</fsj>';
            xml = xml + '  <fsjdh>' + mxlistArr[i].fsjdh + '</fsjdh>';
            xml = xml + '   <fksdate>' + mxlistArr[i].fksdate + '</fksdate>';
            xml = xml + ' <fjsdate>' + mxlistArr[i].fjsdate + '</fjsdate>';
            xml = xml + '  <fkslcs>' + mxlistArr[i].fqclcs + '</fkslcs>';
            xml = xml + '  <fjslcs>' + mxlistArr[i].fjslcs + '</fjslcs>';
            xml = xml + ' </BPM_WRWKPCSQ_B>';
        }

        xml = xml + '</FormData>';
        xml = xml + '</XForm>';
        PostXml(xml);
    }
}