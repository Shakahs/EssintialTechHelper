import { createSlice, EntityState, PayloadAction } from "@reduxjs/toolkit";
import { fetchCases } from "./caseThunks";
import { caseAdapter, sliceName } from "./caseConstants";
import { fetchState } from "../types";
import { CaseBase, CaseSummary } from "./types";
import { ConsumePartResponse } from "../parts/types";

interface CurrentCaseSummaries {
   caseSummaries: EntityState<CaseSummary>;
}

interface CaseFilters {
   showAssigned: boolean;
   showCommitted: boolean;
   showEnroute: boolean;
   showArrived: boolean;
   showComplete: boolean;
   showHold: boolean;
   showProjectWork: boolean;
   showCity: string;
}

type StateShape = CurrentCaseSummaries & { caseFilters: CaseFilters } & {
   fetchCaseState: fetchState;
};

let initialState: StateShape = {
   caseSummaries: caseAdapter.getInitialState(),
   caseFilters: {
      showAssigned: true,
      showCommitted: true,
      showEnroute: true,
      showArrived: true,
      showComplete: false,
      showHold: true,
      showProjectWork: true,
      showCity: "",
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
      upsertCaseSummary(state, action: PayloadAction<CaseBase>) {
         caseAdapter.upsertOne(state.caseSummaries, action.payload);
      },
      replaceCaseSummaries(state, action: PayloadAction<CaseBase[]>) {
         caseAdapter.setAll(state.caseSummaries, action.payload);
      },
      deleteCaseSummary(state, action: PayloadAction<string>) {
         caseAdapter.removeOne(state.caseSummaries, action.payload);
      },
      updateFilters(state, action: PayloadAction<CaseFilters>) {
         state.caseFilters = action.payload;
      },
      updateCaseActivities(state, action: PayloadAction<ConsumePartResponse>) {
         state.caseSummaries.entities[action.payload.Id].Activities =
            action.payload.Activities;
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
   updateCaseActivities,
} = caseSlice.actions;

export default caseSlice.reducer;
