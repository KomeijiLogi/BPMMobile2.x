function prepMsg() {
    $("#fdate").val(getNowFormatDate(2));
    tapEvent();
    upload();
    var xml = `<?xml version= "1.0" ?>
                  <Requests>
                      <Params>
                      <Method>GetFormPostData</Method>
                      <ProcessName>洁丽康公司客户申请</ProcessName>
                      <ProcessVersion>${version}</ProcessVersion>
                      <Owner></Owner>
                      </Params>   
                  </Requests>
              `;
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
        $("#fname").val(item.填写人);
        $("#fxsybm").val(item.销售员编码);
        $("#fxsymc").val(item.销售员名称);


    }).fail(function (e) {

    }).then(function () {
        initCodeMsg();
    });

}

function tapEvent() {

    var fqdlxdata = [
        {
            value: '',
            text:'直销公立医院'
        },
        {
            value: '',
            text:'直销公立医院托管'
        },
        {
            value: '',
            text:'直销民营客户'
        },
        {
            value: '',
            text:'经销商'
        },
        {
            value: '',
            text:'加工厂'
        }
    ];
    var element = document.getElementById('fqdlx');

    var picker = new mui.PopPicker();

    picker.setData(fqdlxdata);

    element.addEventListener('tap', function () {

        picker.show(function (items) {

            element.value = items[0].text;

            switch (items[0].text) {

                case '直销公立医院':
                    $("#fkhfl,#fjgdm,#fswdjh,#fcws").removeAttr('readonly');
                    break;
                case '直销公立医院托管':
                    $("#fkhfl,#fjgdm,#fswdjh,#fcws").removeAttr('readonly');
                    break;
                case '直销民营客户':
                    $("#fkhfl,#fjgdm,#fswdjh,#fcws").removeAttr('readonly');
                    break;
                case '经销商':
                    $("#fkhfl,#fjgdm,#fswdjh,#ffrdb").removeAttr('readonly');
                    break;
                case '加工厂':
                    break;
                default:
                    break;

            }
        });

    }, false);

    var ffplxdata = [
        {
            value: '',
            text:'增值税发票'
        },
        {
            value: '',
            text:'普通发票'
        }

    ];
    showPicker('ffplx', ffplxdata);

    var fsldata = [
      
        {
            value: '',
            text:'16.00'
        }
    ];
    showPicker('fsl', fsldata);

    var fkhfldata = [
        {
            value: '',
            text:'三甲'
        },
        {
            value: '',
            text:'三乙'
        },
        {
            value: '',
            text:'三级其他'
        },
        {
            value: '',
            text:'二甲'
        },
        {
            value: '',
            text:'二乙'
        },
        {
            value: '',
            text:'二级其他'
        },
        {
            value: '',
            text:'一级'
        },
        {
            value: '',
            text:'其他'
        }
    ];

    showPicker('fkhfl', fkhfldata);

    $(".mui-icon-left-nav").on('tap', function () {
        $("#wrapper").show();
        $("#selector").hide();

    });

    $("#fbmbm,#fbmmc").on('tap', () => {
        $("#wrapper").hide();
        $("#selector").show();
    });


}

function prepIndexedList() {

    var header = document.querySelector('header.mui-bar');
    var list = document.querySelector('#list');
    var done = document.querySelector('#done');
    //计算高度 
    list.style.height = (document.body.offsetHeight - header.offsetHeight) + 'px';
    //create
    window.indexedList = new mui.IndexedList(list);

    done.addEventListener('tap', function () {
        var checkboxArray = [].slice.call(list.querySelectorAll('input[type="radio"]'));
        var checkedValues = [];
        var checkedObjs = [];
        checkboxArray.forEach(function (box) {
            if (box.checked) {
                checkedValues.push(box.parentNode.innerText);
                var cobj = {
                    fxszzbm: $(box).data('fxszzbm'),
                    fxszzmc: $(box).data('fxszzmc')
                };
                checkedObjs.push(cobj);
                //console.log(checkedObjs);
                //取消选中，防止再次进入列表中会选中某一项
                box.checked = !box.checked;

            }
        });
        if (checkedValues.length > 0) {
            $("#fbmbm").val(checkedObjs[checkedObjs.length - 1].fxszzbm);
            $("#fbmmc").val(checkedObjs[checkedObjs.length - 1].fxszzmc);

            $("#selector").hide();
            $("#wrapper").show();

        } else {

        }


    }, false);

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


function initCodeMsg() {

    var fno = $("#fxsybm").val();
    if (fno == '00078251') {
        fno = '00073091';
    }
    var xml = `<?xml version= "1.0" ?>
                    <Requests>
                      <Params>
                       <DataSource>BPM_WEGO2018</DataSource>
                       <ID>erpcloud_查询eas洁丽康公司销售员视图</ID>
                       <Type>1</Type>
                       <Method>GetUserDataProcedure</Method>
                       <ProcedureName>erpcloud_查询eas洁丽康公司销售员视图</ProcedureName>
                       <Filter><fno>${fno}</fno></Filter>
                     </Params>
                   </Requests>
              `;
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

        var item = provideData.Tables[0].Rows;
        console.log(item);
        var li = ``;
        for (var i = 0; i < item.length; i++) {
            li += `<li data-value="" data-tags="" class="mui-table-view-cell mui-indexed-list-item mui-radio mui-left">
                       <input type="radio" name="checkbox" 
                          data-fxszzbm="${item[i].销售组织编码}"  data-fxszzmc="${item[i].销售组织名称}"
                        />${item[i].销售组织名称}||${item[i].销售组织编码}
                    </li>`;

        }
        $("#datalist").append(li);
    }).fail(function (e) {

    }).then(function () {
        prepIndexedList();
    });
}

