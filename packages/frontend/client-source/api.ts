import { find, findKey } from "lodash";
import CaseSummaryItem from "./components/Manage/CaseSummaryItem";
import rootReducer, { RootState } from "./rootReducer";
import store from "./store";
import { updateFilters } from "./features/manageTickets/caseSlice";
import {
   getCasesArrive,
   getCasesAssigned,
   getCasesCommitted,
   getCasesComplete,
   getCasesEnroute,
} from "./features/manageTickets/caseSelectors";

export interface UnnecessaryArray<T> {
   Results: T[];
}

export interface DoubleUnneccessaryArray<T> {
   Results: T[][];
}

export interface Account {
   Id: string;
   Name: string;
   SessionId: string;
}

export interface CaseSummary {
   ArriveDateTime: Date;
   CompletionDateTime: Date;
   CustomerCompany: string;
   CustomerId: string;
   Id: string; //Subcase number
   Model: string; //part number
   Serial: string; //part serial number
   OpenDate: Date;
   OpenDateTime: Date;
   Priority: string;
   ProblemCode: string; // PROJECT / P3T (p3 tech only) / P2
   ScheduledDateTime: Date;
   UserStatus: string; // CMPL=complete, CMTD=commited, ASGN=assigned
   Location: {
      Address1: string;
      City: string;
      FullAddress: string;
      State: string;
      Zip: string;
   };
   Milestones: {
      ActualDateTime: Date;
      CalculatedDateTime: Date;
      Code: string;
   }[];
}

export interface GlossaryWord {
   code: string;
   dropdown: string;
   function: string;
   mandatory: string;
   mask: string;
   text: string;
   value: string;
}

export enum CurrentCaseStatus {
   Assigned = "ASGN",
   Committed = "CMTD",
   // Reject = "REJECT", you never see a ticket after you reject it
   Enroute = "ENRT",
   Arrive = "ARRV",
   Complete = "CMPL",
   // WorkDone = "WORKDONE", this is going to be a new status code
   Hold = "HOLD",
   ReleaseHold = "HOLDREL",
}

export function isProjectWork(sb: CaseSummary): boolean {
   return sb.ProblemCode === "PROJECT";
}

export type NewStatusCode = "COMMIT";

type StatusCodes =
   | "Assign"
   | "Commit"
   | "Reject"
   | "Enroute"
   | "Arrive"
   | "Complete"
   | "WorkDone";

export interface CaseStatusMapping {
   name: string;
   whenReading?: string;
   whenUpdating?: string;
   nextStatus?: StatusCodes[];
   isCaseSequenceFilter: boolean;
   reduxFilterSelector?: () => boolean;
   reduxToggle?: () => void;
   reduxCaseSelector?: (s: RootState) => CaseSummary[];
}

type CaseStatusMappingCollection = {
   [key in StatusCodes]: CaseStatusMapping;
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
      nextStatus: ["Arrive"],
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

export const findCaseStatusName = (cs: CaseSummary): CaseStatusMapping => {
   return find(
      caseStatusMapping,
      (possStatus) => cs.UserStatus === possStatus.whenReading
   );
};

export interface NewStatusBody {
   Code: string;
   Comment: string;
   HoldReasonCode: string;
}
