function prepMsg() {
    tapEvent();
    $("#fsqrq").val(getNowFormatDate(2));

    var xml = `<?xml version= "1.0" ?>
                  <Requests>
                      <Params>
                      <Method>GetFormPostData</Method>
                      <ProcessName>洁丽康公司纠正和预防措施管理提报</ProcessName>
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
        searchDept();
    });

}

function tapEvent() {




}


function searchDept() {

    var xml = `<?xml version= "1.0" ?>
                                 <Requests>
                                 <Params>
                                 <DataSource>BPM_WEGO2018</DataSource>
                                 <ID>erpcloud_查询洁丽康公司_纠正和预防措施责任部门设置</ID>
                                 <Type>1</Type>
                                 <Method>GetUserDataProcedure</Method>
                                 <ProcedureName>erpcloud_查询洁丽康公司_纠正和预防措施责任部门设置</ProcedureName>
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
        var data = provideData.Tables[0].Rows;
        var daiArr = [];
        console.log(data);
        for (var dataItem of data) {
            var dai = {
                value: dataItem.责任部门ID,
                text: dataItem.责任部门 + '---' + dataItem.责任部门负责人 + '---' + dataItem.责任部门负责人工号,
                dept: dataItem.责任部门,
                no: dataItem.责任部门负责人工号,
                fzr: dataItem.责任部门负责人
            }
            //console.log(dai);
            daiArr.push(dai);
        }

        var picker = new mui.PopPicker();
        picker.setData(daiArr);
        $("#fzrbm").on('tap', function () {
            var _self = this;
            picker.show(function (items) {
                $(_self).val(items[0].dept);
                $("#ffzr").val(items[0].fzr);
                $("#ffzrno").val(items[0].no);
            });
        });




    }).fail(function (e) {

    });
}


