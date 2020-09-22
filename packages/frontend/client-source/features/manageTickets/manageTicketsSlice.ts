import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CaseSummary } from "../../api";

interface Authentication {
   SessionID: string | null;
}

interface CurrentCaseSummaries {
   currentCaseSummaries: CaseSummary[];
}

interface FutureCaseSummaries {
   futureCaseSummaries: CaseSummary[];
}

type ManagementState = Authentication &
   CurrentCaseSummaries &
   FutureCaseSummaries;

let initialState: ManagementState = {
   SessionID: null,
   currentCaseSummaries: [],
   futureCaseSummaries: [],
};

const manageTicketSlice = createSlice({
   name: "manageTickets",
   initialState,
   reducers: {
      changeAuth(state, action: PayloadAction<Authentication>) {
         state.SessionID = action.payload.SessionID;
      },
      updateCurrentCaseSummaries(
         state,
         action: PayloadAction<CurrentCaseSummaries>
      ) {
         state.currentCaseSummaries = action.payload.currentCaseSummaries;
      },
      updateFutureCaseSummaries(
         state,
         action: PayloadAction<FutureCaseSummaries>
      ) {
         state.futureCaseSummaries = action.payload.futureCaseSummaries;
      },
   },
});

export const {
   changeAuth,
   updateCurrentCaseSummaries,
   updateFutureCaseSummaries,
} = manageTicketSlice.actions;

export default manageTicketSlice.reducer;
