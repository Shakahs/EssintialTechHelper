import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import rootReducer from "./rootReducer";
import {
   FLUSH,
   PAUSE,
   PERSIST,
   PURGE,
   REGISTER,
   REHYDRATE,
} from "redux-persist/es/constants";
import { authSlice } from "./features/auth/authSlice";

const persistConfig = {
   key: "root",
   storage,
   whitelist: [authSlice.name],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
   reducer: persistedReducer,
   middleware: getDefaultMiddleware({
      serializableCheck: {
         ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
   }),
});

if (process.env.NODE_ENV === "development" && module.hot) {
   module.hot.accept("./rootReducer", () => {
      const newRootReducer = require("./rootReducer").default;
      store.replaceReducer(newRootReducer);
   });
}

export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);

export default () => {
   // create store and persistor per normal...

   if (module.hot) {
      module.hot.accept("./rootReducer", () => {
         // This fetch the new state of the above reducers.
         const nextRootReducer = require("./rootReducer").default;
         store.replaceReducer(persistReducer(persistConfig, nextRootReducer));
      });
   }

   return { store, persistor };
};
