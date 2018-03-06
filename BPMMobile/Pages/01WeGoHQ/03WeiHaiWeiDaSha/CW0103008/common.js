function prepMsg() {
    $("#fdate").val(getNowFormatDate(2));
    tapEvent();
    var xml = '<?xml version= "1.0" ?>';
    xml = xml + '   <Requests>';
    xml = xml + '   <Params>';
    xml = xml + '       <Method>GetFormPostData</Method>';
    xml = xml + '       <ProcessName>威海卫大厦青缇湾员工餐费申请</ProcessName>';
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

    }).fail(function (e) {

    });
}




function tapEvent() {
    var currentYear = new Date().getFullYear();
    var fyeardata = [
        {
            value: '',
            text: currentYear-1
        },
        {
            value: '',
            text: currentYear
        },
        {
            value: '',
            text: currentYear+1
        }
    ];
    showPicker('fyear', fyeardata);


    var fmonthdata = [];
    for (var i = 0; i < 12; i++) {
        var obj = {
            value: '',
            text:(i+1)
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
        li += '<label for="fname">姓名<i style="color:red;">*</i></label>';
        li += '<input type="text" id="fname" name="fname" placeholder="请填写姓名"/>';
        li += '</div>';
        li += '<div class="mui-input-row itemtitle2">';
        li += '<label>早餐</label>';
        li += '</div>';
        li += '<div class="mui-input-row">';
        li += '<label for="fcs_morn">次数<i style="color:red;">*</i></label>';
        li += '<input type="number" id="fcs_morn" name="fcs_morn" placeholder="请填写次数" class="toCalc"/>';
        li += '</div>';
        li += '<div class="mui-input-row">';
        li += '<label for="fje_morn">金额<i style="color:red;">*</i></label>';
        li += '<input type="number" id="fje_morn" name="fje_morn" placeholder="请填写金额" class="toCalc"/>';
        li += '</div>';
        li += '<div class="mui-input-row itemtitle2">';
        li += '<label>午餐</label>';
        li += '</div>';
        li += '<div class="mui-input-row">';
        li += '<label for="fcs_noon">次数<i style="color:red;">*</i></label>';
        li += '<input type="number" id="fcs_noon" name="fcs_noon" placeholder="请填写次数" class="toCalc"/>';
        li += '</div>';
        li += '<div class="mui-input-row">';
        li += '<label for="fje_noon">金额<i style="color:red;">*</i></label>';
        li += '<input type="number" id="fje_noon" name="fje_noon" placeholder="请填写金额" class="toCalc"/>';
        li += '</div>';
        li += '<div class="mui-input-row itemtitle2">';
        li += '<label>晚餐</label>';
        li += '</div>';
        li += '<div class="mui-input-row">';
        li += '<label for="fcs_night">次数<i style="color:red;">*</i></label>';
        li += '<input type="number" id="fcs_night" name="fcs_night" placeholder="请填写次数" class="toCalc"/>';
        li += '</div>';
        li += '<div class="mui-input-row">';
        li += '<label for="fje_night">金额<i style="color:red;">*</i></label>';
        li += '<input type="number" id="fje_night" name="fje_night" placeholder="请填写金额" class="toCalc"/>';
        li += '</div>';
        li += '<div class="mui-input-row">';
        li += '<label for="fje_once_total">总计金额</label>';
        li += '<input type="number" id="fje_once_total" name="fje_once_total" readonly value="0"/>';
        li += '</div>';
        li += '</div>';
        $("#mxlist").append(li);
        $("#mxlist").find('.toCalc').each(function () {
            $(this).on('input', function () {
                calcPrice(this);
            })
        });
        
    });


}

