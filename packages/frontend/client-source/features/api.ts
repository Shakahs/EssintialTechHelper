import { APISession } from "./auth/types";

export interface ResultsObject<T> {
   Results: T[];
   ReturnCode: number;
   ReturnMessage: string;
}

export interface ResultsObjectDoubleWrapped<T extends ResultsObject<T>> {
   Results: T[][];
}

export interface GlossaryWord {
   code: string;
   dropdown: string;
   function: string;
   mandatory: string;
   mask: string;
   text: string;
   value: string;
}

export const apiBase = "https://srmbuddy.essintial.com/webapi/api";
export const defaultRequestHeaders = {
   "Content-Type": "application/json;charset=UTF-8",
};
export const buildRequestHeaders = (apiSession: APISession) => ({
   ...defaultRequestHeaders,
   Authorization: apiSession.SessionId,
});

export const timeFormatWhenUpdating = "LLL dd, yyyy hh:mm aa";
