﻿function prepMsg() {
    $("#fdate").val(getNowFormatDate(2));
    tapEvent();
    var xml = '<?xml version= "1.0" ?>';
    xml = xml + '<Requests>';
    xml = xml + '    <Params>';
    xml = xml + '      <Method>GetFormPostData</Method>';
    xml = xml + '       <ProcessName>医用材料公司样品申请</ProcessName>';
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
        $("#fname").val(item.申请人);
        $("#fdept").val(item.所属部门区域);
        $("#fno").val(item.申请人编号);
    }).fail(function (e) {

    });
    initHeaderMsg.then(function () {
        initList();
    });
}

function tapEvent() {
    $('#tjmx').on('tap', function () {
        showCard();
    });

    var fsqrlbdata = [
        {
            value: '',
            text:'业务员'
        },
        {
            value: '',
            text: '非业务员'
        }
    ];
    showPicker('fsqrlb', fsqrlbdata);

    var fzyytdata = [
        {
            value: '',
            text: '学术会议',
            children:[]
        },
        {
            value: '',
            text: '新用户开发',
            children: [
                {
                    value: '',
                    text:'直销'
                },
                {
                    value: '',
                    text:'分销'
                }
            ]
        },
        {
            value: '',
            text: '其他',
            children:[]
        }
    ];
    var element = document.getElementById('fzyyt');
    var picker2 = new mui.PopPicker({
        layer: 2
    });
    picker2.setData(fzyytdata);
    
    var el2 = document.getElementById('fxyhkflx');
    element.addEventListener('tap', function () {

        picker2.show(function (items) {

            element.value = items[0].text;
            if (items[1].text){
                el2.value = items[1].text;
            }
           
            if (items[1].text == '直销') {
                $("#fzx").show();
            } else if (items[1].text=='分销') {
                $("#ffx").show();
            }
        });

    }, false);


}

var fifdata = [

    {
        value: '',
        text:'是'
    },
    {
        value: '',
        text: '否'
    }
];

