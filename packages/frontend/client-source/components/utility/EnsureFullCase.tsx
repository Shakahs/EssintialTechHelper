import * as React from "react";
import {
   apiBase,
   buildRequestHeaders,
   ResultsObject,
} from "../../features/api";
import { useFetch } from "react-async";
import { buttonStyle } from "../../constants";
import { useDispatch, useSelector } from "react-redux";
import { upsertCaseSummary } from "../../features/cases/caseSlice";
import { getAPISessionInComponent } from "../utility";
import LoadingIcon from "../LoadingIcon";
import Bool from "../utility/Bool";
import { ReactElement, useEffect } from "react";
import { getLoginFetchState } from "../../features/auth/authSelectors";
import { CaseFull, CaseSummary } from "../../features/cases/types";

interface CaseSummaryCommentsProps {
   sc: CaseSummary;
   children: ReactElement;
}

const EnsureFullCase: React.FunctionComponent<CaseSummaryCommentsProps> = (
   props
) => {
   const dispatch = useDispatch();
   const loginFetchState = useSelector(getLoginFetchState);

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

   const isFullCase = !!props.sc.Comments;

   const runFetchCase = async () => {
      const thisAPISession = await getAPISessionInComponent();
      caseFullFetchState.run({
         headers: buildRequestHeaders(thisAPISession),
      });
   };

   useEffect(() => {
      if (!isFullCase) {
         runFetchCase();
      }
   }, []);

   return (
      <>
         <Bool if={caseFullFetchState.isLoading || loginFetchState.loading}>
            <div>
               <LoadingIcon /> Loading ticket...
            </div>
         </Bool>
         <Bool if={caseFullFetchState.isRejected}>
            <div>There was an error retrieving the data.</div>
         </Bool>
         <Bool if={isFullCase}>{props.children}</Bool>
      </>
   );
};

export default EnsureFullCase;
