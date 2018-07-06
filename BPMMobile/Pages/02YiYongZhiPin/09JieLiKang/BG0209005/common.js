function prepMsg() {
    tapEvent();
    $("#fsqrq").val(getNowFormatDate(2));
    var xml = `<?xml version= "1.0" ?>
                  <Requests>
                      <Params>
                      <Method>GetFormPostData</Method>
                      <ProcessName>洁丽康公司盖章申请</ProcessName>
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
        $("#fsqr").val(item.申请人);
        $("#fsqbm").val(item.申请部门);


    }).fail(function (e) {

    }).then(function () {

        });
    uploadOpt();
}

function tapEvent() {

    var fyzlx_data = [
        {
            value: '',
            text:'公章'
        },
        {
            value: '',
            text:'合同章'
        }

    ];


    var picker = new mui.PopPicker();
    picker.setData(fyzlx_data);

    $("#fyzlx").on('tap', function () {
        var _self = this;
        picker.show(function (items) {

            $(_self).val(items[0].text);
            if (items[0].text == '公章') {
                $("#fgz_card").show();
                $("#fhtz_card").hide();
            } else if (items[0].text == '合同章') {
                $("#fgz_card").hide();
                $("#fhtz_card").show();
            }
        });        
    });

    searchInfo();
}
function searchInfo() {
    var xml = `<?xml version= "1.0" ?>
                                 <Requests>
                                 <Params>
                                 <DataSource>BPM_WEGO2018</DataSource>
                                 <ID>erpcloud_查询洁丽康公司_盖章类别_主表</ID>
                                 <Type>1</Type>
                                 <Method>GetUserDataProcedure</Method>
                                 <ProcedureName>erpcloud_查询洁丽康公司_盖章类别_主表</ProcedureName>
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
        var data = provideData.Tables[0].Rows;
        console.log(data);
        var doArr=[];
        for (var di of data) {
            var dOb = {
                value: di.ID,
                text: di.分类 + '--' + di.文件类别,
                name: di.审批人姓名,
                no: di.审批人工号,
                fileClass: di.文件类别,
                classification: di.分类
            }
            doArr.push(dOb);
        }
        var picker = new mui.PopPicker();
        picker.setData(doArr);
        $("#fwjlb").on('tap', function () {
            var _self = this;
            picker.show(function (items) {
                $("#fwjlb").val(items[0].fileClass);
                $("#ffileid").val(items[0].value);
                $("#fsprno").val(items[0].no);
                $("#fsprxm").val(items[0].name);

            });
        });

    }).fail(function (e) {

    });

}

