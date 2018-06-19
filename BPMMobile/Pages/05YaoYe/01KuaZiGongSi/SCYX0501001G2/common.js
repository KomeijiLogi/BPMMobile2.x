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

var menuWrapper2 = document.getElementById("menu-wrapper2");
var menu2 = document.getElementById("menu2");
var menuWrapperClassList2 = menuWrapper2.classList;


function tapEvent() {
    //库存组织
    var fkcorgdata = [
        {
            value: '01.05.05.01', 
            text:'注射器分公司'
        },
        {
            value: '01.05.08.16',
            text: '医疗器械经营'
        },
        {
            value: '01.05.16',
            text: '肾科公司'
        },
        {
            value: '01.05.17',
            text: '内镜公司'
        },
        {
            value: '01.05.18',
            text: '感控公司'
        }

    ];
    var element22 = document.getElementById('fkcorg');

    var picker22 = new mui.PopPicker();

    picker22.setData(fkcorgdata);

    element22.addEventListener('tap', function () {

        picker22.show(function (items) {
            $("#fkhmc").data('fkzcc', items[0].value)

            element22.value = items[0].text;
        });

    }, false);

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
    showPicker('ffp_bzxs_menu', ffh_bzxsdata);

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
        toggleMenu2();

       
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

    $("#menu2").find("input[type='number']").on('input', function () {

        calcPriceBill(this);
    });

    $("#confirm_menu").on('tap', () => {
         //校验必填项
        if (!$("#fwlbm_menu").val()){
            mui.toast('请选择物料');
            return;
        }
        if (!$("#ffh_bzxs_menu").val()) {
            mui.toast('请选择包装形式');
            return;
        }
        if (!$("#ffh_dj_menu").val()) {
            mui.toast('请填写含税单价');
            return;
        }
        if (!$("#ffh_sl_menu").val()) {
            mui.toast('请填写申请数量');
            return;
        }
        if (!$("#f_tx_menu").val()) {
            mui.toast('请选择套系');
            return;
        }

        //弹出层输入数据绑定生成子表并添加到头部，始终保持头部是最新加的
       
        var li = `
           <div class="mui-card" id="mx">
              <div class="mui-input-row itemtitle">
                   <span class="mui-icon mui-icon-close mui-pull-left" style="margin-left:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>
                   <label></label>    
                   <span class="mui-icon mui-icon-arrowright mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;"></span>
              </div>
               <div class="mui-table-view-cell mui-collapse">
                   <a class="mui-navigate-right" href="#" style="font-size:30px;">            
                        <div class="mui-row">
                             <div class="mui-col-xs-4" style="display:flex;">
                                  <label style="display:none;">物料编码</label>
                                  <textarea id="fwlbm" name="fwlbm" readonly placeholder="物料编码">${$("#fwlbm_menu").val()}</textarea>
                             </div>  
                              <div class="mui-col-xs-4" style="display:flex;">
                                  <label style="display:none;">物料名称</label>
                                  <textarea id="fwlmc" name="fwlmc" readonly placeholder="物料名称" >${$("#fwlmc_menu").val()}</textarea>
                              </div>
                             <div class="mui-col-xs-4" style="display:flex;">
                                  <label style="display:none;">规格型号</label> 
                                  <textarea id="fggxh" name="fggxh"  placeholder="规格型号" >${$("#fggxh_menu").val()}</textarea>
                              </div>
                        </div> 
                   </a>  
                    <div class="mui-collapse-content">
                         <div class="mui-row cutOffLine"  >
                               <div class="mui-col-xs-4" style="display:flex;">
                                  <label>单位</label>
                                  <input type="text" id="fdw" name="fdw" readonly placeholder="单位" value="${$("#fdw_menu").val()}" />
                              </div>
                
                             <input type="hidden" id="fdwbm" name="fdwbm" placeholder="单位编码" value="${$("#fdwbm_menu").val()}"/> 
                              <div class="mui-col-xs-4" style="display:flex;">
                                   <label>装量</label>
                                  <input type="number" id="fzl" name="fzl" readonly placeholder="装量" value="${$("#fzl_menu").val()}" />
                              </div>
                              <div class="mui-col-xs-4" style="display:flex;">
                                  <label>包装形式</label>
                                  <input type="text" id="ffh_bzxs" name="ffh_bzxs" readonly placeholder="包装形式" value="${$("#ffh_bzxs_menu").val()}" />
                              </div>
                
                          </div> 
                          <div class="mui-row cutOffLine" >
                              <div class="mui-col-xs-4" style="display:flex;">
                                  <label>含税单价</label>
                                  <input type="number" id="ffh_dj" name="ffh_dj" readonly placeholder="含税单价" value="${$("#ffh_dj_menu").val()}" />
                              </div>
                              <div class="mui-col-xs-4" style="display:flex;">
                                   <label>申请数量</label>  
                                  <input type="number" id="ffh_sl" name="ffh_sl" readonly placeholder="申请数量" value="${$("#ffh_sl_menu").val()}" />
                              </div>
                              <div class="mui-col-xs-4" style="display:flex;">
                                   <label>实际发货</label>  
                                  <input type="number" id="fsjfhsl" name="fsjfhsl" readonly placeholder="实际发货数量" value="${$("#fsjfhsl_menu").val()}" />
                              </div>
                

                          </div> 
                           <div class="mui-row cutOffLine"  >
                               <div class="mui-col-xs-4" style="display:flex;">
                                   <label>套系</label>
                                   <input type="text" id="f_tx" readonly placeholder="套系" value="${$("#f_tx_menu").val()}"/>
                                </div>
                              <div class="mui-col-xs-4" style="display:flex;">
                                 <label>含税金额</label> 
                                 <input type="number" id="ffh_je" name="ffh_je" readonly placeholder="含税金额" value="${$("#ffh_je_menu").val()}" />
                              </div>
                               <div class="mui-col-xs-4" style="display:flex;">
                                 <label>件数</label> 
                                <input type="number" id="ffh_js" name="ffh_js" readonly placeholder="件数" value="${$("#ffh_js_menu").val()}" />
                              </div>
                
                          </div>     
                    </div>
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

    $("#mxlist_fh").on('tap', '.mui-icon-arrowright', function (e) {
        toggleMenu();
        $("#fwlbm_menu").val($(e.target).parent().parent().find("#fwlbm").val());
        $("#fwlmc_menu").val($(e.target).parent().parent().find("#fwlmc").val());
        $("#fggxh_menu").val($(e.target).parent().parent().find("#fggxh").val());
        $("#fdw_menu").val($(e.target).parent().parent().find("#fdw").val());
        $("#fdwbm_menu").val($(e.target).parent().parent().find("#fdwbm").val());
        $("#fzl_menu").val($(e.target).parent().parent().find("#fzl").val());
        $("#ffh_bzxs_menu").val($(e.target).parent().parent().find("#ffh_bzxs").val());
        $("#ffh_dj_menu").val($(e.target).parent().parent().find("#ffh_dj").val());
        $("#ffh_sl_menu").val($(e.target).parent().parent().find("#ffh_sl").val());
        $("#fsjfhsl_menu").val($(e.target).parent().parent().find("#fsjfhsl").val());
        $("#ffh_je_menu").val($(e.target).parent().parent().find("#ffh_je").val());
        $("#ffh_js_menu").val($(e.target).parent().parent().find("#ffh_js").val());
        $("#f_tx_menu").val($(e.target).parent().parent().find("#f_tx").val())
        $(e.target).parent().parent().remove();
        calcTotalBill();
    });


    $("#cancel_menu").on('tap', () => {
        toggleMenu();
    });
    $("#confirm_menu_2").on('tap', () => {
        //校验必填项
        if (!$("#ffp_wlmc_menu").val()) {
            mui.toast('请选择物料');
            return;
        }
        if (!$("#ffp_bzxs_menu").val()) {
            mui.toast('请选择包装形式');
            return;
        }
        if (!$("#ffp_dj_menu").val()) {
            mui.toast('请填写含税单价');
            return;
        }
        if (!$("#ffp_sl_menu").val()) {
            mui.toast('请填写数量');
            return;
        }
       
        var li = `
                <div class="mui-card" id="mx">
                  <div class="mui-input-row itemtitle">
                       <span class="mui-icon mui-icon-close mui-pull-left" style="margin-left:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>
                       <label></label>    
                       <span class="mui-icon mui-icon-arrowright mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;"></span>
                  </div>
                  <div class="mui-table-view-cell mui-collapse">
                      <a class="mui-navigate-right" href="#" style="font-size:30px;">
                           <div class="mui-row">
                                <div class="mui-col-xs-4" style="display:flex;">
                                  <label style="display:none;">物料名称</label>
                                  <textarea id="ffp_wlmc" name="ffp_wlmc" readonly placeholder="物料名称">${$("#ffp_wlmc_menu").val()}</textarea>
                               </div>
                               <div class="mui-col-xs-4" style="display:flex;">
                                  <label style="display:none;">规格型号</label>
                                  <textarea id="ffp_ggxh" name="ffp_ggxh"  placeholder="规格型号" >${$("#ffp_ggxh_menu").val()}</textarea>   
                               </div>
                               <div class="mui-col-xs-4" style="display:flex;">
                                  <label style="display:none;">包装形式</label>
                                  <input type="text" id="ffp_bzxs" name="ffp_bzxs" readonly placeholder="包装形式" value="${$("#ffp_bzxs_menu").val()}"  />
                               </div>                      
                          </div>  
                      </a>
                       <div class="mui-collapse-content">
                            <div class="mui-row cutOffLine">
                                <div class="mui-col-xs-3" style="display:flex;">
                                  <label>单位</label>
                                  <input type="text" id="ffp_dw" name="ffp_dw" readonly placeholder="单位" value="${$("#ffp_dw_menu").val()}" />
                               </div>
                               <div class="mui-col-xs-3" style="display:flex;">
                                  <label>含税单价</label>
                                 <input type="number" id="ffp_dj" name="ffp_dj" readonly placeholder="含税单价" value="${$("#ffp_dj_menu").val()}" />
                               </div>
                               <div class="mui-col-xs-3" style="display:flex;">
                                  <label>数量</label>
                                 <input type="number" id="ffp_sl" name="ffp_sl" readonly placeholder="数量" value="${$("#ffp_sl_menu").val()}" />
                               </div>
                                <div class="mui-col-xs-3" style="display:flex;">
                                  <label>含税金额</label>
                                  <input type="number" id="ffp_je" name="ffp_je" readonly placeholder="含税金额" value="${$("#ffp_je_menu").val()}" />
                               </div>                    
                          </div>
                       </div>   
                  </div>
                                   
                </div>  
                 `;

        $("#mxlist_fp").prepend(li);   
        calcTotalBill();
        toggleMenu2();
        $("#menu2").find('input').each(function () {
            $(this).val('');
        });
    });
    $("#mxlist_fp").on('tap', '.mui-icon-arrowright', function (e) {
        toggleMenu2();
        $("#ffp_wlmc_menu").val($(e.target).parent().parent().find("#ffp_wlmc").val());
        $("#ffp_ggxh_menu").val($(e.target).parent().parent().find("#ffp_ggxh").val());
        $("#ffp_dw_menu").val($(e.target).parent().parent().find("#ffp_dw").val());
        $("#ffp_bzxs_menu").val($(e.target).parent().parent().find("#ffp_bzxs").val());
        $("#ffp_dj_menu").val($(e.target).parent().parent().find("#ffp_dj").val());
        $("#ffp_sl_menu").val($(e.target).parent().parent().find("#ffp_sl").val());
        $("#ffp_je_menu").val($(e.target).parent().parent().find("#ffp_je").val());
        $(e.target).parent().parent().remove();
        calcTotalShip();

    });

    $("#cancel_menu_2").on('tap', () => {
        toggleMenu2();
    });

    $("#fwlbm_menu").on('tap', () => {
        
        $("#wrapper").hide();
        $("#selector").show();
        prepIndexedList();
    });
    $("#ffp_wlmc_menu").on('tap', () => {
        $("#wrapper").hide();
        $("#selector").show();
        prepIndexedList();
    });

    //套系
    var f_tx_data = [
        {
            value: '',
            text:'A液+B粉'
        },
        {
            value: '',
            text: 'A液+B干粉桶'
        },
        {
            value: '',
            text: 'A液+B干粉袋'
        },
        {
            value: '',
            text: 'A液+B液'
        },
        {
            value: '',
            text: 'A粉+B粉'
        },
        {
            value: '',
            text: 'A粉+B干粉桶'
        },
        {
            value: '',
            text: 'A粉+B干粉袋'
        },
        {
            value: '',
            text: '非配套'
        },
    ];
    var picker_tx = new mui.PopPicker();
    picker_tx.setData(f_tx_data);
    $('body').on('tap', '#f_tx_menu', function () {
        var _self = this;
        picker_tx.show(function (items) {
            $(_self).val(items[0].text);
        });
    });
    $('body').on('tap', '#f_tx', function () {
        var _self = this;
        picker_tx.show(function (items) {
            $(_self).val(items[0].text);
        });
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
function toggleMenu2() {
    if (busying) {
        return;
    }
    busying = true;
    if (menuWrapperClassList2.contains('mui-active')) {
        document.body.classList.remove('menu-open');
        menuWrapper2.className = 'menu-wrapper fade-out-up animated';
        menu2.className = 'menu bounce-out-up animated';
        setTimeout(function () {
            //backdrop.style.opacity = 0;
            menuWrapper2.classList.add('hidden');

        }, 500);
    } else {
        document.body.classList.add('menu-open');
        menuWrapper2.className = 'menu-wrapper fade-in-down animated mui-active';
        menu2.className = 'menu bounce-in-down animated';
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
                console.log(checkEl);
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
            $("#f_xsy").val(checkedElementsCust[0].fywy);
            $("#f_xsy_no").val(checkedElementsCust[0].fywybm);
            $("#f_xszz").val(checkedElementsCust[0].fxszz);
            $("#f_xszz_bm").val(checkedElementsCust[0].fxszzbm);
            //名称后缀
            var bmstr = checkedElementsCust[0].fkhbm;
            $("#f_mchz").val(bmstr.charAt(bmstr.length - 1));
            searchAbout();
        } else if (check_event_flag == 1) {
            $("#fwlbm_menu").val(checkedElementsTrad[0].fwlbm);
            $("#fwlmc_menu").val(checkedElementsTrad[0].fwlmc);
            $("#fggxh_menu").val(checkedElementsTrad[0].fggxh);
            $("#fdw_menu").val(checkedElementsTrad[0].fdw);
            $("#fdwbm_menu").val(checkedElementsTrad[0].fdwbm);
            $("#fzl_menu").val(checkedElementsTrad[0].fzl);
        } else if (check_event_flag == 2) {
            $("#ffp_wlmc_menu").val(checkedElementsBill[0].fwlmc);
            $("#ffp_ggxh_menu").val(checkedElementsBill[0].fggxh);
            $("#ffp_dw_menu").val(checkedElementsBill[0].fdw);

        }
    }
    $("#selector").hide();
    $("#wrapper").show();
    $("#datalist").empty();
}

//根据客户编码查询相关信息
function searchAbout() {
    var fkhbm = $("#fkhmc").data('fkhbm');
    console.log(fkhbm);
    var xml = `<?xml version= "1.0" ?>
                                 <Requests>
                                 <Params>
                                 <DataSource>BPM_WEGO</DataSource>
                                 <ID>erpcloud_药业集团发货申请基础</ID>
                                 <Type>1</Type>
                                 <Method>GetUserDataProcedure</Method>
                                 <ProcedureName>erpcloud_药业集团发货申请基础</ProcedureName>
                                 <Filter><fkhbm>${fkhbm}</fkhbm></Filter>
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
    }).done((data) =>{
        var provideData = JSON.parse(unescape(data.replace(/\\(u[0-9a-fA-F]{4})/gm, '%$1')));
        var pData = provideData.Tables[0].Rows;
        console.info(pData);
        $("#f_sktj").val(pData[0].收款条件);
        $("#f_sktj_bm").val(pData[0].收款条件编码);
    }).fail((e) => {
        console.log(e);
    });

    var xml = `<?xml version= "1.0" ?>
                                 <Requests>
                                 <Params>
                                 <DataSource>BPM_WEGO</DataSource>
                                 <ID>erpcloud_查询药业集团发货_基础数据表2</ID>
                                 <Type>1</Type>
                                 <Method>GetUserDataProcedure</Method>
                                 <ProcedureName>erpcloud_查询药业集团发货_基础数据表2</ProcedureName>
                                 <Filter><名称后缀>${$("#f_mchz").val()}</名称后缀></Filter>
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
        var pData = provideData.Tables[0].Rows;
        console.info(pData);
        $("#f_kczz").val(pData[0].库存组织);
        $("#f_kczz_bm").val(pData[0].库存组织编码);

    }).fail((e) => {

        }).then(() => {
            var f_kczz = $("#f_kczz").val();
            console.log(f_kczz);
            var xml = `<?xml version= "1.0" ?>
                                 <Requests>
                                 <Params>
                                 <DataSource>BPM_WEGO</DataSource>
                                 <ID>erpcloud_查询药业集团发货_基础数据表</ID>
                                 <Type>1</Type>
                                 <Method>GetUserDataProcedure</Method>
                                 <ProcedureName>erpcloud_查询药业集团发货_基础数据表</ProcedureName>
                                 <Filter><库存组织>${f_kczz}</库存组织></Filter>
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
                var pData = provideData.Tables[0].Rows;
                //console.info(pData);
                pData = pData.map((val, i, arr) => {
                    var obj = {
                        value: pData[i].仓库编码,
                        text: pData[i].仓库名称,
                        库存组织编码: pData[i].库存组织编码,
                        库存组织: pData[i].库存组织,
                        名称后缀: pData[i].名称后缀,
                        仓库名称: pData[i].仓库名称,
                        仓库编码: pData[i].仓库编码,
                    };
                    return obj;
                });
                console.log(pData);
                var picker = new mui.PopPicker();
                picker.setData(pData);
                $('body').on('tap', '#f_ckmc', function () {
                    var _self = this;
                    picker.show(function (items) {
                        $(_self).val(items[0].text);
                        $("#f_ckbm").val(items[0].仓库编码);

                    });

                });
            }).fail((e) => {
                console.log(e);
            });

        });

   


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



