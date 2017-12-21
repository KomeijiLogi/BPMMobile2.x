function prepMsg() {
    tapEvent();
    upload();
    var xml = '<?xml version= "1.0" ?>';
    xml = xml + '   <Requests>';
    xml = xml + '   <Params>';
    xml = xml + '       <Method>GetFormPostData</Method>';
    xml = xml + '       <ProcessName>洁瑞公司学术交流申请</ProcessName>';
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
        $("#fname").val(item.ywyxm);

    }).fail(function (e) {

    });
}

function tapEvent() {

    var fdqdata = [
        {
            value: '',
            text:'东北区'
        },
        {
            value: '',
            text:'东南区'
        },
        {
            value: '',
            text:'河南区'
        },
        {
            value: '',
            text:'中南区'
        },
        {
            value: '',
            text:'华北区'
        },
        {
            value: '',
            text:'华南区'
        },
        {
            value: '',
            text:'华中区'
        },
        {
            value: '',
            text:'京津区'
        },
        {
            value: '',
            text:'山东区'
        },
        {
            value: '',
            text:'西南区'
        },
        {
            value: '',
            text:'新疆区'
        },
        {
            value: '',
            text:'浙北区'
        },
        {
            value: '',
            text:'浙南区'
        }

    ];

    showPicker('fdq', fdqdata);


    mui('#fif_lfd').each(function () {

        this.addEventListener('toggle', function (event) {
            if (event.detail.isActive == 'true' || event.detail.isActive == true) {
                $("#fif_lf").val('是');   
            } else {
                $("#fif_lf").val('否'); 
            }

        });
    });

    mui('#fif_xjzd').each(function () {

        this.addEventListener('toggle', function (event) {
            if (event.detail.isActive == 'true' || event.detail.isActive == true) {
                $("#fif_xjz").val('是');
            } else {
                $("#fif_xjz").val('否');
            }

        });
    });

    mui('#fif_apcld').each(function () {

        this.addEventListener('toggle', function (event) {
            if (event.detail.isActive == 'true' || event.detail.isActive == true) {
                $("#fif_apcl").val('是');
            } else {
                $("#fif_apcl").val('否');
            }
        });
    });

    mui('#fif_xszd').each(function () {

        this.addEventListener('toggle', function (event) {
            if (event.detail.isActive == 'true' || event.detail.isActive == true) {
                $("#fif_xsz").val('是');
            } else {
                $("#fif_xsz").val('否');
            }
        });
    });
    $("#tjmx_xc").on('tap', function () {
        var li = '<div id="mx" class="mui-card">';
        li = li + '  <div class="mui-input-row itemtitle">';
        li = li + '    <label>明细列表项</label>';
        li = li + ' <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>';
        li = li + '</div>';
        li = li + '<div class="mui-input-row">';
        li = li + '    <label for="fsj">时间</label>';
        li = li + '<input type="date" id="fsj" name="fsj" />';
        li = li + '</div>';
        li = li + ' <div class="mui-input-row itemtitle2">';
        li = li + '   <label>活动行程</label>';
        li = li + ' </div>';
        li = li + ' <div class="mui-input-row">';
        li = li + '  <label for="fjqrs">景区人数</label>';
        li = li + '  <input type="number" id="fjqrs" name="fjqrs" placeholder="请填写景区人数" />';
        li = li + ' </div>';
        li = li + '<div class="mui-input-row">';
        li = li + ' <label for="fmpf">门票费</label>';
        li = li + '  <input type="number" id="fmpf" name="fmpf" placeholder="请填写门票费" />';
        li = li + ' </div>';
        li = li + '<div class="mui-input-row itemtitle2">';
        li = li + ' <label>午餐</label>';
        li = li + ' </div>';
        li = li + '<div class="mui-input-row">';
        li = li + ' <label for="fwcycjdrs">用餐酒店人数</label>';
        li = li + '  <input type="number" id="fwcycjdrs" name="fwcycjdrs" placeholder="请填写用餐酒店人数" />';
        li = li + '  </div>';
        li = li + '<div class="mui-input-row">';
        li = li + '  <label for="fwcbz">午餐标准</label>';
        li = li + '<input type="number" id="fwcbz" name="fwcbz" placeholder="请填写午餐标准" />';
        li = li + ' </div>';
        li = li + '<div class="mui-input-row itemtitle2">';
        li = li + '   <label>晚餐</label>';
        li = li + '  </div>';
        li = li + ' <div class="mui-input-row">';
        li = li + '  <label for="fwfycjdrs">用餐酒店人数</label>';
        li = li + ' <input type="number" id="fwfycjdrs" name="fwfycjdrs" placeholder="请填写用餐酒店人数" />';
        li = li + ' </div>';
        li = li + ' <div class="mui-input-row">';
        li = li + ' <label for="fwfbz">晚餐标准</label>';
        li = li + '  <input type="number" id="fwfbz" name="fwfbz" placeholder="请填写晚餐标准" />';
        li = li + '</div>';
        li = li + '<div class="mui-input-row">';
        li = li + '    <label for="ffyhj">费用合计</label>';
        li = li + '    <input type="number" id="ffyhj" name="ffyhj" placeholder="请填写费用合计" />';
        li = li + ' </div>';
        li = li + '</div>';
        $("#mxlist_xc").append(li);
        document.getElementById('tjmx_xc').scrollIntoView();
    });
    $("#tjmx_ry").on('tap', function () {

        //var li = ' <div id="mx" class="mui-card">';
        //li = li + '  <div class="mui-input-row itemtitle">';
        //li = li + '  <label>明细列表项</label>';
        //li = li + '  <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>';
        //li = li + '   </div>';
        //li = li + ' <div class="mui-input-row">';
        //li = li + '  <label for="fxm">姓名</label>';
        //li = li + '  <input type="text" id="fxm" name="fxm" placeholder="请填写姓名" />';
        //li = li + ' </div>';
        //li = li + ' <div class="mui-input-row">';
        //li = li + '    <label for="fzw">职务</label>';
        //li = li + '  <input type="text" id="fzw" name="fzw" placeholder="请填写职务" />';
        //li = li + '    </div>';
        //li = li + ' </div> ';
        //$("#mxlist_ry").append(li);

        var el = dom.div({ id: 'mx', class: 'mui-card' },
            dom.div({ class: 'mui-input-row itemtitle' },
                dom.label({}, '明细列表项'),
                dom.span({
                    class: 'mui-icon mui-icon-close mui-pull-right', style: 'margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;',
                    id: 'deleteProduct', onclick:'deleteItem(this)'
                })
            ),
            dom.div({ class:'mui-input-row'},
                dom.label({ for: 'fxm' }, '姓名'),
                dom.input({type:'text',id:'fxm',name:'fxm',placeholder:'请填写姓名'})
            ),
            dom.div({ class: 'mui-input-row' },
                dom.label({ for: 'fzw' }, '职务'),
                dom.input({ type: 'text', id: 'fzw', name: 'fzw', placeholder: '请填写职务' })
            )
        );
        $("#mxlist_ry").append(el);
        document.getElementById('tjmx_ry').scrollIntoView();
    });

}
function mxItem_xc(fsj, fjqrs, fmpf, fwcycjdrs, fwcbz, fwfycjdrs, fwfbz, ffyhj) {
    var mx = Object.create({
        fsj: fsj,
        fjqrs: fjqrs,
        fmpf: fmpf,
        fwcycjdrs: fwcycjdrs,
        fwcbz: fwcbz,
        fwfycjdrs: fwfycjdrs,
        fwfbz: fwfbz,
        ffyhj: ffyhj,
        _check: function () {

            return mx;
        }

    });
    return mx._check();

}
function mxItem_ry(fxm, fzw) {
    var mx = Object.create({
        fxm: fxm,
        fzw: fzw,
        _check: function () {
            return mx;
        }
    });
    return mx._check();
}

