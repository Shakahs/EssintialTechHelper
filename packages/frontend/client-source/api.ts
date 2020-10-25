import { find } from "lodash";
import { RootState } from "./rootReducer";
import { caseStatusMapping, defaultRequestHeaders } from "./constants";
import { zonedTimeToUtc } from "date-fns-tz";

export interface ResultsObject<T> {
   Results: T[];
   ReturnCode: number;
   ReturnMessage: string;
}

export interface ResultsObjectDoubleWrapped<T extends ResultsObject<T>> {
   Results: T[][];
}

export interface APISession {
   Id: string;
   Name: string;
   SessionId: string;
   ServiceRep: {
      Id: string;
   };
}

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

export function isProjectWork(sb: CaseBase): boolean {
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
   reduxCaseSelector?: (s: RootState) => CaseBase[];
}

export type CaseStatusMappingCollection = {
   [key in StatusCodes]: CaseStatusMapping;
};

export const findCaseStatusName = (cs: CaseBase): CaseStatusMapping => {
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

export interface NewETABody {
   NewSubcaseComment: string;
   ScheduledDateTime: string;
   ServiceRep: {
      Id: string;
   };
}

export interface Credentials {
   email: string | null;
   password: string | null;
}

export interface APISessionState {
   apiSessionData: APISession | null;
   apiSessionCreation: string | null;
}

export const buildRequestHeaders = (apiSession: APISession) => ({
   ...defaultRequestHeaders,
   Authorization: apiSession.SessionId,
});

export interface CheckoutBody {
   Comment: string;
   ResolvedFlag: boolean;
   ScheduleDateTime: string | null;
   SelfAssignFlag: boolean;
   ServiceRep: string | null;
   ReasonCode: string;
}

export const timeFormatWhenUpdating = "LLL dd, yyyy hh:mm aa";
export const standardDateTimeFormatting = "L/d h:mm b";

export const parseSLA_Date = (datestring: string): Date =>
   zonedTimeToUtc(datestring, Intl.DateTimeFormat().resolvedOptions().timeZone);

export interface combinedPartsData {
   //key by part number (RA-987654)
   [k: string]: {
      requestedQuantity: number;
      sequences: {
         //key by logistics F sequence number (F98765*1)
         [k: string]: {
            shippedQuantity: number;
            shippedSerialNumbers: string[];
            shippedTrackingNumbers: string[];
            consumableQuantity: number;
            consumableSerialNumbers: string[];
            consumableReturnTrackingNumbers: string[];
            consumedQuantity: number;
            consumedSerialNumbers: string[];
            consumedReturnTrackingNumbers: string[];
         };
      };
   };
}

export interface RequestedParts {
   RequestNo: string;
   PartRequested: {
      PartNo: string;
      PartQty: string;
   }[];
}

export interface ShippedParts {
   DetailSequence: string; //shipment F number
   PartDescription: string;
   PartNo: string;
   ShipVia: string;
   PartShippedQty: number;
   PartShipped: {
      SerialNumbers: string[];
      ShippedQty: number;
      TrackingNumbers: string[];
   }[];
}

export interface ConsumePartsBody {
   ActionCode: "PU";
   Charges: [];
   Parts: {
      SeqNo: string;
      Number: string;
      Description: string;
      Serial: string;
      Quantity: number;
   }[];
}

export interface ConsumedParts {
   ActionCode: "PU";
   Parts: {
      Description: string;
      Number: string;
      Quantity: string;
      Serial: string;
      SeqNo: string;
      CorePartNumber: string;
      CorePartTracking: string;
      CorePartSerial: string;
   }[];
}

export interface ConsumableParts {
   PartNo: string;
   PartDescription: string;
   DetailSequence: string;
   Returnable: string;
   PartAvailableQty: number;
   SerialNumber: string;
   PartReturnTracking: {
      ReturnTrackingNumber: string;
   }[];
}

export interface DecodedCaseNumber {
   original: string;
   masterCase: string;
   subcaseCounter: string;
}

export const decodeCaseNumber = (c: string): DecodedCaseNumber => {
   const split = c.split("-");
   return {
      original: c,
      masterCase: split[0],
      subcaseCounter: split[1],
   };
};
