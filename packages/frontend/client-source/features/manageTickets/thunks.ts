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
      const response = await fetch(`${apiBase}/subcases/ForTech`, {
         body: JSON.stringify({ Function: "CURRENT" }),
         method: "POST",
         headers: {
            ...defaultRequestHeaders,
            Authorization: thunkAPI.getState().manageTickets.SessionID,
         },
      });

      const j = await response.json();
      const results = j.Results[0] as CaseSummary[];
      thunkAPI.dispatch(updateCaseSummaries(results));

      // Inferred return type: Promise<MyData>
      return results;
   }
);

export interface fetchCasesState {
   loading: boolean;
   error: string;
}
