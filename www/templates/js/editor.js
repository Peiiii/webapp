// 基于jquery,bootstarp

function showMsg(msg_box,msg){
    msg_box.css('display','block');
    msg_box.html(msg);
}
function hideMsg(msg_box){
    msg_box.css('display','none');
}

function initEditApp(sel){
    app=$(sel);
    btn_sub=app.find('.btn-submit');
    btn_view=app.find('.btn-view')

    input=app.find('.text-input');
    view_box=app.find('.html-box');

    fn_box=app.find('.filename-box');
    msg_box=app.find('.message-box');

    btn_sub.click(function(){
        message=writeFile(fn_box.text(),input.val());
        console.log(message);
        showMsg(msg_box,message);
    });
    btn_view.click(function(){

    })
    input.bind('focus input propertychange',function(){
        hideMsg(msg_box);
    });



}
function createEditApp(sel){
    $(document).ready(function(){
        initEditApp(sel);
    });
}