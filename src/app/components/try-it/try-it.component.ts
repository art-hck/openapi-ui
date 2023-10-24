import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { catchError, map, Observable, of, Subject, switchMap } from "rxjs";
import { HttpClient, HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { AppMethod } from "../../models/app-method";
import { isRef } from "../../services/is-ref";
import { OpenapiService } from "../../services/openapi.service";
import { Parameter, Reference, RequestBody } from "../../models/swagger-schema-offcial";

@Component({
  selector: 'app-try-it',
  templateUrl: './try-it.component.html',
  styleUrls: ['./try-it.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TryItComponent {
  @Input() method?: AppMethod;

  readonly sendRequest$ = new Subject<AppMethod | undefined>();
  tryIt$?: Observable<HttpResponse<any> | HttpErrorResponse>;
  form?: FormGroup;
  bodyContentType?: string;

  get isPlain(): boolean {
    const response = this.method && Object.values(this.method.operation.responses ?? {})[0];
    return !isRef(response) && !!response?.content && Object.keys(response.content)[0] === 'text/plain';
  }

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private openapiService: OpenapiService,
    private cd: ChangeDetectorRef
  ) {
  }

  isError(response: HttpResponse<any> | HttpErrorResponse): response is HttpErrorResponse {
    return !!(response as HttpErrorResponse).error;
  }

  get parsedForm(): {[key: string]: any} {
    return Object.entries(this.form?.value ?? {}).reduce((acc, [k, v]) => {
      const val = Object.entries(v ?? {}).reduce((_acc, [_k, _v]) => ({ ..._acc, [_k]: _v.value }), {});
      return ({ ...acc, [k]: val });
    }, {});
  }

  ngOnChanges() {
    this.tryIt$ = this.sendRequest$.pipe(switchMap(method => {
      if (!method) return of(null);

      const path = method.path.split(/(\{\w+?})/g).map((v) => this.parsedForm['path'][v.replace(/\{(\w+?)}/g, '$1')] || v).join('');

      return this.http.request(method.method, `/remote${ path }`, {
        responseType: this.isPlain ? 'text' : 'json',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        params: this.parsedForm['query'],
        observe: 'response',
        ...(this.form?.get('body') ? { body: this.form?.get('body')?.value } : {})
      }).pipe(catchError(err => of(err)))
    }));

    this.form = this.fb.group({
      query: this.fb.group({}),
      path: this.fb.group({}),
      header: this.fb.group({}),
      cookie: this.fb.group({})
    });

    const requestBody = this.method?.operation.requestBody;

    if (requestBody) {
      this.addBodyControl(requestBody);
    }

    if (this.method?.operation.parameters) {
      this.method.operation.parameters.forEach(param => {
        if (!isRef(param)) {
          this.addParamControl(param);
        } else {
          this.openapiService.openApi$
            .pipe(map(api => param.$ref.split('/').slice(1).reduce((acc: any, curr) => acc[curr], api)))
            .subscribe(entity => this.addParamControl(entity));
        }
      });
    }

  }

  addBodyControl(body: RequestBody | Reference) {

    if (isRef(body)) {
      body = this.openapiService.getReference<RequestBody>(body);
    }

    this.bodyContentType = Object.keys(body.content)[0];

    const media = Object.values(body.content)?.[0];
    const schema = media?.schema;

    const json = media.example ?? media.examples?.[0] ?? (schema && this.openapiService.getSchemaExampleValue(schema));

    this.form?.addControl('body', this.fb.control(JSON.stringify(json, null, 2)))
    this.cd.detectChanges();
  }

  addParamControl(param: Parameter) {
    const form = (this.form?.get(param.in) as FormGroup);
    form.addControl(param.name, this.fb.group({ ...param, value: ['', param.required ? Validators.required : null] }));
  }
}
