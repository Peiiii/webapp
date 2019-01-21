import asyncio
from www.orm import create_pool
from www.config import config
from www.models import Blog,User,Comment

async def init():
    u=User.user_random()
    b=Blog.blog_random(u)
    await u.save()
    print(u.id)
    await b.save()

async def loadBlogs(uid):
    u=await User.find(uid)
    dir=r'static\resources'
    blogs=u.loadBlogs(dir,puretext=True)
    for i in blogs:
        await i.save()
        print('%s  (%s)==>\n\t%s'%(i.name,i.user_id,i.summary))
async def show_blogs(uid):
    u=await User.find(uid)
    blogs=await u.getBlogs()
    for i in blogs:
        print(i.name)
async def testDelete(uid):
    u=await User.find(uid)
    await Blog.deleteAll(user_id=uid)
    blogs=await u.getBlogs()
    print(blogs)
async def creCom(uid):
    blogs=await Blog.findAll(user_id=uid)
    for b in blogs:
        await b.comments_random()
    co=await b.getCommentsWrapped()
    print(co)
async def initialize():
    await init()
    u=User.user_random()
    await u.save()
    print(u.id)
    await loadBlogs(u.id)

loop=asyncio.get_event_loop()
loop.run_until_complete(create_pool(user=config['user'],
                                    password=config['password'],
                                    db=config['db'],
                                    loop=loop))
loop.run_until_complete(initialize())