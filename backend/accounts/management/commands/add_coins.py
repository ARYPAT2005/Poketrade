from django.core.management.base import BaseCommand
from django.utils import timezone
from accounts.models import User

class Command(BaseCommand):
    help = "Add the specified amount of coins to the specified user"

    def add_arguments(self, parser):
        parser.add_argument('username', type=str, help='Username of the user to add coins to')
        parser.add_argument('amount', type=int, help='Amount of coins to add')

    def handle(self, *args, **options):
        username = options['username']
        amount = options['amount']

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            self.stdout.write(self.style.ERROR(f'User "{username}" does not exist.'))
            return
        previous_balance = user.wallet_balance
        user.wallet_balance += amount
        user.save()

        self.stdout.write(self.style.SUCCESS(f'Successfully changed {username}\'s wallet balance from {previous_balance} to {user.wallet_balance}.'))