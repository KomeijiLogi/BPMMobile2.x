function prepMsg() {
    $("#fdate").val(getNowFormatDate(2));
    tapEvent();
    var xml = `<?xml version= "1.0" ?>
                  <Requests>
                      <Params>
                      <Method>GetFormPostData</Method>
                      <ProcessName>集团公司食堂临时就餐申请</ProcessName>
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
        //console.log(item);
        $("#fname").val(item.ffqr);
        $("#fgroup").val(item.fssgs);
        $("#fcompany").val(item.fssjt);
    }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
        if (XMLHttpRequest.status == "401") {
            mui.alert('授权过期，请重新打开页面');;
        } else if (XMLHttpRequest.status == "500") {
            mui.alert('服务器内部错误');
        }

    });
   
}


function tapEvent() {
    var opidArr = [];
    $("#tjmx").on('tap', () => {
        XuntongJSBridge.call('selectPerson', { 'pType': '1' }, function (result) {

            if (String(Object.prototype.toString.call(result)).match('String') != null) {
                result = JSON.parse(result);
            }

            if (result.success == true || result.success == "true") {

                for (var i = 0; i < result.data.persons.length; i++) {

                    opidArr.push(result.data.persons[i].openId);

                }
                var getPerInfo= $.ajax({
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

                        var li = `<div id="mx" class="mui-card">
                                     <div class="mui-input-row itemtitle">
                                        <label>明细列表项</label>
                                        <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>
                                     </div>
                                     <div class="mui-row cutOffLine">
                                         <div class="mui-col-xs-6" style="display:flex;">
                                             <label>申请人<i style="color:red;">*</i></label>
                                             <input type="text" id="fsqr" value="${pio.NAME}"/>
                                         </div>
                                         <div class="mui-col-xs-6" style="display:flex;">
                                             <label>申请公司</label> 
                                             <input type="text" id="fsqgs" value="${pio.fdeptname}"/> 
                                         </div>     
                                     </div> 
                                     <div class="mui-row cutOffLine">
                                          <div class="mui-col-xs-6" style="display:flex;">
                                             <label>申请人手机号<i style="color:red;">*</i></label>  
                                             <input type="tel" id="fsqrsjh" placeholder="请填写申请人手机号"/>
                                          </div>
                                          <div class="mui-col-xs-6" style="display:flex;">
                                              <label>就餐时间<i style="color:red;">*</i></label>
                                              <input type="datetime-local" id="fjcsj" />   
                                          </div>
                                     </div> 
                                     <div class="mui-row cutOffLine">
                                           <div class="mui-col-xs-3" style="display:flex;">
                                               <label>人数<i style="color:red;">*</i></label>
                                               <input type="number" id="fjcrs" placeholder="请填写"/>
                                           </div>
                                           <div class="mui-col-xs-3" style="display:flex;">
                                               <label>餐别<i style="color:red;">*</i></label>
                                               <input type="text" id="fcb" placeholder="请选择" readonly />
                                           </div>
                                            <div class="mui-col-xs-3" style="display:flex;">
                                               <label>餐标<i style="color:red;">*</i></label>
                                               <input type="number" id="fcz" placeholder="请输入"  />
                                           </div>
                                             <div class="mui-col-xs-3" style="display:flex;">
                                               <label>金额</label>
                                               <input type="number" id="fje"  />
                                           </div>  
                                     </div> 
                                     <div class="mui-row">
                                         <div class="mui-col-xs-12" style="display:flex;">
                                             <label>事由<i style="color:red;">*</i></label>
                                             <textarea rows="2" id="fjcsy" placeholder="请填写就餐事由"></textarea>
                                         </div>  
                                      </div> 
                                 </div>
                        `;
                        $("#mxlist").append(li);
                    }).fail((e) => {


                    });

                });
            }
        });
    });

    var fcjstdata = [
        {
            value: '',
            text:'骨科大食堂'
        },
        {
            value: '',
            text:'骨科小食堂'
        },
        {
            value: '',
            text:'医用材料大食堂'
        },
        {
            value: '',
            text:'马山大食堂'
        },
        {
            value: '',
            text:'马山小食堂'
        },
        {
            value: '',
            text:'五号门大食堂'
        },
        {
            value: '',
            text:'五号门小食堂'
        },
        {
            value: '',
            text:'五号门饺子馆'
        },
        {
            value: '',
            text:'八号门大食堂'
        },
        {
            value: '',
            text:'八号门小食堂'
        },
        {
            value: '',
            text:'一号门大食堂'
        },
        {
            value: '',
            text:'一号门洁瑞办公楼大食堂'
        },
        {
            value: '',
            text:'二号门大食堂'
        },
        {
            value: '',
            text:'三号门大食堂'
        },
        {
            value: '',
            text:'三号门小食堂'
        }
    ];

    var element = document.getElementById('fcjst');
    var picker = new mui.PopPicker();
    picker.setData(fcjstdata);
    element.addEventListener('tap', function () {

        picker.show(function (items) {

            element.value = items[0].text;
            $("#mxlist").find("#fcb").each(function () {
                var fcb = $(this).val();
                if (String(fcb).match('早餐') != null) {
                    if (String(items[0].text).match('大食堂') != null) {
                        $(this).parent().parent().find("#fcz").val(3.00);
                    }

                } else if (String(fcb).match('午餐') != null) {
                    if (String(items[0].text).match('大食堂') != null) {
                        $(this).parent().parent().find("#fcz").val(5.50);
                    } else if (String(items[0].text).match('小食堂') != null){
                        $(this).parent().parent().find("#fcz").val(12.00);
                    }
                } else if (String(fcb).match('晚餐') != null) {
                    if (String(items[0].text).match('大食堂') != null) {
                        $(this).parent().parent().find("#fcz").val(4.50);
                    }
                } else if (String(fcb).match('夜餐') != null) {
                    if (String(items[0].text).match('大食堂') != null) {
                        $(this).parent().parent().find("#fcz").val(5.50);
                    }
                }
            });
        });

    }, false);

}

function initData(data, flag) {


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
