function prepMsg() {
    $("#fdate").val(getNowFormatDate(2));
    tapEvent();
    var xml = '<?xml version= "1.0" ?>';
    xml = xml + '   <Requests>';
    xml = xml + '   <Params>';
    xml = xml + '       <Method>GetFormPostData</Method>';
    xml = xml + '       <ProcessName>威海卫大厦员工考核提报</ProcessName>';
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
    $('#tjmx').on('tap', () => {
        var li = `
           <div id="mx" class="mui-card">
              <div class="mui-input-row itemtitle">
                 <label>明细列表项</label>
                 <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>
              </div>  
              <div class="mui-input-row">
                  <label for="fbkhr">被考核人</label>
                  <input type="text" id="fbkhr" name="fbkhr" placeholder="请填写被考核人"/> 
              </div>
              <div class="mui-input-row">
                  <label for="fkhsx">考核事项</label>
                  <input type="text" id="fkhsx" name="fkhsx" placeholder="请填写考核事项"/>
              </div>
              <div class="mui-input-row">
                  <label for="fjle">奖励额</label>
                 <input type="text" id="fjle" name="fjle" placeholder="请填写奖励额"/>
              </div>
              <div class="mui-input-row">
                   <label for="fkke">扣款额</label>
                   <input type="number" id="fkke" name="fkke" placeholder="请填写扣款额"/>
              </div>
              <div class="mui-input-row" style="height:auto;">
                   <label for="fbz">备注</label> 
                   <textarea rows="2" id="fbz" name="fbz" placeholder="请填写备注"></textarea>
              </div>
           </div>
          `;
        $("#mxlist").append(li);

    });
}