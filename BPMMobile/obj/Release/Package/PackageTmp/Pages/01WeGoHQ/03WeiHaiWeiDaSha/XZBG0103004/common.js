//全局变量
//class node1节点权限控制字段；node_jk是否借款联动字段；node_dpxq订单需求联动字段;node_cclx出差类型联动字段
var flag_switch = false;//是否加签
var flag_name='';//当前选择字段名
var flag_maxrow = 0;//明细表最大行数
var flag_nowrow = 0;//当前行号

//发起--流程初始化
function prepMsg() {
    preheader();//抬头初始化
    predetail();//明细项初始化
    //initlink();//初始化联动信息
    tapEvent();//点击事件
    upload();//允许附件上传

    //获取发起人信息
    var xml = '<?xml version= "1.0" ?>';
    xml = xml + '<Requests>';
    xml = xml + '    <Params>';
    xml = xml + '      <Method>GetFormPostData</Method>';
    xml = xml + '       <ProcessName>威海卫大厦员工请假申请</ProcessName>';
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
        $("#发起人").val(item.发起人);
        $("#发起部门").val(item.发起部门);
        //console.log(item.申请人);

    }).fail(function (e) {

    });

    initHeaderMsg.then(function () {
        //获取申请人信息后执行的操作
        $("#发起日期").val(getNowFormatDate(2));//日期
    });

}

//发起--抬头初始化
function preheader() {
    var li = setfileli('','');

    $("#filecard").append(li);
}

//发起--明细项初始化
function predetail() {
    //明细项初始1行
    flag_maxrow = 1;//发起流程初始化行号为1
    var li = setli(flag_maxrow, '', '', '', '', '', '', '');

    $("#mxlist").append(li);
}

//初始化联动信息
function initlink() {
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
    //请假天数下拉
    var fqjtsdata = [
        {
            value: '',
            text: '小于等于3天'
        },
        {
            value: '',
            text: '大于3天小于10天'
        },
        {
            value: '',
            text: '大于等于十天'
        }
    ];
    showPicker('请假天数', fqjtsdata);
    

    //添加明细按钮
    $('#tjmx').on('tap', function (e) {
        flag_maxrow = flag_maxrow + 1;
        var li = setli(flag_maxrow, '', '', '', '', '', '', '', e.detail.timestamp);
        $("#mxlist").append(li);
        document.getElementById('tjmx').scrollIntoView();

        $("#mxlist").find('.upload-addbtn').each(function () {
            upload_multi($(this).find('input'), "." + $(this).parent().parent().find("#imglist").attr('class'));
        });

        //添加明细项点击事件
        tapEvent_detail();

    });

    /*
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

    //知会管理员工号点击事件
    $("#fgly").on('tap', function () {
        var isMulti = true;
        var zeptoId = "#fgly";
        GetPer(zeptoId, isMulti);
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
    */
}

