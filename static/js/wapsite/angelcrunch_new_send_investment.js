(function(){
    var encode_current_url=encodeURIComponent(location.href);
    this.page_config={
        reg_investor_long_url:"//m.angelcrunch.com/angel_vip_simple?source="+encode_current_url,
        reg_investor_short_url:"//0.angelcrunch.com/angel/new?source="+encode_current_url,
        login_url:"//auth.angelcrunch.com?source="+encode_current_url,
        default_param:{
            uid:account_info.id,
            access_token:account_info.token
        }
    };
    this.page_status={
        com_id:'13065886',
        follow:false,
        send_intention:false,
        logo:'',
        get_com_id:function(){
            return page_status.com_id != ''?{com_id:page_status.com_id}:{};
        }
    };

}).call(this);

//头部选项
(function(){
    var $trigger=$('.newhead').children('.options'),$tar=$trigger.children('.hidden-menu'),sta=false,$bk=$('.bk');
    this.headoption_display={
        show:function(){
            $tar.slideDown(200,function(){sta=true});
            $bk.show(0,function(){$(this).css('opacity',0.7)});
        },
        hide:function(){
            $tar.slideUp(200,function(){sta=false});
            $bk.css('opacity',0);
            setTimeout(function(){$bk.hide();},400);
        }
    };
    $trigger.touchtap(function(){
        if(!sta){
            headoption_display.show();
        }
        else{
            headoption_display.hide();
        }

    });
    $bk.touchtap(function(){
        if(sta){
            headoption_display.hide();
        }
    })
}).call(this);


//框架绑定
(function(){
    this.avalon_model={};
    avalon_model.basic_info=avalon.define("basic-info", function (vm) {vm.data = {};});
    avalon_model.finance=avalon.define("finance", function (vm) {vm.data = {};});
    avalon_model.finance=avalon.define("", function (vm) {vm.data = {};});
}).call(this);


//数据获取
(function(){
    //异步，同时的话，公共变量冲突
    this.page_remote_data_param={};
    this.page_remote_data_url='';
    this.page_remote_data_fun=function(){};
    this.page_remote_data_render=function(data){return data};
    this.page_remote_data=function(){
        base_remote_data.ajaxjsonp(page_remote_data_url,function(data){
            page_remote_data_fun(page_remote_data_render(data));
        },$.extend(true,page_config.default_param,page_remote_data_param));
    };
    //同步
    this.page_remote_data_syn=function(url,call,data){
        base_remote_data.ajaxjsonp(url,function(data){
            call(data);
        },$.extend(true,page_config.default_param,data));
    }

}).call(this);
//页面初始化
(function(){
    if(account_info.role<1)return false;
    this.view_page_init_dom={
        limited:$('.not-logged-in'),
        invest_info:$('.invest-info')
    };

    view_page_init_dom.invest_info.show();
}).call(this);
//基础状态获取设置
(function(){
    page_remote_data_url=api.com_basic_info;

    page_remote_data_param=page_status.get_com_id();

    page_remote_data_fun=function(data){
        avalon_model.basic_info.data = data;
        //没有预设com_id 则返回基本信息保存com_id
        if(data.hasOwnProperty('id') && page_status.com_id==''){
            page_status.com_id=data.id;
        }
        if(data.hasOwnProperty('logo')){
            page_status.logo=data.logo;
        }
    };
    page_remote_data();

}).call(this);
//融资详情
(function(){
    if(account_info.role<1)return false;
    page_remote_data_syn(api.com_finace_info,function(data){
        avalon_model.finance.data=data;
    },page_status.get_com_id());
}).call(this);
