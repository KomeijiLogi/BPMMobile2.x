/**
 * 图片上传预览组件
 * 依赖jQuery	
 * @author muqin_deng@kingdee.com
 * @time 2015/1/23
 */
; (function (window, $, undefined) {

    //默认配置项
    var defaultSettings = {
        allowSize: false,		//文件大小控制
        isMobile: true,
        isFile: false,

        uploadUrl: '',	//上传路径

        uploadFormData: {},	//上传额外携带的数据，可配置需要携带name,size等参数 

        previewWrap: '',	//预览位置

        previewUrl: '/microblog/filesvr/{id}',		//图片预览路径

        onCheckError: function () {		//检测图片格式、大小等出错				
        },

        onUploadStart: function () {	//上传开始
        },

        onUploadSuccess: function () {	//上传成功

        },

        onUploadProgress: function () {	//上传进度
        },

        onUploadFail: function () {		//上传失败
        },

        onDelImage: function () {	//取消上传
        }

    };

    //主函数
    var upload = function (settings) {

        var cfg = $.extend({}, defaultSettings, settings);

        return this.each(function () {
            var selector = this.id ? '#' + this.id : (this.className ? getClassSelector(this.className) : this.tagName);

            $('body').on('change', selector, function (e) {
                var files = e.target.files;
                var len = files.length;
                if (cfg.isFile) {
                    var oldCount = $("#fileCount").text();//5
                    if (oldCount == undefined) {
                        oldCount = 0;
                    }

                    oldCount = parseInt(oldCount);
                    if (len + oldCount > 8) {

                        len = 9 - oldCount;
                    }
                }

                for (var i = 0; i < len; i++) {
                    //实例化每个上传图片
                    new UploadController(files[i]).init(cfg);
                }

                var elemClone = this.cloneNode();

                this.parentNode.insertBefore(elemClone, this);
                this.parentNode.removeChild(this);

            });

            function getClassSelector(className) {
                return '.' + className.replace(/\s/g, '\,\.');
            }
        });
    };

    //辅助函数
    function UploadController(file) {
        this._$domHash = {};	//节点缓存
        this._file = file;		//单个文件对象
        this._$elem = $('');	//实例dom节点
    }

    UploadController.prototype = {
        //初始化
        init: function (cfg) {
            this.cfg = cfg;
            //拼装dom节点
            var checkResult = this.checkPic();
            if (!this.cfg.isFile) {

                //检测图片是否合格
                if (!checkResult.flag) {
                    this.cfg.onCheckError.call(this, checkResult.msg);
                    return;
                }
            }


            if (Util.OSFlag) {


                this.tpl();
            } else {
                if (!this.cfg.isFile) {
                    this.tpl();
                } else {
                    this.tplDest();
                }

            }

            //渲染节点
            this.render();

            //绑定事件
            this.bindUI();

            //开始上传
            this.upload();
        },

        //拼装dom节点
        tpl: function () {

            var html = '<div class="pic-preview smallyulan">'
					 + '<div class="del none">×</div>'
					 + '<div class="img-wrap smallimg"><a href=""><img src=""></a></div>'
					 + '<span class="progress"></span><div class="img-mask"></div>'
					 + '</div>';

            this._$elem = $(html);
        },
        //拼装dom节点
        tplDest: function () {

            var html = '<li><div class="file-container">' +
                            '<span class="mask">正在上传中...</span>' +
							'<i class="file-icon"></i>' +
							'<div class="file-info">' +
								'<span style="font-size:16px;"></span>' +
								'<span class="file-size"></span>' +
							'</div><button class="removeSelectFile none"></button>' +
						'</div></li>';


            this._$elem = $(html);
        },

        //渲染节点
        render: function () {
            if (this.cfg.previewWrap) {
                this._$elem.prependTo($(this.cfg.previewWrap));
            }
        },

        //绑定事件
        bindUI: function () {
            var me = this;
            if (this.cfg.isFile) {

                this._$elem.on('click', '.reload', function (e) {
                    me.upload();
                });

            } else {
                this._$elem.on('click', '.reload', function (e) {
                    me.upload();
                })
				.on('click', '.del', function (e) {
				    e.stopPropagation();
				    me.destroy();
				    me.cfg.onDelImage.call(me, me._getFileInfo());

				});

            }
        },

        //检测图片是否合格
        checkPic: function () {
            var file = this._file,
				flag = true,
				msg = '';

            if (!file) {	//文件不存在
                msg = '请先选择文件';
                flag = false;
            }

            if ("image/gif" == file.type) {	//文件不存在
                msg = '不支持上传gif格式的图片';
                flag = false;
            }

            if (!/image\/\w+/.test(file.type)) {
                msg = '请选择图像类型文件';
                flag = false;

            } else if (this.cfg.allowSize && file.size > this.cfg.allowSize) {
                msg = '图片大小超过设定值了';
                flag = false;
            }

            return { flag: flag, msg: msg };
        },

        //上传
        upload: function () {
            if (!this.cfg.uploadUrl) {
                console.log('没有上传路径');
                return;
            }

            var me = this,
				xhr = new XMLHttpRequest(),
				fd = new FormData();	//表单数据对象

            fd.append('name', 'Html 5 File API/FormData');
           
            fd.append('uploadfile', this._file, this._file.name);	//表单添加文件

            
            try {
            //上传开始
            xhr.onloadstart = function (e) { me._uploadStart(e, xhr); };
            //上传结束
            xhr.onload = function (e) { me._uploadComplete(e, xhr); };
            //上传进度
            //xhr.onprogress = function (e) { me._uploadProgress(e, xhr); };
            xhr.upload.onprogress = function (e) { me._uploadProgress(e, xhr); };
            //上传错误
            xhr.onerror = function (e) { me._uploadFial(e, xhr); };

            //发送文件和表单自定义参数
            xhr.open('post', this.cfg.uploadUrl);

            //请求头部增加权限验证部分
            xhr.setRequestHeader("Authorization", "Basic " + localStorage.getItem("ticket"));
            
            //xhr.setRequestHeader("Content-Type", "application/json");
           
                xhr.send(fd);
            } catch (e) {
                alert(e);
            }
            
            //xhr.send(fd);

            this._xhr = xhr;
        },

        //上传开始
        _uploadStart: function (e, xhr) {
            this.cfg.onUploadStart.call(this, xhr);
        },

        //上传结束
        _uploadComplete: function (e, xhr) {
            //alert((xhr.statusText));
            
            if (xhr.status == 200 || xhr.status == 304) {
                var resp = JSON.parse(xhr.responseText);

                
                this._fileId = resp[0].FileID;
                
                var fileInfo = this._getFileInfo();

                //console.log(fileInfo);
                

                if (resp[0] != null) {
                    if (this.cfg.isFile) {
                        this.previewDesk(fileInfo);
                    } else {
                        this.preview(fileInfo);
                    }


                    //上传成功回调
                    this.cfg.onUploadSuccess.call(this, fileInfo);
                } else {
                    //上传失败回调
                   
                    this._uploadFial(e, xhr, resp);
                    
                }

            } else {
                //上传失败回调
                
                this._uploadFial(e, xhr);
                
                
            }
        },

        //上传进度
        _uploadProgress: function (e, xhr) {
            //如果进度可用
            if (event.lengthComputable) {
                this.cfg.onUploadProgress.call(this, e.loaded, e.total);
            }
        },

        //上传失败
        _uploadFial: function (e, xhr, resp) {
            

            var $progress = this.find('.progress', true);

            this.cfg.onUploadFail.call(this, xhr, resp);	//上传失败回调

            $progress.addClass('reload').html('重新上传');

            xhr.abort();	//取消上传
        },

        //包装上传图片信息
        _getFileInfo: function () {
            var fileInfo = {
                id: this._fileId,
                name: this._file.name,
                size: this._file.size,
                type: this._file.type
            };

            return fileInfo;
        },

        //预览图片
        preview: function (fileInfo) {

            var ftype = (String)(fileInfo.name).substring((String)(fileInfo.name).lastIndexOf(".")+1);
            fjArray.push(fileInfo.id);

            var imgUrl = this.cfg.previewUrl.replace('{id}', fileInfo.id);

            //var imgUrl = this.cfg.previewUrl.replace('{id}', "0004.png");
             
            

            this.find('img').attr('src', imgUrl);

            //console.log(this.find('img'));
            

            //$(".del.none").hide();

            //添加调用showfiles接口函数
            this.find('img').on('tap', function () {
                XuntongJSBridge.call('showFile', {
                    'fileName': fileInfo.name,
                    'fileExt': ftype,
                    'fileTime': '2015-06-02 15:40',
                    'fileSize': String(fileInfo.size),
                    'fileDownloadUrl': imgUrl
                }, function (result) {
                    //alert(JSON.stringify(result));
                });

            });  

            this.find('.img-mask').hide();
        },

        //显示附件模板
        previewDesk: function (fileInfo) {
            var computeIcon = function (str) {
                var SUFFIXS = {
                    doc: 'doc',
                    docx: 'doc',
                    ppt: 'ppt',
                    pptx: 'ppt',
                    pdf: 'pdf',
                    xlsx: 'xls',
                    xls: 'xls',
                    txt: 'txt',
                    zip: 'zip',
                    rar: 'zip',
                    jpg: 'png',
                    png: 'png',
                    mpeg: 'music',
                    mp3: 'music',
                    wav: 'music'
                };
                return (SUFFIXS[str] || 'unknown') + 'Icon';
            };
            //文件大小计算
            var computeSize = function (str) {
                if (str >= 1024 * 1024) {
                    return ((str / (1024 * 1024)).toFixed(2) + 'MB');
                } else {
                    return ((str / 1024).toFixed(2) + 'kb');
                }
            };
            var fExt = fileInfo.name.split('.').pop();
            var fileClass = computeIcon(fExt);

            console.log(JSON.stringify(fileInfo));
            this.find('i.file-icon').addClass(fileClass);
            this.find('span:not(.file-size)').attr({
                "data-id": fileInfo.id,
                "data-fileExt": fExt,
                "data-fileName": fileInfo.name,
                "data-fileSize": fileInfo.size,
                "data-fileType": fileInfo.type,
            }).html(fileInfo.name);
            this.find('span.file-size').html(computeSize(fileInfo.size));
            this.find('span.mask').remove();//移除正在上传标识
            this.find('button.removeSelectFile').removeClass('none');
            //判断为9张隐藏上传按钮
            if (parseInt($('#fileCount').text()) > 7) {
                $('#forDesk').hide();
            }
        },

        //dom选择器
        find: function (selector, cache) {
            if (cache) {
                if (selector in this._$domHash) {
                    return this._$domHash[selector];
                }

                this._$domHash[selector] = this._$elem.find(selector);

                return this._$domHash[selector];
            } else {
                return this._$elem.find(selector);
            }
        },

        //获取根节点
        getRoot$: function () {
            return this._$elem;
        },

        //销毁节点
        destroy: function () {
            var me = this;

            //this._$elem.fadeOut(function () {
            this._$elem.off().remove();
            me._$domHash = null;
            me._$elem = null;
            //});			
        }
    };

    if (typeof define === 'function') {
        define(['Zepto'], function ($) {
            $.fn.upload = $.fn.upload || upload;
        });
    } else {
        $.fn.upload = $.fn.upload || upload;
    }
})(window, Zepto);
