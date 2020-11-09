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
import { Grid } from "gridjs-react";
import "gridjs/dist/theme/mermaid.css";

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

   const columns = [
      "Request #",
      "Requested By",
      "Part #",
      "Quantity",
      "Description",
   ];

   const rows = [];

   requestedParts.forEach((rp) => {
      rp.PartRequested.forEach((subrp) => {
         rows.push([
            rp.RequestNo,
            rp.RequestByName,
            subrp.PartNo,
            subrp.PartQty,
            subrp.PartDescription,
         ]);
      });
   });

   return (
      <div>
         <Grid
            data={rows}
            columns={columns}
            search={true}
            className={{
               header: "bg-gray-100",
            }}
         />
      </div>
   );
};

export default CasePartsRequested;
