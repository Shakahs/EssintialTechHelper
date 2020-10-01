import * as React from "react";
import { useFetch } from "react-async";
import { apiBase, defaultRequestHeaders } from "../../constants";
import {
   buildRequestHeaders,
   CaseSummary,
   PartsShipment,
   ResultsObject,
   ResultsObjectDoubleWrapped,
} from "../../api";
import { getAPISessionInComponent } from "../utility";
import { useEffect, useState } from "react";
import { debouncedFetchCases } from "../../features/cases/caseThunks";
import CaseSummaryPartsListItem from "./CaseSummaryPartsListItem";

interface CaseSummaryPartsProps {
   subcase: CaseSummary;
}

const CaseSummaryPartsList: React.FunctionComponent<CaseSummaryPartsProps> = (
   props
) => {
   const [partsShipments, setPartsShipments] = useState<null | PartsShipment[]>(
      null
   );

   const partsShippedFetchState = useFetch<ResultsObject<PartsShipment[]>>(
      `${apiBase}/parts/shipped/${props.subcase.Id}`,
      {
         method: "GET",
      },

      {
         json: true,
         defer: true,
         onResolve: (res) => {
            setPartsShipments(res.Results[0]);
         },
      }
   );

   const runFetchParts = async () => {
      const thisAPISession = await getAPISessionInComponent();
      partsShippedFetchState.run({
         headers: buildRequestHeaders(thisAPISession),
      });
   };

   useEffect(() => {
      runFetchParts();
   }, []);

   return (
      <div>
         {partsShipments?.map((eachShipment) => (
            <>
               <div>{eachShipment.PartDescription}</div>
               {eachShipment.PartShipped?.map((eachItem) => (
                  <CaseSummaryPartsListItem
                     trackingNumber={eachItem.TrackingNumbers[0]}
                  />
               ))}
            </>
         ))}
         {partsShipments?.length === 0 && (
            <span>There are no parts shipped for this case.</span>
         )}
      </div>
   );
};

export default CaseSummaryPartsList;
