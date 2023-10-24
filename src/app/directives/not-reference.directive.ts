import { Directive, EmbeddedViewRef, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { Reference } from "../models/swagger-schema-offcial";
import { isRef } from "../services/is-ref";

interface Context<T> {
  notReference: T;
}

type NonNull<T> = Exclude<T, undefined | null>;

@Directive({
  selector: '[notReference]'
})
export class NotReferenceDirective<T> {
  @Input() set notReference(val: T | Reference) {
    if (!this.embeddedViewRef && val !== undefined && val !== null && !isRef(val)) {
      this.embeddedViewRef = this.viewContainer.createEmbeddedView(this.templateRef, { notReference: val });
    }

    if(this.embeddedViewRef && isRef(val)) {
      this.viewContainer.clear();
      this.embeddedViewRef = undefined;
    }
  }

  private embeddedViewRef?: EmbeddedViewRef<Context<T>>;

  constructor(private templateRef: TemplateRef<Context<T>>, private viewContainer: ViewContainerRef) {
  }

  static ngTemplateGuard_notReference<T>(
      dir: NotReferenceDirective<T>,
      val: NonNull<T> | Reference
  ): val is NonNull<T> {
    return true;
  }

  static ngTemplateContextGuard<T>(
      dir: NotReferenceDirective<T>,
      ctx: any
  ): ctx is Context<NonNull<T>> {
    return true;
  }
}
