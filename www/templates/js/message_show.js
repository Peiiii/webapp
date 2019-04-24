//base: jquery, easyJS(show and hide)

function showMsg(msg_box,msg){
    show(msg_box);
    msg_box.html(msg);
}
function hideMsg(msg_box){
    hide(msg_box);
}
function initMessageShow(){
    var boxes=$('.msg-box-tem');
    boxes.map((n,box)=>{
        var box=$(box);
        box.click(()=>{hide(box);});
        box.click();
    })
}
$(document).ready(()=>{
    initMessageShow();
})