import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BtnMobileContactComponent} from './btn-mobile-contact.component';

describe('BtnMobileContactComponent', () => {
  let component: BtnMobileContactComponent;
  let fixture: ComponentFixture<BtnMobileContactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BtnMobileContactComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BtnMobileContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
