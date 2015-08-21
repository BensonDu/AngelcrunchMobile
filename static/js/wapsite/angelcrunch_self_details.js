(function(){
    if(!account_info.is_login){
        account_info.role   = 0;
        account_info.id     = '13126984';
        account_info.token  = '6eb291ee75f1c625da255bf4a62a5042';
    }
    wechat_card.img = 'http://dn-xswe.qbox.me/13168760?imageMogr2/thumbnail/340x';
    wechat_card.title = '投资天使汇，抢占天使投资先锋阵地';
    //For VIP
    if(/vip/.test(location.hash.toString())){
        account_info.role=1;
    };
    window.onhashchange=function(){
        location.reload();
    };
}).call(this);
(function(){
    var encode_current_url=encodeURIComponent(location.href.split('?')[0]);
    this.page_config={
        reg_investor_long_url:"//0.angelcrunch.com/angel/new?source="+encode_current_url,
        reg_investor_short_url:"//m.angelcrunch.com/angel_vip_simple?source="+encode_current_url,
        login_url:"//auth.angelcrunch.com?source="+encode_current_url,
        default_param:{
            uid:account_info.id,
            access_token:account_info.token
        }
    };
    this.page_status={
        com_id:'13097951',
        follow:false,
        send_intention:false,
        name:'',
        logo:'',
        get_com_id:function(){
            return page_status.com_id != ''?{com_id:page_status.com_id}:{};
        }
    };
    log.type = 'self_detail';
}).call(this);

