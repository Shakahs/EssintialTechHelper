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

   const { register, watch, handleSubmit } = useForm<ConsumePartFormType>({
      defaultValues: {
         partDisposition: dispositions.used,
         serial: isSerialized ? undefined : "Not a serialized part",
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
                     className={classnames({ italic: !isSerialized })}
                     ref={register({ required: isSerialized })}
                     name={"serial"}
                     disabled={!isSerialized || !watchDisposition.partUsed}
                     value={
                        isSerialized && !watchDisposition.partUsed
                           ? props.cp.SerialNumber
                           : undefined
                     }
                     // disabled={watchDisposition.partUsed === false}
                     // disabled={!watcher.disposition.partUsed}
                  />
               </div>
               {watchTracking === "manual" && (
                  <>
                     <div>
                        <label htmlFor={"otherTracking"}>Enter Tracking:</label>
                        <input
                           ref={register}
                           name={"otherTracking"}
                           disabled={watchTracking !== "manual"}
                           value={
                              watchTracking === "manual"
                                 ? undefined
                                 : watchTracking
                           }
                        />
                     </div>
                     <div>
                        <label htmlFor={"specifyCarrier"}>Carrier:</label>
                        <select name={"specifyCarrier"}>
                           <option value={"FDX"}>FedEx</option>
                        </select>
                     </div>
                  </>
               )}
               {!watchDisposition.partUsed && (
                  <div className={"md:col-span-3"}>
                     <label htmlFor={"comments"}>Part return comments:</label>
                     <textarea
                        ref={register}
                        name={"comments"}
                        className={"w-full"}
                        rows={2}
                     />
                  </div>
               )}
               <div className={"md:col-span-3"}>
                  <button className={buttonStyle}>Consume Part</button>
               </div>
            </div>
            {/*<div className={"flex flex-col space-x-2 justify-around "}>*/}
            {/*   <div className={"flex flex-row justify-around"}>*/}
            {/*      <div>*/}
            {/*         <label htmlFor={"partDisposition"}>Disposition:</label>*/}
            {/*         <select*/}
            {/*            name={"partDisposition"}*/}
            {/*            // ref={register}*/}
            {/*            ref={register({*/}
            {/*               setValueAs: (value) => dispositions[value],*/}
            {/*            })}*/}
            {/*         >*/}
            {/*            {map(dispositions, (value, key) => (*/}
            {/*               <option key={value.label} value={key}>*/}
            {/*                  {value.label}*/}
            {/*               </option>*/}
            {/*            ))}*/}
            {/*         </select>*/}
            {/*      </div>*/}
            {/*      <div>*/}
            {/*         <label htmlFor={"returnTracking"}>Return Tracking:</label>*/}
            {/*         <select*/}
            {/*            name={"returnTracking"}*/}
            {/*            disabled={!isReturnable}*/}
            {/*            ref={register}*/}
            {/*         >*/}
            {/*            {props.cp.PartReturnTracking.map((rpt) => (*/}
            {/*               <option key={rpt.ReturnTrackingNumber}>*/}
            {/*                  {`${rpt.ReturnTrackingNumber} ${rpt.ReturnTrackingCarrier}`}*/}
            {/*               </option>*/}
            {/*            ))}*/}
            {/*            <option value={"manual"}>Manually Enter</option>*/}
            {/*         </select>*/}
            {/*      </div>*/}
            {/*      <div>*/}
            {/*         <label htmlFor={"serial"}>Serial Number:</label>*/}
            {/*         <input*/}
            {/*            ref={register({ required: serialNumbered })}*/}
            {/*            name={"serial"}*/}
            {/*            disabled={!serialNumbered || !watchDisposition.partUsed}*/}
            {/*            value={*/}
            {/*               serialNumbered && !watchDisposition.partUsed*/}
            {/*                  ? props.cp.SerialNumber*/}
            {/*                  : undefined*/}
            {/*            }*/}
            {/*            // disabled={watchDisposition.partUsed === false}*/}
            {/*            // disabled={!watcher.disposition.partUsed}*/}
            {/*         />*/}
            {/*      </div>*/}
            {/*   </div>*/}
            {/*   {watchTracking === "manual" && (*/}
            {/*      <div className={"flex flex-row justify-around"}>*/}
            {/*         <div>*/}
            {/*            <label htmlFor={"otherTracking"}>Enter Tracking:</label>*/}
            {/*            <input*/}
            {/*               ref={register}*/}
            {/*               name={"otherTracking"}*/}
            {/*               disabled={watchTracking !== "manual"}*/}
            {/*               value={*/}
            {/*                  watchTracking === "manual"*/}
            {/*                     ? undefined*/}
            {/*                     : watchTracking*/}
            {/*               }*/}
            {/*            />*/}
            {/*         </div>*/}
            {/*         <div>*/}
            {/*            <label htmlFor={"specifyCarrier"}>Carrier:</label>*/}
            {/*            <select name={"specifyCarrier"}>*/}
            {/*               <option value={"FDX"}>FedEx</option>*/}
            {/*            </select>*/}
            {/*         </div>*/}
            {/*      </div>*/}
            {/*   )}*/}

            {/*   <div>*/}
            {/*      <button className={buttonStyle}>Consume Part</button>*/}
            {/*   </div>*/}
            {/*</div>*/}
         </>
      </form>
   );
};

export default ConsumePartForm;
