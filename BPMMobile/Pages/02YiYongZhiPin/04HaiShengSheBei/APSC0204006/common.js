function prepMsg() {
    tapEvent();
    uploadOpt();
    $("#fsqrq").val(getNowFormatDate(2));

    var xml = `<?xml version= "1.0" ?>
                  <Requests>
                      <Params>
                      <Method>GetFormPostData</Method>
                      <ProcessName>爱普公司销售管理事务申请</ProcessName>
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
    var fsqjb_data = [
        {
            value: '',
            text:'一级'
        },
        {
            value: '',
            text: '二级'
        },
        {
            value: '',
            text: '三级'
        },
        {
            value: '',
            text: '四级'
        }
    ];

    showPicker('fsqjb', fsqjb_data);


}

function initData(data, flag) {
    var item = data.FormDataSet.爱普公司_管理事务申请表[0];

    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.单号);
    }
    $("#fsqr").val(item.申请人);
    $("#fssqy").val(item.所属区域);
    $("#fsqrq").val(FormatterTimeYMS(item.申请日期));
    $("#flxfs").val(item.联系方式);
    $("#fkhmc").val(item.客户名称);
    $("#fkhjb").val(item.客户级别);
    $("#fkhxz").val(item.客户性质);
    $("#fsxq").val(item.授信期);
    $("#fxscp").val(item.销售产品);
    $("#fpsyy").val(item.配送医院);
    $("#fsqlx").val(item.申请类型);
    $("#fsqjb").val(item.申请级别);
    $("#fsqnr").val(item.申请内容);

    if (item.附件 != null && item.附件 != "") {
        var fjtmp = (String)(item.附件);

        fjArray = fjtmp.split(";");


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
                        console.log(navigator.userAgent);
                        if (String(navigator.userAgent).match('cloudhub') != null) {
                            window.open(attachArray[$(this)[0].id].downurl);
                        }
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


function nodeControllerExp(nodeName) {
    if (String(nodeName).match('开始') != null) {

        tapEvent();

        $("#fssqy,#flxfs,#fkhmc,#fkhjb,#fkhxz,#fsxq,#fxscp,#fpsyy,#fsqlx,#fsqnr").removeAttr('readonly');

        $('.upload-addbtn').show();

        uploadOpt();


    }
}


function Save() {

    var fsqr = $("#fsqr").val();
    var fssqy = $("#fssqy").val();
    var fsqrq = $("#fsqrq").val();
    var flxfs = $("#flxfs").val();
    var fkhmc = $("#fkhmc").val();
    var fkhjb = $("#fkhjb").val();
    var fkhxz = $("#fkhxz").val();
    var fsxq = $("#fsxq").val();
    var fxscp = $("#fxscp").val();
    var fpsyy = $("#fpsyy").val();
    var fsqlx = $("#fsqlx").val();
    var fsqjb = $("#fsqjb").val();
    var fsqnr = $("#fsqnr").val();

    if (!flxfs) {
        mui.toast('请填写联系方式');
        return;
    }
    if (!fkhmc) {
        mui.toast('请填写客户名称');
        return;
    }
    if (!fkhjb) {
        mui.toast('请填写客户级别');
        return;
    }
    if (!fkhxz) {
        mui.toast('请填写客户性质');
        return;
    }
    if (!fsxq) {
        mui.toast('请填写授信期');
        return;
    }
    if (!fxscp) {
        mui.toast('请填写销售产品');
        return;
    }
    if (!fsqjb) {
        mui.toast('请填写申请级别');
        return;
    }
    if (!fsqnr) {
        mui.toast('请填写申请内容');
        return;
    }
    var btnArry = ["取消", "确定"];
    mui.confirm('即将提交，是否确定？', '提交确认提醒', btnArry, function (e) {
        if (e.index == 1) {
            var xml = `<?xml version="1.0"?>
                        <XForm>
                            <Header>
                                <Method>Post</Method>
                                <ProcessName>爱普公司销售管理事务申请</ProcessName>
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
     <爱普公司_管理事务申请表>
            <单号>自动生成</单号>
            <申请人>${fsqr}</申请人>
            <所属区域>${fssqy}</所属区域>
            <申请日期>${fsqrq}</申请日期>
            <联系方式>${flxfs}</联系方式>
            <客户名称>${fkhmc}</客户名称>
            <客户级别>${fkhjb}</客户级别>
            <客户性质>${fkhxz}</客户性质>
            <授信期>${fsxq}</授信期>
            <销售产品>${fxscp}</销售产品>
            <配送医院>${fpsyy}</配送医院>
            <申请类型>${fsqlx}</申请类型>
            <申请级别>${fsqjb}</申请级别>
            <申请内容>${fsqnr}</申请内容>
            <附件>${fjArray.join(";")}</附件>
        </爱普公司_管理事务申请表>
                    `;
            xml += `
                       </FormData>
                    </XForm>
                   `;
            console.log(xml);
            PostXml(xml);
        }
    });


}

function reSave() {
    var fbillno = $("#fbillno").val();
    var pid = $("#stepId").val();
    var fsqr = $("#fsqr").val();
    var fssqy = $("#fssqy").val();
    var fsqrq = $("#fsqrq").val();
    var flxfs = $("#flxfs").val();
    var fkhmc = $("#fkhmc").val();
    var fkhjb = $("#fkhjb").val();
    var fkhxz = $("#fkhxz").val();
    var fsxq = $("#fsxq").val();
    var fxscp = $("#fxscp").val();
    var fpsyy = $("#fpsyy").val();
    var fsqlx = $("#fsqlx").val();
    var fsqjb = $("#fsqjb").val();
    var fsqnr = $("#fsqnr").val();

    if (!flxfs) {
        mui.toast('请填写联系方式');
        return;
    }
    if (!fkhmc) {
        mui.toast('请填写客户名称');
        return;
    }
    if (!fkhjb) {
        mui.toast('请填写客户级别');
        return;
    }
    if (!fkhxz) {
        mui.toast('请填写客户性质');
        return;
    }
    if (!fsxq) {
        mui.toast('请填写授信期');
        return;
    }
    if (!fxscp) {
        mui.toast('请填写销售产品');
        return;
    }
    if (!fsqjb) {
        mui.toast('请填写申请级别');
        return;
    }
    if (!fsqnr) {
        mui.toast('请填写申请内容');
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
     <爱普公司_管理事务申请表>
            <单号>${fbillno}</单号>
            <申请人>${fsqr}</申请人>
            <所属区域>${fssqy}</所属区域>
            <申请日期>${fsqrq}</申请日期>
            <联系方式>${flxfs}</联系方式>
            <客户名称>${fkhmc}</客户名称>
            <客户级别>${fkhjb}</客户级别>
            <客户性质>${fkhxz}</客户性质>
            <授信期>${fsxq}</授信期>
            <销售产品>${fxscp}</销售产品>
            <配送医院>${fpsyy}</配送医院>
            <申请类型>${fsqlx}</申请类型>
            <申请级别>${fsqjb}</申请级别>
            <申请内容>${fsqnr}</申请内容>
            <附件>${fjArray.join(";")}</附件>
        </爱普公司_管理事务申请表>
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
    var fssqy = $("#fssqy").val();
    var fsqrq = $("#fsqrq").val();
    var flxfs = $("#flxfs").val();
    var fkhmc = $("#fkhmc").val();
    var fkhjb = $("#fkhjb").val();
    var fkhxz = $("#fkhxz").val();
    var fsxq = $("#fsxq").val();
    var fxscp = $("#fxscp").val();
    var fpsyy = $("#fpsyy").val();
    var fsqlx = $("#fsqlx").val();
    var fsqjb = $("#fsqjb").val();
    var fsqnr = $("#fsqnr").val();

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
     <爱普公司_管理事务申请表>
            <单号>${fbillno}</单号>
            <申请人>${fsqr}</申请人>
            <所属区域>${fssqy}</所属区域>
            <申请日期>${fsqrq}</申请日期>
            <联系方式>${flxfs}</联系方式>
            <客户名称>${fkhmc}</客户名称>
            <客户级别>${fkhjb}</客户级别>
            <客户性质>${fkhxz}</客户性质>
            <授信期>${fsxq}</授信期>
            <销售产品>${fxscp}</销售产品>
            <配送医院>${fpsyy}</配送医院>
            <申请类型>${fsqlx}</申请类型>
            <申请级别>${fsqjb}</申请级别>
            <申请内容>${fsqnr}</申请内容>
            <附件>${fjArray.join(";")}</附件>
        </爱普公司_管理事务申请表>
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
     <爱普公司_管理事务申请表>
            <单号>${fbillno}</单号>
            <申请人>${fsqr}</申请人>
            <所属区域>${fssqy}</所属区域>
            <申请日期>${fsqrq}</申请日期>
            <联系方式>${flxfs}</联系方式>
            <客户名称>${fkhmc}</客户名称>
            <客户级别>${fkhjb}</客户级别>
            <客户性质>${fkhxz}</客户性质>
            <授信期>${fsxq}</授信期>
            <销售产品>${fxscp}</销售产品>
            <配送医院>${fpsyy}</配送医院>
            <申请类型>${fsqlx}</申请类型>
            <申请级别>${fsqjb}</申请级别>
            <申请内容>${fsqnr}</申请内容>
            <附件>${fjArray.join(";")}</附件>
        </爱普公司_管理事务申请表>
                    `;
        xml += `
                       </FormData>
                    </XForm>
                   `;
        PostXml(xml);
    }

}