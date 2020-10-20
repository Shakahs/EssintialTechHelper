import * as React from "react";
import {
   buildRequestHeaders,
   CaseFull,
   CaseSummary,
   PartsShipment,
   ResultsObject,
} from "../../../api";
import { useFetch } from "react-async";
import { apiBase, buttonStyle } from "../../../constants";
import { useDispatch } from "react-redux";
import { upsertCaseSummary } from "../../../features/cases/caseSlice";
import { getAPISessionInComponent } from "../../utility";
import LoadingIcon from "../../LoadingIcon";
import Bool from "../../utility/Bool";

interface CaseSummaryCommentsProps {
   sc: CaseSummary;
}

const CaseComments: React.FunctionComponent<CaseSummaryCommentsProps> = (
   props
) => {
   return (
      <div>
         {props.sc?.ProblemDesc}
         {props.sc?.Comments?.map((comment) => (
            <div>
               {comment.CommentDateTime} {comment.CommentText}
            </div>
         ))}
      </div>
   );
};

export default CaseComments;
