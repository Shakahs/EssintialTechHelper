import * as React from "react";
import { RootState } from "../../rootReducer";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import classNames from "classnames";
import {
   updateCredentials,
   updateAPISession,
} from "../../features/auth/authSlice";
import { loginAPISession } from "../../features/auth/authThunks";
import { unwrapResult } from "@reduxjs/toolkit";
import store from "../../store";
import Bool from "../utility/Bool";
import { Credentials } from "../../api";
import Refresh from "../../assets/refresh.svg";

interface ManageProps {}

const ProvideCredentials2: React.FunctionComponent<ManageProps> = (props) => {
   const dispatch = useDispatch();
   const { loginFetchState } = useSelector(
      (state: RootState) => state.manageAuth
   );

   const { register, handleSubmit, watch, errors } = useForm<Credentials>();

   const onSubmit = async (credentials: Credentials) => {
      const wrappedResult = await store.dispatch(loginAPISession(credentials));
      const APISession = unwrapResult(wrappedResult);
      dispatch(
         updateAPISession({
            apiSessionData: APISession,
            apiSessionCreation: new Date().toISOString(),
         })
      );
      dispatch(updateCredentials(credentials));
   };

   return (
      <div className={"flex flex-col items-center"}>
         <div className={"bg-green-400 w-full max-w-xs px-8 py-5"}>
            <h4 className={"mb-4"}>
               Please provide your SRMBuddy credentials:
            </h4>
            <form onSubmit={handleSubmit(onSubmit)}>
               <div className={"mb-4"}>
                  <label htmlFor={"email"} className={"block mb-2"}>
                     Email
                  </label>
                  <input
                     className={"border rounded w-full shadow appearance-none"}
                     name="email"
                     defaultValue="ssaleemi@essintial.com"
                     ref={register({ required: true })}
                  />
               </div>
               <div className={"mb-4"}>
                  <label htmlFor={"password"} className={"block mb-2"}>
                     Password
                  </label>
                  <input
                     name="password"
                     className={"border rounded w-full shadow appearance-none"}
                     ref={register({ required: true })}
                  />
                  {errors.password && (
                     <span className={"block text-red-600"}>
                        This field is required
                     </span>
                  )}
               </div>
               <div>
                  <button
                     type="submit"
                     className={classNames([
                        "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4",
                        " rounded focus:outline-none focus:shadow-outline ",
                     ])}
                     // disabled={isPending}
                  >
                     <Bool if={loginFetchState.loading}>
                        <img
                           src={Refresh}
                           className={"inline animate-spin mr-2 "}
                        />
                     </Bool>
                     Log In
                  </button>
               </div>
               {loginFetchState.error && (
                  <span className={"text-red-500"}>
                     {loginFetchState.error}
                  </span>
               )}
            </form>
         </div>
      </div>
   );
};

export default ProvideCredentials2;
