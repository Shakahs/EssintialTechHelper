import {
   createEntityAdapter,
   createSlice,
   EntityState,
   PayloadAction,
} from "@reduxjs/toolkit";
import { CaseBase, CaseSummary } from "../../api";
import { fetchCases } from "./caseThunks";
import { sliceName } from "./caseConstants";
import { fetchState } from "../common";

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

const caseAdapter = createEntityAdapter<CaseSummary>({
   selectId: (c) => c.Id,
});

let initialState: StateShape = {
   caseSummaries: caseAdapter.getInitialState(),
   caseFilters: {
      showAssigned: true,
      showCommitted: true,
      showEnroute: true,
      showArrived: true,
      showComplete: false,
      showHold: true,
      showProjectWork: false,
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
