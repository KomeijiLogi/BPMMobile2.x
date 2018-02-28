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


    });

}

//索引列表准备前置
function prepIndexedList() {


}

//获取组织信息
function initOrgMsg() {


}