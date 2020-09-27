import { createAsyncThunk } from "@reduxjs/toolkit";
import { CaseSummary } from "../../api";
import { RootState } from "../../rootReducer";
import { AppDispatch } from "../../store";
import { apiBase, defaultRequestHeaders } from "../../constants";
import {
   manageTicketsSliceName,
   updateCaseSummaries,
} from "./manageTicketsSlice";

export const fetchCases = createAsyncThunk<
   CaseSummary[],
   undefined,
   {
      state: RootState;
      dispatch: AppDispatch;
   }
>(
   `${manageTicketsSliceName}/fetchCases`,
   // Declare the type your function argument here:
   async (_, thunkAPI) => {
      const responses = await Promise.all([
         fetch(`${apiBase}/subcases/ForTech`, {
            body: JSON.stringify({ Function: "CURRENT" }),
            method: "POST",
            headers: {
               ...defaultRequestHeaders,
               Authorization: thunkAPI.getState().manageTickets.SessionID,
            },
         }),
         fetch(`${apiBase}/subcases/ForTech`, {
            body: JSON.stringify({ Function: "FUTURE" }),
            method: "POST",
            headers: {
               ...defaultRequestHeaders,
               Authorization: thunkAPI.getState().manageTickets.SessionID,
            },
         }),
      ]);

      let finalResponse: CaseSummary[] = [];

      for await (const r of responses) {
         const j = await r.json();
         const thisResult = j.Results[0] as CaseSummary[];
         finalResponse = [...finalResponse, ...thisResult];
      }
      thunkAPI.dispatch(updateCaseSummaries(finalResponse));

      return finalResponse;
   }
);

export interface fetchCasesState {
   loading: boolean;
   error: string;
}
