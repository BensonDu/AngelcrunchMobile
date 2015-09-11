(function(){
    log.type = 'login';
    this.api = {
        forget_mail:base_mobile+'v4/home/password_reset_email',
        /*verify:base_mobile+'v4/home/verify_code',*/
        verify:'http://api.dubaoxing.com/angel_regist/verify_code',
        forget_phone:base_mobile+'v4/home/password_reset_phone'
    }
}).call(define('page_config'));
//消息通知
(function(){
    var $n = $('.notification');

    this.show = function(text,isalter){
        $n.fadeIn().children('.txt').html(text);
        if(!!isalter){
            $n.removeClass('red').addClass('green');

        }
        else{
            $n.removeClass('green').addClass('red');
        }
        setTimeout(function(){$n.fadeOut();},3000);
    };
}).call(define('view_notification'));
//登录
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
//数据获取
(function(){
    this.get = function(url,call,data){
        base_remote_data.ajaxjsonp(url,call,data,function(){view_notification.show('网络错误')});
    }
}).call(define('data_model'));
//设置注册链接 传当前链接参数
(function(){
    var $regist=$('#regist_link');
    $regist.attr('href','http://auth.angelcrunch.com/reg'+(!!location.href.split('?')[1]?'?'+location.href.split('?')[1]:''));
}).call(this);
//百度统计
(function() {
    var _hmt = this._hmt || [],
        hm = document.createElement("script");
    hm.src = "//hm.baidu.com/hm.js?b42f93c74ba66023077c20dacf5bfaee";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
}).call(this);
//找回密码
(function(){
    var self = this,
        sta = 0,
        $login_page = $('#login-page'),
        $forget_page= $('#forget-page'),
        $forget_page_header = $forget_page.children('.header'),
        $forget_page_title = $forget_page_header.children('h3'),
        $child_page_container = $forget_page.children('.child-container'),
        $choose = $('#forget-choose'),
        $phone_form = $('#phone-form'),
        $mail_form = $('#mail-form');

    this.height_syn = function(){
        var  h = $(window).height();
        $forget_page.height(h);
    };
    this.slide_phone= function(){
        $choose.css('margin-left',-100+'%');
        $forget_page.removeClass('grey');
        self.title('手机验证');
        setTimeout(function(){$phone_form.removeClass('hidden');},300);
    };
    this.slide_phone_back = function(){
        $choose.css('margin-left',0+'%');
        $forget_page.addClass('grey');
        setTimeout(function(){ $phone_form.addClass('hidden')},300);
    };
    this.slide_mail = function(){
        $choose.css('margin-left',-100+'%');
        $forget_page.removeClass('grey');
        self.title('邮箱验证');
        setTimeout(function(){$mail_form.removeClass('hidden');},300);
    };
    this.slide_mail_back = function(){
        $choose.css('margin-left',0+'%');
        $forget_page.addClass('grey');
        setTimeout(function(){ $mail_form.addClass('hidden');},300);
    };
    this.slide_back = function(){
        $login_page.css('margin-left',0+'%');
        setTimeout(function(){$child_page_container.hide();},300);
    };
    this.slide_first = function(){
        $login_page.css('margin-left',-100+'%');
        setTimeout(function(){$child_page_container.fadeIn(100);},300);
        self.title('选择找回方式');
    };
    this.title = function(text){
        $forget_page_title.html(text);
    };
    this.router = function(){
        var step = 0;
        if(base_hash.getdata('forget')){
            step = base_hash.getdata('forget');
            if(step >= sta){
                (step ==1 && self.slide_first()) || (step ==2 && self.slide_phone()) || (step ==3 && self.slide_mail());
            }
            else{
                (step ==1 && sta ==2 && self.slide_phone_back()) || (step ==1 && sta ==3 && self.slide_mail_back());
            }
            sta = step;
        }
        else{
            self.slide_back();
        }
    };
    location.hash = '';
    $forget_page[0].addEventListener('touchmove',self.height_syn, false);
    self.height_syn();
    window.onresize = self.height_syn();
    window.onhashchange = self.router;
}).call(define('forget_view'));
//找回密码成功提示
(function(){
    var self = this,
        $box = $('#forget-success'),
        $close = $box.children('.close'),
        $h3 = $box.children('h3'),
        $h6 = $box.children('h6'),
        $btn = $box.children('.btn-group').children('a');
    this.mail = function(){
        $box.fadeIn(100);
        $h3.html('验证邮件已发送');
        $h6.show().html('请前往邮箱验证');
        if($_GET.hasOwnProperty('source')){
            $btn.attr('href',decodeURIComponent($_GET.source)).html('返回登录前页面');
        }
        else{
            $btn.attr('href','javascript:location.reload()').html('重新登陆');
        }
    };
    this.phone = function(){
        $box.fadeIn(100);
        $h3.html('密码已重置并登录');
        if($_GET.hasOwnProperty('source')){
            $btn.attr('href',decodeURIComponent($_GET.source)).html('返回登录前页面');
        }
        else{
            $btn.attr('href','http://angelcrunch.com').html('返回首页');
        }
    };
    $close.touchtap(function(){
        location.reload();
    });
}).call(define('forget_success_view'));
//通过邮箱找回密码
(function(){
    var self = this,
        $btn = $('#forget-submit-btn-mail'),
        $input= $('#forget-mail');
    this.request = function(email){
        data_model.get(page_config.api.forget_mail,function(data){
            if(!!data.success){
                forget_success_view.mail();
            }
            else{
                view_notification.show(data.message || '请求错误');
            }
        },{email:email,access_token:''});
    };
    this.check = function(){
        return base_regex().mail.test($input.val());
    };
    $btn.touchtap(function(){
        self.check() && self.request($input.val());
    });
    setInterval(function(){
        self.check() ? $btn.addClass('active') : $btn.removeClass('active');
    },300);
}).call(define('forget_by_mail_controll'));
//通过手机号码找回密码
(function(){
    var self    = this,
        $phone  = $('#forget-phone'),
        $verify   = $('#forget-verify-code'),
        $pwd    = $('#forget-pwd'),
        $pwd_eye       = $pwd.next(),
        $pwdrepeat   = $('#forget-pwdrepeat'),
        $pwdrepeat_eye = $pwdrepeat.next(),
        $submit    = $('#forget-submit-btn-phone');
    this.form = function(){
        return {
            phone:$phone.val(),
            code:$verify.val(),
            password:$pwd.val(),
            password1:$pwdrepeat.val()
        }
    };
    this.btn_active = function(){
        var form = self.form();
        return (base_regex().phone.test(form.phone) && form.code != '' && form.password.length>=6 && form.password1.length>=6)?$submit.addClass('active'):$submit.removeClass('active');
    };
    this.submit_form = function(){
        $submit.hasClass('active') && self.request();
    };
    this.request = function(){
        var form = self.form();
        data_model.get(page_config.api.forget_phone,function(data){
            if(!!data.success){
                self.login(form.phone,form.password);
            }
            else{
                view_notification.show(data.message || '注册失败请重试');
            }
        },form);
    };
    this.login = function(act,pwd){
        data_model.get(api.login,function(data){
            var login={},time = 4;
            if(data.hasOwnProperty('user')){
                login[account_key.id]=data.user.id||0;
                login[account_key.token]=data.user.access_token||'';
                login[account_key.role]=data.user.defaultpart || 0;
                save_cookie(login);
                forget_success_view.phone();
            }
            else{
                view_notification.show(data.message||'自动登录出错');
            }
        },{account:act,password:pwd})
    };
    $submit.touchtap(self.submit_form);
    $pwd_eye.on('touchstart mousedown',function(){$pwd.attr('type','text')});
    $pwd_eye.on('touchend mouseup',function(){$pwd.attr('type','password')});
    $pwdrepeat_eye.on('touchstart mousedown',function(){$pwdrepeat.attr('type','text')});
    $pwdrepeat_eye.on('touchend mouseup',function(){$pwdrepeat.attr('type','password')});
    setInterval(self.btn_active,300);
}).call(define('forget_by_phone_controll'));
//短信验证
(function(){
    var self = this,
        $phone  = $('#forget-phone'),
        $verify   = $('#forget-verify-code'),
        $verify_btn = $('#forget-verify-btn'),
        send_time = 0,
        timer = 0,
        btn_lock = false;

    this.btn_active = function(){
        if(base_regex().phone.test(forget_by_phone_controll.form().phone)){
            $verify_btn.removeClass('disable');
        }
        else{
            $verify_btn.addClass('disable');
        }
    };
    this.send_sms = function(){
        var phone = forget_by_phone_controll.form().phone;
        if(base_regex().phone.test(forget_by_phone_controll.form().phone) && !btn_lock){
            data_model.get(page_config.api.verify,function(data){
                !!data.success ? self.already_sent():view_notification.show(data.message || '网络错误');
            },{phone:phone});
        }
    };
    this.already_sent = function(){
        $phone.prop('disabled',true);
        btn_lock = true;
        $verify.prop('disabled',false);
        send_time = new Date().getTime();
        timer && clearInterval(timer);
        timer = setInterval(function(){
            var down = 60-(new Date().getTime() - send_time)/1000;

            if(down>=0){
                $verify_btn.html(Math.floor(down)+' s');
            }
            else{
                $phone.prop('disabled',false);
                $verify_btn.html('重新发送');
                clearInterval(timer);
                btn_lock = false;
            }

        },500);
    };
    $verify_btn.touchtap(self.send_sms);
    setInterval(self.btn_active,300);
}).call(define('verify_controll'));