function initData(data, flag) {
    var item = data.FormDataSet.洁丽康公司_盖章申请_主表[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.单号);
    }
    
    $("#fsqr").val(item.申请人);
    $("#fsqbm").val(item.申请部门);
    $("#fsqrq").val(FormatterTimeYMS(item.申请日期));
    $("#fyzlx").val(item.印章类型);
    $("#ffs").val(item.份数);
    $("#fgzsl").val(item.盖章数量);
    $("#fwjmc").val(item.文件名称);
    $("#fyt").val(item.用途);
    $("#fdfgs").val(item.对方公司);
    $("#fhtje").val(item.合同金额);
    $("#fhtjynr").val(item.合同简要内容);
    $("#fwjlb").val(item.文件类别);
    $("#ffileid").val(item.文件类别ID);
    $("#fsprno").val(item.审批人工号);
    $("#fsprxm").val(item.审批人姓名);

    if (item.印章类型 == '公章') {
        $("#fhtz_card").hide();
        $("#fgz_card").show();
    } else if (item.印章类型 == '合同章') {
        $("#fhtz_card").show();
        $("#fgz_card").hide();
    }


    if (item.附件 != null && item.附件 != "") {
        var fjtmp = (String)(item.附件);

        fjArray = fjtmp.split(";");


        //console.log("fjArray:" + fjArray);

        //请求附件详细信息
        $.ajax({
            type: 'POST',
            url: '/api/bpm/GetAttachmentsInfo',
            //dataType:'json',
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
                        var downurl = baseDownloadUrl + data[i].FileID;

                        var attach = attachItem(name, type, size, time, downurl);
                        attachArray.push(attach);

                        var li = '<div class="pic-preview smallyulan success">';
                        li = li + ' <div class="del none" style="opacity:1;z-index:999;"onclick="delPicture(this)">x</div>';

                        //类型判断 
                        if ((data[i].Ext).indexOf("png") != -1 || (data[i].Ext).indexOf("jpg") != -1 || (data[i].Ext).indexOf("bmp") != -1) {

                            //li = li + '    <div class="img-wrap smallimg" id="simg" ><a href="'+baseDownloadUrl + data[i].FileID + '"><img src="'+baseDownloadUrl + data[i].FileID + '"/></a></div>';
                            li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '" ><img src="' + baseDownloadUrl + data[i].FileID + '"/></div>';

                        } else if ((data[i].Ext).indexOf("xls") != -1) {

                            li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '"><img src="../../Content/images/xlsx@2x.png"/></div>';

                        } else if ((data[i].Ext).indexOf("doc") != -1) {

                            li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '"><img src="../../Content/images/docx@2x.png"/></div>';

                        } else if ((data[i].Ext).indexOf("ppt") != -1) {

                            li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '"><img src="../../Content/images/ppt@2x.png"/></div>';

                        } else if ((data[i].Ext).indexOf("pdf") != -1) {

                            li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '"><img src="../../Content/images/pdf@2x.png"/></div>';

                        } else if ((data[i].Ext).indexOf("zip") != -1 || (data[i].Ext).indexOf("rar") != -1 || (data[i].Ext).indexOf("7z") != -1) {

                            li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '"><img src="../../Content/images/zip@2x.png"/></div>';

                        } else if ((data[i].Ext).indexOf("txt") != -1) {

                            li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '"><img src="../../Content/images/txt@2x.png"/></div>';

                        } else {
                            li = li + '    <div class="img-wrap smallimg imgdiv" id="' + i + '"><img src="../../Content/images/unkown@2x.png"/></div>';
                        }

                        li = li + ' </div>';
                        li = li + '</div>';
                        $(".upload-img-list").append(li);


                        $(".imgdiv").each(function () {

                            $(this).parent().find(".del.none").hide();

                        });




                    }
                    watch();
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


}


function nodeControllerExp(NodeName) {
    if (String(NodeName).match('开始') != null) {
        tapEvent();
        $("#fhtz_card,#fgz_card").find("textarea,input").each(function () {
            $(this).removeAttr('readonly');
        });
        uploadOpt();
    }
}


function Save() {
    var fsqr = $("#fsqr").val();
    var fsqbm = $("#fsqbm").val();
    var fsqrq = $("#fsqrq").val();
    var fyzlx = $("#fyzlx").val();
    var ffs = $("#ffs").val();
    var fgzsl = $("#fgzsl").val();
    var fwjmc = $("#fwjmc").val();
    var fyt = $("#fyt").val();
    var fdfgs = $("#fdfgs").val();
    var fhtje = $("#fhtje").val();
    var fhtjynr = $("#fhtjynr").val();
    var fwjlb = $("#fwjlb").val();
    var ffileid = $("#ffileid").val();
    var fsprno = $("#fsprno").val();
    var fsprxm = $("#fsprxm").val();
    if (fyzlx == '公章') {

        if (!fwjmc) {
            mui.toast('请填写文件名称');
            return;
        }
        if (!fyt) {
            mui.toast('请填写用途');
            return;
        }
    } else if (fyzlx == '合同章') {
        if (!fdfgs) {
            mui.toast('请填写对方公司');
            return;
        }
        if (!fhtje) {
            mui.toast('请填写合同金额');
            return;
        }

    }


    var btnArry = ["取消", "确定"];
    mui.confirm('即将提交，是否确定？', '提交确认提醒', btnArry, function (e) {
        if (e.index == 1) {
            var xml = `<?xml version="1.0"?>
                        <XForm>
                            <Header>
                                <Method>Post</Method>
                                <ProcessName>洁丽康公司盖章申请</ProcessName>
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
                       `;
            xml += `
 <洁丽康公司_盖章申请_主表>
            <单号>自动生成</单号>
            <申请人>${fsqr}</申请人>
            <申请部门>${fsqbm}</申请部门>
            <申请日期>${fsqrq}</申请日期>
            <印章类型>${fyzlx}</印章类型>
            <份数>${ffs}</份数>
            <盖章数量>${fgzsl}</盖章数量>
  <文件类别>${fwjlb}</文件类别>
            <文件名称>${fwjmc}</文件名称>
            <用途>${fyt}</用途>
            <对方公司>${fdfgs}</对方公司>
            <合同金额>${fhtje}</合同金额>
            <合同简要内容>${fhtjynr}</合同简要内容>
            <附件>${fjArray.join(";")}</附件>
           <文件类别ID>${ffileid}</文件类别ID>
            <审批人工号>${fsprno}</审批人工号>
            <审批人姓名>${fsprxm}</审批人姓名>
        </洁丽康公司_盖章申请_主表>
                   `;
            xml += `
                       </FormData>
                    </XForm>
                   `;
            PostXml(xml);
             
        }
    })
}

function reSave() {

    var fbillno = $("#fbillno").val();
    var pid = $("#stepId").val();

    var fsqr = $("#fsqr").val();
    var fsqbm = $("#fsqbm").val();
    var fsqrq = $("#fsqrq").val();
    var fyzlx = $("#fyzlx").val();
    var ffs = $("#ffs").val();
    var fgzsl = $("#fgzsl").val();
    var fwjmc = $("#fwjmc").val();
    var fyt = $("#fyt").val();
    var fdfgs = $("#fdfgs").val();
    var fhtje = $("#fhtje").val();
    var fhtjynr = $("#fhtjynr").val();
    var fwjlb = $("#fwjlb").val();
    var ffileid = $("#ffileid").val();
    var fsprno = $("#fsprno").val();
    var fsprxm = $("#fsprxm").val();
    if (fyzlx == '公章') {

        if (!fwjmc) {
            mui.toast('请填写文件名称');
            return;
        }
        if (!fyt) {
            mui.toast('请填写用途');
            return;
        }
    } else if (fyzlx == '合同章') {
        if (!fdfgs) {
            mui.toast('请填写对方公司');
            return;
        }
        if (!fhtje) {
            mui.toast('请填写合同金额');
            return;
        }

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
                       `;
            xml += `
 <洁丽康公司_盖章申请_主表>
            <单号>${fbillno}</单号>
            <申请人>${fsqr}</申请人>
            <申请部门>${fsqbm}</申请部门>
            <申请日期>${fsqrq}</申请日期>
            <印章类型>${fyzlx}</印章类型>
            <份数>${ffs}</份数>
            <盖章数量>${fgzsl}</盖章数量>
<文件类别>${fwjlb}</文件类别>
            <文件名称>${fwjmc}</文件名称>
            <用途>${fyt}</用途>
            <对方公司>${fdfgs}</对方公司>
            <合同金额>${fhtje}</合同金额>
            <合同简要内容>${fhtjynr}</合同简要内容>
            <附件>${fjArray.join(";")}</附件>
 <文件类别ID>${ffileid}</文件类别ID>
            <审批人工号>${fsprno}</审批人工号>
            <审批人姓名>${fsprxm}</审批人姓名>
        </洁丽康公司_盖章申请_主表>
                   `;
            xml += `
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

    var fsqr = $("#fsqr").val();
    var fsqbm = $("#fsqbm").val();
    var fsqrq = $("#fsqrq").val();
    var fyzlx = $("#fyzlx").val();
    var ffs = $("#ffs").val();
    var fgzsl = $("#fgzsl").val();
    var fwjmc = $("#fwjmc").val();
    var fyt = $("#fyt").val();
    var fdfgs = $("#fdfgs").val();
    var fhtje = $("#fhtje").val();
    var fhtjynr = $("#fhtjynr").val();

    var fwjlb = $("#fwjlb").val();
    var ffileid = $("#ffileid").val();
    var fsprno = $("#fsprno").val();
    var fsprxm = $("#fsprxm").val();


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
                     <FormData>`;
            xml += `
 <洁丽康公司_盖章申请_主表>
            <单号>${fbillno}</单号>
            <申请人>${fsqr}</申请人>
            <申请部门>${fsqbm}</申请部门>
            <申请日期>${fsqrq}</申请日期>
            <印章类型>${fyzlx}</印章类型>
            <份数>${ffs}</份数>
            <盖章数量>${fgzsl}</盖章数量>
<文件类别>${fwjlb}</文件类别>
            <文件名称>${fwjmc}</文件名称>
            <用途>${fyt}</用途>
            <对方公司>${fdfgs}</对方公司>
            <合同金额>${fhtje}</合同金额>
            <合同简要内容>${fhtjynr}</合同简要内容>
            <附件>${fjArray.join(";")}</附件>
 <文件类别ID>${ffileid}</文件类别ID>
            <审批人工号>${fsprno}</审批人工号>
            <审批人姓名>${fsprxm}</审批人姓名>
        </洁丽康公司_盖章申请_主表>
                   `;
            xml += `
                       </FormData>
                    </XForm>
                   `;
            PostXml(xml);
        })
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
                  <FormData>`;
        xml += `
 <洁丽康公司_盖章申请_主表>
            <单号>${fbillno}</单号>
            <申请人>${fsqr}</申请人>
            <申请部门>${fsqbm}</申请部门>
            <申请日期>${fsqrq}</申请日期>
            <印章类型>${fyzlx}</印章类型>
            <份数>${ffs}</份数>
            <盖章数量>${fgzsl}</盖章数量>
<文件类别>${fwjlb}</文件类别>
            <文件名称>${fwjmc}</文件名称>
            <用途>${fyt}</用途>
            <对方公司>${fdfgs}</对方公司>
            <合同金额>${fhtje}</合同金额>
            <合同简要内容>${fhtjynr}</合同简要内容>
            <附件>${fjArray.join(";")}</附件>
 <文件类别ID>${ffileid}</文件类别ID>
            <审批人工号>${fsprno}</审批人工号>
            <审批人姓名>${fsprxm}</审批人姓名>
        </洁丽康公司_盖章申请_主表>
                   `;
        xml += `
                       </FormData>
                    </XForm>
                   `;
        PostXml(xml);
    }
}
