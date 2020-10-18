import * as React from "react";
import { apiBase, caseStatusMapping } from "../../constants";
import {
   buildRequestHeaders,
   CaseBase,
   findCaseStatusName,
   NewStatusBody,
} from "../../api";
import { useFetch } from "react-async";
import { useDispatch } from "react-redux";
import { deleteCaseSummary } from "../../features/cases/caseSlice";
import RefreshingAjaxButton from "../utility/RefreshingAjaxButton";

interface CaseSummaryStatusProps {
   subcase: CaseBase;
   refresh: () => void;
}

const CaseStatus: React.FunctionComponent<CaseSummaryStatusProps> = (props) => {
   const dispatch = useDispatch();

   const currentCaseStatus = findCaseStatusName(props.subcase);
   return (
      <div className={"inline"}>
         <b className={"mr-2"}>Update Status:</b>
         {currentCaseStatus?.nextStatus?.map((nextStatus) => {
            const updateStatusFetchState = useFetch(
               `${apiBase}/subcases/${props.subcase.Id}/status`,
               {
                  method: "POST",
               },
               {
                  onResolve: () => {
                     if (nextStatus === "Reject") {
                        dispatch(deleteCaseSummary(props.subcase.Id));
                     } else {
                        props.refresh();
                     }
                  },
                  json: true,
                  defer: true,
               }
            );

            return (
               <RefreshingAjaxButton
                  key={nextStatus}
                  async={updateStatusFetchState}
                  onClick={(apiSession) => {
                     const statusBody: NewStatusBody = {
                        Comment: "",
                        HoldReasonCode: "",
                        Code: caseStatusMapping[nextStatus].whenUpdating,
                     };
                     updateStatusFetchState.run({
                        body: JSON.stringify(statusBody),
                        headers: buildRequestHeaders(apiSession),
                     });
                  }}
               >
                  <span>{caseStatusMapping[nextStatus].whenUpdating}</span>
               </RefreshingAjaxButton>
            );
         })}
      </div>
   );
};

export default CaseStatus;
