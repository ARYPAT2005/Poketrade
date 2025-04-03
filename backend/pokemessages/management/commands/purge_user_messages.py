from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from pokemessages.models import Message

User = get_user_model()

class Command(BaseCommand):
    help = 'Purges messages for a specific user'

    def add_arguments(self, parser):
        parser.add_argument('username', type=str, help='Username of the user whose messages to purge')

    def handle(self, *args, **options):
        username = options['username']
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            self.stdout.write(self.style.ERROR(f'User "{username}" does not exist.'))
            return

        # Purge messages sent by the user
        deleted_count = Message.objects.filter(sender=user).delete()[0]
        self.stdout.write(self.style.SUCCESS(
            f'Successfully purged {deleted_count} messages sent by "{username}".'
        ))

        # Purge messages received by the user
        deleted_count = Message.objects.filter(recipient=user).delete()[0]
        self.stdout.write(self.style.SUCCESS(
            f'Successfully purged {deleted_count} messages received by "{username}".'
        ))