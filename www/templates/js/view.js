// base:  jquery

function getInnerContent(el){
    tag=el.prop('nodeName')
    if(tag==='textarea' || tag==='input' ){return el.val();}
    return el.html();
}
function copyHTML(src,tar){
    html=getInnerContent(src);
    html=escapeToHTML(html);
    var isDefined=(typeof maeked != "undefined" ? true : false);
    if(isDefined)html=marked(html);
    //log(html);
    tar.html(html);
}
function view(src,tar){
    log('view');
    copyHTML(src,tar);
    hide(src)
    show(tar);
}
function exitView(src,tar){
    log('exit view')
    hide(tar);
    //log('hide:')
    //log(tar)
    show(src);
    //log('show:');
    //log(src);
}