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

export interface TechSubcase {
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
   ScheduledDateTime: Date;
   UserStatus: string; // CMPL=complete, CMTD=commited, etc.
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
