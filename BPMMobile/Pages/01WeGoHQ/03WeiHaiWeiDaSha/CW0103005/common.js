function prepMsg() {
    $("#fdate").val(getNowFormatDate(2));
    tapEvent();
    upload();
    var xml = '<?xml version= "1.0" ?>';
    xml = xml + '   <Requests>';
    xml = xml + '   <Params>';
    xml = xml + '       <Method>GetFormPostData</Method>';
    xml = xml + '       <ProcessName>威海卫大厦车辆维修保养费用申请</ProcessName>';
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
        $("#fname").val(item.申请人);
        $("#fdept").val(item.申请部门);
        }).fail(function (e) {

    });
}

function tapEvent() {
    var fcxchdata = [
        {
            value: '',
            text:'鲁K13200(瑞风)'
        },
        {
            value: '',
            text:'鲁K82933(考斯特)'
        },
        {
            value: '',
            text:'鲁K99780(别克)'
        },
        {
            value: '',
            text:'鲁K60A88(别克)'
        },
        {
            value: '',
            text:'鲁KD820C(全顺)'
        }
    ];

    var fsqxmdata = [
        {
            value: '',
            text:'维修'
        },
        {
            value: '',
            text:'保养'
        }
    ];


    $('#tjmx').on('tap', function () {
        var li = '<div id="mx" class="mui-card">';
        li = li + '<div class="mui-input-row itemtitle">';
        li = li + '<label>明细列表项</label>';
        li = li + '<span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>';
        li = li + '</div>';
        li += '<div class="mui-input-row">';
        li += '<label for="fcxch">车型车号<i style="color:red;">*</i></label>';
        li += '<input type="text" id="fcxch" name="fcxch" readonly placeholder="请选择车型车号"/>';
        li += '</div>';
        li += '<div class="mui-input-row">';
        li += '<label for="fsqxm">申请项目<i style="color:red;">*</i></label>';
        li += '<input type="text" id="fsqxm" name="fsqxm" readonly placeholder="请选择申请项目"/>';
        li += '</div>';
        li += '<div class="mui-input-row">';
        li += '<label for="fxylc">现有里程<i style="color:red;">*</i></label>';
        li += '<input type="number" id="fxylc" name="fxylc" placeholder="请填写现有里程"/>';
        li += '</div>';
        li += '<div class="mui-input-row" style="height:auto;">';
        li += '<label for="fwxhbyyy">维修或保养原因<i style="color:red;">*</i></label>';
        li += '<textarea rows="3" id="fwxhbyyy" name="fwxhbyyy" placeholder="请填写维修或保养原因"></textarea>';
        li += '</div>';
        li += '<div class="mui-input-row">';
        li += '<label for="fyjfy">预计费用<i style="color:red;">*</i></label>';
        li += '<input type="number" id="fyjfy" name="fyjfy" placeholder="请填写预计费用"/>';
        li += '</div>';
        li += '<div class="mui-input-row">';
        li += '<label for="fsjfy">实际费用<i style="color:red;">*</i></label>';
        li += '<input type="number" id="fsjfy" name="fsjfy" placeholder="请填写实际费用"/>';
        li += '</div>';
        li = li + '</div>';
        $("#mxlist").append(li);

        showPickerByZepto('#mxlist', '#fcxch', fcxchdata);

        showPickerByZepto('#mxlist', '#fsqxm', fsqxmdata);


    });




}




function mxItem(fcxch, fsqxm, fxylc, fwxhbyyy, fyjfy, fsjfy) {
    var mx = Object.create({
        fcxch: fcxch,
        fsqxm: fsqxm,
        fxylc: fxylc,
        fwxhbyyy: fwxhbyyy,
        fyjfy: fyjfy,
        fsjfy: fsjfy,
        _check: function () {
            if (!fcxch) {
                mui.toast('请选择车型车号');
                return null;
            }
            if (!fsqxm) {
                mui.toast('请选择申请项目');
                return null;
            }
            if (!fxylc) {
                mui.toast('请填写现有里程');
                return null;
            }
            if (!fwxhbyyy){
                mui.toast('请填写维修或保养原因');
                return null;
            }
            if (!fyjfy) {
                mui.toast('请填写预计费用');
                return null;
            }
            if (!fsjfy) {
                mui.toast('请填写实际费用');
                return null;
            }
            return mx;
        }
    });
    return mx;
}


