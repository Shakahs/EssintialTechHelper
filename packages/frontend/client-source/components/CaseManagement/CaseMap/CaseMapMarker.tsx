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
import { useState } from "react";
import Bool from "../../utility/Bool";

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

   const [showPopup, setShowPopup] = useState(false);

   return (
      <GeocodingMapMarker query={geoQuery}>
         <div
            onClick={() => {
               props.setSelectedTicket(props.case.Id);
            }}
         >
            <div className={"flex"}>
               <div>
                  <img src={Pin} onClick={() => setShowPopup(!showPopup)} />
               </div>
               <Bool if={showPopup}>
                  <div
                     className={
                        "bg-gray-300 p-1  text-sm bg-opacity-75 border border-black rounded-sm  "
                     }
                  >
                     <div>{props.case.Id}</div>
                     <div>
                        {partsList?.[props.case.Model]?.description ??
                           props.case.Model}
                     </div>
                     {sla && (
                        <div>
                           <span className={"mr-1"}>
                              SLA: {slaCodes?.[sla.Code] ?? sla.Code}
                           </span>
                           {dateFormat(
                              parseSLA_Date(sla.CalculatedDateTime),
                              standardDateTimeFormatting
                           )}
                        </div>
                     )}
                  </div>
               </Bool>
            </div>
         </div>
      </GeocodingMapMarker>
   );
};

export default CaseMapMarker;
