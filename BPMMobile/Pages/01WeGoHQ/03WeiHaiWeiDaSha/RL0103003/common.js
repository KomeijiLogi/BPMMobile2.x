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
              <div class="mui-row cutOffLine">
                   <div class="mui-col-xs-4" style="display:flex;">
                        <label for="fbsqrxm">被申请人姓名<i style="color:red;">*</i></label>
                        <input type="text" id="fbsqrxm" name="fbsqrxm" placeholder="请填写被申请人姓名"/>
                   </div>
                   <div class="mui-col-xs-4" style="display:flex;">
                         <label for="frzrq">入职日期<i style="color:red;">*</i></label>
                         
                         <input type="date" id="frzrq" name="frzrq" placeholder="请填写入职日期" />
                   </div>
                   <div class="mui-col-xs-4" style="display:flex;">
                        <label for="fbddyy">被调动原因<i style="color:red;">*</i></label>
                        <input type="text" id="fbddyy" name="fbddyy" readonly placeholder="请选择被调动原因"/>
                   </div> 
              </div>
             
              <div class="mui-row cutOffLine">
                   <div class="mui-col-xs-4" style="display:flex;">
                       <label for="fxrgw">现任岗位<i style="color:red;">*</i></label> 
                       <input type="text" id="fxrgw" name="fxrgw" placeholder="请填写现任岗位"/>
                   </div>
                   <div class="mui-col-xs-4" style="display:flex;">
                       <label for="fxggz">现岗工资<i style="color:red;">*</i></label>
                       <input type="number" id="fxggz" name="fxggz" placeholder="请填写现岗工资"/>
                   </div>
                   <div class="mui-col-xs-4" style="display:flex;">
                        <label for="fndgwrq">拟定岗位日期<i style="color:red;">*</i></label>
                  <input type="date" id="fndgwrq" name="fndgwrq" placeholder="请填写拟定岗位日期"/> 
                   </div> 
              </div>
             
               <div class="mui-row cutOffLine">
                   <div class="mui-col-xs-4" style="display:flex;">
                       <label for="fndgw">拟定岗位<i style="color:red;">*</i></label>
                       <input type="text" id="fndgw" name="fndgw" placeholder="请填写拟定岗位"/>
                   </div>
                   <div class="mui-col-xs-4" style="display:flex;">
                       <label for="fndgwgz">拟定岗位工资<i style="color:red;">*</i></label>
                       <input type="number" id="fndgwgz" name="fndgwgz" placeholder="请填写拟定岗位工资"/>  
                   </div>
                   <div class="mui-col-xs-4" style="display:flex;">
                       <label for="frszt">人事状态</label>
                        <input type="text" id="frszt" name="frszt" readonly />   
                   </div> 
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
               <div class="mui-row cutOffLine">
                   <div class="mui-col-xs-4" style="display:flex;">
                      <label for="fsqrxm">申请人姓名<i style="color:red;">*</i></label>
                      <input type="text" id="fsqrxm" name="fsqrxm" placholder="请填写申请人姓名"/> 
                    </div>
                   <div class="mui-col-xs-4" style="display:flex;">
                       <label for="frzrq">入职日期<i style="color:red;">*</i></label>
                       <input type="date" id="frzrq" name="frzrq" />
                    </div>
                     <div class="mui-col-xs-4" style="display:flex;">
                        <label for="fndgwrq">拟定岗位日期<i style="color:red;">*</i></label>
                        <input type="date" id="fndgwrq" name="fndgwrq"/>
                    </div>
               </div>
              <div class="mui-row cutOffLine">
                   <div class="mui-col-xs-4" style="display:flex;">
                       <label for="fxzszbm">现在所在部门<label>
                       <input type="text" id="fxzszbm" name="fxzszbm" placeholder="请填写现在所在部门"/>
                    </div>
                   <div class="mui-col-xs-4" style="display:flex;">
                        <label for="fxrgw">现任岗位<i style="color:red;">*</i></label> 
                   <input type="text" id="fxrgw" name="fxrgw" placeholder="请填写现任岗位"/>
                    </div>
                     <div class="mui-col-xs-4" style="display:flex;">
                      <label for="fxgwgz">现岗位工资<i style="color:red;">*</i></label>
                   <input type="number" id="fxgwgz" name="fxgwgz" placeholder="请填写现岗位工资"/>
                    </div>
               </div>
                <div class="mui-row cutOffLine">
                   <div class="mui-col-xs-4" style="display:flex;">
                       <label for="fndrbm">拟调入部门<i style="color:red;">*</i></label> 
                       <input type="text" id="fndrbm" name="fndrbm" placeholder="请填写拟调入部门"/>
                    </div>
                   <div class="mui-col-xs-4" style="display:flex;">
                         <label for="fdrbmfzr">调入部门负责人</label>
                         <input type="text" id="fdrbmfzr" name="fdrbmfzr" placeholder="请填写调入部门负责人"/>
                    </div>
                     <div class="mui-col-xs-4" style="display:flex;">
                         <label for="fndgw">拟定岗位<i style="color:red;">*</i></label>
                       <input type="text" id="fndgw" name="fndgw" placeholder="请填写拟定岗位"/>
                    </div>
               </div>
               <div class="mui-row cutOffLine">
                   <div class="mui-col-xs-6" style="display:flex;">
                        <label for="fndgwgz">拟定岗位工资<i style="color:red;">*</i></label>
                        <input type="number" id="fndgwgz" name="fndgwgz" placeholder="请填写拟定岗位工资"/>
                    </div>
                   <div class="mui-col-xs-6" style="display:flex;">
                       <label for="frszt">人事状态</label>
                       <input type="text" id="frszt" name="frszt" readonly />  
                    </div>
                     
               </div>
                         
              <div class="mui-input-row" style="height:auto;">
                  <label for="fbz">备注</label>
                  <textarea rows="2" id="fbz" name="fbz" placeholder="请填写备注"></textarea>
              </div>              
           </div>
                 `;
        $("#mxlist_out").append(li);
    });
}
var itemidArr1 = [];
var itemidArr2 = [];
function initData(data, flag) {
    var item = data.FormDataSet.威海卫大厦员工调岗调薪申请表_A[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.fbillno);
    }
    $("#fname").val(item.提报人);
    $("#fdept").val(item.申请部门);
    $("#fdate").val(FormatterTimeYMS(item.申请日期));
    $("#fbdfw").val(item.变动范围);
    if (item.附件 != null && item.附件 != "") {
        var fjtmp = (String)(item.附件);

        fjArray = fjtmp.split(";");


        //console.log("fjArray:" + fjArray);

        //请求附件详细信息
        $.ajax({
            type: 'POST',
            url: '/api/bpm/GetAttachmentsInfo',
            //dataType:'json',
            data: { 'fileIds': fjArray },

            beforeSend: function (XHR) {
                XHR.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem('ticket'));
            },
            success: function (data, status) {
                if (status == "success") {

                    console.log(data);

                    for (var i = 0; i < data.length; i++) {

                        var name = data[i].Name;
                        var type = (data[i].Ext).replace(".", "");
                        var size = String(data[i].Size);

                        var time = String(data[i].LastUpdate).replace("T", " ");
                        var downurl = baseDownloadUrl + data[i].FileID;

                        var attach = attachItem(name, type, size, time, downurl);
                        attachArray.push(attach);

                        var li = '<div class="pic-preview smallyulan success">';
                        li = li + ' <div class="del none" style="opacity:1;z-index:999;"onclick="delPicture(this)">x</div>';

                        //类型判断 
                        if ((data[i].Ext).indexOf("png") != -1 || (data[i].Ext).indexOf("jpg") != -1 || (data[i].Ext).indexOf("bmp") != -1) {

                            //li = li + '    <div class="img-wrap smallimg" id="simg" ><a href="'+baseDownloadUrl + data[i].FileID + '"><img src="'+baseDownloadUrl + data[i].FileID + '"/></a></div>';
                            li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '" ><img src="' + baseDownloadUrl + data[i].FileID + '"/></div>';

                        } else if ((data[i].Ext).indexOf("xls") != -1) {

                            li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '"><img src="../../Content/images/xlsx@2x.png"/></div>';

                        } else if ((data[i].Ext).indexOf("doc") != -1) {

                            li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '"><img src="../../Content/images/docx@2x.png"/></div>';

                        } else if ((data[i].Ext).indexOf("ppt") != -1) {

                            li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '"><img src="../../Content/images/ppt@2x.png"/></div>';

                        } else if ((data[i].Ext).indexOf("pdf") != -1) {

                            li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '"><img src="../../Content/images/pdf@2x.png"/></div>';

                        } else if ((data[i].Ext).indexOf("zip") != -1 || (data[i].Ext).indexOf("rar") != -1 || (data[i].Ext).indexOf("7z") != -1) {

                            li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '"><img src="../../Content/images/zip@2x.png"/></div>';

                        } else if ((data[i].Ext).indexOf("txt") != -1) {

                            li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '"><img src="../../Content/images/txt@2x.png"/></div>';

                        } else {
                            li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '"><img src="../../Content/images/unkown@2x.png"/></div>';
                        }

                        li = li + ' </div>';
                        li = li + '</div>';
                        $(".upload-img-list").append(li);


                        $(".imgdiv").each(function () {

                            $(this).parent().find(".del.none").hide();

                        });




                    }
                    watch();
                    $(".imgdiv").on('tap', function () {
                        console.log($(this)[0].id);
                        XuntongJSBridge.call('showFile', {
                            'fileName': attachArray[$(this)[0].id].name,
                            'fileExt': attachArray[$(this)[0].id].type,
                            'fileTime': attachArray[$(this)[0].id].time,
                            'fileSize': attachArray[$(this)[0].id].size,
                            'fileDownloadUrl': attachArray[$(this)[0].id].downurl
                        }, function (result) {
                            //alert(JSON.stringify(result));
                        });
                    });


                }

            }, error: function (e) {
                console.log(e);

            }, complete: function () {

            }

        });

    }
    var item_c1 = data.FormDataSet.威海卫大厦员工调岗调薪申请表_B;
    if (String(item.变动范围).match('部门内') != null) {
        for (var i = 0; i < item_c1.length; i++) {
            itemidArr1.push(item_c2[i].itemid);
            var li = `
           <div id="mx" class="mui-card">
              <div class="mui-input-row itemtitle">
                 <label>明细列表项</label>
                 <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>
              </div>
              <div class="mui-row cutOffLine">
                   <div class="mui-col-xs-4" style="display:flex;">
                        <label for="fbsqrxm">被申请人姓名<i style="color:red;">*</i></label>
                        <input type="text" id="fbsqrxm" name="fbsqrxm" readonly value="${item_c1[i].被申请人姓名}"/>
                   </div>
                   <div class="mui-col-xs-4" style="display:flex;">
                         <label for="frzrq">入职日期<i style="color:red;">*</i></label>

                         <input type="date" id="frzrq" name="frzrq" readonly value="${FormatterTimeYMS(item_c1[i].入职日期)} "/>
                   </div>
                   <div class="mui-col-xs-4" style="display:flex;">
                        <label for="fbddyy">被调动原因<i style="color:red;">*</i></label>
                        <input type="text" id="fbddyy" name="fbddyy" readonly value="${item_c1[i].调动原因}"/>
                   </div> 
              </div>
             
              <div class="mui-row cutOffLine">
                   <div class="mui-col-xs-4" style="display:flex;">
                       <label for="fxrgw">现任岗位<i style="color:red;">*</i></label>
                       <input type="text" id="fxrgw" name="fxrgw" readonly value="${item_c1[i].现任岗位}"/>
                   </div>
                   <div class="mui-col-xs-4" style="display:flex;">
                       <label for="fxggz">现岗工资<i style="color:red;">*</i></label>
                       <input type="number" id="fxggz" name="fxggz" readonly value="${item_c1[i].现岗位工资}"/>
                   </div>
                   <div class="mui-col-xs-4" style="display:flex;">
                        <label for="fndgwrq">拟定岗位日期<i style="color:red;">*</i></label>
                  <input type="date" id="fndgwrq" name="fndgwrq" readonly value="${FormatterTimeYMS(item_c1[i].拟定到岗日期)}"/> 
                   </div> 
              </div>
             
               <div class="mui-row cutOffLine">
                   <div class="mui-col-xs-4" style="display:flex;">
                       <label for="fndgw">拟定岗位<i style="color:red;">*</i></label>
                       <input type="text" id="fndgw" name="fndgw" readonly value="${item_c1[i].拟定岗位}"/>
                   </div>
                   <div class="mui-col-xs-4" style="display:flex;">
                       <label for="fndgwgz">拟定岗位工资<i style="color:red;">*</i></label>
                       <input type="number" id="fndgwgz" name="fndgwgz" readonly value="${item_c1[i].拟定岗位工资}"/>  
                   </div>
                   <div class="mui-col-xs-4" style="display:flex;">
                       <label for="frszt">人事状态</label>
                        <input type="text" id="frszt" name="frszt" readonly value="${item_c1[i].人事状态}"/>   
                   </div> 
              </div>
             
              <div class="mui-input-row" style="height:auto;">
                  <label for="fbz">备注</label>
                  <textarea rows="2" id="fbz" name="fbz" readonly >${item_c1[i].备注}</textarea>
              </div>
           </div>
                 `;
            $("#mxlist_in").append(li);
        }
    }
   

    var item_c2 = data.FormDataSet.威海卫大厦员工调岗调薪申请表_C;
    if (String(item.变动范围).match('部门间') != null) {
        itemidArr2.push(item_c2[i].itemid);
        for (var i = 0; i < item_c2.length; i++) {
            var li = `
           <div id="mx" class="mui-card">
              <div class="mui-input-row itemtitle">
                 <label>明细列表项</label>
                 <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>
              </div>
               <div class="mui-row cutOffLine">
                   <div class="mui-col-xs-4" style="display:flex;">
                      <label for="fsqrxm">申请人姓名<i style="color:red;">*</i></label>
                      <input type="text" id="fsqrxm" name="fsqrxm" readonly value="${item_c2[i].申请人姓名}"/> 
                    </div>
                   <div class="mui-col-xs-4" style="display:flex;">
                       <label for="frzrq">入职日期<i style="color:red;">*</i></label>
                       <input type="date" id="frzrq" name="frzrq" readonly value="${FormatterTimeYMS(item_c2[i].入职日期)} "/>
                    </div>
                     <div class="mui-col-xs-4" style="display:flex;">
                        <label for="fndgwrq">拟定岗位日期<i style="color:red;">*</i></label>
                        <input type="date" id="fndgwrq" name="fndgwrq" readonly value="${FormatterTimeYMS(item_c2[i].拟定到岗日期)}"/>
                    </div>
               </div>
              <div class="mui-row cutOffLine">
                   <div class="mui-col-xs-4" style="display:flex;">
                       <label for="fxzszbm">现在所在部门<label>
                       <input type="text" id="fxzszbm" name="fxzszbm" readonly value="${item_c2[i].现所在部门}"/>
                    </div>
                   <div class="mui-col-xs-4" style="display:flex;">
                        <label for="fxrgw">现任岗位<i style="color:red;">*</i></label> 
                   <input type="text" id="fxrgw" name="fxrgw" readonly value="${item_c2[i].现任岗位}"/>
                    </div>
                     <div class="mui-col-xs-4" style="display:flex;">
                      <label for="fxgwgz">现岗位工资<i style="color:red;">*</i></label>
                   <input type="number" id="fxgwgz" name="fxgwgz" readonly value="${item_c2[i].现岗位工资}"/>
                    </div>
               </div>
                <div class="mui-row cutOffLine">
                   <div class="mui-col-xs-4" style="display:flex;">
                       <label for="fndrbm">拟调入部门<i style="color:red;">*</i></label> 
                       <input type="text" id="fndrbm" name="fndrbm" readonly value="${item_c2[i].拟调入部门}"/>
                       <input type="hidden" id="fndrbmqlj" name="fndrbmqlj" readonly value="${item_c2[i].调入部门路径}"/>
                    </div>
                   <div class="mui-col-xs-4" style="display:flex;">
                         <label for="fdrbmfzr">调入部门负责人</label>
                         <input type="text" id="fdrbmfzr" name="fdrbmfzr" readonly value="${item_c2[i].调入部门负责人}"/>
                         <input type="hidden" id="fdrbmfzrno" name="fdrbmfzrno" value="${item_c2[i].调入部门负责人工号}"/>
                    </div>
                     <div class="mui-col-xs-4" style="display:flex;">
                         <label for="fndgw">拟定岗位<i style="color:red;">*</i></label>
                       <input type="text" id="fndgw" name="fndgw" readonly value="${item_c2[i].拟定岗位}"/>
                    </div>
               </div>
               <div class="mui-row cutOffLine">
                   <div class="mui-col-xs-6" style="display:flex;">
                        <label for="fndgwgz">拟定岗位工资<i style="color:red;">*</i></label>
                        <input type="number" id="fndgwgz" name="fndgwgz" readonly value="${item_c2[i].拟定岗位工资}"/>
                    </div>
                   <div class="mui-col-xs-6" style="display:flex;">
                       <label for="frszt">人事状态</label>
                       <input type="text" id="frszt" name="frszt" readonly value="${item_c2[i].人事状态}"/>  
                    </div>
                     
               </div>
                         
              <div class="mui-input-row" style="height:auto;">
                  <label for="fbz">备注</label>
                  <textarea rows="2" id="fbz" name="fbz" readonly >${item_c2[i].备注}</textarea>
              </div>              
           </div>
                 `;
            $("#mxlist_out").append(li);
        }
    }
}
function nodeControllerExp(NodeName) {
    if (String(NodeName).match('开始') != null) {

    } else if (String(NodeName).match('人事主管') != null) {
        var fztdata = [
            {
                value: '',
                text:'同意'
            },
            {
                value: '',
                text:'不同意'
            }
        ];
        showPickerByZepto('#mxlist_in', '#frszt', fztdata);
        showPickerByZepto('#mxlist_out', '#frszt', fztdata);
    }
}
class MxItem_in {
    constructor(fbsqrxm, frzrq, fbddyy, fxrgw, fxggz, fndgwrq, fndgw, fndgwgz, frszt, fbz) {
        this.fbsqrxm = fbsqrxm;
        this.frzrq = frzrq;
        this.fbddyy = fbddyy;
        this.fxrgw = fxrgw;
        this.fxggz = fxggz;
        this.fndgwrq = fndgwrq;
        this.fndgw = fndgw;
        this.fndgwgz = fndgwgz;
        this.frszt = frszt;
        this.fbz = fbz;
    }
}
class MxItem_out {
    constructor(fsqrxm, frzrq, fndgwrq, fxzszbm, fxrgw, fxgwgz, fndrbm, fndrbmqlj, fdrbmfzr, fdrbmfzrno, fndgw, fndgwgz, frszt, fbz) {
        this.fsqrxm = fsqrxm;
        this.frzrq = frzrq;
        this.fndgwrq = fndgwrq;
        this.fxzszbm = fxzszbm;
        this.fxrgw = fxrgw;
        this.fxgwgz = fxgwgz;
        this.fndrbm = fndrbm;
        this.fndrbmqlj = fndrbmqlj;
        this.fdrbmfzr = fdrbmfzr;
        this.fdrbmfzrno = fdrbmfzrno;
        this.fndgw = fndgw;
        this.fndgwgz = fndgwgz;
        this.frszt = frszt;
        this.fbz = fbz;
        
    }
}

function Save() {
    
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
    var pid = $("#stepId").val();
    var fbillno = $("#fbillno").val();
    var comment = $("#signSuggest").val();


}