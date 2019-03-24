function getCookie(){
                    strcookie=document.cookie;
                    strcookie=strcookie.split(';');
                    var cookie= {};
                    for(var i=0;i<strcookie.length;i++){
                        [name,value]=strcookie[i].trim().split('=');
                        cookie[name]=value;
                    };
                    return cookie;
                }
function setCookie(name,value){
                    max_age=86400*15;
                    document.cookie=name+'=0;max-age=-1;path=/';
                    document.cookie=name+'='+value+';max-age='+max_age+';path=/';
};
