import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { map, Observable, shareReplay } from "rxjs";
import {
  OpenAPI,
  Operation,
  Parameter,
  ParameterType,
  PathItem,
  Reference,
  Schema
} from "../models/swagger-schema-offcial";
import { AppMethod } from "../models/app-method";
import { isRef } from "./is-ref";
import { SchemaTree } from "../models/schema-tree";

type Types = Record<ParameterType, (schema: Schema, parent?: SchemaTree) => unknown>;

@Injectable({ providedIn: 'root' })
export class OpenapiService {
  readonly openApi$ = this.http.get<OpenAPI>('assets/swagger.json').pipe(shareReplay(1));
  readonly methods$: Observable<AppMethod[]> = this.openApi$
    .pipe(map(doc => {
      return Object
        .entries(doc.paths ?? {})
        .reduce((acc: any[], [pathKey, path]) => [
          ...acc,
          ...Object.keys(path)
            .filter(methodKey => ['get', 'post', 'put', 'delete', 'patch'].includes(methodKey as keyof PathItem))
            .map(methodKey => ({
              path: pathKey,
              method: methodKey,
              operation: path[methodKey as keyof PathItem],
            }), [])
        ], [])
    }));
  openApi?: OpenAPI;

  constructor(private http: HttpClient) {
    this.openApi$.subscribe(openApi => this.openApi = openApi);
  }

  getReference<T>({ $ref }: Reference): T {
    return $ref.split('/').slice(1).reduce((acc: any, curr) => acc[curr], this.openApi);
  }


  getSchemaExampleValue(schema: Schema | Reference, parent?: SchemaTree): any {
    const types: Types = {
      "string": (schema) => schema?.enum?.[0] ?? "string",
      "boolean": () => true,
      "integer": () => 0,
      "number": () => 0,
      "file": () => undefined, // @TODO: implements
      "array": ({ items }) => {
        const tree = new SchemaTree(Array.isArray(items) ? items[0] : items);
        if (parent) tree.setParent(parent);

        const arraySchema = isRef(items) ? this.getReference<Schema>(items) : Array.isArray(items) ? items[0] : items;
        return arraySchema ? [this.getSchemaExampleValue(arraySchema, tree)] : []
      },
      "object": ({ properties }: Schema) => Object.entries(properties ?? {})
        .reduce((acc, [propName, propSchema]) => ({
          ...acc,
          [propName]: this.getSchemaExampleValue(propSchema, parent)
        }), {})

    };
    return this.getSchemaParsed(schema, types, parent);
  }

  getSchemaParsedValue(schema: Schema | Reference, parent?: SchemaTree): any {
    const types: Types = {
      "string": schema => schema.enum ? schema.enum.join(" | ") : "string" + (schema.format ? ` [${ schema.format }]` : ''),
      "boolean": () => "boolean",
      "integer": () => "integer",
      "number": () => "integer",
      "file": () => "file",
      "array": ({ items }, parent?: SchemaTree) => {
        const tree = new SchemaTree(Array.isArray(items) ? items[0] : items);
        if (parent) tree.setParent(parent);

        const arraySchema = isRef(items) ? this.getReference<Schema>(items) : Array.isArray(items) ? items[0] : items;
        return arraySchema ? [this.getSchemaParsedValue(arraySchema, tree)] : []
      },
      "object": ({ properties }: Schema, parent) => Object.entries(properties ?? {})
        .reduce((acc, [propName, propSchema]) => ({
          ...acc,
          [propName]: this.getSchemaParsedValue(propSchema, parent)
        }), {})
    };

    return this.getSchemaParsed(schema, types, parent);
  }

  getSchemaParsed(schema: Schema | Reference, types: Types, parent?: SchemaTree): any {
    const tree = new SchemaTree(schema);

    if (parent) tree.setParent(parent);

    const recursive = tree?.isRecursive();

    if (recursive) {
      return recursive.payload;
    }

    if (isRef(schema)) {
      return this.getSchemaParsed(this.getReference<Schema>(schema), types, parent);
    }

    schema.type = schema.type ?? (schema.properties && 'object');

    if (schema.allOf) {
      return Object.values(schema.allOf).reduce((acc, curr) => ({ ...acc, ...this.getSchemaParsed(curr, types, parent) }), {})
    } else if (schema.anyOf || schema.oneOf) {
      return this.getSchemaParsed(Object.values(schema.anyOf! || schema.oneOf!)[0], types, parent);
    } else {
      return schema.type ? types[schema.type](schema, parent) : null
    }
  }
}


