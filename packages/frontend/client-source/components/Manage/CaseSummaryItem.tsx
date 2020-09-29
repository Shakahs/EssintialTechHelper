import * as React from "react";
import {
   CaseSummary,
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

interface CaseSummaryItemProps {
   subcase: CaseSummary;
}

const CaseSummaryItem: React.FunctionComponent<CaseSummaryItemProps> = (
   props
) => {
   const dispatch = useDispatch();
   const { SessionId } = useSelector((state: RootState) =>
      useSelector(getAPISession)
   );

   const updateCaseFetchState = useFetch<ResultsObject<CaseSummary>>(
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

   const updateStatusFetchState = useFetch(
      `${apiBase}/subcases/${props.subcase.Id}/status`,
      {
         method: "POST",
         headers: { ...defaultRequestHeaders, Authorization: SessionId },
      },
      {
         onResolve: (acc) => {},
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

   const parsedETA = parseJSON(props.subcase.ScheduledDateTime);
   const currentCaseStatus = findCaseStatusName(props.subcase);

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
         <CaseSummaryRefresh
            loading={updateCaseIsLoading}
            error={updateCaseError}
            run={runUpdateCase}
         />
         <div className={"block"}>
            <span className={"underline mr-2"}>
               <b>{props.subcase.Id}</b>
            </span>
            <span className={"mr-2"}>
               <b>Priority:</b> {props.subcase.Priority}
            </span>
            <div className={"inline"}>
               <b>Current Status:</b>
               {currentCaseStatus.name}
               {currentCaseStatus?.nextStatus?.map((nextStatus) => (
                  <button
                     key={nextStatus}
                     className={"border p-2 bg-blue-300 rounded-md"}
                     onClick={() => {
                        submitNewStatus(
                           caseStatusMapping[nextStatus].whenUpdating
                        );
                     }}
                  >
                     {caseStatusMapping[nextStatus].whenUpdating}
                  </button>
               ))}
            </div>
         </div>
         <div className={"block"}>
            <span
               className={classnames("mr-2", {
                  "bg-yellow-400": isBefore(parsedETA, new Date()),
               })}
            >
               <b>ETA:</b> {dateFormat(parsedETA, "L/d h:mm b")}
            </span>
            <span>
               <b>SLA: </b>
               {props.subcase.Milestones.map((ms) => {
                  //Big assumption here: the user is in the same time zone as the store.
                  //SLA is in the store's timezone, here we are reading it from the user
                  const parsedSLA_UTC = zonedTimeToUtc(
                     ms.CalculatedDateTime,
                     Intl.DateTimeFormat().resolvedOptions().timeZone
                  );
                  return (
                     <span
                        key={ms.Code}
                        className={classnames("mr-2", {
                           "bg-yellow-400": isToday(parsedSLA_UTC),
                        })}
                     >
                        {ms.Code === "ARR" && "Arrive"}
                        {ms.Code === "FIX" && "Fix"}
                        {dateFormat(parsedSLA_UTC, "L/d h:mm b")}
                        {/*{ms.CalculatedDateTime}*/}
                     </span>
                  );
               })}
            </span>
         </div>
         <Bool if={isProjectWork(props.subcase)}>Project Work</Bool>
         <div>
            <b>Part:</b> {props.subcase.Model}
            {partsList?.[props.subcase.Model]?.description}
         </div>
         <div>
            <span className={"mr-2"}>
               <b>Store:</b> {props.subcase.CustomerCompany}
            </span>
            <span className={"mr-2"}>
               <b>Address:</b> {props.subcase.Location.FullAddress} (Copy
               Address)
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
      </div>
   );
};

export default CaseSummaryItem;
