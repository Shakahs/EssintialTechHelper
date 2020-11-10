import * as React from "react";
import { useFetch } from "react-async";
import { apiBase, buttonStyle } from "../../../../constants";
import { useEffect, useState } from "react";
import { Tracker, TrackingDetail } from "../../../../../../../types";
import { parseJSON, format } from "date-fns";
import Bool from "../../../utility/Bool";
import LoadingIcon from "../../../LoadingIcon";
import { last } from "lodash";
import BoolFunc from "../../../utility/BoolFunc";

interface CaseSummaryPartsListItemProps {
   trackingNumber: string;
}

const CasePartsListTracking: React.FunctionComponent<CaseSummaryPartsListItemProps> = (
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
         defer: true,
         onResolve: (res) => {
            setTrackingInfo(res);
         },
      }
   );

   useEffect(trackingFetchState.run, []);

   const lastTracking =
      tracking?.tracking_details && last(tracking.tracking_details);

   const lastUpdated = !!tracking?.updated_at
      ? format(parseJSON(tracking.updated_at), "L/d h:mm b")
      : "";

   return (
      <>
         <div className={"flex flex-row space-x-1"}>
            <div>
               <a
                  className={"text-blue-500 underline ml-1"}
                  href={`https://www.fedex.com/apps/fedextrack/?tracknum=${props.trackingNumber}`}
               >
                  {props.trackingNumber}
               </a>
            </div>
            <div>
               <Bool if={trackingFetchState.isLoading}>
                  <LoadingIcon /> Fetching tracking status...
               </Bool>
               <Bool
                  if={
                     trackingFetchState.isRejected ||
                     tracking?.status === "unknown"
                  }
               >
                  Status unknown, try again later
               </Bool>
               <Bool
                  if={
                     trackingFetchState.isFulfilled &&
                     tracking?.status !== "delivered"
                  }
               >
                  {`${tracking?.status} estimated: ${
                     tracking?.est_delivery_date &&
                     format(parseJSON(tracking.est_delivery_date), "L/d h:mm b")
                  }`}
               </Bool>

               <BoolFunc
                  if={
                     trackingFetchState.isFulfilled &&
                     tracking?.status === "delivered"
                  }
               >
                  {() =>
                     `delivered ${
                        tracking?.tracking_details &&
                        format(
                           parseJSON(last(tracking.tracking_details).datetime),
                           "L/d h:mm b"
                        )
                     }`
                  }
               </BoolFunc>
            </div>
         </div>
         {/*<div>*/}
         {/*   <span>*/}
         {/*      Tracking:*/}
         {/*      <a*/}
         {/*         className={"text-blue-500 underline ml-1"}*/}
         {/*         href={`https://www.fedex.com/apps/fedextrack/?tracknum=${props.trackingNumber}`}*/}
         {/*      >*/}
         {/*         {props.trackingNumber}*/}
         {/*      </a>*/}
         {/*   </span>*/}
         {/*   <br />*/}

         {/*   <Bool if={trackingFetchState.isLoading}>*/}
         {/*      <LoadingIcon /> Fetching tracking status...*/}
         {/*   </Bool>*/}

         {/*   <Bool if={trackingFetchState.isRejected}>*/}
         {/*      <span>*/}
         {/*         {tracking?.status ?? "Status unknown, try again later"}*/}
         {/*      </span>*/}
         {/*   </Bool>*/}

         {/*   <Bool*/}
         {/*      if={*/}
         {/*         trackingFetchState.isFulfilled &&*/}
         {/*         tracking?.status !== "delivered"*/}
         {/*      }*/}
         {/*   >*/}
         {/*      <span>*/}
         {/*         Estimated delivery:*/}
         {/*         {tracking?.est_delivery_date &&*/}
         {/*            format(*/}
         {/*               parseJSON(tracking.est_delivery_date),*/}
         {/*               "L/d h:mm b"*/}
         {/*            )}*/}
         {/*      </span>*/}
         {/*      <br />*/}
         {/*      <span>*/}
         {/*         Last location:*/}
         {/*         {lastTracking?.tracking_location?.city}{" "}*/}
         {/*         {lastTracking?.tracking_location?.state}*/}
         {/*         {lastTracking?.datetime &&*/}
         {/*            format(parseJSON(lastTracking?.datetime), "L/d h:mm b")}*/}
         {/*      </span>*/}
         {/*      <br />*/}
         {/*      <span>*/}
         {/*         Tracking Updated:*/}
         {/*         {lastUpdated}*/}
         {/*      </span>*/}
         {/*   </Bool>*/}

         {/*   <Bool if={tracking?.status === "delivered"}>*/}
         {/*      <span>*/}
         {/*         Delivered:*/}
         {/*         <span className={"ml-1"}>*/}
         {/*            {tracking?.tracking_details &&*/}
         {/*               format(*/}
         {/*                  parseJSON(last(tracking.tracking_details).datetime),*/}
         {/*                  "L/d h:mm b"*/}
         {/*               )}*/}
         {/*         </span>*/}
         {/*      </span>*/}
         {/*   </Bool>*/}
         {/*</div>*/}
      </>
   );
};

export default CasePartsListTracking;
