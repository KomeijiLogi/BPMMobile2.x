function prepMsg() {
  
    tapEvent();
    var xml = `<?xml version= "1.0" ?>
                  <Requests>
                      <Params>
                      <Method>GetFormPostData</Method>
                      <ProcessName>洁丽康公司月销售任务完成情况分析提报</ProcessName>
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
       


    }).fail(function (e) {

    }).then(function () {
       
    });

}

function tapEvent() {
    $("#fxsry").on('tap', function () {
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
                        $("#fno").val(pio.EMPLID);
                        $("#fxsry").val(pio.NAME);

                    }).fail(function (e) {
                        console.log(e);
                     });
                })

            }
        });

    });

    $("input[type='number']").on('input', function () {

        var fdyrw_xse = isNaN(parseFloat($("#fdyrw_xse").val())) ? 1 : parseFloat($("#fdyrw_xse").val());
        var fdywc_xse = isNaN(parseFloat($("#fdywc_xse").val())) ? 1 : parseFloat($("#fdywc_xse").val());
        var fwcl_xse = parseFloat((fdywc_xse / fdyrw_xse) * 100).toFixed(2);
        $("#fwcl_xse").val(fwcl_xse);

        var fljrw_xse = isNaN(parseFloat($("#fljrw_xse").val())) ? 1 : parseFloat($("#fljrw_xse").val());
        var fljwc_xse = isNaN(parseFloat($("#fljwc_xse").val())) ? 1 : parseFloat($("#fljwc_xse").val());
        var fljwcl_xse = parseFloat((fljwc_xse / fljrw_xse) * 100).toFixed(2);
        $("#fljwcl_xse").val(fljwcl_xse);

        var fdyrw_hke = isNaN(parseFloat($("#fdyrw_hke").val())) ? 1 : parseFloat($("#fdyrw_hke").val());
        var fdywc_hke = isNaN(parseFloat($("#fdywc_hke").val())) ? 1 : parseFloat($("#fdywc_hke").val());
        var fwcl_hke = parseFloat((fdywc_hke / fdyrw_hke) * 100).toFixed(2);
        $("#fwcl_hke").val(fwcl_hke);

        var fljrw_hke = isNaN(parseFloat($("#fljrw_hke").val())) ? 1 : parseFloat($("#fljrw_hke").val());
        var fljwc_hke = isNaN(parseFloat($("#fljwc_hke").val())) ? 1 : parseFloat($("#fljwc_hke").val());
        var fljwcl_hke = parseFloat((fljwc_hke / fljrw_hke) * 100).toFixed(2);
        $("#fljwcl_hke").val(fljwcl_hke);


    });

    var opts = { "type": "month" };

    $("#fy").on('tap', function () {

        var picker = new $.DtPicker(opts);

        picker.show(function (rs) {

            $("#fy").val(rs.text);
        });
        
    });
}

function initData(data, flag) {
    var item = data.FormDataSet.洁丽康公司_月销售任务完成情况分析提报_主表[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.fbillno);
    }
    $("#fxsry").val(item.销售人员);
    $("#fno").val(item.销售人员工号);
    $("#fxsqy").val(item.销售区域);
    $("#fy").val(item.月);
    $("#fdyrw_xse").val(item.销售额任务);
    $("#fdywc_xse").val(item.销售额实际);
    $("#fwcl_xse").val(item.销售额完成率);
    $("#fljrw_xse").val(item.累计销售额任务);
    $("#fljwc_xse").val(item.累计销售额实际);
    $("#fljwcl_xse").val(item.累计销售额完成率);
    $("#fdyrw_hke").val(item.回款额任务);
    $("#fdywc_hke").val(item.回款额实际);
    $("#fwcl_hke").val(item.回款额完成率);
    $("#fljrw_hke").val(item.累计回款额任务);
    $("#fljwc_hke").val(item.累计回款额实际);
    $("#fljwcl_hke").val(item.累计回款额完成率);
    $("#fdywc_fc").val(item.销售发出金额实际);
    $("#fljwc_fc").val(item.累计销售发出金额实际);
    $("#fyyfx1").val(item.销售额任务未完成原因分析);
    $("#fyyfx2").val(item.回款任务未完成原因分析);
    $("#fbz").val(item.备注);


}


function nodeControllerExp(NodeName) {
    if (String(NodeName).match('开始') != null) {
        tapEvent();
        $("input[type='number']").removeAttr('readonly');

    } else if (String(NodeName).match('') != null) {

    }
}

function checkNes() {
    return true;
}
function Save() {

    var fxsry = $("#fxsry").val();
    var fno = $("#fno").val();

    var fxsqy = $("#fxsqy").val();
    var fy = $("#fy").val();
    var fdyrw_xse = $("#fdyrw_xse").val();
    var fdywc_xse = $("#fdywc_xse").val();
    var fwcl_xse = $("#fwcl_xse").val();
    var fljrw_xse = $("#fljrw_xse").val();
    var fljwc_xse = $("#fljwc_xse").val();
    var fljwcl_xse = $("#fljwcl_xse").val();
    var fdyrw_hke = $("#fdyrw_hke").val();
    var fdywc_hke = $("#fdywc_hke").val();
    var fwcl_hke = $("#fwcl_hke").val();
    var fljrw_hke = $("#fljrw_hke").val();
    var fljwc_hke = $("#fljwc_hke").val();
    var fljwcl_hke = $("#fljwcl_hke").val();
    var fdywc_fc = $("#fdywc_fc").val();
    var fljwc_fc = $("#fljwc_fc").val();
    var fyyfx1 = $("#fyyfx1").val();
    var fyyfx2 = $("#fyyfx2").val();
    var fbz = $("#fbz").val();

    if (!fxsqy) {
        mui.toast('请填写销售区域');
        return;
    }

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

}