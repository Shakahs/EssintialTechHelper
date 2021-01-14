import * as React from "react";
import { useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { buttonStyle } from "../../../constants";
import "react-tabs/style/react-tabs.css";
import Parts from "./Parts/Parts";
import EnsureFullCase from "../../utility/EnsureFullCase";
import CaseComments from "./CaseComments";
import CaseStatus from "./CaseStatus/CaseStatus";
import { CaseBase, CaseFull, CaseSummary } from "../../../features/cases/types";

interface CaseExtendedDataProps {
   subcase: CaseBase;
   refresh: () => void;
}

const CaseExtendedData: React.FunctionComponent<CaseExtendedDataProps> = (
   props
) => {
   return (
      <Tabs>
         <TabList>
            <Tab>ETA / Status / Checkout</Tab>
            <Tab>Comments / Details</Tab>
            <Tab>Parts</Tab>
         </TabList>

         <TabPanel forceRender>
            <CaseStatus subcase={props.subcase} refresh={props.refresh} />
         </TabPanel>
         <TabPanel>
            <EnsureFullCase sc={props.subcase}>
               <CaseComments sc={props.subcase} />
            </EnsureFullCase>
         </TabPanel>
         <TabPanel forceRender>
            <h2>
               <EnsureFullCase sc={props.subcase}>
                  <Parts subcase={props.subcase} />
               </EnsureFullCase>
            </h2>
         </TabPanel>
      </Tabs>
   );
};

export default CaseExtendedData;
