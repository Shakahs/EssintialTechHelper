import * as React from "react";
import {
   apiBase,
   buttonStyle,
   caseStatusMapping,
   defaultRequestHeaders,
} from "../../constants";
import { CaseBase, findCaseStatusName, NewStatusBody } from "../../api";
import { useFetch } from "react-async";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../rootReducer";
import { getAPISession } from "../../features/auth/authSelectors";
import Refresh from "../../assets/refresh.svg";
import Bool from "../utility/Bool";
import { useState } from "react";
import classnames from "classnames";
import {
   deleteCaseSummary,
   upsertCaseSummary,
} from "../../features/cases/caseSlice";
import { caseInProgress } from "./common";

interface CaseSummaryStatusProps {
   subcase: CaseBase;
   refresh: () => void;
}

const CaseStatus: React.FunctionComponent<CaseSummaryStatusProps> = (props) => {
   const dispatch = useDispatch();
   const { SessionId } = useSelector((state: RootState) =>
      useSelector(getAPISession)
   );
   const [clickedStatus, setClickedStatus] = useState("");

   const currentCaseStatus = findCaseStatusName(props.subcase);
   const updateStatusFetchState = useFetch(
      `${apiBase}/subcases/${props.subcase.Id}/status`,
      {
         method: "POST",
         headers: { ...defaultRequestHeaders, Authorization: SessionId },
      },
      {
         onResolve: () => {
            if (clickedStatus === caseStatusMapping.Reject.whenUpdating) {
               dispatch(deleteCaseSummary(props.subcase.Id));
            } else {
               props.refresh();
            }
         },
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
      updateStatusFetchState.run({ body: JSON.stringify(body) });
   };

   return (
      <div className={"inline"}>
         <b className={"mr-2"}>Update Status:</b>
         {currentCaseStatus?.nextStatus?.map((nextStatus) => (
            <button
               key={nextStatus}
               className={classnames(buttonStyle, {
                  "text-gray-500": updateStatusFetchState.isLoading,
               })}
               onClick={() => {
                  setClickedStatus(caseStatusMapping[nextStatus].whenUpdating);
                  submitNewStatus(caseStatusMapping[nextStatus].whenUpdating);
               }}
               disabled={updateStatusFetchState.isLoading}
            >
               <Bool
                  if={
                     updateStatusFetchState.isLoading &&
                     caseStatusMapping[nextStatus].whenUpdating ===
                        clickedStatus
                  }
               >
                  <img src={Refresh} className={"inline animate-spin mr-2 "} />
               </Bool>
               {caseStatusMapping[nextStatus].whenUpdating}
            </button>
         ))}
      </div>
   );
};

export default CaseStatus;
