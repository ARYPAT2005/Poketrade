from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from pokemessages.models import Message

User = get_user_model()

class Command(BaseCommand):
    help = 'Simulate messages between two users'

    def add_arguments(self, parser):
        parser.add_argument('sender', type=str)
        parser.add_argument('recipient', type=str)
        parser.add_argument('count', type=int)

    def handle(self, *args, **options):
        try:
            sender = User.objects.get(username=options['sender'])
            recipient = User.objects.get(username=options['recipient'])
        except User.DoesNotExist:
            self.stdout.write(self.style.ERROR('One or both users not found'))
            return

        for i in range(options['count']):
            Message.objects.create(
                sender=sender,
                recipient=recipient,
                subject=f"Test Message {i+1}",
                body=f"This is test message number {i+1}"
            )

        self.stdout.write(self.style.SUCCESS(
            f'Successfully sent {options["count"]} messages'
        ))