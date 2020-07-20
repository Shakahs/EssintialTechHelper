const getData = async (): Promise<APIResult> => {
   const result = await fetch(
      "https://reporting.serviceevent.com:446/api/datasets/b353a43e-819d-4d4f-9c28-cc7bc3a48a67/_search?report=702f5b27-d201-49d3-bd81-f8409ea192a9",
      {
         headers: {
            accept: "application/hal+json",
            "accept-language": "en-US,en;q=0.9",
            authorization:
               "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOjIzOSwiaWF0IjoxNTc5ODExNjk4LjU2Nn0.a1WmPzVYzXY5w_58sVlYX5McxxzZgzIKnfGtHbS_iew",
            "content-type": "application/json;charset=UTF-8",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-requested-with": "XMLHttpRequest",
            cookie:
               "token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOjIzOSwiaWF0IjoxNTc5ODExNjk4LjU2Nn0.a1WmPzVYzXY5w_58sVlYX5McxxzZgzIKnfGtHbS_iew",
         },
         referrer:
            "https://reporting.serviceevent.com:446/v/report.html?id=792&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOjIzOSwiaWF0IjoxNTc5ODExNjk4LjU2Nn0.a1WmPzVYzXY5w_58sVlYX5McxxzZgzIKnfGtHbS_iew",
         referrerPolicy: "no-referrer-when-downgrade",
         body:
            '{"_source":["detailId","siteAddr","srmSiteCity","srmSiteState","createDt","createTm","srmPrio","srmSiteName","srmModelNo","srmModelDesc","__doc_count__"],"from":0,"size":50000,"sort":[],"query":{"term":{"srmSiteState":"CA"}}}',
         method: "POST",
         mode: "cors",
      }
   );

   if (result.ok) {
      return result.json();
   } else throw new Error("could not get data");
};

export default getData;
