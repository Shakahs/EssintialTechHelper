import * as React from "react";
import { CaseSummary, CaseSummaryStatus } from "../../api";
import Bool from "../utility/Bool";

interface CaseSummaryItemProps {
   subcase: CaseSummary;
}

const CaseSummaryItem: React.FunctionComponent<CaseSummaryItemProps> = (
   props
) => (
   <div className={"w-full border mb-3 bg-grey-300"}>
      <div className={"block"}>
         {props.subcase.Id}
         {props.subcase.Priority} {props.subcase.Model}
      </div>
      <div>
         {props.subcase.CustomerCompany} {props.subcase.Location.FullAddress}
      </div>
      <div>
         status:
         <Bool if={props.subcase.UserStatus === CaseSummaryStatus.Assigned}>
            Assigned
         </Bool>
         <Bool if={props.subcase.UserStatus === CaseSummaryStatus.Committed}>
            Committed
         </Bool>
         <Bool if={props.subcase.UserStatus === CaseSummaryStatus.Complete}>
            Complete
         </Bool>
      </div>
   </div>
);

export default CaseSummaryItem;
