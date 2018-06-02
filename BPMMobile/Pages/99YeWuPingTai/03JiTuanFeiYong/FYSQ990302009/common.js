function prepMsg() {

    $("#sqdate").val(getNowFormatDate(2));
    tapEvent();
    var xml = `<?xml version= "1.0" ?>
                  <Requests>
                      <Params>
                      <Method>GetFormPostData</Method>
                      <ProcessName>集团本部车辆费用申请(行政办公室)</ProcessName>
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
        $("#leadtitle").val(item.leadtitle);
        $("#user_name").val(item.user_name);
        $("#user_no").val(item.user_no);

    }).fail(function (e) {

        }).then(function () {
            searcHbudget();
        });
    initList();
}


function searcHbudget() {
    var xml = `<?xml version= "1.0" ?>
                    <Requests>
                        <Params>
                            <DataSource>BPM_EXPENSE</DataSource>
                            <ID>p_sq_yscar</ID>
                            <Type>1</Type>
                            <Method>GetUserDataProcedure</Method>
                            <ProcedureName>p_sq_yscar</ProcedureName>
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
        
        if (budgetData.amt_hz > 0) {
            $("#feiyongsx").val('预算内');
            $("#chaoysqk").val('未超支');
        } else {
            $("#feiyongsx").val('预算外');
            var p = formartNumber((budgetData.amt_yy - budgetData.amt) / (budgetData.amt == 0 ? 1 : budgetData.amt) * 100);
            
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
    $("#list").on('input', 'input[type="number"]', function () {
        calcT();
    });

    $("#jiekje").on('input', function () {
        $("#jiekjedx").val(atoc($("#jiekje").val()));
    });

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
    var element = document.getElementById('shifoujk');
    var picker = new mui.PopPicker();
    picker.setData(fif_data);
    element.addEventListener('tap', function () {
        picker.show(function (items) {
            element.value = items[0].text;
            if (items[0].text == '是') {
                $("#jkcard").show();
            } else if (items[0].text == '否') {
                $("#jkcard").hide();
            }
        });
    }, false);

}

function initList() {
    var li = `
           <div class="mui-row cutOffLine" style="padding:3vw;">
                <div class="mui-col-xs-1" style="display:flex;">
                    <label>1</label>
                </div>
                <div class="mui-col-xs-3" style="display:flex;">
                    <label>车辆保险费</label>
                </div>
                <div class="mui-col-xs-3" style="display:flex;">
                    <input type="number" id="fy_clbx" placeholder="请填写" style="height:0;"/>
                </div>
                <div class="mui-col-xs-5" style="display:flex;">                   
                   <textarea rows="2" id="bz_clbx" placeholder="请填写"></textarea> 
                </div>
            </div>
              <div class="mui-row cutOffLine" style="padding:3vw;">
                <div class="mui-col-xs-1" style="display:flex;">
                    <label>2</label>
                </div>
                <div class="mui-col-xs-3" style="display:flex;">
                    <label>车辆燃油费</label>
                </div>
                <div class="mui-col-xs-3" style="display:flex;">
                    <input type="number" id="fy_clry" placeholder="请填写" style="height:0;"/>
                </div>
                <div class="mui-col-xs-5" style="display:flex;">                   
                   <textarea rows="2" id="bz_clry" placeholder="请填写"></textarea> 
                </div>
            </div>
           <div class="mui-row cutOffLine" style="padding:3vw;">
                <div class="mui-col-xs-1" style="display:flex;">
                    <label>3</label>
                </div>
                <div class="mui-col-xs-3" style="display:flex;">
                    <label>车辆修理费</label>
                </div>
                <div class="mui-col-xs-3" style="display:flex;">
                    <input type="number" id="fy_clxl" placeholder="请填写" style="height:0;"/>
                </div>
                <div class="mui-col-xs-5" style="display:flex;">                   
                   <textarea rows="2" id="bz_clxl" placeholder="请填写"></textarea> 
                </div>
            </div>
             <div class="mui-row cutOffLine" style="padding:3vw;">
                <div class="mui-col-xs-1" style="display:flex;">
                    <label>4</label>
                </div>
                <div class="mui-col-xs-3" style="display:flex;">
                    <label>停车过路费</label>
                </div>
                <div class="mui-col-xs-3" style="display:flex;">
                    <input type="number" id="fy_tcgl" placeholder="请填写" style="height:0;"/>
                </div>
                <div class="mui-col-xs-5" style="display:flex;">                   
                   <textarea rows="2" id="bz_tcgl" placeholder="请填写"></textarea> 
                </div>
            </div>
             <div class="mui-row cutOffLine" style="padding:3vw;">
                <div class="mui-col-xs-1" style="display:flex;">
                    <label>5</label>
                </div>
                <div class="mui-col-xs-3" style="display:flex;">
                    <label>出车补助</label>
                </div>
                <div class="mui-col-xs-3" style="display:flex;">
                    <input type="number" id="fy_ccbz" placeholder="请填写" style="height:0;"/>
                </div>
                <div class="mui-col-xs-5" style="display:flex;">                   
                   <textarea rows="2" id="bz_ccbz" placeholder="请填写"></textarea> 
                </div>
            </div>
             <div class="mui-row cutOffLine" style="padding:3vw;">
                <div class="mui-col-xs-1" style="display:flex;">
                    <label>6</label>
                </div>
                <div class="mui-col-xs-3" style="display:flex;">
                    <label>其它车辆费用</label>
                </div>
                <div class="mui-col-xs-3" style="display:flex;">
                    <input type="number" id="fy_qtcl" placeholder="请填写" style="height:0;"/>
                </div>
                <div class="mui-col-xs-5" style="display:flex;">                   
                   <textarea rows="2" id="bz_qtcl" placeholder="请填写"></textarea> 
                </div>
            </div>
    `; 
    $("#list").append(li);
}

function calcT() {

    var feiyje_hj = 0;
    $("#list").find('input[type="number"]').each(function () {
        var val = parseFloat($(this).val());
        val = isNaN(val) ? 0 : val;
        feiyje_hj += val;
    });
    $("#feiyje_hj").val(feiyje_hj);
    $("#feiydx").val(atoc(feiyje_hj));
    var yueys = parseFloat($("#yueys").val());
    var keyongys = parseFloat($("#keyongys").val());
    if (keyongys > feiyje_hj) {
        $("#feiyongsx").val('预算内');
        $("#chaoysqk").val('未超支');
    } else {
        $("#feiyongsx").val('预算外');
        var p = formartNumber(( keyongys + feiyje_hj) / (keyongys == 0 ? 1 : keyongys) * 100);
      
        $("#chaoysqk").val(p);
    }
}


function initData(data, flag) {
    var item = data.FormDataSet.fysq_car_m[0];
    if (flag) {
        $("#taskId").val(item.taskid);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.lscode);
    }
    $("#comp_name").val(item.comp_name);
    $("#if_verify").val(item.if_verify);
    $("#leadtitle").val(item.leadtitle);
    $("#dept_name").val(item.dept_name);
    $("#dept_no").val(item.dept_no);
    $("#user_name").val(item.user_name);
    $("#user_no").val(item.user_no);
    $("#yueys").val(item.yueys);
    $("#keyongys").val(item.keyongys);
    $("#sqdate").val(FormatterTimeYMS(item.sqdate));
    $("#feiyongsx").val(item.feiyongsx);
    $("#shifoujk").val(item.shifoujk);
    $("#chaoysqk").val(item.chaoysqk);
    $("#fbz").val(item.beizhu);
    $("#feiyje_hj").val(item.feiyje);
    $("#feiydx").val(item.feiydx);
    $("#jiekdh").val(item.jiekdh);
    $("#jiekje").val(item.jiekje);
    $("#jiekjedx").val(item.jiekjedx);
    $("#jiekremark").val(item.jiekremark);
    if (item.shifoujk == '是') {
        $("#jkcard").show();

    }

    var item_c = data.FormDataSet.fysq_car_t;
    for (var i = 0; i < item_c.length; i++) {
        itemidArr.push(item_c[i].itemid);
        var li = `
              <div class="mui-row cutOffLine" style="padding:3vw;">
                <div class="mui-col-xs-1" style="display:flex;">
                    <label>${i+1}</label>
                </div>
                <div class="mui-col-xs-3" style="display:flex;">
                    <label id="feiylx">${item_c[i].feiylx}</label>
                </div>
                <div class="mui-col-xs-3" style="display:flex;">
                    <input type="number" id="feiyje" readonly style="height:0;" value="${item_c[i].feiyje}"/>
                </div>
                <div class="mui-col-xs-5" style="display:flex;">
                   <textarea rows="2" id="remark" readonly>${changeNullToEmpty(item_c[i].remark)}</textarea > 
                </div>
            </div>
                 `;
        $("#list").append(li);
    }
}

