import store from "../../store";
import { checkAPISession } from "../../features/auth/authThunks";
import { unwrapResult } from "@reduxjs/toolkit";
import { updateAPISession } from "../../features/auth/authSlice";
import { APISession } from "../../api";

export const getAPISessionInComponent = async (): Promise<APISession> => {
   const APISessionWrapped = await store.dispatch(checkAPISession());
   const APISession = unwrapResult(APISessionWrapped);
   store.dispatch(
      updateAPISession({
         apiSessionData: APISession,
         apiSessionCreation: new Date().toISOString(),
      })
   );
   return APISession;
};
