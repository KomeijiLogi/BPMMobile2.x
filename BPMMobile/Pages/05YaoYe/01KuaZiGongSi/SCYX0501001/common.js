function prepMsg() {
    tapEvent();
    $("#fsqrq").val(getNowFormatDate(2));
    var xml = '<?xml version= "1.0" ?>';
    xml = xml + '   <Requests>';
    xml = xml + '   <Params>';
    xml = xml + '       <Method>GetFormPostData</Method>';
    xml = xml + '       <ProcessName>药业集团发货、发票开具申请</ProcessName>';
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
        
    }).fail(function (e) {

        }).then(function () {
            $("#fname").data('fno', accountBPM);
            //console.log('fno:'+$("#fname").data('fno'))
        });
   
}


//包装形式选择
var ffh_bzxsdata = [
    {
        value: '',
        text: '塑瓶单阀'
    },
    {
        value: '',
        text: '塑瓶双阀'
    },
    {
        value: '',
        text: '软袋单阀'
    },
    {
        value: '',
        text: '软袋双阀'
    },
    {
        value: '',
        text: '双软管'
    },
    {
        value: '',
        text: '其他'
    }

];

var fzjsjdata = [
    {
        value: '00011086',
        text: '崔杰'
    },
    {
        value: '00011082',
        text: '张尔超'
    },
    {
        value: '00035099',
        text: '潘成'
    },
    {
        value: '00011136',
        text: '徐宁宁'
    },
    {
        value: '00011138',
        text: '李泽南'
    },
    {
        value: '00011128',
        text: '刘虎'
    },
    {
        value: '00011130',
        text: '罗海峰'
    },
    {
        value: '00046139',
        text: '黄春晓'
    },
    {
        value: '00044537',
        text: '张钧泉'
    },
    {
        value: '00011157',
        text: '李春阳'
    },
    {
        value: '00039784',
        text: '石军伟'
    },
    {
        value: '00011120',
        text: '王华强'
    },
    {
        value: '00010191',
        text: '迟殿玉'
    },
    {
        value: '00034866',
        text: '吴宪'
    },
    {
        value: '00010843',
        text: '张中雨'
    },
    {
        value: '00044538',
        text: '钱明强'
    },
    {
        value: '00011152',
        text: '刘善喜'
    },
    {
        value: '00043530',
        text: '丛少涛'
    },
    {
        value: '00011111',
        text: '庄严'
    },
    {
        value: '00011135',
        text: '刘海涛'
    },
    {
        value: '00011127',
        text: '祝天泽'
    },
    {
        value: '00011139',
        text: '段镇勇'
    },
    {
        value: '00011777',
        text: '刘克华'
    },
    {
        value: '00011114',
        text: '张文辉'
    },
    {
        value: '00011117',
        text: '张勇'
    },
    {
        value: '00011104',
        text: '于洋'
    },
    {
        value: '00011113',
        text: '于杰'
    },
    {
        value: '00011155',
        text: '韩书斌'
    },
    {
        value: '00011149',
        text: '庄寿高'
    },
    {
        value: '00011102',
        text: '黄国选'
    },
    {
        value: '00011106',
        text: '于李国'
    },
    {
        value: '00051789',
        text: '曾太平'
    },
    {
        value: '00027522',
        text: '王开宾'
    },
    {
        value: '00047678',
        text: '盛锐'
    },
    {
        value: '00011124',
        text: '刘国昌'
    },
    {
        value: '00027521',
        text: '陈辉'
    },
    {
        value: '00011156',
        text: '林海微'
    },
    {
        value: '00043539',
        text: '常齐'
    },
    {
        value: '00011060',
        text: '刘华超'
    },
    {
        value: '00011105',
        text: '李伟'
    },
    {
        value: '00058559',
        text: '郑晓亮'
    },
    {
        value: '00011789',
        text: '徐国锋'
    }

];

var vflag = '';
function tapEvent() {


    //所属区域

    var fqydata = [
        {
            value: '',
            text:'营销一区_内镜洗消专线'
        },
        {
            value:'',
            text:'营销一区_消毒产品专线'
        },
        {
            value: '',
            text:'营销一区_肾科产品专线'
        },
        {
            value: '',
            text: '营销一区_药品专线'
        },
        {
            value: '',
            text: '营销二区_黑龙江'
        },
        {
            value: '',
            text: '营销二区_吉林'
        },
        {
            value: '',
            text: '营销二区_辽宁'
        },
        {
            value: '',
            text: '营销二区_内蒙'
        },
        {
            value: '',
            text: '营销三区_四川'
        },
        {
            value: '',
            text: '营销三区_重庆'
        },
        {
            value: '',
            text: '营销三区_云贵'
        },
        {
            value: '',
            text: '营销四区_湖北'
        },
        {
            value: '',
            text:'营销四区_湖南江西'
        },
        {
            value: '',
            text:'营销四区_两广海南'
        },
        {
            value: '',
            text: '营销五区_上海'
        },
        {
            value: '',
            text:'营销五区_江苏'
        },
        {
            value: '',
            text:'营销五区_浙江'
        },
        {
            value: '',
            text:'营销五区_福建'
        },
        {
            value: '',
            text:'营销六区_陕甘宁青新'
        },
        {
            value: '',
            text:'营销六区_山西'
        },
        {
            value: '',
            text:'营销七区_京津'
        },
        {
            value: '',
            text:'营销七区_河北'
        },
        {
            value: '',
            text:'营销八区_安徽'
        },
        {
            value: '',
            text:'营销八区_河南'
        }
    ];
    showPicker('fqy', fqydata);

    //申请类型
    var fsqlxdata = [
        {
            value: '',
            text:'发货申请'
        },
        {
            value: '',
            text:'发票申请'
        },
        {
            value: '',
            text:'发货/发票申请'
        }

    ];

    var ele = document.getElementById('fsqlx');

    var picker = new mui.PopPicker();

    picker.setData(fsqlxdata);

    ele.addEventListener('tap', function () {

        picker.show(function (items) {

            ele.value = items[0].text;
            switch (items[0].text) {
                case '发货申请':
                    $("#fhcard").show();
                    $("#fpcard").hide();
                    break;
                case '发票申请':
                    $("#fhcard").hide();
                    $("#fpcard").show();
                    break;
                case '发货/发票申请':
                    $("#fhcard").show();
                    $("#fpcard").show();
                    break;
                default:
                    $("#fhcard").hide();
                    $("#fpcard").hide();
                    break;
            }
        });

    }, false);


    //直接上级
   


    var ele2 = document.getElementById('fzjsj');

    var picker2 = new mui.PopPicker();

    picker2.setData(fzjsjdata);

    ele2.addEventListener('tap', function () {

        picker2.show(function (items) {

            ele2.value = items[0].text;
            $(ele2).data('fxszg',items[0].value);    

        });

    }, false);

    //超授信期
    mui('#fcsxqd').each(function () {
        this.addEventListener('toggle', function (event) {
            if (event.detail.isActive == 'true' || event.detail.isActive == true) {
                $("#fcsxq").val('是');
            } else {
                $("#fcsxq").val('否');
            }

        });
    });

    //客户类型
    var fkhlxdata = [
        {
            value: '',
            text:'授信期客户'
        },
        {
            value: '',
            text:'款到发货客户'
        }
    ];

    var ele3 = document.getElementById('fkhlx');

    var picker3 = new mui.PopPicker();

    picker3.setData(fkhlxdata);

    ele3.addEventListener('tap', function () {

        picker3.show(function (items) {

            ele3.value = items[0].text;
            if (String(items[0].text).indexOf('授信期客户') != -1) {
                $("#fcsxqd").removeClass('mui-disabled');

            } else {
                if (!$("#fcsxqd").hasClass('mui-disabled')) {
                    $("#fcsxqd").addClass('mui-disabled');
                }
            }

        });

    }, false);

    //发票类别
    var ffplbdata = [
        {
            value: '',
            text:'专用发票'
        },
        {
            value: '',
            text:'普通发票'
        }
    ];

    showPicker('ffplb', ffplbdata);

   

    

    //选择客户信息
    $("#fkhmc").on('tap', function () {
        getProcedureMsg(0,0);
        $("#wrapper").hide();
        $("#selector").show();
        vflag = 0;
    });


    //添加发货子表
    $('#tjmx_fh').on('tap', function () {
        //显示索引列表，在索引列表中选择后添加子表
        getProcedureMsg(1, 1);
        $("#wrapper").hide();
        $("#selector").show();
        vflag = 1;
    });

    //添加发票子表
    $("#tjmx_fp").on('tap', function () {

        getProcedureMsg(1, 2);
        vflag = 2;
        $("#wrapper").hide();
        $("#selector").show();
    });

}

