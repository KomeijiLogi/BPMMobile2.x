function prepMsg() {

    uploadOpt();
  
    $("#fbxrq").val(getNowFormatDate(2));
    var xml = `<?xml version= "1.0" ?>
                  <Requests>
                      <Params>
                      <Method>GetFormPostData</Method>
                      <ProcessName>洁丽康公司差旅费报销</ProcessName>
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
        $("#fbxr").val(item.报销人);
        $("#fbxrbm").val(item.报销人部门);
        $("#fbxrno").val(item.报销人工号);
       
    }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
        if (XMLHttpRequest.status == "401") {
            mui.alert('授权过期，请重新打开页面');;
        } else if (XMLHttpRequest.status == "500") {
            mui.alert('服务器内部错误');
            }
        }).then(() => {
            searchCard();
        });
}


function tapEvent() {

    var optDate = { "type": "date" };
    var pickerDate = new mui.DtPicker(optDate);

    $("#ffyqj_ks,#ffyqj_js").on('tap', function () {
        var _self = this;
        pickerDate.show(function (items) {
            $(_self).val(items.text);
        });
    });

    $("#tjmx_mx").on('tap', function () {

        var li = `
               <div id="mx">
                    <div class="mui-input-row itemtitle">
                        <label>明细列表项</label>
                        <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>
                    </div>
                    <div class="mui-row cutOffLine padding">
                        <div class="mui-col-xs-6" style="display:flex;">
                            <label>出发日期<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fcfrq" readonly placeholder="请选择"></textarea>
                        </div>
                        <div class="mui-col-xs-6" style="display:flex;">
                            <label>到达日期<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fddrq" readonly placeholder="请选择"></textarea>
                        </div>
                    </div>
                    <div class="mui-row cutOffLine padding">
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>出发地<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fcfd_pro" readonly placeholder="请选择"></textarea>
                        </div>
                        <div class="mui-col-xs-3" style="display:flex;">
                            <textarea rows="2" id="fcfd_city" placeholder="请填写"></textarea>
                        </div>
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>目的地<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fmdd_pro" readonly placeholder="请选择"></textarea>
                        </div>
                        <div class="mui-col-xs-3" style="display:flex;">
                            <textarea rows="2" id="fmdd_city" placeholder="请填写"></textarea>
                        </div>
                    </div>
                    <div class="mui-row cutOffLine padding">
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>出差人数<i style="color:red;">*</i></label>
                            <input type="number" id="fccrs" placeholder="请填写" style="padding-left:0;" />
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>交通工具<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fjtgj" readonly placeholder="请选择"></textarea>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>车船费<i style="color:red;">*</i></label>
                            <input type="number" id="fccf" placeholder="请填写" style="padding-left:0;" />
                        </div>
                    </div>

                    <div class="mui-row cutOffLine padding">
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>住宿费/天数<i style="color:red;">*</i></label>
                            <input type="number" id="fts_zsf" placeholder="请填写" style="padding-left:0;" />
                        </div>
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>住宿费/金额<i style="color:red;">*</i></label>
                            <input type="number" id="fje_zsf" placeholder="请填写" style="padding-left:0;" />
                        </div>
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>餐费/天数<i style="color:red;">*</i></label>
                            <input type="number" id="fts_cf" placeholder="请填写" style="padding-left:0;" />
                        </div>
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>餐费/金额<i style="color:red;">*</i></label>
                            <input type="number" id="fje_cf" placeholder="请填写" style="padding-left:0;" />
                        </div>
                    </div>
                    <div class="mui-row cutOffLine padding">
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>市内交通费/天数<i style="color:red;">*</i></label>
                            <input type="number" id="fts_snjtf" placeholder="请填写" style="padding-left:0;" />
                        </div>
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>市内交通费/金额<i style="color:red;">*</i></label>
                            <input type="number" id="fje_snjtf" placeholder="请填写" style="padding-left:0;" />
                        </div>
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>其他费用/项目<i style="color:red;">*</i></label>
                            <input type="number" id="fts_qt" placeholder="请填写" style="padding-left:0;" />
                        </div>
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>其他费用/金额<i style="color:red;">*</i></label>
                            <input type="number" id="fje_qt" placeholder="请填写" style="padding-left:0;" />
                        </div>
                    </div>
                </div>
                 `;
        $("#mxlist_mx").append(li);
    });

    $("#tjmx_hz").on('tap', function () {
        var li = `
                  <div id="mx">
                    <div class="mui-input-row itemtitle">
                        <label>明细列表项</label>
                        <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>
                    </div>
                    <div class="mui-row cutOffLine padding">
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>费用项目<i style="color:red;">*</i></label>
                            <textarea rows="2" id="ffyxm" placeholder="请填写"></textarea>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>金额<i style="color:red;">*</i></label>
                            <input type="number" id="fje" placeholder="请填写" style="padding-left:0;" />
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>财务核定金额<i style="color:red;">*</i></label>
                            <input type="number" id="fhdje" readonly style="padding-left:0;" />
                        </div>
                    </div>
                    <div class="mui-row cutOffLine padding">
                        <div class="mui-col-xs-12" style="display:flex;">
                            <label>费用事由<i style="color:red;">*</i></label>
                            <textarea rows="2" id="ffysy" placeholder="请填写"></textarea>
                        </div>
                    </div>
                </div>
                 `;
        $("#mxlist_hz").append(li);
    });

    $("#fsqdh").on('tap', function () {
        $("#wrapper").hide();
        $("#selector").show();
        var header = document.querySelector('header.mui-bar');
        var list = document.querySelector('#list');
        var done = document.querySelector('#done');
        //计算高度 
        list.style.height = (document.body.offsetHeight - header.offsetHeight) + 'px';
        //create
        window.indexedList = new mui.IndexedList(list);
    });
    $(".mui-icon-left-nav").on('tap', function () {
        $("#wrapper").show();
        $("#selector").hide();

    });

    var optDate2 = {
        "value": "2016-10-10 10:10", "beginYear": new Date().getFullYear(), "endYear": new Date().getFullYear()+3
    }
    var pickerDate2 = new mui.DtPicker(optDate2);
    $("#mxlist_mx").on('tap', '#fcfrq', function () {
        var _self = this;
        pickerDate2.show(function (items) {
            $(_self).val(items.text);
        });
    });
    $("#mxlist_mx").on('tap', '#fddrq', function () {
        var _self = this;
        pickerDate2.show(function (items) {
            $(_self).val(items.text);
        });
    });

    searchPro();


    var fjtgj_data = [
        {
            value: '',
            text:'飞机'
        },
        {
            value: '',
            text:'火车'
        },
        {
            value: "",
            text:'长途汽车'
        },
        {
            value: '',
            text:'轮船'
        }
    ];
    var pickerTraffic = new mui.PopPicker();
    pickerTraffic.setData(fjtgj_data);
    $("#mxlist_mx").on('tap', '#fjtgj', function () {
        var _self = this;
        pickerTraffic.show(function (items) {
            $(_self).val(items[0].text);
        });
    });
    $("#mxlist_mx").on('input', 'input[type="number"]', function () {
        calcT_Mx();
    });

    $("#mxlist_hz").on('input', 'input[type="number"]', function () {
        calcT_Hj();
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
                    fdh: $(box).data('sqdh'),
                    ftid: $(box).data('tid'),
                    fjkje: $(box).data('jkje')
                };
                checkedObjs.push(cobj);
                //console.log(checkedObjs);
                //取消选中，防止再次进入列表中会选中某一项
                box.checked = !box.checked;

            }
        });
        if (checkedValues.length > 0) {
            $("#fsqdh").val(checkedObjs[checkedObjs.length - 1].fdh);
            $("#fsqd_tid").val(checkedObjs[checkedObjs.length - 1].ftid);
            $("#fjkje").val(checkedObjs[checkedObjs.length - 1].fjkje);
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
    tapEvent();
}

function calcT_Mx() {
    var fhj = 0;
    $("#mxlist_mx").find("#mx").each(function () {
        var fccf = isNaN($(this).find("#fccf").val()) ? 0 : isNaN($(this).find("#fccf").val());
        var fje_zsf = isNaN($(this).find("#fje_zsf").val()) ? 0 : isNaN($(this).find("#fje_zsf").val());
        var fje_cf = isNaN($(this).find("#fje_cf").val()) ? 0 : isNaN($(this).find("#fje_cf").val());
        var fje_snjtf = isNaN($(this).find("#fje_snjtf").val()) ? 0 : isNaN($(this).find("#fje_snjtf").val());
        var fje_qt = isNaN($(this).find("#fje_qt").val()) ? 0 : isNaN($(this).find("#fje_qt").val());
        fhj = fccf + fje_zsf + fje_cf + fje_snjtf + fje_qt;
       
    });

    $("#fhj_mx").val(fhj);

}

function calcT_Hj() {
    var fhj = 0;
    $("#mxlist_hz").find('#mx').each(function () {
        var _self = this;
        var fje = isNaN($(_self).find("#fje").val()) ? 0 : isNaN($(_self).find("#fje").val());
        fhj += fje;
    });
    $("#fhj_hz").val(fhj);
    $("#fhj_dx_hz").val(atoc(fhj));

}

function calcT() {

    var fhj = 0;
    $("#mxlist_hz").find("#mx").each(function () {
        var fhdje = isNaN($(this).find("#fhdje").val()) ? 0 : isNaN($(this).find("#fhdje").val());
        fhj += fhdje;

    });
    $("#fhdhj_hz").val(fhj);
    $("#fhdhj_dx_hz").val(atoc(fhj));


}

function searchCard() {
    var fno = $("#fbxrno").val();
    var xml = `<?xml version= "1.0" ?>
                                 <Requests>
                                 <Params>
                                 <DataSource>BPM_WEGO2018</DataSource>
                                 <ID>erpcloud_查询洁丽康公司_差旅费申请_主表</ID>
                                 <Type>1</Type>
                                 <Method>GetUserDataProcedure</Method>
                                 <ProcedureName>erpcloud_查询洁丽康公司_差旅费申请_主表</ProcedureName>
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
        var data = provideData.Tables[0].Rows;
        console.log(data);
        data = data.filter((val, i, arr) => {
            
            if (val.报销状态 == 1) {
                return val;
            }
        });
        console.log(data);

        for (var i = 0; i < data.length; i++) {
            var li = `
                     <li class="mui-table-view-cell mui-indexed-list-item mui-radio mui-left"> 
                         <input type="radio" name="radio"
                                data-sqdh="${data[i].单号}" data-tid="${data[i].TaskID}"
                                data-jkje="${data[i].借款金额}"
                                /> ${data[i].单号}|借款金额:${data[i].借款金额}
                     </li>      
                     `;
            $("#datalist").append(li);
        }

        }).fail(function (e) {
            console.log(e);
    }).then(() => {
        prepIndexedList();

    });

}

