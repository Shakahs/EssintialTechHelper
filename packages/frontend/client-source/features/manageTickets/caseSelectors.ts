import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../rootReducer";
import { filter, intersection, intersectionBy, intersectionWith } from "lodash";
import { caseStatusMapping, CaseSummary } from "../../api";

const cases = (state: RootState) =>
   state.manageTickets.currentCaseSummaries.entities;

export const getCasesAssigned = createSelector(cases, (cases) => {
   return filter(
      cases,
      (c) => c.UserStatus === caseStatusMapping.Assign.whenReading
   );
});

export const getCasesCommitted = createSelector(cases, (cases) => {
   return filter(
      cases,
      (c) => c.UserStatus === caseStatusMapping.Commit.whenReading
   );
});

export const getCasesEnroute = createSelector(cases, (cases) => {
   return filter(
      cases,
      (c) => c.UserStatus === caseStatusMapping.Enroute.whenReading
   );
});

export const getCasesArrive = createSelector(cases, (cases) => {
   return filter(
      cases,
      (c) => c.UserStatus === caseStatusMapping.Arrive.whenReading
   );
});

export const getCasesComplete = createSelector(cases, (cases) => {
   return filter(
      cases,
      (c) => c.UserStatus === caseStatusMapping.Complete.whenReading
   );
});

const getCaseFilters = (state: RootState) => state.manageTickets.caseFilters;

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
      const finalArray: CaseSummary[] = [];
      if (filters.showAssigned) {
         finalArray.push(...casesAssigned);
      }
      if (filters.showCommitted) {
         finalArray.push(...casesCommitted);
      }
      if (filters.showEnroute) {
         finalArray.push(...casesEnroute);
      }
      if (filters.showArrived) {
         finalArray.push(...casesArrive);
      }
      if (filters.showComplete) {
         finalArray.push(...casesComplete);
      }
      return finalArray;
   }
);
