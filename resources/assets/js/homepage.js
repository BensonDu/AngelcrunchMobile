(function(){
    var self = this;
    this.api = {
        sd:base_mobile+'v3/speed_dating',
        stars:base_mobile+'v3/speed_dating'
    };
    this.default_param = {
        uid:account_info.id,
        access_token:account_info.token
    };
    this.get_data = function(url,call,data){
        base_remote_data.ajaxjsonp(url,function(data){
            call(data);
        },$.extend(true,self.default_param,data));
    };
    log.type = 'homepage';
}).call(define('page_base'));

(function(){
    var self = this,
        $base = $('.tag-group'),
        $selector = $base.children('.selector'),
        $first = $base.children('div').children('a'),
        $bk_menu = $('.bk-num'),
        $bk_text = $bk_menu.find('p');

    this.sta = {
        switch:true,
        current:1
    };

    this.item_active = function(index){
        var text = $first.removeClass('active').eq(index).addClass('active').children('h4').children('span').html();
        self.selector_active(index);
        setTimeout(function(){self.bk_text(text);},800);
    };
    this.selector_active = function(index){
        var t = index || 0;
        $selector.css('top',t*80+'px');
    };
    this.bk_active = {
        show:function(){
            $bk_menu.removeClass('fadeout').addClass('fadein');
        },
        hide:function(){
            $bk_menu.addClass('fadeout').removeClass('fadein');
        }
    };

    this.bk_text = function(t){
        $bk_text.html(t);
    };

    this.next_active = function(){
        self.item_active(self.sta.current);
        self.sta.current++;
        if(self.sta.current == 3){
            self.sta.current = 0;
        }
        setTimeout(self.bk_active.hide,0);
        setTimeout(self.bk_active.show,800);
    };

    this.init = function(){
        setInterval(function(){
            if(self.sta.switch){
                self.next_active();
            }
        },3000);
        self.item_active(0);
        setTimeout(self.bk_active.hide,0);
        setTimeout(self.bk_active.show,800);
    };

    self.init();

}).call(define('view_firstpage'));

(function(){
    var self = this;

    this.circle = Circles.create({
        id:           'circle',
        radius:       50,
        value:        0,
        maxValue:     100,
        maxTextValue: 100,
        width:        10,
        text:         function(value){return value + '%';},
        colors:       ['#cecece', '#ff3d00'],
        duration:     300,
        wrpClass:     'circles-wrp',
        textClass:    'circles-text',
        styleWrapper: true,
        styleText:    true
    });
    this.update_value = function(val){
        var v = val || 0;
        self.circle.updateMaxTextValue(v > 100 ? v : 0);
        self.circle.updateTo(v);
    };

}).call(define('view_sd'));

