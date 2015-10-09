(function(){
    this.key = {
        search_record:'com_search_history'
    };
    this.api = {
        comlist:base_mobile+'v3/startup',
        searchlist:base_mobile+'v2/startup_search',
        sdlist:base_mobile+'v4/speed_dating',
        follow:base_mobile+'v4/follow',
        unfollow:base_mobile+'v4/unfollow',
        ohm:'http://api.dubaoxing.com/angel_list/ohm',
        ohx:'http://api.dubaoxing.com/angel_list/ohx'
    };
    log.type = 'com_list';
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

    var $btn=$('.search'),
        $searchmodel=$('.search-list'),
        $input=$searchmodel.find('input'),
        self = this;
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
            route.go({type:'search', k:k, p:1, _:new Date().getTime()});
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
        $sd_box = $('.new-sd-list'),
        $normal = $('.section-list'),
        $turning= $('.page-turn'),
        $prev   = $turning.children('.prev-page'),
        $next   = $turning.children('.next-page'),
        $current= $turning.children('p').children('.current-page'),
        $total  = $turning.children('p').children('.total-page');

    this.search = function(data){
        $sd_box.hide();
        $normal.show();
        self.page_turning(data);
        if(data.hasOwnProperty('total')){
            controll_search.search_result(data.total);
        }
    };

    this.sd = function(data){
        $sd_box.show();
        $normal.hide();
        view_dom.filter.show();
        self.page_turning(data,10);
    };

    this.com = function(data){
        $sd_box.hide();
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
        var s = size || 10,i = parseInt(index),
            page = Math.ceil(parseInt(total)/s),
            prev = i-1 > 1 ? i-1: 1,
            next = i+1 < page ? i+1 :page,
            hash_prev = base_hash_model.save_data({p:prev}),
            hash_next = base_hash_model.save_data({p:next});
        $prev.attr('href',hash_prev);
        $next.attr('href',hash_next);
        $current.html(i);
        $total.html(page);
    };

}).call(define('view_list'));

