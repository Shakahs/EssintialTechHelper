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
      <div>
         {shippedParts.map((sp) => (
            <div>Shipped part: {sp.PartNo} </div>
         ))}
      </div>
   );
};

export default CasePartsShipped;
