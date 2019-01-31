//----------------------通用函数-----------------------------//
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