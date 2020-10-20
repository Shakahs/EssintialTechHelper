import * as React from "react";
import DatePicker from "react-datepicker";
import Bool from "../../utility/Bool";
import {
   apiBase,
   buttonStyle,
   defaultRequestHeaders,
} from "../../../constants";
import LoadingIcon from "../../LoadingIcon";
import { getAPISessionInComponent } from "../../utility";
import { CaseBase, NewETABody, timeFormatWhenUpdating } from "../../../api";
import formatDate from "date-fns/format";
import parseISO from "date-fns/parseISO";
import { useState } from "react";
import { useFetch } from "react-async";
import AjaxButton from "../../utility/AjaxButton";
import RefreshingAjaxButton from "../../utility/RefreshingAjaxButton";
import classnames from "classnames";

interface CaseETAUpdaterProps {
   subcase: CaseBase;
   refresh: () => void;
}

const CaseETAUpdater: React.FunctionComponent<CaseETAUpdaterProps> = (
   props
) => {
   const parsedETA = parseISO(props.subcase.ScheduledDateTime);
   const [newETA, setNewETA] = useState<Date | null>(null);

   const updateETAFetchState = useFetch(
      `${apiBase}/subcases/${props.subcase.Id}/reschedule`,
      {
         method: "POST",
      },
      {
         onResolve: () => {
            setNewETA(null);
            props.refresh();
         },

         json: true,
         defer: true,
      }
   );

   return (
      <div>
         <b className={"mr-2"}>Set New ETA:</b>
         <DatePicker
            selected={newETA || parsedETA}
            //coerce the type because the library definitions say it COULD be 2 dates representing a range
            onChange={(date: Date) => setNewETA(date)}
            showTimeSelect
            timeIntervals={15}
            dateFormat={"MMMM d, yyyy h:mm aa"}
            // withPortal
         />
         <RefreshingAjaxButton
            async={updateETAFetchState}
            disabled={newETA === null}
            onClick={(thisAPISession) => {
               const body: NewETABody = {
                  NewSubcaseComment: "Updating ETA",
                  ScheduledDateTime: formatDate(newETA, timeFormatWhenUpdating),
                  ServiceRep: thisAPISession.ServiceRep,
               };
               updateETAFetchState.run({
                  body: JSON.stringify(body),
                  headers: {
                     ...defaultRequestHeaders,
                     Authorization: thisAPISession.SessionId,
                  },
               });
            }}
         >
            <span>Save New Eta</span>
         </RefreshingAjaxButton>
         <button
            className={classnames(buttonStyle, {
               "text-gray-500": updateETAFetchState.isLoading,
            })}
            disabled={updateETAFetchState.isLoading || newETA === null}
            onClick={() => {
               setNewETA(null);
            }}
         >
            Cancel
         </button>
      </div>
   );
};

export default CaseETAUpdater;
