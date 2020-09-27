import { combineReducers } from "@reduxjs/toolkit";
import manageTicketsReducer from "./features/cases/caseSlice";
import { authSlice, authReducer } from "./features/auth/authSlice";

const rootReducer = combineReducers({
   manageTickets: manageTicketsReducer,
   manageAuth: authReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
