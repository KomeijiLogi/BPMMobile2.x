function prepMsg() {
    $("#fdate").val(getNowFormatDate(2));
    tapEvent();
    var xml = `<?xml version= "1.0" ?>
                  <Requests>
                      <Params>
                      <Method>GetFormPostData</Method>
                      <ProcessName>医学检验公司维修配件申请</ProcessName>
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
        $("#fname").val(item.申请人);
        $("#fdept").val(item.申请部门);
        $("#fno").val(item.申请人工号);

    }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
        if (XMLHttpRequest.status == "401") {
            mui.alert('授权过期，请重新打开页面');;
        } else if (XMLHttpRequest.status == "500") {
            mui.alert('服务器内部错误');
        }

        }).then(() => {
            getEquipINfo();
        });
}

function tapEvent() {


    $("#tjmx").on('tap', () => {
        var li = `
                  <div id="mx">
                    <div class="mui-input-row itemtitle">
                        <span class="mui-icon mui-icon-close mui-pull-right" style="margin-left:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;margin-right:3vw;" id="deleteProduct" onclick="deleteItem(this)"></span>
                        <label>维修收费表</label>
                    </div>
                    <div class="mui-row cutOffLine" style="padding:3vw;">
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>品牌<i style="color:red;">*</i></label>
                            <textarea id="fpp" placeholder="请填写" rows="2"></textarea>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>适用机型<i style="color:red;">*</i></label>
                            <textarea id="fsyjx" placeholder="请填写" rows="2"></textarea>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>配件货号</label>
                            <textarea id="fpjhh" placeholder="请填写" rows="2"></textarea>
                        </div>
                    </div>
                    <div class="mui-row cutOffLine" style="padding:3vw;">
                        <div class="mui-col-xs-6" style="display:flex;">
                            <label>时空产品代码</label>
                            <textarea id="fskcpdm" placeholder="请填写" rows="2"></textarea>
                        </div>
                        <div class="mui-col-xs-6" style="display:flex;">
                            <label>品名<i style="color:red;">*</i></label>
                            <textarea id="fpm" placeholder="请填写" rows="2"></textarea>
                        </div>
                    </div>
                    <div class="mui-row cutOffLine" style="padding:3vw;">
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>数量<i style="color:red;">*</i></label>
                            <input type="number" id="fsl" placeholder="请填写" />
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>预估单价<i style="color:red;">*</i></label>
                            <input type="number" id="fygdj" placeholder="请填写" />
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>预估金额</label>
                            <input type="number" id="fygje" readonly />
                        </div>
                    </div>
                </div>
                 `;
        $("#mxlist").append(li);
    });
    var opidArr = [];
    $("#fkhjl").on('tap', ()=> {
        XuntongJSBridge.call('selectPerson', { 'pType': '1' }, function (result) {
            if (String(Object.prototype.toString.call(result)).match('String') != null) {
                result = JSON.parse(result);
            }
            if (result.success == true || result.success == "true") {
                for (var i = 0; i < result.data.persons.length; i++) {
                    opidArr.push(result.data.persons[i].openId);
                }

                var getPerInfo = $.ajax({
                    type: "POST",
                    url: "/api/bpm/PostAccount",
                    data: { "ids": opidArr },
                    beforeSend: function (XHR) {
                        XHR.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem('ticket'));
                    }
                }).done((data) => {
                    console.info(data);
                }).fail((e) => {
                    console.error(e);
                });
                getPerInfo.then((data) => {

                    var xml = `<?xml version= "1.0" ?>
                                 <Requests>
                                 <Params>
                                 <DataSource>PS</DataSource>
                                 <ID>erpcloud_公用_获取个人信息</ID>
                                 <Type>1</Type>
                                 <Method>GetUserDataProcedure</Method>
                                 <ProcedureName>erpcloud_公用_获取个人信息</ProcedureName>
                                 <Filter><fno>${data.data[0].phone}</fno></Filter>
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
                        var pio = provideData.Tables[0].Rows[0];
                        console.info(pio);

                        $("#fkhjl").val(pio.NAME);
                        $("#fkhjl_no").val(pio.EMPLID);

                    }).fail((e) => {
                        console.log(e);
                    });
                })
            }
        });
    });


    $("#fsbwxsq").on('tap', function () {
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


    $("#mxlist").on('input', 'input[type="number"]', function () {
        calcPrice(this);
        
    });
}

function calcPrice(context) {

    var fsl = parseFloat($(context).parent().parent().find("#fsl").val());
    var fygdj = parseFloat($(context).parent().parent().find("#fygdj").val());
    fsl = isNaN(fygdj) ? 0 : fsl;
    fygdj = isNaN(fygdj) ? 0 : fygdj;
    fygje = fsl * fygdj;
    $(context).parent().parent().find("#fygje").val(fygje);
    calcTotal();

}

function calcTotal() {
    var fhj = 0;
    
    $("#mxlist").find("#mx").each(function () {
        var fygje = parseFloat($(this).find("#fygje").val());
        fygje = isNaN(fygje) ? 0 : fygje;
        fhj += fygje;
    });
    console.log('fhj', fhj);
    $("#fhj").val(fhj);
}

function deleteItem(context) {
    var btnArray = ['否', '是'];
    mui.confirm('确认删除？', '', btnArray, function (e) {
        if (e.index == 1) {
            $(context).parent().parent().remove();
            calcTotal();
        }
    });
}
//获取医学检验公司设备申请单
function getEquipINfo() {
    var fno = $("#fno").val();

    var xml = `<?xml version= "1.0" ?>
                   <Requests>
                     <Params>
                          <DataSource>BPM_WEGO2018</DataSource> 
                          <ID>erpcloud_医学校验公司设备维修申请单</ID>
                           <Type>1</Type>
                           <Method>GetUserDataProcedure</Method>
                           <ProcedureName>erpcloud_医学校验公司设备维修申请单</ProcedureName>
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
        })
        .done(function (data) {
            var provideData = JSON.parse(unescape(data.replace(/\\(u[0-9a-fA-F]{4})/gm, '%$1')));
            console.log(provideData);
            var cardArr = provideData.Tables[0].Rows;
            for (var i = 0; i < cardArr.length; i++) {
                var li = `
                         <li data-value="" data-tags="" class="mui-table-view-cell mui-indexed-list-item mui-radio mui-left">
                             <input type="radio" name="checkbox"  data-fdh="${cardArr[i].单号}"
                               data-tid=${cardArr[i].TaskID}
                               data-fsqr="${cardArr[i].申请人}"  data-fsqbm="${cardArr[i].申请部门}"
                               data-fsqrq="${FormatterTime_Y_M_S(cardArr[i].申请日期.year, cardArr[i].申请日期.month, cardArr[i].申请日期.day)}" 
                               data-fsbgcs="${cardArr[i].设备工程师}" 
                              />单号:${cardArr[i].单号}
                              <div class="mui-row">
                                 <div class="mui-col-xs-3" style="border-right:1px dashed #a7a7a7;">
                                    申请人:<br/> ${cardArr[i].申请人}
                                 </div>  
                                  <div class="mui-col-xs-3" style="border-right:1px dashed #a7a7a7;">
                                     ${cardArr[i].申请部门}
                                 </div> 
                                    <div class="mui-col-xs-3" style="border-right:1px dashed #a7a7a7;">
                                     ${FormatterTime_Y_M_S(cardArr[i].申请日期.year, cardArr[i].申请日期.month, cardArr[i].申请日期.day)}
                                 </div>  
                                 <div class="mui-col-xs-3">
                                    设备工程师:<br/>${cardArr[i].设备工程师}
                                 </div>  
                              </div>  
                         </li>
                         `;
                $("#datalist").append(li);
            }
        })
        .fail(function (e) {
            console.log(e);
        }).then(() => {
            prepIndexedList();
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
                    fdh: $(box).data('fdh'),
                    fsqr: $(box).data('fsqr'),
                    fsqbm: $(box).data('fsqbm'),
                    fsqrq: $(box).data('fsqrq'),
                    fsbgcs: $(box).data('fsbgcs'),
                    ftid: $(box).data('tid')
                };
                checkedObjs.push(cobj);
                //console.log(checkedObjs);
                //取消选中，防止再次进入列表中会选中某一项
                box.checked = !box.checked;

            }
        });
        if (checkedValues.length > 0) {

            $("#fsbwxsq").val(checkedObjs[checkedObjs.length - 1].fdh);
            $("#fsbwxsq_taskid").val(checkedObjs[checkedObjs.length - 1].ftid);

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

function initData(data, flag) {
    var item = data.FormDataSet.医学检验公司_维修配件申请_主表[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.fbillno);
    }
    $("#fname").val(item.申请人);
    $("#fno").val(item.申请人工号);
    $("#fdept").val(item.申请部门);
    $("#fdate").val(FormatterTimeYMS(item.申请日期));
    $("#fsbwxsq").val(item.设备维修申请);
    $("#fsbwxsq_taskid").val(item.设备维修申请TaskID);
    $("#fkhmc").val(item.客户名称);
    $("#fks").val(item.科室);
    $("#fkhjl").val(item.客户经理);
    $("#fkhjl_no").val(item.客户经理工号);
    $("#fyt").val(item.用途);
    $("#fhj").val(item.合计);

    var item_c = data.FormDataSet.医学检验公司_维修配件申请_子表1;
    for (var i = 0; i < item_c.length; i++) {
        itemidArr.push(item_c[i].itemid);
        var li = `
                <div id="mx">
                    <div class="mui-input-row itemtitle">
                        <span class="mui-icon mui-icon-close mui-pull-right" style="margin-left:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;margin-right:3vw;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>
                        <label>维修收费表</label>
                    </div>
                    <div class="mui-row cutOffLine" style="padding:3vw;">
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>品牌<i style="color:red;">*</i></label>
                            <textarea id="fpp" readonly rows="2">${item_c[i].品牌}</textarea>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>适用机型<i style="color:red;">*</i></label>
                            <textarea id="fsyjx" readonly rows="2">${item_c[i].适用机型}</textarea>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>配件货号</label>
                            <textarea id="fpjhh" readonly rows="2">${item_c[i].配件货号}</textarea>
                        </div>
                    </div>
                    <div class="mui-row cutOffLine" style="padding:3vw;">
                        <div class="mui-col-xs-6" style="display:flex;">
                            <label>时空产品代码</label>
                            <textarea id="fskcpdm" readonly rows="2">${item_c[i].时空产品代码}</textarea>
                        </div>
                        <div class="mui-col-xs-6" style="display:flex;">
                            <label>品名<i style="color:red;">*</i></label>
                            <textarea id="fpm" readonly rows="2">${item_c[i].品名}</textarea>
                        </div>
                    </div>
                    <div class="mui-row cutOffLine" style="padding:3vw;">
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>数量<i style="color:red;">*</i></label>
                            <input type="number" id="fsl" readonly value="${item_c[i].数量}"/>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>预估单价<i style="color:red;">*</i></label>
                            <input type="number" id="fygdj" readonly value="${item_c[i].预估单价}"/>
                        </div>
                        <div class="mui-col-xs-4" style="display:flex;">
                            <label>预估金额</label>
                            <input type="number" id="fygje" readonly value="${item_c[i].预估金额}"/>
                        </div>
                    </div>
                </div>
                  `;
        $("#mxlist").append(li);
        
    }

}

function nodeControllerExp(NodeName) {
    if (String(NodeName).match('开始') != null) {
        tapEvent();
        $("#mxlist").find('span').each(function () {
            $(this).show();
        });
        $("#mxlist").find('textarea,input').each(function () {
            $(this).removeAttr('readonly');
        });
    }
}
//校验必填项
function checkNes() {
    return true;
}

class Mx {
    constructor(fpp, fsyjx, fpjhh, fskcpdm, fpm, fsl, fygdj, fygje) {
        this.fpp = fpp;
        this.fsyjx = fsyjx;
        this.fpjhh = fpjhh;
        this.fskcpdm = fskcpdm;
        this.fpm = fpm;
        this.fsl = fsl;
        this.fygdj = fygdj;
        this.fygje = fygje;
    }
    check() {
        if (!this.fpp) {
            mui.toast('请填写品牌');
            return true;
        }
        if (!this.fsyjx) {
            mui.toast('请填写适用机型');
            return true;
        }
        if (!this.fpm) {
            mui.toast('请填写品名');
            return true;
        }
        if (!this.fsl) {
            mui.toast('请填写数量');
            return true;
        }
        if (!this.fygdj) {
            mui.toast('请填写预估单价');
            return true;
        }
        return false;
    }
}

function Save() {
    var fname = $("#fname").val();
    var fno = $("#fno").val();
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();
    var fsbwxsq = $("#fsbwxsq").val();
    var fsbwxsq_taskid = $("#fsbwxsq_taskid").val();
    var fkhmc = $("#fkhmc").val();
    var fks = $("#fks").val();
    var fkhjl = $("#fkhjl").val();
    var fkhjl_no = $("#fkhjl_no").val();
    var fyt = $("#fyt").val();
    var fhj = $("#fhj").val();

    if (!fsbwxsq) {
        mui.toast('请选择设备维修申请单');
        return;
    }
    if (!fkhmc) {
        mui.toast('请填写客户名称');
        return;
    }
    if (!fks) {
        mui.toast('请填写科室');
        return;
    }
    if (!fkhjl) {
        mui.toast('请填写客户经理');
        return;
    }
    

    var mxflag = false;
    var mxlistArr = [];
    $("#mxlist").find("#mx").each(function () {
        var fpp = $(this).find("#fpp").val();
        var fsyjx = $(this).find("#fsyjx").val();
        var fpjhh = $(this).find("#fpjhh").val();
        var fskcpdm = $(this).find("#fskcpdm").val();
        var fpm = $(this).find("#fpm").val();
        var fsl = $(this).find("#fsl").val();
        var fygdj = $(this).find("#fygdj").val();
        var fygje = $(this).find("#fygje").val();

        var mx = new Mx(fpp, fsyjx, fpjhh, fskcpdm, fpm, fsl, fygdj, fygje);
        if (mx.check()) {
            mxflag = !mxflag;
            return;
        }
        mxlistArr.push(mx);
    });
    var btnArry = ["取消", "确定"];
    mui.confirm('即将提交，是否确定？', '提交确认提醒', btnArry, function (e) {
        if (e.index == 1) {
            var xml = `<?xml version="1.0"?>
                        <XForm>
                            <Header>
                                <Method>Post</Method>
                                <ProcessName>医学检验公司维修配件申请</ProcessName>
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
                       <医学检验公司_维修配件申请_主表>
                            <单号>自动生成</单号>
                            <申请人>${fname}</申请人>
                            <申请部门>${fdept}</申请部门>
                            <申请日期>${fdate}</申请日期>
                            <设备维修申请>${fsbwxsq}</设备维修申请>
                            <设备维修申请TaskID>${fsbwxsq_taskid}</设备维修申请TaskID>
                            <客户名称>${fkhmc}</客户名称>
                            <科室>${fks}</科室>
                            <客户经理>${fkhjl}</客户经理>
                            <用途>${fyt}</用途>
                            <合计>${fhj}</合计>
                            <TaskID></TaskID>
                            <申请人工号>${fno}</申请人工号>
                            <客户经理工号>${fkhjl_no}</客户经理工号>
                    </医学检验公司_维修配件申请_主表>
                    `;
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `
                       <医学检验公司_维修配件申请_子表1>
                            <RelationRowGuid>${i+1}</RelationRowGuid>
                            <RowPrimaryKeys></RowPrimaryKeys>
                            <序号>${i + 1}</序号>
                            <品牌>${mxlistArr[i].fpp}</品牌>
                            <适用机型>${mxlistArr[i].fsyjx}</适用机型>
                            <配件货号>${mxlistArr[i].fpjhh}</配件货号>
                            <时空产品代码>${mxlistArr[i].fskcpdm}</时空产品代码>
                            <品名>${mxlistArr[i].fpm}</品名>
                            <数量>${mxlistArr[i].fsl}</数量>
                            <预估单价>${mxlistArr[i].fygdj}</预估单价>
                            <预估金额>${mxlistArr[i].fygje}</预估金额>
                        </医学检验公司_维修配件申请_子表1>
                       `;
            }
            xml += `
                       </FormData>
                    </XForm>
                   `;
            console.log(xml);
            PostXml(xml);

        }
    });



}
function reSave() {
    var fbillno = $("#fbillno").val();
    var pid = $("#stepId").val();

    var fname = $("#fname").val();
    var fno = $("#fno").val();
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();
    var fsbwxsq = $("#fsbwxsq").val();
    var fsbwxsq_taskid = $("#fsbwxsq_taskid").val();
    var fkhmc = $("#fkhmc").val();
    var fks = $("#fks").val();
    var fkhjl = $("#fkhjl").val();
    var fkhjl_no = $("#fkhjl_no").val();
    var fyt = $("#fyt").val();
    var fhj = $("#fhj").val();

    if (!fsbwxsq) {
        mui.toast('请选择设备维修申请单');
        return;
    }
    if (!fkhmc) {
        mui.toast('请填写客户名称');
        return;
    }
    if (!fks) {
        mui.toast('请填写科室');
        return;
    }
    if (!fkhjl) {
        mui.toast('请填写客户经理');
        return;
    }


    var mxflag = false;
    var mxlistArr = [];
    $("#mxlist").find("#mx").each(function () {
        var fpp = $(this).find("#fpp").val();
        var fsyjx = $(this).find("#fsyjx").val();
        var fpjhh = $(this).find("#fpjhh").val();
        var fskcpdm = $(this).find("#fskcpdm").val();
        var fpm = $(this).find("#fpm").val();
        var fsl = $(this).find("#fsl").val();
        var fygdj = $(this).find("#fygdj").val();
        var fygje = $(this).find("#fygje").val();

        var mx = new Mx(fpp, fsyjx, fpjhh, fskcpdm, fpm, fsl, fygdj, fygje);
        if (mx.check()) {
            mxflag = !mxflag;
            return;
        }
        mxlistArr.push(mx);
    });
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
                       <医学检验公司_维修配件申请_主表>
                            <单号>${fbillno}</单号>
                            <申请人>${fname}</申请人>
                            <申请部门>${fdept}</申请部门>
                            <申请日期>${fdate}</申请日期>
                            <设备维修申请>${fsbwxsq}</设备维修申请>
                            <设备维修申请TaskID>${fsbwxsq_taskid}</设备维修申请TaskID>
                            <客户名称>${fkhmc}</客户名称>
                            <科室>${fks}</科室>
                            <客户经理>${fkhjl}</客户经理>
                            <用途>${fyt}</用途>
                            <合计>${fhj}</合计>
                            <TaskID>${$("#taskId").val()}</TaskID>
                            <申请人工号>${fno}</申请人工号>
                            <客户经理工号>${fkhjl_no}</客户经理工号>
                    </医学检验公司_维修配件申请_主表>
                    `;
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `
                       <医学检验公司_维修配件申请_子表1>
                            <RelationRowGuid>${i + 1}</RelationRowGuid>
                            <RowPrimaryKeys></RowPrimaryKeys>
                            <序号>${i + 1}</序号>
                            <品牌>${mxlistArr[i].fpp}</品牌>
                            <适用机型>${mxlistArr[i].fsyjx}</适用机型>
                            <配件货号>${mxlistArr[i].fpjhh}</配件货号>
                            <时空产品代码>${mxlistArr[i].fskcpdm}</时空产品代码>
                            <品名>${mxlistArr[i].fpm}</品名>
                            <数量>${mxlistArr[i].fsl}</数量>
                            <预估单价>${mxlistArr[i].fygdj}</预估单价>
                            <预估金额>${mxlistArr[i].fygje}</预估金额>
                        </医学检验公司_维修配件申请_子表1>
                       `;
            }
            xml += `
                       </FormData>
                    </XForm>
                   `;
            console.log(xml);
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
    var fno = $("#fno").val();
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();
    var fsbwxsq = $("#fsbwxsq").val();
    var fsbwxsq_taskid = $("#fsbwxsq_taskid").val();
    var fkhmc = $("#fkhmc").val();
    var fks = $("#fks").val();
    var fkhjl = $("#fkhjl").val();
    var fkhjl_no = $("#fkhjl_no").val();
    var fyt = $("#fyt").val();
    var fhj = $("#fhj").val();

    
    var mxflag = false;
    var mxlistArr = [];
    $("#mxlist").find("#mx").each(function () {
        var fpp = $(this).find("#fpp").val();
        var fsyjx = $(this).find("#fsyjx").val();
        var fpjhh = $(this).find("#fpjhh").val();
        var fskcpdm = $(this).find("#fskcpdm").val();
        var fpm = $(this).find("#fpm").val();
        var fsl = $(this).find("#fsl").val();
        var fygdj = $(this).find("#fygdj").val();
        var fygje = $(this).find("#fygje").val();

        var mx = new Mx(fpp, fsyjx, fpjhh, fskcpdm, fpm, fsl, fygdj, fygje);
     
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
                       <医学检验公司_维修配件申请_主表>
                            <单号>${fbillno}</单号>
                            <申请人>${fname}</申请人>
                            <申请部门>${fdept}</申请部门>
                            <申请日期>${fdate}</申请日期>
                            <设备维修申请>${fsbwxsq}</设备维修申请>
                            <设备维修申请TaskID>${fsbwxsq_taskid}</设备维修申请TaskID>
                            <客户名称>${fkhmc}</客户名称>
                            <科室>${fks}</科室>
                            <客户经理>${fkhjl}</客户经理>
                            <用途>${fyt}</用途>
                            <合计>${fhj}</合计>
                            <TaskID>${$("#taskId").val()}</TaskID>
                            <申请人工号>${fno}</申请人工号>
                            <客户经理工号>${fkhjl_no}</客户经理工号>
                    </医学检验公司_维修配件申请_主表>
                    `;
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `
                       <医学检验公司_维修配件申请_子表1>
                            <RelationRowGuid>${i + 1}</RelationRowGuid>
                            <RowPrimaryKeys>itemid=${itemidArr[i]}</RowPrimaryKeys>
                            <序号>${i + 1}</序号>
                            <品牌>${mxlistArr[i].fpp}</品牌>
                            <适用机型>${mxlistArr[i].fsyjx}</适用机型>
                            <配件货号>${mxlistArr[i].fpjhh}</配件货号>
                            <时空产品代码>${mxlistArr[i].fskcpdm}</时空产品代码>
                            <品名>${mxlistArr[i].fpm}</品名>
                            <数量>${mxlistArr[i].fsl}</数量>
                            <预估单价>${mxlistArr[i].fygdj}</预估单价>
                            <预估金额>${mxlistArr[i].fygje}</预估金额>
                        </医学检验公司_维修配件申请_子表1>
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
                       <医学检验公司_维修配件申请_主表>
                            <单号>${fbillno}</单号>
                            <申请人>${fname}</申请人>
                            <申请部门>${fdept}</申请部门>
                            <申请日期>${fdate}</申请日期>
                            <设备维修申请>${fsbwxsq}</设备维修申请>
                            <设备维修申请TaskID>${fsbwxsq_taskid}</设备维修申请TaskID>
                            <客户名称>${fkhmc}</客户名称>
                            <科室>${fks}</科室>
                            <客户经理>${fkhjl}</客户经理>
                            <用途>${fyt}</用途>
                            <合计>${fhj}</合计>
                            <TaskID>${$("#taskId").val()}</TaskID>
                            <申请人工号>${fno}</申请人工号>
                            <客户经理工号>${fkhjl_no}</客户经理工号>
                    </医学检验公司_维修配件申请_主表>
                    `;
        for (var i = 0; i < mxlistArr.length; i++) {
            xml += `
                       <医学检验公司_维修配件申请_子表1>
                            <RelationRowGuid>${i + 1}</RelationRowGuid>
                            <RowPrimaryKeys>itemid=${itemidArr[i]}</RowPrimaryKeys>
                            <序号>${i + 1}</序号>
                            <品牌>${mxlistArr[i].fpp}</品牌>
                            <适用机型>${mxlistArr[i].fsyjx}</适用机型>
                            <配件货号>${mxlistArr[i].fpjhh}</配件货号>
                            <时空产品代码>${mxlistArr[i].fskcpdm}</时空产品代码>
                            <品名>${mxlistArr[i].fpm}</品名>
                            <数量>${mxlistArr[i].fsl}</数量>
                            <预估单价>${mxlistArr[i].fygdj}</预估单价>
                            <预估金额>${mxlistArr[i].fygje}</预估金额>
                        </医学检验公司_维修配件申请_子表1>
                       `;
        }
        xml += `
                       </FormData>
                    </XForm>
                   `;

        PostXml(xml);
    }
}