(function(){
    var self = this,
        $list_selector = $('#sd-selector'),
        $list_contaner = $('#list-container'),
        $touch = $('#touch-zone'),
        $all_infozone = $('.pro-info-unit'),
        $btn_left = $touch.find('.left').children('em'),
        $btn_right= $touch.find('.right').children('em');

    this.list = [];
    this.list_index = 0;

    this.framework =  avalon.define("sd-list", function (vm) {
        vm.data = {
            name:'',
            district:'',
            day:30,
            finish:0,
            hope:0,
            concept:'',
            image:'',
            link:''
        };
        vm.list = [];
        vm.select = function(index){
            self.index(index);
        };
        vm.next = function(){
            self.next();
        };
        vm.prev = function(){
            self.prev();
        }
    });

    this.data_call = function(){
	var data = JSON.parse('{"regionid":"","pageindex":2,"total":145,"list":[{"concept":"\u5c06\u624b\u6e38\u5feb\u901f\u79fb\u690d\u6210\u7535\u89c6\u6e38\u620f\uff0c\u505a\u7535\u89c6\u6e38\u620f\u7684\u53d1\u884c","image":"http://dn-ac-sd.qbox.me/13355523.jpg?imageMogr2/thumbnail/600x","shareurl":"http://s.pe.vc/Q25","coinveststatus":40,"creatorid":13355506,"logo":"http://dn-xswe.qbox.me/13355511?imageMogr2/thumbnail/240x","id":"13355523","vc_list":[],"finishamount":"0","member_count":2,"remaind_count":5,"viewapply":0,"isfans":"0","is_sd":true,"financingid":"","creatorphone":"","region":"上海","day":0,"stage":"正式发布","name":"\u6e38\u620f\u70ed","industry":"\u6e38\u620f \u667a\u80fd\u786c\u4ef6","allow_submit_count":5,"vc_count":0,"amount":"5,000,000","is_meet":0,"creatorname":"\u66fe\u7acb\u94a7","canview":1},{"concept":"\u5229\u7528VR\u6280\u672f\u4e0e\u50ac\u7720\u6280\u672f\u521b\u65b0\u89e3\u51b3\u5931\u7720\u8005\u56f0\u6270","image":"http://dn-ac-sd.qbox.me/13344418.jpg?imageMogr2/thumbnail/600x","shareurl":"http://s.pe.vc/QSM","coinveststatus":40,"creatorid":13343953,"logo":"http://dn-xswe.qbox.me/13344414?imageMogr2/thumbnail/240x","id":"13344418","vc_list":["\u5f20\u6d77\u4f1f"],"finishamount":"0","member_count":4,"remaind_count":5,"viewapply":0,"isfans":"0","is_sd":true,"financingid":"","creatorphone":"","region":"福建 厦门 海沧区","day":0,"stage":"研发阶段","name":"sleepmanVR\u7761\u7720\u7cfb\u7edf","industry":"VR\u5065\u5eb7\u9886\u57df","allow_submit_count":5,"vc_count":1,"amount":"6,000,000","is_meet":0,"creatorname":"\u4e18\u9756","canview":1},{"concept":"\u4e2d\u56fd\u9996\u6b3e\u975e\u4fb5\u5165\u5f0f\u4e2a\u4f53\u5fc3\u8870\u9662\u5916\u76d1\u62a4\u7cfb\u7edf","image":"http://dn-ac-sd.qbox.me/13343928.jpg?imageMogr2/thumbnail/600x","shareurl":"http://s.pe.vc/Qke","coinveststatus":40,"creatorid":13341404,"logo":"http://dn-xswe.qbox.me/13343926?imageMogr2/thumbnail/240x","id":"13343928","vc_list":["\u9ec4\u8587"],"finishamount":"2,270,000","member_count":3,"remaind_count":5,"viewapply":0,"isfans":"0","is_sd":true,"financingid":"","creatorphone":"","region":"山西 太原","day":0,"stage":"正式发布","name":"\u8109\u5fc3\u4e91","industry":"\u533b\u7597\u5065\u5eb7 \u65b0\u5174\u6280\u672f \u4fe1\u606f\u6280\u672f","allow_submit_count":5,"vc_count":1,"amount":"6,500,000","is_meet":0,"creatorname":"\u674e\u52e4","canview":1},{"concept":"\u4e00\u79cd\u9ad8\u786c\u5ea6\u6613\u6e05\u6d01\u7c89\u672b\u6d82\u6599","image":"http://dn-ac-sd.qbox.me/13344219.jpg?imageMogr2/thumbnail/600x","shareurl":"http://s.pe.vc/QR4","coinveststatus":40,"creatorid":13342813,"logo":"http://dn-xswe.qbox.me/13344212?imageMogr2/thumbnail/240x","id":"13344219","vc_list":[],"finishamount":"0","member_count":1,"remaind_count":5,"viewapply":0,"isfans":"0","is_sd":true,"financingid":"","creatorphone":"","region":"广东 深圳 宝安区","day":0,"stage":"正式发布","name":"\u9676\u74f7\u7c89\u672b\u6d82\u6599","industry":"\u65b0\u80fd\u6e90/\u6750\u6599","allow_submit_count":5,"vc_count":0,"amount":"1,500,000","is_meet":0,"creatorname":"\u718a\u6770","canview":1},{"concept":"\u5916\u7c4d\u4eba\u624d\u60ac\u8d4f\u76f4\u8058\u5e73\u53f0","image":"http://dn-ac-sd.qbox.me/13342724.jpg?imageMogr2/thumbnail/600x","shareurl":"http://s.pe.vc/Qiq","coinveststatus":40,"creatorid":13342714,"logo":"http://dn-xswe.qbox.me/13342717?imageMogr2/thumbnail/240x","id":"13342724","vc_list":[],"finishamount":"0","member_count":1,"remaind_count":5,"viewapply":0,"isfans":"0","is_sd":true,"financingid":"","creatorphone":"","region":"江苏 南京 鼓楼区","day":0,"stage":"已有用户","name":"\u8001\u5916\u5feb\u7ebf","industry":"\u79fb\u52a8\u4e92\u8054\u7f51","allow_submit_count":5,"vc_count":0,"amount":"5,000,000","is_meet":0,"creatorname":"\u6768\u661f","canview":1},{"concept":"\u6ed1\u96ea\uff0c\u4ece\u672a\u5982\u6b64\u7b80\u5355","image":"http://dn-ac-sd.qbox.me/13277585.jpg?imageMogr2/thumbnail/600x","shareurl":"http://s.pe.vc/ODk","coinveststatus":60,"creatorid":13273529,"logo":"http://dn-xswe.qbox.me/13277575?imageMogr2/thumbnail/240x","id":"13277585","vc_list":["\u5f20\u94ed","\u53f6\u5cf0","\u7a0b\u9e3f","\u4ec7\u535a","\u88f4\u660e\u9ad8","\u66f9\u8475"],"finishamount":"800,000","member_count":2,"remaind_count":5,"viewapply":0,"isfans":"0","is_sd":true,"financingid":"","creatorphone":"","region":"北京 海淀区","day":0,"stage":"已有收入","name":"\u96ea\u4e50\u5c71\u5ba4\u5185\u6ed1\u96ea","industry":"\u5065\u7f8e\u5065\u8eab \u5782\u76f4\u7535\u5546 \u4f53\u80b2 \u5782\u76f4\u793e\u4ea4 \u6570\u636e","allow_submit_count":5,"vc_count":6,"amount":"5,000,000","is_meet":0,"creatorname":"\u738b\u8fbe","canview":1},{"concept":"\u9009\u80a1\u95ee\u5c0f\u5409\uff0c\u65f6\u673a\u6700\u5148\u77e5\uff01","image":"http://dn-ac-sd.qbox.me/13309342.jpg?imageMogr2/thumbnail/600x","shareurl":"http://s.pe.vc/O80","coinveststatus":60,"creatorid":13309297,"logo":"http://dn-xswe.qbox.me/13309298?imageMogr2/thumbnail/240x","id":"13309342","vc_list":["\u9c81\u5b66\u52c7"],"finishamount":"870,000","member_count":1,"remaind_count":5,"viewapply":0,"isfans":"0","is_sd":true,"financingid":"","creatorphone":"","region":"北京 朝阳区","day":0,"stage":"正式发布","name":"\u5c0f\u5409\u5148\u77e5","industry":"\u4e92\u8054\u7f51\u91d1\u878d \u80a1\u7968","allow_submit_count":5,"vc_count":1,"amount":"3,500,000","is_meet":0,"creatorname":"\u5b59\u73a5","canview":1},{"concept":"\u54c1\u724c\u65b0\u54c1\u53d1\u5e03\u9884\u552e\u5e73\u53f0","image":"http://dn-ac-sd.qbox.me/13286725.jpg?imageMogr2/thumbnail/600x","shareurl":"http://s.pe.vc/OJx","coinveststatus":60,"creatorid":13286723,"logo":"http://dn-xswe.qbox.me/13286724?imageMogr2/thumbnail/240x","id":"13286725","vc_list":["\u5f20\u6d77\u4f1f","\u53f6\u5cf0","\u5f20\u5fd7\u4eac","\u5b59\u66e6","AC\u8ddf\u6295\u6307\u6570\u57fa\u91d1","\u6731\u5b81","\u674e\u4f73\u59ae"],"finishamount":"2,700,000","member_count":3,"remaind_count":5,"viewapply":0,"isfans":"0","is_sd":true,"financingid":"","creatorphone":"","region":"上海 普陀区","day":0,"stage":"正式发布","name":"\u6b32\u8d2d","industry":"\u79fb\u52a8\u5a92\u4f53 LBS \u79fb\u52a8\u652f\u4ed8 \u79fb\u52a8\u7535\u5546 \u4f01\u4e1a\u5de5\u5177","allow_submit_count":5,"vc_count":7,"amount":"3,000,000","is_meet":0,"creatorname":"\u9648\u80dc","canview":1},{"concept":"\u56fd\u5185\u9996\u5bb6\u6700\u771f\u5b9e\u6613\u7528\u7684\u5bb6\u5c45VR\u5e73\u53f0","image":"http://dn-ac-sd.qbox.me/13297728.jpg?imageMogr2/thumbnail/600x","shareurl":"http://s.pe.vc/Onq","coinveststatus":60,"creatorid":13297409,"logo":"http://dn-xswe.qbox.me/13297717?imageMogr2/thumbnail/240x","id":"13297728","vc_list":["\u5f20\u6960","\u88f4\u660e\u9ad8"],"finishamount":"1,000,000","member_count":8,"remaind_count":5,"viewapply":0,"isfans":"0","is_sd":true,"financingid":"","creatorphone":"","region":"北京 海淀区","day":0,"stage":"已有收入","name":"\u5e73\u884c\u4e16\u754c","industry":"\u5de5\u5177\u8f6f\u4ef6 \u5e73\u53f0 \u4f01\u4e1a\u670d\u52a1 \u7535\u5b50\u5546\u52a1 \u865a\u62df\u73b0\u5b9e\u6e38\u620f","allow_submit_count":5,"vc_count":2,"amount":"5,000,000","is_meet":0,"creatorname":"\u9648\u7acb\u57fa","canview":1},{"concept":"\u57fa\u4e8e\u79fb\u52a8\u4e92\u8054\u7f51\u6253\u9020\u7684\u201c\u793c\u7269\u793e\u4ea4\u5e73\u53f0\u201d","image":"http://dn-ac-sd.qbox.me/13244889.jpg?imageMogr2/thumbnail/600x","shareurl":"http://s.pe.vc/Llt","coinveststatus":70,"creatorid":13244858,"logo":"http://dn-xswe.qbox.me/13244883?imageMogr2/thumbnail/240x","id":"13244889","vc_list":["\u4f17\u521b","\u59dc\u8403\u82f9","\u5f6d\u6570\u5b66","\u6797\u6d2a\u751f","\u738b\u8bad"],"finishamount":"7,800,000","member_count":2,"remaind_count":5,"viewapply":0,"isfans":"1","is_sd":true,"financingid":"","creatorphone":"","region":"广东 广州 海珠区","day":0,"stage":"已有用户","name":"\u98de\u793c","industry":"\u79fb\u52a8\u4e92\u8054\u7f51 \u793e\u4ea4\u7535\u5546 B2B B2C C2C","allow_submit_count":5,"vc_count":5,"amount":"6,000,000","is_meet":0,"creatorname":"\u90ac\u5357","canview":1}],"industryid":""}');
        if(data.list){
            self.list = self.framework.list = data.list;
            self.info(0);
            self.btn_display(0);
        }
    };

    //this.get_sd = page_base.get_data(page_base.api.sd,self.data_call,{pagesize:10,pageindex:1,w:600,state:'online',industryid:'',regionid:''})

    this.info = function(index){
        var c = {},f = 1,h = 1;
        if(!!self.list[index]){
            c = self.list[index];
            f = parseInt(c.finishamount.replace(/\.0/,'').replace(/\,/g,'').replace(/0{4}$/,''));
            h = parseInt(c.amount.replace(/\.0/,'').replace(/\,/g,'').replace(/0{4}$/,''));
            self.framework.data.name = c.name;
            self.framework.data.district = c.region;
            self.framework.data.day = c.day;
            self.framework.data.concept = c.concept;
            self.framework.data.image = c.image;
            //self.framework.data.link = base_protocol+c.id+'.'+base_host;
            self.framework.data.link ='/startup/'+c.id;
            self.framework.data.finish = account_info.role >0 ?'￥'+ f + '万' : '投资人可见';
            self.framework.data.hope = account_info.role >0 ? '￥'+ h + '万' : '投资人可见';
            view_sd.update_value((f/h*100).toFixed(0));
        }
    };

    this.btn_display = function(index){
        index === 0?$btn_left.hide():$btn_left.show();
        index === self.list.length-1?$btn_right.hide():$btn_right.show();
    };

    this.next = function(){
        if(self.list_index+1 < self.list.length){
            self.index(self.list_index+1);
            self.keep_seen(self.list_index);
        }
    };

    this.prev = function(){
        if(self.list_index > 0 ){
            self.index(self.list_index-1);
            self.keep_seen(self.list_index);
        }
    };

    this.index = function(index){
        var i = parseInt(index);
        self.btn_display(i);
        $all_infozone.fadeOut(300,function(){self.info(i);$all_infozone.fadeIn(300)});
        self.selector(i);
        self.list_index = i;
    };

    this.selector = function(index){
        var i = index || 0;
        $list_selector.css('left',60*parseInt(i)+'px');
    };

    this.keep_seen = function(index){
        var i = index+ 1, w = $(window).width(), n = $list_contaner.scrollLeft(), num = Math.ceil(w/60),hide =Math.floor(n/60);
        if(i-hide>num-1){
            self.scroll_left()(Math.ceil(n+(i-hide-num+1)*60));
        }
        else{
            if(i<=hide+1){
                self.scroll_left()(Math.ceil(n+(i-hide-2)*60));
            }
        }
    };
    this.scroll_left = function(){
        var t = 0;
        return function(d){
            var n = 0,l = 0, s = 0;
            if(t){
                clearInterval(t);
            }
            else{
                n = $list_contaner.scrollLeft();
                l = (d-n)/(200/13);
                t = setInterval(function(){
                    if(s<200){
                        $list_contaner.scrollLeft(n+=l);
                        s+=13;
                    }
                    else{
                        $list_contaner.scrollLeft(n+=l);
                        clearInterval(t);
                    }
                },13);
            }
        }
    };

    this.touchtap = function(el,fun){
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
                    now= new Date().getTime(),
                    target = e.target || e.srcElement,
                    dom_tree = [target.parentNode,target.parentNode.parentNode],id = null;
                for(var i in dom_tree){
                    if(dom_tree[i].getAttribute('data-id')){
                        id = dom_tree[i].getAttribute('data-id');
                        break;
                    }
                }
                if(Math.abs(mX)<30 && Math.abs(mY)<30 && now - startT<200 && id != null){
                    fun(id);
                }
            };
        if(el.nodeType == 1){
            el.addEventListener('touchstart',start, false);
            el.addEventListener('touchend',end, false);
        }
    };
    this.touch = function(el,done){
        var startX,
            startY,
            start = function(event){
                var  e = event || window.event;
                startX = e.touches[0].pageX;
                startY = e.touches[0].pageY;
            },
            end = function(event){
                var  e = event || window.event,
                    mX = e.changedTouches[0].pageX - startX,
                    mY = e.changedTouches[0].pageY - startY;
                    done(mX,mY);
            };
            if(el.nodeType == 1){
                el.addEventListener('touchstart',start, false);
                el.addEventListener('touchend',end, false);
            }
    };
    self.touchtap(document.getElementById('list-container'),function(index){
        self.index(index);
    });
    self.touch(
        document.getElementById('touch-zone'),
        function(mx,my){
            if(Math.abs(my)<50 && Math.abs(mx)>50){
                if(mx<0){
                    self.next()
                }
                else{
                    self.prev();
                }
            }
        }
    );
    self.data_call();
}).call(define('view_sd'));

