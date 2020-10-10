import { RootState } from "../../rootReducer";
import { createSelector } from "@reduxjs/toolkit";

export const getAPISession = (state: RootState) =>
   state.authSlice.apiSession?.apiSessionData;

export const getIsLoggedIn = createSelector(
   getAPISession,
   (session) => session !== null
);
