import logging;logging.basicConfig(level=logging.INFO)
import asyncio, hashlib, os
from aiohttp import web
from orm import create_pool
from models import User, Blog, Comment, loadText, next_id
from framework import Application, templates_dir
from config import database,files,net
from jinja2 import Template, Environment, PackageLoader
from framework import apiError, jsonResponse,pageResponse
from tool import  initTools,log,Path,T
import tool
env = Environment(loader=PackageLoader('templates',''))
loop = asyncio.get_event_loop()
app = Application(loop=loop)

########################################
## 快捷工具
def pageError(template=files.error,**kws):
    return pageResponse(template=template,**kws)
def pageSign(template=files.sign_up_in,sign_in=True,**kws):
    return pageResponse(template=template,sign_in=sign_in,**kws)
class CheckState:
    '''
    case code:
    0:正常
    1：用户不存在
    2：尚未登录
    '''
    def __init__(self,success=False,code=2,message='failed',result=None):
        self.success=success
        self.code=code
        self.message=message
        self.result=result
#######################################
async def getBlogRecmendations():
    return await Blog.getAllPublic()
async def getUserRecmendations():
    return await User.findAll()
async def getBlogInfo(bid):
    pass
async def toFiller(obj,wrapper):
    pass
async def checkCookies(cookies):
    uid,key=cookies.get('user_id'),cookies.get('key')
    u=await User.find(uid)
    if not u:
        return CheckState(code=1,message='user %s not exists'%uid)
    if not u.key==key:
        return CheckState(code=2,message='尚未登录')
    else:
        return CheckState(True,code=0)
#############################################
## 响应客户端请求
@app.get2('/',cookies=True)
async def do_home(cookies):
    blogs=await getBlogRecmendations()
    users=await getUserRecmendations()
    ## 添加信息
    for b in blogs:
        b.href='/blog/'+b.id
    for u in users:
        u.href='/user/'+u.id
    return pageResponse(
        template='html/home.html',
        blogs=blogs,
        users=users
    )
## 访问博客
@app.get2('/blog/{blog_id}', cookies=True)
async def do_blog(blog_id, cookies):
    b = await Blog.find(blog_id)
    print('blog:%s' % b)
    if not b:
        print('获取博客用户不存在')
        return pageError(message='博客不存在！')
    if not b.public:
        print('not public')
        return pageError(message='你没有权限查看该博客')
    ##  收集博客信息
    u=await User.find(b.user_id)
    await b.appendComments()
    blogs=await u.getBlogs()
    for bl in blogs:
        bl.href='/blog/'+bl.id

    return pageResponse(
        template=files.visit_blog,
        blog=b,
        user=u,
        blogs=blogs
    )

## 访问用户
@app.get2('/user/{user_id}',cookies=True)
async def do_visit_user(user_id,cookies):
    try:
        u=await User.find(user_id)
    except:
        return pageError(message='用户不存在')
    blogs=await u.getPublicBlogs()
    for b in blogs:
        b.href='/blog/'+b.id

    return pageResponse(
        template=files.user_home,
        user=u,
        blogs=blogs,
        not_me=True
    )

#####################################
## 用户本人操作
## me

@app.get2('/me',cookies=True)
async def do_me_home(cookies):
    chk=await checkCookies(cookies)
    if not chk.success:
        if chk.code==1:
            return pageError(message=chk.message)
        elif chk.code==2:
            return pageSign()
    uid=cookies['user_id']
    u=await User.find(uid)
    blogs=await u.getBlogs()
    for b in blogs:
        b.href='/me/blog/'+b.id
    return pageResponse(template=files.user_home,blogs=blogs,user=u)

## 创建博客 get
@app.get2('/me/editor')
async def do_me_editor():
    return pageResponse(template=files.editor)
## 提交博客
@app.post4('/me/post_blog', json=True, cookies=True)
async def create_blog_post(blog_heading, blog_summary, blog_content, cookies):
    chk = await checkCookies(cookies)
    if not chk.success:
        if chk.code == 1:
            return pageError(message=chk.message)
        elif chk.code == 2:
            return pageSign()
    uid=cookies['user_id']
    u=await User.find(uid)
    b =await Blog.easyBlog(u, name=blog_heading, summary=blog_summary, content=blog_content)
    return jsonResponse(
        success=True,
        message='文章上传成功,<a href="/me">前往主页？</a>',
        data=b
    )
