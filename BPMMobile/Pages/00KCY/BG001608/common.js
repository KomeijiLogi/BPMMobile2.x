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
var parArr = [];
var childArr = [];
var fjArrayList = [];
var fjArrayListEvery = [];
var fjArrayObjCollections = [];
var fjArrayList2 = [];
var fjArrayList3 = [];


function initData(data, flag) {
    var item = data.FormDataSet.BPM_YGCLTXZSQ_A[0];
    parArr = item;                     //传递值
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.fbillno);
    }
    $("#fname").val(item.fname);
    $("#fdate").val(FormatterTimeYMS(item.fdate));
    $("#fgs").val(item.fgs);
    $("#ftel").val(item.ftel);
    $("#flx").val(item.flx);
    var item_c = data.FormDataSet.BPM_YGCLTXZSQ_B;
    childArr =(item_c);                //传递值
    itemidArr = Array.from(item_c, x => x.itemid);
    console.log(childArr);
    for (var i = 0; i < item_c.length; i++) {
        //itemidArr.push(item_c[i].itemid);
        var li = `
                   <div id="mx" class="mui-card">
                      <div class="mui-input-row itemtitle">
                         <label>明细列表项</label>
                         <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>
                      </div>
                      <div class="mui-row cutOffLine" style="padding:3vw;">
                         <div class="mui-col-xs-4" style="display:flex;">
                            <label>姓名<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fxm" readonly >${item_c[i].fxm}</textarea> 
                         </div>
                          <div class="mui-col-xs-4" style="display:flex;">
                             <label>所属集团</label>
                             <textarea rows="2" id="fss_jt" readonly>${item_c[i].fss_jt}</textarea>
                         </div>
                         <div class="mui-col-xs-4" style="display:flex;">
                             <label>所属公司</label> 
                             <textarea rows="2" id="fss_gs" readonly>${item_c[i].fss_gs}</textarea>
                         </div>                           
                      </div>
                       <div class="mui-row cutOffLine" style="padding:3vw;">
                            <div class="mui-col-xs-4" style="display:flex;">
                                <label>手机号码<i style="color:red;">*</i></label>
                                <textarea rows="2" id="fsjh" readonly>${item_c[i].fsjh}</textarea> 
                            </div>
                            <div class="mui-col-xs-4" style="display:flex;">
                                <label>车牌号<i style="color:red;">*</i></label>
                                <textarea rows="2" id="fcph" readonly>${item_c[i].fcph}</textarea>  
                            </div>
                            <div class="mui-col-xs-4" style="display:flex;">
                                <label>车型<i style="color:red;">*</i></label>
                                <textarea rows="2" id="fcx" readonly>${item_c[i].fcx}</textarea> 
                            </div>
                       </div>
                        <div class="mui-input-row cutOffLine" style="height:7rem;overflow:scroll;" id="uploaddiv">
                                <div class="border border-t upload-img" style="top:0rem;">
                                    <div class="clearfix upload-btn" id="children-bg">
                                        <label class="label">行驶证<i style="color:red;">*</i></label>
                                         <input type="hidden" id="fj_info_ids" name="fj_info_ids" readonly value="${item_c[i].fxsz}"/>    
                                        <span class="upload-addbtn" style="display:none;">
                                            <input type="file" accept="image/jpeg,image/jpg,image/png,image/jp2,image/bmp" id="file" style="opacity:0;">
                                        </span>
                                    </div>
                                    <div class="upload-img-list-${i}" id="imglist"></div>
                                </div>
                        </div>
                      <div class="mui-row cutOffLine" style="padding:3vw;">
                          <div class="mui-col-xs-12" style="display:flex;">
                              <label>行驶证持有人<i style="color:red;">*</i></label> 
                              <textarea rows="2" id="fcyr" readonly >${item_c[i].fcyr}</textarea>
                          </div>
                      </div>
                        <div class="mui-input-row cutOffLine" style="height:7rem;overflow:scroll;" id="uploaddiv">
                                <div class="border border-t upload-img" style="top:0rem;">
                                    <div class="clearfix upload-btn" id="children-bg">
                                        <label class="label">驾驶证<i style="color:red;">*</i></label>
                                        <input type="hidden" id="fj_info_ids" name="fj_info_ids" readonly value="${item_c[i].fjsz}"/>    
                                        <span class="upload-addbtn" style="display:none;">
                                            <input type="file" accept="image/jpeg,image/jpg,image/png,image/jp2,image/bmp" id="file" style="opacity:0;">
                                        </span>
                                    </div>
                                    <div class="upload-img-list-${i}" id="imglist"></div>
                                </div>
                        </div>
                        <div class="mui-input-row cutOffLine" style="height:7rem;overflow:scroll;" id="uploaddiv">
                                <div class="border border-t upload-img" style="top:0rem;">
                                    <div class="clearfix upload-btn" id="children-bg">
                                        <label class="label">结婚证<i style="color:red;">*</i></label>
                                         <input type="hidden" id="fj_info_ids" name="fj_info_ids" readonly value="${item_c[i].fjhz}"/>    
                                        <span class="upload-addbtn" style="display:none;">
                                            <input type="file" accept="image/jpeg,image/jpg,image/png,image/jp2,image/bmp" id="file" style="opacity:0;">
                                        </span>
                                    </div>
                                    <div class="upload-img-list-${i}" id="imglist"></div>
                                </div>
                        </div>
                        <div class="mui-row cutOffLine" style="padding:3vw;">
                            <div class="mui-col-xs-12" style="display:flex;">
                                 <label>车辆通行证号<i style="color:red;">*</i></label>
                                 <textarea rows="2" id="ftxzh" readonly>${changeNullToEmpty(item_c[i].ftxzh)}</textarea >
                            </div>     
                        </div> 
                  </div>
                   `;
        $("#mxlist").append(li);
      
        fjArrayList.push(item_c[i].fxsz);
        fjArrayList2.push(item_c[i].fjsz);
        fjArrayList3.push(item_c[i].fjhz);
        console.log(fjArrayList);
        fjArrayListEvery = fjArrayList.join(";").split(";");
       
        fjArrayListEvery = fjArrayList.concat(fjArrayList2, fjArrayList3);
        console.log('--------fjArrayListEvery------------');
        console.log(fjArrayListEvery);
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
            for (var i = 0; i < data.length; i++) {
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
                for (var i = 0; i < fjArrayObjCollections.length; i++) {
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
                    for (var i = 0; i < fjArrayObjCollections.length; i++) {
                        if (String(fjArrayObjCollections[i].FileID).match(fileid) != null) {
                            console.log(fjArrayObjCollections[i]);
                            if (String(navigator.userAgent).match('cloudhub') != null) {
                                window.open(fjArrayObjCollections[i].DownloadUrl);
                            }
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

}
function nodeControllerExp(NodeName) {
    if (String(NodeName).match('开始') != null) {

    } else if (String(NodeName).match('班车管理员') != null) {
        $("#mxlist").find('#ftxzh').each(function () {
            $(this).removeAttr('readonly');
        });
    }
}


function checkNes() {
    var nodeName = $("#nodeName").val();
    var flag = true;
    if (String(nodeName).match('班车管理员') != null) {
        $("#mxlist").find("#ftxzh").each(function () {
            if (!$(this).val()) {
                flag = !flag;
                mui.toast('请填写车辆通行证号');
                return;
            }
        });
        return flag;
    }
    return true;
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
    var nodeName = $("#nodeName").val();

    var fname = $("#fname").val();
    var fdate = $("#fdate").val();
    var fgs = $("#fgs").val();
    var ftel = $("#ftel").val();
    var flx = $("#flx").val();
    console.log(parArr);
    console.log(childArr);

    var consignFlag = false;
    var consignUserId = new Array();
    var consignRoutingType;
    var consignReturnType;

    var consignUserStr;

    //加签if分支
    if (($('#signPer').val() != null) && ($('#signPer').val() != '')) {
        consignFlag = true;

        if ($('#sxsl').hasClass('mui-selected')) {
            consignRoutingType = 'Serial';

        } else if ($('#pxsl').hasClass('mui-selected')) {
            consignRoutingType = 'Parallel';
        }

        if ($('#hdbjdl').hasClass('mui-selected')) {
            consignReturnType = 'Return';
        } else if ($('#jrxjdl').hasClass('mui-selected')) {
            consignReturnType = 'Forward';
        }


        var consignAjax = $.ajax({
            type: "POST",
            url: "/api/bpm/PostAccount",
            data: { "ids": consignOpenIdArr },
            beforeSend: function (XHR) {
                XHR.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem('ticket'));

            }
        }).done(function (data, status) {
            //alert(status);
            if (status == "success") {


                for (var i = 0; i < data.data.length; i++) {
                    consignUserId.push(data.data[i].phone);
                }
                $('#consignUser').val(consignUserId);
                consignUserStr = (String)($('#consignUser').val()).split(",");

                for (var i = 0; i < consignUserStr.length; i++) {
                    consignUserStr[i] = '&quot;' + consignUserStr[i] + '&quot;';
                }
                consignUserStr = '[' + consignUserStr.toString() + ']';



            }
        }).fail(function () {

        });
    } else {


    }
    if (consignFlag) {
        consignAjax.then(function () {
            var xml = `<?xml version="1.0"?>
                     <XForm>
                     <Header>
                     <Method>Process</Method>
                     <PID>${pid}</PID>
                     <Action>同意</Action>
                     <Comment>${comment}</Comment>
            
                     <ConsignEnabled>true</ConsignEnabled>
                     <ConsignUsers>${consignUserStr}</ConsignUsers>
                     <ConsignRoutingType>${consignRoutingType}</ConsignRoutingType>
                     <ConsignReturnType>${consignReturnType}</ConsignReturnType>
                     <InviteIndicateUsers>[]</InviteIndicateUsers>
                     <Context>{&quot;Routing&quot;:{}}</Context>
                     </Header>
                     <FormData>`;
            xml += `
                       <BPM_YGCLTXZSQ_A>
                        <fbillno>${parArr.fbillno}</fbillno>
                        <fname>${parArr.fname}</fname>
                        <fdate>${parArr.fdate}</fdate>
                        <fgs>${parArr.fgs}</fgs>
                        <ftel>${parArr.ftel}</ftel>
                        <flx>${parArr.flx}</flx>
                        <fsqgd>${parArr.fsqgd}</fsqgd>
                    </BPM_YGCLTXZSQ_A>
                   `;
            for (var i = 0; i < childArr.length;i++) {
                xml += `
                           <BPM_YGCLTXZSQ_B>
                                <RelationRowGuid>${i + 1}</RelationRowGuid>
                                <RowPrimaryKeys>itemid=${childArr[i].itemid}</RowPrimaryKeys>
                                <fentyrno>${i + 1}</fentyrno>
                                <fxm>${childArr[i].fxm}</fxm>
                                <fss_jt>${childArr[i].fss_jt}</fss_jt>
                                <fss_gs>${childArr[i].fss_gs}</fss_gs>
                                <fsjh>${childArr[i].fsjh}</fsjh>
                                <fcph>${childArr[i].fcph}</fcph>
                                <fcx>${childArr[i].fcx}</fcx>
                                <fxsz>${childArr[i].fxsz}</fxsz>
                                <fcyr>${childArr[i].fcyr}</fcyr>
                                <fjsz>${childArr[i].fjsz}</fjsz>
                                <fjhz>${childArr[i].fjhz}</fjhz>
                                <ftxzh>${childArr[i].ftxzh}</ftxzh>
                            </BPM_YGCLTXZSQ_B>
                        `;
            }
            xml += `
                       </FormData>
                    </XForm>
                   `;
            PostXml(xml);
        })
    } else {
        var xml = `<?xml version="1.0"?>
                   <XForm>
                   <Header>
                   <Method>Process</Method>
                   <PID>${pid}</PID>
                   <Action>同意</Action>
                   <Comment>${comment}</Comment>

                    <UrlParams></UrlParams>
                    <ConsignEnabled>false</ConsignEnabled>
                    <ConsignUsers>[]</ConsignUsers>
                    <ConsignRoutingType>Parallel</ConsignRoutingType>
                    <ConsignReturnType>Return</ConsignReturnType>

                  <InviteIndicateUsers>[]</InviteIndicateUsers>
                  <Context>{&quot;Routing&quot;:{}}</Context>
                  </Header>
                  <FormData>`;
        xml += `
                       <BPM_YGCLTXZSQ_A>
                        <fbillno>${parArr.fbillno}</fbillno>
                        <fname>${parArr.fname}</fname>
                        <fdate>${parArr.fdate}</fdate>
                        <fgs>${parArr.fgs}</fgs>
                        <ftel>${parArr.ftel}</ftel>
                        <flx>${parArr.flx}</flx>
                        <fsqgd>${parArr.fsqgd}</fsqgd>
                    </BPM_YGCLTXZSQ_A>
                   `;
        for (var i = 0; i < childArr.length; i++) {
            xml += `
                           <BPM_YGCLTXZSQ_B>
                                <RelationRowGuid>${i + 1}</RelationRowGuid>
                                <RowPrimaryKeys>itemid=${childArr[i].itemid}</RowPrimaryKeys>
                                <fentyrno>${i + 1}</fentyrno>
                                <fxm>${childArr[i].fxm}</fxm>
                                <fss_jt>${childArr[i].fss_jt}</fss_jt>
                                <fss_gs>${childArr[i].fss_gs}</fss_gs>
                                <fsjh>${childArr[i].fsjh}</fsjh>
                                <fcph>${childArr[i].fcph}</fcph>
                                <fcx>${childArr[i].fcx}</fcx>
                                <fxsz>${childArr[i].fxsz}</fxsz>
                                <fcyr>${childArr[i].fcyr}</fcyr>
                                <fjsz>${childArr[i].fjsz}</fjsz>
                                <fjhz>${childArr[i].fjhz}</fjhz>
                                <ftxzh>${childArr[i].ftxzh}</ftxzh>
                            </BPM_YGCLTXZSQ_B>
                        `;
        }
        xml += `
                       </FormData>
                    </XForm>
                   `;
        //console.log(xml);
        PostXml(xml);
    }
}