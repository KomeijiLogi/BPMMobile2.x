function prepMsg(){
    tapEvent();
    $("#ftxrq").val(getNowFormatDate(2));
    var xml = `<?xml version= "1.0" ?>
                  <Requests>
                      <Params>
                      <Method>GetFormPostData</Method>
                      <ProcessName>洁丽康公司名片申请</ProcessName>
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
        $("#ftxr").val(item.填写人);
        $("#ftxbm").val(item.填写部门);

    }).fail(function (e) {

    }).then(function () {

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
                    <div class="mui-row cutOffLine padding">
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>申请人<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fsqr" readonly placeholder="请选择"></textarea>
                        </div>
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>部门<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fbm" ></textarea>
                        </div>
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>职位<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fzw" placeholder="请填写"></textarea>
                        </div>
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>手机<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fsj" placeholder="请填写"></textarea>
                        </div>
                    </div> 
                    <div class="mui-row cutOffLine padding">
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>固话<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fgh" placeholder="请填写"></textarea>
                        </div>
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>传真<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fcz" placeholder="请填写"></textarea>
                        </div>
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>邮箱<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fyx" placeholder="请填写"></textarea>
                        </div>
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>数量(盒)<i style="color:red;">*</i></label>
                            <input id="fsl" placeholder="请填写" type="number" style="padding-left:0;"/>
                        </div>
                    </div>
                 </div>
                 `;
        $("#mxlist").append(li);
    });
    $('#mxlist').on('tap', '#fsqr', function () {
        var _self = this;
        var opidArr = [];
        XuntongJSBridge.call('selectPerson', { 'pType': '1' }, function (result) {

            if (String(Object.prototype.toString.call(result)).match('String') != null) {
                result = JSON.parse(result);
            }

            if (result.success == true || result.success == "true") {

                for (var i = 0; i < result.data.persons.length; i++) {

                    opidArr.push(result.data.persons[i].openId);

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
                        $(_self).val(pio.NAME);
                        
                     
                    }).fail(function (e) {

                    });
                });



            }
        });
    });
}

