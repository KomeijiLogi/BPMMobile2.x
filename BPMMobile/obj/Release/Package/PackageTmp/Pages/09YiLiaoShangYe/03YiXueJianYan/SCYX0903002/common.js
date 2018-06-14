function prepMsg() {
    $("#fdate").val(getNowFormatDate(2));
    tapEvent();
    var xml = `<?xml version= "1.0" ?>
                  <Requests>
                      <Params>
                      <Method>GetFormPostData</Method>
                      <ProcessName>医学检验公司设备维修申请</ProcessName>
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

    });
}

function tapEvent() {
    //选择设备工程师
    var opidArr = [];
    $("#fsbgcs").on('tap',  ()=> {
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
                        $("#fsbgcs").val(pio.NAME);
                        $("#fsbgcs_no").val(pio.EMPLID);

                    }).fail((e) => {
                        
                    });
                });

                
            }
        });
    });

    var fsbhpdata = [
        {
            value: '',
            text:'原装耗品'
        },
        {
            value: '',
            text:'其他品牌'
        }
    ];
    var element = document.getElementById('fsbhp');

    var picker = new mui.PopPicker();

    picker.setData(fsbhpdata);

    element.addEventListener('tap', function () {

        picker.show(function (items) {

            element.value = items[0].text;
            if (String(items[0].text).match('其他品牌') != null) {
                $("#fqtpp").removeAttr('readonly');
            } else {
                $("#fqtpp").attr('readonly', 'readonly');
            }
        });

    }, false);


}

//设备工程师点击事件
function tapEventEng() {
    var dateOptions = {
        "value": "2015-10-10 10:10",
        "beginYear": 2018,
        "endYear": 2023
    }

    $("#fbxsj").on('tap', () => {

        var picker = new mui.DtPicker(dateOptions);
        picker.show(function (rs) {

            $("#fbxsj").val(rs.text);
            picker.dispose();
        });
        
    });

    $("#fddsj").on('tap', () => {

        var picker = new mui.DtPicker(dateOptions);
        picker.show(function (rs) {

            $("#fddsj").val(rs.text);
            picker.dispose();
        });
    });
    $("#fjssj").on('tap', () => {
        var picker = new mui.DtPicker(dateOptions);
        picker.show(function (rs) {

            $("#fjssj").val(rs.text);
            picker.dispose();
        });
    });

    $("#tjmx").on('tap', () => {
        var li = `
                    <div id="mx">
                            <div class="mui-input-row itemtitle">
                                <span class="mui-icon mui-icon-close mui-pull-right" style="margin-left:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;margin-right:3vw;" id="deleteProduct" onclick="deleteItem(this)"></span>
                                <label>维修收费表</label>

                            </div>
                            <div class="mui-row cutOffLine" style="padding:3vw;">
                                <div class="mui-col-xs-6" style="display:flex;">
                                    <label>配件耗材编号<i style="color:red;">*</i></label>
                                    <textarea rows="2" id="fpjhcbh" placeholder="请填写"></textarea>
                                </div>
                                <div class="mui-col-xs-6" style="display:flex;">
                                    <label>配件耗材名称<i style="color:red;">*</i></label>
                                    <textarea rows="2" id="fpjhcmc" placeholder="请填写"></textarea>
                                </div>
                            </div>
                            <div class="mui-row cutOffLine" style="padding:3vw;">
                                <div class="mui-col-xs-6" style="display:flex;">
                                    <label>数量<i style="color:red;">*</i></label>
                                    <input type="number" id="fsl" placeholder="请填写" />
                                </div>
                                <div class="mui-col-xs-6" style="display:flex;">
                                    <label>金额</label>
                                    <input type="number" id="fje" placeholder="请填写" />
                                </div>
                            </div>
                        </div>
                 `;
        $("#mxlist").append(li);
    });
    $("#mxlist").on('input', "input[type='number']", function () {
        calcTotalPJ();
        calcTotalHJ();
    });
    $("#fclf,#frgf").on('input', () => {
        calcTotalWX();
        calcTotalHJ();
    });
    
}

//管理员点击事件
function tapEventPer() {
    var fpjdata = [
        {
            value: '',
            text:'A很满意'
        },
        {
            value: '',
            text:'B满意'
        },
        {
            value: '',
            text:"C一般"
        },
        {
            value: '',
            text:'D不满意'
        },
        {
            value: '',
            text:'E很不满意'
        }
    ];

    showPicker('ffwtd', fpjdata);
    showPicker('fgzxl', fpjdata);

}

//计算配件耗材合计
function calcTotalPJ() {
    var fpjhchj = 0;
    $("#mxlist").find("#fje").each(function () {
        var fje = parseFloat($(this).val());
        fje = isNaN(fje) ? 0 : fje;
        fpjhchj += fje;
    });
    $("#fpjhchj").val(fpjhchj);

}
//计算维修费合计
function calcTotalWX() {
    var fwxfhj = 0;
    var fclf = parseFloat($("#fclf").val());
    var frgf = parseFloat($("#frgf").val());
    fclf = isNaN(fclf) ? 0 : fclf;
    frgf = isNaN(frgf) ? 0 : frgf;
    fwxfhj = fclf + frgf;
    $("#fwxfhj").val(fwxfhj);
}

//计算费用合计
function calcTotalHJ() {
    var ffyhj = 0;
    var fpjhchj = parseFloat( $("#fpjhchj").val());
    var fwxfhj = parseFloat( $("#fwxfhj").val());
    fpjhchj = isNaN(fpjhchj) ? 0 : fpjhchj;
    fwxfhj = isNaN(fwxfhj) ? 0 : fwxfhj;

    ffyhj = (fpjhchj) + (fwxfhj);
    $("#ffyhj").val(ffyhj);
}

function deleteItem(context) {
    var btnArray = ['否', '是'];
    mui.confirm('确认删除？', '', btnArray, function (e) {
        if (e.index == 1) {
            $(context).parent().parent().remove();
            calcTotalPJ();
            calcTotalHJ();
        }
    });
}


function initData(data,flag) {

    var item = data.FormDataSet.医学检验公司_设备维修申请_主表[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.fbillno);
    }

    $("#fname").val(item.申请人);
    $("#fno").val(item.申请人工号);
    $("#fdept").val(item.申请部门);
    $("#fdate").val(FormatterTimeYMS(item.申请日期));
    $("#fsbgcs").val(item.设备工程师);
    $("#fsbgcs_no").val(item.设备工程师工号);
    $("#fkhmc").val(item.客户名称);
    $("#fkhbmmc").val(item.客户部门名称);
    $("#ffzr").val(item.负责人);
    $("#flxdh").val(item.联系电话);
    $("#fdz").val(item.地址);
    $("#fsbbh").val(item.设备编号);
    $("#fsbmc").val(item.设备名称);
    $("#fggxh").val(item.规格型号);
    $("#fzczh").val(item.注册证号);
    $("#frjbb").val(item.软件版本);
    $("#fsbcd").val(item.设备产地);
    $("#fsbhp").val(item.设备耗品);
    $("#fqtpp").val(item.其他品牌);
    $("#fbbl").val(item.标本量);
    $("#fkhbxwt").val(item.客户报修问题);
    $("#fystsxx").val(item.原始提示信息);
    $("#fsjgzxx").val(item.实际故障现象);
    $("#fjsclxq").val(item.技术处理详情);
    $("#fwxjg").val(item.维修结果);
    $("#fylwt").val(item.遗留问题);
    $("#fbxsj").val(item.报修时间);
    $("#fddsj").val(item.到达时间);
    $("#fjssj").val(item.结束时间);
    $("#ffwnr").val(item.服务内容);
    $("#fgzhs").val(item.工作耗时);
    $("#fpjhchj").val(item.配件耗材合计);
    $("#fclf").val(item.差旅费);
    $("#frgf").val(item.人工费);
    $("#fwxfhj").val(item.维修费合计);
    $("#ffyhj").val(item.费用合计);
    $("#ffwtd").val(item.服务态度);
    $("#fgzxl").val(item.工作效率);
    $("#fyhyj").val(item.用户意见);


    var item_c = data.FormDataSet.医学检验公司_设备维修申请_子表1;
    for (var i = 0; i < item_c.length; i++) {
        if (item_c.length <= 0) {
            return;
        }
      
        itemidArr.push(item_c[i].itemid);
        var li = `
                    <div id="mx">
                            <div class="mui-input-row itemtitle">
                                <span class="mui-icon mui-icon-close mui-pull-right" style="margin-left:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;margin-right:3vw;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>
                                <label>维修收费表</label>

                            </div>
                            <div class="mui-row cutOffLine" style="padding:3vw;">
                                <div class="mui-col-xs-6" style="display:flex;">
                                    <label>配件耗材编号<i style="color:red;">*</i></label>
                                    <textarea rows="2" id="fpjhcbh" readonly>${item_c[i].配件耗材编号}</textarea>
                                </div>
                                <div class="mui-col-xs-6" style="display:flex;">
                                    <label>配件耗材名称<i style="color:red;">*</i></label>
                                    <textarea rows="2" id="fpjhcmc" readonly>${item_c[i].配件耗材名称}</textarea>
                                </div>
                            </div>
                            <div class="mui-row cutOffLine" style="padding:3vw;">
                                <div class="mui-col-xs-6" style="display:flex;">
                                    <label>数量<i style="color:red;">*</i></label>
                                    <input type="number" id="fsl" readonly value="${item_c[i].数量}"/>
                                </div>
                                <div class="mui-col-xs-6" style="display:flex;">
                                    <label>金额<i style="color:red;">*</i></label>
                                    <input type="number" id="fje" readonly value="${item_c[i].金额}"/>
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
        $("#item1").find('input,textarea').each(function () {
            if (String($(this).attr('id')).match('fsbgcs') != null || String($(this).attr('id')).match('fsbhp') != null) {
                $(this).attr('readonly', 'readonly');
            } else {
                $(this).removeAttr('readonly');
            }
        });
    } else if (String(NodeName).match('设备工程师') != null) {
        tapEventEng();
        $("#item2").find("input,textarea").each(function () {
            var id = $(this).attr(id);
            $(this).attr('placeholder', '请填写');
            if (String(id).match('#fbxsj') != null || String(id).match('#fddsj') != null || String(id).match('#fjssj') != null) {

            } else {
                $(this).removeAttr('readonly');
            }
        });
        $("#tjmx").show();
        $("#mxlist").find("input,textarea").each(function () {
            $(this).attr('placeholder', '请填写');
            $(this).removeAttr('readonly');
        });
        $("#fclf,#frgf").removeAttr('readonly');
    } else if (String(NodeName).match('管理员') != null) {
        tapEventPer();
        $(this).attr('placeholder', '请填写');
        $("#fyhyj").removeAttr('readonly');
    }
}

