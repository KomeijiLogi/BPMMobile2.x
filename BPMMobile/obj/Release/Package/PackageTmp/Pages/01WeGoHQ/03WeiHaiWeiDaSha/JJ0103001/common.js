function prepMsg() {
    $("#fdate").val(getNowFormatDate(2));
    tapEvent();
    var xml = '<?xml version= "1.0" ?>';
    xml = xml + '   <Requests>';
    xml = xml + '   <Params>';
    xml = xml + '       <Method>GetFormPostData</Method>';
    xml = xml + '       <ProcessName>威海卫大厦工程维修申请</ProcessName>';
    xml = xml + '      <ProcessVersion>' + version + '</ProcessVersion>';
    xml = xml + '      <Owner></Owner>';
    xml = xml + '    </Params>';
    xml = xml + '   </Requests>';

    dataProvider(xml, function (data) {
        var provideData = JSON.parse(unescape(data.replace(/\\(u[0-9a-fA-F]{4})/gm, '%$1')));
        console.log(provideData);
        var item = provideData.Tables[0].Rows[0];
        $("#fname").val(item.报修人);
        $("#fdept").val(item.报修部门);
    });

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

    var  fjjcddata = [
        {
            value: '',
            text:'一般'
        },
        {
            value: '',
            text:'紧急'
        }
    ];
    showPicker('fjjcd', fjjcddata);

    
}

//添加子表事件
function tapEventAdd() {
    var flylydata = [

        {
            value: '',
            text:'物流中心库'
        },
        {
            value: '',
            text:'工程库'
        },
        {
            value: '',
            text:'各业务部门'
        }
    ];

    $('#tjmx').on('tap', function () {
        var li = `
            <div id="mx" class="mui-card">
              <div class="mui-input-row itemtitle">
                 <label>明细列表项</label>
                 <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>
              </div>
              <div class="mui-input-row">
                 <label for="fclmc">材料名称<i style="color:red;">*</i></label>
                 <input type="text" id="fclmc" name="fclmc" placeholder="请填写材料名称"/>
              </div>
              <div class="mui-input-row">
                 <label for="fbm">编码</label>
                 <input type="text" id="fbm" name="fbm" placeholder="请填写编码"/>
              </div>
              <div class="mui-input-row">
                  <label for="fggxh">规格型号</label>
                  <input type="text" id="fggxh" name="fggxh" placeholder="请填写规格型号"/>
              </div>      
              <div class="mui-input-row">
                  <label for="fjldw">计量单位</label>
                  <input type="text" id="fjldw" name="fjldw" placeholder="请填写计量单位"/>
              </div>   
              <div class="mui-input-row">
                  <label for="fghsl">更换数量<i style="color:red;">*</i></label>
                  <input type="number" id="fghsl" name="fghsl" placeholder="请填写更换数量"/>
              </div>
              <div class="mui-input-row">
                  <label for="flyly">领用来源<i style="color:red;">*</i></label>
                  <input type="text" id="flyly" name="flyly" readonly placeholder="请选择领用来源"/>   
              </div> 
               <div class="mui-input-row">
                  <label for="fbz">备注</label>
                  <input type="text" id="fbz" name="fbz" placeholder="请填写备注"/> 
               </div> 
            </div>  
        `;
        $("#mxlist").append(li);
        showPickerByZepto('#mxlist', '#flyly', flylydata);
    });

    var fwxztdata = [
        {
            value: '',
            text:'等待配件'
        },
        {
            value: '',
            text: '等待外协'
        },
        {
            value: '',
            text: '等待二次派工'
        },
        {
            value: '',
            text: '维修完成'
        }
    ];
    showPicker('fwxzt', fwxztdata);

    var fgzdldata = [
        {
            value: '',
            text:'水暖'
        },
        {
            value: '',
            text: '强电'
        },
        {
            value: '',
            text: '弱电'
        },
        {
            value: '',
            text: '土建装饰'
        },
        {
            value: '',
            text: '制冷类'
        },
        {
            value: '',
            text: '网络'
        },
        {
            value: '',
            text: '电梯'
        },
        {
            value: '',
            text: '其他'
        }
    ];
    showPicker('fgzdl', fgzdldata);
}
function tapEventEval() {
    var fbmyyydata = [
        {
            value: '',
            text:'服务态度差'
        },
        {
            value: '',
            text:'维修不及时'
        },
        {
            value: '',
            text:'维修效率低'
        },
        {
            value: '',
            text:'维修质量差'
        }
    ];
    showPicker('fbmyyy', fbmyyydata);
}


