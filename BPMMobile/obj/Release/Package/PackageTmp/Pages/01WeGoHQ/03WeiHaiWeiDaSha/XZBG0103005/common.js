//全局变量
//class node1节点权限控制字段；node_jk是否借款联动字段；node_dpxq订单需求联动字段;node_cclx出差类型联动字段
var flag_switch = false;//是否加签
var flag_name='';//当前选择字段名
var flag_maxrow = 0;//明细表最大行数
var flag_nowrow = 0;//当前行号

//发起--流程初始化
function prepMsg() {
    //prelist();//明细项初始化
    initlist();//初始化联动信息
    tapEvent();//点击事件
    //upload();//允许附件上传

    //获取发起人信息
    var xml = '<?xml version= "1.0" ?>';
    xml = xml + '<Requests>';
    xml = xml + '    <Params>';
    xml = xml + '      <Method>GetFormPostData</Method>';
    xml = xml + '       <ProcessName>威海卫大厦员工出差申请</ProcessName>';
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
        console.log(provideData);
        var item = provideData.Tables[0].Rows[0];
        $("#申请人").val(item.申请人);
        $("#申请部门").val(item.申请部门);
        //console.log(item.申请人);

    }).fail(function (e) {

    });

    initHeaderMsg.then(function () {
        //获取申请人信息后执行的操作
        $("#申请时间").val(getNowFormatDate(2));//日期
    });

}

//发起--明细项初始化
function prelist() {
    //明细项初始1行
    var li = setli(flag_maxrow, '','');
    $("#mxlist").append(li);
    //document.getElementById('tjmx').scrollIntoView();

    flag_maxrow = 1;//发起流程初始化行号为1
}

//初始化联动信息
function initlist() {
    
    //出差类型联动明细
    var fcclx = $("#出差类型").val();
    if (fcclx == '酒店派出') {
        //$("#fmxcard").show();
        $(".node_cclx").show();
    }
    else {
        //$("#fmxcard").hide();
        $(".node_cclx").hide();
    }
   
    //订票需求联动借出字段
    var fdpxq = $("#订票需求").val();
    if ((fdpxq == '火车票') || (fdpxq == '飞机票')) {
        $(".node_dpxq").show();
    }
    else {
        $(".node_dpxq").hide();
    }

    //是否借款联动字段
    var fif_jk = $("#是否借款").val();
    if (fif_jk=="是") {
        $(".node_jk").show();
    }
    else {
        $(".node_jk").hide();
    }
    
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
    //出差类型下拉
    var fcclxdata = [
        {
            value: '',
            text: '酒店派出'
        },
        {
            value: '',
            text: '部门派出'
        }
    ];
    //showPicker('出差类型', fcclxdata);
    var picker1 = new mui.PopPicker();
    picker1.setData(fcclxdata);
    var ele1 = document.getElementById('出差类型');
    ele1.addEventListener('tap', function () {
        picker1.show(function (items) {
            ele1.value = items[0].text;
            switch (items[0].text) {
                case '酒店派出':
                    $(".node_cclx").show();
                    //$("#fmxcard").show();
                    break;
                default:
                    $(".node_cclx").hide();
                   // $("#fmxcard").hide();
                    break;
            }
        });
    }, false);
    

    //订票需求下拉
    var fdpxqdata = [
        {
            value: '',
            text: '飞机票'
        },
        {
            value: '',
            text: '火车票'
        },
        {
            value: '',
            text: '无'
        }
    ];
    //showPicker('订票需求', fdpxqdata);
    var picker2 = new mui.PopPicker();
    picker2.setData(fdpxqdata);
    var ele2 = document.getElementById('订票需求');
    ele2.addEventListener('tap', function () {
        picker2.show(function (items) {
            ele2.value = items[0].text;
            switch (items[0].text) {
                case '飞机票':
                    $(".node_dpxq").show();
                    break;
                case '火车票':
                    $(".node_dpxq").show();
                    break;
                default:
                    $(".node_dpxq").hide();
                    break;
            }
        });
    }, false);

    //是否借款
    mui('#fif_jk').each(function () {
        this.addEventListener('toggle', function (event) {
            if (event.detail.isActive == 'true' || event.detail.isActive == true) {
                $("#是否借款").val('是');
                $(".node_jk").show();
            } else {
               $("#是否借款").val('否');
                $(".node_jk").hide();
            }

        });
    });

    //借款方式下拉
    var fjkfsdata = [
        {
            value: '',
            text: '现金'
        },
        {
            value: '',
            text: '银行转账'
        },
        {
            value: '',
            text: '支票'
        },
        {
            value: '',
            text: '现金和银行转账'
        }
    ];
    showPicker('借款方式', fjkfsdata);
    
    //知会管理员工号点击事件
    $("#fgly").on('tap', function () {
        var isMulti = true;
        var zeptoId = "#fgly";
        GetPer(zeptoId,isMulti);
    });

    //出差负责人点击事件
    $("#出差负责人").on('tap', function () {
        var isMulti = false;
        var zeptoId = "#出差负责人";
        GetPer(zeptoId, isMulti);
    });

    //出差费用合计事件，注意设置合计项类型为text
    $("#fchcard").find("input[type='number']").on('input', function (event) {
        var ftotal = Calculate(this);//合计
        //var ftmoney = FormatMoney(ftotal.toString());//格式化金额字段
        var ftmoney = Number(ftotal).toLocaleString('zh', { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: false });

        $("#合计").val(ftmoney);
    });

    
    //借款合计事件，注意设置合计项类型为text
    $("#fjkcard").find("input[type='number']").on('input', function () {
        var ftotal = Calculate(this);//合计
        //var ftmoney = FormatMoney(ftotal.toString());//格式化金额字段
        var ftmoney = Number(ftotal).toLocaleString('zh', { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: false });

        var faiw = atoc(ftotal);//大写
        $("#借款金额").val(ftmoney);
        $("#借款金额大写").val(faiw);
    });

    //出差费用、借款信息input number字段格式化
    $("#fchcard,#fjkcard").find("input[type='number']").on('blur', function (event) {
        //格式化金额字段
        //var fmoney = FormatMoney($(this).val());//暂时不用
        //var fmoney = Number($(this).val()).toFixed(2);//暂时不用
        var fmoney = Number($(this).val()).toLocaleString('zh', { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: false });

        $(this).val(fmoney);
    });

    //添加明细按钮
    $('#tjmx').on('tap', function () {
        flag_maxrow = flag_maxrow + 1;
        var li = setli(flag_maxrow, '', '');
        $("#mxlist").append(li);
        document.getElementById('tjmx').scrollIntoView();

        //添加明细项点击事件
        tapEvent_detail();

    });

}

