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
                    $(".city_collect").showCityPicker({
                        targetEle: '.city_collect',           //目标元素
                        isDelegate: true,       //是否多个子表使用，true为是，false为否
                        cityId: 'dd_city',              //城市元素id
                        proId: 'dd_pro',               //省份id  
                        citytype: 'dqlb',             //城市类型，如果需要显性输出，那么填写对应选择器，如果隐形输出，那么不填即可
                        isForeign: false         //是否国外，true 为国外，false为国内 
                    });
                    break;
                case '国外':
                    $("#gntitle").hide();
                    $("#gwtitle").show();
                    $("#mxlist_gn").hide();
                    $("#mxlist_gw").show();
                    $("#tjmx_gn").hide();
                    $("#tjmx_gw").show();
                    $(".state_collect").showCityPicker({
                        targetEle: '.state_collect',           //目标元素
                        isDelegate: true,       //是否多个子表使用，true为是，false为否
                        cityId: 'dd_city',              //城市元素id
                        proId: 'dd_pro',               //省份id  
                        citytype: 'dqlb',             //城市类型，如果需要显性输出，那么填写对应选择器，如果隐形输出，那么不填即可
                        isForeign: true         //是否国外，true 为国外，false为国内 
                    });
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
   
   
}