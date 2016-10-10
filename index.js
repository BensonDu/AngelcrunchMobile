var express = require('express');
var app = express();
var router = express.Router();
var swig = require('swig');
var controller = require('./controller/index');
// 设定port变量，意为访问端口
app.set('port', 3000);

//设定HTML 模板引擎swig
app.engine('html', swig.renderFile);

app.set('view engine', 'html');

//模板引擎 默认设置
swig.setDefaults({varControls:['{$','$}']});

//设定试图存放目录
app.set('views', __dirname + '/views');

//指定静态资源目录
app.use(express.static('public/build',{ maxAge: 31536000}));

//首页 | 路由
router.get('/', controller.homepage.index);

//项目 | 列表路由
router.get('/startup', controller.startup.index);

//项目 | BP路由
router.get('/startup/bp', controller.startup.bp);

//项目 | 创建路由
router.get('/startup/create/', controller.startup.create);

//项目 | 详情路由
router.get('/startup/:id', controller.startup.detail);

//项目 | 发送投资意向路由
router.get('/startup/:id/investment', controller.startup.investment);

//账户 | 登录路由
router.get('/account/login', controller.account.login);

//账户 | 注册路由
router.get('/account/regist', controller.account.regist);

//账户 | 个人中心路由
router.get('/account/profile', controller.account.profile);

//APP内嵌 | 关于
router.get('/app/about', controller.app.about);

//APP内嵌 | 更改手机绑定
router.get('/app/bind_phone', controller.app.bind_phone);

//APP内嵌 | BP查看
router.get('/app/bp', controller.app.bp);

//Hybrid 测试
router.get('/app/hybrid',controller.hybrid.index);

//创业者 | 路由
router.get('/entrepreneur/:id', controller.entrepreneur.detail);

//投资人 | 路由
router.get('/investor', controller.investor.index);

//投资人申请 | 路由
router.get('/investor/active', controller.investor.active);

//投资人注册 | 路由
router.get('/investor/regist', controller.investor.regist);

//投资人详情 | 路由
router.get('/investor/:id', controller.investor.detail);

//文章详情 | 路由
router.get('/article/:id', controller.article.detail);

//协议 | 路由
router.get('/agreement/:name',controller.agreement.index);

//活动 | 跟投基金
router.get('/activity/:name',controller.activity.index);

//专题页
router.get('/special/:id',controller.special.index);

//闪投快捷通道 | BP
router.get('/sd/bp', controller.sd.bp);

//闪投快捷通道 | 项目详情
router.get('/sd/:id',controller.sd.detail);

//闪投快捷通道 | 发送意向
router.get('/sd/:id/investment',controller.sd.investment);

//现场快捷通道 | BP
router.get('/sd_event/bp', controller.sd.bp);

//现场快捷通道 | 项目详情
router.get('/sd_event/:id',controller.sd_event.detail);

//现场快捷通道 | 发送意向
router.get('/sd_event/:id/investment',controller.sd_event.investment);

//帮助页面 | 首页跳转
router.get('/help',controller.help.index);

//帮助页面 | 服务协议跳转
router.get('/help/service',controller.help.service);

//遗留问题 | 投资人认证 | 不规则路由
router.get('/angel_vip', controller.investor.active);

//遗留问题 | 投资人注册 | 不规则路由
router.get('/angel_vip_simple', controller.investor.regist);

//遗留问题 | 投资人认证成功 | 不规则路由
router.get('/angel_vip_success', controller.old.angel_success);

//遗留问题 | 风险投资协议 | 不规则路由
router.get('/risk_agreement', controller.old.risk_agreement);

//遗留问题 | 报名闪投 | 不规则路由
router.get('/reg_sd', controller.old.reg_sd);

//遗留问题 | 报名闪投成功 | 不规则路由
router.get('/reg_sd_success', controller.old.reg_sd_success);

app.use('/', router);

app.listen(app.get('port'));