//明细项点击事件
function tapEvent_detail() {
    /*
    //盖章文件名称下拉
    var fwjmcdata = [
         {
             value: '',
             text: '生日蛋糕券'
         },
         {
             value: '',
             text: 'B座午餐券'
         },
         {
             value: '',
             text: 'B座晚餐券'
         },
         {
             value: '',
             text: '洗浴门票129元'
         },
         {
             value: '',
             text: '洗浴优惠券79元'
         }
    ];
    showPickerByZepto('#mxlist', '#盖章文件名称', fwjmcdata);
    */

    //列表明细项点击事件
    $("#mxlist").find("#mx").each(function () {
        /*
        //知会管理员工号点击事件添加子表
        $(this).find("#fgly").on('tap', function () {
        var isMulti = true;
        var zeptoId = "#fgly";
            GetPer(zeptoId,isMulti)
        });
        */
        //列表明细项点击事件
        $(this).off('tap');
        $(this).on('tap', function () {
            flag_nowrow = $(this).find("#rowno").val();
            //console.log(flag_nowrow);
        });
    });
}

//合计
function Calculate(context) {
    var ftotal = 0;//定义类型

    $(context).parent().parent().find("input[type='number']").each(function () {
        var fvalue = parseFloat($(this).val());
        if (!$(this).val()) {
            fvalue = 0;
        }

        ftotal = ftotal + fvalue; 
    });

    return ftotal;
    
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
                console.log(data);
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

                    if (zeptoId == "#fgly") {
                        $("#mxlist").empty();
                        flag_maxrow = 0;
                        for (var i = 0; i < NameArr.length; i++) {
                            flag_maxrow = i + 1;
                            var li = setli(flag_maxrow, UserIdArr[i], NameNewArr[i]);
                            $("#mxlist").append(li);
                        }
                    }
                    
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

function setli(flag_maxrow, fzhglygh, fzhgly) {
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
    li = li + '       <label for="知会管理员工号">管理人员工号<i style="color:red;">*</i></label>';
    li = li + '       <input type="text" id="知会管理员工号" name="知会管理员工号" placeholder="请选择需知会的管理员" readonly="readonly"  value="' + changeNullToEmpty(fzhglygh) + '"/>';
    li = li + '     </div>';
    li = li + '     <div class="mui-input-row">';
    li = li + '       <label for="知会管理员">管理人员姓名<i style="color:red;">*</i></label>';
    li = li + '       <input type="text" id="知会管理员" name="知会管理员" readonly="readonly"  value="' + changeNullToEmpty(fzhgly) + '"/>';
    li = li + '     </div>';
    li = li + '</div>  ';

    return li;
}

//待办、已办、已申请--根据单号,获取表单内容
function initData(data, flag) {
    //获取表单信息
    var item = data.FormDataSet.威海卫大厦出差申请表[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.fbillno);
    }

    //抬头表
    //console.log(item.合计);
    //$("#fname").val(changeNullToEmpty(item.fname));
    $("#申请人").val(item.申请人);
    $("#申请部门").val(item.申请部门);
    $("#申请时间").val(FormatterTimeYMS(item.申请时间));
    $("#出差类型").val(item.出差类型);
    $("#订票需求").val(item.订票需求);
    $("#出差人员姓名及职位").val(item.出差人员姓名及职位);
    $("#出差负责人").val(item.出差负责人);
    $("#出差负责人").data('fno', item.出差负责人工号);
    $("#出差开始时间").val(FormatterTimeYMS(item.出差开始时间));
    $("#出差结束时间").val(FormatterTimeYMS(item.出差结束时间));
    $("#出差天数").val(item.出差天数);
    $("#出差内容").val(item.出差内容);
    $("#预期完成目标").val(item.预期完成目标);
    $("#证件号码").val(item.证件号码);
    
    $("#长途交通费").val(item.长途交通费);
    $("#住宿费").val(item.住宿费);
    $("#市内交通费").val(item.市内交通费);
    $("#业务费").val(item.业务费);
    $("#餐费").val(item.餐费);
    $("#培训费").val(item.培训费);
    $("#其它").val(item.其它);
    $("#合计").val(item.合计);

    $("#是否借款").val(item.是否借款);
    if (item.是否借款 == '是') {
        $("#fif_jk").addClass('mui-active');
    }
    $("#借款方式").val(item.借款方式);
    $("#开户行").val(item.开户行);
    $("#户名").val(item.户名);
    $("#银行账户").val(item.银行账户);
    $("#现金借款").val(item.现金借款);
    $("#转账借款").val(item.转账借款);
    $("#借款金额").val(item.借款金额);
    $("#借款金额大写").val(item.借款金额大写);

    //$("#ffj").val(item.附件);

    var UserIdArr = new Array();
    var NameNewArr = new Array();
    var item_c = data.FormDataSet.威海卫大厦出差申请表_A;
    for (var i = 0; i < item_c.length; i++) {
        flag_maxrow = i + 1;
        //console.log(flag_maxrow);
        itemidArr.push(item_c[i].itemid);
        UserIdArr.push(item_c[i].知会管理员工号);
        NameNewArr.push(item_c[i].知会管理员);

        var li = setli(flag_maxrow, item_c[i].知会管理员工号, item_c[i].知会管理员);
        $("#mxlist").append(li);
    }
    $("#fgly").val(NameNewArr);
    $("#fgly").data('fno',UserIdArr);

    /*
    //附件处理及下载
    if (item.附件 != null && item.附件 != "") {
        var fjtmp = (String)(item.附件);
        fjArray = fjtmp.split(";");
        //console.log("fjArray:" + fjArray);

        //请求附件详细信息
        $.ajax({
            type: 'POST',
            url: '/api/bpm/GetAttachmentsInfo',
            //dataType:'json',
            data: { 'fileIds': fjArray },

            beforeSend: function (XHR) {
                XHR.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem('ticket'));
            },
            success: function (data, status) {
                if (status == "success") {
                    console.log(data);
                    for (var i = 0; i < data.length; i++) {

                        var name = data[i].Name;
                        var type = (data[i].Ext).replace(".", "");
                        var size = String(data[i].Size);
                        var time = String(data[i].LastUpdate).replace("T", " ");
                        var downurl = baseDownloadUrl + data[i].FileID;

                        var attach = attachItem(name, type, size, time, downurl);
                        attachArray.push(attach);

                        var li = '<div class="pic-preview smallyulan success">';
                        li = li + ' <div class="del none" style="opacity:1;z-index:999;"onclick="delPicture(this)">x</div>';

                        //类型判断 
                        if ((data[i].Ext).indexOf("png") != -1 || (data[i].Ext).indexOf("jpg") != -1 || (data[i].Ext).indexOf("bmp") != -1) {
                            //li = li + '    <div class="img-wrap smallimg" id="simg" ><a href="'+baseDownloadUrl + data[i].FileID + '"><img src="'+baseDownloadUrl + data[i].FileID + '"/></a></div>';
                            li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '" ><img src="' + baseDownloadUrl + data[i].FileID + '"/></div>';
                        } else if ((data[i].Ext).indexOf("xls") != -1) {
                            li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '"><img src="../../Content/images/xlsx@2x.png"/></div>';
                        } else if ((data[i].Ext).indexOf("doc") != -1) {
                            li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '"><img src="../../Content/images/docx@2x.png"/></div>';
                        } else if ((data[i].Ext).indexOf("ppt") != -1) {
                            li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '"><img src="../../Content/images/ppt@2x.png"/></div>';
                        } else if ((data[i].Ext).indexOf("pdf") != -1) {
                            li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '"><img src="../../Content/images/pdf@2x.png"/></div>';
                        } else if ((data[i].Ext).indexOf("zip") != -1 || (data[i].Ext).indexOf("rar") != -1 || (data[i].Ext).indexOf("7z") != -1) {
                            li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '"><img src="../../Content/images/zip@2x.png"/></div>';
                        } else if ((data[i].Ext).indexOf("txt") != -1) {
                            li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '"><img src="../../Content/images/txt@2x.png"/></div>';
                        } else {
                            li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '"><img src="../../Content/images/unkown@2x.png"/></div>';
                        }

                        li = li + ' </div>';
                        li = li + '</div>';
                        $(".upload-img-list").append(li);

                        $(".imgdiv").each(function () {
                            $(this).parent().find(".del.none").hide();
                        });
                    }
                    watch();
                    $(".imgdiv").on('tap', function () {
                        console.log($(this)[0].id);
                        XuntongJSBridge.call('showFile', {
                            'fileName': attachArray[$(this)[0].id].name,
                            'fileExt': attachArray[$(this)[0].id].type,
                            'fileTime': attachArray[$(this)[0].id].time,
                            'fileSize': attachArray[$(this)[0].id].size,
                            'fileDownloadUrl': attachArray[$(this)[0].id].downurl
                        }, function (result) {
                            //alert(JSON.stringify(result));
                        });
                    });
                }

            }, error: function (e) {
                console.log(e);
            }, complete: function () {

            }
        });
    }
    */

    //初始化待办、已办、已申请表单信息
    initlist();//初始化联动信息
    $(".node1").attr('readonly', 'readonly');//发起权限字段只读
    $(".node1").removeAttr('placeholder');//发起权限字段提示隐藏
    //$("#addbtn_fj").css("display", "none");//隐藏附件上传按钮
    $("#tjmx").hide();//隐藏添加明细按钮
    $("#mxlist").find('#mx').each(function () {//隐藏明细删除按钮
        $(this).find("#deleteProduct").hide();
    });
    $("#fif_jk").addClass('mui-disabled');

}

