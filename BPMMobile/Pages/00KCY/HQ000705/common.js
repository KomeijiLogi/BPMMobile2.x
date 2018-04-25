function prepMsg() {

    $("#fsqrq").val(getNowFormatDate(2));
    tapEvent();
    var xml = `<?xml version= "1.0" ?>
                  <Requests>
                      <Params>
                      <Method>GetFormPostData</Method>
                      <ProcessName>集团公司员工加班就餐提报</ProcessName>
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
        $("#fsqr").val(item.fsqr);
        $("#fsqbm").val(item.fsqbm);
        $("#fssjt").val(item.fssjt);
        $("#fssgs").val(item.fssgs);


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
        var li = `
                   <div id="mx" class="mui-card">
                        <div class="mui-input-row itemtitle">
                            <label>明细列表项</label>
                            <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>
                        </div>
                        <div class="mui-row">
                             <div class="mui-col-xs-12" style="display:flex;">
                                 <label>就餐时间<i style="color:red;">*</i></label>
                                 <input type="datetime-local" id="fjc_sj" />
                             </div>
                        </div>
                        <div class="mui-row">
                              <div class="mui-col-xs-6" style="display:flex;">
                                 <label>就餐人数<i style="color:red;">*</i></label>  
                                 <input type="number" id="fjc_rs" placeholder="请填写"/> 
                              </div>
                              <div class="mui-col-xs-6" style="display:flex;">
                                  <label>实际人数<i style="color:red;">*</i></label>
                                  <input type="number" id="fsjjcrs" placeholder="请填写"/>
                              </div>
                        </div>
                        <div class="mui-row">
                            <div class="mui-col-xs-4" style="display:flex;">
                                <label>餐别<i style="color:red;">*</i></labele
                                <input type="text" id="fcb" readonly placeholder="请选择"/>  
                            </div>
                            <div class="mui-col-xs-4" style="display:flex;">
                                <label>餐标</label>
                                <input type="number" id="fcz" placeholder="请填写"/>
                            </div>
                            <div class="mui-col-xs-4" style="display:flex;">
                               <label>金额</label>
                               <input type="number" id="fje" value="0" readonly/>
                            </div>  
                        </div>
                        <div class="mui-row">
                           <div class="mui-col-xs-12" style="display:flex;">
                               <label>备注</label>
                               <input type="text" id="fbz" placeholder="请填写"/>
                           </div>
                       </div>   
                   </div>
              `;
        $("#mxlist").append(li);
    });
}


