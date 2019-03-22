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


//function getData(selector){
//// 返回结点$(selector)[0]的data属性值；
//    data= $(selector)[0].getAttribute('data');
//    //log('data:'+data);
//    return data;
//}
// 笔记：js 默认参数；js 类；
//---------------------------------------------------页面控件--------------------------------------------------------//
//笔记： 添加控件服务
//switch服务：
//    控制按钮需添加属性：
//            onclick:服务函数名；
//            status:初始状态；
//            on:处于on状态是按钮所显示的文字
//            off:处于off状态是按钮所显示的文字
//---------------------------！！！控件系统！！！----------------------------//
//--------------------------控件服务----------------------------//
//基础支持函数
function getStatus(sel_btn){
    return $(sel_btn)[0].getAttribute('status');
}
function getOnMsg(sel_btn){
    return $(sel_btn)[0].getAttribute('on');
}
function getOffMsg(sel_btn){
    return $(sel_btn)[0].getAttribute('off');
}
function getStatusAndMsg(sel_btn){
    return [getStatus(sel_btn),getOnMsg(sel_btn),getOffMsg(sel_btn)];
}
function setStatusOn(sel_btn,on_msg){
    $(sel_btn)[0].setAttribute('status','on');
    $(sel_btn)[0].innerText=on_msg;
}
function setStatusOff(sel_btn,off_msg){
    $(sel_btn)[0].setAttribute('status','off');
    $(sel_btn)[0].innerText=off_msg;
}

//--------页面操作---------//
function removeParent(ele){
    ele.parentElement.remove();
}
function getDataFromDiv(sel_div){
    return $(sel_div)[0].innerHTML;
}
//----------------语音朗读控件--------------------//
function startSpeaking(sel_box){
    var speechSU = new window.SpeechSynthesisUtterance();
    speechSU.text = $(sel_box)[0].innerText;
    window.speechSynthesis.speak(speechSU);
    return speechSU;
}
function stopSpeaking(){
//    var speechSU = new window.SpeechSynthesisUtterance();
//    speechSU.text ='停止朗读';
    window.speechSynthesis.cancel();
    console.log('停止朗读');
}
function speakInnerTextSwitch(sel_btn,sel_box){
    status=getStatus(sel_btn);
    on_msg=getOnMsg(sel_btn);
    off_msg=getOffMsg(sel_btn);
    if (status==='on'){
        stopSpeaking();
        setStatusOff(sel_btn,on_msg);
    }
    else{
        startSpeaking(sel_box);
        setStatusOn(sel_btn,off_msg);
    }
}

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

function fullScreenSwitch(sel_btn,sel_box){
    [status,on_msg,off_msg]=getStatusAndMsg(sel_btn);
    if (status==='on'){
         exitFullScreen(sel_box);
         setStatusOff(sel_btn,on_msg);
    }
    else{
        fullScreen(sel_box);
        setStatusOn(sel_btn,off_msg);
    }
}
//-----------------------容器下拉收起控件---------------------------//
function pullUpSwitch(sel_btn,sel_box){
    return ;
}

//----------------testarea下拉收起控件-------------------//
function pullTextAreaUpSwitch(sel_btn,sel_ta){
    [status,on_msg,off_msg]=getStatusAndMsg(sel_btn);
    if(status=='on'){
        pullTextAreaUpOff(sel_ta);
        setStatusOff(sel_btn,on_msg);
    }
    else{
        pullTextAreaUpOn(sel_ta);
        setStatusOn(sel_btn,off_msg);
    }
}
//----------textarea操作-----------//
function pullTextAreaUpOn(sel_ta){
    return corWithRows(sel_ta);
}
function pullTextAreaUpOff(sel_ta){
    return corWithContent(sel_ta);
}

