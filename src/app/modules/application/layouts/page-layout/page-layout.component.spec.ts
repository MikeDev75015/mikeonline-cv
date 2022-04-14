import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingComponent } from '../../../../core/components/loading/loading.component';
import { LoadingDirective } from '../../../../core/directives/loading/loading.directive';

import { PageLayoutComponent } from './page-layout.component';

describe('PageLayoutComponent', () => {
  let component: PageLayoutComponent;
  let fixture: ComponentFixture<PageLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
      ],
      declarations: [
        PageLayoutComponent,
        LoadingDirective,
        LoadingComponent,
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageLayoutComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.sectionId = 'TEST';
    component.pageTitle = 'Toto';
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  test.each([
    ['sectionId is invalid', '', 'TEST'],
    ['pageTitle is invalid', 'Toto', undefined as unknown as string],
  ])('should throw an error if %s', (name: string, sectionId: string, pageTitle: string) => {
    component.sectionId = sectionId;
    component.pageTitle = pageTitle;
    expect(() => fixture.detectChanges()).toThrowError('sectionId and/or pageTitle are missing or invalid');
  });
});
