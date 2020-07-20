import * as React from "react";
import { useState, useEffect } from "react";
import {
   IfFulfilled,
   IfInitial,
   IfPending,
   IfRejected,
   useFetch,
} from "react-async";
import ReactMapGL, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { GeoJSON, Point } from "geojson";
import { APIResult, Ticket } from "./types";

const mapboxToken =
   "pk.eyJ1Ijoic2hha2FocyIsImEiOiJja2N0d2hkZG4yMmtqMnlsYnlldXc4Y29hIn0.4z1YQzLrDQDQ0dM3A-bzGw";

interface appProps {}

const App: React.FunctionComponent<appProps> = (props) => {
   const [geoTickets, setGeoTickets] = useState<Ticket[]>([]);

   const geoCode = async (res: APIResult) => {
      console.log(res);
      const promises: Promise<Response>[] = [];
      const tRes: Ticket[] = [];

      for await (const apiTicket of res.hits.hits) {
         try {
            const geoQuery = `${apiTicket._source.siteAddr}, ${apiTicket._source.srmSiteCity}, ${apiTicket._source.srmSiteState}`;
            const response = await fetch(
               `https://api.mapbox.com/geocoding/v5/mapbox.places/${geoQuery}.json?limit=1&access_token=${mapboxToken}`
            );
            const geoPoint: GeoJSON.FeatureCollection<Point> = await response.json();
            tRes.push({
               location: geoPoint,
               ticketNumber: apiTicket._source.detailId,
               partNumber: apiTicket._source.srmModelNo[0],
               partDescription: apiTicket._source.srmModelDesc[0],
            });
         } catch (e) {}
      }

      setGeoTickets(tRes);
      console.log(tRes);
   };

   const fetchState = useFetch<APIResult>(
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
      },
      { json: true, defer: false, onResolve: geoCode }
   );

   const [viewport, setViewport] = useState({
      width: 400,
      height: 400,
      latitude: 33.17690582202723,
      longitude: -117.06797950716394,
      zoom: 7.5,
   });

   return (
      <>
         <h3>Essintial Ticket Helper</h3>
         <IfInitial state={fetchState}>Not running</IfInitial>
         <IfPending state={fetchState}>Fetching data...</IfPending>
         <IfFulfilled state={fetchState}>
            {fetchState.data?.hits.hits.map((h) => {
               return (
                  <p key={h._id}>
                     {h._source.detailId} {h._source.srmModelDesc}
                  </p>
               );
            })}
            <ReactMapGL
               {...viewport}
               mapboxApiAccessToken={mapboxToken}
               onViewportChange={(nextViewport) => {
                  setViewport(nextViewport);
                  console.log(nextViewport);
               }}
            >
               {geoTickets.map((gt) => (
                  <Marker
                     key={gt.ticketNumber}
                     latitude={gt.location.features[0].geometry.coordinates[1]}
                     longitude={gt.location.features[0].geometry.coordinates[0]}
                  >
                     {gt.ticketNumber}
                  </Marker>
               ))}
            </ReactMapGL>
         </IfFulfilled>
         <IfRejected state={fetchState}>
            Fetch failed!:
            <br />
            {fetchState.error}
         </IfRejected>
      </>
   );
};

export default App;
