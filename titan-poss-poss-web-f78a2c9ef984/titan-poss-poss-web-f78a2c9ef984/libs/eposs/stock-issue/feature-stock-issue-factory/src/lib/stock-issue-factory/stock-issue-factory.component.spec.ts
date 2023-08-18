import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockIssueFactoryComponent } from './stock-issue-factory.component';

describe('StockIssueFactoryComponent', () => {
  let component: StockIssueFactoryComponent;
  let fixture: ComponentFixture<StockIssueFactoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockIssueFactoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockIssueFactoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