function nodeControllerExp(NodeName) {

    if (String(NodeName).match('开始') != null) {
        tapEvent();
        searcHbudget();
        $("#fbz,#jiekje,#jiekremark").removeAttr('readonly');
        $("#list").find('input,textarea').each(function () {
            $(this).removeAttr('readonly');
        });
    }
}

class Mx {
    constructor(feiylx, feiyje, remark) {
        this.feiylx = feiylx;
        this.feiyje = feiyje;
        this.remark = remark;
    }
}


function Save() {
    var comp_name = $("#comp_name").val();
    var if_verify = $("#if_verify").val();
    var leadtitle = $("#leadtitle").val();
    var dept_name = $("#dept_name").val();
    var dept_no = $("#dept_no").val();
    var user_name = $("#user_name").val();
    var user_no = $("#user_no").val();
    var yueys = $("#yueys").val();
    var keyongys = $("#keyongys").val();
    var sqdate = $("#sqdate").val();
    var feiyongsx = $("#feiyongsx").val();
    var chaoysqk = $("#chaoysqk").val();
    var shifoujk = $("#shifoujk").val();
    var fbz = $("#fbz").val();
    var jiekdh = $("#jiekdh").val();
    var jiekje = $("#jiekje").val();
    var jiekjedx = $("#jiekjedx").val();
    var jiekremark = $("#jiekremark").val();
    var feiyje_hj = $("#feiyje_hj").val();
    var feiydx = $("#feiydx").val();
    if (!comp_name) {
        mui.toast('请选择公司名称');
        return;
    }
    if (shifoujk == '是' && !jiekje) {
        mui.toast('请填写借款金额');
        return;
    }
    if (feiyje_hj == 0) {
        mui.toast('申请总金额大于0');
        return;
    }

    var listArr = [];
    $("#list").find('.mui-row').each(function () {
        var feiylx = $(this).find('label').text();
        var feiyje = $(this).find('input[type="number"]').val();
        var remark = $(this).find('textarea').val();

        var lt = new Mx(feiylx, feiyje, remark);
        listArr.push(lt);

    });

    var btnArry = ["取消", "确定"];
    mui.confirm('即将提交，是否确定？', '提交确认提醒', btnArry, function (e) {
        if (e.index == 1) {
            var xml = `<?xml version="1.0"?>
                        <XForm>
                            <Header>
                                <Method>Post</Method>
                                <ProcessName>集团本部车辆费用申请(行政办公室)</ProcessName>
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
                    <fysq_car_m>
                    <lscode></lscode>
                    <comp_name>${comp_name}</comp_name>
                    <if_verify>${if_verify}</if_verify>
                    <leadtitle>${leadtitle}</leadtitle>
                    <dept_name>${dept_name}</dept_name>
                    <dept_no>${dept_no}</dept_no>
                    <user_name>${user_name}</user_name>
                    <user_no>${user_no}</user_no>
                    <yueys>${yueys}</yueys>
                    <keyongys>${keyongys}</keyongys>
                    <sqdate>${sqdate}</sqdate>
                    <feiyongsx>${feiyongsx}</feiyongsx>
                    <chaoysqk>${chaoysqk}</chaoysqk>
                    <shifoujk>${shifoujk}</shifoujk>
                    <beizhu>${fbz}</beizhu>
                    <feiyje>${feiyje_hj}</feiyje>
                    <feiydx>${feiydx}</feiydx>
                    <jiekdh>${jiekdh}</jiekdh>
                    <jiekje>${jiekje}</jiekje>
                    <jiekjedx>${jiekjedx}</jiekjedx>
                    <jiekremark>${jiekremark}</jiekremark>
                </fysq_car_m>
                   `;
            for (var i = 0; i < listArr.length; i++) {
                xml += `
                          <fysq_car_t>
                            <RelationRowGuid>${i+1}</RelationRowGuid>
                            <RowPrimaryKeys></RowPrimaryKeys>
                            <feiylx>${listArr[i].feiylx}</feiylx>
                            <feiyje>${listArr[i].feiyje}</feiyje>
                            <remark>${listArr[i].remark}</remark>
                        </fysq_car_t>
                        `;
            }
            xml += `
                       </FormData>
                    </XForm>
                   `;
            PostXml(xml);
        }
    });
}

