function log(text){console.log(text)}
//------------对cookie的操作：获取cookie字典；设置修改cookie;-------------------//
        function getCookie(){
                    strcookie=document.cookie;
                    strcookie=strcookie.split(';');
                    var cookie= {};
                    for(var i=0;i<strcookie.length;i++){
                        [name,value]=strcookie[i].trim().split('=');
                        cookie[name]=value;
                    };
                    return cookie;
                }
        function setCookie(name,value){
                    max_age=86400*15;
                    document.cookie=name+'=0;max-age=-1;path=/';
                    document.cookie=name+'='+value+';max-age='+max_age+';path=/';
                };
//------------------对网站主题mode的操作----------------------//
        function executeMode(){
            cookie=getCookie();
            //log('Cookie from executeMode:');log(document.cookie);
            //log('executeMode:'+cookie['mode']);
            if(cookie['mode']==='dark'){
                modeDark();
            }
            else {
                modeNormal();
            }
        }
        function modeDark(){
            elms=$('.mode');
            elms.addClass('dark');
        }
        function getMode(){
            cookie=getCookie();
            return cookie['mode'];
        }
        function modeNormal(){
            elms=$('.mode');
            elms.removeClass('dark');
        }
        function changeMode(name){
            //log('changeMode('+name+')');
            setCookie('mode',name);
            //log(document.cookie);
            executeMode();
        }
        function switchMode(){
            mode=getMode();
            //console.log('switchMode: from '+mode);
            if(mode==='normal')changeMode('dark');
            else changeMode('normal');
        }
        function apiGetBlog(bid){
            var result=false
            $.get({url:'/api/get_blog/'+bid,async:false,success:function(jr){
                //log('getBlog response :'+jr);
                if(jr['success']){
                    b=jr['data'];
                    result=b;
                    }
                else {
                    //log('message:'+jr['message']);
                }
            }});
            return result
        }

//--------------------html页面操作支持函数-----------------//

function getData(selector){
// 返回结点$(selector)[0]的data属性值；
    data= $(selector)[0].getAttribute('data');
    log('data:'+data);
    return data
}
// 笔记：js 默认参数；js 类；
//----------------------页面控件-------------------------------//

//------------全屏控件-------------------//
function getreqfullscreen(){
    var root = document.documentElement
    return root.requestFullscreen || root.webkitRequestFullscreen || root.mozRequestFullScreen || root.msRequestFullscreen
}
function getExitfullScreen(){
    return document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen
}
function fullScreen(sel_box){
    box=$(sel_box)[0];
    box.style['max-hight']='800px';
    box.style['overflow']='scroll';
    getreqfullscreen().call(box);
}
function exitFullScreen(sel_box){
    box=$(sel_box)[0];
    box.style['max-hight']='';
    box.style['overflow']='';
    getExitfullScreen().call(document);
}

//----------------testarea控件-------------------//
function pull_up_down(sel_btn,sel_ta){
// textarea 下拉收起控件；
    btn=$(sel_btn)[0];
    status=btn.getAttribute('status');
    info_up=btn.getAttribute('up');
    info_down=btn.getAttribute('down');
    if(status==='up'){
        taDown(sel_ta);
        btn.setAttribute('status','down');
        btn.innerText=info_down;
    }
    else{
        taUp(sel_ta);
        btn.setAttribute('status','up')
        btn.innerText=info_up;
    }
}
//----------textarea操作-----------//
function taDown(sel_ta){
    return corWithContent(sel_ta);
}
function taUp(sel_ta){
    return corWithRows(sel_ta);
}

function plain_corWithContent(n,ta){
//输入：ta 为dom 节点
    ta=$(ta);
    var v = ta.val();
    var arr = v.split('\n');
    var len = arr.length;
    var min=ta[0].rows;
    if(len>min) ta.height(len*20);//20为行高
    log('height changed-->:'+ta.height())
}
function corWithContent(selector){
    textAreas=$(selector);
    textAreas.map(plain_corWithContent);
}

function corWithRows(selector){
    textAreas=$(selector);
    log('textarea:'+textAreas[0]);
    textAreas.map(function(n,ta){
        ta=$(ta);
        //log('ta.rows:'+ta[0].rows);
        ta.height(ta[0].rows*20);//20为行高；
    });
}
//----------------markdown及其它渲染操作---------------------//
function richMarkImg(selector){
// 对markdown解析后的html节点内部img元素进行进一步解析；
//对每个img元素，解析其alt属性的值，根据alt中的内容改变该img元素的属性；
// img 元素的alt属性的值地格式应为：属性名1=值1[分隔符]属性名2=值2[分隔符]....
    imgs=$(selector+' img');
    for(var i =0;i<imgs.length;i++){
        img=imgs[i];
        text=img.getAttribute('alt');
        dic=textToDict(text,'&&')
        for(var i in dic){
            img.setAttribute(i,dic[i]);
        }

    }
}
function wrapRichText(){
//对.rich-text类的元素，对其内部html进行渲染；
//对有背景的元素，适当修改使其随网站主题mode的变化而变化；；
//包括对修改img的类，对.btn类元素添加.mode类；
    imgs=$('.rich-text:not([no-full-img]) img:not([no-bootstrap])');
    imgs.addClass('img-responsive img-rounded');
    richMarkImg('.rich-text');
    n_imgs=$('.rich-text:not([no-full-img]) img[no-bootstrap]');
    //console.log('n_imgs'+n_imgs[0]);
    n_imgs.removeClass('img-responsive img-rounded');
    blocks=$('.rich-text pre,.btn-default');
    blocks.addClass('mode');
    executeMode();
}

function parseMarkdown(selector){
//对$(selector)所选择的每一个节点：获取其data属性作为原始markdown字符串，
//将其解析后插入为节点的innerHTML,再调用其它函数进行进一步的渲染
    mks=$(selector);
    //log('parsemarkdown selector:'+selector);
    for(var i=0;i<mks.length;i++){
        mk=mks[i];
        selector='#'+mk.id;
        //log('mk.id:'+mk.id);
        mk.innerHTML=marked(String(getData(selector)));
    }
    mks.addClass('rich-text');
    wrapRichText();
}
function wrapTextarea() {
//将所有teaxtarea的行高设置为与其内容行数一致，但行数不低于其原始的rows值
                selector='textarea';
                for(var i=0;i<$(selector).length;i++){
                    ta=$($(selector)[i]);
                    var v = ta.val();
                    var arr = v.split('\n');
                    var len = arr.length;
                    var min=ta[0].rows;
                    if(len>min) ta.height(len*20);//20为行高;
                }
                log('Run wrapTextarea()');
};

//-----------------------------------------------//
//--------------------网站初始化----------------------------//
function init(){
    marked.setOptions({
        renderer: new marked.Renderer(),
        gfm: true,
        tables: true,
        breaks: false,
        pedantic: false,
        sanitize: false,
        smartLists: true,
        smartypants: false,
        highlight: function (code,lang) {
            //使用 highlight 插件解析文档中代码部分
            return hljs.highlightAuto(code,[lang]).value;
        }
    });
    executeMode();
    btn=$('#mod-switch');
    elms=$('.mode');
    btn.click(function(){
        switchMode();
    });
    $('textarea').on('input propertychange',wrapTextarea);
    //$('textarea').on('input propertychange',corWithContent);
    parseMarkdown('.markdown');
    wrapRichText();
    wrapTextarea();
}
