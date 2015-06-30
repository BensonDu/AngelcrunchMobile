(function(){
    this.base_environment=(function(){
        var href=location.href.toLowerCase();
        if(href.indexOf('angelcrunch') != -1){
            return 'online'
        }
        else if(href.indexOf('ac-test') != -1){
            return 'test'
        }
        else{
            return 'development'
        }
    })();
    this.base_mobile='http://mobile.angelcrunch.com/';

    if(base_environment!='online'){
        this.base_mobile='http://mobile.ac-test.com/';
    }


    this.base_protocol='http://';
    this.base_host='angelcrunch.com/';
    this.base_home=this.base_protocol+this.base_host;
    this.base_ua=navigator.userAgent.toLowerCase();
    this.api={
        login:this.base_mobile+'v2/home/login',
        comlist:this.base_mobile+'v2/startup',
        log:'http://yx.dubaoxing.com/api/remotelog?msg=id_',
        user_info:this.base_mobile+'v2/home/user_info',
        comlistsearch:this.base_mobile+'v2/startup_search',
        com_details:this.base_mobile+'v2/startup/m_detail',
        com_finace_info:this.base_mobile+'v2/startup/m_finance',
        com_basic_info:this.base_mobile+'v2/startup/base_info',
        com_bp:this.base_mobile+'v2/startup/pb',
        com_follow:this.base_mobile+'v2/follow',
        com_unfollow:this.base_mobile+'v2/unfollow',
        com_vc_standard:this.base_mobile+'v3/startup/vc',
        com_vc_info:this.base_mobile+'v3/startup/vc_info',
        com_vc_query:this.base_mobile+'v3/startup/vc_query'
    };

    this.base_config={
        //缓存时间
        cachetime:7*24*60*60*1000,
        //账户信息保存字段名
        account_save_key:'account_info',
        last_log_time_key:'last_log_time',
        search_com_history_key:'com_search_history',
        client_version_key:'client_version'
    };
    this.base_status={
        support_touch:typeof document.ontouchstart!='undefined',
        //微信嵌入
        iswechat: base_ua.indexOf("micromessenger") != -1,
        //Android
        isandroid:base_ua.indexOf("android") != -1,
        //APP嵌入
        isapp:false
        /*isandorid: !!base_ua.indexOf("android") != -1 ? 1 : 0,
        isios: !!base_ua.match(/\(i[^;]+;( u;)? cpu.+mac os x/),
        isiphone: !!base_ua.indexOf('iphone') > -1 || ua.indexOf('mac') > -1,
        isipad: !!base_ua.indexOf('ipad') > -1,
        */
    };

    //localStorage存储管理
    this.base_local_data={

        savedata:function(key,data){

            var d=data;

            if(typeof  data == 'object'){
                d=JSON.stringify(data);
            }

            localStorage.setItem(key,d);
        },

        getdata:function(key){
            var ret=null;
            if(localStorage.hasOwnProperty(key)){
                var data=localStorage[key];
                try{
                    ret=JSON.parse(data);
                }
                catch(e){
                    ret=data;
                }

            }
            return ret;
        },

        deldata:function(key){
            if(localStorage.hasOwnProperty(key)){
                return localStorage.removeItem(key);
            }
        },

        cleardata:function(){
            localStorage.clear();
        }
    };
    //跨域获取数据方法
    this.base_remote_data={
        ajaxjsonp:function(url,call,data,error){
            $.ajax({
                url:url,
                type:'get',
                cache:false,
                data:data,
                dataType:'jsonp',
                jsonp:'callback',
                success:function(ret) {
                    var json={};
                    if(typeof ret=='string'){
                        try{
                            json=JSON.parse(ret);
                        }
                        catch(e){

                        }
                    }
                    if(typeof ret=='object'){
                        json=ret;
                    }
                    call(json);
                },
                error:function(e){
                    if(typeof  error == 'function'){
                        error(e);
                    }
                }
            });
        }
    };
    //单页面列表，锚点数据
    this.base_hash={

        getdata:function(key){

            var hash=location.hash,
                array=hash.split('#'),
                l=array.length,
                main,
                ml;

            if(l>0 && l==2){
                main=array[1].split('-');
                ml=main.length;
                for(var i=0;i<ml;i++){
                    var d=main[i].split(':');
                    if(d.length==2 && d[0]==key){
                        return d[1];
                    }
                }
            }
            return false;
        },
        putdata:function(data){
            var ret='#';
            if(typeof data =='object'){
                for(var i in data){
                    if(typeof data[i] !== 'object' && typeof data[i] !== 'function'){
                        ret+=i+':'+data[i]+'-';
                    }
                }
            }
            return ret.replace(/\-$/g,'');
        }
    };
}).call(this);

//获取URL传参
(function(){
    this.$_GET={};

    var url=window.location.href.split('?'), a, h, l, e, f={};

    if(url.length>1){
        h= url[1].split('#');
        a=h[0].split('&');

        l= a.length;
        for(var i=0;i<l;i++){
            e=a[i].split('=');
            f[e[0]]= e.length>1?e[1]:'';
        }
        this.$_GET=f;
    }
    //生成url字符串参数对
    this.base_create_param=function(data){
        var s='',c='?';
        if(typeof data == 'object'){
            for(var i in data){
                s+=c+i+'='+encodeURIComponent(data[i]);
                if(c='?')c='&';
            }
            return s;
        }
    }
}).call(this);

