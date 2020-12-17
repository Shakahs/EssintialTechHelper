import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../rootReducer";
import { map, capitalize } from "lodash";
import { CaseBase, CurrentCaseStatus } from "../../api";
import { updateFilters } from "../../features/cases/caseSlice";
import { caseStatusMapping } from "../../constants";
import { getCityOptions } from "../../features/cases/caseSelectors";

interface CaseSummaryFiltersProps {
   cases: CaseBase[];
}

const CaseFilters: React.FunctionComponent<CaseSummaryFiltersProps> = (
   props
) => {
   const dispatch = useDispatch();
   const { caseFilters } = useSelector((state: RootState) => state.caseSlice);

   const casesForCitySelect = useSelector(getCityOptions);
   const cityOptions = Array.from(
      new Set(casesForCitySelect.map((c) => c.Location.City.toLowerCase()))
   ).sort();

   return (
      <div className={"border border-solid border-1 p-2"}>
         Filters:
         <div className={"flex flex-row justify-between"}>
            {map(caseStatusMapping, (csm) => {
               if (csm.isCaseSequenceFilter) {
                  return (
                     <div
                        key={csm.name}
                        className={"inline mr-1"}
                        onClick={csm.reduxToggle}
                     >
                        <input
                           type={"checkbox"}
                           name={`checkbox-${name}`}
                           // checked={caseFilters[`show${pretty}`]}
                           checked={csm?.reduxFilterSelector()}
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
            <div
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
               <label htmlFor={`checkbox-projectwork`}>
                  Include Project work
               </label>
            </div>
            <div>
               <select
                  onChange={(v) => {
                     dispatch(
                        updateFilters({
                           ...caseFilters,
                           showCity: v.target.value,
                        })
                     );
                  }}
                  value={caseFilters.showCity}
               >
                  <option value={""}>
                     Any {`(${casesForCitySelect.length})`}
                  </option>
                  {cityOptions.map((c) => (
                     <option value={c} key={c}>
                        {c.split(" ").map(capitalize).join(" ")}{" "}
                        {`(${
                           casesForCitySelect.filter(
                              (all) => all.Location.City.toLowerCase() === c
                           ).length
                        })`}
                     </option>
                  ))}
                  {caseFilters.showCity !== "" &&
                     !cityOptions.includes(caseFilters.showCity) && (
                        <option value={caseFilters.showCity}>
                           {caseFilters.showCity
                              .split(" ")
                              .map(capitalize)
                              .join(" ")}
                        </option>
                     )}
               </select>
            </div>
         </div>
      </div>
   );
};

export default CaseFilters;
