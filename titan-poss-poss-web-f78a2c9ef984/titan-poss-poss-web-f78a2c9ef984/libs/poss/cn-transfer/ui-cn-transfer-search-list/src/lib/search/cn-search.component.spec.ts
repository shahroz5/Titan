import { async, ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CnSearchComponent } from './cn-search.component';

describe('CnSearchComponent', () => {
  let component: CnSearchComponent;
  let fixture: ComponentFixture<CnSearchComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CnSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CnSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
