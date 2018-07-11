function prepMsg() {

     $("#ftxrq").val(getNowFormatDate(2));
    tapEvent();
    uploadOpt();
    var xml = `<?xml version= "1.0" ?>
                  <Requests>
                      <Params>
                      <Method>GetFormPostData</Method>
                      <ProcessName>洁丽康公司业务员备货退换货申请</ProcessName>
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
        $("#ftxr").val(item.填写人);
        $("#fxsy").val(item.销售员名称);
        $("#fxsybm").val(item.销售员编码);
    }).fail(function (e) {

    });
}

function tapEvent() {

    $("#tjmx_th").on('tap', function () {
        var li = `
                 <div id="mx">
                        <div class="mui-input-row itemtitle">
                            <label>明细列表项</label>
                            <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>
                        </div>
                        <div class="mui-row cutOffLine padding">
                            <div class="mui-col-xs-12" style="display:flex;">
                                <label>物料编码<i style="color:red;">*</i></label>
                                <textarea rows="2" id="fwlbm" readonly></textarea>
                            </div>
                        </div>
                        <div class="mui-row cutOffLine padding">
                            <div class="mui-col-xs-4" style="display:flex;">
                                <label>物料名称</label>
                                <textarea rows="2" id="fwlmc" readonly></textarea>
                            </div>
                            <div class="mui-col-xs-4" style="display:flex;">
                                <label>规格型号</label>
                                <textarea id="fggxh" readonly rows="2"></textarea>
                            </div>
                            <div class="mui-col-xs-4" style="display:flex;">
                                <label>计量单位</label>
                                <textarea id="fjldw" readonly rows="2"></textarea>
                            </div>
                        </div>
                        <div class="mui-row cutOffLine padding">
                            <div class="mui-col-xs-4" style="display:flex;">
                                <label>数量<i style="color:red;">*</i></label>
                                <input type="number" id="fsl" placeholder="请填写"/>
                            </div>
                            <div class="mui-col-xs-4" style="display:flex;">
                                <label>生产批号<i style="color:red;">*</i></label>
                                <textarea rows="2" id="fscph" placeholder="请填写"></textarea>
                            </div>
                            <div class="mui-col-xs-4" style="display:flex;">
                                <label>产品序列号<i style="color:red;">*</i></label>
                                <textarea rows="2" id="fcpxlh" placeholder="请填写"></textarea>
                            </div>
                        </div>
                        <div class="mui-row cutOffLine padding">
                            <div class="mui-col-xs-12" style="display:flex;">
                                <label>包装是否完好<i style="color:red;">*</i></label>
                                <textarea rows="2" id="fif_bz" readonly placeholder="请选择"></textarea> 
                            </div>
                        </div>
                    </div>

                       `;

        $("#mxlist_th").append(li);
    });

    $("#tjmx_hh").on('tap', function () {
        var li = ` <div id="mx">
                        <div class="mui-input-row itemtitle">
                            <label>明细列表项</label>
                            <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>
                        </div>
                        <div class="mui-row cutOffLine padding">
                            <div class="mui-col-xs-4" style="display:flex;">
                                <label>物料编码<i style="color:red;">*</i></label>
                                <textarea rows="2" id="fwlbm" readonly></textarea>
                            </div>
                            <div class="mui-col-xs-4" style="display:flex;">
                                <label>物料名称</label>
                                <textarea rows="2" id="fwlmc" readonly></textarea>
                            </div>
                            <div class="mui-col-xs-4" style="display:flex;">
                                <label>规格型号</label>
                                <textarea rows="2" id="fggxh" readonly></textarea>
                            </div>
                        </div>
                        <div class="mui-row cutOffLine padding">
                            <div class="mui-col-xs-4" style="display:flex;">
                                <label>计量单位</label>
                                <textarea rows="2" id="fjldw" readonly ></textarea>
                            </div>
                            <div class="mui-col-xs-4" style="display:flex;">
                                <label>数量<i style="color:red;">*</i></label>
                               <input type="number" id="fsl" placeholder="请填写"/>
                            </div>
                        </div>
                    </div>

                  `;
        $("#mxlist_hh").append(li);
    });

    var fsqlx_data = [
       
        {
            value: '',
            text: '退换货'
        }
    ];

    var picker_apply = new mui.PopPicker();
    picker_apply.setData(fsqlx_data);

    $("#fsqlx").on('tap', function () {
        var _self = this;
        picker_apply.show(function (items) {
            $(_self).val(items[0].text);
            if (items[0].text == '退货') {
                $("#card1").hide();
                $("#card2").show();
            } else if (items[0].text == '退换货') {
                $("#card1").show();
                $("#card2").show();
                $("#card3").show();
            }



        });
    });

    var fhhfhsj_data = [
        {
            value: '',
            text: '公司收到退回产品后发出'
        },
        {
            value: '',
            text: '提前发货'
        }
    ];

    showPicker('fhhfhsj', fhhfhsj_data);

}



var itemidArr1 = [];
var itemidArr2 = [];

function initData(data, flag) {
    var item = data.FormDataSet.洁丽康公司_销售退货申请_主表[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.单号);
    }
    $("#ftxr").val(item.填写人);
    $("#ftxrq").val(FormatterTimeYMS(item.填写日期));
    $("#fsqlx").val(item.申请类型);
    $("#fxszz").val(item.销售组织名称);
    $("#fkh").val(item.客户名称);
    $("#fxsy").val(item.销售员名称);
    $("#fthyy").val(item.退货原因);
    $("#fhhfhsj").val(item.换货发货时间);
    $("#ftqfhyy").val(item.提前发货原因);
    $("#fshdz").val(item.送货地址);
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

    $("#fshjb").val(item.审核级别);
    $("#fshbz").val(item.审核备注);
    $("#fjybz").val(item.检验备注);
    $("#fxsbbz").val(item.销售部备注);
    $("#fywlx").val(item.业务分类);
    $("#fxszzbm").val(item.销售组织编码);
    $("#fkhbm").val(item.客户编码);
    $("#fxsybm").val(item.销售员编码);
    $("#fkczzbm").val(item.库存组织编码);
    $("#fbmbm").val(item.部门编码);
    $("#fcbzxbm").val(item.成本中心编码);
    $("#fllrbm").val(item.领料人编码);
    $("#fywlxbm").val(item.业务类型编码);
    $("#fswlxbm1").val(item.事务类型编码1);
    $("#fswlxbm2").val(item.事务类型编码2);
    $("#flllxbm").val(item.领料类型编码);
    $("#fbgrbm").val(item.保管人编码);
    $("#fckbm").val(item.仓库编码);
    $("#fcgybm").val(item.仓管员编码);
    $("#fgxlxbm").val(item.更新类型编码);

   

    var item_c1 = data.FormDataSet.洁丽康公司_销售退货申请_子表1;
    for (var i = 0; i < item_c1.length; i++) {
        itemidArr1.push(item_c1[i].itemid);
        var li = `   <div id="mx">
                        <div class="mui-input-row itemtitle">
                            <label>明细列表项</label>
                            <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>
                        </div>
                        <div class="mui-row cutOffLine padding">
                            <div class="mui-col-xs-12" style="display:flex;">
                                <label>物料编码<i style="color:red;">*</i></label>
                                <textarea rows="2" id="fwlbm" readonly>${item_c1[i].物料编码}</textarea>
                            </div>
                        </div>
                        <div class="mui-row cutOffLine padding">
                            <div class="mui-col-xs-4" style="display:flex;">
                                <label>物料名称</label>
                                <textarea rows="2" id="fwlmc" readonly>${item_c1[i].物料名称}</textarea>
                            </div>
                            <div class="mui-col-xs-4" style="display:flex;">
                                <label>规格型号</label>
                                <textarea id="fggxh" readonly rows="2">${item_c1[i].规格型号}</textarea>
                            </div>
                            <div class="mui-col-xs-4" style="display:flex;">
                                <label>计量单位</label>
                                <textarea id="fjldw" readonly rows="2">${item_c1[i].计量单位}</textarea>
                            </div>
<input type="hidden" id="fjldwbm" readonly value="${item_c1[i].计量单位编码}"/>
                        </div>
                        <div class="mui-row cutOffLine padding">
                            <div class="mui-col-xs-4" style="display:flex;">
                                <label>数量<i style="color:red;">*</i></label>
                                <input type="number" id="fsl" readonly value="${item_c1[i].数量}"/>
                            </div>
                            <div class="mui-col-xs-4" style="display:flex;">
                                <label>生产批号<i style="color:red;">*</i></label>
                                <textarea rows="2" id="fscph" readonly>${item_c1[i].生产批号}</textarea>
                            </div>
                            <div class="mui-col-xs-4" style="display:flex;">
                                <label>产品序列号<i style="color:red;">*</i></label>
                                <textarea rows="2" id="fcpxlh" readonly>${item_c1[i].产品序列号}</textarea>
                            </div>
                        </div>
                        <div class="mui-row cutOffLine padding">
                            <div class="mui-col-xs-12" style="display:flex;">
                                <label>包装是否完好<i style="color:red;">*</i></label>
                                <textarea rows="2" id="fif_bz" readonly >${item_c1[i].包装是否完好}</textarea> 
                            </div>
                        </div>
                    </div>

                 `;
        $("#mxlist_th").append(li);
    }

    var item_c2 = data.FormDataSet.洁丽康公司_销售退货申请_子表2;
    for (var i = 0; i < item_c2.length; i++) {
        itemidArr2.push(item_c2[i].itemid);
        var li = `
                 <div id="mx">
                        <div class="mui-input-row itemtitle">
                            <label>明细列表项</label>
                            <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>
                        </div>
                        <div class="mui-row cutOffLine padding">
                            <div class="mui-col-xs-4" style="display:flex;">
                                <label>物料编码<i style="color:red;">*</i></label>
                                <textarea rows="2" id="fwlbm" readonly>${item_c2[i].物料编码}</textarea>
                            </div>
                            <div class="mui-col-xs-4" style="display:flex;">
                                <label>物料名称</label>
                                <textarea rows="2" id="fwlmc" readonly>${item_c2[i].物料名称}</textarea>
                            </div>
                            <div class="mui-col-xs-4" style="display:flex;">
                                <label>规格型号</label>
                                <textarea rows="2" id="fggxh" readonly>${item_c2[i].规格型号}</textarea>
                            </div>
                        </div>
                        <div class="mui-row cutOffLine padding">
                            <div class="mui-col-xs-4" style="display:flex;">
                                <label>计量单位</label>
                                <textarea rows="2" id="fjldw" readonly >${item_c2[i].计量单位}</textarea>
                            </div>
 <input type="hidden" id="fjldwbm" readonly value="${item_c2[i].计量单位编码}"/>
                            <div class="mui-col-xs-4" style="display:flex;">
                                <label>数量<i style="color:red;">*</i></label>
                               <input type="number" id="fsl" readonly value="${item_c2[i].数量}"/>
                            </div>
                        </div>
                    </div>
                 `;
        $("#mxlist_hh").append(li);
    }


}


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







    if (String(NodeName).match('开始') != null) {

        tapEvent();
        mui.alert('请移步网页端处理');

    } else if (String(NodeName).match('退换货审核岗') != null) {
        var fshjb_data = [
            {
                value: '',
                text: '正常'
            },
            {
                value: '',
                text: '总监'
            },
            {
                value: '',
                text: '总经理'
            }
        ];

        showPicker('fshjb', fshjb_data);
        $("#fshbz").removeAttr('readonly');


    } else if (String(NodeName).match('订单执行岗') != null) {
        action = '请检和制单';
        $("#fxsbbz").removeAttr('readonly');

    } else if (String(NodeName).match('质检员') != null) {
        action = '检验完成';
        $("#fjybz").removeAttr('readonly');

    } 


}


function checkNes() {
    var nodeName = $("#nodeName").val();
    if (String(nodeName).match('退换货审核岗') != null) {
        if (!$("#fshjb").val()) {
            mui.toast('请填写审核级别');
            return false;
        }
        if (!$("#fshbz").val()) {
            mui.toast('请填写审核备注');
            return false;
        }


    } else if (String(nodeName).match('订单执行岗') != null) {
        if (!$("#fxsbbz").val()) {
            mui.toast('请填写销售部备注');
            return false;
        }

    } else if (String(nodeName).match('质检员') != null) {
        if (!$("#fjybz").val()) {
            mui.toast('请填写检验备注');
            return false;
        }
    }

    return true;
}


class Mx1 {
    constructor(fwlbm, fwlmc, fggxh, fjldw, fjldwbm, fsl, fscph, fcpxlh, fif_bz) {
        this.fwlbm = fwlbm;
        this.fwlmc = fwlmc;
        this.fggxh = fggxh;
        this.fjldw = fjldw;
        this.fjldwbm = fjldwbm;
        this.fsl = fsl;
        this.fscph = fscph;
        this.fcpxlh = fcpxlh;
        this.fif_bz = fif_bz;
    }
    check() {
        if (!this.fwlbm) {
            mui.toast('请选择物料');
            return true;
        }
        if (!this.fsl) {
            mui.toast('请填写数量');
            return true;
        }
        if (!this.fscph) {
            mui.toast('请填写生成批号');
            return true;
        }
        if (!this.fcpxlh) {
            mui.toast('请填写产品序列号');
            return true;
        }
        if (!this.fif_bz) {
            mui.toast('请选择包装是否完好');
            return true;
        }
        return false;
    }
}

class Mx2 {
    constructor(fwlbm, fwlmc, fggxh, fjldw, fjldwbm, fsl) {
        this.fwlbm = fwlbm;
        this.fwlmc = fwlmc;
        this.fggxh = fggxh;
        this.fjldw = fjldw;
        this.fjldwbm = fjldwbm;
        this.fsl = fsl;
    }
    check() {
        if (!this.fwlbm) {
            mui.toast('请选择物料');
            return true;
        }
        if (!this.fsl) {
            mui.toast('请填写数量');
            return true;
        }

        return false;
    }
}

function Save() {

}

function reSave() {

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


    var ftxr = $("#ftxr").val();
    var ftxrq = $("#ftxrq").val();
    var fsqlx = $("#fsqlx").val();
    var fxszz = $("#fxszz").val();
    var fkh = $("#fkh").val();
    var fxsy = $("#fxsy").val();
    var fthyy = $("#fthyy").val();
    var fhhfhsj = $("#fhhfhsj").val();
    var ftqfhyy = $("#ftqfhyy").val();
    var fshdz = $("#fshdz").val();
    var fywlx = $("#fywlx").val();
    var fxszzbm = $("#fxszzbm").val();
    var fkhbm = $("#fkhbm").val();
    var fxsybm = $("#fxsybm").val();
    var fkczzbm = $("#fkczzbm").val();
    var fbmbm = $("#fbmbm").val();
    var fcbzxbm = $("#fcbzxbm").val();
    var fllrbm = $("#fllrbm").val();
    var fywlxbm = $("#fywlxbm").val();
    var fswlxbm1 = $("#fswlxbm1").val();
    var fswlxbm2 = $("#fswlxbm2").val();
    var flllxbm = $("#flllxbm").val();
    var fbgrbm = $("#fbgrbm").val();
    var fckbm = $("#fckbm").val();
    var fcgybm = $("#fcgybm").val();
    var fgxlxbm = $("#fgxlxbm").val();
    var fshjb = $("#fshjb").val();
    var fshbz = $("#fshbz").val();
    var fjybz = $("#fjybz").val();
    var fxsbbz = $("#fxsbbz").val();

    var mxflag = false;
    var mxlistArr1 = [];

    $("#mxlist_th").find("#mx").each(function () {
        var fwlbm = $(this).find("#fwlbm").val();
        var fwlmc = $(this).find("#fwlmc").val();
        var fggxh = $(this).find("#fggxh").val();
        var fjldw = $(this).find("#fjldw").val();
        var fsl = $(this).find("#fsl").val();
        var fscph = $(this).find("#fscph").val();
        var fcpxlh = $(this).find("#fcpxlh").val();
        var fif_bz = $(this).find("#fif_bz").val();
        var fjldwbm = $(this).find("#fjldwbm").val();

        var mx = new Mx1(fwlbm, fwlmc, fggxh, fjldw, fjldwbm, fsl, fscph, fcpxlh, fif_bz);
        mxlistArr1.push(mx);
    });

    var mxlistArr2 = [];
    $("#mxlist_hh").find("#mx").each(function () {
        var fwlbm = $(this).find("#fwlbm").val();
        var fwlmc = $(this).find("#fwlmc").val();
        var fggxh = $(this).find("#fggxh").val();
        var fjldw = $(this).find("#fjldw").val();
        var fsl = $(this).find("#fsl").val();
        var fjldwbm = $(this).find("#fjldwbm").val();

        var mx = new Mx2(fwlbm, fwlmc, fggxh, fjldw, fjldwbm, fsl);
        mxlistArr2.push(mx);
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
 <洁丽康公司_销售退货申请_主表>
            <单号>${fbillno}</单号>
            <填写人>${ftxr}</填写人>
            <填写日期>${ftxrq}</填写日期>
            <申请类型>${fsqlx}</申请类型>
            <销售组织名称>${fxszz}</销售组织名称>
            <客户名称>${fkh}</客户名称>
            <销售员名称>${fxsy}</销售员名称>
            <退货原因>${fthyy}</退货原因>
            <换货发货时间>${fhhfhsj}</换货发货时间>
            <提前发货原因>${ftqfhyy}</提前发货原因>
            <送货地址>${fshdz}</送货地址>
            <附件>${fjArray.join(";")}</附件>
            <审核级别>${fshjb}</审核级别>
            <审核备注>${fshbz}</审核备注>
            <检验备注>${fjybz}</检验备注>
            <销售部备注>${fxsbbz}</销售部备注>
            <TaskID>${$("#taskId").val()}</TaskID>
            <业务分类>${fywlx}</业务分类>
            <销售组织编码>${fxszzbm}</销售组织编码>
            <客户编码>${fkhbm}</客户编码>
            <销售员编码>${fxsybm}</销售员编码>
            <库存组织编码>${fkczzbm}</库存组织编码>
            <部门编码>${fbmbm}</部门编码>
            <成本中心编码>${fcbzxbm}</成本中心编码>
            <领料人编码>${fllrbm}</领料人编码>
            <业务类型编码>${fywlxbm}</业务类型编码>
            <事务类型编码1>${fswlxbm1}</事务类型编码1>
            <事务类型编码2>${fswlxbm2}</事务类型编码2>
            <领料类型编码>${flllxbm}</领料类型编码>
            <保管人编码>${fbgrbm}</保管人编码>
            <仓库编码>${fckbm}</仓库编码>
            <仓管员编码>${fcgybm}</仓管员编码>
            <更新类型编码>${fgxlxbm}</更新类型编码>
        </洁丽康公司_销售退货申请_主表>
                   `;

            for (var i = 0; i < mxlistArr1.length; i++) {
                xml += `
   <洁丽康公司_销售退货申请_子表1>
            <RelationRowGuid>${i + 1}</RelationRowGuid>
            <RowPrimaryKeys>itemid=${itemidArr1[i]}</RowPrimaryKeys>
            <序号>${i + 1}</序号>
            <物料编码>${mxlistArr1[i].fwlbm}</物料编码>
            <物料名称>${mxlistArr1[i].fwlmc}</物料名称>
            <规格型号>${mxlistArr1[i].fggxh}</规格型号>
            <计量单位>${mxlistArr1[i].fjldw}</计量单位>
            <计量单位编码>${mxlistArr1[i].fjldwbm}</计量单位编码>
            <数量>${mxlistArr1[i].fsl}</数量>
            <生产批号>${mxlistArr1[i].fscph}</生产批号>
            <产品序列号>${mxlistArr1[i].fcpxlh}</产品序列号>
            <包装是否完好>${mxlistArr1[i].fif_bz}</包装是否完好>
        </洁丽康公司_销售退货申请_子表1>
                       `;
            }
            for (var i = 0; i < mxlistArr2.length; i++) {
                xml += `
 <洁丽康公司_销售退货申请_子表2>
            <RelationRowGuid>${mxlistArr1.length + i + 1}</RelationRowGuid>
            <RowPrimaryKeys>itemid=${itemidArr2[i]}</RowPrimaryKeys>
            <序号>${i + 1}</序号>
            <物料编码>${mxlistArr2[i].fwlbm}</物料编码>
            <物料名称>${mxlistArr2[i].fwlmc}</物料名称>
            <规格型号>${mxlistArr2[i].fggxh}</规格型号>
            <计量单位>${mxlistArr2[i].fjldw}</计量单位>
            <计量单位编码>${mxlistArr2[i].fjldwbm}</计量单位编码>
            <数量>${mxlistArr2[i].fsl}</数量>
        </洁丽康公司_销售退货申请_子表2>
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
 <洁丽康公司_销售退货申请_主表>
            <单号>${fbillno}</单号>
            <填写人>${ftxr}</填写人>
            <填写日期>${ftxrq}</填写日期>
            <申请类型>${fsqlx}</申请类型>
            <销售组织名称>${fxszz}</销售组织名称>
            <客户名称>${fkh}</客户名称>
            <销售员名称>${fxsy}</销售员名称>
            <退货原因>${fthyy}</退货原因>
            <换货发货时间>${fhhfhsj}</换货发货时间>
            <提前发货原因>${ftqfhyy}</提前发货原因>
            <送货地址>${fshdz}</送货地址>
            <附件>${fjArray.join(";")}</附件>
            <审核级别>${fshjb}</审核级别>
            <审核备注>${fshbz}</审核备注>
            <检验备注>${fjybz}</检验备注>
            <销售部备注>${fxsbbz}</销售部备注>
            <TaskID>${$("#taskId").val()}</TaskID>
            <业务分类>${fywlx}</业务分类>
            <销售组织编码>${fxszzbm}</销售组织编码>
            <客户编码>${fkhbm}</客户编码>
            <销售员编码>${fxsybm}</销售员编码>
            <库存组织编码>${fkczzbm}</库存组织编码>
            <部门编码>${fbmbm}</部门编码>
            <成本中心编码>${fcbzxbm}</成本中心编码>
            <领料人编码>${fllrbm}</领料人编码>
            <业务类型编码>${fywlxbm}</业务类型编码>
            <事务类型编码1>${fswlxbm1}</事务类型编码1>
            <事务类型编码2>${fswlxbm2}</事务类型编码2>
            <领料类型编码>${flllxbm}</领料类型编码>
            <保管人编码>${fbgrbm}</保管人编码>
            <仓库编码>${fckbm}</仓库编码>
            <仓管员编码>${fcgybm}</仓管员编码>
            <更新类型编码>${fgxlxbm}</更新类型编码>
        </洁丽康公司_销售退货申请_主表>
                   `;

        for (var i = 0; i < mxlistArr1.length; i++) {
            xml += `
   <洁丽康公司_销售退货申请_子表1>
            <RelationRowGuid>${i + 1}</RelationRowGuid>
            <RowPrimaryKeys>itemid=${itemidArr1[i]}</RowPrimaryKeys>
            <序号>${i + 1}</序号>
            <物料编码>${mxlistArr1[i].fwlbm}</物料编码>
            <物料名称>${mxlistArr1[i].fwlmc}</物料名称>
            <规格型号>${mxlistArr1[i].fggxh}</规格型号>
            <计量单位>${mxlistArr1[i].fjldw}</计量单位>
            <计量单位编码>${mxlistArr1[i].fjldwbm}</计量单位编码>
            <数量>${mxlistArr1[i].fsl}</数量>
            <生产批号>${mxlistArr1[i].fscph}</生产批号>
            <产品序列号>${mxlistArr1[i].fcpxlh}</产品序列号>
            <包装是否完好>${mxlistArr1[i].fif_bz}</包装是否完好>
        </洁丽康公司_销售退货申请_子表1>
                       `;
        }
        for (var i = 0; i < mxlistArr2.length; i++) {
            xml += `
 <洁丽康公司_销售退货申请_子表2>
            <RelationRowGuid>${mxlistArr1.length + i + 1}</RelationRowGuid>
            <RowPrimaryKeys>itemid=${itemidArr2[i]}</RowPrimaryKeys>
            <序号>${i + 1}</序号>
            <物料编码>${mxlistArr2[i].fwlbm}</物料编码>
            <物料名称>${mxlistArr2[i].fwlmc}</物料名称>
            <规格型号>${mxlistArr2[i].fggxh}</规格型号>
            <计量单位>${mxlistArr2[i].fjldw}</计量单位>
            <计量单位编码>${mxlistArr2[i].fjldwbm}</计量单位编码>
            <数量>${mxlistArr2[i].fsl}</数量>
        </洁丽康公司_销售退货申请_子表2>
                       `;
        }
        xml += `
                 </FormData>
                </XForm>
                     `;
        PostXml(xml);
    }

}