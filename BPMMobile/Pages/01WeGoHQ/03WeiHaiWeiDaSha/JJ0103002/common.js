function prepMsg() {
    $("#fdate").val(getNowFormatDate(2));
    tapEvent();
    var xml = '<?xml version= "1.0" ?>';
    xml = xml + '   <Requests>';
    xml = xml + '   <Params>';
    xml = xml + '       <Method>GetFormPostData</Method>';
    xml = xml + '       <ProcessName>威海卫大厦青缇湾工程维修申请</ProcessName>';
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
    var fwxdddata = [
        {
            value: '',
            text: '一楼大厅'
        },
        {
            value: '',
            text: '二楼餐厅'
        },
        {
            value: '',
            text: '客房区域'
        },
        {
            value: '',
            text: '厨房区域'
        }
    ];
    showPicker('fwxdd', fwxdddata);

    var fjjcddata = [
        {
            value: '',
            text:'紧急'
        },
        {
            value: '',
            text:'一般'
        }
    ];
    showPicker('fjjcd', fjjcddata);



}


function initData(data, flag) {

    var item = data.FormDataSet.威海卫大厦青缇湾工程维修表单[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.fbillno);
    }
    $("#fwxdd").val(item.维修地点);
    $("#fname").val(item.报修人);
    $("#fdate").val(FormatterTimeYMS(item.报修时间));
    $("#fbxnr").val(item.报修内容);
    $("#flxdh").val(item.联系电话);
    $("#fjjcd").val(item.紧急程度);
    $("#fjdr").val(item.接单人);
    $("#fjdsj").val(FormatterTimeYMS(item.派工时间));
    $("#fbz").val(item.备注);
    
}

function nodeControllerExp(NodeName) {

    if (String(NodeName).match('开始') != null) {
        tapEvent();
        $("#fdate,#fbxnr,#flxdh,#fbz").removeAttr('readonly');

    } else if (String(NodeName).match('青缇湾物管中心') != null){
        //接单人为当前登录用户，接单时间为当前日期
        XuntongJSBridge.call('getPersonInfo', {}, function (result) {
            if (typeof (result) == "string") {
                result = JSON.parse(result);
            }
            console.log(result);
            if (result.success == true || result.success == "true") {
                if (typeof (result.data.name) == "undefined") {
                    
                } else {
                    $("#fjdr").val(result.data.name);
                }
            }

        });
        
        $("#fjdsj").val(getNowFormatDate(2));

    }
}

function nodeShareExt(ShareNode) {
    if (ShareNode == '流程被共享') {
        $("#approvalD").empty();
        var li = '';
        li = li + '    &nbsp;&nbsp;';
        li = li + '   <button class="mui-btn mui-btn-green roundbt" type="button" style="width:100%" id="pickupbt" onclick="PickupShareTaskExt()">从共享任务中取出</button>';
        $("#approvalD").append(li);
    } else if (ShareNode == '流程被取出') {
        var li = '';
        li = li + '    &nbsp;&nbsp;';
        li = li + '   <button class="mui-btn mui-btn-green roundbt" type="button" style="width:100%" id="pickbackbt" onclick="PutbackShareTaskExt()">放回共享任务</button>';
        $("#approvalD").append(li);


    }
}

