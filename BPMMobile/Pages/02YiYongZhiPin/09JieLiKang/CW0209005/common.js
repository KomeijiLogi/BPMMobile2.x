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
    }

}