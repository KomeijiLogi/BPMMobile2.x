//全局变量
var flag_switch = false;//是否加签
var flag_name='';//当前选择字段名
var flag_maxrow = 0;//明细表最大行数
var flag_nowrow = 0;//当前行号

//发起--流程初始化
function prepMsg() {
    $("#fdate").val(getNowFormatDate(2));//日期
    tapEvent1();//点击事件
    upload();//允许附件上传

    var xml = '<?xml version= "1.0" ?>';
    xml = xml + '<Requests>';
    xml = xml + '    <Params>';
    xml = xml + '      <Method>GetFormPostData</Method>';
    xml = xml + '       <ProcessName>医疗系统公司物料采购信息变更申请</ProcessName>';
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
        $("#fname").val(item.fname);
        $("#fdept").val(item.fdept);

    }).fail(function (e) {

    });
    /*
    initHeaderMsg.then(function () {
        initList();
    });
    */
    flag_maxrow = 1;//发起流程初始化行号为1
}

//待办、已办、已申请--根据单号，获取表单内容
function initData(data, flag) {

    var item = data.FormDataSet.BPM_YLXTWLBG_A[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.fbillno);
    }

    //$("#fname").val(changeNullToEmpty(item.fname));
    $("#fname").val(item.fname);
    $("#fdept").val(item.fdept);
    $("#fdate").val(FormatterTimeYMS(item.fdate));
    $("#ftel").val(item.ftel);
    $("#fremark").val(item.fremark);
    $("#ffj").val(item.ffj);
    
    var item_c = data.FormDataSet.BPM_YLXTWLBG_B;
    for (var i = 0; i < item_c.length; i++) {
        flag_maxrow = i+1;
        //console.log(flag_maxrow);
        itemidArr.push(item_c[i].itemid);
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
        li = li + '       <label for="fwlcode">物料编码<i style="color:red;">*</i></label>';
        li = li + '       <input type="text" id="fwlcode" name="fwlcode" class="node1" placeholder="请选择物料编码" readonly="readonly" value="' + item_c[i].fwlcode + '"/>';
        li = li + '     </div>';
        li = li + '      <div class="mui-input-row">';
        li = li + '        <label for="fwlname">物料名称</label>';
        li = li + '        <input type="text" id="fwlname" name="fwlname" readonly="readonly" value="' + item_c[i].fwlname + '"/>';
        li = li + '     </div>';
        li = li + '     <div class="mui-input-row">';
        li = li + '         <label for="fggxh">规格型号</label>';
        li = li + '         <input type="text" id="fggxh" name="fggxh" class="node1" value="' + changeNullToEmpty(item_c[i].fggxh) + '"/>';
        li = li + '     </div>';
        li = li + '     <div class="mui-input-row">';
        li = li + '       <label for="fcode_yl">原来源编码</label>';
        li = li + '       <input type="text" id="fcode_yl" name="fcode_yl" readonly="readonly" value="' + changeNullToEmpty(item_c[i].fcode_yl) + '"/>';
        li = li + '       </div>';
        li = li + '      <div class="mui-input-row">';
        li = li + '         <label for="fcode_bg">变更后来源编码</label>';
        li = li + '         <input type="text" id="fcode_bg" name="fcode_bg" placeholder="请选择变更后来源编码" class="node1" readonly="readonly" value="' + changeNullToEmpty(item_c[i].fcode_bg) + '"/>';
        li = li + '      </div>';
        li = li + '      <div class="mui-input-row">';
        li = li + '         <label for="fdesignation_yl">原来源名称</label>';
        li = li + '         <input type="text" id="fdesignation_yl" name="fdesignation_yl" readonly="readonly" value="' + changeNullToEmpty(item_c[i].fdesignation_yl) + '"/>';
        li = li + '      </div>';
        li = li + '      <div class="mui-input-row">';
        li = li + '         <label for="fdesignatio_bg">变更后来源名称</label>';
        li = li + '         <input type="text" id="fdesignatio_bg" name="fdesignatio_bg" readonly="readonly" value="' + changeNullToEmpty(item_c[i].fdesignatio_bg) + '"/>';
        li = li + '      </div>';
        li = li + '      <div class="mui-input-row">';
        li = li + '         <label for="fcl_yl">原最高存量</label>';
        li = li + '         <input type="number" id="fcl_yl" name="fcl_yl" readonly="readonly" value="' + item_c[i].fcl_yl + '"/>';
        li = li + '      </div>';
        li = li + '      <div class="mui-input-row">';
        li = li + '         <label for="fcl_bg">变更后最高存量</label>';
        li = li + '         <input type="number" id="fcl_bg" name="fcl_bg" placeholder="请填写变更后最高存量" class="node1" value="' + item_c[i].fcl_bg + '"/>';
        li = li + '      </div>';
        li = li + '      <div class="mui-input-row">';
        li = li + '         <label for="faqkcs_yl">原安全库存数量</label>';
        li = li + '         <input type="number" id="faqkcs_yl" name="faqkcs_yl" readonly="readonly" value="' + item_c[i].faqkcs_yl + '"/>';
        li = li + '      </div>';
        li = li + '      <div class="mui-input-row">';
        li = li + '         <label for="faqkcs_bg">变更后安全库存数量</label>';
        li = li + '         <input type="number" id="faqkcs_bg" name="faqkcs_bg" placeholder="请填写变更后安全库存数量" class="node1" value="' + item_c[i].faqkcs_bg + '"/>';
        li = li + '      </div>';
        li = li + '      <div class="mui-input-row">';
        li = li + '         <label for="fcgdj_yl">原采购单价</label>';
        li = li + '         <input type="number" id="fcgdj_yl" name="fcgdj_yl" readonly="readonly" value="' + item_c[i].fcgdj_yl + '"/>';
        li = li + '      </div>';
        li = li + '      <div class="mui-input-row">';
        li = li + '         <label for="fcgdj_bg">变更后采购单价</label>';
        li = li + '         <input type="number" id="fcgdj_bg" name="fcgdj_bg" placeholder="请填写变更后采购单价" class="node1" value="' + item_c[i].fcgdj_bg + '"/>';
        li = li + '      </div>';
        li = li + '      <div class="mui-input-row">';
        li = li + '         <label for="fcgzgj_yl">原采购最高价</label>';
        li = li + '         <input type="number" id="fcgzgj_yl" name="fcgzgj_yl" readonly="readonly" value="' + item_c[i].fcgzgj_yl + '"/>';
        li = li + '      </div>';
        li = li + '      <div class="mui-input-row">';
        li = li + '         <label for="fcgzgj_bg">变更后采购最高价</label>';
        li = li + '         <input type="number" id="fcgzgj_bg" name="fcgzgj_bg" placeholder="请填写变更后采购最高价" class="node1" value="' + item_c[i].fcgzgj_bg + '"/>';
        li = li + '      </div>';
        li = li + '      <div class="mui-input-row">';
        li = li + '         <label for="fgdtqq_yl">原固定提前期</label>';
        li = li + '         <input type="number" id="fgdtqq_yl" name="fgdtqq_yl" readonly="readonly" value="' + item_c[i].fgdtqq_yl + '"/>';
        li = li + '      </div>';
        li = li + '      <div class="mui-input-row">';
        li = li + '         <label for="fgdtqq_bg">变更后固定提前期</label>';
        li = li + '         <input type="number" id="fgdtqq_bg" name="fgdtqq_bg" placeholder="请填写变更后固定提前期" class="node1" value="' + item_c[i].fgdtqq_bg + '"/>';
        li = li + '      </div>';
        li = li + '      <div class="mui-input-row">';
        li = li + '         <label for="fword_yl">原采购负责人代码</label>';
        li = li + '         <input type="text" id="fword_yl" name="fword_yl" readonly="readonly" value="' + changeNullToEmpty(item_c[i].fword_yl) + '"/>';
        li = li + '      </div>';
        li = li + '      <div class="mui-input-row">';
        li = li + '         <label for="fword_bg">变更后采购负责人代码</label>';
        li = li + '         <input type="text" id="fword_bg" name="fword_bg" placeholder="请选择变更后采购负责人代码" class="node1" readonly="readonly" value="' + changeNullToEmpty(item_c[i].fword_bg) + '"/>';
        li = li + '      </div>';
        li = li + '      <div class="mui-input-row">';
        li = li + '         <label for="fname_yl">原采购负责人名称</label>';
        li = li + '         <input type="text" id="fname_yl" name="fname_yl" readonly="readonly" value="' + changeNullToEmpty(item_c[i].fname_yl) + '"/>';
        li = li + '      </div>';
        li = li + '      <div class="mui-input-row">';
        li = li + '         <label for="fname_bg">变更后采购负责人名称</label>';
        li = li + '         <input type="text" id="fname_bg" name="fname_bg" readonly="readonly" value="' + changeNullToEmpty(item_c[i].fname_bg) + '"/>';
        li = li + '      </div>';
        li = li + '      <div class="mui-input-row">';
        li = li + '         <label for="frate_yl">原税率</label>';
        li = li + '         <input type="number" id="frate_yl" name="frate_yl" readonly="readonly" value="' + item_c[i].frate_yl + '"/>';
        li = li + '      </div>';
        li = li + '      <div class="mui-input-row">';
        li = li + '         <label for="frate_bg">变更后税率</label>';
        li = li + '         <input type="number" id="frate_bg" name="frate_bg" placeholder="请填写变更后税率" class="node1" value="' + item_c[i].frate_bg + '"/>';
        li = li + '      </div>';

        li = li + '</div>  ';

        $("#mxlist").append(li);
    }

    //附件处理及下载
    if (item.ffj != null && item.ffj != "") {
        var fjtmp = (String)(item.ffj);
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

    $(".node1").attr('readonly', 'readonly');//发起权限字段只读
    $(".node1").removeAttr('placeholder');
    $("#addbtn_fj").css("display", "none");
   
    $("#mxlist").find('#mx').each(function () {
        $(this).find("#deleteProduct").hide();
    });

}

