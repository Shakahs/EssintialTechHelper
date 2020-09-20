import * as React from "react";
import { RootState } from "../../rootReducer";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { useFetch } from "react-async";
import { apiBase } from "../../constants";

interface ManageProps {}

type Inputs = {
   email: string;
   password: string;
};

const Manage: React.FunctionComponent<ManageProps> = (props) => {
   const { SessionID } = useSelector((state: RootState) => state.manageTickets);
   const { register, handleSubmit, watch, errors } = useForm<Inputs>();

   const { isPending, error, run } = useFetch(
      `${apiBase}/session`,
      {
         method: "POST",
      },
      { onResolve: () => {} }
   );

   const onSubmit = (data: Inputs) => {
      debugger;
   };

   return (
      <div>
         <div>SessionID: {SessionID}</div>

         <form onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor={"email"}>Email</label>
            <input
               name="email"
               defaultValue="test"
               ref={register({ required: true })}
            />

            <input name="exampleRequired" ref={register({ required: true })} />
            {errors.password && <span>This fieldf is required</span>}

            <input type="submit" />
         </form>
      </div>
   );
};

export default Manage;
