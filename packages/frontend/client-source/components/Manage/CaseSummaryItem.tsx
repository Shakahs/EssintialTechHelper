import * as React from "react";
import {
   CaseSummary,
   CaseSummaryStatus,
   isProjectWork,
   NewStatusBody,
   NewStatusCode,
} from "../../api";
import Bool from "../utility/Bool";
import { useFetch } from "react-async";
import { apiBase, defaultRequestHeaders } from "../../constants";
import { useSelector } from "react-redux";
import { RootState } from "../../rootReducer";
import parseJSON from "date-fns/parseJSON";
import dateFormat from "date-fns/format";
import isBefore from "date-fns/isBefore";
import classnames from "classnames";

interface CaseSummaryItemProps {
   subcase: CaseSummary;
}

const CaseSummaryItem: React.FunctionComponent<CaseSummaryItemProps> = (
   props
) => {
   const { SessionID } = useSelector((state: RootState) => state.manageTickets);

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

   const submitNewStatus = (newStatus: NewStatusCode) => {
      const body: NewStatusBody = {
         Comment: "",
         HoldReasonCode: "",
         Code: newStatus,
      };
      fetchState.run({ body: JSON.stringify(body) });
   };

   const parsedETA = parseJSON(props.subcase.ScheduledDateTime);

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
               className={classnames({
                  "bg-yellow-400": isBefore(parsedETA, new Date()),
               })}
            >
               Scheduled: {dateFormat(parsedETA, "L/d h:mm b")}
            </span>
         </div>
         <Bool if={isProjectWork(props.subcase)}>Project Work</Bool>
         <div>Part Number: {props.subcase.Model}</div>
         <div>
            <a
               target={"_blank"}
               className={"underline text-sm"}
               href={`https://maps.google.com/maps?q=${encodeURI(
                  `${props.subcase.CustomerCompany}, ${props.subcase.Location.FullAddress}`
               )}`}
            >
               {props.subcase.CustomerCompany},
               {props.subcase.Location.FullAddress}
            </a>
         </div>
         <div>
            status:
            <Bool if={props.subcase.UserStatus === CaseSummaryStatus.Assigned}>
               Assigned
               <button
                  className={"border p-2 bg-blue-300 rounded-md"}
                  onClick={() => {
                     submitNewStatus("COMMIT");
                  }}
               >
                  Commit
               </button>
            </Bool>
            <Bool if={props.subcase.UserStatus === CaseSummaryStatus.Committed}>
               Committed
            </Bool>
            <Bool if={props.subcase.UserStatus === CaseSummaryStatus.Complete}>
               Complete
            </Bool>
         </div>
      </div>
   );
};

export default CaseSummaryItem;
