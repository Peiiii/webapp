function log(text){console.log(text)}
var hi='hi';

//------------??cookie??????????cookie??????????cookie;-------------------//
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
//------------------?????????mode?????----------------------//
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
            elms.slice(0,2).css('opacity','0.7');
            canvas_script=$('.canvas-script');
            //canvas_script.attr('opacity',canvas_script.attr('dark-opacity'));
            canvas=$('canvas');
            canvas.css('opacity',canvas_script.attr('dark-opacity'));
        }
        function getMode(){
            cookie=getCookie();
            return cookie['mode'];
        }
        function modeNormal(){
            elms=$('.mode');
            elms.removeClass('dark');
            elms.slice(0,2).css('opacity','1');
            canvas_script=$('.canvas-script');
            //canvas_script.attr('opacity',canvas_script.attr('normal-opacity'));
            canvas=$('canvas');
            canvas.css('opacity',canvas_script.attr('normal-opacity'));
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

//--------------------html????????????-----------------//


function removeParent(ele){
    ele.parentElement.remove();
}
function getDataFromDiv(sel_div){
    return $(sel_div)[0].innerHTML;
}

//-----------------------??????????????---------------------------//
function pullUpSwitch(sel_btn,sel_box){
    return ;
}

//----------------testarea??????????-------------------//
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
//----------textarea????-----------//
function pullTextAreaUpOn(sel_ta){
    return corWithRows(sel_ta);
}
function pullTextAreaUpOff(sel_ta){
    return corWithContent(sel_ta);
}

function plain_corWithContent(ta){
//????ta ?dom ???
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
        ta.height(new_height);//20??и?
    }
    //log('height changed-->:'+ta.height());
}
function onTextareaInput(event){
//????ta ?dom ???
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
        ta.height(new_height);//20??и?
        log('height changed-->:'+ta.height());
    }

}
function corWithContent(selector){
    //log('cor');
    textAreas=$(selector);
    for(var i=0;i<textAreas.length;i++){
        plain_corWithContent(textAreas[i]);
        textAreas[i].addEventListener('input',onTextareaInput);
    }

}

function corWithRows(selector){
    textAreas=$(selector);
    //log('textarea:'+textAreas[0]);
    textAreas.map(function(n,ta){
        ta=$(ta);
        //log('ta.rows:'+ta[0].rows);
        ta.height(ta[0].rows*20);//20??и??
    });
}
//----------------------Cell????--------------------//

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

//----------------------------------------------------------------------------------------//

//----------------markdown?????????????---------------------//
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
// ??????$(selector)[0]??data???????
    //log('getData selector:'+selector);
    data= $(selector).val();
    data=data.replaceAll('<','<');
    data=data.replaceAll('>','>');
    //preview('data:'+data);
    return data;
}
function richMarkImg(selector){
// ??markdown???????html??????img?????н??????????
//?????img??????????alt????????????alt?е????????img?????????
// img ????alt????????????????????1=?1[?????]??????2=?2[?????]....
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
//??.rich-text??????????????html?????????
//???б???????????????????????????mode??仯???仯????
//?????????img??????.btn????????.mode??
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
//??$(selector)??????????????????data?????????markdown???????
//?????????????????innerHTML,????????????????н?????????
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
////--------------Textarea?????------------------//
//function wrapTextarea() {
////??????teaxtarea???и????????????????????????????????????????rows?
//                selector='textarea';
//                for(var i=0;i<$(selector).length;i++){
//                    ta=$($(selector)[i]);
//                    var v = ta.val();
//                    var arr = v.split('\n');
//                    var len = arr.length;
//                    var min=ta[0].rows;
//                    if(len>min) ta.height(len*20);//20??и?;
//                }
//                log('Run wrapTextarea()');
//};
//----------------------------------------Initialization ?????????------------------------------------------------//
function  initTextArea(){
    corWithContent('.textarea');
    corWithContent('.textarea-responsive');
}




//-----------------------------------------------//
//--------------------????????----------------------------//
function init(){
var isDefined=(typeof maeked != "undefined" ? true : false);
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
            //??? highlight ???????????д?????
            return hljs.highlightAuto(code,[lang]).value;
        }
    });
    }
    executeMode();
    btn=$('#mod-switch');
    elms=$('.mode');
    btn.unbind('click').click(function(){
        switchMode();
        //log('click switch mode');
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