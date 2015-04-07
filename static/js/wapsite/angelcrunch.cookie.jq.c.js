/*/
/*
/* Rank: 3
/* Wap site cookie operation
/* Rely on jquery files
/*
/*/
!function (a) { "function" == typeof define && define.amd ? define(["jquery"], a) : "object" == typeof exports ? a(require("jquery")) : a(jQuery) }(function (a) { function c(a) { return h.raw ? a : encodeURIComponent(a) } function d(a) { return h.raw ? a : decodeURIComponent(a) } function e(a) { return c(h.json ? JSON.stringify(a) : String(a)) } function f(a) { 0 === a.indexOf('"') && (a = a.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\")); try { return a = decodeURIComponent(a.replace(b, " ")), h.json ? JSON.parse(a) : a } catch (c) { } } function g(b, c) { var d = h.raw ? b : f(b); return a.isFunction(c) ? c(d) : d } var b = /\+/g, h = a.cookie = function (b, f, i) { if (void 0 !== f && !a.isFunction(f)) { if (i = a.extend({}, h.defaults, i), "number" == typeof i.expires) { var j = i.expires, k = i.expires = new Date; k.setTime(+k + 864e5 * j) } return document.cookie = [c(b), "=", e(f), i.expires ? "; expires=" + i.expires.toUTCString() : "", i.path ? "; path=" + i.path : "", i.domain ? "; domain=" + i.domain : "", i.secure ? "; secure" : ""].join("") } for (var l = b ? void 0 : {}, m = document.cookie ? document.cookie.split("; ") : [], n = 0, o = m.length; o > n; n++) { var p = m[n].split("="), q = d(p.shift()), r = p.join("="); if (b && b === q) { l = g(r, f); break } b || void 0 === (r = g(r)) || (l[q] = r) } return l }; h.defaults = {}, a.removeCookie = function (b, c) { return void 0 === a.cookie(b) ? !1 : (a.cookie(b, "", a.extend({}, c, { expires: -1 })), !a.cookie(b)) } });

// Angelcrunch namespace
$.Angelcrunch = $.Angelcrunch || {};

(function () {
    var $COOKIE, $dataSet;
    $dataSet = $.Angelcrunch.dataSet;
    $COOKIE = $.Angelcrunch.COOKIE = $.Angelcrunch.COOKIE || {};
    $COOKIE.cookieName = {
        user_id: "uid",
        token: "access_token",
        defaultpart: "defaultpart",
        detailsPageTipsNotView: "DP_TipsNotView",
        withoutAppDownloadBanner: "WAD_DLB"
    };

    $COOKIE.settings = { expires: 7, path: "/", secure: false };
    var domain = location.host.match(/.+\.(.+\.[a-zA-Z0-9]+)/);
    if (domain) $COOKIE.settings.domain = domain[1];

    $COOKIE.operation = {
        setUserKey: function () {
            $.cookie($COOKIE.cookieName.user_id,
                     $dataSet.Model.user.id,
                     $COOKIE.settings);
            $.cookie($COOKIE.cookieName.token,
                     $dataSet.Model.user.access_token,
                     $COOKIE.settings);
            $.cookie($COOKIE.cookieName.defaultpart,
                     $dataSet.Model.user.defaultpart,
                     $COOKIE.settings);
            $.cookie($COOKIE.cookieName.detailsPageTipsNotView,
                     true,
                     $COOKIE.settings);
        },
        setAppdownloadBarNotExist: function (days) {
            var settings = {};
            $.extend(true, settings, $COOKIE.settings);
            settings.expires = days || 3;
            $.cookie($COOKIE.cookieName.withoutAppDownloadBanner,
                     true,
                     settings);
        },
        clearUserKey: function () {
            $.removeCookie($COOKIE.cookieName.user_id,
                $COOKIE.settings);
            $.removeCookie($COOKIE.cookieName.token,
                $COOKIE.settings);
            $.removeCookie($COOKIE.cookieName.defaultpart,
                $COOKIE.settings);
        },
        clearDetailsPageViewState: function () {
            $.removeCookie($COOKIE.cookieName.detailsPageTipsNotView,
                $COOKIE.settings);
        },
        isLogin: function () {
            if ($.cookie($COOKIE.cookieName.user_id)
               && $.cookie($COOKIE.cookieName.token)) return true;
            else return false;
        },
        isShowAppdownloadBar: function () {
            if ($.cookie($COOKIE.cookieName.withoutAppDownloadBanner)) return false;
            else return true;
        },
        canViewProjectDetails: function () {
            if ($.cookie($COOKIE.cookieName.defaultpart) > 0)
                return true;
            else return false;
        }
    }
}).call(this);


// Module Initialize
$(function () {
})