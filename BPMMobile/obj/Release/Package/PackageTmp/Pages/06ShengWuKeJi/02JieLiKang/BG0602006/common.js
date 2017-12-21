function prepMsg() {
    $("#fdate").val(getNowFormatDate(2));
    tapEvent();

    var xml = '<?xml version= "1.0" ?>';
    xml = xml + '<Requests>';
    xml = xml + '    <Params>';
    xml = xml + '      <Method>GetFormPostData</Method>';
    xml = xml + '       <ProcessName>洁丽康公司月度办公用品申请汇总</ProcessName>';
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
     

    }).fail(function (e) {

    });
}

function tapEvent() {
    var date = new Date();

    var fyeardata = [
        {
            value: '',
            text: date.getFullYear() - 3
        },
        {
            value: '',
            text: date.getFullYear() - 2
        },
        {
            value: '',
            text: date.getFullYear() - 1
        },
        {
            value: '',
            text: date.getFullYear()
        },
        {
            value: '',
            text: date.getFullYear() + 1
        }
    ];
    showPicker('fyear', fyeardata);

    var fmonthdata = [
        {
            value: '',
            text: '1'
        },
        {
            value: '',
            text: '2'
        },
        {
            value: '',
            text: '3'
        },
        {
            value: '',
            text: '4'
        },
        {
            value: '',
            text: '5'
        },
        {
            value: '',
            text: '6'
        },
        {
            value: '',
            text: '7'
        },
        {
            value: '',
            text: '8'
        },
        {
            value: '',
            text: '9'
        },
        {
            value: '',
            text: '10'
        },
        {
            value: '',
            text: '11'
        },
        {
            value: '',
            text: '12'
        }
    ];
    showPicker('fmonth', fmonthdata);

    $('#tjmx').on('tap', function () {
        var fyear = $("#fyear").val();
        var fmonth = $("#fmonth").val();
        if (!fyear || !fmonth) {
            mui.toast('请先选择时间');
            return;
        }
        $("#mxlist").empty();
        var xml = '<?xml version= "1.0" ?>';
        xml = xml + '    <Requests>';
        xml = xml + '      <Params>';
        xml = xml + '   <DataSource>BPM_WEGO</DataSource>';
        xml = xml + '     <ID>sp_oa_NEWJLKofficesluupies</ID>';
        xml = xml + '   <Type>2</Type>';
        xml = xml + '   <Method>GetUserDataProcedure</Method>';
        xml = xml + '   <ProcedureName>sp_oa_NEWJLKofficesluupies</ProcedureName>';
        xml = xml + '   <Filter>';
        xml = xml + '       <_x0040_fyear>' + fyear + '</_x0040_fyear>';
        xml = xml + '    <_x0040_fmonth>' + fmonth + '</_x0040_fmonth>';
        xml = xml + '   </Filter>';
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
            var item = provideData.Tables[0].Rows;
            for (var i = 0; i < item.length; i++) {
                var li = '<div id="mx" class="mui-card">';
                li = li + '   <div class="mui-input-row itemtitle">';
                li = li + '      <label>明细列表项</label>';
                li = li + '      <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>';
                li = li + '   </div>';
                li = li + '   <div class="mui-row mui-text-center" style="font-size:0.5rem;">';
                li = li + '       <div class="mui-col-xs-4">部门|' + item[i].department;
                li = li + '       </div>';
                li = li + '       <div class="mui-col-xs-4">编码|' + item[i].fwpno;
                li = li + '       </div>';
                li = li + '       <div class="mui-col-xs-4">名称|' + item[i].fwpname;
                li = li + '       </div>';
                li = li + '   </div>';
                li = li + '   <div class="mui-row mui-text-center" style="font-size:0.5rem;">';
                li = li + '       <div class="mui-col-xs-4">规格|' + item[i].fggxh;
                li = li + '       </div>';
                li = li + '       <div class="mui-col-xs-4">单位|' +  item[i].funit;
                li = li + '       </div>';
                li = li + '       <div class="mui-col-xs-4">汇总|' + item[i].famount;
                li = li + '       </div>';
                li = li + '   </div>';

                li = li + '   <div class="mui-input-row">';
                li = li + '       <label for="fdj">单价</label>';
                li = li + '       <input type="number" id="fdj" name="fdj" placeholder="请填写单价"/>';
                li = li + '   </div>';
                li = li + '   <div class="mui-input-row">';
                li = li + '       <label for="fbz">备注</label>';
                li = li + '       <input type="number" id="fbz" name="fbz" placeholder="请填写备注"/>';
                li = li + '   </div>';
                li = li + '  <input type="hidden" id="childTNode" name="childTNode" readonly="readonly" ';
                li = li + '    data-fdept="' + item[i].department + '"';
                li = li + '    data-fwpno="' + item[i].fwpno + '"';
                li = li + '    data-fwpname="' + item[i].fwpname + '"';
                li = li + '    data-fggxh="' + item[i].fggxh + '"';
                li = li + '    data-funit="' + item[i].funit + '"';
                li = li + '    data-famount="' + item[i].famount + '"';
                li = li + '   />';
                li = li + '</div>';
                $("#mxlist").append(li);
                $("#mxlist").find("#fdj").each(function () {
                    $(this).on('input', function () {
                        calcPrice();
                    });
                   
                });
            }

        }).fail(function (e) {

        });
    });
}