var fjArray2 = [];
function initData(data, flag) {

    var item = data.FormDataSet.洁丽康公司_客户申请_主表[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.fbillno);
    }
    $("#fname").val(item.填写人);
    $("#fdate").val(FormatterTimeYMS(item.填写日期));
    $("#fqdlx").val(item.渠道类型);
    $("#fkhmc").val(item.客户名称);
    $("#fkhbm").val(item.客户编码);
    $("#fkhfl").val(item.客户分类);
    $("#fjgdm").val(item.组织机构代码);
    $("#fswdjh").val(item.税务登记号);
    $("#ffrdb").val(item.法人代表);
    $("#ffplx").val(item.开票类型);
    $("#fsl").val(item.税率);
    $("#fcws").val(item.床位数);
    $("#fdz").val(item.地址);
    $("#fbmbm").val(item.部门编码);
    $("#fbmmc").val(item.部门名称);
    $("#fxsybm").val(item.销售员编码);
    $("#fxsymc").val(item.销售员名称);
    $("#fzzbm").val(item.财务组织编码);
    $("#fzzmc").val(item.财务组织名称);
    $("#fif_kp").val(item.是否需要开票);

    if (item.附件) {
        var fjtmp = (String)(item.附件);
        fjArray = fjtmp.split(";");
        $.ajax({
            type: 'POST',
            url: '/api/bpm/GetAttachmentsInfo',
            data: { 'fileIds': fjArray },
            beforeSend: function (XHR) {
                XHR.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem('ticket'));
            }
        }).done((data) => {

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
                if (String(navigator.userAgent).match('cloudhub') != null) {
                    window.open(attachArray[$(this)[0].id].downurl);
                }
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



        }).fail((e) => {
            console.log(e);
        });
    }


    if (item.开票信息附件) {
        var fjtmp = (String)(item.开票信息附件);
        fjArray2 = fjtmp.split(";");
        $.ajax({
            type: 'POST',
            url: '/api/bpm/GetAttachmentsInfo',
            data: { 'fileIds': fjArray },
            beforeSend: function (XHR) {
                XHR.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem('ticket'));
            }
        }).done((data) => {

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
                    li = li + '    <div class="img-wrap smallimg imgdiv2" id="' + i + '" ><img src="' + baseDownloadUrl + data[i].FileID + '"/></div>';

                } else if ((data[i].Ext).indexOf("xls") != -1) {

                    li = li + '    <div class="img-wrap smallimg imgdiv2" id="' + i + '"><img src="../../Content/images/xlsx@2x.png"/></div>';

                } else if ((data[i].Ext).indexOf("doc") != -1) {

                    li = li + '    <div class="img-wrap smallimg imgdiv2" id="' + i + '"><img src="../../Content/images/docx@2x.png"/></div>';

                } else if ((data[i].Ext).indexOf("ppt") != -1) {

                    li = li + '    <div class="img-wrap smallimg imgdiv2" id="' + i + '"><img src="../../Content/images/ppt@2x.png"/></div>';

                } else if ((data[i].Ext).indexOf("pdf") != -1) {

                    li = li + '    <div class="img-wrap smallimg imgdiv2" id="' + i + '"><img src="../../Content/images/pdf@2x.png"/></div>';

                } else if ((data[i].Ext).indexOf("zip") != -1 || (data[i].Ext).indexOf("rar") != -1 || (data[i].Ext).indexOf("7z") != -1) {

                    li = li + '    <div class="img-wrap smallimg imgdiv2" id="' + i + '"><img src="../../Content/images/zip@2x.png"/></div>';

                } else if ((data[i].Ext).indexOf("txt") != -1) {

                    li = li + '    <div class="img-wrap smallimg imgdiv2" id="' + i + '"><img src="../../Content/images/txt@2x.png"/></div>';

                } else {
                    li = li + '    <div class="img-wrap smallimg imgdiv2" id="' + i + '"><img src="../../Content/images/unkown@2x.png"/></div>';
                }

                li = li + ' </div>';
                li = li + '</div>';
                $(".upload-img-list2").append(li);


                $(".imgdiv2").each(function () {

                    $(this).parent().find(".del.none").hide();

                });




            }
            watch();
            $(".imgdiv2").on('tap', function () {
                console.log($(this)[0].id);
                if (String(navigator.userAgent).match('cloudhub') != null) {
                    window.open(attachArray[$(this)[0].id].downurl);
                }
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



        }).fail((e) => {
            console.log(e);
        });

    }




}

