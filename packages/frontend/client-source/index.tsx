import * as React from "react";
import * as ReactDOM from "react-dom";
// import "./style.css";
import Available from "./components/Available";
import "./style.css";
import Navbar from "./components/Navbar";
import Main from "./components/Main";
import store from "./store";
import { Provider } from "react-redux";

const render = () => {
   // const Main = require("./components/Main").default;

   ReactDOM.render(
      <Provider store={store}>
         <Main />
      </Provider>,
      document.getElementById("reactApp")
   );
};

render();

if (process.env.NODE_ENV === "development" && module.hot) {
   module.hot.accept("./components/Main", render);
}
