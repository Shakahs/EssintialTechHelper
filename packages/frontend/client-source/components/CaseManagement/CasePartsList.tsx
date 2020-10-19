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
import AjaxButton from "../utility/AjaxButton";
import RefreshingAjaxButton from "../utility/RefreshingAjaxButton";

interface CaseSummaryPartsProps {
   subcase: CaseBase;
}

const CasePartsList: React.FunctionComponent<CaseSummaryPartsProps> = (
   props
) => {
   const [partsShipments, setPartsShipments] = useState<PartsShipment[]>([]);

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
      <div className={"inline"}>
         <div>
            <RefreshingAjaxButton
               async={partsShippedFetchState}
               onClick={(apiSession) => {
                  setPartsShipments([]);
                  partsShippedFetchState.run({
                     headers: buildRequestHeaders(apiSession),
                  });
               }}
            >
               <span>Refresh Parts</span>
            </RefreshingAjaxButton>
         </div>
         {partsShipments?.length > 0 && (
            <ul>
               {partsShipments?.map((eachShipment) => (
                  <li key={eachShipment.DetailSequence}>
                     <div>{eachShipment.PartDescription}</div>
                     {eachShipment.PartShipped?.map((eachItem) => (
                        <CasePartsListItem
                           key={eachItem.TrackingNumbers[0]}
                           trackingNumber={eachItem.TrackingNumbers[0]}
                        />
                     ))}
                  </li>
               ))}
            </ul>
         )}
         {partsShipments?.length === 0 && !partsShippedFetchState.isLoading && (
            <span>There are no parts shipped for this case.</span>
         )}
      </div>
   );
};

export default CasePartsList;
