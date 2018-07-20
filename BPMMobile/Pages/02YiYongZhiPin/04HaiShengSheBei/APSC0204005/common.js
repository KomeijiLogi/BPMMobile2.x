function prepMsg() {
    tapEvent();

    $("#fhdsj").val(getNowFormatDate(2));

    var xml = `<?xml version= "1.0" ?>
                  <Requests>
                      <Params>
                      <Method>GetFormPostData</Method>
                      <ProcessName>爱普公司市场活动申请</ProcessName>
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


    }).fail(function (e) {

    }).then(function () {

    });
}

function tapEvent() {

    $('body').on('input', 'input[type="number"]', function () {
        calcTotal();
    });
}

function calcTotal() {


    var total = 0;


    var fzwf = parseFloat($("#fzwf").val());
    fzwf = isNaN(fzwf) ? 0 : fzwf;

    var fjsf = parseFloat($("#fjsf").val());
    fjsf = isNaN(fjsf) ? 0 : fjsf;

    var fzzf = parseFloat($("#fzzf").val());
    fzzf = isNaN(fzzf) ? 0 : fzzf;

    var fhwf = parseFloat($("#fhwf").val());
    fhwf = isNaN(fhwf) ? 0 : fhwf;

    var fyqf = parseFloat($("#fyqf").val());
    fyqf = isNaN(fyqf) ? 0 : fyqf;

    var flpf = parseFloat($("#flpf").val());
    flpf = isNaN(flpf) ? 0 : flpf;

    var fcxf = parseFloat($("#fcxf").val());
    fcxf = isNaN(fcxf) ? 0 : fcxf;

    var fqtf = parseFloat($("#fqtf").val());
    fqtf = isNaN(fqtf) ? 0 : fqtf;


    total = fzwf + fjsf + fzzf + fhwf + fyqf + flpf + fcxf + fqtf - 0;
    $("#fhj").val(total);
    $("#fhj_dz").val(atoc(total));



}

function initData(data, flag) {

    var item = data.FormDataSet.爱普公司_市场活动申请表[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.单号);
    }

    $("#fhdmc").val(item.活动名称);
    $("#fsqr").val(item.申请人);
    $("#fhdsj").val(item.活动时间);
    $("#fhdxz").val(item.活动性质);
    $("#fchryjg").val(item.参会人员结构);

    $("#fchrs").val(item.参会人数);
    $("#fzbdw").val(item.主办单位);
    $("#fcbdw").val(item.承办单位);
    $("#fhddd").val(item.活动地点);
    $("#fjkry").val(item.讲课人员);
    $("#fgscjry").val(item.公司参加人员);
    $("#fmd").val(item.目的);
    $("#fzwf").val(item.展位费);
    $("#fzwf_bz").val(item.展位费明细);
    $("#fjsf").val(item.讲师费);
    $("#fjsf_bz").val(item.讲师费明细);
    $("#fzzf").val(item.赞助费);
    $("#fzzf_bz").val(item.赞助费明细);
    $("#fhwf").val(item.会务费);
    $("#fhwf_bz").val(item.会务费明细);
    $("#fyqf").val(item.宴请费);
    $("#fyqf_bz").val(item.宴请费明细);
    $("#flpf").val(item.礼品费);
    $("#flpf_bz").val(item.礼品费明细);
    $("#fcxf").val(item.茶歇费);
    $("#fcxf_bz").val(item.茶歇费明细);
    $("#fqtf").val(item.其它费用);
    $("#fqtf_bz").val(item.其它费用明细);
    $("#fhj").val(item.费用合计);
    $("#fhj_dz").val(item.费用合计大写);
    $("#fsxwp").val(item.所需物品);



}

function nodeControllerExp(nodeName) {

    if (String(nodeName).match('开始') != null) {

        tapEvent();

        $("#fhdmc,#fhdsj,#fhdxz,#fchryjg,#fchrs,#fzbdw,#fcbdw,#fhddd,#fjkry,#fgscjry",
            "#fmd", '#fzwf', '#fzwf_bz', '#fjsf', '#fjsf_bz', '#fzzf', '#fzzf_bz',
            '#fhwf', '#fhwf_bz', '#fyqf', '#fyqf_bz', '#flpf', '#flpf_bz', '#fcxf',
            '#fcxf_bz', '#fqtf', '#fqtf_bz', '#fhj', '#fhj_dz','#fsxwp'
        ).removeAttr('readonly');

    }

}


function Save() {

    var fhdmc = $("#fhdmc").val();
    var fsqr = $("#fsqr").val();
    var fhdsj = $("#fhdsj").val();
    var fhdxz = $("#fhdxz").val();
    var fchryjg = $("#fchryjg").val();
    var fchrs = $("#fchrs").val();
    var fzbdw = $("#fzbdw").val();

    var fcbdw = $("#fcbdw").val();
    var fhddd = $("#fhddd").val();
    var fjkry = $("#fjkry").val();
    var fgscjry = $("#fgscjry").val();
    var fmd = $("#fmd").val();
    var fzwf = $("#fzwf").val();
    var fzwf_bz = $("#fzwf_bz").val();
    var fjsf = $("#fjsf").val();
    var fjsf_bz = $("#fjsf_bz").val();
    var fzzf = $("#fzzf").val();
    var fzzf_bz = $("#fzzf_bz").val();
    var fhwf = $("#fhwf").val();
    var fhwf_bz = $("#fhwf_bz").val();
    var fyqf = $("#fyqf").val();
    var fyqf_bz = $("#fyqf_bz").val();
    var flpf = $("#flpf").val();
    var flpf_bz = $("#flpf_bz").val();
    var fcxf = $("#fcxf").val();
    var fcxf_bz = $("#fcxf_bz").val();
    var fqtf = $("#fqtf").val();
    var fqtf_bz = $("#fqtf_bz").val();
    var fhj = $("#fhj").val();
    var fhj_dz = $("#fhj_dz").val();
    var fsxwp = $("#fsxwp").val();


    if (!fhdmc) {
        mui.toast('请填写活动名称');
        return;
    }
    if (!fmd) {
        mui.toast('请填写目的');
        return;
    }
    var btnArry = ["取消", "确定"];
    mui.confirm('即将提交，是否确定？', '提交确认提醒', btnArry, function (e) {
        if (e.index == 1) {
            var xml = `<?xml version="1.0"?>
                        <XForm>
                            <Header>
                                <Method>Post</Method>
                                <ProcessName>爱普公司市场活动申请</ProcessName>
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
<爱普公司_市场活动申请表>
            <单号>自动生成</单号>
            <活动名称>${fhdmc}</活动名称>
            <申请人>${fsqr}</申请人>
            <活动性质>${fhdxz}</活动性质>
            <参会人员结构>${fchryjg}</参会人员结构>
            <参会人数>${fchrs}</参会人数>
            <主办单位>${fzbdw}</主办单位>
            <承办单位>${fcbdw}</承办单位>
            <活动地点>${fhddd}</活动地点>
            <讲课人员>${fjkry}</讲课人员>
            <公司参加人员>${fgscjry}</公司参加人员>
            <目的>${fmd}</目的>
            <展位费>${fzwf}</展位费>
            <展位费明细>${fzwf_bz}</展位费明细>
            <所需物品>${fsxwp}</所需物品>
            <讲师费>${fjsf}</讲师费>
            <讲师费明细>${fjsf_bz}</讲师费明细>
            <赞助费>${fzzf}</赞助费>
            <赞助费明细>${fzzf_bz}</赞助费明细>
            <会务费>${fhwf}</会务费>
            <会务费明细>${fhwf_bz}</会务费明细>
            <宴请费>${fyqf}</宴请费>
            <宴请费明细>${fyqf_bz}</宴请费明细>
            <礼品费>${flpf}</礼品费>
            <礼品费明细>${flpf_bz}</礼品费明细>
            <茶歇费>${fcxf}</茶歇费>
            <茶歇费明细>${fcxf_bz}</茶歇费明细>
            <其它费用>${fqtf}</其它费用>
            <其它费用明细>${fqtf_bz}</其它费用明细>
            <费用合计>${fhj}</费用合计>
            <费用合计大写>${fhj_dz}</费用合计大写>
        </爱普公司_市场活动申请表>
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

    var fhdmc = $("#fhdmc").val();
    var fsqr = $("#fsqr").val();
    var fhdsj = $("#fhdsj").val();
    var fhdxz = $("#fhdxz").val();
    var fchryjg = $("#fchryjg").val();
    var fchrs = $("#fchrs").val();
    var fzbdw = $("#fzbdw").val();

    var fcbdw = $("#fcbdw").val();
    var fhddd = $("#fhddd").val();
    var fjkry = $("#fjkry").val();
    var fgscjry = $("#fgscjry").val();
    var fmd = $("#fmd").val();
    var fzwf = $("#fzwf").val();
    var fzwf_bz = $("#fzwf_bz").val();
    var fjsf = $("#fjsf").val();
    var fjsf_bz = $("#fjsf_bz").val();
    var fzzf = $("#fzzf").val();
    var fzzf_bz = $("#fzzf_bz").val();
    var fhwf = $("#fhwf").val();
    var fhwf_bz = $("#fhwf_bz").val();
    var fyqf = $("#fyqf").val();
    var fyqf_bz = $("#fyqf_bz").val();
    var flpf = $("#flpf").val();
    var flpf_bz = $("#flpf_bz").val();
    var fcxf = $("#fcxf").val();
    var fcxf_bz = $("#fcxf_bz").val();
    var fqtf = $("#fqtf").val();
    var fqtf_bz = $("#fqtf_bz").val();
    var fhj = $("#fhj").val();
    var fhj_dz = $("#fhj_dz").val();
    var fsxwp = $("#fsxwp").val();


    if (!fhdmc) {
        mui.toast('请填写活动名称');
        return;
    }
    if (!fmd) {
        mui.toast('请填写目的');
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
<爱普公司_市场活动申请表>
            <单号>${fbillno}</单号>
            <活动名称>${fhdmc}</活动名称>
            <申请人>${fsqr}</申请人>
            <活动性质>${fhdxz}</活动性质>
            <参会人员结构>${fchryjg}</参会人员结构>
            <参会人数>${fchrs}</参会人数>
            <主办单位>${fzbdw}</主办单位>
            <承办单位>${fcbdw}</承办单位>
            <活动地点>${fhddd}</活动地点>
            <讲课人员>${fjkry}</讲课人员>
            <公司参加人员>${fgscjry}</公司参加人员>
            <目的>${fmd}</目的>
            <展位费>${fzwf}</展位费>
            <展位费明细>${fzwf_bz}</展位费明细>
            <所需物品>${fsxwp}</所需物品>
            <讲师费>${fjsf}</讲师费>
            <讲师费明细>${fjsf_bz}</讲师费明细>
            <赞助费>${fzzf}</赞助费>
            <赞助费明细>${fzzf_bz}</赞助费明细>
            <会务费>${fhwf}</会务费>
            <会务费明细>${fhwf_bz}</会务费明细>
            <宴请费>${fyqf}</宴请费>
            <宴请费明细>${fyqf_bz}</宴请费明细>
            <礼品费>${flpf}</礼品费>
            <礼品费明细>${flpf_bz}</礼品费明细>
            <茶歇费>${fcxf}</茶歇费>
            <茶歇费明细>${fcxf_bz}</茶歇费明细>
            <其它费用>${fqtf}</其它费用>
            <其它费用明细>${fqtf_bz}</其它费用明细>
            <费用合计>${fhj}</费用合计>
            <费用合计大写>${fhj_dz}</费用合计大写>
        </爱普公司_市场活动申请表>
                   `;
            xml += `
                       </FormData>
                    </XForm>
                   `;
            PostXml(xml);
        }
    })

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


    var fhdmc = $("#fhdmc").val();
    var fsqr = $("#fsqr").val();
    var fhdsj = $("#fhdsj").val();
    var fhdxz = $("#fhdxz").val();
    var fchryjg = $("#fchryjg").val();
    var fchrs = $("#fchrs").val();
    var fzbdw = $("#fzbdw").val();

    var fcbdw = $("#fcbdw").val();
    var fhddd = $("#fhddd").val();
    var fjkry = $("#fjkry").val();
    var fgscjry = $("#fgscjry").val();
    var fmd = $("#fmd").val();
    var fzwf = $("#fzwf").val();
    var fzwf_bz = $("#fzwf_bz").val();
    var fjsf = $("#fjsf").val();
    var fjsf_bz = $("#fjsf_bz").val();
    var fzzf = $("#fzzf").val();
    var fzzf_bz = $("#fzzf_bz").val();
    var fhwf = $("#fhwf").val();
    var fhwf_bz = $("#fhwf_bz").val();
    var fyqf = $("#fyqf").val();
    var fyqf_bz = $("#fyqf_bz").val();
    var flpf = $("#flpf").val();
    var flpf_bz = $("#flpf_bz").val();
    var fcxf = $("#fcxf").val();
    var fcxf_bz = $("#fcxf_bz").val();
    var fqtf = $("#fqtf").val();
    var fqtf_bz = $("#fqtf_bz").val();
    var fhj = $("#fhj").val();
    var fhj_dz = $("#fhj_dz").val();
    var fsxwp = $("#fsxwp").val();


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
<爱普公司_市场活动申请表>
            <单号>${fbillno}</单号>
            <活动名称>${fhdmc}</活动名称>
            <申请人>${fsqr}</申请人>
            <活动性质>${fhdxz}</活动性质>
            <参会人员结构>${fchryjg}</参会人员结构>
            <参会人数>${fchrs}</参会人数>
            <主办单位>${fzbdw}</主办单位>
            <承办单位>${fcbdw}</承办单位>
            <活动地点>${fhddd}</活动地点>
            <讲课人员>${fjkry}</讲课人员>
            <公司参加人员>${fgscjry}</公司参加人员>
            <目的>${fmd}</目的>
            <展位费>${fzwf}</展位费>
            <展位费明细>${fzwf_bz}</展位费明细>
            <所需物品>${fsxwp}</所需物品>
            <讲师费>${fjsf}</讲师费>
            <讲师费明细>${fjsf_bz}</讲师费明细>
            <赞助费>${fzzf}</赞助费>
            <赞助费明细>${fzzf_bz}</赞助费明细>
            <会务费>${fhwf}</会务费>
            <会务费明细>${fhwf_bz}</会务费明细>
            <宴请费>${fyqf}</宴请费>
            <宴请费明细>${fyqf_bz}</宴请费明细>
            <礼品费>${flpf}</礼品费>
            <礼品费明细>${flpf_bz}</礼品费明细>
            <茶歇费>${fcxf}</茶歇费>
            <茶歇费明细>${fcxf_bz}</茶歇费明细>
            <其它费用>${fqtf}</其它费用>
            <其它费用明细>${fqtf_bz}</其它费用明细>
            <费用合计>${fhj}</费用合计>
            <费用合计大写>${fhj_dz}</费用合计大写>
        </爱普公司_市场活动申请表>
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
<爱普公司_市场活动申请表>
            <单号>${fbillno}</单号>
            <活动名称>${fhdmc}</活动名称>
            <申请人>${fsqr}</申请人>
            <活动性质>${fhdxz}</活动性质>
            <参会人员结构>${fchryjg}</参会人员结构>
            <参会人数>${fchrs}</参会人数>
            <主办单位>${fzbdw}</主办单位>
            <承办单位>${fcbdw}</承办单位>
            <活动地点>${fhddd}</活动地点>
            <讲课人员>${fjkry}</讲课人员>
            <公司参加人员>${fgscjry}</公司参加人员>
            <目的>${fmd}</目的>
            <展位费>${fzwf}</展位费>
            <展位费明细>${fzwf_bz}</展位费明细>
            <所需物品>${fsxwp}</所需物品>
            <讲师费>${fjsf}</讲师费>
            <讲师费明细>${fjsf_bz}</讲师费明细>
            <赞助费>${fzzf}</赞助费>
            <赞助费明细>${fzzf_bz}</赞助费明细>
            <会务费>${fhwf}</会务费>
            <会务费明细>${fhwf_bz}</会务费明细>
            <宴请费>${fyqf}</宴请费>
            <宴请费明细>${fyqf_bz}</宴请费明细>
            <礼品费>${flpf}</礼品费>
            <礼品费明细>${flpf_bz}</礼品费明细>
            <茶歇费>${fcxf}</茶歇费>
            <茶歇费明细>${fcxf_bz}</茶歇费明细>
            <其它费用>${fqtf}</其它费用>
            <其它费用明细>${fqtf_bz}</其它费用明细>
            <费用合计>${fhj}</费用合计>
            <费用合计大写>${fhj_dz}</费用合计大写>
        </爱普公司_市场活动申请表>
                   `;
        xml += `
                       </FormData>
                    </XForm>
                   `;
        PostXml(xml);
    }
}



