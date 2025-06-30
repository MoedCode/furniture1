from django.http import HttpResponse
from django.core.mail import send_mail
def sim_send(request):
    send_mail(
        subject="mail subj",
        message="message to test mailtrap",
        from_email="Alsalam-Desk@outlook.com",
        recipient_list=["mohamed71291@gmail.com"]
    )
    return HttpResponse('message should be sent .any error not of my businesses')