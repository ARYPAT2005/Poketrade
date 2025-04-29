import PokemonCard from './Card';

type OwnedCard = {
    card_details: PokemonCard;
    quantity: number;
    id: number;
};

type User = {
    username: string;
    email: string;
    wallet_balance: number;
    last_claim_date: Date | null;
    can_claim: boolean;
    owned_cards: OwnedCard[];
};

export default User;