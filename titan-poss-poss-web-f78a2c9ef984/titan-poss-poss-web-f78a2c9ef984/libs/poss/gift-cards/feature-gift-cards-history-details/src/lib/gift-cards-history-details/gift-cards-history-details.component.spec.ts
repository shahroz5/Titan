import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { GiftCardsHistoryDetailsComponent } from './gift-cards-history-details.component';

describe('GiftCardsHistoryDetailsComponent', () => {
  let component: GiftCardsHistoryDetailsComponent;
  let fixture: ComponentFixture<GiftCardsHistoryDetailsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [GiftCardsHistoryDetailsComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(GiftCardsHistoryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
