import * as React from "react";
import { apiBase, defaultRequestHeaders } from "../../constants";
import { useFetch } from "react-async";
import {
   Account,
   DoubleUnneccessaryArray,
   TechSubcase,
   UnnecessaryArray,
} from "../../api";
import {
   changeAuth,
   updateTechSubcases,
} from "../../features/manageTickets/manageTicketsSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../rootReducer";
import { map } from "lodash";

interface Manage2Props {}

const Manage2: React.FunctionComponent<Manage2Props> = (props) => {
   const dispatch = useDispatch();
   const { SessionID } = useSelector((state: RootState) => state.manageTickets);
   const { techSubcases } = useSelector(
      (state: RootState) => state.manageTickets
   );

   const fetchState = useFetch<DoubleUnneccessaryArray<TechSubcase>>(
      `${apiBase}/subcases/ForTech`,
      {
         body: JSON.stringify({ Function: "CURRENT" }),
         method: "POST",
         headers: { ...defaultRequestHeaders, Authorization: SessionID },
      },
      {
         onResolve: (acc) => {
            //convert to map
            const subCases = {};
            acc.Results[0].forEach((sc) => {
               // debugger;
               subCases[sc.Id] = sc;
            });
            //update store
            console.log(subCases);
            dispatch(updateTechSubcases({ techSubcases: subCases }));
         },
         json: true,
         defer: false,
      }
   );

   return (
      <div>
         {map(techSubcases, (sc) => (
            <>
               {sc.Id} {sc.Location.Address1}
               <br />
            </>
         ))}
      </div>
   );
};

export default Manage2;
