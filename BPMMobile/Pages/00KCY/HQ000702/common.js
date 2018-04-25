function prepMsg() {

    $("#fdate").val(getNowFormatDate(2));
    tapEvent();
    var xml = `<?xml version= "1.0" ?>
                  <Requests>
                      <Params>
                      <Method>GetFormPostData</Method>
                      <ProcessName>集团公司食堂临时就餐汇总</ProcessName>
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
        $("#fhzr").val(item.fhzr);
        

    }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
        if (XMLHttpRequest.status == "401") {
            mui.alert('授权过期，请重新打开页面');;
        } else if (XMLHttpRequest.status == "500") {
            mui.alert('服务器内部错误');
        }

    });
}

function tapEvent() {

    var fjcstdata = [
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
            text:'二号门小食堂'
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
    showPicker('fjcst', fjcstdata);

    $("#tjmx").on('tap', () => {

        var li = `<div id="mx" class="mui-card">
                    <div class="mui-input-row itemtitle">
                        <label>明细列表项</label>
                        <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>
                    </div>
                     <div class="mui-row" style="padding:1vw;">
                         <div class="mui-col-xs-6" style="display:flex;">
                             <label>申请人</label>
                             <input type="text" id="fsqr" placeholder="请填写"/> 
                         </div>
                         <div class="mui-col-xs-6" style="display:flex;">
                             <label>申请公司</label>
                             <input type="text" id="fsqgs" placeholder="请填写"/>
                         </div>
                          
                     </div> 
                      <div class="mui-row" style="padding:1vw;">
                          <div class="mui-col-xs-12" style="display:flex;">
                              <label>就餐时间</label>
                              <input type="datetime-local" id="fjc_rq"/>
                         </div> 
                      </div>
                       
                     <div class="mui-row" style="padding:1vw;">
                         <div class="mui-col-xs-3" style="display:flex;">
                             <label>餐别</label>
                             <input type="text" id="fcb" placeholder="请填写"/>  
                         </div> 
                          <div class="mui-col-xs-3" style="display:flex;">
                              <label>餐标</label>
                              <input type="text" id="fcbiao" placeholder="请填写"/>
                         </div> 
                          <div class="mui-col-xs-3" style="display:flex;">
                              <label>人数</label>
                              <input type="number" id="fjc_rs" placeholder="请填写"/>
                         </div> 
                         <div class="mui-col-xs-3" style="display:flex;">
                              <label>金额</label>
                              <input type="number" id="fjc_je" placeholder="请填写"/>
                         </div> 
                     </div>
                 </div> 
                 `;
        $("#mxlist").append(li);
        $("#mxlist").find("#fjc_rs,#fjc_je").each(function () {
            $(this).on('input', function () {
                calcTotal();
            });

        });
    });

}
function calcTotal() {
    var total_rs = 0;
    var total_je = 0;
    $("#mxlist").find("#mx").each(function () {
        var fjc_rs = parseFloat($(this).find("#fjc_rs").val());
        fjc_rs = isNaN(fjc_rs) ? 0 : fjc_rs;
        total_rs += fjc_rs;
        var fjc_je = parseFloat($(this).find("#fjc_je").val());
        fjc_je = isNaN(fjc_je) ? 0 : fjc_je;
        total_je += fjc_je;
    });

    $("#fhj_jcrs").val(total_rs);
    $("#fh_jcje").val(total_je);
}
function deleteItem(context) {
    var btnArray = ['否', '是'];
    mui.confirm('确认删除？', '', btnArray, function (e) {
        if (e.index == 1) {
            $(context).parent().parent().remove();
            calcTotal();
        }
    });
}

function initData(data, flag) {
    var item = data.FormDataSet.BPM_WGJTLSJCHZ_A[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.fbillno);
    }
    $("#fhzr").val(item.fhzr);
    $("#fdate").val(FormatterTimeYMS(item.fdate));
    $("#fksrq").val(FormatterTimeYMS(item.fksrq));
    $("#fjsrq").val(FormatterTimeYMS(item.fjsrq));
    $("#fjcst").val(item.fjcst);
    $("#fhj_jcrs").val(item.fhj_jcrs);
    $("#fh_jcje").val(item.fh_jcje);
    var item_c = data.FormDataSet.BPM_WGJTLSJCHZ_B;
    for (var i = 0; i < item_c.length; i++) {
        itemidArr.push(item_c[i].itemid);
        var li = `<div id="mx" class="mui-card">
                    <div class="mui-input-row itemtitle">
                        <label>明细列表项</label>
                        <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>
                    </div>
                     <div class="mui-row" style="padding:1vw;">
                         <div class="mui-col-xs-6" style="display:flex;">
                             <label>申请人</label>
                             <input type="text" id="fsqr" readonly value="${item_c[i].fsqr}"/> 
                         </div>
                         <div class="mui-col-xs-6" style="display:flex;">
                             <label>申请公司</label>
                             <input type="text" id="fsqgs" readonly value="${item_c[i].fsqgs}"/>
                         </div>
                          
                     </div> 
                      <div class="mui-row" style="padding:1vw;">
                          <div class="mui-col-xs-12" style="display:flex;">
                              <label>就餐时间</label>
                              <input type="datetime-local" id="fjc_rq" readonly value="${item_c[i].fjc_rq}"/>
                         </div> 
                      </div>
                       
                     <div class="mui-row" style="padding:1vw;">
                         <div class="mui-col-xs-3" style="display:flex;">
                             <label>餐别</label>
                             <input type="text" id="fcb" readonly value="${item_c[i].fcb}"/>  
                         </div> 
                          <div class="mui-col-xs-3" style="display:flex;">
                              <label>餐标</label>
                              <input type="text" id="fcbiao" readonly value="${item_c[i].fcbiao}"/>
                         </div> 
                          <div class="mui-col-xs-3" style="display:flex;">
                              <label>人数</label>
                              <input type="number" id="fjc_rs" readonly value="${item_c[i].fjc_rs}"/>
                         </div> 
                         <div class="mui-col-xs-3" style="display:flex;">
                              <label>金额</label>
                              <input type="number" id="fjc_je" readonly value="${item_c[i].fjc_je}"/>
                         </div> 
                     </div>
                 </div> 
                 `;
        $("#mxlist").append(li);
    }
}

function nodeControllerExp(NodeName) {
    if (String(NodeName).match('开始') != null) {
        $("#mxlist").find("#fjc_rs,#fjc_je").each(function () {
            $(this).on('input', function () {
                calcTotal();
            });

        });
        $("#mxlist").find('span').each(function () {
            $(this).show();
        });
        $("#mxlist").find('input').each(function () {
            $(this).removeAttr('readonly');
        });
        $("#fdate,#fksrq,#fjsrq").removeAttr('readonly');
        tapEvent();
    }
}

class Mx {
    constructor(fsqr, fsqgs, fjc_rq, fcb, fcbiao, fjc_rs, fjc_je) {
        this.fsqr = fsqr;
        this.fsqgs = fsqgs;
        this.fjc_rq = fjc_rq;
        this.fcb = fcb;
        this.fcbiao = fcbiao;
        this.fjc_rs = fjc_rs;
        this.fjc_je = fjc_je;
    }
}
function Save() {

    var fhzr = $("#fhzr").val();
    var fdate = $("#fdate").val();
    var fksrq = $("#fksrq").val();
    var fjsrq = $("#fjsrq").val();
    var fjcst = $("#fjcst").val();
    var fhj_jcrs = $("#fhj_jcrs").val();
    var fh_jcje = $("#fh_jcje").val();
    var fbz = $("#fbz").val();
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fsqr = $(this).find("#fsqr").val();
        var fsqgs = $(this).find("#fsqgs").val();
        var fjc_rq = $(this).find("#fjc_rq").val();
        var fcb = $(this).find("#fcb").val();
        var fcbiao = $(this).find("#fcbiao").val();
        var fjc_rs = $(this).find("#fjc_rs").val();
        var fjc_je = $(this).find("#fjc_je").val();

        var mx = new Mx(fsqr, fsqgs, fjc_rq, fcb, fcbiao, fjc_rs, fjc_je);
        mxlistArr.push(mx);
    });

    var btnArry = ["取消", "确定"];
    mui.confirm('即将提交，是否确定？', '提交确认提醒', btnArry, function (e) {
        if (e.index == 1) {
            var xml = `<?xml version= "1.0" ?>
                       <XForm>
                        <Header>
                       <Method>Post</Method>';
                      <ProcessName>集团公司食堂临时就餐汇总</ProcessName>
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
                   <BPM_WGJTLSJCHZ_A>
                        <fbillno>自动生成</fbillno>
                        <fhzr>${fhzr}</fhzr>
                        <fdate>${fdate}</fdate>
                        <fksrq>${fksrq}</fksrq>
                        <fjsrq>${fjsrq}</fjsrq>
                        <fjcst>${fjcst}</fjcst>
                        <fhj_jcrs>${fhj_jcrs}</fhj_jcrs>
                        <fh_jcje>${fh_jcje}</fh_jcje>
                        <fbz>${fbz}</fbz>
                    </BPM_WGJTLSJCHZ_A>
                   `;
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `
                        <BPM_WGJTLSJCHZ_B>
                            <RelationRowGuid>${i+1}</RelationRowGuid>
                            <RowPrimaryKeys></RowPrimaryKeys>
                            <fentryno>${i + 1}</fentryno>
                            <fsqr>${mxlistArr[i].fsqr}</fsqr>
                            <fsqgs>${mxlistArr[i].fsqgs}</fsqgs>
                            <fjc_rq>${mxlistArr[i].fjc_rq}</fjc_rq>
                            <fcb>${mxlistArr[i].fcb}</fcb>
                            <fcbiao>${mxlistArr[i].fcbiao}</fcbiao>
                            <fjc_rs>${mxlistArr[i].fjc_rs}</fjc_rs>
                            <fjc_je>${mxlistArr[i].fjc_je}</fjc_je>
                        </BPM_WGJTLSJCHZ_B>
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

    var fhzr = $("#fhzr").val();
    var fdate = $("#fdate").val();
    var fksrq = $("#fksrq").val();
    var fjsrq = $("#fjsrq").val();
    var fjcst = $("#fjcst").val();
    var fhj_jcrs = $("#fhj_jcrs").val();
    var fh_jcje = $("#fh_jcje").val();
    var fbz = $("#fbz").val();
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fsqr = $(this).find("#fsqr").val();
        var fsqgs = $(this).find("#fsqgs").val();
        var fjc_rq = $(this).find("#fjc_rq").val();
        var fcb = $(this).find("#fcb").val();
        var fcbiao = $(this).find("#fcbiao").val();
        var fjc_rs = $(this).find("#fjc_rs").val();
        var fjc_je = $(this).find("#fjc_je").val();

        var mx = new Mx(fsqr, fsqgs, fjc_rq, fcb, fcbiao, fjc_rs, fjc_je);
        mxlistArr.push(mx);
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
                        <FormData>`;
            xml += `
                   <BPM_WGJTLSJCHZ_A>
                        <fbillno>${fbillno}</fbillno>
                        <fhzr>${fhzr}</fhzr>
                        <fdate>${fdate}</fdate>
                        <fksrq>${fksrq}</fksrq>
                        <fjsrq>${fjsrq}</fjsrq>
                        <fjcst>${fjcst}</fjcst>
                        <fhj_jcrs>${fhj_jcrs}</fhj_jcrs>
                        <fh_jcje>${fh_jcje}</fh_jcje>
                        <fbz>${fbz}</fbz>
                    </BPM_WGJTLSJCHZ_A>
                   `;
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `
                        <BPM_WGJTLSJCHZ_B>
                            <RelationRowGuid>${i + 1}</RelationRowGuid>
                            <RowPrimaryKeys></RowPrimaryKeys>
                            <fentryno>${i + 1}</fentryno>
                            <fsqr>${mxlistArr[i].fsqr}</fsqr>
                            <fsqgs>${mxlistArr[i].fsqgs}</fsqgs>
                            <fjc_rq>${mxlistArr[i].fjc_rq}</fjc_rq>
                            <fcb>${mxlistArr[i].fcb}</fcb>
                            <fcbiao>${mxlistArr[i].fcbiao}</fcbiao>
                            <fjc_rs>${mxlistArr[i].fjc_rs}</fjc_rs>
                            <fjc_je>${mxlistArr[i].fjc_je}</fjc_je>
                        </BPM_WGJTLSJCHZ_B>
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
    var nodeName = $("#nodeName").val();

    var fhzr = $("#fhzr").val();
    var fdate = $("#fdate").val();
    var fksrq = $("#fksrq").val();
    var fjsrq = $("#fjsrq").val();
    var fjcst = $("#fjcst").val();
    var fhj_jcrs = $("#fhj_jcrs").val();
    var fh_jcje = $("#fh_jcje").val();
    var fbz = $("#fbz").val();
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fsqr = $(this).find("#fsqr").val();
        var fsqgs = $(this).find("#fsqgs").val();
        var fjc_rq = $(this).find("#fjc_rq").val();
        var fcb = $(this).find("#fcb").val();
        var fcbiao = $(this).find("#fcbiao").val();
        var fjc_rs = $(this).find("#fjc_rs").val();
        var fjc_je = $(this).find("#fjc_je").val();

        var mx = new Mx(fsqr, fsqgs, fjc_rq, fcb, fcbiao, fjc_rs, fjc_je);
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
                   <BPM_WGJTLSJCHZ_A>
                        <fbillno>${fbillno}</fbillno>
                        <fhzr>${fhzr}</fhzr>
                        <fdate>${fdate}</fdate>
                        <fksrq>${fksrq}</fksrq>
                        <fjsrq>${fjsrq}</fjsrq>
                        <fjcst>${fjcst}</fjcst>
                        <fhj_jcrs>${fhj_jcrs}</fhj_jcrs>
                        <fh_jcje>${fh_jcje}</fh_jcje>
                        <fbz>${fbz}</fbz>
                    </BPM_WGJTLSJCHZ_A>
                   `;
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `
                        <BPM_WGJTLSJCHZ_B>
                            <RelationRowGuid>${i + 1}</RelationRowGuid>
                            <RowPrimaryKeys>itemid=${itemidArr[i]}</RowPrimaryKeys>
                            <fentryno>${i + 1}</fentryno>
                            <fsqr>${mxlistArr[i].fsqr}</fsqr>
                            <fsqgs>${mxlistArr[i].fsqgs}</fsqgs>
                            <fjc_rq>${mxlistArr[i].fjc_rq}</fjc_rq>
                            <fcb>${mxlistArr[i].fcb}</fcb>
                            <fcbiao>${mxlistArr[i].fcbiao}</fcbiao>
                            <fjc_rs>${mxlistArr[i].fjc_rs}</fjc_rs>
                            <fjc_je>${mxlistArr[i].fjc_je}</fjc_je>
                        </BPM_WGJTLSJCHZ_B>
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
                   <BPM_WGJTLSJCHZ_A>
                        <fbillno>${fbillno}</fbillno>
                        <fhzr>${fhzr}</fhzr>
                        <fdate>${fdate}</fdate>
                        <fksrq>${fksrq}</fksrq>
                        <fjsrq>${fjsrq}</fjsrq>
                        <fjcst>${fjcst}</fjcst>
                        <fhj_jcrs>${fhj_jcrs}</fhj_jcrs>
                        <fh_jcje>${fh_jcje}</fh_jcje>
                        <fbz>${fbz}</fbz>
                    </BPM_WGJTLSJCHZ_A>
                   `;
        for (var i = 0; i < mxlistArr.length; i++) {
            xml += `
                        <BPM_WGJTLSJCHZ_B>
                            <RelationRowGuid>${i + 1}</RelationRowGuid>
                            <RowPrimaryKeys>itemid=${itemidArr[i]}</RowPrimaryKeys>
                            <fentryno>${i + 1}</fentryno>
                            <fsqr>${mxlistArr[i].fsqr}</fsqr>
                            <fsqgs>${mxlistArr[i].fsqgs}</fsqgs>
                            <fjc_rq>${mxlistArr[i].fjc_rq}</fjc_rq>
                            <fcb>${mxlistArr[i].fcb}</fcb>
                            <fcbiao>${mxlistArr[i].fcbiao}</fcbiao>
                            <fjc_rs>${mxlistArr[i].fjc_rs}</fjc_rs>
                            <fjc_je>${mxlistArr[i].fjc_je}</fjc_je>
                        </BPM_WGJTLSJCHZ_B>
                       `;
        }
        xml += `  </FormData>
                      </XForm>`;
        PostXml(xml);
    }


}
