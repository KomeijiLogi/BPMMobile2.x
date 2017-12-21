function prepMsg() {


}

function tapEvent() {


}


function initData(data, flag) {
    var item = data.FormDataSet.BPM_custshare[0];
    if (flag) {

        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.fbillno);
    }
    $("#fname").val(item.fname);
    $("#ftbcompany").val(item.ftbcompany);
    $("#fdjcompany").val(item.fdjcompany);
    $("#fdate").val(FormatterTimeYMS(item.fdate));
    $("#fcusno").val(item.fcusno);
    $("#fcusname").val(item.fcusname);
    $("#f_dj_dqname").val(item.f_dj_dqname);
    $("#f_dj_dqtel").val(item.f_dj_dqtel);
    $("#f_dj_state").val(item.f_dj_state);
    $("#f_dj_xsname").val(item.f_dj_xsname);
    $("#f_dj_xstel").val(item.f_dj_xstel);
    $("#f_dj_plan").val(item.f_dj_plan);
    $("#f_dj_djname").val(item.f_dj_djname);
    $("#f_dj_djtel").val(item.f_dj_djtel);
    $("#f_dj_product").val(item.f_dj_product);
    $("#f_dj_xsfs").val(item.f_dj_xsfs);
    $("#f_dj_xsl").val(item.f_dj_xsl);
    $("#f_zp_xsgs").val(item.f_zp_xsgs);
    $("#f_zp_dq").val(item.f_zp_dq);
    $("#f_zp_bsc").val(item.f_zp_bsc);
    $("#f_zp_dqname").val(item.f_zp_dqname);
    $("#f_zp_dqtel").val(item.f_zp_dqtel);
    $("#f_zp_state").val(item.f_zp_state);
    $("#f_zp_bscname").val(item.f_zp_bscname);
    $("#f_zp_bsctel").val(item.f_zp_bsctel);
    $("#f_zp_date").val(item.f_zp_date);
    $("#f_zp_djname").val(item.f_zp_djname);
    $("#f_zp_djtel").val(item.f_zp_djtel);
    $("#f_zp_problem").val(item.f_zp_problem);
    $("#f_zp_product").val(item.f_zp_product);
    $("#f_zp_xsfs").val(item.f_zp_xsfs);
    $("#f_zp_xsl").val(item.f_zp_xsl);
    $("#f_dj_xsno").val(item.f_dj_xsno);
    $("#f_dj_djno").val(item.f_dj_djno);
    $("#f_zp_dqno").val(item.f_zp_dqno);
    $("#f_zp_bscno").val(item.f_zp_bscno);
    $("#fcuststatus").val(item.fcuststatus);


}
function nodeControllerExp(NodeName) {

    if (NodeName == '开始') {
        mui.alert('请到BPM上处理');
    }
}

function Save() {

}

function reSave() {

}

