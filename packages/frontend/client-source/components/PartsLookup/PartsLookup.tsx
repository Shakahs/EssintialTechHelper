import * as React from "react";
import { partsList } from "../../features/parts/partsList";
import { useState } from "react";
import Bool from "../utility/Bool";

interface PartsLookupProps {}

const PartsLookup: React.FunctionComponent<PartsLookupProps> = (props) => {
   const [query, setQuery] = useState("");
   const [results, setResults] = useState(Array.from(partsList.parts));

   return (
      <div className={"flex flex-col"}>
         <div className={"flex flex-col my-2 items-center"}>
            <div className={"flex flex-row  "}>
               <div className={"mr-2 text-2xl"}>Search:</div>
               <input
                  className={"border border-black"}
                  type={"text"}
                  value={query}
                  placeholder={"anything"}
                  onChange={(e) => {
                     setQuery(e.target.value);
                     setResults(
                        Array.from(partsList.searchPart(e.target.value))
                     );
                  }}
               />
            </div>
            <div>Search for any part number or description</div>
         </div>
         <div>
            {results.map(([k, v]) => (
               <div className={"grid grid-cols-2 bg-gray-300"} key={k}>
                  <div>{k}</div>
                  <div>{v.partDescription}</div>
               </div>
            ))}
         </div>
         <Bool if={results.length === 0}>
            <div className={"text-2xl"}>No results found for your search</div>
         </Bool>
      </div>
   );
};

export default PartsLookup;
