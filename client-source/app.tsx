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
import { sortBy, replace, truncate, filter } from "lodash";
const classNames = require("classnames");
import {
   parseISO,
   subHours,
   subWeeks,
   isAfter,
   format as dateFormat,
   set as dateSet,
} from "date-fns";

interface appProps {}

const App: React.FunctionComponent<appProps> = (props) => {
   const geoCode = async (res: APIResult) => {
      console.log(res);
      const promises: Promise<Response>[] = [];
      const tRes: Ticket[] = [];

      for await (const apiTicket of res.hits.hits) {
         try {
            const geoQuery = replace(
               `${apiTicket._source.siteAddr}, ${apiTicket._source.srmSiteCity}, ${apiTicket._source.srmSiteState}`,
               "#",
               ""
            );
            const response = await fetch(
               `https://api.mapbox.com/geocoding/v5/mapbox.places/${geoQuery}.json?limit=1&access_token=${mapboxToken}`
            );
            const geoPoint: GeoJSON.FeatureCollection<Point> = await response.json();

            // console.log(
            //    apiTicket._source.detailId,
            //    `${apiTicket._source.createDt[0].substr(
            //       0,
            //       10
            //    )}${apiTicket._source.createTm[0].substr(10)}`
            // );

            const providedDate = parseISO(apiTicket._source.createDt[0]);
            const providedTime = parseISO(apiTicket._source.createTm[0]);
            const actualDate = new Date(
               providedDate.getUTCFullYear(),
               providedDate.getUTCMonth(),
               providedDate.getUTCDate(),
               providedTime.getHours(),
               providedTime.getMinutes()
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
               created: actualDate,
            });
         } catch (e) {
            console.log(e);
         }
      }

      //filter out tickets older than 1 week
      const weekAgo = subWeeks(new Date(), 1);
      const filteredTres = filter<Ticket>(tRes, (o) =>
         isAfter(o.created, weekAgo)
      );

      //sort by city name
      const sortedTRes = sortBy<Ticket>(filteredTres, (o) => [o.city]);

      setGeoTickets(sortedTRes);
      console.log(sortedTRes);
   };

   const fetchState = useFetch<APIResult>(apiUrl, apiParameters, {
      json: true,
      defer: false,
      onResolve: geoCode,
   });

   const [viewport, setViewport] = useState({
      latitude: 37.77323,
      longitude: -122.503434,
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
               width={"100%"}
               height={"400px"}
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
                           onClick={() => {
                              setSelectedTicket(h.ticketNumber);
                              setViewport({
                                 ...viewport,
                                 latitude:
                                    h.geocoding.features[0].geometry
                                       .coordinates[1],
                                 longitude:
                                    h.geocoding.features[0].geometry
                                       .coordinates[0],
                              });
                           }}
                        >
                           <td className={"border"}>{h.ticketNumber}</td>
                           <td
                              // display a red shipping cutoff warning if the ticket was created after 3PM
                              // as this delays parts delivery 1 day. use the day the ticket was created, not today's date
                              className={classNames({
                                 border: true,
                                 "text-red-600": isAfter(
                                    h.created,
                                    dateSet(new Date(h.created.getTime()), {
                                       hours: 15,
                                       minutes: 0,
                                       seconds: 0,
                                    })
                                 ),
                              })}
                           >
                              {dateFormat(h.created, "L/d h:mm aa")}
                           </td>
                           <td className={"border"}>{h.priority}</td>
                           <td className={"border"}>
                              <a
                                 target={"_blank"}
                                 className={"underline"}
                                 href={`https://www.google.com/search?q=${encodeURI(
                                    h.siteName
                                 )}`}
                              >
                                 {h.siteName}
                              </a>
                              {" - "}
                              <a
                                 target={"_blank"}
                                 className={"underline"}
                                 href={`https://www.google.com/maps/search/?api=1&query=${encodeURI(
                                    `${h.address},${h.city}`
                                 )}`}
                              >
                                 {h.address}
                              </a>
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
