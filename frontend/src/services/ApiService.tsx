import PokemonCard from '../types/Card';
import Trades from '../types/Trades';
import LoginResponse from '../types/LoginResponse';
import MarketplaceItem from '../types/MarketplaceItem';
import User from '../types/User';
import Pack from '../types/Pack';
class ApiService {
    private static instance: ApiService;
    private baseUrl: string;

    private constructor() {
        this.baseUrl = import.meta.env.VITE_API_URL;
        if (!this.baseUrl.endsWith('/')) {
            this.baseUrl += '/';
        }
        console.log("ApiService Initialized with base URL:", this.baseUrl);
    }

    public static getInstance(): ApiService {
        if (!ApiService.instance) {
            ApiService.instance = new ApiService();
        }
        return ApiService.instance;
    }


    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;
        console.log(`Making API request to: ${options.method || 'GET'} ${url}`);

        options.headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...options.headers
        };

        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                let errorData;
                try {
                    errorData = await response.json();
                } catch (parseError) {
                     errorData = { detail: response.statusText };
                }
                console.error(`API Error ${response.status}:`, errorData);
                throw new Error(errorData.detail || `HTTP error! Status: ${response.status}`);
            }

            
            if (response.status === 204 || response.headers.get("content-length") === "0") {
                return null as T;
            }

            return await response.json() as T;
        } catch (error) {
            console.error("Network or Fetch error:", error);
            throw error;
        }
    }

   
    public async getMarketplaceItems(): Promise<MarketplaceItem[]> {
        return this.request<MarketplaceItem[]>('api/marketplace/');
    }

    public async buyMarketplaceItem(itemId: number, buyerId: string | null): Promise<void> {
        return this.request<void>(`api/marketplace/`, { 
            method: 'DELETE',
            body: JSON.stringify({ id: itemId, buyer: buyerId }),
        });
    }

    public async login(credentials: { email: string, password: string }): Promise<LoginResponse> {
        return this.request<LoginResponse>('login/', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
    }

     public async fetchUserTrades(username: string): Promise<Trades[]> {
        return this.request<Trades[]>(`api/trades/${username}/`);
    }

    public async updateTradeStatus(tradeId: number, status: string): Promise<Trades> {
        return this.request<Trades>(`api/trades/id/${tradeId}/`, {
             method: 'PATCH',
             body: JSON.stringify({ status: status }),
        });
    }

     public async searchCards(query: string): Promise<{ results: PokemonCard[] }> {
        const endpoint = `search/?q=${encodeURIComponent(query)}`;
        return this.request<{ results: PokemonCard[] }>(endpoint);
     }

     public async searchCardOwners(query: string): Promise<{ results: User[] }> {
        const endpoint = `api/card-owners?q=${encodeURIComponent(query)}`;
        return this.request<{ results: User[] }>(endpoint);
     }

     public async fetchPacks(): Promise<Pack[]> {
        const endpoint = `api/packs`;
        return this.request<Pack[]>(endpoint);
     }

     public async fetchCards(): Promise<{results: PokemonCard[]}> {
        const endpoint = `api/cards/?page=1`;
        return this.request<{ results: PokemonCard[]}>(endpoint);
     }


    
}

export default ApiService;