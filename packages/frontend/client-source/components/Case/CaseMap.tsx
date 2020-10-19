import * as React from "react";
import { mapboxToken } from "../../../../../constants";
import ReactMapGL from "react-map-gl";
import { useState } from "react";
import { Ticket } from "../../../../../types";
import GeocodingMapMarker from "../Mapping/GeocodingMapMarker";
import { CaseBase } from "../../api";
import CaseMapMarker from "./CaseMapMarker";

interface CaseMapProps {
   tickets: CaseBase[];
}

const CaseMap: React.FunctionComponent<CaseMapProps> = (props) => {
   const [viewport, setViewport] = useState({
      latitude: 37.77323,
      longitude: -122.503434,
      zoom: 7.5,
   });

   return (
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
         {props.tickets.map((c) => (
            <CaseMapMarker
               case={c}
               setSelectedTicket={(id) => console.log(id)}
            />
         ))}
      </ReactMapGL>
   );
};

export default CaseMap;
