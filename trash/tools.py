
import random,uuid,time
from resources import last_names,first_names
import chardet



def loadText(file):
    f=open(file,'rb')
    text=f.read()
    f.close()
    encoding=chardet.detect(text)['encoding']
    text=text.decode(encoding=encoding)
    return text
def loadText(file):
    f=open(file,'rb')
    text=f.read()
    f.close()
    encoding=chardet.detect(text)['encoding']
    text=text.decode(encoding=encoding)
    return text
