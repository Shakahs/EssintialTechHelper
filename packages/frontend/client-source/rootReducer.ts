import { combineReducers } from "@reduxjs/toolkit";
import manageTicketsReducer from "./features/manageTickets/manageTicketsSlice";
import { authSlice, authReducer } from "./features/manageTickets/authSlice";

const rootReducer = combineReducers({
   manageTickets: manageTicketsReducer,
   manageAuth: authReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
