//全局变量
//class node1节点权限控制字段；
var flag_switch = false;//是否加签
var flag_name='';//当前选择字段名
var flag_maxrow = 0;//明细表最大行数
var flag_nowrow = 0;//当前行号


//发起--流程初始化
function prepMsg() {
    //preheader();//抬头初始化
    predetail();//明细项初始化
    //initlink();//初始化联动信息
    tapEvent();//点击事件
    //uploadOpt();//允许附件上传

    //获取发起人信息
    var xml = '<?xml version= "1.0" ?>';
    xml = xml + '<Requests>';
    xml = xml + '    <Params>';
    xml = xml + '      <Method>GetFormPostData</Method>';
    xml = xml + '       <ProcessName>洁丽康公司销售订单申请</ProcessName>';
    xml = xml + '       <ProcessVersion>' + version + '</ProcessVersion>';
    xml = xml + '         <Owner></Owner>';
    xml = xml + '      </Params>';
    xml = xml + '    </Requests>';
    var initHeaderMsg = $.ajax({
        type: "POST",
        url: "/api/bpm/DataProvider",
        data: { '': xml },

        beforeSend: function (XHR) {
            XHR.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem('ticket'));
        }
    }).done(function (data) {
        var provideData = JSON.parse(unescape(data.replace(/\\(u[0-9a-fA-F]{4})/gm, '%$1')));
        var item = provideData.Tables[0].Rows[0];
        //console.log(accountBPM);
        //console.log(item);
        $("#填写人").val(item.填写人);
        $("#申请部门").val(item.申请部门);
        $("#销售员名称").val(item.销售员名称);
        $("#销售员名称").data('fno', item.销售员编码);
        
    }).fail(function (e) {

    });

    initHeaderMsg.then(function () {
        //获取申请人信息后执行的操作
        $("#填写日期").val(getNowFormatDate(2));//日期
        $("#订单日期").val(getNowFormatDate(2));//日期

        //发起初始化
        $("#汇率").val('1.00');
        $("#币别名称").val('人民币');
        $("#币别名称").data('fno', 'BB01');
        $("#交货方式名称").val('送货');
        $("#交货方式名称").data('fno', 'SEND');
        $("#付款方式名称").val('赊销');
        $("#付款方式名称").data('fno', '002');
        $("#业务类型名称").val('普通销售');
        $("#业务类型名称").data('fno', '210');
        $("#财务组织编码").val('01.06.05');
        $("#库存组织编码").val('01.06.05');
        $("#是否含税").val('1');
        $("#可销售").val('是');

        $("#fszcard").hide();//隐藏赊销信息

    });

}

//发起--抬头初始化
function preheader() {
    /*
    //公司名称初始化--默认值
    if ((document.getElementById('comp_name').value ==null)||(document.getElementById('comp_name').value =='')){
        document.getElementById('comp_name').value='威高集团有限公司';
    };
    */

    /*
    //附件初始化
    var li = setfileli('','');
    $("#filecard").append(li);
    */

}

//发起--明细项初始化
function predetail() {

    //明细项初始1行
    flag_maxrow = 1;//发起流程初始化行号为1
    var li = setli(flag_maxrow, '', '', '', '','','','','','','','');
    $("#mxlist").append(li);

}
   

//初始化联动信息
function initlink() {
    /*
    //是否借款联动明细
    var fshifoujk = $("#shifoujk").val();
    if (fshifoujk=="是") {
        $("#fjkcard").show();
    }
    else {
        $("#fjkcard").hide();
    }
    */
}

//点击事件
function tapEvent() {
    //从索引列表中返回表单
    $(".mui-icon-left-nav").on('tap', function () {
        $("#wrapper").show();
        $("#selector").hide();
    });

    //抬头点击事件
    tapEvent_header();

    //明细项点击事件
    tapEvent_detail(); 

}

//抬头点击事件
function tapEvent_header(){

    //销售组织名称点击事件添加子表
    $('#销售组织名称').on('tap', function (e) {
        tapEvent_fxszz();
    });

    //客户名称点击事件添加子表
    $('#客户名称').on('tap', function (e) {
        tapEvent_fkhmc();
    });

    //客户名称点击事件添加子表
    $('#区域经理').on('tap', function (e) {
        var zeptoId = "#区域经理";
        var isMulti = false;
        GetPer(zeptoId,isMulti);
    });


    //添加明细按钮
    $('#tjmx').on('tap', function (e) {
        flag_maxrow = flag_maxrow + 1;
        //console.log(e.detail.timestamp);
        var li = setli(flag_maxrow, '', '', '', '','','','','','','',e.detail.timestamp)
        $("#mxlist").append(li);
        document.getElementById('tjmx').scrollIntoView();
        
        //添加明细项点击事件
        tapEvent_detail();

        //明细附件
        //$("#mxlist").find('.upload-addbtn').each(function () {
        //    upload_multi($(this).find('input'), "." + $(this).parent().parent().find("#imglist").attr('class'));
        // });
    });


/*
    //是否借款
    mui('#fif_jk').each(function () {
        this.addEventListener('toggle', function (event) {
            if (event.detail.isActive == 'true' || event.detail.isActive == true) {
                $("#shifoujk").val('是');
                $("#fjkcard").show();
            } else {
                $("#shifoujk").val('否');
                $("#fjkcard").hide();
            }

        });
    });
    */
}

//订单审核岗--抬头点击事件
function tapEvent_header1(){
    //是否赊销下拉
    var fif_sx = [
        {
            value: '',
            text: '赊销'
        },
        {
            value: '',
            text: '款到发货'
        }
    ];
    showPicker('是否赊销', fif_sx);

    //审核级别下拉
    var fshjb = [
        {
            value: '',
            text: '正常'
        },
        {
            value: '',
            text: '总监'
        },
        {
            value: '',
            text: '总经理'
        }
    ];
    showPicker('赊销审核级别', fshjb);
    showPicker('价格审核级别', fshjb);
}

//销售组织名称点击函数
function tapEvent_fxszz() {
    //显示索引列表
    flag_name = 'fxszz';
    getProcedureMsg();

    $("#wrapper").hide();
    $("#selector").show();
}

//客户名称点击函数
function tapEvent_fkhmc() {
    //显示索引列表
    flag_name = 'fkhmc';
    getProcedureMsg();

    $("#wrapper").hide();
    $("#selector").show();
}

//物料编码点击函数
function tapEvent_fwlbm() {
    //显示索引列表
    flag_name = 'fwlbm';
    getProcedureMsg();

    $("#wrapper").hide();
    $("#selector").show();
}

//明细项点击事件
function tapEvent_detail() {

    //列表明细项点击事件
    $("#mxlist").find("#mx").each(function () {
       
        //物料编码点击事件
        $(this).find("#物料编码").on('tap', function () {
            tapEvent_fwlbm();
            
        });
        
        //鼠标失去焦点事件--input number字段格式化
        $(this).find("input[type='number']").on('blur', function (event) {
            var fmoney = Number($(this).val()).toLocaleString('zh', { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: false });
            $(this).val(fmoney);//格式化金额字段
            //$("#jkjedx").val(fcapital);
        });

        //输入事件
        $(this).find(".calculate").on('input', function () {
            var fhsdj = $(this).parent().parent().find("#实际含税单价").val();
            var fsl = $(this).parent().parent().find("#数量").val();

            var fthsdj = Number(fhsdj).toLocaleString('zh', { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: false });
            var ftsl = Number(fsl).toLocaleString('zh', { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: false });

            var ftjshj = Number(fthsdj*ftsl).toLocaleString('zh', { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: false });

            $(this).parent().parent().find("#价税合计").val(ftjshj); 

            //总计
            Calculate();
        });

        //列表明细项点击事件--获取点击行号
        $(this).off('tap');
        $(this).on('tap', function () {
            flag_nowrow = $(this).find("#rowno").val();
            //console.log(flag_nowrow);
        });
    });
}

