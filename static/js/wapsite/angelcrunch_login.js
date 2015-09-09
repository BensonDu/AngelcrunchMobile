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
//Only login
(function(){
    var $account=$('#account'),
        $pwd=$('#pwd'),
        $btn=$('#subbmit-btn');
    this.login_check=function(){
        return $account.val() != "" && $pwd.val().length >= 6;
    };
    this.login_active=function(){
        if (login_check()){
            $btn.addClass('active');
        }
        else {
            $btn.removeClass('active');
        }
    };
    //sourece callback
    this.source_back=function(){
        if($_GET.hasOwnProperty('source')){
            location.href=decodeURIComponent($_GET.source);
        }
        else{
            location.href = base_home;
        }
    };
    //do login
    this.login_action=function(){
        if(!login_check())return false;
        var data={
            'account':$account.val(),
            'password':$pwd.val()
        };
        base_remote_data.ajaxjsonp(api.login,function(data){
            var login={};
            if(data.hasOwnProperty('user')){
                login[account_key.id]=data.user.id||0;
                login[account_key.token]=data.user.access_token||'';
                login[account_key.role]=data.user.defaultpart || 0;
                save_cookie(login);
                source_back();
            }
            else{
                var msg=data.message||'登录名和密码不匹配 ';
                view_notification.show(msg);
            }

        },data);
    };
    $pwd.pressenter(login_action);
    $btn.touchtap(login_action);
    setInterval(function(){login_active();},300);
}).call(this);
//设置注册链接 传当前链接参数
(function(){
    var $regist=$('#regist_link');
    $regist.attr('href','http://auth.angelcrunch.com/reg'+base_create_param($_GET));
}).call(this);
var _hmt = _hmt || [];
//百度统计
(function() {
    var hm = document.createElement("script");
    hm.src = "//hm.baidu.com/hm.js?b42f93c74ba66023077c20dacf5bfaee";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
})();
log.type = 'login';