import * as React from "react";
import PartsListTemplate from "./PartsListTemplate";
import { CaseSummary } from "../../../../features/cases/types";

interface CasePartsConsumedProps {
   subcase: CaseSummary;
}

const ConsumedParts: React.FunctionComponent<CasePartsConsumedProps> = (
   props
) => (
   <PartsListTemplate
      title={"Consumed Parts"}
      loading={false}
      length={props.subcase.Activities.length}
   >
      <>
         {props.subcase.Activities.map((act) => {
            if (act.ActionCode === "PU") {
               return act.Parts.map((pu) => (
                  <div key={pu.SeqNo}>Consumed part: {pu.CorePartNumber}</div>
               ));
            }
         })}
      </>
   </PartsListTemplate>
);

export default ConsumedParts;