//合计
function Calculate() {
    //总计
    var fslzj = 0;
    var fjszj = 0;

    $("#mxlist").find('#mx').each(function () {
        fslzj= fslzj+Number($(this).find("#数量").val());
        fjszj= fjszj+Number($(this).find("#价税合计").val());
    });

    $("#数量总计").val(Number(fslzj).toLocaleString('zh', { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: false }));    
    $("#价税总计").val(Number(fjszj).toLocaleString('zh', { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: false }));    
}

//获取人员信息 
function GetPer(zeptoId,isMulti) {
    var NameArr = new Array();
    var OpenIdArr = new Array();
    var UserIdArr = new Array();
    var NameNewArr = new Array();

    XuntongJSBridge.call('selectPersons', { 'isMulti': isMulti, 'pType': '1' }, function (result) {

        //alert(JSON.stringify(result.data));
        if (typeof (result) == "string") {
            result = JSON.parse(result);
        }
       
        if (result.success == true || result.success == "true") {
            for (var i = 0; i < result.data.persons.length; i++) {
                if (typeof (result.data.persons[i].name) != "undefined") {
                    NameArr.push(result.data.persons[i].name);
                } else {
                    NameArr.push(result.data.persons[i].personName);
                }

                OpenIdArr.push((String)(result.data.persons[i].openId));
            }

            var perAjax = $.ajax({
                type: "POST",
                url: "/api/bpm/PostAccount",
                data: { "ids": OpenIdArr },
                beforeSend: function (XHR) {
                    XHR.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem('ticket'));
                }
            }).done(function (data, status) {
                //console.log(data);
                if (status == "success") {
                    for (var i = 0; i < data.data.length; i++) {
                        UserIdArr.push(data.data[i].phone);//根据openid获取的userid和name重新从对象中读取，否则数组顺序不对应
                        NameNewArr.push(data.data[i].name);
                    }
                    
                    //console.log(NameArr);
                    //console.log(NameNewArr);
                    //console.log(UserIdArr);
                    $(zeptoId).val(NameNewArr);
                    $(zeptoId).data('fno', UserIdArr);
                    /*
                    if (zeptoId == "#fgly") {
                        $("#mxlist").empty();
                        flag_maxrow = 0;
                        for (var i = 0; i < NameArr.length; i++) {
                            flag_maxrow = i + 1;
                            var li = setli(flag_maxrow, UserIdArr[i], NameNewArr[i]);
                            $("#mxlist").append(li);
                        }
                    }
                    */
                }
            }).fail(function () {

            });            

        }

    });

}

//加签按钮点击事件
function tapEvent_csswitch() {
    document.getElementById("csswitch").addEventListener('toggle', function (event) {
        flag_switch = !flag_switch;
        // mui.toast(flag_switch);
    });
}

//重写删除功能
function deleteItem(context) {
    var btnArray = ['否', '是'];
    mui.confirm('确认删除？', '', btnArray, function (e) {
        if (e.index == 1) {
            $(context).parent().parent().remove();

            //重写行号
            flag_maxrow = 0;
            $("#mxlist").find('#mx').each(function () {
                flag_maxrow = flag_maxrow + 1;
                $(this).find("#rowno").val(flag_maxrow);
                 });
            //console.log(flag_maxrow);
        }
    });
}

function setli(flag_maxrow, wlbm, wlmc, ggxh, jldw,dwbm,sl,hsdj,jshj,bz,ffjno,flistno) {
    //console.log(changeNullToEmpty(flag_maxrow));
    var li = '<div id="mx" class="mui-card">';
    
    li = li + '     <div class="mui-input-row itemtitle">';
    li = li + '        <label>明细列表项</label>';
    li = li + '        <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>';
    li = li + '     </div>';
    li = li + '     <div class="mui-input-row">';
    li = li + '       <label for="rowno">行号 </label>';
    li = li + '       <input type="number" id="rowno" name="rowno" readonly="readonly" value="' + flag_maxrow + '"/>';
    li = li + '     </div>';
    li = li + '     <div class="mui-input-row">';
    li = li + '       <label for="物料编码">物料编码<i style="color:red;">*</i></label>';
    li = li + '       <input type="text" id="物料编码" name="物料编码" placeholder="请选择物料编码" readonly="readonly" value="' + changeNullToEmpty(wlbm) + '"/>';
    li = li + '     </div>';                                   
    li = li + '     <div class="mui-input-row">';
    li = li + '       <label for="物料名称">物料名称</label>';
    li = li + '       <input type="text" id="物料名称" name="物料名称" readonly="readonly" value="' + changeNullToEmpty(wlmc) + '"/>';
    li = li + '     </div>';
    li = li + '     <div class="mui-input-row">';
    li = li + '       <label for="规格型号">规格型号</label>';
    li = li + '       <input type="text" id="规格型号" name="规格型号" readonly="readonly" value="' + changeNullToEmpty(ggxh) + '"/>';
    li = li + '     </div>';
    li = li + '     <div class="mui-input-row">';
    li = li + '       <label for="计量单位">计量单位</label>';
    li = li + '       <input type="text" id="计量单位" name="计量单位" readonly="readonly" value="' + changeNullToEmpty(jldw) + '" data-fno="' + changeNullToEmpty(dwbm) + '"/>';
    li = li + '     </div>';
    //li = li + '     <div class="mui-input-row">';
    //li = li + '       <label for="计量单位编码">计量单位编码</label>';
    //li = li + '       <input type="text" id="计量单位编码" name="计量单位编码" readonly="readonly" value="' + changeNullToEmpty(dwbm) + '"/>';
    //li = li + '     </div>';
    li = li + '     <div class="mui-input-row">';
    li = li + '       <label for="数量">数量<i style="color:red;">*</i></label>';
    li = li + '       <input type="number" id="数量" name="数量" placeholder="请填写数量" class="node1 calculate" value="' + sl + '"/>';
    li = li + '     </div>';
    li = li + '     <div class="mui-input-row">';
    li = li + '       <label for="实际含税单价">实际含税单价<i style="color:red;">*</i></label>';
    li = li + '       <input type="number" id="实际含税单价" name="实际含税单价" placeholder="请填写实际含税单价" class="node1 calculate" value="' + hsdj + '"/>';
    li = li + '     </div>';
    li = li + '     <div class="mui-input-row">';
    li = li + '       <label for="价税合计">价税合计</label>';
    li = li + '       <input type="number" id="价税合计" name="价税合计" readonly="readonly" value="' + jshj + '"/>';
    li = li + '     </div>';
    li = li + '     <div class="mui-input-row">';
    li = li + '       <label for="备注">备注</label>';
    li = li + '       <input type="text" id="备注" name="备注" placeholder="请填写备注" class="node1" value="' + changeNullToEmpty(bz) + '"/>';
    li = li + '     </div>';
    
    //li = li +  setfileli(ffjno,flistno);

    li = li + '</div>  ';

    return li;
}


