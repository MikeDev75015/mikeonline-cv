import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule, Optional, Provider, SkipSelf } from '@angular/core';

const importList = [
  CommonModule,
];

const providerList: Provider[] = [];

@NgModule({
  declarations: [],
  imports: [
    importList,
  ],
})
export class CoreModule {
  /**
   * Prevents the CoreModule to be imported twice
   *
   * @param parentModule CoreModule if it exists from the parent scope of Dependency Injection.
   * @throws an Error, if it resolves a CoreModule from the parent DI scope.
   */
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('You are trying to import the CoreModule twice (already loaded)');
    }
  }

  /**
   * The root {@link AppModule} imports the {@link CoreModule} and adds the `providers` to the {@link AppModule}
   * providers. Recommended in the
   * [Angular 2 docs - CoreModule.forRoot](https://angular.io/docs/ts/latest/guide/ngmodule.html#core-for-root)
   */
  static forRoot(): ModuleWithProviders<any> {
    return {
      ngModule: CoreModule,
      providers: providerList,
    };
  }
}
