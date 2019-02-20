class ChineseTeacher:
    def __init__(self,name):
        self.subject='语文'
        self.name=name
    def say_hi(self):
        print('大家好，我的科目是语文,我叫'+self.name)

## 上面定义了一个叫ChineseTeacher的类;

Tian=ChineseTeacher('tian')
print(Tian.name)