//全局账户信息
(function(){
    //过期删除
    var now= $.now(),
        $COOKIE=$.Angelcrunch.COOKIE || {};
    this.account_info={
        id:0,
        name:'',
        token:'',
        role:0,
        time:0,
        is_login:false,
        version:'1.2.1'
    };
    this.account_operate={
        logoff:function(){
            $.Angelcrunch.COOKIE.operation.clearUserKey();
            return location.reload();
        }
    };

    //登陆信息写入全局变量 放弃localstorage
    if($.cookie($COOKIE.cookieName.user_id)){
        account_info.id     = $.cookie($COOKIE.cookieName.user_id) || account_info.id;
        account_info.token  = $.cookie($COOKIE.cookieName.token) || account_info.token;
        account_info.role   = $.cookie($COOKIE.cookieName.defaultpart) || account_info.role;
        account_info.time   = now;
    }

    //URL传参授权 针对APP内嵌
    if($_GET.hasOwnProperty('access_token') && $_GET.hasOwnProperty('uid') && $_GET.hasOwnProperty('role')){
        account_info.id     = $_GET.uid;
        account_info.token  = $_GET.access_token;
        account_info.role   = parseInt($_GET.role);
        account_info.time   = now;
        base_status.isapp=true;
        //保存用户信息
        $.Angelcrunch.dataSet.Model.user.id             = account_info.id;
        $.Angelcrunch.dataSet.Model.user.access_token   = account_info.token;
        $.Angelcrunch.dataSet.Model.user.defaultpart    = account_info.role;
        $.Angelcrunch.COOKIE.operation.setUserKey();
    }

    //登陆状态
    if(account_info.token.length>5){
        account_info.is_login=true;
    }

}).call(this);

//日志记录
(function(){
    $(document).ready(function(){
        if(base_environment!='online')return false;
        var save=base_local_data.getdata(base_config.last_log_time_key),now= $.now(),time;
        time=!!save?save:0;
        if(now-time>1000*60){
            setTimeout(function(){
                base_remote_data.ajaxjsonp(api.log+account_info.id,function(e){});
                base_local_data.savedata(base_config.last_log_time_key,now);
            },5000);
        }
    });
}).call(this);

//移动设备触摸事件
(function(){
    $.fn.extend({
        touchtap:function(fn){
            var start, x,y;
            if(base_status.support_touch){
                $(this).bind('touchstart',function(e){
                    start= e.originalEvent.timeStamp;
                    x= e.originalEvent.pageX;
                    y= e.originalEvent.pageY;
                });
                $(this).bind('touchend',function(e){
                    var event=e.originalEvent,during=event.timeStamp-start,move=Math.pow(event.pageX-x,2)+Math.pow(event.pageY-y,2);
                    if(during<200 && move<100){
                        fn.call($(this));
                    }
                });
            }
            else{
                $(this).click(fn);
            }

        }
    });
}).call(this);

//绑定touch-link元素
(function(){
    var $ele;
    $(document).ready(function(){
        $ele=$('.touch-href');
        $ele.touchtap(function(){
            var href=$(this).data('href');
            if(href!='undefined'){
                location.href=href;
            }
        })
    });
}).call(this);

//头部选项
(function(){
    var $head=$('#header'),
        $bk=$('.bk'),
        $option=$head.children('.options'),
        $account=$head.children('.account'),
        $container=$account.children('ul'),
        $current=$(),
        sta=false,
        headoption_display={
            show:function(){
                $current.children('ul').slideDown(200,function(){sta=true});
                $current.children('span').css('position','absoute');
                $bk.show(0,function(){$(this).css('opacity',0.7)});
            },
            hide:function(){
                $current.children('ul').slideUp(200,function(){sta=false});
                $bk.css('opacity',0);
                setTimeout(function(){$bk.hide();},400);
            }
        },
        display_controll=function(){
            $current=$(this);
            if(!sta){
                headoption_display.show();
            }
            else{
                headoption_display.hide();
            }
        };
    this.account_center={
        default_item:{
            investor:[
                [base_protocol+account_info.id+'.'+base_host,'个人主页'],
                ['javascript:account_operate.logoff()','注销']
            ],
            entre:   [
                [base_protocol+account_info.id+'.'+base_host,'个人主页'],
                ['javascript:account_operate.logoff()','注销']
            ],
            notlogin:[
                [base_protocol+'auth.'+base_host+'?source='+encodeURIComponent(location.href),'登&nbsp;录'],
                [base_protocol+'auth.'+base_host+'reg?source='+encodeURIComponent(location.href),'注&nbsp;册']
            ]
        },
        item:[],
        create_item:function(array){
            var cache='';
            for(var i in array){
                cache+="<li class=\"touch-href\" data-href=\""+array[i][0]+"\">"+array[i][1]+"</li>";
            }
            return cache;
        }
    };
    if(account_info.is_login){
       if(account_info.role>1){
           account_center.item=account_center.default_item.investor;
       }
        else{
           account_center.item=account_center.default_item.entre;
       }
    }
    else{
        account_center.item=account_center.default_item.notlogin;
    }
    $($container).append(account_center.create_item(account_center.item));
    //事件绑定
    $(document).ready(function(){
        $option.touchtap(display_controll);
        $account.touchtap(display_controll);
        $bk.touchtap(function(){if(sta)headoption_display.hide();});
    });
    //APP内嵌隐藏头部
    if(base_status.isapp){
        $head.hide();
    }

}).call(this);

//微信分享卡片
(function(){
    this.wechat_card={
        display:true,
        deffer:false,
        img:'http://dn-acac.qbox.me/231937129837912.png',
        title:'',
        render:function(){
            //是否由微信打开
            if(base_status.iswechat){
                if(wechat_card.title != '')document.title=wechat_card.title;
                $("body").prepend("<div class='default-hidden'><img width='310px' height='310px' src="+wechat_card.img+" /></div>");
            }
        }
    };
    //事件
    $(document).ready(function(){if(wechat_card.display && !wechat_card.deffer)wechat_card.render();});
}).call(this);