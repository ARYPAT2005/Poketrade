import { atomWithStorage } from "jotai/utils";
import Card from "../types/Card";

type owned_cards = {
  id: number;
  card_details: Card;
  quantity: number;
};

type User = {
  username: string;
  email: string;
  wallet_balance: number;
  last_claim_date: Date | null;
  can_claim: boolean;
  unread_messages: number;
  owned_cards: owned_cards[];
};

const userAtom = atomWithStorage<User | null>("user", null);

export default userAtom;
