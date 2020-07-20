import * as React from "react";
import { useState } from "react";
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
import { APIResult, APITicket, Ticket } from "./types";
import { apiParameters, apiUrl, mapboxToken } from "./constants";
import { sortBy, truncate } from "lodash";
const classNames = require("classnames");
const datefns = require("date-fns");

interface appProps {}

const App: React.FunctionComponent<appProps> = (props) => {
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

            console.log(
               apiTicket._source.detailId,
               `${apiTicket._source.createDt[0].substr(
                  0,
                  10
               )}${apiTicket._source.createTm[0].substr(10)}`
            );

            tRes.push({
               siteName: apiTicket._source.srmSiteName,
               priority: apiTicket._source.srmPrio[0],
               address: apiTicket._source.siteAddr,
               city: apiTicket._source.srmSiteCity,
               geocoding: geoPoint,
               ticketNumber: apiTicket._source.detailId,
               partNumber: apiTicket._source.srmModelNo[0],
               partDescription: apiTicket._source.srmModelDesc[0],
               created: datefns.subHours(
                  datefns.parseISO(
                     `${apiTicket._source.createDt[0].substr(
                        0,
                        10
                     )}${apiTicket._source.createTm[0].substr(10)}`
                  ),
                  1
               ),
            });
         } catch (e) {
            console.log(e);
         }
      }

      const sortedTRes = sortBy<Ticket>(tRes, (o) => [o.city]);

      setGeoTickets(sortedTRes);
      console.log(sortedTRes);
   };

   const fetchState = useFetch<APIResult>(apiUrl, apiParameters, {
      json: true,
      defer: false,
      onResolve: geoCode,
   });

   const [viewport, setViewport] = useState({
      width: 400,
      height: 400,
      latitude: 33.17690582202723,
      longitude: -117.06797950716394,
      zoom: 7.5,
   });

   const [geoTickets, setGeoTickets] = useState<Ticket[]>([]);

   const [selectedTicket, setSelectedTicket] = useState("");

   const sortedApiTickets = sortBy<APITicket>(fetchState.data?.hits.hits, [
      (o) => o._source.srmSiteCity,
   ]);

   return (
      <>
         <IfInitial state={fetchState}>Not running</IfInitial>
         <IfPending state={fetchState}>Fetching data...</IfPending>
         <IfFulfilled state={fetchState}>
            <ReactMapGL
               {...viewport}
               mapboxApiAccessToken={mapboxToken}
               onViewportChange={(nextViewport) => {
                  setViewport(nextViewport);
                  // console.log(nextViewport);
               }}
            >
               {geoTickets.map((gt) => (
                  <Marker
                     captureClick={true}
                     key={gt.ticketNumber}
                     latitude={gt.geocoding.features[0].geometry.coordinates[1]}
                     longitude={
                        gt.geocoding.features[0].geometry.coordinates[0]
                     }
                  >
                     <div
                        onClick={() => {
                           setSelectedTicket(gt.ticketNumber);
                        }}
                     >
                        {gt.ticketNumber}
                        <br />
                        {truncate(gt.partDescription, { length: 15 })}
                     </div>
                  </Marker>
               ))}
            </ReactMapGL>
            <table className="table-auto text-xs">
               <tbody>
                  {geoTickets.map((h) => {
                     return (
                        <tr
                           key={h.ticketNumber}
                           className={classNames({
                              "bg-yellow-500":
                                 selectedTicket === h.ticketNumber,
                           })}
                        >
                           <td className={"border"}>{h.ticketNumber}</td>
                           <td className={"border"}>
                              {datefns.format(h.created, "L/d h:m b")}
                           </td>
                           <td className={"border"}>{h.priority}</td>
                           <td className={"border"}>
                              {h.siteName} {h.address}
                           </td>
                           <td className={"border"}>{h.city}</td>
                           <td className={"border"}>{h.partNumber}</td>
                           <td className={"border"}>{h.partDescription}</td>
                        </tr>
                     );
                  })}
               </tbody>
            </table>
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
