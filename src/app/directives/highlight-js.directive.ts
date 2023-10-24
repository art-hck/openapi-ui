import { Directive, ElementRef } from '@angular/core';
import hljs from "highlight.js";

@Directive({
    selector: '[appHighlightJs], .code'
})
export class HighlightJsDirective {

    constructor(private el: ElementRef<HTMLElement>) {
    }

    ngAfterContentInit() {
        hljs.highlightElement(this.el.nativeElement);
    }
}
