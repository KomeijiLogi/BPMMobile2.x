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
}