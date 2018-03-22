function prepMsg() {
    upload();
    $("#fdate").val(getNowFormatDate(2));
    var xml = `<?xml version= "1.0" ?>
               <Requests>
               <Params>
               <Method>GetFormPostData</Method>
               <ProcessName>威海卫大厦部门经营毛利分析提报</ProcessName>
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
        $("#fname").val(item.发起人);
        $("#fdept").val(item.发起部门);

    }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
        if (XMLHttpRequest.status == "401") {
            mui.alert('授权过期，请重新打开页面');;
        } else if (XMLHttpRequest.status == "500") {
            mui.alert('服务器内部错误');
        }

        });
    tapEvent();

}

function tapEvent() {

    $("#ffxbm").on('tap', function () {


    });


    $("#ffxr").on('tap', function () {


    });

    var fyeardata = [
        {
            value: '',
            text:'2017'
        },
        {
            value: '',
            text:'2018'
        },
        {
            value: '',
            text:'2019'
        }
    ];
    var fmonthdata = [];
    for (var i = 0; i < 12; i++) {
        var obj = {
            value: '',
            text: (i + 1)
        }
        fmonthdata.push(obj);
    }
    showPicker('ffxnd', fyeardata);
    showPicker('ffxyd', fmonthdata);

}