function initData(data, flag) {
    var item = data.FormDataSet.威海卫大厦车辆维修保养申请表_A[0];
    if (flag) {

        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.fbillno);

    }

    $("#fname").val(item.申请人);
    $("#fdept").val(item.申请部门);
    $("#fdate").val(FormatterTimeYMS(item.申请时间));
    $("#fbz").val(item.备注);


    if (item.附件 != null && item.附件 != "") {
        var fjtmp = (String)(item.附件);

        fjArray = fjtmp.split(";");


        //console.log("fjArray:" + fjArray);

        //请求附件详细信息
        $.ajax({
            type: 'POST',
            url: '/api/bpm/GetAttachmentsInfo',
            //dataType:'json',
            data: { 'fileIds': fjArray },

            beforeSend: function (XHR) {
                XHR.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem('ticket'));
            },
            success: function (data, status) {
                if (status == "success") {

                    console.log(data);

                    for (var i = 0; i < data.length; i++) {

                        var name = data[i].Name;
                        var type = (data[i].Ext).replace(".", "");
                        var size = String(data[i].Size);

                        var time = String(data[i].LastUpdate).replace("T", " ");
                        var downurl = baseDownloadUrl + data[i].FileID;

                        var attach = attachItem(name, type, size, time, downurl);
                        attachArray.push(attach);

                        var li = '<div class="pic-preview smallyulan success">';
                        li = li + ' <div class="del none" style="opacity:1;z-index:999;"onclick="delPicture(this)">x</div>';

                        //类型判断 
                        if ((data[i].Ext).indexOf("png") != -1 || (data[i].Ext).indexOf("jpg") != -1 || (data[i].Ext).indexOf("bmp") != -1) {

                            //li = li + '    <div class="img-wrap smallimg" id="simg" ><a href="'+baseDownloadUrl + data[i].FileID + '"><img src="'+baseDownloadUrl + data[i].FileID + '"/></a></div>';
                            li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '" ><img src="' + baseDownloadUrl + data[i].FileID + '"/></div>';

                        } else if ((data[i].Ext).indexOf("xls") != -1) {

                            li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '"><img src="../../Content/images/xlsx@2x.png"/></div>';

                        } else if ((data[i].Ext).indexOf("doc") != -1) {

                            li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '"><img src="../../Content/images/docx@2x.png"/></div>';

                        } else if ((data[i].Ext).indexOf("ppt") != -1) {

                            li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '"><img src="../../Content/images/ppt@2x.png"/></div>';

                        } else if ((data[i].Ext).indexOf("pdf") != -1) {

                            li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '"><img src="../../Content/images/pdf@2x.png"/></div>';

                        } else if ((data[i].Ext).indexOf("zip") != -1 || (data[i].Ext).indexOf("rar") != -1 || (data[i].Ext).indexOf("7z") != -1) {

                            li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '"><img src="../../Content/images/zip@2x.png"/></div>';

                        } else if ((data[i].Ext).indexOf("txt") != -1) {

                            li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '"><img src="../../Content/images/txt@2x.png"/></div>';

                        } else {
                            li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '"><img src="../../Content/images/unkown@2x.png"/></div>';
                        }

                        li = li + ' </div>';
                        li = li + '</div>';
                        $(".upload-img-list").append(li);


                        $(".imgdiv").each(function () {

                            $(this).parent().find(".del.none").hide();

                        });




                    }
                    watch();
                    $(".imgdiv").on('tap', function () {
                        console.log($(this)[0].id);
                        if (String(navigator.userAgent).match('cloudhub') != null) {
                            window.open(attachArray[$(this)[0].id].downurl);
                        }
                        XuntongJSBridge.call('showFile', {
                            'fileName': attachArray[$(this)[0].id].name,
                            'fileExt': attachArray[$(this)[0].id].type,
                            'fileTime': attachArray[$(this)[0].id].time,
                            'fileSize': attachArray[$(this)[0].id].size,
                            'fileDownloadUrl': attachArray[$(this)[0].id].downurl
                        }, function (result) {
                            //alert(JSON.stringify(result));
                        });
                    });


                }

            }, error: function (e) {
                console.log(e);

            }, complete: function () {

            }

        });

    }

    var item_c = data.FormDataSet.威海卫大厦车辆维修保养申请表_B;
    for (var i = 0; i < item_c.length; i++){
        itemidArr.push(item_c[i].itemid);
        var li = '<div id="mx" class="mui-card">';
        li += '<div class="mui-input-row itemtitle">';
        li += '<label>明细列表项</label>';
        li += '<span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>';
        li += '</div>';
        li += '<div class="mui-input-row">';
        li += '<label for="fcxch">车型车号<i style="color:red;">*</i></label>';
        li += '<input type="text" id="fcxch" name="fcxch" readonly value="' + item_c[i].车型车号+'"/>';
        li += '</div>';
        li += '<div class="mui-input-row">';
        li += '<label for="fsqxm">申请项目<i style="color:red;">*</i></label>';
        li += '<input type="text" id="fsqxm" name="fsqxm" readonly value="' + item_c[i].申请项目 + '"/>';
        li += '</div>';
        li += '<div class="mui-input-row">';
        li += '<label for="fxylc">现有里程<i style="color:red;">*</i></label>';
        li += '<input type="number" id="fxylc" name="fxylc" readonly value="' + item_c[i].现有历程+'"/>';
        li += '</div>';
        li += '<div class="mui-input-row" style="height:auto;">';
        li += '<label for="fwxhbyyy">维修或保养原因<i style="color:red;">*</i></label>';
        li += '<textarea rows="3" id="fwxhbyyy" name="fwxhbyyy" readonly>' + item_c[i].维修保养原因+'</textarea>';
        li += '</div>';
        li += '<div class="mui-input-row">';
        li += '<label for="fyjfy">预计费用<i style="color:red;">*</i></label>';
        li += '<input type="number" id="fyjfy" name="fyjfy" readonly value="' + item_c[i].预计费用+'"/>';
        li += '</div>';
        li += '<div class="mui-input-row">';
        li += '<label for="fsjfy">实际费用<i style="color:red;">*</i></label>';
        li += '<input type="number" id="fsjfy" name="fsjfy" readonly value="' + item_c[i].实际费用 +'"/>';
        li += '</div>';
        li += '</div>';
        $("#mxlist").append(li);
    }

}
function nodeControllerExp(NodeName) {
    if (String(NodeName).match('开始') != null) {
        $("#mxlist").find('span').each(function () {
            $(this).show();
        });
        upload();
        $(".upload-addbtn").show();
        tapEvent();
        $("#mxlist").find("#mx").each(function () {
            $(this).find("#fxylc,#fwxhbyyy,#fyjfy,#fsjfy").removeAttr('readonly');
        });
        $("#fdate,#fbz").removeAttr('readonly');
        $("#tjmx").show();

    }
}

