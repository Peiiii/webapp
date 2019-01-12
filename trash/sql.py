import asyncio,aiomysql,logging
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



async def select(sql,args,size=None):
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
loop.run_until_complete(create_pool(loop,
                                    user='root',
                                    password='password',
                                    db='test'))


