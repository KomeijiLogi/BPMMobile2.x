function prepMsg() {
    $("#fdate").val(getNowFormatDate(2));
    tapEvent();

    var xml = '<?xml version= "1.0" ?>';
    xml = xml + '   <Requests>';
    xml = xml + '   <Params>';
    xml = xml + '       <Method>GetFormPostData</Method>';
    xml = xml + '       <ProcessName>医用材料公司产品核价申请</ProcessName>';
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
        $("#fname").val(item.申请人);
        $("#fno").val(item.申请人编号);
        $("#fdept").val(item.所属区域);
    }).fail(function (e) {

    });
}
function tapEvent() {


    var fsqrlbdata = [

        {
            value: '',
            text:'业务员'
        },
        {
            value: '',
            text:'非业务员'
        }
    ];
    showPicker('fsqrlb', fsqrlbdata);

    var fcplbdata = [
        {
            value: '',
            text: '卫材(103.01)',
           
        },
        {
            value: '',
            text: '包类(103.23)',
            children: [
                {
                    value: '',
                    text: '一次性使用产包'
                },
                {
                    value: '',
                    text: '一次性使用介入手术辅助包'
                },
                {
                    value: '',
                    text: '一次性使用无菌手术包'
                }
            ]
        },
        {
            value: '',
            text: '液基细胞(103.24)',
            
        },
        {
            value: '',
            text: '调节器(103.09)',
           
        }

    ];

    var element = document.getElementById('fcpdl');

    var picker = new mui.PopPicker({
        layer:2
    });

    picker.setData(fcplbdata);

    element.addEventListener('tap', function () {

        picker.show(function (items) {

            element.value = items[0].text;
            $("#fbllb").val(items[1].text);
        });

    }, false);

    var count = 1;
    $('#tjmx').on('tap', function () {
        var fcpdl = $("#fcpdl").val();
        var fbllb = $("#fbllb").val();
        if (!fcpdl) {
            mui.toast('请先选择产品大类');
            return;
        }
        var fbhtext = '';
        switch (fcpdl){
            case '卫材(103.01)':
                fbhtext += '卫材(103.01)';
                break;
            case '包类(103.23)':
                fbhtext += 'BL';
                break;
            case '液基细胞(103.24)':
                fbhtext += '液基细胞(103.24)';
                break;
            case '调节器(103.09)':
                fbhtext += '调节器(103.09)';
                break;
            default:
                break;
        }

        switch (fbllb) {
            case '一次性使用产包':
                fbhtext += 'CB';
                break;
            case '一次性使用介入手术辅助包':
                fbhtext += 'FB';
                break;
            case '一次性使用无菌手术包':
                fbhtext += 'WB';
                break;
            default:
                break;
        }
        var count_str = ('000' + count).split(-4); //将数字前置3个0,对后四位取值
       
        console.log(fbhtext + count_str);
        count++;
        var li = '<div id="mx" class="mui-card">';
        li = li + '   <div class="mui-input-row itemtitle">';
        li = li + '      <label>明细列表项</label>';
        li = li + '      <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '      <label for="fkhmc">客户名称<i style="color:red;">*</i></label>';
        li = li + '      <input type="text" id="fkhmc" name="fkhmc" placeholder="请填写客户名称"/>';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '       <label for="fcpmc">产品名称<i style="color:red;">*</i></label>';
        li = li + '       <input type="text" id="fcpmc" name="fcpmc" placeholder="请填写产品名称"/>';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '       <label for="fhjbh">核价编号</label>';
        li = li + '       <input type="text" id="fhjbh" name="fhjbh" readonly="readonly" value="' + (fbhtext + count_str)+'"/>';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '       <label for="fhsbj">核算报价(元)<i style="color:red;">*</i></label>';
        li = li + '       <input type="number" id="fhsbj" name="fhsbj" readonly="readonly" value="0"/>';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '       <label for="fzzbj">最终报价(元)<i style="color:red;">*</i></label>';
        li = li + '       <input type="number" id="fzzbj" name="fzzbj" readonly="readonly" value="0"/>';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '       <label for="fbz">备注</label>';
        li = li + '       <input type="text" id="fbz" name="fbz" placeholder="请填写备注"/>';
        li = li + '   </div>';
        li = li + '</div>';
        $("#mxlist").append(li);
    });
}
function mxItem(fkhmc, fcpmc, fhjbh, fhsbj, fzzbj, fbz) {
    var mx = Object.create({

        fkhmc: fkhmc,
        fcpmc: fcpmc,
        fhjbh: fhjbh,
        fhsbj: fhsbj,
        fzzbj: fzzbj,
        fbz: fbz,
        _check: function () {
            if (!fkhmc) {
                mui.toast('请填写客户名称');
                return null;
            }
            if (!fcpmc) {
                mui.toast('请填写产品名称');
                return null;
            }
           
            return mx;
        }
    });
    return mx._check();
}