var ckjsflag = false;

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
    var ffh_js = fsjfhsl == 0 ? fzl : parseFloat(fsjfhsl / fzl).toFixed(6);

    $("#ffh_je_menu").val(ffh_je);
    $("#ffh_js_menu").val(ffh_js);
    if (Math.floor(ffh_js) != ffh_js) {
        //mui.toast('填写申请数量不正确，请为装量的整数倍');
        ckjsflag = true;
    }

    //calcTotalShip();

}
function calcChangeShip(context) {
    var ffh_dj = parseFloat($(context).parent().parent().parent().find("#ffh_dj").val()).toFixed(6);
    var ffh_sl = parseFloat($(context).parent().parent().parent().find("#ffh_sl").val());
    var fsjfhsl = parseFloat($(context).parent().parent().parent().find("#fsjfhsl").val());
    var fzl = parseFloat($(context).parent().parent().parent().find("#fzl").val());

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
    var ffh_js = fsjfhsl == 0 ? fzl : parseFloat(fsjfhsl / fzl).toFixed(6);
    console.log(ffh_js);
    $(context).parent().parent().parent().find("#ffh_je").val(ffh_je);
    $(context).parent().parent().parent().find("#ffh_js").val(ffh_js);
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
    var ffp_dj = parseFloat($(context).parent().parent().find("#ffp_dj_menu").val()).toFixed(6);
    var ffp_sl = parseFloat($(context).parent().parent().find("#ffp_sl_menu").val());

    if (!ffp_dj) {
        ffp_dj = 0.000000;
    }
    if (!ffp_sl) {
        ffp_sl = 0;
    }

    var ffp_je = ffp_dj * ffp_sl;
    $("#ffp_je_menu").val(ffp_je);

    //calcTotalBill();
}
function calcChangeBill(context) {
    var ffp_dj = parseFloat($(context).parent().parent().parent().find("#ffp_dj").val()).toFixed(6);
    var ffp_sl = parseFloat($(context).parent().parent().parent().find("#ffp_sl").val());

    if (!ffp_dj) {
        ffp_dj = 0.000000;
    }
    if (!ffp_sl) {
        ffp_sl = 0;
    }

    var ffp_je = ffp_dj * ffp_sl;
    $(context).parent().parent().parent().find("#ffp_je").val(ffp_je);

}

