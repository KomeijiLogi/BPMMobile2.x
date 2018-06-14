function prepMsg() {

    $("#fdate").val(getNowFormatDate(2));
    tapEvent();
    var xml = `<?xml version= "1.0" ?>
                  <Requests>
                      <Params>
                      <Method>GetFormPostData</Method>
                      <ProcessName>集团公司行管人员工作牌申请</ProcessName>
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
        $("#fname").val(item.fname);
        $("#fssgs").val(item.fssgs);



    }).fail(function (e) {

    }).then(function () {
       
    });
}

function tapEvent() {

    $("#tjmx").on('tap', () => {
        var opidArr = [];
        XuntongJSBridge.call('selectPerson', { 'pType': '1' }, function (result) {

            if (String(Object.prototype.toString.call(result)).match('String') != null) {
                result = JSON.parse(result);
            }

            if (result.success == true || result.success == "true") {

                for (var i = 0; i < result.data.persons.length; i++) {

                    opidArr.push(result.data.persons[i].openId);

                }
                var getPerInfo = $.ajax({
                    type: "POST",
                    url: "/api/bpm/PostAccount",
                    data: { "ids": opidArr },
                    beforeSend: function (XHR) {
                        XHR.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem('ticket'));
                    }
                }).done((data) => {
                    console.info(data);
                }).fail((e) => {
                    console.error(e);
                });

                getPerInfo.then((data) => {
                    var xml = `<?xml version= "1.0" ?>
                                 <Requests>
                                 <Params>
                                 <DataSource>PS</DataSource>
                                 <ID>erpcloud_公用_获取个人信息</ID>
                                 <Type>1</Type>
                                 <Method>GetUserDataProcedure</Method>
                                 <ProcedureName>erpcloud_公用_获取个人信息</ProcedureName>
                                 <Filter><fno>${data.data[0].phone}</fno></Filter>
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
                        var pio = provideData.Tables[0].Rows[0];
                        console.info(pio);
                        var li = `
                                  <div id="mx" class="mui-card">
                                      <div class="mui-input-row itemtitle">
                                         <label>明细列表项</label>
                                         <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>
                                      </div>
                                      <div class="mui-row cutOffLine" style="padding:3vw;">
                                           <div class="mui-col-xs-3" style="display:flex;">
                                               <label>姓名<i style="color:red;">*</i></label>
                                               <textarea rows="2" id="fxm" readonly>${pio.NAME}</textarea> 
                                           </div>  
                                           <div class="mui-col-xs-3" style="display:flex;">
                                               <label>所属集团</label>
                                               <textarea rows="2" id="fssjt" readonly>${pio.fssgroup}</textarea>
                                           </div>
                                            <div class="mui-col-xs-3" style="display:flex;">
                                                <label>所属公司</label>
                                                <textarea rows="2" id="fssgs" readonly>${pio.fsscompany}</textarea> 
                                            </div>
                                            <div class="mui-col-xs-3" style="display:flex;">
                                                 <label>所属部门</label>
                                                 <textarea rows="2" id="fssbm" readonly>${pio.fdeptname}</textarea>
                                            </div>
                                      </div>
                                       <div class="mui-row cutOffLine" style="padding:3vw;">
                                           <div class="mui-col-xs-4" style="display:flex;">
                                               <label>职务</label> 
                                               <textarea rows="2" id="fzw" readonly>${pio.zhiwei}</textarea> 
                                           </div>
                                           <div class="mui-col-xs-4" style="display:flex;">
                                                <label>申请类型<i style="color:red;">*</i></label>
                                                <textarea rows="2" id="fsqlx" name="fsqlx" readonly placeholder="请选择"></textarea>
                                           </div> 
                                           <div class="mui-col-xs-4" style="display:flex;">
                                               <label>金额(元)</label>
                                               <textarea rows="2" id="fje" readonly></textarea>
                                           </div> 
                                       </div>
                                       <div class="mui-input-row" style="height:7rem;overflow:scroll;" id="uploaddiv">
                                            <div class="border border-t upload-img" style="top:0rem;">
                                                <div class="clearfix upload-btn" id="children-bg">
                                                    <label class="label">照片<i style="color:red;">*</i></label>
                                                    <span class="tips" id="imageCount"></span>
                                                    <span class="upload-addbtn">
                                                        <input type="file" accept="image/jpeg,image/jpg,image/png,image/jp2,image/bmp" id="file" style="opacity:0;">
                                                    </span>
                                                </div>
                                                <div class="upload-img-list"></div>
                                             </div>
                                       </div>
                                  </div>
                                 `;
                        $("#mxlist").append(li);
                    }).fail(function (e) {
                        console.log(e);
                    });
                });
            }
        });

    });

    var fsqlxdata = [
        {
            value: '',
            text:'壳+绳+卡片'
        },
        {
            value: '',
            text:'壳+绳'
        },
        {
            value: '',
            text:'卡片'
        },
        {
            value: '',
            text:'壳'
        },
        {
            value: '',
            text:'绳'
        }
    ];
    $("#mxlist").on('tap', "textarea[name='fsqlx']", function () {

        var picker = new mui.PopPicker();
        picker.setData(data);
        var self = this;
        picker.show(function (items) {
            $(self).val(items[0].text);
            switch (items[0].text) {
                case '壳+绳+卡片':
                    $(self).parent().parent().find("#fje").val(10.00);
                    $(self).parent().parent().find(".upload-addbtn").show();
                    break;
                case '壳+绳':
                    $(self).parent().parent().find("#fje").val(6.00);
                    $(self).parent().parent().find(".upload-addbtn").hide();
                    break;
                case '卡片':
                    $(self).parent().parent().find("#fje").val(4.00);
                    $(self).parent().parent().find(".upload-addbtn").show();
                    break;
                case '壳':
                    $(self).parent().parent().find("#fje").val(3.00);
                    $(self).parent().parent().find(".upload-addbtn").hide();
                    break;
                case '绳':
                    $(self).parent().parent().find("#fje").val(3.00);
                    $(self).parent().parent().find(".upload-addbtn").hide();
                    break;
                default:
                    break;
            }
        });
    });
}

