function prepMsg() {
    $("#fdate").val(getNowFormatDate(2));
    tapEvent();
    var xml = '<?xml version= "1.0" ?>';
    xml = xml + '   <Requests>';
    xml = xml + '   <Params>';
    xml = xml + '       <Method>GetFormPostData</Method>';
    xml = xml + '       <ProcessName>威海卫大厦外来人员就餐申请</ProcessName>';
    xml = xml + '      <ProcessVersion>' + version + '</ProcessVersion>';
    xml = xml + '      <Owner></Owner>';
    xml = xml + '    </Params>';
    xml = xml + '   </Requests>';
    dataProvider(xml, function (data) {
        var provideData = JSON.parse(unescape(data.replace(/\\(u[0-9a-fA-F]{4})/gm, '%$1')));
        console.log(provideData);
        var item = provideData.Tables[0].Rows[0];
        $("#fname").val(item.申请人);
        $("#fdept").val(item.申请部门);
    });

}


function dataProvider(xml,callback) {

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
            if (XMLHttpRequest.status == "401"){
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

    //使用es6标准重构添加子表函数
    $('#tjmx').on('tap', () => {
        var li = `
           <div id="mx" class="mui-card">
              <div class="mui-input-row itemtitle">
                 <label>明细列表项</label>
                 <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>
              </div>
              <div class="mui-input-row">
                 <label for="fwldwmc">外来单位名称<i style="color:red;">*</i></label>
                 <input type="text" id="fwldwmc" name="fwldwmc" placeholder="请填写外来单位名称"/>
              </div>
              <div class="mui-input-row">
                  <label for="fjcrs">就餐人数(人)<i style="color:red;">*</i></label>
                  <input type="number" id="fjcrs" name="fjcrs" placeholder="请填写就餐人数"/>
              </div>
              <div class="mui-input-row" style="height:auto;">
                  <label for="fsqsy">申请事由<i style="color:red;">*</i></label>
                  <textarea rows="3" id="fsqsy" name="fsqsy" placeholder="请填写申请事由"></textarea>
              </div>
              <div class="mui-input-row itemtitle2">
                 <label>用餐人数(人)<i style="color:red;">*</i></label>  
              </div> 
              <div class="mui-input-row">
                 <label for="fycrs_morn">早</label>
                 <input type="number" id="fycrs_morn" name="fycrs_morn" value="0" placeholder="请填写早餐人数" data-fycje="" class="calcJE"/>
              </div>
              <div class="mui-input-row">
                 <label for="fycrs_noon">午</label>
                 <input type="number" id="fycrs_noon" name="fycrs_noon" value="0" placeholder="请填写午餐人数" data-fycje="" class="calcJE"/>
              </div>
              <div class="mui-input-row">
                 <label for="fycrs_night">晚</label>
                 <input type="number" id="fycrs_night" name="fycrs_night" value="0" placeholder="请填写晚餐人数" data-fycje="" class="calcJE"/>
              </div> 
           </div>   
        `;
        $("#mxlist").append(li);
        $("#mxlist").find(".calcJE").each(function () {

            $(this).on('input', function () {
                
                var value = parseInt($(this).val());
                value = isNaN(value) ? 0 : value;
                var total = 0;
                switch (String($(this).attr('id'))) {
                    case 'fycrs_morn':
                        total = (value * 1.65).toFixed(2);
                        break;
                    case 'fycrs_noon':
                        total = (value * 10).toFixed(2);
                        break;
                    case 'fycrs_night':
                        total = (value * 10.05).toFixed(2);
                        break;
                    default:
                        break;

                }
                console.log(total);
                $(this).data('fycje', total);
            });
        });

        
    });


}


function initData(data, flag) {
    var item = data.FormDataSet.威海卫大厦外来人员职工餐申请表_A[0];
    if (flag) {

        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.fbillno);

    }

    $("#fname").val(item.申请人);
    $("#fdept").val(item.申请部门);
    $("#fdate").val(FormatterTimeYMS(item.申请日期));

    //todo:餐费标准
    $("#fcfbz").data('morn', item.早餐标准);
    $("#fcfbz").data('noon', item.午餐标准);
    $("#fcfbz").data('night', item.晚餐标准);



    var item_c = data.FormDataSet.威海卫大厦外来人员职工餐申请表_B;
    for (var i = 0; i < item_c.length; i++) {
        itemidArr.push(item_c[i].itemid);
        var li = `
           <div id="mx" class="mui-card">
              <div class="mui-input-row itemtitle">
                 <label>明细列表项</label>
                 <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>
              </div>
              <div class="mui-input-row">
                 <label for="fwldwmc">外来单位名称<i style="color:red;">*</i></label>
                 <input type="text" id="fwldwmc" name="fwldwmc" readonly value="${item_c[i].外来单位名称}"/>
              </div>
              <div class="mui-input-row">
                  <label for="fjcrs">就餐人数(人)<i style="color:red;">*</i></label>
                  <input type="number" id="fjcrs" name="fjcrs" readonly value="${item_c[i].就餐人数}"/>
              </div>
              <div class="mui-input-row" style="height:auto;">
                  <label for="fsqsy">申请事由<i style="color:red;">*</i></label>
                  <textarea rows="3" id="fsqsy" name="fsqsy" readonly>${item_c[i].申请事由}</textarea>
              </div>
              <div class="mui-input-row itemtitle2">
                 <label>用餐人次(人)<i style="color:red;">*</i></label>  
              </div> 
             
              <div class="mui-input-row">
                 <label for="fycrs_morn">早</label>
                 <input type="number" id="fycrs_morn" name="fycrs_morn" value="${item_c[i].早}" readonly data-fycje="" class="calcJE"/>
              </div>
              <div class="mui-input-row">
                 <label for="fycrs_noon">午</label>
                 <input type="number" id="fycrs_noon" name="fycrs_noon" value="${item_c[i].中}" readonly data-fycje="" class="calcJE"/>
              </div>
              <div class="mui-input-row">
                 <label for="fycrs_night">晚</label>
                 <input type="number" id="fycrs_night" name="fycrs_night" value="${item_c[i].晚}" readonly data-fycje="" class="calcJE"/>
              </div> 
           </div>   
        `;
        $("#mxlist").append(li);
    }

}

