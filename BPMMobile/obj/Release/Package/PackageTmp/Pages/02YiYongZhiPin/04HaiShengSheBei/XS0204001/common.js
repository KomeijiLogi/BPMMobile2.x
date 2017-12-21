function prepMsg() {
    $("#fdate").val(getNowFormatDate(2));
    tapEvent();
    upload();
    var xml = '<?xml version= "1.0" ?>';
    xml = xml + '   <Requests>';
    xml = xml + '   <Params>';
    xml = xml + '       <Method>GetFormPostData</Method>';
    xml = xml + '       <ProcessName>海盛公司销售订单评审</ProcessName>';
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
        $("#fname").val(item.fname);
        $("#fdept").val(item.fdept);


    }).fail(function (e) {

    });
}
function tapEvent() {
    var fsqlxdata = [
        {
            value: '',
            text:'常规申请'
        },
        {
            value: '',
            text:'特殊申请'
        }
    ];
    showPicker('fsqlx', fsqlxdata);

    $("#tjmx").on('tap', function () {
        var el = dom.div({ id: 'mx',class:'mui-card' },
            dom.div({ class:'mui-input-row itemtitle'},
                dom.label({}, '明细列表项'),
                dom.span({
                    class: 'mui-icon mui-icon-close mui-pull-right', style: 'margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;',
                    id: 'deleteProduct', onclick:'deleteItem(this)'
                })
            ),
            dom.div({ class: 'mui-input-row' },
                dom.label({ for: 'fddbh' },
                    '订单编号',
                    dom.i({ style: 'color:red;' },'*')
                ),
                dom.input({
                    id: 'fddbh', name: 'fddbh', type: 'text', placeholder:'请填写订单编号'
                })
            ),
            dom.div({ class: 'mui-input-row' },
                dom.label({ for: 'fcpname' },
                    '产品名称',
                    dom.i({ style: 'color:red;' }, '*')
                ),
                dom.input({
                    id: 'fcpname', name: 'fcpname', type: 'text', placeholder: '请填写产品名称'
                })
            ),
            dom.div({ class: 'mui-input-row' },
                dom.label({ for: 'fggxh' },
                    '规格型号',
                    dom.i({ style: 'color:red;' }, '*')
                ),
                dom.input({
                    id: 'fggxh', name: 'fggxh', type: 'text', placeholder: '请填写产品名称'
                })
            ),
            dom.div({ class: 'mui-input-row' },
                dom.label({ for: 'funit' },
                    '单位',
                    dom.i({ style: 'color:red;' }, '*')
                ),
                dom.input({
                    id: 'funit', name: 'funit', type: 'text', placeholder: '请填写单位'
                })
            ),
            dom.div({ class: 'mui-input-row' },
                dom.label({ for: 'fsl' },
                    '数量',
                    dom.i({ style: 'color:red;' }, '*')
                ),
                dom.input({
                    id: 'fsl', name: 'fsl', type: 'number', placeholder: '请填写数量'
                })
            ),
            dom.div({ class: 'mui-input-row' },
                dom.label({ for: 'fjhrq' },
                    '交货日期',
                    dom.i({ style: 'color:red;' }, '*')
                ),
                dom.input({
                    id: 'fjhrq', name: 'fjhrq', type: 'date'
                })
            ),
            dom.div({ class: 'mui-input-row' },
                dom.label({ for: 'fywy' },
                    '业务员'                   
                ),
                dom.input({
                    id: 'fywy', name: 'fywy', type: 'text', placeholder:'请填写业务员'
                })
            ),
            dom.div({ class: 'mui-input-row' },
                dom.label({ for: 'fkhmc' },
                    '客户名称'
                ),
                dom.input({
                    id: 'fkhmc', name: 'fkhmc', type: 'text', placeholder: '请填写客户名称'
                })
            ),
            dom.div({ class: 'mui-input-row' },
                dom.label({ for: 'fhsdj' },
                    '含税单价'
                ),
                dom.input({
                    id: 'fhsdj', name: 'fhsdj', type: 'number', placeholder: '请填写含税单价'
                })
            ),
            dom.div({ class: 'mui-input-row' },
                dom.label({ for: 'fxsjg' },
                    '销售价格',
                    dom.i({ style: 'color:red;' }, '*')
                ),
                dom.input({
                    id: 'fxsjg', name: 'fxsjg', type: 'number', placeholder: '请填写销售价格'
                })
            ),
            dom.div({ class: 'mui-input-row' },
                dom.label({ for: 'ffkfs' },
                    '付款方式',
                    dom.i({ style: 'color:red;' }, '*')
                ),
                dom.input({
                    id: 'ffkfs', name: 'ffkfs', type: 'text', placeholder: '请填写付款方式'
                })
            ),
            dom.div({ class: 'mui-input-row' },
                dom.label({ for: 'fyf_date' },
                    '研发确认时间',
                    dom.i({ style: 'color:red;' }, '*')
                ),
                dom.input({
                    id: 'fyf_date', name: 'fyf_date', type: 'date'
                })
            ),
            dom.div({ class: 'mui-input-row' },
                dom.label({ for: 'fcg_date' },
                    '采购确认时间',
                    dom.i({ style: 'color:red;' }, '*')
                ),
                dom.input({
                    id: 'fcg_date', name: 'fcg_date', type: 'date'
                })
            ),
            dom.div({ class: 'mui-input-row' },
                dom.label({ for: 'fsc_date' },
                    '生产确认时间',
                    dom.i({ style: 'color:red;' }, '*')
                ),
                dom.input({
                    id: 'fsc_date', name: 'fsc_date', type: 'date'
                })
            ),
            dom.div({ class: 'mui-input-row itemtitle2' },
                dom.label({},'产品配置')
            ),
            dom.div({ class: 'mui-row' },
                dom.textarea({ id: 'fcppz', name: 'fcppz', rows: '5', placeholder:'请填写产品配置' })
            )
        );
        $("#mxlist").append(el);
    });



}

