function prepMsg() {
    $("#sqdate").val(getNowFormatDate(2));
    tapEvent();
    var xml = `<?xml version= "1.0" ?>
                  <Requests>
                      <Params>
                      <Method>GetFormPostData</Method>
                      <ProcessName>集团本部管理学院培训费申请</ProcessName>
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
        $("#dept_name").val(item.dept_name);
        $("#dept_no").val(item.dept_no);
        $("#fpxfbx").val(item.fpxfbx);
        $("#user_leadtitle").val(item.user_leadtitle);
        $("#user_name").val(item.user_name);
        $("#user_no").val(item.user_no);

    }).fail(function (e) {

    }).then(function (data) {
        searcHbudget();
        });
    uploadOpt();
}
function searcHbudget() {
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
        var budgetData = provideData.Tables[0].Rows[0];
        console.log(provideData);
        $("#yueys").val(budgetData.amt);
        $("#keyongys").val(budgetData.amt_hz);
        $("#yiyongys").val(budgetData.amt_yy);
       
        if (budgetData.amt_hz > 0) {
            $("#feiyongsx").val('预算内');
            $("#chaoysqk").val('未超支');
        } else {
            $("#feiyongsx").val('预算外');
            var p = formartNumber((budgetData.amt_yy - budgetData.amt) / (budgetData.amt == 0 ? 1 : budgetData.amt) * 100);
            if (p > 100) {
                p = 100;
            }
            $("#chaoysqk").val(p);
        }
    }).fail(function (e) {

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
    showPicker('comp_name', fgsmcdata);

    var opts = { "type": "date", "beginYear": new Date().getFullYear() - 1, "endYear": new Date().getFullYear() + 3 };

    var picker3 = new mui.DtPicker(opts);
    $('body').on('tap', '.dateChoosen', function () {
        var self = this;
        picker3.show(function (rs) {
            $(self).val(rs.text);
        });
    });
    var peixunlb_data = [
        {
            value: '',
            text:'内部讲师'
        },
        {
            value: '',
            text:'外部讲师'
        }
    ];
    showPicker('peixunlb', peixunlb_data);
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
    showPicker('if_cj', fif_data);

    var picker33 = new mui.PopPicker();
    picker33.setData(fif_data);
    $('#shifoujk').on('tap', () => {
        picker33.show((items) => {
            $("#shifoujk").val(items[0].text);
            if (items[0].text == '是') {
                $("#jkcard").show();
            } else {
                $("#jkcard").hide();
            }
        });
    });

    $('.mui-input-group').on('change', 'input[type="checkbox"]', function () {
        if (this.checked) {
            $(this).val(1);
            if ($(this).attr('id') == 'fpxfbx') {
                $("#fy_px").show();
            } else if ($(this).attr('id') == 'fqtfbx') {
                $("#fy_qt").show();
            }
        } else {
            $(this).val(0);
            if ($(this).attr('id') == 'fpxfbx') {
                $("#fy_px").hide();
            } else if ($(this).attr('id') == 'fqtfbx') {
                $("#fy_qt").hide();
            }
        }
        
    });


    var yssx_data = [
        {
            value: '',
            text:'预算内'
        },
        {
            value: '',
            text:'预算外'
        }

    ];
    showPicker('yssx', yssx_data);

    $("#tjmx").on('tap', function () {
        var li = `<div id="mx">
                    <div class="mui-input-row itemtitle">
                        <label>明细列表项</label>
                        <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>
                    </div>
                    <div class="mui-row cutOffLine" style="padding:3vw;">
                        <div class="mui-col-xs-6" style="display:flex;">
                            <label>费用项目<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fyxmmc" readonly placeholder="请选择"></textarea>
                        </div>
                        <div class="mui-col-xs-6" style="display:flex;">
                            <label>申请金额<i style="color:red;">*</i></label>
                            <input type="number" id="sqje" placeholder="请填写"/>
                        </div>                        
                    </div> 
                    <div class="mui-row cutOffLine" style="padding:3vw;">
                        <div class="mui-col-xs-12" style="display:flex;">
                            <label>备注说明</label>
                            <textarea rows="2" id="beizhusm" placeholder="请填写"></textarea>
                        </div>
                    </div>
                </div>
                  `;
        $("#mxlist").append(li);
    });
    $("#mxlist").on('input', 'input[type="number"]', function () {
        calcTotal();
    });
}

function calcTotal() {
    var hj = 0;

}

function deleteItem(context) {
    var btnArray = ['否', '是'];
    mui.confirm('确认删除？', '', btnArray, function (e) {
        if (e.index == 1) {
            $(context).parent().parent().remove();
            calcTotal();
        }
    });

}