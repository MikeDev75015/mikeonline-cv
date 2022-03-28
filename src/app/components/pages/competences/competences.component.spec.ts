import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MockComponent } from 'ng2-mock-component';
import { KnobModule } from 'primeng/knob';
import { dataServiceMock } from '../../../__mocks__/services/data-service.mock';
import { AlertModule } from '../../../core/core-index';
import { DataService } from '../../../shared/services/data/data.service';
import { UtilsService } from '../../../shared/shared-index';
import { CompetencesComponent } from './competences.component';

describe('CompetencesComponent', () => {
  let component: CompetencesComponent;
  let fixture: ComponentFixture<CompetencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatExpansionModule,
        HttpClientTestingModule,
        KnobModule,
        FormsModule,
        AlertModule,
      ],
      declarations: [
        CompetencesComponent,
        MockComponent({ selector: 'app-categorie' }),
        MockComponent({
          selector: 'app-experience-item',
          inputs: ['exp', 'index'],
        }),
        MockComponent({
          selector: 'app-formation-item',
          inputs: ['form', 'index'],
        }),
        MockComponent({
          selector: 'app-portfolio-item',
          inputs: ['siteDemo'],
        }),
        MockComponent({
          selector: 'app-page-layout',
          inputs: ['elementsNumber', 'isLoadingData'],
        }),
      ],
      providers: [
        { provide: DataService, useValue: dataServiceMock },
        { provide: UtilsService, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompetencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
