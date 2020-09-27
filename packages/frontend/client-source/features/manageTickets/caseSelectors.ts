import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../rootReducer";
import { filter, intersection, intersectionBy, intersectionWith } from "lodash";
import { CaseSummary, isProjectWork } from "../../api";
import { caseStatusMapping } from "../../constants";

const getCaseFilters = (state: RootState) => state.manageTickets.caseFilters;

const allCases = (state: RootState) =>
   state.manageTickets.currentCaseSummaries.entities;

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
      const caseSequenceFilterResult: CaseSummary[] = [];
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