function checkNes() {
    return true;
}

var fjArrayList = [];
var fjArrayListEvery = [];
var fjArrayObjCollections = [];
function initData(data, flag) {
    var item = data.FormDataSet.BPM_WGJTXGRYGZPSQ_A[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        $("#fbillno").val(item.fbillno);
    }
    $("#fname").val(item.fname);
    $("#fdate").val(FormatterTimeYMS(item.fdate));
    $("#fssgs").val(item.fssgs);
    $("#flxdh").val(item.ftel);

    var item_c = data.FormDataSet.BPM_WGJTXGRYGZPSQ_B;
    for (var i = 0; i < item_c.length; i++) {
        itemidArr.push(item_c[i].itemid);
        var li = `
                 <div id="mx" class="mui-card">
                      <div class="mui-input-row itemtitle">
                         <label>明细列表项</label>
                         <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>
                      </div>
                       <div class="mui-row cutOffLine" style="padding:3vw;">
                            <div class="mui-col-xs-3" style="display:flex;">
                                <label>姓名<i style="color:red;">*</i></label>
                                <textarea rows="2" id="fxm" readonly>${item_c[i].fxm}</textarea> 
                            </div>  
                            <div class="mui-col-xs-3" style="display:flex;">
                                <label>所属集团</label>
                                <textarea rows="2" id="fssjt" readonly>${item_c[i].fss_jt}</textarea>
                            </div>
                            <div class="mui-col-xs-3" style="display:flex;">
                                <label>所属公司</label>
                                <textarea rows="2" id="fssgs" readonly>${item_c[i].fssgs}</textarea> 
                            </div>
                            <div class="mui-col-xs-3" style="display:flex;">
                                    <label>所属部门</label>
                                    <textarea rows="2" id="fssbm" readonly>${item_c[i].fss_bm}</textarea>
                            </div>
                        </div>
                        <div class="mui-row cutOffLine" style="padding:3vw;">
                            <div class="mui-col-xs-4" style="display:flex;">
                                <label>职务</label> 
                                <textarea rows="2" id="fzw" readonly>${item_c[i].fzw}</textarea> 
                            </div>
                            <div class="mui-col-xs-4" style="display:flex;">
                                <label>申请类型<i style="color:red;">*</i></label>
                                <textarea rows="2" id="fsqlx" name="fsqlx" readonly >${item_c[i].fsqlx}</textarea>
                            </div> 
                            <div class="mui-col-xs-4" style="display:flex;">
                                <label>金额(元)</label>
                                <textarea rows="2" id="fje" readonly>${item_c[i].fje}</textarea>
                            </div> 
                        </div>
                       <div class="mui-input-row cutOffLine" style="height:7rem;overflow:scroll;" id="uploaddiv">
                          <div class="border border-t upload-img" style="top:0rem;">
                            <div class="clearfix upload-btn" id="children-bg">
                                <label class="label">照片</label>
                                <input type="hidden" id="fj_info_ids" name="fj_info_ids" readonly value="${item_c[i].fzp}"/>    
                                <span class="upload-addbtn" style="display:none;">
                                    <input type="file" accept="image/jpeg,image/jpg,image/png,image/jp2,image/bmp" id="file" style="opacity:0;">
                                </span>
                            </div>
                            <div class="upload-img-list-${i}" id="imglist">
                            </div>
                        </div>
                      </div>     
                 </div>
                   
                 `;
        $("#mxlist").append(li);
        var fjArrayC = item_c[i].fzp;
        fjArrayList.push(fjArrayC);
    }
    console.log(fjArrayList.join(";").split(";"));
    fjArrayListEvery = fjArrayList.join(";").split(";");
    $.ajax({
        type: 'POST',
        url: '/api/bpm/GetAttachmentsInfo',

        data: { 'fileIds': fjArrayListEvery },

        beforeSend: function (XHR) {
            XHR.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem('ticket'));
        }
    }).done((data) => {
        console.log(data);
        if (data.length == 0) {
            console.log('返回结果为空');
        }
        for (var i = 0; i < data.length; i++) {
            //请求返回到的附件信息
            var obj = {
                'Ext': String(data[i].Ext).replace(".", ""),
                'FileID': data[i].FileID,
                'LParam1': data[i].LParam1,
                'LastUpdate': String(data[i].LastUpdate).replace("T", " "),
                'MimeType': data[i].MimeType,
                'Name': data[i].Name,
                'OwnerAccount': data[i].OwnerAccount,
                'Size': String(data[i].Size),
                'DownloadUrl': baseDownloadUrl + data[i].FileID
            }
            fjArrayObjCollections.push(obj);
        }


    }).fail((e) => {

    }).then((data) => {



        $("#mxlist").find("input[name='fj_info_ids']").each(function (index, element) {
            var fjInfoIds = $(this).val();
            for (var i = 0; i < fjArrayObjCollections.length; i++) {
                if (String(fjInfoIds).match(fjArrayObjCollections[i].FileID) != null) {
                    console.log(fjArrayObjCollections[i]);
                    var li = ``;
                    if (String(fjArrayObjCollections[i].Ext).match('png') != null || String(fjArrayObjCollections[i].Ext).match('jpg') != null || String(fjArrayObjCollections[i].Ext).match('jpg') != null) {
                        li = AssembledDom(fjArrayObjCollections[i].Ext, baseDownloadUrl + fjArrayObjCollections[i].FileID, fjArrayObjCollections[i].FileID);
                    } else {
                        li = AssembledDom(fjArrayObjCollections[i].Ext, '', fjArrayObjCollections[i].FileID);
                    }
                    $(this).parent().parent().parent().find("#imglist").append(li);

                }
            }
        });
        $(".imgdiv").each(function () {
            $(this).on('tap', function () {
                console.log($(this).attr('id'));
                var fileid = $(this).attr('id');
                for (var i = 0; i < fjArrayObjCollections.length; i++) {
                    if (String(fjArrayObjCollections[i].FileID).match(fileid) != null) {
                        console.log(fjArrayObjCollections[i]);
                        XuntongJSBridge.call('showFile', {
                            'fileName': fjArrayObjCollections[i].Name,
                            'fileExt': fjArrayObjCollections[i].Ext,
                            'fileTime': fjArrayObjCollections[i].LastUpdate,
                            'fileSize': fjArrayObjCollections[i].Size,
                            'fileDownloadUrl': fjArrayObjCollections[i].DownloadUrl
                        }, function (result) {
                            //alert(JSON.stringify(result));
                        });
                    }
                }
            });

        });

    });
}