//加签按钮点击事件
function tapEvent_csswitch() {
    document.getElementById("csswitch").addEventListener('toggle', function (event) {
        flag_switch = !flag_switch;
        // mui.toast(flag_switch);
    });
}

//点击事件
function tapEvent1() {
   
    //添加明细按钮
    $('#tjmx').on('tap', function () {
        flag_maxrow = flag_maxrow + 1;

        var li = '<div id="mx" class="mui-card">';

        li = li + '     <div class="mui-input-row itemtitle">';
        li = li + '        <label>明细列表项</label>';
        li = li + '        <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>';
        li = li + '     </div>';
        li = li + '     <div class="mui-input-row" >';
        li = li + '       <label for="rowno">行号 </label>';
        li = li + '       <input type="number" id="rowno" name="rowno" readonly="readonly" value="' + flag_maxrow + '"/>';
        li = li + '     </div>';
        li = li + '     <div class="mui-input-row">';
        li = li + '       <label for="fwlcode">物料编码<i style="color:red;">*</i></label>';
        li = li + '       <input type="text" id="fwlcode" name="fwlcode" placeholder="请选择物料编码" class="node1" readonly="readonly"/>';
        li = li + '     </div>';
        li = li + '      <div class="mui-input-row">';
        li = li + '        <label for="fwlname">物料名称</label>';
        li = li + '        <input type="text" id="fwlname" name="fwlname" readonly="readonly"/>';
        li = li + '     </div>';
        li = li + '     <div class="mui-input-row">';
        li = li + '         <label for="fggxh">规格型号</label>';
        li = li + '         <input type="text" id="fggxh" name="fggxh" class="node1"/>';
        li = li + '     </div>';
        li = li + '     <div class="mui-input-row">';
        li = li + '       <label for="fcode_yl">原来源编码</label>';
        li = li + '       <input type="text" id="fcode_yl" name="fcode_yl" readonly="readonly"/>';
        li = li + '       </div>';
        li = li + '      <div class="mui-input-row">';
        li = li + '         <label for="fcode_bg">变更后来源编码</label>';
        li = li + '         <input type="text" id="fcode_bg" name="fcode_bg" placeholder="请选择变更后来源编码" class="node1" readonly="readonly"/>';
        li = li + '      </div>';
        li = li + '      <div class="mui-input-row">';
        li = li + '         <label for="fdesignation_yl">原来源名称</label>';
        li = li + '         <input type="text" id="fdesignation_yl" name="fdesignation_yl" readonly="readonly"/>';
        li = li + '      </div>';
        li = li + '      <div class="mui-input-row">';
        li = li + '         <label for="fdesignatio_bg">变更后来源名称</label>';
        li = li + '         <input type="text" id="fdesignatio_bg" name="fdesignatio_bg" readonly="readonly"/>';
        li = li + '      </div>';
        li = li + '      <div class="mui-input-row">';
        li = li + '         <label for="fcl_yl">原最高存量</label>';
        li = li + '         <input type="number" id="fcl_yl" name="fcl_yl" readonly="readonly"/>';
        li = li + '      </div>';
        li = li + '      <div class="mui-input-row">';
        li = li + '         <label for="fcl_bg">变更后最高存量</label>';
        li = li + '         <input type="number" id="fcl_bg" name="fcl_bg" placeholder="请填写变更后最高存量" class="node1"/>';
        li = li + '      </div>';
        li = li + '      <div class="mui-input-row">';
        li = li + '         <label for="faqkcs_yl">原安全库存数量</label>';
        li = li + '         <input type="number" id="faqkcs_yl" name="faqkcs_yl" readonly="readonly"/>';
        li = li + '      </div>';
        li = li + '      <div class="mui-input-row">';
        li = li + '         <label for="faqkcs_bg">变更后安全库存数量</label>';
        li = li + '         <input type="number" id="faqkcs_bg" name="faqkcs_bg" placeholder="请填写变更后安全库存数量" class="node1"/>';
        li = li + '      </div>';
        li = li + '      <div class="mui-input-row">';
        li = li + '         <label for="fcgdj_yl">原采购单价</label>';
        li = li + '         <input type="number" id="fcgdj_yl" name="fcgdj_yl" readonly="readonly"/>';
        li = li + '      </div>';
        li = li + '      <div class="mui-input-row">';
        li = li + '         <label for="fcgdj_bg">变更后采购单价</label>';
        li = li + '         <input type="number" id="fcgdj_bg" name="fcgdj_bg" placeholder="请填写变更后采购单价" class="node1"/>';
        li = li + '      </div>';
        li = li + '      <div class="mui-input-row">';
        li = li + '         <label for="fcgzgj_yl">原采购最高价</label>';
        li = li + '         <input type="number" id="fcgzgj_yl" name="fcgzgj_yl" readonly="readonly"/>';
        li = li + '      </div>';
        li = li + '      <div class="mui-input-row">';
        li = li + '         <label for="fcgzgj_bg">变更后采购最高价</label>';
        li = li + '         <input type="number" id="fcgzgj_bg" name="fcgzgj_bg" placeholder="请填写变更后采购最高价" class="node1"/>';
        li = li + '      </div>';
        li = li + '      <div class="mui-input-row">';
        li = li + '         <label for="fgdtqq_yl">原固定提前期</label>';
        li = li + '         <input type="number" id="fgdtqq_yl" name="fgdtqq_yl" readonly="readonly"/>';
        li = li + '      </div>';
        li = li + '      <div class="mui-input-row">';
        li = li + '         <label for="fgdtqq_bg">变更后固定提前期</label>';
        li = li + '         <input type="number" id="fgdtqq_bg" name="fgdtqq_bg" placeholder="请填写变更后固定提前期" class="node1"/>';
        li = li + '      </div>';
        li = li + '      <div class="mui-input-row">';
        li = li + '         <label for="fword_yl">原采购负责人代码</label>';
        li = li + '         <input type="text" id="fword_yl" name="fword_yl" readonly="readonly"/>';
        li = li + '      </div>';
        li = li + '      <div class="mui-input-row">';
        li = li + '         <label for="fword_bg">变更后采购负责人代码</label>';
        li = li + '         <input type="text" id="fword_bg" name="fword_bg" placeholder="请选择变更后采购负责人代码" class="node1" readonly="readonly"/>';
        li = li + '      </div>';
        li = li + '      <div class="mui-input-row">';
        li = li + '         <label for="fname_yl">原采购负责人名称</label>';
        li = li + '         <input type="text" id="fname_yl" name="fname_yl" readonly="readonly"/>';
        li = li + '      </div>';
        li = li + '      <div class="mui-input-row">';
        li = li + '         <label for="fname_bg">变更后采购负责人名称</label>';
        li = li + '         <input type="text" id="fname_bg" name="fname_bg" readonly="readonly"/>';
        li = li + '      </div>';
        li = li + '      <div class="mui-input-row">';
        li = li + '         <label for="frate_yl">原税率</label>';
        li = li + '         <input type="number" id="frate_yl" name="frate_yl" readonly="readonly"/>';
        li = li + '      </div>';
        li = li + '      <div class="mui-input-row">';
        li = li + '         <label for="frate_bg">变更后税率</label>';
        li = li + '         <input type="number" id="frate_bg" name="frate_bg" placeholder="请填写变更后税率" class="node1"/>';
        li = li + '      </div>';

        li = li + '</div>  ';

        $("#mxlist").append(li);
        document.getElementById('tjmx').scrollIntoView();

        //添加明细项点击事件
        tapEvent_sub();

    });

    //添加明细项点击事件
    tapEvent_sub();

    //从索引列表中返回表单
    $(".mui-icon-left-nav").on('tap', function () {
        $("#wrapper").show();
        $("#selector").hide();
    });
   
}

