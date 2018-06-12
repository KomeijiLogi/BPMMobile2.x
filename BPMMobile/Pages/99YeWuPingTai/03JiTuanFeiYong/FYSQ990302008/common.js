function prepMsg() {
    $("#sqdate").val(getNowFormatDate(2));
    tapEvent();
    var xml = `<?xml version= "1.0" ?>
                  <Requests>
                      <Params>
                      <Method>GetFormPostData</Method>
                      <ProcessName>集团本部管理学院培训费申请</ProcessName>
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
        $("#dept_name").val(item.dept_name);
        $("#dept_no").val(item.dept_no);
        $("#fpxfbx").val(item.fpxfbx);
        $("#user_leadtitle").val(item.user_leadtitle);
        $("#user_name").val(item.user_name);
        $("#user_no").val(item.user_no);

    }).fail(function (e) {

    }).then(function (data) {
        searcHbudget();
        });
    uploadOpt();
}
function searcHbudget() {
    var xml = `<?xml version= "1.0" ?>
                    <Requests>
                        <Params>
                            <DataSource>BPM_EXPENSE</DataSource>
                            <ID>p_fysq_pxf</ID>
                            <Type>1</Type>
                            <Method>GetUserDataProcedure</Method>
                            <ProcedureName>p_fysq_pxf</ProcedureName>
                            <Filter>
                                <deptno>${$("#dept_no").val()}</deptno>
                                <ys_month>${$("#sqdate").val()}</ys_month>
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
        var budgetData = provideData.Tables[0].Rows[0];
        console.log(provideData);
        $("#yueys").val(budgetData.amt);
        $("#keyongys").val(budgetData.amt_hz);
        $("#yiyongys").val(budgetData.amt_yy);
       
        if (budgetData.amt_hz > 0) {
            $("#feiyongsx").val('预算内');
            $("#chaoysqk").val('未超支');
        } else {
            $("#feiyongsx").val('预算外');
            var p = formartNumber((budgetData.amt_yy - budgetData.amt) / (budgetData.amt == 0 ? 1 : budgetData.amt) * 100);
            
            $("#chaoysqk").val(p);
        }
    }).fail(function (e) {

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
        },
        {
            value: '',
            text: '威海火炬高技术产业开发区威高管理学院职业培训学校'
        }
    ];
    showPicker('comp_name', fgsmcdata);

    var opts = { "type": "date", "beginYear": new Date().getFullYear() - 1, "endYear": new Date().getFullYear() + 3 };

    var picker3 = new mui.DtPicker(opts);
    $('body').on('tap', '.dateChoosen', function () {
        var self = this;
        picker3.show(function (rs) {
            $(self).val(rs.text);
        });
    });
    var peixunlb_data = [
        {
            value: '',
            text:'内部讲师'
        },
        {
            value: '',
            text:'外部讲师'
        }
    ];
    showPicker('peixunlb', peixunlb_data);
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
    showPicker('if_cj', fif_data);

    var picker33 = new mui.PopPicker();
    picker33.setData(fif_data);
    $('#shifoujk').on('tap', () => {
        picker33.show((items) => {
            $("#shifoujk").val(items[0].text);
            if (items[0].text == '是') {
                $("#jkcard").show();
            } else {
                $("#jkcard").hide();
            }
        });
    });

    $('.mui-input-group').on('change', 'input[type="checkbox"]', function () {
        if (this.checked) {
            $(this).val(1);
            if ($(this).attr('id') == 'fpxfbx') {
                $("#fy_px").show();
            } else if ($(this).attr('id') == 'fqtfbx') {
                $("#fy_qt").show();
            }
        } else {
            $(this).val(0);
            if ($(this).attr('id') == 'fpxfbx') {
                $("#fy_px").hide();
            } else if ($(this).attr('id') == 'fqtfbx') {
                $("#fy_qt").hide();
            }
        }
        
    });


    var yssx_data = [
        {
            value: '',
            text:'预算内'
        },
        {
            value: '',
            text:'预算外'
        }

    ];
    showPicker('yssx', yssx_data);

    $("#tjmx").on('tap', function () {
        var li = `<div id="mx">
                    <div class="mui-input-row itemtitle">
                        <label>明细列表项</label>
                        <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>
                    </div>
                    <div class="mui-row cutOffLine" style="padding:3vw;">
                        <div class="mui-col-xs-6" style="display:flex;">
                            <label>费用项目<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fyxmmc" readonly placeholder="请选择"></textarea>
                        </div>
                        <div class="mui-col-xs-6" style="display:flex;">
                            <label>申请金额<i style="color:red;">*</i></label>
                            <input type="number" id="sqje" placeholder="请填写"/>
                        </div>                        
                    </div> 
                    <div class="mui-row cutOffLine" style="padding:3vw;">
                        <div class="mui-col-xs-12" style="display:flex;">
                            <label>备注说明</label>
                            <textarea rows="2" id="beizhusm" placeholder="请填写"></textarea>
                        </div>
                    </div>
                </div>
                  `;
        $("#mxlist").append(li);
    });
    $("#mxlist").on('input', 'input[type="number"]', function () {
        calcTotal();
    });
    $("#jkje").on('input', function () {
        $("#jkjedx").val($("#jkje").val());
    });
    $("#kcpxf").on('input', function () {
        calcT();
    });

}

