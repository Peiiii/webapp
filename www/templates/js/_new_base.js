
function getDefaultWidth(el){
    var w=el.attr('actual-width')
    if(w){return Number(w)}
    return el.width();
}
function initNewBase(){
    var vport=visualViewport;
    var pri=$('.site-primary');
    var sec=$('.site-secondary');
    var pri_width=getDefaultWidth(pri);
    var sec_width=getDefaultWidth(sec);

    vport.onresize=()=>{
        //   此问题已解决
    }
}