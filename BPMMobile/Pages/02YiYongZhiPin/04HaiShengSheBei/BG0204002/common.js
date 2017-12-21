function prepMsg() {
    $("#fdate").val(getNowFormatDate(2));
    tapEvent();
   
}

function tapEvent() {
    var date = new Date();

    var fyeardata = [
        {
            value: '',
            text: date.getFullYear()-3
        },
        {
            value: '',
            text: date.getFullYear()-2
        },
        {
            value: '',
            text: date.getFullYear()-1
        },
        {
            value: '',
            text: date.getFullYear()
        },
        {
            value: '',
            text: date.getFullYear()+1
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
        xml = xml + '     <ID>sp_oa_hsgsofficesluupies</ID>';
        xml = xml + '   <Type>2</Type>';
        xml = xml + '   <Method>GetUserDataProcedure</Method>';
        xml = xml + '   <ProcedureName>sp_oa_hsgsofficesluupies</ProcedureName>';
        xml = xml + '   <Filter>';
        xml = xml + '       <_x0040_Startfyear>' + fyear + '</_x0040_Startfyear>';
        xml = xml + '    <_x0040_Startfmonth>' + fmonth + '</_x0040_Startfmonth>';
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
                li = li + '   <div class="mui-row">';
                li = li + '       <div class="mui-col-xs-4">编码|' + item[i].fwpno;
                li = li + '       </div>';
                li = li + '       <div class="mui-col-xs-4">名称|' + item[i].fwpname;
                li = li + '       </div>';
                li = li + '       <div class="mui-col-xs-4">规格|' + item[i].fggxh;
                li = li + '       </div>';
                li = li + '   <div>';
                li = li + '   <div class="mui-row">';
                li = li + '       <div class="mui-col-xs-4">单位|' + item[i].funit;
                li = li + '       </div>';
                li = li + '       <div class="mui-col-xs-4">数量|' + item[i].famount;
                li = li + '       </div>';
                li = li + '       <div class="mui-col-xs-4">明细|' + item[i].fdetail;
                li = li + '       </div>';
                li = li + '   <div>';
                li = li + '  <input type="hidden" id="childTNode" name="childTNode" readonly="readonly" data-fwpno="' + item[i].fwpno + '"';
                li = li + '   data-fwpname="' + item[i].fwpname + '"';
                li = li + '   data-fggxh="' + item[i].fggxh + '"';
                li = li + '   data-funit="' + item[i].funit + '"';
                li = li + '   data-famount="' + item[i].famount + '"';
                li = li + '   data-fdetail="' + item[i].fdetail + '"';
                li = li + '   />';
                li = li + '</div>';
                $("#mxlist").append(li);
            }

        }).fail(function (e) {

        });
    });
}


function mxItem(fwpno, fwpname, fggxh, funit, famount, fdetail) {
    var mx = Object.create({
        fwpno: fwpno,
        fwpname: fwpname,
        fggxh: fggxh,
        funit: funit,
        famount: famount,
        fdetail: fdetail,
        _check: function () {
            return mx;
        }
    });
    return mx._check();
}

