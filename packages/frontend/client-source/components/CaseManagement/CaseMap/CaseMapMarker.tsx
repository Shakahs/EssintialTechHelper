import * as React from "react";
import { replace, truncate } from "lodash";
import GeocodingMapMarker from "../../Mapping/GeocodingMapMarker";
import { CaseBase } from "../../../api";
import Pin from "../../../assets/map-pin.svg";
import parseISO from "date-fns/parseISO";
import dateFormat from "date-fns/format";

interface CaseMapMarkerProps {
   case: CaseBase;
   setSelectedTicket: (ticket: string) => void;
}

const CaseMapMarker: React.FunctionComponent<CaseMapMarkerProps> = (props) => {
   const geoQuery = props.case.Location.FullAddress;
   const parsedETA = parseISO(props.case.ScheduledDateTime);

   return (
      <GeocodingMapMarker query={geoQuery}>
         <div
            onClick={() => {
               props.setSelectedTicket(props.case.Id);
            }}
         >
            <div>
               <img src={Pin} className={"inline"} />
               <div className={"bg-gray-300 p-1 inline text-sm"}>
                  {props.case.Id}
                  <br />
                  ETA: {dateFormat(parsedETA, "L/d h:mm b")}
               </div>
            </div>
         </div>
      </GeocodingMapMarker>
   );
};

export default CaseMapMarker;
