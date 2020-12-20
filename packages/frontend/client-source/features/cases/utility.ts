import { CaseBase, CaseStatusMapping, DecodedCaseNumber } from "./types";
import { zonedTimeToUtc } from "date-fns-tz";
import { find } from "lodash";
import { caseStatusMapping } from "./constants";

export function isCaseProjectWork(sb: CaseBase): boolean {
   return ["IMACD", "project"].includes(sb.ProblemCode);
}

export const parseCaseSLA = (datestring: string): Date =>
   zonedTimeToUtc(datestring, Intl.DateTimeFormat().resolvedOptions().timeZone);
export const decodeCaseNumber = (c: string): DecodedCaseNumber => {
   const split = c.split("-");
   return {
      original: c,
      masterCase: split[0],
      subcaseCounter: split[1],
   };
};

export const findCaseStatusName = (cs: CaseBase): CaseStatusMapping => {
   return find(
      caseStatusMapping,
      (possStatus) => cs.UserStatus === possStatus.whenReading
   );
};
