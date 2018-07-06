function prepMsg() {

    $("#fsqdate").val(getNowFormatDate(2));
    tapEvent();

    var xml = `<?xml version= "1.0" ?>
                  <Requests>
                      <Params>
                      <Method>GetFormPostData</Method>
                      <ProcessName>洁丽康公司产品借用申请</ProcessName>
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


    inquireMat();
    $("#tjmx").on('tap', () => {

        var li = `
 <div id="mx">
                    <div class="mui-input-row itemtitle">
                        <label>明细列表项</label>
                        <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>
                    </div>
                    <div class="mui-row cutOffLine padding">
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>物料编码<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fwlbm" readonly placeholder="请选择"></textarea>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>物料名称</label>
                            <textarea rows="2" id="fwlmc" readonly></textarea>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>规格型号</label>
                            <textarea rows="2" id="fggxh" readonly></textarea>
                        </div>
                    </div>
                    <div class="mui-row cutOffLine padding">
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>计量单位</label>
                            <textarea rows="2" id="fjldw" readonly></textarea>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>借用数量</label>
                            <input type="number" id="fjysl" placeholder="请填写" style="padding:0;" />
                        </div>
                    </div>
                </div>
                   `;
        $("#mxlist").append(li);
    });
}

//查询可借用的物料
function inquireMat() {

    var xml = `<?xml version= "1.0" ?>
                                 <Requests>
                                 <Params>
                                 <DataSource>BPM_WEGO2018</DataSource>
                                 <ID>erpcloud_查询洁丽康公司_产品_主表</ID>
                                 <Type>1</Type>
                                 <Method>GetUserDataProcedure</Method>
                                 <ProcedureName>erpcloud_查询洁丽康公司_产品_主表</ProcedureName>
                                 <Filter>                                         
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
        var itemArr = provideData.Tables[0].Rows;
     
        itemArr = itemArr.filter((val, i, arr) => {

            if (itemArr[i].可借用 == '是') {
                return itemArr[i];
            }
        });
        itemArr = itemArr.map((val, i, arr) => {

            var obj = {
                value: itemArr[i].id,
                text: itemArr[i].物料编码 + '||' + itemArr[i].物料名称,
                fid: itemArr[i].fid,
                助记码: itemArr[i].助记码,
                可借用: itemArr[i].可借用,
                可试用: itemArr[i].可试用,
                可销售: itemArr[i].可销售,
                基本计量单位名称: itemArr[i].基本计量单位名称,
                基本计量单位编码: itemArr[i].基本计量单位编码,
                备注: itemArr[i].备注,
                物料名称: itemArr[i].物料名称,
                物料状态: itemArr[i].物料状态,
                物料编码: itemArr[i].物料编码,
                生产许可证号: itemArr[i].生产许可证号,
                装量: itemArr[i].装量,
                规格型号: itemArr[i].规格型号,
                附件: itemArr[i].附件
            }

            return obj;
        });
        console.log(itemArr);
        var picker = new mui.PopPicker();
        picker.setData(itemArr);
        $('body').on('tap', '#fwlbm', function () {
            var _self = this;
            picker.show(function (items) {
                $(_self).val(items[0].物料编码);
                $(_self).parents("#mx").find("#fwlmc").val(items[0].物料名称);
                $(_self).parents("#mx").find("#fggxh").val(items[0].规格型号);
                $(_self).parents("#mx").find("#fjldw").val(items[0].基本计量单位名称);
            });
        });

    }).fail(function (e) {

    });
}