//计算发票总计
function calcTotalBill() {
    var ffp_dj_total = 0;
    var ffp_sl_total = 0;
    $("#mxlist_fp").find("#ffp_je").each(function () {
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
    $("#fhj_fpsl").val(ffp_sl_total);
    $("#fhj_fpje").val(ffp_dj_total);
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
//加载页面信息
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
    
    $("#fkhmc").data('fkzcc', item_a.fkczz);
    $("#fkhmc").data('fkhbm', item_a.fkhbm);
    //$("#fzjsj").val(item_a.fzjsj);
    $("#fzjsj").data('fxszg', item_a.fxszg);

    for (var n = 0; n < fzjsjdata.length; n++) {
        if (String(fzjsjdata[n].value).match(item_a.fxszg) != null) {
            $("#fzjsj").val(fzjsjdata[n].text);
        }
    }
    //草稿范本中直接上级为空的情况
    if (!item_a.fxszg) {
        $("#fzjsj").val('');
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




    switch (item_a.fkczz) {
        case '01.05.05.01':
            $("#fkcorg").val('注射器分公司');
            break;
        case '01.05.08.16':

            $("#fkcorg").val('医疗器械经营');
            break;
        case '01.05.16':
            $("#fkcorg").val('肾科公司');
            break;
        case '01.05.17':
            $("#fkcorg").val('内镜公司');
            break;
        case '01.05.18':
            $("#fkcorg").val('感控公司');
            break;
        default:
            break;
    }


    //发货部分
    $("#fhj_fhsl").val(item_a.fhj_fhsl);
    $("#fsjfhsltotal").val(item_a.fsjfhsltotal);
    $("#fhj_fhje").val(item_a.fhj_fhje);
    $("#fhj_fhjs").val(item_a.fhj_fhjs);
    $("#ffh_bz").val(item_a.ffh_bz);
    $("#f_sktj").val(item_a.收款条件);
    $("#f_sktj_bm").val(item_a.收款条件编码);
    $("#f_kczz").val(item_a.库存组织);
    $("#f_kczz_bm").val(item_a.库存组织编码);
    $("#f_ckmc").val(item_a.仓库名称);
    $("#f_ckbm").val(item_a.仓库编码);
    $("#f_mchz").val(item_a.名称后缀);
    $("#f_xszz").val(item_a.销售组织);
    $("#f_xszz_bm").val(item_a.销售组织编码);
    $("#f_xsy").val(item_a.业务员);
    $("#f_xsy_no").val(item_a.业务员工号);
    $("#f_xwyy").val(item_a.销往医院);

    var item_b1 = data.FormDataSet.BPM_WGYYFHFPSQ_B1;
    for (var i = 0; i < item_b1.length; i++) {
        itemidArr1.push(item_b1[i].itemid);
        var li = `
           <div class="mui-card" id="mx">
              <div class="mui-input-row itemtitle">
                   <span class="mui-icon mui-icon-close mui-pull-left" style="margin-left:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>
                   <label></label>    
                   <span class="mui-icon mui-icon-arrowright mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;"></span>
              </div>

             <div class="mui-table-view-cell mui-collapse">
                   <a class="mui-navigate-right" href="#" style="font-size:30px;">            
                        <div class="mui-row">
                              <div class="mui-col-xs-4" style="display:flex;">
                                 
                                   <textarea id="fwlbm" name="fwlbm" readonly placeholder="物料编码">${item_b1[i].ffh_wlbm }</textarea>
                              </div>   
                               <div class="mui-col-xs-4" style="display:flex;">
                                     
                                    <textarea id="fwlmc" name="fwlmc" readonly placeholder="物料名称">${item_b1[i].ffh_wlmc}</textarea>
                              </div> 
                              <div class="mui-col-xs-4" style="display:flex;">
                                   
                                    <textarea id="fggxh" name="fggxh" readonly placeholder="规格型号" >${item_b1[i].ffh_ggxh}</textarea>
                              </div> 
               
                  </div> 
               </a> 
             <div class="mui-collapse-content">
              <div class="mui-row cutOffLine">
                  <div class="mui-col-xs-4" style="display:flex;">
                       <label>单位</label>
                       <input type="text" id="fdw" name="fdw" readonly placeholder="单位" value="${item_b1[i].ffh_dw}" />
                  </div>  
                <div class="mui-col-xs-4" style="display:flex;">
                       <label>装量</label>
                       <input type="number" id="fzl" name="fzl" readonly placeholder="装量" value="${item_b1[i].fzl}" />
                  </div>
                  <div class="mui-col-xs-4" style="display:flex;">
                       <label>包装形式</label>
                      <input type="text" id="ffh_bzxs" name="ffh_bzxs" readonly placeholder="包装形式" value="${item_b1[i].ffh_bzxs}" />
                  </div>
                 
                 <input type="hidden" id="fdwbm" name="fdwbm" placeholder="单位编码" value="${item_b1[i].fjldwbm}"/>  
                
              </div> 
              <div class="mui-row cutOffLine">
                  <div class="mui-col-xs-4" style="display:flex;">
                       <label>含税单价</label>
                      <input type="number" id="ffh_dj" name="ffh_dj" readonly placeholder="含税单价" value="${item_b1[i].ffh_dj}" />
                  </div>
                 <div class="mui-col-xs-4" style="display:flex;">
                       <label>申请数量</label>
                     <input type="number" id="ffh_sl" name="ffh_sl" readonly placeholder="申请数量" value="${item_b1[i].ffh_sl}"/>
                  </div> 
                  <div class="mui-col-xs-4" style="display:flex;">
                       <label>实际发货</label>
                    <input type="number" id="fsjfhsl" name="fsjfhsl" readonly placeholder="实际发货数量" value="${item_b1[i].fsjfhsl }" />
                  </div>
                
              </div> 
               <div class="mui-row cutOffLine">
                  <div class="mui-col-xs-4" style="display:flex;">
                      <label>套系</label>
                      <input type="text" id="f_tx" readonly placeholder="套系" value="${item_b1[i].套系}"/> 
                  </div>
                  <div class="mui-col-xs-4" style="display:flex;">
                       <label>含税金额</label>
                       <input type="number" id="ffh_je" name="ffh_je" readonly placeholder="含税金额" value="${item_b1[i].ffh_je}" />
                  </div>
                  <div class="mui-col-xs-4" style="display:flex;">
                       <label>件数</label>
                       <input type="number" id="ffh_js" name="ffh_js" readonly placeholder="件数" value="${item_b1[i].ffh_js}" />
                  </div>
                
              </div>  
             </div> 
           </div>  
         `;
        $("#mxlist_fh").prepend(li);   
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
        var li = `
                <div class="mui-card" id="mx">
                  <div class="mui-input-row itemtitle">
                       <span class="mui-icon mui-icon-close mui-pull-left" style="margin-left:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>
                       <label></label>    
                       <span class="mui-icon mui-icon-arrowright mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;"></span>
                  </div>
                 <div class="mui-table-view-cell mui-collapse">
                   <a class="mui-navigate-right" href="#" style="font-size:30px;">            
                        <div class="mui-row">
                       <div class="mui-col-xs-4" style="display:flex;">
                          
                         <textarea id="ffp_wlmc" name="ffp_wlmc" readonly placeholder="物料名称" >${item_b2[i].ffp_wlmc}</textarea>
                       </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                           
                           <textarea id="ffp_ggxh" name="ffp_ggxh" readonly placeholder="规格型号" >${item_b2[i].ffp_ggxh}</textarea>  
                       </div>
                      <div class="mui-col-xs-4" style="display:flex;">
                          
                            <input type="text" id="ffp_bzxs" name="ffp_bzxs" readonly placeholder="包装形式" value="${item_b2[i].ffp_bzxs}"  />
                       </div>
                      
                  </div>  
                   </a>
                    <div class="mui-collapse-content">
                  <div class="mui-row cutOffLine">
                       <div class="mui-col-xs-3" style="display:flex;">
                            <label>单位</label>
                          <input type="text" id="ffp_dw" name="ffp_dw" readonly placeholder="单位" value="${item_b2[i].ffp_dw}" />
                       </div>
                        <div class="mui-col-xs-3" style="display:flex;">
                            <label>含税单价</label>
                           <input type="number" id="ffp_dj" name="ffp_dj" readonly placeholder="含税单价" value="${item_b2[i].ffp_dj}" />
                       </div>
                       <div class="mui-col-xs-3" style="display:flex;">
                            <label>数量</label>
                             <input type="number" id="ffp_sl" name="ffp_sl" readonly placeholder="数量" value="${item_b2[i].ffp_sl}" />
                       </div>
                       <div class="mui-col-xs-3" style="display:flex;">
                            <label>含税金额</label>
                          <input type="number" id="ffp_je" name="ffp_je" readonly placeholder="含税金额" value="${item_b2[i].ffp_je}"/>
                       </div>
                      
                  </div>
                  </div>
                </div>  
                 `;

        $("#mxlist_fp").prepend(li);   
    }
}


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
        //mui.alert('页面施工中,暂时不可编辑');
        tapEvent();
        $("#tjmx_fh,#tjmx_fp").show();
        $("#mxlist_fh,#mxlist_fp").find('span').each(function () {
            $(this).show();
        });
        $("#fkhmc").off('tap');
        if (String($("#fkhlx").val()).match('授信期') != null) {
            $("#fcsxqd").removeClass('mui-disabled');
        }
        $("#fsh_dz,#fsh_name,#fsh_tel,#fdhrq,#fdqqk,#ffh_bz").removeAttr('readonly');
        $("#fsj_name,#fsj_tel,#fyjdz,#fhrqks,#fhrqjs,#ffp_bz").removeAttr('readonly');

        $("#mxlist_fh").find("#ffh_dj").each(function () {
            $(this).removeAttr('readonly');
            $(this).on('input', function () {

                calcChangeShip(this);
                calcTotalShip();
            });
        });
        $("#mxlist_fp").find("#ffp_dj").each(function () {
            $(this).removeAttr('readonly');
            $(this).on('input', function () {

                calcChangeBill(this);
                calcTotalShip();
            });
        });
        //商务专员
    } else if ((String(NodeName).match(/\d+/g) == null && String(NodeName).match('商务') != null) || String(NodeName).match('（营销一区）1') != null) {

        $("#fckdh").attr('placeholder', '请填写出库单号');
        $("#fckdh").removeAttr('readonly');

        $("#mxlist_fh").find("#fsjfhsl").removeAttr('readonly');

        $("#mxlist_fh").find("input[type='number']").on('input', function () {

            calcChangeShip(this);
        });

        //核算专员
    } else if (String(NodeName).match('核算专员') != null) {

        $("#mxlist_fh").find("#fsjfhsl").removeAttr('readonly');

        $("#mxlist_fh").find("input[type='number']").on('input', function () {

            calcChangeShip(this);
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
                text: '圆通'
            },
            {
                value: '',
                text: 'EMS'
            },
            {
                value: '',
                text: '顺丰'
            }
        ];


        showPicker('fkd_gs', fkd_gsdata);

        $("#fkd_dh").attr('placeholder', '请填写快递单号');
        $("#fkd_dh").removeAttr('readonly');


        $("#mxlist_fh").find("#fsjfhsl").removeAttr('readonly');

        $("#mxlist_fh").find("input[type='number']").on('input', function () {

            calcChangeShip(this);
        });


    }

}

//加载范本数据
function initTemplateData() {
    //取当前url，获取到 DraftGuid
    var url = window.location.href;
    var urlTail = url.split("?")[1];   //url取出？后面部分
    var urlFrag = urlTail.split("&");   //通过&将url后面部分拆分成数组，数组内容为xxx=xxx的格式
    var DraftGuid = String(urlFrag[0]).replace("DraftGuid=", "");
    $("#DraftGuid").val(DraftGuid);     //将draftGuid保存到dom中以备更新范本时使用

    //请求范本数据
    $.ajax({
        type: 'get',
        url: "/api/bpm/GetDraftData",
        data: { 'draftID': DraftGuid },
        beforeSend: function (XHR) {
            XHR.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem('ticket'));
        }
    }).done((data) => {
        console.log(data);
        initData(data, false);
        $("#mxlist_fp,#mxlist_fh").find('span').each(function () {

            $(this).show();
        });
    }).fail((e) => {

    });
}



