function prepMsg() {
    $("#fdate").val(getNowFormatDate(2));
    tapEvent();
    var xml = '<?xml version= "1.0" ?>';
    xml = xml + '   <Requests>';
    xml = xml + '   <Params>';
    xml = xml + '       <Method>GetFormPostData</Method>';
    xml = xml + '       <ProcessName>威海卫大厦管家班清洗费用申请</ProcessName>';
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
        $("#fname").val(item.提报人);
        $("#fdept").val(item.提报部门);
    }).fail(function (e) {

        });
    initOrgMsg();
}

function tapEvent() {
    var yearNow = new Date().getFullYear();
    var fyeardata = [
        {
            value: '',
            text: yearNow-1
        },
        {
            value: '',
            text: yearNow
        },
        {
            value: '',
            text: yearNow+1
        }
    ];
    showPicker('fyear', fyeardata);

    var fmonthdata = [

    ];
    for (var i = 1; i <= 12; i++) {
        var obj = {
            value: '',
            text: i
        }
        fmonthdata.push(obj);
    }

    showPicker('fmonth', fmonthdata);


    $("#ffybm").on('tap', function () {
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


    $("#ffybmjl").on('tap', function () {
        XuntongJSBridge.call('selectPerson', { 'pType':'1'}, function (result) {
            //console.log(JSON.stringify(result));
            var ids = new Array();
            //console.log((result.data.persons[0]).openId);
            ids.push(((result.data.persons[0]).openId));
            $.ajax({
                type: "POST",
                url: "/api/bpm/PostAccount",
                data: { "ids": ids },
                beforeSend: function (XHR) {
                    XHR.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem('ticket'));
                }
            }).done(function (data) {
                console.log(data);
                $("#ffybmjl").val(data.data[0].name);
                $("#ffybmjl").data('ffybmjlno', data.data[0].phone);

            }).fail(function (e) {

            });
        });

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
        var checkboxArray = [].slice.call(list.querySelectorAll('input[type="radio"]'));
        var checkedValues = [];
        
        checkboxArray.forEach(function (box) {
            if (box.checked) {
                checkedValues.push(box.parentNode.innerText);
                 //取消选中，防止再次进入列表中会选中某一项
                box.checked = !box.checked;
                
            }
        });
        if (checkedValues.length > 0) {
            $("#ffybm").val(checkedValues[checkedValues.length - 1]);
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

//获取组织信息
function initOrgMsg() {

    var xml = '<?xml version= "1.0" ?>';
    xml = xml + '      <Requests>';
    xml = xml + '     <Params>';
    xml = xml + '         <DataSource>BPMDATA</DataSource>';
    xml = xml + '         <ID>erploud_公用_获取组织</ID>';
    xml = xml + '         <Type>1</Type>';
    xml = xml + '        <Method>GetUserDataProcedure</Method>';
    xml = xml + '        <ProcedureName>erploud_公用_获取组织</ProcedureName>';
    xml = xml + '        <Filter>';
    xml = xml + '         <code>01.01.96</code>';
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
        for (var i = 0; i < item.length; i++) {
            var li = '<li data-value="" data-tags="" class="mui-table-view-cell mui-indexed-list-item mui-radio mui-left">';
            li += '<input type="radio" name="radio" ';
            li += 'data-fbmmc="' + item[i].ouname + '"';
            li += ' />' + item[i].ouname;
            li += '</li>';
            $("#datalist").append(li);

        }
    }).fail(function (e) {

        }).then(function () {
            prepIndexedList();
        });
}


function initData(data, flag) {
    var item = data.FormDataSet.威海卫大厦管家班清洗费用表[0];
    if (flag) {

        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.fbillno);

    }


    $("#fname").val(item.提报人);
    $("#fyear").val(item.费用年度);
    $("#fmonth").val(item.费用月度);
    $("#fdate").val(FormatterTimeYMS(item.提报日期));
    $("#fdept").val(item.提报部门);
    $("#ffybm").val(item.费用部门);
    $("#ffybmjl").val(item.费用部门经理);
    $("#ffybmjl").data('ffybmjlno', item.费用部门经理工号);
    $("#fxm").val(item.项目);
    $("#ffyhj").val(item.费用合计);


}
function nodeControllerExp(NodeName) {
    if (String(NodeName).match('开始') != null) {
        tapEvent();
        $("#fdate,#fxm,#ffyhj").removeAttr('readonly');
    }
}
function Save() {
    var fname = $("#fname").val();
    var fyear = $("#fyear").val();
    var fmonth = $("#fmonth").val();
    var fdate = $("#fdate").val();
    var fdept = $("#fdept").val();

    var ffybm = $("#ffybm").val();
    var ffybmjl = $("#ffybmjl").val();
    var fxm = $("#fxm").val();
    var ffyhj = $("#ffyhj").val();
    var ffybmjlno = $("#ffybmjl").data('ffybmjlno');
    //必填项校验
    if (!fyear) {
        mui.toast('请选择费用年度');
        return;
    }
    if (!fmonth) {
        mui.toast('请选择费用月度');
        return;
    }
    if (!ffybm) {
        mui.toast('请选择费用部门');
        return;
    }
    if (!ffybmjl) {
        mui.toast('请选择费用部门经理');
        return;
    }
    if (!fxm) {
        mui.toast('请填写项目');
        return;
    }
    if (!ffyhj) {
        mui.toast('请填写费用合计');
        return;
    }
    var btnArry = ["取消", "确定"];
    mui.confirm('即将提交，是否确定？', '提交确认提醒', btnArry, function (e) {
        if (e.index == 1) {
            var xml = '<?xml version= "1.0" ?>';
            xml = xml + '   <XForm>';
            xml = xml + '         <Header>';
            xml = xml + '        <Method>Post</Method>';
            xml = xml + '       <ProcessName>威海卫大厦管家班清洗费用申请</ProcessName>';
            xml = xml + '         <ProcessVersion>' + version + '</ProcessVersion>';
            xml = xml + '            <DraftGuid></DraftGuid>';
            xml = xml + '             <OwnerMemberFullName>' + BPMOU + '</OwnerMemberFullName>';
            xml = xml + '            <Action>提交</Action>';
            xml = xml + '          <Comment></Comment>';
            xml = xml + '             <InviteIndicateUsers></InviteIndicateUsers>';
            xml = xml + '       </Header>';
            xml = xml + '       <FormData>';

            xml = xml + '<威海卫大厦管家班清洗费用表>';
            xml = xml + '  <fbillno>自动带出</fbillno>';
            xml = xml + ' <提报人>' + fname + '</提报人>';
            xml = xml + '<费用年度>' + fyear + '</费用年度>';
            xml = xml + ' <费用月度>' + fmonth + '</费用月度>';
            xml = xml + ' <提报日期>' + fdate + '</提报日期>';
            xml = xml + '<提报部门>' + fdept + '</提报部门>';
            xml = xml + ' <费用部门>' + ffybm + '</费用部门>';
            xml = xml + ' <费用部门经理>' + ffybmjl + '</费用部门经理>';
            xml = xml + '<费用部门经理工号>' + ffybmjlno + '</费用部门经理工号>';
            xml = xml + ' <项目>' + fxm + '</项目>';
            xml = xml + ' <费用合计>' + ffyhj + '</费用合计>';
            xml = xml + '  </威海卫大厦管家班清洗费用表>';

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
    var fyear = $("#fyear").val();
    var fmonth = $("#fmonth").val();
    var fdate = $("#fdate").val();
    var fdept = $("#fdept").val();

    var ffybm = $("#ffybm").val();
    var ffybmjl = $("#ffybmjl").val();
    var fxm = $("#fxm").val();
    var ffyhj = $("#ffyhj").val();
    var ffybmjlno = $("#ffybmjl").data('ffybmjlno');
    //必填项校验
    if (!fyear) {
        mui.toast('请选择费用年度');
        return;
    }
    if (!fmonth) {
        mui.toast('请选择费用月度');
        return;
    }
    if (!ffybm) {
        mui.toast('请选择费用部门');
        return;
    }
    if (!ffybmjl) {
        mui.toast('请选择费用部门经理');
        return;
    }
    if (!fxm) {
        mui.toast('请填写项目');
        return;
    }
    if (!ffyhj) {
        mui.toast('请填写费用合计');
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

            xml = xml + '<威海卫大厦管家班清洗费用表>';
            xml = xml + '  <fbillno>' + fbillno + '</fbillno>';
            xml = xml + ' <提报人>' + fname + '</提报人>';
            xml = xml + '<费用年度>' + fyear + '</费用年度>';
            xml = xml + ' <费用月度>' + fmonth + '</费用月度>';
            xml = xml + ' <提报日期>' + fdate + '</提报日期>';
            xml = xml + '<提报部门>' + fdept + '</提报部门>';
            xml = xml + ' <费用部门>' + ffybm + '</费用部门>';
            xml = xml + ' <费用部门经理>' + ffybmjl + '</费用部门经理>';
            xml = xml + '<费用部门经理工号>' + ffybmjlno + '</费用部门经理工号>';
            xml = xml + ' <项目>' + fxm + '</项目>';
            xml = xml + ' <费用合计>' + ffyhj + '</费用合计>';
            xml = xml + '  </威海卫大厦管家班清洗费用表>';

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
    var fyear = $("#fyear").val();
    var fmonth = $("#fmonth").val();
    var fdate = $("#fdate").val();
    var fdept = $("#fdept").val();

    var ffybm = $("#ffybm").val();
    var ffybmjl = $("#ffybmjl").val();
    var fxm = $("#fxm").val();
    var ffyhj = $("#ffyhj").val();
    var ffybmjlno = $("#ffybmjl").data('ffybmjlno');

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

            xml = xml + '<威海卫大厦管家班清洗费用表>';
            xml = xml + '  <fbillno>' + fbillno + '</fbillno>';
            xml = xml + ' <提报人>' + fname + '</提报人>';
            xml = xml + '<费用年度>' + fyear + '</费用年度>';
            xml = xml + ' <费用月度>' + fmonth + '</费用月度>';
            xml = xml + ' <提报日期>' + fdate + '</提报日期>';
            xml = xml + '<提报部门>' + fdept + '</提报部门>';
            xml = xml + ' <费用部门>' + ffybm + '</费用部门>';
            xml = xml + ' <费用部门经理>' + ffybmjl + '</费用部门经理>';
            xml = xml + '<费用部门经理工号>' + ffybmjlno + '</费用部门经理工号>';
            xml = xml + ' <项目>' + fxm + '</项目>';
            xml = xml + ' <费用合计>' + ffyhj + '</费用合计>';
            xml = xml + '  </威海卫大厦管家班清洗费用表>';

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
    var fyear = $("#fyear").val();
    var fmonth = $("#fmonth").val();
    var fdate = $("#fdate").val();
    var fdept = $("#fdept").val();

    var ffybm = $("#ffybm").val();
    var ffybmjl = $("#ffybmjl").val();
    var fxm = $("#fxm").val();
    var ffyhj = $("#ffyhj").val();
    var ffybmjlno = $("#ffybmjl").data('ffybmjlno');

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

            xml = xml + '<威海卫大厦管家班清洗费用表>';
            xml = xml + '  <fbillno>' + fbillno + '</fbillno>';
            xml = xml + ' <提报人>' + fname + '</提报人>';
            xml = xml + '<费用年度>' + fyear + '</费用年度>';
            xml = xml + ' <费用月度>' + fmonth + '</费用月度>';
            xml = xml + ' <提报日期>' + fdate + '</提报日期>';
            xml = xml + '<提报部门>' + fdept + '</提报部门>';
            xml = xml + ' <费用部门>' + ffybm + '</费用部门>';
            xml = xml + ' <费用部门经理>' + ffybmjl + '</费用部门经理>';
            xml = xml + '<费用部门经理工号>' + ffybmjlno + '</费用部门经理工号>';
            xml = xml + ' <项目>' + fxm + '</项目>';
            xml = xml + ' <费用合计>' + ffyhj + '</费用合计>';
            xml = xml + '  </威海卫大厦管家班清洗费用表>';

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
        xml = xml + '<威海卫大厦管家班清洗费用表>';
        xml = xml + '  <fbillno>' + fbillno + '</fbillno>';
        xml = xml + ' <提报人>' + fname + '</提报人>';
        xml = xml + '<费用年度>' + fyear + '</费用年度>';
        xml = xml + ' <费用月度>' + fmonth + '</费用月度>';
        xml = xml + ' <提报日期>' + fdate + '</提报日期>';
        xml = xml + '<提报部门>' + fdept + '</提报部门>';
        xml = xml + ' <费用部门>' + ffybm + '</费用部门>';
        xml = xml + ' <费用部门经理>' + ffybmjl + '</费用部门经理>';
        xml = xml + '<费用部门经理工号>' + ffybmjlno + '</费用部门经理工号>';
        xml = xml + ' <项目>' + fxm + '</项目>';
        xml = xml + ' <费用合计>' + ffyhj + '</费用合计>';
        xml = xml + '  </威海卫大厦管家班清洗费用表>';

        xml = xml + '</FormData>';
        xml = xml + '</XForm>';
        PostXml(xml);

    }

}