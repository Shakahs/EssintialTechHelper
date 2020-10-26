import * as React from "react";
import { useEffect, useState } from "react";
import {
   buildRequestHeaders,
   CaseSummary,
   decodeCaseNumber,
   RequestedParts,
   ResultsObject,
} from "../../../../api";
import { useFetch } from "react-async";
import { apiBase } from "../../../../constants";
import { getAPISessionInComponent } from "../../../utility";

interface CasePartsRequestedProps {
   subcase: CaseSummary;
}

const CasePartsRequested: React.FunctionComponent<CasePartsRequestedProps> = (
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
      const thisAPISession = await getAPISessionInComponent();
      requestedPartsFetchState.run({
         headers: buildRequestHeaders(thisAPISession),
      });
   };

   useEffect(() => {
      runFetchParts();
   }, []);

   return (
      <div>
         {requestedParts.map((rp) => (
            <div key={rp.RequestNo}>
               Request #: {rp.RequestNo} Requested parts:
               {rp.PartRequested.map((subrp) => (
                  <div>
                     Part: {subrp.PartNo} Quantity: {subrp.PartQty}
                  </div>
               ))}
            </div>
         ))}
      </div>
   );
};

export default CasePartsRequested;
