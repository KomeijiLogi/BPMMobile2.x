function prepMsg() {
    upload();
    $("#fdate").val(getNowFormatDate(2));
    var xml = `<?xml version= "1.0" ?>
               <Requests>
               <Params>
               <Method>GetFormPostData</Method>
               <ProcessName>威海卫大厦客房销售记录提报</ProcessName>
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
        $("#fname").val(item.申请人);
        $("#fdept").val(item.申请部门);
       
    }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
        if (XMLHttpRequest.status == "401") {
            mui.alert('授权过期，请重新打开页面');;
        } else if (XMLHttpRequest.status == "500") {
            mui.alert('服务器内部错误');
        }
        
        });
    tapEvent();
}

function tapEvent() {
    var fyeardata = [
        {
            value: '',
            text:'2017'
        },
        {
            value: '',
            text: '2018'
        },
        {
            value: '',
            text: '2019'
        }
    ];
    showPicker('fxsnd', fyeardata);

    var fmonthdata = [];
    for (var i = 0; i < 12; i++) {
        var obj = {
            value: '',
            text:(i+1)
        }
        fmonthdata.push(obj);
    }
  
    showPicker('fxsyd', fmonthdata);

    $("#tjmx_kf").on('tap', () => {
        var li = `
           <div id="mx" class="mui-card">
                  <div class="mui-input-row itemtitle">
                     <label>明细列表项</label>
                     <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>
                  </div>
                  <div class="mui-row  cutOffLine">
                     <div class="mui-col-xs-6" style="display:flex;">
                         <label>房间<i style="color:red;">*</i></label>
                         <input type="text" id="ffj" name="ffj" placeholder="请输入"/>
                     </div>
                     <div class="mui-col-xs-6" style="display:flex;">
                         <label>房数(间)<i style="color:red;">*</i></label>
                         <input type="number" id="ffs" name="ffs" placeholder="请输入"/>
                     </div>
                   </div>   
                    <div class="mui-row cutOffLine">
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>底价收入<i style="color:red;">*</i></label>
                            <input type="number" id="fdjsr" name="fdjsr" placeholder="请输入"/>
                       </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>实际收入<i style="color:red;">*</i></label>
                            <input type="number" id="fsjsr" name="fsjsr" placeholder="请输入"/> 
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>差额<i style="color:red;">*</i></label>
                            <input type="number" id="fce1" name="fce1" placeholder="请输入"/>
                        </div>
                    </div>
                    <div class="mui-row cutOffLine">
                        <div class="mui-col-xs-4" style="display:flex;">
                             <label>平均房价底价</label>
                             <input type="number" id="fpjfjdj" name="fpjfjdj" placeholder="请输入"/>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                             <label>实际平均房价</label>
                             <input type="number" id="fsjpjfj" name="fsjpjfj" placeholder="请输入"/>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                             <label>差额</label>
                             <input type="number" id="fce2" name="fce2" placeholder="请输入" />
                        </div> 
                    </div>
           </div>
                 `;
        $("#mxlist_kf").append(li);
        $("#mxlist_kf").find('input[type="number"]').each(function () {
            $(this).on('input', () => {
                calcTotal_kf();
            });
           
        });
    });
    $("#tjmx_yg").on('tap', () => {
        var li = `
                 <div id="mx" class="mui-card">
                      <div class="mui-input-row itemtitle">
                         <label>明细列表项</label>
                         <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>
                      </div>
                      <div class="mui-row cutOffLine" >
                          <div class="mui-col-xs-3" style="display:flex;">
                              <label>姓名<i style="color:red;">*</i></label> 
                              <input type="text" id="fxm" name="fxm" placeholder="请输入"/> 
                          </div>
                          <div class="mui-col-xs-3" style="display:flex;">
                              <label>商务房<i style="color:red;">*</i></label>
                              <input type="number" id="fswf" name="fswf" placeholder="请输入"/>   
                          </div>
                          <div class="mui-col-xs-3" style="display:flex;">
                              <label>豪华房<i style="color:red;">*</i></label>
                              <input type="number" id="fhhf" name="fhhf" placeholder="请输入"/>  
                          </div>
                          <div class="mui-col-xs-3" style="display:flex;">
                              <label>行政房<i style="color:red;">*</i></label>
                              <input type="number" id="fxzf" name="fxzf" placeholder="请输入"/>
                          </div>  
                      </div>
                      <div class="mui-row cutOffLine">
                          <div class="mui-col-xs-6" style="display:flex;">
                              <label>商务套房<i style="color:red;">*</i></label>
                              <input type="number" id="fswtf" name="fswtf" placeholder="请输入"/>
                          </div>
                          <div class="mui-col-xs-6" style="display:flex;">
                              <label>豪华套房<i style="color:red;">*</i></label>
                              <input type="number" id="fhhtf" name="fhhtf" placeholder="请输入"/>  
                          </div>
                      </div>
                      <div class="mui-row cutOffLine">
                         <div class="mui-col-xs-3" style="display:flex;">
                              <label>销售底价<i style="color:red;">*</i></label>
                              <input type="number" id="fxsdj" name="fxsdj" placeholder="请输入"/>
                         </div>
                         <div class="mui-col-xs-3" style="display:flex;">
                              <label>超额奖励<i style="color:red;">*</i></label>
                              <input type="number" id="fcejl" name="fcejl" placeholder="请输入"/>
                         </div>
                         <div class="mui-col-xs-3" style="display:flex;">
                             <label>总计<i style="color:red;">*</i></label>
                             <input type="number" id="fzj" name="fzj" placeholder="请输入"/> 
                         </div>
                         <div class="mui-col-xs-3" style="display:flex;">
                             <label>实际发放<i style="color:red;">*</i></label> 
                             <input type="number" id="fsjff" name="fsjff" placeholder="请输入"/> 
                         </div>
                      </div>
                </div>
                 `;
        $("#mxlist_yg").append(li);
        $("#mxlist_yg").find('input[type="number"]').each(function () {
            $(this).on('input', () => {
                calcTotal_yg();
            });

        });
    });
}

//计算客房总计
function calcTotal_kf() {
    var f_kf_fs_total = 0;
    var f_kf_dj_total = 0;
    var f_kf_sj_total = 0;
    var f_kf_ce_total = 0;
    var f_kf_pjdj_total = 0;
    var f_kf_sjpj_total = 0;
    var f_kf_ce2_total = 0;


    $("#mxlist_kf").find("#mx").each(function () {
        var ffs = parseFloat($(this).find("#ffs").val());
        var fdjsr = parseFloat($(this).find("#fdjsr").val());
        var fsjsr = parseFloat($(this).find("#fsjsr").val());
        var fce1 = parseFloat($(this).find("#fce1").val());
        var fpjfjdj = parseFloat($(this).find("#fpjfjdj").val());
        var fsjpjfj = parseFloat($(this).find("#fsjpjfj").val());
        var fce2 = parseFloat($(this).find("#fce2").val());
        ffs = isNaN(ffs) ? 0 : ffs;
        fdjsr = isNaN(fdjsr) ? 0 : fdjsr;
        fsjsr = isNaN(fsjsr) ? 0 : fsjsr;
        fce1 = isNaN(fce1) ? 0 : fce1;
        fpjfjdj = isNaN(fpjfjdj) ? 0 : fpjfjdj;
        fsjpjfj = isNaN(fsjpjfj) ? 0 : fsjpjfj;
        fce2 = isNaN(fce2) ? 0 : fce2;

        f_kf_fs_total += ffs;
        f_kf_dj_total += fdjsr;
        f_kf_sj_total += fsjsr;
        f_kf_ce_total += fce1;
        f_kf_pjdj_total += fpjfjdj;
        f_kf_sjpj_total += fsjpjfj;
        f_kf_ce2_total += fce2;

    });
    $("#f_kf_fs_total").val(f_kf_fs_total);
    $("#f_kf_dj_total").val(f_kf_dj_total);
    $("#f_kf_sj_total").val(f_kf_sj_total);
    $("#f_kf_ce_total").val(f_kf_ce_total);
    $("#f_kf_pjdj_total").val(f_kf_pjdj_total);
    $("#f_kf_sjpj_total").val(f_kf_sjpj_total);
    $("#f_kf_ce2_total").val(f_kf_ce2_total);
}
//计算员工总计
function calcTotal_yg() {
    var f_yg_swf_total = 0;
    var f_yg_hhf_total = 0;
    var f_yg_xzf_total = 0;
    var f_yg_swtf_total = 0;
    var f_yg_hhtf_total = 0;
    var f_yg_xsdj_total = 0;
    var f_yg_cejl_total = 0;
    var f_yg_zj_total = 0;
    var f_yg_sjff_total = 0;
    $("#mxlist_yg").find("#mx").each(function () {
        var fswf = parseFloat($(this).find("#fswf").val());
        var fhhf = parseFloat($(this).find("#fhhf").val());
        var fxzf = parseFloat($(this).find("#fxzf").val());
        var fswtf = parseFloat($(this).find("#fswtf").val());
        var fhhtf = parseFloat($(this).find("#fhhtf").val());
        var fxsdj = parseFloat($(this).find("#fxsdj").val());
        var fcejl = parseFloat($(this).find("#fcejl").val());
        var fzj = parseFloat($(this).find("#fzj").val())
        var fsjff = parseFloat($(this).find("#fsjff").val());

        fswf = isNaN(fswf) ? 0 : fswf;
        fhhf = isNaN(fhhf) ? 0 : fhhf;
        fxzf = isNaN(fxzf) ? 0 : fxzf;
        fswtf = isNaN(fswtf) ? 0 : fswtf;
        fhhtf = isNaN(fhhtf) ? 0 : fhhtf;
        fxsdj = isNaN(fxsdj) ? 0 : fxsdj;
        fcejl = isNaN(fcejl) ? 0 : fcejl;
        fzj = isNaN(fzj) ? 0 : fzj;
        fsjff = isNaN(fsjff) ? 0 : fsjff;

        f_yg_swf_total += fswf;
        f_yg_hhf_total += fhhf;
        f_yg_xzf_total += fxzf;
        f_yg_swtf_total += fswtf;
        f_yg_hhtf_total += fhhtf;
        f_yg_xsdj_total += fxsdj;
        f_yg_cejl_total += fcejl;
        f_yg_zj_total += fzj;
        f_yg_sjff_total += fsjff;
    });
    $("#f_yg_swf_total").val(f_yg_swf_total);
    $("#f_yg_hhf_total").val(f_yg_hhf_total);
    $("#f_yg_xzf_total").val(f_yg_xzf_total);
    $("#f_yg_swtf_total").val(f_yg_swtf_total);
    $("#f_yg_hhtf_total").val(f_yg_hhtf_total);
    $("#f_yg_xsdj_total").val(f_yg_xsdj_total);
    $("#f_yg_cejl_total").val(f_yg_cejl_total);
    $("#f_yg_zj_total").val(f_yg_zj_total);
    $("#f_yg_sjff_total").val(f_yg_sjff_total);
}


var itemidArr1 = new Array();
var itemidArr2 = new Array();
function initData(data, flag) {
    var item = data.FormDataSet.威海卫大厦客房销售记录审批表_A[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.fbillno);
    }
    $("#fname").val(item.申请人);
    $("#fdept").val(item.申请部门);
    $("#fdate").val(FormatterTimeYMS(item.申请日期));
    $("#fxsnd").val(item.销售年度);
    $("#fxsyd").val(item.销售月度);
    $("#fzskjs").val(item.总散客房间数);
    $("#fcytcjs").val(item.参与提成间数);
    $("#f_kf_fs_total").val(item.房数合计);
    $("#f_kf_dj_total").val(item.低价收入合计);
    $("#f_kf_sj_total").val(item.实际收入合计);
    $("#f_kf_ce_total").val(item.差额合计);
    $("#f_kf_pjdj_total").val(item.平均房价低价合计);
    $("#f_kf_sjpj_total").val(item.实际平均房价合计);
    $("#f_kf_ce2_total").val(item.房价差额合计);
    $("#f_yg_swf_total").val(item.商务房合计);
    $("#f_yg_hhf_total").val(item.豪华房合计);
    $("#f_yg_xzf_total").val(item.行政房合计);
    $("#f_yg_swtf_total").val(item.商务套房合计);
    $("#f_yg_hhtf_total").val(item.豪华套房合计);
    $("#f_yg_xsdj_total").val(item.销售低价合计);
    $("#f_yg_cejl_total").val(item.超额奖励合计);
    $("#f_yg_zj_total").val(item.总合计);
    $("#f_yg_sjff_total").val(item.实际发放合计);
   

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

    var item_c1 = data.FormDataSet.威海卫大厦客房销售记录审批表_B;
    for (var i = 0; i < item_c1.length; i++) {
        itemidArr1.push(item_c1[i].itemid);
        var li = `
              <div id="mx" class="mui-card">
                  <div class="mui-input-row itemtitle">
                     <label>明细列表项</label>
                     <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>
                  </div>
                  <div class="mui-row  cutOffLine">
                     <div class="mui-col-xs-6" style="display:flex;">
                         <label>房间<i style="color:red;">*</i></label>
                         <input type="text" id="ffj" name="ffj" readonly value="${changeNullToEmpty(item_c1[i].房型)}"/>
                     </div>
                     <div class="mui-col-xs-6" style="display:flex;">
                         <label>房数(间)<i style="color:red;">*</i></label>
                         <input type="number" id="ffs" name="ffs" readonly value="${item_c1[i].房数}"/>
                     </div>
                   </div>   
                    <div class="mui-row cutOffLine">
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>底价收入<i style="color:red;">*</i></label>
                            <input type="number" id="fdjsr" name="fdjsr" readonly value="${item_c1[i].底价收入}"/>
                       </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>实际收入<i style="color:red;">*</i></label>
                            <input type="number" id="fsjsr" name="fsjsr" readonly value="${item_c1[i].实际收入}"/> 
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>差额<i style="color:red;">*</i></label>
                            <input type="number" id="fce1" name="fce1" readonly value="${item_c1[i].差额}"/>
                        </div>
                    </div>
                    <div class="mui-row cutOffLine">
                        <div class="mui-col-xs-4" style="display:flex;">
                             <label>平均房价底价</label>
                             <input type="number" id="fpjfjdj" name="fpjfjdj" readonly value="${item_c1[i].平均房价底价}"/>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                             <label>实际平均房价</label>
                             <input type="number" id="fsjpjfj" name="fsjpjfj" readonly value="${item_c1[i].实际平均房价}"/>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                             <label>差额</label>
                             <input type="number" id="fce2" name="fce2" readonly value="${item_c1[i].房价差额}"/>
                        </div> 
                    </div>
            </div>
                 `;
        $("#mxlist_kf").append(li);
    }

    var item_c2 = data.FormDataSet.威海卫大厦客房销售记录审批表_C;
    for (var i = 0; i < item_c2.length; i++) {
        itemidArr2.push(item_c2[i].itemid);
        var li = `
                 <div id="mx" class="mui-card">
                      <div class="mui-input-row itemtitle">
                         <label>明细列表项</label>
                         <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>
                      </div>
                      <div class="mui-row cutOffLine" >
                          <div class="mui-col-xs-3" style="display:flex;">
                              <label>姓名<i style="color:red;">*</i></label>
                              <input type="text" id="fxm" name="fxm" readonly value="${changeNullToEmpty(item_c2[i].姓名) }"/> 
                          </div>
                          <div class="mui-col-xs-3" style="display:flex;">
                              <label>商务房<i style="color:red;">*</i></label>
                              <input type="number" id="fswf" name="fswf" readonly value="${item_c2[i].商务房}"/>   
                          </div>
                          <div class="mui-col-xs-3" style="display:flex;">
                              <label>豪华房<i style="color:red;">*</i></label>
                              <input type="number" id="fhhf" name="fhhf" readonly value="${item_c2[i].豪华房}"/>  
                          </div>
                          <div class="mui-col-xs-3" style="display:flex;">
                              <label>行政房<i style="color:red;">*</i></label>
                              <input type="number" id="fxzf" name="fxzf" readonly value="${item_c2[i].行政房}"/>
                          </div>  
                      </div>
                      <div class="mui-row cutOffLine">
                          <div class="mui-col-xs-6" style="display:flex;">
                              <label>商务套房<i style="color:red;">*</i></label>
                              <input type="number" id="fswtf" name="fswtf" readonly value="${item_c2[i].商务套房}"/>
                          </div>
                          <div class="mui-col-xs-6" style="display:flex;">
                              <label>豪华套房<i style="color:red;">*</i></label>
                              <input type="number" id="fhhtf" name="fhhtf" readonly value="${item_c2[i].豪华套房}"/>  
                          </div>
                      </div>
                      <div class="mui-row cutOffLine">
                         <div class="mui-col-xs-3" style="display:flex;">
                              <label>销售底价<i style="color:red;">*</i></label>
                              <input type="number" id="fxsdj" name="fxsdj" readonly value="${item_c2[i].销售低价}"/>
                         </div>
                         <div class="mui-col-xs-3" style="display:flex;">
                              <label>超额奖励<i style="color:red;">*</i></label>
                              <input type="number" id="fcejl" name="fcejl" readonly value="${item_c2[i].超额奖励}"/>
                         </div>
                         <div class="mui-col-xs-3" style="display:flex;">
                             <label>总计<i style="color:red;">*</i></label>
                             <input type="number" id="fzj" name="fzj" readonly  value="${item_c2[i].总计}"/> 
                         </div>
                         <div class="mui-col-xs-3" style="display:flex;">
                             <label>实际发放<i style="color:red;">*</i></label> 
                             <input type="number" id="fsjff" name="fsjff" readonly value="${item_c2[i].实际发放}"/> 
                         </div>
                      </div>
                </div>
                 `;
        $("#mxlist_yg").append(li);
    }
    
}

function nodeControllerExp(NodeName) {

    if (String(NodeName).match('开始') != null) {
        upload();
        $("#tjmx_kf,#tjmx_yg").show();
        tapEvent();
        $("#fdate,#fzskjs,#fcytcjs").removeAttr('readonly');
    }
}

class MxItem_kf {
    constructor(ffj, ffs, fdjsr, fsjsr, fce1, fpjfjdj, fsjpjfj, fce2) {
        this.ffj = ffj;
        this.ffs = ffs;
        this.fdjsr = fdjsr;
        this.fsjsr = fsjsr;
        this.fce1 = fce1;
        this.fpjfjdj = fpjfjdj;
        this.fsjpjfj = fsjpjfj;
        this.fce2 = fce2;

    }
    checkSelf() {
        if (!this.ffj) {
            mui.toast('请填写房型');
            return false;
        }
        if (!this.ffs) {
            mui.toast('请填写房数');
            return false;
        }
        if (!this.fdjsr) {
            mui.toast('请填写底价收入');
            return false;
        }
        if (!this.fsjsr) {
            mui.toast('请填写实际收入');
            return false;
        }
        if (!this.fce1) {
            mui.toast('请填写差额');
            return false;
        }
        if (!this.fpjfjdj) {
            mui.toast('请填写平均房价底价');
            return false;
        }
        if (!this.fsjpjfj) {
            mui.toast('请填写实际平均房价');
            return false;
        }
        if (!this.fce2) {
            mui.toast('请填写房价差额');
            return false;
        }
        return true;
    }
}
class MxItem_yg {
    constructor(fxm, fswf, fhhf, fxzf, fswtf, fhhtf, fxsdj, fcejl, fzj, fsjff) {
        this.fxm = fxm;
        this.fswf = fswf;
        this.fhhf = fhhf;
        this.fxzf = fxzf;
        this.fswtf = fswtf;
        this.fhhtf = fhhtf;
        this.fxsdj = fxsdj;
        this.fcejl = fcejl;
        this.fzj = fzj;
        this.fsjff = fsjff;
    }
    checkSelf() {
        if (!this.fxm) {
            mui.toast('请输入姓名');
            return false;
        }
        if (!this.fswf) {
            mui.toast('请输入商务房');
            return false;
        }
        if (!this.fhhf) {
            mui.toast('请输入豪华房');
            return false;
        }
        if (!this.fxzf) {
            mui.toast('请输入行政房');
            return false;
        }
        if (!this.fswtf) {
            mui.toast('请输入商务套房');
            return false;
        }
        if (!this.fhhtf) {
            mui.toast('请输入豪华套房');
            return false;
        }
        if (!this.fxsdj) {
            mui.toast('请输入销售底价');
            return false;
        }
        if (!this.fcejl) {
            mui.toast('请输入超额奖励');
            return false;
        }
        if (!this.fzj) {
            mui.toast('请输入总计');
            return false;
        }
        if (!this.fsjff) {
            mui.toast('请输入实际发放');
            return false;
        }
        return true;
    }
}

function Save() {

    var fname = $("#fname").val();
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();
    var fxsnd = $("#fxsnd").val();
    var fxsyd = $("#fxsyd").val();
    var fzskjs = $("#fzskjs").val();
    var fcytcjs = $("#fcytcjs").val();
    var f_kf_fs_total = $("#f_kf_fs_total").val();
    var f_kf_dj_total = $("#f_kf_dj_total").val();
    var f_kf_sj_total = $("#f_kf_sj_total").val();
    var f_kf_ce_total = $("#f_kf_ce_total").val();
    var f_kf_pjdj_total = $("#f_kf_pjdj_total").val();
    var f_kf_sjpj_total = $("#f_kf_sjpj_total").val();
    var f_kf_ce2_total = $("#f_kf_ce2_total").val();
    var f_yg_swf_total = $("#f_yg_swf_total").val();
    var f_yg_hhf_total = $("#f_yg_hhf_total").val();
    var f_yg_xzf_total = $("#f_yg_xzf_total").val();
    var f_yg_swtf_total = $("#f_yg_swtf_total").val();
    var f_yg_hhtf_total = $("#f_yg_hhtf_total").val();
    var f_yg_xsdj_total = $("#f_yg_xsdj_total").val();
    var f_yg_cejl_total = $("#f_yg_cejl_total").val();
    var f_yg_zj_total = $("#f_yg_zj_total").val();
    var f_yg_sjff_total = $("#f_yg_sjff_total").val();

    var mxflag = false;
    var mxlistArr1 = new Array();
    $("#mxlist_kf").find("#mx").each(function () {
        var ffj = $(this).find("#ffj").val();
        var ffs = $(this).find("#ffs").val();
        var fdjsr = $(this).find("#fdjsr").val();
        var fsjsr = $(this).find("#fsjsr").val();
        var fce1 = $(this).find("#fce1").val();
        var fpjfjdj = $(this).find("#fpjfjdj").val();
        var fsjpjfj = $(this).find("#fsjpjfj").val();
        var fce2 = $(this).find("#fce2").val();
        
        var mx = new MxItem_kf(ffj, ffs, fdjsr, fsjsr, fce1, fpjfjdj, fsjpjfj, fce2);
        if (!mx.checkSelf()) {
            mxflag = true;
            return;
        }
        mxlistArr1.push(mx);
    });

    var mxlistArr2 = new Array();
    $("#mxlist_yg").find("#mx").each(function () {
        var fxm = $(this).find("#fxm").val();
        var fswf = $(this).find("#fswf").val();
        var fhhf = $(this).find("#fhhf").val();
        var fxzf = $(this).find("#fxzf").val();
        var fswtf = $(this).find("#fswtf").val();
        var fhhtf = $(this).find("#fhhtf").val();
        var fxsdj = $(this).find("#fxsdj").val();
        var fcejl = $(this).find("#fcejl").val();
        var fzj = $(this).find("#fzj").val();
        var fsjff = $(this).find("#fsjff").val();

        var mx = new MxItem_yg(fxm, fswf, fhhf, fxzf, fswtf, fhhtf, fxsdj, fcejl, fzj, fsjff);
        if (!mx.checkSelf()) {
            mxflag = true;
            return;
        }
        mxlistArr2.push(mx);
    });

    if (mxflag) {
        return;
    }
    var btnArry = ["取消", "确定"];
    mui.confirm('即将提交，是否确定？', '提交确认提醒', btnArry, function (e) {
        if (e.index == 1) {
            var xml = `<?xml version= "1.0" ?>
                       <XForm>
                        <Header>
                       <Method>Post</Method>';
                      <ProcessName>威海卫大厦客房销售记录提报</ProcessName>
                        <ProcessVersion>${version}</ProcessVersion>
                        <DraftGuid></DraftGuid>
                          <OwnerMemberFullName>${BPMOU}</OwnerMemberFullName>
                           <Action>提交</Action>
                         <Comment></Comment>
                         <InviteIndicateUsers></InviteIndicateUsers>
                      </Header>
                     <FormData>
              `;
            xml += `
            <威海卫大厦客房销售记录审批表_A>
                <fbillno>自动带出</fbillno>
                <申请人>${fname}</申请人>
                <申请部门>${fdept}</申请部门>
                <申请时间>${fdate}</申请时间>
                <销售年度>${fxsnd}</销售年度>
                <销售月度>${fxsyd}</销售月度>
                <总散客房间数>${fzskjs}</总散客房间数>
                <参与提成间数>${fcytcjs}</参与提成间数>
                <房数合计>${f_kf_fs_total}</房数合计>
                <低价收入合计>${f_kf_dj_total}</低价收入合计>
                <实际收入合计>${f_kf_sj_total}</实际收入合计>
                <差额合计>${f_kf_ce_total}</差额合计>
                <平均房价低价合计>${f_kf_pjdj_total}</平均房价低价合计>
                <实际平均房价合计>${f_kf_sjpj_total}</实际平均房价合计>
                <房价差额合计>${f_kf_ce2_total}</房价差额合计>
                <客房销售导入模板>201711030217</客房销售导入模板>
                <商务房合计>${f_yg_swf_total}</商务房合计>
                <豪华房合计>${f_yg_hhf_total}</豪华房合计>
                <行政房合计>${f_yg_xzf_total}</行政房合计>
                <商务套房合计>${f_yg_swtf_total}</商务套房合计>
                <豪华套房合计>${f_yg_hhtf_total}</豪华套房合计>
                <销售低价合计>${f_yg_xsdj_total}</销售低价合计>
                <超额奖励合计>${f_yg_cejl_total}</超额奖励合计>
                <总合计>${f_yg_zj_total}</总合计>
                <实际发放合计>${f_yg_sjff_total}</实际发放合计>
                <员工销售提成导入模板>201711030215</员工销售提成导入模板>
                <附件>${fjArray.join(";")}</附件>
           </威海卫大厦客房销售记录审批表_A>
                  `;
            if (mxlistArr1.length != 0) {
                for (var i = 0; i < mxlistArr1.length; i++) {
                    xml += `
                    <威海卫大厦客房销售记录审批表_B>
                        <RelationRowGuid>${(i + 1)}</RelationRowGuid>
                        <RowPrimaryKeys></RowPrimaryKeys>
                        <fentryno>${(i + 1)}</fentryno>
                        <房型>${(mxlistArr1[i].ffj)}</房型>
                        <房数>${(mxlistArr1[i].ffs)}</房数>
                        <底价收入>${(mxlistArr1[i].fdjsr)}</底价收入>
                        <实际收入>${mxlistArr1[i].fsjsr}</实际收入>
                        <差额>${mxlistArr1[i].fce1}</差额>
                        <平均房价底价>${mxlistArr1[i].fpjfjdj}</平均房价底价>
                        <实际平均房价>${mxlistArr1[i].fsjpjfj}</实际平均房价>
                        <房价差额>${mxlistArr1[i].fce2}</房价差额>
                    </威海卫大厦客房销售记录审批表_B>
                           `;
                }
            } else {
                xml += `
                     <威海卫大厦客房销售记录审批表_B>
                        <RelationRowGuid>${(i + 1)}</RelationRowGuid>
                        <RowPrimaryKeys></RowPrimaryKeys>
                        <fentryno>${(i + 1)}</fentryno>
                        <房型></房型>
                        <房数></房数>
                        <底价收入></底价收入>
                        <实际收入></实际收入>
                        <差额></差额>
                        <平均房价底价></平均房价底价>
                        <实际平均房价></实际平均房价>
                        <房价差额></房价差额>
                    </威海卫大厦客房销售记录审批表_B>
                       `;
            }
            if (mxlistArr2.length != 0) {
                for (var i = 0; i < mxlistArr2.length; i++) {
                    xml += `
                   <威海卫大厦客房销售记录审批表_C>
                        <RelationRowGuid>${mxlistArr1.length+i+1}</RelationRowGuid>
                        <RowPrimaryKeys></RowPrimaryKeys>
                        <fentryno>${(i + 1)}</fentryno>
                        <姓名>${mxlistArr2[i].fxm}</姓名>
                        <商务房>${mxlistArr2[i].fswf}</商务房>
                        <豪华房>${mxlistArr2[i].fhhf}</豪华房>
                        <行政房>${mxlistArr2[i].fxzf}</行政房>
                        <商务套房>${mxlistArr2[i].fswtf}</商务套房>
                        <豪华套房>${mxlistArr2[i].fhhtf}</豪华套房>
                        <销售低价>${mxlistArr2[i].fxsdj}</销售低价>
                        <超额奖励>${mxlistArr2[i].fcejl}</超额奖励>
                        <总计>${mxlistArr2[i].fzj}</总计>
                        <实际发放>${mxlistArr2[i].fsjff}</实际发放>
                    </威海卫大厦客房销售记录审批表_C>
                           `;
                }

            } else {
                xml += `
                       <威海卫大厦客房销售记录审批表_C>
                        <RelationRowGuid>${mxlistArr1.length + i + 1}</RelationRowGuid>
                        <RowPrimaryKeys></RowPrimaryKeys>
                        <fentryno>${(i + 1)}</fentryno>
                        <姓名></姓名>
                        <商务房></商务房>
                        <豪华房></豪华房>
                        <行政房></行政房>
                        <商务套房></商务套房>
                        <豪华套房></豪华套房>
                        <销售低价></销售低价>
                        <超额奖励></超额奖励>
                        <总计></总计>
                        <实际发放></实际发放>
                    </威海卫大厦客房销售记录审批表_C>
                       `;
            }
            
            xml += `  </FormData>
                      </XForm>`;

            PostXml(xml);
        }
    });
}

function reSave() {
    var pid = $("#stepId").val();
    var fbillno = $("#fbillno").val();
    var fname = $("#fname").val();
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();
    var fxsnd = $("#fxsnd").val();
    var fxsyd = $("#fxsyd").val();
    var fzskjs = $("#fzskjs").val();
    var fcytcjs = $("#fcytcjs").val();
    var f_kf_fs_total = $("#f_kf_fs_total").val();
    var f_kf_dj_total = $("#f_kf_dj_total").val();
    var f_kf_sj_total = $("#f_kf_sj_total").val();
    var f_kf_ce_total = $("#f_kf_ce_total").val();
    var f_kf_pjdj_total = $("#f_kf_pjdj_total").val();
    var f_kf_sjpj_total = $("#f_kf_sjpj_total").val();
    var f_kf_ce2_total = $("#f_kf_ce2_total").val();
    var f_yg_swf_total = $("#f_yg_swf_total").val();
    var f_yg_hhf_total = $("#f_yg_hhf_total").val();
    var f_yg_xzf_total = $("#f_yg_xzf_total").val();
    var f_yg_swtf_total = $("#f_yg_swtf_total").val();
    var f_yg_hhtf_total = $("#f_yg_hhtf_total").val();
    var f_yg_xsdj_total = $("#f_yg_xsdj_total").val();
    var f_yg_cejl_total = $("#f_yg_cejl_total").val();
    var f_yg_zj_total = $("#f_yg_zj_total").val();
    var f_yg_sjff_total = $("#f_yg_sjff_total").val();

    var mxflag = false;
    var mxlistArr1 = new Array();
    $("#mxlist_kf").find("#mx").each(function () {
        var ffj = $(this).find("#ffj").val();
        var ffs = $(this).find("#ffs").val();
        var fdjsr = $(this).find("#fdjsr").val();
        var fsjsr = $(this).find("#fsjsr").val();
        var fce1 = $(this).find("#fce1").val();
        var fpjfjdj = $(this).find("#fpjfjdj").val();
        var fsjpjfj = $(this).find("#fsjpjfj").val();
        var fce2 = $(this).find("#fce2").val();

        var mx = new MxItem_kf(ffj, ffs, fdjsr, fsjsr, fce1, fpjfjdj, fsjpjfj, fce2);
        if (!mx.checkSelf()) {
            mxflag = true;
            return;
        }
        mxlistArr1.push(mx);
    });

    var mxlistArr2 = new Array();
    $("#mxlist_yg").find("#mx").each(function () {
        var fxm = $(this).find("#fxm").val();
        var fswf = $(this).find("#fswf").val();
        var fhhf = $(this).find("#fhhf").val();
        var fxzf = $(this).find("#fxzf").val();
        var fswtf = $(this).find("#fswtf").val();
        var fhhtf = $(this).find("#fhhtf").val();
        var fxsdj = $(this).find("#fxsdj").val();
        var fcejl = $(this).find("#fcejl").val();
        var fzj = $(this).find("#fzj").val();
        var fsjff = $(this).find("#fsjff").val();

        var mx = new MxItem_yg(fxm, fswf, fhhf, fxzf, fswtf, fhhtf, fxsdj, fcejl, fzj, fsjff);
        if (!mx.checkSelf()) {
            mxflag = true;
            return;
        }
        mxlistArr2.push(mx);
    });

    if (mxflag) {
        return;
    }

    var btnArry = ["取消", "确定"];
    mui.confirm('即将提交，是否确定？', '提交确认提醒', btnArry, function (e) {
        if (e.index == 1) {
            var xml = `<?xml version="1.0"?>
            <XForm>
            <Header>
            <Method>Process</Method>
            <PID>${pid}</PID>
            <Action>提交</Action>
            <Comment></Comment>
            <InviteIndicateUsers></InviteIndicateUsers>
            </Header>
            <FormData>`;
            xml += `
            <威海卫大厦客房销售记录审批表_A>
                <fbillno>${fbillno}</fbillno>
                <申请人>${fname}</申请人>
                <申请部门>${fdept}</申请部门>
                <申请时间>${fdate}</申请时间>
                <销售年度>${fxsnd}</销售年度>
                <销售月度>${fxsyd}</销售月度>
                <总散客房间数>${fzskjs}</总散客房间数>
                <参与提成间数>${fcytcjs}</参与提成间数>
                <房数合计>${f_kf_fs_total}</房数合计>
                <低价收入合计>${f_kf_dj_total}</低价收入合计>
                <实际收入合计>${f_kf_sj_total}</实际收入合计>
                <差额合计>${f_kf_ce_total}</差额合计>
                <平均房价低价合计>${f_kf_pjdj_total}</平均房价低价合计>
                <实际平均房价合计>${f_kf_sjpj_total}</实际平均房价合计>
                <房价差额合计>${f_kf_ce2_total}</房价差额合计>
                <客房销售导入模板>201711030217</客房销售导入模板>
                <商务房合计>${f_yg_swf_total}</商务房合计>
                <豪华房合计>${f_yg_hhf_total}</豪华房合计>
                <行政房合计>${f_yg_xzf_total}</行政房合计>
                <商务套房合计>${f_yg_swtf_total}</商务套房合计>
                <豪华套房合计>${f_yg_hhtf_total}</豪华套房合计>
                <销售低价合计>${f_yg_xsdj_total}</销售低价合计>
                <超额奖励合计>${f_yg_cejl_total}</超额奖励合计>
                <总合计>${f_yg_zj_total}</总合计>
                <实际发放合计>${f_yg_sjff_total}</实际发放合计>
                <员工销售提成导入模板>201711030215</员工销售提成导入模板>
                <附件>${fjArray.join(";")}</附件>
           </威海卫大厦客房销售记录审批表_A>
                  `;
            if (mxlistArr1.length != 0) {
                for (var i = 0; i < mxlistArr1.length; i++) {
                    xml += `
                    <威海卫大厦客房销售记录审批表_B>
                        <RelationRowGuid>${(i + 1)}</RelationRowGuid>
                        <RowPrimaryKeys></RowPrimaryKeys>
                        <fentryno>${(i + 1)}</fentryno>
                        <房型>${(mxlistArr1[i].ffj)}</房型>
                        <房数>${(mxlistArr1[i].ffs)}</房数>
                        <底价收入>${(mxlistArr1[i].fdjsr)}</底价收入>
                        <实际收入>${mxlistArr1[i].fsjsr}</实际收入>
                        <差额>${mxlistArr1[i].fce1}</差额>
                        <平均房价底价>${mxlistArr1[i].fpjfjdj}</平均房价底价>
                        <实际平均房价>${mxlistArr1[i].fsjpjfj}</实际平均房价>
                        <房价差额>${mxlistArr1[i].fce2}</房价差额>
                    </威海卫大厦客房销售记录审批表_B>
                           `;
                }
            } else {
                xml += `
                     <威海卫大厦客房销售记录审批表_B>
                        <RelationRowGuid>${(i + 1)}</RelationRowGuid>
                        <RowPrimaryKeys></RowPrimaryKeys>
                        <fentryno>${(i + 1)}</fentryno>
                        <房型></房型>
                        <房数></房数>
                        <底价收入></底价收入>
                        <实际收入></实际收入>
                        <差额></差额>
                        <平均房价底价></平均房价底价>
                        <实际平均房价></实际平均房价>
                        <房价差额></房价差额>
                    </威海卫大厦客房销售记录审批表_B>
                       `;
            }
            if (mxlistArr2.length != 0) {
                for (var i = 0; i < mxlistArr2.length; i++) {
                    xml += `
                   <威海卫大厦客房销售记录审批表_C>
                        <RelationRowGuid>${mxlistArr1.length + i + 1}</RelationRowGuid>
                        <RowPrimaryKeys></RowPrimaryKeys>
                        <fentryno>${(i + 1)}</fentryno>
                        <姓名>${mxlistArr2[i].fxm}</姓名>
                        <商务房>${mxlistArr2[i].fswf}</商务房>
                        <豪华房>${mxlistArr2[i].fhhf}</豪华房>
                        <行政房>${mxlistArr2[i].fxzf}</行政房>
                        <商务套房>${mxlistArr2[i].fswtf}</商务套房>
                        <豪华套房>${mxlistArr2[i].fhhtf}</豪华套房>
                        <销售低价>${mxlistArr2[i].fxsdj}</销售低价>
                        <超额奖励>${mxlistArr2[i].fcejl}</超额奖励>
                        <总计>${mxlistArr2[i].fzj}</总计>
                        <实际发放>${mxlistArr2[i].fsjff}</实际发放>
                    </威海卫大厦客房销售记录审批表_C>
                           `;
                }

            } else {
                xml += `
                       <威海卫大厦客房销售记录审批表_C>
                        <RelationRowGuid>${mxlistArr1.length + i + 1}</RelationRowGuid>
                        <RowPrimaryKeys></RowPrimaryKeys>
                        <fentryno>${(i + 1)}</fentryno>
                        <姓名></姓名>
                        <商务房></商务房>
                        <豪华房></豪华房>
                        <行政房></行政房>
                        <商务套房></商务套房>
                        <豪华套房></豪华套房>
                        <销售低价></销售低价>
                        <超额奖励></超额奖励>
                        <总计></总计>
                        <实际发放></实际发放>
                    </威海卫大厦客房销售记录审批表_C>
                       `;
            }

            xml += `  </FormData>
                      </XForm>`;

            PostXml(xml);
        }
    });
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

    var fname = $("#fname").val();
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();
    var fxsnd = $("#fxsnd").val();
    var fxsyd = $("#fxsyd").val();
    var fzskjs = $("#fzskjs").val();
    var fcytcjs = $("#fcytcjs").val();
    var f_kf_fs_total = $("#f_kf_fs_total").val();
    var f_kf_dj_total = $("#f_kf_dj_total").val();
    var f_kf_sj_total = $("#f_kf_sj_total").val();
    var f_kf_ce_total = $("#f_kf_ce_total").val();
    var f_kf_pjdj_total = $("#f_kf_pjdj_total").val();
    var f_kf_sjpj_total = $("#f_kf_sjpj_total").val();
    var f_kf_ce2_total = $("#f_kf_ce2_total").val();
    var f_yg_swf_total = $("#f_yg_swf_total").val();
    var f_yg_hhf_total = $("#f_yg_hhf_total").val();
    var f_yg_xzf_total = $("#f_yg_xzf_total").val();
    var f_yg_swtf_total = $("#f_yg_swtf_total").val();
    var f_yg_hhtf_total = $("#f_yg_hhtf_total").val();
    var f_yg_xsdj_total = $("#f_yg_xsdj_total").val();
    var f_yg_cejl_total = $("#f_yg_cejl_total").val();
    var f_yg_zj_total = $("#f_yg_zj_total").val();
    var f_yg_sjff_total = $("#f_yg_sjff_total").val();

    var mxflag = false;
    var mxlistArr1 = new Array();
    $("#mxlist_kf").find("#mx").each(function () {
        var ffj = $(this).find("#ffj").val();
        var ffs = $(this).find("#ffs").val();
        var fdjsr = $(this).find("#fdjsr").val();
        var fsjsr = $(this).find("#fsjsr").val();
        var fce1 = $(this).find("#fce1").val();
        var fpjfjdj = $(this).find("#fpjfjdj").val();
        var fsjpjfj = $(this).find("#fsjpjfj").val();
        var fce2 = $(this).find("#fce2").val();

        var mx = new MxItem_kf(ffj, ffs, fdjsr, fsjsr, fce1, fpjfjdj, fsjpjfj, fce2);
       
        mxlistArr1.push(mx);
    });

    var mxlistArr2 = new Array();
    $("#mxlist_yg").find("#mx").each(function () {
        var fxm = $(this).find("#fxm").val();
        var fswf = $(this).find("#fswf").val();
        var fhhf = $(this).find("#fhhf").val();
        var fxzf = $(this).find("#fxzf").val();
        var fswtf = $(this).find("#fswtf").val();
        var fhhtf = $(this).find("#fhhtf").val();
        var fxsdj = $(this).find("#fxsdj").val();
        var fcejl = $(this).find("#fcejl").val();
        var fzj = $(this).find("#fzj").val();
        var fsjff = $(this).find("#fsjff").val();

        var mx = new MxItem_yg(fxm, fswf, fhhf, fxzf, fswtf, fhhtf, fxsdj, fcejl, fzj, fsjff);
       
        mxlistArr2.push(mx);
    });
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
                     </Header>';
                     <FormData>`;
            xml += `
            <威海卫大厦客房销售记录审批表_A>
                <fbillno>${fbillno}</fbillno>
                <申请人>${fname}</申请人>
                <申请部门>${fdept}</申请部门>
                <申请时间>${fdate}</申请时间>
                <销售年度>${fxsnd}</销售年度>
                <销售月度>${fxsyd}</销售月度>
                <总散客房间数>${fzskjs}</总散客房间数>
                <参与提成间数>${fcytcjs}</参与提成间数>
                <房数合计>${f_kf_fs_total}</房数合计>
                <低价收入合计>${f_kf_dj_total}</低价收入合计>
                <实际收入合计>${f_kf_sj_total}</实际收入合计>
                <差额合计>${f_kf_ce_total}</差额合计>
                <平均房价低价合计>${f_kf_pjdj_total}</平均房价低价合计>
                <实际平均房价合计>${f_kf_sjpj_total}</实际平均房价合计>
                <房价差额合计>${f_kf_ce2_total}</房价差额合计>
                <客房销售导入模板>201711030217</客房销售导入模板>
                <商务房合计>${f_yg_swf_total}</商务房合计>
                <豪华房合计>${f_yg_hhf_total}</豪华房合计>
                <行政房合计>${f_yg_xzf_total}</行政房合计>
                <商务套房合计>${f_yg_swtf_total}</商务套房合计>
                <豪华套房合计>${f_yg_hhtf_total}</豪华套房合计>
                <销售低价合计>${f_yg_xsdj_total}</销售低价合计>
                <超额奖励合计>${f_yg_cejl_total}</超额奖励合计>
                <总合计>${f_yg_zj_total}</总合计>
                <实际发放合计>${f_yg_sjff_total}</实际发放合计>
                <员工销售提成导入模板>201711030215</员工销售提成导入模板>
                <附件>${fjArray.join(";")}</附件>
           </威海卫大厦客房销售记录审批表_A>
                  `;
            if (mxlistArr1.length != 0) {
                for (var i = 0; i < mxlistArr1.length; i++) {
                    xml += `
                    <威海卫大厦客房销售记录审批表_B>
                        <RelationRowGuid>${(i + 1)}</RelationRowGuid>
                        <RowPrimaryKeys>itemid=${itemidArr1[i]}</RowPrimaryKeys>
                        <fentryno>${(i + 1)}</fentryno>
                        <房型>${(mxlistArr1[i].ffj)}</房型>
                        <房数>${(mxlistArr1[i].ffs)}</房数>
                        <底价收入>${(mxlistArr1[i].fdjsr)}</底价收入>
                        <实际收入>${mxlistArr1[i].fsjsr}</实际收入>
                        <差额>${mxlistArr1[i].fce1}</差额>
                        <平均房价底价>${mxlistArr1[i].fpjfjdj}</平均房价底价>
                        <实际平均房价>${mxlistArr1[i].fsjpjfj}</实际平均房价>
                        <房价差额>${mxlistArr1[i].fce2}</房价差额>
                    </威海卫大厦客房销售记录审批表_B>
                           `;
                }
            } else {
                xml += `
                     <威海卫大厦客房销售记录审批表_B>
                        <RelationRowGuid>${(i + 1)}</RelationRowGuid>
                        <RowPrimaryKeys></RowPrimaryKeys>
                        <fentryno>${(i + 1)}</fentryno>
                        <房型></房型>
                        <房数></房数>
                        <底价收入></底价收入>
                        <实际收入></实际收入>
                        <差额></差额>
                        <平均房价底价></平均房价底价>
                        <实际平均房价></实际平均房价>
                        <房价差额></房价差额>
                    </威海卫大厦客房销售记录审批表_B>
                       `;
            }
            if (mxlistArr2.length != 0) {
                for (var i = 0; i < mxlistArr2.length; i++) {
                    xml += `
                   <威海卫大厦客房销售记录审批表_C>
                        <RelationRowGuid>${mxlistArr1.length + i + 1}</RelationRowGuid>
                        <RowPrimaryKeys>itemid=${itemidArr2[i]}</RowPrimaryKeys>
                        <fentryno>${(i + 1)}</fentryno>
                        <姓名>${mxlistArr2[i].fxm}</姓名>
                        <商务房>${mxlistArr2[i].fswf}</商务房>
                        <豪华房>${mxlistArr2[i].fhhf}</豪华房>
                        <行政房>${mxlistArr2[i].fxzf}</行政房>
                        <商务套房>${mxlistArr2[i].fswtf}</商务套房>
                        <豪华套房>${mxlistArr2[i].fhhtf}</豪华套房>
                        <销售低价>${mxlistArr2[i].fxsdj}</销售低价>
                        <超额奖励>${mxlistArr2[i].fcejl}</超额奖励>
                        <总计>${mxlistArr2[i].fzj}</总计>
                        <实际发放>${mxlistArr2[i].fsjff}</实际发放>
                    </威海卫大厦客房销售记录审批表_C>
                           `;
                }

            } else {
                xml += `
                       <威海卫大厦客房销售记录审批表_C>
                        <RelationRowGuid>${mxlistArr1.length + i + 1}</RelationRowGuid>
                        <RowPrimaryKeys></RowPrimaryKeys>
                        <fentryno>${(i + 1)}</fentryno>
                        <姓名></姓名>
                        <商务房></商务房>
                        <豪华房></豪华房>
                        <行政房></行政房>
                        <商务套房></商务套房>
                        <豪华套房></豪华套房>
                        <销售低价></销售低价>
                        <超额奖励></超额奖励>
                        <总计></总计>
                        <实际发放></实际发放>
                    </威海卫大厦客房销售记录审批表_C>
                       `;
            }

            xml += `  </FormData>
                      </XForm>`;

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
            <威海卫大厦客房销售记录审批表_A>
                <fbillno>${fbillno}</fbillno>
                <申请人>${fname}</申请人>
                <申请部门>${fdept}</申请部门>
                <申请时间>${fdate}</申请时间>
                <销售年度>${fxsnd}</销售年度>
                <销售月度>${fxsyd}</销售月度>
                <总散客房间数>${fzskjs}</总散客房间数>
                <参与提成间数>${fcytcjs}</参与提成间数>
                <房数合计>${f_kf_fs_total}</房数合计>
                <低价收入合计>${f_kf_dj_total}</低价收入合计>
                <实际收入合计>${f_kf_sj_total}</实际收入合计>
                <差额合计>${f_kf_ce_total}</差额合计>
                <平均房价低价合计>${f_kf_pjdj_total}</平均房价低价合计>
                <实际平均房价合计>${f_kf_sjpj_total}</实际平均房价合计>
                <房价差额合计>${f_kf_ce2_total}</房价差额合计>
                <客房销售导入模板>201711030217</客房销售导入模板>
                <商务房合计>${f_yg_swf_total}</商务房合计>
                <豪华房合计>${f_yg_hhf_total}</豪华房合计>
                <行政房合计>${f_yg_xzf_total}</行政房合计>
                <商务套房合计>${f_yg_swtf_total}</商务套房合计>
                <豪华套房合计>${f_yg_hhtf_total}</豪华套房合计>
                <销售低价合计>${f_yg_xsdj_total}</销售低价合计>
                <超额奖励合计>${f_yg_cejl_total}</超额奖励合计>
                <总合计>${f_yg_zj_total}</总合计>
                <实际发放合计>${f_yg_sjff_total}</实际发放合计>
                <员工销售提成导入模板>201711030215</员工销售提成导入模板>
                <附件>${fjArray.join(";")}</附件>
           </威海卫大厦客房销售记录审批表_A>
                  `;
        if (mxlistArr1.length != 0) {
            for (var i = 0; i < mxlistArr1.length; i++) {
                xml += `
                    <威海卫大厦客房销售记录审批表_B>
                        <RelationRowGuid>${(i + 1)}</RelationRowGuid>
                        <RowPrimaryKeys></RowPrimaryKeys>
                        <fentryno>${(i + 1)}</fentryno>
                        <房型>${(mxlistArr1[i].ffj)}</房型>
                        <房数>${(mxlistArr1[i].ffs)}</房数>
                        <底价收入>${(mxlistArr1[i].fdjsr)}</底价收入>
                        <实际收入>${mxlistArr1[i].fsjsr}</实际收入>
                        <差额>${mxlistArr1[i].fce1}</差额>
                        <平均房价底价>${mxlistArr1[i].fpjfjdj}</平均房价底价>
                        <实际平均房价>${mxlistArr1[i].fsjpjfj}</实际平均房价>
                        <房价差额>${mxlistArr1[i].fce2}</房价差额>
                    </威海卫大厦客房销售记录审批表_B>
                           `;
            }
        } else {
            xml += `
                     <威海卫大厦客房销售记录审批表_B>
                        <RelationRowGuid>${(i + 1)}</RelationRowGuid>
                        <RowPrimaryKeys></RowPrimaryKeys>
                        <fentryno>${(i + 1)}</fentryno>
                        <房型></房型>
                        <房数></房数>
                        <底价收入></底价收入>
                        <实际收入></实际收入>
                        <差额></差额>
                        <平均房价底价></平均房价底价>
                        <实际平均房价></实际平均房价>
                        <房价差额></房价差额>
                    </威海卫大厦客房销售记录审批表_B>
                       `;
        }
        if (mxlistArr2.length != 0) {
            for (var i = 0; i < mxlistArr2.length; i++) {
                xml += `
                   <威海卫大厦客房销售记录审批表_C>
                        <RelationRowGuid>${mxlistArr1.length + i + 1}</RelationRowGuid>
                        <RowPrimaryKeys></RowPrimaryKeys>
                        <fentryno>${(i + 1)}</fentryno>
                        <姓名>${mxlistArr2[i].fxm}</姓名>
                        <商务房>${mxlistArr2[i].fswf}</商务房>
                        <豪华房>${mxlistArr2[i].fhhf}</豪华房>
                        <行政房>${mxlistArr2[i].fxzf}</行政房>
                        <商务套房>${mxlistArr2[i].fswtf}</商务套房>
                        <豪华套房>${mxlistArr2[i].fhhtf}</豪华套房>
                        <销售低价>${mxlistArr2[i].fxsdj}</销售低价>
                        <超额奖励>${mxlistArr2[i].fcejl}</超额奖励>
                        <总计>${mxlistArr2[i].fzj}</总计>
                        <实际发放>${mxlistArr2[i].fsjff}</实际发放>
                    </威海卫大厦客房销售记录审批表_C>
                           `;
            }

        } else {
            xml += `
                       <威海卫大厦客房销售记录审批表_C>
                        <RelationRowGuid>${mxlistArr1.length + i + 1}</RelationRowGuid>
                        <RowPrimaryKeys></RowPrimaryKeys>
                        <fentryno>${(i + 1)}</fentryno>
                        <姓名></姓名>
                        <商务房></商务房>
                        <豪华房></豪华房>
                        <行政房></行政房>
                        <商务套房></商务套房>
                        <豪华套房></豪华套房>
                        <销售低价></销售低价>
                        <超额奖励></超额奖励>
                        <总计></总计>
                        <实际发放></实际发放>
                    </威海卫大厦客房销售记录审批表_C>
                       `;
        }

        xml += `  </FormData>
                      </XForm>`;

        PostXml(xml);
    }
}