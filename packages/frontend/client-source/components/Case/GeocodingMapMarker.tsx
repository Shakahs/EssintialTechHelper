import * as React from "react";
import { Ticket, UngeocodedTicket } from "../../../../../types";
import { replace, sortBy, truncate } from "lodash";
import { Marker } from "react-map-gl";
import { IfFulfilled, useAsync, useFetch } from "react-async";
import { parseJSON } from "date-fns";
import { GeoJSON, Point, Position } from "geojson";
import { mapboxToken } from "../../../../../constants";
import { useState } from "react";
import { CaseBase } from "../../api";

interface GeocodingMapMarkerProps {
   case: CaseBase;
   setSelectedTicket: (ticket: string) => void;
}

const GeocodingMapMarker: React.FunctionComponent<GeocodingMapMarkerProps> = (
   props
) => {
   const [position, setPosition] = useState<Position | null>();

   const geoQuery = props.case?.Location.FullAddress;
   const geoQueryURLSafe = replace(geoQuery, "#", "");
   const geocodingFetchState = useFetch<GeoJSON.FeatureCollection<Point>>(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${geoQueryURLSafe}.json?limit=1&access_token=${mapboxToken}&country=US`,
      {},
      {
         json: true,
         defer: false,
         onResolve: (result) => {
            setPosition(result.features[0].geometry.coordinates);
         },
      }
   );

   return (
      <IfFulfilled state={geocodingFetchState}>
         {position && (
            <Marker
               captureClick={true}
               key={props.case.Id}
               latitude={position[1]}
               longitude={position[0]}
            >
               <div
                  onClick={() => {
                     props.setSelectedTicket(props.case.Id);
                  }}
               >
                  {props.case.Id}
                  <br />
                  {truncate(props.case.Model, { length: 15 })}
               </div>
            </Marker>
         )}
      </IfFulfilled>
   );
};

export default GeocodingMapMarker;
