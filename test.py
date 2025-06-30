# myapp/management/commands/seed_common_questions.py

from django.core.management.base import BaseCommand
from api_core.models import CommonQuestions

COMMON_QUESTIONS = [
    # English
    {
        "question": "How do I get a moving quote?",
        "answer": "Click “Get a Quote,” fill in your pickup & drop‑off addresses and date, and we’ll email you a free estimate within 1 hour.",
        "language": "en",
    },
    {
        "question": "Which cities do you serve?",
        "answer": "We currently operate in Riyadh, Jeddah, Dammam and Khobar, with plans to expand soon.",
        "language": "en",
    },
    {
        "question": "What payment methods do you accept?",
        "answer": "We accept Visa, MasterCard, Mada, and cash on delivery. You can also pay via STC Pay or Apple Pay in‑app.",
        "language": "en",
    },
    {
        "question": "How do I reschedule my move?",
        "answer": "Log in to your account, go to “My Bookings,” select the reservation, and click “Reschedule.” You can pick any available date up to 7 days ahead.",
        "language": "en",
    },
    {
        "question": "Is my furniture insured during transit?",
        "answer": "Yes—every shipment is covered up to SAR 10,000 at no extra cost. You can add higher coverage in checkout for an additional fee.",
        "language": "en",
    },
    {
        "question": "How long does a move usually take?",
        "answer": "Most local moves finish within 4–6 hours. Large homes may take up to a full day. You’ll get an estimated duration in your quote email.",
        "language": "en",
    },
    {
        "question": "Can I track the movers in real time?",
        "answer": "Yes—once your move is on the road, you’ll receive a tracking link by SMS and email so you can see their live location on the map.",
        "language": "en",
    },

    # Arabic
    {
        "question": "كيف أحصل على عرض سعر؟",
        "answer": "اضغط على “احصل على عرض سعر”، أدخل عنواني الاستلام والتسليم والتاريخ، وسنرسل لك العرض المجاني عبر البريد الإلكتروني خلال ساعة واحدة.",
        "language": "ar",
    },
    {
        "question": "في أي مدن تقدّمون الخدمة؟",
        "answer": "نحن حالياً نعمل في الرياض وجدة والدمام والخُبر، مع خطط للتوسع قريباً لتغطية مناطق أخرى.",
        "language": "ar",
    },
    {
        "question": "ما هي طرق الدفع المتاحة؟",
        "answer": "نقبل بطاقات فيزا وماستر كارد ومدى، والدفع نقداً عند التسليم، بالإضافة إلى STC Pay وApple Pay عبر التطبيق.",
        "language": "ar",
    },
    {
        "question": "كيف أعيد جدولة موعد النقل؟",
        "answer": "سجّل دخولك، اذهب إلى “حجوزاتي”، اختر الحجز الذي تريد تعديله واضغط “إعادة جدولة”، ثم اختر أي موعد متاح حتى 7 أيام قادمة.",
        "language": "ar",
    },
    {
        "question": "هل أثاثي مؤمّن أثناء النقل؟",
        "answer": "نعم—كل الشحنات مؤمنة مجاناً حتى 10,000 ريال سعودي، ويمكنك إضافة تغطية أعلى عند إتمام الدفع مقابل رسوم إضافية.",
        "language": "ar",
    },
    {
        "question": "كم يستغرق وقت النقل عادةً؟",
        "answer": "معظم عمليات النقل المحلي تنتهي خلال 4–6 ساعات. قد يستغرق نقل المنازل الكبيرة يوماً كاملاً. ستحصل على المدة التقديرية في رسالة عرض السعر.",
        "language": "ar",
    },
    {
        "question": "هل يمكنني تتبع فريق النقل مباشرةً؟",
        "answer": "نعم—بمجرد بدء الرحلة، سنرسل لك رابط تتبع عبر رسالة نصية وبريد إلكتروني لتتمكن من رؤية موقع الفريق مباشرةً على الخريطة.",
        "language": "ar",
    },
]


class Command(BaseCommand):
    help = "Seed CommonQuestions table with default FAQs in EN & AR"

    def handle(self, *args, **options):
        created, updated = 0, 0
        for entry in COMMON_QUESTIONS:
            obj, was_created = CommonQuestions.objects.update_or_create(
                question=entry["question"],
                language=entry["language"],
                defaults={"answer": entry["answer"]},
            )
            if was_created:
                created += 1
            else:
                updated += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"FAQs seeded: {created} created, {updated} updated."
            )
        )
'''
from string import Template
import os

tpl = Template("""
CREATE DATABASE $dbname CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER '$dbuser'@'localhost' IDENTIFIED BY '$dbpwd';
GRANT ALL PRIVILEGES ON $dbname.* TO '$dbuser'@'localhost';
FLUSH PRIVILEGES;
""")

sql = tpl.substitute({
    'dbname': os.getenv('DB_NAME'),
    'dbuser': os.getenv('DB_USER'),
    'dbpwd': os.getenv('DB_PWD'),
})

with open("init.sql", "w") as f:
    f.write(sql)


'''