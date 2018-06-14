function prepMsg() {

    $("#fdate").val(getNowFormatDate(2));
    tapEvent();
    var xml = `<?xml version= "1.0" ?>
                  <Requests>
                      <Params>
                      <Method>GetFormPostData</Method>
                      <ProcessName>集团公司员工班车租赁申请</ProcessName>
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
        $("#fssjt").val(item.fssjt);
        $("#fssgs").val(item.fssgs);

    }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
        if (XMLHttpRequest.status == "401") {
            mui.alert('授权过期，请重新打开页面');;
        } else if (XMLHttpRequest.status == "500") {
            mui.alert('服务器内部错误');
        }

    });

}

function tapEvent() {

    var ffkfsdata = [
        {
            value: '',
            text:'现金'
        },
        {
            value: '',
            text:'记账'
        }
    ];
    showPicker('ffkfs', ffkfsdata);
   

    $("#tjmx").on('tap', () => {
        var openidArr = [];
        var accountArr = [];
        //调用XuntongJSBridge
        XuntongJSBridge.call('selectPerson', {'pType':'1'}, function (result) {

            if (typeof (result) == 'string') {
                result = JSON.parse(result);
            }
            var data = result.data;
            if (result.success == true || result.success == "true") {

                for (var i = 0; i < data.persons.length; i++) {
                    openidArr.push(data.persons[i].openId);
                }
               var requestAccount=  $.ajax({
                    type: "POST",
                    url: "/api/bpm/PostAccount",
                    data: { "ids": openidArr },
                    beforeSend: function (XHR) {
                        XHR.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem('ticket'));

                    }
                }).done((data) => {
                   
                    
                    for (var i = 0; i < data.data.length; i++) {
                        accountArr.push(data.data[i].phone);
                    }
                    console.log(accountArr);

                }).fail((e) => {

                    });

               requestAccount.then(data => {
                   console.log(data);
                   var xml = `<?xml version= "1.0" ?>
                                 <Requests>
                                  <Params>
                                   <DataSource>PS</DataSource>
                                   <ID>erpcloud_公用_获取个人信息</ID>
                                   <Type>1</Type>
                                    <Method>GetUserDataProcedure</Method>
                                    <ProcedureName>erpcloud_公用_获取个人信息</ProcedureName>
                                    <Filter> <fno>${accountArr[accountArr.length - 1]}</fno></Filter>
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
                   }).done( (data)=> {




                       var provideData = JSON.parse(unescape(data.replace(/\\(u[0-9a-fA-F]{4})/gm, '%$1')));
                       //console.log(provideData);
                       var personInfoObject = provideData.Tables[0].Rows[0];
                       var personObject = ({
                           name: personInfoObject.NAME,             //姓名
                           account: personInfoObject.EMPLID,        //工号
                           descript: personInfoObject.DEPT_DESCR,   //所在组织简约描述                          
                           fdeptname: personInfoObject.fdeptname,     //所属部门
                           fgslj: personInfoObject.fgslj,             //所属部门详细路径
                           fsscompany: personInfoObject.fsscompany,   //所属公司
                           fssgroup: personInfoObject.fssgroup,       //所属组织
                         
                             
                       });
                       console.log(personObject);
                       proDom(personObject);
                       
                     
                    }).fail( (e)=> {

                    })

               });
            }

        });

    });
}


