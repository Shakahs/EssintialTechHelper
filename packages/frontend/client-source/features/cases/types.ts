import { ConsumedParts } from "../parts/types";
import { RootState } from "../rootReducer";

export interface CaseBase {
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
   ScheduledDateTime: string;
   UserStatus: string; // CMPL=complete, CMTD=commited, ASGN=assigned
   Location: {
      Address1: string;
      City: string;
      FullAddress: string;
      State: string;
      Zip: string;
   };
   Milestones: {
      ActualDateTime: string;
      CalculatedDateTime: string;
      Code: string;
   }[];
}

export interface Comment {
   CommentText: string;
   ServiceRepresentativeId: string;
   CommentDateTime: string;
}

export interface CaseFullFields {
   ProblemDesc: string;
   Comments: Comment[];
   References: { Value: string; Code: string }[];
   Activities: ConsumedParts[];
}

export type CaseSummary = CaseBase & Partial<CaseFullFields>;
export type CaseFull = CaseBase & CaseFullFields;

export interface DecodedCaseNumber {
   original: string;
   masterCase: string;
   subcaseCounter: string;
}

export interface NewStatusBody {
   Code: string;
   Comment: string;
   HoldReasonCode: string;
}

export interface NewETABody {
   NewSubcaseComment: string;
   ScheduledDateTime: string;
   ServiceRep: {
      Id: string;
   };
}

export interface CheckoutBody {
   Comment: string;
   ResolvedFlag: boolean;
   ScheduleDateTime: string | null;
   SelfAssignFlag: boolean;
   ServiceRep: string | null;
   ReasonCode: string;
}

export type StatusCodes =
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
   reduxCaseSelector?: (s: RootState) => CaseBase[];
}

export type CaseStatusMappingCollection = {
   [key in StatusCodes]: CaseStatusMapping;
};

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