function checkEvent() {
    var checkboxArray = [].slice.call(list.querySelectorAll('input[type="radio"]'));
    var checkedValues = [];
    var checkedElements = [];
    var checkedElementsBill = [];
    var checkedElementsCust = [];
    checkboxArray.forEach(function (box) {
        if (box.checked) {
            checkedValues.push(box.parentNode.innerText);



            if (vflag == 0) {
                //客户资料相关选中获取
                var checkEl = {
                    fywy: $(box).data('fywy'),
                    fywybm: $(box).data('fywybm'),
                    fdz: $(box).data('fdz'),
                    fkhmc: $(box).data('fkhmc'),
                    fkhbm: $(box).data('fkhbm'),
                    fxszz: $(box).data('fxszz'),
                    fxszzbm: $(box).data('fxszzbm')
                }
                checkedElementsCust.push(checkEl);


            } else if (vflag == 1) {
                //发货子表的相关信息选中获取
                //debugger;
                var checkEl = {
                    fwlbm: $(box).data('fwlbm'),
                    fwlmc: $(box).data('fwlmc'),
                    fdw: $(box).data('fdw'),
                    fdwbm: $(box).data('fdwbm'),
                    fzl: $(box).data('fzl'),
                    fggxh: $(box).data('fggxh')
                };
                checkedElements.push(checkEl);

            } else if (vflag == 2) {
                //发票子表的相关信息选中获取 
                //debugger;
                var checkEl = {
                    fwlmc: $(box).data('fwlmc'),
                    fggxh: $(box).data('fggxh'),
                    fdw: $(box).data('fdw')
                }
                checkedElementsBill.push(checkEl);
            }
        }



    });
    //取消选中
    checkboxArray.forEach(function (box) {
        if (box.checked) {
            box.checked = !box.checked;
        }
    })

    if (checkedValues.length > 0) {
        //根据选中元素的数组来添加子表



        if (vflag == 0) {
            //客户资料

            $("#fkhmc").val(checkedElementsCust[0].fkhmc);
            $("#fkhmc").data('fkhbm', checkedElementsCust[0].fkhbm);
            $("#fsh_dz").val(checkedElementsCust[0].fdz);


        } else if (vflag == 1) {

            //debugger;
            //发货子表

            for (var i = 0; i < checkedElements.length; i++) {
                var li = '<div id="mx" class="mui-card">';
                li = li + '  <div class="mui-input-row itemtitle">';
                li = li + '    <label>明细列表项</label>';
                li = li + ' <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>';
                li = li + '</div>';
                li += '<div class="mui-input-row">';
                li += '<label for="fwlbm">物料编码<i style="color:red;">*</i></label>';
                li += '<input type="text" id="fwlbm" name="fwlbm" readonly value="' + checkedElements[i].fwlbm + '" />';
                li += '</div>';
                li += '<div class="mui-input-row">';
                li += '<label for="fwlmc">物料名称<i style="color:red;">*</i></label>';
                li += '<input type="text" id="fwlmc" name="fwlmc" readonly value="' + checkedElements[i].fwlmc + '" />';
                li += '</div>';
                li += '<div class="mui-input-row">';
                li += '<label for="fggxh">规格型号<i style="color:red;">*</i></label>';
                li += '<input type="text" id="fggxh" name="fggxh" readonly value="' + checkedElements[i].fggxh + '" />';
                li += '</div>';
                li += '<div class="mui-input-row">';
                li += '<label for="fdw">单位<i style="color:red;">*</i></label>';
                li += '<input type="text" id="fdw" name="fdw" readonly value="' + checkedElements[i].fdw + '" />';
                li += '</div>';
                li += '<div class="mui-input-row">';
                li += '<label for="fdwbm">单位编码<i style="color:red;">*</i></label>';
                li += '<input type="text" id="fdwbm" name="fdwbm" readonly value="' + checkedElements[i].fdwbm + '" />';
                li += '</div>';
                li += '<div class="mui-input-row">';
                li += '<label for="fzl">装量<i style="color:red;">*</i></label>';
                li += '<input type="text" id="fzl" name="fzl" readonly value="' + checkedElements[i].fzl + '" />';
                li += '</div>';
                li += '<div class="mui-input-row">';
                li += '<label for="ffh_bzxs">包装形式<i style="color:red;">*</i></label>';
                li += '<input type="text" id="ffh_bzxs" name="ffh_bzxs" readonly placeholder="请选择包装形式" />';
                li += '</div>';
                li += '<div class="mui-input-row">';
                li += '<label for="ffh_dj">含税单价<i style="color:red;">*</i></label>';
                li += '<input type="number" id="ffh_dj" name="ffh_dj"  placeholder="请填写含税单价" />';
                li += '</div>';
                li += '<div class="mui-input-row">';
                li += '<label for="ffh_sl">申请数量<i style="color:red;">*</i></label>';
                li += '<input type="number" id="ffh_sl" name="ffh_sl"  placeholder="请填写申请数量" />';
                li += '</div>';
                li += '<div class="mui-input-row">';
                li += '<label for="fsjfhsl">实际发货数量</label>';
                li += '<input type="number" id="fsjfhsl" name="fsjfhsl"  placeholder="请填写实际发货数量" value="0" />';
                li += '</div>';
                li += '<div class="mui-input-row">';
                li += '<label for="ffh_je">含税金额<i style="color:red;">*</i></label>';
                li += '<input type="number" id="ffh_je" name="ffh_je"  readonly value="0.000000" />';
                li += '</div>';
                li += '<div class="mui-input-row">';
                li += '<label for="ffh_js">件数<i style="color:red;">*</i></label>';
                li += '<input type="number" id="ffh_js" name="ffh_js"  readonly  />';
                li += '</div>';
                li += '</div>';
                $("#mxlist_fh").append(li);
                document.getElementById('tjmx_fh').scrollIntoView();
                $("#mxlist_fh").find("#ffh_sl").on('input', function () {

                    $(this).parent().parent().find("#fsjfhsl").val($(this).val());
                });
                $("#mxlist_fh").find("input[type='number']").on('input', function () {

                    calcPriceShip(this);
                });
                showPickerByZepto('#mxlist_fh', '#ffh_bzxs', ffh_bzxsdata);
               
            }
        } else if (vflag == 2) {
            //debugger;
            //发票子表
            for (var i = 0; i < checkedElementsBill.length; i++) {
                var li = '<div id="mx" class="mui-card">';
                li = li + '<div class="mui-input-row itemtitle">';
                li = li + '<label>明细列表项</label>';
                li = li + '<span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>';
                li = li + '</div>';
                li += '<div class="mui-input-row">';
                li += '<label for="ffp_wlmc">物料名称<i style="color:red;">*</i></label>';
                li += '<input type="text" id="ffp_wlmc" name="ffp_wlmc" readonly value="' + checkedElementsBill[i].fwlmc + '"/>';
                li += '</div>';
                li += '<div class="mui-input-row">';
                li += '<label for="ffp_ggxh">规格型号</label>';
                li += '<input type="text" id="ffp_ggxh" name="ffp_ggxh" readonly value="' + checkedElementsBill[i].fggxh + '"/>';
                li += '</div>';
                li += '<div class="mui-input-row">';
                li += '<label for="ffp_dw">单位</label>';
                li += '<input type="text" id="ffp_dw" name="ffp_dw" readonly value="' + checkedElementsBill[i].fdw + '"/>';
                li += '</div>';
                li += '<div class="mui-input-row">';
                li += '<label for="ffp_bzxs">包装形式<i style="color:red;">*</i></label>';
                li += '<input type="text" id="ffp_bzxs" name="ffp_bzxs" readonly placeholder="请选择包装形式"/>';
                li += '</div>';
                li += '<div class="mui-input-row">';
                li += '<label for="ffp_dj">含税单价<i style="color:red;">*</i></label>';
                li += '<input type="number" id="ffp_dj" name="ffp_dj"  placeholder="请填写含税单价"/>';
                li += '</div>';
                li += '<div class="mui-input-row">';
                li += '<label for="ffp_sl">数量<i style="color:red;">*</i></label>';
                li += '<input type="number" id="ffp_sl" name="ffp_sl"  placeholder="请填写数量"/>';
                li += '</div>';
                li += '<div class="mui-input-row">';
                li += '<label for="ffp_je">含税金额<i style="color:red;">*</i></label>';
                li += '<input type="number" id="ffp_je" name="ffp_je"  readonly value="0.000000"/>';
                li += '</div>';
                li = li + '</div>';
                $("#mxlist_fp").append(li);
                document.getElementById('tjmx_fp').scrollIntoView();
                $("#mxlist_fp").find("input[type='number']").on('input', function () {

                    calcPriceBill(this);
                });
                showPickerByZepto('#mxlist_fp', '#ffp_bzxs', ffh_bzxsdata);
               
            }
        }




        //checkedElements = [];


    } else {

    }
    $("#selector").hide();
    $("#wrapper").show();
    $("#datalist").empty();

}
//准备索引列表前置
function prepIndexedList(vflag) {
    //flag表示加载哪组数据 -- 0 表示客户信息，1 表示发货明细 ，2 表示发票明细  
    console.log(vflag);
    //debugger;


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


//通过存储过程获取对应资料 
function getProcedureMsg(pflag,vflag) {
    //pflag为存储过程调用flag ，0 表示调用客户资料 1表示调用物料资料
    //flag为行为的flag ，给prepIndexedList传递参数用
    if (pflag == 0) {
       //调用 erpcloud_药业集团客户资料 存储过程
        var fno = $("#fname").data('fno');
        // 测试数据 fno='00072155'
        if (fno == '00078251') {      
            fno = '00072155'
        }

        var xml = '<?xml version= "1.0" ?>';
        xml = xml + '      <Requests>';
        xml = xml + '     <Params>';
        xml = xml + '         <DataSource>BPM_WEGO</DataSource>';
        xml = xml + '         <ID>erpcloud_药业集团客户资料</ID>';
        xml = xml + '         <Type>1</Type>';
        xml = xml + '        <Method>GetUserDataProcedure</Method>';
        xml = xml + '        <ProcedureName>erpcloud_药业集团客户资料</ProcedureName>';
        xml = xml + '        <Filter>';

        xml = xml + '         <fno>' + fno + '</fno>';

        xml = xml + '        </Filter>';
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

            var item = provideData.Tables[0].Rows;
            $("#datalist").empty();   //清除之前数据
            for (var i = 0; i < item.length;i++){
                var li = '<li data-value="" data-tags="" class="mui-table-view-cell mui-indexed-list-item mui-radio mui-left">';
                li += '<input type="radio" name="radio" ';
                li += 'data-fywy="' + item[i].业务员 + '"';
                li += 'data-fywybm="' + item[i].业务员编码 + '"';
                li += 'data-fdz="' + item[i].地址 + '"';
                li += 'data-fkhmc="' + item[i].客户名称 + '"';
                li += 'data-fkhbm="' + item[i].客户编码 + '"';
                li += 'data-fxszz="' + item[i].销售组织 + '"';
                li += 'data-fxszzbm="' + item[i].销售组织编码 + '"';
                li += ' />' + item[i].客户编码 + '||' + item[i].客户名称
                li += '</li>';
                $("#datalist").append(li);
            }
        }).fail(function (error) {

        }).then(function (data) {
            prepIndexedList(vflag);
        });

    } else if (pflag == 1) {
        //调用 erpcloud_药业集团物料资料 存储过程  
        var xml = '<?xml version= "1.0" ?>';
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

            for (var i = 0; i < itemData.length; i++) {
                var li = '<li data-value="" data-tags="" class="mui-table-view-cell mui-indexed-list-item mui-radio mui-left">';
                li += '<input type="radio" name="radio" ';
                li += 'data-fwlbm="' + itemData[i].物料编码 + '"';
                li += 'data-fwlmc="' + itemData[i].物料名称 + '"';
                li += 'data-fdw="' + itemData[i].单位 + '"';
                li += 'data-fdwbm="' + itemData[i].单位编码 + '"';
                li += 'data-fzl="' + itemData[i].装量 + '"';
                li += 'data-fggxh="' + itemData[i].规格型号 + '"';
                li += ' />' + itemData[i].物料名称 + '||' + itemData[i].物料编码 + '||' + itemData[i].规格型号  ;
                li += '</li>';
                $("#datalist").append(li);
            }
            
        }).fail(function (error) {

        }).then(function (data) {
            //创建索引列表
            //debugger;
            prepIndexedList(vflag);


        });
    } else {

    }

}


//计算发货子表
function calcPriceShip(context) {


    var ffh_dj = parseFloat($(context).parent().parent().find("#ffh_dj").val()).toFixed(6);
    var ffh_sl = parseFloat($(context).parent().parent().find("#ffh_sl").val());
    var fsjfhsl = parseFloat($(context).parent().parent().find("#fsjfhsl").val());
    var fzl = parseFloat($(context).parent().parent().find("#fzl").val());

    if (!ffh_dj) {
        ffh_dj = 0.000000;
    }
    if (!ffh_sl) {
        ffh_sl = 0;
    }
    if (!fsjfhsl){
        fsjfhsl = 0;
    }
    if (!fzl) {
        fzl = 0;
    }

    var ffh_je = ffh_dj * fsjfhsl;
    var ffh_js = fsjfhsl == 0 ? fzl : parseFloat(fzl / fsjfhsl).toFixed(6);

    $(context).parent().parent().find("#ffh_je").val(ffh_je);
    $(context).parent().parent().find("#ffh_js").val(ffh_js);

    calcTotalShip();

}

//计算发货总计
function calcTotalShip() {
    var ffh_sl_total = 0.00;
    var fsjfhsl_total = 0.00;
    var ffh_je_total = 0.00;
    var ffh_js_total = 0.00;

    $("#mxlist_fh").find("#ffh_sl").each(function () {
        var value = parseFloat($(this).val());
        if (!$(this).val()) {
            value = 0;
        }
        ffh_sl_total += value;
    });
    $("#mxlist_fh").find("#fsjfhsl").each(function () {
        var value = parseFloat($(this).val());
        if (!$(this).val()) {
            value = 0;
        }
        fsjfhsl_total += value;
    });
    $("#mxlist_fh").find("#ffh_je").each(function () {
        var value = parseFloat($(this).val());
        if (!$(this).val()) {
            value = 0;
        }
        ffh_je_total += value;
    });
    $("#mxlist_fh").find("#ffh_js").each(function () {
        var value = parseFloat($(this).val());
        if (!$(this).val()) {
            value = 0;
        }
        ffh_js_total += value;
    });

    $("#fhj_fhsl").val(ffh_sl_total);
    $("#fsjfhsltotal").val(fsjfhsl_total);
    $("#fhj_fhje").val(ffh_je_total);
    $("#fhj_fhjs").val(ffh_js_total);
}



//计算发票子表
function calcPriceBill(context) {
    var ffp_dj = parseFloat($(context).parent().parent().find("#ffp_dj").val()).toFixed(6);
    var ffp_sl = parseFloat($(context).parent().parent().find("#ffp_sl").val());

    if (!ffp_dj) {
        ffp_dj = 0.000000;
    }
    if (!ffp_sl) {
        ffp_sl = 0;
    }

    var ffp_je = ffp_dj * ffp_sl;
    $(context).parent().parent().find("#ffp_je").val(ffp_je);

    calcTotalBill();
}

//计算发票总计
function calcTotalBill() {
    var ffp_dj_total = 0;
    var ffp_sl_total = 0;
    $("#mxlist_fp").find("#ffp_dj").each(function () {
        var value = parseFloat($(this).val());
        if (!$(this).val()) {
            value = 0;
        }
        ffp_dj_total += value;
    });
    $("#mxlist_fp").find("#ffp_sl").each(function () {
        var value = parseFloat($(this).val());
        if (!$(this).val()) {
            value = 0;
        }
        ffp_sl_total += value;
    });
    $("#fhj_fpsl").val(ffp_dj_total);
    $("#fhj_fpje").val(ffp_sl_total);
}
//重写删除功能
function deleteItem(context) {
    var btnArray = ['否', '是'];
    mui.confirm('确认删除？', '', btnArray, function (e) {
        if (e.index == 1) {
            $(context).parent().parent().remove();
            calcTotalShip();
            calcTotalBill();
        }
    });
}

