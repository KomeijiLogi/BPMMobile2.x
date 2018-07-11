function prepMsg() {
    $("#fdate,#ftxrq").val(getNowFormatDate(2));
     tapEvent();

     var xml = `<?xml version= "1.0" ?>
                  <Requests>
                      <Params>
                      <Method>GetFormPostData</Method>
                      <ProcessName>洁丽康公司销售日报提报</ProcessName>
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
         $("#fno").val(item.销售人员工号);
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
                            <label>客户名称<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fkhmc" placeholder="请填写"></textarea>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>客户类型<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fkhlx" name="fkhlx" readonly placeholder="请选择"></textarea>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>客户定位<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fkhdw" name="fkhdw" readonly placeholder="请选择"></textarea>
                        </div>
                    </div>
                     <div class="mui-row cutOffLine" style="padding:3vw;">
                         <div class="mui-col-xs-4" style="display:flex;">
                             <label>客户地址<i style="color:red;">*</i></label>
                             <textarea rows="2" id="fkhdz" placeholder="请填写"></textarea>
                         </div>
                         <div class="mui-col-xs-4" style="display:flex;">
                             <label>联系人<i style="color:red;">*</i></label>
                             <textarea rows="2" id="flxr" placeholder="请填写"></textarea>
                         </div>
                         <div class="mui-col-xs-4" style="display:flex;">
                             <label>联系人电话<i style="color:red;">*</i></label>
                             <textarea rows="2" id="flxrdh" placeholder="请填写"></textarea>
                         </div>
                     </div>
                    <div class="mui-row cutOffLine" style="padding:3vw;">
                        <div class="mui-col-xs-4" style="display:flex;">
                             <label>联系人岗位<i style="color:red;">*</i></label>
                            <textarea rows="2" id="flxrgw" name="flxrgw" readonly placeholder="请选择"></textarea>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>拜访次数<i style="color:red;">*</i></label>
                            <input type="number" id="fbfcs" placeholder="请填写"/>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>牙椅数<i style="color:red;">*</i></label>
                            <input type="number" id="fyys" placeholder="请填写"/>
                        </div>
                    </div>
                    <div class="mui-row cutOffLine" style="padding:3vw;">
                        <div class="mui-col-xs-12" style="display:flex;">
                            <label>洽谈主要内容<i style="color:red;">*</i></label>
                            <textarea rows="5" id="fzynr" placeholder="请填写"></textarea>
                        </div>
                    </div>
                </div>

                 `;
        $("#mxlist").append(li);
    });
    var fkhlxdata = [
        {
            value: '',
            text:'公立医院'
        },
        {
            value: '',
            text:'民营诊所'
        },
        {
            value: '',
            text:'经销商'
        }
    ];

    
    
    $("#mxlist").on('tap', 'textarea[name="fkhlx"]', function () {
        var picker = new mui.PopPicker();
        picker.setData(fkhlxdata);
        var self = this;
        picker.show(function (items) {
            $(self).val(items[0].text);
        });

    });
    var fkhdwdata = [
        {
            value: '',
            text: '目标客户'
        },
        {
            value: '',
            text: '潜在目标用户'
        },
        {
            value: '',
            text: '非目标用户'
        }
    ];
    $("#mxlist").on('tap', 'textarea[name="fkhdw"]', function () {
        var picker = new mui.PopPicker();
        picker.setData(fkhdwdata);
        var self = this;
        picker.show(function (items) {
            $(self).val(items[0].text);
        });
    });
    var flxrgwdata = [
        {
            value: '',
            text:'老板'
        },
        {
            value: '',
            text:'医生'
        },
        {
            value: '',
            text:'采购负责人'
        },
        {
            value: '',
            text:'器械科或设备科'
        }

    ];
    $("#mxlist").on('tap', "textarea[name='flxrgw']", function () {
        var picker = new mui.PopPicker();
        picker.setData(flxrgwdata);
        var self = this;
        picker.show(function (items) {
            $(self).val(items[0].text);
        });

    });

    showDtPicker('ftxrq');

    showDtPicker('fdate');
}

