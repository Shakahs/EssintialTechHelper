import { map, reduce } from "lodash";
import * as React from "react";
import { combinedPartsSequence, combinedPartsSubData } from "../../../../api";
import CasePartsListSequence from "./CasePartsListSequence";
import partsList from "../../../../assets/riteAidPartList.json";
import Bool from "../../../utility/Bool";

interface CasePartsListItem2Props {
   parts: combinedPartsSubData;
}

const CasePartsListItem2: React.FunctionComponent<CasePartsListItem2Props> = (
   props
) => {
   const totalShipped = reduce<{ [k: string]: combinedPartsSequence }, number>(
      props.parts.sequences,
      (res, val, key) => {
         return res + val.shippedQuantity;
      },
      0
   );

   const totalConsumable = reduce<
      { [k: string]: combinedPartsSequence },
      number
   >(
      props.parts.sequences,
      (res, val, key) => {
         return res + val.consumableQuantity;
      },
      0
   );

   const totalConsumed = reduce<{ [k: string]: combinedPartsSequence }, number>(
      props.parts.sequences,
      (res, val, key) => {
         return res + val.consumedQuantity;
      },
      0
   );

   //if only the shipped quantity is > 0, then is is a part that was shipped for
   // a different subcase on the same master case and should not be displayed here
   const shouldDisplay = totalConsumable > 0 || totalConsumable > 0;

   return (
      <Bool if={shouldDisplay}>
         <div className={"border border-black "}>
            <div>
               Part Number: {props.parts.partNumber}
               Requested: {props.parts.requestedQuantity}
               Shipped: {totalShipped}
               Used: {totalConsumed}
               Available: {totalConsumable}
            </div>
            <div>{partsList?.[props.parts.partNumber]?.description}</div>
            <div>
               {map(props.parts.sequences, (seq) => (
                  <CasePartsListSequence
                     sequence={seq}
                     key={seq.sequenceNumber}
                  />
               ))}
            </div>
         </div>
      </Bool>
   );
};

export default CasePartsListItem2;
