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
   UserStatus: CaseSummaryStatus; // CMPL=complete, CMTD=commited, ASGN=assigned
   Location: {
      Address1: string;
      City: string;
      FullAddress: string;
      State: string;
      Zip: string;
   };
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

export enum CaseSummaryStatus {
   Assigned = "ASGN",
   Committed = "CMTD",
   Complete = "CMPL",
}

export function isProjectWork(sb: CaseSummary): Boolean {
   return sb.ProblemCode.endsWith("T");
}

export interface NewStatusBody {
   Code: CaseSummaryStatus;
   Comment: string;
   HoldReasonCode: string;
}
