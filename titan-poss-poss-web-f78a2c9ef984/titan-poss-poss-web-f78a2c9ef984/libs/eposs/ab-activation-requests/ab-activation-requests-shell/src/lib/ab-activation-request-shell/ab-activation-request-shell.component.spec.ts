import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbActivationRequestShellComponent } from './ab-activation-request-shell.component';

describe('AbActivationRequestShellComponent', () => {
  let component: AbActivationRequestShellComponent;
  let fixture: ComponentFixture<AbActivationRequestShellComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AbActivationRequestShellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbActivationRequestShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
