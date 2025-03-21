from django.shortcuts import render, redirect
from django.contrib.auth.forms import PasswordResetForm
from django.contrib import messages

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
def index(request):
    return render(request, 'index.html')

# 添加登录主界面
def login(request):
    return render(request, 'login.html')

# 实现忘记密码功能
def ForgotPassword(request):
    # if request.method == 'POST':
    #     form = PasswordResetForm(request.POST)
    #     if form.is_valid():
    #         form.save(request=request)
    #         messages.success(request, '暂未实现邮件发送功能，请联习管理员')
    #         return redirect(reversed('login'))
    # else:
    #     form = PasswordResetForm()
    # return render(request, 'forgot-password', {'form': form})
    return render(request, 'forgot-password.html')