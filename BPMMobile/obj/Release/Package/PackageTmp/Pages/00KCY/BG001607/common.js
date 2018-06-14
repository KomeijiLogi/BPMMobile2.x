function prepMsg() {
    $("#fdate").val(getNowFormatDate(2));
    tapEvent();
    var xml = `<?xml version= "1.0" ?>
                  <Requests>
                      <Params>
                      <Method>GetFormPostData</Method>
                      <ProcessName>集团公司员工免费生日蛋糕申请</ProcessName>
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


    }).fail(function (e) {

    });
}


function tapEvent() {

}


function initData(data, flag) {

    var item = data.FormDataSet.BPM_WGJTYGMFSRDGSQ_A[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.fbillno);
    }
    $("#fname").val(item.fname);
    $("#fdate").val(FormatterTimeYMS(item.fdate));
    $("#ftel").val(item.ftel);
    $("#fyear").val(item.fyear);
    var item_c = data.FormDataSet.BPM_WGJTYGMFSRDGSQ_B;
    for (var i = 0; i < item_c.length; i++) {
        itemidArr.push(item_c[i].itemid);
        var li = ` <div id="mx" class="mui-card">
                        <div class="mui-input-row itemtitle">
                            <label>明细列表项</label>
                            <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>
                        </div>
                        <div class="mui-row cutOffLine" style="padding:3vw;">
                             <div class="mui-col-xs-4" style="display:flex;">
                                  <label>申请人<i style="color:red;">*</i></label>
                                  <textarea rows="2" id="fsqr" readonly>${item_c[i].fsqr}</textarea>
                                  <input type="hidden" id="fempno" readonly value="${item_c[i].fempno}"/>    
                             </div>
                             <div class="mui-col-xs-4" style="display:flex;">
                                   <label>提报单位<i style="color:red;">*</i></label>
                                   <textarea rows="2" id="ftbdw" readonly>${item_c[i].ftbdw}</textarea>
                             </div>
                             <div class="mui-col-xs-4" style="display:flex;">
                                  <label>身份证号<i style="color:red;">*</i></label> 
                                  <textarea rows="2" id="fsfzh" readonly>${item_c[i].fsfzh}</textarea>
                             </div> 
                        </div>  
                         <div class="mui-row cutOffLine" style="padding:3vw;">
                             <div class="mui-col-xs-4" style="display:flex;">
                                <label>联系电话<i style="color:red;">*</i></label> 
                                <textarea rows="2" id="flxdh" readonly>${item_c[i].flxdh}</textarea>
                             </div>
                             <div class="mui-col-xs-4" style="display:flex;">
                                 <label>领取时间<i style="color:red;">*</i></label>
                                 <textarea rows="2" id="flqsj" readonly>${FormatterTimeYMS(item_c[i].flqsj)}</textarea> 
                             </div>
                              <input type="hidden" id="fissue" readonly/>
                             <div class="mui-col-xs-4" style="display:flex;">
                                 <label>领取地点<i style="color:red;">*</i></label>
                                 <textarea rows="2" id="flqdd" readonly>${item_c[i].flqdd}</textarea>   
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
    constructor(fsqr, fempno, ftbdw, fsfzh, flxdh, flqsj, fissue, flqdd) {

        this.fsqr = fsqr;
        this.fempno = fempno;
        this.ftbdw = ftbdw;
        this.fsfzh = fsfzh;
        this.flxdh = flxdh;
        this.flqsj = flqsj;
        this.fissue = fissue;
        this.flqdd = flqdd;

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
    var ftel = $("#ftel").val();
    var fyear = $("#fyear").val();

    var mxlistArr = [];
    $("#mxlist").find("#mx").each(function () {
        var fsqr = $(this).find("#fsqr").val();
        var fempno = $(this).find("#fempno").val();
        var ftbdw = $(this).find("#ftbdw").val();
        var fsfzh = $(this).find("#fsfzh").val();
        var flxdh = $(this).find("#flxdh").val();
        var flqsj = $(this).find("#flqsj").val();
        var fissue = $(this).find("#fissue").val();
        var flqdd = $(this).find("#flqdd").val();

        var mx = new Mx(fsqr, fempno, ftbdw, fsfzh, flxdh, flqsj, fissue, flqdd);
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
                     <Action>接受</Action>
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
                       <BPM_WGJTYGMFSRDGSQ_A>
                            <fbillno>${fbillno}</fbillno>
                            <fname>${fname}</fname>
                            <fdate>${fdate}</fdate>
                            <ftel>${ftel}</ftel>
                            <fyear>${fyear}</fyear>
                        </BPM_WGJTYGMFSRDGSQ_A>
                    `;
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `
                          <BPM_WGJTYGMFSRDGSQ_B>
                            <RelationRowGuid>${i + 1}</RelationRowGuid>
                            <RowPrimaryKeys>itemid=${itemidArr[i]}</RowPrimaryKeys>
                            <fentyrno>${i + 1}</fentyrno>
                            <fsqr>${mxlistArr[i].fsqr}</fsqr>
                            <fempno>${mxlistArr[i].fempno}</fempno>
                            <ftbdw>${mxlistArr[i].ftbdw}</ftbdw>
                            <fsfzh>${mxlistArr[i].fsfzh}</fsfzh>
                            <flxdh>${mxlistArr[i].flxdh}</flxdh>
                            <flqsj>${mxlistArr[i].flqsj}</flqsj>
                            <fisuse>${mxlistArr[i].fissue}</fisuse>
                            <flqdd>${mxlistArr[i].flqdd}</flqdd>
                        </BPM_WGJTYGMFSRDGSQ_B>
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
                   <Action>接受</Action>
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
                       <BPM_WGJTYGMFSRDGSQ_A>
                            <fbillno>${fbillno}</fbillno>
                            <fname>${fname}</fname>
                            <fdate>${fdate}</fdate>
                            <ftel>${ftel}</ftel>
                            <fyear>${fyear}</fyear>
                        </BPM_WGJTYGMFSRDGSQ_A>
                    `;
        for (var i = 0; i < mxlistArr.length; i++) {
            xml += `
                          <BPM_WGJTYGMFSRDGSQ_B>
                            <RelationRowGuid>${i + 1}</RelationRowGuid>
                            <RowPrimaryKeys>itemid=${itemidArr[i]}</RowPrimaryKeys>
                            <fentyrno>${i + 1}</fentyrno>
                            <fsqr>${mxlistArr[i].fsqr}</fsqr>
                            <fempno>${mxlistArr[i].fempno}</fempno>
                            <ftbdw>${mxlistArr[i].ftbdw}</ftbdw>
                            <fsfzh>${mxlistArr[i].fsfzh}</fsfzh>
                            <flxdh>${mxlistArr[i].flxdh}</flxdh>
                            <flqsj>${mxlistArr[i].flqsj}</flqsj>
                            <fisuse>${mxlistArr[i].fissue}</fisuse>
                            <flqdd>${mxlistArr[i].flqdd}</flqdd>
                        </BPM_WGJTYGMFSRDGSQ_B>
                       `;
        }
        xml += `
                       </FormData>
                    </XForm>
                   `;
        PostXml(xml);
    }
}