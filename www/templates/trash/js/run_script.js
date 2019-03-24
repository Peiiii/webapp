
function slog(text){
    view=$('.viewport');
    //log(view);
    //log(text)
    view.append('<div>'+text+'</div>');
}
function cleanViewPort(){
    view=$('.viewport');
    view.html('');
}
function initRunScript(){
    t=$('.script-input');
    //log('runisc');
    target_sel=t.attr('target');
    target=$(target_sel);
    t.bind('input propertychange',function(){
        //log('hinjcbi');
        //log('t:'+t)
        text=t.val();
        //text=text.split('\n');
        //text=text[text.length-1];
        target.children('script').html(text);
    })
    t.keydown(function(event){
        if((event.keyCode===13)&&event.ctrlKey){
        //log(hi);

            info=runCurrentLineAsScript('.script-input');
            slog(info);
        }
    })
}
function runInnerScriptAndMore(sel){
    cleanViewPort();
    info=runInnerScript(sel);
    slog(info);

}

//--------------------import from other files------------//
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
//-----------------------------//
$(document).ready(function(){
    initRunScript();
})