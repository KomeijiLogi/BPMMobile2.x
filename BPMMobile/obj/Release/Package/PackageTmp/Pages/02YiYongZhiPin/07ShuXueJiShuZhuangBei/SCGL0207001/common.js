function prepMsg() {
    $("#fdate").val(getNowFormatDate(2));
    tapEvent();
    tapStartEvent();
    upload();

    var xml = '<?xml version= "1.0" ?>';
    xml = xml + '   <Requests>';
    xml = xml + '   <Params>';
    xml = xml + '       <Method>GetFormPostData</Method>';
    xml = xml + '       <ProcessName>输血器材公司生产管理提报</ProcessName>';
    xml = xml + '      <ProcessVersion>' + version + '</ProcessVersion>';
    xml = xml + '      <Owner></Owner>';
    xml = xml + '    </Params>';
    xml = xml + '   </Requests>';
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
        $("#fname").val(item.报告人);

    }).fail(function (e) {

    });
}

function tapStartEvent() {
    var fdeptdata = [
        {
            value: '',
            text: '注塑'
        },
        {
            value: '',
            text: '挤出'
        },
        {
            value: '',
            text: '压延'
        },
        {
            value: '',
            text: '筒膜'
        },
        {
            value: '',
            text: '组装'
        },
        {
            value: '',
            text: '灌装'
        },
        {
            value: '',
            text: '灭菌'
        },
        {
            value: '',
            text: '包装'
        },
        {
            value: '',
            text: '输血器组装'
        },
        {
            value: '',
            text: '滤器组装'
        },
        {
            value: '',
            text: '设备'
        },
        {
            value: '',
            text: '质量'
        },
        {
            value: '',
            text: '技术'
        },
        {
            value: '',
            text: '生产'
        }
    ];
    showPicker('fdept', fdeptdata);
}
function tapEvent() {
   

    $('#tjmx_jz').on('tap', function () {

        var li = '<div id="mx" class="mui-card">';
        li = li + '   <div class="mui-input-row itemtitle">';
        li = li + '      <label>纠正措施计划</label>';
        li = li + '      <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '      <label for="fgznr">工作内容<i style="color:red;">*</i></label>';
        li = li + '      <input type="text" id="fgznr" name="fgznr" placeholder="请填写工作内容"/>';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '      <label for="ffzr">负责人<i style="color:red;">*</i></label>';
        li = li + '      <input type="text" id="ffzr" name="ffzr" placeholder="请填写负责人"/>';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '      <label for="fyj_date">预计完成时间<i style="color:red;">*</i></label>';
        li = li + '      <input type="date" id="fyj_date" name="fyj_date"/>';
        li = li + '   </div>';
        li = li + '</div>';
        $("#mxlist_jz").append(li);
    });
    $('#tjmx_yf').on('tap', function () {
        var li = '<div id="mx" class="mui-card">';
        li = li + '   <div class="mui-input-row itemtitle">';
        li = li + '      <label>预防措施计划</label>';
        li = li + '      <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '      <label for="fgznr">工作内容<i style="color:red;">*</i></label>';
        li = li + '      <input type="text" id="fgznr" name="fgznr" placeholder="请填写工作内容"/>';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '      <label for="ffzr">负责人<i style="color:red;">*</i></label>';
        li = li + '      <input type="text" id="ffzr" name="ffzr" placeholder="请填写负责人"/>';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '      <label for="fyj_date">预计完成时间<i style="color:red;">*</i></label>';
        li = li + '      <input type="date" id="fyj_date" name="fyj_date"/>';
        li = li + '   </div>';
        li = li + '</div>';
        $("#mxlist_yf").append(li);
    });
}
function mxItem(fgznr, ffzr, fyj_date) {
    var mx = Object.create({
        fgznr: fgznr,
        ffzr: ffzr,
        fyj_date: fyj_date,
        _check: function () {
            if (!fgznr){
                mui.toast('请填写工作内容');
                return null;
            }
            if (!ffzr) {
                mui.toast('请填写负责人');
                return null;
            }
            if (!fyj_date) {
                mui.toast('请选择预计完成时间');
                return null;
            }
            return mx;

        }
    });
    return mx._check();
}

var itemidArr1 = new Array();
var itemidArr2 = new Array();

