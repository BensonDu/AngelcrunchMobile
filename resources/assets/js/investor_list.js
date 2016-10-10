(function(){
    this.key = {
        search_record:'investor_search_history'
    };
    this.api = {
        list:base_mobile+'v4/users',
        search:base_mobile+'v4/user_search',
        follow:base_mobile+'v4/follow',
        unfollow:base_mobile+'v4/unfollow',
        my_com:base_mobile+'v4/startup/my'
    };
    this.url = {
        reg:'/account/regist',
        create:'/startup/create'
    };
    log.type = 'investor_list';
}).call(define('config'));

(function(){
    var self = this,
        $bk = $('.bk_new'),
        $notice = $('.notification'),
        $filter = $('.filter-occupy'),
        $loading = $('.loading-container'),
        $not_found = $('.not-found');

    this.bk={
        show:function(){
            if(self.bk.timer)clearTimeout(self.bk.timer);
            $bk.show().addClass('fadeTransIn');
        },
        hide:function(){
            $bk.removeClass('fadeTransIn');
            self.bk.timer = setTimeout(function(){$bk.hide();},200);
        },
        event:function(){
            //取消搜索
            if(controll_search.sta){
                base_helper.delay(function(){
                    controll_search.stop_search(1);
                },200);
            }
            else{
                self.bk.hide();
            }
            view_filter.list.hide();
            view_filter.select_active();
        },
        timer:0
    };

    this.notification={
        show:function(text,isalert){
            $notice.fadeIn().children('.txt').html(text);
            if(typeof isalert!='undefined' && !isalert){
                $notice.removeClass('red').addClass('green');
            }
            else{
                $notice.removeClass('green').addClass('red');
            }
            $notice.delay(3000).fadeOut();
        },
        hide:function(){
            $notice.fadeOut();
        }
    };

    this.loading = {
        show:function(){
            base_helper.scroll_to(0);
            $loading.show();
        },
        hide:function(){
            $loading.hide();
        }
    };

    this.not_found = {
        sta:false,
        show:function(){
            $not_found.show();
            self.not_found.sta = true;
        },
        hide:function(){
            $not_found.hide();
            self.not_found.sta = false;
        }
    };
    this.error = function(){
        self.notification.show('网络错误');
    };

    this.filter = {
        show:function(){
            $filter.show();
        },
        hide:function(){
            $filter.hide();
        }
    };
    /*背景事件整理*/
    $bk.touchtap(self.bk.event);
}).call(define('view_dom'));

(function(){

    var self = this,
        $btn=$('.search'),
        $searchmodel=$('.search-list'),
        $input=$searchmodel.find('input');
    this.sta = false;
    /*view*/
    this.input = {
        foucus:function(){
            $input.focus();
        },
        blur:function(){
            $input.blur();
        },
        fill:function(k){
            var kk=k||'';
            $input.val(kk);
        }
    };

    this.btn = {
        show:function(){
            $btn.addClass('active');
        },
        hide:function(){
            $btn.removeClass('active');
        }
    };

    this.module = {
        show:function(){
            $searchmodel.fadeIn();
        },
        hide:function(){
            $searchmodel.fadeOut();
        }
    };

    this.start_search = function(){
        if(!self.sta){
            self.btn.show();
            self.module.show();
            self.show_history();
            self.input.foucus();
            self.input.fill();
            view_dom.bk.show();
            self.sta = true;
        }
        else{
            self.word_search($input.val());
        }

    };

    this.cancel_search = function(){
        setTimeout(self.stop_search,300);
        route.go_history();
    };

    this.stop_search = function(keep_result){
        self.btn.hide();
        self.module.hide();
        self.input.blur();
        if(!keep_result){
            self.search.result_name ='';
        }
        view_dom.bk.hide();
        self.sta = false;
    };

    this.word_search = function(k){
        if(k != ''){
            self.btn.hide();
            self.input.blur();
            self.search.result_name ='';
            view_dom.bk.hide();
            self.sta = false;
            route.go({type:'search', k:k, p:1,_:new Date().getTime()});
        }
    };

    this.search_result_reset =function(){
        self.search.result_name = '';
        self.search.result_num = '';
    };

    this.search_result = function(n){
        var k = base_hash_model.get_data('k');
        self.input.fill(k);
        self.input.blur();
        self.module.hide();
        self.record_search(k);
        view_dom.bk.hide();
        view_dom.filter.hide();
        self.search.result_name = k;
        self.search.result_num = n;
    };

    this.search_history = function(){
        if(!!this.innerHTML){
            self.word_search(this.innerHTML);
        }
    };

    this.input_search = function(e){
        if(e.keyCode == 13){
            self.word_search(this.value);
        }
    };

    this.local_history = function(){
        return base_local_data.getdata(config.key.search_record) || [];
    };

    this.clear_history = function(){
        base_local_data.savedata(config.key.search_record,[]);
        self.search.history = [];
    };

    this.show_history = function(){
        self.search.history = self.local_history();
    };

    this.record_search = function(k){
        var local_history = self.local_history();
        if(local_history.indexOf(k)==-1){
            local_history.unshift(k);
        }
        base_local_data.savedata(config.key.search_record,local_history);
    };

    this.search = avalon.define("search", function (vm) {
        vm.history = [];
        vm.result_name = '';
        vm.result_num = 0;
    });

}).call(define('controll_search'));

