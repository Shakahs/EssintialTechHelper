import { combineReducers } from "@reduxjs/toolkit";
import manageTicketsReducer, { caseSlice } from "./cases/caseSlice";
import { authSlice, authReducer } from "./auth/authSlice";
import { sliceName } from "./auth/authConstants";
import { geocodingReducer, geocodingSlice } from "./geocoding/slice";

const rootReducer = combineReducers({
   [caseSlice.name]: manageTicketsReducer,
   [authSlice.name]: authReducer,
   [geocodingSlice.name]: geocodingReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
