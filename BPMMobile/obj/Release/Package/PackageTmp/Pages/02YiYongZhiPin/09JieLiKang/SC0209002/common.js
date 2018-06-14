function prepMsg() {
    $("#ftxrq").val(getNowFormatDate(2));
    tapEvent();
    var xml = `<?xml version= "1.0" ?>
                  <Requests>
                      <Params>
                      <Method>GetFormPostData</Method>
                      <ProcessName>洁丽康公司销售月计划提报</ProcessName>
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
        $("#fxsry").val(item.销售人员);
        $("#fxsqy").val(item.销售区域);


    }).fail(function (e) {

    });
}

function tapEvent() {

    var opts_M = { "type": "month" };
    $("#fmonth").on('tap', function () {
        var picker = new mui.DtPicker(opts_M);
        picker.show(function (rs) {
            $("#fmonth").val(rs.text);
        });
    });

    $("#tjmx_jh").on('tap', () =>{

        var li = `
                 <div id="mx" class="mui-card">
                    <div class="mui-input-row itemtitle">
                        <label>明细列表项</label>
                        <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>
                    </div>
                    <div class="mui-row cutOffLine" style="padding:3vw;">
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>日期<i style="color:red;">*</i></label>
                            <textarea rows="2" id="frq" name="frq" readonly placeholder="年/月/日"></textarea>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>目标客户名称<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fkhmc" placeholder="请填写"></textarea>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>是否新客户<i style="color:red;">*</i></label>
                            <input type="text" id="fif_xkh"  name="fif_xkh" readonly placeholder="请选择"/>
                        </div>
                    </div>
                    <div class="mui-row cutOffLine" style="padding:3vw;">
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>合同方案<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fhtfa" placeholder="请填写"></textarea>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>回款计划<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fhkjh" placeholder="请填写"></textarea>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>新客户开发计划<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fkfjh" placeholder="请填写"></textarea>
                        </div>
                    </div>
                </div>
                 `;
        $("#mxlist_jh").append(li);
    });
    $("#tjmx_sc").on('tap', () => {
        var li = `
                  <div id="mx" class="mui-card">
                        <div class="mui-input-row itemtitle">
                            <label>明细列表项</label>
                            <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>
                        </div>
                     <div class="mui-row cutOffLine" style="padding:3vw;">
                         <div class="mui-col-xs-6" style="display:flex;">
                             <label>日期<i style="color:red;">*</i></label>
                             <textarea rows="2" id="frq" name="frq" readonly placeholder="年/月/日"></textarea>
                         </div>
                         <div class="mui-col-xs-6" style="display:flex;">
                             <label>市场活动<i style="color:red;">*</i></label>
                             <textarea rows="2" id="fschd" placeholder="请填写"></textarea>
                         </div>
                     </div>
                     <div class="mui-row cutOffLine" style="padding:3vw;">
                         <div class="mui-col-xs-12" style="display:flex;">
                             <label>市场活动内容<i style="color:red;">*</i></label>
                             <textarea rows="2" id="fhdnr" placeholder="请填写"></textarea>
                         </div>
                     </div>
                 </div>
               `;
        $("#mxlist_sc").append(li);
    });

    var opts_YMD = {
        "type": "date", "beginYear": new Date().getFullYear()-1, "endYear": new Date().getFullYear()+3
    };
    $("#mxlist_sc,#mxlist_jh").on('tap', 'textarea[name="frq"]', function () {
        var self = this;
        var picker = new mui.DtPicker(opts_YMD);
        picker.show(function (rs) {
            $(self).val(rs.text);
        });
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
    $("#mxlist_jh").on('tap', "input[name='fif_xkh']", function () {
        var self = this;
        var picker = new mui.PopPicker();
        picker.setData(fif_data);
        picker.show(function (items) {
            $(self).val(items[0].text);
        });
    });


}

var itemidArr1 = [];
var itemidArr2 = [];
function initData(data, flag) {
    var item = data.FormDataSet.洁丽康公司_销售月计划_主表[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.fbillno);
    }
    $("#fxsry").val(item.销售人员);
    $("#fno").val(item.销售人员工号);
    $("#fxsqy").val(item.销售区域);
    $("#ftxrq").val(FormatterTimeYMS(item.填写日期));
    $("#fmonth").val(item.月);
    var item_b1 = data.FormDataSet.洁丽康公司_销售月计划_子表1;
    for (var i = 0; i < item_b1.length; i++) {
        itemidArr1.push(item_b1[i].itemid);
        var li = `
                 <div id="mx" class="mui-card">
                    <div class="mui-input-row itemtitle">
                        <label>明细列表项</label>
                        <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>
                    </div>
                    <div class="mui-row cutOffLine" style="padding:3vw;">
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>日期<i style="color:red;">*</i></label>
                            <textarea rows="2" id="frq" name="frq" readonly placeholder="年/月/日">${FormatterTimeYMS(item_b1[i].日期)}</textarea>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>目标客户名称<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fkhmc" readonly>${item_b1[i].目标客户名称}</textarea>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>是否新客户<i style="color:red;">*</i></label>
                            <input type="text" id="fif_xkh"  name="fif_xkh" readonly value="${item_b1[i].是否新客户}"/>
                        </div>
                    </div>
                    <div class="mui-row cutOffLine" style="padding:3vw;">
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>合同方案<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fhtfa" readonly>${item_b1[i].合同方案}</textarea>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>回款计划<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fhkjh" readonly>${item_b1[i].回款计划}</textarea>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>新客户开发计划<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fkfjh" readonly>${item_b1[i].新客户开发计划}</textarea>
                        </div>
                    </div>
                </div>
                 `;
        $("#mxlist_jh").append(li);
    }
    var item_b2 = data.FormDataSet.洁丽康公司_销售月计划_子表2;
    for (var i = 0; i < item_b2.length; i++) {
        itemidArr2.push(item_b2[i].itemid);

        var li = `
                  <div id="mx" class="mui-card">
                        <div class="mui-input-row itemtitle">
                            <label>明细列表项</label>
                            <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>
                        </div>
                     <div class="mui-row cutOffLine" style="padding:3vw;">
                         <div class="mui-col-xs-6" style="display:flex;">
                             <label>日期<i style="color:red;">*</i></label>
                             <textarea rows="2" id="frq" name="frq" readonly placeholder="年/月/日">${FormatterTimeYMS(item_b2[i].日期)}</textarea>
                         </div>
                         <div class="mui-col-xs-6" style="display:flex;">
                             <label>市场活动<i style="color:red;">*</i></label>
                             <textarea rows="2" id="fschd" readonly>${item_b2[i].市场活动}</textarea>
                         </div>
                     </div>
                     <div class="mui-row cutOffLine" style="padding:3vw;">
                         <div class="mui-col-xs-12" style="display:flex;">
                             <label>市场活动内容<i style="color:red;">*</i></label>
                             <textarea rows="2" id="fhdnr" readonly>${item_b2[i].市场活动内容}</textarea>
                         </div>
                     </div>
                 </div>
               `;
        $("#mxlist_sc").append(li);
    }
}
function nodeControllerExp(NodeName) {

    if (String(NodeName).match('开始') != null) {
        tapEvent();

    }
}
function checkNes() {
    var NodeName = $("#nodeName").val();

    return true;
}


class Mx_Jh{
    constructor(frq, fkhmc, fif_xkh, fhtfa, fhkjh, fkfjh) {
        this.frq = frq;
        this.fkhmc = fkhmc;
        this.fif_xkh = fif_xkh;
        this.fhtfa = fhtfa;
        this.fhkjh = fhkjh;
        this.fkfjh = fkfjh;

    }
    check() {
        if (!this.frq) {
            mui.toast('请选择日期');
            return true;
        }
        if (!this.fkhmc) {
            mui.toast('请填写目标客户名称');
            return true;
        }
        if (!this.fif_xkh) {
            mui.toast('请选择是否新客户');
            return true;
        }
        if (!this.fhtfa) {
            mui.toast('请填写合同方案');
            return true;
        }
        if (!this.fhkjh) {
            mui.toast('请填写回款计划');
            return true;
        }
        return false;
    }
}


class Mx_Sc{
    constructor(frq, fschd, fhdnr) {
        this.frq = frq;
        this.fschd = fschd;
        this.fhdnr = fhdnr;
    }
    check() {
        if (!this.frq) {
            mui.toast('请选择日期');
            return true;
        }
        if (!this.fschd) {
            mui.toast('请填写市场活动');
            return true;
        }
        if (!this.fhdnr) {
            mui.toast('请填写市场活动内容');
            return true;
        }
        return false;
    }
}

function Save() {

    var fxsry = $("#fxsry").val();
    var fno = $("#fno").val();
    var fxsqy = $("#fxsqy").val();
    var ftxrq = $("#ftxrq").val();
    var fmonth = $("#fmonth").val();
    if (!fmonth) {
        mui.toast('请选择月份');
        return;
    }
    var mxflag = false;
    var mxlistArr1 = [];
    var mxlistArr2 = [];
    $("#mxlist_jh").find("#mx").each(function () {
        var frq = $(this).find("#frq").val();
        var fkhmc = $(this).find("#fkhmc").val();
        var fif_xkh = $(this).find("#fif_xkh").val();
        var fhtfa = $(this).find("#fhtfa").val();
        var fhkjh = $(this).find("#fhkjh").val();
        var fkfjh = $(this).find("#fkfjh").val();
        var mx = new Mx_Jh(frq, fkhmc, fif_xkh, fhtfa, fhkjh, fkfjh);
        if (mx.check()) {
            mxflag = !mxflag;
            return;
        }
        mxlistArr1.push(mx); 
    });

    $("#mxlist_sc").find("#mx").each(function () {

        var frq = $(this).find("#frq").val();
        var fschd = $(this).find("#fschd").val();
        var fhdnr = $(this).find("#fhdnr").val();
        var mx = new Mx_Sc(frq, fschd, fhdnr);
        if (mx.check()) {
            mxflag = !mxflag;
            return;
        }
        mxlistArr2.push(mx); 
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
                                <ProcessName>洁丽康公司销售月计划提报</ProcessName>
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
                       <洁丽康公司_销售月计划_主表>
                        <单号>自动生成</单号>
                        <销售人员>${fxsry}</销售人员>
                        <销售区域>${fxsqy}</销售区域>
                        <填写日期>${ftxrq}</填写日期>
                        <月>${fmonth}</月>
                        <销售人员工号>${fno}</销售人员工号>
                    </洁丽康公司_销售月计划_主表>
                    `;
            for (var i = 0; i < mxlistArr1.length; i++) {
                xml += `
                          <洁丽康公司_销售月计划_子表1>
                            <RelationRowGuid>${i+1}</RelationRowGuid>
                            <RowPrimaryKeys></RowPrimaryKeys>
                            <序号>${i + 1}</序号>
                            <日期>${mxlistArr1[i].frq}</日期>
                            <目标客户名称>${mxlistArr1[i].fkhmc}</目标客户名称>
                            <是否新客户>${mxlistArr1[i].fif_xkh}</是否新客户>
                            <合同方案>${mxlistArr1[i].fhtfa}</合同方案>
                            <回款计划>${mxlistArr1[i].fhkjh}</回款计划>
                            <新客户开发计划>${mxlistArr1[i].fkfjh}</新客户开发计划>
                        </洁丽康公司_销售月计划_子表1>
                       `;
            }

            for (var i = 0; i < mxlistArr2.length; i++) {
                xml += `
                          <洁丽康公司_销售月计划_子表2>
                            <RelationRowGuid>${mxlistArr1.length+i+1}</RelationRowGuid>
                            <RowPrimaryKeys></RowPrimaryKeys>
                            <序号>${i + 1}</序号>
                            <日期>${mxlistArr2[i].frq}</日期>
                            <市场活动>${mxlistArr2[i].fschd}</市场活动>
                            <市场活动内容>${mxlistArr2[i].fhdnr}</市场活动内容>
                        </洁丽康公司_销售月计划_子表2>
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

    var fxsry = $("#fxsry").val();
    var fno = $("#fno").val();
    var fxsqy = $("#fxsqy").val();
    var ftxrq = $("#ftxrq").val();
    var fmonth = $("#fmonth").val();
    if (!fmonth) {
        mui.toast('请选择月份');
        return;
    }
    var mxflag = false;
    var mxlistArr1 = [];
    var mxlistArr2 = [];
    $("#mxlist_jh").find("#mx").each(function () {
        var frq = $(this).find("#frq").val();
        var fkhmc = $(this).find("#fkhmc").val();
        var fif_xkh = $(this).find("#fif_xkh").val();
        var fhtfa = $(this).find("#fhtfa").val();
        var fhkjh = $(this).find("#fhkjh").val();
        var fkfjh = $(this).find("#fkfjh").val();
        var mx = new Mx_Jh(frq, fkhmc, fif_xkh, fhtfa, fhkjh, fkfjh);
        if (mx.check()) {
            mxflag = !mxflag;
            return;
        }
        mxlistArr1.push(mx);
    });

    $("#mxlist_sc").find("#mx").each(function () {

        var frq = $(this).find("#frq").val();
        var fschd = $(this).find("#fschd").val();
        var fhdnr = $(this).find("#fhdnr").val();
        var mx = new Mx_Sc(frq, fschd, fhdnr);
        if (mx.check()) {
            mxflag = !mxflag;
            return;
        }
        mxlistArr2.push(mx);
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
                       <洁丽康公司_销售月计划_主表>
                        <单号>${fbillno}</单号>
                        <销售人员>${fxsry}</销售人员>
                        <销售区域>${fxsqy}</销售区域>
                        <填写日期>${ftxrq}</填写日期>
                        <月>${fmonth}</月>
                        <销售人员工号>${fno}</销售人员工号>
                    </洁丽康公司_销售月计划_主表>
                    `;
            for (var i = 0; i < mxlistArr1.length; i++) {
                xml += `
                          <洁丽康公司_销售月计划_子表1>
                            <RelationRowGuid>${i + 1}</RelationRowGuid>
                            <RowPrimaryKeys></RowPrimaryKeys>
                            <序号>${i + 1}</序号>
                            <日期>${mxlistArr1[i].frq}</日期>
                            <目标客户名称>${mxlistArr1[i].fkhmc}</目标客户名称>
                            <是否新客户>${mxlistArr1[i].fif_xkh}</是否新客户>
                            <合同方案>${mxlistArr1[i].fhtfa}</合同方案>
                            <回款计划>${mxlistArr1[i].fhkjh}</回款计划>
                            <新客户开发计划>${mxlistArr1[i].fkfjh}</新客户开发计划>
                        </洁丽康公司_销售月计划_子表1>
                       `;
            }

            for (var i = 0; i < mxlistArr2.length; i++) {
                xml += `
                          <洁丽康公司_销售月计划_子表2>
                            <RelationRowGuid>${mxlistArr1.length + i + 1}</RelationRowGuid>
                            <RowPrimaryKeys></RowPrimaryKeys>
                            <序号>${i + 1}</序号>
                            <日期>${mxlistArr2[i].frq}</日期>
                            <市场活动>${mxlistArr2[i].fschd}</市场活动>
                            <市场活动内容>${mxlistArr2[i].fhdnr}</市场活动内容>
                        </洁丽康公司_销售月计划_子表2>
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

    var fxsry = $("#fxsry").val();
    var fno = $("#fno").val();
    var fxsqy = $("#fxsqy").val();
    var ftxrq = $("#ftxrq").val();
    var fmonth = $("#fmonth").val();
   
    var mxflag = false;
    var mxlistArr1 = [];
    var mxlistArr2 = [];
    $("#mxlist_jh").find("#mx").each(function () {
        var frq = $(this).find("#frq").val();
        var fkhmc = $(this).find("#fkhmc").val();
        var fif_xkh = $(this).find("#fif_xkh").val();
        var fhtfa = $(this).find("#fhtfa").val();
        var fhkjh = $(this).find("#fhkjh").val();
        var fkfjh = $(this).find("#fkfjh").val();
        var mx = new Mx_Jh(frq, fkhmc, fif_xkh, fhtfa, fhkjh, fkfjh);
       
        mxlistArr1.push(mx);
    });

    $("#mxlist_sc").find("#mx").each(function () {

        var frq = $(this).find("#frq").val();
        var fschd = $(this).find("#fschd").val();
        var fhdnr = $(this).find("#fhdnr").val();
        var mx = new Mx_Sc(frq, fschd, fhdnr);
       
        mxlistArr2.push(mx);
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
                       <洁丽康公司_销售月计划_主表>
                        <单号>${fbillno}</单号>
                        <销售人员>${fxsry}</销售人员>
                        <销售区域>${fxsqy}</销售区域>
                        <填写日期>${ftxrq}</填写日期>
                        <月>${fmonth}</月>
                        <销售人员工号>${fno}</销售人员工号>
                    </洁丽康公司_销售月计划_主表>
                    `;
            for (var i = 0; i < mxlistArr1.length; i++) {
                xml += `
                          <洁丽康公司_销售月计划_子表1>
                            <RelationRowGuid>${i + 1}</RelationRowGuid>
                            <RowPrimaryKeys>itemid=${itemidArr1[i]}</RowPrimaryKeys>
                            <序号>${i + 1}</序号>
                            <日期>${mxlistArr1[i].frq}</日期>
                            <目标客户名称>${mxlistArr1[i].fkhmc}</目标客户名称>
                            <是否新客户>${mxlistArr1[i].fif_xkh}</是否新客户>
                            <合同方案>${mxlistArr1[i].fhtfa}</合同方案>
                            <回款计划>${mxlistArr1[i].fhkjh}</回款计划>
                            <新客户开发计划>${mxlistArr1[i].fkfjh}</新客户开发计划>
                        </洁丽康公司_销售月计划_子表1>
                       `;
            }

            for (var i = 0; i < mxlistArr2.length; i++) {
                xml += `
                          <洁丽康公司_销售月计划_子表2>
                            <RelationRowGuid>${mxlistArr1.length + i + 1}</RelationRowGuid>
                            <RowPrimaryKeys>itemid=${itemidArr2[i]}</RowPrimaryKeys>
                            <序号>${i + 1}</序号>
                            <日期>${mxlistArr2[i].frq}</日期>
                            <市场活动>${mxlistArr2[i].fschd}</市场活动>
                            <市场活动内容>${mxlistArr2[i].fhdnr}</市场活动内容>
                        </洁丽康公司_销售月计划_子表2>
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
                       <洁丽康公司_销售月计划_主表>
                        <单号>${fbillno}</单号>
                        <销售人员>${fxsry}</销售人员>
                        <销售区域>${fxsqy}</销售区域>
                        <填写日期>${ftxrq}</填写日期>
                        <月>${fmonth}</月>
                        <销售人员工号>${fno}</销售人员工号>
                    </洁丽康公司_销售月计划_主表>
                    `;
        for (var i = 0; i < mxlistArr1.length; i++) {
            xml += `
                          <洁丽康公司_销售月计划_子表1>
                            <RelationRowGuid>${i + 1}</RelationRowGuid>
                            <RowPrimaryKeys>itemid=${itemidArr1[i]}</RowPrimaryKeys>
                            <序号>${i + 1}</序号>
                            <日期>${mxlistArr1[i].frq}</日期>
                            <目标客户名称>${mxlistArr1[i].fkhmc}</目标客户名称>
                            <是否新客户>${mxlistArr1[i].fif_xkh}</是否新客户>
                            <合同方案>${mxlistArr1[i].fhtfa}</合同方案>
                            <回款计划>${mxlistArr1[i].fhkjh}</回款计划>
                            <新客户开发计划>${mxlistArr1[i].fkfjh}</新客户开发计划>
                        </洁丽康公司_销售月计划_子表1>
                       `;
        }

        for (var i = 0; i < mxlistArr2.length; i++) {
            xml += `
                          <洁丽康公司_销售月计划_子表2>
                            <RelationRowGuid>${mxlistArr1.length + i + 1}</RelationRowGuid>
                            <RowPrimaryKeys>itemid=${itemidArr2[i]}</RowPrimaryKeys>
                            <序号>${i + 1}</序号>
                            <日期>${mxlistArr2[i].frq}</日期>
                            <市场活动>${mxlistArr2[i].fschd}</市场活动>
                            <市场活动内容>${mxlistArr2[i].fhdnr}</市场活动内容>
                        </洁丽康公司_销售月计划_子表2>
                        `;
        }
        xml += `
                       </FormData>
                    </XForm>
                   `;
        PostXml(xml);
    }
}