(function(){
    var self = this,
        $no_auth = $('.no-authority'),
        $apply = $('#apply'),
        $error = $('.error'),
        current_url = encode_current_url=encodeURIComponent(location.href.split('?')[0]);
    this.has_authority =true;
    this.no_authority = function(hasaccount){
        return self.has_authority=false,$no_auth.show(),(!!hasaccount ? $apply.attr('href',"//0.angelcrunch.com/angel/new?source="+current_url):$apply.attr('href',"//m.angelcrunch.com/angel_vip_simple?source="+current_url));
    };
    this.error = function(){
        $error.show();
    };
    (!$_GET.all || !$_GET.url)&&self.error();
    (parseInt(account_info.role)<1)?self.no_authority():(!account_info.is_login?self.no_authority(1):'');
    log.type = 'bp';
}).call(define('view_bp'));

(function(){

    if(!view_bp.has_authority)return false;

    var self = this,
        bp_id =$_GET.id,
        total = parseInt($_GET.all),
        $window = $(window),
        $list_container = $('#list-container'),
        $list = $(),
        width = $window.width(),
        height = $window.height(),
        $page_num = $('.page-num'),
        $corner_index = $('#page-num-index'),
        $corner_total = $('#page-num-total'),
        timer = 0,
        unit = 1,
        img_offset = 0,
        base_url = decodeURIComponent($_GET.url).split('__page__');
    this.get_bp_url = function(index){
        return decodeURIComponent(base_url[0]+index+base_url[1]);
    };
    this.get_html = function(all){
        var h = '';
        while(all){
            h+='<li><img src="http://dn-acac.qbox.me/mobile/homepage/loading_bp.png?"></li>';
            all--;
        }
        return h;
    };
    this.get_position = function(top){
        var e = width/(16/9),
            n = Math.ceil(top/e);
        unit = Math.ceil(height/e);
        return n;
    };
    this.corner_update = function(index){
        var i = index+unit>=total?total:index+unit;

        $corner_index.html(i);
        $corner_total.html(total);

        $page_num.addClass('active');
        if(timer){
            clearTimeout(timer);
        }
        timer = setTimeout(function(){
            $page_num.removeClass('active');
        },1500);
    };
    this.fill_img = function(index){
        var i = index +unit+5>total?total:index+unit+5;
        if(i > img_offset){
            for(var n = img_offset; n <= i;n++){
                $list.eq(n).attr('src',self.get_bp_url(n+1));
            }
            img_offset = i;
        }
    };
    this.scroll_action = function(index){
        self.corner_update(index);
        self.fill_img(index);
    };
    this.scroll_fun = function(){
        var now = $(window).scrollTop();
        self.scroll_action(self.get_position(now));
    };
    this.init = function(){
        //依据总张数插入空图片
        $list_container.append(self.get_html(total));
        $list = $('li').children('img');
        self.scroll_fun();
        //页面滚动
        document.body.addEventListener('touchmove',self.scroll_fun, false);
        //响应当前页面尺寸
        $window.resize(function(){
            width = $(this).width();
            height= $(this).height();
        });
    };

    self.init();

}).call(define('view_list'));