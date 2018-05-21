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


    }).fail(function (e) {

    });
 }

var if_zs_flag = true;    //是否住宿的flag，根据flag状态来控制某些字段是否编辑

function tapEvent() {

    var fif_data = [
        {
            value: '',
            text:'是'
        },
        {
            value: '',
            text:'否'
        }
    ];
    var element = document.getElementById('fif_zs');

    var picker = new mui.PopPicker();

    picker.setData(fif_data);

    element.addEventListener('tap', function () {

        picker.show(function (items) {

            element.value = items[0].text;
            if (items[0].text == '是') {
                if_zs_flag = true;
            } else if (items[0].text == '否') {
                if_zs_flag = false;
            }

        });

    }, false);

    var fzsdzdata = [
        {
            value: '',
            text: '初村5号门01#男宿舍'
        },
        {
            value: '',
            text: '初村5号门02#男宿舍'
        },
        {
            value: '',
            text: '初村5号门03#女宿舍'
        },
        {
            value: '',
            text: '初村5号门04#女宿舍'
        },
        {
            value: '',
            text: '初村5号门男大学生宿舍'
        },
        {
            value: '',
            text: '初村8号门2期女宿舍'
        },
        {
            value: '',
            text: '初村1号门3期D2男宿舍'
        },
        {
            value: '',
            text: '初村1号门3期D2女宿舍'
        },
        {
            value: '',
            text: '初村2号门3期E2男宿舍'
        },
        {
            value: '',
            text: '初村2号门3期E2女宿舍'
        },
        {
            value: '',
            text: '初村3号门3期F3女宿舍'
        },
        {
            value: '',
            text: '初村3号门3期F4男宿舍'
        }
    ];
    showPicker('fzsdd', fzsdzdata);

    $('body').on('tap', '#fif_bc', function () {

        var picker = new mui.PopPicker();
        picker.setData(fif_data);
        var self = this;
        picker.show(function (items) {
            $(self).val(items[0].text);
        });

    });

    $("#tjmx").on('tap', function () {

        var li = `
                      <div id="mx" class="mui-card">
                            <div class="mui-input-row itemtitle">
                                <label>明细列表项</label>
                                <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>
                            </div>
                            <div class="mui-row cutOffLine" style="padding:3vw;">
                                <div class="mui-col-xs-4" style="display:flex;">
                                   <label>姓名<i style="color:red;">*</i></label> 
                                   <textarea rows="2" id="fxm" placeholder="请填写"></textarea>
                                </div>                                    
                                 <div class="mui-col-xs-4" style="display:flex;">
                                    <label>性别<i style="color:red;">*</i></label>
                                    <textarea rows="2" id="fxb" readonly placeholder="请选择"></textarea>
                                 </div>   
                                 <div class="mui-col-xs-4" style="display:flex;">
                                     <label>所属公司<i style="color:red;">*</i></label>  
                                     <textarea rows="2" id="fssgs" readonly placeholder="请选择"></textarea>  
                                 </div>  
                            </div> 
                            <div class="mui-row cutOffLine" style="padding:3vw;">
                                 <div class="mui-col-xs-4" style="display:flex;">
                                     <label>身份证号码<i style="color:red;">*</i></label>
                                     <textarea rows="2" id="fsszhm" placeholder="请填写"></textarea>
                                 </div>
                                 <div class="mui-col-xs-4" style="display:flex;">
                                     <label>入职日期<i style="color:red;">*</i></label>
                                     <textarea rows="2" id="frzrq" readonly placeholder="请选择"></textarea>
                                 </div> 
                                 <div class="mui-col-xs-4" style="display:flex;">
                                      <label>是否开通班车<i style="color:red;">*</i></label>
                                      <textarea rows="2" id="fif_bc" readonly placeholder="请选择"></textarea> 
                                 </div>
                            </div> 
                            <div class="mui-row cutOffLine" style="padding:3vw;">
                                <div class="mui-col-xs-4" style="display:flex;">
                                    <label>住宿收据号<i style="color:red;">*</i></label>
                                    <textarea rows="2" id="fzssjh" readonly></textarea>
                                </div>
                                <div class="mui-col-xs-4" style="display:flex;">
                                     <label>备注</label>
                                     <textarea rows="2" id="fbz" placeholder="请填写"></textarea>  
                                </div>
                            </div> 
                       </div>
                 `;

        $("#mxlist").append(li);


    });
   

    $("#mxlist").on('tap', '#fssgs', function () {
        XuntongJSBridge.call('selectDepts', {
            'isMulti': false,
            'blacklist': [''],
            'whitelist': ['']
        }, function (result) {
            console.log(JSON.stringify(result));
        });
    });
}

