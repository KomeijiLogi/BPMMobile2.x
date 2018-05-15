function prepMsg() {
    upload();
    $("#fdate").val(getNowFormatDate(2));
    tapEvent();
    var xml = `<?xml version= "1.0" ?>
                  <Requests>
                      <Params>
                      <Method>GetFormPostData</Method>
                      <ProcessName>洁丽康公司员工证明申请</ProcessName>
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
        $("#fdept").val(item.申请部门);
    }).fail(function (e) {

    });
}

function tapEvent() {
    var fzmlxdata = [
        {
            value: '',
            text:'收入证明'
        },
        {
            value: '',
            text:'在职证明'
        },
        {
            value: '',
            text:'其他'
        }
    ];
    showPicker('fzmlx', fzmlxdata);



}

function tapEventRS() {
    var fyzlxdata = [
        {
            value: '',
            text:'公章'
        },
        {
            value: '',
            text:'人事章'
        }
    ];
    showPicker('fyzlx', fyzlxdata);

}

function initData(data, flag) {
    var item = data.FormDataSet.洁丽康公司_员工证明申请_主表[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.fbillno);
    }
    $("#fname").val(item.申请人);
    $("#fdept").val(item.申请部门);
    $("#fdate").val(FormatterTimeYMS(item.申请日期));
    $("#fzmlx").val(item.证明类型);
    $("#fyt").val(item.用途);
    $("#fyzlx").val(item.印章类型);
    if (item.附件) {
        var fjtmp = (String)(item.附件);
        fjArray = fjtmp.split(";");
        $.ajax({
            type: 'POST',
            url: '/api/bpm/GetAttachmentsInfo',
            data: { 'fileIds': fjArray },
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



        }).fail((e) => {
            console.log(e);
        });
    }


}

function nodeControllerExp(NodeName) {
    if (String(NodeName).match('开始') != null) {
        tapEvent();

        $('.upload-addbtn').show();
        upload();

    } else if (String(NodeName).match('人事专员') != null) {
        tapEventRS();
        $("#fyzlx").parent().show();
        $(".itemtitle3").show();
    }
}

function checkNes() {
    var NodeName = $("#nodeName").val();
    if (String(NodeName).match('人事专员') != null && String(NodeName).match('知会') == null) {
        if (!$("#fyzlx").val()) {
            mui.toast('请选择印章类型');
            return false;
        }

    }
    return true;
}


function Save() {
    var fname = $("#fname").val();
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();
    var fzmlx = $("#fzmlx").val();
    var fyt = $("#fyt").val();
    var fyzlx = $("#fyzlx").val();
    if (!fzmlx) {
        mui.toast('请选择证明类型');
        return;
    }
    if (!fyt) {
        mui.toast('请填写用途');
        return;
    }

    var btnArry = ["取消", "确定"];
    mui.confirm('即将提交，是否确定？', '提交确认提醒', btnArry, function (e) {
        if (e.index == 1) {
            var xml = `<?xml version="1.0"?>
                        <XForm>
                            <Header>
                                <Method>Post</Method>
                                <ProcessName>洁丽康公司员工证明申请</ProcessName>
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

            xml += `
                      <洁丽康公司_员工证明申请_主表>
                        <单号>自动生成</单号>
                        <申请人>${fname}</申请人>
                        <申请部门>${fdept}</申请部门>
                        <申请日期>${fdate}</申请日期>
                        <证明类型>${fzmlx}</证明类型>
                        <用途>${fyt}</用途>
                        <附件>${fjArray.join(";")}</附件>
                        <印章类型>${fyzlx}</印章类型>
                    </洁丽康公司_员工证明申请_主表>
                   `;
            xml += `
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
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();
    var fzmlx = $("#fzmlx").val();
    var fyt = $("#fyt").val();
    var fyzlx = $("#fyzlx").val();
    if (!fzmlx) {
        mui.toast('请选择证明类型');
        return;
    }
    if (!fyt) {
        mui.toast('请填写用途');
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
                       `;
            xml += `
                      <洁丽康公司_员工证明申请_主表>
                        <单号>${fbillno}</单号>
                        <申请人>${fname}</申请人>
                        <申请部门>${fdept}</申请部门>
                        <申请日期>${fdate}</申请日期>
                        <证明类型>${fzmlx}</证明类型>
                        <用途>${fyt}</用途>
                        <附件>${fjArray.join(";")}</附件>
                        <印章类型>${fyzlx}</印章类型>
                    </洁丽康公司_员工证明申请_主表>
                   `;
            xml += `
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
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();
    var fzmlx = $("#fzmlx").val();
    var fyt = $("#fyt").val();
    var fyzlx = $("#fyzlx").val();
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
                      <洁丽康公司_员工证明申请_主表>
                        <单号>${fbillno}</单号>
                        <申请人>${fname}</申请人>
                        <申请部门>${fdept}</申请部门>
                        <申请日期>${fdate}</申请日期>
                        <证明类型>${fzmlx}</证明类型>
                        <用途>${fyt}</用途>
                        <附件>${fjArray.join(";")}</附件>
                        <印章类型>${fyzlx}</印章类型>
                    </洁丽康公司_员工证明申请_主表>
                   `;
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
                      <洁丽康公司_员工证明申请_主表>
                        <单号>${fbillno}</单号>
                        <申请人>${fname}</申请人>
                        <申请部门>${fdept}</申请部门>
                        <申请日期>${fdate}</申请日期>
                        <证明类型>${fzmlx}</证明类型>
                        <用途>${fyt}</用途>
                        <附件>${fjArray.join(";")}</附件>
                        <印章类型>${fyzlx}</印章类型>
                    </洁丽康公司_员工证明申请_主表>
                   `;
        xml += `
                       </FormData>
                    </XForm>
                   `;
        PostXml(xml);
    }

}