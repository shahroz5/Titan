import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockIssueCancelComponent } from './stock-issue-cancel.component';

describe('StockIssueCancelComponent', () => {
  let component: StockIssueCancelComponent;
  let fixture: ComponentFixture<StockIssueCancelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockIssueCancelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockIssueCancelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
