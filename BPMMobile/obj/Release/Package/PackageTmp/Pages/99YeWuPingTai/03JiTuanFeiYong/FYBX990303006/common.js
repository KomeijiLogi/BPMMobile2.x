function prepMsg() {

}



var item = null;
var item_c1 = [];
var item_c2 = [];
function initData(data, flag) {
    item = data.FormDataSet.fybx_peixunf_m[0];
    if (flag) {
        $("#taskId").val(item.taskid);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.lscode);
    }

    $("#comp_name").val(item.comp_name);
    $("#dept_name").val(item.dept_name);
    $("#dept_no").val(item.dept_no);
    $("#user_leadtitle").val(item.user_leadtitle);
    $("#user_name").val(item.user_name);
    $("#user_no").val(item.user_no);
    $("#sqdate").val(FormatterTimeYMS(item.sqdate));
    $("#sqcode").val(item.sqcode);
    $("#sqtaskid").val(item.sqtaskid);

    $("#sqje").val(item.sqje);
    $("#zbxje").val(item.zbxje);
    $("#chaosqqk").val(item.chaosqqk);
    $("#zbxjedx").val(item.zbxjedx);
    $("#fpxfbx").val(item.fpxfbx);
    if (item.fpxfbx == 1) {
        $("#fpxfbx").attr('checked', 'checked');
    }
    $("#fqtfbx").val(item.fqtfbx);
    if (item.fqtfbx == 1) {
        $("#fqtfbx").attr('checked', 'checked');
    }

    $("#if_hc").val(item.if_hc);
    $("#pxdate").val(FormatterTimeYMS(item.pxdate));
    $("#peixundd").val(item.peixundd);
    $("#peixundx").val(item.peixundx);

    $("#kcmc").val(item.kcmc);
    $("#peixunjgmc").val(item.peixunjgmc);
    $("#peixunjs").val(item.peixunjs);
    $("#yssx").val(item.yssx);
    $("#kcpxf").val(item.kcpxf);
    $("#kczy").val(item.kczy);
    $("#qdcg").val(item.qdcg);
    $("#fyhj").val(item.fyhj);
    $("#fyhjdx").val(item.fyhjdx);
    $("#djsl").val(item.djsl);
    

    item_c1 = data.FormDataSet.fybx_peixunf_t;
    for (var i = 0; i < item_c1.length; i++) {
        var li = ` <div id="mx">
                        <div class="mui-input-row itemtitle"> 
                            <label>明细列表项</label>  
                            <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>
                        </div>
                        <div class="mui-row cutOffLine padding">
                            <div class="mui-col-xs-4" style="display:flex;">
                                 <label>费用项目<i style="color:red;">*</i></label>
                                 <textarea rows="2" id="fyxmmc" readonly>${item_c1[i].fyxmmc}</textarea>
                            </div>  
                            <div class="mui-col-xs-4" style="display:flex;">
                                <label>申请金额<i style="color:red;">*</i></label>
                                <textarea rows="2" id="sqje" readonly>${item_c1[i].sqje}</textarea>   
                             </div>
                             <div class="mui-col-xs-4" style="display:flex;">
                                 <label>报销金额<i style="color:red;">*</i></label>
                                 <textarea rows="2" id="bxje" readonly>${item_c1[i].bxje}</textarea>    
                             </div>
                        </div>   
                        <div class="mui-row cutOffLine padding">
                             <div class="mui-col-xs-12" style="display:flex;">
                                 <label>费用描述</label>
                                 <textarea rows="2" id="beizhusm" readonly>${item_c1[i].beizhusm}</textarea>
                             </div>
                        </div>
                   </div>

                 `;

        $("#mxlist").append(li);
    }


    item_c2 = data.FormDataSet.fybx_peixunf_t1;

    $("#fhkyt").val(item_c2[0].fhkyt);
    $("#fhkfs").val(item_c2[0].fhkfs);
    $("#fjedx").val(item_c2[0].fjedx);
    $("#fje").val(item_c2[0].fje);
    $("#fskdwmc").val(item_c2[0].fskdwmc);
    $("#fkhhmc").val(item_c2[0].fkhhmc);
    $("#fzh").val(item_c2[0].fzh);

    
    if (item.scdj != null && item.scdj != "") {
        var fjtmp = (String)(item.scdj);

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
                         <fybx_peixunf_m>
            <lscode>${item.lscode}</lscode>
            <taskid>${item.taskid}</taskid>
            <comp_name>${item.comp_name}</comp_name>
            <dept_name>${item.dept_name}</dept_name>
            <dept_no>${item.dept_no}</dept_no>
            <user_leadtitle>${item.user_leadtitle}</user_leadtitle>
            <user_name>${item.user_name}</user_name>
            <user_no>${item.user_no}</user_no>
            <sqdate>${item.sqdate}</sqdate>
            <sqcode>${item.sqcode}</sqcode>
            <sqtaskid>${item.sqtaskid}</sqtaskid>
            <sqje>${item.sqje}</sqje>
            <zbxje>${item.zbxje}</zbxje>
            <chaosqqk>${item.chaosqqk}</chaosqqk>
            <zbxjedx>${item.zbxjedx}</zbxjedx>
            <fpxfbx>${item.fpxfbx}</fpxfbx>
            <fqtfbx>${item.fqtfbx}</fqtfbx>
            <if_hc>${item.if_hc}</if_hc>
            <pxdate>${item.pxdate}</pxdate>
            <peixundd>${item.peixundd}</peixundd>
            <peixundx>${item.peixundx}</peixundx>
            <kcmc>${item.kcmc}</kcmc>
            <peixunjgmc>${item.peixunjgmc}</peixunjgmc>
            <peixunjs>${item.peixunjs}</peixunjs>
            <yssx>${item.yssx}</yssx>
            <kcpxf>${item.kcpxf}</kcpxf>
            <kczy>${item.kczy}</kczy>
            <qdcg>${item.qdcg}</qdcg>
            <fyhj>${item.fyhj}</fyhj>
            <fyhjdx>${item.fyhjdx}</fyhjdx>
            <djsl>${item.djsl}</djsl>
            <scdj>${item.scdj}</scdj>
        </fybx_peixunf_m>
                    `;

            for (var i = 0; i < item_c1.length; i++) {
                xml += `
      <fybx_peixunf_t>
            <RelationRowGuid>${i + 1}</RelationRowGuid>
            <RowPrimaryKeys>itemid=${item_c1[i].itemid}</RowPrimaryKeys>
            <fyxmmc>${item_c1[i].fyxmmc}</fyxmmc>
            <sqje>${item_c1[i].sqje}</sqje>
            <bxje>${item_c1[i].bxje}</bxje>
            <beizhusm>${item_c1[i].beizhusm}</beizhusm>
        </fybx_peixunf_t>
                        `;

            }
            xml += `
                       <fybx_peixunf_t1>
            <fhkyt></fhkyt>
            <fhkfs></fhkfs>
            <fjedx>零元整</fjedx>
            <fje></fje>
            <fskdwmc></fskdwmc>
            <fkhhmc></fkhhmc>
            <fzh></fzh>
        </fybx_peixunf_t1>
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
                         <fybx_peixunf_m>
            <lscode>${item.lscode}</lscode>
            <taskid>${item.taskid}</taskid>
            <comp_name>${item.comp_name}</comp_name>
            <dept_name>${item.dept_name}</dept_name>
            <dept_no>${item.dept_no}</dept_no>
            <user_leadtitle>${item.user_leadtitle}</user_leadtitle>
            <user_name>${item.user_name}</user_name>
            <user_no>${item.user_no}</user_no>
            <sqdate>${item.sqdate}</sqdate>
            <sqcode>${item.sqcode}</sqcode>
            <sqtaskid>${item.sqtaskid}</sqtaskid>
            <sqje>${item.sqje}</sqje>
            <zbxje>${item.zbxje}</zbxje>
            <chaosqqk>${item.chaosqqk}</chaosqqk>
            <zbxjedx>${item.zbxjedx}</zbxjedx>
            <fpxfbx>${item.fpxfbx}</fpxfbx>
            <fqtfbx>${item.fqtfbx}</fqtfbx>
            <if_hc>${item.if_hc}</if_hc>
            <pxdate>${item.pxdate}</pxdate>
            <peixundd>${item.peixundd}</peixundd>
            <peixundx>${item.peixundx}</peixundx>
            <kcmc>${item.kcmc}</kcmc>
            <peixunjgmc>${item.peixunjgmc}</peixunjgmc>
            <peixunjs>${item.peixunjs}</peixunjs>
            <yssx>${item.yssx}</yssx>
            <kcpxf>${item.kcpxf}</kcpxf>
            <kczy>${item.kczy}</kczy>
            <qdcg>${item.qdcg}</qdcg>
            <fyhj>${item.fyhj}</fyhj>
            <fyhjdx>${item.fyhjdx}</fyhjdx>
            <djsl>${item.djsl}</djsl>
            <scdj>${item.scdj}</scdj>
        </fybx_peixunf_m>
                    `;

        for (var i = 0; i < item_c1.length; i++) {
            xml += `
      <fybx_peixunf_t>
            <RelationRowGuid>${i + 1}</RelationRowGuid>
            <RowPrimaryKeys>itemid=${item_c1[i].itemid}</RowPrimaryKeys>
            <fyxmmc>${item_c1[i].fyxmmc}</fyxmmc>
            <sqje>${item_c1[i].sqje}</sqje>
            <bxje>${item_c1[i].bxje}</bxje>
            <beizhusm>${item_c1[i].beizhusm}</beizhusm>
        </fybx_peixunf_t>
                        `;

        }
        xml += `
                       <fybx_peixunf_t1>
            <fhkyt></fhkyt>
            <fhkfs></fhkfs>
            <fjedx>零元整</fjedx>
            <fje></fje>
            <fskdwmc></fskdwmc>
            <fkhhmc></fkhhmc>
            <fzh></fzh>
        </fybx_peixunf_t1>
                    `;
        xml += `
                       </FormData>
                    </XForm>
                   `;
        console.log(xml);
        PostXml(xml);
    }
}