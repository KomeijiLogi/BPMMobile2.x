function prepMsg() {
    $("#fsqrq").val(getNowFormatDate(2));
    tapEvent();
    uploadOpt();
    var xml = `<?xml version= "1.0" ?>
                  <Requests>
                      <Params>
                      <Method>GetFormPostData</Method>
                      <ProcessName>洁丽康公司不合格品评审和处置申请</ProcessName>
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

var farr = [];
function tapEvent() {

    var fly_data = [
        {
            value: '',
            text:'进货检验'
        },
        {
            value: '',
            text:'过程工序'
        },
        {
            value: '',
            text:'成品检验'
        },
        {
            value: '',
            text:'交付后'
        }
    ];
    showPicker('fly', fly_data);

    $('input[type="checkbox"]').on('change', function () {
        var _self = this;
        if (_self.checked) {
            farr.push($(_self).val());
        } else {
            if (farr.includes($(_self).val())) {
                farr = farr.filter((val, i, arr) => {
                    if (val != $(_self).val()) {
                        return farr[i];
                    }
                });
            }
        }
        //console.log(farr);
    });

}


function initData(data, flag) {
    var item = data.FormDataSet.洁丽康公司_不合格品评审和处置申请_主表[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.单号);
    }
    farr = String(item.评审部门).split(",");
    $("#fsqr").val(item.申请人);
    $("#fsqbm").val(item.申请部门);
    $("#fsqrq").val(FormatterTimeYMS(item.申请日期));
    $("#fly").val(item.不合格品来源);
    $("#fcpmc").val(item.产品名称);
    $("#fggxh").val(item.规格型号);
    $("#fcz").val(item.材质);
    $("#fscph").val(item.生产批号);
    $("#fgx").val(item.工序);
    $("#fczz").val(item.操作者);
    $("#fsl").val(item.不合格数量);
    $("#fms").val(item.不合格描述);
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

    $('input[type="checkbox"]').each(function () {
        var _val = $(this).val();

        var _self = this;
        console.log(_val, farr.includes(_val));
        if (farr.includes(_val)) {
            $(_self).attr('checked', 'checked');
        }

    });

    $("#fyyfx").val(item.原因分析);

    $("#fmx_gn").val(item.对功能影响描述);
    $("#fif_gn").val(item.对功能影响风险是否可接受);
    $("#fmx_br").val(item.对病人影响描述);
    $("#fif_br").val(item.对病人影响风险是否可接受);
    $("#fmx_ys").val(item.对医生影响描述);
    $("#fif_ys").val(item.对医生影响风险是否可接受);

    $("#fczpd").val(item.处置判定);
    $("#fczbz").val(item.处置备注);
    $("#fif_jzcs").val(item.是否采取纠正预防措施);
    $("#fyy").val(item.不采取纠正措施原因);

    $("#taskId1").val(item.TaskID_纠正和预防措施管理提报);
    $("#taskId2").val(item.TaskID);
    $("#yanfajingli").val(item.研发经理);
    $("#jishuyingli").val(item.技术经理);
    $("#shengchanjingli").val(item.生产经理);
    $("#zhiliangjingli").val(item.质量经理);
    $("#jishuzongjian").val(item.技术总监);
    $("#frq_zj").val(item.技术总监审核日期);


}


action = '同意';

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

    var fczpd_data = [
        {
            value: '',
            text:'返工'
        },
        {
            value: '',
            text:'报废'
        },
        {
            value: '',
            text:'改为他用'
        },
        {
            value: '',
            text:'评审合格'
        }
    ];


    if (String(NodeName).match('开始') != null) {
        tapEvent();
        uploadOpt();
        $('input[type="checkbox"]').removeAttr('disabled');
        $('.upload-addbtn').show();
        $("#fcpmc,#fggxh,#fcz,#fscph,#fgx,#fczz,#fsl,#fms").removeAttr('readonly');

    } else if (String(NodeName) == ('研发经理')) {
        action = '提交';
        $("#yanfajingli").val(currentno);
        $("#fyyfx").removeAttr('readonly').attr('placeholder','请填写');
    } else if (String(NodeName) == ('技术经理') ) {
        action = '提交';
        $("#jishuyingli").val(currentno);
        $("#fyyfx").removeAttr('readonly').attr('placeholder', '请填写');
    } else if (String(NodeName) == ('质量经理') ) {
        action = '提交';
        $("#zhiliangjingli").val(currentno);
        $("#fyyfx").removeAttr('readonly').attr('placeholder', '请填写');
    } else if (String(NodeName) == ('采购经理') ) {
        action = '提交';
        $("#fyyfx").removeAttr('readonly').attr('placeholder', '请填写');
    } else if (String(NodeName) == ('班组长1') ) {
        action = '提交';
        $("#fyyfx").removeAttr('readonly').attr('placeholder', '请填写');
    } else if (String(NodeName) == ('班组长2') ) {
        action = '提交';
        $("#fyyfx").removeAttr('readonly').attr('placeholder', '请填写');
    } else if (String(NodeName) == ('班组长3') ) {
        action = '提交';
        $("#fyyfx").removeAttr('readonly').attr('placeholder', '请填写');
    } else if (String(NodeName) == ('生产经理')) {
        $("#shengchanjingli").val(currentno);
        $("#fyyfx").removeAttr('readonly').attr('placeholder', '请填写');
    } else if (String(NodeName) == ('技术经理判断影响') ) {
        $("#fmx_gn,#fmx_br,#fmx_ys").removeAttr('readonly').attr('placeholder', '请填写');
        showPicker('fif_gn', fif_data);
        showPicker('fif_br', fif_data);
        showPicker('fif_ys', fif_data);
        $("#fif_gn,#fif_br,#fif_ys").attr('placeholder', '请选择');
        $("#fczbz").removeAttr('readonly').attr('placeholder', '请填写');
        var picker = new mui.PopPicker();
        picker.setData(fczpd_data);
        $("#fczpd").on('tap', function () {
            var _self = this;
            picker.show(function (items) {
                $(_self).val(items[0].text);
                switch (items[0].text) {
                    case '返工':
                        $("#fczbz").parent().find('label').html('返工方案<i style="color:red;">*</i>');
                        break;
                    case '报废':
                        $("#fczbz").parent().find('label').html('报废原因<i style="color:red;">*</i>');
                        break;
                    case '改为他用':
                        $("#fczbz").parent().find('label').html('用途<i style="color:red;">*</i>');
                        break;
                    case '评审合格':
                        $("#fczbz").parent().find('label').html('合格理由<i style="color:red;">*</i>');
                        break;
                    default:
                        break;
                }
            });

        });
    } else if (String(NodeName) == ('研发经理判断影响') ) {
        $("#fmx_gn,#fmx_br,#fmx_ys").removeAttr('readonly').attr('placeholder', '请填写');
        showPicker('fif_gn', fif_data);
        showPicker('fif_br', fif_data);
        showPicker('fif_ys', fif_data);
        $("#fif_gn,#fif_br,#fif_ys").attr('placeholder', '请选择');

        $("#fczbz").removeAttr('readonly').attr('placeholder', '请填写');
        var picker = new mui.PopPicker();
        picker.setData(fczpd_data);
        $("#fczpd").on('tap', function () {
            var _self = this;
            picker.show(function (items) {
                $(_self).val(items[0].text);
                switch (items[0].text) {
                    case '返工':
                        $("#fczbz").parent().find('label').html('返工方案<i style="color:red;">*</i>');
                        break;
                    case '报废':
                        $("#fczbz").parent().find('label').html('报废原因<i style="color:red;">*</i>');
                        break;
                    case '改为他用':
                        $("#fczbz").parent().find('label').html('用途<i style="color:red;">*</i>');
                        break;
                    case '评审合格':
                        $("#fczbz").parent().find('label').html('合格理由<i style="color:red;">*</i>');
                        break;
                    default:
                        break;
                }
            });
        });


    } else if (String(NodeName) == ('质量保证部经理')) {
        showPicker('fif_jzcs', fif_data);
        $("#fczpd").attr('placeholder', '请选择');
        $("#fyy").removeAttr('readonly').attr('placeholder', '请填写');


    } else if (String(NodeName) == ('技术总监') ) {
        $("#jishuzongjian").val(currentno);
        $("#frq_zj").val(getNowFormatDate(2));


    }
}

function checkNes() {
    var nodeName = $("#nodeName").val();
    var flag = false;
    switch (nodeName) {
        case '研发经理':
            if (!$("#fyyfx").val()) {
                mui.toast('请填写原因分析');
                return flag;
            }

            break;
        case '技术经理':
            if (!$("#fyyfx").val()) {
                mui.toast('请填写原因分析');
                return flag;
            }
            break;
        case '质量经理':
            if (!$("#fyyfx").val()) {
                mui.toast('请填写原因分析');
                return flag;
            }
            break;
        case '采购经理':
            if (!$("#fyyfx").val()) {
                mui.toast('请填写原因分析');
                return flag;
            }
            break;
        case '班组长1':
            if (!$("#fyyfx").val()) {
                mui.toast('请填写原因分析');
                return flag;
            }
            break;
        case '班组长2':
            if (!$("#fyyfx").val()) {
                mui.toast('请填写原因分析');
                return flag;
            }
            break;
        case '班组长3':
            if (!$("#fyyfx").val()) {
                mui.toast('请填写原因分析');
                return flag;
            }
            break;
        case '生产经理':
            if (!$("#fyyfx").val()) {
                mui.toast('请填写原因分析');
                return flag;
            }
            break;
        case '技术经理判断影响':
            if (!$("#fmx_gn").val()) {
                mui.toast('请填写对功能影响程度描述');
                return flag;
            }
            if (!$("#fmx_br").val()) {
                mui.toast('请填写对病人影响程度描述');
                return flag;
            }
            if (!$("#fmx_ys").val()) {
                mui.toast('请填写对医生对影响程度描述');
                return flag;
            }

            if (!$("#fif_gn").val()) {
                mui.toast('请选择对功能风险是否可接受');
                return flag;
            }
            if (!$("#fif_br").val()) {
                mui.toast('请选择对病人风险是否可接受');
                return flag;
            }
            if (!$("#fif_ys").val()) {
                mui.toast('请选择对医生风险是否可接受');
                return flag;
            }

            if (!$("#fczpd").val()) {
                mui.toast('请选择处置判定');
                return flag;
            }
            if (!$("#fczpd").val()) {
                mui.toast('请填写处置备注');
                return flag;
            }
            break;
        case '研发经理判断影响':
            if (!$("#fmx_gn").val()) {
                mui.toast('请填写对功能影响程度描述');
                return flag;
            }
            if (!$("#fmx_br").val()) {
                mui.toast('请填写对病人影响程度描述');
                return flag;
            }
            if (!$("#fmx_ys").val()) {
                mui.toast('请填写对医生对影响程度描述');
                return flag;
            }

            if (!$("#fif_gn").val()) {
                mui.toast('请选择对功能风险是否可接受');
                return flag;
            }
            if (!$("#fif_br").val()) {
                mui.toast('请选择对病人风险是否可接受');
                return flag;
            }
            if (!$("#fif_ys").val()) {
                mui.toast('请选择对医生风险是否可接受');
                return flag;
            }

            if (!$("#fczpd").val()) {
                mui.toast('请选择处置判定');
                return flag;
            }
            if (!$("#fczpd").val()) {
                mui.toast('请填写处置备注');
                return flag;
            }
            break;
        case '质量保证部经理':
            if (!$("#fif_jzcs").val()) {
                mui.toast('请选择是否采取纠正预防措施');
                return flag;
            }
            break;
        case '技术总监':

            break;
        default:
            break;
    } 

    return true;
}

function Save() {
    var fsqr = $("#fsqr").val();
    var fsqbm = $("#fsqbm").val();
    var fsqrq = $("#fsqrq").val();
    var fly = $("#fly").val();
    var fcpmc = $("#fcpmc").val();
    var fggxh = $("#fggxh").val();
    var fcz = $("#fcz").val();
    var fscph = $("#fscph").val();
    var fgx = $("#fgx").val();
    var fczz = $("#fczz").val();
    var fsl = $("#fsl").val();
    var fms = $("#fms").val();

    var fyyfx = $("#fyyfx").val();
    var fmx_gn = $("#fmx_gn").val();
    var fif_gn = $("#fif_gn").val();
    var fmx_br = $("#fmx_br").val();
    var fif_br = $("#fif_br").val();
    var fmx_ys = $("#fmx_ys").val();
    var fif_ys = $("#fif_ys").val();
    var fczpd = $("#fczpd").val();
    var fczbz = $("#fczbz").val();
    var fczpd = $("#fczpd").val();
    var fyy = $("#fyy").val();
    var taskId1 = $("#taskId1").val();
    var taskId2 = $("#taskId2").val();
    var yanfajingli = $("#yanfajingli").val();
    var jishuyingli = $("#jishuyingli").val();
    var shengchanjingli = $("#shengchanjingli").val();
    var zhiliangjingli = $("#zhiliangjingli").val();
    var jishuzongjian = $("#jishuzongjian").val();
    var frq_zj = $("#frq_zj").val();

    if (!fly) {
        mui.toast('请选择不合格品来源');
        return;
    }
    if (!fcpmc) {
        mui.toast('请填写产品名称');
        return;
    }
    if (!fggxh) {
        mui.toast('请填写规格型号');
        return;
    }
    if (!fcz) {
        mui.toast('请填写材质');
        return;
    }
    if (!fscph) {
        mui.toast('请填写生产批号');
        return;
    }
    if (!fgx) {
        mui.toast('请填写工序');
        return;
    }
    if (!fczz) {
        mui.toast('请填写操作者');
        return;
    }
    if (!fsl) {
        mui.toast('请填写不合格数量');
        return;
    }
    if (!fms) {
        mui.toast('请填写不合格描述');
        return;
    }
    if (farr.length==0) {
        mui.toast('请选择评审部门');
        return;
    }

    var btnArry = ["取消", "确定"];
    mui.confirm('即将提交，是否确定？', '提交确认提醒', btnArry, function (e) {
        if (e.index == 1) {
            var xml = `<?xml version="1.0"?>
                        <XForm>
                            <Header>
                                <Method>Post</Method>
                                <ProcessName>洁丽康公司不合格品评审和处置申请</ProcessName>
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
 <洁丽康公司_不合格品评审和处置申请_主表>
            <单号>自动生成</单号>
            <申请人>${fsqr}</申请人>
            <申请部门>${fsqbm}</申请部门>
            <申请日期>${fsqrq}</申请日期>
            <不合格品来源>${fly}</不合格品来源>
            <产品名称>${fcpmc}</产品名称>
            <规格型号>${fggxh}</规格型号>
            <材质>${fcz}</材质>
            <生产批号>${fscph}</生产批号>
            <工序>${fgx}</工序>
            <操作者>${fczz}</操作者>
            <不合格数量>${fsl}</不合格数量>
            <不合格描述>${fms}</不合格描述>
            <附件>${fjArray.join(";")}</附件>
            <评审部门>${farr}</评审部门>
			
            <原因分析></原因分析>
			
            <对功能影响描述></对功能影响描述>
            <对功能影响风险是否可接受></对功能影响风险是否可接受>
            <对病人影响描述></对病人影响描述>
            <对病人影响风险是否可接受></对病人影响风险是否可接受>
            <对医生影响描述></对医生影响描述>
            <对医生影响风险是否可接受></对医生影响风险是否可接受>
			
            <处置判定></处置判定>
            <处置备注></处置备注>
            <是否采取纠正预防措施></是否采取纠正预防措施>
            <不采取纠正预防措施原因></不采取纠正预防措施原因>
			
			
            <TaskID_纠正和预防措施管理提报></TaskID_纠正和预防措施管理提报>
            <TaskID></TaskID>
            <研发经理></研发经理>
            <技术经理></技术经理>
            <生产经理></生产经理>
            <质量经理></质量经理>
            <技术总监></技术总监>
            <技术总监审核日期></技术总监审核日期>
        </洁丽康公司_不合格品评审和处置申请_主表>
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
    var fly = $("#fly").val();
    var fcpmc = $("#fcpmc").val();
    var fggxh = $("#fggxh").val();
    var fcz = $("#fcz").val();
    var fscph = $("#fscph").val();
    var fgx = $("#fgx").val();
    var fczz = $("#fczz").val();
    var fsl = $("#fsl").val();
    var fms = $("#fms").val();

    var fyyfx = $("#fyyfx").val();
    var fmx_gn = $("#fmx_gn").val();
    var fif_gn = $("#fif_gn").val();
    var fmx_br = $("#fmx_br").val();
    var fif_br = $("#fif_br").val();
    var fmx_ys = $("#fmx_ys").val();
    var fif_ys = $("#fif_ys").val();
    var fczpd = $("#fczpd").val();
    var fczbz = $("#fczbz").val();
    var fczpd = $("#fczpd").val();
    var fyy = $("#fyy").val();
    var taskId1 = $("#taskId1").val();
    var taskId2 = $("#taskId2").val();
    var yanfajingli = $("#yanfajingli").val();
    var jishuyingli = $("#jishuyingli").val();
    var shengchanjingli = $("#shengchanjingli").val();
    var zhiliangjingli = $("#zhiliangjingli").val();
    var jishuzongjian = $("#jishuzongjian").val();
    var frq_zj = $("#frq_zj").val();

    if (!fly) {
        mui.toast('请选择不合格品来源');
        return;
    }
    if (!fcpmc) {
        mui.toast('请填写产品名称');
        return;
    }
    if (!fggxh) {
        mui.toast('请填写规格型号');
        return;
    }
    if (!fcz) {
        mui.toast('请填写材质');
        return;
    }
    if (!fscph) {
        mui.toast('请填写生产批号');
        return;
    }
    if (!fgx) {
        mui.toast('请填写工序');
        return;
    }
    if (!fczz) {
        mui.toast('请填写操作者');
        return;
    }
    if (!fsl) {
        mui.toast('请填写不合格数量');
        return;
    }
    if (!fms) {
        mui.toast('请填写不合格描述');
        return;
    }
    if (farr.length == 0) {
        mui.toast('请选择评审部门');
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
 <洁丽康公司_不合格品评审和处置申请_主表>
            <单号>自动生成</单号>
            <申请人>${fsqr}</申请人>
            <申请部门>${fsqbm}</申请部门>
            <申请日期>${fsqrq}</申请日期>
            <不合格品来源>${fly}</不合格品来源>
            <产品名称>${fcpmc}</产品名称>
            <规格型号>${fggxh}</规格型号>
            <材质>${fcz}</材质>
            <生产批号>${fscph}</生产批号>
            <工序>${fgx}</工序>
            <操作者>${fczz}</操作者>
            <不合格数量>${fsl}</不合格数量>
            <不合格描述>${fms}</不合格描述>
            <附件>${fjArray.join(";")}</附件>
            <评审部门>${farr}</评审部门>
			
            <原因分析>${fyyfx}</原因分析>
			
            <对功能影响描述>${fmx_gn}</对功能影响描述>
            <对功能影响风险是否可接受>${fif_gn}</对功能影响风险是否可接受>
            <对病人影响描述>${fmx_br}</对病人影响描述>
            <对病人影响风险是否可接受>${fif_br}</对病人影响风险是否可接受>
            <对医生影响描述>${fmx_ys}</对医生影响描述>
            <对医生影响风险是否可接受>${fif_ys}</对医生影响风险是否可接受>
			
            <处置判定>${fczpd}</处置判定>
            <处置备注>${fczbz}</处置备注>
            <是否采取纠正预防措施>${fczpd}</是否采取纠正预防措施>
            <不采取纠正预防措施原因>${fyy}</不采取纠正预防措施原因>
			
			
            <TaskID_纠正和预防措施管理提报>${taskId1}</TaskID_纠正和预防措施管理提报>
            <TaskID>${taskId2}</TaskID>
            <研发经理>${yanfajingli}</研发经理>
            <技术经理>${jishuyingli}</技术经理>
            <生产经理>${shengchanjingli}</生产经理>
            <质量经理>${zhiliangjingli}</质量经理>
            <技术总监>${jishuzongjian}</技术总监>
            <技术总监审核日期>${frq_zj}</技术总监审核日期>
        </洁丽康公司_不合格品评审和处置申请_主表>
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
    var fly = $("#fly").val();
    var fcpmc = $("#fcpmc").val();
    var fggxh = $("#fggxh").val();
    var fcz = $("#fcz").val();
    var fscph = $("#fscph").val();
    var fgx = $("#fgx").val();
    var fczz = $("#fczz").val();
    var fsl = $("#fsl").val();
    var fms = $("#fms").val();

    var fyyfx = $("#fyyfx").val();
    var fmx_gn = $("#fmx_gn").val();
    var fif_gn = $("#fif_gn").val();
    var fmx_br = $("#fmx_br").val();
    var fif_br = $("#fif_br").val();
    var fmx_ys = $("#fmx_ys").val();
    var fif_ys = $("#fif_ys").val();
    var fczpd = $("#fczpd").val();
    var fczbz = $("#fczbz").val();
    var fczpd = $("#fczpd").val();
    var fyy = $("#fyy").val();
    var taskId1 = $("#taskId1").val();
    var taskId2 = $("#taskId2").val();
    var yanfajingli = $("#yanfajingli").val();
    var jishuyingli = $("#jishuyingli").val();
    var shengchanjingli = $("#shengchanjingli").val();
    var zhiliangjingli = $("#zhiliangjingli").val();
    var jishuzongjian = $("#jishuzongjian").val();
    var frq_zj = $("#frq_zj").val();

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
 <洁丽康公司_不合格品评审和处置申请_主表>
            <单号>自动生成</单号>
            <申请人>${fsqr}</申请人>
            <申请部门>${fsqbm}</申请部门>
            <申请日期>${fsqrq}</申请日期>
            <不合格品来源>${fly}</不合格品来源>
            <产品名称>${fcpmc}</产品名称>
            <规格型号>${fggxh}</规格型号>
            <材质>${fcz}</材质>
            <生产批号>${fscph}</生产批号>
            <工序>${fgx}</工序>
            <操作者>${fczz}</操作者>
            <不合格数量>${fsl}</不合格数量>
            <不合格描述>${fms}</不合格描述>
            <附件>${fjArray.join(";")}</附件>
            <评审部门>${farr}</评审部门>
			
            <原因分析>${fyyfx}</原因分析>
			
            <对功能影响描述>${fmx_gn}</对功能影响描述>
            <对功能影响风险是否可接受>${fif_gn}</对功能影响风险是否可接受>
            <对病人影响描述>${fmx_br}</对病人影响描述>
            <对病人影响风险是否可接受>${fif_br}</对病人影响风险是否可接受>
            <对医生影响描述>${fmx_ys}</对医生影响描述>
            <对医生影响风险是否可接受>${fif_ys}</对医生影响风险是否可接受>
			
            <处置判定>${fczpd}</处置判定>
            <处置备注>${fczbz}</处置备注>
            <是否采取纠正预防措施>${fczpd}</是否采取纠正预防措施>
            <不采取纠正预防措施原因>${fyy}</不采取纠正预防措施原因>
			
			
            <TaskID_纠正和预防措施管理提报>${taskId1}</TaskID_纠正和预防措施管理提报>
            <TaskID>${taskId2}</TaskID>
            <研发经理>${yanfajingli}</研发经理>
            <技术经理>${jishuyingli}</技术经理>
            <生产经理>${shengchanjingli}</生产经理>
            <质量经理>${zhiliangjingli}</质量经理>
            <技术总监>${jishuzongjian}</技术总监>
            <技术总监审核日期>${frq_zj}</技术总监审核日期>
        </洁丽康公司_不合格品评审和处置申请_主表>
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
 <洁丽康公司_不合格品评审和处置申请_主表>
            <单号>自动生成</单号>
            <申请人>${fsqr}</申请人>
            <申请部门>${fsqbm}</申请部门>
            <申请日期>${fsqrq}</申请日期>
            <不合格品来源>${fly}</不合格品来源>
            <产品名称>${fcpmc}</产品名称>
            <规格型号>${fggxh}</规格型号>
            <材质>${fcz}</材质>
            <生产批号>${fscph}</生产批号>
            <工序>${fgx}</工序>
            <操作者>${fczz}</操作者>
            <不合格数量>${fsl}</不合格数量>
            <不合格描述>${fms}</不合格描述>
            <附件>${fjArray.join(";")}</附件>
            <评审部门>${farr}</评审部门>
			
            <原因分析>${fyyfx}</原因分析>
			
            <对功能影响描述>${fmx_gn}</对功能影响描述>
            <对功能影响风险是否可接受>${fif_gn}</对功能影响风险是否可接受>
            <对病人影响描述>${fmx_br}</对病人影响描述>
            <对病人影响风险是否可接受>${fif_br}</对病人影响风险是否可接受>
            <对医生影响描述>${fmx_ys}</对医生影响描述>
            <对医生影响风险是否可接受>${fif_ys}</对医生影响风险是否可接受>
			
            <处置判定>${fczpd}</处置判定>
            <处置备注>${fczbz}</处置备注>
            <是否采取纠正预防措施>${fczpd}</是否采取纠正预防措施>
            <不采取纠正预防措施原因>${fyy}</不采取纠正预防措施原因>
			
			
            <TaskID_纠正和预防措施管理提报>${taskId1}</TaskID_纠正和预防措施管理提报>
            <TaskID>${taskId2}</TaskID>
            <研发经理>${yanfajingli}</研发经理>
            <技术经理>${jishuyingli}</技术经理>
            <生产经理>${shengchanjingli}</生产经理>
            <质量经理>${zhiliangjingli}</质量经理>
            <技术总监>${jishuzongjian}</技术总监>
            <技术总监审核日期>${frq_zj}</技术总监审核日期>
        </洁丽康公司_不合格品评审和处置申请_主表>
                   `;
        xml += `
                       </FormData>
                    </XForm>
                   `;
        PostXml(xml);
    }
}

