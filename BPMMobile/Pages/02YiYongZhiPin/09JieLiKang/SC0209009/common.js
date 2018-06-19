function prepMsg() {

    $("#ftxrq").val(getNowFormatDate(2));
    tapEvent();
    uploadOpt();
    var xml = `<?xml version= "1.0" ?>
                  <Requests>
                      <Params>
                      <Method>GetFormPostData</Method>
                      <ProcessName>洁丽康公司产品试用申请</ProcessName>
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
        $("#fxsyno").val(item.销售员编码);
        $("#fllrbm").val(item.销售员编码);

    }).fail(function (e) {

        }).then(function () {
            initSaleOrg();
            initMater();
        });

}

function tapEvent() {

    $("#tjmx").on('tap', () => {
        var li = `
             <div id="mx">
                    <div class="mui-input-row itemtitle">
                        <label>明细列表项</label>
                        <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>
                    </div>
                    <div class="mui-row cutOffLine padding">
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>物料编码<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fwlbm" readonly placeholder="请选择"></textarea>
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
                            <textarea rows="2" id="fjldw" readonly></textarea>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>数量<i style="color:red;">*</i></label>
                            <input type="number" id="fsl" placeholder="请填写"/>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>医生姓名<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fysxm" placeholder="请填写"></textarea>
                        </div>
                    </div>
                    <div class="mui-row cutOffLine padding">
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>试用类别<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fsylb" readonly placeholder="请选择"></textarea>
                        </div>
                        <div class="mui-col-xs-8" style="display:flex;">
                            <label>备注</label>
                            <textarea rows="2" id="fbz" placeholder="请填写"></textarea>
                        </div>
                    </div>
                </div>   
                 `;
        $("#mxlist").append(li);
    });
    
    $("#fqyjl").on('tap', () => {
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
                        $("#fqyjl").val(pio.NAME);
                        $("#fqyjlno").val(pio.EMPLID);
                    }).fail(function (e) {

                    });
                });
            }

        });
    });

    var fsylb_data = [
        {
            value: '',
            text:'开发试用'
        },
        {
            value: '',
            text:'讲师试用'
        },
        {
            value: '',
            text:'特殊试用'
        }
    ];
    var picker22 = new mui.PopPicker();
    picker22.setData(fsylb_data);
    $('body').on('tap', '#fsylb', function () {
        var _self = this;
        picker22.show(function (items) {
            $(_self).val(items[0].text);

        });

    });
}


function initSaleOrg() {
    var fno = $("#fxsyno").val();
    if (fno == '00078251') {
        fno = '00073091';
    }
    var xml = `<?xml version= "1.0" ?>
                                 <Requests>
                                 <Params>
                                 <DataSource>BPM_WEGO2018</DataSource>
                                 <ID>erpcloud_查询eas洁丽康公司销售员视图</ID>
                                 <Type>1</Type>
                                 <Method>GetUserDataProcedure</Method>
                                 <ProcedureName>erpcloud_查询eas洁丽康公司销售员视图</ProcedureName>
                                 <Filter>   
                                    <fno>${fno}</fno>
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
        var dataArr = provideData.Tables[0].Rows;
        console.log(dataArr);
        dataArr = dataArr.map((val, i, arr) => {
            var obj = {
                员工名称: dataArr[i].员工名称,
                员工编码: dataArr[i].员工编码,
                销售组名称: dataArr[i].销售组名称,
                销售组织名称: dataArr[i].销售组织名称,
                销售组织编码: dataArr[i].销售组织编码,
                value: dataArr[i].销售组织编码,
                text: dataArr[i].销售组织名称
            }
            return obj;
        });
        var picker = new mui.PopPicker();
        picker.setData(dataArr);
        $("#fxszz").on('tap', function() {
            var _self = this;
            picker.show(function (items) {
                $(_self).val(items[0].text);
            });

        });
    }).fail(function (e) {

    });
}