## 编辑博客 get
@app.get2('/me/editor/{blog_id}',cookies=True)
async def do_edit_get(blog_id,cookies):
    chk = await checkCookies(cookies)
    if not chk.success:
        if chk.code == 1:
            return apiError(message=chk.message)
        elif chk.code == 2:
            return pageSign()
    b = await Blog.find(blog_id)
    if not b:
        return apiError(message='博客不存在')
    if b.user_id != cookies['user_id']:
        return apiError(message='没有权限编辑该博客')
    return pageResponse(
        template=files.editor,
        edit=True,
        blog=b
    )
## 编辑博客post
@app.post4('/me/editor/{blog_id}',json=True,cookies=True)
async def do_editor_post(blog_id,blog_heading,blog_summary,blog_content,cookies):
    chk = await checkCookies(cookies)
    if not chk.success:
        if chk.code == 1:
            return apiError(message=chk.message)
        elif chk.code == 2:
            return pageSign()
    b = await Blog.find(blog_id)
    if not b:
        return apiError(message='博客不存在')
    if b.user_id != cookies['user_id']:
        return apiError(message='没有权限编辑该博客')
    u=await User.find(b.user_id)
    if blog_summary=='':
        blog_summary=blog_content[:200] if len(blog_content)>=200 else blog_content
    r=await b.update(name=blog_heading,summary=blog_summary,content=blog_content)
    if not r:
        log('failed to update blog %s'%blog_id)
        return apiError(message='更新失败')
    return jsonResponse(message='更新成功，<a href="/me">前往主页？</a>')
## 删除博客

@app.get2('/me/delete_blog/{blog_id}',cookies=True)
async def do_me_delete_blog(blog_id,cookies):
    chk = await checkCookies(cookies)
    if not chk.success:
        if chk.code == 1:
            return apiError(message=chk.message)
        elif chk.code == 2:
            return pageSign()
    b=await Blog.find(blog_id)
    if not b:
        return apiError(message='博客不存在')
    if b.user_id!=cookies['user_id']:
        return apiError(message='没有权限删除该博客')
    r=await Blog.delete(b.id)
    if not r:
        return apiError(message='删除失败')
    return jsonResponse(message='删除成功')

## 浏览自己的博客
@app.get2('/me/blog/{blog_id}', cookies=True)
async def do_blog(blog_id, cookies):
    b = await Blog.find(blog_id)
    print('blog:%s' % b)
    if not b:
        print('获取博客用户不存在')
        return pageError(message='博客不存在！')
    ##  收集博客信息
    u=await User.find(b.user_id)
    await b.appendComments()
    blogs=await u.getBlogs()
    for blog in blogs:
        blog.href='/me/blog/'+blog.id
    await b.appendComments()
    return pageResponse(
        template=files.read_my_blog,
        blog=b,
        user=u,
        blogs=blogs,
        me=True
    )















###############################################################################################################
## 登录与注册

@app.get2('/sign-up', wrap=True)
async def do_signup_get():
    return {
        '__template__': files['sign_up_in'],
        'sign_up': True
    }


@app.post4('/sign-up', form=True)
async def do_signup_post(username, email, password):
    uid = next_id()
    passwd = tool.encrypt(uid,password)
    exist = await User.findAll(email=email)
    if exist:
        json = {'status': 1, 'info': 'Email already used.'}  # 0表示失败
        return web.json_response(json)

    u = User(id=uid, name=username, email=email, passwd=passwd)
    await u.save()
    logging.info('用户注册成功，id: %s  passwd:%s' % (u.id, u.passwd))
    json = {'url': '/sign-in', 'status': 2}
    return web.json_response(json)


@app.get2('/sign-in', wrap=True)
async def do_signin_get():
    return {
        '__template__': files['sign_up_in'],
        'sign_in': True
    }


