function prepMsg() {
    tapEvent();
    $("#fdate").val(getNowFormatDate(2));
    var xml = `<?xml version= "1.0" ?>
               <Requests>
               <Params>
               <Method>GetFormPostData</Method>
               <ProcessName>威海卫大厦物资采购申请</ProcessName>
               <ProcessVersion>${version}</ProcessVersion>
               <Owner></Owner>
               </Params>
               </Requests>
    `;
    dataProvider(xml, function (data) {
        var provideData = JSON.parse(unescape(data.replace(/\\(u[0-9a-fA-F]{4})/gm, '%$1')));
        console.log(provideData);
        var item = provideData.Tables[0].Rows[0];
        $("#fname").val(item.fname);
        $("#fdept").val(item.fdept);
    });
    initCheckboxMsg();
}

function dataProvider(xml, callback) {

    var p = new Promise(function (resolve, reject) {
        $.ajax({
            type: "POST",
            url: "/api/bpm/DataProvider",
            data: { '': xml },
            beforeSend: function (XHR) {
                XHR.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem('ticket'));
            }
        }).done(function (data) {
            callback(data);
            resolve();
        }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
            if (XMLHttpRequest.status == "401") {
                mui.alert('授权过期，请重新打开页面');;
            } else if (XMLHttpRequest.status == "500") {
                mui.alert('服务器内部错误');
            }
            reject();
        });
    });
    return p;
}

