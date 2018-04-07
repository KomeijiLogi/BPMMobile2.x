//全局变量
//class node1节点权限控制字段；node_jc借出联动字段；
var flag_switch = false;//是否加签
var flag_name='';//当前选择字段名
var flag_maxrow = 0;//明细表最大行数
var flag_nowrow = 0;//当前行号

//发起--流程初始化
function prepMsg() {
    flag_maxrow = 1;//发起流程初始化行号为1
    prelist();//明细项初始化
    initlist();//初始化联动信息
    tapEvent();//点击事件
    upload();//允许附件上传

    //获取发起人信息
    var xml = '<?xml version= "1.0" ?>';
    xml = xml + '<Requests>';
    xml = xml + '    <Params>';
    xml = xml + '      <Method>GetFormPostData</Method>';
    xml = xml + '       <ProcessName>威海卫大厦证章使用申请</ProcessName>';
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
        //console.log(getNowFormatDate(2));
        //console.log(item.申请人);
        //console.log(item.申请部门);

    }).fail(function (e) {

    });

    initHeaderMsg.then(function () {
        //获取申请人信息后执行的操作
        $("#申请日期").val(getNowFormatDate(2));//日期
    });

}

//发起--明细项初始化
function prelist() {
    //明细项初始1行
    var li = setli(flag_maxrow, '', '', '', '', '');
    $("#mxlist").append(li);
    document.getElementById('tjmx').scrollIntoView();
}

