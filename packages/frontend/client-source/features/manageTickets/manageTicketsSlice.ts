import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CaseSummary } from "../../api";

interface Authentication {
   SessionID: string | null;
}

interface CaseSummaries {
   caseSummaries: CaseSummary[];
}

type ManagementState = Authentication & CaseSummaries;

let initialState: ManagementState = {
   SessionID: null,
   caseSummaries: [],
};

const manageTicketSlice = createSlice({
   name: "manageTickets",
   initialState,
   reducers: {
      changeAuth(state, action: PayloadAction<Authentication>) {
         state.SessionID = action.payload.SessionID;
      },
      updateTechSubcases(state, action: PayloadAction<CaseSummaries>) {
         state.caseSummaries = action.payload.caseSummaries;
      },
   },
});

export const { changeAuth, updateTechSubcases } = manageTicketSlice.actions;

export default manageTicketSlice.reducer;
