import * as React from "react";
import { useFetch } from "react-async";
import {
   apiBase,
   buttonStyle,
   defaultRequestHeaders,
} from "../../../../constants";
import {
   buildRequestHeaders,
   CaseBase,
   ShippedParts,
   ResultsObject,
   ResultsObjectDoubleWrapped,
   RequestedParts,
   ConsumableParts,
   decodeCaseNumber,
   CaseFull,
} from "../../../../api";
import { getAPISessionInComponent } from "../../../utility";
import { useEffect, useState } from "react";
import { debouncedFetchCases } from "../../../../features/cases/caseThunks";
import CasePartsListItem from "./CasePartsListItem";
import LoadingIcon from "../../../LoadingIcon";
import Bool from "../../../utility/Bool";
import AjaxButton from "../../../utility/AjaxButton";
import RefreshingAjaxButton from "../../../utility/RefreshingAjaxButton";
import { ErrorBoundary } from "react-error-boundary";
import { CombinedParts } from "../../../utility/CombinedParts";

interface CaseSummaryPartsProps {
   subcase: CaseFull;
}

const CasePartsList: React.FunctionComponent<CaseSummaryPartsProps> = (
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

   const [consumableParts, setConsumableParts] = useState<ConsumableParts[]>(
      []
   );
   const consumablePartFetchState = useFetch<ResultsObject<ConsumableParts[]>>(
      `${apiBase}/parts/tobeconsumed/${decodedCaseNumber.masterCase}`,
      {
         method: "GET",
      },

      {
         json: true,
         defer: true,
         onResolve: (res) => {
            setConsumableParts(res.Results[0]);
         },
      }
   );

   const runFetchParts = async () => {
      const thisAPISession = await getAPISessionInComponent();
      requestedPartsFetchState.run({
         headers: buildRequestHeaders(thisAPISession),
      });
      shippedPartsFetchState.run({
         headers: buildRequestHeaders(thisAPISession),
      });
      consumablePartFetchState.run({
         headers: buildRequestHeaders(thisAPISession),
      });
   };

   const partsCombiner = new CombinedParts();
   requestedParts.forEach(partsCombiner.addPartsRequest);
   shippedParts.forEach(partsCombiner.addShippedParts);
   consumableParts.forEach(partsCombiner.addConsumableParts);
   props.subcase.Activities.forEach(partsCombiner.addConsumedParts);
   console.log(partsCombiner.parts);

   useEffect(() => {
      runFetchParts();
   }, []);

   return (
      <div className={"inline"}>
         <div>
            <RefreshingAjaxButton
               async={consumablePartFetchState}
               onClick={(apiSession) => {
                  setConsumableParts([]);

                  requestedPartsFetchState.run({
                     headers: buildRequestHeaders(apiSession),
                  });
                  shippedPartsFetchState.run({
                     headers: buildRequestHeaders(apiSession),
                  });
                  consumablePartFetchState.run({
                     headers: buildRequestHeaders(apiSession),
                  });
               }}
            >
               <span>Refresh Parts</span>
            </RefreshingAjaxButton>
         </div>
         {consumableParts?.length > 0 && (
            <ErrorBoundary
               fallbackRender={({ error }) => (
                  <span>
                     Parts list crashed, please refresh parts to try again.
                     <br />
                     Error: {error.message}
                  </span>
               )}
            >
               <ul>
                  {shippedParts?.map((eachShipment) => (
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
            </ErrorBoundary>
         )}
         {consumableParts?.length === 0 &&
            !consumablePartFetchState.isLoading && (
               <span>There are no parts shipped for this case.</span>
            )}
      </div>
   );
};

export default CasePartsList;
