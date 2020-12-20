import { CaseFull } from "../cases/types";

export interface RequestedParts {
   RequestNo: string;
   RequestByName: string;
   Comments: string;
   RequestStatus: string;
   PartRequested: {
      PartNo: string;
      PartQty: string;
      PartDescription: string;
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
   Returnable: string; // string 0 for false
   PartAvailableQty: number;
   SerialNumber: string;
   PartReturnTracking: {
      ReturnTrackingNumber: string;
      ReturnTrackingCarrier: string;
   }[];
}

export interface combinedPartsSequence {
   sequenceNumber: string;
   returnable: boolean;
   shippedQuantity: number;
   shippedSerialNumbers: string[];
   shippedTrackingNumbers: string[];
   consumableQuantity: number;
   consumableSerialNumbers: string[];
   consumableReturnTrackingNumbers: string[];
   consumedQuantity: number;
   consumedSerialNumbers: string[];
   consumedReturnTrackingNumbers: string[];
}

export interface combinedPartsSubData {
   partNumber: string;
   requestedQuantity: number;
   sequences: {
      //key by logistics F sequence number (F98765*1)
      [k: string]: combinedPartsSequence;
   };
}

export interface combinedPartsData {
   //key by part number (RA-987654)
   [k: string]: combinedPartsSubData;
}

export interface DecodePartSequenceNumber {
   masterSequence: string;
   counter?: string;
   partNumber?: string;
}

export type ConsumePartResponse = Pick<CaseFull, "Id" | "Activities">;
