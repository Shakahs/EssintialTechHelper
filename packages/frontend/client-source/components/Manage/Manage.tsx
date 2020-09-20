import * as React from "react";
import { RootState } from "../../rootReducer";
import { useSelector, useDispatch } from "react-redux";

interface ManageProps {}

const Manage: React.FunctionComponent<ManageProps> = (props) => {
   const { SessionID } = useSelector((state: RootState) => state.manageTickets);
   return <div>SessionID: {SessionID}</div>;
};

export default Manage;
