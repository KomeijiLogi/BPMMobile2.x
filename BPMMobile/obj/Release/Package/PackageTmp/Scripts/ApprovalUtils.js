//变量声明部分
var noticeOpenIdArr;
var BPMOU;
var consignOpenIdArr;
var fjArray = new Array();
var taskId;
var stepId;
var itemidArr;
var attachArray = new Array();
var action;
var toStepIDs = new Array();
var version="1.0";
var DraftGuid = '';



//提交,审批,加签,已阅
function PostXml(xml) {
    $.ajax({
        type: "POST",
        url: "/api/bpm/PostProcess",
        data: { '': xml },
        beforeSend: function (XHR) {
            XHR.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem('ticket'));

        },
        success: function (data, status) {

            if (status == "success") {
                console.log(data);
                if (data.Recipients[0] != null) {
                    if (data.Recipients[0].Recipient.DisplayName != null) {
                        mui.toast("提交给" + data.Recipients[0].Recipient.DisplayName);
                    } else {
                        if (data.Recipients[1] != null){
                            mui.toast("提交给" + data.Recipients[1].Recipient.DisplayName);
                        }
                       
                    }
                    

                } else {
                    mui.toast("流程审批结束");
                }
                if (String(xml).indexOf("提交") != -1) {
                    setTimeout("window.location.href = '/Pages/index.html?ticket=" + localStorage.getItem('ticket') + "'", 2000);
                } else {
                    setTimeout("window.location.href = '/Pages/UndoFlow.html'", 2000);
                }
              

            } else {
                mui.toast("提交失败!请稍后重试");
            }
        },
        error: function (e) {
            alert(e.statusText +" .... "+ e.responseText);

        },
        complete: function () {

        }

    });

}

//知会
function Notify() {
    XuntongJSBridge.call('createPop', {
        'popTitle': '',
        'popTitleCallBackId': '1',
        'items': [
            { 'text': '知会', 'callBackId': 'callback1' },
            {'text':'刷新','callBackId':'callback2'}

        ], 'menuList': [
            'openWithBrowser'
        ],

    }, function (result) {
        if (result.success == true || result.success == 'true') {
            var callBackId = result.data ? result.data.callBackId : '';
            if (callBackId == 'callback1') {

                XuntongJSBridge.call('selectPersons', { 'isMulti': 'true', 'pType': '1' }, function (result) {

                    if (typeof (result) == "string") {
                        result = JSON.parse(result);
                    }
                    var  noticeOpenIdArr = new Array();
                    if (result.success == true|| result.success == "true") {

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
            }
        }

    });

}

//退回某步
function RecedeBack() {
    var stepId = $("#stepId").val();
    var comments;
    var list = document.getElementById('recedeWr');
    var checkboxArray = [].slice.call(list.querySelectorAll('input[type="radio"]'));

    checkboxArray.forEach(function (box) {
        if (box.checked) {
            toStepIDs.push(box.value);
        }
    });
    if (toStepIDs.length > 0) {
        var btnArray = ['取消', '确定'];
        mui.prompt('请输入原因：', '', '退回理由', btnArray, function (e) {
            if (e.index == 1) {
                comments = e.value;


                $.ajax({
                    type: 'Post',
                    url: '/api/bpm/PostRecedeBack',
                    //dataType:'json',
                    data: { 'stepid': stepId, 'comments': comments, 'toStepIDs': toStepIDs },

                    beforeSend: function (XHR) {
                        XHR.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem('ticket'));
                    },
                    success: function (data, status) {
                        if (status == "success") {
                            console.log(data);
                            mui.toast("退回到某步操作成功");
                            setTimeout(" window.location.href = '/Pages/UndoFlow.html'", 2000);
                        }
                    }, error: function (e) {

                    }, complete: function () {

                    }
                });
            }
        });
    } else {
        mui.toast("未选中任何节点");
    }


}


//退回重填
function Refilled() {

    var taskId = $("#taskId").val();
    var comments;
    var btnArray = ['取消', '确定'];
    mui.prompt('请输入原因：', '', '退回理由', btnArray, function (e) {
        if (e.index == 1) {
            comments = e.value;

            $.ajax({
                type: "POST",
                url: "/api/bpm/PostRecedeRestart",
                data: { 'taskID': taskId, 'comments': comments },
                beforeSend: function (XHR) {
                    XHR.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem('ticket'));

                },
                success: function (data, status) {

                    if (status == "success") {

                        mui.toast("操作成功");
                        setTimeout(" window.location.href = '/Pages/UndoFlow.html'", 2000);
                    } else {
                        mui.toast("操作失败,请稍后重试");
                    }
                },
                error: function (e) {
                    //console.log(e);  
                    alert(e.statusText);
                },
                complete: function () { }

            });
        } else {

        }
    }, 'div');

}

//从共享池中取出

function PickupShareTaskExt() {

    var pid = $("#stepId").val();
    var btnArry = ["取消", "确定"];
    mui.confirm('是否从共享任务中取出？', '取出确认提醒', btnArry, function (e) {
        if (e.index == 1) {
            $.ajax({
                type: "POST",
                url: "/api/bpm/PickupShareTaskExt",
                data: { 'stepid':pid},
                beforeSend: function (XHR) {
                    XHR.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem('ticket'));

                }
            }).done(function (data) {
                mui.toast('从共享任务中取出');
                setTimeout(function () {
                    window.location.reload();
                }, 1000);
                
            }).fail(function (e) {
                mui.toast('取出失败');
            });
        }
    });
}