function initData(data, flag) {

    var item = data.FormDataSet.洁丽康公司_纠正和预防措施管理提报[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.单号);
    }
    $("#fsqr").val(item.申请人);
    $("#fsqbm").val(item.申请部门);
    $("#fsqrq").val(FormatterTimeYMS(item.申请日期));
    $("#fwtms").val(item.问题描述);
    $("#fzrbm").val(item.责任部门);
    $("#ffzr").val(item.责任部门负责人);
    $("#ffzrno").val(item.责任部门负责人工号);
    $("#fyyfx").val(item.原因分析);
    $("#fyy").val(item.要因);
    $("#fcs").val(item.纠正和预防措施);
    $("#fwcrq").val(FormatterTimeYMS(item.预计完成日期));
    $("#fssqk").val(item.纠正和预防措施实施情况);
    $("#fyzjg").val(item.验证结果);
    $("#fbz").val(item.备注);
    $("#ffgld").val(item.责任部门分管领导);
    $("#ffgld_date").val(FormatterTimeYMS(item.责任部门分管领导审核日期));
    $("#fzljl").val(item.质量保证部经理);
    $("#fzljl_date").val(FormatterTimeYMS(item.质量保证部经理审核日期));
    $("#fczsq").val(item.不合格品评审和处置申请);
    $("#fczsqtid").val(item.TaskID_不合格品评审和处置申请);


    if (item.附件 != null && item.附件 != "") {
        var fjtmp = (String)(item.附件);

        fjArray = fjtmp.split(";");


        //console.log("fjArray:" + fjArray);

        //请求附件详细信息
        $.ajax({
            type: 'POST',
            url: '/api/bpm/GetAttachmentsInfo',
            //dataType:'json',
            data: { 'fileIds': fjArray },

            beforeSend: function (XHR) {
                XHR.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem('ticket'));
            },
            success: function (data, status) {
                if (status == "success") {

                    console.log(data);

                    for (var i = 0; i < data.length; i++) {

                        var name = data[i].Name;
                        var type = (data[i].Ext).replace(".", "");
                        var size = String(data[i].Size);

                        var time = String(data[i].LastUpdate).replace("T", " ");
                        var downurl = baseDownloadUrl + data[i].FileID;

                        var attach = attachItem(name, type, size, time, downurl);
                        attachArray.push(attach);

                        var li = '<div class="pic-preview smallyulan success">';
                        li = li + ' <div class="del none" style="opacity:1;z-index:999;"onclick="delPicture(this)">x</div>';

                        //类型判断 
                        if ((data[i].Ext).indexOf("png") != -1 || (data[i].Ext).indexOf("jpg") != -1 || (data[i].Ext).indexOf("bmp") != -1) {

                            //li = li + '    <div class="img-wrap smallimg" id="simg" ><a href="'+baseDownloadUrl + data[i].FileID + '"><img src="'+baseDownloadUrl + data[i].FileID + '"/></a></div>';
                            li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '" ><img src="' + baseDownloadUrl + data[i].FileID + '"/></div>';

                        } else if ((data[i].Ext).indexOf("xls") != -1) {

                            li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '"><img src="../../Content/images/xlsx@2x.png"/></div>';

                        } else if ((data[i].Ext).indexOf("doc") != -1) {

                            li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '"><img src="../../Content/images/docx@2x.png"/></div>';

                        } else if ((data[i].Ext).indexOf("ppt") != -1) {

                            li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '"><img src="../../Content/images/ppt@2x.png"/></div>';

                        } else if ((data[i].Ext).indexOf("pdf") != -1) {

                            li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '"><img src="../../Content/images/pdf@2x.png"/></div>';

                        } else if ((data[i].Ext).indexOf("zip") != -1 || (data[i].Ext).indexOf("rar") != -1 || (data[i].Ext).indexOf("7z") != -1) {

                            li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '"><img src="../../Content/images/zip@2x.png"/></div>';

                        } else if ((data[i].Ext).indexOf("txt") != -1) {

                            li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '"><img src="../../Content/images/txt@2x.png"/></div>';

                        } else {
                            li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '"><img src="../../Content/images/unkown@2x.png"/></div>';
                        }

                        li = li + ' </div>';
                        li = li + '</div>';
                        $(".upload-img-list").append(li);


                        $(".imgdiv").each(function () {

                            $(this).parent().find(".del.none").hide();

                        });




                    }
                    watch();
                    $(".imgdiv").on('tap', function () {
                        console.log($(this)[0].id);
                        XuntongJSBridge.call('showFile', {
                            'fileName': attachArray[$(this)[0].id].name,
                            'fileExt': attachArray[$(this)[0].id].type,
                            'fileTime': attachArray[$(this)[0].id].time,
                            'fileSize': attachArray[$(this)[0].id].size,
                            'fileDownloadUrl': attachArray[$(this)[0].id].downurl
                        }, function (result) {
                            //alert(JSON.stringify(result));
                        });
                    });


                }

            }, error: function (e) {
                console.log(e);

            }, complete: function () {

            }

        });

    }

}

