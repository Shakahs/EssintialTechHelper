import * as React from "react";
import { useEffect, useState } from "react";
import { CaseBase, CurrentCaseStatus, isProjectWork } from "../../api";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../rootReducer";
import { map } from "lodash";
import CaseListItem from "./CaseListItem";
import classnames from "classnames";
import { debouncedFetchCases } from "../../features/cases/caseThunks";
import CaseFilters from "./CaseFilters";
import {
   getCaseFilterResult,
   getFilteredSortedCases,
} from "../../features/cases/caseSelectors";
import { getAPISession } from "../../features/auth/authSelectors";
import { resetAuthentication } from "../../features/auth/authSlice";
import CaseComments from "./CaseComments";
import AjaxButton from "../utility/AjaxButton";

interface Manage2Props {}

const CaseList: React.FunctionComponent<Manage2Props> = (props) => {
   const dispatch = useDispatch();
   const { SessionId } = useSelector(getAPISession);
   const { caseSummaries, fetchCaseState } = useSelector(
      (state: RootState) => state.caseSlice
   );

   //run once on component mount
   useEffect(() => {
      dispatch(debouncedFetchCases());
   }, []);

   type caseSummaryFilter = (cs: CaseBase) => boolean;

   //case status filter
   const [caseStatusFilterSet, changeCaseStatusFilterSet] = useState<
      Set<string>
   >(new Set([CurrentCaseStatus.Assigned, CurrentCaseStatus.Committed]));
   const caseStatusFilter: caseSummaryFilter = (cs: CaseBase) => {
      //if we have filter properties set, check that this case summary matches them
      if (caseStatusFilterSet.size > 0) {
         return caseStatusFilterSet.has(cs.UserStatus);
      }
      //if no filter properties, pass the subcase
      return true;
   };

   //project work filter
   const [showProjectWork, setShowProjectWork] = useState(false);
   const projectWorkFilter: caseSummaryFilter = (cs: CaseBase) => {
      if (isProjectWork(cs)) {
         return showProjectWork;
      }
      return true;
   };

   // const filteredCaseSummaries = [
   //    ...currentCaseSummaries,
   // ]
   //    .filter(caseStatusFilter)
   //    .filter(projectWorkFilter);

   const filteredCaseSummaries = useSelector(getFilteredSortedCases);

   return (
      <div>
         <div>
            <button
               className={"border p-2 mb-3"}
               onClick={() => {
                  dispatch(resetAuthentication());
               }}
            >
               Logout
            </button>
         </div>
         <div className={"block"}>
            <AjaxButton
               loading={fetchCaseState.loading}
               onClick={() => {
                  dispatch(debouncedFetchCases());
               }}
               className={"border p-2 mb-3 bg-green-300"}
            >
               <span>Refresh Cases</span>
            </AjaxButton>
            {fetchCaseState.error && (
               <span className={"text-red-500"}>
                  There was an error refreshing your subcase list.
               </span>
            )}
            <CaseFilters />
         </div>
         {map(filteredCaseSummaries, (sc) => (
            <CaseListItem subcase={sc} key={sc.Id} />
         ))}
      </div>
   );
};

export default CaseList;
