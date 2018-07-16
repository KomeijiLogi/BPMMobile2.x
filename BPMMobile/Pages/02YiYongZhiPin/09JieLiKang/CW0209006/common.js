function prepMsg() {
  
    $("#fbxrq").val(getNowFormatDate(2));
    var xml = `<?xml version= "1.0" ?>
                  <Requests>
                      <Params>
                      <Method>GetFormPostData</Method>
                      <ProcessName>洁丽康公司其他费用报销</ProcessName>
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
        $("#fbxr").val(item.报销人);
        $("#fbxrbm").val(item.报销人部门);
        $("#fbxrgh").val(item.报销人工号);
        $("#fsqrzw").val(item.申请人职位);


    }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
        if (XMLHttpRequest.status == "401") {
            mui.alert('授权过期，请重新打开页面');;
        } else if (XMLHttpRequest.status == "500") {
            mui.alert('服务器内部错误');
        }

        }).then(function () {
            searchCard();
           
        });
}

function tapEvent() {
    
    var date = new Date();
    var opts = {
        "type": "date"
    };
    var dtPicker = new mui.DtPicker(opts);
    $("#fksrq,#fjsrq").on('tap', function () {
        var _self = this;
        dtPicker.show(function (rs) {
            $(_self).val(rs.text);
        });
    });
    var fsy_data = [
        {
            value: '',
            text:'专家咨询费'
        },
        {
            value: '',
            text:'讲师费'
        },
        {
            value: '',
            text:'销售服务费'
        },
        {
            value: '',
            text:'手续费'
        },
        {
            value: '',
            text:'注册费'
        },
        {
            value: '',
            text:'试验检验费'
        },
        {
            value: '',
            text:'员工福利费'
        },
        {
            value: '',
            text:'其他'
        }
    ];

    var picker2 = new mui.PopPicker();
    picker2.setData(fsy_data);
    $("#mxlist").off('tap');
    $("#mxlist").on('tap', '#ffysy', function () {

        var _self = this;
        picker2.show(function (items) {
            $(_self).val(items[0].text);
        });

    });
    $(".mui-icon-left-nav").on('tap', function () {
        $("#wrapper").show();
        $("#selector").hide();

    });
    $("#fsqd").on('tap', () => {
        $("#wrapper").hide();
        $("#selector").show();
        var header = document.querySelector('header.mui-bar');
        var list = document.querySelector('#list');
        var done = document.querySelector('#done');
        //计算高度 
        list.style.height = (document.body.offsetHeight - header.offsetHeight) + 'px';
        //create
        window.indexedList = new mui.IndexedList(list);
    });

    $("#tjmx").on('tap', function () {

        var li = `
             <div id="mx">
                    <div class="mui-input-row itemtitle">
                        <label>明细列表项</label>
                        <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>
                    </div>
                    <div class="mui-row cutOffLine padding">
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>费用项目<i style="color:red;">*</i></label>
                            <textarea rows="2" id="ffyxm" placeholder="请填写"></textarea>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>金额<i style="color:red;">*</i></label>
                            <input type="number" id="fje" placeholder="请填写" />
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>财务核定金额<i style="color:red;">*</i></label>
                            <input type="number" id="fshje" readonly />
                        </div>
                    </div>
                    <div class="mui-row cutOffLine padding">
                        <div class="mui-col-xs-12" style="display:flex;">
                            <label>费用事由<i style="color:red;">*</i></label>
                            <textarea rows="2" id="ffysy" readonly placeholder="请选择"></textarea>
                        </div>
                    </div>

                </div>
                 `;
        $("#mxlist").append(li);

    });
    $("#mxlist").on('input', '#fje', function () {
       
        calcTotal();

    });
}


function calcTotal() {
    var total = 0;
    $("#mxlist").find("#fje").each(function () {
        var fje = isNaN(parseFloat($(this).val())) ? 0 : parseFloat($(this).val());
        total += fje;
    });

    $("#fhj").val(total);
    $("#fhj_dx").val(atoc(total));
}
function prepIndexedList() {

    var header = document.querySelector('header.mui-bar');
    var list = document.querySelector('#list');
    var done = document.querySelector('#done');
    //计算高度 
    list.style.height = (document.body.offsetHeight - header.offsetHeight) + 'px';
    //create
    window.indexedList = new mui.IndexedList(list);

    done.addEventListener('tap', function () {
        var checkboxArray = [].slice.call(list.querySelectorAll('input[type="radio"]'));
        var checkedValues = [];
        var checkedObjs = [];
        checkboxArray.forEach(function (box) {
            if (box.checked) {
                checkedValues.push(box.parentNode.innerText);
                var cobj = {
                    fbillno: $(box).data('bill-no'),
                    ftid: $(box).data('task-id'),
                    flm: $(box).data('lend-money')
                };
                checkedObjs.push(cobj);
                //console.log(checkedObjs);
                //取消选中，防止再次进入列表中会选中某一项
                box.checked = !box.checked;

            }
        });
        if (checkedValues.length > 0) {
            $("#fsqd").val(checkedObjs[checkedObjs.length - 1].fbillno);
            $("#fsqd_tid").val(checkedObjs[checkedObjs.length - 1].ftid);
            $("#fjkje").val(checkedObjs[checkedObjs.length - 1].flm);
            $("#selector").hide();
            $("#wrapper").show();

        } else {

        }


    }, false);

    mui('.mui-indexed-list-inner').on('change', 'input', function () {
        var count = list.querySelectorAll('input[type="radio"]:checked').length;
        var value = count ? "完成(" + count + ")" : "完成";
        done.innerHTML = value;
        if (count) {
            if (done.classList.contains("mui-disabled")) {
                done.classList.remove("mui-disabled");
            }
        } else {
            if (!done.classList.contains("mui-disabled")) {
                done.classList.add("mui-disabled");
            }
        }
    });
    tapEvent();
}

function searchCard() {
    var fno = $("#fbxrgh").val();
    console.log(fno);
    var xml = `<?xml version= "1.0" ?>
                                 <Requests>
                                 <Params>
                                 <DataSource>BPM_WEGO2018</DataSource>
                                 <ID>erpcloud_查询洁丽康公司_费用支出计划申请</ID>
                                 <Type>1</Type>
                                 <Method>GetUserDataProcedure</Method>
                                 <ProcedureName>erpcloud_查询洁丽康公司_费用支出计划申请</ProcedureName>
                                 <Filter><fno>${fno}</fno></Filter>
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
        var data = provideData.Tables[0].Rows;
   
        data = data.filter((val, i, arr) => {
            if (data[i].报销状态 == 1) {
                return data[i];
            }
        });
        console.info(data);
        for (var i = 0; i < data.length; i++) {
            var li = `
                  <li data-value="" data-tags="" class="mui-table-view-cell mui-indexed-list-item mui-radio mui-left">
                       <input type="radio" name="checkbox"
                            data-bill-no="${data[i].单号}" data-task-id="${data[i].TaskID}"
                            data-lend-money="${data[i].借款金额}"  

                          />单号:${data[i].单号}||金额:${data[i].合计金额}
                    </li>
                     `;
            $("#datalist").append(li);
        }

    }).fail(function (e) {

        }).then(() => {
            prepIndexedList();
            
        });

}

