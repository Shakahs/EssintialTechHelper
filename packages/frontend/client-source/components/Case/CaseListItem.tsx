import * as React from "react";
import {
   CaseBase,
   CurrentCaseStatus,
   isProjectWork,
   NewStatusBody,
   NewStatusCode,
   findCaseStatusName,
   ResultsObject,
} from "../../api";
import Bool from "../utility/Bool";
import { useFetch } from "react-async";
import {
   apiBase,
   caseStatusMapping,
   defaultRequestHeaders,
} from "../../constants";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../rootReducer";
import parseJSON from "date-fns/parseJSON";
import dateFormat from "date-fns/format";
import isBefore from "date-fns/isBefore";
import isToday from "date-fns/isToday";
import classnames from "classnames";
import partsList from "../../assets/riteAidPartList.json";
import { getAPISession } from "../../features/auth/authSelectors";
import { upsertCaseSummary } from "../../features/cases/caseSlice";
import CaseRefresh from "./CaseRefresh";
import { zonedTimeToUtc } from "date-fns-tz";
import CaseStatus from "./CaseStatus";
import CaseETASLA from "./CaseETASLA";
import { caseInProgress } from "./common";
import { useState } from "react";
import CasePartsList from "./CasePartsList";
import CaseComments from "./CaseComments";
import CasePrimaryData from "./CasePrimaryData";
import CaseExtendedData from "./CaseExtendedData";

interface CaseSummaryItemProps {
   subcase: CaseBase;
}

const CaseListItem: React.FunctionComponent<CaseSummaryItemProps> = (props) => {
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
            "w-full border-solid border-black mb-3 bg-gray-300 p-1 text-sm",
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

            <CaseStatus cs={props.subcase} refresh={runUpdateCase} />
            <CaseComments sc={props.subcase} />
         </div>
         <div>
            <CaseExtendedData subcase={props.subcase} />
         </div>
      </div>
   );
};

export default CaseListItem;
