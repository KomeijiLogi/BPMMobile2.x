function prepMsg() {
    $("#fdate").val(getNowFormatDate(2));
    tapEvent();
    var xml = '<?xml version= "1.0" ?>';
    xml = xml + '   <Requests>';
    xml = xml + '   <Params>';
    xml = xml + '       <Method>GetFormPostData</Method>';
    xml = xml + '       <ProcessName>威海卫大厦员工转正申请</ProcessName>';
    xml = xml + '      <ProcessVersion>' + version + '</ProcessVersion>';
    xml = xml + '      <Owner></Owner>';
    xml = xml + '    </Params>';
    xml = xml + '   </Requests>';

    dataProvider(xml, function (data) {
        var provideData = JSON.parse(unescape(data.replace(/\\(u[0-9a-fA-F]{4})/gm, '%$1')));
        console.log(provideData);
        var item = provideData.Tables[0].Rows[0];
        $("#fname").val(item.提报人);
        $("#fdept").val(item.申请部门);
    });

}
function dataProvider(xml, callback) {

    var p = new Promise(function (resolve, reject) {
        $.ajax({
            type: "POST",
            url: "/api/bpm/DataProvider",
            data: { '': xml },
            beforeSend: function (XHR) {
                XHR.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem('ticket'));
            }
        }).done(function (data) {
            callback(data);
            resolve();
        }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
            if (XMLHttpRequest.status == "401") {
                mui.alert('授权过期，请重新打开页面');;
            } else if (XMLHttpRequest.status == "500") {
                mui.alert('服务器内部错误');
            }
            reject();
        });
    });
    return p;
}


function tapEvent() {
    $("#tjmx").on('tap', () => {
        var li = `
            <div id="mx" class="mui-card">
              <div class="mui-input-row itemtitle">
                 <label>明细列表项</label>
                 <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>
              </div>
              <div class="mui-input-row">
                 <label for="fsqr">申请人<i style="color:red;">*</i></label>
                 <input type="text" id="fsqr" name="fsqr" placeholder="请填写申请人"/>
              </div>
              <div class="mui-input-row">
                  <label for="frzrq">入职日期<i style="color:red;">*</i></label>
                  <input type="date" id="frzrq" name="frzrq" />
              </div>    
              <div class="mui-input-row">
                  <label for="fzzrq">转正日期<i style="color:red;">*</i></label>
                  <input type="date" id="fzzrq" name="fzzrq" />
              </div> 
              <div class="mui-input-row">
                  <label for="fszgw">所在岗位<i style="color:red;">*</i></label>
                  <input type="text" id="fszgw" name="fszgw" placeholder="请填写所在岗位"/>
              </div>
              <div class="mui-input-row">
                   <label for="fsyqgz">试用期工资<i style="color:red;">*</i></label>
                   <input type="number" id="fsyqgz" name="fsyqgz" placeholder="请填写试用期工资"/>
              </div>
              <div class="mui-input-row">
                   <label for="fzzgz">转正工资<i style="color:red;">*</i></label>
                   <input type="number" id="fzzgz" name="fzzgz" placeholder="请填写转正工资"/>
              </div>
              <div class="mui-input-row">
                   <label for="fbz">备注</label>
                   <input type="text" id="fbz" name="fbz" placeholder="请填写备注"/> 
              </div>
              <div class="mui-input-row">
                  <label for="fzt">状态</label>
                  <input type="text" id="fzt" name="fzt" readonly value="同意"/>  
              </div> 
            </div>
        `;
        $("#mxlist").append(li);
    })

}

function initData(data, flag) {
    var item = data.FormDataSet.威海卫大厦人事管理事务申请表_A[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.fbillno);
    }
    $("#fname").val(item.提报人);
    $("#fdept").val(item.申请部门);
    $("#fdate").val(FormatterTimeYMS(item.申请时间));
    var item_c = data.FormDataSet.威海卫大厦人事管理事务申请表_B;
    for (var i = 0; i < item_c.length; i++) {
        itemidArr.push(item_c[i].itemid);

    }

}
function nodeControllerExp(NodeName) {

}

function Save() {

}
function reSave() {

}
function hasRead() {

}
function AgreeOrConSign() {

}