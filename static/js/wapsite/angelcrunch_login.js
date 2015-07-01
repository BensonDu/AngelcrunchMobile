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
            if(data.hasOwnProperty('user')){
                $.Angelcrunch.dataSet.operation.setUser(data.user);
                $.Angelcrunch.COOKIE.operation.setUserKey();
                source_back();
            }
            else{
                var msg=data.message||'登录名和密码不匹配 ';
                view_notification.show(msg);
            }

        },data);
    };
    $btn.touchtap(login_action);
    $account.on('change keyup',login_active);
    $pwd.on('change keyup',login_active);
}).call(this);