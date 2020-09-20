import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Authentication {
   SessionID: string | null;
}

type ManagementState = Authentication;

let initialState: ManagementState = {
   SessionID: null,
};

const manageTicketSlice = createSlice({
   name: "manageTickets",
   initialState,
   reducers: {
      changeAuth(state, action: PayloadAction<Authentication>) {
         state.SessionID = action.payload.SessionID;
      },
   },
});

export const { changeAuth } = manageTicketSlice.actions;

export default manageTicketSlice.reducer;
