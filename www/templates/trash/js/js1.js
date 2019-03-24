
var hi='hi';




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



//----------------------------------------Initialization ?????????------------------------------------------------//
function  initTextArea(){
    corWithContent('.textarea');
    corWithContent('.textarea-responsive');
}




//-----------------------------------------------//
//--------------------????????----------------------------//
function init(){
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