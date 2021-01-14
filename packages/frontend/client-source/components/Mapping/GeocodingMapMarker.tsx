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
   knownPosition?: Position;
   onResolve: (p: Position) => void;
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
         defer: props.knownPosition !== undefined,
         onResolve: (result) => {
            // setPosition(result.features[0].geometry.coordinates);
            props.onResolve(result.features[0].geometry.coordinates);
         },
      }
   );

   return (
      <>
         {props.knownPosition && (
            <Marker
               captureClick={true}
               latitude={props.knownPosition[1]}
               longitude={props.knownPosition[0]}
            >
               {props.children}
            </Marker>
         )}
      </>
   );
};

export default GeocodingMapMarker;
