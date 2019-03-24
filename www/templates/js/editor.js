function renderSelect(sel){
   var v=sel.attr('value');
   var ch=sel.children();
//   log(v)
   for(var i=0;i<ch.length;i++ ){
        var op=$(ch[i]);
        var val=op.val();
        if(val===v)op[0].selected=true;
   }
}
function renderEditor(app){
   var is_public=app.find('#is_public');
   var type=app.find('#type');
   renderSelect(is_public);
   renderSelect(type);

}
function toBool(data){
    if(data==='true'||data==='1')return true;
    else if(data==='false'||data==='0')return false;

}
function getLabel(el){
    var list=el.find('#label-list');
    var children=list.children();
    var label=[];
    for(var i=0;i<children.length;i++){
        l=$(children[i]).text();
        label.push(l);
    }
    label=label.join('&&');
    log(label);
    return label;

}
function initLabelApp(app){
    var area=app.find('#label-area');
    var input=area.find('#label-input');
    var assure=area.find('#label-input-assure');
    var list=area.find('#label-list');
    input.on('input propertychange',()=>{
        show(assure);
    })
    assure.click(()=>{
        var label=input.val();
        var li=`<li class='label-entry'><span class="label label-primary" >${label}</span></li>`;
        list.append(li);
        input.val('');
        hide(assure);
    })

}
function initEditor(){
    var app=$('#editor_app');
    var title=app.find('#title');
    var input=app.find('#input');
    var output=app.find('#output');
    var is_public=app.find('#is_public');
    var type=app.find('#type');
    var label_area=app.find('#label-area');
    initLabelApp(app);
    renderEditor(app);
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
            blog_content:input.html(),
            is_public:toBool(is_public.val()),
            type:type.val(),
            label:getLabel(label_area)
        }
            log(blog);
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