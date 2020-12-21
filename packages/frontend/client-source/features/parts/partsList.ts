import * as partsList from "../../assets/riteAidPartList.json";

export class PartsList {
   lookupPart(pn: string): string {
      return partsList?.[pn]?.description ?? pn;
   }
}
