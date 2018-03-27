function prepMsg() {
    $("#fdate").val(getNowFormatDate(2));
    tapEvent();
    var xml = `<?xml version= "1.0" ?>
                  <Requests>
                      <Params>
                      <Method>GetFormPostData</Method>
                      <ProcessName>威海卫大厦青缇湾员工面试信息提报</ProcessName>
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
        $("#fname").val(item.提报人);
        $("#fdept").val(item.提报部门);
    }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
        if (XMLHttpRequest.status == "401") {
            mui.alert('授权过期，请重新打开页面');;
        } else if (XMLHttpRequest.status == "500") {
            mui.alert('服务器内部错误');
        }
       
    });

}

function tapEvent() {
    $("#tjmx").on('tap', () => {

    });
}

function initData(data, flag) {
    var item = data.FormDataSet.威海卫大厦青缇湾员工面试信息表_A[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.fbillno);
    }
    $("#fname").val(item.提报人);
    $("#fdept").val(item.提报部门);
    $("#fdate").val(FormatterTimeYMS(item.提报时间));

    var item_c = data.FormDataSet.威海卫大厦青缇湾员工面试信息表_B;
    for (var i = 0; i < item_c.length; i++) {
        itemidArr.push(item_c[i].itemid);
        var li = `<div id="mx" class="mui-card">
                      <div class="mui-input-row itemtitle">
                         <label>明细列表项</label>
                         <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>
                      </div>  
                      <div class="mui-row cutOffLine">
                         <div class="mui-col-xs-4" style="display:flex;">
                             <label>员工姓名<i style="color:red;">*</i></label>
                             <input type="text" id="fygxm" name="fygxm" readonly value="${item_c[i].员工姓名}"/>
                         </div>
                         <div class="mui-col-xs-4" style="display:flex;">
                             <label>性别<i style="color:red;">*</i></label>
                             <input type="text" id="fxb" name="fxb" readonly value="${item_c[i].性别}"/>
                         </div>
                         <div class="mui-col-xs-4" style="display:flex;">
                             <label>出生年月<i style="color:red;">*</i></label>
                             <input type="date" id="fcsny" name="fcsny" readonly value="${FormatterYMS(item_c[i].出生年月)}"/> 
                         </div> 
                      </div>
                      <div class="mui-row cutOffLine">
                          <div class="mui-col-xs-4" style="display:flex;">
                              <label>籍贯<i style="color:red;">*</i></label>
                              <input type="text" id="fjg" name="fjg" readonly value="${item_c[i].籍贯}"/>  
                          </div> 
                          <div class="mui-col-xs-4" style="display:flex;">
                              <label>学历<i style="color:red;">*</i></label>
                              <input type="text" id="fxl" name="fxl" readonly value="${item_c[i].学历}"/>
                          </div>
                          <div class="mui-col-xs-4" style="display:flex;">
                               <label>安排岗位<i style="color:red;">*</i></label>
                               <input type="text" id="fapgw" name="fapgw" readonly value="${item_c[i].安排岗位}"/>
                          </div> 
                      </div>
                      <div class="mui-row cutOffLine">
                          <div class="mui-col-xs-4" style="display:flex;">
                              <label>到岗日期<i style="color:red;">*</i></label>
                              <input type="date" id="fdgrq" name="fdgrq" readonly value="${FormatterTimeYMS(item_c[i].到岗日期)}"/>
                          </div>
                          <div class="mui-col-xs-4" style="display:flex;">
                              <label>薪资待遇<i style="color:red;">*</i></label> 
                              <input type="number" id="fxzdy" name="fxzdy" readonly value="${item_c[i].薪资待遇}"/>
                          </div> 
                          <div class="mui-col-xs-4" style="display:flex;">

                          </div>
                      </div>    
                  </div>
                 `;
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
