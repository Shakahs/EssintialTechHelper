import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import {
   buildRequestHeaders,
   CaseBase,
   CheckoutBody,
   timeFormatWhenUpdating,
} from "../../../api";
import Bool from "../../utility/Bool";
import { map } from "lodash";
import ReactDatePicker from "react-datepicker";
import RefreshingAjaxButton from "../../utility/RefreshingAjaxButton";
import { useFetch } from "react-async";
import { apiBase } from "../../../constants";
import DatePicker from "react-datepicker";
import addDays from "date-fns/addDays";
import formatDate from "date-fns/format";

interface CaseCheckoutProps {
   subcase: CaseBase;
   refresh: () => void;
}

const successCodes = {
   DEVCLN: "Device Cleaned",
   CONFIG: "Configuration Changed",
   DEVRPL: "Device Replaced",
   COMPRPL: "Device Component Replaced",
   OTHER: "OTHER",
   NOTRESV: "Resolved / Not Resolved",
};

const failureCodes = {
   MOREPARTS: "Additional parts required",
};

const CaseCheckout: React.FunctionComponent<CaseCheckoutProps> = (props) => {
   const {
      register,
      watch,
      errors,
      handleSubmit,
      getValues,
      control,
      trigger,
   } = useForm<{
      isResolved: string;
      assignFollowup: boolean;
      followupDate: Date;
      closingCode: string;
      remarks: string;
   }>({
      defaultValues: {
         isResolved: "1",
         assignFollowup: true,
         followupDate: addDays(new Date(), 1),
      },
   });
   const watchResolved = watch("isResolved", "1");
   const isResolved = Boolean(Number(watchResolved));
   const displayCodes = isResolved ? successCodes : failureCodes;

   const watchAssignFollowup = watch("assignFollowup", true);

   const checkoutFetchState = useFetch(
      `${apiBase}/subcases/${props.subcase.Id}/reschedule`,
      {
         method: "POST",
      },
      {
         onResolve: () => {
            props.refresh();
         },

         json: true,
         defer: true,
      }
   );

   // console.log(errors);

   return (
      <form
         // onSubmit={handleSubmit(
         //    (data) => {
         //       console.log("valid", data);
         //    },
         //    (data) => {
         //       console.log("invalid", data);
         //    }
         // )}
         onSubmit={(e) => {
            e.preventDefault();
         }}
      >
         <div className={"border border-solid border-black"}>
            <p className={"text-xl m-2"}>Checkout:</p>
            <div>
               <div className={"flex flex-row"}>
                  <span>Is the issue resolved?</span>
                  <input
                     type={"radio"}
                     name={"isResolved"}
                     value={"1"}
                     ref={register}
                  />
                  <label htmlFor={"isResolved"}>Yes</label>
                  <input
                     type={"radio"}
                     name={"isResolved"}
                     value={"0"}
                     ref={register}
                  />
                  <label htmlFor={"isResolved"}>No</label>
               </div>
            </div>
            <div>
               <span>Closing code:</span>
               {map(displayCodes, (label, code) => (
                  <>
                     <input
                        type={"radio"}
                        name={"closingCode"}
                        value={code}
                        ref={register({ required: true })}
                     />
                     <label htmlFor={"closingCode"}>{label}</label>
                  </>
               ))}
               <Bool if={errors?.closingCode?.type === "required"}>
                  <div className={"text-red-500"}>
                     You must select a closing code
                  </div>
               </Bool>
            </div>
            <div>
               <label htmlFor={"remarks"} className={"block"}>
                  Remarks:
               </label>
               <textarea
                  ref={register({ required: true })}
                  name={"remarks"}
                  rows={5}
                  cols={40}
               />
               <Bool if={errors?.remarks?.type === "required"}>
                  <div className={"text-red-500"}>
                     You must provide closing remarks
                  </div>
               </Bool>
            </div>
            <Bool if={!isResolved}>
               <input
                  type={"checkbox"}
                  name={"assignFollowup"}
                  ref={register()}
                  defaultChecked={true}
               />
               <label htmlFor={"assignFollowup"}>
                  Assign followup case to me
               </label>
               {watchAssignFollowup}
               <Bool if={watchAssignFollowup}>
                  <Controller
                     name={"followupDate"}
                     control={control}
                     rules={{ required: true }}
                     render={(props) => (
                        <DatePicker
                           selected={props.value}
                           //coerce the type because the library definitions say it COULD be 2 dates representing a range
                           onChange={(date: Date) => props.onChange(date)}
                           showTimeSelect
                           timeIntervals={15}
                           dateFormat={"MM/d h:mm a"}
                           placeholderText="Select date"
                        />
                     )}
                  />
               </Bool>
            </Bool>
            <div>
               <RefreshingAjaxButton
                  async={checkoutFetchState}
                  onClick={async (apiSession) => {
                     const validInput = await trigger();
                     if (validInput) {
                        const values = getValues();
                        const isResolvedCheckout = Boolean(
                           Number(values.isResolved)
                        );
                        const checkoutBody: CheckoutBody = {
                           ResolvedFlag: isResolvedCheckout,
                           ReasonCode: values.closingCode,
                           Comment: values.remarks,
                           SelfAssignFlag: isResolvedCheckout //can't self assign if resolved, otherwise take user's choice
                              ? false
                              : values.assignFollowup,
                           ScheduleDateTime:
                              isResolvedCheckout === false && //ticket not resolved, and requested followup assignment
                              values.assignFollowup
                                 ? formatDate(
                                      values.followupDate,
                                      timeFormatWhenUpdating
                                   )
                                 : null,
                           ServiceRep:
                              isResolvedCheckout === false && //ticket not resolved, and requested followup assignment
                              values.assignFollowup
                                 ? apiSession.ServiceRep.Id
                                 : null,
                        };
                        console.log(checkoutBody);
                        // checkoutFetchState.run({
                        //    headers: buildRequestHeaders(apiSession),
                        //    body: JSON.stringify(checkoutBody)
                        // });
                     }
                  }}
               >
                  <span>Checkout</span>
               </RefreshingAjaxButton>
            </div>
         </div>
      </form>
   );
};

export default CaseCheckout;
