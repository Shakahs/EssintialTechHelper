import { createEntityAdapter } from "@reduxjs/toolkit";
import { CaseSummary } from "../cases/types";
import { GeocodingWrapper } from "./types";

export const sliceName = "geocodingSlice";

export const geocodingAdapter = createEntityAdapter<GeocodingWrapper>();
