from config import admin
import tool
from tool import encrypt,log

import asyncio
from orm import create_pool
from models import User, Blog, Comment, loadText, next_id



async def init():
    a=await User.deleteAll(email='1535376447@qq.com')
    uid=admin['id']
    name=admin['name']
    passwd=admin['password']
    email=admin['email']
    user=User(id=uid,name=name,passwd=encrypt(uid,passwd),email=email)
    await user.save()
    log('Create user successfully %s : %s '%(name,user))
loop=asyncio.get_event_loop()
loop.run_until_complete(init())