function initData(data, flag) {
    var item = data.FormDataSet.BPM_WGJTYGRZSSCKBLSQ_A[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.fbillno);
    }
    $("#fname").val(item.fname);
    $("#fdate").val(FormatterTimeYMS(item.fdate));
    $("#fssgs").val(item.fssgs);
    $("#flxdh").val(item.ftel);
    $("#fif_zs").val(item.fsfzs);
    $("#fgzdz").val(item.fgzdz);
    $("#fzsdd").val(item.fzsdd);
    var item_c = data.FormDataSet.BPM_WGJTYGRZSSCKBLSQ_B;
    for (var i = 0; i < item_c.length; i++) {
        itemidArr.push(item_c[i].itemid);
        var li = `
                      <div id="mx" class="mui-card">
                            <div class="mui-input-row itemtitle">
                                <label>明细列表项</label>
                                <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>
                            </div>
                            <div class="mui-row cutOffLine" style="padding:3vw;">
                                <div class="mui-col-xs-4" style="display:flex;">
                                   <label>姓名<i style="color:red;">*</i></label> 
                                   <textarea rows="2" id="fxm" readonly>${item_c[i].fxm}</textarea>
                                </div>                                    
                                 <div class="mui-col-xs-4" style="display:flex;">
                                    <label>性别<i style="color:red;">*</i></label>
                                    <textarea rows="2" id="fxb" readonly>${item_c[i].fxb}</textarea>
                                 </div>   
                                 <div class="mui-col-xs-4" style="display:flex;">
                                     <label>所属公司<i style="color:red;">*</i></label>  
                                     <textarea rows="2" id="fssgs" readonly>${item_c[i].fssgs}</textarea>  
                                 </div>  
                            </div> 
                            <div class="mui-row cutOffLine" style="padding:3vw;">
                                 <div class="mui-col-xs-4" style="display:flex;">
                                     <label>身份证号码<i style="color:red;">*</i></label>
                                     <textarea rows="2" id="fsszhm" readonly>${item_c[i].fsfzh}</textarea>
                                 </div>
                                 <div class="mui-col-xs-4" style="display:flex;">
                                     <label>入职日期<i style="color:red;">*</i></label>
                                     <textarea rows="2" id="frzrq" readonly>${FormatterTimeYMS(item_c[i].frzrq)}</textarea >
                                 </div> 
                                 <div class="mui-col-xs-4" style="display:flex;">
                                      <label>是否开通班车<i style="color:red;">*</i></label>
                                      <textarea rows="2" id="fif_bc" readonly>${item_c[i].fsjh}</textarea> 
                                 </div>
                            </div> 
                            <div class="mui-row cutOffLine" style="padding:3vw;">
                                <div class="mui-col-xs-4" style="display:flex;">
                                    <label>住宿收据号<i style="color:red;">*</i></label>
                                    <textarea rows="2" id="fzssjh" readonly>${changeNullToEmpty(item_c[i].fzsdjh)}</textarea >
                                </div>
                                <div class="mui-col-xs-4" style="display:flex;">
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

    } else if (String(NodeName).match('宿舍管理员') != null) {
        $("#mxlist").find("#fzssjh").each(function () {
            $(this).removeAttr('readonly');
        });
    }
}

//function test() {
//    $("#fzsdd").showCityPicker({
//        targetEle: 'fzsdd',         //目标元素
//        isDelegate: false,    //是否事件代理，true为是，false为否
//        cityId: 'fgzdz',           //城市元素id
//        proId: 'fzsdd'              //省份id  
//    });
//}



class Mx {
    constructor(fxm, fxb, fssgs, fsszhm, frzrq, fif_bc, fzssjh, fbz) {
        this.fxm = fxm;
        this.fxb = fxb;
        this.fssgs = fssgs;
        this.fsszhm = fsszhm;
        this.frzrq = frzrq;
        this.fif_bc = fif_bc;
        this.fzssjh = fzssjh;
        this.fbz = fbz;
    }
}
function checkNes() {
    var nodeName = $("#nodeName").val();
    if (String(nodeName).match('宿舍管理员') != null) {
        var flag = true;
        $("#mxlist").find("#fzssjh").each(function () {
            if (!$(this).val()) {
                flag = false;
                return; 
            }
        });
        return flag;
    }
    return true;
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
    var flxdh = $("#flxdh").val();
    var fif_zs = $("#fif_zs").val();
    var fgzdz = $("#fgzdz").val();
    var fzsdd = $("#fzsdd").val();

    var mxlistArr = [];
    var mxflag = false;
    $("#mxlist").find("#mx").each(function () {
        var fxm = $(this).find("#fxm").val();
        var fxb = $(this).find("#fxb").val();
        var fssgs = $(this).find("#fssgs").val();
        var fsszhm = $(this).find("#fsszhm").val();
        var frzrq = $(this).find("#frzrq").val();
        var fif_bc = $(this).find("#fif_bc").val();
        var fzssjh = $(this).find("#fzssjh").val();

        var mx = new Mx(fxm, fxb, fssgs, fsszhm, frzrq, fif_bc, fzssjh, fbz);
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
                     <BPM_WGJTYGRZSSCKBLSQ_A>
                        <fbillno>${fbillno}</fbillno>
                        <fname>${fname}</fname>
                        <fdate>${fdate}</fdate>
                        <fssgs>${fssgs}</fssgs>
                        <ftel>${flxdh}</ftel>
                        <fsfzs>${fif_zs}</fsfzs>
                        <fgzdz>${fgzdz}</fgzdz>
                        <fzsdd>${fzsdd}</fzsdd>
                    </BPM_WGJTYGRZSSCKBLSQ_A>
                    `;
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `
                    <BPM_WGJTYGRZSSCKBLSQ_B>
                        <RelationRowGuid>${i + 1}</RelationRowGuid>
                        <RowPrimaryKeys>itemid=${itemidArr[i]}</RowPrimaryKeys>
                        <fentryno>${i + 1}</fentryno>
                        <fxm>${mxlistArr[i].fxm}</fxm>
                        <fxb>${mxlistArr[i].fxb}</fxb>
                        <fssgs>${mxlistArr[i].fssgs}</fssgs>
                        <fsfzh>${mxlistArr[i].fsszhm}</fsfzh>
                        <frzrq>${mxlistArr[i].frzrq}</frzrq>
                        <fsjh>${mxlistArr[i].fif_bc}</fsjh>
                        <fzsdjh>${mxlistArr[i].fzssjh}</fzsdjh>
                        <fbz>${mxlistArr[i].fbz}</fbz>
                    </BPM_WGJTYGRZSSCKBLSQ_B>
                         
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
                     <BPM_WGJTYGRZSSCKBLSQ_A>
                        <fbillno>${fbillno}</fbillno>
                        <fname>${fname}</fname>
                        <fdate>${fdate}</fdate>
                        <fssgs>${fssgs}</fssgs>
                        <ftel>${flxdh}</ftel>
                        <fsfzs>${fif_zs}</fsfzs>
                        <fgzdz>${fgzdz}</fgzdz>
                        <fzsdd>${fzsdd}</fzsdd>
                    </BPM_WGJTYGRZSSCKBLSQ_A>
                    `;
        for (var i = 0; i < mxlistArr.length; i++) {
            xml += `
                    <BPM_WGJTYGRZSSCKBLSQ_B>
                        <RelationRowGuid>${i + 1}</RelationRowGuid>
                        <RowPrimaryKeys>itemid=${itemidArr[i]}</RowPrimaryKeys>
                        <fentryno>${i + 1}</fentryno>
                        <fxm>${mxlistArr[i].fxm}</fxm>
                        <fxb>${mxlistArr[i].fxb}</fxb>
                        <fssgs>${mxlistArr[i].fssgs}</fssgs>
                        <fsfzh>${mxlistArr[i].fsszhm}</fsfzh>
                        <frzrq>${mxlistArr[i].frzrq}</frzrq>
                        <fsjh>${mxlistArr[i].fif_bc}</fsjh>
                        <fzsdjh>${mxlistArr[i].fzssjh}</fzsdjh>
                        <fbz>${mxlistArr[i].fbz}</fbz>
                    </BPM_WGJTYGRZSSCKBLSQ_B>
                         
                        `;
        }
        xml += `
                       </FormData>
                    </XForm>
                   `;
        PostXml(xml);
    }

}