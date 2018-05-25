function prepMsg() {
    $("#fsqrq").val(getNowFormatDate(2));
    tapEvent();
    var xml = `<?xml version= "1.0" ?>
                  <Requests>
                      <Params>
                      <Method>GetFormPostData</Method>
                      <ProcessName>集团本部招待费申请</ProcessName>
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
        $("#fbmmc").val(item.dept_name);
        $("#dept_no").val(item.dept_no);
        $("#user_leadtitle").val(item.user_leadtitle);
        $("#user_no").val(item.user_no);
        $("#fsqr").val(item.user_name);

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
                                 <ID>p_fysq_entertain</ID>
                                 <Type>1</Type>
                                 <Method>GetUserDataProcedure</Method>
                                 <ProcedureName>p_fysq_entertain</ProcedureName>
                                 <Filter>
                                       <dep>${$("#dept_no").val()}</dep>
                                       <rq>${$("#fsqrq").val()}</rq>              
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
        $("#fydys").val(budgetData.amt);
        $("#fkyys").val(budgetData.amt_hz);
        $("#fyyys").val(budgetData.amt_yy);
        if (budgetData.amt >= budgetData.amt_yy) {
            $("#ffysx").val('预算内');
            $("#fcys").val('未超支');
        } else {
            $("#ffysx").val('超预算');

            var p = formartNumber(((budgetData.amt_yy) - (budgetData.amt) )/ (budgetData.amt) * 100);
            $("#fcys").val(p);
        }
    }).fail(function (e) {

    });
}

function tapEvent() {
    var fgsmcdata = [
        {
            value: '',
            text:'威高集团有限公司'
        },
        {
            value: '',
            text:'威海威高国际医疗投资控股有限公司'
        }
    ];
    showPicker('fgsmc', fgsmcdata);

    var fzdfsdata = [

        {
            value: '',
            text:'公司外部招待'
        },
        {
            value: '',
            text:'公司内部招待'
        }
    ];
    showPicker('fzdfs', fzdfsdata);

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
    var element = document.getElementById('fif_jk');

    var picker = new mui.PopPicker();

    picker.setData(fif_data);

    element.addEventListener('tap', function () {

        picker.show(function (items) {

            element.value = items[0].text;
            if (items[0].text == '是') {
                $("#fjkcard").show();
            } else {
                $("#fjkcard").hide();
            }
        });

    }, false);
    $("#fjkje").on('input', function() {
        $("#fjkje_dx").val(atoc($("#fjkje").val()));
    });
    $("#tjmx").on('tap', function() {
        var li = `
                     <div id="mx" class="mui-card">
                          <div class="mui-input-row itemtitle">
                             <label>明细列表项</label>
                             <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>
                          </div>
                           <div class="mui-row cutOffLine" style="padding:3vw;">
                               <div class="mui-col-xs-4" style="display:flex;">
                                  <label>招待人数<i style="color:red;">*</i></label>
                                  <input type="number" id="zdrs" placeholder="请填写"/>  
                               </div>  
                               <div class="mui-col-xs-4" style="display:flex;">
                                   <label>单人招待标准<i style="color:red;">*</i></label>
                                   <input type="number" id="zdbz" placeholder="请填写"/>
                               </div>
                               <div class="mui-col-xs-4" style="display:flex;">
                                    <label>申请金额</label>
                                    <input type="text" id="sqje" readonly/>
                               </div>                                
                           </div>
                            <div class="mui-row cutOffLine" style="padding:3vw;">
                               <div class="mui-col-xs-4" style="display:flex;">
                                     <label>招待城市<i style="color:red;">*</i></label>
                                     <input type="text" id="zdcity" placeholder="请填写"/>
                                </div>  
                                <div class="mui-col-xs-4" style="display:flex;">
                                     <label>招待地点</label>
                                     <input type="text" id="zddd" placeholder="请填写"/>
                                </div>                                  
                            </div> 
                              <div class="mui-row cutOffLine" style="padding:3vw;">
                                 <div class="mui-col-xs-12" style="display:flex;">
                                      <label>事件描述及预期实现目标<i style="color:red;">*</i></label>
                                      <textarea id="rem" rows="2" placeholder="请填写"></textarea>
                                 </div>
                             </div>
                     </div>
                 `;
        $("#mxlist").append(li);
    });


    $("#mxlist").on('input', 'input[type="number"]', function() {
        calcPrice(this);
    });
}


function calcPrice(context) {

    zdrs = parseFloat($(context).parent().parent().find("#zdrs").val());
    zdrs = isNaN(zdrs) ? 0 : zdrs;
    zdbz = parseFloat($(context).parent().parent().find("#zdbz").val());
    zdbz = isNaN(zdbz) ? 0 : zdbz;
    sqje = 0;
    sqje = zdrs * zdbz;

    $(context).parent().parent().find("#sqje").val(sqje);
    calcTotal();
}
function calcTotal() {
    var fhj = 0;
    $("#mxlist").find("#sqje").each(function() {
        var sqje = parseFloat($(this).val());
        sqje = isNaN(sqje) ? 0 : sqje;
        fhj += sqje-0;

    });
    $("#fhj").val(fhj);
    $("#fhj_dx").val(atoc(fhj));

    var fkyys = parseFloat($("#fkyys").val());
    var fover = formartNumber((fhj - fkyys) / fkyys * 100);
    if (fover > 0) {
        $("#fcys").val(fover);
        $("#ffysx").val('超预算')
    }


}

var item = null;
var item_c = [];
function initData(data, flag) {

    item = data.FormDataSet.fysq_entertain_m[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.lscode);
    }
    $("#fgsmc").val(item.comp_name);
    $("#dept_no").val(item.dept_no);
   
    $("#user_leadtitle").val(item.user_leadtitle);
    $("#user_no").val(item.user_no);
    $("#fbmmc").val(item.dept_name);

    $("#fsqr").val(item.user_name);
    $("#fsqrq").val(FormatterTimeYMS(item.sqdate));
    $("#fydys").val(item.yueys);
    $("#fkyys").val(item.keyongys);
    $("#ffysx").val(item.feiyongsx);
    $("#fcys").val(item.chaoysqk);
    $("#fzdfs").val(item.zdfs);
    $("#fif_jk").val(item.shifoujk);
    if ($("#fif_jk").val() == '是') {
        $("#fjkcard").show();
    } else {
        $("#fjkcard").hide();
    }
    $("#fjkje").val(item.jkje);
    $("#fjkje_dx").val(item.jkjedx);
    $("#fjkdh").val(item.jkcode);
    $("#fjksy").val(item.jkrem);

    $("#fbz").val(item.rem);
    $("#fhj").val(item.amt_z);
    $("#fhj_dx").val(item.amt_zdx);


    item_c = data.FormDataSet.fysq_entertain_t;
    for (var i = 0; i < item_c.length; i++) {
        itemidArr.push(item_c[i].itemid);
        var li = `
                    <div id="mx" class="mui-card">
                          <div class="mui-input-row itemtitle">
                             <label>明细列表项</label>
                             <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>
                          </div>
                           <div class="mui-row cutOffLine" style="padding:3vw;">
                               <div class="mui-col-xs-4" style="display:flex;">
                                  <label>招待人数<i style="color:red;">*</i></label>
                                  <input type="number" id="zdrs" readonly value="${item_c[i].zdrs}"/>  
                               </div>  
                               <div class="mui-col-xs-4" style="display:flex;">
                                   <label>单人招待标准<i style="color:red;">*</i></label>
                                   <input type="number" id="zdbz" readonly value="${item_c[i].zdbz}"/>
                               </div>
                               <div class="mui-col-xs-4" style="display:flex;">
                                    <label>申请金额</label>
                                    <input type="text" id="sqje" readonly value="${item_c[i].sqje}"/>
                               </div>                                
                           </div>
                            <div class="mui-row cutOffLine" style="padding:3vw;">
                               <div class="mui-col-xs-4" style="display:flex;">
                                     <label>招待城市<i style="color:red;">*</i></label>
                                     <input type="text" id="zdcity" readonly value="${item_c[i].zdcity}"/>
                                </div>  
                                <div class="mui-col-xs-4" style="display:flex;">
                                     <label>招待地点</label>
                                     <input type="text" id="zddd" readonly value="${item_c[i].zddd}"/>
                                </div> 
                                
                            </div>  
                           <div class="mui-row cutOffLine" style="padding:3vw;">
                                <div class="mui-col-xs-12" style="display:flex;">
                                      <label>事件描述及预期实现目标<i style="color:red;">*</i></label>
                                      <textarea id="rem" rows="2" readonly>${item_c[i].rem}</textarea>
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
        $("#mxlist").find('input,textarea').each(function () {
            $(this).removeAttr('readonly');
        });
        $("#fbz,#fjkje,#fjksy").removeAttr('readonly');
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
class Mx {
    constructor(zdrs, zdbz, sqje, zdcity, zddd, rem) {
        this.zdrs = zdrs;
        this.zdbz = zdbz;
        this.sqje = sqje;
        this.zdcity = zdcity;
        this.zddd = zddd;
        this.rem = rem;
    }
    check() {
        if (!this.zdrs) {
            mui.toast('请填写招待人数');
            return true;
        }
        if (!this.zdbz) {
            mui.toast('请填写招待标准');
            return true;
        }
      
        if (!this.zdcity) {
            mui.toast('请填写招待城市');
            return true;
        }
        if (!this.rem) {
            mui.toast('请填写实现目标');
            return true;
        }
        return false;
    }

}

function Save() {

    var fgsmc = $("#fgsmc").val();
    var dept_no = $("#dept_no").val();
    var user_leadtitle = $("#user_leadtitle").val();
    var user_no = $("#user_no").val();
    var fbmmc = $("#fbmmc").val();
    var fsqr = $("#fsqr").val();
    var fsqrq = $("#fsqrq").val();
    var fydys = $("#fydys").val();
    var fkyys = $("#fkyys").val();
    var fyyys = $("#fyyys").val();
    var ffysx = $("#ffysx").val();
    var fcys = $("#fcys").val();
    var fzdfs = $("#fzdfs").val();
    var fif_jk = $("#fif_jk").val();
    var fbz = $("#fbz").val();
    var fjkje = $("#fjkje").val();
    var fjkje_dx = $("#fjkje_dx").val();
    var fjkdh = $("#fjkdh").val();
    var fjksy = $("#fjksy").val();

    var fhj = $("#fhj").val();
    var fhj_dx = $("#fhj_dx").val();

    if (!fgsmc) {
        mui.toast('请选择公司名称');
        return;
    }
    if (!fzdfs) {
        mui.toast('请选择招待方式');
        return;
    }
    if (!fif_jk) {
        mui.toast('请选择是否借款');
        return;
    }
    if (fif_jk == '是' && !fjkje) {
        mui.toast('请填写借款金额');
        return;
    }


    var mxflag = false;
    var mxlistArr = [];
    $("#mxlist").find("#mx").each(function () {
        var zdrs = $(this).find("#zdrs").val();
        var zdbz = $(this).find("#zdbz").val();
        var sqje = $(this).find("#sqje").val();
        var zdcity = $(this).find("#zdcity").val();
        var zddd = $(this).find("#zddd").val();
        var rem = $(this).find("#rem").val();
        var mx = new Mx(zdrs, zdbz, sqje, zdcity, zddd, rem);
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
    mui.confirm(ffysx + ":" + fcys+'%<br/>即将提交，是否确定？', '提交确认提醒', btnArry, function (e) {
        if (e.index == 1) {
            var xml = `<?xml version="1.0"?>
                        <XForm>
                            <Header>
                                <Method>Post</Method>
                                <ProcessName>集团本部招待费申请</ProcessName>
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
                     <fysq_entertain_m>
                        <lscode>自动生成</lscode>
                        <comp_name>${fgsmc}</comp_name>
                        <dept_no>${dept_no}</dept_no>
                        <dept_name>${fbmmc}</dept_name>
                        <user_no>${user_no}</user_no>
                        <user_name>${fsqr}</user_name>
                        <user_leadtitle>${user_leadtitle}</user_leadtitle>
                        <sqdate>${fsqrq}</sqdate>
                        <yueys>${fydys}</yueys>
                        <keyongys>${fkyys}</keyongys>
                        <yiyongys>${fyyys}</yiyongys>
                        <feiyongsx>${ffysx}</feiyongsx>
                        <chaoysqk>${fcys}</chaoysqk>
                        <zdfs>${fzdfs}</zdfs>
                        <shifoujk>${fif_jk}</shifoujk>
                        <rem>${fbz}</rem>
                        <if_bx></if_bx>
                        <if_verify></if_verify>
                        <amt_z>${fhj}</amt_z>
                        <amt_zdx>${fhj_dx}</amt_zdx>
                        <jkje>${fjkje}</jkje>
                        <jkjedx>${fjkje_dx}</jkjedx>
                        <jkcode>${fjkdh}</jkcode>
                        <jkrem>${fjksy}</jkrem>
                    </fysq_entertain_m>
                   `;
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `
                         <fysq_entertain_t>
                            <RelationRowGuid>${i+1}</RelationRowGuid>
                            <RowPrimaryKeys></RowPrimaryKeys>
                            <zdrs>${mxlistArr[i].zdrs}</zdrs>
                            <zdbz>${mxlistArr[i].zdbz}</zdbz>
                            <sqje>${mxlistArr[i].sqje}</sqje>
                            <zdcity>${mxlistArr[i].zdcity}</zdcity>
                            <zddd>${mxlistArr[i].zddd}</zddd>
                            <rem>${mxlistArr[i].rem}</rem>
                        </fysq_entertain_t>     
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

    var fgsmc = $("#fgsmc").val();
    var dept_no = $("#dept_no").val();
    var user_leadtitle = $("#user_leadtitle").val();
    var user_no = $("#user_no").val();
    var fbmmc = $("#fbmmc").val();
    var fsqr = $("#fsqr").val();
    var fsqrq = $("#fsqrq").val();
    var fydys = $("#fydys").val();
    var fkyys = $("#fkyys").val();
    var fyyys = $("#fyyys").val();
    var ffysx = $("#ffysx").val();
    var fcys = $("#fcys").val();
    var fzdfs = $("#fzdfs").val();
    var fif_jk = $("#fif_jk").val();
    var fbz = $("#fbz").val();
    var fjkje = $("#fjkje").val();
    var fjkje_dx = $("#fjkje_dx").val();
    var fjkdh = $("#fjkdh").val();
    var fjksy = $("#fjksy").val();

    var fhj = $("#fhj").val();
    var fhj_dx = $("#fhj_dx").val();

    if (!fgsmc) {
        mui.toast('请选择公司名称');
        return;
    }
    if (!fzdfs) {
        mui.toast('请选择招待方式');
        return;
    }
    if (!fif_jk) {
        mui.toast('请选择是否借款');
        return;
    }
    if (fif_jk == '是' && !fjkje) {
        mui.toast('请填写借款金额');
        return;
    }


    var mxflag = false;
    var mxlistArr = [];
    $("#mxlist").find("#mx").each(function () {
        var zdrs = $(this).find("#zdrs").val();
        var zdbz = $(this).find("#zdbz").val();
        var sqje = $(this).find("#sqje").val();
        var zdcity = $(this).find("#zdcity").val();
        var zddd = $(this).find("#zddd").val();
        var rem = $(this).find("#rem").val();
        var mx = new Mx(zdrs, zdbz, sqje, zdcity, zddd, rem);
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
                     <fysq_entertain_m>
                        <lscode>${fbillno}</lscode>
                        <comp_name>${fgsmc}</comp_name>
                        <dept_no>${dept_no}</dept_no>
                        <dept_name>${fbmmc}</dept_name>
                        <user_no>${user_no}</user_no>
                        <user_name>${fsqr}</user_name>
                        <user_leadtitle>${user_leadtitle}</user_leadtitle>
                        <sqdate>${fsqrq}</sqdate>
                        <yueys>${fydys}</yueys>
                        <keyongys>${fkyys}</keyongys>
                        <yiyongys>${fyyys}</yiyongys>
                        <feiyongsx>${ffysx}</feiyongsx>
                        <chaoysqk>${fcys}</chaoysqk>
                        <zdfs>${fzdfs}</zdfs>
                        <shifoujk>${fif_jk}</shifoujk>
                        <rem>${fbz}</rem>
                        <if_bx></if_bx>
                        <if_verify></if_verify>
                        <amt_z>${fhj}</amt_z>
                        <amt_zdx>${fhj_dx}</amt_zdx>
                        <jkje>${fjkje}</jkje>
                        <jkjedx>${fjkje_dx}</jkjedx>
                        <jkcode>${fjkdh}</jkcode>
                        <jkrem>${fjksy}</jkrem>
                    </fysq_entertain_m>
                   `;
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `
                         <fysq_entertain_t>
                            <RelationRowGuid>${i + 1}</RelationRowGuid>
                            <RowPrimaryKeys></RowPrimaryKeys>
                            <zdrs>${mxlistArr[i].zdrs}</zdrs>
                            <zdbz>${mxlistArr[i].zdbz}</zdbz>
                            <sqje>${mxlistArr[i].sqje}</sqje>
                            <zdcity>${mxlistArr[i].zdcity}</zdcity>
                            <zddd>${mxlistArr[i].zddd}</zddd>
                            <rem>${mxlistArr[i].rem}</rem>
                        </fysq_entertain_t>     
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
                       <fysq_entertain_m>
                            <lscode>${item.lscode}</lscode>
                            <comp_name>${item.comp_name}</comp_name>
                            <dept_no>${item.dept_no}</dept_no>
                            <dept_name>${item.dept_name}</dept_name>
                            <user_no>${item.user_no}</user_no>
                            <user_name>${item.user_name}</user_name>
                            <user_leadtitle>${item.user_leadtitle}</user_leadtitle>
                            <sqdate>${item.sqdate}</sqdate>
                            <yueys>${item.yueys}</yueys>
                            <keyongys>${item.keyongys}</keyongys>
                            <yiyongys>${item.yiyongys}</yiyongys>
                            <feiyongsx>${item.feiyongsx}</feiyongsx>
                            <chaoysqk>${item.chaoysqk}</chaoysqk>
                            <zdfs>${item.zdfs}</zdfs>
                            <shifoujk>${item.shifoujk}</shifoujk>
                            <rem>${item.rem}</rem>
                            <if_bx>${item.if_bx}</if_bx>
                            <if_verify>${item.if_verify}</if_verify>
                            <amt_z>${item.amt_z}</amt_z>
                            <amt_zdx>${item.amt_zdx}</amt_zdx>
                            <jkje>${item.jkje}</jkje>
                            <jkjedx>${item.jkjedx}</jkjedx>
                            <jkcode>${item.jkcode}</jkcode>
                            <jkrem>${item.jkrem}</jkrem>
                        </fysq_entertain_m>
                   `;
            for (var i = 0; i < item_c.length; i++) {
                xml += `
                          <fysq_entertain_t>
                            <RelationRowGuid>${i+1}</RelationRowGuid>
                            <RowPrimaryKeys>itemid=${item_c[i].itemid}</RowPrimaryKeys>
                            <zdrs>${item_c[i].zdrs}</zdrs>
                            <zdbz>${item_c[i].zdbz}</zdbz>
                            <sqje>${item_c[i].sqje}</sqje>
                            <zdcity>${item_c[i].zdcity}</zdcity>
                            <zddd>${item_c[i].zddd}</zddd>
                            <rem>${item_c[i].rem}</rem>
                        </fysq_entertain_t>
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
                       <fysq_entertain_m>
                            <lscode>${item.lscode}</lscode>
                            <comp_name>${item.comp_name}</comp_name>
                            <dept_no>${item.dept_no}</dept_no>
                            <dept_name>${item.dept_name}</dept_name>
                            <user_no>${item.user_no}</user_no>
                            <user_name>${item.user_name}</user_name>
                            <user_leadtitle>${item.user_leadtitle}</user_leadtitle>
                            <sqdate>${item.sqdate}</sqdate>
                            <yueys>${item.yueys}</yueys>
                            <keyongys>${item.keyongys}</keyongys>
                            <yiyongys>${item.yiyongys}</yiyongys>
                            <feiyongsx>${item.feiyongsx}</feiyongsx>
                            <chaoysqk>${item.chaoysqk}</chaoysqk>
                            <zdfs>${item.zdfs}</zdfs>
                            <shifoujk>${item.shifoujk}</shifoujk>
                            <rem>${item.rem}</rem>
                            <if_bx>${item.if_bx}</if_bx>
                            <if_verify>${item.if_verify}</if_verify>
                            <amt_z>${item.amt_z}</amt_z>
                            <amt_zdx>${item.amt_zdx}</amt_zdx>
                            <jkje>${item.jkje}</jkje>
                            <jkjedx>${item.jkjedx}</jkjedx>
                            <jkcode>${item.jkcode}</jkcode>
                            <jkrem>${item.jkrem}</jkrem>
                        </fysq_entertain_m>
                   `;
        for (var i = 0; i < item_c.length; i++) {
            xml += `
                          <fysq_entertain_t>
                            <RelationRowGuid>${i + 1}</RelationRowGuid>
                            <RowPrimaryKeys>itemid=${item_c[i].itemid}</RowPrimaryKeys>
                            <zdrs>${item_c[i].zdrs}</zdrs>
                            <zdbz>${item_c[i].zdbz}</zdbz>
                            <sqje>${item_c[i].sqje}</sqje>
                            <zdcity>${item_c[i].zdcity}</zdcity>
                            <zddd>${item_c[i].zddd}</zddd>
                            <rem>${item_c[i].rem}</rem>
                        </fysq_entertain_t>
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