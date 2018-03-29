function prepMsg() {

    tapEvent();
    $("#fdate").val(getNowFormatDate(2));
    var xml = `<?xml version= "1.0" ?>
               <Requests>
               <Params>
               <Method>GetFormPostData</Method>
               <ProcessName>威海卫大厦青缇湾月度销售提成提报</ProcessName>
               <ProcessVersion>${version}</ProcessVersion>
               <Owner></Owner>
               </Params>
               </Requests>
    `;
    dataProvider(xml, function (data) {
        var provideData = JSON.parse(unescape(data.replace(/\\(u[0-9a-fA-F]{4})/gm, '%$1')));
        console.log(provideData);
        var item = provideData.Tables[0].Rows[0];
        $("#fname").val(item.申请人);
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

    var date = new Date();
    var fyeardata = [
        {
            value: '',
            text: date.getFullYear() - 1
        },
        {
            value: '',
            text: date.getFullYear()
        },
        {
            value: '',
            text: date.getFullYear() + 1
        }
    ];
    showPicker('fyear', fyeardata);

    var fmonthdata = [];
    for (var i = 0; i < 12; i++) {
        var obj = {
            value: '',
            text: (i + 1)
        }
        fmonthdata.push(obj);
    }
    showPicker('fmonth', fmonthdata);

    $("#tjmx").on('tap', () => {
        var li = `
           <div id="mx" class="mui-card">
              <div class="mui-input-row itemtitle">
                 <label>明细列表项</label>
                 <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>
              </div>
              <div class="mui-input-row">
                 <label for="fzh">账号<i style="color:red;">*</i></label>
                 <input type="text" id="fzh" name="fzh" placeholder="请填写账号"/> 
              </div>
              <div class="mui-input-row">
                 <label for="fjzrq">结账日期<i style="color:red;">*</i></label>
                 <input type="date" id="fjzrq" name="fjzrq" />
              </div>
              <div class="mui-input-row">
                 <label for="ffh">房号<i style="color:red;">*</i></label>
                <input type="text" id="ffh" name="ffh" placeholder="请填写房号"/>
              </div> 
              <div class="mui-input-row">
                 <label for="fkrxm">客人姓名<i style="color:red;">*</i></label>
                 <input type="text" id="fkrxm" name="fkrxm" placeholder="请填写客人姓名"/>
              </div>
              <div class="mui-input-row">
                  <label for="fxfzj">消费总计<i style="color:red;">*</i></label>
                  <input type="number" id="fxfzj" name="fxfzj" placeholder="请填写消费总计"/> 
              </div>
              <div class="mui-input-row">
                  <label for="fff">房费<i style="color:red;">*</i></label>
                  <input type="number" id="fff" name="fff" placeholder="请填写房费"/>
              </div>
              <div class="mui-input-row">
                  <label for="fcf">餐费<i style="color:red;">*</i></label>
                  <input type="number" id="fcf" name="fcf" placeholder="请填写餐费"/>
              </div>
              <div class="mui-input-row">
                  <label for="fqt">其他<i style="color:red;">*</i></label>
                  <input type="number" id="fqt" name="fqt" placeholder="请填写其他"/>
              </div> 
              <div class="mui-input-row">
                  <label for="ftcje">提成金额<i style="color:red;">*</i></label>
                  <input type="number" id="ftcje" name="ftcje" placeholder="请填写提成金额"/>
              </div> 
            </div>
        `;
        $("#mxlist").append(li);
        $("#mxlist").find('input[type="number"]').each(function (){
            $(this).on('input', () => {
                calcTotal();
            });
        })
    });
}
function calcTotal() {

    var fxfzj_total = 0;
    var fff_total = 0;
    var fcf_total = 0;
    var fqt_total = 0;
    var ftcje_total = 0;
    $("#mxlist").find("#mx").each(function () {
        var fxfzj = parseFloat($(this).find("#fxfzj").val());
        var fff = parseFloat($(this).find("#fff").val());
        var fcf = parseFloat($(this).find("#fcf").val());
        var fqt = parseFloat($(this).find("#fqt").val());
        var ftcje = parseFloat($(this).find("#ftcje").val());
        fxfzj = isNaN(fxfzj) ? 0 : fxfzj;
        fff = isNaN(fff) ? 0 : fff;
        fcf = isNaN(fcf) ? 0 : fcf;
        fqt = isNaN(fqt) ? 0 : fqt;
        ftcje = isNaN(fxfzj) ? 0 : ftcje;
        fxfzj_total += fxfzj;
        fff_total += fff;
        fcf_total += fcf;
        fqt_total += fqt;
        ftcje_total += ftcje;

    });
    $("#fxfzj_total").val(fxfzj_total);
    $("#fff_total").val(fff_total);
    $("#fcf_total").val(fcf_total);
    $("#fqt_total").val(fqt_total);
    $("#ftcje_total").val(ftcje_total);


}

function initData(data, flag) {
    var item = data.FormDataSet.威海卫大厦青缇湾月度销售提成申请表_A[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.fbillno);
    }
    $("#fname").val(item.申请人);
    $("#fdept").val(item.申请部门);
    $("#fdate").val(FormatterTimeYMS(item.申请日期));
    $("#fyear").val(item.年度);
    $("#fmonth").val(item.月份);
    $("#fxfzj_total").val(item.消费总计合计);
    $("#fff_total").val(item.房费合计);
    $("#fcf_total").val(item.餐费合计);
    $("#fqt_total").val(item.其它合计);
    $("#ftcje_total").val(item.提成合计);

    var item_c = data.FormDataSet.威海卫大厦青缇湾月度销售提成申请表_B;
    for (var i = 0; i < item_c.length; i++) {
        itemidArr.push(item_c[i].itemid);
        var li = `
           <div id="mx" class="mui-card">
              <div class="mui-input-row itemtitle">
                 <label>明细列表项</label>
                 <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>
              </div>
              <div class="mui-input-row">
                 <label for="fzh">账号<i style="color:red;">*</i></label>
                 <input type="text" id="fzh" name="fzh" readonly value="${item_c[i].帐号}"/> 
              </div>
              <div class="mui-input-row">
                 <label for="fjzrq">结账日期<i style="color:red;">*</i></label>
                 <input type="date" id="fjzrq" name="fjzrq" readonly value="${FormatterTimeYMS(item_c[i].结帐日期)}"/>
              </div>
              <div class="mui-input-row">
                 <label for="ffh">房号<i style="color:red;">*</i></label>
                <input type="text" id="ffh" name="ffh" readonly value="${item_c[i].房号}"/>
              </div> 
              <div class="mui-input-row">
                 <label for="fkrxm">客人姓名<i style="color:red;">*</i></label>
                 <input type="text" id="fkrxm" name="fkrxm" readonly value="${item_c[i].客人姓名}"/>
              </div>
              <div class="mui-input-row">
                  <label for="fxfzj">消费总计<i style="color:red;">*</i></label>
                  <input type="number" id="fxfzj" name="fxfzj" readonly value="${item_c[i].消费总计}"/> 
              </div>
              <div class="mui-input-row">
                  <label for="fff">房费<i style="color:red;">*</i></label>
                  <input type="number" id="fff" name="fff" readonly value="${item_c[i].房费}"/>
              </div>
              <div class="mui-input-row">
                  <label for="fcf">餐费<i style="color:red;">*</i></label>
                  <input type="number" id="fcf" name="fcf" readonly value="${item_c[i].餐费}"/>
              </div>
              <div class="mui-input-row">
                  <label for="fqt">其他<i style="color:red;">*</i></label>
                  <input type="number" id="fqt" name="fqt" readonly value="${item_c[i].其他}"/>
              </div> 
              <div class="mui-input-row">
                  <label for="ftcje">提成金额<i style="color:red;">*</i></label>
                  <input type="number" id="ftcje" name="ftcje" readonly value="${item_c[i].提成金额}"/>
              </div> 
            </div>
        `;
        $("#mxlist").append(li);

    }


}
class Mx {
    constructor(fzh, fjzrq, ffh, fkrxm, fxfzj, fff, fcf, fqt, ftcje) {
        this.fzh = fzh;
        this.fjzrq = fjzrq;
        this.ffh = ffh;
        this.fkrxm = fkrxm;
        this.fxfzj = fxfzj;
        this.fff = fff;
        this.fcf = fcf;
        this.fqt = fqt;
        this.ftcje = ftcje;

    }
    check() {
        if (!this.fzh) {
            mui.toast('请填写账号');
            return false;
        }
        if (!this.fjzrq) {
            mui.toast('请填写结账日期');
            return false;
        }
        if (!this.ffh) {
            mui.toast('请填写房号');
            return false;
        }
        if (!this.fkrxm) {
            mui.toast('请填写客人姓名');
            return false;
        }
        if (!this.fxfzj) {
            mui.toast('请填写消费总计');
            return false;
        }
        if (!this.fff) {
            mui.toast('请填写房费');
            return false;
        }
        if (!this.fcf) {
            mui.toast('请填写餐费');
            return false;
        }
        if (!this.fqt) {
            mui.toast('请填写其他');
            return false;
        }
        if (!this.ftcje) {
            mui.toast('请填写提成金额');
            return false;
        }
        return true;
    }
}


function nodeControllerExp(NodeName) {
    if (String(NodeName).match('开始') != null) {
        tapEvent();
        $("#mxlist").find('span').each(function () {
            $(this).show();
        });
        $("#mxlist").find("input").each(function () {
            $(this).removeAttr('readonly');
            
        });
        $("#mxlist").find('input[type="number"]').each(function () {
            $(this).on('input', () => {
                calcTotal();
            });
        });
        $('#tjmx').show();
    }
}

function Save() {
    var fname = $("#fname").val();
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();
    var fyear = $("#fyear").val();
    var fmonth = $("#fmonth").val();
    var fxfzj_total = $("#fxfzj_total").val();
    var fff_total = $("#fff_total").val();
    var fcf_total = $("#fcf_total").val();
    var fqt_total = $("#fqt_total").val();
    var ftcje_total = $("#ftcje_total").val();

    var mxflag = false;
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fzh = $(this).find("#fzh").val();
        var fjzrq = $(this).find("#fjzrq").val();
        var fkrxm = $(this).find("#fkrxm").val();
        var ffh = $(this).find("#ffh").val();
        var fxfzj = $(this).find("#fxfzj").val();
        var fff = $(this).find("#fff").val();
        var fcf = $(this).find("#fcf").val();
        var fqt = $(this).find("#fqt").val();
        var ftcje = $(this).find("#ftcje").val();

        var mx = new Mx(fzh, fjzrq, ffh, fkrxm, fxfzj, fff, fcf, fqt, ftcje);
        if (!mx.check()) {
            mxflag = false;
            return;
        }
        mxlistArr.push(mx);

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
                      <ProcessName>威海卫大厦青缇湾月度销售提成提报</ProcessName>
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
                    <威海卫大厦青缇湾月度销售提成申请表_A>
                    <fbillino>自动带出</fbillino>
                    <TaskID></TaskID>
                    <申请人>${fname}</申请人>
                    <申请部门>${fdept}</申请部门>
                    <申请日期>${fdate}</申请日期>
                    <年度>${fyear}</年度>
                    <月份>${fmonth}</月份>
                    <消费总计合计>${fxfzj_total}</消费总计合计>
                    <房费合计>${fff_total}</房费合计>
                    <餐费合计>${fcf_total}</餐费合计>
                    <其它合计>${fqt_total}</其它合计>
                    <提成合计>${ftcje_total}</提成合计>
                    <导入模板>201709020368</导入模板>
                    </威海卫大厦青缇湾月度销售提成申请表_A>
              `;
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `
                    <威海卫大厦青缇湾月度销售提成申请表_B>
                    <RelationRowGuid>${(i+1)}</RelationRowGuid>
                    <RowPrimaryKeys></RowPrimaryKeys>
                    <fentyrno>${(i + 1)}</fentyrno>
                    <帐号>${mxlistArr[i].fzh}</帐号>
                    <结帐日期>${mxlistArr[i].fjzrq}</结帐日期>
                    <房号>${mxlistArr[i].ffh}</房号>
                    <客人姓名>${mxlistArr[i].fkrxm}</客人姓名>
                    <消费总计>${mxlistArr[i].fxfzj}</消费总计>
                    <房费>${mxlistArr[i].fff}</房费>
                    <餐费>${mxlistArr[i].fcf}</餐费>
                    <其他>${mxlistArr[i].fqt}</其他>
                    <提成金额>${mxlistArr[i].ftcje}</提成金额>
                    </威海卫大厦青缇湾月度销售提成申请表_B>
                       `;
            }

            xml += `  </FormData>
                      </XForm>`;

            PostXml(xml);

        }
    });
}
function reSave() {
    var tid = $("#taskId").val();
    var pid = $("#stepId").val();
    var fbillno = $("#fbillno").val();
    var fname = $("#fname").val();
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();
    var fyear = $("#fyear").val();
    var fmonth = $("#fmonth").val();
    var fxfzj_total = $("#fxfzj_total").val();
    var fff_total = $("#fff_total").val();
    var fcf_total = $("#fcf_total").val();
    var fqt_total = $("#fqt_total").val();
    var ftcje_total = $("#ftcje_total").val();

    var mxflag = false;
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fzh = $(this).find("#fzh").val();
        var fjzrq = $(this).find("#fjzrq").val();
        var ffh = $(this).find("#ffh").val();
        var fkrxm = $(this).find("#fkrxm").val();
        var fxfzj = $(this).find("#fxfzj").val();
        var fff = $(this).find("#fff").val();
        var fcf = $(this).find("#fcf").val();
        var fqt = $(this).find("#fqt").val();
        var ftcje = $(this).find("#ftcje").val();

        var mx = new Mx(fzh, fjzrq, ffh, fkrxm, fxfzj, fff, fcf, fqt, ftcje);
        if (!mx.check()) {
            mxflag = false;
            return;
        }
        mxlistArr.push(mx);

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
                    <威海卫大厦青缇湾月度销售提成申请表_A>
                    <fbillino>${fbillno}</fbillino>
                    <TaskID>${tid}</TaskID>
                    <申请人>${fname}</申请人>
                    <申请部门>${fdept}</申请部门>
                    <申请日期>${fdate}</申请日期>
                    <年度>${fyear}</年度>
                    <月份>${fmonth}</月份>
                    <消费总计合计>${fxfzj_total}</消费总计合计>
                    <房费合计>${fff_total}</房费合计>
                    <餐费合计>${fcf_total}</餐费合计>
                    <其它合计>${fqt_total}</其它合计>
                    <提成合计>${ftcje_total}</提成合计>
                    <导入模板>201709020368</导入模板>
                    </威海卫大厦青缇湾月度销售提成申请表_A>
              `;
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `
                    <威海卫大厦青缇湾月度销售提成申请表_B>
                    <RelationRowGuid>${(i + 1)}</RelationRowGuid>
                    <RowPrimaryKeys></RowPrimaryKeys>
                    <fentyrno>${(i + 1)}</fentyrno>
                    <帐号>${mxlistArr[i].fzh}</帐号>
                    <结帐日期>${mxlistArr[i].fjzrq}</结帐日期>
                    <房号>${mxlistArr[i].ffh}</房号>
                    <客人姓名>${mxlistArr[i].fkrxm}</客人姓名>
                    <消费总计>${mxlistArr[i].fxfzj}</消费总计>
                    <房费>${mxlistArr[i].fff}</房费>
                    <餐费>${mxlistArr[i].fcf}</餐费>
                    <其他>${mxlistArr[i].fqt}</其他>
                    <提成金额>${mxlistArr[i].ftcje}</提成金额>
                    </威海卫大厦青缇湾月度销售提成申请表_B>
                       `;
            }

            xml += `  </FormData>
                      </XForm>`;

            PostXml(xml);
             
        }
    });

}
function hasRead() {
    var tid = $("#taskId").val();
    var pid = $("#stepId").val();
    var fbillno = $("#fbillno").val();

    var fname = $("#fname").val();
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();
    var fyear = $("#fyear").val();
    var fmonth = $("#fmonth").val();
    var fxfzj_total = $("#fxfzj_total").val();
    var fff_total = $("#fff_total").val();
    var fcf_total = $("#fcf_total").val();
    var fqt_total = $("#fqt_total").val();
    var ftcje_total = $("#ftcje_total").val();

    var mxflag = false;
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fzh = $(this).find("#fzh").val();
        var fjzrq = $(this).find("#fjzrq").val();
        var ffh = $(this).find("#ffh").val();
        var fkrxm = $(this).find("#fkrxm").val();
        var fxfzj = $(this).find("#fxfzj").val();
        var fff = $(this).find("#fff").val();
        var fcf = $(this).find("#fcf").val();
        var fqt = $(this).find("#fqt").val();
        var ftcje = $(this).find("#ftcje").val();

        var mx = new Mx(fzh, fjzrq, ffh, fkrxm, fxfzj, fff, fcf, fqt, ftcje);
      
        mxlistArr.push(mx);

    });
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
                        <FormData>`;
            xml += `
                    <威海卫大厦青缇湾月度销售提成申请表_A>
                    <fbillino>${fbillno}</fbillino>
                    <TaskID>${tid}</TaskID>
                    <申请人>${fname}</申请人>
                    <申请部门>${fdept}</申请部门>
                    <申请日期>${fdate}</申请日期>
                    <年度>${fyear}</年度>
                    <月份>${fmonth}</月份>
                    <消费总计合计>${fxfzj_total}</消费总计合计>
                    <房费合计>${fff_total}</房费合计>
                    <餐费合计>${fcf_total}</餐费合计>
                    <其它合计>${fqt_total}</其它合计>
                    <提成合计>${ftcje_total}</提成合计>
                    <导入模板>201709020368</导入模板>
                    </威海卫大厦青缇湾月度销售提成申请表_A>
              `;
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `
                    <威海卫大厦青缇湾月度销售提成申请表_B>
                    <RelationRowGuid>${(i + 1)}</RelationRowGuid>
                    <RowPrimaryKeys>itemid=${itemidArr[i]}</RowPrimaryKeys>
                    <fentyrno>${(i + 1)}</fentyrno>
                    <帐号>${mxlistArr[i].fzh}</帐号>
                    <结帐日期>${mxlistArr[i].fjzrq}</结帐日期>
                    <房号>${mxlistArr[i].ffh}</房号>
                    <客人姓名>${mxlistArr[i].fkrxm}</客人姓名>
                    <消费总计>${mxlistArr[i].fxfzj}</消费总计>
                    <房费>${mxlistArr[i].fff}</房费>
                    <餐费>${mxlistArr[i].fcf}</餐费>
                    <其他>${mxlistArr[i].fqt}</其他>
                    <提成金额>${mxlistArr[i].ftcje}</提成金额>
                    </威海卫大厦青缇湾月度销售提成申请表_B>
                       `;
            }

            xml += `  </FormData>
                      </XForm>`;

            PostXml(xml);
        }
    });
}
function AgreeOrConSign() {
    var tid = $("#taskId").val();
    var pid = $("#stepId").val();
    var fbillno = $("#fbillno").val();
    var comment = $("#signSuggest").val();

    var fname = $("#fname").val();
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();
    var fyear = $("#fyear").val();
    var fmonth = $("#fmonth").val();
    var fxfzj_total = $("#fxfzj_total").val();
    var fff_total = $("#fff_total").val();
    var fcf_total = $("#fcf_total").val();
    var fqt_total = $("#fqt_total").val();
    var ftcje_total = $("#ftcje_total").val();

    var mxflag = false;
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fzh = $(this).find("#fzh").val();
        var fjzrq = $(this).find("#fjzrq").val();
        var ffh = $(this).find("#ffh").val();
        var fkrxm = $(this).find("#fkrxm").val();
        var fxfzj = $(this).find("#fxfzj").val();
        var fff = $(this).find("#fff").val();
        var fcf = $(this).find("#fcf").val();
        var fqt = $(this).find("#fqt").val();
        var ftcje = $(this).find("#ftcje").val();

        var mx = new Mx(fzh, fjzrq, ffh, fkrxm, fxfzj, fff, fcf, fqt, ftcje);

        mxlistArr.push(mx);

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
                    <威海卫大厦青缇湾月度销售提成申请表_A>
                    <fbillino>${fbillno}</fbillino>
                    <TaskID>${tid}</TaskID>
                    <申请人>${fname}</申请人>
                    <申请部门>${fdept}</申请部门>
                    <申请日期>${fdate}</申请日期>
                    <年度>${fyear}</年度>
                    <月份>${fmonth}</月份>
                    <消费总计合计>${fxfzj_total}</消费总计合计>
                    <房费合计>${fff_total}</房费合计>
                    <餐费合计>${fcf_total}</餐费合计>
                    <其它合计>${fqt_total}</其它合计>
                    <提成合计>${ftcje_total}</提成合计>
                    <导入模板>201709020368</导入模板>
                    </威海卫大厦青缇湾月度销售提成申请表_A>
              `;
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `
                    <威海卫大厦青缇湾月度销售提成申请表_B>
                    <RelationRowGuid>${(i + 1)}</RelationRowGuid>
                    <RowPrimaryKeys>itemid=${itemidArr[i]}</RowPrimaryKeys>
                    <fentyrno>${(i + 1)}</fentyrno>
                    <帐号>${mxlistArr[i].fzh}</帐号>
                    <结帐日期>${mxlistArr[i].fjzrq}</结帐日期>
                    <房号>${mxlistArr[i].ffh}</房号>
                    <客人姓名>${mxlistArr[i].fkrxm}</客人姓名>
                    <消费总计>${mxlistArr[i].fxfzj}</消费总计>
                    <房费>${mxlistArr[i].fff}</房费>
                    <餐费>${mxlistArr[i].fcf}</餐费>
                    <其他>${mxlistArr[i].fqt}</其他>
                    <提成金额>${mxlistArr[i].ftcje}</提成金额>
                    </威海卫大厦青缇湾月度销售提成申请表_B>
                       `;
            }

            xml += `  </FormData>
                      </XForm>`;

            PostXml(xml);
        });
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
                    <威海卫大厦青缇湾月度销售提成申请表_A>
                    <fbillino>${fbillno}</fbillino>
                    <TaskID>${tid}</TaskID>
                    <申请人>${fname}</申请人>
                    <申请部门>${fdept}</申请部门>
                    <申请日期>${fdate}</申请日期>
                    <年度>${fyear}</年度>
                    <月份>${fmonth}</月份>
                    <消费总计合计>${fxfzj_total}</消费总计合计>
                    <房费合计>${fff_total}</房费合计>
                    <餐费合计>${fcf_total}</餐费合计>
                    <其它合计>${fqt_total}</其它合计>
                    <提成合计>${ftcje_total}</提成合计>
                    <导入模板>201709020368</导入模板>
                    </威海卫大厦青缇湾月度销售提成申请表_A>
              `;
        for (var i = 0; i < mxlistArr.length; i++) {
            xml += `
                    <威海卫大厦青缇湾月度销售提成申请表_B>
                    <RelationRowGuid>${(i + 1)}</RelationRowGuid>
                    <RowPrimaryKeys>itemid=${itemidArr[i]}</RowPrimaryKeys>
                    <fentyrno>${(i + 1)}</fentyrno>
                    <帐号>${mxlistArr[i].fzh}</帐号>
                    <结帐日期>${mxlistArr[i].fjzrq}</结帐日期>
                    <房号>${mxlistArr[i].ffh}</房号>
                    <客人姓名>${mxlistArr[i].fkrxm}</客人姓名>
                    <消费总计>${mxlistArr[i].fxfzj}</消费总计>
                    <房费>${mxlistArr[i].fff}</房费>
                    <餐费>${mxlistArr[i].fcf}</餐费>
                    <其他>${mxlistArr[i].fqt}</其他>
                    <提成金额>${mxlistArr[i].ftcje}</提成金额>
                    </威海卫大厦青缇湾月度销售提成申请表_B>
                       `;
        }

        xml += `  </FormData>
                      </XForm>`;

        PostXml(xml);
    }
}