import * as React from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useState } from "react";
import classNames from "classnames";

interface CopierProps {
   text: string;
}

const Copier: React.FunctionComponent<CopierProps> = (props) => {
   const [copied, setCopied] = useState(false);

   return (
      <CopyToClipboard
         text={props.text}
         onCopy={() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 5000);
         }}
      >
         <span
            className={classNames({
               "cursor-default": copied,
               "cursor-pointer": !copied,
            })}
         >
            {copied ? "Copied!" : props.text}
         </span>
      </CopyToClipboard>
   );
};

export default Copier;