//附件html拼接
function setfileli(ffjno,flistno){
    var li='';

    li = li + '     <div class="mui-input-row cutOffLine" style="height:7rem;overflow:scroll;" id="uploaddiv">';
    li = li + '          <div class="border border-t upload-img" style="top:0rem;">';                           
    li = li + '               <div class="clearfix upload-btn" id="children-bg">';
    li = li + '                    <label class="label">附件</label>';
    li = li + '                    <input type="hidden" id="fj_info_ids" name="fj_info_ids" value="' + ffjno + '"/>';
    li = li + '                    <span class="upload-addbtn" id="addbtn_fj">';
    li = li + '                    <input type="file" accept="image/jpeg,image/jpg,image/png,image/jp2,image/bmp" id="file" style="opacity:0;">';
    li = li + '                    </span>';
    li = li + '                </div>';
    li = li + '                <div class="upload-img-list-'+ flistno +'" id="imglist">';
    li = li + '                </div>';
    li = li + '           </div>';
    li = li + '      </div>';

    return li;
}

//待办、已办、已申请--根据单号,获取表单内容
function initData(data, flag) {
    //data flag为全局变量
    var fjArrayList = [];//附件id数组
    var fjArrayListEvery = [];//
    var fjArrayObjCollections = [];//附件对象集合

    //preheader();//抬头初始化
    //获取表单信息
    var item = data.FormDataSet.洁丽康公司_销售订单申请_主表[0];
    console.log(item);
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.单号);
    }

    //抬头表
    $("#填写人").val(item.填写人);
    $("#申请部门").val(item.申请部门);
    $("#填写日期").val(FormatterTimeYMS(item.填写日期));
    $("#联系电话").val(item.联系电话);
    $("#销售组织名称").val(item.销售组织名称);
    $("#销售组织名称").data('fno', item.销售组织编码);
    $("#区域经理").val(item.区域经理);
    $("#区域经理").data('fno', item.区域经理工号);
    $("#是否导入").val(item.是否导入);

    $("#客户名称").val(item.客户名称);
    $("#客户名称").data('fno', item.客户编码);
    $("#渠道类型").val(item.渠道类型);
    $("#收款条件名称").val(item.收款条件名称);
    $("#收款条件名称").data('fno', item.收款条件编码);
    $("#订单日期").val(FormatterTimeYMS(item.订单日期));
    $("#币别名称").val(item.币别名称);
    $("#币别名称").data('fno', item.币别编码);
    $("#交货方式名称").val(item.交货方式名称);
    $("#交货方式名称").data('fno', item.交货方式编码);
    $("#销售员名称").val(item.销售员名称);
    $("#销售员名称").data('fno', item.销售员编码);
    $("#销售组名称").val(item.销售组名称);
    $("#销售组名称").data('fno', item.销售组编码);
    $("#部门名称").val(item.部门名称);
    $("#部门名称").data('fno', item.部门编码);
    $("#送货地址").val(item.送货地址);
    $("#摘要").val(item.摘要);
    //$("#TaskID").val(item.TaskID);

    //
    /*$("#是否借款").val(item.是否借款);
    if (item.是否赊销 == '是') {
        $("#是否赊销").addClass('mui-active');
    }*/
    $("#是否赊销").val(item.是否赊销);
    $("#赊销审核级别").val(item.赊销审核级别);
    $("#赊销审核备注").val(item.赊销审核备注);
    $("#价格审核级别").val(item.价格审核级别);
    $("#价格审核备注").val(item.价格审核备注);

    //
    $("#汇率").val(item.汇率);
    $("#税率").val(item.税率);
    $("#付款方式名称").val(item.付款方式名称);
    $("#付款方式名称").data('fno', item.付款方式编码);
    $("#业务类型名称").val(item.业务类型名称);
    $("#业务类型名称").data('fno', item.业务类型编码);
    $("#财务组织编码").val(item.财务组织编码);
    $("#库存组织编码").val(item.库存组织编码);
    $("#是否含税").val(item.是否含税);
    $("#可销售").val(item.可销售);


    //$("#附件").val(item.附件);
    //fjArrayList.push(item.附件);//抬头附件
   

    //明细表
    var item_c = data.FormDataSet.洁丽康公司_销售订单申请_子表1;
    console.log(item_c);
    for (var i = 0; i < item_c.length; i++) {
        flag_maxrow = i + 1;
        //console.log(item_c[i].请假事由);
        itemidArr.push(item_c[i].itemid);

        var li = setli(flag_maxrow, item_c[i].物料编码, item_c[i].物料名称, item_c[i].规格型号, item_c[i].计量单位, item_c[i].计量单位编码, item_c[i].数量,item_c[i].实际含税单价,item_c[i].价税合计,item_c[i].备注, '',i);
        $("#mxlist").append(li);
        
        //fjArrayList.push(item_c[i].附件);//明细附件
    }


    //获取所有附件信息
    fjArrayListEvery = fjArrayList.join(";").split(";");
    //console.log(fjArrayListEvery);
    $.ajax({
        type: 'POST',
        url: '/api/bpm/GetAttachmentsInfo',

        data: { 'fileIds': fjArrayListEvery },

        beforeSend: function (XHR) {
            XHR.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem('ticket'));
        }

    }).done(function(data){
        //console.log(data);
    if (data.length == 0) {
        //console.log('返回结果为空');
    }
    for (var i = 0; i < data.length; i++){
        //请求返回到的附件信息
        var obj = {
            'Ext': String(data[i].Ext).replace(".", ""),
            'FileID': data[i].FileID,
            'LParam1': data[i].LParam1,
            'LastUpdate': String(data[i].LastUpdate).replace("T", " "),
            'MimeType': data[i].MimeType,
            'Name': data[i].Name,
            'OwnerAccount': data[i].OwnerAccount,
            'Size': String(data[i].Size),
            'DownloadUrl': baseDownloadUrl + data[i].FileID
        }
        fjArrayObjCollections.push(obj);
    }
        

    }).fail(function(e){

    }).then(function(data){
       
        //附件信息显示
        $("#filecard,#mxlist").find("input[name='fj_info_ids']").each(function (index, element) {
            
            var fjInfoIds = $(this).val();
            //console.log(fjInfoIds);
        for (var i = 0; i < fjArrayObjCollections.length; i++){
            if (String(fjInfoIds).match(fjArrayObjCollections[i].FileID) != null) {
                //console.log(fjArrayObjCollections[i]);
                var li = '';
                if (String(fjArrayObjCollections[i].Ext).match('png') != null || String(fjArrayObjCollections[i].Ext).match('jpg') != null || String(fjArrayObjCollections[i].Ext).match('jpg') != null) {
                    li = AssembledDom(fjArrayObjCollections[i].Ext, baseDownloadUrl + fjArrayObjCollections[i].FileID, fjArrayObjCollections[i].FileID);
                } else {
                    li = AssembledDom(fjArrayObjCollections[i].Ext, '', fjArrayObjCollections[i].FileID);
                }
                $(this).parent().parent().parent().find("#imglist").append(li);
            }
        }
    });
    
        //附件点击事件
    $(".imgdiv").each(function () {
      $(this).on('tap', function () {
        //console.log($(this).attr('id'));
        var fileid = $(this).attr('id');
        for (var i = 0; i < fjArrayObjCollections.length; i++){
            if (String(fjArrayObjCollections[i].FileID).match(fileid) != null) {
                //console.log(fjArrayObjCollections[i]);
                XuntongJSBridge.call('showFile', {
                    'fileName': fjArrayObjCollections[i].Name,
                    'fileExt': fjArrayObjCollections[i].Ext,
                    'fileTime': fjArrayObjCollections[i].LastUpdate,
                    'fileSize': fjArrayObjCollections[i].Size,
                    'fileDownloadUrl': fjArrayObjCollections[i].DownloadUrl
                }, function (result) {
                    //alert(JSON.stringify(result));
                   });
             }
         }
      });

     });

});


    //初始化待办、已办、已申请表单信息
    //initlink();//初始化联动信息
    $(".node1").attr('readonly', 'readonly');//发起权限字段只读
    $(".node1").removeAttr('placeholder');//发起权限字段提示隐藏
    $(".node2").attr('readonly', 'readonly');//发起权限字段只读
    $(".node2").removeAttr('placeholder');//发起权限字段提示隐藏
    //$("#addbtn_fj").css("display", "none");//隐藏附件上传按钮
    $("#tjmx").hide();//隐藏添加明细按钮
    $("#sxmx").hide();//隐藏赊销查询按钮
    $("#mxlist").find('#mx').each(function () {
        $(this).find("#deleteProduct").hide();//隐藏明细删除按钮
        $(this).find("#addbtn_fj").css("display", "none");//隐藏附件上传按钮
    });
    //$("#fif_dr").addClass('mui-disabled');//switch开关无效
    Calculate();//合计
    
}

