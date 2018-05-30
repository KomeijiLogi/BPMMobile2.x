function prepMsg() {
    $("#sqdate").val(getNowFormatDate(2));
    tapEvent();
    var xml = `<?xml version= "1.0" ?>
                  <Requests>
                      <Params>
                      <Method>GetFormPostData</Method>
                      <ProcessName>集团本部市内交通费申请</ProcessName>
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
        $("#leadtitle").val(item.leadtitle);
        $("#dept_no").val(item.dept_no);
        $("#dept_name").val(item.dept_name);
        $("#user_no").val(item.user_no);
        $("#user_name").val(item.user_name);

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
                            <ID>p_fysq_snjt</ID>
                            <Type>1</Type>
                            <Method>GetUserDataProcedure</Method>
                            <ProcedureName>p_fysq_snjt</ProcedureName>
                            <Filter>                                   
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
        $("#amt_yy").val(budgetData.amt_yy);
        var keyongys = parseFloat( $("#keyongys").val());
        var feiyje = parseFloat( $("#feiyje").val());
        if (keyongys > feiyje) {
            $("#feiyongsx").val('计划内');
            $("#chaoysqk").val('未超支');
        } else {
            $("#feiyongsx").val('计划外');
            var p = formartNumber(( budgetData.amt_yy - budgetData.amt) / (budgetData.amt == 0 ? 1 : budgetData.amt) * 100);
           
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
    $('body').on('tap', '#sqdate', function () {
        var self = this;
        picker3.show(function (rs) {
            $(self).val(rs.text);
        });
    });

    var jiaotgj_data = [
        {
            value: '',
            text:'出租车'
        },
        {
            value: '',
            text:'公交车'
        }
    ];
    var picker2 = new mui.PopPicker();
    $('body').on('tap', '#jiaotgj', function () {
        var self = this;
        picker2.setData(jiaotgj_data);
        picker2.show(function (items) {
            $(self).val(items[0].text);
        });
    });

    $('body').on('input', '#shenqje', function () {
        calcTotal();
    });

    $("#tjmx").on('tap', function () {
        var li = `
                  <div id="mx">
                    <div class="mui-input-row itemtitle">
                        <label>明细列表项</label>
                        <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>
                    </div>
                    <div class="mui-row cutOffLine" style="padding:3vw;">
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>日期</label>
                            <textarea rows="2" id="sqdate" readonly placeholder="请选择"></textarea>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                             <label>出发地</label>
                            <textarea rows="2" id="chufd" placeholder="请填写"></textarea>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>目的地</label>
                            <textarea rows="2" id="mudd" placeholder="请填写"></textarea>
                        </div>
                    </div>
                    <div class="mui-row cutOffLine" style="padding:3vw;">
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>交通工具</label>
                            <textarea rows="2" id="jiaotgj" readonly placeholder="请选择"></textarea>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>申请金额</label>
                            <input type="number" id="shenqje" placeholder="请填写"/>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>备注</label>
                            <textarea rows="2" id="remark" placeholder="请填写"></textarea>
                        </div>
                    </div>
                 `;
        $("#mxlist").append(li);        
    });


}

function calcTotal() {
    var feiyje = 0;
    $("#mxlist").find('#shenqje').each(function () {
        var shenqje = parseFloat($(this).val());
        shenqje = isNaN(shenqje) ? 0 : shenqje;
        feiyje += shenqje - 0;
     
    });
    $("#feiyje").val(feiyje);
    var keyongys = parseFloat($("#keyongys").val());
    var feiyje = parseFloat($("#feiyje").val());
    var amt_yy = parseFloat($("#amt_yy").val());
    if (keyongys > feiyje) {
        $("#feiyongsx").val('计划内');
        $("#chaoysqk").val('未超支');
    } else {
        $("#feiyongsx").val('计划外');
        var p = formartNumber((amt_yy - keyongys + feiyje) / (keyongys == 0 ? 1 : keyongys) * 100);
        if (p > 100) {
            p = 100;
        }
        $("#chaoysqk").val(p);
        $("#feiydx").val(atoc(feiyje));
    }
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

var item = null;
var item_c = [];

function initData(data, flag) {
    item = data.FormDataSet.fysq_snjt_m[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.lscode);
    }
    $("#comp_name").val(item.comp_name);
    $("#dept_no").val(item.dept_no);
    $("#leadtitle").val(item.leadtitle);
    $("#dept_name").val(item.dept_name);
    $("#user_no").val(item.user_no);
    $("#user_name").val(item.user_name);
    $("#yueys").val(item.yueys);
    $("#keyongys").val(item.keyongys);
    $("#amt_yy").val(item.amt_yy);
    $("#sqdate").val(FormatterTimeYMS(item.sqdate));
    $("#feiyongsx").val(item.feiyongsx);
    $("#chaoysqk").val(item.chaoysqk);
    $("#feiyje").val(item.feiyje);
    $("#feiydx").val(item.feiydx);
    item_c = data.FormDataSet.fysq_snjt_t;
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
                            <label>日期</label>
                            <textarea rows="2" id="sqdate" readonly>${FormatterTimeYMS(item_c[i].sqdate)}</textarea>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                             <label>出发地</label>
                            <textarea rows="2" id="chufd" readonly>${item_c[i].chufd}</textarea>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>目的地</label>
                            <textarea rows="2" id="mudd" readonly>${item_c[i].mudd}</textarea>
                        </div>
                    </div>
                    <div class="mui-row cutOffLine" style="padding:3vw;">
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>交通工具</label>
                            <textarea rows="2" id="jiaotgj" readonly>${item_c[i].jiaotgj}</textarea>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>申请金额</label>
                            <input type="number" id="shenqje" readonly value="${item_c[i].shenqje}"/>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>备注</label>
                            <textarea rows="2" id="remark" readonly>${item_c[i].remark}</textarea>
                        </div>
                    </div>
               </div> 
                 `;
        $("#mxlist").append(li);
    }
}