function Save() {
    var fname = $("#fname").val();
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();

    var fbz = $("#fbz").val();
    var mxflag = false;
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fcxch = $(this).find("#fcxch").val();
        var fsqxm = $(this).find("#fsqxm").val();
        var fxylc = $(this).find("#fxylc").val();
        var fwxhbyyy = $(this).find("#fwxhbyyy").val();
        var fyjfy = $(this).find("#fyjfy").val();
        var fsjfy = $(this).find("#fsjfy").val();
        if (mxItem(fcxch, fsqxm, fxylc, fwxhbyyy, fyjfy, fsjfy)._check() == null) {
            mxflag = true;
            return;
        }
        var mx = mxItem(fcxch, fsqxm, fxylc, fwxhbyyy, fyjfy, fsjfy);
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
            xml = xml + '       <ProcessName>威海卫大厦车辆维修保养费用申请</ProcessName>';
            xml = xml + '         <ProcessVersion>' + version + '</ProcessVersion>';
            xml = xml + '            <DraftGuid></DraftGuid>';
            xml = xml + '             <OwnerMemberFullName>' + BPMOU + '</OwnerMemberFullName>';
            xml = xml + '            <Action>提交</Action>';
            xml = xml + '          <Comment></Comment>';
            xml = xml + '             <InviteIndicateUsers></InviteIndicateUsers>';
            xml = xml + '       </Header>';
            xml = xml + '       <FormData>';
            xml += ' <威海卫大厦车辆维修保养申请表_A>';
            xml += '  <fbillno>自动带出</fbillno>';
            xml += ' <申请人>' + fname + '</申请人>';
            xml += ' <申请部门>' + fdept + '</申请部门>';
            xml += ' <申请时间>' + fdate + '</申请时间>';
            xml += ' <备注>' + fbz + '</备注>';
            xml += '  <附件>' + fjArray.join(';') + '</附件>';
            xml += ' </威海卫大厦车辆维修保养申请表_A>';
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += ' <威海卫大厦车辆维修保养申请表_B>';
                xml += '<RelationRowGuid>'+(i+1)+'</RelationRowGuid>';
                xml += ' <RowPrimaryKeys></RowPrimaryKeys>';
                xml += ' <fentyrno>' + (i + 1) + '</fentyrno>';
                xml += ' <车型车号>' + mxlistArr[i].fcxch + '</车型车号>';
                xml += ' <申请项目>' + mxlistArr[i].fsqxm + '</申请项目>';
                xml += ' <现有历程>' + mxlistArr[i].fxylc + '</现有历程>';
                xml += ' <维修保养原因>' + mxlistArr[i].fwxhbyyy + '</维修保养原因>';
                xml += ' <预计费用>' + mxlistArr[i].fyjfy + '</预计费用>';
                xml += ' <实际费用>' + mxlistArr[i].fsjfy + '</实际费用>';
                xml += ' </威海卫大厦车辆维修保养申请表_B>';
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

    var fbz = $("#fbz").val();
    var mxflag = false;
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fcxch = $(this).find("#fcxch").val();
        var fsqxm = $(this).find("#fsqxm").val();
        var fxylc = $(this).find("#fxylc").val();
        var fwxhbyyy = $(this).find("#fwxhbyyy").val();
        var fyjfy = $(this).find("#fyjfy").val();
        var fsjfy = $(this).find("#fsjfy").val();
        if (mxItem(fcxch, fsqxm, fxylc, fwxhbyyy, fyjfy, fsjfy)._check() == null) {
            mxflag = true;
            return;
        }
        var mx = mxItem(fcxch, fsqxm, fxylc, fwxhbyyy, fyjfy, fsjfy);
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
            xml += ' <威海卫大厦车辆维修保养申请表_A>';
            xml += '  <fbillno>' + fbillno + '</fbillno>';
            xml += ' <申请人>' + fname + '</申请人>';
            xml += ' <申请部门>' + fdept + '</申请部门>';
            xml += ' <申请时间>' + fdate + '</申请时间>';
            xml += ' <备注>' + fbz + '</备注>';
            xml += '  <附件>' + fjArray.join(';') + '</附件>';
            xml += ' </威海卫大厦车辆维修保养申请表_A>';
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += ' <威海卫大厦车辆维修保养申请表_B>';
                xml += '<RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml += ' <RowPrimaryKeys></RowPrimaryKeys>';
                xml += ' <fentyrno>' + (i + 1) + '</fentyrno>';
                xml += ' <车型车号>' + mxlistArr[i].fcxch + '</车型车号>';
                xml += ' <申请项目>' + mxlistArr[i].fsqxm + '</申请项目>';
                xml += ' <现有历程>' + mxlistArr[i].fxylc + '</现有历程>';
                xml += ' <维修保养原因>' + mxlistArr[i].fwxhbyyy + '</维修保养原因>';
                xml += ' <预计费用>' + mxlistArr[i].fyjfy + '</预计费用>';
                xml += ' <实际费用>' + mxlistArr[i].fsjfy + '</实际费用>';
                xml += ' </威海卫大厦车辆维修保养申请表_B>';
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

    var fbz = $("#fbz").val();
    var mxflag = false;
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fcxch = $(this).find("#fcxch").val();
        var fsqxm = $(this).find("#fsqxm").val();
        var fxylc = $(this).find("#fxylc").val();
        var fwxhbyyy = $(this).find("#fwxhbyyy").val();
        var fyjfy = $(this).find("#fyjfy").val();
        var fsjfy = $(this).find("#fsjfy").val();
       
        var mx = mxItem(fcxch, fsqxm, fxylc, fwxhbyyy, fyjfy, fsjfy);
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
            xml += ' <威海卫大厦车辆维修保养申请表_A>';
            xml += '  <fbillno>' + fbillno + '</fbillno>';
            xml += ' <申请人>' + fname + '</申请人>';
            xml += ' <申请部门>' + fdept + '</申请部门>';
            xml += ' <申请时间>' + fdate + '</申请时间>';
            xml += ' <备注>' + fbz + '</备注>';
            xml += '  <附件>' + fjArray.join(';') + '</附件>';
            xml += ' </威海卫大厦车辆维修保养申请表_A>';
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += ' <威海卫大厦车辆维修保养申请表_B>';
                xml += '<RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml += ' <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
                xml += ' <fentyrno>' + (i + 1) + '</fentyrno>';
                xml += ' <车型车号>' + mxlistArr[i].fcxch + '</车型车号>';
                xml += ' <申请项目>' + mxlistArr[i].fsqxm + '</申请项目>';
                xml += ' <现有历程>' + mxlistArr[i].fxylc + '</现有历程>';
                xml += ' <维修保养原因>' + mxlistArr[i].fwxhbyyy + '</维修保养原因>';
                xml += ' <预计费用>' + mxlistArr[i].fyjfy + '</预计费用>';
                xml += ' <实际费用>' + mxlistArr[i].fsjfy + '</实际费用>';
                xml += ' </威海卫大厦车辆维修保养申请表_B>';
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

    var fbz = $("#fbz").val();
    var mxflag = false;
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fcxch = $(this).find("#fcxch").val();
        var fsqxm = $(this).find("#fsqxm").val();
        var fxylc = $(this).find("#fxylc").val();
        var fwxhbyyy = $(this).find("#fwxhbyyy").val();
        var fyjfy = $(this).find("#fyjfy").val();
        var fsjfy = $(this).find("#fsjfy").val();
      
        var mx = mxItem(fcxch, fsqxm, fxylc, fwxhbyyy, fyjfy, fsjfy);
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

            xml += ' <威海卫大厦车辆维修保养申请表_A>';
            xml += '  <fbillno>' + fbillno + '</fbillno>';
            xml += ' <申请人>' + fname + '</申请人>';
            xml += ' <申请部门>' + fdept + '</申请部门>';
            xml += ' <申请时间>' + fdate + '</申请时间>';
            xml += ' <备注>' + fbz + '</备注>';
            xml += '  <附件>' + fjArray.join(';') + '</附件>';
            xml += ' </威海卫大厦车辆维修保养申请表_A>';
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += ' <威海卫大厦车辆维修保养申请表_B>';
                xml += '<RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml += ' <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
                xml += ' <fentyrno>' + (i + 1) + '</fentyrno>';
                xml += ' <车型车号>' + mxlistArr[i].fcxch + '</车型车号>';
                xml += ' <申请项目>' + mxlistArr[i].fsqxm + '</申请项目>';
                xml += ' <现有历程>' + mxlistArr[i].fxylc + '</现有历程>';
                xml += ' <维修保养原因>' + mxlistArr[i].fwxhbyyy + '</维修保养原因>';
                xml += ' <预计费用>' + mxlistArr[i].fyjfy + '</预计费用>';
                xml += ' <实际费用>' + mxlistArr[i].fsjfy + '</实际费用>';
                xml += ' </威海卫大厦车辆维修保养申请表_B>';
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
        xml += ' <威海卫大厦车辆维修保养申请表_A>';
        xml += '  <fbillno>' + fbillno + '</fbillno>';
        xml += ' <申请人>' + fname + '</申请人>';
        xml += ' <申请部门>' + fdept + '</申请部门>';
        xml += ' <申请时间>' + fdate + '</申请时间>';
        xml += ' <备注>' + fbz + '</备注>';
        xml += '  <附件>' + fjArray.join(';') + '</附件>';
        xml += ' </威海卫大厦车辆维修保养申请表_A>';
        for (var i = 0; i < mxlistArr.length; i++) {
            xml += ' <威海卫大厦车辆维修保养申请表_B>';
            xml += '<RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
            xml += ' <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
            xml += ' <fentyrno>' + (i + 1) + '</fentyrno>';
            xml += ' <车型车号>' + mxlistArr[i].fcxch + '</车型车号>';
            xml += ' <申请项目>' + mxlistArr[i].fsqxm + '</申请项目>';
            xml += ' <现有历程>' + mxlistArr[i].fxylc + '</现有历程>';
            xml += ' <维修保养原因>' + mxlistArr[i].fwxhbyyy + '</维修保养原因>';
            xml += ' <预计费用>' + mxlistArr[i].fyjfy + '</预计费用>';
            xml += ' <实际费用>' + mxlistArr[i].fsjfy + '</实际费用>';
            xml += ' </威海卫大厦车辆维修保养申请表_B>';
        }
        xml = xml + '</FormData>';
        xml = xml + '</XForm>';
        PostXml(xml);

    }
}