function proDom(pData) {
    var li = `
               <div id="mx" class="mui-card">
                    <div class="mui-input-row itemtitle">
                        <label>明细列表项</label>
                        <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>
                    </div>
                    <div class="mui-row cutOffLine">
                        <div class="mui-col-xs-3" style="display:flex;height:auto;">
                            <label>申请人<i style="color:red;">*</i></label>
                            <textarea id="fsqr" readonly rows="2">${pData.name}</textarea>
                        </div>
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>手机号码<i style="color:red;">*</i></label>
                            <input type="tel" id="ftel" placeholder="待填" /> 
                        </div> 
                        <div class="mui-col-xs-3" style="display:flex;height:auto;">
                            <label>所属公司<i style="color:red;">*</i></label>
                            <textarea id="fssgs" readonly  rows="2">${pData.fsscompany}</textarea>
                        </div> 
                        <div class="mui-col-xs-3" style="display:flex;height:auto;">
                            <label>所属部门<i style="color:red;">*</i></label>
                            <textarea  id="fssbm" readonly  rows="2">${pData.fdeptname}</textarea>  
                         </div>
                    </div>
                    <div class="mui-row cutOffLine">
                         <div class="mui-col-xs-3" style="display:flex;height:auto;">
                             <labe>乘车人数<i style="color:red;">*</i></label>  
                             <input type="number" id="fccrs" placeholder="待填"/>
                         </div>
                         <div class="mui-col-xs-3" style="display:flex;height:auto;">
                            <label>乘车线路</label>
                            <textarea id="fccxl" placeholder="待填" rows="2"></textarea>
                         </div>  
                          <div class="mui-col-xs-3" style="display:flex;height:auto;">
                             <label>租赁公司<i style="color:red;">*</i></label>
                             <textarea id="fzlgs" readonly rows="2"></textarea>
                          </div>
                          <div class="mui-col-xs-3"  style="display:flex;height:auto;">
                              <label>租赁电话<i style="color:red;">*</i></label>
                              <textarea  id="fzldh" readonly rows="2"></textarea>
                          </div>
                    </div>
                    <div class="mui-row cutOffLine">
                         <div class="mui-col-xs-6" >
                             <label>用车开始<i style="color:red;">*</i></label>
                             <input type="datetime-local" id="ycfdate" />  
                         </div>
                         <div class="mui-col-xs-6" >
                             <label>用车结束<i style="color:red;">*</i></label>
                             <input type="datetime-local" id="fychdate" /> 
                         </div>
                    </div>
                    <div class="mui-row cutOffLine">
                          <div class="mui-col-xs-4" style="display:flex;">
                             <label>数量<i style="color:red;">*</i></label>
                             <input type="number" id="fycsl" readonly/> 
                          </div>
                          <div class="mui-col-xs-4" style="display:flex;">
                             <label>单价<i style="color:red;">*</i></label>
                             <input type="number" id="fdj" readonly />
                          </div>
                          <div class="mui-col-xs-4" style="display:flex;">
                              <label>金额<i style="color:red;">*</i></label> 
                              <input type="number" id="fje" readonly value="0"/> 
                          </div> 
                    </div> 
                     <div class="mui-row cutOffLine">
                          <div class="mui-col-xs-12" style="display:flex;height:auto;"> 
                              <label>用车事由<i style="color:red;">*</i></label>
                              <textarea rows="2" id="fycsy" placeholder="待填"></textarea> 
                          </div>
                     </div> 
               </div>  
              `;
    $("#mxlist").append(li);

}

function tapEventByCar() {
    $("#mxlist").find("#fycsl,#fdj").each(function () {
        $(this).on('input', function () {
            calcPrice(this);
        });
    });
    var fzlgsdata = [
        {
            value: '',
            text:'城郊'
        },
        {
            value: '',
            text:'公交'
        },
        {
            value: '',
            text:'旅游'
        }
    ];

    showPicker('fzlgs', fzlgsdata);
    var fzldhdata = [
        {
            value: '',
            text:'城郊13869077570'
        },
        {
            value: '',
            text:'公交13792762339'
        },
        {
            value: '',
            text:'旅游13906304678'
        }
    ];

    showPicker('fzldh', fzldhdata);
}