var itemidArr1 = new Array();
var itemidArr2 = new Array();
//加载页面内容
function initData(data, flag) {
    var item_a = data.FormDataSet.BPM_WGYYFHFPSQ_A[0];
    if (flag) {

        $("#taskId").val(item_a.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item_a.fbillno);
    }
    $("#fname").val(item_a.fname);
    $("#fqy").val(item_a.fqy);
    $("#fsqrq").val(FormatterTimeYMS(item_a.fsqrq));
    $("#fsqlx").val(item_a.fsqlx);
    $("#fkhmc").val(item_a.fkhmc);
    $("#fkhmc").data('fkzcc', item_a.fkzcc);
    $("#fkhmc").data('fkhbm', item_a.fkhbm);
    //$("#fzjsj").val(item_a.fzjsj);
    $("#fzjsj").data('fxszg', item_a.fxszg);
    for (var n = 0; n < fzjsjdata.length; n++) {
        if (String(fzjsjdata[n].value).match(item_a.fxszg) != null) {
            $("#fzjsj").val(fzjsjdata[n].text);
        }
    }
    $("#fsh_dz").val(item_a.fsh_dz);
    $("#fsh_name").val(item_a.fsh_name);
    $("#fsh_tel").val(item_a.fsh_tel);
    $("#fdhrq").val(FormatterTimeYMS(item_a.fdhrq));
    $("#fkhlx").val(item_a.fkhlx);
    $("#fdqqk").val(item_a.fdqqk);
    $("#fcsxq").val(item_a.fcsxq);
    if (item_a.fcsxq == '是') {
        $("#fcsxqd").addClass('mui-active');
    }

    $("#fckdh").val(item_a.fckdh);

    //发货部分
    $("#fhj_fhsl").val(item_a.fhj_fhsl);
    $("#fsjfhsltotal").val(item_a.fsjfhsltotal);
    $("#fhj_fhje").val(item_a.fhj_fhje);
    $("#fhj_fhjs").val(item_a.fhj_fhjs);
    $("#ffh_bz").val(item_a.ffh_bz);
   
    var item_b1 = data.FormDataSet.BPM_WGYYFHFPSQ_B1;
    for (var i = 0; i < item_b1.length; i++) {
        itemidArr1.push(item_b1[i].itemid);
        var li = '<div id="mx" class="mui-card">';
        li += '<div class="mui-input-row itemtitle">';
        li += '<label>明细列表项</label>';
        li += '<span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>';
        li += '</div>';
        li += '<div class="mui-input-row">';
        li += '<label for="fwlbm">物料编码<i style="color:red;">*</i></label>';
        li += '<input type="text" id="fwlbm" name="fwlbm" readonly  value="' + item_b1[i].ffh_wlbm + '"/>';
        li += '</div>';
        li += '<div class="mui-input-row">';
        li += '<label for="fwlmc">物料名称<i style="color:red;">*</i></label>';
        li += '<input type="text" id="fwlmc" name="fwlmc" readonly  value="' + item_b1[i].ffh_wlmc + '"/>';
        li += '</div>';
        li += '<div class="mui-input-row">';
        li += '<label for="fggxh">规格型号<i style="color:red;">*</i></label>';
        li += '<input type="text" id="fggxh" name="fggxh" readonly  value="' + item_b1[i].ffh_ggxh + '"/>';
        li += '</div>';
        li += '<div class="mui-input-row">';
        li += '<label for="fdw">单位<i style="color:red;">*</i></label>';
        li += '<input type="text" id="fdw" name="fdw" readonly  value="' + item_b1[i].ffh_dw + '"/>';
        li += '</div>';
        li += '<div class="mui-input-row">';
        li += '<label for="fdwbm">单位编码<i style="color:red;">*</i></label>';
        li += '<input type="text" id="fdwbm" name="fdwbm" readonly value="' + item_b1[i].fjldwbm + '"/>';
        li += '</div>';
        li += '<div class="mui-input-row">';
        li += '<label for="fzl">装量<i style="color:red;">*</i></label>';
        li += '<input type="text" id="fzl" name="fzl" readonly value="' + item_b1[i].fzl + '"/>';
        li += '</div>';
        li += '<div class="mui-input-row">';
        li += '<label for="ffh_bzxs">包装形式<i style="color:red;">*</i></label>';
        li += '<input type="text" id="ffh_bzxs" name="ffh_bzxs" readonly  value="' + item_b1[i].ffh_bzxs + '"/>';
        li += '</div>';
        li += '<div class="mui-input-row">';
        li += '<label for="ffh_dj">含税单价<i style="color:red;">*</i></label>';
        li += '<input type="number" id="ffh_dj" name="ffh_dj"  readonly value="' + item_b1[i].ffh_dj + '"/>';
        li += '</div>';
        li += '<div class="mui-input-row">';
        li += '<label for="ffh_sl">申请数量<i style="color:red;">*</i></label>';
        li += '<input type="number" id="ffh_sl" name="ffh_sl"  readonly value="' + item_b1[i].ffh_sl + '"/>';
        li += '</div>';
        li += '<div class="mui-input-row">';
        li += '<label for="fsjfhsl">实际发货数量</label>';
        li += '<input type="number" id="fsjfhsl" name="fsjfhsl"  readonly value="' + item_b1[i].fsjfhsl + '"/>';
        li += '</div>';
        li += '<div class="mui-input-row">';
        li += '<label for="ffh_je">含税金额<i style="color:red;">*</i></label>';
        li += '<input type="number" id="ffh_je" name="ffh_je"  readonly value="' + item_b1[i].ffh_je + '"/>';
        li += '</div>';
        li += '<div class="mui-input-row">';
        li += '<label for="ffh_js">件数<i style="color:red;">*</i></label>';
        li += '<input type="number" id="ffh_js" name="ffh_js"  readonly  value="' + item_b1[i].ffh_js + '"/>';
        li += '</div>';
        li += '</div>';
        $("#mxlist_fh").append(li);
    }



   
    $("#ffplb").val(item_a.ffplb);
    $("#fsj_name").val(item_a.fsj_name);
    $("#fsj_tel").val(item_a.fsj_tel);
    $("#fyjdz").val(item_a.fyjdz);
    $("#fkd_gs").val(item_a.fkd_gs);
    $("#fkd_dh").val(item_a.fkd_dh);
    $("#ffph").val(item_a.ffph);
    $("#fhrqks").val(FormatterTimeYMS(item_a.fhrqks));
    $("#fhrqjs").val(FormatterTimeYMS(item_a.fhrqjs));

    //发票部分 
    $("#fhj_fpsl").val(item_a.fhj_fpsl);
    $("#fhj_fpje").val(item_a.fhj_fpje);
    $("#ffp_bz").val(item_a.ffp_bz);
    var item_b2 = data.FormDataSet.BPM_WGYYFHFPSQ_B2;
    for (var i = 0; i < item_b2.length; i++) {
        itemidArr2.push(item_b2[i].itemid);
        var li = '<div id="mx" class="mui-card">';
        li += '<div class="mui-input-row itemtitle">';
        li += '<label>明细列表项</label>';
        li += '<span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>';
        li += '</div>';
        li += '<div class="mui-input-row">';
        li += '<label for="ffp_wlmc">物料名称<i style="color:red;">*</i></label>';
        li += '<input type="text" id="ffp_wlmc" name="ffp_wlmc" readonly value="' + item_b2[i].ffp_wlmc + '"/>';
        li += '</div>';
        li += '<div class="mui-input-row">';
        li += '<label for="ffp_ggxh">规格型号</label>';
        li += '<input type="text" id="ffp_ggxh" name="ffp_ggxh" readonly value="' + item_b2[i].ffp_ggxh + '"/>';
        li += '</div>';
        li += '<div class="mui-input-row">';
        li += '<label for="ffp_dw">单位</label>';
        li += '<input type="text" id="ffp_dw" name="ffp_dw" readonly value="' + item_b2[i].ffp_dw + '"/>';
        li += '</div>';
        li += '<div class="mui-input-row">';
        li += '<label for="ffp_bzxs">包装形式<i style="color:red;">*</i></label>';
        li += '<input type="text" id="ffp_bzxs" name="ffp_bzxs" readonly value="' + item_b2[i].ffp_bzxs + '"/>';
        li += '</div>';
        li += '<div class="mui-input-row">';
        li += '<label for="ffp_dj">含税单价<i style="color:red;">*</i></label>';
        li += '<input type="number" id="ffp_dj" name="ffp_dj"  readonly value="' + item_b2[i].ffp_dj + '"/>';
        li += '</div>';
        li += '<div class="mui-input-row">';
        li += '<label for="ffp_sl">数量<i style="color:red;">*</i></label>';
        li += '<input type="number" id="ffp_sl" name="ffp_sl"  readonly value="' + item_b2[i].ffp_sl + '"/>';
        li += '</div>';
        li += '<div class="mui-input-row">';
        li += '<label for="ffp_je">含税金额<i style="color:red;">*</i></label>';
        li += '<input type="number" id="ffp_je" name="ffp_je"  readonly value="' + item_b2[i].ffp_je + '"/>';
        li += '</div>';
        li += '</div>';
        $("#mxlist_fp").append(li);
    }

}

//节点控制
function nodeControllerExp(NodeName) {

    /**
    *      特殊节点字段控制说明:
    *      商务专员 可修改`实际发货数量`，填写`EAS出库单号`
    *      核算专员 可修改`实际发货数量`
    *      发票专员 可修改`实际发货数量`，填写`发票号`
    *      商务专员2 可选择`快递公司`，修改`发货日期开始、截止`
    *      
    **/

    //提交人
    if (NodeName == '开始') {
        $("#tjmx_fp,#tjmx_fh").show();
        $(".saveCanChange").removeAttr('readonly');        
        tapEvent();

        //子表可修改
        $("#mxlist_fh").find('#mx').each(function () {
            $(this).find("#ffh_dj,#ffh_sl,#fsjfhsl").removeAttr('readonly');

        });
        $("#mxlist_fp").find('#mx').each(function () {
            $(this).find("#ffp_dj,#ffp_sl").removeAttr('readonly');
        });

        $("#mxlist_fh").find("#ffh_sl").on('input', function () {

            $(this).parent().parent().find("#fsjfhsl").val($(this).val());
        });
        $("#mxlist_fh").find("input[type='number']").on('input', function () {

            calcPriceShip(this);
        });
        showPickerByZepto('#mxlist_fh', '#ffh_bzxs', ffh_bzxsdata);


        $("#mxlist_fp").find("input[type='number']").on('input', function () {

            calcPriceBill(this);
        });
        showPickerByZepto('#mxlist_fp', '#ffp_bzxs', ffh_bzxsdata);


        //商务专员
    } else if (String(NodeName).match(/\d+/g) == null || String(NodeName).match('（营销一区）1') != null) {

        $("#fckdh").attr('placeholder', '请填写出库单号');
        $("#fckdh").removeAttr('readonly');

        $("#mxlist_fh").find("#fsjfhsl").removeAttr('readonly');
        
        $("#mxlist_fh").find("input[type='number']").on('input', function () {

            calcPriceShip(this);
        });

        //核算专员
    } else if (String(NodeName).match('核算专员') != null) {

        $("#mxlist_fh").find("#fsjfhsl").removeAttr('readonly');

        $("#mxlist_fh").find("input[type='number']").on('input', function () {

            calcPriceShip(this);
        });

        //发票专员
    } else if (String(NodeName).match('开票专员') != null) {

        $("#ffph").attr('placeholder', '请填写发票号');
        $("#ffph").removeAttr('readonly');

        //商务专员2
    } else if (String(NodeName).match(/\d+/g) != null && String(NodeName).match('商务') != null) {

        $("#fkd_gs").attr('placeholder', '请选择快递公司');
        var fkd_gsdata = [
            {
                value: '',
                text:'圆通'
            },
            {
                value: '',
                text:'EMS'
            },
            {
                value:'',
                text:'顺丰'
            }
        ];


        showPicker('fkd_gs', fkd_gsdata);

        $("#fkd_dh").attr('placeholder', '请填写快递单号');
        $("#fkd_dh").removeAttr('readonly');


        $("#mxlist_fh").find("#fsjfhsl").removeAttr('readonly');

        $("#mxlist_fh").find("input[type='number']").on('input', function () {

            calcPriceShip(this);
        });


    }

}

