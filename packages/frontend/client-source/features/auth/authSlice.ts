import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Credentials {
   username: string | null;
   password: string | null;
}

export interface Authentication {
   SessionID: string | null;
}

type StateShape = { credentials: Credentials } & Authentication;

let initialState: StateShape = {
   credentials: { username: null, password: null },
   SessionID: null,
};

export const sliceName = "manageAuth";
export const authSlice = createSlice({
   name: sliceName,
   initialState,
   reducers: {
      updateCredentials(state, action: PayloadAction<Credentials>) {
         state.credentials = action.payload;
      },
      changeAuth(state, action: PayloadAction<Authentication>) {
         state.SessionID = action.payload.SessionID;
      },
      resetAuthentication(state) {
         state = initialState;
      },
   },
});

export const { changeAuth, resetAuthentication } = authSlice.actions;
export const { reducer: authReducer } = authSlice;
