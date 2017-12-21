(function (window, undefined) {
    var util = {  //工具类
    	OSFlag: true,	
        data: {
            dailyType: 'WORK_DAY', //工作周报
            weeklyType: 'WORK_WEEK', //工作月报
            monthlyType: 'WORK_MONTH', //工作总结
            lookStore: 'LOOK_STORE', //门店巡访
            customerVisit: 'CUSTOMER_VISIT' //客户拜访
        },
        //时间补0
        timeAddZero: function (time) {
            if (time < 10) {
                return '0' + time;
            } else {
                return '' + time;
            }
        },
        
        
      //根据连接符取驼峰式单词
		getCamelWord: function (str, connector) {
			var strArr, i, len;
			
			connector = connector || '-';
			
			strArr = str.split(connector);
			
			str = strArr[0];
			
			for (i = 1, len = strArr.length; i < len; i++) {
				str += strArr[i].slice(0, 1).toLocaleUpperCase() + strArr[i].slice(1);
			}
			return str;
		},
        dateFormat : function(d , fmt){
            if(d && fmt){
                var year = d.getFullYear(),
                month = d.getMonth()< 9  ? '0'+ parseInt(d.getMonth() + 1) : d.getMonth() + 1,
                day = d.getDate()< 10  ? '0' + d.getDate() : d.getDate(),
                hour = d.getHours() < 10  ? '0' + d.getHours() : d.getHours(),
                minute = d.getMinutes()  < 10  ? '0' + d.getMinutes() : d.getMinutes(),
                second = d.getSeconds()  < 10  ? '0' + d.getSeconds() : d.getSeconds(),
                dayArr = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
                switch(fmt){
                    case 'yy-mm-dd h:m:s':
                        return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
                        break;
                        
                    case 'yy-mm-dd h:m':
                        return year + '年' + month + '月' + day + '日 ' + hour + ':' + minute;
                        break;

                    case 'yy-mm-dd':
                        return year + '-' + month + '-' + day;
                        break;

                    case 'mm-dd h:m':
                        return month + '月' + day + '日 ' + hour + ':' + minute;
                        break;

                    case 'mm-dd':
                        return month + '-' + day;
                        break;
                    case 'mm/dd':
                        return month + '月' + day + '日';
                        break;

                    case 'yy/mm/dd d':
                        return year + '年' + month + '月' + day + '日' + ' ' + dayArr[d.getDay()];
                        break;

                    case 'yy/mm/dd':
                        return year + '年' + month + '月' + day + '日';
                        break;

                    case 'h:m':
                        return hour + ':' + minute;
                        break;

                    case 'HH:mm MM/dd/yyyy':
                        return hour + ':' + minute + ' ' + month + '/' + day + '/' + year;
                        break;
                    case 'mm-dd d':
                        return month + '月' + day + '日' + ' ' + dayArr[d.getDay()];
                        break;
                    case 'mm.dd':
                        return month + '.' + day;
                        break;
                }
            }
        },

        getRequest : function(){  //截取URL键值对
            var url = window.location.search;
            var theRequest = new Object();
            if (url.indexOf("?") != -1) {
                var str = url.substr(1);
                strs = str.split("&");
                for (var i = 0; i < strs.length; i++) {
                    theRequest[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split("=")[1]);
                }
            }
            return theRequest;
        },

        isWx : function(){  //如果是微信
            var ua = navigator.userAgent.toLowerCase();
            if(ua.match(/MicroMessenger/i)=="micromessenger") {
                return true;
            } else {
                return false;
            }
        },

        getOS : function(){  //获取操作系统平台，IOS或安卓
            var userAgent = navigator.userAgent;
            return userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
                ? 'ios' : userAgent.match(/Android/i)
                ? 'android' : '';
        },

        getIOS : function(){  //获取操作系统平台，IOS或安卓
            var userAgent = navigator.userAgent;
            return userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
                ? 'ios' : userAgent.match(/Android/i);
        },

        // 判断是否桌面端
        isCloudhub: function(){
        	var userAgent = navigator.userAgent;
        	return /App\/cloudhub/.test(userAgent);
        }, 
        
        // 判断是否web端
        isWebClient: function(){
        	return this.getOS() === '' && !this.isCloudhub();
        },
        
        getBytes: function(str) { 
            var len = 0; 
            for (var i=0; i < str.length; i++) { 
                if (str.charCodeAt(i) > 127 || str.charCodeAt(i) == 94) { 
                    len += 2; 
                } else { 
                    len ++; 
                } 
            } 
            return len; 
        },

        //获取根路径（可含项目路径）
        getRootPath: function (needProjectPath) {
            var href = window.location.href,            //完整路径
                pathName = window.location.pathname,    //主机后面的路径
                pos = href.indexOf(pathName),
                localhostPath = href.substring(0, pos), //主机路径
                projectName = /\/[^\/]+\//.exec(pathName)[0];
            
            if (needProjectPath) {
                return (localhostPath + projectName);
            }
            
            return localhostPath;
        },

        //显示消息提示
        showTips : function(tips, time){
            var me = this,
                $userinfoPs = $("#userinfo-ps"),
                closeTime = time || 500;
            
            if (tips =='HIDE') {
                $userinfoPs.fadeOut();
                return ;
            }
            
            $userinfoPs.html(tips).fadeIn("slow",function(){
                if (closeTime == 'NOHIDE') {
                    return ;
                }
                
                me.delay(closeTime, function () {
                    $userinfoPs.fadeOut(1500);
                });
            });
        },
        
        //延时函数
        delay: function (t, callback) {
            return window.setTimeout(function () {
                callback();
            }, t);
        },
        
        //转义特殊字符<,>,",'
		escapeToHtmlEntity: function (str) {
			if (!str) {
				return '';
			}
			str=str.replace(/[ ]/g,"");
			var escape = {
				'<': '&lt;',
				'>': '&gt;',
				'\"': '&quot;',
				'&': '&amp;'
			};

			return str.replace(/[&<>"]/g, function (match) {
				return escape[match] || match;
			});
		},

        //获取本周，上周，下周区间毫秒数
        getTime: function(format, riqi){
            riqi = riqi == undefined ? +new Date() : riqi;
            var dd = new Date(),
                date = dd.getDate(),
                day = dd.getDay(),
                time = null;

            //今天    
            if(format == 'today'){
                time = this.setDate();
            }
            //昨天
            else if(format == 'yesterday'){
                time = this.setDate(-1);
            }    
            //昨天   
            else if(format == 'tomorrow'){
                time = this.setDate(1);
            }
            //本周一
            else if(format == 'nowWeek-monday'){
                time = this.setDate(this.setWeek(0).monday);
            }    
            //本周日 
            else if(format == 'nowWeek-sunday'){
                time = this.setDate(this.setWeek(0).sunday);
            }   
            //上周一
            else if(format == 'lastWeek-monday'){
                time = this.setDate(this.setWeek(-1).monday);
            }
            //上周日
            else if(format == 'lastWeek-sunday'){
                time = this.setDate(this.setWeek(-1).sunday);
            }
            //下周一
            else if(format == 'nextWeek-monday'){
                 time = this.setDate(this.setWeek(1, riqi).monday, '', riqi);
            }
            //下周日
            else if(format == 'nextWeek-sunday'){
                 time = this.setDate(this.setWeek(1, riqi).sunday, '', riqi);
            }
            //其它周一
            else if(format == 'otherWeek-monday'){
                 time = this.setDate(this.setWeek(0, riqi).monday, '', riqi);
            }
            //其它周日
            else if(format == 'otherWeek-sunday'){
                  time = this.setDate(this.setWeek(0, riqi).sunday, '', riqi);   
            }

            return time;

        },

        //设置某周周一周日
        setWeek: function(num, date){
           num = num || 0;
           date = date == undefined ? +new Date() : date;
           var dateObj = {};
           var  day = new Date(date).getDay(),
                monday,   //设置某周周一与当前日期相差天数
                sunday;   //设置某周周日与当前日期相差天数


            if(day == 0){//周日
                monday = -6 + num * 7; 
                sunday = num * 7; 
            }else{
                monday = 1 - day + num * 7;
                sunday = 7 - day + num * 7;
            };

            dateObj.monday = monday;
            dateObj.sunday = sunday;

            return dateObj;
        },

        //设置日期
        setDate: function(addDate, format, riqi){
            addDate =  addDate || 0;
            riqi = riqi == undefined ? +new Date() : riqi;
            var dd = new Date(riqi),
                date = dd.getDate();
            dd.setDate(date + addDate);
            var y = dd.getFullYear(),
                m = dd.getMonth(),
                d = dd.getDate();
            if(format == 'yy/mm/dd e'){
                return y + '年' + (m + 1) + '月' + d +'日' + ' ' + day;
            }
            else if(format == 'mm/dd e'){
                return (m + 1) + '月' + d +'日' + ' ' + day;
            }
            else if(format == 'mm/dd'){
                return (m + 1) + '月' + d +'日';
            }
            else{
                return +new Date(y, m, d);
            }
        },

        //判断当前日期是一年的第几周
        getWeekIndex: function(date){
           var y = new Date(date).getFullYear(),
               d1 = new Date(date),
               d2 = new Date(y, 0, 1),
               addDay = 0,
               d3,
               weekTimeStr = 7 * 24 * 60 * 60 * 1000,
               firstWeek = d2.getDay();

            if(firstWeek == 0){
                addDay = 0;
                d3 = Math.ceil((+new Date(d1) - +new Date(d2)) / weekTimeStr);
            }else{
                addDay = 7 - firstWeek;
                d3 = Math.ceil((+new Date(d1) - +new Date(y, 0, 1 + addDay)) / weekTimeStr);
            }

            return '第' + d3 + '周';
        },

        //转义特殊字符<,>,",'
        unEscapeToHtmlEntity: function (str) {
            if (!str) {
                return '';
            }

            str = str.replace(/&lt;/g, '<')
                    .replace(/&gt;/g, '>')
                    .replace(/&quot;/g, '\"')
                    .replace(/&amp;/g, '&')
                    .replace(/&nbsp;/g, ' ')
                    .replace(/<br>/g, '');

            return str;
        },

        /*
         * 函数节流
         * @param {function} method 要进行节流的函数
         * @param {number} delay 延时时间(ms)
         * @param {number} duration 经过duration时间(ms)必须执行函数method
         */
        throttle: function (method, delay, duration) {
            var timer = null,
                begin = null;
            return function () {
                var context = this,
                    args = arguments,
                    current = new Date();
                if (!begin) {
                    begin = current;
                }
                if (timer) {
                    window.clearTimeout(timer);
                }
                if (duration && current - begin >= duration) {
                     method.apply(context,args);
                     begin = null;
                }else {
                    timer = window.setTimeout(function () {
                        method.apply(context, args);
                        begin = null;
                    }, delay);
               }
            };
        },
        
        /*
		 * 页面模板引擎解析
		 * @param {string} html 要进行解析的html字符串（在<##>里面的转换成js来执行）
		 * @param {object} options html中解析传入的对象
		 * @return {string} 返回解析后的html字符串
		 */
		templateEngine: function(html, options) {
		    var re = /<%(.*?)%>/g, 
		    	reExp = /(^(\s|\t|\n|\r)*(var|if|for|else|switch|case|break|{|}))(.*)?/g, 
		    	code = 'var r=[];\n', 
		    	cursor = 0;
		    
		    html = html.replace(/\n|\r|\t/g, '');

		    var add = function(line, js) {
		        js? (code += line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n') :
		            (code += line !== '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
		        return add;
		    };
		    
		    while(match = re.exec(html)) {
		    	var noJsStr = html.slice(cursor, match.index);
		        add(/[^\s]/g.test(noJsStr) ? noJsStr : '')(match[1], true);
		        cursor = match.index + match[0].length;
		    }
		    add(html.substr(cursor, html.length - cursor));
		    code += 'return r.join("");';
		    
		    return new Function(code.replace(/[\r\t\n]/g, '')).apply(options ? options : {});
		},
        
        loading: function (show) {
            var $loading = $('.loading');
            
            if (show === false) {
                $loading.css('display', 'none');
                return ;
            }
            
            $loading.css('display', 'block');
        },

        getReportTypeText: function(reportType) {
            var reportTypeText = '工作日报';

            if(reportType == this.data.dailyType) {
                reportTypeText = '工作日报';
            }
            else if(reportType == this.data.weeklyType) {
                reportTypeText = '工作周报';
            }
            else if(reportType == this.data.monthlyType) {
                reportTypeText = '工作月报';
            }
            else if(reportType == this.data.lookStore) {
                reportTypeText = '门店巡访';
            }
            else if(reportType == this.data.customerVisit) {
                reportTypeText = '客户拜访'
            }

            return reportTypeText;
        },

        getReportDateText: function(reportType, reportDate){
            var reportDateText = '';

            reportDate ? reportDate.trim() : '';

            if(reportType == this.data.dailyType){
                reportDateText = reportDate.split(' ')[0];
            }
            else if(reportType == this.data.weeklyType){
                reportDateText = reportDate.replace(/\s+/g, '');
            }
            else if(reportType == this.data.monthlyType){
                reportDateText = reportDate.split('年')[1];
            }

            return reportDateText;
        },
        
        loadCss: function(filePath){
        	var link = document.createElement('link'),
        		head = document.getElementsByTagName('head')[0];
        	link.rel = 'stylesheet';
        	link.type = 'text/css';
        	link.href = filePath;
        	head.appendChild(link);
        },
        
        loadJs: function(filePath){
        	var script = document.createElement('script');
        	script.type = 'text/javascript';
        	script.src = filePath;
        	document.body.appendChild(script);
        },
        
        animationEnd: function (el, cb, remove) {
			var eventType = whichAnimationEvent(el);

			el.addEventListener(eventType, handler, false);

			function handler() {
		    	if (remove !== false) {
		    		el.removeEventListener(eventType, handler, false);
		    	}

		    	var args = [].slice.call(arguments);
		    	cb.apply(null, args);
		    }

			function whichAnimationEvent(el) {
				var animations = {
					'animation':'animationend',
					'OAnimation':'oAnimationEnd',
					'MozAnimation':'animationend',
					'WebkitAnimation':'webkitAnimationEnd'
				}

				for(var a in animations){
				   if( el.style[a] !== undefined ){
				       return animations[a];
				   }
				}
		    }
		},

        // 换行替换
        interceptContent: function(content){
            return !content ? '' : content.replace(/\n|\r/g, '<br>').replace(/\s/g, '&nbsp;');
        },

        // 检查js桥版本
        checkBridgetVer: function (vStr) {
            var ua = navigator.userAgent,
                reg = /Qing\/([^;]+)/gi,
                match = reg.exec(ua);
            
            if (!match) return false;
            
            var versions = match[1].split('.');  //判断userAgent版本
            var vStrs = vStr.split('.');

            // 逐个判断当前版本号是否大于传入版本号
            for (var i = 0, len = versions.length; i < len; i++) {
                if (+versions[i] == +vStrs[i]) {
                    continue;
                }
                
                return vStrs[i] ? +versions[i] > +vStrs[i] : true;
            }
            
            return false;
        }
    };

    if (window.localStorage && typeof window.localStorage.setItem == 'function') {
    	util.ls = {
	    	set: function (key, value) {
	    		var oldval = this.get(key);

				//在setItem前先removeItem避免iPhone/ipad上偶尔的QUOTA_EXCEEDED_ERR错误
				if (oldval !== '') {
				    this.remove(key);
				}

				window.localStorage.setItem(key, value);

				return this;
	    	},

	    	get: function (key) {
	    		var value = window.localStorage.getItem(key);
				//如果为空统一返回null
				return !value ? '' : value;
	    	},

	    	remove: function (key) {
            	window.localStorage.removeItem(key);
            	
            	return this;
	    	}
	    };
    } else {
    	//操作cookie
		util.ls = {
			//expires传过期月数
			set: function (name, value, expires, path, domain, secure) {
				var cookieText = encodeURIComponent(name) + '=' + encodeURIComponent(value);

				if (!expires) {
					expires = 12;	//默认一年过期
				}

				var today = new Date();
				expires *= 2592000000 ;
				var expires_date = new Date(today.getTime() + expires) ;
				cookieText += '; expires=' + expires_date.toGMTString();

				if (path) {
					cookieText += '; path=' + path;
				}

				if (domain) {
					cookieText += '; domain=' + domain;
				}

				if (secure) {
					cookieText += '; secure'; 
				}

				document.cookie = cookieText;

				return this;
			},

			get: function (name) {
				var reg = new RegExp(name + '\=([^;=]+)');
				var match = reg.exec(document.cookie);

				return match ? match[1] : '';
			},

			remove: function (name, path, domain, secure) {
				this.set(name, '', new Date(0), path, domain, secure);

				return this;
			}
		};
    }
    util.OSFlag = (util.getOS() !== ''?true:false);//true 代表移动端 false桌面端
    window.Util = window.Util || util;
    
    /*** 时间格式化相关 ***/
    var format = function(formatStr) {
        var year, month, date, hour, minute, second, day,
            reg, rule, afterFormat;

        if (!formatStr) {
            return this.getTime();
        }

        year = this.getFullYear();
        month = this.getMonth() + 1;
        date = this.getDate();
        hour = this.getHours();
        minute = this.getMinutes();
        second = this.getSeconds();
        day = this.getDay();
        
        var dayObj = {
            '0': '日',
            '1': '一',
            '2': '二',
            '3': '三',
            '4': '四',
            '5': '五',
            '6': '六'
        };

        rule = {
            'yy': year - 2000,
            'yyyy': year,
            'M': month,
            'MM': util.timeAddZero(month),
            'd': date,
            'dd': util.timeAddZero(date),
            'h': hour,
            'hh': util.timeAddZero(hour),
            'm': minute,
            'mm': util.timeAddZero(minute),
            's': second,
            'ss': util.timeAddZero(second),
            'w': '星期' + dayObj[day]
        };

        reg = /y{2,4}|M{1,2}|d{1,2}|h{1,2}|m{1,2}|s{1,2}|w/g;

        afterFormat = formatStr.replace(reg, function($) {
            if ($ in rule) {
                return rule[$];
            } else {
                return $;
            }
        });

       return afterFormat;

    };
    
    Date.prototype.format = format;
})(window);
