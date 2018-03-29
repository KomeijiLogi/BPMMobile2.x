function prepMsg() {
    $("#fdate").val(getNowFormatDate(2));
    tapEvent();
    var xml = `<?xml version= "1.0" ?>
                  <Requests>
                      <Params>
                      <Method>GetFormPostData</Method>
                      <ProcessName>食品餐饮公司供应商准入申请</ProcessName>
                      <ProcessVersion>${version}</ProcessVersion>
                      <Owner></Owner>
                      </Params>   
                  </Requests>
              `;
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
    }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
        if (XMLHttpRequest.status == "401") {
            mui.alert('授权过期，请重新打开页面');;
        } else if (XMLHttpRequest.status == "500") {
            mui.alert('服务器内部错误');
        }

        });
    upload();
}

function tapEvent() {

}

function initData(data, flag) {
    var item = data.FormDataSet.BPM_LYCY_GYSZR[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.fbillno);
    }
    $("#fname").val(item.fname);
    $("#fdept").val(item.fdept);
    $("#fdate").val(FormatterTimeYMS(item.fdate));
    $("#fgys_name").val(item.fgys_name);
    $("#fgys_addr").val(item.fgys_addr);
    $("#fgys_lxr").val(item.fgys_lxr);
    $("#fgys_tel").val(item.fgys_tel);
    $("#fsxq").val(item.fsxq);
    $("#ffld").val(item.ffld);
    $("#fkhh").val(item.fkhh);
    $("#fkhhmc").val(item.fkhhmc);
    $("#fyhzh").val(item.fyhzh);
    $("#fyyzzh").val(item.fyyzzh);
    $("#fcpfw").val(item.fcpfw);
    $("#ftbly").val(item.ftbly);
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
                        $(".upload-img-list").append(li);


                        $(".imgdiv").each(function () {

                            $(this).parent().find(".del.none").hide();

                        });




                    }
                    watch();
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
    if (String(NodeName).match('开始') != null) {
        $("textarea").removeAttr('readonly');
        $(".upload-addbtn").show();
        upload();
    }
}

function Save() {
    var fname = $("#fname").val();
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();
    var fgys_name = $("#fgys_name").val();
    var fgys_addr = $("#fgys_addr").val();
    var fgys_lxr = $("#fgys_lxr").val();
    var fgys_tel = $("#fgys_tel").val();
    var fsxq = $("#fsxq").val();
    var ffld = $("#ffld").val();

    var fkhh = $("#fkhh").val();
    var fkhhmc = $("#fkhhmc").val();
    var fyhzh = $("#fyhzh").val();
    var fyyzzh = $("#fyyzzh").val();
    var fcpfw = $("#fcpfw").val();
    var ftbly = $("#ftbly").val();

    if (!fgys_name){
        mui.toast('请填写供应商名称');
        return;
    }
    if (!fgys_addr) {
        mui.toast('请填写供应商地址');
        return;
    }
    if (!fgys_lxr) {
        mui.toast('请填写联系人');
        return;
    }
    if (!fgys_tel) {
        mui.toast('请填写联系电话');
        return;
    }
    if (!fsxq) {
        mui.toast('请填写授信期');
        return;
    }
    if (!ffld) {
        mui.toast('');
        return;
    }

}
function reSave() {

}

function hasRead() {

}
function AgreeOrConSign() {

}