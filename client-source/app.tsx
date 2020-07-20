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
         <h3 className={"mx-auto"}>Essintial Ticket Helper</h3>
         <IfInitial state={fetchState}>Not running</IfInitial>
         <IfPending state={fetchState}>Fetching data...</IfPending>
         <IfFulfilled state={fetchState}>
            <table className="table-auto text-sm">
               <tbody>
                  {sortedApiTickets.map((h) => {
                     return (
                        <tr
                           key={h._id}
                           className={classNames({
                              "bg-yellow-500":
                                 selectedTicket === h._source.detailId,
                           })}
                        >
                           <td className={"border"}>{h._source.detailId}</td>
                           <td className={"border"}>{h._source.siteAddr}</td>
                           <td className={"border"}>{h._source.srmSiteCity}</td>
                           <td className={"border"}>
                              {h._source.srmModelDesc}
                           </td>
                        </tr>
                     );
                  })}
               </tbody>
            </table>
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
                     latitude={gt.location.features[0].geometry.coordinates[1]}
                     longitude={gt.location.features[0].geometry.coordinates[0]}
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
