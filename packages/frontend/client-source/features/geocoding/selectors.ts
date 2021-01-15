import { caseAdapter } from "../cases/caseConstants";
import { RootState } from "../rootReducer";
import { geocodingAdapter } from "./constants";

const builtinSelectors = geocodingAdapter.getSelectors<RootState>(
   (state) => state.geocodingSlice.geocoding
);

export const allGeocoding = (state: RootState) =>
   builtinSelectors.selectEntities(state);

export const allGeocodingList = (state: RootState) =>
   builtinSelectors.selectAll(state);
