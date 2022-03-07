import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import { AlertModule } from '../../../core/core-index';
import { DataService } from '../../../shared/shared-index';

import {PortfolioComponent} from './portfolio.component';
import {MockComponent} from 'ng2-mock-component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('PortfolioComponent', () => {
  let component: PortfolioComponent;
  let fixture: ComponentFixture<PortfolioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PortfolioComponent,
        MockComponent({
          selector: 'app-portfolio-item',
          inputs: ['siteDemo']
        })
      ],
      providers: [
        { provide: DataService, useValue: {} },
      ],
      imports: [
        HttpClientTestingModule,
        BrowserAnimationsModule,
        AlertModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    TestBed.get(DataService);
    fixture = TestBed.createComponent(PortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