function initData(data, flag) {
    var item = data.FormDataSet.BPM_HSYDBGYPSQHZ_A[0];
    if (flag) {

        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.fbillno);
    }
    $("#fname").val(item.fname);
    $("#fdate").val((item.fdate));
    $("#fyear").val(item.fyear);
    $("#fmonth").val(item.fmonth);
    var item_c = data.FormDataSet.BPM_HSYDBGYPSQHZ_B;
    for (var i = 0; i < item_c.length; i++) {
        itemidArr.push(item_c[i].itemid);
        var li = '<div id="mx" class="mui-card">';
        li = li + '   <div class="mui-input-row itemtitle">';
        li = li + '      <label>明细列表项</label>';
        li = li + '      <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>';
        li = li + '   </div>';
        li = li + '   <div class="mui-row">';
        li = li + '       <div class="mui-col-xs-4">编码|' + item_c[i].fwpno;
        li = li + '       </div>';
        li = li + '       <div class="mui-col-xs-4">名称|' + item_c[i].fwpname;
        li = li + '       </div>';
        li = li + '       <div class="mui-col-xs-4">规格|' + changeNullToEmpty( item_c[i].fggxh);
        li = li + '       </div>';
        li = li + '   <div>';
        li = li + '   <div class="mui-row">';
        li = li + '       <div class="mui-col-xs-4">单位|' + item_c[i].funit;
        li = li + '       </div>';
        li = li + '       <div class="mui-col-xs-4">数量|' + item_c[i].famount;
        li = li + '       </div>';
        li = li + '       <div class="mui-col-xs-4">明细|' + item_c[i].fdetail;
        li = li + '       </div>';
        li = li + '   <div>';
        li = li + '  <input type="hidden" id="childTNode" name="childTNode" readonly="readonly" data-fwpno="' + item_c[i].fwpno + '"';
        li = li + '   data-fwpname="' + item_c[i].fwpname + '"';
        li = li + '   data-fggxh="' + item_c[i].fggxh + '"';
        li = li + '   data-funit="' + item_c[i].funit + '"';
        li = li + '   data-famount="' + item_c[i].famount + '"';
        li = li + '   data-fdetail="' + item_c[i].fdetail + '"';
        li = li + '   />';
        li = li + '</div>';
        $("#mxlist").append(li);
    }

}
function nodeControllerExp(NodeName) {
    if (NodeName == '开始') {
        tapEvent();
        $("#fname,#fdate").removeAttr('readonly');
    }
}
function Save() {
    var fname = $("#fname").val();
    var fdate = $("#fdate").val();
    var fyear = $("#fyear").val();
    var fmonth = $("#fmonth").val();
    if (!fname) {
        mui.toast('请填写汇总人');
        return;
    }
    var mxflag = false;
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fwpno = $(this).find("#childTNode").data('fwpno');
        var fwpname = $(this).find("#childTNode").data('fwpname');
        var fggxh = $(this).find("#childTNode").data('fggxh');
        var funit = $(this).find("#childTNode").data('funit');
        var famount = $(this).find("#childTNode").data('famount');
        var fdetail = $(this).find("#childTNode").data('fdetail');

        var mx = mxItem(fwpno, fwpname, fggxh, funit, famount, fdetail);
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
            xml = xml + '       <ProcessName>海盛公司月度办公用品申请汇总</ProcessName>';
            xml = xml + '         <ProcessVersion>' + version + '</ProcessVersion>';
            xml = xml + '            <DraftGuid></DraftGuid>';
            xml = xml + '             <OwnerMemberFullName>' + BPMOU + '</OwnerMemberFullName>';
            xml = xml + '            <Action>提交</Action>';
            xml = xml + '          <Comment></Comment>';
            xml = xml + '             <InviteIndicateUsers></InviteIndicateUsers>';
            xml = xml + '       </Header>';
            xml = xml + '       <FormData>';

            xml = xml + '   <BPM_HSYDBGYPSQHZ_A>';
            xml = xml + '    <fbillno>自动生成</fbillno>';
            xml = xml + '    <fname>' + fname + '</fname>';
            xml = xml + '    <fdate>' + fdate + '</fdate>';
            xml = xml + '   <fyear>' + fyear + '</fyear>';
            xml = xml + '   <fmonth>' + fmonth + '</fmonth>';
            xml = xml + '   </BPM_HSYDBGYPSQHZ_A>';

            for (var i = 0; i < mxlistArr.length;i++){
                xml = xml + ' <BPM_HSYDBGYPSQHZ_B>';
                xml = xml + ' <RelationRowGuid>'+(i+1)+'</RelationRowGuid>';
                xml = xml + ' <RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + ' <fentryno>' + (i + 1) + '</fentryno>';
                xml = xml + '<fwpno>' + mxlistArr[i].fwpno + '</fwpno>';
                xml = xml + ' <fwpname>' + mxlistArr[i].fwpname + '</fwpname>';
                xml = xml + ' <fggxh>' + mxlistArr[i].fggxh + '</fggxh>';
                xml = xml + ' <funit>' + mxlistArr[i].funit + '</funit>';
                xml = xml + ' <famount>' + mxlistArr[i].famount + '</famount>';
                xml = xml + ' <fdetail>' + mxlistArr[i].fdetail + '</fdetail>';
                xml = xml + '  </BPM_HSYDBGYPSQHZ_B>';
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
    if (!fname) {
        mui.toast('请填写汇总人');
        return;
    }
    var mxflag = false;
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fwpno = $(this).find("#childTNode").data('fwpno');
        var fwpname = $(this).find("#childTNode").data('fwpname');
        var fggxh = $(this).find("#childTNode").data('fggxh');
        var funit = $(this).find("#childTNode").data('funit');
        var famount = $(this).find("#childTNode").data('famount');
        var fdetail = $(this).find("#childTNode").data('fdetail');

        var mx = mxItem(fwpno, fwpname, fggxh, funit, famount, fdetail);
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

            xml = xml + '   <BPM_HSYDBGYPSQHZ_A>';
            xml = xml + '    <fbillno>' + fbillno + '</fbillno>';
            xml = xml + '    <fname>' + fname + '</fname>';
            xml = xml + '    <fdate>' + fdate + '</fdate>';
            xml = xml + '   <fyear>' + fyear + '</fyear>';
            xml = xml + '   <fmonth>' + fmonth + '</fmonth>';
            xml = xml + '   </BPM_HSYDBGYPSQHZ_A>';

            for (var i = 0; i < mxlistArr.length; i++) {
                xml = xml + ' <BPM_HSYDBGYPSQHZ_B>';
                xml = xml + ' <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml = xml + ' <RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + ' <fentryno>' + (i + 1) + '</fentryno>';
                xml = xml + '<fwpno>' + mxlistArr[i].fwpno + '</fwpno>';
                xml = xml + ' <fwpname>' + mxlistArr[i].fwpname + '</fwpname>';
                xml = xml + ' <fggxh>' + mxlistArr[i].fggxh + '</fggxh>';
                xml = xml + ' <funit>' + mxlistArr[i].funit + '</funit>';
                xml = xml + ' <famount>' + mxlistArr[i].famount + '</famount>';
                xml = xml + ' <fdetail>' + mxlistArr[i].fdetail + '</fdetail>';
                xml = xml + '  </BPM_HSYDBGYPSQHZ_B>';
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
        var fwpno = $(this).find("#childTNode").data('fwpno');
        var fwpname = $(this).find("#childTNode").data('fwpname');
        var fggxh = $(this).find("#childTNode").data('fggxh');
        var funit = $(this).find("#childTNode").data('funit');
        var famount = $(this).find("#childTNode").data('famount');
        var fdetail = $(this).find("#childTNode").data('fdetail');

        var mx = mxItem(fwpno, fwpname, fggxh, funit, famount, fdetail);
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
            xml = xml + '   <BPM_HSYDBGYPSQHZ_A>';
            xml = xml + '    <fbillno>' + fbillno + '</fbillno>';
            xml = xml + '    <fname>' + fname + '</fname>';
            xml = xml + '    <fdate>' + fdate + '</fdate>';
            xml = xml + '   <fyear>' + fyear + '</fyear>';
            xml = xml + '   <fmonth>' + fmonth + '</fmonth>';
            xml = xml + '   </BPM_HSYDBGYPSQHZ_A>';

            for (var i = 0; i < mxlistArr.length; i++) {
                xml = xml + ' <BPM_HSYDBGYPSQHZ_B>';
                xml = xml + ' <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml = xml + ' <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
                xml = xml + ' <fentryno>' + (i + 1) + '</fentryno>';
                xml = xml + '<fwpno>' + mxlistArr[i].fwpno + '</fwpno>';
                xml = xml + ' <fwpname>' + mxlistArr[i].fwpname + '</fwpname>';
                xml = xml + ' <fggxh>' + mxlistArr[i].fggxh + '</fggxh>';
                xml = xml + ' <funit>' + mxlistArr[i].funit + '</funit>';
                xml = xml + ' <famount>' + mxlistArr[i].famount + '</famount>';
                xml = xml + ' <fdetail>' + mxlistArr[i].fdetail + '</fdetail>';
                xml = xml + '  </BPM_HSYDBGYPSQHZ_B>';
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
        var fwpno = $(this).find("#childTNode").data('fwpno');
        var fwpname = $(this).find("#childTNode").data('fwpname');
        var fggxh = $(this).find("#childTNode").data('fggxh');
        var funit = $(this).find("#childTNode").data('funit');
        var famount = $(this).find("#childTNode").data('famount');
        var fdetail = $(this).find("#childTNode").data('fdetail');

        var mx = mxItem(fwpno, fwpname, fggxh, funit, famount, fdetail);
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

            xml = xml + '   <BPM_HSYDBGYPSQHZ_A>';
            xml = xml + '    <fbillno>' + fbillno + '</fbillno>';
            xml = xml + '    <fname>' + fname + '</fname>';
            xml = xml + '    <fdate>' + fdate + '</fdate>';
            xml = xml + '   <fyear>' + fyear + '</fyear>';
            xml = xml + '   <fmonth>' + fmonth + '</fmonth>';
            xml = xml + '   </BPM_HSYDBGYPSQHZ_A>';

            for (var i = 0; i < mxlistArr.length; i++) {
                xml = xml + ' <BPM_HSYDBGYPSQHZ_B>';
                xml = xml + ' <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml = xml + ' <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
                xml = xml + ' <fentryno>' + (i + 1) + '</fentryno>';
                xml = xml + '<fwpno>' + mxlistArr[i].fwpno + '</fwpno>';
                xml = xml + ' <fwpname>' + mxlistArr[i].fwpname + '</fwpname>';
                xml = xml + ' <fggxh>' + mxlistArr[i].fggxh + '</fggxh>';
                xml = xml + ' <funit>' + mxlistArr[i].funit + '</funit>';
                xml = xml + ' <famount>' + mxlistArr[i].famount + '</famount>';
                xml = xml + ' <fdetail>' + mxlistArr[i].fdetail + '</fdetail>';
                xml = xml + '  </BPM_HSYDBGYPSQHZ_B>';
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

        xml = xml + '   <BPM_HSYDBGYPSQHZ_A>';
        xml = xml + '    <fbillno>' + fbillno + '</fbillno>';
        xml = xml + '    <fname>' + fname + '</fname>';
        xml = xml + '    <fdate>' + fdate + '</fdate>';
        xml = xml + '   <fyear>' + fyear + '</fyear>';
        xml = xml + '   <fmonth>' + fmonth + '</fmonth>';
        xml = xml + '   </BPM_HSYDBGYPSQHZ_A>';

        for (var i = 0; i < mxlistArr.length; i++) {
            xml = xml + ' <BPM_HSYDBGYPSQHZ_B>';
            xml = xml + ' <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
            xml = xml + ' <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
            xml = xml + ' <fentryno>' + (i + 1) + '</fentryno>';
            xml = xml + '<fwpno>' + mxlistArr[i].fwpno + '</fwpno>';
            xml = xml + ' <fwpname>' + mxlistArr[i].fwpname + '</fwpname>';
            xml = xml + ' <fggxh>' + mxlistArr[i].fggxh + '</fggxh>';
            xml = xml + ' <funit>' + mxlistArr[i].funit + '</funit>';
            xml = xml + ' <famount>' + mxlistArr[i].famount + '</famount>';
            xml = xml + ' <fdetail>' + mxlistArr[i].fdetail + '</fdetail>';
            xml = xml + '  </BPM_HSYDBGYPSQHZ_B>';
        }
        xml = xml + '</FormData>';
        xml = xml + '</XForm>';
        PostXml(xml);
    }
}