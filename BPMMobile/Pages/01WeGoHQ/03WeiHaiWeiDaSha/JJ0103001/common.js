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
    $("input[name='fwxpj']").each(function () {
        if (String($(this).parent().find('label').text()) == fwxpj) {
            $(this).attr('checked', 'checked');
        }
    });

    var item_c = data.FormDataSet.威海卫大厦报修单_B;
    for (var i = 0; i < item_c.length; i++) {
        itemidArr.push(item_c[i].itemid);
        var li = `
            <div id="mx" class="mui-card">
              <div class="mui-input-row itemtitle">
                 <label>明细列表项</label>
                 <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>
              </div>
              <div class="mui-input-row">
                 <label for="fclmc">材料名称<i style="color:red;">*</i></label>
                 <input type="text" id="fclmc" name="fclmc" readonly value="${item_c[i].材料名称}"/>
              </div>
              <div class="mui-input-row">
                 <label for="fbm">编码</label>
                 <input type="text" id="fbm" name="fbm" readonly value="${item_c[i].编码}"/>
              </div>
              <div class="mui-input-row">
                  <label for="fggxh">规格型号</label>
                  <input type="text" id="fggxh" name="fggxh" readonly value="${item_c[i].规格型号}"/>
              </div>      
              <div class="mui-input-row">
                  <label for="fjldw">计量单位</label>
                  <input type="text" id="fjldw" name="fjldw" readonly value="${item_c[i].计量单位}"/>
              </div>   
              <div class="mui-input-row">
                  <label for="fghsl">更换数量<i style="color:red;">*</i></label>
                  <input type="number" id="fghsl" name="fghsl" readonly value="${item_c[i].更换数量}"/>
              </div>
              <div class="mui-input-row">
                  <label for="flyly">领用来源<i style="color:red;">*</i></label>
                  <input type="text" id="flyly" name="flyly" readonly value="${item_c[i].领用来源}"/>   
              </div> 
               <div class="mui-input-row">
                  <label for="fbz">备注</label>
                  <input type="text" id="fbz" name="fbz" readonly value="${item_c[i].备注}"/> 
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
        
    } else if (String(NodeName) == '工程部1' || String(NodeName) == '工程部3') {
        $("#fjssj,#fztyyms,#fecpgsj,#fwxgs,#fqthf").removeAttr('readonly');
        tapEventAdd();
        $('#tjmx').show();

    } else if (String(NodeName) == '发起人') {
        $("input[type='radio']").removeAttr('disabled');
        tapEventEval();
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
        if (!fclmc){
            mui.toast('请填写材料名称');
            return false;
        }
        if (!fghsl) {
            mui.toast('请填写更换数量');
            return false;
        }
        if (!flyly) {
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
    var fwxpj = null;
    $("input[type='radio']").each(function () {
        if ($(this).attr('checked')) {
            fwxpj = $(this).parent().find('label').text();
        }
    });

    var fbmyyy = $("#fbmyyy").val();

    var mxflag = false;
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fclmc = $(this).find("#fclmc").val();
        var fbm = $(this).find("#fbm").val();
        var fggxh = $(this).find("#fggxh").val();
        var fjldw = $(this).find("#fjldw").val();
        var fghsl = $(this).find("#fghsl").val();


        var mx = new Mx(fclmc, fbm, fggxh, fjldw, fghsl, flyly, fbz);

    });



}
function reSave() {

}

function hasRead() {

}

function AgreeOrConSign() {

}