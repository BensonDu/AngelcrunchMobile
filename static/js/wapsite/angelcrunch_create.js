//命名空间
(function(){
    this.space_uploader = {};
    this.space_select   = {};
    this.space_industry = {};
}).call(this);

//消息通知
(function(){
    var $dom=$('.notification'),$bk=$('.bk');
    this.view_bk={
        show:function(){
            $bk.show(0,function(){$bk.css('opacity',0.7);});
        },
        hide:function(){
            $bk.css('opacity',0);
            setTimeout(function(){$bk.hide()},100);
        }
    };
    this.view_notification={
        show:function(text){
            $dom.fadeIn().children('.txt').html(text);
            if(typeof arguments[1]!='undefined' && !arguments[1]){
                $dom.removeClass('red').addClass('green');

            }
            else{
                $dom.removeClass('green').addClass('red');
            }
            setTimeout(function(){$dom.fadeOut();},3000);
        },
        hide:function(){
            $dom.fadeOut();
        }
    };
}).call(this);
//头像上传
(function(){
    var $trigger = $('#upload-trigger'),
        $input   = $('#upload-input'),
        $progress= $('#upload-progress'),
        $img     = $trigger.children('img'),
        uploader   = simple.uploader({});


    this.get_img_url=function(id, option){
        return 'http://dn-xswe.qbox.me/' + id + '?imageMogr2' + (option ? "/crop/!" + get_crop(option) : "") + "/auto-orient/thumbnail/480x";
    };
    //进度条显示
    this.progress={
        show:function(loaded,total){
            return $progress.show().css('height',parseFloat(((loaded / total) * 100).toFixed(0))+'%');
        },
        hide:function(){
            return $progress.hide().css('height',0);
        }
    };
    //结果显示
    this.view_upload={
        start:function(){
            $img.hide().attr('src','');
        },
        success:function(src){
            $img.attr('src',src);
        },
        done:function(){
            $img.show();
        }
    };
    //返回存储ID
    this.upload_img_id='';

    $input.change(function(){
        var prev_file = $(this).attr('exist-file');
        if(prev_file){
            uploader.cancel(prev_file);
            space_uploader.view_upload.start();
        }
        uploader.upload(this.files);
        $(this).attr('exist-file', $(this).val());
    });
    //初始化
    uploader.on("beforeupload", function (e, file, r) {
        space_uploader.progress.show(5,100);
    });
    //进行中
    uploader.on("uploadprogress", function (e, file, loaded, total) {
        space_uploader.progress.show(loaded*0.9,total);
    });
    //成功
    uploader.on("uploadsuccess", function (e, file, r) {
        if(r.hasOwnProperty('key')){
            space_uploader.upload_img_id = r.key;
            space_uploader.view_upload.success(space_uploader.get_img_url(r.key,r))
        }
        else{
            view_notification.show('上传失败');
        }
    });
    //完成
    uploader.on('uploadcomplete', function (e, file, r) {
        $img.load(function(){
            space_uploader.progress.show(100,100);
            space_uploader.view_upload.done(space_uploader.get_img_url(r.key,r));
            space_uploader.progress.hide();
        })
    });
    //错误
    uploader.on('uploaderror', function (e, file, xhr, status) {
        view_notification.show('上传失败');
    });
}).call(space_uploader);

//选择阶段 职位
(function(){
    var $select_stage = $('#select-stage'),
        $select_position = $('#select-position'),
        stage_list=[
            '请选择所属阶段',
            '概念阶段',
            '研发阶段',
            '正式发布',
            '已有收入',
            '已有用户'
        ];
    space_select.result={
        stage:'',
        position:''
    };
    $select_stage.children('select').change(function(){
        var v = $(this).val(), p = stage_list.hasOwnProperty(v)?stage_list[v]:stage_list[0];
        space_select.result.stage=v;
        if(v != 0)$(this).prev().html(p);
    });
    $select_position.children('select').change(function(){
        var t = $(this), v= t.val();
        if(v != 0)t.prev().html(v);
        space_select.result.position = v;
    });

}).call(space_select);

//选择行业
(function(){
    var $head   = $('#header'),
        $box    = $('#industry-choose'),
        $items  = $('#item-container'),
        $contain= $box.children('div'),
        $select = $box.children('.select'),
        $trigger= $('#industry-trigger'),
        $cancle=$('#select-cancle'),
        $confirm=$('#select-confirm');

    this.view_box={
        show:function(){
            $head.css('position','fixed');
            $box.css('top',0);
            setTimeout(function(){
                $contain.show();
                $items.hide();},500);
        },
        hide:function(){
            $items.show();
            $contain.hide(0,function(){
                $head.css('position','static');
                $box.css('top',100+'%');
            });
        }
    };
    //JS尺寸响应
    this.view_box_response=function(){
        var h  = $box.height(),sh = h-240;
        $select.height(sh);
    };
    $trigger.touchtap(this.view_box.show);
    $cancle.touchtap(this.view_box.hide);
}).call(space_industry);