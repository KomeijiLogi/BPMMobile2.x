function prepMsg() {
    $("#fdate").val(getNowFormatDate(2));
    tapEvent();
    var xml = '<?xml version= "1.0" ?>';
    xml = xml + '<Requests>';
    xml = xml + '    <Params>';
    xml = xml + '      <Method>GetFormPostData</Method>';
    xml = xml + '       <ProcessName>医用制品集团安全日常检查反馈</ProcessName>';
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



    $('#tjmx').on('tap', function () {
        var li = '<div id="mx" class="mui-card">';
        li = li + '   <div class="mui-input-row itemtitle">';
        li = li + '      <label>明细列表项</label>';
        li = li + '      <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '      <label for="faqyh">安全隐患<i style="color:red;">*</i></label>';
        li = li + '      <input type="text" id="faqyh" name="faqyh" placeholder="请填写安全隐患"/>';
        li = li + '   </div>';

        li = li + '   <div class="mui-input-row">';
        li = li + '       <label for="fyhdl">隐患大类<i style="color:red;">*</i></label>';
        li = li + '       <input type="text" id="fyhdl" name="fyhdl" readonly="readonly" placeholder="请选择隐患大类"/>';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '       <label for="fyhxl">隐患小类<i style="color:red;">*</i></label>';
        li = li + '       <input type="text" id="fyhxl" name="fyhxl" readonly="readonly" placeholder="请选择隐患小类"/>';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '      <label for="fzgcs">整改措施<i style="color:red;">*</i></label>';
        li = li + '      <input type="text" id="fzgcs" name="fzgcs" placeholder="请填写整改措施"/>';
        li = li + '   </div>';

        li = li + '   <div class="mui-input-row" style="height:3.5rem;overflow:scroll;" id="uploaddiv-a" class="up">';
        li = li + '      <div class="border border-t upload-img" style="top:0rem;">';               
        li = li + '        <div class="clearfix upload-btn" id="children-bg">';
        li = li + '           <label class="label">附件</label>';
        li = li + '           <span class="tips" id="imageCount"><!--已添加0张--></span>';                  
        li = li + '           <span class="upload-addbtn" >';
        li = li + '              <input type="file" accept="image/jpeg,image/jpg,image/png,image/jp2,image/bmp" id="file" style="opacity:0;">';
        li = li + '           </span>';
        li = li + '       </div>';
        li = li + '       <div class="upload-img-list-a"></div>';
        li = li + '     </div>';
        li = li + '   </div>';

        li = li + '   <div class="mui-input-row" style="height:3.5rem;overflow:scroll;" id="uploaddiv-b" class="up">';
        li = li + '      <div class="border border-t upload-img" style="top:0rem;">';
        li = li + '        <div class="clearfix upload-btn" id="children-bg">';
        li = li + '           <label class="label">附件</label>';
        li = li + '           <span class="tips" id="imageCount"><!--已添加0张--></span>';
        li = li + '           <span class="upload-addbtn">';
        li = li + '              <input type="file" accept="image/jpeg,image/jpg,image/png,image/jp2,image/bmp" id="file" style="opacity:0;">';
        li = li + '           </span>';
        li = li + '       </div>';
        li = li + '       <div class="upload-img-list-b"></div>';
        li = li + '     </div>';
        li = li + '   </div>';


        li = li + '   <div class="mui-input-row">';
        li = li + '      <label for="fifwc">是否整改完成<i style="color:red;">*</i></label>';
        li = li + '      <input type="text" id="fifwc" name="fifwc" readonly="readonly" placeholder="请选择是否整改完成"/>';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '      <label for="fwcrq">完成整改日期<i style="color:red;">*</i></label>';
        li = li + '      <input type="date" id="fwcrq" name="fwcrq" />';
        li = li + '   </div>';
        li = li + '</div>';
        $("#mxlist").append(li);
        //$("#mxlist").find("#uploaddiv-a").each(function () {
        //    $(this).on('tap', function () {
        //        $(".up").attr('id', 'uploaddiv-a');
        //        $('.upload-img-list').addClass('upload-img-list-c').removeClass('upload-img-list');
        //        $("input[type='file']").attr('id', 'file1');
        //        $(this).find(("input[type='file']")).attr('id', 'file');
        //        $(this).attr('id', 'uploaddiv');
        //        $(this).find('.upload-img-list-a').addClass('upload-img-list').removeClass('upload-img-list-a');
        //        upload();
        //    });
        //});
    });
}


