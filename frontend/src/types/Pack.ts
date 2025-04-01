interface PackItem {
  tier: number;
  probability: number;
  filters: any;
}

interface Pack {
  id: string;
  name: string;
  description: string;
  color: string;
  cost: number;
  items: PackItem[];
}

export default Pack;
