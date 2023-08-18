import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockReceiveHistoryComponent } from './stock-receive-history.component';

describe('StockReceiveHistoryComponent', () => {
  let component: StockReceiveHistoryComponent;
  let fixture: ComponentFixture<StockReceiveHistoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StockReceiveHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockReceiveHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
