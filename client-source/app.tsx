import * as React from "react";
import { useState, useEffect } from "react";

import getData from "./api";

interface appProps {}

const App: React.FunctionComponent<appProps> = (props) => {
   const [thisApiResult, setAPIResult] = useState<APIResult | null>(null);

   useEffect(() => {
      (async function () {
         try {
            const res = await getData();
            setAPIResult(res);
            console.log(res);
         } catch (e) {
            console.log(e);
         }
      })();
   }, []);

   const ticketDisplay = thisApiResult?.hits.hits.map((h) => {
      return h._id;
   });

   return (
      <div>
         {thisApiResult?.hits.hits.map((h) => {
            return <p key={h._id}>{h._source.detailId}</p>;
         })}
      </div>
   );
};

export default App;
