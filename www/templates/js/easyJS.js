//base : jsquery,boostrap(only show and hide)
dev=true;
hi='hi';
hi1='hi1';
hi2='hi2';
hi3='hi3';
var trash={app:{},modules:['base']}
function show(el){
    el.removeClass('hidden');
}
function hide(el){
    el.addClass('hidden');
}
String.prototype.replaceAll = function(s1,s2){
return this.replace(new RegExp(s1,"gm"),s2);
}
String.prototype.strip=function(str=' '){
 //类似于 python 的 strip 函数
    context=this;
    len=str.length;
//    log(context);log(len)
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
String.prototype.mul=function(num){
    var str=''
    for(var i=0;i<num;i++){
        str+=this;
    };
    return str;
}
String.prototype.toDict= function(divider){
//类似于对cookies的解析函数，将纯字符串的键=值对集合解析成集合，divider为分隔符。
//例如 对 "name=nick&&key=123&&code=345" 进行解析，divider="&&",返回结果 { name:nick',key:'123',code:'345'}
    text=strip(this,divider);
    arr=text.split(divider);
    dic={};
    for(var i=0;i<arr.length;i++){
        [name,value]=arr[i].split('=');
        dic[name]=value;
    }
    return dic;
}
String.prototype.getRows=function (t){
//计算字符串中换行符数量
    arr=t.split('\n')
    return arr.length;
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
//----------------------------------------------//
// document format conversion
function escapeToHTML(str) {
 var arrEntities={'lt':'<','gt':'>','nbsp':' ','amp':'&','quot':'"'};
 return str.replace(/&(lt|gt|nbsp|amp|quot);/ig,function(all,t){return arrEntities[t];});
}

//-------------------------------------------------------//

//------------------------------------------------//
//常用函数
function log(text){console.log(text);}
function slog(text,str='',num=10){
    console.log('*'.mul(num));
    console.log(text);
    console.log('*'.mul(num));
}
