import * as React from "react";
import Refresh from "../assets/refresh.svg";

interface LoadingIconProps {}

const LoadingIcon: React.FunctionComponent<LoadingIconProps> = (props) => (
   <img src={Refresh} className={"animate-spin inline"} />
);

export default LoadingIcon;
