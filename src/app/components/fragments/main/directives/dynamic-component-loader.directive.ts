import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[dynamicComponentLoader]'
})
export class DynamicComponentLoaderDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
