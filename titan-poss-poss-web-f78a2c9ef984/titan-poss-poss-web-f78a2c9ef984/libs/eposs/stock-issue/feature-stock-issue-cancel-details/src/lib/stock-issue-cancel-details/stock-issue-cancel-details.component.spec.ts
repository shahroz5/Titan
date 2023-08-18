import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockIssueCancelDetailsComponent } from './stock-issue-cancel-details.component';

describe('StockIssueCancelDetailsComponent', () => {
  let component: StockIssueCancelDetailsComponent;
  let fixture: ComponentFixture<StockIssueCancelDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockIssueCancelDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockIssueCancelDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
