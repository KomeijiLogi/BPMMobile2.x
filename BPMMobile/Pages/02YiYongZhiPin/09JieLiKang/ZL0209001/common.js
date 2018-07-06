function prepMsg() {
    $("#fsqrq").val(getNowFormatDate(2));
    tapEvent();
    var xml = `<?xml version= "1.0" ?>
                  <Requests>
                      <Params>
                      <Method>GetFormPostData</Method>
                      <ProcessName>洁丽康公司原材料让步接收申请</ProcessName>
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


}

function initData(data, flag) {
    var item = data.FormDataSet.洁丽康公司_原材料让步接收申请[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.单号);
    }
    $("#fsqr").val(item.申请人);
    $("#fsqbm").val(item.申请部门);
    $("#fsqrq").val(FormatterTimeYMS(item.申请日期));
    $("#fcgjybgdh").val(item.采购检验报告单号);
    $("#fgys").val(item.供应商);
    $("#fwlbm").val(item.物料编码);
    $("#fwlmc").val(item.物料名称);
    $("#fggxh").val(item.规格型号);
    $("#fpc").val(item.批次);
    $("#frbjssl").val(item.让步接收数量);
    $("#fjybhgms").val(item.检验不合格描述);
    $("#fsqly").val(item.申请理由);
   

}

function nodeControllerExp(NodeName) {
    if (String(NodeName).match('开始') != null) {

        $("#fcgjybgdh,#fgys,#fwlbm,#fwlmc,#fggxh,#fpc,#frbjssl,#fjybhgms,#fsqly").removeAttr('readonly');

    }
}


function Save() {
    var fsqr = $("#fsqr").val();
    var fsqbm = $("#fsqbm").val();
    var fsqrq = $("#fsqrq").val();

    var fcgjybgdh = $("#fcgjybgdh").val();
    var fgys = $("#fgys").val();
    var fwlbm = $("#fwlbm").val();
    var fwlmc = $("#fwlmc").val();
    var fggxh = $("#fggxh").val();
    var fpc = $("#fpc").val();
    var frbjssl = $("#frbjssl").val();
    var fjybhgms = $("#fjybhgms").val();
    var fsqly = $("#fsqly").val();


    if (!fcgjybgdh) {
        mui.toast('请填写采购检验报告单号');
        return;
    }

    if (!fgys) {
        mui.toast('请填写供应商');
        return;
    }
    if (!fwlbm) {
        mui.toast('请填写物料编码');
        return;
    }
    if (!fpc) {
        mui.toast('请填写批次');
        return;
    }
    if (!frbjssl) {
        mui.toast('请填写让步接收数量');
        return;
    }
    if (!fjybhgms) {
        mui.toast('请填写检验不合格描述');
        return;
    }
    if (!fsqly) {
        mui.toast('请填写申请理由');
        return;
    }

    var btnArry = ["取消", "确定"];
    mui.confirm('即将提交，是否确定？', '提交确认提醒', btnArry, function (e) {
        if (e.index == 1) {
            var xml = `<?xml version="1.0"?>
                        <XForm>
                            <Header>
                                <Method>Post</Method>
                                <ProcessName>洁丽康公司原材料让步接收申请</ProcessName>
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
       <洁丽康公司_原材料让步接收申请>
            <单号>自动生成</单号>
            <申请人>${fsqr}</申请人>
            <申请部门>${fsqbm}</申请部门>
            <申请日期>${fsqrq}</申请日期>
            <采购检验报告单号>${fcgjybgdh}</采购检验报告单号>
            <供应商>${fgys}</供应商>
            <物料编码>${fwlbm}</物料编码>
            <物料名称>${fwlmc}</物料名称>
            <规格型号>${fggxh}</规格型号>
            <批次>${fpc}</批次>
            <数量>${frbjssl}</数量>
            <检验不合格描述>${fjybhgms}</检验不合格描述>
            <申请理由>${fsqly}</申请理由>
        </洁丽康公司_原材料让步接收申请>
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
    var fbillno = $("#fbillno").val();
    var pid = $("#stepId").val();


    var fsqr = $("#fsqr").val();
    var fsqbm = $("#fsqbm").val();
    var fsqrq = $("#fsqrq").val();

    var fcgjybgdh = $("#fcgjybgdh").val();
    var fgys = $("#fgys").val();
    var fwlbm = $("#fwlbm").val();
    var fwlmc = $("#fwlmc").val();
    var fggxh = $("#fggxh").val();
    var fpc = $("#fpc").val();
    var frbjssl = $("#frbjssl").val();
    var fjybhgms = $("#fjybhgms").val();
    var fsqly = $("#fsqly").val();


    if (!fcgjybgdh) {
        mui.toast('请填写采购检验报告单号');
        return;
    }

    if (!fgys) {
        mui.toast('请填写供应商');
        return;
    }
    if (!fwlbm) {
        mui.toast('请填写物料编码');
        return;
    }
    if (!fpc) {
        mui.toast('请填写批次');
        return;
    }
    if (!frbjssl) {
        mui.toast('请填写让步接收数量');
        return;
    }
    if (!fjybhgms) {
        mui.toast('请填写检验不合格描述');
        return;
    }
    if (!fsqly) {
        mui.toast('请填写申请理由');
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
       <洁丽康公司_原材料让步接收申请>
            <单号>${fbillno}</单号>
            <申请人>${fsqr}</申请人>
            <申请部门>${fsqbm}</申请部门>
            <申请日期>${fsqrq}</申请日期>
            <采购检验报告单号>${fcgjybgdh}</采购检验报告单号>
            <供应商>${fgys}</供应商>
            <物料编码>${fwlbm}</物料编码>
            <物料名称>${fwlmc}</物料名称>
            <规格型号>${fggxh}</规格型号>
            <批次>${fpc}</批次>
            <数量>${frbjssl}</数量>
            <检验不合格描述>${fjybhgms}</检验不合格描述>
            <申请理由>${fsqly}</申请理由>
        </洁丽康公司_原材料让步接收申请>
                    `;

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

    var fcgjybgdh = $("#fcgjybgdh").val();
    var fgys = $("#fgys").val();
    var fwlbm = $("#fwlbm").val();
    var fwlmc = $("#fwlmc").val();
    var fggxh = $("#fggxh").val();
    var fpc = $("#fpc").val();
    var frbjssl = $("#frbjssl").val();
    var fjybhgms = $("#fjybhgms").val();
    var fsqly = $("#fsqly").val();


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
       <洁丽康公司_原材料让步接收申请>
            <单号>${fbillno}</单号>
            <申请人>${fsqr}</申请人>
            <申请部门>${fsqbm}</申请部门>
            <申请日期>${fsqrq}</申请日期>
            <采购检验报告单号>${fcgjybgdh}</采购检验报告单号>
            <供应商>${fgys}</供应商>
            <物料编码>${fwlbm}</物料编码>
            <物料名称>${fwlmc}</物料名称>
            <规格型号>${fggxh}</规格型号>
            <批次>${fpc}</批次>
            <数量>${frbjssl}</数量>
            <检验不合格描述>${fjybhgms}</检验不合格描述>
            <申请理由>${fsqly}</申请理由>
        </洁丽康公司_原材料让步接收申请>
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
       <洁丽康公司_原材料让步接收申请>
            <单号>${fbillno}</单号>
            <申请人>${fsqr}</申请人>
            <申请部门>${fsqbm}</申请部门>
            <申请日期>${fsqrq}</申请日期>
            <采购检验报告单号>${fcgjybgdh}</采购检验报告单号>
            <供应商>${fgys}</供应商>
            <物料编码>${fwlbm}</物料编码>
            <物料名称>${fwlmc}</物料名称>
            <规格型号>${fggxh}</规格型号>
            <批次>${fpc}</批次>
            <数量>${frbjssl}</数量>
            <检验不合格描述>${fjybhgms}</检验不合格描述>
            <申请理由>${fsqly}</申请理由>
        </洁丽康公司_原材料让步接收申请>
                    `;

        xml += `
                       </FormData>
                    </XForm>
                   `;
        PostXml(xml);
    }
}