//放回共享池
function PutbackShareTaskExt() {
    var pid = $("#stepId").val();
    var btnArry = ["取消", "确定"];
    mui.confirm('是否放回共享任务？', '取出确认提醒', btnArry, function (e) {
        if (e.index == 1) {
            $.ajax({
                type: "POST",
                url: "/api/bpm/PutbackShareTaskExt",
                data: { 'stepid': pid },
                beforeSend: function (XHR) {
                    XHR.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem('ticket'));

                }
            }).done(function (data) {
                mui.toast('已放回共享任务');
                setTimeout(function () {
                    window.location.reload();
                }, 1000);
                
            }).fail(function (e) {
                mui.toast('放回失败');
            });
        }
    });
}


//获取BPM参数

function getBPMParam() {
    
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

//获取版本信息
function getVersion(path, name) {

    $.ajax({

        type: 'get',
        url: "/api/bpm/GetProcessDefine",
        data: { 'path': path, 'name': name },
        beforeSend: function (XHR) {
            XHR.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem('ticket'));
        },
        success: function (data, status) {
            if (status == "success") {

                console.log(data);
                version = (data.Version.Major) + "." + (data.Version.Minor);
            } else {

            }
        },
        error: function (e) {

        },

        complete: function () {
            console.log(version);
        }
    });

}

//拒绝
function reject() {
    var comments;
    var btnArray = ['取消', '确定'];
    mui.prompt('请输入原因：', '', '拒绝理由', btnArray, function (e) {
        if (e.index == 1) {
            comments = e.value;



            $.ajax({
                type: "POST",
                url: "/api/bpm/PostReject",
                data: { 'taskID': $("#taskId").val(), 'comments': comments },
                beforeSend: function (XHR) {
                    XHR.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem('ticket'));

                },
                success: function (data, status) {

                    if (status == "success") {

                        mui.toast("操作成功");
                        setTimeout(" window.location.href = '/Pages/UndoFlow.html'", 2000);
                    } else {
                        mui.toast("操作失败,请稍后重试");
                    }
                },
                error: function (e) {
                    console.log(e);

                },
                complete: function () { }

            });
        } else {

        }
    }, 'div');

}


//前端获取ticket
function getUrlParam(name) {

    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");

    var r;
    if (window.location.search != null && window.location.search != "") {

        r = window.location.search.substr(1).match(reg);

        if (r != null) {

            return unescape(r[2]);
        }
    } else {
        var ticket = localStorage.getItem('ticket');

        return ticket;
    }
    return null;
}

