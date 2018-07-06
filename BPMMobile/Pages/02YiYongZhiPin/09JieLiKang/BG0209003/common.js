function prepMsg() {
    $("#fsqrq").val(getNowFormatDate(2));
    tapEvent();
    uploadOpt();
    var xml = `<?xml version= "1.0" ?>
                  <Requests>
                      <Params>
                      <Method>GetFormPostData</Method>
                      <ProcessName>洁丽康公司会议(活动)申请</ProcessName>
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
        $("#fsqrno").val(item.申请人工号);
        $("#fsqbm").val(item.申请部门);

    }).fail(function (e) {

    }).then(function () {

    });
}

function tapEvent() {

    $("#fxzr").on('tap', function () {
        var opidArr = [];
        XuntongJSBridge.call('selectPerson', { 'pType': '1' }, function (result) {

            if (String(Object.prototype.toString.call(result)).match('String') != null) {
                result = JSON.parse(result);
            }

            if (result.success == true || result.success == "true") {

                for (var i = 0; i < result.data.persons.length; i++) {

                    opidArr.push(result.data.persons[i].openId);

                }
                var getPerInfo = $.ajax({
                    type: "POST",
                    url: "/api/bpm/PostAccount",
                    data: { "ids": opidArr },
                    beforeSend: function (XHR) {
                        XHR.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem('ticket'));
                    }
                }).done((data) => {
                    console.info(data);
                }).fail((e) => {
                    console.error(e);
                });
                getPerInfo.then((data) => {
                    var xml = `<?xml version= "1.0" ?>
                                 <Requests>
                                 <Params>
                                 <DataSource>PS</DataSource>
                                 <ID>erpcloud_公用_获取个人信息</ID>
                                 <Type>1</Type>
                                 <Method>GetUserDataProcedure</Method>
                                 <ProcedureName>erpcloud_公用_获取个人信息</ProcedureName>
                                 <Filter><fno>${data.data[0].phone}</fno></Filter>
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
                        var pio = provideData.Tables[0].Rows[0];
                        console.info(pio);
                        $("#fxzr").val(pio.NAME);
                        $("#fxzrno").val(pio.EMPLID);
                        $("#fxzbm").val(pio.fdeptname);

                    }).fail(function (e) {

                    });
                });



            }
        });

    });

}
//申请人评价节点处理事件
function tapEvent2() {
    var fpj_data = [
        {
            value: '',
            text:'优秀'
        },
        {
            value: '',
            text:'良好'
        },
        {
            value: '',
            text:'一般'
        }
    ];

    showPicker('fpj', fpj_data);
}


function initData(data, flag) {
    var item = data.FormDataSet.洁丽康公司_内部工作联络申请_主表[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.单号);
    }
    $("#fsqr").val(item.申请人);
    $("#fsqrno").val(item.申请人工号);
    $("#fsqbm").val(item.申请部门);
    $("#fsqrq").val(FormatterTimeYMS(item.申请日期));
    $("#fxzr").val(item.协作人);
    $("#fxzrno").val(item.协作人工号);
    $("#fxzbm").val(item.协作部门);
    $("#fnr").val(item.内容);
    $("#fpj").val(item.评价);
    $("#fpjnr").val(item.评价内容);
    $("#fxzrfgld").val(item.协作人分管领导);
    $("#fsqrfgld").val(item.申请人分管领导);
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
    if (String(NodeName).match('开始') != null) {
        tapEvent();
        $("#fnr").removeAttr('readonly');
        $('.upload-addbtn').show();
        uploadOpt();
    } else if (String(NodeName).match('申请人评价') != null) {
        tapEvent2();
        $("#fpjnr").removeAttr('readonly').attr('placeholder', '请填写');
        $("#fpj").attr('placeholder', '请选择');
    }
}
function checkNes() {
    var NodeName = $("#nodeName").val();
    if (String(NodeName).match('申请人评价') != null) {
        if (!$("#fpj").val()) {
            mui.toast('请选择评价');
            return false;
        }
    }
    return true;
}