function nodeControllerExp(NodeName) {

    var currentno = '';
    XuntongJSBridge.call('getPersonInfo', {}, function (result) {

        if (typeof (result) == 'string') {
            result = JSON.parse(result);
        } else if (typeof (result) == 'object') {
            result = result;
        }
        if (result.success == true || result.success == "true") {
            currentno = result.data.name;
        }

    });

    if (String(NodeName).match('开始') != null) {
        searchDept();
    } else if (String(NodeName).match('部门经理') != null) {


    } else if (String(NodeName).match('责任部门负责人') != null) {
        tapEvent2();
        $("#fyyfx,#fcs").removeAttr('readonly').attr('placeholder', '请填写');;
        uploadOpt();
        $(".upload-addbtn").show();




    } else if (String(NodeName).match('责任部门分管领导') != null) {
        $("#ffgld").val(currentno);
        $("#ffgld_date").val(getNowFormatDate(2));

    } else if (String(NodeName).match('质量保证部经理') != null) {
        $("#fzljl").val(currentno);
        $("#fzljl_date").val(getNowFormatDate(2));
        $("#fssqk,#fbz").removeAttr('readonly').attr('placeholder', '请填写');

        var fyzjg_data = [
            {
                value: '',
                text:'已完成'
            },
            {
                value: '',
                text:'持续中'
            }
        ];

        showPicker('fyzjg', fyzjg_data);
    } 

}
function tapEvent2() {

    var fyy_data = [
        {
            value: '',
            text:'人'
        },
        {
            value: '',
            text: '机'
        },
        {
            value: '',
            text: '料'
        },
        {
            value: '',
            text: '法'
        },
        {
            value: '',
            text: '环'
        },
        {
            value: '',
            text: '测'
        }
    ];

    showPicker('fyy', fyy_data);

    var optDate = {
        "type":"date"
    }
    var pickerD = new mui.DtPicker(optDate);
    $("#fwcrq").on('tap', function () {
        pickerD.show(function (rs) {
            $("#fwcrq").val(rs.text);
        });
    });
}

function checkNes() {
    var nodeName = $("#nodeName").val();
    if (nodeName == '责任部门负责人') {
        if (!$("#fyyfx").val()) {
            mui.toast('请填写原因分析');
            return false;
        }
        if (!$("#fyy").val()) {
            mui.toast('请填写要因');
            return false;
        }
        if (!$("#fcs").val()) {
            mui.toast('请填写预防和纠正措施');
            return false;
        }
        if (!$("#fwcrq").val()) {
            mui.toast('请填写预计完成日期');
            return false;
        }
    } else if (nodeName =='质量保证部经理') {

    }

    return true;
}


