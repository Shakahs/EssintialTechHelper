import * as React from "react";
import { useEffect, useState } from "react";
import { CaseSummary, CurrentCaseStatus, isProjectWork } from "../../api";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../rootReducer";
import { map } from "lodash";
import CaseSummaryItem from "./CaseSummaryItem";
import classnames from "classnames";
import { debouncedFetchCases } from "../../features/cases/caseThunks";
import CaseSummaryFilters from "./CaseSummaryFilters";
import {
   getCaseFilterResult,
   getFilteredSortedCases,
} from "../../features/cases/caseSelectors";
import { getAPISession } from "../../features/auth/authSelectors";
import { resetAuthentication } from "../../features/auth/authSlice";

interface Manage2Props {}

const CaseSummaryList: React.FunctionComponent<Manage2Props> = (props) => {
   const dispatch = useDispatch();
   const { SessionId } = useSelector(getAPISession);
   const { currentCaseSummaries, fetchCaseState } = useSelector(
      (state: RootState) => state.caseSlice
   );

   //run once on component mount
   useEffect(() => {
      dispatch(debouncedFetchCases());
   }, []);

   type caseSummaryFilter = (cs: CaseSummary) => boolean;

   //case status filter
   const [caseStatusFilterSet, changeCaseStatusFilterSet] = useState<
      Set<string>
   >(new Set([CurrentCaseStatus.Assigned, CurrentCaseStatus.Committed]));
   const caseStatusFilter: caseSummaryFilter = (cs: CaseSummary) => {
      //if we have filter properties set, check that this case summary matches them
      if (caseStatusFilterSet.size > 0) {
         return caseStatusFilterSet.has(cs.UserStatus);
      }
      //if no filter properties, pass the subcase
      return true;
   };

   //project work filter
   const [showProjectWork, setShowProjectWork] = useState(false);
   const projectWorkFilter: caseSummaryFilter = (cs: CaseSummary) => {
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
            <button
               className={"border p-2 mb-3"}
               onClick={() => {
                  // fetchCurrentCases.run();
                  // fetchFutureCases.run();
                  dispatch(debouncedFetchCases());
               }}
               disabled={fetchCaseState.loading}
            >
               <svg
                  className={classnames("inline", {
                     "animate-spin": fetchCaseState.loading,
                  })}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  height={30}
                  width={30}
               >
                  <path
                     fillRule="evenodd"
                     d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z"
                     clipRule="evenodd"
                  />
               </svg>
               Refresh
            </button>
            {fetchCaseState.error && (
               <span className={"text-red-500"}>
                  There was an error refreshing your subcase list.
               </span>
            )}
            <CaseSummaryFilters />
         </div>
         {map(filteredCaseSummaries, (sc) => (
            <CaseSummaryItem subcase={sc} key={sc.Id} />
         ))}
      </div>
   );
};

export default CaseSummaryList;