(function(){
    var self = this;

    this.framework =  avalon.define("stars-list", function (vm) {
        vm.list = [];
    });
    this.data_render = function(data){
        var ret = data || {};
        for(var i in ret){
            ret[i].intention = ret[i].vc_list.length;
            //ret[i].link = base_protocol+ret[i].id+'.'+base_host;
            ret[i].link ='/startup/'+ret[i].id;
            ret[i].district = ret[i].region == ''?'全国':ret[i].region.split(' ').splice(0,2).join(' · ');
            ret[i].industry = ret[i].industry.slice(0,24).split(' ').join(' · ');
        }
        return ret;
    };
    this.data_call = function(){
        var data = JSON.parse('{"regionid":"","pageindex":1,"total":145,"list":[{"concept":"\u505c\u8f66\u5b9d\uff1a\u4e3a\u7269\u4e1a\u548c\u8f66\u4e3b\u63d0\u4f9b\u4e0e\u667a\u80fd\u505c\u8f66\u6709\u5173\u7684\u4e00\u7ad9\u5f0f\u670d\u52a1","image":"http://dn-ac-sd.qbox.me/13357344.jpg?imageMogr2/thumbnail/600x","shareurl":"http://s.pe.vc/Q-T","coinveststatus":60,"creatorid":13357178,"logo":"http://dn-xswe.qbox.me/13357340?imageMogr2/thumbnail/240x","id":"13357344","vc_list":["\u674e\u9e4d","\u5218\u82b3","\u53f6\u7fc0"],"finishamount":"14,000,000","member_count":5,"remaind_count":5,"viewapply":0,"isfans":"0","is_sd":true,"financingid":"","creatorphone":"","region":"江苏 南京 秦淮区","day":0,"stage":"已有用户","name":"\u505c\u8f66\u5b9d","industry":"\u79fb\u52a8\u652f\u4ed8 \u5171\u4eab\u7ecf\u6d4e \u667a\u80fd\u786c\u4ef6 \u8f66\u540e\u5e02\u573a \u4fe1\u606f\u6280\u672f","allow_submit_count":5,"vc_count":3,"amount":"10,000,000","is_meet":0,"creatorname":"\u4fde\u6d77\u534e","canview":1},{"concept":"\u7eb3\u7c73\u7ea4\u7ef4\u819c\u5de5\u4e1a\u5316\u751f\u4ea7","image":"http://dn-ac-sd.qbox.me/13359568.jpg?imageMogr2/thumbnail/600x","shareurl":"http://s.pe.vc/Q-U","coinveststatus":60,"creatorid":13359566,"logo":"http://dn-xswe.qbox.me/13359567?imageMogr2/thumbnail/240x","id":"13359568","vc_list":["\u6768\u6653\u654f","\u767d\u5cf0","\u5218\u82b3"],"finishamount":"40,000,000","member_count":1,"remaind_count":5,"viewapply":0,"isfans":"0","is_sd":true,"financingid":"","creatorphone":"","region":"江苏 苏州","day":0,"stage":"正式发布","name":"\u767e\u535a\u4e1d","industry":"\u65b0\u80fd\u6e90/\u6750\u6599","allow_submit_count":5,"vc_count":3,"amount":"50,000,000","is_meet":0,"creatorname":"\u4f55\u5409\u6b22","canview":1},{"concept":"\u901a\u8fc73d\u6253\u5370\u6280\u672f\u4e3a\u8001\u4eba\u548c\u513f\u7ae5\u63d0\u4f9b\u8425\u517b\u5747\u8861\u81b3\u98df","image":"http://dn-ac-sd.qbox.me/13354519.jpg?imageMogr2/thumbnail/600x","shareurl":"http://s.pe.vc/Q2z","coinveststatus":40,"creatorid":13354501,"logo":"http://dn-xswe.qbox.me/13354505?imageMogr2/thumbnail/240x","id":"13354519","vc_list":[],"finishamount":"0","member_count":1,"remaind_count":5,"viewapply":0,"isfans":"1","is_sd":true,"financingid":"","creatorphone":"","region":"浙江 杭州 西湖区","day":0,"stage":"已有收入","name":"\u81b3\u98df3D\u6253\u5370","industry":"\u667a\u80fd\u786c\u4ef6 \u521b\u610f\u4ea7\u54c1 \u667a\u80fd\u5bb6\u5c45","allow_submit_count":5,"vc_count":0,"amount":"1,500,000","is_meet":0,"creatorname":"\u674e\u666f\u5143","canview":1},{"concept":"\u9996\u5bb6\u9762\u5411\u767d\u9886\u5973\u6027\u7684\u54c1\u724c\u670d\u88c5\u7ebf\u4e0b\u5bfc\u8d2d\u5e73\u53f0","image":"http://dn-ac-sd.qbox.me/13035620.jpg?imageMogr2/thumbnail/600x","shareurl":"http://s.pe.vc/Kv2","coinveststatus":40,"creatorid":12846974,"logo":"http://dn-xswe.qbox.me/13035617?imageMogr2/thumbnail/240x","id":"13035620","vc_list":[],"finishamount":"0","member_count":3,"remaind_count":5,"viewapply":0,"isfans":"0","is_sd":true,"financingid":"","creatorphone":"","region":"上海 长宁区","day":0,"stage":"研发阶段","name":"\u9c9c\u6a59\u7231\u7f8e\u8863","industry":"\u79fb\u52a8\u4e92\u8054\u7f51 \u5e73\u53f0 \u751f\u6d3b\u670d\u52a1 \u7535\u5b50\u5546\u52a1","allow_submit_count":5,"vc_count":0,"amount":"5,000,000","is_meet":0,"creatorname":"\u8d75\u4e1c","canview":1},{"concept":"\u8de8\u5883\u5206\u9500\u66f4\u5bb9\u6613\uff0c\u4ea7\u54c1\u6ea2\u4ef7\u66f4\u8f7b\u677e\u3002","image":"http://dn-ac-sd.qbox.me/13356387.jpg?imageMogr2/thumbnail/600x","shareurl":"http://s.pe.vc/Q20","coinveststatus":40,"creatorid":13356377,"logo":"http://dn-xswe.qbox.me/13356378?imageMogr2/thumbnail/240x","id":"13356387","vc_list":[],"finishamount":"0","member_count":1,"remaind_count":5,"viewapply":0,"isfans":"0","is_sd":true,"financingid":"","creatorphone":"","region":"浙江 杭州","day":0,"stage":"正式发布","name":"\u6fb3\u535a\u73af\u7403\u8de8\u5883\u7535\u5546","industry":"B2B B2C \u7efc\u5408\u5e73\u53f0 \u793e\u4ea4\u7535\u5546 \u5782\u76f4\u7535\u5546","allow_submit_count":5,"vc_count":0,"amount":"3,000,000","is_meet":0,"creatorname":"\u97e9\u5409\u9633","canview":1},{"concept":"\u5e2e\u52a9\u4ea7\u4e1a\u56ed\u533a\u548c\u5199\u5b57\u697c\u63d0\u5347\u4ef7\u503c","image":"http://dn-ac-sd.qbox.me/13357005.jpg?imageMogr2/thumbnail/600x","shareurl":"http://s.pe.vc/Q7Y","coinveststatus":40,"creatorid":12878358,"logo":"http://dn-xswe.qbox.me/13357004?imageMogr2/thumbnail/240x","id":"13357005","vc_list":[],"finishamount":"0","member_count":6,"remaind_count":5,"viewapply":0,"isfans":"0","is_sd":true,"financingid":"","creatorphone":"","region":"北京 丰台区","day":0,"stage":"已有收入","name":"\u840c\u7ad9","industry":"\u5e7f\u544a\u8425\u9500 \u4f01\u4e1a\u670d\u52a1 \u751f\u6d3b\u670d\u52a1","allow_submit_count":5,"vc_count":0,"amount":"6,000,000","is_meet":0,"creatorname":"\u5c39\u6653\u4e1c","canview":1},{"concept":"\u65c5\u6e38\u4ea7\u54c1\u4f9b\u7ed9\u7aef\u7684\u4e00\u7ad9\u5f0f\u5b75\u5316\u5e73\u53f0","image":"http://dn-ac-sd.qbox.me/13356271.jpg?imageMogr2/thumbnail/600x","shareurl":"http://s.pe.vc/Q22","coinveststatus":40,"creatorid":13323189,"logo":"http://dn-xswe.qbox.me/13356266?imageMogr2/thumbnail/240x","id":"13356271","vc_list":[],"finishamount":"0","member_count":1,"remaind_count":5,"viewapply":0,"isfans":"0","is_sd":true,"financingid":"","creatorphone":"","region":"浙江 宁波 镇海区","day":0,"stage":"研发阶段","name":"\u9a74\u4eab\u6d3e","industry":"\u65c5\u6e38 \u4fe1\u606f\u6280\u672f O2O \u4f01\u4e1a\u670d\u52a1 \u8bbe\u8ba1","allow_submit_count":5,"vc_count":0,"amount":"3,000,000","is_meet":0,"creatorname":"\u9b4f\u6653\u521a","canview":1},{"concept":"\u89c1\u5927\u5496\u4e00\u9762\uff0c\u5c11\u594b\u6597\u5341\u5e74","image":"http://dn-ac-sd.qbox.me/13066858.jpg?imageMogr2/thumbnail/600x","shareurl":"http://s.pe.vc/Q23","coinveststatus":40,"creatorid":13066848,"logo":"http://dn-xswe.qbox.me/13355772?imageMogr2/thumbnail/240x","id":"13066858","vc_list":[],"finishamount":"0","member_count":1,"remaind_count":5,"viewapply":0,"isfans":"0","is_sd":true,"financingid":"","creatorphone":"","region":"北京 朝阳区","day":0,"stage":"已有收入","name":"\u5927\u5496\u95e8","industry":"\u79fb\u52a8\u793e\u4ea4 \u5728\u7ebf\u6559\u80b2 \u54a8\u8be2\u670d\u52a1 \u793e\u4ea4\u7f51\u7edc","allow_submit_count":5,"vc_count":0,"amount":"3,000,000","is_meet":0,"creatorname":"\u848b\u88d5\u534e","canview":1},{"concept":"\u4e00\u4e2a\u8ba9\u9500\u552e\u53ea\u970010\u79d2\u5c31\u80fd\u4e86\u89e3\u5ba2\u6237\u813e\u6027\u7684\u9500\u552e\u8f6f\u4ef6","image":"http://dn-ac-sd.qbox.me/13295534.jpg?imageMogr2/thumbnail/600x","shareurl":"http://s.pe.vc/O2a","coinveststatus":40,"creatorid":13295479,"logo":"http://dn-xswe.qbox.me/13297708?imageMogr2/thumbnail/240x","id":"13295534","vc_list":[],"finishamount":"0","member_count":6,"remaind_count":5,"viewapply":0,"isfans":"0","is_sd":true,"financingid":"","creatorphone":"","region":"上海 普陀区","day":0,"stage":"研发阶段","name":"\u591a\u9500 TOPSALES365","industry":"\u79fb\u52a8\u529e\u516c \u7ba1\u7406\u5de5\u5177 \u4f01\u4e1a\u7ea7\u79fb\u52a8\u5e94\u7528 \u4f01\u4e1a\u5de5\u5177 \u4e2a\u4eba\u5de5\u5177","allow_submit_count":5,"vc_count":0,"amount":"2,000,000","is_meet":0,"creatorname":"\u5f90\u4eae\u5f67","canview":1},{"concept":"\u597d\u73a9\u7ecf\u6d4e\u7684\u56fd\u9645\u822a\u73ed\u4eba\u8089\u5feb\u9012\uff0c\u6210\u529f\u521b\u4e1a\u7ecf\u5386\u7684\u6d77\u5916\u56e2\u961f","image":"http://dn-ac-sd.qbox.me/13173260.jpg?imageMogr2/thumbnail/600x","shareurl":"http://s.pe.vc/Q24","coinveststatus":40,"creatorid":13101672,"logo":"http://dn-xswe.qbox.me/13339374?imageMogr2/thumbnail/240x","id":"13173260","vc_list":[],"finishamount":"0","member_count":1,"remaind_count":5,"viewapply":0,"isfans":"0","is_sd":true,"financingid":"","creatorphone":"","region":"浙江 杭州 滨江区","day":0,"stage":"正式发布","name":"\u7a7a\u4e2d\u98de\u4eba","industry":"\u79fb\u52a8\u793e\u4ea4 \u5728\u7ebf\u65c5\u6e38 \u793e\u4ea4\u7f51\u7edc","allow_submit_count":5,"vc_count":0,"amount":"3,000,000","is_meet":0,"creatorname":"\u6613\u9645\u8d8a","canview":1}],"industryid":""}');
        if(data.list){
            self.framework.list = self.data_render(data.list);
        }
    };
    self.data_call();
    //this.get_sd = page_base.get_data(page_base.api.stars,self.data_call,{pagesize:10,pageindex:2,w:600,state:'online',industryid:'',regionid:''});


}).call(define('view_stars'));

