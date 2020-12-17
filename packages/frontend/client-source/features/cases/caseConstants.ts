import { createEntityAdapter } from "@reduxjs/toolkit";
import { CaseSummary } from "../../api";

export const sliceName = "caseSlice";
export const caseAdapter = createEntityAdapter<CaseSummary>({
   selectId: (c) => c.Id,
});
