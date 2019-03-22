// base : jquery , file
log('run module file_editor');
cimport('com');
cimport('file');
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
function runFileEditor(path){
    var editor=trash.app.file_editor;
    //log('sel:'+editor.sel);
    var file=cGetFile(path).data;
    //log(file)
    var app=new Vue({
        delimiters:['<%','%>'],
        el:editor.sel,
        data:{
            file:file
        }
    })
    initEditApp(app.sel);
    window.location.href=editor.sel;
}
$(document).ready(function(){
    //log('ready to run');
    runFileEditor(trash.app.file_editor.default_file);
})
//log('nhjdk疯了')