import {
   ConsumePartFormType,
   dispositions,
   PartDataForActionCreation,
   PartNotUsedAction,
   PartUsedAction,
   ReturnablePartUsedAction,
} from "./consumePartsTypes";
import { ConsumableParts } from "../api";

export const isPartSerialized = (part: ConsumableParts) =>
   part.SerialNumber.length > 0;

export const isPartReturnable = (part: ConsumableParts): boolean =>
   Boolean(Number(part.Returnable));

export const convertToAction = (
   data: ConsumePartFormType,
   part: ConsumableParts
): PartUsedAction | PartNotUsedAction | ReturnablePartUsedAction => {
   if (dispositions[data.partDisposition].partUsed && isPartReturnable(part)) {
      const action: ReturnablePartUsedAction = {
         ActionCode: "PU",
         Charges: [],
         Parts: [
            {
               CorePartCarrier: "FDX",
               CorePartNumber: part.PartNo,
               CorePartQty: "1",
               CorePartTracking:
                  data.returnTracking === "manual"
                     ? data.manualTracking
                     : data.returnTracking,
               CorePartSerial: data.serial,
               Description: part.PartDescription,
               Number: part.PartNo,
               Quantity: 1,
               SeqNo: part.DetailSequence,
               Serial: data.serial,
            },
         ],
      };
      return action;
   } else if (
      dispositions[data.partDisposition].partUsed &&
      !isPartReturnable(part)
   ) {
      const action: PartUsedAction = {
         ActionCode: "PU",
         Charges: [],
         Parts: [
            {
               Description: part.PartDescription,
               Number: part.PartNo,
               Quantity: 1,
               SeqNo: part.DetailSequence,
               Serial: data.serial,
            },
         ],
      };
      return action;
   } else if (!dispositions[data.partDisposition].partUsed) {
      const action: PartNotUsedAction = {
         ActionCode: "RET",
         Charges: [],
         Parts: [
            {
               ReturnPartCarrier: "FDX",
               ReturnPartComments: data.comments,
               ReturnPartNumber: part.PartNo,
               ReturnPartQty: 1,
               ReturnPartReasonCode: dispositions[data.partDisposition].subCode,
               ReturnPartSeqNo: part.DetailSequence,
               ReturnPartSerial: data.serial,
               ReturnPartTracking:
                  data.returnTracking === "manual"
                     ? data.manualTracking
                     : data.returnTracking,
            },
         ],
      };
      return action;
   }
};
