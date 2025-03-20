from django.shortcuts import render

# Create your views here.

"""
@description  :
---------
@param  :
-------
@Returns  :
-------
"""

def login(requests):
    return  render(requests, 'login.html')