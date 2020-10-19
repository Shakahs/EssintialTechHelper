import * as React from "react";
import CaseETAUpdater from "./CaseETAUpdater";
import { CaseBase } from "../../../api";
import CaseStatusUpdate from "./CaseStatusUpdate";

interface CaseStatusProps {
   subcase: CaseBase;
   refresh: () => void;
}

const CaseStatus: React.FunctionComponent<CaseStatusProps> = (props) => (
   <div>
      <CaseETAUpdater subcase={props.subcase} refresh={props.refresh} />
      <CaseStatusUpdate subcase={props.subcase} refresh={props.refresh} />
   </div>
);

export default CaseStatus;
