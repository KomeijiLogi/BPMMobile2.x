function prepMsg() {
    $("#fsqrq").val(getNowFormatDate(2));
    tapEvent();
    var date = new Date();
    $("#fys_nian").val(date.getFullYear());
    $("#fys_yue").val(date.getMonth());

    var xml = `<?xml version= "1.0" ?>
                  <Requests>
                      <Params>
                      <Method>GetFormPostData</Method>
                      <ProcessName>集团本部通讯费用报销_新</ProcessName>
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
        $("#fbmmc").val(item.部门名称);
        $("#fsqrno").val(item.申请人编码);
        $("#fbmbm").val(item.部门编码);
        $("#fzwu").val(item.职务);


    }).fail(function (e) {


    }).then(function () {
        initList();
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
    showPicker('fgsmc', fgsmcdata);

    $("#fybxbz").on('input', function () {
        var value = parseFloat($(this).val());
        value = isNaN(value) ? 0 : value;
        var fndbxbz = value * 12;
        $("#fndbxbz").val(fndbxbz);
        $("#fbxbz").val(fndbxbz);
    });
    var date = new Date();
    var fyear_data = [
        {
            value: '',
            text: date.getFullYear()-1
        },
        {
            value: '',
            text: date.getFullYear()
        },
        {
            value: '',
            text: date.getFullYear()+1
        }
    ];

    var element22 = document.getElementById('fbxnd');

    var picker22 = new mui.PopPicker();

    picker22.setData(fyear_data);

    element22.addEventListener('tap', function () {

        picker22.show(function (items) {

            element22.value = items[0].text;
            watchYear();
        });

    }, false);


    var fzwlevel_data = [
        {
            value: '',
            text:'总监'
        },
        {
            value: '',
            text:'部门经理'
        },
        {
            value: '',
            text:'科员、主管'
        }
    ];
    showPicker('fzwjb', fzwlevel_data);

    var fmonth_data = [];
    for (var i = 0; i < 12; i++) {
        var obj = {
            value: '',
            text:i+1
        }
        fmonth_data.push(obj);
    }
    showPicker('fsqys', fmonth_data);

    $("#fbcbxje").on('input', function () {

        calc();
        var value = parseFloat($(this).val());
        value = isNaN(value) ? 0 : value;
        $("#fdxje").val(atoc(value));

    });
}
function calc() {
    var fbcbxje = parseFloat($("#fbcbxje").val());
    fbcbxje = isNaN(fbcbxje) ? 0 : fbcbxje;

    var fndbxbz = parseFloat($("#fndbxbz").val());
    fndbxbz = isNaN(fndbxbz) ? 0 : fndbxbz;

    var fbnljybx = parseFloat($("#fbnljybx").val());
    fbnljybx = isNaN(fbnljybx) ? 0 : fbnljybx;

    var p = formartNumber(parseFloat(((fbnljybx + fbcbxje - fndbxbz) / (fndbxbz == 0 ? 1 : fndbxbz)) * 100));
    if (p < 0) {
        $("#fcbz").val('0');
    } else {
        $("#fcbz").val(p);
    }
   
}

function initList() {
    var xml = `<?xml version= "1.0" ?>
                    <Requests>
                        <Params>
                            <DataSource>BPM_EXPENSE</DataSource>
                            <ID>p_集团本部通讯费报销</ID>
                            <Type>1</Type>
                            <Method>GetUserDataProcedure</Method>
                            <ProcedureName>p_集团本部通讯费报销</ProcedureName>
                            <Filter>
                               <dep>${$("#fbmbm").val()}</dep>
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
        var itemData = provideData.Tables[0].Rows[0];
        console.log(provideData);
        $("#fyydje").val(itemData.amt);
        $("#fkyyyje").val(itemData.amt_hz);
        $("#fyyysje").val(itemData.amt_yy);
        if (itemData.amt_hz > 0) {
            $("#ffysx").val('预算内');
            $("#fcysqk").val('未超支');
        } else {
            $("#ffysx").val('超预算');
            var p = formartNumber(parseFloat((itemData.amt_hz - itemData.amt) / (itemData.amt == 0 ? 1 : itemData.amt) * 100));
            $("#fcysqk").val(p);
        }
    }).fail(function (e) {

    });
}



