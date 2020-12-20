import * as React from "react";
import ConsumePartForm from "./ConsumePartForm";
import { useState } from "react";
import { buttonStyle } from "../../../../../constants";
import Bool from "../../../../utility/Bool";
import {
   isPartReturnable,
   isPartSerialized,
} from "../../../../../features/parts/consumeParts";
import { CaseSummary } from "../../../../../features/cases/types";
import { ConsumableParts } from "../../../../../features/parts/types";

interface ConsumablePartListItemProps {
   cp: ConsumableParts;
   subcase: CaseSummary;
   refreshConsumables: () => void;
}

const ConsumablePartListItem: React.FunctionComponent<ConsumablePartListItemProps> = (
   props
) => {
   const [showForm, setShowForm] = useState(false);

   return (
      <div className={"flex flex-col  "}>
         <div
            className={`grid grid-cols-2 md:grid-cols-5 rounded-lg border-2 border-orange-500 bg-yellow-400 p-1 cursor-pointer`}
            onClick={() => setShowForm(!showForm)}
         >
            <div>{`${props.cp.PartNo} ${props.cp.PartDescription} `}</div>
            <div>{`Serial Number: ${
               isPartSerialized(props.cp)
                  ? props.cp.SerialNumber
                  : "Not a serialized part"
            }`}</div>
            <div>{`Returnable: ${
               isPartReturnable(props.cp) ? "Yes" : "No"
            }`}</div>
            <div>{`Available: ${props.cp.PartAvailableQty}`}</div>
         </div>
         <Bool if={showForm}>
            <div className={"px-2"}>
               <div
                  className={
                     " p-2 border-orange-500 bg-yellow-400 border-l-2 border-r-2 border-b-2 "
                  }
               >
                  <ConsumePartForm
                     subcase={props.subcase}
                     cp={props.cp}
                     closeForm={() => setShowForm(false)}
                     refreshConsumables={props.refreshConsumables}
                  />
               </div>
            </div>
         </Bool>
      </div>
   );
};

export default ConsumablePartListItem;
