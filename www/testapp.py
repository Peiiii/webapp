import asyncio
from www.orm import create_pool
from www.tools import blog_random,user_random
from www.config import config


async def test():
    u=user_random()
    b=blog_random(u)
    b['user_id']='87992224bc884b9a938921a53d7030a2'
    await u.save()
    await b.save()

loop=asyncio.get_event_loop()
loop.run_until_complete(create_pool(user=config['user'],
                                    password=config['password'],
                                    db=config['db'],
                                    loop=loop))
loop.run_until_complete(test())