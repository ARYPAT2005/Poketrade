import Card from './Card';
  
  interface TradeCardDetail {
    id: number;
    card_info: Card;
    quantity: number;
    direction: 'offer' | 'request';
  }

  interface Trades {
    id: number;
    sender_username: string;
    recipient_username: string;
    message: string;
    timestamp: string;
    is_read: boolean;
    status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
    card_details: TradeCardDetail[];
    sender_coins: number;
    recipient_coins: number;
  }
  
  export default Trades;
  export type { TradeCardDetail };