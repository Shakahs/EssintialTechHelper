import * as React from "react";
import { CaseSummary, ConsumableParts } from "../../../../../api";
import ConsumePartForm from "./ConsumePartForm";
import { useState } from "react";
import { buttonStyle } from "../../../../../constants";
import Bool from "../../../../utility/Bool";

interface ConsumablePartListItemProps {
   cp: ConsumableParts;
   subcase: CaseSummary;
}

const ConsumablePartListItem: React.FunctionComponent<ConsumablePartListItemProps> = (
   props
) => {
   const [showForm, setShowForm] = useState(false);

   return (
      <div className={"flex flex-col"}>
         <div className={buttonStyle} onClick={() => setShowForm(!showForm)}>
            {`${props.cp.PartNo} ${props.cp.PartDescription} Serial: ${props.cp.SerialNumber} Available: ${props.cp.PartAvailableQty}`}{" "}
         </div>
         <Bool if={showForm}>
            <div>
               <ConsumePartForm subcase={props.subcase} cp={props.cp} />
            </div>
         </Bool>
      </div>
   );
};

export default ConsumablePartListItem;
