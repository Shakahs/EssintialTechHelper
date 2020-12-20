import { DecodePartSequenceNumber } from "./types";

export const decodeLogisticsSequenceNumber = (
   f: string
): DecodePartSequenceNumber => {
   const split = f.split("*");
   return {
      masterSequence: split[0],
      counter: split[1],
      partNumber: split[2],
   };
};
