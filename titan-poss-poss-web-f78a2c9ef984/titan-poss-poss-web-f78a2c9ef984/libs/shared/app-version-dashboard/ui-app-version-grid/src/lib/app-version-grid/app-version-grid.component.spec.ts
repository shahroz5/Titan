import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppVersionGridComponent } from './app-version-grid.component';

describe('AppVersionGridComponent', () => {
  let component: AppVersionGridComponent;
  let fixture: ComponentFixture<AppVersionGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppVersionGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppVersionGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
