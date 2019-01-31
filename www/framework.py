import functools,inspect,chardet
import aiohttp,asyncio,jinja2
import logging;logging.basicConfig(level=logging.INFO)
from aiohttp import web as web
from  jinja2 import  Template,Environment, PackageLoader

templates_dir='templates'
env = Environment(loader=PackageLoader('www', 'templates'))


class Application(web.Application):

    def get2(self,path,wrap=False,cookies=False,headers=False,request=False):  ## 与get1不同，get2的没有对返回值的包装，因此原函数需自己返回一个web.Responce对象
        def decorator(func):
            args=inspect.getargspec(func).args
            @functools.wraps(func)
            async def wrapper(req):
                logging.info('run %s' % func.__name__)
                args2=args.copy()
                if request:
                    r=args2.pop(-1)
                    if r!='request':
                        raise Exception('参数最后一个应为request')
                elif cookies:
                    co=args2.pop(-1)
                    if co!='cookies':
                        raise Exception('参数最后一个应为cookies')
                elif headers:
                    h=args2.pop(-1)
                    if h!='headers':
                        raise Exception('参数最后一个应为headers')
                params=[]
                for i in args2:
                    try:
                        params.append(req.match_info[i])
                    except:
                        raise Exception('函数%s参数%s定义不匹配' % (func.__name__,i))
                if request:
                    params.append(req)
                elif headers:
                    params.append(req.headers)
                elif cookies:
                    params.append(req.cookies)
                response =await func(*params)
                if wrap:
                    response=self.wrapAsResponse(response)
                return response
            self.router.add_route('GET',path,wrapper)
            return wrapper
        return decorator
    def post2(self,path):
        def decorator(func):
            args=inspect.getargspec(func).args  ##获取原函数参数
            @functools.wraps(func)
            async def wrapper(request):
                logging.info('run %s' % func.__name__)
                form= await request.post()
                if args!=[]:
                    params = []
                    req=False
                    if args[-1]=='request':
                        req=args.pop()  ##args只包含除request以外的参数， request 参数需要单独处理
                    for i in args:
                        try:
                            params.append(form[i])
                        except:
                            raise Exception('函数%s参数%s定义不匹配' % (func.__name__,i))
                    if req:
                        params.append(request)
                    response =await func(*params)
                else:
                    response =await func()
                return response
            self.router.add_route('POST',path,wrapper)
            return wrapper
        return decorator

    def post3(self,path,req=False,json=False,form=True,cookies=False,headers=False,wrap=False): ##req,json,form同时只能有一个为True
        def decorator(func):
            args1=inspect.getargspec(func).args  ##获取原函数参数            @functools.wraps(func)
            async def wrapper(request):
                logging.info('run %s'%func.__name__)
                args=args1.copy()
                if cookies:
                    last=args.pop()
                    if last!='cookies':
                        raise Exception('函数%s最后一个参数应为cookies,而非%s'%(func.__name__,last))
                elif headers:
                    last=args.pop()
                    if last!='headers':
                        raise Exception('函数%s最后一个参数应为headers,而非%s'%(func.__name__,last))
                if req:  ##  直接将request作为参数
                    if len(args)!=1:
                        raise Exception('函数%s参数个数应为一个'%func.__name__)
                    ret=await func(request)
                else:
                    if form: ## 参数来源：表单
                        data = await request.post()
                    if json:  ##参数来源： json
                        data = await request.json()
                        logging.info('json data:%s'%(data))
                    params = []
                    for i in args:
                        try:
                            params.append(data[i])
                        except:
                            raise Exception('函数%s参数%s定义不匹配' % (func.__name__, i))
                    if cookies:
                        co= request.cookies
                        params.append(co)
                    elif headers:
                        co= request.headers
                        params.append(co)
                    ret = await func(*params)
                if wrap: ##函数返回值还需进行包装
                    return self.wrapAsResponse(wrap)
                return ret
            self.router.add_route('POST',path,wrapper)
            return wrapper
        return decorator
    def post4(self,path,request=False,json=False,form=False,cookies=False,headers=False,wrap=False): ##req,json,form同时只能有一个为True
        def decorator(func):
            args1=inspect.getargspec(func).args  ##获取原函数参数            @functools.wraps(func)
            async def wrapper(req):
                logging.info('run %s'%func.__name__)
                args=args1.copy()
                if cookies:
                    last=args.pop()
                    if last!='cookies':
                        raise Exception('函数%s最后一个参数应为cookies,而非%s'%(func.__name__,last))
                elif headers:
                    last=args.pop()
                    if last!='headers':
                        raise Exception('函数%s最后一个参数应为headers,而非%s'%(func.__name__,last))
                elif request:  ##  直接将request作为参数
                    last = args.pop()
                    if last != 'request':
                        raise Exception('函数%s最后一个参数应为request,而非%s' % (func.__name__, last))

                if form:  ## 参数来源：表单
                    data = await req.post()
                elif json:  ##参数来源： json
                    data = await req.json()
                    logging.info('json data:%s' % (data))
                else:
                    data = req.match_info
                params = []
                for i in args:
                    try:
                        params.append(data[i])
                    except:
                        raise Exception('函数%s参数%s定义不匹配' % (func.__name__, i))
                if cookies:
                    co = req.cookies
                    params.append(co)
                elif headers:
                    co = req.headers
                    params.append(co)
                elif request:
                    params.append(req)
                ret = await func(*params)
                if wrap: ##函数返回值还需进行包装
                    ret=self.wrapAsResponse(ret)
                return ret
            self.router.add_route('POST',path,wrapper)
            return wrapper
        return decorator

    def add_route(self,**kws):
        def decorator(func):
            @functools.wraps(func)
            async def wrapper(request):
                return await func(request)
            self.router.add_route(**kws)
            return wrapper
        return decorator
    @classmethod
    def wrapAsResponse(cls,dic):
        found=dic.get('__template__')
        if found:
            file=dic.pop('__template__')
            html=cls.render_template(file,dic)
            return web.Response(body=html,content_type='text/html')
        json=dic.get('json')
        if json:
            return web.json_response(json)
    @classmethod
    def render_template(cls,file, dic):
        tem = env.get_template(file)
        return tem.render(dic)



    # def get(self,path):
    #     def decorator(func):
    #         args=inspect.getargspec(func).args
    #         @functools.wraps(func)
    #         async def wrapper(request):
    #             logging.info('run %s' % func.__name__)
    #             if args!=[]:
    #                 params = []
    #                 req=False
    #                 if args[-1]=='request':
    #                     req=args.pop()
    #                 for i in args:
    #                     try:
    #                         params.append(request.match_info[i])
    #                     except:
    #                         raise Exception('函数%s参数定义不匹配' % func.__name__)
    #                 if req:
    #                     params.append(request)
    #
    #                 retdict =await func(*params)
    #             else:
    #                 retdict =await func()
    #             response=self.wrapAsResponse(retdict)
    #             return response
    #         self.router.add_route('GET',path,wrapper)
    #         return wrapper
    #     return decorator
def render_template(self,file, dic):
    tem = env.get_template(file)
    return tem.render(dic)














class RequestHandler(object):
    def __init__(self,func):
        self.__func=func

def get(path):
    def decorator(func):
        @functools.wraps(func)
        def wapper(*args,**kws):
            rv=func(args,kws)
            return web.Response()