function initData(data, flag) {

    var item = data.FormDataSet.BPM_WGJTYGBCZLSQ_A[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.fbillno);
    }

    $("#fname").val(item.fname);
    $("#fdate").val(FormatterTimeYMS(item.fdate));
    $("#fssjt").val(item.fssjt);
    $("#fssgs").val(item.fssgs);
    $("#ftel").val(item.ftel);
    $("#ffkfs").val(item.ffkfs);

    $("#fhj_ccrs").val(item.fhj_ccrs);
    $("#fhj_ycsl").val(item.fhj_ycsl);
    $("#fhjje").val(item.fhjje);

    var item_c = data.FormDataSet.BPM_WGJTYGBCZLSQ_B;
    for (var i = 0; i < item_c.length; i++) {
        itemidArr.push(item_c[i].itemid);
        var li = `
               <div id="mx" class="mui-card">
                    <div class="mui-input-row itemtitle">
                        <label>明细列表项</label>
                        <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>
                    </div>
                    <div class="mui-row cutOffLine">
                        <div class="mui-col-xs-3" style="display:flex;height:auto;">
                            <label>申请人<i style="color:red;">*</i></label>
                            <textarea id="fsqr" readonly rows="2">${item_c[i].fsqr}</textarea>
                        </div>
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>手机号码<i style="color:red;">*</i></label>
                            <input type="tel" id="ftel" readonly value="${item_c[i].ftel}"/> 
                        </div> 
                        <div class="mui-col-xs-3" style="display:flex;height:auto;">
                            <label>所属公司<i style="color:red;">*</i></label>
                            <textarea id="fssgs" readonly  rows="2">${item_c[i].fssgs}</textarea>
                        </div> 
                        <div class="mui-col-xs-3" style="display:flex;height:auto;">
                            <label>所属部门<i style="color:red;">*</i></label>
                            <textarea  id="fssbm" readonly  rows="2">${item_c[i].fssbm}</textarea>  
                         </div>
                    </div>
                    <div class="mui-row cutOffLine">
                         <div class="mui-col-xs-3" style="display:flex;height:auto;">
                             <labe>乘车人数<i style="color:red;">*</i></label>  
                             <input type="number" id="fccrs" readonly value="${item_c[i].fccrs}"/>
                         </div>
                         <div class="mui-col-xs-3" style="display:flex;height:auto;">
                            <label>乘车线路</label>
                            <textarea id="fccxl" readonly rows="2">${item_c[i].fccxl}</textarea>
                         </div>  
                          <div class="mui-col-xs-3" style="display:flex;height:auto;">
                             <label>租赁公司<i style="color:red;">*</i></label>
                             <textarea id="fzlgs" readonly rows="2">${changeNullToEmpty(item_c[i].fzlgs)}</textarea>
                          </div>
                          <div class="mui-col-xs-3"  style="display:flex;height:auto;">
                              <label>租赁电话<i style="color:red;">*</i></label>
                              <textarea  id="fzldh" readonly rows="2">${changeNullToEmpty(item_c[i].fzldh)}</textarea>
                          </div>
                    </div>
                    <div class="mui-row cutOffLine">
                         <div class="mui-col-xs-6" >
                             <label>用车开始<i style="color:red;">*</i></label>
                             <input type="datetime-local" id="ycfdate" readonly value="${item_c[i].ycfdate}"/>  
                         </div>
                         <div class="mui-col-xs-6" >
                             <label>用车结束<i style="color:red;">*</i></label>
                             <input type="datetime-local" id="fychdate" readonly value="${item_c[i].fychdate}"/> 
                         </div>
                    </div>
                    <div class="mui-row cutOffLine">
                          <div class="mui-col-xs-4" style="display:flex;">
                             <label>数量<i style="color:red;">*</i></label>
                             <input type="number" id="fycsl" readonly  value="${item_c[i].fycsl}" placeholder="待填"/> 
                          </div>
                          <div class="mui-col-xs-4" style="display:flex;">
                             <label>单价<i style="color:red;">*</i></label>
                             <input type="number" id="fdj" readonly  value="${item_c[i].fdj}" placeholder="待填"/>
                          </div>
                          <div class="mui-col-xs-4" style="display:flex;">
                              <label>金额<i style="color:red;">*</i></label> 
                              <input type="number" id="fje" readonly value="${item_c[i].fje}"/> 
                          </div> 
                    </div> 
                     <div class="mui-row cutOffLine">
                          <div class="mui-col-xs-12" style="display:flex;height:auto;"> 
                              <label>用车事由<i style="color:red;">*</i></label>
                              <textarea rows="2" id="fycsy" readonly>${item_c[i].fycsy}</textarea> 
                          </div>
                     </div> 
               </div>  
              `;
        $("#mxlist").append(li);

    }

}
function calcPrice(context) {
    var fycsl = parseFloat($(context).parent().parent().find("#fycsl").val());
    var fdj = parseFloat($(context).parent().parent().find("#fdj").val());
    var fje = 0;

    fycsl = isNaN(fycsl) ? 0 : fycsl;
    fdj = isNaN(fdj) ? 0 : fdj;
    fje = fycsl * fdj;
    $(context).parent().parent().find("#fje").val(fje);
    calcTotal();
}

