import {
   createAsyncThunk,
   createEntityAdapter,
   createSlice,
   EntityState,
   PayloadAction,
} from "@reduxjs/toolkit";
import { CaseSummary } from "../../api";
import { apiBase, defaultRequestHeaders } from "../../constants";
import { RootState } from "../../rootReducer";
import { AppDispatch } from "../../store";

interface Authentication {
   SessionID: string | null;
}

interface CurrentCaseSummaries {
   currentCaseSummaries: EntityState<CaseSummary>;
}

type ManagementState = Authentication & CurrentCaseSummaries;

const caseAdapter = createEntityAdapter<CaseSummary>({
   selectId: (c) => c.Id,
});

let initialState: ManagementState = {
   SessionID: null,
   currentCaseSummaries: caseAdapter.getInitialState(),
};

const manageTicketSlice = createSlice({
   name: "manageTickets",
   initialState,
   reducers: {
      changeAuth(state, action: PayloadAction<Authentication>) {
         state.SessionID = action.payload.SessionID;
      },
      updateCaseSummaries(state, action: PayloadAction<CaseSummary[]>) {
         caseAdapter.setAll(state.currentCaseSummaries, action.payload);
      },
   },
});

export const fetchCases = createAsyncThunk<
   CaseSummary[],
   undefined,
   {
      state: RootState;
      dispatch: AppDispatch;
   }
>(
   manageTicketSlice.actions.updateCaseSummaries.type,
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

export const { changeAuth, updateCaseSummaries } = manageTicketSlice.actions;

export default manageTicketSlice.reducer;
