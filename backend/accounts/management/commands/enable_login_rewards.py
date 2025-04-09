from django.core.management.base import BaseCommand
from django.utils import timezone
from accounts.models import User

class Command(BaseCommand):
    help = "Set all users' last_claim_date to now-25h to enable login rewards"

    def handle(self, *args, **options):
        users = User.objects.all()
        if not users:
            self.stdout.write(self.style.WARNING("No users found."))
            return

        self.stdout.write(f"Setting time to {timezone.now() - timezone.timedelta(hours=25)} for {users.count()} users.")
        for user in users:
            user.last_claim_date = timezone.now() - timezone.timedelta(hours=25)
            user.save()
        self.stdout.write(self.style.SUCCESS("Successfully updated last_claim_date for all users."))