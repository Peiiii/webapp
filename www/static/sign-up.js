$(document).ready(function (){
            form=$('#sign-up-in-form');
            button=$('#sign-up-submit');
            button.click(function (){
                $.post('/sign-up',form.serialize(),function(result){
                    status=result['status'];
                    if(status==='1'){
                        info=result['info'];
                        a=$('#email');
                        alert='<div class="alert alert-warning"><span class="glyphicon glyphicon-exclamation-sign"></span>'+info+'</div>';
                        a.before(alert);
                        a.val('');
                        button.after('<span style="margin-left:20px;">直接登录？  <a href="/sign-in">sign in</a></span>');
                    }
                    else{
                        window.location.href='/sign-in';
                    }
                });
            });

        })
