import * as React from "react";
import {
   CaseBase,
   CurrentCaseStatus,
   isProjectWork,
   NewStatusBody,
   NewStatusCode,
   findCaseStatusName,
   ResultsObject,
} from "../../api";
import Bool from "../utility/Bool";
import { useFetch } from "react-async";
import {
   apiBase,
   caseStatusMapping,
   defaultRequestHeaders,
} from "../../constants";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../rootReducer";
import parseJSON from "date-fns/parseJSON";
import dateFormat from "date-fns/format";
import isBefore from "date-fns/isBefore";
import isToday from "date-fns/isToday";
import classnames from "classnames";
import partsList from "../../assets/riteAidPartList.json";
import { getAPISession } from "../../features/auth/authSelectors";
import { upsertCaseSummary } from "../../features/cases/caseSlice";
import CaseSummaryRefresh from "./CaseSummaryRefresh";
import { zonedTimeToUtc } from "date-fns-tz";
import CaseSummaryStatus from "./CaseSummaryStatus";
import CaseSummaryETASLA from "./CaseSummaryETASLA";
import { caseInProgress } from "./common";
import { useState } from "react";
import CaseSummaryPartsList from "./CaseSummaryPartsList";

interface CaseSummaryItemProps {
   subcase: CaseBase;
}

const CaseSummaryItem: React.FunctionComponent<CaseSummaryItemProps> = (
   props
) => {
   const dispatch = useDispatch();
   const { SessionId } = useSelector((state: RootState) =>
      useSelector(getAPISession)
   );

   const updateCaseFetchState = useFetch<ResultsObject<CaseBase>>(
      `${apiBase}/cases/${props.subcase.Id}/subcases/${props.subcase.Id}`,
      {
         headers: { ...defaultRequestHeaders, Authorization: SessionId },
      },
      {
         onResolve: (wrappedCaseSummary) => {
            const cs = wrappedCaseSummary.Results[0];
            dispatch(upsertCaseSummary(cs));
         },
         json: true,
         defer: true,
      }
   );

   const {
      isLoading: updateCaseIsLoading,
      error: updateCaseError,
   } = updateCaseFetchState;

   const runUpdateCase = () => updateCaseFetchState.run();

   return (
      <div
         className={classnames(
            "w-full border-solid border-black mb-3 bg-gray-300 p-1 text-sm",
            {
               "bg-yellow-500": props.subcase.Priority === "02",
               "bg-red-500": props.subcase.Priority === "01",
            },
            {
               border: !caseInProgress(props.subcase),
            },
            {
               "border-dashed border-green-500 border-4": caseInProgress(
                  props.subcase
               ),
            }
         )}
      >
         <div className={"block"}>
            <span className={"underline mr-1"}>
               <b>{props.subcase.Id}</b>
            </span>
            <span className={"mr-1"}>{props.subcase.CustomerCompany}</span>
            <span className={"mr-1"}>
               <b>Priority {props.subcase.Priority}</b>
            </span>
            <span
               className={classnames("p-1", {
                  "bg-green-500": caseInProgress(props.subcase),
               })}
            >
               {findCaseStatusName(props.subcase).name}
            </span>
         </div>
         <div className={"block"}>
            <CaseSummaryETASLA
               subcase={props.subcase}
               refresh={runUpdateCase}
            />
         </div>
         <Bool if={isProjectWork(props.subcase)}>Project Work</Bool>
         <div>
            <b>Part:</b>
            {partsList?.[props.subcase.Model]?.description ??
               props.subcase.Model}
         </div>
         <div>
            <span className={"mr-2"}>
               <b>Address:</b> {props.subcase.Location.FullAddress}
            </span>
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
            <CaseSummaryRefresh
               loading={updateCaseIsLoading}
               error={updateCaseError}
               run={runUpdateCase}
            />
            <CaseSummaryPartsList subcase={props.subcase} />

            <CaseSummaryStatus cs={props.subcase} refresh={runUpdateCase} />
         </div>
      </div>
   );
};

export default CaseSummaryItem;