//校验必填项
function checkNes() {

    var NodeName = $("#nodeName").val();
    if (String(NodeName).match('设备工程师') != null) {
        if (!($("#fkhbxwt").val())) {
            mui.toast('请填写客户报修问题');         
            return false;
        }
        if (!($("#fystsxx").val())) {
            mui.toast('请填写原始提示信息');
            return false;
        }
        if (!($("#fsjgzxx").val())) {
            mui.toast('请填写实际故障现象');
            return false;
        }
        if (!($("#fjsclxq").val())) {
            mui.toast('请填写技术处理详情');
            return false;
        }
        if (!($("#fwxjg").val())) {
            mui.toast('请填写维修结果');
            return false;
        }
        if (!($("#fylwt").val())) {
            mui.toast('请填写遗留问题');
            return false;
        }
        if (!($("#fbxsj").val())) {
            mui.toast('请填写报修时间');
            return false;
        }
        if (!($("#fddsj").val())) {
            mui.toast('请填写到达时间');
            return false;
        }
        if (!($("#fjssj").val())) {
            mui.toast('请填写结束时间');
            return false;
        }
        if (!($("#ffwnr").val())) {
            mui.toast('请填写服务内容');
            return false;
        }
        if (!($("#fgzhs").val())) {
            mui.toast('请填写工作耗时');
            return false;
        }
        if (!($("#fclf").val())) {
            mui.toast('请填写差旅费');
            return false;
        }
        if (!($("#frgf").val())) {
            mui.toast('请填写人工费');
            return false;
        }

    } else if (String(NodeName).match('管理员') != null) {
        if (!($("#ffwtd").val())) {
            mui.toast('请填写服务态度');
            return false;
        }
        if (!($("#fgzxl").val())) {
            mui.toast('请填写工作效率');
            return false;
        }
        if (!($("#fyhyj").val())) {
            mui.toast('请填写用户意见');
            return false;
        }
    }

    return true;
}


