function prepMsg() {

    $("#fsqrq").val(getNowFormatDate(2));
    tapEvent();
    uploadOpt();
    var xml = `<?xml version= "1.0" ?>
                  <Requests>
                      <Params>
                      <Method>GetFormPostData</Method>
                      <ProcessName>洁丽康公司销售合同评审</ProcessName>
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

    showPicker('fif_cght', fif_data);

    var fqdlx_data = [
        {
            value: '',
            text:'直销公立医院'
        },
        {
            value: '',
            text:'民营医院'
        },
        {
            value: '',
            text:'经销商'
        }
    ];

    showPicker('fqdlx', fqdlx_data);
}


function initData(data, flag) {
    var item = data.FormDataSet.洁丽康公司_销售合同申请_主表[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.单号);
    }
    $("#fsqr").val(item.申请人);
    $("#fsqbm").val(item.申请部门);
    $("#fsqrq").val(FormatterTimeYMS(item.申请日期));
    $("#fif_cght").val(item.是否常规合同);
    $("#fqdlx").val(item.渠道类型);
    $("#fhtmc").val(item.合同名称);
    $("#fhtbh").val(item.合同编号);
    $("#fkhmc").val(item.客户名称);
    $("#fkhfzqy").val(item.客户负责区域);
    $("#ftbr").val(item.提报人);
    $("#fbz").val(item.备注);
    $("#fxsbjl").val(item.销售部经理); 
    $("#fzpjthtshr").val(item.制品集团合同审核人);
    $("#fxszj").val(item.销售总监);
    $("#fzjl").val(item.总经理);

    if (item.合同附件 != null && item.合同附件 != "") {
        var fjtmp = (String)(item.合同附件);

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
                    //var data = data;

                    $('body').find("input[name='fj_info_ids']").each(function () {
                        console.log(data);
                        var _fjIds = $(this).val();
                        if (_fjIds == item.会议申请及底层文件) {
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

                                $(this).parents('.mui-input-row').find(".upload-img-list").append(li);


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
    if (String(NodeName).match('开始') != null) {
        tapEvent();
        uploadOpt();
        $('.upload-addbtn').show();
        $("#fhtmc,#fhtbh,#fkhmc,#fkhfzqy,#ftbr,#fbz").removeAttr('readonly');
    } else {
         //将当前处理人姓名赋值给对应字段
        XuntongJSBridge.call('getPersonInfo', {}, function (result){
            //alert(JSON.stringify(result));       
            if (typeof (result) == "string") {
                result = JSON.parse(result);
            }
            //alert(result.data.name);
            if (String(NodeName).match('销售部经理') != null) {
                $("#fxsbjl").val(result.data.name);
            } else if (String(NodeName).match('制品集团合同审核岗') != null) {
                $("#fzpjthtshr").val(result.data.name);
            } else if (String(NodeName).match('销售总监') != null) {
                $("#fxszj").val(result.data.name);
            } else if (String(NodeName).match('总经理') != null) {
                $("#fzjl").val(result.data.name);
            } 

            
        });
    }
    

}

function Save() {

    var fsqr = $("#fsqr").val();
    var fsqbm = $("#fsqbm").val();
    var fsqrq = $("#fsqrq").val();
    var fif_cght = $("#fif_cght").val();
    var fqdlx = $("#fqdlx").val();
    var fhtmc = $("#fhtmc").val();
    var fhtbh = $("#fhtbh").val();
    var fkhmc = $("#fkhmc").val();
    var fkhfzqy = $("#fkhfzqy").val();
    var ftbr = $("#ftbr").val();
    var fbz = $("#fbz").val();

    if (!fif_cght) {
        mui.toast('请选择是否常规合同');
        return;
    }
    if (!fqdlx) {
        mui.toast('请选择渠道类型');
        return;
    }
    if (!fhtmc) {
        mui.toast('请填写合同名称');
        return;
    }
    if (!fhtbh) {
        mui.toast('请填写合同编号');
        return;
    }
    if (!fkhmc) {
        mui.toast('请填写客户名称');
        return;
    }
    if (!fkhfzqy) {
        mui.toast('请填写客户负责区域');
        return;
    }
    if (!ftbr) {
        mui.toast('请填写提报人');
        return;
    }
    if (fjArray.length == 0) {
        mui.toast('请上传附件');
        return;
    }
    var btnArry = ["取消", "确定"];
    mui.confirm('即将提交，是否确定？', '提交确认提醒', btnArry, function (e) {
        if (e.index == 1) {
            var xml = `<?xml version="1.0"?>
                        <XForm>
                            <Header>
                                <Method>Post</Method>
                                <ProcessName>洁丽康公司销售合同评审</ProcessName>
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
       <洁丽康公司_销售合同申请_主表>
            <单号>自动生成</单号>
            <申请人>${fsqr}</申请人>
            <申请部门>${fsqbm}</申请部门>
            <申请日期>${fsqrq}</申请日期>
            <是否常规合同>${fif_cght}</是否常规合同>
            <渠道类型>${fqdlx}</渠道类型>
            <合同名称>${fhtmc}</合同名称>
            <合同编号>${fhtbh}</合同编号>
            <客户名称>${fkhmc}</客户名称>
            <客户负责区域>${fkhfzqy}</客户负责区域>
            <提报人>${ftbr}</提报人>
            <合同附件>${fjArray.join(";")}</合同附件>
            <备注>${fbz}</备注>
            <TaskID>${$("#taskId").val()}</TaskID>
            <销售部经理>${fxsbjl}</销售部经理>
            <制品集团合同审核人>${fzpjthtshr}</制品集团合同审核人>
            <销售总监>${fxszj}</销售总监>
            <总经理>${fzjl}</总经理>
        </洁丽康公司_销售合同申请_主表>
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
    var fif_cght = $("#fif_cght").val();
    var fqdlx = $("#fqdlx").val();
    var fhtmc = $("#fhtmc").val();
    var fhtbh = $("#fhtbh").val();
    var fkhmc = $("#fkhmc").val();
    var fkhfzqy = $("#fkhfzqy").val();
    var ftbr = $("#ftbr").val();
    var fbz = $("#fbz").val();

    var fxsbjl = $("#fxsbjl").val();
    var fzpjthtshr = $("#fzpjthtshr").val();
    var fxszj = $("#fxszj").val();
    var fzjl = $("#fzjl").val();

    if (!fif_cght) {
        mui.toast('请选择是否常规合同');
        return;
    }
    if (!fqdlx) {
        mui.toast('请选择渠道类型');
        return;
    }
    if (!fhtmc) {
        mui.toast('请填写合同名称');
        return;
    }
    if (!fhtbh) {
        mui.toast('请填写合同编号');
        return;
    }
    if (!fkhmc) {
        mui.toast('请填写客户名称');
        return;
    }
    if (!fkhfzqy) {
        mui.toast('请填写客户负责区域');
        return;
    }
    if (!ftbr) {
        mui.toast('请填写提报人');
        return;
    }
    if (fjArray.length == 0) {
        mui.toast('请上传附件');
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
       <洁丽康公司_销售合同申请_主表>
            <单号>${fbillno}</单号>
            <申请人>${fsqr}</申请人>
            <申请部门>${fsqbm}</申请部门>
            <申请日期>${fsqrq}</申请日期>
            <是否常规合同>${fif_cght}</是否常规合同>
            <渠道类型>${fqdlx}</渠道类型>
            <合同名称>${fhtmc}</合同名称>
            <合同编号>${fhtbh}</合同编号>
            <客户名称>${fkhmc}</客户名称>
            <客户负责区域>${fkhfzqy}</客户负责区域>
            <提报人>${ftbr}</提报人>
            <合同附件>${fjArray.join(";")}</合同附件>
            <备注>${fbz}</备注>
            <TaskID>${$("#taskId").val()}</TaskID>
            <销售部经理>${fxsbjl}</销售部经理>
            <制品集团合同审核人>${fzpjthtshr}</制品集团合同审核人>
            <销售总监>${fxszj}</销售总监>
            <总经理>${fzjl}</总经理>
        </洁丽康公司_销售合同申请_主表>
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
    var fif_cght = $("#fif_cght").val();
    var fqdlx = $("#fqdlx").val();
    var fhtmc = $("#fhtmc").val();
    var fhtbh = $("#fhtbh").val();
    var fkhmc = $("#fkhmc").val();
    var fkhfzqy = $("#fkhfzqy").val();
    var ftbr = $("#ftbr").val();
    var fbz = $("#fbz").val();

    var fxsbjl = $("#fxsbjl").val();    
    var fzpjthtshr = $("#fzpjthtshr").val();
    var fxszj = $("#fxszj").val();
    var fzjl = $("#fzjl").val();

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
       <洁丽康公司_销售合同申请_主表>
            <单号>${fbillno}</单号>
            <申请人>${fsqr}</申请人>
            <申请部门>${fsqbm}</申请部门>
            <申请日期>${fsqrq}</申请日期>
            <是否常规合同>${fif_cght}</是否常规合同>
            <渠道类型>${fqdlx}</渠道类型>
            <合同名称>${fhtmc}</合同名称>
            <合同编号>${fhtbh}</合同编号>
            <客户名称>${fkhmc}</客户名称>
            <客户负责区域>${fkhfzqy}</客户负责区域>
            <提报人>${ftbr}</提报人>
            <合同附件>${fjArray.join(";")}</合同附件>
            <备注>${fbz}</备注>
            <TaskID>${$("#taskId").val()}</TaskID>
            <销售部经理>${fxsbjl}</销售部经理>
            <制品集团合同审核人>${fzpjthtshr}</制品集团合同审核人>
            <销售总监>${fxszj}</销售总监>
            <总经理>${fzjl}</总经理>
        </洁丽康公司_销售合同申请_主表>
                    `;
            xml += `
                       </FormData>
                    </XForm>
                   `;
            PostXml(xml);
        });
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
       <洁丽康公司_销售合同申请_主表>
            <单号>${fbillno}</单号>
            <申请人>${fsqr}</申请人>
            <申请部门>${fsqbm}</申请部门>
            <申请日期>${fsqrq}</申请日期>
            <是否常规合同>${fif_cght}</是否常规合同>
            <渠道类型>${fqdlx}</渠道类型>
            <合同名称>${fhtmc}</合同名称>
            <合同编号>${fhtbh}</合同编号>
            <客户名称>${fkhmc}</客户名称>
            <客户负责区域>${fkhfzqy}</客户负责区域>
            <提报人>${ftbr}</提报人>
            <合同附件>${fjArray.join(";")}</合同附件>
            <备注>${fbz}</备注>
            <TaskID>${$("#taskId").val()}</TaskID>
            <销售部经理>${fxsbjl}</销售部经理>
            <制品集团合同审核人>${fzpjthtshr}</制品集团合同审核人>
            <销售总监>${fxszj}</销售总监>
            <总经理>${fzjl}</总经理>
        </洁丽康公司_销售合同申请_主表>
                    `;
        xml += `
                       </FormData>
                    </XForm>
                   `;
        console.log(xml);
        PostXml(xml);
    }
}