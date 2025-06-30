import os
from django import forms
from .models import (
    WhyChooseUs, Blogs, Orders, settings
)


class WhyChooseUsAdminForm(forms.ModelForm):
    paragraphs = forms.CharField(
        widget=forms.Textarea(attrs={'rows': 5}),
        help_text="Enter one paragraph per line."
    )

    class Meta:
        model = WhyChooseUs
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        # Convert list to multiline text for display in admin
        if self.instance and isinstance(self.instance.paragraphs, list):
            self.initial['paragraphs'] = '\n'.join(self.instance.paragraphs)

    def clean_paragraphs(self):
        raw = self.cleaned_data['paragraphs']
        lines = [line.strip() for line in raw.splitlines() if line.strip()]
        if not lines:
            raise forms.ValidationError("At least one paragraph is required.")
        return lines


class BlogAdminForm(forms.ModelForm):
    class Meta:
        model = Blogs
        fields = ['image', 'paragraph', 'article', 'language']

# # admin.site.register(Orders)
# class OrdersAdminForm(forms.ModelForm):
#     # field to upload new images
#     new_images = forms.ImageField(
#         widget=forms.ClearableFileInput(attrs={'multiple': True}),
#         required=False,
#         help_text="Upload one or more images"
#     )

#     class Meta:
#         model = Orders
#         fields = '__all__'

#     def save(self, commit=True):
#         instance = super().save(commit=False)
#         # handle new images upload
#         files = self.files.getlist('new_images') if hasattr(self, 'files') else []
#         for img in files:
#             # build path and save file
#             order_dir = os.path.join(settings.MEDIA_ROOT, 'orders', str(instance.id or 'temp'))
#             os.makedirs(order_dir, exist_ok=True)
#             filename = img.name
#             rel_path = f"orders/{instance.id}/{filename}" if instance.id else f"orders/temp/{filename}"
#             full_path = os.path.join(settings.MEDIA_ROOT, rel_path)
#             with open(full_path, 'wb+') as f:
#                 for chunk in img.chunks():
#                     f.write(chunk)
#             # attach to images list
#             images = instance.images or []
#             images.append(rel_path)
#             instance.images = images
#         if commit:
#             instance.save()
#         return instance
