(function(){
    this.avalonVM=avalon.define("list-info", function (vm) {
        vm.data = {};
    });
    this.avalonSearch=avalon.define("search-status", function (vm) {
        vm.data = [''];
        vm.clearhistory=function(){
            base_local_data.savedata(base_config.search_com_history_key,[]);
            vm.data=[];
        };
        vm.searchhistory=function(e){
            search_import(this.innerHTML);
        }
    })
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

//搜索模块
(function(){
    var $btn=$('.search'),
        $searchmodel=$('.search-list'),
        $bk=$('.bk'),
        $input=$searchmodel.find('input'),
        $close=$searchmodel.find('i'),sta=false,
        $cancelsearch=$('.cancelsearch'),
        $searchresult=$('.search-result'),
        domain=this;
    this.search_config_cache={};
    this.search_model_display={
        status:{
            topbar:false,
            history:false,
            result:false,
            bk:false,
            searching:false
        },
        topbar:{
          show:function(){
              if(!search_model_display.status.topbar) {
                  $searchmodel.show(0, function () {
                      $(this).css({display: 'block', opacity: 0.95});
                      $btn.css('right', '6%');
                  });
                  search_model_display.status.topbar = true;
              }
          },
          hide:function(){
              if(search_model_display.status.topbar) {
                  $searchmodel.css('opacity', 0);
                  $btn.css('right', '9%');
                  $searchmodel.hide();
                  search_model_display.status.topbar = false;
              }
          }
        },
        history:{
            show:function(){
                avalonSearch.data=base_local_data.getdata(base_config.search_com_history_key)||[];
                search_model_display.status.history=true;
            },
            hide:function(){
                avalonSearch.data = [];
                search_model_display.status.history = false;
            }
        },
        bk:{
            show:function(){
                if(!search_model_display.status.bk){
                    $bk.show(0,function(){$(this).css('opacity',0.7)});
                    search_model_display.status.bk=true;
                }
            },
            hide:function(){
                if(search_model_display.status.bk) {
                    $bk.css('opacity', 0);
                    setTimeout(function () {
                        $bk.hide();
                    }, 400);
                    search_model_display.status.bk = false;
                }
            }
        },
        input:{
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
        },
        result:{
            show:function(name,count){
                var $span=$searchresult.find('span');
                    $searchresult.show();
                    $span.eq(0).html(name);
                    $span.eq(1).html(count);
                search_model_display.status.result=true;
            },
            hide:function(){
                setTimeout(function(){ $searchresult.hide();},200);
                search_model_display.status.result=false;
            }
        }
    };
    this.search_import=function(k){
        location.hash=this.base_hash.putdata({p:1,k: encodeURI(k),t: $.now()});
    };
    this.search_cancel=function(){
        location.hash=this.base_hash.putdata({p:this.page_config.currentpage});
    };
    this.search_function=function(k){

        var local_history=base_local_data.getdata(base_config.search_com_history_key)||[];

        if(!k){
            if(search_config_cache.hasOwnProperty('perpage')){
                page_config=search_config_cache;
            }
            search_model_display.status.searching=false;
            search_model_display.result.hide();
            search_model_display.topbar.hide();
            search_model_display.input.fill();

        }
        else{
            var k=decodeURI(k);

            if(!search_model_display.status.searching){

                search_config_cache={};
                $.extend(true,search_config_cache,page_config);

                page_config.currentpage=1;
                page_config.remote_current_api=api.comlistsearch;
                page_config.pagelistcache=false;
                page_config.localprecacheprefix='searchlist';
            }
            page_config.page_hook=function(data){
                var n=0;
                if(data.hasOwnProperty('total')){
                    n=data['total'];
                }
                search_model_display.result.show(k,n);
            };
            page_config.page_data_param.keyword=k;
            page_config.pagination_param.k=encodeURI(k);

            search_model_display.status.searching=true;
            search_model_display.topbar.show();
            search_model_display.bk.hide();
            search_model_display.input.fill(k);
            search_model_display.input.blur();
            search_model_display.history.hide();
            //保存搜索记录
            if(local_history.indexOf(k)==-1){
                local_history.push(k);
            }
            base_local_data.savedata(base_config.search_com_history_key,local_history);
        }

    };

    //事件绑定 原始
    $btn.touchtap(function(){
        if(!search_model_display.status.topbar){
            search_model_display.topbar.show();
            search_model_display.history.show();
            search_model_display.bk.show();
            search_model_display.input.foucus();
        }
        else{
            search_import($input.val());
        }
    });
    $bk.touchtap(function(){
        search_model_display.history.hide();
        search_model_display.topbar.hide();
        search_model_display.bk.hide();
        search_model_display.input.blur();
        search_model_display.input.fill();
    });
    $close.touchtap(function(){
        //正常显示关闭

            search_model_display.history.hide();
            search_model_display.topbar.hide();
            search_model_display.bk.hide();
            search_model_display.input.blur();
            search_model_display.input.fill();
            //取消搜索
            search_model_display.status.searching && search_cancel();

    });
    $cancelsearch.touchtap(function(){
        search_cancel();
    });
    $input.keyup(function(e){
        if(e.keyCode==13){
            search_import($input.val());
        }
    });
    $input.focus(function(){
       search_model_display.history.show();
       search_model_display.bk.show();
    });
}).call(this);

(function(){
    //页面列表属性
    this.page_config={
        perpage:10,
        pagetotal:0,
        currentpage:1,
        pageindexcache:true,
        pagelistcache:true,
        pageindexkey:'comlist_pageindex',
        localprecachearray:[],
        localprecacheprefix:'comlist_precache_prefix',
        page_data_param:{},
        pagination_param:{},
        remote_current_api:api.comlist,
        page_hook:function(){},
        page_data_render:function(data){
            var render=data,l;
            if(render.hasOwnProperty('list')){
                l=render.list.length;
                while(l){
                    if(typeof render.list[(l-1)].finishamount=='string'){
                        render.list[(l-1)].finishamount=parseInt(render.list[(l-1)].finishamount.replace(/\,/g,'').replace(/0{4}$/,''));
                    }
                    if(typeof render.list[(l-1)].amount == 'string'){
                        render.list[(l-1)].amount=parseInt(render.list[(l-1)].amount.replace(/\,/g,'').replace(/0{4}$/,''));
                    }
                    l--;
                }
            }
            return render;
        }
    };
    //Dom元素
    this.$page_ele={
        page_num_current:$('.current-page'),
        page_num_all:$('.total-page'),
        btn_prev:$('.prev-page'),
        btn_next:$('.next-page'),
        loading:$(".loading-container")
    };
    //页码显示
    this.page_num_update=function(){
        $page_ele.page_num_current.html(this.page_config.currentpage);
        $page_ele.page_num_all.html(this.page_config.pagetotal);
    };
    //翻页链接更新
    this.page_btn_update=function(){
        var index=parseInt(this.page_config.currentpage),prev,next,total=parseInt(this.page_config.pagetotal);

        prev={p:index>1?index-1:1};
        next={p:total>=index+1?index+1:index};
        $.extend(true,prev,page_config.pagination_param);
        $.extend(true,next,page_config.pagination_param);
        this.$page_ele.btn_prev.prop('href',base_hash.putdata(prev));
        this.$page_ele.btn_next.prop('href',base_hash.putdata(next));
    };
    //滚动回顶部
    this.page_scroll_top=function(){
        var t=document.body.scrollTop, s, e;
        if(t){
            e=t/(200/13);
            s=setInterval(function(){
                t-=e;
                if(t<0){
                    t=0;
                    clearInterval(s);
                }
                document.body.scrollTop=t;
            },13);
        }
    };
    //数据整理
    this.page_data_get=function(call){
        var getcache, todel,data,
            index=parseInt(page_config.currentpage),
            array=[],
            pagerange=index, l,
            pusucachearray=function(i){
                if(page_config.localprecachearray.indexOf(i)==-1){
                    page_config.localprecachearray.push(i);
                }
            };

        getcache=base_local_data.getdata(page_config.localprecacheprefix+this.page_config.currentpage);
        //如果该页有缓存调用 或 Ajax获取
        if(getcache){
            call(getcache);
        }
        else{
            this.page_remote_data(call,pagerange);
        }
        //当前页 整理缓存规则 进行缓存 或 删除缓存
        if(page_config.pagelistcache){
            array.push(pagerange);
            pusucachearray(pagerange);
            if(index>1){
                pagerange=index-1;
                getcache=base_local_data.getdata(page_config.localprecacheprefix+pagerange);
                if(!getcache){
                    this.page_remote_data(function(){},pagerange);
                }
                pusucachearray(pagerange);
                array.push(pagerange);
            }
            if(index<parseInt(page_config.pagetotal)){
                pagerange=index+1;
                getcache=base_local_data.getdata(page_config.localprecacheprefix+pagerange);
                if(!getcache){
                    this.page_remote_data(function(){},pagerange);
                }
                pusucachearray(pagerange);
                array.push(pagerange);
            }

            l=page_config.localprecachearray.length;
            while(l){
                if(array.indexOf(page_config.localprecachearray[l-1])==-1){
                    base_local_data.deldata(page_config.localprecacheprefix+page_config.localprecachearray[l-1]);
                    page_config.localprecachearray.splice(l-1,1);
                }
                l--;
            }
        }

    };
    //远程获取数据并保存
    this.page_remote_data=function(call,index){

        var param={'pagesize':this.page_config.perpage,'pageindex':index},renderdata={};

        $.extend(true,param,page_config.page_data_param);

        base_remote_data.ajaxjsonp(page_config.remote_current_api,function(data){
            //数据整理
            renderdata = page_config.page_data_render(data);
            if(index && page_config.pagelistcache){
                base_local_data.savedata(page_config.localprecacheprefix+index,data);
            }
            call(data);
        },param);
    };
    //当前页面链接hash 绑定 页数 搜索字段
    this.page_current_num=function(){

        var p=parseInt(base_hash.getdata('p')),cache,
            k=base_hash.getdata('k');


        this.search_function(k);

        if(p){
            this.page_config.currentpage=p;
        }
        //页面初始化，无法获取hash页数，从缓存读取页数并补全链接，或首页开始
        else{
            cache=this.base_local_data.getdata(this.page_config.pageindexkey);

            if(this.page_config.pageindexcache && cache!=null){
                this.page_config.currentpage=cache;
            }

            location.hash=this.base_hash.putdata({p:this.page_config.currentpage});

            return false;
        }

    };
    //页面处理
    this.page_core=function(){

        this.page_current_num();

        this.page_scroll_top();

        this.page_data_get(function(data){

            if(data.hasOwnProperty('list')){
                avalonVM.data=data.list;
            }
            if(data.hasOwnProperty('total')){
                this.page_config.pagetotal=Math.ceil(data.total/this.page_config.perpage);
            }
            //钩子
            this.page_config.page_hook(data);
            //更新页码数
            this.page_num_update();
            //更新翻页连接
            this.page_btn_update();
            //存储当前页数
            this.base_local_data.savedata(this.page_config.pageindexkey,this.page_config.currentpage);
            //loading动画隐藏
            this.$page_ele.loading.hide();
        });

    };

    //初始页面处理
    this.page_core();
    //hashchange事件触发页面重载
    window.onhashchange=function(){
        page_core();
    };



}).call(this);

/*触摸移动事件事件 翻页显示与隐藏*/
(function(){
    this.$touchele=$('.page-turn');

    this.touchsta={
        barheight:65,
        eleshow:true,
        isstart:false,
        startY:0,
        endY:0
    };
    if(base_status.support_touch){
        document.body.ontouchstart=function(event){
            var touch=event.touches[0];
            if(touch){
                touchsta.startY=touch.clientY;
                touchsta.isstart=true;
            }
        };
        document.body.ontouchmove=function(event){
            var touch=event.touches[0],mY;
            if(touch){
                mY=touch.clientY-touchsta.startY;
                if(Math.abs(mY)<touchsta.barheight){
                    if(mY<0 && touchsta.eleshow){
                        $touchele.css('bottom',mY);
                    }

                    if(mY>0 && !touchsta.eleshow){
                        $touchele.css('bottom',mY-touchsta.barheight);
                    }
                }

            }
        };
        document.body.ontouchend=function(event){
            var touch=event.changedTouches[0],endY=touch.clientY,moveabs=Math.abs(endY-touchsta.startY);
            if(moveabs>5){
                if(endY-touchsta.startY>0 && !touchsta.eleshow){
                    if(moveabs>touchsta.barheight/2){
                        $touchele.animate({'bottom':0});
                        touchsta.eleshow=true;
                    }
                    else{
                        $touchele.animate({'bottom':-touchsta.barheight});
                        touchsta.eleshow=false;
                    }
                }
                if(endY-touchsta.startY<0 && touchsta.eleshow){
                    if(moveabs>touchsta.barheight/2){
                        $touchele.animate({'bottom':-touchsta.barheight});
                        touchsta.eleshow=false;
                    }
                    else{
                        $touchele.animate({'bottom':0});
                        touchsta.eleshow=true;
                    }
                }
            }

        };

    }

}).call(this);