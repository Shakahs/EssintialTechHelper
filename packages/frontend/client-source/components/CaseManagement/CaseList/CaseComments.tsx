import * as React from "react";
import { CaseSummary } from "../../../api";
import { keyBy } from "lodash";
import Bool from "../../utility/Bool";

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
         {props.sc?.Comments?.map((comment) => (
            <div>
               {comment.CommentDateTime} {comment.CommentText}
            </div>
         ))}
      </div>
   );
};

export default CaseComments;
