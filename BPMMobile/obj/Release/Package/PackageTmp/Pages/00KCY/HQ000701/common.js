function prepMsg() {
    $("#fdate").val(getNowFormatDate(2));
    tapEvent();
    var xml = `<?xml version= "1.0" ?>
                  <Requests>
                      <Params>
                      <Method>GetFormPostData</Method>
                      <ProcessName>集团公司食堂临时就餐申请</ProcessName>
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
        //console.log(item);
        $("#fname").val(item.ffqr);
        $("#fgroup").val(item.fssgs);
        $("#fcompany").val(item.fssjt);
    }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
        if (XMLHttpRequest.status == "401") {
            mui.alert('授权过期，请重新打开页面');;
        } else if (XMLHttpRequest.status == "500") {
            mui.alert('服务器内部错误');
        }

    });
   
}


function tapEvent() {
    var fcbdata = [
        {
            value: '',
            text: '早餐'
        },
        {
            value: '',
            text: '午餐'
        },
        {
            value: '',
            text: '晚餐'
        },
        {
            value: '',
            text: '夜餐'
        },
        {
            value: '',
            text: '包间点餐（午餐）'
        },
        {
            value: '',
            text: '特殊节日午餐'
        },
        {
            value: '',
            text: '特殊节日晚餐'
        },
        {
            value: '',
            text: '饺子馆点餐'
        }
    ];
   


    var opidArr = [];
    $("#tjmx").on('tap', () => {
        XuntongJSBridge.call('selectPerson', { 'pType': '1' }, function (result) {

            if (String(Object.prototype.toString.call(result)).match('String') != null) {
                result = JSON.parse(result);
            }

            if (result.success == true || result.success == "true") {

                for (var i = 0; i < result.data.persons.length; i++) {

                    opidArr.push(result.data.persons[i].openId);

                }
                var getPerInfo= $.ajax({
                    type: "POST",
                    url: "/api/bpm/PostAccount",
                    data: { "ids": opidArr },
                    beforeSend: function (XHR) {
                        XHR.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem('ticket'));
                    }
                }).done((data) => {
                    console.info(data);                    
                }).fail((e) => {
                     console.error(e);
                 });

                getPerInfo.then((data) => {

                    var xml = `<?xml version= "1.0" ?>
                                 <Requests>
                                 <Params>
                                 <DataSource>PS</DataSource>
                                 <ID>erpcloud_公用_获取个人信息</ID>
                                 <Type>1</Type>
                                 <Method>GetUserDataProcedure</Method>
                                 <ProcedureName>erpcloud_公用_获取个人信息</ProcedureName>
                                 <Filter><fno>${data.data[0].phone}</fno></Filter>
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
                      
                        var pio = provideData.Tables[0].Rows[0];

                        console.info(pio);

                        var li = `<div id="mx" class="mui-card">
                                     <div class="mui-input-row itemtitle">
                                        <label>明细列表项</label>
                                        <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>
                                     </div>
                                     <div class="mui-row cutOffLine">
                                         <div class="mui-col-xs-6" style="display:flex;">
                                             <label>申请人<i style="color:red;">*</i></label>
                                             <input type="text" id="fsqr" value="${pio.NAME}"/>
                                         </div>
                                         <div class="mui-col-xs-6" style="display:flex;">
                                             <label>申请公司</label> 
                                             <input type="text" id="fsqgs" value="${pio.fdeptname}"/> 
                                         </div>     
                                     </div> 
                                     <div class="mui-row cutOffLine">
                                          <div class="mui-col-xs-6" style="display:flex;">
                                             <label>申请人手机号<i style="color:red;">*</i></label>  
                                             <input type="tel" id="fsqrsjh" placeholder="请填写申请人手机号"/>
                                          </div>
                                          <div class="mui-col-xs-6" style="display:flex;">
                                              <label>就餐时间<i style="color:red;">*</i></label>
                                              <input type="datetime-local" id="fjcsj" />   
                                          </div>
                                     </div> 
                                     <div class="mui-row cutOffLine">
                                           <div class="mui-col-xs-3" style="display:flex;">
                                               <label>人数<i style="color:red;">*</i></label>
                                               <input type="number" id="fjcrs" placeholder="请填写"/>
                                           </div>
                                           <div class="mui-col-xs-3" style="display:flex;">
                                               <label>餐别<i style="color:red;">*</i></label>
                                               <input type="text" id="fcb" placeholder="请选择" readonly />
                                           </div>
                                            <div class="mui-col-xs-3" style="display:flex;">
                                               <label>餐标<i style="color:red;">*</i></label>
                                               <input type="number" id="fcz" placeholder="请输入"  />
                                           </div>
                                             <div class="mui-col-xs-3" style="display:flex;">
                                               <label>金额</label>
                                               <input type="number" id="fje"  />
                                           </div>  
                                     </div> 
                                     <div class="mui-row">
                                         <div class="mui-col-xs-12" style="display:flex;">
                                             <label>事由<i style="color:red;">*</i></label>
                                             <textarea rows="2" id="fjcsy" placeholder="请填写就餐事由"></textarea>
                                         </div>  
                                      </div> 
                                 </div>
                        `;
                        $("#mxlist").append(li);
                        var picker2 = new mui.PopPicker();

                        picker2.setData(fcbdata);

                        $("#mxlist").find("#fcb").each(function () {
                            var self = this;
                            $(this).off('tap');
                            $(this).on('tap', function () {

                                picker.show(function (items) {
                                    self.value = (items[0].text);
                                    var fst = $("#fcjst").val();
                                    if (String(fst).match('大食堂') != null) {
                                        if (String(items[0].text).match('早餐') != null) {
                                            $(self).parent().parent().find("#fcz").val(3.00);

                                        } else if (String(items[0].text).match('午餐') != null) {
                                            $(self).parent().parent().find("#fcz").val(5.50);

                                        } else if (String(items[0].text).match('晚餐') != null) {
                                            $(self).parent().parent().find("#fcz").val(4.50);

                                        } else if (String(items[0].text).match('夜餐') != null) {
                                            $(self).parent().parent().find("#fcz").val(5.50);

                                        }

                                    } else if (String(fst).match('小食堂') != null){
                                        if (String(items[0].text).match('午餐') != null) {
                                            $(self).parent().parent().find("#fcz").val(12.00);
                                        }
                                    }
                                    calcMoney(self);
                                });
                            });
                        });

                    }).fail((e) => {


                    });

                });
            }
        });
    });

    var fcjstdata = [
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
            text:'三号门大食堂'
        },
        {
            value: '',
            text:'三号门小食堂'
        }
    ];

    var element = document.getElementById('fcjst');
    var picker = new mui.PopPicker();
    picker.setData(fcjstdata);
    element.addEventListener('tap', function () {

        picker.show(function (items) {

            element.value = items[0].text;
            $("#mxlist").find("#fcb").each(function () {
                var fcb = $(this).val();
                if (String(fcb).match('早餐') != null) {
                    if (String(items[0].text).match('大食堂') != null) {
                        $(this).parent().parent().find("#fcz").val(3.00);
                    }

                } else if (String(fcb).match('午餐') != null) {
                    if (String(items[0].text).match('大食堂') != null) {
                        $(this).parent().parent().find("#fcz").val(5.50);
                    } else if (String(items[0].text).match('小食堂') != null){
                        $(this).parent().parent().find("#fcz").val(12.00);
                    }
                } else if (String(fcb).match('晚餐') != null) {
                    if (String(items[0].text).match('大食堂') != null) {
                        $(this).parent().parent().find("#fcz").val(4.50);
                    }
                } else if (String(fcb).match('夜餐') != null) {
                    if (String(items[0].text).match('大食堂') != null) {
                        $(this).parent().parent().find("#fcz").val(5.50);
                    }
                }
                calcMoney(this);
            });
        });

    }, false);


    
   
}
function calcMoney(context) {
    var fjcrs = parseFloat($(context).parent().parent().parent().find("#fjcrs").val());
    var fje = 0;
    var fcz = parseFloat($(context).parent().parent().parent().find("#fcz").val());
    fje = fcz * fjcrs;
    $(context).parent().parent().parent().find("#fje").val(fje);
    calcTotal();
}
function calcTotal() {
    var frs_total = 0;
    var fje_total = 0;

    $("#mxlist").find("#mx").each(function () {
        var fjcrs = parseFloat($(this).find("#fjcrs").val());
        var fje = parseFloat($(this).find("#fje").val());
        fjcrs = isNaN(fjcrs) ? 0 : fjcrs;
        fje = isNaN(fje) ? 0 : fje;
        frs_total += fjcrs;
        fje_total += fje;
    });
    $("#frs_total").val(frs_total);
    $("#fje_total").val(fje_total);

}

