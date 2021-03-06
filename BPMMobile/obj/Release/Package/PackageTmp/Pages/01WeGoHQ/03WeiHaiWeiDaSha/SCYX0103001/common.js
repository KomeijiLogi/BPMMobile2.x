﻿function prepMsg() {
    upload();
    $("#fdate").val(getNowFormatDate(2));
    var xml = `<?xml version= "1.0" ?>
               <Requests>
               <Params>
               <Method>GetFormPostData</Method>
               <ProcessName>威海卫大厦部门营销方案申请</ProcessName>
               <ProcessVersion>${version}</ProcessVersion>
               <Owner></Owner>
               </Params>
               </Requests>
    `;
    dataProvider(xml, function (data) {
        var provideData = JSON.parse(unescape(data.replace(/\\(u[0-9a-fA-F]{4})/gm, '%$1')));
        console.log(provideData);
        var item = provideData.Tables[0].Rows[0];
        $("#fname").val(item.提报人);
        $("#fdept").val(item.提报部门);
    });
}
function dataProvider(xml, callback) {

    var p = new Promise(function (resolve, reject) {
        $.ajax({
            type: "POST",
            url: "/api/bpm/DataProvider",
            data: { '': xml },
            beforeSend: function (XHR) {
                XHR.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem('ticket'));
            }
        }).done(function (data) {
            callback(data);
            resolve();
        }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
            if (XMLHttpRequest.status == "401") {
                mui.alert('授权过期，请重新打开页面');;
            } else if (XMLHttpRequest.status == "500") {
                mui.alert('服务器内部错误');
            }
            reject();
        });
    });
    return p;
}

function initData(data, flag) {
    var item = data.FormDataSet.威海卫大厦部门营销方案申请表[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.fbillno);
    }
    $("#fname").val(item.提报人);
    $("#fdate").val(FormatterTimeYMS(item.提报日期));
    $("#fdept").val(item.提报部门);
    $("#ffamc").val(item.方案名称);

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
        upload();
        $("#fdate,#ffamc").removeAttr('readonly');

    }
}

function Save() {
    var fname = $("#fname").val();
    var fdate = $("#fdate").val();
    var fdept = $("#fdept").val();
    var ffamc = $("#ffamc").val();
    if (!ffamc) {
        mui.toast('请填写方案名称');
        return;
    }
    console.log(fjArray);
    if (fjArray.length==0) {
        mui.toast('请上传附件');
        return;
    }

    var btnArry = ["取消", "确定"];
    mui.confirm('即将提交，是否确定？', '提交确认提醒', btnArry, function (e) {
        if (e.index == 1) {
            var xml = `<?xml version= "1.0" ?>
                       <XForm>
                        <Header>
                       <Method>Post</Method>';
                      <ProcessName>威海卫大厦部门营销方案申请</ProcessName>
                        <ProcessVersion>${version}</ProcessVersion>
                        <DraftGuid></DraftGuid>
                          <OwnerMemberFullName>${BPMOU}</OwnerMemberFullName>
                           <Action>提交</Action>
                         <Comment></Comment>
                         <InviteIndicateUsers></InviteIndicateUsers>
                      </Header>
                     <FormData>
              `;
            xml += `
                  <威海卫大厦部门营销方案申请表>
                    <fbillno>自动带出</fbillno>
                    <提报人>${fname}</提报人>
                    <提报日期>${fdate}</提报日期>
                    <提报部门>${fdept}</提报部门>
                    <方案名称>${ffamc}</方案名称>
                    <附件>${(fjArray.join(";"))}</附件>
                </威海卫大厦部门营销方案申请表>
               `;
            xml += `  </FormData>
                      </XForm>`;

           PostXml(xml);
        }
    });
}

function reSave() {
    var pid = $("#stepId").val();
    var fbillno = $("#fbillno").val();
    var fname = $("#fname").val();
    var fdate = $("#fdate").val();
    var fdept = $("#fdept").val();
    var ffamc = $("#ffamc").val();
    if (!ffamc) {
        mui.toast('请填写方案名称');
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
            <FormData>`;
            xml += `
                  <威海卫大厦部门营销方案申请表>
                    <fbillno>${fbillno}</fbillno>
                    <提报人>${fname}</提报人>
                    <提报日期>${fdate}</提报日期>
                    <提报部门>${fdept}</提报部门>
                    <方案名称>${ffamc}</方案名称>
                    <附件>${(fjArray.join(";"))}</附件>
                </威海卫大厦部门营销方案申请表>
               `;
            xml += `  </FormData>
                      </XForm>`;

            PostXml(xml);
        }
    });
}

function hasRead() {
    var pid = $("#stepId").val();
    var fbillno = $("#fbillno").val();

    var fname = $("#fname").val();
    var fdate = $("#fdate").val();
    var fdept = $("#fdept").val();
    var ffamc = $("#ffamc").val();
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
                        <FormData>`;
            xml += `
                  <威海卫大厦部门营销方案申请表>
                    <fbillno>${fbillno}</fbillno>
                    <提报人>${fname}</提报人>
                    <提报日期>${fdate}</提报日期>
                    <提报部门>${fdept}</提报部门>
                    <方案名称>${ffamc}</方案名称>
                    <附件>${(fjArray.join(";"))}</附件>
                </威海卫大厦部门营销方案申请表>
               `;
            xml += `  </FormData>
                      </XForm>`;

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
    var fdept = $("#fdept").val();
    var ffamc = $("#ffamc").val();
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
                  <威海卫大厦部门营销方案申请表>
                    <fbillno>${fbillno}</fbillno>
                    <提报人>${fname}</提报人>
                    <提报日期>${fdate}</提报日期>
                    <提报部门>${fdept}</提报部门>
                    <方案名称>${ffamc}</方案名称>
                    <附件>${(fjArray.join(";"))}</附件>
                </威海卫大厦部门营销方案申请表>
               `;
            xml += `  </FormData>
                      </XForm>`;

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
                  <威海卫大厦部门营销方案申请表>
                    <fbillno>${fbillno}</fbillno>
                    <提报人>${fname}</提报人>
                    <提报日期>${fdate}</提报日期>
                    <提报部门>${fdept}</提报部门>
                    <方案名称>${ffamc}</方案名称>
                    <附件>${(fjArray.join(";"))}</附件>
                </威海卫大厦部门营销方案申请表>
               `;
        xml += `  </FormData>
                      </XForm>`;

        PostXml(xml);
    }
}