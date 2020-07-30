from django import forms
from .models import CustomUser
from django.contrib.auth import get_user_model
from django.contrib.auth.forms import UserCreationForm as DjUserCreationForm

class UserCreationForm(DjUserCreationForm):

    class Meta:
        model = get_user_model()
        fields = ["email", "password1", "password2", ]
