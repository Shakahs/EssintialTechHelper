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
import { Ticket } from "../../../../types";
import { mapboxToken } from "../../../../constants";
import { sortBy, truncate } from "lodash";
import {
   format as dateFormat,
   isAfter,
   parseJSON,
   set as dateSet,
} from "date-fns";

const classNames = require("classnames");

interface appProps {}

const Available: React.FunctionComponent<appProps> = (props) => {
   const fetchState = useFetch<Ticket[]>(
      "/api/available",
      {},
      {
         json: true,
         defer: false,
         onResolve: (result: Ticket[]) => {
            const dateDecoded = result.map((undecoded) => ({
               ...undecoded,
               created: parseJSON(undecoded.created),
            }));
            const sortedApiTickets = sortBy<Ticket>(dateDecoded, [
               (o) => o.city,
            ]);
            setTickets(sortedApiTickets);
         },
      }
   );

   const [viewport, setViewport] = useState({
      latitude: 37.77323,
      longitude: -122.503434,
      zoom: 7.5,
   });

   const [tickets, setTickets] = useState<Ticket[]>([]);

   const [selectedTicket, setSelectedTicket] = useState("");

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
               {tickets.map((ticket) => (
                  <Marker
                     captureClick={true}
                     key={ticket.ticketNumber}
                     latitude={ticket.latitude}
                     longitude={ticket.longitude}
                  >
                     <div
                        onClick={() => {
                           setSelectedTicket(ticket.ticketNumber);
                        }}
                     >
                        {ticket.ticketNumber}
                        <br />
                        {truncate(ticket.partDescription, { length: 15 })}
                     </div>
                  </Marker>
               ))}
            </ReactMapGL>
            <table className="table-auto text-xs">
               <tbody>
                  {tickets.map((ticket) => {
                     return (
                        <tr
                           key={ticket.ticketNumber}
                           className={classNames({
                              "bg-yellow-500":
                                 selectedTicket === ticket.ticketNumber,
                           })}
                           onClick={() => {
                              setSelectedTicket(ticket.ticketNumber);
                              setViewport({
                                 ...viewport,
                                 latitude: ticket.latitude,
                                 longitude: ticket.longitude,
                              });
                           }}
                        >
                           <td className={"border"}>{ticket.ticketNumber}</td>
                           <td
                              // display a red shipping cutoff warning if the ticket was created after 3PM
                              // as this delays parts delivery 1 day. use the day the ticket was created, not today's date
                              className={classNames({
                                 border: true,
                                 "text-red-600": isAfter(
                                    ticket.created,
                                    dateSet(
                                       new Date(ticket.created.getTime()),
                                       {
                                          hours: 15,
                                          minutes: 0,
                                          seconds: 0,
                                       }
                                    )
                                 ),
                              })}
                           >
                              {dateFormat(ticket.created, "L/d h:mm aa")}
                           </td>
                           <td className={"border"}>{ticket.priority}</td>
                           <td className={"border"}>
                              <a
                                 target={"_blank"}
                                 className={"underline"}
                                 href={`https://www.google.com/search?q=${encodeURI(
                                    ticket.siteName
                                 )}`}
                              >
                                 {ticket.siteName}
                              </a>
                              {" - "}
                              <a
                                 target={"_blank"}
                                 className={"underline"}
                                 href={`https://www.google.com/maps/search/?api=1&query=${encodeURI(
                                    `${ticket.address},${ticket.city}`
                                 )}`}
                              >
                                 {ticket.address}
                              </a>
                           </td>
                           <td className={"border"}>{ticket.city}</td>
                           <td className={"border"}>{ticket.partNumber}</td>
                           <td className={"border"}>
                              {ticket.partDescription}
                           </td>
                        </tr>
                     );
                  })}
               </tbody>
            </table>
         </IfFulfilled>
         <IfRejected state={fetchState}>Fetch failed!</IfRejected>
      </>
   );
};

export default Available;
