import { createAsyncThunk, SerializedError } from "@reduxjs/toolkit";
import { sliceName } from "./authConstants";
import { APISession, Credentials, ResultsObject } from "../../api";
import { RootState } from "../../rootReducer";
import { AppDispatch } from "../../store";
import { apiBase, defaultRequestHeaders } from "../../constants";
import differenceInMinutes from "date-fns/differenceInMinutes";
import { unwrapResult } from "@reduxjs/toolkit";
import { parseISO } from "date-fns";
import { FetchError } from "react-async";

//login to the API, store the received session data
export const loginAPISession = createAsyncThunk<
   APISession,
   Credentials,
   {
      state: RootState;
      dispatch: AppDispatch;
      rejectValue: SerializedError;
   }
>(`${sliceName}/loginAPISession`, async (creds, thunkAPI) => {
   try {
      const sessionResponse = await fetch(`${apiBase}/session`, {
         method: "POST",
         headers: defaultRequestHeaders,
         body: JSON.stringify({
            Password: creds.password,
            SourceSystem: "BUDDY",
            UserId: creds.email,
         }),
      });

      if (!sessionResponse.ok) {
         return thunkAPI.rejectWithValue({
            name: "AuthError",
            message: "Server Error",
         });
      }

      const result: ResultsObject<APISession> = await sessionResponse.json();
      if (result.Results.length === 0) {
         return thunkAPI.rejectWithValue({
            name: "AuthError",
            message: "Invalid Credentials",
         });
      }

      const apiSessionData = result.Results[0];
      return apiSessionData;
   } catch (err) {
      return thunkAPI.rejectWithValue({
         name: "AuthError",
         message: "Unknown error, check your connection",
      });
   }
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
      thunkAPI.getState().authSlice.apiSession.apiSessionData &&
      differenceInMinutes(
         new Date(),
         parseISO(thunkAPI.getState().authSlice.apiSession.apiSessionCreation)
      ) <= 30
   ) {
      return thunkAPI.getState().authSlice.apiSession.apiSessionData;
   } else {
      const newSession = await thunkAPI.dispatch(
         loginAPISession(thunkAPI.getState().authSlice.credentials)
      );
      const unwrapped = unwrapResult(newSession);
      return unwrapped;
   }
});
