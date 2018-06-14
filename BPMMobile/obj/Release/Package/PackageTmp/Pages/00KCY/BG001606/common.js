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
    constructor(fxm, fxb, fbanzu, fsfzh, flz_rq, flz_fs, fzsdd, fbz) {

        this.fxm = fxm;
        this.fxb = fxb;
        this.fbanzu = fbanzu;
        this.fsfzh = fsfzh;
        this.flz_rq = flz_rq;
        this.flz_fs = flz_fs;
        this.fzsdd = fzsdd;
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
    var nodeName = $("#nodeName").val();


    var fname = $("#fname").val();
    var fdate = $("#fdate").val();
    var fssgs = $("#fssgs").val();
    var fssfgs = $("#fssfgs").val();
    var flxdh = $("#flxdh").val();

    var mxlistArr = [];
    var mxflag = false;
    $("#mxlist").find("#mx").each(function () {

        var fxm = $(this).find("#fxm").val();
        var fxb = $(this).find("#fxb").val();
        var fbanzu = $(this).find("#fbanzu").val();
        var fsfzh = $(this).find("#fsfzh").val();
        var flz_rq = $(this).find("#flz_rq").val();
        var flz_fs = $(this).find("#flz_fs").val();
        var fzsdd = $(this).find("#fzsdd").val();
        var fbz = $(this).find("#fbz").val();

        var mx = new Mx(fxm, fxb, fbanzu, fsfzh, flz_rq, flz_fs, fzsdd, fbz);
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
                     </Header>
                     <FormData>`;
            xml += `
                      <BPM_WGJTYGLISSQLTB_A>
                        <fbillno>${fbillno}</fbillno>
                        <fname>${fname}</fname>
                        <fdate>${fdate}</fdate>
                        <fssgs>${fssgs}</fssgs>
                        <ffgs>${fssfgs}</ffgs>
                        <ftel>${flxdh}</ftel>
                        <fj>201609230087</fj>
                    </BPM_WGJTYGLISSQLTB_A>
                    `;
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `
                          <BPM_WGJTYGLISSQLTB_B>
                            <RelationRowGuid>${i + 1}</RelationRowGuid>
                            <RowPrimaryKeys>itemid=${itemidArr[i]}</RowPrimaryKeys>
                            <fentyrno>${i + 1}</fentyrno>
                            <fxm>${mxlistArr[i].fxm}</fxm>
                            <fxb>${mxlistArr[i].fxb}</fxb>
                            <fbanzu>${mxlistArr[i].fbanzu}</fbanzu>
                            <fsfzh>${mxlistArr[i].fsfzh}</fsfzh>
                            <flz_rq>${mxlistArr[i].flz_rq}</flz_rq>
                            <flz_fs>${mxlistArr[i].flz_fs}</flz_fs>
                            <fzsdd>${mxlistArr[i].fzsdd}</fzsdd>
                            <fbz>${mxlistArr[i].fbz}</fbz>
                        </BPM_WGJTYGLISSQLTB_B>
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
                      <BPM_WGJTYGLISSQLTB_A>
                        <fbillno>${fbillno}</fbillno>
                        <fname>${fname}</fname>
                        <fdate>${fdate}</fdate>
                        <fssgs>${fssgs}</fssgs>
                        <ffgs>${fssfgs}</ffgs>
                        <ftel>${flxdh}</ftel>
                        <fj>201609230087</fj>
                    </BPM_WGJTYGLISSQLTB_A>
                    `;
        for (var i = 0; i < mxlistArr.length; i++) {
            xml += `
                          <BPM_WGJTYGLISSQLTB_B>
                            <RelationRowGuid>${i + 1}</RelationRowGuid>
                            <RowPrimaryKeys>itemid=${itemidArr[i]}</RowPrimaryKeys>
                            <fentyrno>${i + 1}</fentyrno>
                            <fxm>${mxlistArr[i].fxm}</fxm>
                            <fxb>${mxlistArr[i].fxb}</fxb>
                            <fbanzu>${mxlistArr[i].fbanzu}</fbanzu>
                            <fsfzh>${mxlistArr[i].fsfzh}</fsfzh>
                            <flz_rq>${mxlistArr[i].flz_rq}</flz_rq>
                            <flz_fs>${mxlistArr[i].flz_fs}</flz_fs>
                            <fzsdd>${mxlistArr[i].fzsdd}</fzsdd>
                            <fbz>${mxlistArr[i].fbz}</fbz>
                        </BPM_WGJTYGLISSQLTB_B>
                        `;
        }
        xml += `
                       </FormData>
                    </XForm>
                   `;
        PostXml(xml);

    }
}