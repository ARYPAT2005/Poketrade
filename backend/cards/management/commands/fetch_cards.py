import requests
from django.core.management.base import BaseCommand
from cards.models import Card

TCG_API_URL = "https://api.pokemontcg.io/v2/cards"

class Command(BaseCommand):
    help = 'Fetches Pokemon cards from the TCG API'

    def handle(self, *args, **options):
        page = 1
        while True:
            response = requests.get(
                TCG_API_URL,
                params={'page': page},
                headers={'Accept': 'application/json'}
            )
            response.raise_for_status()
            data = response.json()

            if not data['data']:
                break

            for card_data in data['data']:
                self.process_card(card_data)

            page += 1
            self.stdout.write(f"Processed page {page}...")

    def process_card(self, card_data):
        Card.objects.update_or_create(
            id=card_data['id'],
            defaults={
                'name': card_data['name'],
                'supertype': card_data.get('supertype', ''),
                'subtypes': card_data.get('subtypes', []),
                'hp': card_data.get('hp'),
                'types': card_data.get('types', []),
                'evolves_from': card_data.get('evolvesFrom'),
                'abilities': card_data.get('abilities', []),
                'attacks': card_data.get('attacks', []),
                'weaknesses': card_data.get('weaknesses', []),
                'resistances': card_data.get('resistances', []),
                'set_data': card_data.get('set', {}),
                'number': card_data.get('number', ''),
                'rarity': card_data.get('rarity'),
                'legalities': card_data.get('legalities', {}),
                'artist': card_data.get('artist'),
                'image_url': card_data.get('images', {}).get('small', ''),
                'tcgplayer_url': card_data.get('tcgplayer', {}).get('url', ''),
            }
        )