function reSave() {
    var fbillno = $("#fbillno").val();
    var pid = $("#stepId").val();

    var comp_name = $("#comp_name").val();
    var if_verify = $("#if_verify").val();
    var leadtitle = $("#leadtitle").val();
    var dept_name = $("#dept_name").val();
    var dept_no = $("#dept_no").val();
    var user_name = $("#user_name").val();
    var user_no = $("#user_no").val();
    var yueys = $("#yueys").val();
    var keyongys = $("#keyongys").val();
    var sqdate = $("#sqdate").val();
    var feiyongsx = $("#feiyongsx").val();
    var chaoysqk = $("#chaoysqk").val();
    var shifoujk = $("#shifoujk").val();
    var fbz = $("#fbz").val();
    var jiekdh = $("#jiekdh").val();
    var jiekje = $("#jiekje").val();
    var jiekjedx = $("#jiekjedx").val();
    var jiekremark = $("#jiekremark").val();
    var feiyje_hj = $("#feiyje_hj").val();
    var feiydx = $("#feiydx").val();
    if (!comp_name) {
        mui.toast('请选择公司名称');
        return;
    }
    if (shifoujk == '是' && !jiekje) {
        mui.toast('请填写借款金额');
        return;
    }
    if (feiyje_hj == 0) {
        mui.toast('申请总金额大于0');
        return;
    }

    var listArr = [];
    $("#list").find('.mui-row').each(function () {
        var feiylx = $(this).find('#feiylx').text();
        var feiyje = $(this).find('#feiyje').val();
        var remark = $(this).find('#remark').val();

        var lt = new Mx(feiylx, feiyje, remark);
        listArr.push(lt);

    });
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
                    <fysq_car_m>
                    <lscode></lscode>
                    <comp_name>${comp_name}</comp_name>
                    <if_verify>${if_verify}</if_verify>
                    <leadtitle>${leadtitle}</leadtitle>
                    <dept_name>${dept_name}</dept_name>
                    <dept_no>${dept_no}</dept_no>
                    <user_name>${user_name}</user_name>
                    <user_no>${user_no}</user_no>
                    <yueys>${yueys}</yueys>
                    <keyongys>${keyongys}</keyongys>
                    <sqdate>${sqdate}</sqdate>
                    <feiyongsx>${feiyongsx}</feiyongsx>
                    <chaoysqk>${chaoysqk}</chaoysqk>
                    <shifoujk>${shifoujk}</shifoujk>
                    <beizhu>${fbz}</beizhu>
                    <feiyje>${feiyje_hj}</feiyje>
                    <feiydx>${feiydx}</feiydx>
                    <jiekdh>${jiekdh}</jiekdh>
                    <jiekje>${jiekje}</jiekje>
                    <jiekjedx>${jiekjedx}</jiekjedx>
                    <jiekremark>${jiekremark}</jiekremark>
                </fysq_car_m>
                   `;
            for (var i = 0; i < listArr.length; i++) {
                xml += `
                          <fysq_car_t>
                            <RelationRowGuid>${i + 1}</RelationRowGuid>
                            <RowPrimaryKeys></RowPrimaryKeys>
                            <feiylx>${listArr[i].feiylx}</feiylx>
                            <feiyje>${listArr[i].feiyje}</feiyje>
                            <remark>${listArr[i].remark}</remark>
                        </fysq_car_t>
                        `;
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
    var if_verify = $("#if_verify").val();
    var leadtitle = $("#leadtitle").val();
    var dept_name = $("#dept_name").val();
    var dept_no = $("#dept_no").val();
    var user_name = $("#user_name").val();
    var user_no = $("#user_no").val();
    var yueys = $("#yueys").val();
    var keyongys = $("#keyongys").val();
    var sqdate = $("#sqdate").val();
    var feiyongsx = $("#feiyongsx").val();
    var chaoysqk = $("#chaoysqk").val();
    var shifoujk = $("#shifoujk").val();
    var fbz = $("#fbz").val();
    var jiekdh = $("#jiekdh").val();
    var jiekje = $("#jiekje").val();
    var jiekjedx = $("#jiekjedx").val();
    var jiekremark = $("#jiekremark").val();
    var feiyje_hj = $("#feiyje_hj").val();
    var feiydx = $("#feiydx").val();

    var listArr = [];
    $("#list").find('.mui-row').each(function () {
        var feiylx = $(this).find('#feiylx').text();
        var feiyje = $(this).find('#feiyje').val();
        var remark = $(this).find('#remark').val();

        var lt = new Mx(feiylx, feiyje, remark);
        listArr.push(lt);

    });
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
                    <fysq_car_m>
                    <lscode>${fbillno}</lscode>
                    <comp_name>${comp_name}</comp_name>
                    <if_verify>${if_verify}</if_verify>
                    <leadtitle>${leadtitle}</leadtitle>
                    <dept_name>${dept_name}</dept_name>
                    <dept_no>${dept_no}</dept_no>
                    <user_name>${user_name}</user_name>
                    <user_no>${user_no}</user_no>
                    <yueys>${yueys}</yueys>
                    <keyongys>${keyongys}</keyongys>
                    <sqdate>${sqdate}</sqdate>
                    <feiyongsx>${feiyongsx}</feiyongsx>
                    <chaoysqk>${chaoysqk}</chaoysqk>
                    <shifoujk>${shifoujk}</shifoujk>
                    <beizhu>${fbz}</beizhu>
                    <feiyje>${feiyje_hj}</feiyje>
                    <feiydx>${feiydx}</feiydx>
                    <jiekdh>${jiekdh}</jiekdh>
                    <jiekje>${jiekje}</jiekje>
                    <jiekjedx>${jiekjedx}</jiekjedx>
                    <jiekremark>${jiekremark}</jiekremark>
                </fysq_car_m>
                   `;
            for (var i = 0; i < listArr.length; i++) {
                xml += `
                          <fysq_car_t>
                            <RelationRowGuid>${i + 1}</RelationRowGuid>
                            <RowPrimaryKeys>itemid=${itemidArr[i]}</RowPrimaryKeys>
                            <feiylx>${listArr[i].feiylx}</feiylx>
                            <feiyje>${listArr[i].feiyje}</feiyje>
                            <remark>${listArr[i].remark}</remark>
                        </fysq_car_t>
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
                    <fysq_car_m>
                    <lscode>${fbillno}</lscode>
                    <comp_name>${comp_name}</comp_name>
                    <if_verify>${if_verify}</if_verify>
                    <leadtitle>${leadtitle}</leadtitle>
                    <dept_name>${dept_name}</dept_name>
                    <dept_no>${dept_no}</dept_no>
                    <user_name>${user_name}</user_name>
                    <user_no>${user_no}</user_no>
                    <yueys>${yueys}</yueys>
                    <keyongys>${keyongys}</keyongys>
                    <sqdate>${sqdate}</sqdate>
                    <feiyongsx>${feiyongsx}</feiyongsx>
                    <chaoysqk>${chaoysqk}</chaoysqk>
                    <shifoujk>${shifoujk}</shifoujk>
                    <beizhu>${fbz}</beizhu>
                    <feiyje>${feiyje_hj}</feiyje>
                    <feiydx>${feiydx}</feiydx>
                    <jiekdh>${jiekdh}</jiekdh>
                    <jiekje>${jiekje}</jiekje>
                    <jiekjedx>${jiekjedx}</jiekjedx>
                    <jiekremark>${jiekremark}</jiekremark>
                </fysq_car_m>
                   `;
        for (var i = 0; i < listArr.length; i++) {
            xml += `
                          <fysq_car_t>
                            <RelationRowGuid>${i + 1}</RelationRowGuid>
                            <RowPrimaryKeys>itemid=${itemidArr[i]}</RowPrimaryKeys>
                            <feiylx>${listArr[i].feiylx}</feiylx>
                            <feiyje>${listArr[i].feiyje}</feiyje>
                            <remark>${listArr[i].remark}</remark>
                        </fysq_car_t>
                        `;
        }
        xml += `
                       </FormData>
                    </XForm>
                   `;
        PostXml(xml);
    }
}