import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { GiftCardsHistoryItemListingComponent } from './gift-cards-history-item-listing.component';

describe('GiftCardsHistoryItemListingComponent', () => {
  let component: GiftCardsHistoryItemListingComponent;
  let fixture: ComponentFixture<GiftCardsHistoryItemListingComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [GiftCardsHistoryItemListingComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(GiftCardsHistoryItemListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