//发货子表
function mxItemShip(fwlbm, fwlmc, fggxh, fdw, fdwbm, fzl, ffh_bzxs, ffh_dj, ffh_sl, fsjfhsl, ffh_je, ffh_js) {
    var mx = Object.create({
        fwlbm: fwlbm,
        fwlmc: fwlmc,
        fggxh: fggxh,
        fdw: fdw,
        fdwbm: fdwbm,
        fzl: fzl,
        ffh_bzxs: ffh_bzxs,
        ffh_dj: ffh_dj,
        ffh_sl: ffh_sl,
        fsjfhsl: fsjfhsl,
        ffh_je: ffh_je,
        ffh_js: ffh_js,
        _check: function () {
            if (!ffh_bzxs){
                mui.toast('请选择包装形式');
                return null;
            }
            if (!ffh_dj) {
                mui.toast('请填写含税单价');
                return null;
            }
            if (!ffh_sl) {
                mui.toast('请填写申请数量');
                return null;
            }
            if (!fsjfhsl) {
                mui.toast('请填写实际发货数量');
                return null;
            }
            if (parseInt(ffh_js) != ffh_js) {
                mui.toast('件数数量应为整数，请重新填写发货数量');
                return null;
            }
            return mx;
        }
    });
    return mx._check();
}
//发票子表
function mxItemBill(ffp_wlmc, ffp_ggxh, ffp_dw, ffp_bzxs, ffp_dj, ffp_sl, ffp_je) {

    var mx = Object.create({

        ffp_wlmc: ffp_wlmc,
        ffp_ggxh: ffp_ggxh,
        ffp_dw: ffp_dw,
        ffp_bzxs: ffp_bzxs,
        ffp_dj: ffp_dj,
        ffp_sl: ffp_sl,
        ffp_je: ffp_je,
        _check: function () {
            if (!ffp_wlmc) {
                mui.toast('请填写物料名称');
                return null;
            }
            if (!ffp_bzxs) {
                mui.toast('请选择包装形式');
                return null;
            }
            if (!ffp_dj) {
                mui.toast('请填写含税单价');
                return null;
            }
            if (!ffp_sl) {
                mui.toast('请填写数量');
                return null;
            }
           
            return mx;
        }
    });
    return mx._check();

}