var fjArray1 = new Array();
var fjArray2 = new Array();
var fjArray3 = new Array();
function initData(data, flag) {
    var item = data.FormDataSet.医用材料公司_核价申请_主表[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.单号);
    }
    $("#fname").val(item.申请人);
    $("#fno").val(item.申请人编号);
    $("#fdept").val(item.所属区域);
    $("#fdate").val(FormatterTimeYMS(item.申请日期));
    $("#ftel").val(item.联系方式);
    $("#fsqrlb").val(item.申请人类别);
    $("#fcpdl").val(item.产品大类);
    $("#fbllb").val(item.包类类别);
    $("#fsqsm").val(item.申请说明);

    var attachArray1 = new Array();
    var attachArray2 = new Array();
    var attachArray3 = new Array();
    if (item.技术部附件 != null && item.技术部附件 != "") {
        var fjtmp = (String)(item.技术部附件);

        fjArray1 = fjtmp.split(";");


        //console.log("fjArray:" + fjArray);

        //请求附件详细信息
        $.ajax({
            type: 'POST',
            url: '/api/bpm/GetAttachmentsInfo',
            //dataType:'json',
            data: { 'fileIds': fjArray1 },

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
                        attachArray1.push(attach);



                        var li = '<div class="pic-preview smallyulan success">';
                        li = li + ' <div class="del none" style="opacity:1;z-index:999;"onclick="delPicture(this)">x</div>';

                        //类型判断
                        if ((data[i].Ext).indexOf("png") != -1 || (data[i].Ext).indexOf("jpg") != -1 || (data[i].Ext).indexOf("bmp") != -1) {

                            //li = li + '    <div class="img-wrap smallimg" id="simg" ><a href="http://app.weigaogroup.com:8040/BPM/YZSoft/Attachment/default.ashx?' + data[i].FileID + '"><img src="http://app.weigaogroup.com:8040/BPM/YZSoft/Attachment/default.ashx?' + data[i].FileID + '"/></a></div>';
                            li = li + '    <div class="img-wrap smallimg imgdiv1" id="' + i + '" ><img src="http://app.weigaogroup.com:8040/BPM/YZSoft/Attachment/default.ashx?' + data[i].FileID + '"/></div>';

                        } else if ((data[i].Ext).indexOf("xls") != -1) {

                            li = li + '    <div class="img-wrap smallimg imgdiv1" id="' + i + '"><img src="../../../../Content/images/xlsx@2x.png"/></div>';

                        } else if ((data[i].Ext).indexOf("doc") != -1) {

                            li = li + '    <div class="img-wrap smallimg imgdiv1" id="' + i + '"><img src="../../../../Content/images/docx@2x.png"/></div>';

                        } else if ((data[i].Ext).indexOf("ppt") != -1) {

                            li = li + '    <div class="img-wrap smallimg imgdiv1" id="' + i + '"><img src="../../../../Content/images/ppt@2x.png"/></div>';

                        } else if ((data[i].Ext).indexOf("pdf") != -1) {

                            li = li + '    <div class="img-wrap smallimg imgdiv1" id="' + i + '"><img src="../../../../Content/images/pdf@2x.png"/></div>';

                        } else if ((data[i].Ext).indexOf("zip") != -1 || (data[i].Ext).indexOf("rar") != -1 || (data[i].Ext).indexOf("7z") != -1) {

                            li = li + '    <div class="img-wrap smallimg imgdiv1" id="' + i + '"><img src="../../../../Content/images/zip@2x.png"/></div>';

                        } else if ((data[i].Ext).indexOf("txt") != -1) {

                            li = li + '    <div class="img-wrap smallimg imgdiv1" id="' + i + '"><img src="../../Content/images/txt@2x.png"/></div>';

                        } else {
                            li = li + '    <div class="img-wrap smallimg imgdiv1" id="' + i + '"><img src="../../Content/images/unkown@2x.png"/></div>';
                        }

                        li = li + ' </div>';
                        li = li + '</div>';
                        $(".upload-img-list-jsb").append(li);


                        $(".imgdiv1").each(function () {

                            $(this).parent().find(".del.none").hide();

                        });

                        watch();


                    }

                    $(".imgdiv1").on('tap', function () {
                        console.log($(this)[0].id);
                        XuntongJSBridge.call('showFile', {
                            'fileName': attachArray1[$(this)[0].id].name,
                            'fileExt': attachArray1[$(this)[0].id].type,
                            'fileTime': attachArray1[$(this)[0].id].time,
                            'fileSize': attachArray1[$(this)[0].id].size,
                            'fileDownloadUrl': attachArray1[$(this)[0].id].downurl
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
    if (item.制造部附件 != null && item.制造部附件 != "") {
        var fjtmp = (String)(item.制造部附件);

        fjArray2 = fjtmp.split(";");


        //console.log("fjArray:" + fjArray);

        //请求附件详细信息
        $.ajax({
            type: 'POST',
            url: '/api/bpm/GetAttachmentsInfo',
            //dataType:'json',
            data: { 'fileIds': fjArray2 },

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
                        attachArray2.push(attach);



                        var li = '<div class="pic-preview smallyulan success">';
                        li = li + ' <div class="del none" style="opacity:1;z-index:999;"onclick="delPicture(this)">x</div>';

                        //类型判断
                        if ((data[i].Ext).indexOf("png") != -1 || (data[i].Ext).indexOf("jpg") != -1 || (data[i].Ext).indexOf("bmp") != -1) {

                            //li = li + '    <div class="img-wrap smallimg" id="simg" ><a href="http://app.weigaogroup.com:8040/BPM/YZSoft/Attachment/default.ashx?' + data[i].FileID + '"><img src="http://app.weigaogroup.com:8040/BPM/YZSoft/Attachment/default.ashx?' + data[i].FileID + '"/></a></div>';
                            li = li + '    <div class="img-wrap smallimg imgdiv2" id="' + i + '" ><img src="http://app.weigaogroup.com:8040/BPM/YZSoft/Attachment/default.ashx?' + data[i].FileID + '"/></div>';

                        } else if ((data[i].Ext).indexOf("xls") != -1) {

                            li = li + '    <div class="img-wrap smallimg imgdiv2" id="' + i + '"><img src="../../../../Content/images/xlsx@2x.png"/></div>';

                        } else if ((data[i].Ext).indexOf("doc") != -1) {

                            li = li + '    <div class="img-wrap smallimg imgdiv2" id="' + i + '"><img src="../../../../Content/images/docx@2x.png"/></div>';

                        } else if ((data[i].Ext).indexOf("ppt") != -1) {

                            li = li + '    <div class="img-wrap smallimg imgdiv2" id="' + i + '"><img src="../../../../Content/images/ppt@2x.png"/></div>';

                        } else if ((data[i].Ext).indexOf("pdf") != -1) {

                            li = li + '    <div class="img-wrap smallimg imgdiv2" id="' + i + '"><img src="../../../../Content/images/pdf@2x.png"/></div>';

                        } else if ((data[i].Ext).indexOf("zip") != -1 || (data[i].Ext).indexOf("rar") != -1 || (data[i].Ext).indexOf("7z") != -1) {

                            li = li + '    <div class="img-wrap smallimg imgdiv2" id="' + i + '"><img src="../../../../Content/images/zip@2x.png"/></div>';

                        } else if ((data[i].Ext).indexOf("txt") != -1) {

                            li = li + '    <div class="img-wrap smallimg imgdiv2" id="' + i + '"><img src="../../Content/images/txt@2x.png"/></div>';

                        } else {
                            li = li + '    <div class="img-wrap smallimg imgdiv2" id="' + i + '"><img src="../../Content/images/unkown@2x.png"/></div>';
                        }

                        li = li + ' </div>';
                        li = li + '</div>';
                        $(".upload-img-list-zzb").append(li);


                        $(".imgdiv2").each(function () {

                            $(this).parent().find(".del.none").hide();

                        });

                        watch();


                    }

                    $(".imgdiv2").on('tap', function () {
                        console.log($(this)[0].id);
                        XuntongJSBridge.call('showFile', {
                            'fileName': attachArray2[$(this)[0].id].name,
                            'fileExt': attachArray2[$(this)[0].id].type,
                            'fileTime': attachArray2[$(this)[0].id].time,
                            'fileSize': attachArray2[$(this)[0].id].size,
                            'fileDownloadUrl': attachArray2[$(this)[0].id].downurl
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
    if (item.财务部附件 != null && item.财务部附件 != "") {
        var fjtmp = (String)(item.技术部附件);

        fjArray3 = fjtmp.split(";");


        //console.log("fjArray:" + fjArray);

        //请求附件详细信息
        $.ajax({
            type: 'POST',
            url: '/api/bpm/GetAttachmentsInfo',
            //dataType:'json',
            data: { 'fileIds': fjArray3 },

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
                        attachArray3.push(attach);



                        var li = '<div class="pic-preview smallyulan success">';
                        li = li + ' <div class="del none" style="opacity:1;z-index:999;"onclick="delPicture(this)">x</div>';

                        //类型判断
                        if ((data[i].Ext).indexOf("png") != -1 || (data[i].Ext).indexOf("jpg") != -1 || (data[i].Ext).indexOf("bmp") != -1) {

                            //li = li + '    <div class="img-wrap smallimg" id="simg" ><a href="http://app.weigaogroup.com:8040/BPM/YZSoft/Attachment/default.ashx?' + data[i].FileID + '"><img src="http://app.weigaogroup.com:8040/BPM/YZSoft/Attachment/default.ashx?' + data[i].FileID + '"/></a></div>';
                            li = li + '    <div class="img-wrap smallimg imgdiv3" id="' + i + '" ><img src="http://app.weigaogroup.com:8040/BPM/YZSoft/Attachment/default.ashx?' + data[i].FileID + '"/></div>';

                        } else if ((data[i].Ext).indexOf("xls") != -1) {

                            li = li + '    <div class="img-wrap smallimg imgdiv3" id="' + i + '"><img src="../../../../Content/images/xlsx@2x.png"/></div>';

                        } else if ((data[i].Ext).indexOf("doc") != -1) {

                            li = li + '    <div class="img-wrap smallimg imgdiv3" id="' + i + '"><img src="../../../../Content/images/docx@2x.png"/></div>';

                        } else if ((data[i].Ext).indexOf("ppt") != -1) {

                            li = li + '    <div class="img-wrap smallimg imgdiv3" id="' + i + '"><img src="../../../../Content/images/ppt@2x.png"/></div>';

                        } else if ((data[i].Ext).indexOf("pdf") != -1) {

                            li = li + '    <div class="img-wrap smallimg imgdiv3" id="' + i + '"><img src="../../../../Content/images/pdf@2x.png"/></div>';

                        } else if ((data[i].Ext).indexOf("zip") != -1 || (data[i].Ext).indexOf("rar") != -1 || (data[i].Ext).indexOf("7z") != -1) {

                            li = li + '    <div class="img-wrap smallimg imgdiv3" id="' + i + '"><img src="../../../../Content/images/zip@2x.png"/></div>';

                        } else if ((data[i].Ext).indexOf("txt") != -1) {

                            li = li + '    <div class="img-wrap smallimg imgdiv3" id="' + i + '"><img src="../../Content/images/txt@2x.png"/></div>';

                        } else {
                            li = li + '    <div class="img-wrap smallimg imgdiv3" id="' + i + '"><img src="../../Content/images/unkown@2x.png"/></div>';
                        }

                        li = li + ' </div>';
                        li = li + '</div>';
                        $(".upload-img-list-cwb").append(li);


                        $(".imgdiv3").each(function () {

                            $(this).parent().find(".del.none").hide();

                        });

                        watch();


                    }

                    $(".imgdiv3").on('tap', function () {
                        console.log($(this)[0].id);
                        XuntongJSBridge.call('showFile', {
                            'fileName': attachArray3[$(this)[0].id].name,
                            'fileExt': attachArray3[$(this)[0].id].type,
                            'fileTime': attachArray3[$(this)[0].id].time,
                            'fileSize': attachArray3[$(this)[0].id].size,
                            'fileDownloadUrl': attachArray3[$(this)[0].id].downurl
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

    var item_c = data.FormDataSet.医用材料公司_核价申请_子表;
    for (var i = 0; i < item_c.length; i++){
        itemidArr.push(item_c[i].itemid);
        var li = '<div id="mx" class="mui-card">';
        li = li + '   <div class="mui-input-row itemtitle">';
        li = li + '      <label>明细列表项</label>';
        li = li + '      <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '      <label for="fkhmc">客户名称<i style="color:red;">*</i></label>';
        li = li + '      <input type="text" id="fkhmc" name="fkhmc" readonly="readonly" value="' + item_c[i].客户名称 + '"/>';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '       <label for="fcpmc">产品名称<i style="color:red;">*</i></label>';
        li = li + '       <input type="text" id="fcpmc" name="fcpmc" readonly="readonly" value="' + item_c[i].产品名称 + '"/>';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '       <label for="fhjbh">核价编号</label>';
        li = li + '       <input type="text" id="fhjbh" name="fhjbh" readonly="readonly" value="' + item_c[i].核价编号 + '"/>';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '       <label for="fhsbj">核算报价(元)<i style="color:red;">*</i></label>';
        li = li + '       <input type="number" id="fhsbj" name="fhsbj" readonly="readonly"  value="' + item_c[i].核算报价 + '"/>';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '       <label for="fzzbj">最终报价(元)<i style="color:red;">*</i></label>';
        li = li + '       <input type="number" id="fzzbj" name="fzzbj" readonly="readonly" value="' + item_c[i].最终报价 + '"/>';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '       <label for="fbz">备注</label>';
        li = li + '       <input type="text" id="fbz" name="fbz" readonly="readonly" value="' + changeNullToEmpty( item_c[i].备注) + '"/>';
        li = li + '   </div>';
        li = li + '</div>';
        $("#mxlist").append(li);
    }
}
action = '同意';
function nodeControllerExp(NodeName) {
    if (NodeName == '开始') {
        tapEvent();
        $("#mxlist").find('span').each(function () {
            $(this).show();
        });
        $('#tjmx').show();
        $("#mxlist").find("#fkhmc,#fcpmc,#fbz").each(function () {
            $(this).removeAttr('readonly');
        });
        $("#ftel,#fsqsm").removeAttr('readonly');
    } else if (NodeName == "sysInform") {

    } else {
        if (typeof (NodeName) != "undefined") {
            if (String(NodeName).indexOf('技术部') != -1) {
                //确认，附件
                $("#uploaddiv_jsb").find(".upload-addbtn").show();
                $("#uploaddiv_jsb").find(".upload-img-list-jsb").addClass('upload-img-list');
                $("#uploaddiv_jsb").attr('id', 'uploaddiv');
                upload();
                action = '确认';
                $("#agreebt").text(action);
            } else if (String(NodeName).indexOf('制造部') != -1) {
                 //确认，附件
                $("#uploaddiv_zzb").find(".upload-addbtn").show();
                $("#uploaddiv_zzb").find(".upload-img-list-zzb").addClass('upload-img-list');
                $("#uploaddiv_zzb").attr('id', 'uploaddiv');
                upload();
                action = '确认';
                $("#agreebt").text(action);
            } else if (String(NodeName).indexOf('财务部') != -1) {
                //核算报价可编辑,确认，附件
                $("#mxlist").find("#fhsbj").each(function () {
                    $(this).removeAttr('readonly');
                });
                $("#uploaddiv_cwb").find(".upload-addbtn").show();
                $("#uploaddiv_cwb").find(".upload-img-list-cwb").addClass('upload-img-list');
                $("#uploaddiv_cwb").attr('id', 'uploaddiv');
                upload();
                action = '确认';
                $("#agreebt").text(action);
            } else if (String(NodeName).indexOf('总经理') != -1) {
                //最终报价可编辑
                $("#mxlist").find("#fzzbj").each(function () {
                    $(this).removeAttr('readonly');
                });
            } else if (String(NodeName).indexOf('确认') != -1) {
                //确认
                action = '确认';
                $("#agreebt").text(action);
            }
        }
    }
}

function Save() {
    var fname = $("#fname").val();
    var fno = $("#fno").val();
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();
    var ftel = $("#ftel").val();
    var fsqrlb = $("#fsqrlb").val();
    var fcpdl = $("#fcpdl").val();
    var fbllb = $("#fbllb").val();
    var fsqsm = $("#fsqsm").val();
    if (!ftel) {
        mui.toast('请填写联系方式');
        return;
    }
    if (!fsqrlb) {
        mui.toast('请选择申请人类别');
        return;
    }
    if (!fcpdl) {
        mui.toast('请选择产品大类');
        return;
    }
    var mxflag = false;
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fkhmc = $(this).find("#fkhmc").val();
        var fcpmc = $(this).find("#fcpmc").val();
        var fhjbh = $(this).find("#fhjbh").val();
        var fhsbj = $(this).find("#fhsbj").val();
        var fzzbj = $(this).find("#fzzbj").val();
        var fbz = $(this).find("#fbz").val();
        if (mxItem(fkhmc, fcpmc, fhjbh, fhsbj, fzzbj, fbz) == null) {
            mxflag = true;
            return;
        }
        var mx = mxItem(fkhmc, fcpmc, fhjbh, fhsbj, fzzbj, fbz);
        mxlistArr.push(mx);
    });
    if (mxflag) {
        return;
    }
    var btnArry = ["取消", "确定"];
    mui.confirm('即将提交，是否确定？', '提交确认提醒', btnArry, function(e) {
        if (e.index == 1) {
            var xml = '<?xml version= "1.0" ?>';
            xml = xml + '   <XForm>';
            xml = xml + '         <Header>';
            xml = xml + '        <Method>Post</Method>';
            xml = xml + '       <ProcessName>医用材料公司产品核价申请</ProcessName>';
            xml = xml + '         <ProcessVersion>' + version + '</ProcessVersion>';
            xml = xml + '            <DraftGuid></DraftGuid>';
            xml = xml + '             <OwnerMemberFullName>' + BPMOU + '</OwnerMemberFullName>';
            xml = xml + '            <Action>提交</Action>';
            xml = xml + '          <Comment></Comment>';
            xml = xml + '             <InviteIndicateUsers></InviteIndicateUsers>';
            xml = xml + '       </Header>';
            xml = xml + '       <FormData>';

            xml = xml + '    <医用材料公司_核价申请_主表>';
            xml = xml + '   <单号>自动生成</单号>';
            xml = xml + '  <申请人编号>' + fno + '</申请人编号>';
            xml = xml + '  <申请人>' + fname + '</申请人>';
            xml = xml + '  <所属区域>' + fdept + '</所属区域>';
            xml = xml + '  <申请日期>' + fdate + '</申请日期>';
            xml = xml + '  <联系方式>' + ftel + '</联系方式>';
            xml = xml + ' <申请人类别>' + fsqrlb + '</申请人类别>';
            xml = xml + '  <产品大类>' + fcpdl + '</产品大类>';
            xml = xml + '  <包类类别>' + fbllb + '</包类类别>';
            xml = xml + '  <申请说明>' + fsqsm + '</申请说明>';
            xml = xml + '    <技术部附件>' + fjArray1.join(";") + '</技术部附件>';
            xml = xml + '     <制造部附件>' + fjArray2.join(";") + '</制造部附件>';
            xml = xml + '    <财务部附件>' + fjArray3.join(";") + '</财务部附件>';
            xml = xml + '  </医用材料公司_核价申请_主表>';

            for (var i = 0; i < mxlistArr.length;i++){
                xml = xml + '  <医用材料公司_核价申请_子表>';
                xml = xml + '   <RelationRowGuid>'+(i+1)+'</RelationRowGuid>';
                xml = xml + '   <RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + '  <序号>' + (i + 1) + '</序号>';
                xml = xml + '  <客户名称>' + mxlistArr[i].fkhmc + '</客户名称>';
                xml = xml + '  <产品名称>' + mxlistArr[i].fcpmc + '</产品名称>';
                xml = xml + ' <核价编号>' + mxlistArr[i].fhjbh + '</核价编号>';
                xml = xml + '   <核算报价>' + mxlistArr[i].fhsbj + '</核算报价>';
                xml = xml + '  <最终报价>' + mxlistArr[i].fzzbj + '</最终报价>';
                xml = xml + '   <备注>' + mxlistArr[i].fbz + '</备注>';
                xml = xml + ' </医用材料公司_核价申请_子表>';
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
    var fno = $("#fno").val();
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();
    var ftel = $("#ftel").val();
    var fsqrlb = $("#fsqrlb").val();
    var fcpdl = $("#fcpdl").val();
    var fbllb = $("#fbllb").val();
    var fsqsm = $("#fsqsm").val();
    if (!ftel) {
        mui.toast('请填写联系方式');
        return;
    }
    if (!fsqrlb) {
        mui.toast('请选择申请人类别');
        return;
    }
    if (!fcpdl) {
        mui.toast('请选择产品大类');
        return;
    }
    var mxflag = false;
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function() {
        var fkhmc = $(this).find("#fkhmc").val();
        var fcpmc = $(this).find("#fcpmc").val();
        var fhjbh = $(this).find("#fhjbh").val();
        var fhsbj = $(this).find("#fhsbj").val();
        var fzzbj = $(this).find("#fzzbj").val();
        var fbz = $(this).find("#fbz").val();
        if (mxItem(fkhmc, fcpmc, fhjbh, fhsbj, fzzbj, fbz) == null) {
            mxflag = true;
            return;
        }
        var mx = mxItem(fkhmc, fcpmc, fhjbh, fhsbj, fzzbj, fbz);
        mxlistArr.push(mx);
    });
    if (mxflag) {
        return;
    }
    var btnArry = ["取消", "确定"];
    mui.confirm('即将提交，是否确定？', '提交确认提醒', btnArry, function(e) {
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

            xml = xml + '    <医用材料公司_核价申请_主表>';
            xml = xml + '   <单号>' + fbillno + '</单号>';
            xml = xml + '  <申请人编号>' + fno + '</申请人编号>';
            xml = xml + '  <申请人>' + fname + '</申请人>';
            xml = xml + '  <所属区域>' + fdept + '</所属区域>';
            xml = xml + '  <申请日期>' + fdate + '</申请日期>';
            xml = xml + '  <联系方式>' + ftel + '</联系方式>';
            xml = xml + ' <申请人类别>' + fsqrlb + '</申请人类别>';
            xml = xml + '  <产品大类>' + fcpdl + '</产品大类>';
            xml = xml + '  <包类类别>' + fbllb + '</包类类别>';
            xml = xml + '  <申请说明>' + fsqsm + '</申请说明>';
            xml = xml + '    <技术部附件>' + fjArray1.join(";") + '</技术部附件>';
            xml = xml + '     <制造部附件>' + fjArray2.join(";") + '</制造部附件>';
            xml = xml + '    <财务部附件>' + fjArray3.join(";") + '</财务部附件>';
            xml = xml + '  </医用材料公司_核价申请_主表>';

            for (var i = 0; i < mxlistArr.length; i++) {
                xml = xml + '  <医用材料公司_核价申请_子表>';
                xml = xml + '   <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml = xml + '   <RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + '  <序号>' + (i + 1) + '</序号>';
                xml = xml + '  <客户名称>' + mxlistArr[i].fkhmc + '</客户名称>';
                xml = xml + '  <产品名称>' + mxlistArr[i].fcpmc + '</产品名称>';
                xml = xml + ' <核价编号>' + mxlistArr[i].fhjbh + '</核价编号>';
                xml = xml + '   <核算报价>' + mxlistArr[i].fhsbj + '</核算报价>';
                xml = xml + '  <最终报价>' + mxlistArr[i].fzzbj + '</最终报价>';
                xml = xml + '   <备注>' + mxlistArr[i].fbz + '</备注>';
                xml = xml + ' </医用材料公司_核价申请_子表>';
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
    var fno = $("#fno").val();
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();
    var ftel = $("#ftel").val();
    var fsqrlb = $("#fsqrlb").val();
    var fcpdl = $("#fcpdl").val();
    var fbllb = $("#fbllb").val();
    var fsqsm = $("#fsqsm").val();
    var mxflag = false;
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function() {
        var fkhmc = $(this).find("#fkhmc").val();
        var fcpmc = $(this).find("#fcpmc").val();
        var fhjbh = $(this).find("#fhjbh").val();
        var fhsbj = $(this).find("#fhsbj").val();
        var fzzbj = $(this).find("#fzzbj").val();
        var fbz = $(this).find("#fbz").val();
       
        var mx = mxItem(fkhmc, fcpmc, fhjbh, fhsbj, fzzbj, fbz);
        mxlistArr.push(mx);
    });
    var comment = '';
    var btnArray = ['取消', '确定'];
    mui.prompt('请选填知会意见', '可以不填', '知会意见', btnArray, function(e) {
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

            xml = xml + '    <医用材料公司_核价申请_主表>';
            xml = xml + '   <单号>' + fbillno + '</单号>';
            xml = xml + '  <申请人编号>' + fno + '</申请人编号>';
            xml = xml + '  <申请人>' + fname + '</申请人>';
            xml = xml + '  <所属区域>' + fdept + '</所属区域>';
            xml = xml + '  <申请日期>' + fdate + '</申请日期>';
            xml = xml + '  <联系方式>' + ftel + '</联系方式>';
            xml = xml + ' <申请人类别>' + fsqrlb + '</申请人类别>';
            xml = xml + '  <产品大类>' + fcpdl + '</产品大类>';
            xml = xml + '  <包类类别>' + fbllb + '</包类类别>';
            xml = xml + '  <申请说明>' + fsqsm + '</申请说明>';
            xml = xml + '    <技术部附件>' + fjArray1.join(";") + '</技术部附件>';
            xml = xml + '     <制造部附件>' + fjArray2.join(";") + '</制造部附件>';
            xml = xml + '    <财务部附件>' + fjArray3.join(";") + '</财务部附件>';
            xml = xml + '  </医用材料公司_核价申请_主表>';

            for (var i = 0; i < mxlistArr.length; i++) {
                xml = xml + '  <医用材料公司_核价申请_子表>';
                xml = xml + '   <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml = xml + '   <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
                xml = xml + '  <序号>' + (i + 1) + '</序号>';
                xml = xml + '  <客户名称>' + mxlistArr[i].fkhmc + '</客户名称>';
                xml = xml + '  <产品名称>' + mxlistArr[i].fcpmc + '</产品名称>';
                xml = xml + ' <核价编号>' + mxlistArr[i].fhjbh + '</核价编号>';
                xml = xml + '   <核算报价>' + mxlistArr[i].fhsbj + '</核算报价>';
                xml = xml + '  <最终报价>' + mxlistArr[i].fzzbj + '</最终报价>';
                xml = xml + '   <备注>' + mxlistArr[i].fbz + '</备注>';
                xml = xml + ' </医用材料公司_核价申请_子表>';
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
    var fno = $("#fno").val();
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();
    var ftel = $("#ftel").val();
    var fsqrlb = $("#fsqrlb").val();
    var fcpdl = $("#fcpdl").val();
    var fbllb = $("#fbllb").val();
    var fsqsm = $("#fsqsm").val();


    var mxflag = false;
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function() {
        var fkhmc = $(this).find("#fkhmc").val();
        var fcpmc = $(this).find("#fcpmc").val();
        var fhjbh = $(this).find("#fhjbh").val();
        var fhsbj = $(this).find("#fhsbj").val();
        var fzzbj = $(this).find("#fzzbj").val();
        var fbz = $(this).find("#fbz").val();

        var mx = mxItem(fkhmc, fcpmc, fhjbh, fhsbj, fzzbj, fbz);
        mxlistArr.push(mx);
    });

    if (String(nodeName).indexOf('技术部')!=-1) {
        if (fjArray1.length == 0) {
            mui.toast('请上传附件');
            return;
        }
    }
    if (String(nodeName).indexOf('制造部')!=-1) {
        if (fjArray2.length == 0) {
            mui.toast('请上传附件');
            return;
        }
    }
    if (String(nodeName).indexOf('财务部')!=-1) {
        if (fjArray3.length == 0) {
            mui.toast('请上传附件');
            return;
        }
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
            beforeSend: function(XHR) {
                XHR.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem('ticket'));

            }
        }).done(function(data, status) {
            //alert(status);
            if (status == "success") {


                for (var i = 0; i < data.data.length; i++) {
                    consignUserId.push(data.data[i].phone);
                }
                $('#consignUser').val(consignUserId);
                consignUserStr = (String)($('#consignUser').val()).replace(",", ";");



            }
        }).fail(function() {

        });
    } else {


    }
    if (consignFlag) {
        consignAjax.then(function() {
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

            xml = xml + '    <医用材料公司_核价申请_主表>';
            xml = xml + '   <单号>' + fbillno + '</单号>';
            xml = xml + '  <申请人编号>' + fno + '</申请人编号>';
            xml = xml + '  <申请人>' + fname + '</申请人>';
            xml = xml + '  <所属区域>' + fdept + '</所属区域>';
            xml = xml + '  <申请日期>' + fdate + '</申请日期>';
            xml = xml + '  <联系方式>' + ftel + '</联系方式>';
            xml = xml + ' <申请人类别>' + fsqrlb + '</申请人类别>';
            xml = xml + '  <产品大类>' + fcpdl + '</产品大类>';
            xml = xml + '  <包类类别>' + fbllb + '</包类类别>';
            xml = xml + '  <申请说明>' + fsqsm + '</申请说明>';
            xml = xml + '    <技术部附件>' + fjArray1.join(";") + '</技术部附件>';
            xml = xml + '     <制造部附件>' + fjArray2.join(";") + '</制造部附件>';
            xml = xml + '    <财务部附件>' + fjArray3.join(";") + '</财务部附件>';
            xml = xml + '  </医用材料公司_核价申请_主表>';

            for (var i = 0; i < mxlistArr.length; i++) {
                xml = xml + '  <医用材料公司_核价申请_子表>';
                xml = xml + '   <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml = xml + '   <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
                xml = xml + '  <序号>' + (i + 1) + '</序号>';
                xml = xml + '  <客户名称>' + mxlistArr[i].fkhmc + '</客户名称>';
                xml = xml + '  <产品名称>' + mxlistArr[i].fcpmc + '</产品名称>';
                xml = xml + ' <核价编号>' + mxlistArr[i].fhjbh + '</核价编号>';
                xml = xml + '   <核算报价>' + mxlistArr[i].fhsbj + '</核算报价>';
                xml = xml + '  <最终报价>' + mxlistArr[i].fzzbj + '</最终报价>';
                xml = xml + '   <备注>' + mxlistArr[i].fbz + '</备注>';
                xml = xml + ' </医用材料公司_核价申请_子表>';
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
        xml = xml + '<Action>' + action + '</Action>';
        xml = xml + '<Comment>' + comment + '</Comment>';

      

        xml = xml + '<InviteIndicateUsers></InviteIndicateUsers>';
        xml = xml + '</Header>';
        xml = xml + '<FormData>';

        xml = xml + '    <医用材料公司_核价申请_主表>';
        xml = xml + '   <单号>' + fbillno + '</单号>';
        xml = xml + '  <申请人编号>' + fno + '</申请人编号>';
        xml = xml + '  <申请人>' + fname + '</申请人>';
        xml = xml + '  <所属区域>' + fdept + '</所属区域>';
        xml = xml + '  <申请日期>' + fdate + '</申请日期>';
        xml = xml + '  <联系方式>' + ftel + '</联系方式>';
        xml = xml + ' <申请人类别>' + fsqrlb + '</申请人类别>';
        xml = xml + '  <产品大类>' + fcpdl + '</产品大类>';
        xml = xml + '  <包类类别>' + fbllb + '</包类类别>';
        xml = xml + '  <申请说明>' + fsqsm + '</申请说明>';
        xml = xml + '    <技术部附件>' + fjArray1.join(";") + '</技术部附件>';
        xml = xml + '     <制造部附件>' + fjArray2.join(";") + '</制造部附件>';
        xml = xml + '    <财务部附件>' + fjArray3.join(";") + '</财务部附件>';
        xml = xml + '  </医用材料公司_核价申请_主表>';

        for (var i = 0; i < mxlistArr.length; i++) {
            xml = xml + '  <医用材料公司_核价申请_子表>';
            xml = xml + '   <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
            xml = xml + '   <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
            xml = xml + '  <序号>' + (i + 1) + '</序号>';
            xml = xml + '  <客户名称>' + mxlistArr[i].fkhmc + '</客户名称>';
            xml = xml + '  <产品名称>' + mxlistArr[i].fcpmc + '</产品名称>';
            xml = xml + ' <核价编号>' + mxlistArr[i].fhjbh + '</核价编号>';
            xml = xml + '   <核算报价>' + mxlistArr[i].fhsbj + '</核算报价>';
            xml = xml + '  <最终报价>' + mxlistArr[i].fzzbj + '</最终报价>';
            xml = xml + '   <备注>' + mxlistArr[i].fbz + '</备注>';
            xml = xml + ' </医用材料公司_核价申请_子表>';
        }

        xml = xml + '</FormData>';
        xml = xml + '</XForm>';
        PostXml(xml);
    }
}