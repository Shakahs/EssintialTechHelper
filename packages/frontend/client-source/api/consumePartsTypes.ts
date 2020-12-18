interface dispositionType {
   label: string;
   partUsed: boolean;
   subCode?: string;
}

interface dispositionsType {
   [k: string]: dispositionType;
}

export const dispositions: dispositionsType = {
   used: {
      label: "Used",
      partUsed: true,
   },
   unused: {
      label: "Not Used - Good Not Used",
      partUsed: false,
      subCode: "RC1",
   },
   doa: {
      label: "Not Used - Dead On Arrival",
      partUsed: false,
      subCode: "RC2",
   },

   wrongPart: {
      label: "Not Used - Wrong Part",
      partUsed: false,
      subCode: "RC3",
   },
};

interface PartActionBase<T> {
   ActionCode: string;
   Charges: null[];
   Parts: T[];
}

interface PartUsedActionCore {
   Description: string; //part description
   Number: string; //part number
   Quantity: number;
   SeqNo: string; //logistics identifier
   Serial: string; // empty string if no serial
}

interface ReturnablePartUsedActionCore extends PartUsedActionCore {
   CorePartCarrier: string;
   CorePartNumber: string;
   CorePartQty: string;
   CorePartTracking: string;
   CorePartSerial: string;
}

interface PartNotUsedActionCore {
   ReturnPartCarrier: string;
   ReturnPartComments: string;
   ReturnPartNumber: string;
   ReturnPartQty: number;
   ReturnPartReasonCode: string;
   ReturnPartSeqNo: string;
   ReturnPartSerial: string;
   ReturnPartTracking: string;
}

export type PartUsedAction = PartActionBase<PartUsedActionCore>;
export type ReturnablePartUsedAction = PartActionBase<
   ReturnablePartUsedActionCore
>;
export type PartNotUsedAction = PartActionBase<PartNotUsedActionCore>;

export interface ConsumePartFormType {
   partDisposition: dispositionType;
   returnTracking: string; //tracking number or "manual"
   serial: string;
   manualTracking: string;
   comments: string;
}

export interface PartDataForActionCreation {
   partNumber: string;
   partDescription: string;
   logisticsSequence: string;
}