function mxItem(faqyh, fyhdl, fyhxl, fzgcs, fifwc, fwcrq) {

    var mx = Object.create({
        faqyh: faqyh,
        fyhdl: fyhdl,
        fyhxl: fyhxl,
        fzgcs: fzgcs,
        fifwc: fifwc,
        fwcrq: fwcrq,
        _check: function () {
            return mx;
        }

    });
    return mx._check();
}

var fjArrayErDimension1 = new Array();
var fjArrayErDimension2 = new Array();
function initData(data, flag) {
    var item = data.FormDataSet.BPM_YYZPJTAQRCJCFK_A[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.fbillno);
    }
    $("#fname").val(item.fname);
    $("#fdate").val(FormatterTimeYMS(item.fdate));

    $("#fdept").val(item.fdept);
    $("#ftel").val(item.ftel);
    $("#fzgs").val(item.fzgs);
    $("#ffgas").val(item.ffgas);
    $("#fif_aqyh").val(item.fifyyh);
    $("#fjcrlx").val(item.fjcrlx);
    $("#fif_aqyhd").addClass('mui-active');
    var n = 0;

    var item_c = data.FormDataSet.BPM_YYZPJTAQRCJCFK_B;
    for (var i = 0; i < item_c.length; i++){
        itemidArr.push(item_c[i].itemid);

        var li = '<div id="mx" class="mui-card">';
        li = li + '   <div class="mui-input-row itemtitle">';
        li = li + '      <label>明细列表项</label>';
        li = li + '      <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '      <label for="faqyh">安全隐患<i style="color:red;">*</i></label>';
        li = li + '      <input type="text" id="faqyh" name="faqyh" readonly="readonly" value="' + item_c[i].faqyh + '"/>';
        li = li + '   </div>';

        li = li + '   <div class="mui-input-row">';
        li = li + '       <label for="fyhdl">隐患大类<i style="color:red;">*</i></label>';
        li = li + '       <input type="text" id="fyhdl" name="fyhdl" readonly="readonly" value="' + item_c[i].fyhdl + '"/>';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '       <label for="fyhxl">隐患小类<i style="color:red;">*</i></label>';
        li = li + '       <input type="text" id="fyhxl" name="fyhxl" readonly="readonly" value="' + item_c[i].fyhxl + '"/>';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '      <label for="fzgcs">整改措施<i style="color:red;">*</i></label>';
        li = li + '      <input type="text" id="fzgcs" name="fzgcs" readonly="readonly" value="' + item_c[i].fzgcs + '"/>';
        li = li + '   </div>';


        li = li + '   <div class="mui-input-row" style="height:3.5rem;overflow:scroll;" id="uploaddiv-a" class="up">';
        li = li + '      <div class="border border-t upload-img" style="top:0rem;">';
        li = li + '        <div class="clearfix upload-btn" id="children-bg">';
        li = li + '           <label class="label">整改前照片</label>';
        li = li + '           <span class="tips" id="imageCount"><!--已添加0张--></span>';
        li = li + '           <span class="upload-addbtn"  style="display:none;">';
        li = li + '              <input type="file" accept="image/jpeg,image/jpg,image/png,image/jp2,image/bmp" id="file" style="opacity:0;">';
        li = li + '           </span>';
        li = li + '       </div>';
        li = li + '       <div class="upload-img-list-a"  id="div' + i +'"></div>';
        li = li + '     </div>';
        li = li + '   </div>';

        li = li + '   <div class="mui-input-row" style="height:3.5rem;overflow:scroll;" id="uploaddiv-b" class="up">';
        li = li + '      <div class="border border-t upload-img" style="top:0rem;">';
        li = li + '        <div class="clearfix upload-btn" id="children-bg">';
        li = li + '           <label class="label">整改后照片</label>';
        li = li + '           <span class="tips" id="imageCount"><!--已添加0张--></span>';
        li = li + '           <span class="upload-addbtn" style="display:none;">';
        li = li + '              <input type="file" accept="image/jpeg,image/jpg,image/png,image/jp2,image/bmp" id="file" style="opacity:0;">';
        li = li + '           </span>';
        li = li + '       </div>';
        li = li + '       <div class="upload-img-list-b"  id="div' + i +'"></div>';
        li = li + '     </div>';
        li = li + '   </div>';


        li = li + '   <div class="mui-input-row">';
        li = li + '      <label for="fifwc">是否整改完成<i style="color:red;">*</i></label>';
        li = li + '      <input type="text" id="fifwc" name="fifwc" readonly="readonly" value="' + item_c[i].fifwc + '"/>';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '      <label for="fwcrq">完成整改日期<i style="color:red;">*</i></label>';
        li = li + '      <input type="date" id="fwcrq" name="fwcrq" readonly="readonly" value="' + FormatterTimeYMS(item_c[i].fwcrq )+ '"/>';
        li = li + '   </div>';
        li = li + '</div>';
        $("#mxlist").append(li);
        var tmpli = li;
       
        n = i;
        if (item_c[i].fzgqzp != null && item_c[i].fzgqzp != "") {
            var fjtmp = (String)(item_c[i].fzgqzp);

            fjArray = fjtmp.split(";");
            fjArrayErDimension1.push(fjArray);
            //请求附件详细信息
            $.ajax({
                type: 'POST',
                url: '/api/bpm/GetAttachmentsInfo',
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

                                li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '" ><img src="http://app.weigaogroup.com:8040/BPM/YZSoft/Attachment/default.ashx?' + data[i].FileID + '"/></div>';
                                //li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '" ><img src="http://172.16.7.7/BPM/YZSoft/Attachment/default.ashx?201709180005"/></div>';

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

                                li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '"><img src="../../../../Content/images/txt@2x.png"/></div>';

                            } else {
                                li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '"><img src="../../../../Content/images/unkown@2x.png"/></div>';
                            }

                            li = li + ' </div>';
                            li = li + '</div>';

                            $('#mxlist').find(".upload-img-list-a").each(function (index, element) {
                                //console.log(index);

                                if (String($(this)[0].id).indexOf(n) != -1) {

                                    $(this).append(li);
                                }


                            });


                            $(".imgdiv").each(function () {

                                $(this).parent().find(".del.none").hide();

                            });


                        }
                        watch();
                        $(".imgdiv").off('tap');
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


        if (item_c[i].fzghzp != null && item_c[i].fzghzp != "") {
            var fjtmp = (String)(item_c[i].fzghzp);

            fjArray = fjtmp.split(";");
            fjArrayErDimension2.push(fjArray);
            //请求附件详细信息
            $.ajax({
                type: 'POST',
                url: '/api/bpm/GetAttachmentsInfo',
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

                                li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '" ><img src="http://app.weigaogroup.com:8040/BPM/YZSoft/Attachment/default.ashx?' + data[i].FileID + '"/></div>';
                                //li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '" ><img src="http://172.16.7.7/BPM/YZSoft/Attachment/default.ashx?201709180005"/></div>';

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

                                li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '"><img src="../../../../Content/images/txt@2x.png"/></div>';

                            } else {
                                li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '"><img src="../../../../Content/images/unkown@2x.png"/></div>';
                            }

                            li = li + ' </div>';
                            li = li + '</div>';

                            $('#mxlist').find(".upload-img-list-b").each(function (index, element) {
                                //console.log(index);

                                if (String($(this)[0].id).indexOf(n) != -1) {

                                    $(this).append(li);
                                }


                            });


                            $(".imgdiv").each(function () {

                                $(this).parent().find(".del.none").hide();

                            });


                        }
                        watch();
                        $(".imgdiv").off('tap');
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
}
function nodeControllerExp(NodeName) {
    if (NodeName == '开始') {
        mui.alert('请到BPM上处理');
    }
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
   



}
function reSave() {

}


function hasRead() {
    var pid = $("#stepId").val();
    var fbillno = $("#fbillno").val();

    var fname = $("#fname").val();
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();
    var ftel = $("#ftel").val();
    var fzgs = $("#fzgs").val();
    var ffgas = $("#ffgas").val();
    var fifyyh = $("#fif_aqyh").val();
    var fjcrlx = $("#fjcrlx").val();


    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var faqyh = $(this).find("#faqyh").val();
        var fyhdl = $(this).find("#fyhdl").val();
        var fyhxl = $(this).find("#fyhxl").val();
        var fzgcs = $(this).find("#fzgcs").val();
        var fifwc = $(this).find("#fifwc").val();
        var fwcrq = $(this).find("#fwcrq").val();

        var mx = mxItem(faqyh, fyhdl, fyhxl, fzgcs, fifwc, fwcrq);
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

            xml = xml + '<BPM_YYZPJTAQRCJCFK_A>';
            xml = xml + '  <fbillno>' + fbillno + '</fbillno>';
            xml = xml + ' <fname>' + fname + '</fname>';
            xml = xml + ' <fdept>' + fdept + '</fdept>';
            xml = xml + ' <fdate>' + fdate + '</fdate>';
            xml = xml + ' <ftel>' + ftel + '</ftel>';
            xml = xml + ' <fzgs>' + fzgs + '</fzgs>';
            xml = xml + ' <ffgas>' + ffgas + '</ffgas>';
            xml = xml + '  <fifyyh>' + fifyyh + '</fifyyh>';
            xml = xml + '  <fjcrlx>' + fjcrlx + '</fjcrlx>';
            xml = xml + ' </BPM_YYZPJTAQRCJCFK_A>';

            for (var i = 0; i < mxlistArr.length;i++){
                xml = xml + '<BPM_YYZPJTAQRCJCFK_B>';
                xml = xml + ' <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml = xml + ' <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
                xml = xml + ' <fentryrno>' + (i + 1) + '</fentryrno>';
                xml = xml + '  <faqyh>' + mxlistArr[i].faqyh + '</faqyh>';
                xml = xml + '  <fyhdl>' + mxlistArr[i].fyhdl + '</fyhdl>';
                xml = xml + '  <fyhxl>' + mxlistArr[i].fyhxl + '</fyhxl>';
                xml = xml + ' <fzgcs>' + mxlistArr[i].fzgcs + '</fzgcs>';
                xml = xml + ' <fzgqzp>' + (Array)(fjArrayErDimension1[i]).join(";") + '</fzgqzp>';
                xml = xml + '  <fzghzp>' + (Array)(fjArrayErDimension2[i]).join(";") + '</fzghzp>';
                xml = xml + '  <fifwc>' + mxlistArr[i].fifwc + '</fifwc>';
                xml = xml + '  <fwcrq>' + mxlistArr[i].fwcrq + '</fwcrq>';
                xml = xml + ' </BPM_YYZPJTAQRCJCFK_B>';
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
    var ftel = $("#ftel").val();
    var fzgs = $("#fzgs").val();
    var ffgas = $("#ffgas").val();
    var fifyyh = $("#fif_aqyh").val();
    var fjcrlx = $("#fjcrlx").val();


    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var faqyh = $(this).find("#faqyh").val();
        var fyhdl = $(this).find("#fyhdl").val();
        var fyhxl = $(this).find("#fyhxl").val();
        var fzgcs = $(this).find("#fzgcs").val();
        var fifwc = $(this).find("#fifwc").val();
        var fwcrq = $(this).find("#fwcrq").val();

        var mx = mxItem(faqyh, fyhdl, fyhxl, fzgcs, fifwc, fwcrq);
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
            xml = xml + '<Action>确认</Action>';
            xml = xml + '<Comment>' + comment + '</Comment>';

            //加签差异部分
            xml = xml + '<ConsignEnabled>True</ConsignEnabled>';
            xml = xml + '<ConsignUsers>' + consignUserStr + '</ConsignUsers>';
            xml = xml + '<ConsignRoutingType>' + consignRoutingType + '</ConsignRoutingType>';
            xml = xml + '<ConsignReturnType>' + consignReturnType + '</ConsignReturnType>';

            xml = xml + '<InviteIndicateUsers></InviteIndicateUsers>';
            xml = xml + '</Header>';
            xml = xml + '<FormData>';
            xml = xml + '<BPM_YYZPJTAQRCJCFK_A>';
            xml = xml + '  <fbillno>' + fbillno + '</fbillno>';
            xml = xml + ' <fname>' + fname + '</fname>';
            xml = xml + ' <fdept>' + fdept + '</fdept>';
            xml = xml + ' <fdate>' + fdate + '</fdate>';
            xml = xml + ' <ftel>' + ftel + '</ftel>';
            xml = xml + ' <fzgs>' + fzgs + '</fzgs>';
            xml = xml + ' <ffgas>' + ffgas + '</ffgas>';
            xml = xml + '  <fifyyh>' + fifyyh + '</fifyyh>';
            xml = xml + '  <fjcrlx>' + fjcrlx + '</fjcrlx>';
            xml = xml + ' </BPM_YYZPJTAQRCJCFK_A>';

            for (var i = 0; i < mxlistArr.length; i++) {
                xml = xml + '<BPM_YYZPJTAQRCJCFK_B>';
                xml = xml + ' <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml = xml + ' <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
                xml = xml + ' <fentryrno>' + (i + 1) + '</fentryrno>';
                xml = xml + '  <faqyh>' + mxlistArr[i].faqyh + '</faqyh>';
                xml = xml + '  <fyhdl>' + mxlistArr[i].fyhdl + '</fyhdl>';
                xml = xml + '  <fyhxl>' + mxlistArr[i].fyhxl + '</fyhxl>';
                xml = xml + ' <fzgcs>' + mxlistArr[i].fzgcs + '</fzgcs>';
                xml = xml + ' <fzgqzp>' + (Array)(fjArrayErDimension1[i]).join(";") + '</fzgqzp>';
                xml = xml + '  <fzghzp>' + (Array)(fjArrayErDimension2[i]).join(";") + '</fzghzp>';
                xml = xml + '  <fifwc>' + mxlistArr[i].fifwc + '</fifwc>';
                xml = xml + '  <fwcrq>' + mxlistArr[i].fwcrq + '</fwcrq>';
                xml = xml + ' </BPM_YYZPJTAQRCJCFK_B>';
            }

            xml = xml + '</FormData>';
            xml = xml + '</XForm>';
            PostXml(xml);
        })
    } else {
        var xml = '<?xml version="1.0"?>';
        xml = xml + '<XForm>';
        xml = xml + '<Header>';
        xml = xml + '<Method>Process</Method>';
        xml = xml + '<PID>' + pid + '</PID>';
        xml = xml + '<Action>确认</Action>';
        xml = xml + '<Comment>' + comment + '</Comment>';

     

        xml = xml + '<InviteIndicateUsers></InviteIndicateUsers>';
        xml = xml + '</Header>';
        xml = xml + '<FormData>';
        xml = xml + '<BPM_YYZPJTAQRCJCFK_A>';
        xml = xml + '  <fbillno>' + fbillno + '</fbillno>';
        xml = xml + ' <fname>' + fname + '</fname>';
        xml = xml + ' <fdept>' + fdept + '</fdept>';
        xml = xml + ' <fdate>' + fdate + '</fdate>';
        xml = xml + ' <ftel>' + ftel + '</ftel>';
        xml = xml + ' <fzgs>' + fzgs + '</fzgs>';
        xml = xml + ' <ffgas>' + ffgas + '</ffgas>';
        xml = xml + '  <fifyyh>' + fifyyh + '</fifyyh>';
        xml = xml + '  <fjcrlx>' + fjcrlx + '</fjcrlx>';
        xml = xml + ' </BPM_YYZPJTAQRCJCFK_A>';

        for (var i = 0; i < mxlistArr.length; i++) {
            xml = xml + '<BPM_YYZPJTAQRCJCFK_B>';
            xml = xml + ' <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
            xml = xml + ' <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
            xml = xml + ' <fentryrno>' + (i + 1) + '</fentryrno>';
            xml = xml + '  <faqyh>' + mxlistArr[i].faqyh + '</faqyh>';
            xml = xml + '  <fyhdl>' + mxlistArr[i].fyhdl + '</fyhdl>';
            xml = xml + '  <fyhxl>' + mxlistArr[i].fyhxl + '</fyhxl>';
            xml = xml + ' <fzgcs>' + mxlistArr[i].fzgcs + '</fzgcs>';
            xml = xml + ' <fzgqzp>' + (Array)(fjArrayErDimension1[i]).join(";") + '</fzgqzp>';
            xml = xml + '  <fzghzp>' + (Array)(fjArrayErDimension2[i]).join(";") + '</fzghzp>';
            xml = xml + '  <fifwc>' + mxlistArr[i].fifwc + '</fifwc>';
            xml = xml + '  <fwcrq>' + mxlistArr[i].fwcrq + '</fwcrq>';
            xml = xml + ' </BPM_YYZPJTAQRCJCFK_B>';
        }

        xml = xml + '</FormData>';
        xml = xml + '</XForm>';
        PostXml(xml);
    }
}