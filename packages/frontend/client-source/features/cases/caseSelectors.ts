import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../rootReducer";
import { filter, sortBy, remove } from "lodash";
import { CaseBase, isProjectWork } from "../../api";
import { caseStatusMapping } from "../../constants";
import { caseAdapter } from "./caseConstants";

const getCaseFilters = (state: RootState) => state.caseSlice.caseFilters;
const builtinSelectors = caseAdapter.getSelectors<RootState>(
   (state) => state.caseSlice.caseSummaries
);
const allCases = (state: RootState) => builtinSelectors.selectAll(state);

const filterStage1 = createSelector([allCases, getCaseFilters], (cases, f) => {
   const result = filter(cases, (c) => {
      if (isProjectWork(c)) {
         return f.showProjectWork;
      }
      return true;
   });
   return result;
});

export const getCasesAssigned = createSelector(filterStage1, (cases) => {
   return filter(
      cases,
      (c) => c.UserStatus === caseStatusMapping.Assign.whenReading
   );
});

export const getCasesCommitted = createSelector(filterStage1, (cases) => {
   return filter(
      cases,
      (c) => c.UserStatus === caseStatusMapping.Commit.whenReading
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

export const getCasesComplete = createSelector(filterStage1, (cases) => {
   return filter(
      cases,
      (c) => c.UserStatus === caseStatusMapping.Complete.whenReading
   );
});

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
   [filterStage3, getCasesEnroute, getCasesArrive],
   (cases, enroute, arrived) => [
      ...arrived,
      ...enroute,
      ...sortBy(cases, (i) => i.ScheduledDateTime),
   ]
);

export const getCityFilterOptions = createSelector(filterStage2, (cases) =>
   Array.from(new Set(cases.map((c) => c.Location.City.toLowerCase())))
);
