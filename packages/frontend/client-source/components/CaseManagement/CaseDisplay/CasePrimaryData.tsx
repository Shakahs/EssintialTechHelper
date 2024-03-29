import * as React from "react";
import { caseInProgress } from "../common";
import CaseETASLA from "./CaseETASLA";
import Bool from "../../utility/Bool";
import classnames from "classnames";
import { CaseBase } from "../../../features/cases/types";
import {
   findCaseStatusName,
   isCaseProjectWork,
} from "../../../features/cases/utility";
import { partsList } from "../../../features/parts/partsList";
import Copier from "../../utility/Copier";

interface CasePrimaryDataProps {
   subcase: CaseBase;
   runUpdateCase: () => void;
}

const CasePrimaryData: React.FunctionComponent<CasePrimaryDataProps> = (
   props
) => {
   return (
      <div>
         <div className={"block"}>
            <span className={"underline mr-1"}>
               <b>
                  <Copier text={props.subcase.Id} />
               </b>
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
            <CaseETASLA subcase={props.subcase} refresh={props.runUpdateCase} />
         </div>
         <Bool if={isCaseProjectWork(props.subcase)}>Project Work</Bool>
         <div>
            <b>Part:</b>
            {partsList.lookupPart(props.subcase.Model)}
         </div>
         <div>
            <span className={"mr-2"}>
               <b>Address:</b>{" "}
               <Copier text={props.subcase.Location.FullAddress} />
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

export default CasePrimaryData;
