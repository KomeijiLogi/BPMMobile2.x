function prepMsg() {
    $("#fdate").val(getNowFormatDate(2));
    tapEvent();
    var xml = `<?xml version= "1.0" ?>
                  <Requests>
                      <Params>
                      <Method>GetFormPostData</Method>
                      <ProcessName>洁丽康公司员工试用期转正申请</ProcessName>
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
        $("#fno").val(item.工号);
        $("#fname").val(item.姓名);
             
        }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
        if (XMLHttpRequest.status == "401") {
            mui.alert('授权过期，请重新打开页面');;
        } else if (XMLHttpRequest.status == "500") {
            mui.alert('服务器内部错误');
         }
    }).then((data) => {
        getPerInfo();
    });
}

function tapEvent() {
    var option = { "type": "date", "beginYear": new Date().getFullYear(), "endYear": new Date().getFullYear() + 3 };
    
    var picker = new mui.DtPicker(option);
    $("#fsqzzsj").on('tap', () => {
        picker.show(function (rs) {
            $("#fsqzzsj").val(rs.text);
        });
    });
}

function getPerInfo() {
    var fno = $("#fno").val();
    var xml = `<?xml version= "1.0" ?>
                <Requests>
                 <Params>
                  <DataSource>PS</DataSource>
                   <ID>erpcloud_公用_获取个人信息</ID>
                   <Type>1</Type>
                   <Method>GetUserDataProcedure</Method>
                   <ProcedureName>erpcloud_公用_获取个人信息</ProcedureName>
                    <Filter><fno>${fno}</fno></Filter>
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
      
        var personInfoObject = provideData.Tables[0].Rows[0];


    }).fail(function (e) {

    });

}

function initData(data, flag) {
    var item = data.FormDataSet.洁丽康公司_员工转正申请_主表[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.fbillno);
        $("#fno").val(item.工号);
        $("#fname").val(item.姓名);
        $("#fssjt").val(item.所属集团);
        $("#fssgs").val(item.所属公司);
        $("#fbm").val(item.部门);
        $("#fzw").val(item.职位);
        $("#fxb").val(item.性别);
        $("#fcsrq").val(item.出生日期);
        $("#fsfzh").val(item.身份证号);
        $("#flxdh").val(item.联系电话);
        $("#fzgxl").val(item.最高学历);
        $("#fbyyx").val(item.毕业院校);
        $("#fzy").val(item.专业);
        $("#fbysj").val(item.毕业时间);
        $("#frzsj").val(item.入职时间);

    }

}