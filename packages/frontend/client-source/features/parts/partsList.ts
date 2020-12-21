import partsListJSON from "../../assets/riteAidPartList.json";

export interface IndividualPart {
   partDescription: string;
}

class PartsList {
   public parts: Map<string, IndividualPart> = new Map();

   constructor() {
      for (const partsListKey in partsListJSON) {
         this.parts.set(partsListKey, {
            partDescription: partsListJSON[partsListKey].description,
         });
      }
   }

   lookupPart(pn: string): string {
      return this.parts.get(pn)?.partDescription ?? pn;
   }

   searchPart(query: string): Map<string, IndividualPart> {
      const res = new Map<string, IndividualPart>();

      this.parts.forEach((v, k) => {
         if (
            k.toLowerCase().includes(query.toLowerCase()) ||
            v.partDescription.toLowerCase().includes(query.toLowerCase())
         ) {
            res.set(k, v);
         }
      });

      return res;
   }
}

export const partsList = new PartsList();
