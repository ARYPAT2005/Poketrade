from django.core.management.base import BaseCommand
from django.utils import timezone
from accounts.models import Fee

FEES_CONFIG = [
    {"id": "trading", "name": "Trading Fee", "amount": 50, "description": "Fee for trading transactions"},
    {"id": "marketplace", "name": "Marketplace Fee", "amount": 100, "description": "Fee for marketplace transactions"},
]


class Command(BaseCommand):
    help = "Seeds initial transaction fees into the database."

    def handle(self, *args, **options):
        for config in FEES_CONFIG:
            Fee.objects.update_or_create(
                id=config['id'],
                defaults={
                    'name': config['name'],
                    'amount': config['amount'],
                    'description': config['description'],
                }
            )
        self.stdout.write(
            self.style.SUCCESS(f"Successfully seeded {len(FEES_CONFIG)} fees."))
