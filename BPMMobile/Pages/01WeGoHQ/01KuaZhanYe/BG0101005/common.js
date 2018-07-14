function prepMsg() {

}

function tapEvent() {

}

var fjArray1 = [];
var fjArray2 = [];
var fjArray3 = [];
var fjArray4 = [];
var fjArray5 = [];
function initData(data, flag) {
    var item = data.FormDataSet.集团总部合同评审_主表[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.单号);
    }
    $("#fsqr").val(item.申请人);
    $("#fsqbm").val(item.所属部门);
    $("#fsqgs").val(item.所属公司);
    $("#flxfs").val(item.联系方式);
    $("#fhtlx").val(item.合同类型);
    $("#fhtmc").val(item.合同名称);

    $("#fxshtlx").val(item.销售合同类型);
    $("#fcghtlx").val(item.采购合同类型);
    $("#fqthtlx").val(item.其他合同类别);
    $("#fif_yfk").val(item.是否预付款);
    $("#fsqrq").val(FormatterTimeYMS(item.申请日期));
    $("#fhtlb").val(item.合同类别);

    $("#fcghtlx_djgc").val(item.采购合同类型电子工程);

    $("#fhtcbdw").val(item.合同承办单位);
    $("#fhtlf").val(item.合同另方);
    $("#fglht").val(item.关联合同名称);

    $("#fglhtdh").val(item.关联合同单号);
    $("#fglhtcbdw").val(item.关联合同承办单位);
    $("#fglhtlf").val(item.关联合同另方);
    $("#fhtbde").val(item.合同标的额);
    $("#fhtbde_w").val(item.合同标的额万元);
    $("#fbz").val(item.币种);
    $("#ffksj").val(item.付款时间及方式);
    $("#fazsj").val(item.交货时间);
    $("#fbxq").val(item.保修期);
    $("#ffygx").val(item.法院管辖);
    $("#fhtnr").val(item.合同内容);
    $("#ftbydtk").val(item.特别约定条款);

    if (item.所属公司 == '采购公司') {
        $("#cardS").show();
        $("#cardS2").hide();
        $("#cardS3").hide();
    } else if (item.所属公司 == '高创中心') {
        $("#cardS").hide();
        $("#cardS2").show();
        $("#cardS3").hide();
    } else if (item.所属公司 == '电子工程公司') {
        console.log('合同类型', $("#fcghtlx_djgc").val());
        if (item.合同类型 == '采购合同') {

            $("#cardS3").show();
        } else {
            $("#cardS3").hide();
        }
        $("#cardS").hide();
        $("#cardS2").hide();
       
    } else {
        $("#cardS").hide();
        $("#cardS2").hide();
        $("#cardS3").hide();
    }



    if (item.附件1) {
        var fjtmp = (String)(item.附件1);
        fjArray1 = fjtmp.split(";");
        $.ajax({
            type: 'POST',
            url: '/api/bpm/GetAttachmentsInfo',
            data: { 'fileIds': fjArray1 },
            beforeSend: function (XHR) {
                XHR.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem('ticket'));
            }
        }).done((data) => {

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
                $(".upload-img-list-v1").append(li);


                $(".imgdiv").each(function () {

                    $(this).parent().find(".del.none").hide();

                });




            }
            watch();
            $(".imgdiv").off('tap');
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



        }).fail((e) => {
            console.log(e);
        });
    }

    if (item.附件2) {
        var fjtmp = (String)(item.附件2);
        fjArray2 = fjtmp.split(";");
        $.ajax({
            type: 'POST',
            url: '/api/bpm/GetAttachmentsInfo',
            data: { 'fileIds': fjArray2 },
            beforeSend: function (XHR) {
                XHR.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem('ticket'));
            }
        }).done((data) => {

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
                $(".upload-img-list-v2").append(li);


                $(".imgdiv").each(function () {

                    $(this).parent().find(".del.none").hide();

                });




            }
            watch();
            $(".imgdiv").off('tap');
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



        }).fail((e) => {
            console.log(e);
        });
    }

    if (item.附件3) {
        var fjtmp = (String)(item.附件3);
        fjArray3 = fjtmp.split(";");
        $.ajax({
            type: 'POST',
            url: '/api/bpm/GetAttachmentsInfo',
            data: { 'fileIds': fjArray3 },
            beforeSend: function (XHR) {
                XHR.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem('ticket'));
            }
        }).done((data) => {

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
                $(".upload-img-list-v3").append(li);


                $(".imgdiv").each(function () {

                    $(this).parent().find(".del.none").hide();

                });




            }
            watch();
            $(".imgdiv").off('tap');
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



        }).fail((e) => {
            console.log(e);
        });
    }

    if (item.附件4) {
        var fjtmp = (String)(item.附件4);
        fjArray4 = fjtmp.split(";");
        $.ajax({
            type: 'POST',
            url: '/api/bpm/GetAttachmentsInfo',
            data: { 'fileIds': fjArray4 },
            beforeSend: function (XHR) {
                XHR.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem('ticket'));
            }

        }).done((data) => {

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
                $(".upload-img-list-v4").append(li);


                $(".imgdiv").each(function () {

                    $(this).parent().find(".del.none").hide();

                });




            }
            watch();
            $(".imgdiv").off('tap');
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



        }).fail((e) => {
            console.log(e);
        });
    }

    if (item.附件5) {
        var fjtmp = (String)(item.附件5);
        fjArray5 = fjtmp.split(";");
        $.ajax({
            type: 'POST',
            url: '/api/bpm/GetAttachmentsInfo',
            data: { 'fileIds': fjArray5 },
            beforeSend: function (XHR) {
                XHR.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem('ticket'));
            }

        }).done((data) => {

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
                $(".upload-img-list-v5").append(li);


                $(".imgdiv").each(function () {

                    $(this).parent().find(".del.none").hide();

                });




            }
            watch();
            $(".imgdiv").off('tap');
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



        }).fail((e) => {
            console.log(e);
        });
    }
    var item_c = data.FormDataSet.集团总部合同评审_子表;
    for (var i = 0; i < item_c.length; i++) {
        itemidArr.push(item_c[i].itemid);
        var li = `<div id="mx">
                    <div class="mui-input-row itemtitle">
                        <label>明细列表项</label>
                        <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>
                    </div>
                    <div class="mui-row cutOffLine padding">
                        <div class="mui-col-xs-8" style="display:flex;">
                            <label>合同标的</label>
                            <textarea rows="2" id="fhtbd" readonly>${item_c[i].合同标的}</textarea>
                        </div>
                        <div class="mui-col-xs-2" style="display:flex;">
                            <label>数量</label>
                            <textarea rows="2" id="fsl" readonly>${item_c[i].数量}</textarea>
                        </div>
                        <div class="mui-col-xs-2" style="display:flex;">
                            <label>单价</label>
                            <textarea rows="2" id="fdj" readonly>${item_c[i].单价}</textarea>
                        </div>
                    </div>
                </div>
                 `;
        $("#mxlist").append(li);
    }

   
}