function plain_corWithContent(ta){
//输入：ta 为dom 节点
    ta=$(ta);
    var v = ta.val();
    var arr = v.split('\n');
    var len = arr.length;
    var min=ta[0].rows;
    max_height=ta[0].style['max-height'];
    max_height=Number(max_height.split('px')[0]);
    max_height=max_height>0?max_height:len*20;
    if(len>min) {
        new_height=Math.min(len*20,max_height);
        ta.height(new_height);//20为行高
    }
    log('height changed-->:'+ta.height());
}
function onTextareaInput(event){
//输入：ta 为dom 节点
    ta=$(event.target);
    log(ta);
    var v = ta.val();
    var arr = v.split('\n');
    var len = arr.length;
    var min=ta[0].rows;
    log('rows:'+min+' len:'+len);
    max_height=ta[0].style['max-height'];
    max_height=Number(max_height.split('px')[0]);
    max_height=max_height>0?max_height:len*20;
    if(len>=min) {
        log(max_height);
        log('len:'+len);
        new_height=Math.min(len*20,max_height);
        ta.height(new_height);//20为行高
        log('height changed-->:'+ta.height());
    }

}
function corWithContent(selector){
    log('cor');
    textAreas=$(selector);
    for(var i=0;i<textAreas.length;i++){
        plain_corWithContent(textAreas[i]);
        textAreas[i].addEventListener('input',onTextareaInput);
    }

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
//----------------------Cell操作--------------------//
String.prototype.replaceAll = function(s1,s2){
　　return this.replace(new RegExp(s1,"gm"),s2);
　　}
function deleteCellFromEnd(sel){
    box=$(sel+'>.cell-box');
    //log(box);
    if(box.length>1)box[box.length-1].remove();

}

function insertCellBefore(sel_base,sel_data_box){
    base=$(sel_base)[0];
    cell_html=getDataFromDiv(sel_data_box);
    base.insertAdjacentHTML('beforeBegin',cell_html);
    initTextArea();
}
//-----------------------------------------//
function runInnerScript(selector){
    selector=selector+' script';
    //log('runinnerScript:'+selector);
    scripts=$(selector);
    //log('scripts:'+scripts);
    for(var i=0;i<scripts.length;i++){
        //log(scripts[i].innerHTML);
        window.eval(scripts[i].innerHTML);
    }
}
//----------------------------------------------------------------------------------------//

//----------------markdown及其它渲染操作---------------------//
function preview(text){
    l=text.length;
    //log('length: '+l);
    if (l>=30){
        log(text.slice(0,10)+'......'+text.slice(l-10,l-1));
        return;
    }
    log(text);

}
function getData(selector){
// 返回结点$(selector)[0]的data属性值；
    log('getData selector:'+selector);
    data= $(selector).val();
    data=data.replaceAll('&lt;','<');
    data=data.replaceAll('&gt;','>');
    //preview('data:'+data);
    return data;
}
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

function parseMarkdown(sel_show_box,sel_data_box){
//对$(selector)所选择的每一个节点：获取其data属性作为原始markdown字符串，
//将其解析后插入为节点的innerHTML,再调用其它函数进行进一步的渲染
    mks=$(sel_show_box);
    //log('parsemarkdown selector:'+selector);
    for(var i=0;i<mks.length;i++){
        mk=$(mks[i]);
        selector='#'+mk[0].id;
        //log('mk.id:'+mk.id);
        sel_data_box='#'+mk[0].getAttribute('data-box-id');
        mk.html(marked(String(getData(sel_data_box)))    );
    }
    mks.addClass('rich-text');
    wrapRichText();
}
////--------------Textarea初始化------------------//
//function wrapTextarea() {
////将所有teaxtarea的行高设置为与其内容行数一致，但行数不低于其原始的rows值
//                selector='textarea';
//                for(var i=0;i<$(selector).length;i++){
//                    ta=$($(selector)[i]);
//                    var v = ta.val();
//                    var arr = v.split('\n');
//                    var len = arr.length;
//                    var min=ta[0].rows;
//                    if(len>min) ta.height(len*20);//20为行高;
//                }
//                log('Run wrapTextarea()');
//};
//----------------------------------------Initialization 初始化函数------------------------------------------------//
function  initTextArea(){
    corWithContent('.textarea');
    corWithContent('.textarea-responsive');
}




//-----------------------------------------------//
//--------------------网站初始化----------------------------//
function init(){
isDefined=(typeof marked != "undefined" ? true : false);
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
            //使用 highlight 插件解析文档中代码部分
            return hljs.highlightAuto(code,[lang]).value;
        }
    });
    }
    executeMode();
    btn=$('#mod-switch');
    elms=$('.mode');
    btn.click(function(){
        switchMode();
    });
    $('textarea').on('input propertychange',initTextArea);
    //$('textarea').on('input propertychange',corWithContent);
    parseMarkdown('.markdown');
    wrapRichText();
    initTextArea();
}
$(document).ready(function(){
    init();
})