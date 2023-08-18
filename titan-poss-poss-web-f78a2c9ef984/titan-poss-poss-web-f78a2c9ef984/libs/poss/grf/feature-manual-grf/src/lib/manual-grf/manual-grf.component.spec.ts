import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualGrfComponent } from './manual-grf.component';

describe('ManualGrfComponent', () => {
  let component: ManualGrfComponent;
  let fixture: ComponentFixture<ManualGrfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManualGrfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualGrfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
