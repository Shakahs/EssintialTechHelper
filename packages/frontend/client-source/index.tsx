import * as React from "react";
import * as ReactDOM from "react-dom";
// import "./style.css";
import Available from "./components/Available";
import "./style.css";
import Navbar from "./components/Navbar";
import Main from "./components/Main";
import store from "./store";
import { Provider } from "react-redux";

ReactDOM.render(
   <Provider store={store}>
      <Main />
   </Provider>,
   document.getElementById("reactApp")
);