//待办--节点控制字段
function nodeControllerExp(NodeName) {

    $("#csd").css('display', 'none');//不加签
    //mui.toast(NodeName);
    if (NodeName == '开始') {//返回重填,开始节点
        $("#fif_jk").removeClass('mui-disabled');//switch按钮
        tapEvent();//点击事件
        //tapEvent_csswitch();//加签事件
        //$("#addbtn_fj").css("display", "block");//显示附件上传按钮
        //upload();//允许附件上传
        //$("#tjmx").show();//添加明细按钮及删除图标
        $(".node1").removeAttr('readonly');
        
        $("#出差类型").attr('placeholder', '请选择出差类型');
        $("#订票需求").attr('placeholder', '请选择订票需求');
        $("#出差人员姓名及职位").attr('placeholder', '请填写出差人员姓名及职位');
        $("#fgly").attr('placeholder', '请填写知会管理员');
        $("#出差负责人").attr('placeholder', '请填写出差负责人');
        $("#出差天数").attr('placeholder', '请填写出差天数');
        $("#出差内容").attr('placeholder', '请填写出差地点及出差任务内容');
        $("#预期完成目标").attr('placeholder', '请填写预期完成目标');
        $("#证件号码").attr('placeholder', '请填写需订票人员及证件号码');
        $("#长途交通费").attr('placeholder', '请输入长途交通费用');
        $("#住宿费").attr('placeholder', '请输入住宿费用');
        $("#市内交通费").attr('placeholder', '请输入市内交通费用');
        $("#业务费").attr('placeholder', '请输入业务费用');
        $("#餐费").attr('placeholder', '请输入用餐费用');
        $("#培训费").attr('placeholder', '请输入培训费用');
        $("#其它").attr('placeholder', '请输入其它费用');
        $("#借款方式").attr('placeholder', '请选择借款方式');
        $("#开户行").attr('placeholder', '请输入开户行');
        $("#户名").attr('placeholder', '请输入户名');
        $("#银行账户").attr('placeholder', '请输入银行账户');
        $("#现金借款").attr('placeholder', '请输入现金借款金额');
        $("#转账借款").attr('placeholder', '请输入转账借款金额');
        /*
        $("#mxlist").find('#mx').each(function () {
            $(this).find("#deleteProduct").show();

            $(this).find("#盖章文件名称").attr('placeholder', '请选择盖章文件名称');
        });
        */

        /*
        //此流程app只审批不发起
        $("#commitbt").hide();
        mui.alert('请在网页上提交该流程!');
        */
    }
}


