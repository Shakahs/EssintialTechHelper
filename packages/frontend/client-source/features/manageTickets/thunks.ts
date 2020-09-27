import { createAsyncThunk } from "@reduxjs/toolkit";
import { CaseSummary } from "../../api";
import { RootState } from "../../rootReducer";
import { AppDispatch } from "../../store";
import { apiBase, defaultRequestHeaders } from "../../constants";
import {
   manageTicketsSliceName,
   updateCaseSummaries,
} from "./manageTicketsSlice";
import { debounce } from "lodash";

export const fetchCases = createAsyncThunk<
   CaseSummary[],
   undefined,
   {
      state: RootState;
      dispatch: AppDispatch;
      rejectValue: string;
   }
>(
   `${manageTicketsSliceName}/fetchCases`,
   // `sliceName/fetchCases`,
   // Declare the type your function argument here:
   async (_, thunkAPI) => {
      try {
         const responses = await Promise.all([
            fetch(`${apiBase}/subcases/ForTech`, {
               body: JSON.stringify({ Function: "CURRENT" }),
               method: "POST",
               headers: {
                  ...defaultRequestHeaders,
                  Authorization: thunkAPI.getState().manageAuth.SessionID,
               },
            }),
            fetch(`${apiBase}/subcases/ForTech`, {
               body: JSON.stringify({ Function: "FUTURE" }),
               method: "POST",
               headers: {
                  ...defaultRequestHeaders,
                  Authorization: thunkAPI.getState().manageAuth.SessionID,
               },
            }),
         ]);

         let finalResponse: CaseSummary[] = [];

         if (responses) {
            for await (const r of responses) {
               const j = await r.json();
               const thisResult = j.Results[0] as CaseSummary[];
               finalResponse = [...finalResponse, ...thisResult];
            }
            thunkAPI.dispatch(updateCaseSummaries(finalResponse));
         }

         return finalResponse;
      } catch (err) {
         return thunkAPI.rejectWithValue("Fetching cases failed");
      }
   }
);

export const debouncedFetchCases = debounce(() => fetchCases(), 5000, {
   leading: true,
   trailing: false,
});

export interface fetchCasesState {
   loading: boolean;
   error: string;
}
