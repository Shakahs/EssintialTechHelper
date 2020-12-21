import * as React from "react";
import { useLocation, Link, NavLink } from "react-router-dom";

interface mainProps {}

const Navbar: React.FunctionComponent<mainProps> = (props) => (
   <nav className="flex flex-col md:flex-row bg-teal-500 p-6 text-sm items-center ">
      <div className="text-white mr-6">
         <span className="font-semibold text-xl tracking-tight">SRMNext</span>
      </div>

      <NavLink
         to={"/"}
         activeClassName={"underline"}
         className="block mt-2 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4"
         exact
      >
         Available Tickets
      </NavLink>

      <NavLink
         to={"/manage"}
         activeClassName={"underline"}
         className="block mt-2 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4"
      >
         My Tickets
      </NavLink>

      <NavLink
         to={"/parts"}
         activeClassName={"underline"}
         className="block mt-2 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4"
      >
         Parts Lookup
      </NavLink>

      <a
         href={
            "https://www.google.com/maps/d/u/2/viewer?ll=37.99581677180192%2C-122.04098581931868&z=9&mid=1d13LtxTrKnGI-RSrjDFo11SdXoB3YOMS"
         }
         target={"_blank"}
         className="block mt-2 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4"
      >
         SLA Awareness Map
      </a>
   </nav>
);

export default Navbar;
