import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatExpansionModule } from '@angular/material/expansion';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MockComponent } from 'ng2-mock-component';
import { dataServiceMock } from '../../../__mocks__/services/data-service.mock';
import { LoadingDirective } from '../../../core/directives/loading.directive';
import { DataService } from '../../../shared/shared-index';

import { InterestsComponent } from './interests.component';

describe('InterestsComponent', () => {
  let component: InterestsComponent;
  let fixture: ComponentFixture<InterestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        InterestsComponent,
        MockComponent({
          selector: 'app-vertical-accordion',
          inputs: [
            'verticalAccordionContainerClass',
            'verticalAccordionItemClass',
            'itemList',
            'options',
          ],
        }),
        MockComponent({
          selector: 'app-loading',
        }),
        LoadingDirective,
      ],
      providers: [
        { provide: DataService, useValue: dataServiceMock },
      ],
      imports: [
        BrowserAnimationsModule,
        MatExpansionModule,
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
