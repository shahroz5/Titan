import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockIssueShellComponent } from './stock-issue-shell.component';

describe('StockIssueShellComponent', () => {
  let component: StockIssueShellComponent;
  let fixture: ComponentFixture<StockIssueShellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockIssueShellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockIssueShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