function calcTotal() {
    var hj = 0;
    $('#mxlist').find('#sqje').each(function () {
        var sqje = parseFloat($(this).val());
        sqje = isNaN(sqje) ? 0 : sqje;
        hj += sqje - 0;
        $("#hjdx").val(atoc(hj));
    });
    calcT();
}

function calcT() {
    var amt_zmx = 0;
    var hj = parseFloat($("#hj").val());
    hj = isNaN(hj) ? 0 : hj;
    var kcpxf = parseFloat($("#kcpxf").val());
    kcpxf = isNaN(kcpxf) ? 0 : kcpxf;
    amt_zmx = hj + kcpxf;
    $("#amt_zdx").val(atoc(amt_zmx));

    var yueys = parseFloat($("#yueys").val());
    var keyongys = parseFloat($("#keyongys").val());
    var yiyongys = parseFloat($("#yiyongys").val());
    if (keyongys > amt_zmx) {
        $("#feiyongsx").val('预算内');
        $("#chaoysqk").val('未超支');
    } else {
        $("#feiyongsx").val('预算外');
        var p = formartNumber((yiyongys - keyongys + amt_zmx) / (keyongys == 0 ? 1 : keyongys) * 100);
        if (p > 100) {
            p = 100;
        }
        $("#chaoysqk").val(p);
    }
}

function deleteItem(context) {
    var btnArray = ['否', '是'];
    mui.confirm('确认删除？', '', btnArray, function (e) {
        if (e.index == 1) {
            $(context).parent().parent().remove();
            calcTotal();
        }
    });

}

var item = null;
var item_c = [];


