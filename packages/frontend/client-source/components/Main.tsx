import * as React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Available from "./Available";
import Manage from "./Manage";
import Navbar from "./Navbar";

interface MainProps {}

const Main: React.FunctionComponent<MainProps> = (props) => (
   <div>
      <Router>
         <Navbar />
         <Route path={"/"} exact>
            <Available />
         </Route>
         <Route path={"/manage"}>
            <Manage />
         </Route>
      </Router>
   </div>
);

export default Main;
