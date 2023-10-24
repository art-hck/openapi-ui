import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { auditTime, debounceTime, delay, map, Observable, Subject, switchMap, takeUntil, timer } from "rxjs";
import { OpenapiService } from "./services/openapi.service";
import { AppMethod } from "./models/app-method";
import { SearchService } from "./services/search.service";

@Component({
  selector: 'app-root',
  styleUrls: ['app.component.scss'],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {

  readonly selectedMethod$: Observable<AppMethod> = this.openapiService.methods$.pipe(
    switchMap((methods) => this.route.queryParams.pipe(map(p => methods[p['index']]), debounceTime(100)))
  );

  readonly selectedMethodResponses$ = this.selectedMethod$.pipe(map(method => {
    return Object.entries(method?.operation.responses ?? {}).map(([key, value]) => ({ key, value }))
  }));

  readonly menuItems$: Observable<Array<AppMethod & { index: number }>> = this.openapiService.methods$.pipe(
    map(methods => methods.map((method, index) => ({ ...method, index }))),
    switchMap(methods => this.route.queryParams.pipe(map(({ q }) => methods.filter(method => !q || method.path.includes(q)))))
  );

  constructor(
    public openapiService: OpenapiService,
    public searchService: SearchService,
    private route: ActivatedRoute
  ) {
  }
}
