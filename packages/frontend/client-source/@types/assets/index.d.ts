declare module "*.svg" {
   import React = require("react");
   export const ReactComponent: React.SFC<React.SVGProps<SVGSVGElement>>;
   const src: string;
   export default src;
}

declare module "riteAidPartList.json" {
   export default interface parts {
      [k: string]: {
         description: string;
      };
   }
}
