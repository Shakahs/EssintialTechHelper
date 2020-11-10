import * as React from "react";

interface BooleanDisplayProps {
   if: boolean;
   children: () => React.ReactNode;
}

const BoolFunc: React.FC<BooleanDisplayProps> = (props) => (
   <>{props.if && props.children()}</>
);

export default BoolFunc;