var item = null;
var item_c = [];
function initData(data, flag) {
    item = data.FormDataSet.洁丽康公司_名片申请_主表[0];

    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.单号);
    }
    $("#ftxr").val(item.填写人);
    $("#ftxbm").val(item.填写部门);
    $("#ftxrq").val(FormatterTimeYMS(item.填写日期));
    item_c = data.FormDataSet.洁丽康公司_名片申请_子表1;
    for (var i = 0; i < item_c.length; i++) {
        itemidArr.push(item_c[i].itemid);
        var li = `
<div id="mx" class="mui-card">
                    <div class="mui-input-row itemtitle">
                        <label>明细列表项</label>
                        <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>
                    </div>
                    <div class="mui-row cutOffLine padding">
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>申请人<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fsqr" readonly >${item_c[i].申请人}</textarea>
                        </div>
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>部门<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fbm" readonly>${item_c[i].部门}</textarea>
                        </div>
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>职位<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fzw" readonly>${item_c[i].职位}</textarea>
                        </div>
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>手机<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fsj" readonly>${item_c[i].手机}</textarea>
                        </div>
                    </div> 
                    <div class="mui-row cutOffLine padding">
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>固话<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fgh" readonly>${item_c[i].固话}</textarea>
                        </div>
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>传真<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fcz" readonly>${item_c[i].传真}</textarea>
                        </div>
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>邮箱<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fyx" readonly>${item_c[i].邮箱}</textarea>
                        </div>
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>数量(盒)<i style="color:red;">*</i></label>
                            <input id="fsl"  type="number" readonly style="padding-left:0;" value="${item_c[i].数量}"/>
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
        $("#tjmx").show();
    }
}
class Mx {
    constructor(fsqr, fbm, fzw, fsj, fgh, fcz, fyx, fsl) {
        this.fsqr = fsqr;
        this.fbm = fbm;
        this.fzw = fzw;
        this.fsj = fsj;
        this.fgh = fgh;
        this.fcz = fcz;
        this.fyx = fyx;
        this.fsl = fsl;
    }
    check() {
        if (!this.fsqr) {
            mui.toast('请选择申请人');
            return true;
        }
        if (!this.fbm) {
            mui.toast('请填写部门');
            return true;
        }
        if (!this.fzw) {
            mui.toast('请填写职务');
            return true;
        }
        if (!this.fsj) {
            mui.toast('请填写手机');
            return true;
        }
        if (!this.fgh) {
            mui.toast('请填写固话');
            return true;
        }
        if (!this.fcz) {
            mui.toast('请填写传真');
            return true;
        }
        if (!this.fyx) {
            mui.toast('请填写邮箱');
            return true;
        }
        if (!this.fsl) {
            mui.toast('请填写数量');
            return true;
        }
        return false;
    }
}
function checkNes() {
    return true;
}

function Save() {
    var ftxr = $("#ftxr").val();
    var ftxbm = $("#ftxbm").val();
    var ftxrq = $("#ftxrq").val();

    var mxflag = false;
    var mxlistArr = [];

    $("#mxlist").find("#mx").each(function () {
        var fsqr = $(this).find("#fsqr").val();
        var fbm = $(this).find("#fbm").val();
        var fzw = $(this).find("#fzw").val();
        var fsj = $(this).find("#fsj").val();
        var fgh = $(this).find("#fgh").val();
        var fcz = $(this).find("#fcz").val();
        var fyx = $(this).find("#fyx").val();
        var fsl = $(this).find("#fsl").val();
        var mx = new Mx(fsqr, fbm, fzw, fsj, fgh, fcz, fyx, fsl);
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
                                <ProcessName>洁丽康公司名片申请</ProcessName>
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
        <洁丽康公司_名片申请_主表>
            <单号>自动生成</单号>
            <填写人>${ftxr}</填写人>
            <填写部门>${ftxbm}</填写部门>
            <填写日期>${ftxrq}</填写日期>
        </洁丽康公司_名片申请_主表>
                   `;
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `
<洁丽康公司_名片申请_子表1>
            <RelationRowGuid>${i+1}</RelationRowGuid>
            <RowPrimaryKeys></RowPrimaryKeys>
            <申请人>${mxlistArr[i].fsqr}</申请人>
            <部门>${mxlistArr[i].fbm}</部门>
            <职位>${mxlistArr[i].fzw}</职位>
            <手机>${mxlistArr[i].fsj}</手机>
            <固话>${mxlistArr[i].fgh}</固话>
            <传真>${mxlistArr[i].fcz}</传真>
            <邮箱>${mxlistArr[i].fyx}</邮箱>
            <数量>${mxlistArr[i].fsl}</数量>
        </洁丽康公司_名片申请_子表1>
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

    var ftxr = $("#ftxr").val();
    var ftxbm = $("#ftxbm").val();
    var ftxrq = $("#ftxrq").val();

    var mxflag = false;
    var mxlistArr = [];

    $("#mxlist").find("#mx").each(function () {
        var fsqr = $(this).find("#fsqr").val();
        var fbm = $(this).find("#fbm").val();
        var fzw = $(this).find("#fzw").val();
        var fsj = $(this).find("#fsj").val();
        var fgh = $(this).find("#fgh").val();
        var fcz = $(this).find("#fcz").val();
        var fyx = $(this).find("#fyx").val();
        var fsl = $(this).find("#fsl").val();
        var mx = new Mx(fsqr, fbm, fzw, fsj, fgh, fcz, fyx, fsl);
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
        <洁丽康公司_名片申请_主表>
            <单号>${fbillno}</单号>
            <填写人>${ftxr}</填写人>
            <填写部门>${ftxbm}</填写部门>
            <填写日期>${ftxrq}</填写日期>
        </洁丽康公司_名片申请_主表>
                   `;
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `
<洁丽康公司_名片申请_子表1>
            <RelationRowGuid>${i + 1}</RelationRowGuid>
            <RowPrimaryKeys></RowPrimaryKeys>
            <申请人>${mxlistArr[i].fsqr}</申请人>
            <部门>${mxlistArr[i].fbm}</部门>
            <职位>${mxlistArr[i].fzw}</职位>
            <手机>${mxlistArr[i].fsj}</手机>
            <固话>${mxlistArr[i].fgh}</固话>
            <传真>${mxlistArr[i].fcz}</传真>
            <邮箱>${mxlistArr[i].fyx}</邮箱>
            <数量>${mxlistArr[i].fsl}</数量>
        </洁丽康公司_名片申请_子表1>
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

    var ftxr = $("#ftxr").val();
    var ftxbm = $("#ftxbm").val();
    var ftxrq = $("#ftxrq").val();

    var mxflag = false;
    var mxlistArr = [];

    $("#mxlist").find("#mx").each(function () {
        var fsqr = $(this).find("#fsqr").val();
        var fbm = $(this).find("#fbm").val();
        var fzw = $(this).find("#fzw").val();
        var fsj = $(this).find("#fsj").val();
        var fgh = $(this).find("#fgh").val();
        var fcz = $(this).find("#fcz").val();
        var fyx = $(this).find("#fyx").val();
        var fsl = $(this).find("#fsl").val();
        var mx = new Mx(fsqr, fbm, fzw, fsj, fgh, fcz, fyx, fsl);
    
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
        <洁丽康公司_名片申请_主表>
            <单号>${fbillno}</单号>
            <填写人>${ftxr}</填写人>
            <填写部门>${ftxbm}</填写部门>
            <填写日期>${ftxrq}</填写日期>
        </洁丽康公司_名片申请_主表>
                   `;
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `
<洁丽康公司_名片申请_子表1>
            <RelationRowGuid>${i + 1}</RelationRowGuid>
            <RowPrimaryKeys>itemid=${itemidArr[i]}</RowPrimaryKeys>
            <申请人>${mxlistArr[i].fsqr}</申请人>
            <部门>${mxlistArr[i].fbm}</部门>
            <职位>${mxlistArr[i].fzw}</职位>
            <手机>${mxlistArr[i].fsj}</手机>
            <固话>${mxlistArr[i].fgh}</固话>
            <传真>${mxlistArr[i].fcz}</传真>
            <邮箱>${mxlistArr[i].fyx}</邮箱>
            <数量>${mxlistArr[i].fsl}</数量>
        </洁丽康公司_名片申请_子表1>
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
        <洁丽康公司_名片申请_主表>
            <单号>${fbillno}</单号>
            <填写人>${ftxr}</填写人>
            <填写部门>${ftxbm}</填写部门>
            <填写日期>${ftxrq}</填写日期>
        </洁丽康公司_名片申请_主表>
                   `;
        for (var i = 0; i < mxlistArr.length; i++) {
            xml += `
<洁丽康公司_名片申请_子表1>
            <RelationRowGuid>${i + 1}</RelationRowGuid>
            <RowPrimaryKeys>itemid=${itemidArr[i]}</RowPrimaryKeys>
            <申请人>${mxlistArr[i].fsqr}</申请人>
            <部门>${mxlistArr[i].fbm}</部门>
            <职位>${mxlistArr[i].fzw}</职位>
            <手机>${mxlistArr[i].fsj}</手机>
            <固话>${mxlistArr[i].fgh}</固话>
            <传真>${mxlistArr[i].fcz}</传真>
            <邮箱>${mxlistArr[i].fyx}</邮箱>
            <数量>${mxlistArr[i].fsl}</数量>
        </洁丽康公司_名片申请_子表1>
                       `;
        }
        xml += `
                       </FormData>
                    </XForm>
                   `;
        PostXml(xml);
    }
}