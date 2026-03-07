import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[dynamicComponentLoader]',
    standalone: false
})
export class DynamicComponentLoaderDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
