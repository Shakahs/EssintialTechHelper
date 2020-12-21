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
            className={classNames("text-sm ", {
               "cursor-default": copied,
               "cursor-pointer": !copied,
            })}
         >
            {copied ? "(Copied...)" : "(Copy to Clipboard)"}
         </span>
      </CopyToClipboard>
   );
};

export default Copier;
