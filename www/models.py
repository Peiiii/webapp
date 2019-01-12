import time,uuid
from orm import Model,StringField, FloatField,TextField,BooleanField


def next_id():
    return '%015d%s000'%(int(time.time())*1000,uuid.uuid4().hex)
def name_default():
    return 'Someone'

class User(Model):
    __table__='users'
    id=StringField(primary_key=True,default=next_id,ddl='varchar(50)')
    email=StringField(ddl='varchar(50)')
    passwd=StringField(ddl='varchar(50)')
    admin=BooleanField()
    name = StringField(ddl='varchar(50)',default=name_default)
    image=StringField(ddl='varchar(50)',default='about:blank')
    created_at = FloatField(default=time.time)

class Blog(Model):
    __table__ = 'blogs'

    id = StringField(primary_key=True, default=next_id, ddl='varchar(50)')
    user_id = StringField(ddl='varchar(50)')
    user_name = StringField(ddl='varchar(50)',default='...')
    user_image = StringField(ddl='varchar(500)')
    name = StringField(ddl='varchar(50)')
    summary = StringField(ddl='varchar(200)',default='...')
    content = TextField(default='...')
    created_at = FloatField(default=time.time)



class Comment(Model):
    __table__ = 'comments'

    id = StringField(primary_key=True, default=next_id, ddl='varchar(50)')
    blog_id = StringField(ddl='varchar(50)')
    user_id = StringField(ddl='varchar(50)')
    user_name = StringField(ddl='varchar(50)')
    user_image = StringField(ddl='varchar(500)')
    content = TextField()
    created_at = FloatField(default=time.time)






