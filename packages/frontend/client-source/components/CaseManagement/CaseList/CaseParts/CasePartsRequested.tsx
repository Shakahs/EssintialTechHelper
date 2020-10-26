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
import DataGrid from "react-data-grid";
import "react-data-grid/dist/react-data-grid.css";
import "./style.css";

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
      { key: "requestNumber", name: "Request #" },
      { key: "requestedBy", name: "Requested By" },
      { key: "partNumber", name: "Part #" },
      { key: "partQuantity", name: "Quantity" },
      { key: "partDescription", name: "Description" },
   ];

   const rows = [];

   requestedParts.forEach((rp) => {
      rp.PartRequested.forEach((subrp) => {
         rows.push({
            requestNumber: rp.RequestNo,
            requestedBy: rp.RequestByName,
            partNumber: subrp.PartNo,
            partQuantity: subrp.PartQty,
            partDescription: subrp.PartDescription,
         });
      });
   });

   return (
      <div>
         <DataGrid
            columns={columns}
            rows={rows}
            rowClass={() => "bg-yellow-300"}
         />
      </div>
   );
};

export default CasePartsRequested;
