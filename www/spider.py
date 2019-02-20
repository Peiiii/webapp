import requests,re
def writeFile(fn,s,encoding='utf-8'):
    f=open(fn,'wb')
    a=f.write(bytes(s,encoding=encoding))
    f.close()
    return a
def HTMLToText(html):
    pass
def findArticle(s):
    ptn = re.compile('<div class="article-content-box">.*</div>\n<div id="articlePager">', re.S)
    result=ptn.findall(s)
    return result[0]

def fetchIntoFile(uf,ids,fdir):
    for i in ids:
        url=i.join(uf)
        html=requests.get(url).text
        fn=fdir+'/atl'+i+'.txt'
        writeFile(fn,findArticle(html))


if __name__=='__main__':
    fdir = './templates/resources'

    fpath = '../trash/a.txt'
    uf = ['http://www.nfcmag.com/article/', '.html']
    ids = list(range(8563, 8584))
    ids=[str(i) for i in ids]
    fetchIntoFile(uf,ids,fdir)

