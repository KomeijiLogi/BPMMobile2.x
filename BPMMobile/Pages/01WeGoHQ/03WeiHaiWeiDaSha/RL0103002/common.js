function prepMsg() {
    $("#fdate").val(getNowFormatDate(2));
    tapEvent();
    upload();
    var xml = '<?xml version= "1.0" ?>';
    xml = xml + '   <Requests>';
    xml = xml + '   <Params>';
    xml = xml + '       <Method>GetFormPostData</Method>';
    xml = xml + '       <ProcessName>威海卫大厦员工转正申请</ProcessName>';
    xml = xml + '      <ProcessVersion>' + version + '</ProcessVersion>';
    xml = xml + '      <Owner></Owner>';
    xml = xml + '    </Params>';
    xml = xml + '   </Requests>';

    dataProvider(xml, function (data) {
        var provideData = JSON.parse(unescape(data.replace(/\\(u[0-9a-fA-F]{4})/gm, '%$1')));
        console.log(provideData);
        var item = provideData.Tables[0].Rows[0];
        $("#fname").val(item.提报人);
        $("#fdept").val(item.申请部门);
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

    $('#tjmx').on('tap', () => {
        var li = `
           <div id="mx" class="mui-card">
              <div class="mui-input-row itemtitle">
                 <label>明细列表项</label>
                 <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>
              </div>
               <div class="mui-input-row">
                 <label for="fjsrxm">晋升人姓名<i style="color:red;">*</i></label>
                 <input type="text" id="fjsrxm" name="fjsrxm" placeholder="请填写晋升人姓名"/>
              </div>
              <div class="mui-input-row">
                 <label for="frzrq">入职日期<i style="color:red;">*</i></label>
                 <input type="date" id="frzrq" name="frzrq" />
              </div>  
              <div class="mui-input-row">
                 <label for="fnddgrq">拟定到岗日期<i style="color:red;">*</i></label> 
                 <input type="date" id="fnddgrq" name="fnddgrq" />
              </div>
              <div class="mui-input-row">
                  <label for="fxszbm">现所在部门<i style="color:red;">*</i></label>
                  <input type="text" id="fxszbm" name="fxszbm" placeholder="请填写现所在部门"/>
              </div> 
              <div class="mui-input-row">
                  <label for="fxrgw">现任岗位<i style="color:red;">*</i></label>
                  <input type="text" id="fxrgw" name="fxrgw" placeholder="请填写现任岗位"/>
              </div>
              <div class="mui-input-row">
                  <label for="fxgwgz">现岗位工资<i style="color:red;">*</i></label>
                  <input type="number" id="fxgwgz" name="fxgwgz" placeholder="请填写现岗位工资"/>  
              </div>
              <div class="mui-input-row">
                  <label for="fndrbm">拟调入部门<i style="color:red;">*</i></label>
                  <input type="text" id="fndrbm" name="fndrbm" placeholder="请填写拟调入部门"/>
              </div>
              <div class="mui-input-row">
                  <label for="fndgw">拟定岗位<i style="color:red;">*</i></label>
                  <input type="text" id="fndgw" name="fndgw" placeholder="请填写拟定岗位"/>
              </div> 
              <div class="mui-input-row">
                  <label for="fndgwgz">拟定岗位工资<i style="color:red;">*</i></label>  
                  <input type="number" id="fndgwgz" name="fndgwgz" placeholder="请填写拟定岗位工资"/>
              </div>
              <div class="mui-input-row" style="height:auto;">
                  <label for="fbz">备注</label>
                  <textarea rows="3" id="fbz" name="fbz" placeholder="请填写备注"></textarea>   
              </div> 
              <div class="mui-input-row">
                  <label for="frszt">人事状态</label>
                  <input type="text" id="frszt" name="frszt" readonly />  
              </div>   
           </div>
        `;
        $("#mxlist").append(li);
    });

}

class Mx {
    constructor(fjsrxm, frzrq, fnddgrq, fxszbm, fxrgw, fxgwgz, fndrbm, fndgw, fndgwgz, fbz, frszt) {
        this.fjsrxm = fjsrxm;
        this.frzrq = frzrq;
        this.fnddgrq = fnddgrq;
        this.fxszbm = fxszbm;
        this.fxrgw = fxrgw;
        this.fxgwgz = fxgwgz;
        this.fndrbm = fndrbm;
        this.fndgw = fndgw;
        this.fndgwgz = fndgwgz;
        this.fbz = fbz;
        this.frszt = frszt;
    }
    check() {
        if (!this.fjsrxm) {
            mui.toast('请填写晋升人姓名');
            return false;
        }
        if (!this.frzrq) {
            mui.toast('请填写入职日期');
            return false;
        }
        if (!this.fnddgrq) {
            mui.toast('请填写拟定到岗日期');
            return false;
        }
        if (!this.fxszbm) {
            mui.toast('请填写现所在部门');
            return false;
        }
        if (!this.fxrgw) {
            mui.toast('请填写现任岗位');
            return false;
        }
        if (!this.fxgwgz) {
            mui.toast('请填写现岗位工资');
            return false;
        }
        if (!this.fndrbm) {
            mui.toast('请填写拟调入部门');
            return false;
        }
        if (!this.fndgw) {
            mui.toast('请填写拟定岗位');
            return false;
        }
        if (!this.fndgwgz) {
            mui.toast('请填写拟定岗位工资');
            return false;
        }
        return true;

    }

}


function initData(data, flag) {
    var item = data.FormDataSet.威海卫大厦员工晋升申请表_A[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.fbillno);
    }
    $("#fname").val(item.提报人);
    $("#fdept").val(item.申请部门);
    $("#fdate").val(FormatterTimeYMS(item.申请日期));
    $("#fsqsy").val(item.申请事由);

    var item_c = data.FormDataSet.威海卫大厦员工晋升申请表_B;
    for (var i = 0; i < item_c.length; i++) {
        itemidArr.push(item_c[i].itemid);
        var li = `
           <div id="mx" class="mui-card">
              <div class="mui-input-row itemtitle">
                 <label>明细列表项</label>
                 <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>
              </div>
               <div class="mui-input-row">
                 <label for="fjsrxm">晋升人姓名<i style="color:red;">*</i></label>
                 <input type="text" id="fjsrxm" name="fjsrxm" readonly value="${item_c[i].晋升人姓名}" class="reEdited"/>
              </div>
              <div class="mui-input-row">
                 <label for="frzrq">入职日期<i style="color:red;">*</i></label>
                 <input type="date" id="frzrq" name="frzrq"  readonly value="${FormatterTimeYMS(item_c[i].入职日期)}" class="reEdited"/>
              </div>  
              <div class="mui-input-row">
                 <label for="fnddgrq">拟定到岗日期<i style="color:red;">*</i></label>
                 <input type="date" id="fnddgrq" name="fnddgrq" readonly value="${FormatterTimeYMS(item_c[i].拟定到岗日期)}" class="reEdited"/>
              </div>
              <div class="mui-input-row">
                  <label for="fxszbm">现所在部门<i style="color:red;">*</i></label>
                  <input type="text" id="fxszbm" name="fxszbm" readonly value="${item_c[i].现所在部门}" class="reEdited"/>
              </div> 
              <div class="mui-input-row">
                  <label for="fxrgw">现任岗位<i style="color:red;">*</i></label>
                  <input type="text" id="fxrgw" name="fxrgw" readonly value="${item_c[i].现任岗位}" class="reEdited"/>
              </div>
              <div class="mui-input-row">
                  <label for="fxgwgz">现岗位工资<i style="color:red;">*</i></label>
                  <input type="number" id="fxgwgz" name="fxgwgz" readonly value="${item_c[i].现岗位工资}" class="reEdited"/>  
              </div>
              <div class="mui-input-row">
                  <label for="fndrbm">拟调入部门<i style="color:red;">*</i></label>
                  <input type="text" id="fndrbm" name="fndrbm" readonly value="${item_c[i].拟调入部门}" class="reEdited"/>
              </div>
              <div class="mui-input-row">
                  <label for="fndgw">拟定岗位<i style="color:red;">*</i></label>
                  <input type="text" id="fndgw" name="fndgw" readonly value="${item_c[i].拟定岗位}" class="reEdited"/>
              </div> 
              <div class="mui-input-row">
                  <label for="fndgwgz">拟定岗位工资<i style="color:red;">*</i></label>  
                  <input type="number" id="fndgwgz" name="fndgwgz" readonly value="${item_c[i].拟定岗位工资}" class="reEdited"/>
              </div>
              <div class="mui-input-row" style="height:auto;">
                  <label for="fbz">备注</label>
                  <textarea rows="3" id="fbz" name="fbz" readonly class="reEdited">${changeNullToEmpty(item_c[i].备注)}</textarea>   
              </div> 
              <div class="mui-input-row">
                  <label for="frszt">人事状态</label>
                  <input type="text" id="frszt" name="frszt" readonly value="${changeNullToEmpty(item_c[i].人事状态)}"/>  
              </div>   
           </div>
        `;
        $("#mxlist").append(li);

    }

    //附件
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
                        if (String(navigator.userAgent).match('cloudhub') != null) {
                            window.open(attachArray[$(this)[0].id].downurl);
                        }
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
    /*
    *
    *   人事主管,总办主任调整人事状态
    *
    *
    *
    */

    if (String(NodeName).match('开始') != null) {
        upload();
        $('#tjmx').show();
        $("#mxlist").find('span').each(function () {
            $(this).show();
        });
        $("#mxlist").find('.reEdited').each(function () {
            $(this).removeAttr('readonly');
        });
        $("#fsqsy").removeAttr('readonly');
        tapEvent();
    } else if (String(NodeName).match('人事主管') != null || String(NodeName).match('总办主任') != null) {
        var fztdata = [
            {
                value: '',
                text: '同意'
            },
            {
                value: '',
                text: '不同意'
            }
        ];
        $("#mxlist").find('#frszt').each(function () {
            $(this).attr('placeholder', '请选择人事状态');
        });
        showPickerByZepto('#mxlist', '#frszt', fztdata);

    }
}

function Save() {
    var fname = $("#fname").val();
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();
    var fsqsy = $("#fsqsy").val();

    var mxflag = false;
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fjsrxm = $(this).find("#fjsrxm").val();
        var frzrq = $(this).find("#frzrq").val();
        var fnddgrq = $(this).find("#fnddgrq").val();
        var fxszbm = $(this).find("#fxszbm").val();
        var fxrgw = $(this).find("#fxrgw").val();
        var fxgwgz = $(this).find("#fxgwgz").val();
        var fndrbm = $(this).find("#fndrbm").val();
        var fndgw = $(this).find("#fndgw").val();
        var fndgwgz = $(this).find("#fndgwgz").val();
        var fbz = $(this).find("#fbz").val();
        var frszt = $(this).find("#frszt").val();


        var mx = new Mx(fjsrxm, frzrq, fnddgrq, fxszbm, fxrgw, fxgwgz, fndrbm, fndgw, fndgwgz, fbz, frszt);
        if (!mx.check()) {
            mxflag = true;
            return;
        }
        mxlistArr.push(mx);
    });
    if (mxflag) {
        return;
    }
    var btnArry = ["取消", "确定"];
    mui.confirm('即将提交，是否确定？', '提交确认提醒', btnArry, function (e) {
        if (e.index == 1) {
            var xml = '<?xml version= "1.0" ?>';
            xml = xml + '   <XForm>';
            xml = xml + '         <Header>';
            xml = xml + '        <Method>Post</Method>';
            xml = xml + '       <ProcessName>威海卫大厦员工晋升申请</ProcessName>';
            xml = xml + '         <ProcessVersion>' + version + '</ProcessVersion>';
            xml = xml + '            <DraftGuid></DraftGuid>';
            xml = xml + '             <OwnerMemberFullName>' + BPMOU + '</OwnerMemberFullName>';
            xml = xml + '            <Action>提交</Action>';
            xml = xml + '          <Comment></Comment>';
            xml = xml + '             <InviteIndicateUsers></InviteIndicateUsers>';
            xml = xml + '       </Header>';
            xml = xml + '       <FormData>';

            xml = xml + ' <威海卫大厦员工晋升申请表_A>';
            xml = xml + '   <fbillno>自动带出</fbillno>';
            xml = xml + '  <提报人>' + fname + '</提报人>';
            xml = xml + ' <申请部门>' + fdept + '</申请部门>';
            xml = xml + ' <申请日期>' + fdate + '</申请日期>';
            xml = xml + ' <申请事由>' + fsqsy + '</申请事由>';
            xml = xml + '<附件>' + fjArray.join(";") + '</附件>';
            xml = xml + ' </威海卫大厦员工晋升申请表_A>';

            for (var i = 0; i < mxlistArr.length; i++) {
                xml = xml + ' <威海卫大厦员工晋升申请表_B>';
                xml = xml + '   <RelationRowGuid>'+(i+1)+'</RelationRowGuid>';
                xml = xml + '  <RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + ' <fentyrno>' + (i + 1) + '</fentyrno>';
                xml = xml + ' <晋升人姓名>' + mxlistArr[i].fjsrxm + '</晋升人姓名>';
                xml = xml + '  <入职日期>' + mxlistArr[i].frzrq + '</入职日期>';
                xml = xml + ' <拟定到岗日期>' + mxlistArr[i].fnddgrq + '</拟定到岗日期>';
                xml = xml + '  <现所在部门>' + mxlistArr[i].fxszbm + '</现所在部门>';
                xml = xml + '  <现任岗位>' + mxlistArr[i].fxrgw + '</现任岗位>';
                xml = xml + '  <现岗位工资>' + mxlistArr[i].fxgwgz + '</现岗位工资>';
                xml = xml + '  <拟调入部门>' + mxlistArr[i].fndrbm + '</拟调入部门>';
                xml = xml + '  <拟定岗位>' + mxlistArr[i].fndgw + '</拟定岗位>';
                xml = xml + '  <拟定岗位工资>' + mxlistArr[i].fndgwgz + '</拟定岗位工资>';
                xml = xml + '  <备注>' + mxlistArr[i].fbz + '</备注>';
                xml = xml + '   <人事状态>' + mxlistArr[i].frszt + '</人事状态>';
                xml = xml + ' </威海卫大厦员工晋升申请表_B>';
            }

            xml = xml + '</FormData>';
            xml = xml + '</XForm>';
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
    var fsqsy = $("#fsqsy").val();

    var mxflag = false;
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fjsrxm = $(this).find("#fjsrxm").val();
        var frzrq = $(this).find("#frzrq").val();
        var fnddgrq = $(this).find("#fnddgrq").val();
        var fxszbm = $(this).find("#fxszbm").val();
        var fxrgw = $(this).find("#fxrgw").val();
        var fxgwgz = $(this).find("#fxgwgz").val();
        var fndrbm = $(this).find("#fndrbm").val();
        var fndgw = $(this).find("#fndgw").val();
        var fndgwgz = $(this).find("#fndgwgz").val();
        var fbz = $(this).find("#fbz").val();
        var frszt = $(this).find("#frszt").val();


        var mx = new Mx(fjsrxm, frzrq, fnddgrq, fxszbm, fxrgw, fxgwgz, fndrbm, fndgw, fndgwgz, fbz, frszt);
        if (!mx.check()) {
            mxflag = true;
            return;
        }
        mxlistArr.push(mx);
    });
    if (mxflag) {
        return;
    }
    var btnArry = ["取消", "确定"];
    mui.confirm('即将提交，是否确定？', '提交确认提醒', btnArry, function (e) {
        if (e.index == 1) {
            var xml = '<?xml version="1.0"?>';
            xml = xml + '<XForm>';
            xml = xml + '   <Header>';
            xml = xml + '    <Method>Process</Method>';
            xml = xml + '   <PID>' + pid + '</PID>';
            xml = xml + '   <Action>提交</Action>';
            xml = xml + '    <Comment></Comment>';
            xml = xml + '    <InviteIndicateUsers></InviteIndicateUsers>';
            xml = xml + '  </Header>';
            xml = xml + '<FormData>';

            xml = xml + ' <威海卫大厦员工晋升申请表_A>';
            xml = xml + '   <fbillno>' + fbillno + '</fbillno>';
            xml = xml + '  <提报人>' + fname + '</提报人>';
            xml = xml + ' <申请部门>' + fdept + '</申请部门>';
            xml = xml + ' <申请日期>' + fdate + '</申请日期>';
            xml = xml + ' <申请事由>' + fsqsy + '</申请事由>';
            xml = xml + '<附件>' + fjArray.join(";") + '</附件>';
            xml = xml + ' </威海卫大厦员工晋升申请表_A>';

            for (var i = 0; i < mxlistArr.length; i++) {
                xml = xml + ' <威海卫大厦员工晋升申请表_B>';
                xml = xml + '   <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml = xml + '  <RowPrimaryKeys></RowPrimaryKeys>';
                xml = xml + ' <fentyrno>' + (i + 1) + '</fentyrno>';
                xml = xml + ' <晋升人姓名>' + mxlistArr[i].fjsrxm + '</晋升人姓名>';
                xml = xml + '  <入职日期>' + mxlistArr[i].frzrq + '</入职日期>';
                xml = xml + ' <拟定到岗日期>' + mxlistArr[i].fnddgrq + '</拟定到岗日期>';
                xml = xml + '  <现所在部门>' + mxlistArr[i].fxszbm + '</现所在部门>';
                xml = xml + '  <现任岗位>' + mxlistArr[i].fxrgw + '</现任岗位>';
                xml = xml + '  <现岗位工资>' + mxlistArr[i].fxgwgz + '</现岗位工资>';
                xml = xml + '  <拟调入部门>' + mxlistArr[i].fndrbm + '</拟调入部门>';
                xml = xml + '  <拟定岗位>' + mxlistArr[i].fndgw + '</拟定岗位>';
                xml = xml + '  <拟定岗位工资>' + mxlistArr[i].fndgwgz + '</拟定岗位工资>';
                xml = xml + '  <备注>' + mxlistArr[i].fbz + '</备注>';
                xml = xml + '   <人事状态>' + mxlistArr[i].frszt + '</人事状态>';
                xml = xml + ' </威海卫大厦员工晋升申请表_B>';
            }

            xml = xml + '</FormData>';
            xml = xml + '</XForm>';
            PostXml(xml);
        }
    });

}

