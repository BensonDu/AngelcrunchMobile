(function(){

    this.page_config={
        api_investor_details:base_mobile+'v2/user/m_detail',
        api_follow:base_mobile+'v3/follow',
        api_unfollow:base_mobile+'v3/unfollow',
        api_com_list:base_mobile+'v2/startup',
        api_com_submit:base_mobile+'v2/user/submit_com',
        default_param:{
            uid:account_info.id,
            access_token:account_info.token
        }
    };
    //根据环境切换跳转注册链接
    this.page_link={};
    switch (base_environment){
        case 'online':
            page_link.reg='http://auth.angelcrunch.com/reg';
            page_link.create='http://angelcrunch.com/create';
            break;
        case 'test':
            page_link.reg='http://auth.ac-test.com/reg';
            page_link.create='';
            break;
        default :
            page_link.reg='http://angel.dubaoxing.com/html/user/registration/ordinary_user.html';
            page_link.create='http://angel.dubaoxing.com/dist/investor/create.html';
    }
    this.page_status={
        //投资人预设ID
        user_id:'',
        follow:false,
        send_intention:false,
        name:'',
        portrait:'',
        get_user_id:function(){
            return page_status.user_id != ''?{user_id:page_status.user_id}:{};
        }
    };
    //微信卡片异步添加
    this.wechat_card.deffer=true;
}).call(this);
//框架绑定
(function(){
    this.avalon_model={};
    this.avalon_attach_details=function(data){
        avalon_model.details=avalon.define("investor-details", function (vm) {
            vm.data = data;
        });
    };

    avalon_model.entrelist=avalon.define("entre-list", function (vm) {
        vm.data = {
            name:'',
            list:'',
            select:function(){}
        };
    })
}).call(this);
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
    };
}).call(this);
//投资人信息获取
(function(){
    page_remote_data_syn(page_config.api_investor_details,function(data){
        if(data.hasOwnProperty('user')){
            data.user.avatar=data.user.avatar.replace(/\d{0,3}x$/,'800x');
            avalon_attach_details(data.user);
            page_status.name=data.user.name;
            page_status.id=data.user.id;
            page_status.portrait=data.user.avatar;
            //微信卡片制作
            wechat_card.img=page_status.portrait.replace(/\d{1,3}x$/,'310x');
            wechat_card.title='向投资人'+page_status.name+'提交商业计划书';
            wechat_card.render();
            //关注状态
            follow_hook(data.user.isfollow);
            //判断是否为个人主页
            view_self_hook(data.user.id);
        }
    },page_status.get_user_id());

}).call((this));

