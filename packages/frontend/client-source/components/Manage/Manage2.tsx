import * as React from "react";
import { useEffect, useState } from "react";
import { apiBase, defaultRequestHeaders } from "../../constants";
import { useFetch } from "react-async";
import {
   CaseSummary,
   CurrentCaseStatus,
   DoubleUnneccessaryArray,
   isProjectWork,
} from "../../api";
import {
   fetchCases,
   updateCaseSummaries,
} from "../../features/manageTickets/manageTicketsSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../rootReducer";
import { map } from "lodash";
import CaseSummaryItem from "./CaseSummaryItem";
import classnames from "classnames";

interface Manage2Props {}

const Manage2: React.FunctionComponent<Manage2Props> = (props) => {
   const dispatch = useDispatch();
   const { SessionID } = useSelector((state: RootState) => state.manageTickets);
   const { currentCaseSummaries } = useSelector(
      (state: RootState) => state.manageTickets
   );

   // const fetchCurrentCases = useFetch<DoubleUnneccessaryArray<CaseSummary>>(
   //    `${apiBase}/subcases/ForTech`,
   //    {
   //       body: JSON.stringify({ Function: "CURRENT" }),
   //       method: "POST",
   //       headers: { ...defaultRequestHeaders, Authorization: SessionID },
   //    },
   //    {
   //       onResolve: (acc) => {
   //          //convert to map
   //          // const subCases = {};
   //          // acc.Results[0].forEach((sc) => {
   //          //    // debugger;
   //          //    subCases[sc.Id] = sc;
   //          // });
   //          //update store
   //          dispatch(
   //             updateCaseSummaries({
   //                currentCaseSummaries: acc.Results[0],
   //             })
   //          );
   //       },
   //       json: true,
   //       defer: true,
   //    }
   // );
   //
   // const fetchFutureCases = useFetch<DoubleUnneccessaryArray<CaseSummary>>(
   //    `${apiBase}/subcases/ForTech`,
   //    {
   //       body: JSON.stringify({ Function: "FUTURE" }),
   //       method: "POST",
   //       headers: { ...defaultRequestHeaders, Authorization: SessionID },
   //    },
   //    {
   //       onResolve: (acc) => {
   //          dispatch(
   //             updateFutureCaseSummaries({
   //                futureCaseSummaries: acc.Results[0],
   //             })
   //          );
   //       },
   //       json: true,
   //       defer: true,
   //    }
   // );

   //run once on component mount
   useEffect(() => {
      dispatch(fetchCases());
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

   const filteredCaseSummaries = currentCaseSummaries;

   return (
      <div>
         <div className={"block"}>
            <button
               className={"border p-2 mb-3"}
               onClick={() => {
                  // fetchCurrentCases.run();
                  // fetchFutureCases.run();
                  dispatch(fetchCases());
               }}
               // disabled={
               //    fetchCurrentCases.isPending || fetchFutureCases.isPending
               // }
            >
               <svg
                  className={classnames("inline", {
                     // "animate-spin": fetchCurrentCases.isPending,
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
            <div>
               Filters:
               <div className={"border border-solid border-1 inline p-2"}>
                  Case Status:
                  {map(CurrentCaseStatus, (code, pretty) => (
                     <div
                        key={code}
                        className={"inline"}
                        onClick={() => {
                           const newSet = new Set(caseStatusFilterSet);
                           if (newSet.has(code)) {
                              newSet.delete(code);
                           } else {
                              newSet.add(code);
                           }
                           changeCaseStatusFilterSet(newSet);
                        }}
                     >
                        <input
                           type={"checkbox"}
                           name={`checkbox-${code}`}
                           checked={caseStatusFilterSet.has(code)}
                           readOnly
                        />
                        <label htmlFor={`checkbox-${code}`}>{pretty}</label>
                     </div>
                  ))}
               </div>
               <div
                  className={"border border-solid border-1 inline p-2"}
                  onClick={() => {
                     if (showProjectWork) {
                        setShowProjectWork(false);
                     } else setShowProjectWork(true);
                  }}
               >
                  <input
                     type={"checkbox"}
                     name={`checkbox-projectwork`}
                     checked={showProjectWork}
                     readOnly
                  />
                  <label htmlFor={`checkbox-projectwork`}>
                     Show Project work
                  </label>
               </div>
            </div>
         </div>
         {map(filteredCaseSummaries.entities, (sc) => (
            <CaseSummaryItem subcase={sc} key={sc.Id} />
         ))}
      </div>
   );
};

export default Manage2;
