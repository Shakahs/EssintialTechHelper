import * as React from "react";
import {
   CaseSummary,
   CurrentCaseStatus,
   isProjectWork,
   NewStatusBody,
   NewStatusCode,
   findCaseStatusName,
} from "../../api";
import Bool from "../utility/Bool";
import { useFetch } from "react-async";
import {
   apiBase,
   caseStatusMapping,
   defaultRequestHeaders,
} from "../../constants";
import { useSelector } from "react-redux";
import { RootState } from "../../rootReducer";
import parseJSON from "date-fns/parseJSON";
import dateFormat from "date-fns/format";
import isBefore from "date-fns/isBefore";
import isToday from "date-fns/isToday";
import classnames from "classnames";
import partsList from "../../assets/riteAidPartList.json";
// const partsList = require('../../assets/partList.json')

interface CaseSummaryItemProps {
   subcase: CaseSummary;
}

const CaseSummaryItem: React.FunctionComponent<CaseSummaryItemProps> = (
   props
) => {
   const { SessionID } = useSelector((state: RootState) => state.manageAuth);

   const fetchState = useFetch(
      `${apiBase}/subcases/${props.subcase.Id}/status`,
      {
         method: "POST",
         headers: { ...defaultRequestHeaders, Authorization: SessionID },
      },
      {
         onResolve: (acc) => {},
         json: true,
         defer: true,
      }
   );

   const submitNewStatus = (newStatus: string) => {
      const body: NewStatusBody = {
         Comment: "",
         HoldReasonCode: "",
         Code: newStatus,
      };
      fetchState.run({ body: JSON.stringify(body) });
   };

   const parsedETA = parseJSON(props.subcase.ScheduledDateTime);
   const currentCaseStatus = findCaseStatusName(props.subcase);

   return (
      <div
         className={classnames(
            "w-full border-solid border-black  border mb-3 bg-gray-300 p-1",
            {
               "bg-yellow-500": props.subcase.Priority === "02",
               "bg-red-500": props.subcase.Priority === "01",
            }
         )}
      >
         <div className={"block"}>
            <span className={"underline mr-2"}>
               <b>{props.subcase.Id}</b>
            </span>
            <span className={"mr-2"}>Priority: {props.subcase.Priority}</span>
            <span
               className={classnames("mr-2", {
                  "bg-yellow-400": isBefore(parsedETA, new Date()),
               })}
            >
               ETA: {dateFormat(parsedETA, "L/d h:mm b")}
            </span>
            <span>
               SLA:
               {props.subcase.Milestones.map((ms) => {
                  const parsedSLA = parseJSON(ms.CalculatedDateTime);
                  return (
                     <span
                        key={ms.Code}
                        className={classnames("mr-2", {
                           "bg-yellow-400": isToday(parsedSLA),
                        })}
                     >
                        {ms.Code} {dateFormat(parsedSLA, "L/d h:mm b")}
                     </span>
                  );
               })}
            </span>
         </div>
         <Bool if={isProjectWork(props.subcase)}>Project Work</Bool>
         <div>
            Part: {props.subcase.Model}
            {partsList?.[props.subcase.Model]?.description}
         </div>
         <div>
            {props.subcase.CustomerCompany}
            {props.subcase.Location.FullAddress}
            (Copy Address)
            <a
               target={"_blank"}
               className={"underline text-sm"}
               href={`https://maps.google.com/maps?q=${encodeURI(
                  `${props.subcase.CustomerCompany}, ${props.subcase.Location.FullAddress}`
               )}`}
            >
               (Google Map)
            </a>
         </div>
         <div>
            Current Status:
            {currentCaseStatus.name}
            {currentCaseStatus?.nextStatus?.map((nextStatus) => (
               <button
                  key={nextStatus}
                  className={"border p-2 bg-blue-300 rounded-md"}
                  onClick={() => {
                     submitNewStatus(
                        caseStatusMapping[nextStatus].whenUpdating
                     );
                  }}
               >
                  {caseStatusMapping[nextStatus].whenUpdating}
               </button>
            ))}
         </div>
      </div>
   );
};

export default CaseSummaryItem;