function initData(data,flag) {
    var item = data.FormDataSet.威海卫大厦报修单_A[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.fbillno);
    }
    $("#fwxdd").val(item.维修地点);
    $("#fname").val(item.报修人);
    $("#fdate").val(FormatterTimeYMS(item.报修时间));
    $("#fdept").val(item.报修部门);
    $("#fjjcd").val(item.紧急程度);
    $("#fbxnr").val(item.报修内容);

    $("#fpdr").val(item.派单人);
    $("#fpdsj").val(FormatterTimeYMS( item.派工时间));
    $("#fjdr").val(item.接单人);
    $("#fjssj").val(FormatterTimeYMS( item.维修结束时间));
    $("#fwxzt").val(item.维修状态);
    $("#fztyyms").val(item.状态原因描述);
    $("#fecpgsj").val(FormatterTimeYMS(item.二次派工时间));
    $("#fgzdl").val(item.故障大类);
    $("#fgzxl").val(item.故障小类);
    $("#fwxgs").val(item.维修工时);
    $("#fqthf").val(item.其他耗费);

    var fwxpj = item.维修评价;
    $(".radio-group").find('input').each(function () {
        if ($(this).parent().find('label').text() == fwxpj) {
            $(this).attr('checked', 'checked');
        }
    });
    var item_c = data.FormDataSet.威海卫大厦报修单_B;
   
    for (var i = 0; i < item_c.length; i++) {
        itemidArr.push(item_c[i].itemid);
        if (item_c[i].fentryno == null) {
            return;
        }
        
        
        var li = `
            <div id="mx" class="mui-card">
              <div class="mui-input-row itemtitle">
                 <label>明细列表项</label>
                 <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>
              </div>
              <div class="mui-input-row">
                 <label for="fclmc">材料名称<i style="color:red;">*</i></label>
                 <input type="text" id="fclmc" name="fclmc" readonly value="  ${changeNullToEmpty(item_c[i].材料名称)} "/>
              </div>
              <div class="mui-input-row">
                 <label for="fbm">编码</label>
                 <input type="text" id="fbm" name="fbm" readonly value="${changeNullToEmpty(item_c[i].编码)}"/>
              </div>
              <div class="mui-input-row">
                  <label for="fggxh">规格型号</label>
                  <input type="text" id="fggxh" name="fggxh" readonly value="${changeNullToEmpty(item_c[i].规格型号)}"/>
              </div>      
              <div class="mui-input-row">
                  <label for="fjldw">计量单位</label>
                  <input type="text" id="fjldw" name="fjldw" readonly value="${changeNullToEmpty(item_c[i].计量单位)}"/>
              </div>   
              <div class="mui-input-row">
                  <label for="fghsl">更换数量<i style="color:red;">*</i></label>
                  <input type="number" id="fghsl" name="fghsl" readonly value="${changeNullToEmpty(item_c[i].更换数量)}"/>
              </div>
              <div class="mui-input-row">
                  <label for="flyly">领用来源<i style="color:red;">*</i></label>
                  <input type="text" id="flyly" name="flyly" readonly value="${changeNullToEmpty(item_c[i].领用来源)}"/>   
              </div> 
               <div class="mui-input-row">
                  <label for="fbz">备注</label>
                  <input type="text" id="fbz" name="fbz" readonly value="${changeNullToEmpty(item_c[i].备注)}"/> 
               </div> 
            </div>  
        `;
        $("#mxlist").append(li);

    }
    
}
function nodeControllerExp(NodeName) {

    if (String(NodeName).match('开始') != null) {
        tapEvent();
        $("#fwxdd,#fdate,#fbxnr").removeAttr('readonly');

    } else if (String(NodeName) == '工程部' || String(NodeName) == '工程部2') {
        $("#fpdsj,#fjdr").removeAttr('readonly');
        //接单人为当前登录用户，接单时间为当前日期
        XuntongJSBridge.call('getPersonInfo', {}, function (result) {
            if (typeof (result) == "string") {
                result = JSON.parse(result);
            }
            console.log(result);
            if (result.success == true || result.success == "true") {
                if (typeof (result.data.name) == "undefined") {

                } else {
                    $("#fpdr").val(result.data.name);
                }
            }

        });

        $("#fpdsj").val(getNowFormatDate(2));
        $("#fjdr").attr('placeholder', '请填写接单人');
    } else if (String(NodeName) == '工程部1' || String(NodeName) == '工程部3') {
        $("#fjssj,#fztyyms,#fecpgsj,#fwxgs,#fqthf").removeAttr('readonly');
        tapEventAdd();
        $('#tjmx').show();
        $("#fwxzt").attr('placeholder', '请选择维修状态');
        $("#fgzdl").attr('placeholder', '请选择故障大类');
        $("#fwxgs").attr('placeholder', '请填写维修工时');
        $("#fqthf").attr('placeholder', '请填写其他耗费');

    } else if (String(NodeName) == '发起人') {
        $("input[type='radio']").removeAttr('disabled');
        tapEventEval();
        $("#fbmyyy").attr('placeholder', '请选择不满意原因');
    }


}
class Mx {
    //构造类
    constructor(fclmc, fbm, fggxh, fjldw, fghsl, flyly, fbz) {
        this.fclmc = fclmc;
        this.fbm = fbm;
        this.fggxh = fggxh;
        this.fjldw = fjldw;
        this.fghsl = fghsl;
        this.flyly = flyly;
        this.fbz = fbz;

    }
    //校验字段
    check() {
        if (!this.fclmc){
            mui.toast('请填写材料名称');
            return false;
        }
        if (!this.fghsl) {
            mui.toast('请填写更换数量');
            return false;
        }
        if (!this.flyly) {
            mui.toast('请选择领用来源');
            return false;
        }
        return true;
    }
}

