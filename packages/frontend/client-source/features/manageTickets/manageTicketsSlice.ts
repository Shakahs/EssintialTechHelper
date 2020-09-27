import {
   createEntityAdapter,
   createSlice,
   EntityState,
   PayloadAction,
} from "@reduxjs/toolkit";
import { CaseSummary } from "../../api";
import { fetchCases, fetchCasesState } from "./thunks";

interface CurrentCaseSummaries {
   currentCaseSummaries: EntityState<CaseSummary>;
}

type StateShape = CurrentCaseSummaries & {
   fetchState: fetchCasesState;
};

const caseAdapter = createEntityAdapter<CaseSummary>({
   selectId: (c) => c.Id,
});

let initialState: StateShape = {
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

export const { updateCaseSummaries } = manageTicketSlice.actions;

export default manageTicketSlice.reducer;