function nodeControllerExp(NodeName) {
    if (String(NodeName).match('开始') != null) {
        tapEvent();
        searcHbudget();
        $("#mxlist").find('span').each(function () {
            $(this).show();
        });
        $("#mxlist").find("#chufd,#mudd,#shenqje,#remark").each(function () {
            $(this).removeAttr('readonly');
        });

    }
}

class Mx {
    constructor(sqdate, chufd, mudd, jiaotgj, shenqje, remark) {
        this.sqdate = sqdate;
        this.chufd = chufd;
        this.mudd = mudd;
        this.jiaotgj = jiaotgj;
        this.shenqje = shenqje;
        this.remark = remark;

    }
    check() {
        if (!this.sqdate) {
            mui.toast('请选择日期');
            return true;
        }
        if (!this.chufd) {
            mui.toast('请填写出发地');
            return true;
        }
        if (!this.mudd) {
            mui.toast('请填写目的地');
            return true;
        }
        if (!this.jiaotgj) {
            mui.toast('请选择交通工具');
            return true;
        }
        if (!this.shenqje) {
            mui.toast('请填写申请金额');
            return true;
        }
        return false;
    }
}

function Save() {
    var comp_name = $("#comp_name").val();
    var dept_no = $("#dept_no").val();
    var leadtitle = $("#leadtitle").val();
    var dept_name = $("#dept_name").val();
    var user_no = $("#user_no").val();
    var user_name = $("#user_name").val();
    var yueys = $("#yueys").val();
    var keyongys = $("#keyongys").val();
    var amt_yy = $("#amt_yy").val();
    var sqdate = $("#sqdate").val();
    var feiyongsx = $("#feiyongsx").val();
    var chaoysqk = $("#chaoysqk").val();
    var feiyje = $("#feiyje").val();
    var feiydx = $("#feiydx").val();

    if (!comp_name) {
        mui.toast('请选择公司名称');
        return;
    }

    var mxflag = false;
    var mxlistArr = [];
    $("#mxlist").find("#mx").each(function () {
        var sqdate = $(this).find("#sqdate").val();
        var chufd = $(this).find("#chufd").val();
        var mudd = $(this).find("#mudd").val();
        var jiaotgj = $(this).find("#jiaotgj").val();
        var shenqje = $(this).find("#shenqje").val();
        var remark = $(this).find("#remark").val();
        var mx = new Mx(sqdate, chufd, mudd, jiaotgj, shenqje, remark);
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
                                <ProcessName>集团本部市内交通费申请</ProcessName>
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
                     <fysq_snjt_m>
                        <lscode> </lscode>
                        <comp_name>${comp_name}</comp_name>
                        <leadtitle>${leadtitle}</leadtitle>
                        <dept_no>${dept_no}</dept_no>
                        <dept_name>${dept_name}</dept_name>
                        <user_no>${user_no}</user_no>
                        <user_name>${user_name}</user_name>
                        <yueys>${yueys}</yueys>
                        <keyongys>${keyongys}</keyongys>
                        <sqdate>${sqdate}</sqdate>
                        <feiyongsx>${feiyongsx}</feiyongsx>
                        <chaoysqk>${chaoysqk}</chaoysqk>
                        <feiyje>${feiyje}</feiyje>
                        <feiydx>${feiydx}</feiydx>
                    </fysq_snjt_m>
                   `;
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `
                        <fysq_snjt_t>
                            <RelationRowGuid>${i+1}</RelationRowGuid>
                            <RowPrimaryKeys></RowPrimaryKeys>
                            <sqdate>${mxlistArr[i].sqdate}</sqdate>
                            <chufd>${mxlistArr[i].chufd}</chufd>
                            <mudd>${mxlistArr[i].mudd}</mudd>
                            <jiaotgj>${mxlistArr[i].jiaotgj}</jiaotgj>
                            <shenqje>${mxlistArr[i].shenqje}</shenqje>
                            <remark>${mxlistArr[i].remark}</remark>
                        </fysq_snjt_t>
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
    var dept_no = $("#dept_no").val();
    var leadtitle = $("#leadtitle").val();
    var dept_name = $("#dept_name").val();
    var user_no = $("#user_no").val();
    var user_name = $("#user_name").val();
    var yueys = $("#yueys").val();
    var keyongys = $("#keyongys").val();
    var amt_yy = $("#amt_yy").val();
    var sqdate = $("#sqdate").val();
    var feiyongsx = $("#feiyongsx").val();
    var chaoysqk = $("#chaoysqk").val();
    var feiyje = $("#feiyje").val();
    var feiydx = $("#feiydx").val();

    if (!comp_name) {
        mui.toast('请选择公司名称');
        return;
    }

    var mxflag = false;
    var mxlistArr = [];
    $("#mxlist").find("#mx").each(function () {
        var sqdate = $(this).find("#sqdate").val();
        var chufd = $(this).find("#chufd").val();
        var mudd = $(this).find("#mudd").val();
        var jiaotgj = $(this).find("#jiaotgj").val();
        var shenqje = $(this).find("#shenqje").val();
        var remark = $(this).find("#remark").val();
        var mx = new Mx(sqdate, chufd, mudd, jiaotgj, shenqje, remark);
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
                     <fysq_snjt_m>
                        <lscode>${lscode}</lscode>
                        <comp_name>${comp_name}</comp_name>
                        <leadtitle>${leadtitle}</leadtitle>
                        <dept_no>${dept_no}</dept_no>
                        <dept_name>${dept_name}</dept_name>
                        <user_no>${user_no}</user_no>
                        <user_name>${user_name}</user_name>
                        <yueys>${yueys}</yueys>
                        <keyongys>${keyongys}</keyongys>
                        <sqdate>${sqdate}</sqdate>
                        <feiyongsx>${feiyongsx}</feiyongsx>
                        <chaoysqk>${chaoysqk}</chaoysqk>
                        <feiyje>${feiyje}</feiyje>
                        <feiydx>${feiydx}</feiydx>
                    </fysq_snjt_m>
                   `;
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `
                        <fysq_snjt_t>
                            <RelationRowGuid>${i + 1}</RelationRowGuid>
                            <RowPrimaryKeys></RowPrimaryKeys>
                            <sqdate>${mxlistArr[i].sqdate}</sqdate>
                            <chufd>${mxlistArr[i].chufd}</chufd>
                            <mudd>${mxlistArr[i].mudd}</mudd>
                            <jiaotgj>${mxlistArr[i].jiaotgj}</jiaotgj>
                            <shenqje>${mxlistArr[i].shenqje}</shenqje>
                            <remark>${mxlistArr[i].remark}</remark>
                        </fysq_snjt_t>
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
        console.log('-------主表---------');
        console.log(item);
        console.log('-------子表---------');
        console.log(item_c);

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
                       <fysq_snjt_m>
                            <lscode>${item.lscode}</lscode>
                            <comp_name>${item.comp_name}</comp_name>
                            <leadtitle>${item.leadtitle}</leadtitle>
                            <dept_no>${item.dept_no}</dept_no>
                            <dept_name>${item.dept_name}</dept_name>
                            <user_no>${item.user_no}</user_no>
                            <user_name>${item.user_name}</user_name>
                            <yueys>${item.yueys}</yueys>
                            <keyongys>${item.keyongys}</keyongys>
                            <sqdate>${item.sqdate}</sqdate>
                            <feiyongsx>${item.feiyongsx}</feiyongsx>
                            <chaoysqk>${item.chaoysqk}</chaoysqk>
                            <feiyje>${item.feiyje}</feiyje>
                            <feiydx>${item.feiydx}</feiydx>
                        </fysq_snjt_m>
                    `;
                for (var i = 0; i < item_c.length; i++) {
                    xml += `
                           <fysq_snjt_t>
                                <RelationRowGuid>${i + 1}</RelationRowGuid>
                                <RowPrimaryKeys>itemid=${item_c[i].itemid}</RowPrimaryKeys>
                                <sqdate>${item_c[i].sqdate}</sqdate>
                                <chufd>${item_c[i].chufd}</chufd>
                                <mudd>${item_c[i].mudd}</mudd>
                                <jiaotgj>${item_c[i].jiaotgj}</jiaotgj>
                                <shenqje>${item_c[i].shenqje}</shenqje>
                                <remark>${item_c[i].remark}</remark>
                            </fysq_snjt_t>
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
                       <fysq_snjt_m>
                            <lscode>${item.lscode}</lscode>
                            <comp_name>${item.comp_name}</comp_name>
                            <leadtitle>${item.leadtitle}</leadtitle>
                            <dept_no>${item.dept_no}</dept_no>
                            <dept_name>${item.dept_name}</dept_name>
                            <user_no>${item.user_no}</user_no>
                            <user_name>${item.user_name}</user_name>
                            <yueys>${item.yueys}</yueys>
                            <keyongys>${item.keyongys}</keyongys>
                            <sqdate>${item.sqdate}</sqdate>
                            <feiyongsx>${item.feiyongsx}</feiyongsx>
                            <chaoysqk>${item.chaoysqk}</chaoysqk>
                            <feiyje>${item.feiyje}</feiyje>
                            <feiydx>${item.feiydx}</feiydx>
                        </fysq_snjt_m>
                    `;
            for (var i = 0; i < item_c.length; i++) {
                xml += `
                           <fysq_snjt_t>
                                <RelationRowGuid>${i + 1}</RelationRowGuid>
                                <RowPrimaryKeys>itemid=${item_c[i].itemid}</RowPrimaryKeys>
                                <sqdate>${item_c[i].sqdate}</sqdate>
                                <chufd>${item_c[i].chufd}</chufd>
                                <mudd>${item_c[i].mudd}</mudd>
                                <jiaotgj>${item_c[i].jiaotgj}</jiaotgj>
                                <shenqje>${item_c[i].shenqje}</shenqje>
                                <remark>${item_c[i].remark}</remark>
                            </fysq_snjt_t>
                       `;
            }
            xml += `
                       </FormData>
                    </XForm>
                   `;
            PostXml(xml);

        }
    
}