function hasRead() {
    var pid = $("#stepId").val();
    var fbillno = $("#fbillno").val();
    var fname = $("#fname").val();
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();
    var fsqsy = $("#fsqsy").val();

    var mxflag = false;
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fjsrxm = $(this).find("#fjsrxm").val();
        var frzrq = $(this).find("#frzrq").val();
        var fnddgrq = $(this).find("#fnddgrq").val();
        var fxszbm = $(this).find("#fxszbm").val();
        var fxrgw = $(this).find("#fxrgw").val();
        var fxgwgz = $(this).find("#fxgwgz").val();
        var fndrbm = $(this).find("#fndrbm").val();
        var fndgw = $(this).find("#fndgw").val();
        var fndgwgz = $(this).find("#fndgwgz").val();
        var fbz = $(this).find("#fbz").val();
        var frszt = $(this).find("#frszt").val();


        var mx = new Mx(fjsrxm, frzrq, fnddgrq, fxszbm, fxrgw, fxgwgz, fndrbm, fndgw, fndgwgz, fbz, frszt);
       
        mxlistArr.push(mx);
    });
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

            xml = xml + ' <威海卫大厦员工晋升申请表_A>';
            xml = xml + '   <fbillno>' + fbillno + '</fbillno>';
            xml = xml + '  <提报人>' + fname + '</提报人>';
            xml = xml + ' <申请部门>' + fdept + '</申请部门>';
            xml = xml + ' <申请日期>' + fdate + '</申请日期>';
            xml = xml + ' <申请事由>' + fsqsy + '</申请事由>';
            xml = xml + '<附件>' + fjArray.join(";") + '</附件>';
            xml = xml + ' </威海卫大厦员工晋升申请表_A>';

            for (var i = 0; i < mxlistArr.length; i++) {
                xml = xml + ' <威海卫大厦员工晋升申请表_B>';
                xml = xml + '   <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml = xml + '  <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
                xml = xml + ' <fentyrno>' + (i + 1) + '</fentyrno>';
                xml = xml + ' <晋升人姓名>' + mxlistArr[i].fjsrxm + '</晋升人姓名>';
                xml = xml + '  <入职日期>' + mxlistArr[i].frzrq + '</入职日期>';
                xml = xml + ' <拟定到岗日期>' + mxlistArr[i].fnddgrq + '</拟定到岗日期>';
                xml = xml + '  <现所在部门>' + mxlistArr[i].fxszbm + '</现所在部门>';
                xml = xml + '  <现任岗位>' + mxlistArr[i].fxrgw + '</现任岗位>';
                xml = xml + '  <现岗位工资>' + mxlistArr[i].fxgwgz + '</现岗位工资>';
                xml = xml + '  <拟调入部门>' + mxlistArr[i].fndrbm + '</拟调入部门>';
                xml = xml + '  <拟定岗位>' + mxlistArr[i].fndgw + '</拟定岗位>';
                xml = xml + '  <拟定岗位工资>' + mxlistArr[i].fndgwgz + '</拟定岗位工资>';
                xml = xml + '  <备注>' + mxlistArr[i].fbz + '</备注>';
                xml = xml + '   <人事状态>' + mxlistArr[i].frszt + '</人事状态>';
                xml = xml + ' </威海卫大厦员工晋升申请表_B>';
            }

            xml = xml + '</FormData>';
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
    var fdept = $("#fdept").val();
    var fdate = $("#fdate").val();
    var fsqsy = $("#fsqsy").val();

    var mxflag = false;
    var mxlistArr = new Array();
    $("#mxlist").find("#mx").each(function () {
        var fjsrxm = $(this).find("#fjsrxm").val();
        var frzrq = $(this).find("#frzrq").val();
        var fnddgrq = $(this).find("#fnddgrq").val();
        var fxszbm = $(this).find("#fxszbm").val();
        var fxrgw = $(this).find("#fxrgw").val();
        var fxgwgz = $(this).find("#fxgwgz").val();
        var fndrbm = $(this).find("#fndrbm").val();
        var fndgw = $(this).find("#fndgw").val();
        var fndgwgz = $(this).find("#fndgwgz").val();
        var fbz = $(this).find("#fbz").val();
        var frszt = $(this).find("#frszt").val();


        var mx = new Mx(fjsrxm, frzrq, fnddgrq, fxszbm, fxrgw, fxgwgz, fndrbm, fndgw, fndgwgz, fbz, frszt);

        mxlistArr.push(mx);
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
            var xml = '<?xml version="1.0"?>';
            xml = xml + '<XForm>';
            xml = xml + '<Header>';
            xml = xml + '<Method>Process</Method>';
            xml = xml + '<PID>' + pid + '</PID>';
            xml = xml + '<Action>同意</Action>';
            xml = xml + '<Comment>' + comment + '</Comment>';
            //加签差异部分
            xml = xml + '<ConsignEnabled>true</ConsignEnabled>';
            xml = xml + '  <ConsignUsers>' + consignUserStr + '</ConsignUsers>';
            xml = xml + ' <ConsignRoutingType>' + consignRoutingType + '</ConsignRoutingType>';
            xml = xml + '  <ConsignReturnType>' + consignReturnType + '</ConsignReturnType>';
            xml = xml + ' <InviteIndicateUsers>[]</InviteIndicateUsers>';
            xml = xml + ' <Context>{&quot;Routing&quot;:{}}</Context>';
            xml = xml + '</Header>';
            xml = xml + '<FormData>';

            xml = xml + ' <威海卫大厦员工晋升申请表_A>';
            xml = xml + '   <fbillno>' + fbillno + '</fbillno>';
            xml = xml + '  <提报人>' + fname + '</提报人>';
            xml = xml + ' <申请部门>' + fdept + '</申请部门>';
            xml = xml + ' <申请日期>' + fdate + '</申请日期>';
            xml = xml + ' <申请事由>' + fsqsy + '</申请事由>';
            xml = xml + '<附件>' + fjArray.join(";") + '</附件>';
            xml = xml + ' </威海卫大厦员工晋升申请表_A>';

            for (var i = 0; i < mxlistArr.length; i++) {
                xml = xml + ' <威海卫大厦员工晋升申请表_B>';
                xml = xml + '   <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
                xml = xml + '  <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
                xml = xml + ' <fentyrno>' + (i + 1) + '</fentyrno>';
                xml = xml + ' <晋升人姓名>' + mxlistArr[i].fjsrxm + '</晋升人姓名>';
                xml = xml + '  <入职日期>' + mxlistArr[i].frzrq + '</入职日期>';
                xml = xml + ' <拟定到岗日期>' + mxlistArr[i].fnddgrq + '</拟定到岗日期>';
                xml = xml + '  <现所在部门>' + mxlistArr[i].fxszbm + '</现所在部门>';
                xml = xml + '  <现任岗位>' + mxlistArr[i].fxrgw + '</现任岗位>';
                xml = xml + '  <现岗位工资>' + mxlistArr[i].fxgwgz + '</现岗位工资>';
                xml = xml + '  <拟调入部门>' + mxlistArr[i].fndrbm + '</拟调入部门>';
                xml = xml + '  <拟定岗位>' + mxlistArr[i].fndgw + '</拟定岗位>';
                xml = xml + '  <拟定岗位工资>' + mxlistArr[i].fndgwgz + '</拟定岗位工资>';
                xml = xml + '  <备注>' + mxlistArr[i].fbz + '</备注>';
                xml = xml + '   <人事状态>' + mxlistArr[i].frszt + '</人事状态>';
                xml = xml + ' </威海卫大厦员工晋升申请表_B>';
            }

            xml = xml + '</FormData>';
            xml = xml + '</XForm>';
            PostXml(xml);
        });
    } else {
        var xml = '<?xml version="1.0"?>';
        xml = xml + '<XForm>';
        xml = xml + '<Header>';
        xml = xml + '<Method>Process</Method>';
        xml = xml + '<PID>' + pid + '</PID>';
        xml = xml + '<Action>同意</Action>';
        xml = xml + '<Comment>' + comment + '</Comment>';

        xml = xml + ' <UrlParams></UrlParams>';
        xml = xml + '  <ConsignEnabled>false</ConsignEnabled>';
        xml = xml + '  <ConsignUsers>[]</ConsignUsers>';
        xml = xml + '  <ConsignRoutingType>Parallel</ConsignRoutingType>';
        xml = xml + '  <ConsignReturnType>Return</ConsignReturnType>';

        xml = xml + '   <InviteIndicateUsers>[]</InviteIndicateUsers>';
        xml = xml + '   <Context>{&quot;Routing&quot;:{}}</Context>';
        xml = xml + '</Header>';
        xml = xml + '<FormData>';

        xml = xml + ' <威海卫大厦员工晋升申请表_A>';
        xml = xml + '   <fbillno>' + fbillno + '</fbillno>';
        xml = xml + '  <提报人>' + fname + '</提报人>';
        xml = xml + ' <申请部门>' + fdept + '</申请部门>';
        xml = xml + ' <申请日期>' + fdate + '</申请日期>';
        xml = xml + ' <申请事由>' + fsqsy + '</申请事由>';
        xml = xml + '<附件>' + fjArray.join(";") + '</附件>';
        xml = xml + ' </威海卫大厦员工晋升申请表_A>';

        for (var i = 0; i < mxlistArr.length; i++) {
            xml = xml + ' <威海卫大厦员工晋升申请表_B>';
            xml = xml + '   <RelationRowGuid>' + (i + 1) + '</RelationRowGuid>';
            xml = xml + '  <RowPrimaryKeys>itemid=' + itemidArr[i] + '</RowPrimaryKeys>';
            xml = xml + ' <fentyrno>' + (i + 1) + '</fentyrno>';
            xml = xml + ' <晋升人姓名>' + mxlistArr[i].fjsrxm + '</晋升人姓名>';
            xml = xml + '  <入职日期>' + mxlistArr[i].frzrq + '</入职日期>';
            xml = xml + ' <拟定到岗日期>' + mxlistArr[i].fnddgrq + '</拟定到岗日期>';
            xml = xml + '  <现所在部门>' + mxlistArr[i].fxszbm + '</现所在部门>';
            xml = xml + '  <现任岗位>' + mxlistArr[i].fxrgw + '</现任岗位>';
            xml = xml + '  <现岗位工资>' + mxlistArr[i].fxgwgz + '</现岗位工资>';
            xml = xml + '  <拟调入部门>' + mxlistArr[i].fndrbm + '</拟调入部门>';
            xml = xml + '  <拟定岗位>' + mxlistArr[i].fndgw + '</拟定岗位>';
            xml = xml + '  <拟定岗位工资>' + mxlistArr[i].fndgwgz + '</拟定岗位工资>';
            xml = xml + '  <备注>' + mxlistArr[i].fbz + '</备注>';
            xml = xml + '   <人事状态>' + mxlistArr[i].frszt + '</人事状态>';
            xml = xml + ' </威海卫大厦员工晋升申请表_B>';
        }

        xml = xml + '</FormData>';
        xml = xml + '</XForm>';
        PostXml(xml);
    }

}