function mxItem(fdept, fwpno, fwpname, fggxh, fdj, funit, famount, fbz) {
    var mx = Object.create({
        fdept: fdept,
        fwpno: fwpno,
        fwpname: fwpname,
        fggxh: fggxh,
        fdj: fdj,
        funit: funit,
        famount: famount,
        fbz: fbz,
        _check: function () {
            //if (!fdj) {
            //    mui.toast('请填写单价');
            //    return null;
            //}
            return mx;
        }
    });
    return mx._check();
}
function calcPrice() {
    var ftotal = 0;
    $("#mxlist").find("#mx").each(function () {
        var fdj = parseFloat($(this).find("#fdj").val());
        var famount = parseFloat($(this).find("#childTNode").data('famount'));
        if (isNaN(fdj)) {
            fdj = 0;
        }
        if (isNaN(famount)) {
            famount = 0;
        }
        var total = fdj * famount;
        ftotal += total;
        $("#ftotal").val(ftotal);
    });
    
}
function initData(data, flag) {
    var item = data.FormDataSet.BPM_JLKGSOfficeSuppliesMonth_A[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.fbillno);
    }
    $("#fname").val(item.fname);
    if (String(item.fdate).indexOf('00:00:00') != -1) {
        $("#fdate").val(FormatterTimeT(item.fdate));
    } else {
        $("#fdate").val((item.fdate));
    }
   
    $("#fyear").val(item.fyear);
    $("#fmonth").val(item.fmonth);
    var item_c = data.FormDataSet.BPM_JLKGSOfficeSuppliesMonth_B;
    for (var i = 0; i < item_c.length;i++){
        itemidArr.push(item_c[i].itemid);
        var li = '<div id="mx" class="mui-card">';
        li = li + '   <div class="mui-input-row itemtitle">';
        li = li + '      <label>明细列表项</label>';
        li = li + '      <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>';
        li = li + '   </div>';
        li = li + '   <div class="mui-row mui-text-center" style="font-size:0.5rem;">';
        li = li + '       <div class="mui-col-xs-4">部门|' + item_c[i].fdept;
        li = li + '       </div>';
        li = li + '       <div class="mui-col-xs-4">编码|' + item_c[i].fwpno;
        li = li + '       </div>';
        li = li + '       <div class="mui-col-xs-4">名称|' + item_c[i].fwpname;
        li = li + '       </div>';
        li = li + '   </div>';
        li = li + '   <div class="mui-row mui-text-center" style="font-size:0.5rem;">';
        li = li + '       <div class="mui-col-xs-4">规格|' + changeNullToEmpty( item_c[i].fggxh);
        li = li + '       </div>';
        li = li + '       <div class="mui-col-xs-4">单位|' + changeNullToEmpty( item_c[i].funit);
        li = li + '       </div>';
        li = li + '       <div class="mui-col-xs-4">汇总|' + item_c[i].famount;
        li = li + '       </div>';
        li = li + '   </div>';

        li = li + '   <div class="mui-input-row">';
        li = li + '       <label for="fdj">单价</label>';
        li = li + '       <input type="number" id="fdj" name="fdj" readonly="readonly" value="' + item_c[i].fdj + '"/>';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '       <label for="fbz">备注</label>';
        li = li + '       <input type="number" id="fbz" name="fbz" readonly="readonly" value="' + changeNullToEmpty( item_c[i].fbz) + '"/>';
        li = li + '   </div>';
        li = li + '  <input type="hidden" id="childTNode" name="childTNode" readonly="readonly" ';
        li = li + '    data-fdept="' + item_c[i].fdept + '"';
        li = li + '    data-fwpno="' + item_c[i].fwpno + '"';
        li = li + '    data-fwpname="' + item_c[i].fwpname + '"';
        li = li + '    data-fggxh="' + item_c[i].fggxh + '"';
        li = li + '    data-funit="' + item_c[i].funit + '"';
        li = li + '    data-famount="' + item_c[i].famount + '"';
        li = li + '   />';
        li = li + '</div>';
        $("#mxlist").append(li);
    }
    calcPrice();

}
action = '同意';
function nodeControllerExp(NodeName) {
    if (NodeName == '开始') {
        $("#fdate").removeAttr('readonly');
        tapEvent();
        $("#mxlist").find("#fdj,#fbz").each(function () {
            $(this).removeAttr('readonly');
        });
    } else if (NodeName == "sysInform") {

    } else {
        if (typeof (NodeName) != "undefined") {
            if (String(NodeName).indexOf('办公室文员') != -1) {
                action = '确认';
                $("#agreebt").text(action);
            }
          
        }
    }
}