function hasRead() {
    var pid = $("#stepId").val();
    var fbillno = $("#fbillno").val();

    var fname = $("#fname").val();
    var ftbcompany = $("#ftbcompany").val();
    var fdjcompany = $("#fdjcompany").val();
    var fdate = $("#fdate").val();
    var fcusno = $("#fcusno").val();
    var fcusname = $("#fcusname").val();
    var f_dj_dqname = $("#f_dj_dqname").val();
    var f_dj_dqtel = $("#f_dj_dqtel").val();
    var f_dj_state = $("#f_dj_state").val();
    var f_dj_xsname = $("#f_dj_xsname").val();
    var f_dj_xstel = $("#f_dj_xstel").val();
    var f_dj_plan = $("#f_dj_plan").val();
    var f_dj_djname = $("#f_dj_djname").val();
    var f_dj_djtel = $("#f_dj_djtel").val();
    var f_dj_product = $("#f_dj_product").val();
    var f_dj_xsfs = $("#f_dj_xsfs").val();
    var f_dj_xsl = $("#f_dj_xsl").val();
    var f_zp_xsgs = $("#f_zp_xsgs").val();
    var f_zp_dq = $("#f_zp_dq").val();
    var f_zp_bsc = $("#f_zp_bsc").val();
    var f_zp_dqname = $("#f_zp_dqname").val();
    var f_zp_dqtel = $("#f_zp_dqtel").val();
    var f_zp_state = $("#f_zp_state").val();
    var f_zp_bscname = $("#f_zp_bscname").val();
    var f_zp_bsctel = $("#f_zp_bsctel").val();
    var f_zp_date = $("#f_zp_date").val();
    var f_zp_djname = $("#f_zp_djname").val();
    var f_zp_djtel = $("#f_zp_djtel").val();
    var f_zp_problem = $("#f_zp_problem").val();
    var f_zp_product = $("#f_zp_product").val();
    var f_zp_xsfs = $("#f_zp_xsfs").val();
    var f_zp_xsl = $("#f_zp_xsl").val();
    var f_dj_xsno = $("#f_dj_xsno").val();
    var f_dj_djno = $("#f_dj_djno").val();
    var f_zp_dqno = $("#f_zp_dqno").val();
    var f_zp_bscno = $("#f_zp_bscno").val();
    var fcuststatus = $("#fcuststatus").val();
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

            xml = xml + ' <BPM_custshare>';
            xml = xml + '  <fbillno>' + fbillno + '</fbillno>';
            xml = xml + ' <fname>' + fname + '</fname>';
            xml = xml + ' <ftbcompany>' + ftbcompany + '</ftbcompany>';
            xml = xml + ' <fdjcompany>' + fdjcompany + '</fdjcompany>';
            xml = xml + ' <fdate>' + fdate + '</fdate>';
            xml = xml + ' <fcusno>' + fcusno + '</fcusno>';
            xml = xml + ' <fcusname>' + fcusname + '</fcusname>';
            xml = xml + ' <f_dj_dqname>' + f_dj_dqname + '</f_dj_dqname>';
            xml = xml + ' <f_dj_dqtel>' + f_dj_dqtel+'</f_dj_dqtel>';
            xml = xml + ' <f_dj_state>' + f_dj_state+'</f_dj_state>';
            xml = xml + ' <f_dj_xsname>' + f_dj_xsname +'</f_dj_xsname>';
            xml = xml + ' <f_dj_xstel>' + f_dj_xstel +'</f_dj_xstel>';
            xml = xml + ' <f_dj_plan>' + f_dj_plan +'</f_dj_plan>';
            xml = xml + ' <f_dj_djname>' + f_dj_djname +'</f_dj_djname>';
            xml = xml + ' <f_dj_djtel>' + f_dj_djtel +'</f_dj_djtel>';
            xml = xml + ' <f_dj_product>' + f_dj_product +'</f_dj_product>';
            xml = xml + ' <f_dj_xsfs>' + f_dj_xsfs +'</f_dj_xsfs>';
            xml = xml + '  <f_dj_xsl>' + f_dj_xsl +'</f_dj_xsl>';
            xml = xml + ' <f_zp_xsgs>' + f_zp_xsgs +'</f_zp_xsgs>';
            xml = xml + ' <f_zp_dq>' + f_zp_dq +'</f_zp_dq>';
            xml = xml + '  <f_zp_bsc>' + f_zp_bsc +'</f_zp_bsc>';
            xml = xml + '  <f_zp_dqname>' + f_zp_dqname +'</f_zp_dqname>';
            xml = xml + '   <f_zp_dqtel>' + f_zp_dqtel +'</f_zp_dqtel>';
            xml = xml + '  <f_zp_state>' + f_zp_state +'</f_zp_state>';
            xml = xml + '   <f_zp_bscname>' + f_zp_bscname +'</f_zp_bscname>';
            xml = xml + '   <f_zp_bsctel>' + f_zp_bsctel +'</f_zp_bsctel>';
            xml = xml + '   <f_zp_date>' + f_zp_date +'</f_zp_date>';
            xml = xml + ' <f_zp_djname>' + f_zp_djname +'</f_zp_djname>';
            xml = xml + '  <f_zp_djtel>' + f_zp_djtel +'</f_zp_djtel>';
            xml = xml + '   <f_zp_problem>' + f_zp_problem +'</f_zp_problem>';
            xml = xml + '  <f_zp_product>' + f_zp_product +'</f_zp_product>';
            xml = xml + ' <f_zp_xsfs>' + f_zp_xsfs +'</f_zp_xsfs>';
            xml = xml + '  <f_zp_xsl>' + f_zp_xsl +'</f_zp_xsl>';
            xml = xml + '  <f_dj_xsno>' + f_dj_xsno +'</f_dj_xsno>';
            xml = xml + '  <f_dj_djno>' + f_dj_djno +'</f_dj_djno>';
            xml = xml + '  <f_zp_dqno>' + f_zp_dqno +'</f_zp_dqno>';
            xml = xml + ' <f_zp_bscno>' + f_zp_bscno +'</f_zp_bscno>';
            xml = xml + '  <fcuststatus>' + fcuststatus +'</fcuststatus>';
            xml = xml + ' </BPM_custshare>';
            xml = xml + ' </FormData>';
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
    var ftbcompany = $("#ftbcompany").val();
    var fdjcompany = $("#fdjcompany").val();
    var fdate = $("#fdate").val();
    var fcusno = $("#fcusno").val();
    var fcusname = $("#fcusname").val();
    var f_dj_dqname = $("#f_dj_dqname").val();
    var f_dj_dqtel = $("#f_dj_dqtel").val();
    var f_dj_state = $("#f_dj_state").val();
    var f_dj_xsname = $("#f_dj_xsname").val();
    var f_dj_xstel = $("#f_dj_xstel").val();
    var f_dj_plan = $("#f_dj_plan").val();
    var f_dj_djname = $("#f_dj_djname").val();
    var f_dj_djtel = $("#f_dj_djtel").val();
    var f_dj_product = $("#f_dj_product").val();
    var f_dj_xsfs = $("#f_dj_xsfs").val();
    var f_dj_xsl = $("#f_dj_xsl").val();
    var f_zp_xsgs = $("#f_zp_xsgs").val();
    var f_zp_dq = $("#f_zp_dq").val();
    var f_zp_bsc = $("#f_zp_bsc").val();
    var f_zp_dqname = $("#f_zp_dqname").val();
    var f_zp_dqtel = $("#f_zp_dqtel").val();
    var f_zp_state = $("#f_zp_state").val();
    var f_zp_bscname = $("#f_zp_bscname").val();
    var f_zp_bsctel = $("#f_zp_bsctel").val();
    var f_zp_date = $("#f_zp_date").val();
    var f_zp_djname = $("#f_zp_djname").val();
    var f_zp_djtel = $("#f_zp_djtel").val();
    var f_zp_problem = $("#f_zp_problem").val();
    var f_zp_product = $("#f_zp_product").val();
    var f_zp_xsfs = $("#f_zp_xsfs").val();
    var f_zp_xsl = $("#f_zp_xsl").val();
    var f_dj_xsno = $("#f_dj_xsno").val();
    var f_dj_djno = $("#f_dj_djno").val();
    var f_zp_dqno = $("#f_zp_dqno").val();
    var f_zp_bscno = $("#f_zp_bscno").val();
    var fcuststatus = $("#fcuststatus").val();

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
                consignUserStr = (String)($('#consignUser').val()).replace(",", ";");



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
            xml = xml + '<ConsignEnabled>True</ConsignEnabled>';
            xml = xml + '<ConsignUsers>' + consignUserStr + '</ConsignUsers>';
            xml = xml + '<ConsignRoutingType>' + consignRoutingType + '</ConsignRoutingType>';
            xml = xml + '<ConsignReturnType>' + consignReturnType + '</ConsignReturnType>';

            xml = xml + '<InviteIndicateUsers></InviteIndicateUsers>';
            xml = xml + '</Header>';
            xml = xml + '<FormData>';
            xml = xml + ' <BPM_custshare>';
            xml = xml + '  <fbillno>' + fbillno + '</fbillno>';
            xml = xml + ' <fname>' + fname + '</fname>';
            xml = xml + ' <ftbcompany>' + ftbcompany + '</ftbcompany>';
            xml = xml + ' <fdjcompany>' + fdjcompany + '</fdjcompany>';
            xml = xml + ' <fdate>' + fdate + '</fdate>';
            xml = xml + ' <fcusno>' + fcusno + '</fcusno>';
            xml = xml + ' <fcusname>' + fcusname + '</fcusname>';
            xml = xml + ' <f_dj_dqname>' + f_dj_dqname + '</f_dj_dqname>';
            xml = xml + ' <f_dj_dqtel>' + f_dj_dqtel + '</f_dj_dqtel>';
            xml = xml + ' <f_dj_state>' + f_dj_state + '</f_dj_state>';
            xml = xml + ' <f_dj_xsname>' + f_dj_xsname + '</f_dj_xsname>';
            xml = xml + ' <f_dj_xstel>' + f_dj_xstel + '</f_dj_xstel>';
            xml = xml + ' <f_dj_plan>' + f_dj_plan + '</f_dj_plan>';
            xml = xml + ' <f_dj_djname>' + f_dj_djname + '</f_dj_djname>';
            xml = xml + ' <f_dj_djtel>' + f_dj_djtel + '</f_dj_djtel>';
            xml = xml + ' <f_dj_product>' + f_dj_product + '</f_dj_product>';
            xml = xml + ' <f_dj_xsfs>' + f_dj_xsfs + '</f_dj_xsfs>';
            xml = xml + '  <f_dj_xsl>' + f_dj_xsl + '</f_dj_xsl>';
            xml = xml + ' <f_zp_xsgs>' + f_zp_xsgs + '</f_zp_xsgs>';
            xml = xml + ' <f_zp_dq>' + f_zp_dq + '</f_zp_dq>';
            xml = xml + '  <f_zp_bsc>' + f_zp_bsc + '</f_zp_bsc>';
            xml = xml + '  <f_zp_dqname>' + f_zp_dqname + '</f_zp_dqname>';
            xml = xml + '   <f_zp_dqtel>' + f_zp_dqtel + '</f_zp_dqtel>';
            xml = xml + '  <f_zp_state>' + f_zp_state + '</f_zp_state>';
            xml = xml + '   <f_zp_bscname>' + f_zp_bscname + '</f_zp_bscname>';
            xml = xml + '   <f_zp_bsctel>' + f_zp_bsctel + '</f_zp_bsctel>';
            xml = xml + '   <f_zp_date>' + f_zp_date + '</f_zp_date>';
            xml = xml + ' <f_zp_djname>' + f_zp_djname + '</f_zp_djname>';
            xml = xml + '  <f_zp_djtel>' + f_zp_djtel + '</f_zp_djtel>';
            xml = xml + '   <f_zp_problem>' + f_zp_problem + '</f_zp_problem>';
            xml = xml + '  <f_zp_product>' + f_zp_product + '</f_zp_product>';
            xml = xml + ' <f_zp_xsfs>' + f_zp_xsfs + '</f_zp_xsfs>';
            xml = xml + '  <f_zp_xsl>' + f_zp_xsl + '</f_zp_xsl>';
            xml = xml + '  <f_dj_xsno>' + f_dj_xsno + '</f_dj_xsno>';
            xml = xml + '  <f_dj_djno>' + f_dj_djno + '</f_dj_djno>';
            xml = xml + '  <f_zp_dqno>' + f_zp_dqno + '</f_zp_dqno>';
            xml = xml + ' <f_zp_bscno>' + f_zp_bscno + '</f_zp_bscno>';
            xml = xml + '  <fcuststatus>' + fcuststatus + '</fcuststatus>';
            xml = xml + ' </BPM_custshare>';
            xml = xml + ' </FormData>';
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


     

        xml = xml + '<InviteIndicateUsers></InviteIndicateUsers>';
        xml = xml + '</Header>';
        xml = xml + '<FormData>';
        xml = xml + ' <BPM_custshare>';
        xml = xml + '  <fbillno>' + fbillno + '</fbillno>';
        xml = xml + ' <fname>' + fname + '</fname>';
        xml = xml + ' <ftbcompany>' + ftbcompany + '</ftbcompany>';
        xml = xml + ' <fdjcompany>' + fdjcompany + '</fdjcompany>';
        xml = xml + ' <fdate>' + fdate + '</fdate>';
        xml = xml + ' <fcusno>' + fcusno + '</fcusno>';
        xml = xml + ' <fcusname>' + fcusname + '</fcusname>';
        xml = xml + ' <f_dj_dqname>' + f_dj_dqname + '</f_dj_dqname>';
        xml = xml + ' <f_dj_dqtel>' + f_dj_dqtel + '</f_dj_dqtel>';
        xml = xml + ' <f_dj_state>' + f_dj_state + '</f_dj_state>';
        xml = xml + ' <f_dj_xsname>' + f_dj_xsname + '</f_dj_xsname>';
        xml = xml + ' <f_dj_xstel>' + f_dj_xstel + '</f_dj_xstel>';
        xml = xml + ' <f_dj_plan>' + f_dj_plan + '</f_dj_plan>';
        xml = xml + ' <f_dj_djname>' + f_dj_djname + '</f_dj_djname>';
        xml = xml + ' <f_dj_djtel>' + f_dj_djtel + '</f_dj_djtel>';
        xml = xml + ' <f_dj_product>' + f_dj_product + '</f_dj_product>';
        xml = xml + ' <f_dj_xsfs>' + f_dj_xsfs + '</f_dj_xsfs>';
        xml = xml + '  <f_dj_xsl>' + f_dj_xsl + '</f_dj_xsl>';
        xml = xml + ' <f_zp_xsgs>' + f_zp_xsgs + '</f_zp_xsgs>';
        xml = xml + ' <f_zp_dq>' + f_zp_dq + '</f_zp_dq>';
        xml = xml + '  <f_zp_bsc>' + f_zp_bsc + '</f_zp_bsc>';
        xml = xml + '  <f_zp_dqname>' + f_zp_dqname + '</f_zp_dqname>';
        xml = xml + '   <f_zp_dqtel>' + f_zp_dqtel + '</f_zp_dqtel>';
        xml = xml + '  <f_zp_state>' + f_zp_state + '</f_zp_state>';
        xml = xml + '   <f_zp_bscname>' + f_zp_bscname + '</f_zp_bscname>';
        xml = xml + '   <f_zp_bsctel>' + f_zp_bsctel + '</f_zp_bsctel>';
        xml = xml + '   <f_zp_date>' + f_zp_date + '</f_zp_date>';
        xml = xml + ' <f_zp_djname>' + f_zp_djname + '</f_zp_djname>';
        xml = xml + '  <f_zp_djtel>' + f_zp_djtel + '</f_zp_djtel>';
        xml = xml + '   <f_zp_problem>' + f_zp_problem + '</f_zp_problem>';
        xml = xml + '  <f_zp_product>' + f_zp_product + '</f_zp_product>';
        xml = xml + ' <f_zp_xsfs>' + f_zp_xsfs + '</f_zp_xsfs>';
        xml = xml + '  <f_zp_xsl>' + f_zp_xsl + '</f_zp_xsl>';
        xml = xml + '  <f_dj_xsno>' + f_dj_xsno + '</f_dj_xsno>';
        xml = xml + '  <f_dj_djno>' + f_dj_djno + '</f_dj_djno>';
        xml = xml + '  <f_zp_dqno>' + f_zp_dqno + '</f_zp_dqno>';
        xml = xml + ' <f_zp_bscno>' + f_zp_bscno + '</f_zp_bscno>';
        xml = xml + '  <fcuststatus>' + fcuststatus + '</fcuststatus>';
        xml = xml + ' </BPM_custshare>';
        xml = xml + ' </FormData>';
        xml = xml + '</XForm>';
        PostXml(xml);
    }

}