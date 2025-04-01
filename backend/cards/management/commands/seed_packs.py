from django.core.management.base import BaseCommand
from cards.models import Pack, PackItem

PACK_CONFIG = [
    {
        "id": "rare_ultra",
        "name": "Ultra Rare Pack",
        "description": "Contains Common, Uncommon, and Rare Ultra cards",
        "items": [
            {"probability": 65, "filters": {"rarity__exact": "Common"}},
            {"probability": 25, "filters": {"rarity__exact": "Uncommon"}},
            {"probability": 10, "filters": {"rarity__exact": "Rare Ultra"}}
        ]
    },
    {
        "id": "rare_shiny",
        "name": "Shiny Rare Pack",
        "description": "Contains Common, Uncommon, and Rare Shiny cards",
        "items": [
            {"probability": 65, "filters": {"rarity__exact": "Common"}},
            {"probability": 25, "filters": {"rarity__exact": "Uncommon"}},
            {"probability": 10, "filters": {"rarity__icontains": "Rare Shiny"}}
        ]
    },
    {
        "id": "rare_holo",
        "name": "Holo Rare Pack",
        "description": "Contains Common, Uncommon, and Rare Holo cards",
        "items": [
            {"probability": 65, "filters": {"rarity__exact": "Common"}},
            {"probability": 25, "filters": {"rarity__exact": "Uncommon"}},
            {"probability": 10, "filters": {"rarity__icontains": "Rare Holo"}}
        ]
    }
]


class Command(BaseCommand):
    help = 'Seeds the database with pack configurations'

    def handle(self, *args, **options):
        for config in PACK_CONFIG:
            pack, created = Pack.objects.update_or_create(
                id=config['id'],
                defaults={
                    'name': config['name'],
                    'description': config['description']
                }
            )

            for tier, item_config in enumerate(config['items']):
                PackItem.objects.update_or_create(
                    pack=pack,
                    tier=tier,
                    defaults={
                        'probability': item_config['probability'],
                        'filters': item_config['filters']
                    }
                )

        self.stdout.write(self.style.SUCCESS('Successfully seeded packs'))