function prepMsg() {
    $("#fdate").val(getNowFormatDate(2));
    tapEvent();
    var xml = '<?xml version= "1.0" ?>';
    xml = xml + '   <Requests>';
    xml = xml + '   <Params>';
    xml = xml + '       <Method>GetFormPostData</Method>';
    xml = xml + '       <ProcessName>威海卫大厦员工考核提报</ProcessName>';
    xml = xml + '      <ProcessVersion>' + version + '</ProcessVersion>';
    xml = xml + '      <Owner></Owner>';
    xml = xml + '    </Params>';
    xml = xml + '   </Requests>';

    dataProvider(xml, function (data) {
        var provideData = JSON.parse(unescape(data.replace(/\\(u[0-9a-fA-F]{4})/gm, '%$1')));
        console.log(provideData);
        var item = provideData.Tables[0].Rows[0];
        $("#fname").val(item.提报人);
        $("#fdept").val(item.提报部门);
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
            text: date.getFullYear()-1
        },
        {
            value: '',
            text: date.getFullYear()
        },
        {
            value: '',
            text: date.getFullYear()+1
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

    $('#tjmx').on('tap', () => {

        var li = `
           <div id="mx" class="mui-card">
              <div class="mui-input-row itemtitle">
                 <label>明细列表项</label>
                 <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>
              </div>  
              <div class="mui-input-row">
                  <label for="fbkhr">被考核人</label>
                  <input type="text" id="fbkhr" name="fbkhr" placeholder="请填写被考核人"/> 
              </div>
              <div class="mui-input-row">
                  <label for="fkhsx">考核事项</label>
                  <input type="text" id="fkhsx" name="fkhsx" placeholder="请填写考核事项"/>
              </div>
              <div class="mui-input-row">
                  <label for="fjle">奖励额</label>
                 <input type="text" id="fjle" name="fjle" placeholder="请填写奖励额"/>
              </div>
              <div class="mui-input-row">
                   <label for="fkke">扣款额</label>
                   <input type="number" id="fkke" name="fkke" placeholder="请填写扣款额"/>
              </div>
              <div class="mui-input-row" style="height:auto;">
                   <label for="fbz">备注</label> 
                   <textarea rows="2" id="fbz" name="fbz" placeholder="请填写备注"></textarea>
              </div>
           </div>
          `;
        $("#mxlist").append(li);
        //绑定输入事件，计算总额
        $("#mxlist").find("#fjle,#fkke").each(function () {
            $(this).on('input',  ()=> {
                calcTotal();
            });
        });
    });


}


function calcTotal() {
    var fjle_total = 0;
    $("#mxlist").find("#fjle").each(function () {
        var fjle = parseFloat($(this).val());
        fjle = isNaN(fjle) ? 0 : fjle;
        fjle_total += fjle;
    });
    $("#fjle_total").val(fjle_total);

    var fkke_total = 0;
    $("#mxlist").find("#fkke").each(function () {
        var fkke = parseFloat($(this).val());
        fkke = isNaN(fkke) ? 0 : fkke;
        fkke_total += fkke;
    });
    $("#fkke_total").val(fkke_total);
}

class Mx {
    constructor(fbkhr, fkhsx, fjle, fkke, fbz) {
        this.fbkhr = fbkhr;
        this.fkhsx = fkhsx;
        this.fjle = fjle;
        this.fkke = fkke;
        this.fbz = fbz;
    }
    
}
function initData(data, flag) {
    var item = data.FormDataSet.威海卫大厦员工考核表_A[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.fbillno);
    }
    $("#fname").val(item.提报人);
    $("#fdept").val(item.提报部门);
    $("#fdate").val(FormatterTimeYMS(item.提报时间));
    $("#fyear").val(item.考核年份);
    $("#fmonth").val(item.考核月份);
    $("#fjle_total").val(item.奖励额总额);
    $("#fkke_total").val(item.扣款额总额);



    var item_c = data.FormDataSet.威海卫大厦员工考核表_B;
    for (var i = 0; i < item_c.length; i++) {
        itemidArr.push(item_c[i].itemid);

        var li = `
           <div id="mx" class="mui-card">
              <div class="mui-input-row itemtitle">
                 <label>明细列表项</label>
                 <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>
              </div>  
              <div class="mui-input-row">
                  <label for="fbkhr">被考核人</label>
                  <input type="text" id="fbkhr" name="fbkhr" readonly value="${item_c[i].被考核人}"/> 
              </div>
              <div class="mui-input-row">
                  <label for="fkhsx">考核事项</label>
                  <input type="text" id="fkhsx" name="fkhsx" readonly value="${item_c[i].被考核事项}"/>
              </div>
              <div class="mui-input-row">
                  <label for="fjle">奖励额</label>
                 <input type="text" id="fjle" name="fjle"  readonly value="${item_c[i].奖励额}"/>
              </div>
              <div class="mui-input-row">
                   <label for="fkke">扣款额</label>
                   <input type="number" id="fkke" name="fkke" readonly value="${item_c[i].扣款额}"/>
              </div>
              <div class="mui-input-row" style="height:auto;">
                   <label for="fbz">备注</label>
                   <textarea rows="2" id="fbz" name="fbz" readonly>${changeNullToEmpty(item_c[i].备注)}</textarea >
              </div>
           </div>
          `;
        $("#mxlist").append(li);

    }
}

function nodeControllerExp(NodeName) {
    if (String(NodeName).match('开始') != null) {
        $('#tjmx').show();
        $("#mxlist").find('span').each(function () {
            $(this).show();
        });
        $("#mxlist").find('input').each(function () {
            $(this).removeAttr('readonly');
        });
        $("#mxlist").find('textarea').each(function () {
            $(this).removeAttr('readonly');
        });
        tapEvent();
        $("#mxlist").find("#fjle,#fkke").each(function () {
            $(this).on('input', () => {
                calcTotal();
            });
        });
    }

}

function Save() {
    var fname = $("#fname").val();
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();
    var fyear = $("#fyear").val();
    var fmonth = $("#fmonth").val();
    var fjle_total = $("#fjle_total").val();
    var fkke_total = $("#fkke_total").val();
    var mxflag = false;
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fbkhr = $(this).find("#fbkhr").val();
        var fkhsx = $(this).find("#fkhsx").val();
        var fjle = $(this).find("#fjle").val();
        var fkke = $(this).find("#fkke").val();
        var fbz = $(this).find("#fbz").val();
        
        var mx = new Mx(fbkhr, fkhsx, fjle, fkke, fbz);
        mxlistArr.push(mx);
    });

    var btnArry = ["取消", "确定"];
    mui.confirm('即将提交，是否确定？', '提交确认提醒', btnArry, function (e) {
        if (e.index == 1) {
            var xml = `<?xml version= "1.0" ?>
                       <XForm>
                        <Header>
                       <Method>Post</Method>';
                      <ProcessName>威海卫大厦员工考核提报</ProcessName>
                        <ProcessVersion>${version}</ProcessVersion>
                        <DraftGuid></DraftGuid>
                          <OwnerMemberFullName>${BPMOU}</OwnerMemberFullName>
                           <Action>提交</Action>
                         <Comment></Comment>
                         <InviteIndicateUsers></InviteIndicateUsers>
                      </Header>
                     <FormData>
              `;
            xml += `   <威海卫大厦员工考核表_A>
                        <fbillno>自动带出</fbillno>
                        <提报人>${fname}</提报人>
                        <提报部门>${fdept}</提报部门>
                        <提报时间>${fdate}</提报时间>
                        <考核年份>${fyear}</考核年份>
                        <考核月份>${fmonth}</考核月份>
                        <奖励额总额>${fjle_total}</奖励额总额>
                        <扣款额总额>${fkke_total}</扣款额总额>
                        <导入模板>201708210356</导入模板>
                    </威海卫大厦员工考核表_A>
               `;
              for (var i = 0; i < mxlistArr.length;i++){
                  xml += `
                        <威海卫大厦员工考核表_B>
                        <RelationRowGuid>${(i+1)}</RelationRowGuid>
                        <RowPrimaryKeys></RowPrimaryKeys>
                        <fentyrno>${(i + 1)}</fentyrno>
                        <被考核人>${mxlistArr[i].fbkhr}</被考核人>
                        <被考核事项>${mxlistArr[i].fkhsx}</被考核事项>
                        <奖励额>${mxlistArr[i].fjle}</奖励额>
                        <扣款额>${mxlistArr[i].fkke}</扣款额>
                        <备注>${mxlistArr[i].fbz}</备注>
                    </威海卫大厦员工考核表_B> 
                  `;
              }
             

             xml+= `  </FormData>
                      </XForm>`;
           
            PostXml(xml);

        }
    });

}
function reSave() {
    var pid = $("#stepId").val();
    var fbillno = $("#fbillno").val();

    var fname = $("#fname").val();
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();
    var fyear = $("#fyear").val();
    var fmonth = $("#fmonth").val();
    var fjle_total = $("#fjle_total").val();
    var fkke_total = $("#fkke_total").val();
    var mxflag = false;
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fbkhr = $(this).find("#fbkhr").val();
        var fkhsx = $(this).find("#fkhsx").val();
        var fjle = $(this).find("#fjle").val();
        var fkke = $(this).find("#fkke").val();
        var fbz = $(this).find("#fbz").val();

        var mx = new Mx(fbkhr, fkhsx, fjle, fkke, fbz);
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

            xml += `   <威海卫大厦员工考核表_A>
                        <fbillno>${fbillno}</fbillno>
                        <提报人>${fname}</提报人>
                        <提报部门>${fdept}</提报部门>
                        <提报时间>${fdate}</提报时间>
                        <考核年份>${fyear}</考核年份>
                        <考核月份>${fmonth}</考核月份>
                        <奖励额总额>${fjle_total}</奖励额总额>
                        <扣款额总额>${fkke_total}</扣款额总额>
                        <导入模板>201708210356</导入模板>
                    </威海卫大厦员工考核表_A>
               `;
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `
                        <威海卫大厦员工考核表_B>
                        <RelationRowGuid>${(i + 1)}</RelationRowGuid>
                        <RowPrimaryKeys></RowPrimaryKeys>
                        <fentyrno>${(i + 1)}</fentyrno>
                        <被考核人>${mxlistArr[i].fbkhr}</被考核人>
                        <被考核事项>${mxlistArr[i].fkhsx}</被考核事项>
                        <奖励额>${mxlistArr[i].fjle}</奖励额>
                        <扣款额>${mxlistArr[i].fkke}</扣款额>
                        <备注>${mxlistArr[i].fbz}</备注>
                    </威海卫大厦员工考核表_B> 
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

    var fname = $("#fname").val();
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();
    var fyear = $("#fyear").val();
    var fmonth = $("#fmonth").val();
    var fjle_total = $("#fjle_total").val();
    var fkke_total = $("#fkke_total").val();
    var mxflag = false;
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fbkhr = $(this).find("#fbkhr").val();
        var fkhsx = $(this).find("#fkhsx").val();
        var fjle = $(this).find("#fjle").val();
        var fkke = $(this).find("#fkke").val();
        var fbz = $(this).find("#fbz").val();

        var mx = new Mx(fbkhr, fkhsx, fjle, fkke, fbz);
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
            xml += `   <威海卫大厦员工考核表_A>
                        <fbillno>${fbillno}</fbillno>
                        <提报人>${fname}</提报人>
                        <提报部门>${fdept}</提报部门>
                        <提报时间>${fdate}</提报时间>
                        <考核年份>${fyear}</考核年份>
                        <考核月份>${fmonth}</考核月份>
                        <奖励额总额>${fjle_total}</奖励额总额>
                        <扣款额总额>${fkke_total}</扣款额总额>
                        <导入模板>201708210356</导入模板>
                    </威海卫大厦员工考核表_A>
               `;
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `
                        <威海卫大厦员工考核表_B>
                        <RelationRowGuid>${(i + 1)}</RelationRowGuid>
                        <RowPrimaryKeys>itemid=${itemidArr[i]}</RowPrimaryKeys>
                        <fentyrno>${(i + 1)}</fentyrno>
                        <被考核人>${mxlistArr[i].fbkhr}</被考核人>
                        <被考核事项>${mxlistArr[i].fkhsx}</被考核事项>
                        <奖励额>${mxlistArr[i].fjle}</奖励额>
                        <扣款额>${mxlistArr[i].fkke}</扣款额>
                        <备注>${mxlistArr[i].fbz}</备注>
                    </威海卫大厦员工考核表_B> 
                  `;
            }


            xml += `  </FormData>
                      </XForm>`;

            PostXml(xml);
        }
    });

}
function AgreeOrConSign() {
    var pid = $("#stepId").val();
    var fbillno = $("#fbillno").val();
    var comment = $("#signSuggest").val();

    var fname = $("#fname").val();
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();
    var fyear = $("#fyear").val();
    var fmonth = $("#fmonth").val();
    var fjle_total = $("#fjle_total").val();
    var fkke_total = $("#fkke_total").val();
    var mxflag = false;
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fbkhr = $(this).find("#fbkhr").val();
        var fkhsx = $(this).find("#fkhsx").val();
        var fjle = $(this).find("#fjle").val();
        var fkke = $(this).find("#fkke").val();
        var fbz = $(this).find("#fbz").val();

        var mx = new Mx(fbkhr, fkhsx, fjle, fkke, fbz);
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
            var xml =`<?xml version="1.0"?>
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
            xml += `   <威海卫大厦员工考核表_A>
                        <fbillno>${fbillno}</fbillno>
                        <提报人>${fname}</提报人>
                        <提报部门>${fdept}</提报部门>
                        <提报时间>${fdate}</提报时间>
                        <考核年份>${fyear}</考核年份>
                        <考核月份>${fmonth}</考核月份>
                        <奖励额总额>${fjle_total}</奖励额总额>
                        <扣款额总额>${fkke_total}</扣款额总额>
                        <导入模板>201708210356</导入模板>
                    </威海卫大厦员工考核表_A>
               `;
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `
                        <威海卫大厦员工考核表_B>
                        <RelationRowGuid>${(i + 1)}</RelationRowGuid>
                        <RowPrimaryKeys>itemid=${itemidArr[i]}</RowPrimaryKeys>
                        <fentyrno>${(i + 1)}</fentyrno>
                        <被考核人>${mxlistArr[i].fbkhr}</被考核人>
                        <被考核事项>${mxlistArr[i].fkhsx}</被考核事项>
                        <奖励额>${mxlistArr[i].fjle}</奖励额>
                        <扣款额>${mxlistArr[i].fkke}</扣款额>
                        <备注>${mxlistArr[i].fbz}</备注>
                    </威海卫大厦员工考核表_B> 
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
        xml += `   <威海卫大厦员工考核表_A>
                        <fbillno>${fbillno}</fbillno>
                        <提报人>${fname}</提报人>
                        <提报部门>${fdept}</提报部门>
                        <提报时间>${fdate}</提报时间>
                        <考核年份>${fyear}</考核年份>
                        <考核月份>${fmonth}</考核月份>
                        <奖励额总额>${fjle_total}</奖励额总额>
                        <扣款额总额>${fkke_total}</扣款额总额>
                        <导入模板>201708210356</导入模板>
                    </威海卫大厦员工考核表_A>
               `;
        for (var i = 0; i < mxlistArr.length; i++) {
            xml += `
                        <威海卫大厦员工考核表_B>
                        <RelationRowGuid>${(i + 1)}</RelationRowGuid>
                        <RowPrimaryKeys>itemid=${itemidArr[i]}</RowPrimaryKeys>
                        <fentyrno>${(i + 1)}</fentyrno>
                        <被考核人>${mxlistArr[i].fbkhr}</被考核人>
                        <被考核事项>${mxlistArr[i].fkhsx}</被考核事项>
                        <奖励额>${mxlistArr[i].fjle}</奖励额>
                        <扣款额>${mxlistArr[i].fkke}</扣款额>
                        <备注>${mxlistArr[i].fbz}</备注>
                    </威海卫大厦员工考核表_B> 
                  `;
        }


        xml += `  </FormData>
                      </XForm>`;

        PostXml(xml);

    }


}