import * as React from "react";
import { CaseSummary } from "../../../../api";
import CasePartsTemplate from "./CasePartsTemplate";

interface CasePartsConsumedProps {
   subcase: CaseSummary;
}

const CasePartsConsumed: React.FunctionComponent<CasePartsConsumedProps> = (
   props
) => (
   <CasePartsTemplate
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
   </CasePartsTemplate>
);

export default CasePartsConsumed;