//初始化联动信息
function initlist() {
    //证章种类联动明细
    var fzzzl = $("#证章种类").val();
    if(fzzzl == '业务专用章'){
        $("#ywzcard").show();
    }
    else {
        $("#ywzcard").hide();
    }
   
    //用章类型联动借出字段
    var fyzlx = $("#用章类型").val();
    if (fyzlx == '借出') {
        $(".node_jc").show();
    }
    else {
        $(".node_jc").hide();
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
    //证章种类下拉
    var fzzzldata = [
        {
            value: '',
            text: '业务专用章'
        },
        {
            value: '',
            text: '大厦财务章'
        },
        {
            value: '',
            text: '公主财务章'
        },
        {
            value: '',
            text: '青缇湾财务章'
        },
        {
            value: '',
            text: '大厦法人章'
        },
        {
            value: '',
            text: '永祥法人章'
        },
        {
            value: '',
            text: '公主法人章'
        },
        {
            value: '',
            text: '青缇湾法人章'
        },
        {
            value: '',
            text: 'A座公章'
        },
        {
            value: '',
            text: 'B座公章'
        },
        {
            value: '',
            text: '青缇湾公章'
        },
        {
            value: '',
            text: '公主公章'
        },
        {
            value: '',
            text: '永祥公章'
        },
        {
            value: '',
            text: 'A座合同章'
        },
        {
            value: '',
            text: 'B座合同章'
        },
        {
            value: '',
            text: '青缇湾合同章'
        },
        {
            value: '',
            text: '公主合同章'
        },
        {
            value: '',
            text: '永祥合同章'
        },
        {
            value: '',
            text: '大厦工会章'
        }
    ];
    //showPicker('证章种类', fzzzldata);
    var picker1 = new mui.PopPicker();
    picker1.setData(fzzzldata);
    var ele1 = document.getElementById('证章种类');
    ele1.addEventListener('tap', function () {
        picker1.show(function (items) {
            ele1.value = items[0].text;
            switch (items[0].text) {
                case '业务专用章':
                    $("#ywzcard").show();
                    break;
                default:
                    $("#ywzcard").hide();
                    break;
            }
        });
    }, false);


    //用章类型下拉
    var fyzlxdata = [
        {
            value: '',
            text: '盖章'
        },
        {
            value: '',
            text: '借出'
        }
    ];
    //showPicker('用章类型', fyzlxdata);
    var picker2 = new mui.PopPicker();
    picker2.setData(fyzlxdata);
    var ele2 = document.getElementById('用章类型');
    ele2.addEventListener('tap', function () {
        picker2.show(function (items) {
            ele2.value = items[0].text;
            switch (items[0].text) {
                case '借出':
                    $(".node_jc").show();
                    break;
                default:
                    $(".node_jc").hide();
                    break;
            }
        });
    }, false);

    //添加明细按钮
    $('#tjmx').on('tap', function () {
        flag_maxrow = flag_maxrow + 1;
        var li = setli(flag_maxrow, '', '', '', '', '');
        $("#mxlist").append(li);
        document.getElementById('tjmx').scrollIntoView();

        //添加明细项点击事件
        tapEvent_detail();

    });
}

//明细项点击事件
function tapEvent_detail() {
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

    //列表明细项点击事件
    $("#mxlist").find("#mx").each(function () {
        $(this).off('tap');
        $(this).on('tap', function () {
            flag_nowrow = $(this).find("#rowno").val();
            //console.log(flag_nowrow);
        });
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

//待办、已办、已申请--根据单号,获取表单内容
function initData(data, flag) {
    //获取表单信息
    var item = data.FormDataSet.威海卫大厦证章使用申请表_A[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.fbillno);
    }

    //$("#fname").val(changeNullToEmpty(item.fname));
    $("#申请人").val(item.申请人);
    $("#申请部门").val(item.申请部门);
    $("#申请日期").val(FormatterTimeYMS(item.申请日期));
    $("#证章种类").val(item.证章种类);
    $("#用章类型").val(item.用章类型);
    $("#使用理由").val(item.使用理由);
    $("#借出人").val(item.借出人);
    $("#借出部门").val(item.借出部门);
    $("#借出日期").val(FormatterTimeYMS(item.借出日期));
    $("#归还日期").val(FormatterTimeYMS(item.归还日期));
    //$("#ffj").val(item.附件);
    
    var item_c = data.FormDataSet.威海卫大厦证章使用申请表_B;
    for (var i = 0; i < item_c.length; i++) {
        flag_maxrow = i + 1;
        //console.log(flag_maxrow);
        itemidArr.push(item_c[i].itemid);
        var li = setli(flag_maxrow, item_c[i].盖章文件名称, item_c[i].盖章数量, item_c[i].起始编号, item_c[i].截止编号, item_c[i].备注);
        $("#mxlist").append(li);
    }

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

    //初始化待办、已办、已申请表单信息
    initlist();//初始化联动信息
    $(".node1").attr('readonly', 'readonly');//发起权限字段只读
    $(".node1").removeAttr('placeholder');//发起权限字段提示隐藏
    $("#tjmx").hide();//隐藏添加明细按钮
    $("#addbtn_fj").css("display", "none");//隐藏附件上传按钮
    $("#mxlist").find('#mx').each(function () {//隐藏明细删除按钮
        $(this).find("#deleteProduct").hide();
    });

}

//待办--节点控制字段
function nodeControllerExp(NodeName) {

    $("#csd").css('display', 'none');//不加签
    //mui.toast(NodeName);
    if ((NodeName == '开始') || (NodeName == '部门经理')) {//返回重填,开始节点

        tapEvent();//点击事件
        tapEvent_csswitch();//加签事件
        $("#addbtn_fj").css("display", "block");//显示附件上传按钮
        upload();//允许附件上传
        $("#tjmx").show();//添加明细按钮及删除图标
        $(".node1").removeAttr('readonly');

        $("#证章种类").attr('placeholder', '请选择证章种类');
        $("#用章类型").attr('placeholder', '请选择用章类型');
        $("#使用理由").attr('placeholder', '请填写使用理由');
        $("#借出人").attr('placeholder', '请填写借出人');
        $("#借出部门").attr('placeholder', '请填写借出部门');

        $("#mxlist").find('#mx').each(function () {
            $(this).find("#deleteProduct").show();

            $(this).find("#盖章文件名称").attr('placeholder', '请选择盖章文件名称');
            $(this).find("#盖章数量").attr('placeholder', '请填写盖章数量');
            $(this).find("#起始编号").attr('placeholder', '请填写起始编号');
            $(this).find("#截止编号").attr('placeholder', '请填写截止编号');

        });

        /*
        //此流程app只审批不发起
        $("#commitbt").hide();
        mui.alert('请在网页上提交该流程!');
        */
    }
}

function setli(flag_maxrow, fwjmc, fgzsl, fqsbh, fjzbh, fremark) {
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
    li = li + '       <label for="盖章文件名称">盖章文件名称<i style="color:red;">*</i></label>';
    li = li + '       <input type="text" id="盖章文件名称" name="盖章文件名称" placeholder="请选择盖章文件名称" readonly="readonly" class="node1" value="' + changeNullToEmpty(fwjmc) + '"/>';
    li = li + '     </div>';
    li = li + '      <div class="mui-input-row">';
    li = li + '        <label for="盖章数量">盖章数量<i style="color:red;">*</i></label>';
    li = li + '        <input type="number" id="盖章数量" name="盖章数量" placeholder="请填写盖章数量" class="node1" value="' + fgzsl + '"/>';
    li = li + '     </div>';
    li = li + '     <div class="mui-input-row">';
    li = li + '         <label for="起始编号">起始编号<i style="color:red;">*</i></label>';
    li = li + '         <input type="text" id="起始编号" name="起始编号" placeholder="请填写起始编号" class="node1" value="' + changeNullToEmpty(fqsbh) + '"/>';
    li = li + '     </div>';
    li = li + '     <div class="mui-input-row">';
    li = li + '       <label for="截止编号">截止编号<i style="color:red;">*</i></label>';
    li = li + '       <input type="text" id="截止编号" name="截止编号" placeholder="请填写截止编号" class="node1" value="' + changeNullToEmpty(fjzbh) + '"/>';
    li = li + '       </div>';
    li = li + '      <div class="mui-input-row" style="height:auto;">';
    li = li + '         <label for="备注">备注</label>';
    li = li + '         <textarea rows="5" id="备注" name="备注" placeholder="请填写备注" class="node1">' + changeNullToEmpty(fremark) + '</textarea>';

    li = li + '      </div>';

    li = li + '</div>  ';

    return li;
}

//json字符串对象生成及明细表必输项检查
function mxItem(fzzzl, fwjmc, fgzsl, fqsbh, fjzbh, fremark) {
        var mx = Object.create({
            fwjmc: fwjmc,
            fgzsl: fgzsl,
            fqsbh: fqsbh,
            fjzbh: fjzbh,
            fremark: fremark,

            _check: function () {
                if (fzzzl == '业务专用章') {
                    if (!fwjmc) {
                        mui.toast('请选择盖章文件名称');
                        return null;
                    }
                    if (!fgzsl) {
                        mui.toast('请输入盖章数量');
                        return null;
                    }
                    if (!fqsbh) {
                        mui.toast('请输入起始编号');
                        return null;
                    }
                    if (!fjzbh) {
                        mui.toast('请输入截止编号');
                        return null;
                    }
                }
                return mx;
            }

        });

        return mx._check();
    }



//抬头表必输项检查
function check(Method, Action, nodeName, fname, fdept, fdate, fzzzl, fyzlx, fsyly, fjcr, fjcbm, fjcrq, fghrq) {
    /*if ((String(nodeName).match('开始') != null) || (String(nodeName).match('undefined') != null)) {*/
    if (((String(Method).match('Post') != null) && (String(Action).match('提交') != null))||(String(nodeName).match('开始') != null)){
        //如果是发起或重新发起状态
        if (!fzzzl) {
            mui.toast('请选择证章种类');
            return false;
        }
        if (!fyzlx) {
            mui.toast('请选择用章类型');
            return false;
        }
        if (!fsyly) {
            mui.toast('请输入使用理由');
            return false;
        }

        if (fyzlx == '借出') {

            if (!fjcr) {
                mui.toast('请输入借出人');
                return false;
            }
            if (!fjcbm) {
                mui.toast('请输入借出部门');
                return false;
            }
            if (!fjcrq) {
                mui.toast('请输入借出日期');
                return false;
            }
            if (!fghrq) {
                mui.toast('请输入归还日期');
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
    var fdate = $("#申请日期").val();
    var fzzzl = $("#证章种类").val();
    var fyzlx = $("#用章类型").val();
    var fsyly = $("#使用理由").val();
    var fjcr = $("#借出人").val();
    var fjcbm = $("#借出部门").val();
    var fjcrq = $("#借出日期").val();
    var fghrq = $("#归还日期").val();
    //var ffj = $("#附件").val();

    //必输项检查
    flag_check = check(Method, Action, nodeName,fname,fdept,fdate,fzzzl,fyzlx,fsyly,fjcr,fjcbm,fjcrq,fghrq);
    if (!flag_check) {//如果返回false  
        return null;
    }

    //明细表
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fwjmc = $(this).find("#盖章文件名称").val();
        var fgzsl = $(this).find("#盖章数量").val();
        var fqsbh = $(this).find("#起始编号").val();
        var fjzbh = $(this).find("#截止编号").val();
        var fremark = $(this).find("#备注").val();
        
        var mx = mxItem(fzzzl,fwjmc, fgzsl, fqsbh, fjzbh, fremark);
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
        xml = xml + '          <ProcessName>威海卫大厦证章使用申请</ProcessName>';
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
    xml = xml + '      <威海卫大厦证章使用申请表_A>';

    if (Method == "Post" && Action == "提交") {//发起提交
        xml = xml + '           <fbillno>自动生成</fbillno>';
    } else if (Method == "Process") {//重新发起提交、审批同意
        xml = xml + '           <fbillno>' + fbillno + '</fbillno>';
    }

    xml = xml + '               <申请人>' + fname + '</申请人>';
    xml = xml + '               <申请部门>' + fdept + '</申请部门>';
    xml = xml + '               <申请日期>' + fdate + '</申请日期>';
    xml = xml + '               <证章种类>' + fzzzl + '</证章种类>';
    xml = xml + '               <用章类型>' + fyzlx + '</用章类型>';
    xml = xml + '               <使用理由>' + fsyly + '</使用理由>';
    xml = xml + '               <借出人>' + fjcr + '</借出人>';
    xml = xml + '               <借出部门>' + fjcbm + '</借出部门>';
    xml = xml + '               <借出日期>' + fjcrq + '</借出日期>';
    xml = xml + '               <归还日期>' + fghrq + '</归还日期>';
    //xml = xml + '               <ffj>' + ffj + '</ffj>';
    xml = xml + '               <附件>' + fjArray.join(';') + '</附件>';
    xml = xml + '           </威海卫大厦证章使用申请表_A>';
 
    for (var i = 0; i < mxlistArr.length; i++) {
        xml = xml + ' <威海卫大厦证章使用申请表_B>';
        xml = xml + '  <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';

        if ((Method == "Post" && Action == "提交") || (Method == "Process" && Action == "提交")) {//发起提交、重新发起提交
            xml = xml + '  <RowPrimaryKeys></RowPrimaryKeys>';
        }
        else if (Method == "Process" && Action == "同意") {//同意
            xml = xml + '  <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
        }
        xml = xml + '  <fentryno>' + (i + 1) + '</fentryno>';

        xml = xml + '  <盖章文件名称>' + mxlistArr[i].fwjmc + '</盖章文件名称>';
        xml = xml + '  <盖章数量>' + mxlistArr[i].fgzsl + '</盖章数量>';
        xml = xml + '  <起始编号>' + mxlistArr[i].fqsbh + '</起始编号>';
        xml = xml + '  <截止编号>' + mxlistArr[i].fjzbh + '</截止编号>';
        xml = xml + '  <备注>' + mxlistArr[i].fremark + '</备注>';
        
        xml = xml + ' </威海卫大厦证章使用申请表_B>';
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