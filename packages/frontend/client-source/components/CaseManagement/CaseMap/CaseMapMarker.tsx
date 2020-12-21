import * as React from "react";
import { replace, truncate } from "lodash";
import GeocodingMapMarker from "../../Mapping/GeocodingMapMarker";
import Pin from "../../../assets/map-pin.svg";
import parseISO from "date-fns/parseISO";
import dateFormat from "date-fns/format";
import { useState } from "react";
import Bool from "../../utility/Bool";
import { isMobile } from "react-device-detect";
import { CaseBase } from "../../../features/cases/types";
import { parseCaseSLA } from "../../../features/cases/utility";
import { standardDateTimeFormatting } from "../../../constants";
import { PartsList } from "../../../features/parts/partsList";

interface CaseMapMarkerProps {
   cases: CaseBase[];
   setSelectedTicket: (ticket: string) => void;
}

const CaseMapMarker: React.FunctionComponent<CaseMapMarkerProps> = (props) => {
   const geoQuery = props.cases[0].Location.FullAddress;
   const slaCodes = {
      ARR: "Arrive",
      FIX: "Fix",
   };

   const [showPopup, setShowPopup] = useState(false);
   const [hover, setHover] = useState(false);

   const partsDB = new PartsList();

   return (
      <GeocodingMapMarker query={geoQuery}>
         <div
         // onClick={() => {
         //    props.setSelectedTicket(props.case.Id);
         // }}
         >
            <div className={"flex"}>
               <div>
                  <img
                     src={Pin}
                     onClick={() => setShowPopup(!showPopup)}
                     onMouseOver={() => setHover(true)}
                     onMouseOut={() => setHover(false)}
                  />
               </div>
               <Bool
                  if={
                     showPopup || (!isMobile && hover)
                  } /*disable hover on mobile*/
               >
                  <div
                     className={
                        "bg-gray-300 p-1  text-sm bg-opacity-75 border border-black rounded-sm divide-y divide-black"
                     }
                  >
                     {props.cases.map((c) => {
                        const sla = c.Milestones[0];
                        return (
                           <div className={""}>
                              <div>{`${c.Id} ${c.Location.City}`}</div>
                              <div>{partsDB.lookupPart(c.Model)}</div>
                              {sla && (
                                 <div>
                                    <span className={"mr-1"}>
                                       SLA: {slaCodes?.[sla.Code] ?? sla.Code}
                                    </span>
                                    {dateFormat(
                                       parseCaseSLA(sla.CalculatedDateTime),
                                       standardDateTimeFormatting
                                    )}
                                 </div>
                              )}
                           </div>
                        );
                     })}
                  </div>
               </Bool>
            </div>
         </div>
      </GeocodingMapMarker>
   );
};

export default CaseMapMarker;
