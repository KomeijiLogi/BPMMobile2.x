function prepMsg() {
    tapEvent();
    uploadOpt();
    $("#fsqrq").val(getNowFormatDate(2));
  
    var xml = `<?xml version= "1.0" ?>
                  <Requests>
                      <Params>
                      <Method>GetFormPostData</Method>
                      <ProcessName>爱普公司样品申请</ProcessName>
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

    showPicker('fif_500', fif_data);


    $("#tjmx").on('tap', () => {

        var li = `
            <div id="mx">
                <div class="mui-input-row itemtitle">
                    <label>明细列表项</label>
                    <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>
                </div>
                 <div class="mui-row cutOffLine padding">
                      <div class="mui-col-xs-4" style="display:flex;">
                          <label>产品编码</label>
                          <textarea rows="2" id="fcpbm" placeholder="请填写"></textarea>
                      </div>                     
                      <div class="mui-col-xs-4" style="display:flex;">
                          <label>产品名称</label>
                          <textarea rows="2" id="fcpmc" placeholder="请填写"></textarea>
                      </div>  
                      <div class="mui-col-xs-4" style="display:flex;">
                          <label>规格型号</label>
                          <textarea rows="2" id="fggxh" placeholder="请填写"></textarea> 
                      </div> 
                 </div>
                 <div class="mui-row cutOffLine padding">
                     <div class="mui-col-xs-4" style="display:flex;">
                          <label>数量</label>
                          <input type="number" id="fsl" placeholder="请填写"/>       
                     </div>
                     <div class="mui-col-xs-4" style="display:flex;">
                          <label>价格</label>
                          <input type="number" id="fjg" placeholder="请填写"/>   
                     </div>                        
                     <div class="mui-col-xs-4" style="display:flex;">
                         <label>小计</label>
                         <input type="number" id="fxj" readonly/>  
                     </div>                       
                 </div>
                   
                 <div class="mui-row cutOffLine padding">
                     <div class="mui-col-xs-12" style="display:flex;">
                          <label>备注说明</label>
                          <textarea rows="2" id="fbz" placeholder="请填写"></textarea>
                     </div>     
                 </div>
           </div>

                 `;
        $("#mxlist").append(li);
    });



    $("#mxlist").on('input', 'input[type="number"]', function () {
        calcPrice(this);

    });

  
}


function calcPrice(context) {

    var amount = parseFloat($(context).parents('#mx').find('#fsl').val());
    amount = isNaN(amount) ? 0 : amount;
    var price = parseFloat($(context).parents('#mx').find('#fjg').val());
    price = isNaN(price) ? 0 : price;

    var total_price = amount * price;

    $(context).parents('#mx').find('#fxj').val(total_price);

    calcTotal();


}


function calcTotal() {


    var fsl_total = 0;
    var fdj_total = 0;
    var fzj_total = 0;


    $("#mxlist").find("#mx").each(function () {

        var fsl = isNaN(parseFloat($(this).find("#fsl").val())) ? 0 : parseFloat($(this).find("#fsl").val());
        var fjg = isNaN(parseFloat($(this).find("#fjg").val())) ? 0 : parseFloat($(this).find("#fjg").val());
        var fxj = isNaN(parseFloat($(this).find("#fxj").val())) ? 0 : parseFloat($(this).find("#fxj").val());

        fsl_total += fsl;
        fdj_total += fjg;
        fzj_total += fxj;

    });

    $("#fsl_all").val(fsl_total);
    $("#fjg_all").val(fdj_total);
    $("#fxj_all").val(fzj_total);




}

function deleteItem(context) {
    var btnArray = ['否', '是'];
    mui.confirm('确认删除？', '', btnArray, function (e) {
        if (e.index == 1) {
            $(context).parent().parent().remove();
           
            if (typeof calcTotal === "function") {
                calcTotal();
            }
        }
    });
}


function initData(data, flag) {
    var item = data.FormDataSet.爱普公司_样品申请表_主表[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.单号);
    }
    $("#fsqr").val(item.申请人);
    $("#fssqy").val(item.所属区域);
    $("#fsqrq").val(FormatterTimeYMS(item.申请日期));
    $("#flxdh").val(item.联系电话);

    $("#fif_500").val(item.是否超额);
    $("#fkhbm").val(item.客户编码);
    $("#fkhmc").val(item.客户名称);

    var item_c = data.FormDataSet.爱普公司_样品申请表_子表;
    for (var i = 0; i < item_c.length; i++) {
        itemidArr.push(item_c[i].itemid);
        var li = `
            <div id="mx">
                <div class="mui-input-row itemtitle">
                    <label>明细列表项</label>
                    <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>
                </div>
                 <div class="mui-row cutOffLine padding">
                      <div class="mui-col-xs-4" style="display:flex;">
                          <label>产品编码</label>
                          <textarea rows="2" id="fcpbm" readonly>${item_c[i].产品编码}</textarea>
                      </div>                     
                      <div class="mui-col-xs-4" style="display:flex;">
                          <label>产品名称</label>
                          <textarea rows="2" id="fcpmc" readonly>${item_c[i].产品名称}</textarea>
                      </div>  
                      <div class="mui-col-xs-4" style="display:flex;">
                          <label>规格型号</label>
                          <textarea rows="2" id="fggxh" readonly>${item_c[i].规格型号}</textarea> 
                      </div> 
                 </div>
                 <div class="mui-row cutOffLine padding">
                     <div class="mui-col-xs-4" style="display:flex;">
                          <label>数量</label>
                          <input type="number" id="fsl" readonly value="${item_c[i].数量}"/>       
                     </div>
                     <div class="mui-col-xs-4" style="display:flex;">
                          <label>价格</label>
                          <input type="number" id="fjg" readonly value="${item_c[i].价格}"/>   
                     </div>                        
                     <div class="mui-col-xs-4" style="display:flex;">
                         <label>小计</label>
                         <input type="number" id="fxj" readonly value="${item_c[i].小计}"/>  
                     </div>                       
                 </div>
                   
                 <div class="mui-row cutOffLine padding">
                     <div class="mui-col-xs-12" style="display:flex;">
                          <label>备注说明</label>
                          <textarea rows="2" id="fbz" readonly>${item_c[i].备注说明}</textarea>
                     </div>     
                 </div>
           </div>

                  `;
        $("#mxlist").append(li);
    }

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
        $("#tjmx").show();
        $("#mxlist").find('span').each(function () {
            $(this).show();
        });
        $("#mxlist").find("#mx").each(function () {

            $(this).find("textarea,input").removeAttr('readonly');
        });

        $("#fkhbm,#fkhmc,#flxdh,#fssqy").removeAttr('readonly');
        uploadOpt();

        $('.upload-addbtn').show();


    }
}

class Mx {
    constructor(fcpbm, fcpmc, fggxh, fsl, fjg, fxj, fbz) {

        this.fcpbm = fcpbm;
        this.fcpmc = fcpmc;
        this.fggxh = fggxh;
        this.fsl = fsl;
        this.fjg = fjg;
        this.fxj = fxj;
        this.fbz = fbz;

    }
   
}

function Save() {

    var fsqr = $("#fsqr").val();
    var fssqy = $("#fssqy").val();
    var fsqrq = $("#fsqrq").val();
    var flxdh = $("#flxdh").val();
    var fif_500 = $("#fif_500").val();
    var fkhbm = $("#fkhbm").val();
    var fkhmc = $("#fkhmc").val();
    var fsqsm = $("#fsqsm").val();

    var fsl_all = $("#fsl_all").val();
    var fjg_all = $("#fjg_all").val();
    var fxj_all = $("#fxj_all").val();


    var mxlistArr = [];
    $("#mxlist").find("#mx").each(function () {
        var fcpbm = $(this).find("#fcpbm").val();
        var fcpmc = $(this).find("#fcpmc").val();
        var fggxh = $(this).find("#fggxh").val();
        var fsl = $(this).find("#fsl").val();
        var fjg = $(this).find("#fjg").val();
        var fxj = $(this).find("#fxj").val();
        var fbz = $(this).find("#fbz").val();

        var mx = new Mx(fcpbm, fcpmc, fggxh, fsl, fjg, fxj, fbz);
        mxlistArr.push(mx);
    });

    if (!fif_500) {
        mui.toast('请选择是否是500元以上');
        return;
    }
    var btnArry = ["取消", "确定"];
    mui.confirm('即将提交，是否确定？', '提交确认提醒', btnArry, function (e) {
        if (e.index == 1) {
            var xml = `<?xml version="1.0"?>
                        <XForm>
                            <Header>
                                <Method>Post</Method>
                                <ProcessName>爱普公司样品申请</ProcessName>
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
       <爱普公司_样品申请表_主表>
            <单号>自动生成</单号>
            <申请人>${fsqr}</申请人>
            <所属区域>${fssqy}</所属区域>
            <申请日期>${fsqrq}</申请日期>
           <联系电话>${flxdh}</联系电话>
            <是否超额>${fif_500}</是否超额>
            <客户编码>${fkhbm}</客户编码>
            <客户名称>${fkhmc}</客户名称>
            <附件>${fjArray.join(";")}</附件>
        </爱普公司_样品申请表_主表>
                   `;
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `
       <爱普公司_样品申请表_子表>
            <RelationRowGuid>${i+1}</RelationRowGuid>
            <RowPrimaryKeys></RowPrimaryKeys>
            <序号>${i + 1}</序号>
            <产品编码>${mxlistArr[i].fcpbm}</产品编码>
            <产品名称>${mxlistArr[i].fcpmc}</产品名称>
            <规格型号>${mxlistArr[i].fggxh}</规格型号>
            <数量>${mxlistArr[i].fsl}</数量>
            <价格>${mxlistArr[i].fjg}</价格>
            <小计>${mxlistArr[i].fxj}</小计>
            <备注说明>${mxlistArr[i].fbz}</备注说明>
        </爱普公司_样品申请表_子表>
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
    var fssqy = $("#fssqy").val();
    var fsqrq = $("#fsqrq").val();
    var flxdh = $("#flxdh").val();
    var fif_500 = $("#fif_500").val();
    var fkhbm = $("#fkhbm").val();
    var fkhmc = $("#fkhmc").val();
    var fsqsm = $("#fsqsm").val();

    var fsl_all = $("#fsl_all").val();
    var fjg_all = $("#fjg_all").val();
    var fxj_all = $("#fxj_all").val();


    var mxlistArr = [];
    $("#mxlist").find("#mx").each(function () {
        var fcpbm = $(this).find("#fcpbm").val();
        var fcpmc = $(this).find("#fcpmc").val();
        var fggxh = $(this).find("#fggxh").val();
        var fsl = $(this).find("#fsl").val();
        var fjg = $(this).find("#fjg").val();
        var fxj = $(this).find("#fxj").val();
        var fbz = $(this).find("#fbz").val();

        var mx = new Mx(fcpbm, fcpmc, fggxh, fsl, fjg, fxj, fbz);
        mxlistArr.push(mx);
    });

    if (!fif_500) {
        mui.toast('请选择是否是500元以上');
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
       <爱普公司_样品申请表_主表>
            <单号>${fbillno}</单号>
            <申请人>${fsqr}</申请人>
            <所属区域>${fssqy}</所属区域>
            <申请日期>${fsqrq}</申请日期>
           <联系电话>${flxdh}</联系电话>
            <是否超额>${fif_500}</是否超额>
            <客户编码>${fkhbm}</客户编码>
            <客户名称>${fkhmc}</客户名称>
            <附件>${fjArray.join(";")}</附件>
        </爱普公司_样品申请表_主表>
                   `;
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `
       <爱普公司_样品申请表_子表>
            <RelationRowGuid>${i + 1}</RelationRowGuid>
            <RowPrimaryKeys></RowPrimaryKeys>
            <序号>${i + 1}</序号>
            <产品编码>${mxlistArr[i].fcpbm}</产品编码>
            <产品名称>${mxlistArr[i].fcpmc}</产品名称>
            <规格型号>${mxlistArr[i].fggxh}</规格型号>
            <数量>${mxlistArr[i].fsl}</数量>
            <价格>${mxlistArr[i].fjg}</价格>
            <小计>${mxlistArr[i].fxj}</小计>
            <备注说明>${mxlistArr[i].fbz}</备注说明>
        </爱普公司_样品申请表_子表>
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
    var fssqy = $("#fssqy").val();
    var fsqrq = $("#fsqrq").val();
    var flxdh = $("#flxdh").val();
    var fif_500 = $("#fif_500").val();
    var fkhbm = $("#fkhbm").val();
    var fkhmc = $("#fkhmc").val();
    var fsqsm = $("#fsqsm").val();

    var fsl_all = $("#fsl_all").val();
    var fjg_all = $("#fjg_all").val();
    var fxj_all = $("#fxj_all").val();


    var mxlistArr = [];
    $("#mxlist").find("#mx").each(function () {
        var fcpbm = $(this).find("#fcpbm").val();
        var fcpmc = $(this).find("#fcpmc").val();
        var fggxh = $(this).find("#fggxh").val();
        var fsl = $(this).find("#fsl").val();
        var fjg = $(this).find("#fjg").val();
        var fxj = $(this).find("#fxj").val();
        var fbz = $(this).find("#fbz").val();

        var mx = new Mx(fcpbm, fcpmc, fggxh, fsl, fjg, fxj, fbz);
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
       <爱普公司_样品申请表_主表>
            <单号>${fbillno}</单号>
            <申请人>${fsqr}</申请人>
            <所属区域>${fssqy}</所属区域>
            <申请日期>${fsqrq}</申请日期>
           <联系电话>${flxdh}</联系电话>
            <是否超额>${fif_500}</是否超额>
            <客户编码>${fkhbm}</客户编码>
            <客户名称>${fkhmc}</客户名称>
            <附件>${fjArray.join(";")}</附件>
        </爱普公司_样品申请表_主表>
                   `;
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `
       <爱普公司_样品申请表_子表>
            <RelationRowGuid>${i + 1}</RelationRowGuid>
            <RowPrimaryKeys>itemid=${itemidArr[i]}</RowPrimaryKeys>
            <序号>${i + 1}</序号>
            <产品编码>${mxlistArr[i].fcpbm}</产品编码>
            <产品名称>${mxlistArr[i].fcpmc}</产品名称>
            <规格型号>${mxlistArr[i].fggxh}</规格型号>
            <数量>${mxlistArr[i].fsl}</数量>
            <价格>${mxlistArr[i].fjg}</价格>
            <小计>${mxlistArr[i].fxj}</小计>
            <备注说明>${mxlistArr[i].fbz}</备注说明>
        </爱普公司_样品申请表_子表>
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
       <爱普公司_样品申请表_主表>
            <单号>${fbillno}</单号>
            <申请人>${fsqr}</申请人>
            <所属区域>${fssqy}</所属区域>
            <申请日期>${fsqrq}</申请日期>
           <联系电话>${flxdh}</联系电话>
            <是否超额>${fif_500}</是否超额>
            <客户编码>${fkhbm}</客户编码>
            <客户名称>${fkhmc}</客户名称>
            <附件>${fjArray.join(";")}</附件>
        </爱普公司_样品申请表_主表>
                   `;
        for (var i = 0; i < mxlistArr.length; i++) {
            xml += `
       <爱普公司_样品申请表_子表>
            <RelationRowGuid>${i + 1}</RelationRowGuid>
            <RowPrimaryKeys>itemid=${itemidArr[i]}</RowPrimaryKeys>
            <序号>${i + 1}</序号>
            <产品编码>${mxlistArr[i].fcpbm}</产品编码>
            <产品名称>${mxlistArr[i].fcpmc}</产品名称>
            <规格型号>${mxlistArr[i].fggxh}</规格型号>
            <数量>${mxlistArr[i].fsl}</数量>
            <价格>${mxlistArr[i].fjg}</价格>
            <小计>${mxlistArr[i].fxj}</小计>
            <备注说明>${mxlistArr[i].fbz}</备注说明>
        </爱普公司_样品申请表_子表>
                       `;
        }
        xml += `
                       </FormData>
                    </XForm>
                   `;
        PostXml(xml);
    }

}