function calcPrice(context) {
    var fcs_morn = parseInt($(context).parent().parent().find("#fcs_morn").val());
    var fje_morn = parseFloat($(context).parent().parent().find("#fje_morn").val());
    var fcs_noon = parseInt($(context).parent().parent().find("#fcs_noon").val());
    var fje_noon = parseFloat($(context).parent().parent().find("#fje_noon").val());
    var fcs_night = parseInt($(context).parent().parent().find("#fcs_night").val());
    var fje_night = parseFloat($(context).parent().parent().find("#fje_night").val());
    var fje_once_total = 0;
    fcs_morn = isNaN(fcs_morn) ? 0 : fcs_morn;
    fje_morn = isNaN(fje_morn) ? 0 : fje_morn;
    fcs_noon = isNaN(fcs_noon) ? 0 : fcs_noon;
    fje_noon = isNaN(fje_noon) ? 0 : fje_noon;
    fcs_night = isNaN(fcs_night) ? 0 : fcs_night;
    fje_night = isNaN(fje_night) ? 0 : fje_night;

    fje_once_total = fje_morn + fje_noon + fje_night;
    $(context).parent().parent().find("#fje_once_total").val(fje_once_total);
    calcTotal();



}

function calcTotal() {
    var fcs_morn_total = 0;
    var fje_morn_total = 0;
    var fcs_noon_total = 0;
    var fje_noon_total = 0;
    var fcs_night_total = 0;
    var fje_night_total = 0;
    var fje_total = 0;

    $("#mxlist").find("#mx").each(function () {
        var fcs_morn = parseInt($(this).find("#fcs_morn").val());
        var fje_morn = parseFloat($(this).find("#fje_morn").val());
        var fcs_noon = parseInt($(this).find("#fcs_noon").val());
        var fje_noon = parseFloat($(this).find("#fje_noon").val());
        var fcs_night = parseInt($(this).find("#fcs_night").val());
        var fje_night = parseFloat($(this).find("#fje_night").val());
        var fje_once_total = parseFloat($(this).find("#fje_once_total").val());
        fcs_morn = isNaN(fcs_morn) ? 0 : fcs_morn;
        fje_morn = isNaN(fje_morn) ? 0 : fje_morn;
        fcs_noon = isNaN(fcs_noon) ? 0 : fcs_noon;
        fje_noon = isNaN(fje_noon) ? 0 : fje_noon;
        fcs_night = isNaN(fcs_night) ? 0 : fcs_night;
        fje_night = isNaN(fje_night) ? 0 : fje_night;
        fje_once_total = isNaN(fje_once_total) ? 0 : fje_once_total;


        fcs_morn_total += fcs_morn;
        fje_morn_total += fje_morn;
        fcs_noon_total += fcs_noon;
        fje_noon_total += fje_noon;
        fcs_night_total += fcs_night;
        fje_night_total += fje_night;
        fje_total += fje_once_total;




    });

    $("#fcs_morn_total").val(fcs_morn_total);
    $("#fje_morn_total").val(fje_morn_total);
    $("#fcs_noon_total").val(fcs_noon_total);
    $("#fje_noon_total").val(fje_noon_total);
    $("#fcs_night_total").val(fcs_night_total);
    $("#fje_night_total").val(fje_night_total);
    $("#fje_total").val(fje_total);
}


