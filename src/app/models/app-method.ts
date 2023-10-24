import { Operation, PathItem } from "./swagger-schema-offcial";

export interface AppMethod {
  path: string,
  method: keyof PathItem,
  operation: Operation
}
