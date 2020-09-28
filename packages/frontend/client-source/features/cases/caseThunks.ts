import { createAsyncThunk, unwrapResult } from "@reduxjs/toolkit";
import { CaseSummary } from "../../api";
import { RootState } from "../../rootReducer";
import { AppDispatch } from "../../store";
import { apiBase, defaultRequestHeaders } from "../../constants";
import { replaceCaseSummaries } from "./caseSlice";
import { debounce } from "lodash";
import { sliceName } from "./caseConstants";
import { checkAPISession } from "../auth/authThunks";

export const fetchCases = createAsyncThunk<
   CaseSummary[],
   undefined,
   {
      state: RootState;
      dispatch: AppDispatch;
      rejectValue: string;
   }
>(
   `${sliceName}/fetchCases`,
   // `sliceName/fetchCases`,
   // Declare the type your function argument here:
   async (_, thunkAPI) => {
      const APISessionWrapped = await thunkAPI.dispatch(checkAPISession());
      const APISession = unwrapResult(APISessionWrapped);

      try {
         const responses = await Promise.all([
            fetch(`${apiBase}/subcases/ForTech`, {
               body: JSON.stringify({ Function: "CURRENT" }),
               method: "POST",
               headers: {
                  ...defaultRequestHeaders,
                  Authorization: APISession.SessionId,
               },
            }),
            fetch(`${apiBase}/subcases/ForTech`, {
               body: JSON.stringify({ Function: "FUTURE" }),
               method: "POST",
               headers: {
                  ...defaultRequestHeaders,
                  Authorization: APISession.SessionId,
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
            thunkAPI.dispatch(replaceCaseSummaries(finalResponse));
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
