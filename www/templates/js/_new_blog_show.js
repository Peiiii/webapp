

$(document).ready(function(){
        var msg_box=$('#message');
        msg_box.click(()=>{hide(msg_box)});
        var app_comment=new Vue({
            el:'#comment-area',
            data:{
                comment:'',
            },
            methods:{
                submit_comment:function(){
                    vm=this;
                    var msg_box=$('#message');
                    var comment_input=$('#comment-input');
                    loc=window.location.href;
                    var bid=$('#article').attr('blog_id');
                    $.post('/blog/'+bid+'/comment',JSON.stringify({content:comment_input.val()}),function(jr){
                    log('submit_comment:');
                        form=$('#comment-form');
                        if(jr['success']){
                            msg_box.html(jr['data']['comment']);
                            show(msg_box);
                            comment_input.val('');
                        }
                        else{
                            msg_box.html(jr['message']);
                            show(msg_box)
                        }
                    })
                }
            }
        })
    })

