function prepMsg() {
    $("#fdate").val(getNowFormatDate(2));
    tapEvent();
    var xml = '<?xml version= "1.0" ?>';
    xml = xml + '   <Requests>';
    xml = xml + '   <Params>';
    xml = xml + '       <Method>GetFormPostData</Method>';
    xml = xml + '       <ProcessName>医用制品集团低值易耗品采购申请</ProcessName>';
    xml = xml + '      <ProcessVersion>1.1</ProcessVersion>';
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
        $("#ftel").val(item.ftel);
        $("#fzgs").val(item.fzgs);
        $("#ffgs").val(item.ffgs);
        
    }).fail(function (e) {

    });

}

function tapEvent() {
    var fxmlbdata = [

        {
            value: '',
            text:'外协制作类'
        },
        {
            value: '',
            text: '零修工程类'
        },
        {
            value: '',
            text:'设备维修保养类'
        },
        {
            value: '',
            text:'特种设备保养与年检'
        },
        {
            value: '',
            text:'其他'
        }

    ];

    showPicker('fxmlb', fxmlbdata);

    $('#tjmx_gys').on('tap', function () {
        var li = ' <div id="mx" class="mui-card">';
        li = li + '   <div class="mui-input-row itemtitle">';
        li = li + '        <label>明细列表项</label>';
        li = li + '      <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>';
        li = li + '    </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '     <label for="fgys_no">供应商编码</label>';
        li = li + '   <input type="text" id="fgys_no" name="fgys_no" placeholder="请填写供应商编码" />';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '     <label for="fgys_name">供应商名称<i style="color:red;">*</i></label>';
        li = li + '    <input type="text" id="fgys_name" name="fgys_name" placeholder="请填写供应商名称" />';
        li = li + '    </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '    <label for="famount">金额(元)</label>';
        li = li + '   <input type="number" id="famount" name="famount" placeholder="请填写金额" />';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '    <label for="fremark">备注</label>';
        li = li + '    <input type="text" id="fremark" name="fremark" placeholder="请填写备注" />';
        li = li + '   </div>';
        li = li + '   </div>';
        $("#mxlist_gys").append(li);
    });

   
}
function tapNodeEvent() {
    $("#mxlist_bjb").find("#fshjg").each(function () {
        $(this).off('input');
        $(this).on('input', function () {
            calcPrice();
        });
    });

    $("#tjmx_bjb").on('tap', function () {

        var li = ' <div id="mx" class="mui-card">';
        li = li + '   <div class="mui-input-row itemtitle">';
        li = li + '        <label>比价部列表项</label>';
        li = li + '      <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>';
        li = li + '    </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '   <label for="fgys_name">供应商名称</label>';
        li = li + '    <input type="text" id="fgys_name" name="fgys_name" placeholder="请填写供应商名称" />';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '   <label for="fggxh">规格型号</label>';
        li = li + '   <input type="text" id="fggxh" name="fggxh" placeholder="请填写规格型号" />';
        li = li + '   </div>';
        li = li + '  <div class="mui-input-row">';
        li = li + '  <label for="fdw">单位</label>';
        li = li + '   <input type="text" id="fdw" name="fdw" placeholder="请填写单位" />';
        li = li + '  </div>';
        li = li + '  <div class="mui-input-row">';
        li = li + '     <label for="fsl">数量</label>';
        li = li + '    <input type="number" id="fsl" name="fsl" placeholder="请填写数量" />';
        li = li + '   </div>';
        li = li + '  <div class="mui-input-row">';
        li = li + '   <label for="fdj">单价</label>';
        li = li + '   <input type="number" id="fdj" name="fdj" placeholder="请填写单价" />';
        li = li + '   </div>';
        li = li + '  <div class="mui-input-row">';
        li = li + '    <label for="fshjg">审核价格</label>';
        li = li + '   <input type="number" id="fshjg" name="fshjg" placeholder="请填写审核价格" />';
        li = li + '  </div>';
        li = li + '</div>';
        $("#mxlist_bjb").append(li);
        $("#mxlist_bjb").find("#fshjg").each(function () {
            $(this).off('input');
            $(this).on('input', function () {
                calcPrice();
            });
        });
    });

}
function calcPrice() {
    var ftotal = 0.00;
    $("#mxlist_bjb").find("#fshjg").each(function () {
        var fshjg = parseFloat($(this).val());
        if (isNaN(fshjg)) {
            fshjg = 0.00;
        }
        ftotal = (parseFloat(ftotal) + fshjg).toFixed(2);
        $("#fhj_shjg").val(ftotal);
    });

}

function deleteItem(context) {
    var btnArray = ['否', '是'];
    mui.confirm('确认删除？', '', btnArray, function (e) {
        if (e.index == 1) {
            $(context).parent().parent().remove();
            calcPrice();
        }
    });
}

function mxItem_bjb(fgys_name, fggxh, fdw, fsl, fdj, fshjg) {
    var mx = Object.create({
        fgys_name: fgys_name,
        fggxh: fggxh,
        fdw: fdw,
        fsl: fsl,
        fdj: fdj,
        fshjg: fshjg,
        _check: function () {
            return mx;
        }

    });
    return mx._check();
}
function mxItem_gys(fgys_no, fgys_name, famount, fremark) {
    var mx = Object.create({
        fgys_no: fgys_no,
        fgys_name: fgys_name,
        famount: famount,
        fremark: fremark,
        _check: function () {
            if (!fgys_name){
                mui.toast('请填写供应商名称');
                return null;
            }
            return mx;
        }
    });
    return mx._check();
}