//拼装dom
function AssembledDom(fileExt, url,id) {
    var li = ``;
    var picext = ['png','jpg','bmp'];
    //pic
    //if (String(fileExt).match('png') != null || String(fileExt).match('jpg') != null || String(fileExt).match('bmp') != null) {
    if (picext.includes(String(fileExt))) {
        li = `
              <div class="pic-preview smallyulan success">
                  <div class="del none" style="opacity:1;z-index:999;display:none;"onclick="delPicture(this)">x</div>
                      <div class="img-wrap smallimg imgdiv" id="${id}"><img src="${url}"/></div>
                  </div>
              </div>  
             `;
        //excel
    } else if (String(fileExt).match('xls') != null) {
        li = `
              <div class="pic-preview smallyulan success">
                  <div class="del none" style="opacity:1;z-index:999;display:none;"onclick="delPicture(this)">x</div>
                     <div class="img-wrap smallimg imgdiv" id="${id}"><img src="../../../../Content/images/xlsx@2x.png"/></div>
                  </div>
              </div>  
             `;
        //word
    } else if (String(fileExt).match('doc') != null){
        li = `
              <div class="pic-preview smallyulan success">
                  <div class="del none" style="opacity:1;z-index:999;display:none;"onclick="delPicture(this)">x</div>
                     <div class="img-wrap smallimg imgdiv" id="${id}"><img src="../../../../Content/images/docx@2x.png"/></div>
                  </div>
              </div>  
             `;
        //ppt
    } else if (String(fileExt).match('ppt') != null) {
        li = `
              <div class="pic-preview smallyulan success">
                  <div class="del none" style="opacity:1;z-index:999;display:none;"onclick="delPicture(this)">x</div>
                     <div class="img-wrap smallimg imgdiv" id="${id}"><img src="../../../../Content/images/ppt@2x.png"/></div>
                  </div>
              </div>  
             `;
        //pdf
    } else if (String(fileExt).match('pdf') != null) {
        li = `
              <div class="pic-preview smallyulan success">
                  <div class="del none" style="opacity:1;z-index:999;display:none;"onclick="delPicture(this)">x</div>
                     <div class="img-wrap smallimg imgdiv" id="${id}"><img src="../../../../Content/images/pdf@2x.png"/></div>
                  </div>
              </div>  
             `;
        //zip
    } else if (String(fileExt).match('zip') != null || String(fileExt).match('7z') != null || String(fileExt).match('rar') != null) {
        li = `
              <div class="pic-preview smallyulan success">
                  <div class="del none" style="opacity:1;z-index:999;display:none;"onclick="delPicture(this)">x</div>
                     <div class="img-wrap smallimg imgdiv" id="${id}"><img src="../../../../Content/images/zip@2x.png"/></div>
                  </div>
              </div>  
             `;
        //txt
    } else if (String(fileExt).match('txt') != null) {
        li = `
              <div class="pic-preview smallyulan success">
                  <div class="del none" style="opacity:1;z-index:999;display:none;"onclick="delPicture(this)">x</div>
                     <div class="img-wrap smallimg imgdiv" id="${id}"><img src="../../../../Content/images/txt@2x.png"/></div>
                  </div>
              </div>  
             `;
        //other
    } else {
        li = `
              <div class="pic-preview smallyulan success">
                  <div class="del none" style="opacity:1;z-index:999;display:none;"onclick="delPicture(this)">x</div>
                     <div class="img-wrap smallimg imgdiv" id="${id}"><img src="../../../../Content/images/unkown@2x.png"/></div>
                  </div>
              </div>  
             `;
    }
    
    return li;
}

//待办--节点控制字段
function nodeControllerExp(NodeName) {
    $("#csd").css('display', 'none');//不加签
    console.log(NodeName);
    //mui.toast(NodeName);
    if (NodeName == '开始') {//返回重填,开始节点
        //$("#fif_jk").removeClass('mui-disabled');//switch按钮打开
        tapEvent();//点击事件
        //tapEvent_csswitch();//加签事件
        //$("#addbtn_fj").css("display", "block");//显示附件上传按钮
        //upload();//允许附件上传
        $("#fszcard").hide();//隐藏赊销信息
        $("#tjmx").show();//添加明细按钮及删除图标

        $("#联系电话").attr('placeholder', '请填写联系电话');//提示
        $("#销售组织名称").attr('placeholder', '请选择销售组织');//提示
        $("#区域经理").attr('placeholder', '请选择区域经理');//提示
        $("#客户名称").attr('placeholder', '请选择客户名称');//提示
        $("#送货地址").attr('placeholder', '请填写送货地址');//提示
        $("#摘要").attr('placeholder', '请填写摘要');//提示
     
        $("#mxlist").find('#mx').each(function () {
            $(this).find("#deleteProduct").show();//显示明细删除按钮
            $(this).find("#addbtn_fj").css("display", "block");//显示附件上传按钮

            $(this).find("#物料编码").attr('placeholder', '请选择物料编码');
            $(this).find("#数量").attr('placeholder', '请输入数量');
            $(this).find("#实际含税单价").attr('placeholder', '请输入实际含税单价');
            $(this).find("#备注").attr('placeholder', '请输入备注');
        });
       
        $("#fszcard").hide();//隐藏赊销信息

        /*
        //此流程app只审批不发起
        $("#commitbt").hide();
        mui.alert('请在网页上提交该流程!');
        */
    }
    else if (NodeName == '订单审核岗'){
        tapEvent_header1();
        $("#fszcard").show();//显示赊销信息
        $(".node2").removeAttr('readonly');//可编辑

        $("#是否赊销").attr('placeholder', '请选择是否赊销');//提示
        $("#赊销审核级别").attr('placeholder', '请选择赊销审核级别');//提示
        $("#赊销审核备注").attr('placeholder', '请填写赊销审核备注');//提示
        $("#价格审核级别").attr('placeholder', '请选择价格审核级别');//提示
        $("#价格审核备注").attr('placeholder', '请填写价格审核备注');//提示
    }
    else{
        $("#fszcard").show();//显示赊销信息
    }
}

