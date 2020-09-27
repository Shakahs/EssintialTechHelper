import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../rootReducer";
import { map } from "lodash";
import { caseStatusMapping, CurrentCaseStatus } from "../../api";
import { updateFilters } from "../../features/manageTickets/caseSlice";

interface CaseSummaryFiltersProps {}

const CaseSummaryFilters: React.FunctionComponent<CaseSummaryFiltersProps> = (
   props
) => {
   const dispatch = useDispatch();
   const { caseFilters } = useSelector(
      (state: RootState) => state.manageTickets
   );
   return (
      <div>
         Filters:
         <div className={"border border-solid border-1 inline p-2"}>
            Case Status:
            {map(caseStatusMapping, (csm) => {
               if (csm.isCaseSequenceFilter) {
                  return (
                     <div
                        key={csm.name}
                        className={"inline"}
                        onClick={csm.reduxToggle}
                     >
                        <input
                           type={"checkbox"}
                           name={`checkbox-${name}`}
                           // checked={caseFilters[`show${pretty}`]}
                           checked={
                              csm.reduxFilterSelector &&
                              csm.reduxFilterSelector()
                           }
                           readOnly
                        />
                        <label htmlFor={`checkbox-${csm.name}`}>
                           {csm.name} (
                           {csm.reduxCaseSelector &&
                              useSelector(csm.reduxCaseSelector).length}
                           )
                        </label>
                     </div>
                  );
               }
            })}
         </div>
         <div
            className={"border border-solid border-1 inline p-2"}
            onClick={() => {
               dispatch(
                  updateFilters({
                     ...caseFilters,
                     showProjectWork: !caseFilters.showProjectWork,
                  })
               );
            }}
         >
            <input
               type={"checkbox"}
               name={`checkbox-projectwork`}
               checked={caseFilters.showProjectWork}
               readOnly
            />
            <label htmlFor={`checkbox-projectwork`}>Show Project work</label>
         </div>
      </div>
   );
};

export default CaseSummaryFilters;
