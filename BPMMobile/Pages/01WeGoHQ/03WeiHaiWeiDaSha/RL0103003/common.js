function prepMsg() {
    tapEvent();
    upload();
    $("#fdate").val(getNowFormatDate(2));
    var xml = `<?xml version= "1.0" ?>
               <Requests>
               <Params>
               <Method>GetFormPostData</Method>
               <ProcessName>威海卫大厦员工调岗调薪申请</ProcessName>
               <ProcessVersion>${version}</ProcessVersion>
               <Owner></Owner>
               </Params>
               </Requests>
    `;
    dataProvider(xml, function (data) {
        var provideData = JSON.parse(unescape(data.replace(/\\(u[0-9a-fA-F]{4})/gm, '%$1')));
        console.log(provideData);
        var item = provideData.Tables[0].Rows[0];
        $("#fname").val(item.fname);
        $("#fdept").val(item.fdept);
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
    var fbdfwdata = [
        {
            value: '',
            text:'部门内调岗调薪'
        },
        {
            value: '',
            text: '部门间调岗调薪'
        }
    ];
    var element = document.getElementById('fbdfw');

    var picker = new mui.PopPicker();

    picker.setData(fbdfwdata);

    element.addEventListener('tap', function () {

        picker.show(function (items) {

            element.value = items[0].text;
            if (String(items[0].text).match('部门内') != null) {
                $("#tjmx_in").show();
                $("#tjmx_out").hide();
            } else if (String(items[0].text).match('部门间') != null) {
                $("#tjmx_out").show();
                $("#tjmx_in").hide();
            }
        });

    }, false);

    $("#tjmx_in").on('tap', () => {
        var li = `
           <div id="mx" class="mui-card">
              <div class="mui-input-row itemtitle">
                 <label>明细列表项</label>
                 <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>
              </div>
              <div class="mui-input-row">
                 <label for="fbsqrxm">被申请人姓名<i style="color:red;">*</i></label>
                 <input type="text" id="fbsqrxm" name="fbsqrxm" placeholder="请填写被申请人姓名"/>
              </div>
              <div class="mui-input-row">
                 <label for="frzrq">入职日期<i style="color:red;">*</i></label>
                 <input type="date" id="frzrq" name="frzrq" placeholder="请填写入职日期"/>
              </div>
              <div class="mui-input-row">
                  <label for="fbddyy">被调动原因<i style="color:red;">*</i></label>
                  <input type="text" id="fbddyy" name="fbddyy" readonly placeholder="请选择被调动原因"/>
              </div>
              <div class="mui-input-row">
                  <label for="fxrgw">现任岗位<i style="color:red;">*</i></label> 
                  <input type="text" id="fxrgw" name="fxrgw" placeholder="请填写现任岗位"/>
              </div>  
              <div class="mui-input-row">
                  <label for="fxggz">现岗工资<i style="color:red;">*</i></label>
                  <input type="number" id="fxggz" name="fxggz" placeholder="请填写现岗工资"/>
              </div>
              <div class="mui-input-row">
                  <label for="fndgwrq">拟定岗位日期<i style="color:red;">*</i></label>
                  <input type="date" id="fndgwrq" name="fndgwrq" placeholder="请填写拟定岗位日期"/>  
              </div>
              <div class="mui-input-row">
                  <label for="fndgw">拟定岗位<i style="color:red;">*</i></label>
                  <input type="text" id="fndgw" name="fndgw" placeholder="请填写拟定岗位"/>
              </div> 
              <div class="mui-input-row">
                  <label for="fndgwgz">拟定岗位工资<i style="color:red;">*</i></label>
                  <input type="number" id="fndgwgz" name="fndgwgz" placeholder="请填写拟定岗位工资"/>   
              </div>
              <div class="mui-input-row">
                  <label for="frszt">人事状态</label>
                  <input type="text" id="frszt" name="frszt" readonly />   
              </div>
              <div class="mui-input-row" style="height:auto;">
                  <label for="fbz">备注</label>
                  <textarea rows="2" id="fbz" name="fbz" placeholder="请填写备注"></textarea>
              </div>
           </div>
                 `;
        $("#mxlist_in").append(li);

    });
    $("#tjmx_out").on('tap', () => {
        var li = `
           <div id="mx" class="mui-card">
              <div class="mui-input-row itemtitle">
                 <label>明细列表项</label>
                 <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>
              </div>
              <div class="mui-input-row">
                  <label for="fsqrxm">申请人姓名<i style="color:red;">*</i></label>
                  <input type="text"/> 
              </div>
           </div>
                 `;

    });
}
