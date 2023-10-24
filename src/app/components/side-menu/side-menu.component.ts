import { ChangeDetectionStrategy, Component, HostListener, Input } from '@angular/core';
import { AppMethod } from "../../models/app-method";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SideMenuComponent {
  @Input() methods?: Array<AppMethod & { index: number }>;
  @HostListener('keydown.ArrowDown', ['$event']) down(e: KeyboardEvent) {
    if(!this.methods) return;
    e.preventDefault();
    const i = this.methods.findIndex(m => m.index === +this.route.snapshot.queryParams['index'] ?? 0);
    if (i > -1 && this.methods[i + 1]) {
      this.router.navigate(['.'], {
        queryParams: { index: this.methods[i + 1].index },
        queryParamsHandling: "merge"
      });
    }
  }

  @HostListener('keydown.ArrowUp', ['$event']) up(e: KeyboardEvent) {
    if(!this.methods) return;
    e.preventDefault();
    const i = this.methods.findIndex(m => m.index === +this.route.snapshot.queryParams['index'] ?? 0);
    if(!this.methods) return;
    if (i && this.methods[i - 1]) {
      this.router.navigate(['.'], {
        queryParams: { index: this.methods[i - 1].index },
        queryParamsHandling: "merge"
      });
    }
  }

  constructor(public route: ActivatedRoute, private router: Router) {
  }

  trackBy(index: number, method: AppMethod & {index: number}) {
    return method.index;
  }
}