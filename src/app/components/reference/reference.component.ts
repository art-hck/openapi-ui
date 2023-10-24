import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Reference } from "../../models/swagger-schema-offcial";
import { OpenapiService } from "../../services/openapi.service";
import { map, Subject, switchMap } from "rxjs";

@Component({
  selector: 'app-reference',
  templateUrl: './reference.component.html',
  styleUrls: ['./reference.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReferenceComponent {
  @Input() ref?: Reference;
  readonly loadRef$: Subject<void> = new Subject();
  readonly component$ = this.loadRef$
    .pipe(
      switchMap(() => this.openapiService.openApi$),
      map(api => this.ref?.$ref.split('/').slice(1).reduce((acc: any, curr) => acc[curr], api)));


  constructor(public openapiService: OpenapiService) {
  }

}
