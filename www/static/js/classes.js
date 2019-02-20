
function Group(sel){
    this.dom=$($(sel)[0]);
    this.children=function(sel){return this.dom.children(sel);}
    this.parent=function(){return this.dom.parent();}
    this.attr=function(name,value){return this.dom.attr(name,value);}
    this.itemList=function(){return this.children('.item');}
    this.baseLine=this.children('.base-line');
    this.getItemHTML=function(){
        return this.$children('.data-box').html();
    }
    this.appendItem=function(){
        this.baseLine.before(this.getItemHTML());
    }
    this.popItem=function(){
        itemList=this.itemList();
        itemList[itemList.length-1].remove();
    }
}
function cellGroup(sel){
    var instance=new Group(sel);
    instance.view=function(sel){
        $(sel).insertBefore(this.dom);
    }
    return instance;
}
function App(id,data){
    app=new Vue({
        el:id,
        data:{
            root:this.$refs.app
        }
        methods:{
            getItemHTML:function(){
                //root=this.$refs.app;
                return $(this.root).children('.data-box').html();
            }
            appendItem:function(){
                baseLine=$(this.root).children('.base-line');
                baseLine.before()
            }
        }

    });
    return app;
}

a=new cellGroup('#cell_box_1');