function Save() {
    
    var fname = $("#fname").val();
    var fno = $("#fname").data('fno');
    var fqy = $("#fqy").val();
    var fsqrq = $("#fsqrq").val();
    var fsqlx = $("#fsqlx").val();
    var fkhmc = $("#fkhmc").val();
    var fkhbm = $("#fkhmc").data('fkhbm');
    var fkzcc = $("#fkhmc").data('fkzcc');

    var fzjsj = $("#fzjsj").val();
    var fxszg = $("#fzjsj").data('fxszg');

    var fsh_dz = $("#fsh_dz").val();
    var fsh_name = $("#fsh_name").val();
    var fsh_tel = $("#fsh_tel").val();
    var fdhrq = $("#fdhrq").val();
    var fkhlx = $("#fkhlx").val();
    var fdqqk = $("#fdqqk").val();
    var fcsxq = $("#fcsxq").val();
    var fckdh = $("#fckdh").val();
    var fhj_fhsl = $("#fhj_fhsl").val();
    var fsjfhsltotal = $("#fsjfhsltotal").val();
    var fhj_fhje = $("#fhj_fhje").val();
    var fhj_fhjs = $("#fhj_fhjs").val();

    var mxflag = false;
    var mxlistArrShip = new Array();
    $("#mxlist_fh").find("#mx").each(function () {

        var fwlbm = $(this).find("#fwlbm").val();
        var fwlmc = $(this).find("#fwlmc").val();
        var fggxh = $(this).find("#fggxh").val();
        var fdw = $(this).find("#fdw").val();
        var fdwbm = $(this).find("#fdwbm").val();
        var fzl = $(this).find("#fzl").val();
        var ffh_bzxs = $(this).find("#ffh_bzxs").val();
        var ffh_dj = $(this).find("#ffh_dj").val();
        var ffh_sl = $(this).find("#ffh_sl").val();
        var fsjfhsl = $(this).find("#fsjfhsl").val();
        var ffh_je = $(this).find("#ffh_je").val();
        var ffh_js = $(this).find("#ffh_js").val();

        if (mxItemShip(fwlbm, fwlmc, fggxh, fdw, fdwbm, fzl, ffh_bzxs, ffh_dj, ffh_sl, fsjfhsl, ffh_je, ffh_js) == null) {
            mxflag = true;
            return;
        }

        var mx = mxItemShip(fwlbm, fwlmc, fggxh, fdw, fdwbm, fzl, ffh_bzxs, ffh_dj, ffh_sl, fsjfhsl, ffh_je, ffh_js);
        mxlistArrShip.push(mx);
    });


    var ffh_bz = $("#ffh_bz").val();
    var ffplb = $("#ffplb").val();
    var fsj_name = $("#fsj_name").val();
    var fsj_tel = $("#fsj_tel").val();
    var fyjdz = $("#fyjdz").val();
    var fkd_gs = $("#fkd_gs").val();
    var fkd_dh = $("#fkd_dh").val();
    var ffph = $("#ffph").val();
    var fhrqks = $("#fhrqks").val();
    var fhrqjs = $("#fhrqjs").val();

    var fhj_fpsl = $("#fhj_fpsl").val();
    var fhj_fpje = $("#fhj_fpje").val();
   


    var mxlistArrBill = new Array();

    $("#mxlist_fp").find("#mx").each(function () {
        var ffp_wlmc = $(this).find("#ffp_wlmc").val();
        var ffp_ggxh = $(this).find("#ffp_ggxh").val();
        var ffp_dw = $(this).find("#ffp_dw").val();
        var ffp_bzxs = $(this).find("#ffp_bzxs").val();
        var ffp_dj = $(this).find("#ffp_dj").val();
        var ffp_sl = $(this).find("#ffp_sl").val();
        var ffp_je = $(this).find("#ffp_je").val();
        if (mxItemBill(ffp_wlmc, ffp_ggxh, ffp_dw, ffp_bzxs, ffp_dj, ffp_sl, ffp_je) == null) {
            mxflag = true;
            return;

        }
        var mx = mxItemBill(ffp_wlmc, ffp_ggxh, ffp_dw, ffp_bzxs, ffp_dj, ffp_sl, ffp_je);
        mxlistArrBill.push(mx);
    });

    var ffp_bz = $("#ffp_bz").val();

    //校验主表中必填项
    if (!fqy) {
        mui.toast('请选择所属区域');
        return;
    }
    if (!fsqrq) {
        mui.toast('请填写申请日期');
        return;
    }

    if (!fsqlx) {
        mui.toast('请选择申请类型');
        return;
    }

    if (!fkhmc) {
        mui.toast('请选择客户名称');
        return;
    }

    if (String(fsqlx).match('发货') != null) {
        if (!fzjsj) {
            mui.toast('请选择直接上级');
            return;
        }
        if (!fsh_name) {
            mui.toast('请填写收货人');
            return;
        }
        if (!fsh_tel) {
            mui.toast('请填写收货人电话');
            return;
        }
        if (!fdhrq) {
            mui.toast('请填写到货日期');
            return;
        }
        if (!fkhlx) {
            mui.toast('请选择客户类型');
            return;
        }
        
    }
    if (String(fsqlx).match('发票') != null) {
        if (!ffplb) {
            mui.toast('请选择发票类别');
            return;
        }
        if (!fsj_name) {
            mui.toast('请填写收件人');
            return;
        }
        if (!fsj_tel) {
            mui.toast('请填写收件人电话');
            return;
        }
        if (!fyjdz) {
            mui.toast('请填写邮件地址');
            return;
        }
        if (!fhrqks) {
            mui.toast('请填写发货日期开始');
            return;
        }
        if (!fhrqjs) {
            mui.toast('请填写发货日期结束');
            return;
        }


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
            xml = xml + '       <ProcessName>药业集团发货、发票开具申请</ProcessName>';
            xml = xml + '         <ProcessVersion>' + version + '</ProcessVersion>';
            xml = xml + '            <DraftGuid></DraftGuid>';
            xml = xml + '             <OwnerMemberFullName>' + BPMOU + '</OwnerMemberFullName>';
            xml = xml + '            <Action>提交</Action>';
            xml = xml + '          <Comment></Comment>';
            xml = xml + '             <InviteIndicateUsers></InviteIndicateUsers>';
            xml = xml + '       </Header>';
            xml = xml + '       <FormData>';

            xml += ' <BPM_WGYYFHFPSQ_A>';
            xml += '   <fbillno>自动生成</fbillno>';
            xml += '   <fname>' + fname + '</fname>';
            xml += '   <fqy>' + fqy + '</fqy>';
            xml += '   <fsqrq>' + fsqrq + '</fsqrq>';
            xml += '   <fsqlx>' + fsqlx + '</fsqlx>';
            xml += '   <fkhbm>' + fkhbm + '</fkhbm>';
            xml += '   <fkczz>' + fkzcc + '</fkczz>';
            xml += '   <fkhmc>' + fkhmc + '</fkhmc>';
            xml += ' <fxszg>' + fxszg + '</fxszg>';
            xml += '   <fsh_dz>' + fsh_dz + '</fsh_dz>';
            xml += '   <fsh_name>' + fsh_name + '</fsh_name>';
            xml += '  <fsh_tel>' + fsh_tel + '</fsh_tel>';
            xml += '   <fdhrq>' + fdhrq + '</fdhrq>';
            xml += '   <fkhlx>' + fkhlx + '</fkhlx>';
            xml += '   <fdqqk>' + fdqqk + '</fdqqk>';
            xml += '   <fcsxq>' + fcsxq + '</fcsxq>';
            xml += '  <fckdh>' + fckdh + '</fckdh>';
            xml += '  <fhj_fhsl>' + fhj_fhsl + '</fhj_fhsl>';
            xml += '   <fsjfhsltotal>' + fsjfhsltotal + '</fsjfhsltotal>';
            xml += '   <fhj_fhje>' + fhj_fhje + '</fhj_fhje>';
            xml += '  <fhj_fhjs>' + fhj_fhjs + '</fhj_fhjs>';
            xml += '   <ffh_bz>' + ffh_bz + '</ffh_bz>';
            xml += '   <ffplb>' + ffplb + '</ffplb>';
            xml += '   <fsj_name>' + fsj_name + '</fsj_name>';
            xml += '   <fsj_tel>' + fsj_tel + '</fsj_tel>';
            xml += '   <fyjdz>' + fyjdz + '</fyjdz>';
            xml += '   <fkd_gs>' + fkd_gs + '</fkd_gs>';
            xml += '   <fkd_dh>' + fkd_dh + '</fkd_dh>';
            xml += '   <ffph>' + ffph + '</ffph>';
            xml += '   <fhrqks>' + fhrqks + '</fhrqks>';
            xml += '   <fhrqjs>' + fhrqjs + '</fhrqjs>';
            xml += '    <fhj_fpsl>' + fhj_fpsl + '</fhj_fpsl>';
            xml += '   <fhj_fpje>' + fhj_fpje + '</fhj_fpje>';
            xml += '   <ffp_bz>' + ffp_bz + '</ffp_bz>';
            xml += '  </BPM_WGYYFHFPSQ_A>';
            if (mxlistArrShip.length != 0) {
                for (var i = 0; i < mxlistArrShip.length; i++) {
                    xml += ' <BPM_WGYYFHFPSQ_B1>';
                    xml += '   <RelationRowGuid>'+(i+1)+'</RelationRowGuid>';
                    xml += '  <RowPrimaryKeys></RowPrimaryKeys>';
                    xml += '  <fentyrno>' + (i + 1) + '</fentyrno>';
                    xml += ' <ffh_wlbm>' + mxlistArrShip[i].fwlbm + '</ffh_wlbm>';
                    xml += ' <ffh_wlmc>' + mxlistArrShip[i].fwlmc + '</ffh_wlmc>';
                    xml += ' <ffh_ggxh>' + mxlistArrShip[i].fggxh + '</ffh_ggxh>';
                    xml += '<ffh_dw>' + mxlistArrShip[i].fdw + '</ffh_dw>';
                    xml += ' <fjldwbm>' + mxlistArrShip[i].fdwbm + '</fjldwbm>';
                    xml += '  <fzl>' + mxlistArrShip[i].fzl + '</fzl>';
                    xml += '  <ffh_bzxs>' + mxlistArrShip[i].ffh_bzxs + '</ffh_bzxs>';
                    xml += ' <ffh_dj>' + mxlistArrShip[i].ffh_dj + '</ffh_dj>';
                    xml += ' <ffh_sl>' + mxlistArrShip[i].ffh_sl + '</ffh_sl>';
                    xml += ' <fsjfhsl>' + mxlistArrShip[i].fsjfhsl + '</fsjfhsl>';
                    xml += '  <ffh_je>' + mxlistArrShip[i].ffh_je + '</ffh_je>';
                    xml += '  <ffh_js>' + parseInt( mxlistArrShip[i].ffh_js) + '</ffh_js>';
                    xml += ' </BPM_WGYYFHFPSQ_B1>';
                }
            } else {
                xml += ' <BPM_WGYYFHFPSQ_B1>';
                xml += '   <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml += '  <RowPrimaryKeys></RowPrimaryKeys>';
                xml += '  <fentyrno></fentyrno>';
                xml += ' <ffh_wlbm></ffh_wlbm>';
                xml += ' <ffh_wlmc></ffh_wlmc>';
                xml += ' <ffh_ggxh></ffh_ggxh>';
                xml += '<ffh_dw></ffh_dw>';
                xml += ' <fjldwbm></fjldwbm>';
                xml += '  <fzl></fzl>';
                xml += '  <ffh_bzxs></ffh_bzxs>';
                xml += ' <ffh_dj></ffh_dj>';
                xml += ' <ffh_sl></ffh_sl>';
                xml += ' <fsjfhsl></fsjfhsl>';
                xml += '  <ffh_je></ffh_je>';
                xml += '  <ffh_js></ffh_js>';
                xml += ' </BPM_WGYYFHFPSQ_B1>';
            }

            if (mxlistArrBill.length != 0) {
                for (var i = 0; i < mxlistArrBill.length;i++){
                    xml += ' <BPM_WGYYFHFPSQ_B2>';
                    xml += '  <RelationRowGuid>' + (parseInt(mxlistArrShip.length)+1+i) + '</RelationRowGuid>';
                    xml += ' <RowPrimaryKeys></RowPrimaryKeys>';
                    xml += ' <fentryno>' + (i + 1) + '</fentryno>';
                    xml += '  <ffp_wlmc>' + mxlistArrBill[i].ffp_wlmc + '</ffp_wlmc>';
                    xml += '  <ffp_ggxh>' + mxlistArrBill[i].ffp_ggxh + '</ffp_ggxh>';
                    xml += ' <ffp_dw>' + mxlistArrBill[i].ffp_dw + '</ffp_dw>';
                    xml += ' <ffp_bzxs>' + mxlistArrBill[i].ffp_bzxs + '</ffp_bzxs>';
                    xml += ' <ffp_dj>' + mxlistArrBill[i].ffp_dj + '</ffp_dj>';
                    xml += ' <ffp_sl>' + mxlistArrBill[i].ffp_sl + '</ffp_sl>';
                    xml += ' <ffp_je>' + mxlistArrBill[i].ffp_je + '</ffp_je>';
                    xml += ' </BPM_WGYYFHFPSQ_B2>';

                }

            } else {
                xml += ' <BPM_WGYYFHFPSQ_B2>';
                xml += '  <RelationRowGuid>' + (parseInt(mxlistArrShip.length) + 1) + '</RelationRowGuid>';
             
                xml += ' <RowPrimaryKeys></RowPrimaryKeys>';
                xml += ' <fentryno>1</fentryno>';
                xml += '  <ffp_wlmc></ffp_wlmc>';
                xml += '  <ffp_ggxh></ffp_ggxh>';
                xml += ' <ffp_dw></ffp_dw>';
                xml += ' <ffp_bzxs></ffp_bzxs>';
                xml += ' <ffp_dj></ffp_dj>';
                xml += ' <ffp_sl></ffp_sl>';
                xml += ' <ffp_je></ffp_je>';
                xml += ' </BPM_WGYYFHFPSQ_B2>';

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
    var fno = $("#fname").data('fno');
    var fqy = $("#fqy").val();
    var fsqrq = $("#fsqrq").val();
    var fsqlx = $("#fsqlx").val();
    var fkhmc = $("#fkhmc").val();
    var fkhbm = $("#fkhmc").data('fkhbm');
    var fkzcc = $("#fkhmc").data('fkzcc');
    var fzjsj = $("#fzjsj").val();
    var fxszg = $("#fzjsj").data('fxszg');
    var fsh_dz = $("#fsh_dz").val();
    var fsh_name = $("#fsh_name").val();
    var fsh_tel = $("#fsh_tel").val();
    var fdhrq = $("#fdhrq").val();
    var fkhlx = $("#fkhlx").val();
    var fdqqk = $("#fdqqk").val();
    var fcsxq = $("#fcsxq").val();
    var fckdh = $("#fckdh").val();
    var fhj_fhsl = $("#fhj_fhsl").val();
    var fsjfhsltotal = $("#fsjfhsltotal").val();
    var fhj_fhje = $("#fhj_fhje").val();
    var fhj_fhjs = $("#fhj_fhjs").val();

    var mxflag = false;
    var mxlistArrShip = new Array();
    $("#mxlist_fh").find("#mx").each(function () {

        var fwlbm = $(this).find("#fwlbm").val();
        var fwlmc = $(this).find("#fwlmc").val();
        var fggxh = $(this).find("#fggxh").val();
        var fdw = $(this).find("#fdw").val();
        var fdwbm = $(this).find("#fdwbm").val();
        var fzl = $(this).find("#fzl").val();
        var ffh_bzxs = $(this).find("#ffh_bzxs").val();
        var ffh_dj = $(this).find("#ffh_dj").val();
        var ffh_sl = $(this).find("#ffh_sl").val();
        var fsjfhsl = $(this).find("#fsjfhsl").val();
        var ffh_je = $(this).find("#ffh_je").val();
        var ffh_js = $(this).find("#ffh_js").val();

        if (mxItemShip(fwlbm, fwlmc, fggxh, fdw, fdwbm, fzl, ffh_bzxs, ffh_dj, ffh_sl, fsjfhsl, ffh_je, ffh_js) == null) {
            mxflag = true;
            return;
        }

        var mx = mxItemShip(fwlbm, fwlmc, fggxh, fdw, fdwbm, fzl, ffh_bzxs, ffh_dj, ffh_sl, fsjfhsl, ffh_je, ffh_js);
        mxlistArrShip.push(mx);
    });


    var ffh_bz = $("#ffh_bz").val();
    var ffplb = $("#ffplb").val();
    var fsj_name = $("#fsj_name").val();
    var fsj_tel = $("#fsj_tel").val();
    var fyjdz = $("#fyjdz").val();
    var fkd_gs = $("#fkd_gs").val();
    var fkd_dh = $("#fkd_dh").val();
    var ffph = $("#ffph").val();
    var fhrqks = $("#fhrqks").val();
    var fhrqjs = $("#fhrqjs").val();

    var fhj_fpsl = $("#fhj_fpsl").val();
    var fhj_fpje = $("#fhj_fpje").val();



    var mxlistArrBill = new Array();

    $("#mxlist_fp").find("#mx").each(function () {
        var ffp_wlmc = $(this).find("#ffp_wlmc").val();
        var ffp_ggxh = $(this).find("#ffp_ggxh").val();
        var ffp_dw = $(this).find("#ffp_dw").val();
        var ffp_bzxs = $(this).find("#ffp_bzxs").val();
        var ffp_dj = $(this).find("#ffp_dj").val();
        var ffp_sl = $(this).find("#ffp_sl").val();
        var ffp_je = $(this).find("#ffp_je").val();
        if (mxItemBill(ffp_wlmc, ffp_ggxh, ffp_dw, ffp_bzxs, ffp_dj, ffp_sl, ffp_je) == null) {
            mxflag = true;
            return;

        }
        var mx = mxItemBill(ffp_wlmc, ffp_ggxh, ffp_dw, ffp_bzxs, ffp_dj, ffp_sl, ffp_je);
        mxlistArrBill.push(mx);
    });

    var ffp_bz = $("#ffp_bz").val();

    //校验主表中必填项
    if (!fqy) {
        mui.toast('请选择所属区域');
        return;
    }
    if (!fsqrq) {
        mui.toast('请填写申请日期');
        return;
    }

    if (!fsqlx) {
        mui.toast('请选择申请类型');
        return;
    }

    if (!fkhmc) {
        mui.toast('请选择客户名称');
        return;
    }

    if (String(fsqlx).match('发货') != null) {
        if (!fzjsj) {
            mui.toast('请选择直接上级');
            return;
        }
        if (!fsh_name) {
            mui.toast('请填写收货人');
            return;
        }
        if (!fsh_tel) {
            mui.toast('请填写收货人电话');
            return;
        }
        if (!fdhrq) {
            mui.toast('请填写到货日期');
            return;
        }
        if (!fkhlx) {
            mui.toast('请选择客户类型');
            return;
        }
        if (!fdqqk) {
            mui.toast('请填写当前欠款');
            return;
        }

    }
    if (String(fsqlx).match('发票') != null) {
        if (!ffplb) {
            mui.toast('请选择发票类别');
            return;
        }
        if (!fsj_name) {
            mui.toast('请填写收件人');
            return;
        }
        if (!fsj_tel) {
            mui.toast('请填写收件人电话');
            return;
        }
        if (!fyjdz) {
            mui.toast('请填写邮件地址');
            return;
        }
        if (!fhrqks) {
            mui.toast('请填写发货日期开始');
            return;
        }
        if (!fhrqjs) {
            mui.toast('请填写发货日期结束');
            return;
        }


    }

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

            xml += ' <BPM_WGYYFHFPSQ_A>';
            xml += '   <fbillno>自动生成</fbillno>';
            xml += '   <fname>' + fname + '</fname>';
            xml += '   <fqy>' + fqy + '</fqy>';
            xml += '   <fsqrq>' + fsqrq + '</fsqrq>';
            xml += '   <fsqlx>' + fsqlx + '</fsqlx>';
            xml += '   <fkhbm>' + fkhbm + '</fkhbm>';
            xml += '   <fkczz>' + fkzcc + '</fkczz>';
            xml += '   <fkhmc>' + fkhmc + '</fkhmc>';
            xml += ' <fxszg>' + fxszg + '</fxszg>';
            xml += '   <fsh_dz>' + fsh_dz + '</fsh_dz>';
            xml += '   <fsh_name>' + fsh_name + '</fsh_name>';
            xml += '  <fsh_tel>' + fsh_tel + '</fsh_tel>';
            xml += '   <fdhrq>' + fdhrq + '</fdhrq>';
            xml += '   <fkhlx>' + fkhlx + '</fkhlx>';
            xml += '   <fdqqk>' + fdqqk + '</fdqqk>';
            xml += '   <fcsxq>' + fcsxq + '</fcsxq>';
            xml += '  <fckdh>' + fckdh + '</fckdh>';
            xml += '  <fhj_fhsl>' + fhj_fhsl + '</fhj_fhsl>';
            xml += '   <fsjfhsltotal>' + fsjfhsltotal + '</fsjfhsltotal>';
            xml += '   <fhj_fhje>' + fhj_fhje + '</fhj_fhje>';
            xml += '  <fhj_fhjs>' + fhj_fhjs + '</fhj_fhjs>';
            xml += '   <ffh_bz>' + ffh_bz + '</ffh_bz>';
            xml += '   <ffplb>' + ffplb + '</ffplb>';
            xml += '   <fsj_name>' + fsj_name + '</fsj_name>';
            xml += '   <fsj_tel>' + fsj_tel + '</fsj_tel>';
            xml += '   <fyjdz>' + fyjdz + '</fyjdz>';
            xml += '   <fkd_gs>' + fkd_gs + '</fkd_gs>';
            xml += '   <fkd_dh>' + fkd_dh + '</fkd_dh>';
            xml += '   <ffph>' + ffph + '</ffph>';
            xml += '   <fhrqks>' + fhrqks + '</fhrqks>';
            xml += '   <fhrqjs>' + fhrqjs + '</fhrqjs>';
            xml += '    <fhj_fpsl>' + fhj_fpsl + '</fhj_fpsl>';
            xml += '   <fhj_fpje>' + fhj_fpje + '</fhj_fpje>';
            xml += '   <ffp_bz>' + ffp_bz + '</ffp_bz>';
            xml += '  </BPM_WGYYFHFPSQ_A>';
            if (mxlistArrShip.length != 0) {
                for (var i = 0; i < mxlistArrShip.length; i++) {
                    xml += ' <BPM_WGYYFHFPSQ_B1>';
                    xml += '   <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                    xml += '  <RowPrimaryKeys></RowPrimaryKeys>';
                    xml += '  <fentyrno>' + (i + 1) + '</fentyrno>';
                    xml += ' <ffh_wlbm>' + mxlistArrShip[i].fwlbm + '</ffh_wlbm>';
                    xml += ' <ffh_wlmc>' + mxlistArrShip[i].fwlmc + '</ffh_wlmc>';
                    xml += ' <ffh_ggxh>' + mxlistArrShip[i].fggxh + '</ffh_ggxh>';
                    xml += '<ffh_dw>' + mxlistArrShip[i].fdw + '</ffh_dw>';
                    xml += ' <fjldwbm>' + mxlistArrShip[i].fdwbm + '</fjldwbm>';
                    xml += '  <fzl>' + mxlistArrShip[i].fzl + '</fzl>';
                    xml += '  <ffh_bzxs>' + mxlistArrShip[i].ffh_bzxs + '</ffh_bzxs>';
                    xml += ' <ffh_dj>' + mxlistArrShip[i].ffh_dj + '</ffh_dj>';
                    xml += ' <ffh_sl>' + mxlistArrShip[i].ffh_sl + '</ffh_sl>';
                    xml += ' <fsjfhsl>' + mxlistArrShip[i].fsjfhsl + '</fsjfhsl>';
                    xml += '  <ffh_je>' + mxlistArrShip[i].ffh_je + '</ffh_je>';
                    xml += '  <ffh_js>' + parseInt(mxlistArrShip[i].ffh_js) + '</ffh_js>';
                    xml += ' </BPM_WGYYFHFPSQ_B1>';
                }
            } else {
                xml += ' <BPM_WGYYFHFPSQ_B1>';
                xml += '   <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml += '  <RowPrimaryKeys></RowPrimaryKeys>';
                xml += '  <fentyrno></fentyrno>';
                xml += ' <ffh_wlbm></ffh_wlbm>';
                xml += ' <ffh_wlmc></ffh_wlmc>';
                xml += ' <ffh_ggxh></ffh_ggxh>';
                xml += '<ffh_dw></ffh_dw>';
                xml += ' <fjldwbm></fjldwbm>';
                xml += '  <fzl></fzl>';
                xml += '  <ffh_bzxs></ffh_bzxs>';
                xml += ' <ffh_dj></ffh_dj>';
                xml += ' <ffh_sl></ffh_sl>';
                xml += ' <fsjfhsl></fsjfhsl>';
                xml += '  <ffh_je></ffh_je>';
                xml += '  <ffh_js></ffh_js>';
                xml += ' </BPM_WGYYFHFPSQ_B1>';
            }

            if (mxlistArrBill.length != 0) {
                for (var i = 0; i < mxlistArrBill.length; i++) {
                    xml += ' <BPM_WGYYFHFPSQ_B2>';
                    xml += '  <RelationRowGuid>' + (parseInt(mxlistArrShip.length) + 1 + i) + '</RelationRowGuid>';
                    xml += ' <RowPrimaryKeys></RowPrimaryKeys>';
                    xml += ' <fentryno>' + (i + 1) + '</fentryno>';
                    xml += '  <ffp_wlmc>' + mxlistArrBill[i].ffp_wlmc + '</ffp_wlmc>';
                    xml += '  <ffp_ggxh>' + mxlistArrBill[i].ffp_ggxh + '</ffp_ggxh>';
                    xml += ' <ffp_dw>' + mxlistArrBill[i].ffp_dw + '</ffp_dw>';
                    xml += ' <ffp_bzxs>' + mxlistArrBill[i].ffp_bzxs + '</ffp_bzxs>';
                    xml += ' <ffp_dj>' + mxlistArrBill[i].ffp_dj + '</ffp_dj>';
                    xml += ' <ffp_sl>' + mxlistArrBill[i].ffp_sl + '</ffp_sl>';
                    xml += ' <ffp_je>' + mxlistArrBill[i].ffp_je + '</ffp_je>';
                    xml += ' </BPM_WGYYFHFPSQ_B2>';

                }

            } else {
                xml += ' <BPM_WGYYFHFPSQ_B2>';
                xml += '  <RelationRowGuid>' + (parseInt(mxlistArrShip.length) + 1) + '</RelationRowGuid>';

                xml += ' <RowPrimaryKeys></RowPrimaryKeys>';
                xml += ' <fentryno>1</fentryno>';
                xml += '  <ffp_wlmc></ffp_wlmc>';
                xml += '  <ffp_ggxh></ffp_ggxh>';
                xml += ' <ffp_dw></ffp_dw>';
                xml += ' <ffp_bzxs></ffp_bzxs>';
                xml += ' <ffp_dj></ffp_dj>';
                xml += ' <ffp_sl></ffp_sl>';
                xml += ' <ffp_je></ffp_je>';
                xml += ' </BPM_WGYYFHFPSQ_B2>';

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
    var fno = $("#fname").data('fno');
    var fqy = $("#fqy").val();
    var fsqrq = $("#fsqrq").val();
    var fsqlx = $("#fsqlx").val();
    var fkhmc = $("#fkhmc").val();
    var fkhbm = $("#fkhmc").data('fkhbm');
    var fkzcc = $("#fkhmc").data('fkzcc');
    var fzjsj = $("#fzjsj").val();
    var fxszg = $("#fzjsj").data('fxszg');
    var fsh_dz = $("#fsh_dz").val();
    var fsh_name = $("#fsh_name").val();
    var fsh_tel = $("#fsh_tel").val();
    var fdhrq = $("#fdhrq").val();
    var fkhlx = $("#fkhlx").val();
    var fdqqk = $("#fdqqk").val();
    var fcsxq = $("#fcsxq").val();
    var fckdh = $("#fckdh").val();
    var fhj_fhsl = $("#fhj_fhsl").val();
    var fsjfhsltotal = $("#fsjfhsltotal").val();
    var fhj_fhje = $("#fhj_fhje").val();
    var fhj_fhjs = $("#fhj_fhjs").val();

    var mxflag = false;
    var mxlistArrShip = new Array();
    $("#mxlist_fh").find("#mx").each(function () {

        var fwlbm = $(this).find("#fwlbm").val();
        var fwlmc = $(this).find("#fwlmc").val();
        var fggxh = $(this).find("#fggxh").val();
        var fdw = $(this).find("#fdw").val();
        var fdwbm = $(this).find("#fdwbm").val();
        var fzl = $(this).find("#fzl").val();
        var ffh_bzxs = $(this).find("#ffh_bzxs").val();
        var ffh_dj = $(this).find("#ffh_dj").val();
        var ffh_sl = $(this).find("#ffh_sl").val();
        var fsjfhsl = $(this).find("#fsjfhsl").val();
        var ffh_je = $(this).find("#ffh_je").val();
        var ffh_js = $(this).find("#ffh_js").val();

       

        var mx = mxItemShip(fwlbm, fwlmc, fggxh, fdw, fdwbm, fzl, ffh_bzxs, ffh_dj, ffh_sl, fsjfhsl, ffh_je, ffh_js);
        mxlistArrShip.push(mx);
    });


    var ffh_bz = $("#ffh_bz").val();
    var ffplb = $("#ffplb").val();
    var fsj_name = $("#fsj_name").val();
    var fsj_tel = $("#fsj_tel").val();
    var fyjdz = $("#fyjdz").val();
    var fkd_gs = $("#fkd_gs").val();
    var fkd_dh = $("#fkd_dh").val();
    var ffph = $("#ffph").val();
    var fhrqks = $("#fhrqks").val();
    var fhrqjs = $("#fhrqjs").val();

    var fhj_fpsl = $("#fhj_fpsl").val();
    var fhj_fpje = $("#fhj_fpje").val();



    var mxlistArrBill = new Array();

    $("#mxlist_fp").find("#mx").each(function () {
        var ffp_wlmc = $(this).find("#ffp_wlmc").val();
        var ffp_ggxh = $(this).find("#ffp_ggxh").val();
        var ffp_dw = $(this).find("#ffp_dw").val();
        var ffp_bzxs = $(this).find("#ffp_bzxs").val();
        var ffp_dj = $(this).find("#ffp_dj").val();
        var ffp_sl = $(this).find("#ffp_sl").val();
        var ffp_je = $(this).find("#ffp_je").val();
       
        var mx = mxItemBill(ffp_wlmc, ffp_ggxh, ffp_dw, ffp_bzxs, ffp_dj, ffp_sl, ffp_je);
        mxlistArrBill.push(mx);
    });

    var ffp_bz = $("#ffp_bz").val();
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
            xml += ' <BPM_WGYYFHFPSQ_A>';
            xml += '   <fbillno>' + fbillno + '</fbillno>';
            xml += '   <fname>' + fname + '</fname>';
            xml += '   <fqy>' + fqy + '</fqy>';
            xml += '   <fsqrq>' + fsqrq + '</fsqrq>';
            xml += '   <fsqlx>' + fsqlx + '</fsqlx>';
            xml += '   <fkhbm>' + fkhbm + '</fkhbm>';
            xml += '   <fkczz>' + fkzcc + '</fkczz>';
            xml += '   <fkhmc>' + fkhmc + '</fkhmc>';
            xml += ' <fxszg>' + fxszg + '</fxszg>';
            xml += '   <fsh_dz>' + fsh_dz + '</fsh_dz>';
            xml += '   <fsh_name>' + fsh_name + '</fsh_name>';
            xml += '  <fsh_tel>' + fsh_tel + '</fsh_tel>';
            xml += '   <fdhrq>' + fdhrq + '</fdhrq>';
            xml += '   <fkhlx>' + fkhlx + '</fkhlx>';
            xml += '   <fdqqk>' + fdqqk + '</fdqqk>';
            xml += '   <fcsxq>' + fcsxq + '</fcsxq>';
            xml += '  <fckdh>' + fckdh + '</fckdh>';
            xml += '  <fhj_fhsl>' + fhj_fhsl + '</fhj_fhsl>';
            xml += '   <fsjfhsltotal>' + fsjfhsltotal + '</fsjfhsltotal>';
            xml += '   <fhj_fhje>' + fhj_fhje + '</fhj_fhje>';
            xml += '  <fhj_fhjs>' + fhj_fhjs + '</fhj_fhjs>';
            xml += '   <ffh_bz>' + ffh_bz + '</ffh_bz>';
            xml += '   <ffplb>' + ffplb + '</ffplb>';
            xml += '   <fsj_name>' + fsj_name + '</fsj_name>';
            xml += '   <fsj_tel>' + fsj_tel + '</fsj_tel>';
            xml += '   <fyjdz>' + fyjdz + '</fyjdz>';
            xml += '   <fkd_gs>' + fkd_gs + '</fkd_gs>';
            xml += '   <fkd_dh>' + fkd_dh + '</fkd_dh>';
            xml += '   <ffph>' + ffph + '</ffph>';
            xml += '   <fhrqks>' + fhrqks + '</fhrqks>';
            xml += '   <fhrqjs>' + fhrqjs + '</fhrqjs>';
            xml += '    <fhj_fpsl>' + fhj_fpsl + '</fhj_fpsl>';
            xml += '   <fhj_fpje>' + fhj_fpje + '</fhj_fpje>';
            xml += '   <ffp_bz>' + ffp_bz + '</ffp_bz>';
            xml += '  </BPM_WGYYFHFPSQ_A>';
            if (mxlistArrShip.length != 0) {
                for (var i = 0; i < mxlistArrShip.length; i++) {
                    xml += ' <BPM_WGYYFHFPSQ_B1>';
                    xml += '   <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                    xml += '  <RowPrimaryKeys>itemid=' + itemidArr1[i] + '</RowPrimaryKeys>';
                    xml += '  <fentyrno>' + (i + 1) + '</fentyrno>';
                    xml += ' <ffh_wlbm>' + mxlistArrShip[i].fwlbm + '</ffh_wlbm>';
                    xml += ' <ffh_wlmc>' + mxlistArrShip[i].fwlmc + '</ffh_wlmc>';
                    xml += ' <ffh_ggxh>' + mxlistArrShip[i].fggxh + '</ffh_ggxh>';
                    xml += '<ffh_dw>' + mxlistArrShip[i].fdw + '</ffh_dw>';
                    xml += ' <fjldwbm>' + mxlistArrShip[i].fdwbm + '</fjldwbm>';
                    xml += '  <fzl>' + mxlistArrShip[i].fzl + '</fzl>';
                    xml += '  <ffh_bzxs>' + mxlistArrShip[i].ffh_bzxs + '</ffh_bzxs>';
                    xml += ' <ffh_dj>' + mxlistArrShip[i].ffh_dj + '</ffh_dj>';
                    xml += ' <ffh_sl>' + mxlistArrShip[i].ffh_sl + '</ffh_sl>';
                    xml += ' <fsjfhsl>' + mxlistArrShip[i].fsjfhsl + '</fsjfhsl>';
                    xml += '  <ffh_je>' + mxlistArrShip[i].ffh_je + '</ffh_je>';
                    xml += '  <ffh_js>' + parseInt(mxlistArrShip[i].ffh_js) + '</ffh_js>';
                    xml += ' </BPM_WGYYFHFPSQ_B1>';
                }
            } else {
                xml += ' <BPM_WGYYFHFPSQ_B1>';
                xml += '   <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml += '  <RowPrimaryKeys></RowPrimaryKeys>';
                xml += '  <fentyrno></fentyrno>';
                xml += ' <ffh_wlbm></ffh_wlbm>';
                xml += ' <ffh_wlmc></ffh_wlmc>';
                xml += ' <ffh_ggxh></ffh_ggxh>';
                xml += '<ffh_dw></ffh_dw>';
                xml += ' <fjldwbm></fjldwbm>';
                xml += '  <fzl></fzl>';
                xml += '  <ffh_bzxs></ffh_bzxs>';
                xml += ' <ffh_dj></ffh_dj>';
                xml += ' <ffh_sl></ffh_sl>';
                xml += ' <fsjfhsl></fsjfhsl>';
                xml += '  <ffh_je></ffh_je>';
                xml += '  <ffh_js></ffh_js>';
                xml += ' </BPM_WGYYFHFPSQ_B1>';
            }

            if (mxlistArrBill.length != 0) {
                for (var i = 0; i < mxlistArrBill.length; i++) {
                    xml += ' <BPM_WGYYFHFPSQ_B2>';
                    xml += '  <RelationRowGuid>' + (parseInt(mxlistArrShip.length) + 1 + i) + '</RelationRowGuid>';
                    xml += ' <RowPrimaryKeys>itemid=' + itemidArr2[i] + '</RowPrimaryKeys>';
                    xml += ' <fentryno>' + (i + 1) + '</fentryno>';
                    xml += '  <ffp_wlmc>' + mxlistArrBill[i].ffp_wlmc + '</ffp_wlmc>';
                    xml += '  <ffp_ggxh>' + mxlistArrBill[i].ffp_ggxh + '</ffp_ggxh>';
                    xml += ' <ffp_dw>' + mxlistArrBill[i].ffp_dw + '</ffp_dw>';
                    xml += ' <ffp_bzxs>' + mxlistArrBill[i].ffp_bzxs + '</ffp_bzxs>';
                    xml += ' <ffp_dj>' + mxlistArrBill[i].ffp_dj + '</ffp_dj>';
                    xml += ' <ffp_sl>' + mxlistArrBill[i].ffp_sl + '</ffp_sl>';
                    xml += ' <ffp_je>' + mxlistArrBill[i].ffp_je + '</ffp_je>';
                    xml += ' </BPM_WGYYFHFPSQ_B2>';

                }

            } else {
                xml += ' <BPM_WGYYFHFPSQ_B2>';
                xml += '  <RelationRowGuid>' + (parseInt(mxlistArrShip.length) + 1) + '</RelationRowGuid>';

                xml += ' <RowPrimaryKeys></RowPrimaryKeys>';
                xml += ' <fentryno>1</fentryno>';
                xml += '  <ffp_wlmc></ffp_wlmc>';
                xml += '  <ffp_ggxh></ffp_ggxh>';
                xml += ' <ffp_dw></ffp_dw>';
                xml += ' <ffp_bzxs></ffp_bzxs>';
                xml += ' <ffp_dj></ffp_dj>';
                xml += ' <ffp_sl></ffp_sl>';
                xml += ' <ffp_je></ffp_je>';
                xml += ' </BPM_WGYYFHFPSQ_B2>';

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
    var fno = $("#fname").data('fno');
    var fqy = $("#fqy").val();
    var fsqrq = $("#fsqrq").val();
    var fsqlx = $("#fsqlx").val();
    var fkhmc = $("#fkhmc").val();
    var fkhbm = $("#fkhmc").data('fkhbm');
    var fkzcc = $("#fkhmc").data('fkzcc');
    var fzjsj = $("#fzjsj").val();
    var fxszg = $("#fzjsj").data('fxszg');
    var fsh_dz = $("#fsh_dz").val();
    var fsh_name = $("#fsh_name").val();
    var fsh_tel = $("#fsh_tel").val();
    var fdhrq = $("#fdhrq").val();
    var fkhlx = $("#fkhlx").val();
    var fdqqk = $("#fdqqk").val();
    var fcsxq = $("#fcsxq").val();
    var fckdh = $("#fckdh").val();
    var fhj_fhsl = $("#fhj_fhsl").val();
    var fsjfhsltotal = $("#fsjfhsltotal").val();
    var fhj_fhje = $("#fhj_fhje").val();
    var fhj_fhjs = $("#fhj_fhjs").val();

    var mxflag = false;
    var mxlistArrShip = new Array();
    $("#mxlist_fh").find("#mx").each(function () {

        var fwlbm = $(this).find("#fwlbm").val();
        var fwlmc = $(this).find("#fwlmc").val();
        var fggxh = $(this).find("#fggxh").val();
        var fdw = $(this).find("#fdw").val();
        var fdwbm = $(this).find("#fdwbm").val();
        var fzl = $(this).find("#fzl").val();
        var ffh_bzxs = $(this).find("#ffh_bzxs").val();
        var ffh_dj = $(this).find("#ffh_dj").val();
        var ffh_sl = $(this).find("#ffh_sl").val();
        var fsjfhsl = $(this).find("#fsjfhsl").val();
        var ffh_je = $(this).find("#ffh_je").val();
        var ffh_js = $(this).find("#ffh_js").val();



        var mx = mxItemShip(fwlbm, fwlmc, fggxh, fdw, fdwbm, fzl, ffh_bzxs, ffh_dj, ffh_sl, fsjfhsl, ffh_je, ffh_js);
        mxlistArrShip.push(mx);
    });


    var ffh_bz = $("#ffh_bz").val();
    var ffplb = $("#ffplb").val();
    var fsj_name = $("#fsj_name").val();
    var fsj_tel = $("#fsj_tel").val();
    var fyjdz = $("#fyjdz").val();
    var fkd_gs = $("#fkd_gs").val();
    var fkd_dh = $("#fkd_dh").val();
    var ffph = $("#ffph").val();
    var fhrqks = $("#fhrqks").val();
    var fhrqjs = $("#fhrqjs").val();

    var fhj_fpsl = $("#fhj_fpsl").val();
    var fhj_fpje = $("#fhj_fpje").val();



    var mxlistArrBill = new Array();

    $("#mxlist_fp").find("#mx").each(function () {
        var ffp_wlmc = $(this).find("#ffp_wlmc").val();
        var ffp_ggxh = $(this).find("#ffp_ggxh").val();
        var ffp_dw = $(this).find("#ffp_dw").val();
        var ffp_bzxs = $(this).find("#ffp_bzxs").val();
        var ffp_dj = $(this).find("#ffp_dj").val();
        var ffp_sl = $(this).find("#ffp_sl").val();
        var ffp_je = $(this).find("#ffp_je").val();

        var mx = mxItemBill(ffp_wlmc, ffp_ggxh, ffp_dw, ffp_bzxs, ffp_dj, ffp_sl, ffp_je);
        mxlistArrBill.push(mx);
    });

    var ffp_bz = $("#ffp_bz").val();

    //特殊节点必填项校验

    //console.log($("#nodeName").val());

    //商务专员1
    if (String(nodeName).match(/\d+/g) == null || String(nodeName).match('（营销一区）1') != null) {

        if (!fckdh) {
            mui.toast('请填写出库单号');
            return;
        }

        //核算专员
    } else if (String(nodeName).match('核算专员') != null) {

        

        //发票专员
    } else if (String(nodeName).match('开票专员') != null) {

        if (!ffph) {
            mui.toast('请填写发票号');
            return;
        }
     

        //商务专员2
    } else if (String(nodeName).match(/\d+/g) != null && String(nodeName).match('商务') != null) {

        if (!fkd_gs) {
            mui.toast('请选择快递公司');
            return;
        }
        if (!fkd_dh) {
            mui.toast('请选择快递单号');
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

            xml += ' <BPM_WGYYFHFPSQ_A>';
            xml += '   <fbillno>' + fbillno + '</fbillno>';
            xml += '   <fname>' + fname + '</fname>';
            xml += '   <fqy>' + fqy + '</fqy>';
            xml += '   <fsqrq>' + fsqrq + '</fsqrq>';
            xml += '   <fsqlx>' + fsqlx + '</fsqlx>';
            xml += '   <fkhbm>' + fkhbm + '</fkhbm>';
            xml += '   <fkczz>' + fkzcc + '</fkczz>';
            xml += '   <fkhmc>' + fkhmc + '</fkhmc>';
            xml += ' <fxszg>' + fxszg + '</fxszg>';
            xml += '   <fsh_dz>' + fsh_dz + '</fsh_dz>';
            xml += '   <fsh_name>' + fsh_name + '</fsh_name>';
            xml += '  <fsh_tel>' + fsh_tel + '</fsh_tel>';
            xml += '   <fdhrq>' + fdhrq + '</fdhrq>';
            xml += '   <fkhlx>' + fkhlx + '</fkhlx>';
            xml += '   <fdqqk>' + fdqqk + '</fdqqk>';
            xml += '   <fcsxq>' + fcsxq + '</fcsxq>';
            xml += '  <fckdh>' + fckdh + '</fckdh>';
            xml += '  <fhj_fhsl>' + fhj_fhsl + '</fhj_fhsl>';
            xml += '   <fsjfhsltotal>' + fsjfhsltotal + '</fsjfhsltotal>';
            xml += '   <fhj_fhje>' + fhj_fhje + '</fhj_fhje>';
            xml += '  <fhj_fhjs>' + fhj_fhjs + '</fhj_fhjs>';
            xml += '   <ffh_bz>' + ffh_bz + '</ffh_bz>';
            xml += '   <ffplb>' + ffplb + '</ffplb>';
            xml += '   <fsj_name>' + fsj_name + '</fsj_name>';
            xml += '   <fsj_tel>' + fsj_tel + '</fsj_tel>';
            xml += '   <fyjdz>' + fyjdz + '</fyjdz>';
            xml += '   <fkd_gs>' + fkd_gs + '</fkd_gs>';
            xml += '   <fkd_dh>' + fkd_dh + '</fkd_dh>';
            xml += '   <ffph>' + ffph + '</ffph>';
            xml += '   <fhrqks>' + fhrqks + '</fhrqks>';
            xml += '   <fhrqjs>' + fhrqjs + '</fhrqjs>';
            xml += '    <fhj_fpsl>' + fhj_fpsl + '</fhj_fpsl>';
            xml += '   <fhj_fpje>' + fhj_fpje + '</fhj_fpje>';
            xml += '   <ffp_bz>' + ffp_bz + '</ffp_bz>';
            xml += '  </BPM_WGYYFHFPSQ_A>';
            if (mxlistArrShip.length != 0) {
                for (var i = 0; i < mxlistArrShip.length; i++) {
                    xml += ' <BPM_WGYYFHFPSQ_B1>';
                    xml += '   <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                    xml += '  <RowPrimaryKeys>itemid=' + itemidArr1[i] + '</RowPrimaryKeys>';
                    xml += '  <fentyrno>' + (i + 1) + '</fentyrno>';
                    xml += ' <ffh_wlbm>' + mxlistArrShip[i].fwlbm + '</ffh_wlbm>';
                    xml += ' <ffh_wlmc>' + mxlistArrShip[i].fwlmc + '</ffh_wlmc>';
                    xml += ' <ffh_ggxh>' + mxlistArrShip[i].fggxh + '</ffh_ggxh>';
                    xml += '<ffh_dw>' + mxlistArrShip[i].fdw + '</ffh_dw>';
                    xml += ' <fjldwbm>' + mxlistArrShip[i].fdwbm + '</fjldwbm>';
                    xml += '  <fzl>' + mxlistArrShip[i].fzl + '</fzl>';
                    xml += '  <ffh_bzxs>' + mxlistArrShip[i].ffh_bzxs + '</ffh_bzxs>';
                    xml += ' <ffh_dj>' + mxlistArrShip[i].ffh_dj + '</ffh_dj>';
                    xml += ' <ffh_sl>' + mxlistArrShip[i].ffh_sl + '</ffh_sl>';
                    xml += ' <fsjfhsl>' + mxlistArrShip[i].fsjfhsl + '</fsjfhsl>';
                    xml += '  <ffh_je>' + mxlistArrShip[i].ffh_je + '</ffh_je>';
                    xml += '  <ffh_js>' + parseInt(mxlistArrShip[i].ffh_js) + '</ffh_js>';
                    xml += ' </BPM_WGYYFHFPSQ_B1>';
                }
            } else {
                xml += ' <BPM_WGYYFHFPSQ_B1>';
                xml += '   <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml += '  <RowPrimaryKeys></RowPrimaryKeys>';
                xml += '  <fentyrno></fentyrno>';
                xml += ' <ffh_wlbm></ffh_wlbm>';
                xml += ' <ffh_wlmc></ffh_wlmc>';
                xml += ' <ffh_ggxh></ffh_ggxh>';
                xml += '<ffh_dw></ffh_dw>';
                xml += ' <fjldwbm></fjldwbm>';
                xml += '  <fzl></fzl>';
                xml += '  <ffh_bzxs></ffh_bzxs>';
                xml += ' <ffh_dj></ffh_dj>';
                xml += ' <ffh_sl></ffh_sl>';
                xml += ' <fsjfhsl></fsjfhsl>';
                xml += '  <ffh_je></ffh_je>';
                xml += '  <ffh_js></ffh_js>';
                xml += ' </BPM_WGYYFHFPSQ_B1>';
            }

            if (mxlistArrBill.length != 0) {
                for (var i = 0; i < mxlistArrBill.length; i++) {
                    xml += ' <BPM_WGYYFHFPSQ_B2>';
                    xml += '  <RelationRowGuid>' + (parseInt(mxlistArrShip.length) + 1 + i) + '</RelationRowGuid>';
                    xml += ' <RowPrimaryKeys>itemid=' + itemidArr2[i] + '</RowPrimaryKeys>';
                    xml += ' <fentryno>' + (i + 1) + '</fentryno>';
                    xml += '  <ffp_wlmc>' + mxlistArrBill[i].ffp_wlmc + '</ffp_wlmc>';
                    xml += '  <ffp_ggxh>' + mxlistArrBill[i].ffp_ggxh + '</ffp_ggxh>';
                    xml += ' <ffp_dw>' + mxlistArrBill[i].ffp_dw + '</ffp_dw>';
                    xml += ' <ffp_bzxs>' + mxlistArrBill[i].ffp_bzxs + '</ffp_bzxs>';
                    xml += ' <ffp_dj>' + mxlistArrBill[i].ffp_dj + '</ffp_dj>';
                    xml += ' <ffp_sl>' + mxlistArrBill[i].ffp_sl + '</ffp_sl>';
                    xml += ' <ffp_je>' + mxlistArrBill[i].ffp_je + '</ffp_je>';
                    xml += ' </BPM_WGYYFHFPSQ_B2>';

                }

            } else {
                xml += ' <BPM_WGYYFHFPSQ_B2>';
                xml += '  <RelationRowGuid>' + (parseInt(mxlistArrShip.length) + 1) + '</RelationRowGuid>';

                xml += ' <RowPrimaryKeys></RowPrimaryKeys>';
                xml += ' <fentryno>1</fentryno>';
                xml += '  <ffp_wlmc></ffp_wlmc>';
                xml += '  <ffp_ggxh></ffp_ggxh>';
                xml += ' <ffp_dw></ffp_dw>';
                xml += ' <ffp_bzxs></ffp_bzxs>';
                xml += ' <ffp_dj></ffp_dj>';
                xml += ' <ffp_sl></ffp_sl>';
                xml += ' <ffp_je></ffp_je>';
                xml += ' </BPM_WGYYFHFPSQ_B2>';

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

        xml += ' <BPM_WGYYFHFPSQ_A>';
        xml += '   <fbillno>' + fbillno + '</fbillno>';
        xml += '   <fname>' + fname + '</fname>';
        xml += '   <fqy>' + fqy + '</fqy>';
        xml += '   <fsqrq>' + fsqrq + '</fsqrq>';
        xml += '   <fsqlx>' + fsqlx + '</fsqlx>';
        xml += '   <fkhbm>' + fkhbm + '</fkhbm>';
        xml += '   <fkczz>' + fkzcc + '</fkczz>';
        xml += '   <fkhmc>' + fkhmc + '</fkhmc>';
        xml += ' <fxszg>' + fxszg + '</fxszg>';
        xml += '   <fsh_dz>' + fsh_dz + '</fsh_dz>';
        xml += '   <fsh_name>' + fsh_name + '</fsh_name>';
        xml += '  <fsh_tel>' + fsh_tel + '</fsh_tel>';
        xml += '   <fdhrq>' + fdhrq + '</fdhrq>';
        xml += '   <fkhlx>' + fkhlx + '</fkhlx>';
        xml += '   <fdqqk>' + fdqqk + '</fdqqk>';
        xml += '   <fcsxq>' + fcsxq + '</fcsxq>';
        xml += '  <fckdh>' + fckdh + '</fckdh>';
        xml += '  <fhj_fhsl>' + fhj_fhsl + '</fhj_fhsl>';
        xml += '   <fsjfhsltotal>' + fsjfhsltotal + '</fsjfhsltotal>';
        xml += '   <fhj_fhje>' + fhj_fhje + '</fhj_fhje>';
        xml += '  <fhj_fhjs>' + fhj_fhjs + '</fhj_fhjs>';
        xml += '   <ffh_bz>' + ffh_bz + '</ffh_bz>';
        xml += '   <ffplb>' + ffplb + '</ffplb>';
        xml += '   <fsj_name>' + fsj_name + '</fsj_name>';
        xml += '   <fsj_tel>' + fsj_tel + '</fsj_tel>';
        xml += '   <fyjdz>' + fyjdz + '</fyjdz>';
        xml += '   <fkd_gs>' + fkd_gs + '</fkd_gs>';
        xml += '   <fkd_dh>' + fkd_dh + '</fkd_dh>';
        xml += '   <ffph>' + ffph + '</ffph>';
        xml += '   <fhrqks>' + fhrqks + '</fhrqks>';
        xml += '   <fhrqjs>' + fhrqjs + '</fhrqjs>';
        xml += '    <fhj_fpsl>' + fhj_fpsl + '</fhj_fpsl>';
        xml += '   <fhj_fpje>' + fhj_fpje + '</fhj_fpje>';
        xml += '   <ffp_bz>' + ffp_bz + '</ffp_bz>';
        xml += '  </BPM_WGYYFHFPSQ_A>';
        if (mxlistArrShip.length != 0) {
            for (var i = 0; i < mxlistArrShip.length; i++) {
                xml += ' <BPM_WGYYFHFPSQ_B1>';
                xml += '   <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml += '  <RowPrimaryKeys>itemid=' + itemidArr1[i] + '</RowPrimaryKeys>';
                xml += '  <fentyrno>' + (i + 1) + '</fentyrno>';
                xml += ' <ffh_wlbm>' + mxlistArrShip[i].fwlbm + '</ffh_wlbm>';
                xml += ' <ffh_wlmc>' + mxlistArrShip[i].fwlmc + '</ffh_wlmc>';
                xml += ' <ffh_ggxh>' + mxlistArrShip[i].fggxh + '</ffh_ggxh>';
                xml += '<ffh_dw>' + mxlistArrShip[i].fdw + '</ffh_dw>';
                xml += ' <fjldwbm>' + mxlistArrShip[i].fdwbm + '</fjldwbm>';
                xml += '  <fzl>' + mxlistArrShip[i].fzl + '</fzl>';
                xml += '  <ffh_bzxs>' + mxlistArrShip[i].ffh_bzxs + '</ffh_bzxs>';
                xml += ' <ffh_dj>' + mxlistArrShip[i].ffh_dj + '</ffh_dj>';
                xml += ' <ffh_sl>' + mxlistArrShip[i].ffh_sl + '</ffh_sl>';
                xml += ' <fsjfhsl>' + mxlistArrShip[i].fsjfhsl + '</fsjfhsl>';
                xml += '  <ffh_je>' + mxlistArrShip[i].ffh_je + '</ffh_je>';
                xml += '  <ffh_js>' + parseInt(mxlistArrShip[i].ffh_js) + '</ffh_js>';
                xml += ' </BPM_WGYYFHFPSQ_B1>';
            }
        } else {
            xml += ' <BPM_WGYYFHFPSQ_B1>';
            xml += '   <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
            xml += '  <RowPrimaryKeys></RowPrimaryKeys>';
            xml += '  <fentyrno></fentyrno>';
            xml += ' <ffh_wlbm></ffh_wlbm>';
            xml += ' <ffh_wlmc></ffh_wlmc>';
            xml += ' <ffh_ggxh></ffh_ggxh>';
            xml += '<ffh_dw></ffh_dw>';
            xml += ' <fjldwbm></fjldwbm>';
            xml += '  <fzl></fzl>';
            xml += '  <ffh_bzxs></ffh_bzxs>';
            xml += ' <ffh_dj></ffh_dj>';
            xml += ' <ffh_sl></ffh_sl>';
            xml += ' <fsjfhsl></fsjfhsl>';
            xml += '  <ffh_je></ffh_je>';
            xml += '  <ffh_js></ffh_js>';
            xml += ' </BPM_WGYYFHFPSQ_B1>';
        }

        if (mxlistArrBill.length != 0) {
            for (var i = 0; i < mxlistArrBill.length; i++) {
                xml += ' <BPM_WGYYFHFPSQ_B2>';
                xml += '  <RelationRowGuid>' + (parseInt(mxlistArrShip.length) + 1 + i) + '</RelationRowGuid>';
                xml += ' <RowPrimaryKeys>itemid=' + itemidArr2[i] + '</RowPrimaryKeys>';
                xml += ' <fentryno>' + (i + 1) + '</fentryno>';
                xml += '  <ffp_wlmc>' + mxlistArrBill[i].ffp_wlmc + '</ffp_wlmc>';
                xml += '  <ffp_ggxh>' + mxlistArrBill[i].ffp_ggxh + '</ffp_ggxh>';
                xml += ' <ffp_dw>' + mxlistArrBill[i].ffp_dw + '</ffp_dw>';
                xml += ' <ffp_bzxs>' + mxlistArrBill[i].ffp_bzxs + '</ffp_bzxs>';
                xml += ' <ffp_dj>' + mxlistArrBill[i].ffp_dj + '</ffp_dj>';
                xml += ' <ffp_sl>' + mxlistArrBill[i].ffp_sl + '</ffp_sl>';
                xml += ' <ffp_je>' + mxlistArrBill[i].ffp_je + '</ffp_je>';
                xml += ' </BPM_WGYYFHFPSQ_B2>';

            }

        } else {
            xml += ' <BPM_WGYYFHFPSQ_B2>';
            xml += '  <RelationRowGuid>' + (parseInt(mxlistArrShip.length) + 1) + '</RelationRowGuid>';

            xml += ' <RowPrimaryKeys></RowPrimaryKeys>';
            xml += ' <fentryno>1</fentryno>';
            xml += '  <ffp_wlmc></ffp_wlmc>';
            xml += '  <ffp_ggxh></ffp_ggxh>';
            xml += ' <ffp_dw></ffp_dw>';
            xml += ' <ffp_bzxs></ffp_bzxs>';
            xml += ' <ffp_dj></ffp_dj>';
            xml += ' <ffp_sl></ffp_sl>';
            xml += ' <ffp_je></ffp_je>';
            xml += ' </BPM_WGYYFHFPSQ_B2>';

        }



        xml = xml + '</FormData>';
        xml = xml + '</XForm>';
        PostXml(xml);
    }

}