import {
   combinedPartsData,
   combinedPartsSequence,
   ConsumableParts,
   ConsumedParts,
   decodeSequenceNumber,
   RequestedParts,
   ShippedParts,
} from "../../api";

export class CombinedParts {
   parts: combinedPartsData = {};

   constructor() {
      this.ensurePartRepresented = this.ensurePartRepresented.bind(this);
      this.ensureSequenceRepresented = this.ensureSequenceRepresented.bind(
         this
      );
      this.addPartsRequest = this.addPartsRequest.bind(this);
      this.addShippedParts = this.addShippedParts.bind(this);
      this.addConsumableParts = this.addConsumableParts.bind(this);
   }

   ensurePartRepresented(partNumber: string) {
      if (this.parts[partNumber] === undefined) {
         this.parts[partNumber] = {
            partNumber,
            requestedQuantity: 0,
            sequences: {},
         };
      }
   }

   ensureSequenceRepresented(
      partNumber: string,
      sequence: string
   ): combinedPartsSequence {
      this.ensurePartRepresented(partNumber);
      if (this.parts[partNumber].sequences[sequence] === undefined) {
         this.parts[partNumber].sequences[sequence] = {
            sequenceNumber: sequence,
            returnable: false,
            shippedQuantity: 0,
            shippedSerialNumbers: [],
            shippedTrackingNumbers: [],
            consumableQuantity: 0,
            consumableSerialNumbers: [],
            consumableReturnTrackingNumbers: [],
            consumedQuantity: 0,
            consumedSerialNumbers: [],
            consumedReturnTrackingNumbers: [],
         };
      }
      return this.parts[partNumber].sequences[sequence];
   }

   addPartsRequest(rp: RequestedParts) {
      rp.PartRequested.forEach((r) => {
         if (r.PartNo !== "MISC") {
            this.ensurePartRepresented(r.PartNo);
            this.parts[r.PartNo].requestedQuantity += Number(r.PartQty);
         }
      });
   }

   addShippedParts(sp: ShippedParts) {
      const decodedSequence = decodeSequenceNumber(sp.DetailSequence);

      const sequence = this.ensureSequenceRepresented(
         sp.PartNo,
         decodedSequence.masterSequence
      );
      sp.PartShipped.forEach((s) => {
         sequence.shippedQuantity += s.ShippedQty;
         sequence.shippedTrackingNumbers = [
            ...sequence.shippedTrackingNumbers,
            ...s.TrackingNumbers,
         ];
         sequence.shippedSerialNumbers = [
            ...sequence.shippedSerialNumbers,
            ...s.SerialNumbers,
         ];
      });
   }

   addConsumableParts(cp: ConsumableParts) {
      const decodedSequence = decodeSequenceNumber(cp.DetailSequence);
      const sequence = this.ensureSequenceRepresented(
         cp.PartNo,
         decodedSequence.masterSequence
      );
      sequence.consumableQuantity = cp.PartAvailableQty;
      sequence.consumableSerialNumbers = [
         ...sequence.consumableSerialNumbers,
         cp.SerialNumber,
      ];

      cp.PartReturnTracking.forEach((rt) => {
         sequence.consumableReturnTrackingNumbers.push(rt.ReturnTrackingNumber);
      });

      sequence.returnable = Boolean(Number(cp.Returnable));
   }

   addConsumedParts(cp: ConsumedParts) {
      //filter for "parts used" action code
      if (cp.ActionCode === "PU") {
         cp.Parts.forEach((c) => {
            const decodedSequence = decodeSequenceNumber(c.SeqNo);
            const sequence = this.ensureSequenceRepresented(
               c.Number,
               decodedSequence.masterSequence
            );
            sequence.consumedQuantity += Number(c.Quantity);
            sequence.consumedSerialNumbers = [
               ...sequence.consumedSerialNumbers,
               ...c.Serial,
            ];
            sequence.consumedReturnTrackingNumbers = [
               ...sequence.consumedReturnTrackingNumbers,
               c.CorePartTracking,
            ];
         });
      }
   }
}
