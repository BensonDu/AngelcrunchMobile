//WebAPP 统一关键词 描述
var keywords    = "天使汇,天使汇官网,天使合投平台,天使投资,创业VC投资";
var description = "【1亿元跟投指数基金跟投你的创业项目正在进行时】中关村创业大街管理委员会明星企业。3400位优质天使投资人17万名激情创业者都在天使汇聚集。";
var request = require('request');
//首页
exports.homepage = {
    index : function(req, res) {
        //res.redirect('/m/');
        res.render('homepage/index',{
            title:'天使汇官网 让靠谱的项目找到靠谱的钱 | 天使投资 | 创业VC |天使合投平台',
            keywords:keywords,
            description:description
        });
    }
};

//项目
exports.startup = {
    //项目列表
    index : function(req, res) {
        res.render('startup/index',{
            title:'天使汇 | 项目列表 | 让靠谱的项目找到靠谱的钱',
            keywords:keywords,
            description:description
        });
    },
    //项目详情
    detail:function(req, res) {
        res.render('startup/detail', {
            title: '天使汇 | 项目详情 | 让靠谱的项目找到靠谱的钱',
            keywords: keywords,
            description: description
        });
    },
    //发送投资意向
    investment:function(req, res) {
        res.render('startup/investment', {
            title: '天使汇 | 发送投资意向 | 让靠谱的项目找到靠谱的钱',
            keywords: keywords,
            description: description
        });
    },
    //项目创建
    create:function(req, res) {
        res.render('startup/create', {
            title: '天使汇 | 创建项目 | 让靠谱的项目找到靠谱的钱',
            keywords: keywords,
            description: description
        });
    },
    //商业计划书
    bp:function(req, res) {
        res.render('startup/bp', {
            title: '天使汇 | 商业计划书 | 让靠谱的项目找到靠谱的钱',
            keywords: keywords,
            description: description
        });
    }
};

//创业者
exports.entrepreneur = {
    //创业者详情
    detail : function(req, res){
        res.render('entrepreneur/detail', {
            title: '天使汇 | 创业者详情 | 让靠谱的项目找到靠谱的钱',
            keywords: keywords,
            description: description
        });
    }
};

//投资人
exports.investor = {
    //投资人列表
    index : function(req, res){
        res.render('investor/index', {
            title: '天使汇 | 投资人列表 | 让靠谱的项目找到靠谱的钱',
            keywords: keywords,
            description: description
        });
    },
    //投资人详情
    detail : function(req, res){
        res.render('investor/detail', {
            title: '天使汇 | 投资人列表 | 让靠谱的项目找到靠谱的钱',
            keywords: keywords,
            description: description
        });
    },
    //投资人申请
    active : function(req, res){
        res.render('investor/active', {});
    },
    //投资人注册
    regist : function(req, res){
        res.render('investor/regist', {});
    }
};

//账户
exports.account = {
    //登录
    login : function(req, res) {
        res.render('account/login',{
            title:'天使汇 | 登录 | 让靠谱的项目找到靠谱的钱',
            keywords:keywords,
            description:description
        });
    },
    //注册
    regist : function(req, res) {
        res.render('account/regist',{
            title:'天使汇 | 注册 | 让靠谱的项目找到靠谱的钱',
            keywords:keywords,
            description:description
        });
    },
    //个人中心
    profile : function(req, res) {
        res.render('account/profile',{
            title:'天使汇 | 个人中心 | 让靠谱的项目找到靠谱的钱',
            keywords:keywords,
            description:description
        });
    }
};

//文章
exports.article = {
    //文章详情
    detail : function(req, res) {
        var id  = req.params.id,
            uid = !!req.query.uid ? '&uid='+req.query.uid:'',
            url = 'http://api.angelcrunch.com/v1/article/detail?id='+id+uid,
            data = {},
            from_app = !!req.query.access_token || /angelcrunch/.test(req.headers['user-agent'].toLowerCase());
        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                data = JSON.parse(body).data;
                res.render('article/detail',{
                    title : data.title,
                    author : data.author,
                    time : data.time,
                    content : data.content,
                    from_app : from_app
                });
            }
        });
    }
};