function nodeControllerExp(NodeName) {

    if (String(NodeName).match('开始') != null) {
        tapEvent();
        initCodeMsg();
        upload();
        $(".upload-addbtn").show();

    } else if (String(NodeName).match('销售部') != null) {
        $("#fkhbm").removeAttr('readonly');

    }

}
function checkNes() {

    var NodeName = $("#nodeName").val();
    if (NodeName == '销售部') {
        if (!$("#fkhbm").val()) {
            mui.toast('请填写客户编码');
            return false;
        }
    }
    return true;

}

function Save() {
    var fname = $("#fname").val();
    var fdate = $("#fdate").val();
    var fqdlx = $("#fqdlx").val();
    var fkhmc = $("#fkhmc").val();
    var fkhbm = $("#fkhbm").val();
    var fkhfl = $("#fkhfl").val();
    var fjgdm = $("#fjgdm").val();
    var fswdjh = $("#fswdjh").val();
    var ffrdb = $("#ffrdb").val();
    var ffplx = $("#ffplx").val();
    var fsl = $("#fsl").val();
    var fcws = $("#fcws").val();
    var fdz = $("#fdz").val();
    var fbmbm = $("#fbmbm").val();
    var fbmmc = $("#fbmmc").val();
    var fxsybm = $("#fxsybm").val();
    var fxsymc = $("#fxsymc").val();
    var fzzbm = $("#fzzbm").val();
    var fzzmc = $("#fzzmc").val();
    var fif_kp = $("#fif_kp").val();
    if (!fdz) {
        mui.toast('请填写地址');
        return;
    }


    if (!fqdlx) {
        mui.toast('请选择渠道类型');
        return;
    }
    if (!fkhmc) {
        mui.toast('请填写客户名称');
        return;
    }
    

    switch (fqdlx) {
        case '直销公立医院':
            if (!fkhfl) {
                mui.toast('请选择客户分类');
                return;
            }
            if (!fjgdm) {
                mui.toast('请填写组织机构代码');
                return;
            }
            if (!fswdjh) {
                mui.toast('请填写税务登记号');
                return;
            }
            if (!fcws) {
                mui.toast('请填写床位数');
                return;
            }

            break;
        case '直销公立医院托管':
            if (!fkhfl) {
                mui.toast('请选择客户分类');
                return;
            }
            if (!fjgdm) {
                mui.toast('请填写组织机构代码');
                return;
            }
            if (!fswdjh) {
                mui.toast('请填写税务登记号');
                return;
            }
            if (!fcws) {
                mui.toast('请填写床位数');
                return;
            }

            break;
        case '直销民营客户':
            if (!fkhfl) {
                mui.toast('请选择客户分类');
                return;
            }
            if (!fjgdm) {
                mui.toast('请填写组织机构代码');
                return;
            }
            if (!fswdjh) {
                mui.toast('请填写税务登记号');
                return;
            }
            if (!fcws) {
                mui.toast('请填写床位数');
                return;
            }

            break;
        case '经销商':
            if (!fkhfl) {
                mui.toast('请选择客户分类');
                return;
            }
            if (!fjgdm) {
                mui.toast('请填写组织机构代码');
                return;
            }
            if (!fswdjh) {
                mui.toast('请填写税务登记号');
                return;
            }
            if (!ffrdb) {
                mui.toast('请填写法人代表');
                return;
            }
            break;
        case '加工厂':
            break;
        default:
            break;
    }
    if (!ffplx) {
        mui.toast('请选择发票类型');
        return;
    }
    if (!fsl) {
        mui.toast('请选择税率');
        return;
    }

    var btnArry = ["取消", "确定"];
    mui.confirm('即将提交，是否确定？', '提交确认提醒', btnArry, function (e) {
        if (e.index == 1) {
            var xml = `<?xml version="1.0"?>
                        <XForm>
                            <Header>
                                <Method>Post</Method>
                                <ProcessName>洁丽康公司客户申请</ProcessName>
                                <ProcessVersion>${version}</ProcessVersion>
                                <DraftGuid></DraftGuid>
                                <OwnerMemberFullName>${BPMOU}</OwnerMemberFullName>
                                <Action>提交</Action>
                                <Comment></Comment>
                                <UrlParams></UrlParams>
                                <ConsignEnabled>false</ConsignEnabled>
                                <ConsignUsers>[]</ConsignUsers>
                                <ConsignRoutingType>Parallel</ConsignRoutingType>
                                <ConsignReturnType>Return</ConsignReturnType>
                                <InviteIndicateUsers>[]</InviteIndicateUsers>
                                <Context>{&quot;Routing&quot;:{}}</Context>
                            </Header>
                           <FormData>
                       `;
            xml += `
                       <洁丽康公司_客户申请_主表>
                            <单号>自动生成</单号>
                            <填写人>${fname}</填写人>
                            <填写日期>${fdate}</填写日期>
                            <渠道类型>${fqdlx}</渠道类型>
                            <客户名称>${fkhmc}</客户名称>
                            <客户编码>${fkhbm}</客户编码>
                            <客户分类>${fkhfl}</客户分类>
                            <组织机构代码>${fjgdm}</组织机构代码>
                            <税务登记号>${fswdjh}</税务登记号>
                            <法人代表>${ffrdb}</法人代表>
                            <开票类型>${ffplx}</开票类型>
                            <税率>${fsl}</税率>
                            <床位数>${fcws}</床位数>
                            <地址>${fdz}</地址>
                            <附件>${fjArray.join(";")}</附件>
             <是否需要开票>${fif_kp}</是否需要开票>
            <开票信息附件>${fjArray2.join(";")}</开票信息附件>
                            <部门编码>${fbmbm}</部门编码>
                            <部门名称>${fbmmc}</部门名称>
                            <销售员编码>${fxsybm}</销售员编码>
                            <销售员名称>${fxsymc}</销售员名称>
                        </洁丽康公司_客户申请_主表>
                    `;
            xml += `
                       </FormData>
                    </XForm>
                   `;
            PostXml(xml);
        }
    });

}

