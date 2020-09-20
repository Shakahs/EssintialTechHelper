import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TechSubcase } from "../../api";

interface Authentication {
   SessionID: string | null;
}

interface TechSubcaseList {
   techSubcases: { [key: string]: TechSubcase };
}

type ManagementState = Authentication & TechSubcaseList;

let initialState: ManagementState = {
   SessionID: null,
   techSubcases: {},
};

const manageTicketSlice = createSlice({
   name: "manageTickets",
   initialState,
   reducers: {
      changeAuth(state, action: PayloadAction<Authentication>) {
         state.SessionID = action.payload.SessionID;
      },
      updateTechSubcases(state, action: PayloadAction<TechSubcaseList>) {
         state.techSubcases = action.payload.techSubcases;
      },
   },
});

export const { changeAuth, updateTechSubcases } = manageTicketSlice.actions;

export default manageTicketSlice.reducer;
