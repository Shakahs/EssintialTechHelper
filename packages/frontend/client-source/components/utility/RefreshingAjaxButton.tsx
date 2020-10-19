import * as React from "react";
import { AsyncState } from "react-async";
import { ReactElement, useState } from "react";
import { getAPISessionInComponent } from "./index";
import AjaxButton from "./AjaxButton";
import { APISession } from "../../api";

interface RefreshingAjaxButtonProps {
   async: AsyncState<any>;
   onClick: (apiSession: APISession) => void;
   children: ReactElement;
   className?: string;
   disabled?: boolean;
}

const RefreshingAjaxButton: React.FunctionComponent<RefreshingAjaxButtonProps> = (
   props
) => {
   const [refreshLoading, setRefreshLoading] = useState(false);

   const execute = async () => {
      try {
         setRefreshLoading(true);
         const session = await getAPISessionInComponent();
         props.onClick(session);
      } catch (err) {
         props.async.setError(new Error("Refreshing "));
      } finally {
         setRefreshLoading(false);
      }
   };

   return (
      <AjaxButton
         loading={props.async.isLoading || refreshLoading}
         onClick={async () => {
            await execute();
         }}
         disabled={props.disabled}
         className={props.className}
      >
         {props.children}
      </AjaxButton>
   );
};

export default RefreshingAjaxButton;
