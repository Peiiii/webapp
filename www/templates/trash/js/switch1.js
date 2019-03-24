// base : jquery

// 需定义button属性：status:默认状态，on:表示开启状态的信息，off:表示关闭状态的信息。


//---------------new-------------------//
function getSource(el){
    return $(el.attr('src-sel'));
}
function getTarget(el){
    return $(el.attr('tar-sel'));
}
function getStatus(el){
    return el.attr('status');
}
function getOnMsg(el){
    return el.attr('on-msg');
}
function getOffMsg(el){
    return el.attr('off-msg');
}
function getStatusAndMsg(el){
    return [getStatus(el),getOnMsg(el),getOffMsg(el)];
}
function setStatusOn(el,on_msg){
    el.attr('status','on');
    el.text(on_msg);
}
function setStatusOff(el,off_msg){
    el.attr('status','off');
    //log('off:'+off_msg);
    //log(el)
    el.text(off_msg);
}


//-------------------Switch 类------------//
function Switch(el,turnOn,turnOff){ //el: jquery object
log(el)
    this.el=el;
    this.on_msg=getOnMsg(this.el);
    this.off_msg=getOffMsg(this.el);
    this.getStatus=function(){return getStatus(this.el)};
    this.setStatusOn=function(){return setStatusOn(this.el,this.on_msg)};
    this.setStatusOff=function(){return setStatusOff(this.el,this.off_msg)};
    this.init=function(){
        status=this.getStatus();
        if(status==='on'){this.turnOn();}
        else this.turnOff();
    }
    this.turnOn=function(){
        log('on');
        turnOn();
        this.setStatusOn();
    }
    this.turnOff=function(){
        turnOff();
        log('off')
        this.setStatusOff();
    }
    //log(this.el)
    var self=this;
    this.el.click(function(){
        status=self.getStatus();
        if(status==='on'){self.turnOff();}
        else self.turnOn();
    });
    this.init();

}


//----------------------------------------------//






//----------------语音朗读开关--------------------//
//usage:
//set properties:
//class: switch-speakInnerText; tar-sel; status; on-msg; off-msg;
function startSpeaking(el){
    var speechSU = new window.SpeechSynthesisUtterance();
    speechSU.text = getInnerContent(el);
    window.speechSynthesis.speak(speechSU);
    return speechSU;
}
function stopSpeaking(){
//    var speechSU = new window.SpeechSynthesisUtterance();
//    speechSU.text ='?????';
    window.speechSynthesis.cancel();
    console.log('停止朗读');
}
function initSpeakInnerTextSwitch(){
    sws=$('.switch-speakInnerText');
    for(var i=0;i<sws.length;i++){
        sw=$(sws[i]);
        tar=$(sw.attr('tar-sel'));
        sssw=new Switch(sw,function(){startSpeaking(tar)},function(){stopSpeaking();});
    }
}
//------------全屏开关-------------------//
//usage:
//set properties:
//class:switch-fullscreen;status:on/off;on-msg;off-msg;tar-sel;
function getreqfullscreen(){
    var root = document.documentElement
    return root.requestFullscreen || root.webkitRequestFullscreen || root.mozRequestFullScreen || root.msRequestFullscreen
}
function getExitfullScreen(){
    return document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen
}
function fullScreen(el){
    el.css('max-height','800px');
    el.css('overflow','scroll');
    getreqfullscreen().call(el[0]);
}
function exitFullScreen(el){
    el.css('max-height','');
    el.css('overflow','');
    //log(hi);
    getExitfullScreen().call(document);
}

function initFullScreenSwitch(){
    var sw=$('.switch-fullscreen');
    var tar=getTarget(sw);
    var sw1=new Switch(sw,function(){fullScreen(tar)},function(){exitFullScreen(tar)});

}
//-----------FullScreenSwitch 类

//----------------View 开关--------------------//

function initViewSwitch(){
    sws=$('.switch-view');
    for(var i=0;i<sws.length;i++){
        var sw=$(sws[i]);
        var tar=getTarget(sw);
        var src=getSource(sw);
        var sssw=new Switch(sw,function(){view(src,tar)},function(){exitView(src,tar);});
    }
}

//-------------初始化-------------//
function initSwitch(){
    initFullScreenSwitch();
    initSpeakInnerTextSwitch();
    initViewSwitch();
}

$(document).ready(function(){
    initSwitch();
})
