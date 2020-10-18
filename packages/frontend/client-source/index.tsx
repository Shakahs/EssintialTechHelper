import "core-js/stable";
import "regenerator-runtime/runtime";
import * as React from "react";
import * as ReactDOM from "react-dom";
// import "./style.css";
import AvailableCases from "./components/AvailableCases/AvailableCases";
import "./style.css";
import Navbar from "./components/Navbar";
// import Main from "./components/Main";
import { store, persistor } from "./store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

const render = () => {
   const Main = require("./components/Main").default;

   ReactDOM.render(
      <Provider store={store}>
         {/*<PersistGate loading={null} persistor={persistor}>*/}
         <Main />
         {/*</PersistGate>*/}
      </Provider>,
      document.getElementById("reactApp")
   );
};

render();

if (process.env.NODE_ENV === "development" && module.hot) {
   module.hot.accept("./components/Main", render);
}