//通过调用XuntongJSBridge来实现单选人员，从而获取对应的姓名和工号信息
function selectSinglePerson(name, account) {
    //name 为对应选择人姓名的jQueryID， account 为对应选择人工号的jQueryID
    var openidArr = new Array();
    XuntongJSBridge.call('selectPerson', { 'pType': '1' }, function (result) {

        if (typeof (result) == 'string') {
            result = JSON.parse(result);
        } else if (typeof (result) == 'object') {
            result = result;
        }
        var data = result.data;
        if (result.success == true || result.success == "true") {
            for (var i = 0; i < data.persons.length; i++) {
                openidArr.push(data.persons[i].openId);
            }
            $.ajax({
                type: "POST",
                url: "/api/bpm/PostAccount",
                data: { "ids": openidArr },
                beforeSend: function (XHR) {
                    XHR.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem('ticket'));

                }
            }).done(function (data) {
                console.log(data);
                var accountArr = new Array();
                var nameArr = new Array();
                for (var i = 0; i < data.data.length; i++) {
                    accountArr.push((String)(data.data[i].phone));
                    nameArr.push(data.data[i].name);
                }
                $(name).val(nameArr.toString());
                $(account).val(accountArr.toString());
            }).fail(function (e) {

            });
        }
    });

}

//选择器前提需要mui加载完成
function showPicker(el, data) {

    var element = document.getElementById(el);
    
    var picker = new mui.PopPicker();
    
    picker.setData(data);

    element.addEventListener('tap', function () {

        picker.show(function (items) {
            
            element.value = items[0].text;
        });

    }, false);

}

function showPickerByZepto(zeptoParentId, zeptoId,data) {
    var picker = new mui.PopPicker();

   
    picker.setData(data);

    $(zeptoParentId).find(zeptoId).each(function () {

        var self = this;
        $(this).off('tap');
        $(this).on('tap', function () {

            picker.show(function (items) {
                self.value = (items[0].text);
            });
        });
    });

}

//优化picker的创建逻辑，防止冗余picker生成
function showPickerOptimize(picker, el, data) {

    var element = document.getElementById(el);

    picker.setData(data);

    element.addEventListener('tap', function () {

        picker.show(function (items) {

            element.value = items[0].text;
        });

    }, false);

}


//打开加签

function openSignPer() {

    XuntongJSBridge.call('selectPersons', { 'isMulti': 'true', 'pType': '1' }, function (result) {

        //alert(JSON.stringify(result.data));
        if (typeof (result) == "string") {
            result = JSON.parse(result);
        }
        var consignNameArr = new Array();
        consignOpenIdArr = new Array();
        if (result.success == true || result.success == "true") {

            for (var i = 0; i < result.data.persons.length; i++) {
                if (typeof (result.data.persons[i].name) != "undefined") {
                    consignNameArr.push(result.data.persons[i].name);
                } else {
                    consignNameArr.push(result.data.persons[i].personName);
                }
                
                consignOpenIdArr.push((String)(result.data.persons[i].openId));
            }
            $('#signPer').val(consignNameArr);
            $('#consignOpenId').val(consignOpenIdArr);


        }

    });



}
function closeSingPer() {


    if ($('.mui-switch').hasClass('mui-active')) {

    }
}


function locationAction(selAction ) {

    var stepAction = "";
    if (selAction == "sysInform") {
        stepAction = "发起知会";
    } else if (selAction == "Submit") {
        stepAction = "已阅";
    } else if (selAction == "null" || selAction == null) {
        stepAction = "待处理";
    } else if (selAction == "sysReject") {
        stepAction = "拒绝";
    } else if (selAction == "sysRecedeRestart") {
        stepAction = "退回重填";
    } else if (selAction == "sysRecedeBack") {
        stepAction = "退回";
    } else if (selAction == "sysDirectSend") {
        stepAction = "直送";
    } else if (selAction == "sysAbort") {
        stepAction = "撤销";
    } else if (selAction == "sysStop") {
        stepAction = "结束";
    } else if (selAction == "sysPickBackRestart") {
        stepAction = "取回重填";
    }else if(selAction == "sysPickBack"){
        stepAction ="取回";
    } else {
       stepAction = selAction;
    } 
    return stepAction;

}

//转换到确认页面
function showConfirm() {
    $("#wrapper").css("display", "none");
    $("#signd").css("display", "block");

}
function cancelConfirm() {

    $("#wrapper").css("display", "block");
    $("#signd").css("display", "none");
}

//删除明细列表项 
function deleteItem(context) {
    var btnArray = ['否', '是'];
    mui.confirm('确认删除？', '', btnArray, function (e) {
        if (e.index == 1) {
            $(context).parent().parent().remove();
        }
    });

  
}

