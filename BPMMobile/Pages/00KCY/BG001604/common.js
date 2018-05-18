function prepMsg() {

    $("#fdate").val(getNowFormatDate(2));
    tapEvent();
    var xml = `<?xml version= "1.0" ?>
                  <Requests>
                      <Params>
                      <Method>GetFormPostData</Method>
                      <ProcessName>集团公司行管人员工作牌申请</ProcessName>
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
        $("#fssgs").val(item.fssgs);



    }).fail(function (e) {

    }).then(function () {
       
    });
}

function tapEvent() {

    $("#tjmx").on('tap', () => {
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
                        var li = `
                                  <div id="mx" class="mui-card">
                                      <div class="mui-input-row itemtitle">
                                         <label>明细列表项</label>
                                         <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>
                                      </div>
                                      <div class="mui-row cutOffLine" style="padding:3vw;">
                                           <div class="mui-col-xs-3" style="display:flex;">
                                               <label>姓名<i style="color:red;">*</i></label>
                                               <textarea rows="2" id="fxm" readonly></textarea> 
                                           </div>  
                                           <div class="mui-col-xs-3" style="display:flex;">
                                               <label>所属集团</label>
                                               <textarea rows="2" id="fssjt" readonly></textarea>
                                           </div>
                                            <div class="mui-col-xs-3" style="display:flex;">
                                                <label>所属公司</label>
                                                <textarea rows="2" id="fssgs" readonly></textarea> 
                                            </div>
                                            <div class="mui-col-xs-3" style="display:flex;">
                                                 <label>所属部门</label>
                                                 <textarea rows="2" id="fssbm" readonly></textarea>
                                            </div>
                                      </div>
                                       <div class="mui-row cutOffLine" style="padding:3vw;">
                                           <div class="mui-col-xs-4" style="display:flex;">
                                               <label>职务</label> 
                                               <textarea rows="2" id="fzw" readonly></textarea> 
                                           </div>
                                           <div class="mui-col-xs-4" style="display:flex;">
                                                <label>申请类型<i style="color:red;">*</i></label>
                                                <textarea rows="2" id="fsqlx" name="fsqlx" readonly placeholder="请选择"></textarea>
                                           </div> 
                                           <div class="mui-col-xs-4" style="display:flex;">
                                               <label>金额(元)</label>
                                               <textarea rows="2" id="fje" readonly></textarea>
                                           </div> 
                                       </div>
                                       <div class="mui-input-row" style="height:7rem;overflow:scroll;" id="uploaddiv">
                                            <div class="border border-t upload-img" style="top:0rem;">
                                                <div class="clearfix upload-btn" id="children-bg">
                                                    <label class="label">照片<i style="color:red;">*</i></label>
                                                    <span class="tips" id="imageCount"></span>
                                                    <span class="upload-addbtn">
                                                        <input type="file" accept="image/jpeg,image/jpg,image/png,image/jp2,image/bmp" id="file" style="opacity:0;">
                                                    </span>
                                                </div>
                                                <div class="upload-img-list"></div>
                                             </div>
                                       </div>
                                  </div>
                                 `;
                        $("#mxlist").append(li);
                    }).fail(function (e) {
                        console.log(e);
                    });
                });
            }
        });

    });

    var fsqlxdata = [
        {
            value: '',
            text:'壳+绳+卡片'
        },
        {
            value: '',
            text:'壳+绳'
        },
        {
            value: '',
            text:'卡片'
        },
        {
            value: '',
            text:'壳'
        },
        {
            value: '',
            text:'绳'
        }
    ];
    $("#mxlist").on('tap', "textarea[name='fsqlx']", function () {

        var picker = new mui.PopPicker();
        picker.setData(data);
        var self = this;
        picker.show(function (items) {
            $(self).val(items[0].text);
            switch (items[0].text) {
                case '壳+绳+卡片':
                    $(self).parent().parent().find("#fje").val(10.00);
                    $(self).parent().parent().find(".upload-addbtn").show();
                    break;
                case '壳+绳':
                    $(self).parent().parent().find("#fje").val(6.00);
                    $(self).parent().parent().find(".upload-addbtn").hide();
                    break;
                case '卡片':
                    $(self).parent().parent().find("#fje").val(4.00);
                    $(self).parent().parent().find(".upload-addbtn").show();
                    break;
                case '壳':
                    $(self).parent().parent().find("#fje").val(3.00);
                    $(self).parent().parent().find(".upload-addbtn").hide();
                    break;
                case '绳':
                    $(self).parent().parent().find("#fje").val(3.00);
                    $(self).parent().parent().find(".upload-addbtn").hide();
                    break;
                default:
                    break;
            }
        });
    });
}

function checkNes() {
    return true;
}

var fjArrayList = [];
var fjArrayListEvery = [];
var fjArrayObjCollections = [];
function initData(data, flag) {
    var item = data.FormDataSet.BPM_WGJTXGRYGZPSQ_A[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.fbillno);
    }
    $("#fname").val(item.提报人);
    $("#fdate").val(FormatterTimeYMS(item.提报日期));
    $("#fssgs").val(item.所属公司);
    $("#flxdh").val(item.联系电话);

}