function searchPro() {
    var xml = `<?xml version= "1.0" ?>
                                 <Requests>
                                 <Params>
                                 <DataSource>BPM_EXPENSE</DataSource>
                                 <ID>erpcloud_查询省份</ID>
                                 <Type>1</Type>
                                 <Method>GetUserDataProcedure</Method>
                                 <ProcedureName>erpcloud_查询省份</ProcedureName>
                                 <Filter></Filter>
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
        var pDatas = provideData.Tables[0].Rows;
        var proArr = [];
        for (var i = 0; i < pDatas.length; i++) {
            var obj = {
                value: pDatas[i].provinceid,
                text: pDatas[i].provincename
            }
            proArr.push(obj);
        }

        var picker_pro = new mui.PopPicker();
        picker_pro.setData(proArr);
        $("#mxlist_mx").on('tap', '#fcfd_pro', function () {
            var _self = this;
            picker_pro.show(function (items) {
                $(_self).val(items[0].text);
            });
        });
        $("#mxlist_mx").on('tap', '#fmdd_pro', function () {
            var _self = this;
            picker_pro.show(function (items) {
                $(_self).val(items[0].text);
            });
        });
    }).fail(function (e) {
        console.log(e);
    });
}


function deleteItem(context) {
    var btnArray = ['否', '是'];
    mui.confirm('确认删除？', '', btnArray, function (e) {
        if (e.index == 1) {
            $(context).parent().parent().remove();
            calcT_Mx();
            calcT_Hj();
        }
    });
}

var itemidArr1 = [];
var itemidArr2 = [];
function initData(data, flag) {
    var item = data.FormDataSet.洁丽康公司_差旅费报销_主表[0];

    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.单号);
    }
    $("#fbxr").val(item.报销人);
    $("#fbxrbm").val(item.报销人部门);
    $("#fbxrq").val(FormatterTimeYMS(item.报销日期));
    $("#fsqdh").val(item.差旅费支出计划申请单号);
    $("#fsqd_tid").val(item.差旅费支出计划申请);
    $("#fjkje").val(item.借款金额);
    $("#ffyqj_ks").val(FormatterTimeYMS(item.费用区间开始日期));
    $("#ffyqj_js").val(FormatterTimeYMS(item.费用区间结束日期));
    if (item.出差报告 != null && item.出差报告 != "") {
        var fjtmp = (String)(item.出差报告);

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

    $("#fbz").val(item.备注);
    $("#fhj_mx").val(item.合计金额);
    $("#fdjs").val(item.附件单据数);
    $("#fhj_hz").val(item.合计金额_报销汇总);
    $("#fhj_dx_hz").val(item.合计金额大写);
    $("#fhdhj_hz").val(item.合计金额_财务核定);
    $("#fhdhj_dx_hz").val(item.合计金额大写_财务核定);
    $("#fbxrno").val(item.报销人工号);
    $("#fbmjl").val(item.部门经理);
    $("#ffgld").val(item.分管领导);
    $("#fcwshr").val(item.财务审核人);
    $("#fspr").val(item.审批人);
    $("#fbxrzw").val(item.报销人职位);
    $("#ps").val(item.PS职位);
    var item_c1 = data.FormDataSet.洁丽康公司_差旅费报销_子表1;
    for (var i = 0; i < item_c1.length; i++) {
        itemidArr1.push(item_c1[i].itemid);
        var li = `
                <div id="mx">
                    <div class="mui-input-row itemtitle">
                        <label>明细列表项</label>
                        <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>
                    </div>
                    <div class="mui-row cutOffLine padding">
                        <div class="mui-col-xs-6" style="display:flex;">
                            <label>出发日期<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fcfrq" readonly >${FormatterTimeYMS(item_c1[i].出发日期)}</textarea>
                        </div>
                        <div class="mui-col-xs-6" style="display:flex;">
                            <label>到达日期<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fddrq" readonly >${FormatterTimeYMS(item_c1[i].到达日期)}</textarea>
                        </div>
                    </div>
                    <div class="mui-row cutOffLine padding">
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>出发地<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fcfd_pro" readonly >${item_c1[i].出发地省份}</textarea>
                        </div>
                        <div class="mui-col-xs-3" style="display:flex;">
                            <textarea rows="2" id="fcfd_city" readonly>${item_c1[i].出发地城市}</textarea>
                        </div>
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>目的地<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fmdd_pro" readonly >${item_c1[i].目的地省份}</textarea>
                        </div>
                        <div class="mui-col-xs-3" style="display:flex;">
                            <textarea rows="2" id="fmdd_city" >${item_c1[i].目的地城市}</textarea>
                        </div>
                    </div>
                    <div class="mui-row cutOffLine padding">
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>出差人数<i style="color:red;">*</i></label>
                            <input type="number" id="fccrs" readonly style="padding-left:0;" value="${item_c1[i].出差人数}"/>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>交通工具<i style="color:red;">*</i></label>
                            <textarea rows="2" id="fjtgj" readonly >${item_c1[i].交通工具}</textarea>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>车船费<i style="color:red;">*</i></label>
                            <input type="number" id="fccf" readonly style="padding-left:0;" value="${item_c1[i].车船费}" />
                        </div>
                    </div>

                    <div class="mui-row cutOffLine padding">
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>住宿费/天数<i style="color:red;">*</i></label>
                            <input type="number" id="fts_zsf" readonly style="padding-left:0;" value="${item_c1[i].天数_住宿费}"/>
                        </div>
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>住宿费/金额<i style="color:red;">*</i></label>
                            <input type="number" id="fje_zsf" readonly style="padding-left:0;" value="${item_c1[i].金额_住宿费}"/>
                        </div>
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>餐费/天数<i style="color:red;">*</i></label>
                            <input type="number" id="fts_cf" readonly style="padding-left:0;" value="${item_c1[i].天数_餐费}"/>
                        </div>
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>餐费/金额<i style="color:red;">*</i></label>
                            <input type="number" id="fje_cf" readonly style="padding-left:0;" value="${item_c1[i].金额_餐费}"/>
                        </div>
                    </div>
                    <div class="mui-row cutOffLine padding">
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>市内交通费/天数<i style="color:red;">*</i></label>
                            <input type="number" id="fts_snjtf" readonly style="padding-left:0;" value="${item_c1[i].天数_市内交通费}"/>
                        </div>
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>市内交通费/金额<i style="color:red;">*</i></label>
                            <input type="number" id="fje_snjtf" readonly style="padding-left:0;" value="${item_c1[i].金额_市内交通费}"/>
                        </div>
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>其他费用/项目<i style="color:red;">*</i></label>
                            <input type="number" id="fts_qt" readonly style="padding-left:0;" value="${item_c1[i].项目_其他费用}"/>
                        </div>
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>其他费用/金额<i style="color:red;">*</i></label>
                            <input type="number" id="fje_qt" readonly style="padding-left:0;" value="${item_c1[i].金额_其他费用}"/>
                        </div>
                    </div>
                </div>
                 `;
        $("#mxlist_mx").append(li);
    }
    var item_c2 = data.FormDataSet.洁丽康公司_差旅费报销_子表2;
    for (var i = 0; i < item_c2.length; i++) {
        itemidArr2.push(item_c2[i].itemid);
        var li = `
              <div id="mx">
                    <div class="mui-input-row itemtitle">
                        <label>明细列表项</label>
                        <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>
                    </div>
                    <div class="mui-row cutOffLine padding">
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>费用项目<i style="color:red;">*</i></label>
                            <textarea rows="2" id="ffyxm" readonly>${item_c2[i].费用项目}</textarea>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>金额<i style="color:red;">*</i></label>
                            <input type="number" id="fje" readonly style="padding-left:0;"  value="${item_c2[i].金额}"/>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>财务核定金额<i style="color:red;">*</i></label>
                            <input type="number" id="fhdje" readonly style="padding-left:0;" value="${item_c2[i].财务核定金额}"/>
                        </div>
                    </div>
                    <div class="mui-row cutOffLine padding">
                        <div class="mui-col-xs-12" style="display:flex;">
                            <label>费用事由<i style="color:red;">*</i></label>
                            <textarea rows="2" id="ffysy" readonly>${item_c2[i].费用事由}</textarea>
                        </div>
                    </div>
                </div>
                   `;
        $("#mxlist_hz").append(li);

    }
}

function nodeControllerExp(NodeName) {
    if (String(NodeName).match('开始') != null) {
        searchCard();
        $('.can-edit').removeAttr('readonly');
        $("#mxlist_mx,#mxlist_hz").find('span').each(function () {
            $(this).show();
        });
        $("#mxlist_mx").find("#mx").each(function () {
            $(this).find("#fcfd_city","#fmdd_city","#fccrs","#fccf",
                "#fts_zsf", "#fje_zsf", "#fts_cf", "#fje_cf",
                "#fts_snjtf", "#fje_snjtf", "#fts_qt", "#fje_qt"
            ).removeAttr('readonly');
        });

        $("#mxlist_hz").find("#mx").each(function () {
            $(this).find("#ffyxm", "#fje","#ffysy"
            ).removeAttr('readonly');
        });

    } else if (String(NodeName).match('财务部审核岗') != null) {
        calcT();
        $("#mxlist_hz").find("#mx").each(function () {
            $(this).find("#fhdje"
            ).removeAttr('readonly');
        });
    }
}
function checkNes() {
    var nodeName = $("#nodeName").val();
    var fal = false;
    if (nodeName == '财务审核岗') {
        $("#mxlist_mx").find("#mx").each(function () {
            var value = $(this).find("#fhdje").val();
            if (!value) {
                mui.toast('请填写财务核定金额');
                return !fal;
            }
        });
        if (fal) {
            return false;
        }
    }
    return true;
}

class Mx_mx {

    constructor(fcfrq, fddrq, fcfd_pro, fcfd_city, fmdd_pro, fmdd_city, fccrs, fjtgj, fccf,
        fts_zsf, fje_zsf, fts_cf, fje_cf, fts_snjtf, fje_snjtf, fts_qt, fje_qt
    ) {
        this.fcfrq = fcfrq;
        this.fddrq = fddrq;
        this.fcfd_pro = fcfd_pro;
        this.fcfd_city = fcfd_city;
        this.fmdd_pro = fmdd_pro;
        this.fmdd_city = fmdd_city;
        this.fccrs = fccrs;
        this.fjtgj = fjtgj;
        this.fccf = fccf;
        this.fts_zsf = fts_zsf;
        this.fje_zsf = fje_zsf;
        this.fts_cf = fts_cf;
        this.fje_cf = fje_cf;
        this.fts_snjtf = fts_snjtf;
        this.fje_snjtf = fje_snjtf;
        this.fts_qt = fts_qt;
        this.fje_qt = fje_qt;
    }
    check() {
        if (!this.fcfrq) {
            mui.toast('请选择出发日期');
            return true;
        }
        if (!this.fddrq) {
            mui.toast('请选择到达日期');
            return true;
        }
        if (!this.fcfd_pro) {
            mui.toast('请选择出发地省份');
            return true;
        }
        if (!this.fcfd_city) {
            mui.toast('请选择出发地城市');
            return true;
        }
        if (!this.fmdd_pro) {
            mui.toast('请选择目的地省份');
            return true;
        }
        if (!this.fmdd_city) {
            mui.toast('请选择目的地城市');
            return true;
        }
        if (!this.fccrs) {
            mui.toast('请选择目的地城市');
            return true;
        }
        if (!this.fjtgj) {
            mui.toast('请选择交通工具');
            return true;
        }
        if (!this.fccf) {
            mui.toast('请填写车船费');
            return true;
        }
        if (!this.fts_zsf) {
            mui.toast('请填写住宿费/天数');
            return true;
        }
        if (!this.fje_zsf) {
            mui.toast('请填写住宿费/金额');
            return true;
        }
        if (!this.fts_cf) {
            mui.toast('请填写餐费/天数');
            return true;
        }
        if (!this.fje_cf) {
            mui.toast('请填写餐费/金额');
            return true;
        }
        if (!this.fts_snjtf) {
            mui.toast('请填写市内交通费/天数');
            return true;
        }
        if (!this.fje_snjtf) {
            mui.toast('请填写市内交通费/金额');
            return true;
        }
        if (!this.fts_qt) {
            mui.toast('请填写其他费用/项目');
            return true;
        }
        if (!this.fje_qt) {
            mui.toast('请填写其他费用/金额');
            return true;
        }
        return false;
    }
}

class Mx_hz {
    constructor(ffyxm, fje, fhdje, ffysy) {
        this.ffyxm = ffyxm;
        this.fje = fje;
        this.fhdje = fhdje;
        this.ffysy = ffysy;
    }
    check() {
        if (!this.ffyxm) {
            mui.toast('请填写费用项目');
            return true;
        }
        if (!this.fje) {
            mui.toast('请填写金额');
            return true;
        }
        if (!this.ffysy) {
            mui.toast('请填写费用事由');
            return true;
        }
        return false;
    }
}

function Save() {
    var fbxr = $("#fbxr").val();
    var fbxrbm = $("#fbxrbm").val();
    var fbxrq = $("#fbxrq").val();
    var fsqdh = $("#fsqdh").val();
    var fsqd_tid = $("#fsqd_tid").val();
    var fjkje = $("#fjkje").val();
    var ffyqj_ks = $("#ffyqj_ks").val();
    var ffyqj_js = $("#ffyqj_js").val();
    var fbz = $("#fbz").val();
    var fhj_mx = $("#fhj_mx").val();
    var fdjs = $("#fdjs").val();
    var fhj_hz = $("#fhj_hz").val();
    var fhj_dx_hz = $("#fhj_dx_hz").val();
    var fhdhj_hz = $("#fhdhj_hz").val();
    var fhdhj_dx_hz = $("#fhdhj_dx_hz").val();
    var fbxrno = $("#fbxrno").val();
    var fbmjl = $("#fbmjl").val();
    var ffgld = $("#ffgld").val();
    var fcwshr = $("#fcwshr").val();
    var fspr = $("#fspr").val();
    var fbxrzw = $("#fbxrzw").val();
    var ps = $("#ps").val();

    if (!fsqdh) {
        mui.toast('请选择申请单');
        return;
    }
    if (!ffyqj_ks) {
        mui.toast('请选择费用开始期间');
        return;
    }
    if (!ffyqj_js) {
        mui.toast('请选择费用结束期间');
        return;
    }
    if (!fdjs) {
        mui.toast('请填写单据数');
        return;
    }
    if (fhj_hz != fhj_mx) {
        mui.toast('汇总与明细金额不一致!');
        return;
    }

    var mxflag = false;
    var mxlistArr1 = [];
    $("#mxlist_mx").find("#mx").each(function () {
        var fcfrq = $(this).find("#fcfrq").val();
        var fddrq = $(this).find("#fddrq").val();
        var fcfd_pro = $(this).find("#fcfd_pro").val();
        var fcfd_city = $(this).find("#fcfd_city").val();
        var fmdd_pro = $(this).find("#fmdd_pro").val();
        var fmdd_pro = $(this).find("#fmdd_pro").val();
        var fmdd_city = $(this).find("#fmdd_city").val();
        var fccrs = $(this).find("#fccrs").val();
        var fjtgj = $(this).find("#fjtgj").val();
        var fccf = $(this).find("#fccf").val();
        var fts_zsf = $(this).find("#fts_zsf").val();
        var fje_zsf = $(this).find("#fje_zsf").val();
        var fts_cf = $(this).find("#fts_cf").val();
        var fje_cf = $(this).find("#fje_cf").val();
        var fts_snjtf = $(this).find("#fts_snjtf").val();
        var fje_snjtf = $(this).find("#fje_snjtf").val();
        var fts_qt = $(this).find("#fts_qt").val();
        var fje_qt = $(this).find("#fje_qt").val();

        var mx = new Mx_mx(fcfrq, fddrq, fcfd_pro, fcfd_city, fmdd_pro, fmdd_city, fccrs, fjtgj, fccf,
            fts_zsf, fje_zsf, fts_cf, fje_cf, fts_snjtf, fje_snjtf, fts_qt, fje_qt
        );
        if (mx.check()) {
            mxflag = true;
            return;
        }
        mxlistArr1.push(mx);
    });

    var mxlistArr2 = [];
    $("#mxlist_hz").find("#mx").each(function () {

        var ffyxm = $(this).find("#ffyxm").val();
        var fje = $(this).find("#fje").val();
        var fhdje = $(this).find("#fhdje").val();
        var ffysy = $(this).find("#ffysy").val();


        var mx = new Mx_hz(ffyxm, fje, fhdje, ffysy);
        if (mx.check()) {
            mxflag = true;
            return;
        }
        mxlistArr2.push(mx);
    });

    if (mxflag) {
        return;
    }
    var btnArry = ["取消", "确定"];
    mui.confirm('即将提交，是否确定？', '提交确认提醒', btnArry, function (e) {
        if (e.index == 1) {
            var xml = `<?xml version="1.0"?>
                        <XForm>
                            <Header>
                                <Method>Post</Method>
                                <ProcessName>洁丽康公司差旅费报销</ProcessName>
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
 <洁丽康公司_差旅费报销_主表>
            <单号>自动生成</单号>
            <报销人>${fbxr}</报销人>
            <报销人部门>${fbxrbm}</报销人部门>
            <报销日期>${fbxrq}</报销日期>
            <差旅费支出计划申请单号>${fsqdh}</差旅费支出计划申请单号>
            <差旅费支出计划申请>${fsqd_tid}</差旅费支出计划申请>
            <借款金额>${fjkje}</借款金额>
            <费用区间开始日期>${ffyqj_ks}</费用区间开始日期>
            <费用区间结束日期>${ffyqj_js}</费用区间结束日期>
            <出差报告>${fjArray.join(";")}</出差报告>
            <备注>${fbz}</备注>
            <合计金额>${fhj_mx}</合计金额>
            <附件单据数>${fdjs}</附件单据数>
            <合计金额_报销汇总>${fhj_hz}</合计金额_报销汇总>
            <合计金额大写>${fhj_dx_hz}</合计金额大写>
            <合计金额_财务核定>${fhdhj_hz}</合计金额_财务核定>
            <合计金额大写_财务核定>${fhdhj_dx_hz}</合计金额大写_财务核定>
            <TaskID></TaskID>
            <报销人工号>${fbxrno}</报销人工号>
            <部门经理></部门经理>
            <分管领导></分管领导>
            <财务审核人></财务审核人>
            <审批人></审批人>
            <报销人职位></报销人职位>
            <PS职位>软件开发工程师</PS职位>
        </洁丽康公司_差旅费报销_主表>
                     `;

            for (var i = 0; i < mxlistArr1.length; i++) {
                xml += `
 <洁丽康公司_差旅费报销_子表1>
            <RelationRowGuid>${i+1}</RelationRowGuid>
            <RowPrimaryKeys></RowPrimaryKeys>
            <出发日期>${mxlistArr1[i].fcfrq}</出发日期>
            <到达日期>${mxlistArr1[i].fddrq}</到达日期>
            <出发地省份>${mxlistArr1[i].fcfd_pro}</出发地省份>
            <出发地城市>${mxlistArr1[i].fcfd_city}</出发地城市>
            <目的地省份>${mxlistArr1[i].fmdd_pro}</目的地省份>
            <目的地城市>${mxlistArr1[i].fmdd_city}</目的地城市>
            <出差人数>${mxlistArr1[i].fccrs}</出差人数>
            <交通工具>${mxlistArr1[i].fjtgj}</交通工具>
            <车船费>${mxlistArr1[i].fccf}</车船费>
            <天数_住宿费>${mxlistArr1[i].fts_zsf}</天数_住宿费>
            <金额_住宿费>${mxlistArr1[i].fje_zsf}</金额_住宿费>
            <天数_餐费>${mxlistArr1[i].fts_cf}</天数_餐费>
            <金额_餐费>${mxlistArr1[i].fje_cf}</金额_餐费>
            <天数_市内交通费>${mxlistArr1[i].fts_snjtf}</天数_市内交通费>
            <金额_市内交通费>${mxlistArr1[i].fje_snjtf}</金额_市内交通费>
            <项目_其他费用>${mxlistArr1[i].fts_qt}</项目_其他费用>
            <金额_其他费用>${mxlistArr1[i].fje_qt}</金额_其他费用>
        </洁丽康公司_差旅费报销_子表1>

                 `;
            }
            for (var i = 0; i < mxlistArr2.length; i++) {
                xml += `
         <洁丽康公司_差旅费报销_子表2>
            <RelationRowGuid>${mxlistArr1.length+i+1}</RelationRowGuid>
            <RowPrimaryKeys></RowPrimaryKeys>
            <费用项目>${mxlistArr2[i].ffyxm}</费用项目>
            <金额>${mxlistArr2[i].fje}</金额>
            <财务核定金额>${mxlistArr2[i].fhdje}</财务核定金额>
            <费用事由>${mxlistArr2[i].ffysy}</费用事由>
        </洁丽康公司_差旅费报销_子表2>
                        `;
            }

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
    var fbxr = $("#fbxr").val();
    var fbxrbm = $("#fbxrbm").val();
    var fbxrq = $("#fbxrq").val();
    var fsqdh = $("#fsqdh").val();
    var fsqd_tid = $("#fsqd_tid").val();
    var fjkje = $("#fjkje").val();
    var ffyqj_ks = $("#ffyqj_ks").val();
    var ffyqj_js = $("#ffyqj_js").val();
    var fbz = $("#fbz").val();
    var fhj_mx = $("#fhj_mx").val();
    var fdjs = $("#fdjs").val();
    var fhj_hz = $("#fhj_hz").val();
    var fhj_dx_hz = $("#fhj_dx_hz").val();
    var fhdhj_hz = $("#fhdhj_hz").val();
    var fhdhj_dx_hz = $("#fhdhj_dx_hz").val();
    var fbxrno = $("#fbxrno").val();
    var fbmjl = $("#fbmjl").val();
    var ffgld = $("#ffgld").val();
    var fcwshr = $("#fcwshr").val();
    var fspr = $("#fspr").val();
    var fbxrzw = $("#fbxrzw").val();
    var ps = $("#ps").val();

    if (!fsqdh) {
        mui.toast('请选择申请单');
        return;
    }
    if (!ffyqj_ks) {
        mui.toast('请选择费用开始期间');
        return;
    }
    if (!ffyqj_js) {
        mui.toast('请选择费用结束期间');
        return;
    }
    if (!fdjs) {
        mui.toast('请填写单据数');
        return;
    }

    if (fhj_hz != fhj_mx) {
        mui.toast('汇总与明细金额不一致!');
        return;
    }
    var mxflag = false;
    var mxlistArr1 = [];
    $("#mxlist_mx").find("#mx").each(function () {
        var fcfrq = $(this).find("#fcfrq").val();
        var fddrq = $(this).find("#fddrq").val();
        var fcfd_pro = $(this).find("#fcfd_pro").val();
        var fcfd_city = $(this).find("#fcfd_city").val();
        var fmdd_pro = $(this).find("#fmdd_pro").val();
        var fmdd_pro = $(this).find("#fmdd_pro").val();
        var fmdd_city = $(this).find("#fmdd_city").val();
        var fccrs = $(this).find("#fccrs").val();
        var fjtgj = $(this).find("#fjtgj").val();
        var fccf = $(this).find("#fccf").val();
        var fts_zsf = $(this).find("#fts_zsf").val();
        var fje_zsf = $(this).find("#fje_zsf").val();
        var fts_cf = $(this).find("#fts_cf").val();
        var fje_cf = $(this).find("#fje_cf").val();
        var fts_snjtf = $(this).find("#fts_snjtf").val();
        var fje_snjtf = $(this).find("#fje_snjtf").val();
        var fts_qt = $(this).find("#fts_qt").val();
        var fje_qt = $(this).find("#fje_qt").val();

        var mx = new Mx_mx(fcfrq, fddrq, fcfd_pro, fcfd_city, fmdd_pro, fmdd_city, fccrs, fjtgj, fccf,
            fts_zsf, fje_zsf, fts_cf, fje_cf, fts_snjtf, fje_snjtf, fts_qt, fje_qt
        );
        if (mx.check()) {
            mxflag = true;
            return;
        }
        mxlistArr1.push(mx);
    });

    var mxlistArr2 = [];
    $("#mxlist_hz").find("#mx").each(function () {

        var ffyxm = $(this).find("#ffyxm").val();
        var fje = $(this).find("#fje").val();
        var fhdje = $(this).find("#fhdje").val();
        var ffysy = $(this).find("#ffysy").val();


        var mx = new Mx_hz(ffyxm, fje, fhdje, ffysy);
        if (mx.check()) {
            mxflag = true;
            return;
        }
        mxlistArr2.push(mx);
    });

    if (mxflag) {
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
 <洁丽康公司_差旅费报销_主表>
            <单号>${fbillno}</单号>
            <报销人>${fbxr}</报销人>
            <报销人部门>${fbxrbm}</报销人部门>
            <报销日期>${fbxrq}</报销日期>
            <差旅费支出计划申请单号>${fsqdh}</差旅费支出计划申请单号>
            <差旅费支出计划申请>${fsqd_tid}</差旅费支出计划申请>
            <借款金额>${fjkje}</借款金额>
            <费用区间开始日期>${ffyqj_ks}</费用区间开始日期>
            <费用区间结束日期>${ffyqj_js}</费用区间结束日期>
            <出差报告>${fjArray.join(";")}</出差报告>
            <备注>${fbz}</备注>
            <合计金额>${fhj_mx}</合计金额>
            <附件单据数>${fdjs}</附件单据数>
            <合计金额_报销汇总>${fhj_hz}</合计金额_报销汇总>
            <合计金额大写>${fhj_dx_hz}</合计金额大写>
            <合计金额_财务核定>${fhdhj_hz}</合计金额_财务核定>
            <合计金额大写_财务核定>${fhdhj_dx_hz}</合计金额大写_财务核定>
            <TaskID>${$("#taskId").val()}</TaskID>
            <报销人工号>${fbxrno}</报销人工号>
            <部门经理>${fbmjl}</部门经理>
            <分管领导>${ffgld}</分管领导>
            <财务审核人>${fcwshr}</财务审核人>
            <审批人>${fspr}</审批人>
            <报销人职位>${fbxrzw}</报销人职位>
            <PS职位>${ps}</PS职位>
        </洁丽康公司_差旅费报销_主表>
                     `;

            for (var i = 0; i < mxlistArr1.length; i++) {
                xml += `
 <洁丽康公司_差旅费报销_子表1>
            <RelationRowGuid>${i + 1}</RelationRowGuid>
            <RowPrimaryKeys></RowPrimaryKeys>
            <出发日期>${mxlistArr1[i].fcfrq}</出发日期>
            <到达日期>${mxlistArr1[i].fddrq}</到达日期>
            <出发地省份>${mxlistArr1[i].fcfd_pro}</出发地省份>
            <出发地城市>${mxlistArr1[i].fcfd_city}</出发地城市>
            <目的地省份>${mxlistArr1[i].fmdd_pro}</目的地省份>
            <目的地城市>${mxlistArr1[i].fmdd_city}</目的地城市>
            <出差人数>${mxlistArr1[i].fccrs}</出差人数>
            <交通工具>${mxlistArr1[i].fjtgj}</交通工具>
            <车船费>${mxlistArr1[i].fccf}</车船费>
            <天数_住宿费>${mxlistArr1[i].fts_zsf}</天数_住宿费>
            <金额_住宿费>${mxlistArr1[i].fje_zsf}</金额_住宿费>
            <天数_餐费>${mxlistArr1[i].fts_cf}</天数_餐费>
            <金额_餐费>${mxlistArr1[i].fje_cf}</金额_餐费>
            <天数_市内交通费>${mxlistArr1[i].fts_snjtf}</天数_市内交通费>
            <金额_市内交通费>${mxlistArr1[i].fje_snjtf}</金额_市内交通费>
            <项目_其他费用>${mxlistArr1[i].fts_qt}</项目_其他费用>
            <金额_其他费用>${mxlistArr1[i].fje_qt}</金额_其他费用>
        </洁丽康公司_差旅费报销_子表1>

                 `;
            }
            for (var i = 0; i < mxlistArr2.length; i++) {
                xml += `
         <洁丽康公司_差旅费报销_子表2>
            <RelationRowGuid>${mxlistArr1.length + i + 1}</RelationRowGuid>
            <RowPrimaryKeys></RowPrimaryKeys>
            <费用项目>${mxlistArr2[i].ffyxm}</费用项目>
            <金额>${mxlistArr2[i].fje}</金额>
            <财务核定金额>${mxlistArr2[i].fhdje}</财务核定金额>
            <费用事由>${mxlistArr2[i].ffysy}</费用事由>
        </洁丽康公司_差旅费报销_子表2>
                        `;
            }

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

    var fbxr = $("#fbxr").val();
    var fbxrbm = $("#fbxrbm").val();
    var fbxrq = $("#fbxrq").val();
    var fsqdh = $("#fsqdh").val();
    var fsqd_tid = $("#fsqd_tid").val();
    var fjkje = $("#fjkje").val();
    var ffyqj_ks = $("#ffyqj_ks").val();
    var ffyqj_js = $("#ffyqj_js").val();
    var fbz = $("#fbz").val();
    var fhj_mx = $("#fhj_mx").val();
    var fdjs = $("#fdjs").val();
    var fhj_hz = $("#fhj_hz").val();
    var fhj_dx_hz = $("#fhj_dx_hz").val();
    var fhdhj_hz = $("#fhdhj_hz").val();
    var fhdhj_dx_hz = $("#fhdhj_dx_hz").val();
    var fbxrno = $("#fbxrno").val();
    var fbmjl = $("#fbmjl").val();
    var ffgld = $("#ffgld").val();
    var fcwshr = $("#fcwshr").val();
    var fspr = $("#fspr").val();
    var fbxrzw = $("#fbxrzw").val();
    var ps = $("#ps").val();

  


    var mxflag = false;
    var mxlistArr1 = [];
    $("#mxlist_mx").find("#mx").each(function () {
        var fcfrq = $(this).find("#fcfrq").val();
        var fddrq = $(this).find("#fddrq").val();
        var fcfd_pro = $(this).find("#fcfd_pro").val();
        var fcfd_city = $(this).find("#fcfd_city").val();
        var fmdd_pro = $(this).find("#fmdd_pro").val();
        var fmdd_pro = $(this).find("#fmdd_pro").val();
        var fmdd_city = $(this).find("#fmdd_city").val();
        var fccrs = $(this).find("#fccrs").val();
        var fjtgj = $(this).find("#fjtgj").val();
        var fccf = $(this).find("#fccf").val();
        var fts_zsf = $(this).find("#fts_zsf").val();
        var fje_zsf = $(this).find("#fje_zsf").val();
        var fts_cf = $(this).find("#fts_cf").val();
        var fje_cf = $(this).find("#fje_cf").val();
        var fts_snjtf = $(this).find("#fts_snjtf").val();
        var fje_snjtf = $(this).find("#fje_snjtf").val();
        var fts_qt = $(this).find("#fts_qt").val();
        var fje_qt = $(this).find("#fje_qt").val();

        var mx = new Mx_mx(fcfrq, fddrq, fcfd_pro, fcfd_city, fmdd_pro, fmdd_city, fccrs, fjtgj, fccf,
            fts_zsf, fje_zsf, fts_cf, fje_cf, fts_snjtf, fje_snjtf, fts_qt, fje_qt
        );
       
        mxlistArr1.push(mx);
    });

    var mxlistArr2 = [];
    $("#mxlist_hz").find("#mx").each(function () {

        var ffyxm = $(this).find("#ffyxm").val();
        var fje = $(this).find("#fje").val();
        var fhdje = $(this).find("#fhdje").val();
        var ffysy = $(this).find("#ffysy").val();


        var mx = new Mx_hz(ffyxm, fje, fhdje, ffysy);
        
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
 <洁丽康公司_差旅费报销_主表>
            <单号>${fbillno}</单号>
            <报销人>${fbxr}</报销人>
            <报销人部门>${fbxrbm}</报销人部门>
            <报销日期>${fbxrq}</报销日期>
            <差旅费支出计划申请单号>${fsqdh}</差旅费支出计划申请单号>
            <差旅费支出计划申请>${fsqd_tid}</差旅费支出计划申请>
            <借款金额>${fjkje}</借款金额>
            <费用区间开始日期>${ffyqj_ks}</费用区间开始日期>
            <费用区间结束日期>${ffyqj_js}</费用区间结束日期>
            <出差报告>${fjArray.join(";")}</出差报告>
            <备注>${fbz}</备注>
            <合计金额>${fhj_mx}</合计金额>
            <附件单据数>${fdjs}</附件单据数>
            <合计金额_报销汇总>${fhj_hz}</合计金额_报销汇总>
            <合计金额大写>${fhj_dx_hz}</合计金额大写>
            <合计金额_财务核定>${fhdhj_hz}</合计金额_财务核定>
            <合计金额大写_财务核定>${fhdhj_dx_hz}</合计金额大写_财务核定>
            <TaskID>${$("#taskId").val()}</TaskID>
            <报销人工号>${fbxrno}</报销人工号>
            <部门经理>${fbmjl}</部门经理>
            <分管领导>${ffgld}</分管领导>
            <财务审核人>${fcwshr}</财务审核人>
            <审批人>${fspr}</审批人>
            <报销人职位>${fbxrzw}</报销人职位>
            <PS职位>${ps}</PS职位>
        </洁丽康公司_差旅费报销_主表>
                     `;

            for (var i = 0; i < mxlistArr1.length; i++) {
                xml += `
 <洁丽康公司_差旅费报销_子表1>
            <RelationRowGuid>${i + 1}</RelationRowGuid>
            <RowPrimaryKeys>itemid=${itemidArr1[i]}</RowPrimaryKeys>
            <出发日期>${mxlistArr1[i].fcfrq}</出发日期>
            <到达日期>${mxlistArr1[i].fddrq}</到达日期>
            <出发地省份>${mxlistArr1[i].fcfd_pro}</出发地省份>
            <出发地城市>${mxlistArr1[i].fcfd_city}</出发地城市>
            <目的地省份>${mxlistArr1[i].fmdd_pro}</目的地省份>
            <目的地城市>${mxlistArr1[i].fmdd_city}</目的地城市>
            <出差人数>${mxlistArr1[i].fccrs}</出差人数>
            <交通工具>${mxlistArr1[i].fjtgj}</交通工具>
            <车船费>${mxlistArr1[i].fccf}</车船费>
            <天数_住宿费>${mxlistArr1[i].fts_zsf}</天数_住宿费>
            <金额_住宿费>${mxlistArr1[i].fje_zsf}</金额_住宿费>
            <天数_餐费>${mxlistArr1[i].fts_cf}</天数_餐费>
            <金额_餐费>${mxlistArr1[i].fje_cf}</金额_餐费>
            <天数_市内交通费>${mxlistArr1[i].fts_snjtf}</天数_市内交通费>
            <金额_市内交通费>${mxlistArr1[i].fje_snjtf}</金额_市内交通费>
            <项目_其他费用>${mxlistArr1[i].fts_qt}</项目_其他费用>
            <金额_其他费用>${mxlistArr1[i].fje_qt}</金额_其他费用>
        </洁丽康公司_差旅费报销_子表1>

                 `;
            }
            for (var i = 0; i < mxlistArr2.length; i++) {
                xml += `
         <洁丽康公司_差旅费报销_子表2>
            <RelationRowGuid>${mxlistArr1.length + i + 1}</RelationRowGuid>
            <RowPrimaryKeys>itemid=${itemidArr2[i]}</RowPrimaryKeys>
            <费用项目>${mxlistArr2[i].ffyxm}</费用项目>
            <金额>${mxlistArr2[i].fje}</金额>
            <财务核定金额>${mxlistArr2[i].fhdje}</财务核定金额>
            <费用事由>${mxlistArr2[i].ffysy}</费用事由>
        </洁丽康公司_差旅费报销_子表2>
                        `;
            }

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
 <洁丽康公司_差旅费报销_主表>
            <单号>${fbillno}</单号>
            <报销人>${fbxr}</报销人>
            <报销人部门>${fbxrbm}</报销人部门>
            <报销日期>${fbxrq}</报销日期>
            <差旅费支出计划申请单号>${fsqdh}</差旅费支出计划申请单号>
            <差旅费支出计划申请>${fsqd_tid}</差旅费支出计划申请>
            <借款金额>${fjkje}</借款金额>
            <费用区间开始日期>${ffyqj_ks}</费用区间开始日期>
            <费用区间结束日期>${ffyqj_js}</费用区间结束日期>
            <出差报告>${fjArray.join(";")}</出差报告>
            <备注>${fbz}</备注>
            <合计金额>${fhj_mx}</合计金额>
            <附件单据数>${fdjs}</附件单据数>
            <合计金额_报销汇总>${fhj_hz}</合计金额_报销汇总>
            <合计金额大写>${fhj_dx_hz}</合计金额大写>
            <合计金额_财务核定>${fhdhj_hz}</合计金额_财务核定>
            <合计金额大写_财务核定>${fhdhj_dx_hz}</合计金额大写_财务核定>
            <TaskID>${$("#taskId").val()}</TaskID>
            <报销人工号>${fbxrno}</报销人工号>
            <部门经理>${fbmjl}</部门经理>
            <分管领导>${ffgld}</分管领导>
            <财务审核人>${fcwshr}</财务审核人>
            <审批人>${fspr}</审批人>
            <报销人职位>${fbxrzw}</报销人职位>
            <PS职位>${ps}</PS职位>
        </洁丽康公司_差旅费报销_主表>
                     `;

        for (var i = 0; i < mxlistArr1.length; i++) {
            xml += `
          <洁丽康公司_差旅费报销_子表1>
            <RelationRowGuid>${i + 1}</RelationRowGuid>
            <RowPrimaryKeys>itemid=${itemidArr1[i]}</RowPrimaryKeys>
            <出发日期>${mxlistArr1[i].fcfrq}</出发日期>
            <到达日期>${mxlistArr1[i].fddrq}</到达日期>
            <出发地省份>${mxlistArr1[i].fcfd_pro}</出发地省份>
            <出发地城市>${mxlistArr1[i].fcfd_city}</出发地城市>
            <目的地省份>${mxlistArr1[i].fmdd_pro}</目的地省份>
            <目的地城市>${mxlistArr1[i].fmdd_city}</目的地城市>
            <出差人数>${mxlistArr1[i].fccrs}</出差人数>
            <交通工具>${mxlistArr1[i].fjtgj}</交通工具>
            <车船费>${mxlistArr1[i].fccf}</车船费>
            <天数_住宿费>${mxlistArr1[i].fts_zsf}</天数_住宿费>
            <金额_住宿费>${mxlistArr1[i].fje_zsf}</金额_住宿费>
            <天数_餐费>${mxlistArr1[i].fts_cf}</天数_餐费>
            <金额_餐费>${mxlistArr1[i].fje_cf}</金额_餐费>
            <天数_市内交通费>${mxlistArr1[i].fts_snjtf}</天数_市内交通费>
            <金额_市内交通费>${mxlistArr1[i].fje_snjtf}</金额_市内交通费>
            <项目_其他费用>${mxlistArr1[i].fts_qt}</项目_其他费用>
            <金额_其他费用>${mxlistArr1[i].fje_qt}</金额_其他费用>
        </洁丽康公司_差旅费报销_子表1>
                 `;
        }
        for (var i = 0; i < mxlistArr2.length; i++) {
            xml += `
         <洁丽康公司_差旅费报销_子表2>
            <RelationRowGuid>${mxlistArr1.length + i + 1}</RelationRowGuid>
            <RowPrimaryKeys>itemid=${itemidArr2[i]}</RowPrimaryKeys>
            <费用项目>${mxlistArr2[i].ffyxm}</费用项目>
            <金额>${mxlistArr2[i].fje}</金额>
            <财务核定金额>${mxlistArr2[i].fhdje}</财务核定金额>
            <费用事由>${mxlistArr2[i].ffysy}</费用事由>
        </洁丽康公司_差旅费报销_子表2>
                        `;
        }

        xml += `
                       </FormData>
                    </XForm>
                   `;
        console.log(xml);
        PostXml(xml);
    }

}
