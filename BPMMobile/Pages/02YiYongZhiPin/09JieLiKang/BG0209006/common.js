function prepMsg() {
    tapEvent();
    $("#fsqrq").val(getNowFormatDate(2));
    var xml = `<?xml version= "1.0" ?>
                  <Requests>
                      <Params>
                      <Method>GetFormPostData</Method>
                      <ProcessName>洁丽康公司机票预定申请</ProcessName>
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
        $("#fsqr").val(item.申请人);
        $("#fsqbm").val(item.申请部门);


    }).fail(function (e) {

    }).then(function () {

        });


}

function tapEvent() {

    $("#tjmx").on('tap', function () {
        var li = `<div id="mx">
                    <div class="mui-input-row itemtitle">
                        <label>明细列表项</label>
                        <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>
                    </div>
                    <div class="mui-row cutOffLine padding">
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>航班号<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fhbh" placeholder="请填写"></textarea>
                        </div>
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>出发日期<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fcfrq" readonly placeholder="请选择"></textarea>
                        </div>
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>出发城市<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fcfcs" placeholder="请填写"></textarea>
                        </div>
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>到达城市<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fddcs" placeholder="请填写"></textarea>
                        </div>
                    </div>
                    <div class="mui-row cutOffLine padding">
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>乘机人姓名<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fcjrxm" placeholder="请填写"></textarea>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>乘机人身份证号<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fcjrsfzh" placeholder="请填写"></textarea>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>乘机人手机号<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fcjrsjh" placeholder="请填写"></textarea>
                        </div>
                    </div>

                </div>
                 `;
        $("#mxlist").append(li);

    });

    var dateOpt = {
        "value": "2018-06-21 10:10",
        "beginYear": 2018,
        "endYear": 2028
    };
    var picker_date = new mui.DtPicker(dateOpt);

    $("#mxlist").on('tap', '#fcfrq', function () {
        var _self = this;
        picker_date.show(function (rs) {
            $(_self).val(rs.text);
        });
    });


}

function initData(data, flag) {

    var item = data.FormDataSet.洁丽康公司_机票申请_主表[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.单号);
    }
    $("#fsqr").val(item.申请人);
    $("#fsqbm").val(item.申请部门);
    $("#fsqrq").val(FormatterTimeYMS(item.申请日期));
    $("#fsqsy").val(item.申请事由);
   

    var item_c = data.FormDataSet.洁丽康公司_机票申请_子表1;
    for (var i = 0; i < item_c.length; i++) {
        itemidArr.push(item_c[i].itemid);
        var li = `
        <div id="mx">
                    <div class="mui-input-row itemtitle">
                        <label>明细列表项</label>
                        <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>
                    </div>
                    <div class="mui-row cutOffLine padding">
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>航班号<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fhbh" readonly>${item_c[i].航班号}</textarea>
                        </div>
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>出发日期<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fcfrq" readonly >${item_c[i].出发日期}</textarea>
                        </div>
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>出发城市<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fcfcs" readonly>${item_c[i].出发城市}</textarea>
                        </div>
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>到达城市<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fddcs" readonly>${item_c[i].到达城市}</textarea>
                        </div>
                    </div>
                    <div class="mui-row cutOffLine padding">
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>乘机人姓名<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fcjrxm" readonly>${item_c[i].乘机人姓名}</textarea>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>乘机人身份证号<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fcjrsfzh" readonly>${item_c[i].乘机人身份证号}</textarea>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>乘机人手机号<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fcjrsjh" readonly>${item_c[i].乘机人手机号}</textarea>
                        </div>
                    </div>

                </div>
                `;
        $("#mxlist").append(li);
    }


}

function nodeControllerExp(NodeName) {

}


class Mx {
    constructor(fhbh, fcfrq, fcfcs, fddcs, fcjrxm, fcjrsfzh, fcjrsjh) {
        this.fhbh = fhbh;
        this.fcfrq = fcfrq;
        this.fcfcs = fcfcs;
        this.fddcs = fddcs;
        this.fcjrxm = fcjrxm;
        this.fcjrsfzh = fcjrsfzh;
        this.fcjrsjh = fcjrsjh;

    }
    check() {
        if (!this.fhbh) {
            mui.toast('请填写航班号');
            return true;
        }
        if (!this.fcfrq) {
            mui.toast('请填写出发日期');
            return true;
        }
        if (!this.fcfcs) {
            mui.toast('请填写出发城市');
            return true;
        }
        if (!this.fddcs) {
            mui.toast('请填写到达城市');
            return true;
        }
        if (!this.fcjrxm) {
            mui.toast('请填写乘机人姓名');
            return true;
        }
        if (!this.fcjrsfzh) {
            mui.toast('请填写乘机人身份证号');
            return true;
        }
        if (!this.fcjrsjh) {
            mui.toast('请填写乘机人手机号');
            return true;
        }
        return false;
    }
}


function Save() {
    var fsqr = $("#fsqr").val();
    var fsqbm = $("#fsqbm").val();
    var fsqrq = $("#fsqrq").val();
    var fsqsy = $("#fsqsy").val();

    if (!fsqsy) {
        mui.toast('请填写申请事由');
        return;
    }

    var mxflag = false;
    var mxlistArr = [];

    $("#mxlist").find("#mx").each(function () {
        var fhbh = $(this).find("#fhbh").val();
        var fcfrq = $(this).find("#fcfrq").val();
        var fcfcs = $(this).find("#fcfcs").val();
        var fddcs = $(this).find("#fddcs").val();
        var fcjrxm = $(this).find("#fcjrxm").val();
        var fcjrsfzh = $(this).find("#fcjrsfzh").val();
        var fcjrsjh = $(this).find("#fcjrsjh").val();
        var mx = new Mx(fhbh, fcfrq, fcfcs, fddcs, fcjrxm, fcjrsfzh, fcjrsjh);
        if (mx.check()) {
            mxflag = true;
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
                                <ProcessName>洁丽康公司机票预定申请</ProcessName>
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
      <洁丽康公司_机票申请_主表>
            <单号>自动生成</单号>
            <申请人>${fsqr}</申请人>
            <申请部门>${fsqbm}</申请部门>
            <申请日期>${fsqrq}</申请日期>
            <申请事由>${fsqsy}</申请事由>
        </洁丽康公司_机票申请_主表>
                     `;
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `
 <洁丽康公司_机票申请_子表1>
            <RelationRowGuid>${i+1}</RelationRowGuid>
            <RowPrimaryKeys></RowPrimaryKeys>
            <航班号>${mxlistArr[i].fhbh}</航班号>
            <出发日期>${mxlistArr[i].fcfrq}</出发日期>
            <出发城市>${mxlistArr[i].fcfcs}</出发城市>
            <到达城市>${mxlistArr[i].fddcs}</到达城市>
            <乘机人姓名>${mxlistArr[i].fcjrxm}</乘机人姓名>
            <乘机人身份证号>${mxlistArr[i].fcjrsfzh}</乘机人身份证号>
            <乘机人手机号>${mxlistArr[i].fcjrsjh}</乘机人手机号>
        </洁丽康公司_机票申请_子表1>
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

    var fsqr = $("#fsqr").val();
    var fsqbm = $("#fsqbm").val();
    var fsqrq = $("#fsqrq").val();
    var fsqsy = $("#fsqsy").val();

    if (!fsqsy) {
        mui.toast('请填写申请事由');
        return;
    }

    var mxflag = false;
    var mxlistArr = [];

    $("#mxlist").find("#mx").each(function () {
        var fhbh = $(this).find("#fhbh").val();
        var fcfrq = $(this).find("#fcfrq").val();
        var fcfcs = $(this).find("#fcfcs").val();
        var fddcs = $(this).find("#fddcs").val();
        var fcjrxm = $(this).find("#fcjrxm").val();
        var fcjrsfzh = $(this).find("#fcjrsfzh").val();
        var fcjrsjh = $(this).find("#fcjrsjh").val();
        var mx = new Mx(fhbh, fcfrq, fcfcs, fddcs, fcjrxm, fcjrsfzh, fcjrsjh);
        if (mx.check()) {
            mxflag = true;
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
      <洁丽康公司_机票申请_主表>
            <单号>${fbillno}</单号>
            <申请人>${fsqr}</申请人>
            <申请部门>${fsqbm}</申请部门>
            <申请日期>${fsqrq}</申请日期>
            <申请事由>${fsqsy}</申请事由>
        </洁丽康公司_机票申请_主表>
                     `;
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `
 <洁丽康公司_机票申请_子表1>
            <RelationRowGuid>${i + 1}</RelationRowGuid>
            <RowPrimaryKeys></RowPrimaryKeys>
            <航班号>${mxlistArr[i].fhbh}</航班号>
            <出发日期>${mxlistArr[i].fcfrq}</出发日期>
            <出发城市>${mxlistArr[i].fcfcs}</出发城市>
            <到达城市>${mxlistArr[i].fddcs}</到达城市>
            <乘机人姓名>${mxlistArr[i].fcjrxm}</乘机人姓名>
            <乘机人身份证号>${mxlistArr[i].fcjrsfzh}</乘机人身份证号>
            <乘机人手机号>${mxlistArr[i].fcjrsjh}</乘机人手机号>
        </洁丽康公司_机票申请_子表1>
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

    var fsqr = $("#fsqr").val();
    var fsqbm = $("#fsqbm").val();
    var fsqrq = $("#fsqrq").val();
    var fsqsy = $("#fsqsy").val();

    
    var mxflag = false;
    var mxlistArr = [];

    $("#mxlist").find("#mx").each(function () {
        var fhbh = $(this).find("#fhbh").val();
        var fcfrq = $(this).find("#fcfrq").val();
        var fcfcs = $(this).find("#fcfcs").val();
        var fddcs = $(this).find("#fddcs").val();
        var fcjrxm = $(this).find("#fcjrxm").val();
        var fcjrsfzh = $(this).find("#fcjrsfzh").val();
        var fcjrsjh = $(this).find("#fcjrsjh").val();
        var mx = new Mx(fhbh, fcfrq, fcfcs, fddcs, fcjrxm, fcjrsfzh, fcjrsjh);
      
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
      <洁丽康公司_机票申请_主表>
            <单号>${fbillno}</单号>
            <申请人>${fsqr}</申请人>
            <申请部门>${fsqbm}</申请部门>
            <申请日期>${fsqrq}</申请日期>
            <申请事由>${fsqsy}</申请事由>
        </洁丽康公司_机票申请_主表>
                     `;
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `
 <洁丽康公司_机票申请_子表1>
            <RelationRowGuid>${i + 1}</RelationRowGuid>
            <RowPrimaryKeys>itemid=${itemidArr[i]}</RowPrimaryKeys>
            <航班号>${mxlistArr[i].fhbh}</航班号>
            <出发日期>${mxlistArr[i].fcfrq}</出发日期>
            <出发城市>${mxlistArr[i].fcfcs}</出发城市>
            <到达城市>${mxlistArr[i].fddcs}</到达城市>
            <乘机人姓名>${mxlistArr[i].fcjrxm}</乘机人姓名>
            <乘机人身份证号>${mxlistArr[i].fcjrsfzh}</乘机人身份证号>
            <乘机人手机号>${mxlistArr[i].fcjrsjh}</乘机人手机号>
        </洁丽康公司_机票申请_子表1>
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
      <洁丽康公司_机票申请_主表>
            <单号>${fbillno}</单号>
            <申请人>${fsqr}</申请人>
            <申请部门>${fsqbm}</申请部门>
            <申请日期>${fsqrq}</申请日期>
            <申请事由>${fsqsy}</申请事由>
        </洁丽康公司_机票申请_主表>
                     `;
        for (var i = 0; i < mxlistArr.length; i++) {
            xml += `
 <洁丽康公司_机票申请_子表1>
            <RelationRowGuid>${i + 1}</RelationRowGuid>
            <RowPrimaryKeys>itemid=${itemidArr[i]}</RowPrimaryKeys>
            <航班号>${mxlistArr[i].fhbh}</航班号>
            <出发日期>${mxlistArr[i].fcfrq}</出发日期>
            <出发城市>${mxlistArr[i].fcfcs}</出发城市>
            <到达城市>${mxlistArr[i].fddcs}</到达城市>
            <乘机人姓名>${mxlistArr[i].fcjrxm}</乘机人姓名>
            <乘机人身份证号>${mxlistArr[i].fcjrsfzh}</乘机人身份证号>
            <乘机人手机号>${mxlistArr[i].fcjrsjh}</乘机人手机号>
        </洁丽康公司_机票申请_子表1>
                       `;
        }
        xml += `
                       </FormData>
                    </XForm>
                   `;
        PostXml(xml);
    }
}