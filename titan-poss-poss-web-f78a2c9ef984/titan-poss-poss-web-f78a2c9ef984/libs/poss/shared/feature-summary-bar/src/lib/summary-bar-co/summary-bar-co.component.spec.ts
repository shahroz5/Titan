import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryBarCoComponent } from './summary-bar-co.component';

describe('SummaryBarCoComponent', () => {
  let component: SummaryBarCoComponent;
  let fixture: ComponentFixture<SummaryBarCoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SummaryBarCoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryBarCoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
