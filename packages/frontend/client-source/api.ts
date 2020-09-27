import { find, findKey } from "lodash";
import CaseSummaryItem from "./components/Manage/CaseSummaryItem";

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
}

type CaseStatusMappingCollection = {
   [key in StatusCodes]: CaseStatusMapping;
};

export const caseStatusMapping: Partial<CaseStatusMappingCollection> = {
   Assign: {
      name: "Assigned",
      whenReading: "ASGN",
      nextStatus: ["Commit", "Reject"],
   },
   Commit: {
      name: "Committed",
      whenReading: "CMTD",
      whenUpdating: "COMMIT",
      nextStatus: ["Enroute", "Reject"],
   },
   Reject: {
      name: "Rejected",
      whenUpdating: "REJECT",
   },
   Enroute: {
      name: "Enroute",
      whenReading: "ENRT",
      whenUpdating: "ENROUTE",
      nextStatus: ["Arrive"],
   },
   Arrive: {
      name: "Arrived",
      whenReading: "ARRV",
   },
   Complete: {
      name: "Completed",
      whenReading: "CMPL",
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