function initData(data, flag) {
    var item = data.FormDataSet.BPM_WGJTLSJCSQ_A[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.fbillno);
    }
    $("#fname").val(item.ffqr);
    $("#fdate").val(FormatterTimeYMS(item.ffqrq));
    $("#ftel").val(item.flxfs);
    $("#fgroup").val(item.fssjt);
    $("#fcompany").val(item.fssgs);
    $("#fcjst").val(item.fjc_st);
    $("#frs_total").val(item.fhj_rs);
    $("#fje_total").val(item.fhj_je);
    var item_c = data.FormDataSet.BPM_WGJTLSJCSQ_B;
    for (var i = 0; i < item_c.length; i++) {
        itemidArr.push(item_c[i].itemid);
        var li = `<div id="mx" class="mui-card">
                                     <div class="mui-input-row itemtitle">
                                        <label>明细列表项</label>
                                        <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>
                                     </div>
                                     <div class="mui-row cutOffLine">
                                         <div class="mui-col-xs-6" style="display:flex;">
                                             <label>申请人<i style="color:red;">*</i></label>
                                             <input type="text" id="fsqr" value="${item_c[i].fsqr}" readonly/>
                                         </div>
                                         <div class="mui-col-xs-6" style="display:flex;">
                                             <label>申请公司</label> 
                                             <input type="text" id="fsqgs" value="${item_c[i].fsqgs}" readonly/> 
                                         </div>     
                                     </div> 
                                     <div class="mui-row cutOffLine">
                                          <div class="mui-col-xs-6" style="display:flex;">
                                             <label>申请人手机号<i style="color:red;">*</i></label>  
                                             <input type="tel" id="fsqrsjh" value="${item_c[i].fsjh}" readonly/>
                                          </div>
                                          <div class="mui-col-xs-6" style="display:flex;">
                                              <label>就餐时间<i style="color:red;">*</i></label>
                                              <input type="datetime-local" id="fjcsj" value="${item_c[i].fjc_sj}" readonly/>   
                                          </div>
                                     </div> 
                                     <div class="mui-row cutOffLine">
                                           <div class="mui-col-xs-3" style="display:flex;">
                                               <label>人数<i style="color:red;">*</i></label>
                                               <input type="number" id="fjcrs"  value="${item_c[i].fjc_rs}" readonly/>
                                           </div>
                                           <div class="mui-col-xs-3" style="display:flex;">
                                               <label>餐别<i style="color:red;">*</i></label>
                                               <input type="text" id="fcb" value="${item_c[i].fcb}" readonly />
                                           </div>
                                            <div class="mui-col-xs-3" style="display:flex;">
                                               <label>餐标<i style="color:red;">*</i></label>
                                               <input type="number" id="fcz" value="${item_c[i].fcbiao}" readonly  />
                                           </div>
                                             <div class="mui-col-xs-3" style="display:flex;">
                                               <label>金额</label>
                                               <input type="number" id="fje"  value="${item_c[i].fje}" readonly />
                                           </div>  
                                     </div> 
                                     <div class="mui-row">
                                         <div class="mui-col-xs-12" style="display:flex;">
                                             <label>事由<i style="color:red;">*</i></label>
                                             <textarea rows="2" id="fjcsy" readonly>${item_c[i].fjcsy}</textarea>
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
        var picker2 = new mui.PopPicker();

        picker2.setData(fcbdata);

        $("#mxlist").find("#fcb").each(function () {
            var self = this;
            $(this).off('tap');
            $(this).on('tap', function () {

                picker.show(function (items) {
                    self.value = (items[0].text);
                    var fst = $("#fcjst").val();
                    if (String(fst).match('大食堂') != null) {
                        if (String(items[0].text).match('早餐') != null) {
                            $(self).parent().parent().find("#fcz").val(3.00);

                        } else if (String(items[0].text).match('午餐') != null) {
                            $(self).parent().parent().find("#fcz").val(5.50);

                        } else if (String(items[0].text).match('晚餐') != null) {
                            $(self).parent().parent().find("#fcz").val(4.50);

                        } else if (String(items[0].text).match('夜餐') != null) {
                            $(self).parent().parent().find("#fcz").val(5.50);

                        }

                    } else if (String(fst).match('小食堂') != null) {
                        if (String(items[0].text).match('午餐') != null) {
                            $(self).parent().parent().find("#fcz").val(12.00);
                        }
                    }
                    calcMoney(self);
                });
            });
        });
        tapEvent();
        $("#mxlist").find('input,textarea').each(function () {
            $(this).removeAttr('readonly');
        });
        $("#ftel").removeAttr('readonly');
    }
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
class Mx {
    constructor(fsqr, fsqgs, fsqrsjh, fjcsj, fjcrs, fcb, fcz, fje, fjcsy) {
        this.fsqr = fsqr;
        this.fsqgs = fsqgs;
        this.fsqrsjh = fsqrsjh;
        this.fjcsj = fjcsj;
        this.fjcrs = fjcrs;
        this.fcb = fcb;
        this.fcz = fcz;
        this.fje = fje;
        this.fjcsy = fjcsy;

    }
    check() {
        if (!this.fsqr) {
            mui.toast('请填写申请人');
            return true;
        }
        if (!this.fsqrsjh) {
            mui.toast('请填写申请人手机号');
            return true;
        }
        if (!this.fjcsj) {
            mui.toast('请填写就餐时间');
            return true;
        }
        if (!this.fjcrs) {
            mui.toast('请填写就餐人数');
            return true;
        }
        if (!this.fcb) {
            mui.toast('请选择餐别');
            return true;
        }
        if (!this.fcz) {
            mui.toast('请填写餐标');
            return true;
        }
        if (!this.fjcsy) {
            mui.toast('请填写就餐事由');
            return true;
        }
        return false;
    }
}
function Save() {

    var fname = $("#fname").val();
    var fdate = $("#fdate").val();
    var ftel = $("#ftel").val();
    var fgroup = $("#fgroup").val();
    var fcompany = $("#fcompany").val();
    var fcjst = $("#fcjst").val();
    var frs_total = $("#frs_total").val();
    var fje_total = $("#fje_total").val();

    if (!ftel) {
        mui.toast('请填写联系方式');
        return;
    }
    if (!fcjst) {
        mui.toast('请选择就餐食堂');
        return;
    }



    var mxlistArr = [];
    var mxflag = false;

    $("#mxlist").find("#mx").each(function () {
        var fsqr = $(this).find("#fsqr").val();
        var fsqgs = $(this).find("#fsqgs").val();
        var fsqrsjh = $(this).find("#fsqrsjh").val();
        var fjcsj = $(this).find("#fjcsj").val();
        var fjcrs = $(this).find("#fjcrs").val();
        var fcb = $(this).find("#fcb").val();
        var fcz = $(this).find("#fcz").val();
        var fje = $(this).find("#fje").val();
        var fjcsy = $(this).find("#fjcsy").val();
       
        var mx = new Mx(fsqr, fsqgs, fsqrsjh, fjcsj, fjcrs, fcb, fcz, fje, fjcsy);
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
                                <ProcessName>集团公司食堂临时就餐申请</ProcessName>
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
                      <BPM_WGJTLSJCSQ_A>
                        <fbillno>自动生成</fbillno>
                        <ffqr>${fname}</ffqr>
                        <ffqrq>${fdate}</ffqrq>
                        <flxfs>${ftel}</flxfs>
                        <fssjt>${fgroup}</fssjt>
                        <fssgs>${fcompany}</fssgs>
                        <fjc_st>${fcjst}</fjc_st>
                        <fhj_rs>${frs_total}</fhj_rs>
                        <fhj_je>${fje_total}</fhj_je>
                    </BPM_WGJTLSJCSQ_A>
                   `;
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `
                         <BPM_WGJTLSJCSQ_B>
                            <RelationRowGuid>${i+1}</RelationRowGuid>
                            <RowPrimaryKeys></RowPrimaryKeys>
                            <fsqr>${mxlistArr[i].fsqr}</fsqr>
                            <fsqgs>${mxlistArr[i].fsqgs}</fsqgs>
                            <fsjh>${mxlistArr[i].fsqrsjh}</fsjh>
                            <fjc_sj>${mxlistArr[i].fjcsj}</fjc_sj>
                            <fjc_rs>${mxlistArr[i].fjcrs}</fjc_rs>
                            <fcb>${mxlistArr[i].fcb}</fcb>
                            <fcbiao>${mxlistArr[i].fcz}</fcbiao>
                            <fje>${mxlistArr[i].fje}</fje>
                            <fjcsy>${mxlistArr[i].fjcsy}</fjcsy>
                        </BPM_WGJTLSJCSQ_B>
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
    var ftel = $("#ftel").val();
    var fgroup = $("#fgroup").val();
    var fcompany = $("#fcompany").val();
    var fcjst = $("#fcjst").val();
    var frs_total = $("#frs_total").val();
    var fje_total = $("#fje_total").val();

    if (!ftel) {
        mui.toast('请填写联系方式');
        return;
    }
    if (!fcjst) {
        mui.toast('请选择就餐食堂');
        return;
    }
   

    var mxlistArr = [];
    var mxflag = false;

    $("#mxlist").find("#mx").each(function () {
        var fsqr = $(this).find("#fsqr").val();
        var fsqgs = $(this).find("#fsqgs").val();
        var fsqrsjh = $(this).find("#fsqrsjh").val();
        var fjcsj = $(this).find("#fjcsj").val();
        var fjcrs = $(this).find("#fjcrs").val();
        var fcb = $(this).find("#fcb").val();
        var fcz = $(this).find("#fcz").val();
        var fje = $(this).find("#fje").val();
        var fjcsy = $(this).find("#fjcsy").val();

        var mx = new Mx(fsqr, fsqgs, fsqrsjh, fjcsj, fjcrs, fcb, fcz, fje, fjcsy);
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
                      <BPM_WGJTLSJCSQ_A>
                        <fbillno>${fbillno}</fbillno>
                        <ffqr>${fname}</ffqr>
                        <ffqrq>${fdate}</ffqrq>
                        <flxfs>${ftel}</flxfs>
                        <fssjt>${fgroup}</fssjt>
                        <fssgs>${fcompany}</fssgs>
                        <fjc_st>${fcjst}</fjc_st>
                        <fhj_rs>${frs_total}</fhj_rs>
                        <fhj_je>${fje_total}</fhj_je>
                    </BPM_WGJTLSJCSQ_A>
                   `;
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `
                         <BPM_WGJTLSJCSQ_B>
                            <RelationRowGuid>${i + 1}</RelationRowGuid>
                            <RowPrimaryKeys></RowPrimaryKeys>
                            <fsqr>${mxlistArr[i].fsqr}</fsqr>
                            <fsqgs>${mxlistArr[i].fsqgs}</fsqgs>
                            <fsjh>${mxlistArr[i].fsqrsjh}</fsjh>
                            <fjc_sj>${mxlistArr[i].fjcsj}</fjc_sj>
                            <fjc_rs>${mxlistArr[i].fjcrs}</fjc_rs>
                            <fcb>${mxlistArr[i].fcb}</fcb>
                            <fcbiao>${mxlistArr[i].fcz}</fcbiao>
                            <fje>${mxlistArr[i].fje}</fje>
                            <fjcsy>${mxlistArr[i].fjcsy}</fjcsy>
                        </BPM_WGJTLSJCSQ_B>
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
    var ftel = $("#ftel").val();
    var fgroup = $("#fgroup").val();
    var fcompany = $("#fcompany").val();
    var fcjst = $("#fcjst").val();
    var frs_total = $("#frs_total").val();
    var fje_total = $("#fje_total").val();

    var mxlistArr = [];
    var mxflag = false;

    $("#mxlist").find("#mx").each(function () {
        var fsqr = $(this).find("#fsqr").val();
        var fsqgs = $(this).find("#fsqgs").val();
        var fsqrsjh = $(this).find("#fsqrsjh").val();
        var fjcsj = $(this).find("#fjcsj").val();
        var fjcrs = $(this).find("#fjcrs").val();
        var fcb = $(this).find("#fcb").val();
        var fcz = $(this).find("#fcz").val();
        var fje = $(this).find("#fje").val();
        var fjcsy = $(this).find("#fjcsy").val();

        var mx = new Mx(fsqr, fsqgs, fsqrsjh, fjcsj, fjcrs, fcb, fcz, fje, fjcsy);
      
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
                      <BPM_WGJTLSJCSQ_A>
                        <fbillno>${fbillno}</fbillno>
                        <ffqr>${fname}</ffqr>
                        <ffqrq>${fdate}</ffqrq>
                        <flxfs>${ftel}</flxfs>
                        <fssjt>${fgroup}</fssjt>
                        <fssgs>${fcompany}</fssgs>
                        <fjc_st>${fcjst}</fjc_st>
                        <fhj_rs>${frs_total}</fhj_rs>
                        <fhj_je>${fje_total}</fhj_je>
                    </BPM_WGJTLSJCSQ_A>
                   `;
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `
                         <BPM_WGJTLSJCSQ_B>
                            <RelationRowGuid>${i + 1}</RelationRowGuid>
                            <RowPrimaryKeys>itemid=${itemidArr[i]}</RowPrimaryKeys>
                            <fsqr>${mxlistArr[i].fsqr}</fsqr>
                            <fsqgs>${mxlistArr[i].fsqgs}</fsqgs>
                            <fsjh>${mxlistArr[i].fsqrsjh}</fsjh>
                            <fjc_sj>${mxlistArr[i].fjcsj}</fjc_sj>
                            <fjc_rs>${mxlistArr[i].fjcrs}</fjc_rs>
                            <fcb>${mxlistArr[i].fcb}</fcb>
                            <fcbiao>${mxlistArr[i].fcz}</fcbiao>
                            <fje>${mxlistArr[i].fje}</fje>
                            <fjcsy>${mxlistArr[i].fjcsy}</fjcsy>
                        </BPM_WGJTLSJCSQ_B>
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
                      <BPM_WGJTLSJCSQ_A>
                        <fbillno>${fbillno}</fbillno>
                        <ffqr>${fname}</ffqr>
                        <ffqrq>${fdate}</ffqrq>
                        <flxfs>${ftel}</flxfs>
                        <fssjt>${fgroup}</fssjt>
                        <fssgs>${fcompany}</fssgs>
                        <fjc_st>${fcjst}</fjc_st>
                        <fhj_rs>${frs_total}</fhj_rs>
                        <fhj_je>${fje_total}</fhj_je>
                    </BPM_WGJTLSJCSQ_A>
                   `;
        for (var i = 0; i < mxlistArr.length; i++) {
            xml += `
                         <BPM_WGJTLSJCSQ_B>
                            <RelationRowGuid>${i + 1}</RelationRowGuid>
                            <RowPrimaryKeys>itemid=${itemidArr[i]}</RowPrimaryKeys>
                            <fsqr>${mxlistArr[i].fsqr}</fsqr>
                            <fsqgs>${mxlistArr[i].fsqgs}</fsqgs>
                            <fsjh>${mxlistArr[i].fsqrsjh}</fsjh>
                            <fjc_sj>${mxlistArr[i].fjcsj}</fjc_sj>
                            <fjc_rs>${mxlistArr[i].fjcrs}</fjc_rs>
                            <fcb>${mxlistArr[i].fcb}</fcb>
                            <fcbiao>${mxlistArr[i].fcz}</fcbiao>
                            <fje>${mxlistArr[i].fje}</fje>
                            <fjcsy>${mxlistArr[i].fjcsy}</fjcsy>
                        </BPM_WGJTLSJCSQ_B>
                       `;

        }
        xml += `
                       </FormData>
                    </XForm>
                   `;
        PostXml(xml);
    }

}
