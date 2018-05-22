function prepMsg() {
    $("#fdate").val(getNowFormatDate(2));
    tapEvent();
    var xml = `<?xml version= "1.0" ?>
                  <Requests>
                      <Params>
                      <Method>GetFormPostData</Method>
                      <ProcessName>集团公司员工入职宿舍、餐卡办理申请</ProcessName>
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

    });
}

function tapEvent() {

}


function initData(data, flag) {
    var item = data.FormDataSet.BPM_WGJTYGLISSQLTB_A[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.fbillno);
    }
    $("#fname").val(item.fname);
    $("#fdate").val(FormatterTimeYMS(item.fdate));
    $("#fssgs").val(item.fssgs);
    $("#fssfgs").val(item.ffgs);
    $("#flxdh").val(item.ftel);
    var item_c = data.FormDataSet.BPM_WGJTYGLISSQLTB_B;
    for (var i = 0; i < item_c.length; i++) {
        itemidArr.push(item_c[i].itemid);
        var li = `
                    <div id="mx" class="mui-card">
                        <div class="mui-input-row itemtitle">
                            <label>明细列表项</label>
                            <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>
                        </div>
                        <div class="mui-row cutOffLine" style="padding:3vw;">
                           <div class="mui-col-xs-3" style="display:flex;">
                               <label>姓名<i style="color:red;">*</i></label>
                               <textarea rows="2" id="fxm" readonly>${item_c[i].fxm}</textarea>  
                           </div>
                           <div class="mui-col-xs-3" style="display:flex;">
                                <label>性别<i style="color:red;">*</i></label>
                                <textarea rows="2" id="fxb" readonly>${item_c[i].fxb}</textarea>  
                           </div>
                           <div class="mui-col-xs-3" style="display:flex;">
                                <label>班组<i style="color:red;">*</i></label>
                                <textarea rows="2" id="fbanzu" readonly>${item_c[i].fbanzu}</textarea>  
                           </div>
                           <div class="mui-col-xs-3" style="display:flex;">
                                <label>身份证号码<i style="color:red;">*</i></label>
                                <textarea rows="2" id="fsfzh" readonly>${item_c[i].fsfzh}</textarea>  
                           </div>
                        </div>
                         <div class="mui-row cutOffLine" style="padding:3vw;">
                             <div class="mui-col-xs-3" style="display:flex;">
                                 <label>离职日期<i style="color:red;">*</i></label>
                                 <textarea rows="2" id="flz_rq" readonly>${FormatterTimeYMS(item_c[i].flz_rq)}</textarea >
                             </div>
                             <div class="mui-col-xs-3" style="display:flex;">
                                 <label>离职方式<i style="color:red;">*</i></label>
                                 <textarea rows="2" id="flz_fs" readonly>${item_c[i].flz_fs}</textarea>
                             </div>
                             <div class="mui-col-xs-3" style="display:flex;">
                                 <label>住宿地点<i style="color:red;">*</i></label>
                                 <textarea rows="2" id="fzsdd" readonly>${item_c[i].fzsdd}</textarea>
                             </div>
                             <div class="mui-col-xs-3" style="display:flex;">
                                 <label>备注</label>
                                 <textarea rows="2" id="fbz" readonly>${item_c[i].fbz}</textarea>
                             </div>
                         </div>
                   </div>
                 `;

        $("#mxlist").append(li);
    }
}

function nodeControllerExp(NodeName) {
    if (String(NodeName).match('开始') != null) {

    } 
}


class Mx {
    constructor(fxm, fxb, fbanzu, fsfzh) {


    }
}