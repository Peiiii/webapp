import logging;logging.basicConfig(level=logging.INFO)
import asyncio,aiomysql
from config import database


class Field(object):
    def __init__(self,name,column_type,primary_key,default):
        self.name=name
        self.column_type=column_type
        self.primary_key=primary_key
        self.default=default
    def __str__(self):
        return '<%s,%s:%s>'%(self.__class__.__name__,self.column_type,self.name)

class StringField(Field):
    def __init__(self,name=None,primary_key=False,default=None,ddl='varchar(100)'):
        super().__init__(name,ddl,primary_key,default)

class IntegerField(Field):
    def __init__(self,name=None,primary_key=False,default=None,ddl='bigint'):
        super().__init__(name,ddl,primary_key,default)

class FloatField(Field):
    def __init__(self,name=None,primary_key=False,default=None,ddl='float'):
        super().__init__(name,ddl,primary_key,default)

class TextField(Field):
    def __init__(self,name=None,primary_key=False,default=None,ddl='text'):
        super().__init__(name,ddl,primary_key,default)

class BooleanField(Field):
    def __init__(self,name=None,primary_key=False,default=False,ddl='bool'):
        super().__init__(name,ddl,primary_key,default)

class ModelMetaclass(type):
    def __new__(cls, name,bases,attrs):
        if name=='Model':
            return type.__new__(cls,name,bases,attrs)
        tableName=attrs.get('__table__',None) or name
        print('Found model:%s (table : %s)'%(name,tableName))
        mappings=dict()
        fields = []
        primaryKey = None
        for k,v in attrs.items():
            # 收集主键和键
            if isinstance(v,Field):
                print('Found mapping :%s==>%s'%(k,v))
                mappings[k]=v
                if v.primary_key:
                    # 找到主键
                    if primaryKey:
                        raise RuntimeError('Duplicate primary key for %s'%k)
                    primaryKey=k
                else:
                    fields.append(k)
        if not primaryKey:
            raise RuntimeError('Primary key not found.')
        for k in mappings.keys():
            attrs.pop(k)
        escaped_fields=list(map(lambda f:'`%s`'%f,fields))
        attrs['__mappings__']=mappings
        attrs['__table__']=tableName
        attrs['__primary_key__']=primaryKey
        attrs['__fields__']=fields
        ### 映射操作到 SQL 语句
        attrs['__select__']='select `%s`,%s from `%s`'%(primaryKey,', '.join(escaped_fields),tableName)
        attrs['__insert__'] = 'insert into `%s` (%s, `%s`) values (%s)' % (\
            tableName, ', '.join(escaped_fields), primaryKey, create_args_string(len(fields)+1))
        attrs['__update__'] = 'update `%s` set %s where `%s`=?' % (\
            tableName, ', '.join(map(lambda f: '`%s`=?' % (mappings.get(f).name or f), fields)), primaryKey)
        attrs['__delete__'] = 'delete from `%s` where '%tableName
        return type.__new__(cls,name,bases,attrs)

#   字符串生成小工具
def create_args_string(size):
    string=[]
    for i in range(size):
        string.append('?')
    return ', '.join(string)