class Mx {
    constructor(fkhmc, fkhlx, fkhdw, fkhdz, flxr, flxrdh, flxrgw, fbfcs, fyys, fzynr) {
        
        this.fkhmc = fkhmc;
        this.fkhlx = fkhlx;
        this.fkhdw = fkhdw;
        this.fkhdz = fkhdz;
        this.flxr = flxr;
        this.flxrdh = flxrdh;
        this.flxrgw = flxrgw;
        this.fbfcs = fbfcs;
        this.fyys = fyys;
        this.fzynr = fzynr;
    }
    check() {
        if (!this.fkhmc) {
            mui.toast('请填写客户名称');
            return true;
        }
        if (!this.fkhlx) {
            mui.toast('请选择客户类型');
            return true;
        }
        if (!this.fkhdw) {
            mui.toast('请选择客户定位');
            return true;
        }
        if (!this.fkhdz) {
            mui.toast('请填写客户地址');
            return true;
        }
        if (!this.flxr) {
            mui.toast('请填写联系人');
            return true;
        }
        if (!this.flxrdh) {
            mui.toast('请填写联系人电话');
            return true;
        }
        if (!this.flxrgw) {
            mui.toast('请选择联系人岗位');
            return true;
        }
        if (!this.fbfcs) {
            mui.toast('请填写拜访次数');
            return true;
        }
        if (!this.fyys) {
            mui.toast('请填写牙椅数');
            return true;
        }
        if (!this.fzynr) {
            mui.toast('请填写洽谈主要内容');
            return true;
        }
        return false;
    }
}

