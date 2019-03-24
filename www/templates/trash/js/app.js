
//base : jquery
function cimport(module_name){
    if(trash.modules.indexOf(module_name)!=-1)return true;
    code=getModule(module_name);
    //console.log('code:');
    //console.log(code);
    window.eval(code);
    console.log('run module:'+module_name);
}

function getModule(module_name){
    j=getJson('/module/get/'+module_name);
    return j['data']
}
function getCloudApp(app_name){
    j=getJson('/cloud_app/get/'+app_name);
    return new App(j['data'],app_name);
}
class App{
    constructor(template,id){
        this.id=(typeof id)=="undefined"?'new_app':id;
        this.sel='#'+this.id;
        this.template=template;
        this.html=this.template;
        this.res=this.getRes();
    }
    hello(){alert('Hello,I am '+this.id);}
    addComponent(name,f){
        this[name]=f;
    }
    replace(el){el.replaceWith(this.html);}
    append(el){el.append(this.html);}
    fill(el){el.html(this.html);}
    view(el){
        var isDefined=(typeof el)!="undefined"?true:false;
        if(!isDefined){this.fill($('body'))}
        else this.replace(el);
        this.el=$(this.sel);
        //log('el:');log(this.el )
        //this.el.attr('id',this.id);
        //var msg=this.runScript();
        //log('view : run script:'+msg)
    }
    getRes(){
        var d={};
        var boxes=$(this.template).find('.data-area').find('.data-box');
        for(var i=0;i<boxes.length;i++){
            data=parseDataBox($(boxes[i]));
            d[data['tag']]=data['data'];
        }
        return d;
    }
    runScript(){
        return runInnerScript(this.el);
    }

}

function parseDataBox(el){
    type=el.attr('data-type');
    tag=el.attr('data-tag');
    if(type==='html'){data=el.html();}
    else if(type=='text'){data=el.text();}
    else if(type=='string'){data=el.val();}
    else data=el.html();
    return {type:type,tag:tag,data:data}

}

function addAppToDoList(el){
    var isDefined=(typeof el)=="undefined"?false:true;
    app=getCloudApp('to_do_list');
    trash.app.to_do_list=app;
    if(isDefined)app.view(el);
    else app.view();
}

function addAppFileEditor(el){
//log('hello')
    var isDefined=(typeof el)=="undefined"?false:true;
    //var id='file_editor_1';
    //log(hi)
    var app=getCloudApp('file_editor');
    //app.id=id;
    trash.app.file_editor=app;
    //log('el');log(el);
    app.default_file='e:%2F%2FA%20Resouce%20Library%2FA%20Private%20Space%2Fimportant%20information%2F%E5%87%BA%E8%A1%8C%E9%A1%BB%E7%9F%A5.txt';
    if(isDefined)app.view(el);
    else app.view();
    //log('el:');log(el);
    //log('shgcud');
    //log('isD:');log(isDefined);
}
function openApp(app_name,el){
    var isDefined=(typeof el)=="undefined"?false:true;
    var app=getCloudApp(app_name);
    trash.app[app_name]=app;
    if(isDefined)app.view(el);
    else app.view();
}