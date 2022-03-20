import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MockComponent } from 'ng2-mock-component';
import { AlertModule } from '../../../core/core-index';
import { LoadingDirective } from '../../../core/directives/loading.directive';
import { DataService } from '../../../shared/shared-index';

import { PortfolioComponent } from './portfolio.component';

describe('PortfolioComponent', () => {
  let component: PortfolioComponent;
  let fixture: ComponentFixture<PortfolioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PortfolioComponent,
        MockComponent({
          selector: 'app-portfolio-item',
          inputs: ['siteDemo'],
        }),
        MockComponent({
          selector: 'app-loading',
        }),
        LoadingDirective,
      ],
      providers: [
        { provide: DataService, useValue: {} },
      ],
      imports: [
        HttpClientTestingModule,
        BrowserAnimationsModule,
        AlertModule,
      ],
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
