// base:  jquery
// function: intereactive , message show and hide, query ;
trash.modules.push('pageData');

//-------------------page data operation---------------//
function getData(selector){
    data= $(selector).val();
    data=data.replaceAll('<','<');
    data=data.replaceAll('>','>');
    return data;
}
function getInnerContent(el){
    tag=el.prop('nodeName')
    if(tag==='textarea' || tag==='input' ){return el.val();}
    return el.html();
}
function copyHTMLTo(src,tar){
    html=getInnerContent(src);
    html=escapeToHTML(html);
    var isDefined=(typeof maeked != "undefined" ? true : false);
    if(isDefined)html=myMarked(html);
    tar.html(html);
}
