
//预加载部分
var  _init= {

    _preCreate: function() {
        XuntongJSBridge.call('setWebViewTitle', { 'title': '发起流程' });

        XuntongJSBridge.call('getPersonInfo', {}, function (result) {

            if (typeof (result) == "string") {
                result = JSON.parse(result);
            }

            if (result.success == true || result.success == "true") {
                $("#fname").val(result.data.name);

            }

        });




        XuntongJSBridge.call('createPop', {
            'popTitle': '',
            'popTitleCallBackId': '1',
            'items': [{ 'text': '刷新', 'callBackId': 'callback1' }],
            'menuList': [
                'openWithBrowser'
            ],

        }, function (result) {
            if (result.success == true || result.success == 'true') {
                var callBackId = result.data ? result.data.callBackId : '';
                if (callBackId == 'callback1') {
                    window.location.reload();
                    //location.reload();
                } else if (callBackId == 'callback2') {

                } else {

                }
            }

        });
        
        prepMsg();
       

    },

    _preUndo: function () {

        mui('#csswitch').each(function () {

            this.addEventListener('toggle', function (event) {
                if (event.detail.isActive == 'true' || event.detail.isActive == true) {

                    $('#signbody').css('display', 'block');
                } else {

                    $('#signbody').css('display', 'none');
                    $('#signPer').val('');
                }

            });
        });
        XuntongJSBridge.call('setWebViewTitle', { 'title': '审批详情' });

        XuntongJSBridge.call('createPop', {
            'popTitle': '',
            'popTitleCallBackId': '1',
            'items': [
                { 'text': '刷新', 'callBackId': 'callback1' },
                { 'text': '知会', 'callBackId': 'callback2' },
                { 'text': '退回某步', 'callBackId': 'callback3' }

            ],
            'menuList': [
                'openWithBrowser'
            ],

        }, function (result) {
            if (result.success == true || result.success == 'true') {
                var callBackId = result.data ? result.data.callBackId : '';
                if (callBackId == 'callback1') {
                    window.location.reload();
                } else if (callBackId == 'callback2') {
                    XuntongJSBridge.call('selectPersons', { 'isMulti': 'true', 'pType': '1' }, function (result) {

                        if (typeof (result) == "string") {
                            result = JSON.parse(result);
                        }


                        noticeOpenIdArr = new Array();
                        if (result.success == true || result.success == "true") {

                            for (var i = 0; i < result.data.persons.length; i++) {

                                noticeOpenIdArr.push(result.data.persons[i].openId);

                            }
                            $("#noticeOpenId").val(noticeOpenIdArr);
                            //知会

                            $.ajax({
                                type: "POST",
                                url: "/api/bpm/PostAccount",
                                data: { "ids": noticeOpenIdArr },
                                beforeSend: function (XHR) {
                                    XHR.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem('ticket'));

                                }, success: function (data, status) {

                                    if (status == "success") {
                                        var accounts = new Array();
                                        var accName = new Array();
                                        for (var i = 0; i < data.data.length; i++) {
                                            accounts.push((String)(data.data[i].phone));
                                            accName.push(data.data[i].name);
                                        }
                                        //alert(JSON.stringify({ 'taskID': taskId, 'comments': '', 'accounts': accounts }));

                                        var btnArry = ["取消", "确定"];
                                        mui.confirm('将知会下列人员:' + accName, '知会通知', btnArry, function (e) {
                                            if (e.index == 1) {
                                                $.ajax({
                                                    type: "POST",
                                                    url: "/api/bpm/PostInform",
                                                    data: { 'taskID': taskId, 'comments': '', 'accounts': accounts },
                                                    dataType: "json",
                                                    beforeSend: function (XHR) {

                                                        XHR.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem('ticket'));

                                                    },
                                                    success: function (data, status) {

                                                        if (status == "success") {
                                                            mui.toast("知会成功");
                                                        }
                                                    }, error: function (e) {
                                                        //console.log(e);  

                                                    },
                                                    complete: function () { }


                                                });
                                            } else {

                                            }
                                        });


                                    }
                                }, error: function (e) {

                                }, complete: function () { }


                            });


                        }



                    });
                } else if (callBackId == 'callback3') {
                    getRecedableToSteps();
                }
            }
        });
        XuntongJSBridge.call('getPersonInfo', {}, function (result) {
            if (typeof (result) == "string") {
                result = JSON.parse(result);
            }

            if (result.success == true || result.success == "true") {
                if (typeof (result.data.userName) == "undefined") {
                    $('#myPhone').val("");
                } else {
                    $('#myPhone').val(result.data.userName);
                }
            }

        });
        initMsg(1);
    },

    _preAskOrDone: function () {
        XuntongJSBridge.call('setWebViewTitle', { 'title': '审批详情' });

        XuntongJSBridge.call('createPop', {
            'popTitle': '',
            'popTitleCallBackId': '1',
            'items': [
                { 'text': '知会', 'callBackId': 'callback1' },
                { 'text': '刷新', 'callBackId': 'callback2' }

            ],
            'menuList': [
                'openWithBrowser'
            ],

        }, function (result) {
            if (result.success == true || result.success == 'true') {
                var callBackId = result.data ? result.data.callBackId : '';
                if (callBackId == 'callback1') {

                    XuntongJSBridge.call('selectPersons', { 'isMulti': 'true', 'pType': '1' }, function (result) {



                        noticeOpenIdArr = new Array();
                        if (result.success == true || result.success == "true") {

                            for (var i = 0; i < result.data.persons.length; i++) {

                                noticeOpenIdArr.push(result.data.persons[i].openId);

                            }
                            $("#noticeOpenId").val(noticeOpenIdArr);
                            //知会

                            $.ajax({
                                type: "POST",
                                url: "/api/bpm/PostAccount",
                                data: { "ids": noticeOpenIdArr },
                                beforeSend: function (XHR) {
                                    XHR.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem('ticket'));

                                }, success: function (data, status) {

                                    if (status == "success") {
                                        var accounts = new Array();
                                        var accName = new Array();
                                        for (var i = 0; i < data.data.length; i++) {
                                            accounts.push((String)(data.data[i].phone));
                                            accName.push(data.data[i].name);
                                        }
                                        //alert(JSON.stringify({ 'taskID': taskId, 'comments': '', 'accounts': accounts }));

                                        var btnArry = ["取消", "确定"];
                                        mui.confirm('将知会下列人员:' + accName, '知会通知', btnArry, function (e) {
                                            if (e.index == 1) {
                                                $.ajax({
                                                    type: "POST",
                                                    url: "/api/bpm/PostInform",
                                                    data: { 'taskID': taskId, 'comments': '', 'accounts': accounts },
                                                    dataType: "json",
                                                    beforeSend: function (XHR) {

                                                        XHR.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem('ticket'));

                                                    },
                                                    success: function (data, status) {

                                                        if (status == "success") {
                                                            mui.toast("知会成功");
                                                        }
                                                    }, error: function (e) {
                                                        //console.log(e);

                                                    },
                                                    complete: function () { }


                                                });
                                            } else {

                                            }
                                        });


                                    }
                                }, error: function (e) {

                                }, complete: function () { }


                            });


                        }



                    });

                } else if (callBackId == 'callback2') {
                    window.location.reload();
                } else {

                }
            }

        });
        initMsg(0);

    }

    
}

//发起页面预加载部分页面信息
function prepMsg() {
    $("#fdate").val(getNowFormatDate(2));

    tapEvent();

    $.ajax({

        type: 'get',
        url: "/api/bpm/GetBPMParam",
        data: {},
        beforeSend: function (XHR) {
            XHR.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem('ticket'));
        },
        success: function (data, status) {
            if (status == "success") {
                //console.log(data);
                BPMOU = data.Position[0].FullName;

                var fareaStr = String(BPMOU).split("/");
                //将BPMOU://XX/XX/工号，获取倒数第二个，就是所在区域
                $("#fdept").val(fareaStr[fareaStr.length - 2]);

                return BPMOU;
            } else {
                return "";
            }
        },
        error: function (e) {
            return e;
        },

        complete: function () {
            return BPMOU;
        }

    });

}


