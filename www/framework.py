import functools,inspect,chardet
import aiohttp,asyncio,jinja2
import logging;logging.basicConfig(level=logging.INFO)
from aiohttp import web as web
from  jinja2 import  Template,Environment, PackageLoader

templates_dir='templates'
env = Environment(loader=PackageLoader('www', 'templates'))


class Application(web.Application):
    def get(self,path):
        def decorator(func):
            args=inspect.getargspec(func).args
            @functools.wraps(func)
            async def wrapper(request):
                if args!=[]:
                    params = []
                    req=False
                    if args[-1]=='request':
                        req=args.pop()
                    for i in args:
                        try:
                            params.append(request.match_info[i])
                        except:
                            raise Exception('函数%s参数定义不匹配' % func.__name__)
                    if req:
                        params.append(request)

                    retdict =await func(*params)
                else:
                    retdict =await func()
                response=self.wrapAsResponse(retdict)
                return response
            self.router.add_route('GET',path,wrapper)
            return wrapper
        return decorator
    def get2(self,path):
        def decorator(func):
            args=inspect.getargspec(func).args
            @functools.wraps(func)
            async def wrapper(request):
                if args!=[]:
                    params = []
                    req=False
                    if args[-1]=='request':
                        req=args.pop()
                    for i in args:
                        try:
                            params.append(request.match_info[i])
                        except:
                            raise Exception('函数%s参数定义不匹配' % func.__name__)
                    if req:
                        params.append(request)

                    response =await func(*params)
                else:
                    response =await func()
                return response
            self.router.add_route('GET',path,wrapper)
            return wrapper
        return decorator
    def post(self,path,no_return_wrap=False,json=False):
        def decorator(func):
            args=inspect.getargspec(func).args  ##获取原函数参数
            if no_return_wrap:
                @functools.wraps(func)
                async def wrapper2(request):
                    form = await request.post()
                    if args != []:
                        params = []
                        req = False
                        if args[-1] == 'request':
                            req = args.pop()  ##args只包含除request以外的参数， request 参数需要单独处理
                        for i in args:
                            try:
                                params.append(form[i])
                            except:
                                raise Exception('函数%s参数%s定义不匹配' % (func.__name__, i))
                        if req:
                            params.append(request)

                        response = await func(*params)
                    else:
                        response= await func()
                    return response

                self.router.add_route('POST', path, wrapper2)
                return wrapper2


            @functools.wraps(func)
            async def wrapper1(request):
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

                    retdict =await func(*params)
                else:
                    retdict =await func()
                response=self.wrapAsResponse(retdict)
                return response
            self.router.add_route('POST',path,wrapper1)
            return wrapper1



        return decorator
    def post2(self,path):
        def decorator(func):
            args=inspect.getargspec(func).args  ##获取原函数参数
            @functools.wraps(func)
            async def wrapper(request):
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
    def post3(self,path,req=False,json=False,form=True,wrap=False): ##req,json,form同时只能有一个为True
        def decorator(func):
            args=inspect.getargspec(func).args  ##获取原函数参数
            @functools.wraps(func)
            async def wrapper(request):
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
                    if args != []:  ##函数所需参数个数不为零
                        params = []
                        for i in args:
                            try:
                                params.append(data[i])
                            except:
                                raise Exception('函数%s参数%s定义不匹配' % (func.__name__, i))
                        ret = await func(*params)
                    else:
                        ret = await func()
                if wrap: ##函数返回值还需进行包装
                    return self.wrapAsResponse(wrap)
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
