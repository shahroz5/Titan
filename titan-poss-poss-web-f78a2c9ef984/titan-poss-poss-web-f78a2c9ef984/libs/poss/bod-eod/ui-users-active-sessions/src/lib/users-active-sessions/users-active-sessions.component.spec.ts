import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UsersActiveSessionsComponent } from './users-active-sessions.component';

describe('UsersActiveSessionsComponent', () => {
  let component: UsersActiveSessionsComponent;
  let fixture: ComponentFixture<UsersActiveSessionsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [UsersActiveSessionsComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersActiveSessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