(function(){
    var self = this,
        data = [{logo:'http://dn-acac.qbox.me/index/daixiaomi_logo.svg',name:'创始人：焦可',img:'http://dn-acac.qbox.me/mobile/homepage/daixiaomi_mobile.png',desc:'2013.10注册天使汇，10.18完成300万天使轮融资，2014.8获晨兴创投A轮融资，额度500万美金。',tips:[{img:'http://dn-acac.qbox.me/v1/icon/icon_info.svg',title:'项目信息完善指导',desc:'帮助项目打磨天使汇展现页面'},{img:'http://dn-acac.qbox.me/v1/icon/icon_bp.svg',title:'融资BP指导',desc:'商业计划书模板下载和指导'},{img:'http://dn-acac.qbox.me/v1/icon/icon_company.svg',title:'足不出户开公司',desc:'一站式在线注册公司'},{img:'http://dn-acac.qbox.me/v1/icon/icon_speeddating.svg',title:'闪投私密线下路演',desc:'一次路演，约见50位投资人'}]},{logo:'http://dn-acac.qbox.me/index/xitu_logo.svg',name:'创始人：阴明',img:'http://dn-acac.qbox.me/mobile/homepage/xitu_mobile.png',desc:'2014.12入驻天使汇100X加速器，2014.12.18参加私密路演，当日收获数份投资意向，次日完成数百万天使轮融。',tips:[{img:'http://dn-acac.qbox.me/v1/icon/icon_analysis.svg',title:'投资人分析服务',desc:'帮助您选择最合适的投资人'},{img:'http://dn-acac.qbox.me/v1/icon/icon_term.svg',title:'投资条款指导',desc:'最大限度保证创业者的权益'},{img:'http://dn-acac.qbox.me/v1/icon/icon_partner.svg',title:'创建有限合伙公司',desc:'避免繁杂流程，高效完成融资'},{img:'http://dn-acac.qbox.me/v1/icon/icon_party.svg',title:'举办融资庆祝Party',desc:'与投资人建立更紧密的友谊'}]}];
    this.framework =  function() {
        return avalon.define("resource", function (vm) {
            vm.data = {};
        });
    };
    this.framework().data = data[new Date().getTime()%2];
}).call(define('view_resource'));

