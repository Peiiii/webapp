function log(text){console.log(text);}
function moveCode(src,tar){
    var code=src.html();
    tar.val(code);
}
function moveHtml(src,tar){
    var code=src.val();
    tar.html(code);
}
function initEditableSwitch(){
    var edit_toobar=$('#edit-toolbar');
    var btn=$('.switch-editable');
    var btn_ilz=new SwitchInitializer(btn);
    var tar1=btn_ilz.tar1;var tar2=btn_ilz.tar2;
    var sw=new Switch(btn,()=>{
        tar1.attr('contenteditable','true');
        show(edit_toobar);
    },
    ()=>{
        tar1.attr('contenteditable','false');
        var sw_dv=switches.doubleview[0];
        sw_dv.easyTurnOff();
        hide(edit_toobar);
    });
    switches['editable']=[];
    switches.editable.push(sw);
}
//----------------cmd---------------//
function checkCmd(text){
    if(text.length<4)return false;
    else if(text.slice(0,2)!="::")return false;
    text=text.slice(2,text.length).toLowerCase();
    return text;
}
function executeCmd(cmd){
    var sw=switches.editable[0];
    var btn=$('#btn-editable');
    if(cmd=='edit'){
        show(btn);
        sw.easyTurnOn();
        return true;
    }
    else if(cmd=='exit'){
        sw.easyTurnOff();
        hide(btn);
        return true;
    }
    else return false;
}
function initCommandButton(){
    var btn=$('#cmd-btn');
    var input=$('#cmd-input');
    var msg_box=$('.msg-box-tem');
    btn.click(()=>{
        var cmd=input.val();
        cmd=checkCmd(cmd);
        if(! cmd){showMsg(msg_box,'命令错误')}
        else {
            success=executeCmd(cmd);
            if(success){
               input.val('');
            }
            else showMsg(msg_box,'命令错误');
        };
    });
    input.keydown((e)=>{
        if(e.keyCode==13){hideMsg(msg_box);btn.click();}

    })
}
//----------end cmd-----------//
function initSwitchTest(){
    initEditableSwitch();
    initCommandButton();
}
function initTest(){
    var b=$('body');
    var chg=$('#changeable');
    var sub=$('#submit-btn');
    var editable=$('#editable');
    var code=$('#source-code-box');
    var sw=$('#exitview-switch');
    var msg_box=$('.msg-box-tem');
    initSwitchTest();
    moveCode(editable,code);
    editable.on("propertychange focus input",()=>{
        moveCode(editable,code);
    });
    code.on("propertychange focus input",()=>{
        moveHtml(code,editable);
    });
    sub.click(()=>{
        var re=$.post({url:'/app/test',async:false,data:chg[0].innerHTML});
        var msg=re.responseJSON.message;
        showMsg(msg_box,msg);
    });


}
$(document).ready(()=>{
    initTest();
})