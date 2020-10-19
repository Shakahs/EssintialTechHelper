import { CaseBase } from "../../api";
import { caseStatusMapping } from "../../constants";

export const caseInProgress = (c: CaseBase): boolean =>
   [
      caseStatusMapping.Enroute.whenReading,
      caseStatusMapping.Arrive.whenReading,
   ].includes(c.UserStatus);
