import {
   getCasesArrive,
   getCasesAssigned,
   getCasesCommitted,
   getCasesComplete,
   getCasesEnroute,
} from "./features/cases/caseSelectors";
import store from "./store";
import { updateFilters } from "./features/cases/caseSlice";
import { CaseStatusMappingCollection } from "./api";

export const apiBase = "https://srmbuddy.essintial.com/webapi/api";

export const defaultRequestHeaders = {
   "Content-Type": "application/json;charset=UTF-8",
};

export const caseStatusMapping: Partial<CaseStatusMappingCollection> = {
   Assign: {
      name: "Assigned",
      whenReading: "ASGN",
      nextStatus: ["Commit", "Reject"],
      isCaseSequenceFilter: true,
      reduxCaseSelector: getCasesAssigned,
      reduxFilterSelector: () =>
         store.getState().manageTickets.caseFilters.showAssigned,
      reduxToggle: () =>
         store.dispatch(
            updateFilters({
               ...store.getState().manageTickets.caseFilters,
               showAssigned: !store.getState().manageTickets.caseFilters
                  .showAssigned,
            })
         ),
   },
   Commit: {
      name: "Committed",
      whenReading: "CMTD",
      whenUpdating: "COMMIT",
      nextStatus: ["Enroute", "Reject"],
      isCaseSequenceFilter: true,
      reduxCaseSelector: getCasesCommitted,
      reduxFilterSelector: () =>
         store.getState().manageTickets.caseFilters.showCommitted,
      reduxToggle: () =>
         store.dispatch(
            updateFilters({
               ...store.getState().manageTickets.caseFilters,
               showCommitted: !store.getState().manageTickets.caseFilters
                  .showCommitted,
            })
         ),
   },
   Reject: {
      name: "Rejected",
      whenUpdating: "REJECT",
      isCaseSequenceFilter: false,
   },
   Enroute: {
      name: "Enroute",
      whenReading: "ENRT",
      whenUpdating: "ENROUTE",
      nextStatus: ["Commit", "Arrive"],
      isCaseSequenceFilter: true,
      reduxCaseSelector: getCasesEnroute,
      reduxFilterSelector: () =>
         store.getState().manageTickets.caseFilters.showEnroute,
      reduxToggle: () =>
         store.dispatch(
            updateFilters({
               ...store.getState().manageTickets.caseFilters,
               showEnroute: !store.getState().manageTickets.caseFilters
                  .showEnroute,
            })
         ),
   },
   Arrive: {
      name: "Arrived",
      whenReading: "ARRV",
      whenUpdating: "ARRIVE",
      isCaseSequenceFilter: true,
      reduxCaseSelector: getCasesArrive,
      reduxFilterSelector: () =>
         store.getState().manageTickets.caseFilters.showArrived,
      reduxToggle: () =>
         store.dispatch(
            updateFilters({
               ...store.getState().manageTickets.caseFilters,
               showArrived: !store.getState().manageTickets.caseFilters
                  .showArrived,
            })
         ),
   },
   Complete: {
      name: "Completed",
      whenReading: "CMPL",
      isCaseSequenceFilter: true,
      reduxCaseSelector: getCasesComplete,
      reduxFilterSelector: () =>
         store.getState().manageTickets.caseFilters.showComplete,
      reduxToggle: () =>
         store.dispatch(
            updateFilters({
               ...store.getState().manageTickets.caseFilters,
               showComplete: !store.getState().manageTickets.caseFilters
                  .showComplete,
            })
         ),
   },
};
