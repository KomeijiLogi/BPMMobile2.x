function prepMsg() {
    $("#fdate").val(getNowFormatDate(2));
    tapEvent();
    var xml = `<?xml version= "1.0" ?>
                  <Requests>
                      <Params>
                      <Method>GetFormPostData</Method>
                      <ProcessName>食品餐饮公司工程物资采购申请</ProcessName>
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
        $("#fname").val(item.fname);
        $("#fdept").val(item.fdept);
    }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
        if (XMLHttpRequest.status == "401") {
            mui.alert('授权过期，请重新打开页面');;
        } else if (XMLHttpRequest.status == "500") {
            mui.alert('服务器内部错误');
        }

    });
    upload();
}

function tapEvent() {

    $("#tjmx").on('tap', () => {
        var li = `<div id="mx" class="mui-card">
                     <div class="mui-input-row itemtitle">
                        <label>明细列表项</label>
                        <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>
                     </div>
                     <div class="mui-row cutOffLine" style="padding-left:.8rem;">
                         <div class="mui-col-xs-4 " style="display:flex;">
                              <label>品名<i style="color:red;">*</i></label>
                              <input type="text" id="fpm" placeholder="请填写"/>
                         </div>
                         <div class="mui-col-xs-4 " style="display:flex;">
                              <label>单位<i style="color:red;">*</i></label>
                              <input type="text" id="fdw" placeholder="请填写"/>
                         </div>
                          <div class="mui-col-xs-4 " style="display:flex;">
                              <label>规格<i style="color:red;">*</i></label>
                              <input type="text" id="fgg" placeholder="请填写"/>
                         </div>
                     </div>
                     <div class="mui-row cutOffLine" style="padding-left:.8rem;">
                          <div class="mui-col-xs-4 " style="display:flex;">
                              <label>数量<i style="color:red;">*</i></label>
                              <input type="number" id="fsl" placeholder="请填写"/>
                          </div>
                          <div class="mui-col-xs-4 " style="display:flex;">
                              <label>采购单价<i style="color:red;">*</i></label> 
                              <input type="number" id="fcgdj" placeholder="请填写"/>
                          </div>
                          <div class="mui-col-xs-4 " style="display:flex;">
                              <label>采购总价</label> 
                              <input type="number" id="fcgzj" readonly/>
                          </div>                             
                     </div>
                    <div class="mui-row cutOffLine" style="padding-left:.8rem;">
                         <div class="mui-col-xs-6 " style="display:flex;">
                             <label>采购要求</label>
                             <textarea rows="2" id="fcgyq" name="fcgyq" placeholder="请填写"></textarea>
                         </div>  
                         <div class="mui-col-xs-6 " style="display:flex;">
                             <label>采购供应商<i style="color:red;">*</i></label>
                             <textarea rows="2" id="fcggys" name="fcggys" placeholder="请填写"></textarea>
                         </div>  
                     </div>
                  </div>
                 `;

        $("#mxlist").append(li);
        $("#mxlist").find("#fsl,#fcgdj").each(function () {
            $(this).on('input', function () {
                calcPrice(this);
                
            });
        });
    });


    var fsybmdata = [
        {
            value: '',
            text:'设备部'
        },
        {
            value: '',
            text:'川菜馆'
        },
        {
            value: '',
            text:'初村生态园'
        },
        {
            value: '',
            text:'综合服务部'
        },
        {
            value: '',
            text:'威高醉香阁'
        },
        {
            value: '',
            text:'营养餐运营部'
        },
        {
            value: '',
            text:'食堂运营部'
        },
        {
            value: '',
            text:'管理学院后勤'
        }
    ];

    showPicker('fsybm', fsybmdata);
}

function calcPrice(context) {
    var fsl = parseFloat($(context).parent().parent().parent().find("#fsl").val());
    var fcgdj = parseFloat($(context).parent().parent().parent().find("#fcgdj").val());
    var fcgzj = 0;

    fsl = isNaN(fsl) ? 0 : fsl;
    fcgdj = isNaN(fcgdj) ? 0 : fcgdj;
    fcgzj = fsl * fcgdj;

    $(context).parent().parent().find("#fcgzj").val(fcgzj);
    
}

function calcTotal() {

    var fczj_total = 0;
    $("#mxlist").find("#fcgzj").each(function () {
        var value = parseFloat($(this).val());
        value = isNaN(value) ? 0 : value;
        fczj_total += value;

    });
    $("#fczj_total").val(fczj_total);


} 

function initData(data, flag) {
    var item = data.FormDataSet.BPM_LYCYGCWZCGSQ_A[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.fbillno);
    }
    $("#fname").val(item.fname);
    $("#fdept").val(item.fdept);
    $("#fdate").val(FormatterTimeYMS(item.fdate));
    $("#ftel").val(item.ftel);
    $("#fsybm").val(item.fsybm);
   

    if (item.ffj != null && item.ffj != "") {
        var fjtmp = (String)(item.ffj);

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

                            li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '"><img src="../../../../Content/images/xlsx@2x.png"/></div>';

                        } else if ((data[i].Ext).indexOf("doc") != -1) {

                            li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '"><img src="../../../../Content/images/docx@2x.png"/></div>';

                        } else if ((data[i].Ext).indexOf("ppt") != -1) {

                            li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '"><img src="../../../../Content/images/ppt@2x.png"/></div>';

                        } else if ((data[i].Ext).indexOf("pdf") != -1) {

                            li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '"><img src="../../../../Content/images/pdf@2x.png"/></div>';

                        } else if ((data[i].Ext).indexOf("zip") != -1 || (data[i].Ext).indexOf("rar") != -1 || (data[i].Ext).indexOf("7z") != -1) {

                            li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '"><img src="../../../../Content/images/zip@2x.png"/></div>';

                        } else if ((data[i].Ext).indexOf("txt") != -1) {

                            li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '"><img src="../../../../Content/images/txt@2x.png"/></div>';

                        } else {
                            li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '"><img src="../../../../Content/images/unkown@2x.png"/></div>';
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

    var item_c = data.FormDataSet.BPM_LYCYGCWZCGSQ_B;
    for (var i = 0; i < item_c.length; i++) {
        itemidArr.push(item_c[i].itemid);
        var li = `
               <div id="mx" class="mui-card">
                     <div class="mui-input-row itemtitle">
                        <label>明细列表项</label>
                        <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>
                     </div>
                     <div class="mui-row cutOffLine" style="padding-left:.8rem;">
                         <div class="mui-col-xs-3 " style="display:flex;">
                             <label>品名<i style="color:red;">*</i></label>
                             <input type="text" id="fpm" name="fpm" readonly value="${item_c[i].fpm}" />
                         </div>
                         <div class="mui-col-xs-3 " style="display:flex;">
                             <label>单位<i style="color:red;">*</i></label> 
                             <input type="text" id="fdw" name="fdw" readonly value="${item_c[i].funit}" />
                         </div>
                          <div class="mui-col-xs-3 " style="display:flex;">
                             <label>规格<i style="color:red;">*</i></label> 
                             <input type="text" id="fgg" name="fgg" readonly value="${item_c[i].fgg}" />
                         </div>  
                         <div class="mui-col-xs-3 " style="display:flex;">
                             <label>数量<i style="color:red;">*</i></label>
                             <input type="number" id="fsl" name="fsl" readonly value="${item_c[i].fsl}" />
                         </div>
                     </div> 
                     <div class="mui-row cutOffLine" style="padding-left:.8rem;">
                         
                         <div class="mui-col-xs-4 " style="display:flex;">
                              <label>采购单价<i style="color:red;">*</i></label>
                              <input type="number" id="fcgdj" name="fcgdj" readonly  value="${item_c[i].fcgdj}" />
                         </div>
                         <div class="mui-col-xs-4 " style="display:flex;">
                              <label>采购总价</label>
                              <input type="number" id="fcgzj" name="fcgzj" readonly value="${item_c[i].fcgzj}"/>
                         </div>
                     </div>  
                     <div class="mui-row cutOffLine" style="padding-left:.8rem;">
                         <div class="mui-col-xs-6 " style="display:flex;">
                             <label>采购要求</label>
                             <textarea rows="2" id="fcgyq" name="fcgyq" readonly>${item_c[i].fcgyq}</textarea>
                         </div>  
                         <div class="mui-col-xs-6 " style="display:flex;">
                             <label>采购供应商<i style="color:red;">*</i></label>
                             <textarea rows="2" id="fcggys" name="fcggys" readonly>${item_c[i].fgys}</textarea>
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
        $("#ftel").removeAttr('readonly');

        $("#mxlist").find('span').each(function () {
            $(this).show();
        });
        $(".upload-addbtn").show();

        upload();
        $("#mxlist").find("#fsl,#fcgdj").each(function () {
            $(this).on('input', function () {
                calcPrice(this);
            });
        });
        $("#mxlist").find("#fpm,#fdw,#fgg,#fsl,#fcgdj,#fcgyq,#fcggys").each(function () {
            $(this).removeAttr('readonly');
        });
    }
}


