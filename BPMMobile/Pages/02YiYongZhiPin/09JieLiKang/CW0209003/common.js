function prepMsg() {

    $("#fsqrq").val(getNowFormatDate(2));

    tapEvent();
   
    var xml = `<?xml version= "1.0" ?>
                  <Requests>
                      <Params>
                      <Method>GetFormPostData</Method>
                      <ProcessName>洁丽康公司差旅费申请</ProcessName>
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


       
    }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
        if (XMLHttpRequest.status == "401") {
            mui.alert('授权过期，请重新打开页面');;
        } else if (XMLHttpRequest.status == "500") {
            mui.alert('服务器内部错误');
        }

    });
}

function tapEvent() {
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
    var picker = new mui.PopPicker();
    picker.setData(fif_data);

    $("#fif_jk").on('tap', function () {
        var _self = this;
        picker.show(function (items) {
            $(_self).val(items[0].text);
            if (items[0].text == '是') {
                $("#fjkcard").show();
            } else if (items[0].text == '否') {
                $("#fjkcard").hide();
            } 
        });
    });

    $("#fjkje").on('input', function () {
        var _val = $(this).val();
        $("#fjkje_dx").val(atoc(_val));
    });

    var dateOpt = {
        "type":"date"
    };

    var datePicker = new mui.DtPicker(dateOpt);

    $("#fksrq").on('tap', function () {
        var _self = this;
        datePicker.show(function (rs) {
            $(_self).val(rs.text);
        });
    });

    $("#fjsrq").on('tap', function () {
        var _self = this;
        datePicker.show(function (rs) {
            $(_self).val(rs.text);
        });
    });
    var fjtgj_data = [
        {
            value: '',
            text:'飞机'
        },
        {
            value: '',
            text:'火车'
        },
        {
            value: '',
            text:'长途汽车'
        },
        {
            value: '',
            text:'轮船'
        }
    ];
    var picker_traffic = new mui.PopPicker();
    picker_traffic.setData(fjtgj_data);

    $("#mxlist").on('tap', '#fjtgj', function () {
        var _self = this;
        picker_traffic.show(function (items) {
            $(_self).val(items[0].text);
        });
    });

    initProvince();

    $("#tjmx").on('tap', function () {
        var li = `
                <div id="mx">
                    <div class="mui-input-row itemtitle">
                        <label>明细列表项</label>
                        <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>
                    </div>
                    <div class="mui-row cutOffLine padding">
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>出差开始日期<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fksrq" readonly placeholder="请选择"></textarea>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>出差结束日期<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fjsrq" readonly placeholder="请选择"></textarea>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>交通工具<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fjtgj" readonly placeholder="请选择"></textarea>
                        </div>
                    </div>

                    <div class="mui-row cutOffLine padding">
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>出差地点<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fccdd_pro" readonly placeholder="请选择省"></textarea>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <textarea rows="2" id="fccdd_city" placeholder="请填写市"></textarea>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>出差人数<i style="color:red;">*</i></label>
                            <input type="number" id="fccrs" placeholder="请填写" />
                        </div>
                    </div>
                    <div class="mui-row cutOffLine padding">
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>出差天数<i style="color:red;">*</i></label>
                            <input type="number" id="fccts" placeholder="请填写" />
                        </div>
                    </div>
                </div>
                 `;
        $("#mxlist").append(li);
    });
    $("#fje_ctjtf,#fje_zsf,#fje_cf,#fje_snjtf,#fje_qt").on('input', function () {
        calcTo();   
    });

}

function calcTo() {
    var fhj = 0;
    var fje_ctjtf = isNaN(parseFloat($("#fje_ctjtf").val())) ? 0 : parseFloat($("#fje_ctjtf").val());
    var fje_zsf = isNaN(parseFloat($("#fje_zsf").val())) ? 0 : parseFloat($("#fje_zsf").val());
    var fje_cf = isNaN(parseFloat($("#fje_cf").val())) ? 0 : parseFloat($("#fje_cf").val());
    var fje_snjtf = isNaN(parseFloat($("#fje_snjtf").val())) ? 0 : parseFloat($("#fje_snjtf").val());
    var fje_qt = isNaN(parseFloat($("#fje_qt").val())) ? 0 : parseFloat($("#fje_qt").val());
    fhj = fje_ctjtf + fje_zsf + fje_cf + fje_snjtf + fje_qt;
    $("#fhj").val(fhj);
    $("#fhj_dx").val(atoc(fhj));

}

function initProvince() {
    var xml = `<?xml version= "1.0" ?>
                                 <Requests>
                                 <Params>
                                 <DataSource>BPM_EXPENSE</DataSource>
                                 <ID>erpcloud_查询省份</ID>
                                 <Type>1</Type>
                                 <Method>GetUserDataProcedure</Method>
                                 <ProcedureName>erpcloud_查询省份</ProcedureName>
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
        console.log(provideData);
        var pDatas = provideData.Tables[0].Rows;
        var proArr = [];
        for (var i = 0; i < pDatas.length; i++) {
            var obj = {
                value: pDatas[i].provinceid,
                text: pDatas[i].provincename
            }
            proArr.push(obj);
        }

        var picker_pro = new mui.PopPicker();
        picker_pro.setData(proArr);
        $("#mxlist").on('tap', '#fccdd_pro', function () {
            var _self = this;
            picker_pro.show(function (items) {
                $(_self).val(items[0].text);
            });
        });
        
    }).fail(function (e) {
        console.log(e);
    });
}

