import { combineReducers } from "@reduxjs/toolkit";
import manageTicketsReducer, { caseSlice } from "./features/cases/caseSlice";
import { authSlice, authReducer } from "./features/auth/authSlice";
import { sliceName } from "./features/auth/authConstants";

const rootReducer = combineReducers({
   [caseSlice.name]: manageTicketsReducer,
   [authSlice.name]: authReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
