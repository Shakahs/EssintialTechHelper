import * as React from "react";
import { useForm } from "react-hook-form";
import { CaseBase } from "../../../api";
import Bool from "../../utility/Bool";
import { map } from "lodash";
import ReactDatePicker from "react-datepicker";
import RefreshingAjaxButton from "../../utility/RefreshingAjaxButton";
import { useFetch } from "react-async";
import { apiBase } from "../../../constants";

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
};

const failureCodes = {
   MOREPARTS: "Additional parts required",
};

const CaseCheckout: React.FunctionComponent<CaseCheckoutProps> = (props) => {
   const { register, watch, errors, handleSubmit } = useForm<{
      isResolved: string;
      assignFollowup: boolean;
   }>();
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

   return (
      <form onSubmit={handleSubmit(() => {})}>
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
                     defaultChecked={true}
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
                        ref={register}
                     />
                     <label htmlFor={"closingCode"}>{label}</label>
                  </>
               ))}
            </div>
            <div>
               <label htmlFor={"remarks"} className={"block"}>
                  Remarks:
               </label>
               <textarea ref={register} name={"remarks"} rows={5} cols={40} />
            </div>
            <Bool if={!isResolved}>
               <input
                  type={"checkbox"}
                  name={"assignFollowup"}
                  ref={register}
                  defaultChecked={true}
               />
               <label htmlFor={"assignFollowup"}>
                  Assign followup case to me
               </label>
               {watchAssignFollowup}
               <Bool if={watchAssignFollowup}>
                  <ReactDatePicker onChange={() => {}} />
               </Bool>
            </Bool>
            <div>
               <RefreshingAjaxButton
                  async={checkoutFetchState}
                  onClick={(apiSession) => {}}
               >
                  <span>Checkout</span>
               </RefreshingAjaxButton>
            </div>
         </div>
      </form>
   );
};

export default CaseCheckout;