function initData(data, flag) {
    var item = data.FormDataSet.洁丽康公司_差旅费支出计划申请_主表[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.单号);
    }
    $("#fsqr").val(item.申请人);
    $("#fsqbm").val(item.申请部门);
    $("#fsqrq").val(FormatterTimeYMS(item.申请日期));
    $("#fif_jk").val(item.是否借款);
    $("#fts_ctjtf").val(item.天数_长途交通费);
    $("#fje_ctjtf").val(item.申请金额_长途交通费);
    $("#fccrw").val(item.出差任务内容);
    $("#fyqmb").val(item.预期完成目标);
    $("#fts_zsf").val(item.天数_住宿费);
    $("#fje_zsf").val(item.申请金额_住宿费);
    $("#fts_cf").val(item.天数_餐费);
    $("#fje_cf").val(item.申请金额_餐费);
    $("#fts_snjtf").val(item.天数_市内交通费);
    $("#fje_snjtf").val(item.申请金额_市内交通费);
    $("#fts_qt").val(item.天数_其他差旅费);
    $("#fje_qt").val(item.申请金额_其他差旅费);
    $("#fhj").val(item.合计金额);
    $("#fhj_dx").val(item.合计金额大写);
    $("#fjkje").val(item.借款金额);
    $("#fjkje_dx").val(item.借款金额大写);
    $("#fjkdh").val(item.借款单号);
    $("#fjkyt").val(item.借款用途);
    $("#fsqrno").val(item.申请人工号);
    $("#fbmjl").val(item.部门经理);
    $("#ffgld").val(item.分管领导);
    $("#fcwshr").val(item.财务审核人);
    $("#fspr").val(item.审批人);
    $("#fsqrzw").val(item.申请人职位);
    $("#ps").val(item.PS职位);
    if (item.是否借款 == '是') {
        $("#fjkcard").show();
    }

    var item_c = data.FormDataSet.洁丽康公司_差旅费支出计划申请_子表1;
    for (var i = 0; i < item_c.length; i++) {
        itemidArr.push(item_c[i].itemid);
        var li = `<div id="mx">
                    <div class="mui-input-row itemtitle">
                        <label>明细列表项</label>
                        <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>
                    </div>
                    <div class="mui-row cutOffLine padding">
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>出差开始日期<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fksrq" readonly >${FormatterTimeYMS(item_c[i].出差开始日期)}</textarea>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>出差结束日期<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fjsrq" readonly >${FormatterTimeYMS(item_c[i].出差结束日期)}</textarea>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>交通工具<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fjtgj" readonly >${item_c[i].交通工具}</textarea>
                        </div>
                    </div>

                    <div class="mui-row cutOffLine padding">
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>出差地点<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fccdd_pro" readonly >${item_c[i].省份}</textarea>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <textarea rows="2" id="fccdd_city" readonly>${item_c[i].城市}</textarea>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>出差人数<i style="color:red;">*</i></label>
                            <input type="number" id="fccrs" readonly value="${item_c[i].出差人数}"/>
                        </div>
                    </div>
                    <div class="mui-row cutOffLine padding">
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>出差天数<i style="color:red;">*</i></label>
                            <input type="number" id="fccts" readonly value="${item_c[i].出差天数}"/>
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
        $("#mxlist").find("span").each(function () {
            $(this).show();
        });
        $("#mxlist").find("#fccdd_city,#fccrs,#fccts").each(function () {
            $(this).removeAttr('readonly');
        });

        $("#fjkje,#fjkyt,#fts_ctjtf,#fje_ctjtf,#fts_zsf,#fje_zsf,#fts_cf,#fje_cf",
            "#fts_snjtf", "#fje_snjtf", "#fts_qt", "#fje_qt", "#fccrw","#fyqmb"
        ).removeAttr('readonly');

    }
}


class Mx {
    constructor(fksrq, fjsrq, fjtgj, fccdd_pro, fccdd_city, fccrs, fccts) {
        this.fksrq = fksrq;
        this.fjsrq = fjsrq;
        this.fjtgj = fjtgj;
        this.fccdd_pro = fccdd_pro;
        this.fccdd_city = fccdd_city;
        this.fccrs = fccrs;
        this.fccts = fccts;
    }
    check() {
        if (!this.fksrq) {
            mui.toast('请选择开始日期');
            return true;
        }

        if (!this.fjsrq) {
            mui.toast('请选择结束日期');
            return true;
        }
        if (!this.fjtgj) {
            mui.toast('请选择交通工具');
            return true;
        }
        if (!this.fccdd_pro) {
            mui.toast('请选择出差地点(省份)');
            return true;
        }
        if (!this.fccdd_city) {
            mui.toast('请填写出差地点(城市)');
            return true;
        }
        if (!this.fccrs) {
            mui.toast('请填写出差人数');
            return true;
        }
        if (!this.fccts) {
            mui.toast('请填写出差天数');
            return true;
        }
        return false;
    }
}

function Save() {

    var fsqr = $("#fsqr").val();
    var fsqbm = $("#fsqbm").val();
    var fsqrq = $("#fsqrq").val();
    var fif_jk = $("#fif_jk").val();
    var fjkje = $("#fjkje").val();
    var fjkje_dx = $("#fjkje_dx").val();
    var fjkdh = $("#fjkdh").val();
    var fjkyt = $("#fjkyt").val();
    var fts_ctjtf = $("#fts_ctjtf").val();
    var fje_ctjtf = $("#fje_ctjtf").val();
    var fts_zsf = $("#fts_zsf").val();
    var fje_zsf = $("#fje_zsf").val();
    var fts_cf = $("#fts_cf").val();
    var fje_cf = $("#fje_cf").val();
    var fts_snjtf = $("#fts_snjtf").val();
    var fje_snjtf = $("#fje_snjtf").val();
    var fts_qt = $("#fts_qt").val();
    var fje_qt = $("#fje_qt").val();
    var fccrw = $("#fccrw").val();
    var fyqmb = $("#fyqmb").val();
    var fhj = $("#fhj").val();
    var fhj_dx = $("#fhj_dx").val();
    var fsqrno = $("#fsqrno").val();
    var fbmjl = $("#fbmjl").val();
    var ffgld = $("#ffgld").val();
    var fcwshr = $("#fcwshr").val();
    var fspr = $("#fspr").val();
    var fsqrzw = $("#fsqrzw").val();
    var ps = $("#ps").val();


    if (!fts_ctjtf) {
        mui.toast('请填写长途交通费天数');
        return;
    }
    if (!fje_ctjtf) {
        mui.toast('请填写长途交通费金额');
        return;
    }
    if (!fts_zsf) {
        mui.toast('请填写住宿费天数');
        return;
    }
    if (!fje_zsf) {
        mui.toast('请填写住宿费金额');
        return;
    }
    if (!fts_cf) {
        mui.toast('请填写住宿费天数');
        return;
    }
    if (!fje_cf) {
        mui.toast('请填写住宿费金额');
        return;
    }
    if (!fts_snjtf) {
        mui.toast('请填写市内交通费天数');
        return;
    }
    if (!fje_snjtf) {
        mui.toast('请填写市内交通费金额');
        return;
    }
    if (!fts_qt) {
        mui.toast('请填写其他差旅费天数');
        return;
    }
    if (!fje_qt) {
        mui.toast('请填写其他差旅费金额');
        return;
    }
    if (!fccrw) {
        mui.toast('请填写出差任务内容');
        return;
    }
    if (!fyqmb) {
        mui.toast('请填写预期完成目标');
        return;
    }
    var mxflag = false;
    var mxlistArr = [];
    $("#mxlist").find("#mx").each(function () {
        var fksrq = $(this).find("#fksrq").val();
        var fjsrq = $(this).find("#fjsrq").val();
        var fjtgj = $(this).find("#fjtgj").val();
        var fccdd_pro = $(this).find("#fccdd_pro").val();
        var fccdd_city = $(this).find("#fccdd_city").val();
        var fccrs = $(this).find("#fccrs").val();
        var fccts = $(this).find("#fccts").val();

        var mx = new Mx(fksrq, fjsrq, fjtgj, fccdd_pro, fccdd_city, fccrs, fccts);
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
                                <ProcessName>洁丽康公司差旅费申请</ProcessName>
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
      <洁丽康公司_差旅费支出计划申请_主表>
            <单号>自动生成</单号>
            <申请人>${fsqr}</申请人>
            <申请部门>${fsqbm}</申请部门>
            <申请日期>${fsqrq}</申请日期>
            <是否借款>${fif_jk}</是否借款>
            <天数_长途交通费>${fts_ctjtf}</天数_长途交通费>
            <申请金额_长途交通费>${fje_ctjtf}</申请金额_长途交通费>
            <出差任务内容>${fccrw}</出差任务内容>
            <预期完成目标>${fyqmb}</预期完成目标>
            <天数_住宿费>${fts_zsf}</天数_住宿费>
            <申请金额_住宿费>${fje_zsf}</申请金额_住宿费>
            <天数_餐费>${fts_cf}</天数_餐费>
            <申请金额_餐费>${fje_cf}</申请金额_餐费>
            <天数_市内交通费>${fts_snjtf}</天数_市内交通费>
            <申请金额_市内交通费>${fje_snjtf}</申请金额_市内交通费>
            <天数_其他差旅费>${fts_qt}</天数_其他差旅费>
            <申请金额_其他差旅费>${fje_qt}</申请金额_其他差旅费>
            <合计金额>${fhj}</合计金额>
            <合计金额大写>${fhj_dx}</合计金额大写>
            <借款金额>${fjkje}</借款金额>
            <借款金额大写>${fjkje_dx}</借款金额大写>
            <借款单号>${fjkdh}</借款单号>
            <借款用途>${fjkyt}</借款用途>
            <TaskID></TaskID>
            <申请人工号>${fsqrno}</申请人工号>
            <部门经理></部门经理>
            <分管领导></分管领导>
            <财务审核人></财务审核人>
            <审批人></审批人>
            <申请人职位></申请人职位>
            <PS职位>软件开发工程师</PS职位>
        </洁丽康公司_差旅费支出计划申请_主表>
                     `;
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `
       <洁丽康公司_差旅费支出计划申请_子表1>
            <RelationRowGuid>${i+1}</RelationRowGuid>
            <RowPrimaryKeys></RowPrimaryKeys>
            <出差开始日期>${mxlistArr[i].fksrq}</出差开始日期>
            <出差结束日期>${mxlistArr[i].fjsrq}</出差结束日期>
            <交通工具>${mxlistArr[i].fjtgj}</交通工具>
            <省份>${mxlistArr[i].fccdd_pro}</省份>
            <城市>${mxlistArr[i].fccdd_city}</城市>
            <出差人数>${mxlistArr[i].fccrs}</出差人数>
            <出差天数>${mxlistArr[i].fccts}</出差天数>
        </洁丽康公司_差旅费支出计划申请_子表1>
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
    var fif_jk = $("#fif_jk").val();
    var fjkje = $("#fjkje").val();
    var fjkje_dx = $("#fjkje_dx").val();
    var fjkdh = $("#fjkdh").val();
    var fjkyt = $("#fjkyt").val();
    var fts_ctjtf = $("#fts_ctjtf").val();
    var fje_ctjtf = $("#fje_ctjtf").val();
    var fts_zsf = $("#fts_zsf").val();
    var fje_zsf = $("#fje_zsf").val();
    var fts_cf = $("#fts_cf").val();
    var fje_cf = $("#fje_cf").val();
    var fts_snjtf = $("#fts_snjtf").val();
    var fje_snjtf = $("#fje_snjtf").val();
    var fts_qt = $("#fts_qt").val();
    var fje_qt = $("#fje_qt").val();
    var fccrw = $("#fccrw").val();
    var fyqmb = $("#fyqmb").val();
    var fhj = $("#fhj").val();
    var fhj_dx = $("#fhj_dx").val();
    var fsqrno = $("#fsqrno").val();
    var fbmjl = $("#fbmjl").val();
    var ffgld = $("#ffgld").val();
    var fcwshr = $("#fcwshr").val();
    var fspr = $("#fspr").val();
    var fsqrzw = $("#fsqrzw").val();
    var ps = $("#ps").val();


    if (!fts_ctjtf) {
        mui.toast('请填写长途交通费天数');
        return;
    }
    if (!fje_ctjtf) {
        mui.toast('请填写长途交通费金额');
        return;
    }
    if (!fts_zsf) {
        mui.toast('请填写住宿费天数');
        return;
    }
    if (!fje_zsf) {
        mui.toast('请填写住宿费金额');
        return;
    }
    if (!fts_cf) {
        mui.toast('请填写住宿费天数');
        return;
    }
    if (!fje_cf) {
        mui.toast('请填写住宿费金额');
        return;
    }
    if (!fts_snjtf) {
        mui.toast('请填写市内交通费天数');
        return;
    }
    if (!fje_snjtf) {
        mui.toast('请填写市内交通费金额');
        return;
    }
    if (!fts_qt) {
        mui.toast('请填写其他差旅费天数');
        return;
    }
    if (!fje_qt) {
        mui.toast('请填写其他差旅费金额');
        return;
    }
    if (!fccrw) {
        mui.toast('请填写出差任务内容');
        return;
    }
    if (!fyqmb) {
        mui.toast('请填写预期完成目标');
        return;
    }
    var mxflag = false;
    var mxlistArr = [];
    $("#mxlist").find("#mx").each(function () {
        var fksrq = $(this).find("#fksrq").val();
        var fjsrq = $(this).find("#fjsrq").val();
        var fjtgj = $(this).find("#fjtgj").val();
        var fccdd_pro = $(this).find("#fccdd_pro").val();
        var fccdd_city = $(this).find("#fccdd_city").val();
        var fccrs = $(this).find("#fccrs").val();
        var fccts = $(this).find("#fccts").val();

        var mx = new Mx(fksrq, fjsrq, fjtgj, fccdd_pro, fccdd_city, fccrs, fccts);
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
      <洁丽康公司_差旅费支出计划申请_主表>
            <单号>${fbillno}</单号>
            <申请人>${fsqr}</申请人>
            <申请部门>${fsqbm}</申请部门>
            <申请日期>${fsqrq}</申请日期>
            <是否借款>${fif_jk}</是否借款>
            <天数_长途交通费>${fts_ctjtf}</天数_长途交通费>
            <申请金额_长途交通费>${fje_ctjtf}</申请金额_长途交通费>
            <出差任务内容>${fccrw}</出差任务内容>
            <预期完成目标>${fyqmb}</预期完成目标>
            <天数_住宿费>${fts_zsf}</天数_住宿费>
            <申请金额_住宿费>${fje_zsf}</申请金额_住宿费>
            <天数_餐费>${fts_cf}</天数_餐费>
            <申请金额_餐费>${fje_cf}</申请金额_餐费>
            <天数_市内交通费>${fts_snjtf}</天数_市内交通费>
            <申请金额_市内交通费>${fje_snjtf}</申请金额_市内交通费>
            <天数_其他差旅费>${fts_qt}</天数_其他差旅费>
            <申请金额_其他差旅费>${fje_qt}</申请金额_其他差旅费>
            <合计金额>${fhj}</合计金额>
            <合计金额大写>${fhj_dx}</合计金额大写>
            <借款金额>${fjkje}</借款金额>
            <借款金额大写>${fjkje_dx}</借款金额大写>
            <借款单号>${fjkdh}</借款单号>
            <借款用途>${fjkyt}</借款用途>
            <TaskID></TaskID>
            <申请人工号>${fsqrno}</申请人工号>
            <部门经理></部门经理>
            <分管领导></分管领导>
            <财务审核人></财务审核人>
            <审批人></审批人>
            <申请人职位></申请人职位>
            <PS职位>软件开发工程师</PS职位>
        </洁丽康公司_差旅费支出计划申请_主表>
                     `;
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `
       <洁丽康公司_差旅费支出计划申请_子表1>
            <RelationRowGuid>${i + 1}</RelationRowGuid>
            <RowPrimaryKeys></RowPrimaryKeys>
            <出差开始日期>${mxlistArr[i].fksrq}</出差开始日期>
            <出差结束日期>${mxlistArr[i].fjsrq}</出差结束日期>
            <交通工具>${mxlistArr[i].fjtgj}</交通工具>
            <省份>${mxlistArr[i].fccdd_pro}</省份>
            <城市>${mxlistArr[i].fccdd_city}</城市>
            <出差人数>${mxlistArr[i].fccrs}</出差人数>
            <出差天数>${mxlistArr[i].fccts}</出差天数>
        </洁丽康公司_差旅费支出计划申请_子表1>
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
    var fif_jk = $("#fif_jk").val();
    var fjkje = $("#fjkje").val();
    var fjkje_dx = $("#fjkje_dx").val();
    var fjkdh = $("#fjkdh").val();
    var fjkyt = $("#fjkyt").val();
    var fts_ctjtf = $("#fts_ctjtf").val();
    var fje_ctjtf = $("#fje_ctjtf").val();
    var fts_zsf = $("#fts_zsf").val();
    var fje_zsf = $("#fje_zsf").val();
    var fts_cf = $("#fts_cf").val();
    var fje_cf = $("#fje_cf").val();
    var fts_snjtf = $("#fts_snjtf").val();
    var fje_snjtf = $("#fje_snjtf").val();
    var fts_qt = $("#fts_qt").val();
    var fje_qt = $("#fje_qt").val();
    var fccrw = $("#fccrw").val();
    var fyqmb = $("#fyqmb").val();
    var fhj = $("#fhj").val();
    var fhj_dx = $("#fhj_dx").val();
    var fsqrno = $("#fsqrno").val();
    var fbmjl = $("#fbmjl").val();
    var ffgld = $("#ffgld").val();
    var fcwshr = $("#fcwshr").val();
    var fspr = $("#fspr").val();
    var fsqrzw = $("#fsqrzw").val();
    var ps = $("#ps").val();

    var mxflag = false;
    var mxlistArr = [];
    $("#mxlist").find("#mx").each(function () {
        var fksrq = $(this).find("#fksrq").val();
        var fjsrq = $(this).find("#fjsrq").val();
        var fjtgj = $(this).find("#fjtgj").val();
        var fccdd_pro = $(this).find("#fccdd_pro").val();
        var fccdd_city = $(this).find("#fccdd_city").val();
        var fccrs = $(this).find("#fccrs").val();
        var fccts = $(this).find("#fccts").val();

        var mx = new Mx(fksrq, fjsrq, fjtgj, fccdd_pro, fccdd_city, fccrs, fccts);      
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
      <洁丽康公司_差旅费支出计划申请_主表>
            <单号>${fbillno}</单号>
            <申请人>${fsqr}</申请人>
            <申请部门>${fsqbm}</申请部门>
            <申请日期>${fsqrq}</申请日期>
            <是否借款>${fif_jk}</是否借款>
            <天数_长途交通费>${fts_ctjtf}</天数_长途交通费>
            <申请金额_长途交通费>${fje_ctjtf}</申请金额_长途交通费>
            <出差任务内容>${fccrw}</出差任务内容>
            <预期完成目标>${fyqmb}</预期完成目标>
            <天数_住宿费>${fts_zsf}</天数_住宿费>
            <申请金额_住宿费>${fje_zsf}</申请金额_住宿费>
            <天数_餐费>${fts_cf}</天数_餐费>
            <申请金额_餐费>${fje_cf}</申请金额_餐费>
            <天数_市内交通费>${fts_snjtf}</天数_市内交通费>
            <申请金额_市内交通费>${fje_snjtf}</申请金额_市内交通费>
            <天数_其他差旅费>${fts_qt}</天数_其他差旅费>
            <申请金额_其他差旅费>${fje_qt}</申请金额_其他差旅费>
            <合计金额>${fhj}</合计金额>
            <合计金额大写>${fhj_dx}</合计金额大写>
            <借款金额>${fjkje}</借款金额>
            <借款金额大写>${fjkje_dx}</借款金额大写>
            <借款单号>${fjkdh}</借款单号>
            <借款用途>${fjkyt}</借款用途>
            <TaskID>${$("#taskId").val()}</TaskID>
            <申请人工号>${fsqrno}</申请人工号>
            <部门经理>${fbmjl}</部门经理>
            <分管领导>${ffgld}</分管领导>
            <财务审核人>${fcwshr}</财务审核人>
            <审批人>${fspr}</审批人>
            <申请人职位>${fsqrzw}</申请人职位>
            <PS职位>${ps}</PS职位>
        </洁丽康公司_差旅费支出计划申请_主表>
                     `;
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `
       <洁丽康公司_差旅费支出计划申请_子表1>
            <RelationRowGuid>${i + 1}</RelationRowGuid>
            <RowPrimaryKeys>itemid=${itemidArr[i]}</RowPrimaryKeys>
            <出差开始日期>${mxlistArr[i].fksrq}</出差开始日期>
            <出差结束日期>${mxlistArr[i].fjsrq}</出差结束日期>
            <交通工具>${mxlistArr[i].fjtgj}</交通工具>
            <省份>${mxlistArr[i].fccdd_pro}</省份>
            <城市>${mxlistArr[i].fccdd_city}</城市>
            <出差人数>${mxlistArr[i].fccrs}</出差人数>
            <出差天数>${mxlistArr[i].fccts}</出差天数>
        </洁丽康公司_差旅费支出计划申请_子表1>
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
      <洁丽康公司_差旅费支出计划申请_主表>
            <单号>${fbillno}</单号>
            <申请人>${fsqr}</申请人>
            <申请部门>${fsqbm}</申请部门>
            <申请日期>${fsqrq}</申请日期>
            <是否借款>${fif_jk}</是否借款>
            <天数_长途交通费>${fts_ctjtf}</天数_长途交通费>
            <申请金额_长途交通费>${fje_ctjtf}</申请金额_长途交通费>
            <出差任务内容>${fccrw}</出差任务内容>
            <预期完成目标>${fyqmb}</预期完成目标>
            <天数_住宿费>${fts_zsf}</天数_住宿费>
            <申请金额_住宿费>${fje_zsf}</申请金额_住宿费>
            <天数_餐费>${fts_cf}</天数_餐费>
            <申请金额_餐费>${fje_cf}</申请金额_餐费>
            <天数_市内交通费>${fts_snjtf}</天数_市内交通费>
            <申请金额_市内交通费>${fje_snjtf}</申请金额_市内交通费>
            <天数_其他差旅费>${fts_qt}</天数_其他差旅费>
            <申请金额_其他差旅费>${fje_qt}</申请金额_其他差旅费>
            <合计金额>${fhj}</合计金额>
            <合计金额大写>${fhj_dx}</合计金额大写>
            <借款金额>${fjkje}</借款金额>
            <借款金额大写>${fjkje_dx}</借款金额大写>
            <借款单号>${fjkdh}</借款单号>
            <借款用途>${fjkyt}</借款用途>
            <TaskID>${$("#taskId").val()}</TaskID>
            <申请人工号>${fsqrno}</申请人工号>
            <部门经理>${fbmjl}</部门经理>
            <分管领导>${ffgld}</分管领导>
            <财务审核人>${fcwshr}</财务审核人>
            <审批人>${fspr}</审批人>
            <申请人职位>${fsqrzw}</申请人职位>
            <PS职位>${ps}</PS职位>
        </洁丽康公司_差旅费支出计划申请_主表>
                     `;
        for (var i = 0; i < mxlistArr.length; i++) {
            xml += `
       <洁丽康公司_差旅费支出计划申请_子表1>
            <RelationRowGuid>${i + 1}</RelationRowGuid>
            <RowPrimaryKeys>itemid=${itemidArr[i]}</RowPrimaryKeys>
            <出差开始日期>${mxlistArr[i].fksrq}</出差开始日期>
            <出差结束日期>${mxlistArr[i].fjsrq}</出差结束日期>
            <交通工具>${mxlistArr[i].fjtgj}</交通工具>
            <省份>${mxlistArr[i].fccdd_pro}</省份>
            <城市>${mxlistArr[i].fccdd_city}</城市>
            <出差人数>${mxlistArr[i].fccrs}</出差人数>
            <出差天数>${mxlistArr[i].fccts}</出差天数>
        </洁丽康公司_差旅费支出计划申请_子表1>
                       `;
        }

        xml += `
                       </FormData>
                    </XForm>
                   `;
        PostXml(xml);
    }

}