function nodeControllerExp(NodeName) {
    if (String(NodeName).match('开始') != null) {
        tapEvent();
        $("#mxlist").find('span').each(function () {
            $(this).show();
        });
        uploadOpt();
        $("#flxdh").removeAttr('readonly');
        $("#tjmx").show();

    }
}

class Mx {
    constructor(fxm, fssjt, fssgs, fssbm, fzw, fsqlx, fje,ffjArr) {
        this.fxm = fxm;
        this.fssjt = fssjt;
        this.fssgs = fssgs;
        this.fssbm = fssbm;
        this.fzw = fzw;
        this.fsqlx = fsqlx;
        this.fje = fje;
        this.ffjArr = ffjArr;
    }
    check() {
        if (!this.fsqlx) {
            mui.toast('请选择申请类型');
            return true;
        }

        return false;
    }
}

function Save() {
    var fname = $("#fname").val();
    var fdate = $("#fdate").val();
    var fssgs = $("#fssgs").val();
    var flxdh = $("#flxdh").val();
    if (!flxdh) {
        mui.toast('请填写联系方式');
        return;
    }
    var mxlistArr = [];
    var mxflag = false;
    $("#mxlist").find("#mx").each(function () {
        var fxm = $(this).find("#fxm").val();
        var fssjt = $(this).find("#fssjt").val();
        var fssgs = $(this).find("#fssgs").val();
        var fssbm = $(this).find("#fssbm").val();
        var fzw = $(this).find("#fzw").val();
        var fsqlx = $(this).find("#fsqlx").val();
        var fje = $(this).find("#fje").val();
        var ffjArr = [];
        $(this).find('img').each(function () {
            ffjArr.push($(this).data('id'));

        });

        var mx = new Mx(fxm, fssjt, fssgs, fssbm, fzw, fsqlx, fje, ffjArr);
        if (mx.check()) {
            mxflag = !mxflag;
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
            var xml = `<?xml version="1.0"?>
                        <XForm>
                            <Header>
                                <Method>Post</Method>
                                <ProcessName>集团公司行管人员工作牌申请</ProcessName>
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
                     <BPM_WGJTXGRYGZPSQ_A>
                        <fbillno>自动生成</fbillno>
                        <fname>${fname}</fname>
                        <fdate>${fdate}</fdate>
                        <fssgs>${fssgs}</fssgs>
                        <ftel>${flxdh}</ftel>
                    </BPM_WGJTXGRYGZPSQ_A>
                   `;
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `
                            <BPM_WGJTXGRYGZPSQ_B>
                                <RelationRowGuid>${i+1}</RelationRowGuid>
                                <RowPrimaryKeys></RowPrimaryKeys>
                                <fentyrno>${i + 1}</fentyrno>
                                <fxm>${mxlistArr[i].fxm}</fxm>
                                <fss_jt>${mxlistArr[i].fssjt}</fss_jt>
                                <fssgs>${mxlistArr[i].fssgs}</fssgs>
                                <fss_bm>${mxlistArr[i].fssbm}</fss_bm>
                                <fzw>${mxlistArr[i].fzw}</fzw>
                                <fsqlx>${mxlistArr[i].fsqlx}</fsqlx>
                                <fje>${mxlistArr[i].fje}</fje>
                                <fzp>${mxlistArr[i].ffjArr.join(";")}</fzp>
                            </BPM_WGJTXGRYGZPSQ_B>
                        `;
            }
            xml += `
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
    var fdate = $("#fdate").val();
    var fssgs = $("#fssgs").val();
    var flxdh = $("#flxdh").val();
    if (!flxdh) {
        mui.toast('请填写联系方式');
        return;
    }
    var mxlistArr = [];
    var mxflag = false;
    $("#mxlist").find("#mx").each(function () {
        var fxm = $(this).find("#fxm").val();
        var fssjt = $(this).find("#fssjt").val();
        var fssgs = $(this).find("#fssgs").val();
        var fssbm = $(this).find("#fssbm").val();
        var fzw = $(this).find("#fzw").val();
        var fsqlx = $(this).find("#fsqlx").val();
        var fje = $(this).find("#fje").val();
        var ffjArr = [];
        $(this).find('img').each(function () {
            ffjArr.push($(this).data('id'));

        });

        var mx = new Mx(fxm, fssjt, fssgs, fssbm, fzw, fsqlx, fje, ffjArr);
        if (mx.check()) {
            mxflag = !mxflag;
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
                     <BPM_WGJTXGRYGZPSQ_A>
                        <fbillno>${fbillno}</fbillno>
                        <fname>${fname}</fname>
                        <fdate>${fdate}</fdate>
                        <fssgs>${fssgs}</fssgs>
                        <ftel>${flxdh}</ftel>
                    </BPM_WGJTXGRYGZPSQ_A>
                   `;
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `
                            <BPM_WGJTXGRYGZPSQ_B>
                                <RelationRowGuid>${i + 1}</RelationRowGuid>
                                <RowPrimaryKeys></RowPrimaryKeys>
                                <fentyrno>${i + 1}</fentyrno>
                                <fxm>${mxlistArr[i].fxm}</fxm>
                                <fss_jt>${mxlistArr[i].fssjt}</fss_jt>
                                <fssgs>${mxlistArr[i].fssgs}</fssgs>
                                <fss_bm>${mxlistArr[i].fssbm}</fss_bm>
                                <fzw>${mxlistArr[i].fzw}</fzw>
                                <fsqlx>${mxlistArr[i].fsqlx}</fsqlx>
                                <fje>${mxlistArr[i].fje}</fje>
                                <fzp>${mxlistArr[i].ffjArr.join(";")}</fzp>
                            </BPM_WGJTXGRYGZPSQ_B>
                        `;
            }
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
    var fname = $("#fname").val();
    var fdate = $("#fdate").val();
    var fssgs = $("#fssgs").val();
    var flxdh = $("#flxdh").val();
    
    var mxlistArr = [];
    var mxflag = false;
    $("#mxlist").find("#mx").each(function () {
        var fxm = $(this).find("#fxm").val();
        var fssjt = $(this).find("#fssjt").val();
        var fssgs = $(this).find("#fssgs").val();
        var fssbm = $(this).find("#fssbm").val();
        var fzw = $(this).find("#fzw").val();
        var fsqlx = $(this).find("#fsqlx").val();
        var fje = $(this).find("#fje").val();
        var ffjArr = [];
        $(this).find('img').each(function () {
            ffjArr.push($(this).data('id'));

        });

        var mx = new Mx(fxm, fssjt, fssgs, fssbm, fzw, fsqlx, fje, ffjArr);
       
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
                     <BPM_WGJTXGRYGZPSQ_A>
                        <fbillno>${fbillno}</fbillno>
                        <fname>${fname}</fname>
                        <fdate>${fdate}</fdate>
                        <fssgs>${fssgs}</fssgs>
                        <ftel>${flxdh}</ftel>
                    </BPM_WGJTXGRYGZPSQ_A>
                   `;
            for (var i = 0; i < mxlistArr.length; i++) {
                xml += `
                            <BPM_WGJTXGRYGZPSQ_B>
                                <RelationRowGuid>${i + 1}</RelationRowGuid>
                                <RowPrimaryKeys>itemid=${itemidArr[i]}</RowPrimaryKeys>
                                <fentyrno>${i + 1}</fentyrno>
                                <fxm>${mxlistArr[i].fxm}</fxm>
                                <fss_jt>${mxlistArr[i].fssjt}</fss_jt>
                                <fssgs>${mxlistArr[i].fssgs}</fssgs>
                                <fss_bm>${mxlistArr[i].fssbm}</fss_bm>
                                <fzw>${mxlistArr[i].fzw}</fzw>
                                <fsqlx>${mxlistArr[i].fsqlx}</fsqlx>
                                <fje>${mxlistArr[i].fje}</fje>
                                <fzp>${mxlistArr[i].ffjArr.join(";")}</fzp>
                            </BPM_WGJTXGRYGZPSQ_B>
                        `;
            }
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
                     <BPM_WGJTXGRYGZPSQ_A>
                        <fbillno>${fbillno}</fbillno>
                        <fname>${fname}</fname>
                        <fdate>${fdate}</fdate>
                        <fssgs>${fssgs}</fssgs>
                        <ftel>${flxdh}</ftel>
                    </BPM_WGJTXGRYGZPSQ_A>
                   `;
        for (var i = 0; i < mxlistArr.length; i++) {
            xml += `
                            <BPM_WGJTXGRYGZPSQ_B>
                                <RelationRowGuid>${i + 1}</RelationRowGuid>
                                <RowPrimaryKeys>itemid=${itemidArr[i]}</RowPrimaryKeys>
                                <fentyrno>${i + 1}</fentyrno>
                                <fxm>${mxlistArr[i].fxm}</fxm>
                                <fss_jt>${mxlistArr[i].fssjt}</fss_jt>
                                <fssgs>${mxlistArr[i].fssgs}</fssgs>
                                <fss_bm>${mxlistArr[i].fssbm}</fss_bm>
                                <fzw>${mxlistArr[i].fzw}</fzw>
                                <fsqlx>${mxlistArr[i].fsqlx}</fsqlx>
                                <fje>${mxlistArr[i].fje}</fje>
                                <fzp>${mxlistArr[i].ffjArr.join(";")}</fzp>
                            </BPM_WGJTXGRYGZPSQ_B>
                        `;
        }
        xml += `
                       </FormData>
                    </XForm>
                   `;
        PostXml(xml);
    }
   
}