import * as React from "react";
import LoadingIcon from "../../../LoadingIcon";
import CasePartsListTracking from "./CasePartsListTracking";
import { ReactElement } from "react";
import Bool from "../../../utility/Bool";

interface CasePartsTemplateProps {
   title: string;
   loading: boolean;
   children: ReactElement;
   length: number;
}

const CasePartsTemplate: React.FunctionComponent<CasePartsTemplateProps> = (
   props
) => (
   <div
      className={
         "border border-solid border-1 border-black divide-y divide-black p-3"
      }
   >
      <div style={{ stroke: "black" }}>
         {props.title}
         {props.loading ? <LoadingIcon /> : props.length}
      </div>

      {props.children}
   </div>
);

export default CasePartsTemplate;
