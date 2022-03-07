import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import { AlertModule } from '../../../../core/core-index';
import { DataService, IncompressibleSpacePipe } from '../../../../shared/shared-index';

import {ExperienceItemComponent} from './experience-item.component';
import {MockComponent} from 'ng2-mock-component';
import {MomentModule} from 'angular2-moment';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('ExperienceItemComponent', () => {
  let component: ExperienceItemComponent;
  let fixture: ComponentFixture<ExperienceItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ExperienceItemComponent,
        IncompressibleSpacePipe,
        MockComponent({
          selector: 'app-experience-item-detail',
          inputs: ['detail']
        })
      ],
      imports: [
        MomentModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        AlertModule
      ],
      providers: [
        { provide: DataService, useValue: {} },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExperienceItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