@app.post4('/sign-in', form=True, headers=True)
async def do_signin_post(email, password, headers):
    u = await User.findAll(email=email)
    if not u:
        dic = {
            '__template__': files['sign_up_in'],
            'user_not_exist': True,
            'message': 'User not exists.'
        }
        return app.wrapAsResponse(dic)
    u = u[0]
    passwd = tool.encrypt(u.id,password)
    if u.passwd != passwd:
        log('expected user:',u)
        print(passwd, ' ', u.passwd)
        dic = {
            '__template__': files['sign_up_in'],
            'wrong_password': True,
            'message': 'Wrong password.'
        }
        return app.wrapAsResponse(dic)
    import time
    key = str(int(time.time())) + u.id + u.passwd
    key = hashlib.sha1(key.encode('utf-8')).hexdigest()
    await u.setKey(key)
    r = web.Response(status=303)
    r.set_cookie('key', key, max_age=86400 * 15)
    r.set_cookie('user_id', u.id, max_age=86400 * 15)
    r.set_cookie('mode', 'normal', max_age=86400 * 15)
    redir = headers['referer']
    print('redir:%s' % redir)
    r.headers['location'] = '/me'
    return r

#############################################################################################
##  评论
## 提交评论
@app.post4('/blog/{blog_id}/comment',json=True,cookies=True)
async def do_comment_post(blog_id,content, cookies):
    chk = await checkCookies(cookies)
    if not chk.success:
        if chk.code == 1:
            return apiError(message=chk.message)
        elif chk.code == 2:
            return pageSign()
    user_id = cookies['user_id']
    logging.info('cookies:%s' % cookies)
    u = await User.find(user_id)
    if not u:
        logging.warn('User %s not found' % user_id)
        message = '<div class="alert alert-warning"><span class="glyphicon glyphicon-exclamation-sign"></span>你需要先登录<a href="/sign-in">前往登录</a>？</div>'
        return apiError(message=message)
    if u.key != cookies['key']:
        logging.warn('User %d 持有的key 与本地数据不一致' % user_id)
        message = '<div class="alert alert-warning"><span class="glyphicon glyphicon-exclamation-sign"></span>你尚未登录，<a href="/sign-in">前往登录</a>?</div>'
        return apiError(message=message)
    comment = Comment(
        user_id=user_id, user_name=u.name, user_image=u.image,
        blog_id=blog_id, content=content
    )
    logging.info('comments-object formed:%s' % comment)
    await comment.save()
    comment.format()
    tem = env.get_template(files['comment_show'])
    co = tem.render(comment=comment)
    return jsonResponse(data={'comment': co})

###################################################################################################################

