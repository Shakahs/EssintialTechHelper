import * as React from "react";
import {
   apiBase,
   buildRequestHeaders,
   ResultsObject,
} from "../../../../features/api";
import { useFetch } from "react-async";
import { useEffect, useState } from "react";
import { getAPISessionInComponent } from "../../../utility";
import PartTracking from "./PartTracking";
import Bool from "../../../utility/Bool";
import LoadingIcon from "../../../LoadingIcon";
import PartsListTemplate from "./PartsListTemplate";
import { CaseSummary } from "../../../../features/cases/types";
import { ShippedParts } from "../../../../features/parts/types";
import { decodeCaseNumber } from "../../../../features/cases/utility";

interface CasePartsShippedProps {
   subcase: CaseSummary;
}

const ShippedParts: React.FunctionComponent<CasePartsShippedProps> = (
   props
) => {
   const decodedCaseNumber = decodeCaseNumber(props.subcase.Id);

   const [shippedParts, setShippedParts] = useState<ShippedParts[]>([]);
   const shippedPartsFetchState = useFetch<ResultsObject<ShippedParts[]>>(
      `${apiBase}/parts/shipped/${decodedCaseNumber.masterCase}`,
      {
         method: "GET",
      },

      {
         json: true,
         defer: true,
         onResolve: (res) => {
            setShippedParts(res.Results[0]);
         },
      }
   );

   const runFetchParts = async () => {
      try {
         const thisAPISession = await getAPISessionInComponent();
         shippedPartsFetchState.run({
            headers: buildRequestHeaders(thisAPISession),
         });
      } catch {}
   };

   useEffect(() => {
      runFetchParts();
   }, []);

   return (
      <PartsListTemplate
         title={`Parts Shipments`}
         loading={shippedPartsFetchState.isPending}
         length={shippedParts.length}
      >
         <>
            {shippedParts.map((sp) => (
               <div
                  key={sp.DetailSequence}
                  className={"flex flex-col space-x-1 "}
               >
                  <div className={"flex flex-row space-x-1"}>
                     <div>{`Logistics Number: ${sp.DetailSequence}`}</div>
                     <div>{`Shipped Quantity: ${sp.PartShippedQty}`}</div>
                  </div>
                  <div>{`${sp.PartNo}: ${sp.PartDescription}`}</div>
                  {sp.PartShipped.map((speach) => (
                     <div className={"flex flex-row justify-around"}>
                        <div className={"flex flex-col"}>
                           <div>Serial Numbers:</div>
                           {speach.SerialNumbers.map((eachsn) => (
                              <div key={eachsn}>{eachsn}</div>
                           ))}
                        </div>
                        <div className={"flex flex-col"}>
                           <div>Tracking Numbers:</div>
                           {speach.TrackingNumbers.map((eachtr) => (
                              <div key={eachtr}>
                                 <PartTracking trackingNumber={eachtr} />
                              </div>
                           ))}
                        </div>
                     </div>
                  ))}
               </div>
            ))}
         </>
      </PartsListTemplate>
   );
};

export default ShippedParts;
