import * as React from "react";
import { combinedPartsSequence } from "../../../../api";
import CasePartsListTracking from "./CasePartsListTracking";
import { map } from "lodash";
import Bool from "../../../utility/Bool";

interface CasePartsListSequenceProps {
   sequence: combinedPartsSequence;
}

const CasePartsListSequence: React.FunctionComponent<CasePartsListSequenceProps> = (
   props
) => (
   <div>
      <div>{props.sequence.sequenceNumber}</div>
      <div>
         {props.sequence.shippedTrackingNumbers.map((tracking) => (
            <CasePartsListTracking trackingNumber={tracking} key={tracking} />
         ))}
      </div>
      <div></div>
   </div>
);

export default CasePartsListSequence;
