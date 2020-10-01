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
   created: Date;
   // geocoding: GeoJSON.FeatureCollection<Point>;
   address: string;
   city: string;
   priority: string;
   siteName: string;
   longitude: number;
   latitude: number;
}

export interface TrackingDetail {
   message: string;
   description: string;
   status: string;
   status_detail: string;
   datetime: string;
   source: string;
   tracking_location: {
      city: string;
      state: string;
      zip: string;
   };
}

export interface Tracker {
   object: "Tracker";
   tracking_code: string;
   carrier: string;
   id: string;
   status: string;
   created_at: string;
   updated_at: string;
   est_delivery_date: null | string;
   tracking_details: TrackingDetail[];
}
