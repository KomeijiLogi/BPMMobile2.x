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
    $("#ftel").val(item.ftel);
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
    var ftel = $("#ftel").val();
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
        mui.toast('请填写返利点');
        return;
    }
    if (!fkhh) {
        mui.toast('请填写开户行');
        return;
    }
    if (!fkhhmc) {
        mui.toast('请填写开户行名称');
        return;
    }
    if (!fyhzh) {
        mui.toast('请填写银行账户');
        return;
    }
    if (!fyyzzh) {
        mui.toast('请填写营业执照号');
        return;
    }
    if (!fcpfw) {
        mui.toast('请填写产品范围');
        return;
    }
    if (!ftbly) {
        mui.toast('请填写提报理由');
        return;
    }


    var btnArry = ["取消", "确定"];
    mui.confirm('即将提交，是否确定？', '提交确认提醒', btnArry, function (e) {
        if (e.index == 1) {
            var xml = `<?xml version="1.0"?>
                        <XForm>
                            <Header>
                                <Method>Post</Method>
                                <ProcessName>食品餐饮公司供应商准入申请</ProcessName>
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
                      `;
            xml += `<BPM_LYCY_GYSZR>
                        <fbillno>自动生成</fbillno>
                        <fname>${fname}</fname>
                        <fdept>${fdept}</fdept>
                        <fdate>${fdate}</fdate>
                        <ftel>${ftel}</ftel>
                        <fgys_name>${fgys_name}</fgys_name>
                        <fgys_addr>${fgys_addr}</fgys_addr>
                        <fgys_lxr>${fgys_lxr}</fgys_lxr>
                        <fgys_tel>${fgys_tel}</fgys_tel>
                        <fsxq>${fsxq}</fsxq>
                        <ffld>${ffld}</ffld>
                        <fkhh>${fkhh}</fkhh>
                        <fkhhmc>${fkhhmc}</fkhhmc>
                        <fyhzh>${fyhzh}</fyhzh>
                        <fyyzzh>${fyyzzh}</fyyzzh>
                        <fcpfw>${fcpfw}</fcpfw>
                        <ftbly>${ftbly}</ftbly>
                        <fj>${fjArray.join(";")}</fj>
                    </BPM_LYCY_GYSZR>
                    `;
            xml += ` </FormData>
                    </XForm>
                   `;
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

    if (!fgys_name) {
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
        mui.toast('请填写返利点');
        return;
    }
    if (!fkhh) {
        mui.toast('请填写开户行');
        return;
    }
    if (!fkhhmc) {
        mui.toast('请填写开户行名称');
        return;
    }
    if (!fyhzh) {
        mui.toast('请填写银行账户');
        return;
    }
    if (!fyyzzh) {
        mui.toast('请填写营业执照号');
        return;
    }
    if (!fcpfw) {
        mui.toast('请填写产品范围');
        return;
    }
    if (!ftbly) {
        mui.toast('请填写提报理由');
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
            xml += `<BPM_LYCY_GYSZR>
                        <fbillno>自动生成</fbillno>
                        <fname>${fname}</fname>
                        <fdept>${fdept}</fdept>
                        <fdate>${fdate}</fdate>
                        <ftel>${ftel}</ftel>
                        <fgys_name>${fgys_name}</fgys_name>
                        <fgys_addr>${fgys_addr}</fgys_addr>
                        <fgys_lxr>${fgys_lxr}</fgys_lxr>
                        <fgys_tel>${fgys_tel}</fgys_tel>
                        <fsxq>${fsxq}</fsxq>
                        <ffld>${ffld}</ffld>
                        <fkhh>${fkhh}</fkhh>
                        <fkhhmc>${fkhhmc}</fkhhmc>
                        <fyhzh>${fyhzh}</fyhzh>
                        <fyyzzh>${fyyzzh}</fyyzzh>
                        <fcpfw>${fcpfw}</fcpfw>
                        <ftbly>${ftbly}</ftbly>
                        <fj>${fjArray.join(";")}</fj>
                    </BPM_LYCY_GYSZR>
                    `;
            xml += ` </FormData>
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

    var fname = $("#fname").val();
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();
    var ftel = $("#ftel").val();
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
            xml += `<BPM_LYCY_GYSZR>
                        <fbillno>${fbillno}</fbillno>
                        <fname>${fname}</fname>
                        <fdept>${fdept}</fdept>
                        <fdate>${fdate}</fdate>
                        <ftel>${ftel}</ftel>
                        <fgys_name>${fgys_name}</fgys_name>
                        <fgys_addr>${fgys_addr}</fgys_addr>
                        <fgys_lxr>${fgys_lxr}</fgys_lxr>
                        <fgys_tel>${fgys_tel}</fgys_tel>
                        <fsxq>${fsxq}</fsxq>
                        <ffld>${ffld}</ffld>
                        <fkhh>${fkhh}</fkhh>
                        <fkhhmc>${fkhhmc}</fkhhmc>
                        <fyhzh>${fyhzh}</fyhzh>
                        <fyyzzh>${fyyzzh}</fyyzzh>
                        <fcpfw>${fcpfw}</fcpfw>
                        <ftbly>${ftbly}</ftbly>
                        <fj>${fjArray.join(";")}</fj>
                    </BPM_LYCY_GYSZR>
                    `;
            xml += ` </FormData>
                    </XForm>
                   `;
            PostXml(xml);
        });
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
        xml += `<BPM_LYCY_GYSZR>
                        <fbillno>${fbillno}</fbillno>
                        <fname>${fname}</fname>
                        <fdept>${fdept}</fdept>
                        <fdate>${fdate}</fdate>
                        <ftel>${ftel}</ftel>
                        <fgys_name>${fgys_name}</fgys_name>
                        <fgys_addr>${fgys_addr}</fgys_addr>
                        <fgys_lxr>${fgys_lxr}</fgys_lxr>
                        <fgys_tel>${fgys_tel}</fgys_tel>
                        <fsxq>${fsxq}</fsxq>
                        <ffld>${ffld}</ffld>
                        <fkhh>${fkhh}</fkhh>
                        <fkhhmc>${fkhhmc}</fkhhmc>
                        <fyhzh>${fyhzh}</fyhzh>
                        <fyyzzh>${fyyzzh}</fyyzzh>
                        <fcpfw>${fcpfw}</fcpfw>
                        <ftbly>${ftbly}</ftbly>
                        <fj>${fjArray.join(";")}</fj>
                    </BPM_LYCY_GYSZR>
                    `;
        xml += ` </FormData>
                    </XForm>
                   `;
        PostXml(xml);
    }
}