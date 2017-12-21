var data = {
    picUrl: '',
    queryDraft: '',
    totalSize: 0,
    photoInfo: [],
    fileInfo: [],
    photos: ''
}
function upload() {


    //var picUrl = '/upload/';

    var picUrl = 'http://app.weigaogroup.com:8040/BPM/YZSoft/Attachment/default.ashx';
    //var picUrl = 'http://172.16.7.7/BPM/YZSoft/Attachment/default.ashx';
    var me = this;

    $("#file").upload({

        uploadUrl: '/api/bpm/UploadFiles',
        
        previewWrap: '.upload-img-list',
        isFile: false,
        //previewUrl: picUrl + '{id}?w=120&h=120',		//图片预览路径
        //previewUrl: picUrl + '?{id}?w=120&h=120',
        previewUrl: picUrl + '?{id}',
        //上传开始
        onUploadStart: function (xhr) {
            var $progress = this.find('.progress', true);
            //保存进度节点
            $progress.html('0%').addClass('uploading');
            //上传图片限制为10张
            if ($('.pic-preview').length >= 10) {
                $('.upload-addbtn:not(.fileIdString)').hide();

            } else {

                var count = $('.upload-img-list >div').size();

                if (count <= 4) {
                    $('#uploaddiv').css('height', '7rem');


                } else if (count <= 8) {
                    $('#uploaddiv').css('height', '10rem');

                } else if (count <= 12) {
                    $('#uploaddiv').css('height', '15rem');
                }

            }

        },

        //上传成功
        onUploadSuccess: function (fileInfo) {
           

            this.getRoot$().data('fileid', fileInfo.id)
								   .addClass('success');
            //隐藏进度
            this.find('.progress', true).html('').removeClass('uploading');
            //显示删除按钮
            this.find('.del', true).fadeIn();

            //计算上传成功图片总大小
            // totalSize += fileInfo.size;
            //图片总大小未换算
            me.data.totalSize += fileInfo.size;

            var totalSize = me.data.totalSize;

            if (totalSize >= 1024 * 1024) {
                $('.totalsize i').text((totalSize / (1024 * 1024)).toFixed(2) + 'MB');
            } else {
                $('.totalsize i').text((totalSize / 1024).toFixed(2) + 'kb');
            }

            //上传图片信息
            me.data.photoInfo.push(fileInfo);
            var photsInfos = me.data.photoInfo;

            var photosInfosLength = photsInfos.length;

            $("#imageCount").html("已添加" + photosInfosLength + "张");


           

        },
        //上传进度
        onUploadProgress: function (loaded, total) {
            var $progress = this.find('.progress', true);
            //修改进度
            $progress.html(Math.floor(loaded / total * 100) + '%');
            //$('.ceshi').html(loaded);
        },
        //上传失败
        onUploadFail: function (xhr) {
            var $progress = this.find('.progress', true);
            $progress.removeClass('uploading');
        },
        //删除图片 
        onDelImage: function (fileInfo) {
            //上传图片小于11张
            if ($('.pic-preview').length <= 10) {
                $('.upload-addbtn:not(.fileIdString)').show();
            }

          

        }

    });

    

}

function upload_multi(zeptoId, zeptoAimDomClass) {
    var picUrl = 'http://app.weigaogroup.com:8040/BPM/YZSoft/Attachment/default.ashx';

    var me = this;
    
    $(zeptoId).upload({

        uploadUrl: '/api/bpm/UploadFiles',

        previewWrap: zeptoAimDomClass,
        isFile: false,
        //previewUrl: picUrl + '{id}?w=120&h=120',		//图片预览路径
        //previewUrl: picUrl + '?{id}?w=120&h=120',
        previewUrl: picUrl + '?{id}',
        //上传开始
        onUploadStart: function (xhr) {
            var $progress = this.find('.progress', true);
            //保存进度节点
            $progress.html('0%').addClass('uploading');


        },

        //上传成功
        onUploadSuccess: function (fileInfo) {


            this.getRoot$().data('fileid', fileInfo.id)
                .addClass('success');
            //隐藏进度
            this.find('.progress', true).html('').removeClass('uploading');
            //显示删除按钮
            this.find('.del', true).fadeIn();

            //计算上传成功图片总大小
            // totalSize += fileInfo.size;
            //图片总大小未换算
            me.data.totalSize += fileInfo.size;

            var totalSize = me.data.totalSize;

            if (totalSize >= 1024 * 1024) {
                $('.totalsize i').text((totalSize / (1024 * 1024)).toFixed(2) + 'MB');
            } else {
                $('.totalsize i').text((totalSize / 1024).toFixed(2) + 'kb');
            }

            //上传图片信息
            me.data.photoInfo.push(fileInfo);
            var photsInfos = me.data.photoInfo;

            var photosInfosLength = photsInfos.length;

          
        },
        //上传进度
        onUploadProgress: function (loaded, total) {
            var $progress = this.find('.progress', true);
            //修改进度
            $progress.html(Math.floor(loaded / total * 100) + '%');
            //$('.ceshi').html(loaded);
        },
        //上传失败
        onUploadFail: function (xhr) {
            var $progress = this.find('.progress', true);
            $progress.removeClass('uploading');
        },
        //删除图片 
        onDelImage: function (fileInfo) {
          

        }

    });



}



