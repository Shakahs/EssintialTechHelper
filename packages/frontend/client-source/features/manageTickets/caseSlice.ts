import {
   createEntityAdapter,
   createSlice,
   EntityState,
   PayloadAction,
} from "@reduxjs/toolkit";
import { CaseSummary } from "../../api";
import { fetchCases, fetchCasesState } from "./caseThunks";
import { sliceName } from "./caseConstants";

interface CurrentCaseSummaries {
   currentCaseSummaries: EntityState<CaseSummary>;
}

interface CaseFilters {
   showAssigned: boolean;
   showCommitted: boolean;
   showEnroute: boolean;
   showArrived: boolean;
   showComplete: boolean;
   showHold: boolean;
   showProjectWork: boolean;
}

type StateShape = CurrentCaseSummaries & { caseFilters: CaseFilters } & {
   fetchState: fetchCasesState;
};

const caseAdapter = createEntityAdapter<CaseSummary>({
   selectId: (c) => c.Id,
});

let initialState: StateShape = {
   currentCaseSummaries: caseAdapter.getInitialState(),
   caseFilters: {
      showAssigned: true,
      showCommitted: true,
      showEnroute: true,
      showArrived: true,
      showComplete: false,
      showHold: true,
      showProjectWork: false,
   },
   fetchState: {
      loading: false,
      error: "",
   },
};

export const caseSlice = createSlice({
   name: sliceName,
   initialState,
   reducers: {
      updateCaseSummaries(state, action: PayloadAction<CaseSummary[]>) {
         caseAdapter.setAll(state.currentCaseSummaries, action.payload);
      },
      updateFilters(state, action: PayloadAction<CaseFilters>) {
         state.caseFilters = action.payload;
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

export const { updateCaseSummaries, updateFilters } = caseSlice.actions;

export default caseSlice.reducer;
