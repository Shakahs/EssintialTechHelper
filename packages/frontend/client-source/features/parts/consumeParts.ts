import {
   ConsumePartFormType,
   dispositions,
   PartActivity,
   PartDataForActionCreation,
   PartNotUsedAction,
   PartUsedAction,
   ReturnablePartUsedAction,
} from "./consumePartsTypes";
import { ConsumableParts } from "./types";

export const isPartSerialized = (part: ConsumableParts) =>
   part.SerialNumber.length > 0;

export const isPartReturnable = (part: ConsumableParts): boolean =>
   Boolean(Number(part.Returnable));

export const convertToAction = (
   formData: ConsumePartFormType,
   partData: ConsumableParts
): PartActivity => {
   if (
      dispositions[formData.partDisposition].partUsed &&
      isPartReturnable(partData)
   ) {
      const action: ReturnablePartUsedAction = {
         ActionCode: "PU",
         Charges: [],
         Parts: [
            {
               CorePartCarrier: "FDX",
               CorePartNumber: partData.PartNo,
               CorePartQty: "1",
               CorePartTracking:
                  formData.returnTracking === "manual"
                     ? formData.manualTracking
                     : formData.returnTracking,
               CorePartSerial: formData.serial,
               Description: partData.PartDescription,
               Number: partData.PartNo,
               Quantity: 1,
               SeqNo: partData.DetailSequence,
               Serial: partData.SerialNumber,
            },
         ],
      };
      return { Activities: [action] };
   } else if (
      dispositions[formData.partDisposition].partUsed &&
      !isPartReturnable(partData)
   ) {
      const action: PartUsedAction = {
         ActionCode: "PU",
         Charges: [],
         Parts: [
            {
               Description: partData.PartDescription,
               Number: partData.PartNo,
               Quantity: 1,
               SeqNo: partData.DetailSequence,
               Serial: formData.serial ?? "",
            },
         ],
      };
      return { Activities: [action] };
   } else if (!dispositions[formData.partDisposition].partUsed) {
      const action: PartNotUsedAction = {
         ActionCode: "RET",
         Charges: [],
         Parts: [
            {
               ReturnPartCarrier: "FDX",
               ReturnPartComments: formData.comments,
               ReturnPartNumber: partData.PartNo,
               ReturnPartQty: 1,
               ReturnPartReasonCode:
                  dispositions[formData.partDisposition].subCode,
               ReturnPartSeqNo: partData.DetailSequence,
               ReturnPartSerial: formData.serial ?? "",
               ReturnPartTracking:
                  formData.returnTracking === "manual"
                     ? formData.manualTracking
                     : formData.returnTracking,
            },
         ],
      };
      return { Activities: [action] };
   }
};
