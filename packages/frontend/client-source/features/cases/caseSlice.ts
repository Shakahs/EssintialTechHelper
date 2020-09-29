import {
   createEntityAdapter,
   createSlice,
   EntityState,
   PayloadAction,
} from "@reduxjs/toolkit";
import { CaseSummary } from "../../api";
import { fetchCases } from "./caseThunks";
import { sliceName } from "./caseConstants";
import { fetchState } from "../common";

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
   fetchCaseState: fetchState;
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
   fetchCaseState: {
      loading: false,
      error: "",
   },
};

export const caseSlice = createSlice({
   name: sliceName,
   initialState,
   reducers: {
      upsertCaseSummary(state, action: PayloadAction<CaseSummary>) {
         caseAdapter.upsertOne(state.currentCaseSummaries, action.payload);
      },
      replaceCaseSummaries(state, action: PayloadAction<CaseSummary[]>) {
         caseAdapter.setAll(state.currentCaseSummaries, action.payload);
      },
      deleteCaseSummary(state, action: PayloadAction<string>) {
         caseAdapter.removeOne(state.currentCaseSummaries, action.payload);
      },
      updateFilters(state, action: PayloadAction<CaseFilters>) {
         state.caseFilters = action.payload;
      },
   },
   extraReducers: (builder) => {
      builder
         .addCase(fetchCases.pending, (state, action) => {
            state.fetchCaseState.loading = true;
            state.fetchCaseState.error = "";
         })
         .addCase(fetchCases.fulfilled, (state, action) => {
            state.fetchCaseState.loading = false;
         })
         .addCase(fetchCases.rejected, (state, action) => {
            state.fetchCaseState.loading = false;
            state.fetchCaseState.error = action.error.message;
         });
   },
});

export const {
   replaceCaseSummaries,
   updateFilters,
   upsertCaseSummary,
   deleteCaseSummary,
} = caseSlice.actions;

export default caseSlice.reducer;
