import * as React from "react";
import { CaseSummary } from "../../../../api";

interface CasePartsConsumedProps {
   subcase: CaseSummary;
}

const CasePartsConsumed: React.FunctionComponent<CasePartsConsumedProps> = (
   props
) => (
   <div>
      {props.subcase.Activities.map((act) => {
         if (act.ActionCode === "PU") {
            return act.Parts.map((pu) => (
               <div>Consumed part: {pu.CorePartNumber}</div>
            ));
         }
      })}
   </div>
);

export default CasePartsConsumed;
