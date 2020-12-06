import { map } from "lodash";
import * as React from "react";
import { useForm } from "react-hook-form";
import { CaseSummary, ConsumableParts } from "../../../../api";
import { buttonStyle } from "../../../../constants";
import { DevTool } from "@hookform/devtools";

interface ConsumePartFormProps {
   subcase: CaseSummary;
   cp: ConsumableParts;
}

interface dispositionType {
   label: string;
   partUsed: boolean;
   subCode?: string;
}

interface dispositionsType {
   [k: string]: dispositionType;
}
const dispositions: dispositionsType = {
   used: {
      label: "Used",
      partUsed: true,
   },
   unused: {
      label: "Not Used - Good Not Used",
      partUsed: false,
      subCode: "RC1",
   },
   doa: {
      label: "Not Used - Dead On Arrival",
      partUsed: false,
      subCode: "RC2",
   },

   wrongPart: {
      label: "Not Used - Wrong Part",
      partUsed: false,
      subCode: "RC3",
   },
};

const ConsumePartForm: React.FunctionComponent<ConsumePartFormProps> = (
   props
) => {
   const serialNumbered = props.cp.SerialNumber.length > 0;

   const { register, watch, control } = useForm<{
      disposition: dispositionType;
      returnTracking: string;
   }>({
      defaultValues: {
         disposition: dispositions.used,
      },
   });
   const isReturnable = Boolean(Number(props.cp.Returnable));
   const watchDisposition = watch("disposition.partused");
   const watchTracking = watch("returnTracking");

   console.log(JSON.stringify(watchDisposition));

   return (
      <div className={"flex flex-row space-x-2 justify-around"}>
         <div>Consume Part:</div>
         <div>
            <label htmlFor={"dispositionLabel"}>Disposition:</label>
            <select
               name={"dispositionLabel"}
               // ref={register}
               ref={register({
                  setValueAs: (value) => dispositions[value],
               })}
            >
               {map(dispositions, (value, key) => (
                  <option key={value.label} value={key}>
                     {value.label}
                  </option>
               ))}
            </select>
         </div>
         <div>
            <label htmlFor={"returnTracking"}>Return Tracking:</label>
            <select
               name={"returnTracking"}
               disabled={!isReturnable}
               ref={register}
            >
               {props.cp.PartReturnTracking.map((rpt) => (
                  <option key={rpt.ReturnTrackingNumber}>
                     {rpt.ReturnTrackingNumber}
                  </option>
               ))}
               <option value={"manual"}>Manually Enter</option>
            </select>
         </div>
         <div>
            <label htmlFor={"otherTracking"}>Enter Tracking:</label>
            <input
               ref={register}
               name={"otherTracking"}
               disabled={watchTracking !== "manual"}
            />
         </div>
         <div>
            <label htmlFor={"serial"}>
               Return Serial: {props.cp.SerialNumber}
               {watchDisposition ? "used" : "not used "}
            </label>
            <input
               ref={register({ required: serialNumbered })}
               name={"serial"}
               disabled={!serialNumbered || watchDisposition === false}
               // disabled={watchDisposition.partUsed === false}
               // disabled={!watcher.disposition.partUsed}
            />
         </div>
         <div>
            <button className={buttonStyle}>Consume Part</button>
         </div>
         <DevTool control={control} /> {/* set up the dev tool */}
      </div>
   );
};

export default ConsumePartForm;