class Model(dict,metaclass=ModelMetaclass):
    def __init__(self,**kws):
        super().__init__(kws)

    def __getattr__(self,key):
        try:
            return self[key]
        except KeyError:
            raise AttributeError("'Model' object has no attribute '%s'"%key)

    def __setattr__(self, key, value):
        self[key]=value

    def getValue(self,key):
        return getattr(self,key,None)

    def getValueOrDefault(self,key):
        value=getattr(self,key,None)
        if value is None:
            try:
                field=self.__mappings__[key]
            except KeyError:
                return value
            if field.default is not None:
                value=field.default() if callable(field.default) else field.default
                logging.debug(r'Set default value for %s: %s'%(field,value))
                setattr(self,key,value)    ##仅当default 不为 None 时才将该字段设置为属性，否则不能！！！
        return value

    @classmethod
    async def find(cls,pk):
        ######## select ############
        ''' find object by primary  key '''
        rs=await select("%s where `%s`=?"%(cls.__select__,cls.__primary_key__),[pk],1)###为什么字段名称要加引号‘’呢？，这一点很奇怪！！
        if len(rs)==0:
            return None
        return cls(**rs[0])
    @classmethod
    async def findAll(cls,**kws):
        '''
        根据条件查找元素
        :param kws: 条件关键字， eg: user_id=123 ：可以找到该类别中user_id属性值为123的所有元素
        :return: 满足查找条件的所有元素，若kws为空则返回该类别的所有元素
        '''
        sql='%s'%(cls.__select__)
        where = []
        args = []
        if kws:
            for k,v in kws.items():
                where.append('%s=?'%(k))
                args.append(v)
            sql=sql+' where '+' and '.join(where)
        args=None if args==[] else args
        rs=await select(sql,args)
        if len(rs)==0:
            return []
        all=[]
        for i in rs:
            all.append(cls(**i))
        return all

    async def save(self):
        ###### insert #########
        args = list(map(self.getValueOrDefault, self.__fields__))
        args.append(self.getValueOrDefault(self.__primary_key__))  # 顺序为; 主键在最后，其余字段在前
        affected = await execute(self.__insert__, args)
        if affected != 1:
            logging.warn('failed to insert record : affected rows: %s' % affected)
    async def update(self,**kws):
        sql='update `%s` set '%(self.__table__)
        m,args=self.getSqlMatch(**kws)
        sql=sql+m+'  where `%s` =? '%self.__primary_key__
        args.append(self.__getattr__(self.__primary_key__))
        r=await execute(sql,args)
        return r

    @classmethod
    async def delete(cls,pk):
        ######## delete ############
        if not await cls.find(pk):
            logging.info('record not found: primary key :%s'%pk)
            return False
        affected=await execute(cls.__delete__+'%s=?'%cls.__primary_key__,pk)
        if not affected:
            logging.warn('failed to delete: %s'%pk)
            return False
        return affected
    @classmethod
    async def deleteAll(cls,**kws):
        if not kws:
            logging.info('deleteAll method needs more arguments. ')
            return False
        all = await cls.findAll(**kws)
        sure = input('%s records found. Are you sure to delete all?( sure ) \n请输入：' % (len(all)))
        if not sure=='sure':
            return
        conditions,args=cls.getSqlWhere(**kws)
        sql=cls.__delete__+conditions
        affected=await execute(sql,args)
        logging.info('%s records was deleted.'%(affected))
        return affected

    @classmethod
    def getSqlWhere(cls,**kws):
        where=[]
        args=[]
        for k,v in kws.items():
            where.append('%s=?'%k)
            args.append(v)
        return  ' '+' and '.join(where),  args
    @classmethod
    def getSqlMatch(cls,**kws):
        where=[]
        args=[]
        for k,v in kws.items():
            where.append('`%s`=?'%k)
            args.append(v)
        return  ' '+' and '.join(where),  args



async def create_pool(loop,**kw):
    logging.info('Creating database connection pool...')
    global __pool
    __pool= await aiomysql.create_pool(
        host=kw.get('host', 'localhost'),
        port=kw.get('port', 3306),
        user=kw['user'],
        password=kw['password'],
        db=kw['db'],
        charset=kw.get('charset', 'utf8'),
        autocommit=kw.get('autocommit', True),
        maxsize=kw.get('maxsize', 10),
        minsize=kw.get('minsize', 1),
        loop=loop
    )



async def select(sql,args=None,size=None):
    #  将输入参数 sql 中的 占位符 '?' 修改为 aiomysql 的占位符 %s，
    #  然后将     带有占位符的语句 + 占位符应填入的参数（作为一个 list 或者 tuple ）
    # 传入给 aiomysql 执行
    global __pool
    with (await __pool) as conn:
        cur=await conn.cursor(aiomysql.DictCursor)
        await cur.execute(sql.replace('?','%s'),args or ())
        if size:
            rs=await cur.fetchmany(size)
        else:
            rs=await cur.fetchall()
        await cur.close()
        logging.info('Rows returned: %s'%len(rs))
        return rs
async def execute(sql,args):
    global  __pool
    with (await __pool) as conn:
        try:
            cur=await conn.cursor(aiomysql.DictCursor)
            await cur.execute(sql.replace('?','%s'),args)
            affected=cur.rowcount
            await cur.close()
        except BaseException as e:
            raise
        return affected







loop=asyncio.get_event_loop()
loop.run_until_complete(create_pool(user=database['user'],
                                    password=database['password'],
                                    db=database['db'],
                                    loop=loop))


