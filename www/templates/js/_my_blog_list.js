
function deleteBlog(el,id){
    var msg_box=`<div class="alert alert-warning msg_box">确定要删除？<button onclick="realDeleteBlog('${el}','${id}')">确定</button></div>`
    $(el).append(msg_box);

}
function deleteParent(el){
    el=$(el);
    p=el.parent();
    p.remove();
}
function realDeleteBlog(el,id){
   log($(el));log(id)
    var msg_box=$(el).find('.msg_box');
    msg_box.remove();
    ret=$.get({url:'/me/delete_blog/'+id,async:false}).responseJSON;
    if(!ret.success){
        var msg=`<div class="alert alert-warning msg_box">${ret.message}<button onclick="deleteParent(this)">确定</button></div>`
        $(el).append(msg);
    }
    else{
        $(el).remove();
        msg_area=$('.msg-area')
        msg_area.html(ret.message);
        show(msg_area);
    }


}