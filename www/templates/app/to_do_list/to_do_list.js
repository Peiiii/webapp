function initToDoList(){
    var app=trash.app.to_do_list;
    delete trash.app.to_do_list;
    var res=app.res;
    var el=app.el;
    app.input=el.find('.to-do-list-input');
    app.list=el.find('.item-list');
    app.getItem=function(){
        var item=res.item.replace('$data$',app.input.val());
        //input.val('');
        return item;
    }
    app.insertItem=function(){
        var item=this.getItem();
        app.input.val('');
        app.list.prepend(item);
        };
    app.getData=function(){
        app.list.html
    }
    app.input.keydown(function(e){
        //log(e);
        if(e.keyCode==13 && e.ctrlKey){
            app.insertItem();
        }
    })

}
$(document).ready(function(){
    initToDoList();
})