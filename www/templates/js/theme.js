function executeMode(){
            cookie=getCookie();
            //log('Cookie from executeMode:');log(document.cookie);
            //log('executeMode:'+cookie['mode']);
            if(cookie['mode']==='dark'){
                modeDark();
            }
            else {
                modeNormal();
            }
        }
function modeDark(){
            elms=$('.mode');
            elms.addClass('dark');
            elms.slice(0,2).css('opacity','0.7');
            canvas_script=$('.canvas-script');
            //canvas_script.attr('opacity',canvas_script.attr('dark-opacity'));
            canvas=$('canvas');
}
function getMode(){
            cookie=getCookie();
            return cookie['mode'];
}
function modeNormal(){
            elms=$('.mode');
            elms.removeClass('dark');
            elms.slice(0,2).css('opacity','1');
            canvas_script=$('.canvas-script');
            //canvas_script.attr('opacity',canvas_script.attr('normal-opacity'));
            canvas=$('canvas');
            canvas.css('opacity',canvas_script.attr('normal-opacity'));
}
function changeMode(name){
            //log('changeMode('+name+')');
            setCookie('mode',name);
            //log(document.cookie);
            executeMode();
        }
function switchMode(){
            mode=getMode();
            //console.log('switchMode: from '+mode);
            if(mode==='normal')changeMode('dark');
            else changeMode('normal');
}

function initTheme(){
    executeMode();
}
