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
                $(_self).val(items[0].text);
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


    item_c = data.FormDataSet.洁丽康公司_产品试用申请_子表1;

}






function Save() {

  
}