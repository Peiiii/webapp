function encodePath(path){
    return path.replaceAll('/','%2F');
}
function readFile(filename){
    j=$.get({url:'/file/read/'+encodePath(filename), async:false,success:function(jr){
        return jr;
    }})
    j=j.responseJSON;
    if (j.success)return j.data;
    return false;
}
function writeFile(filename,text){
    j=$.post({url:'/file/write/'+encodePath(filename),data:JSON.stringify({content:text}),async:false,success:function(jr){
    //log(hi1)
        return jr;
    }})
    j=j.responseJSON;
    if (j.success)return j.message;
    return false;
}
function File(filename){
    this.name=filename;
    this.read=function(){
        return readFile(this.name);
    }
    this.write=function(text){
        return writeFile(this.name,text);
    }
}
/**************************************/
function getDir(path){
    j=$.get({url:'/path/'+encodePath(path),async:false,success:function(){
    }});
    j=j.responseJSON;
    if(j.success)return j.data;
    return false
}
function FilePath(path){
    this.name=path;
    this.listdir=function(){
        return getDir(this.name);
    }

}