//json字符串对象生成及明细表必输项检查
function mxItem(fwlbm, fwlmc, fggxh, fdwmc, fdwbm, fsl,fhsdj,fjshj,fbz) {        
        var mx = Object.create({
            fwlbm: fwlbm,
            fwlmc: fwlmc,
            fggxh: fggxh,
            fdwmc: fdwmc,
            fdwbm: fdwbm,
            fsl: fsl,
            fhsdj: fhsdj,
            fjshj: fjshj,
            fbz: fbz,

            _check: function () {
                
                if (!fwlbm) {
                    mui.toast('请选择物料编码');
                    return null;
                }
                if (!fsl) {
                    mui.toast('请输入数量');
                    return null;
                }
                if (!fhsdj) {
                    mui.toast('请输入实际含税单价');
                    return null;
                }

                return mx;
            }

        });

        return mx._check();
    }



//抬头表必输项检查
function check(Method, Action, nodeName, fzzmc,fjlmc,fkhmc,fshdz,fif_sx,fsxjb,fjgjb) {
    
    /*if ((String(nodeName).match('开始') != null) || (String(nodeName).match('undefined') != null)) {*/
    if (((String(Method).match('Post') != null) && (String(Action).match('提交') != null))||(String(nodeName).match('开始') != null)){
        //如果是发起或重新发起状态
        if (!fzzmc) {
            mui.toast('请选择销售组织');
            return false;
        }
        if (!fjlmc) {
            mui.toast('请选择区域经理');
            return false;
        }
        if (!fkhmc) {
            mui.toast('请选择客户名称');
            return false;
        }
        if (!fshdz) {
            mui.toast('请输入送货地址');
            return false;
        }

    }
    else if(String(nodeName).match('订单审核岗') != null) {
        //如果是发起或重新发起状态
        if (!fif_sx) {
            mui.toast('请选择是否赊销');
            return false;
        }
        if (!fsxjb) {
            mui.toast('请选择赊销审核级别');
            return false;
        }
        if (!fjgjb) {
            mui.toast('请选择价格审核级别');
            return false;
        }
    }

    return true;
}

