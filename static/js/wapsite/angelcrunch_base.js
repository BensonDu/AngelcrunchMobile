(function(){

    this.base_protocol='http://';
    this.base_host='angelcrunch.com/';
    this.base_home=this.base_protocol+this.base_host;
    this.base_mobile='http://mobile.angelcrunch.com/';
    this.base_ua=navigator.userAgent.toLowerCase();

    this.api={
        login:this.base_mobile+'v2/home/login',
        comlist:this.base_mobile+'v2/startup',
        log:'http://yx.dubaoxing.com/api/remotelog?msg=id_',
        comlistsearch:this.base_mobile+'v2/startup_search',
        com_details:this.base_mobile+'v2/startup/m_detail',
        com_finace_info:this.base_mobile+'v2/startup/m_finance',
        com_basic_info:this.base_mobile+'v2/startup/base_info',
        com_bp:this.base_mobile+'v2/startup/pb',
        com_follow:this.base_mobile+'v2/follow',
        com_unfollow:this.base_mobile+'v2/unfollow'
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
        ua:navigator.userAgent.toLowerCase(),
        support_touch:typeof document.ontouchstart!='undefined'/*,
        isandorid: base_ua.indexOf("android") != -1 ? 1 : 0,
        isios: !!base_ua.match(/\(i[^;]+;( u;)? cpu.+mac os x/),
        isiphone: base_ua.indexOf('iphone') > -1 || ua.indexOf('mac') > -1,
        isipad: base_ua.indexOf('ipad') > -1,
        iswechat: base_ua.indexOf("micromessenger") != -1 ? 1 : 0*/
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
        ajaxjsonp:function(url,call,data){
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
}).call(this);

//全局账户信息获取
(function(){
    this.account_info={
        id:0,
        name:'',
        token:'',
        role:0,
        time:0,
        is_login:false,
        version:'1.2.1'
    };

    //过期删除
    var now= $.now();
    var localdata=base_local_data.getdata(base_config.account_save_key);
    $.extend(true,this.account_info,localdata);
    //同步旧的登陆信息
    if(!localdata){
        var $COOKIE=$.Angelcrunch.COOKIE || {};
        if($.cookie($COOKIE.cookieName.user_id)){
            account_info.id     = $.cookie($COOKIE.cookieName.user_id) || account_info.id;
            account_info.token  = $.cookie($COOKIE.cookieName.token) || account_info.token;
            account_info.role   = $.cookie($COOKIE.cookieName.defaultpart) || account_info.role;
            account_info.time   = now;
            base_local_data.savedata(base_config.account_save_key,account_info);
        }
    }
    //跨版本清除旧数据
    var getclientversion=base_local_data.getdata(base_config.client_version_key);
    if(getclientversion!=account_info.version){
        base_local_data.cleardata();
        $COOKIE.operation.clearUserKey();
        base_local_data.savedata(base_config.client_version_key,account_info.version);
    }
    if(now-account_info.time>base_config.cachetime){
        base_local_data.deldata(base_config.account_save_key);
    }
    //登陆状态
    if(account_info.token.length>5){
        account_info.is_login=true;
    }

}).call(this);

//日志记录
(function(){
    $(document).ready(function(){
        if(/dubaoxing/g.test(location.href.toLocaleLowerCase()))return false;
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

//移动设备触摸事件 随后扩展
(function(){
    $.fn.extend({
        touchtap:function(fn){
            if(base_status.support_touch){
                $(this).bind('touchend',fn);
            }
            else{
                $(this).click(fn);
            }

        }
    });
}).call(this);
