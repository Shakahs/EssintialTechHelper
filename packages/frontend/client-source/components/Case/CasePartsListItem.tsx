import * as React from "react";
import { useFetch } from "react-async";
import { PartsShipment, ResultsObject } from "../../api";
import { apiBase } from "../../constants";
import { useState } from "react";
import { Tracker, TrackingDetail } from "../../../../../types";
import { parseJSON, format } from "date-fns";
import Bool from "../utility/Bool";
import LoadingIcon from "../LoadingIcon";

interface CaseSummaryPartsListItemProps {
   trackingNumber: string;
}

const CasePartsListItem: React.FunctionComponent<CaseSummaryPartsListItemProps> = (
   props
) => {
   const [trackingInfo, setTrackingInfo] = useState<null | Tracker>(null);

   const partsShippedFetchState = useFetch<Tracker>(
      `/api/tracking?trackingNumber=${props.trackingNumber}`,
      {
         method: "GET",
      },

      {
         json: true,
         onResolve: (res) => {
            setTrackingInfo(res);
         },
      }
   );

   const showDeliveryETA =
      trackingInfo?.status !== "delivered" && trackingInfo?.est_delivery_date;

   return (
      <div>
         <span className={"mr-1"}>
            Status:
            <Bool if={partsShippedFetchState.isLoading}>
               <LoadingIcon />
            </Bool>
            {trackingInfo?.status ?? "Unknown, try again later"}
         </span>

         {showDeliveryETA && (
            <span>
               Estimated Delivery:
               {format(parseJSON(trackingInfo.est_delivery_date), "L/d h:mm b")}
            </span>
         )}
      </div>
   );
};

export default CasePartsListItem;