function check_xml(Method, Action, flag_switch, consignUserStr, consignRoutingType, consignReturnType) {
    var flag_check = true;//检查标识
    //表单信息
    var pid = $("#stepId").val();
    var fbillno = $("#fbillno").val();
    var comment = $("#signSuggest").val();
    var nodeName = $("#nodeName").val();
    //mui.toast(nodeName);

    //抬头表
    var fname = $("#填写人").val();
    var fdept = $("#申请部门").val();
    var fdate = $("#填写日期").val();
    var ftel = $("#联系电话").val();

    var fzzmc = $("#销售组织名称").val();
    var fzzbm = $("#销售组织名称").data('fno');
    var fjlmc = $("#区域经理").val();
    var fjlbm = $("#区域经理").data('fno');
    var fif_dr = $("#是否导入").val();
    var fkhmc = $("#客户名称").val();
    var fkhbm = $("#客户名称").data('fno');
    var fqdlx = $("#渠道类型").val();
    var ftjmc = $("#收款条件名称").val();
    var ftjbm = $("#收款条件名称").data('fno');
    var fddrq = $("#订单日期").val();
    var fbbmc = $("#币别名称").val();
    var fbbbm = $("#币别名称").data('fno');
    var fjhmc = $("#交货方式名称").val();
    var fjhbm = $("#交货方式名称").data('fno');
    var fymc = $("#销售员名称").val();
    var fybm = $("#销售员名称").data('fno');
    var fzmc = $("#销售组名称").val();
    var fzbm = $("#销售组名称").data('fno');
    var fbmmc = $("#部门名称").val();
    var fbmbm = $("#部门名称").data('fno');
    var fshdz = $("#送货地址").val();
    var fzy = $("#摘要").val();

    var fif_sx = $("#是否赊销").val();
    var fsxjb = $("#赊销审核级别").val();
    var fsxbz = $("#赊销审核备注").val();
    var fjgjb = $("#价格审核级别").val();
    var fjgbz = $("#价格审核备注").val();

    var fhl = $("#汇率").val();
    var fvsl = $("#税率").val();
    var ffkbm = $("#付款方式名称").data('fno');
    var ffkmc = $("#付款方式名称").val();
    var fywbm = $("#业务类型名称").data('fno');
    var fywmc = $("#业务类型名称").val();
    var fcwbm = $("#财务组织编码").val();
    var fkcbm = $("#库存组织编码").val();
    var fif_hs = $("#是否含税").val();
    //var ftaskid = $("#TaskID").val();
    var ftaskid=$("#taskId").val();
    //var ffj = $("#附件").val();
    
   
    //必输项检查
    flag_check = check(Method, Action, nodeName, fzzmc,fjlmc,fkhmc,fshdz,fif_sx,fsxjb,fjgjb);
    if (!flag_check) {//如果返回false  
        return null;
    }

    //明细表
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        
        var fwlbm = $(this).find("#物料编码").val();
        var fwlmc = $(this).find("#物料名称").val();
        var fggxh = $(this).find("#规格型号").val();
        var fdwmc = $(this).find("#计量单位").val();
        var fdwbm = $(this).find("#计量单位").data('fno');
        var fsl = $(this).find("#数量").val();
        var fhsdj = $(this).find("#实际含税单价").val();
        var fjshj = $(this).find("#价税合计").val();
        var fbz = $(this).find("#备注").val();
        
        var mx = mxItem(fwlbm, fwlmc, fggxh, fdwmc, fdwbm, fsl,fhsdj,fjshj,fbz);
        if (!mx) {
            flag_check = false;
            return null;
        }
        else {
            mxlistArr.push(mx);
        }
    });
    //如果检查报错  
    if (!flag_check) {
        return null;
    }

    //set xml
    var xml = '<?xml version= "1.0" ?>';
    xml = xml + '   <XForm>';
    xml = xml + '        <Header>';
    xml = xml + '          <Method>' + Method + '</Method>';

    if (Method == "Post" && Action == "提交") {//发起提交
        xml = xml + '          <ProcessName>洁丽康公司销售订单申请</ProcessName>';
        xml = xml + '          <ProcessVersion>' + version + '</ProcessVersion>';
        xml = xml + '          <DraftGuid></DraftGuid>';
        xml = xml + '          <OwnerMemberFullName>' + BPMOU + '</OwnerMemberFullName>';
        xml = xml + '          <Action>' + Action + '</Action>';
        xml = xml + '          <Comment></Comment>';
        xml = xml + '          <UrlParams></UrlParams>';
    } else if (Method == "Process") {//重新发起提交、审批同意
        xml = xml + '          <PID>' + pid + '</PID>';
        xml = xml + '          <Action>' + Action + '</Action>';
        xml = xml + '          <Comment>' + comment + '</Comment>';
    }

    if (Method == "Process" && Action == "同意" && flag_switch ==true) {//审批同意--加签
        xml = xml + '      <ConsignEnabled>true</ConsignEnabled>';
        xml = xml + '      <ConsignUsers>' + consignUserStr + '</ConsignUsers>';
        xml = xml + '      <ConsignRoutingType>' + consignRoutingType + '</ConsignRoutingType>';
        xml = xml + '      <ConsignReturnType>' + consignReturnType + '</ConsignReturnType>';
    }else {//非加签的情况
        xml = xml + '      <ConsignEnabled>false</ConsignEnabled>';
        xml = xml + '      <ConsignUsers>[]</ConsignUsers>';
        xml = xml + '      <ConsignRoutingType>Parallel</ConsignRoutingType>';
        xml = xml + '      <ConsignReturnType>Return</ConsignReturnType>';
    }

    xml = xml + '          <InviteIndicateUsers>[]</InviteIndicateUsers>';
    xml = xml + '          <Context>{&quot;Routing&quot;:{}}</Context>';
    xml = xml + '        </Header>';

    xml = xml + '        <FormData>';
    //抬头表
    xml = xml + '      <洁丽康公司_销售订单申请_主表>';

    if (Method == "Post" && Action == "提交") {//发起提交
        xml = xml + '           <单号>自动生成</单号>';
    } else if (Method == "Process") {//重新发起提交、审批同意
        xml = xml + '           <单号>' + fbillno + '</单号>';
    }
    //
    xml = xml + '               <填写人>' + fname + '</填写人>';
    xml = xml + '               <填写日期>' + fdate + '</填写日期>';
    xml = xml + '               <联系电话>' + ftel + '</联系电话>';
    //
    xml = xml + '               <销售组织名称>' + fzzmc + '</销售组织名称>';
    xml = xml + '               <区域经理>' + fjlmc + '</区域经理>';
    xml = xml + '               <是否导入>' + fif_dr + '</是否导入>';
    xml = xml + '               <客户名称>' + fkhmc + '</客户名称>';
    xml = xml + '               <渠道类型>' + fqdlx + '</渠道类型>';
    //
    xml = xml + '               <收款条件名称>' + ftjmc + '</收款条件名称>';
    xml = xml + '               <订单日期>' + fddrq + '</订单日期>';
    xml = xml + '               <币别名称>' + fbbmc + '</币别名称>';
    xml = xml + '               <交货方式名称>' + fjhmc + '</交货方式名称>';
    xml = xml + '               <销售员名称>' + fymc + '</销售员名称>';
    xml = xml + '               <销售组名称>' + fzmc + '</销售组名称>';
    xml = xml + '               <部门名称>' + fbmmc + '</部门名称>';
    xml = xml + '               <送货地址>' + fshdz + '</送货地址>';
    xml = xml + '               <摘要>' + fzy + '</摘要>';
    //
    xml = xml + '               <是否赊销>' + fif_sx + '</是否赊销>';
    xml = xml + '               <赊销审核级别>' + fsxjb + '</赊销审核级别>';
    xml = xml + '               <赊销审核备注>' + fsxbz + '</赊销审核备注>';
    xml = xml + '               <价格审核级别>' + fjgjb + '</价格审核级别>';
    xml = xml + '               <价格审核备注>' + fjgbz + '</价格审核备注>';
    //
    //console.log(ftaskid);
    if (Method == "Post" && Action == "提交") {//发起提交
        xml = xml + '               <TaskID></TaskID>';
    } else if (Method == "Process") {//重新发起提交、审批同意
        xml = xml + '           <TaskID>' + ftaskid + '</TaskID>';
    }
    xml = xml + '               <销售组织编码>' + fzzbm + '</销售组织编码>';
    xml = xml + '               <区域经理工号>' + fjlbm + '</区域经理工号>';
    xml = xml + '               <客户编码>' + fkhbm + '</客户编码>';
    xml = xml + '               <收款条件编码>' + ftjbm + '</收款条件编码>';
    xml = xml + '               <币别编码>' + fbbbm + '</币别编码>';
    xml = xml + '               <汇率>' + fhl + '</汇率>';
    xml = xml + '               <税率>' + fvsl + '</税率>';
    xml = xml + '               <交货方式编码>' + fjhbm + '</交货方式编码>';
    xml = xml + '               <销售员编码>' + fybm + '</销售员编码>';
    xml = xml + '               <销售组编码>' + fzbm + '</销售组编码>';
    xml = xml + '               <部门编码>' + fbmbm + '</部门编码>';
    xml = xml + '               <付款方式编码>' + ffkbm + '</付款方式编码>';
    xml = xml + '               <付款方式名称>' + ffkmc + '</付款方式名称>';
    xml = xml + '               <业务类型编码>' + fywbm + '</业务类型编码>';
    xml = xml + '               <业务类型名称>' + fywmc + '</业务类型名称>';
    xml = xml + '               <财务组织编码>' + fcwbm + '</财务组织编码>';
    xml = xml + '               <库存组织编码>' + fkcbm + '</库存组织编码>';
    xml = xml + '               <是否含税>' + fif_hs + '</是否含税>';
    xml = xml + '               <申请部门>' + fdept + '</申请部门>';

    //xml = xml + '               <附件>' + fjArray.join(';') + '</附件>';
    xml = xml + '           </洁丽康公司_销售订单申请_主表>';

 //明细表
    for (var i = 0; i < mxlistArr.length; i++) {
        xml = xml + ' <洁丽康公司_销售订单申请_子表1>';
        xml = xml + '  <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';

        if ((Method == "Post" && Action == "提交") || (Method == "Process" && Action == "提交")) {//发起提交、重新发起提交
            xml = xml + '  <RowPrimaryKeys></RowPrimaryKeys>';
        }
        else if ((Method == "Process" && Action == "同意")||(Method == "Process" && Action == "到账")||(Method == "Process" && Action == "完成")) {//同意、到账、完成
            xml = xml + '  <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
        }

        //xml = xml + '  <fentryno>' + (i + 1) + '</fentryno>';

        xml = xml + '  <物料编码>' + mxlistArr[i].fwlbm + '</物料编码>';
        xml = xml + '  <物料名称>' + mxlistArr[i].fwlmc + '</物料名称>';
        xml = xml + '  <规格型号>' + mxlistArr[i].fggxh + '</规格型号>';
        xml = xml + '  <计量单位>' + mxlistArr[i].fdwmc + '</计量单位>';
        xml = xml + '  <计量单位编码>' + mxlistArr[i].fdwbm + '</计量单位编码>';
        xml = xml + '  <数量>' + mxlistArr[i].fsl + '</数量>';
        xml = xml + '  <实际含税单价>' + mxlistArr[i].fhsdj + '</实际含税单价>';
        xml = xml + '  <价税合计>' + mxlistArr[i].fjshj + '</价税合计>';
        xml = xml + '  <备注>' + mxlistArr[i].fbz + '</备注>';

        xml = xml + ' </洁丽康公司_销售订单申请_子表1>';
    }
   
    xml = xml + '        </FormData>';
    xml = xml + '</XForm>';
    console.log(xml);
    return xml;
}

//发起保存按钮
function Save() {
    var Method = "Post";
    var Action = "提交";
    var consignRoutingType;
    var consignReturnType;
    var consignUserStr;

    //检查及获取xml
    var xml = check_xml(Method, Action, flag_switch, consignUserStr, consignRoutingType, consignReturnType);
    if (!xml) {//如果返回null
        return;
    }
   
    //弹窗确定提交
    var btnArry = ["取消", "确定"];
    mui.confirm('即将提交,是否确定？', '提交确认提醒', btnArry, function (e) {
        if (e.index == 1) {//如果是确定
            PostXml(xml);
        }
    });

}

