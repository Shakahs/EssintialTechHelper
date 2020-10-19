import * as React from "react";
import { debouncedFetchCases } from "../../features/cases/caseThunks";
import { ReactElement } from "react";
import { buttonStyle } from "../../constants";
import Bool from "./Bool";
import LoadingIcon from "../LoadingIcon";

interface AjaxButtonProps {
   loading: boolean;
   onClick: () => void;
   children: ReactElement;
   className?: string;
   disabled?: boolean;
}

const AjaxButton: React.FunctionComponent<AjaxButtonProps> = (props) => (
   <button
      className={props.className ?? buttonStyle}
      onClick={props.onClick}
      disabled={props.loading || props.disabled}
   >
      <Bool if={props.loading}>
         <span className={"mr-1"}>
            <LoadingIcon />
         </span>
      </Bool>
      {props.children}
   </button>
);

export default AjaxButton;
