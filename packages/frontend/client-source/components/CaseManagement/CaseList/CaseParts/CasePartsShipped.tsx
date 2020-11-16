import * as React from "react";
import {
   buildRequestHeaders,
   CaseSummary,
   decodeCaseNumber,
   ResultsObject,
   ShippedParts,
} from "../../../../api";
import { apiBase } from "../../../../constants";
import { useFetch } from "react-async";
import { useEffect, useState } from "react";
import { getAPISessionInComponent } from "../../../utility";
import CasePartsListTracking from "./CasePartsListTracking";

interface CasePartsShippedProps {
   subcase: CaseSummary;
}

const CasePartsShipped: React.FunctionComponent<CasePartsShippedProps> = (
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
      const thisAPISession = await getAPISessionInComponent();
      shippedPartsFetchState.run({
         headers: buildRequestHeaders(thisAPISession),
      });
   };

   useEffect(() => {
      runFetchParts();
   }, []);

   return (
      <div
         className={
            "border border-solid border-1 border-black divide-y divide-black p-3"
         }
      >
         <div>{`Parts Shipments: ${shippedParts.length}`}</div>
         {shippedParts.map((sp) => (
            <div className={"flex flex-col space-x-1 "}>
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
                              <CasePartsListTracking trackingNumber={eachtr} />
                           </div>
                        ))}
                     </div>
                  </div>
               ))}
            </div>
         ))}
      </div>
   );
};

export default CasePartsShipped;
