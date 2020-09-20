import * as React from "react";

interface BooleanDisplayProps {
   if: boolean;
   children: React.ReactNode;
}

const Bool: React.FC<BooleanDisplayProps> = (props) => (
   <>{props.if && props.children}</>
);

export default Bool;