function initData(data, flag) {
    var item = data.FormDataSet.输血器材_异常提报_主表[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.单号);
    }
    $("#fname").val(item.报告人);
    $("#fdate").val(FormatterTimeYMS(item.报告日期));
    $("#fdept").val(item.异常部门);
    $("#fycmc").val(item.异常名称);
    $("#fycms").val(item.异常描述);
    $("#ffwyx").val(item.范围及影响);
    $("#fyyfx").val(item.原因分析);
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
                        var downurl = 'http://app.weigaogroup.com:8040/BPM/YZSoft/Attachment/default.ashx?' + data[i].FileID;
                        var attach = attachItem(name, type, size, time, downurl);
                        attachArray.push(attach);



                        var li = '<div class="pic-preview smallyulan success">';
                        li = li + ' <div class="del none" style="opacity:1;z-index:999;"onclick="delPicture(this)">x</div>';

                        //类型判断
                        if ((data[i].Ext).indexOf("png") != -1 || (data[i].Ext).indexOf("jpg") != -1 || (data[i].Ext).indexOf("bmp") != -1) {

                            //li = li + '    <div class="img-wrap smallimg" id="simg" ><a href="http://app.weigaogroup.com:8040/BPM/YZSoft/Attachment/default.ashx?' + data[i].FileID + '"><img src="http://app.weigaogroup.com:8040/BPM/YZSoft/Attachment/default.ashx?' + data[i].FileID + '"/></a></div>';
                            li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '" ><img src="http://app.weigaogroup.com:8040/BPM/YZSoft/Attachment/default.ashx?' + data[i].FileID + '"/></div>';

                        } else if ((data[i].Ext).indexOf("xls") != -1) {

                            li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '"><img src="../../../../Content/images/xlsx@2x.png"/></div>';

                        } else if ((data[i].Ext).indexOf("doc") != -1) {

                            li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '"><img src="../../../../Content/images/docx@2x.png"/></div>';

                        } else if ((data[i].Ext).indexOf("ppt") != -1) {

                            li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '"><img src="../../../../Content/images/ppt@2x.png"/></div>';

                        } else if ((data[i].Ext).indexOf("pdf") != -1) {

                            li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '"><img src="../../../../Content/images/pdf@2x.png"/></div>';

                        } else if ((data[i].Ext).indexOf("zip") != -1 || (data[i].Ext).indexOf("rar") != -1 || (data[i].Ext).indexOf("7z") != -1) {

                            li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '"><img src="../../../../Content/images/zip@2x.png"/></div>';

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

                        watch();


                    }

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

    var item_c1 = data.FormDataSet.输血器材_异常提报_子表纠正;
    for (var i = 0; i < item_c1.length; i++){
        itemidArr1.push(item_c1[i].itemid);
        var li = '<div id="mx" class="mui-card">';
        li = li + '   <div class="mui-input-row itemtitle">';
        li = li + '      <label>纠正措施计划</label>';
        li = li + '      <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '      <label for="fgznr">工作内容<i style="color:red;">*</i></label>';
        li = li + '      <input type="text" id="fgznr" name="fgznr" readonly="readonly" value="' + changeNullToEmpty( item_c1[i].工作内容) + '"/>';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '      <label for="ffzr">负责人<i style="color:red;">*</i></label>';
        li = li + '      <input type="text" id="ffzr" name="ffzr" readonly="readonly" value="' + changeNullToEmpty( item_c1[i].负责人 )+ '"/>';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '      <label for="fyj_date">预计完成时间<i style="color:red;">*</i></label>';
        li = li + '      <input type="date" id="fyj_date" name="fyj_date" readonly="readonly" value="' + FormatterTimeYMS( item_c1[i].预计完成日期) + '"/>';
        li = li + '   </div>';
        li = li + '</div>';
        $("#mxlist_jz").append(li);
    }

    var item_c2 = data.FormDataSet.输血器材_异常提报_子表预防;
    for (var i = 0; i < item_c2.length; i++) {
        itemidArr2.push(item_c2[i].itemid);
        var li = '<div id="mx" class="mui-card">';
        li = li + '   <div class="mui-input-row itemtitle">';
        li = li + '      <label>预防措施计划</label>';
        li = li + '      <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '      <label for="fgznr">工作内容<i style="color:red;">*</i></label>';
        li = li + '      <input type="text" id="fgznr" name="fgznr" readonly="readonly" value="' + changeNullToEmpty( item_c2[i].工作内容) + '"/>';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '      <label for="ffzr">负责人<i style="color:red;">*</i></label>';
        li = li + '      <input type="text" id="ffzr" name="ffzr" readonly="readonly" value="' + changeNullToEmpty( item_c2[i].负责人) + '"/>';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '      <label for="fyj_date">预计完成时间<i style="color:red;">*</i></label>';
        li = li + '      <input type="date" id="fyj_date" name="fyj_date" readonly="readonly" value="' + FormatterTimeYMS(item_c2[i].预计完成日期) + '"/>';
        li = li + '   </div>';
        li = li + '</div>';
        $("#mxlist_yf").append(li);
    }

}
action = '同意';
function nodeControllerExp(NodeName) {
    if (NodeName == '开始') {
        tapEvent();
        upload();
        $("#fycmc").removeAttr('readonly');
    } else if (NodeName == "sysInform") {

    } else {
        if (typeof (NodeName) != "undefined") {
            if (String(NodeName).indexOf('班长') != -1 && String(NodeName).indexOf('知会') == -1) {
                $("#tjmx_jz,#tjmx_yf").show();
                $("#mxlist_jz,#mxlist_yf").find("input").each(function () {
                    $(this).removeAttr('readonly');
                    $(this).attr('placeholder', '请填写对应内容');
                });
                $("#mxlist_jz,#mxlist_yf").find('span').each(function () {
                    $(this).show();
                });
                tapEvent();
                upload();
                $(".upload-addbtn").show();
                $("#fycms,#ffwyx,#fyyfx").attr('placeholder', '请填写对应内容');
                $("#fycms,#ffwyx,#fyyfx").removeAttr('readonly');

                action = '提交';
                $("#agreebt").text(action);
              
            } else if (String(NodeName) == '设备副经理' || String(NodeName) == '质量管理员' || String(NodeName) == '技术主管' || String(NodeName) == '生产经理1') {
                $("#tjmx_jz,#tjmx_yf").show();
                $("#mxlist_jz,#mxlist_yf").find("input").each(function () {
                    $(this).removeAttr('readonly');
                    $(this).attr('placeholder', '请填写对应内容');
                });
                $("#mxlist_jz,#mxlist_yf").find('span').each(function () {
                    $(this).show();
                });
                tapEvent();
                upload();
                $(".upload-addbtn").show();
                $("#fycms,#ffwyx,#fyyfx").removeAttr('readonly');
                $("#fycms,#ffwyx,#fyyfx").attr('placeholder', '请填写对应内容');
                action = '提交';
                $("#agreebt").text(action);
               
            } else if (String(NodeName) == '质量主管') {
                $("#approvalD").empty();
                var li = '&nbsp;&nbsp;';
                li = li + ' <button class="mui-btn mui-btn-primary" type="button" style="width:25%" id="agreebt" onclick="showConfirm()">合格</button> &nbsp;&nbsp;&nbsp;';
                li = li + ' <button class="mui-btn mui-btn-yellow" type="button" style="width:25%" id="refusebt" onclick="showConfirm()">不合格</button> &nbsp;&nbsp;&nbsp;';
                li = li + ' <button class="mui-btn mui-btn-danger" type="button" style="width:25%" id="disagreebt" onclick="reject()">拒绝</button> &nbsp;&nbsp;&nbsp;';
                $("#approvalD").append(li);
                $("#agreebt").on('tap', function () {
                    action = '合格';
                });
                $("#refusebt").on('tap', function () {
                    action = '不合格';
                });
            }
        }
    }
}