function initData(data, flag) {
    item = data.FormDataSet.fysq_peixunf_m[0];
    if (flag) {
        $("#taskId").val(item.taskid);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.lscode);
    }
    $("#comp_name").val(item.comp_name);
    $("#dept_name").val(item.dept_name);
    $("#dept_no").val(item.dept_no);
    $("#user_name").val(item.user_name);
    $("#user_no").val(item.user_no);
    $("#sqdate").val(FormatterTimeYMS(item.sqdate));
    $("#user_leadtitle").val(item.user_leadtitle);
    $("#yueys").val(item.yueys);
    $("#keyongys").val(item.keyongys);
    $("#yiyongys").val(item.yiyongys);
    $("#if_verify").val(item.if_verify);
    $("#feiyongsx").val(item.feiyongsx);
    $("#chaoysqk").val(item.chaoysqk);
    $("#peixunlb").val(item.peixunlb);
    $("#shifoujk").val(item.shifoujk);
    $("#if_bx").val(item.if_bx);
    $("#amt_zmx").val(item.amt_zmx);
    $("#amt_zdx").val(item.amt_zdx);
    $("#fpxfbx").val(item.fpxfbx);
    $("#fqtfbx").val(item.fqtfbx);
    $("#beizhu").val(item.beizhu);
    $("#pxdate").val(FormatterTimeYMS(item.pxdate));
    $("#peixundd").val(item.peixundd);
    $("#peixundx").val(item.peixundx);
    $("#kcmc").val(item.kcmc);
    $("#peixunjgmc").val(item.peixunjgmc);
    $("#peixunjs").val(item.peixunjs);
    $("#yssx").val(item.yssx);
    $("#kcpxf").val(item.kcpxf);
    $("#kczy").val(item.kczy);
    $("#qdcg").val(item.qdcg);
    $("#hj").val(item.hj);
    if (item.pxtz != null && item.pxtz != "") {
        var fjtmp = (String)(item.pxtz);

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
    $("#hjdx").val(item.hjdx);
    $("#jkje").val(item.jkje);
    $("#jkjedx").val(item.jkjedx);
    $("#jkcode").val(item.jkcode);
    $("#jkrem").val(item.jkrem);

    if (item.shifoujk == '是') {
        $("#jkcard").show();
    } else {
        $("#jkcard").hide();
    }
    
    if (item.fpxfbx == '1') {
        $("#fpxfbx").attr('checked', 'checked');
    } else {
        $("#fpxfbx").removeAttr('checked');
    }

    if (item.fqtfbx == '1') {
        
        $("#fqtfbx").attr('checked', 'checked');

    } else {
        $("#fqtfbx").removeAttr('checked');
    }

    

    item_c = data.FormDataSet.fysq_peixunf_t;
    for (var i = 0; i < item_c.length; i++) {
        itemidArr.push(item_c[i].itemid);
        var li = `<div id="mx">
                    <div class="mui-input-row itemtitle">
                        <label>明细列表项</label>
                        <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>
                    </div>
                    <div class="mui-row cutOffLine" style="padding:3vw;">
                        <div class="mui-col-xs-6" style="display:flex;">
                            <label>费用项目<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fyxmmc" readonly>${item_c[i].fyxmmc}</textarea>
                        </div>
                        <div class="mui-col-xs-6" style="display:flex;">
                            <label>申请金额<i style="color:red;">*</i></label>
                            <input type="number" id="sqje" readonly value="${item_c[i].sqje}"/>
                        </div>                        
                    </div> 
                    <div class="mui-row cutOffLine" style="padding:3vw;">
                        <div class="mui-col-xs-12" style="display:flex;">
                            <label>备注说明</label>
                            <textarea rows="2" id="beizhusm" readonly>${item_c[i].beizhusm}</textarea>
                        </div>
                    </div>
                </div>
                  `;
        $("#mxlist").append(li);
    }


}

function nodeControllerExp(NodeName) {

    if (String(NodeName).match('开始') != null) {
        tapEvent();
        searcHbudget();
        $("#mxlist").find('span').each(function () {
            $(this).show();
        });
        upload();
        $("#mxlist").find('#sqje,#beizhusm').each(function () {
            $(this).removeAttr('readonly');
        });
        $(".mui-input-group").find('input[type="checkbox"]').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#beizhu,#jkje,#jkrem,#peixundd,#peixundx,#kcmc,#peixunjgmc,#peixunjs,#kcpxf,#kczy,#qdcg").removeAttr('readonly');


    }
}

class Mx {
    constructor(fyxmmc, sqje, beizhusm) {
        this.fyxmmc = fyxmmc;
        this.sqje = sqje;
        this.beizhusm = beizhusm;
    }
    check() {
        if (!this.fyxmmc) {
            mui.toast('请选择费用项目');
            return true;
        }
        if (!this.sqje) {
            mui.toast('请填写申请金额');
            return true;
        }
        return false;

    }
}