function watch() {
   
    var count = $('.upload-img-list >div').size();

    if (count==0) {
        $('#uploaddiv').css('height', '4rem');
    } else if (count <= 4) {
        $('#uploaddiv').css('height', '7rem');

    } else if (count <= 8) {
        $('#uploaddiv').css('height', '10rem');

    } else if (count <= 12) {
        $('#uploaddiv').css('height', '15rem');

    } 
   
}
// 数字转换成大写金额函数
function atoc(numberValue) {
    var numberValue = new String(Math.round(numberValue * 100)); // 数字金额
    var chineseValue = ""; // 转换后的汉字金额
    var String1 = "零壹贰叁肆伍陆柒捌玖"; // 汉字数字
    var String2 = "万仟佰拾亿仟佰拾万仟佰拾元角分"; // 对应单位
    var len = numberValue.length; // numberValue 的字符串长度
    var Ch1; // 数字的汉语读法
    var Ch2; // 数字位的汉字读法
    var nZero = 0; // 用来计算连续的零值的个数
    var String3; // 指定位置的数值
    if (len > 15) {
        alert("超出计算范围");
        return "";
    }
    if (numberValue == 0) {
        chineseValue = "零元整";
        return chineseValue;
    }

    String2 = String2.substr(String2.length - len, len); // 取出对应位数的STRING2的值
    for (var i = 0; i < len; i++) {
        String3 = parseInt(numberValue.substr(i, 1), 10); // 取出需转换的某一位的值
        if (i != (len - 3) && i != (len - 7) && i != (len - 11) && i != (len - 15)) {
            if (String3 == 0) {
                Ch1 = "";
                Ch2 = "";
                nZero = nZero + 1;
            }
            else if (String3 != 0 && nZero != 0) {
                Ch1 = "零" + String1.substr(String3, 1);
                Ch2 = String2.substr(i, 1);
                nZero = 0;
            }
            else {
                Ch1 = String1.substr(String3, 1);
                Ch2 = String2.substr(i, 1);
                nZero = 0;
            }
        }
        else { // 该位是万亿，亿，万，元位等关键位
            if (String3 != 0 && nZero != 0) {
                Ch1 = "零" + String1.substr(String3, 1);
                Ch2 = String2.substr(i, 1);
                nZero = 0;
            }
            else if (String3 != 0 && nZero == 0) {
                Ch1 = String1.substr(String3, 1);
                Ch2 = String2.substr(i, 1);
                nZero = 0;
            }
            else if (String3 == 0 && nZero >= 3) {
                Ch1 = "";
                Ch2 = "";
                nZero = nZero + 1;
            }
            else {
                Ch1 = "";
                Ch2 = String2.substr(i, 1);
                nZero = nZero + 1;
            }
            if (i == (len - 11) || i == (len - 3)) { // 如果该位是亿位或元位，则必须写上
                Ch2 = String2.substr(i, 1);
            }
        }
        chineseValue = chineseValue + Ch1 + Ch2;
    }

    if (String3 == 0) { // 最后一位（分）为0时，加上“整”
        chineseValue = chineseValue + "整";
    }

    return chineseValue;
}

//格式化钱
function FormatMoney(s) {
    if (/[^0-9\.]/.test(s)) return "invalid value";
    s = s.replace(/^(\d*)$/, "$1.");
    s = (s + "00").replace(/(\d*\.\d\d)\d*/, "$1");
    s = s.replace(".", ",");
    var re = /(\d)(\d{3},)/;
    while (re.test(s))
        s = s.replace(re, "$1,$2");
    s = s.replace(/,(\d\d)$/, ".$1");
    return "" + s.replace(/^\./, "0.")

   
}


//定义附件函数
function attachItem(name, type, size, time, downurl) {
    var attachment = new Object();
    attachment.name = name;
    attachment.type = type;
    attachment.size = size;
    attachment.time = time;
    attachment.downurl = downurl;
    return attachment;
}

//判断是否是Safari
function isSafari() {

    if ( navigator.userAgent.indexOf("iPad") != -1 || navigator.userAgent.indexOf("iPhone") != -1) {
        return true;
    } else {
        return false;
    }
}
//ios刷新
function iosfresh() {



    if ($('body').hasClass("no-cache")) {
        document.body.style.display = "none";
        window.location.reload();

    }


}

function forbiddenCache() {
    if (isSafari()) {
        $('body').addClass("no-cache");
       
    }
    

}

