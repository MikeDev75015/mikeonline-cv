import { TemplateRef, ViewContainerRef } from '@angular/core';
import { LoadingDirective } from './loading.directive';

describe('LoadingDirective', () => {
  const viewContainerRef: ViewContainerRef = {
    clear: vi.fn(),
    createEmbeddedView: vi.fn(),
    createComponent: vi.fn(),
  } as unknown as ViewContainerRef;
  const templateRef: TemplateRef<any> = {} as TemplateRef<any>;
  const directive = new LoadingDirective(viewContainerRef, templateRef);

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  describe('set appLoading', () => {
    it('should clear and create embedded view if isLoading is false', () => {
      directive.appLoading = false;
      expect(viewContainerRef.clear).toHaveBeenCalledTimes(1);
      expect(viewContainerRef.createEmbeddedView).toHaveBeenCalledTimes(1);
    });

    it('should clear and create component if isLoading is true', () => {
      directive.appLoading = true;
      expect(viewContainerRef.clear).toHaveBeenCalledTimes(1);
      expect(viewContainerRef.createComponent).toHaveBeenCalledTimes(1);
    });
  });
});