//明细项点击事件
function tapEvent_detail() {
    //请假类型下拉
    var fqjlxdata = [
         {
             value: '',
             text: '存假'
         },
         {
             value: '',
             text: '病假'
         },
         {
             value: '',
             text: '事假'
         },
         {
             value: '',
             text: '产假'
         },
         {
             value: '',
             text: '有薪年假'
         }
    ];
    showPickerByZepto('#mxlist', '#请假类型', fqjlxdata);
    

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

function setli(flag_maxrow, fsqr, fksrq, fjsrq, fqjlx, fsqts, fqjsy,ffjno,flistno) {
    //console.log(changeNullToEmpty(fqjsy));
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
    li = li + '       <label for="申请人">申请人<i style="color:red;">*</i></label>';
    li = li + '       <input type="text" id="申请人" name="申请人" placeholder="请填写申请人" class="node1" value="' + changeNullToEmpty(fsqr) + '"/>';
    li = li + '     </div>';
    li = li + '     <div class="mui-input-row">';
    li = li + '       <label for="开始日期">开始日期<i style="color:red;">*</i></label>';
    li = li + '       <input type="date" id="开始日期" name="开始日期" class="node1" value="' + FormatterTimeYMS(fksrq) + '"/>';
    li = li + '     </div>';
    li = li + '     <div class="mui-input-row">';
    li = li + '       <label for="结束日期">结束日期<i style="color:red;">*</i></label>';
    li = li + '       <input type="date" id="结束日期" name="结束日期" class="node1" value="' + FormatterTimeYMS(fjsrq) + '"/>';
    li = li + '     </div>';
    li = li + '     <div class="mui-input-row">';
    li = li + '       <label for="请假类型">请假类型<i style="color:red;">*</i></label>';
    li = li + '       <input type="text" id="请假类型" name="请假类型" placeholder="请选择请假类型" readonly="readonly" class="node1"  value="' + changeNullToEmpty(fqjlx) + '"/>';
    li = li + '     </div>';
    li = li + '     <div class="mui-input-row">';
    li = li + '       <label for="申请天数">申请天数</label>';
    li = li + '       <input type="number" id="申请天数" name="申请天数" placeholder="请填写申请天数" class="node1" value="' + fsqts + '"/>';
    li = li + '     </div>';
    li = li + '     <div class="mui-input-row" style="height:auto;">';
    li = li + '       <label for="请假事由">请假事由<i style="color:red;">*</i></label>';
    li = li + '       <textarea rows="5" id="请假事由" name="请假事由" placeholder="请填写请假事由" class="node1">' + changeNullToEmpty(fqjsy) + '</textarea>';
    li = li + '     </div>';

    /*
    li = li + '     <div class="mui-input-row cutOffLine" style="height:7rem;overflow:scroll;" id="uploaddiv">';
    li = li + '          <div class="border border-t upload-img" style="top:0rem;">';                           
    li = li + '               <div class="clearfix upload-btn" id="children-bg">';
    li = li + '                    <label class="label">附件</label>';
    li = li + '                    <input type="hidden" id="fj_info_ids" name="fj_info_ids" value="' + ffjno + '"/>';
    li = li + '                    <span class="upload-addbtn">';
    li = li + '                    <input type="file" accept="image/jpeg,image/jpg,image/png,image/jp2,image/bmp" id="file" style="opacity:0;">';
    li = li + '                    </span>';
    li = li + '                </div>';
    li = li + '                <div class="upload-img-list-'+ flistno +'" id="imglist">';
    li = li + '                </div>';
    li = li + '           </div>';
    li = li + '      </div>';
    */
    li = li +  setfileli(ffjno,flistno);


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
    var fjArrayList = [];//附件id数组
    var fjArrayListEvery = [];//
    var fjArrayObjCollections = [];//附件对象集合

    preheader();//抬头初始化
    //获取表单信息
    var item = data.FormDataSet.威海卫大厦请假申请表_A[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.fbillno);
    }

    //抬头表
    //console.log(item.合计);
    //$("#fname").val(changeNullToEmpty(item.fname));
    $("#发起人").val(item.发起人);
    $("#发起部门").val(item.发起部门);
    $("#发起日期").val(FormatterTimeYMS(item.发起日期));
    $("#请假天数").val(item.请假天数);
    /*
    $("#出差负责人").val(item.出差负责人);
    $("#出差负责人").data('fno', item.出差负责人工号);
    $("#是否借款").val(item.是否借款);
    if (item.是否借款 == '是') {
        $("#fif_jk").addClass('mui-active');
    }
    */
    $("#fj_info_ids").val(item.附件);
    fjArrayList.push(item.附件);//抬头附件
    //var fjArrayC = item.附件;
    //fjArrayList.push(fjArrayC);

    //明细表
    var item_c = data.FormDataSet.威海卫大厦请假申请表_B;
    for (var i = 0; i < item_c.length; i++) {
        flag_maxrow = i + 1;
        //console.log(item_c[i].请假事由);
        itemidArr.push(item_c[i].itemid);

        var li = setli(flag_maxrow, item_c[i].申请人, item_c[i].开始日期, item_c[i].结束日期, item_c[i].请假类型, item_c[i].申请天数, item_c[i].请假事由, item_c[i].附件,i);
        $("#mxlist").append(li);

        fjArrayList.push(item_c[i].附件);//明细附件
        //var fjArrayC = item_c[i].附件;
        //fjArrayList.push(fjArrayC);
    }


    //获取所有附件信息
    fjArrayListEvery = fjArrayList.join(";").split(";");
    console.log(fjArrayListEvery);
    $.ajax({
        type: 'POST',
        url: '/api/bpm/GetAttachmentsInfo',

        data: { 'fileIds': fjArrayListEvery },

        beforeSend: function (XHR) {
            XHR.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem('ticket'));
        }

    }).done(function(data){
        console.log(data);
    if (data.length == 0) {
        console.log('返回结果为空');
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
                console.log(fjArrayObjCollections[i]);
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
        console.log($(this).attr('id'));
        var fileid = $(this).attr('id');
        for (var i = 0; i < fjArrayObjCollections.length; i++){
            if (String(fjArrayObjCollections[i].FileID).match(fileid) != null) {
                console.log(fjArrayObjCollections[i]);
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
    $("#addbtn_fj").css("display", "none");//隐藏附件上传按钮
    $("#tjmx").hide();//隐藏添加明细按钮
    $("#mxlist").find('#mx').each(function () {
        $(this).find("#deleteProduct").hide();//隐藏明细删除按钮
        $(this).find("#addbtn_fj").css("display", "none");//隐藏附件上传按钮
    });
    //$("#fif_jk").addClass('mui-disabled');//switch开关无效

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
    //mui.toast(NodeName);
    if (NodeName == '开始') {//返回重填,开始节点
        //$("#fif_jk").removeClass('mui-disabled');//switch按钮打开
        tapEvent();//点击事件
        //tapEvent_csswitch();//加签事件
        $("#addbtn_fj").css("display", "block");//显示附件上传按钮
        upload();//允许附件上传
        $("#tjmx").show();//添加明细按钮及删除图标

        $(".node1").removeAttr('readonly');//可编辑
        $("#请假天数").attr('placeholder', '请选择请假天数');//提示
        $("#mxlist").find('#mx').each(function () {
            $(this).find("#deleteProduct").show();//显示明细删除按钮
            $(this).find("#addbtn_fj").css("display", "block");//显示附件上传按钮

            $(this).find("#申请人").attr('placeholder', '请输入申请人');
            $(this).find("#请假类型").attr('placeholder', '请选择请假类型');
            $(this).find("#申请天数").attr('placeholder', '请输入申请天数');
            $(this).find("#请假事由").attr('placeholder', '请输入请假事由');
        });
       

        /*
        //此流程app只审批不发起
        $("#commitbt").hide();
        mui.alert('请在网页上提交该流程!');
        */
    }
}

//json字符串对象生成及明细表必输项检查
function mxItem(fsqr, fksrq, fjsrq, fqjlx, fsqts, fqjsy) {
        var mx = Object.create({
            fsqr: fsqr,
            fksrq: fksrq,
            fjsrq: fjsrq,
            fqjlx: fqjlx,
            fsqts: fsqts,
            fqjsy: fqjsy,

            _check: function () {
                
                if (!fsqr) {
                    mui.toast('请输入申请人');
                    return null;
                }
                if (!fksrq) {
                    mui.toast('请选择开始日期');
                    return null;
                }
                if (!fjsrq) {
                    mui.toast('请选择结束日期');
                    return null;
                }
                if (!fqjlx) {
                    mui.toast('请选择请假类型');
                    return null;
                }
                if (!fqjsy) {
                    mui.toast('请输入请假事由');
                    return null;
                }
                
                return mx;
            }

        });

        return mx._check();
    }



//抬头表必输项检查
function check(Method, Action, nodeName, fqjts) {
    /*if ((String(nodeName).match('开始') != null) || (String(nodeName).match('undefined') != null)) {*/
    if (((String(Method).match('Post') != null) && (String(Action).match('提交') != null))||(String(nodeName).match('开始') != null)){
        //如果是发起或重新发起状态
        if (!fqjts) {
            mui.toast('请选择请假天数');
            return false;
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
    var fname = $("#发起人").val();
    var fdept = $("#发起部门").val();
    var fdate = $("#发起日期").val();
    var fqjts = $("#请假天数").val();

    //var ffzr = $("#出差负责人").val();
    //var ffzrgh = $("#出差负责人").data('fno');//
    //var ffj = $("#附件").val();
    
   
    //必输项检查
    flag_check = check(Method, Action, nodeName, fqjts);
    if (!flag_check) {//如果返回false  
        return null;
    }

    //明细表
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        
        var fsqr = $(this).find("#申请人").val();
        var fksrq = $(this).find("#开始日期").val();
        var fjsrq = $(this).find("#结束日期").val();
        var fqjlx = $(this).find("#请假类型").val();
        var fsqts = $(this).find("#申请天数").val();
        var fqjsy = $(this).find("#请假事由").val();
        
        var mx = mxItem(fsqr, fksrq, fjsrq, fqjlx, fsqts, fqjsy);
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
        xml = xml + '          <ProcessName>威海卫大厦员工请假申请</ProcessName>';
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
    xml = xml + '      <威海卫大厦请假申请表_A>';

    if (Method == "Post" && Action == "提交") {//发起提交
        xml = xml + '           <fbillno>自动生成</fbillno>';
    } else if (Method == "Process") {//重新发起提交、审批同意
        xml = xml + '           <fbillno>' + fbillno + '</fbillno>';
    }

    xml = xml + '               <发起人>' + fname + '</发起人>';
    xml = xml + '               <发起部门>' + fdept + '</发起部门>';
    xml = xml + '               <发起日期>' + fdate + '</发起日期>';
    xml = xml + '               <请假天数>' + fqjts + '</请假天数>';
    xml = xml + '               <判断>0</判断>'; 
    //xml = xml + '               <ffj>' + ffj + '</ffj>';
    xml = xml + '               <附件>' + fjArray.join(';') + '</附件>';
    xml = xml + '           </威海卫大厦请假申请表_A>';
 
    for (var i = 0; i < mxlistArr.length; i++) {
        xml = xml + ' <威海卫大厦请假申请表_B>';
        xml = xml + '  <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';

        if ((Method == "Post" && Action == "提交") || (Method == "Process" && Action == "提交")) {//发起提交、重新发起提交
            xml = xml + '  <RowPrimaryKeys></RowPrimaryKeys>';
        }
        else if (Method == "Process" && Action == "同意") {//同意
            xml = xml + '  <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
        }
        xml = xml + '  <fentryno>' + (i + 1) + '</fentryno>';

        xml = xml + '  <申请人>' + mxlistArr[i].fsqr + '</申请人>';
        xml = xml + '  <开始日期>' + mxlistArr[i].fksrq + '</开始日期>';
        xml = xml + '  <结束日期>' + mxlistArr[i].fjsrq + '</结束日期>';
        xml = xml + '  <请假类型>' + mxlistArr[i].fqjlx + '</请假类型>';
        xml = xml + '  <请假数值>0</请假数值>';
        xml = xml + '  <申请天数>' + mxlistArr[i].fsqts + '</申请天数>';
        xml = xml + '  <请假事由>' + mxlistArr[i].fqjsy + '</请假事由>';

        xml = xml + ' </威海卫大厦请假申请表_B>';
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