import * as React from "react";
import { useState } from "react";
import isBefore from "date-fns/isBefore";
import dateFormat from "date-fns/format";
import formatDate from "date-fns/format";
import { zonedTimeToUtc } from "date-fns-tz";
import isToday from "date-fns/isToday";
import { CaseSummary, NewETABody } from "../../api";
import parseISO from "date-fns/parseISO";
import classnames from "classnames";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useFetch } from "react-async";
import { apiBase, defaultRequestHeaders } from "../../constants";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../rootReducer";
import { getAPISession } from "../../features/auth/authSelectors";
import Bool from "../utility/Bool";
import { getAPISessionInComponent } from "../utility";
import LoadingIcon from "../LoadingIcon";

interface CaseSummaryETASLAProps {
   subcase: CaseSummary;
   refresh: () => void;
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
            props.refresh();
         },

         json: true,
         defer: true,
      }
   );

   const submitNewETA = async (newETA: Date) => {
      const thisAPISession = await getAPISessionInComponent();
      const body: NewETABody = {
         NewSubcaseComment: "Updating ETA",
         ScheduledDateTime: formatDate(newETA, "LLL dd, yyyy hh:mm aa"),
         ServiceRep: thisAPISession.ServiceRep,
      };
      updateETAFetchState.run({
         body: JSON.stringify(body),
         headers: {
            ...defaultRequestHeaders,
            Authorization: thisAPISession.SessionId,
         },
      });
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
                  disabled={updateETAFetchState.isLoading}
                  onClick={() => {
                     submitNewETA(newETA);
                  }}
               >
                  <Bool if={updateETAFetchState.isLoading}>
                     <LoadingIcon />
                  </Bool>
                  Save new ETA
               </button>
               <button
                  className={classnames("border p-2 bg-blue-300 rounded-md", {
                     "text-gray-500": updateETAFetchState.isLoading,
                  })}
                  disabled={updateETAFetchState.isLoading}
                  onClick={() => {
                     setNewETA(null);
                  }}
               >
                  Cancel
               </button>
            </Bool>
         </span>
      </div>
   );
};

export default CaseSummaryETASLA;
