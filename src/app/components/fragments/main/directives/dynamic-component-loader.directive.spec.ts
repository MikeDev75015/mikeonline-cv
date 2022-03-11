import { ViewContainerRef } from '@angular/core';
import { DynamicComponentLoaderDirective } from './dynamic-component-loader.directive';

describe('DynamicComponentLoaderDirective', () => {
  it('should create an instance', () => {
    const viewContainerRef: ViewContainerRef = {} as ViewContainerRef;
    const directive = new DynamicComponentLoaderDirective(viewContainerRef);
    expect(directive).toBeTruthy();
  });
});
