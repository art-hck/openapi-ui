import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MediaType, Schema } from "../../models/swagger-schema-offcial";
import { OpenapiService } from "../../services/openapi.service";

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContentComponent {
  @Input() content?: { [key: string]: MediaType }

  constructor(private openapiService: OpenapiService) {
  }

  propertiesToObject(schema: Schema | Schema[]) {
    return Array.isArray(schema) ? schema.map(schema => this.openapiService.getSchemaParsedValue(schema)) : this.openapiService.getSchemaParsedValue(schema);
  }
}
