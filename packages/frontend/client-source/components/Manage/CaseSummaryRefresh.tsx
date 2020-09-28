import * as React from "react";
import Bool from "../utility/Bool";
import Refresh from "../../assets/refresh.svg";

interface CaseSummaryRefreshProps {
   loading: boolean;
   error: Error;
   run: () => void;
}

const CaseSummaryRefresh: React.FunctionComponent<CaseSummaryRefreshProps> = (
   props
) => (
   <div>
      <button
         className={"border p-2 bg-blue-300 rounded-md"}
         onClick={() => props.run()}
         disabled={props.loading}
      >
         <Bool if={props.loading}>
            <img src={Refresh} className={"animate-spin inline"} />
            Case is updating...
         </Bool>
         <Bool if={!props.loading}>Update case</Bool>
      </button>
   </div>
);

export default CaseSummaryRefresh;
