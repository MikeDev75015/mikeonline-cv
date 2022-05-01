import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { dataServiceMock } from '../../../../../../../__mocks__/services/data-service.mock';
import { storeMock } from '../../../../../../../__mocks__/services/store.mock';
import { DataService, HeaderTitleFormatPipe } from '../../../../../shared';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        HeaderComponent,
        HeaderTitleFormatPipe,
      ],
      providers: [
        { provide: DataService, useValue: dataServiceMock },
        { provide: Store, useValue: storeMock },
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
