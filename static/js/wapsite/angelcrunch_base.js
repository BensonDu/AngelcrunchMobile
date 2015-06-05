(function(){

    this.base_protocol='http://';
    this.base_host='angelcrunch.com/';
    this.base_home=this.base_protocol+this.base_host;
    this.base_mobile='http://mobile.angelcrunch.com/';

    this.api={
        login:this.base_mobile+'v2/home/login',
        comlist:this.base_mobile+'v2/m_startup'
    };

    this.base_config={
        //缓存时间
        cachetime:7*24*60*60*1000,
        //账户信息保存字段名
        account_save_key:'account_info'
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
        time:0
    };

    //过期删除
    var now= $.now();
    var localdata=base_local_data.getdata(base_config.account_save_key);
    $.extend(true,this.account_info,localdata);

    if(now-account_info.time>base_config.cachetime){
        base_local_data.deldata(base_config.account_save_key);
    }

}).call(this);