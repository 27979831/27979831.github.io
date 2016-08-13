$(function() {
    //搜索框交互
    var 
        placeholder = window.INPUT_PLACEHOLDER || '请输入要搜索的关键词',
        baiduUrl = 'http://www.baidu.com/s?wd=',
        googleUrl = 'http://www.google.com.hk/search?q=',
        searchEl = $('#search');
        
    $('.button', searchEl).on('click', function(e) {
        var 
            keyword = $('.keyword', searchEl).val(),
            url = e.target.name == 'baidu' ? baiduUrl : googleUrl;
        
             
        window.open(url + encodeURIComponent(keyword));
        e.preventDefault();
    });
    
    $('.keyword', searchEl)
    .val(placeholder)
    .on('focus', function(e) {
        var keyword = $(e.target);
        if(keyword.val() == placeholder) {
            keyword.removeClass('default-word').val('');
        }
    })
    .on('blur', function(e) {
        var keyword = $(e.target);
        if(keyword.val() == '') {
            keyword.addClass('default-word').val(placeholder);
        }
    });
    
    //收藏
    $('#header .icon-favor').on('click', function(e) {
        var 
            title = document.title || '设计师网址导航',
            url = window.location.href;
        
        try {
            if(window.sidebar && window.sidebar.addPanel) {
                window.sidebar.addPanel(title, url, '');
            }else if(window.external) {
                window.external.AddFavorite(url, title);
            }else {
                throw 'NOT_SUPPORTED';
            }
        }catch(err) {
            alert('您的浏览器不支持自动收藏，请使用Ctrl+D进行收藏');
        }
    
        e.preventDefault();
    });
    
    //加入首页
    $('#header .icon-homepage').on('click', function(e) {
        try {
            if(window.netscape) {
                netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
                
                Components.classes['@mozilla.org/preferences-service;1']
                .getService(Components. interfaces.nsIPrefBranch)
                .setCharPref('browser.startup.homepage',window.location.href); 
                
                alert('成功设为首页');
                
            }else if(window.external) {
                document.body.style.behavior='url(#default#homepage)';   
                document.body.setHomePage(location.href);
            }else {
                throw 'NOT_SUPPORTED';
            }
        }catch(err) {
            alert('您的浏览器不支持或不允许自动设置首页, 请通过浏览器菜单设置');
        }
    
        e.preventDefault();
    });
    

    //导航区域
    $('#catalog,#website-map').on('click', '.website-list>li, .more-item', function(e) {
        var tarEl = e.target;
        
        if(tarEl.tagName == 'A' && $(tarEl).parents('section.active')[0]) {
            e.stopPropagation();
            
        }else {
            if(tarEl.tagName != 'LI') {
                tarEl = $(tarEl).parents('li')[0];
            }
            
            if(tarEl) {
                var aEl = $('a', tarEl);
                
                if(aEl.length) {
                    var src = aEl.attr('href');
                    
                    if(aEl.attr('target') == '_blank') {
                        window.open(src);
                    }else {
                        location.href = src;
                    }
                }
            }
            
            e.preventDefault();
        }
    });
    
    //快捷导航
    catalogAnimationRunning = false;
    
    function highlightCatalog(target) {
       // *效果1*
       // var listItem = $('li', target);        
      //  for(var i=0; i<6; i++) {
       //      $([listItem[i], listItem[i+6]]).delay(50*i).animate({opacity:0.1},200, function(){
       //         $(this).animate({opacity:1}, 200);
       //     });
       // }
        
        /*效果2*/
      target.addClass('highlight');
       setTimeout(function() {
           target.removeClass('highlight');
       }, 800);
        
        /*效果3*/
       // target.addClass('shake');
        //setTimeout(function() {
        //    target.removeClass('shake');
       // }, 2000);
    }
    
    $('#shortcut nav').on('click', function(e) {
        if(e.target.tagName != 'A') {
            return;
        }

        var keyword = $(e.target).attr('href').slice(1);
        var target = $('section[data-catalog="'+keyword+'"]');
        
        if(target[0] && !catalogAnimationRunning) {
            catalogAnimationRunning = true;
            
            var top = target.offset().top;
            $('html, body').animate({
                scrollTop: top-20
            }, 200, function() {
                highlightCatalog(target);
                catalogAnimationRunning = false;
            });
        }
        
        e.preventDefault();
    });
    
    //热门关键字
    (function() {
        var hotWordCtn = $('#content .tips .hot-words');
        var titleStr = '<b>'+KeywordConfig.title+'</b>';
        var curIndex = 0;
        
        function showHotWord() {
            var html = titleStr;
            for(var i=curIndex; i<KeywordConfig.num+curIndex; i++) {
                if(KeywordConfig.data[i]) {
                    html += '<a href="'+KeywordConfig.data[i].url+'" class="website" target="_blank"><strong>'+KeywordConfig.data[i].kw+'</strong></a>';
                }
            }
            hotWordCtn.empty().append(html);
            
            curIndex += KeywordConfig.num;
            if(curIndex >= KeywordConfig.data.length) {
                curIndex = 0;
            }
            
            var children = hotWordCtn.children();
            for(var i=0; i<children.length; i++) {
                $(children[i]).delay(100*i).animate({opacity:0.1},200, function(){
                    $(this).animate({opacity:1}, 200);
                });
            }
            
            showHotWord.timeout = setTimeout(showHotWord, KeywordConfig.delay*1000);
        }
        
        hotWordCtn.on('mouseenter', function() {
            if(showHotWord.timeout) {
                clearTimeout(showHotWord.timeout);
            }
        }).on('mouseleave', function() {
            showHotWord.timeout = setTimeout(showHotWord, KeywordConfig.delay*1000);
        });
        
        if(hotWordCtn[0] && KeywordConfig) {
            showHotWord();
        }
    })();
    
    //文章序号
    $('#aside .classics-article-list li').each(function(i, item) {
        $(item).css('backgroundPosition', '0 '+(6+i*-50)+'px');
    });
    
    //回顶部
    var goToTopEl = $('#go-to-top');
    $(window).scroll(function() {
        if($(window).scrollTop() >0) {
            goToTopEl.removeClass('hide');
        }else {
            goToTopEl.addClass('hide');
        }
    });
    
});