class MxItem_trad {
    constructor(fwlbm, fwlmc, fggxh, fdw, fdwbm, fzl, ffh_bzxs, ffh_dj, ffh_sl, fsjfhsl, ffh_je, ffh_js,f_tx) {
        this.fwlbm = fwlbm;
        this.fwlmc = fwlmc;
        this.fggxh = fggxh;
        this.fdw = fdw;
        this.fdwbm = fdwbm;
        this.fzl = fzl;
        this.ffh_bzxs = ffh_bzxs;
        this.ffh_dj = ffh_dj;
        this.ffh_sl = ffh_sl;
        this.fsjfhsl = fsjfhsl;
        this.ffh_je = ffh_je;
        this.ffh_js = ffh_js;
        this.f_tx = f_tx;
    }
}
class MxItem_bill {
    constructor(ffp_wlmc, ffp_ggxh, ffp_dw, ffp_bzxs, ffp_dj, ffp_sl, ffp_je) {
        this.ffp_wlmc = ffp_wlmc;
        this.ffp_ggxh = ffp_ggxh;
        this.ffp_dw = ffp_dw;
        this.ffp_bzxs = ffp_bzxs;
        this.ffp_dj = ffp_dj;
        this.ffp_sl = ffp_sl;
        this.ffp_je = ffp_je;
    }
}

//保存范本
function SaveAsDraft() {
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

    /*添加字段*/
    var f_sktj = $("#f_sktj").val();
    var f_sktj_bm = $("#f_sktj_bm").val();
    var f_kczz = $("#f_kczz").val();
    var f_kczz_bm = $("#f_kczz_bm").val();
    var f_ckmc = $("#f_ckmc").val();
    var f_ckbm = $("#f_ckbm").val();
    var f_mchz = $("#f_mchz").val();
    var f_xszz = $("#f_xszz").val();
    var f_xszz_bm = $("#f_xszz_bm").val();
    var f_xsy = $("#f_xsy").val();
    var f_xsy_no = $("#f_xsy_no").val();
    var f_xwyy = $("#f_xwyy").val();









    var mxflag = false;
    var mxlistArrShip = new Array();
    $("#mxlist_fh").find("#mx").each(function () {

        var fwlbm = $(this).find("#fwlbm").val();
        if (fwlbm == "null") {
            return;
        }
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
        var f_tx = $(this).find("#f_tx").val();


        var mx = new MxItem_trad(fwlbm, fwlmc, fggxh, fdw, fdwbm, fzl, ffh_bzxs, ffh_dj, ffh_sl, fsjfhsl, ffh_je, ffh_js, f_tx);
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
        if (ffp_wlmc == "null") {
            return;
        }
        var ffp_ggxh = $(this).find("#ffp_ggxh").val();
        var ffp_dw = $(this).find("#ffp_dw").val();
        var ffp_bzxs = $(this).find("#ffp_bzxs").val();
        var ffp_dj = $(this).find("#ffp_dj").val();
        var ffp_sl = $(this).find("#ffp_sl").val();
        var ffp_je = $(this).find("#ffp_je").val();

        var mx = new MxItem_bill(ffp_wlmc, ffp_ggxh, ffp_dw, ffp_bzxs, ffp_dj, ffp_sl, ffp_je);
        mxlistArrBill.push(mx);
    });

    var ffp_bz = $("#ffp_bz").val();
    if (ckjsflag) {
        mui.alert('发货子表件数不正确，应为整数,保存范本失败');
        return;
    }

    var btnArry = ["取消", "确定"];
    mui.confirm('保存范本，是否确定？', '范本保存提醒', btnArry, function (e) {
        if (e.index == 1) {
            var xml = `<?xml version="1.0"?>
                            <XForm>
                                <Header>
                                    <Method>SaveAsFormTemplate</Method>
                                    <ProcessName>药业集团发货、发票开具申请</ProcessName>
                                    <OwnerMemberFullName>${BPMOU}</OwnerMemberFullName>
                                    <Comment></Comment>
                                    <UrlParams>{}</UrlParams>
                                    <ConsignEnabled>false</ConsignEnabled>
                                    <ConsignUsers>[]</ConsignUsers>
                                    <ConsignRoutingType>Parallel</ConsignRoutingType>
                                    <ConsignReturnType>Return</ConsignReturnType>
                                    <InviteIndicateUsers>[]</InviteIndicateUsers>
                                    <Context>{&quot;Routing&quot;:{}}</Context>
                                </Header>
                           <FormData>
                       `;
            xml += `<BPM_WGYYFHFPSQ_A>
                        <fbillno>自动生成</fbillno>
                        <fname>${fname}</fname>
                        <fqy>${fqy}</fqy>
                        <fsqrq>${fsqrq}</fsqrq>
                        <fsqlx>${fsqlx}</fsqlx>
                        <fkhbm>${fkhbm}</fkhbm>
                        <fkczz>${fkzcc}</fkczz>
                        <fkhmc>${fkhmc}</fkhmc>
                        <fxszg>${fxszg}</fxszg>
                        <fsh_dz>${fsh_dz}</fsh_dz>
                        <fsh_name>${fsh_name}</fsh_name>
                        <fsh_tel>${fsh_tel}</fsh_tel>
                        <fdhrq>${fdhrq}</fdhrq>
                        <fkhlx>${fkhlx}</fkhlx>
                        <fdqqk>${fdqqk}</fdqqk>
                        <fcsxq>${fcsxq}</fcsxq>
                        <fckdh>${fckdh}</fckdh>

           <收款条件>${f_sktj}</收款条件>
            <收款条件编码>${f_sktj_bm}</收款条件编码>
            <名称后缀>${f_mchz}</名称后缀>
            <库存组织>${f_kczz}</库存组织>
            <库存组织编码>${f_kczz_bm}</库存组织编码>
            <仓库名称>${f_ckmc}</仓库名称>
            <仓库编码>${f_ckbm}</仓库编码>
            <销售组织编码>${f_xszz_bm}</销售组织编码>
            <销售组织>${f_xszz}</销售组织>
            <业务员工号>${f_xsy_no}</业务员工号>
            <业务员>${f_xsy}</业务员>
            <销往医院>${f_xwyy}</销往医院>

                        <fhj_fhsl>${fhj_fhsl}</fhj_fhsl>
                        <fsjfhsltotal>${fsjfhsltotal}</fsjfhsltotal>
                        <fhj_fhje>${fhj_fhje}</fhj_fhje>
                        <fhj_fhjs>${fhj_fhjs}</fhj_fhjs>
                        <ffh_bz>${ffh_bz}</ffh_bz>
                        <ffplb>${ffplb}</ffplb>
                        <fsj_name>${fsj_name}</fsj_name>
                        <fsj_tel>${fsj_tel}</fsj_tel>
                        <fyjdz>${fyjdz}</fyjdz>
                        <fkd_gs>${fkd_gs}</fkd_gs>
                        <fkd_dh>${fkd_dh}</fkd_dh>
                        <ffph>${ffph}</ffph>
                        <fhrqks>${fhrqks}</fhrqks>
                        <fhrqjs>${fhrqjs}</fhrqjs>
                        <fhj_fpsl>${fhj_fpsl}</fhj_fpsl>
                        <fhj_fpje>${fhj_fpje}</fhj_fpje>
                        <ffp_bz>${ffp_bz}</ffp_bz>
                    </BPM_WGYYFHFPSQ_A>
                   `;
            if (mxlistArrShip.length != 0) {
                for (var i = 0; i < mxlistArrShip.length; i++) {
                    xml += `
                           <BPM_WGYYFHFPSQ_B1>
                               <RelationRowGuid>${(i + 1)}</RelationRowGuid>
                               <RowPrimaryKeys></RowPrimaryKeys>
                               <fentyrno>${(i + 1)}</fentyrno>
                                <ffh_wlbm>${mxlistArrShip[i].fwlbm}</ffh_wlbm>
                                <ffh_wlmc>${mxlistArrShip[i].fwlmc}</ffh_wlmc>
                                <ffh_ggxh>${mxlistArrShip[i].fggxh}</ffh_ggxh>
                                <ffh_dw>${mxlistArrShip[i].fdw}</ffh_dw>
                                <fjldwbm>${mxlistArrShip[i].fdwbm}</fjldwbm>
                                <fzl>${mxlistArrShip[i].fzl}</fzl>
                                <ffh_bzxs>${mxlistArrShip[i].ffh_bzxs}</ffh_bzxs>
                                <ffh_dj>${mxlistArrShip[i].ffh_dj}</ffh_dj>
                                <ffh_sl>${mxlistArrShip[i].ffh_sl}</ffh_sl>
                                <fsjfhsl>${mxlistArrShip[i].fsjfhsl}</fsjfhsl>
                                <套系>${mxlistArrShip[i].f_tx}</套系>
                                <ffh_je>${mxlistArrShip[i].ffh_je}</ffh_je>
                                <ffh_js>${parseInt(mxlistArrShip[i].ffh_js)}</ffh_js>
                           </BPM_WGYYFHFPSQ_B1>
                          `;
                }
            } else {
                xml += `
                     <BPM_WGYYFHFPSQ_B1>
                               <RelationRowGuid>${(1)}</RelationRowGuid>
                               <RowPrimaryKeys></RowPrimaryKeys>
                               <fentyrno></fentyrno>
                                <ffh_wlbm></ffh_wlbm>
                                <ffh_wlmc></ffh_wlmc>
                                <ffh_ggxh></ffh_ggxh>
                                <ffh_dw></ffh_dw>
                                <fjldwbm></fjldwbm>
                                <fzl></fzl>
                                <ffh_bzxs></ffh_bzxs>
                                <ffh_dj></ffh_dj>
                                <ffh_sl></ffh_sl>
                                <fsjfhsl></fsjfhsl>
                                 <套系></套系>
                                <ffh_je></ffh_je>
                                <ffh_js></ffh_js>
                           </BPM_WGYYFHFPSQ_B1>
                      `;
            }

            if (mxlistArrBill.length != 0) {
                for (var i = 0; i < mxlistArrBill.length; i++) {
                    xml += `
                       <BPM_WGYYFHFPSQ_B2>
                            <RelationRowGuid>${(parseInt(mxlistArrShip.length) + 1 + i)}</RelationRowGuid>
                            <RowPrimaryKeys></RowPrimaryKeys>
                            <fentryno>${(i + 1)}</fentryno>
                            <ffp_wlmc>${mxlistArrBill[i].ffp_wlmc}</ffp_wlmc>
                            <ffp_ggxh>${mxlistArrBill[i].ffp_ggxh}</ffp_ggxh>
                            <ffp_dw>${mxlistArrBill[i].ffp_dw}</ffp_dw>
                            <ffp_bzxs>${mxlistArrBill[i].ffp_bzxs}</ffp_bzxs>
                            <ffp_dj>${mxlistArrBill[i].ffp_dj}</ffp_dj>
                            <ffp_sl>${mxlistArrBill[i].ffp_sl}</ffp_sl>
                            <ffp_je>${mxlistArrBill[i].ffp_je}</ffp_je>
                        </BPM_WGYYFHFPSQ_B2>
                          `;
                }

            } else {
                xml += `<BPM_WGYYFHFPSQ_B2>
                              <RelationRowGuid>${(parseInt(mxlistArrShip.length) + 1)}</RelationRowGuid>
                            <RowPrimaryKeys></RowPrimaryKeys>
                            <fentryno>1</fentryno>
                            <ffp_wlmc></ffp_wlmc>
                            <ffp_ggxh></ffp_ggxh>
                            <ffp_dw></ffp_dw>
                            <ffp_bzxs></ffp_bzxs>
                            <ffp_dj></ffp_dj>
                            <ffp_sl></ffp_sl>
                            <ffp_je></ffp_je>    
                        </BPM_WGYYFHFPSQ_B2>
                       `;
            }
            xml += `</FormData>
                     </XForm>
                   `;
            mui.alert('范本将保存到草稿列表中，请到草稿中查阅范本');
            $.ajax({
                type: "POST",
                url: "/api/bpm/PostProcess",
                data: { '': xml },
                beforeSend: function (XHR) {
                    XHR.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem('ticket'));
                }
            }).done((data, status) => {
                if (status == "success") {
                    console.log(data);
                    mui.toast('保存范本成功');
                } else {
                    mui.toast("保存失败!请稍后重试");
                }
            }).fail((e) => {
                console.log(e);
            });
        }
    });
    
   
}

