from django.core.management.base import BaseCommand
from django.utils import timezone
from accounts.models import SecurityQuestion

# const securityQuestions1 = [
#     {id: 1, text: "What is your mother's maiden name?"},
#     {id: 2, text: "What was the name of your first pet?"},
#     {id: 3, text: "What city were you born in?"},
#     {id: 4, text: "What is your favorite book?"},
#     {id: 5, text: "What is your favorite food?"},
#     {id: 6, text: "What was the name of your elementary school?"},
#     {id: 7, text: "What was your dream job as a child?"},
#     {id: 8, text: "What is your favorite sports team?"},
# ];

SECURITY_QUESTIONS_CONFIG = [
    {"id": 1, "question": "What is your mother's maiden name?"},
    {"id": 2, "question": "What was the name of your first pet?"},
    {"id": 3, "question": "What city were you born in?"},
    {"id": 4, "question": "What is your favorite book?"},
    {"id": 5, "question": "What is your favorite food?"},
    {"id": 6, "question": "What was the name of your elementary school?"},
    {"id": 7, "question": "What was your dream job as a child?"},
    {"id": 8, "question": "What is your favorite sports team?"}
]

class Command(BaseCommand):
    help = "Seeds initial security questions into the database"

    def handle(self, *args, **options):
        for config in SECURITY_QUESTIONS_CONFIG:
            SecurityQuestion.objects.update_or_create(
                id=config['id'],
                defaults={
                    'question': config['question'],
                }
            )
        self.stdout.write(self.style.SUCCESS(f"Successfully seeded {len(SECURITY_QUESTIONS_CONFIG)} security questions."))

