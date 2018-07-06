function prepMsg() {
    $("#fsqrq").val(getNowFormatDate(2));
    tapEvent();
    uploadOpt();

    var xml = `<?xml version= "1.0" ?>
                  <Requests>
                      <Params>
                      <Method>GetFormPostData</Method>
                      <ProcessName>洁丽康公司研发产品初样试制申请</ProcessName>
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
    $("#tjmx").on('tap', function () {
        var li = `
                <div id="mx" class="mui-card">
                    <div class="mui-input-row itemtitle">
                        <label>明细列表项</label>
                        <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>
                    </div>
                    <div class="mui-row cutOffLine padding">
                        <div class="mui-col-xs-6" style="display:flex;">
                            <label>试制文件编号<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fszwjbh" placeholder="请填写"></textarea>
                        </div>
                        <div class="mui-col-xs-6" style="display:flex;">
                            <label>试制数量<i style="color:red;">*</i></label>
                            <input type="number" id="fszsl" placeholder="请填写" style="padding-left:0;" />
                        </div>
                    </div>
                </div>
                  `;
        $("#mxlist").append(li);

    });

    $('body').on('input', '#fszsl', function () {
        var fhj = 0;
        $("#mxlist").find("#fszsl").each(function () {
            var _value = parseFloat($(this).val());
            _value = isNaN(_value) ? 0 : _value;
            fhj += _value;

        });
        $("#fhj").val(fhj);

    });
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
    showPicker('fif_xyjy', fif_data);
}

function initData(data, flag) {

    var item= data.FormDataSet.洁丽康公司_研发产品初样试制申请_主表[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.单号);
    }


    $("#fsqr").val(item.申请人);
    $("#fsqbm").val(item.申请部门);
    $("#fsqrq").val(FormatterTimeYMS(item.申请日期));
    $("#fsqbm").val(item.申请部门);


    var item_c = data.FormDataSet.洁丽康公司_研发产品初样试制申请_子表1;
    for (var i = 0; i < item_c.length; i++) {
        itemidArr.push(item_c[i].itemid);
        var li = `
                 <div id="mx" class="mui-card">
                    <div class="mui-input-row itemtitle">
                        <label>明细列表项</label>
                        <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>
                    </div>
                    <div class="mui-row cutOffLine padding">
                        <div class="mui-col-xs-6" style="display:flex;">
                            <label>试制文件编号<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fszwjbh" readonly>${item_c[i].试制文件编号}</textarea>
                        </div>
                        <div class="mui-col-xs-6" style="display:flex;">
                            <label>试制数量<i style="color:red;">*</i></label>
                            <input type="number" id="fszsl" readonly style="padding-left:0;" value="${item_c[i].试制数量}"/>
                        </div>
                    </div>
                </div>
                   `;
        $("#mxlist").append(li);


    }

    //$("#fhj").val(item.合计);
    var fhj = 0;
    $("#mxlist").find("#fszsl").each(function () {
        var _value = parseFloat($(this).val());
        _value = isNaN(_value) ? 0 : _value;
        fhj += _value;

    });
    $("#fhj").val(fhj);
    $("#fif_xyjy").val(item.是否需要检验);
    farr = String(item.生产工序).split(",");
    console.log(farr);
    $('input[type="checkbox"]').each(function () {
        var _val = $(this).val();
        
        var _self = this;
        console.log(_val,farr.includes(_val));
        if (farr.includes(_val)) {
            $(_self).attr('checked', 'checked');
        }

    });
    $("#fgxbz").val(item.工序备注);
    $("#fszsm").val(item.试制说明);
    $("#fszgcwt").val(item.试制过程问题);
    $("#fgygcwt").val(item.检验过程问题);
    $("#fcypj").val(item.初样评价);
    

    if (item.试制文件 != null && item.试制文件 != "") {
        var fjtmp = (String)(item.试制文件);

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
        $("input[type='checkbox']").removeAttr('disabled');

        $("#tjmx").show();
        $("#mxlist").find('span').each(function () {
            $(this).show();
        });

        $("#mxlist").find('#mx').each(function () {
            $(this).find('textarea,input').removeAttr('readonly');
        });
        $('#fgxbz,#fszsm').removeAttr('readonly');




    } else if (String(NodeName).match('生产计划部') != null) {
        $("#fszgcwt").removeAttr('readonly');

    } else if (String(NodeName).match('质量管理部') != null) {
        $("#fgygcwt").removeAttr('readonly');

    } else if (String(NodeName).match('申请人') != null) {
        $("#fcypj").removeAttr('readonly');
    }

}

class Mx {
    constructor(fszwjbh, fszsl) {
        this.fszwjbh = fszwjbh;
        this.fszsl = fszsl;
    }
    check() {
        if (!this.fszwjbh) {
            mui.toast('请填写试制文件编号');
            return true;
        }
        if (!this.fszsl) {
            mui.toast('请填写试制数量');
            return true;
        }
        return false;
    }
}

function checkNes() {
    var NodeName = $("#nodeName").val();
    console.log(NodeName);
    if (String(NodeName).match('生产计划部') != null) {
        if (!$('#fszgcwt').val()) {
            mui.toast('请填写试制过程问题');
            return false;
        }
    } else if (String(NodeName).match('质量管理部') != null) {
        if (!$('#fgygcwt').val()) {
            mui.toast('请填写检验过程问题');
            return false;
        }
    } else if (String(NodeName).match('申请人') != null) {
        if (!$('#fcypj').val()) {
            mui.toast('请填写初样评价');
            return false;
        }
    } 
    return true;
}

function Save() {

    var fsqr = $("#fsqr").val();
    var fsqbm = $("#fsqbm").val();
    var fsqrq = $("#fsqrq").val();
    var fhj = $("#fhj").val();
    var fif_xyjy = $("#fif_xyjy").val();

    if (!fif_xyjy) {
        mui.toast('请选择是否需要检验');
        return;
    }
    if (farr.length==0) {
        mui.toast('请选择生产工序');
        return;
    }
    if (!fgxbz) {
        mui.toast('请填写工序备注');
        return;
    }
    if (!fszsm) {
        mui.toast('请填写试制说明');
        return;
    }
    var fszgcwt = $("#fszgcwt").val();
    var fgygcwt = $("#fgygcwt").val();
    var fcypj = $("#fcypj").val();

    var mxlistArr = [];
    var mxflag = false;
    $("#mxlist").find("#mx").each(function () {
        var fszwjbh = $(this).find("#fszwjbh").val();
        var fszsl = $(this).find("#fszsl").val();

        var mx = new Mx(fszwjbh, fszsl);
        if (mx.check()) {
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
                                <ProcessName>洁丽康公司研发产品初样试制申请</ProcessName>
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
        <洁丽康公司_研发产品初样试制申请_主表>
            <单号>自动生成</单号>
            <申请人>${fsqr}</申请人>
            <申请部门>${fsqbm}</申请部门>
            <申请日期>${fsqrq}</申请日期>
            <是否需要检验>${fif_xyjy}</是否需要检验>
            <生产工序>${farr.join(",")}</生产工序>
            <工序备注>${fgxbz}</工序备注>
            <试制说明>${fszsm}</试制说明>
            <试制文件>${fjArray.join(";")}</试制文件>
            <试制过程问题>${fszgcwt}</试制过程问题>
            <检验过程问题>${fgygcwt}</检验过程问题>
            <初样评价>${fcypj}</初样评价>
        </洁丽康公司_研发产品初样试制申请_主表>
                    `;
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `
      <洁丽康公司_研发产品初样试制申请_子表1>
            <RelationRowGuid>${i+1}</RelationRowGuid>
            <RowPrimaryKeys></RowPrimaryKeys>
            <序号>${i + 1}</序号>
            <试制文件编号>${mxlistArr[i].fszwjbh}</试制文件编号>
            <试制数量>${mxlistArr[i].fszsl}</试制数量>
        </洁丽康公司_研发产品初样试制申请_子表1>
                        `;
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

    var fsqr = $("#fsqr").val();
    var fsqbm = $("#fsqbm").val();
    var fsqrq = $("#fsqrq").val();
    var fhj = $("#fhj").val();
    var fif_xyjy = $("#fif_xyjy").val();
    if (!fif_xyjy) {
        mui.toast('请选择是否需要检验');
        return;
    }
    if (farr.length == 0) {
        mui.toast('请选择生产工序');
        return;
    }
    if (!fgxbz) {
        mui.toast('请填写工序备注');
        return;
    }
    if (!fszsm) {
        mui.toast('请填写试制说明');
        return;
    }
    var fszgcwt = $("#fszgcwt").val();
    var fgygcwt = $("#fgygcwt").val();
    var fcypj = $("#fcypj").val();

    var mxlistArr = [];
    var mxflag = false;
    $("#mxlist").find("#mx").each(function () {
        var fszwjbh = $(this).find("#fszwjbh").val();
        var fszsl = $(this).find("#fszsl").val();

        var mx = new Mx(fszwjbh, fszsl);
        if (mx.check()) {
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
        <洁丽康公司_研发产品初样试制申请_主表>
            <单号>${fbillno}</单号>
            <申请人>${fsqr}</申请人>
            <申请部门>${fsqbm}</申请部门>
            <申请日期>${fsqrq}</申请日期>
            <是否需要检验>${fif_xyjy}</是否需要检验>
            <生产工序>${farr.join(",")}</生产工序>
            <工序备注>${fgxbz}</工序备注>
            <试制说明>${fszsm}</试制说明>
            <试制文件>${fjArray.join(";")}</试制文件>
            <试制过程问题>${fszgcwt}</试制过程问题>
            <检验过程问题>${fgygcwt}</检验过程问题>
            <初样评价>${fcypj}</初样评价>
        </洁丽康公司_研发产品初样试制申请_主表>
                    `;
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `
      <洁丽康公司_研发产品初样试制申请_子表1>
            <RelationRowGuid>${i + 1}</RelationRowGuid>
            <RowPrimaryKeys></RowPrimaryKeys>
            <序号>${i + 1}</序号>
            <试制文件编号>${mxlistArr[i].fszwjbh}</试制文件编号>
            <试制数量>${mxlistArr[i].fszsl}</试制数量>
        </洁丽康公司_研发产品初样试制申请_子表1>
                        `;
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

    var fsqr = $("#fsqr").val();
    var fsqbm = $("#fsqbm").val();
    var fsqrq = $("#fsqrq").val();
    var fhj = $("#fhj").val();
    var fif_xyjy = $("#fif_xyjy").val();



    var mxlistArr = [];
    var mxflag = false;
    $("#mxlist").find("#mx").each(function () {
        var fszwjbh = $(this).find("#fszwjbh").val();
        var fszsl = $(this).find("#fszsl").val();

        var mx = new Mx(fszwjbh, fszsl);
      
        mxlistArr.push(mx);
    });

    var fszgcwt = $("#fszgcwt").val();
    var fgygcwt = $("#fgygcwt").val();
    var fcypj = $("#fcypj").val();

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
        <洁丽康公司_研发产品初样试制申请_主表>
            <单号>${fbillno}</单号>
            <申请人>${fsqr}</申请人>
            <申请部门>${fsqbm}</申请部门>
            <申请日期>${fsqrq}</申请日期>
            <是否需要检验>${fif_xyjy}</是否需要检验>
            <生产工序>${farr.join(",")}</生产工序>
            <工序备注>${fgxbz}</工序备注>
            <试制说明>${fszsm}</试制说明>
            <试制文件>${fjArray.join(";")}</试制文件>
            <试制过程问题>${fszgcwt}</试制过程问题>
            <检验过程问题>${fgygcwt}</检验过程问题>
            <初样评价>${fcypj}</初样评价>
        </洁丽康公司_研发产品初样试制申请_主表>
                    `;
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `
      <洁丽康公司_研发产品初样试制申请_子表1>
            <RelationRowGuid>${i + 1}</RelationRowGuid>
            <RowPrimaryKeys>itemid=${itemidArr[i]}</RowPrimaryKeys>
            <序号>${i + 1}</序号>
            <试制文件编号>${mxlistArr[i].fszwjbh}</试制文件编号>
            <试制数量>${mxlistArr[i].fszsl}</试制数量>
        </洁丽康公司_研发产品初样试制申请_子表1>
                        `;
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
        <洁丽康公司_研发产品初样试制申请_主表>
            <单号>${fbillno}</单号>
            <申请人>${fsqr}</申请人>
            <申请部门>${fsqbm}</申请部门>
            <申请日期>${fsqrq}</申请日期>
            <是否需要检验>${fif_xyjy}</是否需要检验>
            <生产工序>${farr.join(",")}</生产工序>
            <工序备注>${fgxbz}</工序备注>
            <试制说明>${fszsm}</试制说明>
            <试制文件>${fjArray.join(";")}</试制文件>
            <试制过程问题>${fszgcwt}</试制过程问题>
            <检验过程问题>${fgygcwt}</检验过程问题>
            <初样评价>${fcypj}</初样评价>
        </洁丽康公司_研发产品初样试制申请_主表>
                    `;
        for (var i = 0; i < mxlistArr.length; i++) {
            xml += `
      <洁丽康公司_研发产品初样试制申请_子表1>
            <RelationRowGuid>${i + 1}</RelationRowGuid>
            <RowPrimaryKeys>itemid=${itemidArr[i]}</RowPrimaryKeys>
            <序号>${i + 1}</序号>
            <试制文件编号>${mxlistArr[i].fszwjbh}</试制文件编号>
            <试制数量>${mxlistArr[i].fszsl}</试制数量>
        </洁丽康公司_研发产品初样试制申请_子表1>
                        `;
        }
        xml += `
                       </FormData>
                    </XForm>
                   `;
        PostXml(xml);

    }

}