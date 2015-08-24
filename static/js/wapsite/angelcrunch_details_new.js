(function(){
    var self = this;

    this.status = {
        com_id:'',
        follow:false,
        send_intention:false,
        name:'',
        logo:'',
        get_com_id:function(key){
            var k = key || 'com_id',ret={};
            return self.status.com_id!=''?ret[k]=self.status.com_id:'',ret;
        }
    };

    this.api = {
        basic:base_mobile+'v4/startup/base_info',
        detail:base_mobile+'v4/startup',
        info:base_mobile+'v4/startup/ops_info',
        follow:base_mobile+'v3/follow',
        unfollow:base_mobile+'v3/unfollow'
    };

    //日志tag
    log.type = 'detail';
}).call(define('config'));

//Helper
(function(){
    var self = this;
    //文本换行转化为html标签
    this.decode_text = function (txt) {
        var html, txt_list, _i, _len;
        txt_list = txt.split('\n');
        html = '';
        for (_i = 0, _len = txt_list.length; _i < _len; _i++)
            html += txt_list[_i] + "<br>";
        return html;
    };
    //时间戳转为月日
    this.get_md = function(t){
        var tt =new Date(parseInt(t) * 1000),
            m = tt.getMonth()+ 1,
            d = tt.getDate(),
            mm = m < 9 ? '0'+ m : m,
            dd = d < 9 ? '0'+ d : d;
        return !t ? '':mm+'.'+dd;
    };
    //时间戳转为年
    this.get_y = function(t){
        var tt =new Date(parseInt(t) * 1000),
            y = tt.getFullYear();
        return !t ? '' : y;
    };
    //是否为数组
    this.is_array = function(o){
        return Object.prototype.toString.call(o) === '[object Array]';
    };
    //数组是否为空
    this.array_empty = function(a){
        return (!!a && self.is_array(a) && a.length>0);
    };
}).call(this);
//框架绑定
(function(){
    this.basic  = function() {
       return avalon.define(
            "basic",
            function (vm) {
                vm.data = {};
            }
        );
    };

    this.detail = function() {
       return avalon.define(
            "details",
            function (vm) {
                vm.data = {};
            }
        );
    }

}).call(define('framework'));

//Base_view
(function(){
    var self  = this,
        $noti = $('.notification'),
        $bk   = $('.bk');

    this.bk = {
        show:function(){
            $bk.show(0,function(){$bk.css('opacity',0.7);});
        },
        hide:function(){
            $bk.css('opacity',0);
            setTimeout(function(){$bk.hide()},100);
        }
    };
    
    this.notification = {
        show:function(text,isalter){
            $noti.fadeIn().children('.txt').html(text);
            if(!!isalter){
                $noti.removeClass('red').addClass('green');

            }
            else{
                $noti.removeClass('green').addClass('red');
            }
            setTimeout(function(){$noti.fadeOut();},3000);
        },
        hide:function(){
            $noti.fadeOut();
        }
    };

}).call(define('base_view'));

//数据获取
(function(){
    var self = this,
        default_param={
            uid:account_info.id,
            access_token:account_info.token
        };

    this.error = function(){
        base_view.notification.show('网络错误');
    };
    this.get = function(url,call,data){
        base_remote_data.ajaxjsonp(url,call,$.extend({},default_param,data),self.error);
    };
}).call(define('data_model'));

//获取Basic数据
(function(){
    var self = this;
    data_model.get(config.api.basic,function(data){
        var d = data || {};
        if(!!d.financing_stage){
            if(!!d.financing_stage.financing_progress){
                d.percent = d.financing_stage.financing_progress.percent || 0;
                d.day = d.financing_stage.financing_progress.day || 0;
                d.isfinish = true;
            }
            else{
                d.isfinish = false;
            }
            if(!!d.financing_stage.financing_result){
                d.message = d.financing_stage.financing_result.result_info;
            }
            else{
                d.message = d.financing_stage.financing_progress.process_info;
            }
        }
        //设置页面属性
        config.status.name = d.name;
        config.status.logo = d.logo;
        wechat_controll.append_card();
        framework.basic().data = d;
    },config.status.get_com_id());
}).call(define('basic_controll'));
//项目状态
(function(){
    var self = this;

    this.hook = function(data){
        if(!!data.is_follow){
            follow_controll.follow();
        }
        if(!!data.vc_state && parseInt(data.vc_state)>3){
            intention_controll.has_sent();
        }
    };

    data_model.get(config.api.info,self.hook,config.status.get_com_id());

}).call(define('info_controll'));
//详情
(function(){
    var self = this;
    //未上传头像，随机色
    this.investors_render = function(data){
        var l= 0,color=['#fad53e','#039be6','#81c683','#aed582','#f06292','#f57e16','#fad53e','#b39ddb','#64b5f6','#80cbc4'],cl = color.length;
        if(data.vc_list){
            l = data.vc_list.length;
            while(l){
                if(/.default_10000./g.test(data.vc_list[l-1].avatar)){
                    data.vc_list[l-1].avatar = false;
                    data.vc_list[l-1].avatar_color = color[Math.ceil(Math.random()*cl)-1];
                }
                l--;
            }
        }
        return data;
    };
    this.bp_render = function(data){
      var d = data ||{},host = 'http://'+location.host+'/bp',param={};
        if(!!d.bp){
            param.url = encodeURIComponent(d.bp.bp_format_url);
            param.all = d.bp.page_num;
            d.bp_link = host+=base_create_param(param);
        }
        return d;
    };
    this.render = function(data){
        return self.bp_render(self.investors_render(data));
    };
    data_model.get(config.api.detail,function(data){
        var d = data || {},
            encode_current_url=encodeURIComponent(location.href.split('?')[0]);
        //登陆注册回调链接
        d.link_login = "http://auth.angelcrunch.com?source="+encode_current_url;
        d.link_apply = "http://m.angelcrunch.com/angel_vip_simple?source="+encode_current_url;
        d.link_apply_long="http://0.angelcrunch.com/angel/new?source="+encode_current_url;
        framework.detail().data = self.render(d);
    },config.status.get_com_id());
}).call(define('details_controll'));

