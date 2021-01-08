import * as React from "react";
import { CaseBase } from "../../../features/cases/types";
import { partsList } from "../../../features/parts/partsList";
import {
   findCaseStatusName,
   parseCaseSLA,
} from "../../../features/cases/utility";
import dateFormat from "date-fns/format";
import parseISO from "date-fns/parseISO";
import classnames from "classnames";
import isToday from "date-fns/isToday";
import { standardDateTimeFormatting } from "../../../constants";

interface CaseDisplayMiniProps {
   subcase: CaseBase;
   toggleDisplay: () => void;
}

const CaseDisplayMini: React.FunctionComponent<CaseDisplayMiniProps> = (
   props
) => (
   <div
      className={
         "grid grid-cols-3 text-sm border border-solid border-black lg:grid-cols-10 cursor-pointer"
      }
      onClick={props.toggleDisplay}
   >
      <div>{props.subcase.Id}</div>
      <div>{`Priority: ${props.subcase.Priority}`}</div>
      <div>{`ETA ${dateFormat(
         parseISO(props.subcase.ScheduledDateTime),
         "L/d H:mm"
      )}`}</div>
      <div>{props.subcase.Location.City}</div>
      <div>{findCaseStatusName(props.subcase).name}</div>
      <div>
         SLA:
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
      </div>
      <div className={"col-span-3 lg:col-span-2"}>
         {props.subcase.CustomerCompany}
      </div>
      <div className={"col-span-3 lg:col-span-2"}>
         {partsList.lookupPart(props.subcase.Model)}
      </div>
   </div>
);

export default CaseDisplayMini;