var itemidArr1 = new Array();
var itemidArr2 = new Array();
//将请求回来的data作填充操作，在各自的js里实现
function initData(data, flag) {

    var item = data.FormDataSet.BPM_XSJLSQ_A1[0];
    if (flag) {

        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.danhao);
    }

    $("#fdq").val(item.dq);
    $("#fbsc").val(item.fbsc);
    $("#fname").val(item.ywyxm);
    $("#ftel").val(item.lxfs);
    $("#flkdw").val(item.dwmc);
    $("#fyyjb").val(item.jibie);
    $("#flkrs").val(item.lwrs);
    $("#fcws").val(item.cws);
    $("#fif_lf").val(item.fif_lf);
    if (String(item.fif_lf) == '是') {
        $("#fif_lfd").addClass('mui-active');
    }
    $("#flfhj").val(item.flf);
    $("#flwdate").val(FormatterTimeYMS(item.lkdwrq));
    $("#fif_xjz").val(item.if_jiezhan);
    if (String(item.if_jiezhan) == '是') {
        $("#fif_xjzd").addClass('mui-active');
    }
    $("#fjzdd").val(item.jzcz);
    $("#ffjdzsj").val(item.jzsj);
    $("#fzsjd").val(item.fhotel);
    $("#ffjlxjsl").val(item.ffjsl);
    $("#fzsfhj").val(item.fzsfhj);
    $("#fif_apcl").val(item.fif_cl);
    if (String(item.fif_cl)=='是') {
        $("#fif_apcld").addClass('mui-active');
    }
    $("#flkdate").val(FormatterTimeYMS(item.lwrq));
    $("#fif_xsz").val(item.if_songzhan);
    if (String(item.if_songzhan) == '是') {
        $("#fif_xszd").addClass('mui-active');
    }
    $("#fszdd").val(item.szcz);
    $("#ffjqfsj").val(item.szsj);
    $("#flkmd").val(item.hdmd);
    $("#ffyyshj").val(item.fhj);

    if (item.fj != null && item.fj != "") {
        var fjtmp = (String)(item.fj);

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
    var item_c1 = data.FormDataSet.BPM_XSJLSQ_B11;
    for (var i = 0; i < item_c1.length; i++) {
        itemidArr1.push(item_c1[i].ID);
        var li = '<div id="mx" class="mui-card">';
        li = li + '  <div class="mui-input-row itemtitle">';
        li = li + '    <label>明细列表项</label>';
        li = li + ' <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>';
        li = li + '</div>';
        li = li + '<div class="mui-input-row">';
        li = li + '    <label for="fsj">时间</label>';
        li = li + '<input type="date" id="fsj" name="fsj"  readonly="readonly" value="' + FormatterTimeYMS(item_c1.time) + '"/>';
        li = li + '</div>';
        li = li + ' <div class="mui-input-row itemtitle2">';
        li = li + '   <label>活动行程</label>';
        li = li + ' </div>';
        li = li + ' <div class="mui-input-row">';
        li = li + '  <label for="fjqrs">景区人数</label>';
        li = li + '  <input type="number" id="fjqrs" name="fjqrs" readonly="readonly"  value="' + item_c1[i].fjqrs + '"/>';
        li = li + ' </div>';
        li = li + '<div class="mui-input-row">';
        li = li + ' <label for="fmpf">门票费</label>';
        li = li + '  <input type="number" id="fmpf" name="fmpf" readonly="readonly"  value="' + item_c1[i].fmp + '"/>';
        li = li + ' </div>';
        li = li + '<div class="mui-input-row itemtitle2">';
        li = li + ' <label>午餐</label>';
        li = li + ' </div>';
        li = li + '<div class="mui-input-row">';
        li = li + ' <label for="fwcycjdrs">用餐酒店人数</label>';
        li = li + '  <input type="number" id="fwcycjdrs" name="fwcycjdrs" readonly="readonly" value="' + item_c1[i].fwcrs + '"/>';
        li = li + '  </div>';
        li = li + '<div class="mui-input-row">';
        li = li + '  <label for="fwcbz">午餐标准</label>';
        li = li + '<input type="number" id="fwcbz" name="fwcbz" readonly="readonly" value="' + item_c1[i].fwcbz + '"/>';
        li = li + ' </div>';
        li = li + '<div class="mui-input-row itemtitle2">';
        li = li + '   <label>晚餐</label>';
        li = li + '  </div>';
        li = li + ' <div class="mui-input-row">';
        li = li + '  <label for="fwfycjdrs">用餐酒店人数</label>';
        li = li + ' <input type="number" id="fwfycjdrs" name="fwfycjdrs" readonly="readonly" value="' + item_c1[i].fwrs + '"/>';
        li = li + ' </div>';
        li = li + ' <div class="mui-input-row">';
        li = li + ' <label for="fwfbz">晚餐标准</label>';
        li = li + '  <input type="number" id="fwfbz" name="fwfbz" readonly="readonly" value="' + item_c1[i].fwbz + '"/>';
        li = li + '</div>';
        li = li + '<div class="mui-input-row">';
        li = li + '    <label for="ffyhj">费用合计</label>';
        li = li + '    <input type="number" id="ffyhj" name="ffyhj" readonly="readonly" value="' + item_c1[i].ffyhj + '"/>';
        li = li + ' </div>';
        li = li + '</div>';
        $("#mxlist_xc").append(li);
    }

    var item_c2 = data.FormDataSet.BPM_XSJLSQ_B22;
    for (var i = 0; i < item_c2.length; i++) {
        itemidArr2.push(item_c2[i].ID);
        var li = ' <div id="mx" class="mui-card">';
        li = li + '  <div class="mui-input-row itemtitle">';
        li = li + '  <label>明细列表项</label>';
        li = li + '  <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>';
        li = li + '   </div>';
        li = li + ' <div class="mui-input-row">';
        li = li + '  <label for="fxm">姓名</label>';
        li = li + '  <input type="text" id="fxm" name="fxm" readonly="readonly" value="' + changeNullToEmpty( item_c2[i].xm )+ '"/>';
        li = li + ' </div>';
        li = li + ' <div class="mui-input-row">';
        li = li + '    <label for="fzw">职务</label>';
        li = li + '  <input type="text" id="fzw" name="fzw" readonly="readonly" value="' + changeNullToEmpty( item_c2[i].zhiwu )+ '"/>';
        li = li + '    </div>';
        li = li + ' </div> ';
        $("#mxlist_ry").append(li);
    }

}

