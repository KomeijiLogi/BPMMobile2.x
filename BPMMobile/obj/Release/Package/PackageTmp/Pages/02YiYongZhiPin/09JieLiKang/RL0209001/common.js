function prepMsg() {
    $("#fdate").val(getNowFormatDate(2));
    tapEvent();
    var xml = `<?xml version= "1.0" ?>
                  <Requests>
                      <Params>
                      <Method>GetFormPostData</Method>
                      <ProcessName>洁丽康公司员工试用期转正申请</ProcessName>
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
        $("#fno").val(item.工号);
        $("#fname").val(item.姓名);
             
        }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
        if (XMLHttpRequest.status == "401") {
            mui.alert('授权过期，请重新打开页面');;
        } else if (XMLHttpRequest.status == "500") {
            mui.alert('服务器内部错误');
         }
    }).then((data) => {
        getPerInfo();
    });
}

function tapEvent() {
    var option = { "type": "date", "beginYear": new Date().getFullYear(), "endYear": new Date().getFullYear() + 3 };
    
    var picker = new mui.DtPicker(option);
    $("#fsqzzsj").on('tap', () => {
        picker.show(function (rs) {
            $("#fsqzzsj").val(rs.text);
        });
    });
}



function tapEventZJ() {
    var fyjdata = [
        {
            value: '',
            text:'同意转正'
        },
        {
            value: '',
            text:'不同意转正'
        },
        {
            value: '',
            text:'延长试用期'
        }
    ];

    var element = document.getElementById('fzzyj');

    var picker = new mui.PopPicker();

    picker.setData(fyjdata);

    element.addEventListener('tap', function () {

        picker.show(function (items) {

            element.value = items[0].text;
            if (items[0].text == '延长试用期') {
                $("#fyczzq").removeAttr('readonly');
            } else {
                $("#fyczzq").attr('readonly');
            }
        });

    }, false);
}

function getPerInfo() {
    var fno = $("#fno").val();
    var xml = `<?xml version= "1.0" ?>
                <Requests>
                 <Params>
                  <DataSource>PS</DataSource>
                   <ID>erpcloud_公用_获取个人信息</ID>
                   <Type>1</Type>
                   <Method>GetUserDataProcedure</Method>
                   <ProcedureName>erpcloud_公用_获取个人信息</ProcedureName>
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
      
        var pInfo = provideData.Tables[0].Rows[0];
        console.log(pInfo);
        $("#fssjt").val(pInfo.fssgroup);
        $("#fssgs").val(pInfo.fsscompany);
        $("#fbm").val(pInfo.fdeptname);
        $("#fzw").val(pInfo.zhiwei);
        if (pInfo.SEX == 'M') {
            $("#fxb").val('男');
        } else {
            $("#fxb").val('女');
        }
        $("#fcsrq").val(FormatterTime_Y_M_S(pInfo.BIRTHDATE.year, pInfo.BIRTHDATE.month, pInfo.BIRTHDATE.day));
        $("#fsfzh").val(pInfo.NATIONAL_ID);
        $("#flxdh").val(pInfo.PHONE);
        $("#fzgxl").val(pInfo.JPM_DESCR90);
        $("#fbyyx").val(pInfo.HPS_VALUE01);
        $("#fzy").val(pInfo.HPS_VALUE02);
        $("#fbysj").val(FormatterTime_Y_M_S(pInfo.HPS_DATE01.year, pInfo.HPS_DATE01.month, pInfo.HPS_DATE01.day));
        $("#frzsj").val(FormatterTime_Y_M_S(pInfo.HIRE_DT.year, pInfo.HIRE_DT.month, pInfo.HIRE_DT.day));


    }).fail(function (e) {

    });

}

function initData(data, flag) {
    var item = data.FormDataSet.洁丽康公司_员工转正申请_主表[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.fbillno);
       

    }
    $("#fno").val(item.工号);
    $("#fname").val(item.姓名);
    $("#fssjt").val(item.所属集团);
    $("#fssgs").val(item.所属公司);
    $("#fbm").val(item.部门);
    $("#fzw").val(item.职位);
    $("#fxb").val(item.性别);
    $("#fcsrq").val(FormatterTimeYMS(item.出生日期));
    $("#fsfzh").val(item.身份证号);
    $("#flxdh").val(item.联系电话);
    $("#fzgxl").val(item.最高学历);
    $("#fbyyx").val(item.毕业院校);
    $("#fzy").val(item.专业);
    $("#fbysj").val(FormatterTimeYMS(item.毕业时间));
    $("#frzsj").val(FormatterTimeYMS(item.入职日期));
    $("#fsqzzsj").val(FormatterTimeYMS(item.申请转正日期));
    $("#fzwpj").val(item.自我评价);
    $("#fzzyj").val(item.转正意见);
    $("#fyczzq").val(item.延长时间);
}


