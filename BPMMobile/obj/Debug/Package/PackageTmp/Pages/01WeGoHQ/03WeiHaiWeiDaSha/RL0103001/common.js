function prepMsg() {
    $("#fdate").val(getNowFormatDate(2));
    tapEvent();
    var xml = '<?xml version= "1.0" ?>';
    xml = xml + '   <Requests>';
    xml = xml + '   <Params>';
    xml = xml + '       <Method>GetFormPostData</Method>';
    xml = xml + '       <ProcessName>威海卫大厦员工转正申请</ProcessName>';
    xml = xml + '      <ProcessVersion>' + version + '</ProcessVersion>';
    xml = xml + '      <Owner></Owner>';
    xml = xml + '    </Params>';
    xml = xml + '   </Requests>';

    dataProvider(xml, function (data) {
        var provideData = JSON.parse(unescape(data.replace(/\\(u[0-9a-fA-F]{4})/gm, '%$1')));
        console.log(provideData);
        var item = provideData.Tables[0].Rows[0];
        $("#fname").val(item.提报人);
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
    $("#tjmx").on('tap', () => {
        var li = `
            <div id="mx" class="mui-card">
              <div class="mui-input-row itemtitle">
                 <label>明细列表项</label>
                 <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>
              </div>
              <div class="mui-input-row">
                 <label for="fsqr">申请人<i style="color:red;">*</i></label>
                 <input type="text" id="fsqr" name="fsqr" placeholder="请填写申请人"/>
              </div>
              <div class="mui-input-row">
                  <label for="frzrq">入职日期<i style="color:red;">*</i></label>
                  <input type="date" id="frzrq" name="frzrq" />
              </div>    
              <div class="mui-input-row">
                  <label for="fzzrq">转正日期<i style="color:red;">*</i></label>
                  <input type="date" id="fzzrq" name="fzzrq" />
              </div> 
              <div class="mui-input-row">
                  <label for="fszgw">所在岗位<i style="color:red;">*</i></label>
                  <input type="text" id="fszgw" name="fszgw" placeholder="请填写所在岗位"/>
              </div>
              <div class="mui-input-row">
                   <label for="fsyqgz">试用期工资<i style="color:red;">*</i></label>
                   <input type="number" id="fsyqgz" name="fsyqgz" placeholder="请填写试用期工资"/>
              </div>
              <div class="mui-input-row">
                   <label for="fzzgz">转正工资<i style="color:red;">*</i></label>
                   <input type="number" id="fzzgz" name="fzzgz" placeholder="请填写转正工资"/>
              </div>
              <div class="mui-input-row">
                   <label for="fbz">备注</label>
                   <input type="text" id="fbz" name="fbz" placeholder="请填写备注"/> 
              </div>
              <div class="mui-input-row">
                  <label for="fzt">状态</label>
                  <input type="text" id="fzt" name="fzt" readonly value="同意"/>  
              </div> 
            </div>
        `;
        $("#mxlist").append(li);
    })

}

function initData(data, flag) {
    var item = data.FormDataSet.威海卫大厦人事管理事务申请表_A[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.fbillno);
    }
    $("#fname").val(item.提报人);
    $("#fdept").val(item.申请部门);
    $("#fdate").val(FormatterTimeYMS(item.申请时间));
    var item_c = data.FormDataSet.威海卫大厦人事管理事务申请表_B;
    for (var i = 0; i < item_c.length; i++) {
        itemidArr.push(item_c[i].itemid);
        var li = `
            <div id="mx" class="mui-card">
              <div class="mui-input-row itemtitle">
                 <label>明细列表项</label>
                 <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>
              </div>
              <div class="mui-input-row">
                 <label for="fsqr">申请人<i style="color:red;">*</i></label>
                 <input type="text" id="fsqr" name="fsqr" readonly value="${item_c[i].申请人}"/>
              </div>
              <div class="mui-input-row">
                  <label for="frzrq">入职日期<i style="color:red;">*</i></label>
                  <input type="date" id="frzrq" name="frzrq" readonly value="${FormatterTimeYMS(item_c[i].入职日期)}"/>
              </div>    
              <div class="mui-input-row">
                  <label for="fzzrq">转正日期<i style="color:red;">*</i></label>
                  <input type="date" id="fzzrq" name="fzzrq" readonly value="${FormatterTimeYMS(item_c[i].转正日期)}"/>
              </div> 
              <div class="mui-input-row">
                  <label for="fszgw">所在岗位<i style="color:red;">*</i></label>
                  <input type="text" id="fszgw" name="fszgw" readonly value="${item_c[i].所在岗位}"/>
              </div>
              <div class="mui-input-row">
                   <label for="fsyqgz">试用期工资<i style="color:red;">*</i></label>
                   <input type="number" id="fsyqgz" name="fsyqgz" readonly value="${item_c[i].试用工资}"/>
              </div>
              <div class="mui-input-row">
                   <label for="fzzgz">转正工资<i style="color:red;">*</i></label>
                   <input type="number" id="fzzgz" name="fzzgz" readonly value="${item_c[i].转正公司}"/>
              </div>
              <div class="mui-input-row">
                   <label for="fbz">备注</label>
                   <input type="text" id="fbz" name="fbz" readonly value="${changeNullToEmpty(item_c[i].备注)}"/> 
              </div>
              <div class="mui-input-row">
                  <label for="fzt">状态</label>
                  <input type="text" id="fzt" name="fzt" readonly value="${changeNullToEmpty(item_c[i].人事状态)}"/>  
              </div> 
            </div>
        `;
        $("#mxlist").append(li);
    }

}

class Mx{
    //构造
    constructor(fsqr, frzrq, fzzrq, fszgw, fsyqgz, fzzgz, fbz, fzt) {
        this.fsqr = fsqr;
        this.frzrq = frzrq;
        this.fzzrq = fzzrq;
        this.fszgw = fszgw;
        this.fsyqgz = fsyqgz;
        this.fzzgz = fzzgz;
        this.fbz = fbz;
        this.fzt = fzt;


    }
    check(){
        if (!this.fsqr) {
            mui.toast('请填写申请人');
            return false;
        }
        if (!this.frzrq) {
            mui.toast('请填写入职时间');
            return false;
        }
        if (!this.fzzrq) {
            mui.toast('请填写转正时间');
            return false;
        }
        if (!this.fszgw) {
            mui.toast('请填写所在岗位');
            return false;
        }
        if (!this.fsyqgz) {
            mui.toast('请填写试用期工资');
            return false;
        }
        if (!this.fzzgz) {
            mui.toast('请填写转正工资');
            return false;
        }

        return true;
    }

}

function nodeControllerExp(NodeName) {
    /*
    *
    *   人事主管/总办主任 可以调整子表·状态·字段
    *   
    *
    */

    if (String(NodeName).match('开始') != null) {
        tapEvent();
        $("#mxlist").find('span').each(function () {
            $(this).show();
        });
        $("#fdate").removeAttr('readonly');

    } else if (String(NodeName).match('人事主管') != null || String(NodeName).match('总办主任') != null) {
        $("input[name='fzt']").attr('placeholder', '请选择状态');
        var fztdata = [
            {
                value: '',
                text:'同意'
            },
            {
                value: '',
                text: '不同意'
            }
        ];
        showPicker('fzt', fztdata);
        
    } 
    
}

function Save() {
    var fname = $("#fname").val();
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();

    var mxflag = false;
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fsqr = $(this).find("#fsqr").val();
        var frzrq = $(this).find("#frzrq").val();
        var fzzrq = $(this).find("#fzzrq").val();
        var fszgw = $(this).find("#fszgw").val();
        var fsyqgz = $(this).find("#fsyqgz").val();
        var fzzgz = $(this).find("#fzzgz").val();
        var fbz = $(this).find("#fbz").val();
        var fzt = $(this).find("#fzt").val();

        var mx = new Mx(fsqr, frzrq, fzzrq, fszgw, fsyqgz, fzzgz, fbz, fzt);
        if (!mx.check()) {
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
            var xml = '<?xml version= "1.0" ?>';
            xml = xml + '   <XForm>';
            xml = xml + '         <Header>';
            xml = xml + '        <Method>Post</Method>';
            xml = xml + '       <ProcessName>威海卫大厦员工转正申请</ProcessName>';
            xml = xml + '         <ProcessVersion>' + version + '</ProcessVersion>';
            xml = xml + '            <DraftGuid></DraftGuid>';
            xml = xml + '             <OwnerMemberFullName>' + BPMOU + '</OwnerMemberFullName>';
            xml = xml + '            <Action>提交</Action>';
            xml = xml + '          <Comment></Comment>';
            xml = xml + '             <InviteIndicateUsers></InviteIndicateUsers>';
            xml = xml + '       </Header>';
            xml = xml + '       <FormData>';

            xml = xml + '  <威海卫大厦人事管理事务申请表_A>';
            xml = xml + '    <fbillno>自动带出</fbillno>';
            xml = xml + '   <提报人>' + fname + '</提报人>';
            xml = xml + '    <申请部门>' + fdept + '</申请部门>';
            xml = xml + '    <申请时间>' + fdate + '</申请时间>';
            xml = xml + '  </威海卫大厦人事管理事务申请表_A>';
            for (var i = 0; i < mxlistArr.length; i++) {
                xml = xml + ' <威海卫大厦人事管理事务申请表_B>';
                xml = xml + '  <RelationRowGuid>'+(i+1)+'</RelationRowGuid>';
                xml = xml + '   <RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + '   <序号>' + (i + 1) + '</序号>';
                xml = xml + '    <申请人>' + mxlistArr[i].fsqr + '</申请人>';
                xml = xml + '   <入职日期>' + mxlistArr[i].frzrq + '</入职日期>';
                xml = xml + '   <转正日期>' + mxlistArr[i].fzzrq + '</转正日期>';
                xml = xml + '   <所在岗位>' + mxlistArr[i].fszgw + '</所在岗位>';
                xml = xml + '  <试用工资>' + mxlistArr[i].fsyqgz + '</试用工资>';
                xml = xml + '  <转正公司>' + mxlistArr[i].fzzgz + '</转正公司>';
                xml = xml + '  <备注>' + mxlistArr[i].fbz + '</备注>';
                xml = xml + '   <人事状态>' + mxlistArr[i].fzt + '</人事状态>';
                xml = xml + '   </威海卫大厦人事管理事务申请表_B>';
            }

            xml = xml + '</FormData>';
            xml = xml + '</XForm>';
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

    var mxflag = false;
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fsqr = $(this).find("#fsqr").val();
        var frzrq = $(this).find("#frzrq").val();
        var fzzrq = $(this).find("#fzzrq").val();
        var fszgw = $(this).find("#fszgw").val();
        var fsyqgz = $(this).find("#fsyqgz").val();
        var fzzgz = $(this).find("#fzzgz").val();
        var fbz = $(this).find("#fbz").val();
        var fzt = $(this).find("#fzt").val();

        var mx = new Mx(fsqr, frzrq, fzzrq, fszgw, fsyqgz, fzzgz, fbz, fzt);
        if (!mx.check()) {
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
            var xml = '<?xml version="1.0"?>';
            xml = xml + '<XForm>';
            xml = xml + '   <Header>';
            xml = xml + '    <Method>Process</Method>';
            xml = xml + '   <PID>' + pid + '</PID>';
            xml = xml + '   <Action>提交</Action>';
            xml = xml + '    <Comment></Comment>';
            xml = xml + '    <InviteIndicateUsers></InviteIndicateUsers>';
            xml = xml + '  </Header>';
            xml = xml + '<FormData>';
            xml = xml + '  <威海卫大厦人事管理事务申请表_A>';
            xml = xml + '    <fbillno>' + fbillno + '</fbillno>';
            xml = xml + '   <提报人>' + fname + '</提报人>';
            xml = xml + '    <申请部门>' + fdept + '</申请部门>';
            xml = xml + '    <申请时间>' + fdate + '</申请时间>';
            xml = xml + '  </威海卫大厦人事管理事务申请表_A>';
            for (var i = 0; i < mxlistArr.length; i++) {
                xml = xml + ' <威海卫大厦人事管理事务申请表_B>';
                xml = xml + '  <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml = xml + '   <RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + '   <序号>' + (i + 1) + '</序号>';
                xml = xml + '    <申请人>' + mxlistArr[i].fsqr + '</申请人>';
                xml = xml + '   <入职日期>' + mxlistArr[i].frzrq + '</入职日期>';
                xml = xml + '   <转正日期>' + mxlistArr[i].fzzrq + '</转正日期>';
                xml = xml + '   <所在岗位>' + mxlistArr[i].fszgw + '</所在岗位>';
                xml = xml + '  <试用工资>' + mxlistArr[i].fsyqgz + '</试用工资>';
                xml = xml + '  <转正公司>' + mxlistArr[i].fzzgz + '</转正公司>';
                xml = xml + '  <备注>' + mxlistArr[i].fbz + '</备注>';
                xml = xml + '   <人事状态>' + mxlistArr[i].fzt + '</人事状态>';
                xml = xml + '   </威海卫大厦人事管理事务申请表_B>';
            }

            xml = xml + '</FormData>';
            xml = xml + '</XForm>';
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

    var mxflag = false;
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fsqr = $(this).find("#fsqr").val();
        var frzrq = $(this).find("#frzrq").val();
        var fzzrq = $(this).find("#fzzrq").val();
        var fszgw = $(this).find("#fszgw").val();
        var fsyqgz = $(this).find("#fsyqgz").val();
        var fzzgz = $(this).find("#fzzgz").val();
        var fbz = $(this).find("#fbz").val();
        var fzt = $(this).find("#fzt").val();

        var mx = new Mx(fsqr, frzrq, fzzrq, fszgw, fsyqgz, fzzgz, fbz, fzt);
       
        mxlistArr.push(mx);

    });

    var comment = '';
    var btnArray = ['取消', '确定'];
    mui.prompt('请选填知会意见', '可以不填', '知会意见', btnArray, function (e) {
        if (e.index == 1) {
            comment = e.value;
            var xml = '<?xml version="1.0"?>';
            xml = xml + '<XForm>';
            xml = xml + '<Header>';
            xml = xml + '<Method>InformSubmit</Method>';
            xml = xml + '<PID>' + pid + '</PID>';
            xml = xml + '<Comment>' + comment + '</Comment>';
            xml = xml + '</Header>';
            xml = xml + '<FormData>';

            xml = xml + '  <威海卫大厦人事管理事务申请表_A>';
            xml = xml + '    <fbillno>' + fbillno + '</fbillno>';
            xml = xml + '   <提报人>' + fname + '</提报人>';
            xml = xml + '    <申请部门>' + fdept + '</申请部门>';
            xml = xml + '    <申请时间>' + fdate + '</申请时间>';
            xml = xml + '  </威海卫大厦人事管理事务申请表_A>';
            for (var i = 0; i < mxlistArr.length; i++) {
                xml = xml + ' <威海卫大厦人事管理事务申请表_B>';
                xml = xml + '  <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml = xml + '   <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
                xml = xml + '   <序号>' + (i + 1) + '</序号>';
                xml = xml + '    <申请人>' + mxlistArr[i].fsqr + '</申请人>';
                xml = xml + '   <入职日期>' + mxlistArr[i].frzrq + '</入职日期>';
                xml = xml + '   <转正日期>' + mxlistArr[i].fzzrq + '</转正日期>';
                xml = xml + '   <所在岗位>' + mxlistArr[i].fszgw + '</所在岗位>';
                xml = xml + '  <试用工资>' + mxlistArr[i].fsyqgz + '</试用工资>';
                xml = xml + '  <转正公司>' + mxlistArr[i].fzzgz + '</转正公司>';
                xml = xml + '  <备注>' + mxlistArr[i].fbz + '</备注>';
                xml = xml + '   <人事状态>' + mxlistArr[i].fzt + '</人事状态>';
                xml = xml + '   </威海卫大厦人事管理事务申请表_B>';
            }

            xml = xml + '</FormData>';
            xml = xml + '</XForm>';
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

    var mxflag = false;
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fsqr = $(this).find("#fsqr").val();
        var frzrq = $(this).find("#frzrq").val();
        var fzzrq = $(this).find("#fzzrq").val();
        var fszgw = $(this).find("#fszgw").val();
        var fsyqgz = $(this).find("#fsyqgz").val();
        var fzzgz = $(this).find("#fzzgz").val();
        var fbz = $(this).find("#fbz").val();
        var fzt = $(this).find("#fzt").val();

        var mx = new Mx(fsqr, frzrq, fzzrq, fszgw, fsyqgz, fzzgz, fbz, fzt);
       
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
            var xml = '<?xml version="1.0"?>';
            xml = xml + '<XForm>';
            xml = xml + '<Header>';
            xml = xml + '<Method>Process</Method>';
            xml = xml + '<PID>' + pid + '</PID>';
            xml = xml + '<Action>同意</Action>';
            xml = xml + '<Comment>' + comment + '</Comment>';
            //加签差异部分
            xml = xml + '<ConsignEnabled>true</ConsignEnabled>';
            xml = xml + '  <ConsignUsers>' + consignUserStr + '</ConsignUsers>';
            xml = xml + ' <ConsignRoutingType>' + consignRoutingType + '</ConsignRoutingType>';
            xml = xml + '  <ConsignReturnType>' + consignReturnType + '</ConsignReturnType>';
            xml = xml + ' <InviteIndicateUsers>[]</InviteIndicateUsers>';
            xml = xml + ' <Context>{&quot;Routing&quot;:{}}</Context>';
            xml = xml + '</Header>';
            xml = xml + '<FormData>';
            xml = xml + '  <威海卫大厦人事管理事务申请表_A>';
            xml = xml + '    <fbillno>' + fbillno + '</fbillno>';
            xml = xml + '   <提报人>' + fname + '</提报人>';
            xml = xml + '    <申请部门>' + fdept + '</申请部门>';
            xml = xml + '    <申请时间>' + fdate + '</申请时间>';
            xml = xml + '  </威海卫大厦人事管理事务申请表_A>';
            for (var i = 0; i < mxlistArr.length; i++) {
                xml = xml + ' <威海卫大厦人事管理事务申请表_B>';
                xml = xml + '  <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml = xml + '   <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
                xml = xml + '   <序号>' + (i + 1) + '</序号>';
                xml = xml + '    <申请人>' + mxlistArr[i].fsqr + '</申请人>';
                xml = xml + '   <入职日期>' + mxlistArr[i].frzrq + '</入职日期>';
                xml = xml + '   <转正日期>' + mxlistArr[i].fzzrq + '</转正日期>';
                xml = xml + '   <所在岗位>' + mxlistArr[i].fszgw + '</所在岗位>';
                xml = xml + '  <试用工资>' + mxlistArr[i].fsyqgz + '</试用工资>';
                xml = xml + '  <转正公司>' + mxlistArr[i].fzzgz + '</转正公司>';
                xml = xml + '  <备注>' + mxlistArr[i].fbz + '</备注>';
                xml = xml + '   <人事状态>' + mxlistArr[i].fzt + '</人事状态>';
                xml = xml + '   </威海卫大厦人事管理事务申请表_B>';
            }

            xml = xml + '</FormData>';
            xml = xml + '</XForm>';
            PostXml(xml);
        })
    } else {
        var xml = '<?xml version="1.0"?>';
        xml = xml + '<XForm>';
        xml = xml + '<Header>';
        xml = xml + '<Method>Process</Method>';
        xml = xml + '<PID>' + pid + '</PID>';
        xml = xml + '<Action>同意</Action>';
        xml = xml + '<Comment>' + comment + '</Comment>';

        xml = xml + ' <UrlParams></UrlParams>';
        xml = xml + '  <ConsignEnabled>false</ConsignEnabled>';
        xml = xml + '  <ConsignUsers>[]</ConsignUsers>';
        xml = xml + '  <ConsignRoutingType>Parallel</ConsignRoutingType>';
        xml = xml + '  <ConsignReturnType>Return</ConsignReturnType>';

        xml = xml + '   <InviteIndicateUsers>[]</InviteIndicateUsers>';
        xml = xml + '   <Context>{&quot;Routing&quot;:{}}</Context>';
        xml = xml + '</Header>';
        xml = xml + '<FormData>';


        xml = xml + '  <威海卫大厦人事管理事务申请表_A>';
        xml = xml + '    <fbillno>' + fbillno + '</fbillno>';
        xml = xml + '   <提报人>' + fname + '</提报人>';
        xml = xml + '    <申请部门>' + fdept + '</申请部门>';
        xml = xml + '    <申请时间>' + fdate + '</申请时间>';
        xml = xml + '  </威海卫大厦人事管理事务申请表_A>';
        for (var i = 0; i < mxlistArr.length; i++) {
            xml = xml + ' <威海卫大厦人事管理事务申请表_B>';
            xml = xml + '  <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
            xml = xml + '   <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
            xml = xml + '   <序号>' + (i + 1) + '</序号>';
            xml = xml + '    <申请人>' + mxlistArr[i].fsqr + '</申请人>';
            xml = xml + '   <入职日期>' + mxlistArr[i].frzrq + '</入职日期>';
            xml = xml + '   <转正日期>' + mxlistArr[i].fzzrq + '</转正日期>';
            xml = xml + '   <所在岗位>' + mxlistArr[i].fszgw + '</所在岗位>';
            xml = xml + '  <试用工资>' + mxlistArr[i].fsyqgz + '</试用工资>';
            xml = xml + '  <转正公司>' + mxlistArr[i].fzzgz + '</转正公司>';
            xml = xml + '  <备注>' + mxlistArr[i].fbz + '</备注>';
            xml = xml + '   <人事状态>' + mxlistArr[i].fzt + '</人事状态>';
            xml = xml + '   </威海卫大厦人事管理事务申请表_B>';
        }

        xml = xml + '</FormData>';
        xml = xml + '</XForm>';
        PostXml(xml);
    }
}