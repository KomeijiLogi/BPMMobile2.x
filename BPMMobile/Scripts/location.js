/*
*
*  author:KomeijiLogi
*  date:2018/05/21
*  description:基于查询BPM显示2级联动的城市数据选择插件 
*
*/
(function (Window,$,mui) {
    var provinceData = [];         //省份数据
    var cityData = [];             //城市数据
    var locationData = [];         //组装的省份和城市数据 
    var defaultConfig = {
        
         targetEle: '',         //目标元素
         isDelegate: false,    //是否事件代理，true为是，false为否
         cityId: '',           //城市元素id
         proId:''              //省份id  
    };

    //主函数
    var showCityPicker = function (config) {

        var conf = $.extend({}, defaultConfig, config);   //混合参数

        return this.each(function () {
            var selector = this.id ? '#' + this.id : (this.className ? getClassSelector(this.className) : this.tagName);

            new assembledController().init(conf);    //加载配置

            $('body').on('tap', selector, function () {
                var picker = new mui.PopPicker({
                    layer:2
                });
                picker.setData(locationData);
                picker.show(function (items) {

                    $(selector).parent().parent().find('#' + config.proId).val(items[0].text);   //省份name
                    $(selector).parent().parent().find('#' + config.proId).data('provinceid',items[0].provinceid);   //省份id

                    $(selector).parent().parent().find('#' + config.cityId).val(items[1].text);  //城市name
                    $(selector).parent().parent().find('#' + config.cityId).data('citytype', items[1].citytype); //城市type
                    $(selector).parent().parent().find('#' + config.cityId).data('cityid', items[1].cityid);   //城市id

                });
            });
        });
    }

    
    
    //拼装数组信息
    function assembledController() {

    }
    assembledController.prototype = {
        init: function (conf) {
            this.conf = conf;  //传递参数配置

            this.getProvince();

            this.getCity();

            //this.assemArray();

            //var self = this;
            //var promise = new Promise(function (resolve,reject) {
            //    self.getProvince();
            //    self.getCity();
            //    resolve(provinceData, cityData);
            //});
            //promise.then(function (value) {
                
            //    self.assemArray();
            //});
            
        },
        getCity: function () {             //获取城市信息
            var self = this;
            var xml = `<?xml version= "1.0" ?>
                                 <Requests>
                                 <Params>
                                 <DataSource>BPM_EXPENSE</DataSource>
                                 <ID>erpcloud_查询城市</ID>
                                 <Type>1</Type>
                                 <Method>GetUserDataProcedure</Method>
                                 <ProcedureName>erpcloud_查询城市</ProcedureName>
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
                console.log(provideData);
                var cDatas = provideData.Tables[0].Rows;
                for (var i = 0; i < cDatas.length; i++) {
                    var citys = {
                        text: cDatas[i].cityname,
                        id: cDatas[i].id,
                        itemid: cDatas[i].itemid,
                        orderindex: cDatas[i].orderindex,
                        citytype: cDatas[i].citytype,
                        cityid: cDatas[i].cityid
                    }
                    cityData.push(citys);
                }
                console.log('-----------cityData-----------');
                console.log(cityData);

            }).fail(function (e) {

                }).then(function () {
                    self.assemArray();
                });
        },
        getProvince: function () {              //获取省份信息
            var xml = `<?xml version= "1.0" ?>
                                 <Requests>
                                 <Params>
                                 <DataSource>BPM_EXPENSE</DataSource>
                                 <ID>erpcloud_查询省份</ID>
                                 <Type>1</Type>
                                 <Method>GetUserDataProcedure</Method>
                                 <ProcedureName>erpcloud_查询省份</ProcedureName>
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
                console.log(provideData);
                var pDatas = provideData.Tables[0].Rows;
                for (var i = 0; i < pDatas.length; i++) {
                    var pro = {
                        flag: pDatas[i].flag,
                        id: pDatas[i].id,
                        provinceid: pDatas[i].provinceid,
                        text: pDatas[i].provincename,
                        children:[]
                    }
                    provinceData.push(pro);
                }
                console.log('-----------provinceData-----------');
                console.log(provinceData);

            }).fail(function (e) {
                console.log(e);
            });
        },
        assemArray: function () {              //拼接数组信息


           
            for (var i = 0; i < provinceData.length; i++) {

                var proTmp = [];
               
                for (var j = 0; j < cityData.length; j++) {
                    
                    if (cityData[j].id == provinceData[i].id) {
                       
                        proTmp.push(cityData[j]);
                    }
                }
                //console.log(proTmp); 
                provinceData[i].children=(proTmp);
                
            }
            locationData = provinceData;
            console.log('--------locationData-----------');
            console.log(locationData);
        }
    }
   
    if (typeof define === 'function') {
        define(['Zepto'], function ($) {
            $.fn.showCityPicker = $.fn.showCityPicker || showCityPicker;
        });
    } else {
        $.fn.showCityPicker = $.fn.showCityPicker || showCityPicker;
    }
})(window, Zepto, mui);