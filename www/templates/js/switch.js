// base : jquery

// 需定义button属性：status:默认状态，on:表示开启状态的信息，off:表示关闭状态的信息。
//-----------Easy Switch--------------//





switches={};
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
        this.el=el; // on_sel and off_sel
        this.turnOn=turnOn;
        this.turnOff=turnOff;
        this.parse();
    }
    parse(){
        if(this.el.attr('easy-switch')=='true')this.easy_switch=true;
        else this.easy_switch=false;
        if(this.easy_switch)this.doEasySwitch();// doEasySwitch
        else this.doNormalSwicth();  //  doNormalSwitch
    }
//-----------NormalSwitch-----------//
    doNormalSwicth(){
        this.on_el=this.el.find('.switch-on');
        this.off_el=this.el.find('.switch-off');

        var self=this;
        //log(this.el);
        this.on_el.click(function(){self.turnOn();self.on_el.hide();self.off_el.show();});
        this.off_el.click(function(){self.turnOff();self.off_el.hide();self.on_el.show();});
        this.off_el.click();
    }
//-------EasySwitch-----------------//
    doEasySwitch(){
        this.on_msg=this.el.attr('on-msg');
        this.off_msg=this.el.attr('off-msg');

        this.checkStatus();
        var self=this;
        this.el.click(()=>{
            if(self.status()=='on'){self.easyTurnOff();}
            else self.easyTurnOn();
        })
    }
    easyTurnOn(){
        this.setStatus('on');
        this.checkStatus();
    }
    easyTurnOff(){
        this.setStatus('off');
        this.checkStatus();
    }
    setStatus(stat){
        this.el.attr('status',stat);
    }
    status(){
        return this.el.attr('status');
    }
    checkStatus(){
        if(!this.el.attr('status'))this.el.attr('status','off');
        var status=this.status();
        if(status=='on'){this.turnOn();this.el.html(this.off_msg);}
        else{this.turnOff();this.el.html(this.on_msg);}
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
//-----------------ShowSwitch--------->
class ShowSwitch extends Switch{
    constructor(btn,tar){
        super(btn,()=>show(tar),()=>hide(tar));
    }
}
function initShowSwitch(){
    sws=$('.switch-show');
    for(var i=0;i<sws.length;i++){
        var sw=$(sws[i]);
        var tar=getTarget(sw);
        var sssw=new ShowSwitch(sw,tar);
    }
}
//-------------------End ShowSwitch-----------------//
//---------------DoubleViewSwitch----------------//
function doubleViewSwitchTurnOn(btn,tar1,tar2){
        tar1.css({width:'50%'});
        tar2.css({width:'50%'});
        show(tar2);
    }
 function doubleViewSwitchTurnOff(btn,tar1,tar2){
            tar1.css({width:'100%'});
            hide(tar2);
    }
class DoubleViewSwitch extends Switch{
    constructor(btn,tar1,tar2){
        super(btn,()=>{doubleViewSwitchTurnOn(btn,tar1,tar2)},()=>{doubleViewSwitchTurnOff(btn,tar1,tar2)});
    }
}
function initDoubleViewSwitch(){
    var btns=$('.switch-doubleview');
    switches['doubleview']=[];
    btns.map((n,btn)=>{
        btn=$(btn);log(btn)
        var tar1=$(btn.attr('tar-sel1'));
        var tar2=$(btn.attr('tar-sel2'));
        var sw=new DoubleViewSwitch(btn,tar1,tar2);
        switches.doubleview.push(sw);
    })
}
//--------------------End DoubleViewSwitch-----------------------//

//---------------SwitchInitializer---------------------//
class SwitchInitializer{
    constructor(btn){
        this.btn=btn;
        this.initialState=this.status();
        this.src=$(this.btn.attr('src-sel'));
        this.tar=$(this.btn.attr('tar-sel'));
        this.tar1=$(this.btn.attr('tar-sel1'));
        this.tar2=$(this.btn.attr('tar-sel2'));
        var tars=this.btn.attr('tar-sels');
        this.tars=[];
        if(tars){
//            log(tars)
            tars=tars.split();
            tars.map((n,ta)=>{
                this.tars.push($(ta));
            })
        }

    }
    status(){
        return this.btn.attr('status');
    }
}
//-------------初始化-------------//
function initSwitch(){
    initFullScreenSwitch();
    initSpeakInnerTextSwitch();
    initViewSwitch();
    initShowSwitch();
    initDoubleViewSwitch();
}
$(document).ready(()=>{
    initSwitch();
})