//json字符串对象生成及明细表必输项检查
function mxItem(fgly,fzhglygh, fzhgly) {
        var mx = Object.create({
            fzhglygh: fzhglygh,
            fzhgly: fzhgly,

            _check: function () {
                
                if ((fgly == '')||(fgly ==null)) {
                        mui.toast('请选择需知会的管理人员');
                        return null;
                }
                
                return mx;
            }

        });

        return mx._check();
    }



//抬头表必输项检查
function check(Method, Action, nodeName, fcclx, fdpxq, fccry, fgly, ffzr, fkssj, fjssj, fccts, fccnr, fyqmb, fzjhm) {
    /*if ((String(nodeName).match('开始') != null) || (String(nodeName).match('undefined') != null)) {*/
    if (((String(Method).match('Post') != null) && (String(Action).match('提交') != null))||(String(nodeName).match('开始') != null)){
        //如果是发起或重新发起状态
        if (!fcclx) {
            mui.toast('请选择出差类型');
            return false;
        }
        if (!fdpxq) {
            mui.toast('请选择订票需求');
            return false;
        }
        if (!fccry) {
            mui.toast('请输入出差人员姓名及职位');
            return false;
        }
        if (!fkssj) {
            mui.toast('请输入出差开始时间');
            return false;
        }
        if (!fjssj) {
            mui.toast('请输入出差结束时间');
            return false;
        } 
        if (!fccts) {
            mui.toast('请输入出差天数');
            return false;
        }
        if (!fccnr) {
            mui.toast('请输入出差地点及出差任务内容');
            return false;
        }
        if (!fyqmb) {
            mui.toast('请输入预期完成目标');
            return false;
        }

       
        if (fcclx == '酒店派出') {
            if (!fgly) {
                mui.toast('请选择需知会的管理人员');
                return false;
            }
            if (!ffzr) {
                mui.toast('请选择出差负责人');
                return false;
            }
        }

        if ((fdpxq == '火车票')||(fdpxq == '飞机票')) {
            if (!fzjhm) {
                mui.toast('请输入需订票人员及其证件号码');
                return false;
            }
        }

    }

    return true;
}