function Save() {
    var fname = $("#fname").val();
    var fwxdd = $("#fwxdd").val();
    var fdate = $("#fdate").val();
    var fdept = $("#fdept").val();

    var fjjcd = $("#fjjcd").val();
    var fbxnr = $("#fbxnr").val();
    var fpdr = $("#fpdr").val();
    var fpdsj = $("#fpdsj").val();
    var fjdr = $("#fjdr").val();

    var fjssj = $("#fjssj").val();
    var fwxzt = $("#fwxzt").val();
    var fztyyms = $("#fztyyms").val();
    var fecpgsj = $("#fecpgsj").val();
    var fgzdl = $("#fgzdl").val();
    var fgzxl = $("#fgzxl").val();
    var fwxgs = $("#fwxgs").val();
    var fqthf = $("#fqthf").val();
    var fwxpj = $("input[type='radio']:checked").parent().find('label').text();

    var fbmyyy = $("#fbmyyy").val();
    if (!fwxdd) {
        mui.toast('请填写维修地点');
        return;
    }
    if (!fdate) {
        mui.toast('请填写报修时间');
        return;
    }
    if (!fjjcd) {
        mui.toast('请选择紧急程度');
        return;
    }
    if (!fbxnr) {
        mui.toast('请填写报修内容');
        return;
    }




    var mxflag = false;
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fclmc = $(this).find("#fclmc").val();
        var fbm = $(this).find("#fbm").val();
        var fggxh = $(this).find("#fggxh").val();
        var fjldw = $(this).find("#fjldw").val();
        var fghsl = $(this).find("#fghsl").val();
        var flyly = $(this).find("#flyly").val();
        var fbz = $(this).find("#fbz").val();
        var mx = new Mx(fclmc, fbm, fggxh, fjldw, fghsl, flyly, fbz);
        if (!mx.check()) {
            mxflag = true;
            return;
        }
        mxlistArr.push(mx);
    });
    
    var btnArry = ["取消", "确定"];
    mui.confirm('即将提交，是否确定？', '提交确认提醒', btnArry, function (e) {
        if (e.index == 1) {
            var xml = '<?xml version= "1.0" ?>';
            xml = xml + '   <XForm>';
            xml = xml + '         <Header>';
            xml = xml + '        <Method>Post</Method>';
            xml = xml + '       <ProcessName>威海卫大厦工程维修申请</ProcessName>';
            xml = xml + '         <ProcessVersion>' + version + '</ProcessVersion>';
            xml = xml + '            <DraftGuid></DraftGuid>';
            xml = xml + '             <OwnerMemberFullName>' + BPMOU + '</OwnerMemberFullName>';
            xml = xml + '            <Action>提交</Action>';
            xml = xml + '          <Comment></Comment>';
            xml = xml + '             <InviteIndicateUsers></InviteIndicateUsers>';
            xml = xml + '       </Header>';
            xml = xml + '       <FormData>';

            xml = xml + '   <威海卫大厦报修单_A>';
            xml = xml + '   <fbillno>自动带出</fbillno>';
            xml = xml + '   <维修地点>' + fwxdd + '</维修地点>';
            xml = xml + '    <报修人>' + fname + '</报修人>';
            xml = xml + '   <报修时间>' + fdate + '</报修时间>';
            xml = xml + '   <报修内容>' + fbxnr + '</报修内容>';
            xml = xml + '   <报修部门>' + fdept + '</报修部门>';
            xml = xml + '   <紧急程度>' + fjjcd + '</紧急程度>';
            xml = xml + '   <派单人>' + fpdr + '</派单人>';
            xml = xml + '   <派工时间>' + fpdsj + '</派工时间>';
            xml = xml + '   <接单人>' + fjdr + '</接单人>';
            xml = xml + '   <维修结束时间>' + fjssj + '</维修结束时间>';
            xml = xml + '   <维修状态>' + fwxzt + '</维修状态>';
            xml = xml + '   <状态原因描述>' + fztyyms + '</状态原因描述>';
            xml = xml + '   <二次派工时间>' + fecpgsj + '</二次派工时间>';
            xml = xml + '   <故障大类>' + fgzdl + '</故障大类>';
            xml = xml + '   <故障小类>' + fgzxl + '</故障小类>';
            xml = xml + '   <维修工时>' + fwxgs + '</维修工时>';
            xml = xml + '    <其它耗费>' + fqthf + '</其它耗费>';
            xml = xml + '    <维修评价>' + fwxpj + '</维修评价>';
            xml = xml + '     <不满意原因>' + fbmyyy + '</不满意原因>';
            xml = xml + '    </威海卫大厦报修单_A>';
            if (mxlistArr.length != 0) {
                for (var i = 0; i < mxlistArr.length; i++) {
                    xml = xml + '   <威海卫大厦报修单_B>';
                    xml = xml + '    <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                    xml = xml + '   <RowPrimaryKeys></RowPrimaryKeys>';
                    xml = xml + '   <fentryno>' + (i + 1) + '</fentryno>';
                    xml = xml + '   <材料名称>' + mxlistArr[i].fclmc + '</材料名称>';
                    xml = xml + '   <编码>' + mxlistArr[i].fbm + '</编码>';
                    xml = xml + '   <规格型号>' + mxlistArr[i].fggxh + '</规格型号>';
                    xml = xml + '   <计量单位>' + mxlistArr[i].fjldw + '</计量单位>';
                    xml = xml + '    <更换数量>' + mxlistArr[i].fghsl + '</更换数量>';
                    xml = xml + '    <领用来源>' + mxlistArr[i].flyly + '</领用来源>';
                    xml = xml + '    <备注>' + mxlistArr[i].fbz + '</备注>';
                    xml = xml + '  </威海卫大厦报修单_B>';

                }
            } else {
                xml += `  <威海卫大厦报修单_B>
                    <RelationRowGuid>1</RelationRowGuid>
                    <RowPrimaryKeys></RowPrimaryKeys>
                    <fentryno>1</fentryno>
                    <材料名称></材料名称>
                    <编码></编码>
                    <规格型号></规格型号>
                    <计量单位></计量单位>
                    <更换数量></更换数量>
                    <领用来源></领用来源>
                    <备注></备注>
                </威海卫大厦报修单_B>`;
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
    var fwxdd = $("#fwxdd").val();
    var fdate = $("#fdate").val();
    var fdept = $("#fdept").val();

    var fjjcd = $("#fjjcd").val();
    var fbxnr = $("#fbxnr").val();
    var fpdr = $("#fpdr").val();
    var fpdsj = $("#fpdsj").val();
    var fjdr = $("#fjdr").val();

    var fjssj = $("#fjssj").val();
    var fwxzt = $("#fwxzt").val();
    var fztyyms = $("#fztyyms").val();
    var fecpgsj = $("#fecpgsj").val();
    var fgzdl = $("#fgzdl").val();
    var fgzxl = $("#fgzxl").val();
    var fwxgs = $("#fwxgs").val();
    var fqthf = $("#fqthf").val();
    var fwxpj = $("input[type='radio']:checked").parent().find('label').text();
    var fbmyyy = $("#fbmyyy").val();
    if (!fwxdd) {
        mui.toast('请填写维修地点');
        return;
    }
    if (!fdate) {
        mui.toast('请填写报修时间');
        return;
    }
    if (!fbxnr) {
        mui.toast('请填写报修内容');
        return;
    }




    var mxflag = false;
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fclmc = $(this).find("#fclmc").val();
        var fbm = $(this).find("#fbm").val();
        var fggxh = $(this).find("#fggxh").val();
        var fjldw = $(this).find("#fjldw").val();
        var fghsl = $(this).find("#fghsl").val();
        var flyly = $(this).find("#flyly").val();
        var fbz = $(this).find("#fbz").val();
        var mx = new Mx(fclmc, fbm, fggxh, fjldw, fghsl, flyly, fbz);
        if (!mx.check()) {
            mxflag = true;
            return;
        }
        mxlistArr.push(mx);
    });
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

            xml = xml + '   <威海卫大厦报修单_A>';
            xml = xml + '   <fbillno>' + fbillno + '</fbillno>';
            xml = xml + '   <维修地点>' + fwxdd + '</维修地点>';
            xml = xml + '    <报修人>' + fname + '</报修人>';
            xml = xml + '   <报修时间>' + fdate + '</报修时间>';
            xml = xml + '   <报修内容>' + fbxnr + '</报修内容>';
            xml = xml + '   <报修部门>' + fdept + '</报修部门>';
            xml = xml + '   <紧急程度>' + fjjcd + '</紧急程度>';
            xml = xml + '   <派单人>' + fpdr + '</派单人>';
            xml = xml + '   <派工时间>' + fpdsj + '</派工时间>';
            xml = xml + '   <接单人>' + fjdr + '</接单人>';
            xml = xml + '   <维修结束时间>' + fjssj + '</维修结束时间>';
            xml = xml + '   <维修状态>' + fwxzt + '</维修状态>';
            xml = xml + '   <状态原因描述>' + fztyyms + '</状态原因描述>';
            xml = xml + '   <二次派工时间>' + fecpgsj + '</二次派工时间>';
            xml = xml + '   <故障大类>' + fgzdl + '</故障大类>';
            xml = xml + '   <故障小类>' + fgzxl + '</故障小类>';
            xml = xml + '   <维修工时>' + fwxgs + '</维修工时>';
            xml = xml + '    <其它耗费>' + fqthf + '</其它耗费>';
            xml = xml + '    <维修评价>' + fwxpj + '</维修评价>';
            xml = xml + '     <不满意原因>' + fbmyyy + '</不满意原因>';
            xml = xml + '    </威海卫大厦报修单_A>';
            if (mxlistArr.length != 0) {
                for (var i = 0; i < mxlistArr.length; i++) {
                    xml = xml + '   <威海卫大厦报修单_B>';
                    xml = xml + '    <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                    xml = xml + '   <RowPrimaryKeys></RowPrimaryKeys>';
                    xml = xml + '   <fentryno>' + (i + 1) + '</fentryno>';
                    xml = xml + '   <材料名称>' + mxlistArr[i].fclmc + '</材料名称>';
                    xml = xml + '   <编码>' + mxlistArr[i].fbm + '</编码>';
                    xml = xml + '   <规格型号>' + mxlistArr[i].fggxh + '</规格型号>';
                    xml = xml + '   <计量单位>' + mxlistArr[i].fjldw + '</计量单位>';
                    xml = xml + '    <更换数量>' + mxlistArr[i].fghsl + '</更换数量>';
                    xml = xml + '    <领用来源>' + mxlistArr[i].flyly + '</领用来源>';
                    xml = xml + '    <备注>' + mxlistArr[i].fbz + '</备注>';
                    xml = xml + '  </威海卫大厦报修单_B>';

                }
            } else {
                xml += `  <威海卫大厦报修单_B>
                    <RelationRowGuid>1</RelationRowGuid>
                    <RowPrimaryKeys></RowPrimaryKeys>
                    <fentryno>1</fentryno>
                    <材料名称></材料名称>
                    <编码></编码>
                    <规格型号></规格型号>
                    <计量单位></计量单位>
                    <更换数量></更换数量>
                    <领用来源></领用来源>
                    <备注></备注>
                </威海卫大厦报修单_B>`;
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
    var fwxdd = $("#fwxdd").val();
    var fdate = $("#fdate").val();
    var fdept = $("#fdept").val();

    var fjjcd = $("#fjjcd").val();
    var fbxnr = $("#fbxnr").val();
    var fpdr = $("#fpdr").val();
    var fpdsj = $("#fpdsj").val();
    var fjdr = $("#fjdr").val();

    var fjssj = $("#fjssj").val();
    var fwxzt = $("#fwxzt").val();
    var fztyyms = $("#fztyyms").val();
    var fecpgsj = $("#fecpgsj").val();
    var fgzdl = $("#fgzdl").val();
    var fgzxl = $("#fgzxl").val();
    var fwxgs = $("#fwxgs").val();
    var fqthf = $("#fqthf").val();
    var fwxpj = $("input[type='radio']:checked").parent().find('label').text();

    var fbmyyy = $("#fbmyyy").val();


    var mxflag = false;
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fclmc = $(this).find("#fclmc").val();
        var fbm = $(this).find("#fbm").val();
        var fggxh = $(this).find("#fggxh").val();
        var fjldw = $(this).find("#fjldw").val();
        var fghsl = $(this).find("#fghsl").val();
        var flyly = $(this).find("#flyly").val();
        var fbz = $(this).find("#fbz").val();
        var mx = new Mx(fclmc, fbm, fggxh, fjldw, fghsl, flyly, fbz);
        if (!mx.check()) {
            mxflag = true;
            return;
        }
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

            xml = xml + '   <威海卫大厦报修单_A>';
            xml = xml + '   <fbillno>' + fbillno + '</fbillno>';
            xml = xml + '   <维修地点>' + fwxdd + '</维修地点>';
            xml = xml + '    <报修人>' + fname + '</报修人>';
            xml = xml + '   <报修时间>' + fdate + '</报修时间>';
            xml = xml + '   <报修内容>' + fbxnr + '</报修内容>';
            xml = xml + '   <报修部门>' + fdept + '</报修部门>';
            xml = xml + '   <紧急程度>' + fjjcd + '</紧急程度>';
            xml = xml + '   <派单人>' + fpdr + '</派单人>';
            xml = xml + '   <派工时间>' + fpdsj + '</派工时间>';
            xml = xml + '   <接单人>' + fjdr + '</接单人>';
            xml = xml + '   <维修结束时间>' + fjssj + '</维修结束时间>';
            xml = xml + '   <维修状态>' + fwxzt + '</维修状态>';
            xml = xml + '   <状态原因描述>' + fztyyms + '</状态原因描述>';
            xml = xml + '   <二次派工时间>' + fecpgsj + '</二次派工时间>';
            xml = xml + '   <故障大类>' + fgzdl + '</故障大类>';
            xml = xml + '   <故障小类>' + fgzxl + '</故障小类>';
            xml = xml + '   <维修工时>' + fwxgs + '</维修工时>';
            xml = xml + '    <其它耗费>' + fqthf + '</其它耗费>';
            xml = xml + '    <维修评价>' + fwxpj + '</维修评价>';
            xml = xml + '     <不满意原因>' + fbmyyy + '</不满意原因>';
            xml = xml + '    </威海卫大厦报修单_A>';
            if (mxlistArr.length != 0) {
                for (var i = 0; i < mxlistArr.length; i++) {
                    xml = xml + '   <威海卫大厦报修单_B>';
                    xml = xml + '    <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                    xml = xml + '   <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
                    xml = xml + '   <fentryno>' + (i + 1) + '</fentryno>';
                    xml = xml + '   <材料名称>' + mxlistArr[i].fclmc + '</材料名称>';
                    xml = xml + '   <编码>' + mxlistArr[i].fbm + '</编码>';
                    xml = xml + '   <规格型号>' + mxlistArr[i].fggxh + '</规格型号>';
                    xml = xml + '   <计量单位>' + mxlistArr[i].fjldw + '</计量单位>';
                    xml = xml + '    <更换数量>' + mxlistArr[i].fghsl + '</更换数量>';
                    xml = xml + '    <领用来源>' + mxlistArr[i].flyly + '</领用来源>';
                    xml = xml + '    <备注>' + mxlistArr[i].fbz + '</备注>';
                    xml = xml + '  </威海卫大厦报修单_B>';

                }
            } else {
                xml += `  <威海卫大厦报修单_B>
                    <RelationRowGuid>1</RelationRowGuid>
                    <RowPrimaryKeys></RowPrimaryKeys>
                    <fentryno>1</fentryno>
                    <材料名称></材料名称>
                    <编码></编码>
                    <规格型号></规格型号>
                    <计量单位></计量单位>
                    <更换数量></更换数量>
                    <领用来源></领用来源>
                    <备注></备注>
                </威海卫大厦报修单_B>`;
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
    var fwxdd = $("#fwxdd").val();
    var fdate = $("#fdate").val();
    var fdept = $("#fdept").val();

    var fjjcd = $("#fjjcd").val();
    var fbxnr = $("#fbxnr").val();
    var fpdr = $("#fpdr").val();
    var fpdsj = $("#fpdsj").val();
    var fjdr = $("#fjdr").val();

    var fjssj = $("#fjssj").val();
    var fwxzt = $("#fwxzt").val();
    var fztyyms = $("#fztyyms").val();
    var fecpgsj = $("#fecpgsj").val();
    var fgzdl = $("#fgzdl").val();
    var fgzxl = $("#fgzxl").val();
    var fwxgs = $("#fwxgs").val();
    var fqthf = $("#fqthf").val();
    var fwxpj = $("input[type='radio']:checked").parent().find('label').text();
   

    var fbmyyy = $("#fbmyyy").val();


    var mxflag = false;
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fclmc = $(this).find("#fclmc").val();
        var fbm = $(this).find("#fbm").val();
        var fggxh = $(this).find("#fggxh").val();
        var fjldw = $(this).find("#fjldw").val();
        var fghsl = $(this).find("#fghsl").val();
        var flyly = $(this).find("#flyly").val();
        var fbz = $(this).find("#fbz").val();
        var mx = new Mx(fclmc, fbm, fggxh, fjldw, fghsl, flyly, fbz);
        if (!mx.check()) {
            mxflag = true;
            return;
        }
        mxlistArr.push(mx);
    });


    if (String(nodeName) == '工程部1' || String(nodeName) == '工程部3') {
        if (!fjssj) {
            mui.toast('请选择结束时间');
            return;
        }
        if (!fwxzt) {
            mui.toast('请选择维修状态');
            return;
        }
        if (!fgzdl) {
            mui.toast('请选择故障大类');
            return;
        }

        if (mxflag) {
            return;
        }
    } else if (String(nodeName) == '发起人') {
        if (!fwxpj) {
            mui.toast('请选择维修评价');
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
            xml = xml + '   <威海卫大厦报修单_A>';
            xml = xml + '   <fbillno>' + fbillno + '</fbillno>';
            xml = xml + '   <维修地点>' + fwxdd + '</维修地点>';
            xml = xml + '    <报修人>' + fname + '</报修人>';
            xml = xml + '   <报修时间>' + fdate + '</报修时间>';
            xml = xml + '   <报修内容>' + fbxnr + '</报修内容>';
            xml = xml + '   <报修部门>' + fdept + '</报修部门>';
            xml = xml + '   <紧急程度>' + fjjcd + '</紧急程度>';
            xml = xml + '   <派单人>' + fpdr + '</派单人>';
            xml = xml + '   <派工时间>' + fpdsj + '</派工时间>';
            xml = xml + '   <接单人>' + fjdr + '</接单人>';
            xml = xml + '   <维修结束时间>' + fjssj + '</维修结束时间>';
            xml = xml + '   <维修状态>' + fwxzt + '</维修状态>';
            xml = xml + '   <状态原因描述>' + fztyyms + '</状态原因描述>';
            xml = xml + '   <二次派工时间>' + fecpgsj + '</二次派工时间>';
            xml = xml + '   <故障大类>' + fgzdl + '</故障大类>';
            xml = xml + '   <故障小类>' + fgzxl + '</故障小类>';
            xml = xml + '   <维修工时>' + fwxgs + '</维修工时>';
            xml = xml + '    <其它耗费>' + fqthf + '</其它耗费>';
            xml = xml + '    <维修评价>' + fwxpj + '</维修评价>';
            xml = xml + '     <不满意原因>' + fbmyyy + '</不满意原因>';
            xml = xml + '    </威海卫大厦报修单_A>';
            if (mxlistArr.length != 0) {
                for (var i = 0; i < mxlistArr.length; i++) {
                    xml = xml + '   <威海卫大厦报修单_B>';
                    xml = xml + '    <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                    xml = xml + '   <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
                    xml = xml + '   <fentryno>' + (i + 1) + '</fentryno>';
                    xml = xml + '   <材料名称>' + mxlistArr[i].fclmc + '</材料名称>';
                    xml = xml + '   <编码>' + mxlistArr[i].fbm + '</编码>';
                    xml = xml + '   <规格型号>' + mxlistArr[i].fggxh + '</规格型号>';
                    xml = xml + '   <计量单位>' + mxlistArr[i].fjldw + '</计量单位>';
                    xml = xml + '    <更换数量>' + mxlistArr[i].fghsl + '</更换数量>';
                    xml = xml + '    <领用来源>' + mxlistArr[i].flyly + '</领用来源>';
                    xml = xml + '    <备注>' + mxlistArr[i].fbz + '</备注>';
                    xml = xml + '  </威海卫大厦报修单_B>';

                }
            } else {
                xml += `  <威海卫大厦报修单_B>
                    <RelationRowGuid>1</RelationRowGuid>
                    <RowPrimaryKeys></RowPrimaryKeys>
                    <fentryno>1</fentryno>
                    <材料名称></材料名称>
                    <编码></编码>
                    <规格型号></规格型号>
                    <计量单位></计量单位>
                    <更换数量></更换数量>
                    <领用来源></领用来源>
                    <备注></备注>
                </威海卫大厦报修单_B>`;
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

        xml = xml + '   <威海卫大厦报修单_A>';
        xml = xml + '   <fbillno>' + fbillno + '</fbillno>';
        xml = xml + '   <维修地点>' + fwxdd + '</维修地点>';
        xml = xml + '    <报修人>' + fname + '</报修人>';
        xml = xml + '   <报修时间>' + fdate + '</报修时间>';
        xml = xml + '   <报修内容>' + fbxnr + '</报修内容>';
        xml = xml + '   <报修部门>' + fdept + '</报修部门>';
        xml = xml + '   <紧急程度>' + fjjcd + '</紧急程度>';
        xml = xml + '   <派单人>' + fpdr + '</派单人>';
        xml = xml + '   <派工时间>' + fpdsj + '</派工时间>';
        xml = xml + '   <接单人>' + fjdr + '</接单人>';
        xml = xml + '   <维修结束时间>' + fjssj + '</维修结束时间>';
        xml = xml + '   <维修状态>' + fwxzt + '</维修状态>';
        xml = xml + '   <状态原因描述>' + fztyyms + '</状态原因描述>';
        xml = xml + '   <二次派工时间>' + fecpgsj + '</二次派工时间>';
        xml = xml + '   <故障大类>' + fgzdl + '</故障大类>';
        xml = xml + '   <故障小类>' + fgzxl + '</故障小类>';
        xml = xml + '   <维修工时>' + fwxgs + '</维修工时>';
        xml = xml + '    <其它耗费>' + fqthf + '</其它耗费>';
        xml = xml + '    <维修评价>' + fwxpj + '</维修评价>';
        xml = xml + '     <不满意原因>' + fbmyyy + '</不满意原因>';
        xml = xml + '    </威海卫大厦报修单_A>';
        if (mxlistArr.length != 0) {
            for (var i = 0; i < mxlistArr.length; i++) {
                xml = xml + '   <威海卫大厦报修单_B>';
                xml = xml + '    <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml = xml + '   <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
                xml = xml + '   <fentryno>' + (i + 1) + '</fentryno>';
                xml = xml + '   <材料名称>' + mxlistArr[i].fclmc + '</材料名称>';
                xml = xml + '   <编码>' + mxlistArr[i].fbm + '</编码>';
                xml = xml + '   <规格型号>' + mxlistArr[i].fggxh + '</规格型号>';
                xml = xml + '   <计量单位>' + mxlistArr[i].fjldw + '</计量单位>';
                xml = xml + '    <更换数量>' + mxlistArr[i].fghsl + '</更换数量>';
                xml = xml + '    <领用来源>' + mxlistArr[i].flyly + '</领用来源>';
                xml = xml + '    <备注>' + mxlistArr[i].fbz + '</备注>';
                xml = xml + '  </威海卫大厦报修单_B>';

            }
        } else {
            xml += `  <威海卫大厦报修单_B>
                    <RelationRowGuid>1</RelationRowGuid>
                    <RowPrimaryKeys></RowPrimaryKeys>
                    <fentryno>1</fentryno>
                    <材料名称></材料名称>
                    <编码></编码>
                    <规格型号></规格型号>
                    <计量单位></计量单位>
                    <更换数量></更换数量>
                    <领用来源></领用来源>
                    <备注></备注>
                </威海卫大厦报修单_B>`;
        }


        xml = xml + '</FormData>';
        xml = xml + '</XForm>';
        PostXml(xml);
    }
}