function tapEv2() {
    
    $("#mxlist").on('input', '#fshje', function () {
        calcT2();
    });
}


function calcT2() {
    var ft = 0;
    $("#mxlist").find("#fshje").each(function () {
        var _val = parseFloat($(this).val());
        ft += _val-0;
    });
    $("#fhdhj").val(ft);
    $("#fhdhj_dx").val(atoc(ft));

}

function deleteItem(context) {

    var btnArray = ['否', '是'];
    mui.confirm('确认删除？', '', btnArray, function (e) {
        if (e.index == 1) {
            $(context).parent().parent().remove();
            calcTotal();
            calcT2();
        }
    });
}

function initData(data, flag) {
    var item = data.FormDataSet.洁丽康公司_费用报销_主表[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.单号);
    }
    $("#fbxr").val(item.报销人);
    $("#fbxrbm").val(item.报销人部门);
    $("#fbxrq").val(FormatterTimeYMS(item.报销日期));
    $("#fsqd").val(item.费用支出计划申请单);
    $("#fsqd_tid").val(item.费用支出计划申请);
    $("#fjkje").val(item.借款金额);
    $("#fdjs").val(item.附件单据数);
    $("#fksrq").val(FormatterTimeYMS(item.费用开始日期));
    $("#fjsrq").val(FormatterTimeYMS(item.费用结束日期));
    $("#fhj").val(item.合计金额);
    $("#fhj_dx").val(item.合计金额大写);
    $("#fhdhj").val(item.合计金额_财务核定);
    $("#fhdhj_dx").val(item.合计金额大写_财务核定);
    $("#fsqrzw").val(item.申请人职位);
    $("#fbxrgh").val(item.报销人工号);
    $("#fbmjl").val(item.部门经理);
    $("#ffgld").val(item.分管领导);
    $("#fcwshr").val(item.财务审核人);
    $("#fzjl").val(item.总经理);
    $("#ps").val(item.PS职位);
    var item_c = data.FormDataSet.洁丽康公司_费用报销_子表1;
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
                            <label>费用项目<i style="color:red;">*</i></label>
                            <textarea rows="2" id="ffyxm" readonly>${item_c[i].费用项目}</textarea>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>金额<i style="color:red;">*</i></label>
                            <input type="number" id="fje" readonly value="${item_c[i].金额}"/>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>财务核定金额<i style="color:red;">*</i></label>
                            <input type="number" id="fshje" readonly value="${item_c[i].财务核定金额}"/>
                        </div>
                    </div>
                    <div class="mui-row cutOffLine padding">
                        <div class="mui-col-xs-12" style="display:flex;">
                            <label>费用事由<i style="color:red;">*</i></label>
                            <textarea rows="2" id="ffysy" readonly>${item_c[i].费用事由}</textarea>
                        </div>
                    </div>
                </div>
                 `;
        $("#mxlist").append(li);
    }
}

function nodeControllerExp(nodeName) {
    if (String(nodeName).match('开始') != null) {
        tapEvent();
        $("#tjmx").show();
        $("#mxlist").find('span').each(function () {
            $(this).show();
        });
        $("#fdjs").removeAttr('readonly');
        $("#mxlist").find("#mx").each(function () {
            $(this).find("#ffyxm,#fje").removeAttr('readonly');
        });
    } else if (String(nodeName).match('财务部审核岗') != null) {
        tapEv2();
        $("#mxlist").find("#fshje").each(function () {
            $(this).removeAttr('readonly').attr('placeholder', '请填写');
        })
    }
}


class Mx {
    constructor(ffyxm, fje, fshje, ffysy) {
        this.ffyxm = ffyxm;
        this.fje = fje;
        this.fshje = fshje;
        this.ffysy = ffysy;
    }
    check() {
        if (!this.ffyxm) {
            mui.toast('请填写费用项目');
            return true;
        }
        if (!this.fje) {
            mui.toast('请填写金额');
            return true;
        }
        if (!this.ffysy) {
            mui.toast('请填写费用事由');
            return true;
        }
        return false;
    }
}

function Save() {
    var fbxr = $("#fbxr").val();
    var fbxrbm = $("#fbxrbm").val();
    var fbxrq = $("#fbxrq").val();
    var fsqd = $("#fsqd").val();
    var fsqd_tid = $("#fsqd_tid").val();
    var fjkje = $("#fjkje").val();
    var fdjs = $("#fdjs").val();
    var fksrq = $("#fksrq").val();
    var fjsrq = $("#fksrq").val();
    var fhj = $("#fhj").val();
    var fhj_dx = $("#fhj_dx").val();
    var fhdhj = $("#fhdhj").val();
    var fhdhj_dx = $("#fhdhj_dx").val();
    var fsqrzw = $("#fsqrzw").val();
    var fbxrgh = $("#fbxrgh").val();
    var fbmjl = $("#fbmjl").val();
    var ffgld = $("#ffgld").val();
    var fcwshr = $("#fcwshr").val();
    var fzjl = $("#fzjl").val();
    var ps = $("#ps").val();

    if (!fsqd) {
        mui.toast('请选择费用支出计划申请单');
        return;
    }

    if (!fdjs) {
        mui.toast('请填写单据数');
        return;
    }
    if (!fksrq) {
        mui.toast('请选择开始日期');
        return;
    }
    if (!fjsrq) {
        mui.toast('请选择结束日期');
        return;
    }

    var mxflag = false;
    var mxlistArr = [];
    $("#mxlist").find("#mx").each(function () {
        var ffyxm = $(this).find("#ffyxm").val();
        var fje = $(this).find("#fje").val();
        var fshje = $(this).find("#fshje").val();
        var ffysy = $(this).find("#ffysy").val();
        var mx = new Mx(ffyxm, fje, fshje, ffysy);
        if (mx.check()) {
            mxflag = true;
            return;
        }
        mxlistArr.push(mx);
    });

    var btnArry = ["取消", "确定"];
    mui.confirm('即将提交，是否确定？', '提交确认提醒', btnArry, function (e) {
        if (e.index == 1) {
            var xml = `<?xml version="1.0"?>
                        <XForm>
                            <Header>
                                <Method>Post</Method>
                                <ProcessName>洁丽康公司其他费用报销</ProcessName>
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
 <洁丽康公司_费用报销_主表>
            <单号>自动生成</单号>
            <报销人>${fbxr}</报销人>
            <报销人部门>${fbxrbm}</报销人部门>
            <报销日期>${fbxrq}</报销日期>
            <费用支出计划申请单>${fsqd}</费用支出计划申请单>
            <费用支出计划申请>${fsqd_tid}</费用支出计划申请>
            <借款金额>${fjkje}</借款金额>
            <附件单据数>${fdjs}</附件单据数>
            <费用开始日期>${fksrq}</费用开始日期>
            <费用结束日期>${fjsrq}</费用结束日期>
            <合计金额>${fhj}</合计金额>
            <合计金额大写>${fhj_dx}</合计金额大写>
            <合计金额_财务核定>${fhdhj}</合计金额_财务核定>
            <合计金额大写_财务核定>${fhdhj_dx}</合计金额大写_财务核定>
            <申请人职位>${fsqrzw}</申请人职位>
            <报销人工号>${fbxrgh}</报销人工号>
            <TaskID></TaskID>
            <部门经理>${fbmjl}</部门经理>
            <分管领导>${ffgld}</分管领导>
            <财务审核人>${fcwshr}</财务审核人>
            <总经理>${fzjl}</总经理>
            <PS职位>${ps}</PS职位>
        </洁丽康公司_费用报销_主表>
                    `;
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `
       <洁丽康公司_费用报销_子表1>
            <RelationRowGuid>${i+1}</RelationRowGuid>
            <RowPrimaryKeys></RowPrimaryKeys>
            <序号>${i + 1}</序号>
            <费用项目>${mxlistArr[i].ffyxm}</费用项目>
            <金额>${mxlistArr[i].fje}</金额>
            <财务核定金额>${mxlistArr[i].fshje}</财务核定金额>
            <费用事由>${mxlistArr[i].ffysy}</费用事由>
        </洁丽康公司_费用报销_子表1>
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

    var fbxr = $("#fbxr").val();
    var fbxrbm = $("#fbxrbm").val();
    var fbxrq = $("#fbxrq").val();
    var fsqd = $("#fsqd").val();
    var fsqd_tid = $("#fsqd_tid").val();
    var fjkje = $("#fjkje").val();
    var fdjs = $("#fdjs").val();
    var fksrq = $("#fksrq").val();
    var fjsrq = $("#fksrq").val();
    var fhj = $("#fhj").val();
    var fhj_dx = $("#fhj_dx").val();
    var fhdhj = $("#fhdhj").val();
    var fhdhj_dx = $("#fhdhj_dx").val();
    var fsqrzw = $("#fsqrzw").val();
    var fbxrgh = $("#fbxrgh").val();
    var fbmjl = $("#fbmjl").val();
    var ffgld = $("#ffgld").val();
    var fcwshr = $("#fcwshr").val();
    var fzjl = $("#fzjl").val();
    var ps = $("#ps").val();

    if (!fsqd) {
        mui.toast('请选择费用支出计划申请单');
        return;
    }

    if (!fdjs) {
        mui.toast('请填写单据数');
        return;
    }
    if (!fksrq) {
        mui.toast('请选择开始日期');
        return;
    }
    if (!fjsrq) {
        mui.toast('请选择结束日期');
        return;
    }

    var mxflag = false;
    var mxlistArr = [];
    $("#mxlist").find("#mx").each(function () {
        var ffyxm = $(this).find("#ffyxm").val();
        var fje = $(this).find("#fje").val();
        var fshje = $(this).find("#fshje").val();
        var ffysy = $(this).find("#ffysy").val();
        var mx = new Mx(ffyxm, fje, fshje, ffysy);
        if (mx.check()) {
            mxflag = true;
            return;
        }
        mxlistArr.push(mx);
    });
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
 <洁丽康公司_费用报销_主表>
            <单号>${fbillno}</单号>
            <报销人>${fbxr}</报销人>
            <报销人部门>${fbxrbm}</报销人部门>
            <报销日期>${fbxrq}</报销日期>
            <费用支出计划申请单>${fsqd}</费用支出计划申请单>
            <费用支出计划申请>${fsqd_tid}</费用支出计划申请>
            <借款金额>${fjkje}</借款金额>
            <附件单据数>${fdjs}</附件单据数>
            <费用开始日期>${fksrq}</费用开始日期>
            <费用结束日期>${fjsrq}</费用结束日期>
            <合计金额>${fhj}</合计金额>
            <合计金额大写>${fhj_dx}</合计金额大写>
            <合计金额_财务核定>${fhdhj}</合计金额_财务核定>
            <合计金额大写_财务核定>${fhdhj_dx}</合计金额大写_财务核定>
            <申请人职位>${fsqrzw}</申请人职位>
            <报销人工号>${fbxrgh}</报销人工号>
            <TaskID>${$("#taskId").val()}</TaskID>
            <部门经理>${fbmjl}</部门经理>
            <分管领导>${ffgld}</分管领导>
            <财务审核人>${fcwshr}</财务审核人>
            <总经理>${fzjl}</总经理>
            <PS职位>${ps}</PS职位>
        </洁丽康公司_费用报销_主表>
                    `;
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `
       <洁丽康公司_费用报销_子表1>
            <RelationRowGuid>${i + 1}</RelationRowGuid>
            <RowPrimaryKeys></RowPrimaryKeys>
            <序号>${i + 1}</序号>
            <费用项目>${mxlistArr[i].ffyxm}</费用项目>
            <金额>${mxlistArr[i].fje}</金额>
            <财务核定金额>${mxlistArr[i].fshje}</财务核定金额>
            <费用事由>${mxlistArr[i].ffysy}</费用事由>
        </洁丽康公司_费用报销_子表1>
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

    var fbxr = $("#fbxr").val();
    var fbxrbm = $("#fbxrbm").val();
    var fbxrq = $("#fbxrq").val();
    var fsqd = $("#fsqd").val();
    var fsqd_tid = $("#fsqd_tid").val();
    var fjkje = $("#fjkje").val();
    var fdjs = $("#fdjs").val();
    var fksrq = $("#fksrq").val();
    var fjsrq = $("#fksrq").val();
    var fhj = $("#fhj").val();
    var fhj_dx = $("#fhj_dx").val();
    var fhdhj = $("#fhdhj").val();
    var fhdhj_dx = $("#fhdhj_dx").val();
    var fsqrzw = $("#fsqrzw").val();
    var fbxrgh = $("#fbxrgh").val();
    var fbmjl = $("#fbmjl").val();
    var ffgld = $("#ffgld").val();
    var fcwshr = $("#fcwshr").val();
    var fzjl = $("#fzjl").val();
    var ps = $("#ps").val();

    var mxflag = false;
    var mxlistArr = [];
    $("#mxlist").find("#mx").each(function () {
        var ffyxm = $(this).find("#ffyxm").val();
        var fje = $(this).find("#fje").val();
        var fshje = $(this).find("#fshje").val();
        var ffysy = $(this).find("#ffysy").val();
        var mx = new Mx(ffyxm, fje, fshje, ffysy);
      
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
 <洁丽康公司_费用报销_主表>
            <单号>${fbillno}</单号>
            <报销人>${fbxr}</报销人>
            <报销人部门>${fbxrbm}</报销人部门>
            <报销日期>${fbxrq}</报销日期>
            <费用支出计划申请单>${fsqd}</费用支出计划申请单>
            <费用支出计划申请>${fsqd_tid}</费用支出计划申请>
            <借款金额>${fjkje}</借款金额>
            <附件单据数>${fdjs}</附件单据数>
            <费用开始日期>${fksrq}</费用开始日期>
            <费用结束日期>${fjsrq}</费用结束日期>
            <合计金额>${fhj}</合计金额>
            <合计金额大写>${fhj_dx}</合计金额大写>
            <合计金额_财务核定>${fhdhj}</合计金额_财务核定>
            <合计金额大写_财务核定>${fhdhj_dx}</合计金额大写_财务核定>
            <申请人职位>${fsqrzw}</申请人职位>
            <报销人工号>${fbxrgh}</报销人工号>
            <TaskID>${$("#taskId").val()}</TaskID>
            <部门经理>${fbmjl}</部门经理>
            <分管领导>${ffgld}</分管领导>
            <财务审核人>${fcwshr}</财务审核人>
            <总经理>${fzjl}</总经理>
            <PS职位>${ps}</PS职位>
        </洁丽康公司_费用报销_主表>
                    `;
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `
       <洁丽康公司_费用报销_子表1>
            <RelationRowGuid>${i + 1}</RelationRowGuid>
            <RowPrimaryKeys>itemid=${itemidArr[i]}</RowPrimaryKeys>
            <序号>${i + 1}</序号>
            <费用项目>${mxlistArr[i].ffyxm}</费用项目>
            <金额>${mxlistArr[i].fje}</金额>
            <财务核定金额>${mxlistArr[i].fshje}</财务核定金额>
            <费用事由>${mxlistArr[i].ffysy}</费用事由>
        </洁丽康公司_费用报销_子表1>
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
 <洁丽康公司_费用报销_主表>
            <单号>${fbillno}</单号>
            <报销人>${fbxr}</报销人>
            <报销人部门>${fbxrbm}</报销人部门>
            <报销日期>${fbxrq}</报销日期>
            <费用支出计划申请单>${fsqd}</费用支出计划申请单>
            <费用支出计划申请>${fsqd_tid}</费用支出计划申请>
            <借款金额>${fjkje}</借款金额>
            <附件单据数>${fdjs}</附件单据数>
            <费用开始日期>${fksrq}</费用开始日期>
            <费用结束日期>${fjsrq}</费用结束日期>
            <合计金额>${fhj}</合计金额>
            <合计金额大写>${fhj_dx}</合计金额大写>
            <合计金额_财务核定>${fhdhj}</合计金额_财务核定>
            <合计金额大写_财务核定>${fhdhj_dx}</合计金额大写_财务核定>
            <申请人职位>${fsqrzw}</申请人职位>
            <报销人工号>${fbxrgh}</报销人工号>
            <TaskID>${$("#taskId").val()}</TaskID>
            <部门经理>${fbmjl}</部门经理>
            <分管领导>${ffgld}</分管领导>
            <财务审核人>${fcwshr}</财务审核人>
            <总经理>${fzjl}</总经理>
            <PS职位>${ps}</PS职位>
        </洁丽康公司_费用报销_主表>
                    `;
        for (var i = 0; i < mxlistArr.length; i++) {
            xml += `
       <洁丽康公司_费用报销_子表1>
            <RelationRowGuid>${i + 1}</RelationRowGuid>
            <RowPrimaryKeys>itemid=${itemidArr[i]}</RowPrimaryKeys>
            <序号>${i + 1}</序号>
            <费用项目>${mxlistArr[i].ffyxm}</费用项目>
            <金额>${mxlistArr[i].fje}</金额>
            <财务核定金额>${mxlistArr[i].fshje}</财务核定金额>
            <费用事由>${mxlistArr[i].ffysy}</费用事由>
        </洁丽康公司_费用报销_子表1>
                       `;
        }

        xml += `
                       </FormData>
                    </XForm>
                   `;
        PostXml(xml);
    }
}