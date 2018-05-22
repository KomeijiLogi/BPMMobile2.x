function prepMsg() {
    $("#fdate").val(getNowFormatDate(2));
    tapEvent();
    uploadOpt();
    var xml = `<?xml version= "1.0" ?>
                  <Requests>
                      <Params>
                      <Method>GetFormPostData</Method>
                      <ProcessName>集团公司员工车辆通行证申请</ProcessName>
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
        $("#fname").val(item.fname);
        $("#fgs").val(item.fgs);


    }).fail(function (e) {

    });
}


function tapEvent() {

    var flxdata = [
        {
            value: '',
            text:'公车'
        },
        {
            value: '',
            text:'私车'
        }
    ];
    var element = document.getElementById('flx');

    var picker = new mui.PopPicker();

    picker.setData(flxdata);

    element.addEventListener('tap', function () {

        picker.show(function (items) {

            element.value = items[0].text;
            if (items[0].text == '公车') {

            } else {

            }
        });

    }, false);


    $("#tjmx").on('tap', function () {

        var li = `
                   <div id="mx" class="mui-card">
                      <div class="mui-input-row itemtitle">
                         <label>明细列表项</label>
                         <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>
                      </div>
                      <div class="mui-row cutOffLine" style="padding:3vw;">
                         <div class="mui-col-xs-4" style="display:flex;">
                            <label>姓名<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fxm" readonly placeholder="请选择"></textarea> 
                         </div>
                          <div class="mui-col-xs-4" style="display:flex;">
                             <label>所属集团</label>
                             <textarea rows="2" id="fss_jt" readonly></textarea>
                         </div>
                         <div class="mui-col-xs-4" style="display:flex;">
                             <label>所属公司</label> 
                             <textarea rows="2" id="fss_gs" readonly></textarea>
                         </div>                           
                      </div>
                       <div class="mui-row cutOffLine" style="padding:3vw;">
                            <div class="mui-col-xs-4" style="display:flex;">
                                <label>手机号码<i style="color:red;">*</i></label>
                                <textarea rows="2" id="fsjh" readonly></textarea> 
                            </div>
                            <div class="mui-col-xs-4" style="display:flex;">
                                <label>车牌号<i style="color:red;">*</i></label>
                                <textarea rows="2" id="fcph" readonly></textarea>  
                            </div>
                            <div class="mui-col-xs-4" style="display:flex;">
                                <label>车型<i style="color:red;">*</i></label>
                                <textarea rows="2" id="fcx" readonly></textarea> 
                            </div>
                       </div>
                        <div class="mui-input-row cutOffLine" style="height:7rem;overflow:scroll;" id="uploaddiv">
                                <div class="border border-t upload-img" style="top:0rem;">
                                    <div class="clearfix upload-btn" id="children-bg">
                                        <label class="label">行驶证<i style="color:red;">*</i></label>
                                        <span class="tips" id="imageCount"></span>
                                        <span class="upload-addbtn">
                                            <input type="file" accept="image/jpeg,image/jpg,image/png,image/jp2,image/bmp" id="file" style="opacity:0;">
                                        </span>
                                    </div>
                                    <div class="upload-img-list"></div>
                                </div>
                        </div>
                      <div class="mui-row cutOffLine" style="padding:3vw;">
                          <div class="mui-col-xs-12" style="display:flex;">
                              <label>行驶证持有人<i style="color:red;">*</i></label> 
                              <textarea rows="2" id="fcyr" readonly ></textarea>
                          </div>
                      </div>
                        <div class="mui-input-row cutOffLine" style="height:7rem;overflow:scroll;" id="uploaddiv">
                                <div class="border border-t upload-img" style="top:0rem;">
                                    <div class="clearfix upload-btn" id="children-bg">
                                        <label class="label">驾驶证<i style="color:red;">*</i></label>
                                        <span class="tips" id="imageCount"></span>
                                        <span class="upload-addbtn">
                                            <input type="file" accept="image/jpeg,image/jpg,image/png,image/jp2,image/bmp" id="file" style="opacity:0;">
                                        </span>
                                    </div>
                                    <div class="upload-img-list"></div>
                                </div>
                        </div>
                        <div class="mui-input-row cutOffLine" style="height:7rem;overflow:scroll;" id="uploaddiv">
                                <div class="border border-t upload-img" style="top:0rem;">
                                    <div class="clearfix upload-btn" id="children-bg">
                                        <label class="label">结婚证<i style="color:red;">*</i></label>
                                        <span class="tips" id="imageCount"></span>
                                        <span class="upload-addbtn">
                                            <input type="file" accept="image/jpeg,image/jpg,image/png,image/jp2,image/bmp" id="file" style="opacity:0;">
                                        </span>
                                    </div>
                                    <div class="upload-img-list"></div>
                                </div>
                        </div>
                        <div class="mui-row cutOffLine" style="padding:3vw;">
                            <div class="mui-col-xs-12" style="display:flex;">
                                 <label>车辆通行证号<i style="color:red;">*</i></label>    
                                 <textarea rows="2" id="ftxzh" readonly></textarea>
                            </div>     
                        </div> 
                  </div>
                  `;
        $("#mxlist").append(li);
    });


}


function initData(data, flag) {
    var item = data.FormDataSet.BPM_YGCLTXZSQ_A[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.fbillno);
    }
    $("#fname").val(item.fname);
    $("#fdate").val(FormatterTimeYMS(item.fdate));
    $("#fgs").val(item.fgs);


}