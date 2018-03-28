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
var fjArrayList = [];
var fjArrayListEvery = [];
var fjArrayObjCollections = [];
function initData(data, flag) {
    var item = data.FormDataSet.威海卫大厦青缇湾员工面试信息表_A[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.fbillno);
    }
    $("#fname").val(item.提报人);
    $("#fdept").val(item.提报部门);
    $("#fdate").val(FormatterTimeYMS(item.提报日期));

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
                             <input type="date" id="fcsny" name="fcsny" readonly value="${FormatterTimeYMS(item_c[i].出生年月)}"/> 
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
                          
                      </div>   
                      <div class="mui-input-row cutOffLine" style="height:7rem;overflow:scroll;" id="uploaddiv">
                          <div class="border border-t upload-img" style="top:0rem;">                           
                            <div class="clearfix upload-btn" id="children-bg">
                                <label class="label">附件</label>
                                <input type="hidden" id="fj_info_ids" name="fj_info_ids" readonly value="${item_c[i].附件}"/>    
                                <span class="upload-addbtn" style="display:none;">
                                    <input type="file" accept="image/jpeg,image/jpg,image/png,image/jp2,image/bmp" id="file" style="opacity:0;">
                                </span>
                            </div>
                            <div class="upload-img-list-${i}" id="imglist">
                            </div>
                        </div>
                      </div>  
                  </div>
                 `;
        $("#mxlist").append(li);
        var fjArrayC = item_c[i].附件;
        fjArrayList.push(fjArrayC);
      
    }
    console.log(fjArrayList.join(";").split(";"));
    fjArrayListEvery = fjArrayList.join(";").split(";");
    $.ajax({
        type: 'POST',
        url: '/api/bpm/GetAttachmentsInfo',

        data: { 'fileIds': fjArrayListEvery },

        beforeSend: function (XHR) {
            XHR.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem('ticket'));
        }
    }).done((data) => {
        console.log(data);
        if (data.length == 0) {
            console.log('返回结果为空');
        }
        for (var i = 0; i < data.length; i++){
            //请求返回到的附件信息
            var obj = {
                'Ext': String(data[i].Ext).replace(".", ""),
                'FileID': data[i].FileID,
                'LParam1': data[i].LParam1,
                'LastUpdate': String(data[i].LastUpdate).replace("T", " "),
                'MimeType': data[i].MimeType,
                'Name': data[i].Name,
                'OwnerAccount': data[i].OwnerAccount,
                'Size': String(data[i].Size),
                'DownloadUrl': baseDownloadUrl + data[i].FileID
            }
            fjArrayObjCollections.push(obj);
        }
        

    }).fail((e) => {

    }).then((data) => {
       


        $("#mxlist").find("input[name='fj_info_ids']").each(function (index, element) {
            var fjInfoIds = $(this).val();
            for (var i = 0; i < fjArrayObjCollections.length; i++){
                if (String(fjInfoIds).match(fjArrayObjCollections[i].FileID) != null) {
                    console.log(fjArrayObjCollections[i]);
                    var li = ``;
                    if (String(fjArrayObjCollections[i].Ext).match('png') != null || String(fjArrayObjCollections[i].Ext).match('jpg') != null || String(fjArrayObjCollections[i].Ext).match('jpg') != null) {
                        li = AssembledDom(fjArrayObjCollections[i].Ext, baseDownloadUrl + fjArrayObjCollections[i].FileID, fjArrayObjCollections[i].FileID);
                    } else {
                        li = AssembledDom(fjArrayObjCollections[i].Ext, '', fjArrayObjCollections[i].FileID);
                    }
                    $(this).parent().parent().parent().find("#imglist").append(li);
                    
                }
            }
        });
        $(".imgdiv").each(function () {
            $(this).on('tap', function () {
                console.log($(this).attr('id'));
                var fileid = $(this).attr('id');
                for (var i = 0; i < fjArrayObjCollections.length; i++){
                    if (String(fjArrayObjCollections[i].FileID).match(fileid) != null) {
                        console.log(fjArrayObjCollections[i]);
                        XuntongJSBridge.call('showFile', {
                            'fileName': fjArrayObjCollections[i].Name,
                            'fileExt': fjArrayObjCollections[i].Ext,
                            'fileTime': fjArrayObjCollections[i].LastUpdate,
                            'fileSize': fjArrayObjCollections[i].Size,
                            'fileDownloadUrl': fjArrayObjCollections[i].DownloadUrl
                        }, function (result) {
                            //alert(JSON.stringify(result));
                        });
                    }
                }
            });

        });

    });


   
}
//拼装dom
function AssembledDom(fileExt, url,id) {
    var li = ``;
    //pic
    if (String(fileExt).match('png') != null || String(fileExt).match('jpg') != null || String(fileExt).match('bmp') != null) {
        li = `
              <div class="pic-preview smallyulan success">
                  <div class="del none" style="opacity:1;z-index:999;display:none;"onclick="delPicture(this)">x</div>
                      <div class="img-wrap smallimg imgdiv" id="${id}"><img src="${url}"/></div>
                  </div>
              </div>  
             `;
        //excel
    } else if (String(fileExt).match('xls') != null) {
        li = `
              <div class="pic-preview smallyulan success">
                  <div class="del none" style="opacity:1;z-index:999;display:none;"onclick="delPicture(this)">x</div>
                     <div class="img-wrap smallimg imgdiv" id="${id}"><img src="../../../../Content/images/xlsx@2x.png"/></div>
                  </div>
              </div>  
             `;
        //word
    } else if (String(fileExt).match('doc') != null){
        li = `
              <div class="pic-preview smallyulan success">
                  <div class="del none" style="opacity:1;z-index:999;display:none;"onclick="delPicture(this)">x</div>
                     <div class="img-wrap smallimg imgdiv" id="${id}"><img src="../../../../Content/images/docx@2x.png"/></div>
                  </div>
              </div>  
             `;
        //ppt
    } else if (String(fileExt).match('ppt') != null) {
        li = `
              <div class="pic-preview smallyulan success">
                  <div class="del none" style="opacity:1;z-index:999;display:none;"onclick="delPicture(this)">x</div>
                     <div class="img-wrap smallimg imgdiv" id="${id}"><img src="../../../../Content/images/ppt@2x.png"/></div>
                  </div>
              </div>  
             `;
        //pdf
    } else if (String(fileExt).match('pdf') != null) {
        li = `
              <div class="pic-preview smallyulan success">
                  <div class="del none" style="opacity:1;z-index:999;display:none;"onclick="delPicture(this)">x</div>
                     <div class="img-wrap smallimg imgdiv" id="${id}"><img src="../../../../Content/images/pdf@2x.png"/></div>
                  </div>
              </div>  
             `;
        //zip
    } else if (String(fileExt).match('zip') != null || String(fileExt).match('7z') != null || String(fileExt).match('rar') != null) {
        li = `
              <div class="pic-preview smallyulan success">
                  <div class="del none" style="opacity:1;z-index:999;display:none;"onclick="delPicture(this)">x</div>
                     <div class="img-wrap smallimg imgdiv" id="${id}"><img src="../../../../Content/images/zip@2x.png"/></div>
                  </div>
              </div>  
             `;
        //txt
    } else if (String(fileExt).match('txt') != null) {
        li = `
              <div class="pic-preview smallyulan success">
                  <div class="del none" style="opacity:1;z-index:999;display:none;"onclick="delPicture(this)">x</div>
                     <div class="img-wrap smallimg imgdiv" id="${id}"><img src="../../../../Content/images/txt@2x.png"/></div>
                  </div>
              </div>  
             `;
        //other
    } else {
        li = `
              <div class="pic-preview smallyulan success">
                  <div class="del none" style="opacity:1;z-index:999;display:none;"onclick="delPicture(this)">x</div>
                     <div class="img-wrap smallimg imgdiv" id="${id}"><img src="../../../../Content/images/unkown@2x.png"/></div>
                  </div>
              </div>  
             `;
    }
    
    return li;
}


function uploadRe() {


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
