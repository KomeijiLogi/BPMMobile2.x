function prepMsg() {
    $("#fdate").val(getNowFormatDate(2));
    tapEvent();
    var xml = `<?xml version= "1.0" ?>
                  <Requests>
                      <Params>
                      <Method>GetFormPostData</Method>
                      <ProcessName>洁丽康公司其他费用申请</ProcessName>
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
        $("#fname").val(item.申请人);
        $("#fdept").val(item.申请部门);
        $("#fno").val(item.申请人工号);
        $("#ps").val(item.PS职位);
    }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
        if (XMLHttpRequest.status == "401") {
            mui.alert('授权过期，请重新打开页面');;
        } else if (XMLHttpRequest.status == "500") {
            mui.alert('服务器内部错误');
        }

    });
}

function tapEvent() {

    mui("#fif_jkd").each(function () {
        this.addEventListener('toggle', function (event) {
            //event.detail.isActive 可直接获取当前状态
            if (event.detail.isActive) {
                $("#fif_jk").val('是');
                $("#fjkcard").show();
            } else {
                $("#fif_jk").val('否');
                $("#fjkcard").hide();
            }
        });
    });

    $("#fjkje").on('input', () => {

        var fjkje = $("#fjkje").val();
        var fjkje_dx = atoc(fjkje);
        $("#fjkje_dx").val(fjkje_dx);
    });
    $("#tjmx").on('tap', () => {
        var li = `
                    <div id="mx" class="mui-card">
                        <div class="mui-input-row itemtitle">
                            <label>明细列表项</label>
                            <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>
                        </div>   
                       <div class="mui-row cutOffLine" style="padding:2vw;">
                            <div class="mui-col-xs-4" style="display:flex;">
                               <label>申请金额(元)<i style="color:red;">*</i></label>
                              <input type="number" id="fsqje" placeholder="待填"/>    
                            </div> 
                             <div class="mui-col-xs-4" style="display:flex;">
                               <label>费用事由<i style="color:red;">*</i></label>
                               <textarea rows="2" id="ffysy" placeholder="待填"></textarea> 
                            </div> 
                             <div class="mui-col-xs-4" style="display:flex;">
                                <label>预期完成目标<i style="color:red;">*</i></label>
                                 <textarea rows="2" id="fyqwcmb" placeholder="待填"></textarea> 
                            </div> 
                       </div>
                    </div>

                  `;
        $("#mxlist").append(li);
    });
    $("#mxlist").on('input', '#fsqje', () => {
        //console.log(this);
        calcTotal();
    });
}

function calcTotal() {
    var fhj_je = 0;
    $("#mxlist").find("#fje").each(function () {
        var fje = parseFloat($(this).val());
        fje = isNaN(fje) ? 0 : fje;
        fhj_je += fje;

    });
    $("#fhj_je").val(fhj_je);
    $("#fhj_je_dx").val(atoc(fhj_je));
}

function initData(data, flag) {
    var item = data.FormDataSet.洁丽康公司_费用支出计划申请_主表[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.fbillno);
    }
    $("#fname").val(item.申请人);
    $("#fdept").val(item.申请部门);
    $("#fdate").val(FormatterTimeYMS(item.申请日期));
    $("#fif_jk").val(item.是否借款);
    if (String(item.是否借款).match('是') != null) {
        $("#fif_jkd").addClass('mui-active');
        $("#fjkcard").show();
    }
    $("#fjkje").val(item.借款金额);
    $("#fjkje_dx").val(item.借款金额大写);
    $("#fjkdh").val(item.借款单号);
    $("#fjkyt").val(item.借款用途);
    if (item.附件) {
        var fjtmp = (String)(item.附件);
        fjArray = fjtmp.split(";");
        $.ajax({
            type: 'POST',
            url: '/api/bpm/GetAttachmentsInfo',
            data: { 'fileIds': fjArray },
            beforeSend: function (XHR) {
                XHR.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem('ticket'));
            }
        }).done((data) => {

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



        }).fail((e) => {
            console.log(e);
        });
    }
    $("#fhj_je").val(item.合计金额);
    $("#fhj_je_dx").val(item.合计金额大写);

    $("#fno").val(item.申请人工号);
    $("#fbmjl").val(item.部门经理);
    $("#ffgld").val(item.分管领导);
    $("#fcwshr").val(item.财务审核人);
    $("#fspr").val(item.总经理);
    $("#ps").val(item.PS岗位);
    $("#fsqrzw").val(item.申请人职位);
    var item_c = data.FormDataSet.洁丽康公司_费用支出计划申请_子表1;
    for (var i = 0; i < item_c.length; i++) {
        itemidArr.push(item_c[i].itemid);
        var li = `
                    <div id="mx" class="mui-card">
                        <div class="mui-input-row itemtitle">
                            <label>明细列表项</label>
                            <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>
                        </div>   
                       <div class="mui-row cutOffLine" style="padding:2vw;">
                            <div class="mui-col-xs-4" style="display:flex;">
                               <label>申请金额(元)<i style="color:red;">*</i></label>
                              <input type="number" id="fsqje" readonly value="${item_c[i].申请金额}"/>    
                            </div> 
                             <div class="mui-col-xs-4" style="display:flex;">
                               <label>费用事由<i style="color:red;">*</i></label>
                               <textarea rows="2" id="ffysy" readonly>${item_c[i].费用事由}</textarea> 
                            </div> 
                             <div class="mui-col-xs-4" style="display:flex;">
                                <label>预期完成目标<i style="color:red;">*</i></label>
                                 <textarea rows="2" id="fyqwcmb" readonly>${item_c[i].预期完成目标}</textarea> 
                            </div> 
                       </div>
                    </div>
                 `;
        $("#mxlist").append(li);
    }

}

function nodeControllerExp(NodeName) {
    if (String(NodeName).match('开始') != null) {
        $("#mxlist").find('span').each(function () {

            $(this).show();
        });
        $("#mxlist").find('input,textarea').each(function () {
            $(this).removeAttr('readonly');
        });
        tapEvent();
        upload();
        $("#fif_jkd").removeClass('mui-disabled');
    }
}
class Mx {

    constructor(fsqje, ffysy, fyqwcmb) {
        this.fsqje = fsqje;
        this.ffysy = ffysy;
        this.fyqwcmb = fyqwcmb;
    }
    check() {
        if (!this.fsqje) {
            mui.toast('请填写申请金额');
            return true;
        }
        if (!this.ffysy) {
            mui.toast('请填写费用事由');
            return true;
        }
        if (!this.fyqwcmb) {
            mui.toast('请填写预期完成目标');
            return true;
        }
        return false;
    }
}


function Save() {
    var fname = $("#fname").val();
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();
    var fif_jk = $("#fif_jk").val();
    var fjkje = $("#fjkje").val();
    var fjkje_dx = $("#fjkje_dx").val();
    var fjkdh = $("#fjkdh").val();
    var fjkyt = $("#fjkyt").val();
    var fhj_je = $("#fhj_je").val();
    var fhj_je_dx = $("#fhj_je_dx").val();

    var fno = $("#fno").val();
    var fbmjl = $("#fbmjl").val();
    var ffgld = $("#ffgld").val();
    var fcwshr = $("#fcwshr").val();
    var fspr = $("#fspr").val();
    var ps = $("#ps").val();
    var fsqrzw = $("#fsqrzw").val();

    if (String(fif_jk) == '是') {
        if (!fjkje) {
            mui.toast('请填写借款金额');
            return;
        }
        if (!fjkyt) {
            mui.toast('请填写借款用途');
            return;
        }
    }

    var mxflag = false;
    var mxlistArr = [];
    $("#mxlist").find("#mx").each(function () {
        var fsqje = $(this).find("#fsqje").val();
        var ffysy = $(this).find("#ffysy").val();
        var fyqwcmb = $(this).find("#fyqwcmb").val();


        var mx = new Mx(fsqje, ffysy, fyqwcmb);
        if (mx.check()) {
            mxflag = true;
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
                                <ProcessName>洁丽康公司汇款申请</ProcessName>
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
                     <洁丽康公司_费用支出计划申请_主表>
                        <单号>自动生成</单号>
                        <申请人>${fname}</申请人>
                        <申请部门>${fdept}</申请部门>
                        <申请日期>${fdate}</申请日期>
                        <是否借款>${fif_jk}</是否借款>
                        <合计金额>${fhj_je}</合计金额>
                        <合计金额大写>${fhj_je_dx}</合计金额大写>
                        <借款金额>${fjkje}</借款金额>
                        <借款金额大写>${fjkje_dx}</借款金额大写>
                        <借款单号>${fjkdh}</借款单号>
                        <借款用途>${fjkyt}</借款用途>
                        <附件>${fjArray.join(";")}</附件>
                        <TaskID></TaskID>
                        <申请人职位></申请人职位>
                        <申请人工号>${fno}</申请人工号>
                        <部门经理></部门经理>
                        <分管领导></分管领导>
                        <财务审核人></财务审核人>
                        <总经理></总经理>
                        <PS职位>${ps}</PS职位>
                    </洁丽康公司_费用支出计划申请_主表>
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

    var fname = $("#fname").val();
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();
    var fif_jk = $("#fif_jk").val();
    var fjkje = $("#fjkje").val();
    var fjkje_dx = $("#fjkje_dx").val();
    var fjkdh = $("#fjkdh").val();
    var fjkyt = $("#fjkyt").val();
    var fhj_je = $("#fhj_je").val();
    var fhj_je_dx = $("#fhj_je_dx").val();

    var fno = $("#fno").val();
    var fbmjl = $("#fbmjl").val();
    var ffgld = $("#ffgld").val();
    var fcwshr = $("#fcwshr").val();
    var fspr = $("#fspr").val();
    var ps = $("#ps").val();
    var fsqrzw = $("#fsqrzw").val();

    if (String(fif_jk) == '是') {
        if (!fjkje) {
            mui.toast('请填写借款金额');
            return;
        }
        if (!fjkyt) {
            mui.toast('请填写借款用途');
            return;
        }
    }
    var mxflag = false;
    var mxlistArr = [];
    $("#mxlist").find("#mx").each(function () {
        var fsqje = $(this).find("#fsqje").val();
        var ffysy = $(this).find("#ffysy").val();
        var fyqwcmb = $(this).find("#fyqwcmb").val();


        var mx = new Mx(fsqje, ffysy, fyqwcmb);
        if (mx.check()) {
            mxflag = true;
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
                     <洁丽康公司_费用支出计划申请_主表>
                        <单号>${fbillno}</单号>
                        <申请人>${fname}</申请人>
                        <申请部门>${fdept}</申请部门>
                        <申请日期>${fdate}</申请日期>
                        <是否借款>${fif_jk}</是否借款>
                        <合计金额>${fhj_je}</合计金额>
                        <合计金额大写>${fhj_je_dx}</合计金额大写>
                        <借款金额>${fjkje}</借款金额>
                        <借款金额大写>${fjkje_dx}</借款金额大写>
                        <借款单号>${fjkdh}</借款单号>
                        <借款用途>${fjkyt}</借款用途>
                        <附件>${fjArray.join(";")}</附件>
                        <TaskID>${$("#taskId").val()}</TaskID>
                        <申请人职位>${fsqrzw}</申请人职位>
                        <申请人工号>${fno}</申请人工号>
                        <部门经理>${fbmjl}</部门经理>
                        <分管领导>${ffgld}</分管领导>
                        <财务审核人>${fcwshr}</财务审核人>
                        <总经理>${fspr}</总经理>
                        <PS职位>${ps}</PS职位>
                    </洁丽康公司_费用支出计划申请_主表>
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

    var fname = $("#fname").val();
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();
    var fif_jk = $("#fif_jk").val();
    var fjkje = $("#fjkje").val();
    var fjkje_dx = $("#fjkje_dx").val();
    var fjkdh = $("#fjkdh").val();
    var fjkyt = $("#fjkyt").val();
    var fhj_je = $("#fhj_je").val();
    var fhj_je_dx = $("#fhj_je_dx").val();

    var fno = $("#fno").val();
    var fbmjl = $("#fbmjl").val();
    var ffgld = $("#ffgld").val();
    var fcwshr = $("#fcwshr").val();
    var fspr = $("#fspr").val();
    var ps = $("#ps").val();
    var fsqrzw = $("#fsqrzw").val();
 

    var mxflag = false;
    var mxlistArr = [];
    $("#mxlist").find("#mx").each(function () {
        var fsqje = $(this).find("#fsqje").val();
        var ffysy = $(this).find("#ffysy").val();
        var fyqwcmb = $(this).find("#fyqwcmb").val();


        var mx = new Mx(fsqje, ffysy, fyqwcmb);
      
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
                     <洁丽康公司_费用支出计划申请_主表>
                        <单号>${fbillno}</单号>
                        <申请人>${fname}</申请人>
                        <申请部门>${fdept}</申请部门>
                        <申请日期>${fdate}</申请日期>
                        <是否借款>${fif_jk}</是否借款>
                        <合计金额>${fhj_je}</合计金额>
                        <合计金额大写>${fhj_je_dx}</合计金额大写>
                        <借款金额>${fjkje}</借款金额>
                        <借款金额大写>${fjkje_dx}</借款金额大写>
                        <借款单号>${fjkdh}</借款单号>
                        <借款用途>${fjkyt}</借款用途>
                        <附件>${fjArray.join(";")}</附件>
                        <TaskID>${$("#taskId").val()}</TaskID>
                        <申请人职位>${fsqrzw}</申请人职位>
                        <申请人工号>${fno}</申请人工号>
                        <部门经理>${fbmjl}</部门经理>
                        <分管领导>${ffgld}</分管领导>
                        <财务审核人>${fcwshr}</财务审核人>
                        <总经理>${fspr}</总经理>
                        <PS职位>${ps}</PS职位>
                    </洁丽康公司_费用支出计划申请_主表>
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
                     <洁丽康公司_费用支出计划申请_主表>
                        <单号>${fbillno}</单号>
                        <申请人>${fname}</申请人>
                        <申请部门>${fdept}</申请部门>
                        <申请日期>${fdate}</申请日期>
                        <是否借款>${fif_jk}</是否借款>
                        <合计金额>${fhj_je}</合计金额>
                        <合计金额大写>${fhj_je_dx}</合计金额大写>
                        <借款金额>${fjkje}</借款金额>
                        <借款金额大写>${fjkje_dx}</借款金额大写>
                        <借款单号>${fjkdh}</借款单号>
                        <借款用途>${fjkyt}</借款用途>
                        <附件>${fjArray.join(";")}</附件>
                        <TaskID>${$("#taskId").val()}</TaskID>
                        <申请人职位>${fsqrzw}</申请人职位>
                        <申请人工号>${fno}</申请人工号>
                        <部门经理>${fbmjl}</部门经理>
                        <分管领导>${ffgld}</分管领导>
                        <财务审核人>${fcwshr}</财务审核人>
                        <总经理>${fspr}</总经理>
                        <PS职位>${ps}</PS职位>
                    </洁丽康公司_费用支出计划申请_主表>
                   `;
        xml += `
                       </FormData>
                    </XForm>
                   `;
        PostXml(xml);
    }
}