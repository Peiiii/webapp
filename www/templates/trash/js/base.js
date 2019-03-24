//base : jquery,Bootstrap
//----------------------通用函数-----------------------------//
//--------Initialize System---------//
var trash={app:{},modules:['base']}



String.prototype.replaceAll = function(s1,s2){
return this.replace(new RegExp(s1,"gm"),s2);
}
function strip(context,str){
 //类似于 python 的 strip 函数
    len=str.length;
    if(context.length<len)return context;
    while(true){
        if(context.length<len) return context;
        s1=context.slice(0,len);
        if(s1===str)context=context.slice(len,);
        else break;
    }
    while(true){
        if(context.length<len) return context;
        s2=context.slice(-len,);
        if(s2===str)context=context.slice(0,-len);
        else break;
    }
    return context;
}
function textToDict(text,divider){
//类似于对cookies的解析函数，将纯字符串的键=值对集合解析成集合，divider为分隔符。
//例如 对 "name=nick&&key=123&&code=345" 进行解析，divider="&&",返回结果 { name:nick',key:'123',code:'345'}
    text=strip(text,divider);
    arr=text.split(divider);
    dic={};
    for(var i=0;i<arr.length;i++){
        [name,value]=arr[i].split('=');
        dic[name]=value;
    }
    return dic;
}
function getLines (selector){
//计算字符串中换行符数量
    t=$(selector).val();
    arr=t.split('\n')
}
function getLastLine(text){
    text=text.split('\n');
    return text[text.length-1];
}
function getLine(text,n){
    num=0;
    for(var i=0;i<n;i++){
        if(text[i]=='\n')num++;
    };
    line =text.split('\n')[num];
    //log(line);
    return line;
}

function escapeToHTML(str) {
 var arrEntities={'lt':'<','gt':'>','nbsp':' ','amp':'&','quot':'"'};
 return str.replace(/&(lt|gt|nbsp|amp|quot);/ig,function(all,t){return arrEntities[t];});
}

//-------------------------------------------------------//

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

//------------------------------------------------//
function log(text){console.log(text)}
function runInnerScript(el){
    scripts=el.find('script');
    ts=[];
    for(var i=0;i<scripts.length;i++){
        //log(scripts[i].innerHTML);
        inf=window.eval(scripts[i].innerHTML);
        ts.push(inf);
    }
    return ts
}
function runCurrentLineAsScript(selector){
    //log('runinnerScript:'+selector);
    ta=$(selector);
    //log('scripts:'+scripts);
    ts=[];
    for(var i=0;i<ta.length;i++){
        //log(scripts[i].innerHTML);
        text=$(ta[i]).val();
        start=ta[i].selectionStart;
        //log(start)

        text=getLine(text,start);
        //log(text);
        inf=window.eval(text);
        ts.push(inf);
    }
    return ts
}


function myMarked(text){
    // remove <div></div>
    text=text.replaceAll('</div><div>','\n');
    text=text.replaceAll('<div>','\n');
    text=text.replaceAll('</div>','\n');
    text=escapeToHTML(text);
//    log('escapedHTML:');log(text)
    return marked(text);
}
var isDefined=(typeof marked != "undefined" ? true : false);
if(isDefined){
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
            return hljs.highlightAuto(code,[lang]).value;
        }
    });
    }
function parseMarkdown(sel_show_box,sel_data_box){
    mks=$(sel_show_box);
    //log('parsemarkdown selector:'+selector);
    for(var i=0;i<mks.length;i++){
        mk=$(mks[i]);
        selector='#'+mk[0].id;
        //log('mk.id:'+mk.id);
        sel_data_box='#'+mk[0].getAttribute('data-box-id');
        mk.html(myMarked(String(getData(sel_data_box)))    );
    }
    mks.addClass('rich-text');
}
function initMarkdown(){
    parseMarkdown('.markdown');
}