function nodeControllerExp(NodeName) {
    if (String(NodeName).match('开始') != null) {
        tapEvent();
        $("#mxlist").find('span').each(function (){
            $(this).show();
        });
        $("#tjmx").show();
        $("#mxlist").find('input').each(function () {
            $(this).removeAttr('readonly');
        });
        $("#fdate").removeAttr('readonly');
        $("#mxlist").find(".calcJE").each(function () {

            $(this).on('input', function () {

                var value = parseInt($(this).val());
                value = isNaN(value) ? 0 : value;
                var total = 0;
                switch (String($(this).attr('id'))) {
                    case 'fycrs_morn':
                        total = (value * 1.65).toFixed(2);
                        break;
                    case 'fycrs_noon':
                        total = (value * 10).toFixed(2);
                        break;
                    case 'fycrs_night':
                        total = (value * 10.05).toFixed(2);
                        break;
                    default:
                        break;

                }
                console.log(total);
                $(this).data('fycje', total);
            });
        });

    } 
    
}

//定义子表明细类
class MxItem {
    constructor(fwldwmc, fjcrs, fsqsy, fycrs_morn, fycrs_noon, fycrs_night,fycje_morn,fycje_noon,fycje_night) {
        this.fwldwmc = fwldwmc;
        this.fjcrs = fjcrs;
        this.fsqsy = fsqsy;
        this.fycrs_morn = fycrs_morn;
        this.fycrs_noon = fycrs_noon;
        this.fycrs_night = fycrs_night;
        this.fycje_morn = fycje_morn;
        this.fycje_noon = fycje_noon;
        this.fycje_night = fycje_night;
    }
    //校验字段函数
    check() {
        if (!this.fwldwmc) {
            mui.toast('请填写外来单位名称');
            return false;
        }
        if (!this.fjcrs) {
            mui.toast('请填写就餐人数');
            return false;
        }
        if (!this.fsqsy) {
            mui.toast('请填写申请事由');
            return false;
        }
        return true;
    }
    
}

