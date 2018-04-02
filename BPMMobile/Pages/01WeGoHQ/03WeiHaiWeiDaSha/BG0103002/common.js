function prepMsg() {
    $("#fdate").val(getNowFormatDate(2));
    tapEvent();

    var xml = `<?xml version= "1.0" ?>
                  <Requests>
                      <Params>
                      <Method>GetFormPostData</Method>
                      <ProcessName>威海卫大厦公函发布申请</ProcessName>
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


    initOrgMsg();
}


var openIdArrSelected = [];
function tapEvent() {
    //调用索引列表查询威海卫大厦BPM组织信息
    $("#tjmx_dept").on('tap',  ()=> {
        $("#wrapper").hide();
        $("#selector").show();
        var header = document.querySelector('header.mui-bar');
        var list = document.querySelector('#list');
        var done = document.querySelector('#done');
        //计算高度 
        list.style.height = (document.body.offsetHeight - header.offsetHeight) + 'px';
        //create
        window.indexedList = new mui.IndexedList(list);

    });
    $(".mui-icon-left-nav").on('tap', function () {
        $("#wrapper").show();
        $("#selector").hide();
    });

    //通过调用XuntongJSBridge来显示选人并展示包括头像
    $("#tjmx_user").on('tap',  ()=> {

        XuntongJSBridge.call('selectPersons', { 'isMulti': 'true', 'pType': '1' }, function (result) {
            //console.log(Object.prototype.toString.call(result));
            
            if (String(Object.prototype.toString.call(result)).match('String') != null) {
                result = JSON.parse(result);
            }
            //console.info(result.data);
            if (result.success == true || result.success == "true") {
                openIdArrSelected = [];   //清除之前记录
                for (var i = 0; i < result.data.persons.length; i++) {

                    openIdArrSelected.push(result.data.persons[i].openId);
                }
                //通过openid数组请求对应用户信息
                $.ajax({
                    type: "POST",
                    url: "/api/bpm/PostAccount",
                    data: { "ids": openIdArrSelected },
                    beforeSend: function (XHR) {
                        XHR.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem('ticket'));

                    }
                }).done((data) => {
                    console.info(data);
                    var li = ``;
                    for (var i = 0; i < data.data.length; i++) {
                        li += `
                               <div id="user" style="margin:1rem;">                                 
                                   <div style="display:flex;flex-direction:column;height:2.75rem;width:2.75rem;" onclick="deleteThis(this)">
                                       <img src="${data.data[i].photoUrl}" alt="" title="头像" style="border-radius:50%;margin-left:.2rem;"/>   
                                       <label style="padding-left:.4rem;">${data.data[i].name}</label>
                                       <input type="hidden" id="fno" name="fno" value="${data.data[i].phone}"/>  
                                        <input type="hidden" id="ALCType" name="ALCType" value=""/> 
                                   </div>                                
                               </div>
                             `;
                    }
                    $("#mxlist_user").append(li);

                    }).fail((e) => {
                        console.log(e);
                });
            }
        });
    });

    mui('#fifys_switch').each(function () { //循环所有toggle       
        /**
         * toggle 事件监听
         */
        this.addEventListener('toggle', function (event) {
            //event.detail.isActive 可直接获取当前状态
            if (event.detail.isActive) {
                $("#fifys").val('1');
            } else {
                $("#fifys").val('0');
            }
        });
    });
   
}
function deleteThis(context) {
    var btnArray = ['否', '是'];
    mui.confirm('确认删除？', '', btnArray, function (e) {
        if (e.index == 1) {
            $(context).parent().fadeOut();
        }
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
        var checkboxArray = [].slice.call(list.querySelectorAll('input[type="checkbox"]'));
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
                console.log(checkedObjs);
                //取消选中，防止再次进入列表中会选中某一项
                box.checked = !box.checked;

            }
        });
        if (checkedValues.length > 0) {
            for (var i = 0; i < checkedObjs.length; i++) {
                var li = `
                        <div class="mui-card" id="mx">                          
                            <div class="mui-row">
                                <div class="mui-col-xs-12 flexLine">
                                   
                                    <textarea rows="2" id="fsname" name="fsname" readonly>${checkedObjs[i].fsname}</textarea>
                                    <span class="mui-icon mui-icon-closeempty mui-pull-right" style="font-size:1.5rem;" onclick="deleteCard(this)"></span>
                                </div>
                                <input type="hidden" id="fbmmc" name="fbmmc" value="${checkedObjs[i].fbmmc}"/> 
                                <input type="hidden" id="OUFullName" name="OUFullName" value="${checkedObjs[i].OUFullName}"/>
                                <input type="hidden" id="OUCode" name="OUCode" value="${checkedObjs[i].OUCode}"/>
                                <input type="hidden" id="fsname" name="fsname" value="${checkedObjs[i].fsname}"/>
                                <input type="hidden" id="ACLType" name="ACLType" value=""/>
                            </div>
                        </div> 
                         `;
                $("#mxlist_dept").append(li);

            }

            $("#selector").hide();
            $("#wrapper").show();
        } else {

        }


    }, false);

    mui('.mui-indexed-list-inner').on('change', 'input', function () {
        var count = list.querySelectorAll('input[type="checkbox"]:checked').length;
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
    xml = xml + '         <code>01.01.96</code>';
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
             li += `<li data-value="" data-tags="" class="mui-table-view-cell mui-indexed-list-item mui-checkbox mui-left">
                       <input type="checkbox" name="checkbox" data-fbmmc="${item[i].ouname}"
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
var itemidArr1 = [];
var itemidArr2 = [];
function initData(data, flag) {
    var item = data.FormDataSet.威海卫大厦报告审批[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.fbillno);
    }

    $("#fname").val(item.发起人);
    $("#fdate").val(FormatterTimeYMS(item.发起日期));
    $("#fdept").val(item.发起部门);
    $("#fbh").val(item.编号);
    $("#fbt").val(item.标题);
    $("#fifys").val(item.IsActive);
    if (item.IsActive) {
        $("#fifys_switch").addClass('mui-active');
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

    var item_c1 = data.FormDataSet.威海卫大厦报告审批ACL;
    for (var i = 0; i < item_c1.length; i++) {
        itemidArr1.push(item_c1[i].ID);
        var li = `
                       <div class="mui-card" id="mx">
                            <div class="mui-row">
                                <div class="mui-col-xs-12 flexLine">
                                    <textarea rows="2" id="fsname" name="fsname" readonly>${String(item_c1[i].OUFullName).replace("BPMOU://","")}</textarea>
                                    <span class="mui-icon mui-icon-closeempty mui-pull-right" style="font-size:1.5rem;display:none;" onclick="deleteCard(this)"></span>
                                </div>
                                <input type="hidden" id="fbmmc" name="fbmmc" value=""/> 
                                <input type="hidden" id="OUFullName" name="OUFullName" value="${item_c1[i].OUFullName}"/>
                                <input type="hidden" id="OUCode" name="OUCode" value="${item_c1[i].OUCode}"/>
                                <input type="hidden" id="fsname" name="fsname" value="${String(item_c1[i].OUFullName).replace("BPMOU://", "")}"/>
                                <input type="hidden" id="ACLType" name="ACLType" value="${item_c1[i].ACLType}"/>   
                            </div>
                        </div> 
                 `;
        $("#mxlist_dept").append(li);
    }

    var item_c2 = data.FormDataSet.威海卫大厦报告审批USER;
    for (var i = 0; i < item_c2.length; i++) {
        itemidArr2.push(item_c2[i].ID);
        var li = `
                <div id="user" style="margin:1rem;">
                    <div style="display:flex;flex-direction:column;height:2.75rem;width:2.75rem;" onclick="deleteThis(this)">
                        <img src="" alt="" title="头像" style="border-radius:50%;margin-left:.2rem;"/>   
                        <label style="padding-left:.4rem;">${item_c2[i].UserName}</label>
                        <input type="hidden" id="fno" name="fno" value="${item_c2[i].UserAccount}"/>  
                         <input type="hidden" id="ALCType" name="ALCType" value="${item_c1[i].ALCType}"/> 
                    </div>                                
                </div>
                `;
        $("#mxlist_user").append(li);

    }


}
function deleteCard(context) {
    var btnArray = ['否', '是'];
    mui.confirm('确认删除？', '', btnArray, function (e) {
        if (e.index == 1) {
            $(context).parent().parent().parent().fadeOut();

        }
    });
}

function nodeControllerExp(NodeName) {
    if (String(NodeName).match('开始') != null) {
        $(".upload-addbtn").show();
        upload();
        tapEvent();
        $("textarea").removeAttr('readonly');
        $("#fifys_switch").removeClass('mui-disabled');

    }
}

class MxItem_dept {
    constructor(ACLType, OUCode, OUFullName) {
        this.ACLType = ACLType;
        this.OUCode = OUCode;
        this.OUFullName = OUFullName;

    }
}
class MxItem_user {
    constructor(ALCType, UserAccount, UserName) {
        this.ALCType = ALCType;
        this.UserAccount = UserAccount;
        this.UserName = UserName;
    }
}

function Save() {
    var fname = $("#fname").val();
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();

    var fbh = $("#fbh").val();
    var fbt = $("#fbt").val();
    var fifys = $("#fifys").val();
    if (!fbh) {
        mui.toast('请填写编号');
        return;
    }
    if (!fbt) {
        mui.toast('请填写标题');
        return;
    }
    if (!fjArray) {
        mui.toast('请上传附件');
        return;
    }
    var mxflag = false;
    var lujing = [];
    var lujing2 = [];
    var mxlistArr1 = new Array();
    $("#mxlist_dept").find("#mx").each(function () {
        var ACLType = $(this).find("#ACLType").val();
        var OUCode = $(this).find("#OUCode").val();
        var OUFullName = $(this).find("#OUFullName").val();
        
        lujing.push(OUFullName);
        var mx = new MxItem_dept(ACLType, OUCode, OUFullName);
        mxlistArr1.push(mx);
    });

    var mxlistArr2 = new Array();
    $("#mxlist_user").find("#user").each(function () {
        var ALCType = $(this).find("#ALCType").val();
        var UserAccount = $(this).find("#UserAccount").val();
        var UserName = $(this).find("#UserName").val();
        lujing2.push(UserAccount);
        var mx = new MxItem_user(ALCType, UserAccount, UserName);
        mxlistArr2.push(mx);
    });


    var btnArry = ["取消", "确定"];
    mui.confirm('即将提交，是否确定？', '提交确认提醒', btnArry, function (e) {
        if (e.index == 1) {
            var xml = `<?xml version="1.0"?>
                        <XForm>
                            <Header>
                                <Method>Post</Method>
                                <ProcessName>威海卫大厦公函发布申请</ProcessName>
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
                      <威海卫大厦报告审批>
                        <fbillno>自动带出</fbillno>
                        <发起人>${fname}</发起人>
                        <发起日期>${fdate}</发起日期>
                        <发起部门>${fdept}</发起部门>
                        <编号>${fbh}</编号>
                        <标题>${fbt}</标题>
                        <IsActive>${fifys}</IsActive>
                        <附件>${fjArray.join(";")}</附件>
                        <lujing>${lujing.join(",")}</lujing>
                        <lujing2>${lujing2.join(",")}</lujing2>
                    </威海卫大厦报告审批>
                    `;

            for (var i = 0; i < mxlistArr1.length; i++) {
                xml += `
                        <威海卫大厦报告审批ACL>
                            <RelationRowGuid>${i+1}</RelationRowGuid>
                            <RowPrimaryKeys></RowPrimaryKeys>
                            <ACLType>1</ACLType>
                            <OUCode>${mxlistArr1[i].OUCode}</OUCode>
                            <TaskID></TaskID>
                            <OUFullName>${mxlistArr1[i].OUFullName}</OUFullName>
                        </威海卫大厦报告审批ACL>
                       `;
            }

            for (var i = 0; i < mxlistArr2.length; i++) {
                xml += `
                       <威海卫大厦报告审批USER>
                            <RelationRowGuid>${mxlistArr1.length+i+1}</RelationRowGuid>
                            <RowPrimaryKeys></RowPrimaryKeys>
                            <ALCType>1</ALCType>
                            <UserAccount>${mxlistArr2[i].UserAccount}</UserAccount>
                            <UserName>${mxlistArr2[i].UserName}</UserName>
                        </威海卫大厦报告审批USER>
                       `;
            }
            xml += ` </FormData>
                    </XForm>
                   `;
            //console.log(xml);
            PostXml(xml);
        }
    });
}

function reSave() {
    var pid = $("#stepId").val();
    var fbillno = $("#fbillno").val();

    var fname = $("#fname").val();
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();

    var fbh = $("#fbh").val();
    var fbt = $("#fbt").val();
    var fifys = $("#fifys").val();
    if (!fbh) {
        mui.toast('请填写编号');
        return;
    }
    if (!fbt) {
        mui.toast('请填写标题');
        return;
    }
    if (!fjArray) {
        mui.toast('请上传附件');
        return;
    }
    var mxflag = false;
    var lujing = [];
    var lujing2 = [];
    var mxlistArr1 = new Array();
    $("#mxlist_dept").find("#mx").each(function () {
        var ACLType = $(this).find("#ACLType").val();
        var OUCode = $(this).find("#OUCode").val();
        var OUFullName = $(this).find("#OUFullName").val();
        lujing.push(OUFullName);
        var mx = new MxItem_dept(ACLType, OUCode, OUFullName);
        mxlistArr1.push(mx);
    });

    var mxlistArr2 = new Array();
    $("#mxlist_user").find("#user").each(function () {
        var ALCType = $(this).find("#ALCType").val();
        var UserAccount = $(this).find("#UserAccount").val();
        var UserName = $(this).find("#UserName").val();
        lujing2.push(UserAccount);
        var mx = new MxItem_user(ALCType, UserAccount, UserName);
        mxlistArr2.push(mx);
    });
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
                        <FormData>`;
            xml += `
                      <威海卫大厦报告审批>
                        <fbillno>自动带出</fbillno>
                        <发起人>${fname}</发起人>
                        <发起日期>${fdate}</发起日期>
                        <发起部门>${fdept}</发起部门>
                        <编号>${fbh}</编号>
                        <标题>${fbt}</标题>
                        <IsActive>${fifys}</IsActive>
                        <附件>${fjArray.join(";")}</附件>
                        <lujing>${lujing.join(",")}</lujing>
                        <lujing2>${lujing2.join(",")}</lujing2>
                    </威海卫大厦报告审批>
                    `;

            for (var i = 0; i < mxlistArr1.length; i++) {
                xml += `
                        <威海卫大厦报告审批ACL>
                            <RelationRowGuid>${i + 1}</RelationRowGuid>
                            <RowPrimaryKeys></RowPrimaryKeys>
                            <ACLType>1</ACLType>
                            <OUCode>${mxlistArr1[i].OUCode}</OUCode>
                            <TaskID></TaskID>
                            <OUFullName>${mxlistArr1[i].OUFullName}</OUFullName>
                        </威海卫大厦报告审批ACL>
                       `;
            }

            for (var i = 0; i < mxlistArr2.length; i++) {
                xml += `
                       <威海卫大厦报告审批USER>
                            <RelationRowGuid>${mxlistArr1.length + i + 1}</RelationRowGuid>
                            <RowPrimaryKeys></RowPrimaryKeys>
                            <ALCType>1</ALCType>
                            <UserAccount>${mxlistArr2[i].UserAccount}</UserAccount>
                            <UserName>${mxlistArr2[i].UserName}</UserName>
                        </威海卫大厦报告审批USER>
                       `;
            }
            xml += ` </FormData>
                    </XForm>
                   `;
            //console.log(xml);
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
    var tid = $("#taskId").val();

    var fname = $("#fname").val();
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();

    var fbh = $("#fbh").val();
    var fbt = $("#fbt").val();
    var fifys = $("#fifys").val();
   
    var mxflag = false;
    var lujing = [];
    var lujing2 = [];
    var mxlistArr1 = new Array();
    $("#mxlist_dept").find("#mx").each(function () {
        var ACLType = $(this).find("#ACLType").val();
        var OUCode = $(this).find("#OUCode").val();
        var OUFullName = $(this).find("#OUFullName").val();
        lujing.push(OUFullName);
        var mx = new MxItem_dept(ACLType, OUCode, OUFullName);
        mxlistArr1.push(mx);
    });

    var mxlistArr2 = new Array();
    $("#mxlist_user").find("#user").each(function () {
        var ALCType = $(this).find("#ALCType").val();
        var UserAccount = $(this).find("#UserAccount").val();
        var UserName = $(this).find("#UserName").val();
        lujing2.push(UserAccount);
        var mx = new MxItem_user(ALCType, UserAccount, UserName);
        mxlistArr2.push(mx);
    });


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
                     </Header>';
                     <FormData>`;
            xml += `
                      <威海卫大厦报告审批>
                        <fbillno>自动带出</fbillno>
                        <发起人>${fname}</发起人>
                        <发起日期>${fdate}</发起日期>
                        <发起部门>${fdept}</发起部门>
                        <编号>${fbh}</编号>
                        <标题>${fbt}</标题>
                        <IsActive>${fifys}</IsActive>
                        <附件>${fjArray.join(";")}</附件>
                        <lujing>${lujing.join(",")}</lujing>
                        <lujing2>${lujing2.join(",")}</lujing2>
                    </威海卫大厦报告审批>
                    `;

            for (var i = 0; i < mxlistArr1.length; i++) {
                xml += `
                        <威海卫大厦报告审批ACL>
                            <RelationRowGuid>${i + 1}</RelationRowGuid>
                            <RowPrimaryKeys></RowPrimaryKeys>
                            <ACLType>1</ACLType>
                            <OUCode>${mxlistArr1[i].OUCode}</OUCode>
                            <TaskID>${tid}</TaskID>
                            <OUFullName>${mxlistArr1[i].OUFullName}</OUFullName>
                        </威海卫大厦报告审批ACL>
                       `;
            }

            for (var i = 0; i < mxlistArr2.length; i++) {
                xml += `
                       <威海卫大厦报告审批USER>
                            <RelationRowGuid>${mxlistArr1.length + i + 1}</RelationRowGuid>
                            <RowPrimaryKeys></RowPrimaryKeys>
                            <ALCType>1</ALCType>
                            <UserAccount>${mxlistArr2[i].UserAccount}</UserAccount>
                            <UserName>${mxlistArr2[i].UserName}</UserName>
                        </威海卫大厦报告审批USER>
                       `;
            }
            xml += ` </FormData>
                    </XForm>
                   `;
            //console.log(xml);
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
                      <威海卫大厦报告审批>
                        <fbillno>自动带出</fbillno>
                        <发起人>${fname}</发起人>
                        <发起日期>${fdate}</发起日期>
                        <发起部门>${fdept}</发起部门>
                        <编号>${fbh}</编号>
                        <标题>${fbt}</标题>
                        <IsActive>${fifys}</IsActive>
                        <附件>${fjArray.join(";")}</附件>
                        <lujing>${lujing.join(",")}</lujing>
                        <lujing2>${lujing2.join(",")}</lujing2>
                    </威海卫大厦报告审批>
                    `;

        for (var i = 0; i < mxlistArr1.length; i++) {
            xml += `
                        <威海卫大厦报告审批ACL>
                            <RelationRowGuid>${i + 1}</RelationRowGuid>
                            <RowPrimaryKeys></RowPrimaryKeys>
                            <ACLType>1</ACLType>
                            <OUCode>${mxlistArr1[i].OUCode}</OUCode>
                            <TaskID>${tid}</TaskID>
                            <OUFullName>${mxlistArr1[i].OUFullName}</OUFullName>
                        </威海卫大厦报告审批ACL>
                       `;
        }

        for (var i = 0; i < mxlistArr2.length; i++) {
            xml += `
                       <威海卫大厦报告审批USER>
                            <RelationRowGuid>${mxlistArr1.length + i + 1}</RelationRowGuid>
                            <RowPrimaryKeys></RowPrimaryKeys>
                            <ALCType>1</ALCType>
                            <UserAccount>${mxlistArr2[i].UserAccount}</UserAccount>
                            <UserName>${mxlistArr2[i].UserName}</UserName>
                        </威海卫大厦报告审批USER>
                       `;
        }
        xml += ` </FormData>
                    </XForm>
                   `;
        //console.log(xml);
        PostXml(xml);
    }
}