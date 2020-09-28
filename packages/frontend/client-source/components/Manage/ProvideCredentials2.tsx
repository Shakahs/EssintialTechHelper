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
                        <svg
                           className={"animate-spin inline"}
                           xmlns="http://www.w3.org/2000/svg"
                           viewBox="0 0 20 20"
                           fill="currentColor"
                           height={30}
                           width={30}
                        >
                           <path
                              fillRule="evenodd"
                              d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z"
                              clipRule="evenodd"
                           />
                        </svg>
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
