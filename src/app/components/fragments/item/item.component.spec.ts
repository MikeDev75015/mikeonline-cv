import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockComponent } from 'ng2-mock-component';
import { animationServiceMock } from '../../../__mocks__/services/animation-service.mock';
import { utilsServiceMock } from '../../../__mocks__/services/utils-service.mock';
import { AlertModule } from '../../../core/core-index';
import { AnimationsService } from '../../../core/services/animations/animations.service';
import { IncompressibleSpacePipe, UtilsService } from '../../../shared/shared-index';

import { ItemComponent } from './item.component';

describe('ItemComponent', () => {
  let component: ItemComponent;
  let fixture: ComponentFixture<ItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ItemComponent,
        IncompressibleSpacePipe,
        MockComponent({
          selector: 'app-experience-item-detail',
          inputs: ['detail'],
        }),
        MockComponent({
          selector: 'app-item-dates',
          inputs: ['item'],
        }),
        MockComponent({
          selector: 'app-item-tag-list',
          inputs: ['tagList'],
        }),
        MockComponent({
          selector: 'app-item-open-close-buttons',
          inputs: ['enableOpenCloseButtons', 'masked', 'opened', 'btnOpen'],
        }),
      ],
      imports: [
        NoopAnimationsModule,
        HttpClientTestingModule,
        AlertModule,
      ],
      providers: [
        { provide: AnimationsService, useValue: animationServiceMock },
        { provide: UtilsService, useValue: utilsServiceMock },
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
