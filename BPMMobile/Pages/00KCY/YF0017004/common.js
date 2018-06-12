function prepMsg() {
    $("#ftjrq").val(getNowFormatDate(2));
    tapEvent();
    tapEvent_preparation();
    upload();
    var xml = `<?xml version= "1.0" ?>
                  <Requests>
                      <Params>
                      <Method>GetFormPostData</Method>
                      <ProcessName>集团公司新产品研发信息推荐申请</ProcessName>
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
        $("#ftbr").val(item.填表人);
        $("#ftbrno").val(item.填表人ID);
        $("#ftjr").val(item.推荐人);
        $("#ftjrno").val(item.推荐人ID);
    }).fail(function (e) {

    }).then(function () {
        initCompross();
    });
}

function tapEvent() {

    var fxxlx_data = [
        {
            value: '',
            text:'全新产品推荐'
        },
        {
            value: '',
            text:'改善产品推荐'
        },
        {
            value: '',
            text:'先进技术推荐'
        },
        {
            value: '',
            text:'新材料推荐'
        },
        {
            value: '',
            text:'临床需求推荐'
        },
        {
            value: '',
            text:'管理改进推荐'
        },
        {
            value: '',
            text:'产品销售推荐'
        }

    ];
    showPicker('fxxlx', fxxlx_data);


    $("#ftjr").on('tap', function () {
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
                        $("#ftjr").val(pio.NAME);
                        $("#ftjrno").val(pio.PHONE);
                    }).fail(function (e) {
                        console.log(e);
                    });
                })
            }
        });

    });


   
}

function initCompross() {
    var xml = `<?xml version= "1.0" ?>
                    <Requests>
                        <Params>
                            <DataSource>制品开发</DataSource>
                            <ID>erpcloud_查询新产品信息推荐基础表</ID>
                            <Type>1</Type>
                            <Method>GetUserDataProcedure</Method>
                            <ProcedureName>erpcloud_查询新产品信息推荐基础表</ProcedureName>
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

        //console.log(itemData);

        var iiA = itemData.filter((el, i, arr) => {
            if (itemData[i].部门类型 == '集团') {
                return itemData[i];
            }
        });
        iiA = iiA.map((el, i, arr) => {
            var obj = {
                value: iiA[i].ID,
                text: iiA[i].单位,
                name: iiA[i].姓名,
                no: iiA[i].工号,
                tel: iiA[i].电话,
                title: iiA[i].职务,
                email: iiA[i].邮箱,
                type: iiA[i].部门类型,
                children: []
            }
            return obj;
        });
        
        var iiN = itemData.filter((el, i, arr) => {
            if (itemData[i].部门类型 != '集团') {
                return itemData[i];
            }
        });
      
        iiN = iiN.map((el, i, arr) => {

            var obj = {
                value: iiN[i].ID,
                text: iiN[i].单位,
                name: iiN[i].姓名,
                no: iiN[i].工号,
                tel: iiN[i].电话,
                title: iiN[i].职务,
                email: iiN[i].邮箱,
                type: iiN[i].部门类型,
                top:iiN[i].上级单位
            }
            return obj;
        });
        //console.log(iiN);
        iiN.forEach((el, i, arr) => {
            iiA.forEach((element, index, array) => {
                if (iiA[index].value == iiN[i].top) {
                    (iiA[index].children).push(iiN[i]);
                }
            });
        });
        console.log(iiA);

        var pickerii = new mui.PopPicker({ layer: 2 });
        pickerii.setData(iiA);
        $("body").on('tap', '.choseGr', function () {
            pickerii.show((items) => {
                $("#fssjt").val(items[0].text);
                $("#fssgs").val(items[1].text);
            });
        }); 



    }).fail(function (e) {

    });

}

