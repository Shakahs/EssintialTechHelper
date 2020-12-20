import { createEntityAdapter } from "@reduxjs/toolkit";
import { CaseSummary } from "./types";

export const sliceName = "caseSlice";
export const caseAdapter = createEntityAdapter<CaseSummary>({
   selectId: (c) => c.Id,
});
