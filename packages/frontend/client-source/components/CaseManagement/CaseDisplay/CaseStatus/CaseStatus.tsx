import * as React from "react";
import CaseETAUpdater from "./CaseETAUpdater";
import CaseStatusUpdater from "./CaseStatusUpdater";
import Bool from "../../../utility/Bool";
import CaseCheckout from "./CaseCheckout";
import { CaseBase } from "../../../../features/cases/types";
import { caseStatusMapping } from "../../../../features/cases/constants";

interface CaseStatusProps {
   subcase: CaseBase;
   refresh: () => void;
}

const CaseStatus: React.FunctionComponent<CaseStatusProps> = (props) => (
   <div>
      <Bool
         if={[
            caseStatusMapping.Assign.whenReading,
            caseStatusMapping.Commit.whenReading,
            caseStatusMapping.Enroute.whenReading,
         ].includes(props.subcase.UserStatus)}
      >
         <CaseETAUpdater subcase={props.subcase} refresh={props.refresh} />
         <CaseStatusUpdater subcase={props.subcase} refresh={props.refresh} />
      </Bool>
      <Bool
         if={caseStatusMapping.Arrive.whenReading === props.subcase.UserStatus}
      >
         <CaseCheckout subcase={props.subcase} refresh={props.refresh} />
      </Bool>
   </div>
);

export default CaseStatus;
