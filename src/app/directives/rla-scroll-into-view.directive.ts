import { Directive, ElementRef } from '@angular/core';
import { RouterLinkActive } from "@angular/router";
import { filter } from "rxjs";

@Directive({
  selector: '[appRlaScrollIntoView][routerLinkActive]'
})
export class RlaScrollIntoViewDirective {

  constructor(
    private rla: RouterLinkActive,
    private ref: ElementRef<HTMLElement>
  ) {
    // this.rla.isActiveChange.pipe(
    //   filter(isActive => {
    //     const { bottom, top } = this.ref.nativeElement.getBoundingClientRect();
    //     const parentTop = this.getScrollParent(this.ref.nativeElement)?.getBoundingClientRect()?.top ?? 0;
    //
    //     return isActive && (bottom > window.innerHeight || top < parentTop)
    //   })
    // ).subscribe(() => {
    //   this.ref.nativeElement.scrollIntoView({ block: "center", behavior: "smooth" })
    // });
  }

  private getScrollParent(node: HTMLElement | null): HTMLElement | null {
    return node === null || node.scrollHeight > node.clientHeight ? node : this.getScrollParent(node.parentNode as HTMLElement);
  }
}
