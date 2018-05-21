function prepMsg() {

    $("#date").val(getNowFormatDate(2));
    tapEvent();
    var xml = `<?xml version= "1.0" ?>
                  <Requests>
                      <Params>
                      <Method>GetFormPostData</Method>
                      <ProcessName>集团公司员工班车租赁汇总</ProcessName>
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

    var fyeardata = [
        {
            value: '',
            text: '2016'
        },
        {
            value: '',
            text:'2017'
        },
        {
            value: '',
            text:'2018'
        },
        {
            value: '',
            text:'2019'
        }
    ];

    showPicker('fyear', fyeardata);

    var fmonthdata = [];

    for (var i = 0; i < 12; i++) {
        var obj = {
            value: '',
            text:(i+1)
        }
        fmonthdata.push(obj);
    }

    showPicker('fmonth', fmonthdata);

    $("#tjmx_sq").on('tap', () => {
        var li = `
                <div id="mx" class="mui-card">
                    <div class="mui-input-row itemtitle">
                        <label>明细列表项</label>
                        <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>
                    </div>
                    <div class="mui-row cutOffLine" style="padding-left:2vw;">
                        <div class="mui-col-xs-3" style="display:flex;">
                             <label>申请人</label>
                             <textarea rows="2" id="fsqr" placeholder="待填"></textarea>
                        </div>
                        <div class="mui-col-xs-3" style="display:flex;">
                             <label>所属公司</label>  
                             <textarea rows="2" id="fssgs" placeholder="待填"></textarea>
                        </div>
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>所属部门</label>
                            <textarea rows="2" id="fssbm" placeholder="待填"></textarea>
                        </div>
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>乘车线路</label>
                            <textarea rows="2" id="fccxl" placeholder="待填"></textarea>   
                        </div>
                    </div> 
                    <div class="mui-row cutOffLine" style="padding-left:2vw;">
                        <div class="mui-col-xs-6">
                             <label>开始时间</label>
                             <input type="datetime-local" id="ycfdate" />
                        </div>
                        <div class="mui-col-xs-6">
                            <label>结束时间</label>
                            <input type="datetime-local" id="fychdate"/>
                        </div>
                    </div>
                    <div class="mui-row cutOffLine" style="padding-left:2vw;">
                        <div class="mui-col-xs-3" style="display:flex;">
                             <label>数量</label>
                             <input type="number" id="fycsl" placeholder="待填"/>
                        </div>
                        <div class="mui-col-xs-3" style="display:flex;">
                             <label>单价</label>
                             <input type="number" id="fdj" placeholder="待填"/>
                        </div>
                        <div class="mui-col-xs-3" style="display:flex;">
                             <label>金额</label>
                             <input type="number" id="fje" readonly value="0"/>
                        </div>
                         <div class="mui-col-xs-3" style="display:flex;">
                             <label>实际</label>
                             <input type="number" id="fsjje" placeholder="待填"/>
                        </div> 
                    </div>
                     <div class="mui-row cutOffLine" style="padding-left:2vw;">
                         <div class="mui-col-xs-6" style="display:flex;">
                              <label>租赁公司</label>
                              <textarea rows="2" id="fzlgs" placeholder="待填"></textarea>
                         </div>
                          <div class="mui-col-xs-6" style="display:flex;">
                               <label>用车事由</label>
                               <textarea rows="2" id="fycsy" placeholder="待填"></textarea> 
                         </div>  
                     </div>                     
                 </div>
                  `;
        $("#mxlist_sq").append(li);
        $("#mxlist_sq").find("input[type='number']").each(function () {
            $(this).on('input', function () {
                calcSQ(this);
            });
        });
    });

    $("#tjmx_je").on('tap', () => {
        var li = `
                <div id="mx" class="mui-card">
                    <div class="mui-input-row itemtitle">
                        <label>明细列表项</label>
                        <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>
                    </div>
                    <div class="mui-row cutOffLine">
                         <div class="mui-col-xs-12" style="display:flex;">
                             <label>所属公司</label>   
                             <textarea rows="2" id="fssgs" placeholder="待填"></textarea>
                         </div>                           
                    </div>
                    <div class="mui-row cutOffLine">
                         <div class="mui-col-xs-4" style="display:flex;">
                             <label>城郊</label>
                             <input type="number" id="fcjje" placeholder="待填"/> 
                         </div>
                         <div class="mui-col-xs-4" style="display:flex;">
                             <label>公交</label>
                             <input type="number" id="fgjje" placeholder="待填"/> 
                         </div>
                         <div class="mui-col-xs-4" style="display:flex;">
                              <label>汇总</label>
                              <input type="number" id="fhzje" readonly value="0"/>
                         </div>
                    </div>  
                    <div class="mui-row cutOffLine">
                        <div class="mui-col-xs-12" style="display:flex">
                             <label>备注</label>
                             <textarea rows="2" id="fbz" placeholder="待填"></textarea>
                        </div>
                    </div>
                </div>
              `;
        $("#mxlist_je").append(li);
        $("#mxlist_je").find('input[type="number"]').each(function () {
            $(this).on('input', function () {
                calcJE(this);
            });
        });

    });

}

function calcSQ(context) {

    var fycsl = parseFloat($(context).parent().parent().find("#fycsl").val());
    var fdj = parseFloat($(context).parent().parent().find("#fdj").val());
    var fje =0;
    var fsjje = 0;

    fycsl = isNaN(fycsl) ? 0 : fycsl;
    fdj = isNaN(fdj) ? 0 : fdj;
    fje = isNaN(fje) ? 0 : fje;
    fsjje = isNaN(fsjje) ? 0 : fsjje;

    fje = fycsl * fdj;
    fsjje = fycsl * fdj;
    $(context).parent().parent().find("#fje").val(fje);
    $(context).parent().parent().find("#fsjje").val(fsjje);
    calcSQtotal();

}
function calcSQtotal() {
    var fhj_ycsl = 0;
    var fhj_je = 0;
    var fhj_sjje = 0;

    $("#mxlist_sq").find("#mx").each(function () {
        var fycsl = parseFloat($(this).find("#fycsl").val());
        var fje = parseFloat($(this).find("#fje").val());
        var fsjje = parseFloat($(this).find("#fsjje").val());

        fhj_ycsl += fycsl;
        fhj_je += fje;
        fhj_sjje += fsjje;

    });
    $("#fhj_ycsl").val(fhj_ycsl);
    $("#fhj_je").val(fhj_je);
    $("#fhj_sjje").val(fhj_sjje);


}

function calcJE(context) {

    var fcjje = parseFloat($(context).parent().parent().find("#fcjje").val());
    var fgjje = parseFloat($(context).parent().parent().find("#fgjje").val());
    var fhzje = 0;
    fhzje = fcjje + fgjje;
    $(context).parent().parent().find("#fhzje").val(fhzje);
    calcJEtotal();

}
function calcJEtotal() {

    var fhj_cjje = 0;
    var fhj_gjje = 0;
    var fhj_hzje = 0;

    $("#mxlist_je").find("#mx").each(function () {
        var fcjje = parseFloat($(this).find("#fcjje").val());
        var fgjje = parseFloat($(this).find("#fgjje").val());
        var fhzje = parseFloat($(this).find("#fhzje").val());
        fhj_cjje += fcjje;
        fhj_gjje += fgjje;
        fhj_hzje += fhzje;

    });
    $("#fhj_cjje").val(fhj_cjje);
    $("#fhj_gjje").val(fhj_gjje);
    $("#fhj_hzje").val(fhj_hzje);

}

var itemidArr1 = [];
var itemidArr2 = [];

function initData(data, flag) {

    var item = data.FormDataSet.BPM_WGJTYGBCZLHZ_A[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.fbillno);
    }
    $("#fname").val(item.fname);
    $("#date").val(FormatterTimeYMS(item.date));
    $("#fyear").val(item.fyear);
    $("#fmonth").val(item.fmonth);
    $("#ffkfs").val(item.ffkfs);

    $("#fhj_ycsl").val(item.fhj_ycsl);
    $("#fhj_je").val(item.fhj_je);
    $("#fhj_sjje").val(item.fhj_sjje);


    $("#fhj_cjje").val(item.fhj_cjje);
    $("#fhj_gjje").val(item.fhj_gjje);
    $("#fhj_hzje").val(item.fhj_hzje);

    var item_c1 = data.FormDataSet.BPM_WGJTYGBCZLHZ_B;

    for (var i = 0; i < item_c1.length; i++) {
        itemidArr1.push(item_c1[i].itemid);
        var li = `
                <div id="mx" class="mui-card">
                    <div class="mui-input-row itemtitle">
                        <label>明细列表项</label>
                        <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>
                    </div>
                    <div class="mui-row cutOffLine" style="padding-left:2vw;">
                        <div class="mui-col-xs-3" style="display:flex;">
                             <label>申请人</label>
                             <textarea rows="2" id="fsqr" readonly>${item_c1[i].fsqr}</textarea>
                        </div>
                        <div class="mui-col-xs-3" style="display:flex;">
                             <label>所属公司</label>  
                             <textarea rows="2" id="fssgs" readonly>${item_c1[i].fssgs}</textarea>
                        </div>
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>所属部门</label>
                            <textarea rows="2" id="fssbm" readonly>${item_c1[i].fssbm}</textarea>
                        </div>
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>乘车线路</label>
                            <textarea rows="2" id="fccxl" readonly>${item_c1[i].fccxl}</textarea>   
                        </div>
                    </div> 
                    <div class="mui-row cutOffLine" style="padding-left:2vw;">
                        <div class="mui-col-xs-6">
                             <label>开始时间</label>
                             <input type="datetime-local" id="ycfdate" readonly value="${item_c1[i].ycfdate}"/>
                        </div>
                        <div class="mui-col-xs-6">
                            <label>结束时间</label>
                            <input type="datetime-local" id="fychdate" readonly value="${item_c1[i].fychdate}"/>
                        </div>
                    </div>
                    <div class="mui-row cutOffLine" style="padding-left:2vw;">
                        <div class="mui-col-xs-3" style="display:flex;">
                             <label>数量</label>
                             <input type="number" id="fycsl" readonly value="${item_c1[i].fycsl}"/>
                        </div>
                        <div class="mui-col-xs-3" style="display:flex;">
                             <label>单价</label>
                             <input type="number" id="fdj" readonly value="${item_c1[i].fdj}"//>
                        </div>
                        <div class="mui-col-xs-3" style="display:flex;">
                             <label>金额</label>
                             <input type="number" id="fje" readonly value="${item_c1[i].fje}"/>
                        </div>
                         <div class="mui-col-xs-3" style="display:flex;">
                             <label>实际</label>
                             <input type="number" id="fsjje" readonly  value="${item_c1[i].fsjje}"/>
                        </div> 
                    </div>
                     <div class="mui-row cutOffLine" style="padding-left:2vw;">
                         <div class="mui-col-xs-6" style="display:flex;">
                              <label>租赁公司</label>
                              <textarea rows="2" id="fzlgs" readonly>${item_c1[i].fzlgs}</textarea>
                         </div>
                          <div class="mui-col-xs-6" style="display:flex;">
                               <label>用车事由</label>
                               <textarea rows="2" id="fycsy" readonly>${item_c1[i].fycsy}</textarea> 
                         </div>  
                     </div>                     
                 </div>
                  `;
        $("#mxlist_sq").append(li);
    }

    var item_c2 = data.FormDataSet.BPM_WGJTYGBCZLHZ_B1;
    for (var i = 0; i < item_c2.length; i++) {
        itemidArr2.push(item_c2[i].itemid);

        var li = `
                <div id="mx" class="mui-card">
                    <div class="mui-input-row itemtitle">
                        <label>明细列表项</label>
                        <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>
                    </div>
                    <div class="mui-row cutOffLine">
                         <div class="mui-col-xs-12" style="display:flex;">
                             <label>所属公司</label>
                             <textarea rows="2" id="fssgs" readonly>${item_c2[i].fssgs}</textarea>
                         </div>                           
                    </div>
                    <div class="mui-row cutOffLine">
                         <div class="mui-col-xs-4" style="display:flex;">
                             <label>城郊</label>
                             <input type="number" id="fcjje" readonly value="${item_c2[i].fcjje}"/> 
                         </div>
                         <div class="mui-col-xs-4" style="display:flex;">
                             <label>公交</label>
                             <input type="number" id="fgjje" readonly value="${item_c2[i].fgjje}"/> 
                         </div>
                         <div class="mui-col-xs-4" style="display:flex;">
                              <label>汇总</label>
                              <input type="number" id="fhzje" readonly value="${item_c2[i].fhzje}"/>
                         </div>
                    </div>  
                    <div class="mui-row cutOffLine">
                        <div class="mui-col-xs-12" style="display:flex">
                             <label>备注</label>
                             <textarea rows="2" id="fbz" readonly>${item_c2[i].fbz}</textarea>
                        </div>
                    </div>
                </div>
              `;
        $("#mxlist_je").append(li);
    }
}


function nodeControllerExp(NodeName) {
    if (String(NodeName).match('开始') != null) {
        $("#mxlist_sq,#mxlist_je").find('span').each(function () {
            $(this).show();
        });
        $("#mxlist_sq").find("#fsqr,#fssgs,#fssbm,#fccxl,#ycfdate,#fychdate,#fycsl,#fdj,#fsjje,#fzlgs,#fycsy").each(function () {
            $(this).removeAttr('readonly');
        });
        $("#mxlist_je").find("#fssgs,#fcjje,#fgjje,#fhzje,#fbz").each(function () {
            $(this).removeAttr('readonly');
        });
        
    }
    
}

class Mx_SQ {
    constructor(fsqr, fssgs, fssbm, fccxl, ycfdate, fychdate, fycsl, fdj, fje, fsjje, fzlgs, fycsy) {
        this.fsqr = fsqr;
        this.fssgs = fssgs;
        this.fssbm = fssbm;
        this.fccxl = fccxl;
        this.ycfdate = ycfdate;
        this.fychdate = fychdate;
        this.fycsl = fycsl;
        this.fdj = fdj;
        this.fje = fje;
        this.fsjje = fsjje;
        this.fzlgs = fzlgs;
        this.fycsy = fycsy;

    }
}
class Mx_JE {

    constructor(fssgs, fcjje, fgjje, fhzje, fbz) {
        this.fssgs = fssgs;
        this.fcjje = fcjje;
        this.fgjje = fgjje;
        this.fhzje = fhzje;
        this.fbz = fbz;


    }
}

function deleteItem(context) {
    var btnArray = ['否', '是'];
    mui.confirm('确认删除？', '', btnArray, function (e) {
        if (e.index == 1) {
            $(context).parent().parent().remove();
            calcJEtotal();
            calcSQtotal();
        }
    });

}

function Save() {

    var fname = $("#fname").val();
    var date = $("#date").val();
    var fyear = $("#fyear").val();
    var fmonth = $("#fmonth").val();
    var ffkfs = $("#ffkfs").val();

    var fhj_ycsl = $("#fhj_ycsl").val();
    var fhj_je = $("#fhj_je").val();
    var fhj_sjje = $("#fhj_sjje").val();

    var fhj_cjje = $("#fhj_cjje").val();
    var fhj_gjje = $("#fhj_gjje").val();
    var fhj_hzje = $("#fhj_hzje").val();

    var mxlistArr1 = [];
    $("#mxlist_sq").find("#mx").each(function () {
        var fsqr = $(this).find("#fsqr").val();
        var fssgs = $(this).find("#fssgs").val();
        var fssbm = $(this).find("#fssbm").val();
        var fccxl = $(this).find("#fccxl").val();
        var ycfdate = $(this).find("#ycfdate").val();
        var fychdate = $(this).find("#fychdate").val();
        var fycsl = $(this).find("#fycsl").val();
        var fdj = $(this).find("#fdj").val();
        var fje = $(this).find("#fje").val();
        var fsjje = $(this).find("#fsjje").val();
        var fzlgs = $(this).find("#fzlgs").val();
        var fycsy = $(this).find("#fycsy").val();
        var mx = new Mx_SQ(fsqr, fssgs, fssbm, fccxl, ycfdate, fychdate, fycsl, fdj, fje, fsjje, fzlgs, fycsy);
        mxlistArr1.push(mx);
    });

    var mxlistArr2 = [];
    $("#mxlist_je").find("#mx").each(function () {
        var fssgs = $(this).find("#fssgs").val();
        var fcjje = $(this).find("#fcjje").val();
        var fgjje = $(this).find("#fgjje").val();
        var fhzje = $(this).find("#fhzje").val();
        var fbz = $(this).find("#fbz").val();
        var mx = new Mx_JE(fssgs, fcjje, fgjje, fhzje, fbz);
        mxlistArr2.push(mx);
    });

    var btnArry = ["取消", "确定"];
    mui.confirm('即将提交，是否确定？', '提交确认提醒', btnArry, function (e) {
        if (e.index == 1) {
            var xml = `<?xml version="1.0"?>
                        <XForm>
                            <Header>
                                <Method>Post</Method>
                                <ProcessName>集团公司员工班车租赁汇总</ProcessName>
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
                      <BPM_WGJTYGBCZLHZ_A>
                            <fbillno>自动生成</fbillno>
                            <fname>${fname}</fname>
                            <date>${date}</date>
                            <fyear>${fyear}</fyear>
                            <fmonth>${fmonth}</fmonth>
                            <ffkfs>${ffkfs}</ffkfs>
                            <fhj_ycsl>${fhj_ycsl}</fhj_ycsl>
                            <fhj_je>${fhj_je}</fhj_je>
                            <fhj_sjje>${fhj_sjje}</fhj_sjje>
                            <fhj_cjje>${fhj_cjje}</fhj_cjje>
                            <fhj_gjje>${fhj_gjje}</fhj_gjje>
                            <fhj_hzje>${fhj_hzje}</fhj_hzje>
                        </BPM_WGJTYGBCZLHZ_A>
                    `;

            for (var i = 0; i < mxlistArr1.length; i++) {
                xml += `
                         <BPM_WGJTYGBCZLHZ_B>
                            <RelationRowGuid>${i+1}</RelationRowGuid>
                            <RowPrimaryKeys></RowPrimaryKeys>
                            <fentryno>${i + 1}</fentryno>
                            <fsqr>${mxlistArr1[i].fsqr}</fsqr>
                            <fssgs>${mxlistArr1[i].fssgs}</fssgs>
                            <fssbm>${mxlistArr1[i].fssbm}</fssbm>
                            <fccxl>${mxlistArr1[i].fccxl}</fccxl>
                            <ycfdate>${mxlistArr1[i].ycfdate}</ycfdate>
                            <fychdate>${mxlistArr1[i].fychdate}</fychdate>
                            <fycsl>${mxlistArr1[i].fycsl}</fycsl>
                            <fdj>${mxlistArr1[i].fdj}</fdj>
                            <fje>${mxlistArr1[i].fje}</fje>
                            <fsjje>${mxlistArr1[i].fsjje}</fsjje>
                            <fzlgs>${mxlistArr1[i].fzlgs}</fzlgs>
                            <fycsy>${mxlistArr1[i].fycsy}</fycsy>
                        </BPM_WGJTYGBCZLHZ_B>
                       `;
            }
            for (var i = 0; i < mxlistArr2.length; i++) {
                xml += `
                        <BPM_WGJTYGBCZLHZ_B1>
                            <RelationRowGuid>${mxlistArr1.length+i+1}</RelationRowGuid>
                            <RowPrimaryKeys></RowPrimaryKeys>
                            <fentryno>${i + 1}</fentryno>
                            <fssgs>${mxlistArr2[i].fssgs}</fssgs>
                            <fcjje>${mxlistArr2[i].fcjje}</fcjje>
                            <fgjje>${mxlistArr2[i].fgjje}</fgjje>
                            <fhzje>${mxlistArr2[i].fhzje}</fhzje>
                            <fbz>${mxlistArr2[i].fbz}</fbz>
                        </BPM_WGJTYGBCZLHZ_B1>
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
    var date = $("#date").val();
    var fyear = $("#fyear").val();
    var fmonth = $("#fmonth").val();
    var ffkfs = $("#ffkfs").val();

    var fhj_ycsl = $("#fhj_ycsl").val();
    var fhj_je = $("#fhj_je").val();
    var fhj_sjje = $("#fhj_sjje").val();

    var fhj_cjje = $("#fhj_cjje").val();
    var fhj_gjje = $("#fhj_gjje").val();
    var fhj_hzje = $("#fhj_hzje").val();

    var mxlistArr1 = [];
    $("#mxlist_sq").find("#mx").each(function () {
        var fsqr = $(this).find("#fsqr").val();
        var fssgs = $(this).find("#fssgs").val();
        var fssbm = $(this).find("#fssbm").val();
        var fccxl = $(this).find("#fccxl").val();
        var ycfdate = $(this).find("#ycfdate").val();
        var fychdate = $(this).find("#fychdate").val();
        var fycsl = $(this).find("#fycsl").val();
        var fdj = $(this).find("#fdj").val();
        var fje = $(this).find("#fje").val();
        var fsjje = $(this).find("#fsjje").val();
        var fzlgs = $(this).find("#fzlgs").val();
        var fycsy = $(this).find("#fycsy").val();
        var mx = new Mx_SQ(fsqr, fssgs, fssbm, fccxl, ycfdate, fychdate, fycsl, fdj, fje, fsjje, fzlgs, fycsy);
        mxlistArr1.push(mx);
    });

    var mxlistArr2 = [];
    $("#mxlist_je").find("#mx").each(function () {
        var fssgs = $(this).find("#fssgs").val();
        var fcjje = $(this).find("#fcjje").val();
        var fgjje = $(this).find("#fgjje").val();
        var fhzje = $(this).find("#fhzje").val();
        var fbz = $(this).find("#fbz").val();
        var mx = new Mx_JE(fssgs, fcjje, fgjje, fhzje, fbz);
        mxlistArr2.push(mx);
    });

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
                      <BPM_WGJTYGBCZLHZ_A>
                            <fbillno>${fbillno}</fbillno>
                            <fname>${fname}</fname>
                            <date>${date}</date>
                            <fyear>${fyear}</fyear>
                            <fmonth>${fmonth}</fmonth>
                            <ffkfs>${ffkfs}</ffkfs>
                            <fhj_ycsl>${fhj_ycsl}</fhj_ycsl>
                            <fhj_je>${fhj_je}</fhj_je>
                            <fhj_sjje>${fhj_sjje}</fhj_sjje>
                            <fhj_cjje>${fhj_cjje}</fhj_cjje>
                            <fhj_gjje>${fhj_gjje}</fhj_gjje>
                            <fhj_hzje>${fhj_hzje}</fhj_hzje>
                        </BPM_WGJTYGBCZLHZ_A>
                    `;

            for (var i = 0; i < mxlistArr1.length; i++) {
                xml += `
                         <BPM_WGJTYGBCZLHZ_B>
                            <RelationRowGuid>${i + 1}</RelationRowGuid>
                            <RowPrimaryKeys></RowPrimaryKeys>
                            <fentryno>${i + 1}</fentryno>
                            <fsqr>${mxlistArr1[i].fsqr}</fsqr>
                            <fssgs>${mxlistArr1[i].fssgs}</fssgs>
                            <fssbm>${mxlistArr1[i].fssbm}</fssbm>
                            <fccxl>${mxlistArr1[i].fccxl}</fccxl>
                            <ycfdate>${mxlistArr1[i].ycfdate}</ycfdate>
                            <fychdate>${mxlistArr1[i].fychdate}</fychdate>
                            <fycsl>${mxlistArr1[i].fycsl}</fycsl>
                            <fdj>${mxlistArr1[i].fdj}</fdj>
                            <fje>${mxlistArr1[i].fje}</fje>
                            <fsjje>${mxlistArr1[i].fsjje}</fsjje>
                            <fzlgs>${mxlistArr1[i].fzlgs}</fzlgs>
                            <fycsy>${mxlistArr1[i].fycsy}</fycsy>
                        </BPM_WGJTYGBCZLHZ_B>
                       `;
            }
            for (var i = 0; i < mxlistArr2.length; i++) {
                xml += `
                        <BPM_WGJTYGBCZLHZ_B1>
                            <RelationRowGuid>${mxlistArr1.length + i + 1}</RelationRowGuid>
                            <RowPrimaryKeys></RowPrimaryKeys>
                            <fentryno>${i + 1}</fentryno>
                            <fssgs>${mxlistArr2[i].fssgs}</fssgs>
                            <fcjje>${mxlistArr2[i].fcjje}</fcjje>
                            <fgjje>${mxlistArr2[i].fgjje}</fgjje>
                            <fhzje>${mxlistArr2[i].fhzje}</fhzje>
                            <fbz>${mxlistArr2[i].fbz}</fbz>
                        </BPM_WGJTYGBCZLHZ_B1>
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
    var date = $("#date").val();
    var fyear = $("#fyear").val();
    var fmonth = $("#fmonth").val();
    var ffkfs = $("#ffkfs").val();

    var fhj_ycsl = $("#fhj_ycsl").val();
    var fhj_je = $("#fhj_je").val();
    var fhj_sjje = $("#fhj_sjje").val();

    var fhj_cjje = $("#fhj_cjje").val();
    var fhj_gjje = $("#fhj_gjje").val();
    var fhj_hzje = $("#fhj_hzje").val();

    var mxlistArr1 = [];
    $("#mxlist_sq").find("#mx").each(function () {
        var fsqr = $(this).find("#fsqr").val();
        var fssgs = $(this).find("#fssgs").val();
        var fssbm = $(this).find("#fssbm").val();
        var fccxl = $(this).find("#fccxl").val();
        var ycfdate = $(this).find("#ycfdate").val();
        var fychdate = $(this).find("#fychdate").val();
        var fycsl = $(this).find("#fycsl").val();
        var fdj = $(this).find("#fdj").val();
        var fje = $(this).find("#fje").val();
        var fsjje = $(this).find("#fsjje").val();
        var fzlgs = $(this).find("#fzlgs").val();
        var fycsy = $(this).find("#fycsy").val();
        var mx = new Mx_SQ(fsqr, fssgs, fssbm, fccxl, ycfdate, fychdate, fycsl, fdj, fje, fsjje, fzlgs, fycsy);
        mxlistArr1.push(mx);
    });

    var mxlistArr2 = [];
    $("#mxlist_je").find("#mx").each(function () {
        var fssgs = $(this).find("#fssgs").val();
        var fcjje = $(this).find("#fcjje").val();
        var fgjje = $(this).find("#fgjje").val();
        var fhzje = $(this).find("#fhzje").val();
        var fbz = $(this).find("#fbz").val();
        var mx = new Mx_JE(fssgs, fcjje, fgjje, fhzje, fbz);
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
                     </Header>
                     <FormData>`;
            xml += `
                      <BPM_WGJTYGBCZLHZ_A>
                            <fbillno>${fbillno}</fbillno>
                            <fname>${fname}</fname>
                            <date>${date}</date>
                            <fyear>${fyear}</fyear>
                            <fmonth>${fmonth}</fmonth>
                            <ffkfs>${ffkfs}</ffkfs>
                            <fhj_ycsl>${fhj_ycsl}</fhj_ycsl>
                            <fhj_je>${fhj_je}</fhj_je>
                            <fhj_sjje>${fhj_sjje}</fhj_sjje>
                            <fhj_cjje>${fhj_cjje}</fhj_cjje>
                            <fhj_gjje>${fhj_gjje}</fhj_gjje>
                            <fhj_hzje>${fhj_hzje}</fhj_hzje>
                        </BPM_WGJTYGBCZLHZ_A>
                    `;

            for (var i = 0; i < mxlistArr1.length; i++) {
                xml += `
                         <BPM_WGJTYGBCZLHZ_B>
                            <RelationRowGuid>${i + 1}</RelationRowGuid>
                            <RowPrimaryKeys>itemid=${itemidArr1[i]}</RowPrimaryKeys>
                            <fentryno>${i + 1}</fentryno>
                            <fsqr>${mxlistArr1[i].fsqr}</fsqr>
                            <fssgs>${mxlistArr1[i].fssgs}</fssgs>
                            <fssbm>${mxlistArr1[i].fssbm}</fssbm>
                            <fccxl>${mxlistArr1[i].fccxl}</fccxl>
                            <ycfdate>${mxlistArr1[i].ycfdate}</ycfdate>
                            <fychdate>${mxlistArr1[i].fychdate}</fychdate>
                            <fycsl>${mxlistArr1[i].fycsl}</fycsl>
                            <fdj>${mxlistArr1[i].fdj}</fdj>
                            <fje>${mxlistArr1[i].fje}</fje>
                            <fsjje>${mxlistArr1[i].fsjje}</fsjje>
                            <fzlgs>${mxlistArr1[i].fzlgs}</fzlgs>
                            <fycsy>${mxlistArr1[i].fycsy}</fycsy>
                        </BPM_WGJTYGBCZLHZ_B>
                       `;
            }
            for (var i = 0; i < mxlistArr2.length; i++) {
                xml += `
                        <BPM_WGJTYGBCZLHZ_B1>
                            <RelationRowGuid>${mxlistArr1.length + i + 1}</RelationRowGuid>
                            <RowPrimaryKeys>itemid=${itemidArr2[i]}</RowPrimaryKeys>
                            <fentryno>${i + 1}</fentryno>
                            <fssgs>${mxlistArr2[i].fssgs}</fssgs>
                            <fcjje>${mxlistArr2[i].fcjje}</fcjje>
                            <fgjje>${mxlistArr2[i].fgjje}</fgjje>
                            <fhzje>${mxlistArr2[i].fhzje}</fhzje>
                            <fbz>${mxlistArr2[i].fbz}</fbz>
                        </BPM_WGJTYGBCZLHZ_B1>
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
                      <BPM_WGJTYGBCZLHZ_A>
                            <fbillno>${fbillno}</fbillno>
                            <fname>${fname}</fname>
                            <date>${date}</date>
                            <fyear>${fyear}</fyear>
                            <fmonth>${fmonth}</fmonth>
                            <ffkfs>${ffkfs}</ffkfs>
                            <fhj_ycsl>${fhj_ycsl}</fhj_ycsl>
                            <fhj_je>${fhj_je}</fhj_je>
                            <fhj_sjje>${fhj_sjje}</fhj_sjje>
                            <fhj_cjje>${fhj_cjje}</fhj_cjje>
                            <fhj_gjje>${fhj_gjje}</fhj_gjje>
                            <fhj_hzje>${fhj_hzje}</fhj_hzje>
                        </BPM_WGJTYGBCZLHZ_A>
                    `;

        for (var i = 0; i < mxlistArr1.length; i++) {
            xml += `
                         <BPM_WGJTYGBCZLHZ_B>
                            <RelationRowGuid>${i + 1}</RelationRowGuid>
                            <RowPrimaryKeys>itemid=${itemidArr1[i]}</RowPrimaryKeys>
                            <fentryno>${i + 1}</fentryno>
                            <fsqr>${mxlistArr1[i].fsqr}</fsqr>
                            <fssgs>${mxlistArr1[i].fssgs}</fssgs>
                            <fssbm>${mxlistArr1[i].fssbm}</fssbm>
                            <fccxl>${mxlistArr1[i].fccxl}</fccxl>
                            <ycfdate>${mxlistArr1[i].ycfdate}</ycfdate>
                            <fychdate>${mxlistArr1[i].fychdate}</fychdate>
                            <fycsl>${mxlistArr1[i].fycsl}</fycsl>
                            <fdj>${mxlistArr1[i].fdj}</fdj>
                            <fje>${mxlistArr1[i].fje}</fje>
                            <fsjje>${mxlistArr1[i].fsjje}</fsjje>
                            <fzlgs>${mxlistArr1[i].fzlgs}</fzlgs>
                            <fycsy>${mxlistArr1[i].fycsy}</fycsy>
                        </BPM_WGJTYGBCZLHZ_B>
                       `;
        }
        for (var i = 0; i < mxlistArr2.length; i++) {
            xml += `
                        <BPM_WGJTYGBCZLHZ_B1>
                            <RelationRowGuid>${mxlistArr1.length + i + 1}</RelationRowGuid>
                            <RowPrimaryKeys>itemid=${itemidArr2[i]}</RowPrimaryKeys>
                            <fentryno>${i + 1}</fentryno>
                            <fssgs>${mxlistArr2[i].fssgs}</fssgs>
                            <fcjje>${mxlistArr2[i].fcjje}</fcjje>
                            <fgjje>${mxlistArr2[i].fgjje}</fgjje>
                            <fhzje>${mxlistArr2[i].fhzje}</fhzje>
                            <fbz>${mxlistArr2[i].fbz}</fbz>
                        </BPM_WGJTYGBCZLHZ_B1>
                       `;
        }
        xml += `
                       </FormData>
                    </XForm>
                   `;
        PostXml(xml);
    }
}