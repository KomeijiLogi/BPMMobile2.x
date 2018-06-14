function prepMsg() {

}
var item = null;

function initData(data, flag) {
    item = data.FormDataSet.集团本部_公司车辆费用报销单[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);      
    }
    $("#fgsmc").val(item.公司名称);
    $("#fbmmc").val(item.部门名称);
    $("#fbmbm").val(item.部门编号);
    $("#fbxr").val(item.报销人);
    $("#fbxrno").val(item.报销人工号);
    $("#fgangwei").val(item.岗位);
    $("#fbxrq").val(FormatterTimeYMS(item.报销日期));
    $("#fcph").val(item.车牌号);
    $("#fydysje").val(item.月度预算金额);
    $("#fkyysje").val(item.可用预算金额);
    $("#ffysx").val(item.费用属性);
    $("#fcysqk").val(item.超预算情况);
    $("#fybxbz").val(item.月度报销标准);
    $("#fndkbxys").val(item.年度可报销月数);
    $("#fndbxbz").val(item.年度报销标准);
    $("#fbndybxje").val(item.年度已报销金额);

    $("#fcbzqk").val(item.超标准情况);
    $("#fclbxf").val(item.车辆保险费报销金额);
    $("#fbz").val(item.备注);
    $("#fclryf").val(item.车辆燃油费报销金额);
    $("#fclxlf").val(item.车辆修理费报销金额);
    $("#ftcglf").val(item.停车过来费报销金额);
    $("#fqt").val(item.其它报销金额);
    $("#fhj").val(item.报销金额总合计);
    $("#fhj_dx").val(item.报销金额总合计大写);
    $("#fdjs").val(item.单据张数);

    if (item.上传票据 != null && item.上传票据 != "") {
        var fjtmp = (String)(item.上传票据);

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

function nodeControllerExp(nodeName) {
    if (String(nodeName).match('开始') != null) {
        mui.alert('请移步网页端处理');
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
function AgreeOrConSign() {
    var pid = $("#stepId").val();
    var fbillno = $("#fbillno").val();
    var comment = $("#signSuggest").val();
    var nodeName = $("#nodeName").val();

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
                       <集团本部_公司车辆费用报销单>
            <TaskID>${item.TaskID}</TaskID>
            <公司名称>${item.公司名称}</公司名称>
            <部门名称>${item.部门名称}</部门名称>
            <部门编号>${item.部门编号}</部门编号>
            <岗位>${item.岗位}</岗位>
            <报销人>${item.报销人}</报销人>
            <报销人工号>${item.报销人工号}</报销人工号>
            <报销日期>${item.报销日期}</报销日期>
            <车牌号>${item.车牌号}</车牌号>
            <月度预算金额>${item.月度预算金额}</月度预算金额>
            <可用预算金额>${item.可用预算金额}</可用预算金额>
            <费用属性>${item.费用属性}</费用属性>
            <超预算情况>${item.超预算情况}</超预算情况>
            <月度报销标准>${item.月度报销标准}</月度报销标准>
            <年度可报销月数>${item.年度可报销月数}</年度可报销月数>
            <年度报销标准>${item.年度报销标准}</年度报销标准>
            <年度已报销金额>${item.年度已报销金额}</年度已报销金额>
            <超标准情况>${item.超标准情况}</超标准情况>
            <车辆保险费报销金额>${item.车辆保险费报销金额}</车辆保险费报销金额>
            <备注>${item.备注}</备注>
            <车辆燃油费报销金额>${item.车辆燃油费报销金额}</车辆燃油费报销金额>
            <车辆修理费报销金额>${item.车辆修理费报销金额}</车辆修理费报销金额>
            <停车过来费报销金额>${item.停车过来费报销金额}</停车过来费报销金额>
            <其它报销金额>${item.其它报销金额}</其它报销金额>
            <报销金额总合计>${item.报销金额总合计}</报销金额总合计>
            <报销金额总合计大写>${item.报销金额总合计大写}</报销金额总合计大写>
            <上传票据>${item.上传票据}</上传票据>
            <单据张数>${item.单据张数}</单据张数>
        </集团本部_公司车辆费用报销单>
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
                       <集团本部_公司车辆费用报销单>
            <TaskID>${item.TaskID}</TaskID>
            <公司名称>${item.公司名称}</公司名称>
            <部门名称>${item.部门名称}</部门名称>
            <部门编号>${item.部门编号}</部门编号>
            <岗位>${item.岗位}</岗位>
            <报销人>${item.报销人}</报销人>
            <报销人工号>${item.报销人工号}</报销人工号>
            <报销日期>${item.报销日期}</报销日期>
            <车牌号>${item.车牌号}</车牌号>
            <月度预算金额>${item.月度预算金额}</月度预算金额>
            <可用预算金额>${item.可用预算金额}</可用预算金额>
            <费用属性>${item.费用属性}</费用属性>
            <超预算情况>${item.超预算情况}</超预算情况>
            <月度报销标准>${item.月度报销标准}</月度报销标准>
            <年度可报销月数>${item.年度可报销月数}</年度可报销月数>
            <年度报销标准>${item.年度报销标准}</年度报销标准>
            <年度已报销金额>${item.年度已报销金额}</年度已报销金额>
            <超标准情况>${item.超标准情况}</超标准情况>
            <车辆保险费报销金额>${item.车辆保险费报销金额}</车辆保险费报销金额>
            <备注>${item.备注}</备注>
            <车辆燃油费报销金额>${item.车辆燃油费报销金额}</车辆燃油费报销金额>
            <车辆修理费报销金额>${item.车辆修理费报销金额}</车辆修理费报销金额>
            <停车过来费报销金额>${item.停车过来费报销金额}</停车过来费报销金额>
            <其它报销金额>${item.其它报销金额}</其它报销金额>
            <报销金额总合计>${item.报销金额总合计}</报销金额总合计>
            <报销金额总合计大写>${item.报销金额总合计大写}</报销金额总合计大写>
            <上传票据>${item.上传票据}</上传票据>
            <单据张数>${item.单据张数}</单据张数>
        </集团本部_公司车辆费用报销单>
                    `;
        xml += `
                       </FormData>
                    </XForm>
                   `;

        PostXml(xml);
    }
}