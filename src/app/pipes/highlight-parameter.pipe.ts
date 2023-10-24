import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";

@Pipe({
  name: 'highlightParameter'
})
export class HighlightParameterPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {
  }

  transform(value: string, q: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(value
      .replace(q, `<span class="bold">${ q }</span>`)
      .replace(/({.*?})/g, '<span class="secondary">$1</span>')
    );
  }
}