function initData(data, flag) {
    var item = data.FormDataSet.威海卫大厦青缇湾员工餐费用汇总_A[0];
    if (flag) {

        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.fbillno);

    }

    $("#fname").val(item.提报人);
    $("#fdept").val(item.提报部门);
    $("#fdate").val(FormatterTimeYMS(item.提报日期));
    $("#fyear").val(item.提报年度);
    $("#fmonth").val(item.提报月度);
    $("#fcs_morn_total").val(item.早餐次数);
    $("#fje_morn_total").val(item.早餐金额);
    $("#fcs_noon_total").val(item.午餐次数);
    $("#fje_noon_total").val(item.午餐金额);
    $("#fcs_night_total").val(item.晚餐次数);
    $("#fje_night_total").val(item.晚餐金额);
    $("#fje_total").val(item.共计金额);

    var item_c = data.FormDataSet.威海卫大厦青缇湾员工餐费用汇总_B;
    for (var i = 0; i < item_c.length; i++) {
        itemidArr.push(item_c[i].itemid);
        var li = '<div id="mx" class="mui-card">';
        li += '<div class="mui-input-row itemtitle">';
        li += '<label>明细列表项</label>';
        li += '<span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>';
        li += '</div>';

        li += '<div class="mui-input-row">';
        li += '<label for="fname">姓名<i style="color:red;">*</i></label>';
        li += '<input type="text" id="fname" name="fname" readonly value="' + item_c[i].姓名 + '"/>';
        li += '</div>';
        li += '<div class="mui-input-row itemtitle2">';
        li += '<label>早餐</label>';
        li += '</div>';
        li += '<div class="mui-input-row">';
        li += '<label for="fcs_morn">次数<i style="color:red;">*</i></label>';
        li += '<input type="number" id="fcs_morn" name="fcs_morn" readonly class="toCalc" value="' + item_c[i].早餐次数 + '"/>';
        li += '</div>';
        li += '<div class="mui-input-row">';
        li += '<label for="fje_morn">金额<i style="color:red;">*</i></label>';
        li += '<input type="number" id="fje_morn" name="fje_morn" readonly class="toCalc" value="' + item_c[i].早餐金额 + '"/>';
        li += '</div>';
        li += '<div class="mui-input-row itemtitle2">';
        li += '<label>午餐</label>';
        li += '</div>';
        li += '<div class="mui-input-row">';
        li += '<label for="fcs_noon">次数<i style="color:red;">*</i></label>';
        li += '<input type="number" id="fcs_noon" name="fcs_noon" readonly class="toCalc" value="' + item_c[i].午餐次数 + '"/>';
        li += '</div>';
        li += '<div class="mui-input-row">';
        li += '<label for="fje_noon">金额<i style="color:red;">*</i></label>';
        li += '<input type="number" id="fje_noon" name="fje_noon" readonly class="toCalc" value="' + item_c[i].午餐金额 + '"/>';
        li += '</div>';
        li += '<div class="mui-input-row itemtitle2">';
        li += '<label>晚餐</label>';
        li += '</div>';
        li += '<div class="mui-input-row">';
        li += '<label for="fcs_night">次数<i style="color:red;">*</i></label>';
        li += '<input type="number" id="fcs_night" name="fcs_night" readonly class="toCalc" value="' + item_c[i].晚餐次数 + '"/>';
        li += '</div>';
        li += '<div class="mui-input-row">';
        li += '<label for="fje_night">金额<i style="color:red;">*</i></label>';
        li += '<input type="number" id="fje_night" name="fje_night" readonly class="toCalc" value="' + item_c[i].晚餐金额 + '"/>';
        li += '</div>';
        li += '<div class="mui-input-row">';
        li += '<label for="fje_once_total">总计金额</label>';
        li += '<input type="number" id="fje_once_total" name="fje_once_total" readonly  value="' + item_c[i].共计金额 + '"/>';
        li += '</div>';
        li += '</div>';
        $("#mxlist").append(li);
    }

    
}
function nodeControllerExp(NodeName) {
    if (String(NodeName).match('开始') != null) {
        $("#mxlist").find('span').each(function() {
            $(this).show();
        });
        tapEvent();
        $("#tjmx").show();
        $("#mxlist").find('.toCalc').each(function() {
            $(this).on('input', function() {
                calcPrice(this);
            })
        });
        $("#mxlist").find("#mx").each(function() {
            //对除了共计金额外所有input移除readonly
            $(this).find("input").removeAttr('readonly');                  
            $(this).find("#fje_once_total").attr('readonly', 'readonly');
        });
        $("#fdept,#fdate").removeAttr('readonly');

    }


}