function calcTotal() {
    var fhj_ccrs = 0;
    var fhj_ycsl = 0;
    var fhjje = 0;
    $("#mxlist").find("#mx").each(function () {
        var fccrs = parseFloat($(this).find("#fccrs").val());
        var fycsl = parseFloat($(this).find("#fycsl").val());
        var fje = parseFloat($(this).find("#fje").val());
        fhj_ccrs += fccrs;
        fhj_ycsl += fycsl;
        fhjje += fje;

    });
    $("#fhj_ccrs").val(fhj_ccrs);
    $("#fhj_ycsl").val(fhj_ycsl);
    $("#fhjje").val(fhjje);
}

function nodeControllerExp(NodeName) {
    if (String(NodeName).match('开始') != null) {
        $("#mxlist").find('span').each(function () {
            $(this).show();
        });
        $("#mxlist").find('#fsqr,#ftel,#fssgs,#fssbm,#fccrs,#fccxl,#ycfdate,#fychdate,#fycsy').each(function () {
            $(this).removeAttr('readonly');
        });
        tapEvent();
        $("#ftel").removeAttr('readonly');
    } else if (String(NodeName).match('班车管理员审核') != null) {

        $("#mxlist").find("#fycsl,#fdj").each(function () {
            $(this).removeAttr('readonly');
        });


        tapEventByCar();
    }
}


class Mx {
    constructor(fsqr, ftel, fssgs, fssbm, fccrs, fccxl, ycfdate, fychdate, fycsl, fdj, fje, fzlgs, fzldh, fycsy,nodeName) {
        this.fsqr = fsqr;
        this.ftel = ftel;
        this.fssgs = fssgs;
        this.fssbm = fssbm;
        this.fccrs = fccrs;
        this.fccxl = fccxl;
        this.ycfdate = ycfdate;
        this.fychdate = fychdate;
        this.fycsl = fycsl;
        this.fdj = fdj;
        this.fje = fje;
        this.fzlgs = fzlgs;
        this.fzldh = fzldh;
        this.fycsy = fycsy;
        this.nodeName = nodeName;

    }
    check() {
        if (!this.fsqr) {
            mui.toast('请选择申请人');
            return true;
        }
        if (!this.ftel) {
            mui.toast('请填写手机号码');
            return true;
        }
        if (!this.fccrs) {
            mui.toast('请填写乘车人数');
            return true;
        }
        if (!this.fccxl) {
            mui.toast('请填写乘车路线');
            return true;
        }
        if (!this.ycfdate) {
            mui.toast('请填写用车开始时间');
            return true;
        }
        if (!this.fychdate) {
            mui.toast('请填写用车结束时间');
            return true;
        }
        if (!this.fycsy) {
            mui.toast('请填写用车事由');
            return true;
        }
        if (String(this.nodeName).match('班车管理员审核') != null) {

            if (!this.fycsl) {
                mui.toast('请填写数量');
                return true;
            }
            if (!this.fdj) {
                mui.toast('请填写单价');
                return true;
            }
            if (!this.fzlgs) {
                mui.toast('请选择租赁公司');
                return true;
            }
            if (!this.fzldh) {
                mui.toast('请选择租赁电话');
                return true;
            }
        }
        return false;
    }
}

