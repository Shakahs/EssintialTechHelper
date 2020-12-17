import * as React from "react";
import { map } from "lodash";
import CaseListItem from "./CaseListItem";
import { useSelector } from "react-redux";
import {
   getCasesArrive,
   getCasesEnroute,
   combiner,
} from "../../../features/cases/caseSelectors";
import Bool from "../../utility/Bool";
import { caseStatusMapping } from "../../../constants";

interface CaseListProps {}

const CaseList: React.FunctionComponent<CaseListProps> = (props) => {
   const combinedCases = useSelector(combiner);

   const arrivedCases = combinedCases.filter(
      (c) => caseStatusMapping.Arrive.whenReading === c.UserStatus
   );
   const enrouteCases = combinedCases.filter(
      (c) => caseStatusMapping.Enroute.whenReading === c.UserStatus
   );

   const otherCases = combinedCases.filter(
      (c) =>
         ![
            caseStatusMapping.Enroute.whenReading,
            caseStatusMapping.Arrive.whenReading,
         ].includes(c.UserStatus)
   );

   return (
      <div>
         <Bool if={arrivedCases.length > 0 || enrouteCases.length > 0}>
            <div className={"border-8 border-dashed border-green-700 p-2 mt-2"}>
               <p className={"text-2xl text-green-700 m-2"}>Active Tickets:</p>
               {map(arrivedCases, (sc) => (
                  <CaseListItem subcase={sc} key={sc.Id} />
               ))}

               {map(enrouteCases, (sc) => (
                  <CaseListItem subcase={sc} key={sc.Id} />
               ))}
            </div>
         </Bool>

         <div className={"border-2 border-solid border-gray-500 p-2 mt-2"}>
            <p className={"text-2xl m-2"}>Ticket Queue:</p>
            {map(otherCases, (sc) => (
               <CaseListItem subcase={sc} key={sc.Id} />
            ))}
         </div>
      </div>
   );
};

export default CaseList;