function initData(data, flag) {
    var item = data.FormDataSet.洁丽康公司_销售日报_主表[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.fbillno);
    }

    $("#fxsry").val(item.销售人员);
    $("#fxsqy").val(item.销售区域);
    $("#ftxrq").val(FormatterTimeYMS(item.填写日期));
    $("#fdate").val(FormatterTimeYMS(item.日期));
    $("#fno").val(item.销售人员工号);

    var item_c = data.FormDataSet.洁丽康公司_销售日报_子表1;
    for (var i = 0; i < item_c.length; i++) {
        itemidArr.push(item_c[i].itemid);
        var li = `
                  <div id="mx" class="mui-card">
                    <div class="mui-input-row itemtitle">
                        <label>明细列表项</label>
                        <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>
                    </div>
                    <input type="hidden" id="itemid" value="${item_c[i].itemid}"/> 
                    <div class="mui-row cutOffLine" style="padding:3vw;">
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>客户名称<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fkhmc" readonly>${item_c[i].客户名称}</textarea>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>客户类型<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fkhlx" name="fkhlx" readonly>${item_c[i].客户类别}</textarea>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>客户定位<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fkhdw" name="fkhdw" readonly >${item_c[i].客户定位}</textarea>
                        </div>
                    </div>
                     <div class="mui-row cutOffLine" style="padding:3vw;">
                         <div class="mui-col-xs-4" style="display:flex;">
                             <label>客户地址<i style="color:red;">*</i></label>
                             <textarea rows="2" id="fkhdz" readonly>${item_c[i].客户地址}</textarea>
                         </div>
                         <div class="mui-col-xs-4" style="display:flex;">
                             <label>联系人<i style="color:red;">*</i></label>
                             <textarea rows="2" id="flxr" readonly>${item_c[i].联系人}</textarea>
                         </div>
                         <div class="mui-col-xs-4" style="display:flex;">
                             <label>联系人电话<i style="color:red;">*</i></label>
                             <textarea rows="2" id="flxrdh" readonly>${item_c[i].联系人电话}</textarea>
                         </div>
                     </div>
                    <div class="mui-row cutOffLine" style="padding:3vw;">
                        <div class="mui-col-xs-4" style="display:flex;">
                             <label>联系人岗位<i style="color:red;">*</i></label>
                            <textarea rows="2" id="flxrgw" name="flxrgw" readonly >${item_c[i].联系人岗位}</textarea>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>拜访次数<i style="color:red;">*</i></label>
                            <input type="number" id="fbfcs" readonly value="${item_c[i].拜访次数}"/>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>牙椅数<i style="color:red;">*</i></label>
                            <input type="number" id="fyys" readonly value="${item_c[i].牙椅数}"/>
                        </div>
                    </div>
                    <div class="mui-row cutOffLine" style="padding:3vw;">
                        <div class="mui-col-xs-12" style="display:flex;">
                            <label>洽谈主要内容<i style="color:red;">*</i></label>
                            <textarea rows="5" id="fzynr" readonly>${item_c[i].洽谈主要内容}</textarea>
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

function Save() {
    var fxsry = $("#fxsry").val();
    var fno = $("#fno").val();
    var fxsqy = $("#fxsqy").val();
    var ftxrq = $("#ftxrq").val();
    var fdate = $("#fdate").val();


    var mxflag = false;
    var mxlistArr = [];
    $("#mxlist").find("#mx").each(function () {
        var fkhmc = $(this).find("#fkhmc").val();
        var fkhlx = $(this).find("#fkhlx").val();
        var fkhdw = $(this).find("#fkhdw").val();
        var fkhdz = $(this).find("#fkhdz").val();
        var flxr = $(this).find("#flxr").val();
        var flxrdh = $(this).find("#flxrdh").val();
        var flxrgw = $(this).find("#flxrgw").val();
        var fbfcs = $(this).find("#fbfcs").val();
        var fyys = $(this).find("#fyys").val();
        var fzynr = $(this).find("#fzynr").val();
        var mx = new Mx(fkhmc, fkhlx, fkhdw, fkhdz, flxr, flxrdh, flxrgw, fbfcs, fyys, fzynr);
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
                                <ProcessName>洁丽康公司销售日报提报</ProcessName>
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
                     <洁丽康公司_销售日报_主表>
                        <单号>自动生成</单号>
                        <销售人员>${fxsry}</销售人员>
                        <销售区域>${fxsqy}</销售区域>
                        <填写日期>${ftxrq}</填写日期>
                        <日期>${fdate}</日期>
                        <销售人员工号>${fno}</销售人员工号>
                    </洁丽康公司_销售日报_主表>
                   `;
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `
                        <洁丽康公司_销售日报_子表1>
                            <RelationRowGuid>${i+1}</RelationRowGuid>
                            <RowPrimaryKeys></RowPrimaryKeys>
                            <序号>${i + 1}</序号>
                            <客户名称>${mxlistArr[i].fkhmc}</客户名称>
                            <客户类别>${mxlistArr[i].fkhlx}</客户类别>
                            <客户定位>${mxlistArr[i].fkhdw}</客户定位>
                            <客户地址>${mxlistArr[i].fkhdz}</客户地址>
                            <联系人>${mxlistArr[i].flxr}</联系人>
                            <联系人电话>${mxlistArr[i].flxrdh}</联系人电话>
                            <联系人岗位>${mxlistArr[i].flxrgw}</联系人岗位>
                            <拜访次数>${mxlistArr[i].fbfcs}</拜访次数>
                            <牙椅数>${mxlistArr[i].fyys}</牙椅数>
                            <洽谈主要内容>${mxlistArr[i].fzynr}</洽谈主要内容>
                        </洁丽康公司_销售日报_子表1>
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
    var fdate = $("#fdate").val();


    var mxflag = false;
    var mxlistArr = [];
    $("#mxlist").find("#mx").each(function () {
        var fkhmc = $(this).find("#fkhmc").val();
        var fkhlx = $(this).find("#fkhlx").val();
        var fkhdw = $(this).find("#fkhdw").val();
        var fkhdz = $(this).find("#fkhdz").val();
        var flxr = $(this).find("#flxr").val();
        var flxrdh = $(this).find("#flxrdh").val();
        var flxrgw = $(this).find("#flxrgw").val();
        var fbfcs = $(this).find("#fbfcs").val();
        var fyys = $(this).find("#fyys").val();
        var fzynr = $(this).find("#fzynr").val();
        var mx = new Mx(fkhmc, fkhlx, fkhdw, fkhdz, flxr, flxrdh, flxrgw, fbfcs, fyys, fzynr);
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
                     <洁丽康公司_销售日报_主表>
                        <单号>${fbillno}</单号>
                        <销售人员>${fxsry}</销售人员>
                        <销售区域>${fxsqy}</销售区域>
                        <填写日期>${ftxrq}</填写日期>
                        <日期>${fdate}</日期>
                        <销售人员工号>${fno}</销售人员工号>
                    </洁丽康公司_销售日报_主表>
                   `;
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `
                        <洁丽康公司_销售日报_子表1>
                            <RelationRowGuid>${i + 1}</RelationRowGuid>
                            <RowPrimaryKeys></RowPrimaryKeys>
                            <序号>${i + 1}</序号>
                            <客户名称>${mxlistArr[i].fkhmc}</客户名称>
                            <客户类别>${mxlistArr[i].fkhlx}</客户类别>
                            <客户定位>${mxlistArr[i].fkhdw}</客户定位>
                            <客户地址>${mxlistArr[i].fkhdz}</客户地址>
                            <联系人>${mxlistArr[i].flxr}</联系人>
                            <联系人电话>${mxlistArr[i].flxrdh}</联系人电话>
                            <联系人岗位>${mxlistArr[i].flxrgw}</联系人岗位>
                            <拜访次数>${mxlistArr[i].fbfcs}</拜访次数>
                            <牙椅数>${mxlistArr[i].fyys}</牙椅数>
                            <洽谈主要内容>${mxlistArr[i].fzynr}</洽谈主要内容>
                        </洁丽康公司_销售日报_子表1>
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
    var fdate = $("#fdate").val();


    var mxflag = false;
    var mxlistArr = [];
    $("#mxlist").find("#mx").each(function () {
        var fkhmc = $(this).find("#fkhmc").val();
        var fkhlx = $(this).find("#fkhlx").val();
        var fkhdw = $(this).find("#fkhdw").val();
        var fkhdz = $(this).find("#fkhdz").val();
        var flxr = $(this).find("#flxr").val();
        var flxrdh = $(this).find("#flxrdh").val();
        var flxrgw = $(this).find("#flxrgw").val();
        var fbfcs = $(this).find("#fbfcs").val();
        var fyys = $(this).find("#fyys").val();
        var fzynr = $(this).find("#fzynr").val();
        var mx = new Mx(fkhmc, fkhlx, fkhdw, fkhdz, flxr, flxrdh, flxrgw, fbfcs, fyys, fzynr);
      
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
                     <洁丽康公司_销售日报_主表>
                        <单号>${fbillno}</单号>
                        <销售人员>${fxsry}</销售人员>
                        <销售区域>${fxsqy}</销售区域>
                        <填写日期>${ftxrq}</填写日期>
                        <日期>${fdate}</日期>
                        <销售人员工号>${fno}</销售人员工号>
                    </洁丽康公司_销售日报_主表>
                   `;
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `
                        <洁丽康公司_销售日报_子表1>
                            <RelationRowGuid>${i + 1}</RelationRowGuid>
                            <RowPrimaryKeys>itemid=${itemidArr[i]}</RowPrimaryKeys>
                            <序号>${i + 1}</序号>
                            <客户名称>${mxlistArr[i].fkhmc}</客户名称>
                            <客户类别>${mxlistArr[i].fkhlx}</客户类别>
                            <客户定位>${mxlistArr[i].fkhdw}</客户定位>
                            <客户地址>${mxlistArr[i].fkhdz}</客户地址>
                            <联系人>${mxlistArr[i].flxr}</联系人>
                            <联系人电话>${mxlistArr[i].flxrdh}</联系人电话>
                            <联系人岗位>${mxlistArr[i].flxrgw}</联系人岗位>
                            <拜访次数>${mxlistArr[i].fbfcs}</拜访次数>
                            <牙椅数>${mxlistArr[i].fyys}</牙椅数>
                            <洽谈主要内容>${mxlistArr[i].fzynr}</洽谈主要内容>
                        </洁丽康公司_销售日报_子表1>
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
                     <洁丽康公司_销售日报_主表>
                        <单号>${fbillno}</单号>
                        <销售人员>${fxsry}</销售人员>
                        <销售区域>${fxsqy}</销售区域>
                        <填写日期>${ftxrq}</填写日期>
                        <日期>${fdate}</日期>
                        <销售人员工号>${fno}</销售人员工号>
                    </洁丽康公司_销售日报_主表>
                   `;
        for (var i = 0; i < mxlistArr.length; i++) {
            xml += `
                        <洁丽康公司_销售日报_子表1>
                            <RelationRowGuid>${i + 1}</RelationRowGuid>
                            <RowPrimaryKeys>itemid=${itemidArr[i]}</RowPrimaryKeys>
                            <序号>${i + 1}</序号>
                            <客户名称>${mxlistArr[i].fkhmc}</客户名称>
                            <客户类别>${mxlistArr[i].fkhlx}</客户类别>
                            <客户定位>${mxlistArr[i].fkhdw}</客户定位>
                            <客户地址>${mxlistArr[i].fkhdz}</客户地址>
                            <联系人>${mxlistArr[i].flxr}</联系人>
                            <联系人电话>${mxlistArr[i].flxrdh}</联系人电话>
                            <联系人岗位>${mxlistArr[i].flxrgw}</联系人岗位>
                            <拜访次数>${mxlistArr[i].fbfcs}</拜访次数>
                            <牙椅数>${mxlistArr[i].fyys}</牙椅数>
                            <洽谈主要内容>${mxlistArr[i].fzynr}</洽谈主要内容>
                        </洁丽康公司_销售日报_子表1>
                        `;
        }
        xml += `
                       </FormData>
                    </XForm>
                   `;
        PostXml(xml);
    }
}