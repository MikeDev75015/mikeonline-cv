import { TemplateRef, ViewContainerRef } from '@angular/core';
import { LoadingDirective } from './loading.directive';

describe('LoadingDirective', () => {
  it('should create an instance', () => {
    const viewContainerRef: ViewContainerRef = {} as ViewContainerRef;
    const templateRef: TemplateRef<any> = {} as TemplateRef<any>;
    const directive = new LoadingDirective(viewContainerRef, templateRef);
    expect(directive).toBeTruthy();
  });
});
