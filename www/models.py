import time,uuid,os,random
from www.orm import Model,StringField, FloatField,TextField,BooleanField
from jinja2 import Template
from www.resources import last_names,first_names




def next_id():
    return '%015d%s000'%(int(time.time())*1000,uuid.uuid4().hex)
def name_default():
    return 'Someone'

class User(Model):
    __table__='users'
    id=StringField(primary_key=True,default=next_id,ddl='varchar(50)')
    email=StringField(ddl='varchar(50)')
    passwd=StringField(ddl='varchar(100)')
    admin=BooleanField(default=0)
    name = StringField(ddl='varchar(50)',default=name_default)
    image=StringField(ddl='varchar(50)',default='about:blank')
    created_at = FloatField(default=time.time)
    key=StringField(ddl='varchar(100)',default=None)
    def loadBlog(self,file,puretext=False,summary_length=100):
        name=os.path.split(file)[-1].split('.')[0]
        content=loadText(file)
        if puretext:
            content=wrapText(content)
        summary=content[:summary_length] if len(content)>=summary_length else content
        id=next_id()
        user_id=self.id
        user_name=self.name
        user_image=self.image
        created_at=time.time()
        return Blog(
            name=name,content=content,summary=summary,
            user_id=user_id,user_name=user_name,user_image=user_image,
            id=id,created_at=created_at
        )
    def loadBlogs(self,path,puretext=False):
        blogs=[]
        for file in os.listdir(path):
            if not '.' in file:
                continue
            fp=path+os.sep+file
            blog=self.loadBlog(fp,puretext)
            blogs.append(blog)
        return blogs
    async def getBlogs(self):
        blogs=await Blog.findAll(user_id=self.id)
        return blogs
    async def deleteBlog(self):
        pass
    async def formBlogShortCut(self,template,dic={'title': 'title', 'summary': 'summary','url':'blog_url'},max=5):
        # 用 HTML 展示 博客列表
        # dic的格式如： {'title': 'title', 'summary': 'summary'},前一个title指模板中的 变量名，后一个title为要替换模板的blog的属性名
        # dic2 将dic 中的 value 作为Blog的属性名去获取相应属性，从而 使dic2可以作为template.render()的输入参数
        blogs = await self.getBlogs()
        articles = []
        dic2={}
        url=False
        try:
            url=dic.pop('url')
        except:
            pass

        for b in blogs:
            for k,v in dic.items():
                dic2[k]=getattr(b,v,None)
                if not dic2[k]:
                    dic2[k]=dic[k]
            if url:
                dic2[url] =b.url()

            article = template.render(dic2)
            articles.append(article)
        articles = '\n'.join(articles[:max])
        return articles

    async def formList(self,li='<li>{{blog_url}}</li>',ul='<ul>{{blog_urls}}</ul>'):
        blogs = await self.getBlogs()
        temLi=Template(li)
        temUl=Template(ul)
        urls=[]
        for b in blogs:
            url=b.url_wrapped()
            urls.append(temLi.render({'blog_url':url}))
        urls='\n'.join(urls)
        return temUl.render({'blog_urls':urls})
    @classmethod
    def user_random(cls):
        id = uuid.uuid4().hex
        email = str(time.time()) + '@qq.com'
        name = random.choice(last_names) + random.choice(first_names)
        passwd = random.randint(1, 10000)
        image = 'about:blank'
        return cls(id=id, email=email, name=name, passwd=passwd, image=image)
    async def setKey(self,key):
        return await self.update(key=key)


class Blog(Model):
    __table__ = 'blogs'

    id = StringField(primary_key=True, default=next_id, ddl='varchar(50)')
    user_id = StringField(ddl='varchar(50)')
    user_name = StringField(ddl='varchar(50)',default='...')
    user_image = StringField(ddl='varchar(500)')
    name = StringField(ddl='varchar(50)')
    summary = StringField(ddl='varchar(200)',default='...')
    content = TextField(default='...')
    created_at = FloatField(default=time.time)


    @classmethod
    def loadBlog(cls,file,user):
        name=os.path.split(file)[-1]
        content=loadText(file)
        summary=content[:50] if len(content)>=50 else content
        id=next_id()
        user_id=user.id
        user_name=user.name
        user_image=user.image
        created_at=time.time()
        return Blog(
            name=name,content=content,summary=summary,
            user_id=user_id,user_name=user_name,user_image=user_image,
            id=id,created_at=created_at
        )

    @classmethod
    def blog_urls(cls, blogs):
        html = []
        for blog in blogs:
            p = '<a href="/blog/%s">%s</a>' % (blog.id, blog.name)
            html.append(p)
        return '\n'.join(html)
    def url_wrapped(self):
        return '<a href="/blog/%s">%s</a>'%(self.id,self.name)
    def url(self):
        return '/blog/%s'%self.id

    @classmethod
    def blog_random(cls,user):
        id = uuid.uuid4().hex
        user_id = user['id']
        user_name = user['name']
        user_image = user['image']
        name = str_random()
        summary = str_random(30)
        content = str_random(200)
        return cls(id=id, user_id=user_id,
                    user_name=user_name,
                    user_image=user_image,
                    name=name, summary=summary, content=content)
    async def comments_random(self,n=4):
        comments=[]
        for i in range(n):
            comment=Comment.comment_random(self.id)
            await comment.save()
            comments.append(comment.wrap())
        return ''.join(comments)
    async def getComments(self):
        comments=await Comment.findAll(blog_id=self.id)
        return comments
    async def getCommentsWrapped(self):
        comments = await Comment.findAll(blog_id=self.id)
        if not comments:
            return '<div class="text-success"> 还没有评论，不如评论一下作者的的文章吧！</div>'
        comments_wrapped=[c.wrap() for c in comments]
        comments_wrapped.reverse()
        return '\n'.join(comments_wrapped)





TEM_COM_WRAP='<div><label>{{user_name}}</label><span style="padding-left:20px;">{{datetime}}</span><p>{{content}}</p></div><hr style="border:solid #ccc 1px;">'

class Comment(Model):
    __table__ = 'comments'

    id = StringField(primary_key=True, default=next_id, ddl='varchar(50)')
    blog_id = StringField(ddl='varchar(50)')
    user_id = StringField(ddl='varchar(50)')
    user_name = StringField(ddl='varchar(50)')
    user_image = StringField(ddl='varchar(500)')
    content = TextField()
    created_at = FloatField(default=time.time)
    @classmethod
    def comment_random(cls,blog_id):
        '''生成随机评论对象返回'''
        id=next_id()
        user=User.user_random()
        content=str_random(20)
        created_at=time.time()
        return cls(id=id,blog_id=blog_id,
                   user_id=user.id,user_name=user.name,user_image=user.image,
                   content=content,created_at=created_at)
    def wrap(self,template=TEM_COM_WRAP):
        from jinja2 import Template
        tem=Template(template)
        return tem.render({'user_name':self.user_name,'datetime':self.dateTime(),'content':self.content})
    def dateTime(self):
        t=self.created_at
        t=time.localtime(t)
        return time.strftime('%Y/%m/%d--%H:%M:%S',t)






def wrapText(text):
    return text.replace('\n','</p> <p>')

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
def loadText(file):
    import chardet
    f=open(file,'rb')
    text=f.read()
    f.close()
    encoding=chardet.detect(text)['encoding']
    text=text.decode(encoding=encoding)
    return text
