import * as React from "react";
import { replace, truncate } from "lodash";
import GeocodingMapMarker from "../../Mapping/GeocodingMapMarker";
import {
   CaseBase,
   parseSLA_Date,
   standardDateTimeFormatting,
} from "../../../api";
import Pin from "../../../assets/map-pin.svg";
import parseISO from "date-fns/parseISO";
import dateFormat from "date-fns/format";
import partsList from "../../../assets/riteAidPartList.json";

interface CaseMapMarkerProps {
   case: CaseBase;
   setSelectedTicket: (ticket: string) => void;
}

const CaseMapMarker: React.FunctionComponent<CaseMapMarkerProps> = (props) => {
   const geoQuery = props.case.Location.FullAddress;
   const sla = props.case.Milestones[0];
   const slaCodes = {
      ARR: "Arrive",
      FIX: "Fix",
   };
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
                  <span>
                     {partsList?.[props.case.Model]?.description ??
                        props.case.Model}
                  </span>
                  <br />
                  <span className={"mr-1"}>
                     SLA: {slaCodes?.[sla.Code] ?? sla.Code}
                  </span>
                  {dateFormat(
                     parseSLA_Date(sla.CalculatedDateTime),
                     standardDateTimeFormatting
                  )}
               </div>
            </div>
         </div>
      </GeocodingMapMarker>
   );
};

export default CaseMapMarker;
