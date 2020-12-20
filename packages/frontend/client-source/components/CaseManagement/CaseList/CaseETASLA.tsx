import * as React from "react";
import isBefore from "date-fns/isBefore";
import dateFormat from "date-fns/format";
import isToday from "date-fns/isToday";
import parseISO from "date-fns/parseISO";
import classnames from "classnames";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../features/rootReducer";
import { getAPISession } from "../../../features/auth/authSelectors";
import { CaseBase } from "../../../features/cases/types";
import { parseCaseSLA } from "../../../features/cases/utility";
import { standardDateTimeFormatting } from "../../../constants";

interface CaseSummaryETASLAProps {
   subcase: CaseBase;
   refresh: () => void;
}

const CaseETASLA: React.FunctionComponent<CaseSummaryETASLAProps> = (props) => {
   const dispatch = useDispatch();
   const { SessionId, ServiceRep } = useSelector((state: RootState) =>
      useSelector(getAPISession)
   );

   const parsedETA = parseISO(props.subcase.ScheduledDateTime);

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
               const parsedSLA_UTC = parseCaseSLA(ms.CalculatedDateTime);
               return (
                  <span
                     key={ms.Code}
                     className={classnames("mr-2", {
                        "bg-yellow-400": isToday(parsedSLA_UTC),
                     })}
                  >
                     {ms.Code === "ARR" && "Arrive"}
                     {ms.Code === "FIX" && "Fix"}
                     {dateFormat(parsedSLA_UTC, standardDateTimeFormatting)}
                     {/*{ms.CalculatedDateTime}*/}
                  </span>
               );
            })}
         </span>
      </div>
   );
};

export default CaseETASLA;