//节点控制扩展,在各自的js里实现
function nodeControllerExp(NodeName) {
    if (NodeName == '开始') {
        $("#mxlist_xc").find('input').each(function () {
            $(this).removeAttr('readonly');
        });
        $("#mxlist_ry").find('input').each(function () {
            $(this).removeAttr('readonly');
        });
        $("#mxlist_xc,#mxlist_ry").find('span').each(function () {
            $(this).css('display', 'block');
        });
        tapEvent();
        $("#fbsc,#ftel,#flkdw,#fyyjb,#flkrs,#fcws,#flfhj,#flwdate,#fjzdd,#ffjdzsj,#fzsjd,#ffjlxjsl,#fzsfhj,#flkdate,#fszdd,#ffjqfsj,#flkmd,#ffyyshj").removeAttr('readonly');
        $("#fif_lfd,#fif_xjzd,#fif_apcld,#fif_xszd").removeClass('mui-disabled');
        $("#tjmx_xc,#tjmx_ry").css('display', 'block');
        $(".upload-addbtn").css('display', 'block');
        upload();
    }

}

function Save() {
    var fdq = $("#fdq").val();
    var fbsc = $("#fbsc").val();
    var fname = $("#fname").val();
    var ftel = $("#ftel").val();
    var flkdw = $("#flkdw").val();
    var fyyjb = $("#fyyjb").val();
    var flkrs = $("#flkrs").val();
    var fcws = $("#fcws").val();
    var fif_lf = $("#fif_lf").val();
    var flfhj = $("#flfhj").val();
    var flwdate = $("#flwdate").val();
    var fif_xjz = $("#fif_xjz").val();
    var fjzdd = $("#fjzdd").val();
    var ffjdzsj = $("#ffjdzsj").val();
    var fzsjd = $("#fzsjd").val();
    var ffjlxjsl = $("#ffjlxjsl").val();
    var fzsfhj = $("#fzsfhj").val();
    var fif_apcl = $("#fif_apcl").val();
    var flkdate = $("#flkdate").val();
    var fif_xsz = $("#fif_xsz").val();
    var fszdd = $("#fszdd").val();
    var ffjqfsj = $("#ffjqfsj").val();
    var flkmd = $("#flkmd").val();
    var ffyyshj = $("#ffyyshj").val();
    if (!fdq) {
        mui.toast('请选择大区');
        return;
    }
    var mxflag = false;
    var mxlistArr1 = new Array();
    $("#mxlist_xc").find("#mx").each(function () {
        var fsj = $(this).find("#fsj").val();
        var fjqrs = $(this).find("#fjqrs").val();
        var fmpf = $(this).find("#fmpf").val();
        var fwcycjdrs = $(this).find("#fwcycjdrs").val();
        var fwcbz = $(this).find("#fwcbz").val();
        var fwfycjdrs = $(this).find("#fwfycjdrs").val();
        var fwfbz = $(this).find("#fwfbz").val();
        var ffyhj = $(this).find("#ffyhj").val();
       
        var mx = mxItem_xc(fsj, fjqrs, fmpf, fwcycjdrs, fwcbz, fwfycjdrs, fwfbz, ffyhj);
        mxlistArr1.push(mx);
    });


    var mxlistArr2 = new Array();
    $("#mxlist_ry").find("#mx").each(function () {

        var fxm = $(this).find("#fxm").val();
        var fzw = $(this).find("#fzw").val();
       
        var mx = mxItem_ry(fxm, fzw);
        mxlistArr2.push(mx);
    });
    
    var btnArry = ["取消", "确定"];
    mui.confirm('即将提交，是否确定？', '提交确认提醒', btnArry, function (e) {
        if (e.index == 1) {

            var xml = '<?xml version= "1.0" ?>';
            xml = xml + '   <XForm>';
            xml = xml + '         <Header>';
            xml = xml + '        <Method>Post</Method>';
            xml = xml + '       <ProcessName>洁瑞公司学术交流申请</ProcessName>';
            xml = xml + '         <ProcessVersion>' + version + '</ProcessVersion>';
            xml = xml + '            <DraftGuid></DraftGuid>';
            xml = xml + '             <OwnerMemberFullName>' + BPMOU + '</OwnerMemberFullName>';
            xml = xml + '            <Action>提交</Action>';
            xml = xml + '          <Comment></Comment>';
            xml = xml + '             <InviteIndicateUsers></InviteIndicateUsers>';
            xml = xml + '       </Header>';
            xml = xml + '       <FormData>';

            xml = xml + ' <BPM_XSJLSQ_A1>';
            xml = xml + '  <danhao>自动生成</danhao>';
            xml = xml + ' <dq>' + fdq + '</dq>';
            xml = xml + ' <fbsc>' + fbsc + '</fbsc>';
            xml = xml + '<ywyxm>' + fname + '</ywyxm>';
            xml = xml + ' <lxfs>' + ftel+'</lxfs>';
            xml = xml + ' <dwmc>' + flkdw+'</dwmc>';
            xml = xml + ' <jibie>' + fyyjb+'</jibie>';
            xml = xml + '  <lwrs>' + flkrs+'</lwrs>';
            xml = xml + '  <cws>' + fcws+'</cws>';
            xml = xml + '  <fif_lf>' + fif_lf+'</fif_lf>';
            xml = xml + '  <flf>' + flfhj+'</flf>';
            xml = xml + '  <lkdwrq>' + flwdate+'</lkdwrq>';
            xml = xml + ' <if_jiezhan>' + fif_xjz+'</if_jiezhan>';
            xml = xml + ' <jzcz>' + fjzdd+'</jzcz>';
            xml = xml + '  <jzsj>' + ffjdzsj+'</jzsj>';
            xml = xml + '  <fhotel>' + fzsjd+'</fhotel>';
            xml = xml + ' <ffjsl>' + ffjlxjsl+'</ffjsl>';
            xml = xml + ' <fzsfhj>' + fzsfhj+'</fzsfhj>';
            xml = xml + '<fif_cl>' + fif_apcl+'</fif_cl>';
            xml = xml + '<lwrq>' + flkdate+'</lwrq>';
            xml = xml + '<if_songzhan>' + fif_xsz+'</if_songzhan>';
            xml = xml + ' <szcz>' + fszdd+'</szcz>';
            xml = xml + '<szsj>' + ffjqfsj+'</szsj>';
            xml = xml + '<hdmd>' + flkmd+'</hdmd>';
            xml = xml + '<fhj>' + ffyyshj + '</fhj>';
            if (fjArray.length != 0) {
                xml = xml + ' <fj>' + fjArray.toString().replace(",",";") + '</fj>';
            } else {
                xml = xml + ' <fj></fj>';
            }
           
            xml = xml + '</BPM_XSJLSQ_A1>';
            if (mxlistArr1.length != 0) {
                for (var i = 0; i < mxlistArr1.length; i++) {

                    xml = xml + '<BPM_XSJLSQ_B11>';
                    xml = xml + '<RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                    xml = xml + '<RowPrimaryKeys></RowPrimaryKeys>';
                    xml = xml + '<itm>' + (i + 1) + '</itm>';
                    xml = xml + ' <time>' + mxlistArr1[i].fsj + '</time>';
                    xml = xml + '  <fjqrs>' + mxlistArr1[i].fjqrs + '</fjqrs>';
                    xml = xml + ' <fmp>' + mxlistArr1[i].fmpf + '</fmp>';
                    xml = xml + '<fwcrs>' + mxlistArr1[i].fwcycjdrs + '</fwcrs>';
                    xml = xml + ' <fwcbz>' + mxlistArr1[i].fwcbz + '</fwcbz>';
                    xml = xml + ' <fwrs>' + mxlistArr1[i].fwfycjdrs + '</fwrs>';
                    xml = xml + '<fwbz>' + mxlistArr1[i].fwfbz + '</fwbz>';
                    xml = xml + ' <ffyhj>' + mxlistArr1[i].ffyhj + '</ffyhj>';
                    xml = xml + '</BPM_XSJLSQ_B11>';
                }
            } else {
                xml = xml + '<BPM_XSJLSQ_B11>';
                xml = xml + '<RelationRowGuid>1</RelationRowGuid>';
                xml = xml + '<RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + '<itm>1</itm>';
                xml = xml + ' <time></time>';
                xml = xml + '  <fjqrs></fjqrs>';
                xml = xml + ' <fmp></fmp>';
                xml = xml + '<fwcrs></fwcrs>';
                xml = xml + ' <fwcbz></fwcbz>';
                xml = xml + ' <fwrs></fwrs>';
                xml = xml + '<fwbz></fwbz>';
                xml = xml + ' <ffyhj></ffyhj>';
                xml = xml + '</BPM_XSJLSQ_B11>';
            }
            if (mxlistArr2.length != 0) {
                for (var i = 0; i < mxlistArr2.length; i++) {
                    xml = xml + '<BPM_XSJLSQ_B22>';
                    xml = xml + '<RelationRowGuid>' + mxlistArr1.length + i + 1 + '</RelationRowGuid>';
                    xml = xml + '<RowPrimaryKeys></RowPrimaryKeys>';
                    xml = xml + '<itm>' + (i + 1) + '</itm>';
                    xml = xml + '<xm>' + mxlistArr2[i].fxm + '</xm>';
                    xml = xml + '<zhiwu>' + mxlistArr2[i].fzw + '</zhiwu>';
                    xml = xml + '</BPM_XSJLSQ_B22>';
                }
            } else {
                xml = xml + '<BPM_XSJLSQ_B22>';
                xml = xml + '<RelationRowGuid>' + mxlistArr1.length + 1 + '</RelationRowGuid>';
                xml = xml + '<RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + '<itm>1</itm>';
                xml = xml + '<xm></xm>';
                xml = xml + '<zhiwu></zhiwu>';
                xml = xml + '</BPM_XSJLSQ_B22>';
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

    var fdq = $("#fdq").val();
    var fbsc = $("#fbsc").val();
    var fname = $("#fname").val();
    var ftel = $("#ftel").val();
    var flkdw = $("#flkdw").val();
    var fyyjb = $("#fyyjb").val();
    var flkrs = $("#flkrs").val();
    var fcws = $("#fcws").val();
    var fif_lf = $("#fif_lf").val();
    var flfhj = $("#flfhj").val();
    var flwdate = $("#flwdate").val();
    var fif_xjz = $("#fif_xjz").val();
    var fjzdd = $("#fjzdd").val();
    var ffjdzsj = $("#ffjdzsj").val();
    var fzsjd = $("#fzsjd").val();
    var ffjlxjsl = $("#ffjlxjsl").val();
    var fzsfhj = $("#fzsfhj").val();
    var fif_apcl = $("#fif_apcl").val();
    var flkdate = $("#flkdate").val();
    var fif_xsz = $("#fif_xsz").val();
    var fszdd = $("#fszdd").val();
    var ffjqfsj = $("#ffjqfsj").val();
    var flkmd = $("#flkmd").val();
    var ffyyshj = $("#ffyyshj").val();
    if (!fdq) {
        mui.toast('请选择大区');
        return;
    }
    var mxflag = false;
    var mxlistArr1 = new Array();
    $("#mxlist_xc").find("#mx").each(function () {
        var fsj = $(this).find("#fsj").val();
        var fjqrs = $(this).find("#fjqrs").val();
        var fmpf = $(this).find("#fmpf").val();
        var fwcycjdrs = $(this).find("#fwcycjdrs").val();
        var fwcbz = $(this).find("#fwcbz").val();
        var fwfycjdrs = $(this).find("#fwfycjdrs").val();
        var fwfbz = $(this).find("#fwfbz").val();
        var ffyhj = $(this).find("#ffyhj").val();
       
        var mx = mxItem_xc(fsj, fjqrs, fmpf, fwcycjdrs, fwcbz, fwfycjdrs, fwfbz, ffyhj);
        mxlistArr1.push(mx);
    });


    var mxlistArr2 = new Array();
    $("#mxlist_ry").find("#mx").each(function () {

        var fxm = $(this).find("#fxm").val();
        var fzw = $(this).find("#fzw").val();
       
        var mx = mxItem_ry(fxm, fzw);
        mxlistArr2.push(mx);
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

            xml = xml + ' <BPM_XSJLSQ_A1>';
            xml = xml + '  <danhao>' + fbillno + '</danhao>';
            xml = xml + ' <dq>' + fdq + '</dq>';
            xml = xml + ' <fbsc>' + fbsc + '</fbsc>';
            xml = xml + '<ywyxm>' + fname + '</ywyxm>';
            xml = xml + ' <lxfs>' + ftel + '</lxfs>';
            xml = xml + ' <dwmc>' + flkdw + '</dwmc>';
            xml = xml + ' <jibie>' + fyyjb + '</jibie>';
            xml = xml + '  <lwrs>' + flkrs + '</lwrs>';
            xml = xml + '  <cws>' + fcws + '</cws>';
            xml = xml + '  <fif_lf>' + fif_lf + '</fif_lf>';
            xml = xml + '  <flf>' + flfhj + '</flf>';
            xml = xml + '  <lkdwrq>' + flwdate + '</lkdwrq>';
            xml = xml + ' <if_jiezhan>' + fif_xjz + '</if_jiezhan>';
            xml = xml + ' <jzcz>' + fjzdd + '</jzcz>';
            xml = xml + '  <jzsj>' + ffjdzsj + '</jzsj>';
            xml = xml + '  <fhotel>' + fzsjd + '</fhotel>';
            xml = xml + ' <ffjsl>' + ffjlxjsl + '</ffjsl>';
            xml = xml + ' <fzsfhj>' + fzsfhj + '</fzsfhj>';
            xml = xml + '<fif_cl>' + fif_apcl + '</fif_cl>';
            xml = xml + '<lwrq>' + flkdate + '</lwrq>';
            xml = xml + '<if_songzhan>' + fif_xsz + '</if_songzhan>';
            xml = xml + ' <szcz>' + fszdd + '</szcz>';
            xml = xml + '<szsj>' + ffjqfsj + '</szsj>';
            xml = xml + '<hdmd>' + flkmd + '</hdmd>';
            xml = xml + '<fhj>' + ffyyshj + '</fhj>';
            if (fjArray.length != 0) {
                xml = xml + ' <fj>' + fjArray.toString().replace(",", ";") + '</fj>';
            } else {
                xml = xml + ' <fj></fj>';
            }

            xml = xml + '</BPM_XSJLSQ_A1>';

            if (mxlistArr1.length != 0) {
                for (var i = 0; i < mxlistArr1.length; i++) {

                    xml = xml + '<BPM_XSJLSQ_B11>';
                    xml = xml + '<RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                    xml = xml + '<RowPrimaryKeys></RowPrimaryKeys>';
                    xml = xml + '<itm>' + (i + 1) + '</itm>';
                    xml = xml + ' <time>' + mxlistArr1[i].fsj + '</time>';
                    xml = xml + '  <fjqrs>' + mxlistArr1[i].fjqrs + '</fjqrs>';
                    xml = xml + ' <fmp>' + mxlistArr1[i].fmpf + '</fmp>';
                    xml = xml + '<fwcrs>' + mxlistArr1[i].fwcycjdrs + '</fwcrs>';
                    xml = xml + ' <fwcbz>' + mxlistArr1[i].fwcbz + '</fwcbz>';
                    xml = xml + ' <fwrs>' + mxlistArr1[i].fwfycjdrs + '</fwrs>';
                    xml = xml + '<fwbz>' + mxlistArr1[i].fwfbz + '</fwbz>';
                    xml = xml + ' <ffyhj>' + mxlistArr1[i].ffyhj + '</ffyhj>';
                    xml = xml + '</BPM_XSJLSQ_B11>';
                }
            } else {
                xml = xml + '<BPM_XSJLSQ_B11>';
                xml = xml + '<RelationRowGuid>1</RelationRowGuid>';
                xml = xml + '<RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + '<itm>1</itm>';
                xml = xml + ' <time></time>';
                xml = xml + '  <fjqrs></fjqrs>';
                xml = xml + ' <fmp></fmp>';
                xml = xml + '<fwcrs></fwcrs>';
                xml = xml + ' <fwcbz></fwcbz>';
                xml = xml + ' <fwrs></fwrs>';
                xml = xml + '<fwbz></fwbz>';
                xml = xml + ' <ffyhj></ffyhj>';
                xml = xml + '</BPM_XSJLSQ_B11>';
            }
            if (mxlistArr2.length != 0) {
                for (var i = 0; i < mxlistArr2.length; i++) {
                    xml = xml + '<BPM_XSJLSQ_B22>';
                    xml = xml + '<RelationRowGuid>' + mxlistArr1.length + i + 1 + '</RelationRowGuid>';
                    xml = xml + '<RowPrimaryKeys></RowPrimaryKeys>';
                    xml = xml + '<itm>' + (i + 1) + '</itm>';
                    xml = xml + '<xm>' + mxlistArr2[i].fxm + '</xm>';
                    xml = xml + '<zhiwu>' + mxlistArr2[i].fzw + '</zhiwu>';
                    xml = xml + '</BPM_XSJLSQ_B22>';
                }
            } else {
                xml = xml + '<BPM_XSJLSQ_B22>';
                xml = xml + '<RelationRowGuid>' + mxlistArr1.length + 1 + '</RelationRowGuid>';
                xml = xml + '<RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + '<itm>1</itm>';
                xml = xml + '<xm></xm>';
                xml = xml + '<zhiwu></zhiwu>';
                xml = xml + '</BPM_XSJLSQ_B22>';
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

    var fdq = $("#fdq").val();
    var fbsc = $("#fbsc").val();
    var fname = $("#fname").val();
    var ftel = $("#ftel").val();
    var flkdw = $("#flkdw").val();
    var fyyjb = $("#fyyjb").val();
    var flkrs = $("#flkrs").val();
    var fcws = $("#fcws").val();
    var fif_lf = $("#fif_lf").val();
    var flfhj = $("#flfhj").val();
    var flwdate = $("#flwdate").val();
    var fif_xjz = $("#fif_xjz").val();
    var fjzdd = $("#fjzdd").val();
    var ffjdzsj = $("#ffjdzsj").val();
    var fzsjd = $("#fzsjd").val();
    var ffjlxjsl = $("#ffjlxjsl").val();
    var fzsfhj = $("#fzsfhj").val();
    var fif_apcl = $("#fif_apcl").val();
    var flkdate = $("#flkdate").val();
    var fif_xsz = $("#fif_xsz").val();
    var fszdd = $("#fszdd").val();
    var ffjqfsj = $("#ffjqfsj").val();
    var flkmd = $("#flkmd").val();
    var ffyyshj = $("#ffyyshj").val();
    var mxlistArr1 = new Array();
    $("#mxlist_xc").find("#mx").each(function () {
        var fsj = $(this).find("#fsj").val();
        var fjqrs = $(this).find("#fjqrs").val();
        var fmpf = $(this).find("#fmpf").val();
        var fwcycjdrs = $(this).find("#fwcycjdrs").val();
        var fwcbz = $(this).find("#fwcbz").val();
        var fwfycjdrs = $(this).find("#fwfycjdrs").val();
        var fwfbz = $(this).find("#fwfbz").val();
        var ffyhj = $(this).find("#ffyhj").val();
       
        var mx = mxItem_xc(fsj, fjqrs, fmpf, fwcycjdrs, fwcbz, fwfycjdrs, fwfbz, ffyhj);
        mxlistArr1.push(mx);
    });


    var mxlistArr2 = new Array();
    $("#mxlist_ry").find("#mx").each(function () {

        var fxm = $(this).find("#fxm").val();
        var fzw = $(this).find("#fzw").val();
        
        var mx = mxItem_ry(fxm, fzw);
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

            xml = xml + ' <BPM_XSJLSQ_A1>';
            xml = xml + '  <danhao>' + fbillno + '</danhao>';
            xml = xml + ' <dq>' + fdq + '</dq>';
            xml = xml + ' <fbsc>' + fbsc + '</fbsc>';
            xml = xml + '<ywyxm>' + fname + '</ywyxm>';
            xml = xml + ' <lxfs>' + ftel + '</lxfs>';
            xml = xml + ' <dwmc>' + flkdw + '</dwmc>';
            xml = xml + ' <jibie>' + fyyjb + '</jibie>';
            xml = xml + '  <lwrs>' + flkrs + '</lwrs>';
            xml = xml + '  <cws>' + fcws + '</cws>';
            xml = xml + '  <fif_lf>' + fif_lf + '</fif_lf>';
            xml = xml + '  <flf>' + flfhj + '</flf>';
            xml = xml + '  <lkdwrq>' + flwdate + '</lkdwrq>';
            xml = xml + ' <if_jiezhan>' + fif_xjz + '</if_jiezhan>';
            xml = xml + ' <jzcz>' + fjzdd + '</jzcz>';
            xml = xml + '  <jzsj>' + ffjdzsj + '</jzsj>';
            xml = xml + '  <fhotel>' + fzsjd + '</fhotel>';
            xml = xml + ' <ffjsl>' + ffjlxjsl + '</ffjsl>';
            xml = xml + ' <fzsfhj>' + fzsfhj + '</fzsfhj>';
            xml = xml + '<fif_cl>' + fif_apcl + '</fif_cl>';
            xml = xml + '<lwrq>' + flkdate + '</lwrq>';
            xml = xml + '<if_songzhan>' + fif_xsz + '</if_songzhan>';
            xml = xml + ' <szcz>' + fszdd + '</szcz>';
            xml = xml + '<szsj>' + ffjqfsj + '</szsj>';
            xml = xml + '<hdmd>' + flkmd + '</hdmd>';
            xml = xml + '<fhj>' + ffyyshj + '</fhj>';
            if (fjArray.length != 0) {
                xml = xml + ' <fj>' + fjArray.toString().replace(",", ";") + '</fj>';
            } else {
                xml = xml + ' <fj></fj>';
            }

            xml = xml + '</BPM_XSJLSQ_A1>';
            if (mxlistArr1.length != 0) {
                for (var i = 0; i < mxlistArr1.length; i++) {

                    xml = xml + '<BPM_XSJLSQ_B11>';
                    xml = xml + '<RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                    xml = xml + '<RowPrimaryKeys>ID=' + itemidArr1[i] + '</RowPrimaryKeys>';
                    xml = xml + '<itm>' + (i + 1) + '</itm>';
                    xml = xml + ' <time>' + mxlistArr1[i].fsj + '</time>';
                    xml = xml + '  <fjqrs>' + mxlistArr1[i].fjqrs + '</fjqrs>';
                    xml = xml + ' <fmp>' + mxlistArr1[i].fmpf + '</fmp>';
                    xml = xml + '<fwcrs>' + mxlistArr1[i].fwcycjdrs + '</fwcrs>';
                    xml = xml + ' <fwcbz>' + mxlistArr1[i].fwcbz + '</fwcbz>';
                    xml = xml + ' <fwrs>' + mxlistArr1[i].fwfycjdrs + '</fwrs>';
                    xml = xml + '<fwbz>' + mxlistArr1[i].fwfbz + '</fwbz>';
                    xml = xml + ' <ffyhj>' + mxlistArr1[i].ffyhj + '</ffyhj>';
                    xml = xml + '</BPM_XSJLSQ_B11>';
                }
            } else {
                xml = xml + '<BPM_XSJLSQ_B11>';
                xml = xml + '<RelationRowGuid>1</RelationRowGuid>';
                xml = xml + '<RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + '<itm>1</itm>';
                xml = xml + ' <time></time>';
                xml = xml + '  <fjqrs></fjqrs>';
                xml = xml + ' <fmp></fmp>';
                xml = xml + '<fwcrs></fwcrs>';
                xml = xml + ' <fwcbz></fwcbz>';
                xml = xml + ' <fwrs></fwrs>';
                xml = xml + '<fwbz></fwbz>';
                xml = xml + ' <ffyhj></ffyhj>';
                xml = xml + '</BPM_XSJLSQ_B11>';
            }
            if (mxlistArr2.length != 0) {
                for (var i = 0; i < mxlistArr2.length; i++) {
                    xml = xml + '<BPM_XSJLSQ_B22>';
                    xml = xml + '<RelationRowGuid>' + mxlistArr1.length + i + 1 + '</RelationRowGuid>';
                    xml = xml + '<RowPrimaryKeys>ID=' + itemidArr2[i] + '</RowPrimaryKeys>';
                    xml = xml + '<itm>' + (i + 1) + '</itm>';
                    xml = xml + '<xm>' + mxlistArr2[i].fxm + '</xm>';
                    xml = xml + '<zhiwu>' + mxlistArr2[i].fzw + '</zhiwu>';
                    xml = xml + '</BPM_XSJLSQ_B22>';
                }
            } else {
                xml = xml + '<BPM_XSJLSQ_B22>';
                xml = xml + '<RelationRowGuid>' + mxlistArr1.length + 1 + '</RelationRowGuid>';
                xml = xml + '<RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + '<itm>1</itm>';
                xml = xml + '<xm></xm>';
                xml = xml + '<zhiwu></zhiwu>';
                xml = xml + '</BPM_XSJLSQ_B22>';
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


    var fdq = $("#fdq").val();
    var fbsc = $("#fbsc").val();
    var fname = $("#fname").val();
    var ftel = $("#ftel").val();
    var flkdw = $("#flkdw").val();
    var fyyjb = $("#fyyjb").val();
    var flkrs = $("#flkrs").val();
    var fcws = $("#fcws").val();
    var fif_lf = $("#fif_lf").val();
    var flfhj = $("#flfhj").val();
    var flwdate = $("#flwdate").val();
    var fif_xjz = $("#fif_xjz").val();
    var fjzdd = $("#fjzdd").val();
    var ffjdzsj = $("#ffjdzsj").val();
    var fzsjd = $("#fzsjd").val();
    var ffjlxjsl = $("#ffjlxjsl").val();
    var fzsfhj = $("#fzsfhj").val();
    var fif_apcl = $("#fif_apcl").val();
    var flkdate = $("#flkdate").val();
    var fif_xsz = $("#fif_xsz").val();
    var fszdd = $("#fszdd").val();
    var ffjqfsj = $("#ffjqfsj").val();
    var flkmd = $("#flkmd").val();
    var ffyyshj = $("#ffyyshj").val();
    var mxlistArr1 = new Array();
    $("#mxlist_xc").find("#mx").each(function () {
        var fsj = $(this).find("#fsj").val();
        var fjqrs = $(this).find("#fjqrs").val();
        var fmpf = $(this).find("#fmpf").val();
        var fwcycjdrs = $(this).find("#fwcycjdrs").val();
        var fwcbz = $(this).find("#fwcbz").val();
        var fwfycjdrs = $(this).find("#fwfycjdrs").val();
        var fwfbz = $(this).find("#fwfbz").val();
        var ffyhj = $(this).find("#ffyhj").val();

        var mx = mxItem_xc(fsj, fjqrs, fmpf, fwcycjdrs, fwcbz, fwfycjdrs, fwfbz, ffyhj);
        mxlistArr1.push(mx);
    });


    var mxlistArr2 = new Array();
    $("#mxlist_ry").find("#mx").each(function () {

        var fxm = $(this).find("#fxm").val();
        var fzw = $(this).find("#fzw").val();

        var mx = mxItem_ry(fxm, fzw);
        mxlistArr2.push(mx);
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
            xml = xml + '<Action>同意</Action>';
            xml = xml + '<Comment>' + comment + '</Comment>';

            //加签差异部分
            xml = xml + '<ConsignEnabled>True</ConsignEnabled>';
            xml = xml + '<ConsignUsers>' + consignUserStr + '</ConsignUsers>';
            xml = xml + '<ConsignRoutingType>' + consignRoutingType + '</ConsignRoutingType>';
            xml = xml + '<ConsignReturnType>' + consignReturnType + '</ConsignReturnType>';

            xml = xml + '<InviteIndicateUsers></InviteIndicateUsers>';
            xml = xml + '</Header>';
            xml = xml + '<FormData>';


            xml = xml + ' <BPM_XSJLSQ_A1>';
            xml = xml + '  <danhao>' + fbillno + '</danhao>';
            xml = xml + ' <dq>' + fdq + '</dq>';
            xml = xml + ' <fbsc>' + fbsc + '</fbsc>';
            xml = xml + '<ywyxm>' + fname + '</ywyxm>';
            xml = xml + ' <lxfs>' + ftel + '</lxfs>';
            xml = xml + ' <dwmc>' + flkdw + '</dwmc>';
            xml = xml + ' <jibie>' + fyyjb + '</jibie>';
            xml = xml + '  <lwrs>' + flkrs + '</lwrs>';
            xml = xml + '  <cws>' + fcws + '</cws>';
            xml = xml + '  <fif_lf>' + fif_lf + '</fif_lf>';
            xml = xml + '  <flf>' + flfhj + '</flf>';
            xml = xml + '  <lkdwrq>' + flwdate + '</lkdwrq>';
            xml = xml + ' <if_jiezhan>' + fif_xjz + '</if_jiezhan>';
            xml = xml + ' <jzcz>' + fjzdd + '</jzcz>';
            xml = xml + '  <jzsj>' + ffjdzsj + '</jzsj>';
            xml = xml + '  <fhotel>' + fzsjd + '</fhotel>';
            xml = xml + ' <ffjsl>' + ffjlxjsl + '</ffjsl>';
            xml = xml + ' <fzsfhj>' + fzsfhj + '</fzsfhj>';
            xml = xml + '<fif_cl>' + fif_apcl + '</fif_cl>';
            xml = xml + '<lwrq>' + flkdate + '</lwrq>';
            xml = xml + '<if_songzhan>' + fif_xsz + '</if_songzhan>';
            xml = xml + ' <szcz>' + fszdd + '</szcz>';
            xml = xml + '<szsj>' + ffjqfsj + '</szsj>';
            xml = xml + '<hdmd>' + flkmd + '</hdmd>';
            xml = xml + '<fhj>' + ffyyshj + '</fhj>';
            if (fjArray.length != 0) {
                xml = xml + ' <fj>' + fjArray.toString().replace(",", ";") + '</fj>';
            } else {
                xml = xml + ' <fj></fj>';
            }

            xml = xml + '</BPM_XSJLSQ_A1>';
            if (mxlistArr1.length != 0) {
                for (var i = 0; i < mxlistArr1.length; i++) {

                    xml = xml + '<BPM_XSJLSQ_B11>';
                    xml = xml + '<RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                    xml = xml + '<RowPrimaryKeys>ID=' + itemidArr1[i] + '</RowPrimaryKeys>';
                    xml = xml + '<itm>' + (i + 1) + '</itm>';
                    xml = xml + ' <time>' + mxlistArr1[i].fsj + '</time>';
                    xml = xml + '  <fjqrs>' + mxlistArr1[i].fjqrs + '</fjqrs>';
                    xml = xml + ' <fmp>' + mxlistArr1[i].fmpf + '</fmp>';
                    xml = xml + '<fwcrs>' + mxlistArr1[i].fwcycjdrs + '</fwcrs>';
                    xml = xml + ' <fwcbz>' + mxlistArr1[i].fwcbz + '</fwcbz>';
                    xml = xml + ' <fwrs>' + mxlistArr1[i].fwfycjdrs + '</fwrs>';
                    xml = xml + '<fwbz>' + mxlistArr1[i].fwfbz + '</fwbz>';
                    xml = xml + ' <ffyhj>' + mxlistArr1[i].ffyhj + '</ffyhj>';
                    xml = xml + '</BPM_XSJLSQ_B11>';
                }
            } else {
                xml = xml + '<BPM_XSJLSQ_B11>';
                xml = xml + '<RelationRowGuid>1</RelationRowGuid>';
                xml = xml + '<RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + '<itm>1</itm>';
                xml = xml + ' <time></time>';
                xml = xml + '  <fjqrs></fjqrs>';
                xml = xml + ' <fmp></fmp>';
                xml = xml + '<fwcrs></fwcrs>';
                xml = xml + ' <fwcbz></fwcbz>';
                xml = xml + ' <fwrs></fwrs>';
                xml = xml + '<fwbz></fwbz>';
                xml = xml + ' <ffyhj></ffyhj>';
                xml = xml + '</BPM_XSJLSQ_B11>';
            }
            if (mxlistArr2.length != 0) {
                for (var i = 0; i < mxlistArr2.length; i++) {
                    xml = xml + '<BPM_XSJLSQ_B22>';
                    xml = xml + '<RelationRowGuid>' + mxlistArr1.length + i + 1 + '</RelationRowGuid>';
                    xml = xml + '<RowPrimaryKeys>ID=' + itemidArr2[i] + '</RowPrimaryKeys>';
                    xml = xml + '<itm>' + (i + 1) + '</itm>';
                    xml = xml + '<xm>' + mxlistArr2[i].fxm + '</xm>';
                    xml = xml + '<zhiwu>' + mxlistArr2[i].fzw + '</zhiwu>';
                    xml = xml + '</BPM_XSJLSQ_B22>';
                }
            } else {
                xml = xml + '<BPM_XSJLSQ_B22>';
                xml = xml + '<RelationRowGuid>' + mxlistArr1.length + 1 + '</RelationRowGuid>';
                xml = xml + '<RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + '<itm>1</itm>';
                xml = xml + '<xm></xm>';
                xml = xml + '<zhiwu></zhiwu>';
                xml = xml + '</BPM_XSJLSQ_B22>';
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
        xml = xml + '<Action>同意</Action>';
        xml = xml + '<Comment>' + comment + '</Comment>';

     

        xml = xml + '<InviteIndicateUsers></InviteIndicateUsers>';
        xml = xml + '</Header>';
        xml = xml + '<FormData>';


        xml = xml + ' <BPM_XSJLSQ_A1>';
        xml = xml + '  <danhao>' + fbillno + '</danhao>';
        xml = xml + ' <dq>' + fdq + '</dq>';
        xml = xml + ' <fbsc>' + fbsc + '</fbsc>';
        xml = xml + '<ywyxm>' + fname + '</ywyxm>';
        xml = xml + ' <lxfs>' + ftel + '</lxfs>';
        xml = xml + ' <dwmc>' + flkdw + '</dwmc>';
        xml = xml + ' <jibie>' + fyyjb + '</jibie>';
        xml = xml + '  <lwrs>' + flkrs + '</lwrs>';
        xml = xml + '  <cws>' + fcws + '</cws>';
        xml = xml + '  <fif_lf>' + fif_lf + '</fif_lf>';
        xml = xml + '  <flf>' + flfhj + '</flf>';
        xml = xml + '  <lkdwrq>' + flwdate + '</lkdwrq>';
        xml = xml + ' <if_jiezhan>' + fif_xjz + '</if_jiezhan>';
        xml = xml + ' <jzcz>' + fjzdd + '</jzcz>';
        xml = xml + '  <jzsj>' + ffjdzsj + '</jzsj>';
        xml = xml + '  <fhotel>' + fzsjd + '</fhotel>';
        xml = xml + ' <ffjsl>' + ffjlxjsl + '</ffjsl>';
        xml = xml + ' <fzsfhj>' + fzsfhj + '</fzsfhj>';
        xml = xml + '<fif_cl>' + fif_apcl + '</fif_cl>';
        xml = xml + '<lwrq>' + flkdate + '</lwrq>';
        xml = xml + '<if_songzhan>' + fif_xsz + '</if_songzhan>';
        xml = xml + ' <szcz>' + fszdd + '</szcz>';
        xml = xml + '<szsj>' + ffjqfsj + '</szsj>';
        xml = xml + '<hdmd>' + flkmd + '</hdmd>';
        xml = xml + '<fhj>' + ffyyshj + '</fhj>';
        if (fjArray.length != 0) {
            xml = xml + ' <fj>' + fjArray.toString().replace(",", ";") + '</fj>';
        } else {
            xml = xml + ' <fj></fj>';
        }

        xml = xml + '</BPM_XSJLSQ_A1>';
        if (mxlistArr1.length != 0) {
            for (var i = 0; i < mxlistArr1.length; i++) {

                xml = xml + '<BPM_XSJLSQ_B11>';
                xml = xml + '<RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml = xml + '<RowPrimaryKeys>ID=' + itemidArr1[i] + '</RowPrimaryKeys>';
                xml = xml + '<itm>' + (i + 1) + '</itm>';
                xml = xml + ' <time>' + mxlistArr1[i].fsj + '</time>';
                xml = xml + '  <fjqrs>' + mxlistArr1[i].fjqrs + '</fjqrs>';
                xml = xml + ' <fmp>' + mxlistArr1[i].fmpf + '</fmp>';
                xml = xml + '<fwcrs>' + mxlistArr1[i].fwcycjdrs + '</fwcrs>';
                xml = xml + ' <fwcbz>' + mxlistArr1[i].fwcbz + '</fwcbz>';
                xml = xml + ' <fwrs>' + mxlistArr1[i].fwfycjdrs + '</fwrs>';
                xml = xml + '<fwbz>' + mxlistArr1[i].fwfbz + '</fwbz>';
                xml = xml + ' <ffyhj>' + mxlistArr1[i].ffyhj + '</ffyhj>';
                xml = xml + '</BPM_XSJLSQ_B11>';
            }
        } else {
            xml = xml + '<BPM_XSJLSQ_B11>';
            xml = xml + '<RelationRowGuid>1</RelationRowGuid>';
            xml = xml + '<RowPrimaryKeys></RowPrimaryKeys>';
            xml = xml + '<itm>1</itm>';
            xml = xml + ' <time></time>';
            xml = xml + '  <fjqrs></fjqrs>';
            xml = xml + ' <fmp></fmp>';
            xml = xml + '<fwcrs></fwcrs>';
            xml = xml + ' <fwcbz></fwcbz>';
            xml = xml + ' <fwrs></fwrs>';
            xml = xml + '<fwbz></fwbz>';
            xml = xml + ' <ffyhj></ffyhj>';
            xml = xml + '</BPM_XSJLSQ_B11>';
        }
        if (mxlistArr2.length != 0) {
            for (var i = 0; i < mxlistArr2.length; i++) {
                xml = xml + '<BPM_XSJLSQ_B22>';
                xml = xml + '<RelationRowGuid>' + mxlistArr1.length + i + 1 + '</RelationRowGuid>';
                xml = xml + '<RowPrimaryKeys>ID=' + itemidArr2[i] + '</RowPrimaryKeys>';
                xml = xml + '<itm>' + (i + 1) + '</itm>';
                xml = xml + '<xm>' + mxlistArr2[i].fxm + '</xm>';
                xml = xml + '<zhiwu>' + mxlistArr2[i].fzw + '</zhiwu>';
                xml = xml + '</BPM_XSJLSQ_B22>';
            }
        } else {
            xml = xml + '<BPM_XSJLSQ_B22>';
            xml = xml + '<RelationRowGuid>' + mxlistArr1.length + 1 + '</RelationRowGuid>';
            xml = xml + '<RowPrimaryKeys></RowPrimaryKeys>';
            xml = xml + '<itm>1</itm>';
            xml = xml + '<xm></xm>';
            xml = xml + '<zhiwu></zhiwu>';
            xml = xml + '</BPM_XSJLSQ_B22>';
        }

        xml = xml + '</FormData>';
        xml = xml + '</XForm>';
        PostXml(xml);
    }
}