function Save() {
    var fname = $("#fname").val();
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();

    var mxflag = false;
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fwldwmc = $(this).find("#fwldwmc").val();
        var fjcrs = $(this).find("#fjcrs").val();
        var fsqsy = $(this).find("#fsqsy").val();
        var fycrs_morn = $(this).find("#fycrs_morn").val();
        var fycrs_noon = $(this).find("#fycrs_noon").val();
        var fycrs_night = $(this).find("#fycrs_night").val();
        var fycje_morn = $(this).find("#fycrs_morn").data('fycje');
        var fycje_noon = $(this).find("#fycrs_noon").data('fycje');
        var fycje_night = $(this).find("#fycrs_night").data('fycje');
        var mx = new MxItem(fwldwmc, fjcrs, fsqsy, fycrs_morn, fycrs_noon, fycrs_night, fycje_morn, fycje_noon, fycje_night);
        if (!mx.check()) {
            mxflag = true;
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
            var xml = '<?xml version= "1.0" ?>';
            xml = xml + '   <XForm>';
            xml = xml + '         <Header>';
            xml = xml + '        <Method>Post</Method>';
            xml = xml + '       <ProcessName>威海卫大厦外来人员就餐申请</ProcessName>';
            xml = xml + '         <ProcessVersion>' + version + '</ProcessVersion>';
            xml = xml + '            <DraftGuid></DraftGuid>';
            xml = xml + '             <OwnerMemberFullName>' + BPMOU + '</OwnerMemberFullName>';
            xml = xml + '            <Action>提交</Action>';
            xml = xml + '          <Comment></Comment>';
            xml = xml + '             <InviteIndicateUsers></InviteIndicateUsers>';
            xml = xml + '       </Header>';
            xml = xml + '       <FormData>';

            xml = xml + ' <威海卫大厦外来人员职工餐申请表_A>';
            xml = xml + '  <fbillno>自动带出</fbillno>';
            xml = xml + ' <申请人>' + fname + '</申请人>';
            xml = xml + ' <申请部门>' + fdept + '</申请部门>';
            xml = xml + ' <申请日期>' + fdate + '</申请日期>';
            xml = xml + ' <早餐标准>1.65</早餐标准>';
            xml = xml + ' <午餐标准>5</午餐标准>';
            xml = xml + ' <晚餐标准>3.35</晚餐标准>';
            xml = xml + ' </威海卫大厦外来人员职工餐申请表_A>';
            for (var i = 0; i < mxlistArr.length; i++) {
                xml = xml + '  <威海卫大厦外来人员职工餐申请表_B>';
                xml = xml + '  <RelationRowGuid>' + i+1 + '</RelationRowGuid>';
                xml = xml + '  <RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + ' <fentyrno>' + i + 1 + '</fentyrno>';
                xml = xml + ' <外来单位名称>' + mxlistArr[i].fwldwmc + '</外来单位名称>';
                xml = xml + ' <就餐人数>' + mxlistArr[i].fjcrs + '</就餐人数>';
                xml = xml + ' <申请事由>' + mxlistArr[i].fsqsy + '</申请事由>';
                xml = xml + ' <早合计金额>' + mxlistArr[i].fycje_morn + '</早合计金额>';
                xml = xml + '  <中合计金额>' + mxlistArr[i].fycje_noon + '</中合计金额>';
                xml = xml + '  <晚合计金额>' + mxlistArr[i].fycje_night + '</晚合计金额>';
                xml = xml + '  <早>' + mxlistArr[i].fycrs_morn + '</早>';
                xml = xml + '  <中>' + mxlistArr[i].fycrs_noon + '</中>';
                xml = xml + '  <晚>' + mxlistArr[i].fycrs_night + '</晚>';
                xml = xml + ' </威海卫大厦外来人员职工餐申请表_B>';
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
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();

    var mxflag = false;
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fwldwmc = $(this).find("#fwldwmc").val();
        var fjcrs = $(this).find("#fjcrs").val();
        var fsqsy = $(this).find("#fsqsy").val();
        var fycrs_morn = $(this).find("#fycrs_morn").val();
        var fycrs_noon = $(this).find("#fycrs_noon").val();
        var fycrs_night = $(this).find("#fycrs_night").val();
        var fycje_morn = $(this).find("#fycrs_morn").data('fycje');
        var fycje_noon = $(this).find("#fycrs_noon").data('fycje');
        var fycje_night = $(this).find("#fycrs_night").data('fycje');
        var mx = new MxItem(fwldwmc, fjcrs, fsqsy, fycrs_morn, fycrs_noon, fycrs_night, fycje_morn, fycje_noon, fycje_night);
        if (!mx.check()) {
            mxflag = true;
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

            xml = xml + ' <威海卫大厦外来人员职工餐申请表_A>';
            xml = xml + '  <fbillno>' + fbillno + '</fbillno>';
            xml = xml + ' <申请人>' + fname + '</申请人>';
            xml = xml + ' <申请部门>' + fdept + '</申请部门>';
            xml = xml + ' <申请日期>' + fdate + '</申请日期>';
            xml = xml + ' <早餐标准>1.65</早餐标准>';
            xml = xml + ' <午餐标准>5</午餐标准>';
            xml = xml + ' <晚餐标准>3.35</晚餐标准>';
            xml = xml + ' </威海卫大厦外来人员职工餐申请表_A>';
            for (var i = 0; i < mxlistArr.length; i++) {
                xml = xml + '  <威海卫大厦外来人员职工餐申请表_B>';
                xml = xml + '  <RelationRowGuid>' + i + 1 + '</RelationRowGuid>';
                xml = xml + '  <RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + ' <fentyrno>' + i + 1 + '</fentyrno>';
                xml = xml + ' <外来单位名称>' + mxlistArr[i].fwldwmc + '</外来单位名称>';
                xml = xml + ' <就餐人数>' + mxlistArr[i].fjcrs + '</就餐人数>';
                xml = xml + ' <申请事由>' + mxlistArr[i].fsqsy + '</申请事由>';
                xml = xml + ' <早合计金额>' + mxlistArr[i].fycje_morn + '</早合计金额>';
                xml = xml + '  <中合计金额>' + mxlistArr[i].fycje_noon + '</中合计金额>';
                xml = xml + '  <晚合计金额>' + mxlistArr[i].fycje_night + '</晚合计金额>';
                xml = xml + '  <早>' + mxlistArr[i].fycrs_morn + '</早>';
                xml = xml + '  <中>' + mxlistArr[i].fycrs_noon + '</中>';
                xml = xml + '  <晚>' + mxlistArr[i].fycrs_night + '</晚>';
                xml = xml + ' </威海卫大厦外来人员职工餐申请表_B>';
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
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();

    var mxflag = false;
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fwldwmc = $(this).find("#fwldwmc").val();
        var fjcrs = $(this).find("#fjcrs").val();
        var fsqsy = $(this).find("#fsqsy").val();
        var fycrs_morn = $(this).find("#fycrs_morn").val();
        var fycrs_noon = $(this).find("#fycrs_noon").val();
        var fycrs_night = $(this).find("#fycrs_night").val();
        var fycje_morn = $(this).find("#fycrs_morn").data('fycje');
        var fycje_noon = $(this).find("#fycrs_noon").data('fycje');
        var fycje_night = $(this).find("#fycrs_night").data('fycje');
        var mx = new MxItem(fwldwmc, fjcrs, fsqsy, fycrs_morn, fycrs_noon, fycrs_night, fycje_morn, fycje_noon, fycje_night);
       
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

            xml = xml + ' <威海卫大厦外来人员职工餐申请表_A>';
            xml = xml + '  <fbillno>' + fbillno + '</fbillno>';
            xml = xml + ' <申请人>' + fname + '</申请人>';
            xml = xml + ' <申请部门>' + fdept + '</申请部门>';
            xml = xml + ' <申请日期>' + fdate + '</申请日期>';
            xml = xml + ' <早餐标准>1.65</早餐标准>';
            xml = xml + ' <午餐标准>5</午餐标准>';
            xml = xml + ' <晚餐标准>3.35</晚餐标准>';
            xml = xml + ' </威海卫大厦外来人员职工餐申请表_A>';
            for (var i = 0; i < mxlistArr.length; i++) {
                xml = xml + '  <威海卫大厦外来人员职工餐申请表_B>';
                xml = xml + '  <RelationRowGuid>' + i + 1 + '</RelationRowGuid>';
                xml = xml + '  <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
                xml = xml + ' <fentyrno>' + i + 1 + '</fentyrno>';
                xml = xml + ' <外来单位名称>' + mxlistArr[i].fwldwmc + '</外来单位名称>';
                xml = xml + ' <就餐人数>' + mxlistArr[i].fjcrs + '</就餐人数>';
                xml = xml + ' <申请事由>' + mxlistArr[i].fsqsy + '</申请事由>';
                xml = xml + ' <早合计金额>' + mxlistArr[i].fycje_morn + '</早合计金额>';
                xml = xml + '  <中合计金额>' + mxlistArr[i].fycje_noon + '</中合计金额>';
                xml = xml + '  <晚合计金额>' + mxlistArr[i].fycje_night + '</晚合计金额>';
                xml = xml + '  <早>' + mxlistArr[i].fycrs_morn + '</早>';
                xml = xml + '  <中>' + mxlistArr[i].fycrs_noon + '</中>';
                xml = xml + '  <晚>' + mxlistArr[i].fycrs_night + '</晚>';
                xml = xml + ' </威海卫大厦外来人员职工餐申请表_B>';
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
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();

    var mxflag = false;
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fwldwmc = $(this).find("#fwldwmc").val();
        var fjcrs = $(this).find("#fjcrs").val();
        var fsqsy = $(this).find("#fsqsy").val();
        var fycrs_morn = $(this).find("#fycrs_morn").val();
        var fycrs_noon = $(this).find("#fycrs_noon").val();
        var fycrs_night = $(this).find("#fycrs_night").val();
        var fycje_morn = $(this).find("#fycrs_morn").data('fycje');
        var fycje_noon = $(this).find("#fycrs_noon").data('fycje');
        var fycje_night = $(this).find("#fycrs_night").data('fycje');
        var mx = new MxItem(fwldwmc, fjcrs, fsqsy, fycrs_morn, fycrs_noon, fycrs_night, fycje_morn, fycje_noon, fycje_night);

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

            xml = xml + ' <威海卫大厦外来人员职工餐申请表_A>';
            xml = xml + '  <fbillno>' + fbillno + '</fbillno>';
            xml = xml + ' <申请人>' + fname + '</申请人>';
            xml = xml + ' <申请部门>' + fdept + '</申请部门>';
            xml = xml + ' <申请日期>' + fdate + '</申请日期>';
            xml = xml + ' <早餐标准>1.65</早餐标准>';
            xml = xml + ' <午餐标准>5</午餐标准>';
            xml = xml + ' <晚餐标准>3.35</晚餐标准>';
            xml = xml + ' </威海卫大厦外来人员职工餐申请表_A>';
            for (var i = 0; i < mxlistArr.length; i++) {
                xml = xml + '  <威海卫大厦外来人员职工餐申请表_B>';
                xml = xml + '  <RelationRowGuid>' + i + 1 + '</RelationRowGuid>';
                xml = xml + '  <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
                xml = xml + ' <fentyrno>' + i + 1 + '</fentyrno>';
                xml = xml + ' <外来单位名称>' + mxlistArr[i].fwldwmc + '</外来单位名称>';
                xml = xml + ' <就餐人数>' + mxlistArr[i].fjcrs + '</就餐人数>';
                xml = xml + ' <申请事由>' + mxlistArr[i].fsqsy + '</申请事由>';
                xml = xml + ' <早合计金额>' + mxlistArr[i].fycje_morn + '</早合计金额>';
                xml = xml + '  <中合计金额>' + mxlistArr[i].fycje_noon + '</中合计金额>';
                xml = xml + '  <晚合计金额>' + mxlistArr[i].fycje_night + '</晚合计金额>';
                xml = xml + '  <早>' + mxlistArr[i].fycrs_morn + '</早>';
                xml = xml + '  <中>' + mxlistArr[i].fycrs_noon + '</中>';
                xml = xml + '  <晚>' + mxlistArr[i].fycrs_night + '</晚>';
                xml = xml + ' </威海卫大厦外来人员职工餐申请表_B>';
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

        xml = xml + ' <威海卫大厦外来人员职工餐申请表_A>';
        xml = xml + '  <fbillno>' + fbillno + '</fbillno>';
        xml = xml + ' <申请人>' + fname + '</申请人>';
        xml = xml + ' <申请部门>' + fdept + '</申请部门>';
        xml = xml + ' <申请日期>' + fdate + '</申请日期>';
        xml = xml + ' <早餐标准>1.65</早餐标准>';
        xml = xml + ' <午餐标准>5</午餐标准>';
        xml = xml + ' <晚餐标准>3.35</晚餐标准>';
        xml = xml + ' </威海卫大厦外来人员职工餐申请表_A>';
        for (var i = 0; i < mxlistArr.length; i++) {
            xml = xml + '  <威海卫大厦外来人员职工餐申请表_B>';
            xml = xml + '  <RelationRowGuid>' + i + 1 + '</RelationRowGuid>';
            xml = xml + '  <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
            xml = xml + ' <fentyrno>' + i + 1 + '</fentyrno>';
            xml = xml + ' <外来单位名称>' + mxlistArr[i].fwldwmc + '</外来单位名称>';
            xml = xml + ' <就餐人数>' + mxlistArr[i].fjcrs + '</就餐人数>';
            xml = xml + ' <申请事由>' + mxlistArr[i].fsqsy + '</申请事由>';
            xml = xml + ' <早合计金额>' + mxlistArr[i].fycje_morn + '</早合计金额>';
            xml = xml + '  <中合计金额>' + mxlistArr[i].fycje_noon + '</中合计金额>';
            xml = xml + '  <晚合计金额>' + mxlistArr[i].fycje_night + '</晚合计金额>';
            xml = xml + '  <早>' + mxlistArr[i].fycrs_morn + '</早>';
            xml = xml + '  <中>' + mxlistArr[i].fycrs_noon + '</中>';
            xml = xml + '  <晚>' + mxlistArr[i].fycrs_night + '</晚>';
            xml = xml + ' </威海卫大厦外来人员职工餐申请表_B>';
        }

        xml = xml + '</FormData>';
        xml = xml + '</XForm>';
        PostXml(xml);
    }
}