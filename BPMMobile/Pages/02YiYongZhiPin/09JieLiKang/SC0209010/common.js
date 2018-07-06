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
        $("#fsqbm").val(item.申请部门);
        $("#fsqrno").val(item.申请人工号);



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

    var picker_if = new mui.PopPicker();
    picker_if.setData(fif_data);
    $("#fif_jk").on('tap', function () {
        var _self = this;
        picker_if.show(function (items) {
            $(_self).val(items[0].text);
            if (items[0].text == '是') {
                $("#fjkcard").show();
            } else {
                $("#fjkcard").hide();
            }
        });
    });

    var optdate = {
        "type":"date"
    };
    var picker_dt = new mui.DtPicker(optdate);
    $("#fksrq").on('tap', function () {
        var _self = this;
        picker_dt.show(function (rs) {
            $(_self).val(rs.text);
        });
    });
    $("#fjsrq").on('tap', function () {
        var _self = this;
        picker_dt.show(function (rs) {
            $(_self).val(rs.text);
        });
    });

    var fhylx_data = [
        {
            value: '',
            text:'学术会'
        },
        {
            value: '',
            text:'全国性展会'
        },
        {
            value: '',
            text:'地方性展会'
        },
        {
            value: '',
            text:'其他'
        }
    ];
    showPicker('fhylx', fhylx_data);
    $("#fjkje").on('input', function () {
        var _value = parseFloat($(this).val()) || 0;
        $("#fjkje_dx").val(atoc(_value));
    });
}

var fjArray2 = [];
var fjArray1 = [];

