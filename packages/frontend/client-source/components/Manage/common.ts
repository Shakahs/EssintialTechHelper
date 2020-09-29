import { CaseSummary } from "../../api";
import { caseStatusMapping } from "../../constants";

export const caseInProgress = (c: CaseSummary): boolean =>
   [
      caseStatusMapping.Enroute.whenReading,
      caseStatusMapping.Arrive.whenReading,
   ].includes(c.UserStatus);
