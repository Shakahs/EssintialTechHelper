import * as partsListJSON from "../../assets/riteAidPartList.json";

class PartsList {
   parts: Map<string, { partDescription: string }> = new Map();

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
}

export const partsList = new PartsList();
