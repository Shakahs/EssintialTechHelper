import * as React from "react";
import { Ticket, UngeocodedTicket } from "../../../../../types";
import { replace, sortBy, truncate } from "lodash";
import { Marker } from "react-map-gl";
import { IfFulfilled, useAsync, useFetch } from "react-async";
import { parseJSON } from "date-fns";
import { GeoJSON, Point, Position } from "geojson";
import { mapboxToken } from "../../../../../constants";
import { useState } from "react";
import { CaseBase } from "../../features/cases/types";

interface GeocodingMapMarkerProps {
   query: string;
   children: React.ReactElement;
}

const GeocodingMapMarker: React.FunctionComponent<GeocodingMapMarkerProps> = (
   props
) => {
   const [position, setPosition] = useState<Position | null>();

   const geoQueryURLSafe = replace(props.query, "#", "");
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
               latitude={position[1]}
               longitude={position[0]}
            >
               {props.children}
            </Marker>
         )}
      </IfFulfilled>
   );
};

export default GeocodingMapMarker;
