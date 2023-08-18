import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockIssueBoutiquesComponent } from './stock-issue-boutiques.component';

describe('StockIssueBoutiquesComponent', () => {
  let component: StockIssueBoutiquesComponent;
  let fixture: ComponentFixture<StockIssueBoutiquesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockIssueBoutiquesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockIssueBoutiquesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
