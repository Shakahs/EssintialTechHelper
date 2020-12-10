import { map } from "lodash";
import * as React from "react";
import { useForm } from "react-hook-form";
import {
   buildRequestHeaders,
   CaseSummary,
   ConsumableParts,
   Credentials,
   decodeCaseNumber,
   RequestedParts,
   ResultsObject,
} from "../../../../api";
import { apiBase, buttonStyle } from "../../../../constants";
import { DevTool } from "@hookform/devtools";
import { store } from "../../../../store";
import { loginAPISession } from "../../../../features/auth/authThunks";
import { SerializedError, unwrapResult } from "@reduxjs/toolkit";
import {
   updateAPISession,
   updateCredentials,
} from "../../../../features/auth/authSlice";
import { useDispatch } from "react-redux";
import { useFetch } from "react-async";
import { getAPISessionInComponent } from "../../../utility";

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

interface PartActionBase {
   ActionCode: string;
   Charges: null[];
}

interface PartUsedAction extends PartActionBase {
   Parts: {
      Description: string; //part description
      Number: string; //part number
      Quantity: number;
      SeqNo: string; //logistics identifier
      Serial: string; // empty string if no serial
   }[];
}

interface PartNotUsedAction extends PartActionBase {
   Parts: {
      ReturnPartCarrier: string;
      ReturnPartComments: string;
      ReturnPartNumber: string;
      ReturnPartQty: number;
      ReturnPartReasonCode: string;
      ReturnPartSeqNo: string;
      ReturnPartSerial: string;
      ReturnPartTracking: string;
   }[];
}

interface ConsumePartFormType {
   partDisposition: dispositionType;
   returnTracking: string;
   serial: string;
}

const ConsumePartForm: React.FunctionComponent<ConsumePartFormProps> = (
   props
) => {
   const dispatch = useDispatch();

   const { register, watch, handleSubmit } = useForm<ConsumePartFormType>({
      defaultValues: {
         partDisposition: dispositions.used,
      },
   });

   const serialNumbered = props.cp.SerialNumber.length > 0;
   const isReturnable = Boolean(Number(props.cp.Returnable));
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

   const convertToAction = (
      data: ConsumePartFormType
   ): PartUsedAction | PartNotUsedAction => {
      if (data.partDisposition.partUsed) {
         return {
            ActionCode: "PU",
            Charges: [],
            Parts: [
               {
                  Description: props.cp.PartDescription,
                  Number: props.cp.PartNo,
                  Quantity: 1,
                  SeqNo: props.cp.DetailSequence,
                  Serial: data.serial,
               },
            ],
         };
      } else {
         return {
            ActionCode: "RET",
            Charges: [],
            Parts: [
               {
                  ReturnPartCarrier: "",
                  ReturnPartComments: "",
                  ReturnPartNumber: props.cp.PartNo,
                  ReturnPartQty: 1,
                  ReturnPartReasonCode: data.partDisposition.subCode,
                  ReturnPartSeqNo: props.cp.DetailSequence,
                  ReturnPartSerial: data.serial,
                  ReturnPartTracking: data.returnTracking,
               },
            ],
         };
      }
   };

   const runFetchParts = async (data: ConsumePartFormType) => {
      // try {
      //    const thisAPISession = await getAPISessionInComponent();
      //    consumePartsFetchState.run({
      //       headers: buildRequestHeaders(thisAPISession),
      //       body: JSON.stringify(convertToAction(data)),
      //    });
      // } catch {}
      console.log(JSON.stringify(convertToAction(data)));
   };

   return (
      <form onSubmit={handleSubmit(runFetchParts)}>
         <div className={"flex flex-row space-x-2 justify-around"}>
            <div>Consume Part:</div>
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
                  value={watchTracking === "manual" ? undefined : watchTracking}
               />
            </div>
            <div>
               <label htmlFor={"serial"}>Serial Number:</label>
               <input
                  ref={register({ required: serialNumbered })}
                  name={"serial"}
                  disabled={!serialNumbered || !watchDisposition.partUsed}
                  value={
                     serialNumbered && !watchDisposition.partUsed
                        ? props.cp.SerialNumber
                        : undefined
                  }
                  // disabled={watchDisposition.partUsed === false}
                  // disabled={!watcher.disposition.partUsed}
               />
            </div>
            <div>
               <button className={buttonStyle}>Consume Part</button>
            </div>
         </div>
      </form>
   );
};

export default ConsumePartForm;
