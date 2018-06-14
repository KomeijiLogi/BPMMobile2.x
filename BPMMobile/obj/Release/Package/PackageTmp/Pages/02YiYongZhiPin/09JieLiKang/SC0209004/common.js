function prepMsg() {
    $("#fdate").val(getNowFormatDate(2));
    tapEvent();
    var xml = `<?xml version= "1.0" ?>
                  <Requests>
                      <Params>
                      <Method>GetFormPostData</Method>
                      <ProcessName>洁丽康公司排产申请</ProcessName>
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
        $("#fname").val(item.申请人);
        $("#fdept").val(item.申请部门);


    }).fail(function (e) {

    });
}

function tapEvent() {
    $("#tjmx").on('tap', function () {
        var li = `
                  <div id="mx" class="mui-card">
                    <div class="mui-input-row itemtitle">
                        <label>明细列表项</label>
                        <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>
                    </div>
                    <div class="mui-row cutOffLine" style="padding:3vw;">
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>产品编码<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fcpbm" placeholder="请填写"></textarea>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>产品名称<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fcpmc" placeholder="请填写"></textarea>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>规格型号<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fggxh" placeholder="请填写"></textarea>                            
                        </div>
                    </div>  
                    <div class="mui-row cutOffLine" style="padding:3vw;">
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>材质<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fcz" placeholder="请填写"></textarea>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>单位<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fdw" placeholder="请填写"></textarea>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>数量<i style="color:red;">*</i></label>
                            <input type="number" id="fsl" placeholder="请填写"/>
                        </div>
                    </div>  
                     <div class="mui-row cutOffLine" style="padding:3vw;">
                         <div class="mui-col-xs-6" style="display:flex;">
                             <label>出货日期<i style="color:red;">*</i></label>
                             <textarea rows="2" id="fchrq" name="fchrq" readonly placeholder="年/月/日"></textarea>
                         </div>
                         <div class="mui-col-xs-6" style="display:flex;">
                             <label>备注<i style="color:red;">*</i></label>
                             <textarea rows="2" id="fbz" placeholder="请填写"></textarea>
                         </div>
                     </div>
                 </div>                  
             `;
        $("#mxlist").append(li);

    });
    var opts = {
        "type": "date", "beginYear": new Date().getFullYear() - 1, "endYear": new Date().getFullYear()+3
    };

    $("#mxlist").on('tap', 'textarea[name="fchrq"]', function () {
        var self = this;
        var picker = new mui.DtPicker(opts); 
        picker.show(function (rs) {
            $(self).val(rs.text);
        });
    });


}

function initData(data, flag) {
    var item = data.FormDataSet.洁丽康公司_排产申请_主表[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.fbillno);
    }
    $("#fname").val(item.申请人);
    $("#fdept").val(item.申请部门);
    $("#fdate").val(FormatterTimeYMS(item.申请日期));
    $("#fxszj").val(item.销售总监);
    $("#ffgld").val(item.生产分管领导);
    $("#fxszj_date").val(item.销售总监审核日期);
    $("#ffgld_date").val(item.生产分管领导审核日期);

    var item_c = data.FormDataSet.洁丽康公司_排产申请_子表1;
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
                            <label>产品编码<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fcpbm" readonly>${item_c[i].产品编码}</textarea>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>产品名称<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fcpmc" readonly>${item_c[i].产品名称}</textarea>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>规格型号<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fggxh" readonly>${item_c[i].规格型号}</textarea>                            
                        </div>
                    </div>  
                    <div class="mui-row cutOffLine" style="padding:3vw;">
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>材质<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fcz" readonly>${item_c[i].材质}</textarea>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>单位<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fdw" readonly>${item_c[i].单位}</textarea>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>数量<i style="color:red;">*</i></label>
                            <input type="number" id="fsl" readonly value="${item_c[i].数量}"/>
                        </div>
                    </div>  
                     <div class="mui-row cutOffLine" style="padding:3vw;">
                         <div class="mui-col-xs-6" style="display:flex;">
                             <label>出货日期<i style="color:red;">*</i></label>
                             <textarea rows="2" id="fchrq" name="fchrq" readonly placeholder="年/月/日">${FormatterTimeYMS(item_c[i].出货日期)}</textarea>
                         </div>
                         <div class="mui-col-xs-6" style="display:flex;">
                             <label>备注<i style="color:red;">*</i></label>
                             <textarea rows="2" id="fbz" readonly>${item_c[i].备注}</textarea>
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
    }

}

function checkNes() {

    var NodeName = $("#nodeName").val();
    return true;

}

class Mx {
    constructor(fcpbm, fcpmc, fggxh, fcz, fdw, fsl, fchrq, fbz) {
        this.fcpbm = fcpbm;
        this.fcpmc = fcpmc;
        this.fggxh = fggxh;
        this.fcz = fcz;
        this.fdw = fdw;
        this.fsl = fsl;
        this.fchrq = fchrq;
        this.fbz = fbz;
    }
    check() {
        if (!this.fcpbm) {
            mui.toast('请填写产品编码');
            return true;
        }
        if (!this.fcpmc) {
            mui.toast('请填写产品名称');
            return true;
        }
        if (!this.fggxh) {
            mui.toast('请填写规格型号');
            return true;
        }
        if (!this.fcz) {
            mui.toast('请填写材质');
            return true;
        }
        if (!this.fdw) {
            mui.toast('请填写单位');
            return true;
        }
        if (!this.fsl) {
            mui.toast('请填写数量');
            return true;
        }
        if (!this.fchrq) {
            mui.toast('请填写出货日期');
            return true;
        }
        if (!this.fbz) {
            mui.toast('请填写备注');
            return true;
        }
        return false;
    }
}

function Save() {
    var fname = $("#fname").val();
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();
    var fxszj = $("#fxszj").val();
    var ffgld = $("#ffgld").val();
    var fxszj_date = $("#fxszj_date").val();
    var ffgld_date = $("#ffgld_date").val();


    var mxflag = false;
    var mxlistArr = [];
    $("#mxlist").find("#mx").each(function () {
        var fcpbm = $(this).find("#fcpbm").val();
        var fcpmc = $(this).find("#fcpmc").val();
        var fggxh = $(this).find("#fggxh").val();
        var fcz = $(this).find("#fcz").val();
        var fdw = $(this).find("#fdw").val();
        var fsl = $(this).find("#fsl").val();
        var fchrq = $(this).find("#fchrq").val();
        var fbz = $(this).find("#fbz").val();
        var mx = new Mx(fcpbm, fcpmc, fggxh, fcz, fdw, fsl, fchrq, fbz);
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
                                <ProcessName>洁丽康公司排产申请</ProcessName>
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
                     <洁丽康公司_排产申请_主表>
                        <单号>自动生成</单号>
                        <申请人>${fname}</申请人>
                        <申请部门>${fdept}</申请部门>
                        <申请日期>${fdate}</申请日期>
                        <TaskID></TaskID>
                        <销售总监>${fxszj}</销售总监>
                        <生产分管领导>${ffgld}</生产分管领导>
                        <销售总监审核日期>${fxszj_date}</销售总监审核日期>
                        <生产分管领导审核日期>${ffgld_date}</生产分管领导审核日期>
                    </洁丽康公司_排产申请_主表>
                   `;
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `
                       <洁丽康公司_排产申请_子表1>
                        <RelationRowGuid>${i+1}</RelationRowGuid>
                        <RowPrimaryKeys></RowPrimaryKeys>
                        <序号>${i + 1}</序号>
                        <产品编码>${mxlistArr[i].fcpbm}</产品编码>
                        <产品名称>${mxlistArr[i].fcpmc}</产品名称>
                        <规格型号>${mxlistArr[i].fggxh}</规格型号>
                        <材质>${mxlistArr[i].fcz}</材质>
                        <单位>${mxlistArr[i].fdw}</单位>
                        <数量>${mxlistArr[i].fsl}</数量>
                        <出货日期>${mxlistArr[i].fchrq}</出货日期>
                        <备注>${mxlistArr[i].fbz}</备注>
                    </洁丽康公司_排产申请_子表1>
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

    
    var fname = $("#fname").val();
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();
    var fxszj = $("#fxszj").val();
    var ffgld = $("#ffgld").val();
    var fxszj_date = $("#fxszj_date").val();
    var ffgld_date = $("#ffgld_date").val();

    
    var mxflag = false;
    var mxlistArr = [];
    $("#mxlist").find("#mx").each(function () {
        var fcpbm = $(this).find("#fcpbm").val();
        var fcpmc = $(this).find("#fcpmc").val();
        var fggxh = $(this).find("#fggxh").val();
        var fcz = $(this).find("#fcz").val();
        var fdw = $(this).find("#fdw").val();
        var fsl = $(this).find("#fsl").val();
        var fchrq = $(this).find("#fchrq").val();
        var fbz = $(this).find("#fbz").val();
        var mx = new Mx(fcpbm, fcpmc, fggxh, fcz, fdw, fsl, fchrq, fbz);
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
                     <洁丽康公司_排产申请_主表>
                        <单号>${fbillno}</单号>
                        <申请人>${fname}</申请人>
                        <申请部门>${fdept}</申请部门>
                        <申请日期>${fdate}</申请日期>
                        <TaskID>${$("#taskId").val()}</TaskID>
                        <销售总监>${fxszj}</销售总监>
                        <生产分管领导>${ffgld}</生产分管领导>
                        <销售总监审核日期>${fxszj_date}</销售总监审核日期>
                        <生产分管领导审核日期>${ffgld_date}</生产分管领导审核日期>
                    </洁丽康公司_排产申请_主表>
                   `;
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `
                       <洁丽康公司_排产申请_子表1>
                        <RelationRowGuid>${i + 1}</RelationRowGuid>
                        <RowPrimaryKeys></RowPrimaryKeys>
                        <序号>${i + 1}</序号>
                        <产品编码>${mxlistArr[i].fcpbm}</产品编码>
                        <产品名称>${mxlistArr[i].fcpmc}</产品名称>
                        <规格型号>${mxlistArr[i].fggxh}</规格型号>
                        <材质>${mxlistArr[i].fcz}</材质>
                        <单位>${mxlistArr[i].fdw}</单位>
                        <数量>${mxlistArr[i].fsl}</数量>
                        <出货日期>${mxlistArr[i].fchrq}</出货日期>
                        <备注>${mxlistArr[i].fbz}</备注>
                    </洁丽康公司_排产申请_子表1>
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

    var fname = $("#fname").val();
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();
    var fxszj = $("#fxszj").val();
    var ffgld = $("#ffgld").val();
    var fxszj_date = $("#fxszj_date").val();
    var ffgld_date = $("#ffgld_date").val();


    var mxflag = false;
    var mxlistArr = [];
    $("#mxlist").find("#mx").each(function () {
        var fcpbm = $(this).find("#fcpbm").val();
        var fcpmc = $(this).find("#fcpmc").val();
        var fggxh = $(this).find("#fggxh").val();
        var fcz = $(this).find("#fcz").val();
        var fdw = $(this).find("#fdw").val();
        var fsl = $(this).find("#fsl").val();
        var fchrq = $(this).find("#fchrq").val();
        var fbz = $(this).find("#fbz").val();
        var mx = new Mx(fcpbm, fcpmc, fggxh, fcz, fdw, fsl, fchrq, fbz);
       
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
                     <洁丽康公司_排产申请_主表>
                        <单号>${fbillno}</单号>
                        <申请人>${fname}</申请人>
                        <申请部门>${fdept}</申请部门>
                        <申请日期>${fdate}</申请日期>
                        <TaskID>${$("#taskId").val()}</TaskID>
                        <销售总监>${fxszj}</销售总监>
                        <生产分管领导>${ffgld}</生产分管领导>
                        <销售总监审核日期>${fxszj_date}</销售总监审核日期>
                        <生产分管领导审核日期>${ffgld_date}</生产分管领导审核日期>
                    </洁丽康公司_排产申请_主表>
                   `;
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `
                       <洁丽康公司_排产申请_子表1>
                        <RelationRowGuid>${i + 1}</RelationRowGuid>
                        <RowPrimaryKeys>itemid=${itemidArr[i]}</RowPrimaryKeys>
                        <序号>${i + 1}</序号>
                        <产品编码>${mxlistArr[i].fcpbm}</产品编码>
                        <产品名称>${mxlistArr[i].fcpmc}</产品名称>
                        <规格型号>${mxlistArr[i].fggxh}</规格型号>
                        <材质>${mxlistArr[i].fcz}</材质>
                        <单位>${mxlistArr[i].fdw}</单位>
                        <数量>${mxlistArr[i].fsl}</数量>
                        <出货日期>${mxlistArr[i].fchrq}</出货日期>
                        <备注>${mxlistArr[i].fbz}</备注>
                    </洁丽康公司_排产申请_子表1>
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
                     <洁丽康公司_排产申请_主表>
                        <单号>${fbillno}</单号>
                        <申请人>${fname}</申请人>
                        <申请部门>${fdept}</申请部门>
                        <申请日期>${fdate}</申请日期>
                        <TaskID>${$("#taskId").val()}</TaskID>
                        <销售总监>${fxszj}</销售总监>
                        <生产分管领导>${ffgld}</生产分管领导>
                        <销售总监审核日期>${fxszj_date}</销售总监审核日期>
                        <生产分管领导审核日期>${ffgld_date}</生产分管领导审核日期>
                    </洁丽康公司_排产申请_主表>
                   `;
        for (var i = 0; i < mxlistArr.length; i++) {
            xml += `
                       <洁丽康公司_排产申请_子表1>
                        <RelationRowGuid>${i + 1}</RelationRowGuid>
                        <RowPrimaryKeys>itemid=${itemidArr[i]}</RowPrimaryKeys>
                        <序号>${i + 1}</序号>
                        <产品编码>${mxlistArr[i].fcpbm}</产品编码>
                        <产品名称>${mxlistArr[i].fcpmc}</产品名称>
                        <规格型号>${mxlistArr[i].fggxh}</规格型号>
                        <材质>${mxlistArr[i].fcz}</材质>
                        <单位>${mxlistArr[i].fdw}</单位>
                        <数量>${mxlistArr[i].fsl}</数量>
                        <出货日期>${mxlistArr[i].fchrq}</出货日期>
                        <备注>${mxlistArr[i].fbz}</备注>
                    </洁丽康公司_排产申请_子表1>
                       `;
        }
        xml += `
                       </FormData>
                    </XForm>
                   `;
        PostXml(xml);
    }


}