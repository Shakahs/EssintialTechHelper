import * as React from "react";
import { useFetch } from "react-async";
import { apiBase, buttonStyle, defaultRequestHeaders } from "../../constants";
import {
   buildRequestHeaders,
   CaseBase,
   PartsShipment,
   ResultsObject,
   ResultsObjectDoubleWrapped,
} from "../../api";
import { getAPISessionInComponent } from "../utility";
import { useEffect, useState } from "react";
import { debouncedFetchCases } from "../../features/cases/caseThunks";
import CasePartsListItem from "./CasePartsListItem";
import LoadingIcon from "../LoadingIcon";
import Bool from "../utility/Bool";

interface CaseSummaryPartsProps {
   subcase: CaseBase;
}

const CasePartsList: React.FunctionComponent<CaseSummaryPartsProps> = (
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

   return (
      <div className={"inline"}>
         <button
            className={buttonStyle}
            onClick={() => {
               setPartsShipments(null);
               runFetchParts();
            }}
         >
            <Bool if={partsShippedFetchState.isLoading}>
               <LoadingIcon />
            </Bool>
            Toggle Parts Display
         </button>
         {partsShipments?.map((eachShipment) => (
            <>
               <div>{eachShipment.PartDescription}</div>
               {eachShipment.PartShipped?.map((eachItem) => (
                  <CasePartsListItem
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

export default CasePartsList;
