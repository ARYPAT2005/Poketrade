interface Card {
  id: string;
  name: string;
  supertype: string;
  subtypes: any[];
  hp?: string | null;
  types?: any[] | null;
  evolves_from?: string | null;
  abilities?: any[] | null;
  attacks?: any[] | null;
  weaknesses?: any[] | null;
  resistances?: any[] | null;
  set_data: any;
  number: string;
  rarity?: string | null;
  legalities?: any[] | null;
  artist?: string | null;
  image_url: string;
  tcgplayer_url?: string | null;
  updated_at: string;
}

export default Card;