function initData(data, flag) {
    var item = data.FormDataSet.BPM_HSGSXSDD_A[0];
    if (flag) {

        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.fbillno);
    }
    $("#fname").val(item.fname);
    $("#fdept").val(item.fdept);
    $("#fdate").val(FormatterTimeYMS(item.fdate));
    $("#fsqlx").val(item.fsqlx);

    var item_c = data.FormDataSet.BPM_HSGSXSDD_B;
    for (var i = 0; i < item_c.length; i++) {
        itemidArr.push(item_c[i].itemid);

        var li = ' <div id="mx" class="mui-card">';
        li = li + '    <div class="mui-input-row itemtitle">';
        li = li + '    <label>明细列表项</label>';
        li = li + '    <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>';
        li = li + '   </div>';
        li = li + '    <div class="mui-input-row">';
        li = li + '    <label for="fddbh">订单编号<i style="color:red;">*</i></label>';
        li = li + '  <input type="text" id="fddbh" name="fddbh" readonly="readonly" value="' + item_c[i].fddbh+'"/>';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '      <label for="fcpname">产品名称<i style="color:red;">*</i></label>';
        li = li + '    <input type="text" id="fcpname" name="fcpname" readonly="readonly"  value="' + item_c[i].fcpname +'"/>';
        li = li + '  </div>';
        li = li + ' <div class="mui-input-row">';
        li = li + '    <label for="fggxh">规格型号<i style="color:red;">*</i></label>';
        li = li + '  <input type="text" id="fggxh" name="fggxh" readonly="readonly"  value="' + item_c[i].fggxh +'"/>';
        li = li + '  </div>';
        li = li + '  <div class="mui-input-row">';
        li = li + '     <label for="funit">单位<i style="color:red;">*</i></label>';
        li = li + '     <input type="text" id="funit" name="funit" readonly="readonly"  value="' + item_c[i].funit +'"/>';
        li = li + '   </div>';
        li = li + '  <div class="mui-input-row">';
        li = li + '     <label for="fsl">数量<i style="color:red;">*</i></label>';
        li = li + '     <input type="number" id="fsl" name="fsl" readonly="readonly"  value="' + item_c[i].fsl +'"/>';
        li = li + '  </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '    <label for="fjhrq">交货日期<i style="color:red;">*</i></label>';
        li = li + '   <input type="date" id="fjhrq" name="fjhrq" readonly="readonly"  value="' + FormatterTimeYMS(item_c[i].fjhrq) + '"/>';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '  <label for="fywy">业务员</label>';
        li = li + '    <input type="text" id="fywy" name="fywy" readonly="readonly"  value="' + changeNullToEmpty( item_c[i].fywy )+ '"/>';
        li = li + '    </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '    <label for="fkhmc">客户名称</label>';
        li = li + '     <input type="text" id="fkhmc" name="fkhmc" readonly="readonly"  value="' + changeNullToEmpty( item_c[i].fkhmc) + '"/>';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '      <label for="fhsdj">含税单价</label>';
        li = li + '      <input type="number" id="fhsdj" name="fhsdj" readonly="readonly"  value="' + changeNullToEmpty( item_c[i].fhsdj) + '"/>';
        li = li + '   </div>';
        li = li + '    <div class="mui-input-row">';
        li = li + '   <label for="fxsjg">销售价格<i style="color:red;">*</i></label>';
        li = li + '    <input type="number" id="fxsjg" name="fxsjg" readonly="readonly"  value="' + item_c[i].fxsjg +'"/>';
        li = li + '    </div>';
        li = li + '  <div class="mui-input-row">';
        li = li + '    <label for="ffkfs">付款方式<i style="color:red;">*</i></label>';
        li = li + '      <input type="text" id="ffkfs" name="ffkfs" readonly="readonly"  value="' + item_c[i].ffkfs +'"/>';
        li = li + '  </div>';
        li = li + '  <div class="mui-input-row">';
        li = li + '      <label for="fyf_date">研发确认时间<i style="color:red;">*</i></label>';
        li = li + '      <input type="date" id="fyf_date" name="fyf_date" readonly="readonly"  value="' + FormatterTimeYMS( item_c[i].fyf_date) + '"/>';
        li = li + '  </div>';
        li = li + '    <div class="mui-input-row">';
        li = li + '     <label for="fcg_date">采购确认时间<i style="color:red;">*</i></label>';
        li = li + '      <input type="date" id="fcg_date" name="fcg_date" readonly="readonly"  value="' + FormatterTimeYMS( item_c[i].fcg_date) + '"/>';
        li = li + '    </div>';
        li = li + ' <div class="mui-input-row">';
        li = li + '    <label for="fsc_date">生产确认时间<i style="color:red;">*</i></label>';
        li = li + '     <input type="date" id="fsc_date" name="fsc_date" readonly="readonly"   value="' + FormatterTimeYMS( item_c[i].fsc_date) + '"/>';
        li = li + '   </div>';
        li = li + '  <div class="mui-input-row itemtitle2">';
        li = li + '    <label>产品配置</label>';
        li = li + '  </div>';
        li = li + '  <div class="mui-row">';
        li = li + '    <textarea id="fcppz" name="fcppz" rows="5" readonly="readonly">' + changeNullToEmpty(item_c[i].fcppz) + '</textarea>';
        li = li + ' </div>';
        li = li + ' </div>';
        $("#mxlist").append(li);
    }
    
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

}