//返回重新提交按钮
function reSave() {
    var Method = "Process";
    var Action = "提交";
    var consignRoutingType;
    var consignReturnType;
    var consignUserStr;
 
    //检查及获取xml
    var xml = check_xml(Method, Action, flag_switch, consignUserStr, consignRoutingType, consignReturnType);
    if (!xml) {//如果返回null
        return;
    }

    //弹窗确定提交
    var btnArry = ["取消", "确定"];
    mui.confirm('即将提交,是否确定？', '提交确认提醒', btnArry, function (e) {
        if (e.index == 1) {//如果是确定
            PostXml(xml);
        }
    });

}

//待办--同意按钮
function AgreeOrConSign() {
    var Method = "Process";
    var Action = "同意";

    var nodeName = $("#nodeName").val();
    if (nodeName=="订单执行岗"){
        Action = "完成";
    }else if(nodeName=="财务部审核人"){
        Action = "到账";
    }
    

    //加签参数
    var consignUserId = new Array();
    var consignRoutingType;
    var consignReturnType;
    var consignUserStr;

    //同意
    if (flag_switch)//如果选择加签
    {
        if (($('#signPer').val() != null) && ($('#signPer').val() != ''))//如果加签人不为空
        {
            //get consignRoutingType
            if ($('#sxsl').hasClass('mui-selected')) {//顺序加签
                consignRoutingType = 'Serial';
            } else if ($('#pxsl').hasClass('mui-selected')) {//平行加签
                consignRoutingType = 'Parallel';
            }

            //get consignReturnType
            if ($('#hdbjdl').hasClass('mui-selected')) {//回到本节点
                consignReturnType = 'Return';
            } else if ($('#jrxjdl').hasClass('mui-selected')) {//进入下一节点
                consignReturnType = 'Forward';
            }

            //ajax异步函数执行结束后,要执行的代码可写入consignAjax.then(function () {...});
            //consignUserStr参数的使用要在函数执行结束后使用,否则为undefined,
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

                    //检查及获取xml
                    var xml = check_xml(Method, Action, flag_switch, consignUserStr, consignRoutingType, consignReturnType);
                    if (!xml) {//如果返回null
                        return;
                    }

                    PostXml(xml);

                }
            }).fail(function () {

            });
        }
        else//如果加签人为空
        {
            mui.toast('请选择加签人');
            return null;
        }
    }

    else//如果不加签
    {
        //检查及获取xml
        var xml = check_xml(Method, Action, flag_switch, consignUserStr, consignRoutingType, consignReturnType);
        if (!xml) {//如果返回null
            return;
        }

        PostXml(xml);
    }

}

//已阅按钮
function hasRead() {
    //表单信息
    var pid = $("#stepId").val();
    //var fbillno = $("#fbillno").val();
    //var nodeName = $("#nodeName").val();
    var comment = '';

    //弹窗确定提交
    var btnArry = ['取消', '确定'];
    mui.prompt('请选填知会意见', '可以不填', '知会意见', btnArry, function (e) {
        if (e.index == 1) {
            comment = e.value;

            var xml = '<?xml version="1.0"?>';
            xml = xml + '<XForm>';
            xml = xml + '  <Header>';
            xml = xml + '     <Method>InformSubmit</Method>';
            xml = xml + '     <PID>' + pid + '</PID>';
            xml = xml + '     <Comment>' + comment + '</Comment>';
            xml = xml + '  </Header>';
            xml = xml + '</XForm>';

            PostXml(xml);
        }
    });
}

//通过存储过程获取相应数据 
function getProcedureMsg() { 
    var fxszzno = $("#销售组织名称").data('fno');
    var fif_xs = $("#可销售").val();
    //console.log(flag_name);
    //console.log(fxszzno);

    //拼接xml语句
    var xml;
    if (flag_name == 'fxszz') {//销售组织子表
        xml = '<?xml version= "1.0" ?>';//xml声明之前不能有空格
        xml = xml + '     <Requests>';
        xml = xml + '       <Params>';
        xml = xml + '         <DataSource>BPM_WEGO2018</DataSource>';
        xml = xml + '         <ID>erpcloud_查询eas洁丽康公司销售员视图</ID>';
        xml = xml + '         <Type>1</Type>';
        xml = xml + '         <Method>GetUserDataProcedure</Method>';
        xml = xml + '         <ProcedureName>erpcloud_查询eas洁丽康公司销售员视图</ProcedureName>';
        xml = xml + '         <Filter>';
        xml = xml + '           <fno>' + accountBPM + '</fno>';
        xml = xml + '         </Filter>';
        xml = xml + '       </Params>';
        xml = xml + '     </Requests>';
    }
    else if(flag_name == 'fkhmc'){//客户名称子表
        xml = '<?xml version= "1.0" ?>';//xml声明之前不能有空格
        xml = xml + '     <Requests>';
        xml = xml + '       <Params>';
        xml = xml + '         <DataSource>BPM_WEGO2018</DataSource>';
        xml = xml + '         <ID>erpcloud_查询eas洁丽康公司客户销售员视图</ID>';
        xml = xml + '         <Type>1</Type>';
        xml = xml + '         <Method>GetUserDataProcedure</Method>';
        xml = xml + '         <ProcedureName>erpcloud_查询eas洁丽康公司客户销售员视图</ProcedureName>';
        xml = xml + '         <Filter>';
        xml = xml + '           <fno>' + accountBPM + '</fno>';
        xml = xml + '           <fzno>' + fxszzno + '</fzno>';
        xml = xml + '         </Filter>';
        xml = xml + '       </Params>';
        xml = xml + '     </Requests>';
    }
    else if(flag_name == 'fwlbm'){//物料编码子表
        xml = '<?xml version= "1.0" ?>';//xml声明之前不能有空格
        xml = xml + '     <Requests>';
        xml = xml + '       <Params>';
        xml = xml + '         <DataSource>BPM_WEGO2018</DataSource>';
        xml = xml + '         <ID>erpcloud_查询eas洁丽康公司产品主表</ID>';
        xml = xml + '         <Type>1</Type>';
        xml = xml + '         <Method>GetUserDataProcedure</Method>';
        xml = xml + '         <ProcedureName>erpcloud_查询eas洁丽康公司产品主表</ProcedureName>';
        xml = xml + '         <Filter>';
        xml = xml + '           <fif>' + fif_xs + '</fif>';
        xml = xml + '         </Filter>';
        xml = xml + '       </Params>';
        xml = xml + '     </Requests>';
    }
    //console.log(xml);

    //调用bpm存储过程  
        $.ajax({
            type: "POST",
            url: "/api/bpm/DataProvider",
            data: { '': xml },

            beforeSend: function (XHR) {
                XHR.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem('ticket'));
            }

        }).done(function (data) {
            //存储过程数据展示
            var provideData = JSON.parse(unescape(data.replace(/\\(u[0-9a-fA-F]{4})/gm, '%$1')));
            var itemData = provideData.Tables[0].Rows;
            //console.log(itemData);

            $("#datalist").empty();//清除之前数据           
            if (flag_name == 'fxszz') {//销售组织子表
                for (var i = 0; i < itemData.length; i++) {
                    var li = '<li data-value="" data-tags="" class="mui-table-view-cell mui-indexed-list-item mui-radio mui-left">';
                    li += '<input type="radio" name="radio" ';
                    li += 'data-fzzbm="' + itemData[i].销售组织编码 + '"';
                    li += 'data-fzzmc="' + itemData[i].销售组织名称 + '"';
                    li += 'data-fzbm="' + itemData[i].销售组编码 + '"';
                    li += 'data-fzmc="' + itemData[i].销售组名称 + '"';
                    li += '/>销售组织:' + itemData[i].销售组织编码 + '[' + itemData[i].销售组织名称+ ']'+' || '+'销售组:' + itemData[i].销售组编码 + '[' + itemData[i].销售组名称+ ']';
                    li += '</li>';

                    $("#datalist").append(li);
                }
            }
            else if(flag_name == 'fkhmc'){//客户名称子表
                for (var i = 0; i < itemData.length; i++) {
                    var li = '<li data-value="" data-tags="" class="mui-table-view-cell mui-indexed-list-item mui-radio mui-left">';
                    li += '<input type="radio" name="radio" ';
                    li += 'data-fkhbm="' + itemData[i].客户编码 + '"';
                    li += 'data-fkhmc="' + itemData[i].客户名称 + '"';
                    li += 'data-fzzmc="' + itemData[i].销售组织名称 + '"';
                    li += 'data-fvsl="' + itemData[i].税率 + '"';
                    li += 'data-fqdmc="' + itemData[i].渠道类型 + '"';
                    li += 'data-ftjbm="' + itemData[i].收款条件编码 + '"';
                    li += 'data-ftjmc="' + itemData[i].收款条件名称 + '"';

                    li += '/>客户:' + itemData[i].客户编码 + '[' + itemData[i].客户名称+ ']'+' || '+'销售组织:' +'['+ itemData[i].销售组织名称 + ']';
                    li += '</li>';

                    $("#datalist").append(li);
                }
            }
            else if(flag_name == 'fwlbm'){//物料编码子表
                for (var i = 0; i < itemData.length; i++) {
                    var li = '<li data-value="" data-tags="" class="mui-table-view-cell mui-indexed-list-item mui-radio mui-left">';
                    li += '<input type="radio" name="radio" ';
                    li += 'data-fwlbm="' + itemData[i].物料编码 + '"';
                    li += 'data-fwlmc="' + itemData[i].物料名称 + '"';
                    li += 'data-fggxh="' + itemData[i].规格型号 + '"';
                    li += 'data-fdwbm="' + itemData[i].基本计量单位编码 + '"';
                    li += 'data-fdwmc="' + itemData[i].基本计量单位名称 + '"';
                    li += 'data-fbz="' + itemData[i].备注 + '"';
                    li += '/>物料:' + itemData[i].物料编码 + '[' + itemData[i].物料名称+ ']'+' || '+'规格型号:' + itemData[i].规格型号 +' || '+'备注:' + itemData[i].备注;
                    li += '</li>';

                    $("#datalist").append(li);
                }
            }

        }).fail(function (error) {

        }).then(function (data) {
            //创建索引列表
            prepIndexedList();

        });

}


