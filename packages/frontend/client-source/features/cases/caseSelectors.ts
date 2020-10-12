import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../rootReducer";
import { filter, sortBy, remove } from "lodash";
import { CaseBase, isProjectWork } from "../../api";
import { caseStatusMapping } from "../../constants";

const getCaseFilters = (state: RootState) => state.caseSlice.caseFilters;

const allCases = (state: RootState) =>
   state.caseSlice.currentCaseSummaries.entities;

const preFilteredCases = createSelector(
   [allCases, getCaseFilters],
   (cases, f) => {
      const result = filter(cases, (c) => {
         if (isProjectWork(c)) {
            return f.showProjectWork;
         }
         return true;
      });
      return result;
   }
);

export const getCasesAssigned = createSelector(preFilteredCases, (cases) => {
   return filter(
      cases,
      (c) => c.UserStatus === caseStatusMapping.Assign.whenReading
   );
});

export const getCasesCommitted = createSelector(preFilteredCases, (cases) => {
   return filter(
      cases,
      (c) => c.UserStatus === caseStatusMapping.Commit.whenReading
   );
});

export const getCasesEnroute = createSelector(preFilteredCases, (cases) => {
   return filter(
      cases,
      (c) => c.UserStatus === caseStatusMapping.Enroute.whenReading
   );
});

export const getCasesArrive = createSelector(preFilteredCases, (cases) => {
   return filter(
      cases,
      (c) => c.UserStatus === caseStatusMapping.Arrive.whenReading
   );
});

export const getCasesComplete = createSelector(preFilteredCases, (cases) => {
   return filter(
      cases,
      (c) => c.UserStatus === caseStatusMapping.Complete.whenReading
   );
});

export const getCaseFilterResult = createSelector(
   [
      getCasesAssigned,
      getCasesCommitted,
      getCasesEnroute,
      getCasesArrive,
      getCasesComplete,
      getCaseFilters,
   ],
   (
      casesAssigned,
      casesCommitted,
      casesEnroute,
      casesArrive,
      casesComplete,
      filters
   ) => {
      const caseSequenceFilterResult: CaseBase[] = [];
      if (filters.showAssigned) {
         caseSequenceFilterResult.push(...casesAssigned);
      }
      if (filters.showCommitted) {
         caseSequenceFilterResult.push(...casesCommitted);
      }
      if (filters.showEnroute) {
         caseSequenceFilterResult.push(...casesEnroute);
      }
      if (filters.showArrived) {
         caseSequenceFilterResult.push(...casesArrive);
      }
      if (filters.showComplete) {
         caseSequenceFilterResult.push(...casesComplete);
      }

      return caseSequenceFilterResult;
   }
);

export const getFilteredSortedCases = createSelector(
   getCaseFilterResult,
   (filteredCases) => {
      const others = sortBy(filteredCases, (i) => i.ScheduledDateTime);

      const arrived = remove(
         others,
         (i) => i.UserStatus === caseStatusMapping.Arrive.whenReading
      );
      const enroute = remove(
         others,
         (i) => i.UserStatus === caseStatusMapping.Enroute.whenReading
      );

      const sortedResult = [...arrived, ...enroute, ...others];

      return sortedResult;
   }
);