function mxItem(fname, fcs_morn, fje_morn, fcs_noon, fje_noon, fcs_night, fje_night, fje_once_total) {
    var mx = {
        fname: fname,
        fcs_morn: fcs_morn,
        fje_morn: fje_morn,
        fcs_noon: fcs_noon,
        fje_noon: fje_noon,
        fcs_night: fcs_night,
        fje_night: fje_night,
        fje_once_total: fje_once_total,
        _check: function() {
            if (!fname) {
                mui.toast('请填写姓名');
                return null;
            }
            if (!fcs_morn) {
                mui.toast('请填写早餐次数');
                return null;
            }
            if (!fje_morn) {
                mui.toast('请填写早餐金额');
                return null;
            }
            if (!fcs_noon) {
                mui.toast('请填写午餐次数');
                return null;
            }
            if (!fje_noon) {
                mui.toast('请填写午餐金额');
                return null;
            }
            if (!fcs_night) {
                mui.toast('请填写晚餐次数');
                return null;
            }
            if (!fje_night) {
                mui.toast('请填写晚餐金额');
                return null;
            }
            return mx;
        }

    }
    return mx._check();
}


function Save() {
    var fname = $("#fname").val();
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();
    var fyear = $("#fyear").val();
    var fmonth = $("#fmonth").val();
    var fcs_morn_total = $("#fcs_morn_total").val();
    var fje_morn_total = $("#fje_morn_total").val();
    var fcs_noon_total = $("#fcs_noon_total").val();
    var fje_noon_total = $("#fje_noon_total").val();
    var fcs_night_total = $("#fcs_night_total").val();
    var fje_night_total = $("#fje_night_total").val();
    var fje_total = $("#fje_total").val();

    var mxflag = false;
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function() {
        var fname = $(this).find("#fname").val();
        var fcs_morn = $(this).find("#fcs_morn").val();
        var fje_morn = $(this).find("#fje_morn").val();
        var fcs_noon = $(this).find("#fcs_noon").val();
        var fje_noon = $(this).find("#fje_noon").val();
        var fcs_night = $(this).find("#fcs_night").val();
        var fje_night = $(this).find("#fje_night").val();
        var fje_once_total = $(this).find("#fje_once_total").val();
        if (mxItem(fname, fcs_morn, fje_morn, fcs_noon, fje_noon, fcs_night, fje_night, fje_once_total) == null) {
            mxflag = true;
            return;
        }
        var mx = mxItem(fname, fcs_morn, fje_morn, fcs_noon, fje_noon, fcs_night, fje_night, fje_once_total);
        mxlistArr.push(mx);
    });
    if (mxflag) {
        return;
    }
    var btnArry = ["取消", "确定"];
    mui.confirm('即将提交，是否确定？', '提交确认提醒', btnArry, function(e) {
        if (e.index == 1) {
            var xml = '<?xml version= "1.0" ?>';
            xml = xml + '   <XForm>';
            xml = xml + '         <Header>';
            xml = xml + '        <Method>Post</Method>';
            xml = xml + '       <ProcessName>威海卫大厦青缇湾员工餐费申请</ProcessName>';
            xml = xml + '         <ProcessVersion>' + version + '</ProcessVersion>';
            xml = xml + '            <DraftGuid></DraftGuid>';
            xml = xml + '             <OwnerMemberFullName>' + BPMOU + '</OwnerMemberFullName>';
            xml = xml + '            <Action>提交</Action>';
            xml = xml + '          <Comment></Comment>';
            xml = xml + '             <InviteIndicateUsers></InviteIndicateUsers>';
            xml = xml + '       </Header>';
            xml = xml + '       <FormData>';
            xml += ' <威海卫大厦青缇湾员工餐费用汇总_A>';
            xml += '  <fbillno>自动带出</fbillno>';
            xml += ' <提报人>' + fname + '</提报人>';
            xml += ' <提报部门>' + fdept + '</提报部门>';
            xml += ' <提报日期>' + fdate + '</提报日期>';
            xml += ' <提报年度>' + fyear + '</提报年度>';
            xml += ' <提报月度>' + fmonth + '</提报月度>';
            xml += ' <早餐次数>' + fcs_morn_total + '</早餐次数>';
            xml += ' <早餐金额>' + fje_morn_total + '</早餐金额>';
            xml += ' <午餐次数>' + fcs_noon_total + '</午餐次数>';
            xml += ' <午餐金额>' + fje_noon_total + '</午餐金额>';
            xml += '  <晚餐次数>' + fcs_night_total + '</晚餐次数>';
            xml += ' <晚餐金额>' + fje_night_total + '</晚餐金额>';
            xml += '  <共计金额>' + fje_total + '</共计金额>';
            xml += ' </威海卫大厦青缇湾员工餐费用汇总_A>';
            for (var i = 0; i < mxlistArr.length; i++){
                xml += ' <威海卫大厦青缇湾员工餐费用汇总_B>';
                xml += '  <RelationRowGuid>'+(i+1)+'</RelationRowGuid>';
                xml += ' <RowPrimaryKeys></RowPrimaryKeys>';
                xml += ' <fentyrno>' + (i + 1) + '</fentyrno>';
                xml += ' <姓名>' + mxlistArr[i].fname + '</姓名>';
                xml += ' <早餐次数>' + mxlistArr[i].fcs_morn + '</早餐次数>';
                xml += ' <早餐金额>' + mxlistArr[i].fje_morn + '</早餐金额>';
                xml += ' <午餐次数>' + mxlistArr[i].fcs_noon + '</午餐次数>';
                xml += ' <午餐金额>' + mxlistArr[i].fje_noon + '</午餐金额>';
                xml += '  <晚餐次数>' + mxlistArr[i].fcs_night + '</晚餐次数>';
                xml += ' <晚餐金额>' + mxlistArr[i].fje_night + '</晚餐金额>';
                xml += '  <共计金额>' + mxlistArr[i].fje_once_total + '</共计金额>';
                xml += '  </威海卫大厦青缇湾员工餐费用汇总_B>';

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
    var fyear = $("#fyear").val();
    var fmonth = $("#fmonth").val();
    var fcs_morn_total = $("#fcs_morn_total").val();
    var fje_morn_total = $("#fje_morn_total").val();
    var fcs_noon_total = $("#fcs_noon_total").val();
    var fje_noon_total = $("#fje_noon_total").val();
    var fcs_night_total = $("#fcs_night_total").val();
    var fje_night_total = $("#fje_night_total").val();
    var fje_total = $("#fje_total").val();

    var mxflag = false;
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function() {
        var fname = $(this).find("#fname").val();
        var fcs_morn = $(this).find("#fcs_morn").val();
        var fje_morn = $(this).find("#fje_morn").val();
        var fcs_noon = $(this).find("#fcs_noon").val();
        var fje_noon = $(this).find("#fje_noon").val();
        var fcs_night = $(this).find("#fcs_night").val();
        var fje_night = $(this).find("#fje_night").val();
        var fje_once_total = $(this).find("#fje_once_total").val();
        if (mxItem(fname, fcs_morn, fje_morn, fcs_noon, fje_noon, fcs_night, fje_night, fje_once_total) == null) {
            mxflag = true;
            return;
        }
        var mx = mxItem(fname, fcs_morn, fje_morn, fcs_noon, fje_noon, fcs_night, fje_night, fje_once_total);
        mxlistArr.push(mx);
    });
    if (mxflag) {
        return;
    }
    var btnArry = ["取消", "确定"];
    mui.confirm('即将提交，是否确定？', '提交确认提醒', btnArry, function(e) {
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

            xml += ' <威海卫大厦青缇湾员工餐费用汇总_A>';
            xml += '  <fbillno>' + fbillno + '</fbillno>';
            xml += ' <提报人>' + fname + '</提报人>';
            xml += ' <提报部门>' + fdept + '</提报部门>';
            xml += ' <提报日期>' + fdate + '</提报日期>';
            xml += ' <提报年度>' + fyear + '</提报年度>';
            xml += ' <提报月度>' + fmonth + '</提报月度>';
            xml += ' <早餐次数>' + fcs_morn_total + '</早餐次数>';
            xml += ' <早餐金额>' + fje_morn_total + '</早餐金额>';
            xml += ' <午餐次数>' + fcs_noon_total + '</午餐次数>';
            xml += ' <午餐金额>' + fje_noon_total + '</午餐金额>';
            xml += '  <晚餐次数>' + fcs_night_total + '</晚餐次数>';
            xml += ' <晚餐金额>' + fje_night_total + '</晚餐金额>';
            xml += '  <共计金额>' + fje_total + '</共计金额>';
            xml += ' </威海卫大厦青缇湾员工餐费用汇总_A>';
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += ' <威海卫大厦青缇湾员工餐费用汇总_B>';
                xml += '  <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml += ' <RowPrimaryKeys></RowPrimaryKeys>';
                xml += ' <fentyrno>' + (i + 1) + '</fentyrno>';
                xml += ' <姓名>' + mxlistArr[i].fname + '</姓名>';
                xml += ' <早餐次数>' + mxlistArr[i].fcs_morn + '</早餐次数>';
                xml += ' <早餐金额>' + mxlistArr[i].fje_morn + '</早餐金额>';
                xml += ' <午餐次数>' + mxlistArr[i].fcs_noon + '</午餐次数>';
                xml += ' <午餐金额>' + mxlistArr[i].fje_noon + '</午餐金额>';
                xml += '  <晚餐次数>' + mxlistArr[i].fcs_night + '</晚餐次数>';
                xml += ' <晚餐金额>' + mxlistArr[i].fje_night + '</晚餐金额>';
                xml += '  <共计金额>' + mxlistArr[i].fje_once_total + '</共计金额>';
                xml += '  </威海卫大厦青缇湾员工餐费用汇总_B>';

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
    var fyear = $("#fyear").val();
    var fmonth = $("#fmonth").val();
    var fcs_morn_total = $("#fcs_morn_total").val();
    var fje_morn_total = $("#fje_morn_total").val();
    var fcs_noon_total = $("#fcs_noon_total").val();
    var fje_noon_total = $("#fje_noon_total").val();
    var fcs_night_total = $("#fcs_night_total").val();
    var fje_night_total = $("#fje_night_total").val();
    var fje_total = $("#fje_total").val();

    var mxflag = false;
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function() {
        var fname = $(this).find("#fname").val();
        var fcs_morn = $(this).find("#fcs_morn").val();
        var fje_morn = $(this).find("#fje_morn").val();
        var fcs_noon = $(this).find("#fcs_noon").val();
        var fje_noon = $(this).find("#fje_noon").val();
        var fcs_night = $(this).find("#fcs_night").val();
        var fje_night = $(this).find("#fje_night").val();
        var fje_once_total = $(this).find("#fje_once_total").val();
       
        var mx = mxItem(fname, fcs_morn, fje_morn, fcs_noon, fje_noon, fcs_night, fje_night, fje_once_total);
        mxlistArr.push(mx);
    });

    var comment = '';
    var btnArray = ['取消', '确定'];
    mui.prompt('请选填知会意见', '可以不填', '知会意见', btnArray, function(e) {
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

            xml += ' <威海卫大厦青缇湾员工餐费用汇总_A>';
            xml += '  <fbillno>' + fbillno + '</fbillno>';
            xml += ' <提报人>' + fname + '</提报人>';
            xml += ' <提报部门>' + fdept + '</提报部门>';
            xml += ' <提报日期>' + fdate + '</提报日期>';
            xml += ' <提报年度>' + fyear + '</提报年度>';
            xml += ' <提报月度>' + fmonth + '</提报月度>';
            xml += ' <早餐次数>' + fcs_morn_total + '</早餐次数>';
            xml += ' <早餐金额>' + fje_morn_total + '</早餐金额>';
            xml += ' <午餐次数>' + fcs_noon_total + '</午餐次数>';
            xml += ' <午餐金额>' + fje_noon_total + '</午餐金额>';
            xml += '  <晚餐次数>' + fcs_night_total + '</晚餐次数>';
            xml += ' <晚餐金额>' + fje_night_total + '</晚餐金额>';
            xml += '  <共计金额>' + fje_total + '</共计金额>';
            xml += ' </威海卫大厦青缇湾员工餐费用汇总_A>';
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += ' <威海卫大厦青缇湾员工餐费用汇总_B>';
                xml += '  <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml += ' <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
                xml += ' <fentyrno>' + (i + 1) + '</fentyrno>';
                xml += ' <姓名>' + mxlistArr[i].fname + '</姓名>';
                xml += ' <早餐次数>' + mxlistArr[i].fcs_morn + '</早餐次数>';
                xml += ' <早餐金额>' + mxlistArr[i].fje_morn + '</早餐金额>';
                xml += ' <午餐次数>' + mxlistArr[i].fcs_noon + '</午餐次数>';
                xml += ' <午餐金额>' + mxlistArr[i].fje_noon + '</午餐金额>';
                xml += '  <晚餐次数>' + mxlistArr[i].fcs_night + '</晚餐次数>';
                xml += ' <晚餐金额>' + mxlistArr[i].fje_night + '</晚餐金额>';
                xml += '  <共计金额>' + mxlistArr[i].fje_once_total + '</共计金额>';
                xml += '  </威海卫大厦青缇湾员工餐费用汇总_B>';

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
    var fyear = $("#fyear").val();
    var fmonth = $("#fmonth").val();
    var fcs_morn_total = $("#fcs_morn_total").val();
    var fje_morn_total = $("#fje_morn_total").val();
    var fcs_noon_total = $("#fcs_noon_total").val();
    var fje_noon_total = $("#fje_noon_total").val();
    var fcs_night_total = $("#fcs_night_total").val();
    var fje_night_total = $("#fje_night_total").val();
    var fje_total = $("#fje_total").val();

    var mxflag = false;
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function() {
        var fname = $(this).find("#fname").val();
        var fcs_morn = $(this).find("#fcs_morn").val();
        var fje_morn = $(this).find("#fje_morn").val();
        var fcs_noon = $(this).find("#fcs_noon").val();
        var fje_noon = $(this).find("#fje_noon").val();
        var fcs_night = $(this).find("#fcs_night").val();
        var fje_night = $(this).find("#fje_night").val();
        var fje_once_total = $(this).find("#fje_once_total").val();

        var mx = mxItem(fname, fcs_morn, fje_morn, fcs_noon, fje_noon, fcs_night, fje_night, fje_once_total);
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
            beforeSend: function(XHR) {
                XHR.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem('ticket'));

            }
        }).done(function(data, status) {
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
        }).fail(function() {

        });
    } else {


    }
    if (consignFlag) {
        consignAjax.then(function() {
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

            xml += ' <威海卫大厦青缇湾员工餐费用汇总_A>';
            xml += '  <fbillno>' + fbillno + '</fbillno>';
            xml += ' <提报人>' + fname + '</提报人>';
            xml += ' <提报部门>' + fdept + '</提报部门>';
            xml += ' <提报日期>' + fdate + '</提报日期>';
            xml += ' <提报年度>' + fyear + '</提报年度>';
            xml += ' <提报月度>' + fmonth + '</提报月度>';
            xml += ' <早餐次数>' + fcs_morn_total + '</早餐次数>';
            xml += ' <早餐金额>' + fje_morn_total + '</早餐金额>';
            xml += ' <午餐次数>' + fcs_noon_total + '</午餐次数>';
            xml += ' <午餐金额>' + fje_noon_total + '</午餐金额>';
            xml += '  <晚餐次数>' + fcs_night_total + '</晚餐次数>';
            xml += ' <晚餐金额>' + fje_night_total + '</晚餐金额>';
            xml += '  <共计金额>' + fje_total + '</共计金额>';
            xml += ' </威海卫大厦青缇湾员工餐费用汇总_A>';
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += ' <威海卫大厦青缇湾员工餐费用汇总_B>';
                xml += '  <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml += ' <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
                xml += ' <fentyrno>' + (i + 1) + '</fentyrno>';
                xml += ' <姓名>' + mxlistArr[i].fname + '</姓名>';
                xml += ' <早餐次数>' + mxlistArr[i].fcs_morn + '</早餐次数>';
                xml += ' <早餐金额>' + mxlistArr[i].fje_morn + '</早餐金额>';
                xml += ' <午餐次数>' + mxlistArr[i].fcs_noon + '</午餐次数>';
                xml += ' <午餐金额>' + mxlistArr[i].fje_noon + '</午餐金额>';
                xml += '  <晚餐次数>' + mxlistArr[i].fcs_night + '</晚餐次数>';
                xml += ' <晚餐金额>' + mxlistArr[i].fje_night + '</晚餐金额>';
                xml += '  <共计金额>' + mxlistArr[i].fje_once_total + '</共计金额>';
                xml += '  </威海卫大厦青缇湾员工餐费用汇总_B>';

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

        xml = xml + ' <UrlParams></UrlParams>';
        xml = xml + '  <ConsignEnabled>false</ConsignEnabled>';
        xml = xml + '  <ConsignUsers>[]</ConsignUsers>';
        xml = xml + '  <ConsignRoutingType>Parallel</ConsignRoutingType>';
        xml = xml + '  <ConsignReturnType>Return</ConsignReturnType>';

        xml = xml + '   <InviteIndicateUsers>[]</InviteIndicateUsers>';
        xml = xml + '   <Context>{&quot;Routing&quot;:{}}</Context>';
        xml = xml + '</Header>';
        xml = xml + '<FormData>';

        xml += ' <威海卫大厦青缇湾员工餐费用汇总_A>';
        xml += '  <fbillno>' + fbillno + '</fbillno>';
        xml += ' <提报人>' + fname + '</提报人>';
        xml += ' <提报部门>' + fdept + '</提报部门>';
        xml += ' <提报日期>' + fdate + '</提报日期>';
        xml += ' <提报年度>' + fyear + '</提报年度>';
        xml += ' <提报月度>' + fmonth + '</提报月度>';
        xml += ' <早餐次数>' + fcs_morn_total + '</早餐次数>';
        xml += ' <早餐金额>' + fje_morn_total + '</早餐金额>';
        xml += ' <午餐次数>' + fcs_noon_total + '</午餐次数>';
        xml += ' <午餐金额>' + fje_noon_total + '</午餐金额>';
        xml += '  <晚餐次数>' + fcs_night_total + '</晚餐次数>';
        xml += ' <晚餐金额>' + fje_night_total + '</晚餐金额>';
        xml += '  <共计金额>' + fje_total + '</共计金额>';
        xml += ' </威海卫大厦青缇湾员工餐费用汇总_A>';
        for (var i = 0; i < mxlistArr.length; i++) {
            xml += ' <威海卫大厦青缇湾员工餐费用汇总_B>';
            xml += '  <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
            xml += ' <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
            xml += ' <fentyrno>' + (i + 1) + '</fentyrno>';
            xml += ' <姓名>' + mxlistArr[i].fname + '</姓名>';
            xml += ' <早餐次数>' + mxlistArr[i].fcs_morn + '</早餐次数>';
            xml += ' <早餐金额>' + mxlistArr[i].fje_morn + '</早餐金额>';
            xml += ' <午餐次数>' + mxlistArr[i].fcs_noon + '</午餐次数>';
            xml += ' <午餐金额>' + mxlistArr[i].fje_noon + '</午餐金额>';
            xml += '  <晚餐次数>' + mxlistArr[i].fcs_night + '</晚餐次数>';
            xml += ' <晚餐金额>' + mxlistArr[i].fje_night + '</晚餐金额>';
            xml += '  <共计金额>' + mxlistArr[i].fje_once_total + '</共计金额>';
            xml += '  </威海卫大厦青缇湾员工餐费用汇总_B>';

        }

        xml = xml + '</FormData>';
        xml = xml + '</XForm>';
        PostXml(xml);
    }

}