var elixir = require('laravel-elixir');

//关闭SourceMap
elixir.config.sourcemaps = false;
/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Sass
 | file for our application, as well as publishing vendor resources.
 |
 */
elixir(function(mix) {



    //首页CSS
    mix.styles([
        'base.css',
        'homepage.css'
    ],'public/css/homepage.css');

    //首页JS
    mix.scripts([
        'jquery.js',
        'avalon.js',
        'base.js',
        'circle.js',
        'homepage.js'
    ], 'public/js/homepage.js');

    //项目CSS
    mix.styles([
        'base.css',
        'list_style.css',
        'project.css'
    ],'public/css/project.css');

    //项目JS
    mix.scripts([
        'jquery.js',
        'avalon.js',
        'base.js',
        'onepage.js',
        'startup_list.js'
    ], 'public/js/project.js');

    //项目详情CSS
    mix.styles([
        'base.css',
        'detail.css'
    ],'public/css/detail.css');

    //项目详情JS
    mix.scripts([
        'jquery.js',
        'avalon.js',
        'base.js',
        'qrcode.js',
        'detail.js'
    ], 'public/js/detail.js');

    //项目BP CSS
    mix.styles([
        'bp.css'
    ],'public/css/bp.css');

    //项目BP JS
    mix.scripts([
        'jquery.js',
        'base.js',
        'bp.js'
    ], 'public/js/bp.js');

    //项目创建 CSS
    mix.styles([
        'base.css',
        'create.css'
    ],'public/css/create.css');

    //项目创建 JS
    mix.scripts([
        'jquery.js',
        'avalon.js',
        'base.js',
        'upload.js',
        'create.js'
    ], 'public/js/create.js');

    //项目意向CSS
    mix.styles([
        'base.css',
        'detail.css',
        'investment.css'
    ],'public/css/investment.css');

    //项目意向JS
    mix.scripts([
        'jquery.js',
        'avalon.js',
        'base.js',
        'investment.js'
    ], 'public/js/investment.js');

    //投资人CSS
    mix.styles([
        'base.css',
        'list_style.css',
        'investor_list.css'
    ],'public/css/investors.css');

    //投资人JS
    mix.scripts([
        'jquery.js',
        'avalon.js',
        'base.js',
        'onepage.js',
        'investor_list.js'
    ], 'public/js/investors.js');

    //投资人CSS
    mix.styles([
        'base.css',
        'user_detail.css'
    ],'public/css/userdetail.css');

    //投资人JS
    mix.scripts([
        'jquery.js',
        'avalon.js',
        'base.js',
        'qrcode.js',
        'investor_detail.js'
    ], 'public/js/userdetail.js');

    //登录CSS
    mix.styles([
        'base.css',
        'login.css'
    ],'public/css/login.css');

    //登录JS
    mix.scripts([
        'jquery.js',
        'avalon.js',
        'base.js',
        'login.js'
    ], 'public/js/login.js');

    //注册CSS
    mix.styles([
        'base.css',
        'regist.css'
    ],'public/css/regist.css');

    //注册JS
    mix.scripts([
        'jquery.js',
        'avalon.js',
        'base.js',
        'regist.js'
    ], 'public/js/regist.js');

    //资料CSS
    mix.styles([
        'base.css',
        'profile.css'
    ],'public/css/profile.css');

    //资料JS
    mix.scripts([
        'jquery.js',
        'avalon.js',
        'base.js',
        'upload.js',
        'profile.js'
    ], 'public/js/profile.js');

    //版本控制
    mix.version([
        'public/css/homepage.css',
        'public/js/homepage.js',
        'public/css/project.css',
        'public/js/project.js',
        'public/css/detail.css',
        'public/js/detail.js',
        'public/css/bp.css',
        'public/js/bp.js',
        'public/css/create.css',
        'public/js/create.js',
        'public/css/investment.css',
        'public/js/investment.js',
        'public/css/investors.css',
        'public/js/investors.js',
        'public/css/userdetail.css',
        'public/js/userdetail.js',
        'public/css/login.css',
        'public/js/login.js',
        'public/css/regist.css',
        'public/js/regist.js',
        'public/css/profile.css',
        'public/js/profile.js'

    ]);

});