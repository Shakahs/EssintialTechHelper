import * as React from "react";
import {
   buildRequestHeaders,
   CaseFull,
   CaseSummary,
   PartsShipment,
   ResultsObject,
} from "../../api";
import { useFetch } from "react-async";
import { apiBase, buttonStyle } from "../../constants";
import { useDispatch } from "react-redux";
import { upsertCaseSummary } from "../../features/cases/caseSlice";
import { getAPISessionInComponent } from "../utility";
import LoadingIcon from "../LoadingIcon";
import Bool from "../utility/Bool";

interface CaseSummaryCommentsProps {
   sc: CaseSummary;
}

const CaseSummaryComments: React.FunctionComponent<CaseSummaryCommentsProps> = (
   props
) => {
   const dispatch = useDispatch();

   const caseFullFetchState = useFetch<ResultsObject<CaseFull>>(
      `${apiBase}/cases/${props.sc.Id}/subcases/${props.sc.Id}`,
      {
         method: "GET",
      },

      {
         json: true,
         defer: true,
         onResolve: async (res) => {
            await dispatch(upsertCaseSummary(res.Results[0]));
         },
      }
   );

   const runFetchCase = async () => {
      const thisAPISession = await getAPISessionInComponent();
      caseFullFetchState.run({
         headers: buildRequestHeaders(thisAPISession),
      });
   };

   return (
      <div>
         <button
            className={buttonStyle}
            onClick={async () => {
               await runFetchCase();
            }}
            disabled={caseFullFetchState.isLoading}
         >
            <Bool if={caseFullFetchState.isLoading}>
               <LoadingIcon />
            </Bool>
            Show Case Comments
         </button>
         {props.sc?.ProblemDesc}
         {props.sc?.Comments?.map((comment) => (
            <div>
               {comment.CommentDateTime} {comment.CommentText}
            </div>
         ))}
      </div>
   );
};

export default CaseSummaryComments;
