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
      <div className={"w-full border mb-3 bg-grey-300"}>
         <div className={"block"}>
            {props.subcase.Id}
            {props.subcase.Priority} {props.subcase.Model}
            <Bool if={isProjectWork(props.subcase)}>Project Work</Bool>
         </div>
         <div>
            {props.subcase.CustomerCompany} {props.subcase.Location.FullAddress}
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
