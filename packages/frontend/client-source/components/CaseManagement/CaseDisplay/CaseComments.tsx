import * as React from "react";
import { keyBy } from "lodash";
import Bool from "../../utility/Bool";
import { CaseSummary } from "../../../features/cases/types";

interface CaseSummaryCommentsProps {
   sc: CaseSummary;
}

const CaseComments: React.FunctionComponent<CaseSummaryCommentsProps> = (
   props
) => {
   const keyedReferences = keyBy(props.sc.References, (o) => o.Code);

   return (
      <div>
         <Bool if={!!keyedReferences?.["INCIDENT"]}>
            <span>
               {`HCL Incident Number: ${keyedReferences?.["INCIDENT"]?.Value}`}
            </span>
            <br />
         </Bool>
         <Bool if={!!keyedReferences?.["INCCAT"]}>
            <span>
               {`Incident Category: ${keyedReferences?.["INCCAT"]?.Value}`}
            </span>
            <br />
         </Bool>
         <Bool if={!!keyedReferences?.["INCSUBCAT"]}>
            <span>
               {`Incident Subcategory: ${keyedReferences?.["INCSUBCAT"]?.Value}`}
            </span>
            <br />
         </Bool>
         {props.sc?.ProblemDesc}
         {props.sc?.Comments?.map((comment, k) => (
            <div key={k}>
               {comment.CommentDateTime} {comment.CommentText}
            </div>
         ))}
      </div>
   );
};

export default CaseComments;