function uploadFiles_multi(zeptoId) {
    var me = this;
    
    $(zeptoId).click(function () {

        var zeptoAimId = (($(zeptoId).parent().parent().find(".fileDetail")));
        XuntongJSBridge.call('selectFile', {}, function (resp) {

            if (typeof resp == 'string') {
                resp = JSON.parse(resp);
            }
            if (resp.success === true || resp.success === 'true') {
                //debugger;
                
                if (!resp.data) { return; }


                if (resp) {
                    //alert(JSON.stringify(resp));
                    //$("#xxx").text(JSON.stringify(resp));
                    var files = resp.data.files;
                    var fileSize = files.length;
                    if (files && fileSize > 0) {
                        var fileHtml = "";

                        var oldCount = $("#fileCount").text();
                        if (oldCount == undefined) {

                            oldCount = 0;
                        }
                        oldCount = parseInt(oldCount);
                        fileSize = fileSize + oldCount;

                        if (fileSize > 9) {
                            Util.showTips('最多支持9个附件');

                            return;

                        }
                        if (fileSize == 9) {
                            $('.upload-addbtn.fileIdString').hide();
                        }


                        //$("#fujianCount").html("已添加<span id='fileCount'>" + fileSize + "</span>个");
                        for (var i = 0, len = files.length; i < len; i++) {
                            var fileClass = me.computeIcon(files[i].fileExt);
                            var fSize = me.computeSize(files[i].fileSize);


                            //alert(fileClass);
                            fileHtml += '<li><div class="file-container"><i class="file-icon ' + fileClass + '"></i><div class="file-info"><span style="font-size:16px;"   data-id="' + files[i].fileId + '" data-fileExt="' + files[i].fileExt + '" data-fileName="' + files[i].fileName + '"  data-fileSize="' + files[i].fileSize + '"  data-fileType="' + files[i].fileType + '"   >' + files[i].fileName + '</span><span class="file-size">' + fSize + '</span></div><button class="removeSelectFile"></button></div></li>';

                        };
                        
                        //$(fileHtml).prependTo("#fileDetail");
                        $(fileHtml).prependTo(zeptoAimId);


                    };

                };

            };


        });
    });
}

function computeIcon(str) {
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

}

function computeSize(str) {
    if (str >= 1024 * 1024) {
        return ((str / (1024 * 1024)).toFixed(2) + 'MB');
    } else {
        return ((str / 1024).toFixed(2) + 'kb');
    }
}




function upload_file(zeptoId, zeptoAimId) {
    var me = this;
    var uploadurl = 'http://app.weigaogroup.com:8040/BPM/YZSoft/Attachment/default.ashx';

    //上传附件插件调用(为桌面端写的)
    $('#fileDesk').upload({
        uploadUrl: '/api/bpm/UploadFiles',
        previewWrap: '#fileDetail',
        isFile: true,
        previewUrl: '',		//图片预览路径
        //上传开始
        onUploadStart: function (xhr) {
            var $progress = this.find('.progress', true);
            //保存进度节点
            $progress.html('0%').addClass('uploading');
            //上传附件限制为9个
            var fileSize = $("#fileCount").text();
            if (fileSize == undefined) {

                fileSize = 0;
            }
            fileSize = parseInt(fileSize);

            if (fileSize >= 8) {
                $('.upload-addbtn.fileIdString').hide();
            }
            $('.fileDeskLabel').hide();
        },
        //上传成功
        onUploadSuccess: function (fileInfo) {
            this.getRoot$().data('fileid', fileInfo.id)
                .addClass('success');
            //隐藏进度
            this.find('.progress', true).html('').removeClass('uploading');
            //显示删除按钮
            //this.find('.del', true).fadeIn();

            //计算上传成功图片总大小
            // totalSize += fileInfo.size;
            //图片总大小未换算
            //					me.data.totalSize += fileInfo.size;
            //
            //					var totalSize = me.data.totalSize;
            //
            //					 if(totalSize >= 1024*1024){
            //					 	$('.totalsize i').text((totalSize / (1024 * 1024)).toFixed(2) + 'MB');
            //					 }else{
            //					 	$('.totalsize i').text((totalSize / 1024).toFixed(2) + 'kb');
            //					 }

            //上传图片信息
            //me.data.fileInfo.push(fileInfo);
            //var  filesInfos=me.data.fileInfo;

            //var filesInfosLength= filesInfos.length;

            var fileHtml = "";
            var fileSize = 1;
            var oldCount = $("#fileCount").text();
            if (oldCount == undefined) {

                oldCount = 0;
            }
            oldCount = parseInt(oldCount);
            fileSize = fileSize + oldCount;

            $("#fujianCount").html("已添加<span id='fileCount'>" + fileSize + "</span>个");
            if (fileSize >= 8) {
                $('.upload-addbtn .fileIdString').hide();
            }
            //上传图片成功保存草稿
            me.submitDraftData(me.getData());
            if (!me.isFileLoading()) {
                $('.fileDeskLabel').show();
            }
        },
        //上传进度
        onUploadProgress: function (loaded, total) {
            var $progress = this.find('.progress', true);
            //修改进度
            $progress.html(Math.floor(loaded / total * 100) + '%');
            //$('.ceshi').html(loaded);
        },
        //上传失败
        onUploadFail: function (xhr) {
            var $progress = this.find('.progress', true);
            $progress.removeClass('uploading');
            var $target = this.find('i.file-icon').closest('li');
            if ($target) {
                $target.find('.mask').html('上传失败!').addClass('fail');
                setTimeout(function () {
                    $target.remove();
                    if (!me.isFileLoading()) {
                        $('.fileDeskLabel').show();
                    }
                }, 1500);
            }
        },
        onDelImage: function (fileInfo) {


        }
    });
}