function Save() {
    var comp_name = $("#comp_name").val();
    var dept_name = $("#dept_name").val();
    var dept_no = $("#dept_no").val();
    var user_name = $("#user_name").val();
    var user_no = $("#user_no").val();
    var user_leadtitle = $("#user_leadtitle").val();
    var sqdate = $("#sqdate").val();
    var yueys = $("#yueys").val();
    var keyongys = $("#keyongys").val();
    var yiyongys = $("#yiyongys").val();
    var if_verify = $("#if_verify").val();
    var feiyongsx = $("#feiyongsx").val();
    var chaoysqk = $("#chaoysqk").val();
    var peixunlb = $("#peixunlb").val();
    var shifoujk = $("#shifoujk").val();
    var if_bx = $("#if_bx").val();
    var amt_zmx = $("#amt_zmx").val();
    var amt_zdx = $("#amt_zdx").val();
    var fpxfbx = $("#fpxfbx").val();
    var fqtfbx = $("#fqtfbx").val();
    var if_cj = $("#if_cj").val();
    var beizhu = $("#beizhu").val();
    var jkje = $("#jkje").val();
    var jkjedx = $("#jkjedx").val();
    var jkcode = $("#jkcode").val();
    var jkrem = $("#jkrem").val();
    var pxdate = $("#pxdate").val();
    var peixundd = $("#peixundd").val();
    var peixundx = $("#peixundx").val();
    var kcmc = $("#kcmc").val();
    var peixunjgmc = $("#peixunjgmc").val();
    var peixunjs = $("#peixunjs").val();
    var yssx = $("#yssx").val();
    var kcpxf = $("#kcpxf").val();
    var kczy = $("#kczy").val();
    var qdcg = $("#qdcg").val();
    var hj = $("#hj").val();
    var hjdx = $("#hjdx").val();
    if (!comp_name) {
        mui.toast('请选择公司名称');
        return;
    }
    if (!peixunlb) {
        mui.toast('请选择培训类别');
        return;
    }
    if (!shifoujk) {
        mui.toast('请选择是否借款');
        return;
    }
    if (shifoujk == '是' && !jkje) {
        mui.toast('请填写借款金额');
        return;
    }
    if (!pxdate) {
        mui.toast('请选择培训日期');
        return;
    }
    if (!peixundd) {
        mui.toast('请填写培训地点');
        return;
    }
    if (!peixundx) {
        mui.toast('请填写培训对象');
        return;
    }
    if (!kcmc) {
        mui.toast('请填写课程名称');
        return;
    }

    if (!peixunjgmc) {
        mui.toast('请填写培训机构名称');
        return;
    }
    if (!peixunjs) {
        mui.toast('请填写培训讲师');
        return;
    }
    if (!yssx) {
        mui.toast('请选择预算属性');
        return;
    }
    if (!kcpxf) {
        mui.toast('请填写课程培训费');
        return;
    }
    if (!kczy) {
        mui.toast('请填写课程摘要');
        return;
    }
    if (!qdcg) {
        mui.toast('请填写拟取得成果');
        return;
    }
    if (fjArray.length == 0) {
        mui.toast('请上传培训通知');
        return;
    }

    var mxlistArr = [];
    var mxflag = false;
    $("#mxlist").find("#mx").each(function () {
        var fyxmmc = $(this).find("#fyxmmc").val();
        var sqje = $(this).find("#sqje").val();
        var beizhusm = $(this).find("#beizhusm").val();
        var mx = new Mx(fyxmmc, sqje, beizhusm);
        if (mx.check()) {
            mxflag = !mxflag;
            return;
        }
        mxlistArr.push(mx);
    });
    if (mxflag) {
        return;
    }
    var btnArry = ["取消", "确定"];
    mui.confirm('即将提交，是否确定？', '提交确认提醒', btnArry, function (e) {
        if (e.index == 1) {
            var xml = `<?xml version="1.0"?>
                        <XForm>
                            <Header>
                                <Method>Post</Method>
                                <ProcessName>集团本部管理学院培训费申请</ProcessName>
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
         <fysq_peixunf_m>
            <lscode>自动生成</lscode>
            <comp_name>${comp_name}</comp_name>
            <taskid></taskid>
            <dept_name>${dept_name}</dept_name>
            <dept_no>${dept_no}</dept_no>
            <user_name>${user_name}</user_name>
            <user_no>${user_no}</user_no>
            <sqdate>${sqdate}</sqdate>
            <user_leadtitle>${user_leadtitle}</user_leadtitle>
            <yueys>${yueys}</yueys>
            <keyongys>${keyongys}</keyongys>
            <yiyongys>${yiyongys}</yiyongys>
            <if_verify>${if_verify}</if_verify>
            <feiyongsx>${feiyongsx}</feiyongsx>
            <chaoysqk>${chaoysqk}</chaoysqk>
            <peixunlb>${peixunlb}</peixunlb>
            <shifoujk>${shifoujk}</shifoujk>
            <if_bx>${if_bx}</if_bx>
            <amt_zmx>${amt_zmx}</amt_zmx>
            <amt_zdx>${amt_zdx}</amt_zdx>
            <fpxfbx>${fpxfbx}</fpxfbx>
            <fqtfbx>${fqtfbx}</fqtfbx>
            <beizhu>${beizhu}</beizhu>
            <pxdate>${pxdate}</pxdate>
            <peixundd>${peixundd}</peixundd>
            <peixundx>${peixundx}</peixundx>
            <kcmc>${kcmc}</kcmc>
            <peixunjgmc>${peixunjgmc}</peixunjgmc>
            <peixunjs>${peixunjs}</peixunjs>
            <yssx>${yssx}</yssx>
            <kcpxf>${kcpxf}</kcpxf>
            <kczy>${kczy}</kczy>
            <qdcg>${qdcg}</qdcg>
            <pxtz>${fjArray.join(";")}</pxtz>
            <hj>${hj}</hj>
            <hjdx>${hjdx}</hjdx>
            <jkje>${jkje}</jkje>
            <jkjedx>${jkjedx}</jkjedx>
            <jkcode>${jkcode}</jkcode>
            <jkrem>${jkrem}</jkrem>
        </fysq_peixunf_m>
                        
                    `;
            if (mxlistArr.length == 0) {
                xml += `
               <fysq_peixunf_t>
                    <RelationRowGuid>1</RelationRowGuid>
                    <RowPrimaryKeys></RowPrimaryKeys>
                    <fyxmmc></fyxmmc>
                    <sqje></sqje>
                    <beizhusm></beizhusm>
                </fysq_peixunf_t>
                       `;
            } else {
                for (var i = 0; i < mxlistArr.length; i++) {
                    xml += `
                   <fysq_peixunf_t>
                        <RelationRowGuid>${i + 1}</RelationRowGuid>
                        <RowPrimaryKeys></RowPrimaryKeys>
                        <fyxmmc>${mxlistArr[i].fyxmmc}</fyxmmc>
                        <sqje>${mxlistArr[i].sqje}</sqje>
                        <beizhusm>${mxlistArr[i].beizhusm}</beizhusm>
                    </fysq_peixunf_t>
                       `;
                }

            }
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

    var comp_name = $("#comp_name").val();
    var dept_name = $("#dept_name").val();
    var dept_no = $("#dept_no").val();
    var user_name = $("#user_name").val();
    var user_no = $("#user_no").val();
    var user_leadtitle = $("#user_leadtitle").val();
    var sqdate = $("#sqdate").val();
    var yueys = $("#yueys").val();
    var keyongys = $("#keyongys").val();
    var yiyongys = $("#yiyongys").val();
    var if_verify = $("#if_verify").val();
    var feiyongsx = $("#feiyongsx").val();
    var chaoysqk = $("#chaoysqk").val();
    var peixunlb = $("#peixunlb").val();
    var shifoujk = $("#shifoujk").val();
    var if_bx = $("#if_bx").val();
    var amt_zmx = $("#amt_zmx").val();
    var amt_zdx = $("#amt_zdx").val();
    var fpxfbx = $("#fpxfbx").val();
    var fqtfbx = $("#fqtfbx").val();
    var if_cj = $("#if_cj").val();
    var beizhu = $("#beizhu").val();
    var jkje = $("#jkje").val();
    var jkjedx = $("#jkjedx").val();
    var jkcode = $("#jkcode").val();
    var jkrem = $("#jkrem").val();
    var pxdate = $("#pxdate").val();
    var peixundd = $("#peixundd").val();
    var peixundx = $("#peixundx").val();
    var kcmc = $("#kcmc").val();
    var peixunjgmc = $("#peixunjgmc").val();
    var peixunjs = $("#peixunjs").val();
    var yssx = $("#yssx").val();
    var kcpxf = $("#kcpxf").val();
    var kczy = $("#kczy").val();
    var qdcg = $("#qdcg").val();
    var hj = $("#hj").val();
    var hjdx = $("#hjdx").val();
    if (!comp_name) {
        mui.toast('请选择公司名称');
        return;
    }
    if (!peixunlb) {
        mui.toast('请选择培训类别');
        return;
    }
    if (!shifoujk) {
        mui.toast('请选择是否借款');
        return;
    }
    if (shifoujk == '是' && !jkje) {
        mui.toast('请填写借款金额');
        return;
    }
    if (!pxdate) {
        mui.toast('请选择培训日期');
        return;
    }
    if (!peixundd) {
        mui.toast('请填写培训地点');
        return;
    }
    if (!peixundx) {
        mui.toast('请填写培训对象');
        return;
    }
    if (!kcmc) {
        mui.toast('请填写课程名称');
        return;
    }

    if (!peixunjgmc) {
        mui.toast('请填写培训机构名称');
        return;
    }
    if (!peixunjs) {
        mui.toast('请填写培训讲师');
        return;
    }
    if (!yssx) {
        mui.toast('请选择预算属性');
        return;
    }
    if (!kcpxf) {
        mui.toast('请填写课程培训费');
        return;
    }
    if (!kczy) {
        mui.toast('请填写课程摘要');
        return;
    }
    if (!qdcg) {
        mui.toast('请填写拟取得成果');
        return;
    }
    if (fjArray.length == 0) {
        mui.toast('请上传培训通知');
        return;
    }

    var mxlistArr = [];
    var mxflag = false;
    $("#mxlist").find("#mx").each(function () {
        var fyxmmc = $(this).find("#fyxmmc").val();
        var sqje = $(this).find("#sqje").val();
        var beizhusm = $(this).find("#beizhusm").val();
        var mx = new Mx(fyxmmc, sqje, beizhusm);
        if (mx.check()) {
            mxflag = !mxflag;
            return;
        }
        mxlistArr.push(mx);
    });
    if (mxflag) {
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
         <fysq_peixunf_m>
            <lscode>${fbillno}</lscode>
            <comp_name>${comp_name}</comp_name>
            <taskid>${$("#taskId").val()}</taskid>
            <dept_name>${dept_name}</dept_name>
            <dept_no>${dept_no}</dept_no>
            <user_name>${user_name}</user_name>
            <user_no>${user_no}</user_no>
            <sqdate>${sqdate}</sqdate>
            <user_leadtitle>${user_leadtitle}</user_leadtitle>
            <yueys>${yueys}</yueys>
            <keyongys>${keyongys}</keyongys>
            <yiyongys>${yiyongys}</yiyongys>
            <if_verify>${if_verify}</if_verify>
            <feiyongsx>${feiyongsx}</feiyongsx>
            <chaoysqk>${chaoysqk}</chaoysqk>
            <peixunlb>${peixunlb}</peixunlb>
            <shifoujk>${shifoujk}</shifoujk>
            <if_bx>${if_bx}</if_bx>
            <amt_zmx>${amt_zmx}</amt_zmx>
            <amt_zdx>${amt_zdx}</amt_zdx>
            <fpxfbx>${fpxfbx}</fpxfbx>
            <fqtfbx>${fqtfbx}</fqtfbx>
            <beizhu>${beizhu}</beizhu>
            <pxdate>${pxdate}</pxdate>
            <peixundd>${peixundd}</peixundd>
            <peixundx>${peixundx}</peixundx>
            <kcmc>${kcmc}</kcmc>
            <peixunjgmc>${peixunjgmc}</peixunjgmc>
            <peixunjs>${peixunjs}</peixunjs>
            <yssx>${yssx}</yssx>
            <kcpxf>${kcpxf}</kcpxf>
            <kczy>${kczy}</kczy>
            <qdcg>${qdcg}</qdcg>
            <pxtz>${fjArray.join(";")}</pxtz>
            <hj>${hj}</hj>
            <hjdx>${hjdx}</hjdx>
            <jkje>${jkje}</jkje>
            <jkjedx>${jkjedx}</jkjedx>
            <jkcode>${jkcode}</jkcode>
            <jkrem>${jkrem}</jkrem>
        </fysq_peixunf_m>
                        
                    `;
            if (mxlistArr.length == 0) {
                xml += `
               <fysq_peixunf_t>
                    <RelationRowGuid>1</RelationRowGuid>
                    <RowPrimaryKeys></RowPrimaryKeys>
                    <fyxmmc></fyxmmc>
                    <sqje></sqje>
                    <beizhusm></beizhusm>
                </fysq_peixunf_t>
                       `;
            } else {
                for (var i = 0; i < mxlistArr.length; i++) {
                    xml += `
                   <fysq_peixunf_t>
                        <RelationRowGuid>${i + 1}</RelationRowGuid>
                        <RowPrimaryKeys></RowPrimaryKeys>
                        <fyxmmc>${mxlistArr[i].fyxmmc}</fyxmmc>
                        <sqje>${mxlistArr[i].sqje}</sqje>
                        <beizhusm>${mxlistArr[i].beizhusm}</beizhusm>
                    </fysq_peixunf_t>
                       `;
                }

            }
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

    var comp_name = $("#comp_name").val();
    var dept_name = $("#dept_name").val();
    var dept_no = $("#dept_no").val();
    var user_name = $("#user_name").val();
    var user_no = $("#user_no").val();
    var user_leadtitle = $("#user_leadtitle").val();
    var sqdate = $("#sqdate").val();
    var yueys = $("#yueys").val();
    var keyongys = $("#keyongys").val();
    var yiyongys = $("#yiyongys").val();
    var if_verify = $("#if_verify").val();
    var feiyongsx = $("#feiyongsx").val();
    var chaoysqk = $("#chaoysqk").val();
    var peixunlb = $("#peixunlb").val();
    var shifoujk = $("#shifoujk").val();
    var if_bx = $("#if_bx").val();
    var amt_zmx = $("#amt_zmx").val();
    var amt_zdx = $("#amt_zdx").val();
    var fpxfbx = $("#fpxfbx").val();
    var fqtfbx = $("#fqtfbx").val();
    var if_cj = $("#if_cj").val();
    var beizhu = $("#beizhu").val();
    var jkje = $("#jkje").val();
    var jkjedx = $("#jkjedx").val();
    var jkcode = $("#jkcode").val();
    var jkrem = $("#jkrem").val();
    var pxdate = $("#pxdate").val();
    var peixundd = $("#peixundd").val();
    var peixundx = $("#peixundx").val();
    var kcmc = $("#kcmc").val();
    var peixunjgmc = $("#peixunjgmc").val();
    var peixunjs = $("#peixunjs").val();
    var yssx = $("#yssx").val();
    var kcpxf = $("#kcpxf").val();
    var kczy = $("#kczy").val();
    var qdcg = $("#qdcg").val();
    var hj = $("#hj").val();
    var hjdx = $("#hjdx").val();


    var mxlistArr = [];
    var mxflag = false;
    $("#mxlist").find("#mx").each(function () {
        var fyxmmc = $(this).find("#fyxmmc").val();
        var sqje = $(this).find("#sqje").val();
        var beizhusm = $(this).find("#beizhusm").val();
        var mx = new Mx(fyxmmc, sqje, beizhusm);
       
        mxlistArr.push(mx);
    });

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
         <fysq_peixunf_m>
            <lscode>${fbillno}</lscode>
            <comp_name>${comp_name}</comp_name>
            <taskid>${$("#taskId").val()}</taskid>
            <dept_name>${dept_name}</dept_name>
            <dept_no>${dept_no}</dept_no>
            <user_name>${user_name}</user_name>
            <user_no>${user_no}</user_no>
            <sqdate>${sqdate}</sqdate>
            <user_leadtitle>${user_leadtitle}</user_leadtitle>
            <yueys>${yueys}</yueys>
            <keyongys>${keyongys}</keyongys>
            <yiyongys>${yiyongys}</yiyongys>
            <if_verify>${if_verify}</if_verify>
            <feiyongsx>${feiyongsx}</feiyongsx>
            <chaoysqk>${chaoysqk}</chaoysqk>
            <peixunlb>${peixunlb}</peixunlb>
            <shifoujk>${shifoujk}</shifoujk>
            <if_bx>${if_bx}</if_bx>
            <amt_zmx>${amt_zmx}</amt_zmx>
            <amt_zdx>${amt_zdx}</amt_zdx>
            <fpxfbx>${fpxfbx}</fpxfbx>
            <fqtfbx>${fqtfbx}</fqtfbx>
            <beizhu>${beizhu}</beizhu>
            <pxdate>${pxdate}</pxdate>
            <peixundd>${peixundd}</peixundd>
            <peixundx>${peixundx}</peixundx>
            <kcmc>${kcmc}</kcmc>
            <peixunjgmc>${peixunjgmc}</peixunjgmc>
            <peixunjs>${peixunjs}</peixunjs>
            <yssx>${yssx}</yssx>
            <kcpxf>${kcpxf}</kcpxf>
            <kczy>${kczy}</kczy>
            <qdcg>${qdcg}</qdcg>
            <pxtz>${fjArray.join(";")}</pxtz>
            <hj>${hj}</hj>
            <hjdx>${hjdx}</hjdx>
            <jkje>${jkje}</jkje>
            <jkjedx>${jkjedx}</jkjedx>
            <jkcode>${jkcode}</jkcode>
            <jkrem>${jkrem}</jkrem>
        </fysq_peixunf_m>
                        
                    `;
            if (mxlistArr.length == 0) {
                xml += `
               <fysq_peixunf_t>
                    <RelationRowGuid>1</RelationRowGuid>
                    <RowPrimaryKeys></RowPrimaryKeys>
                    <fyxmmc></fyxmmc>
                    <sqje></sqje>
                    <beizhusm></beizhusm>
                </fysq_peixunf_t>
                       `;
            } else {
                for (var i = 0; i < mxlistArr.length; i++) {
                    xml += `
                   <fysq_peixunf_t>
                        <RelationRowGuid>${i + 1}</RelationRowGuid>
                        <RowPrimaryKeys>itemid=${itemidArr[i]}</RowPrimaryKeys>
                        <fyxmmc>${mxlistArr[i].fyxmmc}</fyxmmc>
                        <sqje>${mxlistArr[i].sqje}</sqje>
                        <beizhusm>${mxlistArr[i].beizhusm}</beizhusm>
                    </fysq_peixunf_t>
                       `;
                }

            }
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
         <fysq_peixunf_m>
            <lscode>${fbillno}</lscode>
            <comp_name>${comp_name}</comp_name>
            <taskid>${$("#taskId").val()}</taskid>
            <dept_name>${dept_name}</dept_name>
            <dept_no>${dept_no}</dept_no>
            <user_name>${user_name}</user_name>
            <user_no>${user_no}</user_no>
            <sqdate>${sqdate}</sqdate>
            <user_leadtitle>${user_leadtitle}</user_leadtitle>
            <yueys>${yueys}</yueys>
            <keyongys>${keyongys}</keyongys>
            <yiyongys>${yiyongys}</yiyongys>
            <if_verify>${if_verify}</if_verify>
            <feiyongsx>${feiyongsx}</feiyongsx>
            <chaoysqk>${chaoysqk}</chaoysqk>
            <peixunlb>${peixunlb}</peixunlb>
            <shifoujk>${shifoujk}</shifoujk>
            <if_bx>${if_bx}</if_bx>
            <amt_zmx>${amt_zmx}</amt_zmx>
            <amt_zdx>${amt_zdx}</amt_zdx>
            <fpxfbx>${fpxfbx}</fpxfbx>
            <fqtfbx>${fqtfbx}</fqtfbx>
            <beizhu>${beizhu}</beizhu>
            <pxdate>${pxdate}</pxdate>
            <peixundd>${peixundd}</peixundd>
            <peixundx>${peixundx}</peixundx>
            <kcmc>${kcmc}</kcmc>
            <peixunjgmc>${peixunjgmc}</peixunjgmc>
            <peixunjs>${peixunjs}</peixunjs>
            <yssx>${yssx}</yssx>
            <kcpxf>${kcpxf}</kcpxf>
            <kczy>${kczy}</kczy>
            <qdcg>${qdcg}</qdcg>
            <pxtz>${fjArray.join(";")}</pxtz>
            <hj>${hj}</hj>
            <hjdx>${hjdx}</hjdx>
            <jkje>${jkje}</jkje>
            <jkjedx>${jkjedx}</jkjedx>
            <jkcode>${jkcode}</jkcode>
            <jkrem>${jkrem}</jkrem>
        </fysq_peixunf_m>
                        
                    `;
        if (mxlistArr.length == 0) {
            xml += `
               <fysq_peixunf_t>
                    <RelationRowGuid>1</RelationRowGuid>
                    <RowPrimaryKeys></RowPrimaryKeys>
                    <fyxmmc></fyxmmc>
                    <sqje></sqje>
                    <beizhusm></beizhusm>
                </fysq_peixunf_t>
                       `;
        } else {
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `
                   <fysq_peixunf_t>
                        <RelationRowGuid>${i + 1}</RelationRowGuid>
                        <RowPrimaryKeys>itemid=${itemidArr[i]}</RowPrimaryKeys>
                        <fyxmmc>${mxlistArr[i].fyxmmc}</fyxmmc>
                        <sqje>${mxlistArr[i].sqje}</sqje>
                        <beizhusm>${mxlistArr[i].beizhusm}</beizhusm>
                    </fysq_peixunf_t>
                       `;
            }
            
        }
        xml += `
                       </FormData>
                    </XForm>
                   `;
        //console.log(xml);
        PostXml(xml);
    }
}