import * as React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Available from "./Available";
import Manage from "./Manage/Manage";
import Navbar from "./Navbar";

interface MainProps {}

const Main: React.FunctionComponent<MainProps> = (props) => (
   <div>
      <Router>
         <Navbar />
         <div className={"m-2"}>
            <Route path={"/"} exact>
               <Available />
            </Route>
            <Route path={"/manage"}>
               <Manage />
            </Route>
         </div>
      </Router>
   </div>
);

export default Main;