//特殊行为部分，主要为点击事件的绑定和自动计算部分
function tapEvent() {
    $("#addItem").on('tap', function () {

        var li = '<div id="bl" class="mui-card">';
        li = li + '   <div class="mui-input-row bgc">';
        li = li + '        <label>明细列表项</label> ';
        li = li + '        <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '        <label for="fyhms">隐患描述<i style="color:red;">*</i></label>';
        li = li + '        <input type="text" id="fyhms" name="fyhms" value="" placeholder="请输入隐患描述"/> ';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '        <label for="fyhdl">隐患大类<i style="color:red;">*</i></label>';
        li = li + '        <input type="text" id="fyhdl" name="fyhdl" value="" placeholder="请选择隐患大类" readonly="readonly"/> ';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '        <label for="fyhxl">隐患小类<i style="color:red;">*</i></label>';
        li = li + '        <input type="text" id="fyhxl" name="fyhxl" value="" placeholder="请选择隐患小类" readonly="readonly"/> ';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '        <label for="fifcf">是否重复出现隐患<i style="color:red;">*</i></label>';
        li = li + '        <input type="text" id="fifcf" name="fifcf" value=""  placeholder="请选择是否重复出现隐患" readonly="readonly"/>';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '        <label for="fcfdh">重复隐患流程单号<i style="color:red;">*</i></label>';
        li = li + '        <input type="text" id="fcfdh" name="fcfdh" value="" placeholder="请输入隐患单号" />';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '        <label for="fptr">被检查单位陪同人<i style="color:red;">*</i></label>';
        li = li + '        <input type="text" id="fptr" name="fptr" value="" placeholder="请输入被检查单位陪同人" />';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '        <label for="ffsqy">发生区域<i style="color:red;">*</i></label>';
        li = li + '        <input type="text" id="ffsqy" name="ffsqy" value="" placeholder="请输入发生区域" />';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '        <label for="ftzdh">通知编号<i style="color:red;">*</i></label>';
        li = li + '        <input type="text" id="ftzdh" name="ftzdh" value="" placeholder="请输入通知编号" />';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '        <label for="fcldj">处理等级<i style="color:red;">*</i></label>';
        li = li + '        <input type="text" id="fcldj" name="fcldj" value=""  readonly="readonly"  placeholder="请选择处理等级"/>';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '        <label for="fknx">可能性<i style="color:red;">*</i></label>';
        li = li + '        <input type="text" id="fknx" name="fknx" value=""  readonly="readonly"  placeholder="请选择可能性"/>';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '        <label for="fyzd">严重度<i style="color:red;">*</i></label>';
        li = li + '        <input type="text" id="fyzd" name="fyzd" value=""  readonly="readonly"  placeholder="请选择严重度"/>';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '        <label for="ffxlb">风险类别<i style="color:red;">*</i></label>';
        li = li + '        <input type="text" id="ffxlb" name="ffxlb" value=""  readonly="readonly"  placeholder="请选择风险类别"/>';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '        <label for="fzgjy">整改建议<i style="color:red;">*</i></label>';
        li = li + '        <input type="text" id="fzgjy" name="fzgjy" value=""  placeholder="请输入整改建议"/>';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '        <label for="fxqrq">限期整改日期<i style="color:red;">*</i></label>';
        li = li + '        <input type="date" id="fxqrq" name="fxqrq" value=""  placeholder="请输入限期整改日期"/>';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '        <label for="fzgqk">整改情况<i style="color:red;">*</i></label>';
        li = li + '        <input type="text" id="fzgqk" name="fzgqk" value=""  placeholder="请输入整改情况"/>';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '        <label for="fifwc">是否整改完成<i style="color:red;">*</i></label>';
        li = li + '        <input type="text" id="fifwc" name="fifwc" value=""  placeholder="请选择是否整改完成" readonly="readonly"/>';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '        <label for="fifcq">是否超期<i style="color:red;">*</i></label>';
        li = li + '        <input type="text" id="fifcq" name="fifcq" value=""  placeholder="请选择是否超期" readonly="readonly"/>';
        li = li + '   </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '        <label for="fcqyy">超期原因<i style="color:red;">*</i></label>';
        li = li + '        <input type="text" id="fcqyy" name="fcqyy" value=""  placeholder="请输入超期原因"/>';
        li = li + '   </div>';

        li = li + '  <div class="mui-input-row" style="height:7rem;overflow:scroll;" id="uploaddiv">';
        li = li + '     <div class="border border-t upload-img" style="top:0rem;">';
        li = li + '         <div class="clearfix upload-btn" id="children-bg">';
        li = li + '            <label class="label">整改前照片</label>';
        li = li + '            <span class="tips" id="imageCount"><!--已添加0张--></span>';
        li = li + '            <span class="upload-addbtn">';
        li = li + '                 <input type="file" accept="image/jpeg,image/jpg,image/png,image/jp2,image/bmp" id="file" style="opacity:0;">';
        li = li + '            </span>';
        li = li + '          </div>';
        li = li + '          <div class="upload-img-list"  id="aimlist"></div>';
        li = li + '         </div>';
        li = li + '     </div>';
        li = li + '   <div class="mui-input-row">';
        li = li + '        <label for="fbz">备注<i style="color:red;">*</i></label>';
        li = li + '        <input type="text" id="fbz" name="fbz" value="" placeholder="请输入备注"/>';
        li = li + '   </div>';
        li = li + '   </div>';


        $("#jclist").append(li);



        showPickerByZepto('#jclist', '#fcldj', fcldjdata);
        showPickerByZepto('#jclist', '#fknx', fknxdata);
        showPickerByZepto('#jclist', '#fyzd', fyzddata);
        showPickerByZepto('#jclist', '#ffxlb', ffxlbdata);
        showPickerByZepto('#jclist', '#fifwc', fifwcdata);

        var picker_dl = new mui.PopPicker({
            layer: 2
        });
        picker_dl.setData(fyhdldata);
        $("#jclist").find("#fyhdl").each(function () {

            var self = this;
            $(this).off('tap');
            $(this).on('tap', function () {

                picker_dl.show(function (items) {
                    self.value = (items[0].text);
                    $(self).parent().parent().find("#fyhxl").val(items[1].text);
                });
            });
        });

        var picker_cf = new mui.PopPicker();
        picker_cf.setData(fifcfdata);
        $("#jclist").find("#fifcf").each(function () {

            var self = this;
            $(this).off('tap');
            $(this).on('tap', function () {

                picker_cf.show(function (items) {
                    self.value = (items[0].text);
                    if (items[0].text == "否"){
                        $(self).parent().parent().find("#fcfdh").attr("readonly", "readonly");
                        $(self).parent().parent().find("#fcfdh").removeAttr("placeholder");
                    } else {
                        $(self).parent().parent().find("#fcfdh").attr("placeholder", "请输入重复隐患流程单号");
                        $(self).parent().parent().find("#fcfdh").removeAttr("readonly");
                    }
                });
            });
        });
        var picker_cq = new mui.PopPicker();
        picker_cq.setData(fifcqdata);
        $("#jclist").find("#fifcq").each(function () {

            var self = this;
            $(this).off('tap');
            $(this).on('tap', function () {

                picker_cq.show(function (items) {
                    self.value = (items[0].text);
                    if (items[0].text == "否") {
                        $(self).parent().parent().find("#fcqyy").attr("readonly", "readonly");
                        $(self).parent().parent().find("#fcqyy").removeAttr("placeholder");
                    } else {
                        $(self).parent().parent().find("#fcqyy").attr("placeholder", "请输入超期原因");
                        $(self).parent().parent().find("#fcqyy").removeAttr("readonly");
                    }
                });
            });
        });
    });
    var fifwcdata = [
        {
            value: 'yes',
            text: '是'
        }, {
            value: 'no',
            text: '否'
        }
    ];
    var ffxlbdata = [
        {
            value: 'yb',
            text: '一般风险'
        }, {
            value: 'zd',
            text: '中度风险'
        }, {
            value: 'zdfx',
            text: '重大风险'
        }
    ];
    var fyzddata = [
        {
            value: '1',
            text: '1'
        }, {
            value: '2',
            text: '2'
        }, {
            value: '3',
            text: '3'
        }, {
            value: '4',
            text: '4'
        }, {
            value: '5',
            text: '5'
        }
    ];
    var fknxdata = [
        {
            value: '1',
            text: '1'
        }, {
            value: '2',
            text: '2'
        }, {
            value: '3',
            text: '3'
        }, {
            value: '4',
            text: '4'
        }, {
            value: '5',
            text: '5'
        }
    ];
    var fcldjdata = [
        {
            value: 'jg',
            text: '警告'
        }, {
            value: 'tz',
            text: '通知'
        }, {
            value: 'tg',
            text: '停工'
        }
    ];
    var fifcqdata = [
        {
            value: 'yes',
            text: '是'
        }, {
            value: 'no',
            text: '否'
        }
    ];
    var fifcfdata = [
        {
            value: 'yes',
            text:'是'
        }, {
            value: 'no',
            text:'否'
        }
    ];
    var fyhdldata = [
        {
            value: 'jcgl',
            text: '基础管理类隐患',
            children: [
                {
                    value: 'zzzz',
                    text: '资质证照类隐患'
                }, {
                    value: 'gljg',
                    text: '安全生产管理机构及人员类隐患'
                }, {
                    value: 'zrz',
                    text: '安全生产责任制类隐患'
                }, {
                    value: 'glzd',
                    text: '安全生产管理制度类隐患'
                }, {
                    value: 'czgc',
                    text: '安全操作规程类隐患'
                }, {
                    value: 'jypx',
                    text: '教育培训类隐患'
                }, {
                    value: 'glda',
                    text: '安全生产管理档案类隐患'
                }, {
                    value: 'sctr',
                    text: '安全生产投入类隐患'
                }, {
                    value: 'yjgl',
                    text: '应急管理类隐患'
                }, {
                    value: 'tzsb',
                    text: '特种设备基础管理类隐患'
                }, {
                    value: 'zyws',
                    text: '职业卫生基础管理类隐患'
                }, {
                    value: 'xgfjc',
                    text: '相关方基础管理类隐患'
                }, {
                    value: 'qtjc',
                    text: '其他基础管理类隐患'
                }
            ]
        }, {
            value: 'xcgll',
            text: '现场管理类隐患',
            children: [
                {
                    value: 'tzsbxc',
                    text: '特种设备现场管理类'
                }, {
                    value: 'scsb',
                    text: '生产设备设施及工艺类'
                }, {
                    value: 'cshj',
                    text: '场所环境类类'
                }, {
                    value: 'cyry',
                    text: '从业人员操作行为类'
                }, {
                    value: 'xfaq',
                    text: '消防安全类隐患'
                }, {
                    value: 'ydaq',
                    text: '用电安全类隐患'
                }, {
                    value: 'zyws',
                    text: '职业卫生现场安全类隐患'
                }, {
                    value: 'xkzy',
                    text: '许可作业审批'
                }, {
                    value: 'fzxt',
                    text: '辅助系统动力类隐患'
                }, {
                    value: 'xgf',
                    text: '相关方现场管理类隐患'
                }, {
                    value: 'qtyh',
                    text: '其他隐患'
                }
            ]

        }

    ];
    var fzgsdata = [
        {
            value: 'yyzp',
            text: '医用制品公司',
            children: [
                {
                    value: 'cxq',
                    text: '采血器分公司'
                },
                {
                    value: 'lq',
                    text: '滤器分公司'
                },
                {
                    value: 'mj',
                    text: '灭菌分公司'
                },
                {
                    value: 'ms',
                    text: '模塑分公司'
                },
                {
                    value: 'syq',
                    text: '输液器公司'
                },
                {
                    value: 'yyqx',
                    text: '医用器械分公司'
                },
                {
                    value: 'yyzpgs',
                    text: '医用制品公司本部'
                },
                {
                    value: 'zsq',
                    text: '注射器分公司'
                },
                {
                    value: 'zysyq',
                    text: '专用输液器分公司'
                },
                {
                    value: 'tzdg',
                    text: '特种导管分公司'
                }
            ]
        },
        {
            value: 'jr',
            text: '洁瑞医用制品公司',
            children: [
                {
                    value: 'bz',
                    text: '包装分公司'
                },
                {
                    value: 'fl',
                    text: '敷料分公司'
                },
                {
                    value: 'jmzg',
                    text: '精密制管分公司'
                },
                {
                    value: 'yf',
                    text: '研发分公司'
                },
                {
                    value: 'yl',
                    text: '原料分公司'
                },
                {
                    value: 'zzp',
                    text: '针制品分公司'
                },
                {
                    value: 'zz',
                    text: '制针分公司'
                },
                {
                    value: 'jryyzpgsbb',
                    text: '洁瑞医用制品公司本部'
                }

            ]
        },
        {
            value: 'fs',
            text: '富森医用材料公司',
            children: [
                {
                    value: ' ',
                    text: ' '
                }
            ]
        },
        {
            value: 'sxjs',
            text: '输血技术装备公司',
            children: [
                {
                    value: 'sxqc',
                    text: '输血器材分公司'
                },
                {
                    value: 'xyjs',
                    text: '血液技术分公司'
                }

            ]
        },
        {
            value: 'ypbz',
            text: '药品包装制品公司',
            children: [
                {
                    value: 'cgzsq',
                    text: '冲管注射器分公司'
                }

            ]
        },
        {
            value: 'yycl',
            text: '医用材料公司',
            children: [
                
                {
                    value: ' ',
                    text: ' '
                }
            ]
        },
        {
            value: 'ylxt',
            text: '医疗系统公司',
            children: [
               
                {
                    value: ' ',
                    text: ' '
                }
            ]
        },
        {
            value: 'hs',
            text: '海盛设备公司',
            children: [
                {
                    value: ' ',
                    text: ' '
                }
            ]
        },
        {
            value: 'mj',
            text: '模具公司',
            children: [
                {
                    value: ' ',
                    text: ' '
                }
            ]
        },
        {
            value: 'lzz',
            text: '留置针公司',
            children: [
                {
                    value: ' ',
                    text: ' '
                }
            ]
        },
        {
            value: 'wm',
            text: '外贸公司',
            children: [
                {
                    value: ' ',
                    text: ' '
                }
            ]
        },
        {
            value: 'wrwk',
            text: '威瑞外科医用制品公司',
            children: [
                {
                    value: ' ',
                    text: ' '
                }
            ]
        },
        {
            value: 'ypbz',
            text: '新生医疗器械公司',
            children: [
                {
                    value: ' ',
                    text: ' '
                }
            ]
        },
        {
            value: 'zdh',
            text: '自动化设备公司',
            children: [
                {
                    value: ' ',
                    text: ' '
                }
            ]
        },
        {
            value: 'js',
            text: '洁盛公司',
            children: [
                {
                    value: ' ',
                    text: ' '
                }
            ]
        },
        {
            value: 'yyzpjtbb',
            text: '医疗制品集团本部',
            children: [
                {
                    value: 'dlzx',
                    text: '动力中心'
                },
                {
                    value: 'ccpsb',
                    text: '仓储配送部'
                }

            ]
        }
    ];
    var element_zgs = document.getElementById("fzgs");
    var element_fgs = document.getElementById("ffgs");

    var picker = new mui.PopPicker({
        layer: 2
    });

    picker.setData(fzgsdata);

    element_zgs.addEventListener('tap', function () {

        picker.show(function (items) {

            element_zgs.value = items[0].text;
            element_fgs.value = items[1].text;
        });

    }, false);


}