function nodeControllerExp(NodeName) {
    if (NodeName == '开始') {
        upload();
        tapEvent();
        $(".upload-addbtn").css('display', 'block');
        $("#mxlist").find('input[type="text"]').each(function () {
            $(this).removeAttr('readonly');
        });
        $("#mxlist").find('input[type="number"]').each(function () {
            $(this).removeAttr('readonly');
        });
        $("#mxlist").find('#fjhrq').each(function () {
            $(this).removeAttr('readonly');
        });
        $("#mxlist").find('span').each(function () {
            $(this).css('display', 'block');
        });
        $('#tjmx').show();
    } else if (NodeName != "sysInform") {
        if (typeof (NodeName) != "undefined") {
            if (String(NodeName).indexOf('研发部') != -1) {
                //业务员、客户名称、含税单价、销售价格隐藏、付款方式隐藏，研发确认时间必填
                $("#mxlist").find('#fywy,#fkhmc,#fhsdj,#fxsjg,#ffkfs').each(function () {
                    $(this).hide();
                });
                $("#mxlist").find('#fyf_date').each(function () {
                    $(this).removeAttr('readonly');
                });

            } else if (String(NodeName).indexOf('采购部') != -1) {
                 //含税单价、销售价格隐藏，采购确认时间必填
                $("#mxlist").find('#fhsdj,#fxsjg,#ffkfs').each(function () {
                    $(this).hide();
                });
                $("#mxlist").find('#fcg_date').each(function () {
                    $(this).removeAttr('readonly');
                });
            } else if (String(NodeName).indexOf('生产部') != -1) {
                 //含税单价、销售价格隐藏，生产确认时间必填
                $("#mxlist").find('#fhsdj,#fxsjg,#ffkfs').each(function () {
                    $(this).hide();
                });
                $("#mxlist").find('#fsc_date').each(function () {
                    $(this).removeAttr('readonly');
                });
            } else if (String(NodeName).indexOf('质量部') != -1) {
                //含税单价、销售价格隐藏
                $("#mxlist").find('#fhsdj,#fxsjg,#ffkfs').each(function () {
                    $(this).hide();
                });

            }

        }
    }
}