function Save() {
    var fname = $("#fname").val();
    var fdate = $("#fdate").val();
    var fdept = $("#fdept").val();
    var fycmc = $("#fycmc").val();
    var fycms = $("#fycms").val();
    var ffwyx = $("#ffwyx").val();
    var fyyfx = $("#fyyfx").val();

    if (!fdept) {
        mui.toast('请选择异常部门');
        return;
    }
    if (!fycmc) {
        mui.toast('请填写异常名称');
        return;
    }
    var btnArry = ["取消", "确定"];
    mui.confirm('即将提交，是否确定？', '提交确认提醒', btnArry, function (e) {
        if (e.index == 1) {
            var xml = '<?xml version= "1.0" ?>';
            xml = xml + '   <XForm>';
            xml = xml + '         <Header>';
            xml = xml + '        <Method>Post</Method>';
            xml = xml + '       <ProcessName>输血器材公司生产管理提报</ProcessName>';
            xml = xml + '         <ProcessVersion>' + version + '</ProcessVersion>';
            xml = xml + '            <DraftGuid></DraftGuid>';
            xml = xml + '             <OwnerMemberFullName>' + BPMOU + '</OwnerMemberFullName>';
            xml = xml + '            <Action>提交</Action>';
            xml = xml + '          <Comment></Comment>';
            xml = xml + '             <InviteIndicateUsers></InviteIndicateUsers>';
            xml = xml + '       </Header>';
            xml = xml + '       <FormData>';

            xml = xml + '     <输血器材_异常提报_主表>';
            xml = xml + '      <单号>自动生成</单号>';
            xml = xml + '      <报告人>' + fname + '</报告人>';
            xml = xml + '     <报告日期>' + fdate + '</报告日期>';
            xml = xml + '    <异常部门>' + fdept + '</异常部门>';
            xml = xml + '    <异常名称>' + fycmc + '</异常名称>';
            xml = xml + '      <异常描述></异常描述>';
            xml = xml + '     <附件>' + fjArray.join(";") + '</附件>';
            xml = xml + '      <范围及影响></范围及影响>';
            xml = xml + '      <原因分析></原因分析>';
            xml = xml + '     </输血器材_异常提报_主表>';
            xml = xml + '  <输血器材_异常提报_子表纠正>';
            xml = xml + '     <RelationRowGuid>1</RelationRowGuid>';
            xml = xml + '   <RowPrimaryKeys></RowPrimaryKeys>';
            xml = xml + '    <序号>1</序号>';
            xml = xml + '   <工作内容></工作内容>';
            xml = xml + '   <负责人></负责人>';
            xml = xml + '    <预计完成日期></预计完成日期>';
            xml = xml + '  </输血器材_异常提报_子表纠正>';
            xml = xml + '   <输血器材_异常提报_子表预防>';
            xml = xml + '      <RelationRowGuid>2</RelationRowGuid>';
            xml = xml + '     <RowPrimaryKeys></RowPrimaryKeys>';
            xml = xml + '    <序号>1</序号>';
            xml = xml + '    <工作内容></工作内容>';
            xml = xml + '     <负责人></负责人>';
            xml = xml + '     <预计完成日期></预计完成日期>';
            xml = xml + '     </输血器材_异常提报_子表预防>';
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
    var fdate = $("#fdate").val();
    var fdept = $("#fdept").val();
    var fycmc = $("#fycmc").val();
    var fycms = $("#fycms").val();
    var ffwyx = $("#ffwyx").val();
    var fyyfx = $("#fyyfx").val();

    if (!fdept) {
        mui.toast('请选择异常部门');
        return;
    }
    if (!fycmc) {
        mui.toast('请填写异常名称');
        return;
    }
    var mxflag = false;
   

    var mxlistArr1 = new Array();
    $("#mxlist_jz").find("#mx").each(function () {
        var fgznr = $(this).find("#fgznr").val();
        var ffzr = $(this).find("#ffzr").val();
        var fyj_date = $(this).find("#fyj_date").val();
        if (fgznr || ffzr || fyj_date) {
            var mx = mxItem(fgznr, ffzr, fyj_date);
            mxlistArr1.push(mx);
        } else {
            mxflag = true;
        }

      

    });
    var mxlistArr2 = new Array();
    $("#mxlist_yf").find("#mx").each(function () {
        var fgznr = $(this).find("#fgznr").val();
        var ffzr = $(this).find("#ffzr").val();
        var fyj_date = $(this).find("#fyj_date").val();

        if (fgznr || ffzr || fyj_date) {
            var mx = mxItem(fgznr, ffzr, fyj_date);
            mxlistArr2.push(mx);
        } else {
            mxflag = true;
        }


    });
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

            xml = xml + '     <输血器材_异常提报_主表>';
            xml = xml + '      <单号>' + fbillno + '</单号>';
            xml = xml + '      <报告人>' + fname + '</报告人>';
            xml = xml + '     <报告日期>' + fdate + '</报告日期>';
            xml = xml + '    <异常部门>' + fdept + '</异常部门>';
            xml = xml + '    <异常名称>' + fycmc + '</异常名称>';
            xml = xml + '      <异常描述>' + fycms + '</异常描述>';
            xml = xml + '     <附件>' + fjArray.join(";") + '</附件>';
            xml = xml + '      <范围及影响>' + ffwyx + '</范围及影响>';
            xml = xml + '      <原因分析>' + fyyfx + '</原因分析>';
            xml = xml + '     </输血器材_异常提报_主表>';

            if (mxflag) {
                xml = xml + '  <输血器材_异常提报_子表纠正>';
                xml = xml + '     <RelationRowGuid>1</RelationRowGuid>';
                xml = xml + '   <RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + '    <序号>1</序号>';
                xml = xml + '   <工作内容></工作内容>';
                xml = xml + '   <负责人></负责人>';
                xml = xml + '    <预计完成日期></预计完成日期>';
                xml = xml + '  </输血器材_异常提报_子表纠正>';
                xml = xml + '   <输血器材_异常提报_子表预防>';
                xml = xml + '      <RelationRowGuid>2</RelationRowGuid>';
                xml = xml + '     <RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + '    <序号>1</序号>';
                xml = xml + '    <工作内容></工作内容>';
                xml = xml + '     <负责人></负责人>';
                xml = xml + '     <预计完成日期></预计完成日期>';
                xml = xml + '     </输血器材_异常提报_子表预防>';
            } else {
                if (mxlistArr1.length != 0) {
                    for (var i = 0; i < mxlistArr1.length;i++){
                        xml = xml + '  <输血器材_异常提报_子表纠正>';
                        xml = xml + '     <RelationRowGuid>'+(i+1)+'</RelationRowGuid>';
                        xml = xml + '   <RowPrimaryKeys></RowPrimaryKeys>';
                        xml = xml + '    <序号>' + (i + 1) + '</序号>';
                        xml = xml + '   <工作内容>' + mxlistArr1[i].fgznr + '</工作内容>';
                        xml = xml + '   <负责人>' + mxlistArr1[i].ffzr + '</负责人>';
                        xml = xml + '    <预计完成日期>' + mxlistArr1[i].fyj_date + '</预计完成日期>';
                        xml = xml + '  </输血器材_异常提报_子表纠正>';
                    }
                } else {
                    xml = xml + '  <输血器材_异常提报_子表纠正>';
                    xml = xml + '     <RelationRowGuid>1</RelationRowGuid>';
                    xml = xml + '   <RowPrimaryKeys></RowPrimaryKeys>';
                    xml = xml + '    <序号>1</序号>';
                    xml = xml + '   <工作内容></工作内容>';
                    xml = xml + '   <负责人></负责人>';
                    xml = xml + '    <预计完成日期></预计完成日期>';
                    xml = xml + '  </输血器材_异常提报_子表纠正>';
                }
                if (mxlistArr2.length != 0) {
                    for (var i = 0; i < mxlistArr2.length; i++) {
                        xml = xml + '  <输血器材_异常提报_子表预防>';
                        xml = xml + '     <RelationRowGuid>' + mxlistArr1.length+(i + 1) + '</RelationRowGuid>';
                        xml = xml + '   <RowPrimaryKeys></RowPrimaryKeys>';
                        xml = xml + '    <序号>' + (i + 1) + '</序号>';
                        xml = xml + '   <工作内容>' + mxlistArr2[i].fgznr + '</工作内容>';
                        xml = xml + '   <负责人>' + mxlistArr2[i].ffzr + '</负责人>';
                        xml = xml + '    <预计完成日期>' + mxlistArr2[i].fyj_date + '</预计完成日期>';
                        xml = xml + '  </输血器材_异常提报_子表预防>';
                    }
                } else {
                    xml = xml + '   <输血器材_异常提报_子表预防>';
                    xml = xml + '      <RelationRowGuid>' + mxlistArr1.length+1 + '</RelationRowGuid>';
                    xml = xml + '     <RowPrimaryKeys></RowPrimaryKeys>';
                    xml = xml + '    <序号>1</序号>';
                    xml = xml + '    <工作内容></工作内容>';
                    xml = xml + '     <负责人></负责人>';
                    xml = xml + '     <预计完成日期></预计完成日期>';
                    xml = xml + '     </输血器材_异常提报_子表预防>';
                }
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
    var fdate = $("#fdate").val();
    var fdept = $("#fdept").val();
    var fycmc = $("#fycmc").val();
    var fycms = $("#fycms").val();
    var ffwyx = $("#ffwyx").val();
    var fyyfx = $("#fyyfx").val();

    var mxflag = false;


    var mxlistArr1 = new Array();
    $("#mxlist_jz").find("#mx").each(function () {
        var fgznr = $(this).find("#fgznr").val();
        var ffzr = $(this).find("#ffzr").val();
        var fyj_date = $(this).find("#fyj_date").val();
        var mx = mxItem(fgznr, ffzr, fyj_date);
        mxlistArr1.push(mx);
       
       

    });
    var mxlistArr2 = new Array();
    $("#mxlist_yf").find("#mx").each(function () {
        var fgznr = $(this).find("#fgznr").val();
        var ffzr = $(this).find("#ffzr").val();
        var fyj_date = $(this).find("#fyj_date").val();
        var mx = mxItem(fgznr, ffzr, fyj_date);
        mxlistArr2.push(mx);
        
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

            xml = xml + '     <输血器材_异常提报_主表>';
            xml = xml + '      <单号>' + fbillno + '</单号>';
            xml = xml + '      <报告人>' + fname + '</报告人>';
            xml = xml + '     <报告日期>' + fdate + '</报告日期>';
            xml = xml + '    <异常部门>' + fdept + '</异常部门>';
            xml = xml + '    <异常名称>' + fycmc + '</异常名称>';
            xml = xml + '      <异常描述>' + fycms + '</异常描述>';
            xml = xml + '     <附件>' + fjArray.join(";") + '</附件>';
            xml = xml + '      <范围及影响>' + ffwyx + '</范围及影响>';
            xml = xml + '      <原因分析>' + fyyfx + '</原因分析>';
            xml = xml + '     </输血器材_异常提报_主表>';

            if (mxlistArr1.length != 0) {
                for (var i = 0; i < mxlistArr1.length; i++) {
                    xml = xml + '  <输血器材_异常提报_子表纠正>';
                    xml = xml + '     <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                    xml = xml + '   <RowPrimaryKeys>itemid=' + itemidArr1[i] + '</RowPrimaryKeys>';
                    xml = xml + '    <序号>' + (i + 1) + '</序号>';
                    xml = xml + '   <工作内容>' + mxlistArr1[i].fgznr + '</工作内容>';
                    xml = xml + '   <负责人>' + mxlistArr1[i].ffzr + '</负责人>';
                    xml = xml + '    <预计完成日期>' + mxlistArr1[i].fyj_date + '</预计完成日期>';
                    xml = xml + '  </输血器材_异常提报_子表纠正>';
                }
            } else {
                xml = xml + '  <输血器材_异常提报_子表纠正>';
                xml = xml + '     <RelationRowGuid>1</RelationRowGuid>';
                xml = xml + '   <RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + '    <序号>1</序号>';
                xml = xml + '   <工作内容></工作内容>';
                xml = xml + '   <负责人></负责人>';
                xml = xml + '    <预计完成日期></预计完成日期>';
                xml = xml + '  </输血器材_异常提报_子表纠正>';
            }
            if (mxlistArr2.length != 0) {
                for (var i = 0; i < mxlistArr2.length; i++) {
                    xml = xml + '  <输血器材_异常提报_子表预防>';
                    xml = xml + '     <RelationRowGuid>' + mxlistArr1.length + (i + 1) + '</RelationRowGuid>';
                    xml = xml + '   <RowPrimaryKeys>itemid=' + itemidArr2[i] + '</RowPrimaryKeys>';
                    xml = xml + '    <序号>' + (i + 1) + '</序号>';
                    xml = xml + '   <工作内容>' + mxlistArr2[i].fgznr + '</工作内容>';
                    xml = xml + '   <负责人>' + mxlistArr2[i].ffzr + '</负责人>';
                    xml = xml + '    <预计完成日期>' + mxlistArr2[i].fyj_date + '</预计完成日期>';
                    xml = xml + '  </输血器材_异常提报_子表预防>';
                }
            } else {
                xml = xml + '   <输血器材_异常提报_子表预防>';
                xml = xml + '      <RelationRowGuid>' + mxlistArr1.length + 1 + '</RelationRowGuid>';
                xml = xml + '     <RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + '    <序号>1</序号>';
                xml = xml + '    <工作内容></工作内容>';
                xml = xml + '     <负责人></负责人>';
                xml = xml + '     <预计完成日期></预计完成日期>';
                xml = xml + '     </输血器材_异常提报_子表预防>';
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
    var nodeName = $("#nodeName").val();

    var fname = $("#fname").val();
    var fdate = $("#fdate").val();
    var fdept = $("#fdept").val();
    var fycmc = $("#fycmc").val();
    var fycms = $("#fycms").val();
    var ffwyx = $("#ffwyx").val();
    var fyyfx = $("#fyyfx").val();
    
    if (String(nodeName).indexOf('班长') != -1 && String(nodeName).indexOf('知会') == -1) {
        if (!fycms) {
            mui.toast('请填写异常内容描述');
            return;
        }
        if (!ffwyx) {
            mui.toast('请填写涉及范围及影响');
            return;
        }
        if (!fyyfx) {
            mui.toast('请填写原因分析');
            return;
        }
    } else if (String(nodeName) == '设备副经理' || String(nodeName) == '质量管理员' || String(nodeName) == '技术主管' || String(nodeName) == '生产经理1') {
        if (!fycms) {
            mui.toast('请填写异常内容描述');
            return;
        }
        if (!ffwyx) {
            mui.toast('请填写涉及范围及影响');
            return;
        }
        if (!fyyfx) {
            mui.toast('请填写原因分析');
            return;
        }
    }
    var mxflag = false;


    var mxlistArr1 = new Array();
    $("#mxlist_jz").find("#mx").each(function () {
        var fgznr = $(this).find("#fgznr").val();
        var ffzr = $(this).find("#ffzr").val();
        var fyj_date = $(this).find("#fyj_date").val();
        if (mxItem(fgznr, ffzr, fyj_date) == null) {
            mxflag = true;
            return;
        }
        var mx = mxItem(fgznr, ffzr, fyj_date);
        mxlistArr1.push(mx);



    });
    var mxlistArr2 = new Array();
    $("#mxlist_yf").find("#mx").each(function () {
        var fgznr = $(this).find("#fgznr").val();
        var ffzr = $(this).find("#ffzr").val();
        var fyj_date = $(this).find("#fyj_date").val();
        var mx = mxItem(fgznr, ffzr, fyj_date);
        mxlistArr2.push(mx);
        if (mxItem(fgznr, ffzr, fyj_date) == null) {
            mxflag = true;
            return;
        }
    });
    if (mxflag) {
        return;
    }
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
                consignUserStr = (String)($('#consignUser').val()).replace(",", ";");



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
            xml = xml + '<Action>' + action + '</Action>';
            xml = xml + '<Comment>' + comment + '</Comment>';

            //加签差异部分
            xml = xml + '<ConsignEnabled>True</ConsignEnabled>';
            xml = xml + '<ConsignUsers>' + consignUserStr + '</ConsignUsers>';
            xml = xml + '<ConsignRoutingType>' + consignRoutingType + '</ConsignRoutingType>';
            xml = xml + '<ConsignReturnType>' + consignReturnType + '</ConsignReturnType>';

            xml = xml + '<InviteIndicateUsers></InviteIndicateUsers>';
            xml = xml + '</Header>';
            xml = xml + '<FormData>';

            xml = xml + '     <输血器材_异常提报_主表>';
            xml = xml + '      <单号>' + fbillno + '</单号>';
            xml = xml + '      <报告人>' + fname + '</报告人>';
            xml = xml + '     <报告日期>' + fdate + '</报告日期>';
            xml = xml + '    <异常部门>' + fdept + '</异常部门>';
            xml = xml + '    <异常名称>' + fycmc + '</异常名称>';
            xml = xml + '      <异常描述>' + fycms + '</异常描述>';
            xml = xml + '     <附件>' + fjArray.join(";") + '</附件>';
            xml = xml + '      <范围及影响>' + ffwyx + '</范围及影响>';
            xml = xml + '      <原因分析>' + fyyfx + '</原因分析>';
            xml = xml + '     </输血器材_异常提报_主表>';

            if (mxlistArr1.length != 0) {
                for (var i = 0; i < mxlistArr1.length; i++) {
                    xml = xml + '  <输血器材_异常提报_子表纠正>';
                    xml = xml + '     <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                    xml = xml + '   <RowPrimaryKeys>itemid=' + itemidArr1[i] + '</RowPrimaryKeys>';
                    xml = xml + '    <序号>' + (i + 1) + '</序号>';
                    xml = xml + '   <工作内容>' + mxlistArr1[i].fgznr + '</工作内容>';
                    xml = xml + '   <负责人>' + mxlistArr1[i].ffzr + '</负责人>';
                    xml = xml + '    <预计完成日期>' + mxlistArr1[i].fyj_date + '</预计完成日期>';
                    xml = xml + '  </输血器材_异常提报_子表纠正>';
                }
            } else {
                xml = xml + '  <输血器材_异常提报_子表纠正>';
                xml = xml + '     <RelationRowGuid>1</RelationRowGuid>';
                xml = xml + '   <RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + '    <序号>1</序号>';
                xml = xml + '   <工作内容></工作内容>';
                xml = xml + '   <负责人></负责人>';
                xml = xml + '    <预计完成日期></预计完成日期>';
                xml = xml + '  </输血器材_异常提报_子表纠正>';
            }
            if (mxlistArr2.length != 0) {
                for (var i = 0; i < mxlistArr2.length; i++) {
                    xml = xml + '  <输血器材_异常提报_子表预防>';
                    xml = xml + '     <RelationRowGuid>' + mxlistArr1.length + (i + 1) + '</RelationRowGuid>';
                    xml = xml + '   <RowPrimaryKeys>itemid=' + itemidArr2[i] + '</RowPrimaryKeys>';
                    xml = xml + '    <序号>' + (i + 1) + '</序号>';
                    xml = xml + '   <工作内容>' + mxlistArr2[i].fgznr + '</工作内容>';
                    xml = xml + '   <负责人>' + mxlistArr2[i].ffzr + '</负责人>';
                    xml = xml + '    <预计完成日期>' + mxlistArr2[i].fyj_date + '</预计完成日期>';
                    xml = xml + '  </输血器材_异常提报_子表预防>';
                }
            } else {
                xml = xml + '   <输血器材_异常提报_子表预防>';
                xml = xml + '      <RelationRowGuid>' + mxlistArr1.length + 1 + '</RelationRowGuid>';
                xml = xml + '     <RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + '    <序号>1</序号>';
                xml = xml + '    <工作内容></工作内容>';
                xml = xml + '     <负责人></负责人>';
                xml = xml + '     <预计完成日期></预计完成日期>';
                xml = xml + '     </输血器材_异常提报_子表预防>';
            }

            xml = xml + '</FormData>';
            xml = xml + '</XForm>';
            PostXml(xml);
        });
    } else {
        var xml = '<?xml version="1.0"?>';
        xml = xml + '<XForm>';
        xml = xml + '<Header>';
        xml = xml + '<Method>Process</Method>';
        xml = xml + '<PID>' + pid + '</PID>';
        xml = xml + '<Action>' + action + '</Action>';
        xml = xml + '<Comment>' + comment + '</Comment>';

     
        xml = xml + '<InviteIndicateUsers></InviteIndicateUsers>';
        xml = xml + '</Header>';
        xml = xml + '<FormData>';

        xml = xml + '     <输血器材_异常提报_主表>';
        xml = xml + '      <单号>' + fbillno + '</单号>';
        xml = xml + '      <报告人>' + fname + '</报告人>';
        xml = xml + '     <报告日期>' + fdate + '</报告日期>';
        xml = xml + '    <异常部门>' + fdept + '</异常部门>';
        xml = xml + '    <异常名称>' + fycmc + '</异常名称>';
        xml = xml + '      <异常描述>' + fycms + '</异常描述>';
        xml = xml + '     <附件>' + fjArray.join(";") + '</附件>';
        xml = xml + '      <范围及影响>' + ffwyx + '</范围及影响>';
        xml = xml + '      <原因分析>' + fyyfx + '</原因分析>';
        xml = xml + '     </输血器材_异常提报_主表>';

        if (mxlistArr1.length != 0) {
            for (var i = 0; i < mxlistArr1.length; i++) {
                xml = xml + '  <输血器材_异常提报_子表纠正>';
                xml = xml + '     <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml = xml + '   <RowPrimaryKeys>itemid=' + itemidArr1[i] + '</RowPrimaryKeys>';
                xml = xml + '    <序号>' + (i + 1) + '</序号>';
                xml = xml + '   <工作内容>' + mxlistArr1[i].fgznr + '</工作内容>';
                xml = xml + '   <负责人>' + mxlistArr1[i].ffzr + '</负责人>';
                xml = xml + '    <预计完成日期>' + mxlistArr1[i].fyj_date + '</预计完成日期>';
                xml = xml + '  </输血器材_异常提报_子表纠正>';
            }
        } else {
            xml = xml + '  <输血器材_异常提报_子表纠正>';
            xml = xml + '     <RelationRowGuid>1</RelationRowGuid>';
            xml = xml + '   <RowPrimaryKeys></RowPrimaryKeys>';
            xml = xml + '    <序号>1</序号>';
            xml = xml + '   <工作内容></工作内容>';
            xml = xml + '   <负责人></负责人>';
            xml = xml + '    <预计完成日期></预计完成日期>';
            xml = xml + '  </输血器材_异常提报_子表纠正>';
        }
        if (mxlistArr2.length != 0) {
            for (var i = 0; i < mxlistArr2.length; i++) {
                xml = xml + '  <输血器材_异常提报_子表预防>';
                xml = xml + '     <RelationRowGuid>' + mxlistArr1.length + (i + 1) + '</RelationRowGuid>';
                xml = xml + '   <RowPrimaryKeys>itemid=' + itemidArr2[i] + '</RowPrimaryKeys>';
                xml = xml + '    <序号>' + (i + 1) + '</序号>';
                xml = xml + '   <工作内容>' + mxlistArr2[i].fgznr + '</工作内容>';
                xml = xml + '   <负责人>' + mxlistArr2[i].ffzr + '</负责人>';
                xml = xml + '    <预计完成日期>' + mxlistArr2[i].fyj_date + '</预计完成日期>';
                xml = xml + '  </输血器材_异常提报_子表预防>';
            }
        } else {
            xml = xml + '   <输血器材_异常提报_子表预防>';
            xml = xml + '      <RelationRowGuid>' + mxlistArr1.length + 1 + '</RelationRowGuid>';
            xml = xml + '     <RowPrimaryKeys></RowPrimaryKeys>';
            xml = xml + '    <序号>1</序号>';
            xml = xml + '    <工作内容></工作内容>';
            xml = xml + '     <负责人></负责人>';
            xml = xml + '     <预计完成日期></预计完成日期>';
            xml = xml + '     </输血器材_异常提报_子表预防>';
        }

        xml = xml + '</FormData>';
        xml = xml + '</XForm>';
        PostXml(xml);
    }
}