(function(){
    var self = this,
        $normal = $('.section-list'),
        $turning= $('.page-turn'),
        $prev   = $turning.children('.prev-page'),
        $next   = $turning.children('.next-page'),
        $current= $turning.children('p').children('.current-page'),
        $total  = $turning.children('p').children('.total-page');

    this.search = function(data){
        $normal.show();
        self.page_turning(data);
        if(data.hasOwnProperty('total')){
            controll_search.search_result(data.total);
        }
    };

    this.list = function(data){
        $normal.show();
        view_dom.filter.show();
        self.page_turning(data);
    };

    this.page_turning = function(data,size){
        var s = size || 10;
        if(data.hasOwnProperty('pageindex') && data.hasOwnProperty('total')){
            self.turning(data.pageindex,data.total,s);
        }
    };

    this.turning = function(index,total,size){
        var s = size || 10,
            page = Math.ceil(parseInt(total)/s),
            prev = index-1 > 1 ? index-1: 1,
            next = index+1 < page ? index+1 :page,
            hash_prev = base_hash_model.save_data({p:prev}),
            hash_next = base_hash_model.save_data({p:next});
        $prev.attr('href',hash_prev);
        $next.attr('href',hash_next);
        $current.html(index);
        $total.html(page);
    };

}).call(define('view_list'));

(function(){
    var self = this,
        default_param = {
            access_token:account_info.token,
            uid:account_info.id
        },
        list_default = $.extend({},default_param,{type:0,pagesize:10}),
        loading = {
            start: function(){
                view_dom.loading.show();
                if(view_dom.not_found.sta){
                    view_dom.not_found.hide();
                }
            },
            end:view_dom.loading.hide
        },
        error = view_dom.error;

    //列表 搜索列表 页面数据填充
    this.list = avalon.define("list", function (vm) {
        vm.data = [];
    });

    //数据格式化
    this.list_render = function(data){
        var render = data, len = render.length,summary = '',invest=0;
        for(var l =0; l < len;l++){
            //render[l].link = window.base_protocol+render[l].base_info.id+'.'+window.base_host;
            render[l].link = '/investor/'+render[l].base_info.id;
            if(!!render[l].base_info.summary){
                summary = render[l].base_info.summary;
                render[l].base_info.summary = summary.substr(0,60)+(summary.length>60?'...':'');
            }
            render[l].interaction_info.followclass=render[l].interaction_info.isfollow?'follow active':'follow';
            view_list_action.list_avatar[render[l].base_info.id] = render[l].base_info.avatar;
            if(!!render[l].invest_list && render[l].invest_list.length>0){
                render[l].action_class='action';
                render[l].action_invest_show=true;
                view_list_action.list_invest[render[l].base_info.id] = render[l].invest_list;
            }
            else{
                render[l].action_class='action double';
                render[l].action_invest_show=false;
            }
        }
        return render;
    };

    //列表 数据获取回调
    this.list_call = function(data){
        if(data.hasOwnProperty('list')){
            self.list.data= self.list_render(data.list);
        }
        if(data.hasOwnProperty('total')){
            data.total==0 && view_dom.not_found.show();
        }
        view_list.list(data);
    };

    //搜索列表 数据回调方法
    this.search_list_call =function(data){
        if(data.hasOwnProperty('list')){
            self.list.data= self.list_render(data.list);
        }
        if(data.hasOwnProperty('total')){
            data.total==0 && view_dom.not_found.show();
        }
        view_list.search(data);
    };

    //列表 数据获取方法初始化
    this.list_get = base_data_model.init('com',config.api.list,list_default,self.list_call,error,loading);

    //列表 获取数据方法
    this.list_index = function(index,industry,district){
        var post ={
            pageindex:index || 1,
            industry:industry || '',
            region:district || ''
        };
        self.list_get(post);
    };

    //搜索列表 数据获取方法初始化
    this.search_list_get = base_data_model.init('search',config.api.search,list_default,self.search_list_call,error,loading);

    //搜索列表 获取数据
    this.search_list_index = function(index,keyword){
        self.search_list_get({pageindex:index,keyword:keyword});
    };
}).call(define('controll_list'));

