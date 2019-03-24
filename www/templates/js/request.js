trash.modules.push('request');
function getJson(url){
    r=$.get({url:url,async:false});
    return r.responseJSON;
}
function apiGetBlog(bid){
            var result=false
            $.get({url:'/api/get_blog/'+bid,async:false,success:function(jr){
                //log('getBlog response :'+jr);
                if(jr['success']){
                    b=jr['data'];
                    result=b;
                    }
                else {
                    //log('message:'+jr['message']);
                }
            }});
            return result
        }