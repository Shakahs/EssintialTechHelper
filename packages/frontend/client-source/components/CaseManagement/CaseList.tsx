import * as React from "react";
import { map } from "lodash";
import CaseDisplayFull from "./CaseDisplay/CaseDisplayFull";
import { useSelector } from "react-redux";
import {
   getCasesArrive,
   getCasesEnroute,
   combiner,
} from "../../features/cases/caseSelectors";
import Bool from "../utility/Bool";
import { caseStatusMapping } from "../../features/cases/constants";
import CaseDisplay from "./CaseDisplay/CaseDisplay";

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
                  <CaseDisplay subcase={sc} key={sc.Id} />
               ))}

               {map(enrouteCases, (sc) => (
                  <CaseDisplay subcase={sc} key={sc.Id} />
               ))}
            </div>
         </Bool>

         <div
            className={
               "grid grid-cols-1 divide-y  border border-black mt-2 p-2"
            }
         >
            {map(otherCases, (sc) => (
               <CaseDisplay subcase={sc} key={sc.Id} />
            ))}
         </div>
      </div>
   );
};

export default CaseList;