function initData(data, flag) {
    var item = data.FormDataSet.洁丽康公司_会议活动申请_主表[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.单号);
    }
    $("#fsqr").val(item.申请人);
    $("#fsqbm").val(item.申请部门);
    $("#fsqrq").val(FormatterTimeYMS(item.申请日期));
    $("#fif_jk").val(item.是否借款);
    $("#fksrq").val(FormatterTimeYMS(item.会议开始日期));
    $("#fjsrq").val(FormatterTimeYMS(item.会议结束日期));
    $("#fjbr").val(item.经办人);
    $("#fhymc").val(item.会议名称);
    $("#fzbf").val(item.主办方);
    $("#fhydd").val(item.会议地点);
    $("#fhylx").val(item.会议类型);
    $("#fhygm").val(item.会议规模);
    $("#fchmd").val(item.参会目的);
    $("#fyqxg").val(item.预期效果);
    $("#fgschry").val(item.公司参会人员);

    if (item.是否借款 == '是') {
        $("#fjkcard").show();
    } else {
        $("#fjkcard").hide();
    }

    $("#fj_info_ids1").val(item.会议申请及底层文件);
    $("#fj_info_ids2").val(item.会议总结);


    //会议申请及底层文件
    if (item.会议申请及底层文件 != null && item.会议申请及底层文件 != "") {
        var fjtmp = (String)(item.会议申请及底层文件);

        fjArray1 = fjtmp.split(";");


        //console.log("fjArray:" + fjArray);

        //请求附件详细信息
        $.ajax({
            type: 'POST',
            url: '/api/bpm/GetAttachmentsInfo',
            //dataType:'json',
            data: { 'fileIds': fjArray1 },

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
    //会议总结
    if (item.会议总结 != null && item.会议总结 != "") {
        var fjtmp = (String)(item.会议总结);

        fjArray2 = fjtmp.split(";");


        //console.log("fjArray:" + fjArray);

        //请求附件详细信息
        $.ajax({
            type: 'POST',
            url: '/api/bpm/GetAttachmentsInfo',
            //dataType:'json',
            data: { 'fileIds': fjArray2 },

            beforeSend: function (XHR) {
                XHR.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem('ticket'));
            },
            success: function (data, status) {
                if (status == "success") {
                   
                    console.log(data);

                    $('body').find("input[name='fj_info_ids']").each(function () {
                        var _fjIds = $(this).val();
                        if (_fjIds == item.会议总结) {
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


    $("#fjkje").val(item.借款金额);
    $("#fjkje_dx").val(item.借款金额大写);
    $("#fjkdh").val(item.借款单号);
    $("#fjkyt").val(item.借款用途);
  
   

}
function tapEvent_dispatch() {
    $("#fjbr").on('tap', function () {
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
                        $("#fjbr").val(pio.NAME);
                        $("#fjbrno").val(pio.EMPLID);
                    }).fail(function (e) {


                    });
                });
            }
        });
    });
}

action = '同意';
function nodeControllerExp(NodeName) {
    if (String(NodeName).match('开始') != null) {

        tapEvent();
        uploadOpt();
        $("#fhymc,#fzbf,#fhydd,#fhygm,#fchmd,#fyqxg,#fgschry").removeAttr('readonly');
        $("#uploaddiv").find(".upload-addbtn").show();


    } else if (String(NodeName).match('发起人提交总结') != null) {
        action = '提交';
        $("#uploaddiv2").find(".upload-addbtn").show();       
        uploadOpt();




    } else if (String(NodeName).match('市场部经理派工') != null){
        tapEvent_dispatch();
        $("#fjbr").attr('placeholder', '请选择经办人');
    }
}
function checkNes() {
    var nodeName = $("#nodeName").val();
    if (String(nodeName).match('发起人提交总结') != null) {
        if (!fjArray) {
            mui.toast('请上传会议总结');
            return false;
        }
    }
    if (String(nodeName).match('市场部经理派工') != null) {
        if (!$("#fjbr").val()) {
            mui.toast('请选择经办人');
            return false;
        }
    }
    return true;

}

function Save() {

    var fsqr = $("#fsqr").val();
    var fsqbm = $("#fsqbm").val();
    var fsqrq = $("#fsqrq").val();
    var fif_jk = $("#fif_jk").val();
    var fksrq = $("#fksrq").val();
    var fjsrq = $("#fjsrq").val();
    var fjbr = $("#fjbr").val();
    var fhymc = $("#fhymc").val();
    var fzbf = $("#fzbf").val();
    var fhydd = $("#fhydd").val();
    var fhylx = $("#fhylx").val();
    var fhygm = $("#fhygm").val();
    var fchmd = $("#fchmd").val();
    var fyqxg = $("#fyqxg").val();
    var fgschry = $("#fgschry").val();
    var fjkje = $("#fjkje").val();
    var fjkje_dx = $("#fjkje_dx").val();
    var fjkdh = $("#fjkdh").val();
    var fjkyt = $("#fjkyt").val();
    var fsqrno = $("#fsqrno").val();
    var fjbrno = $("#fjbrno").val();
    var fbmfzr = $("#fbmfzr").val();
    var fbmfgld = $("#fbmfgld").val();
    var fcwshr = $("#fcwshr").val();
    var fspr = $("#fspr").val();

    if (!fksrq) {
        mui.toast('请选择开始日期');
        return;
    }
    if (!fjsrq) {
        mui.toast('请选择结束日期');
        return;
    }

 
    if (!fhymc) {
        mui.toast('请填写会议名称');
        return;
    }
    if (!fzbf) {
        mui.toast('请填写主办方');
        return;
    }
    if (!fhydd) {
        mui.toast('请填写会议地点');
        return;
    }
    if (!fhylx) {
        mui.toast('请选择会议类型');
        return;
    }
    if (!fhygm) {
        mui.toast('请填写会议规模');
        return;
    }
    if (!fchmd) {
        mui.toast('请填写参会目的');
        return;
    }
    if (!fyqxg) {
        mui.toast('请填写预期效果');
        return;
    }
    if (!fgschry) {
        mui.toast('请填写公司参会人员');
        return;
    }
    if (fjArray.length == 0) {
        mui.toast('请上传会议申请及底层文件');
        return;
    }
    if (fif_jk == '是' && !fjkje) {
        mui.toast('请填写借款金额');
        return;
    }

    var btnArry = ["取消", "确定"];
    mui.confirm('即将提交，是否确定？', '提交确认提醒', btnArry, function (e) {
        if (e.index == 1) {
            var xml = `<?xml version="1.0"?>
                        <XForm>
                            <Header>
                                <Method>Post</Method>
                                <ProcessName>洁丽康公司会议(活动)申请</ProcessName>
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
       <洁丽康公司_会议活动申请_主表>
            <单号>自动生成</单号>
            <申请人>${fsqr}</申请人>
            <申请部门>${fsqbm}</申请部门>
            <申请日期>${fsqrq}</申请日期>
            <是否借款>${fif_jk}</是否借款>
            <会议开始日期>${fksrq}</会议开始日期>
            <会议结束日期>${fjsrq}</会议结束日期>
            <经办人>${fjbr}</经办人>
            <会议名称>${fhymc}</会议名称>
            <主办方>${fzbf}</主办方>
            <会议地点>${fhydd}</会议地点>
            <会议类型>${fhylx}</会议类型>
            <会议规模>${fhygm}</会议规模>
            <参会目的>${fchmd}</参会目的>
            <预期效果>${fyqxg}</预期效果>
            <公司参会人员>${fgschry}</公司参会人员>
            <会议申请及底层文件>${fjArray.join(";")}</会议申请及底层文件>
            <借款金额>${fjkje}</借款金额>
            <借款金额大写>${fjkje_dx}</借款金额大写>
            <借款单号>${fjkdh}</借款单号>
            <借款用途>${fjkyt}</借款用途>
            <会议总结></会议总结>
            <TaskID></TaskID>
            <申请人工号>${fsqrno}</申请人工号>
            <经办人工号></经办人工号>
            <部门负责人></部门负责人>
            <部门分管领导></部门分管领导>
            <财务审核人></财务审核人>
            <审批人></审批人>
        </洁丽康公司_会议活动申请_主表>
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
    var fif_jk = $("#fif_jk").val();
    var fksrq = $("#fksrq").val();
    var fjsrq = $("#fjsrq").val();
    var fjbr = $("#fjbr").val();
    var fhymc = $("#fhymc").val();
    var fzbf = $("#fzbf").val();
    var fhydd = $("#fhydd").val();
    var fhylx = $("#fhylx").val();
    var fhygm = $("#fhygm").val();
    var fchmd = $("#fchmd").val();
    var fyqxg = $("#fyqxg").val();
    var fgschry = $("#fgschry").val();
    var fjkje = $("#fjkje").val();
    var fjkje_dx = $("#fjkje_dx").val();
    var fjkdh = $("#fjkdh").val();
    var fjkyt = $("#fjkyt").val();
    var fsqrno = $("#fsqrno").val();
    var fjbrno = $("#fjbrno").val();
    var fbmfzr = $("#fbmfzr").val();
    var fbmfgld = $("#fbmfgld").val();
    var fcwshr = $("#fcwshr").val();
    var fspr = $("#fspr").val();

    if (!fksrq) {
        mui.toast('请选择开始日期');
        return;
    }
    if (!fjsrq) {
        mui.toast('请选择结束日期');
        return;
    }


    if (!fhymc) {
        mui.toast('请填写会议名称');
        return;
    }
    if (!fzbf) {
        mui.toast('请填写主办方');
        return;
    }
    if (!fhydd) {
        mui.toast('请填写会议地点');
        return;
    }
    if (!fhylx) {
        mui.toast('请选择会议类型');
        return;
    }
    if (!fhygm) {
        mui.toast('请填写会议规模');
        return;
    }
    if (!fchmd) {
        mui.toast('请填写参会目的');
        return;
    }
    if (!fyqxg) {
        mui.toast('请填写预期效果');
        return;
    }
    if (!fgschry) {
        mui.toast('请填写公司参会人员');
        return;
    }
    if (fjArray.length == 0) {
        mui.toast('请上传会议申请及底层文件');
        return;
    }
    if (fif_jk == '是' && !fjkje) {
        mui.toast('请填写借款金额');
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
       <洁丽康公司_会议活动申请_主表>
            <单号>${fbillno}</单号>
            <申请人>${fsqr}</申请人>
            <申请部门>${fsqbm}</申请部门>
            <申请日期>${fsqrq}</申请日期>
            <是否借款>${fif_jk}</是否借款>
            <会议开始日期>${fksrq}</会议开始日期>
            <会议结束日期>${fjsrq}</会议结束日期>
            <经办人>${fjbr}</经办人>
            <会议名称>${fhymc}</会议名称>
            <主办方>${fzbf}</主办方>
            <会议地点>${fhydd}</会议地点>
            <会议类型>${fhylx}</会议类型>
            <会议规模>${fhygm}</会议规模>
            <参会目的>${fchmd}</参会目的>
            <预期效果>${fyqxg}</预期效果>
            <公司参会人员>${fgschry}</公司参会人员>
            <会议申请及底层文件>${fjArray1.join(";")}</会议申请及底层文件>
            <借款金额>${fjkje}</借款金额>
            <借款金额大写>${fjkje_dx}</借款金额大写>
            <借款单号>${fjkdh}</借款单号>
            <借款用途>${fjkyt}</借款用途>
            <会议总结>${fjArray2.join(";")}</会议总结>
            <TaskID>${$("#taskId").val()}</TaskID>
            <申请人工号>${fsqrno}</申请人工号>
            <经办人工号>${fjbrno}</经办人工号>
            <部门负责人>${fbmfzr}</部门负责人>
            <部门分管领导>${fbmfgld}</部门分管领导>
            <财务审核人>${fcwshr}</财务审核人>
            <审批人>${fspr}</审批人>
        </洁丽康公司_会议活动申请_主表>
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
    var fif_jk = $("#fif_jk").val();
    var fksrq = $("#fksrq").val();
    var fjsrq = $("#fjsrq").val();
    var fjbr = $("#fjbr").val();
    var fhymc = $("#fhymc").val();
    var fzbf = $("#fzbf").val();
    var fhydd = $("#fhydd").val();
    var fhylx = $("#fhylx").val();
    var fhygm = $("#fhygm").val();
    var fchmd = $("#fchmd").val();
    var fyqxg = $("#fyqxg").val();
    var fgschry = $("#fgschry").val();
    var fjkje = $("#fjkje").val();
    var fjkje_dx = $("#fjkje_dx").val();
    var fjkdh = $("#fjkdh").val();
    var fjkyt = $("#fjkyt").val();
    var fsqrno = $("#fsqrno").val();
    var fjbrno = $("#fjbrno").val();
    var fbmfzr = $("#fbmfzr").val();
    var fbmfgld = $("#fbmfgld").val();
    var fcwshr = $("#fcwshr").val();
    var fspr = $("#fspr").val();

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
                     <Action>${action}</Action>
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
       <洁丽康公司_会议活动申请_主表>
            <单号>${fbillno}</单号>
            <申请人>${fsqr}</申请人>
            <申请部门>${fsqbm}</申请部门>
            <申请日期>${fsqrq}</申请日期>
            <是否借款>${fif_jk}</是否借款>
            <会议开始日期>${fksrq}</会议开始日期>
            <会议结束日期>${fjsrq}</会议结束日期>
            <经办人>${fjbr}</经办人>
            <会议名称>${fhymc}</会议名称>
            <主办方>${fzbf}</主办方>
            <会议地点>${fhydd}</会议地点>
            <会议类型>${fhylx}</会议类型>
            <会议规模>${fhygm}</会议规模>
            <参会目的>${fchmd}</参会目的>
            <预期效果>${fyqxg}</预期效果>
            <公司参会人员>${fgschry}</公司参会人员>
            <会议申请及底层文件>${fjArray1.join(";")}</会议申请及底层文件>
            <借款金额>${fjkje}</借款金额>
            <借款金额大写>${fjkje_dx}</借款金额大写>
            <借款单号>${fjkdh}</借款单号>
            <借款用途>${fjkyt}</借款用途>
            <会议总结>${fjArray2.join(";")}</会议总结>
            <TaskID>${$("#taskId").val()}</TaskID>
            <申请人工号>${fsqrno}</申请人工号>
            <经办人工号>${fjbrno}</经办人工号>
            <部门负责人>${fbmfzr}</部门负责人>
            <部门分管领导>${fbmfgld}</部门分管领导>
            <财务审核人>${fcwshr}</财务审核人>
            <审批人>${fspr}</审批人>
        </洁丽康公司_会议活动申请_主表>
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
                   <Action>${action}</Action>
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
       <洁丽康公司_会议活动申请_主表>
            <单号>${fbillno}</单号>
            <申请人>${fsqr}</申请人>
            <申请部门>${fsqbm}</申请部门>
            <申请日期>${fsqrq}</申请日期>
            <是否借款>${fif_jk}</是否借款>
            <会议开始日期>${fksrq}</会议开始日期>
            <会议结束日期>${fjsrq}</会议结束日期>
            <经办人>${fjbr}</经办人>
            <会议名称>${fhymc}</会议名称>
            <主办方>${fzbf}</主办方>
            <会议地点>${fhydd}</会议地点>
            <会议类型>${fhylx}</会议类型>
            <会议规模>${fhygm}</会议规模>
            <参会目的>${fchmd}</参会目的>
            <预期效果>${fyqxg}</预期效果>
            <公司参会人员>${fgschry}</公司参会人员>
            <会议申请及底层文件>${fjArray1.join(";")}</会议申请及底层文件>
            <借款金额>${fjkje}</借款金额>
            <借款金额大写>${fjkje_dx}</借款金额大写>
            <借款单号>${fjkdh}</借款单号>
            <借款用途>${fjkyt}</借款用途>
            <会议总结>${fjArray2.join(";")}</会议总结>
            <TaskID>${$("#taskId").val()}</TaskID>
            <申请人工号>${fsqrno}</申请人工号>
            <经办人工号>${fjbrno}</经办人工号>
            <部门负责人>${fbmfzr}</部门负责人>
            <部门分管领导>${fbmfgld}</部门分管领导>
            <财务审核人>${fcwshr}</财务审核人>
            <审批人>${fspr}</审批人>
        </洁丽康公司_会议活动申请_主表>
                   `;
        xml += `
                       </FormData>
                    </XForm>
                   `;
        PostXml(xml);
    }
}