function check_xml(Method, Action, flag_switch, consignUserStr, consignRoutingType, consignReturnType) {
    //mui.toast(nodeName);
    var flag_check = true;//检查标识
    //表单信息
    var pid = $("#stepId").val();
    var fbillno = $("#fbillno").val();
    var comment = $("#signSuggest").val();
    var nodeName = $("#nodeName").val();

    //抬头表
    var fname = $("#申请人").val();
    var fdept = $("#申请部门").val();
    var fdate = $("#申请时间").val();
    var fcclx = $("#出差类型").val();
    var fdpxq = $("#订票需求").val();
    var fccry = $("#出差人员姓名及职位").val();
    var fgly = $("#知会管理员").val();
    var ffzr = $("#出差负责人").val();
    var ffzrgh = $("#出差负责人").data('fno');//
    var fkssj = $("#出差开始时间").val();
    var fjssj = $("#出差结束时间").val();
    var fccts = $("#出差天数").val();
    var fccnr = $("#出差内容").val();
    var fyqmb = $("#预期完成目标").val();
    var fzjhm = $("#证件号码").val();

    var fctfy = $("#长途交通费").val();
    var fzsfy = $("#住宿费").val();
    var fsnfy = $("#市内交通费").val();
    var fywfy = $("#业务费").val();
    var fcbfy = $("#餐费").val();
    var fpxfy = $("#培训费").val();
    var fqtfy = $("#其它").val();
    var fhjfy = $("#合计").val();

    var fjkif = $("#是否借款").val();
    var fjkfs = $("#借款方式").val();
    var fkhyh = $("#开户行").val();
    var fkhm = $("#户名").val();
    var fyhzh = $("#银行账户").val();
    var fxjjk = $("#现金借款").val();
    var fzzjk = $("#转账借款").val();
    var fjkje = $("#借款金额").val();
    var fjedx = $("#借款金额大写").val();
    //var ffj = $("#附件").val();
    
   
    //必输项检查
    flag_check = check(Method, Action, nodeName,fcclx, fdpxq, fccry, fgly, ffzr, fkssj, fjssj, fccts, fccnr, fyqmb, fzjhm);
    if (!flag_check) {//如果返回false  
        return null;
    }

    //明细表
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        
        var fzhglygh = $(this).find("#知会管理员工号").val();
        var fzhgly = $(this).find("#知会管理员").val();
        
        var mx = mxItem(fgly,fzhglygh, fzhgly);
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
        xml = xml + '          <ProcessName>威海卫大厦员工出差申请</ProcessName>';
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
    xml = xml + '      <威海卫大厦出差申请表>';

    if (Method == "Post" && Action == "提交") {//发起提交
        xml = xml + '           <fbillno>自动生成</fbillno>';
    } else if (Method == "Process") {//重新发起提交、审批同意
        xml = xml + '           <fbillno>' + fbillno + '</fbillno>';
    }

    xml = xml + '               <申请人>' + fname + '</申请人>';
    xml = xml + '               <申请部门>' + fdept + '</申请部门>';
    xml = xml + '               <申请时间>' + fdate + '</申请时间>';
    xml = xml + '               <出差类型>' + fcclx + '</出差类型>';
    xml = xml + '               <出差人员姓名及职位>' + fccry + '</出差人员姓名及职位>';
    xml = xml + '               <订票需求>' + fdpxq + '</订票需求>';
    xml = xml + '               <出差负责人>' + ffzr + '</出差负责人>';
    xml = xml + '               <出差负责人工号>' + ffzrgh + '</出差负责人工号>';
    xml = xml + '               <出差开始时间>' + fkssj + '</出差开始时间>';
    xml = xml + '               <出差结束时间>' + fjssj + '</出差结束时间>';
    xml = xml + '               <出差天数>' + fccts + '</出差天数>';
    xml = xml + '               <出差内容>' + fccnr + '</出差内容>';
    xml = xml + '               <预期完成目标>' + fyqmb + '</预期完成目标>';
    xml = xml + '               <证件号码>' + fzjhm + '</证件号码>';
    xml = xml + '               <长途交通费>' + fctfy + '</长途交通费>';
    xml = xml + '               <住宿费>' + fzsfy + '</住宿费>';
    xml = xml + '               <市内交通费>' + fsnfy + '</市内交通费>';
    xml = xml + '               <业务费>' + fywfy + '</业务费>';
    xml = xml + '               <是否借款>' + fjkif + '</是否借款>';
    xml = xml + '               <借款方式>' + fjkfs + '</借款方式>';
    xml = xml + '               <餐费>' + fcbfy + '</餐费>';
    xml = xml + '               <开户行>' + fkhyh + '</开户行>';
    xml = xml + '               <户名>' + fkhm + '</户名>';
    xml = xml + '               <培训费>' + fpxfy + '</培训费>';
    xml = xml + '               <银行账户>' + fyhzh + '</银行账户>';
    xml = xml + '               <其它>' + fqtfy + '</其它>';
    xml = xml + '               <现金借款>' + fxjjk + '</现金借款>';
    xml = xml + '               <转账借款>' + fzzjk + '</转账借款>';
    xml = xml + '               <合计>' + fhjfy + '</合计>';
    xml = xml + '               <借款金额>' + fjkje + '</借款金额>';
    xml = xml + '               <借款金额大写>' + fjedx + '</借款金额大写>';
    //xml = xml + '               <ffj>' + ffj + '</ffj>';
    //xml = xml + '               <附件>' + fjArray.join(';') + '</附件>';
    xml = xml + '           </威海卫大厦出差申请表>';
 
    for (var i = 0; i < mxlistArr.length; i++) {
        xml = xml + ' <威海卫大厦出差申请表_A>';
        xml = xml + '  <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';

        if ((Method == "Post" && Action == "提交") || (Method == "Process" && Action == "提交")) {//发起提交、重新发起提交
            xml = xml + '  <RowPrimaryKeys></RowPrimaryKeys>';
        }
        else if (Method == "Process" && Action == "同意") {//同意
            xml = xml + '  <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
        }
        xml = xml + '  <fentryno>' + (i + 1) + '</fentryno>';

        xml = xml + '  <知会管理员>' + mxlistArr[i].fzhgly + '</知会管理员>';
        xml = xml + '  <知会管理员工号>' + mxlistArr[i].fzhglygh + '</知会管理员工号>';

        xml = xml + ' </威海卫大厦出差申请表_A>';
    }
   
    xml = xml + '        </FormData>';
    xml = xml + '</XForm>';
    //console.log(xml);
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


/*
//通过存储过程获取相应数据 
function getProcedureMsg() {
    //flag_name = 'fwlcode';物料代码
    //flag_name = 'fcode_bg';变更后源码
    //flag_name = 'fword_bg';变更后采购负责人

    var xml;
    //物料代码子表的相关信息
    if (flag_name == 'fwlcode') {
         xml = '<?xml version= "1.0" ?>';
        xml = xml + '      <Requests>';
        xml = xml + '     <Params>';
        xml = xml + '         <DataSource>BPM_WEGO</DataSource>';
        xml = xml + '         <ID>erpcloud_药业集团物料资料</ID>';
        xml = xml + '         <Type>1</Type>';
        xml = xml + '        <Method>GetUserDataProcedure</Method>';
        xml = xml + '        <ProcedureName>erpcloud_药业集团物料资料</ProcedureName>';
        xml = xml + '        <Filter>';
        xml = xml + '        </Filter>';
        xml = xml + '      </Params>';
        xml = xml + '   </Requests>';
    }
        //变更后源码子表的相关信息
    else if (flag_name == 'fcode_bg') {
        xml = '<?xml version= "1.0" ?>';
        xml = xml + '      <Requests>';
        xml = xml + '     <Params>';
        xml = xml + '         <DataSource>BPM_WEGO</DataSource>';
        xml = xml + '         <ID>erpcloud_生物科技物料资料</ID>';
        xml = xml + '         <Type>1</Type>';
        xml = xml + '        <Method>GetUserDataProcedure</Method>';
        xml = xml + '        <ProcedureName>erpcloud_生物科技物料资料</ProcedureName>';
        xml = xml + '        <Filter>';
        xml = xml + '        </Filter>';
        xml = xml + '      </Params>';
        xml = xml + '   </Requests>';
    }
        //变更后采购负责人子表的相关信息
    else if (flag_name == 'fword_bg') {

    }

    //调用bpm存储过程  
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
            var itemData = provideData.Tables[0].Rows;

            $("#datalist").empty();   //清除之前数据

            //子表显示内容绑定
            //物料代码子表的相关信息
            if (flag_name == 'fwlcode') {
                for (var i = 0; i < itemData.length; i++) {
                    var li = '<li data-value="" data-tags="" class="mui-table-view-cell mui-indexed-list-item mui-radio mui-left">';
                    li += '<input type="radio" name="radio" ';
                    li += 'data-fwlbm="' + itemData[i].物料编码 + '"';
                    li += 'data-fwlmc="' + itemData[i].物料名称 + '"';
                    li += 'data-fdw="' + itemData[i].单位 + '"';
                    li += 'data-fdwbm="' + itemData[i].单位编码 + '"';
                    li += 'data-fzl="' + itemData[i].装量 + '"';
                    li += 'data-fggxh="' + itemData[i].规格型号 + '"';
                    li += ' />' + itemData[i].物料名称 + '||' + itemData[i].物料编码 + '||' + itemData[i].规格型号;
                    li += '</li>';

                    $("#datalist").append(li);
                }
            }
                //变更后源码子表的相关信息
            else if (flag_name == 'fcode_bg') {
                for (var i = 0; i < itemData.length; i++) {
                    var li = '<li data-value="" data-tags="" class="mui-table-view-cell mui-indexed-list-item mui-radio mui-left">';
                    li += '<input type="radio" name="radio" ';
                    li += 'data-fcode_bg="' + itemData[i].HPS_MANHOUR_ID + '"';
                    li += 'data-fdesignatio_bg="' + itemData[i].HPS_MANHOUR_DES + '"';
                    li += 'data-feffdt="' + itemData[i].EFFDT + '"';
                    //li += 'data-feffstatus="' + itemData[i].EFF_STATUS + '"';
                    //li += 'data-fnocollect="' + itemData[i].HPS_NOCOLLECTPW_YN + '"';
                    li += ' />' + itemData[i].HPS_MANHOUR_DES + '||' + itemData[i].HPS_MANHOUR_ID + '||' + itemData[i].EFFDT;
                    li += '</li>';

                    $("#datalist").append(li);
                }
            }
                //变更后采购负责人子表的相关信息
            else if (flag_name == 'fword_bg') {

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
    //flag_name = 'fwlcode';物料代码
    //flag_name = 'fcode_bg';变更后源码
    //flag_name = 'fword_bg';变更后采购负责人
    
    //子表选中信息获取
    var checkboxArray = [].slice.call(list.querySelectorAll('input[type="radio"]'));
    var checkedValues = [];
    var checkedElements = [];
    checkboxArray.forEach(function (box) {
        if (box.checked) {
            checkedValues.push(box.parentNode.innerText);
            //物料代码子表的相关信息
            if (flag_name == 'fwlcode') {
                var checkEl = {
                    fwlbm: $(box).data('fwlbm'),
                    fwlmc: $(box).data('fwlmc'),
                    fdw: $(box).data('fdw'),
                    fdwbm: $(box).data('fdwbm'),
                    fzl: $(box).data('fzl'),
                    fggxh: $(box).data('fggxh')
                };
                checkedElements.push(checkEl);
            }
            //变更后源码子表的相关信息
            else if (flag_name == 'fcode_bg') {
                var checkEl = {
                fcode_bg: $(box).data('fcode_bg'),
                fdesignatio_bg: $(box).data('fdesignatio_bg'),
                //feffdt: $(box).data('feffdt'),
                };
                checkedElements.push(checkEl);
            }
            //变更后采购负责人子表的相关信息
            else if (flag_name == 'fword_bg') {
            }
            
        }
    });

    //取消选中
    checkboxArray.forEach(function (box) {
        if (box.checked) {
            box.checked = !box.checked;
        }
    })

    //根据选中元素的数组来添加子表
    if (checkedValues.length > 0) {
        //物料代码子表的相关信息
        if (flag_name == 'fwlcode') {

            $("#mxlist").find("#mx").each(function () {
                if ($(this).find("#rowno").val() == flag_nowrow) {
                    //console.log($(this).find("#rowno").val());
                    $(this).find("#fwlcode").val(checkedElements[0].fwlbm);
                    $(this).find("#fwlname").val(checkedElements[0].fwlmc);
                    //用于一个字段存储多值情况,如id+desc
                    //$("#fkhmc").val(checkedElements[0].fkhmc);
                    //$("#fkhmc").data('fkhbm', checkedElements[0].fkhbm);
                }
            });

        }
        //变更后源码子表的相关信息
        else if (flag_name == 'fcode_bg') {

            $("#mxlist").find("#mx").each(function () {
                if ($(this).find("#rowno").val() == flag_nowrow) {
                    //console.log($(this).find("#rowno").val());
                    $(this).find("#fcode_bg").val(checkedElements[0].fcode_bg);
                    $(this).find("#fdesignatio_bg").val(checkedElements[0].fdesignatio_bg);
                    //用于一个字段存储多值情况,如id+desc
                    //$("#fkhmc").val(checkedElementsCust[0].fkhmc);
                    //$("#fkhmc").data('fkhbm', checkedElementsCust[0].fkhbm);
                }
            });

        }
        //变更后采购负责人子表的相关信息
        else if (flag_name == 'fword_bg') {

        }

        //选中后页面跳转
        $("#selector").hide();
        $("#wrapper").show();
        $("#datalist").empty();

    }
}
*/