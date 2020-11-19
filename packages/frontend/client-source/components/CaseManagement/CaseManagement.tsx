import * as React from "react";
import { useEffect, useState } from "react";
import { CaseBase, CurrentCaseStatus, isProjectWork } from "../../api";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../rootReducer";
import { map } from "lodash";
import CaseListItem from "./CaseList/CaseListItem";
import classnames from "classnames";
import { debouncedFetchCases } from "../../features/cases/caseThunks";
import CaseFilters from "./CaseFilters";
import {
   getCaseFilterResult,
   getCasesArrive,
   getCasesEnroute,
   getFilteredSortedCases,
} from "../../features/cases/caseSelectors";
import { getAPISession } from "../../features/auth/authSelectors";
import { resetAuthentication } from "../../features/auth/authSlice";
import CaseComments from "./CaseList/CaseComments";
import AjaxButton from "../utility/AjaxButton";
import CaseMap from "./CaseMap/CaseMap";
import CaseList from "./CaseList/CaseList";

interface Manage2Props {}

const CaseManagement: React.FunctionComponent<Manage2Props> = (props) => {
   const dispatch = useDispatch();
   const { fetchCaseState } = useSelector(
      (state: RootState) => state.caseSlice
   );

   //run once on component mount
   useEffect(() => {
      dispatch(debouncedFetchCases());
   }, []);

   const filteredCaseSummaries = useSelector(getFilteredSortedCases);

   return (
      <div>
         <div className={"flex flex-row justify-between items-center"}>
            <div>
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
            </div>{" "}
            <CaseFilters cases={filteredCaseSummaries} />
            <button
               className={"border p-2 mb-3"}
               onClick={() => {
                  dispatch(resetAuthentication());
               }}
            >
               Logout
            </button>
         </div>
         <div className={"mt-2"}>
            <CaseMap tickets={filteredCaseSummaries} />
         </div>
         <div>
            <CaseList />
         </div>
      </div>
   );
};

export default CaseManagement;
