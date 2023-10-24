import { Directive, ElementRef, Input } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs";

@Directive({
  selector: '[appIcon]'
})
export class IconDirective {
  @Input() appIcon!: string;

  constructor(
    private httpClient: HttpClient,
    private el: ElementRef<HTMLElement>
  ) {
  }

  ngOnInit() {
    this.httpClient.get(this.appIcon, { responseType: 'text' }).pipe(map(svg => {
      const div = document.createElement('DIV');
      div.innerHTML = svg;
      return div.querySelector('svg')!;
    })).subscribe(icon => {
      icon.dataset['svgIcon'] = '';
      this.el.nativeElement.appendChild(icon);
    });
  }
}