function Save() {

    var fname = $("#fname").val();
    var fdate = $("#fdate").val();
    var fssjt = $("#fssjt").val();
    var fssgs = $("#fssgs").val();
    var ftel = $("#ftel").val();
    var ffkfs = $("#ffkfs").val();

    var fhj_ccrs = $("#fhj_ccrs").val();
    var fhj_ycsl = $("#fhj_ycsl").val();
    var fhjje = $("#fhjje").val();

    if (!ftel) {
        mui.toast('请填写联系电话');
        return;
    }
    if (!ffkfs) {
        mui.toast('请选择付款方式');
        return;
    }


    var mxlistArr = [];
    var mxflag = false;
    $("#mxlist").find("#mx").each(function () {
        var fsqr = $(this).find("#fsqr").val();
        var ftel = $(this).find("#ftel").val();
        var fssgs = $(this).find("#fssgs").val();
        var fssbm = $(this).find("#fssbm").val();
        var fccrs = $(this).find("#fccrs").val();
        var fccxl = $(this).find("#fccxl").val();
        var ycfdate = $(this).find("#ycfdate").val();
        var fychdate = $(this).find("#fychdate").val();
        var fycsl = $(this).find("#fycsl").val();
        var fdj = $(this).find("#fdj").val();
        var fje = $(this).find("#fje").val();
        var fzlgs = $(this).find("#fzlgs").val();
        var fzldh = $(this).find("#fzldh").val();
        var fycsy = $(this).find("#fycsy").val();
        var mx = new Mx(fsqr, ftel, fssgs, fssbm, fccrs, fccxl, ycfdate, fychdate, fycsl, fdj, fje, fzlgs, fzldh, fycsy, null);
        if (mx.check()) {
            mxflag = true;
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
                                <Method>Post</Method>
                                <ProcessName>集团公司员工班车租赁申请</ProcessName>
                                <ProcessVersion>${version}</ProcessVersion>
                                <DraftGuid></DraftGuid>
                                <OwnerMemberFullName>${BPMOU}</OwnerMemberFullName>
                                <Action>提交</Action>
                                <Comment></Comment>
                                <UrlParams></UrlParams>
                                <ConsignEnabled>false</ConsignEnabled>
                                <ConsignUsers>[]</ConsignUsers>
                                <ConsignRoutingType>Parallel</ConsignRoutingType>
                                <ConsignReturnType>Return</ConsignReturnType>
                                <InviteIndicateUsers>[]</InviteIndicateUsers>
                                <Context>{&quot;Routing&quot;:{}}</Context>
                            </Header>
                           <FormData>
                           `;
            xml += `
                     <BPM_WGJTYGBCZLSQ_A>
                        <fbillno>自动生成</fbillno>
                        <fname>${fname}</fname>
                        <fdate>${fdate}</fdate>
                        <fssjt>${fssjt}</fssjt>
                        <fssgs>${fssgs}</fssgs>
                        <ftel>${ftel}</ftel>
                        <ffkfs>${ffkfs}</ffkfs>
                        <fhj_ccrs>${fhj_ccrs}</fhj_ccrs>
                        <fhj_ycsl>${fhj_ycsl}</fhj_ycsl>
                        <fhjje>${fhjje}</fhjje>
                    </BPM_WGJTYGBCZLSQ_A>
                   `;
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `
                        <BPM_WGJTYGBCZLSQ_B>
                            <RelationRowGuid>${i+1}</RelationRowGuid>
                            <RowPrimaryKeys></RowPrimaryKeys>
                            <fentryrno>${i + 1}</fentryrno>
                            <fsqr>${mxlistArr[i].fsqr}</fsqr>
                            <ftel>${mxlistArr[i].ftel}</ftel>
                            <fssgs>${mxlistArr[i].fssgs}</fssgs>
                            <fssbm>${mxlistArr[i].fssbm}</fssbm>
                            <fccrs>${mxlistArr[i].fccrs}</fccrs>
                            <fccxl>${mxlistArr[i].fccxl}</fccxl>
                            <ycfdate>${mxlistArr[i].ycfdate}</ycfdate>
                            <fychdate>${mxlistArr[i].fychdate}</fychdate>
                            <fycsl>${mxlistArr[i].fycsl}</fycsl>
                            <fdj>${mxlistArr[i].fdj}</fdj>
                            <fje>${mxlistArr[i].fje}</fje>
                            <fzlgs>${mxlistArr[i].fzlgs}</fzlgs>
                            <fzldh>${mxlistArr[i].fzldh}</fzldh>
                            <fycsy>${mxlistArr[i].fycsy}</fycsy>
                        </BPM_WGJTYGBCZLSQ_B>
                       `;
            }
            xml += `
                       </FormData>
                    </XForm>
                   `;
            PostXml(xml);
        }
    });
}

function reSave() {

    var fbillno = $("#fbillno").val();
    var pid = $("#stepId").val();

    var fname = $("#fname").val();
    var fdate = $("#fdate").val();
    var fssjt = $("#fssjt").val();
    var fssgs = $("#fssgs").val();
    var ftel = $("#ftel").val();
    var ffkfs = $("#ffkfs").val();

    var fhj_ccrs = $("#fhj_ccrs").val();
    var fhj_ycsl = $("#fhj_ycsl").val();
    var fhjje = $("#fhjje").val();

    if (!ftel) {
        mui.toast('请填写联系电话');
        return;
    }
    if (!ffkfs) {
        mui.toast('请选择付款方式');
        return;
    }


    var mxlistArr = [];
    var mxflag = false;
    $("#mxlist").find("#mx").each(function () {
        var fsqr = $(this).find("#fsqr").val();
        var ftel = $(this).find("#ftel").val();
        var fssgs = $(this).find("#fssgs").val();
        var fssbm = $(this).find("#fssbm").val();
        var fccrs = $(this).find("#fccrs").val();
        var fccxl = $(this).find("#fccxl").val();
        var ycfdate = $(this).find("#ycfdate").val();
        var fychdate = $(this).find("#fychdate").val();
        var fycsl = $(this).find("#fycsl").val();
        var fdj = $(this).find("#fdj").val();
        var fje = $(this).find("#fje").val();
        var fzlgs = $(this).find("#fzlgs").val();
        var fzldh = $(this).find("#fzldh").val();
        var fycsy = $(this).find("#fycsy").val();
        var mx = new Mx(fsqr, ftel, fssgs, fssbm, fccrs, fccxl, ycfdate, fychdate, fycsl, fdj, fje, fzlgs, fzldh, fycsy, null);
        if (mx.check()) {
            mxflag = true;
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
                           <FormData>
                       `;
            xml += `
                     <BPM_WGJTYGBCZLSQ_A>
                        <fbillno>${fbillno}</fbillno>
                        <fname>${fname}</fname>
                        <fdate>${fdate}</fdate>
                        <fssjt>${fssjt}</fssjt>
                        <fssgs>${fssgs}</fssgs>
                        <ftel>${ftel}</ftel>
                        <ffkfs>${ffkfs}</ffkfs>
                        <fhj_ccrs>${fhj_ccrs}</fhj_ccrs>
                        <fhj_ycsl>${fhj_ycsl}</fhj_ycsl>
                        <fhjje>${fhjje}</fhjje>
                    </BPM_WGJTYGBCZLSQ_A>
                   `;
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `
                        <BPM_WGJTYGBCZLSQ_B>
                            <RelationRowGuid>${i + 1}</RelationRowGuid>
                            <RowPrimaryKeys></RowPrimaryKeys>
                            <fentryrno>${i + 1}</fentryrno>
                            <fsqr>${mxlistArr[i].fsqr}</fsqr>
                            <ftel>${mxlistArr[i].ftel}</ftel>
                            <fssgs>${mxlistArr[i].fssgs}</fssgs>
                            <fssbm>${mxlistArr[i].fssbm}</fssbm>
                            <fccrs>${mxlistArr[i].fccrs}</fccrs>
                            <fccxl>${mxlistArr[i].fccxl}</fccxl>
                            <ycfdate>${mxlistArr[i].ycfdate}</ycfdate>
                            <fychdate>${mxlistArr[i].fychdate}</fychdate>
                            <fycsl>${mxlistArr[i].fycsl}</fycsl>
                            <fdj>${mxlistArr[i].fdj}</fdj>
                            <fje>${mxlistArr[i].fje}</fje>
                            <fzlgs>${mxlistArr[i].fzlgs}</fzlgs>
                            <fzldh>${mxlistArr[i].fzldh}</fzldh>
                            <fycsy>${mxlistArr[i].fycsy}</fycsy>
                        </BPM_WGJTYGBCZLSQ_B>
                       `;
            }
            xml += `
                       </FormData>
                    </XForm>
                   `;
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
    var nodeName = $("#nodeName").val();

    var fname = $("#fname").val();
    var fdate = $("#fdate").val();
    var fssjt = $("#fssjt").val();
    var fssgs = $("#fssgs").val();
    var ftel = $("#ftel").val();
    var ffkfs = $("#ffkfs").val();

    var fhj_ccrs = $("#fhj_ccrs").val();
    var fhj_ycsl = $("#fhj_ycsl").val();
    var fhjje = $("#fhjje").val();

   


    var mxlistArr = [];
    var mxflag = false;
    $("#mxlist").find("#mx").each(function () {
        var fsqr = $(this).find("#fsqr").val();
        var ftel = $(this).find("#ftel").val();
        var fssgs = $(this).find("#fssgs").val();
        var fssbm = $(this).find("#fssbm").val();
        var fccrs = $(this).find("#fccrs").val();
        var fccxl = $(this).find("#fccxl").val();
        var ycfdate = $(this).find("#ycfdate").val();
        var fychdate = $(this).find("#fychdate").val();
        var fycsl = $(this).find("#fycsl").val();
        var fdj = $(this).find("#fdj").val();
        var fje = $(this).find("#fje").val();
        var fzlgs = $(this).find("#fzlgs").val();
        var fzldh = $(this).find("#fzldh").val();
        var fycsy = $(this).find("#fycsy").val();
        var mx = new Mx(fsqr, ftel, fssgs, fssbm, fccrs, fccxl, ycfdate, fychdate, fycsl, fdj, fje, fzlgs, fzldh, fycsy, '班车管理员审核');
        if (mx.check()) {
            mxflag = true;
            return;
        }
        mxlistArr.push(mx);
    });
    if (mxflag) {
        return;
    }

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
                     <BPM_WGJTYGBCZLSQ_A>
                        <fbillno>${fbillno}</fbillno>
                        <fname>${fname}</fname>
                        <fdate>${fdate}</fdate>
                        <fssjt>${fssjt}</fssjt>
                        <fssgs>${fssgs}</fssgs>
                        <ftel>${ftel}</ftel>
                        <ffkfs>${ffkfs}</ffkfs>
                        <fhj_ccrs>${fhj_ccrs}</fhj_ccrs>
                        <fhj_ycsl>${fhj_ycsl}</fhj_ycsl>
                        <fhjje>${fhjje}</fhjje>
                    </BPM_WGJTYGBCZLSQ_A>
                   `;
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `
                        <BPM_WGJTYGBCZLSQ_B>
                            <RelationRowGuid>${i + 1}</RelationRowGuid>
                            <RowPrimaryKeys>itemid=${itemidArr[i]}</RowPrimaryKeys>
                            <fentryrno>${i + 1}</fentryrno>
                            <fsqr>${mxlistArr[i].fsqr}</fsqr>
                            <ftel>${mxlistArr[i].ftel}</ftel>
                            <fssgs>${mxlistArr[i].fssgs}</fssgs>
                            <fssbm>${mxlistArr[i].fssbm}</fssbm>
                            <fccrs>${mxlistArr[i].fccrs}</fccrs>
                            <fccxl>${mxlistArr[i].fccxl}</fccxl>
                            <ycfdate>${mxlistArr[i].ycfdate}</ycfdate>
                            <fychdate>${mxlistArr[i].fychdate}</fychdate>
                            <fycsl>${mxlistArr[i].fycsl}</fycsl>
                            <fdj>${mxlistArr[i].fdj}</fdj>
                            <fje>${mxlistArr[i].fje}</fje>
                            <fzlgs>${mxlistArr[i].fzlgs}</fzlgs>
                            <fzldh>${mxlistArr[i].fzldh}</fzldh>
                            <fycsy>${mxlistArr[i].fycsy}</fycsy>
                        </BPM_WGJTYGBCZLSQ_B>
                       `;
            }
            xml += `
                       </FormData>
                    </XForm>
                   `;
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
                     <BPM_WGJTYGBCZLSQ_A>
                        <fbillno>${fbillno}</fbillno>
                        <fname>${fname}</fname>
                        <fdate>${fdate}</fdate>
                        <fssjt>${fssjt}</fssjt>
                        <fssgs>${fssgs}</fssgs>
                        <ftel>${ftel}</ftel>
                        <ffkfs>${ffkfs}</ffkfs>
                        <fhj_ccrs>${fhj_ccrs}</fhj_ccrs>
                        <fhj_ycsl>${fhj_ycsl}</fhj_ycsl>
                        <fhjje>${fhjje}</fhjje>
                    </BPM_WGJTYGBCZLSQ_A>
                   `;
        for (var i = 0; i < mxlistArr.length; i++) {
            xml += `
                        <BPM_WGJTYGBCZLSQ_B>
                            <RelationRowGuid>${i + 1}</RelationRowGuid>
                            <RowPrimaryKeys>itemid=${itemidArr[i]}</RowPrimaryKeys>
                            <fentryrno>${i + 1}</fentryrno>
                            <fsqr>${mxlistArr[i].fsqr}</fsqr>
                            <ftel>${mxlistArr[i].ftel}</ftel>
                            <fssgs>${mxlistArr[i].fssgs}</fssgs>
                            <fssbm>${mxlistArr[i].fssbm}</fssbm>
                            <fccrs>${mxlistArr[i].fccrs}</fccrs>
                            <fccxl>${mxlistArr[i].fccxl}</fccxl>
                            <ycfdate>${mxlistArr[i].ycfdate}</ycfdate>
                            <fychdate>${mxlistArr[i].fychdate}</fychdate>
                            <fycsl>${mxlistArr[i].fycsl}</fycsl>
                            <fdj>${mxlistArr[i].fdj}</fdj>
                            <fje>${mxlistArr[i].fje}</fje>
                            <fzlgs>${mxlistArr[i].fzlgs}</fzlgs>
                            <fzldh>${mxlistArr[i].fzldh}</fzldh>
                            <fycsy>${mxlistArr[i].fycsy}</fycsy>
                        </BPM_WGJTYGBCZLSQ_B>
                       `;
        }
        xml += `
                       </FormData>
                    </XForm>
                   `;
        PostXml(xml);
    }
}