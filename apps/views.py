import json
from django.shortcuts import render, redirect
from django.contrib.auth.forms import PasswordResetForm, AuthenticationForm
from django.contrib import messages
from django.contrib.auth import login as auth_login, authenticate
from django.db import connections, utils
from django.http import JsonResponse
from pathlib import Path
from django.conf import settings

# Create your views here.

"""
@description  :
---------
@param  :
-------
@Returns  :
-------
"""

# 添加主界面
# def index(request):
#     return render(request, 'index.html')
def home(request):
    # try:
        connections['default'].ensure_connection()
        return redirect('login')
    # except Exception as e:
    #     print(f"Database connection error: {str(e)}")
    #     return redirect('init_db')

# 初始化数据库
# def init_db(request):
#     error = None
#     if request.method == 'POST':
#         # 获取表单
#         db_config = {   
#             'DB_NAME': request.POST.get('db_name'),
#             'DB_USER': request.POST.get('db_user'),
#             'DB_HOST': request.POST.get('db_host', 'localhost'),
#             'DB_PORT': request.POST.get('db_port', '3306'),
#             'DB_PASSWORD': request.POST.get('db_password')
#         }
#         #  测试连接
#         try:
#             conn = connections.create_connection(
#                 alias = 'temp',
#                 settings={
#                     'ENGINE': 'django.db.backends.mysql',
#                     **db_config
#                 }
#             )
#             conn.ensure_connection()
#             conn.close()
            
#             # 保存配置
#             with open(Path(settings.BASE_DIR) / 'config.json', 'w') as f:
#                 json.dump(db_config, f)
            
#             return render(request, 'setup_success.html')
#         except Exception as e:
#             error = f'连接失败: {str(e)}'
#     return render(request, 'init_db.html', {'error': error})

# 添加登录主界面
def login(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            # user = authenticate(
            #     username=form.cleaned_data['username'],
            #     password=form.cleaned_data['password'],
            # )
            # if user:
            #     auth_login(request, user)
            user = form.get_user()
            auth_login(request, user)
            
            # 处理记住我功能
            if not request.POST.get('remember_me'):
                request.session.set_expiry(0) # 浏览器关闭过期

            return redirect('home') # 登录成功跳转
    else:
        form = AuthenticationForm()
    return render(request, 'login.html', {'form': form})

# 实现忘记密码功能
def ForgotPassword(request):
    if request.method == 'POST':
        form = PasswordResetForm(request.POST)
        if form.is_valid():
            form.save(
                request=request,
                email_template_name='',
                subject_template_name='',
            )
            messages.success(request, '暂未实现邮件发送功能，请联习管理员')
            return redirect(reversed('login'))
    else:
        form = PasswordResetForm()
    return render(request, 'forgot-password.html', {'form': form})
    # return render(request, 'forgot-password.html')