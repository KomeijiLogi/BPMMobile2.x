function prepMsg() {
    tapEvent();
    $("#fsqrq").val(getNowFormatDate(2));
    //getBPMParam();
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

//全局变量定义部分


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

var check_event_flag = 0; //选中事件flag  0 选中客户 2 选中发票 1 选中发货  

var busying = false;

var menuWrapper = document.getElementById("menu-wrapper");
var menu = document.getElementById("menu");
var menuWrapperClassList = menuWrapper.classList;
var backdrop = document.getElementById("menu-backdrop");


function tapEvent() {
    //所属区域

    var fqydata = [
        {
            value: '',
            text: '营销一区_内镜洗消专线'
        },
        {
            value: '',
            text: '营销一区_消毒产品专线'
        },
        {
            value: '',
            text: '营销一区_肾科产品专线'
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
            text: '营销四区_湖南江西'
        },
        {
            value: '',
            text: '营销四区_两广海南'
        },
        {
            value: '',
            text: '营销五区_上海'
        },
        {
            value: '',
            text: '营销五区_江苏'
        },
        {
            value: '',
            text: '营销五区_浙江'
        },
        {
            value: '',
            text: '营销五区_福建'
        },
        {
            value: '',
            text: '营销六区_陕甘宁青新'
        },
        {
            value: '',
            text: '营销六区_山西'
        },
        {
            value: '',
            text: '营销七区_京津'
        },
        {
            value: '',
            text: '营销七区_河北'
        },
        {
            value: '',
            text: '营销八区_安徽'
        },
        {
            value: '',
            text: '营销八区_河南'
        }
    ];
    showPicker('fqy', fqydata);

    //申请类型
    var fsqlxdata = [
        {
            value: '',
            text: '发货申请'
        },
        {
            value: '',
            text: '发票申请'
        },
        {
            value: '',
            text: '发货/发票申请'
        }

    ];
    showPicker('fsqlx', fsqlxdata);

    //直接上级



    var ele2 = document.getElementById('fzjsj');

    var picker2 = new mui.PopPicker();

    picker2.setData(fzjsjdata);

    ele2.addEventListener('tap', function () {

        picker2.show(function (items) {

            ele2.value = items[0].text;
            $(ele2).data('fxszg', items[0].value);

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
            text: '授信期客户'
        },
        {
            value: '',
            text: '款到发货客户'
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
                $("#fcsxqd").parent().show();

            } else {
                $("#fcsxqd").parent().hide();
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
            text: '专用发票'
        },
        {
            value: '',
            text: '普通发票'
        }
    ];

    showPicker('ffplb', ffplbdata);


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
    showPicker('ffh_bzxs_menu', ffh_bzxsdata);

    $("#fkhmc").on('tap', () => {
        check_event_flag = 0;
        getProcedureMsg(0);
        $("#wrapper").hide();
        $("#selector").show();
    });
    $("#tjmx_fh").on('tap', () => {
        check_event_flag = 1;
        getProcedureMsg(1);
        toggleMenu();
        
    });
    $("#tjmx_fp").on('tap', () => {
        check_event_flag = 2;
        getProcedureMsg(1);


       
    });

    //从索引列表中返回表单
    $(".mui-icon-left-nav").on('tap', function () {
        $("#wrapper").show();
        $("#selector").hide();

    });


    //自动计算事件
    $("#ffh_sl_menu").on('input', function () {
        $("#fsjfhsl_menu").val($(this).val());
    })
    $("#menu").find("input[type='number']").on('input', function () {

        calcPriceShip(this);
    });

    $("#confirm_menu").on('tap', () => {
         //校验必填项


        //弹出层输入数据绑定生成子表并添加到头部，始终保持头部是最新加的
       
        var li = `
           <div class="mui-card">
              <div class="mui-input-row itemtitle">
                   <label></label>    
                   <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>
              </div>
              <div class="mui-row">
                 <input type="text" id="fwlbm" name="fwlbm" readonly placeholder="物料编码" value="${$("#fwlbm_menu").val()}" style="width:33%;" class="mui-col-xs-4"/>
                 <input type="text" id="fwlmc" name="fwlmc" readonly placeholder="物料名称" value="${$("#fwlmc_menu").val()}" style="width:33%;" class="mui-col-xs-4"/>
                 <input type="text" id="fggxh" name="fggxh" readonly placeholder="规格型号" value="${$("#fggxh_menu").val()}" style="width:33%;" class="mui-col-xs-4"/>
              </div> 
              <div class="mui-row">
                 <input type="text" id="fdw" name="fdw" readonly placeholder="单位" value="${$("#fdw_menu").val()}" style="width:33%;" class="mui-col-xs-4"/>
                 <input type="text" id="fzl" name="fzl" readonly placeholder="装量" value="${$("#fzl_menu").val()}" style="width:33%;" class="mui-col-xs-4"/>
                 <input type="text" id="ffh_bzxs" name="ffh_bzxs" readonly placeholder="包装形式" value="${$("#ffh_bzxs_menu").val()}" style="width:33%;" class="mui-col-xs-4"/>
              </div> 
              <div class="mui-row">
                 <input type="text" id="ffh_dj" name="ffh_dj" readonly placeholder="含税单价" value="${$("#ffh_dj_menu").val()}" style="width:33%;" class="mui-col-xs-4"/>
                 <input type="text" id="ffh_sl" name="ffh_sl" readonly placeholder="申请数量" value="${$("#ffh_sl_menu").val()}" style="width:33%;" class="mui-col-xs-4"/>
                 <input type="text" id="fsjfhsl" name="fsjfhsl" readonly placeholder="实际发货数量" value="${$("#fsjfhsl_menu").val()}" style="width:33%;" class="mui-col-xs-4"/>
              </div> 
               <div class="mui-row">
                 <input type="text" id="ffh_je" name="ffh_je" readonly placeholder="含税金额" value="${$("#ffh_je_menu").val()}" style="width:33%;" class="mui-col-xs-6"/>
                 <input type="text" id="ffh_js" name="ffh_js" readonly placeholder="件数" value="${$("#ffh_js_menu").val()}" style="width:33%;" class="mui-col-xs-6"/>
                 
              </div>  
           </div>  
         `;
        $("#mxlist_fh").prepend(li);   
        calcTotalShip(); //计算总计值
        toggleMenu();

        //清除上一次数据
        $("#menu").find('input').each(function () {
            $(this).val('');
        });
    });
    $("#cancel_menu").on('tap', () => {
        toggleMenu();
    });

    $("#fwlbm_menu").on('tap', () => {
        
        $("#wrapper").hide();
        $("#selector").show();
        prepIndexedList();
    });

}
function toggleMenu() {
    if (busying) {
        return;
    }
    busying = true;
    if (menuWrapperClassList.contains('mui-active')) {
        document.body.classList.remove('menu-open');
        menuWrapper.className = 'menu-wrapper fade-out-up animated';
        menu.className = 'menu bounce-out-up animated';
        setTimeout(function () {
            //backdrop.style.opacity = 0;
            menuWrapper.classList.add('hidden');

        }, 500);
    } else {
        document.body.classList.add('menu-open');
        menuWrapper.className = 'menu-wrapper fade-in-down animated mui-active';
        menu.className = 'menu bounce-in-down animated';
        //backdrop.style.opacity = 1;

    }
    setTimeout(function () {
        busying = false;
    }, 500);
}



//准备索引列表前置
function prepIndexedList() {
  


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

function checkEvent() {
    var checkboxArray = [].slice.call(list.querySelectorAll('input[type="radio"]'));
    var checkedValues = [];
    var checkedElementsTrad = [];    //发货
    var checkedElementsBill = [];    //发票
    var checkedElementsCust = [];    //客户
    checkboxArray.forEach(function (box) {
        if (box.checked) {
            checkedValues.push(box.parentNode.innerText);
            if (check_event_flag == 0) {
                //客户
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
            } else if (check_event_flag == 1) {
                //发货
                var checkEl = {
                    fwlbm: $(box).data('fwlbm'),
                    fwlmc: $(box).data('fwlmc'),
                    fdw: $(box).data('fdw'),
                    fdwbm: $(box).data('fdwbm'),
                    fzl: $(box).data('fzl'),
                    fggxh: $(box).data('fggxh')
                };
                console.log(checkEl);
                checkedElementsTrad.push(checkEl);
            } else if (check_event_flag == 2) {
                //发票
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
        if (check_event_flag == 0) {
            $("#fkhmc").val(checkedElementsCust[0].fkhmc);
            $("#fkhmc").data('fkhbm', checkedElementsCust[0].fkhbm);
            $("#fsh_dz").val(checkedElementsCust[0].fdz);
        } else if (check_event_flag == 1) {
            $("#fwlbm_menu").val(checkedElementsTrad[0].fwlbm);
            $("#fwlmc_menu").val(checkedElementsTrad[0].fwlmc);
            $("#fggxh_menu").val(checkedElementsTrad[0].fggxh);
            $("#fdw_menu").val(checkedElementsTrad[0].fdw);
            $("#fdwbm_menu").val(checkedElementsTrad[0].fdwbm);
            $("#fzl_menu").val(checkedElementsTrad[0].fzl);
        } else if (check_event_flag == 2) {

        }
    }
    $("#selector").hide();
    $("#wrapper").show();
    $("#datalist").empty();
}


//通过存储过程获取对应资料 
function getProcedureMsg(pd_flag) {
    //pd_flag 获取不同信息的flag ，有2个状态 0 :客户资料 1 :物料资料
    if (pd_flag == 0) {
        var fno = $("#fname").data('fno');
        if (!fno) {
            XuntongJSBridge.call('getPersonInfo', {}, function (result) {

                if (typeof (result) == "string") {
                    result = JSON.parse(result);
                }

                if (result.success == true || result.success == "true") {
                    //alert(JSON.stringify(result.data));
                    $("#fname").data('fno', result.data.userName);
                    fno = result.data.userName;
                    // 测试数据 fno='00072155'
                    if (fno == '00078251') {
                        fno = '00072155';
                    }
                }
            })
        } else {
            if (fno == '00078251') {
                fno = '00072155';
            }
        }
        var xml = `<?xml version= "1.0" ?>
                        <Requests>
                           <Params>
                               <DataSource>BPM_WEGO</DataSource>
                               <ID>erpcloud_药业集团客户资料</ID> 
                               <Type>1</Type>
                               <Method>GetUserDataProcedure</Method>
                               <ProcedureName>erpcloud_药业集团客户资料</ProcedureName>                     
                               <Filter>
                                    <fno>${fno}</fno>  
                               </Filter>
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

        }).done((data) => {
            var provideData = JSON.parse(unescape(data.replace(/\\(u[0-9a-fA-F]{4})/gm, '%$1')));
            console.log(provideData);

            var item = provideData.Tables[0].Rows;
            $("#datalist").empty();   //清除之前数据
            var itemlistContent = '';
            for (var i = 0; i < item.length;i++) {
                var li = `
                           <li data-value="" data-tags="" class="mui-table-view-cell mui-indexed-list-item mui-radio mui-left">
                              <input type="radio" name="radio"
                                     data-fywy="${item[i].业务员}"  data-fywybm="${item[i].业务员编码}" data-fdz="${item[i].地址}"
                                     data-fkhmc="${item[i].客户名称}" data-fkhbm="${item[i].客户编码}" data-fxszz="${item[i].销售组织}"
                                     data-fxszzbm="${item[i].销售组织编码}" 
                               />${item[i].客户编码}||${item[i].客户名称} 
                           </li>   
                        `;
                itemlistContent += li;
                //console.log(itemlistContent);
            }
            $("#datalist").append(itemlistContent);
        }).fail((e) => {
                console.log(e);
            }).then(() => {
                prepIndexedList();
            });
    } else if (pd_flag == 1) {
        var xml = `<?xml version= "1.0" ?>
                      <Requests>
                          <Params>
                            <DataSource>BPM_WEGO</DataSource>
                            <ID>erpcloud_药业集团物料资料</ID>  
                            <Type>1</Type>
                            <Method>GetUserDataProcedure</Method>
                            <ProcedureName>erpcloud_药业集团物料资料</ProcedureName>
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

        }).done( (data)=> {
            var provideData = JSON.parse(unescape(data.replace(/\\(u[0-9a-fA-F]{4})/gm, '%$1')));
            console.log(provideData);
            var item = provideData.Tables[0].Rows;
            var itemlistContent = '';
            $("#datalist").empty();   //清除之前数据
            for (var i = 0; i < item.length;i++) {
                var li = `<li data-value="" data-tags="" class="mui-table-view-cell mui-indexed-list-item mui-radio mui-left">
                             <input type="radio" name="radio" data-fwlbm="${item[i].物料编码}" 
                                 data-fwlmc="${item[i].物料名称}" data-fdw="${item[i].单位}"  data-fdwbm="${item[i].单位编码}"
                                 data-fzl="${item[i].装量}"  data-fggxh="${item[i].规格型号}"
                             />${item[i].物料名称}||${item[i].物料编码}||${item[i].规格型号}
                          </li>   
                    `;
                itemlistContent += li;
                
            }

            $("#datalist").append(itemlistContent);
        }).fail((e) => {

            }).then(() => {
                prepIndexedList();
            });
    }
}





//计算发货子表
function calcPriceShip(context) {


    var ffh_dj = parseFloat($(context).parent().parent().find("#ffh_dj_menu").val()).toFixed(6);
    var ffh_sl = parseFloat($(context).parent().parent().find("#ffh_sl_menu").val());
    var fsjfhsl = parseFloat($(context).parent().parent().find("#fsjfhsl_menu").val());
    var fzl = parseFloat($(context).parent().parent().find("#fzl_menu").val());

    if (!ffh_dj) {
        ffh_dj = 0.000000;
    }
    if (!ffh_sl) {
        ffh_sl = 0;
    }
    if (!fsjfhsl) {
        fsjfhsl = 0;
    }
    if (!fzl) {
        fzl = 0;
    }

    var ffh_je = ffh_dj * fsjfhsl;
    var ffh_js = fsjfhsl == 0 ? fzl : parseFloat(fzl / fsjfhsl).toFixed(6);

    $("#ffh_je_menu").val(ffh_je);
    $("#ffh_js_menu").val(ffh_js);

    //calcTotalShip();

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
    console.log(ffh_sl_total);

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

