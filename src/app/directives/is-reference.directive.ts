import { Directive, EmbeddedViewRef, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { Reference } from "../models/swagger-schema-offcial";
import { isRef } from "../services/is-ref";

interface Context {
  isReference: Reference;
}

@Directive({
  selector: '[isReference]'
})
export class IsReferenceDirective<T> {
  @Input() set isReference(val: T | Reference) {
    if (!this.embeddedViewRef && isRef(val)) {
      this.embeddedViewRef = this.viewContainer.createEmbeddedView(this.templateRef, { isReference: val });
    }

    if(this.embeddedViewRef && !isRef(val)) {
      this.viewContainer.clear();
      this.embeddedViewRef = undefined;
    }
  }

  private embeddedViewRef?: EmbeddedViewRef<Context>;

  constructor(private templateRef: TemplateRef<Context>, private viewContainer: ViewContainerRef) {
  }

  static ngTemplateGuard_isReference<T>(
      dir: IsReferenceDirective<T>,
      val: T | Reference
  ): val is Reference {
    return true;
  }

  static ngTemplateContextGuard<T>(
      dir: IsReferenceDirective<T>,
      ctx: any
  ): ctx is Context {
    return true;
  }


}
