(function(){
    var url_id = location.pathname.match(/\d{7,10}/);
    this.page_config={
        api_detail:base_mobile+'v2/user/m_detail',
        api_follow:base_mobile+'v2/follow',
        api_unfollow:base_mobile+'v2/unfollow',
        default_param:{
            uid:account_info.id,
            access_token:account_info.token
        }
    };
    this.page_status={
        user_id:'',
        follow:false,
        send_intention:false,
        name:'',
        portrait:'',
        get_id:function(key){
            var data={};
            if(page_status.user_id != ''){
                if(typeof key != 'undefined'){
                    data[key]   = page_status.user_id;
                }
                else{
                    data['user_id'] = page_status.user_id;
                }
            }
            return data;
        }
    };
    if(url_id) page_status.user_id = url_id[0];
    /*命名空间*/
    this.framework = {};
    this.controll  = {};
    this.follow    = {};

    log.type = 'entre_detail';
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

//数据获取
(function(){
    this.page_remote_data_syn=function(url,call,data){
        base_remote_data.ajaxjsonp(url,function(data){
            call(data);
        },$.extend(true,page_config.default_param,data),function(){view_notification.show('网络错误');});
    };
}).call(this);

//创业者ID设置
(function(){
    this.host_id=function(call){
        if(page_status.user_id == ''){
            page_remote_data_syn(api.host_id,function(data){
                if(data.hasOwnProperty('ret')){
                    page_status.user_id=data.ret;
                    if(typeof call != 'undefined')call();
                }
            });
        }
        else{
            if(typeof call != 'undefined')call();
        }
    };
}).call(this);

//个人主页
(function(){
    var $page_action = $('#page-action');
    this.host_id(function(){
        if(account_info.id == page_status.user_id){
            $page_action.hide();
        }
    });
}).call(this);

//框架绑定
(function(){

    this.details= (function(selector){
        var c;
        return function(data){
            if(c){
                c.data = data;
            }
            else{
                c = avalon.define(selector, function (vm) {
                    vm.data = data;
                })
            }
        }
    })("entrepreneurs-details");

}).call(framework);

//详情获取
(function(){
    page_remote_data_syn(page_config.api_detail,function(data){
        if(data.hasOwnProperty('user')){
            data.user.avatar=data.user.avatar.replace(/\d{0,3}x$/,'800x');
            framework.details(data.user);
            if(data.user.isfollow){
                follow.view.follow();
            }
        }

    },page_status.get_id());
}).call(controll);

//关注
(function(){
    var $btn = $('#follow-btn'),sta=false;
    this.view={
        follow:function(){
            $btn.addClass('reverse').html('已关注');
            sta=true;
        },
        unfollow:function(){
            $btn.removeClass('reverse').html('关注该创业者');
            sta=false;
        }
    };
    this.follow_action = function(){
        if(!sta){
            page_remote_data_syn(page_config.api_follow,function(data){
                if(data.hasOwnProperty('success') && data.success){
                    follow.view.follow();
                }
                else{
                    view_notification.show(data.message || '未知错误');
                }
            },page_status.get_id('id'));
        }
        else{
            page_remote_data_syn(page_config.api_unfollow,function(data){
                if(data.hasOwnProperty('success') && data.success){
                    follow.view.unfollow();
                }
                else{
                    view_notification.show(data.message || '未知错误');
                }
            },page_status.get_id('id'));
        }
    };
    $btn.touchtap(this.follow_action);
}).call(follow);