function initMater() {

    var xml = `<?xml version= "1.0" ?>
                                 <Requests>
                                 <Params>
                                 <DataSource>BPM_WEGO2018</DataSource>
                                 <ID>erpcloud_查询洁丽康公司_产品_主表</ID>
                                 <Type>1</Type>
                                 <Method>GetUserDataProcedure</Method>
                                 <ProcedureName>erpcloud_查询洁丽康公司_产品_主表</ProcedureName>
                                 <Filter>   
                                  
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
        var dataArr = provideData.Tables[0].Rows;
      
        dataArr = dataArr.filter((val, i, arr) => {
            if (dataArr[i].可试用 == '是') {
                return dataArr[i];
            }
        }).map((val, i, arr) => {

            var obj = {
                value: dataArr[i].id,
                text: dataArr[i].物料编码 + '||' + dataArr[i].物料名称,
                fid: dataArr[i].fid,
                助记码: dataArr[i].助记码,
                可借用: dataArr[i].可借用,
                可试用: dataArr[i].可试用,
                可销售: dataArr[i].可销售,
                基本计量单位名称: dataArr[i].基本计量单位名称,
                基本计量单位编码: dataArr[i].基本计量单位编码,
                备注: dataArr[i].备注,
                物料名称: dataArr[i].物料名称,
                物料状态: dataArr[i].物料状态,
                物料编码: dataArr[i].物料编码,
                生产许可证号: dataArr[i].生产许可证号,
                装量: dataArr[i].装量,
                规格型号: dataArr[i].规格型号,
                附件: dataArr[i].附件
            }

            return obj;
        });
     
        console.log(dataArr);
        var picker = new mui.PopPicker();
        picker.setData(dataArr);

        $('#mxlist').on('tap', '#fwlbm', function () {
            var _self = this;
            picker.show(function (items) {
                $(_self).val(items[0].物料编码);
                $(_self).parents('#mx').find("#fwlmc").val(items[0].物料名称);
                $(_self).parents('#mx').find("#fggxh").val(items[0].规格型号);
                $(_self).parents('#mx').find("#fjldw").val(items[0].基本计量单位名称);
                $(_self).parents('#mx').find("#fjldwbm").val(items[0].基本计量单位编码);

            });
        });

    }).fail(function (e) {

    });
}
var item = null;
var item_c = [];
function initData(data, flag) {
    item = data.FormDataSet.洁丽康公司_产品试用申请_主表[0];

    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.单号);
    }
    $("#ftxr").val(item.填写人);
    $("#ftxrq").val(FormatterTimeYMS(item.填写日期));
    $("#flxdh").val(item.联系电话);
    $("#fkhmc").val(item.客户名称);
    $("#fkhdh").val(item.客户电话);
    $("#fshrxm").val(item.收货人姓名);
    $("#fshdz").val(item.收货地址);
    $("#fshrdh").val(item.收货人电话);
    $("#fxsy").val(item.销售员名称);
    $("#fxsyno").val(item.销售员编码);
    $("#fxszz").val(item.销售组织名称);
    $("#fqyjl").val(item.区域经理);
    $("#fbz").val(item.备注);
    $("#fxszzbm").val(item.销售组织编码);
    $("#fqyjlno").val(item.区域经理工号);
    $("#fbmbm").val(item.部门编码);
    $("#fkczzbm").val(item.库存组织编码);
    $("#fcbzxbm").val(item.成本中心编码);
    $("#fllrbm").val(item.领料人编码);
    $("#fywlxbm").val(item.业务类型编码);
    $("#fbgrbm").val(item.保管人编码);
    $("#fckbm").val(item.仓库编码);
    $("#fcgybm").val(item.仓管员编码);
    $("#fgxlxbm").val(item.更新类型编码);
    $("#fswlxbm").val(item.事务类型编码);
    $("#flllxbm").val(item.领料类型编码);



    item_c = data.FormDataSet.洁丽康公司_产品试用申请_子表1;
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
                            <label>物料编码<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fwlbm" readonly >${item_c[i].物料编码}</textarea>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>物料名称</label>
                            <textarea rows="2" id="fwlmc" readonly>${item_c[i].物料名称}</textarea>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>规格型号</label>
                            <textarea rows="2" id="fggxh" readonly>${item_c[i].规格型号}</textarea>
                        </div>
                    </div>
                    <div class="mui-row cutOffLine padding">
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>计量单位</label>
                            <textarea rows="2" id="fjldw" readonly>${item_c[i].计量单位}</textarea>
                              <input type="hidden" id="fjldwbm" value="${item_c[i].计量单位编码}"/>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>数量<i style="color:red;">*</i></label>
                            <input type="number" id="fsl" readonly value="${item_c[i].数量}"/>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>医生姓名<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fysxm" readonly>${item_c[i].医生姓名}</textarea>
                        </div>
                    </div>
                    <div class="mui-row cutOffLine padding">
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>试用类别<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fsylb" readonly >${item_c[i].试用类别}</textarea>
                        </div>
                        <div class="mui-col-xs-8" style="display:flex;">
                            <label>备注</label>
                            <textarea rows="2" id="fbz" readonly>${item_c[i].备注}</textarea>
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
        $("#flxdh,#fkhmc,#fkhdh,#fshrxm,#fshdz,#fshrdh,#fbz").removeAttr('readonly');
        uploadOpt();
        $('.upload-addbtn').show();
        $("#mxlist").find('span').each(function () {
            $(this).show();
        });
        $("#tjmx").show();
    }

}

class Mx {
    constructor(fwlbm, fwlmc, fggxh, fjldw, fsl, fysxm, fsylb, fbz, fjldwbm) {
        this.fwlbm = fwlbm;
        this.fwlmc = fwlmc;
        this.fggxh = fggxh;
        this.fjldw = fjldw;
        this.fsl = fsl;
        this.fysxm = fysxm;
        this.fsylb = fsylb;
        this.fbz = fbz;
        this.fjldwbm = fjldwbm;
    }
    check() {
        if (this.fwlbm) {
            mui.toast('请选择物料');
            return true;
        }
        if (!this.fsl) {
            mui.toast('请填写数量');
            return true;
        }
        if (!this.fysxm) {
            mui.toast('请填写医生姓名');
            return true;
        }
        if (!this.fsylb) {
            mui.toast('请选择试用类别');
            return true;
        }
        return false;
    }
}


function Save() {
    var ftxr = $("#ftxr").val();
    var ftxrq = $("#ftxrq").val();
    var flxdh = $("#flxdh").val();
    var fkhmc = $("#fkhmc").val();
    var fkhdh = $("#fkhdh").val();
    var fshrxm = $("#fshrxm").val();
    var fshdz = $("#fshdz").val();
    var fshrdh = $("#fshrdh").val();
    var fxsy = $("#fxsy").val();
    var fxsyno = $("#fxsyno").val();
    var fxszz = $("#fxszz").val();
    var fxszzbm = $("#fxszzbm").val();
    var fqyjl = $("#fqyjl").val();
    var fqyjlno = $("#fqyjlno").val();
    var fbmbm = $("#fbmbm").val();
    var fkczzbm = $("#fkczzbm").val();
    var fcbzxbm = $("#fcbzxbm").val();
    var fllrbm = $("#fllrbm").val();
    var fywlxbm = $("#fywlxbm").val();
    var fbgrbm = $("#fbgrbm").val();
    var fckbm = $("#fckbm").val();
    var fcgybm = $("#fcgybm").val();
    var fgxlxbm = $("#fgxlxbm").val();
    var fswlxbm = $("#fswlxbm").val();
    var flllxbm = $("#flllxbm").val();


    if (!fkhmc) {
        mui.toast('请填写客户名称');
        return;
    }
    if (!fkhdh) {
        mui.toast('请填写客户电话');
        return;
    }
    if (!fshrxm) {
        mui.toast('请填写收货人姓名');
        return;
    }
    if (!fshdz) {
        mui.toast('请填写收货地址');
        return;
    }
    if (!fshrdh) {
        mui.toast('请填写收货人电话');
        return;
    }
    if (!fxszz) {
        mui.toast('请选择销售组织');
        return;
    }
    if (!fqyjl) {
        mui.toast('请选择区域经理');
        return;
    }

    var mxflag = false;
    var mxlistArr = [];
    $("#mxlist").find("#mx").each(function () {
        var fwlbm = $(this).find("#fwlbm").val();
        var fwlmc = $(this).find("#fwlmc").val();
        var fggxh = $(this).find("#fggxh").val();
        var fjldw = $(this).find("#fjldw").val();
        var fsl = $(this).find("#fsl").val();
        var fysxm = $(this).find("#fysxm").val();
        var fsylb = $(this).find("#fsylb").val();
        var fbz = $(this).find("#fbz").val();
        var mx = new Mx(fwlbm, fwlmc, fggxh, fjldw, fsl, fysxm, fsylb, fbz);
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
                                <ProcessName>洁丽康公司产品试用申请</ProcessName>
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
        <洁丽康公司_产品试用申请_主表>
            <单号>自动生成</单号>
            <填写人>${ftxr}</填写人>
            <填写日期>${ftxrq}</填写日期>
            <联系电话>${flxdh}</联系电话>
            <客户名称>${fkhmc}</客户名称>
            <客户电话>${fkhdh}</客户电话>
            <收货人姓名>${fshrxm}</收货人姓名>
            <收货地址>${fshdz}</收货地址>
            <收货人电话>${fshrdh}</收货人电话>
            <销售员名称>${fxsy}</销售员名称>
            <销售组织名称>${fxszz}</销售组织名称>
            <区域经理>${fqyjl}</区域经理>
            <备注>${fbz}</备注>
            <附件>${fjArray.join(";")}</附件>
            <TaskID></TaskID>
            <销售组织编码>${fxszzbm}</销售组织编码>
            <区域经理工号>${fqyjlno}</区域经理工号>
            <销售员编码>${fxsyno}</销售员编码>
            <部门编码>${fbmbm}</部门编码>
            <库存组织编码>${fkczzbm}</库存组织编码>
            <成本中心编码>${fcbzxbm}</成本中心编码>
            <领料人编码>${fllrbm}</领料人编码>
            <业务类型编码>${fywlxbm}</业务类型编码>
            <保管人编码>${fbgrbm}</保管人编码>
            <仓库编码>${fckbm}</仓库编码>
            <仓管员编码>${fcgybm}</仓管员编码>
            <更新类型编码>${fgxlxbm}</更新类型编码>
            <事务类型编码>${fswlxbm}</事务类型编码>
            <领料类型编码>${flllxbm}</领料类型编码>
        </洁丽康公司_产品试用申请_主表>
                    `;
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `
      <洁丽康公司_产品试用申请_子表1>
            <RelationRowGuid>${i+1}</RelationRowGuid>
            <RowPrimaryKeys></RowPrimaryKeys>
            <序号>${i + 1}</序号>
            <物料编码>${mxlistArr[i].fwlbm}</物料编码>
            <物料名称>${mxlistArr[i].fwlmc}</物料名称>
            <规格型号>${mxlistArr[i].fggxh}</规格型号>
            <计量单位>${mxlistArr[i].fjldw}</计量单位>
            <计量单位编码>${mxlistArr[i].fjldwbm}</计量单位编码>
            <数量>${mxlistArr[i].fsl}</数量>
            <医生姓名>${mxlistArr[i].fysxm}</医生姓名>
            <试用类别>${mxlistArr[i].fsylb}</试用类别>
            <备注>${mxlistArr[i].fbz}</备注>
        </洁丽康公司_产品试用申请_子表1>
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

    var ftxr = $("#ftxr").val();
    var ftxrq = $("#ftxrq").val();
    var flxdh = $("#flxdh").val();
    var fkhmc = $("#fkhmc").val();
    var fkhdh = $("#fkhdh").val();
    var fshrxm = $("#fshrxm").val();
    var fshdz = $("#fshdz").val();
    var fshrdh = $("#fshrdh").val();
    var fxsy = $("#fxsy").val();
    var fxsyno = $("#fxsyno").val();
    var fxszz = $("#fxszz").val();
    var fxszzbm = $("#fxszzbm").val();
    var fqyjl = $("#fqyjl").val();
    var fqyjlno = $("#fqyjlno").val();
    var fbmbm = $("#fbmbm").val();
    var fkczzbm = $("#fkczzbm").val();
    var fcbzxbm = $("#fcbzxbm").val();
    var fllrbm = $("#fllrbm").val();
    var fywlxbm = $("#fywlxbm").val();
    var fbgrbm = $("#fbgrbm").val();
    var fckbm = $("#fckbm").val();
    var fcgybm = $("#fcgybm").val();
    var fgxlxbm = $("#fgxlxbm").val();
    var fswlxbm = $("#fswlxbm").val();
    var flllxbm = $("#flllxbm").val();


    if (!fkhmc) {
        mui.toast('请填写客户名称');
        return;
    }
    if (!fkhdh) {
        mui.toast('请填写客户电话');
        return;
    }
    if (!fshrxm) {
        mui.toast('请填写收货人姓名');
        return;
    }
    if (!fshdz) {
        mui.toast('请填写收货地址');
        return;
    }
    if (!fshrdh) {
        mui.toast('请填写收货人电话');
        return;
    }
    if (!fxszz) {
        mui.toast('请选择销售组织');
        return;
    }
    if (!fqyjl) {
        mui.toast('请选择区域经理');
        return;
    }

    var mxflag = false;
    var mxlistArr = [];
    $("#mxlist").find("#mx").each(function () {
        var fwlbm = $(this).find("#fwlbm").val();
        var fwlmc = $(this).find("#fwlmc").val();
        var fggxh = $(this).find("#fggxh").val();
        var fjldw = $(this).find("#fjldw").val();
        var fsl = $(this).find("#fsl").val();
        var fysxm = $(this).find("#fysxm").val();
        var fsylb = $(this).find("#fsylb").val();
        var fbz = $(this).find("#fbz").val();
        var mx = new Mx(fwlbm, fwlmc, fggxh, fjldw, fsl, fysxm, fsylb, fbz);
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
        <洁丽康公司_产品试用申请_主表>
            <单号>${fbillno}</单号>
            <填写人>${ftxr}</填写人>
            <填写日期>${ftxrq}</填写日期>
            <联系电话>${flxdh}</联系电话>
            <客户名称>${fkhmc}</客户名称>
            <客户电话>${fkhdh}</客户电话>
            <收货人姓名>${fshrxm}</收货人姓名>
            <收货地址>${fshdz}</收货地址>
            <收货人电话>${fshrdh}</收货人电话>
            <销售员名称>${fxsy}</销售员名称>
            <销售组织名称>${fxszz}</销售组织名称>
            <区域经理>${fqyjl}</区域经理>
            <备注>${fbz}</备注>
            <附件>${fjArray.join(";")}</附件>
            <TaskID>${$("#taskId").val()}</TaskID>
            <销售组织编码>${fxszzbm}</销售组织编码>
            <区域经理工号>${fqyjlno}</区域经理工号>
            <销售员编码>${fxsyno}</销售员编码>
            <部门编码>${fbmbm}</部门编码>
            <库存组织编码>${fkczzbm}</库存组织编码>
            <成本中心编码>${fcbzxbm}</成本中心编码>
            <领料人编码>${fllrbm}</领料人编码>
            <业务类型编码>${fywlxbm}</业务类型编码>
            <保管人编码>${fbgrbm}</保管人编码>
            <仓库编码>${fckbm}</仓库编码>
            <仓管员编码>${fcgybm}</仓管员编码>
            <更新类型编码>${fgxlxbm}</更新类型编码>
            <事务类型编码>${fswlxbm}</事务类型编码>
            <领料类型编码>${flllxbm}</领料类型编码>
        </洁丽康公司_产品试用申请_主表>
                    `;
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `
      <洁丽康公司_产品试用申请_子表1>
            <RelationRowGuid>${i + 1}</RelationRowGuid>
            <RowPrimaryKeys></RowPrimaryKeys>
            <序号>${i + 1}</序号>
            <物料编码>${mxlistArr[i].fwlbm}</物料编码>
            <物料名称>${mxlistArr[i].fwlmc}</物料名称>
            <规格型号>${mxlistArr[i].fggxh}</规格型号>
            <计量单位>${mxlistArr[i].fjldw}</计量单位>
            <计量单位编码>${mxlistArr[i].fjldwbm}</计量单位编码>
            <数量>${mxlistArr[i].fsl}</数量>
            <医生姓名>${mxlistArr[i].fysxm}</医生姓名>
            <试用类别>${mxlistArr[i].fsylb}</试用类别>
            <备注>${mxlistArr[i].fbz}</备注>
        </洁丽康公司_产品试用申请_子表1>
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
        <洁丽康公司_产品试用申请_主表>
            <单号>${fbillno}</单号>
            <填写人>${ftxr}</填写人>
            <填写日期>${ftxrq}</填写日期>
            <联系电话>${flxdh}</联系电话>
            <客户名称>${fkhmc}</客户名称>
            <客户电话>${fkhdh}</客户电话>
            <收货人姓名>${fshrxm}</收货人姓名>
            <收货地址>${fshdz}</收货地址>
            <收货人电话>${fshrdh}</收货人电话>
            <销售员名称>${fxsy}</销售员名称>
            <销售组织名称>${fxszz}</销售组织名称>
            <区域经理>${fqyjl}</区域经理>
            <备注>${fbz}</备注>
            <附件>${fjArray.join(";")}</附件>
            <TaskID>${$("#taskId").val()}</TaskID>
            <销售组织编码>${fxszzbm}</销售组织编码>
            <区域经理工号>${fqyjlno}</区域经理工号>
            <销售员编码>${fxsyno}</销售员编码>
            <部门编码>${fbmbm}</部门编码>
            <库存组织编码>${fkczzbm}</库存组织编码>
            <成本中心编码>${fcbzxbm}</成本中心编码>
            <领料人编码>${fllrbm}</领料人编码>
            <业务类型编码>${fywlxbm}</业务类型编码>
            <保管人编码>${fbgrbm}</保管人编码>
            <仓库编码>${fckbm}</仓库编码>
            <仓管员编码>${fcgybm}</仓管员编码>
            <更新类型编码>${fgxlxbm}</更新类型编码>
            <事务类型编码>${fswlxbm}</事务类型编码>
            <领料类型编码>${flllxbm}</领料类型编码>
        </洁丽康公司_产品试用申请_主表>
                    `;
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `
      <洁丽康公司_产品试用申请_子表1>
            <RelationRowGuid>${i + 1}</RelationRowGuid>
            <RowPrimaryKeys>itemid=${itemidArr[i]}</RowPrimaryKeys>
            <序号>${i + 1}</序号>
            <物料编码>${mxlistArr[i].fwlbm}</物料编码>
            <物料名称>${mxlistArr[i].fwlmc}</物料名称>
            <规格型号>${mxlistArr[i].fggxh}</规格型号>
            <计量单位>${mxlistArr[i].fjldw}</计量单位>
            <计量单位编码>${mxlistArr[i].fjldwbm}</计量单位编码>
            <数量>${mxlistArr[i].fsl}</数量>
            <医生姓名>${mxlistArr[i].fysxm}</医生姓名>
            <试用类别>${mxlistArr[i].fsylb}</试用类别>
            <备注>${mxlistArr[i].fbz}</备注>
        </洁丽康公司_产品试用申请_子表1>
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
        <洁丽康公司_产品试用申请_主表>
            <单号>${fbillno}</单号>
            <填写人>${ftxr}</填写人>
            <填写日期>${ftxrq}</填写日期>
            <联系电话>${flxdh}</联系电话>
            <客户名称>${fkhmc}</客户名称>
            <客户电话>${fkhdh}</客户电话>
            <收货人姓名>${fshrxm}</收货人姓名>
            <收货地址>${fshdz}</收货地址>
            <收货人电话>${fshrdh}</收货人电话>
            <销售员名称>${fxsy}</销售员名称>
            <销售组织名称>${fxszz}</销售组织名称>
            <区域经理>${fqyjl}</区域经理>
            <备注>${fbz}</备注>
            <附件>${fjArray.join(";")}</附件>
            <TaskID>${$("#taskId").val()}</TaskID>
            <销售组织编码>${fxszzbm}</销售组织编码>
            <区域经理工号>${fqyjlno}</区域经理工号>
            <销售员编码>${fxsyno}</销售员编码>
            <部门编码>${fbmbm}</部门编码>
            <库存组织编码>${fkczzbm}</库存组织编码>
            <成本中心编码>${fcbzxbm}</成本中心编码>
            <领料人编码>${fllrbm}</领料人编码>
            <业务类型编码>${fywlxbm}</业务类型编码>
            <保管人编码>${fbgrbm}</保管人编码>
            <仓库编码>${fckbm}</仓库编码>
            <仓管员编码>${fcgybm}</仓管员编码>
            <更新类型编码>${fgxlxbm}</更新类型编码>
            <事务类型编码>${fswlxbm}</事务类型编码>
            <领料类型编码>${flllxbm}</领料类型编码>
        </洁丽康公司_产品试用申请_主表>
                    `;
        for (var i = 0; i < mxlistArr.length; i++) {
            xml += `
      <洁丽康公司_产品试用申请_子表1>
            <RelationRowGuid>${i + 1}</RelationRowGuid>
            <RowPrimaryKeys>itemid=${itemidArr[i]}</RowPrimaryKeys>
            <序号>${i + 1}</序号>
            <物料编码>${mxlistArr[i].fwlbm}</物料编码>
            <物料名称>${mxlistArr[i].fwlmc}</物料名称>
            <规格型号>${mxlistArr[i].fggxh}</规格型号>
            <计量单位>${mxlistArr[i].fjldw}</计量单位>
            <计量单位编码>${mxlistArr[i].fjldwbm}</计量单位编码>
            <数量>${mxlistArr[i].fsl}</数量>
            <医生姓名>${mxlistArr[i].fysxm}</医生姓名>
            <试用类别>${mxlistArr[i].fsylb}</试用类别>
            <备注>${mxlistArr[i].fbz}</备注>
        </洁丽康公司_产品试用申请_子表1>
                       `;
        }

        xml += `
                       </FormData>
                    </XForm>
                   `;
        PostXml(xml);
    }
}