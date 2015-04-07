/*/
/*
/* Rank: 3
/* Wap site cookie operation
/* Rely on jquery files
/*
/*/

// Module Initialize
$(function () {
    (function () {
        var ua = navigator.userAgent.toLowerCase();
        var isAndroid = ua.indexOf("android") != -1 ? 1 : 0
        , isWeixin = ua.indexOf("micromessenger") != -1 ? 1 : 0;

        if (isWeixin) {
            if (isAndroid) $("#wechat-tag").removeClass("download-ios").addClass("download-android");
            $(".wechat2browser").click(function () {
                if ($(this).attr("data-donot-showinwechat")
                    && !$("#wechat-tag").hasClass("download-android")) {
                    $(this).attr("data-confirm-donot-redirect", "true");
                    return false;
                }
                $("#wechat-tag").fadeIn();
                $(this).attr("data-confirm-donot-redirect", "true");
                return false;
            });
        }

        $("#wechat-tag").click(function () {
            $(this).fadeOut();
        })
    }).call(this);
})