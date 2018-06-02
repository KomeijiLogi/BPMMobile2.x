function prepMsg() {
    tapEvent();
    $("#sqdate").val(getNowFormatDate(2));
    var xml = `<?xml version= "1.0" ?>
                  <Requests>
                      <Params>
                      <Method>GetFormPostData</Method>
                      <ProcessName>集团本部培训费申请</ProcessName>
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
        $("#comp_name").val(item.comp_name);       
        $("#user_leadtitle").val(item.user_leadtitle);
        $("#dept_name").val(item.dept_name);
        $("#dept_no").val(item.dept_no);
        $("#user_name").val(item.user_name);
        $("#user_no").val(item.user_no);


    }).fail(function (e) {


    }).then(function () {
        searcH();
    });


}

function tapEvent() {

    var fgsmcdata = [
        {
            value: '',
            text: '威高集团有限公司'
        },
        {
            value: '',
            text: '威海威高国际医疗投资控股有限公司'
        }
    ];
    //选择公司名称
    showPicker('comp_name', fgsmcdata);

    var fif_data = [
        {
            value: '',
            text:'是'
        },
        {
            value: '',
            text:'否'
        }
    ];
    var flb_data = [
        {
            value: '',
            text:'国内'
        },
        {
            value: '',
            text: '国外'
        }
    ];
    //选择差旅类别
    var element = document.getElementById('chailvlb');

    var picker = new mui.PopPicker();

    picker.setData(flb_data);

    element.addEventListener('tap', function () {

        picker.show(function (items) {

            element.value = items[0].text;
           
        });

    }, false);
     $(".city_collect").showCityPicker({
          targetEle: '.city_collect',           //目标元素
           isMixin: true,       //是否多个子表使用，true为是，false为否
           cityId: 'dd_city',              //城市元素id
           proId: 'dd_pro',               //省份id  
           citytype: 'dqlb',             //城市类型，如果需要显性输出，那么填写对应选择器，如果隐形输出，那么不填即可
           isForeign: false         //是否国外，true 为国外，false为国内 
    });

    //选择是否借款
    var element22 = document.getElementById('shifoujk');

    var picker22 = new mui.PopPicker();

    picker22.setData(fif_data);

    element22.addEventListener('tap', function () {

        picker22.show(function (items) {

            element22.value = items[0].text;
            if (items[0].text == '是') {
                $("#jkcard").show();

            } else {
                $("#jkcard").hide();
            }
        });

    }, false);

    //选择是否申请差旅费
    var element33 = document.getElementById('px_shifoucl');

    var picker33 = new mui.PopPicker();

    picker33.setData(fif_data);

    element33.addEventListener('tap', function () {

        picker33.show(function (items) {

            element33.value = items[0].text;
            if (items[0].text == '是') {
                $("#mxlist_travel").show();
                $("#tjmx_travel").show();
                $(".cantravel").removeAttr('readonly');
            } else {
                $("#mxlist_travel").hide();
                $("#tjmx_travel").hide();
                $(".cantravel").attr('readonly', 'readonly');
            }
        });

    }, false);

    //选择内部讲师是否外出学习
    var element44 = document.getElementById('nbjswcxx');

    var picker44 = new mui.PopPicker();

    picker44.setData(fif_data);

    element44.addEventListener('tap', function () {

        picker44.show(function (items) {

            element44.value = items[0].text;
            if (items[0].text == '是') {
                $("#fsxr_container").show();
            } else {
                $("#fsxr_container").hide();
            }
        });

    }, false);
    //选择受训人
    $("#fsxr").on('tap', function () {
        var opidArr = [];
        XuntongJSBridge.call('selectPerson', { 'pType': '1' }, function (result) {
            if (String(Object.prototype.toString.call(result)).match('String') != null) {
                result = JSON.parse(result);
            }

            if (result.success == true || result.success == "true") {

                for (var i = 0; i < result.data.persons.length; i++) {

                    opidArr.push(result.data.persons[i].openId);

                }
            }

            var getPerInfo = $.ajax({
                type: "POST",
                url: "/api/bpm/PostAccount",
                data: { "ids": opidArr },
                beforeSend: function (XHR) {
                    XHR.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem('ticket'));
                }
            }).done((data) => {
                console.info(data);
            }).fail((e) => {
                console.error(e);
            });
            getPerInfo.then((data) => {

                var xml = `<?xml version= "1.0" ?>
                                 <Requests>
                                 <Params>
                                 <DataSource>PS</DataSource>
                                 <ID>erpcloud_公用_获取个人信息</ID>
                                 <Type>1</Type>
                                 <Method>GetUserDataProcedure</Method>
                                 <ProcedureName>erpcloud_公用_获取个人信息</ProcedureName>
                                 <Filter><fno>${data.data[0].phone}</fno></Filter>
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

                    var pio = provideData.Tables[0].Rows[0];

                    console.info(pio);
                    $("#fsxr").val(pio.NAME);
                    $("#fsxr_no").val(pio.EMPLID);


                }).fail(function (e) {

                });
            });
        });
    });

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
    //选择受训人级别
    showPicker('fsxr_grade', zwjb_data);

    var picker55 = new mui.PopPicker();
    picker55.setData(zwjb_data);
    //选择申请费用时的级别
    $("#mxlist_px,#mxlist_travel").on('tap', '#zwjb', function () {

        var self = this;
        picker55.show(function (items) {
            $(self).val(items[0].text);
        });
        
    });


    var opts = { "type": "date", "beginYear": new Date().getFullYear() - 1, "endYear": new Date().getFullYear() + 3 };
    //选择日期
    var picker3 = new mui.DtPicker(opts);
    $('body').on('tap', '.dateChoosen', function () {
        var self = this;
        picker3.show(function (rs) {
            $(self).val(rs.text);
        });
    });

    var fyw_data = [
        {
            value: '',
            text:'有'
        },
        {
            value: '',
            text:'无'
        }
    ];
    var picker1 = new mui.PopPicker();
    //选择是否有证书
    picker1.setData(fyw_data);
    $('body').on('tap', '#ywzs', function () {
        var self = this;
        picker1.show(function (items) {
            $(self).val(items[0].text);
        });
    });
    //选择交通工具
    var jtgj_data = [
        {
            value: '',
            text:'飞机'
        },
        {
            value: '',
            text:'火车'
        },
        {
            value: '',
            text:'长途汽车'
        },
        {
            value: '',
            text:'轮船'
        }

    ];
    var picker2 = new mui.PopPicker();
    picker2.setData(jtgj_data);
    $("#mxlist_travel").on('tap', '#jtgj', function () {
        var self = this;
        picker2.show(function (items) {
            $(self).val(items[0].text);
            
        });
    });


    //自动计算合计
    $("#fylist").on('input', 'input[type="number"]', function () {
        calcT_fy();
        calcT_mx();
    });


    //借款金额自动大写
    $("#jkje").on('input', function () {
        var jkje = isNaN(parseFloat($("#jkje").val())) ? 0 : parseFloat($("#jkje").val());
        $("#jkjedx").val(atoc(jkje));
    });
    $("#tjmx_px").on('tap', function () {
        var li = `
                  <div id="mx">
                    <div class="mui-input-row itemtitle">
                        <label>明细列表项</label>
                        <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>
                    </div>
                    <div class="mui-row cutOffLine" style="padding:3vw;">
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>职务级别<i style="color:red;">*</i></label>
                            <textarea rows="2" id="zwjb" readonly placeholder="请选择"></textarea>
                        </div>
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>培训开始<i style="color:red;">*</i></label>
                            <textarea rows="2" id="qsdate"  class="dateChoosen" readonly placeholder="请选择"></textarea>
                        </div>
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>培训结束<i style="color:red;">*</i></label>
                            <textarea rows="2" id="zzdate"  class="dateChoosen" readonly placeholder="请选择"></textarea>
                        </div>
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>培训机构名称<i style="color:red;">*</i></label>
                            <textarea rows="2" id="pxjgmc" placeholder="请填写"></textarea>
                        </div>
                    </div>
                    <div class="mui-row cutOffLine" style="padding:3vw;">
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>培训地点<i style="color:red;">*</i></label>
                            <textarea rows="2" id="pxdd" placeholder="请填写"></textarea>
                        </div>
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>课程名称<i style="color:red;">*</i></label>
                            <textarea rows="2" id="ckmc" placeholder="请填写"></textarea>
                        </div>
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>培训讲师<i style="color:red;">*</i></label>
                            <textarea rows="2" id="pxjs" placeholder="请填写"></textarea>
                        </div>
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>有无证书<i style="color:red;">*</i></label>
                            <textarea rows="2" id="ywzs" placeholder="请选择" readonly></textarea>
                        </div>
                    </div>
                </div>
                 `;
        $("#mxlist_px").append(li);
    });

    //添加差旅费子表
    $("#tjmx_travel").on('tap', function () {

        var li = `
           <div id="mx">
                    <div class="mui-input-row itemtitle">
                        <label>明细列表项</label>
                        <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>
                    </div>
                    <div class="mui-row cutOffLine" style="padding:3vw;">
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>职务级别<i style="color:red;">*</i></label>
                            <textarea rows="2" id="zwjb" readonly placeholder="请选择"></textarea>
                        </div>
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>开始时间<i style="color:red;">*</i></label>
                            <textarea rows="2" id="qsdate" class="dateChoosen" readonly placeholder="请选择"></textarea>
                        </div>
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>结束时间<i style="color:red;">*</i></label>
                            <textarea rows="2" id="zzdate"  class="dateChoosen" readonly placeholder="请选择"></textarea>
                        </div>
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>交通工具<i style="color:red;">*</i></label>
                            <textarea rows="2" id="jtgj" readonly placeholder="请选择"></textarea>
                        </div>
                    </div>
                    <div class="mui-row cutOffLine" style="padding:3vw;">
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>出差地点<i style="color:red;">*</i></label>
                            <textarea rows="2" id="dd_pro" class="city_collect" readonly placeholder="请选择"></textarea>
                        </div>
                        <div class="mui-col-xs-3" style="display:flex;">
                            <textarea rows="2" id="dd_city" class="city_collect" readonly></textarea>
                            <input type="hidden" id="citymid" readonly />
                        </div>
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>出差地区类别<i style="color:red;">*</i></label>
                            <textarea rows="2" id="dqlb" readonly></textarea>
                        </div>
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>出差人数<i style="color:red;">*</i></label>
                            <input type="number" id="ccrs" placeholder="请填写" style="height:0;" />
                        </div>
                    </div>
                    <div class="mui-row cutOffLine" style="padding:3vw;">
                        <div class="mui-col-xs-12" style="display:flex;">
                            <label>出差天数<i style="color:red;">*</i></label>
                            <input type="number" id="ccts" placeholder="请填写" style="height:0;" />
                        </div>
                    </div>
                </div>
                 `;
        $("#mxlist_travel").append(li);

    });

   

}
//计算费用合计
function calcT_fy() {
    var amt_z2 = 0;
    var amt_z = 0;
    var px_amt = isNaN(parseFloat($("#px_amt").val())) ? 0 : parseFloat($("#px_amt").val());
    var amt_ct = isNaN(parseFloat($("#amt_ct").val())) ? 0 : parseFloat($("#amt_ct").val());
    var amt_zs = isNaN(parseFloat($("#amt_zs").val())) ? 0 : parseFloat($("#amt_zs").val());
    var amt_cf = isNaN(parseFloat($("#amt_cf").val())) ? 0 : parseFloat($("#amt_cf").val());
    var amt_sn = isNaN(parseFloat($("#amt_sn").val())) ? 0 : parseFloat($("#amt_sn").val());
    var amt_qt = isNaN(parseFloat($("#amt_qt").val())) ? 0 : parseFloat($("#amt_qt").val());
    amt_z2 = px_amt + amt_ct + amt_zs + amt_cf + amt_sn + amt_qt;
    amt_z = amt_ct + amt_zs + amt_cf + amt_sn + amt_qt;
    $("#amt_z2").val(amt_z2);
    $("#amt_z").val(amt_z);
    $("#amt_zdx").val(atoc(amt_z2));

    calcT_cc();


}
//计算标准合计
function calcT_mx() {
    var amt_zmx = 0;

    var amt_zs_fxbz = isNaN(parseFloat($("#amt_zs_fxbz").val())) ? 0 : parseFloat($("#amt_zs_fxbz").val());
    var amt_cf_fxbz = isNaN(parseFloat($("#amt_cf_fxbz").val())) ? 0 : parseFloat($("#amt_cf_fxbz").val());
    var amt_sn_fxbz = isNaN(parseFloat($("#amt_sn_fxbz").val())) ? 0 : parseFloat($("#amt_sn_fxbz").val());

    amt_zmx = amt_zs_fxbz + amt_cf_fxbz + amt_sn_fxbz;
    $("#amt_zmx").val(amt_zmx);
    calcT_cc();
}

