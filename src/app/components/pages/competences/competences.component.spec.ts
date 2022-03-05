import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MockComponent} from 'ng2-mock-component';
import {CompetencesComponent} from './competences.component';
import {MockDataService} from '../../services/mock-data.service';
import {MatExpansionModule} from '@angular/material';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {FormsModule} from '@angular/forms';
import {KnobModule} from 'primeng/knob';
import {AlertModule} from '../../core';

describe('CompetencesComponent', () => {
  let component: CompetencesComponent;
  let fixture: ComponentFixture<CompetencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatExpansionModule,
        HttpClientTestingModule,
        KnobModule,
        FormsModule,
        AlertModule
      ],
      declarations: [
        CompetencesComponent,
        MockComponent({selector: 'app-categorie'}),
        MockComponent({
          selector: 'app-experience-item',
          inputs: ['exp', 'index']
        }),
        MockComponent({
          selector: 'app-formation-item',
          inputs: ['form', 'index']
        }),
        MockComponent({
          selector: 'app-portfolio-item',
          inputs: ['siteDemo']
        })
      ],
      providers: [
        MockDataService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    TestBed.get(MockDataService);
    fixture = TestBed.createComponent(CompetencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
