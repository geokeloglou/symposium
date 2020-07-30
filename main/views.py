from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from .forms import UserCreationForm


def index(request):
    return render(request, "main/index.html")

def register(request):
    if request.method == "POST":        
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            email = form.cleaned_data.get("email")
            username = form.cleaned_data.get("username")
            messages.success(request, f"Your account has been created! You are now able to log in.")
            return redirect('login')
    else:
        form = UserCreationForm()
    return render(request, "main/user_create.html", {"form": form })

def login(request):
    context = {}
    return render(request, "main/user_login.html", context)