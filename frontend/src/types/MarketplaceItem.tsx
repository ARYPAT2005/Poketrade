import Card from './Card';
interface MarketplaceItem {
    id: number;
    card: Card;
    buy_price: string | null;
    auction_price: string | null;
    seller: string | null;
}

export default MarketplaceItem;