import * as React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Available from "./Available";
import ProvideCredentials2 from "./Manage/ProvideCredentials2";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import { RootState } from "../rootReducer";
import Bool from "./utility/Bool";
import Manage2 from "./Manage/Manage2";

interface MainProps {}

const Main: React.FunctionComponent<MainProps> = (props) => {
   const { SessionID } = useSelector((state: RootState) => state.manageAuth);

   return (
      <div>
         <Router>
            <Navbar />
            <div className={"m-2"}>
               <Route path={"/"} exact>
                  <Available />
               </Route>
               <Route path={"/manage"}>
                  <Bool if={!!SessionID}>
                     <Manage2 />
                  </Bool>
                  <Bool if={!SessionID}>
                     <ProvideCredentials2 />
                  </Bool>
               </Route>
            </div>
         </Router>
      </div>
   );
};

export default Main;