(function(){
    var self = this,
        history = [{}];

    //路由核心逻辑处理
    this.core = function(){
        var data = base_hash_model.get_data(),
            p = data.p || 1,
            industry = data.industry || '',
            district= data.district || '',
            k = data.k ||'';
        if(!!data.type){
            self.record_history(data);
            self.default_display(data);
            if(data.type == 'search' && !!data.k){
                return controll_list.search_list_index(p,data.k);
            }
            if(data.type == 'list'){
                return controll_list.list_index(p,industry,district);
            }
        }
        self.go({type:'list'});
    };
    //状态记录 列表类型间切换
    this.record_history = function(hash_data){
        var l = history.length - 1;
        if((l == 0 && !history[l].type) || (!!history[l].type && history[l].type != hash_data.type)){
            history.push(hash_data);
            if(l > 0){
                history.splice(0,1);
            }
        }
        else{
            history[l] = hash_data;
        }
    };
    //显示状态初始化
    this.default_display = function(hashdata){
        return !!hashdata.k ? true : controll_search.search_result_reset();
    };
    this.go_history = function(){
        self.jump(history[0]);
    };
    this.jump = function(data){
        location.hash = base_hash_model.set_data(data);
    };
    this.go = function(data){
        location.hash = base_hash_model.save_data(data);
    };

    window.onhashchange = self.core;
    self.core();
}).call(define('route'));