var fjArrayErDimension_before = new Array();
var fjArrayErDimension_after = new Array();
var fjArray_after = new Array();
var action = "同意";
//根据状态加载页面信息
function initMsg(flag) {

    //flag为false时，状态为申请或者已办，只有tid，为true时，状态为待办，有tid和pid
    var url = window.location.href;
    if (flag) {

        if (url != null && url.indexOf("tid") != -1 && url.indexOf("pid") != -1) {


            taskId = url.substring(url.indexOf("=") + 1, url.indexOf("&"));
            if (url.split("pid=")[1].indexOf("ticket") != -1) {
                stepId = url.split("pid=")[1];
                stepId = stepId.split("&ticket")[0];
                var ticket = url.split("=")[3];
                localStorage.setItem('ticket', ticket);
            } else {
                stepId = url.split("pid=")[1];
            }


        } else {
            mui.toast("网络异常,请稍后重试");
            history.go(-1);

        }


    } else {

        if (url != null && url.indexOf("tid") != -1) {

            taskId = url.split("tid=")[1];


        } else {
            mui.toast("网络异常,请稍后重试");
            history.go(-1);

        }

    }
    itemidArr = new Array();
    $.ajax({
        type: "get",
        url: "/api/bpm/GetTaskData",
        data: { 'taskId': taskId },
        beforeSend: function (XHR) {
            XHR.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem('ticket'));
        }
    }).done(function (data) {
        console.log(data);

        var item = data.FormDataSet.BPM_YYZPJTAQZHJCCCFK_A[0];

        //待办特殊操作
        if (flag) {
            
            $("#taskId").val(item.TaskID);
            $("#stepId").val(stepId);
            $("#fbillno").val(item.fbillno);
        }
        $("#fname").val(item.fname);
        $("#fdate").val(FormatterTimeYMS(item.fdate));
        $("#fdept").val(item.fdept);
        $("#ftel").val(item.ftel);
        $("#fzgs").val(item.fzgs);
        $("#ffgas").val(item.ffgas);
        var bli = data.FormDataSet.BPM_YYZPJTAQZHJCCCFK_B;
        for (var i = 0; i < bli.length; i++) {

            itemidArr.push(bli[i].itemd);
            var li = '<div id="bl" class="mui-card">';
            li = li + '   <div class="mui-input-row bgc">';
            li = li + '        <label>明细列表项</label> ';
            li = li + '        <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>';
            li = li + '   </div>';
            li = li + '   <div class="mui-input-row">';
            li = li + '        <label for="fyhms">隐患描述<i style="color:red;">*</i></label>';
            li = li + '        <input type="text" id="fyhms" name="fyhms" value="' + bli[i].fyhms + '" readonly="readonly"/> ';
            li = li + '   </div>';
            li = li + '   <div class="mui-input-row">';
            li = li + '        <label for="fyhdl">隐患大类<i style="color:red;">*</i></label>';
            li = li + '        <input type="text" id="fyhdl" name="fyhdl" value="' + bli[i].fyhdl + '" readonly="readonly"/> ';
            li = li + '   </div>';
            li = li + '   <div class="mui-input-row">';
            li = li + '        <label for="fyhxl">隐患小类<i style="color:red;">*</i></label>';
            li = li + '        <input type="text" id="fyhxl" name="fyhxl" value="' + bli[i].fyhxl + '" readonly="readonly"/> ';
            li = li + '   </div>';
            li = li + '   <div class="mui-input-row">';
            li = li + '        <label for="fifcf">是否重复出现隐患<i style="color:red;">*</i></label>';
            li = li + '        <input type="text" id="fifcf" name="fifcf" value="' + bli[i].fifcf + '" readonly="readonly"/> ';
            li = li + '   </div>';
            li = li + '   <div class="mui-input-row">';
            li = li + '        <label for="fcfdh">重复隐患流程单号<i style="color:red;">*</i></label>';
            li = li + '        <input type="text" id="fcfdh" name="fcfdh" value="' + bli[i].fcfdh + '" readonly="readonly" />';
            li = li + '   </div>';
            li = li + '   <div class="mui-input-row">';
            li = li + '        <label for="fptr">被检查单位陪同人<i style="color:red;">*</i></label>';
            li = li + '        <input type="text" id="fptr" name="fptr" value="' + bli[i].fptr + '" readonly="readonly"/>';
            li = li + '   </div>';
            li = li + '   <div class="mui-input-row">';
            li = li + '        <label for="ffsqy">发生区域<i style="color:red;">*</i></label>';
            li = li + '        <input type="text" id="ffsqy" name="ffsqy" value="' + bli[i].ffsqy + '" readonly="readonly" />';
            li = li + '   </div>';
            li = li + '   <div class="mui-input-row">';
            li = li + '        <label for="ftzdh">通知编号<i style="color:red;">*</i></label>';
            li = li + '        <input type="text" id="ftzdh" name="ftzdh" value="' + bli[i].ftzdh + '" readonly="readonly"/>';
            li = li + '   </div>';
            li = li + '   <div class="mui-input-row">';
            li = li + '        <label for="fcldj">处理等级<i style="color:red;">*</i></label>';
            li = li + '        <input type="text" id="fcldj" name="fcldj" value="' + bli[i].fcldj + '" readonly="readonly"/>';
            li = li + '   </div>';
            li = li + '   <div class="mui-input-row">';
            li = li + '        <label for="fknx">可能性<i style="color:red;">*</i></label>';
            li = li + '        <input type="text" id="fknx" name="fknx" value="' + bli[i].fknx + '" readonly="readonly"/>';
            li = li + '   </div>';
            li = li + '   <div class="mui-input-row">';
            li = li + '        <label for="fyzd">严重度<i style="color:red;">*</i></label>';
            li = li + '        <input type="text" id="fyzd" name="fyzd" value="' + bli[i].fyzd + '" readonly="readonly"/>';
            li = li + '   </div>';
            li = li + '   <div class="mui-input-row">';
            li = li + '        <label for="ffxlb">风险类别<i style="color:red;">*</i></label>';
            li = li + '        <input type="text" id="ffxlb" name="ffxlb" value="' + bli[i].ffxlb + '" readonly="readonly"/>';
            li = li + '   </div>';
            li = li + '   <div class="mui-input-row">';
            li = li + '        <label for="fzgjy">整改建议<i style="color:red;">*</i></label>';
            li = li + '        <input type="text" id="fzgjy" name="fzgjy" value="' + bli[i].fzgjy + '" readonly="readonly"/>';
            li = li + '   </div>';
            li = li + '   <div class="mui-input-row">';
            li = li + '        <label for="fxqrq">限期整改日期<i style="color:red;">*</i></label>';
            li = li + '        <input type="date" id="fxqrq" name="fxqrq" value="' + FormatterTimeYMS(bli[i].fxqrq) + '" readonly="readonly"/>';
            li = li + '   </div>';
            li = li + '   <div class="mui-input-row">';
            li = li + '        <label for="fzgqk">整改情况<i style="color:red;">*</i></label>';
            li = li + '        <input type="text" id="fzgqk" name="fzgqk" value="' + bli[i].fzgqk + '" readonly="readonly"/>';
            li = li + '   </div>';
            li = li + '   <div class="mui-input-row">';
            li = li + '        <label for="fifwc">是否整改完成<i style="color:red;">*</i></label>';
            li = li + '        <input type="text" id="fifwc" name="fifwc" value="' + bli[i].fifwc + '" readonly="readonly"/>';
            li = li + '   </div>';
            li = li + '   <div class="mui-input-row">';
            li = li + '        <label for="fifcq">是否超期<i style="color:red;">*</i></label>';
            li = li + '        <input type="text" id="fifcq" name="fifcq" value="' + bli[i].fifcq + '" readonly="readonly"/>';
            li = li + '   </div>';
            li = li + '   <div class="mui-input-row">';
            li = li + '        <label for="fcqyy">超期原因<i style="color:red;">*</i></label>';
            li = li + '        <input type="text" id="fcqyy" name="fcqyy" value="' + bli[i].fcqyy + '" readonly="readonly"/>';
            li = li + '   </div>';
            li = li + '  <div class="mui-input-row" style="height:7rem;overflow:scroll;" id="uploaddiv">';
            li = li + '     <div class="border border-t upload-img" style="top:0rem;">';
            li = li + '         <div class="clearfix upload-btn" id="children-bg">';
            li = li + '            <label class="label">整改前照片<i style="color:red;">*</i></label>';
            li = li + '            <span class="tips" id="imageCount"><!--已添加0张--></span>';
            li = li + '            <span class="upload-addbtn" style="display:none;">';
            li = li + '                 <input type="file" accept="image/jpeg,image/jpg,image/png,image/jp2,image/bmp" id="file" style="opacity:0;">';
            li = li + '            </span>';
            li = li + '          </div>';
            li = li + '          <div class="upload-img-list" id="div' + i + '"></div>';
            li = li + '         </div>';
            li = li + '     </div>';
            li = li + '  <div class="mui-input-row" style="height:7rem;overflow:scroll;" id="uploaddiv">';
            li = li + '     <div class="border border-t upload-img" style="top:0rem;">';
            li = li + '         <div class="clearfix upload-btn" id="children-bg">';
            li = li + '            <label class="label">整改后照片<i style="color:red;">*</i></label>';
            li = li + '            <span class="tips" id="imageCount"><!--已添加0张--></span>';
            li = li + '            <span class="upload-addbtn" style="display:none;">';
            li = li + '                 <input type="file" accept="image/jpeg,image/jpg,image/png,image/jp2,image/bmp" id="file" style="opacity:0;">';
            li = li + '            </span>';
            li = li + '          </div>';
            li = li + '          <div class="upload-img-list-after" id="div' + i + '"></div>';
            li = li + '         </div>';
            li = li + '     </div>';
            li = li + '   <div class="mui-input-row">';
            li = li + '        <label for="fbz">备注<i style="color:red;">*</i></label>';
            li = li + '        <input type="text" id="fbz" name="fbz" value="' + changeNullToEmpty(bli[i].fbz) + '" readonly="readonly"/>';
            li = li + '   </div>';
            $("#jclist").append(li);
            n = i;
            if (bli[i].fzgqzp != null && bli[i].fzgqzp != "") {
                var fjtmp = (String)(bli[i].fzgqzp);

                fjArray = fjtmp.split(";");
                fjArrayErDimension_before.push(fjArray);
                //请求附件详细信息
                $.ajax({
                    type: 'POST',
                    url: '/api/bpm/GetAttachmentsInfo',
                    data: { 'fileIds': fjArray },
                    beforeSend: function (XHR) {
                        XHR.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem('ticket'));
                    },
                    success: function (data, status) {
                        if (status == "success") {

                            console.log(data);

                            for (var i = 0; i < data.length; i++) {

                                var name = data[i].Name;
                                var type = (data[i].Ext).replace(".", "");
                                var size = String(data[i].Size);

                                var time = String(data[i].LastUpdate).replace("T", " ");
                                var downurl = 'http://app.weigaogroup.com:8040/BPM/YZSoft/Attachment/default.ashx?' + data[i].FileID;
                                var attach = attachItem(name, type, size, time, downurl);
                                attachArray.push(attach);



                                var li = '<div class="pic-preview smallyulan success">';
                                li = li + ' <div class="del none" style="opacity:1;z-index:999;"onclick="delPicture(this)">x</div>';

                                //类型判断
                                if ((data[i].Ext).indexOf("png") != -1 || (data[i].Ext).indexOf("jpg") != -1 || (data[i].Ext).indexOf("bmp") != -1) {

                                    li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '" ><img src="http://app.weigaogroup.com:8040/BPM/YZSoft/Attachment/default.ashx?' + data[i].FileID + '"/></div>';
                                    //li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '" ><img src="http://172.16.7.7/BPM/YZSoft/Attachment/default.ashx?201709180005"/></div>';

                                } else if ((data[i].Ext).indexOf("xls") != -1) {

                                    li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '"><img src="../../../../Content/images/xlsx@2x.png"/></div>';

                                } else if ((data[i].Ext).indexOf("doc") != -1) {

                                    li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '"><img src="../../../../Content/images/docx@2x.png"/></div>';

                                } else if ((data[i].Ext).indexOf("ppt") != -1) {

                                    li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '"><img src="../../../../Content/images/ppt@2x.png"/></div>';

                                } else if ((data[i].Ext).indexOf("pdf") != -1) {

                                    li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '"><img src="../../../../Content/images/pdf@2x.png"/></div>';

                                } else if ((data[i].Ext).indexOf("zip") != -1 || (data[i].Ext).indexOf("rar") != -1 || (data[i].Ext).indexOf("7z") != -1) {

                                    li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '"><img src="../../../../Content/images/zip@2x.png"/></div>';

                                } else if ((data[i].Ext).indexOf("txt") != -1) {

                                    li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '"><img src="../../../../Content/images/txt@2x.png"/></div>';

                                } else {
                                    li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '"><img src="../../../../Content/images/unkown@2x.png"/></div>';
                                }

                                li = li + ' </div>';
                                li = li + '</div>';

                                $('#jclist').find(".upload-img-list").each(function (index, element) {
                                    //console.log(index);

                                    if (String($(this)[0].id).indexOf(n) != -1) {

                                        $(this).append(li);
                                    }


                                });


                                $(".imgdiv").each(function () {

                                    $(this).parent().find(".del.none").hide();

                                });


                            }
                            watch();
                            $(".imgdiv").off('tap');
                            $(".imgdiv").on('tap', function () {
                                console.log($(this)[0].id);
                                XuntongJSBridge.call('showFile', {
                                    'fileName': attachArray[$(this)[0].id].name,
                                    'fileExt': attachArray[$(this)[0].id].type,
                                    'fileTime': attachArray[$(this)[0].id].time,
                                    'fileSize': attachArray[$(this)[0].id].size,
                                    'fileDownloadUrl': attachArray[$(this)[0].id].downurl
                                }, function (result) {
                                    //alert(JSON.stringify(result));
                                });
                            });


                        }

                    }, error: function (e) {
                        console.log(e);

                    }, complete: function () {

                    }

                });

            }
            if (bli[i].fzghzp != null && bli[i].fzghzp != "") {
                var fjtmp = (String)(bli[i].fzghzp);

                fjArray_after = fjtmp.split(";");
                fjArrayErDimension_after.push(fjArray_after);
                //请求附件详细信息
                $.ajax({
                    type: 'POST',
                    url: '/api/bpm/GetAttachmentsInfo',
                    data: { 'fileIds': fjArray_after },
                    beforeSend: function (XHR) {
                        XHR.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem('ticket'));
                    },
                    success: function (data, status) {
                        if (status == "success") {

                            console.log(data);
                            var attachArray_after = new Array();
                            for (var i = 0; i < data.length; i++) {

                                var name = data[i].Name;
                                var type = (data[i].Ext).replace(".", "");
                                var size = String(data[i].Size);

                                var time = String(data[i].LastUpdate).replace("T", " ");
                                var downurl = 'http://app.weigaogroup.com:8040/BPM/YZSoft/Attachment/default.ashx?' + data[i].FileID;
                                var attach = attachItem(name, type, size, time, downurl);
                                attachArray_after.push(attach);



                                var li = '<div class="pic-preview smallyulan success">';
                                li = li + ' <div class="del none" style="opacity:1;z-index:999;"onclick="delPicture(this)">x</div>';

                                //类型判断
                                if ((data[i].Ext).indexOf("png") != -1 || (data[i].Ext).indexOf("jpg") != -1 || (data[i].Ext).indexOf("bmp") != -1) {

                                    li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '" ><img src="http://app.weigaogroup.com:8040/BPM/YZSoft/Attachment/default.ashx?' + data[i].FileID + '"/></div>';
                                    //li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '" ><img src="http://172.16.7.7/BPM/YZSoft/Attachment/default.ashx?201709180005"/></div>';

                                } else if ((data[i].Ext).indexOf("xls") != -1) {

                                    li = li + '    <div class="img-wrap smallimg imgdivafter" id="' + i + '"><img src="../../../../Content/images/xlsx@2x.png"/></div>';

                                } else if ((data[i].Ext).indexOf("doc") != -1) {

                                    li = li + '    <div class="img-wrap smallimg imgdivafter" id="' + i + '"><img src="../../../../Content/images/docx@2x.png"/></div>';

                                } else if ((data[i].Ext).indexOf("ppt") != -1) {

                                    li = li + '    <div class="img-wrap smallimg imgdivafter" id="' + i + '"><img src="../../../../Content/images/ppt@2x.png"/></div>';

                                } else if ((data[i].Ext).indexOf("pdf") != -1) {

                                    li = li + '    <div class="img-wrap smallimg imgdivafter" id="' + i + '"><img src="../../../../Content/images/pdf@2x.png"/></div>';

                                } else if ((data[i].Ext).indexOf("zip") != -1 || (data[i].Ext).indexOf("rar") != -1 || (data[i].Ext).indexOf("7z") != -1) {

                                    li = li + '    <div class="img-wrap smallimg imgdivafter" id="' + i + '"><img src="../../../../Content/images/zip@2x.png"/></div>';

                                } else if ((data[i].Ext).indexOf("txt") != -1) {

                                    li = li + '    <div class="img-wrap smallimg imgdivafter" id="' + i + '"><img src="../../../../Content/images/txt@2x.png"/></div>';

                                } else {
                                    li = li + '    <div class="img-wrap smallimg imgdivafter" id="' + i + '"><img src="../../../../Content/images/unkown@2x.png"/></div>';
                                }

                                li = li + ' </div>';
                                li = li + '</div>';

                                $('#jclist').find(".upload-img-list-after").each(function (index, element) {
                                    //console.log(index);

                                    if (String($(this)[0].id).indexOf(n) != -1) {

                                        $(this).append(li);
                                    }


                                });


                                $(".imgdivafter").each(function () {

                                    $(this).parent().find(".del.none").hide();

                                });


                            }
                            watch();
                            $(".imgdivafter").off('tap');
                            $(".imgdivafter").on('tap', function () {
                                console.log($(this)[0].id);
                                XuntongJSBridge.call('showFile', {
                                    'fileName': attachArray_after[$(this)[0].id].name,
                                    'fileExt': attachArray_after[$(this)[0].id].type,
                                    'fileTime': attachArray_after[$(this)[0].id].time,
                                    'fileSize': attachArray_after[$(this)[0].id].size,
                                    'fileDownloadUrl': attachArray_after[$(this)[0].id].downurl
                                }, function (result) {
                                    //alert(JSON.stringify(result));
                                });
                            });


                        }

                    }, error: function (e) {
                        console.log(e);

                    }, complete: function () {

                    }

                });

            }
        }
        
        for (var i = 0; i < data.Steps.length; i++) {

            if (data.Steps[i].FinishAt == "0001-01-01T00:00:00") {
                data.Steps[i].FinishAt = "";
            }
            var time = FormatterTime(data.Steps[i].FinishAt);

            var stepName = data.Steps[i].NodeName;
            if (data.Steps[i].NodeName == "sysInform") {
                stepName = "知会";
            } else if (data.Steps[i].NodeName == "sysTaskOpt") {
                stepName = "任务操作";
            } else if (data.Steps[i].NodeName == "开始") {
                stepName = "开始";
            }

            var stepAction = locationAction(data.Steps[i].SelAction);
            if (data.Steps[i].SelAction == "sysInform") {
                stepAction = "发起知会";
            } else if (data.Steps[i].SelAction == "Submit") {
                stepAction = "已阅";
            } else if (data.Steps[i].SelAction == "null" || data.Steps[i].SelAction == null) {
                stepAction = "待处理";
            } else if (data.Steps[i].SelAction == "sysReject") {
                stepAction = "拒绝";
            } else if (data.Steps[i].SelAction == "sysRecedeRestart") {
                stepAction = "退回重填";
            }


            var contents = data.Steps[i].Comments;
            if (contents == null) {
                contents = "无";
            }
            //判断是否是加签
            if (data.Steps[i].IsConsignStep == false) {
                var li = ' <li>';
                li = li + '  <span class="lefttime"><i></i>' + time + '</span>';
                li = li + '  <div class="righttext">';
                li = li + '     <div>';
                li = li + '        <div class="flowmsg">' + stepName + '<span>' + data.Steps[i].RecipientFullName + '</span></div>';
                li = li + '        <label class="flowstatus">' + stepAction + '</label>';
                li = li + '        <p>签核意见: ' + contents + '</p>';
                li = li + '     </div>';
                li = li + '   </div>';
                li = li + '</li>';

            } else {
                var li = ' <li>';
                li = li + '  <span class="lefttime"><i></i>' + time + '</span>';
                li = li + '  <div class="righttext">';
                li = li + '     <div>';
                li = li + '        <div class="flowmsg signadd">加签<span>' + data.Steps[i].RecipientFullName + '</span></div>';
                li = li + '        <label class="flowstatus">' + stepAction + '</label>';
                li = li + '        <p>签核意见: ' + contents + '</p>';
                li = li + '     </div>';
                li = li + '   </div>';
                li = li + '</li>';

            }
            $("#signff").append(li);
        }
        if (flag) {
            nodeController(data);
        }

    }).fail(function (e) {

    });

}

