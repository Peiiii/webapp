import logging;logging.basicConfig(level=logging.INFO)
import asyncio,hashlib,os
from aiohttp import web
from www.orm import create_pool
from www.models import User,Blog,Comment,loadText,next_id
from www.framework import Application
from www.config import config
from  jinja2 import  Template,Environment, PackageLoader
env = Environment(loader=PackageLoader('www', 'templates'))


loop=asyncio.get_event_loop()
app=Application(loop=loop)

uid='017160c054b84780a80b772578aeb489'
@app.get('/')
async def home():
    u=await User.find(uid)
    temArtl = env.get_template('article-display.html')
    articles=await u.formBlogShortCut(temArtl,{'title':'name','summary':'summary','url':'blog_url'},max=5)
    blog_list=await u.formList()
    

    return {
        '__template__':'home2.html',
        'articles':articles,
        'dir_name':'分类目录',
        'blog_list':blog_list
    }
@app.get('/users')
async def render_users(request):
    users=await User.findAll()
    return {
        '__template__':'users.html',
        'users':users
    }
@app.get('/blog/{blog_id}')
async def render_blog(blog_id):
    blog=await Blog.find(blog_id)
    tem=env.get_template('blog_show.html')
    title=blog.name
    comments=await blog.getCommentsWrapped()
    blog_html=tem.render({'title':title,'user_name':blog.user_name, 'content':blog.content,'comments':comments})

    u = await User.find(uid)
    blog_list = await u.formList()

    return {
        '__template__':'home2.html',
        'articles':blog_html,
        'dir_name': '分类目录',
        'blog_list': blog_list
    }

@app.get('/blogs')
async def blog_list():
    blogs=await Blog.findAll()
    urls=Blog.blog_urls(blogs)
    return {
        '__template__':'home.html',
        'a':urls
    }
@app.get('/sign-up')
async def do_signup_get():
    return {
        '__template__':'sign-up-in.html',
        'sign_up':True
    }
@app.post3('/sign-up',form=True,wrap=False)
async def do_signup_post(username,email,password):
    uid=next_id()
    passwd=hashlib.sha1(('%s:%s'%(uid,password)).encode('utf-8')).hexdigest()
    exist=await User.findAll(email=email)
    if exist:
        json={'status':1,'info':'Email already used.'} #0表示失败
        return web.json_response(json)

    u = User(id=uid, name=username, email=email, passwd=passwd)
    await u.save()
    logging.info('用户注册成功，id: %s  passwd:%s'%(u.id,u.passwd))
    json={'url':'/sign-in','status':2}
    return web.json_response(json)
@app.get('/sign-in')
async def do_signin_get():
    return {
        '__template__':'sign-up-in.html',
        'sign_in':True
    }
@app.post3('/sign-in',form=True,wrap=False,headers=True)
async def do_signin_post(email,password,headers):

    u=await User.findAll(email=email)
    if not u:
        dic= {
            '__template__':'sign-up-in.html',
            'user_not_exist':True,
            'message':'User not exists.'
        }
        return app.wrapAsResponse(dic)
    u=u[0]
    passwd = hashlib.sha1(('%s:%s' % (u.id, password)).encode('utf-8')).hexdigest()
    if u.passwd!=passwd:
        print(passwd,' ',u.passwd)
        dic= {
            '__template__': 'sign-up-in.html',
            'wrong_password': True,
            'message': 'Wrong password.'
        }
        return app.wrapAsResponse(dic)
    import time
    key=str(int(time.time()))+uid+u.passwd
    key=hashlib.sha1(key.encode('utf-8')).hexdigest()
    await u.setKey(key)
    r=web.Response(status=303)
    r.set_cookie('key',key,max_age=86400)
    r.set_cookie('user_id',u.id)
    redir=headers['referer']
    print('redir:%s'%redir)
    r.headers['location']='/'
    return r



@app.get2('/api/get_user/{user_id}')
async def do_api_get_user(user_id):
    print('api get user :%s'%user_id)
    user=await User.find(user_id)
    if not user:
        logging.info('user not found..%s'%user_id)
        return web.json_response({'success':False,'message':'user not exist.'})
    return web.json_response({'success':True,'user':user})

@app.post3('/comment',json=True,cookies=True)
async def do_comment(user_id,blog_id,content,cookies):
    logging.info('cookies:%s'%cookies)
    u=await User.find(user_id)
    if not u:
        logging.warn('User %s not found'%user_id)
        message='<div class="alert alert-warning"><span class="glyphicon glyphicon-exclamation-sign"></span>你需要先登录<a href="/sign-in">前往登录</a>？</div>'
        return web.json_response(data={'success':False,'message':message})
    if u.key!=cookies['key']:
        logging.warn('User %d 持有的key 与本地数据不一致'%user_id)
        message='<div class="alert alert-warning"><span class="glyphicon glyphicon-exclamation-sign"></span>你尚未登录，<a href="/sign-in">前往登录</a>?</div>'
        return web.json_response(data={'success':False,'message':message})
    comment=Comment(
        user_id=user_id,user_name=u.name,user_image=u.image,
        blog_id=blog_id,content=content
    )
    await comment.save()
    return web.json_response(status=200,data={'success':True,'comment_wrapped':comment.wrap()})



async def init(loop):
    server = await loop.create_server(app.make_handler(),'127.0.0.1',80)
    logging.info('server started at http://127.0.0.1:80....')
    return server


app.router.add_static('/', 'static', show_index=True)

# loop.run_until_complete(create_pool(user=config['user'],
#                                     password=config['password'],
#                                     db=config['db'],
#                                     loop=loop))

loop.run_until_complete(init(loop))
loop.run_forever()








#
# def index(request):
#     name=request.match_info['name']
#     id=request.match_info['id']
#     text='<h1>Home,hello %s, your id is : %s</h1>'%(name,id)
#     return web.Response(body=text.encode('utf-8'),content_type='text/html')


# async def init(loop):
# #     app=web.Application(loop=loop)
# #     app.router.add_route('GET','/{name}/{id}',index)
# #     server = await loop.create_server(app.make_handler(),'127.0.0.1',8000)
# #     logging.info('server started at http://127.0.0.1:8000....')
# #     return server