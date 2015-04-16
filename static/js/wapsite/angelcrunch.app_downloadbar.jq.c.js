/*/
/*
/* Rank: 3
/* App download banner and moblie browser module
/* Rely on jquery & cookie files
/*
/*/

// Angelcrunch namespace
$.Angelcrunch = $.Angelcrunch || {};

// iOS and Android Browser
(function () {
    var ua = navigator.userAgent.toLowerCase();
    var $COOKIE = $.Angelcrunch.COOKIE;
    var Browser = {
        isAndorid: ua.indexOf("android") != -1 ? 1 : 0,
        isiOS: !!ua.match(/\(i[^;]+;( u;)? cpu.+mac os x/),
        isiPhone: ua.indexOf('iphone') > -1 || ua.indexOf('mac') > -1,
        isiPad: ua.indexOf('ipad') > -1,

        isWeChat: ua.indexOf("micromessenger") != -1 ? 1 : 0
    };

    var CreateAppBanner = function () {
        var $body = $("body");
        if ($(".app-dowaload-banner").length) return 0;
        var $bar = $('<div class="app-dowaload-banner">' +
                        '<div class="close">×</div>' +
                        '<div class="logo ci-link" data-href="/html/homepage.html"></div>' +
                        '<div class="desc">' +
                            '<h3>天使汇</h3>' +
                            '<p>实时获得投融资最好的机会！</p>' +
                        '</div>' +
                        '<div class="download-rs">' +
                            '<button class="btn">下载App</button>' +
                        '</div>' +
                    '</div>');
        var $layer = $('<div class="download-ios" id="wechat-tag"></div>');
        $body.prepend($bar);
        $bar.delay(400).slideDown(700);

        $body.append($layer);
        $layer.click(function () {
            $(this).fadeOut();
        }).addClass("download-android");



        $bar.find(".close").click(function () {
            $bar.slideUp(400);
            $COOKIE ? $COOKIE.operation.setAppdownloadBarNotExist(2) : "";
        });

        $bar.find(".download-rs .btn").click(function () {
            if (Browser.isWeChat && Browser.isAndorid) {
                $layer.fadeIn()
                return 0;
            }
            location.href = "//angelcrunch.com/app";

            //$COOKIE ? $COOKIE.operation.setAppdownloadBarNotExist(7) : "";
        });
    };

    $.Angelcrunch.Browser = $.Angelcrunch.Browser || {};
    $.extend(true, $.Angelcrunch.Browser, Browser);

    $.Angelcrunch.appDownloadBanner = function () {
        if (!($COOKIE ? $COOKIE.operation.isShowAppdownloadBar() : "show")) return 0;
        var ios_app_id = "964026737";
        if (Browser.isWeChat) {
            CreateAppBanner();
        } else if (Browser.isiOS) {
            $("head meta:last").after('<meta name="apple-itunes-app" content="app-id=' + ios_app_id + '" />');
        } else {
            CreateAppBanner();
        }
    };
}).call(this);


$(function () {
    $.Angelcrunch.appDownloadBanner();
});