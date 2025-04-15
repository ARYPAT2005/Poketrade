import { atomWithStorage } from "jotai/utils";
import Card from "../types/Card";

type User = {
  username: string;
  email: string;
  wallet_balance: number;
  last_claim_date: Date | null;
  can_claim: boolean;
  unread_messages: number;
  owned_cards: Card[];
};

const userAtom = atomWithStorage<User | null>("user", null);

export default userAtom;
