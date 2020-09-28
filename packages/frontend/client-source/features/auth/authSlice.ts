import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { APISessionState, Credentials } from "../../api";
import { sliceName } from "./authConstants";
import { fetchState } from "../common";
import { loginAPISession } from "./authThunks";

type StateShape = { credentials: Credentials } & {
   apiSession: APISessionState;
} & { loginFetchState: fetchState };

let initialState: StateShape = {
   credentials: { email: null, password: null },
   apiSession: {
      apiSessionCreation: null,
      apiSessionData: null,
   },
   loginFetchState: {
      loading: false,
      error: "",
   },
};

export const authSlice = createSlice({
   name: sliceName,
   initialState,
   reducers: {
      updateCredentials(state, action: PayloadAction<Credentials>) {
         state.credentials = action.payload;
      },
      updateAPISession(state, action: PayloadAction<APISessionState>) {
         state.apiSession = action.payload;
      },
      resetAuthentication(state) {
         state = initialState;
      },
   },
   extraReducers: (builder) => {
      builder
         .addCase(loginAPISession.pending, (state, action) => {
            state.loginFetchState.loading = true;
            state.loginFetchState.error = "";
         })
         .addCase(loginAPISession.fulfilled, (state, action) => {
            state.loginFetchState.loading = false;
         })
         .addCase(loginAPISession.rejected, (state, action) => {
            state.loginFetchState.loading = false;
            state.loginFetchState.error = action.payload;
         });
   },
});

export const {
   updateAPISession,
   updateCredentials,
   resetAuthentication,
} = authSlice.actions;
export const { reducer: authReducer } = authSlice;
