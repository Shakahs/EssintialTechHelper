import * as React from "react";
import { CaseBase } from "../../../features/cases/types";
import { useState } from "react";
import CaseDisplayFull from "./CaseDisplayFull";
import CaseDisplayMini from "./CaseDisplayMini";

interface CaseDisplayProps {
   subcase: CaseBase;
}

const CaseDisplay: React.FunctionComponent<CaseDisplayProps> = (props) => {
   const [showFull, setShowFull] = useState(false);
   return (
      <>
         {showFull ? (
            <CaseDisplayFull subcase={props.subcase} />
         ) : (
            <CaseDisplayMini
               subcase={props.subcase}
               toggleDisplay={() => setShowFull(true)}
            />
         )}
      </>
   );
};

export default CaseDisplay;
