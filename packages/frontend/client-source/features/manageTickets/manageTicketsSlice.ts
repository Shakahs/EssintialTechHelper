import {
   createEntityAdapter,
   createSlice,
   EntityState,
   PayloadAction,
} from "@reduxjs/toolkit";
import { CaseSummary } from "../../api";
import { fetchCases, fetchCasesState } from "./thunks";

interface Authentication {
   SessionID: string | null;
}

interface CurrentCaseSummaries {
   currentCaseSummaries: EntityState<CaseSummary>;
}

type ManagementState = Authentication &
   CurrentCaseSummaries & {
      fetchState: fetchCasesState;
   };

const caseAdapter = createEntityAdapter<CaseSummary>({
   selectId: (c) => c.Id,
});

let initialState: ManagementState = {
   SessionID: null,
   currentCaseSummaries: caseAdapter.getInitialState(),
   fetchState: {
      loading: false,
      error: "",
   },
};

export const manageTicketsSliceName = "manageTickets";
export const manageTicketSlice = createSlice({
   name: manageTicketsSliceName,
   initialState,
   reducers: {
      changeAuth(state, action: PayloadAction<Authentication>) {
         state.SessionID = action.payload.SessionID;
      },
      updateCaseSummaries(state, action: PayloadAction<CaseSummary[]>) {
         caseAdapter.setAll(state.currentCaseSummaries, action.payload);
      },
   },
   extraReducers: (builder) => {
      builder
         .addCase(fetchCases.pending, (state, action) => {
            state.fetchState.loading = true;
            state.fetchState.error = "";
         })
         .addCase(fetchCases.fulfilled, (state, action) => {
            state.fetchState.loading = false;
         })
         .addCase(fetchCases.rejected, (state, action) => {
            state.fetchState.loading = false;
            state.fetchState.error = action.error.message;
         });
   },
});

export const { changeAuth, updateCaseSummaries } = manageTicketSlice.actions;

export default manageTicketSlice.reducer;