function initList() {
    var xml = '<?xml version= "1.0" ?>';
    xml = xml + '      <Requests>';
    xml = xml + '     <Params>';
    xml = xml + '         <DataSource>BPM_WEGO</DataSource>';
    xml = xml + '         <ID>erpcloud_公用_医用材料样品基础数据</ID>';
    xml = xml + '         <Type>1</Type>';
    xml = xml + '        <Method>GetUserDataProcedure</Method>';
    xml = xml + '        <ProcedureName>erpcloud_公用_医用材料样品基础数据</ProcedureName>';
    xml = xml + '        <Filter>';
    xml = xml + '        </Filter>';
    xml = xml + '      </Params>';
    xml = xml + '   </Requests>';
    var initMainMsg = $.ajax({
        type: "POST",
        url: "/api/bpm/DataProvider",
        data: { '': xml },

        beforeSend: function (XHR) {
            XHR.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem('ticket'));
        }
    }).done(function (data) {

        var provideData = JSON.parse(unescape(data.replace(/\\(u[0-9a-fA-F]{4})/gm, '%$1')));
        console.log(provideData);
        var dataArr = provideData.Tables[0].Rows;
        for (var i = 0; i < dataArr.length; i++) {
            var li = '<li data-value="" data-tags="" class="mui-table-view-cell mui-indexed-list-item mui-radio mui-left">';
            li = li + '<input type="radio" name="radio"';
            li = li + 'data-fcpdm="' + dataArr[i].产品代码 + '"';
            li = li + 'data-fcpmc="' + dataArr[i].产品名称 + '"';
            li = li + 'data-fggxh="' + dataArr[i].规格型号 + '"';
            li = li + 'data-fdw="' + dataArr[i].单位 + '"';
            li = li + ' />代码|' + dataArr[i].产品代码 + '&nbsp|名称|' + dataArr[i].产品名称 + '&nbsp|规格|' + dataArr[i].规格型号 + '&nbsp|单位|' + dataArr[i].单位;
            li = li + '</li>';
            $("#cardlist").append(li);

        }
        var header = document.querySelector('header.mui-bar');
        var list = document.getElementById('list');
        var done = document.getElementById('done');
        //calc hieght
        list.style.height = (document.body.offsetHeight - header.offsetHeight) + 'px';
        //create
        window.indexedList = new mui.IndexedList(list);
        //done event
        done.addEventListener('tap', function () {
            var checkboxArray = [].slice.call(list.querySelectorAll('input[type="radio"]'));
            var checkedValues = [];
            var checkedElements = [];
            checkboxArray.forEach(function (box) {
                if (box.checked) {
                    checkedValues.push(box.parentNode.innerText);
                    var checkelement = ({
                        fcpdm: $(box).data('fcpdm'),
                        fcpmc: $(box).data('fcpmc'),
                        fggxh: $(box).data('fggxh'),
                        fdw: $(box).data('fdw')
                    });
                    checkedElements.push(checkelement);
                }
            });
            if (checkedValues.length > 0) {
                for (var i = 0; i < checkedElements.length; i++) {
                    //var li = '<div id="mx" class="mui-card">';
                    //li = li + '   <div class="mui-input-row itemtitle">';
                    //li = li + '      <label>明细列表项</label>';
                    //li = li + '      <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>';
                    //li = li + '   </div>';
                    //li = li + '   <div class="mui-input-row">';
                    //li = li + '       <label for="fcpdm">产品代码<i style="color:red;">*</i></label>';
                    //li = li + '       <input type="text" id="fcpdm" name="fcpdm" readonly="readonly" value="' + checkedElements[i].fcpdm + '"/>';
                    //li = li + '   </div>';
                    //li = li + '   <div class="mui-input-row">';
                    //li = li + '       <label for="fcpmc">产品名称</label>';
                    //li = li + '       <input type="text" id="fcpmc" name="fcpmc" readonly="readonly" value="' + checkedElements[i].fcpmc + '"/>';
                    //li = li + '   </div>';
                    //li = li + '   <div class="mui-input-row">';
                    //li = li + '       <label for="fggxh">规格型号</label>';
                    //li = li + '       <input type="text" id="fggxh" name="fggxh" readonly="readonly" value="' + checkedElements[i].fggxh + '"/>';
                    //li = li + '   </div>';
                    //li = li + '   <div class="mui-input-row">';
                    //li = li + '       <label for="fdw">单位</label>';
                    //li = li + '       <input type="text" id="fdw" name="fdw" readonly="readonly" value="' + checkedElements[i].fdw + '"/>';
                    //li = li + '   </div>';
                    //li = li + '   <div class="mui-input-row">';
                    //li = li + '       <label for="fsl">数量<i style="color:red;">*</i></label>';
                    //li = li + '       <input type="number" id="fsl" name="fsl" placeholder="请填写数量"/>';
                    //li = li + '   </div>';
                    //li = li + '   <div class="mui-input-row">';
                    //li = li + '       <label for="fif_mj">是否灭菌<i style="color:red;">*</i></label>';
                    //li = li + '       <input type="text" id="fif_mj" name="fif_mj" readonly="readonly" placeholder="请选择是否灭菌"/>';
                    //li = li + '   </div>';
                    //li = li + '   <div class="mui-input-row">';
                    //li = li + '       <label for="fyjxq_date">预计需求时间<i style="color:red;">*</i></label>';
                    //li = li + '       <input type="date" id="fyjxq_date" name="fyjxq_date" />';
                    //li = li + '   </div>';
                    //li = li + '   <div class="mui-input-row">';
                    //li = li + '        <label for="fbz">备注</label>';
                    //li = li + '        <input type="text" id="fbz" name="fbz" placeholder="请填写备注"/>';
                    //li = li + '   </div>';
                    //li = li + '</div>';
                    //$("#mxlist").append(li);

                    var li = `
                         <div id="mx" class="mui-card">
                             <div class="mui-input-row itemtitle">
                                 <label>明细列表项</label>
                                 <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>
                             </div>
                             <div class="mui-row cutOffLine">
                                 <div class="mui-col-xs-4" style="display:flex;">
                                     <label>产品代码</label> 
                                     <textarea id="fcpdm" name="fcpdm" readonly>${checkedElements[i].fcpdm}</textarea>
                                 </div> 
                                 <div class="mui-col-xs-4" style="display:flex;">
                                     <label>产品名称</label>
                                     <textarea id="fcpmc" name="fcpmc" readonly>${checkedElements[i].fcpmc}</textarea> 
                                 </div>
                                 <div class="mui-col-xs-4" style="display:flex;">
                                      <label>规格型号</label>
                                     <input type="text" id="fggxh" name="fggxh" readonly="readonly" value="${checkedElements[i].fggxh}"/>
                                 </div> 
                             </div>
                             <div class="mui-row cutOffLine">
                                   <div class="mui-col-xs-4" style="display:flex;">
                                       <label>单位</label>
                                       <input type="text" id="fdw" name="fdw" readonly="readonly" value="${checkedElements[i].fdw}"/>
                                   </div>
                                   <div class="mui-col-xs-4" style="display:flex;">
                                        <label>数量</label>
                                         <input type="number" id="fsl" name="fsl" placeholder="请填写数量"/>
                                   </div>
                                   <div class="mui-col-xs-4" style="display:flex;">
                                        <label>是否灭菌</label> 
                                        <input type="text" id="fif_mj" name="fif_mj" readonly="readonly" placeholder="请选择是否灭菌"/> 
                                   </div>
                             </div>  
                             <div class="mui-row cutOffLine">
                                  <div class="mui-col-xs-6" style="display:flex;">
                                      <label>预计需求时间</label>
                                      <input type="date" id="fyjxq_date" name="fyjxq_date" />
                                  </div>
                                  <div class="mui-col-xs-6" style="display:flex;">
                                       <label>备注</label> 
                                        <input type="text" id="fbz" name="fbz" placeholder="请填写备注"/>
                                  </div>
                             </div>
                         </div>
                    `;
                    $("#mxlist").append(li);
                    showPickerByZepto('#mxlist', '#fif_mj', fifdata);
                }

                hiddenCard();
                //document.getElementById('tjmx').scrollIntoView();
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
    }).fail(function (e) {

    });
}

function showCard() {
    $("#wrapper").css("display", "none");
    $("#search").css("display", "block");
    var header = document.querySelector('header.mui-bar');
    var list = document.getElementById('list');
    var done = document.getElementById('done');
    //calc hieght
    list.style.height = (document.body.offsetHeight - header.offsetHeight) + 'px';
    //create
    window.indexedList = new mui.IndexedList(list);
}
function hiddenCard() {
    $("#wrapper").css("display", "block");
    $("#search").css("display", "none");
}
function initData(data, flag) {
    var item = data.FormDataSet.医用材料公司_样品申请_主表[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.单号);
    }

    $("#fno").val(item.申请人编号);
    $("#fname").val(item.申请人);
    $("#fdept").val(item.所属部门区域);
    $("#fdate").val(FormatterTimeYMS(item.申请日期));
    $("#ftel").val(item.联系方式);
    $("#fsqrlb").val(item.申请人类别);
    $("#fkhmc").val(item.客户名称);
    $("#fyjdz").val(item.邮寄地址);
    $("#fsqsm").val(item.申请说明);
    $("#fzyyt").val(item.主要用途);
    $("#fxyhkflx").val(item.新用户开发类别);

    if (String(item.新用户开发类别).match('直销') != null) {
        $("#fzx").show();
        $("#fyyjb").val(item.医院级别);
        $("#fcws").val(item.床位数);
        $("#fmbks").val(item.目标科室);
        $("#fjpcj").val(item.竞品厂家);
        $("#fjpryj").val(item.竞品入院数);
        $("#fyyl").val(item.月用量);
    } else if (String(item.新用户开发类别).match('分销') != null) {
        $("#ffx").show();
        $("#fnsjxxe").val(item.年实际销售额);
        $("#fzyjjcp").val(item.主要经营产品);
        $("#fzyxsqy").val(item.主要销售区域);

    }

    var item_c = data.FormDataSet.医用材料公司_样品申请_子表;
    for (var i = 0; i < item_c.length; i++){
        itemidArr.push(item_c[i].itemid);
        //var li = '<div id="mx" class="mui-card">';
        //li = li + '   <div class="mui-input-row itemtitle">';
        //li = li + '      <label>明细列表项</label>';
        //li = li + '      <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>';
        //li = li + '   </div>';
        //li = li + '   <div class="mui-input-row">';
        //li = li + '       <label for="fcpdm">产品代码<i style="color:red;">*</i></label>';
        //li = li + '       <input type="text" id="fcpdm" name="fcpdm" readonly="readonly" value="' + item_c[i].产品代码 + '"/>';
        //li = li + '   </div>';
        //li = li + '   <div class="mui-input-row">';
        //li = li + '       <label for="fcpmc">产品名称</label>';
        //li = li + '       <input type="text" id="fcpmc" name="fcpmc" readonly="readonly" value="' + item_c[i].产品名称 + '"/>';
        //li = li + '   </div>';
        //li = li + '   <div class="mui-input-row">';
        //li = li + '       <label for="fggxh">规格型号</label>';
        //li = li + '       <input type="text" id="fggxh" name="fggxh" readonly="readonly" value="' + changeNullToEmpty( item_c[i].规格型号 )+ '"/>';
        //li = li + '   </div>';
        //li = li + '   <div class="mui-input-row">';
        //li = li + '       <label for="fdw">单位</label>';
        //li = li + '       <input type="text" id="fdw" name="fdw" readonly="readonly" value="' + item_c[i].单位 + '"/>';
        //li = li + '   </div>';
        //li = li + '   <div class="mui-input-row">';
        //li = li + '       <label for="fsl">数量<i style="color:red;">*</i></label>';
        //li = li + '       <input type="number" id="fsl" name="fsl" readonly="readonly" value="' + item_c[i].数量 + '"/>';
        //li = li + '   </div>';
        //li = li + '   <div class="mui-input-row">';
        //li = li + '       <label for="fif_mj">是否灭菌<i style="color:red;">*</i></label>';
        //li = li + '       <input type="text" id="fif_mj" name="fif_mj" readonly="readonly" value="' + item_c[i].是否灭菌 + '"/>';
        //li = li + '   </div>';
        //li = li + '   <div class="mui-input-row">';
        //li = li + '       <label for="fyjxq_date">预计需求时间<i style="color:red;">*</i></label>';
        //li = li + '       <input type="date" id="fyjxq_date" name="fyjxq_date" readonly="readonly" value="' + FormatterTimeYMS( item_c[i].预计需求时间) + '"/>';
        //li = li + '   </div>';
        //li = li + '   <div class="mui-input-row">';
        //li = li + '        <label for="fbz">备注</label>';
        //li = li + '        <input type="text" id="fbz" name="fbz" readonly="readonly" value="' + item_c[i].备注说明 + '"/>';
        //li = li + '   </div>';
        //li = li + '</div>';
        var li = `
                         <div id="mx" class="mui-card">
                             <div class="mui-input-row itemtitle">
                                 <label>明细列表项</label>
                                 <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>
                             </div>
                             <div class="mui-row cutOffLine">
                                 <div class="mui-col-xs-4" style="display:flex;">
                                     <label>产品代码</label> 
                                     <textarea id="fcpdm" name="fcpdm" readonly>${item_c[i].产品代码}</textarea>
                                 </div> 
                                 <div class="mui-col-xs-4" style="display:flex;">
                                     <label>产品名称</label>
                                     <textarea id="fcpmc" name="fcpmc" readonly>${item_c[i].产品名称}</textarea> 
                                 </div>
                                 <div class="mui-col-xs-4" style="display:flex;">
                                      <label>规格型号</label>
                                     <input type="text" id="fggxh" name="fggxh" readonly="readonly" value="${changeNullToEmpty(item_c[i].规格型号)}"/>
                                 </div> 
                             </div>
                             <div class="mui-row cutOffLine">
                                   <div class="mui-col-xs-4" style="display:flex;">
                                       <label>单位</label>
                                       <input type="text" id="fdw" name="fdw" readonly="readonly" value="${item_c[i].单位}"/>
                                   </div>
                                   <div class="mui-col-xs-4" style="display:flex;">
                                        <label>数量</label>
                                         <input type="number" id="fsl" name="fsl" readonly  value="${item_c[i].数量}"/>
                                   </div>
                                   <div class="mui-col-xs-4" style="display:flex;">
                                        <label>是否灭菌</label> 
                                        <input type="text" id="fif_mj" name="fif_mj" readonly="readonly" value="${item_c[i].是否灭菌}"/> 
                                   </div>
                             </div>  
                             <div class="mui-row cutOffLine">
                                  <div class="mui-col-xs-6" style="display:flex;">
                                      <label>预计需求时间</label>
                                      <input type="date" id="fyjxq_date" name="fyjxq_date" readonly="readonly" value="${FormatterTimeYMS(item_c[i].预计需求时间)}"/>
                                  </div>
                                  <div class="mui-col-xs-6" style="display:flex;">
                                       <label>备注</label> 
                                        <input type="text" id="fbz" name="fbz"  readonly="readonly" value="${item_c[i].备注说明}"/>
                                  </div>
                             </div>
                         </div>
                    `;
        $("#mxlist").append(li);

    }
}

function nodeControllerExp(NodeName) {
    if (NodeName == '开始') {
        initList();
        $("#mxlist").find('span').each(function () {
            $(this).css('display', 'block');
        });
        $('#tjmx').show();
        tapEvent();
        showPickerByZepto('#mxlist', '#fif_mj', fifdata);
        $("#mxlist").find("#fsl,#fyjxq_date,#fbz").each(function () {
            $(this).removeAttr('readonly');
        });
        $("#ftel,#fkhmc,#fyjdz,#fsqsm").removeAttr('readonly');
        $("#fyyjb,#fcws,#fmbks,#fjpcj,#fjpryj,#fyyl,#fnsjxxe,#fzyjjcp,#fzyxsqy").removeAttr('readonly');
    }
}
function mxItem(fcpdm, fcpmc, fggxh, fdw, fsl, fif_mj, fyjxq_date, fbz) {

    var mx = Object.create({
        fcpdm: fcpdm,
        fcpmc: fcpmc,
        fggxh: fggxh,
        fdw: fdw,
        fsl: fsl,
        fif_mj: fif_mj,
        fyjxq_date: fyjxq_date,
        fbz: fbz,
        _check: function () {
            if (!fsl){
                mui.toast('请填写数量');
                return null;
            }
            if (!fif_mj) {
                mui.toast('请选择是否灭菌');
                return null;
            }
            if (!fyjxq_date) {
                mui.toast('请选择预计需求时间');
                return null;
            }

            return mx;
        }
    });

    return mx._check();
}

function Save() {
    var fname = $("#fname").val();
    var fno = $("#fno").val();
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();
    var ftel = $("#ftel").val();
    var fsqrlb = $("#fsqrlb").val();
    var fkhmc = $("#fkhmc").val();
    var fyjdz = $("#fyjdz").val();
    var fsqsm = $("#fsqsm").val();

    var fzyyt = $("#fzyyt").val();
    var fxyhkflx = $("#fxyhkflx").val();
    var fyyjb = $("#fyyjb").val();
    var fcws = $("#fcws").val();
    var fmbks = $("#fmbks").val();
    var fjpcj = $("#fjpcj").val();
    var fjpryj = $("#fjpryj").val();
    var fyyl = $("#fyyl").val();

    var fnsjxxe = $("#fnsjxxe").val();
    var fzyjjcp = $("#fzyjjcp").val();
    var fzyxsqy = $("#fzyxsqy").val();


    if (!ftel) {
        mui.toast('请填写联系方式');
        return;
    }
    if (!fsqrlb) {
        mui.toast('请选择申请人类别');
        return;
    }
    if (!fkhmc){
        mui.toast('请填写客户名称');
        return;
    }
    if (!fyjdz) {
        mui.toast('请填写邮寄地址');
        return;
    }
    if (!fsqsm) {
        mui.toast('请填写申请说明');
        return;
    }
    if (!fzyyt) {
        mui.toast('请选择主要用途');
        return;
    }
    if (String(fzyyt).match('新用户') != null && (!fxyhkflx)) {
        mui.toast('请选择新用户开发类别');
        return;
    }
    if (String(fxyhkflx).match('直销') != null && String(fzyyt).match('新用户开发') != null) {
        if (!fyyjb) {
            mui.toast('请填写医院级别');
            return;

        }
        if (!fcws) {
            mui.toast('请填写床位数');
            return;
        }
        if (!fmbks) {
            mui.toast('请填写目标科室');
            return;
        }
        if (!fjpcj) {
            mui.toast('请填写竞品厂家');
            return;
        }
        if (!fjpryj) {
            mui.toast('请填写竞品入院价');
            return;
        }
        if (!fyyl) {
            mui.toast('请填写月用量');
            return;
        }
    }
    if (String(fxyhkflx).match('分销') != null && String(fzyyt).match('新用户开发') != null) {
        if (!fnsjxxe) {
            mui.toast('请填写年实际销售额');
            return;
        }
        if (!fzyjjcp) {
            mui.toast('请填写主要经营产品');
            return;
        }
        if (!fzyxsqy) {
            mui.toast('请填写主要销售区域');
            return;
        }
    }

    var mxflag = false;
    var mxlistArr = new Array();
    
    $("#mxlist").find("#mx").each(function () {

        var fcpdm = $(this).find("#fcpdm").val();

        var fcpmc = $(this).find("#fcpmc").val();
        var fggxh = $(this).find("#fggxh").val();
        var fdw = $(this).find("#fdw").val();
        var fsl = $(this).find("#fsl").val();
        var fif_mj = $(this).find("#fif_mj").val();
        var fyjxq_date = $(this).find("#fyjxq_date").val();
        var fbz = $(this).find("#fbz").val();
        if (mxItem(fcpdm, fcpmc, fggxh, fdw, fsl, fif_mj, fyjxq_date, fbz) == null) {
            mxflag = true;
            return;
        }
        var mx = mxItem(fcpdm, fcpmc, fggxh, fdw, fsl, fif_mj, fyjxq_date, fbz);
        mxlistArr.push(mx);
    });
    if (mxlistArr.length == 0) {
        mui.toast('请添加子表');
        return;
    }
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
            xml = xml + '       <ProcessName>医用材料公司样品申请</ProcessName>';
            xml = xml + '         <ProcessVersion>' + version + '</ProcessVersion>';
            xml = xml + '            <DraftGuid></DraftGuid>';
            xml = xml + '             <OwnerMemberFullName>' + BPMOU + '</OwnerMemberFullName>';
            xml = xml + '            <Action>提交</Action>';
            xml = xml + '          <Comment></Comment>';
            xml = xml + '             <InviteIndicateUsers></InviteIndicateUsers>';
            xml = xml + '       </Header>';
            xml = xml + '       <FormData>';

            xml = xml + ' <医用材料公司_样品申请_主表>';
            xml = xml + '  <单号>自动生成</单号>';
            xml = xml + '   <申请人编号>' + fno + '</申请人编号>';
            xml = xml + '  <申请人>' + fname + '</申请人>';
            xml = xml + '  <所属部门区域>' + fdept + '</所属部门区域>';
            xml = xml + '  <申请日期>' + fdate + '</申请日期>';
            xml = xml + '  <联系方式>' + ftel + '</联系方式>';
            xml = xml + '  <申请人类别>' + fsqrlb + '</申请人类别>';
            xml = xml + ' <客户名称>' + fkhmc + '</客户名称>';
            xml = xml + '  <邮寄地址>' + fyjdz + '</邮寄地址>';
            xml = xml + '   <申请说明>' + fsqsm + '</申请说明>';
            xml = xml + '   <主要用途>' + fzyyt + '</主要用途>';
            xml = xml + '  <新用户开发类别>' + fxyhkflx + '</新用户开发类别>';
            xml = xml + '   <医院级别>' + fyyjb + '</医院级别>';
            xml = xml + '  <床位数>' + fcws + '</床位数>';
            xml = xml + '   <目标科室>' + fmbks + '</目标科室>';
            xml = xml + '   <竞品厂家>' + fjpcj + '</竞品厂家>';
            xml = xml + '   <竞品入院数>' + fjpryj + '</竞品入院数>';
            xml = xml + ' <月用量>' + fyyl + '</月用量>';
            xml = xml + '  <年实际销售额>' + fnsjxxe + '</年实际销售额>';
            xml = xml + '  <主要经营产品>' + fzyjjcp + '</主要经营产品>';
            xml = xml + '   <主要销售区域>' + fzyxsqy + '</主要销售区域>';
            xml = xml + '  </医用材料公司_样品申请_主表>';
            for (var i = 0; i < mxlistArr.length;i++){
                xml = xml + '  <医用材料公司_样品申请_子表>';
                xml = xml + ' <RelationRowGuid>'+(i+1)+'</RelationRowGuid>';
                xml = xml + '  <RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + ' <产品代码>' + mxlistArr[i].fcpdm + '</产品代码>';
                xml = xml + ' <产品名称>' + mxlistArr[i].fcpmc + '</产品名称>';
                xml = xml + ' <规格型号>' + mxlistArr[i].fggxh + '</规格型号>';
                xml = xml + '  <单位>' + mxlistArr[i].fdw + '</单位>';
                xml = xml + '  <数量>' + mxlistArr[i].fsl + '</数量>';
                xml = xml + '  <是否灭菌>' + mxlistArr[i].fif_mj + '</是否灭菌>';
                xml = xml + '  <预计需求时间>' + mxlistArr[i].fyjxq_date + '</预计需求时间>';
                xml = xml + '  <备注说明>' + mxlistArr[i].fbz + '</备注说明>';
                xml = xml + '  </医用材料公司_样品申请_子表>';
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
    var fkhmc = $("#fkhmc").val();
    var fyjdz = $("#fyjdz").val();
    var fsqsm = $("#fsqsm").val();
    var fzyyt = $("#fzyyt").val();
    var fxyhkflx = $("#fxyhkflx").val();
    var fyyjb = $("#fyyjb").val();
    var fcws = $("#fcws").val();
    var fmbks = $("#fmbks").val();
    var fjpcj = $("#fjpcj").val();
    var fjpryj = $("#fjpryj").val();
    var fyyl = $("#fyyl").val();

    var fnsjxxe = $("#fnsjxxe").val();
    var fzyjjcp = $("#fzyjjcp").val();
    var fzyxsqy = $("#fzyxsqy").val();


    if (!ftel) {
        mui.toast('请填写联系方式');
        return;
    }
    if (!fsqrlb) {
        mui.toast('请选择申请人类别');
        return;
    }
    if (!fkhmc) {
        mui.toast('请填写客户名称');
        return;
    }
    if (!fyjdz) {
        mui.toast('请填写邮寄地址');
        return;
    }
    if (!fsqsm) {
        mui.toast('请填写申请说明');
        return;
    }
    if (!fzyyt) {
        mui.toast('请选择主要用途');
        return;
    }
    if (String(fzyyt).match('新用户')!=null&&(!fxyhkflx)) {
        mui.toast('请选择新用户开发类别');
        return;
    }
    if (String(fxyhkflx).match('直销') != null && String(fzyyt).match('新用户开发') != null) {
        if (!fyyjb) {
            mui.toast('请填写医院级别');
            return;

        }
        if (!fcws) {
            mui.toast('请填写床位数');
            return;
        }
        if (!fmbks) {
            mui.toast('请填写目标科室');
            return;
        }
        if (!fjpcj) {
            mui.toast('请填写竞品厂家');
            return;
        }
        if (!fjpryj) {
            mui.toast('请填写竞品入院价');
            return;
        }
        if (!fyyl) {
            mui.toast('请填写月用量');
            return;
        }
    }
    if (String(fxyhkflx).match('分销') != null && String(fzyyt).match('新用户开发') != null) {
        if (!fnsjxxe) {
            mui.toast('请填写年实际销售额');
            return;
        }
        if (!fzyjjcp) {
            mui.toast('请填写主要经营产品');
            return;
        }
        if (!fzyxsqy) {
            mui.toast('请填写主要销售区域');
            return;
        }
    }


    var mxflag = false;
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fcpdm = $(this).find("#fcpdm").val();
        var fcpmc = $(this).find("#fcpmc").val();
        var fggxh = $(this).find("#fggxh").val();
        var fdw = $(this).find("#fdw").val();
        var fsl = $(this).find("#fsl").val();
        var fif_mj = $(this).find("#fif_mj").val();
        var fyjxq_date = $(this).find("#fyjxq_date").val();
        var fbz = $(this).find("#fbz").val();
        if (mxItem(fcpdm, fcpmc, fggxh, fdw, fsl, fif_mj, fyjxq_date, fbz) == null) {
            mxflag = true;
            return;
        }
        var mx = mxItem(fcpdm, fcpmc, fggxh, fdw, fsl, fif_mj, fyjxq_date, fbz);
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

            xml = xml + ' <医用材料公司_样品申请_主表>';
            xml = xml + '  <单号>' + fbillno + '</单号>';
            xml = xml + '   <申请人编号>' + fno + '</申请人编号>';
            xml = xml + '  <申请人>' + fname + '</申请人>';
            xml = xml + '  <所属部门区域>' + fdept + '</所属部门区域>';
            xml = xml + '  <申请日期>' + fdate + '</申请日期>';
            xml = xml + '  <联系方式>' + ftel + '</联系方式>';
            xml = xml + '  <申请人类别>' + fsqrlb + '</申请人类别>';
            xml = xml + ' <客户名称>' + fkhmc + '</客户名称>';
            xml = xml + '  <邮寄地址>' + fyjdz + '</邮寄地址>';
            xml = xml + '   <申请说明>' + fsqsm + '</申请说明>';
            xml = xml + '   <主要用途>' + fzyyt + '</主要用途>';
            xml = xml + '  <新用户开发类别>' + fxyhkflx + '</新用户开发类别>';
            xml = xml + '   <医院级别>' + fyyjb + '</医院级别>';
            xml = xml + '  <床位数>' + fcws + '</床位数>';
            xml = xml + '   <目标科室>' + fmbks + '</目标科室>';
            xml = xml + '   <竞品厂家>' + fjpcj + '</竞品厂家>';
            xml = xml + '   <竞品入院数>' + fjpryj + '</竞品入院数>';
            xml = xml + ' <月用量>' + fyyl + '</月用量>';
            xml = xml + '  <年实际销售额>' + fnsjxxe + '</年实际销售额>';
            xml = xml + '  <主要经营产品>' + fzyjjcp + '</主要经营产品>';
            xml = xml + '   <主要销售区域>' + fzyxsqy + '</主要销售区域>';
            xml = xml + '  </医用材料公司_样品申请_主表>';
            for (var i = 0; i < mxlistArr.length; i++) {
                xml = xml + '  <医用材料公司_样品申请_子表>';
                xml = xml + ' <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml = xml + '  <RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + ' <产品代码>' + mxlistArr[i].fcpdm + '</产品代码>';
                xml = xml + ' <产品名称>' + mxlistArr[i].fcpmc + '</产品名称>';
                xml = xml + ' <规格型号>' + mxlistArr[i].fggxh + '</规格型号>';
                xml = xml + '  <单位>' + mxlistArr[i].fdw + '</单位>';
                xml = xml + '  <数量>' + mxlistArr[i].fsl + '</数量>';
                xml = xml + '  <是否灭菌>' + mxlistArr[i].fif_mj + '</是否灭菌>';
                xml = xml + '  <预计需求时间>' + mxlistArr[i].fyjxq_date + '</预计需求时间>';
                xml = xml + '  <备注说明>' + mxlistArr[i].fbz + '</备注说明>';
                xml = xml + '  </医用材料公司_样品申请_子表>';
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
    var fkhmc = $("#fkhmc").val();
    var fyjdz = $("#fyjdz").val();
    var fsqsm = $("#fsqsm").val();
    var fzyyt = $("#fzyyt").val();
    var fxyhkflx = $("#fxyhkflx").val();
    var fyyjb = $("#fyyjb").val();
    var fcws = $("#fcws").val();
    var fmbks = $("#fmbks").val();
    var fjpcj = $("#fjpcj").val();
    var fjpryj = $("#fjpryj").val();
    var fyyl = $("#fyyl").val();

    var fnsjxxe = $("#fnsjxxe").val();
    var fzyjjcp = $("#fzyjjcp").val();
    var fzyxsqy = $("#fzyxsqy").val();

    var mxflag = false;
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fcpdm = $(this).find("#fcpdm").val();
        var fcpmc = $(this).find("#fcpmc").val();
        var fggxh = $(this).find("#fggxh").val();
        var fdw = $(this).find("#fdw").val();
        var fsl = $(this).find("#fsl").val();
        var fif_mj = $(this).find("#fif_mj").val();
        var fyjxq_date = $(this).find("#fyjxq_date").val();
        var fbz = $(this).find("#fbz").val();
    
        var mx = mxItem(fcpdm, fcpmc, fggxh, fdw, fsl, fif_mj, fyjxq_date, fbz);
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

            xml = xml + ' <医用材料公司_样品申请_主表>';
            xml = xml + '  <单号>' + fbillno + '</单号>';
            xml = xml + '   <申请人编号>' + fno + '</申请人编号>';
            xml = xml + '  <申请人>' + fname + '</申请人>';
            xml = xml + '  <所属部门区域>' + fdept + '</所属部门区域>';
            xml = xml + '  <申请日期>' + fdate + '</申请日期>';
            xml = xml + '  <联系方式>' + ftel + '</联系方式>';
            xml = xml + '  <申请人类别>' + fsqrlb + '</申请人类别>';
            xml = xml + ' <客户名称>' + fkhmc + '</客户名称>';
            xml = xml + '  <邮寄地址>' + fyjdz + '</邮寄地址>';
            xml = xml + '   <申请说明>' + fsqsm + '</申请说明>';
            xml = xml + '   <主要用途>' + fzyyt + '</主要用途>';
            xml = xml + '  <新用户开发类别>' + fxyhkflx + '</新用户开发类别>';
            xml = xml + '   <医院级别>' + fyyjb + '</医院级别>';
            xml = xml + '  <床位数>' + fcws + '</床位数>';
            xml = xml + '   <目标科室>' + fmbks + '</目标科室>';
            xml = xml + '   <竞品厂家>' + fjpcj + '</竞品厂家>';
            xml = xml + '   <竞品入院数>' + fjpryj + '</竞品入院数>';
            xml = xml + ' <月用量>' + fyyl + '</月用量>';
            xml = xml + '  <年实际销售额>' + fnsjxxe + '</年实际销售额>';
            xml = xml + '  <主要经营产品>' + fzyjjcp + '</主要经营产品>';
            xml = xml + '   <主要销售区域>' + fzyxsqy + '</主要销售区域>';
            xml = xml + '  </医用材料公司_样品申请_主表>';
            for (var i = 0; i < mxlistArr.length; i++) {
                xml = xml + '  <医用材料公司_样品申请_子表>';
                xml = xml + ' <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml = xml + '  <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
                xml = xml + ' <产品代码>' + mxlistArr[i].fcpdm + '</产品代码>';
                xml = xml + ' <产品名称>' + mxlistArr[i].fcpmc + '</产品名称>';
                xml = xml + ' <规格型号>' + mxlistArr[i].fggxh + '</规格型号>';
                xml = xml + '  <单位>' + mxlistArr[i].fdw + '</单位>';
                xml = xml + '  <数量>' + mxlistArr[i].fsl + '</数量>';
                xml = xml + '  <是否灭菌>' + mxlistArr[i].fif_mj + '</是否灭菌>';
                xml = xml + '  <预计需求时间>' + mxlistArr[i].fyjxq_date + '</预计需求时间>';
                xml = xml + '  <备注说明>' + mxlistArr[i].fbz + '</备注说明>';
                xml = xml + '  </医用材料公司_样品申请_子表>';
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

    var fname = $("#fname").val();
    var fno = $("#fno").val();
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();
    var ftel = $("#ftel").val();
    var fsqrlb = $("#fsqrlb").val();
    var fkhmc = $("#fkhmc").val();
    var fyjdz = $("#fyjdz").val();
    var fsqsm = $("#fsqsm").val();
    var fzyyt = $("#fzyyt").val();
    var fxyhkflx = $("#fxyhkflx").val();
    var fyyjb = $("#fyyjb").val();
    var fcws = $("#fcws").val();
    var fmbks = $("#fmbks").val();
    var fjpcj = $("#fjpcj").val();
    var fjpryj = $("#fjpryj").val();
    var fyyl = $("#fyyl").val();

    var fnsjxxe = $("#fnsjxxe").val();
    var fzyjjcp = $("#fzyjjcp").val();
    var fzyxsqy = $("#fzyxsqy").val();

    var mxflag = false;
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fcpdm = $(this).find("#fcpdm").val();
        var fcpmc = $(this).find("#fcpmc").val();
        var fggxh = $(this).find("#fggxh").val();
        var fdw = $(this).find("#fdw").val();
        var fsl = $(this).find("#fsl").val();
        var fif_mj = $(this).find("#fif_mj").val();
        var fyjxq_date = $(this).find("#fyjxq_date").val();
        var fbz = $(this).find("#fbz").val();

        var mx = mxItem(fcpdm, fcpmc, fggxh, fdw, fsl, fif_mj, fyjxq_date, fbz);
        mxlistArr.push(mx);
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
            var xml = '<?xml version="1.0"?>';
            xml = xml + '<XForm>';
            xml = xml + '<Header>';
            xml = xml + '<Method>Process</Method>';
            xml = xml + '<PID>' + pid + '</PID>';
            xml = xml + '<Action>同意</Action>';
            xml = xml + '<Comment>' + comment + '</Comment>';

            //加签差异部分
            xml = xml + '<ConsignEnabled>true</ConsignEnabled>';
            xml = xml + '  <ConsignUsers>' + consignUserStr + '</ConsignUsers>';
            xml = xml + ' <ConsignRoutingType>' + consignRoutingType + '</ConsignRoutingType>';
            xml = xml + '  <ConsignReturnType>' + consignReturnType + '</ConsignReturnType>';
            xml = xml + ' <InviteIndicateUsers>[]</InviteIndicateUsers>';
            xml = xml + ' <Context>{&quot;Routing&quot;:{}}</Context>';
            xml = xml + '</Header>';
            xml = xml + '<FormData>';

            xml = xml + ' <医用材料公司_样品申请_主表>';
            xml = xml + '  <单号>' + fbillno + '</单号>';
            xml = xml + '   <申请人编号>' + fno + '</申请人编号>';
            xml = xml + '  <申请人>' + fname + '</申请人>';
            xml = xml + '  <所属部门区域>' + fdept + '</所属部门区域>';
            xml = xml + '  <申请日期>' + fdate + '</申请日期>';
            xml = xml + '  <联系方式>' + ftel + '</联系方式>';
            xml = xml + '  <申请人类别>' + fsqrlb + '</申请人类别>';
            xml = xml + ' <客户名称>' + fkhmc + '</客户名称>';
            xml = xml + '  <邮寄地址>' + fyjdz + '</邮寄地址>';
            xml = xml + '   <申请说明>' + fsqsm + '</申请说明>';
            xml = xml + '   <主要用途>' + fzyyt + '</主要用途>';
            xml = xml + '  <新用户开发类别>' + fxyhkflx + '</新用户开发类别>';
            xml = xml + '   <医院级别>' + fyyjb + '</医院级别>';
            xml = xml + '  <床位数>' + fcws + '</床位数>';
            xml = xml + '   <目标科室>' + fmbks + '</目标科室>';
            xml = xml + '   <竞品厂家>' + fjpcj + '</竞品厂家>';
            xml = xml + '   <竞品入院数>' + fjpryj + '</竞品入院数>';
            xml = xml + ' <月用量>' + fyyl + '</月用量>';
            xml = xml + '  <年实际销售额>' + fnsjxxe + '</年实际销售额>';
            xml = xml + '  <主要经营产品>' + fzyjjcp + '</主要经营产品>';
            xml = xml + '   <主要销售区域>' + fzyxsqy + '</主要销售区域>';
            xml = xml + '  </医用材料公司_样品申请_主表>';
            for (var i = 0; i < mxlistArr.length; i++) {
                xml = xml + '  <医用材料公司_样品申请_子表>';
                xml = xml + ' <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml = xml + '  <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
                xml = xml + ' <产品代码>' + mxlistArr[i].fcpdm + '</产品代码>';
                xml = xml + ' <产品名称>' + mxlistArr[i].fcpmc + '</产品名称>';
                xml = xml + ' <规格型号>' + mxlistArr[i].fggxh + '</规格型号>';
                xml = xml + '  <单位>' + mxlistArr[i].fdw + '</单位>';
                xml = xml + '  <数量>' + mxlistArr[i].fsl + '</数量>';
                xml = xml + '  <是否灭菌>' + mxlistArr[i].fif_mj + '</是否灭菌>';
                xml = xml + '  <预计需求时间>' + mxlistArr[i].fyjxq_date + '</预计需求时间>';
                xml = xml + '  <备注说明>' + mxlistArr[i].fbz + '</备注说明>';
                xml = xml + '  </医用材料公司_样品申请_子表>';
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

       
        xml = xml + ' <UrlParams></UrlParams>';
        xml = xml + '  <ConsignEnabled>false</ConsignEnabled>';
        xml = xml + '  <ConsignUsers>[]</ConsignUsers>';
        xml = xml + '  <ConsignRoutingType>Parallel</ConsignRoutingType>';
        xml = xml + '  <ConsignReturnType>Return</ConsignReturnType>';

        xml = xml + '   <InviteIndicateUsers>[]</InviteIndicateUsers>';
        xml = xml + '   <Context>{&quot;Routing&quot;:{}}</Context>';	
        xml = xml + '</Header>';
        xml = xml + '<FormData>';

        xml = xml + ' <医用材料公司_样品申请_主表>';
        xml = xml + '  <单号>' + fbillno + '</单号>';
        xml = xml + '   <申请人编号>' + fno + '</申请人编号>';
        xml = xml + '  <申请人>' + fname + '</申请人>';
        xml = xml + '  <所属部门区域>' + fdept + '</所属部门区域>';
        xml = xml + '  <申请日期>' + fdate + '</申请日期>';
        xml = xml + '  <联系方式>' + ftel + '</联系方式>';
        xml = xml + '  <申请人类别>' + fsqrlb + '</申请人类别>';
        xml = xml + ' <客户名称>' + fkhmc + '</客户名称>';
        xml = xml + '  <邮寄地址>' + fyjdz + '</邮寄地址>';
        xml = xml + '   <申请说明>' + fsqsm + '</申请说明>';
        xml = xml + '   <主要用途>' + fzyyt + '</主要用途>';
        xml = xml + '  <新用户开发类别>' + fxyhkflx + '</新用户开发类别>';
        xml = xml + '   <医院级别>' + fyyjb + '</医院级别>';
        xml = xml + '  <床位数>' + fcws + '</床位数>';
        xml = xml + '   <目标科室>' + fmbks + '</目标科室>';
        xml = xml + '   <竞品厂家>' + fjpcj + '</竞品厂家>';
        xml = xml + '   <竞品入院数>' + fjpryj + '</竞品入院数>';
        xml = xml + ' <月用量>' + fyyl + '</月用量>';
        xml = xml + '  <年实际销售额>' + fnsjxxe + '</年实际销售额>';
        xml = xml + '  <主要经营产品>' + fzyjjcp + '</主要经营产品>';
        xml = xml + '   <主要销售区域>' + fzyxsqy + '</主要销售区域>';
        xml = xml + '  </医用材料公司_样品申请_主表>';
        for (var i = 0; i < mxlistArr.length; i++) {
            xml = xml + '  <医用材料公司_样品申请_子表>';
            xml = xml + ' <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
            xml = xml + '  <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
            xml = xml + ' <产品代码>' + mxlistArr[i].fcpdm + '</产品代码>';
            xml = xml + ' <产品名称>' + mxlistArr[i].fcpmc + '</产品名称>';
            xml = xml + ' <规格型号>' + mxlistArr[i].fggxh + '</规格型号>';
            xml = xml + '  <单位>' + mxlistArr[i].fdw + '</单位>';
            xml = xml + '  <数量>' + mxlistArr[i].fsl + '</数量>';
            xml = xml + '  <是否灭菌>' + mxlistArr[i].fif_mj + '</是否灭菌>';
            xml = xml + '  <预计需求时间>' + mxlistArr[i].fyjxq_date + '</预计需求时间>';
            xml = xml + '  <备注说明>' + mxlistArr[i].fbz + '</备注说明>';
            xml = xml + '  </医用材料公司_样品申请_子表>';
        }


        xml = xml + '</FormData>';
        xml = xml + '</XForm>';
        PostXml(xml);
    }
}