//准备索引列表前置
function prepIndexedList() {
    //console.log(flag_name);

    var header = document.querySelector('header.mui-bar');
    var list = document.querySelector('#list');
    var done = document.querySelector('#done');
    //计算高度 
    list.style.height = (document.body.offsetHeight - header.offsetHeight) + 'px';
    //create
    window.indexedList = new mui.IndexedList(list);

    //重新绑定对应事件
    done.removeEventListener('tap', checkEvent, false);
    done.addEventListener('tap', checkEvent, false);
    mui('.mui-indexed-list-inner').on('change', 'input', function () {
        var count = list.querySelectorAll('input[type="radio"]:checked').length;
        var value = count ? "完成(" + count + ")" : "完成";
        done.innerHTML = value;
        if (count) {
            if (done.classList.contains("mui-disabled")) {
                done.classList.remove("mui-disabled");
            }
        } else {
            if (!done.classList.contains("mui-disabled")) {
                done.classList.add("mui-disabled");
            }
        }
    });

}

//子表选择事件
function checkEvent() {
    
    //子表选中信息获取
    var checkboxArray = [].slice.call(list.querySelectorAll('input[type="radio"]'));
    var checkedValues = [];
    var checkedElements = [];
    checkboxArray.forEach(function (box) {
        if (box.checked) {
            checkedValues.push(box.parentNode.innerText);
           
            if (flag_name == 'fxszz') { //销售组织子表
                var checkEl = {
                fzzbm: $(box).data('fzzbm'),
                fzzmc: $(box).data('fzzmc'),
                fzbm: $(box).data('fzbm'),
                fzmc: $(box).data('fzmc')
                };
                checkedElements.push(checkEl);
            } 
            else if(flag_name == 'fkhmc'){//客户名称子表
                var checkE2 = {
                    fkhbm: $(box).data('fkhbm'),
                    fkhmc: $(box).data('fkhmc'),
                    fzzmc: $(box).data('fzzmc'),
                    fvsl: $(box).data('fvsl'),
                    fqdmc: $(box).data('fqdmc'),
                    ftjbm: $(box).data('ftjbm'),
                    ftjmc: $(box).data('ftjmc')
                };
                checkedElements.push(checkE2);
            }
            else if(flag_name == 'fwlbm'){//物料编码子表
                var checkE3 = {
                    fwlbm: $(box).data('fwlbm'),
                    fwlmc: $(box).data('fwlmc'),
                    fggxh: $(box).data('fggxh'),
                    fdwbm: $(box).data('fdwbm'),
                    fdwmc: $(box).data('fdwmc'),
                    fbz: $(box).data('fbz')
                };
                checkedElements.push(checkE3);
            }
            
        }
    });

    //取消选中
    checkboxArray.forEach(function (box) {
        if (box.checked) {
            box.checked = !box.checked;
        }
    })

    //根据选中元素赋值
    if (checkedValues.length > 0) {
        if (flag_name == 'fxszz') {//销售组织
            $("#销售组织名称").val(checkedElements[0].fzzmc);
            $("#销售组织名称").data('fno', checkedElements[0].fzzbm);
            $("#部门名称").val(checkedElements[0].fzzmc);
            $("#部门名称").data('fno', checkedElements[0].fzzbm);
            $("#销售组名称").val(checkedElements[0].fzmc);
            $("#销售组名称").data('fno', checkedElements[0].fzbm);
        }
        else if(flag_name == 'fkhmc'){//客户名称子表
            //console.log(checkedElements[0]);
            $("#客户名称").val(checkedElements[0].fkhmc);
            $("#客户名称").data('fno', checkedElements[0].fkhbm);
            $("#税率").val(checkedElements[0].fvsl);
            $("#渠道类型").val(checkedElements[0].fqdmc);
            $("#收款条件名称").val(checkedElements[0].ftjmc);
            $("#收款条件名称").data('fno', checkedElements[0].ftjbm);
        }
        else if(flag_name == 'fwlbm'){//物料编码子表
            $("#mxlist").find("#mx").each(function () {
                if ($(this).find("#rowno").val() == flag_nowrow) {
                    //console.log($(this).find("#rowno").val());
                    $(this).find("#物料编码").val(checkedElements[0].fwlbm);
                    $(this).find("#物料名称").val(checkedElements[0].fwlmc);
                    $(this).find("#规格型号").val(checkedElements[0].fggxh);
                    $(this).find("#计量单位").val(checkedElements[0].fdwmc); 
                    //$(this).find("#计量单位编码").val(checkedElements[0].fdwbm); 
                    $(this).find("#计量单位").data('fno', checkedElements[0].fdwbm);
                }
            });
        }


        //选中后页面跳转
        $("#selector").hide();
        $("#wrapper").show();
        $("#datalist").empty();

    }
}




