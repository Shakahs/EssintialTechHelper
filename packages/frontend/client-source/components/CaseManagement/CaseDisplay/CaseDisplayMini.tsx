import * as React from "react";
import { CaseBase } from "../../../features/cases/types";
import { partsList } from "../../../features/parts/partsList";
import { findCaseStatusName } from "../../../features/cases/utility";
import dateFormat from "date-fns/format";
import parseISO from "date-fns/parseISO";

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
      <div>{`${dateFormat(
         parseISO(props.subcase.ScheduledDateTime),
         "L/d H:mm"
      )}`}</div>
      <div>{props.subcase.Location.City}</div>
      <div>{findCaseStatusName(props.subcase).name}</div>
      <div>{`${dateFormat(
         parseISO(props.subcase.ScheduledDateTime),
         "L/d H:mm"
      )}`}</div>
      <div className={"col-span-3 lg:col-span-2"}>
         {props.subcase.CustomerCompany}
      </div>
      <div className={"col-span-3 lg:col-span-2"}>
         {partsList.lookupPart(props.subcase.Model)}
      </div>
   </div>
);

export default CaseDisplayMini;