function Save() {
    var fsqr = $("#fsqr").val();
    var fsqrno = $("#fsqrno").val();
    var fsqbm = $("#fsqbm").val();
    var fsqrq = $("#fsqrq").val();
    var fxzr = $("#fxzr").val();
    var fxzrno = $("#fxzrno").val();
    var fxzbm = $("#fxzbm").val();
    var fnr = $("#fnr").val();
    var fpj = $("#fpj").val();
    var fpjnr = $("#fpjnr").val();
    var fxzrfgld = $("#fxzrfgld").val();
    var fsqrfgld = $("#fsqrfgld").val();


    if (!fxzr){
        mui.toast('请选择协作人');
        return;
    }
    if (!fnr) {
        mui.toast('请填写内容');
        return;
    }
    var btnArry = ["取消", "确定"];
    mui.confirm('即将提交，是否确定？', '提交确认提醒', btnArry, function (e) {
        if (e.index == 1) {
            var xml = `<?xml version="1.0"?>
                        <XForm>
                            <Header>
                                <Method>Post</Method>
                                <ProcessName>洁丽康公司内部工作联络申请</ProcessName>
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
            xml += ` <洁丽康公司_内部工作联络申请_主表>
            <单号>自动生成</单号>
            <申请人>${fsqr}</申请人>
            <申请部门>${fsqbm}</申请部门>
            <申请日期>${fsqrq}</申请日期>
            <协作人>${fxzr}</协作人>
            <协作部门>${fxzbm}</协作部门>
            <内容>${fnr}</内容>
            <附件>${fjArray.join(";")}</附件>
            <评价>${fpj}</评价>
            <评价内容>${fpjnr}</评价内容>
            <TaskID></TaskID>
            <申请人工号>${fsqrno}</申请人工号>
            <协作人工号>${fxzrno}</协作人工号>
            <协作人分管领导></协作人分管领导>
            <申请人分管领导></申请人分管领导>
        </洁丽康公司_内部工作联络申请_主表>

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
    var fsqrno = $("#fsqrno").val();
    var fsqbm = $("#fsqbm").val();
    var fsqrq = $("#fsqrq").val();
    var fxzr = $("#fxzr").val();
    var fxzrno = $("#fxzrno").val();
    var fxzbm = $("#fxzbm").val();
    var fnr = $("#fnr").val();
    var fpj = $("#fpj").val();
    var fpjnr = $("#fpjnr").val();
    var fxzrfgld = $("#fxzrfgld").val();
    var fsqrfgld = $("#fsqrfgld").val();


    if (!fxzr) {
        mui.toast('请选择协作人');
        return;
    }
    if (!fnr) {
        mui.toast('请填写内容');
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
            xml += ` <洁丽康公司_内部工作联络申请_主表>
            <单号>${fbillno}</单号>
            <申请人>${fsqr}</申请人>
            <申请部门>${fsqbm}</申请部门>
            <申请日期>${fsqrq}</申请日期>
            <协作人>${fxzr}</协作人>
            <协作部门>${fxzbm}</协作部门>
            <内容>${fnr}</内容>
            <附件>${fjArray.join(";")}</附件>
            <评价>${fpj}</评价>
            <评价内容>${fpjnr}</评价内容>
            <TaskID>${$("#taskId").val()}</TaskID>
            <申请人工号>${fsqrno}</申请人工号>
            <协作人工号>${fxzrno}</协作人工号>
            <协作人分管领导>${fxzrfgld}</协作人分管领导>
            <申请人分管领导>${fsqrfgld}</申请人分管领导>
        </洁丽康公司_内部工作联络申请_主表>

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
    var fsqrno = $("#fsqrno").val();
    var fsqbm = $("#fsqbm").val();
    var fsqrq = $("#fsqrq").val();
    var fxzr = $("#fxzr").val();
    var fxzrno = $("#fxzrno").val();
    var fxzbm = $("#fxzbm").val();
    var fnr = $("#fnr").val();
    var fpj = $("#fpj").val();
    var fpjnr = $("#fpjnr").val();
    var fxzrfgld = $("#fxzrfgld").val();
    var fsqrfgld = $("#fsqrfgld").val();

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
            xml += ` <洁丽康公司_内部工作联络申请_主表>
            <单号>${fbillno}</单号>
            <申请人>${fsqr}</申请人>
            <申请部门>${fsqbm}</申请部门>
            <申请日期>${fsqrq}</申请日期>
            <协作人>${fxzr}</协作人>
            <协作部门>${fxzbm}</协作部门>
            <内容>${fnr}</内容>
            <附件>${fjArray.join(";")}</附件>
            <评价>${fpj}</评价>
            <评价内容>${fpjnr}</评价内容>
            <TaskID>${$("#taskId").val()}</TaskID>
            <申请人工号>${fsqrno}</申请人工号>
            <协作人工号>${fxzrno}</协作人工号>
            <协作人分管领导>${fxzrfgld}</协作人分管领导>
            <申请人分管领导>${fsqrfgld}</申请人分管领导>
        </洁丽康公司_内部工作联络申请_主表>

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
        xml += ` <洁丽康公司_内部工作联络申请_主表>
            <单号>${fbillno}</单号>
            <申请人>${fsqr}</申请人>
            <申请部门>${fsqbm}</申请部门>
            <申请日期>${fsqrq}</申请日期>
            <协作人>${fxzr}</协作人>
            <协作部门>${fxzbm}</协作部门>
            <内容>${fnr}</内容>
            <附件>${fjArray.join(";")}</附件>
            <评价>${fpj}</评价>
            <评价内容>${fpjnr}</评价内容>
            <TaskID>${$("#taskId").val()}</TaskID>
            <申请人工号>${fsqrno}</申请人工号>
            <协作人工号>${fxzrno}</协作人工号>
            <协作人分管领导>${fxzrfgld}</协作人分管领导>
            <申请人分管领导>${fsqrfgld}</申请人分管领导>
        </洁丽康公司_内部工作联络申请_主表>

                   `;
        xml += `
                       </FormData>
                    </XForm>
                   `;
        PostXml(xml);
    }
}