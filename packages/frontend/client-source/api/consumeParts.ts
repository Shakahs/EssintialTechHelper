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
   formData: ConsumePartFormType,
   partData: ConsumableParts
): PartUsedAction | PartNotUsedAction | ReturnablePartUsedAction => {
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
               Serial: formData.serial ?? "",
            },
         ],
      };
      return action;
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
      return action;
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
      return action;
   }
};
