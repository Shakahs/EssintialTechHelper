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

   return (
      <div
         className={
            "w-full border-solid border-black  border mb-3 bg-gray-300 p-1"
         }
      >
         <div className={"block"}>
            <span className={"underline mr-2"}>
               <b>{props.subcase.Id}</b>
            </span>
            <span className={"mr-2"}>Priority: {props.subcase.Priority}</span>
            <Bool if={isProjectWork(props.subcase)}>Project Work</Bool>
         </div>
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
