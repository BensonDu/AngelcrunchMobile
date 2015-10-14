(function(){
    this.page_config={
        default_param:{
            uid:account_info.id,
            access_token:account_info.token
        }
    };
    this.page_status={
        com_id:'',
        follow:false,
        send_intention:false,
        logo:'',
        get_com_id:function(){
            return page_status.com_id != ''?{com_id:page_status.com_id}:{};
        }
    };
    this.page_helper={
        float_cut:function(x){
            if(x % 1 === 0 || typeof x !== 'number'){
                return x;
            }
            else{
                return x.toFixed(2);
            }
        }
    };
    log.type = 'self_investment';
}).call(this);

//显示逻辑
(function(){
    this.view_dom={
        notification:$('.notification')
    };
    this.view_notification={
        show:function(text){
            view_dom.notification.fadeIn().children('.txt').html(text);
            if(typeof arguments[1]!='undefined' && !arguments[1]){
                view_dom.notification.removeClass('red').addClass('green');

            }
            else{
                view_dom.notification.removeClass('green').addClass('red');
            }
            setTimeout(function(){view_dom.notification.fadeOut();},2000);
        },
        hide:function(){
            view_dom.notification.fadeOut();
        }
    };
}).call(this);

//框架绑定
(function(){
    this.avalon_model={};
    this.buydetailsdata={};
    avalon_model.basic_info=avalon.define("basic-info", function (vm) {vm.data = {};});

    avalon_model.buydetails=avalon.define('buydetails',function(vm){
        vm.data = {};
        vm.event={
            syn:function(){
                //计算总出资
                avalon_model.buydetails.data.total=buydetailsdata.total=page_helper.float_cut(buydetailsdata.partprice*buydetailsdata.parts);
                //计算占股数
                avalon_model.buydetails.data.precent=buydetailsdata.precent=page_helper.float_cut(buydetailsdata.parts*buydetailsdata.partprecent);
                //计算估值
                //avalon_model.buydetails.data.totalprice=buydetailsdata.totalprice=buydetailsdata.partprice/(buydetailsdata.partprecent/100);
            },
            addnum:function(){
                avalon_model.buydetails.data.partprice+=buydetailsdata.unit;
                buydetailsdata.partprice+=buydetailsdata.unit;
                vm.event.syn();

            },
            minnum:function(){
                if(buydetailsdata.partprice>buydetailsdata.lowprice){
                    avalon_model.buydetails.data.partprice-=buydetailsdata.unit;
                    buydetailsdata.partprice-=buydetailsdata.unit;
                    vm.event.syn();
                }
            },
            addparts:function(){
                if(buydetailsdata.parts<buydetailsdata.totalparts){
                    avalon_model.buydetails.data.parts+=1;
                    buydetailsdata.parts+=1;
                    vm.event.syn();
                }
            },
            minparts:function(){
                if(buydetailsdata.parts>1){
                    avalon_model.buydetails.data.parts-=1;
                    buydetailsdata.parts-=1;
                    vm.event.syn();

                }
            }
        };

    });
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
        },$.extend(true,page_config.default_param,data),function(){view_notification.show('网络错误');});
    }

}).call(this);
//页面初始化
(function(){
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
    //接口数据转换为所需数据
    this.value_change=function(stocksale,parts,hope){
        avalon_model.buydetails.data=buydetailsdata={
            totalprice:page_helper.float_cut(hope/(stocksale/100)),  //估值
            totalprecent:stocksale,           //出让股权
            totalparts:parts,                 //出让份数
            unit:50,                          //每次加价
            partprice:page_helper.float_cut(hope/parts),             //每份价格,
            lowprice:page_helper.float_cut(hope/parts),              //每份最低价格
            parts:1,                          //认购份数
            total:page_helper.float_cut(hope/parts),                 //总出价
            precent:page_helper.float_cut(stocksale/parts),          //占股
            partprecent:page_helper.float_cut(stocksale/parts)       //每份占股
        };
    };
    page_remote_data_syn(api.com_vc_info,function(data){
        if(data.hasOwnProperty('stock_sale') && data.hasOwnProperty('shares') && data.hasOwnProperty('finance_hope')){
            value_change(data.stock_sale,data.shares,data.finance_hope);
        }else{
            value_change(0,1,0);
        }
    },page_status.get_com_id());
}).call(this);
//提交投资意向
(function(){
    var $addition=$('.other-value').children('textarea'),
        $agreement=$('.mentos-container'),
        $submitbtn = $('#submit-btn'),
        $sendresult=$('#sendresult');

    $sendresult.children('.close').touchtap(function(){
        $sendresult.hide();
        location.href=location.origin;
    });
    $submitbtn.touchtap(function(){
        if($(this).hasClass('active')){
            var data={
                amount:buydetailsdata.total,
                stock:buydetailsdata.precent,
                shares:buydetailsdata.parts,
                service:$addition.val(),
                phone:'',
                weixin:'',
                angelname:''
            };
            page_remote_data_syn(api.com_vc_standard,function(data){
                if(data.hasOwnProperty('success')){
                    if(data.success){
                        $sendresult.fadeIn();
                    }
                    else{
                        view_notification.show(data.message);
                    }
                }
            }, $.extend(true,page_status.get_com_id(),data));
        }
    });
    setInterval(function () {
        if ($agreement.hasClass('checked')) {
            $submitbtn.addClass('active');
        }
        else {
            $submitbtn.removeClass('active');
        }

    }, 300);
}).call(this);

//过渡 协议同意
(function () {
    var className = {
        container: ".mentos-container",
        checkbox: ".mentos-container :checkbox",
        // State
        beChecked: "checked"
    };
    var _changeCheckboxModuleState = function () {
        var $container = $($(this).closest(className.container));
        if ($(this).is(":checked")) $container.addClass(className.beChecked);
        else $container.removeClass(className.beChecked);
    };

    this.formModules = function () {
        var $container, $checkbox;
        $checkbox = $(className.checkbox);
        $checkbox.change(function () {
            _changeCheckboxModuleState.call(this);
        });
        _changeCheckboxModuleState.call($checkbox);
    };
    formModules();
}).call(this);