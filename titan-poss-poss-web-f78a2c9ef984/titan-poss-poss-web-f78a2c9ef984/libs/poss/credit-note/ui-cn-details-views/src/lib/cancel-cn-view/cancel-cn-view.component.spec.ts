import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelCnViewComponent } from './cancel-cn-view.component';

describe('CancelCnViewComponent', () => {
  let component: CancelCnViewComponent;
  let fixture: ComponentFixture<CancelCnViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelCnViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelCnViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
