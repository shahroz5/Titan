import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockIssueMerchandiseComponent } from './stock-issue-merchandise.component';

describe('StockIssueMerchandiseComponent', () => {
  let component: StockIssueMerchandiseComponent;
  let fixture: ComponentFixture<StockIssueMerchandiseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockIssueMerchandiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockIssueMerchandiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