var itemidArr1 = new Array();
var itemidArr2 = new Array();
function initData(data, flag) {
    var item = data.FormDataSet.BPM_YYZPDZYH_A[0];
    if (flag) {

        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.fbillno);
    }

    $("#fname").val(item.fname);
    $("#fdept").val(item.fdept);
    $("#fdate").val(FormatterTimeYMS(item.fdate));
    $("#ftel").val(item.ftel);
    $("#fzgs").val(item.fzgs);
    $("#ffgs").val(item.ffgs);
    $("#fxmlb").val(item.fxmlb);
    $("#fxmbh").val(item.fxmbh);
    $("#fxmmc").val(item.fxmmc);
    $("#famount").val(item.famount);
    $("#fxmms").val(item.fxmms);
    $("#fhj_shjg").val(item.fhj_shjg);

    var item_c1 = data.FormDataSet.BPM_YYZPDZYH_B;
    for (var i = 0; i < item_c1.length; i++){
        itemidArr1.push(item_c1[i].itemid);
        var li = ' <div id="mx" class="mui-card">';
        li = li + '   <div class="mui-input-row itemtitle">';
        li = li + '        <label>明细列表项</label>';
        li = li + '      <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>';
        li = li + '    </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '     <label for="fgys_no">供应商编码</label>';
        li = li + '   <input type="text" id="fgys_no" name="fgys_no" readonly="readonly" value="' + item_c1[i].fgys_no + '"/>';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '     <label for="fgys_name">供应商名称<i style="color:red;">*</i></label>';
        li = li + '    <input type="text" id="fgys_name" name="fgys_name" readonly="readonly" value="' + item_c1[i].fgys_name + '"/>';
        li = li + '    </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '    <label for="famount">金额(元)</label>';
        li = li + '   <input type="number" id="famount" name="famount" readonly="readonly" value="' + item_c1[i].famount + '"/>';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '    <label for="fremark">备注</label>';
        li = li + '    <input type="text" id="fremark" name="fremark" readonly="readonly" value="' + item_c1[i].fremark + '"/>';
        li = li + '   </div>';
        li = li + '   </div>';
        $("#mxlist_gys").append(li);
    }

    var item_c2 = data.FormDataSet.BPM_YYZPDZYH_C;
   
        for (var i = 0; i < item_c2.length; i++) {
            itemidArr2.push(item_c2[i].itemid);
            var li = ' <div id="mx" class="mui-card">';
            li = li + '   <div class="mui-input-row itemtitle">';
            li = li + '        <label>比价部列表项</label>';
            li = li + '      <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>';
            li = li + '    </div>';
            li = li + '   <div class="mui-input-row">';
            li = li + '   <label for="fgys_name">供应商名称</label>';
            li = li + '    <input type="text" id="fgys_name" name="fgys_name" readonly="readonly" value="' + changeNullToEmpty(item_c2[i].fgys_name) + '"/>';
            li = li + '   </div>';
            li = li + '   <div class="mui-input-row">';
            li = li + '   <label for="fggxh">规格型号</label>';
            li = li + '   <input type="text" id="fggxh" name="fggxh" readonly="readonly" value="' + changeNullToEmpty(item_c2[i].fggxh) + '"/>';
            li = li + '   </div>';
            li = li + '  <div class="mui-input-row">';
            li = li + '  <label for="fdw">单位</label>';
            li = li + '   <input type="text" id="fdw" name="fdw" readonly="readonly" value="' + changeNullToEmpty(item_c2[i].fdw) + '"/>';
            li = li + '  </div>';
            li = li + '  <div class="mui-input-row">';
            li = li + '     <label for="fsl">数量</label>';
            li = li + '    <input type="number" id="fsl" name="fsl" readonly="readonly" value="' + item_c2[i].fsl + '"/>';
            li = li + '   </div>';
            li = li + '  <div class="mui-input-row">';
            li = li + '   <label for="fdj">单价</label>';
            li = li + '   <input type="number" id="fdj" name="fdj" readonly="readonly" value="' + item_c2[i].fdj + '"/>';
            li = li + '   </div>';
            li = li + '  <div class="mui-input-row">';
            li = li + '    <label for="fshjg">审核价格</label>';
            li = li + '   <input type="number" id="fshjg" name="fshjg" readonly="readonly" value="' + item_c2[i].fshjg + '"/>';
            li = li + '  </div>';
            li = li + '</div>';
            $("#mxlist_bjb").append(li);
        }
  
   

    if (item.fj != null && item.fj != "") {
        var fjtmp = (String)(item.fj);

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
                        var downurl = 'http://app.weigaogroup.com:8040/BPM/YZSoft/Attachment/default.ashx?' + data[i].FileID;
                        var attach = attachItem(name, type, size, time, downurl);
                        attachArray.push(attach);



                        var li = '<div class="pic-preview smallyulan success">';
                        li = li + ' <div class="del none" style="opacity:1;z-index:999;"onclick="delPicture(this)">x</div>';

                        //类型判断
                        if ((data[i].Ext).indexOf("png") != -1 || (data[i].Ext).indexOf("jpg") != -1 || (data[i].Ext).indexOf("bmp") != -1) {

                            //li = li + '    <div class="img-wrap smallimg" id="simg" ><a href="http://app.weigaogroup.com:8040/BPM/YZSoft/Attachment/default.ashx?' + data[i].FileID + '"><img src="http://app.weigaogroup.com:8040/BPM/YZSoft/Attachment/default.ashx?' + data[i].FileID + '"/></a></div>';
                            li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '" ><img src="http://app.weigaogroup.com:8040/BPM/YZSoft/Attachment/default.ashx?' + data[i].FileID + '"/></div>';

                        } else if ((data[i].Ext).indexOf("xls") != -1) {

                            li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '"><img src="../../../../Content/images/xlsx@2x.png"/></div>';

                        } else if ((data[i].Ext).indexOf("doc") != -1) {

                            li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '"><img src="../../../../Content/images/docx@2x.png"/></div>';

                        } else if ((data[i].Ext).indexOf("ppt") != -1) {

                            li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '"><img src="../../../../Content/images/ppt@2x.png"/></div>';

                        } else if ((data[i].Ext).indexOf("pdf") != -1) {

                            li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '"><img src="../../../../Content/images/pdf@2x.png"/></div>';

                        } else if ((data[i].Ext).indexOf("zip") != -1 || (data[i].Ext).indexOf("rar") != -1 || (data[i].Ext).indexOf("7z") != -1) {

                            li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '"><img src="../../../../Content/images/zip@2x.png"/></div>';

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

                        watch();


                    }

                    $(".imgdiv").on('tap', function () {
                        console.log($(this)[0].id);
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

}
function nodeControllerExp(NodeName) {

    if (NodeName == '开始') {
        upload();
        tapEvent();
        $(".upload-addbtn").css('display', 'block');
        $("#mxlist_gys").find('span').each(function () {
            $(this).show();
        });
       
        $("#mxlist_gys").find('input').each(function () {
            $(this).removeAttr('readonly');
        });
       
        $("#ftel,#fxmbh,#fxmmc,#famount,#fxmms").removeAttr('readonly');
    } else if (NodeName == "sysInform"){

    } else {
        if (typeof (NodeName) != "undefined") {
            if (String(NodeName).indexOf('比价部') != -1 && String(NodeName).indexOf('知会') == -1) {
                tapNodeEvent();
                $("#tjmx_bjb").show();
                $("#mxlist_bjb").find('span').each(function () {
                    $(this).show();
                });
                $("#mxlist_bjb").find('input').each(function () {
                    $(this).removeAttr('readonly');
                });
            }
        }
    }
}

function Save() {
    var fname = $("#fname").val();
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();
    var ftel = $("#ftel").val();
    var fzgs = $("#fzgs").val();
    var ffgs = $("#ffgs").val();
    var fxmlb = $("#fxmlb").val();
    var fxmbh = $("#fxmbh").val();
    var fxmmc = $("#fxmmc").val();
    var famount = $("#famount").val();
    var fxmms = $("#fxmms").val();
    var fhj_shjg = $("#fhj_shjg").val();
    if (!ftel) {
        mui.toast('请填写联系方式');
        return;
    }
    if (!fxmlb) {
        mui.toast('请选择项目类别');
        return;
    }
    if (!fxmbh) {
        mui.toast('请填写项目编号');
        return;
    }
    if (!fxmmc) {
        mui.toast('请填写项目名称');
        return;
    }
    if (!famount) {
        mui.toast('请填写申请金额');
        return;
    }
    if (!fxmms) {
        mui.toast('请填写项目描述');
        return;
    }
    var mxflag = false;
    var mxlistArr1 = new Array();
    $("#mxlist_gys").find("#mx").each(function () {
        var fgys_no = $(this).find("#fgys_no").val();
        var fgys_name = $(this).find("#fgys_name").val();
        var famount = $(this).find("#famount").val();
        var fremark = $(this).find("#fremark").val();
        if (mxItem_gys(fgys_no, fgys_name, famount, fremark) == null) {
            mxflag = true;
            return;
        }
        var mx = mxItem_gys(fgys_no, fgys_name, famount, fremark);
        mxlistArr1.push(mx);

    });
    var mxlistArr2 = new Array();
    $("#mxlist_bjb").find("#mx").each(function () {
        var fgys_name = $(this).find("#fgys_name").val();
        var fggxh = $(this).find("#fggxh").val();
        var fdw = $(this).find("#fdw").val();
        var fsl = $(this).find("#fsl").val();
        var fdj = $(this).find("#fdj").val();
        var fshjg = $(this).find("#fshjg").val();
        var mx = mxItem_bjb(fgys_name, fggxh, fdw, fsl, fdj, fshjg);
        mxlistArr2.push(mx);
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
            xml = xml + '       <ProcessName>医用制品集团低值易耗品采购申请</ProcessName>';
            xml = xml + '         <ProcessVersion>' + version + '</ProcessVersion>';
            xml = xml + '            <DraftGuid></DraftGuid>';
            xml = xml + '             <OwnerMemberFullName>' + BPMOU + '</OwnerMemberFullName>';
            xml = xml + '            <Action>提交</Action>';
            xml = xml + '          <Comment></Comment>';
            xml = xml + '             <InviteIndicateUsers></InviteIndicateUsers>';
            xml = xml + '       </Header>';
            xml = xml + '       <FormData>';

            xml = xml + '    <BPM_YYZPDZYH_A>';
            xml = xml + '     <fbillno>自动生成</fbillno>';
            xml = xml + '     <fname>' + fname + '</fname>';
            xml = xml + '    <fdept>' + fdept + '</fdept>';
            xml = xml + '   <fdate>' + fdate + '</fdate>';
            xml = xml + '     <ftel>' + ftel + '</ftel>';
            xml = xml + '    <fzgs>' + fzgs + '</fzgs>';
            xml = xml + '    <ffgs>' + ffgs + '</ffgs>';
            xml = xml + '    <fxmlb>' + fxmlb + '</fxmlb>';
            xml = xml + '    <fxmbh>' + fxmbh + '</fxmbh>';
            xml = xml + '   <fxmmc>' + fxmmc + '</fxmmc>';
            xml = xml + '     <famount>' + famount + '</famount>';
            xml = xml + '    <fxmms>' + fxmmc + '</fxmms>';
            xml = xml + '    <fj>' + fjArray.join(";") + '</fj>';
            xml = xml + '     <fhj_shjg>' + fhj_shjg + '</fhj_shjg>';
            xml = xml + '    </BPM_YYZPDZYH_A>';

            if (mxlistArr1.length != 0) {
                for (var i = 0; i < mxlistArr1.length;i++){
                    xml = xml + ' <BPM_YYZPDZYH_B>';
                    xml = xml + '  <RelationRowGuid>'+(i+1)+'</RelationRowGuid>';
                    xml = xml + '  <RowPrimaryKeys></RowPrimaryKeys>';
                    xml = xml + '<fentryno>' + (i + 1) + '</fentryno>';
                    xml = xml + ' <fgys_no>' + mxlistArr1[i].fgys_no + '</fgys_no>';
                    xml = xml + ' <fgys_name>' + mxlistArr1[i].fgys_name + '</fgys_name>';
                    xml = xml + ' <famount>' + mxlistArr1[i].famount + '</famount>';
                    xml = xml + ' <fremark>' + mxlistArr1[i].fremark + '</fremark>';
                    xml = xml + '</BPM_YYZPDZYH_B>';
                }
            } else {
                xml = xml + ' <BPM_YYZPDZYH_B>';
                xml = xml + '  <RelationRowGuid>1</RelationRowGuid>';
                xml = xml + '  <RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + '<fentryno>1</fentryno>';
                xml = xml + ' <fgys_no></fgys_no>';
                xml = xml + ' <fgys_name></fgys_name>';
                xml = xml + ' <famount></famount>';
                xml = xml + ' <fremark></fremark>';
                xml = xml + '</BPM_YYZPDZYH_B>';
            }

            if (mxlistArr2.length != 0) {
                for (var i = 0; i < mxlistArr2.length;i++){
                    xml = xml + '  <BPM_YYZPDZYH_C>';
                    xml = xml + ' <RelationRowGuid>' + mxlistArr1.length+i+1 + '</RelationRowGuid>';
                    xml = xml + ' <RowPrimaryKeys></RowPrimaryKeys>';
                    xml = xml + '  <fgys_name>' + mxlistArr2[i].fgys_name + '</fgys_name>';
                    xml = xml + '  <fggxh>' + mxlistArr2[i].fggxh + '</fggxh>';
                    xml = xml + ' <fdw>' + mxlistArr2[i].fdw + '</fdw>';
                    xml = xml + ' <fsl>' + mxlistArr2[i].fsl + '</fsl>';
                    xml = xml + ' <fdj>' + mxlistArr2[i].fdj + '</fdj>';
                    xml = xml + '  <fshjg>' + mxlistArr2[i].fshjg + '</fshjg>';
                    xml = xml + '</BPM_YYZPDZYH_C>';
                }

            } else {
                xml = xml + '  <BPM_YYZPDZYH_C>';
                xml = xml + ' <RelationRowGuid>' + mxlistArr1.length + i + 1 + '</RelationRowGuid>';
                xml = xml + ' <RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + '  <fgys_name></fgys_name>';
                xml = xml + '  <fggxh></fggxh>';
                xml = xml + ' <fdw></fdw>';
                xml = xml + ' <fsl></fsl>';
                xml = xml + ' <fdj></fdj>';
                xml = xml + '  <fshjg></fshjg>';
                xml = xml + '</BPM_YYZPDZYH_C>';
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
    var ftel = $("#ftel").val();
    var fzgs = $("#fzgs").val();
    var ffgs = $("#ffgs").val();
    var fxmlb = $("#fxmlb").val();
    var fxmbh = $("#fxmbh").val();
    var fxmmc = $("#fxmmc").val();
    var famount = $("#famount").val();
    var fxmms = $("#fxmms").val();
    var fhj_shjg = $("#fhj_shjg").val();
    if (!ftel) {
        mui.toast('请填写联系方式');
        return;
    }
    if (!fxmlb) {
        mui.toast('请选择项目类别');
        return;
    }
    if (!fxmbh) {
        mui.toast('请填写项目编号');
        return;
    }
    if (!fxmmc) {
        mui.toast('请填写项目名称');
        return;
    }
    if (!famount) {
        mui.toast('请填写申请金额');
        return;
    }
    if (!fxmms) {
        mui.toast('请填写项目描述');
        return;
    }
    var mxflag = false;
    var mxlistArr1 = new Array();
    $("#mxlist_gys").find("#mx").each(function () {
        var fgys_no = $(this).find("#fgys_no").val();
        var fgys_name = $(this).find("#fgys_name").val();
        var famount = $(this).find("#famount").val();
        var fremark = $(this).find("#fremark").val();
        if (mxItem_gys(fgys_no, fgys_name, famount, fremark) == null) {
            mxflag = true;
            return;
        }
        var mx = mxItem_gys(fgys_no, fgys_name, famount, fremark);
        mxlistArr1.push(mx);

    });
    var mxlistArr2 = new Array();
    $("#mxlist_bjb").find("#mx").each(function () {
        var fgys_name = $(this).find("#fgys_name").val();
        var fggxh = $(this).find("#fggxh").val();
        var fdw = $(this).find("#fdw").val();
        var fsl = $(this).find("#fsl").val();
        var fdj = $(this).find("#fdj").val();
        var fshjg = $(this).find("#fshjg").val();
        var mx = mxItem_bjb(fgys_name, fggxh, fdw, fsl, fdj, fshjg);
        mxlistArr2.push(mx);
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
            xml = xml + '    <BPM_YYZPDZYH_A>';
            xml = xml + '     <fbillno>' + fbillno + '</fbillno>';
            xml = xml + '     <fname>' + fname + '</fname>';
            xml = xml + '    <fdept>' + fdept + '</fdept>';
            xml = xml + '   <fdate>' + fdate + '</fdate>';
            xml = xml + '     <ftel>' + ftel + '</ftel>';
            xml = xml + '    <fzgs>' + fzgs + '</fzgs>';
            xml = xml + '    <ffgs>' + ffgs + '</ffgs>';
            xml = xml + '    <fxmlb>' + fxmlb + '</fxmlb>';
            xml = xml + '    <fxmbh>' + fxmbh + '</fxmbh>';
            xml = xml + '   <fxmmc>' + fxmmc + '</fxmmc>';
            xml = xml + '     <famount>' + famount + '</famount>';
            xml = xml + '    <fxmms>' + fxmmc + '</fxmms>';
            xml = xml + '    <fj>' + fjArray.join(";") + '</fj>';
            xml = xml + '     <fhj_shjg>' + fhj_shjg + '</fhj_shjg>';
            xml = xml + '    </BPM_YYZPDZYH_A>';

            if (mxlistArr1.length != 0) {
                for (var i = 0; i < mxlistArr1.length; i++) {
                    xml = xml + ' <BPM_YYZPDZYH_B>';
                    xml = xml + '  <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                    xml = xml + '  <RowPrimaryKeys></RowPrimaryKeys>';
                    xml = xml + '<fentryno>' + (i + 1) + '</fentryno>';
                    xml = xml + ' <fgys_no>' + mxlistArr1[i].fgys_no + '</fgys_no>';
                    xml = xml + ' <fgys_name>' + mxlistArr1[i].fgys_name + '</fgys_name>';
                    xml = xml + ' <famount>' + mxlistArr1[i].famount + '</famount>';
                    xml = xml + ' <fremark>' + mxlistArr1[i].fremark + '</fremark>';
                    xml = xml + '</BPM_YYZPDZYH_B>';
                }
            } else {
                xml = xml + ' <BPM_YYZPDZYH_B>';
                xml = xml + '  <RelationRowGuid>1</RelationRowGuid>';
                xml = xml + '  <RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + '<fentryno>1</fentryno>';
                xml = xml + ' <fgys_no></fgys_no>';
                xml = xml + ' <fgys_name></fgys_name>';
                xml = xml + ' <famount></famount>';
                xml = xml + ' <fremark></fremark>';
                xml = xml + '</BPM_YYZPDZYH_B>';
            }

            if (mxlistArr2.length != 0) {
                for (var i = 0; i < mxlistArr2.length; i++) {
                    xml = xml + '  <BPM_YYZPDZYH_C>';
                    xml = xml + ' <RelationRowGuid>' + mxlistArr1.length + i + 1 + '</RelationRowGuid>';
                    xml = xml + ' <RowPrimaryKeys></RowPrimaryKeys>';
                    xml = xml + '  <fgys_name>' + mxlistArr2[i].fgys_name + '</fgys_name>';
                    xml = xml + '  <fggxh>' + mxlistArr2[i].fggxh + '</fggxh>';
                    xml = xml + ' <fdw>' + mxlistArr2[i].fdw + '</fdw>';
                    xml = xml + ' <fsl>' + mxlistArr2[i].fsl + '</fsl>';
                    xml = xml + ' <fdj>' + mxlistArr2[i].fdj + '</fdj>';
                    xml = xml + '  <fshjg>' + mxlistArr2[i].fshjg + '</fshjg>';
                    xml = xml + '</BPM_YYZPDZYH_C>';
                }

            } else {
                xml = xml + '  <BPM_YYZPDZYH_C>';
                xml = xml + ' <RelationRowGuid>' + mxlistArr1.length + i + 1 + '</RelationRowGuid>';
                xml = xml + ' <RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + '  <fgys_name></fgys_name>';
                xml = xml + '  <fggxh></fggxh>';
                xml = xml + ' <fdw></fdw>';
                xml = xml + ' <fsl></fsl>';
                xml = xml + ' <fdj></fdj>';
                xml = xml + '  <fshjg></fshjg>';
                xml = xml + '</BPM_YYZPDZYH_C>';
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
    var ftel = $("#ftel").val();
    var fzgs = $("#fzgs").val();
    var ffgs = $("#ffgs").val();
    var fxmlb = $("#fxmlb").val();
    var fxmbh = $("#fxmbh").val();
    var fxmmc = $("#fxmmc").val();
    var famount = $("#famount").val();
    var fxmms = $("#fxmms").val();
    var fhj_shjg = $("#fhj_shjg").val();

    var mxflag = false;
    var mxlistArr1 = new Array();
    $("#mxlist_gys").find("#mx").each(function () {
        var fgys_no = $(this).find("#fgys_no").val();
        var fgys_name = $(this).find("#fgys_name").val();
        var famount = $(this).find("#famount").val();
        var fremark = $(this).find("#fremark").val();
       
        var mx = mxItem_gys(fgys_no, fgys_name, famount, fremark);
        mxlistArr1.push(mx);

    });
    var mxlistArr2 = new Array();
    $("#mxlist_bjb").find("#mx").each(function () {
        var fgys_name = $(this).find("#fgys_name").val();
        var fggxh = $(this).find("#fggxh").val();
        var fdw = $(this).find("#fdw").val();
        var fsl = $(this).find("#fsl").val();
        var fdj = $(this).find("#fdj").val();
        var fshjg = $(this).find("#fshjg").val();
        var mx = mxItem_bjb(fgys_name, fggxh, fdw, fsl, fdj, fshjg);
        mxlistArr2.push(mx);
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
            xml = xml + '    <BPM_YYZPDZYH_A>';
            xml = xml + '     <fbillno>' + fbillno + '</fbillno>';
            xml = xml + '     <fname>' + fname + '</fname>';
            xml = xml + '    <fdept>' + fdept + '</fdept>';
            xml = xml + '   <fdate>' + fdate + '</fdate>';
            xml = xml + '     <ftel>' + ftel + '</ftel>';
            xml = xml + '    <fzgs>' + fzgs + '</fzgs>';
            xml = xml + '    <ffgs>' + ffgs + '</ffgs>';
            xml = xml + '    <fxmlb>' + fxmlb + '</fxmlb>';
            xml = xml + '    <fxmbh>' + fxmbh + '</fxmbh>';
            xml = xml + '   <fxmmc>' + fxmmc + '</fxmmc>';
            xml = xml + '     <famount>' + famount + '</famount>';
            xml = xml + '    <fxmms>' + fxmmc + '</fxmms>';
            xml = xml + '    <fj>' + fjArray.join(";") + '</fj>';
            xml = xml + '     <fhj_shjg>' + fhj_shjg + '</fhj_shjg>';
            xml = xml + '    </BPM_YYZPDZYH_A>';

            if (mxlistArr1.length != 0) {
                for (var i = 0; i < mxlistArr1.length; i++) {
                    xml = xml + ' <BPM_YYZPDZYH_B>';
                    xml = xml + '  <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                    xml = xml + '  <RowPrimaryKeys>itemid=' + itemidArr1[i] + '</RowPrimaryKeys>';
                    xml = xml + '<fentryno>' + (i + 1) + '</fentryno>';
                    xml = xml + ' <fgys_no>' + mxlistArr1[i].fgys_no + '</fgys_no>';
                    xml = xml + ' <fgys_name>' + mxlistArr1[i].fgys_name + '</fgys_name>';
                    xml = xml + ' <famount>' + mxlistArr1[i].famount + '</famount>';
                    xml = xml + ' <fremark>' + mxlistArr1[i].fremark + '</fremark>';
                    xml = xml + '</BPM_YYZPDZYH_B>';
                }
            } else {
                xml = xml + ' <BPM_YYZPDZYH_B>';
                xml = xml + '  <RelationRowGuid>1</RelationRowGuid>';
                xml = xml + '  <RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + '<fentryno>1</fentryno>';
                xml = xml + ' <fgys_no></fgys_no>';
                xml = xml + ' <fgys_name></fgys_name>';
                xml = xml + ' <famount></famount>';
                xml = xml + ' <fremark></fremark>';
                xml = xml + '</BPM_YYZPDZYH_B>';
            }

            if (mxlistArr2.length != 0) {
                for (var i = 0; i < mxlistArr2.length; i++) {
                    xml = xml + '  <BPM_YYZPDZYH_C>';
                    xml = xml + ' <RelationRowGuid>' + mxlistArr1.length + i + 1 + '</RelationRowGuid>';
                    xml = xml + ' <RowPrimaryKeys>itemid=' + itemidArr2[i] + '</RowPrimaryKeys>';
                    xml = xml + '  <fgys_name>' + mxlistArr2[i].fgys_name + '</fgys_name>';
                    xml = xml + '  <fggxh>' + mxlistArr2[i].fggxh + '</fggxh>';
                    xml = xml + ' <fdw>' + mxlistArr2[i].fdw + '</fdw>';
                    xml = xml + ' <fsl>' + mxlistArr2[i].fsl + '</fsl>';
                    xml = xml + ' <fdj>' + mxlistArr2[i].fdj + '</fdj>';
                    xml = xml + '  <fshjg>' + mxlistArr2[i].fshjg + '</fshjg>';
                    xml = xml + '</BPM_YYZPDZYH_C>';
                }

            } else {
                xml = xml + '  <BPM_YYZPDZYH_C>';
                xml = xml + ' <RelationRowGuid>' + mxlistArr1.length + i + 1 + '</RelationRowGuid>';
                xml = xml + ' <RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + '  <fgys_name></fgys_name>';
                xml = xml + '  <fggxh></fggxh>';
                xml = xml + ' <fdw></fdw>';
                xml = xml + ' <fsl></fsl>';
                xml = xml + ' <fdj></fdj>';
                xml = xml + '  <fshjg></fshjg>';
                xml = xml + '</BPM_YYZPDZYH_C>';
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
    var nodeName = $("#nodeName").val();

    var fname = $("#fname").val();
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();
    var ftel = $("#ftel").val();
    var fzgs = $("#fzgs").val();
    var ffgs = $("#ffgs").val();
    var fxmlb = $("#fxmlb").val();
    var fxmbh = $("#fxmbh").val();
    var fxmmc = $("#fxmmc").val();
    var famount = $("#famount").val();
    var fxmms = $("#fxmms").val();
    var fhj_shjg = $("#fhj_shjg").val();

    var mxflag = false;
    var mxlistArr1 = new Array();
    $("#mxlist_gys").find("#mx").each(function () {
        var fgys_no = $(this).find("#fgys_no").val();
        var fgys_name = $(this).find("#fgys_name").val();
        var famount = $(this).find("#famount").val();
        var fremark = $(this).find("#fremark").val();

        var mx = mxItem_gys(fgys_no, fgys_name, famount, fremark);
        mxlistArr1.push(mx);

    });
    var mxlistArr2 = new Array();
    $("#mxlist_bjb").find("#mx").each(function () {
        var fgys_name = $(this).find("#fgys_name").val();
        var fggxh = $(this).find("#fggxh").val();
        var fdw = $(this).find("#fdw").val();
        var fsl = $(this).find("#fsl").val();
        var fdj = $(this).find("#fdj").val();
        var fshjg = $(this).find("#fshjg").val();
        var mx = mxItem_bjb(fgys_name, fggxh, fdw, fsl, fdj, fshjg);
        mxlistArr2.push(mx);
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
            xml = xml + '    <BPM_YYZPDZYH_A>';
            xml = xml + '     <fbillno>' + fbillno + '</fbillno>';
            xml = xml + '     <fname>' + fname + '</fname>';
            xml = xml + '    <fdept>' + fdept + '</fdept>';
            xml = xml + '   <fdate>' + fdate + '</fdate>';
            xml = xml + '     <ftel>' + ftel + '</ftel>';
            xml = xml + '    <fzgs>' + fzgs + '</fzgs>';
            xml = xml + '    <ffgs>' + ffgs + '</ffgs>';
            xml = xml + '    <fxmlb>' + fxmlb + '</fxmlb>';
            xml = xml + '    <fxmbh>' + fxmbh + '</fxmbh>';
            xml = xml + '   <fxmmc>' + fxmmc + '</fxmmc>';
            xml = xml + '     <famount>' + famount + '</famount>';
            xml = xml + '    <fxmms>' + fxmmc + '</fxmms>';
            xml = xml + '    <fj>' + fjArray.join(";") + '</fj>';
            xml = xml + '     <fhj_shjg>' + fhj_shjg + '</fhj_shjg>';
            xml = xml + '    </BPM_YYZPDZYH_A>';

            if (mxlistArr1.length != 0) {
                for (var i = 0; i < mxlistArr1.length; i++) {
                    xml = xml + ' <BPM_YYZPDZYH_B>';
                    xml = xml + '  <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                    xml = xml + '  <RowPrimaryKeys>itemid=' + itemidArr1[i] + '</RowPrimaryKeys>';
                    xml = xml + '<fentryno>' + (i + 1) + '</fentryno>';
                    xml = xml + ' <fgys_no>' + mxlistArr1[i].fgys_no + '</fgys_no>';
                    xml = xml + ' <fgys_name>' + mxlistArr1[i].fgys_name + '</fgys_name>';
                    xml = xml + ' <famount>' + mxlistArr1[i].famount + '</famount>';
                    xml = xml + ' <fremark>' + mxlistArr1[i].fremark + '</fremark>';
                    xml = xml + '</BPM_YYZPDZYH_B>';
                }
            } else {
                xml = xml + ' <BPM_YYZPDZYH_B>';
                xml = xml + '  <RelationRowGuid>1</RelationRowGuid>';
                xml = xml + '  <RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + '<fentryno>1</fentryno>';
                xml = xml + ' <fgys_no></fgys_no>';
                xml = xml + ' <fgys_name></fgys_name>';
                xml = xml + ' <famount></famount>';
                xml = xml + ' <fremark></fremark>';
                xml = xml + '</BPM_YYZPDZYH_B>';
            }

            if (mxlistArr2.length != 0) {
                for (var i = 0; i < mxlistArr2.length; i++) {
                    xml = xml + '  <BPM_YYZPDZYH_C>';
                    xml = xml + ' <RelationRowGuid>' + mxlistArr1.length + i + 1 + '</RelationRowGuid>';
                    if (String(nodeName).indexOf('比价部') != -1 && String(nodeName).indexOf('知会') == -1) {
                        xml = xml + ' <RowPrimaryKeys></RowPrimaryKeys>';
                    } else {
                        xml = xml + ' <RowPrimaryKeys>itemid=' + itemidArr2[i] + '</RowPrimaryKeys>';
                    }
                    xml = xml + '  <fgys_name>' + mxlistArr2[i].fgys_name + '</fgys_name>';
                    xml = xml + '  <fggxh>' + mxlistArr2[i].fggxh + '</fggxh>';
                    xml = xml + ' <fdw>' + mxlistArr2[i].fdw + '</fdw>';
                    xml = xml + ' <fsl>' + mxlistArr2[i].fsl + '</fsl>';
                    xml = xml + ' <fdj>' + mxlistArr2[i].fdj + '</fdj>';
                    xml = xml + '  <fshjg>' + mxlistArr2[i].fshjg + '</fshjg>';
                    xml = xml + '</BPM_YYZPDZYH_C>';
                }

            } else {
                xml = xml + '  <BPM_YYZPDZYH_C>';
                xml = xml + ' <RelationRowGuid>' + mxlistArr1.length + i + 1 + '</RelationRowGuid>';
                xml = xml + ' <RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + '  <fgys_name></fgys_name>';
                xml = xml + '  <fggxh></fggxh>';
                xml = xml + ' <fdw></fdw>';
                xml = xml + ' <fsl></fsl>';
                xml = xml + ' <fdj></fdj>';
                xml = xml + '  <fshjg></fshjg>';
                xml = xml + '</BPM_YYZPDZYH_C>';
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
        xml = xml + '    <BPM_YYZPDZYH_A>';
        xml = xml + '     <fbillno>' + fbillno + '</fbillno>';
        xml = xml + '     <fname>' + fname + '</fname>';
        xml = xml + '    <fdept>' + fdept + '</fdept>';
        xml = xml + '   <fdate>' + fdate + '</fdate>';
        xml = xml + '     <ftel>' + ftel + '</ftel>';
        xml = xml + '    <fzgs>' + fzgs + '</fzgs>';
        xml = xml + '    <ffgs>' + ffgs + '</ffgs>';
        xml = xml + '    <fxmlb>' + fxmlb + '</fxmlb>';
        xml = xml + '    <fxmbh>' + fxmbh + '</fxmbh>';
        xml = xml + '   <fxmmc>' + fxmmc + '</fxmmc>';
        xml = xml + '     <famount>' + famount + '</famount>';
        xml = xml + '    <fxmms>' + fxmmc + '</fxmms>';
        xml = xml + '    <fj>' + fjArray.join(";") + '</fj>';
        xml = xml + '     <fhj_shjg>' + fhj_shjg + '</fhj_shjg>';
        xml = xml + '    </BPM_YYZPDZYH_A>';

        if (mxlistArr1.length != 0) {
            for (var i = 0; i < mxlistArr1.length; i++) {
                xml = xml + ' <BPM_YYZPDZYH_B>';
                xml = xml + '  <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
               
                xml = xml + '  <RowPrimaryKeys>itemid=' + itemidArr1[i] + '</RowPrimaryKeys>';
                xml = xml + '<fentryno>' + (i + 1) + '</fentryno>';
                xml = xml + ' <fgys_no>' + mxlistArr1[i].fgys_no + '</fgys_no>';
                xml = xml + ' <fgys_name>' + mxlistArr1[i].fgys_name + '</fgys_name>';
                xml = xml + ' <famount>' + mxlistArr1[i].famount + '</famount>';
                xml = xml + ' <fremark>' + mxlistArr1[i].fremark + '</fremark>';
                xml = xml + '</BPM_YYZPDZYH_B>';
            }
        } else {
            xml = xml + ' <BPM_YYZPDZYH_B>';
            xml = xml + '  <RelationRowGuid>1</RelationRowGuid>';
            xml = xml + '  <RowPrimaryKeys></RowPrimaryKeys>';
            xml = xml + '<fentryno>1</fentryno>';
            xml = xml + ' <fgys_no></fgys_no>';
            xml = xml + ' <fgys_name></fgys_name>';
            xml = xml + ' <famount></famount>';
            xml = xml + ' <fremark></fremark>';
            xml = xml + '</BPM_YYZPDZYH_B>';
        }

        if (mxlistArr2.length != 0) {
            for (var i = 0; i < mxlistArr2.length; i++) {
                xml = xml + '  <BPM_YYZPDZYH_C>';
               
                xml = xml + ' <RelationRowGuid>' + mxlistArr1.length + i + 1 + '</RelationRowGuid>';
                if (String(nodeName).indexOf('比价部') != -1 && String(nodeName).indexOf('知会') == -1) {
                    xml = xml + ' <RowPrimaryKeys></RowPrimaryKeys>';
                } else {
                    xml = xml + ' <RowPrimaryKeys>itemid=' + itemidArr2[i] + '</RowPrimaryKeys>';
                }
               
                xml = xml + '  <fgys_name>' + mxlistArr2[i].fgys_name + '</fgys_name>';
                xml = xml + '  <fggxh>' + mxlistArr2[i].fggxh + '</fggxh>';
                xml = xml + ' <fdw>' + mxlistArr2[i].fdw + '</fdw>';
                xml = xml + ' <fsl>' + mxlistArr2[i].fsl + '</fsl>';
                xml = xml + ' <fdj>' + mxlistArr2[i].fdj + '</fdj>';
                xml = xml + '  <fshjg>' + mxlistArr2[i].fshjg + '</fshjg>';
                xml = xml + '</BPM_YYZPDZYH_C>';
            }

        } else {
            xml = xml + '  <BPM_YYZPDZYH_C>';
            xml = xml + ' <RelationRowGuid>' + mxlistArr1.length + i + 1 + '</RelationRowGuid>';
            xml = xml + ' <RowPrimaryKeys></RowPrimaryKeys>';
            xml = xml + '  <fgys_name></fgys_name>';
            xml = xml + '  <fggxh></fggxh>';
            xml = xml + ' <fdw></fdw>';
            xml = xml + ' <fsl></fsl>';
            xml = xml + ' <fdj></fdj>';
            xml = xml + '  <fshjg></fshjg>';
            xml = xml + '</BPM_YYZPDZYH_C>';
        }
        xml = xml + '</FormData>';
        xml = xml + '</XForm>';
        PostXml(xml);
    }
}