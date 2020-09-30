import * as React from "react";
import isBefore from "date-fns/isBefore";
import dateFormat from "date-fns/format";
import { zonedTimeToUtc, utcToZonedTime } from "date-fns-tz";
import isToday from "date-fns/isToday";
import { CaseSummary, NewETABody, NewStatusBody } from "../../api";
import parseJSON from "date-fns/parseJSON";
import parseISO from "date-fns/parseISO";
import classnames from "classnames";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";
import { useFetch } from "react-async";
import {
   apiBase,
   caseStatusMapping,
   defaultRequestHeaders,
} from "../../constants";
import { deleteCaseSummary } from "../../features/cases/caseSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../rootReducer";
import { getAPISession } from "../../features/auth/authSelectors";
import Bool from "../utility/Bool";
import formatDate from "date-fns/format";

interface CaseSummaryETASLAProps {
   subcase: CaseSummary;
}

const CaseSummaryETASLA: React.FunctionComponent<CaseSummaryETASLAProps> = (
   props
) => {
   const dispatch = useDispatch();
   const { SessionId, ServiceRep } = useSelector((state: RootState) =>
      useSelector(getAPISession)
   );

   const parsedETA = parseISO(props.subcase.ScheduledDateTime);
   const [newETA, setNewETA] = useState<Date | null>(null);

   const updateETAFetchState = useFetch(
      `${apiBase}/subcases/${props.subcase.Id}/reschedule`,
      {
         method: "POST",
         headers: { ...defaultRequestHeaders, Authorization: SessionId },
      },
      {
         onResolve: () => {
            setNewETA(null);
         },
         json: true,
         defer: true,
      }
   );

   const submitNewETA = (newETA: Date) => {
      const body: NewETABody = {
         NewSubcaseComment: "Updating ETA",
         ScheduledDateTime: formatDate(newETA, "LLL dd, yyyy hh:mm aa"),
         ServiceRep,
      };
      updateETAFetchState.run({ body: JSON.stringify(body) });
   };

   return (
      <div>
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
         <span>
            <DatePicker
               selected={newETA || parsedETA}
               //coerce the type because the library definitions say it COULD be 2 dates representing a range
               onChange={(date: Date) => setNewETA(date)}
               showTimeSelect
               timeIntervals={15}
               dateFormat={"MMMM d, yyyy h:mm aa"}
               // withPortal
            />
            <Bool if={newETA !== null}>
               <button
                  className={classnames("border p-2 bg-blue-300 rounded-md", {
                     "text-gray-500": updateETAFetchState.isLoading,
                  })}
                  onClick={() => {
                     submitNewETA(newETA);
                  }}
               >
                  Save new ETA
               </button>
            </Bool>
         </span>
      </div>
   );
};

export default CaseSummaryETASLA;