function initGroups() {
    
    var xml = `<?xml version= "1.0" ?>
                    <Requests>
                        <Params>
                            <DataSource>制品开发</DataSource>
                            <ID>erpcloud_查询新产品信息推荐基础表</ID>
                            <Type>1</Type>
                            <Method>GetUserDataProcedure</Method>
                            <ProcedureName>erpcloud_查询新产品信息推荐基础表</ProcedureName>
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
        //console.log(itemData);
        var iiA = itemData.filter((el, i, arr) => {
            if (itemData[i].部门类型 == '集团') {
                return itemData[i];
            }
        });
        iiA = iiA.map((el, i, arr) => {
            var obj = {
                value: iiA[i].ID,
                text: iiA[i].单位,
                name: iiA[i].姓名,
                no: iiA[i].工号,
                tel: iiA[i].电话,
                title: iiA[i].职务,
                email: iiA[i].邮箱,
                type: iiA[i].部门类型,
                children: []
            }
            return obj;
        });

        var iiN = itemData.filter((el, i, arr) => {
            if (itemData[i].部门类型 != '集团') {
                return itemData[i];
            }
        });

        iiN = iiN.map((el, i, arr) => {

            var obj = {
                value: iiN[i].ID,
                text: iiN[i].单位,
                name: iiN[i].姓名,
                no: iiN[i].工号,
                tel: iiN[i].电话,
                title: iiN[i].职务,
                email: iiN[i].邮箱,
                type: iiN[i].部门类型,
                top: iiN[i].上级单位
            }
            return obj;
        });
        //console.log(iiN);
        iiN.forEach((el, i, arr) => {
            iiA.forEach((element, index, array) => {
                if (iiA[index].value == iiN[i].top) {
                    (iiA[index].children).push(iiN[i]);
                }
            });
        });
        console.log(iiA);
        var picker = new mui.PopPicker();
        picker.setData(iiA);
        $("body").on('tap', '#fpgdw_jt', function () {
            var _self = this;
            picker.show(function (items) {

                $(_self).val(items[0].text);
                $(_self).parent().find("#fpgdw_jt_id").val(items[0].value);
                $(_self).parent().parent().find("#fcyjtyffzr").val(items[0].name);
                $(_self).parent().parent().find("#fcyjtyffzrno").val(items[0].no);

            });
        });
       
    }).fail(function (e) {

    });
}

//初审
function tapEvent_first() {
    var fif_data = [
        {
            value: '',
            text: '有'
        },
        {
            value: '',
            text: '无'
        }
    ];

    //showPicker('fif_pgjz', fif_data);

    var picker_if = new mui.PopPicker();
    picker_if.setData(fif_data);
    $("#fif_pgjz").on('tap', function () {
        picker_if.show(function (items) {
            $("#fif_pgjz").val(items[0].text);
            if (items[0].text == '有') {
                $("#fxxsh_card").show();
                $("#tjmx_xx").show();
            } else {
                $("#fxxsh_card").hide();
                $("#tjmx_xx").hide();
            }

        });
    });

    var fpgqx_data = [
        {
            value: '',
            text: '7天'
        },
        {
            value: '',
            text: '15天'
        },
        {
            value: '',
            text: '20天'
        },
        {
            value: '',
            text: '30天'
        }
    ];
    showPicker('fpgqx', fpgqx_data);

    var opts_date = {
        "type": "date"
    };

    var picker_date = new mui.DtPicker(opts_date);

    $("#fjzrq").on('tap', function () {

        picker_date.show(function (rs) {

            $("#fjzrq").val(rs.text);

        });
    });

   
    initGroups();


    $('body').on('tap', '#fcyjtyffzr', function () {
        var _self = this;
        var opidArr = [];
        XuntongJSBridge.call('selectPerson', { 'pType': '1' }, function () {

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
                        $(_self).val(pio.NAME);
                        $(_self).parent().find("#fcyjtyffzrno").val(pio.PHONE);




                    }).fail(function (e) {
                        console.log(e);
                    });
                });
            }



        });
    });
    $("#tjmx_xx").on('tap', function () {

        var li = `
<div id="mx">
                        <div class="mui-input-row itemtitle">
                            <label>明细列表项</label>
                            <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;" id="deleteProduct" onclick="deleteItem(this)"></span>
                        </div>
                        <div class="mui-row cutOffLine padding">
                            <div class="mui-col-xs-4" style="display:flex;">
                                <label>评估单位(集团)<i style="color:red;">*</i></label>
                                <textarea rows="2" id="fpgdw_jt" readonly></textarea>
                                <input type="hidden" id="fpgdw_jt_id" readonly value="" />
                            </div>
                            <div class="mui-col-xs-4" style="display:flex;">
                                <label>产业集团研发负责人</label>
                                <textarea rows="2" id="fcyjtyffzr" readonly></textarea>
                                <input type="hidden" id="fcyjtyffzrno" readonly />
                            </div>
                            <div class="mui-col-xs-4" style="display:flex;">
                                <label>是否有评估价值<i style="color:red;">*</i></label>
                                <textarea rows="2" id="fif_pgjz_xx" readonly></textarea>
                            </div>
                        </div>
                        <div class="mui-row cutOffLine padding">
                            <div class="mui-col-xs-12" style="display:flex;">
                                <label>意见说明</label>
                                <textarea rows="2" id="fyjsm" readonly></textarea>
                            </div>
                        </div>
                    </div>
                    
                 `;
        $("#xxlist").append(li);
    });
    

}


function initComp() {
    var xml = `<?xml version= "1.0" ?>
                    <Requests>
                        <Params>
                            <DataSource>制品开发</DataSource>
                            <ID>erpcloud_查询新产品信息推荐基础表</ID>
                            <Type>1</Type>
                            <Method>GetUserDataProcedure</Method>
                            <ProcedureName>erpcloud_查询新产品信息推荐基础表</ProcedureName>
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
        //console.log(itemData);
        
        var iiN = itemData.filter((el, i, arr) => {
            if (itemData[i].部门类型 != '集团') {
                return itemData[i];
            }
        });

        iiN = iiN.map((el, i, arr) => {
           
            var obj = {
                value: iiN[i].ID,
                text: iiN[i].单位,
                name: iiN[i].姓名,
                no: iiN[i].工号,
                tel: iiN[i].电话,
                title: iiN[i].职务,
                email: iiN[i].邮箱,
                type: iiN[i].部门类型,
                top: iiN[i].上级单位
            }
            return obj;
        });
       

        console.log(iiA);
        var picker = new mui.PopPicker();
        picker.setData(iiA);
        $("body").on('tap', '#fpgdw_zgs', function () {
            var _self = this;
            var keyword = $('body').find("#fpgdw_jt").val();
            console.log(keyword);
            picker.show(function (items) {

                $(_self).val(items[0].text);

            });
        });

    }).fail(function (e) {

    });
}
//预审
function tapEvent_preparation() {

    $("body").on('tap', '#fpgr', function () {
        var _self = this;
        var opidArr = [];
        XuntongJSBridge.call('selectPerson', { 'pType': '1' }, function () {

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
                        $(_self).val(pio.NAME);
                        $(_self).parent().find("#fpgrno").val(pio.PHONE);


                    }).fail(function (e) {
                        console.log(e);
                    });
                });
            }



        });

    });

   
}
//信息审核
function tapEvent_Information_audit() {
    var fif_data = [
        {
            value: '',
            text:'是'
        },
        {
            value: '',
            text:'否'
        }
    ];
    var picker_if = new mui.PopPicker();
    picker_if.setData(fif_data);
    $('body').on('tap', '#fif_pgjz_xx', function () {
        var _self = this;
        picker_if.show(function (items) {
            $(self).val(items[0].text);
        });
    });


    initComp();

    $('body').on('tap', '#fpgr', function () {
        var _self = this;
        var opidArr = [];
        XuntongJSBridge.call('selectPerson', { 'pType': '1' }, function () {

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
                        $(_self).val(pio.NAME);
                        $(_self).parent().find("#fpgrno").val(pio.PHONE);




                    }).fail(function (e) {
                        console.log(e);
                    });
                });
            }



        });
    });



}
//信息评估
function tapEvent_Information_Evaluation() {
    var fpg_data = [
        {
            value: '',
            text:'有价值调研'
        },
        {
            value: '',
            text: '有价值相关'
        },
        {
            value: '',
            text: '有价值不相关'
        },
        {
            value: '',
            text: '无价值'
        }

    ];

    var picker_pg = new mui.PopPicker();
    picker_pg.setData(fpg_data);
    $("body").on('tap', '#fpgjl', function () {
        var _self = this;
        picker_pg.show(function (items) {
            $(_self).val(items[0].text);
        });
    });


}