function nodeControllerExp(NodeName) {
    if (String(NodeName).match('开始') != null) {
        tapEvent();

    } else if (String(NodeName).match('直接上级') != null){
        tapEventZJ();
    }
}

function Save() {

    var fno = $("#fno").val();
    var fname = $("#fname").val();
    var fdate = $("#fdate").val();
    var fssjt = $("#fssjt").val();
    var fssgs = $("#fssgs").val();
    var fbm = $("#fbm").val();
    var fzw = $("#fzw").val();
    var fxb = $("#fxb").val();
    var fcsrq = $("#fcsrq").val();
    var fsfzh = $("#fsfzh").val();
    var flxdh = $("#flxdh").val();
    var fzgxl = $("#fzgxl").val();
    var fbyyx = $("#fbyyx").val();
    var fzy = $("#fzy").val();
    var fbysj = $("#fbysj").val();
    var frzsj = $("#frzsj").val();
    var fsqzzsj = $("#fsqzzsj").val();
    var fzwpj = $("#fzwpj").val();
    var fzzyj = $("#fzzyj").val();
    var fyczzq = $("#fyczzq").val();


    if (!fsqzzsj) {
        mui.toast('请选择申请转正时间');
        return;
    }
    if (!fzwpj) {
        mui.toast('请填写自我评价');
        return;
    }
    var btnArry = ["取消", "确定"];
    mui.confirm('即将提交，是否确定？', '提交确认提醒', btnArry, function (e) {
        if (e.index == 1) {
            var xml = `<?xml version="1.0"?>
                        <XForm>
                            <Header>
                                <Method>Post</Method>
                                <ProcessName>洁丽康公司员工试用期转正申请</ProcessName>
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
                     <洁丽康公司_员工转正申请_主表>
                        <单号>自动生成</单号>
                        <工号>${fno}</工号>
                        <姓名>${fname}</姓名>
                        <申请日期>${fdate}</申请日期>
                        <所属集团>${fssjt}</所属集团>
                        <所属公司>${fssgs}</所属公司>
                        <部门>${fbm}</部门>
                        <职位>${fzw}</职位>
                        <性别>${fxb}</性别>
                        <出生日期>${fcsrq}</出生日期>
                        <身份证号>${fsfzh}</身份证号>
                        <联系电话>${flxdh}</联系电话>
                        <最高学历>${fzgxl}</最高学历>
                        <毕业院校>${fbyyx}</毕业院校>
                        <专业>${fzy}</专业>
                        <毕业时间>${fbysj}</毕业时间>
                        <入职日期>${frzsj}</入职日期>
                        <申请转正日期>${fsqzzsj}</申请转正日期>
                        <自我评价>${fzwpj}</自我评价>
                        <转正意见>${fzzyj}</转正意见>
                        <延长时间>${fyczzq}</延长时间>
                    </洁丽康公司_员工转正申请_主表>
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

    var fno = $("#fno").val();
    var fname = $("#fname").val();
    var fdate = $("#fdate").val();
    var fssjt = $("#fssjt").val();
    var fssgs = $("#fssgs").val();
    var fbm = $("#fbm").val();
    var fzw = $("#fzw").val();
    var fxb = $("#fxb").val();
    var fcsrq = $("#fcsrq").val();
    var fsfzh = $("#fsfzh").val();
    var flxdh = $("#flxdh").val();
    var fzgxl = $("#fzgxl").val();
    var fbyyx = $("#fbyyx").val();
    var fzy = $("#fzy").val();
    var fbysj = $("#fbysj").val();
    var frzsj = $("#frzsj").val();
    var fsqzzsj = $("#fsqzzsj").val();
    var fzwpj = $("#fzwpj").val();
    var fzzyj = $("#fzzyj").val();
    var fyczzq = $("#fyczzq").val();


    if (!fsqzzsj) {
        mui.toast('请选择申请转正时间');
        return;
    }
    if (!fzwpj) {
        mui.toast('请填写自我评价');
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
                     <洁丽康公司_员工转正申请_主表>
                        <单号>${fbillno}</单号>
                        <工号>${fno}</工号>
                        <姓名>${fname}</姓名>
                        <申请日期>${fdate}</申请日期>
                        <所属集团>${fssjt}</所属集团>
                        <所属公司>${fssgs}</所属公司>
                        <部门>${fbm}</部门>
                        <职位>${fzw}</职位>
                        <性别>${fxb}</性别>
                        <出生日期>${fcsrq}</出生日期>
                        <身份证号>${fsfzh}</身份证号>
                        <联系电话>${flxdh}</联系电话>
                        <最高学历>${fzgxl}</最高学历>
                        <毕业院校>${fbyyx}</毕业院校>
                        <专业>${fzy}</专业>
                        <毕业时间>${fbysj}</毕业时间>
                        <入职日期>${frzsj}</入职日期>
                        <申请转正日期>${fsqzzsj}</申请转正日期>
                        <自我评价>${fzwpj}</自我评价>
                        <转正意见>${fzzyj}</转正意见>
                        <延长时间>${fyczzq}</延长时间>
                    </洁丽康公司_员工转正申请_主表>
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
function checkNes() {

    if (!$("#fzzyj").val()) {
        mui.toast('请选择转正意见');
        return false;
    }
    return true;

}

function AgreeOrConSign() {
    var pid = $("#stepId").val();
    var fbillno = $("#fbillno").val();
    var comment = $("#signSuggest").val();
    var nodeName = $("#nodeName").val();


    var fno = $("#fno").val();
    var fname = $("#fname").val();
    var fdate = $("#fdate").val();
    var fssjt = $("#fssjt").val();
    var fssgs = $("#fssgs").val();
    var fbm = $("#fbm").val();
    var fzw = $("#fzw").val();
    var fxb = $("#fxb").val();
    var fcsrq = $("#fcsrq").val();
    var fsfzh = $("#fsfzh").val();
    var flxdh = $("#flxdh").val();
    var fzgxl = $("#fzgxl").val();
    var fbyyx = $("#fbyyx").val();
    var fzy = $("#fzy").val();
    var fbysj = $("#fbysj").val();
    var frzsj = $("#frzsj").val();
    var fsqzzsj = $("#fsqzzsj").val();
    var fzwpj = $("#fzwpj").val();
    var fzzyj = $("#fzzyj").val();
    var fyczzq = $("#fyczzq").val();

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
                     <洁丽康公司_员工转正申请_主表>
                        <单号>${fbillno}</单号>
                        <工号>${fno}</工号>
                        <姓名>${fname}</姓名>
                        <申请日期>${fdate}</申请日期>
                        <所属集团>${fssjt}</所属集团>
                        <所属公司>${fssgs}</所属公司>
                        <部门>${fbm}</部门>
                        <职位>${fzw}</职位>
                        <性别>${fxb}</性别>
                        <出生日期>${fcsrq}</出生日期>
                        <身份证号>${fsfzh}</身份证号>
                        <联系电话>${flxdh}</联系电话>
                        <最高学历>${fzgxl}</最高学历>
                        <毕业院校>${fbyyx}</毕业院校>
                        <专业>${fzy}</专业>
                        <毕业时间>${fbysj}</毕业时间>
                        <入职日期>${frzsj}</入职日期>
                        <申请转正日期>${fsqzzsj}</申请转正日期>
                        <自我评价>${fzwpj}</自我评价>
                        <转正意见>${fzzyj}</转正意见>
                        <延长时间>${fyczzq}</延长时间>
                    </洁丽康公司_员工转正申请_主表>
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
                     <洁丽康公司_员工转正申请_主表>
                        <单号>${fbillno}</单号>
                        <工号>${fno}</工号>
                        <姓名>${fname}</姓名>
                        <申请日期>${fdate}</申请日期>
                        <所属集团>${fssjt}</所属集团>
                        <所属公司>${fssgs}</所属公司>
                        <部门>${fbm}</部门>
                        <职位>${fzw}</职位>
                        <性别>${fxb}</性别>
                        <出生日期>${fcsrq}</出生日期>
                        <身份证号>${fsfzh}</身份证号>
                        <联系电话>${flxdh}</联系电话>
                        <最高学历>${fzgxl}</最高学历>
                        <毕业院校>${fbyyx}</毕业院校>
                        <专业>${fzy}</专业>
                        <毕业时间>${fbysj}</毕业时间>
                        <入职日期>${frzsj}</入职日期>
                        <申请转正日期>${fsqzzsj}</申请转正日期>
                        <自我评价>${fzwpj}</自我评价>
                        <转正意见>${fzzyj}</转正意见>
                        <延长时间>${fyczzq}</延长时间>
                    </洁丽康公司_员工转正申请_主表>
                   `;
        xml += `
                       </FormData>
                    </XForm>
                   `;
        PostXml(xml);
    }
}