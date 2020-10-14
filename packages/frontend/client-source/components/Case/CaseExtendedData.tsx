import * as React from "react";
import { useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { buttonStyle } from "../../constants";
import "react-tabs/style/react-tabs.css";
import CasePartsList from "./CasePartsList";
import { CaseBase } from "../../api";
import EnsureFullCase from "../utility/EnsureFullCase";
import CaseComments from "./CaseComments";

interface CaseExtendedDataProps {
   subcase: CaseBase;
}

const CaseExtendedData: React.FunctionComponent<CaseExtendedDataProps> = (
   props
) => {
   return (
      <Tabs>
         <TabList>
            <Tab>ETA / Status</Tab>
            <Tab>Comments / Details</Tab>
            <Tab>Parts</Tab>
         </TabList>

         <TabPanel>
            <h2>Any content 1</h2>
         </TabPanel>
         <TabPanel>
            <EnsureFullCase sc={props.subcase}>
               <CaseComments sc={props.subcase} />
            </EnsureFullCase>
         </TabPanel>
         <TabPanel>
            <h2>
               <CasePartsList subcase={props.subcase} />
            </h2>
         </TabPanel>
      </Tabs>
   );
};

export default CaseExtendedData;