//协议
exports.agreement = {
    //
    index : function(req, res) {
        var rules = {
                qualified : 'f4b4079a-e83a-4dc6-acae-0f7dc36c4d9a',
                online : '9154cd22-f7a7-4600-92f5-a90151140136',
                risk : 'c34b5023-be98-4b44-979b-bc420ea853fe',
                service : 'd9834e29-dd21-4faa-a86e-f82410fdd3b3',
                price : '5d3cfef3-9a2c-4da5-9bfa-535bb5a4d397'
            },
            id = (!!req.params.name && !!rules[req.params.name]) ? rules[req.params.name] : rules.service,
            uid = !!req.query.uid ? '&uid='+req.query.uid:'',
            url = 'http://api.angelcrunch.com/v1/article/detail?id='+id+uid;

        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                data = JSON.parse(body).data;
                res.render('agreement/index',{
                    title : data.title,
                    author : data.author,
                    time : data.time,
                    content : data.content
                });
            }
        });
    }
};

//APP
exports.app = {
    //BP
    bp : function(req, res) {
        res.render('app/bp',{
            title:'商业计划书',
            keywords:keywords,
            description:description
        });
    },
    //关于
    about : function(req, res) {
        res.render('app/about',{});
    },
    //手机绑定
    bind_phone : function(req, res) {
        res.render('app/bind_phone',{
            title:'手机号码绑定',
            keywords:keywords,
            description:description
        });
    }
};

//帮助页面跳转
exports.help = {
    //帮助首页
    index : function(req, res){
        res.redirect('http://help.angelcrunch.com/sd');
    },
    //帮助服务条款
    service : function(req, res){
        res.redirect('http://help.angelcrunch.com/service');
    }
};

//活动
exports.activity = {
    //
    index : function(req, res) {
        var rules = {
                fund : 'activity/fund',
                jan : 'activity/jan'
            }, 
            view;
        if((!!req.params.name && !!rules[req.params.name])){
            view = rules[req.params.name];
        }
        else{
            res.redirect('http://m.angelcrunch.com/');
        }

        res.render(view,{
            title:'天使汇跟投基金',
            keywords:keywords,
            description:description
        });
    }
};

//专题
exports.special = {
    index : function(req, res) {
        var id = !!req.params.id ? req.params.id : null,
            url = !!id ? 'http://api.angelcrunch.com/v1/special/index?id='+id : null,
            ret,list = [],projectIds = [];
        if(!url)res.status(404).send('Not found');
        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                ret = JSON.parse(body);
                if(!ret.hasOwnProperty('code') || ret.code != 0)res.status(404).send('Not found');
                for(var i in ret.data.list){
                    if(ret.data.list[i].project){
                        for(var m in ret.data.list[i].project){
                            projectIds.push(ret.data.list[i].project[m].id)
                            ret.data.list[i].project[m].like = false;
                            list.push(ret.data.list[i].project[m]);
                        }
                    }
                }
                list = JSON.stringify(list).replace(/'/g, "\\'");
                res.render('v1/special/index', {
                    title:'天使汇 | 专题 | 让靠谱的项目找到靠谱的钱',
                    keywords:keywords,
                    description:description,
                    show : ret.data.show,
                    list : list,
                    specialId : id,
                    projectIds : projectIds
                });
            }
        });

    }
};

//Hybrid测试
exports.hybrid = {

    index : function(req, res) {
        res.render('v1/hybrid', {
            title:'Hyrbid测试',
            keywords:'',
            description:''
        });
    }

};

//闪投快捷通道
exports.sd = {

    detail : function(req, res) {
        res.render('sd/detail', {});
    },

    investment : function(req, res) {
        res.render('sd/investment', {});
    },

    bp : function(req, res) {
        res.render('sd/bp', {});
    }

};

//现场快捷通道
exports.sd_event = {

    detail : function(req, res) {
        res.render('sd_event/detail', {});
    },

    investment : function(req, res) {
        res.render('sd_event/investment', {});
    }

};

//临时或之前遗留
exports.old = {
    //投资人认证成功
    angel_success : function(req, res){
        res.render('old/angel_success',{
            title:'天使汇 | 成功提交投资意向 | 让靠谱的项目找到靠谱的钱',
            keywords:keywords,
            description:description
        });
    },
    //风险揭示书
    risk_agreement : function(req, res){
        res.render('old/risk_agreement',{
            title:'天使汇 | 风险揭示书 | 让靠谱的项目找到靠谱的钱',
            keywords:keywords,
            description:description
        });
    },
    //报名闪投
    reg_sd : function(req, res){
        res.render('old/reg_sd',{
            title:'天使汇 | 报名闪投 | 让靠谱的项目找到靠谱的钱',
            keywords:keywords,
            description:description
        });
    },
    //报名闪投成功
    reg_sd_success : function(req, res){
        res.render('old/reg_sd_success',{
            title:'天使汇 | 报名闪投成功 | 让靠谱的项目找到靠谱的钱',
            keywords:keywords,
            description:description
        });
    }
};