function tapEvent() {

    mui('#fif_spd').each(function () { //循环所有toggle

        /**
         * toggle 事件监听
         */
        this.addEventListener('toggle', function (event) {
            //event.detail.isActive 可直接获取当前状态
            if (event.detail.isActive) {
                $("#fif_sp").val('是');
            } else {
                $("#fif_sp").val('否');
            }
        });
    });

    mui('#fif_5qd').each(function () { //循环所有toggle

        /**
         * toggle 事件监听
         */
        this.addEventListener('toggle', function (event) {
            //event.detail.isActive 可直接获取当前状态
            if (event.detail.isActive) {
                $("#fif_5q").val('是');
            } else {
                $("#fif_5q").val('否');
            }
        });
    });
    $("#tjmx").on('tap', () => {

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

}
function initCheckboxMsg() {

    var xml = `<?xml version= "1.0" ?>
                <Requests>
                <Params>
                <DataSource>BPM_WEGO</DataSource> 
                <ID>erpcloud_威海卫大厦采购申请单</ID>
                <Type>1</Type>
                <Method>GetUserDataProcedure</Method>
                <ProcedureName>erpcloud_威海卫大厦采购申请单</ProcedureName> 
                <Filter>
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
        var items = provideData.Tables[0].Rows;
        var li = ``;
        for (let item of items) {
            li += `
                   <li data-value="" data-tags="" class="mui-table-view-cell mui-indexed-list-item mui-checkbox mui-left">
                      <input type="checkbox" id="checkbox" data-fpm="${item.FNAME_L2}" data-fbm="${item.FNUMBER}" 
                         data-funit="${item.UNIT}" data-fkcl="${item.FQTY}" data-fgg="${item.FMODEL}"/>
                       ${item.FNAME_L2}
                   </li>   
                    `;
            $("#datalist").append(li);
        }
    }).fail((e) => {
        console.log(e);
    }).then(() => {
        prepIndexedList();
    });
}
//索引列表准备前置
function prepIndexedList() {

    var header = document.querySelector('header.mui-bar');
    var list = document.querySelector('#list');
    var done = document.querySelector('#done');
    //计算高度 
    list.style.height = (document.body.offsetHeight - header.offsetHeight) + 'px';
    //create
    window.indexedList = new mui.IndexedList(list);

    done.addEventListener('tap', function () {
        var checkboxArray = [].slice.call(list.querySelectorAll('input[type="checkbox"]'));
        var checkedValues = [];
        var checkedEls = [];  //存放选中元素的数组
        checkboxArray.forEach(function (box) {
            if (box.checked) {
                checkedValues.push(box.parentNode.innerText);

                var checkedEl = {
                    fpm: $(box).data('fpm'),
                    fbm: $(box).data('fbm'),
                    funit: $(box).data('funit'),
                    fkcl: $(box).data('fkcl'),
                    fgg: $(box).data('fgg')
                };
                checkedEls.push(checkedEl);


                //取消选中，防止再次进入列表中会选中某一项
                box.checked = !box.checked;
                

            }
        });
        if (checkedValues.length > 0) {
            for (let i in checkedEls) {
                var li = `

                 `;
            }

            $("#selector").hide();
            $("#wrapper").show();
        } else {

        }


    }, false);

    mui('.mui-indexed-list-inner').on('change', 'input', function () {
        var count = list.querySelectorAll('input[type="checkbox"]:checked').length;
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



function initData(data, flag) {
    var item = data.FormDataSet.BPM_WHWWZCGSQ_A[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.fbillno);
    }
    $("#fdept").val(item.fdept);
    $("#fname").val(item.fname);
    $("#fdate").val(FormatterTimeYMS(item.fdate));
    $("#ftel").val(item.ftel);
    $("#fif_sp").val(item.fif_sp);
    if (item.fif_sp == '是') {
        $("#fif_spd").addClass('mui-active');
    }
    $("#fif_5q").val(item.fif_5q);
    if (item.fif_5q == '是') {
        $("#fif_5qd").addClass('mui-active');
    }
    $("#fhj_cgje").val(item.fhj_cgje);
    $("#fhj_sqje").val(item.fhj_sqje);

    var item_c = data.FormDataSet.BPM_WHWWZCGSQ_B;
    for (var i = 0; i < item_c.length; i++){
        itemidArr.push(item_c[i].itemid);
        var li = `
            <div id="mx" class="mui-card">
              <div class="mui-input-row itemtitle">
                 <label>明细列表项</label>
                 <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>
              </div>
              <div class="mui-input-row">
                  <label for="fpm">品名<i style="color:red;">*</i></label>  
                  <input type="text" id="fpm" name="fpm" readonly value="${item_c[i].fpm}"/>
              </div> 
              <div class="mui-input-row">
                  <label for="fbm">编码</label>
                  <input type="text" id="fbm" name="fbm" readonly value="${item_c[i].fbm}"/>  
              </div>  
              <div class="mui-input-row">
                  <label for="fgg">规格</label>
                  <input type="text" id="fgg" name="fgg" readonly value="${item_c[i].fgg}"/> 
              </div> 
              <div class="mui-input-row">
                  <label for="funit">计量单位</label>
                  <input type="text" id="funit" name="funit" readonly value="${item_c[i].funit}"/>  
              </div> 
              <div class="mui-input-row">
                  <label for="fkcl">库存量</label>
                  <input type="number" id="fkcl" name="fkcl" readonly value="${item_c[i].fkcl}"/>
              </div>
              <div class="mui-input-row">
                  <label for="fsqsl">申请数量<i style="color:red;">*</i></label>
                  <input type="number" id="fsqsl" name="fsqsl" readonly value="${item_c[i].fsqsl}"/> 
              </div>
              <div class="mui-input-row">
                   <label for="fsqdj">申请单价(含税价)<i style="color:red;">*</i></label>
                   <input type="number" id="fsqdj" name="fsqdj" readonly value="${item_c[i].fsqdj}"/>
              </div> 
              <div class="mui-input-row">
                   <label for="fsqyy">申请原因</label>
                   <input type="text" id="fsqyy" name="fsqyy" readonly value="${item_c[i].fsqyy}"/>
              </div>  
              <div class="mui-input-row">
                   <label for="fgys">采购供应商</label> 
                   <input type="text" id="fgys" name="fgys" readonly value="${item_c[i].fgys}"/>
              </div>
              <div class="mui-input-row">
                   <label for="fcgdj">实际采购单价(含税价)<i style="color:red;">*</i></label> 
                   <input type="number" id="fcgdj" name="fcgdj" readonly value="${item_c[i].fcgdj}"/> 
              </div> 
              <div class="mui-input-row">
                   <label for="fcgsl">实际采购数量<i style="color:red;">*</i></label>
                   <input type="number" id="fcgsl" name="fcgsl" readonly value="${item_c[i].fcgsl}"/> 
              </div>
              <div class="mui-input-row">
                   <label for="fcgje">实际采购金额</label>
                   <input type="number" id="fcgje" name="fcgje" readonly value="${item_c[i].fcgje}"/>
              </div>  
              <div class="mui-input-row">
                   <label for="fsqje">申请金额</label> 
                   <input type="number" id="fsqje" name="fsqje" readonly value="${item_c[i].fsqje}"/>   
              </div> 
            </div> 
                 `;
        $("#mxlist").append(li);

    }
}


function nodeControllerExp(NodeName) {

}

function Save() {

}

function reSave() {

}
function hasRead() {

}
function AgreeOrConSign() {

}