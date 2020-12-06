import * as React from "react";
import {
   buildRequestHeaders,
   CaseSummary,
   ConsumableParts,
   decodeCaseNumber,
   ResultsObject,
} from "../../../../api";
import { apiBase } from "../../../../constants";
import { useFetch } from "react-async";
import { useEffect, useState } from "react";
import { getAPISessionInComponent } from "../../../utility";
import CasePartsTemplate from "./CasePartsTemplate";

interface CasePartsConsumableProps {
   subcase: CaseSummary;
}

const CasePartsConsumable: React.FunctionComponent<CasePartsConsumableProps> = (
   props
) => {
   const decodedCaseNumber = decodeCaseNumber(props.subcase.Id);

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
      consumablePartFetchState.run({
         headers: buildRequestHeaders(thisAPISession),
      });
   };

   useEffect(() => {
      runFetchParts();
   }, []);

   return (
      <CasePartsTemplate
         title={"Consumable Parts"}
         loading={consumablePartFetchState.isLoading}
         length={consumableParts.length}
      >
         <>
            {consumableParts.map((cp) => (
               <div
                  key={cp.DetailSequence}
               >{`${cp.PartNo} ${cp.PartDescription} Available: ${cp.PartAvailableQty}`}</div>
            ))}
         </>
      </CasePartsTemplate>
   );
};

export default CasePartsConsumable;