(function(){
    var self = this,
        default_param = {
            access_token:account_info.token,
            uid:account_info.id
        },
        comlist_default = $.extend({},default_param,{type:0,pagesize:10}),
        sdlist_default = $.extend({},default_param,{pagesize:10,w:600,state:'online'}),
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

    //全部项目 搜索列表 页面数据填充
    this.com_list = avalon.define("list", function (vm) {
        vm.data = [];
    });

    //闪投项目 页面数据填充
    this.sd_list = avalon.define("sd-list", function (vm) {
        vm.data = [];
    });

    //数据格式化
    this.list_render = function(data){
        var render=data,l;
        l=render.length;
        while(l){
            if(typeof render[(l-1)].finishamount=='string'){
                render[(l-1)].finishamount=parseInt(render[(l-1)].finishamount.replace(/\.0/,'').replace(/\,/g,'').replace(/0{4}$/,''));
            }
            if(typeof render[(l-1)].amount == 'string'){
                render[(l-1)].amount=parseInt(render[(l-1)].amount.replace(/\,/g,'').replace(/0{4}$/,''));
            }
            l--;
        }
        return render;
    };
    //闪投数据格式化
    this.sd_list_render = function(data){
        var d = data || [],l = d.length,r = [],c = {};
        for(var i = 0; i < l; i++ ){
            c = d[i];
            if(c.base_info.viewapply)continue;
            r.push({
                id:c.base_info.id,
                is_follow:c.interaction_info.isfans||false,
                bg_img:c.base_info.sd.image||'',
                logo:c.base_info.logo||'',
                name:c.base_info.name||'',
                concept:c.base_info.concept,
                link:base_protocol+c.base_info.id+'.'+base_host,
                region:c.base_info.region.split(' ')[0],
                need:(function(d){
                    return !d.financing_need?d.financing_view_info:"共发行"+d.financing_need.shares+"份 · 每份占股"+d.financing_need.stock_each+"% · 预计融资 <span>"+d.financing_need.shares+"</span> 万";
                })(c.financing_need_info||{}),
                progress:(function(d){
                    return !d.financing_progress?null:{
                        percent:(parseInt(d.financing_progress.percent)>100?100:parseInt(d.financing_progress.percent))+'%',
                        text:d.financing_progress.percent+' %',
                        info:d.financing_progress.progress_info,
                        day:d.financing_progress.day
                    };
                })(c.financing_stage||{}),
                success:!c.financing_stage.financing_progress? c.financing_stage.financing_result.result_info:null
            });
        }
        return r;
    };

    //全部项目 数据获取回调
    this.com_list_call = function(data){
        if(data.hasOwnProperty('list')){
            self.com_list.data= self.list_render(data.list);
        }
        if(data.hasOwnProperty('total')){
            data.total==0 && view_dom.not_found.show();
        }
        view_list.com(data);
    };

    //ohm 数据获取回调
    this.ohm_list_call = function(data){
        if(data.hasOwnProperty('list')){
            self.com_list.data= self.list_render(data.list);
        }
        if(data.hasOwnProperty('total')){
            data.total==0 && view_dom.not_found.show();
        }
        view_list.com(data);
    };
    
    //ohx 数据获取回调
    this.ohx_list_call = function(data){
        if(data.hasOwnProperty('list')){
            self.com_list.data= self.list_render(data.list);
        }
        if(data.hasOwnProperty('total')){
            data.total==0 && view_dom.not_found.show();
        }
        view_list.com(data);
    };

    //搜索列表 数据回调方法
    this.search_list_call =function(data){
        if(data.hasOwnProperty('list')){
            self.com_list.data= self.list_render(data.list);
        }
        if(data.hasOwnProperty('total')){
            data.total==0 && view_dom.not_found.show();
        }
        view_list.search(data);
    };

    //闪投列表 数据回调
    this.sd_list_call = function(data){
        if(data.hasOwnProperty('list')){
            self.sd_list.data = self.sd_list_render(data.list);
        }
        if(data.hasOwnProperty('total')){
            data.total==0 && view_dom.not_found.show();
        }
        view_list.sd(data);
    };

    //全部项目 数据获取方法初始化
    this.com_list_get = base_data_model.init('com',config.api.comlist,comlist_default,self.com_list_call,error,loading);

    //全部项目 获取数据方法
    this.com_list_index = function(index,industry,district,order){
        var post ={
            pageindex:index || 1,
            industryid:industry || '',
            regionid:district || '',
            order:(!!order && order == 'new')?'new':'heat'
        };
        self.com_list_get(post);
    };

    //搜索列表 数据获取方法初始化
    this.search_list_get = base_data_model.init('search',config.api.searchlist,comlist_default,self.search_list_call,error,loading);

    //搜索列表 获取数据
    this.search_list_index = function(index,keyword){
        self.search_list_get({pageindex:index,keyword:keyword});
    };

    //ohm 数据获取方法初始化
    this.ohm_list_get = base_data_model.init('ohm',config.api.ohm,comlist_default,self.ohm_list_call,error,loading);

    //ohm 获取数据
    this.ohm_list_index = function(index,industry,district,order){
        var post ={
            pageindex:index || 1,
            industryid:industry || '',
            regionid:district || '',
            order:(!!order && order == 'new')?'new':'heat'
        };
        self.ohm_list_get(post);
    };

    //ohx 数据获取方法初始化
    this.ohx_list_get = base_data_model.init('ohx',config.api.ohx,comlist_default,self.ohx_list_call,error,loading);

    //ohx 获取数据
    this.ohx_list_index = function(index,industry,district,order){
        var post ={
            pageindex:index || 1,
            industryid:industry || '',
            regionid:district || '',
            order:(!!order && order == 'new')?'new':'heat'
        };
        self.ohx_list_get(post);
    };

    //闪投列表 数据获取方法初始化
    this.sd_list_get = base_data_model.init('sd',config.api.sdlist,sdlist_default,self.sd_list_call,error,loading);

    //闪投列表 获取数据
    this.sd_list_index = function(index,industry,district,state){
        var post ={
            pageindex:index || 1,
            industryid:industry || '',
            regionid:district || '',
            state:(!!state && state == 'success') ? 'success' :'online'
        };
        self.sd_list_get(post);
    }
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
            order = data.order || '',
            state = data.state || '',
            k = data.k ||'';
        if(!!data.type){
            self.record_history(data);
            self.default_display(data);
            view_filter.filter_name_syn();
            if(data.type == 'search' && !!data.k){
                return controll_list.search_list_index(p,data.k);
            }
            if(data.type == 'sd'){
                return controll_list.sd_list_index(p,industry,district,state);
            }
            if(data.type == 'com'){
                return controll_list.com_list_index(p,industry,district,order);
            }
            if(data.type == 'ohm'){
                return controll_list.ohm_list_index(p,industry,district,order);
            }
            if(data.type == 'ohx'){
                return controll_list.ohx_list_index(p,industry,district,order);
            }
        }
        self.go({type:'sd'});
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
    setTimeout(function () {
        self.core();
    }, 0);
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
    this.active_offset = 0;
    this.curret_type = 1;
    this.type_transfer = function (type) {
        var ret = '闪投项目', t = type || hash_data.type;
        if (!!t) {
            switch (t) {
                case 'com':
                    ret = '全部项目';
                    break;
                case 'ohm':
                    ret = '一亿美金';
                    break;
                case 'ohx':
                    ret = '百倍成长';
                    break;
                default :
            }
        }
        return ret;
    };
    this.transfer_type = function (type) {
        var ret = 'sd', t = type || self.com_active;
        switch (t) {
            case '全部项目':
                ret = 'com';
                break;
            case '一亿美金':
                ret = 'ohm';
                break;
            case '百倍成长':
                ret = 'ohx';
                break;
            default :
        }
        return ret;
    };
    this.com_active = self.type_transfer();
    this.industry_active = !!hash_data.industry ? hash_data.industry : '全部行业';
    this.district_active = !!hash_data.district ? hash_data.district : '全部地区';
    this.sd_state_active = (!!hash_data.state && hash_data.state == 'success')?'完成融资':'正在热投';
    this.order_active = (!!hash_data.order && hash_data.order == 'new')?'时间排序':'热度排序';

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
        hash_data.type = self.transfer_type();
        hash_data.industry = self.industry_active == '全部行业'?'':self.industry_active;
        hash_data.district = self.district_active == '全部地区'?'':self.district_active;
        if(hash_data.type == 'sd'){
            hash_data.state = self.sd_state_active == '正在热投'? 'online' : 'success';
        }
        else{
            hash_data.order = self.order_active == '热度排序' ? 'heat' : 'new';
        }
        route.jump(hash_data);
    };

    this.industry_list = ["全部行业","电子商务","移动互联网","信息技术","游戏","旅游","教育","金融","社交","娱乐","硬件","能源","医疗健康","餐饮","企业","平台","汽车","数据","房产酒店","文化艺术","体育运动","生物科学","媒体资讯","广告营销","节能环保","消费生活","工具软件","资讯服务","智能设备"];
    this.district_list = ['全部地区','北京','上海','深圳','广州','杭州','南京','西安','成都','苏州','天津','无锡','武汉','重庆','厦门','青岛'];
    this.page_list     = ['闪投项目','全部项目','一亿美金','百倍成长'];
    this.sd_state_list = ['正在热投','完成融资'];
    this.order_list    =  ['热度排序','时间排序'];
    this.avalon_filter = avalon.define("list-filter", function (vm) {
        vm.page_name = '';
        vm.industry_name = '';
        vm.district_name = '';
        vm.sd_state_name = '';
        vm.order_name = '';
        vm.list_content= self.page_list.concat();
        vm.list_page=function(){
            self.filter_acitve(0);
            self.avalon_filter.list_content=self.check_active(self.page_list.concat(),self.com_active,1);
        };
        vm.list_industry=function(){
            self.filter_acitve(1);
            self.avalon_filter.list_content=self.check_active(self.industry_list.concat(),self.industry_active,2);
        };
        vm.list_district=function(){
            self.filter_acitve(2);
            self.avalon_filter.list_content=self.check_active(self.district_list.concat(),self.district_active,3);
        };
        vm.sd_state = function(){
            self.filter_acitve(3);
            self.avalon_filter.list_content=self.check_active(self.sd_state_list.concat(),self.sd_state_active,4);
        };
        vm.order = function(){
            self.filter_acitve(4);
            self.avalon_filter.list_content=self.check_active(self.order_list.concat(),self.order_active,5);
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
                case 1:
                    self.com_active = self.avalon_filter.page_name = val;
                    break;
                case 2:
                    self.industry_active = self.avalon_filter.industry_name = val;
                    break;
                case 3:
                    self.district_active = self.avalon_filter.district_name = val;
                    break;
                case 4:
                    self.sd_state_active = self.avalon_filter.sd_state_name = val;
                    break;
                case 5:
                    self.order_active = self.avalon_filter.order_name = val;
                    break;
                default :
            }
            self.select_action();
        };

    });
    //URL 筛选名称对应
    this.filter_name_syn = function () {
        var hash_data_ = base_hash_model.get_data();
        if (hash_data_.type) {
            self.avalon_filter.page_name = self.type_transfer(hash_data_.type);
            self.avalon_filter.industry_name = !!hash_data_.industry ? hash_data_.industry : '全部行业';
            self.avalon_filter.district_name = !!hash_data_.district ? hash_data_.district : '全部地区';
            self.avalon_filter.sd_state_name = (!!hash_data_.state && hash_data_.state == 'success') ? '完成融资' : '正在热投';
            self.avalon_filter.order_name = (!!hash_data_.order && hash_data_.order == 'new') ? '时间排序' : '热度排序';
        }
    };
}).call(define('view_filter'));
//关注项目
(function(){
    var self = this,
        $base = $('.new-sd-list'),
        touch = {
            x:0,
            y:0,
            t:0
        };
    this.base = function(id,is_follow,call){
        var api = !!is_follow?config.api.follow:config.api.unfollow;
        base_remote_data.ajaxjsonp(api, call, {id:id, uid:account_info.id,access_token:account_info.token}, function(){view_dom.notification.show('网络错误');});
    };
    this.follow = function(id,ele){
        self.base(id,true,function(data){
            if(data.success){
                ele.addClass('active');
            }
            else{
                view_dom.notification.show(data.message || '操作失败');
            }
        });
    };
    this.unfollow = function(id,ele){
        self.base(id,false,function(data){
            if(data.success){
                ele.removeClass('active');
            }
            else{
                view_dom.notification.show(data.message || '操作失败');
            }
        });
    };
    $base.delegate(".follow_star","touchstart",function(e){
        touch.x= e.originalEvent.touches[0].pageX;
        touch.y= e.originalEvent.touches[0].pageY;
        touch.t = new Date().getTime();
    });
    $base.delegate(".follow_star","touchend",function(e){
        var event=e.originalEvent.changedTouches[0],move=Math.pow(event.pageX-touch.x,2)+Math.pow(event.pageY-touch.y,2),o = new Date().getTime();
        e.preventDefault();
        if(o-touch.t<150 && move<81){
            $(this).parent().hasClass('active')?self.unfollow($(this).data('id'),$(this).parent()):self.follow($(this).data('id'),$(this).parent());
        }
    });

}).call(define('view_follow'));