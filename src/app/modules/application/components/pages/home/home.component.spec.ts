import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng2-mock-component';
import { storeMock } from '../../../../../../../__mocks__/services/store.mock';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        HomeComponent,
        MockComponent({
          selector: 'app-page-layout',
          inputs: ['pageTitle', 'isLoadingData$', 'scrollSection'],
        }),
        MockComponent({
          selector: 'app-skills-radar-chart',
        }),
      ],
      imports: [
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: Store, useValue: storeMock },
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