function watchYear() {
    var xml = `<?xml version= "1.0" ?>
                    <Requests>
                        <Params>
                            <DataSource>BPM_EXPENSE</DataSource>
                            <ID>集团本部费用报销_年度</ID>
                            <Type>1</Type>
                            <Method>GetUserDataProcedure</Method>
                            <ProcedureName>集团本部费用报销_年度</ProcedureName>
                            <Filter>
                               <部门编码>${$("#fbmbm").val()}</部门编码>
                               <员工编码>${$("#fsqrno").val()}</员工编码>
                               <年>${$("#fbxnd").val()}</年>                
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
        var itemData = provideData.Tables[0].Rows;
        console.log(provideData);
        if (itemData.length == 0) {
            $("#fbnljybx").val('0');
        } else {
            $("#fbnljybx").val(itemData[0].报销金额);
        }
        

      }).fail(function (e) {

    });
}


function initData(data, flag) {
    var item = data.FormDataSet.集团本部通讯费报销[0];
    if (flag) {
        $("#taskId").val(item.taskid);
        $("#stepId").val(stepId);       
    }

    $("#fgsmc").val(item.公司名称);
    $("#fbmmc").val(item.部门名称);
    $("#fbmbm").val(item.部门编码);
    $("#fsqr").val(item.申请人);
    $("#fsqr").val(item.申请人编码);
    $("#fsqrq").val(FormatterTimeYMS(item.申请日期));
    $("#fzwei").val(item.职位);
    $("#fyydje").val(item.月度预算);
    $("#fys_nian").val(item.预算年);
    $("#fys_yue").val(item.预算月);
    $("#fkyyyje").val(item.可用预算);
    $("#fyyysje").val(item.已用预算);
    $("#ffysx").val(item.费用属性);
    $("#fm_a").val(item.金额a);
    $("#fm_b").val(item.金额b);
    $("#fcysqk").val(item.超预算情况);
    $("#fybxbz").val(item.月度报销标准);
    $("#fndbxbz").val(item.年度报销标准);
    $("#fbxnd").val(item.年);
    $("#fzwu").val(item.职务);
    $("#fbnljybx").val(item.已报销金额);
    $("#fbz").val(item.备注);
    $("#fzwjb").val(item.职务级别);
    $("#fsqys").val(item.申请月数);
    $("#fsjhm").val(item.手机号码);
    $("#fbxbz").val(item.报销标准);
    $("#fbcbxje").val(item.报销金额);
    $("#fcbz").val(item.超标准情况);
    $("#fdxje").val(item.报销金额大写);
    $("#fsqrq").val(item.时间区间);
    $("#if_verify").val(item.if_verify);
    $("#if_bx").val(item.if_bx);

}

function nodeControllerExp(nodeName) {
    if (String(nodeName).match('开始') != null) {
        tapEvent();
        $("#fybxbz,#fbz,#fsjhm,#fbcbxje,#fsqrq").removeAttr('readonly');
    }
}

function Save() {
    var fgsmc = $("#fgsmc").val();
    var fbmmc = $("#fbmmc").val();
    var fsqr = $("#fsqr").val();
    var fsqrq = $("#fsqrq").val();
    var fyydje = $("#fyydje").val();
    var fkyyyje = $("#fkyyyje").val();
    var fyyysje = $("#fyyysje").val();
    var ffysx = $("#ffysx").val();
    var fcysqk = $("#fcysqk").val();
    var fybxbz = $("#fybxbz").val();
    var fndbxbz = $("#fndbxbz").val();
    var fbxnd = $("#fbxnd").val();
    var fbnljybx = $("#fbnljybx").val();
    var fbz = $("#fbz").val();
    var fzwjb = $("#fzwjb").val();
    var fsqys = $("#fsqys").val();
    var fsjhm = $("#fsjhm").val();
    var fbxbz = $("#fbxbz").val();
    var fbcbxje = $("#fbcbxje").val();
    var fcbz = $("#fcbz").val();
    var fdxje = $("#fdxje").val();
    var fsqrq = $("#fsqrq").val();
    var fbmbm = $("#fbmbm").val();
    var fsqrno = $("#fsqrno").val();
    var fzwei = $("#fzwei").val();
    var fzwu = $("#fzwu").val();
    var if_verify = $("#if_verify").val();
    var if_bx = $("#if_bx").val();
    var fm_a = $("#fm_a").val();
    var fm_b = $("#fm_b").val();
    var fys_nian = $("#fys_nian").val();
    var fys_yue = $("#fys_yue").val();

    if (!fgsmc) {
        mui.toast('请选择公司名称');
        return;
    }
    if (!fybxbz) {
        mui.toast('请填写月报销标准');
        return;
    }
    if (!fbxnd) {
        mui.toast('请填写报销年度');
        return;
    }
    if (!fzwjb) {
        mui.toast('请填写职务级别');
        return;
    }
    if (!fsqys) {
        mui.toast('请填写申请月数');
        return;
    }
    if (!fsjhm) {
        mui.toast('请填写手机号码');
        return;
    }
    if (!fbcbxje) {
        mui.toast('请填写本次报销金额');
        return;
    }
    if (!fsqrq) {
        mui.toast('请填写申请期间');
        return;
    }
    var btnArry = ["取消", "确定"];
    mui.confirm('即将提交，是否确定？', '提交确认提醒', btnArry, function (e) {
        if (e.index == 1) {
            var xml = `<?xml version="1.0"?>
                        <XForm>
                            <Header>
                                <Method>Post</Method>
                                <ProcessName>集团本部通讯费用报销_新</ProcessName>
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
                        <集团本部通讯费报销>
            <公司名称>${fgsmc}</公司名称>
            <部门名称>${fbmmc}</部门名称>
            <部门编码>${fbmbm}</部门编码>
            <申请人>${fsqr}</申请人>
            <申请人编码>${fsqrno}</申请人编码>
            <申请日期>${fsqrq}</申请日期>
            <职位>${fzwei}</职位>
            <月度预算>${fyydje}</月度预算>
            <预算年>${fys_nian}</预算年>
            <预算月>${fys_yue}</预算月>
            <可用预算>${fkyyyje}</可用预算>
            <已用预算>${fyyysje}</已用预算>
            <费用属性>${ffysx}</费用属性>
            <金额a>${fm_a}</金额a>
            <金额b>${fm_b}</金额b>
            <超预算情况>${fcysqk}</超预算情况>
            <月度报销标准>${fybxbz}</月度报销标准>
            <年度报销标准>${fndbxbz}</年度报销标准>
            <年>${fbxnd}</年>
            <职务>${fzwu}</职务>
            <已报销金额>${fbnljybx}</已报销金额>
            <备注>${fbz}</备注>
            <职务级别>${fzwjb}</职务级别>
            <申请月数>${fsqys}</申请月数>
            <手机号码>${fsjhm}</手机号码>
            <报销标准>${fbxbz}</报销标准>
            <报销金额>${fbcbxje}</报销金额>
            <超标准情况>${fcbz}</超标准情况>
            <报销金额大写>${fdxje}</报销金额大写>
            <时间区间>${fsqrq}</时间区间>
            <if_verify>${if_verify}</if_verify>
            <if_bx>${if_bx}</if_bx>
       </集团本部通讯费报销>
                   `;
            xml += `
 </FormData>
</XForm>
                   `;
            PostXml(xml);

        }
    });
}

function reSave() {
   
    var pid = $("#stepId").val();

    var fgsmc = $("#fgsmc").val();
    var fbmmc = $("#fbmmc").val();
    var fsqr = $("#fsqr").val();
    var fsqrq = $("#fsqrq").val();
    var fyydje = $("#fyydje").val();
    var fkyyyje = $("#fkyyyje").val();
    var fyyysje = $("#fyyysje").val();
    var ffysx = $("#ffysx").val();
    var fcysqk = $("#fcysqk").val();
    var fybxbz = $("#fybxbz").val();
    var fndbxbz = $("#fndbxbz").val();
    var fbxnd = $("#fbxnd").val();
    var fbnljybx = $("#fbnljybx").val();
    var fbz = $("#fbz").val();
    var fzwjb = $("#fzwjb").val();
    var fsqys = $("#fsqys").val();
    var fsjhm = $("#fsjhm").val();
    var fbxbz = $("#fbxbz").val();
    var fbcbxje = $("#fbcbxje").val();
    var fcbz = $("#fcbz").val();
    var fdxje = $("#fdxje").val();
    var fsqrq = $("#fsqrq").val();
    var fbmbm = $("#fbmbm").val();
    var fsqrno = $("#fsqrno").val();
    var fzwei = $("#fzwei").val();
    var fzwu = $("#fzwu").val();
    var if_verify = $("#if_verify").val();
    var if_bx = $("#if_bx").val();
    var fm_a = $("#fm_a").val();
    var fm_b = $("#fm_b").val();
    var fys_nian = $("#fys_nian").val();
    var fys_yue = $("#fys_yue").val();

    if (!fgsmc) {
        mui.toast('请选择公司名称');
        return;
    }
    if (!fybxbz) {
        mui.toast('请填写月报销标准');
        return;
    }
    if (!fbxnd) {
        mui.toast('请填写报销年度');
        return;
    }
    if (!fzwjb) {
        mui.toast('请填写职务级别');
        return;
    }
    if (!fsqys) {
        mui.toast('请填写申请月数');
        return;
    }
    if (!fsjhm) {
        mui.toast('请填写手机号码');
        return;
    }
    if (!fbcbxje) {
        mui.toast('请填写本次报销金额');
        return;
    }
    if (!fsqrq) {
        mui.toast('请填写申请期间');
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
            xml += `
                        <集团本部通讯费报销>
            <公司名称>${fgsmc}</公司名称>
            <部门名称>${fbmmc}</部门名称>
            <部门编码>${fbmbm}</部门编码>
            <申请人>${fsqr}</申请人>
            <申请人编码>${fsqrno}</申请人编码>
            <申请日期>${fsqrq}</申请日期>
            <职位>${fzwei}</职位>
            <月度预算>${fyydje}</月度预算>
            <预算年>${fys_nian}</预算年>
            <预算月>${fys_yue}</预算月>
            <可用预算>${fkyyyje}</可用预算>
            <已用预算>${fyyysje}</已用预算>
            <费用属性>${ffysx}</费用属性>
            <金额a>${fm_a}</金额a>
            <金额b>${fm_b}</金额b>
            <超预算情况>${fcysqk}</超预算情况>
            <月度报销标准>${fybxbz}</月度报销标准>
            <年度报销标准>${fndbxbz}</年度报销标准>
            <年>${fbxnd}</年>
            <职务>${fzwu}</职务>
            <已报销金额>${fbnljybx}</已报销金额>
            <备注>${fbz}</备注>
            <职务级别>${fzwjb}</职务级别>
            <申请月数>${fsqys}</申请月数>
            <手机号码>${fsjhm}</手机号码>
            <报销标准>${fbxbz}</报销标准>
            <报销金额>${fbcbxje}</报销金额>
            <超标准情况>${fcbz}</超标准情况>
            <报销金额大写>${fdxje}</报销金额大写>
            <时间区间>${fsqrq}</时间区间>
            <if_verify>${if_verify}</if_verify>
            <if_bx>${if_bx}</if_bx>
       </集团本部通讯费报销>
                   `;
            xml += `
 </FormData>
</XForm>
                   `;
            PostXml(xml);
         
        }
    });
}

function AgreeOrConSign() {
    var pid = $("#stepId").val();
   
    var comment = $("#signSuggest").val();
    var nodeName = $("#nodeName").val();
    var fgsmc = $("#fgsmc").val();
    var fbmmc = $("#fbmmc").val();
    var fsqr = $("#fsqr").val();
    var fsqrq = $("#fsqrq").val();
    var fyydje = $("#fyydje").val();
    var fkyyyje = $("#fkyyyje").val();
    var fyyysje = $("#fyyysje").val();
    var ffysx = $("#ffysx").val();
    var fcysqk = $("#fcysqk").val();
    var fybxbz = $("#fybxbz").val();
    var fndbxbz = $("#fndbxbz").val();
    var fbxnd = $("#fbxnd").val();
    var fbnljybx = $("#fbnljybx").val();
    var fbz = $("#fbz").val();
    var fzwjb = $("#fzwjb").val();
    var fsqys = $("#fsqys").val();
    var fsjhm = $("#fsjhm").val();
    var fbxbz = $("#fbxbz").val();
    var fbcbxje = $("#fbcbxje").val();
    var fcbz = $("#fcbz").val();
    var fdxje = $("#fdxje").val();
    var fsqrq = $("#fsqrq").val();
    var fbmbm = $("#fbmbm").val();
    var fsqrno = $("#fsqrno").val();
    var fzwei = $("#fzwei").val();
    var fzwu = $("#fzwu").val();
    var if_verify = $("#if_verify").val();
    var if_bx = $("#if_bx").val();
    var fm_a = $("#fm_a").val();
    var fm_b = $("#fm_b").val();
    var fys_nian = $("#fys_nian").val();
    var fys_yue = $("#fys_yue").val();


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
                        <集团本部通讯费报销>
            <公司名称>${fgsmc}</公司名称>
            <部门名称>${fbmmc}</部门名称>
            <部门编码>${fbmbm}</部门编码>
            <申请人>${fsqr}</申请人>
            <申请人编码>${fsqrno}</申请人编码>
            <申请日期>${fsqrq}</申请日期>
            <职位>${fzwei}</职位>
            <月度预算>${fyydje}</月度预算>
            <预算年>${fys_nian}</预算年>
            <预算月>${fys_yue}</预算月>
            <可用预算>${fkyyyje}</可用预算>
            <已用预算>${fyyysje}</已用预算>
            <费用属性>${ffysx}</费用属性>
            <金额a>${fm_a}</金额a>
            <金额b>${fm_b}</金额b>
            <超预算情况>${fcysqk}</超预算情况>
            <月度报销标准>${fybxbz}</月度报销标准>
            <年度报销标准>${fndbxbz}</年度报销标准>
            <年>${fbxnd}</年>
            <职务>${fzwu}</职务>
            <已报销金额>${fbnljybx}</已报销金额>
            <备注>${fbz}</备注>
            <职务级别>${fzwjb}</职务级别>
            <申请月数>${fsqys}</申请月数>
            <手机号码>${fsjhm}</手机号码>
            <报销标准>${fbxbz}</报销标准>
            <报销金额>${fbcbxje}</报销金额>
            <超标准情况>${fcbz}</超标准情况>
            <报销金额大写>${fdxje}</报销金额大写>
            <时间区间>${fsqrq}</时间区间>
            <if_verify>${if_verify}</if_verify>
            <if_bx>${if_bx}</if_bx>
       </集团本部通讯费报销>
                   `;
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
                        <集团本部通讯费报销>
            <公司名称>${fgsmc}</公司名称>
            <部门名称>${fbmmc}</部门名称>
            <部门编码>${fbmbm}</部门编码>
            <申请人>${fsqr}</申请人>
            <申请人编码>${fsqrno}</申请人编码>
            <申请日期>${fsqrq}</申请日期>
            <职位>${fzwei}</职位>
            <月度预算>${fyydje}</月度预算>
            <预算年>${fys_nian}</预算年>
            <预算月>${fys_yue}</预算月>
            <可用预算>${fkyyyje}</可用预算>
            <已用预算>${fyyysje}</已用预算>
            <费用属性>${ffysx}</费用属性>
            <金额a>${fm_a}</金额a>
            <金额b>${fm_b}</金额b>
            <超预算情况>${fcysqk}</超预算情况>
            <月度报销标准>${fybxbz}</月度报销标准>
            <年度报销标准>${fndbxbz}</年度报销标准>
            <年>${fbxnd}</年>
            <职务>${fzwu}</职务>
            <已报销金额>${fbnljybx}</已报销金额>
            <备注>${fbz}</备注>
            <职务级别>${fzwjb}</职务级别>
            <申请月数>${fsqys}</申请月数>
            <手机号码>${fsjhm}</手机号码>
            <报销标准>${fbxbz}</报销标准>
            <报销金额>${fbcbxje}</报销金额>
            <超标准情况>${fcbz}</超标准情况>
            <报销金额大写>${fdxje}</报销金额大写>
            <时间区间>${fsqrq}</时间区间>
            <if_verify>${if_verify}</if_verify>
            <if_bx>${if_bx}</if_bx>
       </集团本部通讯费报销>
                   `;
        xml += `
 </FormData>
</XForm>
                   `;
        PostXml(xml);
    }
}