function prepMsg() {
    $("#fdate").val(getNowFormatDate(2));
    tapEvent();
    var xml = '<?xml version= "1.0" ?>';
    xml = xml + '<Requests>';
    xml = xml + '    <Params>';
    xml = xml + '      <Method>GetFormPostData</Method>';
    xml = xml + '       <ProcessName>洁丽康公司部门月度办公用品申请</ProcessName>';
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
    var xml = '<?xml version= "1.0" ?>';
    xml = xml + '      <Requests>';
    xml = xml + '     <Params>';
    xml = xml + '         <DataSource>BPM_WEGO</DataSource>';
    xml = xml + '         <ID>erpcloud_洁丽康公司部门月度办公用品申请</ID>';
    xml = xml + '         <Type>1</Type>';
    xml = xml + '        <Method>GetUserDataProcedure</Method>';
    xml = xml + '        <ProcedureName>erpcloud_洁丽康公司部门月度办公用品申请</ProcedureName>';
    xml = xml + '        <Filter>';
    xml = xml + '        </Filter>';
    xml = xml + '      </Params>';
    xml = xml + '   </Requests>';
    var initMainMsg = $.ajax({
        type: "POST",
        url: "/api/bpm/DataProvider",
        data: { '': xml },

        beforeSend: function (XHR) {
            XHR.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem('ticket'));
        }
    }).done(function (data) {

        var provideData = JSON.parse(unescape(data.replace(/\\(u[0-9a-fA-F]{4})/gm, '%$1')));
        console.log(provideData);
        var dataArr = provideData.Tables[0].Rows;
        for (var i = 0; i < dataArr.length;i++){
            var li = '<li data-value="" data-tags="" class="mui-table-view-cell mui-indexed-list-item mui-radio mui-left">';
            li = li + '<input type="radio" name="radio"';
            li = li + 'data-fwpno="' + dataArr[i].fwpno + '"';
            li = li + 'data-fwpname="' + dataArr[i].fwpname + '"';
            li = li + 'data-fggxh="' + dataArr[i].fggxh + '"';
            li = li + ' />编码||' + dataArr[i].fwpno + '&nbsp名称||' + dataArr[i].fwpname + '&nbsp规格||' + dataArr[i].fggxh;
            li = li + '</li>';
            $("#cardlist").append(li);
        }
        var header = document.querySelector('header.mui-bar');
        var list = document.getElementById('list');
        var done = document.getElementById('done');
        //calc hieght
        list.style.height = (document.body.offsetHeight - header.offsetHeight) + 'px';
        //create
        window.indexedList = new mui.IndexedList(list);
        //done event
        done.addEventListener('tap', function () {
            var checkboxArray = [].slice.call(list.querySelectorAll('input[type="radio"]'));
            var checkedValues = [];
            var checkedElements = [];
            checkboxArray.forEach(function (box) {
                if (box.checked) {
                    checkedValues.push(box.parentNode.innerText);
                    var checkelement = ({

                        fwpno: $(box).data('fwpno'),
                        fwpname: $(box).data('fwpname'),
                        fggxh: $(box).data('fggxh')
                    });
                    checkedElements.push(checkelement);
                }
            });
            if (checkedValues.length > 0) {
                for (var i = 0; i < checkedElements.length; i++) {
                    var li = '<div id="mx" class="mui-card">';
                    li = li + '   <div class="mui-input-row itemtitle">';
                    li = li + '      <label>明细列表项</label>';
                    li = li + '      <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>';
                    li = li + '   </div>';
                    li = li + '   <div class="mui-input-row">';
                    li = li + '      <label for="fwpno">物品编码</label>';
                    li = li + '      <input type="text" id="fwpno" name="fwpno" readonly="readonly" value="' + checkedElements[i].fwpno + '"/>';   
                    li = li + '   </div>';
                    li = li + '   <div class="mui-input-row">';
                    li = li + '      <label for="fwpname">物品名称<i style="color:red;">*</i></label>';
                    li = li + '      <input type="text" id="fwpname" name="fwpname" readonly="readonly" value="' + checkedElements[i].fwpname + '"/>';
                    li = li + '   </div>';
                    li = li + '   <div class="mui-input-row">';
                    li = li + '      <label for="fggxh">规格型号</label>';
                    li = li + '      <input type="text" id="fggxh" name="fggxh" readonly="readonly" value="' + checkedElements[i].fggxh + '"/>';
                    li = li + '   </div>';
                    li = li + '   <div class="mui-input-row">';
                    li = li + '      <label for="funit">单位</label>';
                    li = li + '      <input type="text" id="funit" name="funit" placeholder="请填写单位"/>';
                    li = li + '   </div>';
                    li = li + '   <div class="mui-input-row">';
                    li = li + '      <label for="famount">数量</label>';
                    li = li + '      <input type="text" id="famount" name="famount" placeholder="请填写数量"/>';
                    li = li + '   </div>';
                    li = li + '</div>';
                    $("#mxlist").append(li);

                }

                hiddenCard();
                document.getElementById('tjmx').scrollIntoView();
            }else {

            }
        }, false);
        mui('.mui-indexed-list-inner').on('change', 'input', function () {
            var count = list.querySelectorAll('input[type="radio"]:checked').length;
            var value = count ? "完成(" + count + ")" : "完成";
            done.innerHTML = value;
            if (count) {
                if (done.classList.contains("mui-disabled")) {
                    done.classList.remove("mui-disabled");
                }
            } else {
                if (!done.classList.contains("mui-disabled")) {
                    done.classList.add("mui-disabled");
                }
            }
        });

    }).fail(function (e) {

    });
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

