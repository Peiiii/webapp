from aiohttp import web



def jsonResponse(data=False,success=True,message=False,redirect=False):
    return web.json_response(data={
        'data': data,
        'success': success,
        'message': message,
        'redirect': redirect
    })
def apiError(message='Error',redirect=False,data=False,success=False):
    if data or success:
        raise Exception
    return jsonResponse(
        data=data,
        success=success,
        message=message,
        redirect=redirect
    )

