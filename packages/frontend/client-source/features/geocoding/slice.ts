import { createSlice, EntityState, PayloadAction } from "@reduxjs/toolkit";
import { CaseSummary } from "../cases/types";
import { Feature, Point } from "geojson";
import { geocodingAdapter, sliceName } from "./constants";
import { GeocodingWrapper } from "./types";

interface stateShape {
   geocoding: EntityState<GeocodingWrapper>;
}

const initialState: stateShape = {
   geocoding: geocodingAdapter.getInitialState(),
};

export const geocodingSlice = createSlice({
   name: sliceName,
   initialState,
   reducers: {
      upsertGeocoding(state, action: PayloadAction<GeocodingWrapper>) {
         geocodingAdapter.upsertOne(state.geocoding, action.payload);
      },
   },
});

export const { upsertGeocoding } = geocodingSlice.actions;

export const { reducer: geocodingReducer } = geocodingSlice;
