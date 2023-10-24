import { Injectable } from '@angular/core';
import { FormControl } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { debounceTime, filter, take } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  readonly control = new FormControl();

  constructor(
    public route: ActivatedRoute,
    private router: Router
  ) {

    this.route.queryParams.pipe(filter(p => p['q']), take(1)).subscribe(params => {
      this.control.setValue(params['q'], { emitEvent: false })
    });

    this.control.valueChanges.pipe(debounceTime(100))
      .subscribe(q => this.router.navigate(['.'], {
        queryParams: { q },
        queryParamsHandling: "merge"
      }));
  }
}
