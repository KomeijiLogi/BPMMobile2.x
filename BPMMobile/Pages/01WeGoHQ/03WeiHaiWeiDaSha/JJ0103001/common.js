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
    $("#fpdsj").val(item.派工时间);
    $("#fjdr").val(item.接单人);
    $("#fjssj").val(item.维修结束时间);
    $("#fwxzt").val(item.维修状态);


}
function nodeControllerExp(NodeName) {

}