import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PortfolioComponent} from './portfolio.component';
import {MockDataService} from '../../services/mock-data.service';
import {MockComponent} from 'ng2-mock-component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AlertModule} from '../../core';

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
      providers: [MockDataService],
      imports: [
        HttpClientTestingModule,
        BrowserAnimationsModule,
        AlertModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    TestBed.get(MockDataService);
    fixture = TestBed.createComponent(PortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