# ## api
# @app.get2('/user/blog/{blog_id}/api_get_blog', cookies=True)
# async def do_comment_post(blog_id, cookies):
#     user_id = cookies['user_id']
#     logging.info('cookies:%s' % cookies)
#     u = await User.find(user_id)
#     if not u:
#         logging.warn('User %s not found' % user_id)
#         message = '<div class="alert alert-warning"><span class="glyphicon glyphicon-exclamation-sign"></span>你需要先登录<a href="/sign-in">前往登录</a>？</div>'
#         return apiError(message=message)
#     if u.key != cookies['key']:
#         logging.warn('User %d 持有的key 与本地数据不一致' % user_id)
#         message = '<div class="alert alert-warning"><span class="glyphicon glyphicon-exclamation-sign"></span>你尚未登录，<a href="/sign-in">前往登录</a>?</div>'
#         return apiError(message=message)
#     b = await Blog.find(blog_id)
#     if not b:
#         return '''博客不存在'''
#     return jsonResponse(data={'content': b.content})
#
#
#
#
#
# @app.post4('/user/create_blog', json=True, cookies=True)
# async def create_blog_post(blog_heading, blog_summary, blog_content, cookies):
#     ret = await checkUser(cookies)
#     if not ret['success']:
#         return ret['response']
#     u = ret['user']
#     b =await Blog.easyBlog(u, name=blog_heading, summary=blog_summary, content=blog_content)
#
#     return web.json_response(data={
#         'success': True,
#         'message': '文章上传成功!',
#         'blog': b
#     })
#
# ## 获取博客
# @app.get2('/user/blog/{blog_id}/', cookies=True)
# async def do_user_blog(blog_id, cookies):
#     b = await Blog.find(blog_id)
#     print('blog:%s' % b)
#     if not b:
#         print('获取博客用户不存在')
#         return '''博客不存在'''
#     r = await checkUser(cookies)
#     if not r['success']:
#         print('获取Blog未登录')
#         return '''请登录'''  ##api please sign in
#     u = r['user']
#     if u.id != b.user_id:
#         print('u.id:%s,b.user-id：%s' % (u.id, b.user_id))
#         return '''没有权限'''
#     resp = await User.getUserPage2(u.id, b)
#     return app.wrapAsResponse(resp)
#
#
# @app.get2('/user/blog/{blog_id}/edit_blog', cookies=True)
# async def user_edit_blog_get(blog_id, cookies):
#     b = await Blog.find(blog_id)
#     print('blog:%s' % b)
#     if not b:
#         print('获取博客用户不存在')
#         return '''博客不存在'''
#     r = await checkUser(cookies)
#     if not r['success']:
#         print('获取Blog未登录')
#         return '''请登录'''  ##api please sign in
#     u = r['user']
#     if u.id != b.user_id:
#         print('u.id:%s,b.user-id：%s' % (u.id, b.user_id))
#         return '''没有权限'''
#     dic = {
#         '__template__': files['user_create_blog'],
#         'blog': b,
#         'edit':True,
#         'usage':'edit'
#     }
#     return app.wrapAsResponse(dic)
#
#
# @app.post4('/user/blog/{blog_id}/edit_blog', request=True)
# async def user_edit_blog_post(blog_id, request):
#     cookies = request.cookies
#     json = await request.json()
#     blog_heading, blog_summary, blog_content = json['blog_heading'], json['blog_summary'], json['blog_content']
#     ##----------------------------##
#     b = await Blog.find(blog_id)
#     print('blog:%s' % b)
#     if not b:
#         print('获取博客用户不存在')
#         return '''博客不存在'''
#     r = await checkUser(cookies)
#     if not r['success']:
#         print('获取Blog未登录')
#         return '''请登录'''  ##api please sign in
#     u = r['user']
#     if u.id != b.user_id:
#         print('u.id:%s,b.user-id：%s' % (u.id, b.user_id))
#         return '''没有权限'''
#     ##------------------------------##
#     created_at=b.created_at
#     newBlog =await Blog.easyBlog(u, name=blog_heading, summary=blog_summary, content=blog_content,
#                       created_at=created_at)
#     await b.chownComments(newBlog.id)
#
#     await Blog.delete(blog_id)
#     r=await Blog.find(blog_id)
#     if not r:
#         print('Yes delete blog:%s!'%blog_id)
#     return jsonResponse(success=True,message='成功啦！')
# ###############################################
# ###############################################
# @app.get2('/user/manage/',cookies=True)
# async def user_manage_get(cookies):
#     ret=await checkUser(cookies)
#     if not ret['success']:
#         return
#     u=ret['user']
#     blogs=await u.getBlogs()
#     return app.wrapAsResponse({
#         '__template__':files['user_manage'],
#         'blogs':blogs
#     })
# @app.get2('/user/manage/api_delete_blog/{blog_id}',cookies=True)
# async def api_delete_blog(blog_id,cookies):
#     check=await checkBlog(blog_id,cookies)
#     json=check['json']
#     u = check['user']
#     if not check['success']:
#         return apiError(**json)
#     await Blog.delete(blog_id)
#     json['message']='成功删除博客'
#     return jsonResponse(**json)
# ###############################################################
# ############################File &  Dir###################################
#
# @app.get2('/file/edit/{filename}')
# async def do_file_edit(filename):
#     log(filename)
#     filename=decodePath(filename)
#     content=loadText(filename)
#     name=os.path.basename(filename)
#     return  app.wrapAsResponse({
#         '__template__':'file.html',
#         'file':{
#             'name':name,
#             'content':content,
#             'url':filename
#         }
#     })
# @app.post4('/file/read/{filename}')
# async def do_file_read(filename):
#     #filename=json['filename']
#     content=loadText(filename)
#     return jsonResponse(data=content)
# @app.post4('/file/write/{filename}',json=True)
# async def do_file_write(filename,content):
#     log('filename',filename)
#     writeFile(filename,content)
#     return jsonResponse(message='successfully write into file '+filename)
# def writeFile(fn,content):
#     import chardet
#     f=open(fn,'wb')
#     content1=bytes(content,encoding='utf-8')
#     log(chardet.detect(content1))
#     f.write(content1)
#     f.close()
#     return True
#
# @app.get2('/path/{path}')
# async def do_path_get(path):
#     print('path'+path)
#     #path=decodePath(path)
#     ##print(path)
#     p=Path(path)
#
#     return app.wrapAsResponse({
#         '__template__':"file.html",
#         'path':p
#     })
# def fileAndDir(path,list):
#     file_list,dir_list=[],[]
#     for i in list:
#         if os.path.isdir(path+r'/'+i):
#             dir={
#                 'name':i,
#                 'url':encodePath(path+'/'+i)
#             }
#             dir_list.append(dir)
#         else:
#             file = {
#                 'name': i,
#                 'url': encodePath(path+'/'+i)
#             }
#             file_list.append(file)
#     return {'name':os.path.basename(path),'files':file_list,'dirs':dir_list,'url':path}
# def encodePath(path):
#     return path.replace('/','%2F')
# def decodePath(path):
#     return path.replace('%20','/')
# #--------------API---------------#
# @app.get2('/api/file/get/{filename}')
# async def do_api_file_get(filename):
#     log(filename)
#     #filename=decodePath(filename)
#     f=Path(filename)
#     f.addContent()
#     return jsonResponse(f.toJson())
#
# ##############################################
# #############################################
# @app.get2('/cloud_app/get/{app_name}')
# async def do_cloud_app_get(app_name):
#     app_dir='app/'+app_name
#     file_name=app_dir+'/'+app_name+'.html'
#     html=getEasyTemplate(file_name)
#     return jsonResponse(data=html)
# @app.get2('/module/get/{module_name}')
# async def do_mudule_get(module_name):
#     module_dir='js'
#     file_name=module_dir+'/'+module_name+'.js'
#     js=getEasyTemplate(file_name)
#     return jsonResponse(data=js)
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
# ##############################################
# #############################################
# def getEasyTemplate(file_name):
#     tem=env.get_template(file_name)
#     return tem.render({})
# def getTemplate(dic):
#     found=dic.get('__template__')
#     if found:
#         file=dic.pop('__template__')
#         tem=env.get_template(file)
#         return tem.render(dic)
# ##############################################
# #############################################
#
# async def checkUser(cookies):
#     logging.info('cookies:%s' % cookies)
#     key = cookies.get('key')
#     errorRet = web.json_response(status=200, data={
#         'success': False,
#         'message': '你尚未登录，请先登录'
#     })
#     ret = {'success': False, 'response': errorRet}
#     if not key:
#         logging.info('no key.')
#         return ret
#     user_id = cookies.get('user_id')
#     u = await User.find(user_id)
#     if not u:
#         logging.info('user not found:%s' % user_id)
#         return ret
#     if not (u.key == key):
#         logging.warn('server-key:%s,client-key:%s  not matched.' % (u.key, key))
#         return ret
#     ret['success'] = True
#     ret.pop('response')
#     ret['user'] = u
#     return ret
#
# async def checkBlog(blog_id,cookies):
#     user_id=cookies.get('user_id')
#     key=cookies.get('key')
#     b=await Blog.find(blog_id)
#     u=await User.find(user_id)
#     success=False
#     message=''
#     user=None
#     if not b:
#         message='博客不存在'
#     elif not key:
#         message='你没有登录'
#     elif not u:
#         message='用户不存在'
#     elif not (user_id==b.user_id):
#         message='没有权限'
#     else:
#         success=True
#         user=u
#     return {
#         'success':success,
#         'json':{
#             'success':success,
#             'message':message
#         },
#         'user':user
#     }

###############################################################
###############################################################
#
# @app.get2('/api/get_blog/{blog_id}', cookies=True)
# async def do_api_get_blog(blog_id, cookies):
#     b = await Blog.find(blog_id)
#     r = await checkUser(cookies)
#     if not r['success']:
#         return r['response']
#     u = r['user']
#     uid = cookies['user_id']
#     if uid != u.id:
#         logging.info('serverid: %s, client_id:%s' % (u.id, blog_id))
#         return apiError(message='你没有权限查看该博客')
#     comments = await  b.getCommentsFormat()
#     b.comments = comments
#     logging.info('blog:%s' % b)
#     return jsonResponse(data=b)
#

async def init(loop):
    server = await loop.create_server(app.make_handler(), net['ip'], net['port'])
    logging.info('server started at http://127.0.0.1:80....')
    return server

print('current dir:',os.getcwd())
app.router.add_static('/', 'static', show_index=True)
print('http://127.0.0.1/user/home')
loop.run_until_complete(init(loop))
import webbrowser
print('open in a minute:')
#webbrowser.open('http://127.0.0.1:80/test.html')
# webbrowser.open('http://127.0.0.1:80/user/home')
loop.run_forever()