(function(){
    var self = this,
        data=[{name:'创始人:陈驰',desc:'#在天使汇#从0到1，小猪短租用了三年时间。无论面对任何质疑和嘲笑，天使汇一直都和我们站在同一边。相信每一位和我们一样坚信自己，坚持勇气的创业者，在这里都能实现自己的梦想。',logo:'http://dn-acac.qbox.me/index/xiaozhuduanzu_logo.svg',img:'http://dn-acac.qbox.me/mobile/homepage/xiaozhu_mobile.png?1',detail:{link:'/startup/10913645',name:'C轮融资6000W美金的行业龙头，查看详情'}},{name:'创始人:黄浩',desc:'#在天使汇#4个月的时间从天使走到A轮，天使汇的专业服务让我轻松搞定了很多繁复的法律文件和融资条款，让我能安心地打磨和改进产品，快速成长，这是我接触过的最懂创业者的平台。',logo:'http://dn-acac.qbox.me/index/quchaogu_logo@2X.png',img:'http://dn-acac.qbox.me/mobile/homepage/quchaogu_mobile.png',detail:{link:'/startup/12906186',name:'4个月估值提升20倍，查看详情'}},{name:'创始人:彭程',desc:'#在天使汇#在创业刚开始就接触到天使汇是我的幸运，在这里我不仅融到了资金，更得到了投资人从方向到资源方方面面的支持。仅仅3个月，我的项目就领跑了垂直领域，我的投资人也得到了几十倍的回报。',logo:'http://dn-acac.qbox.me/index/haoche_logo@2X.png',img:'http://dn-acac.qbox.me/mobile/homepage/haoche_mobile.png?',detail:{link:'/startup/12918181',name:'从0开始3个月融资2000万美金，查看详情'}}];
    this.framework =  function() {
        return avalon.define("after", function (vm) {
            vm.data = {};
        });
    };
    this.framework().data = data[new Date().getTime()%3];
}).call(define('view_after'));
/*天使汇跟投基金*/
(function(){
    var self = this,
        localstorage_key = 'jijin',
        dom  = document.getElementById('jijin'),
        href = "http://t.cn/RU4ni0i",
        touch = {
            x:0,
            y:0,
            t:0
        };
    this.save_key = function(){
        window.save_cookie(localstorage_key,true);
    };
    this.is_exist_key = function(){
        return window.get_cookie(localstorage_key);
    };
    this.event_fun = function(ret){
        self.save_key();
        if(ret){
            location.href = href;
        }
        else{
            $(dom).fadeOut(200);
        }
    };
    this.start = function(event){
        var  e = event || window.event;
        touch.x= e.touches[0].pageX;
        touch.y= e.touches[0].pageY;
        touch.t = new Date().getTime();
    };

    this.end = function(event){
        var  e = event || window.event,
            move=Math.pow(e.pageX-touch.x,2)+Math.pow(e.pageY-touch.y,2),
            o = new Date().getTime(),
            target = e.target || e.srcElement,
            dom_tree = [target,target.parentNode,target.parentNode.parentNode],ret = false;
        for(var i in dom_tree){
            if(dom_tree[i].hasAttribute('is-entry')){
                ret = true;
                break;
            }
        }
        if(o-touch.t<150 && move<81 && ret){
            self.event_fun(ret);
        }
        else{
            self.event_fun(ret);
        }
    };
    if(!self.is_exist_key() || $_GET.hasOwnProperty('jijin')){
        $(dom).show();
    }
    dom.addEventListener('touchstart',self.start, false);
    dom.addEventListener('touchend',self.end, false);
}).call(_define('view_jijin'));