function Save() {

    var fsqr = $("#fsqr").val();
    var fsqbm = $("#fsqbm").val();
    var fsqrq = $("#fsqrq").val();
    var fczsq = $("#fczsq").val();
    var fwtms = $("#fwtms").val();
    var fzrbm = $("#fzrbm").val();
    var ffzr = $("#ffzr").val();
    var ffzrno = $("#ffzrno").val();
    var fyyfx = $("#fyyfx").val();
    var fyy = $("#fyy").val();
    var fcs = $("#fcs").val();
    var fwcrq = $("#fwcrq").val();
    var fssqk = $("#fssqk").val();
    var fyzjg = $("#fyzjg").val();
    var fbz = $("#fbz").val();
    var ffgld = $("#ffgld").val();
    var ffgld_date = $("#ffgld_date").val();
    var fzljl = $("#fzljl").val();
    var fzljl_date = $("#fzljl_date").val();
    var fczsq = $("#fczsq").val();
    var fczsqtid = $("#fczsqtid").val();

    if (!fwtms) {
        mui.toast('请填写问题描述');
        return;
    }
    if (!fzrbm) {
        mui.toast('请填写责任部门');
        return;
    }
    var btnArry = ["取消", "确定"];
    mui.confirm('即将提交，是否确定？', '提交确认提醒', btnArry, function (e) {
        if (e.index == 1) {
            var xml = `<?xml version="1.0"?>
                        <XForm>
                            <Header>
                                <Method>Post</Method>
                                <ProcessName>洁丽康公司纠正和预防措施管理提报</ProcessName>
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
      <洁丽康公司_纠正和预防措施管理提报>
            <单号>自动生成</单号>
            <申请人>${fsqr}</申请人>
            <申请部门>${fsqbm}</申请部门>
            <申请日期>${fsqrq}</申请日期>
            <不合格品评审和处置申请>${fczsq}</不合格品评审和处置申请>
            <TaskID_不合格品评审和处置申请>${fczsqtid}</TaskID_不合格品评审和处置申请>
            <问题描述>${fwtms}</问题描述>
            <责任部门>${fzrbm}</责任部门>
            <责任部门负责人>${ffzr}</责任部门负责人>
            <责任部门负责人工号>${ffzrno}</责任部门负责人工号>
            <原因分析>${fyyfx}</原因分析>
            <要因>${fyy}</要因>
            <纠正和预防措施>${fcs}</纠正和预防措施>
            <预计完成日期>${fwcrq}</预计完成日期>
            <附件>${fjArray.join(";")}</附件>
            <纠正和预防措施实施情况>${fssqk}</纠正和预防措施实施情况>
            <验证结果>${fyzjg}</验证结果>
            <备注>${fbz}</备注>
            <TaskID></TaskID>
            <责任部门分管领导>${ffgld}</责任部门分管领导>
            <责任部门分管领导审核日期>${ffgld_date}</责任部门分管领导审核日期>
            <质量保证部经理>${fzljl}</质量保证部经理>
            <质量保证部经理审核日期>${fzljl_date}</质量保证部经理审核日期>
        </洁丽康公司_纠正和预防措施管理提报>
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
    var fczsq = $("#fczsq").val();
    var fwtms = $("#fwtms").val();
    var fzrbm = $("#fzrbm").val();
    var ffzr = $("#ffzr").val();
    var ffzrno = $("#ffzrno").val();
    var fyyfx = $("#fyyfx").val();
    var fyy = $("#fyy").val();
    var fcs = $("#fcs").val();
    var fwcrq = $("#fwcrq").val();
    var fssqk = $("#fssqk").val();
    var fyzjg = $("#fyzjg").val();
    var fbz = $("#fbz").val();
    var ffgld = $("#ffgld").val();
    var ffgld_date = $("#ffgld_date").val();
    var fzljl = $("#fzljl").val();
    var fzljl_date = $("#fzljl_date").val();
    var fczsq = $("#fczsq").val();
    var fczsqtid = $("#fczsqtid").val();

    if (!fwtms) {
        mui.toast('请填写问题描述');
        return;
    }
    if (!fzrbm) {
        mui.toast('请填写责任部门');
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
      <洁丽康公司_纠正和预防措施管理提报>
            <单号>${fbillno}</单号>
            <申请人>${fsqr}</申请人>
            <申请部门>${fsqbm}</申请部门>
            <申请日期>${fsqrq}</申请日期>
            <不合格品评审和处置申请>${fczsq}</不合格品评审和处置申请>
            <TaskID_不合格品评审和处置申请>${fczsqtid}</TaskID_不合格品评审和处置申请>
            <问题描述>${fwtms}</问题描述>
            <责任部门>${fzrbm}</责任部门>
            <责任部门负责人>${ffzr}</责任部门负责人>
            <责任部门负责人工号>${ffzrno}</责任部门负责人工号>
            <原因分析>${fyyfx}</原因分析>
            <要因>${fyy}</要因>
            <纠正和预防措施>${fcs}</纠正和预防措施>
            <预计完成日期>${fwcrq}</预计完成日期>
            <附件>${fjArray.join(";")}</附件>
            <纠正和预防措施实施情况>${fssqk}</纠正和预防措施实施情况>
            <验证结果>${fyzjg}</验证结果>
            <备注>${fbz}</备注>
            <TaskID>${$("#taskId").val()}</TaskID>
            <责任部门分管领导>${ffgld}</责任部门分管领导>
            <责任部门分管领导审核日期>${ffgld_date}</责任部门分管领导审核日期>
            <质量保证部经理>${fzljl}</质量保证部经理>
            <质量保证部经理审核日期>${fzljl_date}</质量保证部经理审核日期>
        </洁丽康公司_纠正和预防措施管理提报>
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
    var fczsq = $("#fczsq").val();
    var fwtms = $("#fwtms").val();
    var fzrbm = $("#fzrbm").val();
    var ffzr = $("#ffzr").val();
    var ffzrno = $("#ffzrno").val();
    var fyyfx = $("#fyyfx").val();
    var fyy = $("#fyy").val();
    var fcs = $("#fcs").val();
    var fwcrq = $("#fwcrq").val();
    var fssqk = $("#fssqk").val();
    var fyzjg = $("#fyzjg").val();
    var fbz = $("#fbz").val();
    var ffgld = $("#ffgld").val();
    var ffgld_date = $("#ffgld_date").val();
    var fzljl = $("#fzljl").val();
    var fzljl_date = $("#fzljl_date").val();
    var fczsq = $("#fczsq").val();
    var fczsqtid = $("#fczsqtid").val();

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
      <洁丽康公司_纠正和预防措施管理提报>
            <单号>${fbillno}</单号>
            <申请人>${fsqr}</申请人>
            <申请部门>${fsqbm}</申请部门>
            <申请日期>${fsqrq}</申请日期>
            <不合格品评审和处置申请>${fczsq}</不合格品评审和处置申请>
            <TaskID_不合格品评审和处置申请>${fczsqtid}</TaskID_不合格品评审和处置申请>
            <问题描述>${fwtms}</问题描述>
            <责任部门>${fzrbm}</责任部门>
            <责任部门负责人>${ffzr}</责任部门负责人>
            <责任部门负责人工号>${ffzrno}</责任部门负责人工号>
            <原因分析>${fyyfx}</原因分析>
            <要因>${fyy}</要因>
            <纠正和预防措施>${fcs}</纠正和预防措施>
            <预计完成日期>${fwcrq}</预计完成日期>
            <附件>${fjArray.join(";")}</附件>
            <纠正和预防措施实施情况>${fssqk}</纠正和预防措施实施情况>
            <验证结果>${fyzjg}</验证结果>
            <备注>${fbz}</备注>
            <TaskID>${$("#taskId").val()}</TaskID>
            <责任部门分管领导>${ffgld}</责任部门分管领导>
            <责任部门分管领导审核日期>${ffgld_date}</责任部门分管领导审核日期>
            <质量保证部经理>${fzljl}</质量保证部经理>
            <质量保证部经理审核日期>${fzljl_date}</质量保证部经理审核日期>
        </洁丽康公司_纠正和预防措施管理提报>
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
      <洁丽康公司_纠正和预防措施管理提报>
            <单号>${fbillno}</单号>
            <申请人>${fsqr}</申请人>
            <申请部门>${fsqbm}</申请部门>
            <申请日期>${fsqrq}</申请日期>
            <不合格品评审和处置申请>${fczsq}</不合格品评审和处置申请>
            <TaskID_不合格品评审和处置申请>${fczsqtid}</TaskID_不合格品评审和处置申请>
            <问题描述>${fwtms}</问题描述>
            <责任部门>${fzrbm}</责任部门>
            <责任部门负责人>${ffzr}</责任部门负责人>
            <责任部门负责人工号>${ffzrno}</责任部门负责人工号>
            <原因分析>${fyyfx}</原因分析>
            <要因>${fyy}</要因>
            <纠正和预防措施>${fcs}</纠正和预防措施>
            <预计完成日期>${fwcrq}</预计完成日期>
            <附件>${fjArray.join(";")}</附件>
            <纠正和预防措施实施情况>${fssqk}</纠正和预防措施实施情况>
            <验证结果>${fyzjg}</验证结果>
            <备注>${fbz}</备注>
            <TaskID>${$("#taskId").val()}</TaskID>
            <责任部门分管领导>${ffgld}</责任部门分管领导>
            <责任部门分管领导审核日期>${ffgld_date}</责任部门分管领导审核日期>
            <质量保证部经理>${fzljl}</质量保证部经理>
            <质量保证部经理审核日期>${fzljl_date}</质量保证部经理审核日期>
        </洁丽康公司_纠正和预防措施管理提报>
                    `;

        xml += `
                       </FormData>
                    </XForm>
                   `;
        console.log(xml);
        PostXml(xml);
    }
            

}