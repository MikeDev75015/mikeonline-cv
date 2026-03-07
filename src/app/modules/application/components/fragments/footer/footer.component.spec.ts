import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from '../../../../../../test/ng2-mock-component-compat';
import { dataServiceMock } from '../../../../../../../__mocks__/services/data-service.mock';
import { LoadingDirective } from '../../../../../core/directives/loading/loading.directive';
import { DataService } from '../../../../../shared';

import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        FooterComponent,
        MockComponent({
          selector: 'app-loading',
        }),
        LoadingDirective,
      ],
      providers: [
        { provide: DataService, useValue: dataServiceMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
