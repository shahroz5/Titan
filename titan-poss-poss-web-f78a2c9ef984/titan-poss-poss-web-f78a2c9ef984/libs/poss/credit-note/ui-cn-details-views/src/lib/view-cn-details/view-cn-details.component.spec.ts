import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCnDetailsComponent } from './view-cn-details.component';

describe('ViewCnDetailsComponent', () => {
  let component: ViewCnDetailsComponent;
  let fixture: ComponentFixture<ViewCnDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCnDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCnDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
