import * as React from "react";
import { mapboxToken } from "../../../../../../constants";
import ReactMapGL from "react-map-gl";
import { useState } from "react";
import { Ticket } from "../../../../../../types";
import GeocodingMapMarker from "../../Mapping/GeocodingMapMarker";
import { CaseBase } from "../../../api";
import CaseMapMarker from "./CaseMapMarker";
import { groupBy, map } from "lodash";

interface CaseMapProps {
   tickets: CaseBase[];
}

const CaseMap: React.FunctionComponent<CaseMapProps> = (props) => {
   const [viewport, setViewport] = useState({
      latitude: 37.77323,
      longitude: -122.503434,
      zoom: 7.5,
   });

   const groupedCases = groupBy(props.tickets, "Location.FullAddress");

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
         {map(groupedCases, (c) => (
            <CaseMapMarker
               key={c[0].Id}
               cases={c}
               setSelectedTicket={(id) => console.log(id)}
            />
         ))}
      </ReactMapGL>
   );
};

export default CaseMap;
