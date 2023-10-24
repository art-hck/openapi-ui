import { Reference } from "../models/swagger-schema-offcial";

export function isRef(val: unknown): val is Reference {
  return !!(val as Reference)?.$ref;
}
