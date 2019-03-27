//base:jquery

function initClassStickToTop(){
    var el_css={'position':'fixed','top':'0'};
    var enter_css={'position':'static'};
    var els=$('.stick-to-top');
    els.map((n,el)=>{
        var el=$(el);
        var original_height=el.height();
        log(original_height)
        enter_css['height']=String(original_height)+'px';
        $(document).scroll(()=>{
            var top=$(document).scrollTop();
            var my_height=el.height();log('my height:');log(my_height);log('top:');log(top)
            var r_height=Number(el.attr('height-remained'));
            el_css['height']=r_height+'px';
            if(top>=original_height-r_height){el.css(el_css);log('top:'+top)}
            log('top:'+top);
            if(top<=0){log('yes');el.css(enter_css)}
        })
    })
}

function initClass(){
    initClassStickToTop();
}