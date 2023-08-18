import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockIssueHistoryComponent } from './stock-issue-history.component';

describe('StockIssueHistoryComponent', () => {
  let component: StockIssueHistoryComponent;
  let fixture: ComponentFixture<StockIssueHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockIssueHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockIssueHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
