import * as React from "react";
import Bool from "../../utility/Bool";
import Refresh from "../../../assets/refresh.svg";
import { buttonStyle } from "../../../constants";

interface CaseSummaryRefreshProps {
   loading: boolean;
   error: Error;
   run: () => void;
}

const CaseRefresh: React.FunctionComponent<CaseSummaryRefreshProps> = (
   props
) => (
   <div className={"inline"}>
      <button
         className={buttonStyle}
         onClick={() => props.run()}
         disabled={props.loading}
      >
         <Bool if={props.loading}>
            <img src={Refresh} className={"animate-spin inline"} />
            Case is updating...
         </Bool>
         <Bool if={!props.loading}>Refresh</Bool>
      </button>
   </div>
);

export default CaseRefresh;
