import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockReceiveMerchandiseComponent } from './stock-receive-merchandise.component';

describe('StockReceiveMerchandiseComponent', () => {
  let component: StockReceiveMerchandiseComponent;
  let fixture: ComponentFixture<StockReceiveMerchandiseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StockReceiveMerchandiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockReceiveMerchandiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
