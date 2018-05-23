/*
*  
*  @author:KomeijiLogi
*  @date:2018/05/21
*  @description:基于mui的查询BPM显示2级联动的城市数据选择插件 
*  @warning:由于插件基于zepto和mui实现，应该在这两个js引入后调用此js
*  @version:1.0
*
*
*
*
*
*/
(function (Window,$,mui) {
    var provinceData = [];         //省份数据
    var cityData = [];             //城市数据
    var locationData = [];         //组装的省份和城市数据 
    var defaultConfig = {
        
         targetEle: '',           //目标元素
         isDelegate: false,       //是否多个子表使用，true为是，false为否
         cityId: '',              //城市元素id
         proId: '',               //省份id  
         citytype:'',             //城市类型，如果需要显性输出，那么填写对应选择器，如果隐形输出，那么不填即可
         isForeign: false         //是否国外，true 为国外，false为国内 
    };

    //主函数
    var showCityPicker = function (config) {

        var conf = $.extend({}, defaultConfig, config);   //混合参数

        return this.each(function () {
            //var selector = this.id ? '#' + this.id : (this.className ? getClassSelector(this.className) : this.tagName);
          
            //if (conf.isDelegate) {

            //    selector = conf.targetEle;
            //}
            var selector = conf.targetEle;
            console.log('------selector-------');
            console.log(selector);

            new assembledController().init(conf);    //加载配置

            $('body').off('tap');

            $('body').on('tap', selector, function () {
                var self = this;
                var picker = new mui.PopPicker({
                    layer:2
                });
                picker.setData(locationData);
                picker.show(function (items) {

                    if (conf.isForeign) {               //是否是国外
                        $(self).parent().parent().find('#' + config.proId).val(items[0].text);   //州name
                        $(self).parent().parent().find('#' + config.cityId).val(items[1].text);  //国家name
                    } else {
                        $(self).parent().parent().find('#' + config.proId).val(items[0].text);   //省份name
                        $(self).parent().parent().find('#' + config.proId).data('provinceid', items[0].provinceid);   //省份id
                        if (conf.citytype) {           .//是否需要显性输出城市类型    
                            $(self).parent().parent().find('#' + config.citytype).val(items[1].citytype); //城市type
                        } else {
                            $(self).parent().parent().find('#' + config.cityId).data('citytype', items[1].citytype); //城市type
                        }
                        $(self).parent().parent().find('#' + config.cityId).val(items[1].text);  //城市name
                        
                        $(self).parent().parent().find('#' + config.cityId).data('cityid', items[1].cityid);   //城市id

                    }
                   
                });
            });

            function getClassSelector(className) {
                return '.' + className.replace(/\s/g, '\,\.');
            }
        });
    }

    
    
    //拼装数组信息
    function assembledController() {

    }
    assembledController.prototype = {
        init: function (conf) {
            this.conf = conf;  //传递参数配置
            if (conf.isForeign) {
                this.getState();
            } else {
                this.getProvince();

                this.getCity();
            }
           

            
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


            locationData = [];
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
        },
        //获取国外信息
        getState: function () {
            var self = this;
            var xml = `<?xml version= "1.0" ?>
                                 <Requests>
                                 <Params>
                                 <DataSource>BPM_EXPENSE</DataSource>
                                 <ID>erpcloud_查询国外</ID>
                                 <Type>1</Type>
                                 <Method>GetUserDataProcedure</Method>
                                 <ProcedureName>erpcloud_查询国外</ProcedureName>
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
                var stateDatas = provideData.Tables[0].Rows;
                locationData = []; 
                
                var stateTmp = [];                               
                stateTmp= stateDatas.map(function (item) {   //取出大洲
                    return item.fstate;
                })

                stateTmp = Array.from(new Set(stateTmp));  //去重

                console.log('-------stateTmp-------');
                console.log(stateTmp);

                for (var n = 0; n < stateTmp.length; n++) {
                    var couTmp = [];
                    for (var i = 0; i < stateDatas.length; i++) {
                        var country = {
                            state: stateDatas[i].fstate,
                            text: stateDatas[i].fcountry
                        };
                        if (stateDatas[i].fstate == stateTmp[n]) {
                            couTmp.push(country);
                        }
                    }
                    var loca = {
                        text: stateTmp[n],
                        children: couTmp
                    }
                    locationData.push(loca);
                }
               

            }).fail(function (e) {

            });
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