import { CaseBase } from "../../features/cases/types";
import { caseStatusMapping } from "../../features/cases/constants";

export const caseInProgress = (c: CaseBase): boolean =>
   [
      caseStatusMapping.Enroute.whenReading,
      caseStatusMapping.Arrive.whenReading,
   ].includes(c.UserStatus);
