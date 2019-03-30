//base: jquery, easyJS(show and hide)

function showMsg(msg_box,msg){
    msg_box.css('display','block');
    msg_box.html(msg);
}
function hideMsg(msg_box){
    msg_box.css('display','none');
}
function initMessageShow(){
//    log('init mssageShow')
    var boxes=$('.msg-box-tem');
    boxes.map((n,box)=>{
        var box=$(box);
        box.click(()=>{hide(box);log(hi)});
    })
}