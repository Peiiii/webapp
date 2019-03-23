

function initEditor(){
    var app=$('#editor_app');
    var title=app.find('#title');
    var input=app.find('#input');
    var output=app.find('#output');
    output.html(marked(input.html()));
    input.on('focus input propertychange',()=>{
        output.html(marked(input.html()));
        hide(message);
    });
    var edit=false;
    if(app.attr('edit')=='true')edit=true;
    var submit=app.find('#submit');
    var message=$('#message');
    submit.click(()=>{
        // 检查
//        log('clickme');
        if (title.html()==='')return;
        blog={
            blog_heading:title.html(),
            blog_summary:'',
            blog_content:input.html()
        }
        if(edit){
            blog_id=app.attr('blog_id');
            ret=$.post({url:'/me/editor/'+blog_id,data:JSON.stringify(blog),async:false}).responseJSON;
            }
        else ret=$.post({url:'/me/post_blog',data:JSON.stringify(blog),async:false}).responseJSON;
        message.html(ret.message);
        show(message);
    })
}

$(document).ready(function(){
    initEditor();
})