function nodeController(data) {
    if ($('#myPhone').val() == "") {
        var myPhone = String(BPMOU).split("/");
        $('#myPhone').val(String(myPhone[myPhone.length - 1]));

    }
    var NodeName;
    var ShareNode;
    //判断流程本节点是否结束，处理者是否为当前用户,
    //流程步骤是否是传过来的流程步骤，再根据这三项查出对应的节点名称
    for (var i = 0; i < data.Steps.length; i++) {
        //debugger;

        if (data.Steps[i].Finished == false && data.Steps[i].RecipientAccount == ($('#myPhone').val())) {


            if (stepId.indexOf(data.Steps[i].StepID) != -1) {

                NodeName = data.Steps[i].NodeName;
                NodeName_before = data.Steps[i - 1].NodeName;
                if (data.Steps[i].Share && !data.Steps[i].OwnerAccount) {
                    ShareNode = '流程被共享';
                } else if (data.Steps[i].Share && data.Steps[i].OwnerAccount) {
                    ShareNode = '流程被取出';
                }
            }

        }

    }
    $("#nodeName").val(NodeName);
    if (NodeName == "开始") {
        $("#createD").css("display", "block");
        $("#csd").css("display", "none");
        mui.alert("暂不支持发起功能");
        
    } else if (NodeName == "sysInform") {
        $("#readD").css("display", "block");
        $("#csd").css("display", "none");

    } else {
        if (typeof (NodeName) != "undefined") {
            $("#approvalD").css("display", "block");
            if (NodeName == "安全技术部经理确认" || NodeName == "子公司安全员") {
                action = "确认";
                $("#agreebt").text("确认");
            } else if (NodeName == "子公司安全负责人") {
                if (NodeName_before == "子公司安全员确认") {
                    $("#approvalD").empty();
                    var li = '&nbsp;&nbsp;';
                    li = li + ' <button class="mui-btn mui-btn-primary" type="button" style="width:25%" id="agreebt" onclick="showConfirm()">通过</button> &nbsp;&nbsp;&nbsp;';
                    li = li + ' <button class="mui-btn mui-btn-yellow" type="button" style="width:25%" id="refusebt" onclick="showConfirm()">不通过</button> &nbsp;&nbsp;&nbsp;';
                    li = li + ' <button class="mui-btn mui-btn-danger" type="button" style="width:25%" id="disagreebt" onclick="reject()">拒绝</button> &nbsp;&nbsp;&nbsp;';
                    $("#approvalD").append(li);
                    $("#agreebt").on('tap', function () {
                        action = '通过';
                    });
                    $("#refusebt").on('tap', function () {
                        action = '不通过';
                    });
                } else {
                    action = "确认";
                    $("#agreebt").text("确认");
                }
            } else if (NodeName == "子公司安全负责人确认" || NodeName == "分公司分管经理确认"){
                $("#approvalD").empty();
                var li = '&nbsp;&nbsp;';
                li = li + ' <button class="mui-btn mui-btn-primary" type="button" style="width:25%" id="agreebt" onclick="showConfirm()">通过</button> &nbsp;&nbsp;&nbsp;';
                li = li + ' <button class="mui-btn mui-btn-yellow" type="button" style="width:25%" id="refusebt" onclick="showConfirm()">不通过</button> &nbsp;&nbsp;&nbsp;';
                li = li + ' <button class="mui-btn mui-btn-danger" type="button" style="width:25%" id="disagreebt" onclick="reject()">拒绝</button> &nbsp;&nbsp;&nbsp;';
                $("#approvalD").append(li);
                $("#agreebt").on('tap', function () {
                    action = '通过';
                });
                $("#refusebt").on('tap', function () {
                    action = '不通过';
                });
            } else if (NodeName == "安全工程师确认") {
                if (NodeName_before == "子公司安全负责人") {
                    $("#approvalD").empty();
                    var li = '&nbsp;&nbsp;';
                    li = li + ' <button class="mui-btn mui-btn-primary" type="button" style="width:25%" id="agreebt" onclick="showConfirm()">通过</button> &nbsp;&nbsp;&nbsp;';
                    li = li + ' <button class="mui-btn mui-btn-yellow" type="button" style="width:25%" id="refusebt" onclick="showConfirm()">不通过</button> &nbsp;&nbsp;&nbsp;';
                    li = li + ' <button class="mui-btn mui-btn-danger" type="button" style="width:25%" id="disagreebt" onclick="reject()">拒绝</button> &nbsp;&nbsp;&nbsp;';
                    $("#approvalD").append(li);
                    $("#agreebt").on('tap', function () {
                        action = '通过';
                    });
                    $("#refusebt").on('tap', function () {
                        action = '不通过';
                    });
                } else {
                    $("#approvalD").empty();
                    var li = '&nbsp;&nbsp;';
                    li = li + ' <button class="mui-btn mui-btn-primary" type="button" style="width:25%" id="agreebt" onclick="showConfirm()">整改符合</button> &nbsp;&nbsp;&nbsp;';
                    li = li + ' <button class="mui-btn mui-btn-yellow" type="button" style="width:25%" id="refusebt" onclick="showConfirm()">整改不符合</button> &nbsp;&nbsp;&nbsp;';
                    li = li + ' <button class="mui-btn mui-btn-danger" type="button" style="width:25%" id="disagreebt" onclick="reject()">拒绝</button> &nbsp;&nbsp;&nbsp;';
                    $("#approvalD").append(li);
                    $("#agreebt").on('tap', function () {
                        action = '整改符合';
                    });
                    $("#refusebt").on('tap', function () {
                        action = '整改不符合';
                    });
                }
            } else if (NodeName == "分公司分管经理" || NodeName == "分公司安全员") {
                action = "整改完成";
                $("#agreebt").text("整改完成");
            }
        }
    }
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


//行为函数部分
function Save() {
    var fname = $("#fname").val();
    var fdate = $("#fdate").val() + " 00:00:00";
    var fdept = $("#fdept").val();
    var fhkyt = $("#fhkyt").val();
    var fhkfs = $("#fhkfs").val();
    var fcompany = $("#fcompany").val();
    var fhkjedx = $("#fhkjedx").val();
    var fhkjexx = $("#fhkjexx").val();
    var fskdwmc = $("#fskdwmc").val();
    var fkhhmc = $("#fkhhmc").val();
    var fkhhzh = $("#fkhhzh").val();
    var fifjj = $("#fifjj").val();
    var fhkzt = $("#fhkzt").val();
    if (!fhkyt) {
        mui.toast('请输入汇款用途');
        return;
    }
    if (!fhkjedx) {
        mui.toast('请填写汇款金额');
        return;
    }
    if (!fhkjexx) {
        mui.toast('请填写汇款金额');
        return;
    }
    if (!fskdwmc) {
        mui.toast('请填写收款单位名称');
        return;
    }
    if (!fkhhmc) {
        mui.toast('请填写开户行名称');
        return;
    }
    if (!fkhhzh) {
        mui.toast('请填写开户行账号');
        return;
    }
    if (!fifjj) {
        mui.toast('请选择是否加急');
        return;
    }
    if (!fhkzt) {
        mui.toast('请选择是否完成汇款');
        return;
    }

    var btnArry = ["取消", "确定"];
    mui.confirm('即将提交，是否确定？', '提交确认提醒', btnArry, function (e) {
        if (e.index == 1) {

            var xml = '<?xml version= "1.0" ?>';
            xml = xml + '   <XForm>';
            xml = xml + '         <Header>';
            xml = xml + '        <Method>Post</Method>';
            xml = xml + '       <ProcessName>建设公司汇款申请</ProcessName>';
            xml = xml + '         <ProcessVersion>' + version + '</ProcessVersion>';
            xml = xml + '            <DraftGuid></DraftGuid>';
            xml = xml + '             <OwnerMemberFullName>' + BPMOU + '</OwnerMemberFullName>';
            xml = xml + '            <Action>提交</Action>';
            xml = xml + '          <Comment></Comment>';
            xml = xml + '             <InviteIndicateUsers></InviteIndicateUsers>';
            xml = xml + '       </Header>';
            xml = xml + '       <FormData>';

            xml = xml + '  <建设公司_汇款申请>';
            xml = xml + '  <单号>自动生成</单号>';
            xml = xml + '  <申请人>' + fname + '</申请人>';
            xml = xml + '   <申请日期>' + fdate + '</申请日期>';
            xml = xml + '   <申请部门>' + fdept + '</申请部门>';
            xml = xml + '   <所属公司>' + fcompany + '</所属公司>';
            xml = xml + '   <汇款用途>' + fhkyt + '</汇款用途>';
            xml = xml + '   <汇款方式>' + fhkfs + '</汇款方式>';
            xml = xml + '   <汇款金额大>' + fhkjedx + '</汇款金额大>';
            xml = xml + '   <汇款金额小>' + fhkjexx + '</汇款金额小>';
            xml = xml + '  <收款单位名称>' + fskdwmc + '</收款单位名称>';
            xml = xml + '   <开户行名称>' + fkhhmc + '</开户行名称>';
            xml = xml + '   <开户行账号>' + fkhhzh + '</开户行账号>';
            xml = xml + '   <是否加急>' + fifjj + '</是否加急>';
            xml = xml + '   <汇款状态>' + fhkzt + '</汇款状态>';

            xml = xml + '  </建设公司_汇款申请>';

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
    var fdate = $("#fdate").val();
    var fdept = $("#fdept").val();
    var fhkyt = $("#fhkyt").val();
    var fhkfs = $("#fhkfs").val();
    var fcompany = $("#fcompany").val();
    var fhkjedx = $("#fhkjedx").val();
    var fhkjexx = $("#fhkjexx").val();
    var fskdwmc = $("#fskdwmc").val();
    var fkhhmc = $("#fkhhmc").val();
    var fkhhzh = $("#fkhhzh").val();
    var fifjj = $("#fifjj").val();
    var fhkzt = $("#fhkzt").val();

    if (!fhkyt) {
        mui.toast('请输入汇款用途');
        return;
    }
    if (!fhkjedx) {
        mui.toast('请填写汇款金额');
        return;
    }
    if (!fhkjexx) {
        mui.toast('请填写汇款金额');
        return;
    }
    if (!fskdwmc) {
        mui.toast('请填写收款单位名称');
        return;
    }
    if (!fkhhmc) {
        mui.toast('请填写开户行名称');
        return;
    }
    if (!fkhhzh) {
        mui.toast('请填写开户行账号');
        return;
    }
    if (!fifjj) {
        mui.toast('请选择是否加急');
        return;
    }
    if (!fhkzt) {
        mui.toast('请选择是否完成汇款');
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

            xml = xml + '  <建设公司_汇款申请>';
            xml = xml + '  <单号>' + fbillno + '</单号>';
            xml = xml + '  <申请人>' + fname + '</申请人>';
            xml = xml + '   <申请日期>' + fdate + '</申请日期>';
            xml = xml + '   <申请部门>' + fdept + '</申请部门>';
            xml = xml + '   <所属公司>' + fcompany + '</所属公司>';
            xml = xml + '   <汇款用途>' + fhkyt + '</汇款用途>';
            xml = xml + '   <汇款方式>' + fhkfs + '</汇款方式>';
            xml = xml + '   <汇款金额大>' + fhkjedx + '</汇款金额大>';
            xml = xml + '   <汇款金额小>' + fhkjexx + '</汇款金额小>';
            xml = xml + '  <收款单位名称>' + fskdwmc + '</收款单位名称>';
            xml = xml + '   <开户行名称>' + fkhhmc + '</开户行名称>';
            xml = xml + '   <开户行账号>' + fkhhzh + '</开户行账号>';
            xml = xml + '   <是否加急>' + fifjj + '</是否加急>';
            xml = xml + '   <汇款状态>' + fhkzt + '</汇款状态>';

            xml = xml + '  </建设公司_汇款申请>';

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
    var fdate = $("#fdate").val() + " 00:00:00";
    var fdept = $("#fdept").val();
    var ftel = $("#ftel").val();
    var fzgs = $("#fzgs").val();
    var ffgas = $("#ffgas").val();
    var bllistArr = new Array();
    var i = 0;
    $("#jclist").find("#bl").each(function () {
        var fyhms = $(this).find("#fyhms").val();
        var fyhdl = $(this).find("#fyhdl").val();
        var fyhxl = $(this).find("#fyhxl").val();
        var fifcf = $(this).find("#fifcf").val();
        var fcfdh = $(this).find("#fcfdh").val();
        var fptr = $(this).find("#fptr").val();
        var ffsqy = $(this).find("#ffsqy").val();
        var ftzdh = $(this).find("#ftzdh").val();
        var fcldj = $(this).find("#fcldj").val();
        var fknx = $(this).find("#fknx").val();
        var fyzd = $(this).find("#fyzd").val();
        var ffxlb = $(this).find("#ffxlb").val();
        var fzgjy = $(this).find("#fzgjy").val();
        var fxqrq = $(this).find("#fxqrq").val() + " 00:00:00";
        var fzgqk = $(this).find("#fzgqk").val();
        var fifwc = $(this).find("#fifwc").val();
        var fifcq = $(this).find("#fifcq").val();
        var fcqyy = $(this).find("#fcqyy").val();
        var fjArray = Array(fjArrayErDimension_before[i]).toString().replace(",", ";");
        var fjArray_after = Array(fjArrayErDimension_after[i]).toString().replace(",", ";");
        var fbz = $(this).find("#fbz").val();

        var bl = new Object;
        bl.fyhms = fyhms;
        bl.fyhdl = fyhdl;
        bl.fyhxl = fyhxl;
        bl.fifcf = fifcf;
        bl.fcfdh = fcfdh;
        bl.fptr = fptr;
        bl.ffsqy = ffsqy;
        bl.ftzdh = ftzdh;
        bl.fcldj = fcldj;
        bl.fknx = fknx;
        bl.fyzd = fyzd;
        bl.ffxlb = ffxlb;
        bl.fzgjy = fzgjy;
        bl.fxqrq = fxqrq;
        bl.fzgqk = fzgqk;
        bl.fifwc = fifwc;
        bl.fifcq = fifcq;
        bl.fcqyy = fcqyy;
        bl.fjArray = fjArray;
        bl.fjArray_after = fjArray_after;
        bllistArr.push(bl);
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

            xml = xml + '  <BPM_YYZPJTAQZHJCCCFK_A>';
            xml = xml + '  <fbillno>' + fbillno + '</fbillno>';
            xml = xml + '  <fname>' + fname + '</fname>';
            xml = xml + '   <fdate>' + fdate + '</fdate>';
            xml = xml + '   <fdept>' + fdept + '</fdept>';
            xml = xml + '   <ftel>' + ftel + '</ftel>';
            xml = xml + '   <fzgs>' + fzgs + '</fzgs>';
            xml = xml + '   <ffgas>' + ffgas + '</ffgas>';
            xml = xml + '  </BPM_YYZPJTAQZHJCCCFK_A>';
            for (var i = 0; i < bllistArr.length; i++) {

                xml = xml + '<BPM_YYZPJTAQZHJCCCFK_B>';
                xml = xml + '  <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml = xml + '  <RowPrimaryKeys>itemd=' + itemidArr[i] + '</RowPrimaryKeys>';
                xml = xml + '<fentryno>' + (i + 1) + '</fentryno>';
                xml = xml + '<fyhms>' + bllistArr[i].fyhms + '</fyhms>';
                xml = xml + '<fyhdl>' + bllistArr[i].fyhdl + '</fyhdl>';
                xml = xml + '<fyhxl>' + bllistArr[i].fyhxl + '</fyhxl>';
                xml = xml + '<fifcf>' + bllistArr[i].fifcf + '</fifcf>';
                xml = xml + '<fcfdh>' + bllistArr[i].fcfdh + '</fcfdh>';
                xml = xml + '<fptr>' + bllistArr[i].fptr + '</fptr>';
                xml = xml + '<ffsqy>' + bllistArr[i].ffsqy + '</ffsqy>';
                xml = xml + '<ftzdh>' + bllistArr[i].ftzdh + '</ftzdh>';
                xml = xml + '<fcldj>' + bllistArr[i].fcldj + '</fcldj>';
                xml = xml + '<fknx>' + bllistArr[i].fknx + '</fknx>';
                xml = xml + '<fyzd>' + bllistArr[i].fyzd + '</fyzd>';
                xml = xml + '<ffxlb>' + bllistArr[i].ffxlb + '</ffxlb>';
                xml = xml + '<fzgjy>' + bllistArr[i].fzgjy + '</fzgjy>';
                xml = xml + '<fxqrq>' + bllistArr[i].fxqrq + '</fxqrq>';
                xml = xml + '<fzgqk>' + bllistArr[i].fzgqk + '</fzgqk>';
                xml = xml + '<fifwc>' + bllistArr[i].fifwc + '</fifwc>';
                xml = xml + '<fifcq>' + bllistArr[i].fifcq + '</fifcq>';
                xml = xml + '<fcqyy>' + bllistArr[i].fcqyy + '</fcqyy>';
                xml = xml + '<fzgqzp>' + bllistArr[i].fjArray + '</fzgqzp>';
                xml = xml + '<fzghzp>' + bllistArr[i].fjArray_after + '</fzghzp>';
                xml = xml + '<fbz>' + bllistArr[i].fbz + '</fbz>';

                xml = xml + '</BPM_YYZPJTAQZHJCCCFK_B>';

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
    var fname = $("#fname").val();
    var fdate = $("#fdate").val() + " 00:00:00";
    var fdept = $("#fdept").val();
    var ftel = $("#ftel").val();
    var fzgs = $("#fzgs").val();
    var ffgas = $("#ffgas").val();
    var bllistArr = new Array();
    var i = 0;
    $("#jclist").find("#bl").each(function () {
        var fyhms = $(this).find("#fyhms").val();
        var fyhdl = $(this).find("#fyhdl").val();
        var fyhxl = $(this).find("#fyhxl").val();
        var fifcf = $(this).find("#fifcf").val();
        var fcfdh = $(this).find("#fcfdh").val();
        var fptr = $(this).find("#fptr").val();
        var ffsqy = $(this).find("#ffsqy").val();
        var ftzdh = $(this).find("#ftzdh").val();
        var fcldj = $(this).find("#fcldj").val();
        var fknx = $(this).find("#fknx").val();
        var fyzd = $(this).find("#fyzd").val();
        var ffxlb = $(this).find("#ffxlb").val();
        var fzgjy = $(this).find("#fzgjy").val();
        var fxqrq = $(this).find("#fxqrq").val() + " 00:00:00";
        var fzgqk = $(this).find("#fzgqk").val();
        var fifwc = $(this).find("#fifwc").val();
        var fifcq = $(this).find("#fifcq").val();
        var fcqyy = $(this).find("#fcqyy").val();
        var fjArray = Array(fjArrayErDimension_before[i]).toString().replace(",", ";");
        var fjArray_after = Array(fjArrayErDimension_after[i]).toString().replace(",", ";");
        var fbz = $(this).find("#fbz").val();

        var bl = new Object;
        bl.fyhms = fyhms;
        bl.fyhdl = fyhdl;
        bl.fyhxl = fyhxl;
        bl.fifcf = fifcf;
        bl.fcfdh = fcfdh;
        bl.fptr = fptr;
        bl.ffsqy = ffsqy;
        bl.ftzdh = ftzdh;
        bl.fcldj = fcldj;
        bl.fknx = fknx;
        bl.fyzd = fyzd;
        bl.ffxlb = ffxlb;
        bl.fzgjy = fzgjy;
        bl.fxqrq = fxqrq;
        bl.fzgqk = fzgqk;
        bl.fifwc = fifwc;
        bl.fifcq = fifcq;
        bl.fcqyy = fcqyy;
        bl.fjArray = fjArray;
        bl.fjArray_after = fjArray_after;
        bl.fbz = fbz;
        i++;
        bllistArr.push(bl);
    });
    var comment = $("#signSuggest").val();
    var consignUserId = new Array();
    var consignRoutingType;
    var consignReturnType;

    var consignUserStr;
    //加签分支
    if (($('#signPer').val() != null) && ($('#signPer').val() != '')) {

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


        $.ajax({
            type: "POST",
            url: "/api/bpm/PostAccount",
            data: { "ids": consignOpenIdArr },
            beforeSend: function (XHR) {
                XHR.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem('ticket'));

            }, success: function (data, status) {

                if (status == "success") {



                    for (var i = 0; i < data.data.length; i++) {
                        consignUserId.push(data.data[i].phone);
                    }
                    $('#consignUser').val(consignUserId);
                    consignUserStr = (String)($('#consignUser').val()).replace(",", ";");

                    var xml = '<?xml version="1.0"?>';
                    xml = xml + '<XForm>';
                    xml = xml + '<Header>';
                    xml = xml + '<Method>Process</Method>';
                    xml = xml + '<PID>' + pid + '</PID>';
                    xml = xml + '<Action>' + action + '</Action>';
                    xml = xml + '<Comment>' + comment + '</Comment>';
                    //加签差异xml部分
                    xml = xml + '<ConsignEnabled>True</ConsignEnabled>';
                    xml = xml + '<ConsignUsers>' + consignUserStr + '</ConsignUsers>';
                    xml = xml + '<ConsignRoutingType>' + consignRoutingType + '</ConsignRoutingType>';
                    xml = xml + '<ConsignReturnType>' + consignReturnType + '</ConsignReturnType>';


                    xml = xml + '<InviteIndicateUsers></InviteIndicateUsers>';
                    xml = xml + '</Header>';
                    xml = xml + '<FormData>';

                    xml = xml + '  <BPM_YYZPJTAQZHJCCCFK_A>';
                    xml = xml + '  <fbillno>' + fbillno + '</fbillno>';
                    xml = xml + '  <fname>' + fname + '</fname>';
                    xml = xml + '   <fdate>' + fdate + '</fdate>';
                    xml = xml + '   <fdept>' + fdept + '</fdept>';
                    xml = xml + '   <ftel>' + ftel + '</ftel>';
                    xml = xml + '   <fzgs>' + fzgs + '</fzgs>';
                    xml = xml + '   <ffgas>' + ffgas + '</ffgas>';
                    xml = xml + '  </BPM_YYZPJTAQZHJCCCFK_A>';
                    for (var i = 0; i < bllistArr.length; i++) {

                        xml = xml + '<BPM_YYZPJTAQZHJCCCFK_B>';
                        xml = xml + '  <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                        xml = xml + '  <RowPrimaryKeys>itemd=' + itemidArr[i] + '</RowPrimaryKeys>';
                        xml = xml + '<fentryno>' + (i + 1) + '</fentryno>';
                        xml = xml + '<fyhms>' + bllistArr[i].fyhms + '</fyhms>';
                        xml = xml + '<fyhdl>' + bllistArr[i].fyhdl + '</fyhdl>';
                        xml = xml + '<fyhxl>' + bllistArr[i].fyhxl + '</fyhxl>';
                        xml = xml + '<fifcf>' + bllistArr[i].fifcf + '</fifcf>';
                        xml = xml + '<fcfdh>' + bllistArr[i].fcfdh + '</fcfdh>';
                        xml = xml + '<fptr>' + bllistArr[i].fptr + '</fptr>';
                        xml = xml + '<ffsqy>' + bllistArr[i].ffsqy + '</ffsqy>';
                        xml = xml + '<ftzdh>' + bllistArr[i].ftzdh + '</ftzdh>';
                        xml = xml + '<fcldj>' + bllistArr[i].fcldj + '</fcldj>';
                        xml = xml + '<fknx>' + bllistArr[i].fknx + '</fknx>';
                        xml = xml + '<fyzd>' + bllistArr[i].fyzd + '</fyzd>';
                        xml = xml + '<ffxlb>' + bllistArr[i].ffxlb + '</ffxlb>';
                        xml = xml + '<fzgjy>' + bllistArr[i].fzgjy + '</fzgjy>';
                        xml = xml + '<fxqrq>' + bllistArr[i].fxqrq + '</fxqrq>';
                        xml = xml + '<fzgqk>' + bllistArr[i].fzgqk + '</fzgqk>';
                        xml = xml + '<fifwc>' + bllistArr[i].fifwc + '</fifwc>';
                        xml = xml + '<fifcq>' + bllistArr[i].fifcq + '</fifcq>';
                        xml = xml + '<fcqyy>' + bllistArr[i].fcqyy + '</fcqyy>';
                        xml = xml + '<fzgqzp>' + bllistArr[i].fjArray + '</fzgqzp>';
                        xml = xml + '<fzghzp>' + bllistArr[i].fjArray_after + '</fzghzp>';
                        xml = xml + '<fbz>' + bllistArr[i].fbz + '</fbz>';

                        xml = xml + '</BPM_YYZPJTAQZHJCCCFK_B>';

                    }

                    xml = xml + '</FormData>';
                    xml = xml + '</XForm>';
                    PostXml(xml);
                }
            }, error: function (e) {

            }, complete: function () {

            }
        });
        //不加签分支
    } else {
        var xml = '<?xml version="1.0"?>';
        xml = xml + '<XForm>';
        xml = xml + '<Header>';
        xml = xml + '<Method>Process</Method>';
        xml = xml + '<PID>' + pid + '</PID>';
        xml = xml + '<Action>' + action + '</Action>';
        xml = xml + '<Comment>' + comment + '</Comment>';

    
        xml = xml + '<InviteIndicateUsers></InviteIndicateUsers>';
        xml = xml + '</Header>';
        xml = xml + '<FormData>';

        xml = xml + '  <BPM_YYZPJTAQZHJCCCFK_A>';
        xml = xml + '  <fbillno>' + fbillno + '</fbillno>';
        xml = xml + '  <fname>' + fname + '</fname>';
        xml = xml + '   <fdate>' + fdate + '</fdate>';
        xml = xml + '   <fdept>' + fdept + '</fdept>';
        xml = xml + '   <ftel>' + ftel + '</ftel>';
        xml = xml + '   <fzgs>' + fzgs + '</fzgs>';
        xml = xml + '   <ffgas>' + ffgas + '</ffgas>';
        xml = xml + '  </BPM_YYZPJTAQZHJCCCFK_A>';
        for (var i = 0; i < bllistArr.length; i++) {

            xml = xml + '<BPM_YYZPJTAQZHJCCCFK_B>';
            xml = xml + '  <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
            xml = xml + '  <RowPrimaryKeys>itemd=' + itemidArr[i] + '</RowPrimaryKeys>';
            xml = xml + '<fentryno>' + (i + 1) + '</fentryno>';
            xml = xml + '<fyhms>' + bllistArr[i].fyhms + '</fyhms>';
            xml = xml + '<fyhdl>' + bllistArr[i].fyhdl + '</fyhdl>';
            xml = xml + '<fyhxl>' + bllistArr[i].fyhxl + '</fyhxl>';
            xml = xml + '<fifcf>' + bllistArr[i].fifcf + '</fifcf>';
            xml = xml + '<fcfdh>' + bllistArr[i].fcfdh + '</fcfdh>';
            xml = xml + '<fptr>' + bllistArr[i].fptr + '</fptr>';
            xml = xml + '<ffsqy>' + bllistArr[i].ffsqy + '</ffsqy>';
            xml = xml + '<ftzdh>' + bllistArr[i].ftzdh + '</ftzdh>';
            xml = xml + '<fcldj>' + bllistArr[i].fcldj + '</fcldj>';
            xml = xml + '<fknx>' + bllistArr[i].fknx + '</fknx>';
            xml = xml + '<fyzd>' + bllistArr[i].fyzd + '</fyzd>';
            xml = xml + '<ffxlb>' + bllistArr[i].ffxlb + '</ffxlb>';
            xml = xml + '<fzgjy>' + bllistArr[i].fzgjy + '</fzgjy>';
            xml = xml + '<fxqrq>' + bllistArr[i].fxqrq + '</fxqrq>';
            xml = xml + '<fzgqk>' + bllistArr[i].fzgqk + '</fzgqk>';
            xml = xml + '<fifwc>' + bllistArr[i].fifwc + '</fifwc>';
            xml = xml + '<fifcq>' + bllistArr[i].fifcq + '</fifcq>';
            xml = xml + '<fcqyy>' + bllistArr[i].fcqyy + '</fcqyy>';
            xml = xml + '<fzgqzp>' + bllistArr[i].fjArray + '</fzgqzp>';
            xml = xml + '<fzghzp>' + bllistArr[i].fjArray_after + '</fzghzp>';
            xml = xml + '<fbz>' + bllistArr[i].fbz + '</fbz>';

            xml = xml + '</BPM_YYZPJTAQZHJCCCFK_B>';

        }

        xml = xml + '</FormData>';
        xml = xml + '</XForm>';
        PostXml(xml);
    }

   
}