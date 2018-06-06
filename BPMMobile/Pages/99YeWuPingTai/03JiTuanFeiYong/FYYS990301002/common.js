function prepMsg() {
    $("#rq").val(getNowFormatDate(2));
    var xml = `<?xml version= "1.0" ?>
                  <Requests>
                      <Params>
                      <Method>GetFormPostData</Method>
                      <ProcessName>集团本部月度费用预算提报</ProcessName>
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
        $("#comp_name").val('威高集团有限公司');
        $("#dept_no").val(item.dept_no);
        $("#dept_name").val(item.dept_name);
        $("#user_leadtitle").val(item.user_leadtitle);
        $("#usr_name").val(item.usr_name);
        $("#usr_no").val(item.usr_no);

    }).fail(function (e) {

        }).then(function () {
            initList();
        });
    tapEvent();
}

function tapEvent() {
    var date = new Date();
    var fyear_data = [
        {
            value: '',
            text: date.getFullYear() - 2
        },
        {
            value: '',
            text: date.getFullYear() - 1
        },
        {
            value: '',
            text: date.getFullYear()
        },
        {
            value: '',
            text: date.getFullYear() + 1
        },
        {
            value: '',
            text: date.getFullYear() + 2
        }
    ];
    showPicker('nian', fyear_data);


    var fmonth_data = [];
    for (var i = 0; i < 12; i++) {
        var month = {
            value: '',
            text:i+1
        }
        fmonth_data.push(month);
    }
    showPicker('yue', fmonth_data);


}

function initList() {
    var xml = `<?xml version= "1.0" ?>
                    <Requests>
                        <Params>
                            <DataSource>BPM_EXPENSE</DataSource>
                            <ID>erpcloud_公用_查询其他费用项目</ID>
                            <Type>1</Type>
                            <Method>GetUserDataProcedure</Method>
                            <ProcedureName>erpcloud_公用_查询其他费用项目</ProcedureName>
                            <Filter></Filter>
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
        var itemData = provideData.Tables[0].Rows;
        console.log(provideData);


    }).fail(function (e) {

    });
}