function mxItem(fwpno, fwpname, fggxh, funit, famount) {
    var mx = Object.create({
        fwpno: fwpno,
        fwpname: fwpname,
        fggxh: fggxh,
        funit: funit,
        famount: famount,
        _check: function () {
            return mx;
        }

    });
    return mx._check();
}

function initData(data, flag) {
    var item = data.FormDataSet.BPM_jlkOfficeSupplies_A[0];
    if (flag) {

        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.fbillno);
    }
    $("#fname").val(item.fname);
    $("#fdept").val(item.fdept);
    $("#fdate").val(FormatterTimeYMS(item.fdate));

    var item_c = data.FormDataSet.BPM_jlkOfficeSupplies_B;
    for (var i = 0; i < item_c.length;i++){
        itemidArr.push(item_c[i].itemid);
        var li = '<div id="mx" class="mui-card">';
        li = li + '   <div class="mui-input-row itemtitle">';
        li = li + '      <label>明细列表项</label>';
        li = li + '      <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '      <label for="fwpno">物品编码</label>';
        li = li + '      <input type="text" id="fwpno" name="fwpno" readonly="readonly" value="' + item_c[i].fwpno + '"/>';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '      <label for="fwpname">物品名称<i style="color:red;">*</i></label>';
        li = li + '      <input type="text" id="fwpname" name="fwpname" readonly="readonly" value="' + item_c[i].fwpname + '"/>';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '      <label for="fggxh">规格型号</label>';
        li = li + '      <input type="text" id="fggxh" name="fggxh" readonly="readonly" value="' + changeNullToEmpty( item_c[i].fggxh )+ '"/>';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '      <label for="funit">单位</label>';
        li = li + '      <input type="text" id="funit" name="funit" readonly="readonly" value="' + changeNullToEmpty( item_c[i].funit) + '"/>';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '      <label for="famount">数量</label>';
        li = li + '      <input type="text" id="famount" name="famount" readonly="readonly" value="' + changeNullToEmpty( item_c[i].famount )+ '"/>';
        li = li + '   </div>';
        li = li + '</div>';
        $("#mxlist").append(li);

    }
}

