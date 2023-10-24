export type ParameterType = "string" | "number" | "integer" | "boolean" | "array" | "object" | "file";

export interface OpenAPI {
  openapi: string;
  info: Info;
  jsonSchemaDialect?: string;
  servers?: Server[];
  paths?: Paths;
  webhooks?: { [key: string]: PathItem | Reference };
  components?: Components;
  security?: SecurityRequirement[];
  tags?: Tag[];
  externalDocs?: ExternalDocumentation;
}

export interface Info {
  title: string;
  summary?: string;
  description?: string;
  termsOfService?: string;
  contact?: Contact;
  license?: License;
  version: string
}

export interface Contact {
  name?: string;
  url?: string;
  email?: string;
}

export interface License {
  name: string;
  identifier?: string;
  url?: string;
}

export interface Server {
  url: string;
  description?: string;
  variables?: { [key: string]: ServerVariable };
}

export interface ServerVariable {
  enum?: [string, ...string[]]; // non empty array of strings
  default: string;
  description?: string;
}

export interface Components {
  schemas?: { [key: string]: Schema };
  responses?: { [key: string]: Response | Reference };
  parameters?: { [key: string]: Parameter | Reference };
  examples?: { [key: string]: Example | Reference };
  requestBodies?: { [key: string]: RequestBody | Reference };
  headers?: { [key: string]: Header | Reference };
  securitySchemes?: { [key: string]: SecurityScheme | Reference };
  links?: { [key: string]: Link | Reference };
  callbacks?: { [key: string]: Callback | Reference };
  pathItems?: { [key: string]: PathItem | Reference };
}

export interface Paths {
  [path: string]: PathItem;
}

export interface PathItem {
  $ref?: string;
  summary?: string;
  description?: string;
  get?: Operation;
  put?: Operation;
  post?: Operation;
  delete?: Operation;
  options?: Operation;
  head?: Operation;
  patch?: Operation;
  trace?: Operation;
  servers?: Server[];
  parameters?: Array<Parameter | Reference>;
}

export interface Operation {
  tags?: string;
  summary?: string;
  description?: string;
  externalDocs?: ExternalDocumentation;
  operationId?: string
  parameters?: Array<Parameter | Reference>
  requestBody?: RequestBody | Reference;
  responses?: Responses;
  callbacks?: { [key: string]: Callback | Reference };
  deprecated?: boolean;
  security?: SecurityRequirement[];
  servers?: Server[];
}

export interface ExternalDocumentation {
  description?: string;
  url: string;
}

export type Parameter = BaseParameter | QueryParameter | PathParameter;

interface BaseParameter {
  name: string;
  in: "query" | "header" | "path" | "cookie";
  description?: string;
  required?: boolean;
  deprecated?: boolean;

  style?: string;
  explode?: boolean;
  allowReserved?: boolean;
  schema?: Schema;
  example?: any;
  examples?: { [key: string]: any }
}

interface QueryParameter extends BaseParameter {
  in: "query";
  allowEmptyValue?: boolean;
}

interface PathParameter extends BaseParameter {
  in: "path";
  deprecated: boolean;
}

export interface RequestBody {
  description?: string;
  content: { [key: string]: MediaType };
  required?: boolean
}

export interface MediaType {
  schema?: Schema;
  example?: any;
  examples?: { [key: string]: Example | Reference };
  encoding?: { [key: string]: Encoding };
}

export interface Encoding {
  contentType?: string;
  headers?: { [key: string]: Header | Reference };
  style?: string;
  explode?: boolean;
  allowReserved?: boolean;

}

export interface Responses {
  [key: string]: Response | Reference;
}

export interface Response {
  description: string;
  headers?: { [key: string]: Header | Reference };
  content?: { [key: string]: MediaType };
  links?: { [key: string]: Link | Reference };
}

export interface Callback {
  [key: string]: PathItem | Reference;
}

export interface Example {
  summary: string;
  description: string;
  value?: any;
  externalValue?: string;
}

export interface Link {
  operationRef?: string;
  operationId?: string
  parameters?: { [key: string]: any }
  requestBody?: any;
  description?: string;
  server?: Server;
}

type Header = Omit<BaseParameter, 'in' | 'name'>;


export interface SecurityRequirement {
  [key: string]: string[];
}

export interface Tag {
  name: string;
  description?: string;
  externalDocs?: ExternalDocumentation;
}


export interface Reference {
  $ref: string;
  summary?:	string;
  description?:	string;
}

export type BaseSchema = {
  type?: ParameterType;
  format?: string;
  title?: string;
  description?: string;
  default?: any;
  multipleOf?: number;
  maximum?: number;
  exclusiveMaximum?: boolean;
  minimum?: number;
  exclusiveMinimum?: boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
  maxProperties?: number;
  minProperties?: number;
  enum?: any[];
  items?: Schema | Schema[] | Reference;
};

export interface Schema extends BaseSchema {
  $ref?: string;
  allOf?: Schema[];
  oneOf?: Schema[];
  anyOf?: Schema[];
  additionalProperties?: Schema | boolean;
  properties?: { [key: string]: Schema };
  discriminator?:	Discriminator;
  readOnly?: boolean;
  xml?:	XML;
  externalDocs?:	ExternalDocumentation;
  /**
   * @deprecated
   */
  example?:	any;
  required?: string[];
}

export interface Discriminator {
  propertyName: string,
  mapping?: { [key: string]: string }
}

export interface XML {
  name?: string;
  namespace?: string;
  prefix?: string;
  attribute?: boolean;
  wrapped?: boolean;
}


export interface BaseSecurity {
  type: "basic" | "apiKey" | "oauth2";
  description?: string | undefined;
}

export interface BasicAuthenticationSecurity extends BaseSecurity {
  type: "basic";
}

export interface ApiKeySecurity extends BaseSecurity {
  type: "apiKey";
  name: string;
  in: "query" | "header";
}

export interface BaseOAuthSecurity extends BaseSecurity {
  type: "oauth2";
  flow: "accessCode" | "application" | "implicit" | "password";
  scopes?: OAuthScope | undefined;
}

export interface OAuth2ImplicitSecurity extends BaseOAuthSecurity {
  type: "oauth2";
  flow: "implicit";
  authorizationUrl: string;
}

export interface OAuth2PasswordSecurity extends BaseOAuthSecurity {
  type: "oauth2";
  flow: "password";
  tokenUrl: string;
}

export interface OAuth2ApplicationSecurity extends BaseOAuthSecurity {
  type: "oauth2";
  flow: "application";
  tokenUrl: string;
}

export interface OAuth2AccessCodeSecurity extends BaseOAuthSecurity {
  type: "oauth2";
  flow: "accessCode";
  tokenUrl: string;
  authorizationUrl: string;
}

export interface OAuthScope {
  [scopeName: string]: string;
}

export type SecurityScheme =
  | BasicAuthenticationSecurity
  | OAuth2AccessCodeSecurity
  | OAuth2ApplicationSecurity
  | OAuth2ImplicitSecurity
  | OAuth2PasswordSecurity
  | ApiKeySecurity;
