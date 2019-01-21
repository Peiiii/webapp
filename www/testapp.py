import asyncio
from www.orm import create_pool
from www.apis import blog_random,user_random
from www.config import config
from models import Blog,User,Comment

uid='a9aaf78de22542e3b1f61f0d6d1d8acc'
async def init():
    u=user_random()
    b=blog_random(u)
    await u.save()
    print(u.id)
    await b.save()

async def testLoad():
    u=await User.find(uid)
    dir=r'static\resources'
    blogs=u.loadBlogs(dir,puretext=True)
    for i in blogs:
        await i.save()
        print('%s  (%s)==>\n\t%s'%(i.name,i.user_id,i.summary))
async def show_blogs():
    u=await User.find(uid)
    blogs=await u.getBlogs()
    for i in blogs:
        print(i.name)
async def testDelete():
    u=await User.find(uid)
    await Blog.deleteAll(user_id=uid)
    blogs=await u.getBlogs()
    print(blogs)
async def creCom():
    blogs=await Blog.findAll(user_id=uid)
    for b in blogs:
        await b.comments_random()
    co=await b.getCommentsWrapped()
    print(co)


loop=asyncio.get_event_loop()
loop.run_until_complete(create_pool(user=config['user'],
                                    password=config['password'],
                                    db=config['db'],
                                    loop=loop))
loop.run_until_complete(creCom())