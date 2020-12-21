import * as React from "react";
import {
   apiBase,
   buildRequestHeaders,
   ResultsObject,
} from "../../../../../features/api";
import { buttonStyle } from "../../../../../constants";
import { useFetch } from "react-async";
import { useEffect, useState } from "react";
import { getAPISessionInComponent } from "../../../../utility";
import PartsListTemplate from "../PartsListTemplate";
import Bool from "../../../../utility/Bool";
import ConsumePartForm from "./ConsumePartForm";
import ConsumablePartListItem from "./ConsumablePartListItem";
import { CaseSummary } from "../../../../../features/cases/types";
import { ConsumableParts } from "../../../../../features/parts/types";
import { decodeCaseNumber } from "../../../../../features/cases/utility";

interface ConsumablePartListProps {
   subcase: CaseSummary;
}

const ConsumablePartList: React.FunctionComponent<ConsumablePartListProps> = (
   props
) => {
   const decodedCaseNumber = decodeCaseNumber(props.subcase.Id);

   const [consumableParts, setConsumableParts] = useState<ConsumableParts[]>(
      []
   );
   const [triggerRefresh, setTriggerRefresh] = useState(0);
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
      try {
         const thisAPISession = await getAPISessionInComponent();
         consumablePartFetchState.run({
            headers: buildRequestHeaders(thisAPISession),
         });
      } catch {}
   };

   useEffect(() => {
      runFetchParts();
   }, [triggerRefresh]);

   return (
      <PartsListTemplate
         title={"Consumable Parts"}
         loading={consumablePartFetchState.isLoading}
         length={consumableParts.length}
      >
         <>
            {consumableParts.map((cp) => (
               <ConsumablePartListItem
                  refreshConsumables={() =>
                     setTriggerRefresh(triggerRefresh + 1)
                  }
                  key={cp.DetailSequence}
                  cp={cp}
                  subcase={props.subcase}
               />
            ))}
         </>
      </PartsListTemplate>
   );
};

export default ConsumablePartList;
