import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StockReceiveCfaComponent } from './stock-receive-cfa.component';

describe('StockReceiveCfaComponent', () => {
  let component: StockReceiveCfaComponent;
  let fixture: ComponentFixture<StockReceiveCfaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StockReceiveCfaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockReceiveCfaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
