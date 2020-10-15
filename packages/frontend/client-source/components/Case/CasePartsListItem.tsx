import * as React from "react";
import { useFetch } from "react-async";
import { PartsShipment, ResultsObject } from "../../api";
import { apiBase } from "../../constants";
import { useState } from "react";
import { Tracker, TrackingDetail } from "../../../../../types";
import { parseJSON, format } from "date-fns";
import Bool from "../utility/Bool";
import LoadingIcon from "../LoadingIcon";
import { last } from "lodash";

interface CaseSummaryPartsListItemProps {
   trackingNumber: string;
}

const CasePartsListItem: React.FunctionComponent<CaseSummaryPartsListItemProps> = (
   props
) => {
   const [tracking, setTrackingInfo] = useState<null | Tracker>(null);

   const trackingFetchState = useFetch<Tracker>(
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
      tracking?.status !== "delivered" && tracking?.est_delivery_date;

   const lastUpdated = !!tracking?.updated_at
      ? format(parseJSON(tracking.updated_at), "L/d h:mm b")
      : "";

   return (
      <div>
         {/*<span className={"mr-1"}>*/}
         {/*   Status:*/}
         {/*   <Bool if={trackingFetchState.isLoading}>*/}
         {/*      <LoadingIcon />*/}
         {/*   </Bool>*/}
         {/*   {tracking?.status ?? "Unknown, try again later"}*/}
         {/*</span>*/}

         {/*{showDeliveryETA && (*/}
         {/*   <span>*/}
         {/*      Estimated Delivery:*/}
         {/*      {format(parseJSON(tracking.est_delivery_date), "L/d h:mm b")}*/}
         {/*      Last Updated:*/}
         {/*      {lastUpdated}*/}
         {/*   </span>*/}
         {/*)}*/}

         <Bool if={trackingFetchState.isLoading}>
            <LoadingIcon /> Fetching part status...
         </Bool>

         <Bool
            if={
               tracking?.status !== "delivered" && !trackingFetchState.isLoading
            }
         >
            <span className={"mr-1"}>
               {tracking?.status ?? "Status unknown, try again later"}
            </span>
            <span>
               Estimated delivery:
               {tracking?.est_delivery_date &&
                  format(parseJSON(tracking.est_delivery_date), "L/d h:mm b")}
            </span>
            <Bool if={!!tracking?.status}>
               <br />
               <span>
                  Tracking Updated:
                  {lastUpdated}
               </span>
            </Bool>
         </Bool>

         <Bool if={tracking?.status === "delivered"}>
            <span>
               Delivered:
               <span className={"ml-1"}>
                  {tracking?.tracking_details &&
                     format(
                        parseJSON(last(tracking.tracking_details).datetime),
                        "L/d h:mm b"
                     )}
               </span>
            </span>
         </Bool>
      </div>
   );
};

export default CasePartsListItem;