function reSave() {

    var fbillno = $("#fbillno").val();
    var pid = $("#stepId").val();

    var fname = $("#fname").val();
    var fdate = $("#fdate").val();
    var fqdlx = $("#fqdlx").val();
    var fkhmc = $("#fkhmc").val();
    var fkhbm = $("#fkhbm").val();
    var fkhfl = $("#fkhfl").val();
    var fjgdm = $("#fjgdm").val();
    var fswdjh = $("#fswdjh").val();
    var ffrdb = $("#ffrdb").val();
    var ffplx = $("#ffplx").val();
    var fsl = $("#fsl").val();
    var fcws = $("#fcws").val();
    var fdz = $("#fdz").val();
    var fbmbm = $("#fbmbm").val();
    var fbmmc = $("#fbmmc").val();
    var fxsybm = $("#fxsybm").val();
    var fxsymc = $("#fxsymc").val();
    var fzzbm = $("#fzzbm").val();
    var fzzmc = $("#fzzmc").val();
    var fif_kp = $("#fif_kp").val();
    if (!fqdlx) {
        mui.toast('请选择渠道类型');
        return;
    }
    if (!fkhmc) {
        mui.toast('请填写客户名称');
        return;
    }


    switch (fqdlx) {
        case '直销公立医院':
            if (!fkhfl) {
                mui.toast('请选择客户分类');
                return;
            }
            if (!fjgdm) {
                mui.toast('请填写组织机构代码');
                return;
            }
            if (!fswdjh) {
                mui.toast('请填写税务登记号');
                return;
            }
            if (!fcws) {
                mui.toast('请填写床位数');
                return;
            }

            break;
        case '直销公立医院托管':
            if (!fkhfl) {
                mui.toast('请选择客户分类');
                return;
            }
            if (!fjgdm) {
                mui.toast('请填写组织机构代码');
                return;
            }
            if (!fswdjh) {
                mui.toast('请填写税务登记号');
                return;
            }
            if (!fcws) {
                mui.toast('请填写床位数');
                return;
            }

            break;
        case '直销民营客户':
            if (!fkhfl) {
                mui.toast('请选择客户分类');
                return;
            }
            if (!fjgdm) {
                mui.toast('请填写组织机构代码');
                return;
            }
            if (!fswdjh) {
                mui.toast('请填写税务登记号');
                return;
            }
            if (!fcws) {
                mui.toast('请填写床位数');
                return;
            }

            break;
        case '经销商':
            if (!fkhfl) {
                mui.toast('请选择客户分类');
                return;
            }
            if (!fjgdm) {
                mui.toast('请填写组织机构代码');
                return;
            }
            if (!fswdjh) {
                mui.toast('请填写税务登记号');
                return;
            }
            if (!ffrdb) {
                mui.toast('请填写法人代表');
                return;
            }
            break;
        case '加工厂':
            break;
        default:
            break;
    }
    if (!ffplx) {
        mui.toast('请选择发票类型');
        return;
    }
    if (!fsl) {
        mui.toast('请选择税率');
        return;
    }

    var btnArry = ["取消", "确定"];
    mui.confirm('即将提交，是否确定？', '提交确认提醒', btnArry, function (e) {
        if (e.index == 1) {
            var xml = `<?xml version="1.0"?>
                         <XForm>
                           <Header>
                             <Method>Process</Method>
                             <PID>${pid}</PID>
                             <Action>提交</Action>
                              <Comment></Comment>
                             <InviteIndicateUsers></InviteIndicateUsers>
                           </Header>
                           <FormData>
                       `;
            xml += `
                       <洁丽康公司_客户申请_主表>
                            <单号>${fbillno}</单号>
                            <填写人>${fname}</填写人>
                            <填写日期>${fdate}</填写日期>
                            <渠道类型>${fqdlx}</渠道类型>
                            <客户名称>${fkhmc}</客户名称>
                            <客户编码>${fkhbm}</客户编码>
                            <客户分类>${fkhfl}</客户分类>
                            <组织机构代码>${fjgdm}</组织机构代码>
                            <税务登记号>${fswdjh}</税务登记号>
                            <法人代表>${ffrdb}</法人代表>
                            <开票类型>${ffplx}</开票类型>
                            <税率>${fsl}</税率>
                            <床位数>${fcws}</床位数>
                            <地址>${fdz}</地址>
                            <附件>${fjArray.join(";")}</附件>
    <是否需要开票>${fif_kp}</是否需要开票>
            <开票信息附件>${fjArray2.join(";")}</开票信息附件>
                            <部门编码>${fbmbm}</部门编码>
                            <部门名称>${fbmmc}</部门名称>
                            <销售员编码>${fxsybm}</销售员编码>
                            <销售员名称>${fxsymc}</销售员名称>
                        </洁丽康公司_客户申请_主表>
                    `;
            xml += `
                       </FormData>
                    </XForm>
                   `;
            PostXml(xml);
        }
    });
}

