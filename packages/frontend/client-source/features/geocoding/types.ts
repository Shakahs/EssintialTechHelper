import { Feature, Point } from "geojson";

export interface GeocodingWrapper {
   id: string;
   feature: Feature<Point>;
}