//物料编码点击函数
function tapEvent_sub() {
    //添加明细项点击事件
    $("#mxlist").find("#mx").each(function () {
        //物料编码点击事件添加子表
        $(this).find("#fwlcode").on('tap', function () {
            tapEvent_fwlcode();
        });
        //变更后来源码点击事件添加子表
        $(this).find("#fcode_bg").on('tap', function () {
            tapEvent_fcode_bg();
        });
        //列表明细项点击事件
        $(this).on('tap', function () {
            flag_nowrow = $(this).find("#rowno").val();
            console.log(flag_nowrow);
        });
    });
}

//物料编码点击函数
function tapEvent_fwlcode() {
    //显示索引列表
    flag_name = 'fwlcode';
    getProcedureMsg();

    $("#wrapper").hide();
    $("#selector").show();
}
//变更后来源码点击函数
function tapEvent_fcode_bg() {
    //显示索引列表
    flag_name = 'fcode_bg';
    getProcedureMsg();

    $("#wrapper").hide();
    $("#selector").show();
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

//json字符串对象生成及明细表必输项检查
function mxItem(fwlcode, fwlname, fggxh, fcode_yl, fdesignation_yl, fcl_yl, faqkcs_yl, fcgdj_yl, fcgzgj_yl, fgdtqq_yl, fword_yl, fname_yl, frate_yl, fshuxing, fcode_bg, fdesignatio_bg, fcl_bg, faqkcs_bg, fcgdj_bg, fcgzgj_bg, fgdtqq_bg, fword_bg, fname_bg, frate_bg) {
    var mx = Object.create({
        fwlcode: fwlcode,
        fwlname: fwlname,
        fggxh: fggxh,
        fcode_yl: fcode_yl,
        fdesignation_yl: fdesignation_yl,
        fcl_yl: fcl_yl,
        faqkcs_yl:faqkcs_yl,
        fcgdj_yl: fcgdj_yl,
        fcgzgj_yl: fcgzgj_yl,
        fgdtqq_yl: fgdtqq_yl,
        fword_yl: fword_yl,
        fname_yl: fname_yl,
        frate_yl: frate_yl,
        fshuxing: fshuxing,
        fcode_bg: fcode_bg,
        fdesignatio_bg: fdesignatio_bg,
        fcl_bg: fcl_bg,
        faqkcs_bg: faqkcs_bg,
        fcgdj_bg: fcgdj_bg,
        fcgzgj_bg: fcgzgj_bg,
        fgdtqq_bg: fgdtqq_bg,
        fword_bg: fword_bg,
        fname_bg: fname_bg,
        frate_bg: frate_bg,
        _check: function () {
            if (!fwlcode) {
                mui.toast('请选择物料代码');
                return null;
            }
            
            return mx;
        }

    });
    return mx._check();
}

//抬头表必输项检查
function check(Method, Action, nodeName) {
    /*if ((String(nodeName).match('开始') != null) || (String(nodeName).match('undefined') != null)) {*/
    if (((String(Method).match('Post') != null) && (String(Action).match('提交') != null))||(String(nodeName).match('开始') != null)){
        //如果是发起或重新发起状态
        /*if (!fswlx) {
            mui.toast('请输入事务类型');
            return false;
        }*/
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
    var fname = $("#fname").val();
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();
    var ftel = $("#ftel").val();
    var fremark = $("#fremark").val();
    var ffj = $("#ffj").val();

    /*
    flag_check = check(Method, Action,nodeName);//必输项检查
    if (!flag_check) {//如果返回false  
        return null;
    }
    */

    //明细表
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fwlcode = $(this).find("#fwlcode").val();
        var fwlname = $(this).find("#fwlname").val();
        var fggxh = $(this).find("#fggxh").val();
        var fcode_yl = $(this).find("#fcode_yl").val();
        var fdesignation_yl = $(this).find("#fdesignation_yl").val();
        var fcl_yl = $(this).find("#fcl_yl").val();
        var faqkcs_yl = $(this).find("#faqkcs_yl").val();
        var fcgdj_yl = $(this).find("#fcgdj_yl").val();
        var fcgzgj_yl = $(this).find("#fcgzgj_yl").val();
        var fgdtqq_yl = $(this).find("#fgdtqq_yl").val();
        var fword_yl = $(this).find("#fword_yl").val();
        var fname_yl = $(this).find("#fname_yl").val();
        var frate_yl = $(this).find("#frate_yl").val();
        var fshuxing = '自制';
        
        var fcode_bg = $(this).find("#fcode_bg").val();
        var fdesignatio_bg = $(this).find("#fdesignatio_bg").val();
        var fcl_bg = $(this).find("#fcl_bg").val();
        var faqkcs_bg = $(this).find("#faqkcs_bg").val();
        var fcgdj_bg = $(this).find("#fcgdj_bg").val();
        var fcgzgj_bg = $(this).find("#fcgzgj_bg").val();
        var fgdtqq_bg = $(this).find("#fgdtqq_bg").val();
        var fword_bg = $(this).find("#fword_bg").val();
        var fname_bg = $(this).find("#fname_bg").val();
        var frate_bg = $(this).find("#frate_bg").val();
        var mx = mxItem(fwlcode, fwlname, fggxh, fcode_yl, fdesignation_yl, fcl_yl, faqkcs_yl, fcgdj_yl, fcgzgj_yl, fgdtqq_yl, fword_yl, fname_yl, frate_yl, fshuxing, fcode_bg, fdesignatio_bg, fcl_bg, faqkcs_bg, fcgdj_bg, fcgzgj_bg, fgdtqq_bg, fword_bg, fname_bg, frate_bg);
        if (!mx) {
            flag_check = false;
            return null;
        }
        else {
            mxlistArr.push(mx);
        }
    });

    if (!flag_check) {//如果检查报错  
        return null;
    }

    //set xml
    var xml = '<?xml version= "1.0" ?>';
    xml = xml + '   <XForm>';
    xml = xml + '        <Header>';
    xml = xml + '          <Method>' + Method + '</Method>';

    if (Method == "Post" && Action == "提交") {//发起提交
        xml = xml + '          <ProcessName>医疗系统公司物料采购信息变更申请</ProcessName>';
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
    xml = xml + '           <BPM_YLXTWLBG_A>';

    if (Method == "Post" && Action == "提交") {//发起提交
        xml = xml + '           <fbillno>自动生成</fbillno>';
    } else if (Method == "Process") {//重新发起提交、审批同意
        xml = xml + '           <fbillno>' + fbillno + '</fbillno>';
    }

    xml = xml + '               <fname>' + fname + '</fname>';
    xml = xml + '               <fdept>' + fdept + '</fdept>';
    xml = xml + '               <fdate>' + fdate + '</fdate>';
    xml = xml + '               <ftel>' + ftel + '</ftel>';
    xml = xml + '               <fremark>' + fremark + '</fremark>';
    //xml = xml + '               <ffj>' + ffj + '</ffj>';
    xml = xml + '               <fj>' + fjArray.join(';') + '</fj>';
    xml = xml + '           </BPM_YLXTWLBG_A>';
 
    for (var i = 0; i < mxlistArr.length; i++) {
        xml = xml + ' <BPM_YLXTWLBG_B>';
        xml = xml + '  <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';

        if ((Method == "Post" && Action == "提交") || (Method == "Process" && Action == "提交")) {//发起提交、重新发起提交
            xml = xml + '  <RowPrimaryKeys></RowPrimaryKeys>';
        }
        else if (Method == "Process" && Action == "同意") {//同意
            xml = xml + '  <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
        }
        xml = xml + '  <fentryno>' + (i + 1) + '</fentryno>';
       
        xml = xml + '  <fwlcode>' + mxlistArr[i].fwlcode + '</fwlcode>';
        xml = xml + '  <fwlname>' + mxlistArr[i].fwlname + '</fwlname>';
        xml = xml + '  <fggxh>' + mxlistArr[i].fggxh + '</fggxh>';
        xml = xml + '  <fcode_yl>' + mxlistArr[i].fcode_yl + '</fcode_yl>';
        xml = xml + '  <fdesignation_yl>' + mxlistArr[i].fdesignation_yl + '</fdesignation_yl>';
        xml = xml + '  <fcl_yl>' + mxlistArr[i].fcl_yl + '</fcl_yl>';
        xml = xml + '  <faqkcs_yl>' + mxlistArr[i].faqkcs_yl + '</faqkcs_yl>';
        xml = xml + '  <fcgdj_yl>' + mxlistArr[i].fcgdj_yl + '</fcgdj_yl>';
        xml = xml + '  <fcgzgj_yl>' + mxlistArr[i].fcgzgj_yl + '</fcgzgj_yl>';
        xml = xml + '  <fgdtqq_yl>' + mxlistArr[i].fgdtqq_yl + '</fgdtqq_yl>';
        xml = xml + '  <fword_yl>' + mxlistArr[i].fword_yl + '</fword_yl>';
        xml = xml + '  <fname_yl>' + mxlistArr[i].fname_yl + '</fname_yl>';
        xml = xml + '  <frate_yl>' + mxlistArr[i].frate_yl + '</frate_yl>';

        xml = xml + '  <fshuxing>' + mxlistArr[i].fshuxing + '</fshuxing>';
        xml = xml + '  <fcode_bg>' + mxlistArr[i].fcode_bg + '</fcode_bg>';
        xml = xml + '  <fdesignatio_bg>' + mxlistArr[i].fdesignatio_bg + '</fdesignatio_bg>';
        xml = xml + '  <fcl_bg>' + mxlistArr[i].fcl_bg + '</fcl_bg>';
        xml = xml + '  <faqkcs_bg>' + mxlistArr[i].faqkcs_bg + '</faqkcs_bg>';
        xml = xml + '  <fcgdj_bg>' + mxlistArr[i].fcgdj_bg + '</fcgdj_bg>';
        xml = xml + '  <fcgzgj_bg>' + mxlistArr[i].fcgzgj_bg + '</fcgzgj_bg>';
        xml = xml + '  <fgdtqq_bg>' + mxlistArr[i].fgdtqq_bg + '</fgdtqq_bg>';
        xml = xml + '  <fword_bg>' + mxlistArr[i].fword_bg + '</fword_bg>';
        xml = xml + '  <fname_bg>' + mxlistArr[i].fname_bg + '</fname_bg>';
        xml = xml + '  <frate_bg>' + mxlistArr[i].frate_bg + '</frate_bg>';

        xml = xml + ' </BPM_YLXTWLBG_B>';
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
    mui.confirm('即将提交，是否确定？', '提交确认提醒', btnArry, function (e) {
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
    mui.confirm('即将提交，是否确定？', '提交确认提醒', btnArry, function (e) {
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

            //ajax异步函数执行结束后，要执行的代码可写入consignAjax.then(function () {...});
            //consignUserStr参数的使用要在函数执行结束后使用,否则为undefined，
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

//待办--节点控制字段
function nodeControllerExp(NodeName) {
    //mui.toast(NodeName);
    tapEvent_csswitch();

    if (NodeName == '开始') {//返回重填，开始节点
        /*
        tapEvent1();//点击事件

        $("#addbtn_fj").css("display", "block");
        upload();//允许附件上传

        //添加明细按钮及删除图标
        $("#tjmx").show();
        $(".node1").removeAttr('readonly');

        $("#ftel").attr('placeholder', '请填写联系方式');
        $("#fremark").attr('placeholder', '请填写备注');
        $("#mxlist").find('#mx').each(function () {
            $(this).find("#deleteProduct").show();

            $(this).find("#fwlcode").attr('placeholder', '请选择物料代码');
            $(this).find("#fcode_bg").attr('placeholder', '请选择变更后来源编码');
            $(this).find("#fcl_bg").attr('placeholder', '请填写变更后最高存量');
            $(this).find("#faqkcs_bg").attr('placeholder', '请填写变更后安全库存数量');
            $(this).find("#fcgdj_bg").attr('placeholder', '请填写变更后采购单价');
            $(this).find("#fcgzgj_bg").attr('placeholder', '请填写变更后采购最高价');
            $(this).find("#fgdtqq_bg").attr('placeholder', '请填写变更后固定提前期');
            $(this).find("#fword_bg").attr('placeholder', '请选择变更后采购负责人代码');
            $(this).find("#frate_bg").attr('placeholder', '请填写变更后税率');

        });
        */

        //此流程app只审批不发起
        $("#commitbt").hide();
        mui.alert('请在网页上提交该流程!');

    }
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
                    //用于一个字段存储多值情况，如id+desc
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
                    //用于一个字段存储多值情况，如id+desc
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
