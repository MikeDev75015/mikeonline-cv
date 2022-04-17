import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { LoadingComponent } from './component/loading.component';

/**
 * Structural directive that replace the template reference by the loading component
 */
@Directive({
  selector: '[appLoading]',
})
export class LoadingDirective {
  /**
   * @ignore
   * @param viewContainerRef
   * @param templateRef
   */
  constructor(
    private readonly viewContainerRef: ViewContainerRef,
    private readonly templateRef: TemplateRef<any>,
  ) {
  }

  /**
   * Setter that handles the input of the structural directive.
   *
   * @param isLoading Boolean that tells if the component needs to be displayed or if the loading component is required
   */
  @Input() set appLoading(isLoading: any) {
    this.viewContainerRef.clear();
    if (!isLoading) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainerRef.createComponent(LoadingComponent);
    }
  }
}
