import * as React from "react";
import { useLocation, Link, NavLink } from "react-router-dom";

interface mainProps {}

const Navbar: React.FunctionComponent<mainProps> = (props) => (
   <nav className="flex items-center justify-between flex-wrap bg-teal-500 p-6">
      <div className="flex items-center flex-shrink-0 text-white mr-6">
         <span className="font-semibold text-xl tracking-tight">
            Essintial Tech Helper
         </span>
      </div>

      <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
         <div className="text-sm lg:flex-grow">
            <a
               href="#responsive-header"
               className="block mt-2 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4"
            >
               <NavLink to={"/"} activeClassName={"underline"} exact>
                  My Tickets
               </NavLink>
            </a>
            <a
               href="#responsive-header"
               className="block mt-2 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4"
            >
               <NavLink to={"/manage"} activeClassName={"underline"}>
                  Available Tickets
               </NavLink>
            </a>
         </div>
      </div>
   </nav>
);

export default Navbar;