class Mx {
    constructor(fpjhcbh, fpjhcmc, fsl, fje) {
        this.fpjhcbh = fpjhcbh;
        this.fpjhcmc = fpjhcmc;
        this.fsl = fsl;
        this.fje = fje;

    }
    check() {
        if (!this.fpjhcbh) {
            mui.toast('请填写配件耗材编号');
            return false;
        }
        if (!this.fpjhcmc) {
            mui.toast('请填写配件耗材名称');
            return false;
        }
        if (!this.fsl) {
            mui.toast('请填写数量');
            return false;
        }
        if (!this.fje) {
            mui.toast('请填写金额');
            return false;
        }
        return true;
    }
}

function Save() {



    //利用map对象生成映射
    var mapOne = new Map();
    $("#wrapper").find("input,textarea").each(function () {
        var id = $(this).attr('id');   //获取id作为key
        var value = $(this).val();     //获取value
        mapOne.set(id, value);
    });
    console.log(mapOne);
    //校验主表必填项
    var verrify_flag = false;
    $("#item1").find('input,textarea').each(function () {
        var value = $(this).val();
        var labelText = String($(this).parent().find('label').text()).replace("*","");
        var id = $(this).attr('id');
        if (String(id).match('fqtpp') != null) {
            return;
        }

        if (!value) {
           
            mui.toast('请填写' + labelText);
            verrify_flag = true;
            return false;
        }
    });

    if (String($("#fsbhp").val()).match('其他') != null && (!$("#fqtpp").val())) {
        return;
    }
    if (verrify_flag) {
        return;
    }

    var btnArry = ["取消", "确定"];
    mui.confirm('即将提交，是否确定？', '提交确认提醒', btnArry, function (e) {
        if (e.index == 1) {
            var xml = `<?xml version="1.0"?>
                        <XForm>
                            <Header>
                                <Method>Post</Method>
                                <ProcessName>医学检验公司设备维修申请</ProcessName>
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
                     <医学检验公司_设备维修申请_主表>
                        <单号>自动生成</单号>
                        <申请人>${mapOne.get('fname')}</申请人>
                        <申请部门>${mapOne.get('fdept')}</申请部门>
                        <申请日期>${mapOne.get('fdate')}</申请日期>
                        <设备工程师>${mapOne.get('fsbgcs')}</设备工程师>
                        <客户名称>${mapOne.get('fsbgcs')}</客户名称>
                        <客户部门名称>${mapOne.get('fkhbmmc')}</客户部门名称>
                        <负责人>${mapOne.get('ffzr')}</负责人>
                        <联系电话>${mapOne.get('flxdh')}</联系电话>
                        <地址>${mapOne.get('fdz')}</地址>
                        <设备编号>${mapOne.get('fsbbh')}</设备编号>
                        <设备名称>${mapOne.get('fsbmc')}</设备名称>
                        <规格型号>${mapOne.get('fggxh')}</规格型号>
                        <注册证号>${mapOne.get('fzczh')}</注册证号>
                        <软件版本>${mapOne.get('frjbb')}</软件版本>
                        <设备产地>${mapOne.get('fsbcd')}</设备产地>
                        <设备耗品>${mapOne.get('fsbhp')}</设备耗品>
                        <其他品牌>${mapOne.get('fqtpp')}</其他品牌>
                        <标本量>${mapOne.get('fbbl')}</标本量>
                        <客户报修问题>${mapOne.get('fkhbxwt')}</客户报修问题>
                        <原始提示信息>${mapOne.get('fystsxx')}</原始提示信息>
                        <实际故障现象>${mapOne.get('fsjgzxx')}</实际故障现象>
                        <技术处理详情>${mapOne.get('fjsclxq')}</技术处理详情>
                        <维修结果>${mapOne.get('fwxjg')}</维修结果>
                        <遗留问题>${mapOne.get('fylwt')}</遗留问题>
                        <报修时间>${mapOne.get('fbxsj')}</报修时间>
                        <到达时间>${mapOne.get('fddsj')}</到达时间>
                        <结束时间>${mapOne.get('fjssj')}</结束时间>
                        <服务内容>${mapOne.get('ffwnr')}</服务内容>
                        <工作耗时>${mapOne.get('fgzhs')}</工作耗时>
                        <配件耗材合计>${mapOne.get('fpjhchj')}</配件耗材合计>
                        <差旅费>${mapOne.get('fclf')}</差旅费>
                        <人工费>${mapOne.get('frgf')}</人工费>
                        <维修费合计>${mapOne.get('fwxfhj')}</维修费合计>
                        <费用合计>${mapOne.get('ffyhj')}</费用合计>
                        <服务态度>${mapOne.get('ffwtd')}</服务态度>
                        <工作效率>${mapOne.get('fgzxl')}</工作效率>
                        <用户意见>${mapOne.get('fyhyj')}</用户意见>
                        <TaskID></TaskID>
                        <申请人工号>${mapOne.get('fno')}</申请人工号>
                        <设备工程师工号>${mapOne.get('fsbgcs_no')}</设备工程师工号>
                    </医学检验公司_设备维修申请_主表>

                   `;
            xml += `
                     <医学检验公司_设备维修申请_子表1>
                     </医学检验公司_设备维修申请_子表1>    
                   `;
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

    //利用map对象生成映射
    var mapOne = new Map();
    $("#wrapper").find("input,textarea").each(function () {
        var id = $(this).attr('id');   //获取id作为key
        var value = $(this).val();     //获取value
        mapOne.set(id, value);
    });
    console.log(mapOne);
    
    var mxlistArr = [];
    var mxflag = false;
    $("#mxlist").find("#mx").each(function () {
        var fpjhcbh = $(this).find("#fpjhcbh").val();
        var fpjhcmc = $(this).find("#fpjhcmc").val();
        var fsl = $(this).find("#fsl").val();
        var fje = $(this).find("#fje").val();

        var mx = new Mx(fpjhcbh, fpjhcmc, fsl, fje);
        if (mx.check()) {
            mxflag = !mxflag;
            return;
        }
        mxlistArr.push(mx);
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
                     <医学检验公司_设备维修申请_主表>
                        <单号>${mapOne.get('fbillno')}</单号>
                        <申请人>${mapOne.get('fname')}</申请人>
                        <申请部门>${mapOne.get('fdept')}</申请部门>
                        <申请日期>${mapOne.get('fdate')}</申请日期>
                        <设备工程师>${mapOne.get('fsbgcs')}</设备工程师>
                        <客户名称>${mapOne.get('fsbgcs')}</客户名称>
                        <客户部门名称>${mapOne.get('fkhbmmc')}</客户部门名称>
                        <负责人>${mapOne.get('ffzr')}</负责人>
                        <联系电话>${mapOne.get('flxdh')}</联系电话>
                        <地址>${mapOne.get('fdz')}</地址>
                        <设备编号>${mapOne.get('fsbbh')}</设备编号>
                        <设备名称>${mapOne.get('fsbmc')}</设备名称>
                        <规格型号>${mapOne.get('fggxh')}</规格型号>
                        <注册证号>${mapOne.get('fzczh')}</注册证号>
                        <软件版本>${mapOne.get('frjbb')}</软件版本>
                        <设备产地>${mapOne.get('fsbcd')}</设备产地>
                        <设备耗品>${mapOne.get('fsbhp')}</设备耗品>
                        <其他品牌>${mapOne.get('fqtpp')}</其他品牌>
                        <标本量>${mapOne.get('fbbl')}</标本量>
                        <客户报修问题>${mapOne.get('fkhbxwt')}</客户报修问题>
                        <原始提示信息>${mapOne.get('fystsxx')}</原始提示信息>
                        <实际故障现象>${mapOne.get('fsjgzxx')}</实际故障现象>
                        <技术处理详情>${mapOne.get('fjsclxq')}</技术处理详情>
                        <维修结果>${mapOne.get('fwxjg')}</维修结果>
                        <遗留问题>${mapOne.get('fylwt')}</遗留问题>
                        <报修时间>${mapOne.get('fbxsj')}</报修时间>
                        <到达时间>${mapOne.get('fddsj')}</到达时间>
                        <结束时间>${mapOne.get('fjssj')}</结束时间>
                        <服务内容>${mapOne.get('ffwnr')}</服务内容>
                        <工作耗时>${mapOne.get('fgzhs')}</工作耗时>
                        <配件耗材合计>${mapOne.get('fpjhchj')}</配件耗材合计>
                        <差旅费>${mapOne.get('fclf')}</差旅费>
                        <人工费>${mapOne.get('frgf')}</人工费>
                        <维修费合计>${mapOne.get('fwxfhj')}</维修费合计>
                        <费用合计>${mapOne.get('ffyhj')}</费用合计>
                        <服务态度>${mapOne.get('ffwtd')}</服务态度>
                        <工作效率>${mapOne.get('fgzxl')}</工作效率>
                        <用户意见>${mapOne.get('fyhyj')}</用户意见>
                        <TaskID>${$("#taskId").val()}</TaskID>
                        <申请人工号>${mapOne.get('fno')}</申请人工号>
                        <设备工程师工号>${mapOne.get('fsbgcs_no')}</设备工程师工号>
                    </医学检验公司_设备维修申请_主表>

                   `;
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `
                         <医学检验公司_设备维修申请_子表1>
                            <RelationRowGuid>${i + 1}</RelationRowGuid>`;
                if (itemidArr.length == 0) {
                    xml += `             <RowPrimaryKeys></RowPrimaryKeys>`;
                } else {
                    xml += `             <RowPrimaryKeys>itemid=${itemidArr[i]}</RowPrimaryKeys>`;
                }


                xml += `                     <序号>${i + 1}</序号>
                            <配件耗材编号>${mxlistArr[i].fpjhcbh}</配件耗材编号>
                            <配件耗材名称>${mxlistArr[i].fpjhcmc}</配件耗材名称>
                            <数量>${mxlistArr[i].fsl}</数量>
                            <金额>${mxlistArr[i].fje}</金额>
                        </医学检验公司_设备维修申请_子表1>
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
    if (String(nodeName).match('设备工程师') != null) {
        action = '提交';
    } else if (String(nodeName).match('业务管理员') != null) {
        action = '完成';
    } 


    //利用map对象生成映射
    var mapOne = new Map();
    $("#wrapper").find("input,textarea").each(function () {
        var id = $(this).attr('id');   //获取id作为key
        var value = $(this).val();     //获取value
        mapOne.set(id, value);
    });
    console.log(mapOne);

    var mxlistArr = [];
    var mxflag = false;
    $("#mxlist").find("#mx").each(function () {
        var fpjhcbh = $(this).find("#fpjhcbh").val();
        var fpjhcmc = $(this).find("#fpjhcmc").val();
        var fsl = $(this).find("#fsl").val();
        var fje = $(this).find("#fje").val();

        var mx = new Mx(fpjhcbh, fpjhcmc, fsl, fje);
      
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
                     <Action>${action}</Action>
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
                     <医学检验公司_设备维修申请_主表>
                        <单号>${fbillno}</单号>
                        <申请人>${mapOne.get('fname')}</申请人>
                        <申请部门>${mapOne.get('fdept')}</申请部门>
                        <申请日期>${mapOne.get('fdate')}</申请日期>
                        <设备工程师>${mapOne.get('fsbgcs')}</设备工程师>
                        <客户名称>${mapOne.get('fsbgcs')}</客户名称>
                        <客户部门名称>${mapOne.get('fkhbmmc')}</客户部门名称>
                        <负责人>${mapOne.get('ffzr')}</负责人>
                        <联系电话>${mapOne.get('flxdh')}</联系电话>
                        <地址>${mapOne.get('fdz')}</地址>
                        <设备编号>${mapOne.get('fsbbh')}</设备编号>
                        <设备名称>${mapOne.get('fsbmc')}</设备名称>
                        <规格型号>${mapOne.get('fggxh')}</规格型号>
                        <注册证号>${mapOne.get('fzczh')}</注册证号>
                        <软件版本>${mapOne.get('frjbb')}</软件版本>
                        <设备产地>${mapOne.get('fsbcd')}</设备产地>
                        <设备耗品>${mapOne.get('fsbhp')}</设备耗品>
                        <其他品牌>${mapOne.get('fqtpp')}</其他品牌>
                        <标本量>${mapOne.get('fbbl')}</标本量>
                        <客户报修问题>${mapOne.get('fkhbxwt')}</客户报修问题>
                        <原始提示信息>${mapOne.get('fystsxx')}</原始提示信息>
                        <实际故障现象>${mapOne.get('fsjgzxx')}</实际故障现象>
                        <技术处理详情>${mapOne.get('fjsclxq')}</技术处理详情>
                        <维修结果>${mapOne.get('fwxjg')}</维修结果>
                        <遗留问题>${mapOne.get('fylwt')}</遗留问题>
                        <报修时间>${mapOne.get('fbxsj')}</报修时间>
                        <到达时间>${mapOne.get('fddsj')}</到达时间>
                        <结束时间>${mapOne.get('fjssj')}</结束时间>
                        <服务内容>${mapOne.get('ffwnr')}</服务内容>
                        <工作耗时>${mapOne.get('fgzhs')}</工作耗时>
                        <配件耗材合计>${mapOne.get('fpjhchj')}</配件耗材合计>
                        <差旅费>${mapOne.get('fclf')}</差旅费>
                        <人工费>${mapOne.get('frgf')}</人工费>
                        <维修费合计>${mapOne.get('fwxfhj')}</维修费合计>
                        <费用合计>${mapOne.get('ffyhj')}</费用合计>
                        <服务态度>${mapOne.get('ffwtd')}</服务态度>
                        <工作效率>${mapOne.get('fgzxl')}</工作效率>
                        <用户意见>${mapOne.get('fyhyj')}</用户意见>
                        <TaskID>${$("#taskId").val()}</TaskID>
                        <申请人工号>${mapOne.get('fno')}</申请人工号>
                        <设备工程师工号>${mapOne.get('fsbgcs_no')}</设备工程师工号>
                    </医学检验公司_设备维修申请_主表>

                   `;
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `
                         <医学检验公司_设备维修申请_子表1>
                            <RelationRowGuid>${i + 1}</RelationRowGuid>`;
                if (itemidArr.length == 0) {
                    xml += `             <RowPrimaryKeys></RowPrimaryKeys>`;
                } else {
                    xml += `             <RowPrimaryKeys>itemid=${itemidArr[i]}</RowPrimaryKeys>`;
                }


                xml += `                     <序号>${i + 1}</序号>
                            <配件耗材编号>${mxlistArr[i].fpjhcbh}</配件耗材编号>
                            <配件耗材名称>${mxlistArr[i].fpjhcmc}</配件耗材名称>
                            <数量>${mxlistArr[i].fsl}</数量>
                            <金额>${mxlistArr[i].fje}</金额>
                        </医学检验公司_设备维修申请_子表1>
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
                   <Action>${action}</Action>
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
                     <医学检验公司_设备维修申请_主表>
                        <单号>${fbillno}</单号>
                        <申请人>${mapOne.get('fname')}</申请人>
                        <申请部门>${mapOne.get('fdept')}</申请部门>
                        <申请日期>${mapOne.get('fdate')}</申请日期>
                        <设备工程师>${mapOne.get('fsbgcs')}</设备工程师>
                        <客户名称>${mapOne.get('fsbgcs')}</客户名称>
                        <客户部门名称>${mapOne.get('fkhbmmc')}</客户部门名称>
                        <负责人>${mapOne.get('ffzr')}</负责人>
                        <联系电话>${mapOne.get('flxdh')}</联系电话>
                        <地址>${mapOne.get('fdz')}</地址>
                        <设备编号>${mapOne.get('fsbbh')}</设备编号>
                        <设备名称>${mapOne.get('fsbmc')}</设备名称>
                        <规格型号>${mapOne.get('fggxh')}</规格型号>
                        <注册证号>${mapOne.get('fzczh')}</注册证号>
                        <软件版本>${mapOne.get('frjbb')}</软件版本>
                        <设备产地>${mapOne.get('fsbcd')}</设备产地>
                        <设备耗品>${mapOne.get('fsbhp')}</设备耗品>
                        <其他品牌>${mapOne.get('fqtpp')}</其他品牌>
                        <标本量>${mapOne.get('fbbl')}</标本量>
                        <客户报修问题>${mapOne.get('fkhbxwt')}</客户报修问题>
                        <原始提示信息>${mapOne.get('fystsxx')}</原始提示信息>
                        <实际故障现象>${mapOne.get('fsjgzxx')}</实际故障现象>
                        <技术处理详情>${mapOne.get('fjsclxq')}</技术处理详情>
                        <维修结果>${mapOne.get('fwxjg')}</维修结果>
                        <遗留问题>${mapOne.get('fylwt')}</遗留问题>
                        <报修时间>${mapOne.get('fbxsj')}</报修时间>
                        <到达时间>${mapOne.get('fddsj')}</到达时间>
                        <结束时间>${mapOne.get('fjssj')}</结束时间>
                        <服务内容>${mapOne.get('ffwnr')}</服务内容>
                        <工作耗时>${mapOne.get('fgzhs')}</工作耗时>
                        <配件耗材合计>${mapOne.get('fpjhchj')}</配件耗材合计>
                        <差旅费>${mapOne.get('fclf')}</差旅费>
                        <人工费>${mapOne.get('frgf')}</人工费>
                        <维修费合计>${mapOne.get('fwxfhj')}</维修费合计>
                        <费用合计>${mapOne.get('ffyhj')}</费用合计>
                        <服务态度>${mapOne.get('ffwtd')}</服务态度>
                        <工作效率>${mapOne.get('fgzxl')}</工作效率>
                        <用户意见>${mapOne.get('fyhyj')}</用户意见>
                        <TaskID>${$("#taskId").val()}</TaskID>
                        <申请人工号>${mapOne.get('fno')}</申请人工号>
                        <设备工程师工号>${mapOne.get('fsbgcs_no')}</设备工程师工号>
                    </医学检验公司_设备维修申请_主表>

                   `;
        for (var i = 0; i < mxlistArr.length; i++) {
            xml += `
                         <医学检验公司_设备维修申请_子表1>
                            <RelationRowGuid>${i + 1}</RelationRowGuid>`;
            if (itemidArr.length == 0) {
                xml += `             <RowPrimaryKeys></RowPrimaryKeys>`;
            } else {
                xml += `             <RowPrimaryKeys>itemid=${itemidArr[i]}</RowPrimaryKeys>`;
            }
           

            xml += `                     <序号>${i + 1}</序号>
                            <配件耗材编号>${mxlistArr[i].fpjhcbh}</配件耗材编号>
                            <配件耗材名称>${mxlistArr[i].fpjhcmc}</配件耗材名称>
                            <数量>${mxlistArr[i].fsl}</数量>
                            <金额>${mxlistArr[i].fje}</金额>
                        </医学检验公司_设备维修申请_子表1>
                       `;
        }

        xml += `
                       </FormData>
                    </XForm>
                   `;
        PostXml(xml);
    }
}
