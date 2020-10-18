import { store } from "../../store";
import { checkAPISession } from "../../features/auth/authThunks";
import { unwrapResult } from "@reduxjs/toolkit";
import { updateAPISession } from "../../features/auth/authSlice";
import { APISession } from "../../api";
import { getAPISession } from "../../features/auth/authSelectors";

export const getAPISessionInComponent = async (): Promise<APISession> => {
   const oldApiSession = getAPISession(store.getState());
   const newAPISessionWrapped = await store.dispatch(checkAPISession());
   const newAPISession = unwrapResult(newAPISessionWrapped);

   //compare the session ID we already had to the one checkAPISession returns. Update store if they differ.
   //doing it here is weird but it gets it done
   if (oldApiSession.SessionId !== newAPISession.SessionId) {
      store.dispatch(
         updateAPISession({
            apiSessionData: newAPISession,
            apiSessionCreation: new Date().toISOString(),
         })
      );
   }

   return newAPISession;
};
