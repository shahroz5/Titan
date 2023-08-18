import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StockReceiveBoutiqueComponent } from './stock-receive-boutique.component';

describe('StockReceiveBoutiqueComponent', () => {
  let component: StockReceiveBoutiqueComponent;
  let fixture: ComponentFixture<StockReceiveBoutiqueComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StockReceiveBoutiqueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockReceiveBoutiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