function UpdateDraft() {
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

    /*添加字段*/
    var f_sktj = $("#f_sktj").val();
    var f_sktj_bm = $("#f_sktj_bm").val();
    var f_kczz = $("#f_kczz").val();
    var f_kczz_bm = $("#f_kczz_bm").val();
    var f_ckmc = $("#f_ckmc").val();
    var f_ckbm = $("#f_ckbm").val();
    var f_mchz = $("#f_mchz").val();
    var f_xszz = $("#f_xszz").val();
    var f_xszz_bm = $("#f_xszz_bm").val();
    var f_xsy = $("#f_xsy").val();
    var f_xsy_no = $("#f_xsy_no").val();
    var f_xwyy = $("#f_xwyy").val();


    var mxflag = false;
    var mxlistArrShip = new Array();
    $("#mxlist_fh").find("#mx").each(function () {

        var fwlbm = $(this).find("#fwlbm").val();
        if (fwlbm == "null") {
            return;
        }
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
        var f_tx = $(this).find("#f_tx").val();


        var mx = new MxItem_trad(fwlbm, fwlmc, fggxh, fdw, fdwbm, fzl, ffh_bzxs, ffh_dj, ffh_sl, fsjfhsl, ffh_je, ffh_js, f_tx);
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
        if (ffp_wlmc == "null") {
            return;
        }
        var ffp_ggxh = $(this).find("#ffp_ggxh").val();
        var ffp_dw = $(this).find("#ffp_dw").val();
        var ffp_bzxs = $(this).find("#ffp_bzxs").val();
        var ffp_dj = $(this).find("#ffp_dj").val();
        var ffp_sl = $(this).find("#ffp_sl").val();
        var ffp_je = $(this).find("#ffp_je").val();
        
        var mx = new MxItem_bill(ffp_wlmc, ffp_ggxh, ffp_dw, ffp_bzxs, ffp_dj, ffp_sl, ffp_je);
        mxlistArrBill.push(mx);
    });

    var ffp_bz = $("#ffp_bz").val();


    var DraftGuid = $("#DraftGuid").val();
    if (ckjsflag) {
        mui.alert('发货子表件数不正确，应为整数,更新范本失败');
        return;
    }
    var btnArry = ["取消", "确定"];
    mui.confirm('保存范本，是否确定？', '范本保存提醒', btnArry, function (e) {
        if (e.index == 1) {
            var xml = `<?xml version="1.0"?>
                            <XForm>
                                <Header>
                                    <Method>SaveDraft</Method>
                                    <ProcessName>药业集团发货、发票开具申请</ProcessName>
                                    <DraftGuid>${DraftGuid}</DraftGuid>
                                    <OwnerMemberFullName>${BPMOU}</OwnerMemberFullName>
                                    <Comment></Comment>
                                    <UrlParams>{}</UrlParams>
                                    <ConsignEnabled>false</ConsignEnabled>
                                    <ConsignUsers>[]</ConsignUsers>
                                    <ConsignRoutingType>Parallel</ConsignRoutingType>
                                    <ConsignReturnType>Return</ConsignReturnType>
                                    <InviteIndicateUsers>[]</InviteIndicateUsers>
                                    <Context>{&quot;Routing&quot;:{}}</Context>
                                </Header>
                                <FormData>

                      `;

            xml += `<BPM_WGYYFHFPSQ_A>
                        <fbillno>自动生成</fbillno>
                        <fname>${fname}</fname>
                        <fqy>${fqy}</fqy>
                        <fsqrq>${fsqrq}</fsqrq>
                        <fsqlx>${fsqlx}</fsqlx>
                        <fkhbm>${fkhbm}</fkhbm>
                        <fkczz>${fkzcc}</fkczz>
                        <fkhmc>${fkhmc}</fkhmc>
                        <fxszg>${fxszg}</fxszg>
                        <fsh_dz>${fsh_dz}</fsh_dz>
                        <fsh_name>${fsh_name}</fsh_name>
                        <fsh_tel>${fsh_tel}</fsh_tel>
                        <fdhrq>${fdhrq}</fdhrq>
                        <fkhlx>${fkhlx}</fkhlx>
                        <fdqqk>${fdqqk}</fdqqk>
                        <fcsxq>${fcsxq}</fcsxq>
                        <fckdh>${fckdh}</fckdh>
            <收款条件>${f_sktj}</收款条件>
            <收款条件编码>${f_sktj_bm}</收款条件编码>
            <名称后缀>${f_mchz}</名称后缀>
            <库存组织>${f_kczz}</库存组织>
            <库存组织编码>${f_kczz_bm}</库存组织编码>
            <仓库名称>${f_ckmc}</仓库名称>
            <仓库编码>${f_ckbm}</仓库编码>
            <销售组织编码>${f_xszz_bm}</销售组织编码>
            <销售组织>${f_xszz}</销售组织>
            <业务员工号>${f_xsy_no}</业务员工号>
            <业务员>${f_xsy}</业务员>
            <销往医院>${f_xwyy}</销往医院>
                        <fhj_fhsl>${fhj_fhsl}</fhj_fhsl>
                        <fsjfhsltotal>${fsjfhsltotal}</fsjfhsltotal>
                        <fhj_fhje>${fhj_fhje}</fhj_fhje>
                        <fhj_fhjs>${fhj_fhjs}</fhj_fhjs>
                        <ffh_bz>${ffh_bz}</ffh_bz>
                        <ffplb>${ffplb}</ffplb>
                        <fsj_name>${fsj_name}</fsj_name>
                        <fsj_tel>${fsj_tel}</fsj_tel>
                        <fyjdz>${fyjdz}</fyjdz>
                        <fkd_gs>${fkd_gs}</fkd_gs>
                        <fkd_dh>${fkd_dh}</fkd_dh>
                        <ffph>${ffph}</ffph>
                        <fhrqks>${fhrqks}</fhrqks>
                        <fhrqjs>${fhrqjs}</fhrqjs>
                        <fhj_fpsl>${fhj_fpsl}</fhj_fpsl>
                        <fhj_fpje>${fhj_fpje}</fhj_fpje>
                        <ffp_bz>${ffp_bz}</ffp_bz>
                    </BPM_WGYYFHFPSQ_A>
                   `;
            if (mxlistArrShip.length != 0) {
                for (var i = 0; i < mxlistArrShip.length; i++) {
                    xml += `
                           <BPM_WGYYFHFPSQ_B1>
                               <RelationRowGuid>${(i + 1)}</RelationRowGuid>
                               <RowPrimaryKeys></RowPrimaryKeys>
                               <fentyrno>${(i + 1)}</fentyrno>
                                <ffh_wlbm>${mxlistArrShip[i].fwlbm}</ffh_wlbm>
                                <ffh_wlmc>${mxlistArrShip[i].fwlmc}</ffh_wlmc>
                                <ffh_ggxh>${mxlistArrShip[i].fggxh}</ffh_ggxh>
                                <ffh_dw>${mxlistArrShip[i].fdw}</ffh_dw>
                                <fjldwbm>${mxlistArrShip[i].fdwbm}</fjldwbm>
                                <fzl>${mxlistArrShip[i].fzl}</fzl>
                                <ffh_bzxs>${mxlistArrShip[i].ffh_bzxs}</ffh_bzxs>
                                <ffh_dj>${mxlistArrShip[i].ffh_dj}</ffh_dj>
                                <ffh_sl>${mxlistArrShip[i].ffh_sl}</ffh_sl>
                                <fsjfhsl>${mxlistArrShip[i].fsjfhsl}</fsjfhsl>
                                <套系>${mxlistArrShip[i].f_tx}</套系>
                                <ffh_je>${mxlistArrShip[i].ffh_je}</ffh_je>
                                <ffh_js>${parseInt(mxlistArrShip[i].ffh_js)}</ffh_js>
                           </BPM_WGYYFHFPSQ_B1>
                          `;
                }
            } else {
                xml += `
                     <BPM_WGYYFHFPSQ_B1>
                               <RelationRowGuid>${(1)}</RelationRowGuid>
                               <RowPrimaryKeys></RowPrimaryKeys>
                               <fentyrno></fentyrno>
                                <ffh_wlbm></ffh_wlbm>
                                <ffh_wlmc></ffh_wlmc>
                                <ffh_ggxh></ffh_ggxh>
                                <ffh_dw></ffh_dw>
                                <fjldwbm></fjldwbm>
                                <fzl></fzl>
                                <ffh_bzxs></ffh_bzxs>
                                <ffh_dj></ffh_dj>
                                <ffh_sl></ffh_sl>
                                <fsjfhsl></fsjfhsl>
                                <套系></套系>
                                <ffh_je></ffh_je>
                                <ffh_js></ffh_js>
                           </BPM_WGYYFHFPSQ_B1>
                      `;
            }

            if (mxlistArrBill.length != 0) {
                for (var i = 0; i < mxlistArrBill.length; i++) {
                    xml += `
                       <BPM_WGYYFHFPSQ_B2>
                            <RelationRowGuid>${(parseInt(mxlistArrShip.length) + 1 + i)}</RelationRowGuid>
                            <RowPrimaryKeys></RowPrimaryKeys>
                            <fentryno>${(i + 1)}</fentryno>
                            <ffp_wlmc>${mxlistArrBill[i].ffp_wlmc}</ffp_wlmc>
                            <ffp_ggxh>${mxlistArrBill[i].ffp_ggxh}</ffp_ggxh>
                            <ffp_dw>${mxlistArrBill[i].ffp_dw}</ffp_dw>
                            <ffp_bzxs>${mxlistArrBill[i].ffp_bzxs}</ffp_bzxs>
                            <ffp_dj>${mxlistArrBill[i].ffp_dj}</ffp_dj>
                            <ffp_sl>${mxlistArrBill[i].ffp_sl}</ffp_sl>
                            <ffp_je>${mxlistArrBill[i].ffp_je}</ffp_je>
                        </BPM_WGYYFHFPSQ_B2>
                          `;
                }

            } else {
                xml += `<BPM_WGYYFHFPSQ_B2>
                              <RelationRowGuid>${(parseInt(mxlistArrShip.length) + 1)}</RelationRowGuid>
                            <RowPrimaryKeys></RowPrimaryKeys>
                            <fentryno>1</fentryno>
                            <ffp_wlmc></ffp_wlmc>
                            <ffp_ggxh></ffp_ggxh>
                            <ffp_dw></ffp_dw>
                            <ffp_bzxs></ffp_bzxs>
                            <ffp_dj></ffp_dj>
                            <ffp_sl></ffp_sl>
                            <ffp_je></ffp_je>    
                        </BPM_WGYYFHFPSQ_B2>
                       `;
            }
            xml += `</FormData>
                     </XForm>
                   `;

            $.ajax({
                type: "POST",
                url: "/api/bpm/PostProcess",
                data: { '': xml },
                beforeSend: function (XHR) {
                    XHR.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem('ticket'));
                }
            }).done((data, status) => {
                if (status == "success") {
                    console.log(data);
                    mui.toast('更新范本成功');
                } else {
                    mui.toast("更新失败!请稍后重试");
                }
            }).fail((e) => {
                console.log(e);
            });
        }
    });
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

    /*添加字段*/
    var f_sktj = $("#f_sktj").val();
    var f_sktj_bm = $("#f_sktj_bm").val();
    var f_kczz = $("#f_kczz").val();
    var f_kczz_bm = $("#f_kczz_bm").val();
    var f_ckmc = $("#f_ckmc").val();
    var f_ckbm = $("#f_ckbm").val();
    var f_mchz = $("#f_mchz").val();
    var f_xszz = $("#f_xszz").val();
    var f_xszz_bm = $("#f_xszz_bm").val();
    var f_xsy = $("#f_xsy").val();
    var f_xsy_no = $("#f_xsy_no").val();
    var f_xwyy = $("#f_xwyy").val();

    var mxflag = false;
    var mxlistArrShip = new Array();
    $("#mxlist_fh").find("#mx").each(function () {

        var fwlbm = $(this).find("#fwlbm").val();
        if (fwlbm == "null") {
            return;
        }
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
        var f_tx = $(this).find("#f_tx").val();
      

        var mx = new MxItem_trad(fwlbm, fwlmc, fggxh, fdw, fdwbm, fzl, ffh_bzxs, ffh_dj, ffh_sl, fsjfhsl, ffh_je, ffh_js, f_tx);
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
        if (ffp_wlmc == "null") {
            return;
        }
        var ffp_ggxh = $(this).find("#ffp_ggxh").val();
        var ffp_dw = $(this).find("#ffp_dw").val();
        var ffp_bzxs = $(this).find("#ffp_bzxs").val();
        var ffp_dj = $(this).find("#ffp_dj").val();
        var ffp_sl = $(this).find("#ffp_sl").val();
        var ffp_je = $(this).find("#ffp_je").val();

        var mx = new MxItem_bill(ffp_wlmc, ffp_ggxh, ffp_dw, ffp_bzxs, ffp_dj, ffp_sl, ffp_je);
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
        if (!f_ckmc) {
            mui.toast('请选择仓库');
            return;
        }
        if (!f_xwyy) {
            mui.toast('请填写往销医院');
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

    //if (ckjsflag) {
    //    mui.alert('发货子表件数不正确，应为整数,提交失败');
    //    return;
    //}
    var btnArry = ["取消", "确定"];
    mui.confirm('即将提交，是否确定？', '提交确认提醒', btnArry, function (e) {
        if (e.index == 1) {
            var xml = `<?xml version= "1.0" ?>
                           <XForm>
                               <Header>
                                   <Method>Post</Method>
                                   <ProcessName>药业集团发货、发票开具申请</ProcessName>
                                   <ProcessVersion>${version}</ProcessVersion>
                                   <DraftGuid></DraftGuid>
                                   <OwnerMemberFullName>${BPMOU}</OwnerMemberFullName>
                                   <Action>提交</Action>
                                   <Comment></Comment>
                                   <InviteIndicateUsers></InviteIndicateUsers>
                               </Header>
                              <FormData>
                      `;

            xml += `<BPM_WGYYFHFPSQ_A>
                        <fbillno>自动生成</fbillno>
                        <fname>${fname}</fname>
                        <fqy>${fqy}</fqy>
                        <fsqrq>${fsqrq}</fsqrq>
                        <fsqlx>${fsqlx}</fsqlx>
                        <fkhbm>${fkhbm}</fkhbm>
                        <fkczz>${fkzcc}</fkczz>
                        <fkhmc>${fkhmc}</fkhmc>
                        <fxszg>${fxszg}</fxszg>
                        <fsh_dz>${fsh_dz}</fsh_dz>
                        <fsh_name>${fsh_name}</fsh_name>
                        <fsh_tel>${fsh_tel}</fsh_tel>
                        <fdhrq>${fdhrq}</fdhrq>
                        <fkhlx>${fkhlx}</fkhlx>
                        <fdqqk>${fdqqk}</fdqqk>
                        <fcsxq>${fcsxq}</fcsxq>
                        <fckdh>${fckdh}</fckdh>
            <收款条件>${f_sktj}</收款条件>
            <收款条件编码>${f_sktj_bm}</收款条件编码>
            <名称后缀>${f_mchz}</名称后缀>
            <库存组织>${f_kczz}</库存组织>
            <库存组织编码>${f_kczz_bm}</库存组织编码>
            <仓库名称>${f_ckmc}</仓库名称>
            <仓库编码>${f_ckbm}</仓库编码>
            <销售组织编码>${f_xszz_bm}</销售组织编码>
            <销售组织>${f_xszz}</销售组织>
            <业务员工号>${f_xsy_no}</业务员工号>
            <业务员>${f_xsy}</业务员>
            <销往医院>${f_xwyy}</销往医院>
                        <fhj_fhsl>${fhj_fhsl}</fhj_fhsl>
                        <fsjfhsltotal>${fsjfhsltotal}</fsjfhsltotal>
                        <fhj_fhje>${fhj_fhje}</fhj_fhje>
                        <fhj_fhjs>${fhj_fhjs}</fhj_fhjs>
                        <ffh_bz>${ffh_bz}</ffh_bz>
                        <ffplb>${ffplb}</ffplb>
                        <fsj_name>${fsj_name}</fsj_name>
                        <fsj_tel>${fsj_tel}</fsj_tel>
                        <fyjdz>${fyjdz}</fyjdz>
                        <fkd_gs>${fkd_gs}</fkd_gs>
                        <fkd_dh>${fkd_dh}</fkd_dh>
                        <ffph>${ffph}</ffph>
                        <fhrqks>${fhrqks}</fhrqks>
                        <fhrqjs>${fhrqjs}</fhrqjs>
                        <fhj_fpsl>${fhj_fpsl}</fhj_fpsl>
                        <fhj_fpje>${fhj_fpje}</fhj_fpje>
                        <ffp_bz>${ffp_bz}</ffp_bz>
                    </BPM_WGYYFHFPSQ_A>
                   `;
            if (mxlistArrShip.length != 0) {
                for (var i = 0; i < mxlistArrShip.length; i++) {
                    xml += `
                           <BPM_WGYYFHFPSQ_B1>
                               <RelationRowGuid>${(i + 1)}</RelationRowGuid>
                               <RowPrimaryKeys></RowPrimaryKeys>
                               <fentyrno>${(i + 1)}</fentyrno>
                                <ffh_wlbm>${mxlistArrShip[i].fwlbm}</ffh_wlbm>
                                <ffh_wlmc>${mxlistArrShip[i].fwlmc}</ffh_wlmc>
                                <ffh_ggxh>${mxlistArrShip[i].fggxh}</ffh_ggxh>
                                <ffh_dw>${mxlistArrShip[i].fdw}</ffh_dw>
                                <fjldwbm>${mxlistArrShip[i].fdwbm}</fjldwbm>
                                <fzl>${mxlistArrShip[i].fzl}</fzl>
                                <ffh_bzxs>${mxlistArrShip[i].ffh_bzxs}</ffh_bzxs>
                                <ffh_dj>${mxlistArrShip[i].ffh_dj}</ffh_dj>
                                <ffh_sl>${mxlistArrShip[i].ffh_sl}</ffh_sl>
                                <fsjfhsl>${mxlistArrShip[i].fsjfhsl}</fsjfhsl>
                                <套系>${mxlistArrShip[i].f_tx}</套系>
                                <ffh_je>${mxlistArrShip[i].ffh_je}</ffh_je>
                                <ffh_js>${parseInt(mxlistArrShip[i].ffh_js)}</ffh_js>
                           </BPM_WGYYFHFPSQ_B1>
                          `;
                }
            } else {
                xml += `
                     <BPM_WGYYFHFPSQ_B1>
                               <RelationRowGuid>${( 1)}</RelationRowGuid>
                               <RowPrimaryKeys></RowPrimaryKeys>
                               <fentyrno></fentyrno>
                                <ffh_wlbm></ffh_wlbm>
                                <ffh_wlmc></ffh_wlmc>
                                <ffh_ggxh></ffh_ggxh>
                                <ffh_dw></ffh_dw>
                                <fjldwbm></fjldwbm>
                                <fzl></fzl>
                                <ffh_bzxs></ffh_bzxs>
                                <ffh_dj></ffh_dj>
                                <ffh_sl></ffh_sl>
                                <fsjfhsl></fsjfhsl>
                                <套系></套系>
                                <ffh_je></ffh_je>
                                <ffh_js></ffh_js>
                           </BPM_WGYYFHFPSQ_B1>
                      `;
            }

            if (mxlistArrBill.length != 0) {
                for (var i = 0; i < mxlistArrBill.length; i++) {
                    xml += `
                       <BPM_WGYYFHFPSQ_B2>
                            <RelationRowGuid>${(parseInt(mxlistArrShip.length) + 1 + i)}</RelationRowGuid>
                            <RowPrimaryKeys></RowPrimaryKeys>
                            <fentryno>${(i + 1)}</fentryno>
                            <ffp_wlmc>${mxlistArrBill[i].ffp_wlmc}</ffp_wlmc>
                            <ffp_ggxh>${mxlistArrBill[i].ffp_ggxh}</ffp_ggxh>
                            <ffp_dw>${mxlistArrBill[i].ffp_dw}</ffp_dw>
                            <ffp_bzxs>${mxlistArrBill[i].ffp_bzxs}</ffp_bzxs>
                            <ffp_dj>${mxlistArrBill[i].ffp_dj}</ffp_dj>
                            <ffp_sl>${mxlistArrBill[i].ffp_sl}</ffp_sl>
                            <ffp_je>${mxlistArrBill[i].ffp_je}</ffp_je>
                        </BPM_WGYYFHFPSQ_B2>
                          `;
                }
    
            } else {
                xml += `<BPM_WGYYFHFPSQ_B2>
                              <RelationRowGuid>${(parseInt(mxlistArrShip.length) + 1 )}</RelationRowGuid>
                            <RowPrimaryKeys></RowPrimaryKeys>
                            <fentryno>1</fentryno>
                            <ffp_wlmc></ffp_wlmc>
                            <ffp_ggxh></ffp_ggxh>
                            <ffp_dw></ffp_dw>
                            <ffp_bzxs></ffp_bzxs>
                            <ffp_dj></ffp_dj>
                            <ffp_sl></ffp_sl>
                            <ffp_je></ffp_je>    
                        </BPM_WGYYFHFPSQ_B2>
                       `;
            }
            xml += `</FormData>
                     </XForm>
                   `;
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
    /*添加字段*/
    var f_sktj = $("#f_sktj").val();
    var f_sktj_bm = $("#f_sktj_bm").val();
    var f_kczz = $("#f_kczz").val();
    var f_kczz_bm = $("#f_kczz_bm").val();
    var f_ckmc = $("#f_ckmc").val();
    var f_ckbm = $("#f_ckbm").val();
    var f_mchz = $("#f_mchz").val();
    var f_xszz = $("#f_xszz").val();
    var f_xszz_bm = $("#f_xszz_bm").val();
    var f_xsy = $("#f_xsy").val();
    var f_xsy_no = $("#f_xsy_no").val();
    var f_xwyy = $("#f_xwyy").val();

    var mxflag = false;
    var mxlistArrShip = new Array();
    $("#mxlist_fh").find("#mx").each(function () {

        var fwlbm = $(this).find("#fwlbm").val();
        if (fwlbm == "null") {
            return;
        }
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
        var f_tx = $(this).find("#f_tx").val();


        var mx = new MxItem_trad(fwlbm, fwlmc, fggxh, fdw, fdwbm, fzl, ffh_bzxs, ffh_dj, ffh_sl, fsjfhsl, ffh_je, ffh_js, f_tx);
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
        if (ffp_wlmc == "null") {
            return;
        }
        var ffp_ggxh = $(this).find("#ffp_ggxh").val();
        var ffp_dw = $(this).find("#ffp_dw").val();
        var ffp_bzxs = $(this).find("#ffp_bzxs").val();
        var ffp_dj = $(this).find("#ffp_dj").val();
        var ffp_sl = $(this).find("#ffp_sl").val();
        var ffp_je = $(this).find("#ffp_je").val();

        var mx = new MxItem_bill(ffp_wlmc, ffp_ggxh, ffp_dw, ffp_bzxs, ffp_dj, ffp_sl, ffp_je);
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
        if (!f_ckmc) {
            mui.toast('请选择仓库');
            return;
        }
        if (!f_xwyy) {
            mui.toast('请填写往销医院');
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
            xml += `<BPM_WGYYFHFPSQ_A>
                        <fbillno>${fbillno}</fbillno>
                        <fname>${fname}</fname>
                        <fqy>${fqy}</fqy>
                        <fsqrq>${fsqrq}</fsqrq>
                        <fsqlx>${fsqlx}</fsqlx>
                        <fkhbm>${fkhbm}</fkhbm>
                        <fkczz>${fkzcc}</fkczz>
                        <fkhmc>${fkhmc}</fkhmc>
                        <fxszg>${fxszg}</fxszg>
                        <fsh_dz>${fsh_dz}</fsh_dz>
                        <fsh_name>${fsh_name}</fsh_name>
                        <fsh_tel>${fsh_tel}</fsh_tel>
                        <fdhrq>${fdhrq}</fdhrq>
                        <fkhlx>${fkhlx}</fkhlx>
                        <fdqqk>${fdqqk}</fdqqk>
                        <fcsxq>${fcsxq}</fcsxq>
                        <fckdh>${fckdh}</fckdh>
            <收款条件>${f_sktj}</收款条件>
            <收款条件编码>${f_sktj_bm}</收款条件编码>
            <名称后缀>${f_mchz}</名称后缀>
            <库存组织>${f_kczz}</库存组织>
            <库存组织编码>${f_kczz_bm}</库存组织编码>
            <仓库名称>${f_ckmc}</仓库名称>
            <仓库编码>${f_ckbm}</仓库编码>
            <销售组织编码>${f_xszz_bm}</销售组织编码>
            <销售组织>${f_xszz}</销售组织>
            <业务员工号>${f_xsy_no}</业务员工号>
            <业务员>${f_xsy}</业务员>
            <销往医院>${f_xwyy}</销往医院>
                        <fhj_fhsl>${fhj_fhsl}</fhj_fhsl>
                        <fsjfhsltotal>${fsjfhsltotal}</fsjfhsltotal>
                        <fhj_fhje>${fhj_fhje}</fhj_fhje>
                        <fhj_fhjs>${fhj_fhjs}</fhj_fhjs>
                        <ffh_bz>${ffh_bz}</ffh_bz>
                        <ffplb>${ffplb}</ffplb>
                        <fsj_name>${fsj_name}</fsj_name>
                        <fsj_tel>${fsj_tel}</fsj_tel>
                        <fyjdz>${fyjdz}</fyjdz>
                        <fkd_gs>${fkd_gs}</fkd_gs>
                        <fkd_dh>${fkd_dh}</fkd_dh>
                        <ffph>${ffph}</ffph>
                        <fhrqks>${fhrqks}</fhrqks>
                        <fhrqjs>${fhrqjs}</fhrqjs>
                        <fhj_fpsl>${fhj_fpsl}</fhj_fpsl>
                        <fhj_fpje>${fhj_fpje}</fhj_fpje>
                        <ffp_bz>${ffp_bz}</ffp_bz>
                    </BPM_WGYYFHFPSQ_A>
                   `;
            if (mxlistArrShip.length != 0) {
                for (var i = 0; i < mxlistArrShip.length; i++) {
                    xml += `
                           <BPM_WGYYFHFPSQ_B1>
                               <RelationRowGuid>${(i + 1)}</RelationRowGuid>
                               <RowPrimaryKeys>itemid=${itemidArr1[i]}</RowPrimaryKeys>
                               <fentyrno>${(i + 1)}</fentyrno>
                                <ffh_wlbm>${mxlistArrShip[i].fwlbm}</ffh_wlbm>
                                <ffh_wlmc>${mxlistArrShip[i].fwlmc}</ffh_wlmc>
                                <ffh_ggxh>${mxlistArrShip[i].fggxh}</ffh_ggxh>
                                <ffh_dw>${mxlistArrShip[i].fdw}</ffh_dw>
                                <fjldwbm>${mxlistArrShip[i].fdwbm}</fjldwbm>
                                <fzl>${mxlistArrShip[i].fzl}</fzl>
                                <ffh_bzxs>${mxlistArrShip[i].ffh_bzxs}</ffh_bzxs>
                                <ffh_dj>${mxlistArrShip[i].ffh_dj}</ffh_dj>
                                <ffh_sl>${mxlistArrShip[i].ffh_sl}</ffh_sl>
                                <fsjfhsl>${mxlistArrShip[i].fsjfhsl}</fsjfhsl>
                                <套系>${mxlistArrShip[i].f_tx}</套系>
                                <ffh_je>${mxlistArrShip[i].ffh_je}</ffh_je>
                                <ffh_js>${parseInt(mxlistArrShip[i].ffh_js)}</ffh_js>
                           </BPM_WGYYFHFPSQ_B1>
                          `;
                }
            } else {
                xml += `
                     <BPM_WGYYFHFPSQ_B1>
                               <RelationRowGuid>${( 1)}</RelationRowGuid>
                               <RowPrimaryKeys>itemid=${itemidArr1[0]}</RowPrimaryKeys>
                               <fentyrno></fentyrno>
                                <ffh_wlbm></ffh_wlbm>
                                <ffh_wlmc></ffh_wlmc>
                                <ffh_ggxh></ffh_ggxh>
                                <ffh_dw></ffh_dw>
                                <fjldwbm></fjldwbm>
                                <fzl></fzl>
                                <ffh_bzxs></ffh_bzxs>
                                <ffh_dj></ffh_dj>
                                <ffh_sl></ffh_sl>
                                <fsjfhsl></fsjfhsl>
                                <套系></套系>
                                <ffh_je></ffh_je>
                                <ffh_js></ffh_js>
                           </BPM_WGYYFHFPSQ_B1>
                      `;
            }

            if (mxlistArrBill.length != 0) {
                for (var i = 0; i < mxlistArrBill.length; i++) {
                    xml += `
                       <BPM_WGYYFHFPSQ_B2>
                            <RelationRowGuid>${(parseInt(mxlistArrShip.length) + 1 + i)}</RelationRowGuid>
                            <RowPrimaryKeys>itemid=${itemidArr2[i]}</RowPrimaryKeys>
                            <fentryno>${(i + 1)}</fentryno>
                            <ffp_wlmc>${mxlistArrBill[i].ffp_wlmc}</ffp_wlmc>
                            <ffp_ggxh>${mxlistArrBill[i].ffp_ggxh}</ffp_ggxh>
                            <ffp_dw>${mxlistArrBill[i].ffp_dw}</ffp_dw>
                            <ffp_bzxs>${mxlistArrBill[i].ffp_bzxs}</ffp_bzxs>
                            <ffp_dj>${mxlistArrBill[i].ffp_dj}</ffp_dj>
                            <ffp_sl>${mxlistArrBill[i].ffp_sl}</ffp_sl>
                            <ffp_je>${mxlistArrBill[i].ffp_je}</ffp_je>
                        </BPM_WGYYFHFPSQ_B2>
                          `;
                }

            } else {
                xml += `<BPM_WGYYFHFPSQ_B2>
                              <RelationRowGuid>${(parseInt(mxlistArrShip.length) + 1)}</RelationRowGuid>
                            <RowPrimaryKeys>itemid=${itemidArr2[0]}</RowPrimaryKeys>
                            <fentryno>1</fentryno>
                            <ffp_wlmc></ffp_wlmc>
                            <ffp_ggxh></ffp_ggxh>
                            <ffp_dw></ffp_dw>
                            <ffp_bzxs></ffp_bzxs>
                            <ffp_dj></ffp_dj>
                            <ffp_sl></ffp_sl>
                            <ffp_je></ffp_je>    
                        </BPM_WGYYFHFPSQ_B2>
                       `;
            }
            xml += `</FormData>
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
    /*添加字段*/
    var f_sktj = $("#f_sktj").val();
    var f_sktj_bm = $("#f_sktj_bm").val();
    var f_kczz = $("#f_kczz").val();
    var f_kczz_bm = $("#f_kczz_bm").val();
    var f_ckmc = $("#f_ckmc").val();
    var f_ckbm = $("#f_ckbm").val();
    var f_mchz = $("#f_mchz").val();
    var f_xszz = $("#f_xszz").val();
    var f_xszz_bm = $("#f_xszz_bm").val();
    var f_xsy = $("#f_xsy").val();
    var f_xsy_no = $("#f_xsy_no").val();
    var f_xwyy = $("#f_xwyy").val();


    var mxflag = false;
    var mxlistArrShip = new Array();
    $("#mxlist_fh").find("#mx").each(function () {

        var fwlbm = $(this).find("#fwlbm").val();
        if (fwlbm == "null") {
            return;
        }
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
        var f_tx = $(this).find("#f_tx").val();


        var mx = new MxItem_trad(fwlbm, fwlmc, fggxh, fdw, fdwbm, fzl, ffh_bzxs, ffh_dj, ffh_sl, fsjfhsl, ffh_je, ffh_js, f_tx);
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
        if (ffp_wlmc == "null") {
            return;
        }
        var ffp_ggxh = $(this).find("#ffp_ggxh").val();
        var ffp_dw = $(this).find("#ffp_dw").val();
        var ffp_bzxs = $(this).find("#ffp_bzxs").val();
        var ffp_dj = $(this).find("#ffp_dj").val();
        var ffp_sl = $(this).find("#ffp_sl").val();
        var ffp_je = $(this).find("#ffp_je").val();

        var mx = new MxItem_bill(ffp_wlmc, ffp_ggxh, ffp_dw, ffp_bzxs, ffp_dj, ffp_sl, ffp_je);
        mxlistArrBill.push(mx);
    });

    var ffp_bz = $("#ffp_bz").val();
    //特殊节点必填项校验

    //console.log($("#nodeName").val());

    //商务专员1
    if ((String(nodeName).match(/\d+/g) == null && String(nodeName).match('商务') != null) || String(nodeName).match('（营销一区）1') != null) {
        if (String(fsqlx).match('发货') != null) {
            if (!fckdh) {
                mui.toast('请填写出库单号');
                return;
            }
        }


        //核算专员
    } else if (String(nodeName).match('核算专员') != null) {



        //发票专员
    } else if (String(nodeName).match('开票专员') != null) {
        if (String(fsqlx).match('发票') != null) {
            if (!ffph) {
                mui.toast('请填写发票号');
                return;
            }
        }



        //商务专员2
    } else if (String(nodeName).match(/\d+/g) != null && String(nodeName).match('商务') != null) {
        if (String(fsqlx).match('发票') != null) {
            if (!fkd_gs) {
                mui.toast('请选择快递公司');
                return;
            }
            if (!fkd_dh) {
                mui.toast('请选择快递单号');
                return;
            }

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
            xml += `
<收款条件>${f_sktj}</收款条件>
            <收款条件编码>${f_sktj_bm}</收款条件编码>
            <名称后缀>${f_mchz}</名称后缀>
            <库存组织>${f_kczz}</库存组织>
            <库存组织编码>${f_kczz_bm}</库存组织编码>
            <仓库名称>${f_ckmc}</仓库名称>
            <仓库编码>${f_ckbm}</仓库编码>
            <销售组织编码>${f_xszz_bm}</销售组织编码>
            <销售组织>${f_xszz}</销售组织>
            <业务员工号>${f_xsy_no}</业务员工号>
            <业务员>${f_xsy}</业务员>
            <销往医院>${f_xwyy}</销往医院>
 `;
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
                    xml += ' <套系>' + mxlistArrShip[i].f_tx + '</套系>';
                    xml += '  <ffh_je>' + mxlistArrShip[i].ffh_je + '</ffh_je>';
                    xml += '  <ffh_js>' + parseInt(mxlistArrShip[i].ffh_js) + '</ffh_js>';
                    xml += ' </BPM_WGYYFHFPSQ_B1>';
                }
            } else {
                xml += ' <BPM_WGYYFHFPSQ_B1>';
                xml += '   <RelationRowGuid>' + ( 1) + '</RelationRowGuid>';
                xml += '  <RowPrimaryKeys>itemid=' + itemidArr1[0] + '</RowPrimaryKeys>';
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
                xml += ' <套系></套系>';
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

                xml += ' <RowPrimaryKeys>itemid=' + itemidArr2[0] + '</RowPrimaryKeys>';
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
        xml += `
<收款条件>${f_sktj}</收款条件>
            <收款条件编码>${f_sktj_bm}</收款条件编码>
            <名称后缀>${f_mchz}</名称后缀>
            <库存组织>${f_kczz}</库存组织>
            <库存组织编码>${f_kczz_bm}</库存组织编码>
            <仓库名称>${f_ckmc}</仓库名称>
            <仓库编码>${f_ckbm}</仓库编码>
            <销售组织编码>${f_xszz_bm}</销售组织编码>
            <销售组织>${f_xszz}</销售组织>
            <业务员工号>${f_xsy_no}</业务员工号>
            <业务员>${f_xsy}</业务员>
            <销往医院>${f_xwyy}</销往医院>
 `;
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
                xml += ' <套系>' + mxlistArrShip[i].f_tx + '</套系>';
                xml += '  <ffh_je>' + mxlistArrShip[i].ffh_je + '</ffh_je>';
                xml += '  <ffh_js>' + parseInt(mxlistArrShip[i].ffh_js) + '</ffh_js>';
                xml += ' </BPM_WGYYFHFPSQ_B1>';
            }
        } else {
            xml += ' <BPM_WGYYFHFPSQ_B1>';
            xml += '   <RelationRowGuid>' + ( 1) + '</RelationRowGuid>';
            xml += '  <RowPrimaryKeys>itemid=' + itemidArr1[0] + '</RowPrimaryKeys>';
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
            xml += ' <套系></套系>';
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

            xml += ' <RowPrimaryKeys>itemid=' + itemidArr2[0] + '</RowPrimaryKeys>';
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
 