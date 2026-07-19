declare module "shpjs" {
  import type { FeatureCollection, Geometry } from "geojson";

  type ShpResult =
    | FeatureCollection<Geometry>
    | FeatureCollection<Geometry>[];

  export default function shp(
    input: ArrayBuffer
  ): Promise<ShpResult>;
}
