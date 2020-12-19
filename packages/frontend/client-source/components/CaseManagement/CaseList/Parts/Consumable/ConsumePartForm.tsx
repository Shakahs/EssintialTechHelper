import { map } from "lodash";
import * as React from "react";
import { useForm } from "react-hook-form";
import {
   buildRequestHeaders,
   CaseSummary,
   ConsumableParts,
   ConsumePartResponse,
   decodeCaseNumber,
   RequestedParts,
   ResultsObject,
} from "../../../../../api";
import { apiBase, buttonStyle } from "../../../../../constants";
import { useDispatch } from "react-redux";
import { useFetch } from "react-async";
import {
   ConsumePartFormType,
   dispositions,
} from "../../../../../api/consumePartsTypes";
import {
   convertToAction,
   isPartReturnable,
   isPartSerialized,
} from "../../../../../api/consumeParts";
import classnames from "classnames";
import { updateCaseActivities } from "../../../../../features/cases/caseSlice";
import { getAPISessionInComponent } from "../../../../utility";
import Bool from "../../../../utility/Bool";
import LoadingIcon from "../../../../LoadingIcon";

interface ConsumePartFormProps {
   subcase: CaseSummary;
   cp: ConsumableParts;
   closeForm: () => void;
   refreshConsumables: () => void;
}

const ConsumePartForm: React.FunctionComponent<ConsumePartFormProps> = (
   props
) => {
   const dispatch = useDispatch();

   const { register, watch, handleSubmit, setValue, errors } = useForm<
      ConsumePartFormType
   >({
      defaultValues: {
         partDisposition: dispositions.used.key,
      },
   });

   const watchDisposition = watch("partDisposition");
   const watchTracking = watch("returnTracking");

   const isSerialized = isPartSerialized(props.cp);
   const isReturnable = isPartReturnable(props.cp);
   const isBeingUsed = dispositions[watchDisposition].partUsed;
   const shouldBeReturned = isReturnable || !isBeingUsed;

   const decodedCaseNumber = decodeCaseNumber(props.subcase.Id);
   const consumePartsFetchState = useFetch<ResultsObject<ConsumePartResponse>>(
      `${apiBase}/subcases/${decodedCaseNumber.masterCase}/action`,
      {
         method: "POST",
      },

      {
         json: true,
         defer: true,
         onResolve: (res) => {
            console.log(res);
            console.dir({
               Id: res.Results[0].Id,
               Activities: res.Results[0].Activities,
            });

            //refresh consumed parts (activities)
            //do it first to ensure there's no race with refreshing consumables
            dispatch(
               updateCaseActivities({
                  Id: res.Results[0].Id,
                  Activities: res.Results[0].Activities,
               })
            );

            //then refresh consumables
            props.refreshConsumables();
         },
      }
   );

   const runFetchParts = async (data: ConsumePartFormType) => {
      // try {
      //    const thisAPISession = await getAPISessionInComponent();
      //    consumePartsFetchState.run({
      //       headers: buildRequestHeaders(thisAPISession),
      //       body: JSON.stringify(convertToAction(data, props.cp)),
      //    });
      // } catch {}
      console.dir(convertToAction(data, props.cp));
   };

   return (
      <form
         // onSubmit={handleSubmit((data: ConsumePartFormType) => {
         //    console.log(JSON.stringify(convertToAction(data, props.cp)));
         //    console.dir(convertToAction(data, props.cp));
         //    props.refreshConsumables();
         // })}
         onSubmit={handleSubmit(runFetchParts)}
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
                        if (
                           dispositions[e.target.value].partUsed &&
                           !isReturnable
                        ) {
                           setValue("returnTracking", "");
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
                     ref={register({ required: true })}
                  >
                     {!shouldBeReturned && (
                        <option value={""}>No return needed</option>
                     )}
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
                     /* read only if part is being returned,
                      with content being set by onChange handler on disposition field */
                     readOnly={isSerialized && !isBeingUsed}
                     /* disabled with a placeholder if part is not serialized.
                     Will submit as undefined, and be replaced by an empty string later */
                     disabled={!isSerialized}
                     placeholder={
                        isSerialized ? undefined : "Not a serialized part"
                     }
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
                  <input
                     type={"submit"}
                     className={buttonStyle}
                     value={"Consume Part"}
                  />
                  <Bool if={consumePartsFetchState.isPending}>
                     <LoadingIcon />
                  </Bool>
                  <button
                     onClick={props.closeForm}
                     className={"p-1 bg-red-600 border border-black"}
                  >
                     Cancel
                  </button>
               </div>
            </div>
         </>
      </form>
   );
};

export default ConsumePartForm;
