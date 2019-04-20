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
def writeFile(fn, s, encoding='utf-8'):
    f = open(fn, 'wb')
    a = f.write(bytes(s, encoding=encoding))
    f.close()
    return a
def parsePapers(text):
    lines=text.split('\n')
    lines=[l.strip() for l in lines]
    for i in lines:
        if i == '' or i == '\n':
            lines.remove(i)
    lines.sort()
    return lines
def loadPapers(file):
    text=loadText(file)
    print(text)
    papers=parsePapers(text)
    list=[]
    for p in papers:
        list.append('<li style="border-bottom:solid gray 1px;">%s</li>'%(p))
    html='\n'.join(list)
    return html
def writetohtml(f_tem,f_tar,text):
    import jinja2
    from jinja2 import  Template,Environment,PackageLoader
    env = Environment(loader=PackageLoader('tools', ''))
    tem=env.get_template(f_tem)
    html=tem.render(paperlist=text)
    writeFile(f_tar,html)
def main():
    infile='papers.txt'
    outfile='papers_sorted.txt'
    f_tem='board.html'
    f_tar='../www/templates/html/board.html'
    html=loadPapers(infile)
    f=open(outfile,'wb')
    f.write(html.encode('utf-8'))
    f.close()

    plist=loadText(outfile)
    writetohtml(f_tem,f_tar,plist)

if __name__=='__main__':
    main()