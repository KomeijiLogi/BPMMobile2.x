function prepMsg() {
    $("#sqdate").val(getNowFormatDate(2));
    tapEvent();
    var xml = `<?xml version= "1.0" ?>
                  <Requests>
                      <Params>
                      <Method>GetFormPostData</Method>
                      <ProcessName>集团本部差旅费(含招待)申请</ProcessName>
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
        $("#dept_no").val(item.dept_no);
        $("#dept_name").val(item.dept_name);
        $("#user_no").val(item.user_no);
        $("#user_name").val(item.user_name);
        $("#user_leadtitle").val(item.user_leadtitle);
    }).fail(function (e) {

    }).then(function () {
        searcHbudget();
    });
}
function searcHbudget() {
    var xml = `<?xml version= "1.0" ?>
                                 <Requests>
                                 <Params>
                                 <DataSource>BPM_EXPENSE</DataSource>
                                 <ID>p_fysq_travel</ID>
                                 <Type>1</Type>
                                 <Method>GetUserDataProcedure</Method>
                                 <ProcedureName>p_fysq_travel</ProcedureName>
                                 <Filter>
                                       <dep>${$("#dept_no").val()}</dep>
                                       <rq>${$("#sqdate").val()}</rq>              
                                 </Filter>
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
        var budgetData = provideData.Tables[0].Rows[0];
        console.log(provideData);
        $("#yueys").val(budgetData.amt);
        $("#yiyongys").val(budgetData.amt_yy);
        $("#keyongys").val(budgetData.amt_hz);
        if (budgetData.amt >= budgetData.amt_yy) {
            $("#feiyongsx").val('预算内');
            $("#chaoysqk").val('未超支');
        } else {
            $("#feiyongsx").val('超预算');
            var p = formartNumber(((budgetData.amt_yy) - (budgetData.amt)) / (budgetData.amt) * 100);
            $("#chaoysqk").val(p);
        }

    }).fail(function (e) {

    });

    var xml = `<?xml version= "1.0" ?>
                                 <Requests>
                                 <Params>
                                 <DataSource>BPM_EXPENSE</DataSource>
                                 <ID>p_fysq_entertain</ID>
                                 <Type>1</Type>
                                 <Method>GetUserDataProcedure</Method>
                                 <ProcedureName>p_fysq_entertain</ProcedureName>
                                 <Filter>
                                       <dep>${$("#dept_no").val()}</dep>
                                       <rq>${$("#sqdate").val()}</rq>              
                                 </Filter>
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
        var budgetData = provideData.Tables[0].Rows[0];
        console.log(provideData);
        $("#en_yueys").val(budgetData.amt);
        $("#en_yiyongys").val(budgetData.amt_yy);
        $("#en_keyongys").val(budgetData.amt_hz);
        if (budgetData.amt >= budgetData.amt_yy) {
            $("#en_feiyongsx").val('预算内');
            $("#en_chaoysqk").val('未超支');
        } else {
            $("#en_feiyongsx").val('超预算');
            var p = formartNumber(((budgetData.amt_yy) - (budgetData.amt)) / (budgetData.amt) * 100);
            $("#en_chaoysqk").val(p);
        }

    }).fail(function (e) {

    });
}
function tapEvent() {
    var comp_name_data = [
        {
            value: '',
            text: '威高集团有限公司'
        },
        {
            value: '',
            text: '威海威高国际医疗投资控股有限公司'
        },
        {
            value: '',
            text: '威海火炬高技术产业开发区威高管理学院职业培训学校'
        }
    ];
    showPicker('comp_name', comp_name_data);

    var chailvlb_data = [
        {
            value: '',
            text:'国内'
        },
        {
            value: '',
            text:'国外'
        },
        {
            value: '',
            text:'国外+国内'
        }
    ];
    var element = document.getElementById('chailvlb');

    var picker2 = new mui.PopPicker();

    picker2.setData(chailvlb_data);

    element.addEventListener('tap', function () {

        picker2.show(function (items) {

            element.value = items[0].text;
            switch (items[0].text) {
                case '国内':
                    $("#gntitle").show();
                    $("#gwtitle").hide();
                    $("#mxlist_gn").show();
                    $("#mxlist_gw").hide();
                    $("#tjmx_gn").show();
                    $("#tjmx_gw").hide();
                  
                    break;
                case '国外':
                    $("#gntitle").hide();
                    $("#gwtitle").show();
                    $("#mxlist_gn").hide();
                    $("#mxlist_gw").show();
                    $("#tjmx_gn").hide();
                    $("#tjmx_gw").show();
                    
                    break;
                case '国外+国内':
                    $("#gntitle").show();
                    $("#gwtitle").show();
                    $("#mxlist_gn").show();
                    $("#mxlist_gw").show();
                    $("#tjmx_gn").show();
                    $("#tjmx_gw").show();
                    break;
                default:
                    break;
            }
        });

    }, false);


    var zwjb_data = [
        {
            value: '',
            text:'总监'
        },
        {
            value: '',
            text:'部门经理'
        },
        {
            value: '',
            text:'科员、主管'
        }

    ];
    showPickerDelegate('body', '#zwjb', zwjb_data);
    var opts = { "type": "date", "beginYear": new Date().getFullYear() - 1, "endYear": new Date().getFullYear() + 3 };
    var picker3 = new mui.DtPicker(opts);

    $('body').on('tap','#qsdate', function () {
        var self = this;
        picker3.show(function (rs) {
            $(self).val(rs.text);
        });
    });
    $('body').on('tap', '#zzdate', function () {
        var self = this;
        picker3.show(function (rs) {
            $(self).val(rs.text);
        });
    });
    var jtgj_data = [
        {
            value: '',
            text:'飞机'
        },
        {
            value: '',
            text: '火车'
        },
        {
            value: '',
            text: '长途汽车'
        },
        {
            value: '',
            text:'轮船'
        },
        {
            value: '',
            text:'自驾'
        }
    ];
    var picker4 = new mui.PopPicker();
    picker4.setData(jtgj_data);
    $('body').off('tap');
    $('body').on('tap', '.jtgj', function () {
        var self = this;
        picker4.show(function (items) {
            self.value = (items[0].text);
        });
    });

    $("#tjmx_gn").on('tap', function () {
        var li = `<div id="mx">
                    <div class="mui-input-row itemtitle">
                        <label>明细列表项</label>
                        <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>
                    </div>
                    <div class="mui-row cutOffLine" style="padding:3vw;">
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>职务级别<i style="color:red;">*</i></label>
                            <textarea rows="2" id="zwjb" readonly placeholder="请选择"></textarea>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>出差时间<i style="color:red;">*</i></label>
                            <textarea rows="2" id="qsdate" readonly placeholder="请选择"></textarea>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>至</label>
                            <textarea rows="2" id="zzdate" readonly placeholder="请选择"></textarea>
                        </div>
                    </div>
                    <div class="mui-row cutOffLine" style="padding:3vw;">
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>出差地点(省)<i style="color:red;">*</i></label>
                            <textarea rows="2" id="dd_pro" class="city_collect" readonly placeholder="请选择"></textarea>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>出差地点(市)<i style="color:red;">*</i></label>
                            <textarea rows="2" id="dd_city" class="city_collect" readonly placeholder="请选择"></textarea>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>出差地区类别<i style="color:red;">*</i></label>
                            <textarea rows="2" id="dqlb" readonly></textarea>
                        </div>
                        <input type="hidden" id="citymid" readonly />
                    </div>
                    <div class="mui-row cutOffLine" style="padding:3vw;">
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>交通工具<i style="color:red;">*</i></label>
                            <textarea rows="2" id="jtgj" class="jtgj" readonly placeholder="请选择"></textarea>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>出差人数<i style="color:red;">*</i></label>
                            <input type="number" id="ccrs" placeholder="请填写" />
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>出差天数<i style="color:red;">*</i></label>
                            <input type="number" id="ccts" placeholder="请填写" />
                        </div>
                    </div>
                    <input type="hidden" id="drccbz" readonly />
                    <input type="hidden" id="ccbz" readonly />
                </div>
                 `;
        $("#mxlist_gn").append(li);
    });
    

    $('.city_collect').on('tap', function () {
        console.log('111');
        
        $(".city_collect").showCityPicker({
            targetEle: '.city_collect',           //目标元素
            isDelegate: true,       //是否多个子表使用，true为是，false为否
            cityId: 'dd_city',              //城市元素id
            proId: 'dd_pro',               //省份id  
            citytype: 'dqlb',             //城市类型，如果需要显性输出，那么填写对应选择器，如果隐形输出，那么不填即可
            isForeign: false         //是否国外，true 为国外，false为国内 
        });

    });
    $('.state_collect').on('tap', function () {
        console.log('222');
        $(".state_collect").showCityPicker({
            targetEle: '.state_collect',           //目标元素
            isDelegate: true,       //是否多个子表使用，true为是，false为否
            cityId: 'dd_city',              //城市元素id
            proId: 'dd_pro',               //省份id  
            citytype: '',             //城市类型，如果需要显性输出，那么填写对应选择器，如果隐形输出，那么不填即可
            isForeign: true         //是否国外，true 为国外，false为国内 
        });
    });
}


var item = null;
var item_c1 = [];
var item_c3 = [];
var item_c2 = [];
function initData(data, flag) {
    item = data.FormDataSet.fysq_travelentertain_m[0];

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
    $("#en_yueys").val(item.en_yueys);
    $("#en_yiyongys").val(item.en_yiyongys);
    $("#en_keyongys").val(item.en_keyongys);
    $("#en_feiyongsx").val(item.en_feiyongsx);
    $("#en_chaoysqk").val(item.en_chaoysqk);
    $("#chailvlb").val(item.chailvlb);
    $("#shifoujk").val(item.shifoujk);
    $("#tren_amt_z").val(item.tren_amt_z);
    $("#tren_amt_zdx").val(item.tren_amt_zdx);
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
    $("#en_amt_z").val(item.en_amt_z);
    $("#en_amt_zdx").val(item.en_amt_zdx);

    $("#jkje").val(item.jkje);
    $("#jkjedx").val(item.jkjedx);
    $("#jkcode").val(item.jkcode);
    $("#jkrem").val(item.jkrem);

    if (item.shifoujk == '是') {
        $("#fjkcard").show();
    } else {
        $("#fjkcard").hide();
    }




    item_c1 = data.FormDataSet.fysq_travelentertain_t1;
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

    item_c3 = data.FormDataSet.fysq_travelentertain_t3;
    for (var i = 0; i < item_c3.length; i++) {
        var li = `<div id="mx">
                        <div class="mui-input-row itemtitle">       
                              <label>明细列表项</label>       
                              <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>
                        </div>
                          <div class="mui-row cutOffLine padding">
                             <div class="mui-col-xs-3" style="display:flex;">
                               <label>职务级别<i style="color:red;">*</i></label>
                               <textarea rows="2" id="zwjb" readonly>${item_c3[i].zwjb}</textarea>
                            </div>
                             <div class="mui-col-xs-3" style="display:flex;">
                               <label>出差时间<i style="color:red;">*</i></label>
                               <textarea rows="2" id="qsdate" readonly>${FormatterTimeYMS(item_c3[i].qsdate)}</textarea >
                            </div>
                            <div class="mui-col-xs-3" style="display:flex;">                              
                               <textarea rows="2" id="zzdate" readonly>${FormatterTimeYMS(item_c3[i].zzdate)}</textarea >
                            </div>
                             <div class="mui-col-xs-3" style="display:flex;">
                               <label>交通工具<i style="color:red;">*</i></label>
                               <textarea rows="2" id="jtgj" readonly>${(item_c3[i].jtgj)}</textarea >
                            </div>  
                         </div>
                            <div class="mui-row cutOffLine padding">
                           <div class="mui-col-xs-3" style="display:flex;">
                               <label>出差地点<i style="color:red;">*</i></label>
                               <textarea rows="2" id="dd_pro" readonly>${item_c3[i].dd_pro}</textarea>
                            </div>
                            <div class="mui-col-xs-3" style="display:flex;">                              
                               <textarea rows="2" id="dd_city" readonly>${item_c3[i].dd_city}</textarea>
                               
                            </div>
                           
                              <div class="mui-col-xs-3" style="display:flex;">
                               <label>出差人数<i style="color:red;">*</i></label>
                               <textarea rows="2" id="ccrs" readonly>${item_c3[i].ccrs}</textarea>
                            </div>
                             <div class="mui-col-xs-3" style="display:flex;">
                               <label>出差天数<i style="color:red;">*</i></label>
                               <textarea rows="2" id="ccts" readonly>${item_c3[i].ccts}</textarea>
                            </div>
                        </div>
                       
                    </div>
                     `;
        $("#mxlist_gw").append(li);
    }
    item_c2 = data.FormDataSet.fysq_travelentertain_t2;
    for (var i = 0; i < item_c2.length; i++) {
        var li = `<div id="mx">
                        <div class="mui-input-row itemtitle">       
                              <label>明细列表项</label>       
                              <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>
                        </div>
                        <div class="mui-row cutOffLine padding">
                             <div class="mui-col-xs-3" style="display:flex;">
                               <label>招待人数<i style="color:red;">*</i></label>
                               <textarea rows="2" id="zdrs" readonly>${item_c2[i].zdrs}</textarea>
                            </div>
                             <div class="mui-col-xs-3" style="display:flex;">
                               <label>单人招待标准<i style="color:red;">*</i></label>
                               <textarea rows="2" id="zdbz" readonly>${item_c2[i].zdbz}</textarea>
                            </div>
                             <div class="mui-col-xs-3" style="display:flex;">
                               <label>申请金额</label>
                               <textarea rows="2" id="sqje" readonly>${item_c2[i].sqje}</textarea>
                            </div>
                               <div class="mui-col-xs-3" style="display:flex;">
                               <label>招待城市<i style="color:red;">*</i></label>
                               <textarea rows="2" id="zdcity" readonly>${item_c2[i].zdcity}</textarea>
                            </div>
                       </div>
                        <div class="mui-row cutOffLine padding">
                             <div class="mui-col-xs-3" style="display:flex;">
                               <label>招待地点</label>
                               <textarea rows="2" id="zddd" readonly>${item_c2[i].zddd}</textarea>
                            </div>
                            <div class="mui-col-xs-9" style="display:flex;">
                               <label>事项描述及预期实现目标<i style="color:red;">*</i></label>
                               <textarea rows="2" id="rem" readonly>${item_c2[i].rem}</textarea>
                            </div>
                        </div>
                  </div>
                 `;
        $("#mxlist_zd").append(li);
    }
    if (item.chailvlb == '国内') {
        $("#mxlist_gw").hide();
    } else if (item.chailvlb == '国外') {
        $("#mxlist_gn").hide();
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
                        <fysq_travelentertain_m>
            <lscode>${item.lscode}</lscode>
            <comp_name>${item.comp_name}</comp_name>
            <dept_no>${item.dept_no}</dept_no>
            <dept_name>${item.dept_name}</dept_name>
            <user_no>${item.user_no}</user_no>
            <user_name>${item.user_name}</user_name>
            <sqdate>${item.sqdate}</sqdate>
            <user_leadtitle>${item.user_leadtitle}</user_leadtitle>
            <yueys>${item.yueys}</yueys>
            <yiyongys>${item.yiyongys}</yiyongys>
            <keyongys>${item.keyongys}</keyongys>
            <feiyongsx>${item.feiyongsx}</feiyongsx>
            <chaoysqk>${item.chaoysqk}</chaoysqk>
            <en_yueys>${item.en_yueys}</en_yueys>
            <en_yiyongys>${item.en_yiyongys}</en_yiyongys>
            <en_keyongys>${item.en_keyongys}</en_keyongys>
            <en_feiyongsx>${item.en_feiyongsx}</en_feiyongsx>
            <en_chaoysqk>${item.en_chaoysqk}</en_chaoysqk>
            <chailvlb>${item.chailvlb}</chailvlb>
            <shifoujk>${item.shifoujk}</shifoujk>
            <tren_amt_z>${item.tren_amt_z}</tren_amt_z>
            <tren_amt_zdx>${item.tren_amt_zdx}</tren_amt_zdx>
            <beizhu>${item.beizhu}</beizhu>
			
            <if_verify>${item.if_verify}</if_verify>
            <if_bx>${item.if_bx}</if_bx>
            
            <fyqf>${item.fyqf}</fyqf>
            <fyqr>${item.fyqr}</fyqr>
            <fphone>${item.fphone}</fphone>
            <fcz>${item.fcz}</fcz>
           <amt_ct>${changeNullToEmpty(item.amt_ct)}</amt_ct>
            <chuchairw>${item.chuchairw}</chuchairw>
            <amt_zs_yxts>${changeNullToEmpty(item.amt_zs_yxts)}</amt_zs_yxts>
            <amt_zs_fxbz>${changeNullToEmpty(item.amt_zs_fxbz)}</amt_zs_fxbz>
            <amt_zs>${changeNullToEmpty(item.amt_zs)}</amt_zs>
            <chaobzqk>${item.chaobzqk}</chaobzqk>
            <amt_cf_yxts>${changeNullToEmpty(item.amt_cf_yxts)}</amt_cf_yxts>
            <amt_cf_fxbz>${changeNullToEmpty(item.amt_cf_fxbz)}</amt_cf_fxbz>
            <amt_cf>${changeNullToEmpty(item.amt_cf)}</amt_cf>
            <amt_sn_yxts>${changeNullToEmpty(item.amt_sn_yxts)}</amt_sn_yxts>
            <amt_sn_fxbz>${changeNullToEmpty(item.amt_sn_fxbz)}</amt_sn_fxbz>
            <amt_sn>${changeNullToEmpty(item.amt_sn)}</amt_sn>
            <amt_qt>${changeNullToEmpty(item.amt_qt)}</amt_qt>
            <amt_zmx>${changeNullToEmpty(item.amt_zmx)}</amt_zmx>
            <amt_z>${changeNullToEmpty(item.amt_z)}</amt_z>
            <amt_zdx>${item.amt_zdx}</amt_zdx>
            <en_amt_z>${changeNullToEmpty(item.en_amt_z)}</en_amt_z>
            <en_amt_zdx>${item.en_amt_zdx}</en_amt_zdx>
			
            <jkje>${changeNullToEmpty(item.jkje)}</jkje>
            <jkjedx>${item.jkjedx}</jkjedx>
            <jkcode>${item.jkcode}</jkcode>
            <jkrem>${item.jkrem}</jkrem>
        </fysq_travelentertain_m>
                   `;
            for (var i = 0; i < item_c1.length; i++) {
                xml += `
                          <fysq_travelentertain_t1>
            <RelationRowGuid>${i + 1}</RelationRowGuid>
            <RowPrimaryKeys>itemid=${item_c1[i].itemid}</RowPrimaryKeys>
            <zwjb>${item_c1[i].zwjb}</zwjb>
            <qsdate>${item_c1[i].qsdate}</qsdate>
            <zzdate>${item_c1[i].zzdate}</zzdate>
            <jtgj>${item_c1[i].jtgj}</jtgj>
            <dd_pro>${item_c1[i].dd_pro}</dd_pro>
            <dd_city>${item_c1[i].dd_city}</dd_city>
            <citymid>${item_c1[i].citymid}</citymid>
            <dqlb>${item_c1[i].dqlb}</dqlb>
            <ccrs>${changeNullToEmpty(item_c1[i].ccrs)}</ccrs>
            <ccts>${changeNullToEmpty(item_c1[i].ccts)}</ccts>
            <drccbz>${item_c1[i].drccbz}</drccbz>
            <ccbz>${item_c1[i].ccbz}</ccbz>
        </fysq_travelentertain_t1>
                         `;
            }
            for (var i = 0; i < item_c3.length; i++) {
                xml += `
                       <fysq_travelentertain_t3>
            <RelationRowGuid>${item_c1.length + 1 + i}</RelationRowGuid>
            <RowPrimaryKeys>itemid=${item_c3[i].itemid}</RowPrimaryKeys>
            <zwjb>${changeNullToEmpty(item_c3[i].zwjb)}</zwjb>
            <qsdate>${changeNullToEmpty(item_c3[i].qsdate)}</qsdate>
            <zzdate>${changeNullToEmpty(item_c3[i].zzdate)}</zzdate>
            <jtgj>${changeNullToEmpty(item_c3[i].jtgj)}</jtgj>
            <dd_pro>${changeNullToEmpty(item_c3[i].dd_pro)}</dd_pro>
            <dd_city>${changeNullToEmpty(item_c3[i].dd_city)}</dd_city>
            <ccrs>${changeNullToEmpty(item_c3[i].ccrs)}</ccrs>
            <ccts>${changeNullToEmpty(item_c3[i].ccts)}</ccts>
        </fysq_travelentertain_t3>
                       `;
            }
            for (var i = 0; i < item_c2.length; i++) {
                xml += `
                       <fysq_travelentertain_t2>
            <RelationRowGuid>${item_c1.length + item_c3.length + i + 1}</RelationRowGuid>
            <RowPrimaryKeys>itemid=${item_c2[i].itemid}</RowPrimaryKeys>
            <zdrs>${item_c2[i].zdrs}</zdrs>
            <zdbz>${item_c2[i].zdbz}</zdbz>
            <sqje>${item_c2[i].sqje}</sqje>
            <zdcity>${item_c2[i].zdcity}</zdcity>
            <zddd>${item_c2[i].zddd}</zddd>
            <rem>${item_c2[i].rem}</rem>
        </fysq_travelentertain_t2>
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
                        <fysq_travelentertain_m>
            <lscode>${item.lscode}</lscode>
            <comp_name>${item.comp_name}</comp_name>
            <dept_no>${item.dept_no}</dept_no>
            <dept_name>${item.dept_name}</dept_name>
            <user_no>${item.user_no}</user_no>
            <user_name>${item.user_name}</user_name>
            <sqdate>${item.sqdate}</sqdate>
            <user_leadtitle>${item.user_leadtitle}</user_leadtitle>
            <yueys>${item.yueys}</yueys>
            <yiyongys>${item.yiyongys}</yiyongys>
            <keyongys>${item.keyongys}</keyongys>
            <feiyongsx>${item.feiyongsx}</feiyongsx>
            <chaoysqk>${item.chaoysqk}</chaoysqk>
            <en_yueys>${item.en_yueys}</en_yueys>
            <en_yiyongys>${item.en_yiyongys}</en_yiyongys>
            <en_keyongys>${item.en_keyongys}</en_keyongys>
            <en_feiyongsx>${item.en_feiyongsx}</en_feiyongsx>
            <en_chaoysqk>${item.en_chaoysqk}</en_chaoysqk>
            <chailvlb>${item.chailvlb}</chailvlb>
            <shifoujk>${item.shifoujk}</shifoujk>
            <tren_amt_z>${item.tren_amt_z}</tren_amt_z>
            <tren_amt_zdx>${item.tren_amt_zdx}</tren_amt_zdx>
            <beizhu>${item.beizhu}</beizhu>
			
            <if_verify>${item.if_verify}</if_verify>
            <if_bx>${item.if_bx}</if_bx>
            <fyqf>${item.fyqf}</fyqf>
            <fyqr>${item.fyqr}</fyqr>
            <fphone>${item.fphone}</fphone>
            <fcz>${item.fcz}</fcz>
            <amt_ct>${changeNullToEmpty(item.amt_ct)}</amt_ct>
            <chuchairw>${item.chuchairw}</chuchairw>
            <amt_zs_yxts>${changeNullToEmpty(item.amt_zs_yxts)}</amt_zs_yxts>
            <amt_zs_fxbz>${changeNullToEmpty(item.amt_zs_fxbz)}</amt_zs_fxbz>
            <amt_zs>${changeNullToEmpty(item.amt_zs)}</amt_zs>
            <chaobzqk>${item.chaobzqk}</chaobzqk>
            <amt_cf_yxts>${changeNullToEmpty(item.amt_cf_yxts)}</amt_cf_yxts>
            <amt_cf_fxbz>${changeNullToEmpty(item.amt_cf_fxbz)}</amt_cf_fxbz>
            <amt_cf>${changeNullToEmpty(item.amt_cf)}</amt_cf>
            <amt_sn_yxts>${changeNullToEmpty(item.amt_sn_yxts)}</amt_sn_yxts>
            <amt_sn_fxbz>${changeNullToEmpty(item.amt_sn_fxbz)}</amt_sn_fxbz>
            <amt_sn>${changeNullToEmpty(item.amt_sn)}</amt_sn>
            <amt_qt>${changeNullToEmpty(item.amt_qt)}</amt_qt>
            <amt_zmx>${changeNullToEmpty(item.amt_zmx)}</amt_zmx>
            <amt_z>${changeNullToEmpty(item.amt_z)}</amt_z>
            <amt_zdx>${item.amt_zdx}</amt_zdx>
            <en_amt_z>${changeNullToEmpty(item.en_amt_z)}</en_amt_z>
            <en_amt_zdx>${item.en_amt_zdx}</en_amt_zdx>

            <jkje>${changeNullToEmpty(item.jkje)}</jkje >
            <jkjedx>${item.jkjedx}</jkjedx>
            <jkcode>${item.jkcode}</jkcode>
            <jkrem>${item.jkrem}</jkrem>
        </fysq_travelentertain_m>
                   `;
        for (var i = 0; i < item_c1.length; i++) {
            xml += `
                          <fysq_travelentertain_t1>
            <RelationRowGuid>${i + 1}</RelationRowGuid>
            <RowPrimaryKeys>itemid=${item_c1[i].itemid}</RowPrimaryKeys>
            <zwjb>${item_c1[i].zwjb}</zwjb>
            <qsdate>${item_c1[i].qsdate}</qsdate>
            <zzdate>${item_c1[i].zzdate}</zzdate>
            <jtgj>${item_c1[i].jtgj}</jtgj>
            <dd_pro>${item_c1[i].dd_pro}</dd_pro>
            <dd_city>${item_c1[i].dd_city}</dd_city>
            <citymid>${item_c1[i].citymid}</citymid>
            <dqlb>${item_c1[i].dqlb}</dqlb>
            <ccrs>${changeNullToEmpty(item_c1[i].ccrs)}</ccrs>
            <ccts>${changeNullToEmpty(item_c1[i].ccts)}</ccts>
            <drccbz>${item_c1[i].drccbz}</drccbz>
            <ccbz>${item_c1[i].ccbz}</ccbz>
        </fysq_travelentertain_t1>
                         `;
        }
        for (var i = 0; i < item_c3.length; i++) {
            xml += `
                       <fysq_travelentertain_t3>
            <RelationRowGuid>${item_c1.length + 1 + i}</RelationRowGuid>
            <RowPrimaryKeys>itemid=${item_c3[i].itemid}</RowPrimaryKeys>
            <zwjb>${changeNullToEmpty(item_c3[i].zwjb)}</zwjb>
            <qsdate>${changeNullToEmpty(item_c3[i].qsdate)}</qsdate>
            <zzdate>${changeNullToEmpty(item_c3[i].zzdate)}</zzdate>
            <jtgj>${changeNullToEmpty(item_c3[i].jtgj)}</jtgj>
            <dd_pro>${changeNullToEmpty(item_c3[i].dd_pro)}</dd_pro>
            <dd_city>${changeNullToEmpty(item_c3[i].dd_city)}</dd_city>
            <ccrs>${changeNullToEmpty(item_c3[i].ccrs)}</ccrs>
            <ccts>${changeNullToEmpty(item_c3[i].ccts)}</ccts>
        </fysq_travelentertain_t3>
                       `;
        }
        for (var i = 0; i < item_c2.length; i++) {
            xml += `
                       <fysq_travelentertain_t2>
            <RelationRowGuid>${item_c1.length + item_c3.length + i + 1}</RelationRowGuid>
            <RowPrimaryKeys>itemid=${item_c2[i].itemid}</RowPrimaryKeys>
            <zdrs>${item_c2[i].zdrs}</zdrs>
            <zdbz>${item_c2[i].zdbz}</zdbz>
            <sqje>${item_c2[i].sqje}</sqje>
            <zdcity>${item_c2[i].zdcity}</zdcity>
            <zddd>${item_c2[i].zddd}</zddd>
            <rem>${item_c2[i].rem}</rem>
        </fysq_travelentertain_t2>
                       `;
        }
        xml += `
                       </FormData>
                    </XForm>
                   `;
        //console.log(xml);
        PostXml(xml);
    }
}