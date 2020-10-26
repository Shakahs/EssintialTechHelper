import * as React from "react";
import { CaseSummary } from "../../../../api";
import CasePartsRequested from "./CasePartsRequested";
import CasePartsShipped from "./CasePartsShipped";
import CasePartsConsumable from "./CasePartsConsumable";
import CasePartsConsumed from "./CasePartsConsumed";

interface CaseSummaryPartsProps {
   subcase: CaseSummary;
}

const CaseParts: React.FunctionComponent<CaseSummaryPartsProps> = (props) => {
   return (
      <div className={"inline"}>
         <CasePartsRequested subcase={props.subcase} />
         <CasePartsShipped subcase={props.subcase} />
         <CasePartsConsumable subcase={props.subcase} />
         <CasePartsConsumed subcase={props.subcase} />
      </div>
   );
};

export default CaseParts;
