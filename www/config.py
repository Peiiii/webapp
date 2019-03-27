
class Config(dict):
    def __getattr__(self, item):
        try:
            r=self.__getitem__(item)
            return r
        except:
            raise AttributeError('No attribute %s'%item)

admin=Config(
    name='top',
    password='password',
    id='00000000001',
    email='1535376447@qq.com'
)
net=Config(
    ip='0.0.0.0',
    port=80,
    domain='localhost'
)
database=Config(
    user='root',
    password='password',
    db='webapp2'
)
files=Config(
    base='html/_base.html',
    sign_up_in='html/sign_up_in.html',
    user_home='html/_new_user_home.html',
    home='html/home.html',
    user_manage='html/user_manage.html',
    editor='html/editor.html',
    article_display='html/_feedlist.html',
    comment_show='html/_comment_show.html',
    error='html/error.html',
    visit_blog='html/_new_visit_blog.html',
    read_my_blog='html/_new_read_my_blog.html',
    test='html/_new_base.html'
)

