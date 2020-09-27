import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CaseSummary } from "../../api";
import { fetchCases } from "./thunks";

export interface Authentication {
   SessionID: string | null;
}

type StateShape = Authentication;

let initialState: StateShape = {
   SessionID: null,
};

export const sliceName = "manageAuth";
export const authSlice = createSlice({
   name: sliceName,
   initialState,
   reducers: {
      changeAuth(state, action: PayloadAction<Authentication>) {
         state.SessionID = action.payload.SessionID;
      },
   },
});

export const { changeAuth } = authSlice.actions;
export const { reducer: authReducer } = authSlice;