//获取可退回步骤的列表
function getRecedableToSteps() {
    var stepid = parseInt($("#stepId").val());
    //console.log(parseInt($("#stepId").val()));
    $.ajax({
        type: "POST",
        url: "/api/bpm/GetRecedableToSteps",
        data: { '': stepid },
        beforeSend: function (XHR) {
            XHR.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem('ticket'));

        },
        success: function (data, status) {

            if (status == "success") {
                console.log(data);
                $("#wrapper").css("display", "none");
                if ($("#recedeWr").length != 0) {
                    $("#recedeWr").remove();
                }


                var li = '<div class="mui-card" id="recedeWr" style="z-index:999;">';
                li = li + '  <form class="mui-input-group">';
                li = li + '  <div class="mui-input-row bgc">';
                li = li + '       <label>将任务退回</label>';
                li = li + '  </div>';
                for (var i = 0; i < data.length; i++) {
                    li = li + '     <div class="mui-input-row mui-radio mui-left">';
                    li = li + '     <label>' + data[i].NodeName + '&nbsp;' + data[i].OwnerFullName + '&nbsp;' + FormatterTimeYMS(data[i].FinishAt) + '</label>';

                    li = li + '     <input name="stepcbox" value="' + data[i].StepID + '" type="radio" >';
                    li = li + '     </div>';

                }
                li = li + '   <div class="mui-btn-row mui-text-center" style="margin-top:1rem;">';
                li = li + '      <button class="mui-btn mui-btn-primary" type="button" style="height:2.5rem;width:40%;" onclick="RecedeBack()">确定</button>&nbsp;&nbsp;';
                li = li + '      <button class="mui-btn mui-btn-danger" type="button" style="height:2.5rem;width:40%;" onclick="goBack()">取消</button>';
                li = li + '   </div>';
                $("body").append(li);


            }
        }, error: function (e) {

        }, complete: function () {

        }
    });
}




function goBack() {
    $("#recedeWr").css("display", "none");
    $("#wrapper").css("display", "block");

}


//获取当前日期
function getNowFormatDate(timeformat) {


    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var hour = date.getHours();
    if (hour >= 0 && hour <= 9) {
        hour = "0" + hour;
    }
    var minute = date.getMinutes();
    if (minute >= 0 && minute <= 9) {
        minute = "0" + minute;
    }
    var seconds = date.getSeconds();
    if (seconds >= 0 && seconds <= 9) {
        seconds = "0" + seconds;
    }
    //yyyy-MM-dd hh:mm:ss格式
    var currentdate1 = year + seperator1 + month + seperator1 + strDate
        + " " + hour + seperator2 + minute + seperator2 + seconds
        ;
    //yyyy-MM-dd
    var currentdate2 = year + seperator1 + month + seperator1 + strDate;

    //hh:mm:ss
    var currentdate3 = hour + seperator2 + minute + seperator2 + seconds;

    //yyyy-MM-dd hh:mm
    var currentdate4 = year + seperator1 + month + seperator1 + strDate
        + "T" + hour + seperator2 + minute
        ;
    if (timeformat == 1) {
        return currentdate1;
    } else if (timeformat == 2) {
        return currentdate2;
    } else if (timeformat == 3) {
        return currentdate3;
    } else if (timeformat == 4) {
        return currentdate4;
    }else {
        return "";
    }

}

//格式化时间为MM-dd hh:mm
function FormatterTime(time) {
    var time = String(time);
    var ymd = time.substring(time.indexOf("-") + 1, time.indexOf("T"));
    var hms = time.substring(time.indexOf("T") + 1, time.lastIndexOf(":"));
    time = ymd + " " + hms;

    return time;
}
//格式化时间为yyyy-MM-dd
function FormatterTimeYMS(time) {
    var time = String(time);
    var ymd = time.substring(0, time.indexOf("T"));
    return ymd;
}
function FormatterTimeT(time) {
    var time = String(time);
    var ymd = time.substring(0, time.indexOf(" "));
    return ymd;
}

function FormatterTime_Y_M_S(year, month, day) {
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (day >= 0 && day <= 9) {
        day = "0" + day;
    }
    var ymd = year + "-" + month + "-" + day;
    return ymd;
}

