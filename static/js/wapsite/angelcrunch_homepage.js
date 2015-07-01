//login relatived
(function(){
    this.page_config={
        api_home_link:base_mobile+'v2/wap_home_link'
    };
}).call(this);

//get home link, I don't why they do it by this kind of method;
(function(){
    var $sd         = $(".join--sd"),
        $investor   = $('.reg--investor');
    base_remote_data.ajaxjsonp(page_config.api_home_link,function(data){
        $sd.attr('data-href',data.sd_reg_url || "");
        $investor.attr('data-href',data.angel_apply_url || "");
    },{'user_id':account_info.id});
}).call(this);

//wechat share
(function(){
    var $btn    = $('#wechat-PA'),
        $win    = $('#PA-layer'),
        $close  = $win.children('.close');
    $btn.touchtap(function(){
        $win.fadeIn(200);
    });
    $close.touchtap(function(){
        $win.fadeOut(100);
    });
}).call(this);

//angelcrunch self
(function(){
    return false;
    var $num=$('.countdown'),start= 1435498136428, t, y, e,ss,sss, w, l;

    t=setInterval(function(){
        var now= start-$.now();
        if(now<=0){
            clearInterval(t);
        }
        else{
            var a=Math.floor((start-$.now())/1000),
                h=Math.floor(a/(60*60)),
                m=Math.floor((a=a-60*60*h)/60),
                s=a-m*60;
            if(h>9){
                y=h.toString()[0];
                e=h.toString()[1];
            }
            else{
                y=0;
                e=h;
            }
            if(m>9){
                ss =  m.toString()[0];
                sss=  m.toString()[1];
            }
            else{
                ss= 0;
                sss=m;
            }
            if(s>9){
                w= s.toString()[0];
                l= s.toString()[1];
            }
            else{
                w=0;
                l=s;
            }
            $num.eq(0).html(y);
            $num.eq(1).html(e);
            $num.eq(2).html(ss);
            $num.eq(3).html(sss);
            $num.eq(4).html(w);
            $num.eq(5).html(l);
        }
    },500);
}).call(this);