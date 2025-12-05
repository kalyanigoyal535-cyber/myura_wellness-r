from django import forms
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model

User = get_user_model()


class EmailAuthenticationForm(AuthenticationForm):
    username = forms.EmailField(
        label='Email',
        widget=forms.TextInput(attrs={
            'autofocus': True,
            'placeholder': 'Email address',
            'class': 'form-control'
        })
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['username'].label = 'Email'
        self.fields['username'].help_text = None

    def clean_username(self):
        email = self.cleaned_data.get('username')
        if email:
            email = email.strip().lower()
            if '@' not in email or '.' not in email.split('@')[-1]:
                raise forms.ValidationError('Please enter a valid email address.')
        return email

    def clean(self):
        username = self.cleaned_data.get('username')
        password = self.cleaned_data.get('password')

        if username is not None and password:
            request = getattr(self, 'request', None)
            self.user_cache = authenticate(
                request=request,
                username=username,
                password=password,
            )
            if self.user_cache is None:
                raise forms.ValidationError(
                    'Please enter a correct email and password. Note that both fields may be case-sensitive.',
                    code='invalid_login',
                )
            else:
                self.confirm_login_allowed(self.user_cache)
        else:
            return super().clean()

        return self.cleaned_data