function Save() {
    var fname = $("#fname").val();
    var fdate = $("#fdate").val();
    var fyear = $("#fyear").val();
    var fmonth = $("#fmonth").val();


    var mxflag = false;
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fdept = $(this).find("#childTNode").data('fdept');
        var fwpno = $(this).find("#childTNode").data('fwpno');
        var fwpname = $(this).find("#childTNode").data('fwpname');
        var fggxh = $(this).find("#childTNode").data('fggxh');
        var fdj = $(this).find("#fdj").val();
        var funit = $(this).find("#childTNode").data('funit');
        var famount = $(this).find("#childTNode").data('famount');
        var fbz = $(this).find("#fbz").val();

        var mx = mxItem(fdept, fwpno, fwpname, fggxh, fdj, funit, famount, fbz);
        mxlistArr.push(mx);
    });
    var btnArry = ["取消", "确定"];
    mui.confirm('即将提交，是否确定？', '提交确认提醒', btnArry, function (e) {
        if (e.index == 1) {
            var xml = '<?xml version= "1.0" ?>';
            xml = xml + '   <XForm>';
            xml = xml + '         <Header>';
            xml = xml + '        <Method>Post</Method>';
            xml = xml + '       <ProcessName>洁丽康公司月度办公用品申请汇总</ProcessName>';
            xml = xml + '         <ProcessVersion>' + version + '</ProcessVersion>';
            xml = xml + '            <DraftGuid></DraftGuid>';
            xml = xml + '             <OwnerMemberFullName>' + BPMOU + '</OwnerMemberFullName>';
            xml = xml + '            <Action>提交</Action>';
            xml = xml + '          <Comment></Comment>';
            xml = xml + '             <InviteIndicateUsers></InviteIndicateUsers>';
            xml = xml + '       </Header>';
            xml = xml + '       <FormData>';

            xml = xml + '   <BPM_JLKGSOfficeSuppliesMonth_A>';
            xml = xml + '   <fbillno>自动生成</fbillno>';
            xml = xml + '  <fname>' + fname + '</fname>';
            xml = xml + '   <fdate>' + fdate + '</fdate>';
            xml = xml + '   <fyear>' + fyear + '</fyear>';
            xml = xml + '   <fmonth>' + fmonth + '</fmonth>';
            xml = xml + '  </BPM_JLKGSOfficeSuppliesMonth_A>';
            for (var i = 0; i < mxlistArr.length;i++){
                xml = xml + '     <BPM_JLKGSOfficeSuppliesMonth_B>';
                xml = xml + '    <RelationRowGuid>'+(i+1)+'</RelationRowGuid>';
                xml = xml + '   <RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + '   <fentryno>' + (i + 1) + '</fentryno>';
                xml = xml + '    <fdept>' + mxlistArr[i].fdept + '</fdept>';
                xml = xml + '    <fwpno>' + mxlistArr[i].fwpno + '</fwpno>';
                xml = xml + '    <fwpname>' + mxlistArr[i].fwpname + '</fwpname>';
                xml = xml + '   <fggxh>' + mxlistArr[i].fggxh + '</fggxh>';
                xml = xml + '   <fdj>' + mxlistArr[i].fdj + '</fdj>';
                xml = xml + '   <funit>' + mxlistArr[i].funit + '</funit>';
                xml = xml + '    <famount>' + mxlistArr[i].famount + '</famount>';
                xml = xml + '    <fbz>' + mxlistArr[i].fbz + '</fbz>';
                xml = xml + '   </BPM_JLKGSOfficeSuppliesMonth_B>';
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
    var fdate = $("#fdate").val();
    var fyear = $("#fyear").val();
    var fmonth = $("#fmonth").val();

    var mxflag = false;
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fdept = $(this).find("#childTNode").data('fdept');
        var fwpno = $(this).find("#childTNode").data('fwpno');
        var fwpname = $(this).find("#childTNode").data('fwpname');
        var fggxh = $(this).find("#childTNode").data('fggxh');
        var fdj = $(this).find("#fdj").val();
        var funit = $(this).find("#childTNode").data('funit');
        var famount = $(this).find("#childTNode").data('famount');
        var fbz = $(this).find("#fbz").val();

        var mx = mxItem(fdept, fwpno, fwpname, fggxh, fdj, funit, famount, fbz);
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

            xml = xml + '   <BPM_JLKGSOfficeSuppliesMonth_A>';
            xml = xml + '   <fbillno>' + fbillno + '</fbillno>';
            xml = xml + '  <fname>' + fname + '</fname>';
            xml = xml + '   <fdate>' + fdate + '</fdate>';
            xml = xml + '   <fyear>' + fyear + '</fyear>';
            xml = xml + '   <fmonth>' + fmonth + '</fmonth>';
            xml = xml + '  </BPM_JLKGSOfficeSuppliesMonth_A>';
            for (var i = 0; i < mxlistArr.length; i++) {
                xml = xml + '     <BPM_JLKGSOfficeSuppliesMonth_B>';
                xml = xml + '    <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml = xml + '   <RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + '   <fentryno>' + (i + 1) + '</fentryno>';
                xml = xml + '    <fdept>' + mxlistArr[i].fdept + '</fdept>';
                xml = xml + '    <fwpno>' + mxlistArr[i].fwpno + '</fwpno>';
                xml = xml + '    <fwpname>' + mxlistArr[i].fwpname + '</fwpname>';
                xml = xml + '   <fggxh>' + mxlistArr[i].fggxh + '</fggxh>';
                xml = xml + '   <fdj>' + mxlistArr[i].fdj + '</fdj>';
                xml = xml + '   <funit>' + mxlistArr[i].funit + '</funit>';
                xml = xml + '    <famount>' + mxlistArr[i].famount + '</famount>';
                xml = xml + '    <fbz>' + mxlistArr[i].fbz + '</fbz>';
                xml = xml + '   </BPM_JLKGSOfficeSuppliesMonth_B>';
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
    var fdate = $("#fdate").val();
    var fyear = $("#fyear").val();
    var fmonth = $("#fmonth").val();

    var mxflag = false;
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fdept = $(this).find("#childTNode").data('fdept');
        var fwpno = $(this).find("#childTNode").data('fwpno');
        var fwpname = $(this).find("#childTNode").data('fwpname');
        var fggxh = $(this).find("#childTNode").data('fggxh');
        var fdj = $(this).find("#fdj").val();
        var funit = $(this).find("#childTNode").data('funit');
        var famount = $(this).find("#childTNode").data('famount');
        var fbz = $(this).find("#fbz").val();

        var mx = mxItem(fdept, fwpno, fwpname, fggxh, fdj, funit, famount, fbz);
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
            xml = xml + '   <BPM_JLKGSOfficeSuppliesMonth_A>';
            xml = xml + '   <fbillno>' + fbillno + '</fbillno>';
            xml = xml + '  <fname>' + fname + '</fname>';
            xml = xml + '   <fdate>' + fdate + '</fdate>';
            xml = xml + '   <fyear>' + fyear + '</fyear>';
            xml = xml + '   <fmonth>' + fmonth + '</fmonth>';
            xml = xml + '  </BPM_JLKGSOfficeSuppliesMonth_A>';
            for (var i = 0; i < mxlistArr.length; i++) {
                xml = xml + '     <BPM_JLKGSOfficeSuppliesMonth_B>';
                xml = xml + '    <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml = xml + '   <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
                xml = xml + '   <fentryno>' + (i + 1) + '</fentryno>';
                xml = xml + '    <fdept>' + mxlistArr[i].fdept + '</fdept>';
                xml = xml + '    <fwpno>' + mxlistArr[i].fwpno + '</fwpno>';
                xml = xml + '    <fwpname>' + mxlistArr[i].fwpname + '</fwpname>';
                xml = xml + '   <fggxh>' + mxlistArr[i].fggxh + '</fggxh>';
                xml = xml + '   <fdj>' + mxlistArr[i].fdj + '</fdj>';
                xml = xml + '   <funit>' + mxlistArr[i].funit + '</funit>';
                xml = xml + '    <famount>' + mxlistArr[i].famount + '</famount>';
                xml = xml + '    <fbz>' + mxlistArr[i].fbz + '</fbz>';
                xml = xml + '   </BPM_JLKGSOfficeSuppliesMonth_B>';
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
    var fdate = $("#fdate").val();
    var fyear = $("#fyear").val();
    var fmonth = $("#fmonth").val();

    var mxflag = false;
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fdept = $(this).find("#childTNode").data('fdept');
        var fwpno = $(this).find("#childTNode").data('fwpno');
        var fwpname = $(this).find("#childTNode").data('fwpname');
        var fggxh = $(this).find("#childTNode").data('fggxh');
        var fdj = $(this).find("#fdj").val();
        var funit = $(this).find("#childTNode").data('funit');
        var famount = $(this).find("#childTNode").data('famount');
        var fbz = $(this).find("#fbz").val();

        var mx = mxItem(fdept, fwpno, fwpname, fggxh, fdj, funit, famount, fbz);
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

            xml = xml + '   <BPM_JLKGSOfficeSuppliesMonth_A>';
            xml = xml + '   <fbillno>' + fbillno + '</fbillno>';
            xml = xml + '  <fname>' + fname + '</fname>';
            xml = xml + '   <fdate>' + fdate + '</fdate>';
            xml = xml + '   <fyear>' + fyear + '</fyear>';
            xml = xml + '   <fmonth>' + fmonth + '</fmonth>';
            xml = xml + '  </BPM_JLKGSOfficeSuppliesMonth_A>';
            for (var i = 0; i < mxlistArr.length; i++) {
                xml = xml + '     <BPM_JLKGSOfficeSuppliesMonth_B>';
                xml = xml + '    <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml = xml + '   <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
                xml = xml + '   <fentryno>' + (i + 1) + '</fentryno>';
                xml = xml + '    <fdept>' + mxlistArr[i].fdept + '</fdept>';
                xml = xml + '    <fwpno>' + mxlistArr[i].fwpno + '</fwpno>';
                xml = xml + '    <fwpname>' + mxlistArr[i].fwpname + '</fwpname>';
                xml = xml + '   <fggxh>' + mxlistArr[i].fggxh + '</fggxh>';
                xml = xml + '   <fdj>' + mxlistArr[i].fdj + '</fdj>';
                xml = xml + '   <funit>' + mxlistArr[i].funit + '</funit>';
                xml = xml + '    <famount>' + mxlistArr[i].famount + '</famount>';
                xml = xml + '    <fbz>' + mxlistArr[i].fbz + '</fbz>';
                xml = xml + '   </BPM_JLKGSOfficeSuppliesMonth_B>';
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

        xml = xml + '   <BPM_JLKGSOfficeSuppliesMonth_A>';
        xml = xml + '   <fbillno>' + fbillno + '</fbillno>';
        xml = xml + '  <fname>' + fname + '</fname>';
        xml = xml + '   <fdate>' + fdate + '</fdate>';
        xml = xml + '   <fyear>' + fyear + '</fyear>';
        xml = xml + '   <fmonth>' + fmonth + '</fmonth>';
        xml = xml + '  </BPM_JLKGSOfficeSuppliesMonth_A>';
        for (var i = 0; i < mxlistArr.length; i++) {
            xml = xml + '     <BPM_JLKGSOfficeSuppliesMonth_B>';
            xml = xml + '    <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
            xml = xml + '   <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
            xml = xml + '   <fentryno>' + (i + 1) + '</fentryno>';
            xml = xml + '    <fdept>' + mxlistArr[i].fdept + '</fdept>';
            xml = xml + '    <fwpno>' + mxlistArr[i].fwpno + '</fwpno>';
            xml = xml + '    <fwpname>' + mxlistArr[i].fwpname + '</fwpname>';
            xml = xml + '   <fggxh>' + mxlistArr[i].fggxh + '</fggxh>';
            xml = xml + '   <fdj>' + mxlistArr[i].fdj + '</fdj>';
            xml = xml + '   <funit>' + mxlistArr[i].funit + '</funit>';
            xml = xml + '    <famount>' + mxlistArr[i].famount + '</famount>';
            xml = xml + '    <fbz>' + mxlistArr[i].fbz + '</fbz>';
            xml = xml + '   </BPM_JLKGSOfficeSuppliesMonth_B>';
        }
        xml = xml + '</FormData>';
        xml = xml + '</XForm>';
        PostXml(xml);
    }


}