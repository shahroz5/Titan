import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StockReceiveFactoryComponent } from './stock-receive-factory.component';

describe('StockReceiveFactoryComponent', () => {
  let component: StockReceiveFactoryComponent;
  let fixture: ComponentFixture<StockReceiveFactoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StockReceiveFactoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockReceiveFactoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
