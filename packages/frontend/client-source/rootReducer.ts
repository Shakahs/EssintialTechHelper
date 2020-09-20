import { combineReducers } from "@reduxjs/toolkit";
import manageTicketsReducer from "./features/manageTickets/manageTicketsSlice";

const rootReducer = combineReducers({
   manageTickets: manageTicketsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
