import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Operation, Parameter, Reference } from "../../models/swagger-schema-offcial";
import { OpenapiService } from "../../services/openapi.service";
import { isRef } from "../../services/is-ref";

@Component({
  selector: 'app-parameters',
  templateUrl: './parameters.component.html',
  styleUrls: ['./parameters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ParametersComponent {
  @Input() parameters?: Operation['parameters'];

  constructor(public openapiService: OpenapiService) {
  }

  isObject(val: any) {
    return typeof val === "object";
  }

  getParametersParsed(params: Operation['parameters']): Array<Parameter & { type: any }> | undefined {
    return params?.reduce((acc: Array<Parameter & { type: any }>, curr: Reference | Parameter) => {
      const param = isRef(curr) ? this.openapiService.getReference<Parameter>(curr) : curr;
      if (param.schema) {
        acc.push({ ...param, type: this.openapiService.getSchemaParsedValue(param.schema) });
      }
      return acc;
    }, [])
  }

}
