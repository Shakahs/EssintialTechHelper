import * as React from "react";
import RequestedParts from "./RequestedParts";
import ShippedParts from "./ShippedParts";
import ConsumablePartList from "./Consumable/ConsumablePartList";
import ConsumedParts from "./ConsumedParts";
import { ErrorBoundary } from "react-error-boundary";
import { CaseSummary } from "../../../../features/cases/types";

interface CaseSummaryPartsProps {
   subcase: CaseSummary;
}

const Parts: React.FunctionComponent<CaseSummaryPartsProps> = (props) => {
   return (
      <div className={"inline"}>
         <ErrorBoundary
            fallback={<div>The parts components crashed, please try again</div>}
         >
            <RequestedParts subcase={props.subcase} />
            <ShippedParts subcase={props.subcase} />
            <ConsumablePartList subcase={props.subcase} />
            <ConsumedParts subcase={props.subcase} />
         </ErrorBoundary>
      </div>
   );
};

export default Parts;
