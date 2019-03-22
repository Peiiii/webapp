trash.modules.push('com');
function getJson(url){
    r=$.get({url:url,async:false});
    return r.responseJSON;
}