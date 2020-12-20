import { combineReducers } from "@reduxjs/toolkit";
import manageTicketsReducer, { caseSlice } from "./cases/caseSlice";
import { authSlice, authReducer } from "./auth/authSlice";
import { sliceName } from "./auth/authConstants";

const rootReducer = combineReducers({
   [caseSlice.name]: manageTicketsReducer,
   [authSlice.name]: authReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
