function prepMsg() {
    $("#fdate").val(getNowFormatDate(2));
    tapEvent();
    var xml = `<?xml version= "1.0" ?>
                  <Requests>
                      <Params>
                      <Method>GetFormPostData</Method>
                      <ProcessName>集团公司员工月末乘坐班车线路提报</ProcessName>
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
        $("#ftbr").val(item.ftbr);
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

    $("#tjmx").on('tap',  ()=> {
        var li = `
                   <div id="mx" class="mui-card">
                        <div class="mui-input-row itemtitle">
                            <label>明细列表项</label>
                            <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>
                        </div>
                         <div class="mui-row" style="padding:1vw;">
                            <div class="mui-col-xs-4" style="display:flex;">
                               <label>所属集团<i style="color:red;">*</i></label>
                               <input type="text" id="fssjt" placeholder="待填"/>
                            </div>
                            <div class="mui-col-xs-4" style="display:flex;">
                               <label>所属公司<i style="color:red;">*</i></label>
                               <input type="text" id="fssgs" placeholder="待填"/> 
                            </div>
                            <div class="mui-col-xs-4" style="display:flex;">
                                <label>所属部门<i style="color:red;">*</i></label>
                                <input type="text" id="fssbm" placeholder="待填"/>
                            </div>
                         </div>
                         <div class="mui-row" style="padding:1vw;">
                             <div class="mui-col-xs-3" style="display:flex;">
                                <label>姓名<i style="color:red;">*</i></label>
                                <input type="text" id="fname" placeholder="待填"/> 
                             </div>
                             <div class="mui-col-xs-9" style="display:flex;">
                                 <label>餐卡卡号<i style="color:red;">*</i></label>
                                 <input type="text" id="fckh" placeholder="待填"/>  
                             </div>
                         </div>   
                         <div class="mui-row" style="padding:1vw;">
                             <div class="mui-col-xs-4" style="display:flex;">
                                <label>乘车线路<i style="color:red;">*</i></label>
                                <input type="text" id="fccxl" placeholder="待填"/> 
                             </div>
                             <div class="mui-col-xs-4" style="display:flex;">
                                 <label>上车站点<i style="color:red;">*</i></label>
                                 <input type="text" id="fsczd" placeholder="待填"/> 
                             </div>
                              <div class="mui-col-xs-4" style="display:flex;">
                                 <label>乘车类型<i style="color:red;">*</i></label>
                                 <input type="text" id="fczlx" placeholder="待填"/>   
                              </div>
                         </div>
                    </div>
                `;
        $("#mxlist").append(li);
    });

    var fyeardata = [
        {
            value: '',
            text:'2016'
        },
        {
            value: '',
            text:'2017'
        },
        {
            value: '',
            text:'2018'
        }
    ];

    showPicker('fyear', fyeardata);


    var fmonthdata = [
      
    ];
    for (var i = 0; i < 12; i++) {
        var obj = {
            value: '',
            text:(i+1)
        }
        fmonthdata.push(obj);
    }
    showPicker('fmonth', fmonthdata);
}


function initData(data, flag) {

    var item = data.FormDataSet.BPM_WGJTYGYMBCLXTB_A[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.fbillno);
    }
    $("#ftbr").val(item.ftbr);
    $("#fdate").val(FormatterTimeYMS(item.fdate));
    $("#fssgs").val(item.fssgs);
    $("#ftel").val(item.ftel);
    $("#fyear").val(item.fyear);
    $("#fmonth").val(item.fmonth);
    var itme_c = data.FormDataSet.BPM_WGJTYGYMBCLXTB_B;
    for (var i = 0; i < itme_c.length;i++){
        itemidArr.push(itme_c.itemid);
        var li = `
                   <div id="mx" class="mui-card">
                        <div class="mui-input-row itemtitle">
                            <label>明细列表项</label>
                            <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>
                        </div>
                         <div class="mui-row" style="padding:1vw;">
                            <div class="mui-col-xs-4" style="display:flex;">
                               <label>所属集团<i style="color:red;">*</i></label>
                               <input type="text" id="fssjt" readonly value="${itme_c[i].fssjt}"/>
                            </div>
                            <div class="mui-col-xs-4" style="display:flex;">
                               <label>所属公司<i style="color:red;">*</i></label>
                               <input type="text" id="fssgs" readonly value="${itme_c[i].fssgs}"/> 
                            </div>
                            <div class="mui-col-xs-4" style="display:flex;">
                                <label>所属部门<i style="color:red;">*</i></label>
                                <input type="text" id="fssbm" readonly value="${itme_c[i].fssbm}"/>
                            </div>
                         </div>
                         <div class="mui-row" style="padding:1vw;">
                             <div class="mui-col-xs-3" style="display:flex;">
                                <label>姓名<i style="color:red;">*</i></label>
                                <input type="text" id="fname" readonly value="${itme_c[i].fname}"/> 
                             </div>
                             <div class="mui-col-xs-9" style="display:flex;">
                                 <label>餐卡卡号<i style="color:red;">*</i></label>
                                 <input type="text" id="fckh" readonly value="${itme_c[i].fckh}"/>  
                             </div>
                         </div>   
                         <div class="mui-row" style="padding:1vw;">
                             <div class="mui-col-xs-4" style="display:flex;">
                                <label>乘车线路<i style="color:red;">*</i></label>
                                <input type="text" id="fccxl" readonly value="${itme_c[i].fccxl}"/> 
                             </div>
                             <div class="mui-col-xs-4" style="display:flex;">
                                 <label>上车站点<i style="color:red;">*</i></label>
                                 <input type="text" id="fsczd" readonly value="${itme_c[i].fsczd}"/> 
                             </div>
                              <div class="mui-col-xs-4" style="display:flex;">
                                 <label>乘车类型<i style="color:red;">*</i></label>
                                 <input type="text" id="fczlx" readonly value="${itme_c[i].fczlx}"/>   
                              </div>
                         </div>
                    </div>
                `;
        $("#mxlist").append(li);
    }

}

function nodeControllerExp(NodeName) {
    if (String(NodeName).match('开始') != null) {
        $("#mxlist").find('span').each(function () {
            $(this).show();
        });
        $("#mxlist").find('input').each(function () {
            $(this).removeAttr('readonly');
        });
        tapEvent();
        $("#ftel").removeAttr('readonly');
    }
}

class Mx {
    constructor(fssjt, fssgs, fssbm, fname, fckh, fccxl, fsczd, fczlx) {
        this.fssjt = fssjt;
        this.fssgs = fssgs;
        this.fssbm = fssbm;
        this.fname = fname;
        this.fckh = fckh;
        this.fccxl = fccxl;
        this.fsczd = fsczd;
        this.fczlx = fczlx;

    }
}


function Save() {

    var ftbr = $("#ftbr").val();
    var fdate = $("#fdate").val();
    var fssgs = $("#fssgs").val();
    var ftel = $("#ftel").val();
    var fyear = $("#fyear").val();
    var fmonth = $("#fmonth").val();
    if (!ftel) {
        mui.toast('请填写联系方式');
        return;
    }
    if (!fyear) {
        mui.toast('请选择提报年份');
        return;
    }
    if (!fmonth) {
        mui.toast('请选择提报月份');
        return;
    }

    var mxlistArr = [];
    $("#mxlist").find("#mx").each(function () {
        var fssjt = $(this).find("#fssjt").val();
        var fssgs = $(this).find("#fssgs").val();
        var fssbm = $(this).find("#fssbm").val();
        var fname = $(this).find("#fname").val();
        var fckh = $(this).find("#fckh").val();
        var fccxl = $(this).find("#fccxl").val();
        var fsczd = $(this).find("#fsczd").val();
        var fczlx = $(this).find("#fczlx").val();

        var mx = new Mx(fssjt, fssgs, fssbm, fname, fckh, fccxl, fsczd, fczlx);
        mxlistArr.push(mx);

    });

    var btnArry = ["取消", "确定"];
    mui.confirm('即将提交，是否确定？', '提交确认提醒', btnArry, function (e) {
        if (e.index == 1) {
            var xml = `<?xml version="1.0"?>
                        <XForm>
                            <Header>
                                <Method>Post</Method>
                                <ProcessName>集团公司员工月末乘坐班车线路提报</ProcessName>
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
                    <BPM_WGJTYGYMBCLXTB_A>
                        <ftbr>${ftbr}</ftbr>
                        <fdate>${fdate}</fdate>
                        <fssgs>${fssgs}</fssgs>
                        <ftel>${ftel}</ftel>
                        <fyear>${fyear}</fyear>
                        <fmonth>${fmonth}</fmonth>
                        <fmbfj>201609200116</fmbfj>
                        <flxfj></flxfj>
                    </BPM_WGJTYGYMBCLXTB_A>
                   `;
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `
                           <BPM_WGJTYGYMBCLXTB_B>
                                <RelationRowGuid>${i+1}</RelationRowGuid>
                                <RowPrimaryKeys></RowPrimaryKeys>
                                <fentryno>${i + 1}</fentryno>
                                <fssjt>${mxlistArr[i].fssjt}</fssjt>
                                <fssgs>${mxlistArr[i].fssgs}</fssgs>
                                <fssbm>${mxlistArr[i].fssbm}</fssbm>
                                <fname>${mxlistArr[i].fname}</fname>
                                <fckh>${mxlistArr[i].fckh}</fckh>
                                <fccxl>${mxlistArr[i].fccxl}</fccxl>
                                <fsczd>${mxlistArr[i].fsczd}</fsczd>
                                <fczlx>${mxlistArr[i].fczlx}</fczlx>
                            </BPM_WGJTYGYMBCLXTB_B>
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

    var ftbr = $("#ftbr").val();
    var fdate = $("#fdate").val();
    var fssgs = $("#fssgs").val();
    var ftel = $("#ftel").val();
    var fyear = $("#fyear").val();
    var fmonth = $("#fmonth").val();
    if (!ftel) {
        mui.toast('请填写联系方式');
        return;
    }
    if (!fyear) {
        mui.toast('请选择提报年份');
        return;
    }
    if (!fmonth) {
        mui.toast('请选择提报月份');
        return;
    }

    var mxlistArr = [];
    $("#mxlist").find("#mx").each(function () {
        var fssjt = $(this).find("#fssjt").val();
        var fssgs = $(this).find("#fssgs").val();
        var fssbm = $(this).find("#fssbm").val();
        var fname = $(this).find("#fname").val();
        var fckh = $(this).find("#fckh").val();
        var fccxl = $(this).find("#fccxl").val();
        var fsczd = $(this).find("#fsczd").val();
        var fczlx = $(this).find("#fczlx").val();

        var mx = new Mx(fssjt, fssgs, fssbm, fname, fckh, fccxl, fsczd, fczlx);
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
                           <FormData>
                       `;
            xml += `
                    <BPM_WGJTYGYMBCLXTB_A>
                        <ftbr>${ftbr}</ftbr>
                        <fdate>${fdate}</fdate>
                        <fssgs>${fssgs}</fssgs>
                        <ftel>${ftel}</ftel>
                        <fyear>${fyear}</fyear>
                        <fmonth>${fmonth}</fmonth>
                        <fmbfj>201609200116</fmbfj>
                        <flxfj></flxfj>
                    </BPM_WGJTYGYMBCLXTB_A>
                   `;
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `
                           <BPM_WGJTYGYMBCLXTB_B>
                                <RelationRowGuid>${i + 1}</RelationRowGuid>
                                <RowPrimaryKeys></RowPrimaryKeys>
                                <fentryno>${i + 1}</fentryno>
                                <fssjt>${mxlistArr[i].fssjt}</fssjt>
                                <fssgs>${mxlistArr[i].fssgs}</fssgs>
                                <fssbm>${mxlistArr[i].fssbm}</fssbm>
                                <fname>${mxlistArr[i].fname}</fname>
                                <fckh>${mxlistArr[i].fckh}</fckh>
                                <fccxl>${mxlistArr[i].fccxl}</fccxl>
                                <fsczd>${mxlistArr[i].fsczd}</fsczd>
                                <fczlx>${mxlistArr[i].fczlx}</fczlx>
                            </BPM_WGJTYGYMBCLXTB_B>
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

    var ftbr = $("#ftbr").val();
    var fdate = $("#fdate").val();
    var fssgs = $("#fssgs").val();
    var ftel = $("#ftel").val();
    var fyear = $("#fyear").val();
    var fmonth = $("#fmonth").val();
   

    var mxlistArr = [];
    $("#mxlist").find("#mx").each(function () {
        var fssjt = $(this).find("#fssjt").val();
        var fssgs = $(this).find("#fssgs").val();
        var fssbm = $(this).find("#fssbm").val();
        var fname = $(this).find("#fname").val();
        var fckh = $(this).find("#fckh").val();
        var fccxl = $(this).find("#fccxl").val();
        var fsczd = $(this).find("#fsczd").val();
        var fczlx = $(this).find("#fczlx").val();

        var mx = new Mx(fssjt, fssgs, fssbm, fname, fckh, fccxl, fsczd, fczlx);
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
                    <BPM_WGJTYGYMBCLXTB_A>
                        <ftbr>${ftbr}</ftbr>
                        <fdate>${fdate}</fdate>
                        <fssgs>${fssgs}</fssgs>
                        <ftel>${ftel}</ftel>
                        <fyear>${fyear}</fyear>
                        <fmonth>${fmonth}</fmonth>
                        <fmbfj>201609200116</fmbfj>
                        <flxfj></flxfj>
                    </BPM_WGJTYGYMBCLXTB_A>
                   `;
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `
                           <BPM_WGJTYGYMBCLXTB_B>
                                <RelationRowGuid>${i + 1}</RelationRowGuid>
                                <RowPrimaryKeys>itemid=${itemidArr[i]}</RowPrimaryKeys>
                                <fentryno>${i + 1}</fentryno>
                                <fssjt>${mxlistArr[i].fssjt}</fssjt>
                                <fssgs>${mxlistArr[i].fssgs}</fssgs>
                                <fssbm>${mxlistArr[i].fssbm}</fssbm>
                                <fname>${mxlistArr[i].fname}</fname>
                                <fckh>${mxlistArr[i].fckh}</fckh>
                                <fccxl>${mxlistArr[i].fccxl}</fccxl>
                                <fsczd>${mxlistArr[i].fsczd}</fsczd>
                                <fczlx>${mxlistArr[i].fczlx}</fczlx>
                            </BPM_WGJTYGYMBCLXTB_B>
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
                    <BPM_WGJTYGYMBCLXTB_A>
                        <ftbr>${ftbr}</ftbr>
                        <fdate>${fdate}</fdate>
                        <fssgs>${fssgs}</fssgs>
                        <ftel>${ftel}</ftel>
                        <fyear>${fyear}</fyear>
                        <fmonth>${fmonth}</fmonth>
                        <fmbfj>201609200116</fmbfj>
                        <flxfj></flxfj>
                    </BPM_WGJTYGYMBCLXTB_A>
                   `;
        for (var i = 0; i < mxlistArr.length; i++) {
            xml += `
                           <BPM_WGJTYGYMBCLXTB_B>
                                <RelationRowGuid>${i + 1}</RelationRowGuid>
                                <RowPrimaryKeys>itemid=${itemidArr[i]}</RowPrimaryKeys>
                                <fentryno>${i + 1}</fentryno>
                                <fssjt>${mxlistArr[i].fssjt}</fssjt>
                                <fssgs>${mxlistArr[i].fssgs}</fssgs>
                                <fssbm>${mxlistArr[i].fssbm}</fssbm>
                                <fname>${mxlistArr[i].fname}</fname>
                                <fckh>${mxlistArr[i].fckh}</fckh>
                                <fccxl>${mxlistArr[i].fccxl}</fccxl>
                                <fsczd>${mxlistArr[i].fsczd}</fsczd>
                                <fczlx>${mxlistArr[i].fczlx}</fczlx>
                            </BPM_WGJTYGYMBCLXTB_B>
                        `;

        }
        xml += `
                       </FormData>
                    </XForm>
                   `;
        PostXml(xml);
    }
}