class MxItem {
    constructor(fpm, fdw, fgg, fsl, fcgdj, fcgzj, fcgyq, fcggys) {
        this.fpm = fpm;
        this.fdw = fdw;
        this.fgg = fgg;
        this.fsl = fsl;     
        this.fcgdj = fcgdj;
        this.fcgzj = fcgzj;
        this.fcgyq = fcgyq;
        this.fcggys = fcggys;
    }
    check() {
        if (!this.fpm) {
            mui.toast('请填写品名');
            return false;
        }
        if (!this.fdw) {
            mui.toast('请填写单位');
            return false;
        }
        if (!this.fgg) {
            mui.toast('请填写规格');
            return false;
        }
        if (!this.fsl) {
            mui.toast('请填写数量');
            return false;
        }
      
        if (!this.fcgdj) {
            mui.toast('请填写采购单价');
            return false;
        }
        if (!this.fcggys) {
            mui.toast('请填写采购供应商');
            return false;
        }
        return true;
    }
}


function Save() {
    var fname = $("#fname").val();
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();

    var ftel = $("#ftel").val();
    var fsybm = $("#fsybm").val();
    var fczj_total = $("#fczj_total").val();

    if (!fsybm) {
        mui.toast('请选择使用部门');
        return;
    }

    var mxflag = false;
    var mxlistArr = [];
    $("#mxlist").find("#mx").each(function () {
        var fpm = $(this).find("#fpm").val();
        var fdw = $(this).find("#fdw").val();
        var fgg = $(this).find("#fgg").val();
        var fsl = $(this).find("#fsl").val();
        var fcgdj = $(this).find("#fcgdj").val();
        var fcgzj = $(this).find("#fcgzj").val();
        var fcgyq = $(this).find("#fcgyq").val();
        var fcggys = $(this).find("#fcggys").val();

        var mx = new MxItem(fpm, fdw, fgg, fsl, fcgdj, fcgzj, fcgyq, fcggys);
        if (!mx.check()) {
            mxflag = false;
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
                                <ProcessName>食品餐饮公司工程物资采购申请</ProcessName>
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
                     <BPM_LYCYGCWZCGSQ_A>
                        <fbillno>自动生成</fbillno>
                        <fname>${fname}</fname>
                        <fdept>${fdept}</fdept>
                        <fdate>${fdate}</fdate>
                        <ftel>${ftel}</ftel>
                        <fsybm>${fsybm}</fsybm>
                        <ffj>${fjArray.join(";")}</ffj>
                    </BPM_LYCYGCWZCGSQ_A>
                   `;
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `
                         <BPM_LYCYGCWZCGSQ_B>
                            <RelationRowGuid>${i+1}</RelationRowGuid>
                            <RowPrimaryKeys></RowPrimaryKeys>
                            <fentryno>${i + 1}</fentryno>
                            <fpm>${mxlistArr[i].fpm}</fpm>
                            <funit>${mxlistArr[i].fdw}</funit>
                            <fgg>${mxlistArr[i].fgg}</fgg>
                            <fsl>${mxlistArr[i].fsl}</fsl>
                            <fcgdj>${mxlistArr[i].fcgdj}</fcgdj>
                            <fcgzj>${mxlistArr[i].fcgzj}</fcgzj>
                            <fcgyq>${mxlistArr[i].fcgyq}</fcgyq>
                            <fgys>${mxlistArr[i].fcggys}</fgys>
                        </BPM_LYCYGCWZCGSQ_B>
                       `;
            }
            xml += ` </FormData>
                    </XForm>
                   `;
            PostXml(xml);
        }
    });

}
function reSave() {
    var pid = $("#stepId").val();
    var fbillno = $("#fbillno").val();
    var fname = $("#fname").val();
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();

    var ftel = $("#ftel").val();
    var fsybm = $("#fsybm").val();
    var fczj_total = $("#fczj_total").val();

    if (!fsybm) {
        mui.toast('请选择使用部门');
        return;
    }

    var mxflag = false;
    var mxlistArr = [];
    $("#mxlist").find("#mx").each(function () {
        var fpm = $(this).find("#fpm").val();
        var fdw = $(this).find("#fdw").val();
        var fgg = $(this).find("#fgg").val();
        var fsl = $(this).find("#fsl").val();
        var fcgdj = $(this).find("#fcgdj").val();
        var fcgzj = $(this).find("#fcgzj").val();
        var fcgyq = $(this).find("#fcgyq").val();
        var fcggys = $(this).find("#fcggys").val();

        var mx = new MxItem(fpm, fdw, fgg, fsl, fcgdj, fcgzj, fcgyq, fcggys);
        if (!mx.check()) {
            mxflag = false;
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
                        <FormData>`;
            xml += `
                     <BPM_LYCYGCWZCGSQ_A>
                        <fbillno>${fbillno}</fbillno>
                        <fname>${fname}</fname>
                        <fdept>${fdept}</fdept>
                        <fdate>${fdate}</fdate>
                        <ftel>${ftel}</ftel>
                        <fsybm>${fsybm}</fsybm>
                        <ffj>${fjArray.join(";")}</ffj>
                    </BPM_LYCYGCWZCGSQ_A>
                   `;
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `
                         <BPM_LYCYGCWZCGSQ_B>
                            <RelationRowGuid>${i + 1}</RelationRowGuid>
                            <RowPrimaryKeys></RowPrimaryKeys>
                            <fentryno>${i + 1}</fentryno>
                            <fpm>${mxlistArr[i].fpm}</fpm>
                            <funit>${mxlistArr[i].fdw}</funit>
                            <fgg>${mxlistArr[i].fgg}</fgg>
                            <fsl>${mxlistArr[i].fsl}</fsl>
                            <fcgdj>${mxlistArr[i].fcgdj}</fcgdj>
                            <fcgzj>${mxlistArr[i].fcgzj}</fcgzj>
                            <fcgyq>${mxlistArr[i].fcgyq}</fcgyq>
                            <fgys>${mxlistArr[i].fcggys}</fgys>
                        </BPM_LYCYGCWZCGSQ_B>
                       `;
            }
            xml += ` </FormData>
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


    var fname = $("#fname").val();
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();

    var ftel = $("#ftel").val();
    var fsybm = $("#fsybm").val();
    var fczj_total = $("#fczj_total").val();

   

    var mxflag = false;
    var mxlistArr = [];
    $("#mxlist").find("#mx").each(function () {
        var fpm = $(this).find("#fpm").val();
        var fdw = $(this).find("#fdw").val();
        var fgg = $(this).find("#fgg").val();
        var fsl = $(this).find("#fsl").val();
        var fcgdj = $(this).find("#fcgdj").val();
        var fcgzj = $(this).find("#fcgzj").val();
        var fcgyq = $(this).find("#fcgyq").val();
        var fcggys = $(this).find("#fcggys").val();

        var mx = new MxItem(fpm, fdw, fgg, fsl, fcgdj, fcgzj, fcgyq, fcggys);
       
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
                     <Action>${action}</Action>
                     <Comment>${comment}</Comment>
            
                     <ConsignEnabled>true</ConsignEnabled>
                     <ConsignUsers>${consignUserStr}</ConsignUsers>
                     <ConsignRoutingType>${consignRoutingType}</ConsignRoutingType>
                     <ConsignReturnType>${consignReturnType}</ConsignReturnType>
                     <InviteIndicateUsers>[]</InviteIndicateUsers>
                     <Context>{&quot;Routing&quot;:{}}</Context>
                     </Header>';
                     <FormData>`;
            xml += `
                     <BPM_LYCYGCWZCGSQ_A>
                        <fbillno>${fbillno}</fbillno>
                        <fname>${fname}</fname>
                        <fdept>${fdept}</fdept>
                        <fdate>${fdate}</fdate>
                        <ftel>${ftel}</ftel>
                        <fsybm>${fsybm}</fsybm>
                        <ffj>${fjArray.join(";")}</ffj>
                    </BPM_LYCYGCWZCGSQ_A>
                   `;
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `
                         <BPM_LYCYGCWZCGSQ_B>
                            <RelationRowGuid>${i + 1}</RelationRowGuid>
                            <RowPrimaryKeys>itemid=${itemidArr[i]}</RowPrimaryKeys>
                            <fentryno>${i + 1}</fentryno>
                            <fpm>${mxlistArr[i].fpm}</fpm>
                            <funit>${mxlistArr[i].fdw}</funit>
                            <fgg>${mxlistArr[i].fgg}</fgg>
                            <fsl>${mxlistArr[i].fsl}</fsl>
                            <fcgdj>${mxlistArr[i].fcgdj}</fcgdj>
                            <fcgzj>${mxlistArr[i].fcgzj}</fcgzj>
                            <fcgyq>${mxlistArr[i].fcgyq}</fcgyq>
                            <fgys>${mxlistArr[i].fcggys}</fgys>
                        </BPM_LYCYGCWZCGSQ_B>
                       `;
            }
            xml += ` </FormData>
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
                     <BPM_LYCYGCWZCGSQ_A>
                        <fbillno>${fbillno}</fbillno>
                        <fname>${fname}</fname>
                        <fdept>${fdept}</fdept>
                        <fdate>${fdate}</fdate>
                        <ftel>${ftel}</ftel>
                        <fsybm>${fsybm}</fsybm>
                        <ffj>${fjArray.join(";")}</ffj>
                    </BPM_LYCYGCWZCGSQ_A>
                   `;
        for (var i = 0; i < mxlistArr.length; i++) {
            xml += `
                         <BPM_LYCYGCWZCGSQ_B>
                            <RelationRowGuid>${i + 1}</RelationRowGuid>
                            <RowPrimaryKeys>itemid=${itemidArr[i]}</RowPrimaryKeys>
                            <fentryno>${i + 1}</fentryno>
                            <fpm>${mxlistArr[i].fpm}</fpm>
                            <funit>${mxlistArr[i].fdw}</funit>
                            <fgg>${mxlistArr[i].fgg}</fgg>
                            <fsl>${mxlistArr[i].fsl}</fsl>
                            <fcgdj>${mxlistArr[i].fcgdj}</fcgdj>
                            <fcgzj>${mxlistArr[i].fcgzj}</fcgzj>
                            <fcgyq>${mxlistArr[i].fcgyq}</fcgyq>
                            <fgys>${mxlistArr[i].fcggys}</fgys>
                        </BPM_LYCYGCWZCGSQ_B>
                       `;
        }
        xml += ` </FormData>
                    </XForm>
                   `;
        PostXml(xml);
    }
}