function nodeControllerExp(NodeName) {
    if (String(NodeName).match('开始') != null) {
        mui.alert('请移步网页版BPM处理');
    }
}


function Save() {

}

function reSave() {

}

function hasRead() {
    var pid = $("#stepId").val();
    var fbillno = $("#fbillno").val();
    var comment = '';
    var btnArray = ['取消', '确定'];
    mui.prompt('请选填知会意见', '可以不填', '知会意见', btnArray, function (e) {
        if (e.index == 1) {
            comment = e.value;
            var xml = `<?xml version="1.0"?>
                           <XForm>
                             <Header>
                               <Method>InformSubmit</Method>
                               <PID>${pid}</PID>
                               <Comment>${comment}</Comment>
                             </Header>
                           </XForm>
              `;
            PostXml(xml);
        }
    });
}
class Mx {
    constructor(fhtbd, fsl,fdj) {
        this.fhtbd = fhtbd;
        this.fsl = fsl;
        this.fdj = fdj;
    }
}

function AgreeOrConSign() {
    var pid = $("#stepId").val();
    var fbillno = $("#fbillno").val();
    var comment = $("#signSuggest").val();
    var nodeName = $("#nodeName").val();

    var fsqr = $("#fsqr").val();
    var fsqbm = $("#fsqbm").val();
    var fsqgs = $("#fsqgs").val();
    var flxfs = $("#flxfs").val();
    var fhtlx = $("#fhtlx").val();
    var fhtmc = $("#fhtmc").val();
    var fxshtlx = $("#fxshtlx").val();
    var fcghtlx = $("#fcghtlx").val();
    var fqthtlx = $("#fqthtlx").val();
    var fif_yfk = $("#fif_yfk").val();
    var fsqrq = $("#fsqrq").val();
    var fhtlb = $("#fhtlb").val();
    var fcghtlx_djgc = $("#fcghtlx_djgc").val();
    var fhtcbdw = $("#fhtcbdw").val();
    var fhtlf = $("#fhtlf").val();
    var fglht = $("#fglht").val();
    var fglhtdh = $("#fglhtdh").val();
    var fglhtcbdw = $("#fglhtcbdw").val();
    var fglhtlf = $("#fglhtlf").val();
    var fhtbde = $("#fhtbde").val();
    var fhtbde_w = $("#fhtbde_w").val();
    var fbz = $("#fbz").val();
    var ffksj = $("#ffksj").val();
    var fazsj = $("#fazsj").val();
    var fbxq = $("#fbxq").val();
    var ffygx = $("#ffygx").val();
    var fhtnr = $("#fhtnr").val();
    var ftbydtk = $("#ftbydtk").val();
   
    var mxlistArr = [];
    $("#mxlist").find("#mx").each(function () {

        var fhtbd = $(this).find("#fhtbd").val();
        var fsl = $(this).find("#fsl").val();
        var fdj = $(this).find("#fdj").val();


        var mx = new Mx(fhtbd, fsl, fdj);
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
            var xml = `<?xml version="1.0"?>
                     <XForm>
                     <Header>
                     <Method>Process</Method>
                     <PID>${pid}</PID>
                     <Action>同意</Action>
                     <Comment>${comment}</Comment>
            
                     <ConsignEnabled>true</ConsignEnabled>
                     <ConsignUsers>${consignUserStr}</ConsignUsers>
                     <ConsignRoutingType>${consignRoutingType}</ConsignRoutingType>
                     <ConsignReturnType>${consignReturnType}</ConsignReturnType>
                     <InviteIndicateUsers>[]</InviteIndicateUsers>
                     <Context>{&quot;Routing&quot;:{}}</Context>
                     </Header>
                     <FormData>`;
            xml += `
   <集团总部合同评审_主表>
            <单号>${fbillno}</单号>
            <申请人>${fsqr}</申请人>
            <所属部门>${fsqbm}</所属部门>
            <所属公司>${fsqgs}</所属公司>
            <联系方式>${flxfs}</联系方式>
            <合同类型>${fhtlx}</合同类型>
            <销售合同类型>${fxshtlx}</销售合同类型>
            <采购合同类型>${fcghtlx}</采购合同类型>
            <其他合同类别>${fqthtlx}</其他合同类别>
            <是否预付款>${fif_yfk}</是否预付款>
            <申请日期>${fsqrq}</申请日期>
            <合同类别>${fhtlb}</合同类别>
            <采购合同类型电子工程>${fcghtlx_djgc}</采购合同类型电子工程>
            <合同名称>${fcghtlx_djgc}</合同名称>
            <合同承办单位>${fhtcbdw}</合同承办单位>
            <合同另方>${fhtlf}</合同另方>
            <关联合同名称>${fglht}</关联合同名称>
            <关联合同单号>${fglhtdh}</关联合同单号>
            <关联合同承办单位>${fglhtcbdw}</关联合同承办单位>
            <关联合同另方>${fglhtlf}</关联合同另方>
            <合同标的额>${fhtbde}</合同标的额>
            <合同标的额万元>${fhtbde_w}</合同标的额万元>
            <币种>${fbz}</币种>
            <付款时间及方式>${ffksj}</付款时间及方式>
            <交货时间>${fazsj}</交货时间>
            <保修期>${fbxq}</保修期>
            <法院管辖>${ffygx}</法院管辖>
            <合同内容>${fhtnr}</合同内容>
            <特别约定条款>${ftbydtk}</特别约定条款>
            <附件1>${fjArray1.join(";")}</附件1>
            <附件2>${fjArray2.join(";")}</附件2>
            <附件3>${fjArray3.join(";")}</附件3>
            <附件4>${fjArray4.join(";")}</附件4>
            <附件5>${fjArray5.join(";")}</附件5>
        </集团总部合同评审_主表>
                     `;
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `

 <集团总部合同评审_子表>
            <RelationRowGuid>${i + 1}</RelationRowGuid>
            <RowPrimaryKeys>itemid=${itemidArr[i]}</RowPrimaryKeys>
            <合同标的>${mxlistArr[i].fhtbd}</合同标的>
            <数量>${mxlistArr[i].fsl}</数量>
            <单价>${mxlistArr[i].fdj}</单价>
        </集团总部合同评审_子表>

                       `;
            }
            xml += `
                       </FormData>
                    </XForm>
                   `;
            PostXml(xml);
        })
    } else {
        var xml = `<?xml version="1.0"?>
                   <XForm>
                   <Header>
                   <Method>Process</Method>
                   <PID>${pid}</PID>
                   <Action>同意</Action>
                   <Comment>${comment}</Comment>

                    <UrlParams></UrlParams>
                    <ConsignEnabled>false</ConsignEnabled>
                    <ConsignUsers>[]</ConsignUsers>
                    <ConsignRoutingType>Parallel</ConsignRoutingType>
                    <ConsignReturnType>Return</ConsignReturnType>

                  <InviteIndicateUsers>[]</InviteIndicateUsers>
                  <Context>{&quot;Routing&quot;:{}}</Context>
                  </Header>
                  <FormData>`;

        xml += `
   <集团总部合同评审_主表>
            <单号>${fbillno}</单号>
            <申请人>${fsqr}</申请人>
            <所属部门>${fsqbm}</所属部门>
            <所属公司>${fsqgs}</所属公司>
            <联系方式>${flxfs}</联系方式>
            <合同类型>${fhtlx}</合同类型>
            <销售合同类型>${fxshtlx}</销售合同类型>
            <采购合同类型>${fcghtlx}</采购合同类型>
            <其他合同类别>${fqthtlx}</其他合同类别>
            <是否预付款>${fif_yfk}</是否预付款>
            <申请日期>${fsqrq}</申请日期>
            <合同类别>${fhtlb}</合同类别>
            <采购合同类型电子工程>${fcghtlx_djgc}</采购合同类型电子工程>
            <合同名称>${fcghtlx_djgc}</合同名称>
            <合同承办单位>${fhtcbdw}</合同承办单位>
            <合同另方>${fhtlf}</合同另方>
            <关联合同名称>${fglht}</关联合同名称>
            <关联合同单号>${fglhtdh}</关联合同单号>
            <关联合同承办单位>${fglhtcbdw}</关联合同承办单位>
            <关联合同另方>${fglhtlf}</关联合同另方>
            <合同标的额>${fhtbde}</合同标的额>
            <合同标的额万元>${fhtbde_w}</合同标的额万元>
            <币种>${fbz}</币种>
            <付款时间及方式>${ffksj}</付款时间及方式>
            <交货时间>${fazsj}</交货时间>
            <保修期>${fbxq}</保修期>
            <法院管辖>${ffygx}</法院管辖>
            <合同内容>${fhtnr}</合同内容>
            <特别约定条款>${ftbydtk}</特别约定条款>
            <附件1>${fjArray1.join(";")}</附件1>
            <附件2>${fjArray2.join(";")}</附件2>
            <附件3>${fjArray3.join(";")}</附件3>
            <附件4>${fjArray4.join(";")}</附件4>
            <附件5>${fjArray5.join(";")}</附件5>
        </集团总部合同评审_主表>
                     `;
        for (var i = 0; i < mxlistArr.length; i++) {
            xml += `

 <集团总部合同评审_子表>
            <RelationRowGuid>${i + 1}</RelationRowGuid>
            <RowPrimaryKeys>itemid=${itemidArr[i]}</RowPrimaryKeys>
            <合同标的>${mxlistArr[i].fhtbd}</合同标的>
            <数量>${mxlistArr[i].fsl}</数量>
            <单价>${mxlistArr[i].fdj}</单价>
        </集团总部合同评审_子表>

                       `;
        }
        xml += `
                       </FormData>
                    </XForm>
                   `;
        PostXml(xml);
    }


}