function initData(data, flag) {
    var item = data.FormDataSet.新产品信息推荐_主表[0];
    if (flag) {
        $("#taskId").val(item.TaskID);
        $("#stepId").val(stepId);
        
    }
    $("#ftjr").val(item.推荐人);
    $("#ftjrno").val(item.推荐人ID);
    $("#flxdh").val(item.联系电话);
    $("#femail").val(item.邮箱);
    $("#fssjt").val(item.所属集团);
    $("#fssgs").val(item.所属公司);
    $("#ftbr").val(item.填表人);
    $("#ftjrq").val(FormatterTimeYMS(item.推荐日期));
    $("#fcpmc").val(item.信息名称);
    $("#fxxbh").val(item.信息编号);
    $("#fxxlx").val(item.信息类型);
    $("#fypsl").val(item.样品数量);
    $("#fcpsm").val(item.信息说明);
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
    $("#fif_pgjz").val(item.是否有评估价值);
    $("#fpgqx").val(item.评估期限);
    $("#fjzrq").val(FormatterTimeYMS(item.截止日期));
    $("#fyssm").val(item.预审说明);
    $("#fjl").val(item.评审结论);
    $("#fpsrq").val(FormatterTimeYMS(item.评审日期));
    $("#fbeizhu").val(item.备注);
    $("#fssjt_id").val(item.所属集团ID);

    var item_c = data.FormDataSet.新产品信息推荐_审核;

    for (var i = 0; i < item_c.length; i++) {

        var li = `
                  <div id="mx">
                        <div class="mui-input-row itemtitle">
                            <label>明细列表项</label>
                            <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>
                        </div>
                        <div class="mui-row cutOffLine padding">
                            <div class="mui-col-xs-4" style="display:flex;">
                                <label>评估单位(集团)<i style="color:red;">*</i></label>
                                <textarea rows="2" id="fpgdw_jt" readonly>${item_c[i].评估单位}</textarea>
                                <input type="hidden" id="fpgdw_jt_id" readonly value="${item_c[i].评估单位ID}"/>
                            </div>
                            <div class="mui-col-xs-4" style="display:flex;">
                                <label>产业集团研发负责人</label>
                                <textarea rows="2" id="fcyjtyffzr" readonly>${item_c[i].审核人}</textarea>
                                <input type="hidden" id="fcyjtyffzrno" readonly value="${item_c[i].审核人ID}"/>
                            </div>
                            <div class="mui-col-xs-4" style="display:flex;">
                                <label>是否有评估价值<i style="color:red;">*</i></label>
                                <textarea rows="2" id="fif_pgjz_xx" readonly>${item_c[i].是否有评估价值}</textarea>
                                <input type="hidden" id="fshrq_xx" readonly value="${FormatterTimeYMS(item_c[i].审核日期)}"/>
                            </div>
                        </div>
                        <div class="mui-row cutOffLine padding">
                            <div class="mui-col-xs-12" style="display:flex;">
                                <label>意见说明</label>
                                <textarea rows="2" id="fyjsm" readonly>${item_c[i].审核说明}</textarea>
                            </div>
                        </div>
                    </div>
                 `;

        $("#xxlist").append(li);
    }

    var item_c2 = data.FormDataSet.新产品信息推荐_评估;
    for (var i = 0; i < item_c2.length; i++) {
        var li = `
                  <div id="mx">
                        <div class="mui-input-row itemtitle">
                            <label>明细列表项</label>
                            <span class="mui-icon mui-icon-close mui-pull-right" style="margin-right:0.6rem;border-width:0.1rem;border-radius:1.2rem;margin-top:0.2rem;display:none;" id="deleteProduct" onclick="deleteItem(this)"></span>
                        </div>
                        <div class="mui-row cutOffLine padding">
                            <div class="mui-col-xs-4" style="display:flex;">
                                <label>评估单位(子公司)<i style="color:red;">*</i></label>
                                <textarea rows="2" id="fpgdw_zgs" readonly>${item_c2[i].评估单位}</textarea>
                            </div>
                            <div class="mui-col-xs-4" style="display:flex;">
                                <label>评估人</label>
                                <textarea rows="2" id="fpgr" readonly>${item_c2[i].评估人}</textarea>
                                <input type="hidden" id="fpgrno" readonly value="${item_c2[i].评估人ID}"/>
                            </div>
                            <div class="mui-col-xs-4" style="display:flex;">
                                <label>评估结论<i style="color:red;">*</i></label>
                                <textarea rows="2" id="fpgjl" readonly>${item_c2[i].评估意见}</textarea>
                            </div>
                        </div>
                        <div class="mui-row cutOffLine padding">
                            <div class="mui-col-xs-12" style="display:flex;">
                                <label>意见说明</label>
                                <textarea rows="2" id="fyjsm_xxpg" readonly>${item_c2[i].评估说明}</textarea>
                            </div>
                        </div>
                    </div>
                 `;
        $("#pglist").append(li);
    }
}

