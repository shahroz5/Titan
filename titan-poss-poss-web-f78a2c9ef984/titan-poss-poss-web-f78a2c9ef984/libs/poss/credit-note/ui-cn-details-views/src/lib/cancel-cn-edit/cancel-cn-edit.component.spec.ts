import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelCnEditComponent } from './cancel-cn-edit.component';

describe('CancelCnEditComponent', () => {
  let component: CancelCnEditComponent;
  let fixture: ComponentFixture<CancelCnEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CancelCnEditComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelCnEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
