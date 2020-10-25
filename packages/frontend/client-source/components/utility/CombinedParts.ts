import { combinedPartsData, RequestedParts } from "../../api";

export class CombinedParts {
   parts: combinedPartsData = {};

   ensurePartRepresented(partNumber: string) {
      if (this.parts[partNumber] === undefined) {
         this.parts[partNumber] = {
            requestedQuantity: 0,
            sequences: {},
         };
      }
   }

   addPartsRequest(rp: RequestedParts) {
      rp.PartRequested.forEach((r) => {
         this.ensurePartRepresented(r.PartNo);
         this.parts[r.PartNo].requestedQuantity += Number(r.PartQty);
      });
   }
}