function nodeControllerExp(NodeName) {
    if (String(NodeName).match('开始') != null) {

    } else if (String(NodeName).match('初审') != null){

        $("#fysinfo_card").show();
        tapEvent_first();
        $("#fyssm").removeAttr('readonly');
        $("#fjzrq").val('').attr('placeholder', '请选择');
        $("#fif_pgjz").attr('placeholder', '请选择');
        $("#fpgqx").attr('placeholder', '请选择');
    } else if (String(NodeName).match('预审') != null) {
        $("#fysinfo_card").show();
        tapEvent_first();
        $("#fyssm").removeAttr('readonly');
        $("#fjzrq").val('').attr('placeholder', '请选择');
        $("#fif_pgjz").attr('placeholder', '请选择');
        $("#fpgqx").attr('placeholder', '请选择');
    } else if (String(NodeName).match('信息审核') != null) {

    } else if (String(NodeName).match('信息评估') != null) {

    }


}

function checkNes() {

    return true;
}

class XXinfo{
    constructor(fpgdw_jt, fpgdw_jt_id, fcyjtyffzr, fcyjtyffzrno, fif_pgjz_xx, fyjsm) {
        this.fpgdw_jt = fpgdw_jt;
        this.fpgdw_jt_id = fpgdw_jt_id;
        this.fcyjtyffzr = fcyjtyffzr;
        this.fcyjtyffzrno = fcyjtyffzrno;
        this.fif_pgjz_xx = fif_pgjz_xx;
        this.fyjsm = fyjsm;
    }
}