//发送投资意向
(function(){
    var self = this,
        $intention=$('.send-investment-btn'),
        $box = $('#none-investor'),
        $close=$box.children('.close');
    this.is_sent = false;
    this.has_sent = function(){
        $intention.addClass('reverse').removeAttr('href').html('投资意向已发送');
        self.is_sent = true;
    };
    $intention.touchtap(function(){
        if(!self.is_sent){
            if(account_info.role<1){
                $box.show();
            }
            else{
                location.href='http://'+location.host+'/vc_new'
            }
        }
    });
    $close.touchtap(function(){$box.hide();});
}).call(define('intention_controll'));
//分享二维码
(function(){
    var self = this,
        $share=$('#share-wechat'),
        $box=$('#PA-layer'),
        $close = $box.find('.close'),
        $wechatin = $('.wechat-in');
    this.generator = function(){
        var has_generate = false,
            qr_container=$box.find('.image-container'),
            qr_title=$box.find('.title'),
            qr_link=$box.find('input');
        return !base_status.iswechat?function(){
            var url=location.href.split('?')[0];
            qr_title.html("分享\""+config.status.name+"\"到微信");
            qr_link.val(url);
            $box.fadeIn(200);
            if(!has_generate){
                qr_container.qrcode({
                    render:'image',
                    width: 200,
                    height: 200,
                    color: "#3a3",
                    text: url,
                    showCloseButton: false
                });
                has_generate = true;
            }
        }:
            function(){
                $wechatin.fadeIn();
        };

    };
    $wechatin.touchtap(function(){$wechatin.hide()});
    $share.touchtap(self.generator());
    $close.touchtap(function(){$box.hide()});
}).call(define('qa_controll'));
//关注
(function(){
    var self = this,
        $follow = $('#follow-btn'),
        has_follow = false;
    this.follow = function(){
        $follow.addClass('active');
        $follow.children('span').html('已关注');
        has_follow = true;
    };
    this.unfollow = function(){
        $follow.removeClass('active');
        $follow.children('span').html('关注');
        has_follow = false
    };
    this.do_follow = function(){
        data_model.get(config.api.follow,function(data){
            if(data.success){
                self.follow();
            }
            else{
                base_view.notification.show(data.message);
            }
        },$.extend({uid:account_info.id},config.status.get_com_id('id')));
    };
    this.do_unfollow = function(){
        data_model.get(config.api.unfollow,function(data){
            if(data.success){
                self.unfollow();
            }
            else{
                base_view.notification.show(data.message);
            }
        }, $.extend({uid:account_info.id},config.status.get_com_id('id')));
    };
    $follow.touchtap(function(){
      return has_follow?self.do_unfollow():self.do_follow();
    })
}).call(define('follow_controll'));

//重新检查角色 APP 内嵌
(function(){
    if(account_info.role > 0 && !base_status.isapp)return false;
    base_remote_data.ajaxjsonp(api.user_info,function(data){
        if(data.hasOwnProperty('user')){
            if(data.user.defaultpart > 0){
                save_cookie('defaultpart',1);
                location.href = location.href.split('?')[0];
            }
        }
    },{'uid':account_info.id,'access_token':account_info.token});
}).call(define('app_controll'));
//微信卡片
(function(){
    var self = this;

    wechat_card.deffer = true;
    this.append_card = function(){
        if(base_status.iswechat) {
            wechat_card.img= config.status.logo.replace(/240x/,'300x');
            wechat_card.title=config.status.name+'正在天使汇上融资，查看详情并成为项目的天使投资人';
            wechat_card.render();
        }
    }
}).call(define('wechat_controll'));