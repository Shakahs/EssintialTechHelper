import * as React from "react";
import { CaseSummary } from "../../../../api";
import CasePartsRequested from "./CasePartsRequested";
import CasePartsShipped from "./CasePartsShipped";
import CasePartsConsumable from "./CasePartsConsumable";
import CasePartsConsumed from "./CasePartsConsumed";
import { ErrorBoundary } from "react-error-boundary";

interface CaseSummaryPartsProps {
   subcase: CaseSummary;
}

const CaseParts: React.FunctionComponent<CaseSummaryPartsProps> = (props) => {
   return (
      <div className={"inline"}>
         <ErrorBoundary
            fallback={<div>The parts components crashed, please try again</div>}
         >
            <CasePartsRequested subcase={props.subcase} />
            <CasePartsShipped subcase={props.subcase} />
            <CasePartsConsumable subcase={props.subcase} />
            <CasePartsConsumed subcase={props.subcase} />
         </ErrorBoundary>
      </div>
   );
};

export default CaseParts;
