export interface Account {
   Id: string;
   Name: string;
   SessionId: string;
}

export interface LoginResponse {
   Results: Account[];
}
