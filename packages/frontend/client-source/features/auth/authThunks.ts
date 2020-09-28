import { createAsyncThunk } from "@reduxjs/toolkit";
import { sliceName } from "./authConstants";
import { APISession, Credentials, ResultsObject } from "../../api";
import { RootState } from "../../rootReducer";
import { AppDispatch } from "../../store";
import { apiBase, defaultRequestHeaders } from "../../constants";
import differenceInMinutes from "date-fns/differenceInMinutes";
import { unwrapResult } from "@reduxjs/toolkit";
import { parseISO } from "date-fns";

//login to the API, store the received session data
export const loginAPISession = createAsyncThunk<
   APISession,
   Credentials,
   {
      state: RootState;
      dispatch: AppDispatch;
      rejectValue: string;
   }
>(`${sliceName}/loginAPISession`, async (creds, thunkAPI) => {
   const sessionResponse = await fetch(`${apiBase}/session`, {
      method: "POST",
      headers: defaultRequestHeaders,
      body: JSON.stringify({
         Password: creds.password,
         SourceSystem: "BUDDY",
         UserId: creds.email,
      }),
   });

   const result: ResultsObject<APISession> = await sessionResponse.json();
   if (result.Results.length === 0) {
      return thunkAPI.rejectWithValue(result.ReturnMessage);
   }

   const apiSessionData = result.Results[0];
   return apiSessionData;
});

//return the existing session data if it is less than 30 minutes old
export const checkAPISession = createAsyncThunk<
   APISession,
   undefined,
   {
      state: RootState;
      dispatch: AppDispatch;
      rejectValue: string;
   }
>(`${sliceName}/checkAPISession`, async (_, thunkAPI) => {
   if (
      thunkAPI.getState().manageAuth.apiSession.apiSessionData &&
      differenceInMinutes(
         new Date(),
         parseISO(thunkAPI.getState().manageAuth.apiSession.apiSessionCreation)
      ) <= 30
   ) {
      return thunkAPI.getState().manageAuth.apiSession.apiSessionData;
   } else {
      const newSession = await thunkAPI.dispatch(
         loginAPISession(thunkAPI.getState().manageAuth.credentials)
      );
      const unwrapped = unwrapResult(newSession);
      return unwrapped;
   }
});