//计算是否超出标准
function calcT_cc() {
    var amt_zs = isNaN(parseFloat($("#amt_zs").val())) ? 0 : parseFloat($("#amt_zs").val());
    var amt_cf = isNaN(parseFloat($("#amt_cf").val())) ? 0 : parseFloat($("#amt_cf").val());
    var amt_sn = isNaN(parseFloat($("#amt_sn").val())) ? 0 : parseFloat($("#amt_sn").val());
    var amt_zmx = isNaN(parseFloat($("#amt_zmx").val())) ? 0 : (parseFloat($("#amt_zmx").val()));
    var p = formartNumber((amt_zs + amt_cf + amt_sn - amt_zmx) / (amt_zmx == 0 ? 1 : amt_zmx) * 100);
    if (p <0) {
        p = '未超标准';
    }      
    $("#chaobzqk").val(p);
}
function searcH() {
    var xml = `<?xml version= "1.0" ?>
                    <Requests>
                        <Params>
                            <DataSource>BPM_EXPENSE</DataSource>
                            <ID>p_fysq_pxf</ID>
                            <Type>1</Type>
                            <Method>GetUserDataProcedure</Method>
                            <ProcedureName>p_fysq_pxf</ProcedureName>
                            <Filter>
                               <deptno>${$("#dept_no").val()}</deptno>
                               <ys_month>${$("#sqdate").val()}</ys_month>   
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
        var itemData = provideData.Tables[0].Rows[0];
        console.log(provideData);
        $("#px_yueys").val(itemData.amt);
        $("#px_keyongys").val(itemData.amt_hz);
        $("#px_yiyongys").val(itemData.amt_yy);
        if (itemData.amt_hz>0) {
            $("#px_feiyongsx").val('预算内');
            $("#px_chaoysqk").val('未超支');
        } else {
            $("#px_feiyongsx").val('预算外');
            var p = formartNumber((itemData.amt_yy - itemData.amt) / (itemData.amt == 0 ? 1 : itemData.amt) * 100);
            $("#px_chaoysqk").val(p);
        }
    }).fail(function (e) {

    });
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
        var itemData = provideData.Tables[0].Rows[0];
        console.log(provideData);
        $("#yueys").val(itemData.amt);
        $("#keyongys").val(itemData.amt_hz);
        $("#yiyongys").val(itemData.amt_yy);
        if (itemData.amt_hz > 0) {
            $("#feiyongsx").val('预算内');
            $("#chaoysqk").val('未超支');
        } else {
            $("#feiyongsx").val('预算外');
            var p = formartNumber((itemData.amt_yy - itemData.amt) / (itemData.amt == 0 ? 1 : itemData.amt) * 100);
            $("#chaoysqk").val(p);
        }
    }).fail(function (e) {

        });



}

var itemidArr = [];
var itemidArr2 = [];
function initData(data, flag) {

    var item = data.FormDataSet.fysq_travel_train_m[0];
    if (flag) {
        $("#taskId").val(item.taskid);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.lscode);
    }
    $("#comp_name").val(item.comp_name);
    $("#dept_name").val(item.dept_name);
    $("#dept_no").val(item.dept_no);
    $("#user_name").val(item.user_name);
    $("#user_no").val(item.user_no);
    $("#sqdate").val(FormatterTimeYMS(item.sqdate));
    $("#user_leadtitle").val(item.user_leadtitle);
    $("#px_yueys").val(item.px_yueys);
    $("#px_keyongys").val(item.px_keyongys);
    $("#px_yiyongys").val(item.px_yiyongys);
    $("#px_feiyongsx").val(item.px_feiyongsx);
    $("#px_chaoysqk").val(item.px_chaoysqk);
    $("#yueys").val(item.yueys);
    $("#keyongys").val(item.keyongys);
    $("#yiyongys").val(item.yiyongys);
    $("#feiyongsx").val(item.feiyongsx);
    $("#chaoysqk").val(item.chaoysqk);
    $("#chailvlb").val(item.chailvlb);
    $("#shifoujk").val(item.shifoujk);
    $("#px_shifoucl").val(item.px_shifoucl);
    $("#nbjswcxx").val(item.内部讲师外出学习);
    $("#beizhu").val(item.beizhu);
    $("#fsxr").val(item.受训人姓名);
    $("#fsxr_no").val(item.受训人工号);
    $("#fsxr_grade").val(item.受训人职务级别);
    $("#if_verify").val(item.if_verify);
    $("#if_bx").val(item.if_bx);
    $("#px_amt").val(item.px_amt);
    $("#px_kechengzy").val(item.px_kechengzy);
    $("#amt_ct").val(item.amt_ct);
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
    $("#px_niqudecc").val(item.px_niqudecc);
    $("#amt_qt").val(item.amt_qt);
    $("#amt_zmx").val(item.amt_zmx);
    $("#amt_z2").val(item.amt_z2);
    $("#amt_z").val(item.amt_z);
    $("#amt_zdx").val(item.amt_zdx);
    $("#jkje").val(item.jkje);
    $("#jkjedx").val(item.jkjedx);
    $("#jkcode").val(item.jkcode);


    if (item.nbjswcxx == '是') {
        $("#fsxr_container").show();
    } else {
        $("#fsxr_container").hide();
    }
    if (item.shifoujk == '是') {
        $("#jkcard").show();
    } else {
        $("#jkcard").hide();
    }
    if (item.px_shifoucl == '是') {
        $("#mxlist_travel").show();
    } else {
        $("#mxlist_travel").hide();
    }

    var item_c = data.FormDataSet.fysq_travel_train_t2;
    for (var i = 0; i < item_c.length; i++) {
        itemidArr.push(item_c[i].itemid);
        var li = `
                  <div id="mx">
                    <div class="mui-input-row itemtitle">
                        <label>明细列表项</label>
                        <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>
                    </div>
                    <div class="mui-row cutOffLine" style="padding:3vw;">
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>职务级别<i style="color:red;">*</i></label>
                            <textarea rows="2" id="zwjb" readonly >${item_c[i].zwjb}</textarea>
                        </div>
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>培训开始<i style="color:red;">*</i></label>
                            <textarea rows="2" id="qsdate"  class="dateChoosen" readonly >${FormatterTimeYMS(item_c[i].qsdate)}</textarea >
                        </div>
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>培训结束<i style="color:red;">*</i></label>
                            <textarea rows="2" id="zzdate"  class="dateChoosen" readonly >${FormatterTimeYMS(item_c[i].zzdate)}</textarea>
                        </div>
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>培训机构名称<i style="color:red;">*</i></label>
                            <textarea rows="2" id="pxjgmc" class="canEdit" readonly>${item_c[i].pxjgmc}</textarea>
                        </div>
                    </div>
                    <div class="mui-row cutOffLine" style="padding:3vw;">
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>培训地点<i style="color:red;">*</i></label>
                            <textarea rows="2" id="pxdd" class="canEdit"  readonly>${item_c[i].pxdd}</textarea>
                        </div>
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>课程名称<i style="color:red;">*</i></label>
                            <textarea rows="2" id="ckmc" class="canEdit" readonly>${item_c[i].ckmc}</textarea>
                        </div>
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>培训讲师<i style="color:red;">*</i></label>
                            <textarea rows="2" id="pxjs" class="canEdit" readonly>${item_c[i].pxjs}</textarea>
                        </div>
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>有无证书<i style="color:red;">*</i></label>
                            <textarea rows="2" id="ywzs"  readonly>${item_c[i].ywzs}</textarea>
                        </div>
                    </div>
                </div>

                  `;
        $("#mxlist_px").append(li);
    }
    var item_c2 = data.FormDataSet.fysq_travel_train_t;
    for (var i = 0; i < item_c2.length; i++) {
        itemidArr2.push(item_c2[i].itemid);
        var li = `
           <div id="mx">
                    <div class="mui-input-row itemtitle">
                        <label>明细列表项</label>
                        <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>
                    </div>
                    <div class="mui-row cutOffLine" style="padding:3vw;">
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>职务级别<i style="color:red;">*</i></label>
                            <textarea rows="2" id="zwjb" readonly >${item_c2[i].zwjb}</textarea>
                        </div>
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>开始时间<i style="color:red;">*</i></label>
                            <textarea rows="2" id="qsdate" class="dateChoosen" readonly>${FormatterTimeYMS(item_c2[i].qsdate)}</textarea>
                        </div>
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>结束时间<i style="color:red;">*</i></label>
                            <textarea rows="2" id="zzdate"  class="dateChoosen" readonly>${FormatterTimeYMS(item_c2[i].zzdate)}</textarea>
                        </div>
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>交通工具<i style="color:red;">*</i></label>
                            <textarea rows="2" id="jtgj" readonly >${item_c2[i].jtgj}</textarea>
                        </div>
                    </div>
                    <div class="mui-row cutOffLine" style="padding:3vw;">
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>出差地点<i style="color:red;">*</i></label>
                            <textarea rows="2" id="dd_pro" class="city_collect" readonly >${item_c2[i].dd_pro}</textarea>
                        </div>
                        <div class="mui-col-xs-3" style="display:flex;">
                            <textarea rows="2" id="dd_city" class="city_collect" readonly>${item_c2[i].dd_city}</textarea>
                            <input type="hidden" id="citymid" readonly value="${item_c2[i].citymid}"/>
                        </div>
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>出差地区类别<i style="color:red;">*</i></label>
                            <textarea rows="2" id="dqlb" readonly>${item_c2[i].dqlb}</textarea>
                        </div>
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>出差人数<i style="color:red;">*</i></label>
                            <input type="number" id="ccrs" class="canEdit" readonly style="height:0;" value="${item_c2[i].ccrs}"/>
                        </div>
                    </div>
                    <div class="mui-row cutOffLine" style="padding:3vw;">
                        <div class="mui-col-xs-12" style="display:flex;">
                            <label>出差天数<i style="color:red;">*</i></label>
                            <input type="number" id="ccts" class="canEdit" readonly style="height:0;" value="${item_c2[i].ccts}"/>
                        </div>
                    </div>
                </div>
                 `;
        $("#mxlist_travel").append(li);
    }


}

function nodeControllerExp(NodeName) {

    if (String(NodeName).match('开始') != null) {
        
        tapEvent();
        $("#mxlist_px,#mxlist_travel").find(".canEdit").each(function () {
            $(this).removeAttr('readonly');
        });
        $("#mxlist_px,#mxlist_travel").find("span").each(function () {
            $(this).show();
        });
        $("#beizhu,#jkje,#jkrem").removeAttr('readonly');
        $("#px_amt,#amt_ct").removeAttr('readonly');
        $("#tjmx_px,#tjmx_travel").show();
        $("#px_kechengzy,#px_niqudecc").removeAttr('readonly');
        $(".cantravel").removeAttr('readonly');

    }
}
class Mx_px {
    constructor(zwjb, qsdate, zzdate, pxjgmc, pxdd, ckmc, pxjs, ywzs) {
        this.zwjb = zwjb;
        this.qsdate = qsdate;
        this.zzdate = zzdate;
        this.pxjgmc = pxjgmc;
        this.pxdd = pxdd;
        this.ckmc = ckmc;
        this.pxjs = pxjs;
        this.ywzs = ywzs;

    }
    check() {
        if (!this.zwjb) {
            mui.toast('请选择职务级别');
            return true;
        }
        if (!this.qsdate) {
            mui.toast('请选择开始时间');
            return true;
        }
        if (!this.zzdate) {
            mui.toast('请选择结束时间');
            return true;
        }
        if (!this.pxjgmc) {
            mui.toast('请填写培训机构名称');
            return true;
        }
        if (!this.pxdd) {
            mui.toast('请填写培训地点');
            return true;
        }
        if (!this.ckmc) {
            mui.toast('请填写课程名称');
            return true;
        }
        if (!this.pxjs) {
            mui.toast('请填写培训讲师');
            return true;
        }
        if (!this.ywzs) {
            mui.toast('请选择有无证书');
            return true;
        }
        return false;
    }
}
class Mx_travel {
    constructor(zwjb, qsdate, zzdate, jtgj, dd_pro, dd_city, citymid, dqlb, ccrs, ccts) {
        this.zwjb = zwjb;
        this.qsdate = qsdate;
        this.zzdate = zzdate;
        this.jtgj = jtgj;
        this.dd_pro = dd_pro;
        this.dd_city = dd_city;
        this.citymid = citymid;
        this.dqlb = dqlb;
        this.ccrs = ccrs;
        this.ccts = ccts;
    }
    check() {
        if (!this.zwjb) {
            mui.toast('请选择职务级别');
            return true;
        }
        if (!this.qsdate) {
            mui.toast('请选择开始时间');
            return true;
        }
        if (!this.zzdate) {
            mui.toast('请选择结束时间');
            return true;
        }
        if (!this.jtgj) {
            
            mui.toast('请选择交通工具');
            return true;
        }
        if (!this.dd_pro || !this.dd_city) {
            mui.toast('请选择出差地点');
            return true;
        }
        if (!this.ccrs) {
            mui.toast('请填写出差人数');
            return true;
        }
        if (!this.ccts) {
            mui.toast('请填写出差天数');
            return true;
        }
        return false;
    }
}

function Save() {
    var comp_name = $("#comp_name").val();
    var dept_name = $("#dept_name").val();
    var dept_no = $("#dept_no").val();
    var user_name = $("#user_name").val();
    var user_no = $("#user_no").val();
    var sqdate = $("#sqdate").val();
    var user_leadtitle = $("#user_leadtitle").val();
    var px_yueys = $("#px_yueys").val();
    var px_keyongys = $("#px_keyongys").val();
    var px_yiyongys = $("#px_yiyongys").val();
    var px_feiyongsx = $("#px_feiyongsx").val();
    var px_chaoysqk = $("#px_chaoysqk").val();
    var yueys = $("#yueys").val();
    var keyongys = $("#keyongys").val();
    var yiyongys = $("#yiyongys").val();
    var feiyongsx = $("#feiyongsx").val();
    var chaoysqk = $("#chaoysqk").val();
    var chailvlb = $("#chailvlb").val();
    var shifoujk = $("#shifoujk").val();
    var px_shifoucl = $("#px_shifoucl").val();
    var nbjswcxx = $("#nbjswcxx").val();
    var beizhu = $("#beizhu").val();

    var fsxr = $("#fsxr").val();
    var fsxr_no = $("#fsxr_no").val();
    var fsxr_grade = $("#fsxr_grade").val();
    var if_verify = $("#if_verify").val();
    var if_bx = $("#if_bx").val();
    var px_amt = $("#px_amt").val();
    var px_kechengzy = $("#px_kechengzy").val();
    var amt_ct = $("#amt_ct").val();
    var amt_zs_yxts = $("#amt_zs_yxts").val();
    var amt_zs_fxbz = $("#amt_zs_fxbz").val();
    var amt_zs = $("#amt_zs").val();
    var chaobzqk = $("#chaobzqk").val();
    var amt_cf_yxts = $("#amt_cf_yxts").val();
    var amt_cf_fxbz = $("#amt_cf_fxbz").val();
    var amt_cf = $("#amt_cf").val();
    var amt_sn_yxts = $("#amt_sn_yxts").val();
    var amt_sn_fxbz = $("#amt_sn_fxbz").val();
    var amt_sn = $("#amt_sn").val();
    var px_niqudecc = $("#px_niqudecc").val();
    var amt_qt = $("#amt_qt").val();
    var amt_zmx = $("#amt_zmx").val();
    var amt_z2 = $("#amt_z2").val();
    var amt_z = $("#amt_z").val();
    var amt_zdx = $("#amt_zdx").val();
    var jkje = $("#jkje").val(); 
    var jkjedx = $("#jkjedx").val();
    var jkcode = $("#jkcode").val();
    var jkrem = $("#jkrem").val();

    if (!comp_name) {
        mui.toast('请选择公司名称');
        return;
    }
    if (px_shifoucl == '是' && !chailvlb) {
        mui.toast('请选择差旅类别');
        return;
    }
    if (!nbjswcxx) {
        mui.toast('请选择内部讲师外出学习');
        return;
    }
    if ((isNaN(amt_zmx) || amt_zmx == 0) && px_shifoucl=='是') {
        mui.toast('请填写分项标准合计');
        return;
    }
    if (isNaN(amt_z2) || amt_z2 == 0) {
        mui.toast('请填写申请金额');
        return;
    }
    if (!px_kechengzy) {
        mui.toast('请填写课程摘要');
        return;
    }
    if (!px_niqudecc) {
        mui.toast('请填写拟取得成果');
        return;
    }

    var mxflag = false;
    var mxlistArr1 = [];
    $("#mxlist_px").find("#mx").each(function () {
        var zwjb = $(this).find("#zwjb").val();
        var qsdate = $(this).find("#qsdate").val();
        var zzdate = $(this).find("#zzdate").val();
        var pxjgmc = $(this).find("#pxjgmc").val();
        var pxdd = $(this).find("#pxdd").val();
        var ckmc = $(this).find("#ckmc").val();
        var pxjs = $(this).find("#pxjs").val();
        var ywzs = $(this).find("#ywzs").val();
        var mx = new Mx_px(zwjb, qsdate, zzdate, pxjgmc, pxdd, ckmc, pxjs, ywzs);
        if (mx.check()) {
            mxflag = true;
            return;
        }
        mxlistArr1.push(mx);
    });

    var mxlistArr2 = [];
    if (px_shifoucl == '是') {
       
        $("#mxlist_travel").find("#mx").each(function () {
            var zwjb = $(this).find("#zwjb").val();
            var qsdate = $(this).find("#qsdate").val();
            var zzdate = $(this).find("#zzdate").val();
            var jtgj = $(this).find("#jtgj").val();
            var dd_pro = $(this).find("#dd_pro").val();
            var dd_city = $(this).find("#dd_city").val();
            var citymid = $(this).find("#citymid").val();
            var dqlb = $(this).find("#dqlb").val();
            var ccrs = $(this).find("#ccrs").val();
            var ccts = $(this).find("#ccts").val();
            console.log(jtgj);
            var mx = new Mx_travel(zwjb, qsdate, zzdate, jtgj, dd_pro, dd_city, citymid, dqlb, ccrs, ccts);
            if (mx.check()) {
                mxflag = true;
                return;
            }
            mxlistArr2.push(mx);
        });
    }
   
    if (mxflag && mxlistArr2.length!=0) {
        return;
    }
    var btnArry = ["取消", "确定"];
    mui.confirm('即将提交，是否确定？', '提交确认提醒', btnArry, function (e) {
        if (e.index == 1) {
            var xml = `<?xml version="1.0"?>
                        <XForm>
                            <Header>
                                <Method>Post</Method>
                                <ProcessName>集团本部培训费申请</ProcessName>
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
                        <fysq_travel_train_m>
                            <lscode>自动生成</lscode>
                            <comp_name>${comp_name}</comp_name>
                            <dept_name>${dept_name}</dept_name>
                            <dept_no>${dept_no}</dept_no>
                            <user_name>${user_name}</user_name>
                            <user_no>${user_no}</user_no>
                            <sqdate>${sqdate}</sqdate>
                            <user_leadtitle>${user_leadtitle}</user_leadtitle>
                            <px_yueys>${px_yueys}</px_yueys>
                            <px_keyongys>${px_keyongys}</px_keyongys>
                            <px_yiyongys>${px_yiyongys}</px_yiyongys>
                            <px_feiyongsx>${px_feiyongsx}</px_feiyongsx>
                            <px_chaoysqk>${px_chaoysqk}</px_chaoysqk>
                            <yueys>${yueys}</yueys>
                            <keyongys>${keyongys}</keyongys>
                            <yiyongys>${yiyongys}</yiyongys>
                            <feiyongsx>${feiyongsx}</feiyongsx>
                            <chaoysqk>${chaoysqk}</chaoysqk>
                            <chailvlb>${chailvlb}</chailvlb>
                            <shifoujk>${shifoujk}</shifoujk>
                            <px_shifoucl>${px_shifoucl}</px_shifoucl>
                            <内部讲师外出学习>${nbjswcxx}</内部讲师外出学习>
                            <beizhu>${beizhu}</beizhu>
                            <受训人姓名>${fsxr}</受训人姓名>
                            <受训人工号>${fsxr_no}</受训人工号>
                            <受训人职务级别>${fsxr_grade}</受训人职务级别>
                            <if_verify>${if_verify}</if_verify>
                            <if_bx>${if_bx}</if_bx>
                            <px_amt>${px_amt}</px_amt>
                            <px_kechengzy>${px_kechengzy}</px_kechengzy>
                            <amt_ct>${amt_ct}</amt_ct>
                            <amt_zs_yxts>${amt_zs_yxts}</amt_zs_yxts>
                            <amt_zs_fxbz>${amt_zs_fxbz}</amt_zs_fxbz>
                            <amt_zs>${amt_zs}</amt_zs>
                            <chaobzqk>${chaobzqk}</chaobzqk>
                            <amt_cf_yxts>${amt_cf_yxts}</amt_cf_yxts>
                            <amt_cf_fxbz>${amt_cf_fxbz}</amt_cf_fxbz>
                            <amt_cf>${amt_cf}</amt_cf>
                            <amt_sn_yxts>${amt_sn_yxts}</amt_sn_yxts>
                            <amt_sn_fxbz>${amt_sn_fxbz}</amt_sn_fxbz>
                            <amt_sn>${amt_sn}</amt_sn>
                            <px_niqudecc>${px_niqudecc}</px_niqudecc>
                            <amt_qt>${amt_qt}</amt_qt>
                            <amt_zmx>${amt_zmx}</amt_zmx>
                            <amt_z2>${amt_z2}</amt_z2>
                            <amt_z>${amt_z}</amt_z>
                            <amt_zdx>${amt_zdx}</amt_zdx>
                            <jkje>${jkje}</jkje>
                            <jkjedx>${jkjedx}</jkjedx>
                            <jkcode>${jkcode}</jkcode>
                            <jkrem>${jkrem}</jkrem>
                        </fysq_travel_train_m>
                   `;
            for (var i = 0; i < mxlistArr1.length; i++) {
                xml += `
                          <fysq_travel_train_t2>
                                <RelationRowGuid>${i+1}</RelationRowGuid>
                                <RowPrimaryKeys></RowPrimaryKeys>
                                <zwjb>${mxlistArr1[i].zwjb}</zwjb>
                                <qsdate>${mxlistArr1[i].qsdate}</qsdate>
                                <zzdate>${mxlistArr1[i].zzdate}</zzdate>
                                <pxjgmc>${mxlistArr1[i].pxjgmc}</pxjgmc>
                                <pxdd>${mxlistArr1[i].pxdd}</pxdd>
                                <ckmc>${mxlistArr1[i].ckmc}</ckmc>
                                <pxjs>${mxlistArr1[i].pxjs}</pxjs>
                                <ywzs>${mxlistArr1[i].ywzs}</ywzs>
                            </fysq_travel_train_t2>

                       `;
            }
            if (mxlistArr2.length == 0) {
                xml += `
                         <fysq_travel_train_t>
                            <RelationRowGuid>${mxlistArr1.length  + 1}</RelationRowGuid>
                            <RowPrimaryKeys></RowPrimaryKeys>
                            <zwjb></zwjb>
                            <qsdate></qsdate>
                            <zzdate></zzdate>
                            <jtgj></jtgj>
                            <dd_pro></dd_pro>
                            <dd_city></dd_city>
                            <citymid></citymid>
                            <dqlb></dqlb>
                            <ccrs></ccrs>
                            <ccts></ccts>
                        </fysq_travel_train_t>

                       `;
            } else {
                for (var i = 0; i < mxlistArr2.length; i++) {
                    xml += `
                         <fysq_travel_train_t>
                            <RelationRowGuid>${mxlistArr1.length + i + 1}</RelationRowGuid>
                            <RowPrimaryKeys></RowPrimaryKeys>
                            <zwjb>${mxlistArr2[i].zwjb}</zwjb>
                            <qsdate>${mxlistArr2[i].qsdate}</qsdate>
                            <zzdate>${mxlistArr2[i].zzdate}</zzdate>
                            <jtgj>${mxlistArr2[i].jtgj}</jtgj>
                            <dd_pro>${mxlistArr2[i].dd_pro}</dd_pro>
                            <dd_city>${mxlistArr2[i].dd_city}</dd_city>
                            <citymid>${mxlistArr2[i].citymid}</citymid>
                            <dqlb>${mxlistArr2[i].dqlb}</dqlb>
                            <ccrs>${mxlistArr2[i].ccrs}</ccrs>
                            <ccts>${mxlistArr2[i].ccts}</ccts>
                        </fysq_travel_train_t>

                       `;
                }
            }
           
            xml += `
                       </FormData>
                    </XForm>
                   `;
            //console.log(xml);
            PostXml(xml);
            
        }
    });
}


function reSave() {

    var fbillno = $("#fbillno").val();
    var pid = $("#stepId").val();

    var comp_name = $("#comp_name").val();
    var dept_name = $("#dept_name").val();
    var dept_no = $("#dept_no").val();
    var user_name = $("#user_name").val();
    var user_no = $("#user_no").val();
    var sqdate = $("#sqdate").val();
    var user_leadtitle = $("#user_leadtitle").val();
    var px_yueys = $("#px_yueys").val();
    var px_keyongys = $("#px_keyongys").val();
    var px_yiyongys = $("#px_yiyongys").val();
    var px_feiyongsx = $("#px_feiyongsx").val();
    var px_chaoysqk = $("#px_chaoysqk").val();
    var yueys = $("#yueys").val();
    var keyongys = $("#keyongys").val();
    var yiyongys = $("#yiyongys").val();
    var feiyongsx = $("#feiyongsx").val();
    var chaoysqk = $("#chaoysqk").val();
    var chailvlb = $("#chailvlb").val();
    var shifoujk = $("#shifoujk").val();
    var px_shifoucl = $("#px_shifoucl").val();
    var nbjswcxx = $("#nbjswcxx").val();
    var beizhu = $("#beizhu").val();

    var fsxr = $("#fsxr").val();
    var fsxr_no = $("#fsxr_no").val();
    var fsxr_grade = $("#fsxr_grade").val();
    var if_verify = $("#if_verify").val();
    var if_bx = $("#if_bx").val();
    var px_amt = $("#px_amt").val();
    var px_kechengzy = $("#px_kechengzy").val();
    var amt_ct = $("#amt_ct").val();
    var amt_zs_yxts = $("#amt_zs_yxts").val();
    var amt_zs_fxbz = $("#amt_zs_fxbz").val();
    var amt_zs = $("#amt_zs").val();
    var chaobzqk = $("#chaobzqk").val();
    var amt_cf_yxts = $("#amt_cf_yxts").val();
    var amt_cf_fxbz = $("#amt_cf_fxbz").val();
    var amt_cf = $("#amt_cf").val();
    var amt_sn_yxts = $("#amt_sn_yxts").val();
    var amt_sn_fxbz = $("#amt_sn_fxbz").val();
    var amt_sn = $("#amt_sn").val();
    var px_niqudecc = $("#px_niqudecc").val();
    var amt_qt = $("#amt_qt").val();
    var amt_zmx = $("#amt_zmx").val();
    var amt_z2 = $("#amt_z2").val();
    var amt_z = $("#amt_z").val();
    var amt_zdx = $("#amt_zdx").val();
    var jkje = $("#jkje").val();
    var jkjedx = $("#jkjedx").val();
    var jkcode = $("#jkcode").val();
    var jkrem = $("#jkrem").val();

    if (!comp_name) {
        mui.toast('请选择公司名称');
        return;
    }
    if (px_shifoucl == '是' && !chailvlb) {
        mui.toast('请选择差旅类别');
        return;
    }
    if (!nbjswcxx) {
        mui.toast('请选择内部讲师外出学习');
        return;
    }
    if ((isNaN(amt_zmx) || amt_zmx == 0) && px_shifoucl == '是') {
        mui.toast('请填写分项标准合计');
        return;
    }
    if (isNaN(amt_z2) || amt_z2 == 0) {
        mui.toast('请填写申请金额');
        return;
    }
    if (!px_kechengzy) {
        mui.toast('请填写课程摘要');
        return;
    }
    if (!px_niqudecc) {
        mui.toast('请填写拟取得成果');
        return;
    }

    var mxflag = false;
    var mxlistArr1 = [];
    $("#mxlist_px").find("#mx").each(function () {
        var zwjb = $(this).find("#zwjb").val();
        var qsdate = $(this).find("#qsdate").val();
        var zzdate = $(this).find("#zzdate").val();
        var pxjgmc = $(this).find("#pxjgmc").val();
        var pxdd = $(this).find("#pxdd").val();
        var ckmc = $(this).find("#ckmc").val();
        var pxjs = $(this).find("#pxjs").val();
        var ywzs = $(this).find("#ywzs").val();
        var mx = new Mx_px(zwjb, qsdate, zzdate, pxjgmc, pxdd, ckmc, pxjs, ywzs);
        if (mx.check()) {
            mxflag = true;
            return;
        }
        mxlistArr1.push(mx);
    });

    var mxlistArr2 = [];
    if (px_shifoucl == '是') {
        $("#mxlist_travel").find("#mx").each(function () {
            var zwjb = $(this).find("#zwjb").val();
            var qsdate = $(this).find("#qsdate").val();
            var zzdate = $(this).find("#zzdate").val();
            var jtgj = $(this).find("#jtgj").val();
            var dd_pro = $(this).find("#dd_pro").val();
            var dd_city = $(this).find("#dd_city").val();
            var citymid = $(this).find("#citymid").val();
            var dqlb = $(this).find("#dqlb").val();
            var ccrs = $(this).find("#ccrs").val();
            var ccts = $(this).find("#ccts").val();

            var mx = new Mx_travel(zwjb, qsdate, zzdate, jtgj, dd_pro, dd_city, citymid, dqlb, ccrs, ccts);
            if (mx.check()) {
                mxflag = true;
                return;
            }
            mxlistArr2.push(mx);
        });
    }

    if (mxflag && mxlistArr2.length != 0) {
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
                        <fysq_travel_train_m>
                            <lscode>${fbillno}</lscode>
                            <comp_name>${comp_name}</comp_name>
                            <dept_name>${dept_name}</dept_name>
                            <dept_no>${dept_no}</dept_no>
                            <user_name>${user_name}</user_name>
                            <user_no>${user_no}</user_no>
                            <sqdate>${sqdate}</sqdate>
                            <user_leadtitle>${user_leadtitle}</user_leadtitle>
                            <px_yueys>${px_yueys}</px_yueys>
                            <px_keyongys>${px_keyongys}</px_keyongys>
                            <px_yiyongys>${px_yiyongys}</px_yiyongys>
                            <px_feiyongsx>${px_feiyongsx}</px_feiyongsx>
                            <px_chaoysqk>${px_chaoysqk}</px_chaoysqk>
                            <yueys>${yueys}</yueys>
                            <keyongys>${keyongys}</keyongys>
                            <yiyongys>${yiyongys}</yiyongys>
                            <feiyongsx>${feiyongsx}</feiyongsx>
                            <chaoysqk>${chaoysqk}</chaoysqk>
                            <chailvlb>${chailvlb}</chailvlb>
                            <shifoujk>${shifoujk}</shifoujk>
                            <px_shifoucl>${px_shifoucl}</px_shifoucl>
                            <内部讲师外出学习>${nbjswcxx}</内部讲师外出学习>
                            <beizhu>${beizhu}</beizhu>
                            <受训人姓名>${fsxr}</受训人姓名>
                            <受训人工号>${fsxr_no}</受训人工号>
                            <受训人职务级别>${fsxr_grade}</受训人职务级别>
                            <if_verify>${if_verify}</if_verify>
                            <if_bx>${if_bx}</if_bx>
                            <px_amt>${px_amt}</px_amt>
                            <px_kechengzy>${px_kechengzy}</px_kechengzy>
                            <amt_ct>${amt_ct}</amt_ct>
                            <amt_zs_yxts>${amt_zs_yxts}</amt_zs_yxts>
                            <amt_zs_fxbz>${amt_zs_fxbz}</amt_zs_fxbz>
                            <amt_zs>${amt_zs}</amt_zs>
                            <chaobzqk>${chaobzqk}</chaobzqk>
                            <amt_cf_yxts>${amt_cf_yxts}</amt_cf_yxts>
                            <amt_cf_fxbz>${amt_cf_fxbz}</amt_cf_fxbz>
                            <amt_cf>${amt_cf}</amt_cf>
                            <amt_sn_yxts>${amt_sn_yxts}</amt_sn_yxts>
                            <amt_sn_fxbz>${amt_sn_fxbz}</amt_sn_fxbz>
                            <amt_sn>${amt_sn}</amt_sn>
                            <px_niqudecc>${px_niqudecc}</px_niqudecc>
                            <amt_qt>${amt_qt}</amt_qt>
                            <amt_zmx>${amt_zmx}</amt_zmx>
                            <amt_z2>${amt_z2}</amt_z2>
                            <amt_z>${amt_z}</amt_z>
                            <amt_zdx>${amt_zdx}</amt_zdx>
                            <jkje>${jkje}</jkje>
                            <jkjedx>${jkjedx}</jkjedx>
                            <jkcode>${jkcode}</jkcode>
                            <jkrem>${jkrem}</jkrem>
                        </fysq_travel_train_m>
                   `;
            for (var i = 0; i < mxlistArr1.length; i++) {
                xml += `
                          <fysq_travel_train_t2>
                                <RelationRowGuid>${i + 1}</RelationRowGuid>
                                <RowPrimaryKeys></RowPrimaryKeys>
                                <zwjb>${mxlistArr1[i].zwjb}</zwjb>
                                <qsdate>${mxlistArr1[i].qsdate}</qsdate>
                                <zzdate>${mxlistArr1[i].zzdate}</zzdate>
                                <pxjgmc>${mxlistArr1[i].pxjgmc}</pxjgmc>
                                <pxdd>${mxlistArr1[i].pxdd}</pxdd>
                                <ckmc>${mxlistArr1[i].ckmc}</ckmc>
                                <pxjs>${mxlistArr1[i].pxjs}</pxjs>
                                <ywzs>${mxlistArr1[i].ywzs}</ywzs>
                            </fysq_travel_train_t2>

                       `;
            }
            if (mxlistArr2.length == 0) {
                xml += `
                         <fysq_travel_train_t>
                            <RelationRowGuid>${mxlistArr1.length  + 1}</RelationRowGuid>
                            <RowPrimaryKeys></RowPrimaryKeys>
                            <zwjb></zwjb>
                            <qsdate></qsdate>
                            <zzdate></zzdate>
                            <jtgj></jtgj>
                            <dd_pro></dd_pro>
                            <dd_city></dd_city>
                            <citymid></citymid>
                            <dqlb></dqlb>
                            <ccrs></ccrs>
                            <ccts></ccts>
                        </fysq_travel_train_t>

                       `;
            } else {
                for (var i = 0; i < mxlistArr2.length; i++) {
                    xml += `
                         <fysq_travel_train_t>
                            <RelationRowGuid>${mxlistArr1.length + i + 1}</RelationRowGuid>
                            <RowPrimaryKeys></RowPrimaryKeys>
                            <zwjb>${mxlistArr2[i].zwjb}</zwjb>
                            <qsdate>${mxlistArr2[i].qsdate}</qsdate>
                            <zzdate>${mxlistArr2[i].zzdate}</zzdate>
                            <jtgj>${mxlistArr2[i].jtgj}</jtgj>
                            <dd_pro>${mxlistArr2[i].dd_pro}</dd_pro>
                            <dd_city>${mxlistArr2[i].dd_city}</dd_city>
                            <citymid>${mxlistArr2[i].citymid}</citymid>
                            <dqlb>${mxlistArr2[i].dqlb}</dqlb>
                            <ccrs>${mxlistArr2[i].ccrs}</ccrs>
                            <ccts>${mxlistArr2[i].ccts}</ccts>
                        </fysq_travel_train_t>

                       `;
                }
            }
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

    var comp_name = $("#comp_name").val();
    var dept_name = $("#dept_name").val();
    var dept_no = $("#dept_no").val();
    var user_name = $("#user_name").val();
    var user_no = $("#user_no").val();
    var sqdate = $("#sqdate").val();
    var user_leadtitle = $("#user_leadtitle").val();
    var px_yueys = $("#px_yueys").val();
    var px_keyongys = $("#px_keyongys").val();
    var px_yiyongys = $("#px_yiyongys").val();
    var px_feiyongsx = $("#px_feiyongsx").val();
    var px_chaoysqk = $("#px_chaoysqk").val();
    var yueys = $("#yueys").val();
    var keyongys = $("#keyongys").val();
    var yiyongys = $("#yiyongys").val();
    var feiyongsx = $("#feiyongsx").val();
    var chaoysqk = $("#chaoysqk").val();
    var chailvlb = $("#chailvlb").val();
    var shifoujk = $("#shifoujk").val();
    var px_shifoucl = $("#px_shifoucl").val();
    var nbjswcxx = $("#nbjswcxx").val();
    var beizhu = $("#beizhu").val();

    var fsxr = $("#fsxr").val();
    var fsxr_no = $("#fsxr_no").val();
    var fsxr_grade = $("#fsxr_grade").val();
    var if_verify = $("#if_verify").val();
    var if_bx = $("#if_bx").val();
    var px_amt = $("#px_amt").val();
    var px_kechengzy = $("#px_kechengzy").val();
    var amt_ct = $("#amt_ct").val();
    var amt_zs_yxts = $("#amt_zs_yxts").val();
    var amt_zs_fxbz = $("#amt_zs_fxbz").val();
    var amt_zs = $("#amt_zs").val();
    var chaobzqk = $("#chaobzqk").val();
    var amt_cf_yxts = $("#amt_cf_yxts").val();
    var amt_cf_fxbz = $("#amt_cf_fxbz").val();
    var amt_cf = $("#amt_cf").val();
    var amt_sn_yxts = $("#amt_sn_yxts").val();
    var amt_sn_fxbz = $("#amt_sn_fxbz").val();
    var amt_sn = $("#amt_sn").val();
    var px_niqudecc = $("#px_niqudecc").val();
    var amt_qt = $("#amt_qt").val();
    var amt_zmx = $("#amt_zmx").val();
    var amt_z2 = $("#amt_z2").val();
    var amt_z = $("#amt_z").val();
    var amt_zdx = $("#amt_zdx").val();
    var jkje = $("#jkje").val();
    var jkjedx = $("#jkjedx").val();
    var jkcode = $("#jkcode").val();
    var jkrem = $("#jkrem").val();
  

    var mxflag = false;
    var mxlistArr1 = [];
    $("#mxlist_px").find("#mx").each(function () {
        var zwjb = $(this).find("#zwjb").val();
        var qsdate = $(this).find("#qsdate").val();
        var zzdate = $(this).find("#zzdate").val();
        var pxjgmc = $(this).find("#pxjgmc").val();
        var pxdd = $(this).find("#pxdd").val();
        var ckmc = $(this).find("#ckmc").val();
        var pxjs = $(this).find("#pxjs").val();
        var ywzs = $(this).find("#ywzs").val();
        var mx = new Mx_px(zwjb, qsdate, zzdate, pxjgmc, pxdd, ckmc, pxjs, ywzs);
      
        mxlistArr1.push(mx);
    });

    var mxlistArr2 = [];
    if (px_shifoucl == '是') {
        $("#mxlist_travel").find("#mx").each(function () {
            var zwjb = $(this).find("#zwjb").val();
            var qsdate = $(this).find("#qsdate").val();
            var zzdate = $(this).find("#zzdate").val();
            var jtgj = $(this).find("#jtgj").val();
            var dd_pro = $(this).find("#dd_pro").val();
            var dd_city = $(this).find("#dd_city").val();
            var citymid = $(this).find("#citymid").val();
            var dqlb = $(this).find("#dqlb").val();
            var ccrs = $(this).find("#ccrs").val();
            var ccts = $(this).find("#ccts").val();

            var mx = new Mx_travel(zwjb, qsdate, zzdate, jtgj, dd_pro, dd_city, citymid, dqlb, ccrs, ccts);
           
            mxlistArr2.push(mx);
        });
    }


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
                        <fysq_travel_train_m>
                            <lscode>${fbillno}</lscode>
                            <comp_name>${comp_name}</comp_name>
                            <dept_name>${dept_name}</dept_name>
                            <dept_no>${dept_no}</dept_no>
                            <user_name>${user_name}</user_name>
                            <user_no>${user_no}</user_no>
                            <sqdate>${sqdate}</sqdate>
                            <user_leadtitle>${user_leadtitle}</user_leadtitle>
                            <px_yueys>${px_yueys}</px_yueys>
                            <px_keyongys>${px_keyongys}</px_keyongys>
                            <px_yiyongys>${px_yiyongys}</px_yiyongys>
                            <px_feiyongsx>${px_feiyongsx}</px_feiyongsx>
                            <px_chaoysqk>${px_chaoysqk}</px_chaoysqk>
                            <yueys>${yueys}</yueys>
                            <keyongys>${keyongys}</keyongys>
                            <yiyongys>${yiyongys}</yiyongys>
                            <feiyongsx>${feiyongsx}</feiyongsx>
                            <chaoysqk>${chaoysqk}</chaoysqk>
                            <chailvlb>${chailvlb}</chailvlb>
                            <shifoujk>${shifoujk}</shifoujk>
                            <px_shifoucl>${px_shifoucl}</px_shifoucl>
                            <内部讲师外出学习>${nbjswcxx}</内部讲师外出学习>
                            <beizhu>${beizhu}</beizhu>
                            <受训人姓名>${fsxr}</受训人姓名>
                            <受训人工号>${fsxr_no}</受训人工号>
                            <受训人职务级别>${fsxr_grade}</受训人职务级别>
                            <if_verify>${if_verify}</if_verify>
                            <if_bx>${if_bx}</if_bx>
                            <px_amt>${px_amt}</px_amt>
                            <px_kechengzy>${px_kechengzy}</px_kechengzy>
                            <amt_ct>${amt_ct}</amt_ct>
                            <amt_zs_yxts>${amt_zs_yxts}</amt_zs_yxts>
                            <amt_zs_fxbz>${amt_zs_fxbz}</amt_zs_fxbz>
                            <amt_zs>${amt_zs}</amt_zs>
                            <chaobzqk>${chaobzqk}</chaobzqk>
                            <amt_cf_yxts>${amt_cf_yxts}</amt_cf_yxts>
                            <amt_cf_fxbz>${amt_cf_fxbz}</amt_cf_fxbz>
                            <amt_cf>${amt_cf}</amt_cf>
                            <amt_sn_yxts>${amt_sn_yxts}</amt_sn_yxts>
                            <amt_sn_fxbz>${amt_sn_fxbz}</amt_sn_fxbz>
                            <amt_sn>${amt_sn}</amt_sn>
                            <px_niqudecc>${px_niqudecc}</px_niqudecc>
                            <amt_qt>${amt_qt}</amt_qt>
                            <amt_zmx>${amt_zmx}</amt_zmx>
                            <amt_z2>${amt_z2}</amt_z2>
                            <amt_z>${amt_z}</amt_z>
                            <amt_zdx>${amt_zdx}</amt_zdx>
                            <jkje>${jkje}</jkje>
                            <jkjedx>${jkjedx}</jkjedx>
                            <jkcode>${jkcode}</jkcode>
                            <jkrem>${jkrem}</jkrem>
                        </fysq_travel_train_m>
                   `;
            for (var i = 0; i < mxlistArr1.length; i++) {
                xml += `
                          <fysq_travel_train_t2>
                                <RelationRowGuid>${i + 1}</RelationRowGuid>
                                <RowPrimaryKeys>itemid=${itemidArr[i]}</RowPrimaryKeys>
                                <zwjb>${mxlistArr1[i].zwjb}</zwjb>
                                <qsdate>${mxlistArr1[i].qsdate}</qsdate>
                                <zzdate>${mxlistArr1[i].zzdate}</zzdate>
                                <pxjgmc>${mxlistArr1[i].pxjgmc}</pxjgmc>
                                <pxdd>${mxlistArr1[i].pxdd}</pxdd>
                                <ckmc>${mxlistArr1[i].ckmc}</ckmc>
                                <pxjs>${mxlistArr1[i].pxjs}</pxjs>
                                <ywzs>${mxlistArr1[i].ywzs}</ywzs>
                            </fysq_travel_train_t2>

                       `;
            }
            if (mxlistArr2.length == 0) {
                xml += `
                         <fysq_travel_train_t>
                            <RelationRowGuid>${mxlistArr1.length  + 1}</RelationRowGuid>
                            <RowPrimaryKeys></RowPrimaryKeys>
                            <zwjb></zwjb>
                            <qsdate></qsdate>
                            <zzdate></zzdate>
                            <jtgj></jtgj>
                            <dd_pro></dd_pro>
                            <dd_city></dd_city>
                            <citymid></citymid>
                            <dqlb></dqlb>
                            <ccrs></ccrs>
                            <ccts></ccts>
                        </fysq_travel_train_t>

                       `;
            } else {
                for (var i = 0; i < mxlistArr2.length; i++) {
                    xml += `
                         <fysq_travel_train_t>
                            <RelationRowGuid>${mxlistArr1.length + i + 1}</RelationRowGuid>
                            <RowPrimaryKeys>itemid=${itemidArr2[i] == undefined ? '' : itemidArr2[i]}</RowPrimaryKeys>
                            <zwjb>${mxlistArr2[i].zwjb}</zwjb>
                            <qsdate>${mxlistArr2[i].qsdate}</qsdate>
                            <zzdate>${mxlistArr2[i].zzdate}</zzdate>
                            <jtgj>${mxlistArr2[i].jtgj}</jtgj>
                            <dd_pro>${mxlistArr2[i].dd_pro}</dd_pro>
                            <dd_city>${mxlistArr2[i].dd_city}</dd_city>
                            <citymid>${mxlistArr2[i].citymid}</citymid>
                            <dqlb>${mxlistArr2[i].dqlb}</dqlb>
                            <ccrs>${mxlistArr2[i].ccrs}</ccrs>
                            <ccts>${mxlistArr2[i].ccts}</ccts>
                        </fysq_travel_train_t>

                       `;
                }
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
                        <fysq_travel_train_m>
                            <lscode>${fbillno}</lscode>
                            <comp_name>${comp_name}</comp_name>
                            <dept_name>${dept_name}</dept_name>
                            <dept_no>${dept_no}</dept_no>
                            <user_name>${user_name}</user_name>
                            <user_no>${user_no}</user_no>
                            <sqdate>${sqdate}</sqdate>
                            <user_leadtitle>${user_leadtitle}</user_leadtitle>
                            <px_yueys>${px_yueys}</px_yueys>
                            <px_keyongys>${px_keyongys}</px_keyongys>
                            <px_yiyongys>${px_yiyongys}</px_yiyongys>
                            <px_feiyongsx>${px_feiyongsx}</px_feiyongsx>
                            <px_chaoysqk>${px_chaoysqk}</px_chaoysqk>
                            <yueys>${yueys}</yueys>
                            <keyongys>${keyongys}</keyongys>
                            <yiyongys>${yiyongys}</yiyongys>
                            <feiyongsx>${feiyongsx}</feiyongsx>
                            <chaoysqk>${chaoysqk}</chaoysqk>
                            <chailvlb>${chailvlb}</chailvlb>
                            <shifoujk>${shifoujk}</shifoujk>
                            <px_shifoucl>${px_shifoucl}</px_shifoucl>
                            <内部讲师外出学习>${nbjswcxx}</内部讲师外出学习>
                            <beizhu>${beizhu}</beizhu>
                            <受训人姓名>${fsxr}</受训人姓名>
                            <受训人工号>${fsxr_no}</受训人工号>
                            <受训人职务级别>${fsxr_grade}</受训人职务级别>
                            <if_verify>${if_verify}</if_verify>
                            <if_bx>${if_bx}</if_bx>
                            <px_amt>${px_amt}</px_amt>
                            <px_kechengzy>${px_kechengzy}</px_kechengzy>
                            <amt_ct>${amt_ct}</amt_ct>
                            <amt_zs_yxts>${amt_zs_yxts}</amt_zs_yxts>
                            <amt_zs_fxbz>${amt_zs_fxbz}</amt_zs_fxbz>
                            <amt_zs>${amt_zs}</amt_zs>
                            <chaobzqk>${chaobzqk}</chaobzqk>
                            <amt_cf_yxts>${amt_cf_yxts}</amt_cf_yxts>
                            <amt_cf_fxbz>${amt_cf_fxbz}</amt_cf_fxbz>
                            <amt_cf>${amt_cf}</amt_cf>
                            <amt_sn_yxts>${amt_sn_yxts}</amt_sn_yxts>
                            <amt_sn_fxbz>${amt_sn_fxbz}</amt_sn_fxbz>
                            <amt_sn>${amt_sn}</amt_sn>
                            <px_niqudecc>${px_niqudecc}</px_niqudecc>
                            <amt_qt>${amt_qt}</amt_qt>
                            <amt_zmx>${amt_zmx}</amt_zmx>
                            <amt_z2>${amt_z2}</amt_z2>
                            <amt_z>${amt_z}</amt_z>
                            <amt_zdx>${amt_zdx}</amt_zdx>
                            <jkje>${jkje}</jkje>
                            <jkjedx>${jkjedx}</jkjedx>
                            <jkcode>${jkcode}</jkcode>
                            <jkrem>${jkrem}</jkrem>
                        </fysq_travel_train_m>
                   `;
        for (var i = 0; i < mxlistArr1.length; i++) {
            xml += `
                          <fysq_travel_train_t2>
                                <RelationRowGuid>${i + 1}</RelationRowGuid>
                                <RowPrimaryKeys>itemid=${itemidArr[i]}</RowPrimaryKeys>
                                <zwjb>${mxlistArr1[i].zwjb}</zwjb>
                                <qsdate>${mxlistArr1[i].qsdate}</qsdate>
                                <zzdate>${mxlistArr1[i].zzdate}</zzdate>
                                <pxjgmc>${mxlistArr1[i].pxjgmc}</pxjgmc>
                                <pxdd>${mxlistArr1[i].pxdd}</pxdd>
                                <ckmc>${mxlistArr1[i].ckmc}</ckmc>
                                <pxjs>${mxlistArr1[i].pxjs}</pxjs>
                                <ywzs>${mxlistArr1[i].ywzs}</ywzs>
                            </fysq_travel_train_t2>

                       `;
        }
        if (mxlistArr2.length == 0) {
            xml += `
                         <fysq_travel_train_t>
                            <RelationRowGuid>${mxlistArr1.length  + 1}</RelationRowGuid>
                            <RowPrimaryKeys></RowPrimaryKeys>
                            <zwjb></zwjb>
                            <qsdate></qsdate>
                            <zzdate></zzdate>
                            <jtgj></jtgj>
                            <dd_pro></dd_pro>
                            <dd_city></dd_city>
                            <citymid></citymid>
                            <dqlb></dqlb>
                            <ccrs></ccrs>
                            <ccts></ccts>
                        </fysq_travel_train_t>

                       `;
        } else {
            for (var i = 0; i < mxlistArr2.length; i++) {
                xml += `
                         <fysq_travel_train_t>
                            <RelationRowGuid>${mxlistArr1.length + i + 1}</RelationRowGuid>
                            <RowPrimaryKeys>itemid=${itemidArr2[i] == undefined ? '' : itemidArr2[i]}</RowPrimaryKeys>
                            <zwjb>${mxlistArr2[i].zwjb}</zwjb>
                            <qsdate>${mxlistArr2[i].qsdate}</qsdate>
                            <zzdate>${mxlistArr2[i].zzdate}</zzdate>
                            <jtgj>${mxlistArr2[i].jtgj}</jtgj>
                            <dd_pro>${mxlistArr2[i].dd_pro}</dd_pro>
                            <dd_city>${mxlistArr2[i].dd_city}</dd_city>
                            <citymid>${mxlistArr2[i].citymid}</citymid>
                            <dqlb>${mxlistArr2[i].dqlb}</dqlb>
                            <ccrs>${mxlistArr2[i].ccrs}</ccrs>
                            <ccts>${mxlistArr2[i].ccts}</ccts>
                        </fysq_travel_train_t>

                       `;
            }
        }
        xml += `
                       </FormData>
                    </XForm>
                   `;
        PostXml(xml);
    }
}