//链接补全当前链接 回调链接
(function(){
    $(".login-btn").attr("href", page_config.login_url);
    $("#shortly_reg").attr("href", page_config.reg_investor_short_url);
    $("#longer_reg").attr("href", page_config.reg_investor_long_url);
}).call(this);
//Helper
(function(){
    var self = this;
    //文本换行转化为html标签
    this.decode_text = function (txt) {
        var html, txt_list, _i, _len;
        txt_list = txt.split('\n');
        html = '';
        for (_i = 0, _len = txt_list.length; _i < _len; _i++)
            html += "<p>" + txt_list[_i] + "</p>";
        return html;
    };
}).call(this);
//框架绑定
(function(){
    this.avalon_model={};
    avalon_model.basic_info=function(){
        return avalon.define("basic-info", function (vm) {vm.data = {};});
    };
    avalon_model.details= function(){
        return avalon.define("deatils", function (vm) {vm.data = {};});
    };
    avalon_model.finance= function(){
        return avalon.define("finance", function (vm) {vm.data = {};});
    }
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
//页面初始化  登陆以及申请认证显示 && 总体项目详情模块显示在框架ms-if中
(function(){
    this.view_page_init_dom={
        limited:$('.not-logged-in'),
        login_module:$('.login-options').children('div'),
        article_list:$('.article-list'),
        invest_info:$('.invest-info')
    };

    if(account_info.is_login && account_info.id !='13126984'){

        if(account_info.role<1){
            view_page_init_dom.limited.show();
            view_page_init_dom.login_module.eq(1).show();
            view_page_init_dom.login_module.eq(3).show();
        }
        else{
            view_page_init_dom.invest_info.show();
        }

    }
    else{
        view_page_init_dom.limited.show();
        view_page_init_dom.login_module.eq(0).show();
        view_page_init_dom.login_module.eq(2).show();

    }
}).call(this);
//基础状态获取设置
(function(){
    page_remote_data_url=api.com_basic_info;

    page_remote_data_param=page_status.get_com_id();

    page_remote_data_fun=function(data){
        avalon_model.basic_info().data = data;
        //没有预设com_id 则返回基本信息保存com_id
        if(data.hasOwnProperty('id') && page_status.com_id==''){
            page_status.com_id=data.id;
        }
        if(data.hasOwnProperty('logo')){
            page_status.logo=data.logo;
        }
        if(data.hasOwnProperty('name')){
            page_status.name=data.name;
        }
    };
    page_remote_data();

}).call(this);

//关注 发送投资意向 BP展示View 二维码显示
(function(){
    //if(account_info.role<1)return false;
    this.view_dom={
        follow:$('#follow-btn'),
        intention:$('.send-investment-btn'),
        notification:$('.notification'),
        pb_file:$('.PDF').children('a'),
        bk:$('.bk'),
        qrcode:$('#PA-layer'),
        sharewechat:$('#share-wechat')
    };
    this.view_follow={
        follow:function(){
            view_dom.follow.addClass('active');
            view_dom.follow.children('span').html('已关注');
        },
        unfollow:function(){
            view_dom.follow.removeClass('active');
            view_dom.follow.children('span').html('关注');
        }
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
            setTimeout(function(){view_dom.notification.fadeOut();},3000);
        },
        hide:function(){
            view_dom.notification.fadeOut();
        }
    };
    this.view_intetion={
        already_sent:function(){
            view_dom.intention.addClass('reverse').removeAttr('href').html('投资意向已发送').children('span');
            page_status.send_intention=true;
        }
    };
    this.view_bk={
        show:function(){
            view_dom.bk.show(0,function(){view_dom.bk.css('opacity',0.7);});
        },
        hide:function(){
            view_dom.bk.css('opacity',0);
            setTimeout(function(){view_dom.bk.hide()},100);
        }
    };

    var qr_close=view_dom.qrcode.find('.close'),
        qr_container=view_dom.qrcode.find('.image-container'),
        qr_title=view_dom.qrcode.find('.title'),
        qr_link=view_dom.qrcode.find('input');
    this.view_qrcode={
        sta:false,
        show:function(){
            var url=location.href.split('?')[0];
            view_dom.qrcode.fadeIn(200);
            qr_title.html("分享\""+page_status.name+"\"到微信");
            qr_link.val(url);
            if(!view_qrcode.sta){
                qr_container.qrcode({
                    render:'image',
                    width: 200,
                    height: 200,
                    color: "#3a3",
                    text: url,
                    showCloseButton: false
                });
                view_qrcode.sta=true;
            }

        },
        hide:function(){
            view_dom.qrcode.fadeOut(100);
        }
    };
    this.do_follow=function(){
        page_remote_data_url=api.com_follow;
        page_remote_data_param.id=page_status.com_id;
        page_remote_data_fun=function(data){
            if(data.hasOwnProperty('success')){
                if(data.success){
                    view_follow.follow();
                    page_status.follow=true;
                }
                else{
                    view_notification.show(data.message);
                }
            }
        };
        page_remote_data();
    };
    this.do_unfollow=function(){
        page_remote_data_url=api.com_unfollow;
        page_remote_data_param.id=page_status.com_id;
        page_remote_data_fun=function(data){
            if(data.hasOwnProperty('success')){
                if(data.success){
                    view_follow.unfollow();
                    page_status.follow=false;
                }
                else{
                    view_notification.show('取消关注失败，请稍后再试.');
                }
            }
        };
        page_remote_data();
    };
    this.set_pb=function(url){
        view_dom.pb_file.attr('href',url);
    };
    view_dom.follow.touchtap(function(){
        if(!page_status.follow){
            do_follow();
        }
        else{
            do_unfollow();
        }
    });
    view_dom.sharewechat.touchtap(function(){
        view_qrcode.show();
    });
    qr_close.touchtap(function(){
        view_qrcode.hide();
    });
    //关闭通知
    view_dom.notification.children('.close').touchtap(function(){
        view_dom.notification.fadeOut();
    });
}).call(this);
//项目描述
(function(){
    page_remote_data_syn(api.com_details,function(data){
        avalon_model.details().data=data;
        //获取关注状态
        if(data.hasOwnProperty('is_follow') && data.is_follow){
            view_follow.follow();
            page_status.follow=true;
        }
        //发送投资意向状态
        if(data.hasOwnProperty('investment_is_send') && data.investment_is_send){
            view_intetion.already_sent();
        }
    },page_status.get_com_id());
}).call(this);
//融资详情
(function(){
    var color=['#fad53e','#039be6','#81c683','#aed582','#f06292','#f57e16','#fad53e','#b39ddb','#64b5f6','#80cbc4'];
    $('.invest-info').show();
    this.fin_render = function(data){
        var l=0;
        if(data.vc_list){
            l = data.vc_list.length;
            while(l){
                if(/.default_10000./g.test(data.vc_list[l-1].avatar)){
                    data.vc_list[l-1].avatar = false;
                    data.vc_list[l-1].avatar_color = color[Math.ceil(Math.random()*10)-1];
                }
                l--;
            }
        }
        return data;
    };
    page_remote_data_syn(api.com_finace_info,function(data){
        avalon_model.finance().data=fin_render(data);
    },page_status.get_com_id());
}).call(this);
//BP
(function(){
    if(account_info.role<1)return false;
    $('.extra-files').show();
    set_pb('http://ac2015.angelcrunch.com/bp?id=13168816&all=54');
}).call(this);
//重新检查角色 APP 内嵌
(function(){
    if(account_info.role > 0 && !base_status.isapp)return false;
    base_remote_data.ajaxjsonp(api.user_info,function(data){
        if(data.hasOwnProperty('user')){
            if(data.user.defaultpart > 0){
                $('.extra-files').show();
                set_pb('http://ac2015.angelcrunch.com/bp?id=13168816&all=54');
                view_page_init_dom.limited.hide();
                save_cookie('defaultpart',1);
            }
        }
    },{'uid':account_info.id,'access_token':account_info.token});
}).call(this);

(function(){
    var self = this,
        $btn = $('.send-investment-btn');
        //$box = $('#none-investor'),
        //$close=$box.children('.close');

    this.event = function(){
        if(account_info.role<1){
            location.href='http://m.angelcrunch.com/branch?com_id=13097951&flow=0';
        }
        else{
            if(!page_status.send_intention){
                location.href='http://ac2015.angelcrunch.com/vc_new';
            }
        }
    };
    $btn.touchtap(self.event);
    //$close.touchtap(function(){$box.hide();});
}).call({send_investment:{}}.send_investment);
