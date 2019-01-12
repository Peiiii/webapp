from www.models import User,Blog
import random,uuid,time
from www.templates.resources import last_names,first_names

def str_random(n=None):
    if not n:
        a = random.randint(4, 15)
    else:
        less = int(2 * n / 3)
        more = int(3 * n / 2)
        a = random.randint(less, more)
    string = []
    for i in range(a):
        string.append(random.choice(first_names))
    return ''.join(string)


def user_random():
    id=uuid.uuid4().hex
    email=str(time.time())+'@qq.com'
    name=random.choice(last_names)+random.choice(first_names)
    passwd=random.randint(1,10000)
    image='about:blank'
    return User(id=id,email=email,name=name,passwd=passwd,image=image)
def blog_random(user):
    id=uuid.uuid4().hex
    user_id=user['id']
    user_name=user['name']
    user_image=user['image']
    name=str_random()
    summary=str_random(30)
    content=str_random(200)
    return Blog(id=id,user_id=user_id,
                user_name=user_name,
                user_image=user_image,
                name=name,summary=summary,content=content)

def blog_urls(blogs):
    html=[]
    for blog in blogs:
        p='<p><a href="blog/%s">%s</a></p>'%(blog.id,blog.name)
        html.append(p)
    return '\n'.join(html)