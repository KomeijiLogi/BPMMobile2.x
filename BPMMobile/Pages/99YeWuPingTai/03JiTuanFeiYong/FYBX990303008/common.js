function prepMsg() {

}

var item = null;
var item_c = [];
function initData(data, flag) {
    item = data.FormDataSet.fybx_car_m[0];
    if (flag) {
        $("#taskId").val(item.taskid);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.lscode);
    }
    $("#comp_name").val(item.comp_name);
    $("#dept_name").val(item.dept_name);
    $("#dept_no").val(item.dept_no);
    $("#leadtitle").val(item.leadtitle);
    $("#user_name").val(item.user_name);
    $("#user_no").val(item.user_no);
    $("#chlsqdcode").val(item.chlsqdcode);
    $("#chlsqd").val(item.chlsqd);
    $("#sqje").val(item.sqje);
    $("#sqdate").val(FormatterTimeYMS(item.sqdate));
    $("#jkje").val(item.jkje);
    $("#chsqqk").val(item.chsqqk);
    $("#is_cj").val(item.is_cj);
    $("#bxje").val(item.bxje);
    $("#bxjedx").val(item.bxjedx);
    $("#sfdj").val(item.sfdj);



    item_c = data.FormDataSet.fybx_car_t;

    for (var i = 0; i < item_c.length; i++) {
        var li = `
                   <div class="mui-row cutOffLine padding">
                      <div class="mui-col-xs-3" style="display:flex;">
                         <label>费用项目</label>
                         <textarea rows="2" id="feiylx" readonly>${item_c[i].feiylx}</textarea>
                      </div>
                      <div class="mui-col-xs-3" style="display:flex;">
                         <label>申请金额</label>
                         <textarea rows="2" id="feiysqje" readonly>${item_c[i].feiysqje}</textarea>
                      </div>
                     <div class="mui-col-xs-3" style="display:flex;">
                         <label>报销金额</label>
                         <textarea rows="2" id="feiybxje" readonly>${item_c[i].feiybxje}</textarea>
                      </div>
                    <div class="mui-col-xs-3" style="display:flex;">
                         <label>车牌号码</label>
                         <textarea rows="2" id="chephm" readonly>${item_c[i].chephm}</textarea>
                      </div>
                   </div>
                  `;
        $("#mxlist").append(li);
    }


    if (item.attach != null && item.attach != "") {
        var fjtmp = (String)(item.attach);

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
 <fybx_car_m>
            <lscode>${item.lscode}</lscode>
            <taskid>${item.taskid}</taskid>
            <comp_name>${item.comp_name}</comp_name>
            <dept_name>${item.dept_name}</dept_name>
            <dept_no>${item.dept_no}</dept_no>
            <leadtitle>${item.leadtitle}</leadtitle>
            <user_name>${item.user_name}</user_name>
            <user_no>${item.user_no}</user_no>
            <chlsqdcode>${item.chlsqdcode}</chlsqdcode>
            <chlsqd>${item.chlsqd}</chlsqd>
            <sqje>${item.sqje}</sqje>
            <sqdate>${item.sqdate}</sqdate>
            <jkje>${item.jkje}</jkje>
            <chsqqk>${item.chsqqk}</chsqqk>
            <is_cj>${item.is_cj}</is_cj>
            <bxje>${changeNullToEmpty(item.bxje)}</bxje>
            <bxjedx>${item.bxjedx}</bxjedx>
            <sfdj>${item.sfdj}</sfdj>
            <attach>${item.attach}</attach>
        </fybx_car_m>
                  `;

            for (var i = 0; i < item_c.length; i++) {
                xml += `
                       <fybx_car_t>
                        <RelationRowGuid>${i + 1}</RelationRowGuid>
                        <RowPrimaryKeys>itemid=${item_c[i].itemid}</RowPrimaryKeys>
                        <feiylx>${item_c[i].feiylx}</feiylx>
                        <feiysqje>${changeNullToEmpty(item_c[i].feiysqje)}</feiysqje>
                        <feiybxje>${changeNullToEmpty(item_c[i].feiybxje)}</feiybxje>
                        <chephm>${item_c[i].chephm}</chephm>
                    </fybx_car_t>
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
 <fybx_car_m>
            <lscode>${item.lscode}</lscode>
            <taskid>${item.taskid}</taskid>
            <comp_name>${item.comp_name}</comp_name>
            <dept_name>${item.dept_name}</dept_name>
            <dept_no>${item.dept_no}</dept_no>
            <leadtitle>${item.leadtitle}</leadtitle>
            <user_name>${item.user_name}</user_name>
            <user_no>${item.user_no}</user_no>
            <chlsqdcode>${item.chlsqdcode}</chlsqdcode>
            <chlsqd>${item.chlsqd}</chlsqd>
            <sqje>${item.sqje}</sqje>
            <sqdate>${item.sqdate}</sqdate>
            <jkje>${item.jkje}</jkje>
            <chsqqk>${item.chsqqk}</chsqqk>
            <is_cj>${item.is_cj}</is_cj>
            <bxje>${changeNullToEmpty(item.bxje)}</bxje>
            <bxjedx>${item.bxjedx}</bxjedx>
            <sfdj>${item.sfdj}</sfdj>
            <attach>${item.attach}</attach>
        </fybx_car_m>
                  `;

        for (var i = 0; i < item_c.length; i++) {
            xml += `
                       <fybx_car_t>
                        <RelationRowGuid>${i + 1}</RelationRowGuid>
                        <RowPrimaryKeys>itemid=${item_c[i].itemid}</RowPrimaryKeys>
                        <feiylx>${item_c[i].feiylx}</feiylx>
                        <feiysqje>${changeNullToEmpty(item_c[i].feiysqje)}</feiysqje>
                        <feiybxje>${changeNullToEmpty(item_c[i].feiybxje)}</feiybxje>
                        <chephm>${item_c[i].chephm}</chephm>
                    </fybx_car_t>
           `;
        }
        xml += `
                       </FormData>
                    </XForm>
                   `;
        PostXml(xml);
    }
}