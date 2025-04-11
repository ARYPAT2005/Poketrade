from django.db import migrations

def populate_security_questions(apps):
    SecurityQuestion = apps.get_model('accounts', 'SecurityQuestion')
    questions = [
        "What is your mother's maiden name?",
        "What was the name of your first pet?",
        "What city were you born in?",
        "What is your favorite book?",
        "What is your favorite food?",
        "What was the name of your elementary school?",
        "What was your dream job as a child?",
        "What is your favorite sports team?",
    ]
    for question_text in questions:
        SecurityQuestion.objects.get_or_create(question=question_text)

class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),  # Replace with the actual last migration file name
    ]

    operations = [
        migrations.RunPython(populate_security_questions),
    ]

