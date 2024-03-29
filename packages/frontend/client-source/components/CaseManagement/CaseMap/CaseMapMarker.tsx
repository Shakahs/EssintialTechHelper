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
import { partsList } from "../../../features/parts/partsList";
import { useDispatch, useSelector } from "react-redux";
import { upsertCaseSummary } from "../../../features/cases/caseSlice";
import { upsertGeocoding } from "../../../features/geocoding/slice";
import { allGeocoding } from "../../../features/geocoding/selectors";

interface CaseMapMarkerProps {
   cases: CaseBase[];
   setSelectedTicket: (ticket: string) => void;
}

const CaseMapMarker: React.FunctionComponent<CaseMapMarkerProps> = (props) => {
   const dispatch = useDispatch();
   const geocoding = useSelector(allGeocoding);

   const firstCaseInGroupedCases = props.cases[0];

   const geoQuery = firstCaseInGroupedCases.Location.FullAddress;
   const slaCodes = {
      ARR: "Arrive",
      FIX: "Fix",
   };

   const [showPopup, setShowPopup] = useState(false);
   const [hover, setHover] = useState(false);

   return (
      <GeocodingMapMarker
         query={geoQuery}
         knownPosition={geocoding[firstCaseInGroupedCases.Id]?.feature}
         onResolve={(p) => {
            // dispatch(
            //    upsertCaseSummary({ ...firstCaseInGroupedCases, geoCoding: p })
            // );
            dispatch(
               upsertGeocoding({ id: firstCaseInGroupedCases.Id, feature: p })
            );
         }}
      >
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
                           <div className={""} key={c.Id}>
                              <div>{`${c.Id} ${c.Location.City}`}</div>
                              <div>{partsList.lookupPart(c.Model)}</div>
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
