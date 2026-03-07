import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[appDynamicComponentLoader]',
    standalone: false
})
export class DynamicComponentLoaderDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