//格局化日期：yyyy-MM-dd  
function formatDate(date) {
    var myyear = date.getFullYear();
    var mymonth = date.getMonth() + 1;
    var myweekday = date.getDate();

    if (mymonth < 10) {
        mymonth = "0" + mymonth;
    }
    if (myweekday < 10) {
        myweekday = "0" + myweekday;
    }
    return (myyear + "-" + mymonth + "-" + myweekday);
}  
var date = new Date();
var nowYear = date.getFullYear();
var nowMonth = date.getMonth();
var nowDay = date.getDate();
var nowDayOfWeek = date.getDay();
//获取本周的第一天
function getWeekStartDate() {
   
    var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek);
    return formatDate(weekStartDate);   

}
//获取本周的最后一天
function getWeekEndDate() {
    var weekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek));
    return formatDate(weekEndDate);   
}
//获取下周的第一天
function getNextWeekStartDate() {
    
    var nextWeekStartDate = new Date(nowYear, nowMonth, (nowDay + 7) - nowDayOfWeek);
    return formatDate(nextWeekStartDate);
}
//获取下周的最后一天
function getNextWeekEndDate() {

    var nextWeekEndDate = new Date(nowYear, nowMonth, (nowDay + 7) + (6 - nowDayOfWeek));
    return formatDate(nextWeekEndDate);
}
//获得某月的天数   
function getMonthDays(myMonth) {
    var monthStartDate = new Date(nowYear, myMonth, 1);
    var monthEndDate = new Date(nowYear, myMonth + 1, 1);
    var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
    return days;
}  

//获取某月的第一天 需要加载xdate.js  输入yyyy-MM-dd格式的数据
function getMonthFirst(dateString) {
    var info = String(dateString).split("-");
    var year = info[0];
    var month = info[1]-1;
    
    var firstDate = new Date(year, month);
    firstDate.setDate(1);
    return new XDate(firstDate).toString('yyyy-MM-dd');
}
//获取某月最后一天
function getMonthLast(dateString) {

    var info = String(dateString).split("-");
    var year = info[0];
    var month = info[1] - 1;

    var firstDate = new Date(year, month);
    firstDate.setDate(1);
    var endDate = new Date(firstDate);
    endDate.setMonth(firstDate.getMonth() + 1);
    endDate.setDate(0);
    return new XDate(endDate).toString('yyyy-MM-dd');
}

//计算日期相差天数
function DateDiff(sDate1, sDate2) {    //sDate1和sDate2是2006-12-18格式  
    var aDate, oDate1, oDate2, iDays
    aDate = sDate1.split("-")
    oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])    //转换为12-18-2006格式  
    aDate = sDate2.split("-")
    oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])
    iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24)    //把相差的毫秒数转换为天数  
    return iDays
}    

//数组去重索引法
function removeDuplicatedItem(array) {
    var ret = [];

    array.forEach(function (e, i, array) {
        if (array.indexOf(e) === i) {
            ret.push(e);
        }
    });

    return ret;
}


//删除数组指定值
function removeByValue(arr, val) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == val) {
            arr.splice(i, 1);
            break;
        }
    }
}