class PGinfo {
    constructor(fpgdw_zgs, fpgr, fpgrno, fpgjl, fyjsm_xxpg) {
        this.fpgdw_zgs = fpgdw_zgs;
        this.fpgr = fpgr;
        this.fpgrno = fpgrno;
        this.fpgjl = fpgjl;
        this.fyjsm_xxpg = fyjsm_xxpg;
    }
}



function Save() {
    var ftjr = $("#ftjr").val();
    var ftjrno = $("#ftjrno").val();
    var flxdh = $("#flxdh").val();
    var femail = $("#femail").val();
    var fssjt = $("#fssjt").val();
    var fssgs = $("#fssgs").val();
    var ftbr = $("#ftbr").val();
    var ftbrno = $("#ftbrno").val();
    var ftjrq = $("#ftjrq").val();
    var fcpmc = $("#fcpmc").val();
    var fxxbh = $("#fxxbh").val();
    var fxxlx = $("#fxxlx").val();
    var fypsl = $("#fypsl").val();
    var fcpsm = $("#fcpsm").val();

    var fssjt_id = $("#fssjt_id").val();
    if (!ftjr) {
        mui.toast('请选择推荐人');
        return;
    }
    if (!flxdh) {
        mui.toast('请填写联系电话');
        return;
    }

    if (!femail) {
        mui.toast('请填写邮箱');
        return;
    }

    if (!fssjt) {
        mui.toast('请选择所属集团');
        return;
    }
    if (!fssgs) {
        mui.toast('请选择所属公司');
        return;
    }
    if (!ftjrq) {
        mui.toast('请选择推荐日期');
        return;
    }
    if (!fcpmc) {
        mui.toast('请填写产品名称');
        return;
    }
    if (!fxxlx) {
        mui.toast('请选择信息类型');
        return;
    }
    if (!fypsl) {
        mui.toast('请选择样品数量');
        return;
    }



    var btnArry = ["取消", "确定"];
    mui.confirm('即将提交，是否确定？', '提交确认提醒', btnArry, function (e) {
        if (e.index == 1) {
            var xml = `<?xml version="1.0"?>
                        <XForm>
                            <Header>
                                <Method>Post</Method>
                                <ProcessName>集团公司新产品研发信息推荐申请</ProcessName>
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
            xml += `<新产品信息推荐_主表>
            <推荐人>${ftjr}</推荐人>
            <推荐人ID>${ftjrno}</推荐人ID>
            <联系电话>${flxdh}</联系电话>
            <邮箱>${femail}</邮箱>
            <所属集团>${fssjt}</所属集团>
            <所属公司>${fssgs}</所属公司>
            <填表人>${ftbr}</填表人>
            <推荐日期>${ftjrq}</推荐日期>
            <信息名称>${fcpmc}</信息名称>
            <信息编号>${fxxbh}</信息编号>
            <信息类型>${fxxlx}</信息类型>
            <样品数量>${fypsl}</样品数量>
            <信息说明>${fcpsm}</信息说明>
            <附件>${fjArray.join(";")}</附件>
            <是否有评估价值></是否有评估价值>
            <评估期限></评估期限>
            <截止日期></截止日期>
            <预审说明></预审说明>
            <评审结论></评审结论>
            <评审日期></评审日期>
            <备注></备注>
            <所属集团ID>${fssjt_id}</所属集团ID>
        </新产品信息推荐_主表>
                    `;
            xml += `
             <新产品信息推荐_审核>
             </新产品信息推荐_审核>
            <新产品信息推荐_评估>
             </新产品信息推荐_评估>
                    `;
            xml += `
                       </FormData>
                    </XForm>
                   `;
          
            PostXml(xml);
        }
    });

}

function reSave() {

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

    //----发起包含的字段
    var ftjr = $("#ftjr").val();
    var ftjrno = $("#ftjrno").val();
    var flxdh = $("#flxdh").val();
    var femail = $("#femail").val();
    var fssjt = $("#fssjt").val();
    var fssgs = $("#fssgs").val();
    var ftbr = $("#ftbr").val();
    var ftbrno = $("#ftbrno").val();
    var ftjrq = $("#ftjrq").val();
    var fcpmc = $("#fcpmc").val();
    var fxxbh = $("#fxxbh").val();
    var fxxlx = $("#fxxlx").val();
    var fypsl = $("#fypsl").val();
    var fcpsm = $("#fcpsm").val();

    var fssjt_id = $("#fssjt_id").val();

    //--初审\预审包含的字段
    var fif_pgjz = $("#fif_pgjz").val();
    var fpgqx = $("#fpgqx").val();
    var fjzrq = $("#fjzrq").val();
    var fyssm = $("#fyssm").val();

    //--信息审核包含的字段
    var mxlistArr1 = [];
    $("#xxlist").find("#mx").each(function () {
        var fpgdw_jt = $(this).find("#fpgdw_jt").val();
        var fpgdw_jt_id = $(this).find("#fpgdw_jt_id").val();
        var fcyjtyffzr = $(this).find("#fcyjtyffzr").val();
        var fcyjtyffzrno = $(this).find("#fcyjtyffzrno").val();
        var fif_pgjz_xx = $(this).find("#fif_pgjz_xx").val();
        var fyjsm = $(this).find("#fyjsm").val();

        var mx = new XXinfo(fpgdw_jt, fpgdw_jt_id, fcyjtyffzr, fcyjtyffzrno, fif_pgjz_xx, fyjsm);
        mxlistArr1.push(mx);
    });

    //--信息评估包含的字段
    var mxlistArr2 = [];
    $("#pglist").find("#mx").each(function () {


        var mx = new PGinfo(fpgdw_zgs, fpgr, fpgrno, fpgjl, fyjsm_xxpg);
        mxlistArr2.push(mx);
    });

}