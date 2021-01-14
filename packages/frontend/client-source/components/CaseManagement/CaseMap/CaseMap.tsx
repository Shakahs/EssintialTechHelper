import * as React from "react";
import { mapboxToken } from "../../../../../../constants";
import ReactMapGL from "react-map-gl";
import { useState } from "react";
import { Ticket } from "../../../../../../types";
import CaseMapMarker from "./CaseMapMarker";
import { debounce, groupBy, map, isEqual } from "lodash";
import { CaseBase } from "../../../features/cases/types";
import center from "@turf/center";
import { featureCollection } from "@turf/helpers";
import { Feature, Point } from "geojson";

interface CaseMapProps {
   tickets: CaseBase[];
}

const CaseMap: React.FunctionComponent<CaseMapProps> = (props) => {
   const [viewport, setViewport] = useState({
      latitude: 39.8333333,
      longitude: -98.585522,
      zoom: 3,
   });
   const [viewPortChanged, setViewportChanged] = useState(false);

   //this needs to be debounced or React will raise an error due to excessive re-renders
   const debouncedSetViewport = debounce(setViewport, 500, {
      leading: false,
      trailing: true,
   });

   let calculatedCenter: Feature<Point>;
   //pull out the Features, filtering because grouped cases at the same address don't all get geocoded
   const features = map(props.tickets, (t) => t.geoCoding).filter(
      (f) => f !== undefined
   );
   const featureColl = featureCollection(features);

   //have to use this conditional because the featurecollection can be empty while Redux re-hydrates, cases refresh, and Turf will raise an exception
   if (featureColl.features.length > 0) {
      calculatedCenter = center(featureColl);

      //if the user changes the viewport we don't want to change it back
      if (!viewPortChanged) {
         debouncedSetViewport({
            longitude: calculatedCenter.geometry.coordinates[0],
            latitude: calculatedCenter.geometry.coordinates[1],
            zoom: 7,
         });
      }
   }

   const groupedCases = groupBy(props.tickets, "Location.FullAddress");

   return (
      <ReactMapGL
         {...viewport}
         width={"100%"}
         height={"400px"}
         mapboxApiAccessToken={mapboxToken}
         onViewportChange={(nextViewport) => {
            setViewportChanged(true);
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
