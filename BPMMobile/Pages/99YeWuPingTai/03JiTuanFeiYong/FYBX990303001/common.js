function prepMsg() {


}

var item = null;
var item_c = [];
function initData(data, flag) {
    item = data.FormDataSet.fybx_travel_m[0];
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
    $("#chaosqqk").val(item.chaosqqk);
    $("#chaobzqk").val(item.chaobzqk);
    $("#chailvlb").val(item.chailvlb);
    $("#if_cj").val(item.if_cj);
    $("#rem").val(item.rem);
    $("#fyhj").val(item.fyhj);
    $("#fyhjbz").val(item.fyhjbz);
    $("#fyhjdx").val(item.fyhjdx);
    $("#fybz").val(item.fybz);
    $("#djsl").val(item.djsl);
    $("#att").val(item.att);
    item_c = data.FormDataSet.fybx_travel_t;
    for (var i = 0; i < item_c.length; i++) {
        itemidArr.push(item_c[i].itemid);
        var li = `
             <div id="mx">
                    <div class="mui-input-row itemtitle">
                        <label>明细列表项</label>
                        <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>
                    </div>
                    <div class="mui-row cutOffLine padding">
                        <div class="mui-col-xs-4" style="display:flex;">
                             <label>出发日期<i style="color:red;">*</i></label>
                             <textarea rows="2" id="cfdate" readonly>${FormatterTimeYMS(item_c[i].cfdate)}</textarea>
                        </div> 
                        <div class="mui-col-xs-4" style="display:flex;">
                             <label>到达日期<i style="color:red;">*</i></label>
                             <textarea rows="2" id="dddate" readonly>${FormatterTimeYMS(item_c[i].dddate)}</textarea> 
                        </div> 
                        <div class="mui-col-xs-4" style="display:flex;">
                             <label>交通工具</label>
                             <textarea rows="2" id="jtgj" readonly>${item_c[i].jtgj}</textarea>
                        </div>  
                    </div>  
                    <div class="mui-row cutOffLine padding">
                          <div class="mui-col-xs-3" style="display:flex;">
                              <label>出发地<i style="color:red;">*</i></label>
                              <textarea rows="2" id="cfdpro" readonly>${item_c[i].cfdpro}</textarea>  
                          </div>
                          <div class="mui-col-xs-3" style="display:flex;">
                              <textarea rows="2" id="cfdcity" readonly>${item_c[i].cfdcity}</textarea>  
                              <input type="hidden" id="cfdproid" readonly value="${item_c[i].cfdproid}"/>  
                          </div>
                         <div class="mui-col-xs-3" style="display:flex;">
                              <label>目的地<i style="color:red;">*</i></label>
                              <textarea rows="2" id="mddpro" readonly>${item_c[i].mddpro}</textarea>  
                          </div>
                          <div class="mui-col-xs-3" style="display:flex;">
                              <textarea rows="2" id="mddcity" readonly>${item_c[i].mddcity}</textarea>  
                              <input type="hidden" id="mddproid" readonly value="${item_c[i].mddproid}"/>
                          </div>
                      </div>    
                     <div class="mui-row cutOffLine padding">
                         <div class="mui-col-xs-3" style="display:flex;">
                               <label>人数<i style="color:red;">*</i></label>
                               <textarea rows="2" id="rs" readonly>${item_c[i].rs}</textarea> 
                        </div>
                         <div class="mui-col-xs-3" style="display:flex;">
                              <label>车船(飞机)费用<i style="color:red;">*</i></label>
                              <textarea rows="2" id="ccfy" readonly>${item_c[i].ccfy}</textarea>
                         </div>
                         <div class="mui-col-xs-3" style="display:flex;">
                             <label>天数<i style="color:red;">*</i></label>
                             <textarea rows="2" id="ts" readonly>${item_c[i].ts}</textarea>
                         </div>
                         <div class="mui-col-xs-3" style="display:flex;">
                             <label>其他</label>
                             <textarea rows="2" id="qt" readonly>${item_c[i].qt}</textarea>
                         </div>
                     </div>  
                      <div class="mui-row cutOffLine">
                          <div class="mui-col-xs-4 cutOffLine" style="display:flex;flex-direction:column;">
                               <label>住宿费<i style="color:red;">*</i></label>  
                               <div class="cutOffLine" style="display:flex;flex-direction:row;">
                                    <label>标准</label>   
                                    <textarea rows="2" id="bz_zsf" readonly>${item_c[i].bz_zsf}</textarea>
                               </div>  
                                <div class="cutOffLine" style="display:flex;flex-direction:row;">
                                    <label>金额</label>
                                    <textarea rows="2" id="zsf" readonly>${item_c[i].zsf}</textarea>
                               </div> 
                          </div>
                          <div class="mui-col-xs-4 cutOffLine" style="display:flex;flex-direction:column;">
                               <label>餐费<i style="color:red;">*</i></label>
                               <div class="cutOffLine" style="display:flex;flex-direction:row;">
                                    <label>标准</label>
                                    <textarea rows="2" id="bz_cf" readonly>${item_c[i].bz_cf}</textarea>
                               </div>  
                                <div class="cutOffLine" style="display:flex;flex-direction:row;">
                                    <label>金额</label>
                                    <textarea rows="2" id="cf" readonly>${item_c[i].cf}</textarea>
                               </div> 
                          </div>   
                         <div class="mui-col-xs-4 cutOffLine" style="display:flex;flex-direction:column;">
                               <label>市内交通费<i style="color:red;">*</i></label>
                               <div class="cutOffLine" style="display:flex;flex-direction:row;">
                                    <label>标准</label>
                                    <textarea rows="2" id="bz_snjtf" readonly>${item_c[i].bz_snjtf}</textarea>
                               </div>  
                                <div class="cutOffLine" style="display:flex;flex-direction:row;">
                                    <label>金额</label>
                                    <textarea rows="2" id="snjtf" readonly>${item_c[i].snjtf}</textarea>
                               </div> 
                          </div>   
                      </div>
                      <div class="mui-row cutOffLine padding">
                           <div class="mui-col-xs-12" style="display:flex;">
                                <label>工作成效<i style="color:red;">*</i></label>
                                <textarea rows="2" id="rem" readonly>${item_c[i].rem}</textarea> 
                            </div>
                      </div>
            </div>

                  `;
        $("#mxlist").append(li);
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
            xml += `<fybx_travel_m>
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
          <sqje>${changeNullToEmpty(item.sqje)}</sqje>
            <jkje>${changeNullToEmpty(item.jkje)}</jkje>
            <chaosqqk>${item.chaosqqk}</chaosqqk>
            <chaobzqk>${item.chaobzqk}</chaobzqk>
            <chailvlb>${item.chailvlb}</chailvlb>
            <if_cj>${item.if_cj}</if_cj>
            <rem>${item.rem}</rem>
            <fyhj>${item.fyhj}</fyhj>
            <fyhjbz>${item.fyhjbz}</fyhjbz>
            <fyhjdx>${item.fyhjdx}</fyhjdx>
            <fybz>${item.fybz}</fybz>
            <djsl>${item.djsl}</djsl>
            <att>${item.att}</att>
        </fybx_travel_m>

                     `;
            for (var i = 0; i < item_c.length; i++) {
                xml += `
                         <fybx_travel_t>
            <RelationRowGuid>${i + 1}</RelationRowGuid>
            <RowPrimaryKeys>itemid=${item_c[i].itemid}</RowPrimaryKeys>
            <cfdate>${changeNullToEmpty(item_c[i].cfdate)}</cfdate >
            <dddate>${changeNullToEmpty(item_c[i].dddate)}</dddate>
            <cfdpro>${changeNullToEmpty(item_c[i].cfdpro)}</cfdpro>
            <cfdcity>${changeNullToEmpty(item_c[i].cfdcity)}</cfdcity>
            <cfdproid>${changeNullToEmpty(item_c[i].cfdproid)}</cfdproid>
            <mddpro>${changeNullToEmpty(item_c[i].mddpro)}</mddpro>
            <mddcity>${changeNullToEmpty(item_c[i].mddcity)}</mddcity>
            <mddproid>${changeNullToEmpty(item_c[i].mddproid)}</mddproid>
            <jtgj>${changeNullToEmpty(item_c[i].jtgj)}</jtgj>
            <rs>${changeNullToEmpty(item_c[i].rs)}</rs>
            <ccfy>${changeNullToEmpty(item_c[i].ccfy)}</ccfy>
            <ts>${changeNullToEmpty(item_c[i].ts)}</ts>
            <bz_zsf>${changeNullToEmpty(item_c[i].bz_zsf)}</bz_zsf>
            <zsf>${changeNullToEmpty(item_c[i].zsf)}</zsf>
            <bz_cf>${changeNullToEmpty(item_c[i].bz_cf)}</bz_cf>
            <cf>${changeNullToEmpty(item_c[i].cf)}</cf>
            <bz_snjtf>${changeNullToEmpty(item_c[i].bz_snjtf)}</bz_snjtf>
            <snjtf>${changeNullToEmpty(item_c[i].snjtf)}</snjtf>
            <qt>${changeNullToEmpty(item_c[i].qt)}</qt>
            <rem>${changeNullToEmpty(item_c[i].rem)}</rem>
        </fybx_travel_t>
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
        xml += `<fybx_travel_m>
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
            <sqje>${changeNullToEmpty(item.sqje)}</sqje>
            <jkje>${changeNullToEmpty(item.jkje)}</jkje>
            <chaosqqk>${item.chaosqqk}</chaosqqk>
            <chaobzqk>${item.chaobzqk}</chaobzqk>
            <chailvlb>${item.chailvlb}</chailvlb>
            <if_cj>${item.if_cj}</if_cj>
            <rem>${item.rem}</rem>
            <fyhj>${item.fyhj}</fyhj>
            <fyhjbz>${changeNullToEmpty(item.fyhjbz)}</fyhjbz>
            <fyhjdx>${item.fyhjdx}</fyhjdx>
            <fybz>${item.fybz}</fybz>
            <djsl>${item.djsl}</djsl>
            <att>${item.att}</att>
        </fybx_travel_m>

                     `;
        for (var i = 0; i < item_c.length; i++) {
            xml += `
                         <fybx_travel_t>
            <RelationRowGuid>${i + 1}</RelationRowGuid>
            <RowPrimaryKeys>itemid=${item_c[i].itemid}</RowPrimaryKeys>
            <cfdate>${changeNullToEmpty(item_c[i].cfdate)}</cfdate >
            <dddate>${changeNullToEmpty(item_c[i].dddate)}</dddate>
            <cfdpro>${changeNullToEmpty(item_c[i].cfdpro)}</cfdpro>
            <cfdcity>${changeNullToEmpty(item_c[i].cfdcity)}</cfdcity>
            <cfdproid>${changeNullToEmpty(item_c[i].cfdproid)}</cfdproid>
            <mddpro>${changeNullToEmpty(item_c[i].mddpro)}</mddpro>
            <mddcity>${changeNullToEmpty(item_c[i].mddcity)}</mddcity>
            <mddproid>${changeNullToEmpty(item_c[i].mddproid)}</mddproid>
            <jtgj>${changeNullToEmpty(item_c[i].jtgj)}</jtgj>
            <rs>${changeNullToEmpty(item_c[i].rs)}</rs>
            <ccfy>${changeNullToEmpty(item_c[i].ccfy)}</ccfy>
            <ts>${changeNullToEmpty(item_c[i].ts)}</ts>
            <bz_zsf>${changeNullToEmpty(item_c[i].bz_zsf)}</bz_zsf>
            <zsf>${changeNullToEmpty(item_c[i].zsf)}</zsf>
            <bz_cf>${changeNullToEmpty(item_c[i].bz_cf)}</bz_cf>
            <cf>${changeNullToEmpty(item_c[i].cf)}</cf>
            <bz_snjtf>${changeNullToEmpty(item_c[i].bz_snjtf)}</bz_snjtf>
            <snjtf>${changeNullToEmpty(item_c[i].snjtf)}</snjtf>
            <qt>${changeNullToEmpty(item_c[i].qt)}</qt>
            <rem>${changeNullToEmpty(item_c[i].rem)}</rem>
        </fybx_travel_t>
                       `;
        }
        xml += `
                       </FormData>
                    </XForm>
                   `;
        PostXml(xml);
    }
}