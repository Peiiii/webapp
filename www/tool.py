import os, time,hashlib


def initTools():
    pass


def log(*args, num=20, str='*'):
    print(str * num, end='')
    print(*args, end='')
    print(str * num)


def writeFile(fn, s, encoding='utf-8'):
    f = open(fn, 'wb')
    a = f.write(bytes(s, encoding=encoding))
    f.close()
    return a


def loadText(file):
    import chardet
    f = open(file, 'rb')
    text = f.read()
    f.close()
    encoding = chardet.detect(text)['encoding']
    if text:
        text = text.decode(encoding=encoding)
    else:
        text = ''
    return text


def formatTime( t):
    t = time.localtime(t)
    return time.strftime('%Y/%m/%d  %H:%M:%S', t)

def encrypt(*args):
    text=':'.join(args)
    encrypted=hashlib.sha1(text.encode('utf-8')).hexdigest()
    return encrypted


class PathType:
    def __init__(self):
        self.F = 'FILE'
        self.D = 'DIR'
        self.L = 'LINK'
        self.M = 'MOUNT'


T = PathType()


class Path:
    def __init__(self, path):
        self.path = path
        self.epath = self.encodePath()
        self.name = os.path.basename(path)
        self.size = os.path.getsize(path)
        self.atime = formatTime(os.path.getatime(path))
        self.ctime = formatTime(os.path.getctime(path))
        self.mtime = formatTime(os.path.getmtime(path))
        self.type = self.getType()

    def getType(self):
        if os.path.isdir(self.path):
            return T.D
        if os.path.isfile(self.path):
            return T.F
        if os.path.islink(self.path):
            return T.L
        if os.path.ismount(self.path):
            return T.M

    def encodePath(self):
        return self.path.replace('/', '%2F')

    def children(self):
        if self.type == T.D:
            list = self.listdir()
            return [Path(i) for i in list]

    def getContent(self):
        if self.type == T.F:
            return loadText(self.path)

    def listdir(self):
        if self.type == T.D:
            l = os.listdir(self.path)
            return [self.path + '/' + i for i in l]

    def fileChildren(self):
        list = self.children()
        return [i for i in list if i.type == T.F]

    def dirChildren(self):
        list = self.children()
        return [i for i in list if i.type == T.D]

    def linkChildren(self):
        list = self.children()
        return [i for i in list if i.type == T.L]

    def mountChildren(self):
        list = self.children()
        return [i for i in list if i.type == T.M]
    def toJson(self):
        return self.__dict__
    def addContent(self):
        self.content=self.getContent()


# p=Path('e:/webapp/www/templates')
# print(p.__dict__)
##---------------------------------------##
#####专用小工具
def parsePapers(text):
    lines=text.split('\n')
    lines=[l.strip() for l in lines]
    new_lines=[]
    for i in lines:
        if i == '' or i == '\n' or i[0]=='#':
            continue
        else:
            new_lines.append(i)
    lines=new_lines
    lines=[l.title() for l in lines]
    lines.sort()
    print('records: %s'%len(lines))
    return lines
def getPaperList(pfile):
    text=loadText(pfile)
    lines=parsePapers(text)
    return lines