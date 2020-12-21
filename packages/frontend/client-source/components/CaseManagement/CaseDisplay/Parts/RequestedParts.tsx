import * as React from "react";
import { useEffect, useState } from "react";
import {
   apiBase,
   buildRequestHeaders,
   ResultsObject,
} from "../../../../features/api";
import { useFetch } from "react-async";
import { getAPISessionInComponent } from "../../../utility";
import PartsListTemplate from "./PartsListTemplate";
import { CaseSummary } from "../../../../features/cases/types";
import { RequestedParts } from "../../../../features/parts/types";
import { decodeCaseNumber } from "../../../../features/cases/utility";

interface CasePartsRequestedProps {
   subcase: CaseSummary;
}

const RequestedParts: React.FunctionComponent<CasePartsRequestedProps> = (
   props
) => {
   const decodedCaseNumber = decodeCaseNumber(props.subcase.Id);

   const [requestedParts, setRequestedParts] = useState<RequestedParts[]>([]);
   const requestedPartsFetchState = useFetch<ResultsObject<RequestedParts[]>>(
      `${apiBase}/parts/request/${decodedCaseNumber.masterCase}`,
      {
         method: "GET",
      },

      {
         json: true,
         defer: true,
         onResolve: (res) => {
            setRequestedParts(res.Results[0]);
         },
      }
   );

   const runFetchParts = async () => {
      try {
         const thisAPISession = await getAPISessionInComponent();
         requestedPartsFetchState.run({
            headers: buildRequestHeaders(thisAPISession),
         });
      } catch {}
   };

   useEffect(() => {
      runFetchParts();
   }, []);

   return (
      <PartsListTemplate
         title={"Parts Requests"}
         loading={requestedPartsFetchState.isPending}
         length={requestedParts.length}
      >
         <>
            {requestedParts.map((rp) => (
               <div key={rp.RequestNo} className={"flex flex-col"}>
                  <div className={"flex flex-row space-x-1"}>
                     <div>Request #: {rp.RequestNo}</div>
                     <div>Requested by: {rp.RequestByName}</div>
                     <div>Request Status: {rp.RequestStatus}</div>
                  </div>
                  <div className={"flex flex-row"}>
                     <div className={"flex flex-row"}>
                        Requested parts:
                        {rp.PartRequested.map((subrp) => (
                           <div key={subrp.PartNo}>
                              Part: {subrp.PartNo} {subrp.PartDescription}{" "}
                              Quantity: {subrp.PartQty}
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            ))}
         </>
      </PartsListTemplate>
   );
};

export default RequestedParts;
