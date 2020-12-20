export interface Credentials {
   email: string | null;
   password: string | null;
}

export interface APISession {
   Id: string;
   Name: string;
   SessionId: string;
   ServiceRep: {
      Id: string;
   };
}

export interface APISessionState {
   apiSessionData: APISession | null;
   apiSessionCreation: string | null;
}