function nodeControllerExp(NodeName) {
    if (NodeName == '开始') {
        initList();
        $("#mxlist").find('span').each(function () {
            $(this).css('display', 'block');
        });
        $('#tjmx').show();
        $("#mxlist").find("#funit,#famount").each(function () {
            $(this).removeAttr('readonly');
        });
        tapEvent();
    }
}
function Save() {

    var fname = $("#fname").val();
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();
    var mxflag = false;
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fwpno = $(this).find("#fwpno").val();
        var fwpname = $(this).find("#fwpname").val();
        var fggxh = $(this).find("#fggxh").val();
        var funit = $(this).find("#funit").val();
        var famount = $(this).find("#famount").val();

        var mx = mxItem(fwpno, fwpname, fggxh, funit, famount);
        mxlistArr.push(mx);
    });
    var btnArry = ["取消", "确定"];
    mui.confirm('即将提交，是否确定？', '提交确认提醒', btnArry, function (e) {
        if (e.index == 1) {
            var xml = '<?xml version= "1.0" ?>';
            xml = xml + '   <XForm>';
            xml = xml + '         <Header>';
            xml = xml + '        <Method>Post</Method>';
            xml = xml + '       <ProcessName>洁丽康公司部门月度办公用品申请</ProcessName>';
            xml = xml + '         <ProcessVersion>' + version + '</ProcessVersion>';
            xml = xml + '            <DraftGuid></DraftGuid>';
            xml = xml + '             <OwnerMemberFullName>' + BPMOU + '</OwnerMemberFullName>';
            xml = xml + '            <Action>提交</Action>';
            xml = xml + '          <Comment></Comment>';
            xml = xml + '             <InviteIndicateUsers></InviteIndicateUsers>';
            xml = xml + '       </Header>';
            xml = xml + '       <FormData>';

            xml = xml + ' <BPM_jlkOfficeSupplies_A>';
            xml = xml + ' <fbillno>自动生成</fbillno>';
            xml = xml + ' <fname>' + fname + '</fname>';
            xml = xml + ' <fdept>' + fdept + '</fdept>';
            xml = xml + ' <fdate>' + fdate + '</fdate>';
            xml = xml + '</BPM_jlkOfficeSupplies_A>';

            for (var i = 0; i < mxlistArr.length;i++){
                xml = xml + ' <BPM_jlkOfficeSupplies_B>';
                xml = xml + '   <RelationRowGuid>'+(i+1)+'</RelationRowGuid>';
                xml = xml + '  <RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + '  <fentryno>' + (i + 1) + '</fentryno>';
                xml = xml + '  <fwpno>' + mxlistArr[i].fwpno + '</fwpno>';
                xml = xml + '  <fwpname>' + mxlistArr[i].fwpname + '</fwpname>';
                xml = xml + '  <fggxh>' + mxlistArr[i].fggxh + '</fggxh>';
                xml = xml + '  <funit>' + mxlistArr[i].funit + '</funit>';
                xml = xml + '  <famount>' + mxlistArr[i].famount + '</famount>';
                xml = xml + ' </BPM_jlkOfficeSupplies_B>';
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
    var mxflag = false;
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fwpno = $(this).find("#fwpno").val();
        var fwpname = $(this).find("#fwpname").val();
        var fggxh = $(this).find("#fggxh").val();
        var funit = $(this).find("#funit").val();
        var famount = $(this).find("#famount").val();

        var mx = mxItem(fwpno, fwpname, fggxh, funit, famount);
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

            xml = xml + ' <BPM_jlkOfficeSupplies_A>';
            xml = xml + ' <fbillno>' + fbillno + '</fbillno>';
            xml = xml + ' <fname>' + fname + '</fname>';
            xml = xml + ' <fdept>' + fdept + '</fdept>';
            xml = xml + ' <fdate>' + fdate + '</fdate>';
            xml = xml + '</BPM_jlkOfficeSupplies_A>';

            for (var i = 0; i < mxlistArr.length; i++) {
                xml = xml + ' <BPM_jlkOfficeSupplies_B>';
                xml = xml + '   <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml = xml + '  <RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + '  <fentryno>' + (i + 1) + '</fentryno>';
                xml = xml + '  <fwpno>' + mxlistArr[i].fwpno + '</fwpno>';
                xml = xml + '  <fwpname>' + mxlistArr[i].fwpname + '</fwpname>';
                xml = xml + '  <fggxh>' + mxlistArr[i].fggxh + '</fggxh>';
                xml = xml + '  <funit>' + mxlistArr[i].funit + '</funit>';
                xml = xml + '  <famount>' + mxlistArr[i].famount + '</famount>';
                xml = xml + ' </BPM_jlkOfficeSupplies_B>';
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
    var mxflag = false;
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fwpno = $(this).find("#fwpno").val();
        var fwpname = $(this).find("#fwpname").val();
        var fggxh = $(this).find("#fggxh").val();
        var funit = $(this).find("#funit").val();
        var famount = $(this).find("#famount").val();

        var mx = mxItem(fwpno, fwpname, fggxh, funit, famount);
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

            xml = xml + ' <BPM_jlkOfficeSupplies_A>';
            xml = xml + ' <fbillno>' + fbillno + '</fbillno>';
            xml = xml + ' <fname>' + fname + '</fname>';
            xml = xml + ' <fdept>' + fdept + '</fdept>';
            xml = xml + ' <fdate>' + fdate + '</fdate>';
            xml = xml + '</BPM_jlkOfficeSupplies_A>';

            for (var i = 0; i < mxlistArr.length; i++) {
                xml = xml + ' <BPM_jlkOfficeSupplies_B>';
                xml = xml + '   <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml = xml + '  <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
                xml = xml + '  <fentryno>' + (i + 1) + '</fentryno>';
                xml = xml + '  <fwpno>' + mxlistArr[i].fwpno + '</fwpno>';
                xml = xml + '  <fwpname>' + mxlistArr[i].fwpname + '</fwpname>';
                xml = xml + '  <fggxh>' + mxlistArr[i].fggxh + '</fggxh>';
                xml = xml + '  <funit>' + mxlistArr[i].funit + '</funit>';
                xml = xml + '  <famount>' + mxlistArr[i].famount + '</famount>';
                xml = xml + ' </BPM_jlkOfficeSupplies_B>';
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
    var mxflag = false;
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fwpno = $(this).find("#fwpno").val();
        var fwpname = $(this).find("#fwpname").val();
        var fggxh = $(this).find("#fggxh").val();
        var funit = $(this).find("#funit").val();
        var famount = $(this).find("#famount").val();

        var mx = mxItem(fwpno, fwpname, fggxh, funit, famount);
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

            xml = xml + ' <BPM_jlkOfficeSupplies_A>';
            xml = xml + ' <fbillno>' + fbillno + '</fbillno>';
            xml = xml + ' <fname>' + fname + '</fname>';
            xml = xml + ' <fdept>' + fdept + '</fdept>';
            xml = xml + ' <fdate>' + fdate + '</fdate>';
            xml = xml + '</BPM_jlkOfficeSupplies_A>';

            for (var i = 0; i < mxlistArr.length; i++) {
                xml = xml + ' <BPM_jlkOfficeSupplies_B>';
                xml = xml + '   <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml = xml + '  <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
                xml = xml + '  <fentryno>' + (i + 1) + '</fentryno>';
                xml = xml + '  <fwpno>' + mxlistArr[i].fwpno + '</fwpno>';
                xml = xml + '  <fwpname>' + mxlistArr[i].fwpname + '</fwpname>';
                xml = xml + '  <fggxh>' + mxlistArr[i].fggxh + '</fggxh>';
                xml = xml + '  <funit>' + mxlistArr[i].funit + '</funit>';
                xml = xml + '  <famount>' + mxlistArr[i].famount + '</famount>';
                xml = xml + ' </BPM_jlkOfficeSupplies_B>';
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

        xml = xml + ' <BPM_jlkOfficeSupplies_A>';
        xml = xml + ' <fbillno>' + fbillno + '</fbillno>';
        xml = xml + ' <fname>' + fname + '</fname>';
        xml = xml + ' <fdept>' + fdept + '</fdept>';
        xml = xml + ' <fdate>' + fdate + '</fdate>';
        xml = xml + '</BPM_jlkOfficeSupplies_A>';

        for (var i = 0; i < mxlistArr.length; i++) {
            xml = xml + ' <BPM_jlkOfficeSupplies_B>';
            xml = xml + '   <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
            xml = xml + '  <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
            xml = xml + '  <fentryno>' + (i + 1) + '</fentryno>';
            xml = xml + '  <fwpno>' + mxlistArr[i].fwpno + '</fwpno>';
            xml = xml + '  <fwpname>' + mxlistArr[i].fwpname + '</fwpname>';
            xml = xml + '  <fggxh>' + mxlistArr[i].fggxh + '</fggxh>';
            xml = xml + '  <funit>' + mxlistArr[i].funit + '</funit>';
            xml = xml + '  <famount>' + mxlistArr[i].famount + '</famount>';
            xml = xml + ' </BPM_jlkOfficeSupplies_B>';
        }

        xml = xml + '</FormData>';
        xml = xml + '</XForm>';
        PostXml(xml);
    }
}