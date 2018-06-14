function prepMsg() {


}
var item = null;
var item_c1 = [];
var item_c2 = [];
function initData(data, flag) {
    item = data.FormDataSet.fybx_entertain_m[0];
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
    $("#jkje").val(item.jkje);
    $("#zdfs").val(item.zdfs);
    $("#chaosqqk").val(item.chaosqqk);
    $("#rem").val(item.rem);
    $("#if_cj").val(item.if_cj);
    $("#if_verify").val(item.if_verify);
    $("#fyhj").val(item.fyhj);
    $("#fyhjdx").val(item.fyhjdx);
    $("#djsl").val(item.djsl);
    item_c1 = data.FormDataSet.fybx_entertain_t1;

    for (var i = 0; i < item_c1.length; i++) {

        var li = ` <div id="mx">
                        <div class="mui-input-row itemtitle">
                            <label>明细列表项</label>
                            <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>
                        </div>
                        <div class="mui-row cutOffLine padding">
                            <div class="mui-col-xs-3" style="display:flex;">
                                <label>招待人数</label>
                                <textarea rows="2" id="zdrs" readonly>${item_c1[i].zdrs}</textarea>  
                            </div>
                            <div class="mui-col-xs-3" style="display:flex;">
                                <label>单人招待标准</label>
                                <textarea rows="2" id="zdbz" readonly>${item_c1[i].zdbz}</textarea>  
                            </div>
                           <div class="mui-col-xs-3" style="display:flex;">
                                <label>招待城市</label>
                                <textarea rows="2" id="zdcity" readonly>${item_c1[i].zdcity}</textarea>  
                            </div>
                            <div class="mui-col-xs-3" style="display:flex;">
                                <label>招待地点</label>
                                <textarea rows="2" id="zddd" readonly>${item_c1[i].zddd}</textarea>  
                            </div>
                        </div>  
                        <div class="mui-row cutOffLine padding">
                             <div class="mui-col-xs-4" style="display:flex;">
                                <label>申请金额</label>
                                <textarea rows="2" id="sqje" readonly>${item_c1[i].sqje}</textarea>  
                            </div>
                            <div class="mui-col-xs-8" style="display:flex;">
                                <label>实现目标</label>
                                <textarea rows="2" id="rem" readonly>${item_c1[i].rem}</textarea>  
                            </div>      
                        </div>
                   </div>

                  `;
        $("#mxlist1").append(li);
    }

    item_c2 = data.FormDataSet.fybx_entertain_t2;
    for (var i = 0; i < item_c2.length; i++) {
        var li = `
                    <div id="mx">
                        <div class="mui-input-row itemtitle">
                            <label>明细列表项</label>
                            <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>
                        </div>
                         <div class="mui-row cutOffLine padding">
                            <div class="mui-col-xs-3" style="display:flex;">
                                <label>招待人数</label>
                                <textarea rows="2" id="zdrs" readonly>${item_c2[i].zdrs}</textarea>  
                            </div>
                            <div class="mui-col-xs-3" style="display:flex;">
                                <label>单人招待标准</label>
                                <textarea rows="2" id="zdbz" readonly>${item_c2[i].zdbz}</textarea>  
                            </div>
                           <div class="mui-col-xs-3" style="display:flex;">
                                <label>招待城市</label>
                                <textarea rows="2" id="zdcity" readonly>${item_c2[i].zdcity}</textarea>  
                            </div>
                            <div class="mui-col-xs-3" style="display:flex;">
                                <label>招待地点</label>
                                <textarea rows="2" id="zddd" readonly>${item_c2[i].zddd}</textarea>  
                            </div>
                        </div>  
                        <div class="mui-row cutOffLine padding">
                             <div class="mui-col-xs-4" style="display:flex;">
                                <label>报销金额</label>
                                <textarea rows="2" id="bxje" readonly>${item_c2[i].bxje}</textarea>  
                            </div>
                            <div class="mui-col-xs-8" style="display:flex;">
                                <label>工作成效<i style="color:red;">*</i></label>
                                <textarea rows="2" id="rem" readonly>${item_c2[i].rem}</textarea>  
                            </div>      
                        </div>
                    </div>
                  `;
        $("#mxlist2").append(li);

    }



    if (item.att != null && item.att != "") {
        var fjtmp = (String)(item.att);

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
                    <fybx_entertain_m>
            <lscode>${item.lscode}</lscode>
            <taskid>${item.taskid}</taskid>
            <comp_name>${item.comp_name}</comp_name>
            <dept_name>${item.dept_name}</dept_name>
            <dept_no>${item.dept_name}</dept_no>
            <user_name>${item.user_name}</user_name>
            <user_no>${item.user_no}</user_no>
            <sqdate>${item.sqdate}</sqdate>
            <user_leadtitle>${item.user_leadtitle}</user_leadtitle>
            <sqcode>${item.sqcode}</sqcode>
            <sqtaskid>${item.sqtaskid}</sqtaskid>
            <sqje>${item.sqje}</sqje>
            <jkje>${item.jkje}</jkje>
            <zdfs>${item.zdfs}</zdfs>
            <chaosqqk>${item.chaosqqk}</chaosqqk>
            <rem>${item.rem}</rem>
            <if_cj>${item.if_cj}</if_cj>
            <if_verify>${item.if_verify}</if_verify>
            <fyhj>${item.fyhj}</fyhj>
            <fyhjdx>${item.fyhjdx}</fyhjdx>
            <djsl>${item.djsl}</djsl>
            <att>${item.att}</att>
        </fybx_entertain_m>
                    `;
            for (var i = 0; i < item_c1.length; i++) {
                xml += `
                      <fybx_entertain_t1>
            <RelationRowGuid>${i+1}</RelationRowGuid>
            <RowPrimaryKeys>itemid=${item_c1[i].itemid}</RowPrimaryKeys>
            <zdrs>${item_c1[i].zdrs}</zdrs>
            <zdbz>${item_c1[i].zdbz}</zdbz>
            <zdcity>${item_c1[i].zdcity}</zdcity>
            <zddd>${item_c1[i].zddd}</zddd>
            <sqje>${item_c1[i].sqje}</sqje>
            <rem>${item_c1[i].rem}</rem>
        </fybx_entertain_t1>
                       `;
            }
            for (var i = 0; i < item_c2.length; i++) {
                xml += `
                       <fybx_entertain_t2>
            <RelationRowGuid>${item_c1.length+i+1}</RelationRowGuid>
            <RowPrimaryKeys>itemid=${item_c2[i].itemid}</RowPrimaryKeys>
            <zdrs>${item_c2[i].zdrs}</zdrs>
            <zdbz>${item_c2[i].zdbz}</zdbz>
            <zdcity>${item_c2[i].zdcity}</zdcity>
            <zddd>${item_c2[i].zddd}</zddd>
            <bxje>${item_c2[i].bxje}</bxje>
            <rem>${item_c2[i].rem}</rem>
        </fybx_entertain_t2>
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
                    <fybx_entertain_m>
            <lscode>${item.lscode}</lscode>
            <taskid>${item.taskid}</taskid>
            <comp_name>${item.comp_name}</comp_name>
            <dept_name>${item.dept_name}</dept_name>
            <dept_no>${item.dept_name}</dept_no>
            <user_name>${item.user_name}</user_name>
            <user_no>${item.user_no}</user_no>
            <sqdate>${item.sqdate}</sqdate>
            <user_leadtitle>${item.user_leadtitle}</user_leadtitle>
            <sqcode>${item.sqcode}</sqcode>
            <sqtaskid>${item.sqtaskid}</sqtaskid>
            <sqje>${item.sqje}</sqje>
            <jkje>${item.jkje}</jkje>
            <zdfs>${item.zdfs}</zdfs>
            <chaosqqk>${item.chaosqqk}</chaosqqk>
            <rem>${item.rem}</rem>
            <if_cj>${item.if_cj}</if_cj>
            <if_verify>${item.if_verify}</if_verify>
            <fyhj>${item.fyhj}</fyhj>
            <fyhjdx>${item.fyhjdx}</fyhjdx>
            <djsl>${item.djsl}</djsl>
            <att>${item.att}</att>
        </fybx_entertain_m>
                    `;
        for (var i = 0; i < item_c1.length; i++) {
            xml += `
                      <fybx_entertain_t1>
            <RelationRowGuid>${i + 1}</RelationRowGuid>
            <RowPrimaryKeys>itemid=${item_c1[i].itemid}</RowPrimaryKeys>
            <zdrs>${item_c1[i].zdrs}</zdrs>
            <zdbz>${item_c1[i].zdbz}</zdbz>
            <zdcity>${item_c1[i].zdcity}</zdcity>
            <zddd>${item_c1[i].zddd}</zddd>
            <sqje>${item_c1[i].sqje}</sqje>
            <rem>${item_c1[i].rem}</rem>
        </fybx_entertain_t1>
                       `;
        }
        for (var i = 0; i < item_c2.length; i++) {
            xml += `
                       <fybx_entertain_t2>
            <RelationRowGuid>${item_c1.length + i + 1}</RelationRowGuid>
            <RowPrimaryKeys>itemid=${item_c2[i].itemid}</RowPrimaryKeys>
            <zdrs>${item_c2[i].zdrs}</zdrs>
            <zdbz>${item_c2[i].zdbz}</zdbz>
            <zdcity>${item_c2[i].zdcity}</zdcity>
            <zddd>${item_c2[i].zddd}</zddd>
            <bxje>${item_c2[i].bxje}</bxje>
            <rem>${item_c2[i].rem}</rem>
        </fybx_entertain_t2>
                       `;
        }
        xml += `
                       </FormData>
                    </XForm>
                   `;
        PostXml(xml);
    }
}