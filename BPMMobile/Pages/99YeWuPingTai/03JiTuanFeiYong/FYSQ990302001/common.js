function prepMsg() {

}

var item = null;
var item_c1 = [];
var item_c2 = [];
function initData(data, flag) {
    item = data.FormDataSet.fysq_travel_m[0];

    if (flag) {
        $("#taskId").val(item.taskid);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.lscode);
    }
    $("#comp_name").val(item.comp_name);
    $("#dept_no").val(item.dept_no);
    $("#dept_name").val(item.dept_name);
    $("#user_no").val(item.user_no);
    $("#user_name").val(item.user_name);
    $("#sqdate").val(FormatterTimeYMS(item.sqdate));
    $("#user_leadtitle").val(item.user_leadtitle);
    $("#yueys").val(item.yueys);
    $("#yiyongys").val(item.yiyongys);
    $("#keyongys").val(item.keyongys);
    $("#feiyongsx").val(item.feiyongsx);
    $("#chaoysqk").val(item.chaoysqk);
    $("#chailvlb").val(item.chailvlb);
    $("#shifoujk").val(item.shifoujk);
    if (item.shifoujk == '是') {
        $("#fjkcard").show();
    } else {
        $("#fjkcard").hide();
    }
    $("#beizhu").val(item.beizhu);
    $("#if_verify").val(item.if_verify);
    $("#if_bx").val(item.if_bx);
    $("#fyqf").val(item.fyqf);
    $("#fyqr").val(item.fyqr);
    $("#fphone").val(item.fphone);
    $("#fcz").val(item.fcz);
    $("#amt_ct").val(item.amt_ct);
    $("#chuchairw").val(item.chuchairw);
    $("#amt_zs_yxts").val(item.amt_zs_yxts);
    $("#amt_zs_fxbz").val(item.amt_zs_fxbz);
    $("#amt_zs").val(item.amt_zs);
    $("#chaobzqk").val(item.chaobzqk);
    $("#amt_cf_yxts").val(item.amt_cf_yxts);
    $("#amt_cf_fxbz").val(item.amt_cf_fxbz);
    $("#amt_cf").val(item.amt_cf);
    $("#amt_sn_yxts").val(item.amt_sn_yxts);
    $("#amt_sn_fxbz").val(item.amt_sn_fxbz);
    $("#amt_sn").val(item.amt_sn);
    $("#amt_qt").val(item.amt_qt);
    $("#amt_zmx").val(item.amt_zmx);
    $("#amt_z").val(item.amt_z);
    $("#amt_zdx").val(item.amt_zdx);
    $("#jkje").val(item.jkje);
    $("#jkjedx").val(item.jkjedx);
    $("#jkcode").val(item.jkcode);
    $("#jkrem").val(item.jkrem);
    if (String(item.chailvlb).match('国内') == null) {
        $("#mxlist_gn").hide();
    } else if (String(item.chailvlb).match('国外') == null) {
        $("#mxlist_gw").hide();
    }

    item_c1 = data.FormDataSet.fysq_travel_t;
    for (var i = 0; i < item_c1.length; i++) {

        var li = ` <div id="mx">
                        <div class="mui-input-row itemtitle">       
                              <label>明细列表项</label>       
                              <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>
                        </div>
                        <div class="mui-row cutOffLine padding">
                             <div class="mui-col-xs-3" style="display:flex;">
                               <label>职务级别<i style="color:red;">*</i></label>
                               <textarea rows="2" id="zwjb" readonly>${item_c1[i].zwjb}</textarea>
                            </div>
                             <div class="mui-col-xs-3" style="display:flex;">
                               <label>出差时间<i style="color:red;">*</i></label>
                               <textarea rows="2" id="qsdate" readonly>${FormatterTimeYMS(item_c1[i].qsdate)}</textarea >
                            </div>
                            <div class="mui-col-xs-3" style="display:flex;">                              
                               <textarea rows="2" id="zzdate" readonly>${FormatterTimeYMS(item_c1[i].zzdate)}</textarea >
                            </div>
                             <div class="mui-col-xs-3" style="display:flex;">
                               <label>交通工具<i style="color:red;">*</i></label>
                               <textarea rows="2" id="jtgj" readonly>${(item_c1[i].jtgj)}</textarea >
                            </div>  
                        </div>
                        <div class="mui-row cutOffLine padding">
                           <div class="mui-col-xs-3" style="display:flex;">
                               <label>出差地点<i style="color:red;">*</i></label>
                               <textarea rows="2" id="dd_pro" readonly>${item_c1[i].dd_pro}</textarea>
                            </div>
                            <div class="mui-col-xs-3" style="display:flex;">                              
                               <textarea rows="2" id="dd_city" readonly>${item_c1[i].dd_city}</textarea>
                                <input type="hidden" id="citymid" readonly value="${item_c1[i].citymid}"/>
                            </div>
                           <div class="mui-col-xs-3" style="display:flex;">
                               <label>出差地区类别<i style="color:red;">*</i></label>
                               <textarea rows="2" id="dqlb" readonly>${item_c1[i].dqlb}</textarea>
                            </div>
                              <div class="mui-col-xs-3" style="display:flex;">
                               <label>出差人数<i style="color:red;">*</i></label>
                               <textarea rows="2" id="ccrs" readonly>${item_c1[i].ccrs}</textarea>
                            </div>
                        </div>
                        <div class="mui-row cutOffLine padding">
                            <div class="mui-col-xs-3" style="display:flex;">
                               <label>出差天数<i style="color:red;">*</i></label>
                               <textarea rows="2" id="ccts" readonly>${item_c1[i].ccts}</textarea>
                            </div>
                             <input type="hidden" id="drccbz" readonly value="${item_c1[i].drccbz}"/>
                             <input type="hidden" id="ccbz" readonly value="${item_c1[i].ccbz}"/>
                         </div>
                    </div>

                 `;
        $("#mxlist_gn").append(li);

    }
    item_c2 = data.FormDataSet.fysq_travel_t1;
    for (var i = 0; i < item_c2.length; i++) {
        var li = `<div id="mx">
                        <div class="mui-input-row itemtitle">       
                              <label>明细列表项</label>       
                              <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>
                        </div>
                          <div class="mui-row cutOffLine padding">
                             <div class="mui-col-xs-3" style="display:flex;">
                               <label>职务级别<i style="color:red;">*</i></label>
                               <textarea rows="2" id="zwjb" readonly>${item_c2[i].zwjb}</textarea>
                            </div>
                             <div class="mui-col-xs-3" style="display:flex;">
                               <label>出差时间<i style="color:red;">*</i></label>
                               <textarea rows="2" id="qsdate" readonly>${FormatterTimeYMS(item_c2[i].qsdate)}</textarea >
                            </div>
                            <div class="mui-col-xs-3" style="display:flex;">                              
                               <textarea rows="2" id="zzdate" readonly>${FormatterTimeYMS(item_c2[i].zzdate)}</textarea >
                            </div>
                             <div class="mui-col-xs-3" style="display:flex;">
                               <label>交通工具<i style="color:red;">*</i></label>
                               <textarea rows="2" id="jtgj" readonly>${(item_c2[i].jtgj)}</textarea >
                            </div>  
                         </div>
                            <div class="mui-row cutOffLine padding">
                           <div class="mui-col-xs-3" style="display:flex;">
                               <label>出差地点<i style="color:red;">*</i></label>
                               <textarea rows="2" id="dd_pro" readonly>${item_c2[i].dd_pro}</textarea>
                            </div>
                            <div class="mui-col-xs-3" style="display:flex;">                              
                               <textarea rows="2" id="dd_city" readonly>${item_c2[i].dd_city}</textarea>
                               
                            </div>
                           
                              <div class="mui-col-xs-3" style="display:flex;">
                               <label>出差人数<i style="color:red;">*</i></label>
                               <textarea rows="2" id="ccrs" readonly>${item_c2[i].ccrs}</textarea>
                            </div>
                             <div class="mui-col-xs-3" style="display:flex;">
                               <label>出差天数<i style="color:red;">*</i></label>
                               <textarea rows="2" id="ccts" readonly>${item_c2[i].ccts}</textarea>
                            </div>
                        </div>
                       
                    </div>
                     `;
        $("#mxlist_gw").append(li);
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
                     <fysq_travel_m>
            <lscode>${item.lscode}</lscode>
            <comp_name>${item.comp_name}</comp_name>
            <dept_no>${item.dept_no}</dept_no>
            <dept_name>${item.dept_name}</dept_name>
            <user_name>${item.user_name}</user_name>
            <user_no>${item.user_no}</user_no>
            <sqdate>${item.sqdate}</sqdate>
            <user_leadtitle>${item.user_leadtitle}</user_leadtitle>
            <yueys>${item.yueys}</yueys>
            <keyongys>${item.keyongys}</keyongys>
            <yiyongys>${item.yiyongys}</yiyongys>
            <feiyongsx>${item.feiyongsx}</feiyongsx>
            <chaoysqk>${item.chaoysqk}</chaoysqk>
            <chailvlb>${item.chailvlb}</chailvlb>
            <shifoujk>${item.shifoujk}</shifoujk>
            <beizhu>${item.beizhu}</beizhu>
            <if_verify>${changeNullToEmpty(item.if_verify)}</if_verify>
            <if_bx>${changeNullToEmpty(item.if_bx)}</if_bx>
            <fyqf>${item.fyqf}</fyqf>
            <fyqr>${item.fyqr}</fyqr>
            <fphone>${item.fphone}</fphone>
            <fcz>${item.fcz}</fcz>
            <amt_ct>${item.amt_ct}</amt_ct>
            <chuchairw>${item.chuchairw}</chuchairw>
            <amt_zs_yxts>${item.amt_zs_yxts}</amt_zs_yxts>
            <amt_zs_fxbz>${item.amt_zs_fxbz}</amt_zs_fxbz>
            <amt_zs>${item.amt_zs}</amt_zs>
            <chaobzqk>${item.chaobzqk}</chaobzqk>
            <amt_cf_yxts>${item.amt_cf_yxts}</amt_cf_yxts>
            <amt_cf_fxbz>${item.amt_cf_fxbz}</amt_cf_fxbz>
            <amt_cf>${item.amt_cf}</amt_cf>
            <amt_sn_yxts>${item.amt_sn_yxts}</amt_sn_yxts>
            <amt_sn_fxbz>${item.amt_sn_fxbz}</amt_sn_fxbz>
            <amt_sn>${item.amt_sn}</amt_sn>
            <amt_qt>${item.amt_qt}</amt_qt>
            <amt_zmx>${item.amt_zmx}</amt_zmx>
            <amt_z>${item.amt_z}</amt_z>
            <amt_zdx>${item.amt_zdx}</amt_zdx>
            <jkje>${changeNullToEmpty(item.jkje)}</jkje>
            <jkjedx>${item.jkjedx}</jkjedx>
            <jkcode>${item.jkcode}</jkcode>
            <jkrem>${item.jkrem}</jkrem>
        </fysq_travel_m>
                    `;
            for (var i = 0; i < item_c1.length; i++) {
                xml += `
        <fysq_travel_t>
            <RelationRowGuid>${i + 1}</RelationRowGuid>
            <RowPrimaryKeys>itemid=${item_c1[i].itemid}</RowPrimaryKeys>
            <zwjb>${item_c1[i].zwjb}</zwjb>
            <qsdate>${changeNullToEmpty(item_c1[i].qsdate)}</qsdate>
            <zzdate>${changeNullToEmpty(item_c1[i].zzdate)}</zzdate>
            <jtgj>${item_c1[i].jtgj}</jtgj>
            <dd_pro>${item_c1[i].dd_pro}</dd_pro>
            <dd_city>${item_c1[i].dd_city}</dd_city>
            <citymid>${item_c1[i].citymid}</citymid>
            <dqlb>${item_c1[i].dqlb}</dqlb>
           <ccrs>${changeNullToEmpty(item_c1[i].ccrs)}</ccrs>
            <ccts>${changeNullToEmpty(item_c1[i].ccts)}</ccts>
            <drccbz>${changeNullToEmpty(item_c1[i].drccbz)}</drccbz>
            <ccbz>${item_c1[i].ccbz}</ccbz>
        </fysq_travel_t>
                       `;
            }
            for (var i = 0; i < item_c2.length; i++) {
                xml += `
                           <fysq_travel_t1>
            <RelationRowGuid>${item_c1.length+i+1}</RelationRowGuid>
            <RowPrimaryKeys>itemid=${item_c2[i].itemid}</RowPrimaryKeys>
            <zwjb>${item_c2[i].zwjb}</zwjb>
            <qsdate>${changeNullToEmpty(item_c2[i].qsdate)}</qsdate>
            <zzdate>${changeNullToEmpty(item_c2[i].zzdate)}</zzdate>
            <jtgj>${item_c2[i].jtgj}</jtgj>
            <dd_pro>${item_c2[i].dd_pro}</dd_pro>
            <dd_city>${item_c2[i].dd_city}</dd_city>
       <ccrs>${changeNullToEmpty(item_c2[i].ccrs)}</ccrs>
            <ccts>${changeNullToEmpty(item_c2[i].ccts)}</ccts>
        </fysq_travel_t1>
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
                     <fysq_travel_m>
            <lscode>${item.lscode}</lscode>
            <comp_name>${item.comp_name}</comp_name>
            <dept_no>${item.dept_no}</dept_no>
            <dept_name>${item.dept_name}</dept_name>
            <user_name>${item.user_name}</user_name>
            <user_no>${item.user_no}</user_no>
            <sqdate>${item.sqdate}</sqdate>
            <user_leadtitle>${item.user_leadtitle}</user_leadtitle>
            <yueys>${item.yueys}</yueys>
            <keyongys>${item.keyongys}</keyongys>
            <yiyongys>${item.yiyongys}</yiyongys>
            <feiyongsx>${item.feiyongsx}</feiyongsx>
            <chaoysqk>${item.chaoysqk}</chaoysqk>
            <chailvlb>${item.chailvlb}</chailvlb>
            <shifoujk>${item.shifoujk}</shifoujk>
            <beizhu>${item.beizhu}</beizhu>
            <if_verify>${changeNullToEmpty(item.if_verify)}</if_verify>
            <if_bx>${changeNullToEmpty(item.if_bx)}</if_bx>
            <fyqf>${item.fyqf}</fyqf>
            <fyqr>${item.fyqr}</fyqr>
            <fphone>${item.fphone}</fphone>
            <fcz>${item.fcz}</fcz>
            <amt_ct>${item.amt_ct}</amt_ct>
            <chuchairw>${item.chuchairw}</chuchairw>
            <amt_zs_yxts>${item.amt_zs_yxts}</amt_zs_yxts>
            <amt_zs_fxbz>${item.amt_zs_fxbz}</amt_zs_fxbz>
            <amt_zs>${item.amt_zs}</amt_zs>
            <chaobzqk>${item.chaobzqk}</chaobzqk>
            <amt_cf_yxts>${item.amt_cf_yxts}</amt_cf_yxts>
            <amt_cf_fxbz>${item.amt_cf_fxbz}</amt_cf_fxbz>
            <amt_cf>${item.amt_cf}</amt_cf>
            <amt_sn_yxts>${item.amt_sn_yxts}</amt_sn_yxts>
            <amt_sn_fxbz>${item.amt_sn_fxbz}</amt_sn_fxbz>
            <amt_sn>${item.amt_sn}</amt_sn>
            <amt_qt>${item.amt_qt}</amt_qt>
            <amt_zmx>${item.amt_zmx}</amt_zmx>
            <amt_z>${item.amt_z}</amt_z>
            <amt_zdx>${item.amt_zdx}</amt_zdx>
            <jkje>${changeNullToEmpty(item.jkje)}</jkje>
            <jkjedx>${item.jkjedx}</jkjedx>
            <jkcode>${item.jkcode}</jkcode>
            <jkrem>${item.jkrem}</jkrem>
        </fysq_travel_m>
                    `;
        for (var i = 0; i < item_c1.length; i++) {
            xml += `
        <fysq_travel_t>
            <RelationRowGuid>${i + 1}</RelationRowGuid>
            <RowPrimaryKeys>itemid=${item_c1[i].itemid}</RowPrimaryKeys>
            <zwjb>${item_c1[i].zwjb}</zwjb>
            <qsdate>${changeNullToEmpty(item_c1[i].qsdate)}</qsdate>
            <zzdate>${changeNullToEmpty(item_c1[i].zzdate)}</zzdate>
            <jtgj>${item_c1[i].jtgj}</jtgj>
            <dd_pro>${item_c1[i].dd_pro}</dd_pro>
            <dd_city>${item_c1[i].dd_city}</dd_city>
            <citymid>${item_c1[i].citymid}</citymid>
            <dqlb>${item_c1[i].dqlb}</dqlb>
            <ccrs>${changeNullToEmpty(item_c1[i].ccrs)}</ccrs>
            <ccts>${changeNullToEmpty(item_c1[i].ccts)}</ccts>
            <drccbz>${changeNullToEmpty(item_c1[i].drccbz)}</drccbz>
            <ccbz>${item_c1[i].ccbz}</ccbz>
        </fysq_travel_t>
                       `;
        }
        for (var i = 0; i < item_c2.length; i++) {
            xml += `
                           <fysq_travel_t1>
            <RelationRowGuid>${item_c1.length + i + 1}</RelationRowGuid>
            <RowPrimaryKeys>itemid=${item_c2[i].itemid}</RowPrimaryKeys>
            <zwjb>${item_c2[i].zwjb}</zwjb>
            <qsdate>${changeNullToEmpty(item_c2[i].qsdate)}</qsdate>
            <zzdate>${changeNullToEmpty(item_c2[i].zzdate)}</zzdate>
            <jtgj>${item_c2[i].jtgj}</jtgj>
            <dd_pro>${item_c2[i].dd_pro}</dd_pro>
            <dd_city>${item_c2[i].dd_city}</dd_city>
            <ccrs>${changeNullToEmpty(item_c2[i].ccrs)}</ccrs>
            <ccts>${changeNullToEmpty(item_c2[i].ccts)}</ccts>
        </fysq_travel_t1>
                       `;
        }
        xml += `
                       </FormData>
                    </XForm>
                   `;
        console.log(xml);
        PostXml(xml);
    }


}