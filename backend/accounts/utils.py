from decimal import Decimal
from django.contrib.auth import get_user_model
from .models import OwnedCards
from cards.models import Card

User = get_user_model()

def transfer_cards_or_coins(sender: User, recipient: User | None = None, senders_cards: list[dict[str, any]] | None = None, receivers_cards: list[dict[str, any]] | None = None, coin_data: dict[str, any] | None = None) -> tuple[bool, str]:
    senders_cards = senders_cards or []
    receivers_cards = receivers_cards or []
    coin_data = coin_data or {}

    if sender and sender.wallet_balance < coin_data['sender_coin_transfer']:
        return False, "Sender has insufficient funds."
    if recipient.wallet_balance < coin_data['receiver_coin_transfer']:
            return False, "Recipient has insufficient funds."

    if sender:
        for item in senders_cards:
            card = item.get('card')
            quantity_needed = item.get('quantity')
            try:
                sender_owned = OwnedCards.objects.get(user=sender, card_info=card)
                if sender_owned.quantity < quantity_needed:
                    return False, f"Sender does not have enough {card.name} (owns {sender_owned.quantity}, needs {quantity_needed})."
            except OwnedCards.DoesNotExist:
                return False, f"Sender does not own the card: {card.name}."

    for item in receivers_cards:
        card = item.get('card')
        quantity_needed = item.get('quantity')
        try:
            receiver_owned = OwnedCards.objects.get(user=recipient, card_info=card)
            if receiver_owned.quantity < quantity_needed:
                return False, f"Sender does not have enough {card.name} (owns {receiver_owned.quantity}, needs {quantity_needed})."
        except OwnedCards.DoesNotExist:
            return False, f"Sender does not own the card: {card.name}."

    try:
        if coin_data['sender_coin_transfer'] > 0:
            sender.wallet_balance -= coin_data['sender_coin_transfer']
            recipient.wallet_balance += coin_data['sender_coin_transfer']
            sender.save(update_fields=['wallet_balance'])
            recipient.save(update_fields=['wallet_balance'])
        if coin_data['receiver_coin_transfer'] > 0:
            if sender:
                sender.wallet_balance += coin_data['receiver_coin_transfer']
                sender.save(update_fields=['wallet_balance'])
            recipient.wallet_balance -= coin_data['receiver_coin_transfer']
            recipient.save(update_fields=['wallet_balance'])

        for item in senders_cards:
            card = item.get('card')
            quantity = item.get('quantity')

            if sender:
                sender_owned = OwnedCards.objects.get(user=sender, card_info=card)
                sender_owned.quantity -= quantity
                if sender_owned.quantity == 0:
                    sender_owned.delete()
                else:
                    sender_owned.is_selling = True
                    sender_owned.save(update_fields=['quantity', 'is_selling'])

            recipient_owned, created = OwnedCards.objects.get_or_create(user=recipient, card_info=card, defaults={'quantity': 1})
            if created:
                quantity -= 1
            recipient_owned.quantity += quantity
            recipient_owned.save(update_fields=['quantity'])

        for item in receivers_cards:
            card = item.get('card')
            quantity = item.get('quantity')

            receiver_owned = OwnedCards.objects.get(user=recipient, card_info=card)
            receiver_owned.quantity -= quantity
            if receiver_owned.quantity == 0:
                receiver_owned.delete()
            else:
                receiver_owned.save(update_fields=['quantity'])
            if sender:
                sender_owned, created = OwnedCards.objects.get_or_create(user=sender, card_info=card, defaults={'quantity': 1})
                if created:
                    quantity -= 1
                sender_owned.quantity += quantity
                sender_owned.save(update_fields=['quantity'])

        print(f"Transfer completed from {sender.username if sender else ''} to {recipient.username}.")
        return True, "Transfer successful."

    except Exception as e:
        return False, f"An error occurred during the transfer process: {e}."
