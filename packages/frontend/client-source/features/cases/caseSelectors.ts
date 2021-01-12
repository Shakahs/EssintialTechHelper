import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../rootReducer";
import { filter, sortBy, remove } from "lodash";
import { caseAdapter } from "./caseConstants";
import { CaseBase } from "./types";
import { isCaseProjectWork } from "./utility";
import { caseStatusMapping } from "./constants";

const getCaseFilters = (state: RootState) => state.caseSlice.caseFilters;
const builtinSelectors = caseAdapter.getSelectors<RootState>(
   (state) => state.caseSlice.caseSummaries
);
const allCases = (state: RootState) => builtinSelectors.selectAll(state);

export const getCasesAssigned = createSelector(allCases, (cases) => {
   return filter(
      cases,
      (c) => c.UserStatus === caseStatusMapping.Assign.whenReading
   );
});

export const getCasesCommitted = createSelector(allCases, (cases) => {
   return filter(
      cases,
      (c) => c.UserStatus === caseStatusMapping.Commit.whenReading
   );
});

export const getCasesComplete = createSelector(allCases, (cases) => {
   return filter(
      cases,
      (c) => c.UserStatus === caseStatusMapping.Complete.whenReading
   );
});

export const getCasesEnroute = createSelector(allCases, (cases) => {
   return filter(
      cases,
      (c) => c.UserStatus === caseStatusMapping.Enroute.whenReading
   );
});

export const getCasesArrive = createSelector(allCases, (cases) => {
   return filter(
      cases,
      (c) => c.UserStatus === caseStatusMapping.Arrive.whenReading
   );
});

export const getActiveTickets = createSelector(
   [getCasesEnroute, getCasesArrive],
   (enroute, arrived) => [...arrived, ...enroute]
);

export const filterStage2 = createSelector(
   [getCasesAssigned, getCasesCommitted, getCasesComplete, getCaseFilters],
   (casesAssigned, casesCommitted, casesComplete, filters) => {
      let stageResult: CaseBase[] = [];
      if (filters.showAssigned) {
         stageResult.push(...casesAssigned);
      }
      if (filters.showCommitted) {
         stageResult.push(...casesCommitted);
      }

      if (filters.showComplete) {
         stageResult.push(...casesComplete);
      }

      return stageResult;
   }
);

export const filterStage3 = createSelector(
   [filterStage2, getCaseFilters],
   (cases, filters) => {
      let stageResult: CaseBase[] = cases;
      if (filters.showCity !== "") {
         stageResult = stageResult.filter(
            (c) => c.Location.City.toLowerCase() === filters.showCity
         );
      }
      return stageResult;
   }
);

export const combiner = createSelector(
   [filterStage3, getActiveTickets],
   (filterResult, active) => [
      ...active,
      ...sortBy(filterResult, (i) => i.ScheduledDateTime),
   ]
);

export const getCityOptions = createSelector(
   [filterStage2, getActiveTickets],
   (filterResult, active) => [...filterResult, ...active]
);
