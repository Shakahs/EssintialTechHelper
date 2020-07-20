import { GeoJSON, MultiPoint, Point } from "geojson";

export interface APITicket {
   _id: string;
   _source: {
      createDt: Date;
      createTm: string;
      detailId: string; //SRM number
      siteAddr: string;
      srmModelDesc: string[];
      srmModelNo: string[];
      srmPrio: string[];
      srmSiteCity: string;
      srmSiteName: string;
      srmSiteState: string;
   };
}

export interface APIResult {
   hits: {
      hits: APITicket[];
      total: number;
   };
}

export interface Ticket {
   ticketNumber: string;
   partNumber: string;
   partDescription: string;
   location: GeoJSON.FeatureCollection<Point>;
}