function mxItem(fddbh, fcpname, fggxh, funit, fsl, fjhrq, fywy, fkhmc, fhsdj, fxsjg, ffkfs, fyf_date, fcg_date, fsc_date, fcppz) {
    var mx = Object.create({
        fddbh: fddbh,
        fcpname: fcpname,
        fggxh: fggxh,
        funit: funit,
        fsl: fsl,
        fjhrq: fjhrq,
        fywy: fywy,
        fkhmc: fkhmc,
        fhsdj: fhsdj,
        fxsjg: fxsjg,
        ffkfs: ffkfs,
        fyf_date: fyf_date,
        fcg_date: fcg_date,
        fsc_date: fsc_date,
        fcppz: fcppz,
        _check: function () {
            if (!fcpname) {
                mui.toast('请填写产品名称');
                return null;
            }
            if (!fggxh) {
                mui.toast('请填写规格型号');
                return null;
            }
            if (!funit) {
                mui.toast('请填写单位');
                return null;
            }
            if (!fsl) {
                mui.toast('请填写数量');
                return null;
            }
            if (!fjhrq) {
                mui.toast('请填写交货日期');
                return null;
            }
            if (!fxsjg) {
                mui.toast('请填写销售价格');
                return null;
            }
            if (!ffkfs) {
                mui.toast('请填写付款方式');
                return null;
            }
            return mx;
        }
    });
    return mx._check();
}

