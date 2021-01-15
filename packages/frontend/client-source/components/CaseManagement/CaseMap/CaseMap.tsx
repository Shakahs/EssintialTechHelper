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
import { allGeocoding } from "../../../features/geocoding/selectors";
import { useSelector } from "react-redux";

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

   //get the Features that correspond to our tickets
   let calculatedCenter: Feature<Point>;
   let features: Feature<Point>[] = [];
   const geocoding = useSelector(allGeocoding);
   props.tickets.forEach((t) => {
      if (geocoding[t.Id]) {
         features.push(geocoding[t.Id].feature);
      }
   });

   //have to use this conditional because the featurecollection can be empty while Redux re-hydrates, cases refresh, and Turf will raise an exception
   const featureColl = featureCollection(features);
   if (featureColl.features.length > 0) {
      calculatedCenter = center(featureColl);
      // console.log(featureColl, calculatedCenter, viewPortChanged);

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
         onViewportChange={(nextViewport, transition) => {
            // console.log(transition);
            if (
               transition.isDragging ||
               transition.isPanning ||
               transition.isZooming ||
               transition.isRotating
            ) {
               setViewportChanged(true);
               setViewport(nextViewport);
            }
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