(function(){
    var self = this,
        $filter = $('#list-filter'),
        $select = $filter.children().children('a'),
        $list = $filter.children('ul'),
        $win = $(window),
        hash_data = base_hash_model.get_data();

    this.view_filter={
        show:function(){
            $filter.addClass('top');
        },
        hide:function(){
            $filter.removeClass('top');
        }
    };
    this.list={
        show:function(){
            $list.addClass('active');
            self.bk.lock = false;
        },
        hide:function(){
            $list.removeClass('active');
            self.bk.lock = true;
        }
    };
    this.bk = {
        lock:true,
        show:function(){
            view_dom.bk.show();
        },
        hide:function(){
            !self.bk.lock && view_dom.bk.hide();
        }
    };

    $win.scroll(function(){
        var n = document.body.scrollTop;
        if(n > 75){
            self.view_filter.show();
        }
        if(n < 46){
            self.bk.hide();
            self.list.hide();
            self.view_filter.hide();
            self.select_active();
        }
    });
    this.filter_acitve=function(index){

        if(document.body.scrollTop>75){
            self.list.show();
            self.bk.show();
            self.select_active(index);
        }
        else{
            base_helper.scroll_to(80,function(){
                setTimeout(function(){
                    self.list.show();
                    self.bk.show();
                    self.select_active(index);
                },300);
            },100);
        }
    };
    this.select_active=function(index){
        $select.removeClass('active');
        if(typeof index != 'undefined'){
            $select.eq(index).addClass('active');
        }
    };
    this.debug=function(){
        return $select;
    };
    this.active_offset = 0;
    this.curret_type = 2;
    this.industry_active = !!hash_data.industry ? hash_data.industry : '全部行业';
    this.district_active = !!hash_data.district ? hash_data.district : '全部地区';

    this.check_active = function(array,k,t){
        self.curret_type = t;
        for(var i in array){
            if(array[i] == k){
                self.active_offset = i;
                break;
            }
        }
        return array;
    };
    this.select_action = function(){
        var hash_data = {};
        base_helper.scroll_to(0);
        hash_data.industry = self.industry_active == '全部行业'?'':self.industry_active;
        hash_data.district = self.district_active == '全部地区'?'':self.district_active;
        route.jump(hash_data);
    };

    this.industry_list = ["全部行业","电子商务","移动互联网","信息技术","游戏","旅游","教育","金融","社交","娱乐","硬件","能源","医疗健康","餐饮","企业","平台","汽车","数据","房产酒店","文化艺术","体育运动","生物科学","媒体资讯","广告营销","节能环保","消费生活","工具软件","资讯服务","智能设备"];
    this.district_list = ['全部地区','北京','上海','深圳','广州','杭州','南京','西安','成都','苏州','天津','无锡','武汉','重庆','厦门','青岛'];
    this.avalon_filter = avalon.define("list-filter", function (vm) {
        vm.industry_name= self.industry_active;
        vm.district_name= self.district_active;
        vm.list_content= self.industry_list.concat();
        vm.list_industry=function(){
            self.filter_acitve(0);
            self.avalon_filter.list_content=self.check_active(self.industry_list.concat(),self.industry_active,2);
        };
        vm.list_district=function(){
            self.filter_acitve(1);
            self.avalon_filter.list_content=self.check_active(self.district_list.concat(),self.district_active,3);
        };
        vm.select_this=function(){
            var val =this.innerHTML,
                hash = {};
            self.select_active();
            base_helper.delay(function(){
                self.bk.hide();
                self.list.hide();
            },200);
            switch (self.curret_type){
                case 2:
                    self.industry_active = self.avalon_filter.industry_name = val;
                    break;
                case 3:
                    self.district_active = self.avalon_filter.district_name = val;
                    break;
                default :
            }
            self.select_action();
        };

    });
}).call(define('view_filter'));
//列表操作
(function(){
    var self = this,
        list_container = document.getElementById('list-container');
    this.list_invest = {};
    this.list_avatar = {};
    this.remote_request = function(api,call,param){
        var p = $.extend(param,{access_token:account_info.token,uid:account_info.id});
        base_remote_data.ajaxjsonp(api,call,p,function(){view_dom.notification.show('网络错误')});
    };
    this.follow_func = function(is_follow,call,id,error){
        var api = is_follow?config.api.follow:config.api.unfollow;
        self.remote_request(api,call,{id:id});
    };
    this.follow = function(el,id){
        var $el = $(el);
        if($el.hasClass('active')){
            self.follow_func(false,function(data){
                if(data.hasOwnProperty('success') && data.success ){
                    $el.removeClass('active');
                }
                else{
                    view_dom.notification.show(data.message||'操作失败');
                }
            },id)
        }
        else{
            self.follow_func(true,function(data){
                if(data.hasOwnProperty('success') && data.success ){
                    $el.addClass('active');
                }
                else{
                    view_dom.notification.show(data.message||'操作失败');
                }
            },id)
        }
    };
    this.submit = function(el,id){
        //是否登录注册
        if(!account_info.is_login){
            var linkparam={
                //source:base_protocol+id+'.'+window.base_host,
                source:'/investor/'+id,
                title:'谢谢你通过天使汇向我提交项目。',
                message:'请先注册或登录天使汇账户，以便我后续和你联系具体的投融资事宜。',
                portrait:self.list_avatar[id],
                id:id
            };
            location.href= config.url.reg+base_create_param(linkparam);
        }
        else{
            self.remote_request(config.api.my_com,function(data){
                if(data.hasOwnProperty('total') && data.total==0){
                    location.href= config.url.create+base_create_param({source:'/investor/'+id});
                }
                if(data.hasOwnProperty('list') && data.list.length>0){
                    location.href = '/investor/'+id+'?default_submit';
                }
            },{type:2});
        }
    };
    this.invest = function(el,id){
        var $el = $(el),
            $history = $('#history'+id),
            list = self.list_invest[id],
            len = list.length,
            html = '',
            img='';
        if($history.height()>0){
            $el.removeClass('active');
            $history.animate({height:0},200,function(){$(this).hide();});
        }
        else{
            for(var l=0;l<len;l++){
                img = list[l].logo.replace(/320x$/,'150x/format/jpeg');
                html+="<a href='"+'/investor/'+list[l].id+"'><img src='"+img+"'></a>";
            }
            $el.addClass('active');
            $history.show().animate({height:60},200).children('div').empty().append(html);
        }

    };
    this.touchtap = function(el){
        var startX,
            startY,
            startT,
            start = function(event){
                var  e = event || window.event;
                startT = new Date().getTime();
                startX = e.touches[0].pageX;
                startY = e.touches[0].pageY;
            },
            end = function(event){
                var  e = event || window.event,
                    mX = e.changedTouches[0].pageX - startX,
                    mY = e.changedTouches[0].pageY - startY,
                    eT= new Date().getTime(),
                    target = e.target || e.srcElement,
                    dom_tree = [target.parentNode,target.parentNode.parentNode],
                    type = '', id= 0,dom;
                for(var i in dom_tree){
                    if(dom_tree[i].hasAttribute('action-type') && dom_tree[i].hasAttribute('action-id')){
                        type = dom_tree[i].getAttribute('action-type');
                        id = dom_tree[i].getAttribute('action-id');
                        dom = dom_tree[i];
                        break;
                    }
                }
                if(eT-startT<150 && Math.abs(mX)<5 && id!=0){
                    return (type=='follow')&&self.follow(dom,id)||(type=='invest')&&self.invest(dom,id)||(type=='submit')&&self.submit(dom,id);
                }
            };
        if(el.nodeType && el.nodeType == 1){
            el.addEventListener('touchstart',start, false);
            el.addEventListener('touchend',end, false);
        }
    };
    self.touchtap(list_container);
}).call(define('view_list_action'));