function Save() {

    
    var fname = $("#fname").val();
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();
    var fsqlx = $("#fsqlx").val();
    if (!fsqlx) {
        mui.toast('请选择申请类型');
        return;
    }
    var mxflag = false;
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fddbh = $(this).find("#fddbh").val();
        var fcpname = $(this).find("#fcpname").val();
        var fggxh = $(this).find("#fggxh").val();
        var funit = $(this).find("#funit").val();
        var fsl = $(this).find("#fsl").val();
        var fjhrq = $(this).find("#fjhrq").val();
        var fywy = $(this).find("#fywy").val();
        var fkhmc = $(this).find("#fkhmc").val();
        var fhsdj = $(this).find("#fhsdj").val();
        var fxsjg = $(this).find("#fxsjg").val();
        var ffkfs = $(this).find("#ffkfs").val();
        var fyf_date = $(this).find("#fyf_date").val();
        var fcg_date = $(this).find("#fcg_date").val();
        var fsc_date = $(this).find("#fsc_date").val();
        var fcppz = $(this).find("#fcppz").val();
        if (mxItem(fddbh, fcpname, fggxh, funit, fsl, fjhrq, fywy, fkhmc, fhsdj, fxsjg, ffkfs, fyf_date, fcg_date, fsc_date, fcppz) == null) {
            mxflag = true;
            return;
        }
        var mx = mxItem(fddbh, fcpname, fggxh, funit, fsl, fjhrq, fywy, fkhmc, fhsdj, fxsjg, ffkfs, fyf_date, fcg_date, fsc_date, fcppz);
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
            xml = xml + '       <ProcessName>海盛公司销售订单评审</ProcessName>';
            xml = xml + '         <ProcessVersion>' + version + '</ProcessVersion>';
            xml = xml + '            <DraftGuid></DraftGuid>';
            xml = xml + '             <OwnerMemberFullName>' + BPMOU + '</OwnerMemberFullName>';
            xml = xml + '            <Action>提交</Action>';
            xml = xml + '          <Comment></Comment>';
            xml = xml + '             <InviteIndicateUsers></InviteIndicateUsers>';
            xml = xml + '       </Header>';
            xml = xml + '       <FormData>';

            xml = xml + '  <BPM_HSGSXSDD_A>';
            xml = xml + '   <fbillno>自动生成</fbillno>';
            xml = xml + '   <fname>' + fname + '</fname>';
            xml = xml + '   <fdept>' + fdept + '</fdept>';
            xml = xml + '   <fdate>' + fdate + '</fdate>';
            xml = xml + '   <fsqlx>' + fsqlx + '</fsqlx>';
            xml = xml + '  <fj>' + fjArray.join(";") + '</fj>';
            xml = xml + '  </BPM_HSGSXSDD_A>';
            for (var i = 0; i < mxlistArr.length; i++) {
                xml = xml + ' <BPM_HSGSXSDD_B>';
                xml = xml + '  <RelationRowGuid>'+(i+1)+'</RelationRowGuid>';
                xml = xml + '  <RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + ' <fddbh>' + mxlistArr[i].fddbh + '</fddbh>';
                xml = xml + '  <fcpname>' + mxlistArr[i].fcpname + '</fcpname>';
                xml = xml + '  <fggxh>' + mxlistArr[i].fggxh + '</fggxh>';
                xml = xml + '  <funit>' + mxlistArr[i].funit + '</funit>';
                xml = xml + '  <fsl>' + mxlistArr[i].fsl + '</fsl>';
                xml = xml + '  <fjhrq>' + mxlistArr[i].fjhrq + '</fjhrq>';
                xml = xml + ' <fywy>' + mxlistArr[i].fywy + '</fywy>';
                xml = xml + '   <fkhmc>' + mxlistArr[i].fkhmc + '</fkhmc>';
                xml = xml + '  <fhsdj>' + mxlistArr[i].fhsdj + '</fhsdj>';
                xml = xml + '<fxsjg>' + mxlistArr[i].fxsjg + '</fxsjg>';
                xml = xml + ' <ffkfs>' + mxlistArr[i].ffkfs + '</ffkfs>';
                xml = xml + '  <fyf_date>' + mxlistArr[i].fyf_date + '</fyf_date>';
                xml = xml + '  <fcg_date>' + mxlistArr[i].fcg_date + '</fcg_date>';
                xml = xml + '   <fsc_date>' + mxlistArr[i].fsc_date + '</fsc_date>';
                xml = xml + '  <fentryno>' + (i + 1) + '</fentryno>';
                xml = xml + '   <fcppz>' + mxlistArr[i].fcppz + '</fcppz>';
                xml = xml + '  </BPM_HSGSXSDD_B>';
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
    var fsqlx = $("#fsqlx").val();
    if (!fsqlx) {
        mui.toast('请选择申请类型');
        return;
    }
    var mxflag = false;
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fddbh = $(this).find("#fddbh").val();
        var fcpname = $(this).find("#fcpname").val();
        var fggxh = $(this).find("#fggxh").val();
        var funit = $(this).find("#funit").val();
        var fsl = $(this).find("#fsl").val();
        var fjhrq = $(this).find("#fjhrq").val();
        var fywy = $(this).find("#fywy").val();
        var fkhmc = $(this).find("#fkhmc").val();
        var fhsdj = $(this).find("#fhsdj").val();
        var fxsjg = $(this).find("#fxsjg").val();
        var ffkfs = $(this).find("#ffkfs").val();
        var fyf_date = $(this).find("#fyf_date").val();
        var fcg_date = $(this).find("#fcg_date").val();
        var fsc_date = $(this).find("#fsc_date").val();
        var fcppz = $(this).find("#fcppz").val();
        if (mxItem(fddbh, fcpname, fggxh, funit, fsl, fjhrq, fywy, fkhmc, fhsdj, fxsjg, ffkfs, fyf_date, fcg_date, fsc_date, fcppz) == null) {
            mxflag = true;
            return;
        }
        var mx = mxItem(fddbh, fcpname, fggxh, funit, fsl, fjhrq, fywy, fkhmc, fhsdj, fxsjg, ffkfs, fyf_date, fcg_date, fsc_date, fcppz);
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

            xml = xml + '  <BPM_HSGSXSDD_A>';
            xml = xml + '   <fbillno>' + fbillno + '</fbillno>';
            xml = xml + '   <fname>' + fname + '</fname>';
            xml = xml + '   <fdept>' + fdept + '</fdept>';
            xml = xml + '   <fdate>' + fdate + '</fdate>';
            xml = xml + '   <fsqlx>' + fsqlx + '</fsqlx>';
            xml = xml + '  <fj>' + fjArray.join(";") + '</fj>';
            xml = xml + '  </BPM_HSGSXSDD_A>';
            for (var i = 0; i < mxlistArr.length; i++) {
                xml = xml + ' <BPM_HSGSXSDD_B>';
                xml = xml + '  <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml = xml + '  <RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + ' <fddbh>' + mxlistArr[i].fddbh + '</fddbh>';
                xml = xml + '  <fcpname>' + mxlistArr[i].fcpname + '</fcpname>';
                xml = xml + '  <fggxh>' + mxlistArr[i].fggxh + '</fggxh>';
                xml = xml + '  <funit>' + mxlistArr[i].funit + '</funit>';
                xml = xml + '  <fsl>' + mxlistArr[i].fsl + '</fsl>';
                xml = xml + '  <fjhrq>' + mxlistArr[i].fjhrq + '</fjhrq>';
                xml = xml + ' <fywy>' + mxlistArr[i].fywy + '</fywy>';
                xml = xml + '   <fkhmc>' + mxlistArr[i].fkhmc + '</fkhmc>';
                xml = xml + '  <fhsdj>' + mxlistArr[i].fhsdj + '</fhsdj>';
                xml = xml + '<fxsjg>' + mxlistArr[i].fxsjg + '</fxsjg>';
                xml = xml + ' <ffkfs>' + mxlistArr[i].ffkfs + '</ffkfs>';
                xml = xml + '  <fyf_date>' + mxlistArr[i].fyf_date + '</fyf_date>';
                xml = xml + '  <fcg_date>' + mxlistArr[i].fcg_date + '</fcg_date>';
                xml = xml + '   <fsc_date>' + mxlistArr[i].fsc_date + '</fsc_date>';
                xml = xml + '  <fentryno>' + (i + 1) + '</fentryno>';
                xml = xml + '   <fcppz>' + mxlistArr[i].fcppz + '</fcppz>';
                xml = xml + '  </BPM_HSGSXSDD_B>';
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
    var fsqlx = $("#fsqlx").val();
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fddbh = $(this).find("#fddbh").val();
        var fcpname = $(this).find("#fcpname").val();
        var fggxh = $(this).find("#fggxh").val();
        var funit = $(this).find("#funit").val();
        var fsl = $(this).find("#fsl").val();
        var fjhrq = $(this).find("#fjhrq").val();
        var fywy = $(this).find("#fywy").val();
        var fkhmc = $(this).find("#fkhmc").val();
        var fhsdj = $(this).find("#fhsdj").val();
        var fxsjg = $(this).find("#fxsjg").val();
        var ffkfs = $(this).find("#ffkfs").val();
        var fyf_date = $(this).find("#fyf_date").val();
        var fcg_date = $(this).find("#fcg_date").val();
        var fsc_date = $(this).find("#fsc_date").val();
        var fcppz = $(this).find("#fcppz").val();
     
        var mx = mxItem(fddbh, fcpname, fggxh, funit, fsl, fjhrq, fywy, fkhmc, fhsdj, fxsjg, ffkfs, fyf_date, fcg_date, fsc_date, fcppz);
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
            xml = xml + '  <BPM_HSGSXSDD_A>';
            xml = xml + '   <fbillno>' + fbillno + '</fbillno>';
            xml = xml + '   <fname>' + fname + '</fname>';
            xml = xml + '   <fdept>' + fdept + '</fdept>';
            xml = xml + '   <fdate>' + fdate + '</fdate>';
            xml = xml + '   <fsqlx>' + fsqlx + '</fsqlx>';
            xml = xml + '  <fj>' + fjArray.join(";") + '</fj>';
            xml = xml + '  </BPM_HSGSXSDD_A>';
            for (var i = 0; i < mxlistArr.length; i++) {
                xml = xml + ' <BPM_HSGSXSDD_B>';
                xml = xml + '  <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml = xml + '  <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
                xml = xml + ' <fddbh>' + mxlistArr[i].fddbh + '</fddbh>';
                xml = xml + '  <fcpname>' + mxlistArr[i].fcpname + '</fcpname>';
                xml = xml + '  <fggxh>' + mxlistArr[i].fggxh + '</fggxh>';
                xml = xml + '  <funit>' + mxlistArr[i].funit + '</funit>';
                xml = xml + '  <fsl>' + mxlistArr[i].fsl + '</fsl>';
                xml = xml + '  <fjhrq>' + mxlistArr[i].fjhrq + '</fjhrq>';
                xml = xml + ' <fywy>' + mxlistArr[i].fywy + '</fywy>';
                xml = xml + '   <fkhmc>' + mxlistArr[i].fkhmc + '</fkhmc>';
                xml = xml + '  <fhsdj>' + mxlistArr[i].fhsdj + '</fhsdj>';
                xml = xml + '<fxsjg>' + mxlistArr[i].fxsjg + '</fxsjg>';
                xml = xml + ' <ffkfs>' + mxlistArr[i].ffkfs + '</ffkfs>';
                xml = xml + '  <fyf_date>' + mxlistArr[i].fyf_date + '</fyf_date>';
                xml = xml + '  <fcg_date>' + mxlistArr[i].fcg_date + '</fcg_date>';
                xml = xml + '   <fsc_date>' + mxlistArr[i].fsc_date + '</fsc_date>';
                xml = xml + '  <fentryno>' + (i + 1) + '</fentryno>';
                xml = xml + '   <fcppz>' + mxlistArr[i].fcppz + '</fcppz>';
                xml = xml + '  </BPM_HSGSXSDD_B>';
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
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();
    var fsqlx = $("#fsqlx").val();
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fddbh = $(this).find("#fddbh").val();
        var fcpname = $(this).find("#fcpname").val();
        var fggxh = $(this).find("#fggxh").val();
        var funit = $(this).find("#funit").val();
        var fsl = $(this).find("#fsl").val();
        var fjhrq = $(this).find("#fjhrq").val();
        var fywy = $(this).find("#fywy").val();
        var fkhmc = $(this).find("#fkhmc").val();
        var fhsdj = $(this).find("#fhsdj").val();
        var fxsjg = $(this).find("#fxsjg").val();
        var ffkfs = $(this).find("#ffkfs").val();
        var fyf_date = $(this).find("#fyf_date").val();
        var fcg_date = $(this).find("#fcg_date").val();
        var fsc_date = $(this).find("#fsc_date").val();
        var fcppz = $(this).find("#fcppz").val();

        var mx = mxItem(fddbh, fcpname, fggxh, funit, fsl, fjhrq, fywy, fkhmc, fhsdj, fxsjg, ffkfs, fyf_date, fcg_date, fsc_date, fcppz);
        mxlistArr.push(mx);
    });
    var mxflag = false;
    if (String(nodeName).indexOf('研发部') != -1 && String(nodeName).indexOf('知会') == -1) {
        $("#mxlist").find("#mx").each(function () {
            var fyf_date = $(this).find("#fyf_date").val();
            if (!fyf_date) {
                mui.toast('请填写研发部确认时间');
                mxflag = true;
                return;
            }
        });
    }
    if (String(nodeName).indexOf('生产部') != -1 && String(nodeName).indexOf('知会') == -1) {
        $("#mxlist").find("#mx").each(function () {
            var fsc_date = $(this).find("#fsc_date").val();
            if (!fsc_date) {
                mui.toast('请填写生产部确认时间');
                mxflag = true;
                return;
            }
        });
    }
    if (String(nodeName).indexOf('采购部') != -1 && String(nodeName).indexOf('知会') == -1) {
        $("#mxlist").find("#mx").each(function () {
            var fcg_date = $(this).find("#fcg_date").val();
            if (!fcg_date) {
                mui.toast('请填写采购部确认时间');
                mxflag = true;
                return;
            }
        });
    }
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

            xml = xml + '  <BPM_HSGSXSDD_A>';
            xml = xml + '   <fbillno>' + fbillno + '</fbillno>';
            xml = xml + '   <fname>' + fname + '</fname>';
            xml = xml + '   <fdept>' + fdept + '</fdept>';
            xml = xml + '   <fdate>' + fdate + '</fdate>';
            xml = xml + '   <fsqlx>' + fsqlx + '</fsqlx>';
            xml = xml + '  <fj>' + fjArray.join(";") + '</fj>';
            xml = xml + '  </BPM_HSGSXSDD_A>';
            for (var i = 0; i < mxlistArr.length; i++) {
                xml = xml + ' <BPM_HSGSXSDD_B>';
                xml = xml + '  <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml = xml + '  <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
                xml = xml + ' <fddbh>' + mxlistArr[i].fddbh + '</fddbh>';
                xml = xml + '  <fcpname>' + mxlistArr[i].fcpname + '</fcpname>';
                xml = xml + '  <fggxh>' + mxlistArr[i].fggxh + '</fggxh>';
                xml = xml + '  <funit>' + mxlistArr[i].funit + '</funit>';
                xml = xml + '  <fsl>' + mxlistArr[i].fsl + '</fsl>';
                xml = xml + '  <fjhrq>' + mxlistArr[i].fjhrq + '</fjhrq>';
                xml = xml + ' <fywy>' + mxlistArr[i].fywy + '</fywy>';
                xml = xml + '   <fkhmc>' + mxlistArr[i].fkhmc + '</fkhmc>';
                xml = xml + '  <fhsdj>' + mxlistArr[i].fhsdj + '</fhsdj>';
                xml = xml + '<fxsjg>' + mxlistArr[i].fxsjg + '</fxsjg>';
                xml = xml + ' <ffkfs>' + mxlistArr[i].ffkfs + '</ffkfs>';
                xml = xml + '  <fyf_date>' + mxlistArr[i].fyf_date + '</fyf_date>';
                xml = xml + '  <fcg_date>' + mxlistArr[i].fcg_date + '</fcg_date>';
                xml = xml + '   <fsc_date>' + mxlistArr[i].fsc_date + '</fsc_date>';
                xml = xml + '  <fentryno>' + (i + 1) + '</fentryno>';
                xml = xml + '   <fcppz>' + mxlistArr[i].fcppz + '</fcppz>';
                xml = xml + '  </BPM_HSGSXSDD_B>';
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

        xml = xml + '  <BPM_HSGSXSDD_A>';
        xml = xml + '   <fbillno>' + fbillno + '</fbillno>';
        xml = xml + '   <fname>' + fname + '</fname>';
        xml = xml + '   <fdept>' + fdept + '</fdept>';
        xml = xml + '   <fdate>' + fdate + '</fdate>';
        xml = xml + '   <fsqlx>' + fsqlx + '</fsqlx>';
        xml = xml + '  <fj>' + fjArray.join(";") + '</fj>';
        xml = xml + '  </BPM_HSGSXSDD_A>';
        for (var i = 0; i < mxlistArr.length; i++) {
            xml = xml + ' <BPM_HSGSXSDD_B>';
            xml = xml + '  <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
            xml = xml + '  <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
            xml = xml + ' <fddbh>' + mxlistArr[i].fddbh + '</fddbh>';
            xml = xml + '  <fcpname>' + mxlistArr[i].fcpname + '</fcpname>';
            xml = xml + '  <fggxh>' + mxlistArr[i].fggxh + '</fggxh>';
            xml = xml + '  <funit>' + mxlistArr[i].funit + '</funit>';
            xml = xml + '  <fsl>' + mxlistArr[i].fsl + '</fsl>';
            xml = xml + '  <fjhrq>' + mxlistArr[i].fjhrq + '</fjhrq>';
            xml = xml + ' <fywy>' + mxlistArr[i].fywy + '</fywy>';
            xml = xml + '   <fkhmc>' + mxlistArr[i].fkhmc + '</fkhmc>';
            xml = xml + '  <fhsdj>' + mxlistArr[i].fhsdj + '</fhsdj>';
            xml = xml + '<fxsjg>' + mxlistArr[i].fxsjg + '</fxsjg>';
            xml = xml + ' <ffkfs>' + mxlistArr[i].ffkfs + '</ffkfs>';
            xml = xml + '  <fyf_date>' + mxlistArr[i].fyf_date + '</fyf_date>';
            xml = xml + '  <fcg_date>' + mxlistArr[i].fcg_date + '</fcg_date>';
            xml = xml + '   <fsc_date>' + mxlistArr[i].fsc_date + '</fsc_date>';
            xml = xml + '  <fentryno>' + (i + 1) + '</fentryno>';
            xml = xml + '   <fcppz>' + mxlistArr[i].fcppz + '</fcppz>';
            xml = xml + '  </BPM_HSGSXSDD_B>';
        }
        xml = xml + '</FormData>';
        xml = xml + '</XForm>';
        PostXml(xml);
    }
}
