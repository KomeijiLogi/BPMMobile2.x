function prepMsg() {

    $("#fdate").val(getNowFormatDate(2));
    tapEvent();
    var xml = `<?xml version= "1.0" ?>
                  <Requests>
                      <Params>
                      <Method>GetFormPostData</Method>
                      <ProcessName>医用制品集团参观申请</ProcessName>
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
        $("#fname").val(item.申请人);
        $("#fjt").val(item.所属集团);
        $("#fzgs").val(item.所属子公司);
    }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
        if (XMLHttpRequest.status == "401") {
            mui.alert('授权过期，请重新打开页面');;
        } else if (XMLHttpRequest.status == "500") {
            mui.alert('服务器内部错误');
        }

        });
    initOrgMsg();
}

var tapFlag = 0;
function tapEvent() {
    mui("#fif_cjd").each(function () {
        this.addEventListener('toggle', function (event) {
            //event.detail.isActive 可直接获取当前状态
            if (event.detail.isActive) {
                $("#fif_cj").val('是');
            } else {
                $("#fif_cj").val('否');
            }
        });
    });
    //选择所属子公司，所属分公司
    $("#fcgzgs").on('tap', function () {
        $("#wrapper").hide();
        $("#selector").show();
        tapFlag = 1;
    });
    $("#fcgfgs").on('tap', function () {
        $("#wrapper").hide();
        $("#selector").show();
        tapFlag = 2;
    });


    $(".mui-icon-left-nav").on('tap', function () {
        $("#wrapper").show();
        $("#selector").hide();
        tapFlag = 0;
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
        var checkedObjs = [];
        checkboxArray.forEach(function (box) {
            if (box.checked) {
                checkedValues.push(box.parentNode.innerText);
                var cobj = {
                    fbmmc: $(box).data('fbmmc'),
                    OUFullName: $(box).data('oufullname'),
                    OUCode: $(box).data('oucode'),
                    fsname: $(box).data('fsname')
                };
                checkedObjs.push(cobj);
                //console.log(checkedObjs);
                //取消选中，防止再次进入列表中会选中某一项
                box.checked = !box.checked;

            }
        });
        if (checkedValues.length > 0) {
            if (tapFlag == 1) {
                //选择的参观子公司
                $("#fcgzgs").val(checkedValues[0]);
            } else if (tapFlag == 2){
                //选择的参观分公司
                $("#fcgfgs").val(checkedValues[0]);
            }

            $("#selector").hide();
            $("#wrapper").show();
            tapFlag = 0;
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


//加载组织信息
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
    xml = xml + '         <code>01</code>';
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
        console.log(item);
        var li = ``;
        for (var i = 0; i < item.length; i++) {
            li += `<li data-value="" data-tags="" class="mui-table-view-cell mui-indexed-list-item mui-radio mui-left">
                       <input type="radio" name="checkbox" data-fbmmc="${item[i].ouname}"
                         data-oufullname="${item[i].fname}" data-oucode="${item[i].code}"
                         data-fsname="${item[i].fsname}" />${item[i].ouname}
                    </li>`;

        }
        $("#datalist").append(li);
    }).fail(function (e) {

    }).then(function () {
        prepIndexedList();
    });
}

function initData(data, flag) {
    var item = data.FormDataSet.医用制品集团参观申请表[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.fbillno);
    }
    $("#fname").val(item.申请人);
    $("#fjt").val(item.所属集团);
    $("#fzgs").val(item.所属子公司);
    $("#fdate").val(FormatterTimeYMS(item.申请日期));
    $("#ftel").val(item.联系方式);
    $("#fcgzgs").val(item.参观子公司);
    $("#fcgfgs").val(item.参观分公司);
    $("#fcgsj").val(item.参观时间);
    $("#fcgrqlb").val(item.参观人群类别);
    $("#fcgrs").val(item.参观人数);
    $("#fif_cj").val(item.是否进入车间);
    if (String(item.是否进入车间) == '是') {
        $("#fif_cjd").addClass('mui-active');
    }
    $("#fcgmd").val(item.参观目的);
    $("#fxm").val(item.姓名);
    $("#fszgs").val(item.所在公司);
    $("#fzw").val(item.职务);
    $("#flxfs").val(item.带队联系方式);



}

function nodeControllerExp(NodeName) {
    if (String(NodeName).match('开始') != null) {
        tapEvent();
        $("#fif_cjd").removeClass('mui-disabled');
        $("#ftel,#fcgsj,#fcgrqlb,#fcgrs,#fcgmd,#fxm,#fszgs,#fzw,#flxfs").removeAttr('readonly');
        initOrgMsg();
    }
}

function Save() {
    var fname = $("#fname").val();
    var fjt = $("#fjt").val();
    var fzgs = $("#fzgs").val();
    var fdate = $("#fdate").val();
    var ftel = $("#ftel").val();
    var fcgzgs = $("#fcgzgs").val();
    var fcgfgs = $("#fcgfgs").val();
    var fcgsj = $("#fcgsj").val();
    var fcgrqlb = $("#fcgrqlb").val();
    var fcgrs = $("#fcgrs").val();
    var fif_cj = $("#fif_cj").val();
    var fcgmd = $("#fcgmd").val();
    var fxm = $("#fxm").val();
    var fszgs = $("#fszgs").val();
    var fzw = $("#fzw").val();
    var flxfs = $("#flxfs").val();

    if (!ftel) {
        mui.toast('请填写联系方式');
        return;
    }
    if (!fcgzgs) {
        mui.toast('请选择参观子公司');
        return;
    }
    if (!fcgfgs) {
        mui.toast('请选择参观分公司');
        return;
    }
    if (!fcgsj) {
        mui.toast('请选择参观时间');
        return;
    }
    if (!fcgrqlb) {
        mui.toast('请填写参观人群类别');
        return;
    }

    if (!fcgmd) {
        mui.toast('请填写参观目的');
        return;
    }
    if (!fxm) {
        mui.toast('请填写姓名');
        return;
    }
    if (!fszgs) {
        mui.toast('请填写所在公司');
        return;
    }
    if (!fzw) {
        mui.toast('请填写职务');
        return;
    }
    if (!flxfs) {
        mui.toast('请填写联系方式');
        return;
    }
    var btnArry = ["取消", "确定"];
    mui.confirm('即将提交，是否确定？', '提交确认提醒', btnArry, function (e) {
        if (e.index == 1) {
            var xml = `<?xml version="1.0"?>
                        <XForm>
                            <Header>
                                <Method>Post</Method>
                                <ProcessName>医用制品集团参观申请</ProcessName>
                                <ProcessVersion>${version}</ProcessVersion>
                                <DraftGuid></DraftGuid>
                                <OwnerMemberFullName>${BPMOU}</OwnerMemberFullName>
                                <Action>提交</Action>
                                <Comment></Comment>
                                <UrlParams></UrlParams>
                                <ConsignEnabled>false</ConsignEnabled>
                                <ConsignUsers>[]</ConsignUsers>
                                <ConsignRoutingType>Parallel</ConsignRoutingType>
                                <ConsignReturnType>Return</ConsignReturnType>
                                <InviteIndicateUsers>[]</InviteIndicateUsers>
                                <Context>{&quot;Routing&quot;:{}}</Context>
                            </Header>
                           <FormData>
                                <医用制品集团参观申请表>
                                    <单号>自动带出</单号>
                                    <申请人>${fname}</申请人>
                                    <所属集团>${fjt}</所属集团>
                                    <所属子公司>${fzgs}</所属子公司>
                                    <申请日期>${fdate}</申请日期>
                                    <联系方式>${ftel}</联系方式>
                                    <参观子公司>${fcgzgs}</参观子公司>
                                    <参观分公司>${fcgfgs}</参观分公司>
                                    <参观时间>${fcgsj}</参观时间>
                                    <参观人群类别>${fcgrqlb}</参观人群类别>
                                    <参观人数>${fcgrs}</参观人数>
                                    <是否进入车间>${fif_cj}</是否进入车间>
                                    <参观目的>${fcgmd}</参观目的>
                                    <姓名>${fxm}</姓名>
                                    <所在公司>${fszgs}</所在公司>
                                    <职务>${fzw}</职务>
                                    <带队联系方式>${flxfs}</带队联系方式>
                                </医用制品集团参观申请表> 
                           </FormData>
                    </XForm>
                      `;
            PostXml(xml);

        }
    });
}

function reSave() {
    var fbillno = $("#fbillno").val();
    var pid = $("#stepId").val();
    var fname = $("#fname").val();
    var fjt = $("#fjt").val();
    var fzgs = $("#fzgs").val();
    var fdate = $("#fdate").val();
    var ftel = $("#ftel").val();
    var fcgzgs = $("#fcgzgs").val();
    var fcgfgs = $("#fcgfgs").val();
    var fcgsj = $("#fcgsj").val();
    var fcgrqlb = $("#fcgrqlb").val();
    var fcgrs = $("#fcgrs").val();
    var fif_cj = $("#fif_cj").val();
    var fcgmd = $("#fcgmd").val();
    var fxm = $("#fxm").val();
    var fszgs = $("#fszgs").val();
    var fzw = $("#fzw").val();
    var flxfs = $("#flxfs").val();

    if (!ftel) {
        mui.toast('请填写联系方式');
        return;
    }
    if (!fcgzgs) {
        mui.toast('请选择参观子公司');
        return;
    }
    if (!fcgfgs) {
        mui.toast('请选择参观分公司');
        return;
    }
    if (!fcgsj) {
        mui.toast('请选择参观时间');
        return;
    }
    if (!fcgrqlb) {
        mui.toast('请填写参观人群类别');
        return;
    }

    if (!fcgmd) {
        mui.toast('请填写参观目的');
        return;
    }
    if (!fxm) {
        mui.toast('请填写姓名');
        return;
    }
    if (!fszgs) {
        mui.toast('请填写所在公司');
        return;
    }
    if (!fzw) {
        mui.toast('请填写职务');
        return;
    }
    if (!flxfs) {
        mui.toast('请填写联系方式');
        return;
    }
    var btnArry = ["取消", "确定"];
    mui.confirm('即将提交，是否确定？', '提交确认提醒', btnArry, function (e) {
        if (e.index == 1) {
            var xml = `<?xml version="1.0"?>
                         <XForm>
                           <Header>
                             <Method>Process</Method>
                             <PID>${pid}</PID>
                             <Action>提交</Action>
                              <Comment></Comment>
                             <InviteIndicateUsers></InviteIndicateUsers>
                           </Header>
                           <FormData>
                              <医用制品集团参观申请表>
                                    <单号>${fbillno}</单号>
                                    <申请人>${fname}</申请人>
                                    <所属集团>${fjt}</所属集团>
                                    <所属子公司>${fzgs}</所属子公司>
                                    <申请日期>${fdate}</申请日期>
                                    <联系方式>${ftel}</联系方式>
                                    <参观子公司>${fcgzgs}</参观子公司>
                                    <参观分公司>${fcgfgs}</参观分公司>
                                    <参观时间>${fcgsj}</参观时间>
                                    <参观人群类别>${fcgrqlb}</参观人群类别>
                                    <参观人数>${fcgrs}</参观人数>
                                    <是否进入车间>${fif_cj}</是否进入车间>
                                    <参观目的>${fcgmd}</参观目的>
                                    <姓名>${fxm}</姓名>
                                    <所在公司>${fszgs}</所在公司>
                                    <职务>${fzw}</职务>
                                    <带队联系方式>${flxfs}</带队联系方式>
                                </医用制品集团参观申请表> 
                           </FormData>
                    </XForm>
                      `;
            PostXml(xml);
        }
    });


}
function hasRead() {
    var pid = $("#stepId").val();
    var fbillno = $("#fbillno").val();
    var comment = '';
    var btnArray = ['取消', '确定'];
    mui.prompt('请选填知会意见', '可以不填', '知会意见', btnArray, function (e) {
        if (e.index == 1) {
            comment = e.value;
            var xml = `<?xml version="1.0"?>
                           <XForm>
                             <Header>
                               <Method>InformSubmit</Method>
                               <PID>${pid}</PID>
                               <Comment>${comment}</Comment>
                             </Header>
                           </XForm>
              `;
            PostXml(xml);
        }
    });
}

function AgreeOrConSign() {
    var pid = $("#stepId").val();
    var fbillno = $("#fbillno").val();
    var comment = $("#signSuggest").val();
    var nodeName = $("#nodeName").val();
    var fname = $("#fname").val();
    var fjt = $("#fjt").val();
    var fzgs = $("#fzgs").val();
    var fdate = $("#fdate").val();
    var ftel = $("#ftel").val();
    var fcgzgs = $("#fcgzgs").val();
    var fcgfgs = $("#fcgfgs").val();
    var fcgsj = $("#fcgsj").val();
    var fcgrqlb = $("#fcgrqlb").val();
    var fcgrs = $("#fcgrs").val();
    var fif_cj = $("#fif_cj").val();
    var fcgmd = $("#fcgmd").val();
    var fxm = $("#fxm").val();
    var fszgs = $("#fszgs").val();
    var fzw = $("#fzw").val();
    var flxfs = $("#flxfs").val();

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
            var xml = `<?xml version="1.0"?>
                     <XForm>
                     <Header>
                     <Method>Process</Method>
                     <PID>${pid}</PID>
                     <Action>同意</Action>
                     <Comment>${comment}</Comment>
            
                     <ConsignEnabled>true</ConsignEnabled>
                     <ConsignUsers>${consignUserStr}</ConsignUsers>
                     <ConsignRoutingType>${consignRoutingType}</ConsignRoutingType>
                     <ConsignReturnType>${consignReturnType}</ConsignReturnType>
                     <InviteIndicateUsers>[]</InviteIndicateUsers>
                     <Context>{&quot;Routing&quot;:{}}</Context>
                     </Header>
                     <FormData>
                          <医用制品集团参观申请表>
                                    <单号>${fbillno}</单号>
                                    <申请人>${fname}</申请人>
                                    <所属集团>${fjt}</所属集团>
                                    <所属子公司>${fzgs}</所属子公司>
                                    <申请日期>${fdate}</申请日期>
                                    <联系方式>${ftel}</联系方式>
                                    <参观子公司>${fcgzgs}</参观子公司>
                                    <参观分公司>${fcgfgs}</参观分公司>
                                    <参观时间>${fcgsj}</参观时间>
                                    <参观人群类别>${fcgrqlb}</参观人群类别>
                                    <参观人数>${fcgrs}</参观人数>
                                    <是否进入车间>${fif_cj}</是否进入车间>
                                    <参观目的>${fcgmd}</参观目的>
                                    <姓名>${fxm}</姓名>
                                    <所在公司>${fszgs}</所在公司>
                                    <职务>${fzw}</职务>
                                    <带队联系方式>${flxfs}</带队联系方式>
                                </医用制品集团参观申请表> 
                           </FormData>
                    </XForm>
                       `;
            PostXml(xml);
            
        });
    } else {
        var xml = `<?xml version="1.0"?>
                   <XForm>
                   <Header>
                   <Method>Process</Method>
                   <PID>${pid}</PID>
                   <Action>同意</Action>
                   <Comment>${comment}</Comment>

                    <UrlParams></UrlParams>
                    <ConsignEnabled>false</ConsignEnabled>
                    <ConsignUsers>[]</ConsignUsers>
                    <ConsignRoutingType>Parallel</ConsignRoutingType>
                    <ConsignReturnType>Return</ConsignReturnType>

                  <InviteIndicateUsers>[]</InviteIndicateUsers>
                  <Context>{&quot;Routing&quot;:{}}</Context>
                  </Header>
                  <FormData>
                          <医用制品集团参观申请表>
                                    <单号>${fbillno}</单号>
                                    <申请人>${fname}</申请人>
                                    <所属集团>${fjt}</所属集团>
                                    <所属子公司>${fzgs}</所属子公司>
                                    <申请日期>${fdate}</申请日期>
                                    <联系方式>${ftel}</联系方式>
                                    <参观子公司>${fcgzgs}</参观子公司>
                                    <参观分公司>${fcgfgs}</参观分公司>
                                    <参观时间>${fcgsj}</参观时间>
                                    <参观人群类别>${fcgrqlb}</参观人群类别>
                                    <参观人数>${fcgrs}</参观人数>
                                    <是否进入车间>${fif_cj}</是否进入车间>
                                    <参观目的>${fcgmd}</参观目的>
                                    <姓名>${fxm}</姓名>
                                    <所在公司>${fszgs}</所在公司>
                                    <职务>${fzw}</职务>
                                    <带队联系方式>${flxfs}</带队联系方式>
                                </医用制品集团参观申请表> 
                           </FormData>
                    </XForm>
              `;
        PostXml(xml);
    }

}