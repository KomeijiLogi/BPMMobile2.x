function prepMsg() {

    $("#fdate").val(getNowFormatDate(2));
    tapEvent();
    upload();
    var xml = `<?xml version= "1.0" ?>
                  <Requests>
                      <Params>
                      <Method>GetFormPostData</Method>
                      <ProcessName>医用制品集团公章使用申请</ProcessName>
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
        $("#fname").val(item.申请人);
        $("#fdept").val(item.部门);
        $("#fcompany").val(item.所属公司);
    }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
        if (XMLHttpRequest.status == "401") {
            mui.alert('授权过期，请重新打开页面');;
        } else if (XMLHttpRequest.status == "500") {
            mui.alert('服务器内部错误');
        }

    });
}
function tapEvent() {

    var fgzgsdata = [
        {
            value: '',
            text:'医用材料公司'
        },
        {
            value: '',
            text:'自动化公司'
        },
        {
            value: '',
            text:'模具公司'
        }
    ];

    showPicker('fgzgs', fgzgsdata);



}

function initData(data, flag) {
    var item = data.FormDataSet.医用制品集团公章使用申请表[0];
    if (flag) {

        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.fbillno);

    }
    $("#fname").val(item.申请人);
    $("#fcompany").val(item.所属公司);
    $("#fdept").val(item.部门);
    $("#fdate").val(FormatterTimeYMS(item.申请日期));
    $("#flxfs").val(item.联系方式);
    $("#fsycs").val(item.使用份数);
    $("#fnr").val(item.内容及用途);
    $("#fgzgs").val(item.公章公司);
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
        tapEvent();
        $("#flxfs,#fsycs,#fnr").removeAttr('readonly');
        upload();

    }
}

function Save() {

    var fname = $("#fname").val();
    var fcompany = $("#fcompany").val();
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();
    var flxfs = $("#flxfs").val();
    var fsycs = $("#fsycs").val();
    var fnr = $("#fnr").val();
    var fgzgs = $("#fgzgs").val();
    if (!flxfs) {
        mui.toast('请填写联系方式');
        return;
    }
    if (!fsycs) {
        mui.toast('请填写使用次数');
        return;
    }
    if (!fgzgs) {
        mui.toast('请填写公章公司');
        return;
    }
    if (!fnr) {
        mui.toast('请填写内容及用途');
        return;
    }
    if (fjArray.length == 0) {
        mui.toast('请上传附件');
        return;
    }
    var btnArry = ["取消", "确定"];
    mui.confirm('即将提交，是否确定？', '提交确认提醒', btnArry, function (e) {
        if (e.index == 1) {
            var xml = `<?xml version="1.0"?>
                        <XForm>
                            <Header>
                                <Method>Post</Method>
                                <ProcessName>医用制品集团公章使用申请</ProcessName>
                                <ProcessVersion>${version}</ProcessVersion>
                                <DraftGuid></DraftGuid>
                                <OwnerMemberFullName>${BPMOU}</OwnerMemberFullName>
                                <Action>提交</Action>
                                <Comment></Comment>
                                <UrlParams></UrlParams>
                                <ConsignEnabled>false</ConsignEnabled>
                                <ConsignUsers>[]</ConsignUsers>
                                <ConsignRoutingType>Parallel</ConsignRoutingType>
                                <ConsignReturnType>Return</ConsignReturnType>
                                <InviteIndicateUsers>[]</InviteIndicateUsers>
                                <Context>{&quot;Routing&quot;:{}}</Context>
                            </Header>
                           <FormData>
                                 <医用制品集团公章使用申请表>
                                    <单号>自动带出</单号>
                                    <申请人>${fname}</申请人>
                                    <所属公司>${fcompany}</所属公司>
                                    <部门>${fdept}</部门>
                                    <申请日期>${fdate}</申请日期>
                                    <联系方式>${flxfs}</联系方式>
                                    <使用份数>${fsycs}</使用份数>
                                    <内容及用途>${fnr}</内容及用途>
                                      <公章公司>${fgzgs}</公章公司>  
                                    <附件>${fjArray.join(";")}</附件>
                                </医用制品集团公章使用申请表>
                        </FormData>
                    </XForm>
                      `;
            PostXml(xml);
        }
    });
}
function reSave() {

    var fbillno = $("#fbillno").val();
    var pid = $("#stepId").val();
    
    var fname = $("#fname").val();
    var fcompany = $("#fcompany").val();
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();
    var flxfs = $("#flxfs").val();
    var fsycs = $("#fsycs").val();
    var fnr = $("#fnr").val();
    var fgzgs = $("#fgzgs").val();
    if (!flxfs) {
        mui.toast('请填写联系方式');
        return;
    }
    if (!fsycs) {
        mui.toast('请填写使用次数');
        return;
    }
    if (!fgzgs) {
        mui.toast('请填写公章公司');
        return;
    }
    if (!fnr) {
        mui.toast('请填写内容及用途');
        return;
    }
    if (fjArray.length == 0) {
        mui.toast('请上传附件');
        return;
    }

    var btnArry = ["取消", "确定"];
    mui.confirm('即将提交，是否确定？', '提交确认提醒', btnArry, function (e) {
        if (e.index == 1) {
            var xml = `<?xml version="1.0"?>
                         <XForm>
                           <Header>
                             <Method>Process</Method>
                             <PID>${pid}</PID>
                             <Action>提交</Action>
                              <Comment></Comment>
                             <InviteIndicateUsers></InviteIndicateUsers>
                           </Header>
                           <FormData>
                               <医用制品集团公章使用申请表>
                                    <单号>${fbillno}</单号>
                                    <申请人>${fname}</申请人>
                                    <所属公司>${fcompany}</所属公司>
                                    <部门>${fdept}</部门>
                                    <申请日期>${fdate}</申请日期>
                                    <联系方式>${flxfs}</联系方式>
                                    <使用份数>${fsycs}</使用份数>
                                    <内容及用途>${fnr}</内容及用途>
                                     <公章公司>${fgzgs}</公章公司>  
                                    <附件>${fjArray.join(";")}</附件>
                                </医用制品集团公章使用申请表>
                        </FormData>
                    </XForm>
                      `;
            PostXml(xml);
        }
    });
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

function AgreeOrConSign() {

    var pid = $("#stepId").val();
    var fbillno = $("#fbillno").val();
    var comment = $("#signSuggest").val();
    var nodeName = $("#nodeName").val();

    var fname = $("#fname").val();
    var fcompany = $("#fcompany").val();
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();
    var flxfs = $("#flxfs").val();
    var fsycs = $("#fsycs").val();
    var fnr = $("#fnr").val();
    var fgzgs = $("#fgzgs").val();

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
                     </Header>';
                     <FormData>`;
            xml += `
                              <医用制品集团公章使用申请表>
                                    <单号>${fbillno}</单号>
                                    <申请人>${fname}</申请人>
                                    <所属公司>${fcompany}</所属公司>
                                    <部门>${fdept}</部门>
                                    <申请日期>${fdate}</申请日期>
                                    <联系方式>${flxfs}</联系方式>
                                    <使用份数>${fsycs}</使用份数>
                                    <内容及用途>${fnr}</内容及用途>
                                      <公章公司>${fgzgs}</公章公司>  
                                    <附件>${fjArray.join(";")}</附件>
                                </医用制品集团公章使用申请表>
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
                              <医用制品集团公章使用申请表>
                                    <单号>${fbillno}</单号>
                                    <申请人>${fname}</申请人>
                                    <所属公司>${fcompany}</所属公司>
                                    <部门>${fdept}</部门>
                                    <申请日期>${fdate}</申请日期>
                                    <联系方式>${flxfs}</联系方式>
                                    <使用份数>${fsycs}</使用份数>
                                    <内容及用途>${fnr}</内容及用途>
                                     <公章公司>${fgzgs}</公章公司>  
                                    <附件>${fjArray.join(";")}</附件>
                                </医用制品集团公章使用申请表>
                        </FormData>
                    </XForm>
                   `;
        PostXml(xml);
    }
}