function initData(data, flag) {
    var item = data.FormDataSet.洁丽康公司_产品借用申请_主表[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.单号);
    }

    $("#fsqr").val(item.申请人);
    $("#fsqbm").val(item.申请部门);
    $("#fsqdate").val(FormatterTimeYMS(item.申请日期));
    $("#fjyyt").val((item.借用用途));
    $("#fshdz").val(item.送货地址);
    var item_c = data.FormDataSet.洁丽康公司_产品借用申请_子表1;
    for (var i = 0; i < item_c.length; i++) {
        itemidArr.push(item_c[i].itemid);
        var li = `
               <div id="mx">
                    <div class="mui-input-row itemtitle">
                        <label>明细列表项</label>
                        <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>
                    </div>
                    <div class="mui-row cutOffLine padding">
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>物料编码<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fwlbm" readonly>${item_c[i].物料编码}</textarea>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>物料名称</label>
                            <textarea rows="2" id="fwlmc" readonly>${item_c[i].物料名称}</textarea>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>规格型号</label>
                            <textarea rows="2" id="fggxh" readonly>${item_c[i].规格型号}</textarea>
                        </div>
                    </div>
                    <div class="mui-row cutOffLine padding">
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>计量单位</label>
                            <textarea rows="2" id="fjldw" readonly>${item_c[i].计量单位}</textarea>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>借用数量</label>
                            <input type="number" id="fjysl" readonly style="padding:0;" value="${item_c[i].借用数量}"/>
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
        $("#fshdz,#fjyyt").removeAttr('readonly');
    }

}

class Mx {
    constructor(fwlbm, fwlmc, fggxh, fjldw, fjysl) {
        this.fwlbm = fwlbm;
        this.fwlmc = fwlmc;
        this.fggxh = fggxh;
        this.fjldw = fjldw;
        this.fjysl = fjysl;
    }
    check() {
        if (!this.fwlbm) {
            mui.toast('请选择物料');
            return true;
        }
        return false;
    }
}

function Save() {

    var fsqr = $("#fsqr").val();
    var fsqbm = $("#fsqbm").val();
    var fsqdate = $("#fsqdate").val();
    var fjyyt = $("#fjyyt").val();
    var fshdz = $("#fshdz").val();
    if (!fjyyt) {
        mui.toast('请填写借用用途');
        return;
    }
    if (!fshdz) {
        mui.toast('请填写送货地址');
        return;
    }
    var mxflag = false;
    var mxlistArr = [];
    $("#mxlist").find("#mx").each(function () {
        var fwlbm = $(this).find("#fwlbm").val();
        var fwlmc = $(this).find("#fwlmc").val();
        var fggxh = $(this).find("#fggxh").val();
        var fjldw = $(this).find("#fjldw").val();
        var fjysl = $(this).find("#fjysl").val();

        var mx = new Mx(fwlbm, fwlmc, fggxh, fjldw, fjysl);
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
                                <ProcessName>洁丽康公司产品借用申请</ProcessName>
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
                <洁丽康公司_产品借用申请_主表>
                    <单号>自动生成</单号>
                    <申请人>${fsqr}</申请人>
                    <申请部门>${fsqbm}</申请部门>
                    <申请日期>${fsqdate}</申请日期>
                    <借用用途>${fjyyt}</借用用途>
                    <送货地址>${fshdz}</送货地址>
                    <TaskID></TaskID>
                </洁丽康公司_产品借用申请_主表>
                      `;
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `
      <洁丽康公司_产品借用申请_子表1>
            <RelationRowGuid>${i + 1}</RelationRowGuid>
            <RowPrimaryKeys></RowPrimaryKeys>
            <序号>${i + 1}</序号>
            <物料编码>${mxlistArr[i].fwlbm}</物料编码>
            <物料名称>${mxlistArr[i].fwlmc}</物料名称>
            <规格型号>${mxlistArr[i].fggxh}</规格型号>
            <计量单位>${mxlistArr[i].fjldw}</计量单位>
            <借用数量>${mxlistArr[i].fjysl}</借用数量>
        </洁丽康公司_产品借用申请_子表1>
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
    var fsqdate = $("#fsqdate").val();
    var fjyyt = $("#fjyyt").val();
    var fshdz = $("#fshdz").val();
    if (!fjyyt) {
        mui.toast('请填写借用用途');
        return;
    }
    if (!fshdz) {
        mui.toast('请填写送货地址');
        return;
    }
    var mxflag = false;
    var mxlistArr = [];
    $("#mxlist").find("#mx").each(function () {
        var fwlbm = $(this).find("#fwlbm").val();
        var fwlmc = $(this).find("#fwlmc").val();
        var fggxh = $(this).find("#fggxh").val();
        var fjldw = $(this).find("#fjldw").val();
        var fjysl = $(this).find("#fjysl").val();

        var mx = new Mx(fwlbm, fwlmc, fggxh, fjldw, fjysl);
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
                <洁丽康公司_产品借用申请_主表>
                    <单号>${fbillno}</单号>
                    <申请人>${fsqr}</申请人>
                    <申请部门>${fsqbm}</申请部门>
                    <申请日期>${fsqdate}</申请日期>
                    <借用用途>${fjyyt}</借用用途>
                  <送货地址>${fshdz}</送货地址>
                    <TaskID>${$("#taskId").val()}</TaskID>
                </洁丽康公司_产品借用申请_主表>
                      `;
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `
      <洁丽康公司_产品借用申请_子表1>
            <RelationRowGuid>${i + 1}</RelationRowGuid>
            <RowPrimaryKeys></RowPrimaryKeys>
            <序号>${i + 1}</序号>
            <物料编码>${mxlistArr[i].fwlbm}</物料编码>
            <物料名称>${mxlistArr[i].fwlmc}</物料名称>
            <规格型号>${mxlistArr[i].fggxh}</规格型号>
            <计量单位>${mxlistArr[i].fjldw}</计量单位>
            <借用数量>${mxlistArr[i].fjysl}</借用数量>
        </洁丽康公司_产品借用申请_子表1>
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
    var fsqdate = $("#fsqdate").val();
    var fjyyt = $("#fjyyt").val();
    var fshdz = $("#fshdz").val();
    var mxflag = false;
    var mxlistArr = [];
    $("#mxlist").find("#mx").each(function () {
        var fwlbm = $(this).find("#fwlbm").val();
        var fwlmc = $(this).find("#fwlmc").val();
        var fggxh = $(this).find("#fggxh").val();
        var fjldw = $(this).find("#fjldw").val();
        var fjysl = $(this).find("#fjysl").val();

        var mx = new Mx(fwlbm, fwlmc, fggxh, fjldw, fjysl);       
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
                <洁丽康公司_产品借用申请_主表>
                    <单号>${fbillno}</单号>
                    <申请人>${fsqr}</申请人>
                    <申请部门>${fsqbm}</申请部门>
                    <申请日期>${fsqdate}</申请日期>
                    <借用用途>${fjyyt}</借用用途>
 <送货地址>${fshdz}</送货地址>
                    <TaskID>${$("#taskId").val()}</TaskID>
                </洁丽康公司_产品借用申请_主表>
                      `;
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `
      <洁丽康公司_产品借用申请_子表1>
            <RelationRowGuid>${i + 1}</RelationRowGuid>
            <RowPrimaryKeys>itemid=${itemidArr[i]}</RowPrimaryKeys>
            <序号>${i + 1}</序号>
            <物料编码>${mxlistArr[i].fwlbm}</物料编码>
            <物料名称>${mxlistArr[i].fwlmc}</物料名称>
            <规格型号>${mxlistArr[i].fggxh}</规格型号>
            <计量单位>${mxlistArr[i].fjldw}</计量单位>
            <借用数量>${mxlistArr[i].fjysl}</借用数量>
        </洁丽康公司_产品借用申请_子表1>
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
                <洁丽康公司_产品借用申请_主表>
                    <单号>${fbillno}</单号>
                    <申请人>${fsqr}</申请人>
                    <申请部门>${fsqbm}</申请部门>
                    <申请日期>${fsqdate}</申请日期>
                    <借用用途>${fjyyt}</借用用途>
 <送货地址>${fshdz}</送货地址>
                    <TaskID>${$("#taskId").val()}</TaskID>
                </洁丽康公司_产品借用申请_主表>
                      `;
        for (var i = 0; i < mxlistArr.length; i++) {
            xml += `
      <洁丽康公司_产品借用申请_子表1>
            <RelationRowGuid>${i + 1}</RelationRowGuid>
            <RowPrimaryKeys>itemid=${itemidArr[i]}</RowPrimaryKeys>
            <序号>${i + 1}</序号>
            <物料编码>${mxlistArr[i].fwlbm}</物料编码>
            <物料名称>${mxlistArr[i].fwlmc}</物料名称>
            <规格型号>${mxlistArr[i].fggxh}</规格型号>
            <计量单位>${mxlistArr[i].fjldw}</计量单位>
            <借用数量>${mxlistArr[i].fjysl}</借用数量>
        </洁丽康公司_产品借用申请_子表1>
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