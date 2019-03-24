// base : jquery

// 需定义button属性：status:默认状态，on:表示开启状态的信息，off:表示关闭状态的信息。
//-----------Easy Switch--------------//






//---------------Supporting Functions-------------------//
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

//-------------------Switch Class------------//
//usage:
//el: switch component; turnOn: function to turn on; turnOff: fnuction to turn off  ;
//el: an el must contains two button inside it. These two button, one with class "switch-on" and another with "switch-off";
//el: should own such properties: status(on/off)
class Switch{ //el: jquery object
    constructor(el,turnOn,turnOff){
        this.el=el;
        this.parse(); // on_sel and off_sel
        this.turnOn=turnOn;
        this.turnOff;
        var self=this;
        //log(this.el);
        this.on_el.click(function(){turnOn();self.on_el.hide();self.off_el.show();});
        this.off_el.click(function(){turnOff();self.off_el.hide();self.on_el.show();});
        this.off_el.click();
    }
    parse(){
        this.on_el=this.el.find('.switch-on');
        this.off_el=this.el.find('.switch-off');
    }
}


//----------------------------------------------//






//----------------Speech Switch--------------------//
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
    window.speechSynthesis.cancel();
    console.log('停止朗读');
}
class SpeakSwitch extends Switch{
    constructor(btn,tar){
        super(btn,()=>startSpeaking(tar),()=>stopSpeaking());
    }
}
function initSpeakInnerTextSwitch(){
    var btn=$('.switch-speakInnerText');
    var tar=getTarget(btn);
    var s= new SpeakSwitch(btn,tar);
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
    el.css('overflow','hide');
    getreqfullscreen().call(el[0]);
}
function exitFullScreen(el){
    el.css('max-height','');
    el.css('overflow','');
    //log(hi);
    getExitfullScreen().call(document);
}

class FullScreenSwitch extends Switch{
    constructor(btn,tar){
        //log(btn)
        super(btn,()=>fullScreen(tar),()=>exitFullScreen(tar));
    }
}
function initFullScreenSwitch(){
    var btn=$('.switch-fullscreen');
    var tar=getTarget(btn);
    var s= new FullScreenSwitch(btn,tar);
}

//----------------View 开关--------------------//
function switchView(src,tar){
    hide(src);
    show(tar);
}
function initViewSwitch(){
    sws=$('.switch-view');
    for(var i=0;i<sws.length;i++){
        var sw=$(sws[i]);
        var tar=getTarget(sw);
        var src=getSource(sw);
        var sssw=new Switch(sw,function(){switchView(src,tar)},function(){switchView(tar,src);});
    }
}

//-------------初始化-------------//
function initSwitch(){
    initFullScreenSwitch();
    initSpeakInnerTextSwitch();
    initViewSwitch();
}


