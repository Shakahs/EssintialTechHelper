import { map } from "lodash";
import * as React from "react";
import { useForm } from "react-hook-form";
import {
   CaseSummary,
   ConsumableParts,
   decodeCaseNumber,
   RequestedParts,
   ResultsObject,
} from "../../../../api";
import { apiBase, buttonStyle } from "../../../../constants";
import { useDispatch } from "react-redux";
import { useFetch } from "react-async";
import {
   ConsumePartFormType,
   dispositions,
} from "../../../../api/consumePartsTypes";
import { convertToAction } from "../../../../api/consumeParts";
import classnames from "classnames";

interface ConsumePartFormProps {
   subcase: CaseSummary;
   cp: ConsumableParts;
}

const ConsumePartForm: React.FunctionComponent<ConsumePartFormProps> = (
   props
) => {
   const isSerialized = props.cp.SerialNumber.length > 0;
   const isReturnable = Boolean(Number(props.cp.Returnable));

   const { register, watch, handleSubmit, setValue, errors } = useForm<
      ConsumePartFormType
   >({
      defaultValues: {
         partDisposition: dispositions.used.key,
      },
   });

   const watchDisposition = watch("partDisposition");
   const watchTracking = watch("returnTracking");

   const decodedCaseNumber = decodeCaseNumber(props.subcase.Id);
   const consumePartsFetchState = useFetch<ResultsObject<RequestedParts[]>>(
      `${apiBase}/subcases/${decodedCaseNumber.masterCase}/action`,
      {
         method: "POST",
      },

      {
         json: true,
         defer: true,
         onResolve: (res) => {
            console.log(res);
         },
      }
   );

   // const runFetchParts = async (data: ConsumePartFormType) => {
   //    // try {
   //    //    const thisAPISession = await getAPISessionInComponent();
   //    //    consumePartsFetchState.run({
   //    //       headers: buildRequestHeaders(thisAPISession),
   //    //       body: JSON.stringify(convertToAction(data)),
   //    //    });
   //    // } catch {}
   //    console.log(JSON.stringify(convertToAction(data)));
   // };

   return (
      <form
         onSubmit={handleSubmit((data: ConsumePartFormType) => {
            console.log(JSON.stringify(convertToAction(data, props.cp)));
         })}
      >
         <>
            <div className={"grid grid-cols-1 md:grid-cols-3 gap-2"}>
               <div>
                  <label htmlFor={"partDisposition"}>Disposition:</label>
                  <select
                     name={"partDisposition"}
                     ref={register}
                     // ref={register({
                     //    setValueAs: (value) => dispositions[value],
                     // })}
                     onChange={(e) => {
                        if (
                           !dispositions[e.target.value].partUsed &&
                           isSerialized
                        ) {
                           setValue("serial", props.cp.SerialNumber);
                        }
                        if (
                           dispositions[e.target.value].partUsed &&
                           isSerialized
                        ) {
                           setValue("serial", "");
                        }
                     }}
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
                        <option
                           key={rpt.ReturnTrackingNumber}
                           value={rpt.ReturnTrackingNumber}
                        >
                           {`${rpt.ReturnTrackingNumber} ${rpt.ReturnTrackingCarrier}`}
                        </option>
                     ))}
                     <option value={"manual"}>Manually Enter</option>
                  </select>
               </div>
               <div>
                  <label htmlFor={"serial"}>Serial Number:</label>
                  <input
                     className={classnames({
                        italic: !isSerialized,
                        "border-red-500": errors.serial,
                     })}
                     ref={register({ required: isSerialized })}
                     name={"serial"}
                     disabled={!isSerialized}
                     placeholder={
                        isSerialized ? undefined : "Not a serialized part"
                     }
                     // value={
                     //    isSerialized && !watchDisposition.partUsed
                     //       ? props.cp.SerialNumber
                     //       : undefined
                     // }
                     // disabled={watchDisposition.partUsed === false}
                     // disabled={!watcher.disposition.partUsed}
                  />
                  {errors.serial && (
                     <p className={"text-red-600 font-semibold"}>
                        Provide return serial number
                     </p>
                  )}
               </div>
               {watchTracking === "manual" && (
                  <>
                     <div>
                        <label htmlFor={"manualTracking"}>
                           Enter Tracking:
                        </label>
                        <input
                           ref={register({ required: true })}
                           name={"manualTracking"}
                           disabled={watchTracking !== "manual"}
                           value={
                              watchTracking === "manual"
                                 ? undefined
                                 : watchTracking
                           }
                        />
                        {errors.manualTracking && (
                           <p className={"text-red-600 font-semibold"}>
                              Provide return tracking number
                           </p>
                        )}
                     </div>
                     <div>
                        <label htmlFor={"specifyCarrier"}>Carrier:</label>
                        <select name={"specifyCarrier"}>
                           <option value={"FDX"}>FedEx</option>
                        </select>
                     </div>
                  </>
               )}
               {!dispositions[watchDisposition].partUsed && (
                  <div className={"md:col-span-3"}>
                     <label htmlFor={"comments"}>Part return comments:</label>
                     <textarea
                        ref={register({ required: true })}
                        name={"comments"}
                        className={"w-full"}
                        rows={2}
                     />
                     {errors.comments && (
                        <p className={"text-red-600 font-semibold"}>
                           Provide details why this part is being returned
                        </p>
                     )}
                  </div>
               )}
               <div className={"md:col-span-3"}>
                  <button className={buttonStyle}>Consume Part</button>
               </div>
            </div>
         </>
      </form>
   );
};

export default ConsumePartForm;
