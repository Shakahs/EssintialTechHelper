import * as React from "react";
import {
   apiBase,
   defaultRequestHeaders,
   ResultsObject,
} from "../../../features/api";
import { useFetch } from "react-async";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../features/rootReducer";
import classnames from "classnames";
import { getAPISession } from "../../../features/auth/authSelectors";
import { upsertCaseSummary } from "../../../features/cases/caseSlice";
import CaseRefresh from "./CaseRefresh";
import { caseInProgress } from "../common";
import CasePrimaryData from "./CasePrimaryData";
import CaseExtendedData from "./CaseExtendedData";
import { CaseBase } from "../../../features/cases/types";

interface CaseSummaryItemProps {
   subcase: CaseBase;
   toggleDisplay: () => void;
}

const CaseDisplayFull: React.FunctionComponent<CaseSummaryItemProps> = (
   props
) => {
   const dispatch = useDispatch();
   const { SessionId } = useSelector((state: RootState) =>
      useSelector(getAPISession)
   );

   const updateCaseFetchState = useFetch<ResultsObject<CaseBase>>(
      `${apiBase}/cases/${props.subcase.Id}/subcases/${props.subcase.Id}`,
      {
         headers: { ...defaultRequestHeaders, Authorization: SessionId },
      },
      {
         onResolve: (wrappedCaseSummary) => {
            const cs = wrappedCaseSummary.Results[0];
            dispatch(upsertCaseSummary(cs));
         },
         json: true,
         defer: true,
      }
   );

   const {
      isLoading: updateCaseIsLoading,
      error: updateCaseError,
   } = updateCaseFetchState;

   const runUpdateCase = () => updateCaseFetchState.run();

   return (
      <div
         className={classnames(
            "w-full border-solid border-black my-3 bg-gray-300 p-1 text-sm",
            {
               "bg-yellow-500": props.subcase.Priority === "02",
               "bg-red-500": props.subcase.Priority === "01",
            },
            {
               border: !caseInProgress(props.subcase),
            },
            {
               "border-dashed border-green-500 border-4": caseInProgress(
                  props.subcase
               ),
            }
         )}
      >
         <div
            onClick={props.toggleDisplay}
            className={"cursor-pointer underline "}
         >
            Close
         </div>
         <CasePrimaryData
            subcase={props.subcase}
            runUpdateCase={runUpdateCase}
         />
         <div>
            <CaseRefresh
               loading={updateCaseIsLoading}
               error={updateCaseError}
               run={runUpdateCase}
            />
         </div>
         <div>
            <CaseExtendedData subcase={props.subcase} refresh={runUpdateCase} />
         </div>
      </div>
   );
};

export default CaseDisplayFull;