//个人主页
(function(){
    //判断是否为个人主页
    var $shareself=$('#share-self');
    this.view_self_hook=function(id){
        if(account_info.id != 0){
            if(account_info.id==page_status.user_id || account_info.id ==id){
                dom_follow_btn.hide();
                dom_submit_btn.hide();
                $shareself.show();
            }
        }
    };
    //二维码生成
    this.view_dom_qrcode=$('#PA-layer');
    var qr_close=view_dom_qrcode.find('.close'),
        qr_container=view_dom_qrcode.find('.image-container'),
        qr_link=view_dom_qrcode.find('input');
    this.view_qrcode={
        sta:false,
        show:function(){
            var url=location.href.split('?')[0];
            view_dom_qrcode.fadeIn(200);
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
            view_dom_qrcode.fadeOut(100);
        }
    };

    $shareself.touchtap(function(){
       view_qrcode.show();
    });
    qr_close.touchtap(function(){
        view_qrcode.hide();
    })
}).call(this);
//关注投资人
(function(){
    this.follow_sta=false;
    this.dom_follow_btn=$('#follow-btn');
    this.follow_view={
        follow:function(){
            dom_follow_btn.html('已关注').addClass('reverse');
            follow_sta=true;
        },
        unfollow:function(){
            dom_follow_btn.html('关注该投资人').removeClass('reverse');
            follow_sta=false;
        }
    };
    this.follow_model={
        follow:function(){
            page_remote_data_syn(page_config.api_follow,function(data){
                if(data.hasOwnProperty('success')){
                    if(data.success){
                        follow_view.follow();
                    }
                    else{
                        view_notification.show(data.message);
                    }
                }
            });
        },
        unfollow:function(){
            page_remote_data_syn(page_config.api_unfollow,function(data){
                if(data.success){
                    follow_view.unfollow();
                }
                else{
                    view_notification.show(data.message);
                }
            });
        }
    };
    this.follow_hook=function(isfollow){
        if(isfollow){
            follow_view.follow();
        }
        else{
            follow_view.unfollow();
        }
    };
    dom_follow_btn.touchtap(function(){
        if(!follow_sta){
            follow_model.follow();
        }
        else{
            follow_model.unfollow();
        }
    });
    
}).call(this);
//提交项目结果成功
(function(){
    var $result       = $('#sendresult'),
        $resultclose  = $result.find('.yesiknow'),
        $com_name     = $('#result-com-name'),
        $investor_por = $('#result-investor-por'),
        $investor_name= $('#result-investor-name'),
        $title        = $('#result-title');
    this.view_result={
        show:function(com,title){
            var c=!!com?'"'+com+'"':'',t=title || '提交项目成功';
            $com_name.html(c);
            $investor_por.attr('src',page_status.portrait);
            $investor_name.html(page_status.name);
            $title.html(t);
            $result.fadeIn(100);
        },
        hide:function(){
            $result.fadeOut(100);
        }
    };
    $resultclose.touchtap(function(){
        view_result.hide();
    });
}).call(this);
//提交项目
(function(){

    this.dom_submit_btn=$('#submit-com');
    this.my_com_list=function(call){
        page_remote_data_syn(page_config.api_com_list,function(data){
            call(data);
        },{type:3});
    };
    this.submit_my_commit=function(id,success_function){
        var data={};
        data.com_id=id;
        if(page_status.user_id!=''){
            data.target_id=page_status.user_id;
        }
        page_remote_data_syn(page_config.api_com_submit,function(data){
            if(data.hasOwnProperty('success')){
                if(data.success){
                    if(typeof success_function != 'undefined'){
                        view_list_display.hide();
                        view_result.show();
                    }
                    else{
                        success_function();
                    }
                }
                else{
                    view_notification.show(data.message);
                }
            }
            else{
                    view_notification.show('提交失败');
            }
        },data);
    };
    dom_submit_btn.touchtap(function(){
        //判断对应逻辑
        if(!account_info.is_login){
            //跳转链接传参
            var linkparam={
                source:location.href,
                title:'谢谢你通过天使汇向我提交项目。',
                message:'请先注册或登录天使汇账户，以便我后续和你联系具体的投融资事宜。',
                portrait:page_status.portrait,
                id:page_status.user_id
            };
            location.href=page_link.reg+base_create_param(linkparam);
        }
        else{
            my_com_list(function(data){
                if(data.hasOwnProperty('total') && data.total>0){
                    //显示列表
                    view_list_display.show();
                    //输出列表
                    view_list_import(data.list);
                }
                else{
                    //跳转到创建项目页
                    location.href=page_link.create+base_create_param({'source':location.href});
                }
            });
        }
    });
}).call(this);
//当前用户项目列表
(function(){
    var wh=$(window).height(),
        $header=$('#header'),
        $detail=$('.details'),
        $list=$('#submit-com-list'),
        $cancle=$('#list-cancle'),
        $confirm=$('#list-confirm'),
        $current_select=$(),
        select_id=0;
    this.view_body_lock={
        lock:function(){
            $header.css({'position':'fixed'});
            $detail.css({'height':wh,'overflow':'hidden'});
        },
        unlock:function(){
            $header.css({'position':'static'});
            $detail.css({'height':'auto','overflow':'auto'});
        }
    };
    this.view_list_display={
        show:function(){
            view_body_lock.lock();
            $list.css({'top':0});
        },
        hide:function(){
            view_body_lock.unlock();
            $list.css({'top':'100%'});
        }
    };
    this.view_list_import=function(list){
        var data={};
        data.list=list||false;
        data.name=page_status.name||'';
        data.select=function(){
            $current_select.removeClass('active');
            $current_select=$(this).children('em').addClass('active');
            select_id=$(this).data('id');
            if(select_id>0){
               $confirm.addClass('active');
            }
        };
        avalon_model.entrelist.data=data;
        //状态重置
        $confirm.removeClass('active');
        select_id=0;
    };
    $confirm.touchtap(function(){
        if(select_id>0){
            submit_my_commit(select_id);
        }
    });
    $cancle.touchtap(function(){
       view_list_display.hide();
    });

}).call(this);
//创建项目完成 回调 提交项目
(function(){
    if($_GET.hasOwnProperty('com_id') && $_GET.hasOwnProperty('time') && $_GET.hasOwnProperty('com_name')){
        console.log($_GET);
        if($.now()-$_GET.time<2000000){
            this.submit_my_commit($_GET.com_id,function(){
                view_result.show(decodeURIComponent($_GET.com_name),'创建并提交项目成功');
            });
        }
    }
}).call(this);
//获取当前页面ID
(function(){
    if(page_status.user_id == ''){
        page_remote_data_syn(api.host_id,function(data){
            if(data.hasOwnProperty(ret)){
                page_status.user_id=data.ret;
            }
        });
    }
}).call(this);