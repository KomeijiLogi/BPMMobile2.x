function prepMsg() {
    $("#sqdate").val(getNowFormatDate(2));
    
    var xml = `<?xml version= "1.0" ?>
                  <Requests>
                      <Params>
                      <Method>GetFormPostData</Method>
                      <ProcessName>集团本部其他费用申请</ProcessName>
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
        $("#if_verify").val(item.if_verify);
        $("#leadtitle").val(item.leadtitle);
        $("#dept_name").val(item.dept_name);
        $("#dept_no").val(item.dept_no);
        $("#user_name").val(item.user_name);
        $("#user_no").val(item.user_no);

    }).fail(function (e) {


        }).then(function () {
            initList();
        });
    
   
}


var listData = [];
function initList() {
    var xml = `<?xml version= "1.0" ?>
                    <Requests>
                        <Params>
                            <DataSource>BPM_EXPENSE</DataSource>
                            <ID>erpcloud_公用_查询其他费用项目</ID>
                            <Type>1</Type>
                            <Method>GetUserDataProcedure</Method>
                            <ProcedureName>erpcloud_公用_查询其他费用项目</ProcedureName>
                            <Filter></Filter>
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
        var itemData = provideData.Tables[0].Rows;
        console.log(provideData);
        for (var i = 0; i < itemData.length; i++) {
            var obj = {
                value: itemData[i].fyxm_no,
                text: itemData[i].fyxm_name
            };
            listData.push(obj);
        }
        console.log('-------listData-------');
        console.log(listData);
    }).fail(function (e) {

        }).then(function () {

            tapEvent();
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
    var pii = new mui.PopPicker();
    pii.setData(fif_data);
    $("#shifoujk").on('tap', function () {
        pii.show((items) => {
            $("#shifoujk").val(items[0].text);
            if (items[0].text == '是') {
                $("#jkcard").show();
            } else {
                $("#jkcard").hide();
            }
        });

    });


    $("#tjmx").on('tap', () => {
        var li = `
                <div id="mx">
                    <div class="mui-input-row itemtitle">
                        <label>明细列表项</label>
                        <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>
                    </div>
                    <div class="mui-row cutOffLine" style="padding:3vw;">
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>费用项目</label>
                            <textarea rows="2" id="feiyxm" readonly placeholder="请选择"></textarea>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>月度预算</label>
                            <input type="hidden" id="feiyxmcode" readonly/>
                            <textarea rows="2" id="yuedysje" readonly></textarea>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>可用预算</label>
                            <textarea rows="2" id="keyysje" readonly></textarea>
                        </div>
                        <input type="hidden" id="amt_yy" readonly/>
                    </div>
                    <div class="mui-row cutOffLine" style="padding:3vw;">
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>费用属性</label>
                            <textarea rows="2" id="feiysx" readonly></textarea>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>申请金额</label>
                            <input id="shenqje" type="number" placeholder="请填写" style="height:0;"/>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>超预算情况%</label>
                            <textarea rows="2" id="chaoysqk" readonly></textarea>
                        </div>
                       
                    </div>
                    <div class="mui-row cutOffLine" style="padding:3vw;">
                        <div class="mui-col-xs-12" style="display:flex;">
                            <label>事件描述及预期实现目标<i style="color:red;">*</i></label>
                            <textarea rows="4" id="remark" placeholder="请填写"></textarea>
                        </div>
                    </div>
                </div>
                 `;
        $("#mxlist").append(li);

    });

    var picker = new mui.PopPicker();
    picker.setData(listData);

    $("#mxlist").on('tap', '#feiyxm', function () {
        var self = this;
        picker.show(function (items) {
            $(self).val(items[0].text);
            $(self).parent().parent().find("#feiyxmcode").val(items[0].value);
            var xml = `<?xml version= "1.0" ?>
                    <Requests>
                        <Params>
                            <DataSource>BPM_EXPENSE</DataSource>
                            <ID>p_fysq_qita</ID>
                            <Type>1</Type>
                            <Method>GetUserDataProcedure</Method>
                            <ProcedureName>p_fysq_qita</ProcedureName>
                            <Filter>
                               <deptno>${$("#dept_no").val()}</deptno>
                               <ys_month>${$("#sqdate").val()}</ys_month> 
                                <fycode>${items[0].value}</fycode> 
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
                $(self).parent().parent().find("#yuedysje").val(itemData.amt);
                $(self).parent().parent().find("#keyysje").val(itemData.amt_hz);
                $(self).parent().parent().find("#amt_yy").val(itemData.amt_yy);
                if (itemData.amt_hz > 0) {
                    $(self).parents("#mx").find("#feiysx").val('计划内');

                    $(self).parents("#mx").find("#chaoysqk").val('未超支');
                } else {
                    $(self).parents("#mx").find("#feiysx").val('计划外');

                    var p = formartNumber((itemData.amt_yy - itemData.amt) / (itemData.amt == 0 ? 1 : itemData.amt) * 100);

                    $(self).parents("#mx").find("#chaoysqk").val(p);

                }

            }).fail(function (e) {

            });
        });        
    });
    $("#mxlist").on('input', 'input[type="number"]', function () {
        var self = this;
        var slv = parseFloat($(this).val());
        slv = isNaN(slv) ? 0 : slv;
        var yuedysje = $(this).parents("#mx").find("#yuedysje").val();
        var keyysje = $(this).parents("#mx").find("#keyysje").val();
        var amt_yy = $(this).parents("#mx").find("#amt_yy").val();

        var p = formartNumber((amt_yy + slv - yuedysje) / (yuedysje == 0 ? 1 : yuedysje) * 100);
        if (p < 100) {
            p = '未超支';
        }
        $(this).parents("#mx").find("#chaoysqk").val(p);
        calcT();
    });

}


function calcT() {
    var feiyje = 0;
    $("#mxlist").find("#mx").each(function () {
        var shenqje = parseFloat($(this).find("#shenqje").val());
        shenqje = isNaN(shenqje) ? 0 : shenqje;
        feiyje += shenqje-0;
    });
    $("#feiyje").val(feiyje);
    $("#feiydx").val(atoc(feiyje));
}

function initData(data, flag) {
    var item = data.FormDataSet.fysq_qtfy_m[0];
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
    $("#sqdate").val(FormatterTimeYMS(item.sqdate));
    $("#shifoujk").val(item.shifoujk);
    $("#beizhu").val(item.beizhu);
    $("#feiyje").val(item.feiyje);
    $("#feiydx").val(item.feiydx);
    $("#jiekdh").val(item.jiekdh);
    $("#jiekje").val(item.jiekje);
    $("#jiekjedx").val(item.jiekjedx);
    $("#jiekremark").val(item.jiekremark);
    var item_c = data.FormDataSet.fysq_qtfy_t;
    for (var i = 0; i < item_c.length; i++) {
        itemidArr.push(item_c[i].itemid);
        var li = `
               <div id="mx">
                    <div class="mui-input-row itemtitle">
                        <label>明细列表项</label>
                        <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>
                    </div>
                    <div class="mui-row cutOffLine" style="padding:3vw;">
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>费用项目</label>
                            <textarea rows="2" id="feiyxm" readonly >${item_c[i].feiyxm}</textarea>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>月度预算</label>
                            <input type="hidden" id="feiyxmcode" readonly/>
                            <textarea rows="2" id="yuedysje" readonly>${item_c[i].yuedysje}</textarea>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>可用预算</label>
                            <textarea rows="2" id="keyysje" readonly>${item_c[i].keyysje}</textarea>
                        </div>
                        <input type="hidden" id="amt_yy" readonly value="${item_c[i].amt_yy}"/>
                    </div>
                    <div class="mui-row cutOffLine" style="padding:3vw;">
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>费用属性</label>
                            <textarea rows="2" id="feiysx" readonly>${item_c[i].feiysx}</textarea>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>申请金额</label>
                            <input id="shenqje" type="number" readonly style="height:0;" value="${item_c[i].shenqje}"/>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>超预算情况%</label>
                            <textarea rows="2" id="chaoysqk" readonly>${item_c[i].chaoysqk}</textarea>
                        </div>
                       
                    </div>
                    <div class="mui-row cutOffLine" style="padding:3vw;">
                        <div class="mui-col-xs-12" style="display:flex;">
                            <label>事件描述及预期实现目标<i style="color:red;">*</i></label>
                            <textarea rows="4" id="remark" readonly>${item_c[i].remark}</textarea>
                        </div>
                    </div>
                </div>
                 `;
        $("#mxlist").append(li);
    }
}

function nodeControllerExp(nodeName) {
    if (String(nodeName).match('开始') != null) {
        initList();
        $("#jiekje,#jiekremark,#beizhu").removeAttr('readonly');
        $("#tjmx").show();
        $("#mxlist").find('span').each(function () {
            $(this).show;
        });
        $("#mxlist").find('#shenqje,#remark').each(function () {
            $(this).removeAttr('readonly');
        });

    }
}

function deleteItem(context) {
    var btnArray = ['否', '是'];
    mui.confirm('确认删除？', '', btnArray, function (e) {
        if (e.index == 1) {
            $(context).parent().parent().remove();
            calcT();
        }
    });
}

class Mx {
    constructor(feiyxm, feiyxmcode, yuedysje, keyysje, feiysx, shenqje, chaoysqk, remark) {
        this.feiyxm = feiyxm;
        this.feiyxmcode = feiyxmcode;
        this.yuedysje = yuedysje;
        this.keyysje = keyysje;
        this.feiysx = feiysx;
        this.shenqje = shenqje;
        this.chaoysqk = chaoysqk;
        this.remark = remark;
    }
    check() {
        if (!this.feiyxm) {
            mui.toast('请选择费用项目');
            return true;
        }
        if (!this.remark) {
            mui.toast('请填写事件描述及预期实现目标');
            return true;
        }
        return false;
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
    var sqdate = $("#sqdate").val();
    var shifoujk = $("#shifoujk").val();
    var beizhu = $("#beizhu").val();

    var feiyje = $("#feiyje").val();
    var feiydx = $("#feiydx").val();
    var jiekdh = $("#jiekdh").val();
    var jiekje = $("#jiekje").val();
    var jiekjedx = $("#jiekjedx").val();
    var jiekremark = $("#jiekremark").val();

    if (!comp_name) {
        mui.toast('请选择公司名称');
        return;
    }
    if (shifoujk == '是' && !jiekje) {
        mui.toast('请填写借款金额');
        return;
    }

    var mxflag = false;
    var mxlistArr = [];
    $("#mxlist").find("#mx").each(function () {
        var feiyxm = $(this).find("#feiyxm").val();
        var feiyxmcode = $(this).find("#feiyxmcode").val();
        var yuedysje = $(this).find("#yuedysje").val();
        var keyysje = $(this).find("#keyysje").val();
        var feiysx = $(this).find("#feiysx").val();
        var shenqje = $(this).find("#shenqje").val();
        var chaoysqk = $(this).find("#chaoysqk").val();
        var remark = $(this).find("#remark").val();
        var mx = new Mx(feiyxm, feiyxmcode, yuedysje, keyysje, feiysx, shenqje, chaoysqk, remark);
        if (mx.check()) {
            mxflag = !mxflag;
            return;
        }
        mxlistArr.push(mx);
    });
    if (mxflag) {
        return;
    }

    var btnArry = ["取消", "确定"];
    mui.confirm('即将提交，是否确定？', '提交确认提醒', btnArry, function (e) {
        if (e.index == 1) {
            var xml = `<?xml version="1.0"?>
                        <XForm>
                            <Header>
                                <Method>Post</Method>
                                <ProcessName>集团本部其他费用申请</ProcessName>
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
                      <fysq_qtfy_m>
                        <lscode></lscode>
                        <comp_name>${comp_name}</comp_name>
                        <if_verify>${if_verify}</if_verify>
                        <leadtitle>${leadtitle}</leadtitle>
                        <dept_name>${dept_name}</dept_name>
                        <dept_no>${dept_no}</dept_no>
                        <user_name>${user_name}</user_name>
                        <user_no>${user_no}</user_no>
                        <sqdate>${sqdate}</sqdate>
                        <shifoujk>${shifoujk}</shifoujk>
                        <beizhu>${beizhu}</beizhu>
                        <feiyje>${feiyje}</feiyje>
                        <feiydx>${feiydx}</feiydx>
                        <jiekdh>${jiekdh}</jiekdh>
                        <jiekje>${jiekje}</jiekje>
                        <jiekjedx>${jiekjedx}</jiekjedx>
                        <jiekremark>${jiekremark}</jiekremark>
                    </fysq_qtfy_m>
                   `;

            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `

                       <fysq_qtfy_t>
                            <RelationRowGuid>${i+1}</RelationRowGuid>
                            <RowPrimaryKeys></RowPrimaryKeys>
                            <feiyxm>${mxlistArr[i].feiyxm}</feiyxm>
                            <feiyxmcode>${mxlistArr[i].feiyxmcode}</feiyxmcode>
                            <yuedysje>${mxlistArr[i].yuedysje}</yuedysje>
                            <keyysje>${mxlistArr[i].keyysje}</keyysje>
                            <feiysx>${mxlistArr[i].feiysx}</feiysx>
                            <shenqje>${mxlistArr[i].shenqje}</shenqje>
                            <chaoysqk>${mxlistArr[i].chaoysqk}</chaoysqk>
                            <remark>${mxlistArr[i].remark}</remark>
                        </fysq_qtfy_t>
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
    var sqdate = $("#sqdate").val();
    var shifoujk = $("#shifoujk").val();
    var beizhu = $("#beizhu").val();

    var feiyje = $("#feiyje").val();
    var feiydx = $("#feiydx").val();
    var jiekdh = $("#jiekdh").val();
    var jiekje = $("#jiekje").val();
    var jiekjedx = $("#jiekjedx").val();
    var jiekremark = $("#jiekremark").val();

    if (!comp_name) {
        mui.toast('请选择公司名称');
        return;
    }
    if (shifoujk == '是' && !jiekje) {
        mui.toast('请填写借款金额');
        return;
    }

    var mxflag = false;
    var mxlistArr = [];
    $("#mxlist").find("#mx").each(function () {
        var feiyxm = $(this).find("#feiyxm").val();
        var feiyxmcode = $(this).find("#feiyxmcode").val();
        var yuedysje = $(this).find("#yuedysje").val();
        var keyysje = $(this).find("#keyysje").val();
        var feiysx = $(this).find("#feiysx").val();
        var shenqje = $(this).find("#shenqje").val();
        var chaoysqk = $(this).find("#chaoysqk").val();
        var remark = $(this).find("#remark").val();
        var mx = new Mx(feiyxm, feiyxmcode, yuedysje, keyysje, feiysx, shenqje, chaoysqk, remark);
        if (mx.check()) {
            mxflag = !mxflag;
            return;
        }
        mxlistArr.push(mx);
    });
    if (mxflag) {
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
                      <fysq_qtfy_m>
                        <lscode></lscode>
                        <comp_name>${comp_name}</comp_name>
                        <if_verify>${if_verify}</if_verify>
                        <leadtitle>${leadtitle}</leadtitle>
                        <dept_name>${dept_name}</dept_name>
                        <dept_no>${dept_no}</dept_no>
                        <user_name>${user_name}</user_name>
                        <user_no>${user_no}</user_no>
                        <sqdate>${sqdate}</sqdate>
                        <shifoujk>${shifoujk}</shifoujk>
                        <beizhu>${beizhu}</beizhu>
                        <feiyje>${feiyje}</feiyje>
                        <feiydx>${feiydx}</feiydx>
                        <jiekdh>${jiekdh}</jiekdh>
                        <jiekje>${jiekje}</jiekje>
                        <jiekjedx>${jiekjedx}</jiekjedx>
                        <jiekremark>${jiekremark}</jiekremark>
                    </fysq_qtfy_m>
                   `;

            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `

                       <fysq_qtfy_t>
                            <RelationRowGuid>${i + 1}</RelationRowGuid>
                            <RowPrimaryKeys></RowPrimaryKeys>
                            <feiyxm>${mxlistArr[i].feiyxm}</feiyxm>
                            <feiyxmcode>${mxlistArr[i].feiyxmcode}</feiyxmcode>
                            <yuedysje>${mxlistArr[i].yuedysje}</yuedysje>
                            <keyysje>${mxlistArr[i].keyysje}</keyysje>
                            <feiysx>${mxlistArr[i].feiysx}</feiysx>
                            <shenqje>${mxlistArr[i].shenqje}</shenqje>
                            <chaoysqk>${mxlistArr[i].chaoysqk}</chaoysqk>
                            <remark>${mxlistArr[i].remark}</remark>
                        </fysq_qtfy_t>
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
    var sqdate = $("#sqdate").val();
    var shifoujk = $("#shifoujk").val();
    var beizhu = $("#beizhu").val();

    var feiyje = $("#feiyje").val();
    var feiydx = $("#feiydx").val();
    var jiekdh = $("#jiekdh").val();
    var jiekje = $("#jiekje").val();
    var jiekjedx = $("#jiekjedx").val();
    var jiekremark = $("#jiekremark").val();

   

    var mxflag = false;
    var mxlistArr = [];
    $("#mxlist").find("#mx").each(function () {
        var feiyxm = $(this).find("#feiyxm").val();
        var feiyxmcode = $(this).find("#feiyxmcode").val();
        var yuedysje = $(this).find("#yuedysje").val();
        var keyysje = $(this).find("#keyysje").val();
        var feiysx = $(this).find("#feiysx").val();
        var shenqje = $(this).find("#shenqje").val();
        var chaoysqk = $(this).find("#chaoysqk").val();
        var remark = $(this).find("#remark").val();
        var mx = new Mx(feiyxm, feiyxmcode, yuedysje, keyysje, feiysx, shenqje, chaoysqk, remark);
       
        mxlistArr.push(mx);
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
                      <fysq_qtfy_m>
                        <lscode>${fbillno}</lscode>
                        <comp_name>${comp_name}</comp_name>
                        <if_verify>${if_verify}</if_verify>
                        <leadtitle>${leadtitle}</leadtitle>
                        <dept_name>${dept_name}</dept_name>
                        <dept_no>${dept_no}</dept_no>
                        <user_name>${user_name}</user_name>
                        <user_no>${user_no}</user_no>
                        <sqdate>${sqdate}</sqdate>
                        <shifoujk>${shifoujk}</shifoujk>
                        <beizhu>${beizhu}</beizhu>
                        <feiyje>${feiyje}</feiyje>
                        <feiydx>${feiydx}</feiydx>
                        <jiekdh>${jiekdh}</jiekdh>
                        <jiekje>${jiekje}</jiekje>
                        <jiekjedx>${jiekjedx}</jiekjedx>
                        <jiekremark>${jiekremark}</jiekremark>
                    </fysq_qtfy_m>
                   `;

            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `

                       <fysq_qtfy_t>
                            <RelationRowGuid>${i + 1}</RelationRowGuid>
                            <RowPrimaryKeys>itemid=${itemidArr[i]}</RowPrimaryKeys>
                            <feiyxm>${mxlistArr[i].feiyxm}</feiyxm>
                            <feiyxmcode>${mxlistArr[i].feiyxmcode}</feiyxmcode>
                            <yuedysje>${mxlistArr[i].yuedysje}</yuedysje>
                            <keyysje>${mxlistArr[i].keyysje}</keyysje>
                            <feiysx>${mxlistArr[i].feiysx}</feiysx>
                            <shenqje>${mxlistArr[i].shenqje}</shenqje>
                            <chaoysqk>${mxlistArr[i].chaoysqk}</chaoysqk>
                            <remark>${mxlistArr[i].remark}</remark>
                        </fysq_qtfy_t>
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
                      <fysq_qtfy_m>
                        <lscode>${fbillno}</lscode>
                        <comp_name>${comp_name}</comp_name>
                        <if_verify>${if_verify}</if_verify>
                        <leadtitle>${leadtitle}</leadtitle>
                        <dept_name>${dept_name}</dept_name>
                        <dept_no>${dept_no}</dept_no>
                        <user_name>${user_name}</user_name>
                        <user_no>${user_no}</user_no>
                        <sqdate>${sqdate}</sqdate>
                        <shifoujk>${shifoujk}</shifoujk>
                        <beizhu>${beizhu}</beizhu>
                        <feiyje>${feiyje}</feiyje>
                        <feiydx>${feiydx}</feiydx>
                        <jiekdh>${jiekdh}</jiekdh>
                        <jiekje>${jiekje}</jiekje>
                        <jiekjedx>${jiekjedx}</jiekjedx>
                        <jiekremark>${jiekremark}</jiekremark>
                    </fysq_qtfy_m>
                   `;

        for (var i = 0; i < mxlistArr.length; i++) {
            xml += `

                       <fysq_qtfy_t>
                            <RelationRowGuid>${i + 1}</RelationRowGuid>
                            <RowPrimaryKeys>itemid=${itemidArr[i]}</RowPrimaryKeys>
                            <feiyxm>${mxlistArr[i].feiyxm}</feiyxm>
                            <feiyxmcode>${mxlistArr[i].feiyxmcode}</feiyxmcode>
                            <yuedysje>${mxlistArr[i].yuedysje}</yuedysje>
                            <keyysje>${mxlistArr[i].keyysje}</keyysje>
                            <feiysx>${mxlistArr[i].feiysx}</feiysx>
                            <shenqje>${mxlistArr[i].shenqje}</shenqje>
                            <chaoysqk>${mxlistArr[i].chaoysqk}</chaoysqk>
                            <remark>${mxlistArr[i].remark}</remark>
                        </fysq_qtfy_t>
                       `;
        }
        xml += `
                       </FormData>
                    </XForm>
                   `;
        PostXml(xml);
    }
}