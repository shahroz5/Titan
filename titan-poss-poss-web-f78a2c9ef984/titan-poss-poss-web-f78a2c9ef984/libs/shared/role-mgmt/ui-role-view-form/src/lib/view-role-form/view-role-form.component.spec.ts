import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRoleFormComponent } from './view-role-form.component';

describe('ViewRoleFormComponent', () => {
  let component: ViewRoleFormComponent;
  let fixture: ComponentFixture<ViewRoleFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewRoleFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewRoleFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
