interface Ticket {
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

interface APIResult {
   hits: {
      hits: Ticket[];
      total: number;
   };
}