//通过工号获取人员信息
function getPersonInfo(fno) {

    var xml = '<?xml version= "1.0" ?>';
    xml = xml + '      <Requests>';
    xml = xml + '     <Params>';
    xml = xml + '         <DataSource>PS</DataSource>';
    xml = xml + '         <ID>erpcloud_公用_获取个人信息</ID>';
    xml = xml + '         <Type>1</Type>';
    xml = xml + '        <Method>GetUserDataProcedure</Method>';
    xml = xml + '        <ProcedureName>erpcloud_公用_获取个人信息</ProcedureName>';
    xml = xml + '        <Filter>';
    xml = xml + '            <fno>' + fno + '</fno>';
    xml = xml + '        </Filter>';
    xml = xml + '      </Params>';
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
        //console.log(provideData);
        var personInfoObject = provideData.Tables[0].Rows[0];
        var personObject = ({
            name: personInfoObject.NAME,             //姓名
            account: personInfoObject.EMPLID,        //工号
            descript: personInfoObject.DEPT_DESCR,   //所在组织简约描述
            status: personInfoObject.DESCR1,          //状况 1-良好，2-特殊
            wedding: personInfoObject.DESCR2,         //婚姻状况
            residence: personInfoObject.DESCR4,       //户口状况
            nation: personInfoObject.DESCR50,         //民族
            deptdescript: personInfoObject.DESCR254,  //所在组织详细描述
            email: personInfoObject.EMAIL_ADDR,       //个人邮箱
            fzjsj: personInfoObject.FDEPZR,           //直接上级
            fzjsjno: personInfoObject.FDEPZRNUMBER,   //直接上级工号
            fzgsj: personInfoObject.FZR,              //最高上级 
            fzgsjno: personInfoObject.FZRNUMBER,      //最高上级工号
            fjoindate: personInfoObject.HPS_JOINWG_DT, //加入威高时间
            school: personInfoObject.HPS_VALUE01,      //毕业院校
            profession: personInfoObject.HPS_VALUE02,  //所学专业
            address: personInfoObject.HPS_VALUE03,     //家庭住址
            degree: personInfoObject.JPM_DESCR90,      //学历学位
            sex: personInfoObject.SEX,                 //性别 M/F
            fdeptname: personInfoObject.fdeptname,     //所属部门
            fgslj: personInfoObject.fgslj,             //所属部门详细路径
            fsscompany: personInfoObject.fsscompany,   //所属公司
            fssgroup: personInfoObject.fssgroup,       //所属组织
            fzwlevel: personInfoObject.fzwlevel,       //职位级别
            minzu: personInfoObject.minzu,              //民族
            jiguan: personInfoObject.jiguan,            //籍贯
            zhiwei: personInfoObject.zhiwei,             //职位 
            birthday: FormatterTime_Y_M_S(personInfoObject.BIRTHDATE.year, personInfoObject.BIRTHDATE.month, personInfoObject.BIRTHDATE.day),    //出生日期
            id: personInfoObject.NATIONAL_ID,             //身份证号 
            tel: personInfoObject.PHONE,                  //联系电话
            gradate: FormatterTime_Y_M_S(personInfoObject.HPS_DATE01.year, personInfoObject.HPS_DATE01.month, personInfoObject.HPS_DATE01.day),      //毕业时间
            depno: personInfoObject.DEPTID                 //部门编码        
        });
        console.log(personObject);
        return personObject;
    }).fail(function (e) {
    })

}



//根据openid获取PS里人员信息
function getPseronInfoByopenId(selecPersonOpenIdArr) {

    var selectPerson = new Array();
    var selectAccountArr = new Array();
    //selecPersonOpenIdArr.push('2ea1588f-0073-11e7-b810-00505681025b');
    var getAccount = $.ajax({
        type: "POST",
        url: "/api/bpm/PostAccount",
        data: { "ids": selecPersonOpenIdArr },
        beforeSend: function (XHR) {
            XHR.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem('ticket'));

        }
    }).done(function (data) {
        console.log(JSON.stringify(data));
        selectPerson = new Array();
        selectAccountArr = new Array();
        for (var i = 0; i < data.data.length; i++) {
            var selectperson = ({
                name: (data.data[i].name),              //姓名
                account: (data.data[i].phone),          //工号
                photoUrl: (data.data[i].photoUrl),      //头像
                department: (data.data[i].department),   //所属部门
                jobTitle: (data.data[i].jobTitle),        //职位
                openId: (data.data[i].openId)            //openid
            });
            selectPerson.push(selectperson);
            selectAccountArr.push(data.data[i].phone);
        }

    }).fail(function (e) {
        console.log(e);
    });

    var getPersonInfo = getAccount.then(function (data) {


        //console.log(selectAccountArr.toString());
        var xml = '<?xml version= "1.0" ?>';
        xml = xml + ' <Requests>';
        xml = xml + '     <Params>';
        xml = xml + '         <DataSource>PS</DataSource>';
        xml = xml + '         <ID>erpcloud_公用_获取个人信息数组</ID>';
        xml = xml + '         <Type>1</Type>';
        xml = xml + '        <Method>GetUserDataProcedure</Method>';
        xml = xml + '        <ProcedureName>erpcloud_公用_获取个人信息数组</ProcedureName>';
        xml = xml + '        <Filter>';
        xml = xml + '            <fnoarr>' + selectAccountArr.toString() + '</fnoarr>';
        xml = xml + '        </Filter>';
        xml = xml + '      </Params>';
        xml = xml + '   </Requests>';

        return $.ajax({

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
            })
            .fail(function (e) {
                console.log(e);
            });
    });

}

//将null转换成空字符
function changeNullToEmpty(value) {
    if (value == null) {
        value = '';
    }
    return value;

}