function Save() {
    var fwxdd = $("#fwxdd").val();
    var fname = $("#fname").val();
    var fdate = $("#fdate").val();
    var fbxnr = $("#fbxnr").val();
    var flxdh = $("#flxdh").val();
    var fjjcd = $("#fjjcd").val();
    var fjdr = $("#fjdr").val();
    var fjdsj = $("#fjdsj").val();
    var fbz = $("#fbz").val();

    if (!fwxdd) {
        mui.toast('请填写维修地点');
        return;
    }
    if (!fdate) {
        mui.toast('请选择报修时间');
        return;
    }
    if (!fbxnr) {
        mui.toast('请填写报修内容');
        return;
    }
    if (!fjjcd) {
        mui.toast('请选择紧急程度');
        return;
    }
    var btnArry = ["取消", "确定"];
    mui.confirm('即将提交，是否确定？', '提交确认提醒', btnArry, function (e) {
        if (e.index == 1) {
            var xml = '<?xml version= "1.0" ?>';
            xml = xml + '   <XForm>';
            xml = xml + '         <Header>';
            xml = xml + '        <Method>Post</Method>';
            xml = xml + '       <ProcessName>威海卫大厦青缇湾工程维修申请</ProcessName>';
            xml = xml + '         <ProcessVersion>' + version + '</ProcessVersion>';
            xml = xml + '            <DraftGuid></DraftGuid>';
            xml = xml + '             <OwnerMemberFullName>' + BPMOU + '</OwnerMemberFullName>';
            xml = xml + '            <Action>提交</Action>';
            xml = xml + '          <Comment></Comment>';
            xml = xml + '             <InviteIndicateUsers></InviteIndicateUsers>';
            xml = xml + '       </Header>';
            xml = xml + '       <FormData>';

            xml = xml + '    <威海卫大厦青缇湾工程维修表单>';
            xml = xml + '      <fbillno>自动带出</fbillno>';
            xml = xml + '     <维修地点>' + fwxdd + '</维修地点>';
            xml = xml + '     <报修人>' + fname + '</报修人>';
            xml = xml + '     <报修时间>' + fdate + '</报修时间>';
            xml = xml + '     <报修内容>' + fbxnr + '</报修内容>';
            xml = xml + '     <联系电话>' + flxdh + '</联系电话>';
            xml = xml + '      <紧急程度>' + fjjcd + '</紧急程度>';
            xml = xml + '     <接单人>' + fjdr + '</接单人>';
            xml = xml + '     <派工时间>' + fjdsj + '</派工时间>';
            xml = xml + '     <备注>' + fbz + '</备注>';
            xml = xml + '    </威海卫大厦青缇湾工程维修表单>';

            xml = xml + '</FormData>';
            xml = xml + '</XForm>';
            PostXml(xml);

        }
    });



}

function reSave() {
    var pid = $("#stepId").val();
    var fbillno = $("#fbillno").val();


    var fwxdd = $("#fwxdd").val();
    var fname = $("#fname").val();
    var fdate = $("#fdate").val();
    var fbxnr = $("#fbxnr").val();
    var flxdh = $("#flxdh").val();
    var fjjcd = $("#fjjcd").val();
    var fjdr = $("#fjdr").val();
    var fjdsj = $("#fjdsj").val();
    var fbz = $("#fbz").val();

    if (!fwxdd) {
        mui.toast('请填写维修地点');
        return;
    }
    if (!fdate) {
        mui.toast('请选择报修时间');
        return;
    }
    if (!fbxnr) {
        mui.toast('请填写报修内容');
        return;
    }
    if (!fjjcd) {
        mui.toast('请选择紧急程度');
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

            xml = xml + '    <威海卫大厦青缇湾工程维修表单>';
            xml = xml + '      <fbillno>' + fbillno + '</fbillno>';
            xml = xml + '     <维修地点>' + fwxdd + '</维修地点>';
            xml = xml + '     <报修人>' + fname + '</报修人>';
            xml = xml + '     <报修时间>' + fdate + '</报修时间>';
            xml = xml + '     <报修内容>' + fbxnr + '</报修内容>';
            xml = xml + '     <联系电话>' + flxdh + '</联系电话>';
            xml = xml + '      <紧急程度>' + fjjcd + '</紧急程度>';
            xml = xml + '     <接单人>' + fjdr + '</接单人>';
            xml = xml + '     <派工时间>' + fjdsj + '</派工时间>';
            xml = xml + '     <备注>' + fbz + '</备注>';
            xml = xml + '    </威海卫大厦青缇湾工程维修表单>';

            xml = xml + '</FormData>';
            xml = xml + '</XForm>';
            PostXml(xml);
        }
    });
}

