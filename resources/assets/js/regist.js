//页面配置
(function(){
    var self = this;
    this.api = {
        /*verify:base_mobile+'v4/home/verify_code',*/
        verify:'http://api.angelcrunch.com/v1/rewrite/verify_code',
        /*regist:base_mobile+'v4/home/register'*/
        regist:'http://api.angelcrunch.com/v1/rewrite/register'
    };
    log.type = 'regist_ordinary';
}).call(define('page_config'));

//切换登陆链接 传递当前链接参数
(function(){
    $('#login-link').attr('href','/account/login'+(!!location.href.split('?')[1]?'?'+location.href.split('?')[1]:''));
}).call(define('view_login_link'));

//协议同意按钮状态切换
(function(){
    var self = this,
        $btn = $('#agreement-checkbox'),
        $class = $btn.children('.mentos-container');

    this.checked = false;
    this.active = function(){
        $class.addClass('checked');
        self.checked = true;
    };
    this.unactive = function(){
        $class.removeClass('checked');
        self.checked = false;
    };
    $btn.touchtap(function(){
        self.checked?self.unactive():self.active();
    });
}).call(define('view_agreement_checkbox'));

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

//数据获取
(function(){
    this.get = function(url,call,data){
        base_remote_data.ajaxjsonp(url,call,data,function(){view_notification.show('网络错误')});
    }
}).call(define('data_model'));

//表单
(function(){
    var self    =  this,
        $user   = $('#user-name'),
        $phone  = $('#phone'),
        $verify = $('#verify-code'),
        $verify_btn = $('#verify-btn'),
        $pwd    = $('#pwd'),
        $pwd_eye       = $pwd.next(),
        $pwdrepeat     = $('#pwdrepeat'),
        $pwdrepeat_eye = $pwdrepeat.next(),
        $submit        = $('#submit-btn');

    this.form = function(){
        return {
            phone:$phone.val(),
            code:$verify.val(),
            name:$user.val(),
            password:$pwd.val(),
            password_:$pwdrepeat.val(),
            from:0
        }
    };

    this.btn_active = function(){
        var form = self.form();
        return (base_regex().phone.test(form.phone) && form.code != '' && form.name != '' && form.password.length>=6 && form.password_.length>=6 && view_agreement_checkbox.checked)?$submit.addClass('active'):$submit.removeClass('active');
    };
    this.submit_form = function(){
       $submit.hasClass('active') && self.regist();
    };
    this.regist = function(){
        var form = self.form();
        if($_GET.hasOwnProperty('id') && $_GET.id != '') form.from = $_GET.id;
        data_model.get(page_config.api.regist,function(data){
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
                self.redirect();
            }
            else{
                view_notification.show(data.message||'自动登录出错');
            }
        },{account:act,password:pwd})
    };
    this.redirect = function(){
        var $back_btn = $('#go-back');
        if($_GET.hasOwnProperty('source')){
            $back_btn.removeClass('hidden').attr('href',decodeURIComponent($_GET.source))
        }
        view_success.show();
    };
    $submit.touchtap(self.submit_form);
    $pwd_eye.on('touchstart mousedown',function(){$pwd.attr('type','text')});
    $pwd_eye.on('touchend mouseup',function(){$pwd.attr('type','password')});
    $pwdrepeat_eye.on('touchstart mousedown',function(){$pwdrepeat.attr('type','text')});
    $pwdrepeat_eye.on('touchend mouseup',function(){$pwdrepeat.attr('type','password')});
    setInterval(self.btn_active,300);
}).call(define('view_form'));

//短信验证
(function(){
    var self = this,
        $phone  = $('#phone'),
        $verify = $('#verify-code'),
        $verify_btn = $('#verify-btn'),
        send_time = 0,
        timer = 0,
        btn_lock = false;

    this.btn_active = function(){
        if(base_regex().phone.test(view_form.form().phone)){
            $verify_btn.removeClass('disable');
        }
        else{
            $verify_btn.addClass('disable');
        }
    };
    this.send_sms = function(){
        var phone = view_form.form().phone;
        if(base_regex().phone.test(view_form.form().phone) && !btn_lock){
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
}).call(define('view_verify'));

//注册原因 弹窗
(function(){
    if($_GET.hasOwnProperty('message') && $_GET.hasOwnProperty('title')){
        var $reason =   $('#regist-reason'),
            $content=   $reason.children('.content'),
            $title  =   $content.children('h3'),
            $msg    =   $content.children('h4'),
            $close  =   $reason.find('.yesiknow'),
            $portrait=$reason.find('img');
        $reason.show();
        $msg.html(decodeURIComponent($_GET.message));
        $title.html(decodeURIComponent($_GET.title));
        if($_GET.hasOwnProperty('portrait') && $_GET.portrait!=''){
            $portrait.attr('src',decodeURIComponent($_GET.portrait));
        }
        $close.touchtap(function(){
            $reason.fadeOut(100);
        });
    }
}).call(define('view_reason'));

/*注册成功弹窗*/
(function(){
    var $success = $('#regist-success'),
        $close   = $success.children('.close');
    this.show = function(){
        $success.fadeIn(200);
    };
    $close.touchtap(function(){$success.fadeOut(100);});
}).call(define('view_success'));

//百度统计
var _hmt = _hmt || [];
(function() {
    var hm = document.createElement("script");
    hm.src = "//hm.baidu.com/hm.js?b42f93c74ba66023077c20dacf5bfaee";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
})();