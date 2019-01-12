import logging;logging.basicConfig(level=logging.INFO)
import asyncio
from orm import create_pool
from models import User,Blog,Comment
from webtools import Application,loadText
from config import config
from tools import blog_urls


loop=asyncio.get_event_loop()
app=Application(loop=loop)


@app.get('/')
async def home():
    a=loadText('templates/a.txt')
    return {
        '__template__':'home.html',
        'a':a
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
    return {
        '__template__':'home.html',
        'a':blog.content
    }

@app.get('/blogs')
async def blog_list():
    blogs=await Blog.findAll()
    urls=blog_urls(blogs)
    return {
        '__template__':'home.html',
        'a':urls
    }

async def init(loop):
    server = await loop.create_server(app.make_handler(),'127.0.0.1',8000)
    logging.info('server started at http://127.0.0.1:8000....')
    return server


app.router.add_static('/prefix', 'templates', show_index=True)

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