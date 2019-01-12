import aiohttp,asyncio
from aiohttp import web
import functools,inspect,chardet
import jinja2,aiohttp
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
    def wrapAsResponse(self,dic):
        found=dic.get('__template__')
        if found:
            file=dic.pop('__template__')
            html=self.render_template(file,dic)
            return web.Response(body=html,content_type='text/html')

    def render_template(self,file, dic):
        tem = env.get_template(file)
        return tem.render(dic)



def loadText(file):
    f=open(file,'rb')
    text=f.read()
    f.close()
    encoding=chardet.detect(text)['encoding']
    text=text.decode(encoding=encoding)
    return text











class RequestHandler(object):
    def __init__(self,func):
        self.__func=func

def get(path):
    def decorator(func):
        @functools.wraps(func)
        def wapper(*args,**kws):
            rv=func(args,kws)
            return web.Response()