function hasRead() {
    var pid = $("#stepId").val();
    var fbillno = $("#fbillno").val();
    var comment = '';
    var btnArray = ['取消', '确定'];
    mui.prompt('请选填知会意见', '可以不填', '知会意见', btnArray, function (e) {
        if (e.index == 1) {
            comment = e.value;
            var xml = `<?xml version="1.0"?>
                           <XForm>
                             <Header>
                               <Method>InformSubmit</Method>
                               <PID>${pid}</PID>
                               <Comment>${comment}</Comment>
                             </Header>
                           </XForm>
              `;
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
    var fqdlx = $("#fqdlx").val();
    var fkhmc = $("#fkhmc").val();
    var fkhbm = $("#fkhbm").val();
    var fkhfl = $("#fkhfl").val();
    var fjgdm = $("#fjgdm").val();
    var fswdjh = $("#fswdjh").val();
    var ffrdb = $("#ffrdb").val();
    var ffplx = $("#ffplx").val();
    var fsl = $("#fsl").val();
    var fcws = $("#fcws").val();
    var fdz = $("#fdz").val();
    var fbmbm = $("#fbmbm").val();
    var fbmmc = $("#fbmmc").val();
    var fxsybm = $("#fxsybm").val();
    var fxsymc = $("#fxsymc").val();
    var fzzbm = $("#fzzbm").val();
    var fzzmc = $("#fzzmc").val();
    var fif_kp = $("#fif_kp").val();
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
            var xml = `<?xml version="1.0"?>
                     <XForm>
                     <Header>
                     <Method>Process</Method>
                     <PID>${pid}</PID>
                     <Action>同意</Action>
                     <Comment>${comment}</Comment>
            
                     <ConsignEnabled>true</ConsignEnabled>
                     <ConsignUsers>${consignUserStr}</ConsignUsers>
                     <ConsignRoutingType>${consignRoutingType}</ConsignRoutingType>
                     <ConsignReturnType>${consignReturnType}</ConsignReturnType>
                     <InviteIndicateUsers>[]</InviteIndicateUsers>
                     <Context>{&quot;Routing&quot;:{}}</Context>
                     </Header>
                     <FormData>`;
            xml += `
                       <洁丽康公司_客户申请_主表>
                            <单号>${fbillno}</单号>
                            <填写人>${fname}</填写人>
                            <填写日期>${fdate}</填写日期>
                            <渠道类型>${fqdlx}</渠道类型>
                            <客户名称>${fkhmc}</客户名称>
                            <客户编码>${fkhbm}</客户编码>
                            <客户分类>${fkhfl}</客户分类>
                            <组织机构代码>${fjgdm}</组织机构代码>
                            <税务登记号>${fswdjh}</税务登记号>
                            <法人代表>${ffrdb}</法人代表>
                            <开票类型>${ffplx}</开票类型>
                            <税率>${fsl}</税率>
                            <床位数>${fcws}</床位数>
                            <地址>${fdz}</地址>
                            <附件>${fjArray.join(";")}</附件>
    <是否需要开票>${fif_kp}</是否需要开票>
            <开票信息附件>${fjArray2.join(";")}</开票信息附件>
                            <部门编码>${fbmbm}</部门编码>
                            <部门名称>${fbmmc}</部门名称>
                            <销售员编码>${fxsybm}</销售员编码>
                            <销售员名称>${fxsymc}</销售员名称>
                        </洁丽康公司_客户申请_主表>
                    `;
            xml += `
                       </FormData>
                    </XForm>
                   `;
            PostXml(xml);

        })
    } else {
        var xml = `<?xml version="1.0"?>
                   <XForm>
                   <Header>
                   <Method>Process</Method>
                   <PID>${pid}</PID>
                   <Action>同意</Action>
                   <Comment>${comment}</Comment>

                    <UrlParams></UrlParams>
                    <ConsignEnabled>false</ConsignEnabled>
                    <ConsignUsers>[]</ConsignUsers>
                    <ConsignRoutingType>Parallel</ConsignRoutingType>
                    <ConsignReturnType>Return</ConsignReturnType>

                  <InviteIndicateUsers>[]</InviteIndicateUsers>
                  <Context>{&quot;Routing&quot;:{}}</Context>
                  </Header>
                  <FormData>`;
        xml += `
                       <洁丽康公司_客户申请_主表>
                            <单号>${fbillno}</单号>
                            <填写人>${fname}</填写人>
                            <填写日期>${fdate}</填写日期>
                            <渠道类型>${fqdlx}</渠道类型>
                            <客户名称>${fkhmc}</客户名称>
                            <客户编码>${fkhbm}</客户编码>
                            <客户分类>${fkhfl}</客户分类>
                            <组织机构代码>${fjgdm}</组织机构代码>
                            <税务登记号>${fswdjh}</税务登记号>
                            <法人代表>${ffrdb}</法人代表>
                            <开票类型>${ffplx}</开票类型>
                            <税率>${fsl}</税率>
                            <床位数>${fcws}</床位数>
                            <地址>${fdz}</地址>
                            <附件>${fjArray.join(";")}</附件>
    <是否需要开票>${fif_kp}</是否需要开票>
            <开票信息附件>${fjArray2.join(";")}</开票信息附件>
                            <部门编码>${fbmbm}</部门编码>
                            <部门名称>${fbmmc}</部门名称>
                            <销售员编码>${fxsybm}</销售员编码>
                            <销售员名称>${fxsymc}</销售员名称>
                        </洁丽康公司_客户申请_主表>
                    `;
        xml += `
                       </FormData>
                    </XForm>
                   `;
        PostXml(xml);
    }

}