function hasRead() {
    var pid = $("#stepId").val();
    var fbillno = $("#fbillno").val();

    var fwxdd = $("#fwxdd").val();
    var fname = $("#fname").val();
    var fdate = $("#fdate").val();
    var fbxnr = $("#fbxnr").val();
    var flxdh = $("#flxdh").val();
    var fjjcd = $("#fjjcd").val();
    var fjdr = $("#fjdr").val();
    var fjdsj = $("#fjdsj").val();
    var fbz = $("#fbz").val();

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

            xml = xml + '    <威海卫大厦青缇湾工程维修表单>';
            xml = xml + '      <fbillno>' + fbillno + '</fbillno>';
            xml = xml + '     <维修地点>' + fwxdd + '</维修地点>';
            xml = xml + '     <报修人>' + fname + '</报修人>';
            xml = xml + '     <报修时间>' + fdate + '</报修时间>';
            xml = xml + '     <报修内容>' + fbxnr + '</报修内容>';
            xml = xml + '     <联系电话>' + flxdh + '</联系电话>';
            xml = xml + '      <紧急程度>' + fjjcd + '</紧急程度>';
            xml = xml + '     <接单人>' + fjdr + '</接单人>';
            xml = xml + '     <派工时间>' + fjdsj + '</派工时间>';
            xml = xml + '     <备注>' + fbz + '</备注>';
            xml = xml + '    </威海卫大厦青缇湾工程维修表单>';

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

    var fwxdd = $("#fwxdd").val();
    var fname = $("#fname").val();
    var fdate = $("#fdate").val();
    var fbxnr = $("#fbxnr").val();
    var flxdh = $("#flxdh").val();
    var fjjcd = $("#fjjcd").val();
    var fjdr = $("#fjdr").val();
    var fjdsj = $("#fjdsj").val();
    var fbz = $("#fbz").val();

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
            xml = xml + '    <威海卫大厦青缇湾工程维修表单>';
            xml = xml + '      <fbillno>' + fbillno + '</fbillno>';
            xml = xml + '     <维修地点>' + fwxdd + '</维修地点>';
            xml = xml + '     <报修人>' + fname + '</报修人>';
            xml = xml + '     <报修时间>' + fdate + '</报修时间>';
            xml = xml + '     <报修内容>' + fbxnr + '</报修内容>';
            xml = xml + '     <联系电话>' + flxdh + '</联系电话>';
            xml = xml + '      <紧急程度>' + fjjcd + '</紧急程度>';
            xml = xml + '     <接单人>' + fjdr + '</接单人>';
            xml = xml + '     <派工时间>' + fjdsj + '</派工时间>';
            xml = xml + '     <备注>' + fbz + '</备注>';
            xml = xml + '    </威海卫大厦青缇湾工程维修表单>';

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
        xml = xml + '    <威海卫大厦青缇湾工程维修表单>';
        xml = xml + '      <fbillno>' + fbillno + '</fbillno>';
        xml = xml + '     <维修地点>' + fwxdd + '</维修地点>';
        xml = xml + '     <报修人>' + fname + '</报修人>';
        xml = xml + '     <报修时间>' + fdate + '</报修时间>';
        xml = xml + '     <报修内容>' + fbxnr + '</报修内容>';
        xml = xml + '     <联系电话>' + flxdh + '</联系电话>';
        xml = xml + '      <紧急程度>' + fjjcd + '</紧急程度>';
        xml = xml + '     <接单人>' + fjdr + '</接单人>';
        xml = xml + '     <派工时间>' + fjdsj + '</派工时间>';
        xml = xml + '     <备注>' + fbz + '</备注>';
        xml = xml + '    </威海卫大厦青缇湾工程维修表单>';

        xml = xml + '</FormData>';
        xml = xml + '</XForm>';
        PostXml(xml);
    }
}